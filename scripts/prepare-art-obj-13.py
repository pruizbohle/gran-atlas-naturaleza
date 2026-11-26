"""Exporta las celdas revisadas de un lote con el perfil equilibrado de OBJ-11."""

import argparse
import importlib.util
import json
from pathlib import Path
import sys

from PIL import ImageOps


ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs/art-obj-13'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('reference', type=Path)
    parser.add_argument('lot')
    args = parser.parse_args()
    reference_script = args.reference / 'docs/objetos-cientificos/preparar-arte.py'
    spec = importlib.util.spec_from_file_location('atlas_sprite_export', reference_script)
    pipeline = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(pipeline)
    pipeline.ROOT = ROOT / 'www/objetos-cientificos/arte'
    plans = json.loads((DOCS / 'planchas.json').read_text(encoding='utf-8'))
    registered = [id for lot in plans.values() for sheet in lot for id in sheet['ids'] if id]
    if len(registered) != len(set(registered)):
        sys.exit('Un ID figura en más de una celda del plan.')
    plan = plans[args.lot]
    scales = {}
    for sheet in plan:
        for name, factor in sheet.get('scale', {}).items():
            if name not in sheet['ids'] or not 0 < factor <= 1:
                sys.exit(f'Escala de presentación inválida: {name}')
            scales[name] = factor
    if scales:
        original_export = pipeline.export_sprite

        def export_scaled(name, art, method):
            padding = round(max(art.size) * (1 / scales.get(name, 1) - 1) / 2)
            original_export(name, ImageOps.expand(art, border=padding, fill=(0, 0, 0, 0)), method)

        pipeline.export_sprite = export_scaled

    original = json.loads((args.reference / 'docs/objetos-cientificos/catalogo-300.json').read_text(encoding='utf-8'))
    protected = {row['ID'] for row in original['pieces']} | {'BOT-14','RAR-07'}
    for sheet in plan:
        ids = sheet['ids']
        if set(ids) & protected:
            sys.exit('La plancha incluye una ilustración ya aprobada.')
        pipeline.prepare(DOCS / 'maestras' / sheet['file'],sheet['columns'],ids,4,sheet.get('crop'))
        for name in filter(None, ids):
            for variant, sizes in [('clasica',(64,128)),('inventario',(256,512))]:
                for size in sizes:
                    (pipeline.ROOT / name / f'{variant}-{size}.webp').unlink()


if __name__ == '__main__':
    main()
