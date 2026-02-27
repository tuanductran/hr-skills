# Changelog

All notable changes to `skills-ref` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.1.0] - 2026-02-27

### Added

- `validate(skillDir)` — validates a skill directory, returns list of error messages
- `readProperties(skillDir)` — reads skill properties from SKILL.md frontmatter
- `toPrompt(skillDirs[])` — generates `<available_skills>` XML block for agent system prompts
- `findSkillMd(dir)` — locates SKILL.md or skill.md in a directory
- `parseFrontmatter(content)` — parses YAML frontmatter from markdown content
- CLI: `skills-ref validate <path>`, `read-properties <path>`, `to-prompt <paths...>`
- Compiled with `bun build --target bun` to `dist/cli.js`
- Unit and integration tests via `bun test` in `test/` (31 tests)
