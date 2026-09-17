---
name: markdown
description: "Repository guidance for writing, formatting, and validating Markdown documentation using markdownlint-cli, case-police, and markdown-link-check within the hr-skills monorepo, including the CLAUDE.md/AGENTS.md symlink convention."
metadata:
  author: Tuan Duc Tran
  version: "1.2.0"
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

## Content design rules

All documentation and skill content follows [Atlassian's content design guidelines](https://atlassian.design/foundations/content/):

- Use sentence case for all headings — capitalize the first word and proper nouns only
- Don't use `e.g.`, `i.e.`, `etc.`, or `&` in prose — write "for example", "that is", "and so on", "and"
- Don't use periods at the end of headings
- Avoid gerunds in headings — prefer "Add a skill" over "Adding a skill"
- Phrase list items in parallel: fragments get a lowercase first letter and no period, complete sentences get a capital first letter and a period
- Use "they/their" instead of gendered pronouns when the person's identity isn't known
- Avoid idioms or culturally specific expressions that don't translate well
- Be clear, concise, and direct; use contractions ("don't", "can't") for a conversational tone

## Blank line before lists

Always leave a blank line between a heading or bold label and the list that follows it. Missing blank lines can break rendering, and the skill validator (`bun run validate`) enforces this rule for `SKILL.md` files specifically.

This applies to every Markdown file in the repository — `AGENTS.md`, `README.md`, `SKILL.md`, `docs/*.md`, and generated files. AI tools in particular must insert a blank line every time a heading (`##`, `###`) or a bold label (`**Label:**`) is immediately followed by a list — this is easy to get wrong when generating Markdown programmatically.

Run `bun run validate` (for `SKILL.md` files) and `bun run lint:md` (for everything else) before committing any Markdown change.

## `CLAUDE.md` is a symlink

`CLAUDE.md` at the repository root is a symlink to `AGENTS.md`
(`CLAUDE.md -> AGENTS.md`), so Claude Code loads the same guidance
automatically without a second copy to keep in sync.

**Never edit or delete `CLAUDE.md` directly, and never regenerate it as a
plain file.** A tool that writes through a symlink transparently (most
editors, `str_replace`-style edits) is fine; one that doesn't preserve
symlinks (some AI file-writing tools, a plain overwrite, or a `rm` followed
by `write`) silently replaces the symlink with an independent copy, and the
two files then drift apart with no lint rule to catch it. If a change is
needed, edit `AGENTS.md` and let `CLAUDE.md` keep resolving to it.

Before editing either file, confirm the symlink is still intact:

```bash
readlink CLAUDE.md   # must print: AGENTS.md
```

If it prints nothing (or file content instead of a path), `CLAUDE.md` has
already diverged into a real file — restore the symlink and re-apply any
content it was missing into `AGENTS.md` instead:

```bash
rm CLAUDE.md
ln -s AGENTS.md CLAUDE.md
git add CLAUDE.md
```

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
- blank lines around lists not enforced by markdownlint itself (`MD032: false`)
  — see "Blank line before lists" below for the separate rule that does cover this
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
- Editing `CLAUDE.md` directly instead of `AGENTS.md`, breaking the symlink.

## Best practices

- Keep each document focused on a single topic.
- Write Markdown that is easy to read in source form.
- Keep repository terminology consistent.
- Validate documentation before every commit.
- Prefer relative links whenever possible.
- Separate documentation changes from functional code changes.
- Edit `AGENTS.md`, never `CLAUDE.md`, which must stay a symlink to it.
