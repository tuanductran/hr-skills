/**
 * `/api/v1/*` route handlers.
 *
 * Each handler is a thin adapter over an existing service in
 * `hr-skills-build/server`: it resolves the request ID, enforces the contract's
 * authentication requirement, reads the JSON body, hands the raw input to the
 * service (which owns schema validation and error codes), and serialises the
 * result as a `ServiceEnvelope<T>`. No ranking, planning, retries, or other
 * business logic lives here.
 *
 * Rate limiting runs after authentication and before the body is read; see
 * `http/rate-limit.ts`. Every request ends in exactly one `http.request.completed`
 * log event and counter update; see `http/observability.ts`.
 */

import type {
	EvaluationDataset,
	ExecutionPlan,
	GoldenFixture,
	ReadinessDependency,
	ServiceEnvelope,
	ServiceErrorCode,
	ServiceOperation,
} from 'hr-skills-build/server';
import {
	executeWorkflowService,
	generatePlanService,
	getHealthService,
	getReadinessService,
	getServiceContract,
	getVersionService,
	runEvaluationService,
	searchRegistryService,
} from 'hr-skills-build/server';
import type { ApiKeyAuthenticator } from '../http/auth.ts';
import { apiKeyFingerprint } from '../http/auth.ts';
import type { ApiObservability, RequestOutcome } from '../http/observability.ts';
import { errorName, recordRequest } from '../http/observability.ts';
import type {
	ClientAddressResolver,
	RateLimitDecision,
	RateLimiter,
	ServerLike,
} from '../http/rate-limit.ts';
import { resolveRequestId } from '../http/request-id.ts';
import { adapterFailure, toHttpResponse } from '../http/response.ts';
import type { RegistryProvider } from '../registry.ts';

export interface RouteDependencies {
	readonly getRegistry: RegistryProvider;
	readonly readinessDependencies: readonly ReadinessDependency[];
	readonly authenticateApiKey: ApiKeyAuthenticator | undefined;
	readonly rateLimiter: RateLimiter;
	readonly resolveClientAddress: ClientAddressResolver;
	readonly observability: ApiObservability;
}

/** Adds fixed-vocabulary fields to the request's completion log event. Never pass request data. */
type Annotate = (details: Readonly<Record<string, unknown>>) => void;

interface RouteContext {
	readonly request: Request;
	readonly server?: ServerLike | null;
}

type RouteHandler = (context: RouteContext) => Promise<Response>;

type BodyResult = { readonly ok: true; readonly value: unknown } | { readonly ok: false };

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Reads the body as JSON. An empty body is `undefined`; malformed JSON is a failure. */
async function readJsonBody(request: Request): Promise<BodyResult> {
	const text = await request.text();

	if (text.trim() === '') {
		return { ok: true, value: undefined };
	}

	try {
		return { ok: true, value: JSON.parse(text) };
	} catch {
		return { ok: false };
	}
}

/** Returns a refusal response when the operation requires an API key and it is not satisfied. */
async function checkAuthentication(
	operation: ServiceOperation,
	request: Request,
	requestId: string,
	authenticate: ApiKeyAuthenticator | undefined,
): Promise<Response | undefined> {
	if (getServiceContract(operation).authentication !== 'api-key') {
		return undefined;
	}

	// Fail closed: without a configured authenticator these operations are never open.
	if (authenticate === undefined) {
		return toHttpResponse(
			adapterFailure(
				'SERVICE_UNAVAILABLE',
				'API key authentication is not configured',
			),
			requestId,
		);
	}

	// Missing, malformed, and invalid keys share one response (same status, code,
	// message, and headers). The key is never echoed or logged.
	if (!(await authenticate(request))) {
		return toHttpResponse(
			adapterFailure('BAD_REQUEST', 'Missing or invalid API key'),
			requestId,
			{ status: 401, headers: { 'WWW-Authenticate': 'Bearer' } },
		);
	}

	return undefined;
}

