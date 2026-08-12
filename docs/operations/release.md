# Release Process

> Phase 5 of the [roadmap](../ROADMAP.md) — a predictable, repeatable release
> lifecycle for HR Skills packages and distributions.

## What it is

This document is the single authoritative reference for how HR Skills goes
from a merged change on `dev` to a published, tagged, documented release
that is consistent across every distribution channel in
[`docs/integrations/README.md`](../integrations/README.md). It covers the release lifecycle,
versioning strategy, release notes workflow, the validation checklist every
release must pass, responsibilities, and rollback guidance.

It complements, and does not replace:

- [`.changeset/README.md`](../../.changeset/README.md) — the short day-to-day
  contributor cheat sheet for adding a changeset
- [`docs/engineering/registry.md`](../engineering/registry.md) — schema and staleness rules for the
  generated registry a release must ship with
- [`docs/integrations/README.md`](../integrations/README.md) — the distribution channels a
  release must stay consistent across

## Current release scope

- **`hr-skills` (root package)** is the only versioned, released package
  today. It is `private` (not published to npm) — its version number
  tracks the state of the skill library and generated artifacts, and its
  git tags and GitHub Releases are the release record.
- **`packages/hr-skills-build`** and **`packages/skills-ref`** are
  `"version": "0.0.0"`, `"private": true`, and listed in
  `.changeset/config.json`'s `ignore` array. They are internal tooling
  consumed via Bun workspaces (`workspace:*`), not independently released.
  If either is published to npm in the future, remove it from `ignore` and
  extend this document's checklist and versioning strategy accordingly —
  do not publish it ad hoc without updating this doc first.

## Release lifecycle

The lifecycle has five stages. Stages 1–2 happen on every PR; stages 3–5
happen only when a maintainer decides to cut a release.

### 1. Change + changeset (every contributor, every PR)

```bash
bun changeset
```

Select the bump type (`major` / `minor` / `patch`) and describe the change
in the interactive prompt. Commit the generated `.changeset/*.md` file in
the same PR as the change it describes. A PR that changes user-facing
content (skills, docs, tooling behavior) without a changeset is incomplete
— it will merge into `dev` but will not contribute a changelog entry when
released.

### 2. Merge to `dev`, then to `main`

Per `AGENTS.md`'s branch strategy: all work lands on `dev` first. When
`dev` is ready to ship, it is merged to `main` via PR. `main` only ever
contains released or release-ready content — this is what makes `main` a
safe base for the automated release step.

### 3. Automated release PR (`release.yml`, on push to `main`)

`.github/workflows/release.yml` runs `bun run validate` first, then invokes
`changesets/action@v1`, which:

