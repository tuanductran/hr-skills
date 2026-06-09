/** Skill validation logic. */

import { existsSync, readFileSync, statSync } from 'node:fs';

import { basename } from 'node:path';

import { ParseError } from './errors.js';

import { findSkillMd, parseFrontmatter } from './parser.js';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const MAX_SKILL_NAME_LENGTH = 64;

const MAX_DESCRIPTION_LENGTH = 1024;

const MAX_COMPATIBILITY_LENGTH = 500;

const SKILL_NAME_REGEX = /^[a-z0-9-]+$/;

const ALLOWED_STATUSES = new Set(['stable', 'beta', 'experimental']);

const ALLOWED_CATEGORIES = new Set([
	'core-hr',
	'talent-acquisition',
	'technical-recruiting',
	'people-operations',
	'workforce-strategy',
	'compliance',
]);

const ALLOWED_RECRUITING_WORKFLOWS = new Set([
	'not-applicable',
	'workforce-planning',
	'role-calibration',
	'sourcing',
	'screening',
	'interviewing',
	'scorecards',
	'offers',
	'onboarding',
]);

const ALLOWED_FRONTMATTER_FIELDS = new Set([
	'name',
	'description',
	'license',
	'allowed-tools',
	'metadata',
	'compatibility',
]);

// -----------------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------------

function validateName(name: unknown, skillDir: string): string[] {
	if (typeof name !== 'string' || name.trim().length === 0) {
		return ["Field 'name' must be a non-empty string"];
	}

	const normalizedName = name.trim();

	const errors: string[] = [];

	if (normalizedName.length > MAX_SKILL_NAME_LENGTH) {
		errors.push(
			`Skill name '${normalizedName}' exceeds ${MAX_SKILL_NAME_LENGTH} character limit (${normalizedName.length} chars)`,
		);
	}

	if (normalizedName !== normalizedName.toLowerCase()) {
		errors.push(`Skill name '${normalizedName}' must be lowercase`);
	}

	if (normalizedName.startsWith('-') || normalizedName.endsWith('-')) {
		errors.push('Skill name cannot start or end with a hyphen');
	}

	if (normalizedName.includes('--')) {
		errors.push('Skill name cannot contain consecutive hyphens');
	}

	if (!SKILL_NAME_REGEX.test(normalizedName)) {
		errors.push(
			`Skill name '${normalizedName}' contains invalid characters. Only lowercase letters, digits, and hyphens are allowed.`,
		);
	}

	const directoryName = basename(skillDir);

	if (directoryName !== normalizedName) {
		errors.push(
			`Directory name '${directoryName}' must match skill name '${normalizedName}'`,
		);
	}

	return errors;
}

function validateDescription(description: unknown): string[] {
	if (typeof description !== 'string' || description.trim().length === 0) {
		return ["Field 'description' must be a non-empty string"];
	}

	if (description.length > MAX_DESCRIPTION_LENGTH) {
		return [
			`Description exceeds ${MAX_DESCRIPTION_LENGTH} character limit (${description.length} chars)`,
		];
	}

	return [];
}

