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
| [hr-candidate-assessment](skills/hr-candidate-assessment) | asked to "design a candidate assessment", "build a skills test for [role]", "create an assessment center", "build a scoring rubric", or "choose the right assessment method for this role" |
| [hr-candidate-experience](skills/hr-candidate-experience) | asked to "improve candidate experience", "map the candidate journey", "reduce candidate drop-off", "design interview feedback", "create a candidate communication plan", or "measure candidate satisfaction" |
| [hr-candidate-sourcing](skills/hr-candidate-sourcing) | asked to source candidates, build a talent pipeline, write a Boolean search string, find passive candidates, draft an outreach message, or similar sourcing tasks |
| [hr-contingent-workforce](skills/hr-contingent-workforce) | asked to set up a contingent workforce program, classify a worker as contractor or employee, manage a VMS/MSP program, draft a statement of work, or similar contingent workforce tasks |
| [hr-demand-planning](skills/hr-demand-planning) | asked to "build a headcount plan", "forecast short-term hiring demand", "model workforce demand", "align HR capacity with business growth", "create a staffing demand forecast", or "plan headcount for [department or product launch]" |
| [hr-employer-branding](skills/hr-employer-branding) | asked to "design an employer brand strategy", "build an EVP", "write a careers page", "design a candidate experience journey", "run an employer brand audit", "respond to a Glassdoor/employer reputation crisis", "measure employer brand health", "build an employee advocacy / referral content program", or any employer branding, talent attraction, or recruitment marketing task |
| [hr-executive-assessment](skills/hr-executive-assessment) | asked to "assess an executive candidate", "design a leadership assessment for a C-suite hire", "evaluate executive readiness", "build a board-level candidate evaluation", or "assess derailment risk for a leadership hire" |
| [hr-executive-search](skills/hr-executive-search) | asked to run an executive search, write an executive search brief, assess a C-suite candidate, plan CEO succession, or similar executive search tasks |
| [hr-interviewing](skills/hr-interviewing) | asked to "design structured interview questions or scoring rubrics", "design a structured interview", "generate behavioral questions", "build an interview scorecard", "evaluate candidates consistently", "reduce interview bias", or any interview planning and assessment task |
| [hr-job-analysis](skills/hr-job-analysis) | asked to "conduct a job analysis", "define job requirements", "write job content", "classify a role", "evaluate job complexity", "run a task analysis", or "audit our job structures" |
| [hr-job-description](skills/hr-job-description) | asked to "write a job description", "rewrite a JD", "create a job posting", "improve hiring requirements", "define responsibilities", "write hiring criteria", or any job description and recruitment marketing task |
| [hr-market-mapping](skills/hr-market-mapping) | asked to "map the talent market", "build a market map for [role/industry]", "identify competitor talent pools", "size the addressable talent market", or "research org charts at target companies" |
| [hr-offer-management](skills/hr-offer-management) | asked to "build an offer package", "manage the offer approval process", "handle a counteroffer", "negotiate salary with a candidate", or "track offer status across open roles" |
| [hr-passive-candidate-engagement](skills/hr-passive-candidate-engagement) | asked to "write an outreach message to a passive candidate", "engage someone who isn't looking", "build a nurture sequence", "re-engage a cold lead", or "start a conversation without pitching a job first" |
| [hr-recruiting](skills/hr-recruiting) | asked to write or improve a job description for a role, create interview questions, screen resumes, develop employer branding, send offer letters, conduct reference checks, or any other recruiting and hiring task |
| [hr-recruitment-marketing](skills/hr-recruitment-marketing) | asked to "plan a recruitment marketing campaign", "write job ad copy that converts", "build a careers content calendar", "run a hiring campaign on [channel]", or "measure recruitment marketing ROI" |
| [hr-recruitment-operations](skills/hr-recruitment-operations) | asked to "design our requisition approval workflow", "build recruiting SLAs", "set up ATS stages and workflows", "audit our recruiting process for bottlenecks", or "build a recruiting operations dashboard" |
| [hr-reference-checking](skills/hr-reference-checking) | asked to "design reference check questions", "conduct a reference call for [candidate]", "write a reference check template", "handle a mixed or negative reference", or "verify employment history" |
| [hr-retained-search](skills/hr-retained-search) | asked to "structure a retained search engagement", "write a retained search agreement", "build a candidate slate for a retained search", or "manage a retained search timeline" |
| [hr-search-strategy](skills/hr-search-strategy) | asked to "build a search strategy for [role]", "plan a search before we start sourcing", "define the search brief", or "decide which channels to prioritize for this search" |
| [hr-social-recruiting](skills/hr-social-recruiting) | asked to "recruit on LinkedIn", "hire through Facebook groups", "avoid LinkedIn spam", "write recruiter outreach messages", "source passive candidates", "build employer branding on social media", "increase recruiter response rates", or any social recruiting, online sourcing, or community recruiting task |
| [hr-talent-acquisition](skills/hr-talent-acquisition) | asked to build a TA strategy, design a talent pipeline, improve time-to-hire, set up ATS workflows, measure recruiting effectiveness, build sourcing channels, or align hiring with business demand |
| [hr-talent-crm](skills/hr-talent-crm) | asked to "set up a talent CRM", "segment our talent pool", "build a nurture campaign in our CRM", "design talent community engagement", or "improve our silver medalist re-engagement process" |
| [hr-talent-intelligence](skills/hr-talent-intelligence) | asked to analyze talent market trends, benchmark compensation to the market, build workforce analytics, develop people analytics dashboards, conduct competitive talent intelligence, or similar talent data and analytics tasks |
| [hr-talent-mapping](skills/hr-talent-mapping) | asked to "map talent against future roles", "build a bench for [role]", "track external talent for succession", "create a talent pipeline map", or "identify named candidates for a future opening" |
| [hr-talent-supply-chain](skills/hr-talent-supply-chain) | asked to "build our talent supply chain", "analyze talent supply for [role]", "design a build vs |

