# Changesets

This directory is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelog generation for `hr-skills`.

## Workflow

### Adding a changeset (before merging a PR)

```bash
bun changeset
```

Follow the interactive prompts to select the bump type (major / minor / patch) and describe the change. A `.md` file will be created in this directory — commit it alongside your changes.

### Releasing (maintainer only)

Do **not** run `bun changeset version` locally and push straight to `main`.
`.github/workflows/release.yml` already does this for you on every push to
`main`: it runs `bun run validate`, then `changesets/action@v1`, which opens
(or updates) a `chore(release): version packages` pull request that
consumes every pending changeset, bumps `package.json`, and updates
`CHANGELOG.md`. Running `bun changeset version` manually beforehand
consumes the changesets yourself, so the workflow has nothing left to put
in that PR.

```bash
# 1. Merge dev → main as usual. release.yml opens/updates the
#    "Version Packages" PR automatically — no local command needed.

# 2. Review and merge that PR (this lands the version bump + CHANGELOG.md).

# 3. Tag and push from the updated main — this is a maintainer action;
#    no workflow creates the git tag itself.
git pull
git tag v$(node -p "require('./package.json').version")
git push --tags

# 4. Pushing the tag triggers .github/workflows/publish.yml, which builds
#    dist/hr-skills.zip and dist/hr-skills.skill and creates the GitHub
#    Release from the tag automatically, using the matching CHANGELOG.md
#    section as its body and attaching both artifacts. No further manual
#    step is needed.
```

> No npm publish step — this repo is not published to npm. See
> [`docs/release.md`](../docs/release.md) for the full lifecycle,
> validation checklist, and rollback guidance.
