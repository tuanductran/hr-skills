# Suggested edits to `CONTRIBUTING.md`

All suggestions are additive or clarifying — nothing in the current file is incorrect, so
nothing needs to be removed. Each item states the exact location and proposed text.

---

## 1. Expand "Before you submit" to match CI — **[Proposed]**

**Where:** the `## Before you submit` section, current code block.

**Why:** `.github/workflows/` runs `test.yml` and `knip.yml` as separate CI jobs, and
`lint:links` is a real script that matters for any change touching `docs/` or `skills/`, but
none of the three appear in the local pre-submit checklist. A contributor who only runs the
documented five commands can still fail CI.

**Current:**

```bash
bun run validate    # Validate all SKILL.md files
bun run check       # 0 Biome check errors required
bun run lint:md     # 0 markdownlint errors required
bun run typecheck   # 0 TypeScript errors required
bun run build       # All workspace builds must complete successfully
```

**Proposed replacement:**

```bash
bun run validate     # Validate all SKILL.md files
bun run check        # 0 Biome check errors required
bun run lint:md       # 0 markdownlint errors required
bun run lint:links    # No broken links in docs/ or skills/
bun run typecheck    # 0 TypeScript errors required
bun run build        # All workspace builds must complete successfully
bun run test          # All workspace tests must pass
bun run knip          # No unused files or dependencies introduced
```

---

## 2. Link out to `docs/contributing/` — **[Proposed]**

**Where:** add a short paragraph directly under the `# Contributing` H1, before `## Prerequisites`.

**Why:** gives external contributors a map before they hit the setup steps, without bloating
this file. Non-invasive — everything currently in CONTRIBUTING.md stays exactly where it is.

**Proposed addition:**

```markdown
For a deeper walkthrough — repository architecture, the full contributor journey, and worked
examples — see [`docs/contributing/`](./docs/contributing/onboarding.md). This file covers
the minimum steps to get a pull request merged.
```

---

## 3. Clarify PR review expectations — **[Unknown, needs maintainer input]**

**Where:** end of `CONTRIBUTING.md`, after `## Questions`.

**Why:** `.github/CODEOWNERS` shows a single owner (`@tuanductran`) for the whole repository.
No SLA or backup-reviewer path is documented anywhere. This is not something to invent —
flagging it so the maintainer can add a line if desired.

**Proposed placeholder (maintainer to fill in the specifics):**

```markdown
## Review process

Pull requests are reviewed by the repository owner (see `.github/CODEOWNERS`).
<!-- maintainer: add expected turnaround time / escalation path here if applicable -->
```

---

## 4. Optional: reference `skill-vetter` if it's part of human review — **[Unknown, needs maintainer input]**

**Where:** `## Adding a new skill`, after step 4 ("Validate and package").

**Why:** `.agents/skills/skill-vetter/SKILL.md` exists in the repository but is never
referenced from any contributor-facing document. If it encodes the actual review bar
maintainers apply, linking it would help contributors self-check before opening a PR. If it's
Claude-Code-only tooling, no change is needed — do not add this without confirming intent.

**Proposed addition (only if confirmed applicable to human contributors):**

```markdown
Before opening a pull request, you can self-review against the same checklist maintainers use:
see [`.agents/skills/skill-vetter/SKILL.md`](../.agents/skills/skill-vetter/SKILL.md).
```

---

## Summary of changes

| # | Change | Confidence | Action needed |
|---|---|---|---|
| 1 | Expand pre-submit checklist | **[Proposed]**, low-risk, matches existing scripts/CI | Safe to merge |
| 2 | Link to `docs/contributing/` | **[Proposed]**, depends on that subtree being added | Merge together with subtree |
| 3 | Review process note | **[Unknown]** | Needs maintainer to supply content |
| 4 | `skill-vetter` reference | **[Unknown]** | Needs maintainer to confirm intent |
