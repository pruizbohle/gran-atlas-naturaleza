"""Auditoría reproducible de los sprites y propuestas editoriales de OBJ-11."""
from collections import Counter
from hashlib import sha256
from math import ceil
from pathlib import Path
from textwrap import wrap
import csv
import json

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
DOCS = Path(__file__).parent
WWW = ROOT / 'www'
OBJECTS = WWW / 'objetos-cientificos'
manifest = json.loads((OBJECTS/'manifiesto.js').read_text().split(' = ', 1)[1].strip().removesuffix(';'))
rows = manifest['rows']
archive = manifest['archivedRows']
by_id = {row['id']: row for row in [*rows, *archive]}
subjects = [row for row in rows if row['artState'] == 'Candidato']
main = [row for row in subjects if row['type'] in ('Objeto productivo','Coleccionable propuesto','Pieza del Museo')]
assert len(main) == 385 and len(subjects) == 418 and len(archive) == 25
assert len(by_id) == 486

similarity_rules = {
    'Monedas': ('NUM-', 'ancient_coin'),
    'Cráneos y dientes fósiles': ('fossil_skull', 'fossil_tooth','carnivore_skull','herbivore_skull','wolf_tooth','FOS-05','FOS-12'),
    'Mapas y pergaminos': ('MAP-','world_map','map_fragment','parchment_scrap','south_america_map','polar_map'),
    'Medallas y collares': ('MED-','museum_medallion','shell_necklace','amber_charm','medallon_viajero'),
    'Geodas y calcitas': ('MIN-02','GEM-07','ROC-13','MARV-06','MARV-07','MARV-10'),
    'Resinas y ámbar': ('AMB-','fossil_amber','amber_charm','museum_medallion'),
    'Meteoritos': ('MET-',),
    'Huevos': ('HUE-',),
    'Conchas y nácar': ('CON-','oceanian_nacre','MARV-08','shell_necklace'),
    'Fibras, plumas y telarañas': ('heron_feather','owl_feather','mat-pluma-tropical','FOS-11','ARQ-08','ARQ-10'),
    'Instrumentos científicos': ('INS-','brass_compass','field_telescope','binoculars','sounding_kit','oceanic_quadrant','polished_lens'),
}
similarities = [
    {'name':name,'ids':[r['id'] for r in main if any(r['id'] == token or token.endswith('-') and r['id'].startswith(token) for token in tokens)]}
    for name,tokens in similarity_rules.items()
]
manual = {
    'HUE-04':('Requiere homologación','Cáscara clara cercana a HUE-05 y HUE-08. Revisar perfiles a 24 px.'),
    'HUE-05':('Requiere ajuste menor','Revisar diferenciación por anchura y tono respecto de HUE-04.'),
    'HUE-08':('Requiere ajuste menor','El óvalo claro pierde información tonal a escala pequeña.'),
    'HUE-09':('Pendiente de cotejo científico','El comparador usa una longitud familiar orientativa. Falta medida para el picoespada.'),
    'HUE-11':('Requiere ajuste menor','Conservar el extremo piriforme y reforzar el contraste a 24 px.'),
    'HUE-12':('Pendiente de cotejo científico','Conservar el huevo, con el registro europeo posterior indicado en ficha.'),
    'ARQ-07':('Requiere ajuste menor','Los tallos finos se confunden al reducir. Conservar el perfil de la avenida.'),
    'ARQ-10':('Requiere homologación','Se reforzó el contraste de inventario a 64 y 128 px. La trama sigue simplificada al reducir.'),
    'ARQ-12':('Requiere ajuste menor','Las galerías interiores se leen mejor desde 64 px.'),
    'MARV-06':('Requiere homologación','Cavidad de cuarzo clara y silueta próxima a otras geodas.'),
    'MARV-07':('Requiere homologación','Diferenciar de MIN-02 y preservar el trazo duplicado a 64 px.'),
    'MARV-10':('Requiere ajuste menor','La silueta de catedral y el violeta separan la pieza. Revisar el interior a 24 px.'),
    'MARV-12':('Requiere ajuste menor','Las ramificaciones finas pierden contraste en fondo claro.'),
    'MIN-02':('Requiere homologación','Comparar geometría y refracción con MARV-07.'),
    'FOS-05':('Requiere homologación','Comparar la corona ancha y la raíz con dientes funcionales.'),
    'FOS-09':('Pendiente de cotejo científico','Cotejar las huellas de Cal Orck’o y su disposición en la superficie.'),
    'FOS-10':('Pendiente de cotejo científico','La atribución de gastrólito exige contexto estratigráfico.'),
    'FOS-11':('Pendiente de cotejo científico','Confirmar el perfil de la pluma de Solnhofen. La descripción posterior queda documentada.'),
    'FOS-12':('Pendiente de cotejo científico','Confirmar esmalte, sección y taxón del diente.'),
    'fossil_tooth':('Requiere homologación','Separar silueta y textura de dientes coleccionables FOS-05 y FOS-12.'),
    'INS-06':('Pendiente de cotejo científico','Cotejar material e impermeabilidad de la cubierta.'),
    'INS-09':('Pendiente de cotejo científico','Cotejar cámara y placa con tecnología daguerreana anterior a 1842.'),
    'INS-11':('Pendiente de cotejo científico','Cotejar montura y óptica con un microscopio de campo fechado.'),
    'field_telescope':('Requiere homologación','Comparar con INS-08 y separar ambos por montura, estuche o perfil.'),
    'INS-08':('Requiere homologación','Silueta de tubo cercana al catalejo funcional.'),
    'INS-02':('Requiere homologación','Conservar la caja como rasgo que distingue la brújula coleccionable.'),
    'MAP-06':('Requiere rediseño','Identificar primero un itinerario histórico concreto para dibujar una carta reconocible.'),
    'MAP-07':('Requiere rediseño','El trazo litoral requiere fuente fechada y orientación antes de redibujar.'),
    'MAP-12':('Pendiente de cotejo científico','Separar observaciones de campaña del atlas publicado en 1844.'),
    'ARM-10':('Pendiente de cotejo científico','Tipología zulú documentada. El patrón de piel y el ejemplar exacto siguen pendientes.'),
    'ARM-12':('Pendiente de cotejo científico','Cotejar perfil de la clava con el inventario y contexto ceremonial.'),
    'MED-13':('Pendiente de cotejo científico','Orden creada en 1832. Verificar el modelo civil de primera época.'),
    'MET-14':('Requiere homologación','Comparar costra y área de fractura con L’Aigle, ambos L6.'),
    'MET-15':('Requiere homologación','Separar el perfil oscuro de otras condritas con fuente museística.'),
    'MET-16':('Requiere ajuste menor','Cotejar corte y superficie con el fragmento de Weston.'),
    'MET-20':('Requiere homologación','Comparar matriz basáltica clara con condritas de aspecto similar.'),
    'parchment_scrap':('Requiere ajuste menor','Acentuar borde irregular para diferenciarlo de cartas y fragmentos de mapa.'),
}
entries = {}
for row in main:
    id = row['id']
    status, note = ('Sin problemas detectados','En la plancha de conjunto se distingue el material y la silueta a 64 px.')
    if row['stage'] == 'OBJ-11':
        status, note = ('Pendiente de aprobación del usuario','Candidata de gabinete basada en la referencia de la ficha. Revisar textura, pátina y silueta.')
    if id.startswith('MAP-'):
        status, note = ('Pendiente de cotejo científico','Cotejar orientación, formato, técnica y perfil con el ejemplar de la ficha antes de corregir.')
    elif id.startswith(('BOT-','HOJ-','SEM-','CIV-','MAS-')):
        status, note = ('Pendiente de cotejo científico','La forma general se lee en plancha. Confirmar estructuras diagnósticas con la referencia.')
    elif id.startswith('AMB-'):
        status, note = ('Requiere homologación','Comparar tono, inclusión, borde y transparencia con otras resinas sobre fondos claro y oscuro.')
    status,note = manual.get(id,(status,note))
    entries[id] = {'status':status,'note':note}
    if id in ('ARQ-10','ARM-02','ARM-11'):
        entries[id]['previous'] = {size:{'src':f'objetos-cientificos/revisiones/{id}/inventario-{size}.webp',
            'bytes':(OBJECTS/f'revisiones/{id}/inventario-{size}.webp').stat().st_size} for size in (64,128)}

