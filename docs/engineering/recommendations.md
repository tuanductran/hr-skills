# Skill Recommendations

> Phase 6.1 of the [roadmap](../ROADMAP.md) — exposes the [Skill
> Registry](registry.md)'s existing `relatedSkills` graph as a user-facing
> "skills you might also need" API, instead of leaving it as internal
> [Planner](planner.md) input only.

## What it is

`packages/hr-skills-build/src/search/recommendations.ts` exports one function,
`getRecommendations(skillId, registry, limit?)`, that looks up a skill's
already-computed `relatedSkills` list from a `Registry` object (as produced
from `registry/skills.json`) and returns it in a stable, documented shape.

This is a read-only lookup layer, not a new ranking system. The ranking
itself already exists — `rankRelatedSkills()` in
`packages/hr-skills-build/src/registry/registry.ts` computes it once, at registry
generation time, and this module simply surfaces that result.

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
`RegistryEntry.relatedSkills` — same-domain skills ranked by shared-tag
overlap, ties broken alphabetically (see [`registry.md`'s field
notes](registry.md#field-notes)). This module does not re-rank, re-score,
or introduce any new signal:

- No AI ranking, embeddings, or runtime heuristics.
- No parsing of `SKILL.md` — the only input is a `Registry` object.
- Deterministic — the same registry state and skill ID always produce the
  same output, in the same order.

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
  panel on a skill's detail page (see [Phase 7's web
  platform](../ROADMAP.md#phase-7--product--web-platform)).
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

- Capped at 5 recommendations per skill by default (matching the cap
  already applied when `relatedSkills` is generated) — there is no larger
  pool to page through.
- Recommendations only ever come from the same `domain` as the source
  skill, because that's what `relatedSkills` was computed from. Cross-domain
  suggestions are out of scope for this module.
- Static per registry generation — recommendations only change when
  `registry/skills.json` is regenerated (`bun run registry`), not in
  response to usage patterns. Usage-informed weighting is tracked
  separately as a future roadmap item (see [6.1 in the
  roadmap](../ROADMAP.md#61-skill-intelligence)).
