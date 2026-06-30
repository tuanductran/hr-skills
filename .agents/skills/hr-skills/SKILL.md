---
name: hr-skills
description: "Repository-level skill describing metadata, directory structure, workflows, and conventions for the hr-skills monorepo. Agents should use this to validate, edit, or operate on SKILL.md files, content/ reference docs, and examples/ workflow files."
metadata:
  author: "Tuan Duc Tran"
  version: "1.1.0"
---

# HR Skills repository guide

This SKILL provides repository-level facts and guidance so AI tools and agents behave consistently when reading, validating, editing, or publishing skills in this monorepo. Each skill is not a single file — it is a directory containing a `SKILL.md`, a `content/` reference document, and an `examples/` workflow file, and all three must stay structurally and referentially consistent.

## Repository structure

Each skill lives under `skills/hr-<name>/` with the following layout:

```text
skills/hr-<name>/
├── SKILL.md                          # Frontmatter + supported tasks + key prompts + tips
├── content/
│   └── <name>.md                     # Long-form reference doc ("Understanding X for...")
└── examples/
    └── <scenario-slug>.md            # End-to-end worked example (Context → Steps → Workflow Summary → Mistakes table)
```

- `SKILL.md` is the entry point: frontmatter (`name`, `description`, `metadata`), `## Supported tasks`, `## Key prompts`, and `## Tips`. It should stay prompt-and-trigger focused, not duplicate the full reference content.
- `content/<name>.md` is the deep-dive reference document, named after the skill **without** the `hr-` prefix (e.g. `skills/hr-total-rewards/content/total-rewards.md`, not `content/hr-total-rewards.md`). It follows the fixed skeleton: Overview → What X Actually Means → Key Categories → Core Concepts → How Systems Are Built in Practice → Strong/Weak Signals → Common Misunderstandings → Modern Reality → Key Industry Benchmarks table → Example Workflow (linking to `examples/`) → Conclusion (with quote block).
- `examples/<scenario-slug>.md` is the applied walkthrough. It follows the fixed skeleton: Context → Step 1–8 (Sample prompt → Skill response/walkthrough) → Full Workflow Summary (text diagram) → Common Mistakes table.
- The `content/` file and `examples/` file must cross-link each other via relative paths (`../examples/<slug>.md` and `../content/<name>.md`), and both link targets must actually exist before either file is considered complete.

## Supported tasks

- Explain repository conventions (branching, commit format, publishing workflow, directory layout)
- Validate SKILL.md, content/, and examples/ files against project structure, naming, and frontmatter rules
- Scaffold new `skills/hr-<name>/` directories with `SKILL.md`, `content/<name>.md`, and `examples/<slug>.md` following repo standards
- Suggest edits to SKILL.md, content, or example files to comply with lint, validator, and structural rules
- Verify cross-links between `content/` and `examples/` files resolve correctly
- Provide CI/snippet recommendations for `bun run` and `turbo` commands
- Produce release checklist and pre-publish checks for maintainers
- Map skill names to directories and update `skills/CATALOG.md` guidance
- Generate contributor-facing instructions for adding or updating skills, content docs, and examples

## Key prompts

### Repository facts and workflows

- "What are the branch rules and commit conventions for this repo?"
- "List the required `bun run` commands to validate and publish a new skill."
- "Explain the workflow to add a new skill, its content doc, and its example, then create a PR ready for `dev`."
- "Summarize the CI steps recommended before releasing to `main`."
- "Explain the difference between what belongs in SKILL.md versus content/ versus examples/."

### SKILL.md validation and scaffolding

- "Validate this SKILL.md against repo rules and list specific fixes: [content]."
- "Scaffold a `SKILL.md`, `content/<name>.md`, and `examples/<slug>.md` for `skills/hr-<name>/` including frontmatter and required sections."
- "Rewrite the `description` to include trigger phrases and be at least 50 characters: [text]."
- "Ensure headings have blank lines before lists and flag any markdown lint issues."
- "Confirm the content file is named `<name>.md` without the `hr-` prefix and flag it if not."

### Content and examples consistency

- "Check whether this `content/<name>.md` file follows the required skeleton (Overview through Conclusion) and list missing sections."
- "Check whether this `examples/<slug>.md` file follows the required 8-step skeleton and Common Mistakes table."
- "Verify the cross-links between this content file and its paired example file are correct and the target files exist."
- "Generate a missing `examples/<slug>.md` file to match an existing `content/<name>.md` file's 'Example Workflow' reference."

### Contributor assistance

- "Generate a Conventional Commit message for this change diff following repo rules."
- "Create a short PR checklist for reviewers that verifies `metadata.author` equals 'Tuan Duc Tran', frontmatter rules, content file naming (no `hr-` prefix), and that content/examples links resolve."
- "Produce an example GitHub Actions job that runs `bun install`, `bun run validate`, and `bun run lint:md`."
- "Provide step-by-step instructions to run the local validator and add a new skill with its content and examples files."

## Tips

- Always leave a blank line between a heading and the list that follows (validator enforces this)
- `metadata.author` must be exactly "Tuan Duc Tran" for all SKILL.md files
- Every `skills/hr-<name>/` directory must contain all three pieces — `SKILL.md`, `content/<name>.md`, and `examples/<slug>.md` — a skill is incomplete with only one or two
- The file inside `content/` drops the `hr-` prefix even though the parent skill directory keeps it (e.g. `skills/hr-kpi/content/kpi.md`)
- Keep `SKILL.md` lean (tasks, prompts, tips); put the full conceptual deep-dive in `content/` and the applied walkthrough in `examples/`
- Cross-links between `content/` and `examples/` use relative paths and must be verified before merge — broken links are a common review failure
- Use `bun run sync` after adding/removing `skills/hr-*` directories, then `bun run validate`
- Never commit directly to `main` — open PRs against `dev` and follow Conventional Commits
