'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const previous = require('../docs/arte-v5011/inventario-aud04.json');
const current = require('../docs/arte-v5012/inventario-aud04.json');
const decisions = require('../docs/arte-v5012/decisiones.json');
const integrity = require('../docs/arte-v5012/integridad.json');
const issued = file => execFileSync('git', ['show', 'ee39bfc:' + file], { maxBuffer: 8 * 1024 * 1024 });
const release = JSON.parse(issued('www/atlas-integrity.json')).files;
const sandbox = { globalThis: {} };
vm.runInNewContext(issued('www/js/naturalist-assets-v400.js').toString(), sandbox);
const assets = JSON.parse(JSON.stringify(sandbox.globalThis.AtlasNaturalistAssets));
const sizes = [64, 128, 256, 512];
const key = row => row.id + '/' + row.variant;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const baseline = file => execFileSync('git', ['show', '8ff5428:' + file], { maxBuffer: 8 * 1024 * 1024 });
const approved = decisions.rows.filter(row => row.outcome === 'aprobada');
const plates = files => Object.keys(files).filter(file => file.startsWith('naturalist-art/plates/'));

test('ART-08 alters only approved WebP files, preserving all routes and original bytes', () => {
  const sandbox = { globalThis: {} };
  vm.runInNewContext(baseline('www/js/naturalist-assets-v400.js').toString(), sandbox);
  const original = JSON.parse(JSON.stringify(sandbox.globalThis.AtlasNaturalistAssets));
  assert.deepEqual(assets.routes, original.routes);
  assert.deepEqual(assets.files, original.files);
  assert.ok(original.labFiles.every(file => assets.labFiles.includes(file)));
  assert.deepEqual(new Set(integrity.assets.map(key)), new Set(approved.map(key)));
  const prior = JSON.parse(baseline('www/atlas-integrity.json')).files;
  assert.deepEqual(plates(release), plates(prior));
  const changed = new Set(plates(release).filter(file => prior[file][1] !== release[file][1]));
  const expected = integrity.assets.flatMap(item => {
    assert.deepEqual(item.resolutions.map(row => row.size), sizes);
    return item.resolutions.map(row => {
      const after = fs.readFileSync('www/' + row.path);
      const before = fs.readFileSync('www/' + row.before);
      assert.equal(after.toString('ascii', 0, 4), 'RIFF');
      assert.equal(after.toString('ascii', 8, 16), 'WEBPVP8X');
      assert.ok(after[20] & 0x10, row.path);
      assert.equal(after.readUIntLE(24, 3) + 1, row.size);
      assert.equal(after.readUIntLE(27, 3) + 1, row.size);
      assert.deepEqual([after.length, sha(after)], release[row.path]);
      assert.deepEqual([after.length, sha(after)], [row.newBytes, row.newSha256]);
      assert.deepEqual([before.length, sha(before)], [row.oldBytes, row.oldSha256]);
      assert.deepEqual(before, baseline('www/' + row.path));
      assert.ok(assets.labFiles.includes(row.before));
      assert.ok(!assets.files.includes(row.before));
      return row.path;
    });
  });
  assert.equal(changed.size, approved.length * sizes.length);
  assert.deepEqual(changed, new Set(expected));
});

test('ART-08 accounts for audited variants once and leaves other decisions intact', () => {
  const planned = {
    A: new Set(['af_fosa_ave/melanico', 'af_aguila_pescadora/melanico', 'af_caracal/albino',
      'af_gato_montes_africano/melanico', 'af_guepardo/melanico', 'af_fenec/albino', 'af_cocodrilo_nilo/albino',
      'af_elefante_bosque/albino', 'af_cebra_llanura/albino', 'af_chacal_dorado/melanico']),
    B: new Set(['af_ciervo_berberia/albino', 'af_dromedario/albino', 'af_facoquero/albino', 'af_hipopotamo/albino',
      'af_jirafa/albino', 'af_okapi/albino', 'af_leopardo/melanico', 'af_licaon/melanico',
      'af_lobo_etiope/melanico', 'af_nu_azul/albino'])
  };
  const revisions = new Map(decisions.rows.map(row => [key(row), row]));
  assert.equal(revisions.size, decisions.rows.length);
  assert.deepEqual(new Set(decisions.rows.filter(row => row.lot === 'A').map(key)), planned.A);
  const lotB = decisions.rows.filter(row => row.lot === 'B');
  assert.deepEqual(new Set(lotB.map(key)), planned.B);
  assert.equal(new Set(decisions.rows.map(row => row.id)).size, decisions.rows.length);
  assert.equal(current.totals.auditadas, 174);
  assert.equal(current.totals.correcta, 68 + approved.length);
  assert.equal(current.totals.mejorable, 104 - approved.length);
  assert.equal(current.totals.insuficiente, 2);
  assert.equal(current.totals.pendiente, 390);
  assert.equal(current.totals.corregidas, previous.totals.corregidas + approved.length);
  assert.equal(current.variants.length, 564);

  for (const [index, row] of previous.variants.entries()) {
    const decision = revisions.get(key(row));
    const now = current.variants[index];
    if (!decision) {
      assert.deepEqual(now, row);
      continue;
    }
    assert.equal(row.visualState, 'mejorable', key(row));
    assert.equal(now.art08.priorFinding, row.observation);
    assert.equal(now.plate, row.plate);
    assert.equal(now.normal, row.normal);
    assert.equal(now.visualState, decision.outcome === 'aprobada' ? 'correcta' : 'mejorable');
    assert.deepEqual(now.reviewedSizes, sizes);
    assert.ok(decision.eye?.color && decision.eye.why && decision.evidence && decision.note);
    assert.ok(fs.existsSync('docs/arte-v5012/comparativas/' + decision.lot + '/' + row.plate.replace('.webp', '.jpg')));
    if (decision.rejected) assert.ok(fs.existsSync('docs/arte-v5012/comparativas/' + decision.lot + '/' +
      row.plate.replace('.webp', '--rechazo.jpg')));
  }
  const viewer = fs.readFileSync('www/naturalist-art/pigment-audit-data.js', 'utf8');
  const items = JSON.parse(vm.runInNewContext(viewer + '\nJSON.stringify(pigmentAuditRecords)'));
  assert.deepEqual(items.map(key), current.variants.map(key));
  assert.deepEqual(items.map(row => row.state), current.variants.map(row => row.visualState));
  assert.equal(items.filter(row => row.variant === 'albino').length, 303);
  assert.equal(items.filter(row => row.variant === 'melanico').length, 261);
  assert.equal(items.filter(row => row.corrected).length, current.totals.corregidas);
});
