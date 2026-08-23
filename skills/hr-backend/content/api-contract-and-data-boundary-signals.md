# API contract and data-boundary signals for backend hiring

A strong backend candidate should be able to explain not only how an endpoint works, but also the contract that makes it safe for other services and clients to depend on. Review whether the candidate can identify the request and response shape, validation rules, error semantics, compatibility expectations, authentication boundary, and ownership of each data field.

## What to assess

| Signal | Evidence to look for |
| --- | --- |
| Contract clarity | The candidate can describe schemas, required fields, nullable fields, status codes, and backwards-compatibility choices. |
| Boundary ownership | The candidate can explain which service owns a record, where validation happens, and how duplicate or stale writes are handled. |
| Data correctness | The candidate understands transactions, constraints, indexes, isolation trade-offs, and the cost of an unbounded query. |
| Security by design | The candidate considers object-level authorization, input validation, resource limits, and safe error responses. |
| Operational thinking | The candidate includes timeouts, retries, idempotency, logging, metrics, and a migration or rollback path. |

OpenAPI is useful for discussing an explicit API contract, while PostgreSQL documentation provides a concrete vocabulary for constraints, transactions, indexes, and query behavior. MDN remains useful for HTTP semantics. OWASP API Security should be used to test whether a design exposes authorization or resource-consumption risks rather than to memorize a list of names.[1] [2] [3] [4]

## HR interpretation

For junior roles, look for clear request/response reasoning and basic validation. For mid-level roles, expect compatibility, data ownership, and failure handling. For senior roles, require a coherent boundary design that connects API semantics, persistence, authorization, observability, and rollout risk.

Do not treat familiarity with a framework as proof of backend depth. A candidate who can explain why a contract, constraint, transaction boundary, or authorization check exists is showing a more transferable capability than a candidate who only lists libraries.

## References

[1]: https://spec.openapis.org/oas/latest.html "OpenAPI Specification"
[2]: https://developer.mozilla.org/en-US/docs/Web/HTTP "MDN HTTP documentation"
[3]: https://www.postgresql.org/docs/current/ddl-constraints.html "PostgreSQL constraints"
[4]: https://owasp.org/API-Security/ "OWASP API Security Top 10"
