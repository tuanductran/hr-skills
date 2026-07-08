import { describe, expect, it } from 'bun:test';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getHrSkills } from '../src/config.js';
import { HR_SKILL_PREFIX, SKILLS_DIR } from '../src/constants.js';

describe('getHrSkills()', () => {
	it('returns at least one skill', async () => {
		const skills = await getHrSkills();

		expect(skills.length).toBeGreaterThan(0);
	});

	it('all names are lowercase kebab-case', async () => {
		const skills = await getHrSkills();
		const kebabCaseRegex = /^[a-z][a-z0-9-]*[a-z0-9]$/;

		for (const name of skills) {
			expect(name).toMatch(kebabCaseRegex);
		}
	});

	it('all names start with hr- prefix', async () => {
		const skills = await getHrSkills();

		for (const name of skills) {
			expect(name.startsWith(HR_SKILL_PREFIX)).toBe(true);
		}
	});

	it('has no duplicate skill names', async () => {
		const skills = await getHrSkills();

		const uniqueSkills = new Set(skills);

		expect(uniqueSkills.size).toBe(skills.length);
	});

	it('returns alphabetically sorted skills by default', async () => {
		const skills = await getHrSkills();

		const sorted = [...skills].sort();

		expect(skills).toEqual(sorted);
	});

	it('every discovered skill contains SKILL.md', async () => {
		const skills = await getHrSkills();

		for (const skill of skills) {
			const skillFile = join(SKILLS_DIR, skill, 'SKILL.md');

			expect(existsSync(skillFile)).toBe(true);
		}
	});

	it('supports disabling sorting', async () => {
		const skills = await getHrSkills({
			sort: false,
		});

		expect(Array.isArray(skills)).toBe(true);
	});

	it('supports custom prefixes', async () => {
		const skills = await getHrSkills({
			prefix: 'hr-',
		});

		for (const skill of skills) {
			expect(skill.startsWith('hr-')).toBe(true);
		}
	});
});

describe('SKILLS_DIR', () => {
	it('points to an existing directory', () => {
		expect(existsSync(SKILLS_DIR)).toBe(true);
	});
});
