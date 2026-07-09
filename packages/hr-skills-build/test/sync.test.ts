import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { syncMarketplace } from '../src/sync.js';
import type { SkillMeta } from '../src/types.js';

describe('syncMarketplace()', () => {
	let tempDir: string;
	let tempMarketplacePath: string;

	beforeEach(() => {
		tempDir = join(tmpdir(), `sync-test-${Date.now()}`);
		mkdirSync(tempDir, { recursive: true });

		tempMarketplacePath = join(tempDir, 'marketplace.json');

		const initialJson = {
			name: 'Test Plugin',
			description: 'A test plugin.',
			plugins: [],
		};

		writeFileSync(tempMarketplacePath, JSON.stringify(initialJson, null, 2), 'utf8');
	});

	afterEach(() => {
		rmSync(tempDir, {
			recursive: true,
			force: true,
		});
	});

	it('returns true and updates plugins if they changed', async () => {
		const metas: SkillMeta[] = [
			{
				name: 'hr-test-one',
				description: 'First test description',
				coverage: 'Test coverage',
				scopeSentence: 'Test scope sentence',
				triggerPhrases: [],
				supportedTasks: [],
			},
		];

		const changed = await syncMarketplace(metas, tempMarketplacePath);

		expect(changed).toBe(true);

		const updatedContent = await readFile(tempMarketplacePath, 'utf8');

		const updatedJson = JSON.parse(updatedContent);

		expect(updatedJson.plugins).toHaveLength(1);

		expect(updatedJson.plugins[0]).toEqual({
			name: 'hr-test-one',
			source: './',
			description: 'First test description',
			skills: ['./skills/hr-test-one'],
		});
	});

	it('returns false if plugins are already in sync', async () => {
		const metas: SkillMeta[] = [
			{
				name: 'hr-test-one',
				description: 'First test description',
				coverage: 'Test coverage',
				scopeSentence: 'Test scope sentence',
				triggerPhrases: [],
				supportedTasks: [],
			},
		];

		await syncMarketplace(metas, tempMarketplacePath);

		const changed = await syncMarketplace(metas, tempMarketplacePath);

		expect(changed).toBe(false);
	});

	it('throws if marketplace.json does not match schema', async () => {
		const invalidJson = {
			name: 'Test Plugin',
			description: 'A test plugin.',
			plugins: 'invalid',
		};

		writeFileSync(tempMarketplacePath, JSON.stringify(invalidJson, null, 2), 'utf8');

		const metas: SkillMeta[] = [];

		expect(syncMarketplace(metas, tempMarketplacePath)).rejects.toThrow();
	});

	it('throws if marketplace.json is invalid JSON', async () => {
		writeFileSync(tempMarketplacePath, '{ invalid json', 'utf8');

		const metas: SkillMeta[] = [];

		expect(syncMarketplace(metas, tempMarketplacePath)).rejects.toThrow();
	});
});
