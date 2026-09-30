/**
 * API-key authentication PLACEHOLDER.
 *
 * `SERVICE_CONTRACTS` marks `runtime` and `evaluation` as `authentication: 'api-key'`,
 * but the approved authentication strategy is not implemented yet (Phase 8.4
 * follow-up). This module only defines the seam so routes are wired correctly:
 *
 * - No authenticator configured  -> the request is refused (fail closed) with
 *   `SERVICE_UNAVAILABLE`, so these operations are never silently open.
 * - An authenticator is injected -> it decides; `false` yields a 401 response.
 *
 * Nothing here reads, stores, or validates keys. Do not add provider-specific
 * authentication logic here; it belongs to the approved strategy, at this boundary.
 */

export type ApiKeyAuthenticator = (request: Request) => boolean | Promise<boolean>;
