# Hiring a Senior Mobile Engineer

## Context

You are an HR Manager at a Series A consumer app startup scaling its Engineering team. The CTO has requested hiring **1 Senior Mobile Engineer** to lead a rebuild of the company's flagship React Native app — improving performance, migrating to the New Architecture, and building offline-first capabilities. You have no technical background and need end-to-end support throughout the hiring process.

## Step 1 — Translating Technical Requirements from the CTO

**Sample prompt:**

> "Our CTO wants to hire a Senior Mobile Engineer with React Native New Architecture, TypeScript, and offline-first experience. How do I talk about these things with candidates without sounding like I don't know what I'm saying?"

**Expected skill response:**

- **React Native** = a cross-platform framework that lets one team build both iOS and Android apps using JavaScript/TypeScript — instead of maintaining two separate native codebases. It's the dominant choice for startups in 2026.
- **React Native New Architecture** = a significant internal upgrade to React Native released in recent years. Think of it as "React Native 2.0" under the hood — faster, more stable, and better integrated with native device features. Engineers who know this are ahead of the curve.
- **TypeScript** = JavaScript with a type-checking layer added — it catches bugs earlier and makes large codebases safer to maintain across a team. Expected by default in strong mobile teams.
- **Offline-first** = the app continues working even without internet. Data is stored locally on the device and synced to the server when connectivity returns. This is critical for apps with heavy usage in low-connectivity environments (e.g., emerging markets, logistics, field work).
- **Suggested phrasing when speaking with candidates**: "We're looking for someone who's worked on production React Native apps with the New Architecture and can architect offline capabilities — can you walk me through a time you've built something like that?"

## Step 2 — Writing the Job Description

**Sample prompt:**

> "Write a JD for a Senior Mobile Engineer at a consumer app startup, React Native, team of 6 engineers, product is a fitness and habit tracking app with 200k monthly active users."

**Sample JD generated:**

```text
Senior Mobile Engineer (React Native) — Consumer App Startup

About us:
[Company] is building the leading fitness and habit tracking app for everyday users.
With 200k MAU and growing, we're a 6-person engineering team that ships fast,
cares deeply about UX quality, and builds for users in real-world conditions.

What you will do:
- Lead the architecture and ongoing development of our React Native app (iOS + Android)
- Drive our migration to the React Native New Architecture
- Design and implement offline-first data sync capabilities
- Own app performance: startup time, rendering smoothness, memory usage
- Collaborate closely with our designer, backend engineers, and product manager
- Set up and maintain our mobile CI/CD pipeline (Fastlane + GitHub Actions)
- Review code and mentor junior and mid-level engineers on the team

Requirements:
- 5+ years of mobile engineering experience, 3+ years in React Native
- Strong proficiency with TypeScript
- Shipped at least 2 apps to App Store and Google Play
- Experience with local databases and offline sync (WatermelonDB, SQLite, or similar)
- Familiarity with React Native New Architecture (JSI, TurboModules, Fabric)
- Understanding of mobile performance: frame rates, startup time, memory profiling
- Experience with mobile CI/CD workflows (Fastlane, GitHub Actions, TestFlight)

Nice to have:
- Native iOS (Swift) or Android (Kotlin) debugging experience
- Experience with real-time data sync (WebSockets, Firebase, Supabase)
- Analytics and crash monitoring setup (Firebase, Sentry, Mixpanel)
- Background in consumer apps with high retention demands

Compensation: Competitive market rate + equity

Not a fit if:
- You have only built tutorial-level projects without production deployments
- You have no experience with app performance profiling
- You prefer solo work and are not interested in mentoring or design collaboration
```

**Skill note:**

> ⚠️ Avoid writing JDs that ask one mobile engineer to simultaneously be an expert in native iOS, native Android, React Native, Flutter, backend APIs, DevOps, UI/UX design, and AI engineering. This signals a poorly scoped role and will cause strong senior candidates to skip applying.

## Step 3 — Building the Interview Question Set

**Sample prompt:**

> "Create an interview question set for a Senior React Native Engineer — both technical and behavioral. I need to be able to understand the answers even though I don't code."

**Generated question set:**

### Technical Questions (for the technical interviewer)

