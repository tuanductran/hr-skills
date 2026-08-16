/**
 * Public library surface for `hr-skills-build`.
 *
 * This barrel exists so downstream consumers (Phase 7 web UI / API layer,
 * or any future service) can do:
 *
 *   import { buildRegistry, searchSkills, executeWorkflow } from 'hr-skills-build/server';
 *
 * instead of reaching into individual `src/**\/*.ts` files or shelling out to
 * the CLI scripts under `src/cli/` and `src/build/`.
 *
 * `src/cli/*` and `src/build/*` are intentionally NOT re-exported here: they
 * are process-entry scripts (parse argv, print to stdout, call
 * `process.exit`) rather than importable library functions. Domain logic
 * they depend on lives in the modules below.
 *
 * This is the **server** surface: it transitively imports `node:fs`,
 * `node:path`, etc. (via `shared/helpers.js`, `shared/paths.js`,
 * `registry/*`, `validation/*`, `evaluation/evaluation-datasets.js`) and
 * will fail to bundle in a browser. For browser-safe consumers (Phase 7
 * web UI, or any client bundle), import from `hr-skills-build/client`
 * instead, which re-exports only `planner`, `runtime`, `search`, and the
 * pure parts of `shared` — see `./index.client.ts`.
 */

export * from './server/index.js';
