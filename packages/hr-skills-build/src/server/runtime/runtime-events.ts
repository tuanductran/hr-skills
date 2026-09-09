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

import type { RuntimeEvent, RuntimeEventType } from '../shared/types.js';

/** Records runtime events in emission order and assigns each a logical-clock `order`. */
export class EventDispatcher {
	private readonly events: RuntimeEvent[] = [];
	private nextOrder = 0;
	private readonly onEvent: ((event: RuntimeEvent) => void) | undefined;

	/**
	 * @param onEvent - Optional callback invoked synchronously each time an
	 *   event is emitted. Useful for live progress UIs or logging. The
	 *   callback receives the fully constructed event object before it is
	 *   added to the internal event log.
	 */
	constructor(onEvent?: (event: RuntimeEvent) => void) {
		this.onEvent = onEvent;
	}

	/**
	 * Emit a new runtime event, assign it the next logical clock value,
	 * append it to the internal log, and invoke the optional `onEvent` callback.
	 *
	 * @param type - The event type (e.g. `'step-started'`, `'workflow-completed'`).
	 * @param details - Optional supplementary data to attach to the event.
	 * @param details.skillId - The skill this event concerns, if applicable.
	 * @param details.attempt - The attempt number for retry events.
	 * @param details.data - Arbitrary key-value pairs for diagnostics or tracing.
	 * @returns The fully constructed {@link RuntimeEvent} that was emitted.
	 */
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

	/**
	 * Return a shallow copy of all events emitted so far, in emission order.
	 *
	 * @returns An array of {@link RuntimeEvent} objects ordered by their `order` field.
	 */
	all(): RuntimeEvent[] {
		return [...this.events];
	}
}
