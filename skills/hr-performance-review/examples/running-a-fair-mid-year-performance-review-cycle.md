# Running a Fair Mid-Year Performance Review Cycle

## Context

You are an HR Manager at a 150-person company running its first structured mid-year performance review cycle across 12 managers and roughly 100 employees. Last cycle, several employees complained that ratings felt inconsistent between teams — two people doing similar work received very different scores. You need to run this cycle end-to-end: set shared standards, support managers writing reviews, calibrate ratings, and make sure the outcome actually feels fair.

## Step 1 — Explaining Why Last Cycle Felt Unfair

**Sample prompt:**

> "Employees complained that our last review cycle felt unfair — two people doing similar work got very different ratings from different managers. What actually went wrong, and how do we fix it this time?"

**Expected skill response:**

- **What likely happened** = without a shared, agreed definition of what each rating means, managers naturally rate against their own personal bar — one manager's "meets expectations" can be another manager's "exceeds expectations" for genuinely equivalent work
- **This is a calibration gap, not a writing problem** = individual reviews may have been well-written and evidence-based, but without cross-manager calibration, there was nothing correcting for managers who rate more leniently or more strictly than their peers
- **The fix has two parts** = (1) define and communicate what each rating actually means before managers start writing, and (2) hold a calibration step after managers draft ratings, where ratings are compared and adjusted against a shared standard before anything is finalized
- **What calibration is not** = it isn't about forcing everyone into a curve or automatically lowering strong ratings — it's a discussion, grounded in evidence, that surfaces both overly lenient and overly strict ratings
- This cycle needs a **defined rating scale, manager bias training, and a calibration step** built in from the start, not added as an afterthought if complaints come up again

## Step 2 — Defining the Rating Scale and Sharing It Before Reviews Start

**Sample prompt:**

> "Help me write a clear definition of each rating level in our 4-point scale, and a short message to send managers before they start writing reviews."

**Sample rating scale definitions generated:**

```txt
Our performance rating scale:

4 — Exceptional
Consistently exceeds expectations across the review period, with clear,
specific evidence of impact beyond the core scope of the role.

3 — Meets Expectations
Reliably delivers on the goals and responsibilities of the role across
the review period. This is a strong, respected rating — most employees
performing well should land here.

2 — Partially Meets Expectations
Delivers on some goals and responsibilities, but with clear, specific
gaps that need to be addressed with a development plan.

1 — Does Not Meet Expectations
Consistent, significant gaps in core responsibilities, requiring a
formal performance improvement plan.
```

**Sample manager communication generated:**

```txt
Subject: Before you start writing reviews — please read

Before drafting reviews this cycle, please review the rating
definitions above. A few things worth keeping in mind:

- A "3 — Meets Expectations" is a strong, respected rating. It should
  not feel like a disappointing score to give or receive.
- Base your rating on the FULL review period, not just the last few
  weeks — pull up your notes or check-ins from earlier in the cycle.
- Support every rating with specific, observable evidence — what
  happened, and what the business impact was — not general impressions.
- Ratings will go through a calibration step before they're finalized,
  so treat your initial rating as a well-supported first draft, not a
  final decision.
```

**Skill note:**

> ⚠️ Sharing rating definitions after managers have already started writing is far less effective than sharing them before. Managers who've already formed an impression tend to anchor on it, even when the shared definition doesn't match what they had in mind.

## Step 3 — Coaching Managers on Common Rating Biases

**Sample prompt:**

> "Create a short bias-awareness guide I can send to managers before they write reviews, without making it feel like a lecture."

**Generated bias guide:**

