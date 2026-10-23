"""Colour transformations for the site themes.

Every function is pure: it takes the contents of assets/css/site.css and returns
the same stylesheet in the target palette. The transformations work from any of
the supported themes because they first normalise to the green baseline.

The palettes are deliberately literal rather than variable-based: the stylesheet
uses many one-off shades for glows, badges and gradients, and swapping those
exactly keeps every theme pixel-consistent.
"""

from __future__ import annotations

import re

_HEX_RE = re.compile(r"#[0-9a-fA-F]{6}")
_RGBA_RE = re.compile(r"rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,")

# --------------------------------------------------------------------------
# Purple to green
# --------------------------------------------------------------------------
PURPLE_TO_GREEN_SPECIALS = [
    (
        "   Dark violet design system derived from the LGL supporter overlay.",
        "   Dark forest-green design system derived from the LGL desktop palette.",
    ),
    (
        "background: linear-gradient(100deg, #f0a8d8 0%, var(--accent) 30%, #b18cff 70%, #8f6bff 100%);",
        "background: linear-gradient(100deg, #d9ffec 0%, var(--accent) 32%, #4fe0a2 72%, #2fbf82 100%);",
    ),
    (
        "  background: linear-gradient(100deg, #c94ea2, #9a6bff 60%, #7b55e8);\n  color: #fff;",
        "  background: linear-gradient(100deg, #4fe0a2, #6df2ad 55%, #2fbf82);\n  color: #04140c;",
    ),
    (
        "background: linear-gradient(100deg, #d35aae, #a678ff 60%, #8460f0);",
        "background: linear-gradient(100deg, #6df2ad, #8ff8c4 55%, #4fe0a2);",
    ),
]

PURPLE_TO_GREEN_HEX = {
    "#08050f": "#040b08",
    "#0f0a1d": "#07130e",
    "#150d29": "#0a1c14",
    "#0c0719": "#06120d",
    "#f6f2ff": "#ecfff5",
    "#b3a8c9": "#a3c2b3",
    "#8a80a3": "#7d9c8d",
    "#d05eac": "#6df2ad",
    "#9a6bff": "#2fbf82",
    "#6f4bd8": "#12634a",
    "#f0a8d8": "#c8ffe4",
    "#b18cff": "#4fe0a2",
    "#8f6bff": "#1f9d69",
    "#c94ea2": "#1f9d69",
    "#a678ff": "#4fe0a2",
    "#7b55e8": "#12634a",
    "#d35aae": "#2fbf82",
    "#8460f0": "#0f6b4b",
    "#f0b0d9": "#b6ffd9",
    "#f3c2e4": "#b6ffd9",
    "#e9b6f5": "#c8ffe4",
    "#d6c6ff": "#a8f5cb",
    "#cbb8ff": "#a8f5cb",
    "#b79cff": "#a8f5cb",
    "#cfc6e6": "#cfe9dc",
    "#ded6f2": "#d8f5e6",
    "#7d7297": "#6f8f80",
    "#3a2f52": "#173a2a",
    "#e8eaf2": "#e4fff1",
    "#dfe4f0": "#e4fff1",
    "#0a0714": "#040b08",
}

PURPLE_TO_GREEN_RGBA = {
    (208, 94, 172): (109, 242, 173),
    (154, 107, 255): (47, 191, 130),
    (176, 140, 255): (126, 245, 185),
    (196, 160, 255): (156, 255, 204),
    (111, 75, 216): (18, 99, 74),
    (30, 19, 52): (9, 32, 22),
    (28, 18, 49): (8, 28, 20),
    (26, 16, 45): (7, 25, 18),
    (24, 16, 43): (8, 26, 18),
    (12, 8, 24): (5, 18, 12),
    (10, 7, 20): (5, 16, 11),
    (8, 5, 15): (4, 11, 8),
    (6, 4, 12): (3, 9, 6),
    (4, 2, 10): (2, 8, 5),
}

