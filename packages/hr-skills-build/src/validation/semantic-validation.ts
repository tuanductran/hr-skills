/**
 * Phase 6.2 — Semantic validation for prompts and examples
 *
 * Checks whether each skill's `prompts/` and `examples/` material is
 * actually consistent with the skill's documented purpose (frontmatter
 * `description` + SKILL.md body + `content/`), using the same deterministic,
 * heuristic approach established by `detect-duplicates.ts`.
 *
 * This module reuses `tokenise()` and `jaccardSimilarity()` from
 * `detect-duplicates.ts` so both quality checks share one normalisation and
 * similarity implementation — there is exactly one definition of "how
 * similar are two pieces of HR-skill text" in the codebase.
 *
 * ## Heuristic overview
 *
 * For every skill the validator builds three token sets:
 *
 * - **purpose** — normalised tokens from `description` + SKILL.md body +
 *   `content/*.md` (the skill's documented intent).
 * - **prompts** — normalised tokens from `prompts/*.md`.
 * - **examples** — normalised tokens from `examples/*.md`.
 *
 * Four independent, explainable checks are run per skill:
 *
 * 1. **Prompt drift** — Jaccard(purpose, prompts) below
 *    {@link PROMPT_DRIFT_THRESHOLD} means the prompts share almost no
 *    vocabulary with the skill's own purpose.
 * 2. **Example drift** — Jaccard(purpose, examples) below
 *    {@link EXAMPLE_DRIFT_THRESHOLD}, same idea for `examples/`.
 * 3. **Possible copy** — for `prompts/` and `examples/` independently: if
 *    the token set matches *another* skill's purpose tokens meaningfully
 *    better than it matches its own (by at least {@link COPY_MARGIN}, and
 *    the other skill's score clears {@link COPY_MIN_OTHER_SCORE}), the
 *    material likely originated from that other skill.
 * 4. **Missing concept coverage** — the top
 *    {@link TOP_KEYWORD_COUNT} most frequent non-stop-word tokens in the
 *    `description` are extracted as the skill's "primary concepts". If
 *    fewer than {@link MIN_COVERAGE_RATIO} of them appear anywhere across
 *    `prompts/`, `examples/`, and `content/` combined, the supporting
 *    material is flagged for not reinforcing the skill's stated focus.
 *
 * All four checks are deterministic: same repository content always
 * produces the same findings, in the same order (skills processed
 * alphabetically; findings sorted by skill, then by heuristic name).
 *
 * ## Threshold calibration
 *
 * The default thresholds were calibrated against this repository's actual
 * skill corpus (146 skills with `prompts/`, all with `examples/`) so that,
 * as of the calibration date, zero findings are produced against genuine,
 * on-topic content — every threshold sits below the worst (lowest
 * legitimate) score observed in the corpus. This keeps the check
 * conservative: it is tuned to catch obviously unrelated or copied
 * material, not to nitpick loosely-related phrasing.
 *
 * ## Severity
 *
 * All findings are reported as **warnings** (informational quality
 * signals), matching duplicate-content detection and the same rationale
 * given in `docs/duplicate-detection.md`: keyword/Jaccard heuristics are a
 * useful review aid but cannot reliably prove semantic drift beyond doubt,
 * so they should prompt a maintainer look rather than fail the build.
 *
 * ## Constraints honoured
 *
 * No network access, no AI/LLM calls, no embeddings, no vector search — the
 * entire check is pure, synchronous-friendly string/set arithmetic over
 * files already read from disk.
 */

import { join } from 'node:path';
import type { SkillValidationIssue } from '../shared/types.js';
import { jaccardSimilarity, tokenise } from './detect-duplicates.js';
import {
	extractDescription,
	readAllMarkdown,
	readRawSkillMd,
	stripFrontmatter,
} from './skill-content-loading.js';

// ---------------------------------------------------------------------------
// Configuration — thresholds
// ---------------------------------------------------------------------------

/**
 * Minimum Jaccard similarity between a skill's purpose tokens and its
 * `prompts/` tokens. Below this, prompts are considered drifted from the
 * skill's documented purpose. Calibrated below the lowest legitimate score
 * (~0.018) observed across this repository's skills.
 */
export const PROMPT_DRIFT_THRESHOLD = 0.015;

/**
 * Minimum Jaccard similarity between a skill's purpose tokens and its
 * `examples/` tokens. Calibrated below the lowest legitimate score
 * (~0.041) observed across this repository's skills.
 */
