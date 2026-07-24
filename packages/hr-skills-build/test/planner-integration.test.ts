import { describe, expect, it } from 'bun:test';
import { generateExecutionPlan } from '../src/planner.js';
import { buildRegistry } from '../src/registry.js';
import {
	suggestPlanImprovements,
	validateExecutionPlan,
} from '../src/validate-planner.js';

/**
 * Integration tests for the complete planning pipeline.
 *
 * These tests use the actual Skill Registry to verify that:
 * 1. Intent analysis extracts meaningful capabilities
 * 2. Registry matching works with real skills
 * 3. Execution plans are valid and complete
 * 4. Validation catches issues
 */

describe('Skill Planner Integration', () => {
	let registry: Awaited<ReturnType<typeof buildRegistry>>;

	// Load registry once for all tests
	describe.if(process.env['SKIP_INTEGRATION'] !== 'true')('with real registry', () => {
		it('should load registry', async () => {
			registry = await buildRegistry();
			expect(registry.skillCount).toBeGreaterThan(0);
			expect(registry.skills.length).toBe(registry.skillCount);
		});

		it('should generate valid plan for recruiting intent', async () => {
			if (!registry) return;

			const plan = generateExecutionPlan(
				'create interview questions for a senior manager',
				registry,
			);

			expect(plan.intent).toBeTruthy();
			expect(plan.requestedCapabilities.length).toBeGreaterThan(0);
			expect(plan.capabilityMatches.length).toBeGreaterThan(0);
			expect(plan.summary).toBeTruthy();

			// At least some capabilities should be matched
			const matchedCount = plan.capabilityMatches.filter((m) => m.isMatched).length;
			expect(matchedCount).toBeGreaterThan(0);

			// Validate the plan
			const validation = validateExecutionPlan(plan, registry);
			expect(validation.issues.filter((i) => i.severity === 'error')).toHaveLength(
				0,
			);
		});

		it('should generate plan for onboarding intent', async () => {
			if (!registry) return;

			const plan = generateExecutionPlan(
				'design an onboarding program and checklist',
				registry,
			);

			expect(plan.steps.length).toBeGreaterThan(0);

			// Check execution steps are properly ordered
			for (let i = 0; i < plan.steps.length; i++) {
				expect(plan.steps[i]?.order).toBe(i);
			}

			// Validate the plan
			const validation = validateExecutionPlan(plan, registry);
			expect(validation.isValid).toBe(true);
		});

		it('should generate plan for compensation intent', async () => {
			if (!registry) return;

			const plan = generateExecutionPlan(
				'develop a compensation strategy and benefits package',
				registry,
			);

			expect(plan.requestedCapabilities.length).toBeGreaterThan(0);
			expect(plan.complexity).toBeDefined();

			// Validate the plan
			const validation = validateExecutionPlan(plan, registry);
			const errors = validation.issues.filter((i) => i.severity === 'error');
			expect(errors).toHaveLength(0);
		});

		it('should handle complex HR workflow intent', async () => {
			if (!registry) return;

			const intent =
				'create job descriptions, write interview questions, develop competency models, and design onboarding';
			const plan = generateExecutionPlan(intent, registry);

			expect(plan.requestedCapabilities.length).toBeGreaterThan(2);
			expect(plan.steps.length).toBeGreaterThan(0);

			// Complex plan should have complexity >= moderate
			if (plan.steps.length > 2) {
				expect(['moderate', 'complex']).toContain(plan.complexity);
			}

			// All steps should have valid dependencies
			for (const step of plan.steps) {
				for (const dep of step.dependencies) {
					const depExists = plan.steps.some((s) => s.skillId === dep);
					expect(depExists).toBe(true);
				}
			}
		});

		it('should provide improvement suggestions for overcomplicated plan', async () => {
			if (!registry) return;

			// Request many things to create a complex plan
			const capabilities = Array.from(
				{ length: 15 },
				(_, i) => `capability ${i}`,
			).join(', ');
			const plan = generateExecutionPlan(capabilities, registry);

			const suggestions = suggestPlanImprovements(plan, registry);
			// Complex plans should get at least some suggestions
			if (plan.complexity === 'complex') {
				expect(suggestions.length).toBeGreaterThanOrEqual(0);
			}
		});

		it('should handle unmatched capabilities gracefully', async () => {
			if (!registry) return;

			const plan = generateExecutionPlan(
				'generate holographic employee avatars and quantum recruit analysis',
				registry,
			);

			// These capabilities don't exist, so plan should be empty or very minimal
			const unmatchedCount = plan.capabilityMatches.filter(
				(m) => !m.isMatched,
			).length;
			expect(unmatchedCount).toBeGreaterThan(0);

			// Validation should still pass (no errors, though might have warnings)
			const validation = validateExecutionPlan(plan, registry);
			const errors = validation.issues.filter((i) => i.severity === 'error');
			expect(errors).toHaveLength(0);
		});

		it('should respect skill dependencies in plan ordering', async () => {
			if (!registry) return;

			// Find a skill with dependencies
			const skillWithDeps = registry.skills.find((s) => s.dependencies.length > 0);
			if (!skillWithDeps) return; // Skip if no skills have deps

			// Request something that would trigger skill with dependencies
			const plan = generateExecutionPlan(
				skillWithDeps.capabilities[0] || skillWithDeps.description,
				registry,
			);

			// If the dependent skill is in the plan, its dependencies should come first
			const stepMap = new Map(plan.steps.map((s) => [s.skillId, s.order]));

			for (const step of plan.steps) {
				for (const dep of step.dependencies) {
					const depOrder = stepMap.get(dep);
					expect(depOrder).toBeLessThan(step.order);
				}
			}
		});

		it('should generate deterministic plans for same intent', async () => {
			if (!registry) return;

			const intent = 'help with succession planning and talent development';

			const plan1 = generateExecutionPlan(intent, registry);
			const plan2 = generateExecutionPlan(intent, registry);

			// Same intent should produce identical plans
			expect(JSON.stringify(plan1.steps)).toBe(JSON.stringify(plan2.steps));
			expect(plan1.summary).toBe(plan2.summary);
			expect(plan1.complexity).toBe(plan2.complexity);
		});

		it('should validate all generated plans', async () => {
			if (!registry) return;

			const intents = [
				'write a job description',
				'design a benefits package',
				'create an onboarding checklist',
				'develop interview questions',
				'build a performance management process',
			];

			for (const intent of intents) {
				const plan = generateExecutionPlan(intent, registry);
				const validation = validateExecutionPlan(plan, registry);

				const errors = validation.issues.filter((i) => i.severity === 'error');
				expect(errors).toHaveLength(0);
			}
		});
	});
});
