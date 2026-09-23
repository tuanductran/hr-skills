# hr-skills-api

Hosted HTTP adapter scaffold for [HR Skills](../../README.md) (Phase 8.4).
This app will eventually expose the deterministic service layer in
`hr-skills-build/server` — registry search, planning, runtime execution,
evaluation, health, and version information — over HTTP, following the
versioned contract documented in
[`docs/engineering/platform-integration.md`](../../docs/engineering/platform-integration.md).

## Status

This is the **initial scaffold only**. It proves the app boots on
Bun + [Elysia](https://elysiajs.com) and establishes the module layout for
later work. It does not yet implement:

- The `/api/v1/*` routes or response envelope
- Authentication or rate limiting
- Observability wiring described in
  [`docs/engineering/operations.md`](../../docs/engineering/operations.md)
- Deployment configuration

Those land in a follow-up Phase 8.4 change.

## Structure

| Path | Responsibility |
| --- | --- |
| `src/app.ts` | Constructs and returns the Elysia application. No side effects, no port binding — safe to import from tests. |
| `src/index.ts` | Starts the server by calling `createApp()` and binding a port. |

## Setup

From the repo root, install dependencies and build the workspace's
TypeScript packages once so `hr-skills-build` resolves:

```sh
bun install
bun run build
```

Then, from this directory:

```sh
bun run dev     # starts the API with --watch on http://localhost:3001
bun run start   # starts the API without --watch
```

Override the port with the `PORT` environment variable.

## Testing

Type checks run from the repo root (`bun run typecheck`) or from this
directory (`bun run typecheck`). `createApp()` is exported specifically so
future tests can exercise the app with Elysia's `.handle()` or Eden Treaty
without starting a real server.
