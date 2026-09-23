/**
 * Server entrypoint.
 *
 * Only responsible for starting the Elysia app built by `createApp()`. Port
 * binding lives here, not in `app.ts`, so `createApp()` stays safe to import
 * without side effects.
 */

import { createApp } from './app.ts';

const port = Number(Bun.env['PORT'] ?? 3001);

const app = createApp();

app.listen(port, () => {
	console.log(`hr-skills-api listening on http://localhost:${port}`);
});
