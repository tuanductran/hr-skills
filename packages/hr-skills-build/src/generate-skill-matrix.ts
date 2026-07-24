/**
 * Generates docs/skill-matrix.md — a snapshot of every skill's maturity tier,
 * content depth, and validation status. Run via `bun run matrix` or automatically
 * as a pre-release step in CI (matrix.yml workflow).
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ROOT_DIR, SKILLS_DIR } from './constants.js';
import {
	computeTier,
	countFiles,
	discoverSkills,
	readSkill,
	tierIcon,
	tierLabel,
} from './helpers.js';
import type { SkillRow } from './types.js';

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function generateSkillMatrix(): Promise<void> {
	const skillNames = await discoverSkills();

	const rows: SkillRow[] = await Promise.all(
		skillNames.map(async (name) => {
			const skillDir = join(SKILLS_DIR, name);
			const { frontmatter } = await readSkill(name);
			const contentFiles = await countFiles(join(skillDir, 'content'));
			const promptsFiles = await countFiles(join(skillDir, 'prompts'));
			const examplesFiles = await countFiles(join(skillDir, 'examples'));

			const hasContent = contentFiles > 0;
			const hasPrompts = promptsFiles > 0;
			const hasExamples = examplesFiles > 0;

			const tier = computeTier(hasContent, hasPrompts, hasExamples);

			return {
				name,
				displayName: frontmatter.name ?? name,
				tier,
				hasContent,
				hasPrompts,
				hasExamples,
				contentFiles,
				version: frontmatter.metadata?.version ?? '—',
				description: (frontmatter.description ?? '')
					.slice(0, 80)
					.replace(/\|/g, '∣'),
			};
		}),
	);

	// Stats
	const bare = rows.filter((r) => r.tier === 'bare').length;
	const partial = rows.filter((r) => r.tier === 'partial').length;
	const full = rows.filter((r) => r.tier === 'full').length;
	const total = rows.length;

	const now = new Date().toISOString().slice(0, 10);

	// Build markdown
	const lines: string[] = [
		'# HR Skills — Skill Matrix',
		'',
		`> Auto-generated on ${now} by \`bun run matrix\`. Do not edit manually.`,
		'',
		'## Summary',
		'',
		`| Tier | Count | % |`,
		`|---|---:|---:|`,
		`| 🟢 Full (SKILL.md + content + prompts + examples) | ${full} | ${Math.round((full / total) * 100)}% |`,
		`| 🟡 Partial (SKILL.md + some optional dirs) | ${partial} | ${Math.round((partial / total) * 100)}% |`,
		`| 🔴 Bare (SKILL.md only) | ${bare} | ${Math.round((bare / total) * 100)}% |`,
		`| **Total** | **${total}** | 100% |`,
		'',
		'## Skill Inventory',
		'',
		'| Skill | Tier | content/ | prompts/ | examples/ | Content files | Version |',
		'|---|---|:---:|:---:|:---:|---:|---|',
	];

	for (const row of rows) {
		const icon = tierIcon(row.tier);
		const label = tierLabel(row.tier);
		const content = row.hasContent ? '✅' : '—';
		const prompts = row.hasPrompts ? '✅' : '—';
		const examples = row.hasExamples ? '✅' : '—';
		const files = row.hasContent ? String(row.contentFiles) : '—';

		lines.push(
			`| \`${row.name}\` | ${icon} ${label} | ${content} | ${prompts} | ${examples} | ${files} | ${row.version} |`,
		);
	}

	lines.push('');

	const output = lines.join('\n');
	const outputPath = join(ROOT_DIR, 'docs', 'skill-matrix.md');
	await writeFile(outputPath, output, 'utf8');

	console.log(
		`✅ skill-matrix.md written — ${total} skills (${full} full, ${partial} partial, ${bare} bare)`,
	);
}

generateSkillMatrix().catch((err) => {
	console.error('❌ Failed to generate skill matrix:', err);
	process.exit(1);
});
