---
name: hr-skills
description: "Repository-level skill describing metadata, workflows, and conventions for the hr-skills monorepo. Agents should use this to validate, edit, or operate on SKILL.md files and workspace tasks."
metadata:
  author: "Tuan Duc Tran"
  version: "1.0.0"
---

# HR Skills repository guide

This SKILL provides repository-level facts and guidance so AI tools and agents behave consistently when reading, validating, editing, or publishing `SKILL.md` files in this monorepo.

## Supported tasks

- Explain repository conventions (branching, commit format, publishing workflow)
- Validate SKILL.md file structure and frontmatter against project rules
- Scaffold new `skills/hr-<name>/SKILL.md` templates following repo standards
- Suggest edits to SKILL.md content to comply with lint and validator rules
- Provide CI/snippet recommendations for `bun run` and `turbo` commands
- Produce release checklist and pre-publish checks for maintainers
- Map skill names to directories and update `skills/CATALOG.md` guidance
- Generate contributor-facing instructions for adding or updating skills

## Key prompts

### Repository facts and workflows

- "What are the branch rules and commit conventions for this repo?"
- "List the required `bun run` commands to validate and publish a new skill."
- "Explain the workflow to add a new skill and create a PR ready for `dev`."
- "Summarize the CI steps recommended before releasing to `main`."

### SKILL.md validation and scaffolding

- "Validate this SKILL.md against repo rules and list specific fixes: [content]."
- "Scaffold a `SKILL.md` template for `skills/hr-<name>/` including frontmatter and sections."
- "Rewrite the `description` to include trigger phrases and be at least 50 characters: [text]."
- "Ensure headings have blank lines before lists and flags any markdown lint issues."

### Contributor assistance

- "Generate a Conventional Commit message for this change diff following repo rules."
- "Create a short PR checklist for reviewers that verifies `metadata.author` equals 'Tuan Duc Tran' and other frontmatter rules."
- "Produce an example GitHub Actions job that runs `bun install`, `bun run validate`, and `bun run lint:md`."
- "Provide step-by-step instructions to run the local validator and add a new skill."

## Tips

- Always leave a blank line between a heading and the list that follows (validator enforces this)
- `metadata.author` must be exactly "Tuan Duc Tran" for all SKILL.md files
- Use `bun run sync` after adding/removing `skills/hr-*` directories, then `bun run validate`
- Never commit directly to `main` — open PRs against `dev` and follow Conventional Commits