# --------------------------------------------------------------------------
# Green to purple
# --------------------------------------------------------------------------
GREEN_TO_PURPLE_SPECIALS = [
    (
        "   Dark forest-green design system derived from the LGL desktop palette.",
        "   Dark violet design system derived from the LGL supporter overlay.",
    ),
    (
        "background: linear-gradient(100deg, #d9ffec 0%, var(--accent) 32%, #4fe0a2 72%, #2fbf82 100%);",
        "background: linear-gradient(100deg, #f0a8d8 0%, var(--accent) 30%, #b18cff 70%, #8f6bff 100%);",
    ),
    (
        "  background: linear-gradient(100deg, #4fe0a2, #6df2ad 55%, #2fbf82);\n  color: #04140c;",
        "  background: linear-gradient(100deg, #c94ea2, #9a6bff 60%, #7b55e8);\n  color: #fff;",
    ),
    (
        "background: linear-gradient(100deg, #6df2ad, #8ff8c4 55%, #4fe0a2);",
        "background: linear-gradient(100deg, #d35aae, #a678ff 60%, #8460f0);",
    ),
    (
        ".mark-tw { color: #a8f5cb; }",
        ".mark-tw { color: #b79cff; }",
    ),
    (
        "  color: #b6ffd9;\n}\n.card__icon svg",
        "  color: #f3c2e4;\n}\n.card__icon svg",
    ),
    (
        ".badge--sep { border-color: rgba(47, 191, 130, 0.32); background: rgba(47, 191, 130, 0.1); color: #a8f5cb; }",
        ".badge--sep { border-color: rgba(154, 107, 255, 0.32); background: rgba(154, 107, 255, 0.1); color: #cbb8ff; }",
    ),
    (
        ".mark-x { color: #e4fff1; }",
        ".mark-x { color: #dfe4f0; }",
    ),
    (
        "  .nav { background: #040b08; box-shadow: 0 24px 40px -20px rgba(0, 0, 0, 0.9); }",
        "  .nav { background: #0a0714; box-shadow: 0 24px 40px -20px rgba(0, 0, 0, 0.9); }",
    ),
]

GREEN_TO_PURPLE_HEX = {
    "#040b08": "#08050f",
    "#06120d": "#0c0719",
    "#07130e": "#0f0a1d",
    "#0a1c14": "#150d29",
    "#0f6b4b": "#8460f0",
    "#12634a": "#6f4bd8",
    "#173a2a": "#3a2f52",
    "#1f9d69": "#8f6bff",
    "#2fbf82": "#9a6bff",
    "#4fe0a2": "#b18cff",
    "#6df2ad": "#d05eac",
    "#6f8f80": "#7d7297",
    "#7d9c8d": "#8a80a3",
    "#a3c2b3": "#b3a8c9",
    "#a8f5cb": "#d6c6ff",
    "#b6ffd9": "#f0b0d9",
    "#c8ffe4": "#e9b6f5",
    "#cfe9dc": "#cfc6e6",
    "#d8f5e6": "#ded6f2",
    "#e4fff1": "#e8eaf2",
    "#ecfff5": "#f6f2ff",
}

GREEN_TO_PURPLE_RGBA = {
    (109, 242, 173): (208, 94, 172),
    (47, 191, 130): (154, 107, 255),
    (126, 245, 185): (176, 140, 255),
    (156, 255, 204): (196, 160, 255),
    (18, 99, 74): (111, 75, 216),
    (9, 32, 22): (30, 19, 52),
    (8, 28, 20): (28, 18, 49),
    (7, 25, 18): (26, 16, 45),
    (8, 26, 18): (24, 16, 43),
    (5, 18, 12): (12, 8, 24),
    (5, 16, 11): (10, 7, 20),
    (4, 11, 8): (8, 5, 15),
    (3, 9, 6): (6, 4, 12),
    (2, 8, 5): (4, 2, 10),
}

