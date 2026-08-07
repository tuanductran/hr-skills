#!/usr/bin/env bash
# Post-edit hook: run markdownlint on edited .md files.
# Non-blocking. Reports violations to the agent.

set -euo pipefail

INPUT=$(cat)

# Extract file_path using jq (preferred) or grep fallback
FILE_PATH=""
if command -v jq &>/dev/null; then
  FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
else
  FILE_PATH=$(printf '%s' "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | grep -o '"[^"]*"$' | tr -d '"' || true)
fi

if [[ "$FILE_PATH" != *.md ]]; then
  exit 0
fi

REPO_ROOT="${CODEX_PROJECT_DIR:-${CLAUDE_PROJECT_DIR:-$(git -C "$(dirname "$FILE_PATH")" rev-parse --show-toplevel 2>/dev/null || pwd)}}"

case "$FILE_PATH" in
  "$REPO_ROOT"/*) ;;
  *.md) FILE_PATH="$REPO_ROOT/$FILE_PATH" ;;
  *) exit 0 ;;
esac

cd "$REPO_ROOT"

if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Run markdownlint on the edited file only (fast)
run_check() {
  local output exit_code
  set +e
  output=$("$@" 2>&1)
  exit_code=$?
  set -e
  printf '%s' "$output"
  return "$exit_code"
}

if OUTPUT=$(run_check bunx markdownlint "$FILE_PATH"); then
  EXIT_CODE=0
else
  EXIT_CODE=$?
fi

if [[ $EXIT_CODE -ne 0 ]]; then
  echo "[hook:post-edit-markdown] markdownlint violations in $FILE_PATH" >&2
  echo "$OUTPUT" >&2
  echo "markdownlint violations detected in $FILE_PATH:"
  echo "$OUTPUT"
fi

exit 0
