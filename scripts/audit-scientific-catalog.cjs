'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { harness } = require('../tests/helpers/live-game.cjs');
const { aquaticMammal } = require('./terrestrial-mammal-families.cjs');
const herpetology = require('./herpetology-taxonomy.cjs');
const art = require('../www/js/naturalist-art-v400.js');

const modules = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art', 'gm07-a04/catalog', 'app'];
const gameSource = modules.map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
const game = harness({}, null, { gameSource }).window.__atlasTest;
const pigments = { Albino: 'albino', Melánico: 'melanico' };

function describe(id, species) {
  const specials = game.configuredSpecials(species);
  const pigmentation = specials.filter(label => Object.hasOwn(pigments, label));
  const dimorphism = Boolean(game.SEXUAL_DIMORPHISM[id]);
  const legendary = specials.includes('Legendario')
    ? game.LEGENDARY_SPECIMENS.find(item => item.speciesId === id)
    : null;
  if (specials.includes('Legendario')) assert.ok(legendary, id + ' · identidad legendaria');
  return { id, name: species.name, latin: species.latin, habitats: [...species.habitats],
    historicalGroup: game.taxonomyInfo(id).subClass, pigmentation, dimorphism, legendary: legendary || null };
}

function members(className) {
  return Object.entries(game.SPECIES).filter(([id]) => game.taxonomyInfo(id).className === className);
}

function birdCoverage() {
  require('../www/js/naturalist-assets-v400.js');
  const { files, routes, cutouts } = globalThis.AtlasNaturalistAssets;
  const precached = new Set(files);
  const assigned = Object.entries(require('../docs/cientifica-v460/inventario-aves.json').editions)
    .flatMap(([edition, lot]) => lot.inventory.map(bird => [bird.id, { ...bird, edition }]));
  const inventory = new Map(assigned);
  const birds = members('Aves').map(([id, species]) => {
    const actual = describe(id, species);
    const plan = inventory.get(id);
    assert.ok(plan, id + ' · sin lote o familia');
    for (const key of ['id', 'latin', 'name', 'dimorphism', 'pigmentation', 'legendary']) {
      assert.deepEqual(JSON.stringify(actual[key]), JSON.stringify(plan[key]), id + ' · ' + key);
    }
    const keys = ['normal', ...actual.pigmentation.map(label => pigments[label])];
    if (actual.dimorphism) keys.push('male', 'female');
    if (actual.legendary) keys.push('legendario');
    assert.deepEqual(Object.keys(routes[id] || {}).sort(), keys.sort(), id + ' · rutas vigentes');
    for (const key of keys) {
      const file = routes[id][key];
      const stem = key === 'legendario' ? actual.legendary.id : key;
      assert.equal(file, id + '--' + stem + '.webp');
      assert.equal(cutouts[file], true);
      for (const [surface, size] of [['field', 128], ['journal', 256], ['bestiary', 256], ['museum', 512], ['field', 64]]) {
        const plate = 'plates/' + (size === 512 ? '' : size + '/') + file;
        const resource = 'naturalist-art/' + plate;
        assert.ok(precached.has(resource) && fs.existsSync('www/' + resource), id + ' · fuera de caché');
        const markup = art.render(id, { variant: key, surface, size }, () => '');
        assert.ok(markup.includes('atlas-art-cutout') && markup.includes(plate), id + ' · ' + surface);
      }
    }
    return { ...plan, routes: routes[id] };
  }).sort((a, b) => a.latin.localeCompare(b.latin, 'en'));
  assert.equal(birds.length, assigned.length);
  const summary = { birds: birds.length, migrated: birds.length, pending: 0,
    families: new Set(birds.map(bird => bird.family)).size,
    albino: birds.filter(bird => bird.pigmentation.includes('Albino')).length,
    melanic: birds.filter(bird => bird.pigmentation.includes('Melánico')).length,
    dimorphicSpecies: birds.filter(bird => bird.dimorphism).length,
    plates: birds.reduce((sum, bird) => sum + Object.keys(bird.routes).length, 0),
    legendary: birds.flatMap(bird => bird.legendary ? [bird.legendary.name] : []) };
  return { version: require('../package.json').version, summary, birds };
}

