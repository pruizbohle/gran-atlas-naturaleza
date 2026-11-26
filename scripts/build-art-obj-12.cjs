'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const docs = path.join(root, 'docs', 'art-obj-12');
const lab = path.join(www, 'art-obj-12');
const [source, ...options] = process.argv.slice(2);
if (!source) throw Error('Indica el directorio extraído de OBJ-11');
const draft = options.find(option => option.startsWith('--draft='))?.slice('--draft='.length);
const recover = new Set(options.filter(option => option.startsWith('--recover=')).map(option => option.split('=')[1]));
const sourceWeb = path.resolve(source, 'www');
require(path.join(sourceWeb, 'objetos-cientificos/manifiesto.js'));
require('../www/js/mec03-catalog.js');
require('../www/js/mec06-workshop.js');
const {rows, archivedRows} = globalThis.AtlasObjetosCientificos;
const reference = new Map(rows.map(row => [row.id, row]));
const archive = new Map(archivedRows.map(row => [row.id, row]));
const config = JSON.parse(fs.readFileSync(path.join(docs, 'recuperacion.json')));
const collection = JSON.parse(fs.readFileSync(path.resolve(source, 'docs/objetos-cientificos/catalogo-300.json'))).pieces;
const originals = new Map(collection.map(row => [row.ID, row]));
const art13 = path.join(root,'docs/art-obj-13');
const art13Sheets = JSON.parse(fs.readFileSync(path.join(art13,'planchas.json')));
const art13Lots = JSON.parse(fs.readFileSync(path.join(art13,'lotes.json')));
const newArt = new Set();
for (const [lot,sheets] of Object.entries(art13Sheets)) {
  const family = art13Lots[Number(lot)-1];
  if (!family) throw Error('Lote desconocido: ' + lot);
  for (const id of sheets.flatMap(sheet => sheet.ids.filter(Boolean))) {
    const piece = globalThis.AtlasMEC03Catalog.pieces[id];
    if (newArt.has(id) || originals.has(id) || config.collectibles[id]?.origin || !family.collections.includes(piece?.collection)) {
      throw Error('ID inválido o ya ilustrado en ART-OBJ-13: ' + id);
    }
    newArt.add(id);
  }
}

if (draft) {
  const prior = JSON.parse(fs.readFileSync(path.resolve(draft,'www/data/atlas_coleccionables_240_manifest_v2.json')));
  for (const {ID,Pieza} of prior.pieces) {
    if (globalThis.AtlasMEC03Catalog.pieces[ID]?.name !== Pieza) continue;
    const origin = path.resolve(draft,'www/assets/collectibles-draft',ID+'.svg');
    const rel = 'art-obj-12/anteriores/' + ID + '.svg';
    if (!fs.existsSync(origin)) throw Error('Falta boceto ART-COL-01: ' + ID);
    const destination = path.join(www,rel);
    fs.mkdirSync(path.dirname(destination),{recursive:true});
    fs.copyFileSync(origin,destination);
  }
}

const sizes = {64:'inventario',128:'inventario',256:'clasica',512:'clasica'};
const artDir = 'objetos-cientificos/arte';
const files = {};
const balance = globalThis.AtlasMEC06;

function spritePaths(id) {
  return Object.fromEntries(Object.entries(sizes).map(([size, variant]) => [size, artDir + '/' + id + '/' + variant + '-' + size + '.webp']));
}

function transfer(rel, target = rel) {
  const origin = path.join(sourceWeb, rel);
  const destination = path.join(www, target);
  if (!fs.existsSync(origin)) throw Error('Falta en OBJ-11: ' + rel);
  fs.mkdirSync(path.dirname(destination), {recursive:true});
  fs.copyFileSync(origin, destination);
}

