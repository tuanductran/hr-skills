import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SKILLS_DIR } from 'hr-skills-ref/server';
import {
	KEY_PROMPTS_REGEX,
	PERIOD_REGEX,
	QUOTED_PROMPT_REGEX,
	TASK_ITEM_REGEX,
	TASKS_REGEX,
	USE_WHEN_REGEX,
} from '../../shared/constants.js';
import { extractMatch, parseSkillFrontmatter } from '../../shared/parser.js';
import type { SkillFrontmatter } from '../../shared/schema.js';
import type { SkillMeta, SkillValidationIssue } from '../../shared/types.js';

/**
 * Read a skill's `SKILL.md` content and parse its YAML frontmatter.
 *
 * @param skillName - The skill's directory name (e.g. `"hr-onboarding"`).
 * @returns A promise that resolves to an object containing the raw `content`
 *   string and the parsed `frontmatter` record.
 * @throws If `SKILL.md` cannot be read from the filesystem.
 */
export async function readSkill(skillName: string): Promise<{
	content: string;
	frontmatter: SkillFrontmatter;
}> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');
	const content = await readFile(skillPath, 'utf8');

	return {
		content,
		frontmatter: parseSkillFrontmatter(content),
	};
}

/**
 * Read a skill's `SKILL.md` content, collecting a validation issue instead of
 * throwing if the file is not found.
 *
 * @param skillName - The skill's directory name (e.g. `"hr-onboarding"`).
 * @param errors - Mutable array to which a `SkillValidationIssue` is pushed
 *   if the file cannot be read.
 * @returns A promise that resolves to the raw file content, or `null` if the
 *   file was not found (in which case an issue has been added to `errors`).
 */
export async function readSkillContent(
	skillName: string,
	errors: SkillValidationIssue[],
): Promise<string | null> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');

	try {
		return await readFile(skillPath, 'utf8');
	} catch {
		errors.push({
			skill: skillName,
			message: 'SKILL.md file not found',
		});
		return null;
	}
}

/**
 * Derive display metadata from already-loaded `SKILL.md` content and its
 * parsed frontmatter — **pure, no filesystem I/O**.
 *
 * Callers that need to load a skill *and* derive its metadata in a single
 * step should use {@link parseSkillMeta}. Callers that already hold the
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

/**
 * Read a skill's `SKILL.md` and derive display metadata from it: the
 * description split at "Use when" into `coverage`/`scopeSentence`, the
 * `## Supported tasks` list, and up to 5 quoted example prompts from
 * `## Key prompts` as `triggerPhrases`.
 *
 * Lives here (not in `shared/parser.ts`) because it calls `readSkill`, which
 * reads from the filesystem — `shared/parser.ts` is part of the browser-safe
 * `client` surface and must stay pure. If a caller already has `SKILL.md`
 * content in hand (e.g. fetched over HTTP in a browser context), use
 * {@link deriveSkillMeta} directly with the already-loaded content instead.
 *
 * @throws If `SKILL.md` cannot be read from the filesystem (see `readSkill`).
 * @param skillName - Skill directory name to load.
 * @returns Display metadata derived from the skill's frontmatter and body.
 */
export async function parseSkillMeta(skillName: string): Promise<SkillMeta> {
	const { content, frontmatter } = await readSkill(skillName);
	return deriveSkillMeta(skillName, content, frontmatter);
}
