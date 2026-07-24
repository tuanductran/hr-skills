---
"hr-skills": minor
---

Implemented Phase 4.1 of the roadmap: a generated, machine-readable Skill Registry (`registry/skills.json`) that indexes every skill's tier, domain, tags, aliases, capabilities, trigger phrases, dependencies, and a deterministic related-skills graph.

- New `packages/hr-skills-build/src/registry.ts` — pure `buildRegistry()` function, deriving all metadata from existing sources (SKILL.md frontmatter and sections, and the existing `classifySkill()` classifier) rather than introducing a second manually maintained metadata store.
- New `bun run registry` command (`generate-registry.ts`) generates `registry/skills.json`; wired into `turbo.jsonc` and CI (`matrix.yml` now regenerates and commits both `docs/skill-matrix.md` and `registry/skills.json` on every push to `main`).
- `bun run validate` now also validates the registry (`validate-registry.ts`): schema conformance, staleness vs. the current filesystem, duplicate IDs, dangling `dependencies`/`relatedSkills` references, and circular dependencies.
- `SKILL.md` frontmatter is unchanged — no routing metadata was added to any of the 146 skill files.
- Extracted a shared `computeTier()` helper (previously duplicated inline in the skill-matrix generator) so the matrix and the registry can never disagree about a skill's maturity tier.
- Added `docs/registry.md` documenting the architecture, schema, generation, validation, and extension guidelines, and linked it from `docs/ROADMAP.md` and `AGENTS.md`.
