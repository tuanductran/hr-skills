import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const ROOT_DIR = join(__dirname, '../../..');

export const SKILLS_DIR = join(ROOT_DIR, 'skills');

export const TASK_ITEM_REGEX = /^- /;

export const HR_SKILL_PREFIX = 'hr-';

export const KEY_PROMPTS_REGEX =
	/## Key prompts\r?\n\r?\n([\s\S]*?)(?=\r?\n## |\r?\n---\r?\n|$)/;

export const QUOTED_PROMPT_REGEX = /^(?:\d+\. |[-*] )"([^"]+)"/gm;

export const USE_WHEN_REGEX = /Use when/i;

export const PERIOD_REGEX = /\.$/;

export const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;

export const TASKS_REGEX = /## Supported tasks\r?\n\r?\n([\s\S]*?)(?=\r?\n##|$)/;

export const REQUIRED_SECTIONS = ['## Supported tasks', '## Key prompts', '## Tips'];

export const MIN_DESCRIPTION_LENGTH = 50;

export const MIN_CONTENT_LENGTH = 1000;

export const TIPS_REGEX = /## Tips\r?\n\r?\n([\s\S]*?)(?=\r?\n##|$)/;

/**
 * Matches markdown links to skills, e.g. `[hr-recruiting](skills/hr-recruiting)`.
 * Shared by router consistency validation and registry dependency extraction
 * (CATEGORY_META.preamble in classifier.ts) so both stay in sync.
 */
export const SKILL_LINK_REGEX = /\[hr-[a-z0-9-]+\]\(skills\/(hr-[a-z0-9-]+)\)/g;

export const REGISTRY_SCHEMA_VERSION = 1;

const EVAL_DIR = join(__dirname, '..', 'eval');

export const EVAL_DATASETS_DIR = join(EVAL_DIR, 'datasets');

export const EVAL_GOLDEN_DIR = join(EVAL_DIR, 'golden');
