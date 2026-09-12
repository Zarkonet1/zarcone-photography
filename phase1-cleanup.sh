#!/usr/bin/env bash
#
# ZARCONE PHOTOGRAPHY — GIT HISTORY CLEANUP, PHASE 1 (orphaned files)
#
# RUN THIS FROM TERMINAL ON YOUR MAC. Do not run from inside the Claude sandbox —
# a prior incident (2026-06-24, index.lock / maintenance.lock) confirmed the
# sandbox's FUSE mount can't handle git's unlink() calls during history rewrites.
#
# What this does:
#   1. Makes a full mirror backup of the CURRENT remote (origin/main) before touching anything.
#   2. Clones a FRESH, throwaway copy of origin/main to operate on (never touches your
#      existing working checkout, so your uncommitted changes and untracked feature
#      branches are completely safe and untouched).
#   3. Deletes the 113 files in orphaned-files-manifest.txt — confirmed via static
#      analysis to be referenced NOWHERE in current source (dead assets: duplicate
#      IRONMAN race-photo dumps, a CapCut temp-export folder, old flyers/logos/screenshots).
#   4. Uses git-filter-repo to strip those same 113 files out of EVERY historical
#      commit, not just HEAD — this is what actually shrinks .git.
#   5. Force-pushes the rewritten history back to origin.
#
# What this does NOT do (see GIT-CLEANUP-RUNBOOK.md, Phase 2):
#   - Touch the 192 files that ARE referenced in source, even though many of them
#     (i-2CHdSJx.jpg, i-Cf5RqJt.jpg, etc.) are also raw 30-42MB camera exports still
#     bloating both the live site and .git history. Those need to be resized/compressed
#     in place first (so the live site keeps working), THEN purged from history
#     separately. Doing it in the same pass as this script would delete the images
#     your site currently serves.
#
# PREREQUISITES (checked below, but confirm you understand them):
#   - Your LOCAL checkout is currently 2 commits ahead / 131 commits BEHIND origin/main.
#     This script clones fresh from origin, so that divergence doesn't matter for the
#     history rewrite itself — but it means your local checkout is stale and separately
#     needs `git pull --rebase` (after committing/pushing your in-progress work: the
#     modified next.config.mjs and the untracked app/api/chat, app/api/program-contact,
#     app/api/subscribe, app/brhs-panther-football, app/brhs-panther-wrestling,
#     app/schools-athletic-programs-nj directories) before you keep working in it.
#     Do that FIRST, separately, before or after this script — they don't conflict,
#     but don't skip it.
#   - Homebrew + git-filter-repo installed (`brew install git-filter-repo`).
#   - You are the only person with a local clone, or you've warned collaborators that
#     history is being rewritten and they'll need to re-clone afterward.
#
set -euo pipefail

REPO_URL="https://github.com/Zarkonet1/zarcone-photography.git"
WORK_DIR="$HOME/zarcone-photography-history-surgery"
BACKUP_DIR="$HOME/zarcone-photography-backup-$(date +%Y%m%d-%H%M%S).git"
MANIFEST="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/orphaned-files-manifest.txt"

echo "=== Zarcone Photography — Git History Cleanup, Phase 1 ==="
echo ""
echo "Manifest: $MANIFEST"
if [ ! -f "$MANIFEST" ]; then
  echo "ERROR: orphaned-files-manifest.txt not found next to this script. Aborting."
  exit 1
fi
echo "Files to be purged from ALL history ($(wc -l < "$MANIFEST" | tr -d ' ') total):"
cat "$MANIFEST"
echo ""
read -r -p "Type YES to continue: " CONFIRM
if [ "$CONFIRM" != "YES" ]; then
  echo "Aborted, nothing changed."
  exit 1
fi

if ! command -v git-filter-repo >/dev/null 2>&1; then
  echo "git-filter-repo not found. Install it with: brew install git-filter-repo"
  exit 1
fi

echo ""
echo "--- Step 1: mirror backup of origin/main to $BACKUP_DIR ---"
git clone --mirror "$REPO_URL" "$BACKUP_DIR"
echo "Backup complete. If anything below goes wrong, restore with:"
echo "  cd $BACKUP_DIR && git push --mirror $REPO_URL"

echo ""
echo "--- Step 2: fresh throwaway clone for surgery ---"
if [ -d "$WORK_DIR" ]; then
  echo "ERROR: $WORK_DIR already exists. Remove or rename it first."
  exit 1
fi
git clone "$REPO_URL" "$WORK_DIR"
cd "$WORK_DIR"

echo ""
echo "--- Step 3: remove orphaned files from the current tree ---"
git rm --pathspec-from-file="$MANIFEST" --ignore-unmatch -r
git commit -m "Remove orphaned media files never referenced in source

Confirmed via static analysis (grep across all .js/.jsx/.ts/.tsx/.json,
excluding node_modules/.git/.next) that none of these 113 files are
referenced by any import, src attribute, or data file in the current
codebase. Includes: duplicate IRONMAN race-photo exports, a CapCut
temp-export cache folder that should never have been committed, old
flyers/logos/screenshots, and a stray .DS_Store."

echo ""
echo "--- Step 4: purge the same files from ALL history ---"
git filter-repo --invert-paths --paths-from-file "$MANIFEST" --force

echo ""
echo "--- Step 5: re-point origin (filter-repo removes it as a safety measure) ---"
git remote add origin "$REPO_URL"

echo ""
echo "--- Step 6: repack and report size ---"
git reflog expire --expire=now --all
git gc --prune=now --aggressive
du -sh .git

echo ""
echo "=== Ready to force-push. This rewrites origin/main's history. ==="
echo "Anyone else with a local clone (or Vercel's git integration cache) will need"
echo "to re-clone afterward — a force-push doesn't break the NEXT deploy, but it"
echo "does mean old commit SHAs referenced anywhere (PRs, links) become invalid."
read -r -p "Type YES to force-push to origin/main now: " CONFIRM2
if [ "$CONFIRM2" != "YES" ]; then
  echo "Not pushed. Your rewritten history is sitting in $WORK_DIR — push manually with:"
  echo "  cd $WORK_DIR && git push origin --force --all && git push origin --force --tags"
  exit 0
fi

git push origin --force --all
git push origin --force --tags

echo ""
echo "=== Done. ==="
echo "Rewritten, pushed repo: $WORK_DIR"
echo "Mirror backup (keep until you've confirmed Vercel redeploys clean): $BACKUP_DIR"
echo ""
echo "Next: separately sync your existing working checkout (the one with your"
echo "in-progress app/ changes) — see GIT-CLEANUP-RUNBOOK.md, 'After the rewrite'."
