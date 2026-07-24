/**
 * Planner validation — checks execution plans for soundness.
 *
 * Validates:
 *  - No circular skill dependencies
 *  - No dangling skill references
 *  - Capability coverage (at least one match per requested capability)
 *  - Execution order respects dependencies
 *  - No duplicate steps
 *
 * All validations are deterministic and produce clear, actionable diagnostics.
 */

import type {
	ExecutionPlan,
	PlanValidationIssue,
	PlanValidationResult,
	Registry,
} from './types.js';

/**
 * Validate an execution plan against the registry and detect common issues.
 */
export function validateExecutionPlan(
	plan: ExecutionPlan,
	registry: Registry,
): PlanValidationResult {
	const issues: PlanValidationIssue[] = [];
	const skillMap = new Map(registry.skills.map((s) => [s.id, s]));
	const stepSkillIds = new Set(plan.steps.map((s) => s.skillId));

	// =========================================================================
	// Check 1: No duplicate steps
	// =========================================================================
	const stepOrder = new Map<string, number>();
	for (const step of plan.steps) {
		if (stepOrder.has(step.skillId)) {
			issues.push({
				code: 'DUPLICATE_STEP',
				severity: 'error',
				message: `Skill "${step.skillId}" appears multiple times in execution plan`,
				context: { skillId: step.skillId },
			});
		}
		stepOrder.set(step.skillId, step.order);
	}

	// =========================================================================
	// Check 2: No dangling skill references
	// =========================================================================
	for (const step of plan.steps) {
		const skill = skillMap.get(step.skillId);
		if (!skill) {
			issues.push({
				code: 'DANGLING_SKILL_REFERENCE',
				severity: 'error',
				message: `Execution step references skill "${step.skillId}" which is not in the registry`,
				context: { skillId: step.skillId },
			});
		}

		// Check dependencies reference valid skills
		for (const depId of step.dependencies) {
			if (!stepSkillIds.has(depId)) {
				issues.push({
					code: 'MISSING_DEPENDENCY',
					severity: 'error',
					message: `Skill "${step.skillId}" depends on "${depId}" but it is not in the execution plan`,
					context: { skillId: step.skillId, dependency: depId },
				});
			}
		}
	}

	// =========================================================================
	// Check 3: Execution order respects dependencies
	// =========================================================================
	for (const step of plan.steps) {
		for (const depId of step.dependencies) {
			const depStep = plan.steps.find((s) => s.skillId === depId);
			if (depStep && depStep.order >= step.order) {
				issues.push({
					code: 'DEPENDENCY_ORDER_VIOLATION',
					severity: 'error',
					message: `Skill "${step.skillId}" (order ${step.order}) depends on "${depId}" (order ${depStep.order}), but dependencies must execute first`,
					context: {
						skillId: step.skillId,
						skillOrder: step.order,
						dependency: depId,
						depOrder: depStep.order,
					},
				});
			}
		}
	}

	// =========================================================================
	// Check 4: No circular dependencies among selected skills
	// =========================================================================
	const hasCircularDep = detectCircularDependencies(Array.from(stepSkillIds), registry);
	if (hasCircularDep.isCircular) {
		issues.push({
			code: 'CIRCULAR_DEPENDENCY',
			severity: 'error',
			message: `Execution plan contains circular skill dependencies: ${hasCircularDep.cycle?.join(' -> ')}`,
			context: { cycle: hasCircularDep.cycle },
		});
	}

	// =========================================================================
	// Check 5: Capability coverage warnings
	// =========================================================================
	const unmatchedCaps = plan.capabilityMatches
		.filter((m) => !m.isMatched)
		.map((m) => m.capability);

	if (unmatchedCaps.length > 0) {
		issues.push({
			code: 'UNMATCHED_CAPABILITIES',
			severity: 'warning',
			message: `${unmatchedCaps.length} requested capability(ies) could not be matched: ${unmatchedCaps.join(', ')}`,
			context: { unmatchedCapabilities: unmatchedCaps },
		});
	}

	// =========================================================================
	// Check 6: Empty plan warning
	// =========================================================================
	if (plan.steps.length === 0) {
		issues.push({
			code: 'EMPTY_PLAN',
			severity: 'warning',
			message: 'Execution plan contains no steps',
		});
	}

	// =========================================================================
	// Check 7: Order field consistency
	// =========================================================================
	const orderValues = plan.steps.map((s) => s.order).sort((a, b) => a - b);
	const expectedOrder = Array.from({ length: orderValues.length }, (_, i) => i);
	if (JSON.stringify(orderValues) !== JSON.stringify(expectedOrder)) {
		issues.push({
			code: 'ORDER_FIELD_INCONSISTENT',
			severity: 'error',
			message: `Execution step order fields are inconsistent. Expected [0..${plan.steps.length - 1}], got [${orderValues.join(', ')}]`,
			context: { expectedOrder, actualOrder: orderValues },
		});
	}

	return {
		isValid: issues.filter((i) => i.severity === 'error').length === 0,
		issues,
	};
}

