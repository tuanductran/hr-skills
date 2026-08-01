import { describe, expect, it } from 'bun:test';

import {
	buildRelevanceSignalTable,
	computeSignals,
	extractCoSelectionCounts,
	extractSkillObservationCounts,
	indexSignalsBySource,
	OBSERVED_WEIGHT,
	RELEVANCE_SIGNAL_SCHEMA_VERSION,
	reRankRelatedSkills,
} from '../../src/search/relevance-signals.js';
import type { GoldenFixture } from '../../src/shared/types.js';

// ---------------------------------------------------------------------------
// Fixtures shared across tests
// ---------------------------------------------------------------------------

const FIXTURE_A: GoldenFixture = {
	dataset: 'dataset-a',
	generatedAt: '2026-01-01',
	results: [
		{
			caseId: 'c1',
			skillIds: ['skill-x', 'skill-y'],
			matchedCapabilities: 1,
			totalCapabilities: 1,
			planIsValid: true,
			workflowStatus: 'completed',
		},
		{
			caseId: 'c2',
			skillIds: ['skill-x', 'skill-z'],
			matchedCapabilities: 1,
			totalCapabilities: 1,
			planIsValid: true,
			workflowStatus: 'completed',
		},
		{
			caseId: 'c3',
			skillIds: ['skill-x', 'skill-y', 'skill-z'],
			matchedCapabilities: 2,
			totalCapabilities: 2,
			planIsValid: true,
			workflowStatus: 'completed',
		},
		{
			caseId: 'c4',
			skillIds: ['skill-solo'],
			matchedCapabilities: 1,
			totalCapabilities: 1,
			planIsValid: true,
			workflowStatus: 'completed',
		},
	],
};

const FIXTURE_B: GoldenFixture = {
	dataset: 'dataset-b',
	generatedAt: '2026-01-02',
	results: [
		{
			caseId: 'b1',
			skillIds: ['skill-x', 'skill-y'],
			matchedCapabilities: 1,
			totalCapabilities: 1,
			planIsValid: true,
			workflowStatus: 'completed',
		},
	],
};

const EMPTY_FIXTURE: GoldenFixture = {
	dataset: 'empty',
	generatedAt: '2026-01-01',
	results: [],
};

// ---------------------------------------------------------------------------
// extractCoSelectionCounts
// ---------------------------------------------------------------------------

describe('extractCoSelectionCounts()', () => {
	it('counts bidirectional pairs correctly', () => {
		const counts = extractCoSelectionCounts([FIXTURE_A]);
		// skill-x and skill-y appear together in c1 and c3 → 2 each direction
		expect(counts.get('skill-x')?.get('skill-y')).toBe(2);
		expect(counts.get('skill-y')?.get('skill-x')).toBe(2);
	});

	it('counts skill-x and skill-z pairs correctly', () => {
		const counts = extractCoSelectionCounts([FIXTURE_A]);
		// c2 and c3 → 2
		expect(counts.get('skill-x')?.get('skill-z')).toBe(2);
		expect(counts.get('skill-z')?.get('skill-x')).toBe(2);
	});

	it('excludes solo-skill cases from co-selection', () => {
		const counts = extractCoSelectionCounts([FIXTURE_A]);
		// skill-solo appears alone in c4, no pairs
		expect(counts.has('skill-solo')).toBe(false);
	});

	it('is deterministic — same input produces identical output', () => {
		const first = extractCoSelectionCounts([FIXTURE_A]);
		const second = extractCoSelectionCounts([FIXTURE_A]);
		expect(first.get('skill-x')?.get('skill-y')).toBe(
			second.get('skill-x')?.get('skill-y'),
		);
	});

	it('handles an empty fixture with no results', () => {
		const counts = extractCoSelectionCounts([EMPTY_FIXTURE]);
		expect(counts.size).toBe(0);
	});

	it('accumulates counts across multiple fixtures', () => {
		const counts = extractCoSelectionCounts([FIXTURE_A, FIXTURE_B]);
		// skill-x & skill-y: 2 from A + 1 from B = 3
		expect(counts.get('skill-x')?.get('skill-y')).toBe(3);
	});
});

// ---------------------------------------------------------------------------
// extractSkillObservationCounts
// ---------------------------------------------------------------------------

