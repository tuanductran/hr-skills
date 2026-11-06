# Source Import Inventory

- **Status:** Read-only engineering utility
- **Related issue:** [#287](https://github.com/tuanductran/hr-skills/issues/287)
- **Implementation:** `scripts/audit-import-graph.ts`

## Run

From the repository root:

```sh
bun run audit:imports
```

The command writes a stable JSON report to standard output. To retain a local snapshot for review:

```sh
bun run audit:imports > import-inventory.json
```

The output file is intentionally not committed by the command. Reviewers can compare snapshots from the base and proposed branch without adding generated inventory to the repository.

## What it records

- Source files with TypeScript, TSX, JavaScript, JSX, MJS and CJS extensions.
- Static imports, re-exports, import-type references, literal `require()` calls and literal `import()` calls.
- Internal workspace package references, mapped to the owning workspace even when a package export points at generated `dist/` output.
- Workspace dependency declarations from root and workspace `package.json` files, including dependency section.
- Unresolved relative imports and non-literal dynamic `import()` calls that need manual inspection.

The report sorts files and edges before serialization so repeated runs against the same worktree produce the same logical JSON. The pull-request lint workflow runs the command as a smoke test and discards the report output.

## Scope and limitations

The scanner excludes `.git`, `.turbo`, `node_modules`, `dist`, `.next`, `out` and `coverage`. It does not modify source files, manifests, package exports, workflows or generated artifacts.

This is a static reference inventory, not a complete runtime dependency graph or dead-code detector. It cannot infer computed module specifiers, runtime plugin loading, reflection, or imports assembled from variables. Non-literal dynamic imports are counted but not resolved. External packages are recorded as external edges and are not expanded. A recorded import is evidence of a reference, not proof that a feature is essential or removable.

Before removing or moving any module, package, export, dependency or workflow, inspect the exact changed tree, review unresolved and dynamic edges, verify all known consumers, and run the retained build/validation workflow from a clean checkout. Do not use this report alone as deletion authorization.
