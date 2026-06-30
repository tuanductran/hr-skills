# Hiring a Senior Fullstack Engineer

## Context

You are an HR Manager at an early-stage SaaS startup building a team collaboration tool. The CTO needs to hire **1 Senior Fullstack Engineer** who can independently ship end-to-end product features — from building the React frontend to designing the Node.js API, managing the PostgreSQL database, and deploying to production on AWS. The team is small (4 engineers) and cannot afford to hire separate frontend and backend specialists yet. You have no technical background and need end-to-end support throughout the hiring process.

## Step 1 — Translating Technical Requirements from the CTO

**Sample prompt:**

> "Our CTO wants a Senior Fullstack who can own features end-to-end using Next.js, Node.js, PostgreSQL, and Prisma. What does 'end-to-end ownership' actually mean and why does it matter for a small team?"

**Expected skill response:**

- **End-to-end ownership** = one engineer can take a feature from design discussion all the way through to production — writing the UI, building the API behind it, defining the database structure, deploying the change, and monitoring it after launch — without needing to hand off work to a frontend specialist or a backend specialist at each step
- **Next.js** = a React-based framework that handles both the user interface and server-side logic in one codebase — ideal for small teams because one engineer can own the full feature without a strict frontend/backend split
- **Node.js + PostgreSQL** = the backend runtime and database that power the application's business logic and data storage. The engineer needs to design the data structure and write the API logic, not just consume an existing one
- **Prisma** = a modern tool that lets engineers interact with the PostgreSQL database using TypeScript code instead of raw SQL — reduces errors and speeds up development, especially in small teams
- For a 4-person team, end-to-end ownership means one engineer shipping a complete feature in one sprint rather than three engineers coordinating a handoff chain — this is why fullstack is the right hire at this stage, not two separate specialists

## Step 2 — Writing the Job Description

**Sample prompt:**

> "Write a JD for a Senior Fullstack Engineer at an early-stage SaaS startup. Stack is Next.js, TypeScript, Node.js, PostgreSQL, Prisma. Team of 4 engineers. Product is a team collaboration tool."

**Sample JD generated:**

```txt
Senior Fullstack Engineer — SaaS Startup

About us:
[Company] is building a team collaboration tool for remote-first organizations.
We are a 4-person engineering team that values ownership, speed, and quality.
Every engineer here ships features from UI to database to deployment.

What you will do:
- Own complete product features across frontend (Next.js) and backend (Node.js)
- Design and build RESTful APIs and integrate them with the React UI
- Design database schemas and manage migrations using Prisma and PostgreSQL
- Deploy and monitor production systems on AWS
- Collaborate directly with the founding team on product decisions
- Set engineering standards and mentor future hires as the team grows

Requirements:
- 4+ years of fullstack experience with end-to-end feature ownership
- Strong proficiency in TypeScript across frontend and backend
- Production experience with Next.js or a comparable React framework
- Backend API design experience with Node.js (Express, Fastify, or NestJS)
- Relational database design experience — PostgreSQL strongly preferred
- Deployment experience with Docker and cloud platforms (AWS or Vercel)
- Understanding of authentication systems (sessions, JWT, OAuth)

Nice to have:
- Experience with Prisma or Drizzle ORM
- Familiarity with real-time features (WebSockets or Server-Sent Events)
- Background in SaaS, productivity tools, or collaboration software
- Experience setting up CI/CD pipelines with GitHub Actions

Compensation: Competitive + meaningful equity stake

Not a fit if:
- You strongly prefer to specialize in only frontend or only backend
- You have not shipped features to real users in a production environment
- You are not comfortable making architectural decisions with limited guidance
```

**Skill note:**

> ⚠️ "Fullstack" does not mean "frontend + backend + DevOps + data engineering + security + UI design + AI engineering." At a 4-person startup, a fullstack engineer needs to cover significant ground — but the JD must still be scoped realistically. List the primary stack clearly and treat everything else as a nice-to-have.

## Step 3 — Building the Interview Question Set

**Sample prompt:**

> "Create an interview question set for a Senior Fullstack Engineer. I need both technical and behavioral questions, and I need to understand what strong answers look like without knowing how to code."

**Generated question set:**

### Technical Questions (for the technical interviewer)