# --------------------------------------------------------------------------
# Blue to green
# --------------------------------------------------------------------------
BLUE_TO_GREEN_SPECIALS = [
    (
        "   Dark blue design system derived from the LGL desktop palette.",
        "   Dark forest-green design system derived from the LGL desktop palette.",
    ),
    (
        "background: linear-gradient(100deg, #d9ecff 0%, var(--accent) 32%, #4f9df0 72%, #2f6fd0 100%);",
        "background: linear-gradient(100deg, #d9ffec 0%, var(--accent) 32%, #4fe0a2 72%, #2fbf82 100%);",
    ),
    (
        "  background: linear-gradient(100deg, #4f9df0, #7cc4ff 55%, #2f6fd0);\n  color: #04101f;",
        "  background: linear-gradient(100deg, #4fe0a2, #6df2ad 55%, #2fbf82);\n  color: #04140c;",
    ),
    (
        "background: linear-gradient(100deg, #6fb4ff, #9ed4ff 55%, #4f9df0);",
        "background: linear-gradient(100deg, #6df2ad, #8ff8c4 55%, #4fe0a2);",
    ),
]

BLUE_TO_GREEN_HEX = {
    "#040913": "#040b08",
    "#050e1c": "#06120d",
    "#071326": "#07130e",
    "#0b1e3a": "#0a1c14",
    "#eaf4ff": "#ecfff5",
    "#a4b9d4": "#a3c2b3",
    "#7d93b2": "#7d9c8d",
    "#6fb4ff": "#6df2ad",
    "#2f6fd0": "#2fbf82",
    "#123b73": "#12634a",
    "#d9ecff": "#c8ffe4",
    "#4f9df0": "#4fe0a2",
    "#b8dcff": "#b6ffd9",
    "#a8d4ff": "#a8f5cb",
    "#cfe0f5": "#cfe9dc",
    "#d8e9fa": "#d8f5e6",
    "#6f8aa8": "#6f8f80",
    "#173252": "#173a2a",
    "#e4f1ff": "#e4fff1",
    "#7cc4ff": "#6df2ad",
    "#9ed4ff": "#8ff8c4",
    "#04101f": "#04140c",
}

BLUE_TO_GREEN_RGBA = {
    (111, 180, 255): (109, 242, 173),
    (47, 111, 208): (47, 191, 130),
    (120, 175, 255): (126, 245, 185),
    (150, 200, 255): (156, 255, 204),
    (18, 59, 115): (18, 99, 74),
    (9, 25, 45): (9, 32, 22),
    (8, 24, 45): (8, 28, 20),
    (7, 22, 42): (7, 25, 18),
    (8, 23, 44): (8, 26, 18),
    (5, 16, 32): (5, 18, 12),
    (5, 14, 29): (5, 16, 11),
    (4, 9, 19): (4, 11, 8),
    (3, 7, 16): (3, 9, 6),
    (2, 6, 13): (2, 8, 5),
}

# --------------------------------------------------------------------------
# Green to blue
# --------------------------------------------------------------------------
GREEN_TO_BLUE_SPECIALS = [
    (
        "   Dark forest-green design system derived from the LGL desktop palette.",
        "   Dark blue design system derived from the LGL desktop palette.",
    ),
    (
        "background: linear-gradient(100deg, #d9ffec 0%, var(--accent) 32%, #4fe0a2 72%, #2fbf82 100%);",
        "background: linear-gradient(100deg, #d9ecff 0%, var(--accent) 32%, #4f9df0 72%, #2f6fd0 100%);",
    ),
    (
        "  background: linear-gradient(100deg, #4fe0a2, #6df2ad 55%, #2fbf82);\n  color: #04140c;",
        "  background: linear-gradient(100deg, #4f9df0, #7cc4ff 55%, #2f6fd0);\n  color: #04101f;",
    ),
    (
        "background: linear-gradient(100deg, #6df2ad, #8ff8c4 55%, #4fe0a2);",
        "background: linear-gradient(100deg, #6fb4ff, #9ed4ff 55%, #4f9df0);",
    ),
]

