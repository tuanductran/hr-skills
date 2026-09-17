import { describe, expect, it } from 'bun:test';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as serverSurface from '../../src/server/index.js';

const SERVER_DIR = join(import.meta.dirname, '../../src/server');
const SERVER_INDEX = join(SERVER_DIR, 'index.ts');

/**
 * Symbols that live under `src/server/internal/` and are consumed only by
 * tests (via a direct file import), never by the package's public API.
 * If either of these ever appears on the public server surface again, the
 * `server/shared/helpers.ts` grab-bag problem this refactor fixed has crept
 * back in.
 */
const INTERNAL_TEST_ONLY_SYMBOLS = ['makeKeyPromptsContent', 'first'] as const;

/**
 * Symbols that live under `src/server/internal/` but ARE deliberately
 * re-exported from `server/index.ts` because a real external consumer
 * depends on them (see `server/index.ts` for the reasoning per symbol).
 */
const INTERNAL_BUT_DELIBERATELY_PUBLIC_SYMBOLS = ['stubStepExecutor'] as const;

describe('server public API surface', () => {
	it('does not blanket re-export server/internal/ via `export *`', async () => {
		const source = await readFile(SERVER_INDEX, 'utf8');

		// A named `export { x } from './internal/...'` is fine (deliberate,
		// auditable); a wildcard `export * from './internal...'` is not — it
		// would silently promote every future internal helper to public API.
		const wildcardInternalExport = /export\s+\*\s+from\s+["']\.\/internal\//;

		expect(wildcardInternalExport.test(source)).toBe(false);
	});

	it('no server domain barrel (registry/index.ts, service/index.ts, etc.) leaks internal/ either', async () => {
		// Guards against the same wildcard-leak reappearing one level down —
		// e.g. a future `registry/index.ts` doing
		// `export * from '../internal/runtime/stub-executor.js'` would bypass
		// the check above (which only inspects server/index.ts itself) while
		// still reaching the public surface through `export * from
		// './registry/index.js'` in server/index.ts.
		const domainBarrels = await readdir(SERVER_DIR, { withFileTypes: true });
		const wildcardOrNamedInternalImport = /from\s+["'](\.\.\/)?internal\//;

		const violations: string[] = [];
		for (const entry of domainBarrels) {
			if (!entry.isDirectory() || entry.name === 'internal') continue;
			const indexPath = join(SERVER_DIR, entry.name, 'index.ts');
			let source: string;
			try {
				source = await readFile(indexPath, 'utf8');
			} catch {
				continue; // domain has no index.ts barrel
			}
			if (wildcardOrNamedInternalImport.test(source)) {
				violations.push(`server/${entry.name}/index.ts`);
			}
		}

		expect(violations).toEqual([]);
	});

	it('never exposes internal test-only fixtures/helpers as public API', () => {
		for (const symbol of INTERNAL_TEST_ONLY_SYMBOLS) {
			expect(Object.hasOwn(serverSurface, symbol)).toBe(false);
		}
	});

	it('deliberately re-exports the internal symbols real consumers need', () => {
		for (const symbol of INTERNAL_BUT_DELIBERATELY_PUBLIC_SYMBOLS) {
			expect(Object.hasOwn(serverSurface, symbol)).toBe(true);
		}
	});

	it('server/shared/ stays a thin, pure re-export — not a dumping ground', async () => {
		// server/shared/index.ts must never re-export a grab-bag `helpers.js`
		// again — Node-only/domain logic belongs in filesystem/, registry/,
		// validation/, internal/, etc. instead (see this test's sibling checks
		// and `server/index.ts`'s own doc comment for where each symbol went).
		const sharedIndexSource = await readFile(
			join(import.meta.dirname, '../../src/server/shared/index.ts'),
			'utf8',
		);
		const helpersLikeExport = /export\s+\*\s+from\s+["']\.\/helpers\.js["']/;
		expect(helpersLikeExport.test(sharedIndexSource)).toBe(false);
	});
});
