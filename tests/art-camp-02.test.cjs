'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
require('../www/art-camp-02/assets.js');
require('../www/js/mec02-camp.js');
require('../www/js/campamento-perfil-ui-v3430.js');
require('../www/js/mec02-camp-ui.js');

const art = globalThis.AtlasCampArt;
const rules = globalThis.AtlasCampMEC02;
const ui = globalThis.AtlasCampMEC02UI;
const camp = globalThis.AtlasCampProfile3430;

test('ART-CAMP-02 conserva las 25 ranuras MEC-02 y añade cinco etapas visuales', () => {
  assert.equal(Object.keys(art.entries).length,30);
  assert.deepEqual(art.zones.map(zone=>zone.id),['shipyard','caravan','workshop','excavations','surveys','central-camp']);
  for (const [id, reference] of Object.entries(rules.ART)) {
    const entry = art.entries[id];
    assert.equal(entry.sector,reference.facility,id);
    assert.equal(entry.level,reference.level,id);
    assert.equal(entry.name,rules.stageOf(entry.sector,entry.level).name,id);
  }
  assert.equal(rules.facility('central-camp'),null);
  const integrity = require('../www/atlas-integrity.json').files;
  for (const path of art.files) {
    assert.ok(fs.statSync('www/' + path).isFile(),path);
    assert.ok(integrity[path],path);
  }
});

test('ART-CAMP-02 muestra en el plano y la ficha la misma variante del nivel vigente', () => {
  const model = level => Object.fromEntries(rules.FACILITIES.map(f=>[f.id,{artLevel:level,kind:'ready',label:'Disponible'}]));
  for (let level = 1; level <= 5; level++) {
    const map = camp.camp(model(level),'');
    for (const f of rules.FACILITIES) {
      const entry = art.stage(f.id,level);
      const card = ui.card({id:f.id,artRef:entry.id,functions:[],art:'ICONO-DE-RESERVA'});
      if (entry.file) {
        for (const size of [384,768]) {
          assert.ok(map.includes(art.src(entry,size)),entry.id);
          assert.ok(card.includes(art.src(entry,size)),entry.id);
        }
      } else {
        assert.ok(card.includes('ICONO-DE-RESERVA'),entry.id);
      }
    }
    assert.ok(!/central-camp-[2-5]-/.test(map));
    assert.ok(map.includes('data-cp-shop'));
  }
});
