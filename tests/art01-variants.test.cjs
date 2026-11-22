'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const inventory = require('../docs/arte-v505/inventario-aud04.json');
const integrity = require('../docs/arte-v505/integridad.json');
require('../www/js/naturalist-assets-v400.js');
const assets = globalThis.AtlasNaturalistAssets;
const release = require('../www/atlas-integrity.json').files;

test('ART-01 Las 44 variantes WebP tienen dimensiones y alfa válidos, conservan la ruta y archivan los originales exactos', () => {
  const count = integrity.assets.reduce((total, entry) => total + entry.resolutions.length, 0);
  assert.equal(count, 44);
  assert.equal(assets.files.length, 6776);
  const seen = new Set();
  for (const entry of integrity.assets) {
    const stem = entry.id + '--' + entry.variant + '.webp';
    assert.equal(assets.routes[entry.id][entry.variant], stem);
    assert.deepEqual(entry.resolutions.map(r => r.size), [64, 128, 256, 512]);
    for (const row of entry.resolutions) {
      assert.ok(!seen.has(row.path));
      seen.add(row.path);
      const file = fs.readFileSync('www/' + row.path);
      assert.equal(file.toString('ascii', 0, 4), 'RIFF');
      assert.equal(file.toString('ascii', 8, 16), 'WEBPVP8X');
      assert.ok(file[20] & 0x10, row.path);
      assert.equal(file.readUIntLE(24, 3) + 1, row.size);
      assert.equal(file.readUIntLE(27, 3) + 1, row.size);
      assert.deepEqual(release[row.path], [file.length, createHash('sha256').update(file).digest('hex')]);
      assert.ok(assets.labFiles.includes(row.before));
      assert.ok(!assets.files.includes(row.before));
      const before = fs.readFileSync('www/' + row.before);
      assert.deepEqual(before, execFileSync('git', ['show', integrity.baseline + ':www/' + row.path]));
    }
  }
});

test('ART-01 El inventario conserva 564 variantes y contabiliza por separado la revisión y las correcciones', () => {
  const keys = new Set(inventory.variants.map(r => r.id + '/' + r.variant));
  assert.equal(inventory.variants.length, keys.size);
  assert.equal(keys.size, 564);
  assert.equal(inventory.variants.filter(r => r.variant === 'albino').length, 302);
  assert.equal(inventory.variants.filter(r => r.variant === 'melanico').length, 262);
  assert.equal(inventory.variants.filter(r => r.visualState !== 'pendiente').length, inventory.totals.auditadas);
  assert.equal(inventory.totals.auditadas, 108);
  assert.equal(inventory.totals.pendiente, 456);
  for (const id of inventory.positiveReferences) {
    const entry = inventory.variants.find(r => r.id + '/' + r.variant === id);
    assert.equal(entry.visualState, 'correcta');
    assert.equal(entry.art01, undefined);
  }
  const edited = inventory.variants.filter(r => r.art01?.outcome === 'aprobada');
  assert.equal(edited.length, 11);
  assert.equal(edited.length, inventory.totals.correccionesAprobadas);
  assert.equal(edited.filter(r => r.art01.rejected).length, 3);
});
