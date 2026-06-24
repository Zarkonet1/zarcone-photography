# Production Incident Report — zarconephotography.com
**Date:** June 24, 2026  
**Scope:** Full audit of sandbox, git, GitHub, Vercel, and live site  
**Status:** Findings only — no changes made yet

---

## TL;DR

The site itself is healthy. Zero runtime errors, zero failed requests, all deployments building and going live cleanly. The friction you're experiencing is entirely in the **development workflow**, not the production infrastructure. There are two real problems to fix: the git lock files the sandbox leaves behind, and a contact form that silently drops every submission. Everything else is minor.

---

## What's Working Well

- **GitHub → Vercel pipeline is solid.** Every push to `main` triggers a build. 19 of 20 deployments in history went READY. Build time is ~2 minutes.
- **Domain assignment is correct.** `zarconephotography.com` and `www.zarconephotography.com` point to the latest production deployment.
- **Live site: no errors.** Zero console errors, zero failed requests on homepage and blog. All photos, JS, and CSS loading with 200/304.
- **Blog system works.** Markdown → dynamic rendering is functioning. `force-dynamic` + `Cache-Control: no-store` on `/blog` ensures posts show up immediately after deploy.
- **Instagram feed, Vercel Analytics:** both loading fine.
- **No runtime errors** in the past 7 days per Vercel's error aggregator.

---

## Root Cause #1 — Git Lock Files (HIGH PRIORITY)

**What's happening:** Every git command run inside the Claude sandbox creates `.git/HEAD.lock`, `.git/index.lock`, and sometimes `.git/objects/maintenance.lock`. On a normal filesystem, git deletes these when the command finishes. On the macOS filesystem mounted into the sandbox, `delete` returns `Operation not permitted` — so the lock files are left behind as empty 0-byte stale artifacts.

**Right now, three lock files exist in your repo:**
```
.git/HEAD.lock           (0 bytes — stale)
.git/index.lock          (0 bytes — stale)
.git/objects/maintenance.lock  (0 bytes — stale)
```

