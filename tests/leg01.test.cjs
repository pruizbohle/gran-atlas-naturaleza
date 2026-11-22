'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const vm = require('node:vm');
const { harness } = require('./helpers/live-game.cjs');
const decisions = require('../docs/leg01/decisiones.json');

const sizes = [64, 128, 256, 512];
const revisionFile = (revision, file) => execFileSync('git', ['show', revision + ':' + file], { maxBuffer: 16e6 });
const previousFile = file => revisionFile('ee39bfc', file);
const leg01File = file => revisionFile('1f136518', file);
const manifest = JSON.parse(leg01File('www/atlas-integrity.json')).files;
const assetsContext = vm.createContext({});
vm.runInContext(leg01File('www/js/naturalist-assets-v400.js').toString(), assetsContext);
const packed = assetsContext.AtlasNaturalistAssets;
const leg01Source = leg01File('www/js/app.js').toString();
const previous = harness({}, null, { gameSource: previousFile('www/js/app.js').toString() }).window.__atlasTest;
const game = harness({}, null, { gameSource: leg01Source }).window.__atlasTest;
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const participating = decisions.filter(row => ['nuevo', 'revisado'].includes(row.status));

test('LEG-01 preserves the twelve original identities and appends eligibility without changing existing rates', () => {
  const snapshot = value => JSON.parse(JSON.stringify(value));
  assert.deepEqual(snapshot(game.LEGENDARY_SPECIMENS.slice(0, 12)), snapshot(previous.LEGENDARY_SPECIMENS));
  assert.equal(game.LEGENDARY_SPECIMENS.length, 20);
  assert.equal(new Set(game.LEGENDARY_SPECIMENS.map(row => row.id)).size, 20);
  const newIds = new Set(decisions.filter(row => row.status === 'nuevo').map(row => row.speciesId));
  assert.equal(newIds.size, 8);
  for (const id of Object.keys(previous.SPECIES)) {
    assert.deepEqual(snapshot(game.SPECIES[id].special), snapshot(previous.SPECIES[id].special), id);
    for (const ethology of [0, 2]) {
      const rates = snapshot(previous.specimenRates(id, ethology));
      if (newIds.has(id)) rates.Legendario = .0001 * (ethology === 2 ? 1.5 : 1);
      assert.deepEqual(snapshot(game.specimenRates(id, ethology)), rates, id);
    }
  }
});

test('LEG-01 catalogues only approved plates and preserves the original variants and earlier legends', () => {
  const old = JSON.parse(previousFile('www/atlas-integrity.json')).files;
  const changed = Object.keys(manifest).filter(file => file.startsWith('naturalist-art/plates/') && old[file]?.[1] !== manifest[file][1]);
  assert.ok(Object.keys(old).filter(file => file.startsWith('naturalist-art/plates/')).every(file => manifest[file]));
  const expected = participating.flatMap(row => {
    const file = row.speciesId + '--' + row.id + '.webp';
    assert.equal(packed.routes[row.speciesId].legendario, file);
    return sizes.map(size => {
      const relative = (size === 512 ? '' : size + '/') + file;
      const route = 'naturalist-art/plates/' + relative;
      const bytes = leg01File('www/' + route);
      assert.equal(bytes.toString('ascii', 8, 16), 'WEBPVP8X', route);
      assert.ok(bytes[20] & 0x10, route);
      assert.equal(bytes.readUIntLE(24, 3) + 1, size, route);
      assert.equal(bytes.readUIntLE(27, 3) + 1, size, route);
      assert.deepEqual([bytes.length, sha(bytes)], manifest[route]);
      assert.ok(packed.files.includes(route));
      if (row.status === 'revisado') {
        const archive = 'naturalist-art/review/leg01/' + relative;
        assert.ok(packed.labFiles.includes(archive));
        assert.deepEqual(fs.readFileSync('www/' + archive), previousFile('www/' + route));
      }
      return route;
    });
  });
  assert.deepEqual(new Set(changed), new Set(expected));
  const review = vm.runInNewContext(leg01File('www/naturalist-art/catalog.js').toString() + '\nlegendaryComparisons');
  assert.equal(review.all.legendary.length, 20);
  assert.equal(review.new.legendary.length, 8);
  for (const required of ['ascua', 'atlas']) {
    assert.ok(review.revised.legendary.some(row => row.legendaryId === required), required);
  }
  assert.deepEqual(fs.readFileSync('www/naturalist-art/pigment-audit-data.js'), previousFile('www/naturalist-art/pigment-audit-data.js'));
});

test('LEG-01 discovers and restores each identity without duplicating it', async () => {
  const h = harness({}, null, { gameSource: leg01Source });
  const current = h.window.__atlasTest;
  const archived = {
    ...JSON.parse(JSON.stringify(current.state)),
    collectionId: 'leg01-prior-save',
    legendaryFound: { ascua: { id: 'ascua', speciesId: 'zorro_rojo' }, atlas: { id: 'atlas', speciesId: 'af_elefante_sabana' } }
  };
  const target = harness({}, archived, { gameSource: leg01Source });
  await target.import();
  assert.deepEqual(target.imported.legendaryFound, archived.legendaryFound);
  for (const row of game.LEGENDARY_SPECIMENS.slice(12)) {
    const { speciesId, id } = row;
    const rates = target.window.__atlasTest.specimenRates(speciesId);
    const offset = Object.entries(rates).filter(([name]) => name !== 'Legendario').reduce((sum, [, value]) => sum + value, 0);
    const trial = () => {
      const draws = [0.99, offset + rates.Legendario / 2].values();
      return target.window.__atlasTest.rollSpecimen(speciesId, target.window.__atlasTest.state, () => draws.next().value);
    };
    const found = trial();
    assert.equal(found.category, 'Legendario', id);
    target.window.__atlasTest.recordSpecimen(speciesId, found, target.window.__atlasTest.state);
    assert.equal(trial().category, '', id);
    target.window.__atlasTest.recordSpecimen(speciesId, found, target.window.__atlasTest.state);
    assert.equal(target.window.__atlasTest.state.specialSeen[speciesId], 1, id);
  }
  target.window.__atlasTest.persist();
  const saved = harness(target.store, null, { gameSource: leg01Source }).window.__atlasTest;
  assert.equal(Object.keys(saved.state.legendaryFound).length, 10);
  assert.match(saved.renderLegendaryCollection(), /10\/20/);
});
