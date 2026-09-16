import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { SKILLS_DIR } from './constants.js';
import { findSkillMd, readProperties } from './loader.js';

export {
	isPlainObject,
	sanitizeYamlValue,
	toStringOrUndefined,
} from '../shared/helpers.js';

import { escapeXml } from '../shared/helpers.js';

/**
 * Build an XML `<skill>` block for the given skill directory.
 *
 * The block includes the skill's `<name>`, `<description>`, and the absolute
 * `<location>` path to its `SKILL.md`. All values are XML-escaped.
 *
 * @param skillDir - The directory path (absolute or relative) of the skill.
 * @returns A multi-line XML string representing the skill.
 */
export function createSkillBlock(skillDir: string): string {
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

/**
 * Discover all HR skill directory names in the `skills/` folder, sorted
 * lexicographically. Only directories whose names begin with `"hr-"` are returned.
 *
 * This is hr-skills-ref's own copy of the same "discover hr-* directories"
 * logic that also exists as `hr-skills-build`'s
 * `shared/helpers.ts#discoverSkills()` and `registry/discovery.ts#getHrSkills()`.
 * Kept separate deliberately — hr-skills-ref must not depend on
 * hr-skills-build (it's the lower-level package the other one builds on)
 * — not an accidental duplication to merge.
 *
 * @returns A sorted array of skill directory names (not full paths).
 */
export function discoverSkillNames(): string[] {
	return readdirSync(SKILLS_DIR, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && entry.name.startsWith('hr-'))
		.map((entry) => entry.name)
		.sort();
}

/**
 * Create a temporary directory containing a single `SKILL.md` file with the
 * given content. The directory is created in the OS temp directory.
 *
 * Intended for use in tests that need a real filesystem path to pass to
 * skill-loading functions without polluting the repository.
 *
 * @param content - The UTF-8 content to write to `SKILL.md`.
 * @returns The absolute path to the newly created temporary directory.
 */
export function makeTempSkill(content: string): string {
	const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'));
	writeFileSync(join(tmp, 'SKILL.md'), content, 'utf8');
	return tmp;
}
