---
paths:
  - packages/hr-skills-build/eval/datasets/**/*.json
  - packages/hr-skills-build/eval/golden/**/*.json
  - packages/*/test/**/*.test.ts
---

# Evals and testing rules

Use these conventions when working with the evaluation suite and test files.

## Test scope rule

Keep `packages/*/test/` focused on TypeScript behavior.

- prefer tests that exercise `packages/hr-skills-build/src/` and `packages/hr-skills-ref/src/` — parsing helpers, validation logic, registry generation, planner/runtime logic
- do not add test files whose only purpose is to lock Markdown wording, README text, or skill metadata phrasing
- prefer eval datasets for validating skill content quality; add a thin TypeScript test only when the content directly supports executable behavior
- if a check does not need TypeScript execution to prove value, it should become an eval dataset entry, not a standalone test file

## Eval directory structure

The evaluation datasets live under `packages/hr-skills-build/eval/`:

- `eval/datasets/` — hand-authored planning scenario datasets (JSON)
- `eval/golden/` — committed golden fixtures regenerated with `bun run evaluate -- --update-golden`

Never hand-edit golden fixtures directly — regenerate them.

## Running evals

```bash
bun run evaluate                         # run all evals against current golden fixtures
bun run evaluate -- --update-golden      # regenerate golden fixtures after intentional changes
```

## Adding eval datasets

When adding a new eval dataset:

1. Place the JSON file in `packages/hr-skills-build/eval/datasets/`
2. Follow the existing dataset schema — check `docs/engineering/evaluation.md` for the format specification
3. Run `bun run evaluate` to validate the new cases pass
4. Commit the updated golden fixtures if you ran `--update-golden`

## Running package tests

```bash
bun run test           # run tests across all workspace packages via Turborepo
bun test <file>        # run a single test file directly (fast iteration)
```

## Validation errors

Common issues when editing eval dataset JSON:

| Error | Fix |
|---|---|
| JSON syntax error | Check for missing commas, unclosed braces, or trailing commas |
| Golden mismatch | Run `bun run evaluate -- --update-golden` if the change was intentional |
| Missing required field | Consult `docs/engineering/evaluation.md` for the dataset schema |

## After editing

```bash
bun run evaluate    # validate evals
bun run test        # run package unit tests
bun run typecheck   # ensure no TypeScript errors introduced
```
