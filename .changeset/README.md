# Changesets

This directory is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelog generation for `hr-skills`.

## Workflow

### Adding a changeset (before merging a PR)

```bash
bun changeset
```

Follow the interactive prompts to select the bump type (major / minor / patch) and describe the change. A `.md` file will be created in this directory — commit it alongside your changes.

### Releasing (maintainer only)

```bash
# 1. Consume all pending changesets → bumps version in package.json + updates CHANGELOG.md
bun changeset version

# 2. Commit the version bump
git add . && git commit -m "chore(release): v$(node -p \"require('./package.json').version\")"

# 3. Tag and push — release.yml workflow creates the GitHub Release automatically
git tag v$(node -p "require('./package.json').version")
git push && git push --tags
```

> No npm publish step — this repo is not published to npm.
