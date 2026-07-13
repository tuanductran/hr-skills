import { join } from 'node:path';
import process from 'node:process';
import * as p from '@clack/prompts';
import { validate as validateRef } from 'skills-ref';

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
	HR_SKILL_PREFIX,
	KEY_PROMPTS_REGEX,
	MIN_CONTENT_LENGTH,
	MIN_DESCRIPTION_LENGTH,
	QUOTED_PROMPT_REGEX,
	REQUIRED_SECTIONS,
	ROOT_DIR,
	SKILLS_DIR,
	TASKS_REGEX,
	TIPS_REGEX,
} from './constants.js';
import {
	discoverSkills,
	extractMatch,
	normalizeAuthorName,
	readSkillContent,
} from './helpers.js';
import { parseSkillFrontmatter } from './parser.js';
import type { SkillValidationIssue } from './types.js';

/**
 * Validate the core of a skill.
 */
function validateCore(
	skillName: string,
	skillDir: string,
	errors: SkillValidationIssue[],
): void {
	const refErrors = validateRef(skillDir);

	for (const error of refErrors) {
		errors.push({
			skill: skillName,
			message: `Core validation error: ${error}`,
		});
	}
}

/**
 * Validate the frontmatter of a skill.
 */
export function validateFrontmatter(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const frontmatter = parseSkillFrontmatter(content);

	if (!frontmatter.name) {
		errors.push({
			skill: skillName,
			message: 'Missing frontmatter: name',
		});
	} else if (frontmatter.name !== skillName) {
		errors.push({
			skill: skillName,
			message: `Frontmatter name mismatch: expected "${skillName}", received "${frontmatter.name}"`,
		});
	}

	if (!frontmatter.description) {
		errors.push({
			skill: skillName,
			message: 'Missing frontmatter: description',
		});
	} else if (frontmatter.description.length < MIN_DESCRIPTION_LENGTH) {
		errors.push({
			skill: skillName,
			message: `Description is too short (minimum ${MIN_DESCRIPTION_LENGTH} characters)`,
		});
	}

	validateAuthor(skillName, frontmatter.metadata?.author, errors);

	if (!frontmatter.metadata?.version) {
		errors.push({
			skill: skillName,
			message: 'Missing metadata.version',
		});
	}
}

/**
 * Validate the required sections of a skill.
 */
export function validateRequiredSections(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	for (const section of REQUIRED_SECTIONS) {
		if (!content.includes(section)) {
			errors.push({
				skill: skillName,
				message: `Missing required section: ${section}`,
			});
		}
	}
}

/**
 * Validate the content length of a skill.
 */
export function validateContentLength(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	if (content.length < MIN_CONTENT_LENGTH) {
		errors.push({
			skill: skillName,
			message: `SKILL.md is too short (minimum ${MIN_CONTENT_LENGTH} characters)`,
		});
	}
}

/**
 * Validate the line count of a skill.
 */
export function validateLineCount(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const lines = content.split(/\r?\n/);

	if (lines.length > 500) {
		errors.push({
			skill: skillName,
			message: `SKILL.md body is too long (${lines.length} lines, maximum 500 lines allowed)`,
		});
	}
}

/**
 * Validate the supported tasks of a skill.
 */
export function validateSupportedTasks(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const tasksBlock = extractMatch(TASKS_REGEX, content) ?? '';

	const tasks = tasksBlock
		.split(/\r?\n/)
		.filter((line) => line.trim().startsWith('- '));

	if (tasks.length < 8 || tasks.length > 12) {
		errors.push({
			skill: skillName,
			message: `Supported tasks section has ${tasks.length} tasks (expected 8-12 tasks)`,
		});
	}
}

/**
 * Validate the tips of a skill.
 */
export function validateTips(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const tipsBlock = extractMatch(TIPS_REGEX, content) ?? '';

	const tips = tipsBlock.split(/\r?\n/).filter((line) => line.trim().startsWith('- '));

	if (tips.length < 4 || tips.length > 6) {
		errors.push({
			skill: skillName,
			message: `Tips section has ${tips.length} tips (expected 4-6 tips)`,
		});
	}
}

/**
 * Validate the blank lines of a skill.
 */
export function validateBlankLines(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const lines = content.split(/\r?\n/);

	for (let i = 0; i < lines.length - 1; i++) {
		const currentLine = lines[i];
		const nextLine = lines[i + 1];

		if (currentLine === undefined || nextLine === undefined) continue;

		const trimmedCurrentLine = currentLine.trim();
		const trimmedNextLine = nextLine.trim();

		const isHeading = trimmedCurrentLine.startsWith('#');
		const isBoldLabel =
			trimmedCurrentLine.startsWith('**') && trimmedCurrentLine.endsWith(':**');

		if (isHeading || isBoldLabel) {
			if (
				trimmedNextLine.startsWith('- ') ||
				trimmedNextLine.startsWith('* ') ||
				/^\d+\.\s/.test(trimmedNextLine)
			) {
				errors.push({
					skill: skillName,
					message: `Missing blank line after heading/label "${trimmedCurrentLine}" on line ${i + 1} before the list on line ${i + 2}`,
				});
			}
		}
	}
}

/**
 * Validate the author of a skill.
 */
export function validateAuthor(
	skillName: string,
	author: string | undefined,
	errors: SkillValidationIssue[],
): void {
	if (!author?.trim()) {
		errors.push({
			skill: skillName,
			message: 'Missing metadata.author',
		});
		return;
	}

	const normalized = normalizeAuthorName(author);

	if (author !== normalized) {
		errors.push({
			skill: skillName,
			message: `metadata.author must use Title Case (expected "${normalized}", received "${author}")`,
		});
	}
}

