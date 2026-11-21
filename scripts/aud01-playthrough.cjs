'use strict';
const fs = require('node:fs');
const { performance } = require('node:perf_hooks');
const assert = require('node:assert/strict');
const { make } = require('../tests/helpers/ux3410-game.cjs');

const hour = 3600000;
const start = Math.floor(1700000000000 / hour) * hour;
const source = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art',
  'gm07-m01/art', 'gm07-p04/catalog', 'gm07-a04/catalog', 'naturalist-assets-v400', 'naturalist-art-v400', 'app']
    .map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n')
  .replace(/\n}\)\(\);\s*$/, '\nwindow.__auditResearch={researchRarityWeight};\n})();');
function randomFrom(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}
function open(now, seed, store) {
  return make({ now, rng: randomFrom(seed), store, gameSource: source, headless: true });
}
function drain(h) {
  let passes = 0, longestTickMs = 0;
  do {
    const begin = performance.now();
    h.tick();
    longestTickMs = Math.max(longestTickMs, performance.now() - begin);
    assert.ok(++passes <= 125, 'El procesamiento del intervalo no terminó');
  } while (h.g.state.autoPending.length);
  return { passes, longestTickMs: +longestTickMs.toFixed(2) };
}
function metrics(g) {
  const s = g.state;
  return { money: +s.money.toFixed(2), knowledge: s.knowledge, prestige: s.prestige, helpers: s.helpers,
    autoTier: s.upgrades.autoTier, discoveries: Object.keys(s.discovered).length,
    sightings: Object.values(s.sightings).reduce((a, b) => a + b, 0),
    inventory: Object.keys(s.inventory).length, studies: Object.values(s.stages).reduce((a, b) => a + b, 0),
    unlocked: Object.values(s.regionUnlocked).filter(Boolean).length,
    museumExhibits: Object.keys(s.museum.exhibits).length, museumRate: +g.museumRate().toFixed(3),
    voyagesCompleted: s.museum.voyagesCompleted, tradeReturns: s.commerce.history.length,
    voyagesPending: s.voyages.length, tradePending: s.commerce.jobs.length,
    purchases: Object.keys(s.purchases).length, crowns: s.crownCoins };
}
const checkedSaveFields = ['sightings', 'discovered', 'inventory', 'stages', 'published', 'purchases',
  'specialCounts', 'legendaryFound', 'specialFound', 'equipment', 'regionUnlocked', 'museum',
  'voyages', 'voyageSeq', 'voyageHistory', 'voyageSettled', 'commerce', 'deepSurvey'];
