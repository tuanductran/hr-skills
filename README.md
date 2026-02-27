# HR agent skills

A collection of HR skills for Claude.ai and Claude Code that help HR managers with their day-to-day work. Skills are packaged AI prompt libraries that extend Claude's capabilities across all major HR domains.

Built by [Tuan Duc Tran](https://github.com/tuanductran) for members of the Zalo **HR/TA Job Onsite/Hybrid/Remote** group — a community for Human Resources and Talent Acquisition professionals sharing Onsite, Hybrid, and Remote job opportunities.

Skills follow the [Agent Skills](https://agentskills.io/) format.

## Available HR skills

### hr-recruiting

End-to-end recruiting and talent acquisition support — job descriptions, interview questions, resume screening, employer branding, offer letters, and candidate experience.

**Use when:**

- "Write a job description for [role]"
- "Create behavioral interview questions"
- "Screen these resumes"
- "Write a job offer letter"
- "Develop our employer branding strategy"

### hr-performance-management

Performance management across the full cycle — reviews, PIPs, goal setting, 360-degree feedback, recognition programs, and succession planning.

**Use when:**

- "Write a performance review for [employee]"
- "Create a performance improvement plan"
- "Set SMART goals for my team"
- "Design a 360-degree feedback survey"
- "Build an employee recognition program"

### hr-compensation-benefits

Compensation strategy and benefits design — pay analysis, bonus plans, equity programs, benefits packages, total rewards statements, and retention strategies.

**Use when:**

- "Analyze our compensation data"
- "Design a bonus plan"
- "Write a compensation philosophy"
- "Create a wellness program"
- "Develop retention strategies"

### hr-employee-relations

Employee relations from investigations to culture — exit/stay interviews, grievance management, workplace investigations, policy writing, and team communications.

**Use when:**

- "Conduct an exit interview"
- "Handle an employee grievance"
- "Write a remote work policy"
- "Manage a workplace investigation"
- "Conduct employee satisfaction surveys"

### hr-training-development

Learning and development programs — needs assessments, training design, e-learning, coaching, mentorship, competency models, and career development plans.

**Use when:**

- "Design a training program"
- "Create a coaching plan"
- "Develop a mentorship program"
- "Write learning objectives"
- "Build a competency model"

### hr-analytics

HR analytics and data management — metrics, dashboards, turnover analysis, predictive models, data governance, and D&I scorecards.

**Use when:**

- "Analyze employee turnover data"
- "Create HR metrics and dashboards"
- "Build a predictive attrition model"
- "Write an HR data governance policy"
- "Create diversity scorecards"

### hr-workforce-planning

Workforce strategy and planning — skills gap analyses, succession planning, headcount modeling, talent assessments, and global workforce strategies.

**Use when:**

- "Create a workforce plan"
- "Conduct a skills gap analysis"
- "Develop a succession plan"
- "Forecast our hiring needs"
- "Build workforce models"

### hr-technology

HR technology strategy and implementation — system selection, HRIS implementation, HR automation, chatbots, self-service portals, and data security.

**Use when:**

- "Evaluate HR systems"
- "Create an HR technology roadmap"
- "Write an RFP for an ATS"
- "Develop an HR chatbot"
- "Manage HR automation"

### hr-leadership-development

Leadership programs and assessment — competency frameworks, leadership programs, executive coaching, 360-degree assessments, and succession planning.

**Use when:**

- "Create a leadership development program"
- "Conduct leadership assessments"
- "Design executive coaching"
- "Build a leadership succession plan"
- "Develop leadership competencies"

### hr-compliance

HR compliance and workplace policies — EEO, OSHA, FMLA, ADA, harassment prevention, employee handbooks, and immigration compliance.

**Use when:**

- "Write an employee handbook"
- "Manage EEO compliance"
- "Handle FMLA administration"
- "Conduct a compliance audit"
- "Create a harassment prevention policy"

### hr-diversity-inclusion

Diversity, equity, and inclusion initiatives — D&I strategies, inclusive recruiting, unconscious bias training, ERGs, equity measurement, and inclusive culture building.

**Use when:**

- "Develop a D&I strategy"
- "Create unconscious bias training"
- "Build employee resource groups"
- "Measure our diversity metrics"
- "Write inclusive job descriptions"

### hr-conflict-resolution

Workplace conflict resolution — mediation, facilitation, conflict policies, training programs, and post-conflict team rebuilding.

**Use when:**

- "Resolve a workplace conflict"
- "Mediate between employees"
- "Develop conflict resolution training"
- "Create a conflict resolution policy"
- "Address a team dispute"

### hr-onboarding

Employee onboarding and offboarding — onboarding programs, orientation, buddy systems, exit interviews, and knowledge transfer.

**Use when:**

- "Create an onboarding plan"
- "Design an orientation program"
- "Build a buddy system"
- "Conduct exit interviews"
- "Manage knowledge transfer"

### hr-employee-engagement

Employee engagement strategies — engagement surveys, recognition programs, culture building, work-life balance, and reducing burnout.

**Use when:**

- "Improve employee engagement"
- "Design a recognition program"
- "Conduct an engagement survey"
- "Boost employee morale"
- "Reduce burnout in my team"

## Installation

**Claude Code:**

```bash
cp -r skills/hr-{skill-name} ~/.claude/skills/
```

**claude.ai:** Add the skill's `SKILL.md` to your project knowledge, or paste the content into the conversation.

## Skill structure

Each skill contains:

- `SKILL.md` — Skill definition with supported tasks and AI prompts for HR managers

## Development

This is a [Bun](https://bun.sh/) monorepo. Run all commands from the project root.

```bash
bun install          # Install all dependencies
bun run validate     # Validate all 15 skill SKILL.md files
bun run catalog      # Regenerate skills/CATALOG.md
bun run build        # Build packages (skills-ref CLI → dist/)
bun run typecheck    # Type-check all packages with tsc
bun run lint         # ESLint on TypeScript sources
bun run lint:fix     # ESLint with auto-fix
bun run lint:md      # markdownlint + case-police on Markdown files
bun run lint:md:fix  # markdownlint + case-police with auto-fix
```

### Packages

| Package | Description |
|---------|-------------|
| `packages/hr-skills-build` | Scripts for validating skills and generating `CATALOG.md` |
| `packages/skills-ref` | TypeScript library + CLI for reading, validating, and prompting skill files |

## License

MIT
