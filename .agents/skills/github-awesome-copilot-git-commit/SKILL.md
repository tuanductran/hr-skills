---
name: github-awesome-copilot-git-commit
description: Generate high-quality, atomic Conventional Commits by analyzing Git changes, recommending logical commit boundaries, validating commit messages, and assisting with PRs, changelogs, and releases.
metadata:
  author: "Tuan Duc Tran"
  version: "2.0.0"
---

## Supported tasks

### Commit generation

- Generate Conventional Commit messages from Git diffs
- Analyze the current working tree using `git diff`
- Generate commit messages from staged changes using `git diff --cached`
- Infer the best commit type from the actual intent of the change
- Recommend an appropriate scope when it improves clarity
- Write concise subjects in the imperative mood (≤72 characters)
- Generate optional commit bodies explaining what changed and why
- Generate footers for issue references and breaking changes

### Commit review

- Review uncommitted Git changes before creating commits
- Detect unrelated changes mixed in the same diff
- Recommend splitting large changes into multiple atomic commits
- Explain why commits should be separated
- Generate one Conventional Commit for each logical change
- Ignore whitespace-only changes unless intentional

### Interactive Git workflow

- Review `git diff` before staging
- Review `git diff --cached` before committing
- Suggest files that should be committed together
- Recommend staging strategies using `git add -p`
- Help create clean Git history with atomic commits

### Validation

- Validate commit messages against Conventional Commits 1.0.0
- Detect incorrect types, scopes, formatting, or grammar
- Suggest improved commit messages
- Validate subject length
- Detect non-imperative subjects
- Detect unnecessary scopes

### Pull requests

- Generate PR titles from commits
- Generate concise PR descriptions
- Summarize major changes
- Highlight breaking changes
- List testing notes
- Draft reviewer checklists

### Releases

- Generate changelog entries
- Group commits into release categories
- Draft release notes
- Detect breaking changes
- Generate migration notes
- Summarize notable improvements

## Key prompts

### Generate commit from current changes

- "Analyze the current Git working tree by running `git diff` and generate the best Conventional Commit."
- "Review my current changes and recommend whether they should be split into multiple commits."
- "Generate a Conventional Commit from the current unstaged changes."
- "Generate a Conventional Commit from `git diff --cached`."

### Generate commit from provided diff

- "Generate a Conventional Commit from this Git diff."
- "Analyze this patch and create the best Conventional Commit."
- "Determine the intent of this change instead of describing modified files."
- "Write a complete multi-line Conventional Commit including body and footer."

### Improve commit quality

- "Recommend a better commit scope."
- "Suggest a shorter commit subject."
- "Rewrite this commit message following Conventional Commits."
- "Explain why this commit should be split."

### Git workflow

- "Review my Git changes before I commit."
- "Suggest a clean staging strategy using `git add -p`."
- "Identify unrelated modifications."
- "Recommend the optimal commit order."

### Validation

- "Validate this Conventional Commit."
- "Explain why this commit message is invalid."
- "Rewrite this commit following Conventional Commits 1.0.0."

### Pull requests

- "Generate a PR title from these commits."
- "Generate a complete PR description."
- "Summarize these commits for reviewers."

### Releases

- "Generate changelog entries from these commits."
- "Draft release notes for the next version."
- "Generate migration notes for breaking changes."

## Best practices

- Always prioritize atomic commits.
- Focus on the intent of the change rather than modified filenames.
- Infer the correct commit type from behavior, not keywords.
- Add a scope only when it provides meaningful context.
- Keep commit subjects concise, imperative, and under 72 characters.
- Do not end commit subjects with a period.
- Include a body only when it adds useful context.
- Recommend splitting unrelated changes into separate commits.
- Prefer `git add -p` over staging everything when unrelated changes exist.
- Review `git diff` before staging.
- Review `git diff --cached` before committing.
- Generate release notes from grouped Conventional Commits.
- Follow Conventional Commits 1.0.0 whenever possible.

## Conventional Commit types

- **feat** — Introduce a new feature
- **fix** — Fix a bug
- **refactor** — Improve code without changing behavior
- **perf** — Improve performance
- **docs** — Documentation only
- **style** — Formatting without behavior changes
- **test** — Add or update tests
- **build** — Build system or dependencies
- **ci** — Continuous integration
- **chore** — Maintenance tasks
- **revert** — Revert previous commits

## Output guidelines

When generating commits:

1. Analyze the complete Git diff.
2. Identify the primary intent.
3. Detect unrelated logical changes.
4. Recommend splitting commits when appropriate.
5. Produce valid Conventional Commit messages.
6. Keep the history clean and review-friendly.
7. Generate bodies only when they improve understanding.
8. Include breaking-change footers when necessary.

Preferred output format:

```text
type(optional-scope): concise imperative subject

Optional body explaining what changed and why.

BREAKING CHANGE: description (if applicable)
```
