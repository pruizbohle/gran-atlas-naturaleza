'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { harness } = require('./helpers/live-game.cjs');

const hour = 3600000;
const noon = Math.floor(1700000000000 / hour) * hour;
const key = 'gran_atlas_v05';
const scripts = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art',
  'gm07-m01/art', 'gm07-p04/catalog', 'gm07-a04/catalog', 'app'];
const gameSource = scripts.map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
function open(store = {}, random = () => 0.99, options = {}) {
  let now = noon;
  class Clock extends Date { static now() { return now; } }
  const h = harness(store, null, { Date: Clock, rng: random, gameSource, ...options });
  const g = h.window.__atlasTest;
  return { h, g, at(time) { now = time; h.tick(); },
    drain(time) {
      for (let i = 0; i < 125; i++) {
        this.at(time);
        if (!g.state.autoPending?.length) return;
      }
      assert.fail('La cola no terminó en 125 ciclos.');
    }
  };
}

test('AUD-01 el atraso se guarda con su cursor y continúa tras reiniciar sin repetir búsquedas', () => {
  const first = open();
  first.g.state.helpers = 1;
  first.at(noon + hour);
  assert.equal(first.g.state.knowledge, 1000);
  assert.ok(JSON.parse(first.h.store[key]).autoPending.length);
  const reopened = open(first.h.store);
  reopened.drain(noon + hour);
  assert.equal(reopened.g.state.knowledge, 720 * 2);
  reopened.at(noon + hour);
  assert.equal(reopened.g.state.knowledge, 720 * 2);
});

test('AUD-01 un cupo agotado en la hora actual o anterior no cancela las demás horas', () => {
  const game = open({}, () => 0.25);
  const s = game.g.state;
  s.helpers = 1;
  const available = game.g.automaticEligibleSpecies(s.currentRegion, s.season);
  assert.ok(available.length > 1);
  const startHour = noon / hour;
  for (const h of [startHour, startHour + 2]) {
    for (const id of available) s.autoHourly[h + ':' + id] = 100;
  }
  game.drain(noon + 2 * hour);
  assert.ok(available.some(id => s.autoHourly[(startHour + 1) + ':' + id] > 0));
  assert.ok(available.every(id => s.autoHourly[startHour + ':' + id] === 100));
  assert.ok(Object.values(s.autoHourly).every(n => n >= 0 && n <= 100));
  assert.ok(Object.values(s.sightings).reduce((a, b) => a + b, 0) > 0);
});

test('AUD-01 la ausencia de 72 h procesa el mismo máximo de 8 h de búsquedas', () => {
  function knowledgeAfter(hours) {
    const game = open();
    game.g.state.helpers = 1;
    game.drain(noon + hours * hour);
    return game.g.state.knowledge;
  }
  assert.equal(knowledgeAfter(8), 5760 * 2);
  assert.equal(knowledgeAfter(72), 5760 * 2);
});

test('AUD-01 restaurar el cursor conserva las fracciones y el reloj nunca repite un intervalo', () => {
  const game = open();
  game.g.state.helpers = 1;
  game.at(noon + 3000);
  const restarted = open(game.h.store);
  restarted.at(noon + 4999);
  assert.equal(restarted.g.state.knowledge, 0);
  restarted.at(noon + 5000);
  restarted.at(noon + 1000);
  restarted.at(noon + 5000);
  assert.equal(restarted.g.state.knowledge, 2);
});

test('AUD-01 el lote pendiente conserva región y estación al cambiar de zona', () => {
  const game = open({}, () => 0.25);
  const s = game.g.state;
  s.helpers = 1;
  const available = game.g.automaticEligibleSpecies(s.currentRegion, s.season);
  game.at(noon + 2 * hour);
  assert.ok(s.autoPending.length);
  const other = game.g.REGIONS.find(r => r.id !== s.currentRegion && r.species.some(id => !available.includes(id)));
  s.currentRegion = other.id;
  s.season = 'invierno';
  game.drain(noon + 2 * hour);
  assert.ok(Object.keys(s.sightings).every(id => available.includes(id)));
});

