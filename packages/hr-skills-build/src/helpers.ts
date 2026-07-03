import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
	HR_SKILL_PREFIX,
	SKILLS_DIR,
	TASK_ITEM_REGEX,
	TASKS_REGEX,
} from './constants.js';
import type { SkillCatalogEntry, SkillFrontmatter, ValidationError } from './types.js';
import { parseFrontmatter } from './utils.js';

export function extractTasks(content: string): string[] {
	const tasksBlock = extractMatch(TASKS_REGEX, content);

	if (!tasksBlock) {
		return [];
	}

	return tasksBlock
		.split('\n')
		.filter((line) => TASK_ITEM_REGEX.test(line))
		.map((line) => line.replace(TASK_ITEM_REGEX, '').trim())
		.filter(Boolean);
}

export function extractMatch(regex: RegExp, content: string): string | null {
	return regex.exec(content)?.[1]?.trim() ?? null;
}

export function createSection(skill: SkillCatalogEntry): string {
	const lines: string[] = [
		`## ${skill.name}`,
		'',
		skill.description,
		'',
		`Version: ${skill.version} · Author: ${skill.author}`,
	];

	if (skill.supportedTasks.length > 0) {
		lines.push('', '**Supported tasks:**', '');

		for (const task of skill.supportedTasks.slice(0, 8)) {
			lines.push(`- ${task}`);
		}
	}

	return lines.join('\n');
}

export async function discoverSkills(): Promise<string[]> {
	const entries = await readdir(SKILLS_DIR, {
		withFileTypes: true,
	});

	return entries
		.filter((entry) => entry.isDirectory() && entry.name.startsWith(HR_SKILL_PREFIX))
		.map((entry) => entry.name)
		.sort();
}

export async function readSkill(skillName: string): Promise<{
	content: string;
	frontmatter: SkillFrontmatter;
}> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');
	const content = await readFile(skillPath, 'utf8');

	return {
		content,
		frontmatter: parseFrontmatter(content),
	};
}

export async function readSkillContent(
	skillName: string,
	errors: ValidationError[],
): Promise<string | null> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');

	try {
		return await Bun.file(skillPath).text();
	} catch {
		errors.push({
			skill: skillName,
			message: 'SKILL.md file not found',
		});

		return null;
	}
}

export function normalizeAuthorName(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}