### Onboarding, offboarding & people operations

| Skill | Use when the task involves... |
|---|---|
| [hr-employee-lifecycle](skills/hr-employee-lifecycle) | asked to map the employee journey, improve the employee experience, design touchpoints across the lifecycle, create lifecycle frameworks, or similar end-to-end people management tasks |
| [hr-employee-self-service](skills/hr-employee-self-service) | asked to "build an employee self-service portal", "design an HR chatbot", "create an HR knowledge base", "reduce HR inquiry volume", or "improve employee access to HR information" |
| [hr-hr-coordination](skills/hr-hr-coordination) | asked to "coordinate HR activities", "manage HR logistics", "support HR projects", "schedule HR programs", or "handle HR admin tasks" |
| [hr-hr-management](skills/hr-hr-management) | asked to "manage the HR team", "build the HR department", "set HR team goals", "plan the HR budget", "improve HR function effectiveness", or "lead the HR organization" |
| [hr-offboarding](skills/hr-offboarding) | asked to create an offboarding checklist, conduct exit interviews, manage employee separations, handle involuntary terminations, build an alumni program, or similar departure management tasks |
| [hr-onboarding](skills/hr-onboarding) | asked to "create an onboarding plan", "design orientation programs", "build a buddy system", "write onboarding checklists", "conduct exit interviews", "manage knowledge transfer", "create offboarding processes", or any employee onboarding or offboarding task |
| [hr-operating-model](skills/hr-operating-model) | asked to "redesign our HR function", "define HRBP accountabilities", "build a CoE", "set up shared services", "clarify HR roles", "assess our HR operating model", or "move to a three-pillar HR model" |
| [hr-people-operations](skills/hr-people-operations) | asked to "design an onboarding workflow", "set up an HRIS", "build an offboarding checklist", "create an employee handbook", "audit HR data quality", "design a people ops process", "automate HR ops workflows and processes", "manage employee lifecycle transitions", "build an HR service delivery model", or any operational, administrative, and systems-focused HR task |
| [hr-service-delivery](skills/hr-service-delivery) | asked to design an HR service delivery model, set up HR tier 1/2/3 support, write an HR SLA, design an HR case management workflow, or similar HR service delivery tasks |
| [hr-shared-services](skills/hr-shared-services) | asked to design an HR shared services model, consolidate HR functions, build a shared services governance model, allocate shared services costs, or similar HR shared services tasks |
| [hr-vendor-management](skills/hr-vendor-management) | asked to "select an HR vendor", "evaluate vendors for [HR tool/service]", "manage our HR vendor relationships", "negotiate an HR vendor contract", or "consolidate our HR vendor stack" |

### Performance, talent & career management

