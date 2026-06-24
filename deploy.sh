#!/bin/bash
# Zarcone Photography — one-command deploy
# Usage: deploy "what you changed"

set -e

REPO="$HOME/Claude/Projects/ZP Web Redsign/zarcone-next"
cd "$REPO"

# Clear any stale lock files left by the sandbox
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock

# Stage, commit, push
git add -A

if [ -z "$1" ]; then
  echo "Usage: deploy \"describe what you changed\""
  exit 1
fi

git commit -m "$1"
git push

echo ""
echo "✓ Pushed. Vercel will be live in ~2 minutes."
