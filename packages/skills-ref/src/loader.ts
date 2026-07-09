import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as v from 'valibot';

import { SKILL_MD_FILENAMES } from './constants.js';
import { ParseError, ValidationError } from './errors.js';
import { isPlainObject, toStringOrUndefined } from './helpers.js';
import { parseFrontmatter } from './parser.js';
import type { SkillProperties } from './schema.js';
import { SkillPropertiesSchema } from './schema.js';

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

	if (skillMd == null) {
		throw new ParseError(`SKILL.md not found in ${skillDir}`);
	}

	const content = readFileSync(skillMd, 'utf8');
	const [frontmatter] = parseFrontmatter(content);

	const result = v.safeParse(SkillPropertiesSchema, {
		name: frontmatter['name'],
		description: frontmatter['description'],
		license: toStringOrUndefined(frontmatter['license']),
		compatibility: toStringOrUndefined(frontmatter['compatibility']),
		allowedTools: toStringOrUndefined(frontmatter['allowed-tools']),
		metadata: toStringRecord(frontmatter['metadata']),
	});

	if (!result.success) {
		throw new ValidationError(v.summarize(result.issues));
	}

	return result.output;
}
