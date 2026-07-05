# HR Skills

A collection of HR skills for Claude.ai and Claude Code that help HR managers with their day-to-day work. Skills are packaged AI prompt libraries that extend Claude's capabilities across recruiting, people operations, compliance, leadership, analytics, and other HR domains.

[![skills.sh](https://skills.sh/b/tuanductran/hr-skills)](https://skills.sh/tuanductran/hr-skills)

Built by [Tuan Duc Tran](https://linkedin.com/in/tuanductran) for members of the Zalo **[HR/TA Job Onsite/Hybrid/Remote](https://zalo.me/g/mphdei134)** community—a community for Human Resources and Talent Acquisition professionals sharing Onsite, Hybrid, and Remote job opportunities.

Skills follow the [Agent Skills](https://agentskills.io/) format.

> ⚠️ **HR Skills is actively maintained and evolves continuously.** The repository is fully usable, but not every skill has the same level of coverage or supporting resources. Some skills intentionally consist of only a `SKILL.md`, while others also include examples, prompts, reference content, or additional tooling. This variation is intentional and reflects the needs of each skill. Repository conventions, validation rules, and supporting resources may evolve between releases. [Issues](https://github.com/tuanductran/hr-skills/issues), pull requests, and community feedback are always welcome.

## Coverage

HR Skills covers the full employee lifecycle and modern HR practice, including:

- Recruiting and Talent Acquisition
- Interviewing and Hiring
- Job Descriptions
- Onboarding and Offboarding
- Performance Management
- Performance Reviews
- Employee Relations
- Employee Experience
- People Operations
- HR Business Partner
- HR Analytics
- HR Technology and HRIS
- Learning and Development
- Leadership Development
- Organizational Development
- Compensation and Benefits
- Total Rewards
- Workforce Planning
- Succession Planning
- Employer Branding
- Compliance
- Diversity, Equity, and Inclusion
- Wellbeing
- Vietnam-specific HR guidance
- Software engineering recruiting (Frontend, Backend, Fullstack, Mobile, DevOps, QA, AI, Security, Data, UI/UX, and more)

## What are Agent Skills?

Agent Skills are reusable prompt libraries that extend Claude with domain-specific expertise.

Each skill consists of a single `SKILL.md` file containing:

- Professional instructions
- HR workflows
- Best practices
- Decision frameworks
- Prompt templates
- Examples and guidance

Claude automatically applies the relevant skill when working on matching HR tasks.

## Quick start

### Claude Code

Install a single skill:

```bash
cp -r skills/hr-recruiting ~/.claude/skills/
```

Install all skills:

```bash
cp -r skills/hr-* ~/.claude/skills/
```

Verify installation:

```bash
ls ~/.claude/skills/
```

Each installed directory should contain a `SKILL.md` file.

Once installed, simply describe your HR task. Claude Code automatically loads available skills at startup.

Example:

```text
Create behavioral interview questions for a Product Manager.
```

```text
Write a 90-day onboarding plan for a Senior Backend Engineer.
```

```text
Draft a return-to-office policy for a hybrid engineering team.
```

### claude.ai

You can also use HR Skills directly in Claude Projects.

1. Create or open a Project.
2. Open **Project knowledge**.
3. Upload the desired `SKILL.md` file.
4. Start chatting with Claude.

Alternatively, paste the contents of any `SKILL.md` directly into a conversation.

You may combine multiple skills in a single project when working across several HR domains.

## Try your first skill

Install the recruiting skill:

```bash
cp -r skills/hr-recruiting ~/.claude/skills/
```

Then ask Claude:

```text
Create competency-based interview questions for a Product Manager.
```

Claude automatically uses the recruiting skill to generate structured, competency-based interview questions.

## Available skills

The repository currently includes more than 40 HR skills covering topics such as:

- Recruiting
- Talent Acquisition
- Interviewing
- Job Descriptions
- HR Analytics
- HR Technology
- People Operations
- Performance Management
- Learning and Development
- Compensation and Benefits
- Leadership Development
- Employer Branding
- Workforce Planning
- Compliance
- Employee Experience
- Organizational Development
- Software Engineering recruiting
- Vietnam HR
- and many more.

See **[`skills/CATALOG.md`](skills/CATALOG.md)** for the complete generated catalog of available skills.

## Repository structure

```text
skills/
├── hr-recruiting/
│   └── SKILL.md
├── hr-onboarding/
│   └── SKILL.md
├── hr-performance-management/
│   └── SKILL.md
└── ...

packages/
├── hr-skills-build/
└── skills-ref/
```

Every skill lives in its own directory and is distributed as a standalone `SKILL.md` file.

## Development

This repository is a Bun workspace powered by Turborepo.

Run all commands from the project root.

```bash
bun install          # Install all dependencies
bun run validate     # Validate all SKILL.md files
bun run catalog      # Regenerate skills/CATALOG.md
bun run sync         # Sync generated metadata and references
bun run clean        # Remove build artifacts and Turborepo cache

bun run build        # Build all workspace packages
bun run test         # Run tests
bun run typecheck    # Type-check all packages

bun run check        # Run Biome checks
bun run lint         # Run Biome with auto-fix
bun run format       # Format source files

bun run lint:md      # Markdown lint + case-police
bun run lint:md:fix  # Auto-fix Markdown issues
bun run lint:links   # Validate Markdown links

bun run knip         # Detect unused files and dependencies
bun run zip          # Generate distributable skill packages
bun run release      # Version, changelog, tag, and release
```

## Packages

| Package | Description |
|---------|-------------|
| `packages/hr-skills-build` | Build tooling for validating skills, generating catalogs, syncing metadata, and packaging releases |
| `packages/skills-ref` | TypeScript library for reading, validating, and prompting skill files |

## Contributing

Contributions are welcome.

Before opening a pull request, please ensure the repository passes all validation checks.

```bash
bun install
bun run validate
bun run test
bun run catalog
bun run sync
```

## License

MIT
