---
paths:
  - '**/*'
---

# Git and release rules

Use Conventional Commits:

`<type>(<scope>): <summary>`

Recommended types:

- `feat`
- `fix`
- `chore`
- `docs`
- `refactor`
- `test`
- `build`
- `ci`
- `perf`
- `revert`

Examples:

- `feat(skills): add hr-compensation skill`
- `fix(validate): correct frontmatter schema check`
- `docs(readme): update install instructions`
- `chore: bump dev dependencies`

Preferred branch names:

- `feat/...`
- `fix/...`
- `chore/...`
- `docs/...`
- `test/...`
- `ci/...`

## Branch workflow (required)

Never push directly to `main`. All changes must go through a branch and PR **against `dev`**.

### Standard flow

```bash
# 1. Always start from an up-to-date dev branch
git checkout dev
git pull origin dev

# 2. Create a branch named after the change type
git checkout -b feat/hr-new-skill

# 3. Make changes and commit with Conventional Commits
git add <files>
git commit -m "feat(skills): add hr-new-skill package"

# 4. Push the branch (never main)
git push origin feat/hr-new-skill

# 5. Open a PR against dev on GitHub for review before merging
```

### Rules

- `main` is the publishing branch — no direct pushes, ever
- `dev` is the development branch — all PRs target dev
- One branch per logical change; do not mix unrelated fixes
- Branch name must match the commit type prefix
- Delete the branch after the PR is merged

### Pre-push checklist

Run these before pushing any meaningful change:

```bash
bun run validate   # after editing skills/hr-*/SKILL.md
bun run sync       # after adding or removing a skill directory
bun run test       # after editing packages/* TypeScript
bun run check      # Biome lint + format check
```

If the change touches `CHANGELOG.md` or docs, also run:

```bash
bun run lint:md
```

### Changesets

If your change is releasable (new skill, fix, feature), create a changeset:

```bash
bun run changeset
```

See `.agents/skills/changeset/SKILL.md` for guidance on when and how.

### Branch naming examples

| Change | Branch name |
| :--- | :--- |
| Add new HR skill | `feat/hr-compensation` |
| Fix validation bug | `fix/validate-frontmatter` |
| Update CHANGELOG | `docs/changelog-update` |
| Add CI workflow step | `ci/validate-on-push` |
| Add test coverage | `test/skills-ref-schema` |
| Bump dev dependencies | `chore/bump-dev-deps` |
