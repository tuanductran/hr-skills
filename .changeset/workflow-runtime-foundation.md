---
"hr-skills-build": minor
---

Added Phase 4.3 workflow runtime that deterministically executes execution plans produced by the skill planner. This introduces a WorkflowExecutor with context propagation between steps, configurable retry policies, structured failure handling, execution events, and execution tracing, plus a new `bun run execute` CLI.
