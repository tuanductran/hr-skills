# HR Skills — Contributor Guide (Proposed)

> Status: **Draft proposal** for `tuanductran/hr-skills`, prepared to support Roadmap Phase 5
> ("Community & Distribution" — better documentation, external contributors).
>
> This is the top-level index. The four companion files are meant to live at
> `docs/contributing/*.md` (delivered alongside this one). `CONTRIBUTING.md` itself should
> stay short and link out to them — see Section 7, Documentation Maintenance.

## Labels used throughout all deliverables

- **[Existing]** — verified by reading the repository directly (README.md, CONTRIBUTING.md,
  AGENTS.md, `docs/format.md`, `.github/skill-template.md`, `.github/pull_request_template.md`,
  `.github/CODEOWNERS`, `.github/workflows/*`, `package.json`, `packages/hr-skills-build/src/validate.ts`,
  and sampled skill packages such as `skills/hr-onboarding/`).
- **[Inferred]** — not written down anywhere, but consistently observed across the repository
  (e.g. by comparing multiple `skills/hr-*` directories).
- **[Proposed]** — a new recommendation, not currently in the repository. Requires maintainer
  sign-off before merging.
- **[Unknown]** — cannot be determined from the repository as cloned. Listed explicitly rather
  than guessed at.

## Repository analysis performed

| Source | What it confirmed |
|---|---|
| `README.md` | Product description, quick start, repo structure diagram, package table |
| `CONTRIBUTING.md` | Setup, pre-submit checklist, new-skill steps, PR target branch |
| `AGENTS.md` | Branch strategy, commit convention, full command list, project structure table, content standards |
| `docs/format.md` | Full `SKILL.md` spec, maturity tiers, `content/`/`prompts/`/`examples/` rules |
| `.github/skill-template.md` | Canonical SKILL.md template (source of truth, cross-referenced from CONTRIBUTING.md) |
| `.github/pull_request_template.md` | PR checklist fields actually shown to contributors |
| `.github/CODEOWNERS` | `* @tuanductran` — single owner, all paths |
| `.github/workflows/*.yml` | CI jobs exist for: `knip`, `lint`, `matrix`, `release`, `test`, `typecheck`, `validate` |
| `package.json` | Exact script names/behavior, workspaces, catalog dependencies, `preinstall`/`prepare` hooks |
| `packages/hr-skills-build/src/validate.ts` (+ neighbors) | Confirms `bun run validate` is a real, implemented CLI backed by `skills-ref`, not just documentation |
| `.agents/skills/hr-root-router-maintaining/SKILL.md` | Router update procedure referenced by CONTRIBUTING.md actually exists and is detailed |
| `skills/hr-onboarding/` (sample Full-tier skill) | Confirms real-world `content/`, `prompts/`, `examples/` structure matches `docs/format.md` |

No conflicts were found between documentation and implementation. This means the work here is
**additive and organizational** (filling gaps, consolidating, cross-linking) rather than
corrective.

## Key findings

1. **[Existing]** Core docs (README, CONTRIBUTING, AGENTS.md, docs/format.md) are internally
   consistent with each other and with `package.json`.
2. **[Existing]** CONTRIBUTING.md's "Before you submit" checklist lists `validate`, `check`,
   `lint:md`, `typecheck`, `build` — it does **not** mention `lint:links`, `test`, or `knip`,
   even though all three are real scripts and CI runs `test.yml` and `knip.yml` as separate
   jobs. **[Proposed]** Add these to the pre-submit checklist so local runs match CI.
3. **[Existing]** There is no single "start here" contributor page — onboarding, environment
   setup, and skill-authoring guidance are correctly documented but split across four files.
   **[Proposed]** A `docs/contributing/` subtree (delivered here) consolidates this without
   duplicating `docs/format.md`, which stays the single source of truth for the SKILL.md spec.
4. **[Unknown]** Whether `.agents/skills/skill-vetter/SKILL.md` is used by the human maintainer
   as a PR review checklist, or is intended only for Claude Code's own use. Not stated anywhere
   in CONTRIBUTING.md, AGENTS.md, or the PR template. Recommend the maintainer clarify.
