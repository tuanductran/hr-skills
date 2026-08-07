---
paths:
  - AGENTS.md
  - SKILL.md
  - README.md
  - docs/**/*.md
  - skills/**/*.md
  - .agents/**/*.md
  - .claude/**/*.md
---

# Language and grammar rules

Use these rules when writing or editing Markdown or prose-heavy files in this repository.

## Rule precedence

If this rule conflicts with a stronger repo-local contract, follow the stronger source:

1. `AGENTS.md`
2. `markdown-portability.md`
3. `source-character-safety.md`
4. this file

## Core standard

Write so the text is:

- clear before clever
- specific before expansive
- easy to scan
- consistent with the project's plain, technical tone

## Sentence and heading style

- Use sentence case for headings, titles, labels, and section names.
- Do not add periods to headings.
- Prefer statement headings over question headings.
- In procedural docs, prefer action-led headings.
- Avoid gerund-heavy headings when a direct verb is clearer.

Preferred:

- `Add a new skill`
- `Validate skill frontmatter`

Avoid:

- `Adding A New Skill`
- `How should you validate?`

## Word choice

- Use full words instead of abbreviations in user-facing or cross-functional docs.
- Do not use `e.g.`, `i.e.`, `etc.`, or `&` in prose.
- Rewrite with `for example`, `that is`, `and so on`, or plain `and`.
- Expand feature, product, or tool names unless the shortened form is the established literal name.

Preferred:

- `For example, run bun run validate after editing a skill.`

Avoid:

- `Run bun run validate, etc.`

## Grammar

- Prefer active voice.
- Prefer present tense for rules, system behavior, and instructions.
- Use past tense only for completed events or results.

Preferred:

- `The validator checks frontmatter schema.`
- `Run the sync command after adding a skill.`

Avoid:

- `Frontmatter schema is checked by the validator.`

## Pronouns and point of view

- Use `you` and `your` when speaking directly to the reader.
- Use `we` only for genuine repo or team statements.
- Minimize pronouns when they make a sentence vague.

## Lists

- Use lists to improve scanability, not to inflate structure.
- Keep lists to 6 items or fewer when possible.
- Keep list items parallel in grammar and shape.
- Use a lead-in sentence before the list when it improves context.
- For fragment lists, use lowercase starts unless a proper noun requires caps.
- Do not add end punctuation to fragment list items.

## Punctuation and formatting

- Use straight ASCII apostrophes and quotes.
- Avoid exclamation marks unless inside a literal example.
- Do not use spaced hyphen punctuation such as `word -- word`. Split the sentence instead.
- Use colons to introduce lists, examples, and lead-ins.
- Use bold sparingly for scan anchors, warnings, and short labels.

## Numbers

- Use numerals for steps, limits, counts, and structured references.
- Spell out a number only when it starts a sentence or reads more naturally in prose.

## Editing check

Before finishing a prose edit, check:

- Is the heading in sentence case?
- Is the sentence active and present where possible?
- Did I avoid `e.g.`, `i.e.`, `etc.`, and `&`?
- Did I keep smart punctuation out of the file?
- Is the list short, parallel, and easy to scan?
