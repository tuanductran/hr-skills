/**
 * Shared regex patterns and utilities for hr-skills-build scripts.
 *
 * All build scripts (catalog, sync, validate) import from here
 * to avoid duplicating constants and helpers.
 */

import consola from 'consola';
import { parse } from 'yaml';
import {
	FRONTMATTER_REGEX,
	KEY_PROMPTS_REGEX,
	PERIOD_REGEX,
	QUOTED_PROMPT_REGEX,
	TASK_ITEM_REGEX,
	TASKS_REGEX,
	USE_WHEN_REGEX,
} from './constants.js';
import { extractMatch, extractTasks, readSkill } from './helpers.js';
import type { SkillCatalogEntry, SkillFrontmatter, SkillMeta } from './types.js';

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
			},
		};
	} catch {
		return {};
	}
}

// -----------------------------------------------------------------------------
// Skill parser
// -----------------------------------------------------------------------------

export async function parseSkillMeta(skillName: string): Promise<SkillMeta> {
	const { content, frontmatter } = await readSkill(skillName);

	const name = frontmatter.name ?? skillName;

	const description = frontmatter.description ?? '';

	// Remove "Use when..." section from description
	const useWhenIndex = description.search(USE_WHEN_REGEX);

	const coverage =
		useWhenIndex !== -1
			? description.slice(0, useWhenIndex).trim().replace(PERIOD_REGEX, '')
			: description.trim().replace(PERIOD_REGEX, '');

	// Supported tasks
	const tasksBlock = extractMatch(TASKS_REGEX, content) ?? '';

	const supportedTasks = tasksBlock
		.split('\n')
		.filter((line) => TASK_ITEM_REGEX.test(line))
		.map((line) => line.replace(TASK_ITEM_REGEX, '').trim())
		.filter(Boolean);

	// Trigger phrases
	const keyPromptsBlock = extractMatch(KEY_PROMPTS_REGEX, content) ?? '';

	const triggerPhrases: string[] = [];

	for (const match of keyPromptsBlock.matchAll(QUOTED_PROMPT_REGEX)) {
		if (triggerPhrases.length >= 5) {
			break;
		}

		triggerPhrases.push(match[1]);
	}

	// Installation summary
	const firstClause = coverage.split('—')[1]?.trim() ?? coverage;

	const shortSummary =
		firstClause.length > 65 ? `${firstClause.slice(0, 62)}…` : firstClause;

	const scopeSentence = `${coverage.charAt(0).toUpperCase()}${coverage.slice(1)}.`;

	return {
		name,
		description,
		coverage,
		shortSummary,
		scopeSentence,
		triggerPhrases,
		supportedTasks,
	};
}

export async function parseSkill(skillName: string): Promise<SkillCatalogEntry | null> {
	try {
		const { content, frontmatter } = await readSkill(skillName);

		const name = frontmatter.name ?? skillName;

		const description = frontmatter.description ?? '';

		const author = frontmatter.metadata?.author ?? 'Tuan Duc Tran';

		const version = frontmatter.metadata?.version ?? '1.0.0';

		const supportedTasks = extractTasks(content);

		return {
			name,
			description,
			author,
			version,
			supportedTasks,
		};
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : 'Unknown error';

		consola.error(`Could not read ${skillName}/SKILL.md`);

		consola.error(message);

		return null;
	}
}
