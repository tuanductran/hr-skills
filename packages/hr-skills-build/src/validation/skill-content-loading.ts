/**
 * Shared SKILL.md content loading/parsing helpers.
 *
 * `detect-duplicates.ts` and `semantic-validation.ts` each re-implemented
 * `extractDescription`, `stripFrontmatter`, and a "read every .md file in a
 * directory, sorted, concatenated" helper (jscpd flagged all three as
 * duplicated). Both now import from here instead.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { FRONTMATTER_REGEX } from '../shared/constants.js';
import { dirExists } from '../shared/helpers.js';

/**
 * Extract the frontmatter `description` field from raw SKILL.md content.
 * Returns an empty string when the field or frontmatter block is absent.
 *
 * @param raw - Raw `SKILL.md` content, frontmatter included.
 * @returns The description text, or `''` if absent.
 */
export function extractDescription(raw: string): string {
	const frontmatterMatch = FRONTMATTER_REGEX.exec(raw);
	if (!frontmatterMatch?.[1]) return '';
	const descMatch = /^description:\s*(.+?)(?=\n\w|\n---)/ms.exec(frontmatterMatch[1]);
	return descMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '';
}

/**
 * Strip YAML frontmatter from a markdown string.
 *
 * @param text - Markdown content, frontmatter included.
 * @returns The content with the leading `---` frontmatter block removed.
 */
export function stripFrontmatter(text: string): string {
	return text.replace(FRONTMATTER_REGEX, '').trim();
}

/**
 * Read and concatenate all `.md` files directly inside `dir`, in
 * alphabetical filename order. Returns an empty string when the directory
 * does not exist or contains no markdown files.
 *
 * @param dir - Directory to read `.md` files from.
 * @returns Concatenated file contents, or `''` if none found.
 */
export async function readAllMarkdown(dir: string): Promise<string> {
	if (!(await dirExists(dir))) return '';

	let entries: string[];
	try {
		entries = (await readdir(dir, { withFileTypes: true }))
			.filter((e) => e.isFile() && e.name.endsWith('.md'))
			.map((e) => e.name)
			.sort(); // deterministic order
	} catch {
		return '';
	}

	const parts: string[] = [];
	for (const entry of entries) {
		try {
			parts.push(await readFile(join(dir, entry), 'utf8'));
		} catch {
			// skip unreadable files
		}
	}
	return parts.join('\n');
}

/**
 * Read a skill's raw `SKILL.md` file. Returns an empty string (rather than
 * throwing) when the file is missing or unreadable — callers treat that as
 * "everything derived from this skill stays empty" instead of failing.
 *
 * @param skillDir - Absolute path to the skill's directory.
 * @returns The file's raw content, or `''` if missing/unreadable.
 */
export async function readRawSkillMd(skillDir: string): Promise<string> {
	try {
		return await readFile(join(skillDir, 'SKILL.md'), 'utf8');
	} catch {
		return '';
	}
}
