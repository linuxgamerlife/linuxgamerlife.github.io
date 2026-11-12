#!/usr/bin/env python3
"""Version the generated data scripts from their contents.

GitHub Pages serves data/*.js with a long cache lifetime, so a refreshed file can
keep the old contents for hours after a deploy. Stamping the script URLs with a
content hash gives the CDN and browsers a new URL whenever the data changes,
while leaving unchanged data on its existing URL.

Run it after writing any of the data scripts:
    python3 scripts/stamp_assets.py
"""

from __future__ import annotations

import hashlib
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_FILES = ("data/projects.js", "data/supporters.js", "data/stats.js")

# src="data/projects.js" / src="data/projects.js?v=abc123"
HTML_RE = re.compile(r'(src="data/(?:projects|supporters|stats)\.js)(?:\?v=[^"]*)?(")')
# "/data/projects.js" / "/data/projects.js?v=abc123" in the service worker core list.
SW_RE = re.compile(r'("/data/(?:projects|supporters|stats)\.js)(?:\?v=[^"]*)?(")')
CACHE_RE = re.compile(r'const CACHE = "lgl-v(\d+)";')


def content_version() -> str:
    """Short hash of the generated data, so the URL only changes with the data."""
    digest = hashlib.sha256()
    for relative in DATA_FILES:
        path = ROOT / relative
        if path.exists():
            digest.update(path.read_bytes())
    return digest.hexdigest()[:10]


def bump_cache(sw_text: str) -> tuple[str, int | None, int | None]:
    """Increment the service-worker cache name so the old data cache is dropped."""
    match = CACHE_RE.search(sw_text)
    if not match:
        return sw_text, None, None
    old = int(match.group(1))
    new = old + 1
    return CACHE_RE.sub(f'const CACHE = "lgl-v{new}";', sw_text, count=1), old, new


def stamp() -> str:
    version = content_version()
    changed: list[str] = []

    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        updated = HTML_RE.sub(lambda m: f"{m.group(1)}?v={version}{m.group(2)}", text)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            changed.append(path.name)

    sw_path = ROOT / "sw.js"
    sw_text = sw_path.read_text(encoding="utf-8")
    updated_sw = SW_RE.sub(lambda m: f"{m.group(1)}?v={version}{m.group(2)}", sw_text)
    if updated_sw != sw_text:
        updated_sw, old_cache, new_cache = bump_cache(updated_sw)
        sw_path.write_text(updated_sw, encoding="utf-8")
        if old_cache is not None:
            changed.append(f"sw.js (cache lgl-v{old_cache} -> lgl-v{new_cache})")
        else:
            changed.append("sw.js")

    if changed:
        return f"stamped data scripts with ?v={version}: " + ", ".join(changed)
    return f"data scripts already current at ?v={version}"


if __name__ == "__main__":
    print(stamp())
