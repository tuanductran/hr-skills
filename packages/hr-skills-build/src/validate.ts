#!/usr/bin/env bun
/**
 * Validate all HR skill SKILL.md files.
 *
 * Validation rules:
 *   - SKILL.md must exist
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
 *
 * Usage:
 *   bun run validate
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import { consola } from 'consola';
import { HR_SKILL_PREFIX, SKILLS_DIR } from './config.js';

// -----------------------------------------------------------------------------
// Regex patterns
// -----------------------------------------------------------------------------

const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/;

const NAME_REGEX = /^name:[ \t]*(.+)$/m;

const DESCRIPTION_REGEX = /^description:[ \t]*(.+)$/m;

const AUTHOR_REGEX = /^[ \t]+author:[ \t]*(.+)$/m;

const VERSION_REGEX = /^[ \t]+version:[ \t]*"?(.+?)"?$/m;

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const REQUIRED_SECTIONS = ['## Supported tasks', '## Key prompts', '## Tips'];

const MIN_DESCRIPTION_LENGTH = 50;

const MIN_CONTENT_LENGTH = 1000;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ValidationError {
	skill: string;
	message: string;
}

interface SkillFrontmatter {
	name?: string;
	description?: string;
	metadata?: {
		author?: string;
		version?: string;
	};
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

function extractMatch(regex: RegExp, content: string): string | null {
	return regex.exec(content)?.[1]?.trim() ?? null;
}

function parseFrontmatter(content: string): SkillFrontmatter {
	const frontmatter = extractMatch(FRONTMATTER_REGEX, content);

	if (!frontmatter) {
		return {};
	}

	const name = extractMatch(NAME_REGEX, frontmatter) ?? undefined;

	const description = extractMatch(DESCRIPTION_REGEX, frontmatter) ?? undefined;

	const author = extractMatch(AUTHOR_REGEX, frontmatter) ?? undefined;

	const version = extractMatch(VERSION_REGEX, frontmatter) ?? undefined;

	return {
		name,
		description,
		metadata: {
			author,
			version,
		},
	};
}

// -----------------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------------

async function validateSkill(skillName: string): Promise<ValidationError[]> {
	const errors: ValidationError[] = [];

	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');

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

	const frontmatter = parseFrontmatter(content);

	// -------------------------------------------------------------------------
	// name
	// -------------------------------------------------------------------------

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

	// -------------------------------------------------------------------------
	// description
	// -------------------------------------------------------------------------

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

	// -------------------------------------------------------------------------
	// metadata.author
	// -------------------------------------------------------------------------

	if (!frontmatter.metadata?.author) {
		errors.push({
			skill: skillName,
			message: 'Missing metadata.author',
		});
	}

	// -------------------------------------------------------------------------
	// metadata.version
	// -------------------------------------------------------------------------

	if (!frontmatter.metadata?.version) {
		errors.push({
			skill: skillName,
			message: 'Missing metadata.version',
		});
	}

	// -------------------------------------------------------------------------
	// required sections
	// -------------------------------------------------------------------------

	for (const section of REQUIRED_SECTIONS) {
		if (!content.includes(section)) {
			errors.push({
				skill: skillName,
				message: `Missing required section: ${section}`,
			});
		}
	}

	// -------------------------------------------------------------------------
	// minimum content length
	// -------------------------------------------------------------------------

	if (content.length < MIN_CONTENT_LENGTH) {
		errors.push({
			skill: skillName,
			message: `SKILL.md is too short (minimum ${MIN_CONTENT_LENGTH} characters)`,
		});
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
