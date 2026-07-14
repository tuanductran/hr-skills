/**
 * Generate docs/skill-matrix.md from the current skills/ directory.
 *
 * Outputs a sortable Markdown table with one row per skill showing:
 * name, maturity tier, content/prompts/examples presence, line count,
 * and supported-task count.
 *
 * Run:
 *   bun scripts/generate-skill-matrix.ts
 *
 * Or from root:
 *   bun run matrix
 */

import { access, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const SKILLS_DIR = join(ROOT_DIR, 'skills');
const OUTPUT_PATH = join(ROOT_DIR, 'docs', 'skill-matrix.md');

const HR_SKILL_PREFIX = 'hr-';
const TASK_ITEM_RE = /^- /m;
const TASKS_BLOCK_RE = /## Supported tasks\r?\n\r?\n([\s\S]*?)(?=\r?\n##|$)/;

type Tier = 'full' | 'partial' | 'bare';

interface SkillRow {
	name: string;
	tier: Tier;
	hasContent: boolean;
	hasPrompts: boolean;
	hasExamples: boolean;
	lineCount: number;
	taskCount: number;
}

async function dirExists(p: string): Promise<boolean> {
	try {
		const s = await stat(p);
		return s.isDirectory();
	} catch {
		return false;
	}
}

async function fileExists(p: string): Promise<boolean> {
	try {
		await access(p);
		return true;
	} catch {
		return false;
	}
}

function getTier(hasContent: boolean, hasPrompts: boolean, hasExamples: boolean): Tier {
	const count = [hasContent, hasPrompts, hasExamples].filter(Boolean).length;
	if (count === 3) return 'full';
	if (count >= 1) return 'partial';
	return 'bare';
}

function tierBadge(tier: Tier): string {
	if (tier === 'full') return '🟢 Full';
	if (tier === 'partial') return '🟡 Partial';
	return '⬜ Bare';
}

function bool(v: boolean): string {
	return v ? '✓' : '–';
}

async function analyzeSkill(name: string): Promise<SkillRow> {
	const skillDir = join(SKILLS_DIR, name);
	const skillMd = join(skillDir, 'SKILL.md');

	const [hasContent, hasPrompts, hasExamples] = await Promise.all([
		dirExists(join(skillDir, 'content')),
		dirExists(join(skillDir, 'prompts')),
		dirExists(join(skillDir, 'examples')),
	]);

	const tier = getTier(hasContent, hasPrompts, hasExamples);

	let lineCount = 0;
	let taskCount = 0;

	if (await fileExists(skillMd)) {
		const content = await readFile(skillMd, 'utf8');
		lineCount = content.split('\n').length;

		const tasksMatch = TASKS_BLOCK_RE.exec(content);

		if (tasksMatch?.[1]) {
			taskCount = tasksMatch[1]
				.split('\n')
				.filter((line) => TASK_ITEM_RE.test(line)).length;
		}
	}

	return { name, tier, hasContent, hasPrompts, hasExamples, lineCount, taskCount };
}

async function main(): Promise<void> {
	const entries = await readdir(SKILLS_DIR, { withFileTypes: true });

	const skillNames = entries
		.filter((e) => e.isDirectory() && e.name.startsWith(HR_SKILL_PREFIX))
		.map((e) => e.name)
		.sort();

	const rows = await Promise.all(skillNames.map(analyzeSkill));

	// Summary counts
	const full = rows.filter((r) => r.tier === 'full').length;
	const partial = rows.filter((r) => r.tier === 'partial').length;
	const bare = rows.filter((r) => r.tier === 'bare').length;
	const total = rows.length;

	const now = new Date().toISOString().slice(0, 10);

	const lines: string[] = [
		'# Skill matrix',
		'',
		`> Auto-generated on ${now} from \`skills/hr-*/\`. Run \`bun run matrix\` to regenerate.`,
		'',
		'## Summary',
		'',
		`| Tier | Count | % |`,
		`|---|---:|---:|`,
		`| 🟢 Full (content + prompts + examples) | ${full} | ${Math.round((full / total) * 100)}% |`,
		`| 🟡 Partial (one or two supporting dirs) | ${partial} | ${Math.round((partial / total) * 100)}% |`,
		`| ⬜ Bare (SKILL.md only) | ${bare} | ${Math.round((bare / total) * 100)}% |`,
		`| **Total** | **${total}** | 100% |`,
		'',
		'## Skills',
		'',
		'| Skill | Tier | content/ | prompts/ | examples/ | Lines | Tasks |',
		'|---|---|:---:|:---:|:---:|---:|---:|',
		...rows.map(
			(r) =>
				`| \`${r.name}\` | ${tierBadge(r.tier)} | ${bool(r.hasContent)} | ${bool(r.hasPrompts)} | ${bool(r.hasExamples)} | ${r.lineCount} | ${r.taskCount} |`,
		),
	];

	const output = `${lines.join('\n')}\n`;
	await writeFile(OUTPUT_PATH, output);

	console.log(`✓ Generated docs/skill-matrix.md (${total} skills)`);
	console.log(`  🟢 Full: ${full}  🟡 Partial: ${partial}  ⬜ Bare: ${bare}`);
}

await main();
