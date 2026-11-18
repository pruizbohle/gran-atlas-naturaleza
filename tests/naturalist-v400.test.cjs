'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { harness } = require('./helpers/live-game.cjs');

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
  assert.deepEqual(counts, { Marsupiales: 29, Monotremas: 3, Felinos: 31, 'Cánidos': 28, 'Carnívoros terrestres': 51 });
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
  assert.deepEqual({ ...catalog.migrationProgress }, { migrated: 142, total: 997 });
});
