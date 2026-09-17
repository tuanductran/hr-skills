import {
	KEY_PROMPTS_REGEX,
	PERIOD_REGEX,
	QUOTED_PROMPT_REGEX,
	TASK_ITEM_REGEX,
	TASKS_REGEX,
	USE_WHEN_REGEX,
} from '../../shared/constants.js';
import { extractMatch } from '../../shared/parser.js';
import type { SkillFrontmatter } from '../../shared/schema.js';
import type { SkillMeta } from '../../shared/types.js';

/**
 * Derive display metadata from already-loaded `SKILL.md` content and its
 * parsed frontmatter — **pure, no filesystem I/O**.
 *
 * Callers that need to load a skill *and* derive its metadata in a single
 * step should use `parseSkillMeta`. Callers that already hold the
 * loaded content (e.g. `buildRegistry()`, which reads each skill once and
 * reuses the result for both registry construction and metadata derivation)
 * should call this function directly to avoid a second `SKILL.md` read.
 *
 * @param skillName - The skill directory name, used as a display-name
 *   fallback when `frontmatter.name` is absent.
 * @param content - The raw `SKILL.md` file content.
 * @param frontmatter - The parsed YAML frontmatter from the same file.
 * @returns Display metadata derived from the frontmatter and body.
 */
export function deriveSkillMeta(
	skillName: string,
	content: string,
	frontmatter: SkillFrontmatter,
): SkillMeta {
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
