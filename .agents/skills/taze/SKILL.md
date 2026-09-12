---
name: taze
description: "Repository guidance for using Taze to inspect and update dependencies safely across the Bun and Turborepo monorepo."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# Taze

Taze is the repository's dependency freshness tool. It checks dependency
manifests recursively, respects declared version ranges, and can update
workspace manifests without replacing the repository's Bun package-manager
workflow.

## Supported tasks

- Check outdated dependencies across every workspace
- Update dependencies within their declared version ranges
- Review major, minor, and patch update candidates
- Exclude packages or version ranges from an update
- Update dependency manifests recursively in the monorepo
- Produce machine-readable update results for automation
- Review GitHub Actions version updates
- Keep dependency catalogs aligned across workspaces
- Run Bun installation after manifest updates
- Troubleshoot Taze output and update failures

## Repository integration

The root `package.json` provides the repository scripts:

```json
{
  "scripts": {
    "deps:check": "bunx taze -r --exclude typescript@7",
    "deps:update": "bunx taze -r -w --exclude typescript@7 && bun install"
  }
}
```

Run these commands from the repository root. The `-r` flag enables recursive
monorepo discovery, and `--exclude typescript@7` keeps the repository on the
TypeScript 6 line until that policy changes.

## Common commands

Inspect available updates without changing files.

```bash
bun run deps:check
```

Update dependencies within the ranges declared in `package.json`.

```bash
bun run deps:update
```

Inspect minor updates without writing them.

```bash
bunx taze -r minor --exclude typescript@7
```

Inspect patch updates without writing them.

```bash
bunx taze -r patch --exclude typescript@7
```

Review all update candidates, including dependencies with no available update.

```bash
bunx taze -r --all --json --exclude typescript@7
```

## Update policy

Taze's default mode is range-safe: it proposes the newest stable version that
fits the range already declared in each manifest. Use explicit modes when a
broader update is intentional:

- default mode for routine dependency maintenance
- `patch` for low-risk bug-fix updates
- `minor` for compatible feature updates
- `major` only after reviewing breaking changes and migration notes

Use `-w` only after reviewing the proposed changes. The repository's update
script follows the write with `bun install` so `bun.lock` remains synchronized.

Do not manually edit generated lockfile entries to force a version. Change the
manifest or catalog input, then run the repository update workflow.

## Excluding dependencies

Exclude a package completely:

```bash
bunx taze -r --exclude package-name
```

Exclude only a version range while allowing other versions:

```bash
bunx taze -r --exclude typescript@7
```

Keep exclusions consistent with repository compatibility policy. An exclusion
should explain why the package cannot move yet, such as a compiler-version
constraint or an uncompleted migration.

## Machine-readable output

Use JSON output for audits, CI reporting, or agent workflows:

```bash
bunx taze -r --json --exclude typescript@7
```

JSON mode writes update information to stdout and does not modify manifests
unless combined with `-w`. Keep generated reports outside tracked source files
unless the repository explicitly requires a committed report.

## GitHub Actions and runtime versions

Taze also inspects versioned GitHub Actions in `.github/workflows` and can
update supported Node.js version pins such as `.nvmrc`, `.node-version`, and
`devEngines.runtime`. Review these changes separately from npm dependency
updates.

Disable workflow updates for a dependency-only review:

```bash
bunx taze -r --no-github-actions --exclude typescript@7
```

Use `--github-actions-style sha` only when the repository's workflow policy
requires immutable action references. Preserve existing tag or SHA style
otherwise.

## Safe maintenance workflow

1. Check the working tree before starting.
2. Run `bun run deps:check` from the repository root.
3. Review package, catalog, and GitHub Actions candidates.
4. Read release notes for minor and major updates.
5. Run `bun run deps:update` only for approved changes.
6. Inspect the resulting `package.json` and `bun.lock` diff.
7. Run `bun run typecheck`, `bun run test`, and the relevant validation tasks.
8. Run `bun run check` before committing dependency changes.

Avoid combining a broad dependency upgrade with unrelated feature work. Keep
the update set reviewable and preserve the repository's catalog conventions.

## Troubleshooting

If an update is not shown:

- confirm the dependency is declared with an updateable range rather than an
  exact locked version
- check whether it is excluded by `--exclude`
- check the package's `engines` constraints
- run with `--json` to inspect the resolved metadata
- verify the package is in a workspace manifest discovered by recursive mode

If installation fails after an update, do not delete the lockfile. Revert only
the dependency manifest changes under review, investigate the first failing
package, and rerun `bun install` after correcting the range or exclusion.

## References

- [Taze repository](https://github.com/antfu-collective/taze)
- [Bun workspaces](https://bun.sh/docs/pm/workspaces)
- [Bun lockfile](https://bun.sh/docs/pm/lockfile)
