---
paths:
  - packages/**/*.ts
  - .claude/**/*.sh
  - .claude/**/*.json
  - .claude/**/*.md
  - .agents/**/*.md
  - .github/workflows/**/*.yml
---

# Source character safety

Keep source and local workflow files free of smart punctuation that can be confused with
ASCII source characters.

- do not paste literal smart quotes into source or workflow files
- avoid literal smart quotes such as `U+2019`, `U+2018`, `U+201C`, and `U+201D` in TypeScript, shell, JSON, YAML, and local AI workflow files
- avoid literal `U+2013`, `U+2014`, `U+2026`, and `U+00A0` in the same files unless a file truly requires Unicode
- prefer plain ASCII apostrophes and double quotes in prose that lives inside source strings
- prefer `-`, `...`, and plain spaces instead of typographic dash, ellipsis, or non-breaking space characters
- if code must normalize smart punctuation, use explicit escapes such as `\u2019` instead of pasting the literal character
- keep `.claude/` and `.agents/` instruction files ASCII-safe unless a file truly requires Unicode
