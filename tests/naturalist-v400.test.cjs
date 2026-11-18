'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const { harness } = require('./helpers/live-game.cjs');

const read = name => fs.readFileSync('www/js/' + name + '.js', 'utf8');
const added = ['naturalist-assets-v400', 'naturalist-art-v400'];
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
  assert.deepEqual(counts, { Marsupiales: 29, Monotremas: 3, Felinos: 31 });
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
