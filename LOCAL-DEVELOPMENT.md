# Local development

`hr-skills` is a Bun workspace managed by Turborepo. The repository includes `apps/jd` as the Nuxt 4 JD Builder, `apps/web` as the existing web application, shared packages under `packages/*`, and framework playgrounds under `playground/*`.

## Requirements

Use the Bun version declared by the root `package.json` (`bun@1.3.14`) and Node.js 20.19 or newer for packages that declare that engine. From the repository root, install all workspace dependencies:

```bash
bun install
```

All third-party dependency versions are managed in the root `workspaces.catalogs` object and are referenced from package manifests as `catalog:<domain>`. Workspace packages intentionally continue to use `workspace:*`; they are not external dependencies and must not be copied into a version catalog.

## Run `apps/jd`

Create `apps/jd/.env` from the local template when available, then set the Neon and Better Auth variables. Never commit this file.

```bash
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="a-local-secret-at-least-32-characters"
BETTER_AUTH_URL="http://localhost:3101"
BETTER_AUTH_TRUSTED_ORIGINS="http://localhost:3101"
```

For optional Sentry monitoring, add `SENTRY_DSN` for server events and `NUXT_PUBLIC_SENTRY_DSN` for browser events. Source-map upload during production builds additionally requires `SENTRY_ORG`, `SENTRY_PROJECT` and `SENTRY_AUTH_TOKEN`. Without a Sentry DSN, the app remains operational with monitoring disabled.

Apply migrations to the intended local or Neon development branch, then start the app:

```bash
bun run --cwd apps/jd db:migrate
bun run --cwd apps/jd dev
```

The JD Builder is available at `http://localhost:3101`. To run the app using Turborepo instead:

```bash
bun run dev:jd
```

## Validation commands

Run the focused JD checks:

```bash
bun run test:jd:unit
bun run typecheck:jd
bun run build:jd
bun run test:jd:e2e
```

`test:jd:e2e` builds a production Nitro bundle before starting Playwright. It requires a working local/Neon database and auth environment because the E2E suite exercises signup, persistence, review and export flows.

Run the repository-wide checks when changing shared packages or workspace configuration:

```bash
bun run test
bun run typecheck
bun run build
```

Turborepo automatically discovers `apps/jd` because it is included by the root `apps/*` workspace glob and exposes `build`, `typecheck`, `test` and `test:e2e` scripts. The root `turbo.jsonc` supplies the dependency edge `hr-jd#build → hr-skills-jd#build/typecheck/test`, so the shared domain package is built first.

## Catalog policy

The root manifest uses named catalogs grouped by domain: `core`, `backend`, `web-nuxt`, `web-react`, `web-ui`, `testing`, `observability`, `documents`, `content`, `docs`, `build`, `tooling` and `release`. Add a new external dependency to the appropriate root catalog first, then reference it from a package manifest with `catalog:<domain>`. Do not add direct semver strings to a workspace manifest. Use `workspace:*` only for internal packages.

When changing catalogs, run:

```bash
bun install
bun run typecheck
bun run test
bun run build
```

If a package requires an exceptional version for framework compatibility, document the reason in the package manifest or an ADR before deviating from this policy.
