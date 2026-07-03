#!/usr/bin/env bun
/**
 * Validate all HR skill SKILL.md files.
 *
 * Validation rules:
 *   - Runs core validator from skills-ref
 *   - Frontmatter must contain:
 *       - name
 *       - description
 *       - metadata.author
 *       - metadata.version
 *   - Frontmatter name must match directory name
 *   - Required sections must exist:
 *       - ## Supported tasks
 *       - ## Key prompts
 *       - ## Tips
 *   - Description must be meaningful
 *   - Content must meet minimum length
 *   - SKILL.md body must be under 500 lines
 *   - metadata.author must be exactly "Tuan Duc Tran"
 *   - ## Supported tasks has 8–12 items
 *   - ## Tips has 4–6 items
 *   - Ensure proper blank lines before lists (MD032 compliance)
 *
 * Usage:
 *   bun run validate
 */

import { join } from 'node:path';
import process from 'node:process';
import { consola } from 'consola';
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
import type { ValidationError } from './types.js';
import { parseFrontmatter } from './utils.js';

// -----------------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------------

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

export function validateFrontmatter(
	skillName: string,
	content: string,
	errors: ValidationError[],
): void {
	const frontmatter = parseFrontmatter(content);

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

export function validateBlankLines(
	skillName: string,
	content: string,
	errors: ValidationError[],
): void {
	const lines = content.split(/\r?\n/);

	for (let i = 0; i < lines.length - 1; i++) {
		const currentLine = lines[i].trim();
		const nextLine = lines[i + 1].trim();

		const isHeading = currentLine.startsWith('#');
		const isBoldLabel = currentLine.startsWith('**') && currentLine.endsWith(':**');

		if (isHeading || isBoldLabel) {
			if (
				nextLine.startsWith('- ') ||
				nextLine.startsWith('* ') ||
				/^\d+\.\s/.test(nextLine)
			) {
				errors.push({
					skill: skillName,
					message: `Missing blank line after heading/label "${currentLine}" on line ${i + 1} before the list on line ${i + 2}`,
				});
			}
		}
	}
}

export function validateAuthor(
	skillName: string,
	author: string | undefined,
	errors: {
		skill: string;
		message: string;
	}[],
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

async function validateSkill(skillName: string): Promise<ValidationError[]> {
	const errors: ValidationError[] = [];

	const skillDir = join(SKILLS_DIR, skillName);

	const content = await readSkillContent(skillName, errors);

	if (!content) {
		return errors;
	}

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

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function validate(): Promise<void> {
	consola.start('Validating HR skills...');

	const skillNames = await discoverSkills();

	if (skillNames.length === 0) {
		consola.warn(`No skills found with prefix "${HR_SKILL_PREFIX}"`);

		process.exit(1);
	}

	consola.info(`Found ${skillNames.length} skill directories`);

	const allErrors: ValidationError[] = [];

	for (const skillName of skillNames) {
		const errors = await validateSkill(skillName);

		if (errors.length > 0) {
			allErrors.push(...errors);

			consola.fail(skillName);
			continue;
		}

		consola.success(skillName);
	}

	// -------------------------------------------------------------------------
	// Report
	// -------------------------------------------------------------------------

	if (allErrors.length > 0) {
		consola.error('Validation failed');

		for (const error of allErrors) {
			consola.error(`${error.skill}: ${error.message}`);
		}

		process.exit(1);
	}

	consola.success(`All ${skillNames.length} HR skills are valid`);
}

if (import.meta.main) {
	await validate();
}
