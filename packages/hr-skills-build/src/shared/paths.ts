import { join } from 'node:path';

import { ROOT_DIR } from 'skills-ref';

/**
 * Node-only filesystem path constants.
 *
 * This module imports `node:path` and is therefore part of the **server**
 * surface only (`hr-skills-build` / `hr-skills-build/server`). It must never
 * be re-exported from `index.client.ts` or `shared/index.client.ts` — doing
 * so would break bundling for browser consumers (e.g. the Phase 7 web UI),
 * exactly like `../constants.js` used to before this split.
 */

/** Absolute path to the `eval/` directory inside `hr-skills-build`. */
const EVAL_DIR = join(__dirname, '..', '..', 'eval');

/** Absolute path to the `eval/datasets/` directory containing hand-authored evaluation cases. */
export const EVAL_DATASETS_DIR = join(EVAL_DIR, 'datasets');

/** Absolute path to the `eval/golden/` directory containing committed golden fixtures. */
export const EVAL_GOLDEN_DIR = join(EVAL_DIR, 'golden');

/** Absolute path to the generated relevance-signals artifact at the repo root. */
export const RELEVANCE_SIGNALS_PATH = join(
	ROOT_DIR,
	'registry',
	'relevance-signals.json',
);
