'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { harness } = require('../tests/helpers/live-game.cjs');

const root = 'www/scientific-illustration';
const svgBaseline = 'd906224533559193e87704fa44471ea73d4069c9';
const modules = ['campamento-perfil-ui-v3430', 'gm06/catalog', 'gm06/geography', 'gm06/art', 'gm07-m01/art', 'app'];
const original = modules.map(file => execFileSync('git',
  ['show', svgBaseline + ':www/js/' + file + '.js'], { encoding: 'utf8', maxBuffer: 16e6 })).join('\n');
const game = harness({}, null, { gameSource: original }).window.__atlasTest;
const current = vm.runInNewContext(fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n;catalog;');
require('../www/js/naturalist-assets-v400.js');

const marsupials = Array.from(current).filter(species => species.group === 'Marsupiales');
const albinos = ['na_esp_didelphis_virginiana', 'oc_esp_macropus_giganteus', 'oc_esp_osphranter_rufus', 'oc_esp_vombatus_ursinus'];
assert.equal(marsupials.length, 29);
assert.deepEqual(marsupials.filter(sp => sp.records.some(record => record.key === 'albino')).map(sp => sp.id).sort(), albinos);
assert.deepEqual(marsupials.filter(sp => game.configuredSpecials(game.SPECIES[sp.id]).includes('Albino')).map(sp => sp.id).sort(), albinos);
const sizes = [64, 128, 256, 512];
function weights(directory, name) {
  return Object.fromEntries(sizes.map(size => {
    const file = path.join(directory, size === 512 ? '' : String(size), name);
    return [size, fs.existsSync(file) ? fs.statSync(file).size : null];
  }));
}

const species = marsupials.map(sp => ({
  id: sp.id, name: sp.name, latin: sp.latin, family: sp.family, rarity: sp.rarity,
  habitats: sp.habitats, regions: sp.regions, categories: sp.categories,
  variants: sp.records.map(record => {
    assert.ok(['normal', 'albino'].includes(record.key));
    assert.ok(record.cutout && record.src);
    const name = path.basename(record.src);
    const svg = game.getSpriteMarkup(sp.id, record.key);
    assert.match(svg, /^<svg[\s>]/);
    const natural = weights('www/naturalist-art/plates', name);
    const scientific = weights(root + '/plates', name);
    return { key: record.key, label: record.label, name, svg, natural, scientific,
      available: sizes.every(size => scientific[size] !== null) };
  })
}));
const records = species.flatMap(sp => sp.variants);
assert.equal(records.length, 33);
fs.writeFileSync(root + '/specimens.js',
  'globalThis.AtlasScientificMarsupials = ' + JSON.stringify({ species, svgBaseline }, null, 2) + ';\n' +
  'globalThis.AtlasNaturalistAssets = ' + JSON.stringify({ landscapes: globalThis.AtlasNaturalistAssets.landscapes }) + ';\n');
console.log(JSON.stringify({ species: species.length, plates: records.length,
  available: records.filter(record => record.available).length,
  pending: records.filter(record => !record.available).map(record => record.name) }));
