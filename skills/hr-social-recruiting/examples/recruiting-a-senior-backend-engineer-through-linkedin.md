# Recruiting a Senior Backend Engineer through LinkedIn

## Context

You are a Talent Acquisition Partner at a Series B fintech company. Engineering leadership needs to hire **1 Senior Backend Engineer** (Go, distributed systems, payments experience preferred) within 6 weeks. The role has been open on your careers page for three weeks with zero qualified inbound applicants. Your manager has asked you to actively source on LinkedIn instead of waiting for applications. You have sourced on LinkedIn before but have never run Boolean searches or built a structured outreach sequence, and your last sourcing campaign got a 4% response rate.

## Step 1 — Understanding Why Passive Sourcing Is Necessary Here

**Sample prompt:**

> "We've had this Senior Backend Engineer role posted for 3 weeks with no qualified applicants. Why would LinkedIn sourcing work better than just waiting for applications?"

**Expected skill response:**

- Senior engineers with payments/distributed systems experience are rarely job-seeking — they are usually employed, satisfied enough not to browse job boards, and only move for a compelling reason someone has to bring to them
- Posting a job is "passive recruitment" — it only reaches people already looking. For a scarce, senior, specialized skill set, the pool of active job-seekers is small and often already being chased by every other fintech
- Active sourcing flips the model: instead of waiting for candidates to find you, you find them where their public profile already demonstrates the skills you need (title history, endorsements, project descriptions)
- This role profile (senior + niche technical skill + urgency) is exactly the case where the skill recommends **active outreach over passive posting**
- Expectation-setting: active sourcing has a lower per-candidate conversion rate than inbound applications, but a much larger addressable pool — plan to reach 40-60 candidates to fill 1 role, not 5-10

## Step 2 — Defining the Search Strategy Before Searching

**Sample prompt:**

> "Help me define exactly who I'm looking for before I start searching, so I don't waste time on the wrong profiles."

**Expected skill response — a sourcing brief:**

| Dimension | Must-have | Nice-to-have | Disqualifying |
|---|---|---|---|
| Core language | Go (or equivalent systems language: Rust, Java at scale) | Go specifically over Java/Rust | No backend systems language at all |
| Domain | Distributed systems, high-throughput services | Payments, ledgers, financial infrastructure | Purely frontend or purely data-analyst background |
| Seniority | 5+ years backend, 2+ years in a senior/staff-track role | Tech lead or staff engineer title | New grad, <3 years experience |
| Company signal | Scale-up or larger tech company | Fintech, payments company, or high-compliance industry | Agency/consulting-only career with no product ownership |
| Location | Must be eligible to work in your hiring countries | — | Visa/relocation blockers you cannot support |

**HR note:** Writing this table *before* searching prevents "keyword-matching drift" — the tendency to loosen your definition of a fit the longer a search takes. Keep this brief open in a separate tab while sourcing.

## Step 3 — Boolean Search Construction

**Sample prompt:**

> "Build me Boolean search strings for LinkedIn to find backend engineers with Go and payments experience, excluding junior titles."

**Expected skill response:**

```text
("Go" OR "Golang") AND ("distributed systems" OR "microservices")
AND ("payments" OR "ledger" OR "fintech")
NOT ("intern" OR "junior" OR "graduate")
```

X-Ray variant (for use in a general search engine against LinkedIn public profiles):

```text
site:linkedin.com/in "Golang" "payments" ("senior" OR "staff" OR "lead")
-intern -junior
```

**Explanation for a non-technical recruiter:**

- `AND` narrows results — every term joined by AND must appear
- `OR` widens one part of the search — useful when candidates might describe the same skill differently (e.g., "Go" vs "Golang")
- `NOT` (or the minus sign in X-Ray search) removes irrelevant seniority levels
- Quotation marks force an exact phrase match — without them, LinkedIn may match the words separately anywhere in the profile, producing noisy results

**Checklist before running a search:**

