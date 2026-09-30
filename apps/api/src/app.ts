/**
 * Elysia application factory for the HR Skills hosted HTTP adapter (Phase 8.4).
 *
 * Builds and returns an Elysia instance without binding a port, so it can be
 * started by `src/index.ts` or exercised in tests via `.handle()`.
 *
 * Exposes the seven reserved `/api/v1/*` operations from `SERVICE_CONTRACTS`.
 * Routes delegate to the existing services in `hr-skills-build/server`; see
 * `routes/v1.ts`. Rate limiting is not implemented yet, and API-key
 * authentication is a fail-closed placeholder (see `http/auth.ts`).
 */

import { Elysia } from 'elysia';
import type { ReadinessDependency, ServiceOperation } from 'hr-skills-build/server';
import { getServiceContract, SERVICE_CONTRACTS } from 'hr-skills-build/server';
import type { ApiKeyAuthenticator } from './http/auth.ts';
import { resolveRequestId } from './http/request-id.ts';
import { adapterFailure, toHttpResponse } from './http/response.ts';
import type { RegistryProvider } from './registry.ts';
import { loadRegistry } from './registry.ts';
import { createV1Handlers } from './routes/v1.ts';

export interface AppOptions {
	/** Supplies the skill registry. Defaults to the committed `registry/skills.json`. */
	readonly getRegistry?: RegistryProvider;
	/** Dependencies checked by `GET /api/v1/ready`. Defaults to registry loadability. */
	readonly readinessDependencies?: readonly ReadinessDependency[];
	/** API-key authenticator placeholder for `runtime` and `evaluation`. */
	readonly authenticateApiKey?: ApiKeyAuthenticator;
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
		];

	const handlers = createV1Handlers({
		getRegistry,
		readinessDependencies,
		authenticateApiKey: options.authenticateApiKey,
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

			if (code === 'NOT_FOUND') {
				const { pathname } = new URL(request.url);
				const allowed = SERVICE_CONTRACTS.filter(
					(contract) => contract.path === pathname,
				).map((contract) => contract.method);

				// Known route, wrong method.
				if (allowed.length > 0) {
					return toHttpResponse(
						adapterFailure('BAD_REQUEST', 'Method not allowed', { allowed }),
						requestId,
						{ status: 405, headers: { Allow: allowed.join(', ') } },
					);
				}

				return toHttpResponse(
					adapterFailure('NOT_FOUND', 'Route not found'),
					requestId,
				);
			}

			return toHttpResponse(
				adapterFailure('INTERNAL_ERROR', 'Unexpected internal error'),
				requestId,
			);
		});
}
