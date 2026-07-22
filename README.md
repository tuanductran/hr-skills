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

> **Skill maturity is continuously generated.** See [`docs/skill-matrix.md`](docs/skill-matrix.md) for the latest inventory and maturity status.

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

## Available Skills

The repository contains a broad collection of HR Agent Skills organized by functional domain.

Key navigation documents:

- **Router:** [`SKILL.md`](SKILL.md) — Master routing guide for all skills
- **Skill Matrix:** [`docs/skill-matrix.md`](docs/skill-matrix.md) — Generated inventory and maturity status
- **Roadmap:** [`docs/ROADMAP.md`](docs/ROADMAP.md) — Project vision, architecture, and future direction

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
│   ├── hr-skills-build/             # Validation, generation & CLI tooling
│   └── skills-ref/                  # TypeScript Agent Skills library
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
| `hr-skills-build` | Validation, matrix generation, metadata synchronization, and CLI tooling |
| `skills-ref`      | TypeScript library for reading, parsing, and validating Agent Skills     |

## Contributing

Contributions are welcome.

Before opening a pull request, ensure the repository passes validation:

```bash
bun install
bun run validate
bun run matrix
```

Follow the Conventional Commits specification for commit messages.

## License

MIT License © 2026–Present Tuan Duc Tran
