---
"hr-skills-build": patch
---

Fixed drift between the surface-local `client/service` and `server/service`
copies of the same contracts: `VersionInfo.apiVersions` was missing
`readiness` on the client, and `SearchRequestSchema`'s `limit`/`maxResults`
validation was looser on the server (accepted non-integers and values below
1). Added a regression test that locks both copies' observable validation
behavior together.
