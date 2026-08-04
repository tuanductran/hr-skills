/**
 * Phase 6.2 — Duplicate-content detection
 *
 * Identifies skills whose `description` or `content/` markdown substantially
 * overlaps with other skills using a deterministic, heuristic approach.
 *
 * ## Heuristic overview
 *
 * For each pair of skills the detector computes a weighted composite score
 * from three complementary signals:
 *
 * 1. **Description Jaccard (weight 0.35)**
 *    Normalised token sets of both frontmatter `description` fields are
 *    compared with Jaccard similarity: |A∩B| / |A∪B|.
 *
 * 2. **Content token-overlap (weight 0.40)**
 *    All markdown files found under `content/` (if present) or the SKILL.md
 *    body are tokenised after stripping markdown syntax, stop-words, and
 *    common HR terminology. The resulting token multisets are compared with
 *    Jaccard similarity.
 *
 * 3. **Bigram overlap (weight 0.25)**
 *    Consecutive token pairs (bigrams) are extracted from the normalised
 *    content and compared with Jaccard similarity, catching phrase-level
 *    duplication that single-token overlap misses.
 *
 * composite = w1·descJaccard + w2·contentJaccard + w3·bigramJaccard
 *
 * A pair is reported when `composite ≥ DUPLICATE_THRESHOLD` (default 0.55).
 * All three weights and the threshold are exported as named constants so
 * callers can override them for stricter or more lenient checking.
 *
 * ## Stop-word / common-HR-term filtering
 *
 * A built-in list of ~70 HR domain stop-words ("employee", "manager",
 * "process", "team", …) is subtracted before similarity is measured.  This
 * prevents high vocabulary overlap caused by domain terminology alone from
 * triggering false-positive warnings.
 *
 * ## Determinism guarantee
 *
 * The detector:
 * - performs all set operations on sorted arrays / Maps;
 * - iterates skill lists in alphabetical order;
 * - produces pair keys in a canonical `"skillA|||skillB"` form where skillA
 *   is always lexicographically smaller than skillB;
 * - never touches timestamps or random values.
 *
 * The same repository state therefore always produces exactly the same
 * warnings in the same order.
 */

import { join } from 'node:path';
import { SKILLS_DIR } from 'skills-ref';
import type { SkillValidationIssue } from '../shared/types.js';
import {
	extractDescription,
	readAllMarkdown,
	readRawSkillMd,
	stripFrontmatter,
} from './skill-content-loading.js';

// ---------------------------------------------------------------------------
// Configuration — weights and thresholds
// ---------------------------------------------------------------------------

/** Weight applied to the description-level Jaccard score. */
export const WEIGHT_DESCRIPTION = 0.35;

/** Weight applied to the content-level token Jaccard score. */
export const WEIGHT_CONTENT = 0.4;

/** Weight applied to the bigram Jaccard score. */
export const WEIGHT_BIGRAM = 0.25;

/**
 * Composite similarity score at or above which a pair is reported as a
 * potential duplicate.  Range: 0–1.  Default: 0.55.
 */
export const DUPLICATE_THRESHOLD = 0.55;

// ---------------------------------------------------------------------------
// HR domain stop-words
// ---------------------------------------------------------------------------

/**
 * Common HR vocabulary that is expected to appear in many skills.
 * Filtering these terms out prevents domain-vocabulary overlap from
 * triggering false-positive duplicate warnings.
 */
