/**
 * Execution tracing — Phase 4.3.
 *
 * `TraceCollector` builds the debugging artifact for a workflow run: one
 * `TraceEntry` per event, each carrying a snapshot of runtime state
 * immediately after that event was applied. Replaying a trace in order
 * reconstructs the entire execution — which steps ran, in what order, what
 * they returned, what failed, and how many retries occurred — without
 * needing to re-run anything.
 */

import type {
	RuntimeErrorInfo,
	RuntimeEvent,
	RuntimeStateSnapshot,
	TraceEntry,
} from './types.js';

export class TraceCollector {
	private readonly entries: TraceEntry[] = [];

	/**
	 * Record a new trace entry pairing an event with the runtime state snapshot
	 * that was taken immediately after the event was applied.
	 *
	 * @param event - The runtime event that was just emitted.
	 * @param state - Snapshot of the runtime state after `event` was applied.
	 * @param extras - Optional supplementary data attached to the entry.
	 * @param extras.result - The output value returned by a completed step.
	 * @param extras.error - The serializable error info produced by a failed step.
	 * @returns The newly created {@link TraceEntry} that was appended to the log.
	 */
	record(
		event: RuntimeEvent,
		state: RuntimeStateSnapshot,
		extras: { result?: unknown; error?: RuntimeErrorInfo } = {},
	): TraceEntry {
		const entry: TraceEntry = {
			order: event.order,
			type: event.type,
			state,
		};
		if (event.skillId !== undefined) entry.skillId = event.skillId;
		if (event.attempt !== undefined) entry.attempt = event.attempt;
		if (extras.result !== undefined) entry.result = extras.result;
		if (extras.error !== undefined) entry.error = extras.error;

		this.entries.push(entry);
		return entry;
	}

	/**
	 * Return a shallow copy of all trace entries recorded so far, in the order
	 * they were recorded (i.e. matching the logical event clock order).
	 *
	 * @returns An array of {@link TraceEntry} objects representing the full execution trace.
	 */
	all(): TraceEntry[] {
		return [...this.entries];
	}
}
