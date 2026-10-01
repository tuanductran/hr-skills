# hr-skills-build

## 0.1.0

### Minor Changes

- 078f2fb: Added the Phase 8.1 service layer for registry search, plan generation, workflow execution, evaluation, health, and version responses.
- 504cf49: Split the reference and build libraries into explicit client-safe and Bun/Node server entrypoints, rename the public reference package to `hr-skills-ref`, and add multi-package TSDoc API generation through `hr-skills-tsdoc`.
- 078f2fb: Added cache, structured observability, readiness checks, and operational guidance for service deployments.
- 078f2fb: Added the version-one readiness contract and aligned client response envelopes with the required API metadata.
- 078f2fb: Added versioned platform-integration contracts for web and external clients, including normalized response envelopes, validation rules, authentication guidance, and rate-limit policies.

### Patch Changes

- Updated dependencies [504cf49]
  - hr-skills-ref@0.1.0