export const HR_STOP_WORDS = new Set([
	// Generic HR terms
	'employee',
	'employees',
	'employer',
	'hr',
	'human',
	'resources',
	'manager',
	'managers',
	'management',
	'team',
	'teams',
	'staff',
	'workforce',
	'personnel',
	'organization',
	'organisation',
	'company',
	'business',
	'process',
	'processes',
	'policy',
	'policies',
	'practice',
	'practices',
	'program',
	'programs',
	'programme',
	'programmes',
	'strategy',
	'strategies',
	'plan',
	'plans',
	'goal',
	'goals',
	'performance',
	'review',
	'reviews',
	'feedback',
	'support',
	'role',
	'roles',
	'responsibilities',
	'responsibility',
	'work',
	'workplace',
	'job',
	'jobs',
	'position',
	'positions',
	'candidate',
	'candidates',
	'hire',
	'hiring',
	'recruit',
	'recruiting',
	'recruitment',
	'training',
	'development',
	'learning',
	'skill',
	'skills',
	'data',
	'report',
	'reports',
	'documentation',
	'document',
	'documents',
	'tool',
	'tools',
	'system',
	'systems',
	'platform',
	'platforms',
	'best',
	'create',
	'design',
	'help',
	'use',
	'build',
	'make',
	'provide',
	'ensure',
	'include',
	'based',
	'new',
	'current',
	'effective',
	'clear',
	'specific',
	'general',
	'key',
	'core',
	'improve',
	'increase',
	'reduce',
	'identify',
	'develop',
	'manage',
	'track',
	'monitor',
	'measure',
	'implement',
	'establish',
	// English stop-words
	'the',
	'and',
	'for',
	'that',
	'with',
	'this',
	'are',
	'from',
	'have',
	'has',
	'not',
	'but',
	'can',
	'all',
	'you',
	'your',
	'their',
	'they',
	'when',
	'what',
	'how',
	'more',
	'about',
	'such',
	'into',
	'each',
	'will',
	'well',
	'also',
	'any',
	'our',
	'its',
	'may',
	'been',
	'both',
	'than',
	'then',
	'these',
	'those',
	'other',
	'which',
	'while',
	'across',
	'within',
	'between',
	'through',
]);

// ---------------------------------------------------------------------------
// Text normalisation
// ---------------------------------------------------------------------------

/**
 * Remove markdown syntax, code fences, URLs, and punctuation then lower-case.
 */