| # | Question | What it tests | What a strong answer looks like |
|---|---------|---------------|---------------------------------|
| 1 | "Walk me through how you would architect a real-time notifications feature for a team collaboration app — from database to API to UI." | End-to-end system thinking | Discusses database schema for notifications, API endpoint design, WebSocket or polling strategy, frontend state management, and read/unread status — not just one layer in isolation |
| 2 | "How do you handle authentication and session management in a Next.js application?" | Security and fullstack integration depth | Mentions server-side session handling, JWT trade-offs, token refresh strategy, middleware protection for routes, and secure cookie storage — not just "I use NextAuth" |
| 3 | "Tell me about a database schema decision you made that you later had to change in production. How did you handle the migration?" | Real production database experience | Describes backward-compatible migration strategy, zero-downtime approach, and what they learned about upfront schema design |
| 4 | "How do you structure a Next.js project so both the frontend and the backend API stay maintainable as the codebase grows?" | Architecture and code organization thinking | Discusses folder structure conventions, separation of concerns between UI components and API routes, shared type definitions between layers — not just "I put things in folders" |
| 5 | "How do you approach performance optimization when a page is loading too slowly?" | Full-stack debugging and optimization depth | Investigates both frontend (bundle size, rendering strategy, image optimization) and backend (slow queries, N+1 issues, caching) — not just one side |
| 6 | "How do you decide when a startup should switch from a monolithic fullstack app to a decoupled frontend/backend architecture?" | Architectural trade-off judgment | Discusses team size triggers, scaling needs, deployment flexibility, and the real cost of premature separation — shows product and engineering pragmatism |

### Behavioral Questions (HR can ask directly)

| # | Question | What it tests |
|---|---------|--------------|
| 1 | "Tell me about a product feature you owned fully from idea to production. What decisions did you make and what would you do differently?" | End-to-end ownership and reflection quality |
| 2 | "How do you decide what to build versus what to cut when you are the only engineer on a feature?" | Product judgment and prioritization under constraints |
| 3 | "Have you ever disagreed with a product decision made by a founder or PM? How did you handle it?" | Communication and engineering advocacy in a small team |
| 4 | "How do you keep technical debt from accumulating when the team is always shipping fast?" | Engineering discipline and long-term thinking |

## Step 4 — Evaluating a Portfolio or GitHub Profile

**Sample prompt:**

> "A candidate shared two GitHub projects and a live demo. They say both are fullstack apps they built solo. What should I look for to tell if this is real depth or just a tutorial clone?"

**Portfolio evaluation checklist generated by skill:**

### ✅ Strong signals

- [ ] Application covers the full stack — frontend, API, database, and deployment all present
- [ ] Authentication is implemented properly — not just a fake login screen
- [ ] Database schema shows real modeling decisions — not just a single users table
- [ ] README explains architecture choices and trade-offs, not just how to run it locally
- [ ] API is structured and consistent — proper error handling and response formats
- [ ] Frontend handles loading states, error states, and edge cases — not just happy path
- [ ] Deployment is live and accessible — not just "works on my machine"
- [ ] Code shows TypeScript usage throughout — not just in one layer

### ⚠️ Worth asking about

- App is functional but database design is flat and not scalable beyond the demo
- Authentication exists but is clearly copied from a tutorial without customization
- Frontend and backend are technically connected but no evidence of real user feedback or iteration
- Commit history is one large initial commit with no subsequent development

### ❌ Concerning signals

- Only frontend projects with mocked data — no real backend or database
- Portfolio is entirely tutorial clones (Todo app, Blog, Weather app identical to popular courses)
- No deployment — cannot be accessed live
- No authentication, error handling, or any non-happy-path scenarios anywhere

## Step 5 — Post-Interview Scorecard

**Sample prompt:**

> "Create a scorecard to evaluate a Senior Fullstack Engineer after the full interview loop."

**Generated scorecard:**

