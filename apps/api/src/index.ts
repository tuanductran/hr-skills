/**
 * Server entrypoint.
 *
 * Only responsible for starting the Elysia app built by `createApp()`. Port
 * binding lives here, not in `app.ts`, so `createApp()` stays safe to import
 * without side effects.
 *
 * Logging: every event, including startup and configuration warnings, is written as
 * one JSON line through the structured logger from `hr-skills-build/server`
 * (`info` to stdout, `warn` and `error` to stderr). Request events carry the request
 * ID returned to the caller. See `http/observability.ts` for what is, and is never,
 * recorded.
 *
 * API keys for `runtime` and `evaluation` come from `HR_SKILLS_API_KEYS` (a
 * comma-separated list, injected by the deployment secret manager). When it is
 * empty, those two routes fail closed with `503 SERVICE_UNAVAILABLE` and
 * `GET /api/v1/ready` reports the `api-keys` check as not ready.
 *
 * Rate limiting is always on. `HR_SKILLS_RATE_LIMIT_STORE` selects the store and is
 * mandatory in production; a missing or unsupported value stops startup with a
 * clear error (see `http/rate-limit-config.ts`).
 *
 * Metrics counters are kept in process. Set `HR_SKILLS_METRICS_LOG_INTERVAL_SECONDS`
 * (1 to 86400) to also log their cumulative values periodically.
 */

import { createApp } from './app.ts';
import { createApiKeyAuthenticator, parseApiKeys } from './http/auth.ts';
import {
	createJsonLogSink,
	createObservability,
	logMetricsSnapshot,
	parseSnapshotIntervalSeconds,
} from './http/observability.ts';
import {
	isProduction,
	RATE_LIMIT_STORE_ENV,
	RateLimitConfigError,
} from './http/rate-limit-config.ts';

const METRICS_INTERVAL_ENV = 'HR_SKILLS_METRICS_LOG_INTERVAL_SECONDS';

const port = Number(Bun.env['PORT'] ?? 3001);

const observability = createObservability({ logSink: createJsonLogSink() });
const { logger } = observability;

const apiKeys = parseApiKeys(Bun.env['HR_SKILLS_API_KEYS']);

if (apiKeys.length === 0) {
	logger.warn('server.config.api_keys_missing', {
		details: {
			variable: 'HR_SKILLS_API_KEYS',
			effect: 'runtime and evaluation respond 503 and readiness reports api-keys as not_ready',
		},
	});
}

if (
	isProduction(Bun.env) &&
	Bun.env[RATE_LIMIT_STORE_ENV]?.trim().toLowerCase() === 'memory'
) {
	logger.warn('server.config.rate_limit_store_memory', {
		details: {
			variable: RATE_LIMIT_STORE_ENV,
			effect: 'counters are per process; limits are only correct for a single instance',
		},
	});
}

function start() {
	try {
		return createApp({
			observability,
			...(apiKeys.length > 0
				? { authenticateApiKey: createApiKeyAuthenticator(apiKeys) }
				: {}),
		});
	} catch (error) {
		if (error instanceof RateLimitConfigError) {
			logger.error('server.config.invalid', {
				details: { message: error.message },
			});
			process.exit(1);
		}

		throw error;
	}
}

const app = start();

app.listen(port, () => {
	logger.info('server.started', { details: { port } });
});

const rawInterval = Bun.env[METRICS_INTERVAL_ENV];
const snapshotSeconds = parseSnapshotIntervalSeconds(rawInterval);

if (snapshotSeconds !== undefined) {
	// unref: the periodic log must not keep the process alive on its own.
	setInterval(() => logMetricsSnapshot(observability), snapshotSeconds * 1000).unref();
} else if (rawInterval !== undefined && rawInterval.trim() !== '') {
	logger.warn('server.config.metrics_interval_invalid', {
		details: {
			variable: METRICS_INTERVAL_ENV,
			effect: 'periodic metrics snapshots are disabled; expected a whole number from 1 to 86400',
		},
	});
}
