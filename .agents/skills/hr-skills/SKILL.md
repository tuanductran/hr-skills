---
name: hr-skills
description: "Repository-level skill describing metadata, directory structure, workflows, and conventions for the hr-skills monorepo. Agents should use this to validate, edit, or operate on SKILL.md files, content/ reference docs, and examples/ workflow files."
metadata:
  author: "Tuan Duc Tran"
  version: "1.1.0"
---

# HR Skills repository guide

This SKILL provides repository-level facts and guidance so AI tools and agents behave consistently when reading, validating, editing, or publishing skills in this monorepo. Each skill is a directory containing a required `SKILL.md`. Skills may also include an optional `content/` reference document and an optional `examples/` workflow file. When present, these additional files should remain structurally and referentially consistent.

## Repository structure

Each skill lives under `skills/hr-<name>/` with the following layout:

```text
skills/hr-<name>/
├── SKILL.md                    # Required
├── content/                    # Optional
│   └── <name>.md
└── examples/                   # Optional
    └── <scenario-slug>.md
```

- `SKILL.md` is required for every skill. It is the entry point and contains the frontmatter (`name`, `description`, `metadata`), `## Supported tasks`, `## Key prompts`, and `## Tips`. It should stay prompt-focused and avoid duplicating long-form reference content.
- `content/<name>.md` is optional. When present, it provides a deep-dive reference document named after the skill without the `hr-` prefix (for example, `skills/hr-total-rewards/content/total-rewards.md`). It should follow the repository's standard content structure.
- `examples/<scenario-slug>.md` is optional. When present, it provides an end-to-end applied workflow demonstrating how to use the skill in a realistic scenario.
- If both `content/` and `examples/` exist, they should cross-link each other using relative paths (`../examples/<slug>.md` and `../content/<name>.md`). Links should always resolve successfully.

## Supported tasks

- Explain repository conventions (branching, commit format, publishing workflow, directory layout)
- Validate SKILL.md, content/, and examples/ files against project structure, naming, and frontmatter rules
- Scaffold new `skills/hr-<name>/` directories with a required `SKILL.md` and optional `content/<name>.md` and `examples/<slug>.md` following repository standards
- Suggest edits to SKILL.md, content, or example files to comply with lint, validator, and structural rules
- Verify cross-links between `content/` and `examples/` files when both files are present
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
- "Generate an optional `content/<name>.md` or `examples/<slug>.md` file that complements an existing skill when requested."

### Contributor assistance

- "Generate a Conventional Commit message for this change diff following repo rules."
- "Create a short PR checklist for reviewers that verifies `metadata.author` equals 'Tuan Duc Tran', frontmatter rules, optional content file naming (no `hr-` prefix), and validates content/examples links when those files are present."
- "Produce an example GitHub Actions job that runs `bun install`, `bun run validate`, and `bun run lint:md`."
- "Provide step-by-step instructions to run the local validator and add a new skill with its content and examples files."

## Tips

- Always leave a blank line between a heading and the list that follows (validator enforces this)
- `metadata.author` must be exactly "Tuan Duc Tran" for all SKILL.md files
- Every `skills/hr-<name>/` directory must contain all three pieces — `SKILL.md`, `content/<name>.md`, and `examples/<slug>.md` — a skill is incomplete with only one or two
- The file inside `content/` drops the `hr-` prefix even though the parent skill directory keeps it (e.g. `skills/hr-kpi/content/kpi.md`)
- Keep `SKILL.md` lean (tasks, prompts, tips); put the full conceptual deep-dive in `content/` and the applied walkthrough in `examples/`
- Every skill must include a `SKILL.md`; `content/` and `examples/` are optional but recommended for larger or more educational skills.
- When a `content/` file exists, name it without the `hr-` prefix (for example, `skills/hr-kpi/content/kpi.md`).
- Keep `SKILL.md` lean (tasks, prompts, tips). Move conceptual deep-dives into `content/` and practical walkthroughs into `examples/` when those optional documents are included.
- If both `content/` and `examples/` exist, ensure their relative cross-links resolve correctly before merging.
