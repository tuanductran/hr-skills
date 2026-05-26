---
title: Hiring a Senior Frontend Engineer
reference: hr-frontend
---

# Example: Hiring a Senior Frontend Engineer

## Context

You are an HR Manager at a fintech startup scaling its Engineering team. The CTO has requested hiring **1 Senior Frontend Engineer** to lead a rebuild of the personal finance management app UI — migrating from a legacy React codebase to Next.js + TypeScript. You have no technical background and need end-to-end support throughout the hiring process.

## Step 1 — Translating Technical Requirements from the CTO

**Sample prompt:**

> "Our CTO wants to hire a Senior Frontend with Next.js, TypeScript, and performance optimization experience. How do I talk about these things with candidates without sounding like I don't know what I'm saying?"

**Expected skill response:**

- **Next.js** = a framework built on top of React that handles routing, server-side rendering, and SEO optimization out of the box — more production-ready than plain React for most products
- **TypeScript** = JavaScript with a "type-checking layer" added — it catches bugs earlier and makes large codebases easier to maintain across a team
- **Performance optimization** = skills that make web apps load faster and feel smoother for users (measured by Google's Core Web Vitals: load speed, interactivity, visual stability)
- Suggested phrasing when speaking with candidates that doesn't require deep technical knowledge

## Step 2 — Writing the Job Description

**Sample prompt:**

> "Write a JD for a Senior Frontend Engineer at a fintech startup requiring Next.js and TypeScript, 5-person team, product is a personal finance management app."

**Sample JD generated:**

```text
Senior Frontend Engineer — Fintech Startup

About us:
[Company] is building the next generation of personal finance tools for everyday users.
We are a 5-person engineering team that moves fast, ships often, and takes UX seriously.

What you will do:
- Lead the architecture and ongoing development of our web application UI
- Build scalable, reusable component systems
- Own frontend performance and Core Web Vitals across the product
- Collaborate closely with our designer and backend engineers
- Review code and mentor junior and mid-level engineers on the team

Requirements:
- 4+ years of frontend experience, 2+ years in the React ecosystem
- Strong proficiency with Next.js (App Router) and TypeScript
- Experience with modern state management (Zustand, TanStack Query)
- Demonstrated experience optimizing Core Web Vitals
- Working knowledge of web accessibility (WCAG 2.1)

Nice to have:
- Experience with Tailwind CSS or CSS Modules
- Background in fintech or data-heavy UI products
- Testing experience with Vitest or Playwright

Compensation: Competitive market rate + equity

Not a fit if:
- You prefer working solo and are not interested in mentoring others
- You have not worked with TypeScript in strict mode
```

**Skill note:**

> ⚠️ Avoid packing the JD with: "must know React, Vue, Angular, mobile, backend, and AI." This is a red flag to senior candidates that the role is poorly scoped — and it is one of the most common reasons strong candidates skip applying.

## Step 3 — Building the Interview Question Set

**Sample prompt:**

> "Create an interview question set for a Senior Frontend Engineer — both technical and behavioral. I need to be able to understand the answers even though I don't know how to code."

**Generated question set:**

### Technical Questions (for the technical interviewer)

| # | Question | What it tests | What a strong answer looks like |
|---|---------|---------------|---------------------------------|
| 1 | "What was the hardest part of migrating a project from React to Next.js?" | Real hands-on experience, not just theory | Mentions specific routing changes, data fetching patterns, and SSR trade-offs |
| 2 | "When would you use SSR vs SSG vs CSR?" | Understanding of rendering strategies | Explains trade-offs per use case, not just recites definitions |
| 3 | "Walk me through how you improved LCP on a past project." | Depth of performance optimization | References image optimization, lazy loading, bundle splitting with concrete before/after results |
| 4 | "How do you design a component system for a growing team?" | Architecture thinking | Discusses reusability, naming conventions, documentation, design tokens |
| 5 | "What TypeScript strict mode gotchas do you run into most often?" | TypeScript depth | Mentions `unknown` vs `any`, type narrowing, generic constraints — not just "it's stricter" |

### Behavioral Questions (HR can ask directly)

| # | Question | What it tests |
|---|---------|--------------|
| 1 | "Tell me about a time you had to choose between moving fast and maintaining code quality." | Trade-off judgment |
| 2 | "Have you mentored anyone? What does your approach look like?" | Leadership readiness |
| 3 | "What is the most critical piece of feedback you received about your code, and how did you respond?" | Growth mindset |
| 4 | "A designer is requesting a complex animation but it will hurt performance. How do you handle that conversation?" | Cross-functional collaboration |

## Step 4 — Evaluating a Portfolio or GitHub Profile

**Sample prompt:**

> "A candidate sent their GitHub: github.com/nguyenvan/portfolio-app and a live demo link. What should I look for?"

**Portfolio evaluation checklist generated by skill:**

### ✅ Strong signals

- [ ] Contains real applications — not just tutorial clones
- [ ] README is clear: describes the project, how to run it, tech stack used
- [ ] Commit history is consistent with meaningful messages (not just "fix stuff" or "update")
- [ ] UI handles loading states and error states, not just the happy path
- [ ] Components are organized in a logical folder structure
- [ ] TypeScript is used with reasonable type coverage — not filled with `any`
- [ ] Live demo is responsive on mobile
- [ ] At least one project integrates a real external API

### ⚠️ Worth asking about

- All projects look like YouTube tutorial clones (Todo app, Weather app, identical to a popular course)
- Last commit was over 18 months ago
- README is empty or just says "this is my project"
- Individual component files are 500+ lines with no separation

### ❌ Concerning signals

- No project has real data or API integration
- No TypeScript despite it being listed as a requirement
- Code comments and structure match common Stack Overflow copy-paste patterns
- No responsive design at all

## Step 5 — Post-Interview Scorecard

**Sample prompt:**

> "Create a scorecard for me to score a Senior Frontend candidate after interviews."

**Generated scorecard:**

```text
SENIOR FRONTEND ENGINEER — INTERVIEW SCORECARD
Candidate: _____________________ | Date: _____________
Interviewer: ___________________|

SECTION 1: TECHNICAL SKILLS (40 points)
─────────────────────────────────────────
[ /10] React / Next.js Depth
       1–3: Can use it, limited understanding of internals
       4–6: Understands trade-offs, explains decisions well
       7–10: Strong architecture thinking, clear rationale for each choice

[ /10] TypeScript Proficiency
       1–3: Uses it but relies on `any` frequently
       4–6: Solid usage, understands basic generics
       7–10: Strict mode fluency, custom utility types, deep type system knowledge

[ /10] Performance Optimization
       1–3: Knows the concepts but limited real practice
       4–6: Has improved Core Web Vitals in a real project
       7–10: Specific case study with measurable before/after metrics

[ /10] Architecture & System Design
       1–3: Code works but no structural thinking evident
       4–6: Organizes components well, follows conventions
       7–10: Has designed a design system or led a significant refactor

SECTION 2: PORTFOLIO QUALITY (20 points)
──────────────────────────────────────────
[ /10] Quality and complexity of real projects
[ /5]  Code organization and readability
[ /5]  Documentation quality

SECTION 3: COLLABORATION & LEADERSHIP (20 points)
───────────────────────────────────────────────────
[ /10] Mentoring and team leadership experience
[ /5]  Cross-functional work with designers
[ /5]  Handling disagreement or conflict constructively

SECTION 4: CULTURE & GROWTH FIT (20 points)
────────────────────────────────────────────
[ /10] Growth mindset — how they receive and apply feedback
[ /5]  Self-directed learning and staying current
[ /5]  Fit with startup pace and culture

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

> "A candidate said: 'I use TanStack Query for server state and Zustand for client state.' What does that mean? Is it a good answer?"

**Skill explanation:**

- **TanStack Query** = a specialized tool for fetching, caching, and syncing data from an API — the candidate understands the difference between "data that lives on the server" and "data that lives in the UI." This is a sign of architectural maturity.
- **Zustand** = a lightweight, modern state management library — a leaner alternative to Redux that reduces boilerplate and is widely adopted in 2025–2026 teams
- Using both together = the candidate knows that no single tool is the right solution for every problem (not over-engineering with one global solution)
- **Assessment: Strong signal** — this is a well-established pattern among senior frontend engineers in 2026. It shows the candidate is current and thoughtful about tool selection.

## Full Hiring Workflow Summary

```text
Write a focused, realistic JD
          ↓
CV screening: look for real projects, not buzzword lists
          ↓
Phone screen: 2–3 behavioral questions to filter early
          ↓
Technical interview (led by CTO or Tech Lead)
          ↓
HR debrief using scorecard
          ↓
Culture fit interview
          ↓
Offer / No Offer decision
```

### Common HR Mistakes When Hiring Frontend Engineers

| Mistake | How to avoid it |
|---------|----------------|
| Requiring 5+ years experience for a mid-level role | Use the seniority framework from the skill to calibrate expectations |
| Listing 10 frameworks in one JD | Ask the CTO which framework is primary — list only 2–3 |
| Evaluating frontend candidates with LeetCode-style algorithm tests | Frontend seniority is better assessed through portfolio review or a scoped take-home project |
| Ignoring soft skills because "technical ability matters more" | Senior = leadership and communication, not just code quality |
| Not asking about accessibility | Accessibility awareness is one of the clearest signals of senior frontend maturity |
