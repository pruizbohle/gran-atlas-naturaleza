'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { harness } = require('./helpers/live-game.cjs');
const { aquaticMammal, terrestrialMammal } = require('../scripts/terrestrial-mammal-families.cjs');

const read = name => fs.readFileSync('www/js/' + name + '.js', 'utf8');
const added = ['naturalist-assets-v400', 'naturalist-art-v400'];
const legacyFixtures = require('./fixtures/stability-saves-v3240.json');
const production = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art'];
const source = [...production, ...added, 'app'].map(read).join('\n');
const art = require('../www/js/naturalist-art-v400.js');
require('../www/js/naturalist-assets-v400.js');

test('configured pigment selects its own image; ordinary frames reuse normal; exact SVG fallback', () => {
  const id = 'oc_esp_osphranter_rufus';
  const fallback = () => '<svg></svg>';
  const output = options => art.render(id, options, fallback);
  assert.match(output({ size: 64 }), /64\/oc_esp_osphranter_rufus--normal.webp/);
  for (const category of ['Notable', 'Épico', 'Excepcional']) {
    assert.equal(output({ category }).match(/src="[^"]+"/)[0], output({}).match(/src="[^"]+"/)[0]);
  }
  assert.match(output({ category: 'Notable', variant: 'albino' }), /notable[\s\S]*--albino.webp/);
  assert.equal(output({ variant: 'female' }), fallback());
  assert.equal(art.render('no-route', {}, fallback), fallback());
});

