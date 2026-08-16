# hr-skills-tsdoc

TSDoc-compatible API documentation tooling for the HR Skills monorepo. The package extracts exported TypeScript declarations and documentation comments from `hr-skills`, `hr-skills-build`, and `hr-skills-ref`, then renders the shared reference to `docs/engineering/api.md`.

## Commands

```bash
# Generate the checked-in API reference
bun run api-docs

# Fail when the generated reference is stale
bun run api-docs:check

# Build the generator artifact
bun run build

# Type-check only this package
bun run typecheck
```

The generator follows the TSDoc model: exported declarations use `/**` comments, summaries are kept separate from `@remarks`, and tags such as `@param`, `@returns`, `@throws`, and `@internal` are interpreted consistently. The generated document has sections for CLI, server, and client surfaces, so API documentation is not limited to `hr-skills-build`.

The package is a workspace build tool and is intentionally private. It does not belong in runtime bundles and has no dependency on the domain packages it documents.
