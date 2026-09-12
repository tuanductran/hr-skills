import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import { ROOT_DIR } from 'hr-skills-ref/server';
import * as v from 'valibot';
import { getHrSkills } from '../registry/discovery.js';
import { parseSkillMeta } from '../shared/helpers.js';
import {
	ClaudePluginJsonSchema,
	CodexMarketplaceJsonSchema,
	CodexPluginJsonSchema,
	MarketplaceJsonSchema,
} from '../shared/schema.js';
import type { SkillMeta } from '../shared/types.js';
import { syncRouter } from './router.js';

/**
 * Read the repo root `package.json` and return its `version` field.
 *
 * @throws If `package.json` is missing a `version` field.
 */
async function getPackageVersion(): Promise<string> {
	const raw = await readFile(join(ROOT_DIR, 'package.json'), 'utf8');
	const { version } = JSON.parse(raw) as { version?: string };

	if (!version) throw new Error('package.json is missing a version field');

	return version;
}

/**
 * Sync the marketplace.json file.
 *
 * @param metas - Parsed metadata for every skill, used to rebuild the `plugins` list.
 * @param filePath - Path to `marketplace.json`. Defaults to `${ROOT_DIR}/.claude-plugin/marketplace.json`.
 * @returns Whether the file's contents changed.
 */
export async function syncMarketplace(
	metas: SkillMeta[],
	filePath?: string,
): Promise<boolean> {
	const path = filePath ?? join(ROOT_DIR, '.claude-plugin/marketplace.json');

	const raw = await readFile(path, 'utf8');

	let parsed: unknown;

	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		throw new Error(`Invalid marketplace.json: ${String(error)}`);
	}

	const json = v.parse(MarketplaceJsonSchema, parsed);

	json.plugins = metas.map((meta) => ({
		name: meta.name,
		source: './',
		description: meta.description,
		skills: [`./skills/${meta.name}`],
	}));

	const updated = `${JSON.stringify(json, null, 2)}\n`;

	if (updated === raw) {
		return false;
	}

	await writeFile(path, updated);

	return true;
}

/**
 * Sync the repo-root `.claude-plugin/plugin.json` manifest.
 *
 * Keeps `version` aligned with `package.json` and `description` aligned
 * with the current skill count. `name` and `author` are static and left as
 * authored on disk.
 *
 * @param skillCount - Number of HR skills currently on disk, used to keep
 *   the manifest's description accurate.
 * @param filePath - Path to `plugin.json`. Defaults to
 *   `${ROOT_DIR}/.claude-plugin/plugin.json`.
 * @returns Whether the file's contents changed.
 */
export async function syncClaudePlugin(
	skillCount: number,
	filePath?: string,
): Promise<boolean> {
	const path = filePath ?? join(ROOT_DIR, '.claude-plugin/plugin.json');

	const raw = await readFile(path, 'utf8');

	let parsed: unknown;

	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		throw new Error(`Invalid .claude-plugin/plugin.json: ${String(error)}`);
	}

	const json = v.parse(ClaudePluginJsonSchema, parsed);

	json.version = await getPackageVersion();
	json.description = `${skillCount} domain-specific AI Agent Skills for HR managers covering recruiting, performance management, compensation, compliance, and every major HR domain.`;

	const updated = `${JSON.stringify(json, null, 2)}\n`;

	if (updated === raw) {
		return false;
	}

	await writeFile(path, updated);

	return true;
}

/**
 * Sync the repo-root `.codex-plugin/plugin.json` compatibility manifest.
 *
 * Keeps `version` aligned with `package.json` and `description`/
 * `interface.shortDescription` aligned with the current skill count. Every
 * other field (author, license, keywords, `skills: "./skills/"`, etc.) is
 * static and left as authored on disk.
 *
 * @param skillCount - Number of HR skills currently on disk, used to keep
 *   the manifest's descriptive text accurate.
 * @param filePath - Path to `plugin.json`. Defaults to
 *   `${ROOT_DIR}/.codex-plugin/plugin.json`.
 * @returns Whether the file's contents changed.
 */
