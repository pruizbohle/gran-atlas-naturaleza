'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const { harness } = require('./helpers/live-game.cjs');
const { files: manifest } = require('../www/atlas-integrity.json');
require('../www/js/naturalist-assets-v400.js');

const modules = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art',
  'gm07-m01/art', 'gm07-p04/catalog', 'gm07-a04/catalog'].map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8'));
const baseline = file => execFileSync('git', ['show', '1f136518:' + file], { maxBuffer: 16e6 });
const gameSource = [...modules, fs.readFileSync('www/js/app.js', 'utf8')].join('\n');
const oldSource = [...modules, baseline('www/js/app.js').toString()].join('\n');
const old = harness({}, null, { gameSource: oldSource }).window.__atlasTest;
const game = harness({}, null, { gameSource }).window.__atlasTest;
const additions = {
  aconcagua: 'sa_esp_vultur_gryphus',
  titan: 'na_esp_bison_bison',
  boreal: 'polar_esp_ursus_maritimus',
  leviatan: 'mar_esp_balaenoptera_musculus',
  esmeralda: 'oc_esp_strigops_habroptilus',
  abismo: 'af_tiburon_blanco',
  kraken: 'mar_esp_architeuthis_dux',
  solitario: 'gm06_chelonoidis_porteri',
  eterno: 'polar_esp_somniosus_microcephalus',
  vertigo: 'na_esp_falco_peregrinus'
};
const revisable = new Set(['espiral', 'cienaga', 'alisio']);
const sizes = [64, 128, 256, 512];
const snapshot = value => JSON.parse(JSON.stringify(value));
const sha = buffer => createHash('sha256').update(buffer).digest('hex');

test('LEG-02 preserves all identities, adds exactly ten named taxa and changes no existing specimen rates', () => {
  const rows = snapshot(game.LEGENDARY_SPECIMENS);
  assert.equal(rows.length, 30);
  for (const key of ['id', 'speciesId']) assert.equal(new Set(rows.map(row => row[key])).size, rows.length);
  assert.equal(new Set(rows.map(row => game.SPECIES[row.speciesId].latin)).size, rows.length);
  assert.deepEqual(Object.fromEntries(rows.slice(20).map(row => [row.id, row.speciesId])), additions);
  for (const historical of snapshot(old.LEGENDARY_SPECIMENS)) {
    const current = rows.find(row => row.id === historical.id);
    assert.ok(current);
    if (historical.id === 'filigrana') historical.name = 'Nácar';
    if (revisable.has(historical.id)) historical.description = current.description;
    assert.deepEqual(current, historical);
  }
  assert.deepEqual(snapshot(game.SPECIES), snapshot(old.SPECIES));
  assert.deepEqual(snapshot(game.REGIONS), snapshot(old.REGIONS));
  assert.equal(Object.keys(game.SPECIES).length, 1000);
  assert.equal(game.REGIONS.length, 125);
  assert.equal(old.MUSEUM_RELICTS.length, 9);
  const newTaxa = new Set(Object.values(additions));
  for (const id of Object.keys(game.SPECIES)) {
    for (const ethology of [0, 1, 2]) {
      const expected = snapshot(old.specimenRates(id, ethology));
      if (newTaxa.has(id)) expected.Legendario = .0001 * (ethology === 2 ? 1.5 : 1);
      assert.deepEqual(snapshot(game.specimenRates(id, ethology)), expected, id);
    }
  }
});

