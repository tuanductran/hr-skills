import { readdir } from 'node:fs/promises';
import { SKILLS_DIR } from 'hr-skills-ref/server';
import { HR_SKILL_PREFIX } from '../../shared/constants.js';

/**
 * Discover all `hr-*` skill directory names under `skills/`, sorted.
 *
 * Does not verify `SKILL.md` exists in each directory — callers that need
 * that guarantee (e.g. filtering out incomplete/in-progress skill folders)
 * should use `registry/discovery.ts#getHrSkills()` instead, which checks
 * for `SKILL.md` via `fs.access` and supports a configurable prefix. This
 * function is the lighter-weight default used by most of `validation/`,
 * `build/`, and `search/`, which read (and error-handle) `SKILL.md`
 * themselves immediately after.
 *
 * @returns A promise that resolves to a sorted array of skill directory names.
 */
export async function discoverSkills(): Promise<string[]> {
	const entries = await readdir(SKILLS_DIR, {
		withFileTypes: true,
	});

	return entries
		.filter((entry) => entry.isDirectory() && entry.name.startsWith(HR_SKILL_PREFIX))
		.map((entry) => entry.name)
		.sort();
}
