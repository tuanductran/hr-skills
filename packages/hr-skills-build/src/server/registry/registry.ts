/**
 * Builds the in-memory Skill Registry — the canonical, machine-readable index
 * of every skill's domain, capabilities, aliases, and relationships.
 *
 * `buildRegistry()` is a pure function (no filesystem writes) so it can be
 * used both by the CLI generator (generate-registry.ts, which writes
 * registry/skills.json) and by validation (validate.ts, which recomputes the
 * registry in memory and diffs it against the committed file to catch
 * staleness — the same pattern already used for marketplace.json/router
 * consistency).
 */

import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import * as v from 'valibot';
import { CATEGORY_META, classifySkill } from './classifier.js';
import { computeTier } from './tier.js';
import { REGISTRY_SCHEMA_VERSION, HR_SKILL_PREFIX, SKILL_LINK_REGEX } from '../shared/constants.js';
import {
	countFiles,
	dirExists,
	discoverSkills,
	readSkill,
} from '../filesystem/index.js';
import { deriveSkillMeta } from '../filesystem/metadata.js';
import { RELEVANCE_SIGNALS_PATH } from '../filesystem/paths.js';
import {
	indexSignalsBySource,
	RELEVANCE_SIGNAL_SCHEMA_VERSION,
	reRankRelatedSkills,
} from '../../shared/search/relevance-signals.js';
import type { Registry, RegistryEntry, RelevanceSignalTable } from '../shared/types.js';
import { SKILLS_DIR } from 'hr-skills-ref/server';

/**
 * Valibot schema for a single relevance signal entry.
 * Mirrors the `RelevanceSignal` interface and enforces its domain invariants;
 * used to validate loaded JSON before the cast in {@link loadRelevanceSignalTable}.
 */
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
			Math.abs(
				signal.coSelectionRate -
					signal.coSelectionCount / signal.observedCount,
			) <= 1e-9,
		'Invalid relevance signal invariants',
	),
);

/**
 * Valibot schema for the full relevance signal table artifact.
 * Validates the shape and domain invariants of `registry/relevance-signals.json`
 * before it is used in registry construction.
 */
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
			table.signals.every(
				(signal) => signal.observedCount <= table.totalObservations,
			),
		'Invalid relevance signal table invariants',
	),
);

/** Regex derived from {@link HR_SKILL_PREFIX} — strips the prefix to produce an alias slug. */
const HR_PREFIX_REGEX = new RegExp(`^${HR_SKILL_PREFIX}`);

/**
 * Maintainer-approved relationships that must remain discoverable even when
 * the deterministic top-five ranker would otherwise trim them. Generated
 * registry files remain derived artifacts; this map is source data.
 */
const RELATED_SKILL_OVERRIDES: Readonly<Record<string, readonly string[]>> = {
	'hr-career-development': [
		'hr-performance-review',
		'hr-training-development',
		'hr-leadership-development',
	],
};

/**
 * Load the committed usage-informed relevance signal table
 * (`registry/relevance-signals.json`), if present and valid — Phase 6.1-B.
 *
 * Returns `undefined` — rather than throwing — when the file is missing,
 * unparsable, or has an unrecognized `schemaVersion`, so callers can always
 * fall back to the static, signal-free ranking. This is what keeps
 * `buildRegistry()`'s `signalTable` parameter genuinely optional: nothing
 * downstream needs to know whether the artifact exists yet, and a
 * corrupted or stale-schema file degrades gracefully instead of breaking
 * registry generation.
 *
 * @param path - Absolute path to the signal table JSON file (defaults to
 *   {@link RELEVANCE_SIGNALS_PATH}). Accepting this as a parameter — rather
 *   than hardcoding the constant internally — keeps this function testable
 *   against a temp file, matching `loadSkillSemanticContent()`'s pattern in
 *   semantic-validation.ts and `scoreSkillQuality()`'s in quality-scoring.ts.
 * @returns The parsed signal table, or `undefined` if the file doesn't exist yet.
 */
export async function loadRelevanceSignalTable(
	path: string = RELEVANCE_SIGNALS_PATH,
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

	return result.output;
}

/**
 * Derive a short alias slug for a skill, e.g. "hr-onboarding" -> "onboarding".
 * Kept intentionally simple (one derived alias per skill) rather than a
 * manually maintained alias table, per the "avoid over-engineering" guidance.
 */
function deriveAliases(skillId: string): string[] {
	const slug = skillId.replace(HR_PREFIX_REGEX, '');
	return slug === skillId ? [] : [slug];
}

