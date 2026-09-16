import { describe, expect, it } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const SHARED_DIR = join(import.meta.dirname, '../src/shared');

/**
 * Matches an actual `import`/`require`/dynamic-`import()` of a `node:`
 * built-in — not prose that merely mentions `node:fs` in a comment.
 */
const NODE_IMPORT_PATTERN = /(?:from\s+|require\()\s*["']node:/;

async function collectTsFiles(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = join(dir, entry.name);
			if (entry.isDirectory()) return collectTsFiles(fullPath);
			return entry.name.endsWith('.ts') ? [fullPath] : [];
		}),
	);
	return files.flat();
}

/**
 * `src/shared/` is re-exported from both `client/` (browser-safe) and
 * `server/` entrypoints, so it must never depend on Node.js built-ins.
 * `scripts/verify-client-bundle.ts` catches this too, but only after a
 * full `tsdown` build — this test catches it immediately at the source
 * level, without needing to build first.
 */
describe('src/shared/ Node.js import boundary', () => {
	it('contains no Node.js built-in imports', async () => {
		const files = await collectTsFiles(SHARED_DIR);
		expect(files.length).toBeGreaterThan(0);

		const violations: string[] = [];
		for (const file of files) {
			const source = await readFile(file, 'utf8');
			if (NODE_IMPORT_PATTERN.test(source)) {
				violations.push(file.replace(`${SHARED_DIR}/`, 'src/shared/'));
			}
		}

		expect(violations).toEqual([]);
	});
});
