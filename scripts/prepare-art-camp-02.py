"""Exporta recortes revisados de las maestras de ART-CAMP-02."""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs/art-camp-02'
DESTINATION = ROOT / 'www/art-camp-02/arte'


def export(key, source, box, polygon, fill, alpha_floor, feather):
    with Image.open(source) as original:
        if 'A' not in original.getbands():
            raise ValueError(f'{key}: la maestra requiere alfa')
        art = original.convert('RGBA')
    if box:
        art = art.crop(box)
    alpha = art.getchannel('A')
    if polygon:
        mask = Image.new('L', art.size)
        ImageDraw.Draw(mask).polygon([tuple(point) for point in polygon],fill=255)
        alpha = ImageChops.multiply(alpha,mask)
    if alpha_floor:
        alpha = alpha.point(lambda value: max(0, round((value - alpha_floor) * 255 / (255 - alpha_floor))))
    if feather:
        width, height = art.size
        fades = Image.new('L', (width, height))
        fades.putdata([
            round(255 * min(1, x / feather, y / feather, (width - 1 - x) / feather, (height - 1 - y) / feather))
            for y in range(height) for x in range(width)
        ])
        alpha = ImageChops.multiply(alpha, fades)
    art.putalpha(alpha)
    extent = alpha.point(lambda value: 255 if value >= 18 else 0).getbbox()
    if not extent or extent[0] == 0 or extent[1] == 0 or extent[2] == art.width or extent[3] == art.height:
        raise ValueError(f'{key}: revisar recorte o borde de la maestra')
    art = art.crop(extent)
    for width in (384, 768):
        height = round(width * 0.7)
        scale = min(width * 0.96 / art.width, height * 0.96 / art.height) * fill
        resized = art.resize(tuple(round(value * scale) for value in art.size), Image.Resampling.LANCZOS)
        canvas = Image.new('RGBA', (width, height))
        canvas.paste(resized, ((width - resized.width) // 2, height - resized.height - round(height * 0.02)))
        canvas.save(DESTINATION / f'{key}-{width}.webp', quality=88, method=5)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('sector')
    sector = parser.parse_args().sector
    plans = json.loads((DOCS / 'planchas.json').read_text(encoding='utf-8'))
    DESTINATION.mkdir(parents=True, exist_ok=True)
    for plan in plans[sector]:
        export(plan['id'], DOCS / 'maestras' / plan['file'], plan.get('box'), plan.get('polygon'), plan.get('fill', 1),
               plan.get('alphaFloor', 0), plan.get('feather', 0))


if __name__ == '__main__':
    main()
