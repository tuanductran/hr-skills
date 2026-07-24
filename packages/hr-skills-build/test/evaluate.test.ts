import { describe, expect, it } from 'bun:test';

import { computeQualityMetrics, diffAgainstGolden, runCase } from '../src/evaluate.js';
import type {
	EvaluationCase,
	EvaluationCaseResult,
	GoldenCaseResult,
	Registry,
	RegistryEntry,
} from '../src/types.js';

// ============================================================================
// Test fixtures
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
	generatedAt: '2026-07-24',
	skillCount: skills.length,
	skills,
});

function makeGoldenResult(overrides: Partial<GoldenCaseResult> = {}): GoldenCaseResult {
	return {
		caseId: 'case-1',
		skillIds: ['hr-a', 'hr-b'],
		matchedCapabilities: 1,
		totalCapabilities: 1,
		planIsValid: true,
		workflowStatus: 'completed',
		...overrides,
	};
}

function makeCaseResult(
	overrides: Partial<EvaluationCaseResult> = {},
): EvaluationCaseResult {
	const actual = makeGoldenResult();
	return {
		caseId: actual.caseId,
		category: 'test',
		intent: 'test intent',
		actual,
		regressions: [],
		...overrides,
	};
}

// ============================================================================
// runCase
// ============================================================================

describe('runCase', () => {
	it('produces a deterministic golden-shaped result for a matched intent', async () => {
		const registry = createMockRegistry([
			createMockSkill({
				id: 'hr-onboarding',
				name: 'hr-onboarding',
				capabilities: ['Create onboarding checklist'],
				triggerPhrases: ['design an onboarding program and checklist'],
			}),
		]);

		const evalCase: EvaluationCase = {
			id: 'onboarding-case',
			description: 'test',
			intent: 'design an onboarding program and checklist',
			category: 'onboarding-offboarding',
		};

		const result = await runCase(evalCase, registry);

		expect(result.caseId).toBe('onboarding-case');
		expect(Array.isArray(result.skillIds)).toBe(true);
		expect(typeof result.matchedCapabilities).toBe('number');
		expect(typeof result.totalCapabilities).toBe('number');
		expect(typeof result.planIsValid).toBe('boolean');
		expect(['completed', 'failed']).toContain(result.workflowStatus);
	});

	it('is deterministic across repeated runs against the same registry', async () => {
		const registry = createMockRegistry([
			createMockSkill({
				id: 'hr-recruiting',
				name: 'hr-recruiting',
				capabilities: ['Create interview questions'],
				triggerPhrases: ['create interview questions for a senior manager'],
			}),
		]);

		const evalCase: EvaluationCase = {
			id: 'recruiting-case',
			description: 'test',
			intent: 'create interview questions for a senior manager',
			category: 'recruiting',
		};

		const first = await runCase(evalCase, registry);
		const second = await runCase(evalCase, registry);

		expect(first).toEqual(second);
	});

	it('reports an empty, valid, completed result for an unmatched intent', async () => {
		const registry = createMockRegistry([createMockSkill()]);

		const evalCase: EvaluationCase = {
			id: 'unmatched-case',
			description: 'test',
			intent: 'xyzzy plugh quux',
			category: 'unmatched',
		};

		const result = await runCase(evalCase, registry);

		expect(result.skillIds).toEqual([]);
		expect(result.workflowStatus).toBe('completed');
	});
});

// ============================================================================
// diffAgainstGolden
// ============================================================================

