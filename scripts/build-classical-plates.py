#!/usr/bin/env python3
"""Extract scientific artwork from reviewed contact sheets and build WebP derivatives."""
import argparse
import importlib.util
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage


def read_encoder():
    spec = importlib.util.spec_from_file_location(
        "plate_encoder", Path(__file__).with_name("build-naturalist-primate-plates.py")
    )
    encoder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(encoder)
    return encoder


encoder = read_encoder()


def connected_animals(sheet, columns, rows, selections):
    alpha = np.asarray(sheet.getchannel("A"))
    labels, labels_count = ndimage.label(alpha >= 78)
    for threshold in (78, 115, 155, 195):
        if threshold != 78:
            labels, labels_count = ndimage.label(alpha >= threshold)
        areas = np.bincount(labels.ravel(), minlength=labels_count + 1)
        regions = ndimage.find_objects(labels)
        selected = {}
        for index, stem in selections.items():
            column, row = index % columns, index // columns
            view = labels[
                row * sheet.height // rows:(row + 1) * sheet.height // rows,
                column * sheet.width // columns:(column + 1) * sheet.width // columns
            ]
            counts = np.bincount(view.ravel())
            counts[0] = 0
            component = int(counts.argmax())
            if component and areas[component] > view.size * .016 and counts[component] / areas[component] >= .48:
                selected[stem] = component
        if len(selected) == len(selections) and len(set(selected.values())) == len(selections):
            return labels, regions, selected, threshold
    raise ValueError("No se pudo separar una silueta principal por celda")


def extract(sheet, labels, region, component, threshold):
    y, x = region
    left, top = max(0, x.start - 5), max(0, y.start - 5)
    right, bottom = min(sheet.width, x.stop + 5), min(sheet.height, y.stop + 5)
    rgba = np.array(sheet.crop((left, top, right, bottom)))
    source_alpha = rgba[..., 3].astype(np.float32)
    subject = labels[top:bottom, left:right] == component
    edge_distance = ndimage.distance_transform_edt(~subject)
    cutoff = max(11, threshold - 57)
    alpha = np.clip((source_alpha - cutoff) * 255 / (244 - cutoff), 0, 255)
    alpha[edge_distance > 4.5] = 0

    colors = rgba[..., :3].astype(np.float32)
    interior = ndimage.distance_transform_edt(alpha >= 220) > 3
    distance, nearest = ndimage.distance_transform_edt(~interior, return_indices=True)
    interior_color = colors[nearest[0], nearest[1]]
    matte = (colors - interior_color).mean(axis=2)
    amount = np.clip((matte - 18) / 40, 0, 1) * np.clip((8 - distance) / 5, 0, 1)
    rgba[..., :3] = np.clip(colors + (interior_color - colors) * amount[..., None], 0, 255)
    rgba[..., 3] = np.round(alpha)
    rgba[rgba[..., 3] == 0, :3] = 0

    animal = Image.fromarray(rgba)
    animal = animal.crop(animal.getchannel("A").getbbox())
    scale = 448 / max(animal.size)
    animal = animal.resize(tuple(round(n * scale) for n in animal.size), Image.Resampling.LANCZOS)
    plate = Image.new("RGBA", (512, 512))
    plate.alpha_composite(animal, ((512 - animal.width) // 2, (512 - animal.height) // 2))
    touches_sheet = min(x.start, y.start, sheet.width - x.stop, sheet.height - y.stop) <= 1
    return plate, touches_sheet


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("jobs", type=Path, help="JSON con file, columns, rows y stems (vacío para omitir una celda)")
    parser.add_argument("output", type=Path)
    parser.add_argument("--inventory", type=Path, help="Registro de especies del laboratorio con sus variantes")
    args = parser.parse_args()
    jobs = json.loads(args.jobs.read_text())
    variants = {}
    if args.inventory:
        variants = {
            sp["id"]: [record["key"] for record in sp["records"] if record["key"] in ("albino", "melanico")]
            for sp in json.loads(args.inventory.read_text())
        }
    measurements = {}
    errors = {}
    for name, job in jobs.items():
        try:
            with Image.open(job["file"]) as image:
                sheet = image.convert("RGBA")
            stems = {i: stem for i, stem in enumerate(job["stems"]) if stem}
            labels, regions, selected, threshold = connected_animals(sheet, job["columns"], job["rows"], stems)
            for stem, component in selected.items():
                plate, touches_sheet = extract(sheet, labels, regions[component - 1], component, threshold)
                sizes = encoder.write_plate(plate, stem, args.output)
                measurements[stem] = {"batch": name, "touchesSheet": touches_sheet, "sizes": sizes}
                species, kind = stem.rsplit("--", 1)
                if kind == "normal":
                    for variant in variants.get(species, ()):
                        stem_variant = species + "--" + variant
                        pigment = encoder.pigment(plate, variant)
                        variant_sizes = encoder.write_plate(pigment, stem_variant, args.output)
                        measurements[stem_variant] = {"batch": name, "touchesSheet": touches_sheet, "sizes": variant_sizes}
        except (ValueError, OSError) as error:
            errors[name] = str(error)
    print(json.dumps({"measurements": measurements, "errors": errors}, indent=2, ensure_ascii=False))
    if errors:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
