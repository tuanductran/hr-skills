# Example: evaluating browser and API automation

## Hiring context

A product team has a growing end-to-end suite with intermittent failures and wants a QA automation engineer to improve release confidence.

## Exercise

Give the candidate a checkout flow with a browser UI, an order API, seeded test data, and one known flaky test. Ask them to choose test levels, define API and UI coverage, isolate data, diagnose the flake, and place checks in pull-request, nightly, and release stages.

## Strong evidence

A strong answer uses API checks for contract and negative-case coverage, reserves browser tests for critical user journeys, chooses stable locators, controls synchronization, and captures diagnostics. The candidate separates product defects from environment, data, and test-instability causes using logs, traces, and reproducible steps.

The candidate also explains which tests provide fast feedback, which are expensive or environment-dependent, and how authorization, idempotency, schema validation, and resource limits affect API quality.

## Evaluation prompts

Ask: “Why is this test at the browser level?” “How do you prevent shared test data from creating order dependence?” “What evidence distinguishes a product defect from a flaky test?” “Which checks block a pull request?” “How would you measure release confidence?”

## Source basis

This exercise synthesizes Playwright testing concepts, OpenAPI contract thinking, and OWASP API security risks into an original QA hiring exercise.[1] [2] [3]

## References

[1]: https://playwright.dev/docs/intro "Playwright Documentation"
[2]: https://spec.openapis.org/oas/latest.html "OpenAPI Specification"
[3]: https://owasp.org/API-Security/ "OWASP API Security Top 10"
