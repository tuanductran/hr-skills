import { parseDocument } from 'yaml';

import { FRONTMATTER_DELIMITER } from './constants.js';
import { ParseError } from './errors.js';
import { sanitizeYamlValue } from './helpers.js';

/**
 * Parse the YAML frontmatter block from a `SKILL.md` file.
 *
 * Expects the content to begin with a `---` delimiter, followed by YAML,
 * followed by a closing `---` delimiter. Everything after the closing
 * delimiter is returned as the markdown body.
 *
 * @param content - Full contents of a `SKILL.md` file.
 * @returns A tuple containing the parsed frontmatter and markdown body.
 * @throws {ParseError} If the frontmatter is missing, malformed, or contains invalid YAML.
 */
export function parseFrontmatter(content: string): [Record<string, unknown>, string] {
	if (!content.startsWith(FRONTMATTER_DELIMITER)) {
		throw new ParseError('SKILL.md must start with YAML frontmatter (---)');
	}

	const start = content.indexOf('\n') + 1;

	const end = content.search(/\r?\n---(?:\r?\n|$)/);

	if (start === 0 || end === -1 || end <= start) {
		throw new ParseError('SKILL.md frontmatter not properly closed with ---');
	}

	const frontmatter = content.slice(start, end);

	const body = content
		.slice(end)
		.replace(/^\r?\n---\r?\n?/, '')
		.trim();

	return [parseYamlFrontmatter(frontmatter), body];
}

/**
 * Parse the YAML frontmatter section.
 *
 * @param yaml - Raw YAML between the `---` delimiters.
 * @returns Parsed frontmatter object.
 * @throws {ParseError} If the YAML contains syntax errors.
 */
function parseYamlFrontmatter(yaml: string): Record<string, unknown> {
	const document = parseDocument(yaml);

	const [error] = document.errors;

	if (error) {
		throw new ParseError(error.message, {
			cause: error,
		});
	}

	const value = document.toJS({
		mapAsMap: false,
	});

	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		return Object.create(null);
	}

	return sanitizeYamlValue(value) as Record<string, unknown>;
}