| Bias | What it looks like | Quick check before you submit |
|------|--------------------|-------------------------------|
| Recency bias | Rating is mostly based on the last few weeks | Did you review notes from the start and middle of the period, not just recent memory? |
| Halo effect | One strong trait inflates the whole rating | Are you rating each area on its own evidence, not letting one strength carry the rest? |
| Horn effect | One weak area drags down an otherwise strong rating | Are you weighing the full picture, not one bad week or one difficult project? |
| Similarity bias | Rating someone more favorably because they work or communicate like you | Would you rate this the same way if this person had a very different working style than yours? |
| Leniency/severity bias | Rating everyone unusually high or low compared to peers | How does this rating compare to how you rated similar performance last cycle? |

**Skill note:**

> ⚠️ This guide works best framed as a quick self-check, not a formal training module — managers are far more likely to actually use a short table like this while writing than to recall a training session from months earlier.

## Step 4 — Drafting a Sample Review to Model the Standard

**Sample prompt:**

> "Write a sample balanced mid-year review for a Marketing Manager who met most goals but struggled with cross-team collaboration, so I can share it with managers as an example of the standard we want."

**Sample review generated:**

```txt
Overall Performance Summary
[Name] delivered strong results on core campaign goals this period,
including [specific measurable outcome], while facing consistent
challenges collaborating with the Sales team on shared initiatives.
Overall, performance meets expectations for the role, with a clear
opportunity to strengthen cross-team collaboration going forward.

Strengths
- Delivered [specific campaign] on time and under budget, exceeding
  the target [specific metric] by [specific amount]
- Built a repeatable content review process that reduced turnaround
  time on marketing assets by [specific amount]

Areas for Development
- Cross-team projects with Sales were delayed on two occasions this
  period ([specific examples]) due to unclear handoff points. This
  created downstream delays for the Sales team's quarterly goals.
- Recommend establishing a clear weekly sync with the Sales lead and
  documenting handoff responsibilities before the next joint project.

Goals Review
[Goal 1]: Met — [specific evidence]
[Goal 2]: Partially met — [specific evidence and explanation]

Development Plan
- Action: Set up a recurring weekly sync with Sales leadership
  Owner: [Name] | Timeline: Starting next cycle
- Action: Document handoff checklist for joint campaigns
  Owner: [Name], with manager review | Timeline: Within 30 days

Next Period Goals
1. [SMART goal tied to a specific campaign outcome]
2. [SMART goal tied to cross-team collaboration, with a measurable check-in]
```

**Skill note:**

> ⚠️ Sharing one strong example review with managers, rather than only abstract writing guidelines, tends to raise the quality and consistency of the reviews they submit — managers are calibrating their own writing against a concrete standard, not just a set of rules.

## Step 5 — Reviewing a Manager's Draft for Bias Red Flags

**Sample prompt:**

> "A manager submitted this draft review. Can you check it for common bias red flags before it goes to calibration?
>
> 'Overall, [Name] has been great this quarter — they're a rockstar and everyone loves working with them. A couple of small things to work on but nothing major. 4/4.'"

**Evaluation checklist generated by skill:**

### ⚠️ Red flags identified

- [ ] **No specific evidence** — "great," "rockstar," and "everyone loves working with them" are general impressions, not observable, evidence-based statements
- [ ] **Possible halo effect** — a high overall rating with no discussion of specific goals, outcomes, or measurable impact suggests the manager may be rating on general likability rather than documented performance
- [ ] **"Nothing major" with no detail** — even strong performers usually have at least one concrete development area; the complete absence of one is worth double-checking against the full record
- [ ] **No reference to the review period as a whole** — the review doesn't mention specific goals, projects, or a timeframe, making it hard to tell if this reflects the full period or just a recent positive impression

### What to ask the manager before calibration

- "Can you point to two or three specific outcomes or projects that support this rating?"
- "What would you say is one area this person could still grow in, even if it's minor?"
- "How does this compare to how you rated similar performance last cycle?"

## Step 6 — Running the Calibration Meeting

**Sample prompt:**

> "Help me plan a calibration meeting agenda for 12 managers, so it stays fair and doesn't run out of time before we get to everyone."

**Generated calibration meeting plan:**