| Skill | Use when the task involves... |
|---|---|
| [hr-business-partner](skills/hr-business-partner) | asked to "act as an HR business partner", "advise this manager on a people issue", "build a performance improvement plan", "design a workforce plan", "handle an employee relations case", "coach a manager through a difficult conversation", "diagnose team dysfunction", "prepare talent review or succession planning input", or any task where HR needs to operate as a strategic partner embedded with a business leader or team rather than as a centralized HR function |
| [hr-career-development](skills/hr-career-development) | asked to create career paths, build individual development plans, design career ladders, run career development conversations, develop career frameworks, or similar career growth tasks |
| [hr-coaching-mentoring](skills/hr-coaching-mentoring) | asked to build a coaching culture, create a mentoring program, develop manager coaching skills, design coaching frameworks, run coaching sessions, or similar coaching and mentoring tasks |
| [hr-competency-management](skills/hr-competency-management) | asked to "build a competency framework", "define behavioral indicators", "create a competency library", "apply competencies to hiring", "assess competencies", "update our competency model", or "integrate competencies into performance reviews" |
| [hr-manager-effectiveness](skills/hr-manager-effectiveness) | asked to "assess manager effectiveness", "improve manager quality", "build a manager effectiveness program", "measure people manager performance", "run a manager 360", "identify underperforming managers", or "develop our management population" |
| [hr-people-leadership](skills/hr-people-leadership) | asked to develop people leadership skills, coach a manager, improve team leadership, build a leadership culture, give feedback to a manager, or assess people leadership effectiveness |
| [hr-performance-management](skills/hr-performance-management) | asked to design a performance management process or write review frameworks, create a PIP, design performance appraisal forms, set employee goals, conduct 360-degree feedback, develop performance metrics, or any other performance management task |
| [hr-performance-review](skills/hr-performance-review) | asked to write or calibrate an individual performance review, draft manager feedback, evaluate employee performance, write appraisal comments, create a development plan, review employee goals, or any employee performance evaluation task |
| [hr-succession-planning](skills/hr-succession-planning) | asked to "build a succession plan or bench strength framework", "identify high-potential talent", "assess leadership readiness", "map critical roles", "design a talent review or succession review process", "run a 9-box calibration", "build a leadership pipeline", "create a development plan for a successor", or any succession planning, leadership continuity, and pipeline development task |
| [hr-talent-management](skills/hr-talent-management) | asked to "build a succession planning component within talent management", "design a performance management framework", "identify high potential employees", "create a career path", "build a competency model", "improve internal mobility", "design a talent management review and calibration process", "measure employee engagement", "develop a retention strategy", "run a 9-box assessment", or any talent development and workforce planning task |

### Compensation, benefits & rewards

| Skill | Use when the task involves... |
|---|---|
| [hr-compensation-benefits](skills/hr-compensation-benefits) | asked to "analyze compensation data", "design a bonus plan", "create benefits programs", "conduct a job evaluation", "write a compensation philosophy", "calculate pay rates", "develop retention strategies", or any compensation and benefits task |
| [hr-job-architecture](skills/hr-job-architecture) | asked to "build a job leveling framework", "design a career ladder", "create job families", "define leveling criteria", "audit our job titles", "build a career path", "standardize roles across teams", "design a grade structure", "benchmark roles against the market", or any job architecture, career leveling, and role standardization task |
| [hr-recognition](skills/hr-recognition) | asked to create a recognition program, build a rewards strategy, design peer recognition, improve appreciation culture, develop service awards, or similar recognition and reward tasks |
| [hr-retirement-benefits](skills/hr-retirement-benefits) | asked to "design our retirement benefit offering", "explain 401(k)/pension options to employees", "compare retirement plan providers", "communicate a retirement plan change", or "help an employee understand their retirement benefits" |
| [hr-salary-benchmarking](skills/hr-salary-benchmarking) | asked to "benchmark salaries for [role]", "compare our pay against market data", "build salary ranges from market data", "assess whether we're paying competitively", or "choose salary survey data sources" |
| [hr-total-rewards](skills/hr-total-rewards) | asked to "design a compensation structure", "build a salary band", "run a pay equity analysis", "design a benefits package", "create a total rewards statement", "benchmark compensation against market", "design an incentive plan", "build a job leveling framework for total rewards and pay equity", "calculate compa-ratio", or any compensation, benefits, and total rewards task |

### Learning & development

