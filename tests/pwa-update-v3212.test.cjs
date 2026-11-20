'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),update=require('../www/js/pwa-update-v3212.js'),{harness}=require('./helpers/live-game.cjs');
test('PWA updater copies the exact stored save and leaves all existing keys untouched',()=>{const raw='{"money":12345,"sightings":{"zorro_rojo":73},"inventory":{"fossil_fragment":9}}',items={gran_atlas_v05:raw,unrelated:'keep',gran_atlas_backup_pre_import_v301:'old backup'},storage={getItem:k=>items[k]??null,setItem:(k,v)=>items[k]=v};assert.equal(update.backupSave(storage),raw);assert.equal(items[update.BACKUP],raw);assert.equal(items.gran_atlas_v05,raw);assert.equal(items.unrelated,'keep');assert.equal(items.gran_atlas_backup_pre_import_v301,'old backup');});
test('backup failures abort safely, and unreadable saves are preserved verbatim',()=>{for(const raw of ['{damaged','null']){let copied;const storage={getItem:k=>k===update.SAVE?raw:copied,setItem:(k,v)=>copied=v};assert.equal(update.backupSave(storage),raw);assert.equal(copied,raw);}assert.equal(update.backupSave({getItem:()=>null}),null);assert.throws(()=>update.backupSave({getItem:()=>{throw Error('SecurityError');}}),/SecurityError/);const raw='original';assert.throws(()=>update.backupSave({getItem:()=>raw,setItem:()=>{throw Error('QuotaExceededError');}}),/Quota/);assert.throws(()=>update.backupSave({getItem:k=>k===update.SAVE?raw:'wrong',setItem(){}}),/verificar/);});
test('waiting worker activates only from the dedicated updater with other app windows closed', async () => {
  const listeners = {};
  const responses = [];
  const scope = 'https://atlas.example/game/';
  let windows = [];
  let verified = false;
  let activations = 0;
  const context = vm.createContext({
    URL, Request, Response,
    self: {
      registration: { scope },
      location: { href: scope + 'sw.js' },
      clients: { async matchAll() { return windows; }, async claim() {} },
      async skipWaiting() { activations += 1; },
      addEventListener(name, callback) { listeners[name] = callback; }
    },
    caches: {
      async has() { return true; },
      async open() { return { async match(url) { return verified && url.includes('?complete=') ? new Response('ok') : undefined; } }; }
    }
  });
  context.importScripts = (...files) => {
    for (const file of files) vm.runInContext(fs.readFileSync('www/' + file, 'utf8'), context);
  };
  vm.runInContext(fs.readFileSync('www/sw.js', 'utf8'), context);
  listeners.install({ waitUntil() { assert.fail('An unrequested installation must not download the atlas'); } });
  async function message(type, url) {
    let pending;
    listeners.message({
      data: { type }, source: { id: 'updater', url },
      ports: [{ postMessage: value => responses.push(value) }],
      waitUntil(promise) { pending = promise; }
    });
    await pending;
  }

  await message('ATLAS_APPLY_UPDATE', scope + 'index.html');
  assert.equal(responses.length, 0);
  await message('ATLAS_APPLY_UPDATE', scope + 'actualizar-atlas.html');
  assert.equal(responses.at(-1).ready, false);
  assert.equal(responses.at(-1).accepted, false);
  assert.equal(activations, 0);

  verified = true;
  windows = [{ id: 'old', url: scope + 'index.html' }];
  await message('ATLAS_APPLY_UPDATE', scope + 'actualizar-atlas.html');
  assert.equal(responses.at(-1).ready, true);
  assert.equal(responses.at(-1).accepted, false);
  assert.equal(activations, 0);

  windows = [{ id: 'foreign', url: 'https://atlas.example/other/index.html' }];
  await message('ATLAS_UPDATE_STATUS', scope + 'actualizar-v430.html');
  assert.equal(responses.at(-1).otherClients, 0);
  assert.equal(activations, 0);
  await message('ATLAS_APPLY_UPDATE', scope + 'actualizar-atlas.html');
  assert.equal(responses.at(-1).accepted, true);
  assert.equal(activations, 1);
});
test('update entrypoint is independent of the old app bundle and publishes an identifiable version', () => {
  const html = fs.readFileSync('www/actualizar-atlas.html', 'utf8');
  const release = require('../www/atlas-release.json');
  const { g, geo } = require('./helpers/gm06-game.cjs').make();
  assert.doesNotMatch(html, /src="js\/app.js/);
  assert.match(html, /src="js\/atlas-pwa-update\.js\?entrada=actualizar"/);
  assert.match(html, /id="atlasUpdateAvailable"/);
  assert.match(html, /id="backup".*download/);
  assert.equal(release.version, require('../package.json').version);
  for (const [name, count] of Object.entries(release.cells)) {
    assert.equal(geo.layout(name, g.REGIONS.filter(region => region.continent === name)).cells.length, count, name);
  }
  assert.doesNotMatch(fs.readFileSync('www/js/atlas-pwa-update.js', 'utf8'), /localStorage\.clear|removeItem|unregister\(/);
});
test('live update navigation saves through the original persist function and stops on storage errors',()=>{const h=harness(),a=h.window.__atlasTest;a.state.money=91234;assert.equal(h.window.AtlasSaveBridge.persistBeforeUpdate(),true);assert.equal(JSON.parse(h.store.gran_atlas_v05).money,91234);h.localStorage.setItem=()=>{throw Error('QuotaExceededError');};assert.equal(h.window.AtlasSaveBridge.persistBeforeUpdate(),false);});