test('catalog is read from the production runtime and only known records can be routed', () => {
  const game = harness({}, null, { gameSource: source }).window.__atlasTest;
  const catalog = vm.runInNewContext(fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\ncatalog;');
  const counts = {};
  for (const sp of catalog) {
    assert.equal(sp.name, game.SPECIES[sp.id].name);
    assert.equal(sp.latin, game.SPECIES[sp.id].latin);
    assert.deepEqual([...sp.categories].sort(), ['Normal', ...(game.SPECIMEN_CATEGORIES[sp.id] || [])].sort());
    const routes = globalThis.AtlasNaturalistAssets.routes[sp.id];
    assert.equal(Object.keys(routes).length, sp.records.filter(record => record.src).length);
    for (const record of sp.records) {
      if (record.src) assert.ok(globalThis.AtlasNaturalistAssets.files.includes('naturalist-art/' + record.src));
    }
    counts[sp.group] = (counts[sp.group] || 0) + 1;
  }
  assert.deepEqual(counts, {
    Marsupiales: 29, Monotremas: 3, Felinos: 31, 'Cánidos': 28, 'Carnívoros terrestres': 51,
    Primates: 49, Ungulados: 122, Roedores: 41, Lagomorfos: 15, Murciélagos: 7,
    Eulipotiflos: 10, Armadillos: 6, 'Perezosos y osos hormigueros': 6, Pangolines: 6,
    Elefantes: 3, Damanes: 1, Tubulidentados: 1, Afrosorícidos: 1,
    Cetáceos: 28, Pinnípedos: 20, Sirenios: 2, 'Nutria marina': 1,
    Rapaces: 49, 'Marinas y costeras': 42, 'Ribereñas y humedales': 50
  });
});

test('rendering the collection does not disclose unseen art or write a save', () => {
  const game = harness({}, null, { gameSource: source });
  const a = game.window.__atlasTest;
  const id = 'oc_esp_osphranter_rufus';
  const unseen = a.specialBadges(id);
  assert.doesNotMatch(unseen, /--albino.webp/);
  a.state.specialFound[id] = { Albino: true, Notable: true };
  const before = JSON.stringify(a.state);
  assert.match(a.specialBadges(id), /--albino.webp/);
  assert.match(a.specialBadges(id), /notable[\s\S]*--normal.webp/);
  assert.equal(JSON.stringify(a.state), before);
});

test('Canidae uses exact variant routes and the original two legendary identities', () => {
  const routes = globalThis.AtlasNaturalistAssets.routes;
  const catalog = vm.runInNewContext(fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\ncatalog;');
  const canids = catalog.filter(sp => sp.family === 'Canidae');
  const ids = new Set(canids.map(sp => sp.id));
  for (const id of ['asia_esp_0246', 'af_hiena_manchada', 'af_hiena_parda']) assert.ok(!ids.has(id));
  assert.equal(canids.flatMap(sp => sp.records.filter(r => ['albino', 'melanico'].includes(r.key))).length, 23);
  assert.equal(canids.flatMap(sp => sp.records.filter(r => r.key === 'legendario')).length, 2);
  assert.equal(routes.lobo_gris.legendario, 'lobo_gris--fenrir.webp');
  assert.equal(routes.zorro_rojo.legendario, 'zorro_rojo--ascua.webp');
  assert.ok(canids.every(sp => sp.records.every(record => record.src)));
  assert.equal(new Set(canids.flatMap(sp => sp.records.map(record => record.src))).size, 53);
});

test('the six historical save fixtures read and restore identically to the current stable series 3', () => {
  const readStable = path => execFileSync('git', ['show', 'd906224533559193e87704fa44471ea73d4069c9:' + path], { encoding: 'utf8', maxBuffer: 16e6 });
  const stable = [...production.map(read), readStable('www/js/app.js')].join('\n');
  const stableSave = readStable('www/js/save-manager.js');
  class Clock extends Date { static now() { return 1700000000000; } }
  for (const fixture of legacyFixtures) {
    const raw = JSON.parse(fixture.raw);
    const old = harness({ gran_atlas_v05: fixture.raw }, null, { gameSource: stable, saveSource: stableSave, Date: Clock });
    const current = harness({ gran_atlas_v05: fixture.raw }, null, { gameSource: source, Date: Clock });
    const normalized = h => {
      const result = h.window.AtlasSaveBridge.getSaveData();
      // A missing collection ID is generated on restore for both releases.
      delete result.collectionId;
      return JSON.parse(JSON.stringify(result));
    };
    assert.deepEqual(normalized(current), normalized(old), fixture.scenario + ' open');
    old.window.AtlasSaveBridge.restoreGame(raw);
    current.window.AtlasSaveBridge.restoreGame(raw);
    assert.deepEqual(normalized(current), normalized(old), fixture.scenario + ' restore');
  }
});

test('manual and automatic encounters keep identical saved results with and without WebP presentation', () => {
  const svgSource = [...production, 'app'].map(read).join('\n');
  const bridge = '\nwindow.__atlasTest={get state(){return state},encounter,fieldEncounterModel,automaticEligibleSpecies,visibleName};\n})();';
  class Clock extends Date { static now() { return 1700000000000; } }
  const options = { bridge, Date: Clock, rng: () => 0.29 };
  const withoutArt = harness({}, null, { ...options, gameSource: svgSource }).window.__atlasTest;
  const withArt = harness({}, null, { ...options, gameSource: source }).window.__atlasTest;
  const fox = 'zorro_rojo';
  const hour = Math.floor(Clock.now() / 3600000);
  for (const game of [withoutArt, withArt]) {
    const state = game.state;
    Object.assign(state, { currentRegion: 'HX-01-09', habitat: 'bosque', season: 'primavera', time: 'amanecer' });
    state.stages[fox] = 2;
    state.discovered[fox] = true;
    game.encounter('manual', Clock.now(), true);
    assert.ok(state.lastEncounter?.entries?.length);
    const eligible = game.automaticEligibleSpecies(state.currentRegion, state.season);
    assert.ok(eligible.includes(fox));
    for (const id of eligible) if (id !== fox) state.autoHourly[hour + ':' + id] = 999;
    game.encounter('auto', Clock.now(), true);
    assert.equal(state.lastEncounter.entries[0].id, fox);
  }
  for (const key of ['lastEncounter', 'sightings', 'specialFound', 'autoHourly', 'money', 'knowledge']) {
    assert.equal(JSON.stringify(withArt.state[key]), JSON.stringify(withoutArt.state[key]), key);
  }
  assert.match(withArt.fieldEncounterModel(withArt.state.lastEncounter).entries[0].image, /zorro_rojo--normal\.webp/);
  assert.match(withoutArt.fieldEncounterModel(withoutArt.state.lastEncounter).entries[0].image, /^<svg/);
});

test('terrestrial Carnivora covers the nine present families with only the configured pigments', () => {
  const catalog = vm.runInNewContext(fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,migrationProgress});');
  const records = catalog.catalog.filter(sp => sp.group === 'Carnívoros terrestres');
  const families = Object.fromEntries([...new Set(records.map(sp => sp.family))].map(family =>
    [family, records.filter(sp => sp.family === family).length]));
  assert.deepEqual(families, {
    Ursidae: 8, Mustelidae: 24, Mephitidae: 3, Procyonidae: 3, Ailuridae: 1,
    Hyaenidae: 3, Herpestidae: 4, Viverridae: 4, Eupleridae: 1
  });
  const a = harness({}, null, { gameSource: source }).window.__atlasTest;
  assert.equal(a.LEGENDARY_SPECIMENS.length, 12);
  let total = 0;
  for (const sp of records) {
    assert.ok(!sp.dimorphism);
    assert.ok(!sp.categories.includes('Legendario'));
    assert.ok(sp.records.every(record => record.src));
    assert.deepEqual([...sp.records].slice(1).map(r => r.label).sort(),
      [...a.configuredSpecials(a.SPECIES[sp.id])].filter(label => ['Albino', 'Melánico'].includes(label)).sort());
    total += sp.records.length - 1;
  }
  assert.equal(total, 42);
  assert.ok(records.some(sp => sp.id === 'sa_esp_lontra_felina'));
  assert.ok(!records.some(sp => sp.latin.startsWith('Enhydra ')));
  assert.equal(catalog.migrationProgress.total, 997);
  assert.equal(catalog.migrationProgress.target, 1044);
});

test('biome library and transparent editions use module-specific layers and existing category routes', () => {
  const assets = globalThis.AtlasNaturalistAssets;
  const game = harness({}, null, { gameSource: source }).window.__atlasTest;
  assert.equal(assets.landscapes.length, 16);
  for (const region of game.REGIONS) for (const habitat of region.habitats) {
    assert.ok(assets.landscapes.includes(art.landscapeKey(habitat, region.id)), region.id + ' / ' + habitat);
  }
  assert.equal(art.landscapeKey('bosque', 'HX-01-09'), 'bosque');
  assert.equal(art.landscapeKey('bosque', 'HX-02-03'), 'taiga');
  assert.equal(art.landscapeKey('bosque', 'sa_amazonia'), 'selva');
  assert.equal(art.landscapeKey('bosque', 'HX-09-09'), 'sabana');
  assert.equal(art.landscapeKey('bosque', 'gm06_hudson'), 'taiga');
  assert.equal(art.landscapeKey('bosque', 'oc_costa_nordeste_australiana'), 'selva');
  assert.match(art.landscape('rio', 'HX-01-09', true), /loading="eager".*rio.webp/);
  assert.equal(art.landscape('__proto__', ''), '');
  assert.ok(assets.cutouts['nutria_europea--albino.webp']);
  const fallback = () => '<svg></svg>';
  const options = { variant: 'albino', habitat: 'rio', category: 'Notable' };
  const bestiary = art.render('nutria_europea', { ...options, surface: 'bestiary' }, fallback);
  assert.match(bestiary, /notable atlas-art-bestiary atlas-art-cutout/);
  assert.match(bestiary, /landscapes\/rio.webp[\s\S]*plates\/128\/nutria_europea--albino.webp/);
  for (const surface of ['field', 'journal', 'museum']) {
    const output = art.render('nutria_europea', { ...options, surface }, fallback);
    assert.match(output, /plates\/128\/nutria_europea--albino.webp/);
    assert.doesNotMatch(output, /atlas-art-landscape/);
  }
});

test('lab preserves the originals and reserves comparison downloads for the review cache', () => {
  const { catalog, migrationProgress } = vm.runInNewContext(
    fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,migrationProgress});');
  const { files, labFiles, cutouts } = globalThis.AtlasNaturalistAssets;
  const plates = new Map(catalog.flatMap(sp => sp.records.filter(record => record.src).map(record => [record.src, record])));
  const archived = new Set(catalog.flatMap(sp => sp.records.flatMap(record => record.previous ? [record.previous.src] : [])));
  assert.equal(archived.size, 341);
  assert.equal(plates.size, migrationProgress.plates);
  assert.equal(migrationProgress.migrated, 602);
  assert.equal(migrationProgress.classical, migrationProgress.target);
  assert.equal(migrationProgress.plates, migrationProgress.target);
  assert.equal(migrationProgress.cutouts, Object.keys(cutouts).length);
  assert.equal(migrationProgress.cutouts, plates.size);
  const samples = [...plates.values()].filter(plate => Object.keys(plate.compression).length);
  assert.equal(samples.length, 10);
  for (const record of plates.values()) {
    assert.equal(record.cutout, Boolean(cutouts[record.src.slice('plates/'.length)]));
    if (record.before) assert.ok(labFiles.includes('naturalist-art/' + record.before.src));
    if (record.previous) assert.ok(labFiles.includes('naturalist-art/' + record.previous.src));
  }
  for (const sample of samples) {
    assert.deepEqual(Object.keys(sample.compression), ['75', '80', '85', '90', '95']);
    for (const { src } of Object.values(sample.compression)) assert.ok(labFiles.includes('naturalist-art/' + src));
  }
  assert.ok(labFiles.every(file => !files.includes(file)));
});

