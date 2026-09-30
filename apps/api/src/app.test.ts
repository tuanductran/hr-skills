import { describe, expect, it } from 'bun:test';
import type {
	Registry,
	RegistryEntry,
	ServiceEnvelope,
	ServiceErrorCode,
} from 'hr-skills-build/server';
import { type AppOptions, createApp } from './app.ts';
import { ERROR_STATUS } from './http/response.ts';

const mockSkill: RegistryEntry = {
	id: 'hr-onboarding-workflow',
	name: 'hr-onboarding-workflow',
	version: '1.0.0',
	description: 'Onboarding new hires workflow',
	tier: 'full',
	domain: 'onboarding-offboarding',
	tags: ['onboarding', 'new-hire'],
	aliases: ['onboarding-guide'],
	capabilities: ['Create onboarding plan for new employee'],
	triggerPhrases: ['create onboarding plan'],
	paths: { content: true, prompts: true, examples: true },
	dependencies: [],
	relatedSkills: [],
};

const mockRegistry: Registry = {
	schemaVersion: 1,
	generatedAt: '2026-09-09',
	skillCount: 1,
	skills: [mockSkill],
};

const okRegistry = async () => mockRegistry;
const allowAll = () => true;

function buildApp(options: AppOptions = {}) {
	return createApp({
		getRegistry: okRegistry,
		authenticateApiKey: allowAll,
		...options,
	});
}

interface CallInit {
	readonly body?: unknown;
	readonly rawBody?: string;
	readonly headers?: Record<string, string>;
}

async function call(
	app: ReturnType<typeof buildApp>,
	method: string,
	path: string,
	init: CallInit = {},
) {
	const hasBody = init.body !== undefined || init.rawBody !== undefined;
	const response = await app.handle(
		new Request(`http://localhost${path}`, {
			method,
			headers: {
				...(hasBody ? { 'content-type': 'application/json' } : {}),
				...init.headers,
			},
			...(hasBody ? { body: init.rawBody ?? JSON.stringify(init.body) } : {}),
		}),
	);
	const json = (await response.json()) as ServiceEnvelope<Record<string, unknown>>;
	return { response, json };
}

function expectFailure(
	result: Awaited<ReturnType<typeof call>>,
	status: number,
	code: ServiceErrorCode,
) {
	expect(result.response.status).toBe(status);
	expect(result.json.success).toBe(false);
	if (result.json.success) throw new Error('expected failure envelope');
	expect(result.json.error.code).toBe(code);
	expect(result.json.meta.apiVersion).toBe('v1');
	expect(typeof result.json.meta.requestId).toBe('string');
}

function expectSuccess(result: Awaited<ReturnType<typeof call>>) {
	expect(result.response.status).toBe(200);
	expect(result.json.success).toBe(true);
	expect(result.json.meta.apiVersion).toBe('v1');
	expect(typeof result.json.meta.requestId).toBe('string');
	if (!result.json.success) throw new Error('expected success envelope');
	return result.json.data;
}

const ROUTES = [
	{ name: 'health', method: 'GET', path: '/api/v1/health', wrong: 'POST' },
	{ name: 'ready', method: 'GET', path: '/api/v1/ready', wrong: 'POST' },
	{ name: 'version', method: 'GET', path: '/api/v1/version', wrong: 'POST' },
	{ name: 'search', method: 'POST', path: '/api/v1/search', wrong: 'GET' },
	{ name: 'planner', method: 'POST', path: '/api/v1/planner', wrong: 'GET' },
	{ name: 'runtime', method: 'POST', path: '/api/v1/runtime', wrong: 'GET' },
	{ name: 'evaluation', method: 'POST', path: '/api/v1/evaluation', wrong: 'GET' },
] as const;

const VALID_BODIES: Record<string, unknown> = {
	search: { query: 'onboarding' },
	planner: { intent: 'create onboarding plan' },
	runtime: { plan: { steps: [] } },
	evaluation: {
		dataset: {
			name: 'api-test-dataset',
			description: 'Test evaluation dataset',
			cases: [
				{
					id: 'case-1',
					description: 'Onboarding plan scenario',
					intent: 'create onboarding plan',
					category: 'onboarding',
				},
			],
		},
	},
};

