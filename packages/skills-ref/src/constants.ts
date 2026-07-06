import { join } from 'node:path';

const ROOT_DIR = join(import.meta.dir, '../../..');

export const SKILLS_DIR = join(ROOT_DIR, 'skills');

export const ALLOWED_TOOLS_KEY = 'allowed-tools';

export const NON_WHITESPACE_REGEX = /\S/u;

export const FRONTMATTER_DELIMITER = '---';

export const SKILL_MD_FILENAMES = ['SKILL.md', 'skill.md'] as const;

export const MAX_SKILL_NAME_LENGTH = 64;
export const MAX_DESCRIPTION_LENGTH = 1024;
export const MAX_COMPATIBILITY_LENGTH = 500;

export const SKILL_NAME_REGEX = /^[a-z0-9-]+$/;

export const ALLOWED_FRONTMATTER_FIELDS = new Set<string>([
	'name',
	'description',
	'license',
	'allowed-tools',
	'metadata',
	'compatibility',
]);

export const XML_ESCAPES = new Map<string, string>([
	['&', '&amp;'],
	['<', '&lt;'],
	['>', '&gt;'],
	['"', '&quot;'],
	["'", '&apos;'],
]);