export const EXAMPLE_DRIFT_THRESHOLD = 0.03;

/**
 * Minimum margin by which another skill's purpose tokens must out-score a
 * skill's own purpose tokens (against the same prompts/examples tokens)
 * before the material is flagged as possibly copied. Calibrated above the
 * highest legitimate margin (~0.059) observed across this repository.
 */
export const COPY_MARGIN = 0.06;

/**
 * Minimum absolute similarity to the *other* skill's purpose tokens
 * required before a possible-copy finding is reported, so two skills that
 * both score near-zero against everything don't trigger on margin alone.
 */
export const COPY_MIN_OTHER_SCORE = 0.12;

/** Number of top description keywords used for the concept-coverage check. */
const TOP_KEYWORD_COUNT = 5;

/**
 * Minimum fraction of top description keywords that must appear somewhere
 * in `prompts/` + `examples/` + `content/` combined. Calibrated below the
 * lowest legitimate ratio (0.4) observed across this repository.
 */
export const MIN_COVERAGE_RATIO = 0.3;

/**
 * Skills whose purpose token set is smaller than this are skipped for
 * drift/coverage checks — too little documented text to compare against
 * reliably, so flagging would be noise rather than signal.
 */
export const MIN_PURPOSE_TOKENS = 5;

// ---------------------------------------------------------------------------
// Skill semantic content
// ---------------------------------------------------------------------------

/** One skill's token sets and raw description, used for semantic checks. */
export interface SkillSemanticContent {
	/** Skill directory name, e.g. "hr-onboarding". */
	name: string;
	/** Raw frontmatter description string (pre-tokenisation). */
	description: string;
	/** Normalised tokens from description + SKILL.md body + content/. */
	purposeTokens: string[];
	/** Normalised tokens from prompts/*.md. Empty when prompts/ is absent. */
	promptsTokens: string[];
	/** Normalised tokens from examples/*.md. Empty when examples/ is absent. */
	examplesTokens: string[];
	/** Normalised tokens from content/*.md alone. Empty when content/ is absent. */
	contentTokens: string[];
	/** Whether prompts/ exists and contains at least one .md file. */
	hasPrompts: boolean;
	/** Whether examples/ exists and contains at least one .md file. */
	hasExamples: boolean;
}

/**
 * Load one skill's semantic content: purpose/prompts/examples token sets.
 *
 * @param skillsDir - Absolute path to the repository's `skills/` directory.
 * @param skillName - The skill's directory name (e.g. `"hr-onboarding"`).
 * @returns The skill's purpose/prompt/example token sets and content flags.
 */
export async function loadSkillSemanticContent(
	skillsDir: string,
	skillName: string,
): Promise<SkillSemanticContent> {
	const skillDir = join(skillsDir, skillName);
	const raw = await readRawSkillMd(skillDir);

	const description = extractDescription(raw);
	const body = stripFrontmatter(raw);
	const contentBody = await readAllMarkdown(join(skillDir, 'content'));
	const promptsBody = await readAllMarkdown(join(skillDir, 'prompts'));
	const examplesBody = await readAllMarkdown(join(skillDir, 'examples'));

	return {
		name: skillName,
		description,
		purposeTokens: tokenise(
			[description, body, contentBody].filter(Boolean).join('\n'),
		),
		promptsTokens: tokenise(promptsBody),
		examplesTokens: tokenise(examplesBody),
		contentTokens: tokenise(contentBody),
		hasPrompts: promptsBody.trim().length > 0,
		hasExamples: examplesBody.trim().length > 0,
	};
}

// ---------------------------------------------------------------------------
// Primary-concept keyword extraction
// ---------------------------------------------------------------------------

/**
 * Extract the top `count` most frequent normalised tokens from `description`.
 * Ties are broken alphabetically so the result is deterministic.
 *
 * @param description - Skill's frontmatter description.
 * @param count - Maximum number of keywords to return.
 * @returns Top tokens, most frequent first.
 */
export function topKeywords(description: string, count = TOP_KEYWORD_COUNT): string[] {
	const tokens = tokenise(description);
	const freq = new Map<string, number>();
	for (const t of tokens) freq.set(t, (freq.get(t) ?? 0) + 1);

	return [...freq.entries()]
		.sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
		.slice(0, count)
		.map(([token]) => token);
}

