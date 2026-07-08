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

		// Write initial valid marketplace json
		const initialJson = {
			name: 'Test Plugin',
			description: 'A test plugin.',
			plugins: [],
		};
		writeFileSync(tempMarketplacePath, JSON.stringify(initialJson, null, 2), 'utf8');
	});

	afterEach(() => {
		try {
			rmSync(tempDir, { recursive: true, force: true });
		} catch {}
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
		expect(updatedJson.plugins[0].name).toBe('hr-test-one');
		expect(updatedJson.plugins[0].description).toBe('First test description');
		expect(updatedJson.plugins[0].skills).toEqual(['./skills/hr-test-one']);
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

		// First sync to set up state
		await syncMarketplace(metas, tempMarketplacePath);

		// Second sync should return false
		const changed = await syncMarketplace(metas, tempMarketplacePath);
		expect(changed).toBe(false);
	});
});
