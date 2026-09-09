/**
 * Usage-informed relevance signals — Phase 6.1.
 *
 * Converts evidence from evaluation golden fixtures into a deterministic
 * co-selection weight table for skill pairs.  The weight table can be merged
 * into the registry at generation time to produce `relatedSkills` lists that
 * reflect how skills are actually chosen together in practice.
 *
 * Design constraints:
 * - Pure functions only — no filesystem side-effects except in the CLI entry
 *   point (`generate-relevance-signals.ts`).
 * - Deterministic — same inputs always produce identical outputs (stable
 *   aggregation, alphabetical tie-breaking, no wall-clock timestamps in the
 *   signal table).
 * - No runtime learning — the weight table is generated once, committed, and
 *   read at registry generation time as a static artifact.
 * - No ML, embeddings, or external services.
 *
 * ## Terminology
 *
 * - **Observation** — a single planning-scenario outcome recorded in a golden
 *   fixture: a case's ordered list of selected skill IDs.
 * - **Co-selection** — two skills appearing together in the same plan's
 *   `skillIds` list, regardless of order.
 * - **Signal** — a normalised 0.0–1.0 weight for a (source, target) skill pair
 *   derived from aggregating co-selection counts across all observations.
 * - **RelevanceSignalTable** — the committed artifact that bundles all signals
 *   and the metadata needed to verify and regenerate it.
 */

import type { GoldenFixture } from '../shared/types.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A normalised relevance weight for a single (source → target) skill pair,
 * derived from co-selection evidence across one or more evaluation datasets.
 *
 * All three numeric fields are 0.0–1.0 ratios computed from integer counts —
 * they are deterministic given the same input fixtures.
 */
export interface RelevanceSignal {
	/** The skill whose `relatedSkills` list this signal influences. */
	sourceSkill: string;
	/** The skill that co-appears with `sourceSkill`. */
	targetSkill: string;
	/**
	 * Fraction of all plans that contained `sourceSkill` in which `targetSkill`
	 * also appeared.  0.0 = never co-selected; 1.0 = always co-selected.
	 */
	coSelectionRate: number;
	/** Raw count of plans containing both skills. */
	coSelectionCount: number;
	/** Total plans containing `sourceSkill` (the denominator for coSelectionRate). */
	observedCount: number;
}

/**
 * The committed, versioned artifact written to `registry/relevance-signals.json`.
 *
 * Consumed by `buildRegistry()` to optionally augment the static
 * tag-overlap `relatedSkills` ranking with observed co-selection evidence.
 */
export interface RelevanceSignalTable {
	/**
	 * Schema version — increment for breaking shape changes (field rename,
	 * type change).  Additive optional fields do not require a bump.
	 */
	schemaVersion: number;
	/**
	 * ISO date (YYYY-MM-DD) the table was generated on.  Informational only —
	 * it does not affect determinism of the weight lookup.
	 */
	generatedAt: string;
	/**
	 * Names of the golden fixture datasets that contributed observations.
	 * Stored for auditability; does not affect signal values.
	 */
	sourceDatasets: string[];
	/** Total number of planning-scenario outcomes observed across all datasets. */
	totalObservations: number;
	/** All (source, target) relevance signals, sorted by sourceSkill then targetSkill. */
	signals: RelevanceSignal[];
}

// ---------------------------------------------------------------------------
// Observation extraction
// ---------------------------------------------------------------------------

/**
 * Extract all co-selection observations from a set of golden fixtures.
 *
 * Each fixture result whose `skillIds` list contains at least two skills
 * contributes one observation (all unordered pairs from the list).
 *
 * Returns the raw pair counts: `Map<sourceSkill, Map<targetSkill, count>>`.
 * Pairs are stored bidirectionally (A→B and B→A) so that signal lookup
 * works for either member of the pair.
 *
 * Determinism: golden fixtures are processed in the order they are supplied;
 * callers are expected to sort fixture arrays before passing them in.
 *
 * @param fixtures - Committed golden fixtures to derive co-selection evidence from.
 * @returns Bidirectional pair counts: `Map<sourceSkill, Map<targetSkill, count>>`.
 */