function assets(id, edition, lot) {
  const sourceId = edition.source || id;
  if (edition.origin === 'OBJ-11') {
    const origin = reference.get(sourceId);
    if (!origin) throw Error('ID ausente en el manifiesto OBJ-11: ' + sourceId);
    for (const [size, variant] of Object.entries(sizes)) {
      const file = origin.sprites?.[variant]?.[size]?.src;
      if (!file || !fs.existsSync(path.join(sourceWeb, file))) throw Error('Falta variante de OBJ-11: ' + sourceId + ' ' + size);
      if (recover.has(lot)) transfer(file);
    }
  }
  const paths = spritePaths(sourceId);
  if (edition.icon) paths[128] = edition.icon;
  if (!Object.values(paths).every(file => fs.existsSync(path.join(www, file)))) return null;
  files[id] = paths;
  return paths;
}

function comparison(id, previous, lot) {
  if (!previous) return null;
  if (previous === 'marcador') return {kind:'marcador',label:'Marcador de la beta'};
  if (previous === 'revision') {
    const images = Object.fromEntries([64,128].map(size => [size, 'objetos-cientificos/revisiones/' + id + '/inventario-' + size + '.webp']));
    if (recover.has(lot)) for (const file of Object.values(images)) transfer(file);
    return {kind:'imagen',label:'Antes de la corrección de OBJ-11',paths:images,external:!Object.values(images).every(file => fs.existsSync(path.join(www,file)))};
  }
  if (previous === 'archivo') {
    const origin = archive.get(id).sprites.clasica[256].src;
    const file = 'art-obj-12/anteriores/' + id + '-obj11.webp';
    if (recover.has(lot)) transfer(origin,file);
    return {kind:'imagen',label:'OBJ-11 archivado: ' + archive.get(id).name,paths:{256:file},external:!fs.existsSync(path.join(www,file))};
  }
  return {kind:'imagen',label:'Iconografía de la beta',paths:{128:previous}};
}

const lotByType = {
  'material animal':'A', 'artefacto beta':'B', 'artefacto histórico':'B', componente:'C',
  'estudio científico':'D', 'demostración':'D', 'instrumento instalado':'D'
};
const groups = new Map(Object.values(balance.ANIMAL_GROUPS).flatMap(group => group.ids.map(id => [id, group.label])));
const document = fs.readFileSync(path.join(root, 'docs/mec06/arte.csv'), 'utf8').replace(/^\uFEFF/,'').trim().split(/\r?\n/).slice(1);
const workshop = document.map(line => {
  const [type, id, originalName, key] = line.split(';');
  const lot = lotByType[type];
  const entry = config.objects[id] || {};
  const definition = balance.ARTIFACTS[id] || balance.COMPONENTS[id] || balance.STUDIES[id] || balance.DEMOS[id];
  if (!lot || (definition && definition.art !== key)) throw Error('Referencia MEC-06 discrepante: ' + id);
  const paths = entry.origin && assets(id, entry, lot);
  return {
    id,lot,key,name:entry.name || originalName,category:groups.get(id) || definition?.family || type,
    base:entry.base || (lot === 'D' ? 'Sin imagen en la interfaz' : 'Marcador genérico'),
    state:paths ? 'Integrada' : entry.state || 'Pendiente de ilustración',
    origin:entry.origin || '',reference:entry.source || (entry.origin ? id : ''),paths:paths || null,
    previous:comparison(id, entry.previous ?? (lot === 'D' ? null : 'marcador'), lot),
    note:entry.note || ''
  };
});

const pieces = Object.values(globalThis.AtlasMEC03Catalog.pieces).map(piece => {
  const {id,name,cabinet,collection:category} = piece;
  const original = originals.get(id);
  if (original && original.Pieza !== name) throw Error('El ID de OBJ-11 cambió de sujeto: ' + id);
  const edition = original ? {origin:'OBJ-11'} : newArt.has(id) ? {origin:'ART-OBJ-13'} : config.collectibles[id] || {};
  const paths = edition.origin && assets(id, edition, 'coleccionables');
  const previous = original && config.corrected.includes(id) ? 'revision' : archive.has(id) ? 'archivo' : 'marcador';
  const draftFile = 'art-obj-12/anteriores/' + id + '.svg';
  const previousArt = previous === 'marcador' && fs.existsSync(path.join(www,draftFile))
    ? {kind:'boceto',label:'Boceto ART-COL-01',paths:{128:draftFile}}
    : comparison(id,previous,'coleccionables');
  return {
    id,lot:'coleccionables',key:'item-' + id,name,category,cabinet,
    base:'Marcador genérico',state:paths ? 'Integrada' : edition.state || (original ? 'Existente sin conexión' : 'Pendiente de ilustración'),
    origin:edition.origin || '',reference:edition.source || (original ? id : ''),paths:paths || null,
    previous:previousArt,
    note:edition.note || (archive.has(id) ? 'El ID de la beta corresponde a otro sujeto.' : ''),
    catalog:original ? 'OBJ-11' : 'V5.6',
    family:!original && !config.collectibles[id]?.origin ? art13Lots.find(lot => lot.collections.includes(category))?.name : null
  };
});

