---
"hr-skills": minor
---

Added `.github/workflows/publish.yml`, triggered on `v*` tag pushes, which
automates the last manual step of the release lifecycle (`docs/release.md`
stage 5): it builds `dist/hr-skills.zip` and `dist/hr-skills.skill` from the
tagged commit, extracts the matching `CHANGELOG.md` section, and creates
the GitHub Release with both artifacts attached. Previously this step was
entirely manual, as documented in `.changeset/README.md`'s "Releasing"
section. Updated `docs/release.md` (lifecycle stage 5, the release
validation checklist, and the cross-channel consistency table) and
`.changeset/README.md` to describe the new automated step.
