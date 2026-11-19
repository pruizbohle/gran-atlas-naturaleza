'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const { harness } = require('../tests/helpers/live-game.cjs');

const baseline = process.env.ATLAS_BASELINE || '94a0763fe0b44d5ef5ffdfab35cb1caa0eb930f3';
const version = require('../package.json').version;
const versionSlug = version.replaceAll('.', '');
const baselineSlug = JSON.parse(execFileSync('git', ['show', baseline + ':www/atlas-release.json'], { encoding: 'utf8' })).version.replaceAll('.', '');
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

async function jsHeap(page) {
  const session = await page.context().newCDPSession(page);
  try {
    await session.send('Performance.enable');
    const { metrics } = await session.send('Performance.getMetrics');
    return metrics.find(metric => metric.name === 'JSHeapUsedSize').value;
  } finally {
    await session.detach();
  }
}

async function run() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const id = 'nutria_europea';
  const id2 = 'aguila_real';
  const regions = harness().window.__atlasTest.REGIONS;
  const britishSpecies = regions.find(region => region.id === 'HX-01-09').species;
  const primateRegion = regions.find(region => region.id === 'HX-09-11');
  const elephant = 'af_elefante_sabana';
  const savanna = regions.find(region => region.id === 'HX-07-10');
  const tabs = name => '.tab[data-tab="' + name + '"]';
  const openTab = (page, name) => page.locator(tabs(name)).first().evaluate(button => button.click());
  const results = [];
  try {
    for (const width of [390, 1280]) {
      candidate = false;
      const ctx = await browser.newContext({ viewport: { width, height: 900 } });
      ctx.setDefaultTimeout(20000);
      const errors = [];
      const page = await ctx.newPage();
      page.on('pageerror', e => errors.push(e.message));
      await page.goto(url);
      await page.waitForFunction(() => !!window.AtlasSaveBridge);
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 120000 });
      await page.evaluate(({ id, id2 }) => {
        const save = AtlasSaveBridge.getSaveData();
        for (const key of [id, id2]) {
          save.discovered[key] = true;
          save.published[key] = true;
          save.stages[key] = 5;
          save.sightings[key] = 430;
        }
        save.currentRegion = 'HX-01-09';
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
      await page.locator('#fieldResult .atlas-art-image').first().evaluate(img => img.decode());
      const beforeMs = Math.round(performance.now() - startOld);
      const beforeHeap = await jsHeap(page);

      candidate = true;
      await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
      await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration()).waiting, null, { timeout: 120000 });
      const updated = await ctx.newPage();
      updated.on('pageerror', e => errors.push(e.message));
      // Installed games still open their cached update entry point.
      const upgradeSlug = width === 390 ? baselineSlug : versionSlug;
      await updated.goto(url + 'actualizar-v' + upgradeSlug + '.html');
      await updated.locator('#atlasUpdateApply').click();
      await updated.waitForFunction(() => document.querySelector('#status').dataset.error === 'true');
      assert.match(await updated.locator('#status').innerText(), /otra ventana/);
      await page.close();
      const raw = await updated.evaluate(() => localStorage.getItem('gran_atlas_v05'));
      await updated.locator('#atlasUpdateApply').click();
      await updated.waitForURL(url + 'index.html?actualizado=' + version);
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
      const afterHeap = await jsHeap(updated);
      assert.equal(await updated.locator('#fieldResult .atlas-art-cutout').count(), 1);
      assert.equal(await updated.locator('.field-environment .landscape-bosque').count(), 1);
      assert.equal(await mark.evaluate(img => getComputedStyle(img).filter.includes('drop-shadow')), true);
      assert.match(await mark.getAttribute('src'), /--albino\.webp$/);
      assert.equal(await updated.locator('#fieldResult .atlas-art-image').count(), 1);
      assert.equal(await updated.locator('#fieldResult .field-animal-sprite > svg').count(), 1);
      const imageBytes = await mark.evaluate(img => img.naturalWidth * img.naturalHeight * 4);
      assert.deepEqual(await updated.locator('#fieldResult .encounter-multiplier').allTextContents(), ['×3', '×2']);
      assert.equal(await updated.locator('#fieldLog .atlas-art-image').count(), 1);
      await updated.locator('[data-action=toggle-field-filters]').click();
      await updated.locator('[data-action=set-habitat][data-id=pradera]').click();
      await updated.locator('.field-environment .landscape-pradera').evaluate(img => img.decode());
      await updated.locator('[data-action=set-habitat][data-id=bosque]').click();
      await updated.locator('.field-environment .landscape-bosque').evaluate(img => img.decode());
      const landscape = updated.locator('.field-environment .atlas-art-landscape');
      const dawn = await landscape.evaluate(img => getComputedStyle(img).filter);
      await updated.locator('[data-action=set-time][data-id=noche]').click();
      assert.notEqual(await landscape.evaluate(img => getComputedStyle(img).filter), dawn);
      await updated.locator('[data-action=set-time][data-id=amanecer]').click();
      if (process.argv.includes('--write-evidence')) {
        await updated.locator('.field-stage').screenshot({
          path: 'docs/cientifica-v460/campo-' + width + '.jpg', type: 'jpeg', quality: 85
        });
      }


      await openTab(updated, 'bestiary');
      await updated.locator('#b26-search').fill('Lutra lutra');
      const card = updated.locator('.b26-card:has(.atlas-art-image)').first();
      await card.locator('.atlas-art-image').evaluate(img => img.decode());
      await card.click();
      await updated.locator('.b26-dialog .atlas-art-image').evaluate(img => img.decode());
      assert.match(await updated.locator('.b26-dialog .atlas-art-image').getAttribute('src'), /plates\/nutria_europea--normal.webp$/);
      await updated.locator('.b26-dialog .landscape-rio').evaluate(img => img.decode());
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
        await updated.screenshot({ path: 'docs/cientifica-v460/cuaderno-' + width + '.jpg', type: 'jpeg', quality: 82 });
      }

      // Exercise the real automatic timer while deterministic rolls select a single repeatable WebP.
      await updated.evaluate(({ id, britishSpecies }) => {
        const save = AtlasSaveBridge.getSaveData();
        save.helpers = 3;
        save.upgrades.autoTier = 3;
        save.lastTick = Date.now();
        const hour = Math.floor(save.lastTick / 3600000);
        save.autoHourly = Object.fromEntries(britishSpecies.filter(key => key !== id)
          .map(key => [hour + ':' + key, 999]));
        Math.random = () => 0.29;
        AtlasSaveBridge.restoreGame(save);
      }, { id, britishSpecies });
      await openTab(updated, 'field');
      const automaticImage = updated.locator('#fieldResult img[src$="nutria_europea--normal.webp"]');
      await automaticImage.evaluate(img => img.decode());
      const firstAutoSequence = await automaticImage.evaluate(img => {
        window.__atlasRepeatedImage = img;
        window.__atlasRepeatedLandscape = document.querySelector('.field-environment .atlas-art-landscape');
        return AtlasSaveBridge.getSaveData().encounterSequence;
      });
      const autoStart = performance.now();
      await updated.waitForFunction(seq => AtlasSaveBridge.getSaveData().encounterSequence > seq, firstAutoSequence);
      const repeatedImage = await automaticImage.evaluate(img => window.__atlasRepeatedImage === img);
      assert.equal(repeatedImage, true);
      const repeatedLandscape = await landscape.evaluate(img => window.__atlasRepeatedLandscape === img);
      assert.equal(repeatedLandscape, true);
      const autoRepeatMs = Math.round(performance.now() - autoStart);

      const workerCache = await updated.evaluate(async version => {
        const names = (await caches.keys()).filter(name => name.startsWith('gran-atlas-'));
        const current = names.find(name => name.startsWith('gran-atlas-v' + version + '-'));
        const entries = await (await caches.open(current)).keys();
        return { names, resources: entries.map(entry => new URL(entry.url).pathname) };
      }, version);
      assert.equal(workerCache.names.length, 1);
      assert.ok(workerCache.names[0].startsWith('gran-atlas-v' + version + '-'));
      for (const size of ['', '64/', '128/', '256/']) {
        assert.ok(workerCache.resources.includes('/naturalist-art/plates/' + size + 'nutria_europea--normal.webp'));
        assert.ok(workerCache.resources.includes('/naturalist-art/plates/' + size + 'af_gorila_montana--silverback.webp'));
      }
      assert.equal(workerCache.resources.some(resource => resource.includes('/naturalist-art/review/')), false);

      await updated.evaluate(region => {
        const save = AtlasSaveBridge.getSaveData();
        const gorilla = 'af_gorila_montana';
        save.currentRegion = region;
        save.regionUnlocked[region] = true;
        save.habitat = 'bosque';
        save.helpers = 0;
        save.lastTick = Date.now();
        save.discovered[gorilla] = true;
        save.stages[gorilla] = 3;
        save.legendaryFound.silverback = true;
        save.lastEncounter = { species: gorilla, title: 'Silverback', sequence: save.encounterSequence, entries: [
          { id: gorilla, amount: 1, variant: 'Legendario', category: 'Legendario' }
        ] };
        AtlasSaveBridge.restoreGame(save);
      }, primateRegion.id);
      await openTab(updated, 'field');
      const silverback = updated.locator('#fieldResult .legendary img[src$="--silverback.webp"]');
      await silverback.evaluate(img => img.decode());
      assert.match(await silverback.evaluate(img => getComputedStyle(img).filter), /drop-shadow/);

      await updated.evaluate(regionSpecies => {
        const save = AtlasSaveBridge.getSaveData();
        const baboon = 'af_babuino_oliva';
        save.discovered[baboon] = true;
        save.stages[baboon] = 2;
        save.helpers = 3;
        save.lastTick = Date.now();
        const hour = Math.floor(save.lastTick / 3600000);
        save.autoHourly = Object.fromEntries(regionSpecies.filter(key => key !== baboon).map(key => [hour + ':' + key, 999]));
        AtlasSaveBridge.restoreGame(save);
      }, primateRegion.species);
      const baboon = updated.locator('#fieldResult img[src*="af_babuino_oliva--"]');
      await baboon.evaluate(img => img.decode());
      const sequence = await baboon.evaluate(img => {
        window.__atlasPrimateImage = img;
        return AtlasSaveBridge.getSaveData().encounterSequence;
      });
      const primateAutoStart = performance.now();
      await updated.waitForFunction(seq => AtlasSaveBridge.getSaveData().encounterSequence > seq, sequence);
      assert.equal(await baboon.evaluate(img => window.__atlasPrimateImage === img), true);
      const primateAutoRepeatMs = Math.round(performance.now() - primateAutoStart);

      const deer = 'ciervo_rojo';
      await updated.evaluate(id => {
        const save = AtlasSaveBridge.getSaveData();
        save.discovered[id] = true;
        save.stages[id] = 3;
        save.helpers = 0;
        save.lastTick = Date.now();
        save.currentRegion = 'HX-01-09';
        save.habitat = 'bosque';
        save.lastEncounter = { species: id, title: 'Ciervo rojo', sequence: save.encounterSequence, entries: [
          { id, amount: 1, sex: 'female' }, { id, amount: 1, sex: 'male' }
        ] };
        AtlasSaveBridge.restoreGame(save);
      }, deer);
      await openTab(updated, 'field');
      const deerSprites = updated.locator('#fieldResult img.atlas-art-image');
      assert.deepEqual(await deerSprites.evaluateAll(images => images.map(image => image.src.split('/').at(-1))),
        ['ciervo_rojo--female.webp', 'ciervo_rojo--normal.webp']);
      await deerSprites.first().evaluate(img => img.decode());

      await ctx.setOffline(true);
      await updated.reload();
      await updated.waitForFunction(() => !!window.AtlasSaveBridge);
      await openTab(updated, 'field');
      await updated.locator('#fieldResult img[src$="ciervo_rojo--female.webp"]').evaluate(img => img.decode());
      await updated.evaluate(({ id, region }) => {
        const save = AtlasSaveBridge.getSaveData();
        save.discovered[id] = true;
        save.stages[id] = 3;
        save.currentRegion = region;
        save.regionUnlocked[region] = true;
        save.habitat = 'pradera';
        save.legendaryFound.atlas = { id: 'atlas', speciesId: id };
        save.lastEncounter = { species: id, title: 'Atlas', sequence: save.encounterSequence, entries: [
          { id, amount: 1, variant: 'Legendario', category: 'Legendario' }
        ] };
        AtlasSaveBridge.restoreGame(save);
      }, { id: elephant, region: savanna.id });
      await openTab(updated, 'field');
      const atlas = updated.locator('#fieldResult .legendary img[src$="--atlas.webp"]');
      await atlas.evaluate(img => img.decode());
      assert.match(await atlas.evaluate(img => getComputedStyle(img).filter), /drop-shadow/);
      await updated.locator('.field-environment .landscape-pradera').evaluate(img => img.decode());

      const riverDolphin = 'sa_esp_inia_geoffrensis';
      await updated.evaluate(id => {
        const save = AtlasSaveBridge.getSaveData();
        save.discovered[id] = true;
        save.published[id] = true;
        save.stages[id] = 5;
        save.sightings[id] = 430;
        save.museum.exhibits[id] = true;
        save.selectedJournal = id;
        save.currentRegion = 'sa_amazonia';
        save.regionUnlocked[save.currentRegion] = true;
        save.habitat = 'rio';
        save.lastEncounter = { species: id, title: 'Delfín rosado', sequence: save.encounterSequence, entries: [
          { id, amount: 1 }
        ] };
        AtlasSaveBridge.restoreGame(save);
      }, riverDolphin);
      const iniaImage = 'img[src$="/sa_esp_inia_geoffrensis--normal.webp"]';
      await openTab(updated, 'field');
      await updated.locator('#fieldResult ' + iniaImage).evaluate(img => img.decode());
      await updated.locator('.field-environment .landscape-rio').evaluate(img => img.decode());
      const fieldHistory = updated.locator('.field-history');
      if (!await fieldHistory.evaluate(details => details.open)) await fieldHistory.locator('summary').click();
      const loggedDolphin = updated.locator('#fieldLog img[src$="/64/sa_esp_inia_geoffrensis--normal.webp"]');
      await loggedDolphin.scrollIntoViewIfNeeded();
      await loggedDolphin.evaluate(img => img.decode());
      if (process.argv.includes('--write-evidence')) {
        await updated.locator('.field-stage').screenshot({
          path: 'docs/cientifica-v460/inia-' + width + '.jpg', type: 'jpeg', quality: 85
        });
      }
      await openTab(updated, 'bestiary');
      await updated.locator('#b26-search').fill('Inia geoffrensis');
      await updated.locator('.b26-card').filter({ has: updated.locator(iniaImage) }).click();
      await updated.locator('.b26-dialog ' + iniaImage).evaluate(img => img.decode());
      await updated.locator('.b26-dialog .landscape-rio').evaluate(img => img.decode());
      assert.equal(await updated.locator('.b26-dialog .landscape-oceano').count(), 0);
      await updated.locator('[data-action=b26-close]').click();
      await openTab(updated, 'journal');
      await updated.locator('.j25-sheet ' + iniaImage).evaluate(img => img.decode());
      await openTab(updated, 'museum');
      await updated.getByRole('tab', { name: 'Exposiciones', exact: true }).click();
      const dolphinExhibit = updated.locator('.m27-vitrines [data-action=m27-open]').filter({ has: updated.locator(iniaImage) });
      await dolphinExhibit.click();
      await updated.locator('.m27-dialog ' + iniaImage).evaluate(img => img.decode());
      await updated.locator('[data-action=m27-close]').click();

      await updated.goto(url + 'naturalist-art/');
      await updated.locator('.field-card .atlas-art-image').evaluate(img => img.decode());
      await updated.locator('.field-card .atlas-art-landscape').evaluate(img => img.decode());
      assert.deepEqual(errors, []);
      results.push({ width, fieldBeforeMs: beforeMs, fieldWebPMs: afterMs, fieldBeforeJSHeapBytes: beforeHeap, fieldWebpJSHeapBytes: afterHeap, exactSaveBackup: true,
        preservedFields: keys.length, multiEncounter: true, mixedWebpAndSvg: true, habitatChangedThroughUI: true, timeLightingChanged: true, estimatedVisibleRGBABytes: imageBytes, offlineCacheEntries: workerCache.resources.length, autoRepeatMs, reusedDecodedImage: repeatedImage, reusedLandscape: repeatedLandscape, spritesOffline: true, labOffline: true, silverback: true, primateAutoRepeatMs, ungulateDimorphismOffline: true, atlasLegendaryOffline: true, freshwaterDolphinInAllModulesOffline: true, optionalReviewOutsideGameCache: true, errors });
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
