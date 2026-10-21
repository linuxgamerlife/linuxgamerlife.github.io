#!/usr/bin/env python3
"""Build data/projects.json from GitHub, Copr and the hand-written curation file.

Usage:
    python3 scripts/fetch_projects.py

Environment:
    GH_TOKEN / GITHUB_TOKEN   Optional token; raises the GitHub API rate limit.

The site itself needs no build step: this script only refreshes the JSON snapshot
that assets/js/site.js renders. Run it locally, or let the nightly GitHub Action
in .github/workflows/refresh-projects.yml do it.
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

USER = "linuxgamerlife"
ROOT = Path(__file__).resolve().parent.parent
CURATION = ROOT / "data" / "curation.json"
OUTPUT = ROOT / "data" / "projects.json"

CATEGORY_ORDER = ["apps", "setup", "desktop", "experiments"]


def get_json(url: str, token: str | None = None) -> object:
    request = urllib.request.Request(url, headers={"User-Agent": "lgl-website/1.0"})
    if token and "api.github.com" in url:
        request.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def github_projects(token: str | None) -> tuple[dict[str, dict], dict]:
    repos = get_json(f"https://api.github.com/users/{USER}/repos?per_page=100&sort=updated", token)
    if not isinstance(repos, list):
        raise RuntimeError("Unexpected GitHub response")
    by_name = {}
    for repo in repos:
        by_name[repo["name"]] = {
            "stars": repo.get("stargazers_count", 0),
            "forks": repo.get("forks_count", 0),
            "language": repo.get("language"),
            "updated": (repo.get("pushed_at") or "")[:10],
            "repo_url": repo.get("html_url"),
            "homepage": repo.get("homepage") or None,
            "archived": bool(repo.get("archived")),
        }
    public = [r for r in repos if not r.get("fork")]
    meta = {
        "repos": len(repos),
        "stars": sum(r.get("stargazers_count", 0) for r in public),
        "forks": sum(r.get("forks_count", 0) for r in public),
    }
    return by_name, meta


def copr_projects() -> tuple[dict[str, dict], int]:
    data = get_json(
        f"https://copr.fedorainfracloud.org/api_3/project/search?query={USER}&limit=100"
    )
    items = data.get("items", []) if isinstance(data, dict) else []
    by_full_name = {}
    for item in items:
        if item.get("ownername") != USER:
            continue
        chroots = item.get("chroot_repos") or {}
        by_full_name[item["full_name"]] = {
            "packages": sorted(k for k in chroots),
            "homepage": item.get("homepage") or None,
            "description": (item.get("description") or "").strip(),
        }
    return by_full_name, len(by_full_name)


def fail(message: str) -> None:
    print(f"error: {message}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    curation = json.loads(CURATION.read_text(encoding="utf-8"))
    entries = curation.get("projects", [])
    if not entries:
        fail(f"no projects found in {CURATION}")

    repos: dict[str, dict] = {}
    gh_meta = {"repos": 0, "stars": 0, "forks": 0}
    copr: dict[str, dict] = {}
    copr_count = 0
    warnings = []

    try:
        repos, gh_meta = github_projects(token)
    except (urllib.error.URLError, RuntimeError, ValueError) as error:
        warnings.append(f"GitHub lookup failed ({error}); keeping last known metrics")

    try:
        copr, copr_count = copr_projects()
    except (urllib.error.URLError, ValueError) as error:
        warnings.append(f"Copr lookup failed ({error}); keeping curation links only")

    output = []
    for entry in entries:
        repo_name = entry.get("repo")
        if not repo_name:
            continue
        live = repos.get(repo_name, {})
        copr_ref = entry.get("copr")
        if copr_ref and copr and copr_ref.get("project") not in copr:
            warnings.append(f"{repo_name}: Copr project {copr_ref['project']} not found")

        output.append(
            {
                "repo": repo_name,
                "title": entry.get("title", repo_name),
                "category": entry.get("category", "experiments"),
                "blurb": entry.get("blurb", ""),
                "tags": entry.get("tags", []),
                "featured": bool(entry.get("featured")),
                "stars": live.get("stars", 0),
                "forks": live.get("forks", 0),
                "language": live.get("language") or entry.get("language"),
                "updated": live.get("updated") or entry.get("updated"),
                "repo_url": live.get("repo_url") or f"https://github.com/{USER}/{repo_name}",
                "copr": copr_ref,
            }
        )

    output.sort(key=lambda item: CATEGORY_ORDER.index(item["category"]) if item["category"] in CATEGORY_ORDER else 99)

    meta = {
        "repos": gh_meta["repos"],
        "stars": gh_meta["stars"],
        "forks": gh_meta["forks"],
        "copr_projects": copr_count,
        "apps_packaged": sum(1 for item in output if item["copr"]),
        "visible_projects": len(output),
    }

    # Keep the previous timestamp when nothing changed, so the nightly job does
    # not create an empty commit every day.
    generated = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    if OUTPUT.exists():
        try:
            previous = json.loads(OUTPUT.read_text(encoding="utf-8"))
            if previous.get("projects") == output and previous.get("meta") == meta:
                generated = previous.get("generated", generated)
        except (ValueError, OSError):
            pass

    payload = {
        "generated": generated,
        "meta": meta,
        "projects": output,
    }

    OUTPUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    for warning in warnings:
        print(f"warning: {warning}")
    print(
        f"wrote {OUTPUT.relative_to(ROOT)} — {len(output)} projects, "
        f"{gh_meta['repos']} repos, {copr_count} Copr projects"
    )


if __name__ == "__main__":
    main()
