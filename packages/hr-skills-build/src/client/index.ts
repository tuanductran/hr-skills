/**
 * Browser-safe public surface for `hr-skills-build/client`.
 *
 * This entrypoint contains only pure planner, runtime, search, service schema,
 * and shared APIs. It never imports filesystem-backed or other Node-only code.
 */
export type * from './docs/types.js';
export * from './planner/index.js';
export * from './runtime/index.js';
export * from './search/index.js';
export * from './service/index.client.js';
export * from './shared/index.client.js';
