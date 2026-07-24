import { describe, expect, it } from 'bun:test';

import { analyzeIntent, generateExecutionPlan } from '../src/planner.js';
import type { ExecutionPlan, Registry, RegistryEntry } from '../src/types.js';
import {
	suggestPlanImprovements,
	validateExecutionPlan,
} from '../src/validate-planner.js';

// ============================================================================
// Test Fixtures
// ============================================================================

const createMockSkill = (overrides: Partial<RegistryEntry> = {}): RegistryEntry => ({
	id: 'hr-test-skill',
	name: 'hr-test-skill',
	version: '1.0.0',
	description: 'A test skill',
	tier: 'full',
	domain: 'onboarding-offboarding',
	tags: [],
	aliases: ['test-skill'],
	capabilities: ['Testing basic capabilities'],
	triggerPhrases: ['test this skill'],
	paths: { content: true, prompts: true, examples: true },
	dependencies: [],
	relatedSkills: [],
	...overrides,
});

const createMockRegistry = (skills: RegistryEntry[] = []): Registry => ({
	schemaVersion: 1,
	generatedAt: '2026-07-23',
	skillCount: skills.length,
	skills,
});

// ============================================================================
// Intent Analysis Tests
// ============================================================================

describe('analyzeIntent', () => {
	it('should extract single capability', () => {
		const result = analyzeIntent('create an onboarding plan');
		expect(result).toContain('create onboarding plan');
	});

	it('should extract multiple capabilities separated by commas', () => {
		const result = analyzeIntent('create interview questions, write offer letters');
		expect(result.length).toBe(2);
		expect(result).toContain('create interview questions');
		expect(result).toContain('write offer letters');
	});

	it('should extract capabilities separated by "and"', () => {
		const result = analyzeIntent(
			'develop succession planning and talent development',
		);
		expect(result.length).toBeGreaterThanOrEqual(1);
	});

	it('should normalize to lowercase', () => {
		const result = analyzeIntent('CREATE ONBOARDING PLAN');
		const first = result[0];
		expect(first).toBeDefined();
		expect(first).toBe(first?.toLowerCase());
	});

	it('should handle empty intent', () => {
		expect(analyzeIntent('')).toEqual([]);
		expect(analyzeIntent('   ')).toEqual([]);
	});

	it('should filter out filler words', () => {
		const result = analyzeIntent('create an onboarding plan for the company');
		const joined = result.join(' ');
		expect(joined).not.toContain('an');
		expect(joined).not.toContain('the');
		expect(joined).not.toContain('for');
	});
});

// ============================================================================
// Execution Plan Generation Tests
// ============================================================================

describe('generateExecutionPlan', () => {
	it('should handle empty intent', () => {
		const registry = createMockRegistry();
		const plan = generateExecutionPlan('', registry);

		expect(plan.intent).toBe('');
		expect(plan.requestedCapabilities).toHaveLength(0);
		expect(plan.steps).toHaveLength(0);
		expect(plan.summary).toContain('No intent');
	});

	it('should generate plan with matching capability', () => {
		const skill = createMockSkill({
			id: 'hr-onboarding',
			capabilities: ['Creating onboarding plans'],
		});
		const registry = createMockRegistry([skill]);

		const plan = generateExecutionPlan('create an onboarding plan', registry);

		expect(plan.requestedCapabilities.length).toBeGreaterThan(0);
		expect(plan.steps.length).toBeGreaterThan(0);
		expect(plan.steps[0]?.skillId).toBe('hr-onboarding');
	});

	it('should mark unmatched capabilities', () => {
		const registry = createMockRegistry([]);
		const plan = generateExecutionPlan('create an onboarding plan', registry);

		expect(plan.capabilityMatches.length).toBeGreaterThan(0);
		const allUnmatched = plan.capabilityMatches.every((m) => !m.isMatched);
		expect(allUnmatched).toBe(true);
	});

	it('should determine complexity based on step count', () => {
		const skill = createMockSkill({ id: 'hr-onboarding' });
		const registry = createMockRegistry([skill]);
		const plan = generateExecutionPlan('create an onboarding plan', registry);

		if (plan.steps.length <= 2) {
			expect(plan.complexity).toBe('simple');
		}
	});

	it('should include dependencies in steps', () => {
		const dependent = createMockSkill({
			id: 'hr-recruiting',
			capabilities: ['Recruiting'],
		});
		const dependency = createMockSkill({
			id: 'hr-job-description',
			capabilities: ['Job descriptions'],
		});

		const tech = createMockSkill({
			id: 'hr-backend',
			domain: 'technical-hiring',
			capabilities: ['Backend recruiting'],
			dependencies: ['hr-recruiting'],
		});

		const registry = createMockRegistry([dependent, dependency, tech]);
		const plan = generateExecutionPlan('recruit a backend engineer', registry);

		// If backend skill is selected, recruiting should also be included
		const skillIds = new Set(plan.steps.map((s) => s.skillId));
		if (skillIds.has('hr-backend')) {
			expect(skillIds.has('hr-recruiting')).toBe(true);
		}
	});

	it('should set proper order fields', () => {
		const skill = createMockSkill({ id: 'hr-test' });
		const registry = createMockRegistry([skill]);
		const plan = generateExecutionPlan('test this', registry);

		if (plan.steps.length > 0) {
			for (let i = 0; i < plan.steps.length; i++) {
				expect(plan.steps[i]?.order).toBe(i);
			}
		}
	});
});

// ============================================================================
// Plan Validation Tests
// ============================================================================

