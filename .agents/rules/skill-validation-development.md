---
paths:
  - packages/hr-skills-build/src/**/*.ts
  - packages/skills-ref/src/**/*.ts
---

# Skill validation development rules

Use these conventions when writing or extending skill validation logic in
`packages/hr-skills-build/src/` and `packages/skills-ref/src/`.

## Module structure

Every validator or builder module follows this pattern:

```typescript
// Brief description of what this module validates or builds.

import * as v from "valibot";
import { type InferOutput } from "valibot";

// Schema definition
export const MySchema = v.object({
  field: v.string(),
});

export type MyType = InferOutput<typeof MySchema>;

// Main function
export function validate(input: unknown): MyType {
  return v.parse(MySchema, input);
}
```

**Rules:**

- use Valibot for schema definition and validation (see `.agents/skills/valibot/SKILL.md`)
- use `@clack/prompts` for CLI output in `packages/hr-skills/src/cli/*` (see `.agents/skills/clack/SKILL.md`)
- prefer shared helpers in `packages/skills-ref/src/` for skill reading and validation
- prefer shared helpers in `packages/hr-skills-build/src/shared/` for build utilities
- keep modules focused — one responsibility per file

## Validation patterns

Validators return typed results using Valibot's `safeParse`:

```typescript
const result = v.safeParse(SkillSchema, raw);
if (!result.success) {
  // handle validation errors
  for (const issue of result.issues) {
    // report issue
  }
}
const skill = result.output;
```

**Rules:**

- always use `safeParse` for user-facing validation (not `parse`) so errors can be reported cleanly
- use `parse` only in contexts where a throw is the correct failure mode
- return structured error information, not bare exceptions

## Error handling

Validators must handle malformed input gracefully:

- always return a typed result or throw with a clear message
- use `@clack/prompts` log helpers for user-facing error output in CLI entry points
- test edge cases: missing fields, wrong types, empty arrays, malformed YAML

## Testing

Write tests in `packages/*/test/**/*.test.ts`:

```typescript
import { expect, test } from "bun:test";

test("validate rejects missing required field", () => {
  const result = v.safeParse(SkillSchema, { title: "test" });
  expect(result.success).toBe(false);
});
```

Run tests:

```bash
bun run test           # all workspace packages
bun test <file>        # single file (fast iteration)
bun run typecheck      # type-check all packages
```

## After editing

```bash
bun run validate    # validate all skills against the updated schema
bun run test        # run package tests
bun run typecheck   # confirm no TypeScript errors
bun run check       # Biome lint + format
```