function validateCompatibility(compatibility: unknown): string[] {
	if (typeof compatibility !== 'string') {
		return ["Field 'compatibility' must be a string"];
	}

	if (compatibility.length > MAX_COMPATIBILITY_LENGTH) {
		return [
			`Compatibility exceeds ${MAX_COMPATIBILITY_LENGTH} character limit (${compatibility.length} chars)`,
		];
	}

	return [];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value != null && typeof value === 'object' && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

function validateMetadata(metadata: unknown): string[] {
	const errors: string[] = [];

	if (!isPlainObject(metadata)) {
		return ["Field 'metadata' must be an object"];
	}

	const requiredFields = [
		'author',
		'version',
		'category',
		'tags',
		'status',
		'recruitingWorkflow',
	];

	for (const field of requiredFields) {
		if (!(field in metadata)) {
			errors.push(`Missing required metadata field: ${field}`);
		}
	}

	if ('author' in metadata && !isNonEmptyString(metadata.author)) {
		errors.push("Metadata field 'author' must be a non-empty string");
	}

	if ('version' in metadata && !isNonEmptyString(metadata.version)) {
		errors.push("Metadata field 'version' must be a non-empty string");
	}

	if ('category' in metadata) {
		if (!isNonEmptyString(metadata.category)) {
			errors.push("Metadata field 'category' must be a non-empty string");
		} else if (!ALLOWED_CATEGORIES.has(metadata.category)) {
			errors.push(
				`Metadata field 'category' must be one of: ${[...ALLOWED_CATEGORIES].join(', ')}`,
			);
		}
	}

	if ('status' in metadata) {
		if (!isNonEmptyString(metadata.status)) {
			errors.push("Metadata field 'status' must be a non-empty string");
		} else if (!ALLOWED_STATUSES.has(metadata.status)) {
			errors.push(
				`Metadata field 'status' must be one of: ${[...ALLOWED_STATUSES].join(', ')}`,
			);
		}
	}

	if ('recruitingWorkflow' in metadata) {
		if (!isNonEmptyString(metadata.recruitingWorkflow)) {
			errors.push("Metadata field 'recruitingWorkflow' must be a non-empty string");
		} else if (!ALLOWED_RECRUITING_WORKFLOWS.has(metadata.recruitingWorkflow)) {
			errors.push(
				`Metadata field 'recruitingWorkflow' must be one of: ${[...ALLOWED_RECRUITING_WORKFLOWS].join(', ')}`,
			);
		}
	}

	if ('tags' in metadata) {
		if (!Array.isArray(metadata.tags)) {
			errors.push("Metadata field 'tags' must be a list of strings");
		} else {
			const tags = metadata.tags;

			if (tags.length < 2 || tags.length > 8) {
				errors.push(
					`Metadata field 'tags' must contain 2-8 tags (received ${tags.length})`,
				);
			}

			for (const tag of tags) {
				if (!isNonEmptyString(tag)) {
					errors.push(
						"Metadata field 'tags' must contain only non-empty strings",
					);
					break;
				}
			}
		}
	}

	return errors;
}

function validateFrontmatterFields(metadata: Record<string, unknown>): string[] {
	const invalidFields = Object.keys(metadata)
		.filter((field) => !ALLOWED_FRONTMATTER_FIELDS.has(field))
		.sort();

	if (invalidFields.length === 0) {
		return [];
	}

	return [
		`Unexpected fields in frontmatter: ${invalidFields.join(', ')}. Only ${[...ALLOWED_FRONTMATTER_FIELDS].sort().join(', ')} are allowed.`,
	];
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Validate a skill directory.
 *
 * Returns a list of validation errors.
 * An empty array means the skill is valid.
 */
export function validate(skillDir: string): string[] {
	if (!existsSync(skillDir)) {
		return [`Path does not exist: ${skillDir}`];
	}

	const stats = statSync(skillDir);

	if (!stats.isDirectory()) {
		return [`Not a directory: ${skillDir}`];
	}

	const skillMdPath = findSkillMd(skillDir);

	if (skillMdPath == null) {
		return ['Missing required file: SKILL.md'];
	}

	let content: string;

	try {
		content = readFileSync(skillMdPath, 'utf8');
	} catch (error) {
		return [`Failed to read SKILL.md: ${String(error)}`];
	}

	let metadata: Record<string, unknown>;

	try {
		[metadata] = parseFrontmatter(content);
	} catch (error) {
		if (error instanceof ParseError) {
			return [error.message];
		}

		return [`Failed to parse SKILL.md: ${String(error)}`];
	}

	const errors: string[] = [];

	errors.push(...validateFrontmatterFields(metadata));

	if (!('name' in metadata)) {
		errors.push('Missing required field in frontmatter: name');
	} else {
		errors.push(...validateName(metadata.name, skillDir));
	}

	if (!('description' in metadata)) {
		errors.push('Missing required field in frontmatter: description');
	} else {
		errors.push(...validateDescription(metadata.description));
	}

	if ('metadata' in metadata) {
		errors.push(...validateMetadata(metadata.metadata));
	} else {
		errors.push('Missing required field in frontmatter: metadata');
	}

	if ('compatibility' in metadata) {
		errors.push(...validateCompatibility(metadata.compatibility));
	}

	return errors;
}
