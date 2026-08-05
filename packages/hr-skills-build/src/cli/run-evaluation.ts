#!/usr/bin/env bun

/**
 * CLI: Run the evaluation framework against every dataset in `eval/datasets/`.
 *
 * Usage:
 *   bun run evaluate               # run and report regressions
 *   bun run evaluate --update-golden  # regenerate golden fixtures
 *
 * Exit code is 0 when every dataset has zero regressions and zero invalid
 * plans, 1 otherwise — suitable for CI.
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import { runEvaluation, toGoldenFixture } from '../evaluation/evaluate.js';
import {
	loadAllDatasets,
	loadGoldenFixture,
	saveGoldenFixture,
} from '../evaluation/evaluation-datasets.js';
import { buildRegistry } from '../registry/registry.js';
import type { EvaluationReport } from '../shared/types.js';
import { runCli } from './cli-bootstrap.js';

async function main() {
	const updateGolden = process.argv.includes('--update-golden');

	p.intro('Evaluation Framework');

	const spinner = p.spinner();

	spinner.start('Building Skill Registry...');
	const registry = await buildRegistry();
	spinner.stop(`Registry ready (${registry.skillCount} skills)`);

	spinner.start('Loading evaluation datasets...');
	const datasets = await loadAllDatasets();
	spinner.stop(`Loaded ${datasets.length} dataset(s)`);

	const reports: EvaluationReport[] = [];

	for (const dataset of datasets) {
		spinner.start(`Running "${dataset.name}" (${dataset.cases.length} cases)...`);
		const golden = await loadGoldenFixture(dataset.name);
		const report = await runEvaluation(dataset, registry, golden);
		spinner.stop(
			`"${dataset.name}": ${report.passedCases}/${report.totalCases} passed`,
		);

		if (updateGolden) {
			await saveGoldenFixture(toGoldenFixture(dataset, report));
			p.log.success(`Golden fixture updated for "${dataset.name}"`);
		}

		reports.push(report);
	}

	for (const report of reports) {
		p.note(
			report.results
				.map((r) => {
					const icon =
						r.regressions.length > 0 ? '✗' : r.actual.planIsValid ? '✓' : '⚠';
					const detail =
						r.regressions.length > 0
							? `REGRESSION: ${r.regressions.join(', ')}`
							: `skills: [${r.actual.skillIds.join(', ')}]`;
					return `${icon} [${r.category}] ${r.caseId}\n     ${detail}`;
				})
				.join('\n\n'),
			`RESULTS — ${report.datasetName}`,
		);

		p.note(
			[
				`Capability matching accuracy: ${(report.metrics.capabilityMatchingAccuracy * 100).toFixed(1)}%`,
				`Skill selection accuracy:     ${(report.metrics.skillSelectionAccuracy * 100).toFixed(1)}%`,
				`Execution ordering accuracy:  ${(report.metrics.executionOrderingAccuracy * 100).toFixed(1)}%`,
				`Dependency correctness:       ${(report.metrics.dependencyCorrectness * 100).toFixed(1)}%`,
				`Workflow success rate:        ${(report.metrics.workflowSuccessRate * 100).toFixed(1)}%`,
			].join('\n'),
			`QUALITY METRICS — ${report.datasetName}`,
		);
	}

	const outputPath = join(process.cwd(), 'eval-report.json');
	writeFileSync(outputPath, JSON.stringify(reports, null, 2));
	p.log.success(`Evaluation report saved to: ${outputPath}`);

	const hasRegressions = reports.some((r) => r.regressedCaseIds.length > 0);
	// failedCases counts every case that isn't a clean pass (regression and/or
	// an invalid plan) — broader than "invalid plans" alone, so this check
	// can catch failures hasRegressions alone would miss (e.g. an invalid
	// plan with no golden fixture to regress against yet).
	const hasFailedCases = reports.some((r) => r.failedCases > 0);

	if (updateGolden) {
		p.outro('Golden fixtures updated');
		process.exit(0);
	}

	if (hasRegressions || hasFailedCases) {
		p.outro('Completed with regressions or failures');
		process.exit(1);
	}

	p.outro('Done — no regressions detected');
	process.exit(0);
}

runCli(main);
