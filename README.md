# HR Skills

A reusable library of **Agent Skills for HR, Talent Acquisition, and technical recruiting**. Built for AI-assisted HR workflows with structured domain knowledge, prompts, examples, and reusable workflows.

Built by [Tuan Duc Tran](https://linkedin.com/in/tuanductran) for the **HR/TA Job Onsite/Hybrid/Remote** community.

## What’s Inside

HR Skills covers the employee lifecycle, strategic HR, recruiting, analytics, HR technology, and AI adoption.

- Talent Acquisition & Recruiting
- Onboarding & Offboarding
- Performance & Career Development
- Compensation & Benefits
- Learning & Development
- Employee Experience & HRBP
- Workforce & Talent Intelligence
- Organizational Design & Development
- HR Analytics & Workforce Planning
- HR Technology & Automation
- AI Adoption, Governance & Evaluation
- Technical Recruiting
- Compliance, Labor Relations & Vietnam HR

Each skill is organized as a reusable package built around `SKILL.md`, with supporting knowledge and examples where needed.

## Quick Start

### Claude Code

Install a skill:

```bash
cp -r skills/hr-recruiting ~/.claude/skills/
```

Or install the HR skill collection:

```bash
cp -r skills/hr-* ~/.claude/skills/
```

Then describe the HR task you want the agent to perform.

```text
Create competency-based interview questions for a Senior Product Manager.
```

### Claude.ai

Create or open a Project, then upload the required `SKILL.md` files to Project Knowledge.

For packaged downloads such as `hr-skills.zip` or `hr-skills.skill`, see [`docs/product/USER.md`](docs/product/USER.md).

## Skill Structure

```text
skill-name/
├── SKILL.md       # Instructions and metadata
├── content/       # Domain knowledge and references
├── prompts/       # Reusable prompt templates
└── examples/      # Practical examples
```

The generated [Skill Matrix](docs/engineering/skill-matrix.md) is the authoritative inventory and maturity view.

## Repository

```text
hr-skills/
├── skills/        # HR Agent Skills
├── apps/          # Web and bot applications
├── packages/      # CLI and supporting libraries
├── docs/          # Project documentation
├── examples/      # End-to-end examples
└── registry/      # Generated skill registry
```

Useful entry points:

- [`SKILL.md`](SKILL.md) — master skill router
- [`docs/engineering/skill-matrix.md`](docs/engineering/skill-matrix.md) — skill inventory
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — project direction
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution guide
- [`GOVERNANCE.md`](GOVERNANCE.md) — project governance

## Development

HR Skills uses **Bun + Turborepo**.

```bash
bun install
bun run build
bun run validate
bun run matrix
bun run check
```

See [`package.json`](package.json) for the complete command list.

## Contributing

Contributions are welcome. Before opening a pull request:

```bash
bun install
bun run validate
bun run matrix
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full workflow.

## License

MIT License © 2026–Present Tuan Duc Tran
