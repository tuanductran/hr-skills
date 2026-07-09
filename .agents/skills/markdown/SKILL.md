---
name: markdown
description: "Repository guidance for writing, formatting, and validating Markdown documentation using markdownlint-cli, case-police, and markdown-link-check within the hr-skills monorepo."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# Markdown

This skill describes how Markdown documentation is maintained throughout the **hr-skills** monorepo.

The repository standardizes on three complementary tools:

- **markdownlint-cli** for Markdown linting and formatting rules
- **case-police** for capitalization and terminology consistency
- **markdown-link-check** for validating repository links

Together these tools help keep documentation consistent, readable, and easy to maintain.

## Supported tasks

- Explain Markdown conventions used by this repository
- Review Markdown structure and formatting
- Fix markdownlint-cli diagnostics
- Validate Markdown links
- Review heading hierarchy
- Check capitalization consistency
- Detect broken repository links
- Recommend repository-compliant Markdown
- Troubleshoot Markdown validation failures

## Repository conventions

Repository documentation should:

- follow a logical heading hierarchy
- use fenced code blocks
- keep related content together
- use descriptive headings
- prefer relative links within the repository
- avoid duplicated documentation
- remain readable in both source and rendered form

Markdown quality is validated through formatting, capitalization, and link verification.

## Repository tooling

### markdownlint-cli

Responsible for:

- Markdown syntax validation
- heading hierarchy
- document structure
- fenced code blocks
- list formatting
- repository Markdown conventions

The repository uses a shared markdownlint configuration together with
`.markdownlintignore` to ensure consistent documentation across all packages.

Repository configuration includes:

- maximum line length disabled
- duplicate headings allowed in different sections
- multiple H1 headings permitted
- fenced code blocks required
- table column alignment not enforced

### case-police

Responsible for:

- capitalization consistency
- repository terminology
- naming conventions
- heading capitalization

This helps keep documentation consistent across the entire repository.

### markdown-link-check

Responsible for:

- validating relative links
- detecting broken repository references
- checking Markdown links

Repository configuration ignores:

- external URLs
- root-relative paths
- anchor links
- numeric references

## Common commands

Validate Markdown documentation.

```bash
bun run lint:md
```

Automatically apply supported fixes.

```bash
bun run lint:md:fix
```

Run markdownlint-cli directly.

```bash
markdownlint .
```

Run markdown-link-check directly.

```bash
markdown-link-check
```

Run case-police directly.

```bash
case-police .
```

## Key prompts

### Markdown

- "Review this Markdown document."
- "Fix markdownlint-cli diagnostics."
- "Improve the document structure."
- "Review the heading hierarchy."

### Documentation

- "Rewrite this document following repository conventions."
- "Recommend repository-compliant Markdown."
- "Detect duplicated content."
- "Improve readability."

### Links

- "Validate repository links."
- "Detect broken references."
- "Review relative links."
- "Explain markdown-link-check diagnostics."

### Terminology

- "Review capitalization consistency."
- "Fix case-police diagnostics."
- "Normalize repository terminology."
- "Review heading capitalization."

## Examples

Validate repository documentation.

```bash
bun run lint:md
```

Automatically apply supported fixes.

```bash
bun run lint:md:fix
```

## Tips

- Write descriptive headings.
- Keep heading levels sequential.
- Prefer relative links within the repository.
- Use fenced code blocks consistently.
- Keep terminology consistent across documentation.
- Run Markdown validation before committing documentation changes.

## Common issues

- Skipping heading levels.
- Broken relative links.
- Inconsistent capitalization.
- Mixed heading styles.
- Duplicated documentation.
- Invalid Markdown formatting.

## Best practices

- Keep each document focused on a single topic.
- Write Markdown that is easy to read in source form.
- Keep repository terminology consistent.
- Validate documentation before every commit.
- Prefer relative links whenever possible.
- Separate documentation changes from functional code changes.
