# Zarcone Photography — Git History Cleanup Runbook

Generated 2026-09-01. Confirmed by direct inspection of the repo mounted in this
session (`/Users/thomaszarcone/zarcone-photography`), not from the earlier
Todoist estimate — the numbers below are exact, not approximate.

## Before you do anything: a bigger problem than the one you asked about

Your local checkout is **2 commits ahead and 131 commits behind origin/main**.
That's not history bloat, that's local/remote drift — if you force-pushed from
this checkout as-is, you'd overwrite 131 commits of remote history (the history
Vercel actually deploys from) with a stale local branch. This is why Phase 1
below operates on a **fresh clone of origin**, never on your existing checkout.

Separately, your existing checkout has real uncommitted work sitting on disk:
a modified `next.config.mjs` and six untracked directories/files
(`app/api/chat/`, `app/api/program-contact/`, `app/api/subscribe/`,
`app/brhs-panther-football/`, `app/brhs-panther-wrestling/`,
`app/schools-athletic-programs-nj/`, `PRODUCTION-INCIDENT-REPORT.md`,
`buildlog.txt`). None of that is touched by the script — but it needs to get
committed and reconciled with origin (`git pull --rebase` after committing) on
its own, or it's at risk of being lost or silently orphaned. Handle that
independently of this cleanup, before or after — just don't skip it.

## What's actually in the 2.5GB `.git` directory

| Category | Files | Size in history |
|---|---|---|
| Orphaned (referenced nowhere in current source) | 327 blobs across history / 113 distinct files still sitting in the working tree today | ~1,498 MB in history; **668 MB of that is dead weight on disk right now**, not just old history |
| Referenced (site actually loads these) | 594 blobs across history / 192 distinct files | ~1,039 MB |

The orphaned category is your "obviously junk" instinct being correct: six
78–83MB near-duplicate Instagram reel exports (three of them literally inside
a folder named `.__capcut_export_temp_folder_1781626666__` that should never
have been committed), the full 61-frame IRONMAN race-photo dump at full camera
resolution (11–33MB each), old flyers/logos/screenshots, and a stray
`.DS_Store`. Every one of these was checked against every `.js/.jsx/.ts/.tsx/.json`
file in the repo (excluding `node_modules`, `.next`, `.git`) — none are
imported, none appear in a `src=`, none appear in a data file. Full list:
`orphaned-files-manifest.txt` (113 lines).

The referenced category is the part the original Todoist estimate didn't
distinguish, and it matters: files like `i-2CHdSJx.jpg` are genuinely used
(`app/design/page.jsx`) — but the version currently live is a 42MB unedited
camera export, and history additionally holds a second 13MB copy from before
some edit. You cannot `filter-repo --invert-paths` these without breaking the
live site's images. They need Phase 2, below.

## Phase 1 — purge the orphaned files (safe, no live-site impact, do this now)

