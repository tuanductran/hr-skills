import { describe, expect, it, spyOn } from 'bun:test';
import type {
	Registry,
	RegistryEntry,
	ServiceEnvelope,
	ServiceLogEvent,
} from 'hr-skills-build/server';
import { createServiceMetrics } from 'hr-skills-build/server';
import { type AppOptions, createApp } from '../app.ts';
import { createApiKeyAuthenticator } from './auth.ts';
import {
	classifyOutcome,
	createJsonLogSink,
	createObservability,
	errorName,
	logMetricsSnapshot,
	metricName,
	parseSnapshotIntervalSeconds,
	recordRequest,
} from './observability.ts';
import {
	createInMemoryRateLimitStore,
	createRateLimiter,
	type RateLimitStore,
} from './rate-limit.ts';
import { resolveRequestId } from './request-id.ts';

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
const API_KEY = 'observability-test-key-0123456789';

function freshLimiter() {
	return createRateLimiter({ store: createInMemoryRateLimitStore() });
}

/** An app wired to an observability instance whose events and counters the test can read. */
function build(options: AppOptions = {}) {
	const events: ServiceLogEvent[] = [];
	const metrics = createServiceMetrics();
	const observability = createObservability({
		logSink: (event) => events.push(event),
		metrics,
	});
	const app = createApp({
		getRegistry: okRegistry,
		authenticateApiKey: createApiKeyAuthenticator([API_KEY]),
		rateLimiter: freshLimiter(),
		observability,
		...options,
	});

	return { app, events, metrics };
}

interface SendInit {
	readonly body?: unknown;
	readonly rawBody?: string;
	readonly headers?: Record<string, string>;
}

