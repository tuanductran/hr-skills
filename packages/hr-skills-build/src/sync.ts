import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import * as v from 'valibot';

import { getHrSkills } from './config.js';
import { ROOT_DIR } from './constants.js';
import { parseSkillMeta } from './parser.js';
import { MarketplaceJsonSchema } from './schema.js';
import type { SkillMeta } from './types.js';

/**
 * Sync the marketplace.json file.
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
 * Sync the HR skills project.
 */
export async function sync(): Promise<void> {
	p.intro('Syncing HR skills project...');

	const skillNames = await getHrSkills();
	p.log.info(`Discovered ${skillNames.length} HR skills`);

	const metas = await Promise.all(skillNames.map(parseSkillMeta));
	const marketplaceChanged = await syncMarketplace(metas);

	if (marketplaceChanged) p.log.success('Updated marketplace.json');
	else p.log.info('marketplace.json already in sync');

	p.log.success('Sync complete');
	p.outro('Done');
}

if (import.meta.main) await sync();