/**
 * Identifies who a request counts against. API-key operations use a fingerprint of
 * the accepted key, so callers behind a shared address keep separate limits; other
 * operations use the client address. Raw keys never reach the counter key.
 */
function identifyCaller(
	operation: ServiceOperation,
	request: Request,
	server: ServerLike | null | undefined,
	resolveClientAddress: ClientAddressResolver,
): string {
	if (getServiceContract(operation).authentication === 'api-key') {
		const fingerprint = apiKeyFingerprint(request);

		if (fingerprint !== undefined) return `key:${fingerprint}`;
	}

	return `ip:${resolveClientAddress(request, server) ?? 'unknown'}`;
}

/** Returns a refusal response when the caller is over the operation's limit or limiting is unavailable. */
async function checkRateLimit(
	operation: ServiceOperation,
	request: Request,
	server: ServerLike | null | undefined,
	requestId: string,
	deps: RouteDependencies,
	annotate: Annotate,
): Promise<Response | undefined> {
	const caller = identifyCaller(operation, request, server, deps.resolveClientAddress);
	let decision: RateLimitDecision;

	try {
		decision = await deps.rateLimiter.check(operation, caller);
	} catch (error) {
		// Without this the 503 below would be unexplained: the store failure is
		// otherwise swallowed. Class name only; the caller key must not be logged.
		annotate({ reason: 'rate_limit_store_unavailable', errorName: errorName(error) });

		// Fail closed: an unreachable store must never mean "no limit".
		return toHttpResponse(
			adapterFailure('SERVICE_UNAVAILABLE', 'Rate limiting is unavailable'),
			requestId,
		);
	}

	if (decision.allowed) return undefined;

	return toHttpResponse(
		adapterFailure('BAD_REQUEST', 'Rate limit exceeded', {
			limit: decision.limit,
			windowSeconds: decision.windowSeconds,
		}),
		requestId,
		{ status: 429, headers: { 'Retry-After': String(decision.retryAfterSeconds) } },
	);
}

/** Names of the readiness checks that reported `not_ready`, from the failure's `details.checks`. */
function failedCheckNames(details: unknown): string[] {
	const checks = isRecord(details) ? details['checks'] : undefined;

	if (!Array.isArray(checks)) return [];

	return checks.flatMap((check: unknown) =>
		isRecord(check) &&
		check['status'] === 'not_ready' &&
		typeof check['name'] === 'string'
			? [check['name']]
			: [],
	);
}