test('AUD-03 respaldo con una expedición repetida liquida una sola vez y ajusta la secuencia', () => {
  const game = open();
  const bridge = game.h.window.AtlasSaveBridge;
  const save = bridge.getSaveData();
  const route = game.g.VOYAGES.find(v => v.id === 'coast');
  save.voyages = [
    { id: 7, type: route.id, endAt: null },
    { id: 7, type: route.id, endAt: noon },
    { id: '7', type: route.id, endAt: noon }
  ];
  bridge.restoreGame(save);
  assert.equal(game.g.state.voyages.length, 1);
  assert.equal(game.g.state.voyageSeq, 7);
  game.at(noon);
  assert.equal(game.g.state.money, save.money + route.prize);
  assert.equal(game.g.state.knowledge, save.knowledge + route.notes);
  assert.equal(game.g.state.museum.voyagesCompleted, 1);
  const reopened = open(game.h.store);
  reopened.at(noon);
  assert.equal(reopened.g.state.money, save.money + route.prize);
  const stale = reopened.h.window.AtlasSaveBridge.getSaveData();
  stale.voyages = [{ id: 7, type: route.id, endAt: noon }];
  reopened.h.window.AtlasSaveBridge.restoreGame(stale);
  assert.equal(reopened.g.state.voyages.length, 0);
});

test('AUD-03 la liquidación ordinaria revierte tanto el regreso manual como el automático si falla la cuota', () => {
  const game = open();
  const bridge = game.h.window.AtlasSaveBridge;
  const save = bridge.getSaveData();
  const route = game.g.VOYAGES.find(v => v.id === 'coast');
  save.voyages = [{ id: 1, type: route.id, endAt: noon }];
  bridge.restoreGame(save);
  const write = game.h.localStorage.setItem;
  game.h.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
  const finished = game.g.finishVoyage(1);
  assert.equal(game.g.state.voyages.length, 1);
  assert.equal(finished, false);
  game.at(noon);
  assert.equal(game.g.state.voyages.length, 1);
  assert.equal(game.g.state.money, save.money);
  assert.equal(JSON.parse(game.h.store[key]).money, save.money);
  game.h.localStorage.setItem = write;
  game.at(noon);
  assert.equal(game.g.state.voyages.length, 0);
  assert.equal(game.g.state.money, save.money + route.prize);
});

test('AUD-03 un fallo al dibujar un respaldo deja la partida original en memoria y en disco', () => {
  const game = open();
  game.g.persist();
  const bridge = game.h.window.AtlasSaveBridge;
  const save = bridge.getSaveData();
  const stored = game.h.store[key];
  const counter = game.h.elements.statMoney;
  let label = counter.textContent;
  let once = true;
  Object.defineProperty(counter, 'textContent', {
    get() { return label; },
    set(value) {
      if (once) { once = false; throw new Error('Render interrumpido'); }
      label = value;
    }
  });
  assert.throws(() => bridge.restoreGame({ ...save, money: save.money + 40 }), /Render interrumpido/);
  assert.equal(bridge.getSaveData().money, save.money);
  assert.equal(game.h.store[key], stored);
});

test('AUD-02 prismáticos, catalejo y cuaderno cambian el resultado del motor en el umbral anunciado', () => {
  const game = open({}, () => 0.67);
  const g = game.g;
  const s = g.state;
  s.knowledge = 150; // Recursos de un fixture diagnóstico de bonificaciones.
  s.inventory.field_telescope = 1;
  const previousSightings = () => Object.values(s.sightings).reduce((a, b) => a + b, 0);
  const firstChance = g.manualSearchChance();
  assert.equal(firstChance, 0.50);
  g.encounter('manual', noon);
  assert.equal(previousSightings(), 0);
  assert.equal(s.knowledge, 153);
  assert.equal(g.buyNode('prismaticos_2'), false);
  assert.equal(g.buyNode('prismaticos_1'), true);
  assert.equal(g.buyNode('prismaticos_2'), true);
  assert.equal(g.buyNode('cuaderno_1'), true);
  g.equipItem('field_telescope');
  assert.ok(Math.abs(g.manualSearchChance() - 0.74) < 1e-10);
  const before = s.knowledge;
  g.encounter('manual', noon);
  assert.equal(previousSightings(), 1);
  assert.equal(s.knowledge - before, 6);
  g.equipItem('field_telescope');
  assert.equal(g.manualSearchChance(), 0.62);
  g.encounter('manual', noon);
  assert.equal(previousSightings(), 1);
  assert.equal(s.knowledge - before, 10);
});

