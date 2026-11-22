'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const { harness } = require('./helpers/live-game.cjs');

const modules = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art',
  'gm07-m01/art', 'gm07-p04/catalog', 'gm07-a04/catalog'].map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8'));
const fromGit = file => execFileSync('git', ['show', '7cd5110:' + file], { maxBuffer: 16e6 });
const source = fs.readFileSync('www/js/app.js', 'utf8');
const members = 'SPECIES,SEXUAL_DIMORPHISM,REGIONS,MUSEUM_RELICTS,LEGENDARY_SPECIMENS,RELICT_DISCOVERY_RATES,encounter,searchRelictInField,automaticEligibleSpecies,eligibleSpecies,processAutomaticSearches,addRelictLead,relictLeadCount,startRelictSurvey,collectRelictSurvey,buyNode,persist,museumRelict3270,museumViewModel3270,museumModalModel3270,museumToken3270,fieldRelictNotice,handlePanelAction,sail,processVoyages,voyageReceipt3280,museumRelictSetBonus';
const bridge = '\nwindow.__atlasTest={' + members + ',get state(){return state},museumAction3270,setRoom(){tab="museum";state.museumView="relicts"}};\n})();';
const snapshot = value => JSON.parse(JSON.stringify(value));
const clock = Date.UTC(2025, 0, 1);
const key = 'gran_atlas_v05';

function setup({ historical = false, extra = {}, store = {}, backup } = {}) {
  let now = clock;
  const draws = [];
  class Clock extends Date { static now() { return now; } }
  const rng = () => draws.shift() ?? 0.99999;
  const app = historical ? fromGit('www/js/app.js').toString() : source;
  const injection = historical ? '\nwindow.__atlasTest={SPECIES,REGIONS,MUSEUM_RELICTS,LEGENDARY_SPECIMENS,get state(){return state}};\n})();' : bridge;
  const h = harness(store, backup, { gameSource: [...modules, app].join('\n'), bridge: injection, museum3270: true,
    Date: Clock, rng, ...extra });
  return { h, game: h.window.__atlasTest, rolls: (...values) => { draws.splice(0, draws.length, ...values); }, at: value => (now = value) };
}

function conditions(relict, game) {
  const state = game.state;
  state.regionUnlocked[relict.region] = true;
  state.currentRegion = relict.region;
  state.habitat = relict.habitats[0];
  state.time = relict.times[0];
  return { currentRegion: state.currentRegion, habitat: state.habitat, time: state.time, season: state.season };
}

test('the twenty relic records use existing regions and independently preserve the Atlas and the 30 legendary plates', () => {
  const { game } = setup();
  const { game: previous } = setup({ historical: true });
  const catalog = snapshot(game.MUSEUM_RELICTS);
  assert.equal(catalog.length, 20);
  assert.equal(new Set(catalog.map(r => r.id)).size, 20);
  assert.equal(new Set(catalog.map(r => r.latin)).size, 20);
  assert.deepEqual(catalog.slice(0, 9).map(r => r.id), Array.from(previous.MUSEUM_RELICTS, row => row.id));
  assert.deepEqual(snapshot(game.SPECIES), snapshot(previous.SPECIES));
  assert.deepEqual(snapshot(game.REGIONS), snapshot(previous.REGIONS));
  assert.deepEqual(snapshot(game.LEGENDARY_SPECIMENS), snapshot(previous.LEGENDARY_SPECIMENS));
  assert.equal(game.LEGENDARY_SPECIMENS.length, 30);
  assert.deepEqual(fs.readFileSync('www/js/relict-art-v3199.js'), fromGit('www/js/relict-art-v3199.js'));
  const previousManifest = JSON.parse(fromGit('www/atlas-integrity.json')).files;
  const manifest = require('../www/atlas-integrity.json').files;
  const oldArt = Object.keys(previousManifest).filter(file => file.startsWith('naturalist-art/plates/'));
  assert.equal(oldArt.length, 6760);
  for (const file of oldArt) assert.deepEqual(manifest[file], previousManifest[file], file);
  const newArt = Object.keys(manifest).filter(file => file.startsWith('naturalist-art/relicts/'));
  assert.equal(newArt.length, 44);
  for (const row of catalog) {
    const c = conditions(row, game);
    const region = game.REGIONS.find(zone => zone.id === row.region);
    assert.ok(region && row.habitats.every(habitat => region.habitats.includes(habitat)), row.id);
    assert.ok(game.automaticEligibleSpecies(row.region, c.season, c).length, row.id);
    if (row.speciesId) assert.ok(game.SPECIES[row.speciesId], row.id);
    for (const size of row.plate ? [64, 128, 256, 512] : []) {
      const url = 'naturalist-art/relicts/' + (size === 512 ? '' : size + '/') + row.id + '.webp';
      const bytes = fs.readFileSync('www/' + url);
      assert.equal(bytes.toString('ascii', 8, 16), 'WEBPVP8X');
      assert.ok(bytes[20] & 0x10, url);
      assert.equal(bytes.readUIntLE(24, 3) + 1, size);
      assert.equal(bytes.readUIntLE(27, 3) + 1, size);
      assert.deepEqual(manifest[url], [bytes.length, createHash('sha256').update(bytes).digest('hex')]);
    }
  }
});

