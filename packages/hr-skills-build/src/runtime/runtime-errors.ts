/**
 * Structured runtime errors — Phase 4.3.
 *
 * A `RuntimeError` wraps whatever a step executor threw with the context
 * needed to produce a useful diagnostic: which skill failed, which attempt
 * it was, and a machine-readable code for programmatic handling.
 */

import type { RuntimeErrorInfo } from '../shared/types.js';

/**
 * Machine-readable codes for runtime failures.
 *
 * - `STEP_EXECUTION_FAILED` — the step executor threw after exhausting retries.
 * - `STEP_DEPENDENCY_FAILED` — a required upstream step failed.
 * - `STEP_DEPENDENCY_SKIPPED` — a required upstream step was skipped.
 */
export type RuntimeErrorCode =
	| 'STEP_EXECUTION_FAILED'
	| 'STEP_DEPENDENCY_FAILED'
	| 'STEP_DEPENDENCY_SKIPPED';

/**
 * Structured error produced by the Workflow Runtime when a step fails.
 *
 * Extends the native `Error` class with `code`, `skillId`, and `attempt`
 * fields so that error handlers can branch on failure type without string
 * parsing, and so that traces capture enough context to reconstruct what
 * went wrong without needing to re-run the workflow.
 */
export class RuntimeError extends Error {
	readonly code: RuntimeErrorCode;
	readonly skillId: string;
	readonly attempt: number;
	override readonly cause?: unknown;

	/**
	 * @param code - Machine-readable failure code.
	 * @param message - Human-readable description of the failure.
	 * @param options.skillId - The skill ID of the step that failed.
	 * @param options.attempt - The attempt number on which the failure occurred (1-indexed).
	 * @param options.cause - The original thrown value, if available.
	 */
	constructor(
		code: RuntimeErrorCode,
		message: string,
		options: { skillId: string; attempt: number; cause?: unknown },
	) {
		super(message);
		this.name = 'RuntimeError';
		this.code = code;
		this.skillId = options.skillId;
		this.attempt = options.attempt;
		this.cause = options.cause;
	}

	/**
	 * Convert to a plain, JSON-serializable shape for traces and results.
	 * The `cause` field is normalized via {@link describeCause} so that
	 * non-serializable thrown values (e.g. Error instances) survive
	 * `JSON.stringify` without losing the message.
	 *
	 * @returns A {@link RuntimeErrorInfo} object suitable for embedding in step results and traces.
	 */
	toInfo(): RuntimeErrorInfo {
		const info: RuntimeErrorInfo = {
			code: this.code,
			message: this.message,
			skillId: this.skillId,
			attempt: this.attempt,
		};
		if (this.cause !== undefined) {
			info.cause = describeCause(this.cause);
		}
		return info;
	}
}

/**
 * Normalize an unknown thrown value (from a step executor) into a
 * human-readable string, without assuming it is an `Error` instance.
 *
 * Resolution order:
 *  1. `Error` instance → `error.message`
 *  2. String primitive → returned as-is
 *  3. Any serializable value → `JSON.stringify`
 *  4. Anything else → `String(cause)`
 *
 * @param cause - The unknown value that was thrown.
 * @returns A human-readable string describing the cause.
 */
export function describeCause(cause: unknown): string {
	if (cause instanceof Error) return cause.message;
	if (typeof cause === 'string') return cause;
	try {
		return JSON.stringify(cause);
	} catch {
		return String(cause);
	}
}