async function send(
	app: ReturnType<typeof build>['app'],
	method: string,
	path: string,
	init: SendInit = {},
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

function completed(events: readonly ServiceLogEvent[]) {
	return events.filter((event) => event.event === 'http.request.completed');
}

const authorized = { authorization: `Bearer ${API_KEY}` };

describe('request ID linkage', () => {
	const cases: readonly {
		readonly name: string;
		readonly method: string;
		readonly path: string;
		readonly init?: SendInit;
		readonly status: number;
	}[] = [
		{ name: 'health', method: 'GET', path: '/api/v1/health', status: 200 },
		{
			name: 'search',
			method: 'POST',
			path: '/api/v1/search',
			init: { body: { query: 'onboarding' } },
			status: 200,
		},
		{
			name: 'unauthorized runtime',
			method: 'POST',
			path: '/api/v1/runtime',
			init: { body: { plan: {} } },
			status: 401,
		},
		{ name: 'unknown route', method: 'GET', path: '/api/v1/nope', status: 404 },
		{ name: 'wrong method', method: 'POST', path: '/api/v1/health', status: 405 },
	];

	for (const testCase of cases) {
		it(`logs exactly one event whose request ID matches the response (${testCase.name})`, async () => {
			const { app, events } = build();
			const { response, json } = await send(
				app,
				testCase.method,
				testCase.path,
				testCase.init,
			);
			const logged = completed(events);

			expect(response.status).toBe(testCase.status);
			expect(logged).toHaveLength(1);

			const requestId = response.headers.get('x-request-id');
			expect(requestId).toMatch(/^req_[0-9a-f-]{36}$/);
			expect(json.meta.requestId).toBe(requestId ?? undefined);
			expect(logged[0]?.requestId).toBe(requestId ?? undefined);
		});
	}

	it('resolves one stable ID per request object, even when generated', () => {
		const request = new Request('http://localhost/api/v1/health');
		const first = resolveRequestId(request);

		expect(resolveRequestId(request)).toBe(first);
		expect(resolveRequestId(new Request('http://localhost/api/v1/health'))).not.toBe(
			first,
		);
	});

	it('logs a propagated inbound request ID', async () => {
		const { app, events } = build();
		const { response } = await send(app, 'GET', '/api/v1/health', {
			headers: { 'x-request-id': 'trace-abc_123' },
		});

		expect(response.headers.get('x-request-id')).toBe('trace-abc_123');
		expect(completed(events)[0]?.requestId).toBe('trace-abc_123');
	});

	it('never logs a malformed inbound request ID', async () => {
		const { app, events } = build();
		const hostile = 'bad id\nwith "injection"';
		const { response } = await send(app, 'GET', '/api/v1/health', {
			headers: { 'x-request-id': 'bad id with spaces' },
		});

		expect(response.headers.get('x-request-id')).toMatch(/^req_/);
		expect(JSON.stringify(events)).not.toContain('bad id with spaces');
		expect(JSON.stringify(events)).not.toContain(hostile);
		expect(completed(events)[0]?.requestId).toBe(
			response.headers.get('x-request-id') ?? undefined,
		);
	});

	it('gives concurrent requests distinct IDs, each matching its own log event', async () => {
		const { app, events } = build();
		const responses = await Promise.all(
			Array.from({ length: 5 }, () => send(app, 'GET', '/api/v1/version')),
		);
		const headerIds = responses.map((r) => r.response.headers.get('x-request-id'));

		expect(new Set(headerIds).size).toBe(5);
		expect(
			completed(events)
				.map((e) => e.requestId)
				.sort(),
		).toEqual([...headerIds].sort() as string[]);
	});
});

describe('completion events', () => {
	it('records operation, status, outcome, and a non-negative duration', async () => {
		const { app, events } = build();

		await send(app, 'POST', '/api/v1/search', { body: { query: 'onboarding' } });

		expect(completed(events)[0]).toMatchObject({
			level: 'info',
			event: 'http.request.completed',
			operation: 'search',
			details: { status: 200, outcome: 'ok' },
		});
		expect(typeof completed(events)[0]?.durationMs).toBe('number');
		expect(completed(events)[0]?.durationMs).toBeGreaterThanOrEqual(0);
		expect(typeof completed(events)[0]?.timestamp).toBe('string');
	});

	it('warns for client errors and errors for server errors', async () => {
		const { app, events } = build({
			getRegistry: async () => {
				throw new Error('boom');
			},
		});

		await send(app, 'POST', '/api/v1/runtime', { body: { plan: {} } });
		await send(app, 'POST', '/api/v1/search', {
			body: { query: 'x' },
			headers: authorized,
		});

		const levels = completed(events).map((event) => event.level);
		expect(levels).toEqual(['warn', 'error']);
	});

	it('is silent by default, so createApp() has no console side effects', async () => {
		const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((level) =>
			spyOn(console, level).mockImplementation(() => undefined),
		);

		try {
			const app = createApp({
				getRegistry: okRegistry,
				rateLimiter: freshLimiter(),
			});

			await send(app, 'GET', '/api/v1/health');
			await send(app, 'GET', '/api/v1/missing');

			for (const spy of spies) expect(spy).not.toHaveBeenCalled();
		} finally {
			for (const spy of spies) spy.mockRestore();
		}
	});
});

describe('metrics', () => {
	it('counts requests and failures per operation under versioned names', async () => {
		const { app, metrics } = build();

		await send(app, 'GET', '/api/v1/health');
		await send(app, 'GET', '/api/v1/health');
		await send(app, 'POST', '/api/v1/search', { body: { query: 'onboarding' } });
		await send(app, 'POST', '/api/v1/search', { body: {} }); // validation
		await send(app, 'POST', '/api/v1/search', { rawBody: '{' }); // malformed JSON
		await send(app, 'POST', '/api/v1/runtime', { body: { plan: {} } }); // no key
		await send(app, 'GET', '/api/v1/missing');

		expect(metrics.snapshot().counters).toEqual({
			'service.v1.health.requests': 2,
			'service.v1.search.requests': 3,
			'service.v1.search.validation_failures': 2,
			'service.v1.runtime.requests': 1,
			'service.v1.runtime.unauthorized': 1,
			'service.v1.unrouted.requests': 1,
		});
	});

	it('counts rate-limited requests separately from service failures', async () => {
		const { app, metrics } = build();

		for (let i = 0; i < 6; i += 1) {
			await send(app, 'POST', '/api/v1/evaluation', {
				body: {},
				headers: authorized,
			});
		}

		const counters = metrics.snapshot().counters;
		expect(counters[metricName('evaluation', 'requests')]).toBe(6);
		expect(counters[metricName('evaluation', 'rate_limited')]).toBe(1);
		expect(counters[metricName('evaluation', 'validation_failures')]).toBe(5);
		expect(counters[metricName('evaluation', 'service_failures')]).toBeUndefined();
	});

	it('counts unexpected exceptions as service failures', async () => {
		const { app, metrics } = build({
			authenticateApiKey: () => {
				throw new Error('authenticator exploded');
			},
		});

		const { response } = await send(app, 'POST', '/api/v1/runtime', {
			body: { plan: {} },
			headers: authorized,
		});

		expect(response.status).toBe(500);
		expect(
			metrics.snapshot().counters[metricName('runtime', 'service_failures')],
		).toBe(1);
	});

	it('does not invent metrics for caches the adapter does not use', async () => {
		const { app, metrics } = build();

		await send(app, 'POST', '/api/v1/search', { body: { query: 'onboarding' } });

		const names = Object.keys(metrics.snapshot().counters);
		expect(names.filter((name) => name.includes('cache'))).toEqual([]);
	});
});

describe('sensitive data', () => {
	const BODY_MARKER = 'SECRET-BODY-MARKER-8842';
	const QUERY_MARKER = 'SECRET-QUERY-MARKER-1177';
	const ADDRESS_MARKER = '203.0.113.77';

	it('never writes keys, bodies, query strings, or addresses to logs or metrics', async () => {
		const { app, events, metrics } = build();
		const headers = {
			...authorized,
			'x-forwarded-for': ADDRESS_MARKER,
			'x-request-id': 'req-redaction-check',
		};

		await send(app, 'POST', `/api/v1/search?token=${QUERY_MARKER}`, {
			body: { query: BODY_MARKER },
			headers,
		});
		await send(app, 'POST', '/api/v1/planner', {
			body: { intent: BODY_MARKER },
			headers,
		});
		await send(app, 'POST', '/api/v1/runtime', {
			body: { plan: { secret: BODY_MARKER } },
			headers,
		});
		await send(app, 'POST', '/api/v1/runtime', {
			body: { plan: { secret: BODY_MARKER } },
			headers: {
				authorization: 'Bearer wrong-key-ZZZ-998877',
				'x-request-id': 'r2',
			},
		});
		await send(app, 'POST', '/api/v1/search', {
			rawBody: `{"query": "${BODY_MARKER}`,
			headers,
		});
		await send(app, 'GET', `/secret-path-${QUERY_MARKER}?token=${QUERY_MARKER}`);

		const observed = JSON.stringify({ events, counters: metrics.snapshot() });

		expect(completed(events)).toHaveLength(6);
		for (const secret of [
			API_KEY,
			'wrong-key-ZZZ-998877',
			BODY_MARKER,
			QUERY_MARKER,
			ADDRESS_MARKER,
		]) {
			expect(observed).not.toContain(secret);
		}
	});

	it('records exception class names only, never messages', async () => {
		const { app, events } = build({
			authenticateApiKey: (request) => {
				throw new TypeError(`boom ${request.headers.get('authorization')}`);
			},
		});

		const { response, json } = await send(app, 'POST', '/api/v1/runtime', {
			body: { plan: {} },
			headers: authorized,
		});

		expect(response.status).toBe(500);
		expect(json.success).toBe(false);
		expect(JSON.stringify(events)).not.toContain(API_KEY);
		expect(JSON.stringify(events)).not.toContain('boom');
		expect(completed(events)[0]?.details).toMatchObject({
			status: 500,
			errorCode: 'INTERNAL_ERROR',
			errorName: 'TypeError',
		});
	});

	it('explains a registry outage without logging the error text or path', async () => {
		const { app, events } = build({
			getRegistry: async () => {
				throw new Error('ENOENT /home/deploy/hr-skills/registry/skills.json');
			},
		});

		const { response } = await send(app, 'POST', '/api/v1/search', {
			body: { query: 'onboarding' },
		});

		expect(response.status).toBe(503);
		expect(completed(events)[0]?.details).toMatchObject({
			status: 503,
			outcome: 'service_failure',
			reason: 'registry_unavailable',
			errorName: 'Error',
		});
		expect(JSON.stringify(events)).not.toContain('/home/deploy');
	});

	it('explains a rate-limit store outage and keeps failing closed', async () => {
		const failing: RateLimitStore = {
			hit() {
				throw new Error('redis://user:hunter2@cache.internal:6379 refused');
			},
		};
		const { app, events } = build({
			rateLimiter: createRateLimiter({ store: failing }),
		});

		const { response } = await send(app, 'GET', '/api/v1/health');

		expect(response.status).toBe(503);
		expect(completed(events)[0]?.details).toMatchObject({
			status: 503,
			reason: 'rate_limit_store_unavailable',
		});
		expect(JSON.stringify(events)).not.toContain('hunter2');
	});
});

describe('failing sinks and metrics', () => {
	it('does not fail the request when the log sink throws', async () => {
		const observability = createObservability({
			logSink: () => {
				throw new Error('log backend down');
			},
		});
		const app = createApp({
			getRegistry: okRegistry,
			rateLimiter: freshLimiter(),
			observability,
		});

		const { response, json } = await send(app, 'GET', '/api/v1/health');

		expect(response.status).toBe(200);
		expect(json.success).toBe(true);
	});

	it('does not fail the request when the metrics backend throws, and still logs', async () => {
		const events: ServiceLogEvent[] = [];
		const observability = createObservability({
			logSink: (event) => events.push(event),
			metrics: {
				increment() {
					throw new Error('metrics backend down');
				},
				snapshot: () => ({ counters: {} }),
				reset() {},
			},
		});
		const app = createApp({
			getRegistry: okRegistry,
			rateLimiter: freshLimiter(),
			observability,
		});

		const { response } = await send(app, 'GET', '/api/v1/health');

		expect(response.status).toBe(200);
		expect(completed(events)).toHaveLength(1);
	});
});

describe('readiness reflects dependency state', () => {
	it('is ready when the registry loads and API keys are configured', async () => {
		const { app, events } = build();
		const { response, json } = await send(app, 'GET', '/api/v1/ready');

		expect(response.status).toBe(200);
		expect(json.success && json.data['status']).toBe('ready');
		expect(completed(events)[0]?.details).toMatchObject({ outcome: 'ok' });
	});

	it('is not ready when no API key is configured, because runtime and evaluation would answer 503', async () => {
		const events: ServiceLogEvent[] = [];
		const metrics = createServiceMetrics();
		const app = createApp({
			getRegistry: okRegistry,
			rateLimiter: freshLimiter(),
			observability: createObservability({
				logSink: (event) => events.push(event),
				metrics,
			}),
		});

		const ready = await send(app, 'GET', '/api/v1/ready');
		const runtime = await send(app, 'POST', '/api/v1/runtime', {
			body: { plan: {} },
		});

		expect(ready.response.status).toBe(503);
		expect(ready.json.success).toBe(false);
		expect(runtime.response.status).toBe(503);
		expect(completed(events)[0]?.details).toMatchObject({
			outcome: 'readiness_failure',
			failedChecks: ['api-keys'],
		});
		expect(
			metrics.snapshot().counters[metricName('readiness', 'readiness_failures')],
		).toBe(1);
	});

	it('follows the registry: not ready while it cannot load, ready again once it can', async () => {
		let available = false;
		const { app, events, metrics } = build({
			getRegistry: async () => {
				if (!available) throw new Error('ENOENT /srv/registry/skills.json');
				return mockRegistry;
			},
		});

		const down = await send(app, 'GET', '/api/v1/ready');
		available = true;
		const up = await send(app, 'GET', '/api/v1/ready');

		expect(down.response.status).toBe(503);
		expect(up.response.status).toBe(200);
		expect(completed(events)[0]?.details).toMatchObject({
			failedChecks: ['registry'],
		});
		expect(completed(events)[1]?.details).toMatchObject({ outcome: 'ok' });
		expect(completed(events)[1]?.details).not.toHaveProperty('failedChecks');
		expect(
			metrics.snapshot().counters[metricName('readiness', 'readiness_failures')],
		).toBe(1);
		expect(JSON.stringify(events)).not.toContain('/srv/registry');
		expect(JSON.stringify(down.json)).not.toContain('/srv/registry');
	});

	it('lists every failing check by name only', async () => {
		const { app, events } = build({
			readinessDependencies: [
				{ name: 'registry', check: () => false },
				{ name: 'store', check: () => true },
				{
					name: 'queue',
					check: () => {
						throw new Error('amqp://user:hunter2@queue.internal');
					},
				},
			],
		});

		await send(app, 'GET', '/api/v1/ready');

		expect(completed(events)[0]?.details).toMatchObject({
			failedChecks: ['registry', 'queue'],
		});
		expect(JSON.stringify(events)).not.toContain('hunter2');
	});

	it('keeps readiness open and rate limited like the other unauthenticated operations', async () => {
		const { app, metrics } = build();

		for (let i = 0; i < 61; i += 1) {
			await send(app, 'GET', '/api/v1/ready');
		}

		const counters = metrics.snapshot().counters;
		expect(counters[metricName('readiness', 'requests')]).toBe(61);
		expect(counters[metricName('readiness', 'rate_limited')]).toBe(1);
		expect(counters[metricName('readiness', 'unauthorized')]).toBeUndefined();
	});
});

describe('JSON log sink', () => {
	it('writes one parseable JSON line per event and routes levels to console methods', async () => {
		const lines: { level: string; line: string }[] = [];
		const observability = createObservability({
			logSink: createJsonLogSink((level, line) => lines.push({ level, line })),
		});
		const app = createApp({
			getRegistry: okRegistry,
			rateLimiter: freshLimiter(),
			observability,
		});

		await send(app, 'GET', '/api/v1/health'); // info
		await send(app, 'GET', '/api/v1/missing'); // warn

		expect(lines.map((entry) => entry.level)).toEqual(['info', 'warn']);
		for (const { line } of lines) {
			expect(line).not.toContain('\n');
			expect(JSON.parse(line)).toMatchObject({
				event: 'http.request.completed',
				timestamp: expect.any(String),
			});
		}
	});

	it('uses the console method matching the level by default', () => {
		const spies = {
			log: spyOn(console, 'log').mockImplementation(() => undefined),
			warn: spyOn(console, 'warn').mockImplementation(() => undefined),
			error: spyOn(console, 'error').mockImplementation(() => undefined),
		};

		try {
			const sink = createJsonLogSink();
			for (const level of ['info', 'warn', 'error'] as const) {
				sink({ level, event: 'test.event', timestamp: 't' });
			}

			expect(spies.log).toHaveBeenCalledTimes(1);
			expect(spies.warn).toHaveBeenCalledTimes(1);
			expect(spies.error).toHaveBeenCalledTimes(1);
		} finally {
			for (const spy of Object.values(spies)) spy.mockRestore();
		}
	});
});

describe('helpers', () => {
	it('classifies outcomes from status and error code', () => {
		expect(classifyOutcome('search', 200, undefined)).toBe('ok');
		expect(classifyOutcome('runtime', 401, 'BAD_REQUEST')).toBe('unauthorized');
		expect(classifyOutcome('search', 429, 'BAD_REQUEST')).toBe('rate_limited');
		expect(classifyOutcome('search', 400, 'BAD_REQUEST')).toBe('validation_failure');
		expect(classifyOutcome('planner', 422, 'VALIDATION_ERROR')).toBe(
			'validation_failure',
		);
		expect(classifyOutcome('planner', 422, 'PLANNING_FAILED')).toBe(
			'service_failure',
		);
		expect(classifyOutcome('runtime', 500, 'RUNTIME_FAILED')).toBe('service_failure');
		expect(classifyOutcome('search', 503, 'SERVICE_UNAVAILABLE')).toBe(
			'service_failure',
		);
		expect(classifyOutcome('unrouted', 404, 'NOT_FOUND')).toBe('not_matched');
		expect(classifyOutcome('unrouted', 405, 'BAD_REQUEST')).toBe('not_matched');
		expect(classifyOutcome('unrouted', 500, 'INTERNAL_ERROR')).toBe(
			'service_failure',
		);
	});

	it('describes thrown values by class name only', () => {
		expect(errorName(new RangeError('secret'))).toBe('RangeError');
		expect(errorName('secret string')).toBe('string');
		expect(errorName(undefined)).toBe('undefined');
	});

	it('accepts only whole-second snapshot intervals from 1 to 86400', () => {
		expect(parseSnapshotIntervalSeconds(undefined)).toBeUndefined();
		expect(parseSnapshotIntervalSeconds('')).toBeUndefined();
		expect(parseSnapshotIntervalSeconds('   ')).toBeUndefined();
		expect(parseSnapshotIntervalSeconds('0')).toBeUndefined();
		expect(parseSnapshotIntervalSeconds('-5')).toBeUndefined();
		expect(parseSnapshotIntervalSeconds('1.5')).toBeUndefined();
		expect(parseSnapshotIntervalSeconds('abc')).toBeUndefined();
		expect(parseSnapshotIntervalSeconds('86401')).toBeUndefined();
		expect(parseSnapshotIntervalSeconds('1')).toBe(1);
		expect(parseSnapshotIntervalSeconds(' 60 ')).toBe(60);
		expect(parseSnapshotIntervalSeconds('86400')).toBe(86_400);
	});

	it('logs cumulative counters as a snapshot event', () => {
		const events: ServiceLogEvent[] = [];
		const observability = createObservability({
			logSink: (event) => events.push(event),
		});

		recordRequest(observability, {
			operation: 'search',
			requestId: 'req-1',
			status: 200,
		});
		logMetricsSnapshot(observability);

		const snapshot = events.find(
			(event) => event.event === 'service.metrics.snapshot',
		);
		expect(snapshot).toMatchObject({
			level: 'info',
			details: { counters: { 'service.v1.search.requests': 1 } },
		});
	});
});
