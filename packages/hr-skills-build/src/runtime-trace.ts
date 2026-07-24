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

	all(): TraceEntry[] {
		return [...this.entries];
	}
}
