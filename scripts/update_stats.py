#!/usr/bin/env python3
"""Refresh the home dashboard stats from the machine you run it on.

Updates data/stats.js with the OS, kernel, uptime, RAM and disk usage.
The GPU/CPU graphs are intentionally left alone.
"""

from __future__ import annotations

import argparse
import json
import platform
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = ROOT / "data" / "stats.js"


def os_release() -> tuple[str, str]:
    pretty = ""
    name = ""
    version = ""
    try:
        for line in Path("/etc/os-release").read_text(encoding="utf-8").splitlines():
            if line.startswith("PRETTY_NAME="):
                pretty = line.split("=", 1)[1].strip().strip('"')
            elif line.startswith("NAME="):
                name = line.split("=", 1)[1].strip().strip('"')
            elif line.startswith("VERSION_ID="):
                version = line.split("=", 1)[1].strip().strip('"')
    except OSError:
        pass

    if not pretty:
        pretty = f"{platform.system()} {platform.release()}"

    short = name.replace(" Linux", "").strip()
    if version:
        short = f"{short} {version}".strip()
    if not short:
        short = pretty.split("(")[0].strip()

    return pretty, short


def uptime() -> str:
    try:
        seconds = float(Path("/proc/uptime").read_text(encoding="utf-8").split()[0])
    except (OSError, ValueError):
        return "unknown"

    days, rem = divmod(int(seconds), 86400)
    hours, rem = divmod(rem, 3600)
    minutes = rem // 60

    if days:
        return f"{days}d {hours}h"
    if hours:
        return f"{hours}h {minutes}m"
    return f"{minutes}m"


def ram() -> tuple[str, int]:
    values: dict[str, int] = {}
    try:
        for line in Path("/proc/meminfo").read_text(encoding="utf-8").splitlines():
            key, value = line.split(":", 1)
            values[key] = int(value.strip().split()[0])
    except (OSError, ValueError):
        return "unknown", 0

    total = values.get("MemTotal", 0)
    available = values.get("MemAvailable")
    if available is None:
        available = values.get("MemFree", 0) + values.get("Buffers", 0) + values.get("Cached", 0)

    if not total:
        return "unknown", 0

    used = max(0, total - available)
    total_gib = total / 1024 / 1024
    used_gib = used / 1024 / 1024
    return f"{used_gib:.1f} / {total_gib:.0f} GB", round(used / total * 100)


def block_devices() -> list[dict]:
    try:
        output = subprocess.check_output(
            [
                "lsblk",
                "-J",
                "-b",
                "-o",
                "NAME,SIZE,TYPE,MODEL,FSSIZE,FSUSED,MOUNTPOINT",
            ],
            text=True,
        )
    except (OSError, subprocess.CalledProcessError):
        return []

    try:
        return json.loads(output).get("blockdevices", [])
    except json.JSONDecodeError:
        return []


def walk(node: dict):
    yield node
    for child in node.get("children") or []:
        yield from walk(child)


def size_label(size: int) -> str:
    # Use decimal units so a 1TB drive is labelled 1TB, not 932GB.
    if size >= 1000**4:
        return f"{size / 1000**4:.0f}TB"
    if size >= 1000**3:
        return f"{size / 1000**3:.0f}GB"
    return f"{size / 1000**2:.0f}MB"


def disk_label(model: str, size: int) -> str:
    model = (model or "").strip()
    upper = model.upper()
    suffix = size_label(size)

    for token in ("SN850X", "SN770", "SN7100", "P310", "P3"):
        if token in upper:
            return f"{token} {suffix}"

    if "SAMSUNG" in upper:
        return f"Samsung {suffix}"
    if "CRUCIAL" in upper:
        return f"Crucial {suffix}"

    words = [word for word in model.replace("_", " ").split() if word]
    short = " ".join(words[:2]) if words else "Disk"
    return f"{short} {suffix}"


def disks() -> list[dict]:
    found: list[dict] = []

    for node in block_devices():
        if node.get("type") != "disk":
            continue

        name = (node.get("name") or "").lower()
        size = int(node.get("size") or 0)
        model = node.get("model") or ""

        if name.startswith(("zram", "loop", "sr", "fd", "ram")):
            continue
        if size < 100 * 1024**3:
            continue
        if not model and size < 1024**4:
            continue

        fs_size = 0
        fs_used = 0
        for device in walk(node):
            fs_size += int(device.get("fssize") or 0)
            fs_used += int(device.get("fsused") or 0)

        if fs_size:
            pct = round(fs_used / fs_size * 100)
        else:
            pct = 0

        found.append(
            {
                "label": disk_label(model, size),
                "pct": max(0, min(100, pct)),
                "_size": size,
            }
        )

    found.sort(key=lambda item: item["_size"], reverse=True)
    for item in found:
        item.pop("_size", None)

    return found


def main() -> None:
    parser = argparse.ArgumentParser(description="Refresh data/stats.js from this machine.")
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUT,
        help=f"Output file (default: {DEFAULT_OUT})",
    )
    args = parser.parse_args()

    pretty, short = os_release()
    ram_text, ram_pct = ram()
    kernel = platform.release()

    stats = {
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "os": pretty,
        "osShort": short,
        "kernel": kernel,
        "kernelShort": kernel.split("-")[0],
        "uptime": uptime(),
        "ram": ram_text,
        "ramPct": ram_pct,
        "disks": disks(),
    }

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        "window.LGL_STATS = " + json.dumps(stats, indent=2, ensure_ascii=False) + ";\n",
        encoding="utf-8",
    )

    print(f"Wrote {args.output}")
    print(f"  OS:     {stats['osShort']}")
    print(f"  Kernel: {stats['kernel']}")
    print(f"  Uptime: {stats['uptime']}")
    print(f"  RAM:    {stats['ram']} ({stats['ramPct']}%)")
    for disk in stats["disks"]:
        print(f"  Disk:   {disk['label']} ({disk['pct']}%)")


if __name__ == "__main__":
    main()
