'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');

const lot = 'docs/arte-v506';
const root = 'www/naturalist-art';
const baseline = JSON.parse(fs.readFileSync('docs/arte-v505/inventario-aud04.json'));
const evaluations = JSON.parse(fs.readFileSync(lot + '/evaluaciones.json'));
const decisions = JSON.parse(fs.readFileSync(lot + '/decisiones.json'));
const sizes = [64, 128, 256, 512];
const key = row => row.id + '/' + row.variant;
const sha = (bytes, algorithm = 'sha256') => createHash(algorithm).update(bytes).digest('hex');
const entries = new Map(baseline.variants.map(row => [key(row), row]));
const assets = [];

for (const item of evaluations) {
  const row = entries.get(key(item));
  assert.equal(row?.visualState, 'pendiente', key(item));
  assert.equal(row.family, item.family, key(item));
  assert.ok(Object.hasOwn(baseline.states, item.status) && item.status !== 'pendiente');
  row.visualState = item.status;
  row.observation = item.observation;
  row.reviewedSizes = item.sizes;
  row.priorAudit = 'arte-v506/evaluaciones.json';
}

const seen = new Set();
const lab = decisions.rows.map(decision => {
  const id = key(decision);
  const row = entries.get(id);
  assert.ok(row && row.visualState !== 'pendiente' && !seen.has(id), id);
  seen.add(id);
  const { outcome, morph, evidence, note, rejected, history } = decision;
  const approved = outcome === 'aprobada';
  const historyFiles = history ? Object.fromEntries(sizes.map(size => {
    const file = 'review/' + history + '/' + (size === 512 ? '' : size + '/') + row.plate;
    assert.ok(fs.existsSync(root + '/' + file), file);
    return [size, file];
  })) : undefined;
  const before = {};
  if (approved) {
    const resolutions = sizes.map(size => {
      const file = (size === 512 ? '' : size + '/') + row.plate;
      before[size] = 'review/art02/' + file;
      const previous = fs.readFileSync(root + '/' + before[size]);
      const current = fs.readFileSync(root + '/plates/' + file);
      assert.notEqual(sha(previous), sha(current), file);
      return { size, path: 'naturalist-art/plates/' + file, before: 'naturalist-art/' + before[size],
        oldBytes: previous.length, newBytes: current.length, oldSha256: sha(previous), newSha256: sha(current) };
    });
    assets.push({ id: row.id, variant: row.variant, resolutions });
    const current = fs.readFileSync(root + '/plates/' + row.plate);
    const normal = fs.statSync(root + '/plates/' + row.normal);
    row.sha = sha(Buffer.concat([Buffer.from('blob ' + current.length + '\0'), current]), 'sha1');
    row.bytesRatio = Number((current.length / normal.size).toFixed(4));
    if (row.bytesRatio < 0.55) row.lowWeight = true;
    else delete row.lowWeight;
  }
  row.art02 = { priorState: row.visualState, priorFinding: row.observation, outcome, morph, evidence, ...(rejected ? { rejected } : {}) };
  if (approved) row.visualState = 'correcta';
  row.observation = note;
  row.reviewedSizes = sizes;
  return { id: row.id, variant: row.variant, status: approved ? 'Correcta y aprobada' : 'Lámina ratificada',
    morph, evidence, note, before: approved ? before : historyFiles,
    ...(approved && historyFiles ? { legacy: historyFiles } : {}),
    ...(approved ? {} : { caption: 'Variante vigente' }),
    ...(approved && row.art01?.outcome === 'aprobada' ? { supersedesArt01: true } : {}) };
});

const totals = { auditadas: 0, correcta: 0, mejorable: 0, insuficiente: 0, pendiente: 0,
  corregidas: 0, correccionesAprobadas: baseline.totals.correccionesAprobadas + assets.length,
  propuestasRechazadas: baseline.totals.propuestasRechazadas + decisions.rows.reduce((sum, row) => sum + (row.rejected?.length || 0), 0) };
for (const row of entries.values()) {
  totals[row.visualState]++;
  if (row.visualState !== 'pendiente') totals.auditadas++;
  if (row.art01?.outcome === 'aprobada' || row.art02?.outcome === 'aprobada') totals.corregidas++;
}
assert.equal(totals.auditadas, baseline.totals.auditadas + evaluations.length);
const inventory = { baseline: decisions.baseline, states: baseline.states, totals,
  positiveReferences: baseline.positiveReferences, variants: [...entries.values()] };
const artifacts = {
  [lot + '/inventario-aud04.json']: JSON.stringify(inventory, null, 2) + '\n',
  [lot + '/integridad.json']: JSON.stringify({ baseline: decisions.baseline, assets }, null, 2) + '\n',
  [root + '/art02.js']: 'const art02Review = ' + JSON.stringify(lab, null, 2) + ';\n'
};
for (const [file, content] of Object.entries(artifacts)) {
  if (process.argv.includes('--write')) fs.writeFileSync(file, content);
  else assert.equal(fs.readFileSync(file, 'utf8'), content, file);
}
console.log(JSON.stringify(totals));
