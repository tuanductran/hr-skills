import { describe, expect, it } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const SRC_DIR = join(import.meta.dirname, '../src');
const CLIENT_DIR = join(SRC_DIR, 'client');
const SERVER_DIR = join(SRC_DIR, 'server');

/**
 * Matches a relative import/re-export specifier (static or dynamic) so its
 * target can be resolved and checked against the forbidden directory.
 */
const RELATIVE_IMPORT_PATTERN = /(?:from\s+|import\s*\(\s*)["'](\.\.?\/[^"']+)["']/g;

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
 * Collect every relative import in `file` that resolves to a path inside
 * `forbiddenDir` (given as a `path.resolve`-style absolute directory).
 */
function findImportsInto(
	source: string,
	filePath: string,
	forbiddenDir: string,
): string[] {
	const hits: string[] = [];

	for (const match of source.matchAll(RELATIVE_IMPORT_PATTERN)) {
		const specifier = match[1];
		if (!specifier) continue;

		// Resolve relative to the importing file's directory, same as Node/bundler resolution.
		const resolved = new URL(specifier, `file://${filePath}`).pathname;

		if (resolved.startsWith(`${forbiddenDir}/`) || resolved === forbiddenDir) {
			hits.push(specifier);
		}
	}

	return hits;
}

/**
 * Enforces the package's two-surface dependency direction:
 *
 *   client → shared     allowed
 *   client → server     forbidden
 *   server → shared     allowed
 *   server → client     forbidden
 *
 * `src/shared/` is exempt from both directions by construction — it lives
 * outside `client/` and `server/`, so a relative import from either surface
 * into `shared/` never matches `CLIENT_DIR`/`SERVER_DIR` below. This is a
 * static source scan (no build required), matching the pattern used by
 * `shared-node-boundary.test.ts` and by hr-skills-build's
 * `test/architecture/client-server-boundary.test.ts`, which this mirrors —
 * hr-skills-ref has the same src/client + src/server split (see README:
 * "browser-safe consumers must import `hr-skills-ref/client`") but had no
 * source-level test protecting the direction of that split, only the
 * build-time `verify-client-bundle.ts` check for Node built-ins.
 */
describe('client/server import boundary', () => {
	it('src/client/ never imports from src/server/', async () => {
		const files = await collectTsFiles(CLIENT_DIR);
		expect(files.length).toBeGreaterThan(0);

		const violations: string[] = [];
		for (const file of files) {
			const source = await readFile(file, 'utf8');
			const hits = findImportsInto(source, file, SERVER_DIR);
			if (hits.length > 0) {
				violations.push(
					`${file.replace(`${SRC_DIR}/`, 'src/')}: ${hits.join(', ')}`,
				);
			}
		}

		expect(violations).toEqual([]);
	});

	it('src/server/ never imports from src/client/', async () => {
		const files = await collectTsFiles(SERVER_DIR);
		expect(files.length).toBeGreaterThan(0);

		const violations: string[] = [];
		for (const file of files) {
			const source = await readFile(file, 'utf8');
			const hits = findImportsInto(source, file, CLIENT_DIR);
			if (hits.length > 0) {
				violations.push(
					`${file.replace(`${SRC_DIR}/`, 'src/')}: ${hits.join(', ')}`,
				);
			}
		}

		expect(violations).toEqual([]);
	});
});
