import { access, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { HR_SKILL_PREFIX, SKILLS_DIR } from './constants.js';
import type { SkillDirectoryOptions } from './types.js';

/**
 * Discover all HR skill directory names in `skills/` that satisfy the given options.
 *
 * A directory is included only if:
 *  1. It starts with the configured `prefix` (default: `"hr-"`).
 *  2. It contains a `SKILL.md` file at its root (checked via `fs.access`).
 *
 * @param options - Filtering and sorting options.
 * @param options.prefix - Directory-name prefix to filter by. Defaults to `"hr-"`.
 * @param options.sort - Whether to return names in lexicographic order. Defaults to `true`.
 * @returns A promise that resolves to an array of skill directory names (not full paths).
 *
 * @example
 * const skills = await getHrSkills();
 * // => ['hr-analytics', 'hr-compliance', 'hr-onboarding', ...]
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
