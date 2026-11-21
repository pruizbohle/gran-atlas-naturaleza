'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const previous = require('../docs/arte-v506/inventario-aud04.json');
const evaluations = require('../docs/arte-v507/evaluaciones.json');
const decisions = require('../docs/arte-v507/decisiones.json');
const inventory = require('../docs/arte-v507/inventario-aud04.json');
const integrity = require('../docs/arte-v507/integridad.json');
const release = require('../www/atlas-integrity.json').files;
require('../www/js/naturalist-assets-v400.js');
const assets = globalThis.AtlasNaturalistAssets;

const sizes = [64, 128, 256, 512];
const key = row => row.id + '/' + row.variant;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

test('ART-03 preserves all stable routes and archives each replaced alpha WebP exactly', () => {
  assert.equal(assets.files.filter(file => file.startsWith('naturalist-art/plates/')).length, 1672 * sizes.length);
  assert.equal(integrity.assets.length, 6);
  const paths = new Set();
  for (const item of integrity.assets) {
    assert.equal(assets.routes[item.id][item.variant], item.id + '--' + item.variant + '.webp');
    assert.deepEqual(item.resolutions.map(row => row.size), sizes);
    for (const row of item.resolutions) {
      assert.ok(!paths.has(row.path));
      paths.add(row.path);
      const after = fs.readFileSync('www/' + row.path);
      assert.equal(after.toString('ascii', 0, 4), 'RIFF');
      assert.equal(after.toString('ascii', 8, 16), 'WEBPVP8X');
      assert.ok(after[20] & 0x10, row.path);
      assert.equal(after.readUIntLE(24, 3) + 1, row.size);
      assert.equal(after.readUIntLE(27, 3) + 1, row.size);
      assert.deepEqual([after.length, sha(after)], [row.newBytes, row.newSha256]);
      assert.deepEqual(release[row.path], [row.newBytes, row.newSha256]);
      const before = fs.readFileSync('www/' + row.before);
      assert.deepEqual([before.length, sha(before)], [row.oldBytes, row.oldSha256]);
      assert.deepEqual(before, execFileSync('git', ['show', integrity.baseline + ':www/' + row.path]));
      assert.ok(assets.labFiles.includes(row.before));
      assert.ok(!assets.files.includes(row.before));
    }
  }
  assert.equal(paths.size, 24);
});

test('ART-03 audits 34 new variants while preserving the 564 keys and earlier decisions', () => {
  const base = new Map(previous.variants.map(row => [key(row), row]));
  const current = new Map(inventory.variants.map(row => [key(row), row]));
  const added = new Set(evaluations.map(key));
  assert.equal(inventory.variants.length, 564);
  assert.equal(inventory.variants.filter(row => row.variant === 'albino').length, 302);
  assert.equal(inventory.variants.filter(row => row.variant === 'melanico').length, 262);
  assert.deepEqual(new Set(current.keys()), new Set(base.keys()));
  assert.equal(evaluations.length, 34);
  assert.equal(added.size, 34);
  for (const id of added) {
    assert.equal(base.get(id).visualState, 'pendiente');
    assert.notEqual(current.get(id).visualState, 'pendiente');
  }
  for (const [id, row] of base) {
    for (const stage of ['art01', 'art02']) assert.deepEqual(current.get(id)[stage], row[stage]);
    if (!added.has(id) && !decisions.rows.some(item => key(item) === id)) assert.deepEqual(current.get(id), row);
  }
  assert.deepEqual(inventory.totals, { auditadas: 174, correcta: 30, mejorable: 104, insuficiente: 40,
    pendiente: 390, corregidas: 21, correccionesAprobadas: 23, propuestasRechazadas: 7 });
});

test('ART-03 records ocular decisions and leaves the unsupported bear variant in review', () => {
  const bear = decisions.rows.find(row => row.id === 'asia_esp_0523');
  assert.deepEqual([bear.variant, bear.outcome, bear.evidence], ['melanico', 'pendiente', 'Sin confirmar']);
  assert.equal(inventory.variants.find(row => key(row) === key(bear)).visualState, 'insuficiente');
  const file = assets.routes[bear.id][bear.variant];
  for (const size of sizes) {
    const route = 'www/naturalist-art/plates/' + (size === 512 ? '' : size + '/') + file;
    assert.deepEqual(fs.readFileSync(route), execFileSync('git', ['show', integrity.baseline + ':' + route]));
  }
  for (const row of decisions.rows) {
    assert.ok(row.eye.normal && row.eye.color && row.eye.why);
    assert.equal(typeof row.eye.changed, 'boolean');
  }
  assert.deepEqual(decisions.rows.filter(row => row.eye.changed).map(row => row.id).sort(),
    ['asia_esp_0086', 'na_esp_odocoileus_virginianus']);
});
