/**
 * Envelope and status-code mapping for the HTTP boundary.
 *
 * Every response — success or failure, service-originated or adapter-originated —
 * is a `ServiceEnvelope<T>` with `meta.apiVersion = 'v1'` and the request ID from
 * the HTTP boundary. Service results are passed through unchanged apart from the
 * request ID.
 */

import type {
	ServiceEnvelope,
	ServiceErrorCode,
	ServiceFailureContract,
} from 'hr-skills-build/server';
import { SERVICE_API_VERSION } from 'hr-skills-build/server';
import { REQUEST_ID_HEADER } from './request-id.ts';

/**
 * HTTP status for each stable `ServiceErrorCode`.
 *
 * Declared as an exhaustive `Record` so adding a code to the service contract
 * fails type-checking here until it is given a status.
 */
export const ERROR_STATUS: Readonly<Record<ServiceErrorCode, number>> = {
	BAD_REQUEST: 400,
	NOT_FOUND: 404,
	VALIDATION_ERROR: 422,
	PLANNING_FAILED: 422,
	RUNTIME_FAILED: 500,
	SERVICE_UNAVAILABLE: 503,
	INTERNAL_ERROR: 500,
};

export interface ResponseOptions {
	/** Overrides the status derived from the error code (adapter-level cases only). */
	readonly status?: number;
	readonly headers?: Record<string, string>;
}

/**
 * Serialises a service envelope, attaching the request ID to `meta`.
 *
 * Only `meta.requestId` is added; `data`, `error`, and `meta.apiVersion` are
 * preserved exactly as the service produced them.
 */
export function toHttpResponse<T>(
	envelope: ServiceEnvelope<T>,
	requestId: string,
	options: ResponseOptions = {},
): Response {
	const body: ServiceEnvelope<T> = {
		...envelope,
		meta: { ...envelope.meta, requestId },
	};
	const status =
		options.status ?? (envelope.success ? 200 : ERROR_STATUS[envelope.error.code]);

	return Response.json(body, {
		status,
		headers: { ...options.headers, [REQUEST_ID_HEADER]: requestId },
	});
}

/**
 * Builds an adapter-level failure envelope (malformed body, unknown route,
 * unexpected exception). Uses only existing `ServiceErrorCode` values so the
 * v1 error vocabulary is unchanged.
 */
export function adapterFailure(
	code: ServiceErrorCode,
	message: string,
	details?: Record<string, unknown>,
): ServiceFailureContract {
	return {
		success: false,
		error: { code, message, ...(details ? { details } : {}) },
		meta: { apiVersion: SERVICE_API_VERSION },
	};
}
