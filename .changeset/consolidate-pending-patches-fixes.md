---
"hr-skills": patch
---

Rewrote `skills-ref` `SKILL.md` frontmatter parser to use the `yaml` package instead of manual string splitting, fixing edge cases in frontmatter detection and making `SkillPropertiesSchema` a strict schema (unknown frontmatter keys are now rejected). Fixed `.claude-plugin/marketplace.json` to include the required `$schema` and `owner` fields. Fixed the release workflow (`publish.yml`) building distribution artifacts with an invalid Turborepo filter/flag combination that could fail or silently skip the build.
