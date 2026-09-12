import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT_DIR } from 'hr-skills-ref/server';
import type { SkillMeta } from '../../src/client/shared/types.js';
import {
	syncClaudePlugin,
	syncCodexMarketplace,
	syncCodexPlugin,
	syncMarketplace,
} from '../../src/server/build/sync.js';

describe('syncMarketplace()', () => {
	let tempDir: string;
	let tempMarketplacePath: string;

	beforeEach(() => {
		tempDir = join(tmpdir(), `sync-test-${Date.now()}`);
		mkdirSync(tempDir, { recursive: true });

		tempMarketplacePath = join(tempDir, 'marketplace.json');

		const initialJson = {
			$schema: 'https://json.schemastore.org/claude-code-marketplace.json',
			name: 'Test Plugin',
			description: 'A test plugin.',
			owner: {
				name: 'Test Owner',
				email: 'test@example.com',
			},
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

		expect(updatedJson.$schema).toBe(
			'https://json.schemastore.org/claude-code-marketplace.json',
		);

		expect(updatedJson.owner).toEqual({
			name: 'Test Owner',
			email: 'test@example.com',
		});

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
			owner: {
				name: 'Test Owner',
				email: 'not-an-email',
			},
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

	it('preserves marketplace metadata', async () => {
		await syncMarketplace([], tempMarketplacePath);

		const json = JSON.parse(await readFile(tempMarketplacePath, 'utf8'));

		expect(json).toMatchObject({
			$schema: 'https://json.schemastore.org/claude-code-marketplace.json',
			name: 'Test Plugin',
			description: 'A test plugin.',
			owner: {
				name: 'Test Owner',
				email: 'test@example.com',
			},
		});
	});
});

describe('syncClaudePlugin()', () => {
	let tempDir: string;
	let tempPluginPath: string;
	let repoVersion: string;

	beforeEach(async () => {
		tempDir = join(tmpdir(), `sync-claude-plugin-test-${Date.now()}`);
		mkdirSync(tempDir, { recursive: true });

		tempPluginPath = join(tempDir, 'plugin.json');

		const { version } = JSON.parse(
			await readFile(join(ROOT_DIR, 'package.json'), 'utf8'),
		) as { version: string };
		repoVersion = version;

		const initialJson = {
			name: 'hr-skills',
			version: '0.0.0-stale',
			description: '0 domain-specific AI Agent Skills for HR managers.',
			author: {
				name: 'Tuan Duc Tran',
				url: 'https://github.com/tuanductran',
			},
		};

		writeFileSync(tempPluginPath, JSON.stringify(initialJson, null, 2), 'utf8');
	});

	afterEach(() => {
		rmSync(tempDir, {
			recursive: true,
			force: true,
		});
	});

	it('returns true and updates version and description if they changed', async () => {
		const changed = await syncClaudePlugin(146, tempPluginPath);

		expect(changed).toBe(true);

		const json = JSON.parse(await readFile(tempPluginPath, 'utf8'));

		expect(json.version).toBe(repoVersion);
		expect(json.description).toContain('146 domain-specific AI Agent Skills');
		expect(json.name).toBe('hr-skills');
		expect(json.author).toEqual({
			name: 'Tuan Duc Tran',
			url: 'https://github.com/tuanductran',
		});
	});

	it('returns false if already in sync', async () => {
		await syncClaudePlugin(146, tempPluginPath);

		const changed = await syncClaudePlugin(146, tempPluginPath);

		expect(changed).toBe(false);
	});

	it('throws if plugin.json does not match schema', async () => {
		writeFileSync(tempPluginPath, JSON.stringify({ name: 'hr-skills' }), 'utf8');

		expect(syncClaudePlugin(146, tempPluginPath)).rejects.toThrow();
	});

	it('throws if plugin.json is invalid JSON', async () => {
		writeFileSync(tempPluginPath, '{ invalid json', 'utf8');

		expect(syncClaudePlugin(146, tempPluginPath)).rejects.toThrow();
	});
});

describe('syncCodexPlugin()', () => {
	let tempDir: string;
	let tempPluginPath: string;
	let repoVersion: string;

	beforeEach(async () => {
		tempDir = join(tmpdir(), `sync-codex-plugin-test-${Date.now()}`);
		mkdirSync(tempDir, { recursive: true });

		tempPluginPath = join(tempDir, 'plugin.json');

		const { version } = JSON.parse(
			await readFile(join(ROOT_DIR, 'package.json'), 'utf8'),
		) as { version: string };
		repoVersion = version;

		const initialJson = {
			name: 'hr-skills',
			version: '0.0.0-stale',
			description: 'A collection of 0 AI skills for HR managers.',
			author: {
				name: 'Tuan Duc Tran',
				url: 'https://github.com/tuanductran',
			},
			homepage: 'https://github.com/tuanductran/hr-skills',
			repository: 'https://github.com/tuanductran/hr-skills',
			license: 'MIT',
			keywords: ['hr'],
			skills: './skills/',
			interface: {
				displayName: 'HR Skills',
				shortDescription: '0 AI skills covering the full HR domain',
				longDescription: 'A collection of AI skills for HR managers.',
				developerName: 'Tuan Duc Tran',
				category: 'Human Resources',
				capabilities: ['Instructions'],
				websiteURL: 'https://github.com/tuanductran/hr-skills',
			},
		};

		writeFileSync(tempPluginPath, JSON.stringify(initialJson, null, 2), 'utf8');
	});

	afterEach(() => {
		rmSync(tempDir, {
			recursive: true,
			force: true,
		});
	});

	it('returns true and updates version and descriptions if they changed', async () => {
		const changed = await syncCodexPlugin(146, tempPluginPath);

		expect(changed).toBe(true);

		const json = JSON.parse(await readFile(tempPluginPath, 'utf8'));

		expect(json.version).toBe(repoVersion);
		expect(json.description).toContain('146 AI skills');
		expect(json.interface.shortDescription).toBe(
			'146 AI skills covering the full HR domain',
		);
		expect(json.skills).toBe('./skills/');
	});

	it('returns false if already in sync', async () => {
		await syncCodexPlugin(146, tempPluginPath);

		const changed = await syncCodexPlugin(146, tempPluginPath);

		expect(changed).toBe(false);
	});

	it('throws if plugin.json does not match schema', async () => {
		writeFileSync(tempPluginPath, JSON.stringify({ name: 'hr-skills' }), 'utf8');

		expect(syncCodexPlugin(146, tempPluginPath)).rejects.toThrow();
	});

	it('throws if plugin.json is invalid JSON', async () => {
		writeFileSync(tempPluginPath, '{ invalid json', 'utf8');

		expect(syncCodexPlugin(146, tempPluginPath)).rejects.toThrow();
	});
});

describe('syncCodexMarketplace()', () => {
	let tempDir: string;
	let tempMarketplacePath: string;
	let validJson: Record<string, unknown>;

	beforeEach(() => {
		tempDir = join(tmpdir(), `sync-codex-marketplace-test-${Date.now()}`);
		mkdirSync(tempDir, { recursive: true });

		tempMarketplacePath = join(tempDir, 'marketplace.json');

		validJson = {
			name: 'hr-skills',
			interface: {
				displayName: 'HR Skills',
			},
			plugins: [
				{
					name: 'hr-skills',
					source: {
						source: 'url',
						url: 'https://github.com/tuanductran/hr-skills.git',
						ref: 'main',
					},
					policy: {
						installation: 'AVAILABLE',
						authentication: 'ON_INSTALL',
					},
					category: 'Human Resources',
				},
			],
		};

		writeFileSync(tempMarketplacePath, JSON.stringify(validJson), 'utf8');
	});

	afterEach(() => {
		rmSync(tempDir, {
			recursive: true,
			force: true,
		});
	});

	it('returns true and reformats when the file is not pretty-printed', async () => {
		const changed = await syncCodexMarketplace(tempMarketplacePath);

		expect(changed).toBe(true);

		const json = JSON.parse(await readFile(tempMarketplacePath, 'utf8'));

		expect(json).toEqual(validJson);
	});

	it('returns false if already in sync', async () => {
		writeFileSync(
			tempMarketplacePath,
			`${JSON.stringify(validJson, null, 2)}\n`,
			'utf8',
		);

		const changed = await syncCodexMarketplace(tempMarketplacePath);

		expect(changed).toBe(false);
	});

	it('throws if marketplace.json does not match schema', async () => {
		writeFileSync(tempMarketplacePath, JSON.stringify({ name: 'hr-skills' }), 'utf8');

		expect(syncCodexMarketplace(tempMarketplacePath)).rejects.toThrow();
	});

	it('throws if marketplace.json is invalid JSON', async () => {
		writeFileSync(tempMarketplacePath, '{ invalid json', 'utf8');

		expect(syncCodexMarketplace(tempMarketplacePath)).rejects.toThrow();
	});

	it('rejects a plugin source that is not url-based', async () => {
		const invalidJson = {
			...validJson,
			plugins: [
				{
					name: 'hr-skills',
					source: {
						source: 'local',
						path: './',
					},
					policy: {
						installation: 'AVAILABLE',
						authentication: 'ON_INSTALL',
					},
					category: 'Human Resources',
				},
			],
		};

		writeFileSync(tempMarketplacePath, JSON.stringify(invalidJson), 'utf8');

		expect(syncCodexMarketplace(tempMarketplacePath)).rejects.toThrow();
	});
});
