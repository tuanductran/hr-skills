#!/usr/bin/env bash
# Session-start hook: inject repo context and branch workflow reminder.
# Stdout is added to the session context by the Claude hook runner.

set -euo pipefail

INPUT=$(cat || true)

# Extract cwd from JSON using jq (preferred) or grep fallback
REPO_ROOT=""
if [[ -n "$INPUT" ]]; then
  if command -v jq &>/dev/null; then
    REPO_ROOT=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
  else
    REPO_ROOT=$(printf '%s' "$INPUT" | grep -o '"cwd"[[:space:]]*:[[:space:]]*"[^"]*"' | grep -o '"[^"]*"$' | tr -d '"' || true)
  fi
fi

REPO_ROOT="${REPO_ROOT:-${CODEX_PROJECT_DIR:-${CLAUDE_PROJECT_DIR:-$(pwd)}}}"

cd "$REPO_ROOT" 2>/dev/null || exit 0

CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
LAST_COMMIT=$(git log -1 --format="%h %s" 2>/dev/null || echo "none")

cat <<EOF
=== hr-skills — Repo Context ===
Branch:       $CURRENT_BRANCH
Last commit:  $LAST_COMMIT
Uncommitted:  $UNCOMMITTED file(s) changed

Branch workflow (.claude/rules/git-and-release.md):
- NEVER push directly to main — use a feature branch and open a PR against dev
- Branch naming: feat/..., fix/..., ci/..., docs/..., test/..., chore/...
- Run "bun run validate" after editing any skills/hr-*/SKILL.md
- Run "bun run sync" after adding or removing a skill directory
- Run "bun run test" before pushing TypeScript changes in packages/*
- Run "bun run lint" and "bun run format" before any commit

Pre-push checklist:
  bun run validate
  bun run test
  bun run check
=================================
EOF

exit 0
