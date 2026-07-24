/**
 * Execution events — Phase 4.3.
 *
 * `EventDispatcher` assigns each event a monotonically increasing `order`
 * (a logical clock) instead of a wall-clock timestamp. Two runs of the same
 * plan against the same step executor therefore produce byte-identical
 * event streams, which is what "deterministic execution" means in
 * practice — timestamps would make every run different even when nothing
 * about the outcome changed.
 */

import type { RuntimeEvent, RuntimeEventType } from './types.js';

export class EventDispatcher {
	private readonly events: RuntimeEvent[] = [];
	private nextOrder = 0;
	private readonly onEvent: ((event: RuntimeEvent) => void) | undefined;

	constructor(onEvent?: (event: RuntimeEvent) => void) {
		this.onEvent = onEvent;
	}

	emit(
		type: RuntimeEventType,
		details: {
			skillId?: string;
			attempt?: number;
			data?: Record<string, unknown>;
		} = {},
	): RuntimeEvent {
		const event: RuntimeEvent = { order: this.nextOrder++, type };
		if (details.skillId !== undefined) event.skillId = details.skillId;
		if (details.attempt !== undefined) event.attempt = details.attempt;
		if (details.data !== undefined) event.data = details.data;

		this.events.push(event);
		this.onEvent?.(event);
		return event;
	}

	all(): RuntimeEvent[] {
		return [...this.events];
	}
}
