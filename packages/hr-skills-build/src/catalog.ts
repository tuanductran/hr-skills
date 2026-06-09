#!/usr/bin/env bun
/**
 * Generate a catalog of all HR skills.
 *
 * Usage:
 *   bun run catalog
 *   bun run catalog --list
 */

import { join } from 'node:path';

import { consola } from 'consola';

import { getHrSkills, SKILLS_DIR } from './config.js';
import { extractMatch, parseFrontmatter, TASKS_REGEX } from './utils.js';

// -----------------------------------------------------------------------------
// Regex patterns (catalog-specific)
// -----------------------------------------------------------------------------

const TASK_ITEM_REGEX = /^- /;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SkillCatalogEntry {
	name: string;
	description: string;
	author: string;
	version: string;
	category: string;
	tags: string[];
	status: string;
	recruitingWorkflow: string;
	supportedTasks: string[];
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function extractTasks(content: string): string[] {
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

function createSection(skill: SkillCatalogEntry): string {
	const lines: string[] = [
		`## ${skill.name}`,
		'',
		skill.description,
		'',
		`Status: ${skill.status} · Category: ${skill.category} · Version: ${skill.version} · Author: ${skill.author}`,
		`Recruiting workflow: ${skill.recruitingWorkflow}`,
	];

	if (skill.tags.length > 0) {
		lines.push(`Tags: ${skill.tags.join(', ')}`);
	}

	if (skill.supportedTasks.length > 0) {
		lines.push('', '**Supported tasks:**', '');

		for (const task of skill.supportedTasks.slice(0, 8)) {
			lines.push(`- ${task}`);
		}
	}

	return lines.join('\n');
}

// -----------------------------------------------------------------------------
// Skill parser
// -----------------------------------------------------------------------------

async function parseSkill(skillName: string): Promise<SkillCatalogEntry | null> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');

	try {
		const content = await Bun.file(skillPath).text();

		const frontmatter = parseFrontmatter(content);

		const name = frontmatter.name ?? skillName;

		const description = frontmatter.description ?? '';

		const author = frontmatter.metadata?.author ?? 'Tuan Duc Tran';

		const version = frontmatter.metadata?.version ?? '1.0.0';

		const category = frontmatter.metadata?.category ?? 'core-hr';

		const tags = frontmatter.metadata?.tags ?? [];

		const status = frontmatter.metadata?.status ?? 'stable';

		const recruitingWorkflow =
			frontmatter.metadata?.recruitingWorkflow ?? 'not-applicable';

		const supportedTasks = extractTasks(content);

		return {
			name,
			description,
			author,
			version,
			category,
			tags,
			status,
			recruitingWorkflow,
			supportedTasks,
		};
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Unknown error';

		consola.error(`Could not read ${skillName}/SKILL.md`);

		consola.error(message);

		return null;
	}
}

// -----------------------------------------------------------------------------
// Markdown generator
// -----------------------------------------------------------------------------

function generateCatalog(skills: SkillCatalogEntry[]): string {
	const sections = skills.map(createSection).join('\n\n---\n\n');

	return [
		'# HR Skills Catalog',
		'',
		`> ${skills.length} skills available for HR professionals`,
		'',
		'---',
		'',
		sections,
		'',
	].join('\n');
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function catalog(): Promise<void> {
	const listOnly = Bun.argv.includes('--list');

	consola.start('Generating HR Skills catalog...');

	const skillNames = await getHrSkills();

	if (skillNames.length === 0) {
		consola.warn('No HR skills found in skills/ directory');

		return;
	}

	const parsedSkills = await Promise.all(skillNames.map(parseSkill));

	const skills = parsedSkills.filter(
		(entry): entry is SkillCatalogEntry => entry !== null,
	);

	if (listOnly) {
		for (const skill of skills) {
			const preview =
				skill.description.length > 80
					? `${skill.description.slice(0, 77)}...`
					: skill.description;

			consola.log(`${skill.name}: ${preview}`);
		}

		consola.success(`Listed ${skills.length} HR skills`);

		return;
	}

	const markdown = generateCatalog(skills);

	const outputPath = join(SKILLS_DIR, 'CATALOG.md');

	await Bun.write(outputPath, markdown);

	consola.success(`Catalog written to skills/CATALOG.md (${skills.length} skills)`);
}

void catalog();
