/**
 * Structured runtime errors — Phase 4.3.
 *
 * A `RuntimeError` wraps whatever a step executor threw with the context
 * needed to produce a useful diagnostic: which skill failed, which attempt
 * it was, and a machine-readable code for programmatic handling.
 */

import type { RuntimeErrorInfo } from './types.js';

export type RuntimeErrorCode =
	| 'STEP_EXECUTION_FAILED'
	| 'STEP_DEPENDENCY_FAILED'
	| 'STEP_DEPENDENCY_SKIPPED';

export class RuntimeError extends Error {
	readonly code: RuntimeErrorCode;
	readonly skillId: string;
	readonly attempt: number;
	override readonly cause?: unknown;

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

	/** Convert to a plain, JSON-serializable shape for traces and results. */
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
 * human-readable message, without assuming it's an `Error` instance.
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
