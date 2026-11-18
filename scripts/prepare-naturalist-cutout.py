#!/usr/bin/env python3
"""Apply a reviewed alpha mask to an existing 512 px naturalist plate."""
import argparse
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("plate", type=Path)
parser.add_argument("mask", type=Path, help="PNG grayscale mask: black is transparent, white is opaque")
args = parser.parse_args()
with Image.open(args.plate) as source:
    if source.size != (512, 512) or source.format != "WEBP":
        parser.error("La lámina canónica debe ser WebP de 512 × 512.")
    plate = source.convert("RGB")
with Image.open(args.mask) as source:
    if source.mode != "L" or source.size != plate.size or source.getextrema() != (0, 255):
        parser.error("La máscara debe ser gris, de 512 × 512 y con transparencia y opacidad reales.")
    plate.putalpha(source)
temporary = args.plate.with_suffix(".new.webp")
plate.save(temporary, "WEBP", lossless=True, method=5)
temporary.replace(args.plate)
