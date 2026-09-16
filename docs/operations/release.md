# Release Process

> A predictable, repeatable release lifecycle for HR Skills packages,
> generated artifacts, and GitHub distribution.

This is the authoritative reference for how HR Skills goes from a merged
change on `dev` to a versioned release on `main`. It covers Changesets,
validation, generated artifacts, tagging, GitHub Release creation, and
rollback guidance.

## Current package model

The repository is a Bun/Turborepo monorepo. The root `package.json` is the
private workspace root (`hr-skills-monorepo`, currently `1.4.0`); it is not the
release package.

| Package | Current state | Release role |
| --- | --- | --- |
| `packages/hr-skills` | `0.0.0`, public package, CLI `hr-skills` | Publishable CLI package and primary distribution package |
| `packages/hr-skills-build` | `0.0.0`, `private: true` | Internal build, validation, sync, registry, and packaging tooling; versioned for release bookkeeping but not tagged/published |
| `packages/hr-skills-ref` | `0.0.0`, not marked private | Public-capable TypeScript reference library; versioned when a Changeset requires it |
| `packages/hr-skills-tsdoc` | Workspace tooling | API-documentation generation; not the primary distribution package |

`.changeset/config.json` uses `privatePackages.version: true` and
`privatePackages.tag: false`. This is intentional: private packages may receive
version/changelog updates so internal release history remains explicit, but they
do not create package tags or become npm publication targets.

### Generated package payloads are not source files

`packages/hr-skills/scripts/prepare-package.ts` removes and recreates
`packages/hr-skills/skills/` and `packages/hr-skills/registry/` from the
repository's canonical `skills/` and `registry/skills.json` during packaging.
Those package-local directories are generated staging content, not sources of
truth.

Do not delete, hand-edit, or clean up generated package payloads as part of a
documentation-only release change.

## Release lifecycle

### 1. Change + Changeset

For a user-facing package or internal package whose release history should be
tracked, add a Changeset in the same PR:

```bash
bun changeset
```

Select the appropriate bump and describe the externally or internally relevant
change. Changesets must identify the affected package rather than the private
workspace root.

### 2. Merge `dev` into `main`

Feature work lands on `dev`. When development is ready to release, merge
`dev` into `main` through a pull request. `main` is the publishing branch.

### 3. Release automation creates or updates the Version Packages PR

`.github/workflows/release.yml` runs on pushes to `main`. It first runs:

```bash
bun run validate
```

It then invokes `changesets/action@v1.9.0` with `bun run release`, which runs
`changeset version`. The action creates or updates the release PR containing
package version changes and `CHANGELOG.md` updates.

Private packages are versioned because `privatePackages.version` is enabled,
but `privatePackages.tag` remains disabled.

### 4. Review and merge the release PR

Before merging, verify:

- affected package versions and bump levels match the Changesets
- generated registry/marketplace/plugin artifacts are current
- validation, typecheck, tests, lint, and link checks pass
- the changelog entry accurately describes the released changes

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

Do not derive the release tag from the private root workspace or a private
internal package version.

### 6. Tag-triggered GitHub Release

`.github/workflows/publish.yml` runs for `v*` tags. It:

1. installs dependencies with Bun
2. runs `bun run validate`
3. runs `bun run build-skills`
4. extracts the matching `CHANGELOG.md` section
5. creates the GitHub Release
6. attaches `dist/hr-skills.zip` and `dist/hr-skills.skill`

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
| **patch** | Backward-compatible correction | Content, prompt, example, validator, or documentation fixes |

Repository and artifact versions are separate concerns:

- The root `hr-skills-monorepo` version identifies the private workspace and is
  not the CLI package version.
- Private packages may be versioned for internal release history, but are not
  tagged or published by this workflow.
- A skill's `metadata.version` in `SKILL.md` tracks that skill independently.
- `registry/skills.json` has its own `schemaVersion`.
- Changesets determines package bumps from pending Changesets.

## Release validation checklist

### Automated

- [ ] `bun run validate` passes, including generated consistency checks
- [ ] `bun run typecheck` passes
- [ ] `bun run test` passes
- [ ] `bun run lint` and `bun run lint:md` pass
- [ ] `bun run lint:links` passes
- [ ] `bun run knip` passes
- [ ] pending Changesets are reflected in the release PR
- [ ] `publish.yml` validates the exact tagged commit before building artifacts

### Manual

- [ ] package scope and bump type match the actual change
- [ ] the primary release version comes from `packages/hr-skills/package.json`
- [ ] all committed generated artifacts are current
- [ ] no generated package staging directory was manually deleted or edited
- [ ] the matching `CHANGELOG.md` section exists before tagging
- [ ] the tag points at the exact `main` commit containing the release PR

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
| `SKILL.md` root router | `bun run sync` |
| `packages/hr-skills/skills/` | Generated by `prepare-package.ts` during packaging |
| `packages/hr-skills/registry/skills.json` | Generated by `prepare-package.ts` during packaging |
| `dist/hr-skills.zip` / `dist/hr-skills.skill` | Built by the tagged publish workflow |

If a generated artifact is stale, fix its canonical input and rerun the
corresponding generator. Do not delete the generated file as a shortcut.

## Release notes workflow

Changeset descriptions become release-note material through Changesets and
`CHANGELOG.md`. Historical `CHANGELOG.md` entries are immutable release
history; correct current behavior in a new release instead.

## Responsibilities

| Role | Responsibility |
| --- | --- |
| Contributor | Add an accurate Changeset when the change requires one |
| Reviewer | Verify package scope, bump type, generated artifacts, and release notes |
| Maintainer | Merge the release PR, verify the tag, and monitor the publish workflow |

## Rollback guidance

Releases are append-only. Do not reuse or force-move a released version.

If a problem is found after tagging:

1. Fix the issue on `dev` as a normal change.
2. Add the appropriate Changeset.
3. Release a new version through the normal lifecycle.
4. Keep the original tag and GitHub Release as historical records.

## Related documents

- [`docs/ROADMAP.md`](../ROADMAP.md) — active and planned work
- [`docs/integrations/README.md`](../integrations/README.md) — supported distribution surfaces
- [`docs/engineering/registry.md`](../engineering/registry.md) — registry schema and generation
- [`docs/engineering/format.md`](../engineering/format.md) — skill package structure
- [`.changeset/README.md`](../../.changeset/README.md) — Changesets quick reference
- [`AGENTS.md`](../../AGENTS.md) — branch strategy and repository workflow
