# Web API integration research notes

## Official Next.js sources

1. Server and Client Components: <https://nextjs.org/docs/app/getting-started/server-and-client-components>
   - App Router pages/layouts are Server Components by default.
   - Use Client Components for state, event handlers, lifecycle logic, browser APIs and custom hooks.
   - Server Components are appropriate for filesystem/API/database access and keep secrets/server logic out of client bundles.
   - A `use client` boundary includes its imports in the client module graph; keep interactive boundaries narrow.
   - Props passed from Server Components to Client Components must be serializable.

2. Fetching data: <https://nextjs.org/docs/app/getting-started/fetching-data>
   - Server Components can perform asynchronous I/O directly.
   - Client Components can receive serializable data from server components or use React `use`/community libraries for client fetching.
   - Use Suspense/loading states around slow server data when appropriate.

3. Font optimization: <https://nextjs.org/docs/app/getting-started/fonts>
   - `next/font` self-hosts and optimizes fonts and removes browser requests to Google.
   - Import `Inter` from `next/font/google`, configure it in the root layout, and apply the generated class/variable globally.

4. CSS: <https://nextjs.org/docs/app/getting-started/css>
   - Install Tailwind v4 with `tailwindcss` and `@tailwindcss/postcss`.
   - Configure `@tailwindcss/postcss` in PostCSS and import `tailwindcss` from global CSS.
   - Keep truly global CSS global; use Tailwind for component styling and CSS Modules for scoped exceptions.

## Package API findings

- `packages/hr-skills-build/src/index.ts` is the Node/server surface. It exports docs, registry, planner, runtime, search, shared and validation modules and transitively uses filesystem/Node APIs.
- `packages/hr-skills-build/src/index.client.ts` is the browser-safe surface. It exports planner, runtime, search and pure shared APIs only.
- `buildDocumentationData()` is the canonical server-side docs builder from registry + SKILL.md/Markdown sources.
- `buildRegistry()` is the canonical server-side registry builder.
- `searchSkills(query, registry)` is the canonical deterministic search API; it supports text/domain queries, fuzzy matching and ranked explanations.
- `getRecommendations(skillId, registry, limit)` is the canonical related-skill API.
- `generateExecutionPlan(intent, registry)` and `analyzeIntent(intent)` are pure client-safe planner APIs.

## Compatibility fixes discovered during implementation

- `hr-skills-ref` previously used `import.meta.dirname` for `ROOT_DIR`; Next's server bundle supplied undefined. It now derives the repository root from `process.cwd()` and the presence of `skills/`.
- `hr-skills-build` previously used `import.meta.dirname` in `shared/paths.ts`; it now derives evaluation paths from `ROOT_DIR`.
- `hr-skills-build` `readSkill()` previously called `Bun.file(...).text()`, which failed when Next collected server page data under Node. It now uses `node:fs/promises` `readFile`, preserving Bun compatibility and making the server API usable by Next.
