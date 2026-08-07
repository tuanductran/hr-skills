#!/usr/bin/env bash
# Pre-tool hook: block any git push that targets main directly.

set -euo pipefail

INPUT=$(cat)

# Extract command from tool_input.command using jq (preferred) or grep fallback
COMMAND=""
if command -v jq &>/dev/null; then
  COMMAND=$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty' 2>/dev/null || true)
else
  COMMAND=$(printf '%s' "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | grep -o '"[^"]*"$' | tr -d '"' || true)
fi

if echo "$COMMAND" | grep -qE "git push.*(origin[[:space:]]+main|--force.*main|main[[:space:]]*$)"; then
  echo "Blocked: direct push to 'main' is not allowed." >&2
  echo "Create a branch and push that instead:" >&2
  echo "  git checkout -b fix/your-change" >&2
  echo "  git push origin fix/your-change" >&2
  echo "See .claude/rules/git-and-release.md for the branch workflow." >&2
  exit 2
fi

if echo "$COMMAND" | grep -qE "^git push([[:space:]]+origin)?[[:space:]]*$"; then
  REPO_ROOT="${CODEX_PROJECT_DIR:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"
  CURRENT_BRANCH=$(git -C "$REPO_ROOT" branch --show-current 2>/dev/null || echo "")
  if [[ "$CURRENT_BRANCH" == "main" ]]; then
    echo "Blocked: you are on 'main' and 'git push' would push to main." >&2
    echo "Switch to a feature branch first:" >&2
    echo "  git checkout -b fix/your-change" >&2
    echo "See .claude/rules/git-and-release.md for the branch workflow." >&2
    exit 2
  fi
fi

exit 0
