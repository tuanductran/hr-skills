---
name: turbo
description: "Repository guidance for using Turborepo to orchestrate workspace tasks, builds, validation, testing, and development workflows within the hr-skills monorepo."
metadata:
  author: Tuan Duc Tran
  version: "1.1.0"
---

# Turborepo

This skill explains how Turborepo is used throughout the **hr-skills** monorepo. It covers workspace orchestration, task execution, caching, package filtering, and development workflows.

Turborepo coordinates tasks across every workspace package while Bun provides the runtime and package management.

## Supported tasks

- Explain how Turborepo is used within this repository
- Run workspace tasks from the repository root
- Build workspace packages
- Validate HR skills and repository metadata
- Synchronize generated repository artifacts
- Run tests and TypeScript type checking
- Execute filtered workspace tasks
- Recommend efficient development workflows
- Explain Turborepo caching behavior
- Generate CI workflows using Turborepo

## Repository usage

This repository uses Turborepo to orchestrate workspace tasks.

Current pipeline tasks include:

- build
- dev
- test
- typecheck
- validate
- sync

Repository scripts invoke Turborepo from the workspace root while package-level scripts provide the implementation.

## Workspace orchestration

Workspace packages define their own scripts.

Examples include:

- `packages/hr-skills-build`
- `packages/skills-ref`

Turborepo automatically coordinates task execution, dependency ordering, and caching across these packages.

## Common commands

Run all workspace builds.

```bash
bun run build
```

Run development tasks.

```bash
bun run dev
```

Run repository validation.

```bash
bun run validate
```

Synchronize repository metadata.

```bash
bun run sync
```

Run every test suite.

```bash
bun run test
```

Run TypeScript type checking.

```bash
bun run typecheck
```

Execute a task directly with Turborepo.

```bash
turbo run build
```

Run a task for a single package.

```bash
turbo run build --filter=skills-ref
```

Run validation for the build package only.

```bash
turbo run validate --filter=hr-skills-build
```

## Key prompts

### Repository workflows

- "Explain how Turborepo is used in this repository."
- "Describe the workspace task pipeline."
- "Explain how Bun and Turborepo work together."
- "List the repository tasks managed by Turborepo."

### Development

- "Run every workspace build."
- "Run validation for the repository."
- "Synchronize generated repository artifacts."
- "Run tests across every workspace package."

### Filtering

- "Run a task for a single workspace package."
- "Explain how `--filter` works."
- "Recommend the correct package filter."
- "Generate filtered Turborepo commands."

### CI

- "Generate a Turborepo CI workflow."
- "Recommend a validation pipeline."
- "Explain Turborepo caching."
- "Optimize workspace builds for CI."

## Pipeline overview

Current repository tasks include:

| Task | Purpose |
|------|---------|
| `build` | Build workspace packages |
| `dev` | Run development tasks |
| `test` | Execute package test suites |
| `typecheck` | Run TypeScript type checking |
| `validate` | Validate HR skills and repository metadata |
| `sync` | Synchronize generated repository artifacts |

## Examples

Build every workspace package.

```bash
bun run build
```

Validate the repository.

```bash
bun run validate
```

Synchronize generated files.

```bash
bun run sync
```

Build only one package.

```bash
turbo run build --filter=skills-ref
```

Run validation only for the build package.

```bash
turbo run validate --filter=hr-skills-build
```

## CI recommendations

A typical validation workflow is:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run validate
bun run test
bun run build
```

Use Turborepo caching to avoid rebuilding unchanged packages.

Tasks such as `validate` and `sync` intentionally disable caching because they always operate on the latest repository state.

## Tips

- Execute workspace tasks from the repository root.
- Prefer repository scripts (`bun run ...`) over invoking package scripts directly.
- Use `--filter` during development to reduce execution time.
- Let Turborepo determine task execution order.
- Keep task outputs deterministic to maximize cache effectiveness.

## Common issues

- Running package scripts directly instead of using repository commands.
- Forgetting to use `--filter` for package-specific development.
- Expecting cached results from tasks that explicitly disable caching.
- Running Turborepo outside the repository root.
- Defining inconsistent task names across workspace packages.

## Best practices

- Use repository scripts for everyday development.
- Reserve direct `turbo run` commands for advanced workflows.
- Keep task names consistent across every workspace package.
- Enable caching only for deterministic tasks.
- Use package filters to shorten development feedback loops.
- Allow Turborepo to manage workspace execution and dependency ordering.
