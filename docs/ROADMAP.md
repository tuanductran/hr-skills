# HR Skills — Project Roadmap

> **Repository:** [tuanductran/hr-skills](https://github.com/tuanductran/hr-skills)
> **Current version:** v1.0.4 | **License:** MIT | **Runtime:** Bun 1.3.14 | **Orchestrator:** Turborepo 2.10.4
> **Maintainer:** Tuan Duc Tran | **Status:** Actively maintained

This roadmap documents the current state, architecture, and future direction of the HR Skills library — a Bun/Turborepo monorepo hosting 146 domain-specific Agent Skills for Human Resources professionals.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Statistics](#repository-statistics)
3. [Architecture](#architecture)
4. [Current State Assessment](#current-state-assessment)
5. [Validation & Quality](#validation--quality)
6. [CI/CD & Workflows](#cicd--workflows)
7. [Known Issues & Gaps](#known-issues--gaps)
8. [Prioritized Action Items](#prioritized-action-items)
9. [Release Roadmap](#release-roadmap)
10. [Success Metrics](#success-metrics)

---

## Project Overview

**HR Skills** is a structured, versioned library of 146 domain-specific AI skills for HR professionals, packaged as `SKILL.md` files conformable to the [Agent Skills](https://agentskills.io/) open format. Each skill is validated against strict quality rules and distributed via:

- **Claude Code / claude.ai**: Direct installation from `.claude-plugin/marketplace.json`
- **skills.sh**: `npx skills add tuanductran/hr-skills`
- **Direct clone**: `git clone https://github.com/tuanductran/hr-skills.git`

### Core Philosophy

**Content is code** — every `SKILL.md` is treated as a versioned artifact with:
- Required frontmatter (name, description, author, version)
- Required sections (Supported tasks, Key prompts, Tips)
- Enforced length limits (500-line max body, 1000-char min content)
- Automated validation in CI via `bun run validate`

### Target Audience

- HR managers, HRBPs, People Ops professionals
- Technical recruiters and engineering hiring teams (18 specialized hiring skills: `hr-frontend`, `hr-backend`, `hr-devops`, etc.)
- Vietnam-based HR teams (`hr-vietnam-context` as a cross-cutting differentiator)
- AI developers building on the `skills-ref` generic Agent Skills library
- Contributors maintaining the repository

---

## Repository Statistics

| Metric | Count | Notes |
|---|---:|---|
| HR skills (`skills/hr-*`) | 146 | Comprehensive HR domain coverage |
| Meta/maintainer skills (`.agents/skills/*`) | 12 | Repository maintenance via AI agents |
| Total `SKILL.md` files | 159 | 146 HR + 12 .agents + 1 root router |
| Skills with `content/` | ~70 | Human-readable companion guidance |
| Skills with `examples/` | ~70 | Practical end-to-end workflows |
| Skills with `prompts/` | ~36 | Reusable, topic-grouped prompt libraries |
| **Bare skills** (SKILL.md only) | 76 (52%) | Acceptable starting tier per design |
| **Partial skills** (content + examples) | 34 (23%) | Largest incomplete tier |
| **Full skills** (all three dirs) | 36 (25%) | Gold standard tier |
| Internal TypeScript packages | 2 | `hr-skills-build`, `skills-ref` |
| Unit test files | 9 | Coverage across both packages |
| GitHub Actions workflows | 5 | lint, test, typecheck, validate, knip |
| Claude Code slash commands | 4 | new-skill, validate, sync-and-validate, release-check |

---

## Architecture

### Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime & Package Manager | Bun | 1.3.14 |
| Monorepo Orchestration | Turborepo | 2.10.4 |
| Language | TypeScript | 6.0.3 (strict mode, ESM) |
| Schema Validation | Valibot | 1.4.2 |
| Formatter/Linter | Biome | 2.5.3 (tabs, width 90, single quotes) |
| Markdown QA | markdownlint-cli + case-police | Latest |
| Commit Discipline | Commitlint + Lefthook | Conventional Commits enforced |
| Release Automation | changelogen | Local `bun run release` only |

### Package Structure

```text
hr-skills/ (root, v1.0.4, private)
├── packages/
│   ├── hr-skills-build/       ← Validation, sync, CLI tooling
│   └── skills-ref/            ← Generic Agent Skills library (Apache-2.0)
├── skills/hr-*/               ← 146 HR content packages (not in workspaces.packages)
├── .agents/skills/*           ← 12 meta skills for repository maintenance
├── .claude/                   ← Claude Code commands & configuration
├── .claude-plugin/            ← Generated marketplace.json
└── docs/                      ← Specification & documentation
```

### Validation Pipeline

Two-layer architecture:
1. **Generic layer** (`skills-ref.validate()`): Agent Skills format conformance
2. **Policy layer** (`hr-skills-build` rules): Repository-specific checks
   - Name matches directory name
   - Description ≥ 50 characters
   - Author is exactly "Tuan Duc Tran"
   - Metadata version present
   - Required sections present
   - Content ≥ 1000 characters
   - Body ≤ 500 lines
   - 8-12 supported tasks
   - 4-6 tips
   - Blank line before every list

---

## Current State Assessment

### What's Working Well ✅

- **5 complete CI workflows**: lint, test, typecheck, validate, knip all run on PR
- **Strong testing**: 9 unit test files with meaningful coverage
- **Bun-only enforcement**: `preinstall` hook prevents npm/pnpm/yarn
- **Skill matrix generation**: `scripts/generate-skill-matrix.ts` generates `docs/skill-matrix.md`, auto-committed by `matrix.yml` CI on every push to `main` when `skills/` changes
- **Markdown quality**: Biome + markdownlint + case-police enforce consistency
- **Dependency management**: Renovate configured with sensible grouping
- **Security awareness**: `.whitesource` file present, security policy documented
- **Clean monorepo setup**: Turborepo caching, workspace packages correctly scoped

### Inconsistencies Requiring Clarification 🟨

1. **Dependabot vs. Renovate**: `.github/dependabot.yml` exists but purpose isn't clearly documented (security updates only vs. general version bumps). Recommend consolidating to Renovate alone.

2. **Mend/Whitesource**: `.whitesource` file present but not actively used per current project scale. Document as "future" or remove.

3. ~~**Template duplication**~~ ✅ **Resolved (PR #74):** Single-sourced to `.github/skill-template.md`, referenced by `CONTRIBUTING.md` and `.claude/commands/new-skill.md`

4. **Validator rule gaps**: Several documented rules in `docs/format.md` aren't automated in `validate.ts`:
   - Prompt subtopic structure: 3-6 subtopics, 4-7 prompts each
   - `[placeholder]` bracket syntax validation
   - Router ↔ filesystem ↔ marketplace.json three-way consistency check

5. ~~**Package naming inconsistency**~~ ✅ **Resolved (feat/v1.2.0):** Both packages' `README.md` files now document the intentional distinction — `hr-skills-` prefix signals HR-domain-specific tooling, no prefix signals domain-agnostic library.

6. ~~**hr-skills-build has no `build` script**~~ ✅ **Resolved (feat/v1.2.0):** Explicit no-op `build` script added with a comment explaining the CLI-tool rationale. Package README documents the intentional distinction.

7. **Two ValidationError symbols**:
   - `skills-ref/src/errors.ts`: ValidationError (class)
   - `hr-skills-build/src/types.ts`: ValidationError (interface)
   - ✅ **Resolved in PR #74:** `hr-skills-build`'s type renamed to `SkillValidationIssue`

### Metadata Issues 🔴

- **`.agents/skills/valibot/SKILL.md`** has non-standard metadata:
  - `author: open-circle` (not "Tuan Duc Tran")
  - `version: "1.0"` (not "1.0.0")
  - Would fail repo validation if `.agents/` were in scope
  - **Action:** Either normalize or explicitly exempt `.agents/` from HR-skill rules

---

## Validation & Quality

### Current Rules (13 implemented)

| Rule | Layer | Enforced by |
|---|---|---|
| Generic Agent Skills conformance | skills-ref | SkillPropertiesSchema |
| Name present & matches directory | hr-skills-build | validateFrontmatter() |
| Description ≥ 50 chars | hr-skills-build | validateFrontmatter() |
| Author = "Tuan Duc Tran" | hr-skills-build | validateAuthor() |
| Version present | hr-skills-build | validateFrontmatter() |
| Required sections present | hr-skills-build | validateRequiredSections() |
| Content ≥ 1000 chars | hr-skills-build | validateContentLength() |
| Body ≤ 500 lines | hr-skills-build | validateLineCount() |
| 8-12 supported tasks | hr-skills-build | validateSupportedTasks() |
| 4-6 tips | hr-skills-build | validateTips() |
| Blank line before list | hr-skills-build | validateBlankLines() |
| Prompt subtopic structure (3-6 subtopics, 4-7 prompts each) | hr-skills-build | validatePromptStructure() |
| Router ↔ filesystem ↔ marketplace.json three-way consistency | hr-skills-build | validateRouterConsistency() |

### Missing Validation Rules 🚨

- [ ] Duplicate content detection (`SKILL.md` vs. `content/` vs. `prompts/`)
- [ ] Hidden Unicode / prompt-injection pattern scanning (extends `skill-vetter` scope)
- [ ] `skill-vetter` integration into CI (currently documentation only)

### Generated Artifacts

- **docs/skill-matrix.md**: Generated by `scripts/generate-skill-matrix.ts` (Bun-compatible). Shows: skill name, maturity tier, content/prompts/examples presence, line count, and task count. Auto-generated in CI via `matrix.yml` on every push to `main` when `skills/` changes.

---

## CI/CD & Workflows

### Current Workflows (7 total)

| Workflow | Trigger | Status | Notes |
|---|---|---|---|
| lint.yml | PR to main/dev | ✅ Active | Biome check, Markdown lint, link check |
| test.yml | PR to main/dev | ✅ Active | bun run test, OS matrix, Turbo cache |
| typecheck.yml | PR to main/dev | ✅ Active | bun run typecheck, OS matrix |
| validate.yml | PR to main/dev | ✅ Active | **bun run validate** — skills quality gate |
| knip.yml | PR to main/dev | ✅ Active | Unused file/dependency detection |
| matrix.yml | Push to main (skills/ changes) | ✅ Active | Auto-regenerates `docs/skill-matrix.md` with [skip ci] commit |
| publish.yml | Push of `skills-ref@*` tag | ✅ Active | Publishes `skills-ref` to npm with provenance |

### Missing Workflows ⬜

- [ ] **release.yml**: Releases currently `bun run release` (local only, maintainer's machine). No CI-driven GitHub Release object creation. (`publish.yml` covers npm publish for `skills-ref`; a separate `release.yml` for tagging and GitHub Releases is still missing.)
- [ ] **security.yml**: GitHub native secret scanning / CodeQL not explicitly wired in CI (though Renovate/Dependabot/Whitesource provide third-party scanning).

---

## Known Issues & Gaps

### P0 — Critical (blocking quality)

> ✅ All P0 issues resolved in PR #74 (feat/v1.1.0-quality).

| Issue | Status | Resolution |
|---|---|---|
| Prompt subtopic validation unenforced | ✅ Done | `validatePromptStructure()` implemented in `validate.ts` |
| Router ↔ filesystem ↔ marketplace consistency unchecked | ✅ Done | `validateRouterConsistency()` implemented in `validate.ts` |

### P1 — High (technical debt)

| Issue | Status | Notes |
|---|---|---|
| Template duplication (CONTRIBUTING.md + new-skill.md) | ✅ Done | Single-sourced to `.github/skill-template.md` in PR #74 |
| ValidationError name collision | ✅ Done | Renamed to `SkillValidationIssue` in PR #74 |
| Three dependency bots (Renovate, Dependabot, Whitesource) | 🔒 Intentional | Maintained as-is by design — each bot serves a distinct purpose |
| 76 bare skills (52%) | ⬜ Open | Prioritized content remediation, AI cluster first |
| `.agents/valibot` metadata inconsistent | ✅ Done | Normalized and rewritten in PR #74 |

### P2 — Medium (nice to have)

| Issue | Impact | Recommendation |
|---|---|---|
| No release CI workflow | Single point of failure | Add `release.yml` |
| skills-ref publish to npm | Ecosystem presence | ✅ Completed in feat/v1.2.0 — `private: false`, `v1.0.0`, `publish.yml` workflow added; pending merge |
| skill-vetter not in CI | Security checks documentation-only | Wire into automated validation |
| docs/ROADMAP.md (this file) outdated vs. actual repo | Confusion for contributors | Keep updated or auto-generate from config |

---

## Prioritized Action Items

### Immediate (Next release: v1.1.0) — ✅ Completed in PR #74

1. ✅ **De-duplicate SKILL.md template**
   - Extracted to `.github/skill-template.md`
   - `CONTRIBUTING.md` and `.claude/commands/new-skill.md` updated to reference canonical source

2. ✅ **Implement missing validator rules**
   - `validatePromptStructure()` added (3-6 subtopics, 4-7 prompts)
   - `validateRouterConsistency()` added (router ↔ filesystem ↔ marketplace)
   - All 146 skills pass CI validation

3. ✅ **Resolve ValidationError naming collision**
   - `hr-skills-build/src/types.ts` renamed to `SkillValidationIssue`
   - All imports updated across the codebase

4. ⬜ **Consolidate dependency bots**
   - Decide: Keep Renovate, remove Dependabot + Whitesource (or document why keep all)
   - Delete unnecessary bot configs from `.github/`
   - Commit: `chore: consolidate to Renovate for dependency updates`

5. ✅ **Normalize `.agents/valibot` metadata**
   - Rewritten to author "Tuan Duc Tran", version "1.0.0", HR-skills monorepo context

### Short-term (v1.2.0 - v1.3.0)

1. ✅ **Auto-generate skill-matrix.md in CI** *(feat/v1.2.0)*
   - `scripts/generate-skill-matrix.ts` created
   - `matrix.yml` workflow auto-commits updated matrix on `skills/` changes
   - `bun run matrix` available for local use

2. ✅ **Add hr-skills-build build script clarity** *(feat/v1.2.0)*
   - No-op `build` script added with inline explanation
   - Both package `README.md` files updated with naming distinction note

3. ✅ **Publish skills-ref to npm** *(feat/v1.2.0)*
   - `private: false`, version bumped to `1.0.0`
   - `publishConfig.provenance: true` added
   - `publish.yml` workflow created, triggered on `skills-ref@*` tags
   - Pending: add `NPM_TOKEN` secret to GitHub repo settings before tagging

### Medium-term (v1.4.0+)

1. **Add CI release workflow**
   - Create `.github/workflows/release.yml` triggered on version tag push
   - Run `changelogen`, create GitHub Release, optionally trigger npm publish
   - Commit: `ci: add automated release workflow`

2. **Wire skill-vetter into CI**
   - Convert `skill-vetter` meta-skill rules into real `hr-skills-build/src/validators/`
   - Add pattern checks for: dangerous shell commands, wide file permissions, suspicious URLs, credential leaks, hidden Unicode
   - Commit: `feat(security): automate skill-vetter checks in CI`

3. **Bare-skill remediation wave**
   - Target: Bring 76 bare skills to "content-only" tier
   - Prioritize: AI/GenAI cluster first (fast-moving, high-value domain)
   - Create per-skill PRs or one large content PR
   - Commit: `feat(content): expand hr-agentic-ai, hr-ai-ethics, hr-genai to content tier`

---

## Release Roadmap

| Version | Focus | Key Deliverables | Status |
|---|---|---|---|
| v1.0.3 | Foundation | 146 skills, initial tooling | ✅ Released |
| v1.0.4 | Quality | valibot skill rewrite, content improvements, ROADMAP sync | ✅ Released |
| v1.1.0 | Quality & clarity | Template de-duplication, missing validators, `SkillValidationIssue` rename, valibot normalization | ✅ Merged (PR #74) — bot consolidation pending |
| v1.2.0 | Automation | Skill matrix CI, build script clarity, skills-ref npm publish, package naming docs | ✅ In PR (feat/v1.2.0) |
| v1.3.0 | Validation completeness | Prompt structure enforcement, router consistency check | ✅ Merged (PR #74) — moved to v1.1.0 |
| v1.4.0 | Content depth | Bare-skill remediation (AI cluster priority) | 📋 Planned |
| v2.0.0 | Library publish | skills-ref published to npm, plugin system for validation | 📋 Future |

---

## Success Metrics

| Category | Current | Target | Notes |
|---|---|---|---|
| **Validation coverage** | 13/13 major rules | 13/13 (100%) | ✅ All rules enforced including prompt structure + router consistency |
| **Skill depth** | 52% bare, 23% partial, 25% full | 25% bare, 30% partial, 45% full | Prioritize AI cluster |
| **CI coverage** | 7 workflows (matrix + publish added) | 7 workflows + GitHub Release automation | Add release.yml for GitHub Releases |
| **Template consistency** | 1 source (single-source pattern) | 1 source (single-source pattern) | ✅ Canonical `.github/skill-template.md` in place |
| **Code quality** | Biome + Markdown lint enforced | Biome + Markdown lint + skill-vetter in CI | Add security scanning |
| **Bus factor** | 1 maintainer | 2+ trusted reviewers | CODEOWNERS expansion |
| **Ecosystem presence** | Internal tools only | skills-ref published to npm | Formalize public API |

---

## Long-term Vision (3-5 years)

1. **skills-ref** becomes an established, independently-maintained Agent Skills reference library with external users and contributors.

2. **Skill library scales** to 200+ skills while maintaining or improving the "full-tier" percentage (proving intentional heterogeneity scales).

3. **skill-vetter** moves from documentation to enforced, automated CI tooling — meaningful as the broader Agent Skills ecosystem exposes prompt-injection-via-content risks.

4. **Localization** extends beyond Vietnam — at least one additional country/region-context skill cluster, validating the precedent model.

5. **Searchable public index** exists for skill discovery, generated automatically from `marketplace.json`.

6. **Multi-domain adoption**: Repository recognized as a reference implementation; forked as a template for legal, finance, sales, and other professional-domain skill collections.

---

## Glossary

| Term | Definition |
|---|---|
| **Skill** | A `SKILL.md` file (+ optional `content/`, `prompts/`, `examples/`) conforming to Agent Skills format, scoped to one HR domain |
| **Bare skill** | Skill with only `SKILL.md`, no supporting directories |
| **Full skill** | Skill with `SKILL.md` + all three optional directories (content, prompts, examples) |
| **Meta skill** | `.agents/skills/*` describing repository maintenance, consumed by AI agents not end users |
| **Router** | Root `SKILL.md` — maps user requests to specialized skills, carries no HR content |
| **Validate** | `bun run validate` — runs 11 quality rules against all 146 skills |
| **Sync** | `bun run sync` — regenerates `.claude-plugin/marketplace.json` from current skill inventory |
| **Marketplace** | `.claude-plugin/marketplace.json` — distribution manifest consumed by Claude Code installer |

---

## Maintenance Notes

This roadmap should be reviewed and updated:
- Quarterly (or after each major release)
- When new workflows are added to `.github/workflows/`
- When package structure or skill count changes significantly
- When community/contributor feedback identifies new gaps

Last updated: 2026-07-14
