# Skill Registry

> Phase 4.1 of the [roadmap](../ROADMAP.md) — the machine-readable foundation for
deterministic AI agent routing over the skill catalog.

## What it is

`registry/skills.json` is a single, generated JSON file that indexes every
skill in `skills/` with the metadata a runtime agent needs to discover,
route to, and reason about skills — without parsing `SKILL.md` prose.

`SKILL.md` stays exactly as it is today: lightweight frontmatter (`name`,
`description`, `metadata.author`, `metadata.version`) plus human/LLM-readable
documentation. No routing metadata has been added to skill frontmatter, and
none should be — the registry is where that metadata lives.

## Why a separate generated file, not richer frontmatter

Two designs were considered:

1. **Expand `SKILL.md` frontmatter** with `domain`, `tags`, `aliases`,
   `capabilities`, etc., on every skill.
2. **Generate a registry** from existing content and a small amount of
   already-existing classification logic.

Option 2 was chosen because it keeps `SKILL.md` focused on documentation,
avoids manually maintained duplicate metadata, and derives registry data from
existing repository sources.

## File location

```text
registry/
  skills.json
```

`registry/` sits at the repository root, as a sibling of `docs/`, `skills/`,
and `packages/`. It is a generated, committed artifact rather than build
cache.

## Schema

```jsonc
{
  "schemaVersion": 1,
  "generatedAt": "2026-07-23",
  "skillCount": 146,
  "skills": [
    {
      "id": "hr-onboarding",
      "name": "hr-onboarding",
      "version": "1.0.0",
      "description": "...",
      "tier": "full",
      "domain": "onboarding-offboarding",
      "tags": [],
      "aliases": ["onboarding"],
      "capabilities": ["Creating onboarding plans, checklists, and timelines", "..."],
      "triggerPhrases": ["create an onboarding plan", "..."],
      "paths": { "content": true, "prompts": true, "examples": true },
      "dependencies": [],
      "relatedSkills": ["hr-offboarding", "hr-employee-lifecycle", "..."]
    }
  ]
}
```

The schema is defined with Valibot in
`packages/hr-skills-build/src/client/shared/schema.ts` (`RegistrySchema`) and typed in
`packages/hr-skills-build/src/client/shared/types.ts` (`Registry`, `RegistryEntry`). Bump
`schemaVersion` (`REGISTRY_SCHEMA_VERSION` in `constants.ts`) if you make a
breaking change to the shape of an entry.

### Field notes

- **`domain`** — one of the routing categories already defined by the
  classifier, or `uncategorized`.
- **`tags`** — free-form cross-reference tags from the same classifier.
- **`aliases`** — one derived short-form lookup key per skill: the id with
  its `hr-` prefix stripped (`hr-onboarding` → `onboarding`).
- **`dependencies`** — skill IDs commonly paired with a skill when that
  relationship is explicitly authored by the classifier metadata.
- **`relatedSkills`** — up to 5 other skills. Generation first creates a
  deterministic static candidate ranking from shared-tag overlap. When the
  committed relevance-signal table is available, observed co-selection
  evidence can re-rank those candidates and can also surface strongly
  observed cross-domain relationships. `RELATED_SKILL_OVERRIDES` can preserve
  maintainer-approved relationships before the final five-item cap. Without a
  relevance-signal table, generation falls back to the static ranking.

## Generation

```bash
bun run registry
```

This runs `packages/hr-skills/src/cli/generate-registry.ts`, which calls
the pure function `buildRegistry()` (`packages/hr-skills-build/src/server/registry/registry.ts`)
and writes the result to `registry/skills.json`.

When `registry/relevance-signals.json` is available and valid, its observed
co-selection signals are incorporated into the related-skill order. The
maintainer override map is applied before the final five-item cap.

The generated file also contains `generatedAt` (today's date), so that field
can change when the registry is regenerated even when skill content does not.
The committed registry should be refreshed through the normal generation
workflow rather than hand-edited.

Regenerate the registry any time skills are added, removed, or reclassified,
and commit the result — the same workflow as `bun run matrix`.

## Validation

`bun run validate` checks registry consistency by recomputing the expected
registry with the same signal-aware generation path and comparing it with the
committed artifact, while ignoring `generatedAt`. It also checks schema
validity, duplicate IDs, dangling references, and circular dependencies.

## Build integration

- `packages/hr-skills/package.json` — `registry` script
- root `package.json` — `registry` script
- `turbo.jsonc` — `registry` task
- `.github/workflows/matrix.yml` — regenerates and commits the registry on
  pushes to `main`
- `bun run validate` — fails CI if the committed registry is stale or
  internally inconsistent

## Extension guidelines

- **Adding a field to every entry:** add it to `RegistryEntry` (`types.ts`),
  `RegistryEntrySchema` (`schema.ts`), and populate it in `buildRegistry()`.
  Prefer deriving it from existing repository sources over introducing a new
  manually maintained source of truth.
- **Bumping the schema:** increment `REGISTRY_SCHEMA_VERSION` in
  `constants.ts` for breaking shape changes. Additive optional fields do not
  require a bump.
- **New validation rules:** add them to `validateRegistryConsistency()` in
  `validate-registry.ts`, following the existing validation pattern.
- **Consuming the registry:** import `buildRegistry()` from
  `hr-skills-build/server` rather than reading and re-parsing generated
  `registry/skills.json` by hand.