test('ungulates come from the existing catalogue and use only configured variants', () => {
  const { catalog } = vm.runInNewContext(fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog});');
  const game = harness({}, null, { gameSource: source }).window.__atlasTest;
  const ungulates = catalog.filter(sp => sp.group === 'Ungulados');
  const preliminary = fs.readFileSync('docs/naturalista-v430/ungulados-candidatos.tsv', 'utf8').trim().split('\n').slice(1);
  const additional = ['eu_esp_0626', 'eu_esp_0627', 'sa_esp_pudella_mephistophiles', 'sa_esp_pudu_puda'];
  assert.deepEqual(Array.from(ungulates, sp => sp.id).sort(), [...preliminary.map(row => row.split('\t')[0]), ...additional].sort());
  for (const sp of ungulates) {
    const pigments = { Albino: 'albino', 'Melánico': 'melanico' };
    const variants = game.configuredSpecials(game.SPECIES[sp.id]).flatMap(label => pigments[label] ? [pigments[label]] : []);
    if (game.SEXUAL_DIMORPHISM[sp.id]) variants.push('male', 'female');
    assert.deepEqual(Array.from(sp.records, record => record.key).sort(), ['normal', ...variants].sort(), sp.id);
    assert.ok(sp.records.every(record => !record.previous), sp.id);
    assert.match(sp.sprite, /^<svg[\s>]/, sp.id);
    const routes = globalThis.AtlasNaturalistAssets.routes[sp.id];
    if (routes.female) assert.notEqual(routes.female, routes.male);
  }
});

