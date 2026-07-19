# HR Skills

Master library of domain-specific AI prompt skills for Human Resources professionals using Claude.ai and Claude Code.

[![skills.sh](https://skills.sh/b/tuanductran/hr-skills)](https://skills.sh/tuanductran/hr-skills)

Built by [Tuan Duc Tran](https://linkedin.com/in/tuanductran) for the **[HR/TA Job Onsite/Hybrid/Remote](https://zalo.me/g/mphdei134)** Zalo community.

Skills follow the [Agent Skills](https://agentskills.io/) open format.

## What's Inside

100+ structured Agent Skills covering the complete employee lifecycle:

### Core HR Functions

- Talent Acquisition & Recruiting
- Onboarding & Offboarding
- Performance Management & Reviews
- Career Development & Succession Planning
- Compensation, Benefits & Total Rewards
- Learning & Development
- Organizational Design & Change Management

### People & Analytics

- HR Analytics & Workforce Intelligence
- Strategic Workforce Planning & Forecasting
- HR Technology & Platform Integration
- Prompt Engineering for HR
- Agentic AI for HR Operations

### Specialized Domains

- Compliance, Labor Relations & Risk
- HR Business Partnerships
- Culture, Engagement & Wellbeing
- Diversity, Equity & Inclusion
- Software Engineering & Technical Hiring

### Regional Expertise

- Vietnam-specific HR & labor law guidance

> **Note:** Each skill has different coverage levels. Some contain only `SKILL.md`, others include prompts, examples, and reference content. See [skill-matrix.md](docs/skill-matrix.md) for maturity status. New skills are added continuously.

## Quick Start

### Claude Code (Recommended)

**Install a single skill:**

```bash
cp -r skills/hr-recruiting ~/.claude/skills/
```

**Install all skills:**

```bash
cp -r skills/hr-* ~/.claude/skills/
```

Once installed, just describe your HR task—Claude Code automatically loads relevant skills.

**Example:**

```text
Create behavioral interview questions for a Senior Product Manager.
```

### claude.ai

1. Create or open a Project
2. Go to Project knowledge → Upload `SKILL.md`
3. Start chatting

Or paste the skill content directly in chat. Combine multiple skills when working across domains.

## Try It Now

```bash
cp -r skills/hr-recruiting ~/.claude/skills/
```

Then ask:

```text
Write 5 competency-based interview questions for a Product Manager focused on cross-functional leadership.
```

Claude will use the recruiting skill to generate structured, high-quality questions.

---

## Available Skills

The repository includes **100+ HR skills** organized by function. For the complete, up-to-date list with maturity status, see:

- **Router:** [`SKILL.md`](SKILL.md) — Master routing guide for all skills
- **Matrix:** [`docs/skill-matrix.md`](docs/skill-matrix.md) — Full skill inventory with maturity levels (Full/Partial/Bare)
- **Roadmap:** [`docs/ROADMAP.md`](docs/ROADMAP.md) — Long-term direction and architecture

## What Are Agent Skills?

Agent Skills are reusable prompt libraries that extend Claude with specialized domain knowledge.

Each skill includes:

- **SKILL.md** — Core definitions and usage patterns
- **content/** — Domain frameworks and best practices
- **prompts/** — Ready-to-use prompt templates
- **examples/** — Real-world case studies and samples

Claude automatically recognizes and applies relevant skills when you describe your task.

## Repository Structure

```text
hr-skills/
├── skills/                          # 100+ HR-specific skills
│   ├── hr-recruiting/
│   ├── hr-onboarding/
│   ├── hr-performance-management/
│   └── ...
├── packages/
│   ├── hr-skills-build/            # Validation & tooling
│   └── skills-ref/                 # Generic skills library
├── docs/
│   ├── SKILL.md                    # Master router
│   ├── skill-matrix.md             # Skill inventory & maturity
│   └── ROADMAP.md                  # Project strategy
└── ...
```

## Development

This is a Bun + Turborepo workspace. All commands run from the project root.

**Core commands:**

```bash
bun install              # Install dependencies
bun run validate         # Validate all skills
bun run sync             # Sync metadata and references
bun run test             # Run tests
bun run build            # Build packages
```

**Quality & releases:**

```bash
bun run lint             # Lint code & markdown
bun run typecheck        # Type validation
bun run release          # Automated versioning & release
```

For full command list, see [`bun run`](package.json).

## Packages

| Package | Purpose |
|---------|---------|
| `hr-skills-build` | Validation, metadata sync, CLI tooling |
| `skills-ref` | TypeScript library for reading & validating skills |

## Contributing

Contributions are welcome. Before opening a PR, ensure all checks pass:

```bash
bun install
bun run validate
bun run test
bun run sync
```

## License

[MIT](./LICENSE) License © 2026-PRESENT [Tuan Duc Tran](https://github.com/tuanductran)
