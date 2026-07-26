import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '../../..');

/** Absolute path to the `skills/` directory at the repository root. */
export const SKILLS_DIR = join(ROOT_DIR, 'skills');

/**
 * The YAML frontmatter key used to specify which Claude tools a skill is allowed to invoke.
 * Maps to the `allowedTools` property in {@link SkillProperties}.
 */
export const ALLOWED_TOOLS_KEY = 'allowed-tools';

/**
 * Matches any non-whitespace character.
 * Used when scanning YAML lines for their indentation level.
 */
export const NON_WHITESPACE_REGEX = /\S/u;

/** The delimiter string that opens and closes a YAML frontmatter block in `SKILL.md`. */
export const FRONTMATTER_DELIMITER = '---';

/**
 * Accepted filenames for a skill's primary markdown file, in priority order.
 * `"SKILL.md"` is the canonical name; `"skill.md"` is accepted as a fallback
 * for case-insensitive filesystems.
 */
export const SKILL_MD_FILENAMES = ['SKILL.md', 'skill.md'] as const;

/** Maximum allowed character length for the `name` frontmatter field. */
export const MAX_SKILL_NAME_LENGTH = 64;

/** Maximum allowed character length for the `description` frontmatter field. */
export const MAX_DESCRIPTION_LENGTH = 1024;

/** Maximum allowed character length for the `compatibility` frontmatter field. */
export const MAX_COMPATIBILITY_LENGTH = 500;

/**
 * Valid skill name pattern: lowercase letters, digits, and hyphens only.
 * Must be tested against the normalized (trimmed, lowercased) name.
 */
export const SKILL_NAME_REGEX = /^[a-z0-9-]+$/;

/**
 * The set of YAML frontmatter field names recognized by the skill schema.
 * Any key not in this set is treated as an unexpected field during validation.
 */
export const ALLOWED_FRONTMATTER_FIELDS = new Set<string>([
	'name',
	'description',
	'license',
	'allowed-tools',
	'metadata',
	'compatibility',
]);

/**
 * Lookup map of XML special characters to their escaped entity equivalents.
 * Used by `escapeXml` in `helpers.ts` when building `<skill>` XML blocks.
 */
export const XML_ESCAPES = new Map<string, string>([
	['&', '&amp;'],
	['<', '&lt;'],
	['>', '&gt;'],
	['"', '&quot;'],
	["'", '&apos;'],
]);
