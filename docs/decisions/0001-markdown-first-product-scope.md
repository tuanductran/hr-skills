# ADR 0001: Markdown-First Product Scope

- **Status:** Accepted
- **Date:** 2026-11-05
- **Decision owners:** Repository maintainer
- **Related issue:** [#286](https://github.com/tuanductran/hr-skills/issues/286)

## Context

HR Skills has grown from an HR knowledge and Agent Skills library into a broad Bun/Turborepo product workspace. The repository currently contains 146 Full-tier HR skills, a root router, documentation, build and validation tooling, package libraries, web and Discord applications, registry and planner/runtime capabilities, and integration experiments.

The breadth of the implementation must not be confused with the product's core purpose. The maintainer's priority is a maintainable, Markdown-first HR knowledge library with only the tooling required to author, validate, build, and distribute that library.

This decision defines product scope. It does not delete, rewrite, or declare existing implementation safe to remove. Existing capabilities must be classified with their dependencies before any retirement work.

## Decision

**HR Skills is a Markdown-first HR knowledge and Agent Skills repository. Markdown is the canonical source of HR knowledge and skill behavior.**

The product's source of truth is the human-authored Markdown in the root router and the skill tree. Code may validate, transform, package, or distribute that content, but must not become a second source of HR domain knowledge or silently redefine skill behavior.

### Canonical product boundary

The primary product consists of:

- Root SKILL.md: the entry point and router for the library.
- skills/hr-*/SKILL.md: the canonical definition and behavior of each HR skill.
- Optional Markdown content, prompt, and example files belonging to each skill.
- Supporting authoring and usage documentation that explains the format and how to use the library.

The existing skill content is preserved. This decision does not authorize deleting, merging, renaming, or reducing any HR skill.

### Retained capabilities

The following capabilities remain in scope:

1. **HR knowledge and Agent Skills content.** Authoring, reviewing, maintaining, and distributing the Markdown skill library is the primary product.
2. **Essential skill build.** Keep the smallest reliable workflow needed to discover the Markdown sources, validate skill structure and metadata, and produce the supported distributable skill artifact(s).
3. **Essential maintenance.** Keep only checks and generated outputs that protect the integrity, discoverability, or distribution of the Markdown library. Each retained operation must have a clear consumer and source of truth.
4. **Documentation.** Keep concise instructions for skill authors, users, and maintainers. Documentation must describe the retained workflow rather than imply that every existing product surface is part of the core product.

The exact implementation and dependency boundary of the retained build workflow is intentionally assigned to [Issue #287](https://github.com/tuanductran/hr-skills/issues/287). This ADR does not prescribe a replacement language, runtime, package manager, or build framework.

### Deferred capabilities

The following are not active product commitments for the current scope. Existing code and documentation may remain while their dependencies and retirement path are assessed:

- Hosted HTTP APIs, service deployments, authentication, rate limiting, and external API contracts.
- Advanced planner, orchestration, workflow execution, and runtime services beyond what is proven necessary for the retained skill build.
- Search, recommendation, intelligence, and registry services that duplicate or extend the core Markdown library without being required to build or distribute it.
- Evaluation platforms and operational observability systems beyond lightweight validation of the retained content/build workflow.
- Web applications, Discord bots, playgrounds, and other standalone product surfaces.
- External integrations and platform adapters that are not required for direct consumption of the Markdown skills.

"Deferred" means paused and subject to later review; it does not mean deleted, broken, or approved for immediate removal.

### scripts/ and packages/ boundary

The target boundary is deliberately small:

- scripts/ contains thin, explicit entrypoints for necessary maintenance and build commands. Scripts coordinate work; they do not become a second domain-logic layer.
- packages/ exists only when a reusable API is genuinely needed by more than one retained script or build operation. A package must have a clear consumer and a narrow responsibility.
- Internal package APIs used by scripts are implementation details. They do not imply a public SDK, hosted service, HTTP API, or external compatibility commitment.
- HR knowledge and skill behavior remain in Markdown. Python, TypeScript, shell, or another implementation language may execute the build, but must not own or duplicate the domain knowledge.

Issue #287 will inventory the current implementation and propose the minimal concrete structure. No package or script is removed by this decision alone.

### Explicitly out of scope

This decision does not:

- Delete or rewrite existing applications, packages, workflows, generated files, or HR skills.
- Migrate or rename Git branches, change the default branch, alter branch protection, or change release policy.
- Select a new programming language or mandate a Python migration.
- Design or implement hosted APIs, a SaaS product, or external integrations.
- Merge, close, or retarget unrelated pull requests.
- Treat generated artifacts as canonical sources when their Markdown inputs are available.

## Source-of-truth and change rules

1. Human-authored Markdown is authoritative for HR knowledge, skill instructions, prompts, and examples.
2. Generated files must be reproducible from their declared source inputs and must not be edited as independent knowledge sources.
3. Runtime/build code may parse, validate, normalize, route, package, and enforce structural rules; it must not silently invent or own HR domain content.
4. If a capability needs duplicated HR knowledge outside Markdown, it must be redesigned or deferred.
5. Any removal proposal must identify the affected files, consumers, dependencies, replacement (if any), and evidence that no retained workflow depends on it.
6. The root router and all existing HR skill content must remain available throughout the simplification.

## Consequences

- README and contributor documentation should describe the Markdown library as the product and distinguish retained maintenance tooling from deferred product surfaces.
- The existing repository is transitional until Issues #287–#289 classify and reduce implementation, CI, and maintenance scope.
- Future architecture and cleanup PRs should be narrow, branch-based, and traceable to the scope issues.
- Existing roadmap phases and implementation documents are historical evidence unless explicitly reaffirmed by a later scope decision.

## Follow-up

- [#287 — Design a minimal scripts/ and packages/ boundary](https://github.com/tuanductran/hr-skills/issues/287)
- [#288 — Defer non-core product surfaces and classify existing capabilities](https://github.com/tuanductran/hr-skills/issues/288)
- [#289 — Reduce CI and repository maintenance to retained workflows](https://github.com/tuanductran/hr-skills/issues/289)
