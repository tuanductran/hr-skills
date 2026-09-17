import type { ExecutionStep, RuntimeContext } from '../../../shared/types.js';

/**
 * A stub `StepExecutorFn` that returns a deterministic placeholder output
 * instead of actually invoking a skill. Shared by `cli/execute-plan.ts` (CLI
 * demonstration) and `evaluation/evaluate.ts` (so evaluation results
 * characterize the Planner/Runtime's sequencing and validation behavior, not
 * a divergent stand-in) — previously duplicated independently in both files.
 *
 * Lives under `internal/` because it is a placeholder implementation detail,
 * not core runtime logic — but it IS re-exported deliberately from the
 * package's public server entrypoint (`server/index.ts`), since the CLI
 * genuinely depends on it. See that file for the intentional re-export.
 *
 * Real integrations should supply their own `StepExecutorFn` that actually
 * invokes the skill (for example, loading its SKILL.md and prompting a model).
 *
 * @param step - The plan step being "executed".
 * @param context - Outputs recorded from prior steps in the same run.
 * @returns A placeholder output object, never a rejected promise.
 */
export function stubStepExecutor(step: ExecutionStep, context: RuntimeContext): unknown {
	return {
		skillId: step.skillId,
		note: `Stub output for ${step.skillId}`,
		precedingSteps: Object.keys(context.toObject()),
	};
}