// ---------------------------------------------------------------------------
// Finding type
// ---------------------------------------------------------------------------

/** Which of the four heuristics produced a given finding. */
type SemanticHeuristic =
	| 'prompt-drift'
	| 'example-drift'
	| 'possible-copy-prompts'
	| 'possible-copy-examples'
	| 'missing-coverage';

/** A single semantic-consistency finding for one skill. */
export interface SemanticFinding {
	/** Affected skill's directory name. */
	skill: string;
	/** Affected subdirectory/file, e.g. "prompts/", "examples/". */
	file: string;
	/** Which heuristic triggered this finding. */
	heuristic: SemanticHeuristic;
	/** Deterministic confidence score in [0, 1] — higher means more confident. */
	confidence: number;
	/** Human-readable explanation, including the heuristic and suggested action. */
	explanation: string;
}

function round(n: number): number {
	return Math.round(n * 10000) / 10000;
}

function pct(n: number): string {
	return `${Math.round(n * 100)}%`;
}

// ---------------------------------------------------------------------------
// Per-skill checks
// ---------------------------------------------------------------------------

/**
 * Check `prompts/` and `examples/` for drift against a skill's own purpose
 * tokens (checks 1 and 2), skipping skills whose purpose vocabulary is too
 * small to compare against reliably.
 *
 * @param skill - The skill's semantic content, from `loadSkillSemanticContent`.
 * @returns Drift findings, empty when nothing is flagged.
 */
export function checkDrift(skill: SkillSemanticContent): SemanticFinding[] {
	const findings: SemanticFinding[] = [];
	if (skill.purposeTokens.length < MIN_PURPOSE_TOKENS) return findings;

	if (skill.hasPrompts) {
		const score = jaccardSimilarity(skill.purposeTokens, skill.promptsTokens);
		if (score < PROMPT_DRIFT_THRESHOLD) {
			findings.push({
				skill: skill.name,
				file: 'prompts/',
				heuristic: 'prompt-drift',
				confidence: round(1 - score / PROMPT_DRIFT_THRESHOLD),
				explanation:
					`prompts/ shares almost no vocabulary with this skill's description/content ` +
					`(Jaccard ${pct(score)}, below the ${pct(PROMPT_DRIFT_THRESHOLD)} threshold). ` +
					`Review whether these prompts actually belong to a different HR capability.`,
			});
		}
	}

	if (skill.hasExamples) {
		const score = jaccardSimilarity(skill.purposeTokens, skill.examplesTokens);
		if (score < EXAMPLE_DRIFT_THRESHOLD) {
			findings.push({
				skill: skill.name,
				file: 'examples/',
				heuristic: 'example-drift',
				confidence: round(1 - score / EXAMPLE_DRIFT_THRESHOLD),
				explanation:
					`examples/ shares almost no vocabulary with this skill's description/content ` +
					`(Jaccard ${pct(score)}, below the ${pct(EXAMPLE_DRIFT_THRESHOLD)} threshold). ` +
					`Review whether these examples describe a different workflow entirely.`,
			});
		}
	}

	return findings;
}

/**
 * Check whether `prompts/` or `examples/` match another skill's purpose
 * tokens meaningfully better than they match their own skill (check 3).
 *
 * @param skill - The skill whose supporting material is being checked.
 * @param allSkills - All skills' semantic content, used to find the best
 *   cross-skill match. Must include `skill` itself (it is skipped).
 * @returns Possible-copy findings, empty when nothing is flagged.
 */
export function checkPossibleCopy(
	skill: SkillSemanticContent,
	allSkills: SkillSemanticContent[],
): SemanticFinding[] {
	const findings: SemanticFinding[] = [];
	if (skill.purposeTokens.length < MIN_PURPOSE_TOKENS) return findings;

	const others = allSkills.filter((s) => s.name !== skill.name);

	const check = (
		tokens: string[],
		file: string,
		heuristic: 'possible-copy-prompts' | 'possible-copy-examples',
	): void => {
		if (tokens.length === 0) return;

		const ownScore = jaccardSimilarity(tokens, skill.purposeTokens);

		let bestOtherScore = -1;
		let bestOtherName = '';
		// Iterate in a fixed (alphabetical, pre-sorted) order for determinism.
		for (const other of others) {
			const score = jaccardSimilarity(tokens, other.purposeTokens);
			if (score > bestOtherScore) {
				bestOtherScore = score;
				bestOtherName = other.name;
			}
		}

		if (
			bestOtherScore >= COPY_MIN_OTHER_SCORE &&
			bestOtherScore - ownScore >= COPY_MARGIN
		) {
			findings.push({
				skill: skill.name,
				file,
				heuristic,
				confidence: round(Math.min(1, bestOtherScore - ownScore)),
				explanation:
					`${file} matches "${bestOtherName}"'s description/content (Jaccard ${pct(bestOtherScore)}) ` +
					`more closely than it matches "${skill.name}"'s own (Jaccard ${pct(ownScore)}). ` +
					`This material may have been copied or adapted from "${bestOtherName}" without updating it for this skill.`,
			});
		}
	};

	check(skill.promptsTokens, 'prompts/', 'possible-copy-prompts');
	check(skill.examplesTokens, 'examples/', 'possible-copy-examples');

	return findings;
}

