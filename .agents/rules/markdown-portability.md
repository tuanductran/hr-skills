---
paths:
  - '**/*.md'
  - .markdownlint.yml
  - .markdownlintignore
  - lefthook.yml
---

# Markdown portability rules

Keep Markdown compatible across AI tools, OS editors, and the markdownlint ruleset in `.markdownlint.yml`.

- use `'` and `"` instead of smart quotes
- use `-` instead of em dashes
- use `...` instead of ellipsis characters
- preserve YAML front matter in `skills/hr-*/SKILL.md` (required by the validator)
- do not introduce Markdown structures that break `bun run lint:md`
- do not use TypeScript constant names, module paths, or code identifiers in prose
  inside `skills/hr-*/` files — write in plain language instead

## MarkdownLint compliance (`.markdownlint.yml`)

All Markdown files in this repository must adhere to the rules in `.markdownlint.yml`.
When editing or generating Markdown:

- **MD029 (ordered list item prefix):** always use sequential numbering (`1. 2. 3.`), not repetitive `1. 1. 1.`
- **MD032 (blanks around lists):** always surround lists (ul/ol) with blank lines
- **MD031 (blanks around fenced code blocks):** always surround fenced code blocks with blank lines
- **MD040 (fenced code language):** always specify a language tag for fenced code blocks — `bash`, `json`, `yaml`, `typescript`, `text`, or `markdown`
- **MD034 (bare URLs):** wrap bare URLs in angle brackets (`<http...>`) if not using link syntax

## Link and case checks

- Run `bun run lint:links` to check for broken external links in `docs/` and `skills/`
- Run `bun run lint:md` to run both markdownlint and case-police together
- External link checks use live network requests — run them intentionally, not on every edit

## Format on save

After modifying Markdown files, run:

```bash
bun run lint:md        # markdownlint + case-police
bun run lint:md:fix    # auto-fix what can be fixed
```