describe('extractSkillObservationCounts()', () => {
	it('counts appearances per skill across all results', () => {
		const obs = extractSkillObservationCounts([FIXTURE_A]);
		// skill-x appears in c1, c2, c3 → 3
		expect(obs.get('skill-x')).toBe(3);
		// skill-y appears in c1, c3 → 2
		expect(obs.get('skill-y')).toBe(2);
		// skill-solo appears in c4 → 1
		expect(obs.get('skill-solo')).toBe(1);
	});

	it('sums across multiple fixtures', () => {
		const obs = extractSkillObservationCounts([FIXTURE_A, FIXTURE_B]);
		// skill-x: 3 from A + 1 from B = 4
		expect(obs.get('skill-x')).toBe(4);
	});

	it('is deterministic', () => {
		const first = extractSkillObservationCounts([FIXTURE_A]);
		const second = extractSkillObservationCounts([FIXTURE_A]);
		expect(first.get('skill-x')).toBe(second.get('skill-x'));
	});
});

// ---------------------------------------------------------------------------
// computeSignals
// ---------------------------------------------------------------------------

describe('computeSignals()', () => {
	it('computes correct coSelectionRate', () => {
		const co = extractCoSelectionCounts([FIXTURE_A]);
		const obs = extractSkillObservationCounts([FIXTURE_A]);
		const signals = computeSignals(co, obs);

		const xy = signals.find(
			(s) => s.sourceSkill === 'skill-x' && s.targetSkill === 'skill-y',
		);
		expect(xy).toBeDefined();
		// 2 co-selections out of 3 observations for skill-x
		expect(xy?.coSelectionRate).toBeCloseTo(2 / 3);
		expect(xy?.coSelectionCount).toBe(2);
		expect(xy?.observedCount).toBe(3);
	});

	it('sorts output by sourceSkill then targetSkill', () => {
		const co = extractCoSelectionCounts([FIXTURE_A]);
		const obs = extractSkillObservationCounts([FIXTURE_A]);
		const signals = computeSignals(co, obs);

		const sources = signals.map((s) => s.sourceSkill);
		const sorted = [...sources].sort((a, b) => a.localeCompare(b));
		expect(sources).toEqual(sorted);

		// Within the same sourceSkill, targets must be sorted too
		const xSignals = signals.filter((s) => s.sourceSkill === 'skill-x');
		const xTargets = xSignals.map((s) => s.targetSkill);
		expect(xTargets).toEqual([...xTargets].sort((a, b) => a.localeCompare(b)));
	});

	it('is deterministic — same data produces identical signals array', () => {
		const co = extractCoSelectionCounts([FIXTURE_A]);
		const obs = extractSkillObservationCounts([FIXTURE_A]);
		const first = computeSignals(co, obs);
		const second = computeSignals(co, obs);
		expect(first).toEqual(second);
	});

	it('returns an empty array for no observations', () => {
		const co = extractCoSelectionCounts([EMPTY_FIXTURE]);
		const obs = extractSkillObservationCounts([EMPTY_FIXTURE]);
		expect(computeSignals(co, obs)).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// buildRelevanceSignalTable
// ---------------------------------------------------------------------------

describe('buildRelevanceSignalTable()', () => {
	it('produces the correct schemaVersion', () => {
		const table = buildRelevanceSignalTable([FIXTURE_A], '2026-01-01');
		expect(table.schemaVersion).toBe(RELEVANCE_SIGNAL_SCHEMA_VERSION);
	});

	it('records the injected generatedAt date', () => {
		const table = buildRelevanceSignalTable([FIXTURE_A], '2026-01-01');
		expect(table.generatedAt).toBe('2026-01-01');
	});

	it('lists source datasets sorted alphabetically', () => {
		const table = buildRelevanceSignalTable([FIXTURE_B, FIXTURE_A], '2026-01-01');
		expect(table.sourceDatasets).toEqual(['dataset-a', 'dataset-b']);
	});

	it('counts totalObservations correctly', () => {
		const table = buildRelevanceSignalTable([FIXTURE_A, FIXTURE_B], '2026-01-01');
		expect(table.totalObservations).toBe(
			FIXTURE_A.results.length + FIXTURE_B.results.length,
		);
	});

	it('is deterministic — fixture order does not change output', () => {
		const tableAB = buildRelevanceSignalTable([FIXTURE_A, FIXTURE_B], '2026-01-01');
		const tableBA = buildRelevanceSignalTable([FIXTURE_B, FIXTURE_A], '2026-01-01');
		// signals array and sourceDatasets should match regardless of input order
		expect(tableAB.signals).toEqual(tableBA.signals);
		expect(tableAB.sourceDatasets).toEqual(tableBA.sourceDatasets);
		expect(tableAB.totalObservations).toBe(tableBA.totalObservations);
	});

	it('handles empty fixtures gracefully', () => {
		const table = buildRelevanceSignalTable([], '2026-01-01');
		expect(table.signals).toHaveLength(0);
		expect(table.totalObservations).toBe(0);
		expect(table.sourceDatasets).toHaveLength(0);
	});
});

// ---------------------------------------------------------------------------
// indexSignalsBySource
// ---------------------------------------------------------------------------

describe('indexSignalsBySource()', () => {
	it('builds a lookup by sourceSkill → targetSkill → rate', () => {
		const table = buildRelevanceSignalTable([FIXTURE_A], '2026-01-01');
		const index = indexSignalsBySource(table);

		const xRates = index.get('skill-x');
		expect(xRates).toBeDefined();
		expect(xRates?.get('skill-y')).toBeCloseTo(2 / 3);
	});

	it('returns an empty index for an empty signal table', () => {
		const table = buildRelevanceSignalTable([], '2026-01-01');
		const index = indexSignalsBySource(table);
		expect(index.size).toBe(0);
	});
});

// ---------------------------------------------------------------------------
// reRankRelatedSkills
// ---------------------------------------------------------------------------

describe('reRankRelatedSkills()', () => {
	const staticRelated = ['skill-a', 'skill-b', 'skill-c'];
	const signalIndex = new Map([
		[
			'skill-source',
			new Map([
				['skill-c', 0.9], // high observed rate for 3rd-place static entry
				['skill-a', 0.1], // low observed rate for 1st-place static entry
			]),
		],
	]);

	it('promotes a highly observed skill above a statically lower-ranked one with weak evidence', () => {
		// skill-b (rank 2, no observed rate) vs skill-c (rank 3, high observed rate 0.9)
		// skill-b static: (1-1/3)*0.7 + 0*0.3 = 0.467
		// skill-c static+observed: (1-2/3)*0.7 + 0.9*0.3 = 0.503  → skill-c wins
		const result = reRankRelatedSkills('skill-source', staticRelated, signalIndex);
		const idxC = result.indexOf('skill-c');
		const idxB = result.indexOf('skill-b');
		expect(idxC).toBeLessThan(idxB);
	});

	it('respects the limit parameter', () => {
		const result = reRankRelatedSkills('skill-source', staticRelated, signalIndex, 2);
		expect(result).toHaveLength(2);
	});

	it('is deterministic — same input produces same output', () => {
		const first = reRankRelatedSkills('skill-source', staticRelated, signalIndex);
		const second = reRankRelatedSkills('skill-source', staticRelated, signalIndex);
		expect(first).toEqual(second);
	});

	it('falls back to static order when no signals exist for the skill', () => {
		const result = reRankRelatedSkills('skill-unknown', staticRelated, new Map());
		// Without any observed evidence only static scoring applies (observed weight = 0)
		// Static scores: 1.0, 0.67, 0.33 — order preserved
		expect(result).toEqual(staticRelated.slice(0, 5));
	});

	it('can surface a cross-domain skill not in the static list', () => {
		const smallStatic = ['skill-a'];
		const indexWithCross = new Map([
			[
				'skill-source',
				new Map([
					['skill-a', 0.1],
					['skill-new', 0.95], // high-evidence cross-domain entry
				]),
			],
		]);
		const result = reRankRelatedSkills(
			'skill-source',
			smallStatic,
			indexWithCross,
			5,
		);
		expect(result).toContain('skill-new');
	});

	it('never includes the skill itself in its own relatedSkills', () => {
		const selfIndex = new Map([
			[
				'skill-source',
				new Map([
					['skill-source', 1.0], // pathological self-reference
					['skill-a', 0.5],
				]),
			],
		]);
		const result = reRankRelatedSkills(
			'skill-source',
			['skill-a', 'skill-b'],
			selfIndex,
		);
		expect(result).not.toContain('skill-source');
	});
});

// ---------------------------------------------------------------------------
// OBSERVED_WEIGHT constant
// ---------------------------------------------------------------------------

describe('OBSERVED_WEIGHT', () => {
	it('is between 0 and 1 exclusive', () => {
		expect(OBSERVED_WEIGHT).toBeGreaterThan(0);
		expect(OBSERVED_WEIGHT).toBeLessThan(1);
	});
});
