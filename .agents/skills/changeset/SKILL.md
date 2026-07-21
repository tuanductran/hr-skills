---
name: changeset
description: Use when determining whether a pull request requires a changeset, selecting the appropriate version bump (patch, minor, or major), or writing a `.changeset/*.md` entry for the hr-skills repository.
compatibility: hr-skills monorepo
---

# Changeset

## Purpose

Use this skill whenever a pull request introduces **user-visible changes*- that should be included in the next release of the `hr-skills` repository.

A changeset records release notes, determines semantic version bumps, and drives `CHANGELOG.md` generation through Changesets.

Do **not*- create a changeset for internal-only work that has no effect on repository users.

---

## Decision Process

Before creating a changeset, inspect the pull request and classify the changes.

### A changeset is required

Create a changeset for changes such as:

- New skills.
- New prompts.
- New examples.
- New generators.
- New validators.
- New build capabilities.
- New CLI functionality.
- Bug fixes affecting repository behavior.
- User-visible documentation improvements that change repository capabilities.
- Any change that should appear in release notes.

### A changeset is usually **not*- required

Do **not*- create a changeset for work such as:

- Typo fixes.
- Markdown formatting.
- README wording improvements.
- Internal refactoring.
- Code movement without behavior changes.
- Test-only changes.
- CI configuration updates that do not affect released functionality.
- Comments or cleanup work.

When uncertain, prefer consistency with previous releases and existing changesets in the repository.

---

## Create a Changeset

Generate a new changeset:

```bash
bun run changeset
```

Follow the interactive prompts or edit the generated file inside:

```text
.changeset/
```

A typical file looks like:

```markdown
---
"hr-skills": patch
---

Added support for validating duplicate skill names during repository validation.
```

Do not modify the YAML frontmatter format.

Use the exact package name defined by the repository.

---

## Choose the Correct Version Bump

### patch

Use for backward-compatible fixes and small improvements.

Examples:

- Bug fixes.
- Prompt improvements.
- Example improvements.
- Validator fixes.
- Tooling corrections.
- Content corrections.
- Small enhancements that do not introduce new functionality.

---

### minor

Use for new functionality that is backward compatible.

Examples:

- New skill.
- New prompt library.
- New examples.
- New validator.
- New CLI command.
- New build capability.
- New repository feature.

---

### major

Use for breaking changes.

Examples:

- Breaking changes to SKILL.md format.
- Breaking package API changes.
- Folder layout changes requiring migration.
- Removed repository functionality.
- Incompatible validator behavior.
- Repository architecture changes requiring user action.

---

## Writing Guidelines

A good changeset explains **what changed*- and **why it matters**, not how it was implemented.

### General Rules

- Focus on user-visible outcomes.
- Write concise release notes.
- Prefer one to three short sentences.
- Use clear, direct language.
- End every sentence with a period.
- Keep descriptions suitable for inclusion in `CHANGELOG.md`.

---

### Use Past Tense

Describe completed work using past tense.

Examples:

```text
Added a new HR analytics skill.
Fixed duplicate validation logic.
Updated the onboarding examples.
```

---

### Describe Outcomes

Prefer:

```text
Added validation for duplicate skill names.
```

Instead of:

```text
Modified validator.ts.
```

Release notes should describe the effect of the change, not the implementation details.

---

### New Skills

Example:

```text
Added a new `hr-virtual-onboarding` skill covering remote onboarding workflows, manager checklists, and AI-assisted onboarding prompts.
```

---

### Bug Fixes

When appropriate, reference the GitHub issue.

Example:

```text
Fixed #42 by correcting turnover calculation guidance in the HR analytics content.
```

---

### Tooling

Example:

```text
Updated repository validation to require prompts and examples for Full-tier skills.
```

---

## Avoid

Do not:

- Copy commit messages.
- List every modified file.
- Describe internal refactoring.
- Include implementation details.
- Repeat repository structure.
- Write long release notes.
- Add Markdown headings inside the description except `####` or lower if absolutely necessary.

---

## Validation Checklist

Before finishing:

- Verify a changeset is actually required.
- Verify the selected version bump is correct.
- Verify the package name is correct.
- Verify the description is concise and user-facing.
- Verify Markdown formatting.
- Verify the generated file is located inside `.changeset/`.

Do not edit generated changelog files manually.

---

## References

- `AGENTS.md`
- `README.md`
- `docs/format.md`
- `.changeset/`
- `CHANGELOG.md`
- Changesets documentation: https://github.com/changesets/changesets/tree/main/docs
- Conventional Commits: https://www.conventionalcommits.org/
