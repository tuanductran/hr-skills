/**
 * Phase 6.2 — Automated content quality scoring
 *
 * Produces a repeatable 0-100 quality score per skill across three
 * dimensions — clarity, completeness, and example coverage — as a
 * **review aid, not a merge gate** (see docs/engineering/quality-scoring.md and
 * ROADMAP.md §6.2). A low score should prompt a maintainer to take a
 * closer look, not fail CI.
 *
 * This intentionally complements, not replaces, the existing hard
 * pass/fail structural checks in `validate.ts` (task count in [8, 12],
 * tips count in [4, 6], required sections present, etc.). Those checks
 * answer "is this skill well-formed?"; this module answers the softer
 * question "how good is this skill, given that it's well-formed?" — so a
 * skill can pass `bun run validate` and still score low here (e.g. a
 * skill with exactly 8 tasks but only 2 backing prompts).
 *
 * ## Dimensions
 *
 * - **Clarity** — is the frontmatter `description` long enough to be
 *   useful, does it state a concrete "Use when" trigger, and is the body
 *   written in reasonably short sentences?
 * - **Completeness** — how close is the skill to the *ideal* middle of
 *   the accepted ranges for tasks/tips/prompt-subtopics (not just inside
 *   the min/max band), and is the content body substantial rather than
 *   right at the minimum length?
 * - **Example coverage** — does the skill have `content/` and
 *   `examples/` material, and are supported tasks actually backed by a
 *   proportional number of quoted example prompts?
 *
 * ## Determinism & constraints
 *
 * Like duplicate-detection and semantic-validation, this is pure
 * string/regex/file-count arithmetic over files already on disk — no
 * network access, no AI/LLM calls, no embeddings. Same repository
 * content always produces the same score.
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SKILLS_DIR } from 'skills-ref';
import {
	KEY_PROMPTS_REGEX,
	MIN_CONTENT_LENGTH,
	MIN_DESCRIPTION_LENGTH,
	QUOTED_PROMPT_REGEX,
	TASKS_REGEX,
	TIPS_REGEX,
	USE_WHEN_REGEX,
} from '../shared/constants.js';
import { countFiles, discoverSkills } from '../shared/helpers.js';
import { extractMatch, parseSkillFrontmatter } from '../shared/parser.js';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Weight of the clarity dimension in the overall score. */
export const CLARITY_WEIGHT = 0.3;

/** Weight of the completeness dimension in the overall score. */
export const COMPLETENESS_WEIGHT = 0.4;

/** Weight of the example-coverage dimension in the overall score. */
export const EXAMPLE_COVERAGE_WEIGHT = 0.3;

/** Ideal description length band, in characters, for full clarity credit. */
const IDEAL_DESCRIPTION_LENGTH: readonly [number, number] = [80, 400];

/** Target maximum average words-per-sentence in the body for full credit. */
const IDEAL_MAX_AVG_SENTENCE_WORDS = 22;

/** Ideal (center-weighted) task count band — matches validate.ts's [8, 12] hard band. */
const IDEAL_TASK_COUNT: readonly [number, number] = [8, 12];

/** Ideal (center-weighted) tips count band — matches validate.ts's [4, 6] hard band. */
const IDEAL_TIPS_COUNT: readonly [number, number] = [4, 6];

/** Ideal prompt-subtopic count band — matches validate.ts's [3, 6] hard band. */
const IDEAL_PROMPT_SUBTOPICS: readonly [number, number] = [3, 6];

/** Content body length considered "substantial" for full completeness credit. */
const AMPLE_CONTENT_LENGTH = MIN_CONTENT_LENGTH * 2.5;

/** Score thresholds for the human-readable quality band. */
export const QUALITY_BAND_THRESHOLDS = {
	excellent: 85,
	good: 70,
	needsReview: 50,
} as const;

