"""OBJ-01: pasar las tres planchas originales. OBJ-02 a OBJ-09: pasar la etapa (por ejemplo --obj-04) y una plancha opcional."""
import json
from pathlib import Path
import sys

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[2] / 'www/objetos-cientificos/arte'
SHEETS = (
    (4, 'binoculars field_telescope brass_compass sturdy_pack field_hat museum_medallion '
        'pressed_flower ancient_coin parchment_scrap fossil_skull wolf_tooth world_map'),
    (3, 'BOT-01 SEM-12 HOJ-01 GEM-09 GEM-12 AMB-12 MET-06 MIN-09 CON-07'),
    (3, 'COR-01 ALG-01 NUM-01 FIL-01 MED-01 MAP-09 HUE-12 ARQ-01 MAR-12'),
)

def prepare(filename, columns, names, method, guides=None):
    sheet = Image.open(filename).convert('RGBA')
    # Las divisiones manuales siguen los espacios transparentes de cada plancha.
    if guides:
        rows = guides['rows']
        bounds_by_row = guides['edges']
        if 'alpha' in guides:
            low, high = guides['alpha']
            alpha = sheet.getchannel('A')
            sheet.putalpha(alpha.point(lambda value: round(max(0, min(255, (value-low)*255/(high-low))))))
    elif method == 6 and sheet.size == (1448, 1086):
        rows = (0, 362, 724, 1086)
        bounds_by_row = ((0,362,724,1050,1448), (0,420,724,1050,1448), (0,370,750,1030,1448))
    elif method == 6 and sheet.size == (1263, 1246):
        rows = (0, 414, 813, 1246)
        bounds_by_row = ((0,425,845,1263),) * 3
    else:
        count = len(names) // columns
        rows = tuple(row * sheet.height // count for row in range(count + 1))
        bounds_by_row = (tuple(column * sheet.width // columns for column in range(columns + 1)),) * count
    for index, name in enumerate(names):
        if name is None:
            continue
        row, column = divmod(index, columns)
        edges = bounds_by_row[row]
        polygon = (guides or {}).get('polygons', {}).get(name)
        rectangle = (guides or {}).get('rectangles', {}).get(name)
        if rectangle:
            art = sheet.crop(tuple(rectangle))
        elif polygon:
            mask = Image.new('L', sheet.size)
            ImageDraw.Draw(mask).polygon([tuple(point) for point in polygon], fill=255)
            art = sheet.copy()
            art.putalpha(ImageChops.multiply(sheet.getchannel('A'), mask))
        else:
            padding = (guides or {}).get('padding', 0)
            art = sheet.crop((edges[column] + padding, rows[row] + padding,
                              edges[column + 1] - padding, rows[row + 1] - padding))
        alpha = art.getchannel('A')
        bounds = alpha.point(lambda value: 255 if value >= 18 else 0).getbbox()
        if not bounds:
            raise ValueError(f'Celda vacía: {name}')
        if method != 6 and (bounds[0] == 0 or bounds[1] == 0 or
                            bounds[2] == art.width or bounds[3] == art.height):
            raise ValueError(f'Revisar límites de celda: {name}')
        art = art.crop(bounds)
        export_sprite(name, art, method)


def export_sprite(name, art, method=4):
    folder = ROOT / name
    folder.mkdir(parents=True, exist_ok=True)
    # Reducir microtextura y reforzar masas tonales para tamaños de casilla.
    smooth = art.convert('RGB').filter(ImageFilter.MedianFilter(3))
    smooth = ImageEnhance.Contrast(smooth).enhance(1.10)
    smooth.putalpha(art.getchannel('A'))
    for variant, source, fill, quality in (
        ('clasica', art, 0.81, 88), ('inventario', smooth, 0.89, 79)
    ):
        for size in (64, 128, 256, 512):
            factor = size * fill / max(source.size)
            resized = source.resize(tuple(round(d * factor) for d in source.size), Image.Resampling.LANCZOS)
            if variant == 'inventario' and size <= 128:
                alpha = resized.getchannel('A')
                resized = resized.convert('RGB').filter(ImageFilter.UnsharpMask(0.85, 80, 3))
                resized.putalpha(alpha)
            canvas = Image.new('RGBA', (size, size))
            canvas.paste(resized, ((size-resized.width)//2, (size-resized.height)//2))
            canvas.save(folder / f'{variant}-{size}.webp', quality=quality, method=method)

def main(args):
    if args and args[0] in ('--obj-02', '--obj-03', '--obj-04', '--obj-05', '--obj-06', '--obj-07', '--obj-08', '--obj-09'):
        stage = args[0][2:]
        folder = Path(__file__).parent
        plan = json.loads((folder / f'{stage}.json').read_text())
        sheets = [sheet for sheet in plan['sheets'] if len(args) == 1 or sheet['file'] == args[1]]
        if not sheets or len(args) > 2:
            sys.exit(__doc__)
        for sheet in sheets:
            prepare(folder / f'maestras-{stage}' / sheet['file'], sheet['columns'], sheet['ids'], 4, sheet.get('crop'))
    elif len(args) == 3:
        for filename, (columns, names) in zip(args, SHEETS):
            prepare(filename, columns, names.split(), 6)
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main(sys.argv[1:])