```txt
CALIBRATION MEETING AGENDA
Attendees: 12 managers + HR facilitator
Duration: 2.5 hours for ~100 employees (roughly 90 seconds per person,
          with more time reserved for edge cases)

Before the meeting:
- HR compiles all initial ratings into a single view, sorted by manager
- HR flags patterns in advance: any manager whose ratings are unusually
  high or low compared to the overall distribution
- HR flags any reviews with vague or unsupported ratings (see Step 5
  checklist) for discussion first, while there's still time

During the meeting:
1. Restate the shared rating definitions (2 min)
2. Walk through flagged outliers first, while time and attention are
   freshest — don't save them for the end
3. For each flagged case: manager states the rating and evidence,
   group discusses, rating is confirmed or adjusted
4. For non-flagged cases: quick confirmation round, only pausing if
   another manager has relevant context
5. HR documents the final rating and, for any adjustment, a one-line
   rationale

After the meeting:
- HR locks final ratings and shares the adjustment rationale with the
  relevant manager, not the wider group
- Managers are given talking points for delivering any adjusted rating,
  framed around the shared standard rather than "what HR decided"
```

**Skill note:**

> ⚠️ Reviewing flagged, harder cases first — rather than working straight down an alphabetical list — matters more than it might seem. Employees reviewed early in a rushed meeting tend to get more careful, detailed discussion than those reviewed once time is running short.

## Step 7 — Distinguishing Self-Assessment, Manager Rating, and Calibrated Rating

**Sample prompt:**

> "An employee asked why their calibrated rating is different from what their manager originally told them. How do I explain the difference between these different 'ratings' floating around?"

**Skill explanation:**

| Stage | Who determines it | What it reflects |
|-------|-------------------|-------------------|
| Self-assessment | The employee | The employee's own view of their performance and evidence, used as input, not a final rating |
| Manager's initial rating | The manager | The manager's assessment based on their own observation and evidence, before comparison to other managers |
| Calibrated rating | Cross-manager calibration, facilitated by HR | The manager's rating checked against a shared standard and adjusted if the evidence doesn't support it relative to peers |

> The calibrated rating is the final, official rating — not because the manager's original view didn't matter, but because it's been checked against a consistent, company-wide standard rather than one manager's individual bar. When explaining an adjustment to an employee, the manager should own the final number and explain it in terms of the shared standard, not distance themselves from it by blaming "what HR decided."

## Full Review Cycle Workflow Summary

```txt
Define and share rating scale definitions before reviews are written
                    ↓
Send manager bias-awareness guide and a model example review
                    ↓
Managers draft initial reviews and ratings, grounded in full-period evidence
                    ↓
HR screens drafts for vague or unsupported ratings before calibration
                    ↓
Calibration meeting: flagged cases discussed first, ratings confirmed or adjusted
                    ↓
Final ratings locked with documented rationale for any adjustments
                    ↓
Managers deliver reviews, owning the final rating and reasoning
                    ↓
Development plans and next-period goals set collaboratively
```

### Common HR Mistakes When Running a Review Cycle

| Mistake | How to avoid it |
|---------|----------------|
| Skipping calibration entirely | Build calibration into the cycle timeline from the start, not as an optional add-on if there's time |
| Sharing rating definitions after managers have already started writing | Send definitions and examples before drafting begins, so managers anchor on the shared standard first |
| Treating calibration as only a check on overly generous ratings | Explicitly surface both overly lenient and overly strict ratings during calibration discussions |
| Running calibration alphabetically instead of flagging outliers first | Review flagged, unclear, or unusual ratings early, while there's still time for real discussion |
| Letting managers blame HR for an adjusted rating | Give managers talking points that frame the final rating around the shared standard, not "what HR decided" |
| Writing reviews based only on recent memory | Encourage managers to pull notes or check-ins from across the full review period before drafting |
| Leaving development plans vague | Require every development plan to include a specific action, owner, and timeline before the review is finalized |
