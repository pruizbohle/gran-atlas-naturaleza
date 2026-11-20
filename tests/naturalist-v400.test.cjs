'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { harness } = require('./helpers/live-game.cjs');
const { aquaticMammal, terrestrialMammal } = require('../scripts/terrestrial-mammal-families.cjs');

const read = name => fs.readFileSync('www/js/' + name + '.js', 'utf8');
const readRevision = (rev, path) => execFileSync('git', ['show', rev + ':' + path], { encoding: 'utf8', maxBuffer: 16e6 });
const added = ['naturalist-assets-v400', 'naturalist-art-v400'];
const legacyFixtures = require('./fixtures/stability-saves-v3240.json');
const production = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art', 'gm07-a04/catalog'];
const historicalSource = [...production, ...added, 'app'].map(read).join('\n');
const currentProduction = [...production.slice(0, -1), 'gm07-p04/catalog', production.at(-1)];
const source = [...currentProduction, ...added, 'app'].map(read).join('\n');
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
    Primates: 49, Ungulados: 122, Roedores: 41, Lagomorfos: 15, Murciélagos: 8,
    Eulipotiflos: 10, Armadillos: 7, 'Perezosos y osos hormigueros': 6, Pangolines: 6,
    Elefantes: 3, Damanes: 1, Tubulidentados: 1, Afrosorícidos: 1,
    Cetáceos: 28, Pinnípedos: 20, Sirenios: 2, 'Nutria marina': 1,
    Rapaces: 49, 'Marinas y costeras': 42, 'Ribereñas y humedales': 50,
    'Corredoras y paleognatas': 9, Galliformes: 24, 'Otras aves terrestres': 6,
    'Arborícolas y otros no paseriformes': 62, Paseriformes: 45, Anfibios: 35, 'Tiburones y rayas': 18, 'Salmónidos': 8, 'Peces dulceacuícolas y estuarinos': 23, 'Peces de arrecife': 12, 'Peces de aguas profundas': 14, 'Peces marinos': 16, Cefalópodos: 20, Serpientes: 36, Lagartos: 42, Tortugas: 12, Crocodilianos: 13, Rincocéfalos: 1
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
  const readStable = path => readRevision('d906224533559193e87704fa44471ea73d4069c9', path);
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
      // V5.0.1 adds two default fields only. Assert those defaults and compare every historical field.
      if (h === current) {
        assert.deepEqual(Array.from(result.autoPending), []);
        assert.equal(result.autoRemainder, 0);
        delete result.autoPending;
        delete result.autoRemainder;
      }
      return JSON.parse(JSON.stringify(result));
    };
    assert.deepEqual(normalized(current), normalized(old), fixture.scenario + ' open');
    old.window.AtlasSaveBridge.restoreGame(raw);
    current.window.AtlasSaveBridge.restoreGame(raw);
    assert.deepEqual(normalized(current), normalized(old), fixture.scenario + ' restore');
  }
});

