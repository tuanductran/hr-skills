#!/usr/bin/env bun

/**
 * CLI: Search the generated Skill Registry by structured metadata.
 *
 * Reads `registry/skills.json` directly — it must already be generated
 * (`bun run registry`) before this command is used.
 *
 * Usage:
 *   bun src/discover.ts "onboard new hires"
 *   bun src/discover.ts "onboarding" --domain onboarding-offboarding
 *   bun src/discover.ts "onbording" --limit 3 --no-fuzzy
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as p from '@clack/prompts';

import type { SkillCategory } from '../registry/classifier.js';
import { InvalidSearchQueryError, searchSkills } from '../search/search.js';
import { ROOT_DIR } from '../shared/constants.js';
import type { Registry, SkillSearchQuery } from '../shared/types.js';

const REGISTRY_PATH = join(ROOT_DIR, 'registry', 'skills.json');

function parseFlag(name: string): string | undefined {
	const index = process.argv.indexOf(`--${name}`);
	if (index === -1) return undefined;
	return process.argv[index + 1];
}

function hasFlag(name: string): boolean {
	return process.argv.includes(`--${name}`);
}

async function main() {
	const text = process.argv[2];

	if (!text || text.startsWith('--')) {
		p.log.error(
			'Usage: bun src/discover.ts "<query>" [--domain <domain>] [--limit N] [--no-fuzzy]',
		);
		p.log.info('Example:');
		p.log.message('  bun src/discover.ts "onboard new hires"');
		process.exit(1);
	}

	const domain = parseFlag('domain') as SkillCategory | undefined;
	const limitFlag = parseFlag('limit');
	const limit = limitFlag ? Number(limitFlag) : undefined;
	const fuzzy = !hasFlag('no-fuzzy');

	p.intro('Skill Search');

	const spinner = p.spinner();
	spinner.start('Loading Skill Registry...');
	const raw = await readFile(REGISTRY_PATH, 'utf8');
	const registry = JSON.parse(raw) as Registry;
	spinner.stop(`Registry loaded (${registry.skillCount} skills)`);

	const query: SkillSearchQuery = {
		text,
		fuzzy,
		...(domain && { domain }),
		...(limit && { limit }),
	};

	try {
		const response = searchSkills(query, registry);

		if (response.results.length === 0) {
			p.log.warn(`No skills matched "${text}"`);
		} else {
			p.note(
				response.results
					.map(
						(r) =>
							`${r.skillId} — score ${r.score} (${r.domain})\n   ${r.explanation}`,
					)
					.join('\n\n'),
				`RESULTS FOR "${response.query}" (${response.resultCount})`,
			);
		}

		p.outro('Done');
	} catch (error) {
		if (error instanceof InvalidSearchQueryError) {
			p.log.error(error.message);
			process.exit(1);
		}
		throw error;
	}
}

main().catch((err) => {
	p.log.error(`Error: ${err.message}`);
	process.exit(1);
});