```txt
SENIOR FULLSTACK ENGINEER — INTERVIEW SCORECARD
Candidate: _____________________ | Date: _____________
Interviewer: ___________________|

SECTION 1: TECHNICAL SKILLS (40 points)
─────────────────────────────────────────
[ /10] Frontend Depth (Next.js / React / TypeScript)
       1–3: Can implement UI components with guidance
       4–6: Builds complete UI features with state, routing, and API integration
       7–10: Makes rendering strategy decisions, optimizes performance, owns frontend architecture

[ /10] Backend & API Design (Node.js / REST / Auth)
       1–3: Builds basic CRUD APIs following existing patterns
       4–6: Designs clean APIs with authentication, error handling, and validation
       7–10: Makes architecture decisions, handles complex business logic, owns API design standards

[ /10] Database Design (PostgreSQL / Schema / Migrations)
       1–3: Writes queries but does not design schemas independently
       4–6: Designs relational schemas for real product requirements, handles migrations
       7–10: Models complex domains, optimizes queries, designs for scale and evolution

[ /10] Deployment & Infrastructure Awareness
       1–3: Has deployed to a platform but does not understand the infrastructure
       4–6: Manages Docker, CI/CD, and cloud deployments confidently
       7–10: Designs deployment architecture, monitors production, handles incidents independently

SECTION 2: END-TO-END PRODUCT OWNERSHIP (20 points)
──────────────────────────────────────────────────────
[ /10] Demonstrated ability to ship complete features independently
[ /5]  Product thinking and user-centric decision making
[ /5]  Debugging ability across the full stack under production pressure

SECTION 3: ARCHITECTURE & SYSTEM THINKING (20 points)
───────────────────────────────────────────────────────
[ /10] Trade-off reasoning across frontend, backend, and database layers
[ /5]  Code organization and maintainability at team scale
[ /5]  Knowing when to keep things simple vs when to invest in structure

SECTION 4: COLLABORATION & GROWTH (20 points)
───────────────────────────────────────────────
[ /10] Collaboration with product, design, and other engineers
[ /5]  Communication quality when explaining technical decisions to non-engineers
[ /5]  Mentoring potential and ability to raise engineering standards as team grows

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

> "A candidate said: 'I use tRPC with a Next.js monorepo so the frontend and backend share a single TypeScript type system — no separate API contract documentation needed, and the IDE catches integration bugs at compile time instead of runtime.' Is this a strong answer?"

**Skill explanation:**

- **tRPC** = a tool that connects the frontend and backend in a TypeScript-first way, so both sides of the application share the same data type definitions automatically — if the backend changes an API response, the frontend immediately shows an error in the code editor instead of failing silently in production
- **Monorepo** = the frontend and backend code live in the same repository, making it easier to share code, enforce consistency, and deploy both sides together as a unit
- **No separate API contract documentation** = normally, frontend and backend teams need to maintain a separate document describing how APIs work (what parameters they accept, what they return). tRPC eliminates this because the types themselves serve as the documentation — and they are always accurate because they come from the same source code
- **Compile time vs runtime errors** = catching bugs when writing code (compile time) is far cheaper than catching them after deployment when users are affected (runtime). This candidate understands that developer experience and production reliability are connected
- **Assessment: Strong signal** — this answer shows the candidate thinks about the entire delivery system holistically, not just "make frontend call backend." They are optimizing for team velocity, error reduction, and long-term maintainability — exactly what a small startup team needs from a senior engineer.

## Step 7 — When to Hire Fullstack vs Specialists

**Sample prompt:**

> "Our CTO is debating whether to hire one Senior Fullstack Engineer or one Frontend and one Backend specialist. What should we consider?"

**Skill explanation:**

| Dimension | One Senior Fullstack | Frontend + Backend Specialists |
|-----------|---------------------|-------------------------------|
| Best for | Small teams (2–8 engineers), startups, MVP stage | Teams of 8+, established products with clear specialization needs |
| Speed | Faster feature delivery — one person owns the whole thing | Slower due to coordination and handoffs between two people |
| Cost | One salary instead of two | Higher total cost, but deeper specialization |
| Risk | Single point of knowledge — losing this person hurts more | Knowledge is distributed across two people |
| Quality ceiling | Strong generalist depth, but may not reach specialist-level depth in both layers | Higher ceiling on both frontend and backend independently |
| When it breaks down | When frontend and backend complexity both grow large enough to need dedicated ownership | When features are simple enough that one person could own them, but two people are waiting on each other |

> At 4 engineers with an MVP-stage product, **hire the Fullstack engineer**. The coordination overhead of two specialists at this team size slows you down more than it helps. Plan to hire specialists when the team reaches 10+ engineers and the product complexity justifies dedicated ownership in each layer.

## Full Hiring Workflow Summary

```txt
Confirm whether fullstack or specialists fit the team stage
                    ↓
Write a focused JD with the primary stack clearly defined
                    ↓
CV screening: look for complete applications, not just frontend or backend alone
                    ↓
Phone screen: behavioral questions + one end-to-end feature scenario
                    ↓
Technical interview (system design across all layers)
                    ↓
Portfolio review: assess a live demo or walk through a GitHub project together
                    ↓
HR debrief using scorecard
                    ↓
Offer / No Offer decision
```

### Common HR Mistakes When Hiring Fullstack Engineers

| Mistake | How to avoid it |
|---------|----------------|
| Expecting equal depth in frontend and backend at senior level | Most strong fullstack engineers lean slightly toward one side — this is normal and acceptable |
| Listing frontend + backend + DevOps + AI + design + data in one JD | Define the primary stack (2–3 technologies) and list everything else as nice-to-have |
| Evaluating fullstack candidates with frontend-only or backend-only test tasks | Use a take-home that requires connecting a UI to an API to a database — test the integration, not one layer |
| Confusing "knows multiple frameworks" with fullstack depth | Framework breadth is not the signal — end-to-end product ownership is |
| Hiring a fullstack engineer at a large company where specialists already exist | At large engineering orgs, fullstack engineers often feel pigeonholed — align expectations clearly before hiring |
| Not asking about deployment and production experience | A fullstack engineer who has never deployed their own work is missing a critical part of end-to-end ownership |
| Treating portfolio projects equally regardless of complexity | A solo-built SaaS with auth, payments, and real users is orders of magnitude more meaningful than five tutorial CRUD apps |
