'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { harness } = require('../tests/helpers/live-game.cjs');
const { ungulateFamily } = require('./ungulate-families.cjs');
const { terrestrialMammal, aquaticMammal } = require('./terrestrial-mammal-families.cjs');
const birdPlan = require('../docs/cientifica-v460/inventario-aves.json');
const herpetologyPlan = require('../docs/cientifica-v474/inventario-herpetologia.json').editions;
const reptiles = new Map(['4.8.0', '4.8.1'].flatMap(edition => herpetologyPlan[edition].inventory
  .map(animal => [animal.id, { ...animal, edition }])));
const reptileSets = {
  ...require('./turtle-crocodilian-comparisons.cjs'),
  ...require('./squamate-comparisons.cjs')
};
const visualScales = { sa_esp_brachycephalus_pulex: 0.25, gm06_mellisuga_helenae: 0.5 };
const additions = require('../www/js/gm07-a04/catalog.js').records;
const amphibians = new Map(herpetologyPlan['4.8.2'].inventory.map(animal => [animal.id, animal]));
const amphibianSets = require('./amphibian-comparisons.cjs');
const cartilaginous = new Map(require('../docs/cientifica-v482/inventario-v49.json').lots.condrictios.inventory
  .map(animal => [animal.id, animal]));
const cartilaginousSets = require('./cartilaginous-comparisons.cjs');
const comparisonSets = {
  ...require('./passerine-comparisons.cjs'),
  ...require('./arboreal-bird-comparisons.cjs'),
  ...require('./terrestrial-bird-comparisons.cjs'),
  ...require('./aquatic-bird-comparisons.cjs'),
  ...require('./raptor-comparisons.cjs')
};

const out = path.resolve('www/naturalist-art');
const artDir = path.join(out, 'plates');
const reviewDir = path.join(out, 'review');
const reviewNotes = path.join(reviewDir, 'observations.json');
const observations = fs.existsSync(reviewNotes) ? JSON.parse(fs.readFileSync(reviewNotes, 'utf8')) : {};
const classicalIndex = path.join(reviewDir, 'classical-plates.json');
const classical = new Set(fs.existsSync(classicalIndex) ? JSON.parse(fs.readFileSync(classicalIndex, 'utf8')) : []);
const qualities = [75, 80, 85, 90, 95];
const reviewFiles = new Set();
const modules = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art', 'gm07-a04/catalog', 'app'];
const gameSource = modules.map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
const audit = harness({}, null, { gameSource }).window.__atlasTest;
const priority = [
  'petauroides_volans', 'dendrolagus_goodfellowi', 'macrotis_lagotis',
  'myrmecobius_fasciatus', 'spilocuscus_maculatus', 'dendrolagus_lumholtzi', 'dendrolagus_matschiei'
].map(suffix => 'oc_esp_' + suffix);
priority.splice(5, 0, 'gm06_dromiciops_gliroides');
priority.unshift('af_tortuga_aldabra', 'af_cocodrilo_nilo', 'asia_esp_0527', 'asia_esp_0373', 'oc_esp_cicinnurus_respublica', 'eu_esp_0629', 'asia_esp_0067',
  'sa_esp_scelorchilus_rubecula', 'sa_esp_brachycephalus_pulex',
  'af_avestruz', 'asia_esp_0410', 'urogallo_comun',
  'frailecillo_atlantico', 'aguila_real', 'mar_esp_megaptera_novaeangliae',
  'sa_esp_inia_geoffrensis', 'af_gorila_montana');
const aquaticBirds = birdPlan.editions['4.7.1'].inventory;
const paleognathOrders = new Set(['Apterygiformes', 'Casuariiformes', 'Rheiformes', 'Struthioniformes']);
const terrestrialBirds = birdPlan.editions['4.7.2'].inventory.map(row => ({
  ...row,
  group: row.order === 'Galliformes' ? 'Galliformes' :
    paleognathOrders.has(row.order) ? 'Corredoras y paleognatas' : 'Otras aves terrestres'
}));
const arborealBirds = birdPlan.editions['4.7.3'].inventory.map(row => ({
  ...row, group: row.order === 'Passeriformes' ? 'Paseriformes' : 'Arborícolas y otros no paseriformes', edition: '4.7.3'
}));
const birds = new Map([
  ...birdPlan.editions['4.7.0'].inventory.map(row => ({ ...row, group: 'Rapaces' })),
  ...aquaticBirds.map(row => ({ ...row, group: row.wave })),
  ...terrestrialBirds,
  ...arborealBirds,
  ...birdPlan.editions['4.7.4'].inventory.map(row => ({ ...row, group: 'Paseriformes', edition: '4.7.4' }))
].map(row => [row.id, row]));
const pelagicFamilies = new Set(['Diomedeidae', 'Procellariidae', 'Fregatidae', 'Sulidae']);
const wetlandPortraits = {
  'Aix galericulata': 'rio',
  'Fulica atra': 'humedal',
  'Podiceps cristatus': 'rio',
  'Spatula clypeata': 'humedal',
  'Tachybaptus ruficollis': 'humedal'
};
const bestiaryHabitats = Object.fromEntries(aquaticBirds.flatMap(bird => {
  const habitat = wetlandPortraits[bird.latin] || (pelagicFamilies.has(bird.family)
    && bird.habitats.find(key => ['oceano_abierto', 'mar_austral'].includes(key)));
  return habitat ? [[bird.id, habitat]] : [];
}));

