# Planning a cross-border M&A integration across US, Germany, and India

## Context

You are the VP of HR Integration at a US-headquartered technology company that has just signed a definitive agreement to acquire a European software firm. The target company has 400 employees: 180 in Germany, 120 in India, and 100 in the US. Deal close is expected in 90 days. The US integration team expects to move at US speed — but the HR integration lead must educate the deal team that Germany and India require fundamentally different approaches. You need to build a cross-country integration plan that respects legal obligations in each market.

## Step 1 — Educate the deal team on country differences

**Sample prompt:**

> "Our US deal team keeps saying we should move fast and announce integration plans at close. I need to explain why Germany requires a completely different approach. Help me frame this."

**Expected skill response:**

Frame the Germany situation in terms the deal team understands — risk and timeline:

**Germany — what the deal team needs to know:**

Germany has a mandatory Works Council (Betriebsrat) consultation requirement before implementing any significant changes affecting employees. This is not optional — it is a legal obligation under the Betriebsverfassungsgesetz (Works Constitution Act).

Key implications:
- The works council must be informed about the acquisition and its planned impact before any implementation actions
- For significant changes (restructuring, role changes, location changes, compensation changes), the works council has a right to negotiate a Social Plan and Interest Balancing Agreement (Interessenausgleich und Sozialplan)
- This process typically takes 60-120 days after close before restructuring actions can be implemented
- Bypassing consultation creates legal exposure and can result in injunctions halting the changes

**Framing for the US deal team:**

> "In Germany, we cannot announce integration changes at close and implement them immediately the way we can in the US. The works council consultation process is not bureaucracy we can skip — it is a legal prerequisite. Our German integration actions should be planned for 90-120 days after close at earliest. We should sequence US integration first, Germany integration second, and plan the integration communications accordingly."

## Step 2 — Map the country-by-country requirements

**Sample prompt:**

> "Help me build a country comparison table covering the three integration markets: US, Germany, and India."

**Generated country comparison matrix:**

| Dimension | United States | Germany | India |
|---|---|---|---|
| Employee consultation requirement | None required | Mandatory works council consultation | None required; notice to employees recommended |
| Restructuring flexibility | At-will employment; high flexibility | Significant restrictions; Social Plan required | Statutory notice and severance; courts scrutinize mass layoffs |
| Redundancy process | Notify state if WARN Act triggered (60 days, 100+ employees); no consultation | Negotiate with works council; Social Plan for severance and support; process takes 3-6 months | Retrenchment requires government approval in some states for companies above 100 employees |
| Benefit harmonization complexity | Moderate — benefits are contractual; state requirements vary | High — works council must approve benefit changes; complex pension obligations | Low — statutory benefits; employer-provided benefits can be adjusted with notice |
| Communication before close | Restricted to publicly available information if listed company | Works council must be informed; employees informed by works council | No formal restriction; manage carefully to avoid anxiety and attrition |
| Culture integration consideration | Change-positive; speed valued | Process and consultation culture; trust built through transparency | Relationship-driven; hierarchy matters; stability signals valued |

## Step 3 — Build the 100-day integration plan

**Sample prompt:**

> "Build a sequenced 100-day HR integration plan that respects the works council process in Germany while keeping the US and India integration on track."

**Generated 100-day plan:**

**Pre-close (Days -90 to 0):**

| Action | US | Germany | India |
|---|---|---|---|
| HR due diligence | Collect contracts, benefits, comp data | Collect contracts, collective agreements, works council agreements, pension obligations | Collect contracts, statutory benefits, gratuity obligations |
| Legal counsel engagement | Employment counsel on WARN obligations | German labor law counsel on works council strategy | India employment counsel on retrenchment rules |
| Integration team structure | Integration leads named | German HR lead and works council liaison named | India HR lead named |
| Communication plan | Draft Day 1 message | Prepare works council notification package | Prepare Day 1 message |

**Day 1-30 — Stabilize:**

| Action | US | Germany | India |
|---|---|---|---|
| Employee announcement | Full announcement: new org, leadership, benefits | Works council formally notified; employees receive factual announcement only | Full announcement: new org, leadership, stability message |
| Works council consultation | N/A | Formal information meeting with works council; begin consultation period | N/A |
| HR operations | Payroll transition, benefits enrollment, system access | No changes until consultation complete | Payroll transition, benefits confirmation |
| Retention risk | Identify flight risk employees; activate retention conversations | Flag flight risk but defer retention changes pending consultation | Identify flight risk; activate retention conversations |

**Day 31-90 — Integration:**

| Action | US | Germany | India |
|---|---|---|---|
| Org structure changes | Implement | Negotiate with works council; implement after agreement | Implement with statutory notice |
| Role changes | Implement | Hold until Social Plan agreed | Implement with notice |
| Compensation harmonization | Complete | Works council consultation required before changes | Complete |
| Benefits harmonization | Complete | Works council approval required | Complete |

**Day 91-100 — Stabilize and learn:**

- Conduct 90-day employee pulse in all three markets
- Review retention data against baseline
- Document integration lessons for next deal
- Close out integration governance; transition to BAU HR

## Step 4 — Design the employee communication approach by country

**Sample prompt:**

> "Write the Day 1 communication approach for each country — the message can't be identical."

**US Day 1 message (direct and complete):**

```text
Subject: [Company] and [Target] are now one company

Team,

Today marks the official close of [Acquirer]'s acquisition of [Target]. This is an exciting
milestone for both companies, and we want to share what this means for you.

What stays the same:
Your employment, compensation, and benefits continue without change through [date].
Your manager and team structure remain in place through [date].

What is changing:
[Describe specific org changes if any, or state "no immediate changes"]
[Benefits transition timeline and what employees need to do]

What comes next:
[Town hall date] — your leadership team will share the combined company strategy
[FAQ link] — answers to the most common questions

Questions? Contact your HR Business Partner or email [integration mailbox].
```

**Germany Day 1 message (factual; major decisions held):**

```text
Subject: Information regarding the acquisition of [Target] by [Acquirer]

Dear colleagues,

We are writing to inform you that the acquisition of [Target] by [Acquirer] has now been completed.

The works council has been informed of the acquisition and will be consulted on any planned changes
that affect working conditions. You will receive further information through the works council
process as it progresses.

Your current employment terms remain in effect. No changes to your contracts, compensation,
or working conditions will be made until the consultation process is complete.

A town hall will be scheduled for [date] where leadership will present the combined company
strategy and answer your questions.
```

**India Day 1 message (stability-focused):**

```text
Subject: An important update: [Target] joins the [Acquirer] family

Dear team,

We are pleased to share that the acquisition of [Target] by [Acquirer] is now complete.

We want to be clear: your employment, compensation, benefits, and working location are not
changing as a result of this transaction. Your direct manager remains your point of contact.

[Acquirer] is committed to India as a strategic market. [City] will be an important engineering
and operations center for the combined company.

We will host a town hall on [date]. Your questions are welcome.

[HR leader name]
```

## Summary

Use `hr-ma-integration-by-country` to identify the legal consultation requirements that control your integration timeline, sequence multi-country integration around the most constrained markets (Germany works council first), adapt communications to local legal and cultural norms, and prevent the US deal team from inadvertently creating legal exposure in international markets by moving at US speed across all jurisdictions.
