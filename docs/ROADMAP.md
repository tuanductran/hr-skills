# HR Skills — Project Roadmap

> **Repository:** [tuanductran/hr-skills](https://github.com/tuanductran/hr-skills)
> **Maintainer:** Tuan Duc Tran | **License:** MIT | **Status:** Actively maintained

This roadmap documents the current state and future direction of the HR Skills library — a Bun/Turborepo monorepo hosting 146 domain-specific Agent Skills for Human Resources professionals.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Statistics](#repository-statistics)
3. [Architecture](#architecture)
4. [Validation & Quality](#validation--quality)
5. [CI/CD & Workflows](#cicd--workflows)
6. [Action Items](#action-items)
7. [Success Metrics](#success-metrics)

---

## Project Overview

**HR Skills** is a structured, versioned library of 146 domain-specific AI skills for HR professionals, packaged as `SKILL.md` files conforming to the [Agent Skills](https://agentskills.io/) open format. Each skill is validated against strict quality rules and distributed via:

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
- Technical recruiters and engineering hiring teams (18 specialized hiring skills: `hr-frontend`, `hr-backend`, `hr-devops`, and so on)
- Vietnam-based HR teams (`hr-vietnam-context` as a cross-cutting differentiator)
- AI developers building on the `skills-ref` generic Agent Skills library
- Contributors maintaining the repository

---

## Repository Statistics

| Metric | Count | Notes |
|---|---:|---|
| HR skills (`skills/hr-*`) | 146 | Comprehensive HR domain coverage |
| Meta/maintainer skills (`.agents/skills/*`) | 12 | Repository maintenance via AI agents |
| Total `SKILL.md` files | 159 | 146 HR + 12 `.agents` + 1 root router |
| **Bare skills** (SKILL.md only) | 35 (24%) | Starting tier |
| **Partial skills** (some optional dirs) | 75 (51%) | Largest incomplete tier |
| **Full skills** (content + prompts + examples) | 36 (25%) | Gold standard tier |
| Internal TypeScript packages | 2 | `hr-skills-build`, `skills-ref` |
| GitHub Actions workflows | 5 | lint, test, typecheck, validate, knip |
| Claude Code slash commands | 4 | new-skill, validate, sync-and-validate, release-check |

---

## Architecture

### Technology Stack

| Layer | Technology |
|---|---|
| Runtime & Package Manager | Bun |
| Monorepo Orchestration | Turborepo |
| Language | TypeScript (strict mode, ESM) |
| Schema Validation | Valibot |
| Formatter / Linter | Biome (tabs, width 90, single quotes) |
| Markdown QA | markdownlint-cli + case-police |
| Commit Discipline | Commitlint + Lefthook (Conventional Commits) |
| Release Automation | changelogen (`bun run release`, local only) |
| Dependency Updates | Renovate |

### Package Structure

```text
hr-skills/ (root, private)
├── packages/
│   ├── hr-skills-build/       ← Validation, sync, CLI tooling
│   └── skills-ref/            ← Generic Agent Skills library (Apache-2.0)
├── skills/hr-*/               ← 146 HR content packages
├── .agents/skills/*           ← 12 meta skills for repository maintenance
├── .claude/                   ← Claude Code commands & configuration
├── .claude-plugin/            ← Generated marketplace.json
└── docs/                      ← Specification & documentation
```

### Validation Pipeline

Two-layer architecture:

1. **Generic layer** (`skills-ref.validate()`): Agent Skills format conformance
2. **Policy layer** (`hr-skills-build` rules): Repository-specific checks

---

## Validation & Quality

### Implemented Rules (13 total)

| Rule | Layer | Enforced by |
|---|---|---|
| Generic Agent Skills conformance | skills-ref | SkillPropertiesSchema |
| Name present and matches directory | hr-skills-build | validateFrontmatter() |
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

### Missing Validation Rules

- [ ] Duplicate content detection (`SKILL.md` vs. `content/` vs. `prompts/`)
- [ ] Hidden Unicode / prompt-injection pattern scanning (extends `skill-vetter` scope)
- [ ] `skill-vetter` integration into CI (currently `.agents/skills/skill-vetter` documentation only)

### Generated Artifacts

**docs/skill-matrix.md** is regenerated by `scripts/generate-skill-matrix.ts` on demand. Shows: skill name, maturity tier, prompt/example counts, content length, validation status. Not auto-generated in CI yet.

---

## CI/CD & Workflows

### Current Workflows (7 total)

| Workflow | Trigger | Notes |
|---|---|---|
| lint.yml | PR to main/dev | Biome check, Markdown lint, link check |
| test.yml | PR to main/dev | `bun run test`, OS matrix, Turbo cache |
| typecheck.yml | PR to main/dev | `bun run typecheck`, OS matrix |
| validate.yml | PR to main/dev | `bun run validate` — skills quality gate |
| knip.yml | PR to main/dev | Unused file/dependency detection |

### Missing Workflows

- [ ] **release.yml**: Releases are currently `bun run release` (local only). No CI-driven release, no GitHub Release creation, no npm publish.
- [ ] **security.yml**: No CodeQL or secret scanning wired into CI.

---

## Action Items

### Dependency Management

- [x] Remove `.github/dependabot.yml` — consolidated to Renovate
- [x] Remove `.whitesource` — not actively used at current project scale
- [x] Renovate is the sole dependency update source — no other bots configured

### Content Depth

- [x] AI/GenAI cluster brought from bare to partial tier: `hr-agentic-ai`, `hr-ai-ethics`, `hr-genai`, `hr-ai-adoption`, `hr-ai-evaluation`
- [x] Compliance cluster: hr-risk-management, hr-policy-management brought to partial tier
- [x] Analytics cluster: hr-predictive-analytics, hr-workforce-forecasting, hr-skills-intelligence, hr-workforce-economics, hr-people-budgeting brought to partial tier
- [x] TA/Recruiting cluster: hr-talent-acquisition, hr-talent-intelligence, hr-talent-crm, hr-talent-mapping, hr-recruitment-marketing, hr-recruitment-operations, hr-candidate-assessment, hr-candidate-experience, hr-offer-management, hr-reference-checking brought to partial tier
- [x] OD/Change cluster: hr-organizational-design, hr-organization-effectiveness, hr-change-communication, hr-operating-model, hr-mergers-acquisitions, hr-post-merger-integration brought to partial tier
- [x] EX/L&D cluster: hr-employee-communications, hr-employee-listening, hr-employee-journey-mapping, hr-offboarding, hr-recognition, hr-internal-mobility, hr-career-development, hr-coaching-mentoring, hr-learning-strategy brought to partial tier
- [x] **All 146 skills at partial tier or above — 0 bare skills remaining**
- [ ] Promote highest-quality partial skills to full tier (add prompts/ + examples/)
- [ ] Auto-generate `docs/skill-matrix.md` in CI as a pre-release step

### Tooling & Infrastructure

- [x] Add no-op `build` script to `hr-skills-build` with explanatory message (CLI tool, not a library)
- [x] Add `matrix` script to `hr-skills-build` and root — `bun run matrix` generates `docs/skill-matrix.md`
- [x] Add `matrix.yml` CI workflow — auto-regenerates skill-matrix.md on push to main
- [x] Add `release.yml` CI workflow — creates GitHub Release on version tag push, runs validate + matrix first
- [ ] Publish `skills-ref` to npm once API is stable (flip `private: false`, bump to `1.0.0`, add `--provenance`)

### Security

- [x] Convert `skill-vetter` meta-skill rules into `hr-skills-build/src/security.ts`
  - Implemented: dangerous shell commands, sensitive path writes, suspicious URLs, credential leak patterns, hidden Unicode
  - Wired into `validateSkill()` — runs as part of `bun run validate`
- [ ] Wire `security.ts` coverage into a dedicated `security.yml` CI workflow (CodeQL + secret scanning)

---

## Success Metrics

| Category | Current | Target |
|---|---|---|
| Validation rules | 13 implemented | 13 + duplicate detection + skill-vetter patterns |
| Skill depth | **0% bare, 75% partial, 25% full** | 0% bare, 55% partial, 45% full |
| CI workflows | 7 (validate, lint, test, typecheck, knip, matrix, release) | 7 + CodeQL/security ✅ |
| Dependency bots | Renovate only | Renovate only ✅ |
| skills-ref | Internal only | Published to npm |

---

## Glossary

| Term | Definition |
|---|---|
| **Skill** | A `SKILL.md` file (+ optional `content/`, `prompts/`, `examples/`) conforming to Agent Skills format, scoped to one HR domain |
| **Bare skill** | Skill with only `SKILL.md`, no supporting directories |
| **Full skill** | Skill with `SKILL.md` + all three optional directories (content, prompts, examples) |
| **Meta skill** | `.agents/skills/*` describing repository maintenance, consumed by AI agents not end users |
| **Router** | Root `SKILL.md` — maps user requests to specialized skills, carries no HR content |
| **Validate** | `bun run validate` — runs 13 quality rules against all 146 skills |
| **Sync** | `bun run sync` — regenerates `.claude-plugin/marketplace.json` from current skill inventory |
| **Marketplace** | `.claude-plugin/marketplace.json` — distribution manifest consumed by Claude Code installer |

---

Last updated: July 17, 2026
