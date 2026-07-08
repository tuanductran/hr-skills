import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { SKILL_MD_FILENAMES } from './constants.js';
import { ParseError, ValidationError } from './errors.js';
import { isPlainObject, toStringOrUndefined } from './helpers.js';
import { parseFrontmatter } from './parser.js';
import type { SkillProperties } from './types.js';

/**
 * Find SKILL.md in a skill directory.
 */
export function findSkillMd(skillDir: string): string | null {
	for (const filename of SKILL_MD_FILENAMES) {
		const filepath = join(skillDir, filename);
		if (existsSync(filepath)) return filepath;
	}
	return null;
}

/**
 * Convert an unknown value to a string record.
 */
function toStringRecord(value: unknown): Record<string, string> | undefined {
	if (!isPlainObject(value)) return undefined;

	return Object.fromEntries(
		Object.entries(value).map(([key, value]) => [key, String(value)]),
	);
}

/**
 * Read skill properties from SKILL.md frontmatter.
 */
export function readProperties(skillDir: string): SkillProperties {
	const skillMd = findSkillMd(skillDir);

	if (skillMd == null) throw new ParseError(`SKILL.md not found in ${skillDir}`);

	const content = readFileSync(skillMd, 'utf8');
	const [metadata] = parseFrontmatter(content);

	const rawName = metadata['name'];
	const rawDescription = metadata['description'];

	if (typeof rawName !== 'string' || rawName.trim().length === 0)
		throw new ValidationError("Field 'name' must be a non-empty string");

	if (typeof rawDescription !== 'string' || rawDescription.trim().length === 0)
		throw new ValidationError("Field 'description' must be a non-empty string");

	const properties: SkillProperties = {
		name: rawName.trim(),
		description: rawDescription.trim(),
	};

	const license = toStringOrUndefined(metadata['license']);
	if (license !== undefined) properties.license = license;

	const compatibility = toStringOrUndefined(metadata['compatibility']);
	if (compatibility !== undefined) properties.compatibility = compatibility;

	const allowedTools = toStringOrUndefined(metadata['allowed-tools']);
	if (allowedTools !== undefined) properties.allowedTools = allowedTools;

	const metadataObject = toStringRecord(metadata['metadata']);
	if (metadataObject !== undefined) properties.metadata = metadataObject;

	return properties;
}
