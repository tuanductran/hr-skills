# Contributor onboarding

## Purpose

Give a first-time contributor enough context to go from "I cloned the repo" to "I understand
where things live and why" before writing any code or content.

## Explanation

HR Skills **[Existing]** is a Bun + Turborepo monorepo. Three kinds of things live in it:

1. **The product** — `skills/hr-*/`, the domain-specific Agent Skill packages.
2. **The tooling** — `packages/hr-skills/` (publishable CLI), `packages/hr-skills-build/` (validation, matrix/registry generation, planner, runtime, and evaluation), `packages/hr-skills-ref/` (client-safe and Bun/Node library for reading, validating, and generating prompts), and `packages/hr-skills-tsdoc/` (generated API documentation).
3. **The meta layer** — `.agents/skills/`, a set of skills that describe how to maintain the
   repository itself. These are worth reading before your first PR since they encode conventions
   Claude Code is expected to follow when helping maintain the repo.

`docs/` **[Existing]** holds hand-written specifications and reference documentation alongside
generated reports. Check the directory itself for the current inventory; do not rely on a fixed
file count because documentation grows as the repository evolves.

## Existing behavior — directory reference

| Path | Purpose | Editable by contributors? |
|---|---|---|
| `skills/hr-*/SKILL.md` | Skill definition (required file) | Yes |
| `skills/hr-*/content/` | Long-form reference material | Yes (optional dir) |
| `skills/hr-*/prompts/` | Reusable prompt libraries | Yes (optional dir) |
| `skills/hr-*/examples/` | End-to-end workflow walkthroughs | Yes (optional dir) |
| `docs/engineering/format.md` | Skill authoring spec | Yes, via PR + maintainer review |
| `docs/engineering/skill-matrix.md` | Generated — run `bun run matrix` | No, never hand-edit |
| `registry/skills.json` | Generated — run `bun run registry` | No, never hand-edit |
| `.claude-plugin/marketplace.json` | Generated — run `bun run sync` | No, never hand-edit |
| `packages/hr-skills/` | Publishable CLI source | Yes, via PR |
| `packages/hr-skills-build/` | Validation/build/runtime tooling source | Yes, via PR |
| `packages/hr-skills-ref/` | Client/server library source | Yes, via PR |
| `packages/hr-skills-tsdoc/` | TSDoc API generator | Yes, via PR |
| `.agents/skills/` | Meta-skills for maintaining the repo | Yes, read before contributing |

All of the above is **[Existing]**, cross-checked against AGENTS.md's project-structure guidance.

## Step-by-step: first look at the repository

1. Read `README.md` for the product pitch, `AGENTS.md` for the branch/commit rules, and
   [`../../../GOVERNANCE.md`](../../../GOVERNANCE.md) for who reviews what and how PRs get approved.
2. Skim `docs/engineering/format.md` — this is the spec every skill must satisfy, and `bun run validate`
   enforces it mechanically.
3. Open one existing Full-tier skill end-to-end: read `SKILL.md`, then one file from each of
   `content/`, `prompts/`, and `examples/` when those directories exist. This is faster than
   reading the spec alone and shows the target shape.
4. Check `docs/engineering/skill-matrix.md` for the current maturity tier of every skill. Use the
   current matrix rather than assuming a particular number of Bare or Partial skills exists.

## Common contributor workflows

- **Add a brand-new skill** → see `docs/engineering/contributing/skill-authoring.md`.
- **Improve an existing skill** → add or refine `content/`, `prompts/`, or `examples/` as needed,
  while keeping the skill compliant with the current format and validation rules.
- **Fix a factual or formatting error in an existing skill** — smallest, lowest-risk PR type.
- **Improve tooling** in `packages/hr-skills`, `packages/hr-skills-build`, `packages/hr-skills-ref`, or `packages/hr-skills-tsdoc` — requires TypeScript and Bun familiarity; read the package boundary and client/server guidance in AGENTS.md before editing.
- **Improve documentation** — see `docs/engineering/contributing/workflow.md` for documentation
  maintenance conventions.

## Best practices

- Prefer small, single-purpose PRs (one skill, or one doc fix) over large batches — this
  matches the repository's Conventional Commits scoping convention and is easier to review
  given the repository has a single code owner.
- Read the relevant `.agents/skills/*/SKILL.md` for the area you're touching before starting —
  they're short and describe exact conventions.

## Common mistakes

- Editing generated files (`docs/engineering/skill-matrix.md`, `registry/skills.json`,
  `.claude-plugin/marketplace.json`) directly instead of regenerating them with the relevant
  `bun run` command — changes will be overwritten on the next generation run.
- Committing directly to `main` or targeting `main` in a pull request instead of `dev`.
  AGENTS.md states that `main` is the publishing branch and direct commits to it are forbidden.
- Leaving an empty `content/`, `prompts/`, or `examples/` directory in a skill package.
  `docs/engineering/format.md` states this is strictly forbidden and will fail validation.

## Suggested improvements

- Consider a `good-first-contribution` label or issue template that points contributors toward
  concrete gaps identified by the current skill matrix, rather than assuming Bare-tier skills
  are available.

## Unknown or ambiguous information

- **[Unknown]** Whether there is an expected order of preference among the common contributor
  workflows above. Not stated in the repository; ask the maintainer if prioritization matters.