| # | Question | What it tests | What a strong answer looks like |
|---|---------|---------------|---------------------------------|
| 1 | "Walk me through how you migrated a project to the React Native New Architecture." | Real production experience | Mentions specific changes to native modules, JSI bridge removal, TurboModules setup, testing across both platforms |
| 2 | "How have you implemented offline-first functionality in a mobile app?" | Architecture depth | Describes local database choice (WatermelonDB, SQLite), sync queue design, conflict resolution strategy |
| 3 | "Tell me about a performance issue you diagnosed and fixed in a React Native app." | Debugging depth | References Flipper, Xcode Instruments, or Android Profiler; mentions frame drops, JS thread blocking, or memory leaks with before/after metrics |
| 4 | "How do you structure a React Native codebase for a team of 5+ engineers?" | Architecture thinking | Discusses feature-based folder structure, shared component library, separation of business logic, navigation strategy |
| 5 | "What's the difference between using a JavaScript state management solution versus a native module for performance-sensitive features?" | Platform understanding | Explains JS thread vs native thread, bridge communication cost, when to use native modules vs JS-side solutions |

### Behavioral Questions (HR can ask directly)

| # | Question | What it tests |
|---|---------|--------------|
| 1 | "Tell me about the most complex mobile feature you've shipped. What made it hard?" | Engineering depth and ownership |
| 2 | "Have you ever pushed back on a product request because of performance or UX concerns? How did you handle it?" | Product thinking and communication |
| 3 | "How do you approach mentoring a junior mobile engineer who is struggling?" | Leadership readiness |
| 4 | "Describe a time when an App Store rejection or release issue caused a problem. How did you resolve it?" | Deployment maturity |

## Step 4 — Evaluating a Portfolio or App Store Profile

**Sample prompt:**

> "A candidate shared their GitHub profile and two App Store links. What should I look for as a non-technical HR manager?"

**Portfolio evaluation checklist generated by skill:**

### ✅ Strong signals

- [ ] At least 1-2 apps are live on the App Store or Google Play (real deployment, not just screenshots)
- [ ] App has real reviews and ratings — evidence of actual users
- [ ] GitHub README clearly explains the tech stack, architecture decisions, and how to run the project
- [ ] Commit history is consistent over time with meaningful commit messages (not just "fix" or "update")
- [ ] App handles loading states, error states, and edge cases — not only the ideal user flow
- [ ] Code separates UI, business logic, and data concerns into different layers
- [ ] TypeScript is used with reasonable type coverage — not filled with `any`
- [ ] At least one project integrates a real backend or third-party API
- [ ] Evidence of mobile-specific concerns: push notifications, offline handling, or deep links

### ⚠️ Worth asking about

- All apps look like tutorial clones (Todo list, Weather app, identical to a YouTube course)
- Last commit was over 18 months ago
- App Store listing has 0 reviews after 2+ years — suggests it was never actively used
- README is empty or just contains a single line of description

### ❌ Concerning signals

- No live App Store or Google Play deployment at all for a "senior" candidate
- Only UI screenshots, no working demo or source code
- No TypeScript despite being listed as a requirement
- No evidence of performance awareness or architectural decisions anywhere
- No backend integration — only hardcoded or mock data

## Step 5 — Post-Interview Scorecard

**Sample prompt:**

> "Create a scorecard I can use to evaluate a Senior React Native candidate after interviews."

**Generated scorecard:**

```text
SENIOR MOBILE ENGINEER (REACT NATIVE) — INTERVIEW SCORECARD
Candidate: _____________________ | Date: _____________
Interviewer: ___________________|

SECTION 1: TECHNICAL SKILLS (40 points)
─────────────────────────────────────────
[ /10] React Native & Platform Depth
       1-3: Uses React Native but limited understanding of internals or platform behavior
       4-6: Understands New Architecture, JSI, native module trade-offs
       7-10: Deep platform knowledge, can debug at native level, clear architectural reasoning

[ /10] Offline-First & State Management
       1-3: Knows the concepts but no production implementation experience
       4-6: Has shipped offline features with local DB and basic sync
       7-10: Designed conflict resolution strategy, handled edge cases in production

[ /10] Performance Optimization
       1-3: Aware of performance concepts but no hands-on profiling experience
       4-6: Has diagnosed and resolved real performance issues (frame drops, memory leaks)
       7-10: Uses profiling tools regularly, can cite before/after metrics from real projects

[ /10] Mobile Architecture & System Design
       1-3: Code works but no structural thinking evident
       4-6: Organizes codebase well, understands navigation and state patterns
       7-10: Has designed scalable mobile architecture, led codebase migrations, sets team standards

SECTION 2: DEPLOYMENT & DEVOPS (20 points)
────────────────────────────────────────────
[ /10] App Store / Google Play experience
       1-5: Submitted apps but limited release pipeline knowledge
       6-10: Owns full release process, handles staged rollouts, OTA updates, crash monitoring

[ /10] CI/CD and mobile DevOps
       1-5: Familiar with tools but not the person who set them up
       6-10: Has built and maintained Fastlane pipelines, GitHub Actions, TestFlight workflows

SECTION 3: COLLABORATION & LEADERSHIP (20 points)
───────────────────────────────────────────────────
[ /10] Mentoring and technical leadership experience
[ /5]  Cross-functional work with designers, product, and backend engineers
[ /5]  Handling disagreement or conflict constructively

SECTION 4: CULTURE & GROWTH FIT (20 points)
────────────────────────────────────────────
[ /10] Product ownership mindset — cares about UX and user outcomes, not only code
[ /5]  Self-directed learning and staying current with mobile ecosystem changes
[ /5]  Fit with startup pace, ownership culture, and team structure

TOTAL: ____/100

HIRING THRESHOLDS:
 85-100:  Strong Hire
 70-84:   Hire (with a clear onboarding plan for identified gaps)
 55-69:   Needs discussion — flag specific gaps with CTO
 Below 55: No Hire

NOTES:
_________________________________________________
_________________________________________________
```

