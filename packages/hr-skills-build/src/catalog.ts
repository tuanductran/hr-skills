#!/usr/bin/env bun
/**
 * Generate a catalog of all HR skills.
 *
 * Usage:
 *   bun run catalog
 *   bun run catalog --list
 */

import { join } from 'node:path';

import { consola } from 'consola';

import { getHrSkills } from './config.js';
import { SKILLS_DIR } from './constants.js';
import { createSection } from './helpers.js';
import type { SkillCatalogEntry } from './types.js';
import { parseSkill } from './utils.js';

// -----------------------------------------------------------------------------
// Markdown generator
// -----------------------------------------------------------------------------

export function generateCatalog(skills: SkillCatalogEntry[]): string {
	const sections = skills.map(createSection).join('\n\n---\n\n');

	return [
		'# HR Skills Catalog',
		'',
		`> ${skills.length} skills available for HR professionals`,
		'',
		'---',
		'',
		sections,
		'',
	].join('\n');
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function catalog(): Promise<void> {
	const listOnly = Bun.argv.includes('--list');

	consola.start('Generating HR Skills catalog...');

	const skillNames = await getHrSkills();

	if (skillNames.length === 0) {
		consola.warn('No HR skills found in skills/ directory');

		return;
	}

	const parsedSkills = await Promise.all(skillNames.map(parseSkill));

	const skills = parsedSkills.filter(
		(entry): entry is SkillCatalogEntry => entry !== null,
	);

	if (listOnly) {
		for (const skill of skills) {
			const preview =
				skill.description.length > 80
					? `${skill.description.slice(0, 77)}...`
					: skill.description;

			consola.log(`${skill.name}: ${preview}`);
		}

		consola.success(`Listed ${skills.length} HR skills`);

		return;
	}

	const markdown = generateCatalog(skills);

	const outputPath = join(SKILLS_DIR, 'CATALOG.md');

	await Bun.write(outputPath, markdown);

	consola.success(`Generated catalog with ${skills.length} HR skills.`);
}

if (import.meta.main) {
	await catalog();
}
