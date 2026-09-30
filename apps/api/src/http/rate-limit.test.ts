import { describe, expect, it } from 'bun:test';
import type {
	Registry,
	RegistryEntry,
	ServiceEnvelope,
	ServiceOperation,
} from 'hr-skills-build/server';
import { getServiceContract } from 'hr-skills-build/server';
import { createApp } from '../app.ts';
import { createApiKeyAuthenticator } from './auth.ts';
import type { RateLimitStore } from './rate-limit.ts';
import {
	createClientAddressResolver,
	createInMemoryRateLimitStore,
	createRateLimiter,
} from './rate-limit.ts';
import {
	createClientAddressResolverFromEnv,
	createRateLimiterFromEnv,
	RateLimitConfigError,
} from './rate-limit-config.ts';

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

const VALID_BODIES: Partial<Record<ServiceOperation, unknown>> = {
	search: { query: 'onboarding' },
	planner: { intent: 'create onboarding plan' },
	runtime: { plan: { steps: [] } },
	evaluation: {
		dataset: {
			name: 'rate-limit-dataset',
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

/** The documented policy, written out independently of `SERVICE_CONTRACTS`. */
const EXPECTED_LIMITS: readonly {
	readonly operation: ServiceOperation;
	readonly limit: number;
}[] = [
	{ operation: 'health', limit: 60 },
	{ operation: 'readiness', limit: 60 },
	{ operation: 'version', limit: 60 },
	{ operation: 'search', limit: 30 },
	{ operation: 'planner', limit: 20 },
	{ operation: 'runtime', limit: 10 },
	{ operation: 'evaluation', limit: 5 },
];

const WINDOW_MS = 60_000;
const KEY_A = 'rate-limit-key-a-0123456789';
const KEY_B = 'rate-limit-key-b-abcdefghij';

interface FakeClock {
	now: number;
	advance(ms: number): void;
}

function fakeClock(start = 1_000_000): FakeClock {
	const clock: FakeClock = {
		now: start,
		advance(ms) {
			clock.now += ms;
		},
	};
	return clock;
}

interface MakeAppOptions {
	readonly clock?: FakeClock;
	readonly store?: RateLimitStore;
}

function makeApp(options: MakeAppOptions = {}) {
	const clock = options.clock ?? fakeClock();

	return createApp({
		getRegistry: okRegistry,
		authenticateApiKey: createApiKeyAuthenticator([KEY_A, KEY_B]),
		rateLimiter: createRateLimiter({
			store: options.store ?? createInMemoryRateLimitStore(),
			now: () => clock.now,
		}),
		resolveClientAddress: (request) =>
			request.headers.get('x-test-caller') ?? undefined,
	});
}

type TestApp = ReturnType<typeof makeApp>;

interface SendInit {
	/** Simulated client address for unauthenticated operations. */
	readonly caller?: string;
	/** Bearer key; `null` sends none. Defaults to `KEY_A` on API-key operations. */
	readonly key?: string | null;
}

async function send(app: TestApp, operation: ServiceOperation, init: SendInit = {}) {
	const contract = getServiceContract(operation);
	const isPost = contract.method === 'POST';
	const headers: Record<string, string> = {};

	if (isPost) headers['content-type'] = 'application/json';
	if (init.caller !== undefined) headers['x-test-caller'] = init.caller;

	const key =
		init.key === undefined && contract.authentication === 'api-key'
			? KEY_A
			: init.key;
	if (key !== undefined && key !== null) headers['authorization'] = `Bearer ${key}`;

	const response = await app.handle(
		new Request(`http://localhost${contract.path}`, {
			method: contract.method,
			headers,
			...(isPost ? { body: JSON.stringify(VALID_BODIES[operation]) } : {}),
		}),
	);
	const json = (await response.json()) as ServiceEnvelope<Record<string, unknown>>;

	return { response, json };
}

async function sendMany(
	app: TestApp,
	operation: ServiceOperation,
	count: number,
	init?: SendInit,
) {
	const statuses: number[] = [];

	for (let index = 0; index < count; index += 1) {
		statuses.push((await send(app, operation, init)).response.status);
	}

	return statuses;
}

function callerFor(operation: ServiceOperation, who: 'a' | 'b'): SendInit {
	if (getServiceContract(operation).authentication === 'api-key') {
		return { key: who === 'a' ? KEY_A : KEY_B };
	}

	return { caller: who === 'a' ? 'client-a' : 'client-b' };
}

function expectRateLimited(result: Awaited<ReturnType<typeof send>>, limit: number) {
	expect(result.response.status).toBe(429);
	expect(result.json).toMatchObject({
		success: false,
		error: {
			code: 'BAD_REQUEST',
			message: 'Rate limit exceeded',
			details: { limit, windowSeconds: 60 },
		},
		meta: { apiVersion: 'v1' },
	});
	expect(typeof result.json.meta.requestId).toBe('string');
}

async function withEnv<T>(
	overrides: Record<string, string | undefined>,
	run: () => T | Promise<T>,
): Promise<T> {
	const previous: Record<string, string | undefined> = {};

	for (const [name, value] of Object.entries(overrides)) {
		previous[name] = Bun.env[name];
		if (value === undefined) Reflect.deleteProperty(Bun.env, name);
		else Bun.env[name] = value;
	}

	try {
		return await run();
	} finally {
		for (const [name, value] of Object.entries(previous)) {
			if (value === undefined) Reflect.deleteProperty(Bun.env, name);
			else Bun.env[name] = value;
		}
	}
}

describe('rate limit policy', () => {
	it('matches the documented per-operation limits', () => {
		for (const { operation, limit } of EXPECTED_LIMITS) {
			expect(getServiceContract(operation).rateLimit).toEqual({
				maxRequests: limit,
				windowSeconds: 60,
			});
		}
	});
});

for (const { operation, limit } of EXPECTED_LIMITS) {
	describe(`${operation} (${limit} requests/minute)`, () => {
		it('serves every request up to the limit', async () => {
			const app = makeApp();
			const statuses = await sendMany(
				app,
				operation,
				limit,
				callerFor(operation, 'a'),
			);

			expect(statuses).toEqual(Array.from({ length: limit }, () => 200));
		});

		it('rejects the request that exceeds the limit, and every one after it', async () => {
			const app = makeApp();
			const init = callerFor(operation, 'a');

			await sendMany(app, operation, limit, init);

			const over = await send(app, operation, init);
			expectRateLimited(over, limit);
			expect(over.response.headers.get('retry-after')).toBe('60');
			expect(over.response.headers.get('x-request-id')).toBe(
				over.json.meta.requestId ?? null,
			);

			expect(await sendMany(app, operation, 3, init)).toEqual([429, 429, 429]);
		});

		it('starts a fresh window after the old one ends', async () => {
			const clock = fakeClock();
			const app = makeApp({ clock });
			const init = callerFor(operation, 'a');

			await sendMany(app, operation, limit, init);
			expect((await send(app, operation, init)).response.status).toBe(429);

			clock.advance(10_000);
			const waiting = await send(app, operation, init);
			expect(waiting.response.status).toBe(429);
			expect(waiting.response.headers.get('retry-after')).toBe('50');

			clock.advance(WINDOW_MS - 10_000 - 1);
			const almost = await send(app, operation, init);
			expect(almost.response.status).toBe(429);
			expect(almost.response.headers.get('retry-after')).toBe('1');

			clock.advance(1);
			expect(await sendMany(app, operation, limit, init)).toEqual(
				Array.from({ length: limit }, () => 200),
			);
			expect((await send(app, operation, init)).response.status).toBe(429);
		});

		it('keeps separate counters for each caller', async () => {
			const app = makeApp();

			await sendMany(app, operation, limit, callerFor(operation, 'a'));
			expect(
				(await send(app, operation, callerFor(operation, 'a'))).response.status,
			).toBe(429);

			expect(
				await sendMany(app, operation, limit, callerFor(operation, 'b')),
			).toEqual(Array.from({ length: limit }, () => 200));
		});
	});
}

describe('caller identity', () => {
	it('does not let one unauthenticated client use up another client’s allowance', async () => {
		const app = makeApp();

		await sendMany(app, 'search', 30, { caller: 'client-a' });

		expect((await send(app, 'search', { caller: 'client-a' })).response.status).toBe(
			429,
		);
		expect((await send(app, 'search', { caller: 'client-b' })).response.status).toBe(
			200,
		);
		expect((await send(app, 'search')).response.status).toBe(200);
	});

	it('gives each API key its own counters even from the same address', async () => {
		const app = makeApp();

		await sendMany(app, 'evaluation', 5, { key: KEY_A, caller: 'shared-proxy' });

		expect(
			(await send(app, 'evaluation', { key: KEY_A, caller: 'shared-proxy' }))
				.response.status,
		).toBe(429);
		expect(
			(await send(app, 'evaluation', { key: KEY_B, caller: 'shared-proxy' }))
				.response.status,
		).toBe(200);
	});

	it('counts one API key as one caller wherever it connects from', async () => {
		const app = makeApp();

		await sendMany(app, 'evaluation', 5, { key: KEY_A, caller: 'address-x' });

		expect(
			(await send(app, 'evaluation', { key: KEY_A, caller: 'address-y' })).response
				.status,
		).toBe(429);
	});
});

describe('operation isolation (no global counter)', () => {
	it('keeps the same caller’s operations independent', async () => {
		const app = makeApp();

		await sendMany(app, 'evaluation', 5, { key: KEY_A });
		expect((await send(app, 'evaluation', { key: KEY_A })).response.status).toBe(429);

		expect((await send(app, 'runtime', { key: KEY_A })).response.status).toBe(200);
		expect((await send(app, 'health', { caller: 'client-a' })).response.status).toBe(
			200,
		);
	});

	it('does not share the health, readiness, and version allowances', async () => {
		const app = makeApp();
		const init = { caller: 'client-a' };

		await sendMany(app, 'health', 60, init);
		expect((await send(app, 'health', init)).response.status).toBe(429);

		expect((await send(app, 'readiness', init)).response.status).toBe(200);
		expect((await send(app, 'version', init)).response.status).toBe(200);
	});
});

describe('authentication ordering', () => {
	it('does not count rejected keys against anyone', async () => {
		const app = makeApp();

		const rejected = await sendMany(app, 'evaluation', 8, { key: 'wrong-key' });
		expect(rejected).toEqual(Array.from({ length: 8 }, () => 401));

		expect(await sendMany(app, 'evaluation', 5, { key: KEY_A })).toEqual([
			200, 200, 200, 200, 200,
		]);
		expect((await send(app, 'evaluation', { key: KEY_A })).response.status).toBe(429);
	});

	it('still answers 401, not 429, for bad credentials once a real key is limited', async () => {
		const app = makeApp();

		await sendMany(app, 'evaluation', 5, { key: KEY_A });
		expect((await send(app, 'evaluation', { key: KEY_A })).response.status).toBe(429);

		expect(
			(await send(app, 'evaluation', { key: 'wrong-key' })).response.status,
		).toBe(401);
		expect((await send(app, 'evaluation', { key: null })).response.status).toBe(401);
	});
});

describe('store failures', () => {
	it('fails closed with 503 when the store throws, without leaking its error', async () => {
		const store: RateLimitStore = {
			hit() {
				throw new Error(
					'connect ECONNREFUSED redis://user:hunter2@10.0.0.5:6379',
				);
			},
		};
		const app = makeApp({ store });

		for (const { operation } of EXPECTED_LIMITS) {
			const result = await send(app, operation, callerFor(operation, 'a'));

			expect(result.response.status).toBe(503);
			expect(result.json).toMatchObject({
				success: false,
				error: {
					code: 'SERVICE_UNAVAILABLE',
					message: 'Rate limiting is unavailable',
				},
			});
			expect(JSON.stringify(result.json)).not.toContain('hunter2');
		}
	});

	it('fails closed when an asynchronous store rejects', async () => {
		const store: RateLimitStore = {
			hit: async () => {
				throw new Error('timeout');
			},
		};
		const result = await send(makeApp({ store }), 'health', { caller: 'client-a' });

		expect(result.response.status).toBe(503);
	});

	it('fails closed when the in-memory store is full, and recovers once windows expire', async () => {
		const clock = fakeClock();
		const app = makeApp({
			clock,
			store: createInMemoryRateLimitStore({ maxEntries: 2 }),
		});

		expect((await send(app, 'health', { caller: 'one' })).response.status).toBe(200);
		expect((await send(app, 'health', { caller: 'two' })).response.status).toBe(200);
		expect((await send(app, 'health', { caller: 'three' })).response.status).toBe(
			503,
		);
		expect((await send(app, 'health', { caller: 'one' })).response.status).toBe(200);

		clock.advance(WINDOW_MS + 1);
		expect((await send(app, 'health', { caller: 'three' })).response.status).toBe(
			200,
		);
	});
});

describe('key hygiene', () => {
	function recordingStore() {
		const keys: string[] = [];
		const inner = createInMemoryRateLimitStore();
		const store: RateLimitStore = {
			hit(key, windowMs, nowMs) {
				keys.push(key);
				return inner.hit(key, windowMs, nowMs);
			},
		};

		return { store, keys };
	}

	it('keys counters by operation and caller without storing raw API keys', async () => {
		const { store, keys } = recordingStore();
		const app = makeApp({ store });

		await send(app, 'runtime', { key: KEY_A });
		await send(app, 'runtime', { key: KEY_B });
		await send(app, 'health', { caller: 'client-a' });

		expect(keys).toHaveLength(3);
		expect(keys[0]).toMatch(/^rl:v1:runtime:key:[0-9a-f]{32}$/);
		expect(keys[1]).toMatch(/^rl:v1:runtime:key:[0-9a-f]{32}$/);
		expect(keys[0]).not.toBe(keys[1]);
		expect(keys[2]).toBe('rl:v1:health:ip:client-a');

		for (const key of keys) {
			expect(key).not.toContain(KEY_A);
			expect(key).not.toContain(KEY_B);
			expect(key.toLowerCase()).not.toContain('bearer');
		}
	});

	it('does not echo the caller or key in a 429 response', async () => {
		const app = makeApp();

		await sendMany(app, 'evaluation', 5, { key: KEY_A });
		const keyed = await send(app, 'evaluation', { key: KEY_A });

		await sendMany(app, 'version', 60, { caller: 'client-a' });
		const open = await send(app, 'version', { caller: 'client-a' });

		expect(keyed.response.status).toBe(429);
		expect(open.response.status).toBe(429);

		const keyedText = JSON.stringify([
			keyed.json,
			[...keyed.response.headers.entries()],
		]);
		const openText = JSON.stringify([
			open.json,
			[...open.response.headers.entries()],
		]);

		expect(keyedText).not.toContain(KEY_A);
		expect(openText).not.toContain('client-a');
	});
});

describe('in-memory store', () => {
	it('counts within a window and starts a new one when it ends', () => {
		const store = createInMemoryRateLimitStore();

		expect(store.hit('k', WINDOW_MS, 0)).toEqual({ count: 1, resetAtMs: WINDOW_MS });
		expect(store.hit('k', WINDOW_MS, 59_999)).toEqual({
			count: 2,
			resetAtMs: WINDOW_MS,
		});
		expect(store.hit('k', WINDOW_MS, WINDOW_MS)).toEqual({
			count: 1,
			resetAtMs: 2 * WINDOW_MS,
		});
	});

	it('keeps keys independent', () => {
		const store = createInMemoryRateLimitStore();

		store.hit('a', WINDOW_MS, 0);
		store.hit('a', WINDOW_MS, 1);

		expect(store.hit('b', WINDOW_MS, 2)).toEqual({
			count: 1,
			resetAtMs: 2 + WINDOW_MS,
		});
	});
});

describe('rate limiter', () => {
	it('reports remaining allowance and never lets it go negative', async () => {
		const limiter = createRateLimiter({
			store: createInMemoryRateLimitStore(),
			now: () => 0,
		});

		const first = await limiter.check('evaluation', 'caller');
		expect(first).toMatchObject({
			allowed: true,
			limit: 5,
			windowSeconds: 60,
			remaining: 4,
		});

		for (let index = 0; index < 4; index += 1)
			await limiter.check('evaluation', 'caller');

		expect(await limiter.check('evaluation', 'caller')).toMatchObject({
			allowed: false,
			remaining: 0,
		});
	});
});

describe('client address resolver', () => {
	const server = (address: string | null) => ({
		requestIP: () => (address === null ? null : { address }),
	});
	const request = (headers: Record<string, string> = {}) =>
		new Request('http://localhost/api/v1/health', { headers });

	it('uses the socket address', () => {
		const resolve = createClientAddressResolver();

		expect(resolve(request(), server('203.0.113.7'))).toBe('203.0.113.7');
		expect(resolve(request(), server('2001:DB8::1'))).toBe('2001:db8::1');
	});

	it('ignores forwarding headers unless a trusted header is configured', () => {
		const resolve = createClientAddressResolver();

		expect(
			resolve(
				request({ 'x-forwarded-for': '198.51.100.99' }),
				server('203.0.113.7'),
			),
		).toBe('203.0.113.7');
	});

	it('uses the last entry of the trusted header', () => {
		const resolve = createClientAddressResolver({ trustedHeader: 'X-Forwarded-For' });

		expect(
			resolve(
				request({ 'x-forwarded-for': '198.51.100.99, 192.0.2.4, 203.0.113.9' }),
				server('10.0.0.1'),
			),
		).toBe('203.0.113.9');
	});

	it('falls back to the socket address when the trusted header is missing or malformed', () => {
		const resolve = createClientAddressResolver({ trustedHeader: 'x-forwarded-for' });

		expect(resolve(request(), server('10.0.0.1'))).toBe('10.0.0.1');
		expect(
			resolve(request({ 'x-forwarded-for': 'bad value!' }), server('10.0.0.1')),
		).toBe('10.0.0.1');
	});

	it('returns undefined when the caller cannot be identified', () => {
		const resolve = createClientAddressResolver();

		expect(resolve(request(), server(null))).toBeUndefined();
		expect(resolve(request(), undefined)).toBeUndefined();
	});
});

describe('server integration (real socket)', () => {
	it('limits by the socket address with the default resolver', async () => {
		const app = createApp({
			getRegistry: okRegistry,
			rateLimiter: createRateLimiter({ store: createInMemoryRateLimitStore() }),
		}).listen(0);

		try {
			const url = `http://127.0.0.1:${app.server?.port}/api/v1/version`;
			const statuses: number[] = [];

			for (let index = 0; index < 61; index += 1) {
				statuses.push((await fetch(url)).status);
			}

			expect(statuses.slice(0, 60)).toEqual(Array.from({ length: 60 }, () => 200));
			expect(statuses[60]).toBe(429);
		} finally {
			await app.stop(true);
		}
	});

	it('separates callers by a trusted proxy header', async () => {
		const app = createApp({
			getRegistry: okRegistry,
			rateLimiter: createRateLimiter({ store: createInMemoryRateLimitStore() }),
			resolveClientAddress: createClientAddressResolver({
				trustedHeader: 'x-forwarded-for',
			}),
		}).listen(0);

		try {
			const url = `http://127.0.0.1:${app.server?.port}/api/v1/version`;
			const as = (address: string) =>
				fetch(url, { headers: { 'x-forwarded-for': address } });

			for (let index = 0; index < 60; index += 1) await as('203.0.113.1');

			expect((await as('203.0.113.1')).status).toBe(429);
			expect((await as('203.0.113.2')).status).toBe(200);
		} finally {
			await app.stop(true);
		}
	});
});

describe('configuration', () => {
	async function allowed(
		limiter: ReturnType<typeof createRateLimiterFromEnv>,
		count: number,
	) {
		const decisions = [];

		for (let index = 0; index < count; index += 1) {
			decisions.push((await limiter.check('health', 'caller')).allowed);
		}

		return decisions;
	}

	it('defaults to an enforcing in-memory limiter outside production', async () => {
		const decisions = await allowed(
			createRateLimiterFromEnv({ NODE_ENV: 'development' }),
			61,
		);

		expect(decisions.slice(0, 60).every(Boolean)).toBe(true);
		expect(decisions[60]).toBe(false);
	});

	it('accepts an explicit memory store, ignoring case and whitespace', async () => {
		for (const env of [
			{ HR_SKILLS_RATE_LIMIT_STORE: 'memory' },
			{ HR_SKILLS_RATE_LIMIT_STORE: ' Memory ', NODE_ENV: 'production' },
		]) {
			const decisions = await allowed(createRateLimiterFromEnv(env), 61);
			expect(decisions[60]).toBe(false);
		}
	});

	it('refuses to start in production without an explicit store', () => {
		for (const env of [
			{ NODE_ENV: 'production' },
			{ NODE_ENV: 'production', HR_SKILLS_RATE_LIMIT_STORE: '' },
			{ NODE_ENV: 'production', HR_SKILLS_RATE_LIMIT_STORE: '   ' },
		]) {
			expect(() => createRateLimiterFromEnv(env)).toThrow(RateLimitConfigError);
			expect(() => createRateLimiterFromEnv(env)).toThrow(
				/HR_SKILLS_RATE_LIMIT_STORE.*NODE_ENV=production/,
			);
		}
	});

	it('rejects an unsupported store in every environment', () => {
		for (const env of [
			{ HR_SKILLS_RATE_LIMIT_STORE: 'redis' },
			{ NODE_ENV: 'production', HR_SKILLS_RATE_LIMIT_STORE: 'redis' },
		]) {
			expect(() => createRateLimiterFromEnv(env)).toThrow(RateLimitConfigError);
			expect(() => createRateLimiterFromEnv(env)).toThrow(
				/Unsupported HR_SKILLS_RATE_LIMIT_STORE/,
			);
		}
	});

	it('validates the trusted client address header name', () => {
		expect(() =>
			createClientAddressResolverFromEnv({
				HR_SKILLS_CLIENT_IP_HEADER: 'bad header',
			}),
		).toThrow(RateLimitConfigError);

		const resolve = createClientAddressResolverFromEnv({
			HR_SKILLS_CLIENT_IP_HEADER: 'cf-connecting-ip',
		});
		const request = new Request('http://localhost/', {
			headers: { 'cf-connecting-ip': '203.0.113.5' },
		});

		expect(resolve(request, null)).toBe('203.0.113.5');
	});

	it('makes createApp throw in production unless a limiter is configured or injected', async () => {
		await withEnv(
			{ NODE_ENV: 'production', HR_SKILLS_RATE_LIMIT_STORE: undefined },
			() => {
				expect(() => createApp({ getRegistry: okRegistry })).toThrow(
					RateLimitConfigError,
				);

				expect(() =>
					createApp({
						getRegistry: okRegistry,
						rateLimiter: createRateLimiter({
							store: createInMemoryRateLimitStore(),
						}),
					}),
				).not.toThrow();
			},
		);

		await withEnv(
			{ NODE_ENV: 'production', HR_SKILLS_RATE_LIMIT_STORE: 'memory' },
			() => {
				expect(() => createApp({ getRegistry: okRegistry })).not.toThrow();
			},
		);
	});

	it('never leaves createApp without rate limiting by default', async () => {
		await withEnv(
			{ NODE_ENV: 'test', HR_SKILLS_RATE_LIMIT_STORE: undefined },
			async () => {
				const app = createApp({ getRegistry: okRegistry });
				const statuses: number[] = [];

				for (let index = 0; index < 61; index += 1) {
					const response = await app.handle(
						new Request('http://localhost/api/v1/version'),
					);
					statuses.push(response.status);
				}

				expect(statuses[59]).toBe(200);
				expect(statuses[60]).toBe(429);
			},
		);
	});
});
