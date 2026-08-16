import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SKILLS_DIR } from 'hr-skills-ref';
import { buildRegistry } from '../registry/registry.js';
import { readSkill } from '../shared/helpers.js';
import type { SkillCategory } from '../shared/types.js';
import type {
	DocumentationData,
	DocumentationDomain,
	DocumentationSection,
	DocumentationSkill,
} from './types.js';

const ACRONYMS = new Set(['ai', 'api', 'hr', 'hris', 'kpi', 'lms', 'ma', 'ui', 'ux']);

const DOMAIN_LABELS: Record<SkillCategory, string> = {
	'talent-acquisition': 'Talent acquisition',
	'onboarding-offboarding': 'Onboarding & offboarding',
	'performance-talent': 'Performance & talent',
	'compensation-rewards': 'Compensation & rewards',
	'learning-development': 'Learning & development',
	'org-design-change': 'Organisation design & change',
	'workforce-analytics': 'Workforce analytics',
	'hr-technology-ai': 'HR technology & AI',
	'compliance-risk': 'Compliance & risk',
	'culture-experience': 'Culture & experience',
	'global-project': 'Global & project work',
	'technical-hiring': 'Technical hiring',
	uncategorized: 'Uncategorized',
};

/** Converts a repository identifier into an accessible display label. */
export function humanizeIdentifier(identifier: string): string {
	return identifier
		.replace(/^hr-/, '')
		.split('-')
		.map((word) => {
			const lowerCase = word.toLowerCase();
			if (ACRONYMS.has(lowerCase)) return lowerCase.toUpperCase();
			return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
		})
		.join(' ');
}

async function readDocumentationSections(
	skillId: string,
	directory: 'prompts' | 'examples',
): Promise<DocumentationSection[]> {
	const directoryPath = join(SKILLS_DIR, skillId, directory);

	try {
		const entries = await readdir(directoryPath, { withFileTypes: true });
		const fileNames = entries
			.filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
			.map((entry) => entry.name)
			.sort((a, b) => a.localeCompare(b));

		return await Promise.all(
			fileNames.map(async (fileName) => ({
				fileName,
				markdown: await readFile(join(directoryPath, fileName), 'utf8'),
			})),
		);
	} catch {
		return [];
	}
}

/** Builds a stable artifact consumed by the public documentation application. */
export async function buildDocumentationData(): Promise<DocumentationData> {
	const registry = await buildRegistry();
	const skills: DocumentationSkill[] = await Promise.all(
		registry.skills.map(async (skill) => {
			const [{ content: rawContent }, prompts, examples] = await Promise.all([
				readSkill(skill.id),
				readDocumentationSections(skill.id, 'prompts'),
				readDocumentationSections(skill.id, 'examples'),
			]);
			const content = rawContent.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');

			return {
				...skill,
				displayName: humanizeIdentifier(skill.name),
				content,
				prompts,
				examples,
			};
		}),
	);

	const counts = new Map<SkillCategory, number>();
	for (const skill of skills) {
		counts.set(skill.domain, (counts.get(skill.domain) ?? 0) + 1);
	}

	const domains: DocumentationDomain[] = [...counts.entries()]
		.map(([id, skillCount]) => ({
			id,
			label: DOMAIN_LABELS[id],
			skillCount,
		}))
		.sort((a, b) => a.label.localeCompare(b.label));

	return {
		schemaVersion: 1,
		generatedAt: registry.generatedAt,
		skillCount: skills.length,
		domains,
		skills,
	};
}