function persistentProgress(g) {
  return JSON.parse(JSON.stringify(Object.fromEntries(checkedSaveFields.map(field => [field, g.state[field]]))));
}
function action(g, name, id) {
  g.handlePanelAction({ target: { closest: () => ({ dataset: { action: name, id } }) } });
}
function manual(g, n) {
  for (let i = 0; i < n; i++) g.encounter('manual');
}
function workshop(g) {
  for (const [id, spec] of Object.entries(g.RECIPES)) {
    if (spec && ['binoculars', 'rain_hood', 'amulet', 'brass_compass'].includes(id) && !g.state.craftedItems[id] && g.canCraft(id)) g.craftItem(id);
  }
}
function play(h, steps, interval) {
  const g = h.g;
  for (let i = 0; i < steps; i++) {
    h.now += interval;
    drain(h);
    if (i % 5 === 0) manual(g, 8);
    g.requestGrant();
    for (const id of ['novato', 'cuaderno_1', 'capacitacion_1', 'astillero', 'sociedad_1', 'metodo_1', 'metodo_2',
      'metodo_3', 'metodo_4', 'capacitacion_2', 'prismaticos_1', 'prismaticos_2', 'rutas_1', 'casco_1']) {
      if (id !== 'novato' && g.state.purchases[id]) continue;
      if (id === 'novato' && g.state.helpers >= (steps > 20 ? 10 : 2)) continue;
      g.buyNode(id);
    }
    if (i % 8 === 0) {
      for (const id of Object.keys(g.state.discovered)) {
        while (g.state.money > 250 && (g.state.stages[id] || 0) < 5 && g.stageRequirements(id, g.state.stages[id] || 0).allOk) {
          g.advanceSpecies(id);
        }
        if (g.state.stages[id] === 5 && !g.state.published[id]) g.publishMonograph(id);
        if (!g.state.museum.exhibits[id] && g.state.money > 350) g.exhibitAnimal(id);
      }
      workshop(g);
    }
    if (i % 4 === 0 && g.state.money > 200) g.sail('coast');
    if (i % 8 === 0 && g.state.money > 400) g.startTrade3300('coastal_trade');
    const next = g.REGIONS.find(r => r.id !== g.state.currentRegion && !g.state.regionsVisited[r.id] && g.regionRequirementsMet(r));
    if (next && g.state.prestige > 0 && i % 11 === 0) {
      g.unlockRegion(next.id);
      g.setRegion(next.id);
    }
  }
  if (g.state.money > 200 && !g.state.voyages.length) g.sail('coast');
  if (g.state.money > 400 && !g.state.commerce.jobs.length) g.startTrade3300('coastal_trade');
}
function checkpoint(h) {
  h.g.persist();
  return { store: { ...h.store }, time: h.now, metrics: metrics(h.g) };
}
const h = open(start, 501);
assert.equal(Object.keys(h.g.SPECIES).length, 1000);
assert.equal(h.g.REGIONS.length, 125);
manual(h.g, 12);
h.g.buyNode('novato');
action(h.g, 'set-time', 'dia');
const initial = checkpoint(h);
play(h, 18, 5 * 60000);
const intermediate = checkpoint(h);
play(h, 52, hour / 2);
const advanced = checkpoint(h);
if (process.env.AUD01_ADVANCED_SAVE) fs.writeFileSync(process.env.AUD01_ADVANCED_SAVE, advanced.store.gran_atlas_v05);
assert.ok(initial.metrics.helpers >= 1 && intermediate.metrics.purchases > initial.metrics.purchases);
assert.equal(advanced.metrics.helpers, 10);
assert.ok(advanced.metrics.prestige > intermediate.metrics.prestige);
const stages = [];
for (const [name, snapshot] of Object.entries({ initial, intermediate, advanced })) {
  const sessions = [1, 8, 72].map(hours => {
    const session = open(snapshot.time + hours * hour, 501, { ...snapshot.store });
    const before = metrics(session.g);
    const processing = drain(session);
    const after = metrics(session.g);
    assert.ok(Object.values(session.g.state.autoHourly).every(n => n <= 100));
    assert.equal(after.crowns, 0);
    const savedProgress = persistentProgress(session.g);
    const reopened = open(session.now, 501, { ...session.store });
    assert.deepEqual(metrics(reopened.g), after);
    assert.deepEqual(persistentProgress(reopened.g), savedProgress);
    reopened.tick();
    assert.deepEqual(metrics(reopened.g), after);
    assert.deepEqual(persistentProgress(reopened.g), savedProgress);
    return { hours, before, after, processing };
  });
  for (const session of sessions) {
    const interval = [5, 3, 2, 1, 0.5][snapshot.metrics.autoTier];
    const maxSearches = Math.ceil(Math.min(8, session.hours) * 3600 / interval);
    assert.ok(session.after.sightings - session.before.sightings <= maxSearches);
  }
  const bytes = Buffer.byteLength(snapshot.store.gran_atlas_v05);
  stages.push({ name, simulatedActiveHours: (snapshot.time - start) / hour, saveBytes: bytes, progress: snapshot.metrics, sessions });
}
const researchSession = open(advanced.time, 501, { ...advanced.store });
const research = researchSession.g;
const { researchRarityWeight } = researchSession.window.__auditResearch;
const fish = 'mar_esp_amphiprion_ocellaris';
const squid = 'mar_esp_dosidicus_gigas';
assert.equal(research.SPECIES[fish].taxonomy.className, 'Actinopterygii');
assert.equal(research.SPECIES[squid].taxonomy.className, 'Cephalopoda');
assert.equal(research.SPECIES[fish].rare, 'Raro');
assert.equal(research.SPECIES[squid].rare, 'Raro');
const weightsBefore = [researchRarityWeight(fish), researchRarityWeight(squid)];
assert.equal(research.buyNode('ictio_1'), true);
assert.equal(research.buyNode('ictio_2'), true);
const weightsAfter = [researchRarityWeight(fish), researchRarityWeight(squid)];
assert.ok(Math.abs(weightsAfter[0] / weightsBefore[0] - 1.65) < 1e-10);
assert.equal(weightsAfter[1], weightsBefore[1]);
const ichthyology = { fish, squid, weightsBefore, weightsAfter };
console.log(JSON.stringify({ ichthyology, checkedSaveFields, node: process.version, startingRules: 'normal new game, current starting fund, seeded natural RNG and clock; no trial aids', stages }, null, 2));
