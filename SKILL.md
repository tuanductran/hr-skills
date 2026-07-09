---
name: hr-skills
description: "Master router for the HR Skills library — 100+ specialized skill packages covering the full employee lifecycle: recruiting and talent acquisition, onboarding/offboarding, performance and talent management, compensation and total rewards, learning and development, organizational design and change, workforce planning and analytics, HR technology and AI, compliance and labor relations, culture and wellbeing, employer branding, and technical/software-engineering hiring. Includes Vietnam-specific labor law and cultural guidance. Use this skill FIRST for any HR, People Ops, Talent Acquisition, or hiring-related request — including hiring for engineering, design, product, or data roles — so the right specialized skill(s) get loaded instead of answering from general knowledge. Trigger on any task touching the employee lifecycle, workforce strategy, HR policy, or recruiting for any function."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# HR Skills

This is the entry point for the HR Skills library. It does not answer HR questions
directly — its only job is to identify which specialized skill(s) below apply to
the task and tell you which `skills/<name>/SKILL.md` to load next.

## How to use this skill

1. **Identify the domain(s).** Match the user's request against the routing
   tables below. Most requests map to exactly one skill; cross-functional
   requests (e.g. "build a recruiting + onboarding plan for a new engineering
   team") may need two or three.
2. **Load the specific skill.** Read `skills/<skill-name>/SKILL.md` for each
   match before responding. Prefer the most specific match over a broad one
   (e.g. for "write a JD for a Senior Backend Engineer," load
   [hr-job-description](skills/hr-job-description) **and** [hr-backend](skills/hr-backend), not just one).
3. **Check for Vietnam context.** If the user's org, employees, or the task
   itself is Vietnam-based (labor contracts, social insurance, PIT, work
   permits, disciplinary process under Vietnamese law), also load
   [hr-vietnam-context](skills/hr-vietnam-context/SKILL.md) alongside the functional skill — this
   is a standing differentiator for this library, not an edge case.
4. **Don't over-load.** Only load skills that are actually relevant. Loading
   every plausible skill wastes context and dilutes guidance.
5. **If nothing matches well,** answer using general HR knowledge and say so
   rather than forcing a mismatched skill.

## Routing tables

### Talent acquisition & recruiting

| Skill | Use when the task involves... |
|---|---|
| [hr-recruiting](skills/hr-recruiting) | End-to-end recruiting: JDs, interviews, screening, offers, references |
| [hr-talent-acquisition](skills/hr-talent-acquisition) | TA strategy, pipelines, time-to-hire, ATS workflows, sourcing channels |
| [hr-job-description](skills/hr-job-description) | Writing or rewriting a job posting/JD |
| [hr-job-analysis](skills/hr-job-analysis) | Formal job content, task analysis, role classification |
| [hr-interviewing](skills/hr-interviewing) | Structured/behavioral interview questions, scorecards, panel design |
| [hr-candidate-sourcing](skills/hr-candidate-sourcing) | Boolean search, passive candidates, outreach messages, pipelines |
| [hr-candidate-experience](skills/hr-candidate-experience) | Candidate journey, drop-off, interview feedback, satisfaction |
| [hr-social-recruiting](skills/hr-social-recruiting) | Recruiting via LinkedIn, Zalo, Facebook, Discord, TikTok, etc. |
| [hr-employer-branding](skills/hr-employer-branding) | EVP, careers page, employer reputation, recruitment marketing |
| [hr-executive-search](skills/hr-executive-search) | C-suite/board search, confidential outreach, succession at the top |
| [hr-contingent-workforce](skills/hr-contingent-workforce) | Contractors, freelancers, VMS/MSP programs, SOWs, classification |
| [hr-demand-planning](skills/hr-demand-planning) | Translating business strategy into headcount demand |
| [hr-talent-supply-chain](skills/hr-talent-supply-chain) | Build/buy/borrow/bot strategy, talent pools, market availability |
| [hr-talent-intelligence](skills/hr-talent-intelligence) | Talent market data, comp benchmarking, competitive intel |

### Onboarding, offboarding & people operations

| Skill | Use when the task involves... |
|---|---|
| [hr-onboarding](skills/hr-onboarding) | Onboarding plans, orientation, buddy systems, first-90-days |
| [hr-offboarding](skills/hr-offboarding) | Exit checklists, involuntary terminations, alumni programs |
| [hr-people-operations](skills/hr-people-operations) | HRIS setup, offboarding workflows, handbooks, data quality, automation |
| [hr-hr-coordination](skills/hr-hr-coordination) | Day-to-day HR admin, scheduling, logistics, cross-team support |
| [hr-employee-self-service](skills/hr-employee-self-service) | ESS portals, HR chatbots, internal knowledge bases |
| [hr-service-delivery](skills/hr-service-delivery) | Tiered HR support models, SLAs, case management |
| [hr-shared-services](skills/hr-shared-services) | Shared services center design, governance, cost allocation |
| [hr-operating-model](skills/hr-operating-model) | HRBP/CoE/Shared Services structure, three-pillar model |
| [hr-hr-management](skills/hr-hr-management) | Running the HR function itself: team goals, budget, governance |
| [hr-employee-lifecycle](skills/hr-employee-lifecycle) | End-to-end journey mapping from attraction to alumni |

### Performance, talent & career management

| Skill | Use when the task involves... |
|---|---|
| [hr-performance-management](skills/hr-performance-management) | Reviews, PIPs, goal-setting, 360 feedback, appraisal forms |
| [hr-performance-review](skills/hr-performance-review) | Writing a specific review, self-assessment, or manager feedback |
| [hr-talent-management](skills/hr-talent-management) | Succession, high-potentials, 9-box, engagement, retention strategy |
| [hr-succession-planning](skills/hr-succession-planning) | Leadership pipeline, critical roles, readiness assessment |
| [hr-career-development](skills/hr-career-development) | Career paths, IDPs, career ladders, development conversations |
| [hr-competency-management](skills/hr-competency-management) | Competency frameworks, behavioral indicators, competency libraries |
| [hr-manager-effectiveness](skills/hr-manager-effectiveness) | Manager quality, manager 360s, underperforming-manager programs |
| [hr-coaching-mentoring](skills/hr-coaching-mentoring) | Coaching culture, mentoring programs, manager coaching skills |
| [hr-people-leadership](skills/hr-people-leadership) | General people-leadership capability, psychological safety, inclusion |
| [hr-business-partner](skills/hr-business-partner) | Acting as HRBP: advising managers, ER cases, workforce plans |

### Compensation, benefits & rewards

| Skill | Use when the task involves... |
|---|---|
| [hr-compensation-benefits](skills/hr-compensation-benefits) | Comp analysis, bonus plans, benefits design, job evaluation |
| [hr-total-rewards](skills/hr-total-rewards) | Salary bands, pay equity, incentive plans, compa-ratio, total rewards statements |
| [hr-job-architecture](skills/hr-job-architecture) | Job families, career levels, leveling criteria, grade structures |
| [hr-recognition](skills/hr-recognition) | Recognition programs, peer recognition, service awards |

### Learning & development

| Skill | Use when the task involves... |
|---|---|
| [hr-training-development](skills/hr-training-development) | Training programs, e-learning, needs assessments, mentorship |
| [hr-learning-development](skills/hr-learning-development) | L&D programs, skills-gap analysis, onboarding/learning culture |
| [hr-learning-strategy](skills/hr-learning-strategy) | Enterprise learning strategy, L&D ecosystem, business alignment |
| [hr-leadership-development](skills/hr-leadership-development) | Leadership programs, executive coaching, leadership succession |
| [hr-workforce-capability](skills/hr-workforce-capability) | Org-level capability building, capability heat maps, reskilling |
| [hr-skills-management](skills/hr-skills-management) | Skills taxonomies, skills gap analysis, skills-based hiring |
| [hr-skills-taxonomy](skills/hr-skills-taxonomy) | Formal skills ontologies, skills-to-role mapping, skills clusters |

### Organizational development, design & change

| Skill | Use when the task involves... |
|---|---|
| [hr-organizational-development](skills/hr-organizational-development) | Org design, change management, culture transformation |
| [hr-organization-effectiveness](skills/hr-organization-effectiveness) | Team health, operating-model fitness, OE diagnostics |
| [hr-organizational-design](skills/hr-organizational-design) | Restructuring, spans and layers, RACI, operating models |
| [hr-change-management](skills/hr-change-management) | Change plans, stakeholder engagement, readiness, adoption |
| [hr-change-communication](skills/hr-change-communication) | Change announcements, messaging, communication plans |
| [hr-design-thinking](skills/hr-design-thinking) | Human-centered design applied to HR problems |
| [hr-consulting](skills/hr-consulting) | Internal HR consulting, business cases, diagnostics |
| [hr-strategic-planning](skills/hr-strategic-planning) | HR strategy, annual plans, HR roadmap, business alignment |
| [hr-workforce-transformation](skills/hr-workforce-transformation) | Large-scale restructuring, automation impact, reskilling at scale |

### Workforce planning & analytics

| Skill | Use when the task involves... |
|---|---|
| [hr-workforce-planning](skills/hr-workforce-planning) | Workforce models, headcount analysis, skills-gap, diversity strategy |
| [hr-analytics](skills/hr-analytics) | HR metrics, dashboards, turnover analysis, predictive models |
| [hr-kpi](skills/hr-kpi) | Selecting/calculating specific HR KPIs, leadership reporting |
| [hr-workforce-intelligence](skills/hr-workforce-intelligence) | Attrition prediction, headcount trends, skills inventories |
| [hr-workforce-scheduling](skills/hr-workforce-scheduling) | Shift schedules, staffing forecasts, shift swaps |
| [hr-time-attendance](skills/hr-time-attendance) | Time tracking policy, overtime, lateness, attendance systems |

### HR technology, data & AI

| Skill | Use when the task involves... |
|---|---|
| [hr-technology](skills/hr-technology) | HR systems strategy, ATS selection, HR chatbots, tech roadmap |
| [hr-hris](skills/hr-hris) | Choosing/implementing/migrating an HRIS, system integrations |
| [hr-digital-hr](skills/hr-digital-hr) | HR digital transformation, digital employee experience |
| [hr-automation](skills/hr-automation) | Automating HR workflows, no-code/AI tooling for HR ops |
| [hr-knowledge-management](skills/hr-knowledge-management) | HR knowledge bases, policy/SOP docs, tribal knowledge capture |
| [hr-genai](skills/hr-genai) | Using generative AI tools for HR content and productivity |
| [hr-prompt-engineering](skills/hr-prompt-engineering) | Writing/improving AI prompts for HR use cases |
| [hr-ai-governance](skills/hr-ai-governance) | Governing AI use in hiring/HR, bias risk, AI use policy |
| [hr-ai-ethics](skills/hr-ai-ethics) | Algorithmic fairness, bias audits, ethical AI policy |
| [hr-ai-privacy](skills/hr-ai-privacy) | Employee data privacy in AI systems, GDPR, consent design |
| [hr-ai-change-management](skills/hr-ai-change-management) | Managing the human side of AI adoption, resistance, readiness |
| [hr-agentic-ai](skills/hr-agentic-ai) | Autonomous HR agents, multi-agent workflows, governance of agentic AI |

### Compliance, labor relations & risk

| Skill | Use when the task involves... |
|---|---|
| [hr-compliance](skills/hr-compliance) | Handbooks, EEO/OSHA/FMLA, background checks, compliance audits |
| [hr-labor-relations](skills/hr-labor-relations) | Union campaigns, collective bargaining, grievances, disciplinary process |
| [hr-employee-relations](skills/hr-employee-relations) | Grievances, exit interviews, investigations, accommodations, contracts |
| [hr-conflict-resolution](skills/hr-conflict-resolution) | Mediating disputes, difficult conversations, conflict policy |
| [hr-risk-management](skills/hr-risk-management) | HR risk registers, compliance risk, mitigation plans |
| [hr-audit](skills/hr-audit) | HR audits, I-9/documentation review, pay equity checks |
| [hr-policy-management](skills/hr-policy-management) | Writing/updating HR policies and the employee handbook |
| [hr-immigration](skills/hr-immigration) | Visa sponsorship, global mobility, work-authorization compliance |
| [hr-payroll](skills/hr-payroll) | Payroll processing, compliance, calendars, discrepancies, multi-country payroll |

### Culture, engagement, experience & wellbeing

| Skill | Use when the task involves... |
|---|---|
| [hr-culture](skills/hr-culture) | Culture assessment, culture fit/add, culture diagnostics |
| [hr-employee-engagement](skills/hr-employee-engagement) | Engagement strategy, surveys, morale, burnout reduction |
| [hr-employee-experience](skills/hr-employee-experience) | EX strategy, journey mapping, onboarding/offboarding experience |
| [hr-employee-listening](skills/hr-employee-listening) | Engagement surveys, pulse checks, focus groups |
| [hr-diversity-inclusion](skills/hr-diversity-inclusion) | DEI strategy, inclusive JDs, bias training, ERGs, DEI metrics |
| [hr-wellbeing](skills/hr-wellbeing) | Wellbeing programs, burnout risk, mental health support, flexible work |
| [hr-future-of-work](skills/hr-future-of-work) | Hybrid work models, AI's impact on jobs, evolving expectations |
| [hr-internal-mobility](skills/hr-internal-mobility) | Lateral moves, internal job posting, talent marketplace |

### Project management & global/local context

| Skill | Use when the task involves... |
|---|---|
| [hr-project-management](skills/hr-project-management) | Project charters, timelines, stakeholder plans for HR initiatives |
| [hr-global-hr](skills/hr-global-hr) | Multi-country compliance, global mobility, cross-cultural HR |
| [hr-vietnam-context](skills/hr-vietnam-context) | **Vietnam Labor Code, Social Insurance Law, PIT, work permits, trade unions, disciplinary process under VN law.** Load alongside any functional skill when the org or employees are in Vietnam. |

### Software-engineering & technical hiring specialists

Use these together with [hr-recruiting](skills/hr-recruiting), [hr-job-description](skills/hr-job-description), or [hr-interviewing](skills/hr-interviewing)
when the role being hired is technical.

| Skill | Discipline |
|---|---|
| [hr-frontend](skills/hr-frontend) | Frontend engineering (React/Vue/Angular) |
| [hr-backend](skills/hr-backend) | Backend engineering, APIs, databases, microservices |
| [hr-fullstack](skills/hr-fullstack) | Fullstack engineering |
| [hr-mobile](skills/hr-mobile) | iOS/Android/cross-platform mobile |
| [hr-devops](skills/hr-devops) | DevOps, platform engineering, SRE |
| [hr-cloud](skills/hr-cloud) | Cloud engineering (AWS/Azure/GCP) |
| [hr-qa](skills/hr-qa) | QA, test automation, quality engineering |
| [hr-security](skills/hr-security) | Cybersecurity, AppSec, cloud security, SOC |
| [hr-data](skills/hr-data) | Data engineering, data science, analytics, BI |
| [hr-ai](skills/hr-ai) | AI/ML engineering, LLM engineering, AI infrastructure |
| [hr-uiux](skills/hr-uiux) | UI/UX and product design |
| [hr-product-management](skills/hr-product-management) | Product management |
| [hr-system-design](skills/hr-system-design) | System design interview loops (cross-discipline) |
| [hr-software-architecture](skills/hr-software-architecture) | Software architect / staff / principal engineer |
| [hr-blockchain](skills/hr-blockchain) | Blockchain / Web3 engineering |
| [hr-embedded](skills/hr-embedded) | Embedded systems, firmware, RTOS |
| [hr-iot](skills/hr-iot) | IoT engineering |
| [hr-ar-vr](skills/hr-ar-vr) | AR/VR and spatial computing |
| [hr-game-development](skills/hr-game-development) | Game engineering, design, and art |

## Notes

- All skills in this library are authored by Tuan Duc Tran, v1.0.0 unless
  otherwise noted.
- The router itself carries no HR opinions — it only classifies and points.
  All actual guidance lives in the target skill.
- If a request spans more than three skills, say so and ask the user to
  prioritize rather than silently loading everything.
