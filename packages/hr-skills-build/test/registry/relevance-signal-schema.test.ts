import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { buildRegistry, loadRelevanceSignalTable } from '../../src/server/registry/registry.js';
import { RELEVANCE_SIGNAL_SCHEMA_VERSION } from '../../src/shared/search/relevance-signals.js';
import type { RelevanceSignalTable } from '../../src/shared/search/relevance-signals.js';

describe('loadRelevanceSignalTable() semantic invariants', () => {
	let tmpDir: string;

	beforeEach(async () => {
		tmpDir = await mkdtemp(join(tmpdir(), 'relevance-signal-invariants-'));
	});

	afterEach(async () => {
		await rm(tmpDir, { recursive: true, force: true });
	});

	async function loadWithSignals(
		signals: ReadonlyArray<Record<string, unknown>>,
		totalObservations = 10,
	): Promise<RelevanceSignalTable | undefined> {
		const path = join(tmpDir, `${Math.random().toString(36).slice(2)}.json`);
		await writeFile(
			path,
			JSON.stringify({
				schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
				generatedAt: '2026-01-01',
				sourceDatasets: ['test-fixture'],
				totalObservations,
				signals,
			}),
			'utf8',
		);
		return loadRelevanceSignalTable(path);
	}

	const validSignal = {
		sourceSkill: 'hr-a',
		targetSkill: 'hr-b',
		coSelectionRate: 0.5,
		coSelectionCount: 5,
		observedCount: 10,
	};

	it('accepts a semantically valid signal', async () => {
		const result = await loadWithSignals([validSignal]);
		expect(result?.signals).toEqual([validSignal]);
	});

	it('rejects a rate below 0', async () => {
		const result = await loadWithSignals([{ ...validSignal, coSelectionRate: -0.01 }]);
		expect(result).toBeUndefined();
	});

	it('rejects a rate above 1', async () => {
		const result = await loadWithSignals([{ ...validSignal, coSelectionRate: 1.01 }]);
		expect(result).toBeUndefined();
	});

	it('rejects negative counts', async () => {
		const result = await loadWithSignals([{ ...validSignal, coSelectionCount: -1 }]);
		expect(result).toBeUndefined();
	});

	it('rejects fractional counts', async () => {
		const result = await loadWithSignals([{ ...validSignal, coSelectionCount: 2.5 }]);
		expect(result).toBeUndefined();
	});

	it('rejects a non-positive observedCount', async () => {
		const result = await loadWithSignals([
			{ ...validSignal, coSelectionCount: 0, observedCount: 0, coSelectionRate: 0 },
		]);
		expect(result).toBeUndefined();
	});

	it('rejects coSelectionCount greater than observedCount', async () => {
		const result = await loadWithSignals([
			{ ...validSignal, coSelectionCount: 11, observedCount: 10, coSelectionRate: 1 },
		]);
		expect(result).toBeUndefined();
	});

	it('rejects a rate inconsistent with the counts', async () => {
		const result = await loadWithSignals([{ ...validSignal, coSelectionRate: 0.7 }]);
		expect(result).toBeUndefined();
	});

	it('rejects self-referential signals', async () => {
		const result = await loadWithSignals([{ ...validSignal, targetSkill: validSignal.sourceSkill }]);
		expect(result).toBeUndefined();
	});

	it('rejects fractional totalObservations', async () => {
		const result = await loadWithSignals([validSignal], 10.5);
		expect(result).toBeUndefined();
	});

	it('rejects negative totalObservations', async () => {
		const result = await loadWithSignals([validSignal], -1);
		expect(result).toBeUndefined();
	});

	it('rejects a signal observedCount above totalObservations', async () => {
		const result = await loadWithSignals([validSignal], 9);
		expect(result).toBeUndefined();
	});
});

describe('buildRegistry() relevance-signal boundary validation', () => {
	it('ignores duplicate source-target pairs', async () => {
		const duplicateSignals: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 10,
			signals: [
				{
					sourceSkill: 'hr-career-development',
					targetSkill: 'hr-performance-review',
					coSelectionRate: 0.5,
					coSelectionCount: 5,
					observedCount: 10,
				},
				{
					sourceSkill: 'hr-career-development',
					targetSkill: 'hr-performance-review',
					coSelectionRate: 0.4,
					coSelectionCount: 4,
					observedCount: 10,
				},
			],
		};

		const [withoutSignals, withDuplicateSignals] = await Promise.all([buildRegistry(), buildRegistry(duplicateSignals)]);
		expect(withDuplicateSignals.skills).toEqual(withoutSignals.skills);
	});

	it('ignores unknown source or target skill IDs', async () => {
		const unknownSignal: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 10,
			signals: [
				{
					sourceSkill: 'hr-does-not-exist',
					targetSkill: 'hr-performance-review',
					coSelectionRate: 0.5,
					coSelectionCount: 5,
					observedCount: 10,
				},
			],
		};

		const [withoutSignals, withUnknownSignal] = await Promise.all([buildRegistry(), buildRegistry(unknownSignal)]);
		expect(withUnknownSignal.skills).toEqual(withoutSignals.skills);
	});
});
