# Installation

HR Skills can be used with **Claude Code** (CLI) or **claude.ai** (web). Choose the method that matches how you use Claude.

## Claude code

Claude Code reads skills from `~/.claude/skills/` on your machine.

### Install a single skill

```bash
cp -r skills/hr-recruiting ~/.claude/skills/
```

### Install all 15 skills at once

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
Analyse our employee turnover data and suggest retention strategies
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

| Skill directory | Domain |
|----------------|--------|
| `hr-analytics` | HR metrics, dashboards, and predictive models |
| `hr-compensation-benefits` | Pay analysis, bonuses, and total rewards |
| `hr-compliance` | Anti-discrimination, workplace safety, statutory leave, work permits, and employee handbooks |
| `hr-conflict-resolution` | Mediation, de-escalation, and conflict policies |
| `hr-diversity-inclusion` | DEI strategy, inclusive recruiting, and ERGs |
| `hr-employee-engagement` | Surveys, recognition, culture, and burnout prevention |
| `hr-employee-relations` | Grievances, investigations, and policy writing |
| `hr-leadership-development` | Leadership programs, coaching, and 360 assessments |
| `hr-onboarding` | Onboarding programs, orientation, and offboarding |
| `hr-performance-management` | Reviews, PIPs, goal setting, and calibration |
| `hr-recruiting` | Job descriptions, interviews, screening, and offers |
| `hr-technology` | HRIS selection, implementation, and HR automation |
| `hr-training-development` | Learning needs, training design, and competency models |
| `hr-vietnam-context` | Vietnam Labor Code, Social Insurance, work permits, and cultural HR practices |
| `hr-workforce-planning` | Headcount planning, skills gaps, and succession |

See [skills.md](./skills.md) for full descriptions and example trigger phrases.
