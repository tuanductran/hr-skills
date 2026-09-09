/**
 * Evaluation framework — Phase 4.4.
 *
 * Runs a dataset of representative planning scenarios through the Skill
 * Planner and Workflow Runtime, compares the outcome against a committed
 * golden fixture, and aggregates deterministic quality metrics.
 *
 * The framework deliberately reuses the exact same functions the CLIs use
 * (`generateExecutionPlan`, `validateExecutionPlan`, `executeWorkflow`)
 * rather than reimplementing planning/execution logic — it evaluates the
 * real pipeline, not a parallel approximation of it.
 */

import { generateExecutionPlan } from '../planner/planner.js';
import { executeWorkflow } from '../runtime/runtime.js';
import { stubStepExecutor } from '../shared/helpers.js';
import type {
	EvaluationCase,
	EvaluationCaseResult,
	EvaluationDataset,
	EvaluationReport,
	GoldenCaseResult,
	GoldenFixture,
	QualityMetrics,
	Registry,
} from '../shared/types.js';
import { validateExecutionPlan } from '../validation/validate-planner.js';

/**
 * Run a single evaluation case against the given registry, deterministically.
 *
 * @param evalCase - The intent and metadata for this case.
 * @param registry - Registry to plan/execute against.
 * @returns The same shape stored in a golden fixture, for direct comparison.
 */
export async function runCase(
	evalCase: EvaluationCase,
	registry: Registry,
): Promise<GoldenCaseResult> {
	const plan = generateExecutionPlan(evalCase.intent, registry);
	const validation = validateExecutionPlan(plan, registry);

	const matchedCapabilities = plan.capabilityMatches.filter((m) => m.isMatched).length;

	const workflow =
		plan.steps.length === 0
			? { status: 'completed' as const }
			: await executeWorkflow(plan, stubStepExecutor);

	return {
		caseId: evalCase.id,
		skillIds: plan.steps.map((step) => step.skillId),
		matchedCapabilities,
		totalCapabilities: plan.requestedCapabilities.length,
		planIsValid: validation.isValid,
		workflowStatus: workflow.status,
	};
}

/**
 * Compare an actual case result against its golden fixture entry.
 *
 * @param actual - Result from a fresh {@link runCase} run.
 * @param golden - The previously committed result for the same case, if any.
 * @returns Field names that differ (empty when they match, or when there is no golden entry to compare against yet).
 */
export function diffAgainstGolden(
	actual: GoldenCaseResult,
	golden: GoldenCaseResult | undefined,
): string[] {
	if (!golden) return [];

	const regressions: string[] = [];

	if (JSON.stringify(actual.skillIds) !== JSON.stringify(golden.skillIds)) {
		regressions.push('skillIds');
	}
	if (actual.matchedCapabilities !== golden.matchedCapabilities) {
		regressions.push('matchedCapabilities');
	}
	if (actual.totalCapabilities !== golden.totalCapabilities) {
		regressions.push('totalCapabilities');
	}
	if (actual.planIsValid !== golden.planIsValid) {
		regressions.push('planIsValid');
	}
	if (actual.workflowStatus !== golden.workflowStatus) {
		regressions.push('workflowStatus');
	}

	return regressions;
}

/** Run every case in a dataset and compare each against the golden fixture. */
async function runDataset(
	dataset: EvaluationDataset,
	registry: Registry,
	golden: GoldenFixture | undefined,
): Promise<EvaluationCaseResult[]> {
	const goldenByCaseId = new Map((golden?.results ?? []).map((r) => [r.caseId, r]));

	const results: EvaluationCaseResult[] = [];
	for (const evalCase of dataset.cases) {
		const actual = await runCase(evalCase, registry);
		const goldenResult = goldenByCaseId.get(evalCase.id);
		results.push({
			caseId: evalCase.id,
			category: evalCase.category,
			intent: evalCase.intent,
			actual,
			...(goldenResult ? { golden: goldenResult } : {}),
			regressions: diffAgainstGolden(actual, goldenResult),
		});
	}
	return results;
}

/**
 * Compute deterministic 0.0-1.0 quality metrics across a set of case
 * results. A case "passes" quality checks when it has zero regressions
 * against the golden fixture (or has no golden fixture yet).
 *
 * @param results - Per-case results, typically from `runDataset`.
 * @returns Aggregated 0.0-1.0 accuracy/success-rate metrics.
 */
export function computeQualityMetrics(results: EvaluationCaseResult[]): QualityMetrics {
	const ratio = (numerator: number, denominator: number): number =>
		denominator === 0 ? 1 : numerator / denominator;

	const totalMatched = results.reduce(
		(sum, r) => sum + r.actual.matchedCapabilities,
		0,
	);
	const totalRequested = results.reduce(
		(sum, r) => sum + r.actual.totalCapabilities,
		0,
	);

	const skillSelectionMatches = results.filter(
		(r) => !r.regressions.includes('skillIds'),
	).length;

	const executionOrderingMatches = results.filter((r) => {
		// Ordering is captured within skillIds (already order-sensitive), so
		// an ordering regression is a skillIds regression with an identical
		// set but different sequence.
		if (!r.golden) return true;
		const sameSet =
			[...r.actual.skillIds].sort().join(',') ===
			[...r.golden.skillIds].sort().join(',');
		const sameOrder = r.actual.skillIds.join(',') === r.golden.skillIds.join(',');
		return !sameSet || sameOrder;
	}).length;

	const dependencyCorrectCount = results.filter((r) => r.actual.planIsValid).length;
	const workflowSuccessCount = results.filter(
		(r) => r.actual.workflowStatus === 'completed',
	).length;

	return {
		capabilityMatchingAccuracy: ratio(totalMatched, totalRequested),
		skillSelectionAccuracy: ratio(skillSelectionMatches, results.length),
		executionOrderingAccuracy: ratio(executionOrderingMatches, results.length),
		dependencyCorrectness: ratio(dependencyCorrectCount, results.length),
		workflowSuccessRate: ratio(workflowSuccessCount, results.length),
	};
}

/**
 * Run a full evaluation of one dataset and produce the aggregated report.
 *
 * @param dataset - Cases to evaluate.
 * @param registry - Registry to plan/execute against.
 * @param golden - Previously committed results to diff against, if any.
 * @returns The full evaluation report, including per-case results and aggregated metrics.
 */
export async function runEvaluation(
	dataset: EvaluationDataset,
	registry: Registry,
	golden: GoldenFixture | undefined,
): Promise<EvaluationReport> {
	const results = await runDataset(dataset, registry, golden);
	const metrics = computeQualityMetrics(results);

	const regressedCaseIds = results
		.filter((r) => r.regressions.length > 0)
		.map((r) => r.caseId);

	const passedCases = results.filter(
		(r) => r.regressions.length === 0 && r.actual.planIsValid,
	).length;

	return {
		generatedAt: new Date().toISOString().slice(0, 10),
		datasetName: dataset.name,
		totalCases: results.length,
		passedCases,
		failedCases: results.length - passedCases,
		metrics,
		results,
		regressedCaseIds,
	};
}

/**
 * Build a golden fixture from a fresh run — used by `--update-golden`.
 *
 * @param dataset - The dataset that was evaluated.
 * @param report - The evaluation report to convert.
 * @returns A fixture ready to be written with `saveGoldenFixture`.
 */
export function toGoldenFixture(
	dataset: EvaluationDataset,
	report: EvaluationReport,
): GoldenFixture {
	return {
		dataset: dataset.name,
		generatedAt: report.generatedAt,
		results: report.results.map((r) => r.actual),
	};
}
