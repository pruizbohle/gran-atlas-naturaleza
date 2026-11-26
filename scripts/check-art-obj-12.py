"""Comprueba los WebP de la biblioteca y, opcionalmente, compone una plancha."""
import argparse
from hashlib import sha256
import json
from pathlib import Path
import textwrap

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
WWW = ROOT / 'www'


def check(records, integrity, reference):
    checked = {}
    for row in records:
        for size, relative in (row['paths'] or {}).items():
            path = WWW / relative
            size = int(size)
            data = path.read_bytes()
            with Image.open(path) as image:
                assert image.format == 'WEBP' and image.size == (size, size), relative
                alpha = image.getchannel('A')
                low, high = alpha.getextrema()
                box = alpha.point(lambda value: 255 if value >= 18 else 0).getbbox()
                assert (low == 0 and high >= 170 and box and
                        min(box[0], box[1], size-box[2], size-box[3]) >= max(2,size // 40)), relative
            digest = sha256(data).hexdigest()
            assert integrity[relative] == [len(data), digest], relative
            art_id = row['reference'] or row['id']
            assert digest not in checked or checked[digest][0] == art_id, relative
            checked[digest] = (art_id, len(data))
            if row['origin'] == 'OBJ-11' and reference:
                variant = 'inventario' if size <= 128 else 'clasica'
                original = (reference / 'www/objetos-cientificos/arte' / art_id /
                            f'{variant}-{size}.webp')
                assert data == original.read_bytes(), relative
    return len(checked), sum(size for _,size in checked.values())


def sheet(records, path, size):
    cols = 5 if size == 128 else 9
    width, height = (190, 176) if size == 128 else (112, 86)
    rows = (len(records) + cols - 1) // cols
    board = Image.new('RGB', (cols*width, 2*rows*height))
    draw = ImageDraw.Draw(board)
    font = ImageFont.truetype('DejaVuSans.ttf', 13 if size == 128 else 11)
    for mode, (paper, ink) in enumerate((('#eee5d4','#302c23'),('#292c27','#eee5d4'))):
        draw.rectangle((0,mode*rows*height,board.width,(mode+1)*rows*height-1), fill=paper)
        for i, row in enumerate(records):
            x, y = (i%cols)*width, (i//cols+mode*rows)*height
            relative = (row['paths'] or {}).get(str(size))
            if relative:
                with Image.open(WWW / relative) as sprite:
                    board.paste(sprite, (x+(width-size)//2,y+3), sprite)
            label = row['name'] if size == 128 else row['id']
            for n, line in enumerate(textwrap.wrap(label, width=26)):
                draw.text((x+width//2,y+size+9+14*n),line,fill=ink,font=font,anchor='mt')
    board.save(path, quality=91)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('lot', choices=['A','B','C','D','coleccionables','todos'])
    parser.add_argument('--reference', type=Path)
    parser.add_argument('--sheet', type=Path)
    parser.add_argument('--family')
    parser.add_argument('--size', type=int, choices=[64,128], default=128)
    args = parser.parse_args()
    declaration = (WWW / 'art-obj-12/data.js').read_text(encoding='utf-8')
    records = json.loads(declaration.split(' = ',1)[1].strip().removesuffix(';'))
    records = [row for row in records if args.lot in ('todos',row['lot'])]
    if args.family:
        records = [row for row in records if row.get('family') == args.family]
        assert records, args.family
    manifest = json.loads((WWW / 'atlas-integrity.json').read_text(encoding='utf-8'))
    integrity = manifest['files'] | manifest.get('onDemand', {})
    sprites, size = check(records, integrity, args.reference)
    if args.sheet:
        sheet(records,args.sheet,args.size)
    print(json.dumps({'lote':args.lot,'fichas':len(records),'integradas':sum(bool(row['paths']) for row in records),
                      'variantes':sprites,'bytes':size},ensure_ascii=False))


if __name__ == '__main__':
    main()
