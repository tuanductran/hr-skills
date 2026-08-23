# Browser and API quality signals for QA hiring

Quality engineering spans more than checking whether a screen looks correct. A strong QA candidate can connect user behavior, API contracts, test design, failure diagnosis, and delivery risk.

## What to assess

| Signal | Evidence to look for |
| --- | --- |
| Test design | The candidate derives scenarios from requirements, boundaries, state transitions, and risk rather than producing only happy-path cases. |
| Browser automation | The candidate uses stable locators, isolates test data, manages synchronization, captures traces or diagnostics, and explains flake control. |
| API quality | The candidate validates status codes, schemas, authorization boundaries, idempotency, negative cases, and resource limits. |
| Failure diagnosis | The candidate distinguishes product defects, environment failures, data problems, and test instability using evidence. |
| Delivery integration | The candidate explains which tests belong in pull requests, nightly runs, release gates, and production monitoring. |

Playwright is a useful concrete reference for browser automation and test diagnostics. OpenAPI helps establish what an API promises, while OWASP API Security supplies security-oriented failure categories. These sources support a risk-based interview; they do not define QA as a single tool or a single automation framework.[1] [2] [3]

## HR interpretation

For junior roles, assess test case clarity, boundary thinking, and basic defect reporting. For mid-level roles, expect maintainable automation, API coverage, test data strategy, and failure triage. For senior roles, assess quality strategy, risk prioritization, observability, release confidence, and the ability to improve engineering practices across teams.

Do not rank candidates by the number of tools listed. Prefer evidence that the candidate can choose an appropriate test level, explain trade-offs, and reduce uncertainty for the team.

## References

[1]: https://playwright.dev/docs/intro "Playwright Documentation"
[2]: https://spec.openapis.org/oas/latest.html "OpenAPI Specification"
[3]: https://owasp.org/API-Security/ "OWASP API Security Top 10"
