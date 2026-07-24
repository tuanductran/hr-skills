/**
 * Deterministic Workflow Runtime — Phase 4.3
 *
 * The Workflow Runtime executes an `ExecutionPlan` produced by the Skill
 * Planner (Phase 4.2). It is responsible for:
 *
 *  - Executing workflow steps in the order the Planner already computed
 *  - Propagating context (step outputs) between steps
 *  - Tracking execution state (pending / running / completed / failed / skipped)
 *  - Retrying failed steps according to a configurable RetryPolicy
 *  - Handling failures cleanly, including skipping downstream dependents
 *  - Emitting execution events and building a debuggable execution trace
 *
 * The Runtime is explicitly NOT responsible for intent analysis, capability
 * matching, skill discovery, or workflow planning — those are the Planner's
 * job (see planner.ts). The Runtime also does not decide *what* a step does:
 * callers supply a `StepExecutorFn` that performs the actual work (invoking
 * a skill, calling a model, running a tool, and so on). This keeps the
 * Runtime a pure sequencing/state engine, independent of any particular
 * execution backend — which is also what makes it deterministic and easy
 * to test with a stub executor.
 */

import { createRuntimeContext } from './runtime-context.js';
import { describeCause, RuntimeError } from './runtime-errors.js';
import { EventDispatcher } from './runtime-events.js';
import { noRetryPolicy } from './runtime-retry.js';
import { RuntimeStateTracker } from './runtime-state.js';
import { TraceCollector } from './runtime-trace.js';
import type {
	ExecutionPlan,
	ExecutionStep,
	RetryPolicy,
	RuntimeContext,
	RuntimeOptions,
	StepExecutorFn,
	StepResult,
	WorkflowResult,
} from './types.js';

// ============================================================================
// WorkflowExecutor
// ============================================================================

/**
 * Executes a single validated `ExecutionPlan` from start to finish.
 *
 * One `WorkflowExecutor` instance corresponds to one workflow run — it holds
 * no state that outlives a single `run()` call, so a fresh instance (or the
 * `executeWorkflow` convenience function) should be used for every plan.
 */
export class WorkflowExecutor {
	private readonly retryPolicy: RetryPolicy;
	private readonly stopOnFailure: boolean;
	private readonly events: EventDispatcher;
	private readonly trace: TraceCollector;

	constructor(options: RuntimeOptions = {}) {
		this.retryPolicy = options.retryPolicy ?? noRetryPolicy();
		this.stopOnFailure = options.stopOnFailure ?? true;
		this.events = new EventDispatcher(options.onEvent);
		this.trace = new TraceCollector();
	}

	/**
	 * Run the given plan against the given step executor.
	 *
	 * Steps execute strictly in `plan.steps` order (the order the Planner
	 * already computed via topological sort) — the Runtime never reorders
	 * steps itself, it only decides whether each one runs, retries, or is
	 * skipped.
	 */
	async run(plan: ExecutionPlan, executeStep: StepExecutorFn): Promise<WorkflowResult> {
		const skillIds = plan.steps.map((step) => step.skillId);
		const state = new RuntimeStateTracker(skillIds);
		const context = createRuntimeContext(plan.intent);
		const results: StepResult[] = [];

		this.emitAndTrace('workflow-started', {}, state);

		for (const step of plan.steps) {
			const blockedBy = this.findFailedOrSkippedDependency(step, state);

			if (blockedBy !== undefined) {
				state.skip(step.skillId);
				results.push({ skillId: step.skillId, status: 'skipped', attempts: 0 });
				this.emitAndTrace(
					'step-skipped',
					{ skillId: step.skillId, data: { blockedBy } },
					state,
				);
				continue;
			}

			const result = await this.runStep(step, context, state, executeStep);
			results.push(result);

			if (result.status === 'failed' && this.stopOnFailure) {
				this.skipRemaining(plan.steps, step.skillId, state, results);
				break;
			}
		}

		const status: WorkflowResult['status'] = results.some(
			(r) => r.status === 'failed',
		)
			? 'failed'
			: 'completed';

		this.emitAndTrace(
			status === 'completed' ? 'workflow-completed' : 'workflow-failed',
			{},
			state,
		);

		return {
			status,
			intent: plan.intent,
			outputs: context.toObject(),
			steps: results,
			events: this.events.all(),
			trace: this.trace.all(),
			state: state.snapshot(),
		};
	}

