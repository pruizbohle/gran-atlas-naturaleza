'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const {make} = require('./helpers/mec01-game.cjs');
const plan = require('../docs/art-obj-13/planchas.json');
const notes = require('../docs/art-obj-13/notas.json');
const historicalNotes = require('../docs/art-obj-12/recuperacion.json').descriptions;
const read = name => fs.readFileSync('www/' + name, 'utf8');
const runtime = ['js/art-obj-12-assets.js','js/art-obj-12.js'].map(read).join('\n');
require('../www/art-obj-12/data.js');
const reviewed = new Map(globalThis.AtlasObjectArtReview.map(row => [row.id,row]));

test('ART-OBJ-13 · cada ficha publicada sujeta a la auditoría inicial tiene sus cuatro variantes', () => {
  const raw = fs.readFileSync('docs/art-obj-12/coleccionables-v56-pendientes.csv','utf8');
  const pending = new Set(raw.split('\n').slice(1).map(line => line.split('"')[1]).filter(Boolean));
  const ids = Object.values(plan).flatMap(lot => lot.flatMap(sheet => sheet.ids.filter(Boolean)));
  assert.equal(pending.size,129);
  assert.equal(new Set(ids).size,129);
  assert.equal(ids.length,129);
  assert.equal([...reviewed.values()].filter(row => row.lot === 'coleccionables' && row.paths).length,431);
  for (const id of ids) {
    const row = reviewed.get(id);
    assert.ok(pending.has(id),id);
    assert.equal(row.origin,'ART-OBJ-13',id);
    assert.deepEqual(Object.keys(row.paths),['64','128','256','512'],id);
    assert.ok(row.cabinet && row.family,id);
  }
  for (const id of pending) {
    assert.equal(Boolean(reviewed.get(id).paths),ids.includes(id),id);
  }
});

test('ART-OBJ-13 · Inventario, Gabinetes y ficha usan el mismo ID artístico', () => {
  const h = make({headless:false,full:true,app:runtime+'\n'+read('js/app.js')});
  const change = (type,dataset,value) => {
    for (const cb of h.elements.panel.listeners[type] || []) cb({target:{dataset,value}});
  };
  for (const sheets of Object.values(plan)) {
    const id = sheets[0].ids[0];
    const row = reviewed.get(id);
    h.g.addInventory(id,1);
    h.g.state.inventoryView='coleccionables';
    h.g.open('objects');
    change('change',{mec01Filter:'col'},row.category);
    assert.match(h.elements.panel.innerHTML,new RegExp('data-object-art="'+id+'"'));
    h.g.state.museum.wing=5;
    h.g.state.museumView='samples';
    h.g.open('museum');
    change('input',{mec01CabQuery:row.cabinet},row.name);
    assert.match(h.elements.panel.innerHTML,new RegExp('data-object-art="'+id+'"'));
    const art = h.A.detailModel(id).art;
    assert.ok(art.includes(row.paths[256]),id);
    assert.ok(art.includes(row.paths[512] + '?retina=1'),id);
  }
  for (const [id,note] of Object.entries(notes)) {
    assert.equal(reviewed.get(id).note,note,id);
    assert.equal(h.A.detailModel(id).description,note,id);
  }
  for (const [id,note] of Object.entries(historicalNotes)) {
    if (id.startsWith('RAR-')) assert.equal(h.A.detailModel(id).description,note,id);
  }
});
