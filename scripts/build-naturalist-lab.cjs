'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { harness } = require('../tests/helpers/live-game.cjs');

const out = path.resolve('www/naturalist-art');
const artDir = path.join(out, 'plates');
const modules = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art', 'app'];
const gameSource = modules.map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
const audit = harness({}, null, { gameSource }).window.__atlasTest;
const priority = [
  'petauroides_volans', 'dendrolagus_goodfellowi', 'macrotis_lagotis',
  'myrmecobius_fasciatus', 'spilocuscus_maculatus', 'dendrolagus_lumholtzi', 'dendrolagus_matschiei'
].map(suffix => 'oc_esp_' + suffix);
priority.splice(5, 0, 'gm06_dromiciops_gliroides');

// Cross-check family independently of the game's display taxonomy.
const families = new Set([
  'Didelphidae', 'Caenolestidae', 'Microbiotheriidae', 'Notoryctidae',
  'Dasyuridae', 'Myrmecobiidae', 'Thylacinidae', 'Peramelidae', 'Thylacomyidae',
  'Phascolarctidae', 'Vombatidae', 'Burramyidae', 'Phalangeridae',
  'Petauridae', 'Pseudocheiridae', 'Tarsipedidae', 'Acrobatidae',
  'Macropodidae', 'Potoroidae', 'Hypsiprymnodontidae'
]);
const categories = ['Normal', 'Notable', 'Épico', 'Excepcional', 'Legendario'];
const assets = new Set();

function plate(id, key, label) {
  const file = id + '--' + key + '.webp';
  const source = path.join(artDir, file);
  const exists = fs.existsSync(source);
  if (exists) assets.add(file);
  return { key, label, src: exists ? 'plates/' + file : null, bytes: exists ? fs.statSync(source).size : 0 };
}

const felidGenera = new Set([
  'Acinonyx', 'Caracal', 'Catopuma', 'Felis', 'Herpailurus', 'Leopardus', 'Leptailurus',
  'Lynx', 'Neofelis', 'Otocolobus', 'Panthera', 'Pardofelis', 'Prionailurus', 'Puma'
]);
const canidGenera = new Set([
  'Atelocynus', 'Canis', 'Cerdocyon', 'Chrysocyon', 'Cuon', 'Dusicyon', 'Lupulella',
  'Lycaon', 'Lycalopex', 'Nyctereutes', 'Otocyon', 'Speothos', 'Urocyon', 'Vulpes'
]);
function groupFor(id, sp) {
  const taxonomy = audit.taxonomyInfo(id);
  const family = taxonomy.family || sp.family;
  if (taxonomy.subClass === 'Marsupiales' || families.has(family)) return 'Marsupiales';
  if (family === 'Canidae' || canidGenera.has(sp.latin.split(' ')[0])) return 'Cánidos';
  if (family === 'Felidae' || felidGenera.has(sp.latin.split(' ')[0])) return 'Felinos';
  if (['Ornithorhynchidae', 'Tachyglossidae'].includes(family)) return 'Monotremas';
  return null;
}

const species = Object.entries(audit.SPECIES).filter(([id, sp]) => groupFor(id, sp)).map(([id, sp]) => {
  const group = groupFor(id, sp);
  const family = ({ Felinos: 'Felidae', 'Cánidos': 'Canidae' })[group] || audit.taxonomyInfo(id).family || sp.family;
  const special = audit.configuredSpecials(sp);
  const records = [plate(id, 'normal', 'Normal')];
  if (audit.SEXUAL_DIMORPHISM[id]) {
    // The Felidae reference plate already depicts the male African lion.
    const male = id === 'af_leon' ? { ...records[0], key: 'male', label: 'Macho', bytes: 0 } : plate(id, 'male', 'Macho');
    records.push(male, plate(id, 'female', 'Hembra'));
  }
  if (special.includes('Albino')) records.push(plate(id, 'albino', 'Albino'));
  if (special.includes('Melánico')) records.push(plate(id, 'melanico', 'Melánico'));
  const taxon = item => audit.SPECIES[item]?.latin.toLowerCase().split(/\s+/).slice(0, 2).join(' ');
  const legendary = special.includes('Legendario') && audit.LEGENDARY_SPECIMENS.find(item => taxon(item.speciesId) === taxon(id));
  if (legendary) {
    const record = plate(id, legendary.id, legendary.name);
    records.push({ ...record, key: 'legendario' });
  }
  return {
    id, name: sp.name, latin: sp.latin, rarity: sp.rare || null, group, family,
    dimorphism: Boolean(audit.SEXUAL_DIMORPHISM[id]),
    regions: audit.REGIONS.filter(region => region.species.includes(id))
      .map(({ id, name, continent }) => ({ id, name, continent })),
    categories: categories.filter(label => label === 'Normal' || special.includes(label)),
    records, sprite: audit.getSpriteMarkup(id, 'normal')
  };
}).sort((a, b) => {
  const rank = id => priority.includes(id) ? priority.indexOf(id) : priority.length;
  return rank(a.id) - rank(b.id) || a.name.localeCompare(b.name, 'es');
});

