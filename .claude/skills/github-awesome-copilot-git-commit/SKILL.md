---
name: github-awesome-copilot-git-commit
description: "Generate Conventional Commit messages and assist interactive commits following this repository's commit rules. Produces suggested type, scope, and short summary."
metadata:
  author: "Tuan Duc Tran"
  version: "1.0.0"
---

## Supported tasks

- Generate Conventional Commit suggestions from diffs
- Propose scope names matching repo conventions (e.g., hr-recruiting)
- Interactive commit helper to stage files and craft messages
- Validate existing commit messages against rules
- Suggest PR titles and bodies derived from commit summaries
- Provide commit message templates for different change types
- Offer automated changelog entries from conventional commits
- Help craft release notes from grouped commits

## Key prompts

### Commit generation

- "Create a Conventional Commit for these changed files and summarize: [diff summary]."
- "Suggest the best scope for this change using files list: [files]."
- "Generate a concise summary under 72 chars and imperative mood for this diff."
- "Produce a multi-line commit message with body and footer referencing issues."

### Validation and templates

- "Validate this commit message against the repo's Conventional Commits rules."
- "Provide a template for `feat(hr-recruiting):` when adding a new prompt set."
- "Create a PR title and short description derived from commit messages."
- "Suggest emojis or labels for PRs based on commit types (optional)."

### Changelog and release

- "Group commits into changelog sections (Added, Fixed, Changed) for next release."
- "Draft a release note paragraph from aggregated commit summaries."
- "Mark breaking changes and generate migration notes when present."
- "Produce a commit lint rule snippet for CI to enforce message format."

## Tips

- Use this before `git commit` to produce compliant messages for this repo.
- Prefer small, focused commits to make changelogs clear and reviewable.
- Keep scope names consistent with package or skill directories.
- Run `bun run validate` and tests before generating final release notes.
