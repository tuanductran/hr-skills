import { createSkillBlock } from './helpers.js';

/**
 * Generate an `<available_skills>` XML block for inclusion in an agent system prompt.
 *
 * Each skill directory is represented as a `<skill>` element containing the
 * skill's `<name>`, `<description>`, and the absolute `<location>` of its
 * `SKILL.md` file. When `skillDirs` is empty, the function returns a valid
 * but empty `<available_skills>` block rather than throwing.
 *
 * @param skillDirs - An array of skill directory paths (absolute or relative).
 *   Each path is resolved to absolute before being embedded in the XML.
 * @returns A multi-line XML string wrapped in `<available_skills>` tags,
 *   ready to embed in a Claude system prompt.
 *
 * @example
 * const xml = toPrompt(['./skills/hr-recruiting', './skills/hr-onboarding']);
 * // <available_skills>
 * // <skill>
 * // <name>hr-recruiting</name>
 * // ...
 * // </skill>
 * // </available_skills>
 */
export function toPrompt(skillDirs: string[]): string {
	if (skillDirs.length === 0) return '<available_skills>\n</available_skills>';

	const skillBlocks = skillDirs.map(createSkillBlock);

	return ['<available_skills>', ...skillBlocks, '</available_skills>'].join('\n');
}