export function createV1Handlers(deps: RouteDependencies) {
	/**
	 * Shared request pipeline. `run` receives the parsed body and the loaded
	 * registry (when `needsRegistry`), and returns the service envelope.
	 *
	 * Whatever path the request takes (refusal, service result, or unexpected
	 * exception) it is recorded once, after the response is built, under the same
	 * request ID the response carries.
	 */
	async function handle<T>(
		operation: ServiceOperation,
		request: Request,
		server: ServerLike | null | undefined,
		options: {
			readonly body: boolean;
			readonly needsRegistry: boolean;
		},
		run: (input: {
			readonly body: unknown;
			readonly registry: Awaited<ReturnType<RegistryProvider>> | undefined;
			readonly annotate: Annotate;
		}) => Promise<ServiceEnvelope<T>> | ServiceEnvelope<T>,
	): Promise<Response> {
		const startedAt = performance.now();
		const requestId = resolveRequestId(request);
		const details: Record<string, unknown> = {};
		const annotate: Annotate = (extra) => {
			Object.assign(details, extra);
		};
		let errorCode: ServiceErrorCode | undefined;
		let outcome: RequestOutcome | undefined;

		async function dispatch(): Promise<Response> {
			const refusal = await checkAuthentication(
				operation,
				request,
				requestId,
				deps.authenticateApiKey,
			);
			if (refusal) return refusal;

			const limited = await checkRateLimit(
				operation,
				request,
				server,
				requestId,
				deps,
				annotate,
			);
			if (limited) return limited;

			let body: unknown;
			if (options.body) {
				const parsed = await readJsonBody(request);
				if (!parsed.ok) {
					return toHttpResponse(
						adapterFailure('BAD_REQUEST', 'Request body must be valid JSON'),
						requestId,
					);
				}
				body = parsed.value;
			}

			let registry: Awaited<ReturnType<RegistryProvider>> | undefined;
			if (options.needsRegistry) {
				try {
					registry = await deps.getRegistry();
				} catch (error) {
					// Class name only: load errors can quote file contents or paths.
					annotate({
						reason: 'registry_unavailable',
						errorName: errorName(error),
					});

					return toHttpResponse(
						adapterFailure(
							'SERVICE_UNAVAILABLE',
							'Skill registry is unavailable',
						),
						requestId,
					);
				}
			}

			const envelope = await run({ body, registry, annotate });

			if (!envelope.success) {
				errorCode = envelope.error.code;
				// The readiness service only fails when a dependency is not ready.
				if (operation === 'readiness') outcome = 'readiness_failure';
			}

			return toHttpResponse(envelope, requestId);
		}

		let response: Response;

		try {
			response = await dispatch();
		} catch (error) {
			// Never leak stack traces or filesystem paths from unexpected failures.
			// The log gets the class name only; see `errorName`.
			annotate({ errorName: errorName(error) });
			errorCode = 'INTERNAL_ERROR';
			outcome = undefined;
			response = toHttpResponse(
				adapterFailure('INTERNAL_ERROR', 'Unexpected internal error'),
				requestId,
			);
		}

		recordRequest(deps.observability, {
			operation,
			requestId,
			status: response.status,
			errorCode,
			outcome,
			durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
			details,
		});

		return response;
	}

	const health: RouteHandler = ({ request, server }) =>
		handle('health', request, server, { body: false, needsRegistry: false }, () =>
			getHealthService(),
		);

	const ready: RouteHandler = ({ request, server }) =>
		handle(
			'readiness',
			request,
			server,
			{ body: false, needsRegistry: false },
			async ({ annotate }) => {
				const result = await getReadinessService(deps.readinessDependencies);

				// Names only: dependency messages can carry exception text.
				if (!result.success) {
					annotate({ failedChecks: failedCheckNames(result.error.details) });
				}

				return result;
			},
		);

	const version: RouteHandler = ({ request, server }) =>
		handle('version', request, server, { body: false, needsRegistry: false }, () =>
			getVersionService(),
		);

	const search: RouteHandler = ({ request, server }) =>
		handle(
			'search',
			request,
			server,
			{ body: true, needsRegistry: true },
			({ body, registry }) =>
				// `registry` is always defined when `needsRegistry` is true.
				searchRegistryService(body, registry as NonNullable<typeof registry>),
		);

	const planner: RouteHandler = ({ request, server }) =>
		handle(
			'planner',
			request,
			server,
			{ body: true, needsRegistry: true },
			({ body, registry }) =>
				generatePlanService(body, registry as NonNullable<typeof registry>),
		);

	// Request body: `{ plan: ExecutionPlan }`. The service owns the plan guard; the
	// cast only bridges untrusted JSON to the service signature.
	const runtime: RouteHandler = ({ request, server }) =>
		handle(
			'runtime',
			request,
			server,
			{ body: true, needsRegistry: false },
			({ body }) =>
				executeWorkflowService(
					(isRecord(body) ? body['plan'] : undefined) as ExecutionPlan,
				),
		);

	// Request body: `{ dataset: EvaluationDataset, golden?: GoldenFixture }`. The
	// service owns the dataset guard; the casts only bridge untrusted JSON.
	const evaluation: RouteHandler = ({ request, server }) =>
		handle(
			'evaluation',
			request,
			server,
			{ body: true, needsRegistry: true },
			({ body, registry }) => {
				const input = isRecord(body) ? body : {};
				return runEvaluationService(
					input['dataset'] as EvaluationDataset,
					registry as NonNullable<typeof registry>,
					input['golden'] as GoldenFixture | undefined,
				);
			},
		);

	return { health, ready, version, search, planner, runtime, evaluation } as const;
}