describe('cross-cutting behaviour (all 7 routes)', () => {
	for (const route of ROUTES) {
		describe(`${route.method} ${route.path}`, () => {
			const body = VALID_BODIES[route.name];
			const init: CallInit = body === undefined ? {} : { body };

			it('generates a request ID at the HTTP boundary', async () => {
				const result = await call(buildApp(), route.method, route.path, init);
				const requestId = result.json.meta.requestId;
				expect(requestId).toMatch(/^req_[0-9a-f-]{36}$/);
				expect(result.response.headers.get('x-request-id')).toBe(
					requestId ?? null,
				);
			});

			it('propagates a well-formed inbound X-Request-Id', async () => {
				const result = await call(buildApp(), route.method, route.path, {
					...init,
					headers: { 'x-request-id': 'trace-abc_123' },
				});
				expect(result.json.meta.requestId).toBe('trace-abc_123');
				expect(result.response.headers.get('x-request-id')).toBe('trace-abc_123');
			});

			it('replaces a malformed inbound X-Request-Id', async () => {
				const result = await call(buildApp(), route.method, route.path, {
					...init,
					headers: { 'x-request-id': 'bad id with spaces' },
				});
				expect(result.json.meta.requestId).toMatch(/^req_/);
			});

			it(`rejects ${route.wrong} with 405 and an Allow header`, async () => {
				const result = await call(buildApp(), route.wrong, route.path);
				expectFailure(result, 405, 'BAD_REQUEST');
				expect(result.response.headers.get('allow')).toBe(route.method);
			});
		});
	}

	it('returns a NOT_FOUND envelope for unknown routes', async () => {
		const result = await call(buildApp(), 'GET', '/api/v1/unknown');
		expectFailure(result, 404, 'NOT_FOUND');
	});

	it('maps every ServiceErrorCode to an HTTP status', () => {
		expect(ERROR_STATUS).toEqual({
			BAD_REQUEST: 400,
			NOT_FOUND: 404,
			VALIDATION_ERROR: 422,
			PLANNING_FAILED: 422,
			RUNTIME_FAILED: 500,
			SERVICE_UNAVAILABLE: 503,
			INTERNAL_ERROR: 500,
		});
	});
});

describe('GET /api/v1/health', () => {
	it('returns liveness status', async () => {
		const data = expectSuccess(await call(buildApp(), 'GET', '/api/v1/health'));
		expect(data['status']).toBe('ok');
		expect(typeof data['uptime']).toBe('number');
	});

	it('does not depend on the registry', async () => {
		const app = buildApp({
			getRegistry: async () => {
				throw new Error('registry down');
			},
		});
		expectSuccess(await call(app, 'GET', '/api/v1/health'));
	});
});

describe('GET /api/v1/ready', () => {
	it('returns ready when the registry loads', async () => {
		const data = expectSuccess(await call(buildApp(), 'GET', '/api/v1/ready'));
		expect(data['status']).toBe('ready');
	});

	it('maps a failing dependency to 503 SERVICE_UNAVAILABLE with checks', async () => {
		const app = buildApp({
			readinessDependencies: [{ name: 'cache', check: () => false }],
		});
		const result = await call(app, 'GET', '/api/v1/ready');
		expectFailure(result, 503, 'SERVICE_UNAVAILABLE');
		if (!result.json.success) {
			expect(result.json.error.details?.['checks']).toEqual([
				{
					name: 'cache',
					status: 'not_ready',
					message: 'Dependency is not ready',
				},
			]);
		}
	});

	it('does not leak registry error details when the registry is unavailable', async () => {
		const app = buildApp({
			getRegistry: async () => {
				throw new Error('ENOENT: /secret/path/registry/skills.json');
			},
		});
		const result = await call(app, 'GET', '/api/v1/ready');
		expectFailure(result, 503, 'SERVICE_UNAVAILABLE');
		expect(JSON.stringify(result.json)).not.toContain('/secret/path');
	});
});

describe('GET /api/v1/version', () => {
	it('returns version and per-operation API versions', async () => {
		const data = expectSuccess(await call(buildApp(), 'GET', '/api/v1/version'));
		expect(data['name']).toBe('hr-skills-service');
		expect((data['apiVersions'] as Record<string, string>)['runtime']).toBe('v1');
	});
});

describe('POST /api/v1/search', () => {
	it('returns search results from the registry service', async () => {
		const data = expectSuccess(
			await call(buildApp(), 'POST', '/api/v1/search', {
				body: { query: 'onboarding' },
			}),
		);
		expect(data['query']).toBe('onboarding');
		const results = data['results'] as Array<{ skillId: string }>;
		expect(results[0]?.skillId).toBe('hr-onboarding-workflow');
	});

	it('maps schema validation failures to 422 VALIDATION_ERROR', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/search', {
			body: { maxResults: 'invalid' },
		});
		expectFailure(result, 422, 'VALIDATION_ERROR');
	});

	it('maps malformed JSON to 400 BAD_REQUEST', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/search', {
			rawBody: '{nope',
		});
		expectFailure(result, 400, 'BAD_REQUEST');
	});

	it('maps an unavailable registry to 503 SERVICE_UNAVAILABLE without leaking details', async () => {
		const app = buildApp({
			getRegistry: async () => {
				throw new Error('ENOENT: /secret/path');
			},
		});
		const result = await call(app, 'POST', '/api/v1/search', {
			body: { query: 'x' },
		});
		expectFailure(result, 503, 'SERVICE_UNAVAILABLE');
		expect(JSON.stringify(result.json)).not.toContain('/secret/path');
	});
});

