/**
 * Elysia application factory for the HR Skills hosted HTTP adapter.
 *
 * This is the Phase 8.4 scaffold only: it constructs and returns an Elysia
 * instance without binding a port, so it can be started by `src/index.ts` or
 * imported directly in tests via `.handle()` / `Eden Treaty`.
 *
 * Routes, authentication, rate limiting, and the versioned response envelope
 * described in `docs/engineering/platform-integration.md` are intentionally
 * out of scope here and land in a later Phase 8.4 change.
 */

import { Elysia } from 'elysia';

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
export function createApp() {
	return new Elysia().get('/', () => 'ok');
}
