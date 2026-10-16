#!/usr/bin/env python3
"""Reconstruct released XXVII or the preserved work-in-progress XXVIII."""
from pathlib import Path
import argparse
import hashlib

ROOT = Path(__file__).resolve().parents[1]
EXPECTED = "16f929033c537c2291776316ae392dde94cb2f8c6c059c307dec66099521fbc3"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--version", choices=["27", "28"], default="27")
parser.add_argument("--output", type=Path, default=ROOT / "dist" / "index.html")
args = parser.parse_args()
parts = sorted((ROOT / "game-v27").glob("part-*.html"))
if len(parts) != 24:
    raise SystemExit("Expected 24 source parts in game-v27")
data = b"".join(part.read_bytes() for part in parts)
if hashlib.sha256(data).hexdigest() != EXPECTED:
    raise SystemExit("XXVII source checksum mismatch")
if args.version == "28":
    source = data.decode("utf-8")
    old = "enemy=sc.units.filter(x=>x.kind==='ship'&&x.team==='enemy'&&x.hp>0),lead=friendly[0];"
    new = "enemy=sc.units.filter(x=>x.kind==='ship'&&x.team==='enemy'&&x.hp>0),lead=v28Leader(sc,b.squadron);friendly.sort((a,c)=>(a===lead?-1:c===lead?1:0));"
    boot = "fresh(0);newGame();requestAnimationFrame(clockFrame);"
    if source.count(old) != 1 or source.count(boot) != 1:
        raise SystemExit("XXVIII patch anchors do not match")
    source = source.replace(old, new, 1)
    source = source.replace(boot, (ROOT / "development" / "v28.js").read_text(encoding="utf-8") + "\n" + boot, 1)
    source = source.replace("<title>XXVII ·", "<title>XXVIII ·", 1)
    data = source.encode("utf-8")
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_bytes(data)
print(f"Version {args.version}: {args.output} ({len(data)} bytes)")
print("SHA-256:", hashlib.sha256(data).hexdigest())
