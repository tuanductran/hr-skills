/**
 * Per-operation, per-caller rate limiting (fixed window) for the HTTP adapter.
 *
 * Limits are never hard-coded here: each operation's `maxRequests` and
 * `windowSeconds` come from `SERVICE_CONTRACTS`, the single source of truth.
 * Counters are keyed by operation AND caller, so there is no global counter and
 * exhausting one operation or one caller never affects another.
 *
 * Storage sits behind `RateLimitStore`. This module ships only an in-memory store
 * (local development, tests, single-instance deployments). Shared or external
 * stores are deployment concerns: implement `RateLimitStore` in the deployment and
 * inject it with `createApp({ rateLimiter })`. No provider-specific logic belongs in
 * `hr-skills-build`.
 *
 * A store that cannot be reached must throw. The route layer then fails closed with
 * `503 SERVICE_UNAVAILABLE` instead of silently skipping the limit.
 */

import type { ServiceOperation } from 'hr-skills-build/server';
import { getServiceContract } from 'hr-skills-build/server';

interface RateLimitHit {
	/** Requests counted in the active window, including this one. */
	readonly count: number;
	/** Epoch milliseconds at which the active window ends. */
	readonly resetAtMs: number;
}

/**
 * Atomic fixed-window counter.
 *
 * `hit` counts one request for `key`. When `key` has no active window at `nowMs`
 * (none yet, or the previous one ended), it starts a new window of `windowMs` and
 * returns `count: 1`. Otherwise it increments the active window and returns its
 * original `resetAtMs`. Implementations must be atomic across concurrent calls and
 * must throw when the backing store is unavailable.
 */
export interface RateLimitStore {
	hit(
		key: string,
		windowMs: number,
		nowMs: number,
	): RateLimitHit | Promise<RateLimitHit>;
}

class RateLimitStoreUnavailableError extends Error {
	override name = 'RateLimitStoreUnavailableError';
}

export interface InMemoryRateLimitStoreOptions {
	/** Upper bound on live counters; beyond it the store fails closed. Default 100,000. */
	readonly maxEntries?: number;
}

const DEFAULT_MAX_ENTRIES = 100_000;
/** Expired counters are swept at most once per interval, so a flood cannot force an O(n) scan per request. */
const SWEEP_INTERVAL_MS = 1_000;

interface Window {
	count: number;
	readonly resetAtMs: number;
}

/**
 * Deterministic in-memory store: it never reads the clock (the caller passes
 * `nowMs`), so tests control time exactly. Counters are per process, so they are
 * not shared between instances.
 */
export function createInMemoryRateLimitStore(
	options: InMemoryRateLimitStoreOptions = {},
): RateLimitStore {
	const maxEntries = options.maxEntries ?? DEFAULT_MAX_ENTRIES;
	const windows = new Map<string, Window>();
	let lastSweepAtMs = Number.NEGATIVE_INFINITY;

	function sweepIfDue(nowMs: number): void {
		if (nowMs - lastSweepAtMs < SWEEP_INTERVAL_MS) return;

		lastSweepAtMs = nowMs;
		for (const [key, window] of windows) {
			if (window.resetAtMs <= nowMs) windows.delete(key);
		}
	}

	return {
		hit(key, windowMs, nowMs) {
			const active = windows.get(key);

			if (active !== undefined && active.resetAtMs > nowMs) {
				active.count += 1;
				return { count: active.count, resetAtMs: active.resetAtMs };
			}

			// A new window for an existing (expired) key replaces it in place; only a
			// brand-new key can grow the map.
			if (active === undefined && windows.size >= maxEntries) {
				sweepIfDue(nowMs);

				if (windows.size >= maxEntries) {
					throw new RateLimitStoreUnavailableError('Rate limit store is full');
				}
			}

			const resetAtMs = nowMs + windowMs;
			windows.set(key, { count: 1, resetAtMs });
			sweepIfDue(nowMs);

			return { count: 1, resetAtMs };
		},
	};
}

export interface RateLimitDecision {
	readonly allowed: boolean;
	readonly limit: number;
	readonly windowSeconds: number;
	readonly remaining: number;
	/** Whole seconds until the window resets (at least 1). */
	readonly retryAfterSeconds: number;
}

export interface RateLimiter {
	/** Counts one request from `caller` against `operation` and reports the decision. */
	check(operation: ServiceOperation, caller: string): Promise<RateLimitDecision>;
}

export interface RateLimiterOptions {
	readonly store: RateLimitStore;
	/** Clock in epoch milliseconds. Defaults to `Date.now`; tests inject a fake. */
	readonly now?: () => number;
}

export function createRateLimiter(options: RateLimiterOptions): RateLimiter {
	const now = options.now ?? Date.now;

	return {
		async check(operation, caller) {
			const { maxRequests, windowSeconds } =
				getServiceContract(operation).rateLimit;
			const nowMs = now();
			const hit = await options.store.hit(
				`rl:v1:${operation}:${caller}`,
				windowSeconds * 1000,
				nowMs,
			);

			return {
				allowed: hit.count <= maxRequests,
				limit: maxRequests,
				windowSeconds,
				remaining: Math.max(0, maxRequests - hit.count),
				retryAfterSeconds: Math.max(1, Math.ceil((hit.resetAtMs - nowMs) / 1000)),
			};
		},
	};
}

/** The slice of Bun's `Server` needed to read the peer address. */
export interface ServerLike {
	requestIP(request: Request): { readonly address: string } | null;
}

/** Returns a stable caller address for a request, or `undefined` when it cannot be determined. */
export type ClientAddressResolver = (
	request: Request,
	server: ServerLike | null | undefined,
) => string | undefined;

/** Conservative allow-list so a header or socket value can never inject odd characters into a counter key. */
const ADDRESS_PATTERN = /^[A-Za-z0-9.:%_-]{2,64}$/;

export interface ClientAddressResolverOptions {
	/**
	 * Header set by a TRUSTED reverse proxy (for example `x-forwarded-for`). Only
	 * configure this when every request passes through a proxy that sets or appends
	 * the header; otherwise clients can spoof it to dodge their limit. The last entry
	 * is used, which is the one appended by a single trusted proxy.
	 */
	readonly trustedHeader?: string;
}

/**
 * Default resolver: the socket peer address, or the last entry of the configured
 * trusted proxy header when present and well-formed. Falls back to the socket
 * address when the header is absent or malformed.
 */
export function createClientAddressResolver(
	options: ClientAddressResolverOptions = {},
): ClientAddressResolver {
	const header = options.trustedHeader?.toLowerCase();

	return (request, server) => {
		if (header !== undefined) {
			const forwarded = request.headers.get(header)?.split(',').at(-1)?.trim();

			if (forwarded !== undefined && ADDRESS_PATTERN.test(forwarded)) {
				return forwarded.toLowerCase();
			}
		}

		const address = server?.requestIP(request)?.address;

		return address !== undefined && ADDRESS_PATTERN.test(address)
			? address.toLowerCase()
			: undefined;
	};
}
