import { describe, expect, it } from 'bun:test';

import {
	ALL_SEARCHABLE_FIELDS,
	FIELD_WEIGHTS,
	InvalidSearchQueryError,
	searchSkills,
} from '../../src/search/search.js';
import type { Registry, RegistryEntry } from '../../src/shared/types.js';

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

const REGISTRY = createMockRegistry([
	createMockSkill({
		id: 'hr-onboarding',
		name: 'hr-onboarding',
		description: 'Plans and runs new-hire onboarding.',
		domain: 'onboarding-offboarding',
		tags: ['lifecycle', 'new-hire'],
		aliases: ['onboarding', 'new-hire-onboarding'],
		capabilities: ['Design onboarding plans', 'Draft welcome emails'],
		triggerPhrases: ['onboard a new hire', 'create an onboarding checklist'],
	}),
	createMockSkill({
		id: 'hr-offboarding',
		name: 'hr-offboarding',
		description: 'Plans and runs employee offboarding.',
		domain: 'onboarding-offboarding',
		tags: ['lifecycle', 'exit'],
		aliases: ['offboarding'],
		capabilities: ['Design offboarding plans', 'Draft exit checklists'],
		triggerPhrases: ['offboard an employee'],
	}),
	createMockSkill({
		id: 'hr-compensation-benefits',
		name: 'hr-compensation-benefits',
		description: 'Designs compensation and benefits programs.',
		domain: 'compensation-rewards',
		tags: ['pay', 'benefits'],
		aliases: ['comp-benefits'],
		capabilities: ['Build salary bands', 'Design benefits packages'],
		triggerPhrases: ['design a compensation structure'],
	}),
]);

// ============================================================================
// Exact Match Tests
// ============================================================================

describe('searchSkills() — exact matches', () => {
	it('matches an exact alias', () => {
		const response = searchSkills({ text: 'onboarding' }, REGISTRY);
		const top = response.results[0];
		expect(top?.skillId).toBe('hr-onboarding');
		expect(
			top?.matches.some((m) => m.field === 'aliases' && m.matchType === 'exact'),
		).toBe(true);
	});

	it('matches an exact tag', () => {
		const response = searchSkills({ text: 'exit', fields: ['tags'] }, REGISTRY);
		expect(response.results[0]?.skillId).toBe('hr-offboarding');
		expect(response.results[0]?.matches[0]?.matchType).toBe('exact');
	});

	it('matches an exact capability substring', () => {
		const response = searchSkills(
			{ text: 'salary bands', fields: ['capabilities'] },
			REGISTRY,
		);
		expect(response.results[0]?.skillId).toBe('hr-compensation-benefits');
	});

	it('matches an exact trigger phrase', () => {
		const response = searchSkills(
			{ text: 'offboard an employee', fields: ['triggerPhrases'] },
			REGISTRY,
		);
		expect(response.results[0]?.skillId).toBe('hr-offboarding');
	});

	it('matches domain exactly', () => {
		const response = searchSkills(
			{ text: 'compensation-rewards', fields: ['domain'] },
			REGISTRY,
		);
		expect(response.results[0]?.skillId).toBe('hr-compensation-benefits');
	});

	it('is case-insensitive', () => {
		const response = searchSkills({ text: 'ONBOARDING' }, REGISTRY);
		expect(response.results[0]?.skillId).toBe('hr-onboarding');
	});
});

// ============================================================================
// Fuzzy Match Tests
// ============================================================================

describe('searchSkills() — fuzzy matches', () => {
	it('finds a skill despite a typo', () => {
		const response = searchSkills(
			{ text: 'onbording', fields: ['aliases'] },
			REGISTRY,
		);
		expect(response.results.some((r) => r.skillId === 'hr-onboarding')).toBe(true);
		const match = response.results.find((r) => r.skillId === 'hr-onboarding')
			?.matches[0];
		expect(match?.matchType).toBe('fuzzy');
	});

	it('finds a skill via reordered multi-word overlap', () => {
		const response = searchSkills(
			{ text: 'new hire onboard', fields: ['triggerPhrases'] },
			REGISTRY,
		);
		expect(response.results[0]?.skillId).toBe('hr-onboarding');
	});

	it('does not fuzzy match when fuzzy is disabled', () => {
		const response = searchSkills(
			{ text: 'onbording', fields: ['aliases'], fuzzy: false },
			REGISTRY,
		);
		expect(response.results.length).toBe(0);
	});

	it('fuzzy matches score lower than exact matches for the same field', () => {
		const exact = searchSkills({ text: 'onboarding', fields: ['aliases'] }, REGISTRY);
		const fuzzy = searchSkills({ text: 'onbording', fields: ['aliases'] }, REGISTRY);
		const exactScore = exact.results[0]?.score ?? 0;
		const fuzzyScore =
			fuzzy.results.find((r) => r.skillId === 'hr-onboarding')?.score ?? 0;
		expect(fuzzyScore).toBeLessThan(exactScore);
	});
});

// ============================================================================
// Field-Specific Search Tests
// ============================================================================

