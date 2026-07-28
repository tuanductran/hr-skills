---
"hr-skills": minor
---

Added `docs/release.md` (Phase 5) defining the full release lifecycle for HR Skills: the five-stage flow from changeset through tag/publish matching the `changesets/action` + `release.yml` automation, a repo-specific semver versioning strategy, a release validation checklist split into automated and manual items, a release-notes workflow explaining how changeset descriptions become `CHANGELOG.md` and GitHub Release content, a cross-channel consistency table tying every distribution channel back to its generator, and rollback guidance for three concrete scenarios.

- Corrected `.changeset/README.md`'s "Releasing" instructions, which had described a manual `bun changeset version` + tag + push flow that incorrectly claimed `release.yml` would then auto-create the GitHub Release; rewrote it to match the actual PR-bot flow (`release.yml` only runs a `version` step, no `publish` step, so it opens a Version Packages PR and never creates a tag or Release on its own).
- Normalized `CHANGELOG.md`'s version headers to a single consistent format (Changesets' bare `major.minor.patch`, no `v` prefix) across all historical entries, which had mixed three different formats from three prior tooling generations; moved a misplaced intro paragraph back under the `# Changelog` heading. No bullet content, commit hashes, or historical facts were altered.
