'use strict';

const assert = require('node:assert/strict');
const { createReadStream } = require('node:fs');
const { stat } = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');
const { version } = require('../package.json');
const { files } = require('../www/atlas-integrity.json');

const baseline = process.argv[2];
assert.ok(baseline, 'Indica el directorio www de la versión pública anterior (50cdf3c).');
const candidate = path.resolve('www');
const mime = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
let root = candidate;

const server = http.createServer(async (request, response) => {
  const uri = new URL(request.url, 'http://127.0.0.1');
  try {
    const pathname = decodeURIComponent(uri.pathname);
    const name = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
    const file = path.resolve(root, '.' + name);
    if (!file.startsWith(root + path.sep)) return response.writeHead(404).end();
    const info = await stat(file);
    if (!info.isFile()) return response.writeHead(404).end();
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Content-Length': info.size, 'Cache-Control': 'no-store' });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
});

const saveKey = 'gran_atlas_v05';
const backupKey = 'gran_atlas_backup_before_update';
async function status(page, pattern) {
  await page.waitForFunction(pattern => {
    const label = document.getElementById('status');
    return label.dataset.error === 'true' || new RegExp(pattern).test(label.textContent);
  },
      pattern.source, { timeout: 120000 });
  assert.match(await page.locator('#status').textContent(), pattern);
}
const save = page => page.evaluate(() => AtlasSaveBridge.getSaveData());
const sameFields = (before, after, keys) => {
  for (const key of keys) assert.deepEqual(after[key], before[key], key);
};

async function navigation(browser, base) {
  const context = await browser.newContext({ viewport: { width: 1240, height: 900 }, serviceWorkers: 'block' });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const open = id => page.locator('.tabs [data-tab="' + id + '"]').click();
    const goBack = label => page.getByRole('button', { name: 'Volver a ' + label, exact: false }).click();
    const help = () => page.locator('.ux3410-guide');
    const section = async id => assert.equal(await page.locator('body').getAttribute('data-ux-module'), id);
    await page.goto(base);
    await page.waitForFunction(() => !!window.AtlasSaveBridge);
    const before = await save(page);

    await open('atlas');
    await page.getByRole('button', { name: 'Plegar Brújula' }).click();
    await page.getByRole('button', { name: 'Desplegar Brújula' }).click();
    await page.locator('[data-action="ux-compass-go"]').click();
    await goBack('Atlas');
    await section('atlas');

    await open('expeditions');
    await help().locator('summary').click();
    await help().getByRole('button', { name: 'Consultar Astillero básico' }).click();
    await section('research');
    await goBack('Campamento');
    await section('expeditions');
    assert.equal(await help().getAttribute('open'), '');

    await page.locator('.cp3430-facility[data-cp-open="surveys"]').click();
    await page.locator('[data-cp-museum]').click();
    await section('museum');
    await page.locator('.m27-rooms [data-id="relicts"]').waitFor();
    await goBack('Campamento');
    await page.locator('[data-cp-museum]').waitFor();

    await open('objects');
    await page.getByRole('tab', { name: 'Coleccionables' }).click();
    await page.locator('.inv340-chart > summary').click();
    await page.locator('[data-action="inv-recipe"][data-id="world_map"]').click();
    await page.locator('.inv340-recipe').getByText('Planificador · Mapamundi').waitFor();
    await goBack('Inventario');
    assert.equal(await page.locator('.inv340-chart').getAttribute('open'), '');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.mobile-dock [data-tab="field"]').click();
    await help().locator('summary').click();
    await help().getByText('Registrar tus primeros avistamientos').waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    sameFields(before, await save(page), ['money', 'knowledge', 'prestige', 'inventory', 'sightings', 'crownCoins', 'museum']);
    assert.deepEqual(errors, []);
    return { desktop: 1240, mobile: 390, compass: true, research: true, inventory: true, campMuseumReturn: true };
  } finally {
    await context.close();
  }
}

