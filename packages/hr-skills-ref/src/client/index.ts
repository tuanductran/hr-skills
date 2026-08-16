/**
 * Browser-safe surface for `hr-skills-ref/client`.
 *
 * This entrypoint contains parsing, schema, model, and pure transformation APIs.
 * It never imports `node:fs`, `node:path`, or process-derived workspace paths.
 */

export * from '../errors.js';
export * from '../models.js';
export * from '../parser.js';
export * from '../schema.js';
export * from './constants.js';
export * from './helpers.js';