test('all twenty discoveries require the precise region, habitat and time and register only once through actual Field', () => {
  const { game, rolls } = setup();
  for (const row of game.MUSEUM_RELICTS) {
    const valid = conditions(row, game);
    const region = game.REGIONS.find(zone => zone.id === row.region);
    const wrong = game.REGIONS.find(zone => zone.id !== row.region && zone.habitats.includes(valid.habitat));
    for (const invalid of [{ ...valid, currentRegion: wrong.id },
      { ...valid, habitat: region.habitats.find(habitat => !row.habitats.includes(habitat)) },
      { ...valid, time: ['amanecer', 'dia', 'atardecer', 'noche'].find(time => !row.times.includes(time)) }]) {
      let count = 0;
      const result = game.searchRelictInField('manual', clock, invalid, () => { count++; return 0; });
      assert.notEqual(result?.id, row.id, row.id);
      if (!game.MUSEUM_RELICTS.some(other => other.id !== row.id && other.region === invalid.currentRegion &&
        other.habitats.includes(invalid.habitat) && other.times.includes(invalid.time))) assert.equal(count, 0, row.id);
      if (result) {
        delete game.state.museum.relicts[result.id];
        delete game.state.museum.relictDiscoveries[result.id];
      }
    }
    assert.equal(game.searchRelictInField('expedicion', clock, valid, () => 0), null);
    const sightings = snapshot(game.state.sightings);
    const ordinaryPool = game.eligibleSpecies(row.region, valid.habitat, valid.time, valid.season);
    rolls(...(ordinaryPool.length ? [0.99999, 0] : [0]));
    game.encounter('manual', clock);
    assert.equal(game.state.museum.relicts[row.id], true, row.id);
    assert.equal(game.state.museum.relictDiscoveries[row.id].at, clock, row.id);
    assert.equal(game.state.museum.relictDiscoveries[row.id].source, 'manual');
    assert.equal(game.relictLeadCount(row.id), 0);
    assert.deepEqual(snapshot(game.state.sightings), sightings);
    assert.equal(game.searchRelictInField('manual', clock + 1, valid, () => 0), null);
    assert.equal(game.state.museum.relictDiscoveries[row.id].at, clock);
  }
  assert.equal(Object.keys(game.state.museum.relicts).length, 20);
  const first = game.fieldRelictNotice();
  assert.equal(first.id, game.MUSEUM_RELICTS[0].id);
  assert.match(first.art, /svg/);
});

