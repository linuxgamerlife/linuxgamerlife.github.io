#!/usr/bin/env python3
"""Render the 1200x630 social preview card used by the Open Graph tags.

Usage:
    python3 scripts/make_og.py

Requires Playwright for Python. The page reads the local Inter/JetBrains Mono
fonts, so no network access is needed.
"""

from __future__ import annotations

import hashlib
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "scripts" / "og-template.html"
OUTPUT = ROOT / "assets" / "img" / "og.png"

OG_IMAGE_RE = re.compile(r'(content="https://[^"]*/assets/img/og\.png)(?:\?v=[^"]*)?(")')


def image_version() -> str:
    return hashlib.sha256(OUTPUT.read_bytes()).hexdigest()[:12]


def stamp_pages(version: str) -> None:
    """Point every page at this image build, so social caches fetch the new file."""
    changed = []
    for path in sorted(ROOT.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        updated = OG_IMAGE_RE.sub(lambda m: f"{m.group(1)}?v={version}{m.group(2)}", text)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            changed.append(path.name)
    if changed:
        print(f"stamped og.png?v={version} in: {', '.join(changed)}")
    else:
        print(f"og.png?v={version} already referenced everywhere")


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        page = browser.new_page(
            viewport={"width": 1200, "height": 630},
            device_scale_factor=1,
        )
        page.goto(TEMPLATE.as_uri(), wait_until="load")
        page.evaluate("document.fonts.ready")
        page.screenshot(path=str(OUTPUT), clip={"x": 0, "y": 0, "width": 1200, "height": 630})
        browser.close()

    print(f"wrote {OUTPUT.relative_to(ROOT)}")
    stamp_pages(image_version())


if __name__ == "__main__":
    main()