/** Human-readable quality band derived from the overall score. */
export type QualityBand = 'excellent' | 'good' | 'needs-review' | 'poor';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Score and supporting notes for a single quality dimension. */
export interface QualityDimensionScore {
	/** 0-100 score for this dimension. */
	score: number;
	/** Human-readable observations explaining the score (empty if perfect). */
	notes: string[];
}

/** Full quality-score report for one skill. */
export interface SkillQualityScore {
	/** Affected skill's directory name. */
	skill: string;
	/** How clear and well-triggered the skill's description/body is. */
	clarity: QualityDimensionScore;
	/** How complete the skill's sections are relative to the ideal band. */
	completeness: QualityDimensionScore;
	/** How well supported tasks are backed by prompts and example material. */
	exampleCoverage: QualityDimensionScore;
	/** Weighted overall score in [0, 100]. */
	overall: number;
	/** Human-readable band derived from {@link overall}. */
	band: QualityBand;
}

// ---------------------------------------------------------------------------
// Scoring helpers
// ---------------------------------------------------------------------------

function round(n: number): number {
	return Math.round(n * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, n));
}

/**
 * Score a value against an ideal band, giving full credit inside the band,
 * and linearly falling off outside it down to zero at `falloff` distance
 * past the nearest edge.
 */
function bandScore(
	value: number,
	[low, high]: readonly [number, number],
	falloff: number,
): number {
	if (value >= low && value <= high) return 100;
	const distance = value < low ? low - value : value - high;
	return clamp(100 - (distance / falloff) * 100, 0, 100);
}

function bandFor(overall: number): QualityBand {
	if (overall >= QUALITY_BAND_THRESHOLDS.excellent) return 'excellent';
	if (overall >= QUALITY_BAND_THRESHOLDS.good) return 'good';
	if (overall >= QUALITY_BAND_THRESHOLDS.needsReview) return 'needs-review';
	return 'poor';
}

