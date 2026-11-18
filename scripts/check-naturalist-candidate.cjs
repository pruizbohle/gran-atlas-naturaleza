'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const baseline = 'd906224533559193e87704fa44471ea73d4069c9';
const mime = { html: 'text/html', js: 'text/javascript', css: 'text/css', webp: 'image/webp', png: 'image/png', svg: 'image/svg+xml' };
const oldFiles = new Map();
let candidate = false;
const server = http.createServer((request, response) => {
  try {
    const requested = decodeURIComponent(new URL(request.url, 'http://local').pathname).slice(1);
    const name = requested.endsWith('/') || !requested ? requested + 'index.html' : requested;
    if (name.includes('..')) throw Error('path');
    if (!candidate && !oldFiles.has(name)) {
      oldFiles.set(name, execFileSync('git', ['show', baseline + ':www/' + name], { maxBuffer: 16e6, stdio: ['ignore', 'pipe', 'ignore'] }));
    }
    const data = candidate ? fs.readFileSync('www/' + name) : oldFiles.get(name);
    response.setHeader('Content-Type', mime[name.split('.').pop()] || 'application/json');
    response.setHeader('Cache-Control', 'no-cache');
    response.end(data);
  } catch { response.writeHead(404).end(); }
});

async function run() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const id = 'oc_esp_osphranter_rufus';
  const id2 = 'na_esp_didelphis_virginiana';
  const tabs = name => '.tab[data-tab="' + name + '"]';
  const openTab = (page, name) => page.locator(tabs(name)).first().evaluate(button => button.click());
  const results = [];
  try {
    for (const width of [390, 1280]) {
      candidate = false;
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      const errors = [];
      const page = await ctx.newPage();
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(url);
      await page.waitForFunction(() => !!window.AtlasSaveBridge);
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      await page.evaluate(({ id, id2 }) => {
        const save = AtlasSaveBridge.getSaveData();
        for (const key of [id, id2]) {
          save.discovered[key] = true;
          save.published[key] = true;
          save.stages[key] = 5;
          save.sightings[key] = 430;
        }
        save.currentRegion = 'oc_desierto_australiano';
        save.regionUnlocked[save.currentRegion] = true;
        save.selectedJournal = id;
        save.specialFound[id] = { Albino: true, Notable: true };
        save.legendaryFound = {};
        save.museum.exhibits[id] = true;
        save.money = 16340;
        save.knowledge = 2140;
        save.inventory.old_ink = 7;
        save.lastEncounter = { species: id, title: 'Prueba', subtitle: '+8 conocimiento', sequence: 1, entries: [
          { id, amount: 3, variant: 'Albino', category: 'Notable' }, { id: id2, amount: 2 }
        ] };
        AtlasSaveBridge.restoreGame(save);
        AtlasSaveBridge.persistBeforeUpdate();
      }, { id, id2 });
      const startOld = performance.now();
      await openTab(page, 'field');
      await page.locator('#fieldResult .field-animal-sprite svg').first().waitFor();
      const beforeMs = Math.round(performance.now() - startOld);

      candidate = true;
      await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
      await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration()).waiting);
      const updated = await ctx.newPage();
      updated.on('pageerror', e => errors.push(e.message));
      await updated.goto(url + 'actualizar-v400.html');
      await updated.locator('#atlasUpdateApply').click();
      await updated.waitForFunction(() => document.querySelector('#status').dataset.error === 'true');
      assert.match(await updated.locator('#status').innerText(), /otra ventana/);
      await page.close();
      const raw = await updated.evaluate(() => localStorage.getItem('gran_atlas_v05'));
      await updated.locator('#atlasUpdateApply').click();
      await updated.waitForURL(/actualizado=4.0.0/);
      await updated.waitForFunction(() => !!window.AtlasSaveBridge);
      const after = await updated.evaluate(() => AtlasSaveBridge.getSaveData());
      const before = JSON.parse(raw);
      assert.equal(await updated.evaluate(() => localStorage.getItem('gran_atlas_backup_before_update')), raw);
      const keys = ['discovered', 'published', 'sightings', 'specialFound', 'legendaryFound', 'museum', 'inventory', 'knowledge', 'money', 'regionUnlocked'];
      for (const key of keys) assert.deepEqual(after[key], before[key], key);
      const startNew = performance.now();
      await openTab(updated, 'field');
      const mark = updated.locator('#fieldResult .atlas-art-frame.notable img');
      await mark.evaluate(img => img.decode());
      const afterMs = Math.round(performance.now() - startNew);
      assert.match(await mark.getAttribute('src'), /--albino\.webp$/);
      assert.equal(await updated.locator('#fieldResult .atlas-art-image').count(), 2);
      assert.deepEqual(await updated.locator('#fieldResult .encounter-multiplier').allTextContents(), ['×3', '×2']);
      assert.equal(await updated.locator('#fieldLog .atlas-art-image').count(), 2);

      await openTab(updated, 'bestiary');
      await updated.locator('#b26-search').fill('Osphranter rufus');
      const card = updated.locator('.b26-card:has(.atlas-art-image)').first();
      await card.locator('img').evaluate(img => img.decode());
      await card.click();
      await updated.locator('.b26-dialog img').evaluate(img => img.decode());
      assert.match(await updated.locator('.b26-dialog img').getAttribute('src'), /plates\/oc_esp_osphranter_rufus--normal.webp$/);
      await updated.locator('[data-action=b26-close]').click();

      await openTab(updated, 'museum');
      const exhibit = updated.locator('.m27-vitrines [data-action=m27-open]').first();
      await exhibit.locator('img.atlas-art-image').evaluate(img => img.decode());
      await exhibit.click();
      await updated.locator('.m27-dialog img.atlas-art-image').evaluate(img => img.decode());
      await updated.locator('[data-action=m27-close]').click();
      await updated.getByRole('tab', { name: 'Muestras', exact: true }).click();
      await updated.locator('.m27-root img.atlas-art-image').first().evaluate(img => img.decode());
      await openTab(updated, 'journal');
      const journal = updated.locator('.j25-sheet img.atlas-art-image').first();
      await journal.evaluate(img => img.decode());
      assert.equal(await updated.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      if (process.argv.includes('--write-evidence')) {
        await updated.screenshot({ path: 'docs/v400-naturalista/cuaderno-' + width + '.jpg', type: 'jpeg', quality: 82 });
      }

      await ctx.setOffline(true);
      await updated.reload();
      await updated.waitForFunction(() => !!window.AtlasSaveBridge);
      await openTab(updated, 'field');
      await updated.locator('#fieldResult img.atlas-art-image').first().evaluate(img => img.decode());
      await updated.goto(url + 'naturalist-art/');
      await updated.locator('.field-card img').evaluate(img => img.decode());
      assert.deepEqual(errors, []);
      results.push({ width, fieldSvgMs: beforeMs, fieldWebPMs: afterMs, exactSaveBackup: true,
        preservedFields: keys.length, multiEncounter: true, spritesOffline: true, labOffline: true, errors });
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.closeAllConnections();
    server.close();
  }
  console.log(JSON.stringify(results, null, 2));
}

run().catch(error => {
  console.error(error);
  server.closeAllConnections();
  server.close();
  process.exitCode = 1;
});
