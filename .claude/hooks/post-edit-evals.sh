#!/usr/bin/env bash
# Post-edit hook: validate SKILL.md files after editing any skill package.
# Non-blocking. Runs bun run validate to catch frontmatter/schema errors early.

set -euo pipefail

INPUT=$(cat)

# Extract file_path using jq (preferred) or grep fallback
FILE_PATH=""
if command -v jq &>/dev/null; then
  FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
else
  FILE_PATH=$(printf '%s' "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | grep -o '"[^"]*"$' | tr -d '"' || true)
fi

# Only trigger for SKILL.md files under skills/hr-*/
case "$FILE_PATH" in
  *"/skills/hr-"*"/SKILL.md") ;;
  *) exit 0 ;;
esac

REPO_ROOT="${CODEX_PROJECT_DIR:-${CLAUDE_PROJECT_DIR:-$(git -C "$(dirname "$FILE_PATH")" rev-parse --show-toplevel 2>/dev/null || pwd)}}"

cd "$REPO_ROOT"

echo "[hook:post-edit-evals] Validating skill after edit to $FILE_PATH" >&2

run_validate() {
  local output exit_code
  set +e
  output=$("$@" 2>&1)
  exit_code=$?
  set -e
  printf '%s' "$output"
  return "$exit_code"
}

if OUTPUT=$(run_validate bun run validate); then
  EXIT_CODE=0
else
  EXIT_CODE=$?
fi

if [[ $EXIT_CODE -ne 0 ]]; then
  echo "[hook:post-edit-evals] Skill validation failed after editing $FILE_PATH" >&2
  echo "$OUTPUT" >&2
  echo "Skill validation errors after editing $FILE_PATH:"
  echo "$OUTPUT"
else
  echo "[hook:post-edit-evals] Skill validation passed." >&2
fi

exit 0