| Skill | Use when the task involves... |
|---|---|
| [hr-leadership-development](skills/hr-leadership-development) | asked to create a leadership program, develop leadership competencies, conduct leadership assessments, design executive coaching, create a leadership succession plan, develop cross-cultural leadership training, or any leadership development task |
| [hr-learning-development](skills/hr-learning-development) | asked to design a learning program, run a skills gap analysis for learning program design, build a career development framework, design a leadership development track, build an onboarding program, respond to a capability gap crisis, measure L&D effectiveness, design a learning culture strategy, or any employee learning, skills development, or talent capability task |
| [hr-learning-strategy](skills/hr-learning-strategy) | asked to "build a learning strategy", "design our L&D ecosystem", "align learning with business priorities", "evaluate our learning investment", "shift to skills-based learning", or "create a learning culture" |
| [hr-skills-management](skills/hr-skills-management) | asked to create a skills framework, build a skills taxonomy, identify skills gaps, design skills-based hiring, develop a skills inventory, or similar skills management tasks |
| [hr-skills-taxonomy](skills/hr-skills-taxonomy) | asked to "build a skills taxonomy", "map skills to roles", "design a skills ontology", "run a skills gap analysis against a skills taxonomy", "create a skills inventory", "build a skills-based hiring framework", "design skills clusters", "connect skills to career paths", "benchmark workforce skills against market data", or any skills classification, skills-based workforce planning, and organizational skills intelligence task |
| [hr-training-development](skills/hr-training-development) | asked to design a training program, create an e-learning course, develop a coaching plan, conduct a needs assessment, write a competency model, design a mentorship program, create a learning plan, or any training and development task |
| [hr-workforce-capability](skills/hr-workforce-capability) | asked to "build workforce capability", "close a capability gap", "assess our workforce skills", "design a capability building program", "create a capability heat map", "identify critical capabilities", or "develop a reskilling strategy" |

### Organizational development, design & change

| Skill | Use when the task involves... |
|---|---|
| [hr-change-communication](skills/hr-change-communication) | asked to "communicate an org change", "write a change announcement", "build a change communication strategy or plan", "design stakeholder messaging", "prepare employees for a restructuring", or "communicate a new HR policy or program" |
| [hr-change-management](skills/hr-change-management) | asked to "design a change management plan", "advise leadership on change communication", "build a stakeholder engagement strategy", "create a change readiness assessment", "design training and enablement for change adoption", "measure change success", or any task where HR needs to guide leaders and employees through organizational change |
| [hr-consulting](skills/hr-consulting) | asked to "advise a business leader on a people issue", "build an HR business case", "consult on an org problem", "run an HR diagnostic", or "position HR as a strategic advisor" |
| [hr-crisis-management](skills/hr-crisis-management) | asked to "build a crisis response plan for HR", "respond to a workplace incident", "communicate during a crisis", "plan for business continuity from an HR perspective", or "handle a sudden leadership departure crisis" |
| [hr-design-thinking](skills/hr-design-thinking) | asked to "apply design thinking to HR", "run an HR design sprint", "apply design thinking to map the employee journey", "co-design an HR solution", "prototype an HR process", or "use human-centered design for HR" |
| [hr-ma-integration-by-country](skills/hr-ma-integration-by-country) | asked to "what labor law applies to this M&A integration in [country]", "compare works council requirements across our merger markets", "plan country-specific integration steps for [US/EU/India]", or "identify country-level people risks in this cross-border deal" |
| [hr-mergers-acquisitions](skills/hr-mergers-acquisitions) | asked to "conduct HR due diligence for an acquisition", "assess culture fit before a merger", "plan workforce implications of a deal", "build an M&A HR integration plan", or "identify people risks in this transaction" |
| [hr-organization-effectiveness](skills/hr-organization-effectiveness) | asked to "assess org effectiveness", "diagnose team performance issues", "improve org health", "run an OE diagnostic", "evaluate our operating model", or "measure organizational capability" |
| [hr-organizational-design](skills/hr-organizational-design) | asked to redesign the org structure, build an operating model, plan a restructuring, define spans and layers, create RACI charts, or similar organizational design tasks |
| [hr-organizational-development](skills/hr-organizational-development) | asked to redesign our org structure, lead a change management plan, run a culture assessment, design a reorganization, develop OD communication and engagement plans, assess organizational health, facilitate a team effectiveness session, design a merger integration plan, or any organizational design, change, and culture task |
| [hr-post-merger-integration](skills/hr-post-merger-integration) | asked to "plan post-merger HR integration", "harmonize two organizations after a merger", "integrate compensation and benefits post-close", "manage culture integration after an acquisition", or "retain talent through post-merger transition" |
| [hr-strategic-planning](skills/hr-strategic-planning) | asked to create an HR strategy, align HR with business goals, build an HR roadmap, develop workforce planning, write an HR annual plan, or similar strategic HR planning tasks |
| [hr-workforce-transformation](skills/hr-workforce-transformation) | asked to plan a workforce transformation, design a reskilling program, assess automation impact on jobs, build a restructuring plan, or similar workforce transformation tasks |

### Workforce planning & analytics

