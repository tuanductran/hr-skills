# HR Skills — Project Roadmap

> **Repository:** [HR Skills](https://github.com/tuanductran/hr-skills)
> **Maintainer:** Tuan Duc Tran
> **License:** MIT
> **Status:** Actively maintained

This roadmap contains **active and planned work only**. Completed milestones are archived in [`HISTORY.md`](HISTORY.md), while release-specific version history belongs in [`../CHANGELOG.md`](../CHANGELOG.md).

For current skill maturity, use the generated matrix:

* `docs/engineering/skill-matrix.md`

For execution-level tasks and milestones, use GitHub Issues.

---

## Current Focus

The immediate roadmap focus is completing the hosted-service boundary of Phase 8, then building the intelligent agent platform and broader ecosystem capabilities on top of the stable service contracts.

### Priority Order

1. **Phase 8.4 — Hosted HTTP Adapter**
2. **Phase 9 — Intelligent Agent Platform**
3. **Phase 10 — Ecosystem & Community**
4. **HR/TA product initiatives** as separately scoped product tracks

---

## Phase 8 — API & Services

**Status: In progress.** The versioned library service layers, platform contracts, validation, operational guidance, and supporting APIs are complete and archived in [`HISTORY.md`](HISTORY.md). The remaining roadmap work is the deployment-specific hosted HTTP adapter.

### 8.4 Hosted HTTP Adapter

Expose the completed service capabilities through a deployable HTTP service without coupling the core library packages to a particular hosting provider.

#### HTTP surface

* Route handlers for registry search, planning, runtime execution, evaluation, health, and version information
* Stable request and response envelopes aligned with [`engineering/platform-integration.md`](engineering/platform-integration.md)
* Explicit API versioning
* Deterministic behavior consistent with the library implementations

#### Security and access

* Apply the existing request-validation and error-normalization contracts
* Implement the approved authentication and rate-limiting strategy at the HTTP boundary
* Keep high-risk operations explicit and auditable
* Avoid embedding provider-specific authentication logic in reusable library packages

#### Operations

* Connect HTTP requests to the operational observability model in [`engineering/operations.md`](engineering/operations.md)
* Define readiness and health behavior for deployed instances
* Preserve cache and registry artifact behavior across deployments
* Document self-hosted and managed deployment configurations

#### Delivery boundary

Phase 8 is complete only when the hosted adapter is implemented, tested, documented, and deployable independently of the core library packages.

---

## Phase 9 — Intelligent Agent Platform

**Status: Not started.** Begin after the Phase 8 hosted-service boundary is stable so orchestration, approvals, audit trails, and policy enforcement can rely on stable service contracts.

Turn HR Skills into an agentic platform for composing, running, and inspecting HR workflows.

### 9.1 Agent Orchestration

* Multi-step and multi-skill orchestration
* Visual workflow builder
* Conditional branching and fallback paths
* Skill chaining and reusable workflow templates

### 9.2 Intelligence Layer

* Agent memory and context propagation across sessions
* Recommendation-aware task routing
* Adaptive skill selection based on workflow outcomes
* Human-in-the-loop approvals for sensitive HR actions

### 9.3 Guardrails

* Policy enforcement for high-risk HR workflows
* Audit trails for agent decisions
* Approval checkpoints and escalation logic
* Safety validation before execution

---

## Phase 10 — Ecosystem & Community

**Status: Not started.** Existing governance, integrations, and release automation are foundations for this phase, not completion of its hosted ecosystem goals.

Expand HR Skills from a single repository into a sustainable ecosystem with community contributions, interoperability, and long-term governance.

### 10.1 Ecosystem Growth

* Community skill submissions
* Skill certification or review status
* Extension points for third-party skill packs
* Ecosystem analytics and adoption metrics

### 10.2 Distribution & Interoperability

* Hosted registry or sync service
* Plugin and marketplace expansion
* External platform adapters
* Cross-repository import/export workflows

### 10.3 Governance & Sustainability

* Maintainer model for larger scope
* Contribution pathways for domain experts
* Deprecation policy for outdated skills and APIs
* Long-term roadmap review cadence

---

## HR/TA Product Initiatives

These are proposed product tracks that reuse the existing HR Skills ecosystem. They are intentionally separate from Phases 8–10 until requirements, ownership, data models, and delivery plans are formally approved.

### HR/TA CV Builder

Explore a CV Builder that composes role- and locale-specific JSON templates from the existing skill ecosystem.

Potential scope:

* Role presets such as Talent Acquisition, Recruiter, HR Business Partner, and related HR/TA roles
* Country, language, seniority, industry, and job-description alignment
* JSON-first templates validated with TypeScript and Valibot
* Web preview and export without coupling templates to presentation components

### HR/TA JD Builder

Build a companion JD Builder that composes structured, role- and locale-specific job descriptions from the same skill ecosystem and template registry.

Potential scope:

* Position, department, reporting-line, and seniority context
* Employment type and work arrangement
* Country and language localization
* Compensation transparency and legally sensitive wording review
* Inclusive-language checks
* Responsibilities, qualifications, success metrics, and interview-process content
* Employer-brand sections
* JSON-first templates with guided editing, preview, revision history, localization, and export

### Shared Product Foundation

The CV Builder and JD Builder should share:

* Common role taxonomy
* Locale and language model
* Skills-to-role mapping
* Validation layer
* Template versioning
* Preview and export primitives

Region-specific legal or compensation guidance must remain explicit, reviewable, and configurable rather than being silently inferred.

Preferred delivery order:

1. Discovery and domain modeling
2. Shared template infrastructure
3. CV Builder and JD Builder verticals
4. Integration with the hosted Phase 8 services

---

## Roadmap Rules

* **Active or planned work** belongs in this file.
* **Completed milestones** belong in [`HISTORY.md`](HISTORY.md).
* **Release/version changes** belong in [`../CHANGELOG.md`](../CHANGELOG.md).
* **Implementation details** belong in the relevant `docs/engineering/`, `docs/operations/`, or `docs/integrations/` document.
* Do not move completed work back into this file merely to preserve historical context; link to `HISTORY.md` instead.

Last updated: September 14, 2026
