import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { HR_SKILL_PREFIX, SKILLS_DIR } from './constants.js';
import { parseSkillFrontmatter } from './parser.js';
import type { SkillFrontmatter, ValidationError } from './types.js';

/**
 * Extract a match from a markdown skill file.
 */
export function extractMatch(regex: RegExp, content: string): string | null {
	return regex.exec(content)?.[1]?.trim() ?? null;
}

/**
 * Discover skills in the skills directory.
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

/**
 * Read a skill file.
 */
export async function readSkill(skillName: string): Promise<{
	content: string;
	frontmatter: SkillFrontmatter;
}> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');
	const content = await readFile(skillPath, 'utf8');

	return {
		content,
		frontmatter: parseSkillFrontmatter(content),
	};
}

/**
 * Read a skill file content.
 */
export async function readSkillContent(
	skillName: string,
	errors: ValidationError[],
): Promise<string | null> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');

	try {
		return await readFile(skillPath, 'utf8');
	} catch {
		errors.push({
			skill: skillName,
			message: 'SKILL.md file not found',
		});
		return null;
	}
}

/**
 * Normalize author name.
 */
export function normalizeAuthorName(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

/**
 * Get the first element of an array.
 */
export function first<T>(items: readonly T[]): T {
	const first = items.at(0);

	if (first === undefined)
		throw new Error('Expected array to contain at least one element.');

	return first;
}
