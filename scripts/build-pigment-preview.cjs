'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const target = process.argv[2];
assert.ok(target, 'Indica un directorio de salida para el visor');
const art = 'naturalist-art/';
const read = file => fs.readFileSync('www/' + file, 'utf8');
function write(file, content) {
  const output = path.join(target, file);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, content);
}
function copy(file) {
  write(file, fs.readFileSync('www/' + file));
}

const sizes = ['', '64/', '128/', '256/'];
const stages = ['art01', 'art02', 'art03', 'art04', 'art05', 'art06', 'art07', 'art08'];
const available = vm.createContext({});
const evaluate = (file, expression) => vm.runInContext(read(file) + '\n' + expression, available);
const pigment = evaluate(art + 'pigment-audit-data.js', 'pigmentAuditRecords');
const catalog = evaluate(art + 'catalog.js', 'catalog');
for (const stage of stages) evaluate(art + stage + '.js', '');
const reviews = vm.runInContext('({' + stages.map(stage => stage + ':' + stage + 'Review').join(',') + '})', available);
const wanted = new Map();
for (const row of pigment) {
  if (!wanted.has(row.id)) wanted.set(row.id, new Set(['normal']));
  wanted.get(row.id).add(row.variant);
}

const sourceAssets = evaluate('js/naturalist-assets-v400.js', 'globalThis.AtlasNaturalistAssets');
const routes = {};
const cutouts = {};
const files = new Set();
const collection = catalog.filter(sp => wanted.has(sp.id)).map(sp => {
  const records = sp.records.filter(record => wanted.get(sp.id).has(record.key));
  routes[sp.id] = {};
  for (const record of records) {
    const plate = sourceAssets.routes[sp.id][record.key];
    assert.ok(plate && sourceAssets.cutouts[plate], sp.id + '/' + record.key);
    routes[sp.id][record.key] = plate;
    cutouts[plate] = true;
    for (const size of sizes) files.add(art + 'plates/' + size + plate);
  }
  return { id: sp.id, name: sp.name, latin: sp.latin, family: sp.family, habitats: [], regions: [],
    records: records.map(({ key, label }) => ({ key, label })) };
});
for (const row of Object.values(reviews).flat()) {
  for (const file of Object.values(row.before || {})) files.add(art + file);
  if (row.comparison) files.add(art + row.comparison);
}
for (const file of files) copy(file);
for (const file of ['lab.css', 'plate-view.js', 'pigment-audit.js', 'pigment-audit-data.js', ...stages.map(stage => stage + '.js')]) copy(art + file);
copy('css/naturalist-art-v400.css');
copy('js/naturalist-art-v400.js');
write('js/naturalist-assets-v400.js', 'globalThis.AtlasNaturalistAssets = ' + JSON.stringify({ routes, cutouts }) + ';\n');
write(art + 'catalog.js', 'const catalog = ' + JSON.stringify(collection) + ';\n');
write(art + 'preview.js', [
  "const content = byId('content');",
  'const artReviews = {' + stages.map(stage => stage + ': ' + stage + 'Review').join(', ') + '};',
  "byId('pigment-audit-filters').hidden = false;",
  "byId('audit-navigation').hidden = false;",
  'createPigmentAudit().draw();', ''
].join('\n'));

const markup = read(art + 'index.html');
const viewerStart = markup.indexOf('      <div id="pigment-audit-filters"');
const viewerEnd = markup.indexOf('      <p id="status"', viewerStart);
assert.ok(viewerStart > 0 && viewerEnd > viewerStart);
const version = JSON.parse(read('atlas-release.json')).version;
write('index.html', `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Visor de albinos y melánicos · El Gran Atlas</title>
  <link rel="stylesheet" href="css/naturalist-art-v400.css">
  <link rel="stylesheet" href="naturalist-art/lab.css">
  <script src="js/naturalist-assets-v400.js" defer></script>
  <script src="js/naturalist-art-v400.js" defer></script>
  ${['catalog', ...stages, 'pigment-audit-data', 'plate-view', 'pigment-audit', 'preview'].map(file =>
    '<script src="naturalist-art/' + file + '.js" defer></script>').join('\n  ')}
</head>
<body>
  <header class="masthead">
    <div class="container">
      <p class="eyebrow">El Gran Atlas · V${version}</p>
      <h1>Visor de albinos y melánicos</h1>
    </div>
  </header>
  <main class="container">
    <section class="workspace" aria-label="Catálogo de variantes">
      <p id="summary" aria-live="polite"></p>
${markup.slice(viewerStart, viewerEnd)}
    </section>
  </main>
</body>
</html>
`);
console.log(JSON.stringify({ animals: collection.length, variants: pigment.length, assets: files.size }));
