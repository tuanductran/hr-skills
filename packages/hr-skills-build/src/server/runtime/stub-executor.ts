import type { ExecutionStep, RuntimeContext } from '../../shared/types.js';

/**
 * A stub `StepExecutorFn` that returns a deterministic placeholder output
 * instead of actually invoking a skill. Shared by `cli/execute-plan.ts` (CLI
 * demonstration) and `evaluation/evaluate.ts` (so evaluation results
 * characterise the Planner/Runtime's sequencing and validation behaviour, not
 * a divergent stand-in) — previously duplicated independently in both files.
 *
 * Lives in `server/runtime/` because it is a legitimate runtime
 * implementation (albeit a stub/demo one) and is deliberately part of the
 * package's public server surface: the CLI in `packages/hr-skills` consumes
 * it via the `hr-skills-build/server` entry point, so it must be public.
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
