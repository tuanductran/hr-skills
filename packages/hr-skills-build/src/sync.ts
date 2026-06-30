#!/usr/bin/env bun
/**
 * Sync all HR skill references across the project.
 *
 * Run this after adding or removing a skill directory.
 *
 * What this script does:
 *   1. Discover all HR skills from the filesystem
 *   2. Rebuild the skill scopes table in AGENTS.md
 *   3. Rebuild the skills table in docs/installation.md
 *   4. Add missing sections to docs/skills.md
 *   5. Rebuild .claude-plugin/marketplace.json
 *
 * Usage:
 *   bun run sync
 */

import { join } from 'node:path';
import { consola } from 'consola';

import { getHrSkills } from './config.js';
import {
	AGENTS_TABLE_REGEX,
	INSTALLATION_TABLE_REGEX,
	ROOT_DIR,
	SKILL_SECTION_START_REGEX,
} from './constants.js';
import type { SkillMeta } from './types.js';
import { parseSkillMeta } from './utils.js';

// -----------------------------------------------------------------------------
// Marketplace sync
// -----------------------------------------------------------------------------

async function syncMarketplace(metas: SkillMeta[]): Promise<boolean> {
	const path = join(ROOT_DIR, '.claude-plugin/marketplace.json');

	const raw = await Bun.file(path).text();

	const json = JSON.parse(raw) as {
		name: string;
		description: string;
		plugins: unknown[];
	};

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

	await Bun.write(path, updated);

	return true;
}

// -----------------------------------------------------------------------------
// AGENTS.md sync
// -----------------------------------------------------------------------------

export function assertTemplateMarkerExists(
	content: string,
	regex: RegExp,
	filePath: string,
	markerName: string,
): void {
	if (regex.test(content)) {
		return;
	}

	throw new Error(
		`Template drift detected in ${filePath}: missing ${markerName} marker table. Restore the expected table header in ${filePath} before running bun run sync.`,
	);
}

async function syncAgentsTable(metas: SkillMeta[]): Promise<boolean> {
	const path = join(ROOT_DIR, 'AGENTS.md');

	const original = await Bun.file(path).text();

	assertTemplateMarkerExists(
		original,
		AGENTS_TABLE_REGEX,
		'AGENTS.md',
		'AGENTS_TABLE_REGEX',
	);

	const tableHeader = '| Skill | Scope |\n|-------|-------|';

	const rows = metas
		.map((meta) => `| **${meta.name}** | ${meta.scopeSentence} |`)
		.join('\n');

	const table = `${tableHeader}\n${rows}`;

	const updated = original.replace(AGENTS_TABLE_REGEX, `${table}\n`);

	if (updated === original) {
		return false;
	}

	await Bun.write(path, updated);

	return true;
}

// -----------------------------------------------------------------------------
// docs/installation.md sync
// -----------------------------------------------------------------------------

async function syncInstallationTable(metas: SkillMeta[]): Promise<boolean> {
	const path = join(ROOT_DIR, 'docs/installation.md');

	const original = await Bun.file(path).text();

	assertTemplateMarkerExists(
		original,
		INSTALLATION_TABLE_REGEX,
		'docs/installation.md',
		'INSTALLATION_TABLE_REGEX',
	);

	const tableHeader = '| Skill | What it covers |\n|----------------|--------|';

	const rows = metas
		.map((meta) => `| \`${meta.name}\` | ${meta.shortSummary} |`)
		.join('\n');

	const table = `${tableHeader}\n${rows}`;

	const updated = original.replace(INSTALLATION_TABLE_REGEX, `${table}\n`);

	if (updated === original) {
		return false;
	}

	await Bun.write(path, updated);

	return true;
}

// -----------------------------------------------------------------------------
// docs/skills.md sync
// -----------------------------------------------------------------------------

function buildSkillDocsSection(meta: SkillMeta): string | null {
	if (meta.triggerPhrases.length === 0) {
		return null;
	}

	const triggerList = meta.triggerPhrases.map((phrase) => `- "${phrase}"`).join('\n');

	return [
		'---',
		'',
		`## ${meta.name}`,
		'',
		`**What it covers:** ${meta.coverage}.`,
		'',
		'**Use when you say:**',
		'',
		triggerList,
	].join('\n');
}

async function syncSkillsDocs(metas: SkillMeta[]): Promise<boolean> {
	const path = join(ROOT_DIR, 'docs/skills.md');

	const original = await Bun.file(path).text();

	// Extract the preamble: everything before the first skill section
	const firstSectionIndex = original.search(SKILL_SECTION_START_REGEX);

	const preamble =
		firstSectionIndex !== -1
			? original.slice(0, firstSectionIndex).trimEnd()
			: original.trimEnd();

	// Build all skill sections in sorted order (metas is already sorted by getHrSkills)
	const sections: string[] = [];

	for (const meta of metas) {
		const section = buildSkillDocsSection(meta);

		if (!section) {
			consola.warn(
				`Skipping docs/skills.md section for ${meta.name}: no trigger phrases found in SKILL.md`,
			);
			continue;
		}

		sections.push(section);
	}

	const rebuilt =
		sections.length > 0
			? `${preamble}\n\n${sections.join('\n\n')}\n`
			: `${preamble}\n`;

	if (rebuilt === original) {
		return false;
	}

	await Bun.write(path, rebuilt);

	return true;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

export async function sync(): Promise<void> {
	consola.start('Syncing HR skills project...');

	const skillNames = await getHrSkills();

	consola.info(`Discovered ${skillNames.length} HR skills`);

	for (const skill of skillNames) {
		consola.log(`  ${skill}`);
	}

	const metas = await Promise.all(skillNames.map(parseSkillMeta));

	const marketplaceChanged = await syncMarketplace(metas);

	consola[marketplaceChanged ? 'success' : 'info'](
		marketplaceChanged
			? 'Updated marketplace.json'
			: 'marketplace.json already in sync',
	);

	const agentsChanged = await syncAgentsTable(metas);

	consola[agentsChanged ? 'success' : 'info'](
		agentsChanged ? 'Updated AGENTS.md' : 'AGENTS.md already in sync',
	);

	const installationChanged = await syncInstallationTable(metas);

	consola[installationChanged ? 'success' : 'info'](
		installationChanged
			? 'Updated docs/installation.md'
			: 'docs/installation.md already in sync',
	);

	const skillsDocsChanged = await syncSkillsDocs(metas);

	consola[skillsDocsChanged ? 'success' : 'info'](
		skillsDocsChanged ? 'Updated docs/skills.md' : 'docs/skills.md already in sync',
	);

	consola.success('Sync complete');
}

if (import.meta.main) {
	await sync();
}
