/**
 * Browser-safe public surface for `hr-skills-build`.
 *
 * Import this from `hr-skills-build/client` instead of the package root
 * whenever the consumer runs in a non-Node environment (browser bundle,
 * edge runtime, etc.) — for example the Phase 7 web UI (registry explorer,
 * skill graph, planner playground). It never touches `node:fs`, `node:path`,
 * or `node:child_process`, so bundlers won't choke trying to resolve them.
 *
 * Modules intentionally NOT re-exported here (all Node-only — use the
 * package root `hr-skills-build` / `hr-skills-build/server` instead):
 *   - shared/helpers.js, shared/paths.js  (node:fs, node:path)
 *   - evaluation/evaluation-datasets.js   (reads eval/ fixtures from disk)
 *   - registry/registry.js, registry/discovery.js (filesystem-backed)
 *   - validation/*                        (reads skills/ from disk)
 *   - build/*, cli/*                      (process-entry scripts)
 */

export type * from './docs/types.js';
export * from './planner/index.js';
export * from './runtime/index.js';
export * from './search/index.js';
export * from './shared/index.client.js';