GREEN_TO_BLUE_HEX = {
    "#040b08": "#040913",
    "#06120d": "#050e1c",
    "#07130e": "#071326",
    "#0a1c14": "#0b1e3a",
    "#ecfff5": "#eaf4ff",
    "#a3c2b3": "#a4b9d4",
    "#7d9c8d": "#7d93b2",
    "#6df2ad": "#6fb4ff",
    "#2fbf82": "#2f6fd0",
    "#12634a": "#123b73",
    "#c8ffe4": "#d9ecff",
    "#4fe0a2": "#4f9df0",
    "#1f9d69": "#2f6fd0",
    "#b6ffd9": "#b8dcff",
    "#a8f5cb": "#a8d4ff",
    "#cfe9dc": "#cfe0f5",
    "#d8f5e6": "#d8e9fa",
    "#6f8f80": "#6f8aa8",
    "#173a2a": "#173252",
    "#e4fff1": "#e4f1ff",
    "#0f6b4b": "#4f9df0",
}

GREEN_TO_BLUE_RGBA = {
    (109, 242, 173): (111, 180, 255),
    (47, 191, 130): (47, 111, 208),
    (126, 245, 185): (120, 175, 255),
    (156, 255, 204): (150, 200, 255),
    (18, 99, 74): (18, 59, 115),
    (9, 32, 22): (9, 25, 45),
    (8, 28, 20): (8, 24, 45),
    (7, 25, 18): (7, 22, 42),
    (8, 26, 18): (8, 23, 44),
    (5, 18, 12): (5, 16, 32),
    (5, 16, 11): (5, 14, 29),
    (4, 11, 8): (4, 9, 19),
    (3, 9, 6): (3, 7, 16),
    (2, 8, 5): (2, 6, 13),
}

_COMBINED_TO_GREEN_HEX = {**PURPLE_TO_GREEN_HEX, **BLUE_TO_GREEN_HEX}
_COMBINED_TO_GREEN_RGBA = {**PURPLE_TO_GREEN_RGBA, **BLUE_TO_GREEN_RGBA}


def _apply(css: str, specials, hex_map, rgba_map) -> str:
    for old, new in specials:
        css = css.replace(old, new)

    if hex_map:
        css = _HEX_RE.sub(lambda m: hex_map.get(m.group(0).lower(), m.group(0)), css)

    if rgba_map:
        def replace_rgba(match: re.Match[str]) -> str:
            key = (int(match.group(1)), int(match.group(2)), int(match.group(3)))
            new = rgba_map.get(key)
            if not new:
                return match.group(0)
            return f"rgba({new[0]}, {new[1]}, {new[2]},"

        css = _RGBA_RE.sub(replace_rgba, css)
    return css


def to_green(css: str) -> str:
    """Return the stylesheet in the green palette, from any supported theme."""
    css = _apply(css, PURPLE_TO_GREEN_SPECIALS + BLUE_TO_GREEN_SPECIALS, {}, {})
    return _apply(css, [], _COMBINED_TO_GREEN_HEX, _COMBINED_TO_GREEN_RGBA)


def to_purple(css: str) -> str:
    """Return the stylesheet in the deep purple palette."""
    css = to_green(css)
    return _apply(css, GREEN_TO_PURPLE_SPECIALS, GREEN_TO_PURPLE_HEX, GREEN_TO_PURPLE_RGBA)


def to_blue(css: str) -> str:
    """Return the stylesheet in the deep blue palette."""
    css = to_green(css)
    return _apply(css, GREEN_TO_BLUE_SPECIALS, GREEN_TO_BLUE_HEX, GREEN_TO_BLUE_RGBA)
