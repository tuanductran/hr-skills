/**
 * Thin, browser-unsafe-free compatibility wrappers around the canonical
 * `src/shared/` implementation. Pure re-exports only — this directory does
 * not own any implementation of its own; Node-only or filesystem-backed
 * logic lives under `server/filesystem/`, `server/registry/`, etc. instead.
 */
export * from './constants.js';
export * from './parser.js';
export * from './schema.js';
export * from './types.js';
