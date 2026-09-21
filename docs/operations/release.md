# Release Process

> A predictable, repeatable release lifecycle for HR Skills packages, generated artifacts, and GitHub distribution.

This is the authoritative reference for how HR Skills goes from a merged change on `dev` to a versioned release on `main`.

## Current package model

The repository is a Bun/Turborepo monorepo. The root `package.json` is the
private workspace root and is not the release package.

| Package | Current state | Release role |
| --- | --- | --- |
| `packages/hr-skills` | `0.0.0`, public package, CLI `hr-skills` | Publishable CLI package and primary distribution package |
| `packages/hr-skills-build` | `0.0.0`, `private: true` | Internal tooling; versioned for release bookkeeping but not tagged/published |
| `packages/hr-skills-ref` | `0.0.0`, not marked private | Public-capable TypeScript reference library; versioned when a Changeset requires it |
| `packages/hr-skills-tsdoc` | Workspace tooling | API-documentation generation; not the primary distribution package |

## Release lifecycle

### 1. Change + Changeset

For a user-facing package or tracked internal package, add a Changeset in the same PR:

```bash
bun changeset
```

Select the appropriate bump and describe the affected package.

### 2. Merge `dev` into `main`

Feature work lands on `dev`. When development is ready to release, merge `dev`
into `main` through a pull request. `main` is the publishing branch.

### 3. Version Packages PR

`.github/workflows/release.yml` runs on pushes to `main`, validates the
repository, and invokes Changesets to create or update the Version Packages PR.
That PR contains package version changes and changelog updates.

Private packages may be versioned because `privatePackages.version` is enabled,
but `privatePackages.tag` remains disabled.

### 4. Review and merge the release PR

Before merging, verify:

- affected package versions and bump levels match the Changesets
- generated registry/marketplace/plugin artifacts are current
- the repository's required CI status checks pass
- the changelog entry accurately describes the released changes

The protected `main` branch is the authoritative pre-release quality gate.

### 5. Tag the primary released version

The public CLI package is the primary distribution package. Inspect its exact
version after the Version Packages PR is merged:

```bash
node -p "require('./packages/hr-skills/package.json').version"
```

Then tag that version from the up-to-date `main`:

```bash
git tag vX.Y.Z
git push --tags
```

Do not derive the release tag from the private workspace or an internal package.

### 6. Tag-triggered GitHub Release

`.github/workflows/publish.yml` runs for `v*` tags. It:

1. installs dependencies with Bun
2. runs `bun run validate`
3. validates generated API docs
4. validates relevance signals
5. builds the distribution artifacts
6. extracts the matching `CHANGELOG.md` section
7. creates the GitHub Release
8. attaches `dist/hr-skills.zip` and `dist/hr-skills.skill`

The workflow currently creates GitHub Release artifacts; it does **not** run
`npm publish`.

## Lifecycle at a glance

| Stage | Trigger | Output |
| --- | --- | --- |
| 1. Changeset | User-facing or tracked internal PR | `.changeset/*.md` |
| 2. Merge | `dev` → `main` PR | Release-ready `main` |
| 3. Version PR | Push to `main` | Package versions + `CHANGELOG.md` PR |
| 4. Merge version PR | Maintainer approval | Versioned `main` |
| 5. Tag | Maintainer | `vX.Y.Z` for the primary CLI package |
| 6. Publish workflow | `v*` tag | GitHub Release + `dist/` artifacts |

## Versioning strategy

HR Skills uses Semantic Versioning through Changesets for packages that
participate in release bookkeeping.

| Bump | When to use | Examples |
| --- | --- | --- |
| **major** | Breaking consumer-facing package or contract change | Removing a public API or breaking a registry schema |
| **minor** | Backward-compatible capability | New CLI capability, public API, or generated integration |
| **patch** | Backward-compatible correction | Content, prompt, example, validator bug fix, or documentation fix |

Repository and artifact versions are separate concerns:

- root workspace version is not the CLI release version
- private packages may be versioned for internal release history but are not tagged or published by this workflow
- a skill's `metadata.version` is independent
- `registry/skills.json` has its own `schemaVersion`
- Changesets determines package bumps from pending Changesets

## Release validation checklist

### Automated

- [ ] required branch-protection CI checks pass on the release PR
- [ ] pending Changesets are reflected in the release PR
- [ ] `publish.yml` validates the exact tagged commit before building artifacts

### Manual

- [ ] package scope and bump type match the actual change
- [ ] primary release version comes from `packages/hr-skills/package.json`
- [ ] all committed generated artifacts are current
- [ ] generated package staging directories are not manually edited or deleted
- [ ] matching `CHANGELOG.md` section exists before tagging
- [ ] tag points at the exact `main` commit containing the release PR

## Generated artifacts and source of truth

Never hand-edit generated artifacts to force a release to pass.

| Artifact | Source / command |
| --- | --- |
| `registry/skills.json` | `bun run registry` |
| `registry/relevance-signals.json` | `bun run signals` |
| `docs/engineering/skill-matrix.md` | `bun run matrix` |
| `docs/engineering/api.md` | `bun run api-docs` |
| `.claude-plugin/marketplace.json` | `bun run sync` |
| `.claude-plugin/plugin.json` | `bun run sync` |
| `.codex-plugin/plugin.json` | `bun run sync` |
| `.agents/plugins/marketplace.json` | `bun run sync` |
| root `SKILL.md` routing table | `bun run sync` |
| `packages/hr-skills/skills/` | Generated by `prepare-package.ts` during packaging |
| `packages/hr-skills/registry/skills.json` | Generated by `prepare-package.ts` during packaging |
| `dist/hr-skills.zip` / `dist/hr-skills.skill` | Built by tagged publish workflow |
