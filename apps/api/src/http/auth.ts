/**
 * API-key authentication for `runtime` and `evaluation`.
 *
 * `SERVICE_CONTRACTS` marks these two operations as `authentication: 'api-key'`.
 * Keys are supplied only through the `Authorization: Bearer <key>` header, never
 * through the query string or request body, so they do not end up in access logs,
 * browser history, or referrers (see `docs/engineering/platform-integration.md`).
 *
 * Behaviour, enforced at the route boundary (`routes/v1.ts`):
 *
 * - No authenticator configured     -> `503 SERVICE_UNAVAILABLE` (fail closed).
 * - Header missing, malformed, or key unknown -> one identical `401` response, so
 *   callers cannot tell which of the three happened.
 * - Key matches                     -> the request proceeds.
 *
 * This module never logs, echoes, or includes a key in an error. Keys are compared
 * in constant time, and every configured key is checked on every request so the
 * response time does not reveal which (or how many) keys exist.
 */

import { createHash, timingSafeEqual } from 'node:crypto';

export type ApiKeyAuthenticator = (request: Request) => boolean | Promise<boolean>;

/**
 * `Bearer <token>` with exactly one space and a token of visible ASCII only.
 * The scheme is case-insensitive (RFC 9110 §11.1). Anything else, including
 * extra whitespace, extra parameters, or other schemes, is rejected.
 */
const BEARER_PATTERN = /^Bearer ([\x21-\x7E]+)$/i;

/** Extracts the bearer token from the `Authorization` header, or `undefined`. */
function extractBearerToken(request: Request): string | undefined {
	const header = request.headers.get('authorization');

	if (header === null) return undefined;

	return BEARER_PATTERN.exec(header)?.[1];
}

/**
 * Hashing to a fixed length lets `timingSafeEqual` compare values of any input
 * length (it throws on unequal lengths) without leaking the key length.
 */
function digest(value: string): Buffer {
	return createHash('sha256').update(value).digest();
}

/**
 * Stable, non-reversible identifier for the key a request presented, used to give
 * each API key its own rate-limit counters. It is derived from the key but is never
 * the key itself, so counter stores and logs never hold key material. Call it only
 * after the key has been accepted.
 */
export function apiKeyFingerprint(request: Request): string | undefined {
	const token = extractBearerToken(request);

	return token === undefined ? undefined : digest(token).toString('hex').slice(0, 32);
}

/**
 * Parses a comma-separated list of API keys (for example from a deployment
 * secret). Whitespace around each key is trimmed and empty entries are dropped.
 */
export function parseApiKeys(raw: string | undefined): string[] {
	if (raw === undefined) return [];

	return raw
		.split(',')
		.map((key) => key.trim())
		.filter((key) => key.length > 0);
}

/**
 * Builds an authenticator that accepts any one of `keys` (several keys allow
 * rotation without downtime). Throws when no usable key is provided, so a
 * misconfiguration can never produce an authenticator that accepts everything.
 */
export function createApiKeyAuthenticator(keys: readonly string[]): ApiKeyAuthenticator {
	const accepted = keys.filter((key) => key.length > 0).map(digest);

	if (accepted.length === 0) {
		throw new Error('At least one non-empty API key is required');
	}

	return (request) => {
		const token = extractBearerToken(request);
		const candidate = digest(token ?? '');

		// No early exit: compare against every key regardless of earlier matches.
		let matched = false;
		for (const expected of accepted) {
			if (timingSafeEqual(candidate, expected)) matched = true;
		}

		return token !== undefined && matched;
	};
}
