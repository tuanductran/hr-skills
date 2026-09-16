/**
 * Browser-safe subset of `shared/`.
 *
 * Excludes `helpers.js` (uses `node:fs/promises`, `node:path`) and
 * `paths.js` (uses `node:path`). Everything exported here is pure
 * TypeScript/regex/schema logic and safe to bundle for the browser
 * (e.g. the Phase 7 web UI).
 */
export * from './constants.js';
export * from './parser.js';
export * from './schema.js';
export * from './types.js';
