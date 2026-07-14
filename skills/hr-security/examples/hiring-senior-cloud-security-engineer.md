# Hiring a Senior Cloud Security Engineer

## Context

You are an HR Manager at a healthtech scale-up preparing for SOC 2 Type II certification and expanding its cloud infrastructure on AWS. The CTO has requested hiring **1 Senior Cloud Security Engineer** to own the company's cloud security posture, harden existing infrastructure, implement zero-trust identity controls, and embed security practices into the engineering team's CI/CD pipeline. You have no technical background and need end-to-end support throughout the hiring process.

## Step 1 — Translating Technical Requirements from the CTO

**Sample prompt:**

> "Our CTO wants a Senior Cloud Security Engineer with AWS security, IAM, zero-trust, DevSecOps, and SOC 2 experience. How do I talk about these things with candidates without sounding like I don't know what I'm saying?"

**Expected skill response:**

- **AWS Security** = expertise in securing systems built on Amazon Web Services — the cloud platform our infrastructure runs on. Think of AWS as a city and this engineer as the security architect who decides who can enter which building, what gets monitored, and what happens when something goes wrong.
- **IAM (Identity and Access Management)** = the system that controls who can access what inside the company's cloud. A misconfigured IAM is one of the most common causes of serious cloud breaches. This engineer ensures users, services, and systems only have access to exactly what they need — nothing more.
- **Zero-trust** = a modern security philosophy that assumes no one should be trusted automatically — not even employees already inside the company network. Every access request is verified, regardless of where it comes from. Think of it as replacing one front-door lock with individual key cards for every room.
- **DevSecOps** = integrating security checks directly into the software development and deployment process — so that security issues are caught automatically before code goes live, rather than discovered later in a manual audit.
- **SOC 2 Type II** = a formal certification that proves the company has consistent, auditable security controls protecting customer data. Many enterprise customers require vendors to hold this certification before signing contracts. It's a business enabler, not just a compliance box.
- **Suggested phrasing when speaking with candidates**: "We're running on AWS, going through SOC 2 Type II, and want someone who can both harden what we have today and build a long-term cloud security strategy. Can you walk me through how you've approached cloud security ownership at a previous company?"

## Step 2 — Writing the Job Description

**Sample prompt:**

> "Write a JD for a Senior Cloud Security Engineer at a healthtech scale-up, AWS-focused, 40-person company, preparing for SOC 2 Type II, team of 3 DevOps engineers to collaborate with."

**Sample JD generated:**

```text
Senior Cloud Security Engineer — Healthtech Scale-up

About us:
[Company] is building healthcare infrastructure trusted by hospitals and clinics
across Southeast Asia. We run on AWS, handle sensitive patient data, and are
preparing for SOC 2 Type II certification as we scale enterprise customers.
We are a 40-person company with a 3-person DevOps team and need a security
engineer who can own our cloud security posture end to end.

What you will do:
- Design and implement cloud security architecture across our AWS environment
- Harden IAM: enforce least-privilege access, implement role-based controls,
  audit service accounts and credentials
- Lead our SOC 2 Type II preparation: map controls, remediate gaps, support audits
- Build and maintain cloud security monitoring using AWS Security Hub and
  CloudTrail, with alerting into our SIEM
- Embed security into our CI/CD pipelines: automated scanning, dependency
  analysis, infrastructure-as-code security checks
- Conduct threat modeling for new product features and infrastructure changes
- Respond to and lead investigation of security incidents
- Educate and collaborate with engineering teams on secure coding and
  infrastructure practices
- Own security documentation: policies, runbooks, incident response playbooks

Requirements:
- 5+ years in security engineering, 3+ years focused on cloud security
- Deep AWS security expertise (IAM, Security Hub, GuardDuty, CloudTrail,
  KMS, VPC security, S3 policies)
- Hands-on experience with SOC 2, ISO 27001, HIPAA, or similar frameworks
- Experience embedding security into CI/CD pipelines (GitHub Actions, Terraform
  security scanning)
- IAM architecture experience: SSO, MFA enforcement, role design, privilege
  access management
- Threat modeling and risk assessment capability
- Incident response experience: detection, containment, investigation, recovery
- Strong communication skills — able to explain risk clearly to non-technical
  leadership

Nice to have:
- CSPM experience (Wiz, Prisma Cloud, or AWS Security Hub at scale)
- Kubernetes and container security experience
- Security certifications: AWS Security Specialty, CISSP, or CISM
- Application security fundamentals (OWASP Top 10 awareness)
- Experience in regulated industries: healthtech, fintech, or legaltech

Compensation: Competitive market rate + equity

Not a fit if:
- You are primarily a penetration tester with limited defensive/operational experience
- You have never owned SOC 2 or regulatory compliance processes end to end
- You are uncomfortable explaining security risk decisions to non-technical stakeholders
- You want to work in a pure advisory role without hands-on implementation ownership
```

