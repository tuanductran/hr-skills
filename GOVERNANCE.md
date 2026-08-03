# Governance

> Phase 5 of the [roadmap](docs/ROADMAP.md) — how decisions get made, who
> owns what, and how a contribution goes from an idea to a merged,
> maintained part of HR Skills.

This document is the authoritative reference for the project's governance
model. It complements, and does not duplicate, the how-to content already
in [`CONTRIBUTING.md`](CONTRIBUTING.md) and
[`docs/contributing/`](docs/contributing/) — those explain *how* to make a
change; this explains *who decides*, *what "maintained" means*, and *how
the process scales* as the project grows beyond a single maintainer.

Like the rest of `docs/contributing/`, this file marks anything not yet
confirmed by the maintainer as **[Proposed]** rather than stating it as
settled fact. That convention is inherited from an earlier contributor-docs
proposal that flagged review-process and ownership questions as open
before this document existed — this document is where those flags get
resolved.

## Roles

### Maintainer

**[Existing]** `.github/CODEOWNERS` lists a single owner,
[@tuanductran](https://github.com/tuanductran), for the entire repository
today. The maintainer:

- Reviews and merges pull requests
- Triages issues and discussions
- Sets roadmap priority (see [`docs/ROADMAP.md`](docs/ROADMAP.md))
- Owns release decisions (see [`docs/release.md`](docs/release.md))
- Can delegate ownership of a specific area (see
  [Ownership and maintenance](#ownership-and-maintenance) below) as the
  project grows

**[Proposed]** As the project takes on area owners beyond the current
sole maintainer, `.github/CODEOWNERS` gains additional path-scoped entries
(for example a domain expert reviewing all `skills/hr-compensation*/`
changes) without changing this governance model — only the *number* of
people in the maintainer role changes, not the process itself.

### Contributor

Anyone opening an issue, discussion, or pull request. No membership,
invitation, or prior contribution is required. See
[`docs/contributing/onboarding.md`](docs/contributing/onboarding.md) for
the first-timer path.

### Distinguishing the two roles

| | Contributor | Maintainer |
| --- | --- | --- |
| Can open a PR | Yes | Yes |
| Can request changes on a PR | Via review comments | Yes, blocking |
| Can merge a PR | No | Yes |
| Can approve a new skill's scope | Proposes via issue/PR | Decides |
| Sets roadmap priority | Proposes via feedback (see below) | Decides |
| Owns CI/release configuration | No | Yes |

## Contribution guidelines

Guidelines for each contribution type already live close to the content
they govern, rather than being duplicated here:

| Contribution type | Where the guideline lives |
| --- | --- |
| New or updated skill | [`docs/contributing/skill-authoring.md`](docs/contributing/skill-authoring.md), [`docs/format.md`](docs/format.md) |
| Documentation | [`docs/contributing/workflow.md`](docs/contributing/workflow.md), this repository's Markdown/link-lint conventions |
| Tooling / tests (`packages/*`) | `./CONTRIBUTING.md`'s "Improving the build tooling" section, `AGENTS.md`'s Project structure table |
| Pull requests (general) | `.github/pull_request_template.md`, `AGENTS.md`'s branch and commit conventions |

If you're unsure which applies, start at
[`docs/contributing/onboarding.md`](docs/contributing/onboarding.md) — it
routes to the rest.

## Review and approval workflow

This resolves the review-process question left open in an earlier
contributor-docs proposal (item 3) and the `[Unknown]` review-SLA notes in
[`docs/contributing/workflow.md`](docs/contributing/workflow.md) and
[`docs/contributing/onboarding.md`](docs/contributing/onboarding.md).

### 1. Automated gates (required, apply to every PR)

Every PR must pass CI before a maintainer reviews content — this is not
negotiable per-PR and is enforced by `.github/workflows/`:

- `bun run validate` — `SKILL.md` spec compliance
- `bun run check` / `bun run lint` / `bun run lint:md` / `bun run lint:links`
- `bun run typecheck`
- `bun run build`
- `bun run test`
- `bun run knip`

A PR failing any of these is not ready for human review — fix the failure
first. See [`docs/contributing/workflow.md`](docs/contributing/workflow.md)
for what each command checks.

### 2. Manual review criteria (by content type)

The `.github/pull_request_template.md` content-type checklist maps to
these review criteria:

| Content type | A maintainer checks for |
| --- | --- |
| **New skill** | Matches the scope described in its `new_skill.yml` issue (if one exists); doesn't duplicate an existing skill's `description`/trigger phrases (`docs/format.md`); directory name matches `name` field; frontmatter complete |
| **Skill tier upgrade** (Bare/Partial → Full) | `content/`, `prompts/`, `examples/` are non-empty and match the structure, tone, and quality of comparable Full-tier skills (`docs/contributing/skill-authoring.md`) |
| **Content fix** (existing skill) | Factually accurate; doesn't silently change the skill's scope or trigger phrases without discussion |
| **Documentation** | Follows the file's existing structure/style; links resolve (`lint:links`); no report-style restructuring of unrelated sections |
| **Tooling / configuration** (`packages/*`, workflows) | Doesn't break `bun run build`, `sync`, `validate`, or generated artifact staleness checks; has test coverage for new logic |

For any change touching a skill's permissions, shell commands, or external
URLs, [`.github/workflows/skill-review.yml`](.github/workflows/skill-review.yml)
now runs the checklist in
[`.agents/skills/skill-vetter/SKILL.md`](.agents/skills/skill-vetter/SKILL.md)
automatically and posts findings as a PR comment — the same security-first
check applied to third-party skill content generally, not a separate
approval track. This is informational: it doesn't block merge, and a
maintainer can still run the checklist manually for anything the automated
pass doesn't cover.

### 3. Approval

`.github/CODEOWNERS` requires the listed owner's approval before merge —
today that means every PR needs @tuanductran's review, since there is one
owner for the whole tree. There is no separate "approved by two
maintainers" rule because there is currently only one; this document will
be updated if and when `CODEOWNERS` gains area-scoped owners.

### 4. Response time

**[Proposed — confirm or adjust]** No formal SLA is guaranteed given a
single-maintainer project, but the working target is an initial response
(review, question, or "will look later") within **7 days** of a PR or
issue being opened, and every PR gets *some* signal (approve, request
changes, or a reason it's paused) rather than silently sitting open.

## Ownership and maintenance

**[Existing]** `.github/CODEOWNERS` currently reads:

```text
* @tuanductran
```

One line, one owner, entire repository. The table below documents what
"maintained" concretely means per area today — useful context `CODEOWNERS`
alone doesn't convey — and is where future path-scoped owners would be
added first.

| Area | Owner | What maintenance means |
| --- | --- | --- |
| `skills/hr-*/` (content) | @tuanductran | Final say on scope, accuracy, and tier promotion; see [review criteria](#2-manual-review-criteria-by-content-type) |
| `packages/hr-skills-build/`, `packages/skills-ref/` | @tuanductran | Keeps validation/build tooling working; breaking changes here block every other PR via CI, so reviewed with extra care |
| `docs/` (specs: `format.md`, `registry.md`, `release.md`, `integrations.md`, this file) | @tuanductran | Source of truth for conventions; changes here should reflect settled decisions, not proposals — open an issue first for anything contentious |
| `docs/skill-matrix.md`, `registry/skills.json`, `.claude-plugin/marketplace.json` | *(generated, no owner needed)* | Never hand-maintained — regenerated by `bun run matrix` / `registry` / `sync`; a stale generated file is a bug, not a review decision |
| `.github/workflows/` | @tuanductran | CI/release pipeline; changes reviewed against `docs/release.md`'s validation checklist |
| `.agents/skills/` (meta-skills) | @tuanductran | Encodes how Claude Code should help maintain this repo; treat as internal tooling, not contributor-facing content |

**Support expectations:** the maintainer triages issues and reviews PRs on
a best-effort basis (see [Response time](#4-response-time) above). There
is no dedicated support channel beyond GitHub Issues and Discussions (see
below) — this is a solo-maintained open source project, not a product
with a support SLA.

## Issue and discussion templates

**[Existing]** `.github/ISSUE_TEMPLATE/` already provides three structured
templates: `bug_report.yml`, `feature_request.yml`, and `new_skill.yml`.

**[Added]** This governance update adds:

- `.github/ISSUE_TEMPLATE/config.yml` — disables free-form blank issues
  (so every issue starts from a structured template) and links to GitHub
  Discussions for open-ended questions that aren't a bug, feature, or
  skill proposal.
- `.github/DISCUSSION_TEMPLATE/general.yml` and
  `.github/DISCUSSION_TEMPLATE/ideas.yml` — structured starting points for
  Discussions' **General** (questions, help) and **Ideas** (early-stage
  proposals not yet concrete enough for a `new_skill.yml` issue) categories.

**[Proposed — requires maintainer action]** GitHub Discussion templates
only take effect if Discussions is enabled for the repository (Settings →
General → Features → Discussions). If it isn't enabled yet, the templates
in `.github/DISCUSSION_TEMPLATE/` sit inert until it is — this document
recommends enabling it so "Ideas" has a home distinct from
`new_skill.yml`'s more concrete, checklist-driven format.

| Situation | Use |
| --- | --- |
| Something is broken | Issue → Bug Report |
| Concrete new skill proposal | Issue → New Skill Request |
| Small concrete tooling/doc improvement | Issue → Feature Request |
| Early-stage idea, not fully formed | Discussion → Ideas |
| Question, "how do I…", general feedback | Discussion → General |

## Roadmap feedback process

**[Proposed]** Community feedback reaches the roadmap through one path,
kept deliberately simple:

1. **Raise it** as a Discussion (Ideas/General) or Issue (Feature
   Request/New Skill), per the table above.
2. **The maintainer triages it** during regular issue/PR review (see
   [Response time](#4-response-time)) — labeling it, asking clarifying
   questions, or closing it with a reason if it's out of scope.
3. **If accepted, it's reflected in [`docs/ROADMAP.md`](docs/ROADMAP.md)**
   under the relevant phase (or a new one) the next time the roadmap is
   updated. The roadmap itself stays the single source of truth for
   priority — an accepted issue is a candidate for the roadmap, not a
   commitment with a date attached, unless the maintainer says otherwise
   in that issue.
4. **Original submitters are credited** by GitHub's default issue/PR
   linking (the roadmap doesn't separately restate authorship) — closing
   an issue as "planned" and linking it from the roadmap entry is
   sufficient traceability.

There is no separate voting mechanism or public backlog beyond open
Issues/Discussions and `docs/ROADMAP.md` itself — for a solo-maintainer
project, adding a second prioritization surface would fragment feedback
rather than concentrate it. **[Proposed]** If the contributor base grows
enough that issue volume makes triage hard, revisit this (for example,
GitHub's built-in reactions/upvotes on Discussions could become the
signal for prioritization) — not needed yet.

## Related documents

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — minimum steps to get a PR merged
- [`docs/contributing/`](docs/contributing/) — deeper contributor
  walkthroughs (onboarding, workflow, skill authoring, examples)
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — project vision and phased goals
- [`docs/release.md`](docs/release.md) — release lifecycle and versioning
- [`docs/integrations.md`](docs/integrations.md) — supported platforms
- [`.github/CODEOWNERS`](.github/CODEOWNERS) — enforced review requirement
- [`.agents/skills/skill-vetter/SKILL.md`](.agents/skills/skill-vetter/SKILL.md) — security review checklist for skill content
