# Security hardening prompt

Use this prompt for practical security and operational-hardening passes in hr-skills.

- Start from `AGENTS.md` (root), `SECURITY.md`, and `.github/workflows/`.
- Audit `.claude/hooks/`, `packages/hr-skills-build/src/`, and `.github/workflows/` for shell safety, path safety, and least-privilege permissions.
- Check that `.claude/settings.json` deny list covers all dangerous operations (direct push to `main`, writes to generated artifacts).
- Check `.github/workflows/` for overly broad permissions, missing `permissions:` blocks, or secrets exposure risks.
- Focus on concrete risks: secrets exposure, unsafe shell patterns (unquoted variables, missing `set -euo pipefail`), and packaging leaks.
- Prefer the smallest direct hardening fix over abstract security commentary.
- Run `bun run check` and `bash -n <script>` after editing shell scripts or TypeScript.
