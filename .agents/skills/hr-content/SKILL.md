---
name: hr-content
description: >-
  Help maintain and generate consistent HR skill content and metadata for the hr-skills
  repository. Triggers: "Create a SKILL.md", "Update skill metadata", "Fix blank lines",
  "Validate skill frontmatter", "Sync skill metadata".
metadata:
  author: "Tuan Duc Tran"
  version: "1.0.0"
---

## Supported tasks

- Review `SKILL.md` frontmatter for required fields
- Ensure `metadata.author` is set to "Tuan Duc Tran"
- Insert blank line before lists and headings to satisfy validators
- Normalize `description` to include HR trigger phrases
- Suggest improvements to `## Key prompts` and `## Tips`
- Generate `SKILL.md` skeletons for new HR skills
- Validate that subtopic sections contain 4–7 prompts each
- Check total lines are under 500

## Key prompts

### Create a new skill

- Create a `SKILL.md` skeleton for `hr-[name]` with required frontmatter and sections
- Add `metadata.author: Tuan Duc Tran` and `metadata.version: 1.0.0`
- Add `## Supported tasks`, `## Key prompts`, and `## Tips` sections
- Ensure the `description` contains realistic HR trigger phrases
- Ensure a blank line appears before every list

### Fix existing skills

- Find missing `metadata.author` and add `Tuan Duc Tran`
- Insert blank lines where headings are immediately followed by lists
- Shorten descriptions that exceed recommended length while keeping triggers
- Ensure each subtopic has 4–7 prompts and `## Tips` has 4–6 items

### Validate and sync

- Run repository validation commands and report errors
- Suggest conventional-commits-friendly commit message for changes
- Prepare `SKILL.md` for `bun run sync` and `bun run validate`
- Export a short changelog note describing metadata fixes

## Tips

- Always leave a blank line between a heading and the list that follows
- Use sentence case for headings and avoid periods at the end
- Use "they/their" for unknown gender references
- Keep `SKILL.md` under 500 lines and keep prompts concise
- Use `[placeholders]` for variable inputs in prompts
