'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const previous = require('../docs/arte-v507/inventario-aud04.json');
const current = require('../docs/arte-v508/inventario-aud04.json');
const decisions = require('../docs/arte-v508/decisiones.json');
const integrity = require('../docs/arte-v508/integridad.json');
const release = require('../www/atlas-integrity.json').files;
require('../www/js/naturalist-assets-v400.js');
const assets = globalThis.AtlasNaturalistAssets;

const sizes = [64, 128, 256, 512];
const key = row => row.id + '/' + row.variant;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const baselineFile = file => execFileSync('git', ['show', integrity.baseline + ':www/' + file], { maxBuffer: 4 * 1024 * 1024 });
const approved = decisions.rows.filter(row => row.outcome === 'aprobada');

test('ART-04 changes only approved WebPs and archives the originals at all four sizes', () => {
  assert.deepEqual(new Set(integrity.assets.map(key)), new Set(approved.map(key)));
  const changed = new Set();
  for (const item of integrity.assets) {
    assert.equal(assets.routes[item.id][item.variant], item.id + '--' + item.variant + '.webp');
    assert.deepEqual(item.resolutions.map(row => row.size), sizes);
    for (const row of item.resolutions) {
      assert.ok(!changed.has(row.path));
      changed.add(row.path);
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
      assert.deepEqual(before, baselineFile(row.path));
      assert.ok(assets.labFiles.includes(row.before));
      assert.ok(!assets.files.includes(row.before));
    }
  }
  const baseRelease = JSON.parse(baselineFile('atlas-integrity.json')).files;
  const published = JSON.parse(execFileSync('git', ['show', '75eb63d:www/atlas-integrity.json'],
    { maxBuffer: 4 * 1024 * 1024 })).files;
  const nature = files => Object.keys(files).filter(file => file.startsWith('naturalist-art/plates/'));
  const plates = nature(published);
  assert.deepEqual(plates, nature(baseRelease));
  assert.equal(plates.length, 1672 * sizes.length);
  const releasesChanged = plates.filter(file => baseRelease[file][1] !== published[file][1]);
  assert.deepEqual(new Set(releasesChanged), changed);
});

test('ART-04 preserves 174 audited variants and intervenes only in previously recorded defects', () => {
  const revised = new Map(decisions.rows.map(row => [key(row), row]));
  assert.equal(revised.size, decisions.rows.length);
  assert.equal(current.variants.length, 564);
  assert.deepEqual(current.variants.map(key), previous.variants.map(key));
  assert.equal(current.totals.auditadas, 174);
  assert.equal(current.totals.pendiente, 390);
  assert.equal(current.totals.correcta, previous.totals.correcta + approved.length);
  assert.equal(current.totals.corregidas, previous.totals.corregidas + approved.length);
  assert.equal(current.totals.correccionesAprobadas, previous.totals.correccionesAprobadas + approved.length);
  for (const id of ['af_facoquero', 'asia_esp_0834', 'asia_esp_0344', 'af_elefante_sabana', 'af_elefante_bosque']) {
    assert.equal(revised.get(id + '/melanico')?.outcome, 'aprobada');
  }
  assert.ok(!revised.has('asia_esp_0523/melanico'));
  for (const [index, row] of previous.variants.entries()) {
    const decision = revised.get(key(row));
    const now = current.variants[index];
    if (!decision) {
      assert.deepEqual(now, row);
      continue;
    }
    assert.ok(['mejorable', 'insuficiente'].includes(row.visualState), key(row));
    assert.deepEqual(now.priorAudit, row.priorAudit);
    assert.equal(now.art04.priorState, row.visualState);
    assert.ok(decision.eye?.color && decision.eye.why);
    assert.equal(now.visualState, decision.outcome === 'aprobada' ? 'correcta' : row.visualState);
  }
});
