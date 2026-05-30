---
name: typescript
description: "TypeScript code style and optimization guidelines for HR engineering repos. Use when writing TypeScript files, reviewing candidate code, proposing refactors, or advising on safe migrations. Triggers on 'type safety', 'refactor to TypeScript', 'optimize build', and similar HR engineering prompts."
metadata:
  author: "Tuan Duc Tran"
  version: "1.0.0"
---

# TypeScript code style and optimization

## Supported tasks

- Review TypeScript code samples for type safety and feedback
- Suggest refactors to improve type inference and reduce `any`
- Create migration guidance from JavaScript to TypeScript
- Propose performance-oriented code changes and concurrency fixes
- Produce interview coding evaluation rubrics for TypeScript tasks
- Recommend build/tooling changes to speed CI and bundling
- Create concise code examples for common patterns (generics, utility types)
- Advise on safe use of `@ts-expect-error`, `as const`, and assertion patterns

## Key prompts

### Type and API design

- "Review this function and suggest stricter types and null-safety: [code]."
- "Refactor this union type into clearer discriminated unions for `domain`: [types]."
- "Suggest a `Record` or mapped type approach for this dynamic key pattern: [example]."
- "Explain trade-offs between `interface` and `type` for this props object: [props]."

### Performance and async patterns

- "Identify blocking or sync operations in this code and suggest async-safe alternatives: [code]."
- "Suggest concurrency improvements using `Promise.allSettled` or worker threads where appropriate."
- "Recommend bundler or tree-shaking optimizations for a library targeting ESM."
- "Point out hot paths and suggest micro-optimizations while keeping readability."

### Migration and reviews

- "Create a step-by-step migration plan from JS to TS for this package with minimal disruption."
- "Draft an interview task that evaluates candidate ability to use advanced TypeScript features."
- "Generate a concise code review checklist for TypeScript PRs focused on types, tests, and ergonomics."
- "Summarize common type errors candidates encounter and how to explain fixes during interviews."

## Tips

- Prefer inference where safe; add explicit types at boundaries (exports, public APIs)
- Keep examples small and focused when evaluating candidates or writing docs
- Use `tsc --noEmit` and `bun run typecheck` in CI to catch type regressions early
- Avoid introducing large runtime libraries for tiny utilities; prefer native APIs
