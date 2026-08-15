# cli

Command-line entrypoints for the HR Skills workspace. The package owns the interactive workflows that discover, recommend, plan, execute, evaluate, and review skills, while `hr-skills-build` remains the library and repository build-tooling package.

## Commands

```bash
bun run find -- "recruiting"             # Search the local HR Skills registry
bun run discover -- "recruiting"         # Explicit discovery command
bun run list                              # List all indexed HR skills
bun run init -- hr-interviewing           # Create a validated SKILL.md template
bun run recommend -- hr-recruiting
bun run plan -- "create a structured interview plan"
bun run execute -- "create a structured interview plan"
bun run evaluate
bun run skill-review -- hr-recruiting
bun run registry
bun run signals
```

The `find`, `list`, and `init` commands follow the useful workflow separation established by [vercel-labs/skills](https://github.com/vercel-labs/skills): searching, inspecting indexed skills, and scaffolding a new skill are distinct actions. They are adapted to this repository's local HR registry and validation rules rather than copying Vercel's agent-installation behavior.

The commands are also available from the repository root through the matching scripts in the root `package.json`. They use the same `@clack/prompts` interaction model and `--help` handling, but are now isolated from the importable `hr-skills-build` library surface.
