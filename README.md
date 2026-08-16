# HR Skills

A comprehensive library of domain-specific Agent Skills for Human Resources professionals, designed for AI-powered HR workflows using Claude.ai, Claude Code, and other Agent Skills–compatible platforms.

[![skills.sh](https://skills.sh/b/tuanductran/hr-skills)](https://skills.sh/tuanductran/hr-skills)

Built by [Tuan Duc Tran](https://linkedin.com/in/tuanductran) for the **HR/TA Job Onsite/Hybrid/Remote** community.

HR Skills follows the open **Agent Skills** specification and provides structured, reusable building blocks that help AI agents perform HR tasks consistently, safely, and with domain-specific expertise.

## What's Inside

HR Skills covers the complete employee lifecycle together with strategic HR, workforce planning, organizational effectiveness, AI adoption, and HR technology.

### Core HR Functions

- Talent Acquisition & Recruiting
- Onboarding & Offboarding
- Performance Management
- Career Development & Succession Planning
- Compensation & Benefits
- Learning & Development
- Employee Experience
- HR Business Partnering

### Strategy & Analytics

- Workforce Planning
- HR Analytics
- Workforce Intelligence
- Talent Intelligence
- Skills Intelligence
- Strategic Planning
- Organizational Design
- Organizational Development
- Change & Transformation

### HR Technology & AI

- HR Technology
- HR Automation
- Prompt Engineering for HR
- Agentic AI for HR
- AI Governance
- AI Adoption
- AI Evaluation

### Specialized Domains

- Compliance & Labor Relations
- Culture & Engagement
- Wellbeing
- Diversity, Equity & Inclusion
- Global HR
- Technical Recruiting
- Vietnam HR & Labor Law

> **Skill maturity is continuously generated.** See [`docs/engineering/skill-matrix.md`](docs/engineering/skill-matrix.md) for the latest inventory and maturity status.

## Quick Start

### Claude Code (Recommended)

Install a single skill:

```bash
cp -r skills/hr-recruiting ~/.claude/skills/
```

Install the complete library:

```bash
cp -r skills/hr-* ~/.claude/skills/
```

Once installed, simply describe your HR task. Claude Code automatically discovers and loads the most relevant skills.

Example:

```text
Create competency-based interview questions for a Senior Product Manager.
```

### Claude.ai

1. Create or open a Project.
2. Upload the desired `SKILL.md` file to Project Knowledge.
3. Start chatting.

Multiple skills can be combined to support more complex HR workflows.

### Downloaded a package?

If you have `hr-skills.zip` or `hr-skills.skill` instead of a clone of this
repository, see [`docs/product/USER.md`](docs/product/USER.md) — it covers
loading the package into Claude, ChatGPT, and other AI tools.

### Examples

See [`examples/`](examples/README.md) for practical, end-to-end usage:
single-skill prompt → expected output examples, multi-skill HR workflows
(hiring, onboarding, succession), and how to drive the same workflows
programmatically with the [Skill Planner](docs/engineering/planner.md) and
[Workflow Runtime](docs/engineering/runtime.md).

## Available Skills

The repository contains a broad collection of HR Agent Skills organized by functional domain.

Key navigation documents:

- **Router:** [`SKILL.md`](SKILL.md) — Master routing guide for all skills
- **Skill Matrix:** [`docs/engineering/skill-matrix.md`](docs/engineering/skill-matrix.md) — Generated inventory and maturity status
- **Roadmap:** [`docs/ROADMAP.md`](docs/ROADMAP.md) — Project vision, architecture, and future direction
- **Ecosystem Integrations:** [`docs/integrations/README.md`](docs/integrations/README.md) — Supported platforms, installation guides, and compatibility testing strategy
- **Release Process:** [`docs/operations/release.md`](docs/operations/release.md) — Release lifecycle, versioning strategy, validation checklist, and release notes workflow
- **Governance:** [`GOVERNANCE.md`](GOVERNANCE.md) — Roles, review and approval workflow, ownership, and roadmap feedback process

The Skill Matrix is the authoritative source for repository coverage and maturity.

## What Are Agent Skills?

Agent Skills are reusable prompt packages that extend AI assistants with specialized domain expertise.

Each HR Skill follows a consistent structure:

- **SKILL.md** — Core capability definition
- **content/** — Domain knowledge and reference material
- **prompts/** — Reusable prompt templates
- **examples/** — Practical HR scenarios and example interactions

Together, these components provide reusable, version-controlled building blocks for HR AI workflows.

## Repository Structure

```text
hr-skills/
├── SKILL.md                         # Master router
├── skills/                          # Domain-specific HR Skills
│   ├── hr-recruiting/
│   │   ├── SKILL.md
│   │   ├── content/
│   │   ├── prompts/
│   │   └── examples/
│   ├── hr-onboarding/
│   ├── hr-performance-management/
│   └── ...
├── packages/
│   ├── hr-skills/                   # Publishable CLI for npx/bunx
│   ├── hr-skills-build/             # Validation, generation & runtime tooling
│   ├── hr-skills-ref/               # Client-safe and Bun/Node Agent Skills library
│   └── hr-skills-tsdoc/             # Multi-package TSDoc API generator
├── docs/
│   ├── skill-matrix.md
│   ├── ROADMAP.md
│   └── ...
└── ...
```

## Development

HR Skills is built as a Bun + Turborepo monorepo.

Core commands:

```bash
bun install
bun run build
bun run validate
bun run matrix
```

Quality commands:

```bash
bun run lint
bun run lint:md
bun run typecheck
bun run check
```

Release commands:

```bash
bun run changeset
bun run release
```

For additional scripts, see [`package.json`](package.json).

## Packages

| Package           | Purpose                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| `hr-skills`       | Publishable `npx hr-skills` / `bunx hr-skills` command-line package       |
| `hr-skills-build` | Validation, matrix generation, metadata synchronization, and runtime tooling |
| `hr-skills-ref`   | TypeScript library with explicit client and Bun/Node server surfaces     |
| `hr-skills-tsdoc` | TSDoc-compatible API documentation generator for all public packages    |

## Contributing

Contributions are welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the step-by-step
guide and [`GOVERNANCE.md`](GOVERNANCE.md) for how review, ownership, and roadmap feedback
work.

Before opening a pull request, ensure the repository passes validation:

```bash
bun install
bun run validate
bun run matrix
```

Follow the Conventional Commits specification for commit messages.

## License

MIT License © 2026–Present Tuan Duc Tran
