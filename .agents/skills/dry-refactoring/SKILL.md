---
name: dry-refactoring
description: "Guided workflow to eliminate copy-paste duplication in packages/hr-skills-build and packages/skills-ref, detected by jscpd. Extract shared functions, constants, and types into their own files instead of growing an existing one."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# dry-refactoring

Guided workflow to eliminate copy-paste duplication in `packages/*` TypeScript source. Use after [`jscpd`](../jscpd/SKILL.md) has produced a clone list.

## Prerequisites

Run jscpd first — see [`jscpd`](../jscpd/SKILL.md) for the exact command this repo uses:

```bash
bunx jscpd@5 packages --reporters ai --format typescript
```

## Workflow

1. Run jscpd, scoped to `packages/` only (never `skills/`, see the `jscpd` skill for why).
2. Parse each clone line to identify the two duplicated locations (file + line range).
3. Read both code fragments and understand what they do — don't refactor blind.
4. Decide the refactor target using the placement rules below.
5. Extract the shared logic; update **all** call sites, not just the two jscpd reported.
6. Run `bun run typecheck` and `bun run test` (repo-wide or `--filter` to the affected package — see [`turbo`](../turbo/SKILL.md)).
7. Re-run jscpd to confirm the clone is gone.
8. Repeat, highest-impact cluster first (most repeated pattern, not just the first line in the report).

## Where extracted code goes in this repo

This repo already separates code by domain under `packages/hr-skills-build/src/{shared,validation,cli,planner,runtime,registry,search,build,evaluation}/` and `packages/skills-ref/src/`. Follow that structure — don't dump extracted helpers into whichever file happens to be open:

- **Duplicated logic used by 2+ files in the same domain folder** (e.g. two files under `src/validation/`) → new file in that same folder, e.g. `src/validation/security-helpers.ts`, imported by both.
- **Duplicated logic used across domain folders** (e.g. `src/cli/*` and `src/evaluation/*`) → `src/shared/`, alongside the existing `shared/constants.ts`, `shared/helpers.ts`, `shared/schema.ts`, `shared/types.ts`.
- **Duplicated logic across packages** (`hr-skills-build` and `skills-ref` both define it) → do **not** create a third copy in either package. Prefer keeping a single canonical definition in the package it conceptually belongs to (`skills-ref` for skill-file parsing primitives, `hr-skills-build` for build/registry/CLI concerns) and importing it from the other, or promote it to a small shared internal package if both genuinely need to own it independently. Never resolve this by copy-pasting into a third location.
- **Constants** → their own `constants.ts` in the relevant folder; don't fold them into a file that already holds functions or types.
- **Types/interfaces** → their own `types.ts` (or `*.types.ts` if `types.ts` already exists and would grow unrelated concerns) in the relevant folder — never appended to a functions file "for now."

## Naming collisions

Before extracting, `grep -rn "export (const|function|type|interface) <name>" packages` for the name you're about to reuse. If a same-named export already exists elsewhere in the monorepo:

- Prefer a more specific name over a generic one (e.g. `parseSkillFrontmatter` over `parse`) rather than renaming the existing export and risking unrelated churn.
- If both are genuinely the same concept split across two files, that's itself a duplication signal — consolidate into one export instead of two similarly-named ones.

## Refactoring strategies

**Extract function** — duplicate is a block of logic → shared function, called from both places.

**Extract module** — duplicate spans multiple files in the same or related domains → shared file per the placement rules above, imported by all call sites.

**Extract constant** — duplicate is repeated literal data or config → named constant in the domain's `constants.ts`.

**Extract type/interface** — duplicate or near-duplicate shape appears in two files → single definition in the domain's `types.ts`, both files import it.

Avoid the **template/base class** strategy in this codebase unless a real inheritance hierarchy already exists — this repo favors small composable functions and Valibot schemas (see [`valibot`](../valibot/SKILL.md)) over class hierarchies.

## Tips

- All call sites updated, not just the two jscpd reported — `grep` for other near-identical blocks jscpd's thresholds may have missed.
- Tests still pass after refactoring (`bun run test`), and `bun run typecheck` is clean.
- The extracted abstraction has a clear, descriptive name — see naming collisions above.
- If the duplication is between `packages/hr-skills-build` and `packages/skills-ref`, check whether a changeset is needed — see [`changeset`](../changeset/SKILL.md).
- Format with Biome after refactoring (`bun run format` or let `lefthook` catch it on commit) — see [`biome`](../biome/SKILL.md).
