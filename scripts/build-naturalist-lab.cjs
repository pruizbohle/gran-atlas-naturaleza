'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { harness } = require('../tests/helpers/live-game.cjs');
const { ungulateFamily } = require('./ungulate-families.cjs');
const { terrestrialMammal, aquaticMammal } = require('./terrestrial-mammal-families.cjs');

const out = path.resolve('www/naturalist-art');
const artDir = path.join(out, 'plates');
const reviewDir = path.join(out, 'review');
const reviewNotes = path.join(reviewDir, 'observations.json');
const observations = fs.existsSync(reviewNotes) ? JSON.parse(fs.readFileSync(reviewNotes, 'utf8')) : {};
const classicalIndex = path.join(reviewDir, 'classical-plates.json');
const classical = new Set(fs.existsSync(classicalIndex) ? JSON.parse(fs.readFileSync(classicalIndex, 'utf8')) : []);
const qualities = [75, 80, 85, 90, 95];
const reviewFiles = new Set();
const modules = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art', 'app'];
const gameSource = modules.map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
const audit = harness({}, null, { gameSource }).window.__atlasTest;
const priority = [
  'petauroides_volans', 'dendrolagus_goodfellowi', 'macrotis_lagotis',
  'myrmecobius_fasciatus', 'spilocuscus_maculatus', 'dendrolagus_lumholtzi', 'dendrolagus_matschiei'
].map(suffix => 'oc_esp_' + suffix);
priority.splice(5, 0, 'gm06_dromiciops_gliroides');
priority.unshift('af_gorila_montana');

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
const cutouts = {};
function hasAlpha(file) {
  const bytes = fs.readFileSync(file);
  switch (bytes.toString('ascii', 12, 16)) {
    case 'VP8X': return Boolean(bytes[20] & 0x10);
    case 'VP8L': return Boolean(bytes.readUInt32LE(21) & 0x10000000);
    default: return false;
  }
}

function plate(id, key, label) {
  const file = id + '--' + key + '.webp';
  const source = path.join(artDir, file);
  const exists = fs.existsSync(source);
  if (exists) {
    assets.add(file);
    if (hasAlpha(source)) cutouts[file] = true;
  }
  const reviewAsset = (folder, comparisonFile) => {
    const relative = 'review/' + folder + '/' + comparisonFile;
    const location = path.join(out, relative);
    if (!fs.existsSync(location)) return null;
    reviewFiles.add('naturalist-art/' + relative);
    return { src: relative, bytes: fs.statSync(location).size };
  };
  const before = reviewAsset('before', file);
  const previous = reviewAsset('series-4.3', file);
  const compression = Object.fromEntries(qualities.flatMap(quality => {
    const sample = reviewAsset('compression/' + quality, file);
    return sample ? [[quality, sample]] : [];
  }));
  return {
    key, label, src: exists ? 'plates/' + file : null, bytes: exists ? fs.statSync(source).size : 0,
    cutout: cutouts[file] === true, classical: classical.has(file),
    note: classical.has(file) ? '' : observations[file] || '', before, previous, compression
  };
}

const felidGenera = new Set([
  'Acinonyx', 'Caracal', 'Catopuma', 'Felis', 'Herpailurus', 'Leopardus', 'Leptailurus',
  'Lynx', 'Neofelis', 'Otocolobus', 'Panthera', 'Pardofelis', 'Prionailurus', 'Puma'
]);
const canidGenera = new Set([
  'Atelocynus', 'Canis', 'Cerdocyon', 'Chrysocyon', 'Cuon', 'Dusicyon', 'Lupulella',
  'Lycaon', 'Lycalopex', 'Nyctereutes', 'Otocyon', 'Speothos', 'Urocyon', 'Vulpes'
]);
// The lab resolves these zoological families independently of the historic UI buckets.
const carnivoreGenera = {
  Ursidae: 'Ailuropoda Helarctos Melursus Tremarctos Ursus',
  Mustelidae: 'Aonyx Arctonyx Eira Galictis Gulo Hydrictis Ictonyx Lontra Lutra Lutrogale Martes Meles Mellivora Melogale Mustela Neogale Poecilogale Pteronura Taxidea Vormela',
  Mephitidae: 'Conepatus Mephitis Mydaus Spilogale',
  Procyonidae: 'Bassaricyon Bassariscus Nasua Nasuella Potos Procyon',
  Ailuridae: 'Ailurus',
  Hyaenidae: 'Crocuta Hyaena Parahyaena Proteles',
  Herpestidae: 'Bdeogale Crossarchus Cynictis Dologale Galerella Helogale Herpestes Ichneumia Mungos Paracynictis Rhynchogale Suricata Xenogale',
  Viverridae: 'Arctictis Arctogalidia Chrotogale Civettictis Genetta Hemigalus Paguma Paradoxurus Poiana Viverricula Viverra',
  Eupleridae: 'Cryptoprocta Eupleres Fossa Galidia Galidictis Mungotictis Salanoia',
  Nandiniidae: 'Nandinia',
  Prionodontidae: 'Prionodon'
};
const carnivoreFamilyByGenus = new Map(Object.entries(carnivoreGenera).flatMap(([family, names]) =>
  names.split(' ').map(genus => [genus, family])));
