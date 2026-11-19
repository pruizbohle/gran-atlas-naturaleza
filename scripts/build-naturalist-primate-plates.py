#!/usr/bin/env python3
"""Build V4.3.0 plates from reviewed, transparent 512px masters and runtime inventory."""
import argparse
import json
from pathlib import Path

import numpy as np
from PIL import Image


QUALITY = {64: 82, 128: 83, 256: 86, 512: 90}


def pigment(image, variant):
    rgba = np.array(image)
    rgb = rgba[..., :3].astype(np.float32)
    coverage = rgba[..., 3] > 242
    lightness = rgb @ np.array([.2126, .7152, .0722], dtype=np.float32)
    if variant == "albino":
        lo, hi = np.quantile(lightness[coverage], [.005, .97])
        tone = np.clip((lightness - lo) / max(hi - lo, 1), 0, 1)
        # Warm shadows retain pencil detail; darker visible skin becomes pale pink.
        light = tone ** .64
        fur = np.stack((169 + 83 * light, 137 + 108 * light, 126 + 106 * light), axis=-1)
        pigment_color = fur + (rgb - lightness[..., None]) * .09
    else:
        # Keep cool highlights visible on already dark coats and black facial skin.
        pigment_color = 10 + 66 * (lightness[..., None] / 255) ** 1.25
        pigment_color = pigment_color + np.array([2, 4, 7]) + (rgb - lightness[..., None]) * .12
    rgba[..., :3] = np.uint8(np.clip(pigment_color, 0, 255))
    rgba[rgba[..., 3] == 0, :3] = 0
    return Image.fromarray(rgba)


def write_plate(image, stem, output):
    if image.mode != "RGBA" or image.size != (512, 512) or image.getchannel("A").getextrema() != (0, 255):
        raise ValueError(f"Se requiere una lámina cuadrada con alfa real para {stem}")
    result = {}
    for size, quality in QUALITY.items():
        folder = output if size == 512 else output / str(size)
        folder.mkdir(parents=True, exist_ok=True)
        target = folder / f"{stem}.webp"
        resized = image if size == 512 else image.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(target, format="WEBP", quality=quality, alpha_quality=100, method=4, exact=False)
        with Image.open(target) as decoded:
            if decoded.getchannel("A").tobytes() != resized.getchannel("A").tobytes():
                raise ValueError(f"Canal alfa alterado en {target}")
        result[str(size)] = target.stat().st_size
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inventory", type=Path)
    parser.add_argument("masters", type=Path)
    parser.add_argument("--output", type=Path, default=Path("www/naturalist-art/plates"))
    args = parser.parse_args()
    inventory = json.loads(args.inventory.read_text())
    report = {}
    for species in inventory:
        name = species["id"]
        normal_key = name + "--normal"
        with Image.open(args.masters / (normal_key + ".png")) as source:
            normal = source.copy()
        report[normal_key] = write_plate(normal, normal_key, args.output)
        for label, variant in (("Albino", "albino"), ("Melánico", "melanico")):
            if label in species["variants"]:
                key = name + "--" + variant
                report[key] = write_plate(pigment(normal, variant), key, args.output)
        keys = ["male", "female"] if species["sex"] else []
        if "Legendario" in species["variants"]:
            if name != "af_gorila_montana":
                raise ValueError(f"Identidad legendaria por confirmar: {name}")
            keys.append("silverback")
        for variant in keys:
            key = name + "--" + variant
            with Image.open(args.masters / (key + ".png")) as source:
                report[key] = write_plate(source, key, args.output)
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
