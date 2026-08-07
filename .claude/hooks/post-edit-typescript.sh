#!/usr/bin/env bash
# Post-edit hook: run Biome check on edited TypeScript/JavaScript files.
# Non-blocking. Uses repo Biome config directly (biome check <file>).

set -euo pipefail

INPUT=$(cat)

# Extract file_path using jq (preferred) or grep fallback
FILE_PATH=""
if command -v jq &>/dev/null; then
  FILE_PATH=$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)
else
  FILE_PATH=$(printf '%s' "$INPUT" | grep -o '"file_path"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | grep -o '"[^"]*"$' | tr -d '"' || true)
fi

# Only trigger for TypeScript/JavaScript source files under packages/
case "$FILE_PATH" in
  *"/packages/"*.ts) ;;
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

# Run Biome check on the touched file only (fast, non-blocking)
# Use biome directly so we can pass a single file path
biome check --no-errors-on-unmatched "$TARGET_FILE" 2>&1 || true

exit 0
