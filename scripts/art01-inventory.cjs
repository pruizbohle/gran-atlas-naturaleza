'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const auditDir = 'docs/auditoria-v501';
const lot = 'docs/arte-v505';
const original = JSON.parse(fs.readFileSync(path.join(auditDir, 'aud04-inventario-artistico.json')));
const decisions = JSON.parse(fs.readFileSync(path.join(lot, 'decisiones.json')));
const dimensions = [64, 128, 256, 512];
const relativePlate = (size, file) => (size === 512 ? '' : size + '/') + file;
const sha = (bytes, algorithm = 'sha256') => createHash(algorithm).update(bytes).digest('hex');
const key = row => row.id + '/' + row.variant;
const entries = new Map(original.variants.map(row => [key(row), row]));
for (const file of ['aud04-felidae-canidae.json', 'aud04-mustelidae.json', 'aud04-accipitridae.json']) {
  for (const decision of JSON.parse(fs.readFileSync(path.join(auditDir, file))).variants) {
    const row = entries.get(key(decision));
    assert.ok(row && decision.status && decision.finding, key(decision));
    Object.assign(row, { visualState: decision.status, observation: decision.finding, reviewedSizes: decision.sizes, priorAudit: file });
  }
}

const counts = {
  auditadas: 0, correcta: 0, mejorable: 0, insuficiente: 0, pendiente: 0,
  corregidas: 0, correccionesAprobadas: 0, propuestasRechazadas: 0
};
const subset = new Set();
const lab = [];
const assets = [];
for (const decision of decisions.rows) {
  const id = key(decision);
  assert.ok(!subset.has(id));
  subset.add(id);
  const row = entries.get(id);
  assert.ok(row, id);
  const { outcome, interpretation, note, rejected } = decision;
  const approved = outcome === 'aprobada';
  let before;
  if (approved) {
    before = {};
    // ART-02 archives an ART-01 plate when it supersedes that publication.
    const publishedPlate = file => {
      const archived = path.join('www/naturalist-art/review/art02', file);
      return fs.readFileSync(fs.existsSync(archived) ? archived : path.join('www/naturalist-art/plates', file));
    };
    const resolutions = dimensions.map(size => {
      const file = relativePlate(size, row.plate);
      const historical = 'review/art01/' + file;
      const older = fs.readFileSync(path.join('www/naturalist-art', historical));
      const current = publishedPlate(file);
      before[size] = historical;
      assert.notEqual(sha(older), sha(current), historical);
      return { size, path: 'naturalist-art/plates/' + file, before: 'naturalist-art/' + historical,
        oldBytes: older.length, newBytes: current.length, oldSha256: sha(older), newSha256: sha(current) };
    });
    const current = publishedPlate(row.plate);
    const normal = fs.readFileSync(path.join('www/naturalist-art/plates', row.normal));
    // Preserve the convention used by the historical inventory for the Git blob ID.
    row.sha = sha(Buffer.concat([Buffer.from('blob ' + current.length + '\0'), current]), 'sha1');
    row.bytesRatio = Number((current.length / normal.length).toFixed(4));
    assets.push({ id: row.id, variant: row.variant, resolutions });
    counts.corregidas++;
    counts.correccionesAprobadas++;
  }
  if (rejected) counts.propuestasRechazadas++;
  row.art01 = { priorState: row.visualState, priorFinding: row.observation, outcome, interpretation, ...(rejected ? { rejected } : {}) };
  row.visualState = approved ? 'correcta' : row.visualState;
  row.observation = note;
  row.reviewedSizes = dimensions;
  lab.push({ id: row.id, variant: row.variant, status: approved ? 'Correcta y aprobada' : 'Pendiente de ajuste',
    interpretation, note, ...(before ? { before } : {}) });
}
for (const row of entries.values()) {
  assert.ok(Object.hasOwn(counts, row.visualState), row.visualState);
  counts[row.visualState]++;
  if (row.visualState !== 'pendiente') counts.auditadas++;
  if (row.bytesRatio < 0.55) row.lowWeight = true;
  else delete row.lowWeight;
}
const states = {
  correcta: 'Correcta y aprobada', mejorable: 'Mejorable, pendiente de ajuste',
  insuficiente: 'Insuficiente, requiere nueva ilustración', pendiente: 'Pendiente de evaluación'
};
const inventory = { baseline: decisions.baseline, states, totals: counts, positiveReferences: decisions.positives,
  variants: [...entries.values()] };
const integrity = { baseline: decisions.baseline, assets };
const generated = {
  [path.join(lot, 'inventario-aud04.json')]: JSON.stringify(inventory, null, 2) + '\n',
  [path.join(lot, 'integridad.json')]: JSON.stringify(integrity, null, 2) + '\n',
  'www/naturalist-art/art01.js': 'const art01Review = ' + JSON.stringify(lab, null, 2) + ';\n'
};
for (const [file, content] of Object.entries(generated)) {
  if (process.argv.includes('--write')) fs.writeFileSync(file, content);
  else assert.equal(fs.readFileSync(file, 'utf8'), content, file);
}
console.log(JSON.stringify(counts));
