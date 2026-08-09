import * as v from 'valibot';
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
import type { SkillFrontmatter } from './schema.js';
import { SkillFrontmatterSchema } from './schema.js';
import type { SkillMeta } from './types.js';

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

/**
 * Read a skill's `SKILL.md` and derive display metadata from it: the
 * description split at "Use when" into `coverage`/`scopeSentence`, the
 * `## Supported tasks` list, and up to 5 quoted example prompts from
 * `## Key prompts` as `triggerPhrases`.
 *
 * @throws If `SKILL.md` cannot be read from the filesystem (see `readSkill`).
 * @param skillName - Skill directory name to load.
 * @returns Display metadata derived from the skill's frontmatter and body.
 */
export async function parseSkillMeta(skillName: string): Promise<SkillMeta> {
	const { content, frontmatter } = await readSkill(skillName);

	const name = frontmatter.name ?? skillName;
	const description = frontmatter.description ?? '';

	const useWhenIndex = description.search(USE_WHEN_REGEX);

	const coverage =
		useWhenIndex !== -1
			? description.slice(0, useWhenIndex).trim().replace(PERIOD_REGEX, '')
			: description.trim().replace(PERIOD_REGEX, '');

	const tasksBlock = extractMatch(TASKS_REGEX, content) ?? '';

	const supportedTasks = tasksBlock
		.split('\n')
		.filter((line) => TASK_ITEM_REGEX.test(line))
		.map((line) => line.replace(TASK_ITEM_REGEX, '').trim())
		.filter(Boolean);

	const keyPromptsBlock = extractMatch(KEY_PROMPTS_REGEX, content) ?? '';

	const triggerPhrases: string[] = [];

	for (const match of keyPromptsBlock.matchAll(QUOTED_PROMPT_REGEX)) {
		if (triggerPhrases.length >= 5) break;

		const [, prompt] = match;

		if (prompt) {
			triggerPhrases.push(prompt);
		}
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
