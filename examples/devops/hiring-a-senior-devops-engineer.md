---
title: Hiring a Senior DevOps Engineer
reference: hr-devops
---

# Example: Hiring a Senior DevOps Engineer

## Context

You are an HR Manager at a SaaS company building a B2B project management platform. The CTO needs to hire **1 Senior DevOps Engineer** to redesign the CI/CD pipeline, migrate infrastructure to Kubernetes on AWS, and establish an observability strategy as the platform scales to enterprise customers. You have no technical background and need end-to-end support throughout the hiring process.

## Step 1 — Translating Technical Requirements from the CTO

**Sample prompt:**

> "Our CTO says we need a Senior DevOps who can redesign our CI/CD pipeline, move us to Kubernetes on AWS, and set up proper observability. I have no idea what these mean or how to hire for them."

**Expected skill response:**

- **CI/CD pipeline** = an automated system that takes a developer's code change and runs it through testing, security checks, and deployment automatically — instead of someone manually pushing code to production. Redesigning it means making this process faster, safer, and more reliable as the team grows
- **Kubernetes on AWS** = Kubernetes is the industry-standard system for running and managing containerized applications at scale — think of it as an automated operations manager that decides where to run each piece of the application, restarts things that fail, and scales up during traffic spikes. AWS is the cloud platform hosting all of this
- **Observability** = the ability to see what is happening inside the system in real time — through logs (what happened), metrics (how fast and how often), and traces (which part of the system caused a slowdown). Without this, the team is flying blind when something breaks in production
- The CTO is looking for someone who has owned these systems in production, not just configured them following a tutorial
- This is a **DevOps / Infrastructure** role — not a backend engineer, not a security engineer, not a DBA, even though there is overlap with all three

## Step 2 — Writing the Job Description

**Sample prompt:**

> "Write a JD for a Senior DevOps Engineer at a B2B SaaS company. Requirements: Kubernetes, AWS, Terraform, GitHub Actions, Datadog. Team of 12 engineers. Product is a project management platform scaling to enterprise."

**Sample JD generated:**

```txt
Senior DevOps Engineer — B2B SaaS Platform

About us:
[Company] is a project management platform used by operations teams at
mid-market and enterprise companies. Our 12-person engineering team is
scaling fast and needs a reliable infrastructure foundation to match.

What you will do:
- Redesign and own our CI/CD pipeline to support faster and safer releases
- Lead the migration of our application workloads to Kubernetes on AWS (EKS)
- Define and implement infrastructure as code across all environments using Terraform
- Build and maintain our observability stack — logs, metrics, and distributed tracing
- Own incident response processes and post-mortem culture
- Improve developer experience by reducing deployment friction and toil
- Collaborate with backend engineers to design deployment-friendly architectures

Requirements:
- 4+ years of DevOps or infrastructure engineering experience
- Production-level Kubernetes experience (EKS or GKE preferred)
- Strong AWS skills — VPC, IAM, EKS, RDS, S3, and networking fundamentals
- Infrastructure as Code ownership using Terraform
- CI/CD pipeline design experience (GitHub Actions preferred)
- Observability implementation experience (Datadog, Prometheus/Grafana, or similar)
- Linux fundamentals and scripting (Bash or Python)

Nice to have:
- Experience with GitOps workflows (Argo CD or Flux)
- Security automation experience (secrets management, vulnerability scanning in CI)
- Background in SaaS platforms with enterprise SLA requirements
- Familiarity with cost optimization strategies on AWS

Compensation: Competitive + equity

Not a fit if:
- Your infrastructure experience has been limited to following runbooks without design ownership
- You have not managed a Kubernetes cluster in production
- You are looking for a role focused on backend development or application code
```

**Skill note:**

> ⚠️ Do not combine DevOps + Security Engineer + Backend Engineer + DBA + Network Engineer + QA Automation into a single JD. These are distinct specializations. A JD that stacks all of them signals the company does not understand infrastructure roles — and will be dismissed by experienced candidates.

## Step 3 — Building the Interview Question Set

**Sample prompt:**

> "Create an interview question set for a Senior DevOps Engineer covering both technical depth and behavioral signals. I need to understand what strong answers sound like without a technical background."

**Generated question set:**

### Technical Questions (for the technical interviewer)

