import { FRONTMATTER_DELIMITER, NON_WHITESPACE_REGEX } from './constants.js';
import { ParseError } from './errors.js';
import { unquote } from './helpers.js';

/**
 * Parse the YAML frontmatter block from a `SKILL.md` file.
 *
 * Expects the content to begin with a `---` delimiter, followed by YAML,
 * followed by a closing `---` delimiter. Everything after the closing
 * delimiter is the body.
 *
 * @param content - The full UTF-8 content of a `SKILL.md` file.
 * @returns A tuple of `[frontmatter, body]` where `frontmatter` is the
 *   parsed key-value map and `body` is the trimmed markdown content
 *   that follows the closing `---`.
 * @throws {ParseError} If the content does not start with `---` or the
 *   frontmatter block is not properly closed.
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
 * Parse a restricted subset of YAML sufficient for `SKILL.md` frontmatter.
 *
 * Supports:
 * - Scalar string values (quoted or unquoted).
 * - Nested objects (one level deep, indented with any consistent whitespace).
 * - Block scalars (`|` literal and `>` folded).
 * - Comment lines (lines beginning with `#`).
 *
 * Does **not** support: arrays, anchors, aliases, multi-document streams,
 * or more than one level of nesting.
 *
 * Prototype-pollution keys (`__proto__`, `constructor`, `prototype`) are
 * silently ignored.
 *
 * @param yaml - The raw YAML string extracted between the `---` delimiters.
 * @returns A `Record<string, unknown>` of parsed top-level key-value pairs.
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

		// Nested object (value is empty, children follow on indented lines)
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
