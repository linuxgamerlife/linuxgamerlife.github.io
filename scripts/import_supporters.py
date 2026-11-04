#!/usr/bin/env python3
"""Import a supporter export for the community page.

Only first names are written to the repository. Twitch usernames are single
tokens, so they are left as they are.

Usage:
    python3 scripts/import_supporters.py "/path/to/overlay-data.js"

The source file is the same one used by the OBS overlay. The generated
data/supporters.js contains no surnames.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "data" / "supporters.js"

# Exact display names for phrases and handles that are not personal names.
DISPLAY_NAMES = {
    "J. Tekk": "J. Tekk",
    "The King's Partner": "The King's Partner",
    "kein Kommentar .,.": "kein Kommentar",
    "XeroLinux Official": "XeroLinux Official",
    "Enormous Chunks": "Enormous Chunks",
}

# CamelCase handles that must stay whole instead of becoming NameS.
KEEP_FULL_NAMES = {
    "MotoPoem",
    "JuggernautX",
    "BoltActionJackson",
    "KingClawblazer",
    "TheLownoise",
    "TheBlackDon",
    "WhenLogicDies",
    "CyberNinja005",
    "iFlxy",
    "Jtadlock91",
}


def load_export(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    match = re.search(r"=\s*(\{.*\})\s*;?\s*$", text, re.S)
    if not match:
        raise SystemExit(f"error: could not find an OVERLAY_DATA object in {path}")
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError as error:
        raise SystemExit(f"error: invalid JSON in {path}: {error}") from error


def display_name(name: object) -> str:
    value = str(name).strip().replace("＇", "'").replace("’", "'")
    if not value:
        return value
    if value in DISPLAY_NAMES:
        return DISPLAY_NAMES[value]
    if value in KEEP_FULL_NAMES:
        return value
    if " " in value:
        return value.split()[0]

    # NameSurname -> NameS, while leaving digits, symbols and ordinary handles alone.
    if value.isalpha():
        parts = re.findall(r"[A-Z][a-z0-9]*|[A-Z]+|[a-z0-9]+", value)
        if len(parts) == 2 and parts[0][0].isupper() and parts[1][0].isupper():
            return parts[0] + parts[1][0]
    return value


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: python3 scripts/import_supporters.py <overlay-data.js>")

    source = Path(sys.argv[1]).expanduser()
    if not source.is_file():
        raise SystemExit(f"error: {source} not found")

    data = load_export(source)
    for platform in ("youtube", "twitch"):
        for row in data.get(platform, []):
            if row:
                row[0] = display_name(row[0])

    payload = json.dumps(data, indent=2, ensure_ascii=False)
    TARGET.write_text(
        "// Supporter roll for the community page. Names shortened to first names, with listed exceptions.\n"
        "window.OVERLAY_DATA = " + payload + ";\n",
        encoding="utf-8",
    )

    total = sum(len(data.get(platform, [])) for platform in ("youtube", "twitch"))
    print(f"wrote {TARGET.relative_to(ROOT)}: {total} supporters, names shortened")


if __name__ == "__main__":
    main()