| # | Question | What it tests | What a strong answer looks like |
|---|---------|---------------|---------------------------------|
| 1 | "Walk me through how you would design a CI/CD pipeline for a microservices application with 15 services." | Pipeline architecture thinking | Discusses per-service pipelines, shared testing stages, deployment strategies (blue-green or canary), rollback mechanisms, and secrets handling — not just "use GitHub Actions and deploy" |
| 2 | "How do you manage Kubernetes cluster upgrades in production without downtime?" | Operational maturity under real constraints | Mentions node drain strategies, PodDisruptionBudgets, rolling upgrades, pre-upgrade testing in staging, and communication to engineering teams |
| 3 | "How would you design an observability strategy for a platform that just signed its first enterprise customer with a 99.9% uptime SLA?" | Reliability and production thinking | Discusses SLO/SLA definition, alert threshold design, on-call rotation, runbook documentation, and distinguishing noise from actionable alerts |
| 4 | "How do you manage infrastructure drift between environments when using Terraform at scale?" | Infrastructure as Code maturity | Mentions remote state management, module design, plan reviews in CI, drift detection, and environment promotion workflows |
| 5 | "Tell me about a production incident you owned end to end. What was your process from detection to resolution to prevention?" | Incident response ownership | Describes detection via alerting (not a customer report), clear timeline, blameless post-mortem, and systemic fix — not just "we restarted the server" |
| 6 | "How do you reduce deployment friction for developers without compromising reliability?" | Developer experience thinking | Discusses self-service deployment tooling, feature flags, environment parity, fast feedback loops, and not making developers wait 45 minutes for a CI run |

### Behavioral Questions (HR can ask directly)

| # | Question | What it tests |
|---|---------|--------------|
| 1 | "Tell me about a time the engineering team blamed infrastructure for a production issue that turned out to be their code. How did you handle it?" | Cross-functional diplomacy and blameless culture |
| 2 | "How do you prioritize infrastructure improvements when the product team is always asking for new features faster?" | Stakeholder management and technical advocacy |
| 3 | "Have you ever inherited a chaotic infrastructure with no documentation? What was your approach?" | Ownership mindset and systematic thinking |
| 4 | "How do you keep developers informed about infrastructure changes that might affect their workflows?" | Communication and developer empathy |

## Step 4 — Evaluating a Portfolio or GitHub Profile

**Sample prompt:**

> "A candidate shared their GitHub with Terraform configs, Helm charts, and CI/CD workflow files. What should I look for to tell if this shows real depth?"

**Portfolio evaluation checklist generated by skill:**

### ✅ Strong signals

- [ ] Terraform code is modular — reusable modules, not one giant flat file
- [ ] CI/CD workflows handle failure cases — retry logic, rollback steps, notification on failure
- [ ] Kubernetes manifests include resource limits, health checks, and proper namespace structure
- [ ] README explains why architectural decisions were made, not just what the configuration does
- [ ] Secrets are managed properly — no hardcoded credentials anywhere in the repo
- [ ] Observability configuration exists — logging, metrics, or alerting definitions
- [ ] Evidence of GitOps or environment promotion workflows (staging → production)
- [ ] Commit history shows iterative improvement, not one giant initial dump

### ⚠️ Worth asking about

- All Kubernetes work is on local clusters (kind, minikube) with no cloud production context
- Terraform is used but state is stored locally — no remote backend or team workflow
- CI/CD pipeline is very basic (just build and push) with no testing, security scanning, or deployment strategy
- Infrastructure is functional but clearly copied from blog posts without customization

### ❌ Concerning signals

- No evidence of production infrastructure ownership — only personal project experiments
- Hardcoded secrets or credentials visible in configuration files
- No health checks, resource limits, or restart policies in Kubernetes manifests
- No documentation of any kind — not even inline comments in complex configurations

## Step 5 — Post-Interview Scorecard

**Sample prompt:**

> "Create a scorecard to evaluate a Senior DevOps Engineer after the full interview loop."

**Generated scorecard:**