/** Strip markdown structure (headings, list markers, code fences) down to prose for sentence analysis. */
function toProse(content: string): string {
	return content
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/^#{1,6}\s.*$/gm, ' ')
		.replace(/^[-*]\s+/gm, '')
		.replace(/[`*_]/g, '');
}

function averageSentenceWords(prose: string): number {
	const sentences = prose
		.split(/[.!?]+\s+/)
		.map((s) => s.trim())
		.filter((s) => s.split(/\s+/).length >= 3);

	if (sentences.length === 0) return 0;

	const totalWords = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0);
	return totalWords / sentences.length;
}

function countTasks(content: string): number {
	const block = extractMatch(TASKS_REGEX, content) ?? '';
	return block.split(/\r?\n/).filter((line) => line.trim().startsWith('- ')).length;
}

function countTips(content: string): number {
	const block = extractMatch(TIPS_REGEX, content) ?? '';
	return block.split(/\r?\n/).filter((line) => line.trim().startsWith('- ')).length;
}

function countPromptSubtopics(content: string): number {
	const block = extractMatch(KEY_PROMPTS_REGEX, content) ?? '';
	return block
		.split(/\n(?=### )/)
		.map((b) => b.trim())
		.filter(Boolean).length;
}

function countQuotedPrompts(content: string): number {
	return [...content.matchAll(QUOTED_PROMPT_REGEX)].length;
}

// ---------------------------------------------------------------------------
// Dimension scorers
// ---------------------------------------------------------------------------

/**
 * Score description length and "Use when" trigger presence, plus body
 * readability (average words per sentence).
 *
 * @param description - Skill's frontmatter description.
 * @param content - Full skill markdown body.
 * @returns Clarity dimension score with explanatory notes.
 */
export function scoreClarity(
	description: string,
	content: string,
): QualityDimensionScore {
	const notes: string[] = [];

	const lengthScore = bandScore(description.length, IDEAL_DESCRIPTION_LENGTH, 200);
	if (description.length < IDEAL_DESCRIPTION_LENGTH[0]) {
		notes.push(
			`Description is ${description.length} chars — below the ${IDEAL_DESCRIPTION_LENGTH[0]}-char ideal minimum (hard minimum is ${MIN_DESCRIPTION_LENGTH}).`,
		);
	} else if (description.length > IDEAL_DESCRIPTION_LENGTH[1]) {
		notes.push(
			`Description is ${description.length} chars — above the ${IDEAL_DESCRIPTION_LENGTH[1]}-char ideal maximum; consider tightening it.`,
		);
	}

	const hasUseWhen = USE_WHEN_REGEX.test(description);
	const triggerScore = hasUseWhen ? 100 : 0;
	if (!hasUseWhen) {
		notes.push(
			'Description has no "Use when" trigger clause — harder for the router to match intent.',
		);
	}

	const avgWords = averageSentenceWords(toProse(content));
	const readabilityScore =
		avgWords === 0 ? 100 : bandScore(avgWords, [0, IDEAL_MAX_AVG_SENTENCE_WORDS], 15);
	if (avgWords > IDEAL_MAX_AVG_SENTENCE_WORDS) {
		notes.push(
			`Body averages ${round(avgWords)} words/sentence — above the ${IDEAL_MAX_AVG_SENTENCE_WORDS}-word readability target.`,
		);
	}

	const score = round(lengthScore * 0.4 + triggerScore * 0.3 + readabilityScore * 0.3);
	return { score, notes };
}

/**
 * Score how close the skill's tasks/tips/prompt-subtopic counts and body
 * length are to the ideal (center-weighted) band, not just inside the hard
 * pass/fail range.
 *
 * @param content - Full skill markdown body.
 * @returns Completeness dimension score with explanatory notes.
 */
export function scoreCompleteness(content: string): QualityDimensionScore {
	const notes: string[] = [];

	const taskCount = countTasks(content);
	const taskScore = bandScore(taskCount, IDEAL_TASK_COUNT, 4);
	if (taskScore < 100) {
		notes.push(
			`${taskCount} supported tasks — ideal band is ${IDEAL_TASK_COUNT[0]}-${IDEAL_TASK_COUNT[1]}.`,
		);
	}

	const tipsCount = countTips(content);
	const tipsScore = bandScore(tipsCount, IDEAL_TIPS_COUNT, 3);
	if (tipsScore < 100) {
		notes.push(
			`${tipsCount} tips — ideal band is ${IDEAL_TIPS_COUNT[0]}-${IDEAL_TIPS_COUNT[1]}.`,
		);
	}

	const subtopicCount = countPromptSubtopics(content);
	const subtopicScore = bandScore(subtopicCount, IDEAL_PROMPT_SUBTOPICS, 3);
	if (subtopicScore < 100) {
		notes.push(
			`${subtopicCount} key-prompt subtopics — ideal band is ${IDEAL_PROMPT_SUBTOPICS[0]}-${IDEAL_PROMPT_SUBTOPICS[1]}.`,
		);
	}

	const lengthScore = bandScore(
		content.length,
		[AMPLE_CONTENT_LENGTH, Number.POSITIVE_INFINITY],
		MIN_CONTENT_LENGTH,
	);
	if (content.length < AMPLE_CONTENT_LENGTH) {
		notes.push(
			`SKILL.md body is ${content.length} chars — below the ${Math.round(AMPLE_CONTENT_LENGTH)}-char "ample content" target (hard minimum is ${MIN_CONTENT_LENGTH}).`,
		);
	}

	const score = round(
		taskScore * 0.3 + tipsScore * 0.2 + subtopicScore * 0.2 + lengthScore * 0.3,
	);
	return { score, notes };
}

/**
 * Score whether the skill has `content/`/`examples/` material and whether
 * supported tasks are proportionally backed by quoted example prompts.
 *
 * @param skillsDir - Absolute path to the `skills/` directory.
 * @param skillName - Skill directory name.
 * @param content - Full skill markdown body.
 * @returns Example-coverage dimension score with explanatory notes.
 */
export async function scoreExampleCoverage(
	skillsDir: string,
	skillName: string,
	content: string,
): Promise<QualityDimensionScore> {
	const notes: string[] = [];
	const skillDir = join(skillsDir, skillName);

	const contentFiles = await countFiles(join(skillDir, 'content'));
	const exampleFiles = await countFiles(join(skillDir, 'examples'));

	const contentScore = contentFiles > 0 ? 100 : 0;
	if (contentFiles === 0) notes.push('No content/ material found.');

	const exampleScore = clamp((exampleFiles / 2) * 100, 0, 100);
	if (exampleFiles === 0) {
		notes.push('No examples/ material found.');
	} else if (exampleFiles === 1) {
		notes.push(
			'Only 1 example file — consider adding a second for broader coverage.',
		);
	}

	const taskCount = countTasks(content);
	const quotedPromptCount = countQuotedPrompts(content);
	const promptDensity =
		taskCount === 0 ? 0 : clamp(quotedPromptCount / taskCount, 0, 1);
	const promptDensityScore = promptDensity * 100;
	if (taskCount > 0 && quotedPromptCount < taskCount) {
		notes.push(
			`${quotedPromptCount} quoted example prompts for ${taskCount} supported tasks — consider adding more so each task is backed by at least one prompt.`,
		);
	}

	const score = round(
		contentScore * 0.3 + exampleScore * 0.3 + promptDensityScore * 0.4,
	);
	return { score, notes };
}

// ---------------------------------------------------------------------------
// Top-level API
// ---------------------------------------------------------------------------

/**
 * Compute a full quality-score report for one skill.
 *
 * @param skillsDir - Absolute path to the directory containing skill
 *   folders (pass {@link SKILLS_DIR} in production). Accepting this as a
 *   parameter — rather than hardcoding {@link SKILLS_DIR} internally —
 *   keeps this function testable against a temp directory, matching
 *   `loadSkillSemanticContent()`'s pattern in semantic-validation.ts.
 * @param skillName - The skill's directory name (e.g. `"hr-onboarding"`).
 * @returns A promise resolving to the skill's {@link SkillQualityScore}.
 */
export async function scoreSkillQuality(
	skillsDir: string,
	skillName: string,
): Promise<SkillQualityScore> {
	let content = '';
	try {
		content = await readFile(join(skillsDir, skillName, 'SKILL.md'), 'utf8');
	} catch {
		// Missing SKILL.md — score against empty content; every dimension
		// naturally bottoms out and the notes explain why.
	}

	const frontmatter = parseSkillFrontmatter(content);

	const clarity = scoreClarity(frontmatter.description ?? '', content);
	const completeness = scoreCompleteness(content);
	const exampleCoverage = await scoreExampleCoverage(skillsDir, skillName, content);

	const overall = round(
		clarity.score * CLARITY_WEIGHT +
			completeness.score * COMPLETENESS_WEIGHT +
			exampleCoverage.score * EXAMPLE_COVERAGE_WEIGHT,
	);

	return {
		skill: skillName,
		clarity,
		completeness,
		exampleCoverage,
		overall,
		band: bandFor(overall),
	};
}

/**
 * Compute quality-score reports for every HR skill in the repository,
 * sorted alphabetically by skill name.
 *
 * @returns A promise resolving to an array of {@link SkillQualityScore}.
 */
export async function scoreAllSkills(): Promise<SkillQualityScore[]> {
	const skillNames = await discoverSkills();
	return Promise.all(skillNames.map((name) => scoreSkillQuality(SKILLS_DIR, name)));
}

/**
 * Compute quality-score reports for a specific subset of skills — used by
 * the CI workflow to score only the skills touched by a pull request
 * instead of the entire corpus.
 *
 * @param skillNames - Directory names of the skills to score.
 * @returns A promise resolving to an array of {@link SkillQualityScore}, in
 *   the same order as `skillNames`.
 */
export async function scoreSkills(skillNames: string[]): Promise<SkillQualityScore[]> {
	return Promise.all(skillNames.map((name) => scoreSkillQuality(SKILLS_DIR, name)));
}