**Skill note:**

> ⚠️ Avoid writing JDs that expect one security engineer to simultaneously cover SOC operations, penetration testing, red teaming, cloud security, AppSec, forensics, compliance, and AI security at expert level. Each of these is a distinct specialization. This kind of JD will repel strong candidates and attract generalists who are weak across all areas.

## Step 3 — Building the Interview Question Set

**Sample prompt:**

> "Create an interview question set for a Senior Cloud Security Engineer — both technical and behavioral. I need to be able to understand the answers even though I don't have a technical background."

**Generated question set:**

### Technical Questions (for the technical interviewer)

| # | Question | What it tests | What a strong answer looks like |
|---|---------|---------------|---------------------------------|
| 1 | "Walk me through how you would audit and harden an AWS environment that has grown organically with minimal security oversight." | Systematic security thinking | Describes a structured approach: IAM audit first, identify overprivileged roles, review public-facing resources, enable logging, prioritize by risk — not a random tool list |
| 2 | "How have you approached SOC 2 preparation at a previous company? What was the hardest control to implement?" | Compliance depth and operational experience | Gives a specific example with the control gap, the remediation approach, the stakeholders involved, and how they verified the fix held up in the audit |
| 3 | "Describe a cloud security incident you responded to. How did you detect it, contain it, and prevent recurrence?" | Incident response maturity | Clear timeline: detection method, who was notified, how blast radius was limited, root cause analysis, controls added afterward |
| 4 | "How do you design IAM for a 40-person company running on AWS where developers need cloud access to do their jobs without having too much power?" | Least-privilege architecture | Discusses role-based access, environment separation (dev vs prod), just-in-time access, MFA enforcement, and avoiding long-lived credentials |
| 5 | "How do you embed security into a CI/CD pipeline without slowing down developer velocity?" | DevSecOps collaboration maturity | Mentions automated scanning tools (Snyk, Trivy, Checkov), blocking only high-severity findings, running scans in parallel, and working with developers rather than against them |

### Behavioral Questions (HR can ask directly)

| # | Question | What it tests |
|---|---------|--------------|
| 1 | "Tell me about a time you had to tell a CTO or engineering leader that a planned system was too risky to ship as designed. What happened?" | Risk communication and courage |
| 2 | "Have you ever inherited a security posture that was significantly worse than expected? How did you prioritize what to fix first?" | Risk judgment under pressure |
| 3 | "Describe a time you had to build a security policy or process from scratch. How did you get engineering teams to actually follow it?" | Influence without authority |
| 4 | "What's the most significant security incident you've been part of responding to? What would you do differently?" | Accountability and learning mindset |

## Step 4 — Evaluating a Portfolio or Security Profile

**Sample prompt:**

> "A candidate shared their LinkedIn, a GitHub profile with some Terraform and security tooling projects, and two security certifications. What should I look for?"

**Portfolio evaluation checklist generated by skill:**

### ✅ Strong signals

- [ ] GitHub contains real infrastructure-as-code or security tooling projects — not just forks or empty repos
- [ ] Projects show evidence of threat modeling, detection engineering, or IAM design — not just tool installation scripts
- [ ] README files explain the security problem being solved and the reasoning behind decisions, not just setup instructions
- [ ] Certifications are paired with practical experience — AWS Security Specialty + 3 years of AWS security work is very different from the certification alone
- [ ] Blog posts, conference talks, or writeups demonstrate the ability to explain security reasoning to a broader audience
- [ ] Evidence of SOC 2, ISO 27001, HIPAA, or similar compliance involvement in work history
- [ ] HackTheBox, TryHackMe, or CTF writeups for candidates from offensive security backgrounds — shows structured thinking
- [ ] Mentions specific tools they've implemented and maintained in production, not just tools they've "used"

