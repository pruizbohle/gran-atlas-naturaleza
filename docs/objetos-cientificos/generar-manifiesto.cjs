const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '../..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(root, file), content);
const app = read('www/js/app.js');
const original = require('../../www/js/item-art-v3198.js');
const relicts = require('../../www/js/relict-art-v3199.js');
const base = JSON.parse(read('docs/gm06/coleccionables-referencia.json'));
const matrix = JSON.parse(read('docs/inv3400/inventory-matrix.json'));
const museum = vm.runInNewContext(
  app.slice(app.indexOf('const MUSEUM_COLLECTIONS='), app.indexOf('const MUSEUM_DIG_SITES=')) +
  '\n({collections:MUSEUM_COLLECTIONS, recipes:MUSEUM_FOSSIL_RECIPES, relicts:MUSEUM_RELICTS, art:' +
  app.slice(app.indexOf('function museumCardArt('), app.indexOf('\n}', app.indexOf('function museumCardArt(')) + 2) +
  '})', {ATLAS_RELICT_ART: relicts}
);
const {g: game} = require('../../tests/helpers/inv3400-game.cjs').make({headless:true});
const items = game.ITEMS;
assert.deepEqual(Object.keys(items).sort(), matrix.rows.map(row => row.id).sort());
assert.equal(matrix.rows.length, 68);
assert.equal(base.pieces.length, 240);
assert.equal(new Set(base.pieces.map(piece => piece.ID)).size, 240);

