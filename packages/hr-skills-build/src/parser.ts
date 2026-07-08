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
import { extractMatch, readSkill } from './helpers.js';
import type { SkillFrontmatter, SkillMeta } from './types.js';

/**
 * Parse YAML frontmatter from a markdown document.
 */
export function parseSkillFrontmatter(content: string): SkillFrontmatter {
	const frontmatter = extractMatch(FRONTMATTER_REGEX, content);

	if (!frontmatter) return {};

	try {
		const parsed = parse(frontmatter);

		if (!parsed || typeof parsed !== 'object') return {};

		const frontmatterObject = parsed as {
			name?: unknown;
			description?: unknown;
			metadata?: {
				author?: unknown;
				version?: unknown;
			};
		};

		const result: SkillFrontmatter = {};

		if (typeof frontmatterObject.name === 'string')
			result.name = frontmatterObject.name.trim();

		if (typeof frontmatterObject.description === 'string')
			result.description = frontmatterObject.description.trim();

		const metadata: NonNullable<SkillFrontmatter['metadata']> = {};

		if (typeof frontmatterObject.metadata?.author === 'string')
			metadata.author = frontmatterObject.metadata.author.trim();

		if (typeof frontmatterObject.metadata?.version === 'string')
			metadata.version = frontmatterObject.metadata.version.trim();

		if (Object.keys(metadata).length > 0) result.metadata = metadata;

		return result;
	} catch {
		return {};
	}
}

/**
 * Parse skill metadata from a markdown document.
 */
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
		if (triggerPhrases.length >= 5) break;

		const [, prompt] = match;

		if (prompt !== undefined) triggerPhrases.push(prompt);
	}

	const scopeSentence = `${coverage.charAt(0).toUpperCase()}${coverage.slice(1)}.`;

	return {
		name,
		description,
		coverage,
		scopeSentence,
		triggerPhrases,
		supportedTasks,
	};
}