describe('diffAgainstGolden', () => {
	it('returns no regressions when there is no golden fixture yet', () => {
		const actual = makeGoldenResult();
		expect(diffAgainstGolden(actual, undefined)).toEqual([]);
	});

	it('returns no regressions when actual matches golden exactly', () => {
		const actual = makeGoldenResult();
		const golden = makeGoldenResult();
		expect(diffAgainstGolden(actual, golden)).toEqual([]);
	});

	it('flags a skillIds regression on selection change', () => {
		const actual = makeGoldenResult({ skillIds: ['hr-a', 'hr-c'] });
		const golden = makeGoldenResult({ skillIds: ['hr-a', 'hr-b'] });
		expect(diffAgainstGolden(actual, golden)).toContain('skillIds');
	});

	it('flags a skillIds regression on order change alone', () => {
		const actual = makeGoldenResult({ skillIds: ['hr-b', 'hr-a'] });
		const golden = makeGoldenResult({ skillIds: ['hr-a', 'hr-b'] });
		expect(diffAgainstGolden(actual, golden)).toContain('skillIds');
	});

	it('flags each differing field independently', () => {
		const actual = makeGoldenResult({
			matchedCapabilities: 0,
			planIsValid: false,
			workflowStatus: 'failed',
		});
		const golden = makeGoldenResult();
		const regressions = diffAgainstGolden(actual, golden);

		expect(regressions).toContain('matchedCapabilities');
		expect(regressions).toContain('planIsValid');
		expect(regressions).toContain('workflowStatus');
	});
});

// ============================================================================
// computeQualityMetrics
// ============================================================================

describe('computeQualityMetrics', () => {
	it('scores a perfect run as all 1.0', () => {
		const results = [makeCaseResult(), makeCaseResult({ caseId: 'case-2' })];
		const metrics = computeQualityMetrics(results);

		expect(metrics.capabilityMatchingAccuracy).toBe(1);
		expect(metrics.skillSelectionAccuracy).toBe(1);
		expect(metrics.executionOrderingAccuracy).toBe(1);
		expect(metrics.dependencyCorrectness).toBe(1);
		expect(metrics.workflowSuccessRate).toBe(1);
	});

	it('returns 1.0 for an empty result set (vacuously satisfied)', () => {
		const metrics = computeQualityMetrics([]);

		expect(metrics.capabilityMatchingAccuracy).toBe(1);
		expect(metrics.skillSelectionAccuracy).toBe(1);
		expect(metrics.executionOrderingAccuracy).toBe(1);
		expect(metrics.dependencyCorrectness).toBe(1);
		expect(metrics.workflowSuccessRate).toBe(1);
	});

	it('lowers dependencyCorrectness and workflowSuccessRate on a failing case', () => {
		const failing = makeCaseResult({
			caseId: 'case-fail',
			actual: makeGoldenResult({
				caseId: 'case-fail',
				planIsValid: false,
				workflowStatus: 'failed',
			}),
		});
		const passing = makeCaseResult({ caseId: 'case-pass' });

		const metrics = computeQualityMetrics([failing, passing]);

		expect(metrics.dependencyCorrectness).toBe(0.5);
		expect(metrics.workflowSuccessRate).toBe(0.5);
	});

	it('lowers capabilityMatchingAccuracy when capabilities go unmatched', () => {
		const results = [
			makeCaseResult({
				actual: makeGoldenResult({
					matchedCapabilities: 1,
					totalCapabilities: 2,
				}),
			}),
		];

		const metrics = computeQualityMetrics(results);
		expect(metrics.capabilityMatchingAccuracy).toBe(0.5);
	});

	it('lowers skillSelectionAccuracy on a skill-set regression', () => {
		const regressed = makeCaseResult({
			caseId: 'case-regressed',
			golden: makeGoldenResult({ skillIds: ['hr-a', 'hr-b'] }),
			actual: makeGoldenResult({ skillIds: ['hr-a', 'hr-c'] }),
			regressions: ['skillIds'],
		});
		const clean = makeCaseResult({ caseId: 'case-clean' });

		const metrics = computeQualityMetrics([regressed, clean]);

		expect(metrics.skillSelectionAccuracy).toBe(0.5);
	});

	it('lowers executionOrderingAccuracy when the skill set matches but order differs', () => {
		const reordered = makeCaseResult({
			caseId: 'case-reordered',
			golden: makeGoldenResult({ skillIds: ['hr-a', 'hr-b'] }),
			actual: makeGoldenResult({ skillIds: ['hr-b', 'hr-a'] }),
			regressions: ['skillIds'],
		});
		const clean = makeCaseResult({ caseId: 'case-clean' });

		const metrics = computeQualityMetrics([reordered, clean]);

		expect(metrics.executionOrderingAccuracy).toBe(0.5);
	});
});
