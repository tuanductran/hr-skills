# hr-skills CLI packaging notes

## Reference model

The `vercel-labs/skills` package declares executable names through the `bin` field in `package.json`, mapping `skills` and `add-skill` to `./bin/cli.mjs`. Its published files include `dist`, `bin`, and documentation, and its package uses a `prepublishOnly` build hook. Source: [vercel-labs/skills package.json](https://raw.githubusercontent.com/vercel-labs/skills/main/package.json).

The Vercel CLI is invoked as `npx skills ...`; its README documents command-specific subcommands such as `use`, `list`, `find`, `remove`, `update`, and `init`. Source: [vercel-labs/skills README](https://raw.githubusercontent.com/vercel-labs/skills/main/README.md).

Bun's official documentation states that `bunx` runs npm package executables declared through `package.json`'s `bin` field, and that `bunx --bun <package>` forces Bun to execute a binary with a Bun shebang. Source: [Bun bunx documentation](https://bun.com/docs/pm/bunx).

## Repository decision

`hr-skills` declares one public binary, `hr-skills`, mapped to `./dist/bin/hr-skills.mjs`. The dispatcher delegates to the built HR-specific subcommands while keeping `hr-skills-build` as the importable library and build-tooling package. The package is intended to support `npx hr-skills --help`, `bunx hr-skills --help`, and `bunx --bun hr-skills ...`.
