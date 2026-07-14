# skills-ref

Reference library for Agent Skills — validate, read, and generate prompts from `SKILL.md` files.

> **Naming note:** `skills-ref` has no domain prefix intentionally. It is a **domain-agnostic**
> library that works with any repository following the [Agent Skills](https://agentskills.io/)
> open format — not just `tuanductran/hr-skills`. For HR-specific tooling that only works
> in this monorepo, see [`hr-skills-build`](../hr-skills-build).

## Installation

```bash
bun install
bun run build
```

## Scripts

| Command | Purpose |
|---------|---------|
| `bun run build` | Bundle the library with `tsdown` and emit `dist/` |
| `bun run dev` | Watch `src/index.ts` during local development |
| `bun run test` | Run Bun tests for the package |
| `bun run typecheck` | Type-check the package without emitting files |

## Programmatic API

```typescript
import { readProperties, toPrompt, validate } from 'skills-ref';

// Validate a skill directory
const errors = validate('skills/hr-recruiting');
if (errors.length === 0) console.log('Valid!');

// Read properties
const props = readProperties('skills/hr-recruiting');
console.log(props.name, props.description);

// Generate prompt XML
const xml = toPrompt(['skills/hr-recruiting', 'skills/hr-analytics']);
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

## Package outputs

The package builds an ESM library from `src/index.ts` using `tsdown` and emits
TypeScript declaration files alongside the compiled output. All published contents
are limited to `dist/`. No CLI is exposed.

## Source layout

| File | Purpose |
|------|---------|
| `src/constants.ts` | Shared regex patterns and delimiters |
| `src/errors.ts` | `SkillError` base class and `ValidationError`, `ParseError` subclasses |
| `src/helpers.ts` | `isPlainObject`, `toStringOrUndefined`, utility functions |
| `src/index.ts` | Public API exports |
| `src/loader.ts` | `readProperties()` — reads and validates frontmatter |
| `src/models.ts` | `SkillBlock` and related model types |
| `src/parser.ts` | YAML frontmatter parsing with CRLF normalization |
| `src/prompt.ts` | `toPrompt()` — generates `<available_skills>` XML |
| `src/schema.ts` | Valibot `SkillPropertiesSchema` and `SkillProperties` type |
| `src/validator.ts` | `validate()` — Agent Skills format conformance |

## Design principles

- **Zero HR coupling** — no HR-specific logic, prefixes, or assumptions anywhere in this package
- **CRLF safe** — frontmatter parser normalizes Windows line endings before parsing
- **Typed errors** — `ParseError` and `ValidationError` both extend `SkillError` for structured catch blocks
- **ESM only** — ships as `.mjs` with `.d.mts` declarations; no CJS output
