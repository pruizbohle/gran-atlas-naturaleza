'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');
const evidenceDir = process.env.ATLAS_EVIDENCE_DIR || 'docs/cientifica-v492';
const { harness } = require('../tests/helpers/live-game.cjs');

const baseline = process.env.ATLAS_BASELINE || 'dc7929a902a6383f1b32e1ba6501e31675747071';
const baselineWeb = process.env.ATLAS_BASELINE_WWW;
const version = require('../package.json').version;
const baselineRelease = execFileSync('git', ['show', baseline + ':www/atlas-release.json'], { encoding: 'utf8' });
if (baselineWeb) assert.equal(fs.readFileSync(path.join(baselineWeb, 'atlas-release.json'), 'utf8'), baselineRelease);
const mime = { html: 'text/html', js: 'text/javascript', css: 'text/css', webp: 'image/webp', png: 'image/png', svg: 'image/svg+xml' };
const oldFiles = new Map();
let candidate = false;
const server = http.createServer((request, response) => {
  try {
    const requested = decodeURIComponent(new URL(request.url, 'http://local').pathname).slice(1);
    const name = requested.endsWith('/') || !requested ? requested + 'index.html' : requested;
    if (name.includes('..')) throw Error('path');
    if (!candidate && !oldFiles.has(name)) {
      const prior = baselineWeb ? fs.readFileSync(path.join(baselineWeb, name)) :
        execFileSync('git', ['show', baseline + ':www/' + name], { maxBuffer: 16e6, stdio: ['ignore', 'pipe', 'ignore'] });
      oldFiles.set(name, prior);
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

async function measureVisualScale(locator, expected) {
  const measured = await locator.evaluate(async img => {
    await img.decode();
    const frame = img.closest('.atlas-art-frame');
    const button = img.closest('button');
    const box = element => {
      const { width, height } = element.getBoundingClientRect();
      return [width, height];
    };
    const layout = () => ({ frame: box(frame), interaction: button && box(button) });
    const scaled = box(img);
    const scaledLayout = layout();
    const halo = getComputedStyle(img).filter;
    const property = '--art-visual-transform';
    const original = img.style.getPropertyValue(property);
    img.style.removeProperty(property);
    const full = box(img);
    const fullLayout = layout();
    if (original) img.style.setProperty(property, original);
    return { width: scaled[0] / full[0], height: scaled[1] / full[1], halo, scaledLayout, fullLayout };
  });
  for (const dimension of ['width', 'height']) assert.ok(Math.abs(measured[dimension] - expected) < 0.002);
  assert.deepEqual(measured.scaledLayout, measured.fullLayout);
  return { width: measured.width, height: measured.height, frame: measured.scaledLayout.frame,
    interaction: measured.scaledLayout.interaction, halo: measured.halo };
}

async function run() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const id = 'nutria_europea';
  const id2 = 'eu_esp_0668';
  const regions = harness().window.__atlasTest.REGIONS;
  const { records } = require('../www/js/gm07-a04/catalog.js');
  const catalogSource = ['gm06/catalog', 'gm07-a04/catalog', 'app']
    .map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
  const expandedRegions = harness({}, null, { gameSource: catalogSource }).window.__atlasTest.REGIONS;
  const britishSpecies = regions.find(region => region.id === 'HX-01-09').species;
  const mixedRegion = regions.find(region => region.id === 'HX-02-11');
  const primateRegion = regions.find(region => region.id === 'HX-09-11');
  const elephant = 'af_elefante_sabana';
  const savanna = regions.find(region => region.id === 'HX-07-10');
  const partridgeRegion = regions.find(region => region.id === 'HX-02-12');
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
      await page.goto(url + 'actualizar-atlas.html');
      await page.locator('#atlasUpdateApply').click();
      await page.getByText(/Descarga completa e integridad verificada/).waitFor({ timeout: 180000 });
      await page.locator('#atlasUpdateInstall').click();
      await page.getByText(/instalada\. El juego/).waitFor();
      await page.locator('#atlasUpdateReturn').click();
      await page.waitForFunction(() => !!window.AtlasSaveBridge);
      await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 120000 });
      await page.evaluate(({ id, id2, zone }) => {
        const save = AtlasSaveBridge.getSaveData();
        for (const key of [id, id2]) {
          save.discovered[key] = true;
          save.published[key] = true;
          save.stages[key] = 5;
          save.sightings[key] = 430;
        }
        save.currentRegion = zone;
        save.regionUnlocked[save.currentRegion] = true;
        save.selectedJournal = id;
        save.discovered.sa_esp_scelorchilus_rubecula = true;
        save.sightings.sa_esp_scelorchilus_rubecula = 19;
        save.stages.sa_esp_scelorchilus_rubecula = 3;
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
      }, { id, id2, zone: mixedRegion.id });
      assert.equal(await page.locator('#fieldResult .atlas-art-image').count(), 1);
      assert.equal(await page.locator('#fieldResult .field-animal-sprite > svg').count(), 1);
      const startOld = performance.now();
      await openTab(page, 'field');
      await page.locator('#fieldResult .atlas-art-image').first().evaluate(img => img.decode());
      const beforeMs = Math.round(performance.now() - startOld);
      const beforeHeap = await jsHeap(page);

      candidate = true;
      const updated = await ctx.newPage();
      updated.on('pageerror', e => errors.push(e.message));
      await updated.goto(url + 'actualizar-atlas.html');
      await updated.locator('#atlasUpdateApply').click();
      await updated.getByText(/Descarga completa e integridad verificada/).waitFor({ timeout: 180000 });
      await updated.locator('#atlasUpdateInstall').click();
      await updated.getByText(/otra pestaña o ventana/).waitFor();
      await page.close();
      const raw = await updated.evaluate(() => localStorage.getItem('gran_atlas_v05'));
      await updated.locator('#atlasUpdateInstall').click();
      const refreshed = updated.getByText(/Se verificó un respaldo nuevo/);
      await updated.getByText(/Se verificó un respaldo nuevo|instalada\. El juego/).waitFor();
      if (await refreshed.isVisible()) await updated.locator('#atlasUpdateInstall').click();
      await updated.getByText(/instalada\. El juego/).waitFor();
      await updated.locator('#atlasUpdateReturn').click();
      await updated.waitForURL(url + 'index.html?actualizado=' + version, { timeout: 120000 });
      await updated.waitForFunction(() => !!window.AtlasSaveBridge);
      const after = await updated.evaluate(() => AtlasSaveBridge.getSaveData());
      const before = JSON.parse(raw);
      assert.equal(await updated.evaluate(() => localStorage.getItem('gran_atlas_backup_before_update')), raw);
      const keys = ['discovered', 'published', 'sightings', 'stages', 'specialFound', 'legendaryFound', 'museum', 'inventory', 'knowledge', 'money', 'regionUnlocked'];
      for (const key of keys) assert.deepEqual(after[key], before[key], key);
      const startNew = performance.now();
      await openTab(updated, 'field');
      const mark = updated.locator('#fieldResult .atlas-art-frame.notable img');
      await mark.evaluate(img => img.decode());
      const afterMs = Math.round(performance.now() - startNew);
      const afterHeap = await jsHeap(updated);
      assert.equal(await updated.locator('#fieldResult .atlas-art-cutout').count(), 2);
      assert.equal(await updated.locator('.field-environment .landscape-bosque').count(), 1);
      assert.equal(await mark.evaluate(img => getComputedStyle(img).filter.includes('drop-shadow')), true);
      assert.match(await mark.getAttribute('src'), /--albino\.webp$/);
      assert.equal(await updated.locator('#fieldResult .atlas-art-image').count(), 2);
      await updated.locator('#fieldResult img[src$="/eu_esp_0668--normal.webp"]').evaluate(img => img.decode());
      assert.equal(await updated.locator('#fieldResult .field-animal-sprite > svg').count(), 0);
      const imageBytes = await mark.evaluate(img => img.naturalWidth * img.naturalHeight * 4);
      assert.deepEqual(await updated.locator('#fieldResult .encounter-multiplier').allTextContents(), ['×3', '×2']);
      assert.equal(await updated.locator('#fieldLog .atlas-art-image').count(), 2);
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
          path: evidenceDir + '/campo-' + width + '.jpg', type: 'jpeg', quality: 85
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
        await updated.screenshot({ path: evidenceDir + '/cuaderno-' + width + '.jpg', type: 'jpeg', quality: 82 });
      }

      // Exercise the real automatic timer while deterministic rolls select a single repeatable WebP.
      await updated.evaluate(({ id, mixedSpecies }) => {
        const save = AtlasSaveBridge.getSaveData();
        save.helpers = 3;
        save.upgrades.autoTier = 3;
        save.lastTick = Date.now();
        const hour = Math.floor(save.lastTick / 3600000);
        save.autoHourly = Object.fromEntries(mixedSpecies.filter(key => key !== id)
          .map(key => [hour + ':' + key, 999]));
        Math.random = () => 0.29;
        AtlasSaveBridge.restoreGame(save);
      }, { id, mixedSpecies: mixedRegion.species });
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
        assert.ok(workerCache.resources.includes('/naturalist-art/plates/' + size + 'asia_esp_0369--remonte.webp'));
        assert.ok(workerCache.resources.includes('/naturalist-art/plates/' + size + 'eu_esp_0668--melanico.webp'));
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

      await updated.evaluate(regionSpecies => {
        const save = AtlasSaveBridge.getSaveData();
        const buzzard = 'eu_esp_0643';
        save.currentRegion = 'HX-01-09';
        save.regionUnlocked[save.currentRegion] = true;
        save.habitat = 'pradera';
        save.time = 'dia';
        save.season = 'primavera';
        save.discovered[buzzard] = true;
        save.stages[buzzard] = 2;
        save.helpers = 3;
        save.lastTick = Date.now();
        const hour = Math.floor(save.lastTick / 3600000);
        save.autoHourly = Object.fromEntries(regionSpecies.filter(key => key !== buzzard).map(key => [hour + ':' + key, 999]));
        AtlasSaveBridge.restoreGame(save);
      }, britishSpecies);
      const buzzard = updated.locator('#fieldResult img[src$="eu_esp_0643--normal.webp"]');
      await buzzard.evaluate(img => img.decode());
      const raptorSequence = await buzzard.evaluate(img => {
        window.__atlasBuzzardImage = img;
        return AtlasSaveBridge.getSaveData().encounterSequence;
      });
      const raptorAutoStart = performance.now();
      await updated.waitForFunction(seq => AtlasSaveBridge.getSaveData().encounterSequence > seq, raptorSequence);
      assert.equal(await buzzard.evaluate(img => window.__atlasBuzzardImage === img), true);
      const raptorAutoRepeatMs = Math.round(performance.now() - raptorAutoStart);

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
          path: evidenceDir + '/inia-' + width + '.jpg', type: 'jpeg', quality: 85
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

      const goldenEagle = 'aguila_real';
      await updated.evaluate(id => {
        const save = AtlasSaveBridge.getSaveData();
        save.currentRegion = 'HX-02-09';
        save.regionUnlocked[save.currentRegion] = true;
        save.habitat = 'montana';
        save.discovered[id] = true;
        save.published[id] = true;
        save.stages[id] = 5;
        save.sightings[id] = 430;
        save.selectedJournal = id;
        save.legendaryFound.centinela = { id: 'centinela', speciesId: id };
        save.lastEncounter = { species: id, title: 'Centinela', sequence: save.encounterSequence, entries: [
          { id, amount: 1, variant: 'Legendario', category: 'Legendario' }
        ] };
        AtlasSaveBridge.restoreGame(save);
      }, goldenEagle);
      await openTab(updated, 'field');
      const centinela = updated.locator('#fieldResult .legendary img[src$="--centinela.webp"]');
      await centinela.evaluate(img => img.decode());
      assert.match(await centinela.evaluate(img => getComputedStyle(img).filter), /drop-shadow/);
      await updated.locator('.field-environment .landscape-montana').evaluate(img => img.decode());
      if (process.argv.includes('--write-evidence')) {
        await updated.locator('.field-stage').screenshot({
          path: evidenceDir + '/centinela-' + width + '.jpg', type: 'jpeg', quality: 85
        });
      }
      await openTab(updated, 'journal');
      await updated.locator('.j25-sheet img[src$="/aguila_real--normal.webp"]').first().evaluate(img => img.decode());

      const puffin = 'frailecillo_atlantico';
      await updated.evaluate(id => {
        const save = AtlasSaveBridge.getSaveData();
        save.currentRegion = 'HX-01-09';
        save.habitat = 'costa';
        save.helpers = 0;
        save.discovered[id] = true;
        save.stages[id] = 2;
        save.lastEncounter = { species: id, title: 'Frailecillo atlántico', sequence: save.encounterSequence, entries: [
          { id, amount: 1, category: 'Notable' }
        ] };
        AtlasSaveBridge.restoreGame(save);
      }, puffin);
      await openTab(updated, 'field');
      const puffinImage = updated.locator('#fieldResult .notable img[src$="frailecillo_atlantico--normal.webp"]');
      await puffinImage.evaluate(img => img.decode());
      assert.match(await puffinImage.evaluate(img => getComputedStyle(img).filter), /drop-shadow/);
      await updated.locator('.field-environment .landscape-costa').evaluate(img => img.decode());
      if (process.argv.includes('--write-evidence')) {
        await updated.locator('.field-stage').screenshot({
          path: evidenceDir + '/frailecillo-' + width + '.jpg', type: 'jpeg', quality: 85
        });
      }

      const shoveler = 'eu_esp_0649';
      await updated.evaluate(({ id, regionSpecies }) => {
        const save = AtlasSaveBridge.getSaveData();
        save.habitat = 'bosque';
        save.time = 'dia';
        save.season = 'primavera';
        save.discovered[id] = true;
        save.published[id] = true;
        save.stages[id] = 5;
        save.sightings[id] = 430;
        save.selectedJournal = id;
        save.museum.exhibits[id] = true;
        save.helpers = 3;
        save.lastTick = Date.now();
        const hour = Math.floor(save.lastTick / 3600000);
        save.autoHourly = Object.fromEntries(regionSpecies.filter(key => key !== id).map(key => [hour + ':' + key, 999]));
        AtlasSaveBridge.restoreGame(save);
      }, { id: shoveler, regionSpecies: britishSpecies });
      const shovelerImage = updated.locator('#fieldResult img[src*="eu_esp_0649--"]');
      await shovelerImage.evaluate(img => img.decode());
      const aquaticSequence = await updated.evaluate(() => AtlasSaveBridge.getSaveData().encounterSequence);
      const aquaticAutoStart = performance.now();
      await updated.waitForFunction(seq => AtlasSaveBridge.getSaveData().encounterSequence > seq, aquaticSequence);
      // Repeated sightings can select a different sex or pigment and use a new image.
      await shovelerImage.evaluate(img => img.decode());
      const aquaticAutoRepeatMs = Math.round(performance.now() - aquaticAutoStart);
      await updated.locator('.field-environment .landscape-bosque').evaluate(img => img.decode());
      await openTab(updated, 'journal');
      await updated.locator('.j25-sheet img[src*="eu_esp_0649--"]').first().evaluate(img => img.decode());
      await openTab(updated, 'bestiary');
      const shovelerPlate = 'img[src*="eu_esp_0649--"]';
      await updated.locator('#b26-search').fill('Spatula clypeata');
      await updated.locator('.b26-card').filter({ has: updated.locator(shovelerPlate) }).click();
      await updated.locator('.b26-dialog .landscape-humedal').evaluate(img => img.decode());
      await updated.locator('.b26-dialog ' + shovelerPlate).first().evaluate(img => img.decode());
      await updated.locator('[data-action=b26-close]').click();
      await openTab(updated, 'museum');
      await updated.getByRole('tab', { name: 'Exposiciones', exact: true }).click();
      await updated.locator('.m27-vitrines [data-action=m27-open]').filter({ has: updated.locator(shovelerPlate) }).click();
      await updated.locator('.m27-dialog ' + shovelerPlate).first().evaluate(img => img.decode());
      await updated.locator('[data-action=m27-close]').click();

      const ostrich = 'af_avestruz';
      await updated.evaluate(id => {
        const save = AtlasSaveBridge.getSaveData();
        save.currentRegion = 'HX-07-10';
        save.regionUnlocked[save.currentRegion] = true;
        save.habitat = 'pradera';
        save.helpers = 0;
        save.discovered[id] = true;
        save.published[id] = true;
        save.stages[id] = 5;
        save.sightings[id] = 430;
        save.selectedJournal = id;
        save.museum.exhibits[id] = true;
        save.lastEncounter = { species: id, title: 'Avestruz común', sequence: save.encounterSequence, entries: [
          { id, amount: 1, sex: 'female', category: 'Notable' }
        ] };
        AtlasSaveBridge.restoreGame(save);
      }, ostrich);
      await openTab(updated, 'field');
      const ostrichFemale = updated.locator('#fieldResult .notable img[src$="/af_avestruz--female.webp"]');
      await ostrichFemale.evaluate(img => img.decode());
      assert.match(await ostrichFemale.evaluate(img => getComputedStyle(img).filter), /drop-shadow/);
      await updated.locator('.field-environment .landscape-pradera').evaluate(img => img.decode());
      if (process.argv.includes('--write-evidence')) {
        await updated.locator('.field-stage').screenshot({
          path: evidenceDir + '/avestruz-' + width + '.jpg', type: 'jpeg', quality: 85
        });
      }
      const ostrichPlate = 'img[src$="/af_avestruz--normal.webp"]';
      await openTab(updated, 'journal');
      await updated.locator('.j25-sheet ' + ostrichPlate).first().evaluate(img => img.decode());
      await openTab(updated, 'bestiary');
      await updated.locator('#b26-search').fill('Struthio camelus');
      await updated.locator('.b26-card').filter({ has: updated.locator(ostrichPlate) }).click();
      await updated.locator('.b26-dialog ' + ostrichPlate).first().evaluate(img => img.decode());
      await updated.locator('[data-action=b26-close]').click();
      await openTab(updated, 'museum');
      await updated.getByRole('tab', { name: 'Exposiciones', exact: true }).click();
      await updated.locator('.m27-vitrines [data-action=m27-open]').filter({ has: updated.locator(ostrichPlate) }).click();
      await updated.locator('.m27-dialog ' + ostrichPlate).first().evaluate(img => img.decode());
      await updated.locator('[data-action=m27-close]').click();

      await updated.evaluate(({ region, regionSpecies }) => {
        const save = AtlasSaveBridge.getSaveData();
        const id = 'eu_esp_0641';
        save.currentRegion = region;
        save.regionUnlocked[region] = true;
        save.habitat = 'pradera';
        save.time = 'dia';
        save.season = 'primavera';
        save.discovered[id] = true;
        save.stages[id] = 2;
        save.helpers = 3;
        save.lastTick = Date.now();
        const hour = Math.floor(save.lastTick / 3600000);
        save.autoHourly = Object.fromEntries(regionSpecies.filter(key => key !== id).map(key => [hour + ':' + key, 999]));
        AtlasSaveBridge.restoreGame(save);
      }, { region: partridgeRegion.id, regionSpecies: partridgeRegion.species });
      await openTab(updated, 'field');
      const partridge = updated.locator('#fieldResult img[src*="eu_esp_0641--"]');
      await partridge.evaluate(img => img.decode());
      const terrestrialSequence = await updated.evaluate(() => AtlasSaveBridge.getSaveData().encounterSequence);
      const terrestrialAutoStart = performance.now();
      await updated.waitForFunction(seq => AtlasSaveBridge.getSaveData().encounterSequence > seq, terrestrialSequence);
      await partridge.evaluate(img => img.decode());
      const terrestrialAutoRepeatMs = Math.round(performance.now() - terrestrialAutoStart);

      const chaffinch = 'eu_esp_0629';
      await updated.evaluate(({ id, regionSpecies }) => {
        const save = AtlasSaveBridge.getSaveData();
        save.currentRegion = 'HX-01-09';
        save.habitat = 'bosque';
        save.time = 'dia';
        save.season = 'primavera';
        save.helpers = 3;
        save.lastTick = Date.now();
        delete save.discovered[id];
        delete save.sightings[id];
        delete save.stages[id];
        const hour = Math.floor(save.lastTick / 3600000);
        save.autoHourly = Object.fromEntries(regionSpecies.filter(key => key !== id).map(key => [hour + ':' + key, 999]));
        AtlasSaveBridge.restoreGame(save);
      }, { id: chaffinch, regionSpecies: britishSpecies });
      await openTab(updated, 'field');
      const passerinePlate = 'img[src*="/' + chaffinch + '--"]';
      const passerineStart = performance.now();
      await updated.locator('#fieldResult ' + passerinePlate).evaluate(img => img.decode());
      const passerineAutoMs = Math.round(performance.now() - passerineStart);
      assert.ok(await updated.evaluate(id => AtlasSaveBridge.getSaveData().sightings[id] > 0, chaffinch));
      await updated.evaluate(id => {
        const save = AtlasSaveBridge.getSaveData();
        save.helpers = 0;
        save.stages[id] = 5;
        save.selectedJournal = id;
        save.published[id] = true;
        save.museum.exhibits[id] = true;
        save.lastEncounter = { species: id, title: 'Pinzón vulgar', sequence: save.encounterSequence,
          entries: [{ id, amount: 1, sex: 'female', category: 'Notable' }] };
        AtlasSaveBridge.restoreGame(save);
      }, chaffinch);
      await openTab(updated, 'field');
      const passerineFemale = updated.locator('#fieldResult .notable img[src$="/eu_esp_0629--female.webp"]');
      await passerineFemale.evaluate(img => img.decode());
      assert.match(await passerineFemale.evaluate(img => getComputedStyle(img).filter), /drop-shadow/);
      if (process.argv.includes('--write-evidence')) {
        await updated.locator('.field-stage').screenshot({
          path: evidenceDir + '/pinzon-' + width + '.jpg', type: 'jpeg', quality: 85
        });
      }
      await openTab(updated, 'journal');
      await updated.locator('.j25-sheet ' + passerinePlate).first().evaluate(img => img.decode());
      await openTab(updated, 'bestiary');
      await updated.locator('#b26-search').fill('Fringilla coelebs');
      await updated.locator('.b26-card').filter({ has: updated.locator(passerinePlate) }).click();
      await updated.locator('.b26-dialog ' + passerinePlate).first().evaluate(img => img.decode());
      await updated.locator('[data-action=b26-close]').click();
      await openTab(updated, 'museum');
      await updated.getByRole('tab', { name: 'Exposiciones', exact: true }).click();
      await updated.locator('.m27-vitrines [data-action=m27-open]').filter({ has: updated.locator(passerinePlate) }).click();
      await updated.locator('.m27-dialog ' + passerinePlate).first().evaluate(img => img.decode());
      await updated.locator('[data-action=m27-close]').click();

      const discoveryChecks = {};
      const scaleChecks = {};
      const scaleFactors = { sa_esp_brachycephalus_pulex: 0.25, gm06_mellisuga_helenae: 0.5 };
      const smallBird = ['gm06_mellisuga_helenae', { latin: 'Mellisuga helenae', region: 'gm06_antillas' }];
      for (const [speciesId, record] of [...Object.entries(records), smallBird]) {
        const factor = scaleFactors[speciesId];
        const checks = factor ? (scaleChecks[speciesId] = {}) : null;
        const region = expandedRegions.find(r => r.id === record.region);
        await updated.evaluate(({ speciesId, region }) => {
          const save = AtlasSaveBridge.getSaveData();
          save.currentRegion = region.id;
          save.regionUnlocked[region.id] = true;
          save.habitat = 'bosque';
          save.time = 'dia';
          save.season = 'primavera';
          save.helpers = 3;
          save.lastTick = Date.now();
          delete save.discovered[speciesId];
          delete save.sightings[speciesId];
          delete save.stages[speciesId];
          const hour = Math.floor(save.lastTick / 3600000);
          save.autoHourly = Object.fromEntries(region.species.filter(key => key !== speciesId).map(key => [hour + ':' + key, 999]));
          AtlasSaveBridge.restoreGame(save);
        }, { speciesId, region });
        await openTab(updated, 'field');
        const plate = 'img[src$="/' + speciesId + '--normal.webp"]';
        const scene = updated.locator('#fieldResult ' + plate);
        const start = performance.now();
        await scene.evaluate(img => img.decode());
        if (checks) checks.automatic = await measureVisualScale(scene, factor);
        const found = await updated.evaluate(id => {
          const save = AtlasSaveBridge.getSaveData();
          return { discovered: save.discovered[id], sightings: save.sightings[id], region: save.currentRegion, habitat: save.habitat };
        }, speciesId);
        assert.equal(found.discovered, true);
        assert.ok(found.sightings > 0);
        assert.equal(found.region, record.region);
        assert.equal(found.habitat, 'bosque');
        discoveryChecks[speciesId] = { ...found, renderMs: Math.round(performance.now() - start) };
        if (process.argv.includes('--write-evidence')) {
          await updated.locator('.field-stage').screenshot({
            path: evidenceDir + '/' + (speciesId === smallBird[0] ? 'colibri-abeja' : record.species ? 'sapo-pulga' : 'chucao') + '-' + width + '.jpg',
            type: 'jpeg', quality: 85
          });
        }
        await updated.evaluate(({ id, scaled }) => {
          const save = AtlasSaveBridge.getSaveData();
          save.helpers = 0;
          save.stages[id] = 5;
          save.selectedJournal = id;
          save.published[id] = true;
          save.museum.exhibits[id] = true;
          if (scaled) {
            save.lastEncounter = { species: id, title: 'Avistamiento de prueba', sequence: save.encounterSequence,
              entries: [{ id, amount: 1, category: 'Notable' }] };
          }
          AtlasSaveBridge.restoreGame(save);
        }, { id: speciesId, scaled: Boolean(checks) });
        if (checks) {
          await openTab(updated, 'field');
          checks.field = await measureVisualScale(updated.locator('#fieldResult .notable ' + plate), factor);
          assert.match(checks.field.halo, /drop-shadow/);
        }
        await openTab(updated, 'journal');
        const journalPlate = updated.locator('.j25-sheet ' + plate).first();
        if (checks) checks.journal = await measureVisualScale(journalPlate, factor);
        else await journalPlate.evaluate(img => img.decode());
        await openTab(updated, 'bestiary');
        await updated.locator('#b26-search').fill(record.latin);
        const card = updated.locator('.b26-card').filter({ has: updated.locator(plate) });
        if (checks) {
          checks.bestiary = await measureVisualScale(card.locator(plate), factor);
          assert.ok(checks.bestiary.interaction[0] > checks.bestiary.frame[0]);
        }
        await card.click({ position: { x: 8, y: 8 } });
        const detail = updated.locator('.b26-dialog');
        const portrait = detail.locator(plate).first();
        if (checks) checks.detail = await measureVisualScale(portrait, factor);
        else await portrait.evaluate(img => img.decode());
        if (record.reference) {
          assert.match(await detail.locator('.b26-region').first().innerText(), /Región principal/);
          await detail.locator('.species-monograph summary').click();
          assert.equal(await detail.locator('.species-monograph a').getAttribute('href'), record.reference.url);
        }
        await updated.locator('[data-action=b26-close]').click();
        await openTab(updated, 'museum');
        await updated.getByRole('tab', { name: 'Exposiciones', exact: true }).click();
        const exhibit = updated.locator('.m27-vitrines [data-action=m27-open]').filter({ has: updated.locator(plate) });
        if (checks) checks.museum = await measureVisualScale(exhibit.locator(plate).first(), factor);
        await exhibit.click({ position: { x: 8, y: 8 } });
        const display = updated.locator('.m27-dialog ' + plate).first();
        if (checks) checks.exhibit = await measureVisualScale(display, factor);
        else await display.evaluate(img => img.decode());
        await updated.locator('[data-action=m27-close]').click();
      }

      const lizard = 'lagarto_ocelado';
      await updated.evaluate(({ id, region }) => {
        const save = AtlasSaveBridge.getSaveData();
        save.currentRegion = region.id;
        save.regionUnlocked[region.id] = true;
        save.habitat = 'pradera';
        save.time = 'dia';
        save.season = 'primavera';
        save.helpers = 3;
        save.lastTick = Date.now();
        delete save.discovered[id];
        delete save.sightings[id];
        delete save.stages[id];
        const hour = Math.floor(save.lastTick / 3600000);
        save.autoHourly = Object.fromEntries(region.species.filter(key => key !== id).map(key => [hour + ':' + key, 999]));
        AtlasSaveBridge.restoreGame(save);
      }, { id: lizard, region: partridgeRegion });
      await openTab(updated, 'field');
      const lizardPlate = 'img[src*="/lagarto_ocelado--"]';
      const lizardStart = performance.now();
      await updated.locator('#fieldResult ' + lizardPlate).evaluate(img => img.decode());
      const squamateAutoMs = Math.round(performance.now() - lizardStart);
      assert.ok(await updated.evaluate(id => AtlasSaveBridge.getSaveData().sightings[id] > 0, lizard));
      await updated.locator('.field-environment .landscape-pradera').evaluate(img => img.decode());
      await updated.evaluate(id => {
        const save = AtlasSaveBridge.getSaveData();
        save.helpers = 0;
        save.stages[id] = 5;
        save.selectedJournal = id;
        save.published[id] = true;
        save.museum.exhibits[id] = true;
        AtlasSaveBridge.restoreGame(save);
      }, lizard);
      await openTab(updated, 'journal');
      await updated.locator('.j25-sheet ' + lizardPlate).first().evaluate(img => img.decode());
      await openTab(updated, 'bestiary');
      await updated.locator('#b26-search').fill('Timon lepidus');
      await updated.locator('.b26-card').filter({ has: updated.locator(lizardPlate) }).click();
      await updated.locator('.b26-dialog ' + lizardPlate).first().evaluate(img => img.decode());
      await updated.locator('.b26-dialog .landscape-pradera').evaluate(img => img.decode());
      await updated.locator('[data-action=b26-close]').click();
      await openTab(updated, 'museum');
      await updated.getByRole('tab', { name: 'Exposiciones', exact: true }).click();
      await updated.locator('.m27-vitrines [data-action=m27-open]').filter({ has: updated.locator(lizardPlate) }).click();
      await updated.locator('.m27-dialog ' + lizardPlate).first().evaluate(img => img.decode());
      await updated.locator('[data-action=m27-close]').click();

      const reptileLegends = [];
      for (const [id, legend, region, habitat] of [
        ['asia_esp_0527', 'basalto', 'HX-06-17', 'selva'], ['asia_esp_0373', 'seda', 'HX-06-17', 'selva'],
        ['af_cocodrilo_nilo', 'junco', 'HX-07-10', 'rio'], ['af_tortuga_aldabra', 'ancora', 'HX-07-14', 'pradera']
      ]) {
        await updated.evaluate(({ id, legend, region, habitat }) => {
          const save = AtlasSaveBridge.getSaveData();
          save.currentRegion = region;
          save.regionUnlocked[save.currentRegion] = true;
          save.habitat = habitat;
          save.discovered[id] = true;
          save.stages[id] = 5;
          save.selectedJournal = id;
          save.legendaryFound[legend] = { id: legend, speciesId: id };
          save.lastEncounter = { species: id, title: legend, sequence: save.encounterSequence, entries: [
            { id, amount: 1, variant: 'Legendario', category: 'Legendario' }
          ] };
          AtlasSaveBridge.restoreGame(save);
        }, { id, legend, region, habitat });
        await openTab(updated, 'field');
        const art = updated.locator('#fieldResult .legendary img[src$="--' + legend + '.webp"]');
        await art.evaluate(img => img.decode());
        assert.match(await art.evaluate(img => getComputedStyle(img).filter), /drop-shadow/);
        await updated.locator('.field-environment .landscape-' + habitat).evaluate(img => img.decode());
        reptileLegends.push(legend);
        if (process.argv.includes('--write-evidence')) {
          await updated.locator('.field-stage').screenshot({ path: evidenceDir + '/' + legend + '-' + width + '.jpg', type: 'jpeg', quality: 85 });
        }
      }

      const amphibianChecks = {};
      for (const specimen of [
        { id: 'eu_esp_0660', latin: 'Rana temporaria', zone: 'HX-01-09', habitat: 'bosque', pigment: 'Melánico', key: 'melanico' },
        { id: 'na_esp_ambystoma_mexicanum', latin: 'Ambystoma mexicanum', zone: 'HX-04-02', habitat: 'rio', pigment: 'Albino', key: 'albino' }
      ]) {
        const { id, latin, zone, habitat, key } = specimen;
        const region = expandedRegions.find(region => region.id === zone);
        await updated.evaluate(({ id, habitat, region }) => {
          const save = AtlasSaveBridge.getSaveData();
          save.currentRegion = region.id;
          save.regionUnlocked[region.id] = true;
          save.habitat = habitat;
          save.time = 'dia';
          save.season = 'primavera';
          save.helpers = 3;
          save.lastTick = Date.now();
          delete save.discovered[id];
          delete save.sightings[id];
          delete save.stages[id];
          const hour = Math.floor(save.lastTick / 3600000);
          save.autoHourly = Object.fromEntries(region.species.filter(key => key !== id).map(key => [hour + ':' + key, 999]));
          AtlasSaveBridge.restoreGame(save);
        }, { id, habitat, region });
        await openTab(updated, 'field');
        const start = performance.now();
        await updated.locator('#fieldResult img[src*="/' + id + '--"]').evaluate(img => img.decode());
        const automaticMs = Math.round(performance.now() - start);
        assert.ok(await updated.evaluate(id => AtlasSaveBridge.getSaveData().sightings[id] > 0, id));
        await updated.evaluate(({ id, pigment }) => {
          const save = AtlasSaveBridge.getSaveData();
          save.helpers = 0;
          save.stages[id] = 5;
          save.published[id] = true;
          save.selectedJournal = id;
          save.specialFound[id] = { [pigment]: true, Notable: true };
          save.museum.exhibits[id] = true;
          save.lastEncounter = { species: id, title: 'Anfibio', sequence: save.encounterSequence,
            entries: [{ id, amount: 2, variant: pigment, category: 'Notable' }] };
          AtlasSaveBridge.restoreGame(save);
        }, specimen);
        const variant = updated.locator('#fieldResult .notable img[src$="/' + id + '--' + key + '.webp"]');
        await variant.evaluate(img => img.decode());
        assert.match(await variant.evaluate(img => getComputedStyle(img).filter), /drop-shadow/);
        await updated.locator('.field-environment .landscape-' + habitat).evaluate(img => img.decode());
        if (process.argv.includes('--write-evidence')) {
          await updated.locator('.field-stage').screenshot({
            path: evidenceDir + '/campo-' + key + '-' + width + '.jpg', type: 'jpeg', quality: 85
          });
        }
        const normal = 'img[src$="/' + id + '--normal.webp"]';
        await openTab(updated, 'journal');
        await updated.locator('.j25-sheet ' + normal).first().evaluate(img => img.decode());
        await openTab(updated, 'bestiary');
        await updated.locator('#b26-search').fill(latin);
        await updated.locator('.b26-card').filter({ has: updated.locator(normal) }).click();
        await updated.locator('.b26-dialog ' + normal).first().evaluate(img => img.decode());
        await updated.locator('[data-action=b26-close]').click();
        await openTab(updated, 'museum');
        await updated.getByRole('tab', { name: 'Exposiciones', exact: true }).click();
        await updated.locator('.m27-vitrines [data-action=m27-open]').filter({ has: updated.locator(normal) }).click();
        await updated.locator('.m27-dialog ' + normal).first().evaluate(img => img.decode());
        await updated.locator('[data-action=m27-close]').click();
        amphibianChecks[id] = { automaticMs, habitat, variant: key, modules: ['Campo', 'Cuaderno', 'Bestiario', 'Museo'] };
      }

      await updated.evaluate(ids => {
        const save = AtlasSaveBridge.getSaveData();
        save.lastEncounter = { species: ids[0], title: 'Escala después de reiniciar', sequence: save.encounterSequence,
          entries: ids.map(id => ({ id, amount: 1, category: 'Notable' })) };
        AtlasSaveBridge.restoreGame(save);
        AtlasSaveBridge.persistBeforeUpdate();
      }, Object.keys(scaleFactors));
      await updated.reload();
      await openTab(updated, 'field');
      for (const [id, factor] of Object.entries(scaleFactors)) {
        const image = updated.locator('#fieldResult img[src$="/' + id + '--normal.webp"]');
        scaleChecks[id].afterRestart = await measureVisualScale(image, factor);
      }

      await updated.goto(url + 'naturalist-art/');
      await updated.locator('.field-card .atlas-art-image').evaluate(img => img.decode());
      await updated.locator('.field-card .atlas-art-landscape').evaluate(img => img.decode());
      assert.deepEqual(errors, []);
      results.push({ width, fieldBeforeMs: beforeMs, fieldWebPMs: afterMs, fieldBeforeJSHeapBytes: beforeHeap, fieldWebpJSHeapBytes: afterHeap, exactSaveBackup: true,
        preservedFields: keys.length, multiEncounter: true, freshwaterUpgradedFromSvg: true, habitatChangedThroughUI: true, timeLightingChanged: true, estimatedVisibleRGBABytes: imageBytes, offlineCacheEntries: workerCache.resources.length, autoRepeatMs, reusedDecodedImage: repeatedImage, reusedLandscape: repeatedLandscape, spritesOffline: true, labOffline: true, silverback: true, primateAutoRepeatMs, ungulateDimorphismOffline: true, atlasLegendaryOffline: true, freshwaterDolphinInAllModulesOffline: true, raptorAutoRepeatMs, centinelaOffline: true, aquaticAutoRepeatMs, coastalBirdOffline: true, wetlandBestiaryOffline: true, terrestrialAutoRepeatMs, ostrichDimorphismOffline: true, passerineAutoMs, passerineInAllModulesOffline: true, squamateAutoMs, squamateInAllModulesOffline: true, reptileLegends, amphibianChecks, scaleChecks, discoveryChecks, optionalReviewOutsideGameCache: true, errors });
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
