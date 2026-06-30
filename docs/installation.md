# Installation

HR Skills can be used with **Claude Code** (CLI) or **claude.ai** (web). Choose the method that matches how you use Claude.

## Claude Code

Claude Code reads skills from `~/.claude/skills/` on your machine.

### Install a single skill

```bash
cp -r skills/hr-recruiting ~/.claude/skills/
```

### Install all skills at once

```bash
cp -r skills/hr-* ~/.claude/skills/
```

### Verify installation

```bash
ls ~/.claude/skills/
```

You should see one directory per installed skill, each containing `SKILL.md`.

### Using installed skills

Claude Code automatically loads skills from `~/.claude/skills/` at startup. Just describe your HR task and Claude will apply the right skill:

```text
Write a 90-day performance review for a junior engineer
```

```text
Draft a return-to-office policy for a hybrid team
```

```text
Analyze our employee turnover data and suggest retention strategies
```

## claude.ai

### Via project knowledge

1. Open [claude.ai](https://claude.ai) and create or open a **Project**.
2. Go to **Project knowledge** → **Add content**.
3. Upload the `SKILL.md` file for the skill you want (for example `skills/hr-recruiting/SKILL.md`).
4. Claude will reference the skill in all conversations within that project.

### Via direct paste

Paste the contents of any `SKILL.md` directly into the conversation:

```text
I'm going to share an HR skill file. Please use it for this conversation.

[paste SKILL.md content here]

Now help me write a performance improvement plan for...
```

### One project per skill vs. combined

You can add multiple `SKILL.md` files to the same project. Claude handles them together, which works well for HR generalists who switch between domains frequently.

For deep focus work (for example a full recruiting campaign), create a dedicated project with only the relevant skill.

## Available skills

| Skill | What it covers |
|----------------|--------|
| `hr-ai` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-analytics` | Help HR managers with HR analytics and data management |
| `hr-backend` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-business-partner` | Help HR Business Partners, People Partners, and HRBP leaders a… |
| `hr-change-management` | Help HR leaders, change managers, and business partners design… |
| `hr-compensation-benefits` | Help HR managers with compensation and benefits programs |
| `hr-compliance` | Help HR managers with HR compliance and workplace policies |
| `hr-conflict-resolution` | Help HR managers with workplace conflict resolution |
| `hr-data` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-devops` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-diversity-inclusion` | Help HR managers with diversity, equity, and inclusion initiat… |
| `hr-employee-engagement` | Help HR managers with employee engagement strategies |
| `hr-employee-relations` | Help HR managers with employee relations matters |
| `hr-employer-branding` | Help HR leaders, talent acquisition teams, and employer brand … |
| `hr-frontend` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-fullstack` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-interviewing` | Help HR managers, recruiters, hiring managers, and interview p… |
| `hr-job-description` | Help HR professionals, recruiters, hiring managers, and talent… |
| `hr-kpi` | Help HR managers, people analytics teams, and HR business part… |
| `hr-leadership-development` | Help HR managers with leadership development programs |
| `hr-mobile` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-onboarding` | Help HR managers with employee onboarding and offboarding |
| `hr-organizational-development` | Help HR business partners, OD consultants, and people leaders … |
| `hr-payroll` | Help HR operations specialists, payroll administrators, and co… |
| `hr-people-operations` | Help HR managers, People Ops specialists, HRIS administrators,… |
| `hr-performance-management` | Help HR managers with performance management processes |
| `hr-performance-review` | Help managers, HR professionals, and team leaders write fair, … |
| `hr-qa` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-recruiting` | Help HR managers with end-to-end recruiting and talent acquisi… |
| `hr-security` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-talent-management` | Help HR managers, HRBPs, L&D leads, and people operations team… |
| `hr-technology` | Help HR managers with HR technology strategy and implementation |
| `hr-total-rewards` | Help HR managers, compensation analysts, benefits specialists,… |
| `hr-training-development` | Help HR managers with learning and development programs |
| `hr-uiux` | Help HR managers, recruiters, and talent acquisition teams und… |
| `hr-vietnam-context` | Vietnam-specific HR guidance covering the Labor Code, Social I… |
| `hr-wellbeing` | Help HR business partners, wellbeing program managers, and peo… |
| `hr-workforce-planning` | Help HR managers with workforce planning and strategy |

See [skills.md](./skills.md) for full descriptions and example trigger phrases.

## Development

This repository uses Bun workspaces with Turborepo for builds, task orchestration, and caching.

Common development commands:

```bash
bun install
bun run build
bun run test
bun run typecheck
bun run check
bun run lint
```

Run a task for a specific package with Turbo filters:

```bash
turbo run build --filter=skills-ref
turbo run typecheck --filter=hr-skills-build
```
