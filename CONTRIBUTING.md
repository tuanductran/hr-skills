# Contributing

Contributions are welcome — new HR skills, improvements to existing skills, documentation updates, and enhancements to the build and tooling workflow.

For a deeper walkthrough — repository architecture, the full contributor journey, and worked examples — see [`docs/contributing/`](./docs/contributing/onboarding.md). This file covers the minimum steps to get a pull request merged. For how contributions are reviewed, who owns what, and how community feedback reaches the roadmap, see [`GOVERNANCE.md`](./GOVERNANCE.md).

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.3.9
- Node.js is not required — Bun handles everything

## Setup

```bash
git clone https://github.com/tuanductran/hr-skills.git
cd hr-skills
bun install
```

## Before you submit

Run the full check suite from the project root:

Build and typecheck tasks are orchestrated through Turborepo and may run in parallel across workspace packages.

```bash
bun run validate     # Validate all SKILL.md files
bun run check        # 0 Biome check errors required
bun run lint:md       # 0 markdownlint errors required
bun run lint:links    # No broken links in docs/ or skills/
bun run typecheck    # 0 TypeScript errors required
bun run build        # All workspace builds must complete successfully
bun run test          # All workspace tests must pass
bun run knip          # No unused files or dependencies introduced
```

All checks must pass before opening a pull request.

## Adding a new skill

### 1. Create the skill directory

```bash
mkdir skills/hr-your-skill-name
```

Directory name rules: lowercase, hyphens only, must start with `hr-`.

### 2. Write SKILL.md

Use the canonical template in [`.github/skill-template.md`](../.github/skill-template.md).

See [`docs/format.md`](./docs/format.md) for the full specification.

### 3. Sync skill references

Run the sync script to auto-update generated references and metadata:

```bash
bun run sync
```

This updates `.claude-plugin/marketplace.json`. No manual edits are needed.

### 4. Validate and package

```bash
bun run validate     # Must pass with 0 errors
```

After validation, update the root router so your skill is discoverable:

Update the root router at `.agents/skills/hr-root-router-maintaining` so your skill appears in the routing table. See `.agents/skills/hr-root-router-maintaining/SKILL.md` for guidance on the exact router update step.

### 5. Open a pull request

- Target the `dev` branch (never `main` directly)
- Include a short description of the HR domain the skill covers
- Confirm all four checks pass in the PR description

## Improving an existing skill

Edit the relevant `skills/hr-*/SKILL.md` file directly. Re-run:

```bash
bun run validate
bun run lint:md
```

## Improving the build tooling

The TypeScript workspace packages and build tooling live in `packages/`.

Workspace build outputs are cached through Turborepo based on the task configuration in `turbo.jsonc`.

Changes there should:

- Keep `bun run lint` at 0 errors
- Keep `bun run typecheck` at 0 errors
- Not break `bun run build`
- Not break `bun run validate`
- Not break `bun run sync`
- Not break generated package outputs

## Review process

Pull requests are reviewed by the repository owner (see
[`.github/CODEOWNERS`](.github/CODEOWNERS)). The working target is an
initial response within 7 days; every PR gets an explicit signal
(approve, requested changes, or a reason it's paused) rather than sitting
open silently. See [`GOVERNANCE.md`](GOVERNANCE.md#review-and-approval-workflow)
for the full review criteria by content type and how ownership works.

## Questions

Open an issue on GitHub if you're unsure about scope or approach before writing code. For open-ended questions or early-stage ideas that aren't a bug, feature, or concrete skill proposal, use [GitHub Discussions](https://github.com/tuanductran/hr-skills/discussions) instead — see `GOVERNANCE.md`'s [issue and discussion template guide](GOVERNANCE.md#issue-and-discussion-templates).
