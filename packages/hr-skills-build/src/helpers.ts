import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { HR_SKILL_PREFIX, SKILLS_DIR } from './constants.js';
import { parseSkillFrontmatter } from './parser.js';
import type { SkillFrontmatter } from './schema.js';
import type { SkillValidationIssue } from './types.js';

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
	errors: SkillValidationIssue[],
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

/**
 * Build content with N subtopics of M prompts each.
 */
export function makeKeyPromptsContent(subtopics: number, promptsEach: number): string {
	const blocks = Array.from({ length: subtopics }, (_, si) => {
		const prompts = Array.from(
			{ length: promptsEach },
			(_, pi) => `${pi + 1}. "Prompt ${si + 1}-${pi + 1} for [role]."`,
		).join('\n');
		return `### Subtopic ${si + 1}\n\n${prompts}`;
	});

	return [
		'---',
		'name: hr-test',
		'description: This is a sufficiently long description for validation purposes.',
		'metadata:',
		'  author: Tuan Duc Tran',
		'  version: "1.0.0"',
		'---',
		'',
		'## Key prompts',
		'',
		...blocks,
		'',
		'## Tips',
		'',
		'- Tip',
	].join('\n');
}