profiles = [
    {'name':'Completo','description':'Conserva alternativa clásica e inventario en todas las escalas.',
     'assets':[(variant,size) for variant in ('clasica','inventario') for size in (64,128,256,512)]},
    {'name':'Equilibrado','description':'Conserva inventario en casilla y clásica para ficha o ampliación.',
     'assets':[('inventario',64),('inventario',128),('clasica',256),('clasica',512)]},
    {'name':'Ligero','description':'Una versión para casilla y una para ficha. Las ampliaciones grandes interpolan.',
     'assets':[('inventario',64),('clasica',256)]},
]
asset_paths = set()
profiles_count = Counter()
hashes = {}
for row in [*subjects,*archive]:
    for variant,files in row['sprites'].items():
        for size,asset in files.items():
            size = int(size)
            file = WWW / asset['src']
            content = file.read_bytes()
            assert asset['bytes'] == len(content), file
            asset_paths.add(file)
            with Image.open(file) as image:
                assert image.mode == 'RGBA' and image.format == 'WEBP' and image.size == (size,size), file
                alpha = image.getchannel('A')
                assert alpha.getextrema()[0] == 0 and alpha.getextrema()[1] >= 246, file
                x,y,right,bottom = alpha.getbbox()
                assert min(x,y,size-right,size-bottom) >= size*.035, file
                assert .77 <= max(right-x,bottom-y)/size <= .92, file
            key = (variant,size,sha256(content).digest())
            if key in hashes and row in subjects:
                profiles_count['duplicated'] += 1
            hashes[key] = row['id']