test('manual and automatic encounters keep identical saved results with and without WebP presentation', () => {
  const svgSource = [...currentProduction, 'app'].map(read).join('\n');
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
  assert.equal(catalog.migrationProgress.total, 1000);
  assert.equal(catalog.migrationProgress.target, 1672);
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
  assert.equal(migrationProgress.migrated, 1000);
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
  assert.equal(mammalia.length, 463);
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

test('bird routes match the released inventories, with distinct dimorphism and Centinela plates', () => {
  const game = harness({}, null, { gameSource: source }).window.__atlasTest;
  const plan = require('../docs/cientifica-v460/inventario-aves.json');
  const expected = Object.entries(game.SPECIES).filter(([id]) => game.taxonomyInfo(id).className === 'Aves');
  const assigned = Object.values(plan.editions).flatMap(lot => lot.inventory);
  const aquatic = plan.editions['4.7.1'].inventory;
  const terrestrial = plan.editions['4.7.2'].inventory;
  const terrestrialIds = new Set(terrestrial.map(sp => sp.id));
  const arboreal = plan.editions['4.7.3'].inventory;
  const arborealIds = new Set(arboreal.map(sp => sp.id));
  const passerines = plan.editions['4.7.4'].inventory;
  const passerineIds = new Set(passerines.map(sp => sp.id));
  const released = new Set(assigned.map(sp => sp.id));
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
    const entry = cat.catalog.find(item => item.id === sp.id);
    assert.equal(entry.order, sp.order);
    assert.equal(entry.family, sp.family);
    if (arborealIds.has(sp.id)) {
      assert.equal(entry.group, sp.order === 'Passeriformes' ? 'Paseriformes' : 'Arborícolas y otros no paseriformes');
      assert.equal(entry.edition, '4.7.3');
    } else if (passerineIds.has(sp.id)) {
      assert.equal(entry.group, 'Paseriformes');
      assert.equal(entry.edition, '4.7.4');
    } else if (terrestrialIds.has(sp.id)) {
      if (sp.order === 'Galliformes') assert.equal(entry.group, 'Galliformes');
      else assert.ok(['Corredoras y paleognatas', 'Otras aves terrestres'].includes(entry.group));
    } else assert.equal(entry.group, sp.wave || 'Rapaces');
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
  assert.equal(cat.migrationProgress.birds, 287);
  assert.equal(cat.migrationProgress.birdsMigrated, 287);
  assert.equal(cat.migrationProgress.biological, 682);
  assert.equal(cat.migrationProgress.legendary, 12);
  for (const [wave, count] of [['Marinas y costeras', 50], ['Ribereñas y humedales', 94]]) {
    const files = aquatic.filter(sp => sp.wave === wave).flatMap(sp => Object.values(routes[sp.id]));
    assert.equal(new Set(files).size, count, wave);
  }
  const landFiles = new Set(terrestrial.flatMap(sp => Object.values(routes[sp.id])));
  assert.equal(landFiles.size, 83);
  assert.equal(terrestrial.filter(sp => sp.dimorphism).length, 12);
  assert.equal([...landFiles].filter(file => file.endsWith('--albino.webp')).length, 12);
  assert.equal([...landFiles].filter(file => file.endsWith('--melanico.webp')).length, 8);
  const arborealFiles = new Set(arboreal.flatMap(sp => Object.values(routes[sp.id])));
  assert.equal(arborealFiles.size, 93);
  assert.equal(arboreal.filter(sp => sp.dimorphism).length, 4);
  assert.equal([...arborealFiles].filter(file => file.endsWith('--albino.webp')).length, 15);
  assert.equal([...arborealFiles].filter(file => file.endsWith('--melanico.webp')).length, 7);
  assert.equal(passerines.length, 44);
  assert.equal(new Set(passerines.map(sp => sp.family)).size, 26);
  const passerineFiles = new Set(passerines.flatMap(sp => Object.values(routes[sp.id])));
  assert.equal(passerineFiles.size, 90);
  assert.equal(passerines.filter(sp => sp.dimorphism).length, 12);
  assert.equal([...passerineFiles].filter(file => file.endsWith('--albino.webp')).length, 9);
  assert.equal([...passerineFiles].filter(file => file.endsWith('--melanico.webp')).length, 13);
  assert.equal(new Set(assigned.flatMap(sp => Object.values(routes[sp.id]))).size, 496);
  assert.ok(arborealIds.has('sa_esp_scelorchilus_rubecula'));
  assert.ok(!passerineIds.has('sa_esp_scelorchilus_rubecula'));
  assert.deepEqual(routes.sa_esp_brachycephalus_pulex, { normal: 'sa_esp_brachycephalus_pulex--normal.webp' });
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
  assert.equal(Object.keys(cat.birdComparisons).length, 62);
  for (const set of Object.values(cat.birdComparisons)) {
    assert.ok(set.birds.length >= 2 && set.birds.every(bird => released.has(bird.id) && bird.trait));
    for (const { id, plateKey } of set.birds) {
      if (plateKey) assert.ok(routes[id][plateKey], id + ' · ' + plateKey);
    }
  }
});

test('all 104 reptiles and 35 amphibians resolve to their configured categories and the four registered legends', () => {
  const audit = JSON.parse(execFileSync(process.execPath, ['scripts/audit-scientific-catalog.cjs', '--herpetology'], { encoding: 'utf8' }));
  const previous = require('../docs/cientifica-v474/inventario-herpetologia.json');
  const squamates = audit.editions['4.8.0'];
  const finalLot = audit.editions['4.8.1'];
  const amphibianLot = audit.editions['4.8.2'];
  const { catalog, reptileComparisons, amphibianComparisons, migrationProgress } = vm.runInNewContext(
    fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,reptileComparisons,amphibianComparisons,migrationProgress});');
  const { files, cutouts, routes } = globalThis.AtlasNaturalistAssets;
  const runtime = harness({}, null, { gameSource: source }).window.__atlasTest;
  assert.equal(audit.summary.species, 139);
  assert.equal(audit.summary.estimatedPlates, 0);
  assert.equal(squamates.species, 78);
  assert.equal(squamates.families.length, 20);
  assert.deepEqual(squamates.groups, { Lagartos: 42, Serpientes: 36 });
  assert.equal(squamates.albino, 28);
  assert.equal(squamates.melanic, 20);
  assert.equal(finalLot.species, 26);
  assert.equal(finalLot.families.length, 8);
  assert.deepEqual(finalLot.groups, { Crocodilianos: 13, Rincocéfalos: 1, Tortugas: 12 });
  assert.equal(finalLot.albino, 10);
  assert.equal(finalLot.melanic, 8);
  assert.equal(amphibianLot.species, 35);
  assert.equal(amphibianLot.families.length, 18);
  assert.equal(amphibianLot.albino, 11);
  assert.equal(amphibianLot.melanic, 6);
  assert.deepEqual(amphibianLot.groups, { 'Ranas y sapos': 23, 'Salamandras y tritones': 12 });
  assert.equal(migrationProgress.amphibians, 35);
  assert.equal(migrationProgress.amphibiansMigrated, 35);
  assert.deepEqual(audit.southAmericanRegions, previous.southAmericanRegions);
  assert.equal(migrationProgress.reptiles, 104);
  assert.equal(migrationProgress.reptilesMigrated, 104);

  const unique = new Set();
  for (const [edition, lot, count] of [['4.8.0', squamates, 128], ['4.8.1', finalLot, 46], ['4.8.2', amphibianLot, 52]]) {
    const priorLot = previous.editions[edition];
    assert.equal(lot.dimorphicSpecies, 0);
    assert.equal(lot.estimatedPlates, 0);
    assert.deepEqual(lot.legendary, priorLot.legendary);
    assert.equal(lot.inventory.flatMap(animal => Object.values(animal.existingRoutes)).length, count);
    for (const [index, animal] of lot.inventory.entries()) {
      const past = priorLot.inventory[index];
      const { pendingPlates, existingRoutes, ...zoology } = animal;
      const { pendingPlates: expected, existingRoutes: oldRoutes, ...unchanged } = past;
      assert.deepEqual(zoology, unchanged);
      assert.deepEqual(pendingPlates, []);
      assert.deepEqual(Object.values(existingRoutes).sort(), [...expected, ...Object.values(oldRoutes)].sort());
      assert.deepEqual(existingRoutes, routes[animal.id]);
      const labRecord = catalog.find(sp => sp.id === animal.id);
      assert.equal(labRecord.group, edition === '4.8.2' ? 'Anfibios' : animal.group);
      assert.equal(labRecord.family, animal.family);
      assert.equal(labRecord.edition, animal.id === 'sa_esp_brachycephalus_pulex' ? '4.7.3' : edition);
      assert.ok(runtime.REGIONS.some(region => region.species.includes(animal.id) &&
        zoneSupports(region, animal.habitats)), animal.id + ' · zona compatible');

      for (const [key, file] of Object.entries(existingRoutes)) {
        assert.equal(cutouts[file], true);
        unique.add(file);
        for (const size of ['', '64/', '128/', '256/']) {
          assert.ok(files.includes('naturalist-art/plates/' + size + file));
        }
        for (const surface of ['field', 'journal', 'bestiary', 'museum']) {
          const frame = art.render(animal.id, { variant: key, surface, habitat: animal.habitats[0] }, () => '');
          assert.ok(frame.includes('atlas-art-' + surface + ' atlas-art-cutout') && frame.includes(file), animal.id + ' · ' + surface);
        }
      }
    }
  }
  assert.equal(unique.size, 226);
  assert.equal(Object.keys(amphibianComparisons).length, 9);
  assert.equal(amphibianComparisons.axolotl.amphibians[1].plateKey, 'albino');
  assert.deepEqual(Array.from(amphibianComparisons['frog-sizes'].amphibians, item => item.id),
    ['sa_esp_brachycephalus_pulex', 'af_xlsx_rana_goliat']);
  for (const [set, id, legendary] of [
    ['basalto', 'asia_esp_0527', 'basalto'], ['seda', 'asia_esp_0373', 'seda'],
    ['junco', 'af_cocodrilo_nilo', 'junco'], ['ancora', 'af_tortuga_aldabra', 'ancora']
  ]) {
    assert.equal(routes[id].legendario, id + '--' + legendary + '.webp');
    assert.notDeepEqual(fs.readFileSync('www/naturalist-art/plates/' + routes[id].normal),
      fs.readFileSync('www/naturalist-art/plates/' + routes[id].legendario));
    assert.equal(reptileComparisons[set].reptiles[1].plateKey, 'legendario');
    assert.match(art.render(id, { variant: 'legendario', category: 'Legendario' }, () => ''), / atlas-art-frame legendary|class="atlas-art-frame legendary/);
  }
  assert.equal(Object.keys(reptileComparisons).length, 22);
  assert.equal(catalog.find(sp => sp.id === 'oc_esp_sphenodon_punctatus').order, 'Rhynchocephalia');
});

test('visual exceptions preserve image paths, dimensions, backgrounds and halo categories', () => {
  const scales = {
    sa_esp_brachycephalus_pulex: 0.25, gm06_mellisuga_helenae: 0.5,
    asia_esp_craseonycteris_thonglongyai: 0.35, sa_esp_chlamyphorus_truncatus: 0.40
  };
  const assets = globalThis.AtlasNaturalistAssets;
  assert.deepEqual(assets.visualScales, scales);
  for (const [id, scale] of Object.entries(scales)) {
    assert.equal(art.visualScale(id), scale);
    for (const surface of ['field', 'journal', 'bestiary', 'museum', 'plain']) {
      const options = { surface, category: 'Notable', habitat: 'bosque', size: 128 };
      const displayed = art.render(id, options, () => '');
      const fullSize = art.render(id, { ...options, fullSize: true }, () => '');
      const style = ' style="--art-visual-transform:scale(' + scale + ')"';
      assert.ok(displayed.includes(style), id + ' · ' + surface);
      assert.match(displayed, /atlas-art-frame notable/);
      assert.equal(displayed.replace(style, ''), fullSize);
      assert.ok(displayed.includes('plates/128/' + assets.routes[id].normal));
    }
  }
  const other = 'af_tortuga_aldabra';
  assert.equal(art.visualScale(other), 1);
  assert.equal(art.visualScale('missing'), 1);
  assert.doesNotMatch(art.render(other, {}, () => ''), /--art-visual-transform/);
});

function zoneSupports(region, habitats) {
  return habitats.some(habitat => region.habitats.includes(habitat) && art.landscapeKey(habitat, region.id));
}

test('the V4.7.3 records keep the existing chucao identity, prior saves and region requirements', () => {
  const baseline = '89c8c6ba852cf1f8a43b5af00e644ecacb357ec2';
  const legacySource = production.filter(name => name !== 'gm07-a04/catalog').map(read).join('\n') + '\n' +
    execFileSync('git', ['show', baseline + ':www/js/app.js'], { encoding: 'utf8', maxBuffer: 4e6 });
  const old = harness({}, null, { gameSource: legacySource }).window.__atlasTest;
  const prev = JSON.parse(JSON.stringify(old.initialState()));
  const bird = 'sa_esp_scelorchilus_rubecula';
  const frog = 'sa_esp_brachycephalus_pulex';
  Object.assign(prev, {
    currentRegion: 'sa_patagonia_y_tierra_del_fuego', habitat: 'bosque', prestige: 227,
    money: 8200, knowledge: 1200
  });
  prev.regionUnlocked[prev.currentRegion] = true;
  prev.discovered[bird] = true;
  prev.sightings[bird] = 19;
  prev.stages[bird] = 3;
  const saved = JSON.stringify(prev);
  const normalized = harness({ gran_atlas_v05: saved }, null, { gameSource: legacySource }).window.AtlasSaveBridge.getSaveData();
  const next = harness({ gran_atlas_v05: saved }, null, { gameSource: historicalSource }).window;
  const after = next.AtlasSaveBridge.getSaveData();
  const game = next.__atlasTest;
  const clone = item => JSON.parse(JSON.stringify(item));
  assert.equal(Object.keys(old.SPECIES).length, 997);
  assert.equal(Object.keys(game.SPECIES).length, 998);
  assert.deepEqual(Object.keys(game.SPECIES).filter(id => !Object.hasOwn(old.SPECIES, id)), [frog]);
  for (const id of Object.keys(old.SPECIES)) assert.deepEqual(clone(game.SPECIES[id]), clone(old.SPECIES[id]), id);
  for (const key of ['currentRegion', 'regionUnlocked', 'discovered', 'sightings', 'stages', 'money', 'knowledge', 'prestige']) {
    assert.deepEqual(clone(after[key]), clone(normalized[key]), key);
  }
  const { records } = require('../www/js/gm07-a04/catalog.js');
  assert.equal(game.REGIONS.length, old.REGIONS.length);
  for (const region of old.REGIONS) {
    const expected = clone(region);
    for (const [id, record] of Object.entries(records)) if (record.region === region.id) expected.species.push(id);
    assert.deepEqual(clone(game.REGIONS.find(r => r.id === region.id)), expected, region.id);
  }
  assert.equal(records[frog].zoologicalRecord.minimumMm, 6.45);
  assert.equal(records[frog].reference.url, 'https://doi.org/10.1111/zsc.12654');
  assert.deepEqual(clone(game.taxonomyInfo(bird)), records[bird].taxonomy);
  assert.deepEqual(clone(game.taxonomyInfo(frog)), records[frog].taxonomy);
});

test('catalog additions can be discovered, researched, published and exhibited through the normal game', () => {
  const records = { ...require('../www/js/gm07-a04/catalog.js').records, ...require('../www/js/gm07-p04/catalog.js').records };
  const now = Date.now();
  for (const [id, rec] of Object.entries(records)) {
    let rolls = [];
    const { window } = harness({}, null, { gameSource: source, rng: () => rolls.shift() ?? 0.5 });
    const game = window.__atlasTest;
    const state = game.state;
    state.currentRegion = rec.region;
    state.regionUnlocked[rec.region] = true;
    state.habitat = rec.species?.habitats[0] || 'bosque';
    state.time = rec.species?.times.at(-1) || 'dia';
    state.season = 'primavera';
    state.societyView = 'publications';
    state.publicationView = 'monographs';
    assert.equal(game.eligibleSpecies(rec.region, state.habitat, state.time, state.season).at(-1), id);
    assert.ok(!game.eligibleSpecies(rec.region, 'rio', 'dia', 'primavera').includes(id));
    assert.ok(game.automaticEligibleSpecies(rec.region, 'primavera').includes(id));
    assert.ok(!state.discovered[id]);
    rolls = [0.01, 0.99999];
    game.encounter('manual', now);
    assert.equal(state.lastEncounter.entries[0].id, id);
    assert.equal(state.discovered[id], true);
    assert.equal(state.sightings[id], 1);
    assert.doesNotMatch(game.renderSociety(), /species-monograph/);

    state.helpers = 3;
    const hour = Math.floor(now / 3600000);
    for (const candidate of game.automaticEligibleSpecies(rec.region, 'primavera')) {
      if (candidate !== id) state.autoHourly[hour + ':' + candidate] = 999;
    }
    rolls = [0.01, 0.5];
    game.encounter('auto', now);
    assert.equal(state.sightings[id], 2);
    assert.equal(state.autoHourly[hour + ':' + id], 1);

    state.money = 50000;
    state.knowledge = 50000;
    state.sightings[id] = 500;
    state.feedObs[id] = 20;
    state.specialSeen[id] = 1;
    for (let step = 0; step < 5; step++) game.advanceSpecies(id);
    assert.equal(state.stages[id], 5);
    const prestige = state.prestige;
    game.publishMonograph(id);
    game.publishMonograph(id);
    assert.equal(state.prestige, prestige + 1);
    assert.equal(state.published[id], true);
    assert.ok(game.renderSociety().includes(rec.reference.url));
    game.exhibitAnimal(id);
    assert.equal(state.museum.exhibits[id], true);
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


test('the 18 cartilaginous fishes retain their configured pigmentation, habitats and transparent plates', () => {
  const initial = require('../docs/cientifica-v482/inventario-v49.json').lots.condrictios;
  const { catalog, migrationProgress, cartilaginousComparisons } = vm.runInNewContext(
    fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,migrationProgress,cartilaginousComparisons});');
  const runtime = harness({}, null, { gameSource: source }).window.__atlasTest;
  const { routes, cutouts, files } = globalThis.AtlasNaturalistAssets;
  const resources = new Set(files);
  const configured = Object.entries(runtime.SPECIES).filter(([id]) => runtime.taxonomyInfo(id).className === 'Chondrichthyes');
  assert.deepEqual(configured.map(([id]) => id).sort(), initial.inventory.map(animal => animal.id).sort());
  assert.equal(migrationProgress.cartilaginousMigrated, 18);
  assert.equal(migrationProgress.cartilaginous, 18);
  let count = 0;
  for (const animal of initial.inventory) {
    const { id, family, habitats, pendingPlates } = animal;
    const live = runtime.SPECIES[id];
    const lab = catalog.find(species => species.id === id);
    assert.equal(live.latin, animal.latin);
    assert.deepEqual([...live.habitats], habitats);
    assert.ok(runtime.REGIONS.some(region => region.species.includes(id) && zoneSupports(region, habitats)), id);
    assert.deepEqual([...runtime.configuredSpecials(live)], animal.configuredSpecimens);
    assert.equal(lab.family, family);
    assert.equal(lab.edition, '4.9.0');
    assert.deepEqual(Object.values(routes[id]).sort(), pendingPlates.slice().sort());
    for (const [variant, file] of Object.entries(routes[id])) {
      count += 1;
      assert.equal(cutouts[file], true);
      for (const size of ['', '64/', '128/', '256/']) assert.ok(resources.has('naturalist-art/plates/' + size + file));
      for (const surface of ['field', 'journal', 'bestiary', 'museum']) {
        const markup = art.render(id, { variant, surface, habitat: habitats[0] }, () => '');
        assert.ok(markup.includes('atlas-art-' + surface + ' atlas-art-cutout') && markup.includes(file));
      }
    }
  }
  assert.equal(count, 21);
  assert.equal(Object.keys(cartilaginousComparisons).length, 8);
});


test('all salmonids have their configured plates and Remonte completes the unchanged twelve legends', () => {
  const initial = require('../docs/cientifica-v490/inventario-pendiente.json').lots.salmonidos;
  const { catalog, migrationProgress, salmonidComparisons, legendaryComparisons } = vm.runInNewContext(
    fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,migrationProgress,salmonidComparisons,legendaryComparisons});');
  const { routes, cutouts, files } = globalThis.AtlasNaturalistAssets;
  const runtime = harness({}, null, { gameSource: source }).window.__atlasTest;
  const classify = require('../scripts/aquatic-plate-taxonomy.cjs');
  const inGame = Object.entries(runtime.SPECIES).filter(([id, sp]) => {
    const className = runtime.taxonomyInfo(id).className;
    return className === 'Actinopterygii' && classify(sp.latin, className, sp.habitats).family === 'Salmonidae';
  });
  assert.deepEqual(inGame.map(([id]) => id).sort(), initial.inventory.map(animal => animal.id).sort());
  assert.equal(migrationProgress.salmonidsMigrated, 8);
  assert.equal(migrationProgress.salmonids, 8);
  assert.equal(Object.keys(salmonidComparisons).length, 5);

  let count = 0;
  for (const { id, family, habitats, pendingPlates, configuredSpecimens } of initial.inventory) {
    const live = runtime.SPECIES[id];
    const lab = catalog.find(species => species.id === id);
    assert.deepEqual([...live.habitats], habitats);
    assert.ok(runtime.REGIONS.some(region => region.species.includes(id) && zoneSupports(region, habitats)), id);
    assert.deepEqual([...runtime.configuredSpecials(live)], configuredSpecimens);
    assert.equal(lab.family, family);
    assert.equal(lab.edition, '4.9.1');
    assert.deepEqual(Object.values(routes[id]).sort(), pendingPlates.slice().sort());
    for (const [variant, file] of Object.entries(routes[id])) {
      count += 1;
      assert.equal(cutouts[file], true);
      for (const size of ['', '64/', '128/', '256/']) assert.ok(files.includes('naturalist-art/plates/' + size + file));
      for (const surface of ['field', 'journal', 'bestiary', 'museum']) {
        const markup = art.render(id, { variant, surface, habitat: habitats[0] }, () => '');
        assert.ok(markup.includes('atlas-art-' + surface + ' atlas-art-cutout') && markup.includes(file));
      }
    }
  }
  assert.equal(count, 16);

  const legends = [...runtime.LEGENDARY_SPECIMENS];
  assert.deepEqual(legends.map(item => item.name).sort(),
    ['Ámbar', 'Niebla', 'Fenrir', 'Ascua', 'Silverback', 'Atlas', 'Centinela', 'Basalto', 'Seda', 'Junco', 'Áncora', 'Remonte'].sort());
  assert.deepEqual(Array.from(legendaryComparisons.all.legendary, item => item.id), legends.map(item => item.speciesId));
  assert.equal(readRevision('952a263', 'www/js/app.js'), readRevision('4ee0853', 'www/js/app.js'),
    'V4.9.1 changes neither the game rules nor the original legend definitions');

  const id = 'asia_esp_0369';
  assert.notDeepEqual(fs.readFileSync('www/naturalist-art/plates/' + routes[id].normal),
    fs.readFileSync('www/naturalist-art/plates/' + routes[id].legendario));
  for (const legendary of legends) {
    const species = legendary.speciesId;
    const file = species + '--' + legendary.id + '.webp';
    assert.equal(routes[species].legendario, file);
    assert.equal(cutouts[file], true);
    for (const size of [64, 128, 256, 512]) {
      const derivative = (size === 512 ? '' : size + '/') + file;
      assert.ok(files.includes('naturalist-art/plates/' + derivative));
      const markup = art.render(species, { variant: 'legendario', category: 'Legendario', size }, () => '');
      assert.match(markup, /class="atlas-art-frame legendary/);
      assert.ok(markup.includes(derivative));
    }
    const rates = Object.entries(runtime.specimenRates(species));
    const begin = rates.filter(([name]) => name !== 'Legendario').reduce((sum, [, rate]) => sum + rate, 0);
    const draw = () => [0.9, begin + rates.find(([name]) => name === 'Legendario')[1] / 2][turn++];
    let turn = 0;
    const encounter = runtime.rollSpecimen(species, runtime.state, draw);
    assert.equal(encounter.category, 'Legendario');
    runtime.recordSpecimen(species, encounter, runtime.state);
    assert.equal(runtime.state.legendaryFound[legendary.id].speciesId, species);
    turn = 0;
    assert.equal(runtime.rollSpecimen(species, runtime.state, draw).category, '');
  }
  assert.equal(migrationProgress.legendary, 12);
  const collection = runtime.renderLegendaryCollection();
  for (const legendary of legends) assert.ok(collection.includes(legendary.name), legendary.name);
});


test('all freshwater and estuarine fish use their configured transparent plates and registered habitats', () => {
  const initial = require('../docs/cientifica-v491/inventario-pendiente.json').lots.dulceacuicolas;
  const { catalog, migrationProgress, freshwaterComparisons } = vm.runInNewContext(
    fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,migrationProgress,freshwaterComparisons});');
  const { routes, cutouts, files, landscapes, bestiaryHabitats } = globalThis.AtlasNaturalistAssets;
  const precached = new Set(files);
  const runtime = harness({}, null, { gameSource: source }).window.__atlasTest;
  const classify = require('../scripts/aquatic-plate-taxonomy.cjs');
  const members = Object.entries(runtime.SPECIES).filter(([id, sp]) => {
    const className = runtime.taxonomyInfo(id).className;
    return className === 'Actinopterygii' && classify(sp.latin, className, sp.habitats).lot === 'dulceacuicolas';
  });
  assert.deepEqual(members.map(([id]) => id).sort(), initial.inventory.map(animal => animal.id).sort());
  assert.equal(migrationProgress.freshwaterMigrated, 23);
  assert.equal(migrationProgress.freshwater, 23);
  assert.equal(Object.keys(freshwaterComparisons).length, 7);

  for (const { id, latin, family, habitats, pendingPlates, configuredSpecimens } of initial.inventory) {
    const live = runtime.SPECIES[id];
    const lab = catalog.find(species => species.id === id);
    assert.equal(live.latin, latin);
    assert.deepEqual([...live.habitats], habitats);
    assert.ok(runtime.REGIONS.some(region => region.species.includes(id) && zoneSupports(region, habitats)), id);
    assert.deepEqual([...runtime.configuredSpecials(live)], configuredSpecimens);
    assert.equal(lab.family, family);
    assert.equal(lab.edition, '4.9.2');
    assert.deepEqual(Object.values(routes[id]).sort(), pendingPlates.slice().sort());
    const preferred = art.preferredHabitat(live.habitats);
    const landscape = art.landscapeKey(bestiaryHabitats[id] || preferred);
    assert.ok(landscapes.includes(landscape), id);
    for (const [variant, file] of Object.entries(routes[id])) {
      assert.equal(cutouts[file], true);
      for (const size of ['', '64/', '128/', '256/']) assert.ok(precached.has('naturalist-art/plates/' + size + file));
      for (const surface of ['field', 'journal', 'bestiary', 'museum']) {
        const markup = art.render(id, { variant, surface, habitat: preferred }, () => '');
        assert.ok(markup.includes('atlas-art-' + surface + ' atlas-art-cutout') && markup.includes(file));
        if (surface === 'bestiary') assert.ok(markup.includes('src="landscapes/' + landscape + '.webp"'), id);
      }
    }
  }
  assert.equal(initial.families.length, 18);
  assert.equal(initial.albino, 7);
  assert.equal(initial.melanic, 5);
  assert.equal(initial.inventory.flatMap(animal => Object.values(routes[animal.id])).length, 35);
  assert.equal(readRevision('71d16ba', 'www/js/app.js'), readRevision('dc7929a', 'www/js/app.js'),
    'V4.9.2 changes neither the catalog, rarity, probabilities nor game mechanics');
});

test('V4.9.3 adds exactly two unique taxa and fourteen scientific plates and preserves legacy world data', () => {
  const baseline = '62fa8bad1d65617d6bf233859abce65b7e465761';
  const fromBaseline = path => execFileSync('git', ['show', baseline + ':' + path], { encoding: 'utf8', maxBuffer: 8e6 });
  const old = harness({}, null, { gameSource: [...production, 'app'].map(name => fromBaseline('www/js/' + name + '.js')).join('\n') }).window.__atlasTest;
  const live = harness({}, null, { gameSource: source }).window.__atlasTest;
  const { records } = require('../www/js/gm07-p04/catalog.js');
  const reef = require('../docs/cientifica-v492/inventario-pendiente.json').lots.arrecife.inventory;
  const pending = require('../docs/cientifica-v493/inventario-pendiente.json').lots;
  const { routes, cutouts, files } = globalThis.AtlasNaturalistAssets;
  const { catalog, reefComparisons } = vm.runInNewContext(fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,reefComparisons});');
  const accounted = new Set();
  const clone = item => JSON.parse(JSON.stringify(item));
  assert.equal(Object.keys(live.SPECIES).length, 1000);
  assert.equal(new Set(Object.values(live.SPECIES).map(sp => sp.latin.trim().toLowerCase().replace(/\s+/g, ' '))).size, 1000);
  assert.deepEqual(Object.keys(live.SPECIES).filter(id => !old.SPECIES[id]).sort(), Object.keys(records).sort());
  assert.equal(live.REGIONS.length, old.REGIONS.length);
  assert.deepEqual(clone(live.LEGENDARY_SPECIMENS), clone(old.LEGENDARY_SPECIMENS));
  const { AtlasNaturalistAssets: previous } = vm.runInNewContext(
    execFileSync('git', ['show', '75c5887:www/js/naturalist-assets-v400.js'], { encoding: 'utf8', maxBuffer: 8e6 }) + '\n({ AtlasNaturalistAssets });');
  assert.equal(Object.keys(previous.routes).length, 950);
  assert.equal(Object.keys(previous.cutouts).length, 1622);
  for (const [id, variants] of Object.entries(previous.routes)) {
    assert.deepEqual(routes[id], clone(variants), id);
  }
  for (const name of Object.keys(previous.cutouts)) assert.equal(cutouts[name], true, name);
  assert.deepEqual(Array.from(catalog.filter(sp => sp.edition === '4.9.3'), sp => sp.id).sort(),
    [...reef.map(sp => sp.id), ...Object.keys(records)].sort());
  assert.deepEqual(Object.values(reefComparisons).flatMap(group => Array.from(group.reef, sp => sp.id)).sort(),
    reef.map(sp => sp.id).sort());

  for (const [id, sp] of Object.entries(old.SPECIES)) {
    assert.deepEqual(clone(live.SPECIES[id]), clone(sp), id);
    assert.deepEqual(clone(live.taxonomyInfo(id)), clone(old.taxonomyInfo(id)), id);
    assert.deepEqual(clone(live.SPECIMEN_CATEGORIES[id] || []), clone(old.SPECIMEN_CATEGORIES[id] || []), id);
  }
  for (const region of old.REGIONS) {
    const addedIds = Object.keys(records).filter(id => records[id].region === region.id);
    assert.deepEqual(clone(live.REGIONS.find(r => r.id === region.id)),
      { ...clone(region), species: [...region.species, ...addedIds] }, region.id);
  }
  for (const [id, rec] of Object.entries(records)) {
    assert.equal(live.SPECIES[id].rare, 'Muy rara');
    assert.deepEqual(clone(live.taxonomyInfo(id)), rec.taxonomy);
    assert.deepEqual(clone(live.configuredSpecials(live.SPECIES[id])), ['Notable']);
  }
  for (const { id, family } of [...reef, ...Object.entries(records).map(([id, rec]) => ({ id, family: rec.taxonomy.family }))]) {
    const catalogEntry = catalog.find(sp => sp.id === id);
    const habitats = live.SPECIES[id].habitats;
    const file = id + '--normal.webp';
    assert.equal(catalogEntry.family, family);
    assert.deepEqual(routes[id], { normal: file });
    assert.ok(cutouts[file]);
    assert.ok(live.REGIONS.some(region => region.species.includes(id) && zoneSupports(region, habitats)), id);
    for (const size of ['', '64/', '128/', '256/']) {
      const local = 'naturalist-art/plates/' + size + file;
      assert.ok(files.includes(local) && fs.existsSync('www/' + local), local);
    }
    for (const surface of ['field', 'journal', 'bestiary', 'museum']) {
      assert.ok(art.render(id, { surface, habitat: art.preferredHabitat(habitats) }, () => '').includes(file));
    }
    accounted.add(id);
  }
  assert.equal(accounted.size, 14);
  assert.equal(pending.profundos.estimatedPlates, 14);
  assert.equal(pending.marinos.estimatedPlates + pending.cefalopodos.estimatedPlates, 36);
});

test('V4.9.5 migrates the fourteen deep-sea taxa and preserves catalogue, relics, legendary specimens and save identities', () => {
  const inventory = require('../docs/cientifica-v493/inventario-pendiente.json').lots.profundos.inventory;
  const pending = require('../docs/cientifica-v495/inventario-pendiente.json');
  const { catalog, deepSeaComparisons } = vm.runInNewContext(
    fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,deepSeaComparisons});');
  const { routes, cutouts, files, landscapes } = globalThis.AtlasNaturalistAssets;
  const game = harness({}, null, { gameSource: source }).window.__atlasTest;
  assert.equal(Object.keys(game.SPECIES).length, 1000);
  assert.equal(new Set(game.REGIONS.flatMap(r => [...r.species])).size, 1000);
  assert.equal(game.REGIONS.length, 125);
  assert.equal(game.LEGENDARY_SPECIMENS.length, 12);
  assert.equal(game.MUSEUM_RELICTS.length, 9);
  const { AtlasNaturalistAssets: previous } = vm.runInNewContext(
    execFileSync('git', ['show', 'b510945:www/js/naturalist-assets-v400.js'], { encoding: 'utf8', maxBuffer: 8e6 }) + '\n({ AtlasNaturalistAssets });');
  assert.equal(Object.keys(previous.routes).length, 964);
  assert.equal(Object.keys(previous.cutouts).length, 1636);
  for (const [id, variants] of Object.entries(previous.routes)) {
    assert.deepEqual(routes[id], JSON.parse(JSON.stringify(variants)), id);
  }
  for (const name of Object.keys(previous.cutouts)) assert.equal(cutouts[name], true, name);
  assert.equal(readRevision('b510945', 'www/js/app.js'), readRevision('75c5887', 'www/js/app.js'));
  for (const file of ['deep-data-v3330', 'abyssal-data-v3340', 'relict-art-v3199']) {
    assert.equal(read(file), readRevision('75c5887', 'www/js/' + file + '.js'));
  }

  const valid = inventory.map(sp => sp.id).sort();
  assert.deepEqual(Array.from(catalog.filter(sp => sp.edition === '4.9.5'), sp => sp.id).sort(), valid);
  assert.deepEqual(Object.values(deepSeaComparisons).flatMap(group => Array.from(group.deep, sp => sp.id)).sort(), valid);
  const abyssal = require('../www/js/abyssal-data-v3340.js');
  assert.equal(abyssal.ids['Notoliparis kermadecensis'], abyssal.ids['Pseudoliparis kermadecensis']);
  assert.equal(abyssal.ids['Notoliparis kermadecensis'], 'abisal_esp_pseudoliparis_kermadecensis');

  for (const { id, latin, family, habitats, configuredSpecimens } of inventory) {
    const animal = game.SPECIES[id];
    const file = id + '--normal.webp';
    assert.equal(animal.latin, latin);
    assert.equal(catalog.find(sp => sp.id === id).family, family);
    assert.deepEqual([...game.configuredSpecials(animal)], configuredSpecimens);
    assert.deepEqual(routes[id], { normal: file });
    assert.equal(cutouts[file], true);
    assert.ok(game.REGIONS.some(region => region.species.includes(id) && zoneSupports(region, habitats)), id);
    for (const size of [64, 128, 256, 512]) {
      const resource = 'naturalist-art/plates/' + (size === 512 ? '' : size + '/') + file;
      assert.ok(files.includes(resource) && fs.existsSync('www/' + resource), resource);
    }
    for (const surface of ['field', 'journal', 'bestiary', 'museum']) {
      const markup = art.render(id, { surface, habitat: art.preferredHabitat(habitats) }, () => '');
      assert.ok(markup.includes('atlas-art-' + surface + ' atlas-art-cutout') && markup.includes(file));
      if (surface === 'bestiary') assert.ok(markup.includes('src="landscapes/profundidades.webp"'), id);
    }
  }
  assert.ok(landscapes.includes('profundidades'));
  assert.equal(pending.lots.profundos.estimatedPlates, 0);
  assert.equal(pending.lots.marinos.estimatedPlates, 16);
  assert.equal(pending.lots.cefalopodos.estimatedPlates, 20);
  assert.equal(pending.summary.species, 36);
});

test('V4.9.6 completes the 1000 illustrated taxa with the 36 remaining plates and preserves Cephalopoda in Peces', () => {
  const pending = require('../docs/cientifica-v495/inventario-pendiente.json').lots;
  const marine = pending.marinos.inventory;
  const cephalopods = pending.cefalopodos.inventory;
  const { routes, cutouts, files } = globalThis.AtlasNaturalistAssets;
  const { catalog, marineComparisons, cephalopodComparisons } = vm.runInNewContext(
    fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({catalog,marineComparisons,cephalopodComparisons});');
  const bridge = '\nwindow.__atlasTest={SPECIES,REGIONS,taxonomyInfo,bestiaryTypeBucket,LEGENDARY_SPECIMENS,MUSEUM_RELICTS};\n})();';
  const game = harness({}, null, { gameSource: source, bridge }).window.__atlasTest;
  assert.equal(catalog.length, 1000);
  assert.equal(Object.keys(routes).length, 1000);
  assert.equal(Object.keys(cutouts).length, 1672);
  assert.equal(game.REGIONS.length, 125);
  assert.equal(game.LEGENDARY_SPECIMENS.length, 12);
  assert.equal(game.MUSEUM_RELICTS.length, 9);
  assert.equal(new Set(Object.values(game.SPECIES).map(sp => sp.latin.trim().toLowerCase().replace(/\s+/g, ' '))).size, 1000);
  assert.ok(Object.keys(game.SPECIES).every(id => routes[id]?.normal));
  assert.ok(catalog.every(row => row.records.every(form => form.src && form.cutout)));

  const ids = animals => animals.map(sp => sp.id).sort();
  assert.deepEqual(Array.from(catalog.filter(sp => sp.edition === '4.9.6'), sp => sp.id).sort(), ids([...marine, ...cephalopods]));
  for (const [key, members, sets] of [['marine', marine, marineComparisons], ['cephalopods', cephalopods, cephalopodComparisons]]) {
    assert.deepEqual(Object.values(sets).flatMap(group => Array.from(group[key], sp => sp.id)).sort(), ids(members));
    for (const { id, latin, family, className, habitats } of members) {
      const registration = game.SPECIES[id];
      assert.equal(registration.latin, latin);
      assert.equal(game.taxonomyInfo(id).className, className);
      assert.equal(game.bestiaryTypeBucket(id), 'Pez');
      assert.equal(catalog.find(sp => sp.id === id).family, family);
      assert.ok(game.REGIONS.some(zone => zone.species.includes(id) && zoneSupports(zone, habitats)), id);
      const file = id + '--normal.webp';
      assert.deepEqual(routes[id], { normal: file });
      for (const size of ['', '64/', '128/', '256/']) {
        const resource = 'naturalist-art/plates/' + size + file;
        assert.ok(files.includes(resource) && fs.existsSync('www/' + resource), resource);
      }
      for (const surface of ['field', 'journal', 'bestiary', 'museum']) {
        const markup = art.render(id, { surface, habitat: art.preferredHabitat(habitats) }, () => '');
        assert.ok(markup.includes('atlas-art-' + surface + ' atlas-art-cutout') && markup.includes(file));
      }
    }
  }
});
