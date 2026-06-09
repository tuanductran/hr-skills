# Roadmap

This audit maps the repository against GitHub issue #50 and excludes Website Platform work by design.

## Scope and priority

Implementation priority follows the requested order:

1. Skill Architecture
2. Knowledge Base
3. Agent Ecosystem
4. Community

Website Platform items are intentionally out of scope for this execution pass.

## Gap analysis

| Roadmap area | Item | Current state | Gap | Action in this pass |
|--------------|------|---------------|-----|---------------------|
| Repository and Governance | CODEOWNERS | Complete | No gap. | Existing `.github/CODEOWNERS` retained. |
| Repository and Governance | Issue templates | Complete | No gap. | Existing bug, feature, and new-skill templates retained. |
| Repository and Governance | Pull request template | Complete | No gap. | Existing PR template retained. |
| Skill Architecture | Define HR taxonomy v1 | Partially complete | Skills existed, but taxonomy rules weren't documented. | Added `docs/taxonomy.md`. |
| Skill Architecture | Group skills by HR domain | Missing structured metadata | Skills didn't have a validated category field. | Added `metadata.category` across skills and validator support. |
| Skill Architecture | Group skills by recruiting workflow | Missing structured metadata | Recruiting workflow wasn't modeled. | Added `metadata.recruitingWorkflow` across skills and taxonomy docs. |
| Skill Architecture | Document taxonomy rules | Missing | No single taxonomy reference existed. | Added taxonomy rules, lifecycle statuses, and workflow definitions. |
| Skill Architecture | Structured skill metadata | Partially complete | Only author and version were required. | Added category, tags, status, and recruiting workflow. |
| Skill Architecture | Validate metadata during build | Partially complete | Validation didn't enforce structured roadmap fields. | Extended `skills-ref` and build validation. |
| Skill Architecture | Skill lifecycle statuses | Missing | No status field or catalog display. | Added `stable`, `beta`, and `experimental` validation and catalog rendering. |
| Knowledge Base | HR glossary | Missing | No shared glossary reference. | Added `docs/knowledge-base.md`. |
| Knowledge Base | Recruiting frameworks | Partially complete | Examples existed but no shared framework. | Added intake-to-offer workflow and metrics. |
| Knowledge Base | Interview frameworks | Partially complete | Interview content existed inside skills and examples only. | Added structured interview and technical interview frameworks. |
| Knowledge Base | Hiring scorecards | Partially complete | Example scorecards existed but no reusable template. | Added scorecard template. |
| Knowledge Base | Competency matrices | Missing | No shared competency matrix reference. | Added engineering and manager matrices. |
| Knowledge Base | Workflow examples | Partially complete | Many examples existed, but no shared workflow map. | Added knowledge-base workflow examples. |
| Agent Ecosystem | Claude export support | Complete for native skills | Claude skill directories existed. | Added explicit Claude target in export tooling. |
| Agent Ecosystem | OpenAI Codex export support | Missing | No Codex-specific export path. | Added `bun run export:agents` target for Codex `AGENTS.md`. |
| Agent Ecosystem | Cursor export support | Missing | No Cursor-specific export path. | Added Cursor `.mdc` export target. |
| Agent Ecosystem | Gemini export support | Missing | No Gemini-specific export path. | Added Gemini `GEMINI.md` export target. |
| Agent Ecosystem | Packaging improvements | Partially complete | Zip packaging existed. | Added multi-agent export packaging workflow. |
| Agent Ecosystem | Validation improvements | Partially complete | Validation didn't cover roadmap metadata. | Added metadata schema validation. |
| Agent Ecosystem | Compatibility tests | Missing | No tests for export targets. | Added agent export target tests. |
| Community | Contributor onboarding guide | Partially complete | Contributing docs existed, but no community workflow reference. | Added `docs/community.md`. |
| Community | Good first issues | Missing | No criteria documented. | Added good first issue criteria. |
| Community | Contribution workflow documentation | Partially complete | Existing docs covered general contribution. | Added workflow guidance tied to taxonomy and exports. |
| Community | Skill review workflow | Missing | No checklist focused on skill review. | Added review workflow. |
| Community | Sustainability documentation | Partially complete | Funding config existed. | Added sustainability practices. |

## Remaining roadmap work

- Add deeper knowledge-base pages per role family as the repository grows.
- Add generated compatibility snapshots for agent exports if maintainers decide to commit generated artifacts.
- Add labels in GitHub for `good first issue`, `taxonomy`, `content`, and `tooling` if repository maintainers have permission.
- Continue expanding examples for sourcing, interviews, and onboarding using the new taxonomy metadata.