const rarity = ['Común', 'Poco común', 'Raro', 'Muy raro'];
const points = [1, 2, 4, 8];
const frame = 'objetos-cientificos';
const plateIds = [
  'binoculars','field_telescope','brass_compass','sturdy_pack','field_hat','museum_medallion',
  'pressed_flower','ancient_coin','parchment_scrap','fossil_skull','wolf_tooth','world_map',
  'BOT-01','SEM-12','HOJ-01','GEM-09','GEM-12','AMB-12','MET-06','MIN-09','CON-07',
  'COR-01','ALG-01','NUM-01','FIL-01','MED-01','MAP-09','HUE-12','ARQ-01','MAR-12'
];
const future = {
  'FIL-02':'Ceres francesa, 1849','FIL-03':'Emisión estadounidense, 1847',
  'FIL-04':'Sello canadiense, 1851','FIL-05':'Primera emisión chilena, 1853',
  'FIL-06':'Primera emisión japonesa, 1871','FIL-08':'Sydney Views, 1850',
  'FIL-10':'Emisión brasileña, 1843','FIL-11':'Emisión del Cabo, 1853',
  'FIL-12':'Mauritius Post Office, 1847','FOS-11':'Pluma de Archaeopteryx publicada en 1861',
  'HUE-12':'Huevos de Aepyornis documentados en Europa hacia 1850–1851',
  'NUM-09':'Birr de Menelik II, emisión de finales del siglo XIX'
};
const historic = {
  'MET-06':'Muestra presentada en Londres en 1838; hierro conocido por el pueblo nama',
  'FIL-01':'Primera emisión británica de 1841; ejemplar sin perforar',
  'FIL-07':'Emisión de 1852', 'FIL-09':'Emisión británica de 1840',
  'NUM-01':'Penique de cobre de Victoria, emisión de 1841',
  'MAP-09':'Referencia propuesta: levantamientos del Beagle anteriores a 1842',
  'GEM-12':'Procedencia y fecha de explotación comercial por verificar',
  'AMB-12':'Material natural; documentar la procedencia y el uso histórico'
};
const families = {
  BOT:['Botánica','tejido vegetal'], SEM:['Botánica','semilla'],
  GEM:['Minerales y piedras preciosas','mineral cristalino'], MIN:['Minerales y piedras preciosas','mineral o vidrio natural'],
  AMB:['Minerales y piedras preciosas','resina fósil'], MET:['Minerales y piedras preciosas','material meteórico'],
  FOS:['Fósiles','material mineralizado'], CON:['Objetos marítimos','concha calcárea'],
  COR:['Objetos marítimos','esqueleto calcáreo'], NUM:['Numismática','metal acuñado'],
  FIL:['Artefactos históricos','papel impreso'], MAP:['Cartografía','papel'],
  HUE:['Materiales animales','cáscara calcárea'], CIV:['Artefactos históricos','según pieza']
};
function productFamily(row) {
  const {id} = row;
  if (/map/.test(id)) return ['Cartografía','papel'];
  if (/binocular|compass|telescope|quadrant|sounding|polished_lens/.test(id)) return ['Instrumentos científicos',id === 'polished_lens' ? 'vidrio' : 'latón y vidrio'];
  if (/hat|cap$|hood|coat/.test(id)) return ['Sombreros y prendas','tejido'];
  if (/amulet|charm|necklace|medallion/.test(id)) return ['Collares, amuletos y medallones',/amber|medallion/.test(id) ? 'ámbar y metal' : 'material mixto'];
  if (/fossil|bone|_skull/.test(id)) return ['Fósiles','material mineralizado'];
  if (items[id]?.kind === 'animal' || /animal_trace|river_pearl/.test(id)) return ['Materiales animales',/feather/.test(id) ? 'queratina' : 'material animal'];
  if (/flower|spices|cacao/.test(id)) return ['Botánica','tejido vegetal'];
  if (/coin/.test(id)) return ['Numismática','metal acuñado'];
  if (/parchment|folio|document|record/.test(id)) return ['Artefactos históricos',/parchment/.test(id) ? 'pergamino' : 'papel'];
  const materials = {sturdy_pack:'lona y cuero',carved_wood:'madera',brass_shard:'latón',old_ink:'vidrio y tinta',river_pebble:'roca',oceanian_nacre:'nácar',african_textile_sample:'tejido'};
  return ['Materiales de expedición',materials[id] || 'material mixto'];
}
function collectible(piece) {
  const id = piece.ID;
  const [family,material] = families[id.split('-')[0]] || (
    /marineros|mares/i.test(piece.Colección) ? ['Objetos marítimos','material mixto'] :
    /Instrumentos/.test(piece.Colección) ? ['Instrumentos científicos','material mixto'] :
    /Máscaras|Atlántida/.test(piece.Colección) ? ['Artefactos históricos', id === 'MAR-12' ? 'oricalco ficticio' : 'material mixto'] :
    ['Otras piezas de colección','según pieza']
  );
  const context = piece.Colección === 'Secretos de Atlántida' ? 'Ficción explícita' :
    id === 'FIL-07' ? 'Futuro · ' + historic[id] :
    future[id] ? 'Futuro · ' + future[id] : historic[id] || 'Fecha del ejemplar por verificar';
  return {id, name:piece.Pieza, type:'Coleccionable propuesto', cabinet:piece.Gabinete,
    collection:piece.Colección, family, material, rarity:piece.Rareza, continent:piece.Continente,
    provenance:piece['Procedencia sugerida'], acquisition:piece['Obtención sugerida'],
    description:piece['Descripción breve'], context, points:piece['Puntos (idea)'],
    exhibit: /Patrim|Artefactos|Historia/.test(piece.Gabinete) || /HUE|COR|CON|SEM/.test(id) ?
      'Documentación, reproducción o ejemplar histórico conservado' : piece['Tipo de exhibición']};
}
const extra = [];
let header;
let ordinal;
for (const line of read('docs/objetos-cientificos/ampliacion.txt').trim().split('\n')) {
  const [name,continent,provenance,description,context] = line.split('|');
  if (/^[A-Z]{3}$/.test(name)) {
    header = {prefix:name, cabinet:continent, collection:provenance, family:description, material:context};
    ordinal = 0;
    continue;
  }
  const {prefix, ...fields} = header;
  const index = ordinal++;
  const rank = index < 5 ? 0 : index < 9 ? 1 : index < 11 ? 2 : 3;
  extra.push({...fields, id:prefix+'-'+String(ordinal).padStart(2,'0'), name, continent, provenance,
    description, context:context || 'Lámina o reproducción de referencia; datación documental pendiente',
    acquisition:'Documentación de gabinete', exhibit:'Lámina, reproducción o ejemplar histórico conservado',
    rarity:rarity[rank], points:points[rank], type:'Coleccionable propuesto'});
}
const products = matrix.rows.map(row => {
  const {id,name} = row;
  const [family,material] = productFamily(row);
  const slot = items[id]?.slot;
  const tier = /field_telescope|scholar_hat|museum_medallion|oceanic_quadrant|polar_coat|sounding_kit/.test(id) ? 'II' :
    slot || ['voyage','artifact_material'].includes(items[id].kind) ? 'I' : null;
  const regional = game.REGIONAL_BARTERS3400.find(entry => entry.id === id);
  const cartography = game.CARTOGRAPHY3400.find(entry => entry.map === id || entry.piece === id);
  return {id,name,family,material,tier,slot,continent:regional?.continent || cartography?.continent || null,type:'Objeto productivo',
    description:items[id]?.bonus || row.uses[0]?.name || 'Objeto funcional documentado en la matriz de inventario',
    acquisition:row.sources.join(' · '), context:'Referencia artística de 1842; modelo específico por verificar',
    recipe:game.RECIPES[id]?.requires, original:original.ids.includes(id) ? {renderer:'AtlasItemArt',bytes:Buffer.byteLength(original.renderItemArt(id))} : null};
});
const museumRecords = [...museum.collections,...museum.recipes.filter(row => row.unique),...museum.relicts].map(row => {
  const isRelict = Boolean(row.latin);
  const fossil = row.tab === 'fossils' || row.unique;
  const originalArt = museum.art(isRelict ? 'relict' : 'collection', row.id);
  const dates = {trex_mount:1905,triceratops_mount:1889,stegosaurus_mount:1877,spinosaurus_mount:1915,
    ankylosaurus_mount:1908,pachycephalosaurus_mount:1943,carnotaurus_mount:1985,coelacanth_indic:1938};
  return {id:row.id,name:row.name,type:'Pieza del Museo',
    collection:isRelict ? 'Expedientes de relictos' : row.unique ? 'Reconstrucciones fósiles' : row.tab === 'fossils' ? 'Archivo paleontológico' : 'Artefactos del Museo',
    family:fossil ? 'Fósiles' : 'Artefactos históricos',material:fossil ? 'réplica mineral' : 'soporte documental',
    description:row.description || row.desc || row.name, provenance:row.region || null,
    acquisition:isRelict ? 'Expediente documental' : 'Montaje museístico',
    context:dates[row.id] ? 'Futuro · referencia taxonómica de '+dates[row.id] :
      'Documentación o reproducción museística; datación por verificar',
    recipe:row.requires, original:originalArt ? {renderer:'Museo',svg:originalArt,bytes:Buffer.byteLength(originalArt)} : null,
    observations:isRelict ? 'Expediente documental. Reutilizar la ficha de especie existente.' : null,
    newArtwork:!isRelict};
});
const concepts = [
  {id:'idea-saccharimeter',name:'Sacarímetro óptico de gabinete',tier:'III',context:'Futuro · modelo Soleil de la década de 1840, fechar ejemplar',material:'latón y vidrio'},
  {id:'idea-achromatic-microscope',name:'Microscopio acromático de laboratorio',tier:'IV',context:'Referencia de la primera mitad del siglo XIX',material:'latón y vidrio'}
].map(row => ({...row,type:'Idea de equipamiento futuro',family:'Instrumentos científicos',description:'Referencia de construcción para una futura ampliación'}));
const stage02 = JSON.parse(read('docs/objetos-cientificos/obj-02.json'));
const stage02Ids = new Set(stage02.sheets.flatMap(sheet => sheet.ids));
concepts.push(...stage02.ideas.map(idea => ({
  ...idea, type:'Idea de equipamiento futuro', context:'Concepto artístico inspirado en la primera mitad del siglo XIX'
})));

