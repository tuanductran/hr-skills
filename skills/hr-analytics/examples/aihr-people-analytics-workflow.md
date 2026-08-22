# Example: From an HR question to an evidence-based decision

Use this workflow when a people-related issue needs more than a descriptive dashboard. The analyst starts with a decision question, identifies the workforce outcome and business outcome, defines the smallest reliable dataset, tests plausible drivers, and communicates an intervention with a measurable follow-up.

## Source and editorial scope

This example is an original synthesis based on AIHR's article [What is HR Analytics? All You Need to Know to Get Started](https://www.aihr.com/blog/what-is-hr-analytics/), accessed from the public WordPress API on 2026-08-22. It is not a reproduction of the article. The source distinguishes descriptive, diagnostic, predictive, and prescriptive analysis and describes a workflow that begins with a relevant business question.

## Worked scenario

A business partner notices that voluntary turnover is increasing in one customer-support region. Instead of asking for a generic dashboard, frame the decision question as: **Which controllable factors are associated with voluntary turnover in this region, and which retention intervention should be tested next quarter?**

The analysis should proceed in stages:

1. **Describe the outcome.** Establish the period, population, denominator, and baseline voluntary turnover rate. Report the result by relevant segments such as team, tenure band, role family, and location.
2. **Diagnose possible drivers.** Compare the outcome with consistent measures such as tenure, schedule changes, manager span, compensation movement, absence, engagement, and internal mobility. Check sample sizes and missingness before interpreting a difference.
3. **Test a bounded hypothesis.** For example, assess whether new hires who receive fewer structured check-ins during their first 90 days have a higher subsequent exit rate. Treat the result as an association unless the design supports a causal claim.
4. **Choose an intervention.** Select an action that the business can operate and measure, such as a 30/60/90-day check-in standard for the affected teams. Define the owner, target population, timing, and success metric before launch.
5. **Evaluate and communicate.** Compare the intervention group with an appropriate baseline or comparison group, document limitations, and report both workforce and business outcomes. A lower turnover rate without a stable denominator or a clear observation window is not sufficient evidence of success.

## Quality and governance checks

Do not expose individual-level records in a leadership dashboard. Apply minimum group-size rules, restrict access to sensitive fields, document metric definitions, and record the analysis period and data refresh date. A useful result is reproducible by another analyst and explicit about what the data cannot establish.

## HR practitioner takeaway

The deliverable is not merely a chart. It is a traceable chain from business question to metric definition, data quality checks, hypothesis, decision, intervention, and measured outcome. This keeps HR analytics focused on decisions while reducing the risk of treating correlation as causation or mistaking a reporting artifact for a workforce pattern.
