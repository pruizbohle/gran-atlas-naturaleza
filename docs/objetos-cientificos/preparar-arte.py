"""Recorta tres planchas RGBA. Pasar las rutas de objetos, naturaleza y mixta."""
from pathlib import Path
import sys

from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[2] / 'www/objetos-cientificos/arte'
SHEETS = (
    (4, 'binoculars field_telescope brass_compass sturdy_pack field_hat museum_medallion '
        'pressed_flower ancient_coin parchment_scrap fossil_skull wolf_tooth world_map'),
    (3, 'BOT-01 SEM-12 HOJ-01 GEM-09 GEM-12 AMB-12 MET-06 MIN-09 CON-07'),
    (3, 'COR-01 ALG-01 NUM-01 FIL-01 MED-01 MAP-09 HUE-12 ARQ-01 MAR-12'),
)

if len(sys.argv) != 4:
    sys.exit(__doc__)

for filename, (columns, names) in zip(sys.argv[1:], SHEETS):
    sheet = Image.open(filename).convert('RGBA')
    # Las divisiones manuales siguen los espacios transparentes de cada plancha piloto.
    if sheet.size == (1448, 1086):
        rows = (0, 362, 724, 1086)
        bounds_by_row = ((0,362,724,1050,1448), (0,420,724,1050,1448), (0,370,750,1030,1448))
    elif sheet.size == (1263, 1246):
        rows = (0, 414, 813, 1246)
        bounds_by_row = ((0,425,845,1263),) * 3
    else:
        rows = tuple(row * sheet.height // 3 for row in range(4))
        bounds_by_row = (tuple(column * sheet.width // columns for column in range(columns + 1)),) * 3
    for index, name in enumerate(names.split()):
        row, column = divmod(index, columns)
        edges = bounds_by_row[row]
        art = sheet.crop((edges[column], rows[row], edges[column + 1], rows[row + 1]))
        alpha = art.getchannel('A')
        bounds = alpha.point(lambda value: 255 if value >= 18 else 0).getbbox()
        if not bounds:
            raise ValueError(f'Celda vacía: {name}')
        art = art.crop(bounds)
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
                canvas.save(folder / f'{variant}-{size}.webp', quality=quality, method=6)
