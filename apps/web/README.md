# hr-skills-web

Web documentation and product surfaces for [HR Skills](../../README.md) — a
searchable skill catalog, a deterministic planner playground, and read-only
views of the registry graph, runtime trace, evaluation dashboard, and pending
changesets. Built on Next.js (App Router) with server-rendered pages backed
directly by `hr-skills-build/server` and `hr-skills-build/client`.

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page — practice-area shortcuts and featured skills |
| `/skills` | Full skill catalog with search, domain, tier, and sort filters |
| `/skills/[skillId]` | Skill guide, prompts, examples, and related skills |
| `/planner` | Turn a natural-language HR intent into an explainable skill plan |
| `/graph` | Explore registry relationships between skills |
| `/runtime` | Replay a deterministic workflow trace from the canonical runtime |
| `/evaluation` | Planner quality metrics against the committed golden dataset |
| `/changelog` | Pending Changesets rendered from repository release metadata |

## Setup

From the repo root, build the workspace's TypeScript packages once so
`hr-skills-build` resolves:

```sh
bun install
bun run build
```

Then, from this directory:

```sh
bun run dev     # starts Next.js on http://localhost:3000
```

## Testing

Unit/type checks run from the repo root (`bun run typecheck`, `bun run test`
via Turborepo). End-to-end tests use Playwright and run from this directory:

```sh
bunx playwright install --with-deps chromium   # first time only
bun run test:e2e
```

## Notes

- All documentation data (`getDocumentationData`, `getRegistry`, and related
  helpers in `app/lib/docs.ts`) is loaded server-side from the committed
  registry and skill Markdown — there is no database or external API.
- Markdown content (skill guides, prompts, examples) is parsed with `marked`
  and allowlist-sanitized with `sanitize-html` before rendering
  (`app/components/markdown-content.tsx`).
- See [`docs/engineering/package-architecture.md`](../../docs/engineering/package-architecture.md)
  for the `hr-skills-build/client` vs `/server` import boundary this app
  must respect.