const stage03 = JSON.parse(read('docs/objetos-cientificos/obj-03.json'));
const materialIds = [...stage03.expedition, ...stage03.animal];
const stage03Art = new Set(stage03.sheets.flatMap(sheet => sheet.ids));
const futureMaterials = read('docs/objetos-cientificos/materiales-futuros.tsv').trim().split('\n').slice(1).map(line => {
  const [id, name, family, species, continent, material, acquisition, uses, observations] = line.split('\t');
  assert.ok(observations && species.includes(';'), id);
  return {id, name, family, species:species.split('; '), continent, material, acquisition, uses,
    observations, type:'Idea de material animal', context:'Propuesta de gabinete para una ampliación futura'};
});
const stage03Ids = new Set([...stage03Art, ...futureMaterials.map(row => row.id)]);
assert.equal(materialIds.length, 18);
assert.equal(new Set(materialIds).size, 18);
assert.ok(materialIds.every(id => products.some(row => row.id === id)), 'Material ausente del inventario');
assert.equal(futureMaterials.length, 28);
assert.equal(futureMaterials.filter(row => stage03Art.has(row.id)).length, 8);
assert.equal(stage03Art.size, 22);
assert.ok(stage03.recipes.every(id => products.find(row => row.id === id)?.recipe), 'Ejemplo sin receta real');

