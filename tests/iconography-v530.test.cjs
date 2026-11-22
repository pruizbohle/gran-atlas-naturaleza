'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { harness } = require('./helpers/live-game.cjs');
require('../www/js/iconography-v530.js');
require('../www/iconoteca/library-data.js');

const icons = globalThis.AtlasIcons530;
const library = globalThis.AtlasIconLibrary530;
const { files } = require('../www/atlas-integrity.json');

test('V5.3 uses one checked transparent asset per illustrated catalogue entry', () => {
  const directory = 'iconoteca/arte/';
  const names = new Set(library.items.filter(row => row.icon && !row.icon.startsWith('glyph:')).map(row => row.icon));
  assert.deepEqual([...names].sort(), fs.readdirSync('www/' + directory).map(file => path.basename(file, '.webp')).sort());
  assert.equal(new Set(library.items.map(row => row.id)).size, library.items.length);
  assert.equal(library.categories.length, 8);
  for (const name of names) {
    const resource = directory + name + '.webp';
    const data = fs.readFileSync('www/' + resource);
    assert.equal(data.toString('ascii', 8, 16), 'WEBPVP8X', resource);
    assert.ok(data[20] & 0x10, resource);
    assert.equal(data.readUIntLE(24, 3) + 1, 128, resource);
    assert.equal(data.readUIntLE(27, 3) + 1, 128, resource);
    assert.deepEqual(files[resource], [data.length, createHash('sha256').update(data).digest('hex')], resource);
  }
  for (const [id, art] of Object.entries(icons.objects)) {
    assert.ok(names.has(art));
    assert.equal(library.items.find(row => row.id === 'obj-' + id).status, 'corregido');
  }
  for (const art of Object.values(icons.tabs)) assert.ok(names.has(art), art);
});

test('V5.3 covers every in-game habitat and retains the world catalogue', () => {
  const modules = ['gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art', 'gm07-p04/catalog', 'gm07-a04/catalog', 'app'];
  const gameSource = modules.map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
  const game = harness({}, null, { gameSource }).window.__atlasTest;
  for (const habitat of new Set(game.REGIONS.flatMap(region => region.habitats))) {
    assert.ok(icons.biomes[habitat], habitat);
    assert.ok(files['iconoteca/arte/biome-' + icons.biomes[habitat] + '.webp'], habitat);
  }
  assert.equal(Object.keys(game.SPECIES).length, 1000);
  assert.equal(game.REGIONS.length, 125);
  assert.equal(game.LEGENDARY_SPECIMENS.length, 30);
  assert.equal(game.MUSEUM_RELICTS.length, 20);
});
