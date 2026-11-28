"""Traslada las medidas y anclas auditadas al manifiesto del Campamento."""

import csv
import json
from pathlib import Path
import re

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs/art-camp-03'
MANIFEST = ROOT / 'www/art-camp-02/assets.js'

with (DOCS / 'medidas.csv').open(encoding='utf-8', newline='') as file:
    rows = list(csv.DictReader(file))

layout = json.loads((DOCS / 'anclas.json').read_text(encoding='utf-8'))
expected = {f'{sector}-{level}' for sector in layout['zones'] for level in range(1, 6)}
if len(rows) != len(expected) or {row['id'] for row in rows} != expected:
    raise ValueError('Se requiere una referencia por cada etapa del Campamento')

measures = {}
for row in rows:
    key = row['id']
    px, metres = float(row['px_384']), float(row['metros'])
    if px <= 0 or metres <= 0:
        raise ValueError(f'Medida no positiva: {key}')
    with Image.open(ROOT / 'www/art-camp-02/arte' / f'{key}-384.webp') as sprite:
        alpha = sprite.getchannel('A')
        box = alpha.point(lambda value: 255 if value >= 18 else 0).getbbox()
        bounds = [round(value / size, 5) for value, size in zip(box, sprite.size * 2)]
    measures[key] = {'label': row['referencia'], 'pixels': px, 'metres': metres, 'bounds': bounds}

layout['measures'] = measures
source = MANIFEST.read_text(encoding='utf-8')
generated = json.dumps(layout, ensure_ascii=False, indent=2).replace('\n', '\n  ')
new, count = re.subn(r'  // Inicio de medidas auditadas\.\n.*?  // Fin de medidas auditadas\.',
                     lambda match: f'  // Inicio de medidas auditadas.\n  const layout = {generated};\n  // Fin de medidas auditadas.',
                     source, flags=re.S)
if count != 1:
    raise ValueError('El manifiesto requiere un bloque de medidas')
MANIFEST.write_text(new, encoding='utf-8')
