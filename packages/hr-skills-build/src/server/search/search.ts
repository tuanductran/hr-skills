/**
 * Skill Discovery / Search Layer — Phase 6.1
 *
 * Lets users and future tooling find skills by structured registry metadata
 * (capabilities, aliases, tags, domain, trigger phrases) instead of exact
 * trigger-phrase matching only. This is a retrieval problem, not a planning
 * problem: `searchSkills()` is a pure, read-only query over an already-built
 * `Registry` object (as produced from `registry/skills.json`). It never
 * scans or parses `SKILL.md` files, and it does not select, order, or
 * execute skills — that remains the Planner's job (planner.ts).
 *
 * Design goals (see docs/engineering/search.md for the full write-up):
 *  - Deterministic: identical registry + identical query always produce
 *    identical, identically-ordered output.
 *  - Transparent: every result carries the field matches and weights that
 *    produced its score, plus a human-readable explanation.
 *  - No ML / embeddings / vector search / external services — matching is
 *    exact-substring plus two simple, explainable similarity measures
 *    (token Jaccard overlap and normalized Levenshtein distance), the same
 *    family of technique already used by the Planner's capability matcher.
 */

import type {
	MatchType,
	Registry,
	RegistryEntry,
	SearchableField,
	SkillFieldMatch,
	SkillSearchQuery,
	SkillSearchResponse,
	SkillSearchResult,
} from '../shared/types.js';

// ============================================================================
// Tuning constants — documented in docs/engineering/search.md
// ============================================================================

/** Base relevance weight per field, applied before match-strength scaling. */
export const FIELD_WEIGHTS: Record<SearchableField, number> = {
	aliases: 100,
	capabilities: 80,
	tags: 60,
	triggerPhrases: 50,
	domain: 40,
};

/** All searchable fields, in the fixed order used when `fields` is omitted. */
export const ALL_SEARCHABLE_FIELDS: SearchableField[] = [
	'aliases',
	'capabilities',
	'tags',
	'triggerPhrases',
	'domain',
];

/** Minimum similarity (0–1) for a fuzzy match to count at all. */
const FUZZY_THRESHOLD = 0.34;

/** Fuzzy matches are capped at this fraction of a field's full weight. */
const FUZZY_DAMPING = 0.6;

/** Flat bonus added once per additional distinct field beyond the first. */
const MULTI_FIELD_BONUS = 5;

/** Cap on the total multi-field bonus, regardless of how many fields match. */
const MULTI_FIELD_BONUS_CAP = 20;

/** Flat bonus added once if the skill has at least one exact match. */
const EXACT_MATCH_CONFIDENCE_BONUS = 10;

const DEFAULT_LIMIT = 10;

// ============================================================================
// Errors
// ============================================================================

/**
 * Thrown for a structurally invalid query — e.g. empty search text with no
 * domain filter to fall back on, or a non-positive `limit`. This is a
 * client-input error, not a "no results" case (which returns an empty
 * `results` array instead).
 */
export class InvalidSearchQueryError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidSearchQueryError';
	}
}

// ============================================================================
// String similarity — deterministic, dependency-free
// ============================================================================

function normalize(value: string): string {
	return value.toLowerCase().trim();
}

function tokenize(value: string): Set<string> {
	return new Set(
		normalize(value)
			.split(/[^a-z0-9]+/)
			.filter(Boolean),
	);
}

/** Jaccard similarity (0–1) between the token sets of two strings. */
function jaccardSimilarity(a: string, b: string): number {
	const setA = tokenize(a);
	const setB = tokenize(b);
	if (setA.size === 0 || setB.size === 0) return 0;

	let intersectionSize = 0;
	for (const token of setA) {
		if (setB.has(token)) intersectionSize++;
	}
	const unionSize = setA.size + setB.size - intersectionSize;
	return unionSize === 0 ? 0 : intersectionSize / unionSize;
}

/**
 * Classic Levenshtein edit distance between two strings.
 *
 * Uses a rolling two-row dynamic programming table, reducing memory from
 * O(m × n) to O(n) while remaining fully deterministic.
 */