export async function syncCodexPlugin(
	skillCount: number,
	filePath?: string,
): Promise<boolean> {
	const path = filePath ?? join(ROOT_DIR, '.codex-plugin/plugin.json');

	const raw = await readFile(path, 'utf8');

	let parsed: unknown;

	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		throw new Error(`Invalid .codex-plugin/plugin.json: ${String(error)}`);
	}

	const json = v.parse(CodexPluginJsonSchema, parsed);

	json.version = await getPackageVersion();
	json.description = `A collection of ${skillCount} AI skills for HR managers covering recruiting, performance management, compensation, compliance, and all major HR domains. Built by Tuan Duc Tran for the Zalo HR/TA Job Onsite/Hybrid/Remote community.`;
	json.interface.shortDescription = `${skillCount} AI skills covering the full HR domain`;

	const updated = `${JSON.stringify(json, null, 2)}\n`;

	if (updated === raw) {
		return false;
	}

	await writeFile(path, updated);

	return true;
}

/**
 * Sync the repo-root `.agents/plugins/marketplace.json` Codex marketplace
 * file. Currently validates and reformats the file only — the single
 * `git-url`-sourced plugin entry it lists is static and not derived from
 * skill metadata (see {@link CodexMarketplaceJsonSchema}).
 *
 * @param filePath - Path to `marketplace.json`. Defaults to
 *   `${ROOT_DIR}/.agents/plugins/marketplace.json`.
 * @returns Whether the file's contents changed.
 */
export async function syncCodexMarketplace(filePath?: string): Promise<boolean> {
	const path = filePath ?? join(ROOT_DIR, '.agents/plugins/marketplace.json');

	const raw = await readFile(path, 'utf8');

	let parsed: unknown;

	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		throw new Error(`Invalid .agents/plugins/marketplace.json: ${String(error)}`);
	}

	const json = v.parse(CodexMarketplaceJsonSchema, parsed);

	const updated = `${JSON.stringify(json, null, 2)}\n`;

	if (updated === raw) {
		return false;
	}

	await writeFile(path, updated);

	return true;
}

/**
 * Sync the HR skills project: regenerates `marketplace.json`, the Codex
 * `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`
 * manifests, and the root `SKILL.md` routing table from the skills
 * currently on disk.
 *
 * @returns Resolves once every file has been synced.
 */
export async function sync(): Promise<void> {
	p.intro('Syncing HR skills project...');

	const skillNames = await getHrSkills();
	p.log.info(`Discovered ${skillNames.length} HR skills`);

	const metas = await Promise.all(skillNames.map(parseSkillMeta));
	const marketplaceChanged = await syncMarketplace(metas);

	if (marketplaceChanged) p.log.success('Updated marketplace.json');
	else p.log.info('marketplace.json already in sync');

	const claudePluginChanged = await syncClaudePlugin(metas.length);

	if (claudePluginChanged) p.log.success('Updated .claude-plugin/plugin.json');
	else p.log.info('.claude-plugin/plugin.json already in sync');

	const codexPluginChanged = await syncCodexPlugin(metas.length);

	if (codexPluginChanged) p.log.success('Updated .codex-plugin/plugin.json');
	else p.log.info('.codex-plugin/plugin.json already in sync');

	const codexMarketplaceChanged = await syncCodexMarketplace();

	if (codexMarketplaceChanged)
		p.log.success('Updated .agents/plugins/marketplace.json');
	else p.log.info('.agents/plugins/marketplace.json already in sync');

	const routerResult = await syncRouter();

	if (routerResult.changed) p.log.success('Updated root SKILL.md router');
	else p.log.info('Root SKILL.md router already in sync');

	p.log.success('Sync complete');
	p.outro('Done');
}

if (import.meta.main) await sync();