assert asset_paths == set((OBJECTS/'arte').glob('*/*.webp'))
for profile in profiles:
    assets = [row['sprites'][variant][str(size)] for row in subjects for variant,size in profile['assets']]
    profile['files'] = len(assets)
    profile['bytes'] = sum(asset['bytes'] for asset in assets)
    profile['rgba'] = len(subjects) * sum(size*size*4 for _,size in profile['assets'])
    print(profile['name'],profile['files'], profile['bytes'],profile['rgba'])
print('Duplicados exactos activos a variante y tamaño iguales',profiles_count['duplicated'])
(OBJECTS/'auditoria.js').write_text('globalThis.AtlasAuditoriaObjetos = '+json.dumps(
    {'entries':entries,'similarities':similarities,'profiles':profiles},ensure_ascii=False,indent=2)+';\n')

def table(name, header, lines):
    with (DOCS/name).open('w') as file:
        writer = csv.writer(file,delimiter='\t',lineterminator='\n')
        writer.writerow(header)
        writer.writerows(lines)

table('auditoria-artistica-obj-11.tsv',['ID','Pieza','Tipo','Familia','Gabinete','Revisión preliminar','Observación','Aprobación'],
      ([r[key] or '—' for key in ('id','name','type','family','cabinet')]+[entries[r['id']]['status'],entries[r['id']]['note'],'Pendiente'] for r in main))

routes = {
    'Botánica':('Exploración terrestre','Investigación','Bitácora botánica y registro de hábitat'),
    'Geología':('Expediciones','Investigación','Ficha geológica, zona accesible y muestra autorizada'),
    'Oceanografía':('Exploración costera','Expediciones','Registro marítimo, costa accesible y documentación'),
    'Historia':('Investigación','Intercambios museísticos','Ficha de procedencia y reproducción autorizada'),
    'Historia natural y exploración':('Investigación','Exploración terrestre','Ficha de campo o modelo científico'),
    'Numismática':('Comercio','Intercambios museísticos','Registro de emisión y procedencia autorizada'),
    'Armería histórica':('Intercambios museísticos','Investigación','Reproducción inerte o registro con procedencia'),
    'Cartografía antigua':('Investigación','Misiones','Documento de archivo, zona de referencia e itinerario identificado'),
    'Fósiles menores':('Excavaciones','Investigación','Permiso de registro o réplica con ficha de yacimiento'),
    'Instrumentos de exploración':('Comercio','Intercambios museísticos','Catálogo de instrumentos o facsímil documentado'),
    'Arquitecturas animales':('Observaciones de fauna','Exploración terrestre','Observación a distancia o modelo de estructura'),
    'Huevos de aves':('Observaciones de fauna','Intercambios museísticos','Lámina, modelo o ejemplar conservado de referencia'),
    'Secretos de Atlántida':('Misiones','Investigación','Línea narrativa de ficción explícita'),
}
progression = ['Primeras semanas','Semanas 3–6','Meses 2–3','Meses 3–5']
rarities = ['Común','Poco común','Raro','Muy raro']

def acquisition(row):
    primary,secondary,requires = routes.get(row['collection'],routes[row['cabinet']])
    species = row.get('natural',{}).get('species')
    if primary == 'Observaciones de fauna' and not species:
        primary,secondary = ('Exploración terrestre' if row['id'].startswith('ARQ-') else 'Investigación', 'Intercambios museísticos')
    if species:
        requires += ' · ' + species['name']
    return [row[key] for key in ('id','name','cabinet','collection')] + [primary,secondary,row['continent'],row['provenance'],row['rarity'],
        progression[rarities.index(row['rarity'])],requires]

table('matriz-obtencion-obj-11.tsv',['ID','Pieza','Gabinete','Colección','Fuente principal','Fuente secundaria','Continente','Zona potencial','Rareza','Etapa sugerida','Requisitos propuestos'],
      (acquisition(r) for r in main if r['type'] == 'Coleccionable propuesto'))

