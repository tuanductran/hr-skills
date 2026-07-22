# Changelog

## 1.1.0

### Minor Changes

- 438f6f8: Completed Phase 3 — Skill Maturity Improvement by upgrading ten remaining Partial skills (`hr-accessibility-accommodation`, `hr-competency-management`, `hr-consulting`, `hr-crisis-management`, `hr-design-thinking`, `hr-digital-hr`, `hr-learning-strategy`, `hr-ma-integration-by-country`, `hr-mobile`, and `hr-qa`) to Full tier with production-ready prompt libraries and operational workflow examples. Regenerated the Skill Matrix (136 full, 10 partial, 0 bare). Updated roadmap to mark Phase 3 as completed and Phase 4 — AI Agent Ecosystem as the current phase.
- 6a1f9ea: Completed the remaining ten Partial skills to Full tier (`hr-change-communication`, `hr-employer-branding`, `hr-retirement-benefits`, `hr-search-strategy`, `hr-security`, `hr-skills-taxonomy`, `hr-succession-planning`, `hr-talent-supply-chain`, `hr-total-rewards`, and `hr-uiux`) by adding the missing `prompts/` and `examples/` subdirectories. New prompt libraries and operational workflow examples match the structure, tone, and quality of existing Full skills, with `content/` files cross-linked to their new examples. Regenerated the Skill Matrix (146 full, 0 partial, 0 bare) — the repository now has zero remaining Partial or Bare skills.
- 8b80927: Expanded 28 skills from Partial to Full tier by adding prompt libraries and operational workflow examples. Updated `bun run validate` and `bun run matrix` tooling to enforce the canonical Full Skill standard requiring non-empty `content/`, `prompts/`, and `examples/` subdirectories.
- f83faf9: Upgraded nine organization design and transformation skills (`hr-operating-model`, `hr-organization-effectiveness`, `hr-organization-network-analysis`, `hr-organizational-design`, `hr-organizational-development`, `hr-mergers-acquisitions`, `hr-post-merger-integration`, `hr-strategic-planning`, and `hr-workforce-transformation`) to Full tier by adding prompt libraries and operational workflow examples.
- f63f8a7: Upgraded seven people leadership and management skills (`hr-hr-coordination`, `hr-hr-management`, `hr-manager-effectiveness`, `hr-people-leadership`, `hr-coaching-mentoring`, `hr-employee-relations`, and `hr-labor-relations`) to Full tier by adding prompt libraries and operational workflow examples.
- bc119c3: Upgraded 11 talent acquisition and HR operations skills (`hr-executive-assessment`, `hr-global-expansion`, `hr-global-hr`, `hr-internal-mobility`, `hr-job-analysis`, `hr-job-description`, `hr-market-mapping`, `hr-passive-candidate-engagement`, `hr-policy-management`, `hr-retained-search`, and `hr-risk-management`) to Full tier by adding prompt libraries and operational workflow examples.

### Patch Changes

- 8521aac: Updated HR AI privacy and agentic AI examples to align headings and remove jurisdiction-specific legal conclusions.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## v1.0.4

