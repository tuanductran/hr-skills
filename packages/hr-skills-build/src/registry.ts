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

import { join } from 'node:path';

import { CATEGORY_META, classifySkill } from './classifier.js';
import { REGISTRY_SCHEMA_VERSION, SKILL_LINK_REGEX, SKILLS_DIR } from './constants.js';
import {
	computeTier,
	countFiles,
	dirExists,
	discoverSkills,
	readSkill,
} from './helpers.js';
import { parseSkillMeta } from './parser.js';
import type { Registry, RegistryEntry } from './types.js';

const HR_PREFIX_REGEX = /^hr-/;

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
 */
export async function buildRegistry(): Promise<Registry> {
	const skillIds = await discoverSkills();

	// First pass: gather per-skill data that doesn't depend on other skills.
	const draft = await Promise.all(
		skillIds.map(async (id) => {
			const skillDir = join(SKILLS_DIR, id);
			const [meta, { frontmatter }] = await Promise.all([
				parseSkillMeta(id),
				readSkill(id),
			]);
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

			const relatedSkills = rankRelatedSkills(
				entry.id,
				entry.classification.tags,
				byDomain.get(entry.classification.category) ?? [],
			);

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
