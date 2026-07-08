import { join } from 'node:path';
import process from 'node:process';
import * as p from '@clack/prompts';
import { validate as validateRef } from 'skills-ref';

import {
	HR_SKILL_PREFIX,
	MIN_CONTENT_LENGTH,
	MIN_DESCRIPTION_LENGTH,
	REQUIRED_SECTIONS,
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
import type { ValidationError } from './types.js';

/**
 * Validate the core of a skill.
 */
function validateCore(
	skillName: string,
	skillDir: string,
	errors: ValidationError[],
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
	errors: ValidationError[],
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
	errors: ValidationError[],
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
	errors: ValidationError[],
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
	errors: ValidationError[],
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
	errors: ValidationError[],
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
	errors: ValidationError[],
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
	errors: ValidationError[],
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
	errors: ValidationError[],
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
 * Validate a single skill.
 */
async function validateSkill(skillName: string): Promise<ValidationError[]> {
	const errors: ValidationError[] = [];

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

	const allErrors: ValidationError[] = [];

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
