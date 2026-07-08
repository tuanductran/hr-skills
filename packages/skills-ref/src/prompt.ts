import { createSkillBlock } from './helpers.js';

/**
 * Generate an <available_skills> XML block for inclusion in agent system prompts.
 */
export function toPrompt(skillDirs: string[]): string {
	if (skillDirs.length === 0) return '<available_skills>\n</available_skills>';

	const skillBlocks = skillDirs.map(createSkillBlock);

	return ['<available_skills>', ...skillBlocks, '</available_skills>'].join('\n');
}
