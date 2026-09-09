# Package Architecture

This document defines the public package boundaries for the HR Skills monorepo. It is the canonical implementation guide for package imports; exploratory research notes belong in `docs/archive/` and are not part of the project timeline.

## Package surfaces

| Surface | Intended consumers | Allowed responsibilities |
|---|---|---|
| `hr-skills-build/client` | Browser bundles, React Client Components, edge-safe consumers | Pure planner, runtime, search, parser, schema, constants, types, and documentation types. It must not import filesystem, process-derived paths, Node built-ins, or `server-only`. |
| `hr-skills-build/server` | Next.js Server Components, route handlers, scripts, Bun/Node services | Registry, filesystem-backed documentation loading, evaluation fixtures, validation, build tooling, and the server-compatible planner/runtime/search APIs. |
| `hr-skills-build` | Server-compatible backward-compatible root surface | Alias for the server surface. New application code must prefer the explicit `/server` subpath. |
| `hr-skills-ref/client` | Browser bundles and Client Components | Parsing, schemas, models, constants, and pure transformations only. |
| `hr-skills-ref/server` | Server-side skill loading and validation | Filesystem-backed loaders, prompts, validators, and the server-compatible root APIs. |
| `hr-skills-ref` | Server-compatible backward-compatible root surface | Alias for the server surface. New application code must prefer `/server`. |
| `hr-skills` | CLI executable and local scripts | Process entrypoints, filesystem writes, argument parsing, and command orchestration. It is never a browser dependency. |
| `hr-skills-tsdoc` | Documentation generation tooling | Build-time TSDoc extraction. It is not a browser or application-runtime dependency. |

## Import rules

Client code must import only from an explicit `/client` entrypoint. This includes type-only imports in Client Components: a type imported from a server-compatible root is still an architectural violation because it makes the intended dependency unclear and can become a runtime import during refactoring.

Server application code must import from an explicit `/server` entrypoint. The package root remains available for compatibility, but it is not the preferred import for new code. CLI and build tooling may use server surfaces because they execute in Bun/Node.

The source graphs are intentionally independent: a server module must not
import from or re-export a client module, and a client module must not import
from or re-export a server module. If both surfaces need the same behavior,
maintain a surface-local implementation or type definition. This keeps future
changes from accidentally pulling server code into a client bundle.

## Validation requirements

Every package with client/server surfaces must keep its entrypoints explicit in `package.json` and its build configuration. Client bundles should be scanned for `node:fs`, `node:path`, `node:child_process`, `server-only`, and process-derived repository path logic. App code should use the following patterns:

```ts
import { searchSkills } from 'hr-skills-build/client';
import type { DocumentationData } from 'hr-skills-build/client';
```

```ts
import { buildRegistry, buildDocumentationData } from 'hr-skills-build/server';
```

The generated API reference is maintained by `hr-skills-tsdoc`. When public surfaces change, run `bun run api-docs` and verify with `bun run api-docs:check`.

The versioned service contract is documented in
[`platform-integration.md`](platform-integration.md). It defines the future
HTTP adapter boundary without adding hosted routes to the library package.

## Relationship to the roadmap

Client/server boundary hardening is a completion constraint for the package architecture and Phase 7 web platform. Phase 8.1 now provides versioned-library service functions for registry search, planning, workflow execution, evaluation, health, and version responses. Hosted HTTP contracts, authentication, rate limiting, observability, and deployment remain in the later Phase 8 work.
