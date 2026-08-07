import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { SKILLS_DIR } from 'skills-ref';
import { HR_SKILL_PREFIX } from './constants.js';
import { parseSkillFrontmatter } from './parser.js';
import type { SkillFrontmatter } from './schema.js';
import type {
	ExecutionStep,
	RuntimeContext,
	SkillValidationIssue,
	Tier,
} from './types.js';

/**
 * Extract and trim the first capture group from a regex match against `content`.
 *
 * @param regex - A regular expression with at least one capture group.
 * @param content - The string to search.
 * @returns The trimmed contents of capture group 1, or `null` if the regex did not match.
 */
export function extractMatch(regex: RegExp, content: string): string | null {
	return regex.exec(content)?.[1]?.trim() ?? null;
}

/**
 * Discover all HR skill directory names in `skills/`, sorted lexicographically.
 *
 * Only directories whose names start with `HR_SKILL_PREFIX` (`"hr-"`) are returned.
 *
 * @returns A promise that resolves to a sorted array of skill directory names.
 */
/**
 * Discover all `hr-*` skill directory names under `skills/`, sorted.
 *
 * Does not verify `SKILL.md` exists in each directory — callers that need
 * that guarantee (e.g. filtering out incomplete/in-progress skill folders)
 * should use `registry/discovery.ts#getHrSkills()` instead, which checks
 * for `SKILL.md` via `fs.access` and supports a configurable prefix. This
 * function is the lighter-weight default used by most of `validation/`,
 * `build/`, and `search/`, which read (and error-handle) `SKILL.md`
 * themselves immediately after.
 */
export async function discoverSkills(): Promise<string[]> {
	const entries = await readdir(SKILLS_DIR, {
		withFileTypes: true,
	});

	return entries
		.filter((entry) => entry.isDirectory() && entry.name.startsWith(HR_SKILL_PREFIX))
		.map((entry) => entry.name)
		.sort();
}

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
	const content = await Bun.file(skillPath).text();

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
 * Normalize an author name to Title Case.
 *
 * Each whitespace-separated word is capitalized; all other characters are
 * lower-cased. Leading and trailing whitespace is stripped.
 *
 * @param name - The raw author string to normalize.
 * @returns The normalized Title Case author name.
 *
 * @example
 * normalizeAuthorName('john DOE') // => 'John Doe'
 */
export function normalizeAuthorName(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
}

/**
 * Return the first element of a non-empty readonly array.
 *
 * @param items - A readonly array that must contain at least one element.
 * @returns The first element of `items`.
 * @throws {Error} If `items` is empty.
 */
export function first<T>(items: readonly T[]): T {
	const first = items.at(0);

	if (first === undefined)
		throw new Error('Expected array to contain at least one element.');

	return first;
}

/**
 * Check whether a filesystem path exists and is a directory.
 *
 * @param path - The filesystem path to check.
 * @returns A promise that resolves to `true` if `path` is an existing directory,
 *   or `false` if it does not exist or is not a directory.
 */
export async function dirExists(path: string): Promise<boolean> {
	try {
		const s = await stat(path);
		return s.isDirectory();
	} catch {
		return false;
	}
}

/**
 * Count the number of `.md` files directly inside a directory.
 * Returns `0` if the directory does not exist or cannot be read.
 *
 * @param dirPath - The absolute path to the directory to inspect.
 * @returns A promise that resolves to the count of `.md` files found.
 */
export async function countFiles(dirPath: string): Promise<number> {
	try {
		const entries = await readdir(dirPath);
		return entries.filter((f) => f.endsWith('.md')).length;
	} catch {
		return 0;
	}
}

/**
 * Compute a skill's maturity tier based on which optional subdirectories it contains.
 *
 * Tier rules:
 * - `'full'`    — all three subdirectories (`content/`, `prompts/`, `examples/`) are present.
 * - `'bare'`    — none of the subdirectories are present.
 * - `'partial'` — one or two subdirectories are present.
 *
 * This is the single source of truth for tier classification — used by both
 * `build/generate-skill-matrix.ts` and `registry/registry.ts` so the matrix
 * and the registry can never disagree about a skill's tier.
 *
 * @param hasContent - Whether the `content/` subdirectory exists and is non-empty.
 * @param hasPrompts - Whether the `prompts/` subdirectory exists and is non-empty.
 * @param hasExamples - Whether the `examples/` subdirectory exists and is non-empty.
 * @returns The computed {@link Tier} for the skill.
 */
export function computeTier(
	hasContent: boolean,
	hasPrompts: boolean,
	hasExamples: boolean,
): Tier {
	const subDirCount = [hasContent, hasPrompts, hasExamples].filter(Boolean).length;

	return subDirCount === 0 ? 'bare' : subDirCount === 3 ? 'full' : 'partial';
}

/**
 * Return the emoji icon associated with a skill maturity tier.
 *
 * - `'full'`    → `'🟢'`
 * - `'partial'` → `'🟡'`
 * - `'bare'`    → `'🔴'`
 *
 * @param tier - The skill's maturity tier.
 * @returns A single emoji string representing the tier.
 */
export function tierIcon(tier: Tier): string {
	if (tier === 'full') return '🟢';
	if (tier === 'partial') return '🟡';
	return '🔴';
}

/**
 * Return the human-readable display label for a skill maturity tier.
 *
 * @param tier - The skill's maturity tier.
 * @returns `'Full'`, `'Partial'`, or `'Bare'`.
 */
export function tierLabel(tier: Tier): string {
	if (tier === 'full') return 'Full';
	if (tier === 'partial') return 'Partial';
	return 'Bare';
}

/**
 * Build a SKILL.md content string with a `## Key prompts` section containing
 * `subtopics` H3 sub-headings, each with `promptsEach` numbered quoted prompts.
 *
 * Used in unit tests to generate fixture content of a specific size without
 * manually crafting strings.
 *
 * @param subtopics - Number of H3 sub-heading blocks to generate.
 * @param promptsEach - Number of quoted prompts to generate under each sub-heading.
 * @returns A full SKILL.md string with valid frontmatter and the generated prompts section.
 */
export function makeKeyPromptsContent(subtopics: number, promptsEach: number): string {
	const blocks = Array.from({ length: subtopics }, (_, si) => {
		const prompts = Array.from(
			{ length: promptsEach },
			(_, pi) => `${pi + 1}. "Prompt ${si + 1}-${pi + 1} for [role]."`,
		).join('\n');
		return `### Subtopic ${si + 1}\n\n${prompts}`;
	});

	return [
		'---',
		'name: hr-test',
		'description: This is a sufficiently long description for validation purposes.',
		'metadata:',
		'  author: Tuan Duc Tran',
		'  version: "1.0.0"',
		'---',
		'',
		'## Key prompts',
		'',
		...blocks,
		'',
		'## Tips',
		'',
		'- Tip',
	].join('\n');
}

/**
 * A stub `StepExecutorFn` that returns a deterministic placeholder output
 * instead of actually invoking a skill. Shared by `cli/execute-plan.ts` (CLI
 * demonstration) and `evaluation/evaluate.ts` (so evaluation results
 * characterize the Planner/Runtime's sequencing and validation behavior, not
 * a divergent stand-in) — previously duplicated independently in both files.
 *
 * Real integrations should supply their own `StepExecutorFn` that actually
 * invokes the skill (for example, loading its SKILL.md and prompting a model).
 */
export function stubStepExecutor(step: ExecutionStep, context: RuntimeContext): unknown {
	return {
		skillId: step.skillId,
		note: `Stub output for ${step.skillId}`,
		precedingSteps: Object.keys(context.toObject()),
	};
}
