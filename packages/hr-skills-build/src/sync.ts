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

import { getHrSkills, SKILLS_DIR } from './config.js';
import {
	DESCRIPTION_REGEX,
	extractMatch,
	FRONTMATTER_REGEX,
	NAME_REGEX,
	TASKS_REGEX,
} from './utils.js';

// -----------------------------------------------------------------------------
// Paths
// -----------------------------------------------------------------------------

const ROOT = join(import.meta.dir, '../../..');

// -----------------------------------------------------------------------------
// Regex patterns (sync-specific)
// -----------------------------------------------------------------------------

const KEY_PROMPTS_REGEX = /## Key prompts\n\n([\s\S]*?)(?=\n## Tips|\n---\n|$)/;

const QUOTED_PROMPT_REGEX = /^(?:\d+\. |[-*] )"([^"]+)"/gm;

const AGENTS_TABLE_REGEX = /\| Skill \| Scope \|\n\|[-|]+\|\n[\s\S]*?(?=\n## )/;

const INSTALLATION_TABLE_REGEX =
	/\| Skill \| What it covers \|\n\|[-|]+\|\n[\s\S]*?(?=\nSee \[skills\.md\])/;

const USE_WHEN_REGEX = /Use when/i;

const PERIOD_REGEX = /\.$/;

const TASK_ITEM_REGEX = /^- /;

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface SkillMeta {
	name: string;
	description: string;
	coverage: string;
	shortSummary: string;
	scopeSentence: string;
	triggerPhrases: string[];
	supportedTasks: string[];
}

// -----------------------------------------------------------------------------
// Skill parser
// -----------------------------------------------------------------------------

async function parseSkillMeta(skillName: string): Promise<SkillMeta> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');

	const content = await Bun.file(skillPath).text();

	const frontmatter = extractMatch(FRONTMATTER_REGEX, content) ?? '';

	const name = extractMatch(NAME_REGEX, frontmatter) ?? skillName;

	const description = extractMatch(DESCRIPTION_REGEX, frontmatter) ?? '';

	// Remove "Use when..." section from description
	const useWhenIndex = description.search(USE_WHEN_REGEX);

	const coverage =
		useWhenIndex !== -1
			? description.slice(0, useWhenIndex).trim().replace(PERIOD_REGEX, '')
			: description.trim().replace(PERIOD_REGEX, '');

	// Supported tasks
	const tasksBlock = extractMatch(TASKS_REGEX, content) ?? '';

	const supportedTasks = tasksBlock
		.split('\n')
		.filter((line) => TASK_ITEM_REGEX.test(line))
		.map((line) => line.replace(TASK_ITEM_REGEX, '').trim())
		.filter(Boolean);

	// Trigger phrases
	const keyPromptsBlock = extractMatch(KEY_PROMPTS_REGEX, content) ?? '';

	const triggerPhrases: string[] = [];

	for (const match of keyPromptsBlock.matchAll(QUOTED_PROMPT_REGEX)) {
		if (triggerPhrases.length >= 5) {
			break;
		}

		triggerPhrases.push(match[1]);
	}

	// Installation summary
	const firstClause = coverage.split('—')[1]?.trim() ?? coverage;

	const shortSummary =
		firstClause.length > 65 ? `${firstClause.slice(0, 62)}…` : firstClause;

	const scopeSentence = `${coverage.charAt(0).toUpperCase()}${coverage.slice(1)}.`;

	return {
		name,
		description,
		coverage,
		shortSummary,
		scopeSentence,
		triggerPhrases,
		supportedTasks,
	};
}

// -----------------------------------------------------------------------------
// Marketplace sync
// -----------------------------------------------------------------------------

async function syncMarketplace(metas: SkillMeta[]): Promise<boolean> {
	const path = join(ROOT, '.claude-plugin/marketplace.json');

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

function assertTemplateMarkerExists(
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
	const path = join(ROOT, 'AGENTS.md');

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
	const path = join(ROOT, 'docs/installation.md');

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

async function syncSkillsDocs(metas: SkillMeta[]): Promise<boolean> {
	const path = join(ROOT, 'docs/skills.md');

	let content = await Bun.file(path).text();

	let changed = false;

	for (const meta of metas) {
		const heading = `## ${meta.name}`;

		if (content.includes(`\n${heading}\n`) || content.startsWith(`${heading}\n`)) {
			continue;
		}

		const triggerList =
			meta.triggerPhrases.length > 0
				? meta.triggerPhrases.map((phrase) => `- "${phrase}"`).join('\n')
				: '- [Add trigger phrases here]';

		const section = [
			'',
			'---',
			'',
			heading,
			'',
			`**What it covers:** ${meta.coverage}.`,
			'',
			'**Use when you say:**',
			'',
			triggerList,
		].join('\n');

		content = `${content.trimEnd()}${section}\n`;

		changed = true;
	}

	if (!changed) {
		return false;
	}

	await Bun.write(path, content);

	return true;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function sync(): Promise<void> {
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
	void sync();
}

export { assertTemplateMarkerExists };
