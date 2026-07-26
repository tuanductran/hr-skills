import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { SKILLS_DIR, XML_ESCAPES } from './constants.js';
import { findSkillMd, readProperties } from './loader.js';

/**
 * Check whether a value is a plain object (i.e. created via `{}` or `Object.create(null)`).
 * Returns `false` for arrays, class instances, `null`, and primitives.
 *
 * @param value - The value to test.
 * @returns `true` if `value` is a plain object, `false` otherwise.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
	return (
		value != null &&
		typeof value === 'object' &&
		Object.getPrototypeOf(value) === Object.prototype
	);
}

/**
 * Strip surrounding single or double quotes from a string.
 * If the string is not quoted, it is returned unchanged.
 *
 * @param value - The string to unquote.
 * @returns The string with surrounding matching quotes removed, or the original string.
 *
 * @example
 * unquote('"hello"')  // => 'hello'
 * unquote("'world'")  // => 'world'
 * unquote('no-quotes') // => 'no-quotes'
 */
export function unquote(value: string): string {
	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	)
		return value.slice(1, -1);

	return value;
}

/**
 * Convert a nullable/undefined value to a trimmed string, or `undefined` if
 * the result would be empty.
 *
 * @param value - The value to convert.
 * @returns A non-empty trimmed string, or `undefined` if `value` is `null`,
 *   `undefined`, or whitespace-only.
 */
export function toStringOrUndefined(value: unknown): string | undefined {
	return value != null ? String(value).trim() || undefined : undefined;
}

/**
 * Escape XML special characters in a string so it can be safely embedded
 * in an XML attribute value or element body.
 *
 * Escapes: `&` → `&amp;`, `<` → `&lt;`, `>` → `&gt;`,
 *           `"` → `&quot;`, `'` → `&apos;`.
 *
 * @param value - The raw string to escape.
 * @returns The XML-escaped string.
 */
function escapeXml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => XML_ESCAPES.get(char) ?? char);
}

/**
 * Build an XML `<skill>` block for the given skill directory.
 *
 * The block includes the skill's `<name>`, `<description>`, and the absolute
 * `<location>` path to its `SKILL.md`. All values are XML-escaped.
 *
 * @param skillDir - The directory path (absolute or relative) of the skill.
 * @returns A multi-line XML string representing the skill.
 */
export function createSkillBlock(skillDir: string): string {
	const resolvedPath = resolve(skillDir);
	const properties = readProperties(resolvedPath);
	const skillMdPath = findSkillMd(resolvedPath) ?? join(resolvedPath, 'SKILL.md');

	return [
		'<skill>',
		`<name>${escapeXml(properties.name)}</name>`,
		`<description>${escapeXml(properties.description)}</description>`,
		`<location>${escapeXml(skillMdPath)}</location>`,
		'</skill>',
	].join('\n');
}

/**
 * Discover all HR skill directory names in the `skills/` folder, sorted
 * lexicographically. Only directories whose names begin with `"hr-"` are returned.
 *
 * @returns A sorted array of skill directory names (not full paths).
 */
export function discoverSkillNames(): string[] {
	return readdirSync(SKILLS_DIR, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && entry.name.startsWith('hr-'))
		.map((entry) => entry.name)
		.sort();
}

/**
 * Create a temporary directory containing a single `SKILL.md` file with the
 * given content. The directory is created in the OS temp directory.
 *
 * Intended for use in tests that need a real filesystem path to pass to
 * skill-loading functions without polluting the repository.
 *
 * @param content - The UTF-8 content to write to `SKILL.md`.
 * @returns The absolute path to the newly created temporary directory.
 */
export function makeTempSkill(content: string): string {
	const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'));
	writeFileSync(join(tmp, 'SKILL.md'), content, 'utf8');
	return tmp;
}
