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

import type { RuntimeStateSnapshot, StepStatus } from '../shared/types.js';

export class RuntimeStateTracker {
	private readonly pending = new Set<string>();
	private readonly running = new Set<string>();
	private readonly completed = new Set<string>();
	private readonly failed = new Set<string>();
	private readonly skipped = new Set<string>();

	/** Map from status label to the corresponding bucket set, used by `transition`. */
	private readonly buckets: Record<StepStatus, Set<string>>;

	/**
	 * Initialize the tracker with all given skill IDs in the `pending` bucket.
	 *
	 * @param skillIds - The ordered list of skill IDs from the execution plan.
	 *   Every ID starts in `pending` and transitions through the lifecycle from there.
	 */
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

	/**
	 * Return the current lifecycle status of a skill ID.
	 *
	 * @param skillId - The skill ID to look up.
	 * @returns The current {@link StepStatus}, or `undefined` if the ID is unknown.
	 */
	statusOf(skillId: string): StepStatus | undefined {
		for (const [status, bucket] of Object.entries(this.buckets) as Array<
			[StepStatus, Set<string>]
		>) {
			if (bucket.has(skillId)) return status;
		}
		return undefined;
	}

	/**
	 * Move a skill ID from its current bucket into `next`.
	 * Removes the ID from all buckets before adding it to the target,
	 * ensuring the partitioning invariant is maintained.
	 *
	 * @param skillId - The skill ID to transition.
	 * @param next - The target lifecycle status.
	 */
	private transition(skillId: string, next: StepStatus): void {
		for (const bucket of Object.values(this.buckets)) {
			bucket.delete(skillId);
		}
		this.buckets[next].add(skillId);
	}

	/**
	 * Transition a skill from `pending` to `running`.
	 * Called immediately before the step executor is invoked.
	 *
	 * @param skillId - The skill ID that is beginning execution.
	 */
	start(skillId: string): void {
		this.transition(skillId, 'running');
	}

	/**
	 * Transition a skill from `running` to `completed`.
	 * Called after the step executor returns successfully.
	 *
	 * @param skillId - The skill ID that finished without error.
	 */
	complete(skillId: string): void {
		this.transition(skillId, 'completed');
	}

	/**
	 * Transition a skill from `running` to `failed`.
	 * Called after the step executor throws and all retry attempts are exhausted.
	 *
	 * @param skillId - The skill ID that failed definitively.
	 */
	fail(skillId: string): void {
		this.transition(skillId, 'failed');
	}

	/**
	 * Transition a skill directly to `skipped` (bypassing `running`).
	 * Called when a step's dependency has failed or been skipped.
	 *
	 * @param skillId - The skill ID that is being skipped.
	 */
	skip(skillId: string): void {
		this.transition(skillId, 'skipped');
	}

	/**
	 * Check whether a skill is still in the `pending` bucket.
	 *
	 * @param skillId - The skill ID to check.
	 * @returns `true` if the skill has not yet started execution.
	 */
	isPending(skillId: string): boolean {
		return this.pending.has(skillId);
	}

	/**
	 * Return a plain-object snapshot of the current state across all buckets.
	 * Arrays for `pending` and `running` are sorted for determinism; `completed`,
	 * `failed`, and `skipped` preserve insertion order (execution sequence).
	 *
	 * @returns A {@link RuntimeStateSnapshot} reflecting the current lifecycle distribution.
	 */
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
