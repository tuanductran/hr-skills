import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import * as v from 'valibot';
import { CATEGORY_META, classifySkill } from './classifier.js';
import { computeTier } from './tier.js';
import { REGISTRY_SCHEMA_VERSION, HR_SKILL_PREFIX, SKILL_LINK_REGEX } from '../shared/constants.js';
import { countFiles, dirExists, discoverSkills, readSkill } from '../filesystem/index.js';
import { deriveSkillMeta } from '../filesystem/metadata.js';
import { RELEVANCE_SIGNALS_PATH } from '../filesystem/paths.js';
import { indexSignalsBySource, RELEVANCE_SIGNAL_SCHEMA_VERSION, reRankRelatedSkills } from '../../shared/search/relevance-signals.js';
import type { Registry, RegistryEntry, RelevanceSignalTable } from '../shared/types.js';
import { SKILLS_DIR } from 'hr-skills-ref/server';

const RelevanceSignalSchema = v.pipe(
	v.object({
		sourceSkill: v.string(),
		targetSkill: v.string(),
		coSelectionRate: v.number(),
		coSelectionCount: v.number(),
		observedCount: v.number(),
	}),
	v.check(
		(signal) =>
			signal.sourceSkill !== signal.targetSkill &&
			signal.coSelectionRate >= 0 &&
			signal.coSelectionRate <= 1 &&
			Number.isInteger(signal.coSelectionCount) &&
			signal.coSelectionCount >= 0 &&
			Number.isInteger(signal.observedCount) &&
			signal.observedCount > 0 &&
			signal.coSelectionCount <= signal.observedCount &&
			Math.abs(signal.coSelectionRate - signal.coSelectionCount / signal.observedCount) <= 1e-9,
		'Invalid relevance signal invariants',
	),
);

const RelevanceSignalTableSchema = v.pipe(
	v.object({
		schemaVersion: v.literal(RELEVANCE_SIGNAL_SCHEMA_VERSION),
		generatedAt: v.string(),
		sourceDatasets: v.array(v.string()),
		totalObservations: v.number(),
		signals: v.array(RelevanceSignalSchema),
	}),
	v.check(
		(table) =>
			Number.isInteger(table.totalObservations) &&
			table.totalObservations >= 0 &&
			table.signals.every((signal) => signal.observedCount <= table.totalObservations),
		'Invalid relevance signal table invariants',
	),
);

const HR_PREFIX_REGEX = new RegExp(`^${HR_SKILL_PREFIX}`);

const RELATED_SKILL_OVERRIDES: Readonly<Record<string, readonly string[]>> = {
	'hr-career-development': ['hr-performance-review', 'hr-training-development', 'hr-leadership-development'],
};

function hasValidSignalReferences(table: RelevanceSignalTable, allowedSkillIds: ReadonlySet<string>): boolean {
	const seenPairs = new Set<string>();
	for (const signal of table.signals) {
		const pair = `${signal.sourceSkill}\0${signal.targetSkill}`;
		if (seenPairs.has(pair)) return false;
		if (!allowedSkillIds.has(signal.sourceSkill) || !allowedSkillIds.has(signal.targetSkill)) return false;
		seenPairs.add(pair);
	}
	return true;
}

export async function loadRelevanceSignalTable(
	path: string = RELEVANCE_SIGNALS_PATH,
	allowedSkillIds?: ReadonlySet<string>,
): Promise<RelevanceSignalTable | undefined> {
	let raw: string;
	try {
		raw = await readFile(path, 'utf8');
	} catch {
		return undefined;
	}
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return undefined;
	}
	const result = v.safeParse(RelevanceSignalTableSchema, parsed);
	if (!result.success) return undefined;
	if (allowedSkillIds && !hasValidSignalReferences(result.output, allowedSkillIds)) return undefined;
	return result.output;
}

function deriveAliases(skillId: string): string[] {
	const slug = skillId.replace(HR_PREFIX_REGEX, '');
	return slug === skillId ? [] : [slug];
}

