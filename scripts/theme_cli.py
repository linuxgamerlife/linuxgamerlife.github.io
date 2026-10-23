"""Shared command-line handling for the theme switchers."""

from __future__ import annotations

import argparse
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSS = ROOT / "assets" / "css" / "site.css"
IMAGES = ROOT / "assets" / "img"
THEME_ROOT = ROOT / "assets" / "theme"
IMAGE_FILES = ("logo.svg", "logo.png", "apple-touch-icon.png", "og.png")
THEME_COLOR_RE = re.compile(r'(<meta name="theme-color" content=")#[0-9a-fA-F]{6}(")')


def run(name: str, folder: str, transform, theme_color: str) -> int:
    parser = argparse.ArgumentParser(description=f"Switch the site to the {name} theme.")
    parser.add_argument("--dry-run", action="store_true", help="report changes without writing them")
    args = parser.parse_args()

    theme_images = THEME_ROOT / folder
    if not CSS.exists():
        print(f"error: {CSS} not found", file=sys.stderr)
        return 1
    if not theme_images.is_dir():
        print(f"error: theme images not found in {theme_images}", file=sys.stderr)
        return 1

    css = CSS.read_text(encoding="utf-8")
    updated = transform(css)
    changed = updated != css

    if args.dry_run:
        print("CSS would change" if changed else f"CSS is already {name}")
    elif changed:
        CSS.write_text(updated, encoding="utf-8")
        print(f"updated {CSS.relative_to(ROOT)}")

    html_changes = 0
    for page in sorted(ROOT.glob("*.html")):
        source = page.read_text(encoding="utf-8")
        result, count = THEME_COLOR_RE.subn(rf"\g<1>{theme_color}\g<2>", source)
        if count:
            html_changes += count
            if not args.dry_run:
                page.write_text(result, encoding="utf-8")

    if args.dry_run:
        print(f"theme-color would change on {html_changes} page(s)")
        print(f"images would be restored from assets/theme/{folder}")
        return 0

    for filename in IMAGE_FILES:
        source = theme_images / filename
        if not source.exists():
            print(f"warning: missing theme image {source.relative_to(ROOT)}", file=sys.stderr)
            continue
        shutil.copy2(source, IMAGES / filename)

    if not changed and not html_changes:
        print(f"Site is already using the {name} theme.")
    else:
        print(f"theme-color updated on {html_changes} page(s)")
        print(f"restored logo and social images from assets/theme/{folder}")
        print(f"done: {name} theme applied")
    return 0
