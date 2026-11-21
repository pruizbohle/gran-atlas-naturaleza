'use strict';

const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');

const root = 'www/naturalist-art';
const reviewStages = ['art01', 'art02', 'art03', 'art04', 'art05', 'art06'];
const corrected = row => reviewStages.some(stage => row[stage]?.outcome === 'aprobada');

function buildVariantReview({ lot, previousLot, review, supersededArchive, version, correctionsOnly = false, viewer = false }) {
  const baseline = JSON.parse(fs.readFileSync('docs/' + previousLot + '/inventario-aud04.json'));
  const evaluations = correctionsOnly ? [] : JSON.parse(fs.readFileSync(lot + '/evaluaciones.json'));
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
    row.priorAudit = lot.split('/').at(-1) + '/evaluaciones.json';
  }

  const seen = new Set();
  const lab = decisions.rows.map(decision => {
    const { replaces, previousLabel } = decision;
    const id = key(replaces ? { ...decision, variant: replaces } : decision);
    const row = entries.get(id);
    assert.ok(row && row.visualState !== 'pendiente' && !seen.has(id), id);
    if (correctionsOnly) assert.ok(['insuficiente', 'mejorable'].includes(row.visualState), id);
    seen.add(id);
    const { outcome, morph, evidence, note, rejected, history, eye } = decision;
    const approved = outcome === 'aprobada';
    const previousPlate = row.plate;
    if (replaces) {
      assert.ok(approved && replaces !== decision.variant && !entries.has(key(decision)) && previousLabel, id);
      row.variant = decision.variant;
      row.plate = row.id + '--' + row.variant + '.webp';
    }
    const historyFiles = history ? Object.fromEntries(sizes.map(size => {
      const file = 'review/' + history + '/' + (size === 512 ? '' : size + '/') + row.plate;
      assert.ok(fs.existsSync(root + '/' + file), file);
      return [size, file];
    })) : undefined;
    const before = {};
    const publishedPlate = file => {
      const archive = root + '/review/' + supersededArchive + '/' + file;
      return fs.readFileSync(supersededArchive && fs.existsSync(archive) ? archive : root + '/plates/' + file);
    };
    if (approved) {
      const resolutions = sizes.map(size => {
        const file = (size === 512 ? '' : size + '/') + row.plate;
        const oldFile = (size === 512 ? '' : size + '/') + previousPlate;
        before[size] = 'review/' + review + '/' + oldFile;
        const previous = fs.readFileSync(root + '/' + before[size]);
        const current = publishedPlate(file);
        assert.notEqual(sha(previous), sha(current), file);
        return { size, path: 'naturalist-art/plates/' + file, before: 'naturalist-art/' + before[size],
          ...(replaces ? { previousPath: 'naturalist-art/plates/' + oldFile } : {}),
          oldBytes: previous.length, newBytes: current.length, oldSha256: sha(previous), newSha256: sha(current) };
      });
      assets.push({ id: row.id, variant: row.variant, resolutions });
      const current = publishedPlate(row.plate);
      const normal = fs.statSync(root + '/plates/' + row.normal);
      row.sha = sha(Buffer.concat([Buffer.from('blob ' + current.length + '\0'), current]), 'sha1');
      row.bytesRatio = Number((current.length / normal.size).toFixed(4));
      if (row.bytesRatio < 0.55) row.lowWeight = true;
      else delete row.lowWeight;
    }
    const priorReview = ['art04', 'art03', 'art02', 'art01'].find(name => row[name]?.outcome === 'aprobada');
    row[review] = { priorState: row.visualState, priorFinding: row.observation, outcome, morph, evidence,
      ...(rejected ? { rejected } : {}), ...(eye ? { eye } : {}), ...(version ? { version } : {}),
      ...(replaces ? { replaces, previousPlate } : {}) };
    if (decision.state) {
      assert.ok(Object.hasOwn(baseline.states, decision.state) && decision.state !== 'pendiente');
      row.visualState = decision.state;
    }
    if (approved) row.visualState = 'correcta';
    row.observation = note;
    row.reviewedSizes = sizes;
    return { id: row.id, variant: row.variant, status: approved ? 'Correcta y aprobada' : outcome === 'ratificada' ? 'Lámina ratificada' : 'Pendiente de ajuste',
      morph, evidence, note, before: approved ? before : historyFiles,
      ...(replaces ? { replaces, previousLabel } : {}),
      ...(eye ? { eye: eye.color } : {}), ...(version ? { version: approved ? version : decision.plateVersion } : {}),
      ...(approved && historyFiles ? { legacy: historyFiles } : {}),
      ...(approved ? {} : { caption: 'Variante vigente' }),
      ...(approved && priorReview ? (review === 'art02' ? { supersedesArt01: true } : { supersedes: priorReview }) : {}) };
  });

  const totals = { auditadas: 0, correcta: 0, mejorable: 0, insuficiente: 0, pendiente: 0,
    corregidas: 0, correccionesAprobadas: baseline.totals.correccionesAprobadas + assets.length,
    propuestasRechazadas: baseline.totals.propuestasRechazadas + decisions.rows.reduce((sum, row) => sum + (row.rejected?.length || 0), 0) };
  for (const row of entries.values()) {
    totals[row.visualState]++;
    if (row.visualState !== 'pendiente') totals.auditadas++;
    if (corrected(row)) totals.corregidas++;
  }
  assert.equal(totals.auditadas, baseline.totals.auditadas + evaluations.length);
  const inventory = { baseline: decisions.baseline, states: baseline.states, totals,
    positiveReferences: baseline.positiveReferences, variants: [...entries.values()] };
  const artifacts = {
    [lot + '/inventario-aud04.json']: JSON.stringify(inventory, null, 2) + '\n',
    [lot + '/integridad.json']: JSON.stringify({ baseline: decisions.baseline, assets }, null, 2) + '\n',
    [root + '/' + review + '.js']: 'const ' + review + 'Review = ' + JSON.stringify(lab, null, 2) + ';\n'
  };
  if (viewer) {
    const records = inventory.variants.map(row => ({
      id: row.id, variant: row.variant, state: row.visualState, finding: row.observation,
      ...(row.triage === 'P1' ? { priority: true } : {}),
      ...(corrected(row) ? { corrected: true } : {})
    }));
    const lines = records.map(record => '  ' + JSON.stringify(record)).join(',\n');
    const viewerFile = root + '/pigment-audit-data.js';
    if (typeof viewer === 'string') {
      const published = require('node:child_process').execFileSync('git', ['show', viewer + ':' + viewerFile], { encoding: 'utf8' });
      assert.equal(published, 'const pigmentAuditRecords = [\n' + lines + '\n];\n');
    } else {
      artifacts[viewerFile] = 'const pigmentAuditRecords = [\n' + lines + '\n];\n';
    }
  }
  for (const [file, content] of Object.entries(artifacts)) {
    if (process.argv.includes('--write')) fs.writeFileSync(file, content);
    else assert.equal(fs.readFileSync(file, 'utf8'), content, file);
  }
  console.log(JSON.stringify(totals));
}

module.exports = buildVariantReview;
