"""Exporta los tamaños de ART-OBJ-12 con el flujo de recorte de OBJ-11."""
import importlib.util
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs/art-obj-12'

if len(sys.argv) != 3:
    sys.exit('Uso: python scripts/prepare-art-obj-12.py <OBJ-11 extraído> <lote>')

source = Path(sys.argv[1]) / 'docs/objetos-cientificos/preparar-arte.py'
spec = importlib.util.spec_from_file_location('atlas_sprite_export', source)
pipeline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline)
pipeline.ROOT = ROOT / 'www/objetos-cientificos/arte'

plan = json.loads((DOCS / 'planchas.json').read_text())
for sheet in plan[sys.argv[2]]:
    pipeline.prepare(DOCS / 'maestras' / sheet['file'], sheet['columns'],
                     sheet['ids'], 4, sheet.get('crop'))
    # Usar el perfil equilibrado de OBJ-11 en juego y en el laboratorio.
    for name in filter(None, sheet['ids']):
        for variant, sizes in [('clasica', (64, 128)), ('inventario', (256, 512))]:
            for size in sizes:
                (pipeline.ROOT / name / f'{variant}-{size}.webp').unlink()