const stage04 = JSON.parse(read('docs/objetos-cientificos/obj-04.json'));
const commercialIdeas = read('docs/objetos-cientificos/comercio-futuro.tsv').trim().split('\n').slice(1).map(line => {
  const [id, name, provenance, material, context, observations] = line.split('\t');
  assert.ok(observations, id);
  return {id, name, provenance, material, context, observations, family:'Mercancías regionales',
    type:'Idea de mercancía regional'};
});
const cartography = stage04.cartography.map(({id, name}) => ({id, piece:id + '_piece', name, parts:game.RECIPES[id].requires[id + '_piece']}));
const stage04Art = new Set([...stage04.sheets.flatMap(sheet => sheet.ids),
  ...cartography.flatMap(map => [map.id, map.piece])]);
const stage04Ids = new Set([...stage04Art, ...commercialIdeas.map(row => row.id)]);
assert.equal(stage04Art.size, 45);
assert.equal(commercialIdeas.length, 10);
assert.equal(commercialIdeas.filter(row => stage04Art.has(row.id)).length, 6);
assert.equal(cartography.length, 6);
assert.ok(cartography.every(map => products.find(row => row.id === map.id)?.recipe?.[map.piece] > 0));

const stage05 = JSON.parse(read('docs/objetos-cientificos/obj-05.json'));
const stage05Art = new Set(stage05.sheets.flatMap(sheet => sheet.ids).filter(Boolean));
const museumMounts = Object.entries(stage05.mounts).map(([id, [name, anatomy]]) => ({
  id, name, anatomy, living:'vida-' + id
}));
const livingMounts = museumMounts.map(({id, name, anatomy, living}) => ({
  id:living, name:name + ' en vida', type:'Reconstrucción complementaria', family:'Paleontología',
  description:anatomy, context:museumRecords.find(row => row.id === id).context,
  observations:'Interpretación naturalista hipotética. Color, tejidos y postura requieren revisión.'
}));
const futureMounts = read('docs/objetos-cientificos/montajes-futuros.tsv').trim().split('\n').slice(1).map(line => {
  const [id, name, family, context, observations] = line.split('\t');
  return {id, name, family, context, observations, type:'Idea de montaje paleontológico'};
});
const stage05Ids = new Set([...stage05Art, ...futureMounts.map(row => row.id)]);
assert.equal(stage05Art.size, 50);
assert.equal(museumMounts.length, 8);
assert.equal(futureMounts.length, 12);
assert.equal(futureMounts.filter(row => stage05Art.has(row.id)).length, 4);

