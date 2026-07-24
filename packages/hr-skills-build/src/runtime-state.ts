/**
 * Execution state management — Phase 4.3.
 *
 * `RuntimeStateTracker` is the single source of truth for where each skill
 * ID currently sits in its lifecycle (`pending -> running -> completed |
 * failed | skipped`). Every mutation moves an ID out of exactly one bucket
 * and into exactly one other, so the buckets always partition the full set
 * of skill IDs in the plan — a skill can never be "lost" or double-counted.
 *
 * The tracker is intentionally dumb: it doesn't know about retries, events,
 * or execution order. It only tracks membership, which keeps it easy to
 * extend with future buckets (e.g. 'blocked') without touching the executor.
 */

import type { RuntimeStateSnapshot, StepStatus } from './types.js';

export class RuntimeStateTracker {
	private readonly pending = new Set<string>();
	private readonly running = new Set<string>();
	private readonly completed = new Set<string>();
	private readonly failed = new Set<string>();
	private readonly skipped = new Set<string>();

	private readonly buckets: Record<StepStatus, Set<string>>;

	constructor(skillIds: readonly string[]) {
		this.buckets = {
			pending: this.pending,
			running: this.running,
			completed: this.completed,
			failed: this.failed,
			skipped: this.skipped,
		};
		for (const id of skillIds) {
			this.pending.add(id);
		}
	}

	statusOf(skillId: string): StepStatus | undefined {
		for (const [status, bucket] of Object.entries(this.buckets) as Array<
			[StepStatus, Set<string>]
		>) {
			if (bucket.has(skillId)) return status;
		}
		return undefined;
	}

	/** Move a skill ID from its current bucket into `next`. */
	private transition(skillId: string, next: StepStatus): void {
		for (const bucket of Object.values(this.buckets)) {
			bucket.delete(skillId);
		}
		this.buckets[next].add(skillId);
	}

	start(skillId: string): void {
		this.transition(skillId, 'running');
	}

	complete(skillId: string): void {
		this.transition(skillId, 'completed');
	}

	fail(skillId: string): void {
		this.transition(skillId, 'failed');
	}

	skip(skillId: string): void {
		this.transition(skillId, 'skipped');
	}

	isPending(skillId: string): boolean {
		return this.pending.has(skillId);
	}

	snapshot(): RuntimeStateSnapshot {
		return {
			pending: Array.from(this.pending).sort(),
			running: Array.from(this.running).sort(),
			completed: Array.from(this.completed),
			failed: Array.from(this.failed),
			skipped: Array.from(this.skipped),
		};
	}
}
