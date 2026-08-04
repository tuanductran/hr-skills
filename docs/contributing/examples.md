# Contribution examples

## Purpose

Show complete, copy-pasteable command sequences for the four most common contribution types,
so a first-time contributor can match their situation to a working example.

All commands below use scripts and conventions verified in `package.json`, `AGENTS.md`, and
`CONTRIBUTING.md` — nothing here is invented. **[Existing]** unless marked otherwise.

## Example A — creating a new skill

```bash
git checkout dev
git pull
git checkout -b feat/hr-payroll-tax-compliance

mkdir -p skills/hr-payroll-tax-compliance/{content,prompts,examples}
# Author SKILL.md from .github/skill-template.md, plus one .md file per subdirectory.

bun run sync         # regenerate .claude-plugin/marketplace.json
# Update the root router per .agents/skills/hr-root-router-maintaining/SKILL.md
bun run validate      # must pass with 0 errors
bun run matrix         # regenerate docs/skill-matrix.md
bun run registry       # regenerate registry/skills.json

git add .
git commit -m "feat(hr-payroll-tax-compliance): add new skill"
git push origin feat/hr-payroll-tax-compliance
# Open PR: base = dev, head = feat/hr-payroll-tax-compliance
```

Resulting structure:

```text
skills/
├── hr-payroll-tax-compliance/     # new
│   ├── SKILL.md
│   ├── content/
│   │   └── understanding-payroll-tax-compliance.md
│   ├── prompts/
│   │   └── payroll-tax-prompts.md
│   └── examples/
│       └── quarterly-tax-filing-workflow.md
└── ... (existing skills, unchanged)
```

## Example B — upgrading an existing skill's tier (Partial → Full)

```bash
git checkout dev
git pull
git checkout -b feat/hr-offboarding-add-examples

# Add skills/hr-offboarding/examples/conducting-an-exit-interview.md

bun run validate
bun run lint:md

git add .
git commit -m "feat(hr-offboarding): add exit interview example workflow"
git push origin feat/hr-offboarding-add-examples
```

No router change needed — the skill already exists in the routing table. Only its maturity
tier changes (Partial → Full), which `bun run matrix` will reflect automatically.

## Example C — updating an existing skill's content

```bash
git checkout -b fix/hr-analytics-turnover-formula

# Edit skills/hr-analytics/content/*.md

bun run lint:md
git commit -m "fix(hr-analytics): correct turnover formula in tips"
git push origin fix/hr-analytics-turnover-formula
```

## Example D — fixing documentation

```bash
git checkout -b docs/clarify-skill-tiers

# Edit docs/format.md (or another file under docs/contributing/)

bun run lint:md
bun run lint:links
git commit -m "docs: clarify skill maturity tier definitions"
git push origin docs/clarify-skill-tiers
```

## Example E — submitting the pull request

Applies to all of the above:

1. Base branch: `dev` (never `main`).
2. Fill in `.github/pull_request_template.md`:
   - **What changed** — one or two sentences
   - **Content type** — check the box(es) that apply (new skill, skill tier
     upgrade, content fix, documentation, tooling/configuration)
   - **Why** — the problem being solved or value added
   - **Related issue** — `Closes #NN` if applicable
   - **Validation** — confirm content reviewed, no duplicate information, links verified,
     formatting follows repository standards, CI checks pass
   - **Commit convention** — confirm commits follow Conventional Commits
3. Wait for CI (`.github/workflows/`: `knip`, `lint`, `matrix`, `test`, `typecheck`,
   `validate`, plus `skill-review` for PRs touching `skills/hr-*/**`) to pass.
4. A maintainer reviews and merges.

## Best practices

- Run the exact validation commands relevant to your change type before pushing — a
  content-only change doesn't need `bun run typecheck`, but a `packages/` change does.
- Keep the commit scope aligned with the primary thing changed (`hr-analytics`,
  `hr-skills-build`, or no scope for repo-wide changes).

## Common mistakes

- Forgetting `bun run sync` after adding a new skill directory (Example A) — leaves
  `.claude-plugin/marketplace.json` out of sync with the PR's actual skill additions.
- Opening the PR against `main`.
- Skipping `bun run lint:md` on documentation-only changes — markdownlint and case-police
  still apply to prose, not just skill files.

## Suggested improvements

- **[Proposed]** None currently open — this page is meant to stay a stable set of worked
  examples rather than duplicating reasoning that belongs in `AGENTS.md` or `GOVERNANCE.md`.

## Unknown or ambiguous information

- **[Unknown]** Whether maintainers expect changeset entries (`bun run changeset`) from
  external contributors, or whether that's reserved for maintainer-driven releases. Not
  stated in CONTRIBUTING.md or AGENTS.md; worth confirming before including it in a
  contributor-facing example.
