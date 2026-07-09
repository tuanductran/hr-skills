---
name: skill-vetter
description: "Security-first vetter for SKILL.md files — checks permissions, suspicious patterns, and metadata before installing or publishing skills. Useful for validating third-party skills for this repo."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# Skill Vetter

## Supported tasks

- Validate SKILL.md frontmatter and required sections
- Check for dangerous shell commands or wide file write permissions
- Detect suspicious external URLs and credential leaks in content
- Verify metadata.author and licensing sections
- Summarize permission scopes (read/write/commands) and risk level
- Produce remediation suggestions for failing checks
- Output a short pass/fail report for CI inclusion
- Suggest safe install steps or block listing

## Key prompts

### Validation

- "Validate this SKILL.md and report missing frontmatter fields: [content]."
- "Scan for bash commands that write to sensitive paths and list risky lines."
- "Check permission scope strings for overly broad write access: [permissions]."
- "Extract URLs from the skill and flag external hosts not on allowlist."

### Remediation

- "Suggest fixes to reduce permission scope for this SKILL.md: [content]."
- "Rewrite dangerous command snippets into safe alternatives or sandboxed commands."
- "Produce a CI step snippet that fails on high-risk vetter issues."
- "Generate a short advisories list for reviewers before merging this skill."

### Reporting

- "Produce a one-paragraph summary for maintainers explaining the vet result."
- "Create a Markdown checklist of vetter findings suitable for a PR comment."
- "Return a machine-readable JSON report with keys: passed, issues, severity."
- "Suggest whether to allow-install, require-review, or block-install based on findings."

## Tips

- Run vetter as part of `bun run validate` or a pre-merge CI job
- Keep an allowlist of approved external hosts and commands
- Fail fast on write permissions targeting root-level or repo-critical paths
- Surface minimal, actionable fixes for authors to correct their SKILL.md