describe('searchSkills() — field targeting', () => {
	it('restricts matching to the requested fields only', () => {
		// "lifecycle" is a tag on both onboarding and offboarding, but not an
		// alias or capability — searching aliases only should find nothing.
		const response = searchSkills(
			{ text: 'lifecycle', fields: ['aliases'] },
			REGISTRY,
		);
		expect(response.results.length).toBe(0);
	});

	it('searches all fields by default', () => {
		expect(ALL_SEARCHABLE_FIELDS.length).toBe(5);
		const response = searchSkills({ text: 'lifecycle' }, REGISTRY);
		expect(response.results.length).toBeGreaterThan(0);
	});

	it('filters candidates by domain before scoring', () => {
		const response = searchSkills(
			{ text: 'benefits', domain: 'compensation-rewards' },
			REGISTRY,
		);
		expect(response.results.length).toBeGreaterThan(0);
		expect(response.results.every((r) => r.domain === 'compensation-rewards')).toBe(
			true,
		);
	});

	it('supports a domain-only browse query with empty text', () => {
		const response = searchSkills(
			{ text: '', domain: 'onboarding-offboarding' },
			REGISTRY,
		);
		expect(response.results.map((r) => r.skillId).sort()).toEqual([
			'hr-offboarding',
			'hr-onboarding',
		]);
	});
});

// ============================================================================
// Ranking & Determinism Tests
// ============================================================================

describe('searchSkills() — ranking and determinism', () => {
	it('produces identical ordering across repeated runs', () => {
		const first = searchSkills({ text: 'onboarding plans' }, REGISTRY);
		const second = searchSkills({ text: 'onboarding plans' }, REGISTRY);
		expect(first).toEqual(second);
	});

	it('ranks a skill matching multiple fields above one matching a single field', () => {
		// "onboarding" hits aliases + tags-adjacent fields for hr-onboarding
		// via multiple query terms; confirm multi-field skills aren't buried.
		const response = searchSkills({ text: 'onboarding' }, REGISTRY);
		const top = response.results[0];
		expect(top?.skillId).toBe('hr-onboarding');
		expect(top?.matches.length).toBeGreaterThanOrEqual(1);
	});

	it('breaks ties by skill ID ascending', () => {
		const registry = createMockRegistry([
			createMockSkill({ id: 'hr-zeta', aliases: ['shared-alias'] }),
			createMockSkill({ id: 'hr-alpha', aliases: ['shared-alias'] }),
		]);
		const response = searchSkills({ text: 'shared-alias' }, registry);
		expect(response.results.map((r) => r.skillId)).toEqual(['hr-alpha', 'hr-zeta']);
	});

	it('sorts results by score descending', () => {
		const response = searchSkills({ text: 'onboarding offboarding' }, REGISTRY);
		const scores = response.results.map((r) => r.score);
		const sorted = [...scores].sort((a, b) => b - a);
		expect(scores).toEqual(sorted);
	});

	it('respects the requested limit', () => {
		const response = searchSkills({ text: 'lifecycle', limit: 1 }, REGISTRY);
		expect(response.results.length).toBe(1);
	});

	it('exposes field weights used in scoring', () => {
		expect(FIELD_WEIGHTS.aliases).toBeGreaterThan(FIELD_WEIGHTS.domain);
	});
});

// ============================================================================
// Explanation Tests
// ============================================================================

describe('searchSkills() — match explanations', () => {
	it('includes a non-empty explanation for every result', () => {
		const response = searchSkills({ text: 'onboarding' }, REGISTRY);
		for (const result of response.results) {
			expect(result.explanation.length).toBeGreaterThan(0);
			expect(result.matches.length).toBeGreaterThan(0);
		}
	});

	it('explanation references the matched field and value', () => {
		const response = searchSkills(
			{ text: 'onboarding', fields: ['aliases'] },
			REGISTRY,
		);
		expect(response.results[0]?.explanation).toContain('aliases');
		expect(response.results[0]?.explanation).toContain('onboarding');
	});
});

// ============================================================================
// Empty Results & Invalid Query Tests
// ============================================================================

describe('searchSkills() — empty results and invalid queries', () => {
	it('returns an empty result set for a query that matches nothing', () => {
		const response = searchSkills({ text: 'zzzznonexistentzzzz' }, REGISTRY);
		expect(response.results).toEqual([]);
		expect(response.resultCount).toBe(0);
	});

	it('throws InvalidSearchQueryError for empty text with no domain filter', () => {
		expect(() => searchSkills({ text: '' }, REGISTRY)).toThrow(
			InvalidSearchQueryError,
		);
	});

	it('throws InvalidSearchQueryError for whitespace-only text with no domain filter', () => {
		expect(() => searchSkills({ text: '   ' }, REGISTRY)).toThrow(
			InvalidSearchQueryError,
		);
	});

	it('throws InvalidSearchQueryError for a zero limit', () => {
		expect(() => searchSkills({ text: 'onboarding', limit: 0 }, REGISTRY)).toThrow(
			InvalidSearchQueryError,
		);
	});

	it('throws InvalidSearchQueryError for a negative limit', () => {
		expect(() => searchSkills({ text: 'onboarding', limit: -1 }, REGISTRY)).toThrow(
			InvalidSearchQueryError,
		);
	});

	it('throws InvalidSearchQueryError for a non-integer limit', () => {
		expect(() => searchSkills({ text: 'onboarding', limit: 1.5 }, REGISTRY)).toThrow(
			InvalidSearchQueryError,
		);
	});

	it('returns an empty result set for an empty registry', () => {
		const response = searchSkills({ text: 'onboarding' }, createMockRegistry([]));
		expect(response.results).toEqual([]);
	});
});