if (workshop.length !== 73 || pieces.length !== 431 || originals.size !== 300 ||
    pieces.filter(piece => piece.catalog === 'OBJ-11').length !== 300 ||
    new Set([...workshop,...pieces].map(row => row.id)).size !== 504) throw Error('Cobertura inesperada');
const comparisons = [...new Set([...workshop,...pieces].flatMap(row =>
  row.previous?.external ? [] : Object.values(row.previous?.paths || {})))];
const large = [...new Set(pieces.map(row => row.paths?.[512]).filter(Boolean))];
const descriptions = {...Object.fromEntries(collection.map(row => [row.ID, row['Descripción breve']])),...config.descriptions};
const quote = value => '"' + String(value ?? '').replaceAll('"','""') + '"';
const csv = (directory, name, records) => {
  const header = ['id','lote','nombre','categoria','referencia_mec','estado_beta','estado_actual','origen','referencia_grafica','ruta_64','ruta_128','ruta_256','ruta_512','ruta_de_origen','imagen_anterior','catalogo','nota'];
  const data = records.map(row => [row.id,row.lot,row.name,row.category,row.key,row.base,row.state,row.origin,row.reference,
    ...Object.keys(sizes).map(size => row.paths?.[size]),row.origin === 'OBJ-11' && row.reference ? artDir+'/'+row.reference+'/' : '',
    Object.values(row.previous?.paths || {}).join(' | '),row.catalog,row.note]);
  fs.writeFileSync(path.join(directory,name), '\uFEFF' + [header,...data].map(row => row.map(quote).join(';')).join('\n') + '\n');
};
csv(docs,'referencias-mec06.csv',workshop);
csv(art13,'coleccionables.csv',pieces);
const pending = pieces.filter(row => row.catalog === 'V5.6' && !row.paths);
csv(art13,'pendientes.csv',pending);
fs.writeFileSync(path.join(art13,'cobertura.json'), JSON.stringify(pieces.map(({id,name,cabinet,category,family,origin,paths}) =>
  ({id,name,cabinet,category,family,origin,paths})),null,2) + '\n');
fs.writeFileSync(path.join(www,'js/art-obj-12-assets.js'),
  '// Generado por scripts/build-art-obj-12.cjs.\nglobalThis.AtlasObjectArtAssets = Object.freeze(' + JSON.stringify(files) + ');\n' +
  'globalThis.AtlasObjectArtLargeFiles = Object.freeze(' + JSON.stringify(large) + ');\n' +
  'globalThis.AtlasObjectArtComparisonFiles = Object.freeze(' + JSON.stringify(comparisons) + ');\n' +
  'globalThis.AtlasObjectArtDescriptions = Object.freeze(' + JSON.stringify(descriptions) + ');\n');
fs.writeFileSync(path.join(lab,'data.js'),
  '// Generado por scripts/build-art-obj-12.cjs.\nglobalThis.AtlasObjectArtReview = ' + JSON.stringify([...workshop,...pieces]) + ';\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(Object.groupBy([...workshop,...pieces],row => row.lot))
  .map(([lot, records]) => [lot,Object.fromEntries(Object.entries(Object.groupBy(records,row => row.state)).map(([key,v]) => [key,v.length]))]))));
