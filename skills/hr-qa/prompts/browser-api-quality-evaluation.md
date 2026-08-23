# Prompt: browser and API quality evaluation

Evaluate a QA candidate's test strategy for a product with browser UI and API surfaces. Classify the answer into risk-based test design, browser automation, API contract coverage, test-data isolation, failure diagnosis, CI placement, and release confidence. Identify whether each claim is supported by a concrete method or only by tool names. Ask follow-up questions about flake triage, authorization, negative cases, observability, and the boundary between fast checks and expensive end-to-end checks.

Return a structured hiring assessment with evidence, gaps, risks, and next-step interview questions. Do not equate Playwright or any single framework with complete quality engineering capability.

References: [Playwright](https://playwright.dev/docs/intro), [OpenAPI](https://spec.openapis.org/oas/latest.html), [OWASP API Security](https://owasp.org/API-Security/).
