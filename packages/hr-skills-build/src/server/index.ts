/**
 * Explicit Node/Bun server surface for `hr-skills-build/server`.
 *
 * This surface includes filesystem-backed registry, validation, evaluation,
 * documentation loading, and other APIs that must not enter browser bundles.
 *
 * Every export here is deliberate package API. Internal implementation
 * (test fixtures, stub/demo helpers) lives under `server/internal/` and is
 * re-exported individually below only when a real external consumer
 * (typically a CLI command in `packages/hr-skills/src/cli/`) depends on it.
 */
export * from './docs/index.js';
export * from './evaluation/index.js';
export * from './filesystem/index.js';
export * from './operations/index.js';
export * from './planner/index.js';
export * from './registry/index.js';
export * from './runtime/index.js';
export * from './search/index.js';
export * from './service/index.js';
export * from './shared/index.js';
export * from './validation/index.js';
