'use strict';
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const fs = require('node:fs');
const test = require('node:test');
const {make} = require('./helpers/mec01-game.cjs');

const read = name => fs.readFileSync('www/' + name, 'utf8');
const sources = ['js/art-obj-12-assets.js', 'js/art-obj-12.js'];
for (const source of [...sources, 'art-obj-12/data.js']) require('../www/' + source);

test('ART-OBJ-12 · laboratorio, aplicación y manifiesto offline comparten los mismos WebP', () => {
  const rows = globalThis.AtlasObjectArtReview;
  const {files:offline, onDemand} = JSON.parse(read('atlas-integrity.json'));
  const large = new Set(globalThis.AtlasObjectArtLargeFiles);
  assert.equal(rows.length, 504);
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
  for (const [lot,count] of Object.entries({A:27,B:20,C:6,D:20})) {
    assert.equal(rows.filter(row => row.lot === lot && row.paths).length,count,lot);
  }
  assert.equal(rows.filter(row => row.catalog === 'OBJ-11' && row.paths).length,300);
  assert.equal(rows.filter(row => row.catalog === 'V5.6').length,131);
  for (const file of globalThis.AtlasObjectArtComparisonFiles) assert.ok(offline[file],file);
  for (const row of rows) {
    const mapped = Object.hasOwn(globalThis.AtlasObjectArtAssets,row.id) ? globalThis.AtlasObjectArtAssets[row.id] : null;
    assert.deepEqual(row.paths,mapped,row.id);
    if (!mapped) continue;
    for (const [size,file] of Object.entries(mapped)) {
      assert.equal(globalThis.AtlasObjectArt.src(row.id,size),'./' + file);
      const bytes = fs.readFileSync('www/' + file);
      assert.equal(bytes.toString('ascii',8,12),'WEBP',file);
      const optional = large.has(file);
      if (optional) assert.equal(offline[file],undefined,file);
      assert.deepEqual((optional ? onDemand : offline)[file],[bytes.length,createHash('sha256').update(bytes).digest('hex')],file);
    }
  }
});

test('ART-OBJ-12 · un material aparece con su propia imagen en inventario y ficha', () => {
  const runtime = sources.map(read).join('\n');
  const app = read('js/app.js').replace(/\n\}\)\(\);\s*$/,
    '\nwindow.__objectArtViews={renderItemArt,museumCardArt};\n})();');
  const h = make({headless:true,full:true,app:runtime+'\n'+app});
  const id = 'MAT-N03';
  const files = globalThis.AtlasObjectArtAssets[id];
  const img = h.window.__objectArtViews.renderItemArt(id);
  assert.ok(img.includes(files[64]),img);
  assert.ok(img.includes(files[128]),img);
  assert.ok(h.x.AtlasMEC06Actions.ficha(id).includes(files[256]));
  assert.equal(h.g.state.inventory[id] || 0,0);
});

test('ART-OBJ-12 · el Museo y el Taller muestran los mismos artefactos', () => {
  const app = read('js/app.js').replace(/\n\}\)\(\);\s*$/,
    '\nwindow.__objectArtViews={museumCollection3270,museumModalModel3270,MUSEUM_COLLECTIONS};\n})();');
  const h = make({headless:true,full:true,app:sources.map(read).join('\n')+'\n'+app});
  const views = h.window.__objectArtViews;
  const camp = h.x.AtlasCampMEC02Actions;
  const id = 'globo_celeste';
  const files = globalThis.AtlasObjectArtAssets[id];
  const collection = views.MUSEUM_COLLECTIONS.find(piece => piece.id === id);
  h.g.state.museum.collections[id] = true;
  const model = views.museumCollection3270(collection);
  assert.ok(model.art.includes(files[128]));
  assert.ok(views.museumModalModel3270(model.token).art.includes(files[256]));
  assert.ok(camp.card('workshop').controls.includes(files[64]));
  h.g.state.mec06.installed[id] = 'campamento';
  h.g.state.museum.displays['collection:' + id] = false;
  assert.ok(camp.card('shipyard').controls.includes(files[64]));
});

test('ART-OBJ-12 · los estudios y las demostraciones conservan la referencia de su ficha', () => {
  const h = make({headless:true,full:true,app:sources.map(read).join('\n')+'\n'+read('js/app.js')});
  const camp = h.x.AtlasCampMEC02Actions;
  const html = camp.card('workshop').controls;
  const ids = [...Object.keys(h.x.AtlasMEC06.STUDIES), ...Object.keys(h.x.AtlasMEC06.DEMOS), 'installed-taller'];
  for (const id of ids) {
    assert.ok(html.includes(globalThis.AtlasObjectArtAssets[id][64]),id);
  }
  assert.ok(h.x.AtlasMEC06Actions.ficha('modulo_luminoso').includes(globalThis.AtlasObjectArtAssets.modulo_luminoso[256]));
});


test('ART-OBJ-12 · la ficha de coleccionable conserva el nombre breve y amplía su explicación', () => {
  const h = make({headless:true,full:true,app:sources.map(read).join('\n')+'\n'+read('js/app.js')});
  const id = 'RAR-07';
  h.g.addInventory(id,1);
  const model = h.A.detailModel(id);
  assert.equal(model.name,'Lengua de dragón');
  assert.match(model.description,/Glosopetra.*dientes fósiles de tiburón/);
  assert.ok(model.art.includes(globalThis.AtlasObjectArtAssets[id][256]));
  const reused = globalThis.AtlasObjectArtReview.find(row => row.id === 'NUM-09');
  assert.equal(reused.name,'Estátero lidio');
  assert.notEqual(reused.paths?.[256],reused.previous.paths[256]);
  assert.match(reused.previous.label,/Birr etíope/);
});

test('ART-OBJ-12 · una revisión offline anterior de la misma beta necesita actualizar sus recursos', () => {
  const {isCurrentRevision} = require('../www/js/atlas-pwa-update.js');
  const release = require('../www/atlas-release.json');
  assert.match(release.revision,/^gran-atlas-v5\.6\.9-naturalist-[a-f0-9]{12}$/);
  assert.equal(isCurrentRevision({version:release.version,cache:release.revision,ready:true},release),true);
  assert.equal(isCurrentRevision({version:release.version,cache:'gran-atlas-v5.6.9-naturalist-d4a2e359234b',ready:true},release),false);
  assert.equal(isCurrentRevision({version:release.version,ready:true},{version:release.version}),true);
});
