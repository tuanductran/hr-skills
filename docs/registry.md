# Skill Registry

> Phase 4.1 of the [roadmap](ROADMAP.md) — the machine-readable foundation for
> deterministic AI agent routing over the skill catalog.

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

Option 2 was chosen because:

- It keeps `SKILL.md` focused on its current job (human-readable skill
  documentation) instead of turning it into a metadata store that 146 files
  would need to be kept in sync by hand.
- Almost all of the metadata the registry needs **already exists** somewhere
  in the repository — it just isn't indexed in one machine-readable place:
  - Domain + tags → `classifySkill()` in `packages/hr-skills-build/src/classifier.ts`
    (already used to build the root `SKILL.md` router)
  - Capabilities → the `## Supported tasks` section, already parsed by
    `parseSkillMeta()`
  - Trigger phrases → the `## Key prompts` section, already parsed by
    `parseSkillMeta()`
  - Tier (full/partial/bare) → subdirectory presence, already computed for
    `docs/skill-matrix.md`
- Generating the registry from these existing sources means there is exactly
  one place each fact is authored — the registry can never drift from
  `SKILL.md` or the classifier the way hand-maintained duplicate metadata
  would.

## File location

```text
registry/
  skills.json
```

`registry/` sits at the repository root, as a sibling of `docs/`, `skills/`,
and `packages/`. This matches the existing convention for other generated,
committed artifacts (`docs/skill-matrix.md`, `.claude-plugin/marketplace.json`)
rather than introducing a hidden `.generated/` directory — the registry is a
first-class, browsable part of the repository, not build cache.

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
      "tier": "full",           // "full" | "partial" | "bare"
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

The schema is defined with [valibot](https://valibot.dev) in
`packages/hr-skills-build/src/schema.ts` (`RegistrySchema`) and typed in
`packages/hr-skills-build/src/types.ts` (`Registry`, `RegistryEntry`). Bump
`schemaVersion` (`REGISTRY_SCHEMA_VERSION` in `constants.ts`) if you make a
breaking change to the shape of an entry.

### Field notes

- **`domain`** — one of the 12 routing categories already defined in
  `classifier.ts` (`talent-acquisition`, `compensation-rewards`, etc.), or
  `uncategorized`.
- **`tags`** — free-form cross-reference tags from the same classifier
  (`engineering`, `ai`, `vietnam`, `core`, ...).
- **`aliases`** — one derived short-form lookup key per skill: the id with
  its `hr-` prefix stripped (`hr-onboarding` → `onboarding`). Intentionally
  simple; extend `deriveAliases()` in `registry.ts` if richer aliasing is
  needed later.
- **`dependencies`** — skill IDs a skill is commonly paired with, extracted
  from `CATEGORY_META.preamble` in `classifier.ts`. Today only the
  `technical-hiring` domain has a preamble (pointing technical specialist
  skills at `hr-recruiting`, `hr-job-description`, `hr-interviewing`), so
  only those skills have non-empty `dependencies`. This is deliberate — it's
  real, already-authored guidance rather than a guessed dependency graph.
- **`relatedSkills`** — up to 5 other skills in the same `domain`, ranked by
  shared-tag overlap (ties broken alphabetically). A minimal, fully
  deterministic recommendation graph with no manual curation required.

## Generation

```bash
bun run registry
```

This runs `packages/hr-skills-build/src/generate-registry.ts`, which calls
the pure function `buildRegistry()` (`packages/hr-skills-build/src/registry.ts`)
and writes the result to `registry/skills.json`. `buildRegistry()` has no
side effects, which is what lets validation reuse it (see below) instead of
re-implementing the same logic.

`buildRegistry()` is deterministic for a given filesystem state: the same
`skills/` content always produces the same `skills` array in the same order
(sorted by `id`). The only field that changes run-to-run without a content
change is `generatedAt` (today's date) — the same convention already used by
`docs/skill-matrix.md`.

Regenerate the registry any time skills are added, removed, or reclassified,
and commit the result — the same workflow as `bun run matrix`.

## Validation

`bun run validate` (which every PR and the `validate.yml` / `matrix.yml` CI
workflows already run) now also calls `validateRegistryConsistency()`
(`packages/hr-skills-build/src/validate-registry.ts`), which checks:

1. **File exists and is valid JSON** conforming to `RegistrySchema`.
2. **Staleness** — recomputes the registry in memory via `buildRegistry()`
   and deep-compares it to the committed file (ignoring `generatedAt`). If
   they differ, validation fails with instructions to rerun
   `bun run registry`. This is the same "recompute and diff" pattern already
   used for `marketplace.json` and the root `SKILL.md` router.
3. **Duplicate IDs.**
4. **Dangling references** — every ID in `dependencies` and `relatedSkills`
   must resolve to a real skill in the registry.
5. **Circular dependencies** — an iterative depth-first search (no recursion
   depth limit) over the `dependencies` graph, run from every skill.

All failures report a skill ID and an actionable message, consistent with
every other validator in `validate.ts`.

## Build integration

- `packages/hr-skills-build/package.json` — `registry` script
  (`bun src/generate-registry.ts`)
- root `package.json` — `registry` script (`turbo run registry --filter=hr-skills-build`)
- `turbo.jsonc` — `registry` task (uncached, output `registry/skills.json`)
- `.github/workflows/matrix.yml` — regenerates and commits
  `registry/skills.json` on every push to `main`, alongside
  `docs/skill-matrix.md`
- `bun run validate` — fails CI if the committed registry is stale or
  internally inconsistent (see above)

## Extension guidelines

- **Adding a field to every entry:** add it to `RegistryEntry`
  (`types.ts`), `RegistryEntrySchema` (`schema.ts`), and populate it in
  `buildRegistry()` (`registry.ts`). Prefer deriving it from something that
  already exists in the repository (frontmatter, a `SKILL.md` section, the
  classifier) over introducing a new manually maintained source of truth.
- **Bumping the schema:** increment `REGISTRY_SCHEMA_VERSION` in
  `constants.ts` for breaking shape changes (removing/renaming a field,
  changing a field's type). Additive, optional fields don't require a bump.
- **New validation rules:** add them to `validateRegistryConsistency()` in
  `validate-registry.ts`, following the existing pattern of pushing
  `{ skill, message }` issues rather than throwing.
- **Consuming the registry from other packages:** import
  `buildRegistry()` from `hr-skills-build` (workspace package) rather than
  reading and re-parsing `registry/skills.json` by hand, the same way
  `sync.ts` and `validate.ts` already do.
