/** Generate <available_skills> XML prompt block for agent system prompts. */

import { createSkillBlock } from './helpers.js';

/**
 * Generate an <available_skills> XML block
 * for inclusion in agent system prompts.
 *
 * @example
 * ```xml
 * <available_skills>
 * <skill>
 * <name>hr-recruiting</name>
 * <description>Recruiting and talent acquisition prompts</description>
 * <location>/path/to/hr-recruiting/SKILL.md</location>
 * </skill>
 * </available_skills>
 * ```
 */
export function toPrompt(skillDirs: string[]): string {
	if (skillDirs.length === 0) {
		return '<available_skills>\n</available_skills>';
	}

	const skillBlocks = skillDirs.map(createSkillBlock);

	return ['<available_skills>', ...skillBlocks, '</available_skills>'].join('\n');
}
