#!/usr/bin/env python3
"""Build missing or stale game thumbnails from the canonical 512 px WebP plates."""
from pathlib import Path
from PIL import Image

root = Path("www/naturalist-art/plates")
for size, quality in ((64, 79), (128, 80), (256, 82)):
    directory = root / str(size)
    directory.mkdir(exist_ok=True)
    for source in sorted(root.glob("*.webp")):
        target = directory / source.name
        if target.exists() and target.stat().st_mtime_ns >= source.stat().st_mtime_ns:
            continue
        with Image.open(source) as image:
            if image.size != (512, 512) or image.format != "WEBP":
                raise ValueError(f"Lámina inválida: {source}")
            image.resize((size, size), Image.Resampling.LANCZOS).save(
                target, "WEBP", quality=quality, method=6
            )