function levenshteinDistance(a: string, b: string): number {
	const cols = b.length + 1;

	let previous = Array.from({ length: cols }, (_, i) => i);
	let current = new Array<number>(cols).fill(0);

	for (let i = 1; i <= a.length; i++) {
		current[0] = i;

		for (let j = 1; j <= b.length; j++) {
			const left = current[j - 1];
			const above = previous[j];
			const diagonal = previous[j - 1];

			if (left === undefined || above === undefined || diagonal === undefined) {
				throw new Error('Levenshtein matrix invariant violated');
			}

			const cost = a[i - 1] === b[j - 1] ? 0 : 1;

			current[j] = Math.min(above + 1, left + 1, diagonal + cost);
		}

		[previous, current] = [current, previous];
	}

	const distance = previous[b.length];

	if (distance === undefined) {
		throw new Error('Levenshtein matrix invariant violated');
	}

	return distance;
}

/** Edit-distance similarity (0–1), normalized by the longer string's length. */
function levenshteinSimilarity(a: string, b: string): number {
	const normA = normalize(a);
	const normB = normalize(b);
	const maxLen = Math.max(normA.length, normB.length);
	if (maxLen === 0) return 1;
	return 1 - levenshteinDistance(normA, normB) / maxLen;
}

/**
 * Combined fuzzy similarity: the better of token-overlap similarity (good
 * for multi-word phrases, e.g. "onboard new hire" vs "new hire onboarding")
 * and edit-distance similarity (good for single-word typos, e.g.
 * "onbording" vs "onboarding"). Both are deterministic and dependency-free.
 */
function fuzzySimilarity(query: string, value: string): number {
	return Math.max(jaccardSimilarity(query, value), levenshteinSimilarity(query, value));
}

// ============================================================================
// Field matching
// ============================================================================

function isExactMatch(query: string, value: string): boolean {
	const q = normalize(query);
	const v = normalize(value);
	if (q.length === 0 || v.length === 0) return false;
	return q === v || v.includes(q) || q.includes(v);
}

function getFieldValues(entry: RegistryEntry, field: SearchableField): string[] {
	switch (field) {
		case 'aliases':
			return entry.aliases;
		case 'capabilities':
			return entry.capabilities;
		case 'tags':
			return entry.tags;
		case 'triggerPhrases':
			return entry.triggerPhrases;
		case 'domain':
			return [entry.domain];
		default:
			return [];
	}
}

/**
 * Match a query string against a single field of a single skill, returning
 * the single best match for that field (or `null` if none clears the
 * fuzzy threshold). Only the best value per field is kept, so a skill with
 * five overlapping tags doesn't get five separate `aliases`-weight scores
 * for effectively the same hit.
 */
function matchField(
	query: string,
	entry: RegistryEntry,
	field: SearchableField,
	fuzzy: boolean,
): SkillFieldMatch | null {
	const weight = FIELD_WEIGHTS[field];
	let best: SkillFieldMatch | null = null;

	for (const value of getFieldValues(entry, field)) {
		if (isExactMatch(query, value)) {
			const contribution = weight; // similarity 1.0
			if (!best || contribution > best.contribution) {
				best = {
					field,
					value,
					matchType: 'exact',
					similarity: 1,
					weight,
					contribution,
				};
			}
			continue;
		}

		if (!fuzzy) continue;

		const similarity = fuzzySimilarity(query, value);
		if (similarity < FUZZY_THRESHOLD) continue;

		const contribution = weight * FUZZY_DAMPING * similarity;
		if (!best || (best.matchType === 'fuzzy' && contribution > best.contribution)) {
			best = { field, value, matchType: 'fuzzy', similarity, weight, contribution };
		}
	}

	return best;
}

// ============================================================================
// Scoring
// ============================================================================

interface ScoredEntry {
	entry: RegistryEntry;
	score: number;
	matches: SkillFieldMatch[];
}

function scoreEntry(
	query: string,
	entry: RegistryEntry,
	fields: SearchableField[],
	fuzzy: boolean,
): ScoredEntry | null {
	const matches: SkillFieldMatch[] = [];

	for (const field of fields) {
		const match = matchField(query, entry, field, fuzzy);
		if (match) matches.push(match);
	}

	if (matches.length === 0) return null;

	const baseScore = matches.reduce((sum, m) => sum + m.contribution, 0);
	const multiFieldBonus = Math.min(
		(matches.length - 1) * MULTI_FIELD_BONUS,
		MULTI_FIELD_BONUS_CAP,
	);
	const confidenceBonus = matches.some((m) => m.matchType === 'exact')
		? EXACT_MATCH_CONFIDENCE_BONUS
		: 0;

	// Highest-weight, then highest-contribution matches first — this is also
	// the order the explanation string is built from.
	matches.sort(
		(a, b) => b.contribution - a.contribution || a.field.localeCompare(b.field),
	);

	const score = Math.round((baseScore + multiFieldBonus + confidenceBonus) * 100) / 100;

	return { entry, score, matches };
}

