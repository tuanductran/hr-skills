---
name: pdf
description: "PDF and document utilities: generate, merge, and validate PDF exports from skills, catalogs, and examples. Useful for producing distributable documentation and packaging."
metadata:
  author: "Tuan Duc Tran"
  version: "1.0.0"
---

## Supported tasks

- Convert Markdown files or SKILL.md content to PDF with a clean template
- Merge multiple PDF files into a single distributable package
- Validate PDF text extraction and accessibility basics
- Produce PDF change summaries from SKILL.md diffs
- Generate printable catalogs from `skills/CATALOG.md` or `docs/`
- Embed metadata and versioning into generated PDFs
- Provide CI-friendly checks to ensure PDFs build without errors
- Offer commands/snippets for local PDF generation workflows

## Key prompts

### Generation

- "Convert `skills/hr-recruiting/SKILL.md` to a single-column PDF with header/footer."
- "Produce a merged PDF of docs/README.md and skills/CATALOG.md for release."
- "Generate a one-page PDF summary for `skill`: [skill name] with metadata."
- "Export examples/ai/hiring-a-senior-ai-engineer.md to PDF with code blocks rendered."

### Validation and CI

- "Check that generated PDF contains specified headings and no broken images."
- "Run PDF accessibility basic checks and report issues."
- "Create a CI step that fails if PDF generation errors occur."
- "Extract text from a PDF and diff against source Markdown for verification."

### Templates and styling

- "Provide a minimal PDF template with header, footer, and repo branding guidelines."
- "Suggest CSS or print styles for rendering code blocks clearly in PDFs."
- "Generate a one-page changelog template to include in release PDFs."
- "Recommend font and margin settings suitable for both screen and print."

## Tips

- Use lightweight tools (pandoc, wkhtmltopdf, or headless Chromium) compatible with Bun CI images
- Keep templates minimal to avoid rendering differences across environments
- Generate PDFs in CI artifacts for release bundles
- Include `skills/CATALOG.md` and a short changelog page for each release PDF