for (const file of fs.readdirSync(artDir)) {
  if (file.endsWith('.webp') && !assets.has(file)) throw Error('Lámina sin entrada en el catálogo: ' + file);
}
const mixedFieldSprites = ['ciervo_rojo', 'jabali', 'oso_pardo'].map(id => {
  const sp = audit.SPECIES[id];
  if (groupFor(id, sp)) throw Error('El ejemplo de Campo debe conservar SVG: ' + id);
  return { id, name: sp.name, sprite: audit.getSpriteMarkup(id, 'normal') };
});
fs.writeFileSync(path.join(out, 'catalog.js'),
  'const catalog = ' + JSON.stringify(species, null, 2) + ';\n' +
  'const mixedFieldSprites = ' + JSON.stringify(mixedFieldSprites, null, 2) + ';\n');
const version = require('../package.json').version;
const rows = species.map(sp => [
  sp.group, sp.family, sp.id, sp.name, '*' + sp.latin + '*',
  [...new Set(sp.regions.map(region => region.continent))].join(', ') || '—',
  sp.regions.map(region => region.name).join(', ') || '—',
  sp.records.filter(record => record.key !== 'legendario').map(record => record.label + (record.src ? '' : ' (pendiente)')).join(', '),
  sp.dimorphism ? 'Sí' : 'No', sp.categories.map(category => category === 'Legendario' ?
    category + ' · ' + sp.records.find(record => record.key === 'legendario')?.label : category).join(', ')
]);
fs.writeFileSync(path.join(out, 'CATALOGO.md'), [
  '# Inventario naturalista del catálogo ' + version, '',
  '| Grupo | Familia | ID | Nombre común | Nombre científico | Continente | Zonas del juego | Variantes | Dimorfismo | Ejemplares |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map(row => '| ' + row.join(' | ') + ' |'), ''
].join('\n'));
const routes = Object.fromEntries(species.map(sp => [sp.id,
  Object.fromEntries(sp.records.filter(record => record.src)
    .map(record => [record.key, path.basename(record.src)]))]));
const files = [...assets].sort().flatMap(file =>
  ['', '64/', '128/', '256/'].map(size => 'naturalist-art/plates/' + size + file));
for (const file of files) {
  if (!fs.existsSync('www/' + file)) throw Error('Falta derivado gráfico: ' + file);
}
fs.writeFileSync('www/js/naturalist-assets-v400.js',
  'globalThis.AtlasNaturalistAssets = ' + JSON.stringify({ routes, files }, null, 2) + ';\n');
const records = species.flatMap(sp => sp.records);
console.log(JSON.stringify({
  species: species.length,
  catalogSize: Object.keys(audit.SPECIES).length,
  canids: species.filter(sp => sp.group === 'Cánidos').length,
  bases: records.filter(record => record.key === 'normal' && record.src).length,
  variants: records.filter(record => !['normal', 'legendario'].includes(record.key) && record.src).length,
  legendary: records.filter(record => record.key === 'legendario' && record.src).length,
  pending: species.flatMap(sp => sp.records.filter(record => !record.src)
    .map(record => ({ id: sp.id, name: sp.name, variant: record.key }))),
  bytes: records.reduce((sum, record) => sum + record.bytes, 0),
  variantsConfigured: species.flatMap(sp => sp.records.filter(record => record.key !== 'normal').map(record => sp.id + '--' + record.key))
}, null, 2));