test('the mammal audit completes each configured route and keeps Inia in freshwater', () => {
  const game = harness({}, null, { gameSource: source }).window.__atlasTest;
  const { routes, cutouts } = globalThis.AtlasNaturalistAssets;
  const mammalia = Object.entries(game.SPECIES).filter(([id]) => game.taxonomyInfo(id).className === 'Mammalia');
  const terrestrial = mammalia.filter(([, sp]) => terrestrialMammal(sp.latin));
  const aquatic = mammalia.filter(([, sp]) => aquaticMammal(sp.latin));
  assert.equal(mammalia.length, 461);
  assert.equal(terrestrial.length, 97);
  assert.equal(aquatic.length, 51);
  const earlier = require('../docs/cientifica-v450/inventario.json');
  assert.deepEqual(aquatic.map(([id]) => id).sort(), earlier.aquaticForV460.map(sp => sp.id).sort());
  assert.equal(aquatic.flatMap(([, sp]) => Array.from(game.configuredSpecials(sp)))
    .filter(label => ['Albino', 'Melánico'].includes(label)).length, 6);
  const pigments = { Albino: 'albino', 'Melánico': 'melanico' };
  const legendaryRoutes = [];
  for (const [id, sp] of mammalia) {
    const variants = [...game.configuredSpecials(sp)].flatMap(label => pigments[label] ? [pigments[label]] : []);
    if (game.SEXUAL_DIMORPHISM[id]) variants.push('male', 'female');
    const legendary = game.LEGENDARY_SPECIMENS.find(item => item.speciesId === id);
    if (legendary) {
      variants.push('legendario');
      assert.equal(routes[id].legendario, id + '--' + legendary.id + '.webp');
      legendaryRoutes.push(legendary.name);
    }
    assert.deepEqual(Object.keys(routes[id]).sort(), ['normal', ...variants].sort(), id);
    for (const file of Object.values(routes[id])) assert.equal(cutouts[file], true, file);
  }
  assert.deepEqual(legendaryRoutes.sort(), ['Atlas', 'Ascua', 'Fenrir', 'Niebla', 'Silverback', 'Ámbar'].sort());
  for (const id of ['sa_esp_inia_boliviensis', 'sa_esp_inia_geoffrensis']) {
    const habitat = art.preferredHabitat(game.SPECIES[id].habitats);
    assert.equal(habitat, 'rio');
    assert.match(art.render(id, { surface: 'bestiary', habitat }, () => ''), /landscapes\/rio\.webp/);
    assert.equal(art.landscapeKey(habitat, 'sa_amazonia'), 'rio');
  }
  const seaHabitat = { costa_marina: 'costa', arrecife: 'arrecife', plataforma_marina: 'oceano',
    oceano_abierto: 'oceano', columna_batial: 'profundidades', agua_polar: 'polar' };
  for (const [habitat, landscape] of Object.entries(seaHabitat)) assert.equal(art.landscapeKey(habitat), landscape);
  const atlas = routes.af_elefante_sabana;
  assert.equal(atlas.legendario, 'af_elefante_sabana--atlas.webp');
  assert.notDeepEqual(fs.readFileSync('www/naturalist-art/plates/' + atlas.legendario),
    fs.readFileSync('www/naturalist-art/plates/' + atlas.normal));
  assert.match(art.render('af_elefante_sabana', { variant: 'legendario', category: 'Legendario' }, () => ''),
    /legendary[\s\S]*--atlas\.webp/);
});

