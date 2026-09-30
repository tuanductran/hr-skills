/**
 * Server entrypoint.
 *
 * Only responsible for starting the Elysia app built by `createApp()`. Port
 * binding lives here, not in `app.ts`, so `createApp()` stays safe to import
 * without side effects.
 *
 * API keys for `runtime` and `evaluation` come from `HR_SKILLS_API_KEYS` (a
 * comma-separated list, injected by the deployment secret manager). When it is
 * empty, those two routes fail closed with `503 SERVICE_UNAVAILABLE`.
 *
 * Rate limiting is always on. `HR_SKILLS_RATE_LIMIT_STORE` selects the store and is
 * mandatory in production; a missing or unsupported value stops startup with a
 * clear error (see `http/rate-limit-config.ts`).
 */

import { createApp } from './app.ts';
import { createApiKeyAuthenticator, parseApiKeys } from './http/auth.ts';
import {
	isProduction,
	RATE_LIMIT_STORE_ENV,
	RateLimitConfigError,
} from './http/rate-limit-config.ts';

const port = Number(Bun.env['PORT'] ?? 3001);

const apiKeys = parseApiKeys(Bun.env['HR_SKILLS_API_KEYS']);

if (apiKeys.length === 0) {
	console.warn(
		'HR_SKILLS_API_KEYS is not set: runtime and evaluation will respond 503 until it is configured',
	);
}

if (
	isProduction(Bun.env) &&
	Bun.env[RATE_LIMIT_STORE_ENV]?.trim().toLowerCase() === 'memory'
) {
	console.warn(
		`${RATE_LIMIT_STORE_ENV}=memory keeps counters per process: limits are only correct for a single instance`,
	);
}

function start() {
	try {
		return createApp(
			apiKeys.length > 0
				? { authenticateApiKey: createApiKeyAuthenticator(apiKeys) }
				: {},
		);
	} catch (error) {
		if (error instanceof RateLimitConfigError) {
			console.error(`Configuration error: ${error.message}`);
			process.exit(1);
		}

		throw error;
	}
}

const app = start();

app.listen(port, () => {
	console.log(`hr-skills-api listening on http://localhost:${port}`);
});
