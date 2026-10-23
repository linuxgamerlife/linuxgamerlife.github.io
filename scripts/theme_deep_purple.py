#!/usr/bin/env python3
"""Switch the site to the deep purple theme."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from theme_cli import run
from theme_engine import to_purple

if __name__ == "__main__":
    raise SystemExit(run("deep purple", "deep-purple", to_purple, "#08050f"))
