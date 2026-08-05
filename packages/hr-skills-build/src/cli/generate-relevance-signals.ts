/**
 * CLI entry point: generate `registry/relevance-signals.json`.
 *
 * Reads every committed golden fixture from `eval/golden/`, builds a
 * deterministic `RelevanceSignalTable`, and writes the result to
 * `registry/relevance-signals.json`.
 *
 * Usage:
 *   bun run signals
 *
 * Equivalent root alias:
 *   bun run signals
 */

import { writeFileSync } from 'node:fs';
import { loadAllGoldenFixtures } from '../evaluation/evaluation-datasets.js';
import { buildRelevanceSignalTable } from '../search/relevance-signals.js';
import { RELEVANCE_SIGNALS_PATH } from '../shared/constants.js';

const fixtures = await loadAllGoldenFixtures();

if (fixtures.length === 0) {
	console.warn(
		'[signals] No golden fixtures found — relevance-signals.json will be empty.\n' +
			'         Run `bun run evaluate --update-golden` first to generate fixtures.',
	);
}

const table = buildRelevanceSignalTable(fixtures, new Date().toISOString().slice(0, 10));

writeFileSync(RELEVANCE_SIGNALS_PATH, `${JSON.stringify(table, null, '\t')}\n`);

console.log(
	`[signals] Wrote ${table.signals.length} signals from ` +
		`${table.totalObservations} observations across ` +
		`${table.sourceDatasets.length} dataset(s) → registry/relevance-signals.json`,
);
