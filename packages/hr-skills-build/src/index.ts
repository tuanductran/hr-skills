/**
 * Public library surface for `hr-skills-build`.
 *
 * This barrel exists so downstream consumers (Phase 7 web UI / API layer,
 * or any future service) can do:
 *
 *   import { buildRegistry, searchSkills, executeWorkflow } from 'hr-skills-build';
 *
 * instead of reaching into individual `src/**\/*.ts` files or shelling out to
 * the CLI scripts under `src/cli/` and `src/build/`.
 *
 * `src/cli/*` and `src/build/*` are intentionally NOT re-exported here: they
 * are process-entry scripts (parse argv, print to stdout, call
 * `process.exit`) rather than importable library functions. Domain logic
 * they depend on lives in the modules below.
 */

export * from './evaluation/index.js';
export * from './planner/index.js';
export * from './registry/index.js';
export * from './runtime/index.js';
export * from './search/index.js';
export * from './shared/index.js';
export * from './validation/index.js';
