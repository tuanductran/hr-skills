/**
 * Deterministic Skill Planner — Phase 4.2
 *
 * The Skill Planner transforms user intent into an execution plan by:
 *  1. Analyzing user intent to extract requested capabilities
 *  2. Matching capabilities against the Skill Registry
 *  3. Selecting appropriate skills with clear rationale
 *  4. Ordering skills based on dependencies and logical flow
 *  5. Generating an explainable execution plan
 *
 * The planner is pure (no side effects, deterministic). It consumes only the
 * generated Skill Registry and produces a complete execution plan with
 * reasoning that future developers can understand.
 *
 * Key principle: The planner decides *what* to use and *why*, but does not
 * execute skills, invoke tools, or generate prompts — that belongs to the
 * Workflow Runtime (Phase 4.3).
 */

import type {
	CapabilityMatch,
	ExecutionPlan,
	ExecutionStep,
	Registry,
	RegistryEntry,
	SelectionReason,
} from './types.js';

// ============================================================================
// Execution Plan Model
// ============================================================================

// Planner types have been moved to src/types.ts to centralize shared
// interfaces and avoid duplication. See that file for the canonical
// definitions used across planner, validator, and tests.

// ============================================================================
// Intent Analysis
// ============================================================================

/**
 * Extract capabilities and key phrases from user intent.
 *
 * Uses simple heuristics to identify what the user is asking for:
 *  - Split by commas and "and"
 *  - Recognize patterns like "create", "write", "develop", "design", etc.
 *  - Normalize to lowercase
 *
 * This is intentionally simple and deterministic — not powered by ML.
 * Future extensions could replace this with semantic analysis if needed.
 */
export function analyzeIntent(intent: string): string[] {
	if (!intent || intent.trim().length === 0) {
		return [];
	}

	const normalized = intent.toLowerCase().trim();

	// Split on common delimiters
	const parts = normalized
		.split(/[,;]|(?:\s+(?:and|or|then)\s+)/i)
		.map((part) => part.trim())
		.filter(Boolean);

	// Remove common filler words
	const fillerWords = new Set([
		'a',
		'an',
		'the',
		'for',
		'with',
		'to',
		'in',
		'on',
		'at',
	]);
	const refined = parts.map((part) => {
		const words = part.split(/\s+/);
		return words.filter((w) => !fillerWords.has(w)).join(' ');
	});

	return refined.filter((c) => c.length > 0);
}

// ============================================================================
// Capability Matching
// ============================================================================

/**
 * Calculate similarity score between a requested capability and
 * a skill's declared capabilities.
 *
 * Uses simple token overlap (Jaccard similarity) for deterministic,
 * explainable matching.
 */
function calculateSimilarity(
	requestedCapability: string,
	skillCapability: string,
): number {
	const req = new Set(requestedCapability.toLowerCase().split(/\s+/));
	const skill = new Set(skillCapability.toLowerCase().split(/\s+/));

	if (req.size === 0 || skill.size === 0) return 0;

	const intersection = new Set([...req].filter((x) => skill.has(x)));
	const union = new Set([...req, ...skill]);

	return intersection.size / union.size;
}

/**
 * Match a user's requested capability against available skills.
 *
 * Returns matches ranked by score and classified by match type.
 */
function matchCapabilityAgainstRegistry(
	capability: string,
	registry: Registry,
): CapabilityMatch {
	const matches: CapabilityMatch['matches'] = [];

	for (const entry of registry.skills) {
		// Direct capability match — exact words in the skill's capabilities list
		const directMatches = entry.capabilities.filter(
			(skillCap) =>
				skillCap.toLowerCase().includes(capability.toLowerCase()) ||
				capability.toLowerCase().includes(skillCap.toLowerCase()),
		);

		if (directMatches.length > 0) {
			matches.push({
				skillId: entry.id,
				matchType: 'direct',
				score: 1.0,
				explanation: `Skill explicitly supports "${directMatches[0]}"`,
			});
			continue;
		}

		// Partial match — semantic similarity within skill's capabilities
		const partialScores = entry.capabilities.map((skillCap) =>
			calculateSimilarity(capability, skillCap),
		);
		const maxPartialScore = Math.max(...partialScores);

		if (maxPartialScore >= 0.2) {
			matches.push({
				skillId: entry.id,
				matchType: 'partial',
				score: maxPartialScore,
				explanation: `Skill's capabilities partially overlap with requested capability (score: ${maxPartialScore.toFixed(2)})`,
			});
		}

		// Related match — skill is in same domain as other matched skills
		// (this will be populated during ranking in the planner)
	}

	// Sort by score descending, then by skill ID for determinism
	matches.sort((a, b) => b.score - a.score || a.skillId.localeCompare(b.skillId));

	const result: CapabilityMatch = {
		capability,
		matches: matches.slice(0, 5), // Keep top 5 matches
		isMatched: matches.length > 0,
	};
	if (matches.length === 0) {
		// Only add the optional property when there's a real value — avoids
		// assigning `undefined` to an optional property (exactOptionalPropertyTypes).
		(result as CapabilityMatch & { unmatchedReason: string }).unmatchedReason =
			`No skills found that support "${capability}"`;
	}
	return result;
}

