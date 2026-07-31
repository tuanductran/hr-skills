/**
 * Runtime context propagation — Phase 4.3.
 *
 * `RuntimeContextImpl` is the concrete, mutable implementation of the
 * `RuntimeContext` interface. It's a thin wrapper over a `Map` keyed by
 * skill ID, deliberately explicit rather than relying on closures or
 * module-level state, so context threading stays easy to reason about and
 * to unit test in isolation from the executor.
 */

import type { RuntimeContext } from '../shared/types.js';

class RuntimeContextImpl implements RuntimeContext {
	readonly intent: string;
	private readonly outputs = new Map<string, unknown>();

	/**
	 * @param intent - The original user intent the plan was generated for.
	 *   Stored read-only on the context so every step executor can inspect it.
	 */
	constructor(intent: string) {
		this.intent = intent;
	}

	/**
	 * Retrieve the output recorded for a completed step.
	 *
	 * @param skillId - The ID of the skill whose output to retrieve.
	 * @returns The stored output value, or `undefined` if the skill has not yet run.
	 */
	get(skillId: string): unknown {
		return this.outputs.get(skillId);
	}

	/**
	 * Record the output produced by a completed step, making it visible
	 * to all subsequent steps in the workflow.
	 *
	 * @param skillId - The ID of the skill that produced the output.
	 * @param value - The output value to store (any serializable type).
	 */
	set(skillId: string, value: unknown): void {
		this.outputs.set(skillId, value);
	}

	/**
	 * Check whether a skill has already produced output in this context.
	 *
	 * @param skillId - The ID of the skill to check.
	 * @returns `true` if an output was recorded for `skillId`, `false` otherwise.
	 */
	has(skillId: string): boolean {
		return this.outputs.has(skillId);
	}

	/**
	 * Return a plain-object snapshot of all outputs recorded so far, keyed by skill ID.
	 * The returned object is a shallow copy — mutations do not affect the internal map.
	 *
	 * @returns A `Record<string, unknown>` containing all skill outputs recorded so far.
	 */
	toObject(): Record<string, unknown> {
		return Object.fromEntries(this.outputs);
	}
}

/**
 * Create a fresh, empty runtime context for the given plan intent.
 *
 * @param intent - The original user intent passed to `generateExecutionPlan`.
 * @returns A new `RuntimeContext` instance with no recorded outputs.
 */
export function createRuntimeContext(intent: string): RuntimeContext {
	return new RuntimeContextImpl(intent);
}
