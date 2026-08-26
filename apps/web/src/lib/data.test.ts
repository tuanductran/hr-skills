import { expect, test } from 'bun:test';
import { resolveCanonicalSkillId } from './data';

const skills = [{ id: 'hr-onboarding' }, { id: 'hr-ma-integration-by-country' }] as const;

test('canonical skill slug resolution', () => {
	expect(resolveCanonicalSkillId('hr-onboarding', skills)).toBe('hr-onboarding');
	expect(resolveCanonicalSkillId('onboarding', skills)).toBe('hr-onboarding');
	expect(resolveCanonicalSkillId('HR-Onboarding', skills)).toBe('hr-onboarding');
	expect(resolveCanonicalSkillId('ma-integration-by-country', skills)).toBe(
		'hr-ma-integration-by-country',
	);
	expect(resolveCanonicalSkillId('not-a-skill', skills)).toBeUndefined();
	expect(resolveCanonicalSkillId('../onboarding', skills)).toBeUndefined();
});
