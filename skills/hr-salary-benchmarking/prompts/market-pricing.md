# Market pricing prompt library

Use these prompts to generate salary benchmarking artifacts that go deeper than the prompt summaries in `SKILL.md`.

## Job matching

```text
Create a job matching worksheet for [internal role]. Use [job description], [leveling criteria], and [business context] to compare likely benchmark matches. Include match strength, differences in scope, assumptions, and questions for the hiring manager or compensation partner.
```

```text
Review these benchmark job codes for [internal role]: [job codes and descriptions]. Recommend the best match or blended approach, explain why title alone is insufficient, and identify any data-quality concerns.
```

## Data source evaluation

```text
Evaluate [survey/vendor/data source] for benchmarking [role family] in [market]. Assess relevance, sample quality, data freshness, geography coverage, compensation elements, methodology transparency, and limitations.
```

```text
Create a market data hierarchy for [company context] that explains which sources to use first for executive, professional, hourly, sales, technical, and international roles.
```

## Range building

```text
Build a salary range recommendation for [role] using this benchmark data: [data]. Apply [compensation philosophy], [target percentile], [range spread], and [geography approach]. Show calculations, assumptions, and decision points for compensation review.
```

```text
Create options for addressing a role where market data is thin: [role context]. Compare proxy roles, blended benchmarks, internal leveling, recruiter intelligence, and targeted survey purchase. Recommend a defensible approach.
```

## Competitiveness review

```text
Assess pay competitiveness for [employee group] against [benchmark range or percentile]. Identify employees below range, above range, near compression points, or misaligned with level. Include internal equity cautions and recommended next actions.
```

```text
Prepare an executive summary of salary benchmarking findings for [function]. Include market position, critical gaps, budget impact, risks of no action, recommended adjustments, and governance decisions needed.
```

## Output checks

For every output, verify that it:

- states data sources, dates, assumptions, and match quality
- distinguishes base pay from total compensation
- avoids presenting weak market data as precise
- includes internal equity and compression checks
- documents approval requirements for exceptions
