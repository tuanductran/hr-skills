---
title: Hiring a Senior Backend Engineer
reference: hr-backend
---

# Example: Hiring a Senior Backend Engineer

## Context

You are an HR Manager at a B2B SaaS startup building a workforce management platform. The CTO needs to hire **1 Senior Backend Engineer** to own the API layer, redesign the database schema for multi-tenancy, and help migrate the monolith toward a microservices architecture. You have no technical background and need end-to-end support throughout the hiring process.

## Step 1 — Translating Technical Requirements from the CTO

**Sample prompt:**

> "Our CTO says we need a Senior Backend who understands multi-tenancy, microservices, and can work with PostgreSQL and Redis. How do I explain what we actually need without getting lost?"

**Expected skill response:**

- **Multi-tenancy** = the system needs to serve multiple business clients from a single codebase while keeping each client's data completely separate and secure — think of it like apartments in one building, each with their own locked unit
- **Microservices** = instead of one large application doing everything, the system is split into smaller independent services (e.g., one for billing, one for notifications, one for user management) — easier to scale and maintain separately
- **PostgreSQL** = the primary relational database — stores structured, business-critical data like user accounts, billing records, and tenant configurations
- **Redis** = an in-memory data store used for caching (making repeat operations faster) and session management — not for permanent storage
- The CTO is looking for someone who has operated real production systems at this level, not just someone who has read about these concepts

## Step 2 — Writing the Job Description

**Sample prompt:**

> "Write a JD for a Senior Backend Engineer at a B2B SaaS startup. Requirements: Node.js, TypeScript, PostgreSQL, Redis, microservices experience. 8-person engineering team. Product is a workforce management platform."

**Sample JD generated:**

```txt
Senior Backend Engineer — B2B SaaS Startup

About us:
[Company] is a workforce management platform used by operations teams across
Southeast Asia. We are an 8-person engineering team shipping fast, with a
strong focus on reliability, data integrity, and API quality.

What you will do:
- Own the design and development of our core API layer
- Lead the database schema redesign for multi-tenant architecture
- Incrementally migrate monolith components to independent services
- Design and maintain integration points with third-party payroll and HR systems
- Establish backend coding standards and review practices for the team
- Mentor mid-level engineers on system design and production best practices

Requirements:
- 4+ years of backend experience, with ownership of production systems
- Strong proficiency in Node.js and TypeScript (NestJS preferred)
- Deep experience with PostgreSQL — schema design, indexing, query optimization
- Experience with Redis for caching and session management
- Understanding of microservices and API design principles
- Familiarity with Docker and cloud deployment (AWS or GCP)

Nice to have:
- Experience designing multi-tenant SaaS architectures
- Event-driven system experience (Kafka or RabbitMQ)
- Background in HR-tech, fintech, or enterprise SaaS
- Experience with Prisma or TypeORM

Compensation: Competitive + equity

Not a fit if:
- You have only built CRUD APIs without ownership of architecture decisions
- You are not comfortable working across database design, API layer, and deployment
```

**Skill note:**

> ⚠️ Avoid combining Backend + DevOps + Data Engineering + Cloud Architecture + Security into a single JD. Each of these is a separate career track. Stacking them signals the role is poorly defined and will drive senior candidates away.

## Step 3 — Building the Interview Question Set

**Sample prompt:**

> "Create an interview question set for a Senior Backend Engineer covering both technical depth and behavioral signals. I need to be able to follow the conversation even without a coding background."

**Generated question set:**

### Technical Questions (for the technical interviewer)

| # | Question | What it tests | What a strong answer looks like |
|---|---------|---------------|---------------------------------|
| 1 | "How would you design a multi-tenant data architecture in PostgreSQL?" | Database architecture depth | Discusses row-level security, schema-per-tenant vs shared schema trade-offs, and indexing strategy |
| 2 | "Walk me through how you would migrate a monolith to microservices without breaking production." | Incremental system design thinking | Mentions strangler fig pattern, feature flags, parallel running, gradual traffic shifting |
| 3 | "How do you use Redis beyond just caching?" | Depth beyond surface knowledge | Mentions pub/sub, rate limiting, distributed locks, session store, leaderboards |
| 4 | "Tell me about a time an API you built had a performance problem in production. How did you diagnose and fix it?" | Real production experience | References query profiling, N+1 problem, slow query logs, indexing, connection pooling — not just theory |
| 5 | "What trade-offs do you consider when choosing between REST and GraphQL for a new API?" | API design judgment | Explains REST simplicity vs GraphQL flexibility, over-fetching, tooling maturity, team familiarity |
| 6 | "How do you approach database migrations in a live production environment?" | Operational maturity | Mentions zero-downtime strategies, backward compatibility, expand-contract pattern, rollback planning |

