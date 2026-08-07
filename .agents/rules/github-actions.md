---
paths:
  - '.github/workflows/**/*.yml'
  - '.github/workflows/**/*.yaml'
  - '.github/actions/**/*'
---

# GitHub Actions rules

Use these rules when editing GitHub Actions workflows or related automation.

## Sources of truth

- Read the workflow you are changing first, then compare it with other files in
  `.github/workflows/` so trigger, permission, and artifact patterns stay consistent.
- Prefer the repository's canonical Bun commands defined in `package.json` and `turbo.jsonc`
  over duplicating shell logic inside workflows.
- Keep local workflow rules aligned with `AGENTS.md`, `repo-workflow.md`, and the current CI shape.

## Workflow design rules

- Make the smallest correct workflow change first.
- Preserve least-privilege `permissions`. Default to `contents: read` unless a job truly needs more.
- Use `concurrency` on workflows or jobs where superseded runs should be canceled.
- Reuse the repository's existing setup pattern for Bun, caching, and install steps:

```yaml
- uses: actions/checkout@v4
- uses: oven-sh/setup-bun@v2
  with:
    bun-version: latest
- run: bun install --frozen-lockfile
```

- Keep job names, step names, and artifact names plain and stable.
- Do not move repo logic into inline shell if the same logic already exists in `packages/*` or as a `bun run` command.

## Action selection

- Follow the repo's existing convention for official GitHub Actions (`actions/checkout`, `oven-sh/setup-bun`).
- For third-party actions, prefer pinned versions already trusted in the repository.
- Do not add broad write permissions just to make a workflow pass.

## Before editing

Read these files when relevant:

- `.github/workflows/` — all existing workflows
- `repo-workflow.md`
- `git-and-release.md`
- `package.json` — canonical `bun run` commands

## After editing

Run the repository checks that match the workflow surface you touched:

```bash
bun run validate
bun run test
bun run check
bun run lint:md
```

If `actionlint` is available locally, run it after changing `.github/workflows/`.

## Change notes

- Mention trigger changes explicitly.
- Mention permission changes explicitly.
- Mention artifact, cache, or concurrency changes explicitly.