test('the production threshold yields 2, 5, 12 and 30 finds per 10,000 valid attempts', () => {
  const { game } = setup();
  const target = game.MUSEUM_RELICTS.find(r => r.id === 'olm_balkans');
  const active = conditions(target, game);
  for (const source of ['manual', 'auto']) {
    const count = Array.from({ length: 4 }, (_, level) => {
      game.state.museum.relictLeads[target.id] = level;
      // Census, group, ethology and helper upgrades must not multiply this trial.
      Object.assign(game.state.upgrades, { censusTier: 2, autoCensus: 1, groupTier: 3, ethology: 2, autoGroup: 1 });
      game.state.helpers = 100;
      let finds = 0;
      for (let i = 0; i < 10000; i++) {
        delete game.state.museum.relicts[target.id];
        if (game.state.museum.relictDiscoveries) delete game.state.museum.relictDiscoveries[target.id];
        if (game.state.museum.relictAutoHour) delete game.state.museum.relictAutoHour[target.id];
        if (game.searchRelictInField(source, clock, active, () => (i + .5) / 10000)) finds++;
      }
      return finds;
    });
    assert.deepEqual(count, [2, 5, 12, 30], source);
  }
});

test('offline work uses recorded filters and spends only one attempt per relicto and hour across reloads', () => {
  const { game, rolls, h } = setup();
  const target = game.MUSEUM_RELICTS.find(r => r.id === 'olm_balkans');
  const segment = conditions(target, game);
  game.state.currentRegion = 'HX-01-09';
  game.state.habitat = 'bosque';
  game.state.time = 'dia';
  game.state.autoPending = [{ ...segment, at: clock, end: clock + 20000, interval: 10000 }];
  rolls(0.999, 0.99999, 0.99999, 0.99999);
  game.processAutomaticSearches();
  assert.equal(game.state.museum.relictAutoHour[target.id], Math.floor(clock / 3600000));
  assert.equal(game.state.museum.relicts[target.id], undefined);
  game.persist();
  const reopened = setup({ store: h.store });
  const resume = reopened.game;
  let calls = 0;
  assert.equal(resume.searchRelictInField('auto', clock + 30000, segment, () => { calls++; return 0; }), null);
  assert.equal(calls, 0);
  const nextHour = clock + 3600000;
  resume.state.autoPending = [{ ...segment, at: nextHour, end: nextHour, interval: 10000 }];
  reopened.rolls(.99999, 0);
  resume.processAutomaticSearches();
  assert.equal(resume.state.museum.relictDiscoveries[target.id].source, 'auto');
  assert.equal(resume.state.museum.relictDiscoveries[target.id].at, nextHour);
  assert.equal(resume.state.currentRegion, 'HX-01-09');
});

