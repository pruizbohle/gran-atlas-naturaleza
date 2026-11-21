'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const previous = require('../docs/arte-v505/inventario-aud04.json');
const evaluations = require('../docs/arte-v506/evaluaciones.json');
const decisions = require('../docs/arte-v506/decisiones.json');
const inventory = require('../docs/arte-v506/inventario-aud04.json');
const integrity = require('../docs/arte-v506/integridad.json');
const release = require('../www/atlas-integrity.json').files;
require('../www/js/naturalist-assets-v400.js');
const assets = globalThis.AtlasNaturalistAssets;

const sizes = [64, 128, 256, 512];
const key = row => row.id + '/' + row.variant;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

test('ART-02 preserves stable artwork routes, alpha and the exact historical WebPs', () => {
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
      const before = fs.readFileSync('www/' + row.before);
      assert.equal(after.toString('ascii', 0, 4), 'RIFF');
      assert.equal(after.toString('ascii', 8, 16), 'WEBPVP8X');
      assert.ok(after[20] & 0x10, row.path);
      assert.equal(after.readUIntLE(24, 3) + 1, row.size);
      assert.equal(after.readUIntLE(27, 3) + 1, row.size);
      assert.deepEqual([after.length, sha(after)], [row.newBytes, row.newSha256]);
      assert.deepEqual(release[row.path], [row.newBytes, row.newSha256]);
      assert.deepEqual([before.length, sha(before)], [row.oldBytes, row.oldSha256]);
      assert.deepEqual(before, execFileSync('git', ['show', integrity.baseline + ':www/' + row.path]));
      assert.ok(assets.labFiles.includes(row.before));
      assert.ok(!assets.files.includes(row.before));
    }
  }
  assert.equal(paths.size, 24);
});

test('ART-02 adds 32 unique assessments and retains prior histories and palette counts', () => {
  const base = new Map(previous.variants.map(row => [key(row), row]));
  const current = new Map(inventory.variants.map(row => [key(row), row]));
  const added = new Set(evaluations.map(key));
  assert.equal(base.size, 564);
  assert.equal(current.size, 564);
  assert.equal(inventory.variants.length, 564);
  assert.equal(inventory.variants.filter(row => row.variant === 'albino').length, 302);
  assert.equal(inventory.variants.filter(row => row.variant === 'melanico').length, 262);
  assert.deepEqual(new Set(current.keys()), new Set(base.keys()));
  assert.equal(added.size, 32);
  assert.equal(evaluations.length, 32);
  for (const row of evaluations) {
    assert.equal(base.get(key(row)).visualState, 'pendiente');
    assert.notEqual(current.get(key(row)).visualState, 'pendiente');
  }
  for (const [id, row] of base) {
    assert.deepEqual(current.get(id).art01, row.art01);
    if (!added.has(id) && !decisions.rows.some(item => key(item) === id)) assert.deepEqual(current.get(id), row);
  }
  const { auditadas, pendiente, correcta, mejorable, insuficiente } = inventory.totals;
  assert.equal(auditadas, 140);
  assert.equal(pendiente, 424);
  assert.equal(correcta + mejorable + insuficiente, auditadas);
  assert.deepEqual(inventory.positiveReferences, previous.positiveReferences);
});

test('ART-02 distinguishes the documented tiger morph without changing its game key or WebPs', () => {
  const tiger = decisions.rows.find(row => row.id === 'asia_esp_0402');
  assert.deepEqual([tiger.variant, tiger.outcome, tiger.morph, tiger.evidence],
    ['melanico', 'ratificada', 'Pseudomelanismo', 'Documentado']);
  const file = assets.routes[tiger.id][tiger.variant];
  for (const size of sizes) {
    const route = 'www/naturalist-art/plates/' + (size === 512 ? '' : size + '/') + file;
    assert.deepEqual(fs.readFileSync(route), execFileSync('git', ['show', integrity.baseline + ':' + route]));
  }
});
