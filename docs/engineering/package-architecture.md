# Package Architecture

This document defines the public package boundaries for the HR Skills monorepo. It is the canonical implementation guide for package imports; exploratory research notes belong in `docs/archive/` and are not part of the project timeline.

## Package surfaces

| Surface | Intended consumers | Allowed responsibilities |
|---|---|---|
| `hr-skills-build/client` | Browser bundles, React Client Components, edge-safe consumers | Pure planner, runtime, search, parser, schema, constants, types, and documentation types. It must not import filesystem, process-derived paths, Node built-ins, or `server-only`. |
| `hr-skills-build/server` | Next.js Server Components, route handlers, scripts, Bun/Node services | Registry, filesystem-backed documentation loading, evaluation fixtures, validation, build tooling, and server-compatible planner/runtime/search APIs. |
| `hr-skills-build` | Server-compatible backward-compatible root surface | Alias for the server surface. New application code must prefer the explicit `/server` subpath. |
| `hr-skills-ref/client` | Browser bundles and Client Components | Parsing, schemas, models, constants, and pure transformations only. |
| `hr-skills-ref/server` | Server-side skill loading and validation | Filesystem-backed loaders, prompts, validators, and server-compatible root APIs. |
| `hr-skills-ref` | Server-compatible backward-compatible root surface | Alias for the server surface. New application code must prefer `/server`. |
| `hr-skills` | CLI executable and local scripts | Process entrypoints, filesystem writes, argument parsing, and command orchestration. It is never a browser dependency. |
| `hr-skills-tsdoc` | Documentation generation tooling | Build-time TSDoc extraction. It is not a browser or application-runtime dependency. |

## Import rules

Client code must import only from an explicit `/client` entrypoint. This includes type-only imports in Client Components: a type imported from a server-compatible root is still an architectural violation because it makes the intended dependency unclear and can become a runtime import during refactoring.

Server application code must import from an explicit `/server` entrypoint. The package root remains available for compatibility, but it is not the preferred import for new code. CLI and build tooling may use server surfaces because they execute in Bun/Node.

The source graphs must not cross at the public-surface level: a `/server` entrypoint must never import from or re-export a `/client` entrypoint, and vice versa. This keeps future changes from accidentally pulling server code into a client bundle. It does **not** mean maintaining two copies of the same logic — behavior shared by both surfaces (planner, runtime, search, parsers, schemas, and plain types with no Node dependency) lives once in `src/shared/` at the package root. `client/` and `server/` re-export it as needed (`export * from '../../shared/<module>.js'`), and each surface may still add its own additions on top (e.g. `server/shared/schema.ts` re-exports `shared/schema.ts` and adds build-tooling-only schemas that never need to reach the browser). `src/shared/` itself must stay free of Node built-ins — the validation step below checks this automatically.

Two packages went through this consolidation: `hr-skills-build` (`packages/hr-skills-build/src/shared/`) and `hr-skills-ref` (`packages/hr-skills-ref/src/shared/`). Before it, `client/` and `server/` carried 18 (`hr-skills-build`) and 4 (`hr-skills-ref`) byte-identical files — duplication that had already drifted into real bugs (a missing field on one surface's type, looser validation on the other's schema) with nothing to catch it. Prefer extending `src/shared/` over reintroducing a second copy.

## Validation requirements

Every package with client/server surfaces must keep its entrypoints explicit in `package.json` and its build configuration. The client bundle's full import graph — not just its entry file — is scanned automatically for `node:*` built-ins as part of `bun run build` (`verify-client-bundle`, wired in as a `build` postscript in `hr-skills-build` and `hr-skills-ref`); it fails the build if a `src/shared/` module (or anything it pulls in) picks up a stray Node import. A companion test (`test/shared/node-boundary.test.ts` in `hr-skills-build`, `test/shared-node-boundary.test.ts` in `hr-skills-ref`) checks the same constraint at the source level, so `bun test` catches a violation without needing a full build first.

```ts
import { searchSkills } from 'hr-skills-build/client';
import type { DocumentationData } from 'hr-skills-build/client';
```

```ts
import { buildRegistry, buildDocumentationData } from 'hr-skills-build/server';
```

The generated API reference is maintained by `hr-skills-tsdoc`. When public
surfaces change, run `bun run api-docs` and verify with `bun run api-docs:check`.

The versioned service contract is documented in
[`platform-integration.md`](platform-integration.md). It defines the future
HTTP adapter boundary without adding hosted routes to the library package.

## Relationship to the roadmap

Client/server boundary hardening is a completion constraint for the package
architecture. The current service-library work provides versioned-library
functions for registry search, planning, workflow execution, evaluation, health,
and version responses. The versioned HTTP contract, access policy, observability,
readiness, and deployment guidance remain documented separately; a hosted HTTP
adapter remains deployment-specific and is not included in these library
packages.