### ⚠️ Worth asking about

- Long list of certifications with no projects, GitHub activity, or described production experience to back them up
- Work history shows very short tenures (under 12 months) at each company — may not reflect ownership of multi-year security programs
- AWS or cloud experience is all described as "team support" without clear individual ownership
- GitHub last commit is over 2 years old

### ❌ Concerning signals

- Certifications and tool lists fill the entire resume — no operational examples, no described outcomes
- Described experience is entirely theoretical: "familiar with", "exposure to", "knowledge of" — with no "I built", "I owned", "I led"
- No evidence of any compliance or regulatory experience despite the role requiring SOC 2 readiness
- Claims broad expertise across SOC, AppSec, cloud security, pentesting, forensics, and GRC simultaneously at expert level — this is almost always a red flag at individual contributor level

## Step 5 — Post-Interview Scorecard

**Sample prompt:**

> "Create a scorecard I can use to evaluate a Senior Cloud Security Engineer candidate after interviews."

**Generated scorecard:**

```text
SENIOR CLOUD SECURITY ENGINEER — INTERVIEW SCORECARD
Candidate: _____________________ | Date: _____________
Interviewer: ___________________|

SECTION 1: TECHNICAL SKILLS (40 points)
─────────────────────────────────────────
[ /10] AWS Security Architecture Depth
       1-3: Knows AWS services but has not designed or owned a security posture
       4-6: Has hardened real AWS environments, understands IAM, Security Hub, GuardDuty
       7-10: Deep architecture thinking, designed IAM from scratch, led cloud security posture
             across multi-account environments, clear risk reasoning for every decision

[ /10] IAM and Identity Security
       1-3: Understands roles and policies at a basic level
       4-6: Has audited and restructured IAM for a real organization
       7-10: Designed zero-trust IAM: SSO, MFA enforcement, just-in-time access, privilege
             access management, service-to-service identity controls

[ /10] Compliance and SOC 2 / Regulatory Experience
       1-3: Knows what SOC 2 is but has not owned the process
       4-6: Has contributed to a compliance program and can map controls to evidence
       7-10: Has led SOC 2 or equivalent end to end: gap assessment, remediation,
             audit preparation, and ongoing compliance maintenance

[ /10] Incident Response and Threat Detection
       1-3: Knows the theory but limited hands-on incident response
       4-6: Has participated in real incidents with clear contribution
       7-10: Has led incident response, designed detection systems, written runbooks,
             conducted post-incident analysis and improved controls afterward

SECTION 2: DEVOPS AND SECURITY INTEGRATION (20 points)
────────────────────────────────────────────────────────
[ /10] DevSecOps and CI/CD security integration
       1-5: Understands the concept but has not implemented pipeline security tooling
       6-10: Has built automated security scanning into real CI/CD pipelines,
             balanced security controls with developer velocity

[ /10] Infrastructure and cloud operations understanding
       1-5: Security knowledge is siloed from infrastructure context
       6-10: Understands Terraform, Kubernetes, networking, and cloud architecture
             well enough to identify risks and propose realistic security controls

SECTION 3: COMMUNICATION & LEADERSHIP (20 points)
───────────────────────────────────────────────────
[ /10] Risk communication to non-technical stakeholders
[ /5]  Collaboration with engineering, DevOps, and product teams
[ /5]  Willingness to push back on decisions that create unacceptable security risk

SECTION 4: CULTURE & STRATEGIC FIT (20 points)
────────────────────────────────────────────────
[ /10] Systems thinking — sees security as risk management, not just tool deployment
[ /5]  Ability to prioritize limited resources against a large security surface
[ /5]  Fit with a fast-moving environment where security must enable, not block, delivery

TOTAL: ____/100

HIRING THRESHOLDS:
 85-100:  Strong Hire
 70-84:   Hire (with a clear onboarding plan for identified gaps)
 55-69:   Needs discussion — flag specific gaps with CTO before deciding
 Below 55: No Hire

NOTES:
_________________________________________________
_________________________________________________
```

## Step 6 — Understanding Technical Answers Without Coding Knowledge

**Sample prompt:**

> "A candidate said: 'I use Wiz for cloud security posture management, enforce least-privilege IAM with automated access reviews, and have GuardDuty feeding into Sentinel for centralized detection.' Is that a good answer?"

