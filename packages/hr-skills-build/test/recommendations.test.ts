import { describe, expect, it } from 'bun:test';

import { getRecommendations, UnknownSkillError } from '../src/recommendations.js';
import type { Registry, RegistryEntry } from '../src/types.js';

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
// getRecommendations() Tests
// ============================================================================

describe('getRecommendations()', () => {
	it('returns recommendations in relatedSkills order, ranked from 1', () => {
		const registry = createMockRegistry([
			createMockSkill({
				id: 'hr-onboarding',
				relatedSkills: ['hr-offboarding', 'hr-hris'],
			}),
			createMockSkill({ id: 'hr-offboarding', description: 'Offboarding skill' }),
			createMockSkill({ id: 'hr-hris', description: 'HRIS skill' }),
		]);

		const result = getRecommendations('hr-onboarding', registry);

		expect(result.skillId).toBe('hr-onboarding');
		expect(result.recommendations.map((r) => r.id)).toEqual([
			'hr-offboarding',
			'hr-hris',
		]);
		expect(result.recommendations[0]?.rank).toBe(1);
		expect(result.recommendations[1]?.rank).toBe(2);
	});

	it('never reorders relatedSkills — preserves registry ranking as-is', () => {
		const registry = createMockRegistry([
			createMockSkill({ id: 'hr-a', relatedSkills: ['hr-c', 'hr-b'] }),
			createMockSkill({ id: 'hr-b' }),
			createMockSkill({ id: 'hr-c' }),
		]);

		const result = getRecommendations('hr-a', registry);

		expect(result.recommendations.map((r) => r.id)).toEqual(['hr-c', 'hr-b']);
	});

	it('caps output at the requested limit', () => {
		const registry = createMockRegistry([
			createMockSkill({ id: 'hr-a', relatedSkills: ['hr-b', 'hr-c', 'hr-d'] }),
			createMockSkill({ id: 'hr-b' }),
			createMockSkill({ id: 'hr-c' }),
			createMockSkill({ id: 'hr-d' }),
		]);

		const result = getRecommendations('hr-a', registry, 2);

		expect(result.recommendations.length).toBe(2);
		expect(result.recommendations.map((r) => r.id)).toEqual(['hr-b', 'hr-c']);
	});

	it('defaults to a limit of 5', () => {
		const registry = createMockRegistry([
			createMockSkill({
				id: 'hr-a',
				relatedSkills: ['hr-b', 'hr-c', 'hr-d', 'hr-e', 'hr-f', 'hr-g'],
			}),
			createMockSkill({ id: 'hr-b' }),
			createMockSkill({ id: 'hr-c' }),
			createMockSkill({ id: 'hr-d' }),
			createMockSkill({ id: 'hr-e' }),
			createMockSkill({ id: 'hr-f' }),
			createMockSkill({ id: 'hr-g' }),
		]);

		const result = getRecommendations('hr-a', registry);

		expect(result.recommendations.length).toBe(5);
	});

	it('returns an empty list for a skill with no relatedSkills', () => {
		const registry = createMockRegistry([
			createMockSkill({ id: 'hr-a', relatedSkills: [] }),
		]);

		const result = getRecommendations('hr-a', registry);

		expect(result.recommendations).toEqual([]);
	});

	it('silently skips a dangling relatedSkills reference', () => {
		const registry = createMockRegistry([
			createMockSkill({ id: 'hr-a', relatedSkills: ['hr-missing', 'hr-b'] }),
			createMockSkill({ id: 'hr-b' }),
		]);

		const result = getRecommendations('hr-a', registry);

		expect(result.recommendations.map((r) => r.id)).toEqual(['hr-b']);
	});

	it('throws UnknownSkillError for a skill ID not in the registry', () => {
		const registry = createMockRegistry([createMockSkill({ id: 'hr-a' })]);

		expect(() => getRecommendations('hr-does-not-exist', registry)).toThrow(
			UnknownSkillError,
		);
	});

	it('is deterministic — same registry and skill ID produce the same output', () => {
		const registry = createMockRegistry([
			createMockSkill({ id: 'hr-a', relatedSkills: ['hr-b', 'hr-c'] }),
			createMockSkill({ id: 'hr-b' }),
			createMockSkill({ id: 'hr-c' }),
		]);

		const first = getRecommendations('hr-a', registry);
		const second = getRecommendations('hr-a', registry);

		expect(first).toEqual(second);
	});

	it('includes name, description, and domain for each recommendation', () => {
		const registry = createMockRegistry([
			createMockSkill({ id: 'hr-a', relatedSkills: ['hr-b'] }),
			createMockSkill({
				id: 'hr-b',
				name: 'hr-b',
				description: 'Skill B description',
				domain: 'compensation-rewards',
			}),
		]);

		const result = getRecommendations('hr-a', registry);

		expect(result.recommendations[0]).toEqual({
			id: 'hr-b',
			name: 'hr-b',
			description: 'Skill B description',
			domain: 'compensation-rewards',
			rank: 1,
		});
	});
});