- [ ] Skill terms include common synonyms (Go/Golang, distributed systems/microservices)
- [ ] Seniority terms are included as positive filters, not just negative exclusions
- [ ] Location/work-authorization filters are applied in LinkedIn's native filters, not just in Boolean text
- [ ] You've saved the search string somewhere reusable — you will run variations of it repeatedly

## Step 4 — Recruiter Profile Optimization

**Sample prompt:**

> "Review my LinkedIn recruiter profile and tell me what to fix before I start reaching out to senior engineers."

**Expected skill response — profile audit:**

| Element | Common mistake | Fix |
|---|---|---|
| Headline | "Recruiter at [Company]" | "Sourcing Backend & Infra Engineers @ [Company] — Go, distributed systems, fintech" — signals relevance immediately |
| Photo | No photo or outdated corporate headshot | Clear, current, professional photo — profiles without photos get ignored or reported as fake |
| About section | Blank or generic company boilerplate | 3-4 sentences on what you're hiring for, why the team is worth joining, and how candidates can reach you |
| Featured section | Empty | Link to the actual job posting or a short team/culture post |
| Recent activity | Silent for months | Some recent engagement (comments, shares) on engineering-relevant content — an inactive profile reads as inauthentic |

> ⚠️ **Warning:** A senior engineer receiving a cold connection request will almost always click into your profile before responding. A thin, generic recruiter profile is one of the most common silent reasons for low response rates — candidates decide you're not worth their time before reading your message.

## Step 5 — Sending Personalized Connection Requests

**Sample prompt:**

> "Write 3 connection request message variations for a Senior Backend Engineer at a payments company with 6 years of experience, no mutual connections."

**Expected skill response:**

1. *"Hi [Name] — came across your profile while researching Go engineers with payments infra experience. We're building out the ledger team at [Company] and I think your background at [their company] would be really relevant. Would love to connect and share more."*
2. *"Hi [Name] — I noticed your work on [specific project/talk/repo if visible]. We're hiring a Senior Backend Engineer focused on distributed payments systems and your experience looks like a strong match. Open to connecting?"*
3. *"Hi [Name] — reaching out because of your background in high-throughput backend systems. I'm sourcing for a senior role on our payments infrastructure team and would value the chance to connect, even just to compare notes."*

**HR note:** Each variation references something specific (project, company, skill) rather than a generic "I have a great opportunity for you." Specificity is the single biggest lever for response rate — generic requests get ignored or reported as spam far more often.

## Step 6 — First Message After Connection Accepted

**Sample prompt:**

> "They accepted my connection request. Write the first real outreach message now."

**Expected skill response:**

> *"Thanks for connecting, [Name]! To give you real context: we're building the core ledger and payments infrastructure at [Company] — think reconciliation, multi-currency settlement, and fraud-adjacent systems at [scale detail, e.g., '2M+ transactions/day']. We're looking for a Senior Backend Engineer to own a chunk of that. Given your background at [their company] with [specific skill/project], I think this could be a strong fit. Would you be open to a 15-minute call this week, no pressure either way?"*

**Framework applied:**

1. **Personalization** — references their specific background
2. **Relevance** — explains why they specifically, not "you seem qualified"
3. **Clarity** — states what the role actually involves in concrete terms, not buzzwords
4. **Ease** — one clear, low-friction next step (15-minute call)

## Step 7 — Follow-Up Sequence

**Sample prompt:**

> "They haven't responded in 6 days. What should the follow-up look like?"

**Expected skill response — sequence:**

| Touch | Timing | Angle | Example |
|---|---|---|---|
| 1 | Day 0 | Initial outreach | (Step 6 message) |
| 2 | Day 6-7 | New angle, not a repeat | *"Hi [Name] — following up in case this got buried. Happy to share more detail on the tech stack and team if useful, even without committing to anything. No pressure."* |
| 3 | Day 13-14 | Final, respectful close | *"Totally understand if the timing isn't right. I'll leave the door open — feel free to reach out anytime if that changes. Wishing you well either way!"* |
| 4 | No response after touch 3 | Stop | Move to nurture list; do not send further unsolicited messages |

> ⚠️ **Warning:** Never repeat the exact same message on follow-up. Identical repeated messages are one of the strongest spam signals LinkedIn's systems and human recipients both react to negatively.

