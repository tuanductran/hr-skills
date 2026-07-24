import { describe, expect, it } from 'bun:test';

import {
	listGoldenFixtureNames,
	loadAllDatasets,
	loadDataset,
	loadGoldenFixture,
} from '../src/evaluation-datasets.js';

describe('loadDataset', () => {
	it('loads the planning-scenarios dataset', async () => {
		const dataset = await loadDataset('planning-scenarios');

		expect(dataset.name).toBe('planning-scenarios');
		expect(dataset.cases.length).toBeGreaterThan(0);
		for (const evalCase of dataset.cases) {
			expect(evalCase.id).toBeTruthy();
			expect(evalCase.intent).toBeTruthy();
			expect(evalCase.category).toBeTruthy();
		}
	});

	it('has no duplicate case IDs within a dataset', async () => {
		const dataset = await loadDataset('planning-scenarios');
		const ids = dataset.cases.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('loadAllDatasets', () => {
	it('discovers every dataset file in eval/datasets', async () => {
		const datasets = await loadAllDatasets();
		expect(datasets.length).toBeGreaterThan(0);
		expect(datasets.map((d) => d.name)).toContain('planning-scenarios');
	});
});

describe('listGoldenFixtureNames / loadGoldenFixture', () => {
	it('lists the committed golden fixtures', async () => {
		const names = await listGoldenFixtureNames();
		expect(names).toContain('planning-scenarios');
	});

	it('loads a committed golden fixture with one entry per dataset case', async () => {
		const dataset = await loadDataset('planning-scenarios');
		const golden = await loadGoldenFixture('planning-scenarios');

		expect(golden).toBeDefined();
		expect(golden?.dataset).toBe('planning-scenarios');
		expect(golden?.results.length).toBe(dataset.cases.length);

		const goldenIds = new Set(golden?.results.map((r) => r.caseId));
		for (const evalCase of dataset.cases) {
			expect(goldenIds.has(evalCase.id)).toBe(true);
		}
	});

	it('returns undefined for a dataset with no golden fixture yet', async () => {
		const golden = await loadGoldenFixture('does-not-exist');
		expect(golden).toBeUndefined();
	});
});