[compare changes](https://github.com/tuanductran/hr-skills/compare/v1.0.3...v1.0.4)

### 🚀 Features

- **skills:** Add hr-social-recruiting skill ([8088158](https://github.com/tuanductran/hr-skills/commit/8088158))
- Add prompt libraries and regenerate repository bundles ([4f9b922](https://github.com/tuanductran/hr-skills/commit/4f9b922))
- **skills:** Add advanced HR capability skills ([9c0e8a0](https://github.com/tuanductran/hr-skills/commit/9c0e8a0))
- **skills:** Expand HR skills catalog and refresh marketplace ([63329b2](https://github.com/tuanductran/hr-skills/commit/63329b2))

### 🐛 Bug Fixes

- **meta-skills:** Normalize valibot SKILL.md metadata to repo standard ([9dd4c94](https://github.com/tuanductran/hr-skills/commit/9dd4c94))
- **quality:** Resolve validate, typecheck, and lint failures ([6587dbc](https://github.com/tuanductran/hr-skills/commit/6587dbc))

### ♻️ Refactors

- **hr-skills-build:** Improve testability and add validator tests ([65e1da6](https://github.com/tuanductran/hr-skills/commit/65e1da6))
- **docs:** Consolidate project documentation ([bbdf50b](https://github.com/tuanductran/hr-skills/commit/bbdf50b))
- **skills-ref:** Optimize XML escaping with lookup map ([3e9bf43](https://github.com/tuanductran/hr-skills/commit/3e9bf43))
- **repo:** Modernize repository tooling and documentation ([14371f8](https://github.com/tuanductran/hr-skills/commit/14371f8))
- **types:** Rename ValidationError to SkillValidationIssue ([65d2a39](https://github.com/tuanductran/hr-skills/commit/65d2a39))
- **meta-skills:** Rewrite valibot skill for hr-skills monorepo context ([0280061](https://github.com/tuanductran/hr-skills/commit/0280061))

### 📖 Documentation

- Add Contributor Covenant code of conduct ([4dd668f](https://github.com/tuanductran/hr-skills/commit/4dd668f))
- **readme:** Clarify repository maturity and skill coverage ([737441e](https://github.com/tuanductran/hr-skills/commit/737441e))
- **biome:** Remove leftover content reference markers ([d418d75](https://github.com/tuanductran/hr-skills/commit/d418d75))
- **skills:** Standardize skill metadata and improve skill routing ([6422921](https://github.com/tuanductran/hr-skills/commit/6422921))
- Add comprehensive project roadmap ([9a0b249](https://github.com/tuanductran/hr-skills/commit/9a0b249))
- **ROADMAP:** Clarify dependency scanning tool separation ([3335688](https://github.com/tuanductran/hr-skills/commit/3335688))
- **ROADMAP:** Mark knip & lint:links as added to CI ([d2f91b2](https://github.com/tuanductran/hr-skills/commit/d2f91b2))
- **roadmap:** Rewrite roadmap structure ([9e964df](https://github.com/tuanductran/hr-skills/commit/9e964df))
- Single-source SKILL.md template to .github/skill-template.md ([efb4aa6](https://github.com/tuanductran/hr-skills/commit/efb4aa6))
- Sync ROADMAP with feat/v1.1.0-quality (PR #74) ([#74](https://github.com/tuanductran/hr-skills/issues/74))

### 📦 Build System

- **tooling:** Standardize Bun, Turborepo, and repository workflows ([9469704](https://github.com/tuanductran/hr-skills/commit/9469704))
- **bun:** Adopt dependency catalogs across the workspace ([c998084](https://github.com/tuanductran/hr-skills/commit/c998084))

### 🧹 Chores

- **skills:** Normalize marketplace metadata and update skill catalog ([22b84c0](https://github.com/tuanductran/hr-skills/commit/22b84c0))
- **renovate:** Improve dependency update configuration ([878aff0](https://github.com/tuanductran/hr-skills/commit/878aff0))
- **config:** Migrate config renovate.json5 ([8ccabe5](https://github.com/tuanductran/hr-skills/commit/8ccabe5))

### 🧪 Tests

- Fix assertTemplateMarkerExists drift case ([3fb0eee](https://github.com/tuanductran/hr-skills/commit/3fb0eee))
- Remove unnecessary comment in sync test ([1b9dc6f](https://github.com/tuanductran/hr-skills/commit/1b9dc6f))

### 🤖 CI

- Add validate.yml workflow for SKILL.md validation ([32cdeab](https://github.com/tuanductran/hr-skills/commit/32cdeab))
- Add lint:links & knip CI; docs: require root router update ([96e7e8b](https://github.com/tuanductran/hr-skills/commit/96e7e8b))

### ❤️ Contributors

- Tuan Duc Tran ([@tuanductran](https://github.com/tuanductran))
- Claude <claude@anthropic.com>

## v1.0.3

[compare changes](https://github.com/tuanductran/hr-skills/compare/v1.0.2...v1.0.3)

### 🚀 Features

- Add new HR skills and improve repository workflow ([65eb73a](https://github.com/tuanductran/hr-skills/commit/65eb73a))
- **repo:** Add curated skills.sh repository groupings ([22c00f0](https://github.com/tuanductran/hr-skills/commit/22c00f0))
- **skills:** Add culture, HRIS, and knowledge management skills ([cb1f780](https://github.com/tuanductran/hr-skills/commit/cb1f780))
- Add 6 strategic HR skills and update catalogs ([5e821d0](https://github.com/tuanductran/hr-skills/commit/5e821d0))

### 🐛 Bug Fixes

- **.claude:** Remove Vercel references from bun skill ([e71b828](https://github.com/tuanductran/hr-skills/commit/e71b828))
- **claude:** Allow bun run clean command ([43e1c9f](https://github.com/tuanductran/hr-skills/commit/43e1c9f))
- Correct symlink path for .claude/skills ([4aa2697](https://github.com/tuanductran/hr-skills/commit/4aa2697))

### ♻️ Refactors

- **repo:** Make .agents the single source of truth for skills ([a65be97](https://github.com/tuanductran/hr-skills/commit/a65be97))
- Restructure HR skills content and examples ([f16d653](https://github.com/tuanductran/hr-skills/commit/f16d653))
- **skills:** Restructure content/examples, add 3 skills ([f77b3b1](https://github.com/tuanductran/hr-skills/commit/f77b3b1))
- **sync:** Simplify skills markdown generation ([49bf2a1](https://github.com/tuanductran/hr-skills/commit/49bf2a1))

### 📖 Documentation

- **github:** Add pull request template ([8b48e62](https://github.com/tuanductran/hr-skills/commit/8b48e62))
- Update README links ([6e73d9f](https://github.com/tuanductran/hr-skills/commit/6e73d9f))
- **catalog:** Regenerate skills/CATALOG.md via bun run catalog ([c83b5f7](https://github.com/tuanductran/hr-skills/commit/c83b5f7))
- **readme:** Add skills.sh badge and remove examples ([7629678](https://github.com/tuanductran/hr-skills/commit/7629678))

### 📦 Build System

- Update schemas and migrate to Bun native types ([d6e2103](https://github.com/tuanductran/hr-skills/commit/d6e2103))

### 🧹 Chores

- **clean:** Add cleanup script and update knip ([12c73bd](https://github.com/tuanductran/hr-skills/commit/12c73bd))
- Add CLAUDE.md alias for AGENTS.md ([bf0b763](https://github.com/tuanductran/hr-skills/commit/bf0b763))
- **funding:** Add GitHub Sponsors configuration ([54eabab](https://github.com/tuanductran/hr-skills/commit/54eabab))
- **funding:** Remove Buy Me a Coffee support ([3824bb5](https://github.com/tuanductran/hr-skills/commit/3824bb5))
- **repo:** Add CODEOWNERS file ([7538e68](https://github.com/tuanductran/hr-skills/commit/7538e68))
- Simplify FUNDING.yml configuration ([fd927ba](https://github.com/tuanductran/hr-skills/commit/fd927ba))
- Switch funding configuration to Ko-fi only ([538d408](https://github.com/tuanductran/hr-skills/commit/538d408))
- Upgrade packages ([15cc3fd](https://github.com/tuanductran/hr-skills/commit/15cc3fd))

### ❤️ Contributors

- Tuan Duc Tran ([@tuanductran](https://github.com/tuanductran))

## v1.0.2

### 🚀 Features

- Initial release of HR Skills for Claude ([e1b17f9](https://github.com/tuanductran/hr-skills/commit/e1b17f9))
- Add zip packages for all 15 HR skills ([056bec0](https://github.com/tuanductran/hr-skills/commit/056bec0))
- **examples:** Add hiring guide examples for 10 engineering roles ([0ef0cda](https://github.com/tuanductran/hr-skills/commit/0ef0cda))

### 🐛 Bug Fixes

- Correct custom error prototype chain and freeze validation errors ([3f6bfcf](https://github.com/tuanductran/hr-skills/commit/3f6bfcf))
- Add placeholders and resolve style violations across technical skills ([9709756](https://github.com/tuanductran/hr-skills/commit/9709756))
- **content:** Add blank lines before lists and remove hard-coded years ([406eba0](https://github.com/tuanductran/hr-skills/commit/406eba0))
- **hr-skills-build:** Support CRLF in skill parsing regex ([033f311](https://github.com/tuanductran/hr-skills/commit/033f311))
- **hr-skills-build:** Remove trigger placeholder from docs sync ([469fe28](https://github.com/tuanductran/hr-skills/commit/469fe28))
- **hr-skills-build:** Fail sync on table marker drift ([63ae14e](https://github.com/tuanductran/hr-skills/commit/63ae14e))
- **sync:** Rebuild skills.md alphabetically and sync content/examples ([cd681c1](https://github.com/tuanductran/hr-skills/commit/cd681c1))
- **claude:** Correct settings.json permission rule syntax ([a18f377](https://github.com/tuanductran/hr-skills/commit/a18f377))
- Avoid double hr- prefix in scaffolded SKILL.md name field ([dbd20fb](https://github.com/tuanductran/hr-skills/commit/dbd20fb))
- Correct settings.json permission rule syntax ([40b4416](https://github.com/tuanductran/hr-skills/commit/40b4416))

### ♻️ Refactors

- **skills-ref:** Improve CLI execution and test coverage ([a8cbace](https://github.com/tuanductran/hr-skills/commit/a8cbace))
- Unify build helpers and fix package configurations ([efb6363](https://github.com/tuanductran/hr-skills/commit/efb6363))
- **hr-skills-build:** Use shared YAML frontmatter parser ([79a1ce3](https://github.com/tuanductran/hr-skills/commit/79a1ce3))
- **hr-skills-build:** Use yaml parser ([387dfe3](https://github.com/tuanductran/hr-skills/commit/387dfe3))

### 📖 Documentation

- **agents:** Note system zip CLI prerequisite for bun run zip ([ce2f9d0](https://github.com/tuanductran/hr-skills/commit/ce2f9d0))
- Synchronize README.md files with project changes ([adca76e](https://github.com/tuanductran/hr-skills/commit/adca76e))
- **content:** Add HR knowledge base covering core HR and technical hiring ([e2ceb7a](https://github.com/tuanductran/hr-skills/commit/e2ceb7a))
- **hr-ai:** Align hiring example with content standards ([868d994](https://github.com/tuanductran/hr-skills/commit/868d994))
- Align agent guidance with project tooling ([964bf03](https://github.com/tuanductran/hr-skills/commit/964bf03))
- **hr-skills-build:** Update package workflow commands ([8a5100f](https://github.com/tuanductran/hr-skills/commit/8a5100f))
- **examples:** Add HR skill examples ([07f14b5](https://github.com/tuanductran/hr-skills/commit/07f14b5))
- **examples:** Add HR operations examples ([bfd2291](https://github.com/tuanductran/hr-skills/commit/bfd2291))
- **content:** Add example workflow links ([c6ce69e](https://github.com/tuanductran/hr-skills/commit/c6ce69e))
- **examples:** Add content workflow links ([f03d8fb](https://github.com/tuanductran/hr-skills/commit/f03d8fb))

### 📦 Build System

- **skills-ref:** Migrate build pipeline to tsup ([9d02cca](https://github.com/tuanductran/hr-skills/commit/9d02cca))
- **skills-ref:** Restore bun build pipeline ([ae70baa](https://github.com/tuanductran/hr-skills/commit/ae70baa))
- **release:** Migrate from bumpp to changelogen ([b5cf589](https://github.com/tuanductran/hr-skills/commit/b5cf589))

### 🧹 Chores

- Review and improve project completeness ([09b1f67](https://github.com/tuanductran/hr-skills/commit/09b1f67))
- Bump markdownlint-cli from 0.47.0 to 0.48.0 ([91418a7](https://github.com/tuanductran/hr-skills/commit/91418a7))
- Overhaul project tooling and development workflow ([0632537](https://github.com/tuanductran/hr-skills/commit/0632537))
- Overhaul project tooling and development workflow ([9afc756](https://github.com/tuanductran/hr-skills/commit/9afc756))
- **skills:** Regenerate skill bundles ([262fca0](https://github.com/tuanductran/hr-skills/commit/262fca0))
- **skills:** Regenerate catalog ([af6e365](https://github.com/tuanductran/hr-skills/commit/af6e365))
- Upgrade packages ([9857b5a](https://github.com/tuanductran/hr-skills/commit/9857b5a))
- Standardize package.json files and improve biome config ([ed84b43](https://github.com/tuanductran/hr-skills/commit/ed84b43))
- Install and configure bumpp and sync package versions to 1.0.0 ([45d1700](https://github.com/tuanductran/hr-skills/commit/45d1700))
- Migrate commitlint config to typescript ([aefe893](https://github.com/tuanductran/hr-skills/commit/aefe893))
- **knip:** Migrate config from jsonc to typescript ([bc83c27](https://github.com/tuanductran/hr-skills/commit/bc83c27))
- **repo:** Modernize dependency and automation configuration ([cb85f00](https://github.com/tuanductran/hr-skills/commit/cb85f00))
- **.claude:** Add .claude skills and normalize frontmatter ([d7059ad](https://github.com/tuanductran/hr-skills/commit/d7059ad))

### 🧪 Tests

- Add bun test infrastructure and test suites ([ce9deb7](https://github.com/tuanductran/hr-skills/commit/ce9deb7))
- **skills-ref:** Restore library test coverage ([c8bf70f](https://github.com/tuanductran/hr-skills/commit/c8bf70f))

### 🤖 CI

- Build workspace packages before validate and catalog ([49f3262](https://github.com/tuanductran/hr-skills/commit/49f3262))
- Split GitHub Actions workflows into separate pipelines ([cc23945](https://github.com/tuanductran/hr-skills/commit/cc23945))

### ❤️ Contributors

- Tuan Duc Tran ([@tuanductran](https://github.com/tuanductran))

## v1.0.1

### 🚀 Features

- Initial release of HR Skills for Claude ([e1b17f9](https://github.com/tuanductran/hr-skills/commit/e1b17f9))
- Add zip packages for all 15 HR skills ([056bec0](https://github.com/tuanductran/hr-skills/commit/056bec0))
- **examples:** Add hiring guide examples for 10 engineering roles ([0ef0cda](https://github.com/tuanductran/hr-skills/commit/0ef0cda))

### 🐛 Bug Fixes

- Correct custom error prototype chain and freeze validation errors ([3f6bfcf](https://github.com/tuanductran/hr-skills/commit/3f6bfcf))
- Add placeholders and resolve style violations across technical skills ([9709756](https://github.com/tuanductran/hr-skills/commit/9709756))
- **content:** Add blank lines before lists and remove hard-coded years ([406eba0](https://github.com/tuanductran/hr-skills/commit/406eba0))
- **hr-skills-build:** Support CRLF in skill parsing regex ([033f311](https://github.com/tuanductran/hr-skills/commit/033f311))
- **hr-skills-build:** Remove trigger placeholder from docs sync ([469fe28](https://github.com/tuanductran/hr-skills/commit/469fe28))
- **hr-skills-build:** Fail sync on table marker drift ([63ae14e](https://github.com/tuanductran/hr-skills/commit/63ae14e))

### ♻️ Refactors

- **skills-ref:** Improve CLI execution and test coverage ([a8cbace](https://github.com/tuanductran/hr-skills/commit/a8cbace))
- Unify build helpers and fix package configurations ([efb6363](https://github.com/tuanductran/hr-skills/commit/efb6363))
- **hr-skills-build:** Use shared YAML frontmatter parser ([79a1ce3](https://github.com/tuanductran/hr-skills/commit/79a1ce3))
- **hr-skills-build:** Use yaml parser ([387dfe3](https://github.com/tuanductran/hr-skills/commit/387dfe3))

### 📖 Documentation

- **agents:** Note system zip CLI prerequisite for bun run zip ([ce2f9d0](https://github.com/tuanductran/hr-skills/commit/ce2f9d0))
- Synchronize README.md files with project changes ([adca76e](https://github.com/tuanductran/hr-skills/commit/adca76e))
- **content:** Add HR knowledge base covering core HR and technical hiring ([e2ceb7a](https://github.com/tuanductran/hr-skills/commit/e2ceb7a))
- **hr-ai:** Align hiring example with content standards ([868d994](https://github.com/tuanductran/hr-skills/commit/868d994))

### 📦 Build System

- **skills-ref:** Migrate build pipeline to tsup ([9d02cca](https://github.com/tuanductran/hr-skills/commit/9d02cca))
- **skills-ref:** Restore bun build pipeline ([ae70baa](https://github.com/tuanductran/hr-skills/commit/ae70baa))

### 🧹 Chores

- Review and improve project completeness ([09b1f67](https://github.com/tuanductran/hr-skills/commit/09b1f67))
- Bump markdownlint-cli from 0.47.0 to 0.48.0 ([91418a7](https://github.com/tuanductran/hr-skills/commit/91418a7))
- Overhaul project tooling and development workflow ([0632537](https://github.com/tuanductran/hr-skills/commit/0632537))
- Overhaul project tooling and development workflow ([9afc756](https://github.com/tuanductran/hr-skills/commit/9afc756))
- **skills:** Regenerate skill bundles ([262fca0](https://github.com/tuanductran/hr-skills/commit/262fca0))
- **skills:** Regenerate catalog ([af6e365](https://github.com/tuanductran/hr-skills/commit/af6e365))
- Upgrade packages ([9857b5a](https://github.com/tuanductran/hr-skills/commit/9857b5a))
- Standardize package.json files and improve biome config ([ed84b43](https://github.com/tuanductran/hr-skills/commit/ed84b43))
- Install and configure bumpp and sync package versions to 1.0.0 ([45d1700](https://github.com/tuanductran/hr-skills/commit/45d1700))
- Migrate commitlint config to typescript ([aefe893](https://github.com/tuanductran/hr-skills/commit/aefe893))

### 🧪 Tests

- Add bun test infrastructure and test suites ([ce9deb7](https://github.com/tuanductran/hr-skills/commit/ce9deb7))

### ❤️ Contributors

- Tuan Duc Tran ([@tuanductran](https://github.com/tuanductran))

## [1.0.0] - 2026-02-27

### Added

- Technical recruiting and HR AI skills covering modern engineering, hiring, compliance, analytics, onboarding, and workforce management domains
- `packages/hr-skills-build` — build tooling (validate + catalog) using Bun
- `packages/skills-ref` — TypeScript library & CLI for reading and validating skills
- `.claude-plugin/marketplace.json` — Claude marketplace plugin manifest
- Bun monorepo workspace setup
- GitHub Actions CI workflow with validate, test, lint, and typecheck jobs
- Markdown linting via `markdownlint-cli`
- Unit and integration tests via `bun test` across all packages
