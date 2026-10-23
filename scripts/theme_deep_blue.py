#!/usr/bin/env python3
"""Switch the site to the deep blue theme."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from theme_cli import run
from theme_engine import to_blue

if __name__ == "__main__":
    raise SystemExit(run("deep blue", "deep-blue", to_blue, "#040913"))