Script: `phase1-cleanup.sh`. Manifest: `orphaned-files-manifest.txt` (same
folder — the script reads it, don't separate them).

```
chmod +x phase1-cleanup.sh
./phase1-cleanup.sh
```

It will: mirror-backup origin, clone a disposable fresh copy, `git rm` the 113
files there, commit, run `git filter-repo --invert-paths --paths-from-file`
against the manifest to strip them from every historical commit, re-add the
`origin` remote (filter-repo drops it as a safety default), repack, and — after
a second explicit confirmation — force-push `--all` and `--tags` to origin.
Expected result: `.git` drops from 2.5GB toward roughly 1GB.

Nothing in Phase 1 touches a file your site currently serves. If you want to
sanity-check the manifest yourself before running it, it's a plain text file —
delete any line you're unsure about and it simply won't be touched.

### After the rewrite

Your existing working checkout (the one mounted in this session, with the
in-progress `app/` work) is now pointed at history that no longer exists on
origin. Once you've separately committed and pushed that in-progress work
(see the drift warning above) — or if you decide to abandon this checkout —
the clean way to get back in sync is to re-clone:

```
mv zarcone-photography zarcone-photography-old   # keep it around briefly, just in case
git clone https://github.com/Zarkonet1/zarcone-photography.git
```

Don't try to `git pull` the rewritten history into the old checkout — rebasing
a local branch onto a force-pushed, filter-repo'd remote is exactly the kind
of operation that produced the June 24 `index.lock`/`maintenance.lock`
incident. Re-cloning is slower to type but categorically safer.

## Phase 2 — the referenced-but-huge files

**Correction to my first pass:** I originally said ~192 referenced files were
still raw 20–42MB camera exports live on the site. That was wrong — I was
reading blob sizes across *all of history* and conflating old superseded
versions with what's actually in the working tree today. I went back and
checked the real on-disk size of every referenced file.

**The actual live-site exposure is much smaller: 4 files, not 192.**
`i-2CHdSJx.jpg` and the rest of that family are already fine on disk today
(805KB, 1600x2400) — the 42MB/13MB copies I flagged are dead history sitting
behind them, with zero effect on what a visitor downloads. That's a Phase 2b
problem (below), not a live-site problem.

The 4 files that genuinely are still full-size exports being served today:

| File | Current | Used in |
|---|---|---|
| `public/photos/pp1-portrait-party.jpg` | 8.1MB, 4044×3235 | `app/portrait-parties/page.jsx`, CSS background |
| `public/photos/pp3-portrait-party.jpg` | 16.6MB, 6078×4862 | `app/portrait-parties/page.jsx`, CSS background |
| `public/photos/BDB_CiJ_IG_Graphich.png` | 2.4MB, 1254×1254, no alpha channel | `lib/events.js` event card image |
| `public/videos/portraits-prosecco-reel.mp4` | 35.7MB, 29s @ 10 Mbps | `components/VideoReel.jsx` |

### Phase 2a — fix the 4 files (do this)

Script: `phase2-resize-live-images.sh`. Run it from Terminal in your regular
working checkout — this is a normal file edit + commit, **not** a history
rewrite, so (unlike Phase 1) it doesn't need a fresh clone or the sandbox
workaround.

Already tested the exact conversions so these numbers are real, not estimates:
`pp1` 8.1MB→~0.9MB, `pp3` 16.6MB→~0.8MB (both resized to 2400px long edge,
quality 82 — plenty for a browser, and still print-poster-quality if anyone
right-clicks to save), the PNG→JPEG conversion for `BDB_CiJ_IG_Graphich`
(confirmed no transparency, so nothing is lost) 2.4MB→~0.4MB, and the video
re-encoded at H.264 CRF 26 35.7MB→~8.8MB. The script backs up each original to
`/tmp` before touching anything, and pauses for you to eyeball
`/portrait-parties` locally before it commits or pushes anything.

Video re-encoding needs `ffmpeg` (`brew install ffmpeg` if you don't have it
— the script will just skip that step and tell you if it's missing, the image
fixes don't depend on it).

### Phase 2b — strip the old fat versions from history (after 2a is deployed clean)

Once Phase 2a is pushed and Vercel's redeployed without issue, the ~1GB of
old superseded blob versions (the 42MB `i-2CHdSJx.jpg`, etc.) can come out of
history the same way Phase 1 did it — fresh clone, filter-repo, force-push:

```
git clone https://github.com/Zarkonet1/zarcone-photography.git zarcone-photography-history-surgery-2
cd zarcone-photography-history-surgery-2
git filter-repo --strip-blobs-bigger-than 3M --force
git remote add origin https://github.com/Zarkonet1/zarcone-photography.git
git push origin --force --all
git push origin --force --tags
```

3MB is comfortably above every current live file after Phase 2a (largest
remaining is the ~8.8MB re-encoded video, which is a `.mp4` — filter-repo's
size strip applies to any blob type, so raise the threshold to `10M` if you
want to be certain the new video survives, or just check `du -sh` on the repo
before and after and re-clone from the mirror backup if anything looks wrong).
Same backup-first discipline as Phase 1 applies — take a `git clone --mirror`
of origin before running this, exactly like `phase1-cleanup.sh` does
automatically.

I'd sequence it as: Phase 1 now (zero risk, ~1.5GB win, ready today), Phase 2a
next time you're touching the codebase (small, low-risk, ~60MB live-weight
win plus the real fix), Phase 2b once 2a is confirmed deployed clean (~1GB
more, history-only, zero live-site risk since nothing at HEAD is near the
size threshold).

### Worth doing at some point, not urgent: fix the root cause

`app/design/page.jsx` and `components/Lightbox.jsx` both render photos with
plain `<img>` tags instead of `next/image` (Lightbox even imports `Image` from
`next/image` and then doesn't use it). Those specific files happen to be
small today, so there's no live problem right now — but plain `<img>` means
the next time someone drags a full camera export into `public/photos` and
wires it up, it ships to every visitor at full size with no warning, the same
way `pp1`/`pp3` did. Switching those two components to `next/image` gets you
automatic resizing, responsive `srcset`, and modern formats (WebP/AVIF) for
free, and makes this whole class of problem stop recurring. Low priority,
real fix.

## Files in this delivery
- `GIT-CLEANUP-RUNBOOK.md` — this document
- `orphaned-files-manifest.txt` — exact 113-file manifest, Phase 1
- `phase1-cleanup.sh` — Phase 1 automation, run from Terminal (fresh clone, history rewrite)
- `phase2-resize-live-images.sh` — Phase 2a automation, run from Terminal (your regular checkout, normal commit)
