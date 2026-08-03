---
name: jscpd
description: "Copy-paste detector for the hr-skills TypeScript packages (packages/hr-skills-build, packages/skills-ref). Run jscpd to detect duplicated code and measure duplication percentages before refactoring."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# jscpd

Copy-paste detector for source code. Use this skill to run jscpd against `packages/*` in this repo and understand its output before handing clones to [`dry-refactoring`](../dry-refactoring/SKILL.md).

> Not to be confused with `packages/hr-skills-build/src/validation/detect-duplicates.ts`, which detects duplicated **HR skill content** (`skills/hr-*/SKILL.md`) at publish time. `jscpd` here targets **TypeScript source code** in `packages/*` only — keep the two concerns separate and never merge their logic.

## Quick start

This repo uses Bun, so prefer `bunx` over `npx`:

```bash
# Scope to the TypeScript packages only — skip skills/ (markdown) and generated output
bunx jscpd@5 packages \
  --format typescript \
  --mode strict \
  --min-lines 3 \
  --min-tokens 20 \
  --reporters console,json,markdown \
  --output duplicate-report \
  --ignore "**/node_modules/**,**/dist/**,**/*.md"

# Compact output optimized for agents
bunx jscpd@5 packages --reporters ai --format typescript
```

`duplicate-report/` is a generated artifact — do not commit it; add it to `.gitignore` if it isn't already covered.

## AI reporter output format

The `ai` reporter produces compact, token-efficient output:

```text
Clones:
packages/hr-skills-build/src/ validate.ts:53-59 ~ security.ts:89-94
---
N clones · X% duplication
```

- **Same directory**: shared path prefix factored out
- **Different paths**: full path shown for both sides

## Options used in this repo

| Option | Value here | Why |
|--------|------------|-----|
| `--format typescript` | scoped to `.ts` | `skills/**/*.md` content duplication is handled by `packages/hr-skills-build/src/validation/detect-duplicates.ts`, not jscpd |
| `--mode strict` | exact-match clones | avoids false positives from formatting-only similarity (Biome already normalizes formatting) |
| `--min-lines 3` / `--min-tokens 20` | low thresholds | this is a small, young codebase; catch clones early before they compound |
| `--ignore` | `node_modules`, `dist`, `*.md` | matches `.gitignore` / build output conventions |

Full option reference: `bunx jscpd@5 --help`, or the [upstream configuration docs](https://jscpd.dev/getting-started/configuration).

## When to run

- Before opening a PR that adds or edits code under `packages/hr-skills-build/src/**` or `packages/skills-ref/src/**`
- After a large refactor, to confirm clones were actually eliminated (re-run, don't assume)
- Optionally wired into `lefthook.yml` as a pre-push (not pre-commit — it's slower than `biome`) step; see [CI and hooks](https://jscpd.dev/ci-and-hooks) for the pattern this repo's `lefthook.yml` follows for other tools

## Tips

- Run jscpd against `packages/`, never against the full repo root — `skills/hr-*/SKILL.md` files are prompt content, not code, and will produce noisy, irrelevant clones.
- Test files (`packages/*/test/**`) legitimately duplicate `describe`/`it`/`expect` scaffolding — don't chase 100% duplication-free tests. Prioritize `src/**` clones.
- Hand the clone list to [`dry-refactoring`](../dry-refactoring/SKILL.md) rather than refactoring ad hoc; it enforces "extract, don't just rename."
