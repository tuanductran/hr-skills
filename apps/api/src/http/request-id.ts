/**
 * Request ID handling for the HTTP boundary.
 *
 * Request IDs are tracing metadata only (see `docs/engineering/platform-integration.md`):
 * they are attached to response `meta` and never influence service results.
 */

export const REQUEST_ID_HEADER = 'x-request-id';

/** Conservative allow-list so an inbound header can never inject log or header content. */
const VALID_REQUEST_ID = /^[A-Za-z0-9._:-]{1,128}$/;

/**
 * IDs already resolved, keyed by the request object. A generated ID is random, so
 * without this a second call for the same request (for example from the error
 * handler after the route handler) would yield a different ID and break the link
 * between the response and its log events.
 */
const resolved = new WeakMap<Request, string>();

/**
 * Resolves the request ID for a request.
 *
 * A well-formed inbound `X-Request-Id` is propagated so callers can correlate
 * traces. A missing or malformed value is replaced with a generated ID rather
 * than echoed back. The result is stable for the lifetime of the request object,
 * so the response header, `meta.requestId`, and log events always agree.
 */
export function resolveRequestId(request: Request): string {
	const existing = resolved.get(request);

	if (existing !== undefined) return existing;

	const inbound = request.headers.get(REQUEST_ID_HEADER);
	const requestId =
		inbound !== null && VALID_REQUEST_ID.test(inbound)
			? inbound
			: `req_${crypto.randomUUID()}`;

	resolved.set(request, requestId);

	return requestId;
}
