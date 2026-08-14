import * as v from 'valibot';
import { parse } from 'yaml';

import { FRONTMATTER_REGEX } from './constants.js';
import type { SkillFrontmatter } from './schema.js';
import { SkillFrontmatterSchema } from './schema.js';

/**
 * Extract and trim the first capture group from a regex match against `content`.
 *
 * Duplicated (not imported) from `helpers.ts` on purpose: this file is part
 * of the browser-safe `client` surface and must not import `helpers.ts`,
 * which pulls in `node:fs/promises` and `node:path`.
 *
 * @param regex - A regular expression with at least one capture group.
 * @param content - The string to search.
 * @returns The trimmed contents of capture group 1, or `null` if the regex did not match.
 */
export function extractMatch(regex: RegExp, content: string): string | null {
	return regex.exec(content)?.[1]?.trim() ?? null;
}

/**
 * Parse and validate a markdown document's YAML frontmatter against
 * {@link SkillFrontmatterSchema}.
 *
 * Never throws: missing frontmatter, invalid YAML, and schema validation
 * failures all resolve to `{}` rather than raising an error, so callers can
 * treat every field as optional.
 *
 * @param content - Raw markdown document, frontmatter included.
 * @returns Parsed frontmatter fields, or `{}` if none/invalid.
 */
export function parseSkillFrontmatter(content: string): SkillFrontmatter {
	const frontmatter = extractMatch(FRONTMATTER_REGEX, content);

	if (!frontmatter) {
		return {};
	}

	try {
		const parsed = parse(frontmatter);

		const result = v.safeParse(SkillFrontmatterSchema, parsed);

		return result.success ? result.output : {};
	} catch {
		return {};
	}
}
