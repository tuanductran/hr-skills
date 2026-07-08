---
name: bun
description: "Repository guidance for using Bun as the runtime, package manager, and workspace toolchain within the hr-skills monorepo."
metadata:
  author: "Tuan Duc Tran"
  version: "1.1.0"
---

# Bun

This skill explains how Bun is used throughout the **hr-skills** monorepo. It covers workspace management, development workflows, validation commands, testing, and repository conventions.

The repository standardizes on Bun for all package management and script execution. Turborepo orchestrates tasks across workspace packages.

## Supported tasks

- Explain how Bun is used within this repository
- Install and manage workspace dependencies
- Run repository scripts using Bun
- Validate HR skills and repository metadata
- Synchronize generated repository artifacts
- Build workspace packages
- Run tests and TypeScript type checking
- Troubleshoot Bun workspace issues
- Recommend Bun workflows for local development and CI

## Repository usage

This repository uses Bun for:

- package management
- workspace dependency resolution
- script execution
- TypeScript execution
- test execution

Package managers such as npm, pnpm, and Yarn are not supported.

## Workspace packages

The repository currently contains multiple Bun workspace packages.

### hr-skills-build

Repository tooling responsible for:

- validating HR skills
- synchronizing repository metadata
- maintaining repository conventions

### skills-ref

Reusable library responsible for:

- parsing `SKILL.md`
- loading skills
- validating metadata
- generating prompts
- exposing reusable APIs for other packages

## Common commands

Install dependencies.

```bash
bun install
```

Run validation.

```bash
bun run validate
```

Synchronize generated repository artifacts.

```bash
bun run sync
```

Build every workspace package.

```bash
bun run build
```

Run all test suites.

```bash
bun run test
```

Run TypeScript type checking.

```bash
bun run typecheck
```

Run repository linting and formatting.

```bash
bun run check
bun run lint
bun run format
bun run lint:md
bun run lint:md:fix
bun run lint:links
```

Analyze unused files and dependencies.

```bash
bun run knip
```

Create a release.

```bash
bun run release
```

## Key prompts

### Repository workflows

- "Explain how Bun is used in this repository."
- "List the common Bun commands used during development."
- "Describe the repository workspace structure."
- "Explain how Turborepo and Bun work together."

### Validation

- "Run the repository validation workflow."
- "Explain what `bun run validate` does."
- "Explain what `bun run sync` does."
- "Recommend the correct validation order before opening a pull request."

### Development

- "Build every workspace package."
- "Run all tests using Bun."
- "Run TypeScript type checking."
- "Explain how to troubleshoot Bun workspace issues."

### CI

- "Generate a Bun-based CI workflow."
- "Recommend the fastest validation pipeline."
- "Explain how to use Turborepo caching."
- "Generate GitHub Actions steps for Bun."

## CI recommendations

A typical validation workflow is:

```bash
bun install --frozen-lockfile
bun run typecheck
bun run validate
bun run test
bun run build
```

This order detects type, validation, and test failures before building distributable artifacts.

## Examples

Install dependencies.

```bash
bun install
```

Validate the repository.

```bash
bun run validate
```

Synchronize repository metadata.

```bash
bun run sync
```

Build every package.

```bash
bun run build
```

Run all tests.

```bash
bun run test
```

## Tips

- Always use Bun for package management and script execution.
- Prefer workspace commands from the repository root.
- Run validation before committing repository changes.
- Keep workspace dependencies synchronized.
- Use `workspace:*` for internal package dependencies.
- Use Turborepo to execute workspace tasks instead of running packages individually when possible.

## Common issues

- Using npm, pnpm, or Yarn instead of Bun.
- Skipping repository validation before committing.
- Forgetting to synchronize generated repository artifacts.
- Running package scripts from the wrong workspace.
- Missing `bun install` after dependency changes.
- Ignoring workspace dependency relationships.

## Best practices

- Keep Bun updated across development environments.
- Run commands from the repository root unless package-specific behavior is required.
- Validate changes before opening a pull request.
- Use Turborepo to orchestrate workspace tasks.
- Keep internal packages versioned through the workspace.
- Prefer reproducible installations with `bun install --frozen-lockfile` in CI.
