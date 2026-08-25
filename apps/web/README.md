# HR Skills web

This app replaces the former `apps/web` implementation. It keeps the catalog, production-map, and skill-detail information architecture of `caezium/skills/site`, but is implemented in React with TanStack Router and TanStack Query.

The browser never scans skill files directly. `bun run generate:data` invokes `buildDocumentationData()` from the internal `hr-skills-build/server` package, which reads the canonical `skills/hr-*` tree and writes a browser-safe snapshot to `public/data/hr-skills.json`.

Run from the repository root:

```bash
bun install
bun run build
bun --cwd apps/web run dev
```