assert.equal(extra.length, 60);
const newCollections = new Set(extra.map(row => row.collection));
assert.equal(newCollections.size, 5);
for (const collection of newCollections) {
  assert.deepEqual(rarity.map(rank => extra.filter(row => row.collection === collection && row.rarity === rank).length), [5,4,2,1]);
}
const normalizedName = name => name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const knownNames = new Set([...products.map(row => row.name), ...base.pieces.map(piece => piece.Pieza)].map(normalizedName));
for (const addition of extra) {
  const name = normalizedName(addition.name);
  assert.ok(!knownNames.has(name), `Nombre de pieza repetido: ${addition.name}`);
  knownNames.add(name);
}

const catalog = base.pieces.map(collectible).concat(extra);
assert.equal(catalog.length, 300);
assert.equal(new Set(catalog.map(row => row.collection)).size, 26);
assert.deepEqual(rarity.map(rank => catalog.filter(row => row.rarity === rank).length), [125,100,50,25]);
assert.equal(catalog.reduce((sum,row) => sum+row.points,0), 725);
assert.deepEqual(Object.keys({Botánica:1,Geología:1,Oceanografía:1,Historia:1,'Historia natural y exploración':1})
  .map(cabinet => catalog.filter(row => row.cabinet === cabinet).length), [48,60,60,72,60]);

