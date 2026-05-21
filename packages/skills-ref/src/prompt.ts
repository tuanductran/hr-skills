/** Generate <available_skills> XML prompt block for agent system prompts. */

import { join, resolve } from 'node:path';
import { findSkillMd, readProperties } from './parser.js';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

function createSkillBlock(skillDir: string): string {
	const resolvedPath = resolve(skillDir);

	const properties = readProperties(resolvedPath);

	const skillMdPath = findSkillMd(resolvedPath) ?? join(resolvedPath, 'SKILL.md');

	return [
		'<skill>',
		`<name>${escapeXml(properties.name)}</name>`,
		`<description>${escapeXml(properties.description)}</description>`,
		`<location>${escapeXml(skillMdPath)}</location>`,
		'</skill>',
	].join('\n');
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

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
