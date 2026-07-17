# Mapping Informal Collaboration Networks

## Overview

The formal org chart shows reporting lines; it says almost nothing about how work actually gets done. Organizational network analysis (ONA) maps the informal patterns of communication, collaboration, and influence that run alongside — and often across — the formal structure. It surfaces the people whose departure would quietly damage collaboration despite having no formal authority, and the silos and bottlenecks a reorg based on the org chart alone would miss entirely.

ONA is a diagnostic tool, not a surveillance tool, and the distinction matters both ethically and for the quality of the data — employees who suspect their communication is being monitored for performance judgment will behave differently, degrading the very signal the analysis depends on.

## Designing the Study

Every ONA study starts with a specific question, not a general desire to "understand collaboration." The question determines both data source and network boundary:

- **Collaboration mapping** — who works with whom, and how does that compare to the formal team structure? Useful before a reorg or when assessing cross-functional integration.
- **Influence and information flow** — who do people actually go to for advice or decisions, regardless of title? Useful for succession planning and identifying informal leaders.
- **Silo and bottleneck detection** — where do connections cluster tightly within groups but rarely cross boundaries? Useful for diagnosing why cross-functional initiatives stall.

Define the network boundary explicitly (a single function, a business unit, the whole company) before collecting data — an unbounded study produces a graph too large to interpret meaningfully.

## Data Collection Methods

| Method | What it captures | Trade-offs |
|---|---|---|
| Survey (name generator) | Self-reported relationships, e.g. "who do you go to for advice on X?" | High-quality intent signal, but response burden limits scale and can undercount weak ties |
| Calendar and meeting metadata | Actual meeting co-attendance patterns | Scales easily, but conflates meeting attendance with meaningful collaboration |
| Communication metadata (email/chat, aggregated) | Frequency and reciprocity of contact | Requires strict privacy safeguards; content should never be analyzed, only connection patterns |
| Project and system co-activity | Shared work artifacts, shared repositories or documents | Good for technical and project-based roles; weaker signal for relationship-based influence |

Survey-based name generators remain the gold standard for influence and advice-seeking questions specifically, because metadata can show contact frequency but can't distinguish a substantive advice relationship from routine coordination.

## Privacy and Consent Design

ONA sits closer to the ethical edge of people analytics than most HR data work, because it analyzes relationships between people, not just individual attributes. Non-negotiable design principles:

- **Aggregate reporting only.** Individual-level network positions (who is a "bottleneck," who is "isolated") should never be shared beyond a small governance group with a legitimate need, and never used in performance conversations.
- **Explicit purpose limitation.** State up front what the data will and won't be used for, and hold to it — using ONA data collected for a collaboration study to later inform a layoff decision is a trust-destroying scope change.
- **Opt-in or clearly communicated participation**, with a real explanation of what's being measured — vague consent language undermines both trust and data quality.
- **No content analysis of communications**, only connection metadata (who contacted whom, how often), for any communication-metadata-based study.

## Interpreting Network Metrics

A handful of metrics do most of the analytical work:

- **Centrality** — who has the most connections, or the most influential connections. High centrality often identifies informal leaders and key-person risks the org chart misses.
- **Betweenness** — who sits on the shortest paths between otherwise disconnected parts of the network. High-betweenness individuals are frequently critical bottlenecks or bridges; their departure can fragment collaboration between groups.
- **Density** — how interconnected a group is internally. Low density within a team that should be tightly collaborative is a signal worth investigating.
- **Modularity / cluster boundaries** — where the network naturally splits into subgroups. Comparing these boundaries against the formal org structure reveals silos that don't align with team or department lines.

Metrics should always be interpreted alongside qualitative context. A high-betweenness individual might be a critical, underappreciated bridge — or might simply be in a coordination-heavy role where broad contact is expected and not indicative of unique value.

## From Analysis to Action

An ONA study that ends in a network diagram without recommendations wastes the effort of collecting sensitive relationship data. Typical actions include:

- Redesigning team boundaries to reduce artificial silos revealed by cluster analysis that don't match reporting lines
- Building redundancy around high-betweenness individuals identified as key-person risks, through documentation or deliberate relationship-building with a backup
- Targeting onboarding or integration support at employees who show low connectivity relative to peers at a similar tenure
- Validating (or challenging) succession plans by comparing informal influence patterns against the formal succession slate

## Common Pitfalls

- **Running the study once and treating the map as static.** Networks shift substantially after reorgs, key departures, or major project cycles — a network map older than 12–18 months should be treated as outdated.
- **Confusing high centrality with high performance.** They're correlated but distinct; centrality reflects connectivity, not necessarily quality of output.
- **Skipping the privacy design step because the intent is benign.** Good intent doesn't substitute for explicit governance, and the absence of clear safeguards is what most often undermines trust in the exercise.
