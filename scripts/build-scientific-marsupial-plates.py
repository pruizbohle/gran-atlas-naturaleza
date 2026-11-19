#!/usr/bin/env python3
"""Extract and measure classic zoological plates from transparent contact sheets."""
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


def extract(sheet, index, marks, components, threshold):
    col, row = index % 3, index // 3
    left, top = col * sheet.width // 3, row * sheet.height // 3
    right, bottom = (col + 1) * sheet.width // 3, (row + 1) * sheet.height // 3
    counts = np.bincount(marks[top:bottom, left:right].ravel())
    counts[0] = 0
    if not counts.max():
        raise ValueError("Celda sin espécimen recortable")
    component = int(counts.argmax())
    y, x = components[component - 1]
    crosses_grid = x.start < left or x.stop > right or y.start < top or y.stop > bottom
    touches_sheet = min(x.start, y.start, sheet.width - x.stop, sheet.height - y.stop) <= 1
    bounds = (max(0, x.start - 4), max(0, y.start - 4),
              min(sheet.width, x.stop + 4), min(sheet.height, y.stop + 4))
    rgba = np.array(sheet.crop(bounds))
    cutoff = max(16, threshold - 36)
    alpha = np.clip((rgba[..., 3].astype(np.float32) - cutoff) * 255 / (245 - cutoff), 0, 255)
    subject = marks[bounds[1]:bounds[3], bounds[0]:bounds[2]] == component
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
    cutout = cutout.crop(cutout.getbbox())
    scale = 450 / max(cutout.size)
    cutout = cutout.resize(tuple(round(dimension * scale) for dimension in cutout.size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (512, 512))
    canvas.alpha_composite(cutout, ((512 - cutout.width) // 2, (512 - cutout.height) // 2))
    return canvas, component, crosses_grid, touches_sheet


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
    fields = []
    for sheet, job in zip(sheets, jobs):
        threshold = job.get("alphaThreshold", 27)
        if not 27 <= threshold < 245:
            raise ValueError("El umbral alfa debe estar entre 27 y 244")
        marks, _ = ndimage.label(np.asarray(sheet.getchannel("A")) >= threshold)
        fields.append((marks, ndimage.find_objects(marks), threshold))
    seen = set()
    rows = []
    for index, record in enumerate(records):
        name = Path(record["src"]).name
        with Image.open(NATURAL / name) as source:
            natural = source.convert("RGBA")
        batch = index // 9
        scientific, component, crosses_grid, touches_sheet = extract(sheets[batch], index % 9, *fields[batch])
        if (batch, component) in seen:
            raise ValueError(f"Dos celdas comparten una silueta conectada en {name}")
        seen.add((batch, component))
        scientific.save(args.masters / name.replace(".webp", ".png"))
        masks = [mask32(image) for image in (natural, scientific)]
        similarity = 2 * np.logical_and(*masks).sum() / sum(mask.sum() for mask in masks)
        row = {"file": name, "species": record["id"], "variant": record["key"],
               "crossesGrid": crosses_grid, "touchesSheet": touches_sheet, "silhouetteDice32": round(float(similarity), 4),
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