// Primates are resolved from their zoological names, including taxa filed under
// pequeños mamíferos and Otros mamíferos in the legacy display taxonomy.
const primateGenera = {
  Aotidae: 'Aotus',
  Atelidae: 'Alouatta Ateles Lagothrix',
  Callitrichidae: 'Saguinus',
  Cebidae: 'Cebus Saimiri',
  Cercopithecidae: 'Cercopithecus Chlorocebus Colobus Macaca Mandrillus Nasalis Papio Rhinopithecus Semnopithecus Theropithecus',
  Cheirogaleidae: 'Microcebus',
  Daubentoniidae: 'Daubentonia',
  Galagidae: 'Galago',
  Hominidae: 'Gorilla Pan Pongo',
  Hylobatidae: 'Hylobates Nomascus Symphalangus',
  Indriidae: 'Indri Propithecus',
  Lemuridae: 'Lemur Varecia',
  Lorisidae: 'Nycticebus',
  Tarsiidae: 'Carlito Tarsius'
};
const primateFamilyByGenus = new Map(Object.entries(primateGenera).flatMap(([family, names]) =>
  names.split(' ').map(genus => [genus, family])));

function classify(id, sp) {
  const taxonomy = audit.taxonomyInfo(id);
  const genus = sp.latin.split(' ')[0];
  if (aquaticMammal(sp.latin)) return null;
  const terrestrial = terrestrialMammal(sp.latin);
  if (terrestrial) return terrestrial;
  const hoofedFamily = ungulateFamily(sp.latin, taxonomy.family || sp.family);
  if (hoofedFamily) return { family: hoofedFamily, group: 'Ungulados' };
  const primateFamily = primateFamilyByGenus.get(genus);
  if (primateFamily) return { family: primateFamily, group: 'Primates' };
  if (['Primates', 'Lémures'].includes(taxonomy.subClass) || Object.hasOwn(primateGenera, taxonomy.family)) {
    throw Error('Primate sin familia zoológica revisada: ' + sp.latin);
  }
  const family = carnivoreFamilyByGenus.get(genus) || taxonomy.family || sp.family;
  if (Object.hasOwn(carnivoreGenera, family)) return { family, group: 'Carnívoros terrestres' };
  if (taxonomy.subClass === 'Marsupiales' || families.has(family)) return { family, group: 'Marsupiales' };
  if (family === 'Canidae' || canidGenera.has(genus)) return { family: 'Canidae', group: 'Cánidos' };
  if (family === 'Felidae' || felidGenera.has(genus)) return { family: 'Felidae', group: 'Felinos' };
  if (['Ornithorhynchidae', 'Tachyglossidae'].includes(family)) return { family, group: 'Monotremas' };
  return null;
}