test('bird routes match both released inventories, with distinct dimorphism and Centinela plates', () => {
  const game = harness({}, null, { gameSource: source }).window.__atlasTest;
  const plan = require('../docs/cientifica-v460/inventario-aves.json');
  const expected = Object.entries(game.SPECIES).filter(([id]) => game.taxonomyInfo(id).className === 'Aves');
  const assigned = Object.values(plan.editions).flatMap(lot => lot.inventory);
  const aquatic = plan.editions['4.7.1'].inventory;
  const released = new Set([...plan.editions['4.7.0'].inventory, ...aquatic].map(sp => sp.id));
  const { routes, cutouts, landscapes, bestiaryHabitats } = globalThis.AtlasNaturalistAssets;
  const cat = vm.runInNewContext(fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') +
    '\n({catalog,birdComparisons,migrationProgress});');
  assert.deepEqual(assigned.map(sp => sp.id).sort(), expected.map(([id]) => id).sort());
  assert.equal(plan.summary.estimatedPlates, 496);
  for (const sp of assigned) {
    assert.equal(sp.latin, game.SPECIES[sp.id].latin);
    assert.equal(sp.dimorphism, Boolean(game.SEXUAL_DIMORPHISM[sp.id]));
    assert.deepEqual(sp.pigmentation, [...game.configuredSpecials(game.SPECIES[sp.id])]
      .filter(label => ['Albino', 'Melánico'].includes(label)));
    if (!released.has(sp.id)) {
      assert.equal(routes[sp.id], undefined, sp.id);
      continue;
    }
    const entry = cat.catalog.find(item => item.id === sp.id);
    assert.equal(entry.order, sp.order);
    assert.equal(entry.family, sp.family);
    assert.equal(entry.group, sp.wave || 'Rapaces');
    const keys = ['normal', ...sp.pigmentation.map(label => label === 'Albino' ? 'albino' : 'melanico')];
    if (sp.dimorphism) keys.push('male', 'female');
    if (sp.legendary) keys.push('legendario');
    assert.deepEqual(Object.keys(routes[sp.id]).sort(), keys.sort(), sp.id);
    for (const file of Object.values(routes[sp.id])) assert.equal(cutouts[file], true, file);
    if (sp.dimorphism) {
      const plates = ['normal', 'male', 'female'].map(key =>
        fs.readFileSync('www/naturalist-art/plates/' + routes[sp.id][key]).toString('base64'));
      assert.equal(new Set(plates).size, 3, sp.id);
    }
  }
  assert.equal(cat.migrationProgress.birdsMigrated, 141);
  assert.equal(cat.migrationProgress.biological, 457);
  assert.equal(cat.migrationProgress.legendary, 7);
  for (const [wave, count] of [['Marinas y costeras', 50], ['Ribereñas y humedales', 94]]) {
    const files = aquatic.filter(sp => sp.wave === wave).flatMap(sp => Object.values(routes[sp.id]));
    assert.equal(new Set(files).size, count, wave);
  }
  const aquaticIds = new Set(aquatic.map(sp => sp.id));
  for (const [id, habitat] of Object.entries(bestiaryHabitats)) {
    assert.ok(aquaticIds.has(id) && landscapes.includes(art.landscapeKey(habitat)), id);
  }
  const options = { habitat: 'bosque', size: 64, variant: 'female' };
  assert.match(art.render('eu_esp_0649', { ...options, surface: 'bestiary' }), /landscapes\/humedal.webp/);
  assert.doesNotMatch(art.render('eu_esp_0649', { ...options, surface: 'field' }), /atlas-art-landscape/);
  const centinela = plan.editions['4.7.0'].inventory.find(sp => sp.id === 'aguila_real');
  assert.equal(centinela.legendary.id, 'centinela');
  assert.equal(centinela.legendaryFile, 'aguila_real--centinela.webp');
  assert.equal(routes.aguila_real.legendario, centinela.legendaryFile);
  assert.notDeepEqual(fs.readFileSync('www/naturalist-art/plates/' + routes.aguila_real.normal),
    fs.readFileSync('www/naturalist-art/plates/' + routes.aguila_real.legendario));
  const condor = routes.sa_esp_vultur_gryphus;
  assert.equal(new Set([condor.normal, condor.male, condor.female]).size, 3);
  assert.notDeepEqual(fs.readFileSync('www/naturalist-art/plates/' + condor.male),
    fs.readFileSync('www/naturalist-art/plates/' + condor.female));
  assert.equal(Object.keys(cat.birdComparisons).length, 26);
  for (const set of Object.values(cat.birdComparisons)) {
    assert.ok(set.birds.length >= 2 && set.birds.every(bird => released.has(bird.id) && bird.trait));
  }
});