const pilotNotes = {
  ...stage05.minorNotes,
  ...Object.fromEntries(museumMounts.map(({id, anatomy}) => [id, anatomy])),
  'MAP-01':'Carta interpretativa del Mediterráneo. Cotejar Gibraltar, Sicilia y Levante con un portulano del siglo XVI.',
  'MAP-02':'Tira de itinerarios inspirada en la copia medieval de una cartografía vial romana; no usa escala geográfica moderna.',
  'MAP-03':'Interpretación de la carta de Juan de la Cosa de 1500, con el oeste arriba y América en verde.',
  'MAP-04':'Folio de gabinete inspirado en el Atlas de Mercator de 1595 y su tradición editorial; la apertura es interpretativa.',
  'MAP-05':'Fragmento de pergamino inspirado en el mapa atlántico de Piri Reis de 1513; cotejar sus costas y orientación.',
  'MAP-06':'Reconstrucción temática de corredores de Asia central, sin atribución a un original específico.',
  'MAP-07':'Reconstrucción temática de la costa oriental africana; cotejar la ubicación de islas y puertos.',
  'MAP-08':'Vista interpretativa de Tenochtitlán y Texcoco inspirada en planos coloniales; cotejar orientación y calzadas.',
  'MAP-10':'Carta interpretativa de arrecifes frente a la costa nororiental australiana; cotejar con los levantamientos de 1770.',
  'MAP-11':'Interpretación de un derrotero del Endeavour de 1769–1770; cotejar las escalas y el perfil de Nueva Zelanda.',
  'MAP-12':'Carta incompleta inspirada en observaciones australes de 1838–1842. El atlas publicado de Wilkes es de 1844.',

  'animal_trace':'Vaciado claro de yeso de campo, con una pisada reciente marcada. La huella fósil queda como referencia para OBJ-05.',
  'fossil_fragment':'Fragmento de matriz estratificada con una impronta parcial; referencia para OBJ-05.',
  'polished_lens':'Vidrio claro de borde biselado y perfil regular, frente a la fractura y opacidad de las piezas minerales.',
  'otter_whisker':'Muestra seca individual sobre dos pestañas de conservación. Revisar el contraste del filamento a 24 px.',
  'map_fragment':'Fragmento recortado con una costa incompleta, frente a la extensión de una carta identificada.',

  'INS-02':'Caja de caoba inspirada en brújulas británicas de bolsillo de finales del siglo XVIII.',
  'INS-05':'Referencia de un aneroide Vidi posterior a 1842. Reservar para contenido futuro.',
  'INS-08':'Ejemplar de un solo tramo y cuerpo de madera. El catalejo de viaje usa tramos de latón visibles.',
  'INS-09':'Representación de una caja deslizante para placa daguerreotípica de época.',
  'oceanic_quadrant':'Cuadrante de madera y latón. Su armazón macizo lo distingue del sextante de retícula abierta.',
  'museum_medallion':'Medallón funcional de ámbar. La medalla de expedición del Museo se representa en metal y cinta.',

  'MAP-09':'Silueta cartográfica candidata; verificar el trazado del estrecho contra una carta fechada.',
  'NUM-01':'Relieve candidato; cotejar perfil y cantos con un penique fechado.',
  'FIL-01':'Esquema de un sello imperforado; pendiente cotejo del grabado.',
  'MED-01':'Inspirada en el reverso de Waterloo; cotejar el relieve frente al original.',
  'HUE-12':'Lámina de referencia posterior a 1842.',
  'ARQ-01':'Verificar la especie de tejedora a partir del patrón de entrada y la procedencia.',
  'field_hat':'Revisar la horma y la cinta frente a sombreros de viaje anteriores a 1842.',
  'binoculars':'Cotejar el puente y la distancia entre ópticas con un modelo galileano de viaje.',
  'ancient_coin':'Diferenciar la variante de inventario del penique victoriano por la pátina y el relieve.'
};
const rows = [...products,...catalog,...museumRecords,...concepts,...futureMaterials,...commercialIdeas,...livingMounts,...futureMounts].map(row => {
  const sprites = {};
  for (const variant of ['clasica','inventario']) {
    const files = {};
    for (const size of [64,128,256,512]) {
      const src = `${frame}/arte/${row.id}/${variant}-${size}.webp`;
      const absolute = path.join(root,'www',src);
      if (fs.existsSync(absolute)) files[size] = {src,bytes:fs.statSync(absolute).size};
    }
    sprites[variant] = Object.keys(files).length ? files : null;
  }
  return {cabinet:null,collection:null,rarity:null,tier:null,continent:null,provenance:null,
    acquisition:null,description:null,material:null,context:null,original:null,observations:null, ...row,
    pilot:plateIds.includes(row.id),
    stage:plateIds.includes(row.id) ? 'OBJ-01' : stage02Ids.has(row.id) ? 'OBJ-02' : stage03Ids.has(row.id) ? 'OBJ-03' : stage04Ids.has(row.id) ? 'OBJ-04' : stage05Ids.has(row.id) ? 'OBJ-05' : 'Futuras etapas',
    context:row.id === 'INS-05' ? 'Futuro · barómetro aneroide de Vidi, 1844' : row.context,
    observations:pilotNotes[row.id] || row.observations || null, sprites, approval:'Pendiente',
    artState:sprites.clasica && sprites.inventario ? 'Candidato' : row.newArtwork === false ? 'Reutilización documental' : 'Pendiente'};
});
assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
assert.equal(rows.filter(row => row.pilot).length, 30);
assert.equal(stage02Ids.size, 31);
assert.equal(rows.filter(row => row.stage === 'OBJ-02').length, stage02Ids.size);
const candidateIds = new Set([...plateIds, ...stage02Ids, ...stage03Art, ...stage04Art, ...stage05Art]);
const candidates = rows.filter(row => candidateIds.has(row.id));
assert.equal(candidates.length, 178);
assert.equal(rows.filter(row => row.artState === 'Candidato').length, candidates.length);
assert.ok(materialIds.every(id => candidateIds.has(id)), 'Material de OBJ-03 sin candidato');
assert.ok(candidates.every(row => Object.values(row.sprites).every(files => Object.values(files || {}).filter(file => file.bytes > 0).length === 4)));
const illustrated = new Map(candidates.map(row => [row.id, row]));
assert.deepEqual(rows.filter(row => row.collection === 'Instrumentos de exploración').map(row => row.id),
  stage02.groups.find(group => group.ids.length === 12).ids);