/**
 * Check that the skill's top description keywords are actually covered
 * somewhere in its supporting material (check 4).
 *
 * @param skill - The skill's semantic content, from `loadSkillSemanticContent`.
 * @returns Concept-coverage findings, empty when nothing is flagged.
 */
export function checkConceptCoverage(skill: SkillSemanticContent): SemanticFinding[] {
	const keywords = topKeywords(skill.description);
	if (keywords.length === 0) return [];

	const supportTokens = new Set([
		...skill.promptsTokens,
		...skill.examplesTokens,
		...skill.contentTokens,
	]);
	const covered = keywords.filter((k) => supportTokens.has(k));
	const ratio = covered.length / keywords.length;

	if (ratio >= MIN_COVERAGE_RATIO) return [];

	const missing = keywords.filter((k) => !covered.includes(k));

	return [
		{
			skill: skill.name,
			file: 'prompts/ + examples/ + content/',
			heuristic: 'missing-coverage',
			confidence: round(1 - ratio),
			explanation:
				`Only ${covered.length}/${keywords.length} primary description keywords ` +
				`(missing: ${missing.join(', ')}) appear anywhere in prompts/, examples/, or content/ ` +
				`(coverage ${pct(ratio)}, below the ${pct(MIN_COVERAGE_RATIO)} threshold). ` +
				`Consider adding prompts, examples, or content that exercise these core concepts.`,
		},
	];
}

// ---------------------------------------------------------------------------
// Main entry-point used by validate.ts
// ---------------------------------------------------------------------------

/**
 * Run semantic consistency validation across all provided skill names and
 * emit findings as `SkillValidationIssue` warnings (message prefix
 * `[semantic-warning]`).
 *
 * Skills are processed in alphabetically-sorted order and findings are
 * sorted by skill name, then by heuristic name, so the same repository
 * state always produces identical output.
 *
 * The function never throws — I/O errors for individual skills simply
 * result in empty token sets, which cannot spuriously trigger a finding
 * (empty prompts/examples are skipped; empty purpose is below
 * {@link MIN_PURPOSE_TOKENS} and skipped too).
 *
 * @param skillsDir - Absolute path to the repository's `skills/` directory.
 * @param skillNames - List of skill directory names to validate.
 * @param warnings - Mutable array to append warnings into.
 * @returns Resolves once every skill has been checked; findings are pushed onto `warnings`.
 */
export async function validateSemanticConsistency(
	skillsDir: string,
	skillNames: string[],
	warnings: SkillValidationIssue[],
): Promise<SemanticFinding[]> {
	const sortedNames = [...skillNames].sort();
	const allSkills = await Promise.all(
		sortedNames.map((name) => loadSkillSemanticContent(skillsDir, name)),
	);

	const findings: SemanticFinding[] = [];
	for (const skill of allSkills) {
		findings.push(...checkDrift(skill));
		findings.push(...checkPossibleCopy(skill, allSkills));
		findings.push(...checkConceptCoverage(skill));
	}

	// Deterministic ordering: by skill name, then by heuristic name.
	findings.sort((a, b) => {
		if (a.skill !== b.skill) return a.skill < b.skill ? -1 : 1;
		if (a.heuristic !== b.heuristic) return a.heuristic < b.heuristic ? -1 : 1;
		return 0;
	});

	for (const f of findings) {
		warnings.push({
			skill: f.skill,
			message: `[semantic-warning] (${f.heuristic}, confidence ${pct(f.confidence)}) ${f.file}: ${f.explanation}`,
		});
	}

	return findings;
}
