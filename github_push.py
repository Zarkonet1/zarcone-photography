#!/usr/bin/env python3
"""
Push changes to GitHub via API — no git CLI, no lock files.
Claude calls this directly from the sandbox instead of git add/commit/push.
Usage: python3 github_push.py "commit message"
"""

import sys, os, base64, json, subprocess, urllib.request, re

OWNER  = "Zarkonet1"
REPO   = "zarcone-photography"
BRANCH = "main"

def get_token():
    """Read GitHub token from .git/config remote URL (never committed)."""
    config = os.path.join(os.path.dirname(__file__), ".git", "config")
    with open(config) as f:
        text = f.read()
    m = re.search(r'https://[^:]+:([^@]+)@github\.com', text)
    if not m:
        raise RuntimeError("GitHub token not found in .git/config")
    return m.group(1)

def api(method, path, data=None, token=None):
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", f"token {token}")
    req.add_header("Accept", "application/vnd.github.v3+json")
    req.add_header("Content-Type", "application/json")
    body = json.dumps(data).encode() if data else None
    try:
        with urllib.request.urlopen(req, body) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"GitHub API error {e.code}: {e.read().decode()}")

def get_changed_files(repo_root):
    """List changed/added/deleted files without acquiring index locks."""
    env = {**os.environ, "GIT_OPTIONAL_LOCKS": "0"}
    r = subprocess.run(
        ["git", "status", "--porcelain", "-u"],
        cwd=repo_root, capture_output=True, text=True, env=env
    )
    changed, deleted = [], []
    for line in r.stdout.splitlines():
        if not line.strip():
            continue
        status = line[:2].strip()
        path   = line[3:].strip().strip('"')
        if status == "D":
            deleted.append(path)
        else:
            changed.append(path)
    return changed, deleted

def main():
    if len(sys.argv) < 2:
        print('Usage: python3 github_push.py "commit message"')
        sys.exit(1)

    message   = sys.argv[1]
    repo_root = os.path.dirname(os.path.abspath(__file__))
    token     = get_token()

    changed, deleted = get_changed_files(repo_root)
    if not changed and not deleted:
        print("Nothing to commit.")
        sys.exit(0)

    print(f"Files to commit: {changed + deleted}")

    # Current HEAD
    ref      = api("GET", f"git/ref/heads/{BRANCH}", token=token)
    head_sha = ref["object"]["sha"]
    commit   = api("GET", f"git/commits/{head_sha}", token=token)
    base_tree_sha = commit["tree"]["sha"]

    # Build tree
    tree_items = []
    for path in changed:
        full = os.path.join(repo_root, path)
        with open(full, "rb") as f:
            content = f.read()
        blob = api("POST", "git/blobs", {
            "content": base64.b64encode(content).decode(),
            "encoding": "base64"
        }, token=token)
        tree_items.append({
            "path": path, "mode": "100644",
            "type": "blob", "sha": blob["sha"]
        })
    for path in deleted:
        tree_items.append({
            "path": path, "mode": "100644",
            "type": "blob", "sha": None
        })

    tree = api("POST", "git/trees", {
        "base_tree": base_tree_sha,
        "tree": tree_items
    }, token=token)

    new_commit = api("POST", "git/commits", {
        "message": message,
        "tree": tree["sha"],
        "parents": [head_sha],
        "author": {"name": "Tom Zarcone", "email": "tom.zarcone@mac.com"}
    }, token=token)

    api("PATCH", f"git/refs/heads/{BRANCH}", {
        "sha": new_commit["sha"], "force": False
    }, token=token)

    short = new_commit["sha"][:7]
    print(f"\n✓ Pushed {short}: {message}")
    print("Vercel will be live in ~2 minutes.")

if __name__ == "__main__":
    main()