/**
 * Detect circular dependencies using depth-first search.
 *
 * Returns an object indicating whether a cycle was found, and if so, the
 * cycle path.
 */
function detectCircularDependencies(
	skillIds: string[],
	registry: Registry,
): { isCircular: boolean; cycle?: string[] } {
	const skillMap = new Map(registry.skills.map((s) => [s.id, s]));

	for (const startId of skillIds) {
		const visited = new Set<string>();
		const path: string[] = [];

		if (hasCycleDFS(startId, visited, path, skillMap, skillIds)) {
			return { isCircular: true, cycle: path };
		}
	}

	return { isCircular: false };
}

/**
 * Depth-first search helper for cycle detection.
 */
function hasCycleDFS(
	skillId: string,
	visited: Set<string>,
	path: string[],
	skillMap: Map<string, { id: string; dependencies: string[] }>,
	scopeSkillIds: string[],
): boolean {
	if (!scopeSkillIds.includes(skillId)) {
		return false;
	}

	if (visited.has(skillId)) {
		// Found cycle if this node is already in current path
		if (path.includes(skillId)) {
			const cycleStart = path.indexOf(skillId);
			path.splice(cycleStart);
			path.push(skillId); // Close the cycle
			return true;
		}
		return false;
	}

	visited.add(skillId);
	path.push(skillId);

	const skill = skillMap.get(skillId);
	if (skill) {
		for (const depId of skill.dependencies) {
			if (hasCycleDFS(depId, visited, path, skillMap, scopeSkillIds)) {
				return true;
			}
		}
	}

	path.pop();
	return false;
}

/**
 * Suggest improvements to an execution plan.
 *
 * Non-binding suggestions for better organization or coverage.
 */
export function suggestPlanImprovements(
	plan: ExecutionPlan,
	_registry: Registry,
): string[] {
	const suggestions: string[] = [];

	if (plan.steps.length === 0) {
		suggestions.push(
			'Plan is empty — consider requesting capabilities that the registry can support.',
		);
	}

	if (plan.steps.length === 1) {
		const firstStep = plan.steps[0];
		if (firstStep) {
			suggestions.push(
				`Only one skill selected. Consider whether related skills from the "${firstStep.skillId}" domain might help achieve the goal more completely.`,
			);
		}
	}

	if (plan.complexity === 'complex' && plan.steps.length > 8) {
		suggestions.push(
			`Plan is complex (${plan.steps.length} skills). Consider breaking the request into simpler, sequential sub-requests to improve maintainability.`,
		);
	}

	const unmatchedCaps = plan.capabilityMatches.filter((m) => !m.isMatched);
	if (
		unmatchedCaps.length > 0 &&
		unmatchedCaps.length < plan.requestedCapabilities.length
	) {
		const matched = plan.capabilityMatches
			.filter((m) => m.isMatched && m.matches.length > 0)
			.map((m) => m.matches[0]?.skillId);
		const uniqueMatched = new Set(matched);

		if (uniqueMatched.size === 1) {
			suggestions.push(
				`All matched capabilities use the same skill. The unmatched capabilities may require a more specific intent or a skill not yet in the registry.`,
			);
		}
	}

	if (plan.steps.some((s) => !s.dependencies || s.dependencies.length === 0)) {
		const independentCount = plan.steps.filter(
			(s) => !s.dependencies || s.dependencies.length === 0,
		).length;
		if (independentCount > 1 && plan.steps.length > 1) {
			suggestions.push(
				`${independentCount} independent skills could potentially be parallelized in a real workflow runtime, but are listed sequentially here for clarity.`,
			);
		}
	}

	return suggestions;
}
