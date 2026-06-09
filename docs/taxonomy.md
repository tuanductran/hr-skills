# HR skills taxonomy

This taxonomy defines how skills are grouped, validated, and rendered across the repository. It covers the Skill Architecture roadmap items in issue #50, excluding Website Platform work.

## Metadata schema

Every `skills/hr-*/SKILL.md` file must include these frontmatter fields:

```yaml
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
  category: talent-acquisition
  tags:
    - recruiting
    - interviewing
  status: stable
  recruitingWorkflow: screening
```

| Field | Required | Allowed values | Purpose |
|-------|----------|----------------|---------|
| `metadata.author` | Yes | `Tuan Duc Tran` | Skill owner shown in generated catalogs. |
| `metadata.version` | Yes | Semantic version string | Skill content version. |
| `metadata.category` | Yes | `core-hr`, `talent-acquisition`, `technical-recruiting`, `people-operations`, `workforce-strategy`, `compliance` | Primary HR domain grouping. |
| `metadata.tags` | Yes | 2–8 lowercase topic tags | Discovery, filtering, and compatibility exports. |
| `metadata.status` | Yes | `stable`, `beta`, `experimental` | Lifecycle state shown in catalogs. |
| `metadata.recruitingWorkflow` | Yes | `not-applicable`, `workforce-planning`, `role-calibration`, `sourcing`, `screening`, `interviewing`, `scorecards`, `offers`, `onboarding` | Recruiting workflow grouping. |

## Skill lifecycle statuses

Use lifecycle status to set expectations for contributors and consumers.

| Status | Use when | Review expectation |
|--------|----------|--------------------|
| `stable` | The skill covers an established HR domain with validated prompts and examples. | Review during content refreshes or when user feedback identifies a gap. |
| `beta` | The skill covers a fast-moving domain, specialized market context, or newer technical recruiting area. | Review more frequently for terminology drift and tooling changes. |
| `experimental` | The skill explores a new domain, workflow, or agent format that still needs field validation. | Require focused maintainer review before promotion to `beta` or `stable`. |

## HR domain categories

- `core-hr`: foundational HR operations such as onboarding, performance, compensation, benefits, and HR technology
- `talent-acquisition`: end-to-end recruiting operations and candidate workflows
- `technical-recruiting`: role calibration and candidate assessment for technical disciplines
- `people-operations`: employee engagement, relations, development, conflict resolution, and inclusion
- `workforce-strategy`: analytics, headcount, capacity, and strategic workforce planning
- `compliance`: employment law, policy, risk, and location-specific HR obligations

## Recruiting workflow taxonomy

Use `metadata.recruitingWorkflow` to map a skill to the recruiting workflow where it is most likely to help.

| Workflow | Scope | Example skills |
|----------|-------|----------------|
| `workforce-planning` | Translate business plans into roles, capacity, and hiring demand. | `hr-workforce-planning` |
| `role-calibration` | Define role expectations, technical competencies, seniority, and interview coverage. | `hr-ai`, `hr-backend`, `hr-frontend`, `hr-security` |
| `sourcing` | Build sourcing strategies, outreach, employer branding, and market maps. | `hr-recruiting` when the task is sourcing-heavy |
| `screening` | Resume review, phone screens, candidate triage, and early qualification. | `hr-recruiting` |
| `interviewing` | Structured interviews, behavioral probes, and technical interview plans. | `hr-recruiting`, technical recruiting skills |
| `scorecards` | Rubrics, competency matrices, and hiring committee calibration. | `hr-recruiting`, `hr-performance-management` for internal mobility |
| `offers` | Offer strategy, negotiation, closing, and candidate communications. | `hr-recruiting`, `hr-compensation-benefits` |
| `onboarding` | New-hire ramp plans and transition from accepted offer to productive employee. | `hr-onboarding` |
| `not-applicable` | Skills that are HR-relevant but not primarily recruiting workflow tools. | `hr-compliance`, `hr-analytics` |

## Validation and catalog rendering

- `skills-ref` validates required metadata, allowed categories, allowed lifecycle statuses, and allowed recruiting workflow values.
- `hr-skills-build` validates project-specific author, version, and metadata completeness.
- `bun run catalog` renders status, category, recruiting workflow, tags, version, and author for every skill.
- `bun run export:agents` uses this metadata in multi-agent export manifests for Claude, OpenAI Codex, Cursor, and Gemini.
