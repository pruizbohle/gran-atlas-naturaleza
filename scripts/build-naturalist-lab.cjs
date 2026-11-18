'use strict';

const fs = require('node:fs');
const { createHash } = require('node:crypto');
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

const species = Object.entries(audit.SPECIES).filter(([id, sp]) => {
  const taxonomy = audit.taxonomyInfo(id);
  return taxonomy.subClass === 'Marsupiales' || families.has(taxonomy.family || sp.family);
}).map(([id, sp]) => {
  const special = audit.configuredSpecials(sp);
  const records = [plate(id, 'normal', 'Normal')];
  if (audit.SEXUAL_DIMORPHISM[id]) records.push(plate(id, 'male', 'Macho'), plate(id, 'female', 'Hembra'));
  if (special.includes('Albino')) records.push(plate(id, 'albino', 'Albino'));
  if (special.includes('Melánico')) records.push(plate(id, 'melanico', 'Melánico'));
  const legendary = audit.LEGENDARY_SPECIMENS.find(item => item.speciesId === id);
  if (legendary) records.push(plate(id, 'legendario', legendary.name));
  return {
    id, name: sp.name, latin: sp.latin, rarity: sp.rare || null,
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
fs.writeFileSync(path.join(out, 'catalog.js'), 'const catalog = ' + JSON.stringify(species, null, 2) + ';\n');
const version = require('../package.json').version;
const rows = species.map(sp => [
  sp.id, sp.name, '*' + sp.latin + '*',
  [...new Set(sp.regions.map(region => region.continent))].join(', ') || '—',
  sp.regions.map(region => region.name).join(', ') || '—',
  sp.records.filter(record => record.key !== 'legendario').map(record => record.label).join(', '),
  sp.dimorphism ? 'Sí' : 'No', sp.categories.join(', ')
]);
fs.writeFileSync(path.join(out, 'CATALOGO.md'), [
  '# Marsupiales del catálogo ' + version, '',
  '| ID | Nombre común | Nombre científico | Continente | Zonas del juego | Variantes | Dimorfismo | Ejemplares |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows.map(row => '| ' + row.join(' | ') + ' |'), ''
].join('\n'));
const plates = [...assets].sort().map(file => 'plates/' + file);
const hash = createHash('sha256');
for (const file of ['index.html', 'catalog.js', 'lab.js', 'lab.css', 'sw.js', ...plates]) {
  hash.update(file).update(fs.readFileSync(path.join(out, file)));
}
fs.writeFileSync(path.join(out, 'offline-assets.js'),
  'const build = ' + JSON.stringify(hash.digest('hex').slice(0, 16)) + ';\n' +
  'const plates = ' + JSON.stringify(plates.map(file => './' + file)) + ';\n');
const records = species.flatMap(sp => sp.records);
console.log(JSON.stringify({
  species: species.length,
  bases: records.filter(record => record.key === 'normal' && record.src).length,
  variants: records.filter(record => record.key !== 'normal' && record.src).length,
  pending: records.filter(record => !record.src).length,
  bytes: records.reduce((sum, record) => sum + record.bytes, 0),
  variantsConfigured: species.flatMap(sp => sp.records.filter(record => record.key !== 'normal').map(record => sp.id + '--' + record.key))
}, null, 2));