| Skill | Use when the task involves... |
|---|---|
| [hr-analytics](skills/hr-analytics) | asked to analyze employee data, create HR metrics, build an HR dashboard, analyze turnover data, develop HR reports, build predictive analytics models, create a data governance strategy, or any HR data and analytics task |
| [hr-kpi](skills/hr-kpi) | asked to build an HR KPI dashboard, choose strategic HR KPIs, analyze turnover rate, benchmark cost per hire, explain HR metrics, create an HR report for leadership, measure training ROI, track recruiting efficiency, interpret HR data, or any HR performance measurement and workforce analytics task |
| [hr-organization-network-analysis](skills/hr-organization-network-analysis) | asked to "run an organizational network analysis", "identify hidden influencers", "find collaboration bottlenecks", "map informal networks", or "analyze who really drives collaboration in this team" |
| [hr-people-budgeting](skills/hr-people-budgeting) | asked to "build the people budget", "model headcount by cost center", "explain budget variance to finance", "plan the HR budget for next fiscal year", or "reconcile actual headcount spend against plan" |
| [hr-predictive-analytics](skills/hr-predictive-analytics) | asked to "build an attrition prediction model", "predict which employees are flight risks", "identify predictors of hiring success", "build a predictive people analytics model", or "interpret this predictive model's results for HR" |
| [hr-skills-intelligence](skills/hr-skills-intelligence) | asked to "analyze our skills data", "identify emerging skills we're missing", "build a skills intelligence dashboard", "forecast future skill demand", or "benchmark our skills against the market" |
| [hr-strategic-workforce-planning](skills/hr-strategic-workforce-planning) | asked to "build a strategic workforce plan", "translate our 5-year business strategy into workforce needs", "identify future critical roles", or "align workforce planning with business strategy" |
| [hr-time-attendance](skills/hr-time-attendance) | asked to set up a time tracking policy, calculate overtime, design a shift attendance policy, write a lateness policy, or similar time and attendance tasks |
| [hr-workforce-economics](skills/hr-workforce-economics) | asked to "model the cost of this workforce decision", "calculate fully loaded labor cost", "build a business case for headcount", "analyze workforce productivity economics", or "compare the cost of hiring vs |
| [hr-workforce-forecasting](skills/hr-workforce-forecasting) | asked to "forecast headcount for next year", "predict attrition trends", "build a hiring demand forecast", "model seasonal staffing needs", or "improve the accuracy of our workforce forecast" |
| [hr-workforce-intelligence](skills/hr-workforce-intelligence) | asked to analyze headcount trends, predict attrition risk, build a workforce dashboard, run a skills inventory analysis, or similar workforce intelligence tasks |
| [hr-workforce-planning](skills/hr-workforce-planning) | asked to "create a workforce plan", "conduct a skills gap analysis", "develop a succession plan", "build workforce models", "analyze headcount", "forecast long-term workforce needs", "develop workforce diversity strategies", or any workforce planning task |
| [hr-workforce-scenario-planning](skills/hr-workforce-scenario-planning) | asked to "build workforce scenarios", "model a best/worst case headcount plan", "stress-test our workforce plan against [risk]", "plan for a hiring freeze or rapid growth scenario", or "run scenario planning for restructuring" |
| [hr-workforce-scheduling](skills/hr-workforce-scheduling) | asked to build a shift schedule, forecast staffing needs, create a rotation pattern, handle a shift swap request, or similar workforce scheduling tasks |

### HR technology, data & AI

