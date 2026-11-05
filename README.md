# HR Skills

A comprehensive library of domain-specific Agent Skills for Human Resources professionals, designed for AI-powered HR workflows using Claude.ai, Claude Code, and other Agent Skills–compatible platforms.

[![skills.sh](https://skills.sh/b/tuanductran/hr-skills)](https://skills.sh/tuanductran/hr-skills)

Built by [Tuan Duc Tran](https://linkedin.com/in/tuanductran) for the **HR/TA Job Onsite/Hybrid/Remote** community.

HR Skills is a **Markdown-first HR knowledge and Agent Skills library**. Human-authored Markdown is the canonical source for HR knowledge and skill behavior; build tooling exists to validate and distribute that content, not to become a second source of domain knowledge. See the [Markdown-first product scope](docs/decisions/0001-markdown-first-product-scope.md) for the architecture decision.

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

See [`examples/`](examples/README.md) for practical HR scenarios and expected outputs. These examples illustrate how to use the Markdown skills; they do not require the deferred planner or workflow runtime.

## Available Skills

The repository contains a broad collection of HR Agent Skills organized by functional domain.

Key navigation documents:

- **Router:** [`SKILL.md`](SKILL.md) — Master routing guide for all skills
- **Skill Matrix:** [`docs/engineering/skill-matrix.md`](docs/engineering/skill-matrix.md) — Generated inventory and maturity status
- **Product scope:** [`docs/decisions/0001-markdown-first-product-scope.md`](docs/decisions/0001-markdown-first-product-scope.md) — Canonical product boundary and deferred capabilities
- **Roadmap:** [`docs/ROADMAP.md`](docs/ROADMAP.md) — Historical implementation record and follow-up direction
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
├── apps/                         # Web documentation and Discord bot
├── packages/                    # CLI, libraries, build tooling, and API docs
├── skills/                      # Source HR skills
├── docs/                        # Engineering, product, operations, and integration docs
├── examples/                    # End-to-end and planner/runtime examples
├── playground/                  # Experimental integration apps
├── registry/                    # Generated registry artifacts
├── .agents/                     # Repository maintenance skills
├── .claude/                     # Claude Code commands, prompts, rules, and hooks
├── .claude-plugin/              # Generated marketplace metadata
└── SKILL.md                    # Root skill router
```

See [`AGENTS.md`](AGENTS.md) for contributor guidance and the [product-scope decision](docs/decisions/0001-markdown-first-product-scope.md) for the target architecture. Existing package boundaries are transitional and will be narrowed through the follow-up architecture work.

## Development

The current repository still uses Bun + Turborepo for its existing maintenance and build implementation. This toolchain is transitional, not the product definition; the retained minimum is being classified in [Issue #287](https://github.com/tuanductran/hr-skills/issues/287).

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
