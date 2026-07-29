---
"hr-skills": patch
---

Standardized the `description` frontmatter field across all 146 skills to a single consistent format: the entire value wrapped in one pair of double quotes, with trigger phrases written as plain comma-separated text instead of being individually quoted. Fixed a punctuation glitch ("task., or ...") present in 14 descriptions where a trailing clause had been appended incorrectly. Bumped `metadata.version` to `1.0.1` for every skill to reflect the frontmatter update. Updated the description example in `docs/format.md` and the frontmatter checklist in `AGENTS.md` / `.agents/AGENTS.md` to document the required quoting convention for future skills.
