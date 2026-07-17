/**
 * Generates the routing table section of the root SKILL.md.
 *
 * Flow:
 *  1. Discover all hr-* skills via discoverSkills()
 *  2. Parse each SKILL.md frontmatter for `name` and `description`
 *  3. Classify each skill into a category via classifySkill()
 *  4. Group skills by category, sort within each group
 *  5. Render the "## Routing tables" section of root SKILL.md
 *  6. Splice it into the existing root SKILL.md, preserving the
 *     preamble (frontmatter + intro + ## How to use) and the ## Notes footer
 *
 * Called by sync.ts so `bun run sync` keeps both marketplace.json
 * and the root SKILL.md router in sync automatically.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { CATEGORY_META, classifySkill, type SkillCategory } from './classifier.js';
import { ROOT_DIR, SKILLS_DIR } from './constants.js';
import { discoverSkills } from './helpers.js';
import { parseSkillFrontmatter } from './parser.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RouterRow {
	skillName: string;
	displayName: string;
	/** Short "use when" line extracted from description */
	useWhen: string;
}

// ---------------------------------------------------------------------------
// Description extraction
// ---------------------------------------------------------------------------

const USE_WHEN_RE = /Use when\s+/i;

/**
 * Extract the "use when" clause from a skill description.
 * Falls back to the first sentence of the description.
 */
function extractUseWhen(description: string): string {
	const idx = description.search(USE_WHEN_RE);

	if (idx !== -1) {
		// Everything after "Use when "
		const raw = description.slice(idx).replace(USE_WHEN_RE, '').trim();
		// Take up to the first period or 120 chars
		const sentence = raw.split('.')[0] ?? raw;
		return sentence.trim().replace(/\.$/, '');
	}

	// Fallback: first sentence, capped
	const first = description.split('.')[0] ?? description;
	return first.trim().replace(/\.$/, '').slice(0, 120);
}

// ---------------------------------------------------------------------------
// Markdown rendering
// ---------------------------------------------------------------------------

const CATEGORY_ORDER: Array<Exclude<SkillCategory, 'uncategorized'>> = [
	'talent-acquisition',
	'onboarding-offboarding',
	'performance-talent',
	'compensation-rewards',
	'learning-development',
	'org-design-change',
	'workforce-analytics',
	'hr-technology-ai',
	'compliance-risk',
	'culture-experience',
	'global-project',
	'technical-hiring',
];

function renderRoutingTables(
	grouped: Map<SkillCategory, RouterRow[]>,
	uncategorized: RouterRow[],
): string {
	const lines: string[] = ['## Routing tables', ''];

	for (const cat of CATEGORY_ORDER) {
		const rows = grouped.get(cat);
		if (!rows || rows.length === 0) continue;

		const meta = CATEGORY_META[cat];

		lines.push(`### ${meta.heading}`, '');

		if (meta.preamble) {
			lines.push(meta.preamble, '');
		}

		lines.push('| Skill | Use when the task involves... |');
		lines.push('|---|---|');

		for (const row of rows) {
			const link = `[${row.skillName}](skills/${row.skillName})`;
			lines.push(`| ${link} | ${row.useWhen} |`);
		}

		lines.push('');
	}

	// Uncategorized — only rendered if non-empty (signals new skills need classifier entry)
	if (uncategorized.length > 0) {
		lines.push('### Uncategorized (add to classifier.ts)', '');
		lines.push(
			'> ⚠️  These skills were not matched by the classifier. Add them to `src/classifier.ts`.',
			'',
		);
		lines.push('| Skill | Use when the task involves... |');
		lines.push('|---|---|');
		for (const row of uncategorized) {
			lines.push(`| \`${row.skillName}\` | ${row.useWhen} |`);
		}
		lines.push('');
	}

	return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Root SKILL.md splicing
// ---------------------------------------------------------------------------

const ROUTING_TABLES_START_RE = /^## Routing tables$/m;
const NOTES_START_RE = /^## Notes$/m;

/**
 * Splice the new routing tables section into the existing root SKILL.md.
 * Preserves everything before "## Routing tables" and everything from
 * "## Notes" onward.
 */
function spliceRoutingTables(existingContent: string, newRoutingSection: string): string {
	const startMatch = ROUTING_TABLES_START_RE.exec(existingContent);
	const notesMatch = NOTES_START_RE.exec(existingContent);

	if (!startMatch) {
		// No existing routing tables — append before ## Notes or at end
		if (notesMatch) {
			const before = existingContent.slice(0, notesMatch.index).trimEnd();
			const after = existingContent.slice(notesMatch.index);
			return `${before}\n\n${newRoutingSection}\n${after}`;
		}
		return `${existingContent.trimEnd()}\n\n${newRoutingSection}\n`;
	}

	const before = existingContent.slice(0, startMatch.index).trimEnd();

	if (notesMatch && notesMatch.index > startMatch.index) {
		const after = existingContent.slice(notesMatch.index);
		return `${before}\n\n${newRoutingSection}\n${after}`;
	}

	// No ## Notes — replace to end of file
	return `${before}\n\n${newRoutingSection}\n`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface SyncRouterResult {
	changed: boolean;
	skillCount: number;
	uncategorizedCount: number;
}

export async function syncRouter(rootSkillPath?: string): Promise<SyncRouterResult> {
	const skillMdPath = rootSkillPath ?? join(ROOT_DIR, 'SKILL.md');

	// 1. Discover skills
	const skillNames = await discoverSkills();

	// 2. Parse + classify
	const grouped = new Map<SkillCategory, RouterRow[]>();
	const uncategorized: RouterRow[] = [];

	for (const skillName of skillNames) {
		const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');
		let description = '';

		try {
			const raw = await readFile(skillPath, 'utf8');
			const fm = parseSkillFrontmatter(raw);
			description = fm.description ?? '';
		} catch {
			// Skill exists in filesystem but SKILL.md unreadable — skip
			continue;
		}

		const classification = classifySkill(skillName);
		const row: RouterRow = {
			skillName,
			displayName: skillName,
			useWhen: extractUseWhen(description),
		};

		if (classification.category === 'uncategorized') {
			uncategorized.push(row);
		} else {
			const cat = classification.category;
			if (!grouped.has(cat)) grouped.set(cat, []);
			grouped.get(cat)?.push(row);
		}
	}

	// 3. Render routing section
	const routingSection = renderRoutingTables(grouped, uncategorized);

	// 4. Read existing root SKILL.md
	const existing = await readFile(skillMdPath, 'utf8');

	// 5. Splice
	const updated = spliceRoutingTables(existing, routingSection);

	// 6. Write if changed
	if (updated === existing) {
		return {
			changed: false,
			skillCount: skillNames.length,
			uncategorizedCount: uncategorized.length,
		};
	}

	await writeFile(skillMdPath, updated, 'utf8');
	return {
		changed: true,
		skillCount: skillNames.length,
		uncategorizedCount: uncategorized.length,
	};
}
