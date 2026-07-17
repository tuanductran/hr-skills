/**
 * Generates docs/skill-matrix.md — a snapshot of every skill's maturity tier,
 * content depth, and validation status. Run via `bun run matrix` or automatically
 * as a pre-release step in CI (matrix.yml workflow).
 */

import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ROOT_DIR, SKILLS_DIR } from './constants.js';
import {
	countFiles,
	dirExists,
	discoverSkills,
	readSkill,
	tierIcon,
	tierLabel,
} from './helpers.js';
import type { SkillMatrixStats, SkillRow, Tier } from './types.js';

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function generateSkillMatrix(): Promise<void> {
	const skillNames = await discoverSkills();

	const rows: SkillRow[] = await Promise.all(
		skillNames.map(async (name) => {
			const { frontmatter } = await readSkill(name);

			const skillDir = join(SKILLS_DIR, name);
			const hasContent = await dirExists(join(skillDir, 'content'));
			const hasPrompts = await dirExists(join(skillDir, 'prompts'));
			const hasExamples = await dirExists(join(skillDir, 'examples'));

			const subDirCount = [hasContent, hasPrompts, hasExamples].filter(
				Boolean,
			).length;
			const tier: Tier =
				subDirCount === 0 ? 'bare' : subDirCount === 3 ? 'full' : 'partial';

			const contentFiles = hasContent
				? await countFiles(join(skillDir, 'content'))
				: 0;

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

	const stats: SkillMatrixStats = {
		bare: rows.filter((r) => r.tier === 'bare').length,
		partial: rows.filter((r) => r.tier === 'partial').length,
		full: rows.filter((r) => r.tier === 'full').length,
		total: rows.length,
	};

	const output = buildMarkdown(rows, stats);
	const outputPath = join(ROOT_DIR, 'docs', 'skill-matrix.md');
	await writeFile(outputPath, output, 'utf8');

	console.log(
		`✅ skill-matrix.md written — ${stats.total} skills (${stats.full} full, ${stats.partial} partial, ${stats.bare} bare)`,
	);
}

function buildMarkdown(rows: SkillRow[], stats: SkillMatrixStats): string {
	const { bare, partial, full, total } = stats;
	const now = new Date().toISOString().slice(0, 10);

	const lines: string[] = [
		'# HR Skills — Skill Matrix',
		'',
		`> Auto-generated on ${now} by \`bun run matrix\`. Do not edit manually.`,
		'',
		'## Summary',
		'',
		'| Tier | Count | % |',
		'|---|---:|---:|',
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
		lines.push(
			`| \`${row.name}\` | ${tierIcon(row.tier)} ${tierLabel(row.tier)} | ${row.hasContent ? '✅' : '—'} | ${row.hasPrompts ? '✅' : '—'} | ${row.hasExamples ? '✅' : '—'} | ${row.hasContent ? String(row.contentFiles) : '—'} | ${row.version} |`,
		);
	}

	lines.push('');

	return lines.join('\n');
}

generateSkillMatrix().catch((err) => {
	console.error('❌ Failed to generate skill matrix:', err);
	process.exit(1);
});