function extractDomainDependencies(domain: keyof typeof CATEGORY_META): string[] {
	const meta = CATEGORY_META[domain];
	if (!meta?.preamble) return [];
	const deps: string[] = [];
	for (const match of meta.preamble.matchAll(SKILL_LINK_REGEX)) {
		if (match[1]) deps.push(match[1]);
	}
	return deps;
}

function rankRelatedSkills(
	skillId: string,
	tags: string[],
	sameDomainSkills: ReadonlyArray<{ id: string; tags: string[] }>,
	limit = 5,
): string[] {
	const tagSet = new Set(tags);
	return sameDomainSkills
		.filter((other) => other.id !== skillId)
		.map((other) => ({
			id: other.id,
			overlap: other.tags.filter((tag) => tagSet.has(tag)).length,
		}))
		.sort((a, b) => b.overlap - a.overlap || a.id.localeCompare(b.id))
		.slice(0, limit)
		.map((entry) => entry.id);
}

export async function buildRegistry(signalTable?: RelevanceSignalTable): Promise<Registry> {
	const skillIds = await discoverSkills();
	const skillIdSet = new Set(skillIds);
	const validSignalTable = signalTable && hasValidSignalReferences(signalTable, skillIdSet) ? signalTable : undefined;
	const signalIndex = validSignalTable ? indexSignalsBySource(validSignalTable) : null;

	const draft = await Promise.all(
		skillIds.map(async (id) => {
			const skillDir = join(SKILLS_DIR, id);
			const { content, frontmatter } = await readSkill(id);
			const meta = deriveSkillMeta(id, content, frontmatter);
			const classification = classifySkill(id);
			const version = frontmatter.metadata?.version ?? '0.0.0';
			const hasContent = await dirExists(join(skillDir, 'content'));
			const hasPrompts = await dirExists(join(skillDir, 'prompts'));
			const hasExamples = await dirExists(join(skillDir, 'examples'));
			const contentReady = hasContent && (await countFiles(join(skillDir, 'content'))) > 0;
			const promptsReady = hasPrompts && (await countFiles(join(skillDir, 'prompts'))) > 0;
			const examplesReady = hasExamples && (await countFiles(join(skillDir, 'examples'))) > 0;
			return { id, meta, version, classification, paths: { content: contentReady, prompts: promptsReady, examples: examplesReady } };
		}),
	);

	const byDomain = new Map<string, Array<{ id: string; tags: string[] }>>();
	for (const entry of draft) {
		const list = byDomain.get(entry.classification.category) ?? [];
		list.push({ id: entry.id, tags: entry.classification.tags });
		byDomain.set(entry.classification.category, list);
	}

	const skills: RegistryEntry[] = draft
		.map((entry) => {
			const tier = computeTier(entry.paths.content, entry.paths.prompts, entry.paths.examples);
			const dependencies =
				entry.classification.category === 'uncategorized'
					? []
					: extractDomainDependencies(entry.classification.category as keyof typeof CATEGORY_META).filter((depId) => depId !== entry.id);
			const staticRelated = rankRelatedSkills(entry.id, entry.classification.tags, byDomain.get(entry.classification.category) ?? []);
			const rankedRelated = signalIndex ? reRankRelatedSkills(entry.id, staticRelated, signalIndex) : staticRelated;
			const relatedSkills = [
				...new Set([...(RELATED_SKILL_OVERRIDES[entry.id] ?? []), ...rankedRelated]),
			].filter((id) => skillIdSet.has(id)).slice(0, 5);

			return {
				id: entry.id,
				name: entry.meta.name,
				version: entry.version,
				description: entry.meta.description,
				tier,
				domain: entry.classification.category,
				tags: entry.classification.tags,
				aliases: deriveAliases(entry.id),
				capabilities: entry.meta.supportedTasks,
				triggerPhrases: entry.meta.triggerPhrases,
				paths: entry.paths,
				dependencies,
				relatedSkills,
			};
		})
		.sort((a, b) => a.id.localeCompare(b.id));

	return {
		schemaVersion: REGISTRY_SCHEMA_VERSION,
		generatedAt: new Date().toISOString().slice(0, 10),
		skillCount: skills.length,
		skills,
	};
}