function herpetologyPlan() {
  require('../www/js/naturalist-assets-v400.js');
  const { routes } = globalThis.AtlasNaturalistAssets;
  const editions = {
    '4.8.0': { title: 'Serpientes y lagartos', inventory: [] },
    '4.8.1': { title: 'Tortugas, crocodilianos y otros reptiles', inventory: [] },
    '4.8.2': { title: 'Anfibios', inventory: [] }
  };
  const records = Object.entries(game.SPECIES).flatMap(([id, species]) => {
    const taxon = herpetology(species.latin);
    const taxonomy = game.taxonomyInfo(id);
    if (!taxon && !['Reptilia', 'Amphibia'].includes(taxonomy.className)) return [];
    assert.equal(taxon?.className, taxonomy.className, id + ' · clase zoológica no conciliada');
    const { edition, ...classification } = taxon;
    const entry = describe(id, species);
    const expected = ['normal', ...entry.pigmentation.map(label => pigments[label])];
    if (entry.dimorphism) expected.push('male', 'female');
    if (entry.legendary) expected.push('legendario');
    const existing = routes[id] || {};
    assert.ok(Object.keys(existing).every(key => expected.includes(key)), id + ' · ruta fuera del inventario');
    const pendingPlates = expected.filter(key => !existing[key]).map(key =>
      id + '--' + (key === 'legendario' ? entry.legendary.id : key) + '.webp');
    return [{ ...entry, ...classification, edition, configuredSpecimens: [...game.configuredSpecials(species)],
      existingRoutes: existing, pendingPlates }];
  }).sort((a, b) => a.latin.localeCompare(b.latin, 'en'));
  for (const { edition, ...entry } of records) editions[edition].inventory.push(entry);
  const summarize = inventory => ({
    species: inventory.length,
    groups: Object.fromEntries([...new Set(inventory.map(sp => sp.group))].sort().map(group =>
      [group, inventory.filter(sp => sp.group === group).length])),
    families: [...new Set(inventory.map(sp => sp.family))].sort(),
    albino: inventory.filter(sp => sp.pigmentation.includes('Albino')).length,
    melanic: inventory.filter(sp => sp.pigmentation.includes('Melánico')).length,
    dimorphicSpecies: inventory.filter(sp => sp.dimorphism).length,
    legendary: inventory.flatMap(sp => sp.legendary ? [sp.legendary.name] : []),
    alreadyMigrated: inventory.filter(sp => sp.existingRoutes.normal).map(sp => sp.id),
    estimatedPlates: inventory.reduce((sum, sp) => sum + sp.pendingPlates.length, 0)
  });
  const geography = game.REGIONS.filter(region => region.continent === 'Sudamérica')
    .map(({ id, name, habitats, species }) => ({ id, name, habitats, hasFleaToad: species.includes('sa_esp_brachycephalus_pulex') }));
  return { version: require('../package.json').version, summary: summarize(records),
    editions: Object.fromEntries(Object.entries(editions).map(([edition, { title, inventory }]) =>
      [edition, { title, ...summarize(inventory), inventory }])), southAmericanRegions: geography };
}

function aquaticPlatePlan() {
  require('../www/js/naturalist-assets-v400.js');
  const { routes } = globalThis.AtlasNaturalistAssets;
  const classifyAquatic = require('./aquatic-plate-taxonomy.cjs');
  const lots = {
    condrictios: { title: 'Tiburones y rayas', review: 'Hocico, dientes y cinco a siete hendiduras branquiales en tiburones, disco y posición de las branquias en rayas.' },
    salmonidos: { title: 'Salmónidos y Remonte', review: 'Aleta adiposa, radios, pedúnculo caudal y contraste entre coloración habitual y nupcial.' },
    dulceacuicolas: { title: 'Peces dulceacuícolas y estuarinos', review: 'Barbillones, placas, línea lateral, forma de mandíbulas, aletas y patrones de escamas.' },
    arrecife: { title: 'Peces óseos de arrecife', review: 'Diversidad del perfil lateral, espinas, aletas transparentes y marcas diagnósticas en miniaturas.' },
    marinos: { title: 'Peces óseos costeros, pelágicos y de plataforma', review: 'Aletas y pínulas de pelágicos, barbillón de gadiformes y proporciones de peces luna.' },
    profundos: { title: 'Peces óseos de aguas profundas', review: 'Fotóforos, señuelos, ojos tubulares, radios alargados y piel delicada, con contraste sobre fondo de aguas profundas.' },
    cefalopodos: { title: 'Pulpos, calamares y calamar vampiro', review: 'Ocho brazos en octópodos, dos tentáculos adicionales en calamares, membranas y aletas, con margen transparente en ventosas y filamentos.' }
  };
  const records = Object.entries(game.SPECIES).flatMap(([id, species]) => {
    if (routes[id]?.normal) return [];
    const { className, subClass: historicalGroup } = game.taxonomyInfo(id);
    const { family, lot } = classifyAquatic(species.latin, className, species.habitats);
    const entry = describe(id, species);
    const variants = entry.pigmentation.map(label => pigments[label]);
    if (entry.dimorphism) variants.push('male', 'female');
    if (entry.legendary) variants.push('legendario');
    const pendingPlates = ['normal', ...variants].map(key =>
      id + '--' + (key === 'legendario' ? entry.legendary.id : key) + '.webp');
    assert.ok(!routes[id], id + ' · ruta acuática parcial inesperada');
    return [{ ...entry, className, family, historicalGroup, configuredSpecimens: [...game.configuredSpecials(species)], lot, pendingPlates }];
  }).sort((a, b) => a.latin.localeCompare(b.latin, 'en'));

  const summarize = inventory => ({
    species: inventory.length,
    families: [...new Set(inventory.map(sp => sp.family))].sort(),
    albino: inventory.filter(sp => sp.pigmentation.includes('Albino')).length,
    melanic: inventory.filter(sp => sp.pigmentation.includes('Melánico')).length,
    dimorphicSpecies: inventory.filter(sp => sp.dimorphism).length,
    legendary: inventory.filter(sp => sp.legendary).map(sp => sp.legendary),
    estimatedPlates: inventory.reduce((sum, sp) => sum + sp.pendingPlates.length, 0)
  });
  return {
    version: require('../package.json').version,
    summary: summarize(records),
    classes: Object.fromEntries([...new Set(records.map(sp => sp.className))].sort()
      .map(className => [className, records.filter(sp => sp.className === className).length])),
    lots: Object.fromEntries(Object.entries(lots).map(([lot, detail]) => {
      const inventory = records.filter(sp => sp.lot === lot).map(({ lot, ...sp }) => sp);
      return [lot, { ...detail, ...summarize(inventory), inventory }];
    }))
  };
}

