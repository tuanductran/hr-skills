# Contributor onboarding

## Purpose

Give a first-time contributor enough context to go from "I cloned the repo" to "I understand
where things live and why" before writing any code or content.

## Explanation

HR Skills **[Existing]** is a Bun + Turborepo monorepo. Three kinds of things live in it:

1. **The product** — `skills/hr-*/`, 146 domain-specific Agent Skill packages.
2. **The tooling** — `packages/hr-skills-build/` (validation, matrix/registry generation,
   planner, evaluation CLI) and `packages/skills-ref/` (TypeScript library for reading,
   validating, and generating prompts from skill files).
3. **The meta layer** — `.agents/skills/`, a set of skills that describe how to maintain the
   repository itself (for example `hr-root-router-maintaining`, `hr-skills-maintaining`,
   `skill-vetter`). These are worth reading before your first PR since they encode conventions
   Claude Code is expected to follow when helping maintain the repo, and are a fast way to
   understand "how things are done here."

`docs/` **[Existing]** holds 16 files: 15 hand-written specifications and reference docs
(`docs/format.md`, `docs/registry.md`, `docs/evaluation.md`, `docs/planner.md`,
`docs/runtime.md`, `docs/search.md`, and others covering each subsystem — see the directory
listing for the full set), plus one **generated report** you should never hand-edit
(`docs/skill-matrix.md`).

## Existing behavior — directory reference

| Path | Purpose | Editable by contributors? |
|---|---|---|
| `skills/hr-*/SKILL.md` | Skill definition (required file) | Yes |
| `skills/hr-*/content/` | Long-form reference material | Yes (optional dir) |
| `skills/hr-*/prompts/` | Reusable prompt libraries | Yes (optional dir) |
| `skills/hr-*/examples/` | End-to-end workflow walkthroughs | Yes (optional dir) |
| `docs/format.md` | Skill authoring spec | Yes, via PR + maintainer review |
| `docs/skill-matrix.md` | Generated — run `bun run matrix` | No, never hand-edit |
| `registry/skills.json` | Generated — run `bun run registry` | No, never hand-edit |
| `.claude-plugin/marketplace.json` | Generated — run `bun run sync` | No, never hand-edit |
| `packages/hr-skills-build/` | Validation/CLI tooling source | Yes, via PR |
| `packages/skills-ref/` | Library source | Yes, via PR |
| `.agents/skills/` | Meta-skills for maintaining the repo | Yes, read before contributing |

All of the above is **[Existing]**, cross-checked against AGENTS.md's own project-structure
table and confirmed by inspecting the files on disk.

## Step-by-step: first look at the repository

1. Read `README.md` for the product pitch, `AGENTS.md` for the branch/commit rules, and
   [`../../GOVERNANCE.md`](../../GOVERNANCE.md) for who reviews what and how PRs get approved.
2. Skim `docs/format.md` — this is the spec every skill must satisfy, and `bun run validate`
   enforces it mechanically.
3. Open one existing Full-tier skill end-to-end, for example `skills/hr-onboarding/`: read
   `SKILL.md`, then one file from each of `content/`, `prompts/`, `examples/`. This is faster
   than reading the spec alone and shows the target shape.
4. Check `docs/skill-matrix.md` for the current maturity tier of every skill (🔴 Bare,
   🟡 Partial, 🟢 Full) — a good first contribution is often upgrading a Bare or Partial skill
   in a domain you already know.

## Common contributor workflows

- **Add a brand-new skill** → see `docs/contributing/skill-authoring.md`.
- **Upgrade a Bare/Partial skill to Full tier** by adding the missing `content/`, `prompts/`,
  or `examples/` directory — same validation rules as a new skill, no router change needed
  since the skill already exists in the routing table.
- **Fix a factual or formatting error in an existing skill** — smallest, lowest-risk PR type.
- **Improve tooling** in `packages/hr-skills-build` or `packages/skills-ref` — requires
  TypeScript and Bun familiarity; see AGENTS.md's "Project structure" table.
- **Improve documentation** — see `docs/contributing/workflow.md` for documentation
  maintenance conventions.

## Best practices

- Prefer small, single-purpose PRs (one skill, or one doc fix) over large batches — this
  matches the repository's Conventional Commits scoping convention and is easier to review
  given the repository has a single code owner.
- Read the relevant `.agents/skills/*/SKILL.md` for the area you're touching before starting —
  they're short and describe exact conventions (for example the router update procedure).

## Common mistakes

- Editing generated files (`docs/skill-matrix.md`, `registry/skills.json`,
  `.claude-plugin/marketplace.json`) directly instead of regenerating them with the relevant
  `bun run` command — changes will be overwritten on the next generation run.
- Committing directly to `main` or targeting `main` in a pull request instead of `dev`.
  **[Existing]** AGENTS.md explicitly states `main` is the publishing branch and direct
  commits to it are forbidden.
- Leaving an empty `content/`, `prompts/`, or `examples/` directory in a skill package.
  **[Existing]** `docs/format.md` states this is strictly forbidden and will fail validation.

## Suggested improvements

- **[Proposed]** Consider a `good-first-contribution` label pointing to Bare-tier skills in
  `docs/skill-matrix.md`, since that data already exists and would lower the bar for a first PR.

## Unknown or ambiguous information

- **[Unknown]** Whether there is an expected order of preference among the "common contributor
  workflows" above (e.g. whether maintainers prefer tier upgrades over brand-new skills right
  now). Not stated in the repository; worth asking the maintainer if prioritization matters.
