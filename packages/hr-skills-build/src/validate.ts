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

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { consola } from 'consola';
import { validate as validateRef } from 'skills-ref';
import { HR_SKILL_PREFIX, SKILLS_DIR } from './config.js';
import { extractMatch, parseFrontmatter, TASKS_REGEX } from './utils.js';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const REQUIRED_SECTIONS = ['## Supported tasks', '## Key prompts', '## Tips'];

const MIN_DESCRIPTION_LENGTH = 50;

const MIN_CONTENT_LENGTH = 1000;

const TIPS_REGEX = /## Tips\r?\n\r?\n([\s\S]*?)(?=\r?\n##|$)/;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ValidationError {
	skill: string;
	message: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

async function discoverSkills(): Promise<string[]> {
	const entries = await readdir(SKILLS_DIR, {
		withFileTypes: true,
	});

	return entries
		.filter((entry) => entry.isDirectory() && entry.name.startsWith(HR_SKILL_PREFIX))
		.map((entry) => entry.name)
		.sort();
}

// -----------------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------------

async function validateSkill(skillName: string): Promise<ValidationError[]> {
	const errors: ValidationError[] = [];

	const skillDir = join(SKILLS_DIR, skillName);
	const skillPath = join(skillDir, 'SKILL.md');

	let content: string;

	try {
		content = await Bun.file(skillPath).text();
	} catch {
		errors.push({
			skill: skillName,
			message: 'SKILL.md file not found',
		});

		return errors;
	}

	// 1. Run core validator from skills-ref
	const refErrors = validateRef(skillDir);
	for (const err of refErrors) {
		errors.push({
			skill: skillName,
			message: `Core Validation Error: ${err}`,
		});
	}

	const frontmatter = parseFrontmatter(content);

	// 2. Validate Frontmatter specific properties
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

	if (!frontmatter.metadata?.author) {
		errors.push({
			skill: skillName,
			message: 'Missing metadata.author',
		});
	} else if (frontmatter.metadata.author !== 'Tuan Duc Tran') {
		errors.push({
			skill: skillName,
			message: `Incorrect metadata.author: expected "Tuan Duc Tran", received "${frontmatter.metadata.author}"`,
		});
	}

	if (!frontmatter.metadata?.version) {
		errors.push({
			skill: skillName,
			message: 'Missing metadata.version',
		});
	}

	// 3. Required sections
	for (const section of REQUIRED_SECTIONS) {
		if (!content.includes(section)) {
			errors.push({
				skill: skillName,
				message: `Missing required section: ${section}`,
			});
		}
	}

	// 4. Minimum content length
	if (content.length < MIN_CONTENT_LENGTH) {
		errors.push({
			skill: skillName,
			message: `SKILL.md is too short (minimum ${MIN_CONTENT_LENGTH} characters)`,
		});
	}

	// 5. Lines count constraint (AGENTS.md: under 500 lines)
	const lines = content.split(/\r?\n/);
	if (lines.length > 500) {
		errors.push({
			skill: skillName,
			message: `SKILL.md body is too long (${lines.length} lines, maximum 500 lines allowed)`,
		});
	}

	// 6. Supported tasks count constraint (AGENTS.md: 8–12 tasks)
	const tasksBlock = extractMatch(TASKS_REGEX, content) ?? '';
	const taskLines = tasksBlock
		.split(/\r?\n/)
		.filter((line) => line.trim().startsWith('- '));
	if (taskLines.length < 8 || taskLines.length > 12) {
		errors.push({
			skill: skillName,
			message: `Supported tasks section has ${taskLines.length} tasks (expected 8-12 tasks)`,
		});
	}

	// 7. Tips count constraint (AGENTS.md: 4–6 tips)
	const tipsBlock = extractMatch(TIPS_REGEX, content) ?? '';
	const tipLines = tipsBlock
		.split(/\r?\n/)
		.filter((line) => line.trim().startsWith('- '));
	if (tipLines.length < 4 || tipLines.length > 6) {
		errors.push({
			skill: skillName,
			message: `Tips section has ${tipLines.length} tips (expected 4-6 tips)`,
		});
	}

	// 8. Blank line before lists constraint (MD032 compliance)
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

void validate();
