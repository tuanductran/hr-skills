/**
 * Operational wiring for the HTTP adapter (Phase 8.4).
 *
 * This module adds no observability framework. Logging and counters come from the
 * primitives that already live in `hr-skills-build/server`
 * (`createStructuredLogger`, `createServiceMetrics`); this file only decides what
 * the adapter records and keeps that safe:
 *
 * - One `http.request.completed` event per request, carrying the request ID that
 *   is also returned in `meta.requestId` and the `X-Request-Id` header.
 * - Events contain only fixed identifiers: the operation, request ID, duration,
 *   HTTP status, outcome, and stable error code. They never contain request or
 *   response bodies, headers, query strings, client addresses, API keys (or any
 *   value derived from one), exception messages, or stack traces. Unexpected
 *   exceptions are recorded by class name only, because their messages can echo
 *   input.
 * - A failing log sink or metrics backend can never fail a request.
 */

import type {
	ServiceErrorCode,
	ServiceLogLevel,
	ServiceLogSink,
	ServiceMetrics,
	ServiceOperation,
	StructuredServiceLogger,
} from 'hr-skills-build/server';
import {
	createServiceMetrics,
	createStructuredLogger,
	SERVICE_API_VERSION,
} from 'hr-skills-build/server';

export interface ApiObservability {
	readonly logger: StructuredServiceLogger;
	readonly metrics: ServiceMetrics;
}

export interface ObservabilityOptions {
	/** Receives every log event. Defaults to discarding events (see `createApp`). */
	readonly logSink?: ServiceLogSink | undefined;
	/** Counter store. Defaults to a fresh `createServiceMetrics()`. */
	readonly metrics?: ServiceMetrics | undefined;
}

const discardLogs: ServiceLogSink = () => undefined;

/** Builds the adapter's logger and metrics from the shared primitives. */
export function createObservability(
	options: ObservabilityOptions = {},
): ApiObservability {
	const sink = options.logSink ?? discardLogs;

	return {
		logger: createStructuredLogger((event) => {
			try {
				sink(event);
			} catch {
				// A broken log backend must never turn into a failed request.
			}
		}),
		metrics: options.metrics ?? createServiceMetrics(),
	};
}

type LogWriter = (level: ServiceLogLevel, line: string) => void;

const writeToConsole: LogWriter = (level, line) => {
	if (level === 'error') {
		console.error(line);
	} else if (level === 'warn') {
		console.warn(line);
	} else {
		console.log(line);
	}
};

/**
 * Sink that writes each event as one JSON line (stdout for `info`, stderr for
 * `warn` and `error` via the matching console method), ready for a log collector.
 */
export function createJsonLogSink(write: LogWriter = writeToConsole): ServiceLogSink {
	return (event) => write(event.level, JSON.stringify(event));
}

/** Operation label for requests that matched no `/api/v1` route (404, 405). */
export const UNROUTED_OPERATION = 'unrouted';

export type ObservedOperation = ServiceOperation | typeof UNROUTED_OPERATION;

export type RequestOutcome =
	| 'ok'
	| 'unauthorized'
	| 'rate_limited'
	| 'readiness_failure'
	| 'validation_failure'
	| 'service_failure'
	| 'not_matched';

/** Counter suffix per outcome. Successful and unmatched requests only count toward `requests`. */
const OUTCOME_COUNTERS: Readonly<Record<RequestOutcome, string | undefined>> = {
	ok: undefined,
	not_matched: undefined,
	unauthorized: 'unauthorized',
	rate_limited: 'rate_limited',
	readiness_failure: 'readiness_failures',
	validation_failure: 'validation_failures',
	service_failure: 'service_failures',
};

/**
 * Derives the outcome from the response status and the stable error code.
 *
 * `VALIDATION_ERROR` and `PLANNING_FAILED` share status 422, so the code decides
 * between a rejected input and a failed service.
 */
export function classifyOutcome(
	operation: ObservedOperation,
	status: number,
	errorCode: ServiceErrorCode | undefined,
): RequestOutcome {
	if (status < 400) return 'ok';
	if (status === 401) return 'unauthorized';
	if (status === 429) return 'rate_limited';
	if (operation === UNROUTED_OPERATION) {
		return status >= 500 ? 'service_failure' : 'not_matched';
	}
	if (status === 400 || errorCode === 'VALIDATION_ERROR') return 'validation_failure';

	return 'service_failure';
}

export interface RequestRecord {
	readonly operation: ObservedOperation;
	readonly requestId: string;
	readonly status: number;
	readonly errorCode?: ServiceErrorCode | undefined;
	/** Overrides the derived outcome when the caller knows better (readiness). */
	readonly outcome?: RequestOutcome | undefined;
	readonly durationMs?: number | undefined;
	/** Extra fixed-vocabulary fields. Callers must never put request data in here. */
	readonly details?: Readonly<Record<string, unknown>> | undefined;
}

/**
 * Counter name for an operation, for example `service.v1.search.requests`. The API
 * version and operation are encoded in the name because `ServiceMetrics` counters
 * have no labels.
 */
export function metricName(operation: ObservedOperation, counter: string): string {
	return `service.${SERVICE_API_VERSION}.${operation}.${counter}`;
}

function levelForStatus(status: number): ServiceLogLevel {
	if (status >= 500) return 'error';
	if (status >= 400) return 'warn';

	return 'info';
}

/** Records one completed request: bumps its counters and writes its log event. */
export function recordRequest(
	observability: ApiObservability,
	record: RequestRecord,
): void {
	const outcome =
		record.outcome ??
		classifyOutcome(record.operation, record.status, record.errorCode);

	try {
		observability.metrics.increment(metricName(record.operation, 'requests'));

		const counter = OUTCOME_COUNTERS[outcome];
		if (counter !== undefined) {
			observability.metrics.increment(metricName(record.operation, counter));
		}
	} catch {
		// A broken metrics backend must never turn into a failed request.
	}

	observability.logger.log(levelForStatus(record.status), 'http.request.completed', {
		operation: record.operation,
		requestId: record.requestId,
		...(record.durationMs === undefined ? {} : { durationMs: record.durationMs }),
		details: {
			status: record.status,
			outcome,
			...(record.errorCode === undefined ? {} : { errorCode: record.errorCode }),
			...record.details,
		},
	});
}

/**
 * Safe description of a thrown value for logs: the class name only. Messages and
 * stacks are deliberately excluded because they can contain request data, keys,
 * or filesystem paths.
 */
export function errorName(error: unknown): string {
	return error instanceof Error ? error.name : typeof error;
}

/** Writes the current cumulative counters as a single `service.metrics.snapshot` event. */
export function logMetricsSnapshot(observability: ApiObservability): void {
	observability.logger.info('service.metrics.snapshot', {
		details: { counters: observability.metrics.snapshot().counters },
	});
}

/** Longest accepted snapshot interval; larger timer delays overflow and fire immediately. */
const MAX_SNAPSHOT_INTERVAL_SECONDS = 86_400;

/**
 * Parses `HR_SKILLS_METRICS_LOG_INTERVAL_SECONDS`. Returns a whole number of
 * seconds between 1 and 86,400, or `undefined` when the value is unset, empty, or
 * not usable, in which case periodic snapshots stay off.
 */
export function parseSnapshotIntervalSeconds(
	raw: string | undefined,
): number | undefined {
	const trimmed = raw?.trim() ?? '';

	if (!/^\d+$/.test(trimmed)) return undefined;

	const seconds = Number(trimmed);

	return seconds >= 1 && seconds <= MAX_SNAPSHOT_INTERVAL_SECONDS ? seconds : undefined;
}
