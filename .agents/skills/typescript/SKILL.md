---
name: typescript
description: "Repository guidance for writing, reviewing, and maintaining TypeScript code within the hr-skills monorepo. Covers project conventions, compiler settings, module structure, and development workflows."
metadata:
  author: Tuan Duc Tran
  version: "1.1.0"
---

# TypeScript

This skill describes how TypeScript is used throughout the **hr-skills** monorepo. It covers repository conventions, compiler configuration, module organization, type safety, and development workflows.

The repository uses modern TypeScript with strict compiler settings, ECMAScript modules, and Bun as the runtime.

## Supported tasks

- Explain TypeScript conventions used by this repository
- Review TypeScript code for correctness and maintainability
- Improve type safety without changing runtime behavior
- Recommend repository-consistent TypeScript patterns
- Organize modules and exports
- Review public APIs
- Validate compiler configuration
- Explain workspace TypeScript structure
- Troubleshoot common TypeScript errors

## Repository conventions

This repository follows several core principles.

- Prefer strict type safety.
- Prefer explicit public APIs.
- Keep modules focused on a single responsibility.
- Use ECMAScript modules exclusively.
- Prefer native language features over unnecessary abstractions.
- Avoid runtime dependencies when the type system is sufficient.

## Compiler configuration

The repository enables modern TypeScript features including:

- `strict`
- `moduleResolution: bundler`
- `module: Preserve`
- `target: ESNext`
- `noEmit`
- `isolatedModules`
- `verbatimModuleSyntax`
- `exactOptionalPropertyTypes`
- `noUncheckedIndexedAccess`
- `noImplicitReturns`
- `noImplicitOverride`
- `useUnknownInCatchVariables`

These settings prioritize correctness, maintainability, and predictable builds.

## Project structure

Workspace packages typically organize source code as:

```text
src/
test/
tsconfig.json
```

Packages may extend the shared repository configuration while adding package-specific files such as build configuration.

## Code organization

Prefer small, focused modules.

- One responsibility per file.
- Export only public APIs.
- Keep helper functions private unless reused.
- Avoid circular dependencies.
- Group related types with their implementation.

## Type design

Prefer expressive types over assertions.

Recommended patterns include:

- discriminated unions
- generic functions
- utility types
- readonly objects
- literal types
- `as const` where appropriate

Avoid:

- unnecessary `any`
- excessive type assertions
- duplicated type definitions
- overly complex conditional types

## Imports and exports

- Prefer named exports.
- Keep imports grouped and organized.
- Import only what is required.
- Use relative imports within a package.
- Use `workspace:*` dependencies for internal packages.

## Common commands

Run TypeScript type checking.

```bash
bun run typecheck
```

Run all repository tests.

```bash
bun run test
```

Build every workspace package.

```bash
bun run build
```

## Key prompts

### Type safety

- "Review this TypeScript code for type safety."
- "Explain this compiler error."
- "Reduce unnecessary type assertions."
- "Improve the inferred types."

### Repository conventions

- "Rewrite this file following repository conventions."
- "Review the module organization."
- "Recommend a cleaner public API."
- "Validate this package structure."

### Refactoring

- "Simplify this TypeScript implementation."
- "Extract reusable utilities."
- "Remove duplicated types."
- "Improve module boundaries."

### Development

- "Explain this tsconfig option."
- "Generate a repository-compatible tsconfig."
- "Recommend TypeScript best practices for this package."
- "Review this pull request for TypeScript issues."

## Examples

Run repository type checking.

```bash
bun run typecheck
```

Package configuration.

```json
{
  "extends": "../../tsconfig.json",
  "include": ["src", "test"]
}
```

Package with additional build configuration.

```json
{
  "extends": "../../tsconfig.json",
  "include": [
    "src",
    "test",
    "tsdown.config.ts"
  ]
}
```

## Tips

- Prefer inference when it improves readability.
- Add explicit types to exported APIs.
- Keep implementations simpler than their type definitions.
- Use `unknown` instead of `any` whenever possible.
- Validate changes with `bun run typecheck`.
- Keep package-specific configuration minimal.

## Common issues

- Exporting implementation details unnecessarily.
- Using `any` where stronger types are possible.
- Duplicating types across packages.
- Mixing runtime logic with type definitions.
- Ignoring compiler diagnostics.
- Creating modules with multiple unrelated responsibilities.

## Best practices

- Keep public APIs stable.
- Prefer composition over inheritance.
- Write reusable utility types only when they improve clarity.
- Use strict compiler settings consistently.
- Review exported types as carefully as runtime code.
- Keep TypeScript code easy to understand before optimizing for brevity.