function stripMarkdown(text: string): string {
	return text
		.replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
		.replace(/`[^`]+`/g, ' ') // inline code
		.replace(/https?:\/\/\S+/g, ' ') // URLs
		.replace(/#+\s/g, ' ') // headings
		.replace(/[*_~>|]/g, ' ') // emphasis / table chars
		.replace(/[^\w\s'-]/g, ' ') // remaining punctuation
		.replace(/\s+/g, ' ')
		.toLowerCase()
		.trim();
}

/**
 * Tokenise a normalised string: split on whitespace, remove stop-words and
 * tokens shorter than 3 characters.  Returns a sorted array for determinism.
 */
export function tokenise(text: string): string[] {
	return stripMarkdown(text)
		.split(/\s+/)
		.filter((t) => t.length >= 3 && !HR_STOP_WORDS.has(t))
		.sort();
}

/**
 * Build bigrams (consecutive token pairs) from a token list.
 * The list must be in its natural (unsorted) order before calling this;
 * the returned bigrams are sorted for determinism.
 */
export function buildBigrams(tokens: string[]): string[] {
	const bigrams: string[] = [];
	for (let i = 0; i < tokens.length - 1; i++) {
		bigrams.push(`${tokens[i]}|${tokens[i + 1]}`);
	}
	return bigrams.sort();
}

// ---------------------------------------------------------------------------
// Similarity primitives
// ---------------------------------------------------------------------------

/**
 * Jaccard similarity between two token arrays treated as multisets.
 *
 * |A ∩ B| / |A ∪ B| — both computed from the frequency-aware intersection
 * so a token appearing twice in A but once in B only contributes 1 to the
 * intersection.  Returns 0 when both arrays are empty.
 */
export function jaccardSimilarity(a: string[], b: string[]): number {
	if (a.length === 0 && b.length === 0) return 0;

	// Build frequency maps
	const freqA = new Map<string, number>();
	for (const t of a) freqA.set(t, (freqA.get(t) ?? 0) + 1);

	const freqB = new Map<string, number>();
	for (const t of b) freqB.set(t, (freqB.get(t) ?? 0) + 1);

	// Intersection: min(freqA, freqB) per token
	let intersection = 0;
	for (const [token, countA] of freqA) {
		const countB = freqB.get(token) ?? 0;
		intersection += Math.min(countA, countB);
	}

	const union = a.length + b.length - intersection;
	return union === 0 ? 0 : intersection / union;
}

// ---------------------------------------------------------------------------
// Skill content extraction
// ---------------------------------------------------------------------------

/** Parsed representation of a single skill used by the detector. */
export interface SkillContent {
	/** Skill directory name, e.g. "hr-onboarding". */
	name: string;
	/** Raw frontmatter description string. */
	description: string;
	/** Concatenated body text extracted from SKILL.md + content/ files. */
	body: string;
}

/**
 * Load one skill's textual content for comparison.
 */
async function loadSkillContent(skillName: string): Promise<SkillContent> {
	const skillDir = join(SKILLS_DIR, skillName);
	const raw = await readRawSkillMd(skillDir);

	const description = extractDescription(raw);
	const skillMdBody = stripFrontmatter(raw);
	const contentBody = await readAllMarkdown(join(skillDir, 'content'));

	return {
		name: skillName,
		description,
		body: [skillMdBody, contentBody].filter(Boolean).join('\n'),
	};
}

// ---------------------------------------------------------------------------
// Duplicate detection result type
// ---------------------------------------------------------------------------

/** A single duplicate-detection finding for one pair of skills. */
export interface DuplicateWarning {
	/** First skill ID (lexicographically smaller). */
	skillA: string;
	/** Second skill ID. */
	skillB: string;
	/** Weighted composite similarity score (0–1). */
	score: number;
	/** Jaccard similarity of the description tokens alone. */
	descriptionSimilarity: number;
	/** Jaccard similarity of the content tokens alone. */
	contentSimilarity: number;
	/** Jaccard similarity of the content bigrams alone. */
	bigramSimilarity: number;
	/** Human-readable explanation of what drove the score. */
	explanation: string;
}

// ---------------------------------------------------------------------------
// Core detection logic
// ---------------------------------------------------------------------------

/**
 * Build a `DuplicateWarning` from pre-computed similarity scores.
 *
 * Extracted so both the public `comparePair()` API and the O(N²) fast path
 * inside `detectDuplicates()` can share the same result-building logic without
 * duplicating code.
 */
function buildWarning(
	a: SkillContent,
	b: SkillContent,
	descScore: number,
	contentScore: number,
	bigramScore: number,
	composite: number,
	threshold: number,
): DuplicateWarning {
	// Canonical ordering: lexicographically smaller name first
	const [skillA, skillB] = a.name < b.name ? [a.name, b.name] : [b.name, a.name];

	// Human-readable explanation
	const parts: string[] = [];
	if (descScore >= 0.5) parts.push(`high description overlap (${pct(descScore)})`);
	if (contentScore >= 0.5)
		parts.push(`high content token overlap (${pct(contentScore)})`);
	if (bigramScore >= 0.4)
		parts.push(`significant phrase overlap (${pct(bigramScore)})`);
	if (parts.length === 0) parts.push('moderate overlap across multiple signals');

	const explanation =
		`Composite score ${pct(composite)} exceeds threshold ${pct(threshold)}: ` +
		parts.join('; ') +
		'. ' +
		'Review both skills to determine if they cover genuinely distinct knowledge or should be merged/refactored.';

	return {
		skillA,
		skillB,
		score: round(composite),
		descriptionSimilarity: round(descScore),
		contentSimilarity: round(contentScore),
		bigramSimilarity: round(bigramScore),
		explanation,
	};
}

/**
 * Compute the composite duplicate score for a pair of pre-loaded skills.
 *
 * @returns A `DuplicateWarning` when `score >= threshold`, or `null`.
 */
export function comparePair(
	a: SkillContent,
	b: SkillContent,
	threshold = DUPLICATE_THRESHOLD,
): DuplicateWarning | null {
	// --- Description similarity ---
	const descTokensA = tokenise(a.description);
	const descTokensB = tokenise(b.description);
	const descScore = jaccardSimilarity(descTokensA, descTokensB);

	// --- Content similarity (natural token order for bigrams, then sort) ---
	const rawBodyTokensA = stripMarkdown(a.body)
		.split(/\s+/)
		.filter((t) => t.length >= 3 && !HR_STOP_WORDS.has(t));
	const rawBodyTokensB = stripMarkdown(b.body)
		.split(/\s+/)
		.filter((t) => t.length >= 3 && !HR_STOP_WORDS.has(t));

	const contentScore = jaccardSimilarity(
		[...rawBodyTokensA].sort(),
		[...rawBodyTokensB].sort(),
	);

	// --- Bigram similarity ---
	const bigramScore = jaccardSimilarity(
		buildBigrams(rawBodyTokensA),
		buildBigrams(rawBodyTokensB),
	);

	// --- Composite ---
	const composite =
		WEIGHT_DESCRIPTION * descScore +
		WEIGHT_CONTENT * contentScore +
		WEIGHT_BIGRAM * bigramScore;

	if (composite < threshold) return null;

	return buildWarning(a, b, descScore, contentScore, bigramScore, composite, threshold);
}

function pct(n: number): string {
	return `${Math.round(n * 100)}%`;
}

function round(n: number): number {
	return Math.round(n * 10000) / 10000;
}

// ---------------------------------------------------------------------------
// Main entry-point used by validate.ts
// ---------------------------------------------------------------------------

/**
 * Run duplicate detection across all provided skill names and emit findings
 * as `SkillValidationIssue` warnings (message prefix `[duplicate-warning]`).
 *
 * Pairs are evaluated in a stable, alphabetically-sorted order.
 * The function never throws — I/O errors for individual skills are silently
 * skipped so that other validation can still proceed.
 *
 * @param skillNames - Alphabetically-sorted list of skill directory names.
 * @param warnings   - Mutable array to append warnings into.
 * @param threshold  - Override the default similarity threshold.
 */
export async function detectDuplicates(
	skillNames: string[],
	warnings: SkillValidationIssue[],
	threshold = DUPLICATE_THRESHOLD,
): Promise<DuplicateWarning[]> {
	// Load all skills (errors produce empty content — won't match anything)
	const contents = await Promise.all(
		[...skillNames].sort().map((name) => loadSkillContent(name)),
	);

	const findings: DuplicateWarning[] = [];

	// Pre-compute description tokens, sorted body tokens, and bigrams once per
	// skill before entering the O(N²) pair loop. Without this, comparePair()
	// would call stripMarkdown + split + filter + sort + buildBigrams on each
	// skill body once per pair it appears in — 145× per skill with 146 skills.
	const precomputed = contents.map((c) => {
		if (!c) return null;
		const bodyTokensNatural = stripMarkdown(c.body)
			.split(/\s+/)
			.filter((t) => t.length >= 3 && !HR_STOP_WORDS.has(t));
		return {
			content: c,
			descTokens: tokenise(c.description),
			bodyTokensSorted: [...bodyTokensNatural].sort(),
			bigrams: buildBigrams(bodyTokensNatural),
		};
	});

	for (let i = 0; i < precomputed.length; i++) {
		for (let j = i + 1; j < precomputed.length; j++) {
			const a = precomputed[i];
			const b = precomputed[j];
			if (!a || !b) continue;

			const descScore = jaccardSimilarity(a.descTokens, b.descTokens);
			const contentScore = jaccardSimilarity(
				a.bodyTokensSorted,
				b.bodyTokensSorted,
			);
			const bigramScore = jaccardSimilarity(a.bigrams, b.bigrams);
			const composite =
				WEIGHT_DESCRIPTION * descScore +
				WEIGHT_CONTENT * contentScore +
				WEIGHT_BIGRAM * bigramScore;

			if (composite < threshold) continue;
			findings.push(
				buildWarning(
					a.content,
					b.content,
					descScore,
					contentScore,
					bigramScore,
					composite,
					threshold,
				),
			);
		}
	}

	// Sort findings deterministically: by score desc, then by skillA asc
	findings.sort((a, b) =>
		b.score !== a.score
			? b.score - a.score
			: a.skillA < b.skillA
				? -1
				: a.skillA > b.skillA
					? 1
					: 0,
	);

	// Emit as quality warnings
	for (const f of findings) {
		warnings.push({
			skill: `${f.skillA} ↔ ${f.skillB}`,
			message:
				`[duplicate-warning] Similarity score ${pct(f.score)} ` +
				`(description: ${pct(f.descriptionSimilarity)}, ` +
				`content: ${pct(f.contentSimilarity)}, ` +
				`bigrams: ${pct(f.bigramSimilarity)}). ` +
				f.explanation,
		});
	}

	return findings;
}
