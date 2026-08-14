# Documentation

Use this folder as the entry point for repository documentation.

## Audience Routes

- Contributors: [`engineering/contributing/onboarding.md`](engineering/contributing/onboarding.md)
- Skill authors: [`engineering/contributing/skill-authoring.md`](engineering/contributing/skill-authoring.md)
  and [`engineering/format.md`](engineering/format.md)
- Reviewers and maintainers: [`../GOVERNANCE.md`](../GOVERNANCE.md),
  [`engineering/contributing/workflow.md`](engineering/contributing/workflow.md), and
  [`engineering/skill-matrix.md`](engineering/skill-matrix.md)
- Integrators and platform adapters: [`integrations/README.md`](integrations/README.md)
- Release managers: [`operations/release.md`](operations/release.md)
- End users: [`product/USER.md`](product/USER.md)
- Roadmap and direction: [`ROADMAP.md`](ROADMAP.md)

## Reference Docs

### Engineering

- [`engineering/format.md`](engineering/format.md): `SKILL.md` authoring format and skill package structure
- [`engineering/api.md`](engineering/api.md): public functions and types exported from `hr-skills-build`
- [`engineering/registry.md`](engineering/registry.md): Skill Registry architecture and schema
- [`engineering/planner.md`](engineering/planner.md): Skill Planner architecture
- [`engineering/runtime.md`](engineering/runtime.md): Workflow Runtime architecture
- [`engineering/evaluation.md`](engineering/evaluation.md): Evaluation framework and golden-fixture workflow
- [`engineering/search.md`](engineering/search.md): Skill Discovery (search) over Registry metadata
- [`engineering/recommendations.md`](engineering/recommendations.md): Skill Recommendations API
- [`engineering/usage-informed-relevance.md`](engineering/usage-informed-relevance.md): usage-informed
  `relatedSkills` quality improvements
- [`engineering/duplicate-detection.md`](engineering/duplicate-detection.md): deterministic duplicate-content
  detection
- [`engineering/semantic-validation.md`](engineering/semantic-validation.md): semantic validation of prompts
  and examples
- [`engineering/quality-scoring.md`](engineering/quality-scoring.md): automated content quality scoring
- [`engineering/skill-matrix.md`](engineering/skill-matrix.md): generated skill maturity snapshot — do not
  edit manually, run `bun run matrix`
- [`engineering/contributing/`](engineering/contributing/): contributor onboarding, workflow, skill-authoring
  guide, and worked examples

### Integrations

- [`integrations/README.md`](integrations/README.md): supported platforms, installation guides, and
  compatibility testing strategy

### Operations

- [`operations/release.md`](operations/release.md): release lifecycle, versioning strategy, and validation
  checklist

### Product

- [`product/USER.md`](product/USER.md): what HR Skills is and how to use it

- [`ROADMAP.md`](ROADMAP.md): development phases, what shipped, and open future work
