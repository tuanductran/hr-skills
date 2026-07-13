---
name: valibot
description: >
  Repository guidance for using Valibot as the schema validation library within
  the hr-skills monorepo. Use when writing or modifying schemas in
  packages/skills-ref/src/schema.ts or packages/hr-skills-build/src/schema.ts,
  when validating parsed YAML frontmatter, when handling safeParse results, or
  when inferring types from schemas.
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# Valibot in hr-skills

This skill covers how Valibot is used within the hr-skills monorepo specifically.
It is not a general Valibot reference — see [valibot.dev](https://valibot.dev) for
the full API. The focus here is on the patterns, conventions, and pitfalls that
appear in this codebase.

## Where Valibot is used

Two files define schemas; all other packages consume them:

- `packages/skills-ref/src/schema.ts` — `SkillPropertiesSchema`, the generic
  Agent Skills shape used by `readProperties()` in `loader.ts`
- `packages/hr-skills-build/src/schema.ts` — `MarketplaceJsonSchema` (validates
  `.claude-plugin/marketplace.json`) and `SkillFrontmatterSchema` (used by
  `parseSkillFrontmatter()` in `parser.ts`)

Import pattern used throughout the repo:

```typescript
import * as v from 'valibot';
```

Never use named imports (`import { object, string } from 'valibot'`) — the
wildcard `* as v` is the established convention here.

## Supported tasks

- Write or extend a schema in `schema.ts` for a new frontmatter field
- Add a `v.pipe(v.string(), v.trim())` field to an existing object schema
- Handle a `v.safeParse()` result correctly in `parser.ts` or `loader.ts`
- Infer the output type from a schema with `v.InferOutput<typeof Schema>`
- Add an optional field to `SkillPropertiesSchema` or `SkillFrontmatterSchema`
- Validate marketplace.json shape against `MarketplaceJsonSchema` in sync.ts
- Add a `v.record()` field for arbitrary string metadata
- Debug a failed `v.safeParse()` result using `v.summarize(result.issues)`
- Make a field optional without breaking the existing type contract
- Understand why `v.safeParse` is used instead of `v.parse` in this repo

## Key prompts

### Schema authoring

1. "Add an optional [field] field to SkillPropertiesSchema that accepts a trimmed string."
2. "Write the Valibot schema for a new marketplace plugin entry with fields [list]."
3. "I need to validate a [shape] object in hr-skills-build. Write the schema."
4. "Add a required string field [name] to SkillFrontmatterSchema with trim applied."

### Parsing and results

1. "Show me how parseSkillFrontmatter handles a v.safeParse failure in this repo."
2. "When should I use v.safeParse vs v.parse in hr-skills-build?"
3. "How does loader.ts throw a ValidationError from a failed v.safeParse result?"
4. "Show me the correct way to check result.success and access result.output."

### Type inference

1. "How do I infer the output type from SkillPropertiesSchema?"
2. "What is the difference between v.InferOutput and v.InferInput in this repo?"
3. "How do I export both the schema and its type from schema.ts following repo conventions?"
4. "Show me how SkillFrontmatter is inferred and used in parser.ts."

### Optional and record fields

1. "How is v.optional used in this repo for nullable frontmatter fields?"
2. "Show me how v.record is used for the metadata field in SkillPropertiesSchema."
3. "Add an optional field to SkillFrontmatterSchema that defaults to undefined."
4. "How does toStringRecord convert unknown metadata values before passing to v.safeParse?"

### Valibot vs Zod — critical differences

1. "I accidentally wrote Zod-style chaining. Show me the correct Valibot equivalent."
2. "How do I use v.pipe with v.trim and v.minLength like the existing schemas do?"
3. "What is the Valibot equivalent of Zod's z.string().optional()?"
4. "Show me how v.summarize works on result.issues for error reporting."

## Tips

- Always use `v.safeParse` in this repo, not `v.parse` — `parser.ts` returns an
  empty object on failure, and `loader.ts` throws a typed `ValidationError` using
  `v.summarize(result.issues)`. Throwing directly from `v.parse` bypasses that
  error handling pattern.
- Apply `v.pipe(v.string(), v.trim())` to every string field that comes from
  user-authored YAML — frontmatter values frequently have trailing whitespace or
  newlines that would silently fail downstream string comparisons.
- Use `v.optional()` wrapping, not chained methods — `v.optional(v.string())`
  not `v.string().optional()`. Valibot does not chain; it composes.
- Infer types with `v.InferOutput<typeof Schema>` and export the type alongside
  the schema in the same file. See how `SkillProperties` and `SkillFrontmatter`
  are exported in their respective `schema.ts` files as the pattern to follow.
- Never add a new schema file — both packages already have one `schema.ts` each.
  Add fields to the existing schemas unless there is a genuinely separate data
  shape that doesn't belong in either existing file.
- When a `v.safeParse` result fails, log `v.summarize(result.issues)` for a
  human-readable summary — that is what `ValidationError` in `loader.ts` uses
  and what `@clack/prompts` surfaces to the terminal.

## Common mistakes

- Using Zod-style chaining such as `v.string().trim().email()` — Valibot has no
  method chaining. Use `v.pipe(v.string(), v.trim(), v.email())` instead.
- Calling `v.parse(Schema, data)` instead of `v.safeParse` — this throws a raw
  `ValiError` that bypasses the typed error hierarchy in `errors.ts`. Use
  `v.safeParse` and handle `result.success` explicitly.
- Forgetting `v.trim()` in the pipeline for string fields parsed from YAML —
  without it, fields with trailing newlines or spaces will pass validation but
  cause subtle mismatch bugs in downstream string comparisons like author name
  normalization.
- Adding `v.InferInput` instead of `v.InferOutput` when the schema has no
  transforms — in this repo all schemas use `v.trim()` which counts as a
  transform, so input and output types differ slightly. Prefer `InferOutput`.
