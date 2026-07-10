---
name: biome
description: "Repository guidance for using Biome as the formatter, linter, and code quality tool within the hr-skills monorepo."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# Biome

This skill describes how Biome is used throughout the **hr-skills** monorepo. It covers formatting, linting, import organization, repository conventions, and development workflows.

The repository standardizes on Biome as the primary code quality tool for TypeScript, JSON, JSONC, and YAML files.

## Supported tasks

- Explain how Biome is used within this repository
- Format source code consistently
- Review Biome diagnostics
- Organize imports
- Validate repository formatting
- Apply safe code fixes
- Explain repository formatting conventions
- Troubleshoot Biome configuration issues
- Generate repository-compatible Biome configuration

## Repository conventions

This repository uses a single Biome configuration located at the repository root.

Biome is responsible for:

- code formatting
- linting
- import organization
- repository code consistency

Supported file types include:

- TypeScript
- JSON
- JSONC
- YAML

Repository-generated directories are excluded from analysis.

## Formatting conventions

The repository follows these formatting conventions.

- Tabs for indentation.
- Indentation width of 4.
- LF line endings.
- Maximum line width of 90 characters.
- Single quotes for JavaScript and TypeScript.
- Semicolons are always required.
- Trailing commas are enabled.
- Parentheses are always used for arrow function parameters.
- Imports are automatically organized.

These conventions are enforced automatically by Biome.

## Linting

The repository enables the recommended Biome rule set.

Linting focuses on:

- correctness
- readability
- maintainability
- consistent code style

Compiler errors remain the responsibility of TypeScript.

## Import organization

Biome automatically organizes imports.

The repository relies on automatic import ordering rather than manual sorting. Safe import organization is part of the Biome toolchain.

## Common commands

Check the repository.

```bash
bun run check
```

Apply formatting and lint fixes.

```bash
bun run lint
```

Format files.

```bash
bun run format
```

Run Biome directly.

```bash
biome check .
```

Apply safe fixes.

```bash
biome check --write .
```

Run formatter only.

```bash
biome format --write .
```

Run linter only.

```bash
biome lint .
```

Run CI validation.

```bash
biome ci .
```

The `ci` command runs formatter, linter, and import organization in read-only mode, making it suitable for continuous integration.

## Key prompts

### Formatting

- "Format this TypeScript file using repository conventions."
- "Explain why Biome reformatted this code."
- "Review this file for formatting issues."
- "Apply safe formatting fixes."

### Linting

- "Explain this Biome diagnostic."
- "Fix Biome lint errors."
- "Recommend improvements following repository conventions."
- "Review this pull request for Biome issues."

### Imports

- "Organize imports."
- "Explain Biome import ordering."
- "Remove unused imports."
- "Review import organization."

### Configuration

- "Explain this biome.json configuration."
- "Generate a repository-compatible Biome configuration."
- "Review formatter settings."
- "Review lint rules."

## Examples

Check the repository.

```bash
bun run check
```

Automatically apply formatting.

```bash
bun run lint
```

Format the repository.

```bash
bun run format
```

Run Biome directly.

```bash
biome check --write .
```

## Tips

- Run Biome from the repository root.
- Let Biome format code automatically instead of formatting manually.
- Prefer automatic import organization.
- Review diagnostics before suppressing rules.
- Keep formatting configuration centralized.
- Use repository scripts instead of invoking Biome manually whenever possible.

## Common issues

- Manually formatting code against repository conventions.
- Reordering imports manually.
- Disabling lint rules without justification.
- Running Biome outside the repository root.
- Ignoring formatting changes before committing.

## Best practices

- Keep formatting fully automated.
- Keep the repository on a single shared Biome configuration.
- Use repository scripts for formatting and linting.
- Let Biome organize imports automatically.
- Resolve diagnostics rather than suppressing them.
- Keep formatting changes separate from functional changes whenever practical.
