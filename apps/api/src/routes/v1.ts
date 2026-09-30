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
 * Rate limiting is intentionally not implemented yet.
 */

import type {
	EvaluationDataset,
	ExecutionPlan,
	GoldenFixture,
	ReadinessDependency,
	ServiceEnvelope,
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
import { resolveRequestId } from '../http/request-id.ts';
import { adapterFailure, toHttpResponse } from '../http/response.ts';
import type { RegistryProvider } from '../registry.ts';

export interface RouteDependencies {
	readonly getRegistry: RegistryProvider;
	readonly readinessDependencies: readonly ReadinessDependency[];
	readonly authenticateApiKey: ApiKeyAuthenticator | undefined;
}

interface RouteContext {
	readonly request: Request;
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

export function createV1Handlers(deps: RouteDependencies) {
	/**
	 * Shared request pipeline. `run` receives the parsed body and the loaded
	 * registry (when `needsRegistry`), and returns the service envelope.
	 */
	async function handle<T>(
		operation: ServiceOperation,
		request: Request,
		options: {
			readonly body: boolean;
			readonly needsRegistry: boolean;
		},
		run: (input: {
			readonly body: unknown;
			readonly registry: Awaited<ReturnType<RegistryProvider>> | undefined;
		}) => Promise<ServiceEnvelope<T>> | ServiceEnvelope<T>,
	): Promise<Response> {
		const requestId = resolveRequestId(request);

		try {
			const refusal = await checkAuthentication(
				operation,
				request,
				requestId,
				deps.authenticateApiKey,
			);
			if (refusal) return refusal;

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
				} catch {
					return toHttpResponse(
						adapterFailure(
							'SERVICE_UNAVAILABLE',
							'Skill registry is unavailable',
						),
						requestId,
					);
				}
			}

			return toHttpResponse(await run({ body, registry }), requestId);
		} catch {
			// Never leak stack traces or filesystem paths from unexpected failures.
			return toHttpResponse(
				adapterFailure('INTERNAL_ERROR', 'Unexpected internal error'),
				requestId,
			);
		}
	}

	const health: RouteHandler = ({ request }) =>
		handle('health', request, { body: false, needsRegistry: false }, () =>
			getHealthService(),
		);

	const ready: RouteHandler = ({ request }) =>
		handle('readiness', request, { body: false, needsRegistry: false }, () =>
			getReadinessService(deps.readinessDependencies),
		);

	const version: RouteHandler = ({ request }) =>
		handle('version', request, { body: false, needsRegistry: false }, () =>
			getVersionService(),
		);

	const search: RouteHandler = ({ request }) =>
		handle(
			'search',
			request,
			{ body: true, needsRegistry: true },
			({ body, registry }) =>
				// `registry` is always defined when `needsRegistry` is true.
				searchRegistryService(body, registry as NonNullable<typeof registry>),
		);

	const planner: RouteHandler = ({ request }) =>
		handle(
			'planner',
			request,
			{ body: true, needsRegistry: true },
			({ body, registry }) =>
				generatePlanService(body, registry as NonNullable<typeof registry>),
		);

	// Request body: `{ plan: ExecutionPlan }`. The service owns the plan guard; the
	// cast only bridges untrusted JSON to the service signature.
	const runtime: RouteHandler = ({ request }) =>
		handle('runtime', request, { body: true, needsRegistry: false }, ({ body }) =>
			executeWorkflowService(
				(isRecord(body) ? body['plan'] : undefined) as ExecutionPlan,
			),
		);

	// Request body: `{ dataset: EvaluationDataset, golden?: GoldenFixture }`. The
	// service owns the dataset guard; the casts only bridge untrusted JSON.
	const evaluation: RouteHandler = ({ request }) =>
		handle(
			'evaluation',
			request,
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