## Step 6 — Understanding Technical Answers Without Coding Knowledge

**Sample prompt:**

> "A candidate said: 'I use WatermelonDB for local persistence with a custom sync engine, and Zustand for global UI state.' Is that a good answer?"

**Skill explanation:**

- **WatermelonDB** = a high-performance local database built specifically for React Native — designed to handle large datasets without freezing the app. Choosing this (instead of basic AsyncStorage) shows the candidate thinks seriously about offline performance. Strong signal.
- **Custom sync engine** = they built the logic that decides how local data and server data stay in sync — including handling conflicts when the user makes changes offline. This is one of the hardest problems in mobile engineering. Very strong signal.
- **Zustand** = a modern, lightweight state management library for UI state — a leaner, more pragmatic alternative to Redux. Using it specifically for UI state (and not trying to use it for everything) shows the candidate understands separation of concerns.
- **Assessment: Strong signal** — the candidate clearly separates local data persistence, server sync logic, and UI state management into three distinct concerns. This is exactly how senior mobile engineers think. It demonstrates architectural maturity, not just framework familiarity.

**Sample prompt:**

> "Another candidate said: 'I just use Redux for everything and AsyncStorage for offline.' Is that a red flag?"

**Skill explanation:**

- **Redux for everything** = Redux is a valid tool, but using it as the only solution for all state (server data, UI state, offline data) suggests the candidate may not have encountered complex production scenarios that require a more layered architecture.
- **AsyncStorage** = the simplest key-value storage in React Native — suitable for small amounts of data (user preferences, tokens) but not designed for large datasets, querying, or offline-first sync. Using it as an offline database strategy is a meaningful limitation for a senior role.
- **Assessment: Not necessarily a dealbreaker, but worth probing.** Ask: "Have you run into any performance issues with this setup at scale?" A strong candidate will acknowledge limitations. A weaker candidate will defend the approach without nuance.

## Full Hiring Workflow Summary

```text
Write a focused, realistic JD (React Native focus, not "iOS + Android + Flutter + backend")
          ↓
CV screening: look for real App Store / Google Play deployments, not just framework lists
          ↓
Phone screen: 2-3 behavioral questions + confirm deployment experience early
          ↓
Technical interview (led by CTO or Tech Lead): architecture + performance + platform depth
          ↓
Portfolio review: live apps, GitHub quality, commit history
          ↓
HR debrief using scorecard
          ↓
Culture fit interview
          ↓
Offer / No Offer decision
```

## Common HR Mistakes When Hiring Mobile Engineers

| Mistake | How to avoid it |
|---------|----------------|
| Requiring "iOS + Android + React Native + Flutter" in one role | Ask the CTO which platform is primary — scope the role to one ecosystem |
| Treating tutorial clones as production experience | Always verify App Store or Google Play live deployments |
| Using algorithm-heavy coding tests (LeetCode style) to assess mobile candidates | Mobile seniority is better assessed through architecture discussions and portfolio review |
| Ignoring deployment and DevOps skills | A senior mobile engineer who cannot own the release pipeline is incomplete for most startup roles |
| Expecting zero native knowledge because "it's cross-platform" | Strong React Native engineers still need iOS/Android debugging skills — always probe for this |
| Listing "AI experience" as a mobile requirement without a clear use case | Only add AI requirements if the role has a defined AI feature scope |
| Not asking about real user scale | Ask "how many active users did the apps you've shipped have?" — this surfaces real production depth |
