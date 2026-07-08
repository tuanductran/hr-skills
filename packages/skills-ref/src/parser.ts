import { FRONTMATTER_DELIMITER, NON_WHITESPACE_REGEX } from './constants.js';
import { ParseError } from './errors.js';
import { unquote } from './helpers.js';

/**
 * Parse YAML frontmatter from SKILL.md content.
 */
export function parseFrontmatter(content: string): [Record<string, unknown>, string] {
	if (!content.startsWith(FRONTMATTER_DELIMITER))
		throw new ParseError('SKILL.md must start with YAML frontmatter (---)');

	const parts = content.split(FRONTMATTER_DELIMITER);

	if (parts.length < 3)
		throw new ParseError('SKILL.md frontmatter not properly closed with ---');

	const frontmatter = parts[1];

	if (frontmatter === undefined)
		throw new ParseError('SKILL.md frontmatter not properly closed with ---');

	const body = parts.slice(2).join(FRONTMATTER_DELIMITER).trim();

	return [parseSimpleYaml(frontmatter), body];
}

/**
 * Parse a simple YAML string.
 */
function parseSimpleYaml(yaml: string): Record<string, unknown> {
	const result: Record<string, unknown> = {};
	const lines = yaml.split('\n');
	let index = 0;

	while (index < lines.length) {
		const line = lines[index];

		if (line === undefined) break;

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

		// Block scalar multiline string
		if (value === '|' || value === '>') {
			let scalarContent = '';
			const isFolded = value === '>';
			index++;

			while (index < lines.length) {
				const childLine = lines[index];

				if (childLine === undefined) break;

				const childTrimmed = childLine.trimEnd();

				if (childTrimmed.length === 0) {
					scalarContent += '\n';
					index++;
					continue;
				}

				const childIndent = childLine.search(NON_WHITESPACE_REGEX);

				if (childIndent <= indent) break;

				const contentLine = childLine.slice(childIndent);

				if (scalarContent.length > 0 && !scalarContent.endsWith('\n') && isFolded)
					scalarContent += ` ${contentLine.trim()}`;
				else
					scalarContent +=
						(scalarContent.length > 0 && !scalarContent.endsWith('\n')
							? '\n'
							: '') + contentLine;

				index++;
			}

			result[key] = scalarContent.trimEnd();
			continue;
		}

		// Nested object
		if (value === '') {
			const nested: Record<string, string> = {};
			index++;

			while (index < lines.length) {
				const childLine = lines[index];

				if (childLine === undefined) break;

				const childTrimmed = childLine.trimEnd();

				if (childTrimmed.length === 0) {
					index++;
					continue;
				}

				const childIndent = childLine.search(NON_WHITESPACE_REGEX);

				if (childIndent <= indent) break;

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
