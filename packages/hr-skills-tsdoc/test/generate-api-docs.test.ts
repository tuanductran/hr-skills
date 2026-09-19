import { describe, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import {
	buildToc,
	compareDocEntries,
	generate,
	headingToAnchor,
	normalizeLineEndings,
} from '../src/generate-api-docs.ts';

describe('normalizeLineEndings', () => {
	test('canonicalizes CRLF and CR to LF', () => {
		expect(normalizeLineEndings('a\r\nb\rc\n')).toBe('a\nb\nc\n');
	});
});

describe('headingToAnchor', () => {
	test('creates GitHub-compatible anchors from Markdown headings', () => {
		expect(headingToAnchor('hr-skills — cli')).toBe('hr-skills--cli');
		expect(headingToAnchor('`parseFrontmatter` & Types')).toBe(
			'parsefrontmatter--types',
		);
		expect(headingToAnchor('Tiếng Việt & Unicode')).toBe('tiếng-việt--unicode');
	});
});

describe('buildToc', () => {
	test('includes package and symbol headings but ignores fenced code headings', () => {
		const content = [
			'## Package',
			'',
			'### `publicApi`',
			'',
			'```ts',
			'# Not a Markdown heading',
			'## Also not a heading',
			'```',
		].join('\n');

		expect(buildToc(content)).toBe(
			[
				'## Table of Contents',
				'',
				'- [Package](#package)',
				'  - [`publicApi`](#publicapi)',
			].join('\n'),
		);
	});
});

describe('compareDocEntries', () => {
	test('uses deterministic path ordering instead of locale-sensitive collation', () => {
		const entries = [
			{ filePath: 'z.ts', line: 1 },
			{ filePath: 'ä.ts', line: 1 },
			{ filePath: 'a.ts', line: 1 },
			{ filePath: 'a.ts', line: 2 },
		];

		const sorted = [...entries].sort(compareDocEntries);

		expect(sorted).toEqual([
			{ filePath: 'a.ts', line: 1 },
			{ filePath: 'a.ts', line: 2 },
			{ filePath: 'z.ts', line: 1 },
			{ filePath: 'ä.ts', line: 1 },
		]);
	});
});

describe('generate', () => {
	test('matches the committed API reference', async () => {
		const packageRoot = path.resolve(import.meta.dir, '..');
		const apiPath = path.resolve(packageRoot, '../../docs/engineering/api.md');
		const [generated, committed] = await Promise.all([
			generate(),
			readFile(apiPath, 'utf8'),
		]);

		expect(generated).toBe(normalizeLineEndings(committed));
	});
});
