/**
 * Environment-driven rate limit configuration.
 *
 * - `HR_SKILLS_RATE_LIMIT_STORE`: which store backs the counters. `memory` is the
 *   only built-in value; it keeps counters per process, so it is correct for local
 *   development and single-instance deployments only. Shared or external stores are
 *   injected through `createApp({ rateLimiter })` by the deployment.
 * - `HR_SKILLS_CLIENT_IP_HEADER`: optional header set by a trusted reverse proxy,
 *   used to identify callers of unauthenticated operations.
 *
 * Rate limiting is never silently disabled. Outside production an unset store
 * defaults to `memory`; in production (`NODE_ENV=production`) the store must be
 * chosen explicitly, and a missing or unsupported value throws
 * `RateLimitConfigError` so the process refuses to start.
 */

import type { ClientAddressResolver, RateLimiter } from './rate-limit.ts';
import {
	createClientAddressResolver,
	createInMemoryRateLimitStore,
	createRateLimiter,
} from './rate-limit.ts';

export const RATE_LIMIT_STORE_ENV = 'HR_SKILLS_RATE_LIMIT_STORE';
const CLIENT_IP_HEADER_ENV = 'HR_SKILLS_CLIENT_IP_HEADER';

export type Environment = Readonly<Record<string, string | undefined>>;

export class RateLimitConfigError extends Error {
	override name = 'RateLimitConfigError';
}

export function isProduction(env: Environment): boolean {
	return env['NODE_ENV'] === 'production';
}

/** Builds the rate limiter selected by the environment, or throws `RateLimitConfigError`. */
export function createRateLimiterFromEnv(env: Environment): RateLimiter {
	const selected = env[RATE_LIMIT_STORE_ENV]?.trim().toLowerCase() ?? '';

	if (selected === '' && isProduction(env)) {
		throw new RateLimitConfigError(
			`${RATE_LIMIT_STORE_ENV} is required when NODE_ENV=production. ` +
				'Set it to "memory" for a single instance, or inject a shared RateLimitStore with createApp({ rateLimiter }).',
		);
	}

	if (selected === '' || selected === 'memory') {
		return createRateLimiter({ store: createInMemoryRateLimitStore() });
	}

	throw new RateLimitConfigError(
		`Unsupported ${RATE_LIMIT_STORE_ENV} value "${selected}". ` +
			'The only built-in store is "memory"; inject any other store with createApp({ rateLimiter }).',
	);
}

/** Builds the caller-address resolver selected by the environment. */
export function createClientAddressResolverFromEnv(
	env: Environment,
): ClientAddressResolver {
	const header = env[CLIENT_IP_HEADER_ENV]?.trim();

	if (header === undefined || header === '') {
		return createClientAddressResolver();
	}

	if (!/^[A-Za-z0-9-]+$/.test(header)) {
		throw new RateLimitConfigError(
			`${CLIENT_IP_HEADER_ENV} must be a valid HTTP header name`,
		);
	}

	return createClientAddressResolver({ trustedHeader: header });
}