test('Primates includes the fourteen zoological families, all configured variants and only Silverback', () => {
  const { catalog } = vm.runInNewContext(fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog});');
  const primates = catalog.filter(sp => sp.group === 'Primates');
  const game = harness({}, null, { gameSource: source }).window.__atlasTest;
  const expectedFamilies = {
    Aotidae: 1, Atelidae: 7, Callitrichidae: 2, Cebidae: 3, Cercopithecidae: 17,
    Cheirogaleidae: 1, Daubentoniidae: 1, Galagidae: 1, Hominidae: 6, Hylobatidae: 3,
    Indriidae: 2, Lemuridae: 2, Lorisidae: 1, Tarsiidae: 2
  };
  const families = Object.fromEntries(Object.keys(expectedFamilies).map(family =>
    [family, primates.filter(sp => sp.family === family).length]));
  assert.deepEqual(families, expectedFamilies);
  const seen = new Set(primates.map(sp => sp.id));
  for (const id of ['asia_esp_0858', 'asia_esp_0859', 'sa_esp_saguinus_imperator', 'gm06_saguinus_geoffroyi',
    'sa_esp_aotus_trivirgatus', 'gm06_pongo_abelii', 'af_xlsx_bonobo']) assert.ok(seen.has(id));
  assert.equal(primates.flatMap(sp => sp.records).length, 96);
  for (const sp of primates) {
    const special = game.configuredSpecials(game.SPECIES[sp.id]);
    const keys = ['normal'];
    if (game.SEXUAL_DIMORPHISM[sp.id]) keys.push('male', 'female');
    if (special.includes('Albino')) keys.push('albino');
    if (special.includes('Melánico')) keys.push('melanico');
    if (special.includes('Legendario')) keys.push('legendario');
    assert.deepEqual(Array.from(sp.records, record => record.key), keys);
    assert.ok(sp.records.every(record => record.src && record.cutout));
  }
  const routes = globalThis.AtlasNaturalistAssets.routes;
  assert.equal(routes.af_gorila_montana.legendario, 'af_gorila_montana--silverback.webp');
  assert.notDeepEqual(fs.readFileSync('www/naturalist-art/plates/' + routes.af_gorila_montana.legendario),
    fs.readFileSync('www/naturalist-art/plates/' + routes.af_gorila_montana.normal));
  assert.equal(game.LEGENDARY_SPECIMENS.find(specimen => specimen.id === 'silverback').name, 'Silverback');
});