| Skill | Use when the task involves... |
|---|---|
| [hr-agentic-ai](skills/hr-agentic-ai) | asked to "use AI agents for HR", "build an HR automation agent", "govern agentic AI in HR", "design multi-agent HR workflows", or "evaluate autonomous AI for HR processes" |
| [hr-ai-adoption](skills/hr-ai-adoption) | asked to "drive AI adoption in HR", "get our team to actually use this AI tool", "build an AI adoption strategy for employees", "measure AI tool usage and impact", or "overcome resistance to AI tools in HR" |
| [hr-ai-change-management](skills/hr-ai-change-management) | asked to "manage AI adoption", "prepare employees for AI", "handle AI resistance", "communicate AI changes", "build AI readiness", or "lead the people side of AI transformation" |
| [hr-ai-ethics](skills/hr-ai-ethics) | asked to "audit AI bias in hiring", "design ethical AI guidelines for HR", "assess algorithmic fairness", "build an AI ethics policy", "govern AI use in performance management", or "address bias in our AI tools" |
| [hr-ai-evaluation](skills/hr-ai-evaluation) | asked to "evaluate an AI vendor for HR", "build an AI tool evaluation framework", "assess this AI tool for bias risk", "compare AI vendors for [HR use case]", or "pilot an AI tool before rolling it out" |
| [hr-ai-governance](skills/hr-ai-governance) | asked to design an AI governance policy for HR, assess bias risk in a hiring algorithm, write an AI use policy for HR, audit an HR AI tool, or similar HR AI governance tasks |
| [hr-ai-privacy](skills/hr-ai-privacy) | asked to "protect employee data in AI systems", "design HR AI privacy policies", "assess privacy risks of AI tools", "build employee consent for AI", "comply with GDPR for HR AI", or "audit HR data privacy" |
| [hr-automation](skills/hr-automation) | asked to automate HR processes, build HR workflows, reduce HR admin work, implement HRIS automation, use AI in HR, or similar HR automation tasks |
| [hr-chatbot-design](skills/hr-chatbot-design) | asked to "design an HR chatbot", "build a Slack bot for HR questions", "plan a Teams HR assistant", "write conversation flows for an HR bot", or "decide what an HR bot should and shouldn't handle" |
| [hr-digital-hr](skills/hr-digital-hr) | asked to "digitize HR processes", "build our HR tech stack", "improve digital employee experience", "automate HR workflows as part of digital transformation", "implement an HRIS as part of digital HR transformation", or "create a digital HR roadmap" |
| [hr-genai](skills/hr-genai) | asked to "use generative AI for HR", "write HR content with AI", "use ChatGPT for HR", "generate HR documents with AI", "automate HR writing", or "apply GenAI to recruiting, performance, or learning" |
| [hr-hris](skills/hr-hris) | asked to "explain HRIS", "choose an HRIS platform", "implement or migrate an HRIS", "screen HRIS analysts or managers", "understand HR system integrations", "configure HRIS to automate HR workflows", "evaluate HRIS vendors", or any HR technology and systems task |
| [hr-knowledge-management](skills/hr-knowledge-management) | asked to "build an HR knowledge base", "organize HR documentation", "reduce HR ticket volume", "write HR policies and SOPs", "capture tribal knowledge", "screen a Knowledge Manager or HR documentation specialist", "set up an employee self-service FAQ or chatbot", or any HR content, documentation, or institutional knowledge task |
| [hr-prompt-engineering](skills/hr-prompt-engineering) | asked to "write better AI prompts", "improve my prompt for HR tasks", "learn prompt engineering for HR", "get better ChatGPT outputs", "design prompts for recruiting or performance", or "build a prompt library for the HR team" |
| [hr-system-integration](skills/hr-system-integration) | asked to "integrate our HRIS with [system]", "plan a system integration for HR tools", "fix data sync issues between systems", "design an HR tech integration architecture", or "audit our HR system integrations" |
| [hr-technology](skills/hr-technology) | asked to "evaluate HR systems", "implement an HRIS", "create an HR technology roadmap", "select an ATS", "develop HR chatbots", "manage HR automation", "write an HR technology RFP", or any HR technology task |

### Compliance, labor relations & risk

| Skill | Use when the task involves... |
|---|---|
| [hr-accessibility-accommodation](skills/hr-accessibility-accommodation) | asked to "design an accommodation request process", "handle a disability accommodation request", "make our hiring process more accessible", "audit our workplace for accessibility", or "train managers on supporting accommodations" |
| [hr-audit](skills/hr-audit) | asked to conduct an HR audit, audit HR compliance, review personnel files for compliance, build an HR audit checklist, or similar HR audit tasks |
| [hr-compliance](skills/hr-compliance) | asked to "write an employee handbook", "develop OSHA compliance", "manage EEO compliance", "handle FMLA", "conduct a compliance audit", "create background check policies", "develop immigration compliance strategies", or any HR compliance task |
| [hr-conflict-resolution](skills/hr-conflict-resolution) | asked to "resolve a workplace conflict", "mediate between employees", "facilitate a difficult conversation", "develop conflict resolution training", "address a team dispute", "create a conflict resolution policy", or any workplace conflict task |
| [hr-employee-relations](skills/hr-employee-relations) | asked to "handle a grievance", "conduct an exit interview", "manage workplace investigations", "create a remote work policy", "write employee contracts", "manage accommodations", "conduct satisfaction surveys", or any employee relations task |
| [hr-immigration](skills/hr-immigration) | asked to sponsor a work visa, plan a global mobility relocation, track visa expiration compliance, draft an immigration policy, or similar HR immigration tasks |
| [hr-labor-relations](skills/hr-labor-relations) | asked to "manage a union organizing campaign", "prepare for collective bargaining", "design a grievance process", "respond to a labor dispute", "build an employment law compliance framework", "design a disciplinary and termination process", "respond to a workplace investigation", "draft a workforce policy", or any labor relations, employee relations, or employment compliance task |
| [hr-payroll](skills/hr-payroll) | asked to "set up a payroll process", "run a payroll compliance audit", "design a payroll calendar", "handle a payroll discrepancy", "build a payroll onboarding checklist", "calculate overtime and statutory deductions", "design a multi-country payroll process", or any payroll administration, compliance, and operations task |
| [hr-policy-management](skills/hr-policy-management) | asked to write an HR policy, update the employee handbook, create a disciplinary policy, review HR policies, develop workplace guidelines, or similar policy management tasks |
| [hr-risk-management](skills/hr-risk-management) | asked to identify HR risks, build an HR risk register, manage compliance risk, develop HR risk mitigation plans, handle employee relations risks, or similar HR risk management tasks |

