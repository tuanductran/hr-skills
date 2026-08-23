# Example: evaluating API contract and data-boundary reasoning

## Hiring context

A platform team needs a backend engineer to extend an employee-directory service used by several internal applications.

## Exercise

Ask the candidate to design an endpoint for changing an employee's manager. Require a request schema, response and error cases, authorization boundary, persistence behavior, idempotency choice, audit trail, rollout plan, and tests.

## Strong evidence

A strong answer identifies the resource owner, validates that both employees exist, prevents unauthorized cross-tenant changes, handles repeated requests safely, and explains the transaction boundary. The candidate distinguishes client-visible contract errors from server failures and proposes schema/version compatibility rather than silently changing fields.

The candidate should also mention indexes or constraints where relevant, bounded queries, observability, and how a migration can be rolled back. Framework syntax is secondary to the reasoning behind the contract and data boundary.

## Evaluation prompts

Ask: “Which service owns this relationship?” “What happens if the request is repeated?” “How would an older client behave after the change?” “Which authorization checks are object-level?” “How would you test a partial failure?”

## Source basis

This exercise synthesizes HTTP semantics, OpenAPI contracts, PostgreSQL data behavior, and OWASP API risk categories into an original hiring exercise.[1] [2] [3] [4]

## References

[1]: https://developer.mozilla.org/en-US/docs/Web/HTTP "MDN HTTP documentation"
[2]: https://spec.openapis.org/oas/latest.html "OpenAPI Specification"
[3]: https://www.postgresql.org/docs/current/ddl-constraints.html "PostgreSQL constraints"
[4]: https://owasp.org/API-Security/ "OWASP API Security Top 10"