test('AUD-02 contrataciones y capacitación respetan el tope y equipo activo cambia los encuentros', () => {
  const game = open({}, () => 0.58);
  const g = game.g;
  const s = g.state;
  s.money = 1200;
  s.knowledge = 650;
  s.inventory.amulet = 1;
  s.inventory.rain_hood = 1;
  for (let i = 0; i < 10; i++) assert.equal(g.buyNode('novato'), true);
  assert.equal(g.buyNode('novato'), false);
  assert.equal(s.helpers, 10);
  assert.equal(g.buyNode('capacitacion_1'), true);
  assert.equal(g.buyNode('capacitacion_2'), true);
  assert.ok(Math.abs(g.automaticSearchChance() - 0.551) < 1e-10);
  g.encounter('auto', noon);
  assert.equal(Object.keys(s.sightings).length, 0);
  g.equipItem('amulet');
  g.equipItem('rain_hood');
  assert.ok(Math.abs(g.automaticSearchChance() - 0.6004) < 1e-10);
  g.encounter('auto', noon);
  assert.equal(Object.keys(s.sightings).length, 1);
  assert.equal(g.buyNode('metodo_4'), false);
  for (const tier of [1, 2, 3, 4]) assert.equal(g.buyNode('metodo_' + tier), true);
  assert.equal(g.autoInterval(), 0.5);
});

test('AUD-02 al censar automáticamente con un registro disponible solo se concede un registro', () => {
  const game = open({}, () => 0);
  const g = game.g;
  const s = g.state;
  s.helpers = 1;
  s.upgrades.censusTier = 2;
  s.upgrades.autoCensus = 1;
  const ids = g.automaticEligibleSpecies(s.currentRegion, s.season);
  const h = noon / hour;
  for (const id of ids) s.autoHourly[h + ':' + id] = 100;
  s.autoHourly[h + ':' + ids[0]] = 99;
  assert.equal(g.researchCensusCount('auto'), 2);
  g.encounter('auto', noon);
  assert.equal(s.sightings[ids[0]], 1);
  assert.equal(s.autoHourly[h + ':' + ids[0]], 100);
  g.encounter('auto', noon);
  assert.equal(s.sightings[ids[0]], 1);
  assert.ok(Object.values(s.autoHourly).every(n => n <= 100));
});

test('AUD-03 el arnés integral detecta un ala de museo inválida admitida por la restauración', () => {
  const game = open();
  const bridge = game.h.window.AtlasSaveBridge;
  const snapshot = bridge.getSaveData();
  snapshot.museum.wing = 0;
  bridge.restoreGame(snapshot);
  assert.equal(game.g.state.museum.wing, 0);
  assert.equal(game.g.museumCapacity(), 12);
});

test('AUD-03 el importador detecta una sustitución por ID aunque todos los totales coincidan', async () => {
  const game = open();
  game.g.state.inventory.fossil_fragment = 2;
  game.g.persist();
  const old = game.h.store[key];
  const save = game.h.window.AtlasSaveBridge.getSaveData();
  save.sightings.zorro_rojo = 12;
  save.stages.zorro_rojo = 1;
  save.inventory.fossil_fragment = 9;
  game.h.window.Capacitor.Plugins.AtlasImport.openFile = async () => ({
    content: JSON.stringify(save), name: 'integridad-por-id.json'
  });
  const write = game.h.localStorage.setItem;
  let altered = false;
  game.h.localStorage.setItem = (name, value) => {
    if (name === key && !altered) {
      altered = true;
      const data = JSON.parse(value);
      data.sightings = { lobo_gris: 12 };
      data.inventory = {};
      value = JSON.stringify(data);
    }
    write(name, value);
  };
  await game.h.import();
  assert.ok(altered);
  assert.match(game.h.elements.saveManagerStatus.textContent, /Fallo al aplicar/);
  assert.equal(game.h.store[key], old);
  assert.equal(game.h.store.gran_atlas_backup_pre_import_v301, old);
  assert.equal(game.g.state.inventory.fossil_fragment, 2);
  assert.deepEqual(Object.keys(game.g.state.sightings), []);
});

