import { access, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { HR_SKILL_PREFIX, SKILLS_DIR } from './constants.js';
import type { SkillDirectoryOptions } from './types.js';

/**
 * Get a list of HR skills.
 */
export async function getHrSkills(
	options: SkillDirectoryOptions = {},
): Promise<string[]> {
	const { prefix = HR_SKILL_PREFIX, sort = true } = options;

	const entries = await readdir(SKILLS_DIR, {
		withFileTypes: true,
	});

	const skills: string[] = [];

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		if (!entry.name.startsWith(prefix)) continue;

		const skillPath = join(SKILLS_DIR, entry.name, 'SKILL.md');

		try {
			await access(skillPath);
		} catch {
			continue;
		}

		skills.push(entry.name);
	}

	return sort ? skills.sort() : skills;
}