/**
 * Extract dependency skill IDs from a domain's CATEGORY_META preamble, e.g.
 * "Use these together with [hr-recruiting](skills/hr-recruiting)..." for
 * technical-hiring. Returns an empty array for domains with no preamble.
 *
 * This reuses metadata that already exists in classifier.ts instead of
 * maintaining a second, parallel dependency table.
 */
function extractDomainDependencies(domain: keyof typeof CATEGORY_META): string[] {
	const meta = CATEGORY_META[domain];
	if (!meta?.preamble) return [];

	const deps: string[] = [];
	for (const match of meta.preamble.matchAll(SKILL_LINK_REGEX)) {
		if (match[1]) deps.push(match[1]);
	}
	return deps;
}

/**
 * Rank other skills in the same domain by shared-tag overlap and return the
 * top N IDs. Fully deterministic — no manual curation, no external ranking
 * signal, just structural similarity already captured by the classifier.
 */
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

/**
 * Build the full Skill Registry from the current state of skills/ on disk.
 *
 * @param signalTable  Optional usage-informed relevance signal table loaded
 *   from `registry/relevance-signals.json`.  When present, the static
 *   tag-overlap `relatedSkills` ranking is blended with observed co-selection
 *   rates.  When absent (the default), the registry is built exactly as before
 *   — static ranking only — preserving full backwards compatibility.
 * @returns The full registry, including every skill's classification, capabilities, and related skills.
 */
export async function buildRegistry(
	signalTable?: RelevanceSignalTable,
): Promise<Registry> {
	// Pre-build the signal index once so per-skill look-ups are O(1).
	const signalIndex = signalTable ? indexSignalsBySource(signalTable) : null;
	const skillIds = await discoverSkills();

	// First pass: gather per-skill data that doesn't depend on other skills.
	const draft = await Promise.all(
		skillIds.map(async (id) => {
			const skillDir = join(SKILLS_DIR, id);
			// Load the skill once and derive metadata from the already-loaded
			// content — avoids reading the same SKILL.md twice per skill.
			const { content, frontmatter } = await readSkill(id);
			const meta = deriveSkillMeta(id, content, frontmatter);
			const classification = classifySkill(id);
			const version = frontmatter.metadata?.version ?? '0.0.0';

			const hasContent = await dirExists(join(skillDir, 'content'));
			const hasPrompts = await dirExists(join(skillDir, 'prompts'));
			const hasExamples = await dirExists(join(skillDir, 'examples'));

			// A subdirectory only "counts" toward tier if it also has files —
			// consistent with computeTier's use elsewhere (skill-matrix.md) and
			// with validateSubdirectoryContents, which forbids empty subdirs.
			const contentReady =
				hasContent && (await countFiles(join(skillDir, 'content'))) > 0;
			const promptsReady =
				hasPrompts && (await countFiles(join(skillDir, 'prompts'))) > 0;
			const examplesReady =
				hasExamples && (await countFiles(join(skillDir, 'examples'))) > 0;

			return {
				id,
				meta,
				version,
				classification,
				paths: {
					content: contentReady,
					prompts: promptsReady,
					examples: examplesReady,
				},
			};
		}),
	);

	// Index by domain for related-skill ranking.
	const byDomain = new Map<string, Array<{ id: string; tags: string[] }>>();
	for (const entry of draft) {
		const list = byDomain.get(entry.classification.category) ?? [];
		list.push({ id: entry.id, tags: entry.classification.tags });
		byDomain.set(entry.classification.category, list);
	}

	const skills: RegistryEntry[] = draft
		.map((entry) => {
			const tier = computeTier(
				entry.paths.content,
				entry.paths.prompts,
				entry.paths.examples,
			);

			const dependencies =
				entry.classification.category === 'uncategorized'
					? []
					: extractDomainDependencies(
							entry.classification.category as keyof typeof CATEGORY_META,
						).filter((depId) => depId !== entry.id);

			const staticRelated = rankRelatedSkills(
				entry.id,
				entry.classification.tags,
				byDomain.get(entry.classification.category) ?? [],
			);

			// Optionally blend static ranking with observed co-selection evidence.
			const rankedRelated = signalIndex
				? reRankRelatedSkills(entry.id, staticRelated, signalIndex)
				: staticRelated;
			const relatedSkills = [
				...new Set([
					...(RELATED_SKILL_OVERRIDES[entry.id] ?? []),
					...rankedRelated,
				]),
			].slice(0, 5);

			const registryEntry: RegistryEntry = {
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

			return registryEntry;
		})
		.sort((a, b) => a.id.localeCompare(b.id));

	return {
		schemaVersion: REGISTRY_SCHEMA_VERSION,
		generatedAt: new Date().toISOString().slice(0, 10),
		skillCount: skills.length,
		skills,
	};
}