const catalogEntries = Object.entries(audit.SPECIES);
const species = catalogEntries.flatMap(([id, sp]) => {
  const classification = classify(id, sp);
  if (!classification) return [];
  const { group, family } = classification;
  const special = audit.configuredSpecials(sp);
  const records = [plate(id, 'normal', 'Normal')];
  if (audit.SEXUAL_DIMORPHISM[id]) {
    // The African lion and the new ungulate base plates depict adult males.
    const male = id === 'af_leon' || group === 'Ungulados'
      ? { ...records[0], key: 'male', label: 'Macho', bytes: 0, sharedWith: 'normal' }
      : plate(id, 'male', 'Macho');
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
  for (const record of records.slice(1)) {
    const sex = ['male', 'female'].includes(record.key) ? record.key : null;
    record.svg = audit.getSpriteMarkup(id, sex ? 'normal' : record.key, sex);
    if (record.key === 'legendario') {
      // The comparison applies the same external halo to each representation.
      record.svg = record.svg.replace(/ data-specimen-category="[^"]+"/, '')
        .replace(/<g data-specimen-halo="[^"]+"[^>]*>[\s\S]*?<\/g>/, '');
    }
  }
  return [{
    id, name: sp.name, latin: sp.latin, rarity: sp.rare || null, group, family,
    dimorphism: Boolean(audit.SEXUAL_DIMORPHISM[id]),
    habitats: [...sp.habitats],
    regions: audit.REGIONS.filter(region => region.species.includes(id))
      .map(({ id, name, continent }) => ({ id, name, continent })),
    categories: categories.filter(label => label === 'Normal' || special.includes(label)),
    records, sprite: audit.getSpriteMarkup(id, 'normal')
  }];
}).sort((a, b) => {
  const rank = id => priority.includes(id) ? priority.indexOf(id) : priority.length;
  return rank(a.id) - rank(b.id) || a.name.localeCompare(b.name, 'es');
});

for (const file of fs.readdirSync(artDir)) {
  if (file.endsWith('.webp') && !assets.has(file)) throw Error('Lámina sin entrada en el catálogo: ' + file);
}
for (const file of classical) {
  if (!cutouts[file]) throw Error('Lámina científica sin transparencia o sin entrada: ' + file);
}
const records = species.flatMap(sp => sp.records);
const mammals = catalogEntries.filter(([id]) => audit.taxonomyInfo(id).className === 'Mammalia');
const migrationProgress = {
  migrated: species.filter(sp => sp.records[0].src).length,
  total: catalogEntries.length,
  cutouts: Object.keys(cutouts).length,
  plates: assets.size,
  biological: records.filter(record => record.src && !['normal', 'legendario'].includes(record.key)).length,
  legendary: species.filter(sp => sp.records.some(record => record.src && record.key === 'legendario')).length,
  review: records.filter(record => record.note).length,
  classical: classical.size,
  target: records.filter(record => !record.sharedWith).length,
  ungulates: species.filter(sp => sp.group === 'Ungulados').length,
  mammals: mammals.length,
  mammalsMigrated: species.filter(sp => sp.records[0].src && audit.taxonomyInfo(sp.id).className === 'Mammalia').length
};
const mixedFieldSprites = ['aguila_real', 'buho_real', 'af_avestruz'].map(id => {
  const sp = audit.SPECIES[id];
  if (classify(id, sp)) throw Error('El ejemplo de Campo debe conservar SVG: ' + id);
  return { id, name: sp.name, sprite: audit.getSpriteMarkup(id, 'normal') };
});
fs.writeFileSync(path.join(out, 'catalog.js'),
  'const catalog = ' + JSON.stringify(species, null, 2) + ';\n' +
  'const mixedFieldSprites = ' + JSON.stringify(mixedFieldSprites, null, 2) + ';\n' +
  'const migrationProgress = ' + JSON.stringify(migrationProgress) + ';\n');
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
const landscapes = fs.readdirSync(path.join(out, 'landscapes')).filter(file => file.endsWith('.webp'))
  .map(file => path.basename(file, '.webp')).sort();
const animalFiles = [...assets].sort().flatMap(file =>
  ['', '64/', '128/', '256/'].map(size => 'naturalist-art/plates/' + size + file));
const files = [...animalFiles, ...landscapes.map(key => 'naturalist-art/landscapes/' + key + '.webp')];
const labFiles = [...reviewFiles].sort();
for (const file of [...files, ...labFiles]) {
  if (!fs.existsSync('www/' + file)) throw Error('Falta derivado gráfico: ' + file);
}
const labBytes = labFiles.reduce((bytes, file) => bytes + fs.statSync('www/' + file).size, 0);
fs.writeFileSync('www/js/naturalist-assets-v400.js',
  'globalThis.AtlasNaturalistAssets = ' + JSON.stringify({ routes, cutouts, landscapes, files, labFiles, labBytes }, null, 2) + ';\n');
console.log(JSON.stringify({
  species: species.length,
  catalogSize: migrationProgress.total,
  carnivoresByFamily: Object.fromEntries(Object.keys(carnivoreGenera).map(family => [family,
    species.filter(sp => sp.family === family).length]).filter(([, count]) => count)),
  bases: records.filter(record => record.key === 'normal' && record.src).length,
  variants: records.filter(record => !['normal', 'legendario'].includes(record.key) && record.src).length,
  legendary: records.filter(record => record.key === 'legendario' && record.src).length,
  pending: species.flatMap(sp => sp.records.filter(record => !record.src)
    .map(record => ({ id: sp.id, name: sp.name, variant: record.key }))),
  bytes: records.reduce((sum, record) => sum + record.bytes, 0),
  variantsConfigured: species.flatMap(sp => sp.records.filter(record => record.key !== 'normal').map(record => sp.id + '--' + record.key))
}, null, 2));
