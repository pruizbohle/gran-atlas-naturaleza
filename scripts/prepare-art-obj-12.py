"""Exporta los tamaños de ART-OBJ-12 con el flujo de recorte de OBJ-11."""
import importlib.util
import json
from pathlib import Path
import sys

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs/art-obj-12'
PROFILE = [('clasica', (64, 128)), ('inventario', (256, 512))]


def trim(image):
    alpha = image.getchannel('A')
    bounds = alpha.point(lambda value: 255 if value >= 18 else 0).getbbox()
    if not bounds:
        raise ValueError('La ilustración no contiene píxeles visibles')
    return image.crop(bounds)


def assemble(layers, folders):
    # Las capas usan láminas ya revisadas. El recorte conserva su alfa.
    canvas = Image.new('RGBA', (680, 520))
    for name, x, y, width, height in layers:
        relative = Path(name) / 'clasica-512.webp'
        file = next((folder / relative for folder in folders if (folder / relative).is_file()), None)
        if not file:
            raise FileNotFoundError(relative)
        with Image.open(file) as source:
            layer = trim(source.convert('RGBA'))
        layer.thumbnail((width,height),Image.Resampling.LANCZOS)
        canvas.alpha_composite(layer, (x+(width-layer.width)//2,y+height-layer.height))
    return trim(canvas)


def main():
    if len(sys.argv) != 3:
        sys.exit('Uso: python scripts/prepare-art-obj-12.py <OBJ-11 extraído> <lote>')
    reference = Path(sys.argv[1])
    lot = sys.argv[2]
    source = reference / 'docs/objetos-cientificos/preparar-arte.py'
    spec = importlib.util.spec_from_file_location('atlas_sprite_export', source)
    pipeline = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(pipeline)
    pipeline.ROOT = ROOT / 'www/objetos-cientificos/arte'

    plan = json.loads((DOCS / 'planchas.json').read_text())
    for sheet in plan[lot]:
        pipeline.prepare(DOCS / 'maestras' / sheet['file'], sheet['columns'],
                         sheet['ids'], 4, sheet.get('crop'))
    ids = [name for sheet in plan[lot] for name in sheet['ids'] if name]
    if lot == 'D':
        compositions = json.loads((DOCS / 'composiciones.json').read_text())
        folders = [pipeline.ROOT, reference / 'www/objetos-cientificos/arte']
        for name, layers in compositions.items():
            pipeline.export_sprite(name, assemble(layers, folders))
        ids.extend(compositions)
    for name in ids:
        # El perfil equilibrado usa los mismos archivos en juego y en el laboratorio.
        for variant, sizes in PROFILE:
            for size in sizes:
                (pipeline.ROOT / name / f'{variant}-{size}.webp').unlink()


if __name__ == '__main__':
    main()
