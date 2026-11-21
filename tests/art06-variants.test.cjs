'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const { harness } = require('./helpers/live-game.cjs');
const previous = require('../docs/arte-v509/inventario-aud04.json');
const current = require('../docs/arte-v5010/inventario-aud04.json');
const decisions = require('../docs/arte-v5010/decisiones.json');
const integrity = require('../docs/arte-v5010/integridad.json');
const release = require('../www/atlas-integrity.json').files;
require('../www/js/naturalist-assets-v400.js');
const assets = globalThis.AtlasNaturalistAssets;

const sizes = [64, 128, 256, 512];
const bear = 'asia_esp_0523';
const key = row => row.id + '/' + row.variant;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const baselineFile = file => execFileSync('git', ['show', integrity.baseline + ':www/' + file], { maxBuffer: 4 * 1024 * 1024 });
const approved = decisions.rows.filter(row => row.outcome === 'aprobada');

test('ART-06 verifies each transparent replacement and the retired bear archive', () => {
  assert.deepEqual(new Set(integrity.assets.map(key)), new Set(approved.map(key)));
  const changed = new Set();
  const removed = new Set();
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
      assert.deepEqual(before, baselineFile(row.previousPath || row.path));
      assert.ok(assets.labFiles.includes(row.before));
      assert.ok(!assets.files.includes(row.before));
      if (row.previousPath) {
        removed.add(row.previousPath);
        assert.ok(!fs.existsSync('www/' + row.previousPath));
        assert.ok(!release[row.previousPath]);
      }
    }
  }
  const baseline = JSON.parse(baselineFile('atlas-integrity.json')).files;
  const nature = files => Object.keys(files).filter(file => file.startsWith('naturalist-art/plates/'));
  const plates = nature(release);
  const beforePlates = nature(baseline);
  assert.equal(plates.length, 1672 * sizes.length);
  assert.equal(removed.size, 4);
  assert.deepEqual(new Set(beforePlates.filter(file => !release[file])), removed);
  assert.deepEqual(new Set(plates.filter(file => baseline[file]?.[1] !== release[file][1])), changed);
  assert.deepEqual(Object.keys(assets.routes[bear]).sort(), ['albino', 'normal']);
});

test('ART-06 retains the audited slot and updates the active viewer inventory', () => {
  const revisions = new Map(decisions.rows.map(row => [row.id + '/' + (row.replaces || row.variant), row]));
  assert.equal(revisions.size, decisions.rows.length);
  assert.equal(current.totals.auditadas, 174);
  assert.equal(current.totals.pendiente, 390);
  assert.equal(current.totals.correcta, previous.totals.correcta + approved.length);
  assert.equal(current.totals.insuficiente, previous.totals.insuficiente - approved.length);
  assert.equal(current.totals.corregidas, previous.totals.corregidas + approved.length);
  assert.equal(current.totals.mejorable, previous.totals.mejorable);
  const bearDecision = revisions.get(bear + '/melanico');
  assert.deepEqual([bearDecision.replaces, bearDecision.variant, bearDecision.outcome], ['melanico', 'albino', 'aprobada']);
  assert.equal(current.variants.length, 564);
  for (const [index, row] of previous.variants.entries()) {
    const decision = revisions.get(key(row));
    const now = current.variants[index];
    if (!decision) {
      assert.deepEqual(now, row);
      continue;
    }
    assert.equal(row.visualState, 'insuficiente', key(row));
    assert.deepEqual(now.priorAudit, row.priorAudit);
    assert.equal(now.art06.priorState, row.visualState);
    assert.equal(now.variant, decision.variant);
    assert.equal(now.visualState, decision.outcome === 'aprobada' ? 'correcta' : row.visualState);
    assert.ok(decision.eye?.color && decision.eye.why);
  }
  const script = fs.readFileSync('www/naturalist-art/pigment-audit-data.js', 'utf8');
  const items = JSON.parse(vm.runInNewContext(script + '\nJSON.stringify(pigmentAuditRecords)'));
  assert.deepEqual(items.map(key), current.variants.map(key));
  assert.equal(items.filter(row => row.variant === 'albino').length, 303);
  assert.equal(items.filter(row => row.variant === 'melanico').length, 261);
  assert.equal(items.filter(row => row.corrected).length, current.totals.corregidas);
});

test('ART-06 carries the bear collection record through load and import without inventing encounters', async () => {
  const legacy = {
    money: 356, knowledge: 212, prestige: 7, currentRegion: 'HX-01-09', lastTick: Date.now(),
    discovered: { [bear]: true }, sightings: { [bear]: 15 }, stages: { [bear]: 2 },
    specialSeen: { [bear]: 6 },
    specialFound: { [bear]: { Melánico: true, Notable: true }, zorro_rojo: { Melánico: true } },
    specialCounts: { [bear]: { Melanico: 3, Albino: 1, Notable: 2 }, zorro_rojo: { Melánico: 2 } },
    lastEncounter: {
      species: bear, title: 'Avistamiento: Oso negro asiático', subtitle: 'Melánico · +5 conocimiento',
      entries: [{ id: bear, variant: 'Melánico', amount: 1 }]
    },
    log: ['Registro histórico de oso melánico']
  };
  const prior = harness({ gran_atlas_v05: JSON.stringify(legacy) });
  const migration = state => {
    assert.deepEqual(JSON.parse(JSON.stringify(state.specialFound[bear])), { Albino: true, Notable: true });
    assert.deepEqual(JSON.parse(JSON.stringify(state.specialCounts[bear])), { Albino: 4, Notable: 2 });
    assert.equal(state.specialSeen[bear], 6);
    assert.equal(state.specialFound.zorro_rojo['Melánico'], true);
    assert.equal(state.specialCounts.zorro_rojo['Melánico'], 2);
    assert.equal(state.sightings[bear], 15);
    assert.equal(state.lastEncounter.entries[0].variant, 'Melánico');
    assert.equal(state.log[0], legacy.log[0]);
  };
  migration(prior.window.AtlasSaveBridge.getSaveData());
  const restored = harness({}, legacy);
  await restored.import();
  migration(restored.imported);
  const roundTrip = restored.window.AtlasSaveBridge.getSaveData();
  restored.window.AtlasSaveBridge.restoreGame(roundTrip);
  migration(restored.window.AtlasSaveBridge.getSaveData());
  assert.equal(legacy.specialCounts[bear].Melanico, 3);
});

test('ART-06 changes only the bear pigment label at the existing roll thresholds', () => {
  const before = harness({}, undefined, { gameSource: baselineFile('js/app.js').toString('utf8') }).window.__atlasTest;
  const after = harness().window.__atlasTest;
  assert.deepEqual(Array.from(before.configuredSpecials(before.SPECIES[bear])), ['Melánico', 'Notable']);
  assert.deepEqual(Array.from(after.configuredSpecials(after.SPECIES[bear])), ['Albino', 'Notable']);
  for (const ethology of [0, 2]) {
    for (const pigment of [0, 0.00499, 0.00501, 0.00749, 0.00751, 0.9]) {
      for (const category of [0, 0.8]) {
        const snapshot = { upgrades: { ethology } };
        const testRoll = engine => {
          const draws = [pigment, category].values();
          return engine.rollSpecimen(bear, snapshot, () => draws.next().value);
        };
        const old = testRoll(before);
        const result = testRoll(after);
        assert.equal(result.pigment, old.pigment === 'Melánico' ? 'Albino' : old.pigment);
        assert.equal(result.category, old.category);
      }
    }
  }
});
