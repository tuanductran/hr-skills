/**
 * Generates registry/skills.json — the machine-readable Skill Registry that
 * is the single source of truth for skill discovery, routing, capability
 * lookup, aliases, domains, and relationships at runtime.
 *
 * Run via `bun run registry`, or automatically as a pre-release step in CI
 * (matrix.yml workflow, alongside docs/skill-matrix.md).
 *
 * See docs/registry.md for the full architecture writeup.
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ROOT_DIR } from './constants.js';
import { buildRegistry } from './registry.js';

async function generateRegistry(): Promise<void> {
	const registry = await buildRegistry();

	const output = `${JSON.stringify(registry, null, 2)}\n`;
	const outputPath = join(ROOT_DIR, 'registry', 'skills.json');

	await writeFile(outputPath, output, 'utf8');

	const full = registry.skills.filter((s) => s.tier === 'full').length;
	const partial = registry.skills.filter((s) => s.tier === 'partial').length;
	const bare = registry.skills.filter((s) => s.tier === 'bare').length;

	console.log(
		`✅ registry/skills.json written — ${registry.skillCount} skills (${full} full, ${partial} partial, ${bare} bare)`,
	);
}

generateRegistry().catch((err) => {
	console.error('❌ Failed to generate skill registry:', err);
	process.exit(1);
});