/** Build the deterministic, human-readable "why this matched" explanation. */
function buildExplanation(matches: SkillFieldMatch[]): string {
	return matches
		.map((m) => {
			const kind =
				m.matchType === 'exact' ? 'exact' : `fuzzy, ${m.similarity.toFixed(2)}`;
			return `${m.field} ~ "${m.value}" (${kind})`;
		})
		.join('; ');
}

// ============================================================================
// Public API
// ============================================================================

/**
 * Search the generated Skill Registry by structured metadata.
 *
 * Ranking rule (see docs/engineering/search.md for the full explanation):
 *  1. Each field match contributes `weight * similarity` to the skill's
 *     score (`similarity` is always 1 for exact matches).
 *  2. A skill matching on more than one distinct field gets a small flat
 *     bonus per extra field (capped), since agreement across fields is a
 *     stronger discoverability signal than one big match.
 *  3. A skill with at least one *exact* match gets a flat confidence bonus,
 *     so exact matches reliably outrank fuzzy-only matches.
 *  4. Ties are broken by number of distinct fields matched (more wins),
 *     then by skill ID ascending — so identical registry content always
 *     produces identical ordering, run after run.
 *
 * @param query - The search query. `query.text` is required unless
 *   `query.domain` is set (a domain-only browse is a valid query).
 * @param registry - A `Registry` object, as produced from `registry/skills.json`.
 * @throws {InvalidSearchQueryError} If the query has no text and no domain
 *   filter, or if `limit` is not a positive integer.
 * @returns Ranked, deduplicated skill matches with per-field score detail.
 */
export function searchSkills(
	query: SkillSearchQuery,
	registry: Registry,
): SkillSearchResponse {
	const text = query.text ?? '';
	const trimmedText = text.trim();

	if (trimmedText.length === 0 && !query.domain) {
		throw new InvalidSearchQueryError(
			'Search query must include non-empty "text" and/or a "domain" filter.',
		);
	}

	const limit = query.limit ?? DEFAULT_LIMIT;
	if (!Number.isInteger(limit) || limit <= 0) {
		throw new InvalidSearchQueryError(
			`"limit" must be a positive integer, received: ${limit}`,
		);
	}

	const fields =
		query.fields && query.fields.length > 0 ? query.fields : ALL_SEARCHABLE_FIELDS;
	const fuzzy = query.fuzzy ?? true;

	const candidates = query.domain
		? registry.skills.filter((entry) => entry.domain === query.domain)
		: registry.skills;

	let scored: ScoredEntry[];

	if (trimmedText.length === 0) {
		// Domain-only browse: every candidate "matches" via the domain field,
		// so results are still explainable and consistently ranked.
		scored = candidates.map((entry) => ({
			entry,
			score: FIELD_WEIGHTS.domain,
			matches: [
				{
					field: 'domain' as const,
					value: entry.domain,
					matchType: 'exact' as MatchType,
					similarity: 1,
					weight: FIELD_WEIGHTS.domain,
					contribution: FIELD_WEIGHTS.domain,
				},
			],
		}));
	} else {
		scored = candidates
			.map((entry) => scoreEntry(trimmedText, entry, fields, fuzzy))
			.filter((s): s is ScoredEntry => s !== null);
	}

	scored.sort(
		(a, b) =>
			b.score - a.score ||
			b.matches.length - a.matches.length ||
			a.entry.id.localeCompare(b.entry.id),
	);

	const results: SkillSearchResult[] = scored
		.slice(0, limit)
		.map(({ entry, score, matches }) => ({
			skillId: entry.id,
			name: entry.name,
			description: entry.description,
			domain: entry.domain,
			score,
			matches,
			explanation: buildExplanation(matches),
		}));

	return { query: text, resultCount: results.length, results };
}
