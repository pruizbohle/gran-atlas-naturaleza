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
  const offline = JSON.parse(read('atlas-integrity.json')).files;
  assert.equal(rows.length, 504);
  assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
  assert.equal(rows.filter(row => row.lot === 'A' && row.paths).length, 27);
  assert.equal(rows.filter(row => row.catalog === 'OBJ-11').length, 300);
  for (const row of rows) {
    const mapped = Object.hasOwn(globalThis.AtlasObjectArtAssets,row.id) ? globalThis.AtlasObjectArtAssets[row.id] : null;
    assert.deepEqual(row.paths,mapped,row.id);
    if (!mapped) continue;
    for (const [size,file] of Object.entries(mapped)) {
      assert.equal(globalThis.AtlasObjectArt.src(row.id,size),'./' + file);
      const bytes = fs.readFileSync('www/' + file);
      assert.equal(bytes.toString('ascii',8,12),'WEBP',file);
      assert.deepEqual(offline[file],[bytes.length,createHash('sha256').update(bytes).digest('hex')],file);
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
