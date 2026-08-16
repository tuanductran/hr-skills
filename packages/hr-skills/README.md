# hr-skills

`hr-skills` is the command-line interface for the HR Skills registry. It is published as an npm executable so it can be run without a global installation, in the same style as `npx skills`.

## Run without installing

```bash
npx hr-skills --help
bunx hr-skills --help
bunx --bun hr-skills find "recruiting"
```

The package declares the `hr-skills` binary in `package.json` and builds it to `dist/bin/hr-skills.mjs`. The dispatcher supports command-specific help and delegates to the built command modules.

## Commands

```bash
hr-skills find "recruiting"             # Search the local HR Skills registry
hr-skills discover "recruiting"         # Explicit discovery command
hr-skills list                           # List all indexed HR skills
hr-skills init hr-interviewing           # Create a validated SKILL.md template
hr-skills recommend hr-recruiting
hr-skills plan "create a structured interview plan"
hr-skills execute "create a structured interview plan"
hr-skills evaluate
hr-skills skill-review hr-recruiting
hr-skills registry
hr-skills signals
```

The `find`, `list`, and `init` workflows follow the useful command separation established by [vercel-labs/skills](https://github.com/vercel-labs/skills): searching, inspecting indexed skills, and scaffolding a new skill are distinct actions. They are adapted to this repository's local HR registry and validation rules rather than copying Vercel's agent-installation behavior.

For repository development, the same commands remain available through the workspace scripts. The importable library surface remains `hr-skills-build`; the executable package is intentionally separate.