**Skill explanation:**

- **Wiz** = a cloud security platform that continuously scans the company's entire cloud environment for misconfigurations, vulnerabilities, and risky access paths — like a security camera system for your entire infrastructure. Knowing this tool at production scale is a strong signal in 2026.
- **Least-privilege IAM with automated access reviews** = the candidate not only designed the access control system, but automated the ongoing review process so that stale or excessive permissions are caught and removed regularly — not just fixed once and forgotten. This is a significant operational maturity signal.
- **GuardDuty feeding into Sentinel** = GuardDuty is AWS's built-in threat detection service (it notices suspicious activity like unusual login locations or unusual data transfers). Microsoft Sentinel is a SIEM — a central security dashboard that collects alerts from many sources. The candidate connected these two systems, meaning suspicious activity anywhere in AWS automatically surfaces in the team's central monitoring system.
- **Assessment: Very strong signal.** This answer demonstrates production-grade cloud security thinking — not theory. The candidate uses the right tools, has automated repeatable processes, and has integrated detection systems into a coherent monitoring workflow. This is exactly what the role requires.

**Sample prompt:**

> "Another candidate said: 'I have my CISSP and CEH, I know Kali Linux, and I've done penetration testing engagements.' Is this a fit for the Senior Cloud Security Engineer role?"

**Skill explanation:**

- **CISSP and CEH** = respected certifications in the security field. CISSP signals broad security management knowledge. CEH (Certified Ethical Hacker) signals offensive security exposure. Neither is specific to cloud security operations or AWS.
- **Kali Linux + penetration testing** = offensive security tools and methodology — this candidate's background is in simulating attacks, not designing the defensive cloud infrastructure and compliance controls the role requires.
- **Assessment: Not a fit for this specific role** — but this is not a weak candidate. This profile fits a penetration tester or red team role very well. The confusion is a role-scoping problem, not a candidate quality problem. Ask one clarifying question before concluding: "Have you owned ongoing cloud security operations or SOC 2 compliance at any point in your career?" A strong pentester who has also done cloud security work will have a clear answer. A purely offensive-focused candidate will not.
- **Note for HR:** Flag to the CTO that the sourcing funnel may be attracting offensive security profiles. Adjust the JD language to emphasize "cloud security ownership", "compliance", and "defensive operations" more prominently in the title and opening paragraph.

## Full Hiring Workflow Summary

```text
Write a focused JD (cloud security + compliance, not "SOC + pentesting + AppSec + GRC" in one role)
          ↓
CV screening: look for AWS experience + compliance involvement + operational examples,
not just certification lists
          ↓
Phone screen: 2-3 behavioral questions + confirm "owned" vs "supported" cloud security
          ↓
Technical interview (led by CTO or external security advisor):
architecture + IAM + incident response + DevSecOps depth
          ↓
Portfolio / work history review: real projects, GitHub, compliance outcomes described
          ↓
HR debrief using scorecard
          ↓
Culture fit interview: risk communication style, collaboration approach, handling pushback
          ↓
Offer / No Offer decision
```

## Common HR Mistakes When Hiring Security Engineers

| Mistake | How to avoid it |
|---------|----------------|
| Writing a JD that mixes offensive and defensive security skills equally | Decide upfront: is this a cloud security / defensive role or a penetration testing role? They are different careers |
| Over-weighting certifications over operational experience | A CISSP with no production ownership is a theory expert — always ask for specific examples of systems built or incidents led |
| Assuming "security experience" is interchangeable across specializations | SOC analysts, cloud security engineers, AppSec engineers, and pentesters have very different skill sets — clarify the domain before screening |
| Expecting the security hire to also own compliance, DevOps, and risk management solo | Scope the role realistically — then add resources as the program matures |
| Not involving a technical advisor in the interview | Security seniority is hard to evaluate without domain knowledge — bring in an external advisor or fractional CISO if the CTO is not security-specialized |
| Rushing the hire because of a compliance deadline | Hiring a weak security engineer to meet an audit deadline often creates more risk, not less — a fractional resource can cover the gap while you hire well |
| Treating SOC 2 as a one-time project rather than an ongoing program | Hire for someone who can own the security posture long-term, not just someone who can check the audit box once |
