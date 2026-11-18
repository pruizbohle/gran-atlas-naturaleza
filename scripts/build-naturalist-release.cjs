'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { createHash } = require('node:crypto');

require('../www/js/naturalist-assets-v400.js');
const assets = globalThis.AtlasNaturalistAssets;
for (const file of new Set(Object.values(assets.routes).flatMap(route => Object.values(route)))) {
  assert.ok(assets.cutouts[file], 'La lámina de producción requiere transparencia: ' + file);
}
const source = fs.readFileSync('www/sw.js', 'utf8');
const core = [...source.match(/const CORE=\[([^;]+)\];/)[1].matchAll(/['"]([^'"]+)['"]/g)]
  .map(match => match[1].slice(2));
const files = [...new Set([...core, ...assets.files].map(file =>
  file.endsWith('/') || !file ? file + 'index.html' : file))].sort();
const hash = createHash('sha256').update(source.replace(/const CACHE='[^']+'/, 'const CACHE=REVISION'));
for (const file of files) {
  assert.ok(fs.existsSync('www/' + file), 'Falta recurso offline: ' + file);
  hash.update(file).update(fs.readFileSync('www/' + file));
}
const version = require('../package.json').version;
assert.equal(version, require('../package-lock.json').version);
assert.equal(version, require('../www/atlas-release.json').version);
assert.ok(source.includes("version:'" + version + "'"));
assert.ok(fs.readFileSync('www/index.html', 'utf8').includes('v' + version));
const revision = 'gran-atlas-v' + version + '-naturalist-' + hash.digest('hex').slice(0, 12);
const generated = source.replace(/const CACHE='[^']+'/, "const CACHE='" + revision + "'");
if (process.argv.includes('--write')) fs.writeFileSync('www/sw.js', generated);
else assert.equal(source, generated, 'Ejecuta scripts/build-naturalist-release.cjs --write');
console.log(JSON.stringify({ version, offlineFiles: files.length, naturalistFiles: assets.files.length, revision }));
