/**
 * Generates registry/skills.json — the machine-readable Skill Registry that
 * is the single source of truth for skill discovery, routing, capability
 * lookup, aliases, domains, and relationships at runtime.
 *
 * Run via `bun run registry`, or automatically on every push to `main`
 * (matrix.yml workflow, alongside docs/skill-matrix.md — see
 * .github/workflows/matrix.yml).
 *
 * See docs/registry.md for the full architecture writeup.
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ROOT_DIR } from 'skills-ref';
import { buildRegistry, loadRelevanceSignalTable } from '../registry/registry.js';

async function generateRegistry(): Promise<void> {
	const signalTable = await loadRelevanceSignalTable();
	const registry = await buildRegistry(signalTable);

	const output = `${JSON.stringify(registry, null, 2)}\n`;
	const outputPath = join(ROOT_DIR, 'registry', 'skills.json');

	await writeFile(outputPath, output, 'utf8');

	const full = registry.skills.filter((s) => s.tier === 'full').length;
	const partial = registry.skills.filter((s) => s.tier === 'partial').length;
	const bare = registry.skills.filter((s) => s.tier === 'bare').length;

	console.log(
		`✅ registry/skills.json written — ${registry.skillCount} skills (${full} full, ${partial} partial, ${bare} bare)`,
	);
	console.log(
		signalTable
			? `   relatedSkills blended with ${signalTable.signals.length} usage-informed signal(s) from ${signalTable.sourceDatasets.join(', ')}`
			: '   relatedSkills computed from static tag overlap only (no registry/relevance-signals.json found — run "bun run signals" to generate it)',
	);
}

generateRegistry().catch((err) => {
	console.error('❌ Failed to generate skill registry:', err);
	process.exit(1);
});