## Step 8 — Avoiding Spam Flags During a Sourcing Sprint

**Sample prompt:**

> "I need to reach out to 50 candidates this week. How do I do that without getting my account restricted?"

**Expected skill response:**

- Spread outreach across the week rather than sending all 50 in one day — sudden bursts of activity are a primary trigger for automated spam detection systems
- Personalize every message — even light personalization (referencing their company or a skill) meaningfully reduces spam-report likelihood compared to templated blasts
- Avoid third-party automation tools or browser extensions that auto-send connection requests — these frequently violate LinkedIn's Terms of Service and put the account at risk regardless of message quality
- Monitor your acceptance rate — a low connection-acceptance rate over time is itself a signal LinkedIn's systems may weigh; if yours drops sharply, slow down and revisit targeting and message quality before increasing volume
- Because platform-imposed limits and enforcement thresholds change over time, don't rely on a fixed number as a safe ceiling — consult LinkedIn's current official guidance for recruiters, and treat gradual, personalized, well-targeted outreach as the durable strategy regardless of what the specific limit is this month

## Step 9 — Evaluating Replies and Moving to Screening

**Sample prompt:**

> "A candidate replied positively and is open to a call. What should I do before scheduling?"

**Expected skill response — checklist:**

- [ ] Confirm current employment status and general compensation expectations early (respectfully) to avoid a mismatch later in the process
- [ ] Send a short, specific calendar link rather than a long back-and-forth on timing
- [ ] Before the call, review their profile once more for talking points specific to their background
- [ ] Prepare 2-3 questions that test genuine interest in *this* role, not just "why are you open to new roles" — e.g., "What part of the payments/distributed-systems space interests you most right now?"
- [ ] Set a clear expectation for what happens after the call (timeline, next interview stage)

## Step 10 — Sourcing Metrics to Track

**Sample prompt:**

> "What should I actually be measuring to know if this sourcing campaign is working?"

**Expected skill response:**

| Metric | What it tells you | Healthy signal |
|---|---|---|
| Connection acceptance rate | Whether your targeting and profile are credible | Meaningfully above what you were getting before profile/message fixes |
| Response rate after connection | Whether your first message resonates | Improving over successive campaigns, not flat |
| Positive response rate | Whether the role/pitch is compelling | Track separately from "any reply" — a polite decline is not the same signal as interest |
| Time from outreach to screen call | Pipeline velocity | Should trend down as your process gets more efficient |
| Source-to-hire ratio | Whether LinkedIn sourcing specifically is worth the time investment vs other channels | Compare across roles over multiple quarters, not one campaign |

> **HR note:** Don't judge a single week of outreach against a single week of results — senior passive candidates often take 2-4 weeks to respond, if they respond at all. Evaluate the campaign over its full follow-up cycle, not day one.

## Full Workflow Summary

```text
Define sourcing brief (must-haves, nice-to-haves, disqualifiers)
                    ↓
Build Boolean/X-Ray search strings
                    ↓
Optimize recruiter profile before outreach begins
                    ↓
Send personalized connection requests (small daily batches)
                    ↓
Send personalized first message after acceptance
                    ↓
Run 3-touch follow-up sequence, then stop
                    ↓
Track acceptance rate, response rate, positive response rate
                    ↓
Move responders into screening with light pre-call research
```

### Common Mistakes When Sourcing Senior Engineers on LinkedIn

| Mistake | Fix |
|---|---|
| Sending the same message to everyone | Personalize with at least one specific, verifiable detail per candidate |
| Reaching out with a thin or generic profile | Fix headline, photo, and About section before any outreach sprint |
| Sending all outreach in one burst | Spread across the week to avoid spam-detection risk and mirror natural usage patterns |
| Giving up after one message | Run the full 3-touch sequence — many positive replies come on the second or third touch |
| Judging results after 2-3 days | Senior passive candidates respond slowly; evaluate campaigns over 2-4 weeks |
| Using automation/scraping tools | Avoid — these risk account restriction regardless of message quality |
