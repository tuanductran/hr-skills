/**
 * Retry policies — Phase 4.3.
 *
 * Policies decide how many times a failed step should be retried and what
 * logical delay to record for each attempt. The runtime never actually
 * waits for the returned delay — real waiting would make execution
 * non-deterministic and slow down tests — but the value is still useful for
 * a caller that wants to honor it (for example, a step executor calling a
 * real API might read `context` or a wrapping scheduler might sleep).
 */

import type { RetryPolicy } from './types.js';

/** No retries: fail immediately on the first error. */
export function noRetryPolicy(): RetryPolicy {
	return {
		maxRetries: 0,
		delayForAttempt: () => 0,
	};
}

/** Retry a fixed number of times with a constant logical delay. */
export function fixedRetryPolicy(options: {
	maxRetries: number;
	delayMs?: number;
}): RetryPolicy {
	const delayMs = options.delayMs ?? 0;
	return {
		maxRetries: options.maxRetries,
		delayForAttempt: () => delayMs,
	};
}

/** Retry with exponential backoff: delay = baseDelayMs * 2^(attempt - 1). */
export function exponentialRetryPolicy(options: {
	maxRetries: number;
	baseDelayMs?: number;
	maxDelayMs?: number;
}): RetryPolicy {
	const baseDelayMs = options.baseDelayMs ?? 100;
	const maxDelayMs = options.maxDelayMs ?? Number.POSITIVE_INFINITY;
	return {
		maxRetries: options.maxRetries,
		delayForAttempt: (attempt: number) =>
			Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs),
	};
}
