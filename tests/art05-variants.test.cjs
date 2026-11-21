'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const previous = require('../docs/arte-v508/inventario-aud04.json');
const current = require('../docs/arte-v509/inventario-aud04.json');
const decisions = require('../docs/arte-v509/decisiones.json');
const integrity = require('../docs/arte-v509/integridad.json');
const release = require('../www/atlas-integrity.json').files;
const publishedFile = file => execFileSync('git', ['show', '415b36a:www/' + file], { maxBuffer: 4 * 1024 * 1024 });
require('../www/js/naturalist-assets-v400.js');
const assets = globalThis.AtlasNaturalistAssets;

const sizes = [64, 128, 256, 512];
const key = row => row.id + '/' + row.variant;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const baselineFile = file => execFileSync('git', ['show', integrity.baseline + ':www/' + file], { maxBuffer: 4 * 1024 * 1024 });
const approved = decisions.rows.filter(row => row.outcome === 'aprobada');

test('ART-05 changes only approved WebPs and archives the originals at all four sizes', () => {
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
  const nature = files => Object.keys(files).filter(file => file.startsWith('naturalist-art/plates/'));
  const published = JSON.parse(publishedFile('atlas-integrity.json')).files;
  const plates = nature(published);
  assert.deepEqual(plates, nature(baseRelease));
  assert.equal(plates.length, 1672 * sizes.length);
  const releasesChanged = plates.filter(file => baseRelease[file][1] !== published[file][1]);
  assert.deepEqual(new Set(releasesChanged), changed);
});

test('ART-05 preserves 174 audited variants and intervenes only in previously recorded defects', () => {
  const revised = new Map(decisions.rows.map(row => [key(row), row]));
  assert.equal(revised.size, decisions.rows.length);
  assert.equal(current.variants.length, 564);
  assert.deepEqual(current.variants.map(key), previous.variants.map(key));
  assert.equal(current.totals.auditadas, 174);
  assert.equal(current.totals.pendiente, 390);
  assert.equal(current.totals.correcta, previous.totals.correcta + approved.length);
  assert.equal(current.totals.corregidas, previous.totals.corregidas + approved.length);
  assert.equal(current.totals.correccionesAprobadas, previous.totals.correccionesAprobadas + approved.length);
  assert.equal(approved.length, 8);
  assert.equal(current.totals.insuficiente, previous.totals.insuficiente - approved.length);
  assert.ok(!revised.has('asia_esp_0523/melanico'));
  for (const [index, row] of previous.variants.entries()) {
    const decision = revised.get(key(row));
    const now = current.variants[index];
    if (!decision) {
      assert.deepEqual(now, row);
      continue;
    }
    assert.equal(row.visualState, 'insuficiente', key(row));
    assert.deepEqual(now.priorAudit, row.priorAudit);
    assert.equal(now.art05.priorState, row.visualState);
    assert.ok(decision.eye?.color && decision.eye.why);
    assert.equal(now.visualState, decision.outcome === 'aprobada' ? 'correcta' : row.visualState);
  }
});

test('ART-05 viewer includes every configured pigment and mirrors the current audit', () => {
  const script = publishedFile('naturalist-art/pigment-audit-data.js').toString('utf8');
  const records = vm.runInNewContext(script + '\nJSON.stringify(pigmentAuditRecords)');
  const items = JSON.parse(records);
  const published = JSON.parse(publishedFile('atlas-integrity.json')).files;
  assert.equal(items.length, 564);
  assert.equal(new Set(items.map(key)).size, 564);
  assert.equal(items.filter(row => row.variant === 'albino').length, 302);
  assert.equal(items.filter(row => row.variant === 'melanico').length, 262);
  assert.equal(items.filter(row => row.corrected).length, current.totals.corregidas);
  for (const [index, item] of items.entries()) {
    const row = current.variants[index];
    assert.equal(key(item), key(row));
    assert.equal(item.state, row.visualState);
    assert.equal(item.finding, row.observation);
    assert.ok(published['naturalist-art/plates/' + row.plate], key(item));
  }
});