**Why this causes git failures:** When a subsequent git command runs (from sandbox or Terminal), it sees an existing lock file and either:
- Warns and proceeds (if it's 0 bytes and clearly stale)
- Fails with `fatal: Unable to create HEAD.lock: File exists` if the file system reports it as live

**Root cause:** The sandbox is running as Linux user `trusting-bold-fermat` over a macOS FUSE/SMB mount. The mount prevents `unlink()` from working, even for files the sandbox user created. This is a sandbox architecture limitation — it cannot be fixed by changing git config.

**The fix:** Run all git commands from your own Mac Terminal. The CHEATSHEET already documents the correct workflow:
```bash
cd ~/Claude/Projects/ZP\ Web\ Redsign/zarcone-next
git add -A
git commit -m "describe what you changed"
git push
```

When you run this from Terminal, macOS has full delete permissions and lock files clean up normally. **The sandbox should only be used to edit files** — let Terminal handle all the git operations.

**If you ever see a HEAD.lock error in Terminal:**
```bash
rm -f ~/Claude/Projects/ZP\ Web\ Redsign/zarcone-next/.git/HEAD.lock \
      ~/Claude/Projects/ZP\ Web\ Redsign/zarcone-next/.git/index.lock \
      ~/Claude/Projects/ZP\ Web\ Redsign/zarcone-next/.git/objects/maintenance.lock
```

---

## Root Cause #2 — Contact Form Is Broken (HIGH PRIORITY)

**What's happening:** The contact form on your About page POSTs to `/api/contact`. The route receives the submission, logs it to the console, and returns `{ success: true }` — but **never sends an email**. The email-sending code is commented out in `app/api/contact/route.js` with a note that says "Logging for now."

This means anyone who fills out your contact form gets a success message, but you never see their inquiry.

**Fix:** Wire up the contact route to an email service. Two options are already stubbed out in the code:

- **Resend** (recommended — free for 3,000 emails/month, simple setup): `npm install resend`, get a free API key at resend.com, add `RESEND_API_KEY` as a Vercel environment variable.
- **Nodemailer via Gmail**: Add `SMTP_USER` and `SMTP_PASS` as Vercel environment variables.

This needs to happen before you drive any traffic to the site.

---

## Root Cause #3 — No `.vercel/project.json` (LOW)

**What's happening:** The project directory has no `.vercel/project.json` (and no `vercel.json`). This means running `vercel --prod` from Terminal would either prompt interactively or fail to find the project without being logged in to the Vercel CLI.

**Why it doesn't matter for your workflow:** Every deployment in your history was triggered by GitHub push (`"githubDeployment": "1"`), not by `vercel --prod`. The GitHub webhook → Vercel build pipeline is your actual deploy mechanism. The SITE-CHEATSHEET correctly documents `git push` as the deploy step. The `vercel --prod` command in memory is not needed and not used.

**No action required** — but worth knowing so you don't troubleshoot a CLI deploy that was never part of the workflow.

---

## Root Cause #4 — Node 24 vs Next.js 14 (LOW)

**What's happening:** The Vercel project is set to Node 24.x. Next.js 14.2.3 was designed and tested against Node 18 LTS and Node 20 LTS. Node 24 is not officially supported by Next.js 14.

**Current impact:** None visible — all 19 successful builds completed fine. But running on an unsupported runtime could cause subtle issues with future package updates or Next.js internal behavior.

**Recommended fix:** Change the Vercel project's Node version to 20.x in Vercel project settings → General → Node.js Version. Also add to `package.json`:
```json
"engines": { "node": ">=18.17.0 <21" }
```

---

## Root Cause #5 — Split Commit Identity (LOW)

**What's happening:** Git history shows two different commit authors:
- Terminal/sandbox commits: `Tom Zarcone <tom.zarcone@mac.com>` — **unverified** on GitHub
- GitHub web UI commits: `Zarkonet1 <tom@zarconephotography.com>` — **verified** on GitHub

This doesn't affect deployments at all. It just makes the commit history look inconsistent and the "unverified" badge appears on sandbox-originated commits.

**Fix (optional):** Set up SSH commit signing for your Terminal git identity, or simply accept the two-identity pattern — it has no operational impact.

---

## Root Cause #6 — Prior Instant Rollback Incident (RESOLVED)

The previous incident where a Claude session recommended Instant Rollback pinned `zarconephotography.com` to deployment `dpl_2TiCiz4bJhCUm1Ug4vTQZEHntG6X`, causing all new builds to show "Staged / Assigning Custom Domains: Skipped." This was resolved by Promoting the latest deployment. Documented in memory — will not be suggested again.

---

## One Failed Build in History

Deployment `dpl_C19JTHH8VX11hAMYUPzMHMDG9Xtd` (ERROR) failed with:
```
Couldn't find any `pages` or `app` directory.
```
This was the first attempt to commit the middleware Range header fix. It appears the build ran against a state where the `app/` directory wasn't in the expected location (possibly a root directory misconfiguration for that commit). It was immediately fixed by revert + re-commit. One-time incident, no structural issue.

---

## Recommended Actions (Prioritized)

| # | Action | Priority | Who |
|---|--------|----------|-----|
| 1 | Wire up contact form email in `app/api/contact/route.js` | HIGH | Claude + Tom |
| 2 | Clean current lock files: `rm -f .git/HEAD.lock .git/index.lock .git/objects/maintenance.lock` | HIGH | Tom (Terminal) |
| 3 | Update SITE-CHEATSHEET to reinforce: sandbox edits files, Terminal runs git | MED | Claude |
| 4 | Change Vercel Node version from 24.x to 20.x | LOW | Tom (Vercel dashboard) |
| 5 | Add `"engines"` field to package.json | LOW | Claude |

---

## Current Production Status

```
Domain:     zarconephotography.com ✓
Deployment: dpl_DaVW5We2N925KMtXdD1geAiKNh92 (READY) ✓
Branch:     main ✓
Node:       24.x (works, not ideal)
Commit:     5e24f1f — "Fix: lower Ironman card crop to show white helmet rider and bike"
Errors:     0 runtime errors (7-day window)
```