paper, ink, line = '#eee4ca','#28372e','#b6a17c'
font = '/usr/share/fonts/truetype/dejavu/'
title = ImageFont.truetype(font+'DejaVuSerif.ttf',24)
text = ImageFont.truetype(font+'DejaVuSans.ttf',12)
bold = ImageFont.truetype(font+'DejaVuSans-Bold.ttf',11)
plates = DOCS/'planchas-obj-11'
plates.mkdir(exist_ok=True)

def paste(canvas,row,xy,size=64,variant='inventario'):
    src = row['sprites'][variant][str(max(64,size))]['src']
    with Image.open(WWW/src) as image:
        image = image.resize((size,size),Image.Resampling.LANCZOS)
        canvas.paste(image,xy,image)

def plate(label, fname, specimens):
    cols, width = 8, 112
    canvas = Image.new('RGB',(cols*width+20,65+ceil(len(specimens)/cols)*112),paper)
    draw = ImageDraw.Draw(canvas)
    draw.text((12,10),label,fill=ink,font=title)
    draw.text((12,41),'Inventario 64 px y 24 px · revisión preliminar',fill=ink,font=text)
    for i,row in enumerate(specimens):
        x,y = 10+i%cols*width,62+i//cols*112
        draw.line((x+3,y,x+width-3,y),fill=line)
        paste(canvas,row,(x+13,y+2))
        paste(canvas,row,(x+79,y+35),24)
        label = row['id']
        id_font = bold
        for pixels in range(10,5,-1):
            if draw.textlength(label,font=id_font) <= width-4:
                break
            id_font = ImageFont.truetype(font+'DejaVuSans-Bold.ttf',pixels)
        draw.text((x+width/2,y+67),label,fill=ink,font=id_font,anchor='mt')
        for j,label in enumerate(wrap(row['name'],16)[:3]):
            draw.text((x+width/2,y+80+11*j),label,fill=ink,font=text,anchor='mt')
    canvas.save(plates/(fname+'.webp'),quality=87)

for cabinet,filename in [('Botánica','botanica'),('Geología','geologia'),('Oceanografía','oceanografia'),('Historia','historia'),
                         ('Historia natural y exploración','historia-natural')]:
    plate(cabinet,filename,[r for r in main if r['cabinet'] == cabinet])
plate('Objetos funcionales','funcionales',[r for r in main if r['type'] == 'Objeto productivo'])
plate('Museo · ilustraciones propias','museo',[r for r in main if r['type'] == 'Pieza del Museo'])
plate('Armería histórica','armeria',[r for r in main if r['collection'] == 'Armería histórica'])

substitutions = manifest['substitutions']
canvas = Image.new('RGB',(952,65+ceil(len(substitutions)/4)*134),paper)
draw = ImageDraw.Draw(canvas)
draw.text((12,10),'Archivo histórico y catálogo vigente',fill=ink,font=title)
draw.text((12,41),'Archivado a la izquierda · candidato vigente a la derecha',fill=ink,font=text)
for i,entry in enumerate(substitutions):
    x,y=8+i%4*236,64+i//4*134
    draw.line((x,y,x+222,y),fill=line)
    for j,id in enumerate((entry['old'],entry['id'])):
        row=by_id[id]
        at=x+j*115
        paste(canvas,row,(at+24,y+2))
        draw.text((at+54,y+65),id,fill=ink,font=bold,anchor='mt')
        for k,label in enumerate(wrap(row['name'],16)[:3]):
            draw.text((at+54,y+83+12*k),label,fill=ink,font=text,anchor='mt')
canvas.save(plates/'antes-despues.webp',quality=88)

for id,label in [('ARQ-10','Contraste de inventario'),('ARM-02','Calota sin penacho añadido'),('ARM-11','Cuatro medias lunas')]:
    revision = by_id[id]
    before_assets = entries[id]['previous']
    before_row = {**revision,'sprites':{'inventario':{str(k):v for k,v in before_assets.items()}}}
    compare = Image.new('RGB',(655,220),paper)
    draw = ImageDraw.Draw(compare)
    draw.text((12,10),id+' · '+label,fill=ink,font=title)
    for x,name,row in [(6,'Anterior',before_row),(330,'Corregida',revision)]:
        draw.text((x+9,47),name,fill=ink,font=text)
        for center,size in zip((30,76,134,240),(24,32,64,128)):
            paste(compare,row,(x+center-size//2,70),size)
            draw.text((x+center,202),str(size)+' px',fill=ink,font=text,anchor='mt')
    compare.save(plates/('revision-'+id.lower()+'.webp'),quality=88)
