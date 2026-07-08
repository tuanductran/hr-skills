import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { SKILLS_DIR, XML_ESCAPES } from './constants.js';
import { findSkillMd, readProperties } from './loader.js';

/**
 * Checks if a value is a plain object.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
	return (
		value != null &&
		typeof value === 'object' &&
		Object.getPrototypeOf(value) === Object.prototype
	);
}

/**
 * Removes quotes from a string.
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
 * Converts a value to a string or undefined.
 */
export function toStringOrUndefined(value: unknown): string | undefined {
	return value != null ? String(value).trim() || undefined : undefined;
}

/**
 * Escapes XML special characters in a string.
 */
function escapeXml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => XML_ESCAPES.get(char) ?? char);
}

/**
 * Creates an XML skill block for a skill.
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
 * Discovers all skill names in the skills directory.
 */
export function discoverSkillNames(): string[] {
	return readdirSync(SKILLS_DIR, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && entry.name.startsWith('hr-'))
		.map((entry) => entry.name)
		.sort();
}

/**
 * Creates a temporary skill directory with a SKILL.md file.
 */
export function makeTempSkill(content: string): string {
	const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'));
	writeFileSync(join(tmp, 'SKILL.md'), content, 'utf8');
	return tmp;
}
