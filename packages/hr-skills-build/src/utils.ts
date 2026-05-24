/**
 * Shared regex patterns and utilities for hr-skills-build scripts.
 *
 * All build scripts (catalog, sync, validate) import from here
 * to avoid duplicating constants and helpers.
 */

// -----------------------------------------------------------------------------
// Regex patterns
// -----------------------------------------------------------------------------

/** Matches the full YAML frontmatter block including delimiters. */
export const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---/;

/** Matches `name: <value>` in frontmatter. */
export const NAME_REGEX = /^name:[ \t]*(.+)$/m;

/** Matches `description: <value>` in frontmatter. */
export const DESCRIPTION_REGEX = /^description:[ \t]*(.+)$/m;

/** Matches `  author: <value>` (indented) in frontmatter. */
export const AUTHOR_REGEX = /^[ \t]+author:[ \t]*(.+)$/m;

/** Matches `  version: <value>` (indented, optionally quoted) in frontmatter. */
export const VERSION_REGEX = /^[ \t]+version:[ \t]*"?(.+?)"?$/m;

/** Matches the `## Supported tasks` block content. */
export const TASKS_REGEX = /## Supported tasks\n\n([\s\S]*?)(?=\n##|$)/;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Extract the first capture group from a regex match.
 *
 * Returns `null` when the regex does not match.
 */
export function extractMatch(regex: RegExp, content: string): string | null {
	return regex.exec(content)?.[1]?.trim() ?? null;
}
