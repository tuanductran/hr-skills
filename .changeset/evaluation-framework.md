---
"hr-skills-build": minor
---

Added Phase 4.4 evaluation framework — deterministic quality evaluation and regression detection for the Skill Planner and Workflow Runtime. Introduces evaluation datasets (`eval/datasets/`), committed golden fixtures (`eval/golden/`), a benchmark runner with quality metrics (capability matching accuracy, skill selection accuracy, execution ordering accuracy, dependency correctness, workflow success rate), field-level regression detection against golden fixtures, and a new `bun run evaluate` CLI (with `--update-golden`). See `docs/evaluation.md`.
