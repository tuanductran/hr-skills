import { describe, expect, it } from 'bun:test';
import type { ServiceLogEvent } from '../../src/server/operations/index.js';
import {
	createEvaluationCache,
	createRegistryCache,
	createServiceMetrics,
	createStructuredLogger,
	getReadinessService,
} from '../../src/server/operations/index.js';

describe('Phase 8.3 operational concerns', () => {
	it('invalidates cached artifacts when their source version changes', () => {
		const cache = createRegistryCache<{ skills: number }>();
		cache.set('registry', 'generated-at-1', { skills: 146 });

		expect(cache.get('registry', 'generated-at-1')).toEqual({ skills: 146 });
		expect(cache.get('registry', 'generated-at-2')).toBeUndefined();
		expect(cache.size).toBe(1);
		cache.invalidate('registry');
		expect(cache.size).toBe(0);
	});

	it('keeps evaluation artifacts in a separate cache', () => {
		const registryCache = createRegistryCache<string>();
		const evaluationCache = createEvaluationCache<string>();
		registryCache.set('artifact', 'v1', 'registry');
		evaluationCache.set('artifact', 'v1', 'evaluation');

		expect(registryCache.get('artifact', 'v1')).toBe('registry');
		expect(evaluationCache.get('artifact', 'v1')).toBe('evaluation');
	});

	it('emits structured logs and deterministic metric snapshots', () => {
		const events: ServiceLogEvent[] = [];
		const logger = createStructuredLogger(
			(event) => events.push(event),
			() => '2026-09-10T00:00:00.000Z',
		);
		const metrics = createServiceMetrics();

		logger.info('service.request.completed', {
			operation: 'search',
			durationMs: 12,
		});
		metrics.increment('service.requests');
		metrics.increment('service.requests', 2);

		expect(events[0]).toMatchObject({
			level: 'info',
			event: 'service.request.completed',
			timestamp: '2026-09-10T00:00:00.000Z',
			operation: 'search',
			durationMs: 12,
		});
		expect(metrics.snapshot()).toEqual({
			counters: { 'service.requests': 3 },
		});
	});

	it('returns a normalized unavailable response for failed readiness checks', async () => {
		const response = await getReadinessService([
			{ name: 'registry', check: () => true },
			{ name: 'cache', check: () => false },
		]);

		expect(response.success).toBe(false);
		if (!response.success) {
			expect(response.error.code).toBe('SERVICE_UNAVAILABLE');
			expect(response.meta.apiVersion).toBe('v1');
		}
	});

	it('treats an empty cache as a cold start and rejects stale versions', () => {
		const cache = createRegistryCache<string>();

		expect(cache.size).toBe(0);
		expect(cache.get('registry', 'v1')).toBeUndefined();

		cache.set('registry', 'v1', 'artifact-v1');

		expect(cache.get('registry', 'v1')).toBe('artifact-v1');
		expect(cache.get('registry', 'v2')).toBeUndefined();
	});

	it('supports explicit cache invalidation and reset of metrics', () => {
		const cache = createRegistryCache<string>();
		cache.set('registry', 'v1', 'artifact');

		expect(cache.invalidate('registry')).toBe(true);
		expect(cache.invalidate('registry')).toBe(false);
		expect(cache.size).toBe(0);

		const metrics = createServiceMetrics();
		metrics.increment('service.requests', 2);
		metrics.reset();

		expect(metrics.snapshot()).toEqual({ counters: {} });
	});

	it('tracks readiness transitions and normalizes dependency exceptions', async () => {
		const ready = await getReadinessService([
			{ name: 'registry', check: () => true },
		]);

		expect(ready.success).toBe(true);
		if (ready.success) {
			expect(ready.data.status).toBe('ready');
			expect(ready.data.checks).toEqual([
			{ name: 'registry', status: 'ready' },
		]);
		}

		const failed = await getReadinessService([
			{ name: 'registry', check: () => { throw new Error('registry unavailable'); } },
		]);

		expect(failed.success).toBe(false);
		if (!failed.success) {
			expect(failed.error.code).toBe('SERVICE_UNAVAILABLE');
			expect(failed.error.details).toMatchObject({
			checks: [
				{
					name: 'registry',
					status: 'not_ready',
					message: 'registry unavailable',
				},
			],
		});
		}
	});

});