test('AUD-03 la confirmación del guardado acepta migraciones y progreso posterior ya persistido', async () => {
  const game = open();
  game.g.persist();
  const save = game.h.window.AtlasSaveBridge.getSaveData();
  save.sightings = { af_quebrantahuesos: 3, quebrantahuesos: 5 };
  save.stages = { af_quebrantahuesos: 2, quebrantahuesos: 1 };
  save.published = { af_quebrantahuesos: true, quebrantahuesos: true };
  save.money += 50;
  game.h.window.Capacitor.Plugins.AtlasImport.openFile = async () => ({
    content: JSON.stringify(save), name: 'migracion-por-id.json'
  });
  await game.h.import();
  assert.equal(game.g.state.sightings.quebrantahuesos, 8);
  assert.equal(game.g.state.stages.quebrantahuesos, 2);
  assert.deepEqual(Object.keys(game.g.state.published), ['quebrantahuesos']);
  game.g.state.money -= 15;
  game.g.persist();
  game.h.finishTimers();
  assert.match(game.h.elements.saveManagerStatus.textContent, /Restauración confirmada/);
  assert.equal(JSON.parse(game.h.store[key]).money, save.money - 15);
});

test('AUD-03 un viaje liquidado fuera del historial visible conserva su recibo al volver a importar', () => {
  const game = open();
  const bridge = game.h.window.AtlasSaveBridge;
  const save = bridge.getSaveData();
  const route = game.g.VOYAGES.find(v => v.id === 'coast');
  const first = { id: 1, type: route.id, endAt: noon };
  save.voyages = Array.from({ length: 14 }, (_, i) => ({ ...first, id: i + 1 }));
  bridge.restoreGame(save);
  game.at(noon);
  const completed = bridge.getSaveData();
  assert.equal(game.g.state.money, save.money + route.prize * 14);
  assert.equal(completed.voyageHistory.length, 12);
  assert.ok(!completed.voyageHistory.some(entry => entry.jobId === 1));
  assert.equal(completed.voyageSettled[1], true);
  completed.voyages.push({ ...first, id: '1' });
  bridge.restoreGame(completed);
  const reopened = open(game.h.store);
  reopened.at(noon);
  assert.equal(reopened.g.state.money, completed.money);
  assert.equal(reopened.g.state.knowledge, completed.knowledge);
  assert.equal(reopened.g.state.voyageSeq, 14);
  assert.equal(reopened.g.state.museum.voyagesCompleted, 14);
  assert.equal(reopened.g.state.voyages.length, 0);
});

test('AUD-02 la cola en pantalla avanza en cuadros acotados y se guarda al salir', () => {
  let ms = 0;
  const frames = [];
  const events = {};
  const window = {
    requestAnimationFrame(fn) { frames.push(fn); },
    addEventListener(name, fn) { events[name] = fn; }
  };
  const game = open({}, () => 0.99, {
    performance: { now: () => ms++ },
    prepareWindow(w) { Object.assign(w, window); }
  });
  game.g.state.helpers = 1;
  game.at(noon + hour);
  assert.equal(frames.length, 1);
  assert.equal(game.g.state.knowledge, 0);
  frames.shift()();
  assert.ok(game.g.state.knowledge > 0 && game.g.state.knowledge < 500);
  assert.equal(frames.length, 1);
  assert.equal(game.h.imported.knowledge, 0);
  events.pagehide();
  assert.equal(game.h.imported.knowledge, game.g.state.knowledge);
  assert.equal(game.h.imported.autoPending[0].at, game.g.state.autoPending[0].at);
  for (let i = 0; i < 1000 && frames.length; i++) frames.shift()();
  assert.equal(game.g.state.knowledge, 720 * 2);
  assert.equal(game.g.state.autoPending.length, 0);
  events.pagehide();
  const reopened = open(game.h.store);
  reopened.at(noon + hour);
  assert.equal(reopened.g.state.knowledge, 720 * 2);
});
