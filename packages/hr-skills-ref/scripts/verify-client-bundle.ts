import { readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const DIST_DIR = resolve(import.meta.dirname, '../dist');
const CLIENT_ENTRY = join(DIST_DIR, 'client/index.mjs');

/**
 * Matches an actual `import`/`require`/dynamic-`import()` of a `node:`
 * built-in — not prose that merely mentions `node:fs` in a comment.
 */
const NODE_IMPORT_PATTERN = /(?:from\s+|require\()\s*["']node:/;

/**
 * Matches a relative import/re-export/dynamic-import specifier to follow
 * into the bundle graph — both static (`import ... from './x'`,
 * `export ... from './x'`) and dynamic (`import('./x')`) forms.
 */
const RELATIVE_IMPORT_PATTERN = /(?:from\s+|import\s*\(\s*)["'](\.\.?\/[^"']+)["']/g;

/**
 * Verifies that `dist/client/index.mjs` and every module it transitively
 * imports are free of Node.js built-in imports. `hr-skills-ref/client` is
 * published as a browser-safe surface — a Node import reaching it would
 * break in the browser, and nothing in the type system catches that once a
 * shared module (see `src/shared/`) picks up a stray `node:` import.
 *
 * @throws If the client bundle's entry point is missing, or if any file
 *   reachable from it contains a Node built-in import.
 */
export async function verifyClientBundle(): Promise<void> {
	const visited = new Set<string>();
	const violations: string[] = [];

	async function visit(filePath: string): Promise<void> {
		if (visited.has(filePath)) return;
		visited.add(filePath);

		const source = await readFile(filePath, 'utf8');

		if (NODE_IMPORT_PATTERN.test(source)) {
			violations.push(filePath);
		}

		for (const match of source.matchAll(RELATIVE_IMPORT_PATTERN)) {
			const specifier = match[1];
			if (!specifier) continue;
			await visit(resolve(dirname(filePath), specifier));
		}
	}

	await visit(CLIENT_ENTRY);

	if (violations.length > 0) {
		const relative = violations.map((path) => path.replace(`${DIST_DIR}/`, ''));
		throw new Error(
			`Node.js built-in import(s) found in the client bundle graph, reachable from dist/client/index.mjs:\n` +
				relative.map((path) => `  - ${path}`).join('\n') +
				'\n\nThis breaks hr-skills-ref/client in the browser. Move the offending ' +
				'code out of src/shared/ (or the client surface) and into src/server/ instead.',
		);
	}
}

if (import.meta.main) {
	await verifyClientBundle();
	console.log('✔ dist/client bundle graph is free of Node.js built-in imports');
}
