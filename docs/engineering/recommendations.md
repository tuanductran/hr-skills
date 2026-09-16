# Skill Recommendations

> Exposes the [Skill Registry](registry.md)'s `relatedSkills` graph as a user-facing
> "skills you might also need" API, instead of leaving it as internal
> [Planner](planner.md) input only.

## What it is

`packages/hr-skills-build/src/client/search/recommendations.ts` exports one function,
`getRecommendations(skillId, registry, limit?)`, that looks up a skill's
already-computed `relatedSkills` list from a `Registry` object (as produced
from `registry/skills.json`) and returns it in a stable, documented shape.

This is a read-only lookup layer, not a separate ranking system. The ranking
is performed during registry generation by `buildRegistry()` in
`packages/hr-skills-build/src/server/registry/registry.ts`; this module simply
surfaces that result.

## Recommendation format

```ts
interface SkillRecommendation {
  id: string; // e.g. "hr-onboarding"
  name: string;
  description: string;
  domain: SkillCategory;
  rank: number; // 1-based position, best match first
}

interface RecommendationResult {
  skillId: string;
  recommendations: SkillRecommendation[];
}
```

`getRecommendations()` returns a single `RecommendationResult`: the
requested `skillId` plus its ranked `recommendations`, capped at `limit`
(default 5).

## Ranking rule

Recommendations preserve the order already present in
`RegistryEntry.relatedSkills`. The registry starts with same-domain skills
ranked by shared-tag overlap, then can blend observed usage/co-selection
signals from `registry/relevance-signals.json` through `reRankRelatedSkills()`.
Maintainer-approved relationships in `RELATED_SKILL_OVERRIDES` can also be
preserved before the final five-item cap.

This module does not re-rank, re-score, or introduce a new signal:

- No AI ranking or embeddings.
- No parsing of `SKILL.md` — the only input is a `Registry` object.
- Deterministic for a given generated registry and skill ID.

A dangling `relatedSkills` reference (an ID no longer present in the
registry) is silently skipped rather than surfaced or thrown — registry
consistency, including dangling references, is `bun run validate`'s job
(see [`registry.md`](registry.md#validation)), not the recommendation
layer's.

## Usage

```ts
import { getRecommendations } from './recommendations.js';
import { buildRegistry } from './registry.js';

const registry = await buildRegistry();
const result = getRecommendations('hr-onboarding', registry);

// result.recommendations: SkillRecommendation[], ranked best-first
```

A CLI wrapper is also available for quick, interactive lookups:

```bash
bun run recommend hr-onboarding
bun run recommend hr-onboarding --limit 3
```

Requesting a skill ID that isn't in the registry throws
`UnknownSkillError` — callers should treat this as a client error (bad
input), not a registry-consistency problem.

## Intended consumer usage

- **Documentation / product surfaces** — a "skills you might also need"
  panel on a skill's detail page or future hosted/product surface.
- **CLI / scripts** — `bun run recommend <skill-id>` for a quick lookup
  during authoring or review.
- **Downstream tools** — anything that already has (or can build) a
  `Registry` object and wants ranked suggestions for a given skill,
  without re-implementing the ranking logic or parsing `SKILL.md`.

The Planner (`planner.ts`) is a separate consumer of the same
`relatedSkills` data (via the `related-skill` `SelectionReason`) and is
**not** changed by this module — the recommendation layer is purely
additive.

## Limitations

- Capped at 5 recommendations per skill by default; the generated registry
  currently caps `relatedSkills` at five after applying ranking and overrides.
- Recommendations come from the same `domain` as the source skill because
  the registry's related-skill candidate pool is same-domain. Cross-domain
  suggestions are out of scope for this module.
- Recommendations change when the generated registry changes. The registry
  can incorporate `registry/relevance-signals.json`, so usage-informed
  weighting is part of the current generation pipeline rather than a future
  roadmap-only feature. The signal artifact is optional; without it, the
  registry falls back to static tag-overlap ranking.
