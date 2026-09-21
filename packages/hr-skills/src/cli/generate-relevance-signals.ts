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
 *
 * Check mode (CI): verify the committed file matches what the golden
 * fixtures would produce right now, without writing anything.
 *
 *   bun run signals:check
 */

import { readFileSync, writeFileSync } from 'node:fs';
import {
	buildRelevanceSignalTable,
	loadAllGoldenFixtures,
	RELEVANCE_SIGNALS_PATH,
} from 'hr-skills-build/server';

const fixtures = await loadAllGoldenFixtures();

if (fixtures.length === 0) {
	console.warn(
		'[signals] No golden fixtures found — relevance-signals.json will be empty.\n' +
			'         Run `bun run evaluate --update-golden` first to generate fixtures.',
	);
}

const checkMode = process.argv.includes('--check');

const table = buildRelevanceSignalTable(
	fixtures,
	checkMode ? '' : new Date().toISOString().slice(0, 10),
);

if (checkMode) {
	let existingRaw: string;
	try {
		existingRaw = readFileSync(RELEVANCE_SIGNALS_PATH, 'utf8');
	} catch {
		console.error(
			'registry/relevance-signals.json not found — run `bun run signals`.',
		);
		process.exitCode = 1;
		process.exit();
	}

	let existing: unknown;
	try {
		existing = JSON.parse(existingRaw);
	} catch {
		console.error('registry/relevance-signals.json is not valid JSON.');
		process.exitCode = 1;
		process.exit();
	}

	// generatedAt is a timestamp, not content — ignore it when comparing,
	// the same way registry/skills.json staleness is checked.
	const existingForCompare = {
		...(existing as Record<string, unknown>),
		generatedAt: '',
	};

	if (JSON.stringify(existingForCompare) !== JSON.stringify(table)) {
		console.error(
			'registry/relevance-signals.json is stale relative to the golden fixtures — run `bun run signals` and commit the result.',
		);
		process.exitCode = 1;
	} else {
		console.log('registry/relevance-signals.json is up to date.');
	}
} else {
	writeFileSync(RELEVANCE_SIGNALS_PATH, `${JSON.stringify(table, null, '\t')}\n`);

	console.log(
		`[signals] Wrote ${table.signals.length} signals from ` +
			`${table.totalObservations} observations across ` +
			`${table.sourceDatasets.length} dataset(s) → registry/relevance-signals.json`,
	);
}
