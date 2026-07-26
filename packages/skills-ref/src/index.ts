/**
 * Public API for the `skills-ref` package.
 *
 * Re-exports the three main entry points:
 *  - {@link readProperties} — read and validate skill frontmatter from disk.
 *  - {@link toPrompt}       — render skill directories as an XML system-prompt block.
 *  - {@link validate}       — validate a skill directory against all core rules.
 */
export { readProperties } from './loader.js';
export { toPrompt } from './prompt.js';
export { validate } from './validator.js';