const aquaticGroups = {
  Cetacea: 'Cetáceos',
  Pinnipedia: 'Pinnípedos',
  Sirenia: 'Sirenios',
  'Nutria marina': 'Nutria marina'
};

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
  const bird = birds.get(id);
  if (bird) {
    if (taxonomy.className !== 'Aves' || bird.latin !== sp.latin) throw Error('Ave fuera del inventario: ' + id);
    return { family: bird.family, order: bird.order, group: bird.group, edition: bird.edition };
  }
  const reptile = reptiles.get(id);
  if (reptile) {
    if (taxonomy.className !== 'Reptilia' || reptile.latin !== sp.latin) throw Error('Reptil fuera del inventario: ' + id);
    const { family, order, group, edition } = reptile;
    return { family, order, group, edition };
  }
  const amphibian = amphibians.get(id);
  if (amphibian) {
    if (taxonomy.className !== 'Amphibia' || amphibian.latin !== sp.latin) throw Error('Anfibio fuera del inventario: ' + id);
    const { family, order } = amphibian;
    return { family, order, group: 'Anfibios', edition: id === 'sa_esp_brachycephalus_pulex' ? '4.7.3' : '4.8.2' };
  }
  const fish = cartilaginous.get(id);
  if (fish) {
    if (taxonomy.className !== fish.className || fish.latin !== sp.latin) throw Error('Condrictio fuera del inventario: ' + id);
    return { family: fish.family, group: 'Tiburones y rayas', edition: '4.9.0' };
  }
  const genus = sp.latin.split(' ')[0];
  const aquatic = aquaticMammal(sp.latin);
  if (aquatic) return { family: aquatic.family, group: aquaticGroups[aquatic.group] };
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
  const addition = Object.hasOwn(additions, id) ? additions[id] : null;
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
    ...(classification.order ? { order: classification.order } : {}),
    ...(classification.edition ? { edition: classification.edition } : {}),
    ...(addition ? { catalogChange: addition.species ? 'new' : 'updated' } : {}),
    dimorphism: Boolean(audit.SEXUAL_DIMORPHISM[id]),
    habitats: [...sp.habitats],
    regions: audit.REGIONS.filter(region => region.species.includes(id))
      .sort((a, b) => Number(b.id === addition?.region) - Number(a.id === addition?.region))
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
function buildComparisons(sets, members, key) {
  const byLatin = new Map(species.filter(sp => members.has(sp.id)).map(sp => [sp.latin, sp]));
  return Object.fromEntries(Object.entries(sets).map(([id, set]) =>
    [id, { label: set.label, [key]: set[key].map(([latin, trait, plateKey]) => {
      const animal = byLatin.get(latin);
      if (!animal) throw Error('Especie de comparación fuera del inventario: ' + latin);
      if (plateKey && !animal.records.some(record => record.key === plateKey && record.src)) {
        throw Error('Variante de comparación sin lámina: ' + latin + ' · ' + plateKey);
      }
      return { id: animal.id, trait, ...(plateKey ? { plateKey } : {}) };
    }) }]));
}

const birdComparisons = buildComparisons(comparisonSets, birds, 'birds');
const reptileComparisons = buildComparisons(reptileSets, reptiles, 'reptiles');
const amphibianComparisons = buildComparisons(amphibianSets, amphibians, 'amphibians');
const cartilaginousComparisons = buildComparisons(cartilaginousSets, cartilaginous, 'cartilaginous');
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
  mammalsMigrated: species.filter(sp => sp.records[0].src && audit.taxonomyInfo(sp.id).className === 'Mammalia').length,
  birds: catalogEntries.filter(([id]) => audit.taxonomyInfo(id).className === 'Aves').length,
  birdsMigrated: species.filter(sp => sp.records[0].src && audit.taxonomyInfo(sp.id).className === 'Aves').length,
  reptiles: catalogEntries.filter(([id]) => audit.taxonomyInfo(id).className === 'Reptilia').length,
  reptilesMigrated: species.filter(sp => sp.records[0].src && audit.taxonomyInfo(sp.id).className === 'Reptilia').length,
  amphibians: catalogEntries.filter(([id]) => audit.taxonomyInfo(id).className === 'Amphibia').length,
  amphibiansMigrated: species.filter(sp => sp.records[0].src && audit.taxonomyInfo(sp.id).className === 'Amphibia').length,
  cartilaginous: catalogEntries.filter(([id]) => audit.taxonomyInfo(id).className === 'Chondrichthyes').length,
  cartilaginousMigrated: species.filter(sp => sp.records[0].src && cartilaginous.has(sp.id)).length
};
const mixedFieldSprites = ['eu_esp_0669', 'eu_esp_0668', 'eu_esp_0667'].map(id => {
  const sp = audit.SPECIES[id];
  if (classify(id, sp)) throw Error('El ejemplo de Campo debe conservar SVG: ' + id);
  return { id, name: sp.name, sprite: audit.getSpriteMarkup(id, 'normal') };
});
fs.writeFileSync(path.join(out, 'catalog.js'),
  'const catalog = ' + JSON.stringify(species, null, 2) + ';\n' +
  'const mixedFieldSprites = ' + JSON.stringify(mixedFieldSprites, null, 2) + ';\n' +
  'const birdComparisons = ' + JSON.stringify(birdComparisons, null, 2) + ';\n' +
  'const reptileComparisons = ' + JSON.stringify(reptileComparisons, null, 2) + ';\n' +
  'const amphibianComparisons = ' + JSON.stringify(amphibianComparisons, null, 2) + ';\n' +
  'const cartilaginousComparisons = ' + JSON.stringify(cartilaginousComparisons, null, 2) + ';\n' +
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
for (const [id, scale] of Object.entries(visualScales)) {
  if (!routes[id]?.normal || !(scale > 0 && scale < 1)) throw Error('Escala visual sin lámina válida: ' + id);
}
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
  'globalThis.AtlasNaturalistAssets = ' +
  JSON.stringify({ routes, cutouts, landscapes, bestiaryHabitats, visualScales, files, labFiles, labBytes }, null, 2) + ';\n');
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
