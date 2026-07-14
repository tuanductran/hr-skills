---
name: humanizer
description: "Edit and rewrite SKILL.md prose to reduce signs of AI-generation and improve clarity, tone, and inclusivity. Useful for polishing skill descriptions and prompts."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# Humanizer

## Supported tasks

- Rewrite SKILL.md sections to sound natural and human-authored
- Fix grammar, inclusive language, and remove AI artifacts
- Shorten long descriptions to fit trigger thresholds
- Ensure blank lines before lists and headings per repo rules
- Normalize phrasing for trigger phrases and placeholders
- Provide multiple tone variants (formal, friendly, concise)
- Generate reviewer-friendly diffs highlighting changes
- Produce suggestions for improving prompt clarity

## Key prompts

### Rewrite tasks

- "Rewrite this SKILL.md description to sound natural and clear: [text]."
- "Shorten and sharpen the description to 50-120 characters while keeping trigger phrases."
- "Convert this list of prompts into a consistent style and tone."
- "Generate three tone variants for the Tips section: formal, friendly, concise."

### Quality enforcement

- "Check this file for missing blank lines between headings and lists per repo rules."
- "Flag inclusive language issues and suggest neutral replacements."
- "Provide a one-paragraph summary of changes suitable for a PR body."
- "Highlight any placeholders that don't follow `[placeholders]` convention."

### Tone and examples

- "Provide short example rewrites for this Tips section in a friendly tone: [text]."
- "Convert these technical examples into beginner-friendly language while preserving accuracy."
- "Generate three alternative opening lines for the SKILL description with different formality levels."
- "Suggest 4 sample prompt phrasings that follow the repo's `[placeholders]` pattern."

## Tips

- Always run `bun run lint:md` after rewrites to enforce markdown rules
- Keep example prompts short and use `[placeholders]` consistently
- Preserve technical accuracy when simplifying prose for non-technical readers
- Use this skill as a final pass before opening PRs to `dev`
