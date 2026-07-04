---
name: hr-skills-maintaining
description: "Repository-level skill describing metadata, directory structure, workflows, and conventions for the hr-skills monorepo. Use this skill when validating, creating, editing, or maintaining HR skill packages, including SKILL.md, content/, prompts/, and examples/."
metadata:
  author: "Tuan Duc Tran"
  version: "1.2.0"
---

# HR Skills repository guide

This skill defines the repository-wide conventions for the **hr-skills** monorepo. It helps AI assistants and contributors consistently create, validate, edit, and maintain skill packages.

Each skill is stored in its own directory under `skills/` and must contain a `SKILL.md`. Supporting documentation may be added through `content/`, `prompts/`, and `examples/`, each serving a distinct purpose.

## Repository structure

Each skill lives under `skills/hr-<name>/`.

```text
skills/hr-<name>/
├── SKILL.md                    # Required
├── content/                    # Optional
│   └── <name>.md
├── prompts/                    # Optional
│   └── <topic>.md
└── examples/                   # Optional
    └── <scenario>.md
```

### File responsibilities

Each file has a single responsibility.

- `SKILL.md` defines activation behavior, supported tasks, prompt summaries, repository metadata, and usage guidance.
- `content/` contains detailed reference documentation, concepts, frameworks, terminology, and best practices.
- `prompts/` stores reusable prompt libraries grouped by a single HR topic.
- `examples/` demonstrates realistic end-to-end HR workflows and business scenarios.

Supporting files should complement each other instead of repeating the same information.

## Supported tasks

- Explain repository conventions, workflows, and directory structure
- Validate skill packages against repository standards
- Scaffold new skills following repository conventions
- Review and improve `SKILL.md`
- Review and improve `content/`, `prompts/`, and `examples/`
- Validate frontmatter and naming conventions
- Verify directory structure and file organization
- Detect duplicated content across files
- Validate Markdown formatting and repository rules
- Verify internal relative links
- Generate contributor guidance
- Produce release and pre-publish checklists
- Generate Conventional Commit messages
- Recommend CI commands using Bun and Turbo
- Update catalog or repository documentation when required

## Key prompts

### Repository management

- "Explain the repository structure and file responsibilities."
- "Describe the workflow for creating a new HR skill."
- "Summarize the repository conventions contributors should follow."
- "List the validation commands required before opening a pull request."
- "Explain the differences between `SKILL.md`, `content/`, `prompts/`, and `examples/`."

### Skill validation

- "Review this skill package against repository standards."
- "Validate this `SKILL.md` and list every issue."
- "Check whether this skill follows naming conventions."
- "Identify duplicated content across all supporting documents."
- "Validate Markdown formatting and internal links."

### Skill scaffolding

- "Scaffold a complete HR skill package."
- "Generate a new `SKILL.md` following repository conventions."
- "Create a matching `content/`, `prompts/`, and `examples/` structure."
- "Generate missing supporting documents for an existing skill."
- "Create repository-compliant frontmatter."

### Content and prompt management

- "Review this reference document for completeness."
- "Generate a reusable prompt library for this HR topic."
- "Organize these prompts into logical categories."
- "Remove duplicated prompts already summarized in `SKILL.md`."
- "Recommend where content should belong within the skill package."

### Contributor assistance

- "Generate a Conventional Commit message."
- "Create a pull request checklist."
- "Generate a GitHub Actions workflow for repository validation."
- "Explain how to add a new skill from start to finish."
- "Review this pull request for repository consistency."

## Tips

- Always include a `SKILL.md` in every skill package.
- Keep `SKILL.md` concise and focused on activation, tasks, prompts, and guidance.
- Store conceptual documentation in `content/`.
- Store reusable prompt collections in `prompts/`.
- Store realistic business workflows in `examples/`.
- Avoid duplicating information across supporting documents.
- Name directories and files using kebab-case.
- Files inside `content/` should omit the `hr-` prefix (for example, `skills/hr-kpi/content/kpi.md`).
- Organize prompt libraries around a single HR topic.
- Validate Markdown formatting, naming conventions, and internal links before committing.

## Best practices

- Keep each document focused on a single responsibility.
- Prefer reusable HR knowledge over organization-specific content.
- Use descriptive headings instead of long paragraphs.
- Cross-reference related documents rather than duplicating information.
- Keep prompt libraries easy to browse and maintain.
- Use realistic HR scenarios in workflow examples.
- Keep repository documentation synchronized whenever a skill changes.

## Common mistakes

- Putting long conceptual documentation inside `SKILL.md`.
- Duplicating prompts between `SKILL.md` and `prompts/`.
- Mixing multiple unrelated topics in one prompt library.
- Using inconsistent skill or directory names.
- Naming `content/` files with the `hr-` prefix.
- Forgetting to update internal links after renaming files.
- Creating examples without realistic business context.
- Allowing supporting documents to become inconsistent with `SKILL.md`.

## Naming conventions

| Item | Convention |
|------|------------|
| Skill directory | `skills/hr-kebab-case/` |
| `name` field | Matches the directory name |
| Content file | Skill name without the `hr-` prefix |
| Prompt file | Descriptive kebab-case topic |
| Example file | Scenario-based kebab-case filename |
| Markdown headings | Follow sequential heading levels |
| Internal links | Always use relative paths |
