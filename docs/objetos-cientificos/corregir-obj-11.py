"""Refuerza la lectura de ARQ-10 en papel a escalas pequeñas."""
from pathlib import Path
from PIL import Image, ImageEnhance

objects = Path(__file__).resolve().parents[2] / 'www/objetos-cientificos'
originals = objects / 'revisiones/ARQ-10'
for size in (64,128):
    name = f'inventario-{size}.webp'
    with Image.open(originals / name) as before:
        image = ImageEnhance.Brightness(before.convert('RGB')).enhance(.77)
        alpha = before.getchannel('A')
        image.putalpha(alpha.point(lambda value: min(255,round(value*1.28)) if value >= 18 else value))
        image.save(objects / 'arte/ARQ-10' / name,quality=87,method=4)
