# Repository workflow

## Purpose

One authoritative page covering environment setup, local commands, and the fork → PR path, so
contributors don't have to reverse-engineer `package.json` scripts or piece together rules
from multiple files.

## Explanation

The repository is a Bun workspace orchestrated by Turborepo. Almost every contributor-facing
command is a `bun run <script>` defined in the root `package.json`, several of which delegate
to `turbo run <task> --filter=<package>` so they execute in the right workspace package with
caching. This section documents each command's effect, not just its name.

## Existing behavior — development setup

**Requirements — [Existing]:**

- [Bun](https://bun.sh/) ≥ 1.3.9 (the repository pins `bun@1.3.14` as `packageManager` in
  `package.json`)
- Node.js is **not** required — Bun handles install, run, and workspace resolution
- Git

**Setup — [Existing]:**

```bash
git clone https://github.com/tuanductran/hr-skills.git
cd hr-skills
bun install
```

`bun install` triggers two lifecycle scripts defined in `package.json`:

- `preinstall`: `bunx only-allow bun` — this will error out if you try `npm install` or
  `yarn install` instead of `bun install`.
- `prepare`: `lefthook install` — installs git hooks (for example commit message linting via
  `commitlint`).

## Existing behavior — local development commands

| Command | What it does |
|---|---|
| `bun run validate` | Validates every `SKILL.md` against the spec in `docs/format.md` (backed by `packages/hr-skills-build/src/validate.ts`) |
| `bun run sync` | Regenerates `.claude-plugin/marketplace.json` from skill frontmatter |
| `bun run matrix` | Regenerates `docs/skill-matrix.md` |
| `bun run registry` | Regenerates `registry/skills.json` |
| `bun run check` | Biome check, no writes |
| `bun run lint` | Biome check with auto-fix |
| `bun run format` | Biome formatter |
| `bun run lint:md` | markdownlint + case-police on Markdown |
| `bun run lint:md:fix` | Same, with auto-fix |
| `bun run lint:links` | Validates Markdown links in `docs/` and `skills/` |
| `bun run typecheck` | TypeScript check across workspace packages |
| `bun run build` | All workspace builds via Turborepo |
| `bun run test` | Tests across workspace packages |
| `bun run knip` | Detects unused files/dependencies |
| `bun run plan "<intent>"` | Generates an execution plan for a user intent (see `docs/planner.md`) |
| `bun run execute "<intent>"` | AGENTS.md-documented; generates a plan and runs it through the workflow runtime (see `docs/runtime.md`) |
| `bun run evaluate` | Runs the evaluation framework (see `docs/evaluation.md`) |
| `bun run changeset` / `bun run release` | Versioning/release |

All of the above is **[Existing]**, taken directly from `package.json` scripts and
cross-checked against AGENTS.md's own command list, which matches exactly.

**[Existing]** CI (`.github/workflows/`) runs `knip.yml`, `lint.yml`, `matrix.yml`,
`release.yml`, `test.yml`, `typecheck.yml`, and `validate.yml` as separate jobs — meaning
`test` and `knip` are enforced in CI even though they're not currently listed in
CONTRIBUTING.md's pre-submit checklist (see `CONTRIBUTING.md.suggestions.md`).

## Existing behavior — testing and validation

Minimum bar before opening a PR, per CONTRIBUTING.md, cross-checked against AGENTS.md and CI:

```bash
bun run validate    # 0 errors — SKILL.md spec compliance
bun run check        # 0 Biome errors
bun run lint:md       # 0 markdownlint errors
bun run typecheck    # 0 TypeScript errors
bun run build        # all workspace builds succeed
```

**[Proposed]** Also run locally, since CI checks them separately:

```bash
bun run lint:links    # no broken links in docs/ or skills/
bun run test           # workspace tests pass
bun run knip           # no unused files/dependencies
```

## Step-by-step: fork → development → pull request

1. **Fork** the repository on GitHub.
2. **Branch from `dev`, not `main`.** **[Existing, AGENTS.md]** `main` is the publishing
   branch (used via `npx skills add tuanductran/hr-skills`) and only contains released
   skills; direct commits to it are forbidden, and pull requests must target `dev`.
3. **Develop** your change — new skill, edit, doc fix, or tooling change.
4. **Run the full validation suite locally** (previous section).
5. **Commit using Conventional Commits.** **[Existing, AGENTS.md]**:

   ```text
   <type>(<scope>): <short summary>
   ```

   - Imperative mood ("add", "fix", not "added", "fixes")
   - Summary under 72 characters
   - Scope = skill or package name when the change is isolated
   - Reference issues in the body when relevant (`Closes #42`)

   Example:

   ```text
   feat(hr-recruiting): add ATS integration prompts
   ```

6. **Open a pull request against `dev`**, filling in `.github/pull_request_template.md`:
   what changed, content type (skill definition / competency framework / interview questions
   / assessment criteria / recruiting workflow / AI prompt / documentation / tooling), why,
   related issue, and the validation checklist.
7. A maintainer reviews and merges. **[Existing]** `.github/CODEOWNERS` lists a single owner
   (`@tuanductran`) for the entire repository. **[Unknown]** review turnaround time / SLA is
   not documented.
8. Periodically, `dev` is released to `main` via the release process
   (`bun run release`, `.github/workflows/release.yml`). **[Unknown]** the exact cadence or
   trigger for this is not documented in the repository.

## Best practices

- Keep PRs scoped to one skill or one concern — mirrors the commit scope convention and eases
  review given the single-owner review model.
- After adding or removing a skill, run `bun run sync` and `bun run matrix` locally so the
  diff to generated files (`.claude-plugin/marketplace.json`, `docs/skill-matrix.md`) is
  included in your PR rather than left for a maintainer to regenerate.

## Common mistakes

- Opening a PR against `main` instead of `dev`.
- Running `npm install` or `yarn install` — blocked by `preinstall`, but worth knowing in
  advance so the resulting error isn't confusing.
- Forgetting to run `bun run sync` after adding a new skill directory, leaving
  `.claude-plugin/marketplace.json` stale relative to `skills/`.

## Suggested improvements

- **[Proposed]** CONTRIBUTING.md's checklist should include `lint:links`, `test`, and `knip`
  to match what CI actually enforces (see `CONTRIBUTING.md.suggestions.md`, item 1).

## Unknown or ambiguous information

- **[Unknown]** PR review SLA / backup reviewer path.
- **[Unknown]** `dev` → `main` release cadence/trigger.
