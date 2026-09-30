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
 */

import { createApp } from './app.ts';
import { createApiKeyAuthenticator, parseApiKeys } from './http/auth.ts';

const port = Number(Bun.env['PORT'] ?? 3001);

const apiKeys = parseApiKeys(Bun.env['HR_SKILLS_API_KEYS']);

if (apiKeys.length === 0) {
	console.warn(
		'HR_SKILLS_API_KEYS is not set: runtime and evaluation will respond 503 until it is configured',
	);
}

const app = createApp(
	apiKeys.length > 0 ? { authenticateApiKey: createApiKeyAuthenticator(apiKeys) } : {},
);

app.listen(port, () => {
	console.log(`hr-skills-api listening on http://localhost:${port}`);
});