5. **[Unknown]** Expected PR review turnaround time. CODEOWNERS shows a single owner
   (`@tuanductran`) for the entire repository, but no SLA or backup-reviewer policy is stated.
6. **[Unknown]** Exact cadence/trigger for merging `dev` → `main` (i.e., when a release
   happens). `bun run release` and `.github/workflows/release.yml` exist, confirming a release
   process exists, but not when/how often it runs relative to `dev` activity.

## Deliverables in this drop

| File | Purpose |
|---|---|
| `CONTRIBUTOR_GUIDE.md` (this file) | Index, analysis summary, findings, cross-links |
| `CONTRIBUTING.md.suggestions.md` | Copy-pasteable diff-style suggestions for the existing `CONTRIBUTING.md` |
| `docs/contributing/onboarding.md` | Section 1 — architecture, directories, contributor journey |
| `docs/contributing/workflow.md` | Section 2 — setup, commands, branching, PR workflow |
| `docs/contributing/skill-authoring.md` | Section 3 — skill structure, tiers, naming, validation |
| `docs/contributing/examples.md` | Section 4 — worked examples with real git/bun commands |
| Section 7 below | Documentation maintenance recommendations |

---

## 7. Documentation Maintenance Recommendations

### Current state

- **[Existing]** No contradictions found between documented commands and actual `package.json`
  scripts, or between documented skill structure and sampled skills on disk.
- **[Existing]** `docs/skill-matrix.md`, `registry/skills.json`, and
  `.claude-plugin/marketplace.json` are correctly documented in AGENTS.md as generated,
  do-not-hand-edit files, regenerated by `bun run matrix`, `bun run registry`, and
  `bun run sync` respectively.

### Gaps identified

| Gap | Evidence | Recommendation |
|---|---|---|
| Pre-submit checklist incomplete | CONTRIBUTING.md omits `lint:links`, `test`, `knip`; CI runs all of them as separate jobs | **[Proposed]** Expand the checklist (see `CONTRIBUTING.md.suggestions.md`) |
| No single onboarding entry point | Info split across 4 files | **[Proposed]** Add `docs/contributing/` subtree, link from CONTRIBUTING.md |
| Review process undocumented | Single CODEOWNERS entry, no SLA/escalation text anywhere | **[Unknown]** — flag for maintainer, don't invent a policy |
| `skill-vetter` role unclear | Meta-skill exists in `.agents/skills/` but never referenced from contributor-facing docs | **[Unknown]** — flag for maintainer |

### Recommended organization — **[Proposed]**

```text
CONTRIBUTING.md              # stays short: setup + checklist + links out (GitHub surfaces this file automatically)
docs/
├── contributing/
│   ├── onboarding.md        # architecture + contributor journey
│   ├── workflow.md          # setup + commands + branching + PR steps
│   ├── skill-authoring.md   # cross-links docs/format.md rather than duplicating it
│   └── examples.md          # worked git/bun command sequences
├── format.md                 # unchanged — remains the canonical SKILL.md spec
└── ROADMAP.md
```

Rationale: keeps `CONTRIBUTING.md` short (GitHub convention — it's auto-surfaced in the PR/issue
UI), while `docs/contributing/` gives depth without duplicating `docs/format.md`, mirroring how
`docs/evaluation.md`, `docs/planner.md`, `docs/runtime.md`, and `docs/registry.md` already
document subsystems separately.

### Maintenance risks going forward — **[Proposed]**

- Script tables in AGENTS.md and CONTRIBUTING.md are both hand-maintained lists of
  `package.json` scripts. Any new script risks going undocumented in one or both places.
  Recommend a PR-checklist reminder line ("If you added a script, update AGENTS.md and
  CONTRIBUTING.md") rather than tooling, since no doc-generation tooling for this exists today.
- `docs/format.md` and `.github/skill-template.md` are explicitly cross-referenced as the same
  source of truth (per the template file's own header) — a change to one without the other is
  the most likely future documentation drift point.