test('research, voyages, documentary jobs and Field report distinct clues without awarding a relic', () => {
  const { game, at, rolls } = setup();
  const target = game.MUSEUM_RELICTS.find(r => r.id === 'olm_balkans');
  conditions(target, game);
  Object.assign(game.state, { money: 1800, knowledge: 1200, prestige: 10 });
  Object.assign(game.state.upgrades, { shipyard: 1, routeTier: 2 });
  game.state.purchases.gabinete_1 = 1;
  const card = () => game.museumRelict3270(target);
  assert.equal(card().details.length, 0);
  assert.equal(card().art, '');
  game.buyNode('relictos_1');
  assert.equal(game.relictLeadCount(target.id), 1);
  assert.deepEqual(Array.from(card().details, row => row.label), ['Localización']);
  game.sail('balkans');
  const voyage = game.state.voyages[0];
  assert.ok(voyage);
  at(voyage.endAt);
  assert.equal(game.processVoyages(voyage.endAt), 1);
  assert.equal(game.processVoyages(voyage.endAt + 1), 0);
  assert.match(game.voyageReceipt3280(0).relictLead, /Proteo.*2\/3/);
  assert.deepEqual(Array.from(card().details, row => row.label), ['Localización', 'Hábitat']);
  assert.ok(game.startRelictSurvey(target.id, voyage.endAt));
  const prospect = game.state.museum.relictSurveys[0];
  assert.equal(game.collectRelictSurvey(prospect.id, prospect.endAt - 1, () => .99), false);
  assert.ok(game.collectRelictSurvey(prospect.id, prospect.endAt, () => .99));
  assert.equal(game.collectRelictSurvey(prospect.id, prospect.endAt, () => .99), false);
  assert.equal(game.relictLeadCount(target.id), 3);
  assert.deepEqual(Array.from(card().details, row => row.label), ['Localización', 'Hábitat', 'Comportamiento']);
  assert.equal(game.addRelictLead(target.id), false);
  assert.equal(game.state.museum.relicts[target.id], undefined);
  game.setRoom();
  game.museumAction3270('catalog-relict', game.museumToken3270('relict', target.id));
  assert.equal(game.state.museum.relicts[target.id], undefined);
  assert.equal(game.museumModalModel3270(game.museumToken3270('relict', target.id)), null);
  const { currentRegion, habitat, time, season } = game.state;
  const pool = game.eligibleSpecies(currentRegion, habitat, time, season);
  rolls(...(pool.length ? [.99999, .00299] : [.00299]));
  game.encounter('manual', prospect.endAt);
  const modal = game.museumModalModel3270(game.museumToken3270('relict', target.id));
  assert.equal(modal.latin, 'Proteus anguinus');
  assert.ok(modal.details.find(row => row.label === 'Fecha de registro'));
  assert.match(modal.art, /svg/);

  const other = game.MUSEUM_RELICTS.find(r => r.id === 'gabon_dwarf_croc');
  const field = conditions(other, game);
  const species = game.eligibleSpecies(field.currentRegion, field.habitat, field.time, field.season)[0];
  assert.ok(species);
  // Succeed and select the first ordinary animal. Miss fossils, feeding, sex and variants.
  // The subsequent relic roll misses and the clue roll succeeds.
  const ordinaryExtras = 4 + 1 + Number(Boolean(game.SEXUAL_DIMORPHISM[species])) + 2;
  rolls(.01, 0, ...Array(ordinaryExtras).fill(.99), .99, 0, 0);
  game.encounter('manual', prospect.endAt);
  assert.equal(game.relictLeadCount(other.id), 1);
  assert.equal(game.state.museum.relicts[other.id], undefined);
});

test('historic saves retain acquired relics, displays, clues and pending jobs, and export keeps the new encounter record', async () => {
  const { game: legacy } = setup({ historical: true });
  const old = snapshot(legacy.state);
  old.museum.relicts.coelacanth_indic = true;
  old.museum.displays['relict:coelacanth_indic'] = false;
  old.museum.relictLeads.white_sturgeon = 2;
  old.museum.relictSurveys = [{ id: 6, relict: 'white_sturgeon', endAt: clock + 1000 }];
  old.legacyExtra = 'retained';
  const before = { format: 'el-gran-atlas-save', formatVersion: 1, gameVersion: '5.1.1', game: old };
  const { game, h, rolls } = setup({ backup: before });
  await h.import();
  assert.equal(game.state.museum.relicts.coelacanth_indic, true);
  assert.equal(game.state.museum.displays['relict:coelacanth_indic'], false);
  assert.equal(game.state.museum.relictDiscoveries?.coelacanth_indic, undefined);
  assert.equal(game.state.museum.relictSurveys[0].id, 6);
  assert.equal(game.relictLeadCount('white_sturgeon'), 2);
  assert.equal(game.state.legacyExtra, 'retained');
  const row = game.MUSEUM_RELICTS.find(r => r.id === 'white_sturgeon');
  conditions(row, game);
  rolls(.99999, 0);
  game.encounter('manual', clock);
  assert.ok(game.persist());
  const reopened = setup({ store: h.store }).game;
  assert.equal(reopened.fieldRelictNotice().id, row.id);
  let backup;
  h.window.Capacitor.Plugins.AtlasExport.saveFile = async ({ content }) => { backup = JSON.parse(content); };
  await h.elements.saveDownloadBtn.fire('click');
  assert.equal(backup.gameVersion, require('../package.json').version);
  assert.deepEqual(backup.game.museum.relictDiscoveries, snapshot(game.state.museum.relictDiscoveries));
  const copy = setup({ backup });
  await copy.h.import();
  assert.equal(copy.game.state.museum.relicts[row.id], true);
  assert.equal(copy.game.relictLeadCount(row.id), 2);
  assert.equal(copy.game.fieldRelictNotice().id, row.id);
});
