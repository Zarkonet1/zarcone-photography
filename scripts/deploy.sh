#!/bin/bash
# Safe git commit + push — bypasses index.lock entirely.
# Usage: bash scripts/deploy.sh "your commit message"
#
# Why this exists: the Cowork sandbox can strand stale index.lock / HEAD.lock
# files on the macOS filesystem between sessions. This script seeds a temp
# index from the current HEAD, stages all changes into it, and uses git
# plumbing to commit — never touching .git/index.lock or .git/HEAD.lock.

set -e

MSG="${1:-deploy}"
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMP_INDEX=$(mktemp)

cd "$REPO_DIR"

echo "→ Seeding temp index from HEAD..."
GIT_INDEX_FILE="$TEMP_INDEX" git read-tree HEAD

echo "→ Staging all changes..."
GIT_INDEX_FILE="$TEMP_INDEX" git add -A

echo "→ Writing tree..."
TREE=$(GIT_INDEX_FILE="$TEMP_INDEX" git write-tree)

PARENT=$(cat .git/refs/heads/main 2>/dev/null || git rev-parse HEAD)

echo "→ Creating commit..."
COMMIT=$(GIT_INDEX_FILE="$TEMP_INDEX" git commit-tree "$TREE" -p "$PARENT" -m "$MSG")

echo "$COMMIT" > .git/refs/heads/main

echo "→ Pushing to origin..."
git push origin main

rm -f "$TEMP_INDEX"

echo "✓ Done: $COMMIT"
