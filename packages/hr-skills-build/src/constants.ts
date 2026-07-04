import { join } from 'node:path';

export const ROOT_DIR = join(import.meta.dir, '../../..');

export const SKILLS_DIR = join(ROOT_DIR, 'skills');

export const TASK_ITEM_REGEX = /^- /;

export const HR_SKILL_PREFIX = 'hr-';

export const KEY_PROMPTS_REGEX = /## Key prompts\n\n([\s\S]*?)(?=\n## Tips|\n---\n|$)/;

export const QUOTED_PROMPT_REGEX = /^(?:\d+\. |[-*] )"([^"]+)"/gm;

export const AGENTS_TABLE_REGEX = /\| Skill \| Scope \|\n\|[-|]+\|\n[\s\S]*?(?=\n## )/;

export const USE_WHEN_REGEX = /Use when/i;

export const PERIOD_REGEX = /\.$/;

export const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;

export const TASKS_REGEX = /## Supported tasks\r?\n\r?\n([\s\S]*?)(?=\r?\n##|$)/;

export const REQUIRED_SECTIONS = ['## Supported tasks', '## Key prompts', '## Tips'];

export const MIN_DESCRIPTION_LENGTH = 50;

export const MIN_CONTENT_LENGTH = 1000;

export const TIPS_REGEX = /## Tips\r?\n\r?\n([\s\S]*?)(?=\r?\n##|$)/;
