/**
 * Skill Recommendation Layer — Phase 6.1
 *
 * Exposes the `relatedSkills` graph that already lives in
 * `registry/skills.json` (computed by `rankRelatedSkills()`, then usually
 * re-ranked with usage-informed signals by `reRankRelatedSkills()` — see
 * registry.ts) as a reusable, user-facing "skills you might also need" API
 * — instead of leaving it as internal Planner input only.
 *
 * This module is intentionally thin: it reads a `Registry` object and looks
 * up an already-ranked, already-capped list. It does not re-rank, re-score,
 * or introduce any new signal (no AI ranking, no embeddings, no heuristics
 * of its own). The only source of truth is `RegistryEntry.relatedSkills`.
 *
 * Consumes only `Registry` / `RegistryEntry` (as produced from
 * `registry/skills.json`) — never parses `SKILL.md` files directly.
 */

import type {
	RecommendationResult,
	Registry,
	SkillRecommendation,
} from '../shared/types.js';

/**
 * Thrown when a recommendation is requested for a skill ID that does not
 * exist in the given registry.
 */
export class UnknownSkillError extends Error {
	constructor(skillId: string) {
		super(`Unknown skill ID: "${skillId}" — not found in the registry`);
		this.name = 'UnknownSkillError';
	}
}

/**
 * Get the top related skills for a given skill ID.
 *
 * Ranking rule: preserves the order already computed for
 * `RegistryEntry.relatedSkills` — same-domain skills ranked by shared-tag
 * overlap via `rankRelatedSkills()`, then (when a relevance signal table was
 * available at registry-build time, which is the default `bun run registry`
 * path) re-ranked by `reRankRelatedSkills()` to blend in observed
 * co-selection evidence — see registry.ts. This function does not alter
 * that order itself; it only looks up, caps, and formats it.
 *
 * Deterministic: for a fixed registry and skill ID, the same input always
 * produces the same output, in the same order.
 *
 * Dangling references (a related ID no longer present in the registry) are
 * silently skipped rather than throwing, so a stale entry never breaks the
 * whole result — `bun run validate` is the place that catches dangling
 * `relatedSkills` references as a registry-consistency error.
 *
 * @param skillId - The skill to get recommendations for, e.g. "hr-onboarding".
 * @param registry - A `Registry` object, as produced from `registry/skills.json`.
 * @param limit - Maximum number of recommendations to return (default 5).
 * @throws {UnknownSkillError} If `skillId` is not present in `registry`.
 * @returns Ranked related skills for `skillId`.
 */
export function getRecommendations(
	skillId: string,
	registry: Registry,
	limit = 5,
): RecommendationResult {
	const byId = new Map(registry.skills.map((skill) => [skill.id, skill]));
	const source = byId.get(skillId);

	if (!source) {
		throw new UnknownSkillError(skillId);
	}

	const recommendations: SkillRecommendation[] = [];

	source.relatedSkills.slice(0, limit).forEach((relatedId, index) => {
		const related = byId.get(relatedId);
		if (!related) return; // dangling reference — skip rather than throw

		recommendations.push({
			id: related.id,
			name: related.name,
			description: related.description,
			domain: related.domain,
			rank: index + 1,
		});
	});

	return { skillId, recommendations };
}
