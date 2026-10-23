#!/usr/bin/env python3
"""Switch the site to the green theme."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from theme_cli import run
from theme_engine import to_green

if __name__ == "__main__":
    raise SystemExit(run("green", "harry-green", to_green, "#040b08"))