describe('POST /api/v1/planner', () => {
	it('returns a plan with its validation result', async () => {
		const data = expectSuccess(
			await call(buildApp(), 'POST', '/api/v1/planner', {
				body: { intent: 'create onboarding plan' },
			}),
		);
		const plan = data['plan'] as { intent: string; steps: unknown[] };
		expect(plan.intent).toBe('create onboarding plan');
		expect(plan.steps.length).toBe(1);
		expect((data['validation'] as { isValid: boolean }).isValid).toBe(true);
	});

	it('maps an empty intent to 422 VALIDATION_ERROR', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/planner', {
			body: { intent: '' },
		});
		expectFailure(result, 422, 'VALIDATION_ERROR');
	});

	it('maps a missing body to 422 VALIDATION_ERROR', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/planner');
		expectFailure(result, 422, 'VALIDATION_ERROR');
	});

	it('maps malformed JSON to 400 BAD_REQUEST', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/planner', {
			rawBody: '[',
		});
		expectFailure(result, 400, 'BAD_REQUEST');
	});
});

describe('POST /api/v1/runtime', () => {
	async function planFor(intent: string) {
		const planned = await call(buildApp(), 'POST', '/api/v1/planner', {
			body: { intent },
		});
		return (expectSuccess(planned) as { plan: unknown }).plan;
	}

	it('executes a plan produced by the planner route', async () => {
		const plan = await planFor('create onboarding plan');
		const data = expectSuccess(
			await call(buildApp(), 'POST', '/api/v1/runtime', { body: { plan } }),
		);
		expect(data['status']).toBe('completed');
	});

	it('maps a missing plan to 400 BAD_REQUEST', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/runtime', { body: {} });
		expectFailure(result, 400, 'BAD_REQUEST');
	});

	it('maps malformed JSON to 400 BAD_REQUEST', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/runtime', {
			rawBody: '{',
		});
		expectFailure(result, 400, 'BAD_REQUEST');
	});

	it('maps execution failures to 500 RUNTIME_FAILED', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/runtime', {
			body: { plan: { steps: [null] } },
		});
		expectFailure(result, 500, 'RUNTIME_FAILED');
	});

	it('fails closed when no API key authenticator is configured (placeholder)', async () => {
		const app = createApp({ getRegistry: okRegistry });
		const result = await call(app, 'POST', '/api/v1/runtime', {
			body: { plan: { steps: [] } },
		});
		expectFailure(result, 503, 'SERVICE_UNAVAILABLE');
	});

	it('returns 401 when the authenticator rejects the request', async () => {
		const app = buildApp({ authenticateApiKey: () => false });
		const result = await call(app, 'POST', '/api/v1/runtime', {
			body: { plan: { steps: [] } },
		});
		expectFailure(result, 401, 'BAD_REQUEST');
	});

	it('does not require authentication on unauthenticated operations', async () => {
		const app = createApp({ getRegistry: okRegistry });
		expectSuccess(await call(app, 'GET', '/api/v1/health'));
		expectSuccess(
			await call(app, 'POST', '/api/v1/planner', {
				body: { intent: 'create onboarding plan' },
			}),
		);
	});
});

describe('POST /api/v1/evaluation', () => {
	it('runs the dataset through the evaluation service', async () => {
		const data = expectSuccess(
			await call(buildApp(), 'POST', '/api/v1/evaluation', {
				body: VALID_BODIES['evaluation'],
			}),
		);
		expect(data['datasetName']).toBe('api-test-dataset');
		expect(data['totalCases']).toBe(1);
		expect(data['passedCases']).toBe(1);
	});

	it('maps a missing dataset to 400 BAD_REQUEST', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/evaluation', { body: {} });
		expectFailure(result, 400, 'BAD_REQUEST');
	});

	it('maps malformed JSON to 400 BAD_REQUEST', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/evaluation', {
			rawBody: 'x',
		});
		expectFailure(result, 400, 'BAD_REQUEST');
	});

	it('maps evaluation execution failures to 500 INTERNAL_ERROR', async () => {
		const result = await call(buildApp(), 'POST', '/api/v1/evaluation', {
			body: {
				...(VALID_BODIES['evaluation'] as Record<string, unknown>),
				golden: { results: 'not-an-array' },
			},
		});
		expectFailure(result, 500, 'INTERNAL_ERROR');
	});

	it('maps an unavailable registry to 503 SERVICE_UNAVAILABLE', async () => {
		const app = buildApp({
			getRegistry: async () => {
				throw new Error('down');
			},
		});
		const result = await call(app, 'POST', '/api/v1/evaluation', {
			body: VALID_BODIES['evaluation'],
		});
		expectFailure(result, 503, 'SERVICE_UNAVAILABLE');
	});

	it('fails closed when no API key authenticator is configured (placeholder)', async () => {
		const app = createApp({ getRegistry: okRegistry });
		const result = await call(app, 'POST', '/api/v1/evaluation', {
			body: VALID_BODIES['evaluation'],
		});
		expectFailure(result, 503, 'SERVICE_UNAVAILABLE');
	});

	it('returns 401 when the authenticator rejects the request', async () => {
		const app = buildApp({ authenticateApiKey: () => false });
		const result = await call(app, 'POST', '/api/v1/evaluation', {
			body: VALID_BODIES['evaluation'],
		});
		expectFailure(result, 401, 'BAD_REQUEST');
	});
});
