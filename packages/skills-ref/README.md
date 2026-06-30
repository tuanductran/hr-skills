# skills-ref

Reference library for Agent Skills — validate, read, and generate prompts from `SKILL.md` files.

## Installation

```bash
bun install
bun run build
```

## Package outputs

The package builds a library entry point from `src/index.ts` to `dist/index.mjs` with TypeScript declarations at `dist/index.d.ts`.

The published package contents are limited to `dist/`. The package doesn't expose a command-line interface.

## Scripts

| Command | Purpose |
|---------|---------|
| `bun run build` | Bundle the library with `tsdown` using `tsdown.config.ts` |
| `bun run dev` | Watch `src/index.ts` during local development |
| `bun run test` | Run Bun tests for the package |
| `bun run typecheck` | Type-check the package without emitting files |

## Programmatic API

```typescript
import { readProperties, toPrompt, validate } from "skills-ref";

// Validate a skill directory
const errors = validate("skills/hr-recruiting");
if (errors.length === 0) console.log("Valid!");

// Read properties
const props = readProperties("skills/hr-recruiting");
console.log(props.name, props.description);

// Generate prompt XML
const xml = toPrompt(["skills/hr-recruiting", "skills/hr-analytics"]);
console.log(xml);
```

## API output examples

### `readProperties`

```json
{
  "name": "hr-recruiting",
  "description": "Help HR managers with end-to-end recruiting...",
  "metadata": {
    "author": "Tuan Duc Tran",
    "version": "1.0.0"
  }
}
```

### `toPrompt`

```xml
<available_skills>
<skill>
<name>hr-recruiting</name>
<description>Help HR managers with end-to-end recruiting...</description>
<location>/path/to/skills/hr-recruiting/SKILL.md</location>
</skill>
</available_skills>
```
