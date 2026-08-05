# Skill authoring guidelines

## Purpose

Help a contributor produce a structurally valid, discoverable skill on the first attempt,
before running `bun run validate`. This page is a practical walkthrough; the authoritative
specification remains [`docs/format.md`](../format.md) — if anything here and `docs/format.md`
ever disagree, `docs/format.md` wins, and this page should be corrected to match.

## Explanation

Every HR skill lives in its own directory under `skills/`. A skill package consists of a
required `SKILL.md` file and may include supporting material in `content/`, `prompts/`, and
`examples/`. All of this is **[Existing]**, taken from `docs/format.md` and confirmed against
`.github/skill-template.md` and sampled skills such as `skills/hr-onboarding/`.

## Existing behavior — required structure

```text
skills/hr-your-skill/
├── SKILL.md          # required
├── content/           # optional, but if present: no empty dirs, ≥1 .md file
├── prompts/            # optional, same rule
└── examples/           # optional, same rule
```

- Directory name: lowercase, hyphens only, must start with `hr-`.
- Directory name must exactly match the `name` field in `SKILL.md` frontmatter.

## Existing behavior — maturity tiers

| Tier | Requirement |
|---|---|
| 🔴 Bare | `SKILL.md` only |
| 🟡 Partial | `SKILL.md` + 1–2 non-empty supporting dirs |
| 🟢 Full | `SKILL.md` + all three supporting dirs, each with at least one `.md` file |

> **Subdirectory rule [Existing]:** empty supporting directories are strictly forbidden. Any
> `content/`, `prompts/`, or `examples/` directory present on disk must contain at least one
> `.md` file, or validation fails.

## Step-by-step: creating a new skill

1. `mkdir skills/hr-your-skill-name`
2. Copy the frontmatter and body structure from `.github/skill-template.md` into
   `skills/hr-your-skill-name/SKILL.md`. This template is the canonical source — don't
   hand-recreate the structure from memory.
3. Fill in frontmatter:
   - `name`: kebab-case, matches the directory name exactly
   - `description`: at least 50 characters, states the HR domain, the target audience, and
     realistic trigger phrases (for example `"write a job description"`,
     `"analyze turnover"`) — this is the single field that determines whether an assistant
     ever activates the skill
   - `metadata.author`, `metadata.version` (start new skills at `"1.0.0"`)
4. Write the required body sections:
   - **Supported tasks** — a bullet list, **8–12 items required** (`bun run validate`
     fails outside this range, it isn't just a suggestion)
   - **Key prompts** — **3–6 subtopics required**, each with **4–7 numbered prompts
     required**, using `[placeholders]` for variable inputs
   - **Tips** — **4–6 bullets required** of practical, professional guidance
5. (Recommended for Full tier) Add `content/*.md`, `prompts/*.md`, `examples/*.md`:
   - `content/*.md` — explains concepts in depth (Overview / Main topics / Practical guidance
     is a typical, not mandatory, shape)
   - `prompts/*.md` — a focused prompt library for one subtopic, introduction plus a list of
     reusable prompts
   - `examples/*.md` — a realistic end-to-end workflow (Context / Step 1..N / Workflow summary
     is a typical, not mandatory, shape)
6. Run `bun run sync` to regenerate `.claude-plugin/marketplace.json` from the new frontmatter.
7. Update the root router so the skill is discoverable. **[Existing, CONTRIBUTING.md]** Follow
   the procedure in
   [`.agents/skills/hr-root-router-maintaining/SKILL.md`](../../.agents/skills/hr-root-router-maintaining/SKILL.md),
   which documents the canonical routing sections, exact table row format, and the rule to bump
   the router's patch version on every change.
8. Run `bun run validate` — must pass with 0 errors before continuing.
9. Run `bun run matrix` and `bun run registry` to refresh the generated reports.
10. Open a pull request against `dev` (see `docs/contributing/workflow.md`).

## Existing behavior — naming conventions

- Skill directories: `hr-<kebab-case-domain>`
- `content/`, `prompts/`, `examples/` files: descriptive kebab-case, for example
  `employee-lifecycle.md`, `behavioral-interview-prompts.md`,
  `conducting-an-exit-interview.md`

## Best practices

- Write the `description` for activation accuracy first — get this right before filling in
  the rest of the file.
- Keep `SKILL.md` focused on *what to do*; push deep explanation into `content/`, prompt
  collections into `prompts/`, and worked scenarios into `examples/`. Avoid duplicating the
  same material across files — **[Existing, docs/format.md]** this is called out explicitly
  as something to avoid.
- Avoid vendor marketing language and time-sensitive facts (specific compliance thresholds,
  salary figures) that will go stale — **[Existing, docs/format.md]**.

## Common mistakes

- Description under 50 characters or missing realistic trigger phrases → weak or no
  activation by the assistant.
- Creating an empty `content/`, `prompts/`, or `examples/` folder "for later" — fails
  validation immediately.
- Forgetting the root router update — the skill exists on disk but is undiscoverable through
  the root `SKILL.md` entry point.
- Mismatched `name` frontmatter vs. directory name.
- Writing prompt libraries inside `content/*.md`, or long explanatory prose inside
  `prompts/*.md` — **[Existing, docs/format.md]** each file type has a distinct purpose and
  the spec explicitly lists these as things to avoid.

## Suggested improvements

- **[Proposed]** `docs/format.md` already contains a "Quality checklist" at its end;
  consider linking to it directly from `.github/pull_request_template.md`'s "Validation"
  section so contributors see it at PR-creation time, not just while reading docs.

## Unknown or ambiguous information

- **[Unknown]** Whether `content/`, `prompts/`, and `examples/` file counts have an upper
  recommended bound (the spec gives ranges for sections inside `SKILL.md` itself — supported
  tasks, key prompts, tips — but not for the number of files in the supporting directories).
  Worth asking the maintainer if very large supporting directories should be split.