	/**
	 * Execute a single step, applying the retry policy on failure.
	 * Returns once the step has either succeeded or exhausted its retries.
	 */
	private async runStep(
		step: ExecutionStep,
		context: RuntimeContext,
		state: RuntimeStateTracker,
		executeStep: StepExecutorFn,
	): Promise<StepResult> {
		state.start(step.skillId);
		this.emitAndTrace('step-started', { skillId: step.skillId, attempt: 1 }, state);

		const maxAttempts = this.retryPolicy.maxRetries + 1;
		let lastError: unknown;

		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			try {
				const output = await executeStep(step, context);
				context.set(step.skillId, output);
				state.complete(step.skillId);
				this.emitAndTrace(
					'step-completed',
					{ skillId: step.skillId, attempt },
					state,
					{ result: output },
				);
				return {
					skillId: step.skillId,
					status: 'completed',
					output,
					attempts: attempt,
				};
			} catch (error) {
				lastError = error;
				const isLastAttempt = attempt >= maxAttempts;
				const willRetry =
					!isLastAttempt &&
					(this.retryPolicy.shouldRetry?.(error, attempt) ?? true);

				if (willRetry) {
					const delayMs = this.retryPolicy.delayForAttempt(attempt);
					this.emitAndTrace(
						'step-retry',
						{
							skillId: step.skillId,
							attempt,
							data: { delayMs, reason: describeCause(error) },
						},
						state,
					);
					continue;
				}

				const runtimeError = new RuntimeError(
					'STEP_EXECUTION_FAILED',
					`Step "${step.skillId}" failed after ${attempt} attempt${attempt === 1 ? '' : 's'}: ${describeCause(error)}`,
					{ skillId: step.skillId, attempt, cause: error },
				);
				state.fail(step.skillId);
				this.emitAndTrace(
					'step-failed',
					{ skillId: step.skillId, attempt },
					state,
					{ error: runtimeError.toInfo() },
				);
				return {
					skillId: step.skillId,
					status: 'failed',
					error: runtimeError.toInfo(),
					attempts: attempt,
				};
			}
		}

		// Defensive fallback — the loop above always returns; this satisfies
		// noImplicitReturns without changing observable behavior.
		const fallbackError = new RuntimeError(
			'STEP_EXECUTION_FAILED',
			`Step "${step.skillId}" failed: ${describeCause(lastError)}`,
			{ skillId: step.skillId, attempt: maxAttempts, cause: lastError },
		);
		state.fail(step.skillId);
		return {
			skillId: step.skillId,
			status: 'failed',
			error: fallbackError.toInfo(),
			attempts: maxAttempts,
		};
	}

	private findFailedOrSkippedDependency(
		step: ExecutionStep,
		state: RuntimeStateTracker,
	): string | undefined {
		for (const depId of step.dependencies) {
			const status = state.statusOf(depId);
			if (status === 'failed' || status === 'skipped') {
				return depId;
			}
		}
		return undefined;
	}

	private skipRemaining(
		steps: ExecutionStep[],
		failedSkillId: string,
		state: RuntimeStateTracker,
		results: StepResult[],
	): void {
		for (const step of steps) {
			if (!state.isPending(step.skillId)) continue;
			state.skip(step.skillId);
			results.push({ skillId: step.skillId, status: 'skipped', attempts: 0 });
			this.emitAndTrace(
				'step-skipped',
				{ skillId: step.skillId, data: { blockedBy: failedSkillId } },
				state,
			);
		}
	}

	private emitAndTrace(
		type: Parameters<EventDispatcher['emit']>[0],
		details: Parameters<EventDispatcher['emit']>[1],
		state: RuntimeStateTracker,
		extras: { result?: unknown; error?: import('./types.js').RuntimeErrorInfo } = {},
	): void {
		const event = this.events.emit(type, details);
		this.trace.record(event, state.snapshot(), extras);
	}
}

// ============================================================================
// Public API
// ============================================================================

export async function executeWorkflow(
	plan: ExecutionPlan,
	executeStep: StepExecutorFn,
	options?: RuntimeOptions,
): Promise<WorkflowResult> {
	const executor = new WorkflowExecutor(options);
	return executor.run(plan, executeStep);
}
