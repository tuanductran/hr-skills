# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
