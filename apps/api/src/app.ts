/**
 * Elysia application factory for the HR Skills hosted HTTP adapter (Phase 8.4).
 *
 * Builds and returns an Elysia instance without binding a port, so it can be
 * started by `src/index.ts` or exercised in tests via `.handle()`.
 *
 * Exposes the seven reserved `/api/v1/*` operations from `SERVICE_CONTRACTS`.
 * Routes delegate to the existing services in `hr-skills-build/server`; see
 * `routes/v1.ts`. `runtime` and `evaluation` require an API key via
 * `Authorization: Bearer` (see `http/auth.ts`). Every operation is rate limited per
 * caller using the limits in `SERVICE_CONTRACTS` (see `http/rate-limit.ts`). Each
 * request is logged and counted through the structured logger and metrics from
 * `hr-skills-build/server` (see `http/observability.ts`).
 */

import { Elysia } from 'elysia';
import type { ReadinessDependency, ServiceOperation } from 'hr-skills-build/server';
import { getServiceContract, SERVICE_CONTRACTS } from 'hr-skills-build/server';
import type { ApiKeyAuthenticator } from './http/auth.ts';
import type { ApiObservability } from './http/observability.ts';
import {
	createObservability,
	recordRequest,
	UNROUTED_OPERATION,
} from './http/observability.ts';
import type { ClientAddressResolver, RateLimiter } from './http/rate-limit.ts';
import {
	createClientAddressResolverFromEnv,
	createRateLimiterFromEnv,
} from './http/rate-limit-config.ts';
import { resolveRequestId } from './http/request-id.ts';
import { adapterFailure, toHttpResponse } from './http/response.ts';
import type { RegistryProvider } from './registry.ts';
import { loadRegistry } from './registry.ts';
import { createV1Handlers } from './routes/v1.ts';

export interface AppOptions {
	/** Supplies the skill registry. Defaults to the committed `registry/skills.json`. */
	readonly getRegistry?: RegistryProvider;
	/**
	 * Dependencies checked by `GET /api/v1/ready`. Defaults to registry loadability
	 * and API-key configuration. A list passed here replaces those defaults, so a
	 * deployment that adds its own checks (for example a shared rate-limit store)
	 * must include the ones it still wants.
	 */
	readonly readinessDependencies?: readonly ReadinessDependency[];
	/**
	 * Logger and metrics for the adapter. Defaults to discarding logs and keeping
	 * counters in a private in-process store, so `createApp()` stays silent and free
	 * of side effects. `src/index.ts` injects a JSON stdout sink.
	 */
	readonly observability?: ApiObservability;
	/** API-key authenticator for `runtime` and `evaluation`. Omit to fail closed (503). */
	readonly authenticateApiKey?: ApiKeyAuthenticator;
	/**
	 * Enforces the per-operation limits. Defaults to the store named by
	 * `HR_SKILLS_RATE_LIMIT_STORE`; in production that variable is mandatory and
	 * `createApp` throws `RateLimitConfigError` when it is missing. Inject a shared
	 * store here for multi-instance deployments.
	 */
	readonly rateLimiter?: RateLimiter;
	/** Identifies the caller of unauthenticated operations. Defaults to the socket address. */
	readonly resolveClientAddress?: ClientAddressResolver;
}

/**
 * Builds the Elysia application instance.
 *
 * Kept free of side effects (no `.listen()`) so it stays independently
 * testable and safe to import from other modules.
 *
 * The return type is left to inference: Elysia's chained builder methods
 * accumulate route-specific generics that a hand-written `Elysia` return
 * annotation would widen away, which conflicts with this repository's
 * `exactOptionalPropertyTypes` setting.
 */
export function createApp(options: AppOptions = {}) {
	const getRegistry = options.getRegistry ?? loadRegistry;
	const rateLimiter = options.rateLimiter ?? createRateLimiterFromEnv(Bun.env);
	const resolveClientAddress =
		options.resolveClientAddress ?? createClientAddressResolverFromEnv(Bun.env);
	const observability = options.observability ?? createObservability();

	const readinessDependencies: readonly ReadinessDependency[] =
		options.readinessDependencies ?? [
			{
				name: 'registry',
				// Return a boolean instead of throwing so error messages (which may
				// contain filesystem paths) never reach the readiness response.
				check: async () => {
					try {
						await getRegistry();
						return true;
					} catch {
						return false;
					}
				},
			},
			{
				// Without a configured authenticator `runtime` and `evaluation` answer 503
				// (fail closed), so the instance cannot serve its full contract.
				name: 'api-keys',
				check: () => options.authenticateApiKey !== undefined,
			},
		];

	const handlers = createV1Handlers({
		getRegistry,
		readinessDependencies,
		authenticateApiKey: options.authenticateApiKey,
		rateLimiter,
		resolveClientAddress,
		observability,
	});

	const path = (operation: ServiceOperation) => getServiceContract(operation).path;

	return new Elysia()
		.get('/', () => 'ok')
		.get(path('health'), handlers.health)
		.get(path('readiness'), handlers.ready)
		.get(path('version'), handlers.version)
		.post(path('search'), handlers.search)
		.post(path('planner'), handlers.planner)
		.post(path('runtime'), handlers.runtime)
		.post(path('evaluation'), handlers.evaluation)
		.onError(({ code, request }) => {
			const requestId = resolveRequestId(request);

			// Routes that match nothing (or fail outside a handler) still get one log
			// event and counter update. The URL is deliberately not logged: unknown paths
			// are attacker-controlled and may embed secrets.
			const respond = (
				failure: ReturnType<typeof adapterFailure>,
				responseOptions?: Parameters<typeof toHttpResponse>[2],
			) => {
				const response = toHttpResponse(failure, requestId, responseOptions);

				recordRequest(observability, {
					operation: UNROUTED_OPERATION,
					requestId,
					status: response.status,
					errorCode: failure.error.code,
				});

				return response;
			};

			if (code === 'NOT_FOUND') {
				const { pathname } = new URL(request.url);
				const allowed = SERVICE_CONTRACTS.filter(
					(contract) => contract.path === pathname,
				).map((contract) => contract.method);

				// Known route, wrong method.
				if (allowed.length > 0) {
					return respond(
						adapterFailure('BAD_REQUEST', 'Method not allowed', { allowed }),
						{ status: 405, headers: { Allow: allowed.join(', ') } },
					);
				}

				return respond(adapterFailure('NOT_FOUND', 'Route not found'));
			}

			return respond(adapterFailure('INTERNAL_ERROR', 'Unexpected internal error'));
		});
}
