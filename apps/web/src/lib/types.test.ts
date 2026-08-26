import { describe, expect, test } from 'bun:test';
import { type HrSkillsSnapshot, toRegistry } from './types';

describe('registry adapter', () => {
	test('adapts the index snapshot without content payload and caches by snapshot identity', () => {
		const snapshot = {
			schemaVersion: '1.0',
			generatedAt: '2026-08-25T00:00:00.000Z',
			skillCount: 1,
			skills: [{ id: 'hr-onboarding', name: 'hr-onboarding' }],
		} as unknown as HrSkillsSnapshot;
		const first = toRegistry(snapshot);
		const second = toRegistry(snapshot);

		expect(first).toBe(second);
		expect(first.skills).toHaveLength(1);
		const skill = first.skills[0];
		expect(skill).toBeDefined();
		if (!skill) throw new Error('Registry adapter should preserve the skill.');
		expect(skill.id).toBe('hr-onboarding');
		expect('content' in skill).toBeFalse();
	});
});
