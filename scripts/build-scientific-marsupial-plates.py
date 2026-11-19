#!/usr/bin/env python3
"""Align experimental contact sheets with production plates and measure both WebP sets."""
import argparse
import io
import json
import math
import statistics
import time
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage


ROOT = Path("www")
NATURAL = ROOT / "naturalist-art/plates"
SCIENTIFIC = ROOT / "scientific-illustration/plates"
QUALITIES = {64: 82, 128: 83, 256: 86, 512: 90}


def plate(root, name, size):
    return (root if size == 512 else root / str(size)) / name


def extract(sheet, index, reference):
    col, row = index % 3, index // 3
    bounds = (col * sheet.width // 3, row * sheet.height // 3,
              (col + 1) * sheet.width // 3, (row + 1) * sheet.height // 3)
    rgba = np.array(sheet.crop(bounds))
    alpha = np.clip((rgba[..., 3].astype(np.float32) - 16) * 255 / 229, 0, 255)
    marks, _ = ndimage.label(alpha >= 12)
    counts = np.bincount(marks.ravel())
    counts[0] = 0
    if not counts.max():
        raise ValueError("Celda sin espécimen recortable")
    subject = marks == counts.argmax()
    alpha[ndimage.distance_transform_edt(~subject) > 3] = 0

    colors = rgba[..., :3].astype(np.float32)
    inner = ndimage.distance_transform_edt(alpha >= 215) > 3.5
    distances, nearest = ndimage.distance_transform_edt(~inner, return_indices=True)
    neighbor = colors[nearest[0], nearest[1]]
    bright_edge = (colors - neighbor).mean(axis=2)
    strength = np.clip((bright_edge - 15) / 35, 0, 1) * np.clip((8 - distances) / 4, 0, 1)
    rgba[..., :3] = np.uint8(np.clip(colors + (neighbor - colors) * strength[..., None], 0, 255))
    rgba[..., 3] = np.uint8(np.round(alpha))
    rgba[rgba[..., 3] == 0, :3] = 0
    cutout = Image.fromarray(rgba)
    cell_bounds = cutout.getbbox()
    touches_cell = min(cell_bounds[0], cell_bounds[1], cutout.width - cell_bounds[2],
                       cutout.height - cell_bounds[3]) <= 1
    cutout = cutout.crop(cell_bounds)
    left, top, right, bottom = reference.getbbox()
    scale = min((right - left) / cutout.width, (bottom - top) / cutout.height)
    cutout = cutout.resize(tuple(round(dimension * scale) for dimension in cutout.size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (512, 512))
    canvas.alpha_composite(cutout, ((left + right - cutout.width) // 2, (top + bottom - cutout.height) // 2))
    return canvas, touches_cell


def compression(image, quality):
    buffer = io.BytesIO()
    start = time.perf_counter()
    image.save(buffer, "WEBP", quality=quality, alpha_quality=100, method=4, exact=False)
    elapsed = (time.perf_counter() - start) * 1000
    data = buffer.getvalue()
    with Image.open(io.BytesIO(data)) as decoded:
        before = np.asarray(image, dtype=np.float32)
        after = np.asarray(decoded, dtype=np.float32)
    if not np.array_equal(before[..., 3], after[..., 3]):
        raise ValueError("El ciclo de compresión modificó el alfa")
    visible = before[..., 3] >= 235
    mse = float(np.mean((before[..., :3][visible] - after[..., :3][visible]) ** 2))
    return data, {"bytes": len(data), "encodeMs": round(elapsed, 3),
                  "psnrDb": round(10 * math.log10(255 ** 2 / max(mse, 1e-9)), 2)}


def mask32(image):
    return np.array(image.resize((32, 32), Image.Resampling.LANCZOS).getchannel("A")) > 127


def decode_totals(files):
    data = [file.read_bytes() for file in files]
    elapsed = []
    for _ in range(5):
        start = time.perf_counter()
        for item in data:
            with Image.open(io.BytesIO(item)) as image:
                image.load()
        elapsed.append((time.perf_counter() - start) * 1000)
    return round(statistics.median(elapsed), 2)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("inventory", type=Path)
    parser.add_argument("jobs", type=Path)
    parser.add_argument("masters", type=Path)
    args = parser.parse_args()
    records = json.loads(args.inventory.read_text())
    jobs = json.loads(args.jobs.read_text())
    args.masters.mkdir(parents=True, exist_ok=True)
    sheets = [Image.open(job["file"]).convert("RGBA") for job in jobs]
    rows = []
    for index, record in enumerate(records):
        name = Path(record["src"]).name
        with Image.open(NATURAL / name) as source:
            natural = source.convert("RGBA")
        scientific, near_edge = extract(sheets[index // 9], index % 9, natural)
        scientific.save(args.masters / name.replace(".webp", ".png"))
        masks = [mask32(image) for image in (natural, scientific)]
        similarity = 2 * np.logical_and(*masks).sum() / sum(mask.sum() for mask in masks)
        row = {"file": name, "species": record["id"], "variant": record["key"],
               "nearCellEdge": near_edge, "silhouetteDice32": round(float(similarity), 4),
               "naturalCoverage32": int(masks[0].sum()), "scientificCoverage32": int(masks[1].sum()), "sizes": {}}
        for size, quality in QUALITIES.items():
            images = [image if size == 512 else image.resize((size, size), Image.Resampling.LANCZOS)
                      for image in (natural, scientific)]
            (_, reference_metrics), (data, candidate_metrics) = [compression(image, quality) for image in images]
            dest = plate(SCIENTIFIC, name, size)
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(data)
            row["sizes"][str(size)] = {
                "naturalBytes": plate(NATURAL, name, size).stat().st_size,
                "scientificBytes": len(data), "naturalReencode": reference_metrics, "scientific": candidate_metrics}
        rows.append(row)
    groups = {}
    for size in QUALITIES:
        value = [row["sizes"][str(size)] for row in rows]
        group = {key: sum(item[key] for item in value) for key in ("naturalBytes", "scientificBytes")}
        for kind, directory in (("naturalReencode", NATURAL), ("scientific", SCIENTIFIC)):
            group[kind] = {
                "meanPsnrDb": round(statistics.mean(item[kind]["psnrDb"] for item in value), 2),
                "encodeMs": round(sum(item[kind]["encodeMs"] for item in value), 2),
                "medianDecodeMsForAll": decode_totals([plate(directory, row["file"], size) for row in rows])}
        group["decodedRgbaBytesPerPlate"] = size * size * 4
        groups[str(size)] = group
    result = {"plates": len(rows), "generationSeconds": [job["seconds"] for job in jobs],
              "medianSilhouetteDice32": round(statistics.median(row["silhouetteDice32"] for row in rows), 4),
              "bySize": groups, "detail": rows}
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