### Culture, engagement, experience & wellbeing

| Skill | Use when the task involves... |
|---|---|
| [hr-culture](skills/hr-culture) | asked to "explain company culture", "assess culture fit", "build a strong workplace culture", "write culture-related job description content", "evaluate culture add vs culture fit", "diagnose culture problems", "design culture interview questions", "improve employee engagement through culture", or any organizational culture, values, and workplace environment task |
| [hr-diversity-inclusion](skills/hr-diversity-inclusion) | asked to "develop a diversity and inclusion strategy", "create inclusive job descriptions", "conduct unconscious bias training", "build employee resource groups", "measure diversity metrics", "develop a DEI scorecard", or any diversity and inclusion task |
| [hr-employee-communications](skills/hr-employee-communications) | asked to "write an internal announcement", "plan our internal communications calendar", "draft a policy change communication", "write a sensitive HR message", or "improve how we communicate HR updates to employees" |
| [hr-employee-engagement](skills/hr-employee-engagement) | asked to improve employee engagement, design recognition programs, conduct engagement surveys, boost employee morale, reduce burnout, develop a culture strategy, create team-building activities, or any employee engagement task |
| [hr-employee-experience](skills/hr-employee-experience) | asked to design an employee experience strategy, map the employee journey, run an engagement diagnostic, design a culture program, improve the onboarding experience, build a recognition program, design a belonging and inclusion experience, respond to an engagement crisis, measure employee experience health, or any employee experience, engagement, or culture design task |
| [hr-employee-journey-mapping](skills/hr-employee-journey-mapping) | asked to "map the employee journey", "build a journey map for [stage]", "identify moments that matter", "find friction points in the employee experience", or "redesign a specific stage of the employee lifecycle" |
| [hr-employee-listening](skills/hr-employee-listening) | asked to run an employee survey, design an engagement program, analyze survey results, build a listening strategy, conduct focus groups, or similar employee feedback tasks |
| [hr-future-of-work](skills/hr-future-of-work) | asked to design a hybrid work policy, analyze future of work trends, assess AIs impact on jobs, design a flexible work model, or similar future-of-work tasks |
| [hr-internal-mobility](skills/hr-internal-mobility) | asked to build an internal mobility program, create internal job posting processes, manage internal transfers, design talent marketplace, or similar internal talent movement tasks |
| [hr-wellbeing](skills/hr-wellbeing) | asked to "design a wellbeing program", "run a burnout risk assessment", "build a mental health support plan", "design a flexible work policy", "respond to a wellbeing crisis", "measure employee wellbeing", "design a return-to-work plan after burnout leave", or any employee wellbeing, mental health, and work-life balance task |

### Project management & global/local context

| Skill | Use when the task involves... |
|---|---|
| [hr-global-expansion](skills/hr-global-expansion) | asked to "plan HR for entering [country]", "decide between entity setup and EOR for a new market", "build an HR readiness plan for expansion", "assess labor law requirements for [country]", or "hire our first employees in a new market" |
| [hr-global-hr](skills/hr-global-hr) | asked to hire internationally, manage global HR compliance, build a global people strategy, handle expat management, expand HR to new countries, or similar global HR tasks |
| [hr-project-management](skills/hr-project-management) | asked to build a project plan for an HR initiative, create a project charter, track HR project risks, build a stakeholder communication plan, or similar HR project management tasks |
| [hr-vietnam-context](skills/hr-vietnam-context) | you need to navigate Vietnam employment law, onboard foreign staff, handle disciplinary procedures under Vietnamese law, or adapt global HR practices for the Vietnam market |

### Software-engineering & technical hiring specialists

Use these together with [hr-recruiting](skills/hr-recruiting), [hr-job-description](skills/hr-job-description), or [hr-interviewing](skills/hr-interviewing)
when the role being hired is technical.

