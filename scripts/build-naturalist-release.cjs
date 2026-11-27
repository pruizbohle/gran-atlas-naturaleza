'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createHash } = require('node:crypto');

require('../www/js/naturalist-assets-v400.js');
require('../www/js/art-obj-12-assets.js');
require('../www/art-camp-02/assets.js');
const assets = globalThis.AtlasNaturalistAssets;
for (const file of new Set(Object.values(assets.routes).flatMap(route => Object.values(route)))) {
  assert.ok(assets.cutouts[file], 'La lámina de producción requiere transparencia: ' + file);
}
const source = fs.readFileSync('www/sw.js', 'utf8');
const core = [...source.match(/const CORE=\[([^;]+)\];/)[1].matchAll(/['"]([^'"]+)['"]/g)]
  .map(match => match[1].slice(2));
const large = new Set(globalThis.AtlasObjectArtLargeFiles);
const files = [...new Set([...core, ...globalThis.AtlasCampArt.files, ...assets.files, ...assets.relictFiles, ...Object.values(globalThis.AtlasObjectArtAssets).flatMap(Object.values), ...globalThis.AtlasObjectArtComparisonFiles].map(file =>
  file.endsWith('/') || !file ? file + 'index.html' : file))].filter(file => !large.has(file)).sort();
const review = assets.labFiles || [];
const withPlaceholders = source.replace(/const CACHE='[^']+'/, 'const CACHE=REVISION')
  .replace(/manifestDigest:'[^']+'/, 'manifestDigest:INTEGRITY');
const hash = createHash('sha256').update(withPlaceholders);
const version = require('../package.json').version;
assert.equal(version, require('../package-lock.json').version);
const releasePath = 'www/atlas-release.json';
const releaseSource = fs.readFileSync(releasePath,'utf8');
assert.equal(version, JSON.parse(releaseSource).version);
assert.ok(source.includes("version:'" + version + "'"));
const index = fs.readFileSync('www/index.html', 'utf8');
assert.ok(index.includes('name="atlas-version" content="' + version + '"'));
const integrity = {};
const offline = new Set(files);
const onDemand = {};
for (const file of [...files, ...large, ...review]) {
  assert.ok(fs.existsSync('www/' + file), 'Falta recurso offline: ' + file);
  const bytes = fs.readFileSync('www/' + file);
  hash.update(file).update(bytes);
  if (offline.has(file)) integrity[file] = [bytes.length, createHash('sha256').update(bytes).digest('hex')];
  if (large.has(file)) onDemand[file] = [bytes.length, createHash('sha256').update(bytes).digest('hex')];
}
const manifestPath = 'www/atlas-integrity.json';
const manifest = JSON.stringify({ version, files: integrity, onDemand }) + '\n';
const manifestDigest = createHash('sha256').update(manifest).digest('hex');
const revision = 'gran-atlas-v' + version + '-naturalist-' + hash.digest('hex').slice(0, 12);
const release = releaseSource.replace(/  "revision": "[^"]+",/, '  "revision": "' + revision + '",');
assert.equal(JSON.parse(release).revision, revision);
const generated = source.replace(/const CACHE='[^']+'/, "const CACHE='" + revision + "'")
  .replace(/manifestDigest:'[^']+'/, "manifestDigest:'" + manifestDigest + "'");
if (process.argv.includes('--write')) {
  fs.writeFileSync(manifestPath, manifest);
  fs.writeFileSync(releasePath, release);
  fs.writeFileSync('www/sw.js', generated);
} else {
  assert.equal(fs.readFileSync(manifestPath, 'utf8'), manifest, 'Ejecuta scripts/build-naturalist-release.cjs --write');
  assert.equal(releaseSource, release, 'Ejecuta scripts/build-naturalist-release.cjs --write');
  assert.equal(source, generated, 'Ejecuta scripts/build-naturalist-release.cjs --write');
}
console.log(JSON.stringify({ version, offlineFiles: files.length, naturalistFiles: assets.files.length, relictFiles: assets.relictFiles.length, reviewFiles: review.length, reviewBytes: assets.labBytes, revision }));