export function extractCoSelectionCounts(
	fixtures: ReadonlyArray<GoldenFixture>,
): Map<string, Map<string, number>> {
	const counts = new Map<string, Map<string, number>>();

	/** Increment the count for (a → b). */
	function bump(a: string, b: string): void {
		let inner = counts.get(a);

		if (!inner) {
			inner = new Map<string, number>();
			counts.set(a, inner);
		}

		inner.set(b, (inner.get(b) ?? 0) + 1);
	}

	for (const fixture of fixtures) {
		for (const result of fixture.results) {
			const ids = result.skillIds;
			if (ids.length < 2) continue;

			// All unordered pairs — bidirectional storage.
			for (let i = 0; i < ids.length; i++) {
				const a = ids[i];
				if (a === undefined) continue;

				for (let j = i + 1; j < ids.length; j++) {
					const b = ids[j];
					if (b === undefined) continue;

					bump(a, b);
					bump(b, a);
				}
			}
		}
	}

	return counts;
}

/**
 * Count the number of times each skill appears across all fixture results.
 *
 * Determinism: fixture order must be stable (same as `extractCoSelectionCounts`).
 *
 * @param fixtures - Committed golden fixtures to count observations from.
 * @returns Number of times each skill ID appeared, keyed by skill ID.
 */
export function extractSkillObservationCounts(
	fixtures: ReadonlyArray<GoldenFixture>,
): Map<string, number> {
	const counts = new Map<string, number>();

	for (const fixture of fixtures) {
		for (const result of fixture.results) {
			for (const id of result.skillIds) {
				counts.set(id, (counts.get(id) ?? 0) + 1);
			}
		}
	}

	return counts;
}

// ---------------------------------------------------------------------------
// Signal computation
// ---------------------------------------------------------------------------

/**
 * Build the full list of `RelevanceSignal` entries from raw co-selection and
 * per-skill observation counts.
 *
 * Each (source, target) pair where co-selection count > 0 becomes one signal.
 * `coSelectionRate` = coCount / observedCount for the source skill.
 *
 * Output is sorted by `sourceSkill` (ascending), then `targetSkill`
 * (ascending) for a stable, human-readable artifact.
 *
 * @param coSelectionCounts - Output of `extractCoSelectionCounts`.
 * @param observationCounts - Output of `extractSkillObservationCounts`.
 * @returns Sorted relevance signals, one per (source, target) pair with co-selection evidence.
 */
export function computeSignals(
	coSelectionCounts: ReadonlyMap<string, ReadonlyMap<string, number>>,
	observationCounts: ReadonlyMap<string, number>,
): RelevanceSignal[] {
	const signals: RelevanceSignal[] = [];

	for (const [source, targets] of coSelectionCounts) {
		const observedCount = observationCounts.get(source) ?? 0;
		if (observedCount === 0) continue;

		for (const [target, coCount] of targets) {
			signals.push({
				sourceSkill: source,
				targetSkill: target,
				coSelectionRate: coCount / observedCount,
				coSelectionCount: coCount,
				observedCount,
			});
		}
	}

	// Stable sort: primary by sourceSkill, secondary by targetSkill.
	signals.sort(
		(a, b) =>
			a.sourceSkill.localeCompare(b.sourceSkill) ||
			a.targetSkill.localeCompare(b.targetSkill),
	);

	return signals;
}

// ---------------------------------------------------------------------------
// Table assembly
// ---------------------------------------------------------------------------

/**
 * Build a `RelevanceSignalTable` from one or more committed golden fixtures.
 *
 * This is the top-level pure function called by the CLI generator.  It
 * performs no filesystem I/O — callers load fixtures and pass them in.
 *
 * @param fixtures   Golden fixtures to derive evidence from.
 * @param generatedAt  ISO date string (YYYY-MM-DD) injected by the caller for
 *                     testability (avoids `new Date()` inside a pure function).
 * @returns The full relevance signal table, ready to write to `registry/relevance-signals.json`.
 */
