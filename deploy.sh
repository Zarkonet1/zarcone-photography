#!/bin/bash
# Zarcone Photography — one-command deploy
# Usage: deploy "what you changed"

set -e

REPO="$HOME/Claude/Projects/ZP Web Redsign/zarcone-next"
cd "$REPO"

# Clear any stale lock files left by the sandbox
rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock

# Cooldown check — warn if last push was within 30 minutes
LAST_PUSH=$(git log -1 --format="%ct" origin/main 2>/dev/null || echo 0)
NOW=$(date +%s)
ELAPSED=$(( NOW - LAST_PUSH ))
if [ "$ELAPSED" -lt 1800 ]; then
  MINS=$(( ELAPSED / 60 ))
  echo "⚠ Last deploy was ${MINS} min ago. Batching changes reduces version-skew errors."
  echo -n "  Push anyway? (y/N) "
  read -r CONFIRM
  [[ "$CONFIRM" =~ ^[Yy]$ ]] || { echo "Aborted. Stage more changes and deploy when ready."; exit 0; }
fi

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
echo "  Tip: batch all changes into one push per session to avoid version-skew errors."
