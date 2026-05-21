/**
 * Configuration for HR Skills build tooling
 *
 * Auto-discovers all skills that start with the `hr-` prefix.
 */

import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const SKILLS_DIR = join(__dirname, '../../..', 'skills');

export const HR_SKILL_PREFIX = 'hr-';

interface SkillDirectoryOptions {
	readonly prefix?: string;
	readonly sort?: boolean;
}

/**
 * Discover all HR skill directories automatically.
 *
 * Rules:
 * - Must be a directory
 * - Must start with `hr-`
 * - Must contain `SKILL.md`
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
		if (!entry.isDirectory()) {
			continue;
		}

		if (!entry.name.startsWith(prefix)) {
			continue;
		}

		const skillFile = Bun.file(join(SKILLS_DIR, entry.name, 'SKILL.md'));

		if (!(await skillFile.exists())) {
			continue;
		}

		skills.push(entry.name);
	}

	return sort ? skills.sort() : skills;
}