if (process.argv.includes('--birds')) {
  console.log(JSON.stringify(members('Aves').map(([id, sp]) => describe(id, sp)), null, 2));
} else if (process.argv.includes('--bird-coverage')) {
  console.log(JSON.stringify(birdCoverage(), null, 2));
} else if (process.argv.includes('--aquatic-plan')) {
  console.log(JSON.stringify(aquaticPlatePlan(), null, 2));
} else if (process.argv.includes('--herpetology')) {
  console.log(JSON.stringify(herpetologyPlan(), null, 2));
} else {
  const { catalog, migrationProgress } = vm.runInNewContext(
    fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,migrationProgress});');
  const entries = new Map(catalog.map(sp => [sp.id, sp]));
  const mammals = members('Mammalia').map(([id, sp]) => {
    const animal = describe(id, sp);
    const entry = entries.get(id);
    assert.ok(entry, id + ' · registro del laboratorio');
    assert.equal(entry.name, animal.name);
    assert.equal(entry.latin, animal.latin);
    const expected = ['normal', ...animal.pigmentation.map(label => pigments[label])];
    if (animal.dimorphism) expected.push('male', 'female');
    if (animal.legendary) expected.push('legendario');
    const routes = Object.fromEntries(entry.records.map(record => [record.key, record.src]));
    assert.deepEqual(Object.keys(routes).sort(), expected.sort(), id + ' · variantes configuradas');
    for (const [key, file] of Object.entries(routes)) {
      assert.ok(file, id + ' · falta ' + key);
      if (key === 'legendario') assert.equal(file, 'plates/' + id + '--' + animal.legendary.id + '.webp');
    }
    return { ...animal, group: entry.group, family: entry.family, routes };
  }).sort((a, b) => a.latin.localeCompare(b.latin, 'en'));

  const newAquatic = mammals.flatMap(sp => {
    const taxonomy = aquaticMammal(sp.latin);
    if (!taxonomy) return [];
    const regions = game.REGIONS.filter(region => region.species.includes(sp.id))
      .map(({ id, name, habitats }) => ({ id, name, habitats }));
    const habitat = art.preferredHabitat(sp.habitats);
    assert.ok(habitat, sp.id + ' · hábitat del Bestiario');
    if (taxonomy.family === 'Iniidae') {
      assert.equal(habitat, 'rio', sp.id);
      assert.ok(regions.every(region => region.habitats.includes('rio') && !region.habitats.includes('oceano_abierto')), sp.id);
    }
    return [{ ...sp, taxonGroup: taxonomy.group, habitat, bestiaryLandscape: art.landscapeKey(habitat), regions }];
  });
  assert.equal(migrationProgress.mammalsMigrated, mammals.length);
  const summary = {
    mammalia: mammals.length,
    migrated: mammals.length,
    pending: 0,
    pigmentation: mammals.reduce((sum, sp) => sum + sp.pigmentation.length, 0),
    dimorphicSpecies: mammals.filter(sp => sp.dimorphism).length,
    legendary: mammals.filter(sp => sp.legendary).map(sp => sp.legendary.name)
  };
  console.log(JSON.stringify({ version: require('../package.json').version, summary, migrationProgress, newAquatic, mammals }, null, 2));
}
