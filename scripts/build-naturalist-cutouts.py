#!/usr/bin/env python3
"""Compare WebP settings or build the existing plates from their originals and reviewed masks."""
import argparse
import io
import json
import math
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import numpy as np
from PIL import Image


SIZES = (64, 128, 256, 512)
QUALITIES = (75, 80, 85, 90, 95)
SAMPLES = (
    "oc_esp_ornithorhynchus_anatinus--normal", "oc_esp_tachyglossus_aculeatus--normal",
    "oc_esp_myrmecobius_fasciatus--normal", "oc_esp_petauroides_volans--normal",
    "asia_esp_0402--ambar", "zorro_rojo--albino", "lobo_gris--fenrir",
    "nutria_europea--melanico", "af_suricata--albino", "asia_esp_0007--normal",
)


def encode(image, quality, alpha_quality=100, lossless=False):
    buffer = io.BytesIO()
    image.save(buffer, "WEBP", quality=quality, alpha_quality=alpha_quality,
               lossless=lossless, method=4, exact=False)
    return buffer.getvalue()


def plate_at(root, name, size):
    return (root if size == 512 else root / str(size)) / name


def decoded(data):
    with Image.open(io.BytesIO(data)) as image:
        return np.asarray(image.convert("RGBA"), dtype=np.int32)


def comparison(image, data, quality, alpha_quality, size):
    source = np.asarray(image, dtype=np.int32)
    result = decoded(data)
    foreground = source[..., 3] >= 240
    rgb_delta = np.abs(source[..., :3][foreground] - result[..., :3][foreground])
    alpha_delta = np.abs(source[..., 3] - result[..., 3])
    return dict(size=size, quality=quality, alphaQuality=alpha_quality, bytes=len(data),
                meanRgbError=round(float(rgb_delta.mean()), 3),
                p95RgbError=float(np.quantile(rgb_delta, .95)),
                psnr=round(-10 * math.log10(max(1e-12, (rgb_delta ** 2).mean()) / 255 ** 2), 2),
                changedAlpha=int(np.count_nonzero(alpha_delta)),
                maxAlphaError=int(alpha_delta.max()))


def build(args, original):
    name = original.name
    target = args.output / name
    mask = args.masks / (original.stem + ".png")
    with Image.open(original) as source:
        plate = source.convert("RGBA")
    if mask.exists():
        with Image.open(mask) as source:
            if source.mode != "L" or source.size != plate.size:
                raise ValueError(f"Máscara inválida: {mask}")
            plate.putalpha(source)
    else:
        with Image.open(target) as source:
            plate.putalpha(source.convert("RGBA").getchannel("A"))
    if plate.size != (512, 512) or plate.getchannel("A").getextrema() != (0, 255):
        raise ValueError(f"Falta una máscara válida para {name}")

    stats = []
    sizes = {}
    for size in SIZES:
        image = plate if size == 512 else plate.resize((size, size), Image.Resampling.LANCZOS)
        before = plate_at(args.reference, name, size).stat().st_size
        if args.sample:
            for quality, alpha in [(quality, 100) for quality in QUALITIES] + [(90, 85), (90, 95), ("lossless", 100)]:
                data = encode(image, 80 if quality == "lossless" else quality, alpha, quality == "lossless")
                stats.append(comparison(image, data, quality, alpha, size))
                if args.lab and size == 512 and quality in QUALITIES and alpha == 100:
                    (args.lab / "compression" / str(quality) / name).write_bytes(data)
        else:
            quality = {64: 82, 128: 83, 256: 86, 512: args.quality}[size]
            data = encode(image, quality)
            alpha = np.asarray(image.getchannel("A"))
            if not np.array_equal(decoded(data)[..., 3], alpha):
                raise ValueError(f"El alfa cambió en {name}, {size}px")
            destination = plate_at(args.output, name, size)
            temporary = destination.with_suffix(".tmp")
            temporary.write_bytes(data)
            temporary.replace(destination)
            sizes[str(size)] = {"before": before, "after": len(data)}
    if args.lab:
        (args.lab / "before" / name).write_bytes(plate_at(args.reference, name, 256).read_bytes())
    return {"file": name, "sizes": sizes, "comparison": stats}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--reference", type=Path, required=True, help="Láminas originales con sus derivados")
    parser.add_argument("--masks", type=Path, required=True, help="Máscaras grises de 512 px revisadas")
    parser.add_argument("--output", type=Path, default=Path("www/naturalist-art/plates"))
    parser.add_argument("--lab", type=Path, help="Directorio de comparaciones del laboratorio")
    parser.add_argument("--sample", action="store_true")
    parser.add_argument("--plate", help="Procesar solamente esta lámina, por nombre sin extensión")
    parser.add_argument("--quality", type=int, choices=QUALITIES, default=90)
    args = parser.parse_args()
    if args.lab:
        (args.lab / "before").mkdir(parents=True, exist_ok=True)
        if args.sample:
            for quality in QUALITIES:
                (args.lab / "compression" / str(quality)).mkdir(parents=True, exist_ok=True)
    originals = sorted(args.reference.glob("*.webp"))
    if args.sample:
        originals = [file for file in originals if file.stem in SAMPLES]
    if args.plate:
        originals = [file for file in originals if file.stem == args.plate]
    if not originals:
        parser.error("No hay láminas originales que coincidan con la selección.")
    with ThreadPoolExecutor(max_workers=2) as workers:
        report = list(workers.map(lambda file: build(args, file), originals))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