// ============================================================================
// Skill Selection & Ordering
// ============================================================================

/**
 * Topological sort for dependency ordering using Kahn's algorithm.
 *
 * Returns skills in an order where all dependencies are satisfied before
 * dependents are executed.
 */
function topologicalSort(skillIds: string[], registry: Registry): string[] {
	const remaining = new Set(skillIds);
	const result: string[] = [];

	// Build a map of ID -> skill for fast lookup
	const skillMap = new Map(registry.skills.map((s) => [s.id, s]));

	while (remaining.size > 0) {
		// Find a skill with no unsatisfied dependencies
		let found: string | undefined;

		for (const id of remaining) {
			const skill = skillMap.get(id);
			if (!skill) continue;

			const unmetDeps = skill.dependencies.filter((dep) => remaining.has(dep));
			if (unmetDeps.length === 0) {
				found = id;
				break;
			}
		}

		if (!found) {
			// Circular dependency detected — break by taking the first remaining
			// (this should have been caught by validation, but be defensive)
			found = Array.from(remaining)[0];
		}

		if (!found) {
			throw new Error('Topological sort failed: no skill found to select');
		}
		result.push(found);
		remaining.delete(found);
	}

	return result;
}

/**
 * Select skills based on matched capabilities.
 *
 * Returns a set of unique skills, avoiding duplicates but preserving
 * dependency relationships.
 */
function selectSkills(
	capabilityMatches: CapabilityMatch[],
	registry: Registry,
): Map<string, { skill: RegistryEntry; reason: SelectionReason }> {
	const selected = new Map<
		string,
		{ skill: RegistryEntry; reason: SelectionReason; rationale?: string }
	>();

	const skillMap = new Map(registry.skills.map((s) => [s.id, s]));

	// First pass: select skills for matched capabilities
	for (const match of capabilityMatches) {
		if (match.matches.length === 0) continue;

		const topMatch = match.matches[0];
		if (!topMatch) continue;
		const skill = skillMap.get(topMatch.skillId);
		if (!skill) continue;

		if (!selected.has(topMatch.skillId)) {
			selected.set(topMatch.skillId, {
				skill,
				reason:
					topMatch.matchType === 'direct'
						? 'direct-capability-match'
						: 'related-skill',
				rationale: topMatch.explanation,
			});
		}
	}

	// Second pass: add dependencies and related skills for better coverage
	const toProcess = Array.from(selected.keys());
	const processed = new Set<string>();

	while (toProcess.length > 0) {
		const skillId = toProcess.shift();
		if (!skillId || processed.has(skillId)) continue;
		processed.add(skillId);

		const skill = skillMap.get(skillId);
		if (!skill) continue;

		// Add dependencies
		for (const depId of skill.dependencies) {
			if (!selected.has(depId)) {
				const depSkill = skillMap.get(depId);
				if (depSkill) {
					selected.set(depId, {
						skill: depSkill,
						reason: 'dependency-requirement',
						rationale: `Required by ${skillId}`,
					});
					toProcess.push(depId);
				}
			}
		}

		// Add top related skill if not too crowded
		if (skill.relatedSkills.length > 0 && selected.size < 8) {
			const relatedId = skill.relatedSkills[0];
			// RelatedId may be undefined despite the length check in weird runtime
			// states; guard defensively without using non-null assertions.
			if (relatedId && !selected.has(relatedId)) {
				const relatedSkill = skillMap.get(relatedId);
				if (relatedSkill) {
					selected.set(relatedId, {
						skill: relatedSkill,
						reason: 'recommended-pairing',
						rationale: `Commonly used together with ${skillId}`,
					});
				}
			}
		}
	}

	return selected;
}

/**
 * Build execution steps from selected skills with proper ordering.
 */