- Consumes every pending `.changeset/*.md` file
- Bumps `package.json` version per semver rules (see
  [Versioning strategy](#versioning-strategy))
- Updates `CHANGELOG.md`
- Opens (or updates) a `chore(release): version packages` pull request
  against `main`

No commit is pushed directly to `main` by this step — it always goes
through a reviewable PR, and `bun run validate` gates it before the PR is
even opened.

### 4. Merge the release PR (maintainer)

Reviewing the release PR is itself part of validation — see the
[checklist](#release-validation-checklist). Merging it:

- Lands the version bump and changelog in `main`
- Does **not** publish anything by itself; publishing (git tag + GitHub
  Release) is a separate, explicit maintainer action (stage 5), so a
  release PR can be merged and still reviewed once more before the tag is
  pushed

### 5. Tag and publish (maintainer triggers, `publish.yml` completes it)

```bash
# From an up-to-date main, after the release PR is merged
git tag v$(node -p "require('./package.json').version")
git push --tags
```

Pushing the tag is the point of no return for that version number — see
[Rollback guidance](#rollback-guidance) if something is wrong after this
step. The pushed tag triggers `.github/workflows/publish.yml`, which builds
`dist/hr-skills.zip` and `dist/hr-skills.skill` from the tagged commit and
creates the GitHub Release automatically — using the matching
`CHANGELOG.md` section as the release body and attaching both artifacts.
The maintainer still decides *when* to tag; nothing after that point
requires a manual step.

### Lifecycle at a glance

| Stage | Trigger | Actor | Output |
| --- | --- | --- | --- |
| 1. Changeset | Every PR with user-facing change | Contributor | `.changeset/*.md` file |
| 2. Merge | PR approved | Maintainer | Change lands on `dev`, then `main` |
| 3. Release PR | Push to `main` | `release.yml` (automated) | Version bump + `CHANGELOG.md` PR |
| 4. Merge release PR | Checklist passes | Maintainer | Version bump lands on `main` |
| 5. Tag + publish | Maintainer pushes tag | Maintainer triggers, `publish.yml` (automated) | Git tag, built `dist/` artifacts, GitHub Release |

## Versioning strategy

HR Skills follows [Semantic Versioning](https://semver.org/) for the root
`hr-skills` package version, applied through Changesets:

| Bump | When to use | Examples |
| --- | --- | --- |
| **major** | Breaking change to a distribution consumers depend on structurally | Renaming/removing skill directories consumers reference by path, changing `registry/skills.json`'s `schemaVersion`, removing a supported platform |
| **minor** | Backward-compatible additions | New skills, promoting skills to Full tier, new generated artifacts, new documented platform integration |
| **patch** | Backward-compatible fixes | Content corrections, prompt/example fixes, validator bug fixes, doc-only changes |

Notes specific to this repository:

- **Skill-level `metadata.version`** (per `SKILL.md`) is independent of the
  repository release version. It tracks a single skill's own content
  revisions and is not required to move in lockstep with a root release —
  see `docs/engineering/format.md` for frontmatter fields. A root release can ship
  changes to many skills without every one of them bumping
  `metadata.version`, and vice versa.
- **`registry/skills.json`'s `schemaVersion`** is versioned separately per
  the rule in `docs/engineering/registry.md` (bump `REGISTRY_SCHEMA_VERSION` only for
  breaking shape changes). A `schemaVersion` bump is always at least a
  repository **major** release, since it can break consumers that parse
  the registry directly.
- **`updateInternalDependencies: "patch"`** in `.changeset/config.json`
  means if an internal workspace dependency changes, dependents get at
  least a patch bump — relevant if `hr-skills-build` or `skills-ref` are
  ever un-ignored.
- Changesets determines the final bump as the **highest** bump across all
  pending changesets for a release — one `major` changeset is enough to
  make the whole release major, regardless of how many `patch` changesets
  also merged.

## Release validation checklist

Every release must pass all of the following before the tag in stage 5 is
pushed. Automated items are already enforced by CI; manual items are the
maintainer's responsibility when reviewing the release PR.

### Automated (enforced by `release.yml` and PR workflows)

- [ ] `bun run validate` passes — skill frontmatter, format,
      `registry/skills.json` staleness/consistency, and
      `.claude-plugin/marketplace.json` staleness all check out
- [ ] `bun run typecheck` and `bun run test` pass (`typecheck.yml`,
      `test.yml`, on both `ubuntu-latest` and `windows-latest`)
- [ ] `bun run lint`, `bun run lint:md`, and `bun run lint:links` pass
      (`lint.yml`)
- [ ] `bun run knip` reports no unused files or dependencies (`knip.yml`)
- [ ] Every pending `.changeset/*.md` file is consumed and reflected in the
      generated `CHANGELOG.md` diff
- [ ] `bun run validate` passes again in `publish.yml` before the tagged
      commit's artifacts are built (a second, independent check against the
      exact commit being released, not just the release-PR commit)

### Manual (maintainer, before merging the release PR)

- [ ] The version bump matches the [versioning strategy](#versioning-strategy)
      given what actually changed — reject the release PR and add a missing
      changeset if the bump looks too low (for example, a schema-breaking
      change proposed as `minor`)
- [ ] `CHANGELOG.md`'s new entries are readable on their own — see
      [Release notes workflow](#release-notes-workflow)
- [ ] `docs/engineering/skill-matrix.md` and `registry/skills.json` reflect the current
      `skills/` contents (regenerated by `matrix.yml` on the prior push to
      `main` — confirm it ran and committed cleanly, not just that the
      files exist)
- [ ] `.claude-plugin/marketplace.json` was regenerated via `bun run sync`
      if any skill was added, removed, or renamed since the last release
- [ ] Distribution channels are consistent (see
      [Cross-channel consistency](#cross-channel-consistency-across-distribution-channels))

## Release notes workflow

Release notes are generated, not hand-written, following the same
"content is code" principle used for `docs/engineering/skill-matrix.md` and
`registry/skills.json`:

1. Every changeset's description (written in stage 1) **is** the release
   note for that change — write it as a complete, standalone sentence a
   reader outside the project can understand, the way existing
   `.changeset/*.md` files and `CHANGELOG.md` entries already do (see
   examples in `CHANGELOG.md`'s `1.1.0` section).
2. `changesets/action@v1` compiles all pending changeset descriptions into
   a new `CHANGELOG.md` section on every release, grouped by bump type
   (`Major Changes`, `Minor Changes`, `Patch Changes`), using
   `@changesets/cli/changelog` (`.changeset/config.json`).
3. The same `CHANGELOG.md` section is used verbatim as the GitHub Release
   body — no separate release-notes document is maintained, so there is
   exactly one place release notes are authored (the changeset) and one
   place they are compiled (`CHANGELOG.md`).
4. **Legacy entries** in `CHANGELOG.md` (the `v1.0.x` sections, generated
   from Conventional Commits before Changesets was adopted) are historical
   record only — do not hand-edit them, and do not mix the two formats in
   a new entry.

### Changelog format history

`CHANGELOG.md` has gone through three tools over the project's life, and
entries before `1.1.0` were originally written in two different formats
(a hand-written [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
style for `1.0.0`, then a Conventional-Commits-based generator with `v`
prefixes, emoji section headers, and compare-changes links for
`1.0.1`–`1.0.4`, before migrating to Changesets at `1.1.0`). All version
headers have since been normalized to the single format Changesets
produces — plain `major.minor.patch`, no `v` prefix — so every entry in
the file now uses one consistent header style. Bullet content for
pre-`1.1.0` entries was left untouched; only headers, dates, and
compare-change links were reformatted.

Two things to know when working with `CHANGELOG.md` going forward:

- **Changesets always inserts new content directly under the `# Changelog`
  H1**, not at the end of the file — this is why the file reads newest
  version first. Don't hand-insert a new section anywhere else; let
  `changesets/action` do it.
- **Never hand-edit a version's bullet list after it's released.** If a
  changeset description was wrong, that's a documentation bug in a
  historical record — fix it forward in the next release's notes rather
  than editing an already-tagged section, for the same reason git tags
  aren't rewritten (see [Rollback guidance](#rollback-guidance)).

### Writing a good changeset description

- Lead with what changed, not how — "Add `hr-x` skill" not "Ran the skill
  generator for `hr-x`"
- Name the concrete artifacts affected (skill IDs, file paths, command
  names) the way existing entries in `CHANGELOG.md` do
- State the resulting count or state when it's a bulk change (for example,
  "Regenerated the Skill Matrix (146 full, 0 partial, 0 bare)")
- One changeset per logical change, not one changeset per commit — squash
  the description, not the git history

## Cross-channel consistency across distribution channels

A release is only complete when every channel in
[`docs/integrations/README.md`](../integrations/README.md#supported-platforms) reflects the
same state:

| Channel | What must match | How it's kept in sync |
| --- | --- | --- |
| `package.json` version + git tag | Same version number | `changesets/action@v1` bumps `package.json`; maintainer tags the same value |
| GitHub Release | Same version, changelog matches `CHANGELOG.md` | Created automatically from the tag by `publish.yml`; body copied from the matching `CHANGELOG.md` section |
| `dist/hr-skills.zip`, `dist/hr-skills.skill` | Built from the exact tagged commit, attached to the GitHub Release | `bun run build` / `bun run build -- --skill` in `publish.yml`, never built or uploaded by hand |
| `.claude-plugin/marketplace.json` | Every current `hr-*` skill listed, no stale entries | `bun run sync`, validated for staleness by `bun run validate` |
| `registry/skills.json` | `skillCount` and `skills[]` match `skills/` on disk | `bun run registry`, validated for staleness by `bun run validate` |
| `docs/engineering/skill-matrix.md` | Same skill count and tier breakdown as the registry | `bun run matrix`, regenerated alongside the registry in `matrix.yml` |
| skills.sh / `npx skills add` | Reads the same `.claude-plugin/marketplace.json` | No separate step — same manifest, so it cannot drift once the manifest is current |
| Direct clone | Matches whatever commit `main` is at | No sync needed — it's the source of truth the others are generated from |

If any row is out of sync at release time, fix the generator's input
(`skills/` contents or frontmatter) and rerun the generator — never hand-edit
`marketplace.json`, `registry/skills.json`, or `docs/engineering/skill-matrix.md`
directly to force a match.

## Responsibilities

| Role | Responsibilities |
| --- | --- |
| **Contributor** | Add a changeset with every user-facing PR; keep the description accurate and standalone |
| **Reviewer** | Confirm the changeset's bump type and description match the change before approving the PR |
| **Maintainer (release owner)** | Review and merge the automated release PR against the [checklist](#release-validation-checklist); push the git tag; create the GitHub Release; confirm cross-channel consistency |

Today, Tuan Duc Tran holds the maintainer role for all release steps.

## Prerequisites

Before cutting a release, the maintainer needs:

- Write access to `main` (to merge the release PR) and tag-push permission
- A clean local `main` (`git pull` before tagging, so the pushed tag points
  at the exact commit the release PR merged)
- `bun` installed locally if verifying the checklist manually rather than
  trusting CI alone (recommended for the first release after a process
  change like this one)

## Rollback guidance

Releases are append-only by design — semver versions and git tags are
never reused or force-moved. Rollback means shipping a fix forward, not
rewriting history, with one exception (bad tag, caught immediately).

### A bug is discovered in an already-tagged release

1. Do not delete or retag the released version.
2. Fix the issue on `dev` as a normal change, with its own changeset (a
   `patch` changeset unless the fix is itself breaking).
3. Release the fix as a new version through the normal lifecycle above.
   Consumers pin to a version or track `main`; both recover correctly from
   a new patch release, and neither is safe against a rewritten tag.
4. If the released version is actively harmful (for example, a skill
   contains materially incorrect compliance guidance), add a note to the
   top of the relevant `CHANGELOG.md` entry pointing to the fixed version,
   and consider marking the GitHub Release as a pre-release or editing its
   description to point forward — do not delete the GitHub Release, since
   that breaks the historical record `CHANGELOG.md` refers to.

### The tag was pushed but the GitHub Release was never created, or was created incorrectly

This is the one case where correcting history is acceptable, because
nothing downstream has been generated from it yet:

1. If the GitHub Release body is wrong: edit the Release in place — its
   body should always mirror the corresponding `CHANGELOG.md` section, so
   editing it to match is a correction, not a rewrite.
2. If the tag itself points at the wrong commit and was pushed within the
   same release cycle with no one having pulled it: `git tag -d`, `git
   push --delete origin <tag>`, then retag the correct commit. Do this only
   before announcing the release anywhere external to GitHub.

### The release PR was merged with an incorrect version bump

If caught before tagging (stage 5): revert the release PR's merge commit
on `main`, fix the missing/incorrect changeset on `dev`, and let
`release.yml` regenerate a corrected release PR on the next push to
`main`. If caught after tagging: treat it as "a bug is discovered in an
already-tagged release" above — ship the correction as a new version.

## Related documents

- [`docs/integrations/README.md`](../integrations/README.md) — supported distribution
  channels and their onboarding requirements
- [`docs/engineering/registry.md`](../engineering/registry.md) — `registry/skills.json` schema,
  generation, and staleness validation
- [`docs/engineering/format.md`](../engineering/format.md) — skill package structure and
  `metadata.version` frontmatter field
- [`docs/ROADMAP.md`](../ROADMAP.md) — Phase 5, Community & Distribution
- [`.changeset/README.md`](../../.changeset/README.md) — contributor-facing
  changeset quick reference
- [`AGENTS.md`](../../AGENTS.md) — branch strategy and commit conventions
