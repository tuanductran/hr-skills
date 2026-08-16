import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import {
	buildDocumentationData,
	buildRegistry,
	type DocumentationData,
	type DocumentationSkill,
	executeWorkflow,
	generateExecutionPlan,
	getRecommendations,
	loadDataset,
	loadGoldenFixture,
	type RecommendationResult,
	type Registry,
	runEvaluation,
} from 'hr-skills-build/server';

let documentationDataPromise: Promise<DocumentationData> | undefined;
let registryPromise: Promise<Registry> | undefined;

/** Server-only access to canonical documentation generated from registry + Markdown. */
export function getDocumentationData(): Promise<DocumentationData> {
	documentationDataPromise ??= buildDocumentationData();
	return documentationDataPromise;
}

/** Server-only access to the canonical registry built by hr-skills-build. */
export function getRegistry(): Promise<Registry> {
	registryPromise ??= buildRegistry();
	return registryPromise;
}

export async function getDocumentationSkill(
	skillId: string,
): Promise<DocumentationSkill | undefined> {
	const data = await getDocumentationData();
	return data.skills.find((skill) => skill.id === skillId);
}

/** Delegate related-skill ranking and lookup to the package recommendation API. */
export async function getSkillRecommendations(
	skillId: string,
): Promise<RecommendationResult['recommendations']> {
	const registry = await getRegistry();
	return getRecommendations(skillId, registry, 5).recommendations;
}

export async function getSkillGraph() {
	const registry = await getRegistry();
	const nodes = registry.skills.map((skill) => ({
		id: skill.id,
		name: skill.name,
		domain: skill.domain,
		dependencies: skill.dependencies.length,
		relatedSkills: skill.relatedSkills.length,
	}));
	const knownIds = new Set(nodes.map((node) => node.id));
	const edges = registry.skills.flatMap((skill) => [
		...skill.relatedSkills
			.filter((target) => knownIds.has(target))
			.map((target) => ({ source: skill.id, target, kind: 'related' as const })),
		...skill.dependencies
			.filter((target) => knownIds.has(target))
			.map((target) => ({ source: skill.id, target, kind: 'dependency' as const })),
	]);
	return { nodes, edges, generatedAt: registry.generatedAt };
}

export async function getRuntimePreview() {
	const registry = await getRegistry();
	const plan = generateExecutionPlan('Design employee onboarding programs', registry);
	const result = await executeWorkflow(plan, async (step, context) => ({
		skillId: step.skillId,
		status: 'simulated',
		contextKeys: Object.keys(context.toObject()),
	}));
	return { plan, result };
}

export async function getEvaluationDashboard() {
	const dataset = await loadDataset('planning-scenarios');
	const golden = await loadGoldenFixture(dataset.name);
	return runEvaluation(dataset, await getRegistry(), golden);
}

function repositoryRoot() {
	const cwd = process.cwd();
	return cwd.endsWith(join('apps', 'web')) ? resolve(cwd, '..', '..') : cwd;
}

export interface ReleaseEntry {
	readonly id: string;
	readonly packages: Array<{ name: string; bump: string }>;
	readonly summary: string;
}

export async function getReleaseEntries(): Promise<ReleaseEntry[]> {
	const directory = join(repositoryRoot(), '.changeset');
	const files = (await readdir(directory)).filter(
		(file) => file.endsWith('.md') && file !== 'README.md',
	);
	return Promise.all(
		files.sort().map(async (file) => {
			const source = await readFile(join(directory, file), 'utf8');
			const [, frontmatter = '', summary = ''] = source.split('---', 3);
			const packages = [...frontmatter.matchAll(/"([^"]+)":\s+(\w+)/g)].map(
				(match) => ({ name: match[1], bump: match[2] }),
			);
			return { id: file.replace(/\.md$/, ''), packages, summary: summary.trim() };
		}),
	);
}