/**
 * Validate the structure of the ## Key prompts section.
 *
 * Per docs/format.md: 3–6 subtopics (H3 headings) and 4–7 quoted prompts per subtopic.
 */
export function validatePromptStructure(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const keyPromptsBlock = extractMatch(KEY_PROMPTS_REGEX, content) ?? '';

	// Split on H3 headings — each segment is one subtopic
	const subtopicBlocks = keyPromptsBlock
		.split(/\n(?=### )/)
		.map((block) => block.trim())
		.filter(Boolean);

	if (subtopicBlocks.length < 3 || subtopicBlocks.length > 6) {
		errors.push({
			skill: skillName,
			message: `Key prompts section has ${subtopicBlocks.length} subtopic(s) — expected 3–6`,
		});
	}

	for (const block of subtopicBlocks) {
		const h3 = /^### (.+)/.exec(block);
		const subtopicName = h3?.[1]?.trim() ?? '(unknown)';
		const prompts = [...block.matchAll(QUOTED_PROMPT_REGEX)];

		if (prompts.length < 4 || prompts.length > 7) {
			errors.push({
				skill: skillName,
				message: `Key prompts subtopic "${subtopicName}" has ${prompts.length} prompt(s) — expected 4–7`,
			});
		}
	}
}

/**
 * Validate three-way consistency: router (root SKILL.md) ↔ filesystem (skills/) ↔ marketplace.json.
 *
 * All three sources must agree on which skills exist. A mismatch means either a skill
 * was added without syncing, or the router wasn't updated after a rename/deletion.
 */
export async function validateRouterConsistency(
	skillNames: string[],
	errors: SkillValidationIssue[],
): Promise<void> {
	// --- Marketplace.json ---
	const marketplacePath = join(ROOT_DIR, '.claude-plugin/marketplace.json');
	let marketplaceNames: string[] = [];

	try {
		const raw = await readFile(marketplacePath, 'utf8');
		const json = JSON.parse(raw) as { plugins?: Array<{ name?: string }> };
		marketplaceNames = (json.plugins ?? []).map((p) => p.name ?? '').filter(Boolean);
	} catch {
		errors.push({
			skill: '(consistency)',
			message: 'Could not read .claude-plugin/marketplace.json for consistency check',
		});
		return;
	}

	// --- Root SKILL.md router ---
	const routerPath = join(ROOT_DIR, 'SKILL.md');
	let routerNames: string[] = [];

	try {
		const routerContent = await readFile(routerPath, 'utf8');
		// Extract skill slugs from markdown links: [hr-skill-name](skills/hr-skill-name)
		const linkPattern = /\[hr-[a-z0-9-]+\]\(skills\/(hr-[a-z0-9-]+)\)/g;
		for (const match of routerContent.matchAll(linkPattern)) {
			if (match[1]) routerNames.push(match[1]);
		}
	} catch {
		errors.push({
			skill: '(consistency)',
			message: 'Could not read root SKILL.md for consistency check',
		});
		return;
	}

	const fsSet = new Set(skillNames);
	const marketplaceSet = new Set(marketplaceNames);
	const routerSet = new Set(routerNames);

	// Filesystem → marketplace
	for (const name of fsSet) {
		if (!marketplaceSet.has(name)) {
			errors.push({
				skill: name,
				message: `In skills/ directory but missing from marketplace.json — run "bun run sync"`,
			});
		}
	}

	// Marketplace → filesystem
	for (const name of marketplaceSet) {
		if (!fsSet.has(name)) {
			errors.push({
				skill: name,
				message: `In marketplace.json but missing from skills/ directory`,
			});
		}
	}

	// Filesystem → router
	for (const name of fsSet) {
		if (!routerSet.has(name)) {
			errors.push({
				skill: name,
				message: `In skills/ directory but missing from root SKILL.md router — update the router`,
			});
		}
	}

	// Router → filesystem
	for (const name of routerSet) {
		if (!fsSet.has(name)) {
			errors.push({
				skill: name,
				message: `In root SKILL.md router but missing from skills/ directory — dead link in router`,
			});
		}
	}
}

/**
 * Validate a single skill.
 */
async function validateSkill(skillName: string): Promise<SkillValidationIssue[]> {
	const errors: SkillValidationIssue[] = [];

	const skillDir = join(SKILLS_DIR, skillName);
	const content = await readSkillContent(skillName, errors);

	if (!content) return errors;

	validateCore(skillName, skillDir, errors);
	validateFrontmatter(skillName, content, errors);
	validateRequiredSections(skillName, content, errors);
	validateContentLength(skillName, content, errors);
	validateLineCount(skillName, content, errors);
	validateSupportedTasks(skillName, content, errors);
	validateTips(skillName, content, errors);
	validateBlankLines(skillName, content, errors);
	validatePromptStructure(skillName, content, errors);

	return errors;
}

/**
 * Validate all HR skills.
 */
async function validate(): Promise<void> {
	p.intro('Validating HR skills...');

	const skillNames = await discoverSkills();

	if (skillNames.length === 0) {
		p.log.warn(`No skills found with prefix "${HR_SKILL_PREFIX}"`);
		process.exit(1);
	}

	p.log.info(`Found ${skillNames.length} skill directories`);

	const allErrors: SkillValidationIssue[] = [];

	await validateRouterConsistency(skillNames, allErrors);

	for (const skillName of skillNames) {
		const errors = await validateSkill(skillName);

		if (errors.length > 0) {
			allErrors.push(...errors);
			p.log.error(skillName);
		}
	}

	// Report
	if (allErrors.length > 0) {
		p.log.error('Validation failed');

		for (const error of allErrors) p.log.error(`${error.skill}: ${error.message}`);

		process.exit(1);
	}

	p.log.success(`All ${skillNames.length} HR skills are valid`);
	p.outro('Done');
}

if (import.meta.main) await validate();