| Skill | Use when the task involves... |
|---|---|
| [hr-ai](skills/hr-ai) | asked to "explain AI engineering", "screen AI engineers", "understand machine learning roles", "compare AI and data science", "evaluate AI skills", "create AI interview questions", "understand LLM systems", or any AI and machine learning hiring and recruiting task |
| [hr-ar-vr](skills/hr-ar-vr) | asked to write an AR/VR engineer job description, create a spatial computing interview, assess an AR/VR candidates portfolio, build an AR/VR role leveling framework, or similar AR/VR hiring tasks |
| [hr-backend](skills/hr-backend) | asked to "explain backend development", "screen backend candidates", "understand APIs and databases", "compare backend frameworks", "evaluate backend skills", "create backend interview questions", "understand microservices", "understand cloud backend systems", or any backend hiring and recruiting task |
| [hr-blockchain](skills/hr-blockchain) | asked to write a blockchain engineer job description, create smart contract interview questions, assess a Web3 candidate, build a blockchain role leveling framework, or similar blockchain-hiring tasks |
| [hr-cloud](skills/hr-cloud) | asked to write a cloud engineer job description, create cloud interview questions, assess a cloud candidates skills, build a cloud role leveling framework, or similar cloud-hiring tasks |
| [hr-data](skills/hr-data) | asked to "explain data roles", "screen data engineers or data scientists", "understand analytics workflows", "compare data engineering and data science", "evaluate data skills", "create data interview questions", "understand AI and machine learning teams", or any data and analytics hiring and recruiting task |
| [hr-devops](skills/hr-devops) | asked to "explain DevOps", "screen DevOps candidates", "understand CI/CD", "compare DevOps and SRE", "evaluate infrastructure skills", "create DevOps interview questions", "understand cloud systems", or any DevOps hiring and recruiting task |
| [hr-embedded](skills/hr-embedded) | asked to write an embedded engineer job description, create firmware interview questions, assess an embedded candidate, build an embedded engineering leveling framework, or similar embedded-hiring tasks |
| [hr-frontend](skills/hr-frontend) | asked to "explain frontend development", "screen frontend candidates", "understand React/Vue/Angular", "compare frontend frameworks", "evaluate frontend skills", "create frontend interview questions", "understand frontend architecture", or any frontend hiring and recruiting task |
| [hr-fullstack](skills/hr-fullstack) | asked to "explain fullstack development", "screen fullstack candidates", "understand frontend and backend together", "evaluate fullstack skills", "compare fullstack stacks", "create fullstack interview questions", "understand end-to-end product engineering", or any fullstack hiring and recruiting task |
| [hr-game-development](skills/hr-game-development) | asked to write a game developer job description, create a gameplay engineer interview, assess a game designers portfolio, build a game studio leveling framework, or similar game-development hiring tasks |
| [hr-iot](skills/hr-iot) | asked to write an IoT engineer job description, create IoT interview questions, assess an IoT candidates skills across the stack, build an IoT engineering leveling framework, or similar IoT-hiring tasks |
| [hr-mobile](skills/hr-mobile) | asked to "explain mobile development", "screen mobile developers", "understand React Native or Flutter", "compare native and cross-platform development", "evaluate mobile skills", "create mobile interview questions", "understand iOS and Android workflows", or any mobile engineering hiring and recruiting task |
| [hr-product-management](skills/hr-product-management) | asked to write a product manager job description, create a PM case study interview, assess product sense, build a PM leveling framework, or similar product management hiring tasks |
| [hr-qa](skills/hr-qa) | asked to "explain QA testing", "screen QA candidates", "understand automation testing", "compare manual QA and SDET", "evaluate QA skills", "create QA interview questions", "understand software testing workflows", or any QA hiring and recruiting task |
| [hr-security](skills/hr-security) | asked to "explain cybersecurity", "screen security engineers", "understand SOC or AppSec", "compare security roles", "evaluate cybersecurity skills", "create security interview questions", "understand modern security systems", or any cybersecurity hiring and recruiting task |
| [hr-software-architecture](skills/hr-software-architecture) | asked to write a software architect job description, assess architecture leadership skills, design a principal engineer interview loop, build an architecture role leveling framework |
| [hr-system-design](skills/hr-system-design) | asked to create a system design interview, evaluate a candidates system design skills, write a system design interview rubric, prepare interviewers for system design rounds |
| [hr-uiux](skills/hr-uiux) | asked to "explain UI/UX", "screen product designers", "understand UX research", "compare UI and UX", "evaluate design portfolios", "create UI/UX interview questions", "understand product design workflows", or any design hiring and recruiting task |

## Notes

- All skills in this library are authored by Tuan Duc Tran, v1.0.0 unless
  otherwise noted.
- The router itself carries no HR opinions — it only classifies and points.
  All actual guidance lives in the target skill.
- If a request spans more than three skills, say so and ask the user to
  prioritize rather than silently loading everything.
