import { describe, expect, it } from 'bun:test';

import { runEvaluation } from '../src/evaluate.js';
import { loadDataset, loadGoldenFixture } from '../src/evaluation-datasets.js';
import { buildRegistry } from '../src/registry.js';

/**
 * Integration test for the evaluation framework against the real Skill
 * Registry and the committed golden fixture.
 *
 * This is the regression guard the issue asks for: if a change to the
 * Planner, Runtime, or the underlying skills alters planning/execution
 * behavior for any of the committed scenarios, this test fails and names
 * exactly which case and field regressed.
 *
 * Mirrors `planner-integration.test.ts`'s `SKIP_INTEGRATION` opt-out for
 * environments without a full skills/ checkout.
 */
describe.if(process.env['SKIP_INTEGRATION'] !== 'true')(
	'Evaluation framework — golden regression',
	() => {
		it('reports zero regressions for planning-scenarios against the real registry', async () => {
			const registry = await buildRegistry();
			const dataset = await loadDataset('planning-scenarios');
			const golden = await loadGoldenFixture('planning-scenarios');

			expect(golden).toBeDefined();

			const report = await runEvaluation(dataset, registry, golden);

			if (report.regressedCaseIds.length > 0) {
				const details = report.results
					.filter((r) => r.regressions.length > 0)
					.map((r) => `${r.caseId}: ${r.regressions.join(', ')}`)
					.join('\n');
				throw new Error(`Evaluation regressions detected:\n${details}`);
			}

			expect(report.regressedCaseIds).toEqual([]);
			expect(report.failedCases).toBe(0);
			expect(report.totalCases).toBe(dataset.cases.length);
		});

		it('produces every quality metric as a finite ratio between 0 and 1', async () => {
			const registry = await buildRegistry();
			const dataset = await loadDataset('planning-scenarios');
			const golden = await loadGoldenFixture('planning-scenarios');

			const report = await runEvaluation(dataset, registry, golden);

			for (const value of Object.values(report.metrics)) {
				expect(Number.isFinite(value)).toBe(true);
				expect(value).toBeGreaterThanOrEqual(0);
				expect(value).toBeLessThanOrEqual(1);
			}
		});
	},
);
