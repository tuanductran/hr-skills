---
name: pdf
description: "PDF and document utilities for generating, merging, validating, and exporting repository documentation from Markdown sources. Useful for creating printable guides, skill documentation, and release-ready artifacts."
metadata:
  author: Tuan Duc Tran
  version: "1.1.0"
---

# PDF

## Supported tasks

- Convert Markdown documents into clean, printable PDF files
- Export individual `SKILL.md` files or complete skill packages to PDF
- Generate PDFs from repository documentation and supporting guides
- Merge multiple PDF files into a single distributable document
- Validate PDF rendering, text extraction, and basic accessibility
- Embed document metadata such as title, author, and version
- Generate release-ready PDF artifacts for distribution
- Recommend PDF generation workflows for local development and CI

## Key prompts

### PDF generation

- "Convert `skills/hr-recruiting/SKILL.md` into a single-column PDF with headers and footers."
- "Generate a PDF for the entire `skills/hr-ai/` package, including `SKILL.md`, `content/`, `prompts/`, and `examples/`."
- "Create a one-page PDF summary for `hr-recruiting` with repository metadata."
- "Export `skills/hr-ai/examples/hiring-a-senior-ai-engineer.md` to PDF with syntax-highlighted code blocks."

### Validation

- "Verify that the generated PDF contains all expected headings and no missing images."
- "Run basic accessibility checks on the generated PDF."
- "Compare extracted PDF text against the source Markdown."
- "Validate that all internal links and references render correctly."

### Templates and styling

- "Generate a minimal PDF template with headers, footers, and page numbers."
- "Recommend print styles for Markdown tables, callouts, and code blocks."
- "Suggest typography and page layout suitable for both screen viewing and printing."
- "Create a reusable PDF template for repository documentation."

## Tips

- Prefer reproducible PDF generation across local development and CI.
- Keep templates simple to minimize rendering differences between engines.
- Preserve Markdown structure, heading hierarchy, tables, and fenced code blocks.
- Generate PDFs directly from repository sources rather than maintaining separate printable copies.
- Embed document metadata to improve indexing and document management.
