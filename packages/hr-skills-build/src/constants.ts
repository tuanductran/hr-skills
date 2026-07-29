import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the repository root (three levels up from `src/`). */
export const ROOT_DIR = join(__dirname, '../../..');

/** Absolute path to the `skills/` directory at the repo root. */
export const SKILLS_DIR = join(ROOT_DIR, 'skills');

/** Matches a markdown task-list item line, e.g. `- some task`. */
export const TASK_ITEM_REGEX = /^- /;

/** The directory-name prefix shared by all HR skill folders, e.g. `hr-`. */
export const HR_SKILL_PREFIX = 'hr-';

/**
 * Captures the body of a `## Key prompts` section (including sub-headings)
 * up to the next `##` section, a `---` divider, or end of file.
 * Capture group 1 contains the raw block text.
 */
export const KEY_PROMPTS_REGEX =
	/## Key prompts\r?\n\r?\n([\s\S]*?)(?=\r?\n## |\r?\n---\r?\n|$)/;

/**
 * Matches a numbered or bulleted quoted prompt line inside a Key prompts block,
 * e.g. `1. "Create a job description for..."` or `- "Draft an offer letter..."`.
 * Capture group 1 contains the quoted prompt text (without surrounding quotes).
 */
export const QUOTED_PROMPT_REGEX = /^(?:\d+\. |[-*] )"([^"]+)"/gm;

/**
 * Case-insensitive match for the phrase `Use when` inside a skill description,
 * used to split a description into its "coverage" and "trigger" clauses.
 */
export const USE_WHEN_REGEX = /Use when/i;

/** Matches a trailing period at the end of a string — used to strip it before appending a new one. */
export const PERIOD_REGEX = /\.$/;

/**
 * Captures YAML frontmatter delimited by `---` at the start of a markdown file.
 * Capture group 1 contains the raw YAML text between the delimiters.
 */
export const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * Captures the body of a `## Supported tasks` section up to the next `##` heading
 * or end of file. Capture group 1 contains the raw block text.
 */
export const TASKS_REGEX = /## Supported tasks\r?\n\r?\n([\s\S]*?)(?=\r?\n##|$)/;

/**
 * The three markdown section headings that every skill SKILL.md must contain.
 * Validated by `validateRequiredSections` in validate.ts.
 */
export const REQUIRED_SECTIONS = ['## Supported tasks', '## Key prompts', '## Tips'];

/** Minimum character length for a skill's frontmatter `description` field. */
export const MIN_DESCRIPTION_LENGTH = 50;

/** Minimum character length for the full SKILL.md content body. */
export const MIN_CONTENT_LENGTH = 1000;

/**
 * Captures the body of a `## Tips` section up to the next `##` heading or end of file.
 * Capture group 1 contains the raw block text.
 */
export const TIPS_REGEX = /## Tips\r?\n\r?\n([\s\S]*?)(?=\r?\n##|$)/;

/**
 * Matches markdown links that reference another skill, e.g.
 * `[hr-recruiting](skills/hr-recruiting)`.
 * Capture group 1 contains the skill ID (`hr-<slug>`).
 *
 * Shared by router consistency validation and registry dependency extraction
 * (`CATEGORY_META.preamble` in classifier.ts) so both stay in sync.
 */
export const SKILL_LINK_REGEX = /\[hr-[a-z0-9-]+\]\(skills\/(hr-[a-z0-9-]+)\)/g;

/**
 * Schema version for `registry/skills.json`.
 * Increment this when the shape of {@link RegistryEntry} changes in a breaking way.
 */
export const REGISTRY_SCHEMA_VERSION = 1;

/** Absolute path to the `eval/` directory inside `hr-skills-build`. */
const EVAL_DIR = join(__dirname, '..', 'eval');

/** Absolute path to the `eval/datasets/` directory containing hand-authored evaluation cases. */
export const EVAL_DATASETS_DIR = join(EVAL_DIR, 'datasets');

/** Absolute path to the `eval/golden/` directory containing committed golden fixtures. */
export const EVAL_GOLDEN_DIR = join(EVAL_DIR, 'golden');

/** Absolute path to the generated relevance-signals artifact at the repo root. */
export const RELEVANCE_SIGNALS_PATH = join(
	ROOT_DIR,
	'registry',
	'relevance-signals.json',
);
