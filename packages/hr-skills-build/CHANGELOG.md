# Changelog

All notable changes to `hr-skills-build` will be documented in this file.

## [1.0.0] - 2026-02-27

### Added

- `src/validate.ts` — validates all 15 HR SKILL.md files for frontmatter, sections, and content length
- `src/catalog.ts` — generates `skills/CATALOG.md` from all skill definitions
- `src/config.ts` — defines `HR_SKILLS` list and `SKILLS_DIR` path
- Bun-native scripts (no external dependencies)
- Unit tests via `bun test` in `test/`
