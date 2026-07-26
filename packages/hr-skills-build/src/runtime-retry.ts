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

/**
 * Create a retry policy that never retries — the step fails immediately
 * on the first error.
 *
 * This is the default policy used by `WorkflowExecutor` when no
 * `retryPolicy` option is provided.
 *
 * @returns A {@link RetryPolicy} with `maxRetries: 0`.
 */
export function noRetryPolicy(): RetryPolicy {
	return {
		maxRetries: 0,
		delayForAttempt: () => 0,
	};
}

/**
 * Create a retry policy that retries a fixed number of times with a
 * constant logical delay between each attempt.
 *
 * @param options.maxRetries - Maximum number of retry attempts after the initial try.
 * @param options.delayMs - Logical delay in milliseconds recorded per retry attempt.
 *   Defaults to `0` (no delay recorded). The runtime does not actually sleep.
 * @returns A {@link RetryPolicy} with a fixed delay for all attempts.
 */
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

/**
 * Create a retry policy that uses exponential backoff:
 * `delay = baseDelayMs * 2^(attempt - 1)`, capped at `maxDelayMs`.
 *
 * Example with `baseDelayMs: 100`: attempt 1 → 100 ms, attempt 2 → 200 ms,
 * attempt 3 → 400 ms, and so on.
 *
 * @param options.maxRetries - Maximum number of retry attempts after the initial try.
 * @param options.baseDelayMs - Base delay in milliseconds. Defaults to `100`.
 * @param options.maxDelayMs - Upper bound on any single delay. Defaults to `Infinity`.
 * @returns A {@link RetryPolicy} with exponential backoff delays.
 */
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