describe('validateExecutionPlan', () => {
	it('should validate a correct plan', () => {
		const skill = createMockSkill({ id: 'hr-onboarding' });
		const registry = createMockRegistry([skill]);
		const plan: ExecutionPlan = {
			intent: 'create onboarding',
			requestedCapabilities: ['create onboarding'],
			capabilityMatches: [
				{
					capability: 'create onboarding',
					matches: [
						{
							skillId: 'hr-onboarding',
							matchType: 'direct',
							score: 1.0,
							explanation: 'Direct match',
						},
					],
					isMatched: true,
				},
			],
			steps: [
				{
					skillId: 'hr-onboarding',
					order: 0,
					reason: 'direct-capability-match',
					dependencies: [],
				},
			],
			summary: 'Valid plan',
			complexity: 'simple',
		};

		const result = validateExecutionPlan(plan, registry);
		const errors = result.issues.filter((i) => i.severity === 'error');
		expect(errors).toHaveLength(0);
	});

	it('should detect duplicate steps', () => {
		const skill = createMockSkill({ id: 'hr-test' });
		const registry = createMockRegistry([skill]);
		const plan: ExecutionPlan = {
			intent: 'test',
			requestedCapabilities: [],
			capabilityMatches: [],
			steps: [
				{
					skillId: 'hr-test',
					order: 0,
					reason: 'direct-capability-match',
					dependencies: [],
				},
				{
					skillId: 'hr-test',
					order: 1,
					reason: 'direct-capability-match',
					dependencies: [],
				},
			],
			summary: 'Duplicate plan',
			complexity: 'simple',
		};

		const result = validateExecutionPlan(plan, registry);
		const duplicateIssues = result.issues.filter((i) => i.code === 'DUPLICATE_STEP');
		expect(duplicateIssues.length).toBeGreaterThan(0);
	});

	it('should detect dangling skill references', () => {
		const registry = createMockRegistry([]);
		const plan: ExecutionPlan = {
			intent: 'test',
			requestedCapabilities: [],
			capabilityMatches: [],
			steps: [
				{
					skillId: 'hr-nonexistent',
					order: 0,
					reason: 'direct-capability-match',
					dependencies: [],
				},
			],
			summary: 'Invalid plan',
			complexity: 'simple',
		};

		const result = validateExecutionPlan(plan, registry);
		const danglingIssues = result.issues.filter(
			(i) => i.code === 'DANGLING_SKILL_REFERENCE',
		);
		expect(danglingIssues.length).toBeGreaterThan(0);
	});

	it('should detect dependency order violations', () => {
		const skill1 = createMockSkill({ id: 'hr-skill1' });
		const skill2 = createMockSkill({
			id: 'hr-skill2',
			dependencies: ['hr-skill1'],
		});
		const registry = createMockRegistry([skill1, skill2]);

		const plan: ExecutionPlan = {
			intent: 'test',
			requestedCapabilities: [],
			capabilityMatches: [],
			steps: [
				// skill2 (depends on skill1) comes before skill1
				{
					skillId: 'hr-skill2',
					order: 0,
					reason: 'direct-capability-match',
					dependencies: ['hr-skill1'],
				},
				{
					skillId: 'hr-skill1',
					order: 1,
					reason: 'direct-capability-match',
					dependencies: [],
				},
			],
			summary: 'Order violation',
			complexity: 'simple',
		};

		const result = validateExecutionPlan(plan, registry);
		const orderIssues = result.issues.filter(
			(i) => i.code === 'DEPENDENCY_ORDER_VIOLATION',
		);
		expect(orderIssues.length).toBeGreaterThan(0);
	});

	it('should warn on empty plan', () => {
		const registry = createMockRegistry([]);
		const plan: ExecutionPlan = {
			intent: 'test',
			requestedCapabilities: [],
			capabilityMatches: [],
			steps: [],
			summary: 'Empty plan',
			complexity: 'simple',
		};

		const result = validateExecutionPlan(plan, registry);
		const emptyIssues = result.issues.filter((i) => i.code === 'EMPTY_PLAN');
		expect(emptyIssues.length).toBeGreaterThan(0);
	});
});

// ============================================================================
// Planner Improvements Tests
// ============================================================================

describe('suggestPlanImprovements', () => {
	it('should suggest on empty plan', () => {
		const registry = createMockRegistry([]);
		const plan: ExecutionPlan = {
			intent: 'test',
			requestedCapabilities: [],
			capabilityMatches: [],
			steps: [],
			summary: 'Empty',
			complexity: 'simple',
		};

		const suggestions = suggestPlanImprovements(plan, registry);
		expect(suggestions.length).toBeGreaterThan(0);
	});

	it('should suggest on complex plan', () => {
		const skills = Array.from({ length: 10 }).map((_, i) =>
			createMockSkill({ id: `hr-skill-${i}` }),
		);
		const registry = createMockRegistry(skills);

		const plan: ExecutionPlan = {
			intent: 'complex request',
			requestedCapabilities: Array.from(
				{ length: 10 },
				(_, i) => `capability-${i}`,
			),
			capabilityMatches: Array.from({ length: 10 }, (_, i) => ({
				capability: `capability-${i}`,
				matches: [
					{
						skillId: `hr-skill-${i}`,
						matchType: 'direct',
						score: 1.0,
						explanation: 'Match',
					},
				],
				isMatched: true,
			})),
			steps: Array.from({ length: 10 }, (_, i) => ({
				skillId: `hr-skill-${i}`,
				order: i,
				reason: 'direct-capability-match' as const,
				dependencies: [],
			})),
			summary: 'Complex plan',
			complexity: 'complex',
		};

		const suggestions = suggestPlanImprovements(plan, registry);
		const complexSuggestions = suggestions.filter((s) => s.includes('complex'));
		expect(complexSuggestions.length).toBeGreaterThan(0);
	});
});