```txt
SENIOR DEVOPS ENGINEER — INTERVIEW SCORECARD
Candidate: _____________________ | Date: _____________
Interviewer: ___________________|

SECTION 1: TECHNICAL SKILLS (40 points)
─────────────────────────────────────────
[ /10] CI/CD Design & Automation
       1–3: Uses CI/CD tools but has not designed pipelines from scratch
       4–6: Designs reliable pipelines with testing, security, and deployment stages
       7–10: Production-grade pipeline architecture with rollback, secrets, and DX optimization

[ /10] Kubernetes & Container Orchestration
       1–3: Basic Docker and Kubernetes awareness, no production ownership
       4–6: Manages production Kubernetes workloads confidently
       7–10: Cluster design, upgrade strategy, networking, and multi-environment management

[ /10] Infrastructure as Code (Terraform)
       1–3: Has used Terraform but no modular or team-scale experience
       4–6: Owns IaC for real environments with remote state and module structure
       7–10: Scalable IaC architecture with drift detection, environment promotion, and team workflows

[ /10] Observability & Reliability
       1–3: Knows monitoring exists but has not designed an observability strategy
       4–6: Implements logging, metrics, and alerting for production systems
       7–10: Full SLO/SLA framework, on-call design, alert quality, and blameless post-mortem culture

SECTION 2: PRODUCTION OPERATIONS EXPERIENCE (20 points)
──────────────────────────────────────────────────────────
[ /10] Ownership of real production infrastructure at meaningful scale
[ /5]  Incident response leadership and post-mortem quality
[ /5]  Cloud cost awareness and optimization experience

SECTION 3: PLATFORM & DEVELOPER EXPERIENCE THINKING (20 points)
──────────────────────────────────────────────────────────────────
[ /10] Ability to design infrastructure that reduces toil for developers
[ /5]  Security and secrets management practices
[ /5]  Documentation and knowledge-sharing discipline

SECTION 4: COLLABORATION & LEADERSHIP (20 points)
───────────────────────────────────────────────────
[ /10] Cross-functional communication with engineering, product, and security teams
[ /5]  Mentoring and knowledge transfer on infrastructure practices
[ /5]  Handling blame, ambiguity, and pressure during incidents constructively

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

## Step 6 — Understanding Technical Answers Without a Technical Background

**Sample prompt:**

> "A candidate said: 'We implemented a GitOps workflow using Argo CD where all infrastructure changes go through pull requests, and the cluster self-reconciles to match the desired state in Git.' Is this a strong answer?"

**Skill explanation:**

- **GitOps** = a workflow where the entire infrastructure configuration lives in a Git repository — every change must go through a code review process (pull request) before being applied, just like application code. This means no one can make secret manual changes to production
- **Argo CD** = a tool that watches the Git repository and automatically applies changes to the Kubernetes cluster whenever the repository is updated — the cluster continuously "self-heals" back to the desired configuration if anything drifts
- **Self-reconciles to match desired state** = if someone manually changes something in the cluster (accidentally or otherwise), Argo CD will detect the drift and revert it back to what the Git repository says it should be — this is a strong reliability and auditability signal
- **Assessment: Strong signal** — this answer shows the candidate thinks about infrastructure as a disciplined engineering practice, not just a set of commands to run. GitOps with Argo CD is considered a best practice for production Kubernetes environments in 2026. It also demonstrates security awareness — every infrastructure change has a reviewable paper trail.

## Step 7 — Distinguishing DevOps Role Types

**Sample prompt:**

> "Our CTO mentioned we might need either a 'DevOps Engineer' or an 'SRE.' I always thought they were the same thing. What is actually different?"

**Skill explanation:**

| Dimension | DevOps Engineer | Site Reliability Engineer (SRE) |
|-----------|----------------|----------------------------------|
| Primary focus | Building and automating delivery and infrastructure systems | Ensuring production systems are reliable, scalable, and meet uptime targets |
| Day-to-day | CI/CD pipelines, infrastructure provisioning, deployment automation | SLO definition, incident response, capacity planning, toil elimination |
| Output | Faster, safer software delivery | More reliable, measurable production systems |
| Screening signal | CI/CD design, IaC ownership, deployment strategy | SLO/SLA experience, on-call maturity, post-mortem quality |
| JD keywords | Terraform, GitHub Actions, Kubernetes, Docker, pipelines | SLOs, error budgets, MTTR, incident management, chaos engineering |
| When to hire | You need delivery automation and infrastructure built out | You need reliability guarantees and production ownership formalized |

> If your team ships code but deployments are painful and infrastructure is manually managed — hire a **DevOps Engineer**. If your product has uptime commitments to customers and incidents are not well-managed — hire an **SRE**. Many growing companies need both, but they prioritize differently and should not be written as the same JD.

## Full Hiring Workflow Summary

```txt
Define which DevOps role type is actually needed
                    ↓
Write a focused JD scoped to one infrastructure track
                    ↓
CV screening: look for production ownership, not just tool certifications
                    ↓
Phone screen: behavioral questions + one incident scenario
                    ↓
Technical interview (CI/CD design + Kubernetes + observability)
                    ↓
Infrastructure review: walk through a real Terraform config or pipeline
                    ↓
HR debrief using scorecard
                    ↓
Offer / No Offer decision
```

### Common HR Mistakes When Hiring DevOps Engineers

| Mistake | How to avoid it |
|---------|----------------|
| Treating cloud certifications as the primary signal | Certifications show studied knowledge — ask about production incidents and infrastructure they actually owned |
| Combining DevOps + Security + Backend + DBA + QA into one JD | Ask the CTO to define the primary infrastructure responsibility — scope the role to one track |
| Confusing "knows Docker" with Kubernetes production experience | Docker is a baseline expectation in 2026 — Kubernetes production ownership is the meaningful signal |
| Not asking about incident response experience | How a DevOps engineer performs under a production incident reveals more than any technical test |
| Ignoring developer experience thinking | Senior DevOps engineers reduce friction for the whole engineering team — this is as important as infrastructure depth |
| Over-indexing on the number of cloud services listed | Depth of ownership in one production system matters more than a resume listing every AWS service |
| Dismissing candidates without formal SRE titles | Many strong reliability engineers have worked under DevOps titles — focus on practices, not job title history |