test('LEG-02 WebP routes are unique, checked by the integrity manifest, and preserve all unrelated production art', () => {
  const { routes, cutouts, files, labFiles, visualScales } = globalThis.AtlasNaturalistAssets;
  const previousFiles = JSON.parse(baseline('www/atlas-integrity.json')).files;
  const oldAssets = vm.createContext({});
  vm.runInContext(baseline('www/js/naturalist-assets-v400.js').toString(), oldAssets);
  assert.deepEqual(visualScales, snapshot(oldAssets.AtlasNaturalistAssets.visualScales));
  const productionPlates = Object.keys(manifest).filter(file => file.startsWith('naturalist-art/plates/'));
  assert.equal(productionPlates.length, Object.keys(previousFiles).filter(file => file.startsWith('naturalist-art/plates/')).length + 40);
  const eligible = new Set();
  const newRoutes = new Set();
  for (const { id, speciesId, name } of game.LEGENDARY_SPECIMENS) {
    const plate = speciesId + '--' + id + '.webp';
    assert.equal(routes[speciesId].legendario, plate);
    assert.ok(cutouts[plate], name);
    for (const size of sizes) {
      const relative = (size === 512 ? '' : size + '/') + plate;
      const route = 'naturalist-art/plates/' + relative;
      const bytes = fs.readFileSync('www/' + route);
      assert.equal(bytes.toString('ascii', 8, 16), 'WEBPVP8X', route);
      assert.ok(bytes[20] & 0x10, route);
      assert.equal(bytes.readUIntLE(24, 3) + 1, size, route);
      assert.equal(bytes.readUIntLE(27, 3) + 1, size, route);
      assert.deepEqual(manifest[route], [bytes.length, sha(bytes)]);
      assert.ok(files.includes(route), route);
      assert.notDeepEqual(manifest[route], manifest[route.replace('--' + id + '.webp', '--normal.webp')]);
      if (Object.hasOwn(additions, id)) {
        assert.equal(previousFiles[route], undefined);
        newRoutes.add(route);
      } else if (revisable.has(id) && previousFiles[route]?.[1] !== manifest[route][1]) {
        const archive = 'naturalist-art/review/leg02/' + relative;
        assert.ok(labFiles.includes(archive), archive);
        assert.equal(sha(fs.readFileSync('www/' + archive)), previousFiles[route][1], archive);
        eligible.add(route);
      }
    }
  }
  for (const route of Object.keys(previousFiles).filter(path => path.startsWith('naturalist-art/plates/'))) {
    if (!eligible.has(route)) assert.deepEqual(manifest[route], previousFiles[route], route);
  }
  assert.equal(newRoutes.size, 40);
  for (const path of ['www/naturalist-art/pigment-audit-data.js', 'docs/arte-pigmentarias/estado-pausa.md']) {
    assert.deepEqual(fs.readFileSync(path), baseline(path));
  }
});

test('LEG-02 restores Filigrana as Nácar, registers each new identity once and round-trips a backup', async () => {
  const archived = snapshot(old.state);
  archived.legendaryFound = Object.fromEntries(old.LEGENDARY_SPECIMENS.map(({ id, speciesId }) => [id, { id, speciesId }]));
  archived.collectionId = 'leg02-recovery';
  archived.log = ['🔭 Ajolote mexicano ×1 · espécimen especial: Legendario, Filigrana.'];
  const backup = { format: 'el-gran-atlas-save', formatVersion: 1, gameVersion: '5.1.0', game: archived };
  const target = harness({}, backup, { gameSource });
  await target.import();
  assert.deepEqual(target.imported.legendaryFound, archived.legendaryFound);
  const runtime = target.window.__atlasTest;
  assert.match(runtime.renderLegendaryCollection(), /20\/30/);
  assert.match(runtime.renderLegendaryCollection(), /Nácar/);
  assert.doesNotMatch(runtime.renderLegendaryCollection(), /Filigrana/);
  const simulate = speciesId => {
    const { Legendario: rate, ...otherRates } = runtime.specimenRates(speciesId);
    const start = Object.values(otherRates).reduce((sum, value) => sum + value, 0);
    const draws = [0.99, start + rate / 2].values();
    return runtime.rollSpecimen(speciesId, runtime.state, () => draws.next().value);
  };
  assert.equal(simulate('na_esp_ambystoma_mexicanum').category, '');
  for (const [id, speciesId] of Object.entries(additions)) {
    const found = simulate(speciesId);
    assert.equal(found.category, 'Legendario', id);
    runtime.recordSpecimen(speciesId, found, runtime.state);
    assert.equal(simulate(speciesId).category, '', id);
    runtime.recordSpecimen(speciesId, found, runtime.state);
    assert.equal(runtime.state.specialSeen[speciesId], 1, id);
    assert.deepEqual(snapshot(runtime.state.legendaryFound[id]), { id, speciesId });
  }
  runtime.persist();
  const reloaded = harness(target.store, null, { gameSource }).window.__atlasTest;
  assert.match(reloaded.renderLegendaryCollection(), /30\/30/);
  let exported;
  target.window.Capacitor.Plugins.AtlasExport.saveFile = async ({ content }) => { exported = JSON.parse(content); };
  await target.elements.saveDownloadBtn.fire('click');
  assert.equal(exported.gameVersion, require('../package.json').version);
  assert.deepEqual(exported.game.log, archived.log);
  const recovery = harness({}, exported, { gameSource });
  await recovery.import();
  assert.deepEqual(recovery.imported.legendaryFound, snapshot(runtime.state.legendaryFound));
  assert.match(recovery.window.__atlasTest.renderLegendaryCollection(), /30\/30/);
});