export function buildRelevanceSignalTable(
	fixtures: ReadonlyArray<GoldenFixture>,
	generatedAt: string,
): RelevanceSignalTable {
	// Sort fixture list by dataset name so table is reproducible regardless of
	// discovery order on disk.
	const sortedFixtures = [...fixtures].sort((a, b) =>
		a.dataset.localeCompare(b.dataset),
	);

	const coSelectionCounts = extractCoSelectionCounts(sortedFixtures);
	const observationCounts = extractSkillObservationCounts(sortedFixtures);
	const signals = computeSignals(coSelectionCounts, observationCounts);

	const totalObservations = sortedFixtures.reduce(
		(sum, f) => sum + f.results.length,
		0,
	);

	return {
		schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
		generatedAt,
		sourceDatasets: sortedFixtures.map((f) => f.dataset),
		totalObservations,
		signals,
	};
}

// ---------------------------------------------------------------------------
// Registry integration helpers
// ---------------------------------------------------------------------------

/**
 * Build a lookup index: `sourceSkill → (targetSkill → coSelectionRate)`.
 *
 * Used by `registry.ts` to merge observed weights into `relatedSkills`
 * without re-parsing the full signal list on every skill.
 *
 * @param table - Signal table to index, typically from `loadRelevanceSignalTable`.
 * @returns Lookup index: `sourceSkill -> (targetSkill -> coSelectionRate)`.
 */
export function indexSignalsBySource(
	table: RelevanceSignalTable,
): Map<string, Map<string, number>> {
	const index = new Map<string, Map<string, number>>();

	for (const signal of table.signals) {
		if (!index.has(signal.sourceSkill)) {
			index.set(signal.sourceSkill, new Map());
		}
		index.get(signal.sourceSkill)?.set(signal.targetSkill, signal.coSelectionRate);
	}

	return index;
}

/**
 * Re-rank a skill's `relatedSkills` list by blending the static tag-overlap
 * score with an observed co-selection rate from the signal index.
 *
 * Blend formula (deterministic, no floating-point non-determinism):
 *   blendedScore = staticScore * (1 - OBSERVED_WEIGHT) + observedRate * OBSERVED_WEIGHT
 *
 * where `staticScore` is 1.0 for the first item in the static list, decaying
 * by 1/N for each subsequent position (a simple rank-to-score mapping that
 * preserves the original ranking's relative order in the absence of observed
 * evidence).
 *
 * Ties are broken alphabetically (consistent with the static ranker in
 * `registry.ts`).
 *
 * @param skillId          The skill whose list is being re-ranked.
 * @param staticRelated    The existing tag-overlap-ranked related skill IDs.
 * @param signalIndex      Output of `indexSignalsBySource`.
 * @param limit            Maximum number of IDs to return (matches static ranker default of 5).
 * @returns Re-ranked related skill IDs, blending static tag-overlap with observed co-selection.
 */
export function reRankRelatedSkills(
	skillId: string,
	staticRelated: ReadonlyArray<string>,
	signalIndex: ReadonlyMap<string, ReadonlyMap<string, number>>,
	limit = 5,
): string[] {
	const observedRates = signalIndex.get(skillId) ?? new Map<string, number>();
	const n = staticRelated.length || 1;

	const scored = staticRelated.map((id, idx) => {
		const staticScore = 1 - idx / n;
		const observedRate = observedRates.get(id) ?? 0;
		return {
			id,
			score: staticScore * (1 - OBSERVED_WEIGHT) + observedRate * OBSERVED_WEIGHT,
		};
	});

	// Also include any target skills that appear in observed evidence but were
	// NOT in the static list — evidence may surface cross-domain pairs missed
	// by tag overlap.
	for (const [targetId, rate] of observedRates) {
		if (!staticRelated.includes(targetId) && targetId !== skillId) {
			scored.push({
				id: targetId,
				score: rate * OBSERVED_WEIGHT,
			});
		}
	}

	scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

	return scored.slice(0, limit).map((entry) => entry.id);
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Schema version for `registry/relevance-signals.json`.
 * Increment for breaking shape changes only.
 */
export const RELEVANCE_SIGNAL_SCHEMA_VERSION = 1;

/**
 * The fraction of the blended `relatedSkills` score that comes from observed
 * co-selection evidence.  The remaining `1 - OBSERVED_WEIGHT` fraction comes
 * from the static tag-overlap ranking.
 *
 * Set conservatively so that sparse evidence (few evaluation cases) does not
 * dominate the recommendation graph.  Increase once the evaluation dataset
 * grows and observed counts become statistically meaningful.
 */
export const OBSERVED_WEIGHT = 0.3;
