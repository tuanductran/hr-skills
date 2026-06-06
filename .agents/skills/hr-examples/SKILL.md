---
name: hr-examples
description: >-
  Guide for maintaining and generating example prompts and documents under `examples/`.
  Triggers: "Generate example prompt", "Update example file", "Validate examples",
  "Export examples to PDF".
metadata:
  author: "Tuan Duc Tran"
  version: "1.0.0"
---

## Supported tasks

- Review `examples/` files for clarity and realism
- Ensure examples use HR-specific trigger phrases
- Validate file naming and directory organization under `examples/`
- Generate new example drafts for a given HR task
- Export selected examples into a printable PDF bundle
- Suggest improvements to example prompts for better agent understanding
- Ensure examples are concise and follow content standards
- Check example readmes and cross-links for consistency

## Key prompts

### Create an example

- Draft an example prompt for `[task]` based on repository style
- Add a short summary and expected outputs for the example
- Suggest placeholder inputs and example outputs
- Ensure example length is suitable for embedding in SKILL.md

### Validate examples

- Check for missing blank lines before lists or headings
- Verify filename conventions and folder placement in `examples/`
- Ensure examples avoid time-sensitive legal or vendor-specific guidance
- Confirm example uses inclusive language (they/their)

### Export and package

- Bundle selected examples into a PDF for distribution
- Create a short `examples/README.md` summary for a folder
- Generate a changelog note for example edits

## Tips

- Keep examples focused and outcome-oriented
- Use realistic but non-sensitive placeholder data
- Prefer progressive disclosure: show minimal context then optional details
- Always leave a blank line between a heading and the list that follows
- Keep example files short — aim for one focused outcome per file
