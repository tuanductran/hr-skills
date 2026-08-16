---
paths:
  - apps/**/*.ts
  - apps/**/*.tsx
  - packages/**/*.ts
  - packages/**/*.tsx
  - playground/**/*.ts
  - playground/**/*.tsx
  - docs/engineering/package-architecture.md
  - AGENTS.md
  - .agents/**/*.md
---

# Package architecture rules

Use explicit package surfaces for every application import. Browser bundles and Client Components must import from `hr-skills-build/client` or `hr-skills-ref/client`, including type-only imports. They must not import a package root, `/server` surface, filesystem module, Node built-in, `server-only`, or process-derived repository path.

Next.js Server Components, route handlers, build scripts, validation tooling, and CLI code must import from `hr-skills-build/server` or `hr-skills-ref/server`. The package root remains a backward-compatible server alias, but new code must prefer the explicit `/server` subpath.

Keep the dependency direction one-way: server code may compose client-safe modules, but client code must never reach server modules. When a public surface changes, run the package build and `bun run api-docs:check`; scan client artifacts for Node-only imports before committing.

The canonical architecture reference is [`docs/engineering/package-architecture.md`](../../docs/engineering/package-architecture.md). Do not duplicate exploratory research notes in this rule.
