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
 * Resolves the request ID for a request.
 *
 * A well-formed inbound `X-Request-Id` is propagated so callers can correlate
 * traces. A missing or malformed value is replaced with a generated ID rather
 * than echoed back.
 */
export function resolveRequestId(request: Request): string {
	const inbound = request.headers.get(REQUEST_ID_HEADER);

	if (inbound !== null && VALID_REQUEST_ID.test(inbound)) {
		return inbound;
	}

	return `req_${crypto.randomUUID()}`;
}
