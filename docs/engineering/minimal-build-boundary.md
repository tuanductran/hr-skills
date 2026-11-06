# Minimal Skill Build Boundary

- **Status:** Proposed implementation boundary
- **Date:** 2026-11-06
- **Related issue:** [#287](https://github.com/tuanductran/hr-skills/issues/287)
- **Product-scope authority:** [ADR 0001 — Markdown-First Product Scope](../decisions/0001-markdown-first-product-scope.md)

## Purpose and constraints

This document maps the current root commands and workspace surfaces to their actual repository use cases, then defines the smallest safe build/maintenance boundary to implement in follow-up changes.

It is an architecture and migration plan, not permission to delete code. It does not remove or rewrite skills, applications, packages, workflows, branches, release configuration, or generated artifacts. All existing HR skill Markdown remains canonical and must be preserved.

The repository currently has no root `scripts/` directory. Root commands dispatch directly into package scripts or third-party tools. The workspace currently includes the root, `apps/*`, `packages/*`, and `playground/*`.

## Current root command inventory

The classification below is based on the root `package.json` scripts and the package manifests currently on `main`.

| Root command | Current target / behavior | Classification | Proposed treatment |
|---|---|---|---|
| `build` | Turborepo build across all non-root workspaces | Deferred product build | Replace with an explicit retained-artifact build command; do not build deferred apps/packages by default |
| `build-skills` | `hr-skills-build#build-skills`; creates `dist/hr-skills.zip` and `dist/hr-skills.skill` | **Required: skill distribution** | Retain as the primary build operation |
| `dev` | Starts every workspace dev task | Deferred product development | Remove from the default root interface; app-specific dev commands remain only while those apps are retained |
| `test` | Runs tests in all workspaces | Maintenance, currently over-broad | Retain focused tests for retained build/Markdown tooling; do not require deferred product tests |
| `test:e2e` | Playwright tests for `hr-skills-web` | Deferred web app | Defer with `apps/web` |
| `typecheck` | TypeScript checks across all workspaces | Maintenance, currently over-broad | Retain typechecking only for retained tooling |
| `check` | Biome check over the repository | Required repository hygiene | Retain, scoped to maintained source/configuration |
| `lint` | Biome check with `--write` | Local convenience, mutating | Do not use as a CI validation command; prefer non-mutating `check` |
| `format` | Biome formatter with `--write` | Local convenience, mutating | Retain only if the chosen source/tooling format requires it |
| `lint:md` | markdownlint and case-police over Markdown/config trees | **Required: Markdown quality** | Retain and scope explicitly to maintained Markdown |
| `lint:md:fix` | Auto-fixes Markdown lint/case issues | Local maintenance convenience | Retain only as an opt-in authoring command |
| `lint:links` | Checks links in `docs/` and `skills/` | **Required: Markdown quality** | Retain; ensure generated/external links are handled deterministically |
| `knip` | Detects unused files/exports/dependencies | Maintenance diagnostic | Retain during migration; scope after deferred work is isolated |
| `sync` | Rebuilds `.claude-plugin/marketplace.json` and root `SKILL.md` router from discovered skills | Required only while those derived Claude distribution files remain supported | Keep as an explicit generator; verify generated diffs and avoid editing skill knowledge |
| `validate` | Runs the skill validator in `hr-skills-build` | **Required: Markdown quality/build integrity** | Retain; split domain-neutral Markdown/Agent Skill checks from deferred planner/registry checks |
| `matrix` | Generates `docs/engineering/skill-matrix.md` from skill frontmatter and optional content folders | Derived documentation maintenance | Optional; retain only if the inventory remains a maintained user-facing artifact |
| `registry` | Generates the CLI package registry | Deferred registry product | Defer with the CLI/registry surface |
| `api-docs` | Generates TypeScript API reference through `hr-skills-tsdoc` | Deferred TypeScript library documentation | Defer with public TypeScript package APIs |
| `api-docs:check` | Checks generated TypeScript API reference | Deferred TypeScript library documentation | Defer with `api-docs` |
| `docs-data` | Generates `apps/web/data/skills.json` | Deferred web app data pipeline | Defer with `apps/web` |
| `signals` | Generates relevance-signal data for discovery/recommendation | Deferred intelligence/recommendation | Defer |
| `plan` | CLI planner command | Deferred planner/runtime product | Defer |
| `discover` | CLI skill discovery command | Deferred CLI product | Defer |
| `find` | Alias for CLI discovery/search | Deferred CLI product | Defer |
| `list` | CLI skill listing command | Deferred CLI product | Defer |
| `init` | CLI project initialization command | Deferred CLI product | Defer |
| `recommend` | CLI skill recommendation command | Deferred intelligence/recommendation | Defer |
| `execute` | CLI workflow execution command | Deferred runtime/orchestration | Defer |
| `evaluate` | CLI evaluation command | Deferred evaluation product | Defer |
| `skill-review` | CLI skill review command | Maintenance candidate; current implementation belongs to the larger CLI package | Reassess and retain only if it can operate as a focused Markdown-quality check without planner/runtime dependencies |
| `changeset` | Changesets CLI | Release maintenance | Keep only if publishing versioned npm packages remains in scope |
| `release` | Applies Changesets version updates | Release maintenance | Same condition as `changeset`; not part of skill build |
| `prepare` | Installs Lefthook hooks | Contributor workflow maintenance | Optional repository hygiene |
| `preinstall` | Enforces Bun via `only-allow` | Toolchain policy | Retain only while Bun is the agreed toolchain; this issue does not decide a migration |
| `commitlint` | Commit message validation | Contributor workflow maintenance | Optional repository hygiene |

### Root-level dependencies implied by commands

- Workspace orchestration: `turbo` is required only while root scripts dispatch to workspace tasks.
- Markdown quality: `markdownlint-cli`, `case-police`, and `markdown-link-check`.
- Source quality: `@biomejs/biome`; TypeScript is required only for retained TypeScript tooling.
- Skill generation/validation currently pulls in `@clack/prompts`, `valibot`, `yaml`, and the internal `hr-skills-ref` package.
- Release/contributor tooling: Changesets, Commitlint, Lefthook, and `only-allow` are not runtime dependencies of the skill archive.

Dependencies should be removed only after their last retained consumer is removed or replaced and the resulting lockfile/build/CI behavior is verified.

## Package-level script entrypoints

The root command table above describes the supported root interface. This table records the underlying package-level scripts so that workspace tasks are not hidden by Turborepo indirection.

| Workspace manifest | Package-level scripts | Actual use case | Classification |
|---|---|---|---|
| `packages/hr-skills-build` | `build`, `build-skills`, `dev`, `test`, `typecheck`, `validate`, `sync`, `matrix`, `docs-data` | Bundle the build package; create ZIP/`.skill` archives; watch/build during development; run package tests/types; validate skills; regenerate marketplace/router metadata; generate matrix and web data | Keep only archive build, focused validation, and any explicitly retained metadata generator; package build/watch/test/typecheck exist only as implementation support |
| `packages/hr-skills-ref` | `build`, `dev`, `test`, `typecheck` | Bundle and verify shared Agent Skill parsing, schema, model, loader, prompt, and validation APIs | Retain only if the narrowed build/validation path has multiple real consumers; otherwise merge needed primitives into the retained build package |
| `packages/hr-skills` | `build`, `test`, `dev`, `typecheck`, `prepublishOnly`, `prepack`, `postpack`, `discover`, `find`, `list`, `init`, `recommend`, `plan`, `execute`, `evaluate`, `skill-review`, `registry`, `signals` | Publishable CLI packaging and command entrypoints for discovery, initialization, planning/execution, recommendation, evaluation, skill review, registry and relevance-signal generation | Defer the CLI product and its package lifecycle scripts; separately assess `skill-review` for extraction into Markdown maintenance tooling |
| `packages/hr-skills-tsdoc` | `build`, `dev`, `api-docs`, `api-docs:check`, `typecheck` | Bundle and run TSDoc API reference generation/checking using `ts-morph` | Defer with public TypeScript package APIs |
| `apps/web` | `docs-data`, `dev`, `build`, `typecheck`, `test:e2e` | Generate catalog JSON and run/build/typecheck the Next.js documentation app; run Playwright E2E | Defer with the web app |
| `apps/discord-bot` | `dev`, `start`, `deploy-commands`, `typecheck` | Run the Discord bot, deploy slash commands, and typecheck the adapter | Defer with the Discord integration |
| `playground/next-app` | `dev`, `build` | Run/build a Next.js integration experiment | Defer |
| `playground/vite-app` | `dev`, `build` | Run/build a Vite integration experiment | Defer |

The package-level `build`, `dev`, `test`, and `typecheck` commands are not automatically core product capabilities: they are engineering tasks for the package that owns them. They should remain only for source packages that survive the boundary reduction. In particular, package build/watch commands are not part of the end-user Markdown-to-archive workflow.

## Workspace and package inventory

| Workspace | Current responsibility and evidence | Classification | Target boundary |
|---|---|---|---|
| Root `hr-skills-monorepo` | Owns root commands, Bun workspace/catalog, Biome/Markdown/Changesets/Commitlint configuration | Required repository maintenance | Keep a small root manifest and explicit scripts; remove broad orchestration when no longer needed |
| `packages/hr-skills-build` | Build archive generation, skill sync/router generation, validation, registry discovery, docs loading/data, planner, runtime, search, evaluation, service APIs; package exports broad client/server APIs | Mixed: essential build/validation plus deferred product features | Retain only build/archive, skill discovery/parser/metadata, and Markdown validation modules required by the retained scripts; isolate/remove other modules in separately reviewed work |
| `packages/hr-skills-ref` | Shared Agent Skill parser, schemas, models, loaders, prompts, validators, filesystem root/path helpers; currently consumed by build package and apps | Reusable API candidate | Retain only the smallest parser/schema/validator/path API required by build and validation; remove client/server split only after all consumers are migrated |
| `packages/hr-skills` | Publishable CLI package: discover/list/init, plan/execute, recommend, evaluate, registry/signals, skill review; depends on build/ref | Deferred CLI product | Do not include in the default skill build path; assess as a separate retirement/archive decision |
| `packages/hr-skills-tsdoc` | TypeScript API-doc generator using `ts-morph` | Deferred library documentation | Defer with public TS package APIs |
| `apps/web` | Next.js documentation/catalog app; generates `apps/web/data/skills.json`; Playwright E2E | Deferred web surface | Exclude from default build/test/typecheck |
| `apps/discord-bot` | Discord bot using Discord.js and build/ref APIs | Deferred platform adapter | Exclude from default build/test/typecheck |
| `playground/next-app` | Next.js integration playground consuming build package | Deferred experiment | Exclude from default build |
| `playground/vite-app` | Vite integration playground consuming build package | Deferred experiment | Exclude from default build |

There is no current root `scripts/` directory. This is not a gap that requires adding wrappers around every existing command. Add an entrypoint only for a retained, user-facing repository operation.

## Minimal retained build path

The retained end-to-end path should be explicit and reproducible:

1. **Canonical inputs:** root `SKILL.md`, all `skills/**/SKILL.md`, and supported skill-owned Markdown content. These files remain hand-authored source; no TypeScript/JSON registry becomes a competing source of HR knowledge.
2. **Discover and parse:** enumerate skill directories and parse frontmatter/metadata from Markdown. Fail clearly on invalid or missing required inputs.
3. **Validate:** check Agent Skills structure/frontmatter, required Markdown structure, internal references/links, and distribution safety rules. Validation must not require planner, runtime, recommendation, registry service, web, or Discord code.
4. **Generate derived routing/distribution metadata:** update the root router and Claude marketplace manifest only if these remain supported distribution artifacts. Generated outputs must be deterministic and reproducible from Markdown.
5. **Package:** produce the documented `.zip` and `.skill` artifacts from an explicit allowlist. Do not leak internal docs, source code, app code, tests, or unrelated repository files.
6. **Verify:** validate archive contents, required files, stable paths, and repeat-build determinism; run Markdown lint/link checks and focused tests.

The current implementation already has an archive builder at `packages/hr-skills-build/src/server/build/build-skills.ts`, a sync operation at `packages/hr-skills-build/src/server/build/sync.ts`, a router generator at `packages/hr-skills-build/src/server/build/router.ts`, and validation at `packages/hr-skills-build/src/server/validation/validate.ts`. The archive builder currently uses `hr-skills-ref/server` for `ROOT_DIR`; sync uses shared discovery and metadata parsing; validation currently reaches into registry and other broader subsystems. These are concrete coupling points to untangle rather than reasons to retain the whole package.

## Proposed scripts/ and packages/ shape

### `scripts/`

Use thin, named entrypoints for retained operations only, for example:

- `scripts/build-skills.ts` — invokes the retained build API and reports output paths.
- `scripts/validate-skills.ts` — invokes the retained Markdown/Agent Skill validator.
- `scripts/sync-skill-metadata.ts` — optional, only if generated router/marketplace metadata remains supported.
- `scripts/generate-skill-matrix.ts` — optional, only if the matrix remains maintained.

A script may parse command-line flags, call a package API, set the exit code, and format concise output. It must not duplicate ZIP, parser, validator, discovery, or filesystem business logic. Do not create wrappers for deferred commands.

### `packages/`

Do not preserve package boundaries for their own sake. The preferred target is one private, reusable build-tooling package (or a smaller set only where a real dependency boundary is demonstrated) containing:

- skill Markdown discovery and frontmatter parsing;
- schema/structural validation and distribution-safety checks;
- deterministic router/marketplace metadata generation if retained;
- deterministic ZIP/`.skill` packaging.

No public client/server dual entrypoint is required for a private build tool. No exported planner, runtime, service, recommendation, evaluation, registry, web, or Discord API belongs in the retained build surface.

The existing `hr-skills-ref` is a candidate source for reusable parsing/validation primitives, but its current public surface also includes prompt helpers and filesystem-backed APIs. Consolidate or retain it only after import-graph evidence shows that the selected APIs are shared by multiple retained entrypoints. If only the build package consumes an API, keeping a separate package may add more boundary overhead than value.

## Migration and removal safeguards

The following sequence is required before implementation removes or archives any existing surface:

1. Build a consumer/import graph for each candidate module, export, workspace dependency, and third-party dependency.
2. Record each candidate as retain, narrow, archive, or remove, with exact consumers and replacement paths.
3. Migrate retained scripts to thin entrypoints and retained APIs to the minimal package boundary.
4. Update root commands, workspace definitions, lockfile, TypeScript/Biome configuration, CI workflows, release configuration, and docs in the same coherent change set.
5. Run the retained build twice and compare artifact hashes; inspect archive entries and validate generated outputs.
6. Run Markdown checks, focused tests, and all relevant CI checks.
7. Remove deferred packages/apps only in separate, reviewable PRs after their external consumers, publishing implications, and branch/workflow references are accounted for.

No HR skill directory or skill content is a candidate for removal under this issue. The existing product-scope ADR remains authoritative: deferral is not deletion approval.

## Current gaps and implementation decisions still open

- Whether Claude marketplace metadata and automatic root-router synchronization are required distribution contracts or can become manual/reviewed generated artifacts.
- Whether the generated skill matrix is still a maintained product artifact.
- Whether the CLI npm package is still published/consumed externally; this must be checked before any package retirement.
- Whether Bun/Turborepo remains the final toolchain; this document makes no migration mandate.
- The validator currently combines Markdown checks with registry, planner, security, and semantic checks. The retained validation contract must be specified before extracting modules.
- The archive builder's ZIP implementation and file allowlist need focused tests for reproducibility and leakage prevention.

## Decision summary

Retain the Markdown-first build, structural validation, Markdown quality checks, and deterministic distribution packaging. Keep only the reusable APIs actually needed to implement those operations. Treat every other package/app/command as deferred until dependency and consumer evidence justifies retention. Implement the narrowing in follow-up PRs; this document itself does not delete or alter existing implementation.
