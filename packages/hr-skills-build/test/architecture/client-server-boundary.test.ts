import { describe, expect, it } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const PACKAGE_DIR = join(import.meta.dirname, '../..');
const SRC_DIR = join(PACKAGE_DIR, 'src');
const CLIENT_DIR = join(SRC_DIR, 'client');
const SERVER_DIR = join(SRC_DIR, 'server');

const { name: PACKAGE_NAME } = (await Bun.file(
	join(PACKAGE_DIR, 'package.json'),
).json()) as { name: string };

/**
 * Matches a relative import/re-export specifier (static or dynamic) so its
 * target can be resolved and checked against the forbidden directory.
 */
const RELATIVE_IMPORT_PATTERN = /(?:from\s+|import\s*\(\s*)["'](\.\.?\/[^"']+)["']/g;

/**
 * Matches a self-referencing package-subpath import/re-export, e.g.
 * `from 'hr-skills-build/server'`. A relative-import scan alone misses this:
 * `src/client/foo.ts` importing `'hr-skills-build/server'` never contains a
 * `./` or `../` specifier, so it slips past `RELATIVE_IMPORT_PATTERN`
 * entirely even though it pulls the forbidden surface in exactly the same
 * way a relative import would.
 */
function packageImportPattern(surface: 'client' | 'server'): RegExp {
	return new RegExp(
		`(?:from\\s+|import\\s*\\(\\s*)["'](${PACKAGE_NAME}/${surface})["']`,
		'g',
	);
}

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
 * Collect every import in `file` — relative or self-referencing
 * package-subpath — that resolves to `forbiddenSurface` (given as both the
 * absolute directory, for relative-import resolution, and the bare surface
 * name, for the package-subpath pattern above).
 */
function findImportsInto(
	source: string,
	filePath: string,
	forbiddenDir: string,
	forbiddenSurface: 'client' | 'server',
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

	for (const match of source.matchAll(packageImportPattern(forbiddenSurface))) {
		if (match[1]) hits.push(match[1]);
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
 * `shared/node-boundary.test.ts`.
 */
describe('client/server import boundary', () => {
	it('src/client/ never imports from src/server/', async () => {
		const files = await collectTsFiles(CLIENT_DIR);
		expect(files.length).toBeGreaterThan(0);

		const violations: string[] = [];
		for (const file of files) {
			const source = await readFile(file, 'utf8');
			const hits = findImportsInto(source, file, SERVER_DIR, 'server');
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
			const hits = findImportsInto(source, file, CLIENT_DIR, 'client');
			if (hits.length > 0) {
				violations.push(
					`${file.replace(`${SRC_DIR}/`, 'src/')}: ${hits.join(', ')}`,
				);
			}
		}

		expect(violations).toEqual([]);
	});
});
