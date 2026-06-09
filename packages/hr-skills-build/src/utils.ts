/**
 * Shared regex patterns and utilities for hr-skills-build scripts.
 *
 * All build scripts (catalog, sync, validate) import from here
 * to avoid duplicating constants and helpers.
 */

import { parse } from 'yaml';

// -----------------------------------------------------------------------------
// Regex patterns
// -----------------------------------------------------------------------------

/** Matches the full YAML frontmatter block including delimiters. */
export const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;

/** Matches the `## Supported tasks` block content. */
export const TASKS_REGEX = /## Supported tasks\r?\n\r?\n([\s\S]*?)(?=\r?\n##|$)/;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface SkillFrontmatter {
	name?: string;
	description?: string;
	metadata?: {
		author?: string;
		version?: string;
		category?: string;
		tags?: string[];
		status?: string;
		recruitingWorkflow?: string;
	};
}

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

/**
 * Parse YAML frontmatter from a markdown document.
 *
 * Returns an empty object when frontmatter is missing or invalid.
 */
export function parseFrontmatter(content: string): SkillFrontmatter {
	const frontmatter = extractMatch(FRONTMATTER_REGEX, content);

	if (!frontmatter) {
		return {};
	}

	try {
		const parsed = parse(frontmatter);

		if (!parsed || typeof parsed !== 'object') {
			return {};
		}

		const frontmatterObject = parsed as {
			name?: unknown;
			description?: unknown;
			metadata?: {
				author?: unknown;
				version?: unknown;
				category?: unknown;
				tags?: unknown;
				status?: unknown;
				recruitingWorkflow?: unknown;
			};
		};

		return {
			name:
				typeof frontmatterObject.name === 'string'
					? frontmatterObject.name.trim()
					: undefined,
			description:
				typeof frontmatterObject.description === 'string'
					? frontmatterObject.description.trim()
					: undefined,
			metadata: {
				author:
					typeof frontmatterObject.metadata?.author === 'string'
						? frontmatterObject.metadata.author.trim()
						: undefined,
				version:
					typeof frontmatterObject.metadata?.version === 'string'
						? frontmatterObject.metadata.version.trim()
						: undefined,
				category:
					typeof frontmatterObject.metadata?.category === 'string'
						? frontmatterObject.metadata.category.trim()
						: undefined,
				tags: Array.isArray(frontmatterObject.metadata?.tags)
					? frontmatterObject.metadata.tags
							.map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
							.filter(Boolean)
					: undefined,
				status:
					typeof frontmatterObject.metadata?.status === 'string'
						? frontmatterObject.metadata.status.trim()
						: undefined,
				recruitingWorkflow:
					typeof frontmatterObject.metadata?.recruitingWorkflow === 'string'
						? frontmatterObject.metadata.recruitingWorkflow.trim()
						: undefined,
			},
		};
	} catch {
		return {};
	}
}
