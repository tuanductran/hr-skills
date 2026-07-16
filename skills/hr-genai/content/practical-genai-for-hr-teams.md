# Practical GenAI for HR Teams

## Overview

Generative AI tools have shifted from novelty to expected infrastructure in most HR functions. The gap between HR teams using GenAI effectively and those still treating it as an experiment is widening — and it shows in content quality, speed, and the capacity to take on higher-value work.

This guide covers what actually works in day-to-day HR use: where GenAI saves real time, where it introduces real risk, and how to build team habits that produce consistent quality rather than inconsistent shortcuts.

## Where GenAI Saves Real Time in HR

These are the use cases where experienced HR practitioners report the most reliable productivity gains.

### First drafts of structured HR documents

GenAI produces usable first drafts of job descriptions, offer letters, performance review templates, policy FAQs, onboarding guides, and change announcements far faster than starting from a blank page. The draft still requires human review for accuracy, company context, tone, and legal compliance — but the starting point is substantially better than zero.

### Variation generation

When you need five versions of a candidate outreach message for different seniority levels, or three versions of a performance feedback template for different conversation scenarios, GenAI generates variations quickly. This is where it is genuinely additive rather than just shifting work.

### Summarization of large inputs

360 feedback synthesis, engagement survey open-text analysis, interview debrief notes consolidation, and long policy documents distilled to employee-facing FAQs are all strong use cases. The HR professional still validates the synthesis, but the first-pass reduction of a 40-response survey to themes takes minutes rather than hours.

### Communication drafts under time pressure

Town hall scripts, sensitive change announcements, board reporting summaries, and all-hands presentations drafted under deadline — GenAI handles the structure and language scaffolding, freeing the HR professional to focus on accuracy and positioning.

## Writing Effective HR Prompts

Output quality is directly proportional to prompt quality. Vague prompts produce generic, unusable output. Specific prompts produce drafts that need light editing rather than heavy rewrites.

### The four elements of a good HR prompt

**Role** — who you are and what context you bring.
**Task** — what you need specifically.
**Constraints** — tone, length, format, what to avoid.
**Input** — the raw material the model should work from.

### Example: weak vs. strong prompt

**Weak:** "Write a job description for a recruiter."

**Strong:** "You are an HR lead at a 200-person B2B SaaS company in Vietnam. Write a job description for a Senior Technical Recruiter who will own engineering and product hiring. The company is fully remote-first. The tone should be direct, jargon-free, and appealing to experienced recruiters who are skeptical of startup promises. Keep it under 500 words. Do not use phrases like 'dynamic environment', 'fast-paced', or 'passionate team'."

The strong prompt produces output you can use with one edit pass. The weak prompt produces output you need to rewrite.

### Iterating rather than regenerating

When a first output misses on tone or specificity, iterate with a follow-up instruction rather than starting over. "Make the responsibilities section more specific to engineering hiring, with concrete examples of typical search types" produces a better second draft faster than re-prompting from scratch.

## Data Handling: What Never Goes Into Public GenAI Tools

This is the most important risk management rule for HR GenAI use.

**Never enter into public GenAI tools (ChatGPT, Claude.ai personal tier, Gemini, and so on):**

- Employee names, IDs, or personal identifying information
- Salary, compensation, or equity data
- Performance ratings or written performance feedback tied to individuals
- Medical, leave, or accommodation information
- Investigation or disciplinary records
- Candidate application data
- Any data covered by your privacy policy or data processing agreements

If your organization has not deployed an enterprise-licensed GenAI tool with appropriate data processing agreements, the practical rule is: anonymize everything before it goes in. Replace "Nguyen Van A, Senior Engineer, salary 45M VND, rated below expectations in Q3" with "Employee X, senior IC engineer, below-target performance rating."

Enterprise tools with proper data governance (Microsoft Copilot with M365, Google Workspace Gemini, Claude for Enterprise) can change these rules — but only if procurement and legal have reviewed and approved the data handling agreements.

## Quality Review Before Sharing GenAI Output

No GenAI output should go directly to an employee, candidate, or external party without human review. Build a consistent review checklist.

### Accuracy check

- Are all facts, dates, figures, and policy references correct?
- Has the model hallucinated company-specific details that do not exist?
- Are role titles, levels, and team names accurate?

### Tone and brand check

- Does this match your organization's voice and communication standards?
- Is the register appropriate for the audience (executive communication vs. employee FAQ vs. candidate outreach)?
- Does it avoid language your organization specifically avoids (jargon, hyperbole, problematic phrasing)?

### Legal and compliance check

- For job descriptions: does it include any language that could be discriminatory or legally problematic?
- For offer letters and employment communications: has legal reviewed the template?
- For policy documents: does it reflect current policy accurately?

### Bias check for candidate-facing content

- Does the job description use inclusive language?
- Does the screening criteria language avoid proxies for protected characteristics?
- Would this outreach message read as welcoming to candidates from diverse backgrounds?

## Building Team Norms for GenAI Use

Individual productivity gains are unstable if there are no shared team standards. These are the norms worth establishing early.

### Transparency norm

Team members should be able to say "I drafted this with AI and reviewed it" without stigma. Hiding GenAI use leads to less careful review, not more.

### Review accountability norm

The human who sends or approves a GenAI-drafted communication is accountable for its content, regardless of how it was generated. GenAI is a drafting tool, not an excuse.

### No-go list

Every HR team should agree on a list of content types that are not GenAI-appropriate due to sensitivity or accuracy requirements. Common examples: disciplinary communications, investigation findings, individual performance feedback delivered in writing to employees.

### Prompt library

Save prompts that produce good results. A shared team prompt library for common HR tasks (JD templates, candidate outreach by role type, standard policy FAQ format) saves time and produces more consistent output than everyone starting fresh.