function buildExecutionSteps(
	selected: Map<
		string,
		{ skill: RegistryEntry; reason: SelectionReason; rationale?: string }
	>,
	registry: Registry,
): ExecutionStep[] {
	const skillIds = Array.from(selected.keys());
	const ordered = topologicalSort(skillIds, registry);

	const skillMap = new Map(registry.skills.map((s) => [s.id, s]));

	return ordered.map((skillId, index) => {
		const entry = selected.get(skillId);
		if (!entry) throw new Error(`Selected skill ${skillId} not found`);

		const skill = skillMap.get(skillId);
		if (!skill) throw new Error(`Skill ${skillId} not in registry`);

		const step: ExecutionStep = {
			skillId,
			order: index,
			reason: entry.reason,
			dependencies: skill.dependencies.filter((dep) => skillIds.includes(dep)),
			// contextInputs deliberately omitted here — runtime supplies it.
		};

		if (entry.rationale !== undefined) {
			// Only add rationale when present to avoid assigning `undefined`.
			(step as ExecutionStep & { rationale: string }).rationale = entry.rationale;
		}

		return step;
	});
}

// ============================================================================
// Public Planner API
// ============================================================================

/**
 * Generate a complete execution plan for user intent using the Skill Registry.
 *
 * Pure function — no side effects, deterministic output for a given input
 * and registry state.
 */
export function generateExecutionPlan(intent: string, registry: Registry): ExecutionPlan {
	if (!intent || intent.trim().length === 0) {
		return {
			intent: '',
			requestedCapabilities: [],
			capabilityMatches: [],
			steps: [],
			summary: 'No intent provided.',
			complexity: 'simple',
			notes: ['Empty or blank intent.'],
		};
	}

	// Step 1: Analyze intent
	const requestedCapabilities = analyzeIntent(intent);

	if (requestedCapabilities.length === 0) {
		return {
			intent: intent.trim(),
			requestedCapabilities: [],
			capabilityMatches: [],
			steps: [],
			summary: 'Could not extract any capabilities from the provided intent.',
			complexity: 'simple',
			notes: ['Intent analysis yielded no matchable capabilities.'],
		};
	}

	// Step 2: Match capabilities against registry
	const capabilityMatches = requestedCapabilities.map((cap) =>
		matchCapabilityAgainstRegistry(cap, registry),
	);

	const matchedCount = capabilityMatches.filter((m) => m.isMatched).length;
	const totalRequested = requestedCapabilities.length;

	if (matchedCount === 0) {
		return {
			intent: intent.trim(),
			requestedCapabilities,
			capabilityMatches,
			steps: [],
			summary: `No skills found that support the requested capabilities: ${requestedCapabilities.join(', ')}`,
			complexity: 'simple',
			notes: ['No capabilities could be matched against the skill registry.'],
		};
	}

	// Step 3: Select skills
	const selected = selectSkills(capabilityMatches, registry);

	if (selected.size === 0) {
		return {
			intent: intent.trim(),
			requestedCapabilities,
			capabilityMatches,
			steps: [],
			summary:
				'Matched capabilities but could not select any skills for execution. This may indicate incomplete registry data.',
			complexity: 'simple',
			notes: ['Skills matched capabilities but selection failed.'],
		};
	}

	// Step 4: Build execution steps
	const steps = buildExecutionSteps(selected, registry);

	// Step 5: Determine complexity
	const complexity: ExecutionPlan['complexity'] =
		steps.length > 5 ? 'complex' : steps.length > 2 ? 'moderate' : 'simple';

	// Step 6: Generate summary
	const skillNames = steps.map((s) => s.skillId).join(', ');
	const matchCoverage =
		matchedCount === totalRequested
			? 'All requested capabilities are covered'
			: `${matchedCount} of ${totalRequested} requested capabilities are covered`;

	const summary =
		`Plan uses ${steps.length} skill${steps.length === 1 ? '' : 's'} to address user intent. ` +
		`${matchCoverage}. Skills: ${skillNames}`;

	// Step 7: Optional notes
	const notes: string[] = [];
	if (matchedCount < totalRequested) {
		const unmatched = capabilityMatches
			.filter((m) => !m.isMatched)
			.map((m) => m.capability);
		notes.push(`Could not match capabilities: ${unmatched.join(', ')}`);
	}
	if (steps.some((s) => s.dependencies.length > 0)) {
		notes.push(
			'Plan includes dependent skills that are required by other selections.',
		);
	}

	const planResult: ExecutionPlan = {
		intent: intent.trim(),
		requestedCapabilities,
		capabilityMatches,
		steps,
		summary,
		complexity,
	};
	if (notes.length > 0) {
		(planResult as ExecutionPlan & { notes: string[] }).notes = notes;
	}
	return planResult;
}
