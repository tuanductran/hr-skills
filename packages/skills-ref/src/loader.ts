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
 * Find the `SKILL.md` file inside a skill directory.
 *
 * Checks filenames in the order defined by `SKILL_MD_FILENAMES` and
 * returns the path to the first one that exists on disk.
 *
 * @param skillDir - Absolute path to the skill directory to search.
 * @returns The absolute path to the found file, or `null` if neither filename exists.
 */
export function findSkillMd(skillDir: string): string | null {
	for (const filename of SKILL_MD_FILENAMES) {
		const filepath = join(/* turbopackIgnore: true */ skillDir, filename);
		if (existsSync(/* turbopackIgnore: true */ filepath)) return filepath;
	}
	return null;
}

/**
 * Coerce an unknown value to a `Record<string, string>` by stringifying every value.
 * Returns `undefined` if the input is not a plain object.
 *
 * @param value - The value to coerce (typically the parsed `metadata:` block).
 * @returns A `Record<string, string>` with all values converted via `String()`,
 *   or `undefined` if `value` is not a plain object.
 */
function toStringRecord(value: unknown): Record<string, string> | undefined {
	if (!isPlainObject(value)) return undefined;

	return Object.fromEntries(
		Object.entries(value).map(([key, value]) => [key, String(value)]),
	);
}

/**
 * Read and parse the properties of a skill from its `SKILL.md` frontmatter.
 *
 * Steps:
 *  1. Locate `SKILL.md` (or `skill.md`) in `skillDir`.
 *  2. Read the file as UTF-8.
 *  3. Parse the YAML frontmatter.
 *  4. Validate the parsed data against {@link SkillPropertiesSchema}.
 *
 * @param skillDir - Absolute path to the skill directory.
 * @returns The validated {@link SkillProperties} extracted from the frontmatter.
 * @throws {ParseError} If `SKILL.md` is not found or cannot be parsed.
 * @throws {ValidationError} If the frontmatter does not satisfy the schema.
 */
export function readProperties(skillDir: string): SkillProperties {
	const skillMd = findSkillMd(skillDir);

	if (skillMd == null) {
		throw new ParseError(`SKILL.md not found in ${skillDir}`);
	}

	const content = readFileSync(/* turbopackIgnore: true */ skillMd, 'utf8');
	const [frontmatter] = parseFrontmatter(content);

	const {
		name,
		description,
		license,
		compatibility,
		metadata,
		['allowed-tools']: allowedTools,
	} = frontmatter;

	const result = v.safeParse(SkillPropertiesSchema, {
		name,
		description,
		license: toStringOrUndefined(license),
		compatibility: toStringOrUndefined(compatibility),
		allowedTools: toStringOrUndefined(allowedTools),
		metadata: toStringRecord(metadata),
	});

	if (!result.success) {
		throw new ValidationError(v.summarize(result.issues), result.issues);
	}

	return result.output;
}