### Behavioral Questions (HR can ask directly)

| # | Question | What it tests |
|---|---------|--------------|
| 1 | "Describe a system you built that later had to scale beyond its original design. What did you change?" | Scalability thinking from real experience |
| 2 | "How do you approach technical disagreements with other engineers or your CTO?" | Collaboration and communication under pressure |
| 3 | "Have you ever pushed back on a deadline because the system design wasn't ready? What happened?" | Engineering integrity and stakeholder management |
| 4 | "Tell me about the production incident you are most proud of resolving." | Incident response, ownership, and learning mindset |

## Step 4 — Evaluating a Portfolio or GitHub Profile

**Sample prompt:**

> "A candidate sent their GitHub profile and mentioned a few production systems they built. I don't know what to look for. Help me evaluate them."

**Portfolio evaluation checklist generated by skill:**

### ✅ Strong signals

- [ ] Projects show real system complexity — not just tutorial CRUD apps
- [ ] README explains architecture decisions, not just how to run the project
- [ ] Evidence of database schema design (migrations, data models visible in code)
- [ ] API design is organized and consistent (versioning, error handling, response structure)
- [ ] Code shows separation of concerns — not everything crammed into one file
- [ ] Has worked with environment configs, Docker setup, or deployment scripts
- [ ] Mentions or shows production usage (even small scale is fine)
- [ ] Tests exist — even basic integration tests show engineering discipline

### ⚠️ Worth asking about

- Projects are all solo and never collaborated with or reviewed by others
- No evidence of database design thinking — only ORM usage without schema ownership
- All projects use the same single framework with no architectural variation
- README focuses only on features, never mentions technical decisions or trade-offs

### ❌ Concerning signals

- Only tutorial-level projects with no real system complexity
- No understanding of authentication or security practices (passwords stored in plain text, no rate limiting)
- Entire API logic lives in a single file with no structure
- No Git history or all commits are bulk pushes with no incremental development visible

## Step 5 — Post-Interview Scorecard

**Sample prompt:**

> "Create a scorecard to evaluate a Senior Backend Engineer after the full interview loop."

**Generated scorecard:**

```txt
SENIOR BACKEND ENGINEER — INTERVIEW SCORECARD
Candidate: _____________________ | Date: _____________
Interviewer: ___________________|

SECTION 1: TECHNICAL SKILLS (40 points)
─────────────────────────────────────────
[ /10] API Design & Architecture
       1–3: Builds working APIs but no design thinking
       4–6: Designs clean, versioned APIs with solid error handling
       7–10: Strong architecture decisions, explains trade-offs clearly

[ /10] Database Design & Optimization
       1–3: Basic CRUD, no schema design ownership
       4–6: Designs schemas, understands indexing and query optimization
       7–10: Multi-tenant design, migration strategies, production tuning experience

[ /10] Distributed Systems & Scalability
       1–3: Knows terms but no real experience
       4–6: Has worked with caching, async jobs, or basic microservices
       7–10: Designed or evolved a distributed system under real production load

[ /10] Infrastructure & Deployment
       1–3: Relies entirely on others for deployment
       4–6: Comfortable with Docker, CI/CD basics, and cloud environments
       7–10: Owns deployment pipelines, cloud infrastructure, and observability setup

SECTION 2: SYSTEM DESIGN DEPTH (20 points)
────────────────────────────────────────────
[ /10] Ability to design scalable and maintainable systems
[ /5]  Understanding of trade-offs in architecture decisions
[ /5]  Security awareness (auth, rate limiting, data protection)

SECTION 3: PRODUCTION EXPERIENCE (20 points)
─────────────────────────────────────────────
[ /10] Ownership of real production systems
[ /5]  Incident response and debugging under pressure
[ /5]  Performance optimization with measurable results

SECTION 4: COLLABORATION & LEADERSHIP (20 points)
───────────────────────────────────────────────────
[ /10] Mentoring and technical guidance experience
[ /5]  Cross-functional communication (frontend, DevOps, product)
[ /5]  Handling disagreement and driving alignment constructively

TOTAL: ____/100

HIRING THRESHOLDS:
 85–100:  Strong Hire
 70–84:   Hire (with a clear onboarding plan)
 55–69:   Needs discussion — flag specific gaps
 Below 55: No Hire

NOTES:
_________________________________________________
_________________________________________________
```

