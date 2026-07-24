/**
 * Runtime context propagation — Phase 4.3.
 *
 * `RuntimeContextImpl` is the concrete, mutable implementation of the
 * `RuntimeContext` interface. It's a thin wrapper over a `Map` keyed by
 * skill ID, deliberately explicit rather than relying on closures or
 * module-level state, so context threading stays easy to reason about and
 * to unit test in isolation from the executor.
 */

import type { RuntimeContext } from './types.js';

class RuntimeContextImpl implements RuntimeContext {
	readonly intent: string;
	private readonly outputs = new Map<string, unknown>();

	constructor(intent: string) {
		this.intent = intent;
	}

	get(skillId: string): unknown {
		return this.outputs.get(skillId);
	}

	set(skillId: string, value: unknown): void {
		this.outputs.set(skillId, value);
	}

	has(skillId: string): boolean {
		return this.outputs.has(skillId);
	}

	toObject(): Record<string, unknown> {
		return Object.fromEntries(this.outputs);
	}
}

/** Create a fresh, empty runtime context for the given plan intent. */
export function createRuntimeContext(intent: string): RuntimeContext {
	return new RuntimeContextImpl(intent);
}
