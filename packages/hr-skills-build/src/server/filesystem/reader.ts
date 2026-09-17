import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SKILLS_DIR } from 'hr-skills-ref/server';
import { parseSkillFrontmatter } from '../../shared/parser.js';
import type { SkillFrontmatter } from '../../shared/schema.js';
import type { SkillMeta, SkillValidationIssue } from '../../shared/types.js';
import { deriveSkillMeta } from './metadata.js';

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
 * Read a skill's `SKILL.md` and derive display metadata from it: the
 * description split at "Use when" into `coverage`/`scopeSentence`, the
 * `## Supported tasks` list, and up to 5 quoted example prompts from
 * `## Key prompts` as `triggerPhrases`.
 *
 * Lives here (not in `shared/parser.ts`) because it calls `readSkill`, which
 * reads from the filesystem — `shared/parser.ts` is part of the browser-safe
 * `client` surface and must stay pure.
 *
 * @throws If `SKILL.md` cannot be read from the filesystem (see `readSkill`).
 * @param skillName - Skill directory name to load.
 * @returns Display metadata derived from the skill's frontmatter and body.
 */
export async function parseSkillMeta(skillName: string): Promise<SkillMeta> {
	const { content, frontmatter } = await readSkill(skillName);
	return deriveSkillMeta(skillName, content, frontmatter);
}