## Step 6 — Understanding Technical Answers Without Coding Knowledge

**Sample prompt:**

> "A candidate said: 'I use an event-driven architecture with Kafka for async processing and expose a REST API with rate limiting at the gateway level.' Is this a strong answer?"

**Skill explanation:**

- **Event-driven architecture with Kafka** = instead of every part of the system talking to each other directly, actions are published as "events" that other services react to asynchronously — like a group chat where each team reads what's relevant and responds in their own time. Kafka is the industry-standard tool for this at scale.
- **REST API** = the standard way for different systems to communicate over the internet — this is the expected baseline for a senior engineer
- **Rate limiting at the gateway level** = instead of each individual API endpoint managing its own traffic limits, the engineer placed that control at the entry point of the entire system — this is an architectural maturity signal, showing they think about cross-cutting concerns at the system level rather than patching each service individually
- **Assessment: Strong signal** — this answer shows the candidate thinks in systems, not just in code. They understand separation of concerns, async architecture, and operational resilience — all hallmarks of a senior backend engineer in 2026.

## Step 7 — Distinguishing Backend Specializations

**Sample prompt:**

> "The CTO mentioned we might need either a 'Platform Engineer' or a 'Backend Engineer.' What is the difference and how does it change what I look for?"

**Skill explanation:**

| Dimension | Backend Engineer | Platform Engineer |
|-----------|-----------------|-------------------|
| Primary focus | Building product APIs and business logic | Building the infrastructure and tools other engineers use |
| Day-to-day | API design, database work, service development | CI/CD pipelines, developer tooling, Kubernetes, internal platforms |
| Output | Features and APIs users rely on | Systems and tools engineering teams rely on |
| Screening signal | System design, API quality, database depth | Infrastructure automation, DevOps tooling, observability |
| JD keywords | NestJS, PostgreSQL, microservices, REST | Kubernetes, Terraform, ArgoCD, observability stacks |

> If your CTO wants someone to build the product APIs and own the data layer — that is a **Backend Engineer**. If they want someone to manage deployment infrastructure and developer workflows — that is a **Platform Engineer**. These are different roles and should not be combined into one JD.

## Full Hiring Workflow Summary

```txt
Write a focused JD scoped to one backend specialization
                    ↓
CV screening: look for production ownership, not just tool lists
                    ↓
Phone screen: 2–3 behavioral questions + one system design question
                    ↓
Technical interview (led by CTO or Staff Engineer)
                    ↓
System design session (for senior and above)
                    ↓
HR debrief using scorecard
                    ↓
Offer / No Offer decision
```

### Common HR Mistakes When Hiring Backend Engineers

| Mistake | How to avoid it |
|---------|----------------|
| Treating "knows Node.js" as seniority signal | Seniority is about system ownership and architecture decisions, not framework familiarity |
| Combining Backend + DevOps + Data + Security into one JD | Ask the CTO to pick the primary responsibility — scope the role to one track |
| Using LeetCode-style algorithm tests as the main evaluation | Backend seniority is better assessed through system design interviews and architecture discussions |
| Ignoring database design skills | Database modeling is one of the strongest signals of backend depth — always ask about schema decisions |
| Not asking about production incidents | How a candidate handles failure reveals more about seniority than how they build in ideal conditions |
| Confusing "knows Docker" with infrastructure expertise | Docker familiarity is a baseline expectation in 2026, not a differentiator |
