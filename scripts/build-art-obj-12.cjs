'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const www = path.join(root, 'www');
const docs = path.join(root, 'docs', 'art-obj-12');
const lab = path.join(www, 'art-obj-12');
const [source, ...options] = process.argv.slice(2);
if (!source) throw Error('Indica el directorio extraído de OBJ-11');
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
const sizes = {64:'inventario',128:'inventario',256:'clasica',512:'clasica'};
const artDir = 'objetos-cientificos/arte';
const files = {};
const balance = globalThis.AtlasMEC06;

function spritePaths(id) {
  return Object.fromEntries(Object.entries(sizes).map(([size, variant]) => [size, artDir + '/' + id + '/' + variant + '-' + size + '.webp']));
}

function transfer(rel) {
  const origin = path.join(sourceWeb, rel);
  const destination = path.join(www, rel);
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
    const file = archive.get(id)?.sprites.clasica[256].src;
    if (recover.has(lot)) transfer(file);
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
  const {id,name,collection:category} = piece;
  const original = originals.get(id);
  if (original && original.Pieza !== name) throw Error('El ID de OBJ-11 cambió de sujeto: ' + id);
  const edition = original ? {origin:'OBJ-11'} : config.collectibles[id] || {};
  const paths = edition.origin && assets(id, edition, 'coleccionables');
  const previous = original && config.corrected.includes(id) ? 'revision' : archive.has(id) ? 'archivo' : 'marcador';
  return {
    id,lot:'coleccionables',key:'item-' + id,name,category,
    base:'Marcador genérico',state:paths ? 'Integrada' : edition.state || (original ? 'Existente sin conexión' : 'Pendiente de ilustración'),
    origin:edition.origin || '',reference:edition.source || (original ? id : ''),paths:paths || null,
    previous:comparison(id, previous, 'coleccionables'),
    note:edition.note || (archive.has(id) ? 'El ID de la beta corresponde a otro sujeto.' : ''),
    catalog:original ? 'OBJ-11' : 'V5.6'
  };
});

if (workshop.length !== 73 || pieces.length !== 431 || originals.size !== 300 ||
    pieces.filter(piece => piece.catalog === 'OBJ-11').length !== 300 ||
    new Set([...workshop,...pieces].map(row => row.id)).size !== 504) throw Error('Cobertura inesperada');
const quote = value => '"' + String(value ?? '').replaceAll('"','""') + '"';
const csv = (name, records) => {
  const header = ['id','lote','nombre','categoria','referencia_mec','estado_beta','estado_actual','origen','referencia_grafica','ruta_64','ruta_128','ruta_256','ruta_512','imagen_anterior','catalogo','nota'];
  const data = records.map(row => [row.id,row.lot,row.name,row.category,row.key,row.base,row.state,row.origin,row.reference,
    ...Object.keys(sizes).map(size => row.paths?.[size]),Object.values(row.previous?.paths || {}).join(' | '),row.catalog,row.note]);
  fs.writeFileSync(path.join(docs,name), '\uFEFF' + [header,...data].map(row => row.map(quote).join(';')).join('\n') + '\n');
};
csv('referencias-mec06.csv',workshop);
csv('coleccionables.csv',pieces);
csv('coleccionables-v56-pendientes.csv',pieces.filter(row => row.catalog === 'V5.6' && !row.paths));
fs.writeFileSync(path.join(www,'js/art-obj-12-assets.js'),
  '// Generado por scripts/build-art-obj-12.cjs.\nglobalThis.AtlasObjectArtAssets = Object.freeze(' + JSON.stringify(files) + ');\n');
fs.writeFileSync(path.join(lab,'data.js'),
  '// Generado por scripts/build-art-obj-12.cjs.\nglobalThis.AtlasObjectArtReview = ' + JSON.stringify([...workshop,...pieces]) + ';\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(Object.groupBy([...workshop,...pieces],row => row.lot))
  .map(([lot, records]) => [lot,Object.fromEntries(Object.entries(Object.groupBy(records,row => row.state)).map(([key,v]) => [key,v.length]))]))));
