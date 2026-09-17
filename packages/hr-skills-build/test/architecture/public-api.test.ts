import { describe, expect, it } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as serverSurface from '../../src/server/index.js';

const SERVER_INDEX = join(import.meta.dirname, '../../src/server/index.ts');

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
