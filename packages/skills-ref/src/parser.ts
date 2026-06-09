/** YAML frontmatter parsing for SKILL.md files. */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ParseError, ValidationError } from './errors.js';
import type { SkillProperties } from './models.js';

const NON_WHITESPACE_REGEX = /\S/;

const FRONTMATTER_DELIMITER = '---';

const SKILL_MD_FILENAMES = ['SKILL.md', 'skill.md'] as const;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value != null && typeof value === 'object' && !Array.isArray(value);
}

function unquote(value: string): string {
	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	) {
		return value.slice(1, -1);
	}

	return value;
}

function toStringOrUndefined(value: unknown): string | undefined {
	return value != null ? String(value).trim() || undefined : undefined;
}

function parseListItem(line: string): string | null {
	const trimmed = line.trim();

	if (!trimmed.startsWith('- ')) {
		return null;
	}

	return unquote(trimmed.slice(2).trim());
}

// -----------------------------------------------------------------------------
// File discovery
// -----------------------------------------------------------------------------

/**
 * Find SKILL.md in a skill directory.
 *
 * Prefers uppercase filename but also supports lowercase.
 */
export function findSkillMd(skillDir: string): string | null {
	for (const filename of SKILL_MD_FILENAMES) {
		const filepath = join(skillDir, filename);

		if (existsSync(filepath)) {
			return filepath;
		}
	}

	return null;
}

// -----------------------------------------------------------------------------
// Frontmatter parsing
// -----------------------------------------------------------------------------

/**
 * Parse YAML frontmatter from SKILL.md content.
 *
 * Returns:
 * [metadata, body]
 */
export function parseFrontmatter(content: string): [Record<string, unknown>, string] {
	if (!content.startsWith(FRONTMATTER_DELIMITER)) {
		throw new ParseError('SKILL.md must start with YAML frontmatter (---)');
	}

	const parts = content.split(FRONTMATTER_DELIMITER);

	if (parts.length < 3) {
		throw new ParseError('SKILL.md frontmatter not properly closed with ---');
	}

	const frontmatter = parts[1];

	const body = parts.slice(2).join(FRONTMATTER_DELIMITER).trim();

	return [parseSimpleYaml(frontmatter), body];
}

/**
 * Minimal YAML parser for SKILL.md frontmatter.
 *
 * Supports:
 * - key: value
 * - nested objects via indentation
 */
function parseSimpleYaml(yaml: string): Record<string, unknown> {
	const result: Record<string, unknown> = {};

	const lines = yaml.split('\n');

	let index = 0;

	while (index < lines.length) {
		const line = lines[index];

		const trimmedLine = line.trimEnd();

		if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) {
			index++;
			continue;
		}

		const colonIndex = trimmedLine.indexOf(':');

		if (colonIndex === -1) {
			index++;
			continue;
		}

		const key = trimmedLine.slice(0, colonIndex).trim();

		// Prevent Prototype Pollution
		if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
			index++;
			continue;
		}

		const value = trimmedLine.slice(colonIndex + 1).trim();

		const indent = line.search(NON_WHITESPACE_REGEX);

		// Block scalar multiline string (e.g. description: | or description: >)
		if (value === '|' || value === '>') {
			let scalarContent = '';
			const isFolded = value === '>';
			index++;

			while (index < lines.length) {
				const childLine = lines[index];
				const childTrimmed = childLine.trimEnd();

				if (childTrimmed.length === 0) {
					scalarContent += '\n';
					index++;
					continue;
				}

				const childIndent = childLine.search(NON_WHITESPACE_REGEX);

				if (childIndent <= indent) {
					break;
				}

				// Extract content line (slice off the indentation)
				const contentLine = childLine.slice(childIndent);

				if (
					scalarContent.length > 0 &&
					!scalarContent.endsWith('\n') &&
					isFolded
				) {
					scalarContent += ` ${contentLine.trim()}`;
				} else {
					scalarContent +=
						(scalarContent.length > 0 && !scalarContent.endsWith('\n')
							? '\n'
							: '') + contentLine;
				}
				index++;
			}

			result[key] = scalarContent.trimEnd();
			continue;
		}

		// Nested object
		if (value === '') {
			const nested: Record<string, string | string[]> = {};

			index++;

			while (index < lines.length) {
				const childLine = lines[index];

				const childTrimmed = childLine.trimEnd();

				if (childTrimmed.length === 0) {
					index++;
					continue;
				}

				const childIndent = childLine.search(NON_WHITESPACE_REGEX);

				if (childIndent <= indent) {
					break;
				}

				const childColonIndex = childTrimmed.indexOf(':');

				if (childColonIndex !== -1) {
					const childKey = childTrimmed.slice(0, childColonIndex).trim();

					// Prevent Prototype Pollution
					if (
						childKey !== '__proto__' &&
						childKey !== 'constructor' &&
						childKey !== 'prototype'
					) {
						const childValue = childTrimmed.slice(childColonIndex + 1).trim();

						if (childValue === '') {
							const listItems: string[] = [];
							index++;

							while (index < lines.length) {
								const listLine = lines[index];
								const listTrimmed = listLine.trimEnd();

								if (listTrimmed.length === 0) {
									index++;
									continue;
								}

								const listIndent = listLine.search(NON_WHITESPACE_REGEX);

								if (listIndent <= childIndent) {
									break;
								}

								const item = parseListItem(listTrimmed);

								if (item != null && item.length > 0) {
									listItems.push(item);
								}

								index++;
							}

							nested[childKey] = listItems;

							continue;
						}

						nested[childKey] = unquote(childValue);
					}
				}

				index++;
			}

			result[key] = nested;

			continue;
		}

		result[key] = unquote(value);

		index++;
	}

	return result;
}

// -----------------------------------------------------------------------------
// Property reader
// -----------------------------------------------------------------------------

/**
 * Read skill properties from SKILL.md frontmatter.
 *
 * This does NOT perform full validation.
 * Use validate() for strict validation rules.
 */
export function readProperties(skillDir: string): SkillProperties {
	const skillMd = findSkillMd(skillDir);

	if (skillMd == null) {
		throw new ParseError(`SKILL.md not found in ${skillDir}`);
	}

	const content = readFileSync(skillMd, 'utf8');

	const [metadata] = parseFrontmatter(content);

	const rawName = metadata.name;

	const rawDescription = metadata.description;

	if (typeof rawName !== 'string' || rawName.trim().length === 0) {
		throw new ValidationError("Field 'name' must be a non-empty string");
	}

	if (typeof rawDescription !== 'string' || rawDescription.trim().length === 0) {
		throw new ValidationError("Field 'description' must be a non-empty string");
	}

	const metadataObject = isPlainObject(metadata.metadata)
		? Object.fromEntries(
				Object.entries(metadata.metadata).map(([key, value]) => [
					key,
					Array.isArray(value) ? value.map(String) : String(value),
				]),
			)
		: undefined;

	return {
		name: rawName.trim(),
		description: rawDescription.trim(),

		license: toStringOrUndefined(metadata.license),

		compatibility: toStringOrUndefined(metadata.compatibility),

		allowedTools: toStringOrUndefined(metadata['allowed-tools']),

		metadata: metadataObject,
	};
}
