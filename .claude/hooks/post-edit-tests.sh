#!/usr/bin/env bash
# Post-edit hook: run bun test on edited .test.ts files in packages/*/test/.
# Non-blocking. Fast feedback for the touched test file only.

set -euo pipefail

INPUT=$(cat)

# Extract file_path using jq (preferred) or grep fallback
FILE_PATH=""
if command -v jq &>/dev/null; then
  FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
else
  FILE_PATH=$(printf '%s' "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | grep -o '"[^"]*"$' | tr -d '"' || true)
fi

# Only trigger for .test.ts files under packages/*/test/
case "$FILE_PATH" in
  *"/packages/"*"/test/"*".test.ts") ;;
  *) exit 0 ;;
esac

REPO_ROOT="${CODEX_PROJECT_DIR:-${CLAUDE_PROJECT_DIR:-$(git -C "$(dirname "$FILE_PATH")" rev-parse --show-toplevel 2>/dev/null || pwd)}}"

cd "$REPO_ROOT"

case "$FILE_PATH" in
  "$REPO_ROOT"/*) TARGET_FILE="$FILE_PATH" ;;
  *) TARGET_FILE="$REPO_ROOT/$FILE_PATH" ;;
esac

if [[ ! -f "$TARGET_FILE" ]]; then
  exit 0
fi

run_test() {
  local output exit_code
  set +e
  output=$("$@" 2>&1)
  exit_code=$?
  set -e
  printf '%s' "$output"
  return "$exit_code"
}

if OUTPUT=$(run_test bun test "$TARGET_FILE"); then
  EXIT_CODE=0
else
  EXIT_CODE=$?
fi

if [[ $EXIT_CODE -ne 0 ]]; then
  echo "[hook:post-edit-tests] Tests failed for $TARGET_FILE" >&2
  echo "$OUTPUT" >&2
  echo "Test failures in $TARGET_FILE after edit:"
  echo "$OUTPUT"
else
  echo "[hook:post-edit-tests] All tests passed." >&2
fi

exit 0
