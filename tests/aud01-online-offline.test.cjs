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
function open(store = {}, random = () => 0.99) {
  let now = noon;
  class Clock extends Date { static now() { return now; } }
  const h = harness(store, null, { Date: Clock, rng: random, gameSource });
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