for (const group of stage02.groups) {
  assert.ok(group.ids.every(id => illustrated.has(id)), group.name);
  if (group.evolution) assert.deepEqual(group.ids.map(id => illustrated.get(id).tier), ['I','II','III','IV']);
}
assert.equal(rows.filter(row => row.type === 'Objeto productivo' && row.original).length, 68);
assert.ok(stage03.groups.flatMap(group => group.ids).every(id => rows.some(row => row.id === id)));
const chartIds = catalog.filter(row => row.collection === 'Cartografía antigua').map(row => row.id);
const seaIds = catalog.filter(row => row.collection === 'Los siete mares').map(row => row.id);
assert.equal(chartIds.length, 12);
assert.equal(seaIds.length, 7);
const archive = [
  {name:'Fragmentos y mapas', ids:[...cartography.flatMap(map => [map.piece, map.id]),'world_map','map_fragment']},
  {name:'Mapas funcionales y cartas históricas', ids:[...cartography.map(map => map.id),'world_map',...chartIds]},
  {name:'Cartografía antigua', ids:chartIds},
  {name:'Mercancías regionales', ids:stage04.trade},
  {name:'Los siete mares', ids:seaIds},
  {name:'Archivo histórico del Museo', ids:stage04.museum},
  {name:'Propuestas comerciales', ids:commercialIdeas.map(row => row.id)}
];
assert.equal(products.filter(row => illustrated.has(row.id)).length, 68);
assert.equal(museumRecords.filter(row => row.newArtwork && illustrated.has(row.id)).length, 17);
assert.equal(catalog.filter(row => row.id.startsWith('FOS-') && illustrated.has(row.id)).length, 12);
const paleontology = {
  materials:stage05.materials,
  minors:catalog.filter(row => row.id.startsWith('FOS-')).map(row => row.id),
  archive:museumRecords.filter(row => row.collection === 'Archivo paleontológico').map(row => row.id),
  mounts:museumMounts,
  future:futureMounts.map(row => row.id)
};
assert.ok(archive.slice(0, -1).flatMap(group => group.ids).every(id => illustrated.has(id)));
const manifest = {schema:1, year:1842, groups:[...stage02.groups, ...stage03.groups], archive, cartography, paleontology,
  tradeRoutes:game.TRADE_ROUTES.slice(0, 3).map(({name,rewards}) => ({name,rewards})),
  barter:game.REGIONAL_BARTERS3400.map(({id,continent,material,quantity}) => ({id,continent,material,quantity})),
  materialIds, animalMaterialIds:stage03.animal, recipeExamples:stage03.recipes, rows};
write('www/objetos-cientificos/manifiesto.js', 'globalThis.AtlasObjetosCientificos = '+JSON.stringify(manifest,null,2)+';\n');
write('docs/objetos-cientificos/catalogo-300.json', JSON.stringify({
  schema:1, source:'docs/gm06/coleccionables-referencia.json', pieces:[...base.pieces,...extra.map(row => ({
    ID:row.id, Gabinete:row.cabinet, 'Colección':row.collection, Pieza:row.name, Continente:row.continent,
    'Procedencia sugerida':row.provenance, Rareza:row.rarity, 'Obtención sugerida':row.acquisition,
    'Tipo de exhibición':row.exhibit, 'Puntos (idea)':row.points, 'Descripción breve':row.description, Estado:'Boceto'
  }))],
  chronology:Object.fromEntries(catalog.map(row => [row.id,row.context]))
},null,2)+'\n');
console.log(`${products.length} objetos, ${catalog.length} coleccionables, ${museumRecords.length} registros de Museo, ${concepts.length} ideas de equipo, ${futureMaterials.length} ideas de materiales, ${commercialIdeas.length} ideas comerciales`);