async function migrate(browser, base) {
  root = path.resolve(baseline);
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base + 'actualizar-atlas.html');
    await status(page, /Prepara esta versión/);
    console.log('V4.9.6 disponible para instalar.');
    await page.locator('#atlasUpdateApply').click();
    await status(page, /Descarga completa e integridad verificada/);
    await page.locator('#atlasUpdateInstall').click();
    await status(page, /Versión 4\.9\.6 instalada/);
    console.log('V4.9.6 instalada.');
    await page.locator('#atlasUpdateReturn').click();
    await page.waitForURL(base + 'index.html?actualizado=4.9.6');
    await page.waitForFunction(() => !!window.AtlasSaveBridge && !!navigator.serviceWorker.controller);
    assert.match(await page.title(), /v4\.9\.6/);
    const previous = await page.evaluate(key => {
      const state = AtlasSaveBridge.getSaveData();
      state.money = 2896;
      state.knowledge = 800;
      state.crownCoins = 317;
      state.inventory.brass_shard = 4;
      state.discovered.zorro_rojo = true;
      state.sightings.zorro_rojo = 12;
      state.specialFound.zorro_rojo = { Albino: true };
      state.museum.relicts.coelacanth_indic = true;
      AtlasSaveBridge.restoreGame(state);
      AtlasSaveBridge.persistBeforeUpdate();
      return localStorage.getItem(key);
    }, saveKey);

    root = candidate;
    await page.goto(base + 'actualizar-atlas.html');
    await status(page, /Nueva versión disponible/);
    assert.equal(await page.locator('#atlasUpdateInstalled').innerText(), '4.9.6');
    console.log('V5.2.0 detectada con V4.9.6 activa.');
    await page.locator('#atlasUpdateApply').click();
    await status(page, /Descarga completa e integridad verificada/);
    console.log('Descarga de V5.2.0 verificada.');
    assert.equal(await page.evaluate(key => localStorage.getItem(key), backupKey), previous);
    await page.locator('#atlasUpdateInstall').click();
    await status(page, /Versión 5\.2\.0 instalada/);
    assert.equal(await page.evaluate(key => localStorage.getItem(key), saveKey), previous);
    await page.locator('#atlasUpdateReturn').click();
    await page.waitForURL(base + 'index.html?actualizado=' + version);
    await page.waitForFunction(() => !!window.AtlasSaveBridge);
    assert.match(await page.title(), /v5\.2\.0/);
    const before = JSON.parse(previous);
    const after = await save(page);
    sameFields(before, after, ['money', 'knowledge', 'crownCoins', 'inventory', 'discovered', 'sightings', 'specialFound']);
    assert.equal(after.museum.relicts.coelacanth_indic, true);
    assert.equal(after.museum.relictDiscoveries?.coelacanth_indic, undefined);

    await context.setOffline(true);
    await page.reload();
    await page.waitForFunction(() => !!window.AtlasSaveBridge);
    sameFields(after, await save(page), ['money', 'knowledge', 'crownCoins', 'inventory', 'museum', 'sightings']);
    const offlineFiles = await page.evaluate(async () => {
      const names = await caches.keys();
      const active = names.find(name => name.startsWith('gran-atlas-v5.2.0') && !name.endsWith('-review'));
      return (await (await caches.open(active)).keys()).length - 1;
    });
    assert.equal(offlineFiles, Object.keys(files).length);
    assert.deepEqual(errors, []);
    return { from: '4.9.6', to: version, authorized: true, sha256: true, identicalBackup: true,
      historicRelict: true, offlineFiles };
  } finally {
    await context.close();
  }
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const result = await navigation(browser, base);
    console.log(JSON.stringify({ chromium: browser.version(), navigation: result }));
    console.log(JSON.stringify({ migration: await migrate(browser, base) }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  server.closeAllConnections();
  server.close();
});
