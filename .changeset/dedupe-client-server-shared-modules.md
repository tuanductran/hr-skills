---
"hr-skills-build": minor
"hr-skills-ref": minor
---

Deduplicated the byte-identical `client/` and `server/` copies of shared
planner, runtime, search, parser, schema, and type logic into a new
`src/shared/` directory in both packages, re-exported from each surface's
existing entrypoints. This removed 18 duplicated files in `hr-skills-build`
and 4 (plus 3 duplicated helper functions) in `hr-skills-ref` — duplication
that had already drifted into real bugs (see the
`service-contract-client-server-parity` changeset). Public exports and
import paths are unchanged.

Added an automated guard (`bun run verify-client-bundle`, wired into `build`)
that scans the built client bundle's full import graph for Node.js built-in
imports, so a future addition to `src/shared/` that accidentally depends on
`node:*` fails the build instead of shipping to the browser silently. A
companion test (`test/shared/node-boundary.test.ts` in `hr-skills-build`,
`test/shared-node-boundary.test.ts` in `hr-skills-ref`) checks the same
constraint at the source level, so `bun test` catches a violation without
needing a full build first.
