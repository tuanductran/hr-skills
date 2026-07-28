---
"hr-skills": minor
---

Added `GOVERNANCE.md` defining the community governance model: maintainer vs. contributor roles, a review-and-approval workflow mapping the PR template's content types to concrete review criteria, a per-area ownership table, issue/discussion routing, and the roadmap feedback process. Resolves the review-process question left open in `CONTRIBUTING.md.suggestions.md` and the `[Unknown]` review-SLA and release-cadence notes in `docs/contributing/workflow.md` and `onboarding.md`.

- Added `.github/ISSUE_TEMPLATE/config.yml` (disables blank issues, links to Discussions) and `.github/DISCUSSION_TEMPLATE/{general,ideas}.yml` as the structured entry points for open-ended questions and early-stage ideas that the existing bug/feature/new-skill issue templates didn't cover.
- Annotated `.github/CODEOWNERS` explaining the single-owner model and where area-scoped entries would go as the project grows.
- Expanded `CONTRIBUTING.md`'s pre-submit checklist to match what CI actually enforces (`lint:links`, `test`, `knip`), added a Review process section, and linked to `docs/contributing/` and `GOVERNANCE.md`.
- Marked `CONTRIBUTING.md.suggestions.md` items 1-3 `[Merged]`; item 4 (`skill-vetter` contributor self-check) stays open pending confirmation.
