---
paths:
  - docs/**/*.md
  - skills/**/*.md
  - .agents/**/*.md
  - .claude/**/*.md
  - packages/**/*.ts
  - .github/workflows/**/*.yml
---

# Accessibility and inclusive language rules

Use these rules when changing user-facing copy, Markdown skill files, TypeScript
surfaces that emit text, or shell scripts that produce human-facing output.

## Core standard

Make the result easier to understand, navigate, and use.

Prefer:

- plain language over jargon
- stable structure over clever formatting
- explicit labels over implied meaning
- text that works without color, tone, or shared context

Do not claim that any output is "fully accessible". Accessibility still needs human review.

## Inclusive language

- Use respectful, inclusive, people-first language in all user-facing text.
- HR skill content must be especially careful: avoid stereotypes about ability, age, gender,
  ethnicity, or background when describing candidates, employees, or HR processes.
- Do not frame confusion, slow responses, or mistakes as moral failure.
- Keep CLI output and skill guidance calm and non-humiliating.

## Cognitive load and readability

- Prefer plain language.
- Keep structure consistent and easy to scan.
- Use short paragraphs and stable section ordering.
- Avoid unnecessary visual or rhetorical intensity.
- If a concept can be said directly, do not wrap it in jargon or implementation vocabulary.
- When writing CLI output, errors, or skill instructions, explain what happened and what the reader can do next.

## Markdown and content structure

- Use headings to introduce real sections.
- Do not skip heading levels without reason.
- Keep one clear top-level topic per document.
- Use meaningful link text rather than vague phrases like `click here`.
- Keep lists parallel and easy to scan.

## TypeScript and CLI text

- Error output should be plain, specific, and actionable.
- Do not rely on color alone to communicate success, warning, or failure.
- Machine-readable output should stay machine-readable, but any human-facing companion
  text should remain concise and understandable.
- Avoid messages that sound mocking, dramatic, or insider-only.

## Verification

After meaningful accessibility-sensitive edits, run:

```bash
bun run lint:md    # markdownlint + case-police
bun run check      # Biome for TypeScript/JavaScript surfaces
```
