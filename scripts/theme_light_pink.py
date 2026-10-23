#!/usr/bin/env python3
"""Switch the site to the light pink theme."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from theme_cli import run
from theme_engine import to_pink

if __name__ == "__main__":
    raise SystemExit(run("light pink", "light-pink", to_pink, "#17131c"))
