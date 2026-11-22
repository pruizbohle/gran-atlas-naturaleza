'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { version } = require('../package.json');
const integrity = require('../www/atlas-integrity.json').files;
const catalog = JSON.parse(fs.readFileSync('docs/v520/relictos.json', 'utf8')).inventory;

const [base, before] = process.argv.slice(2);
assert.ok(base && before, 'Indica las URL estáticas de la candidata y de V5.2.0.');
const screenshots = process.env.ATLAS_530_SCREENSHOTS;
const widths = [320, 360, 390, 412, 768, 1280];
const examples = ['coelacanth_indic', 'atlas_lion', 'seychelles_sheathbat', 'african_lungfish', 'desconocido'];
const clueLevels = { gabon_dwarf_croc: 1, angonoka: 2, white_sturgeon: 3, desconocido: 0 };

function firstPage(page) {
  return page.locator('#m27-room .m27-piece');
}

async function imageReady(node) {
  const image = node.locator('img');
  if (await image.count()) await image.evaluate(img => img.decode());
}

async function capture(locator, name) {
  if (screenshots) await locator.screenshot({
    path: path.join(screenshots, name + '.png'), style: '.mobile-dock { visibility: hidden; }'
  });
}

async function seed(page, fixture) {
  return page.evaluate(({ rows, clueLevels, examples, fixture }) => {
    const state = AtlasSaveBridge.getSaveData();
    state.money = 787;
    state.knowledge = 123;
    state.crownCoins = 59;
    state.museumView = 'relicts';
    state.legendaryFound.filigrana = { id: 'filigrana', speciesId: 'na_esp_ambystoma_mexicanum' };
    for (const row of rows) {
      if (fixture === 'all' || examples.slice(0, 4).includes(row.id)) state.museum.relicts[row.id] = true;
    }
    Object.assign(state.museum.relictLeads, clueLevels);
    state.museum.displays['relict:coelacanth_indic'] = true;
    AtlasSaveBridge.restoreGame(state);
    AtlasSaveBridge.persistBeforeUpdate();
    return JSON.parse(localStorage.getItem('gran_atlas_v05'));
  }, { rows: catalog, clueLevels, examples, fixture });
}

async function museum(page, mobile) {
  if (mobile) {
    await page.locator('#mobileMenuOpen').click();
    await page.locator('#mobileDrawer [data-tab="museum"]').click();
  } else await page.locator('.tabs [data-tab="museum"]').click();
  await page.locator('.m27-rooms [data-id="relicts"]').click();
}

function relicCase(page, id) {
  if (id === 'desconocido') return firstPage(page).filter({ has: page.getByText('0/3 indicios', { exact: true }) }).first();
  const name = catalog.find(row => row.id === id).name;
  return firstPage(page).filter({ has: page.getByText(name, { exact: true }) });
}

async function cases(page, stage) {
  for (const id of examples) {
    const tile = relicCase(page, id);
    assert.equal(await tile.count(), 1, id);
    await imageReady(tile);
    await capture(tile, stage + '-' + id);
  }
}

async function validateBox(card) {
  return card.evaluate(async node => {
    const title = node.querySelector('.m27-relict-content h3, .m27-dialog-heading h2');
    const art = node.querySelector('.m27-relict-art');
    const latin = node.querySelector('.m27-relict-latin');
    const status = node.querySelector('.m27-relict-status');
    const leads = node.querySelector('.m27-leads');
    const details = node.querySelector('dl');
    const desc = node.querySelector('.m27-relict-description');
    const blocks = [title, art, latin, status, leads, details, desc].filter(Boolean)
      .map(e => e.getBoundingClientRect());
    const overlaps = blocks.slice(1).some((r, index) => r.top < blocks[index].bottom - 1);
    const image = art.querySelector('img');
    if (image) await image.decode();
    const box = art.getBoundingClientRect();
    const drawn = image?.getBoundingClientRect();
    const fits = !drawn || (drawn.height + 2 >= 90 && drawn.bottom <= box.bottom + 1 &&
      drawn.left >= box.left - 1 && drawn.right <= box.right + 1);
    const fitsText = node.scrollWidth <= node.clientWidth + 1;
    return { overlaps, fits, fitsText, height: box.height, image: !!image };
  });
}

async function compare(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'block' });
  try {
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('/iconoteca/arte/')) failures.push(response.url());
    });
    await page.goto(before);
    const raw = await seed(page, 'sample');
    await museum(page, true);
    await cases(page, 'antes');

    await page.goto(base);
    const hydrated = await page.evaluate(snapshot => {
      AtlasSaveBridge.restoreGame(snapshot);
      return AtlasSaveBridge.getSaveData();
    }, raw);
    for (const key of ['inventory', 'museum', 'money', 'knowledge', 'crownCoins', 'legendaryFound']) {
      assert.deepEqual(hydrated[key], raw[key], key);
    }
    await museum(page, true);
    await cases(page, 'despues');
    for (const [id, count] of Object.entries(clueLevels)) {
      const tile = relicCase(page, id);
      assert.equal(await tile.locator('dl dt').count(), count);
      assert.equal(await tile.locator('img, i').count(), 0);
      assert.equal(await tile.locator('.m27-leads').getAttribute('aria-label'), count + ' de 3 indicios');
      const placement = await validateBox(tile);
      assert.ok(!placement.overlaps && placement.fits && placement.fitsText && !placement.image, id);
    }
    assert.deepEqual(failures, []);

    await seed(page, 'all');
    const checked = {};
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await museum(page, width <= 760);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      let count = 0;
      for (let pageIndex = 0; pageIndex < 3; pageIndex++) {
        const pieces = await firstPage(page).all();
        for (const piece of pieces) {
          const placement = await validateBox(piece);
          assert.ok(!placement.overlaps && placement.fits && placement.fitsText && placement.image, JSON.stringify({ width, placement }));
          count++;
        }
        if (pageIndex < 2) await page.getByRole('button', { name: 'Página siguiente' }).click();
      }
      assert.equal(count, 20);
      checked[width] = count;
      await page.getByRole('button', { name: 'Página anterior' }).click();
      await page.getByRole('button', { name: 'Página anterior' }).click();
      await page.getByRole('button', { name: 'Consultar Celacanto del Índico' }).click();
      const dialog = page.getByRole('dialog', { name: 'Celacanto del Índico' });
      const placement = await validateBox(dialog);
      assert.ok(!placement.overlaps && placement.fits && placement.fitsText && placement.image);
      await dialog.getByRole('button', { name: 'Cerrar ficha' }).click();
    }
    assert.deepEqual(failures, []);
    return checked;
  } finally {
    await context.close();
  }
}

async function graphics(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  try {
    const page = await context.newPage();
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('/iconoteca/arte/')) failures.push(response.url());
    });
    await page.goto(base);
    assert.equal(await page.locator('.tabs .atlas-icon').count(), 10);
    await page.locator('.tabs [data-tab="atlas"]').click();
    const tiles = page.locator('#atlasMap .atlas-tile');
    assert.ok(await tiles.count() > 2);
    assert.equal(await tiles.locator('.atlas-biome-art').count(), await tiles.count());
    const selected = page.locator('#atlasMap .atlas-tile[aria-pressed="true"]');
    const nextTile = page.locator('#atlasMap .atlas-tile[aria-pressed="false"]').first();
    const destination = await nextTile.getAttribute('data-id');
    await nextTile.focus();
    await nextTile.press('Enter');
    assert.equal(await selected.count(), 1);
    assert.equal(await selected.getAttribute('data-id'), destination);
    assert.equal(await nextTile.evaluate(e => getComputedStyle(e.querySelector('.atlas-biome-art')).pointerEvents), 'none');
    assert.equal(await page.locator('#atlasMap .atlas-tile[aria-label*="Indicio de relicto"]').count(), 0);
    await page.evaluate(() => {
      const state = AtlasSaveBridge.getSaveData();
      state.regionUnlocked['HX-03-12'] = true;
      state.museum.relictLeads.olm_balkans = 1;
      AtlasSaveBridge.restoreGame(state);
    });
    await page.locator('.tabs [data-tab="atlas"]').click();
    const disclosed = page.locator('#atlasMap .atlas-tile[aria-label*="Indicio de relicto"]');
    assert.equal(await disclosed.count(), 1);
    assert.equal(await disclosed.getAttribute('data-id'), 'HX-03-12');
    await page.getByRole('button', { name: 'Acercar mapa' }).click();
    await capture(page.locator('.atlas-map-frame'), 'mapa-escritorio');
    await page.setViewportSize({ width: 360, height: 800 });
    await page.getByRole('button', { name: 'Reducir mapa a la escala mínima' }).click();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await capture(page.locator('.atlas-map-frame'), 'mapa-movil');
    await page.locator('#mobileMenuOpen').click();
    await page.locator('#mobileDrawer [data-tab="expeditions"]').click();
    assert.equal(await page.locator('.cp3430-facility .atlas-icon').count(), 5);
    await page.locator('.cp3430-facility[data-cp-open="caravan"]').click();
    await page.getByText('Mesa de abastecimiento científico').waitFor();

    await page.goto(new URL('iconoteca/biblioteca.html', base).href);
    const count = await page.locator('.library-card').count();
    assert.ok(count >= 100);
    await page.locator('#library-status').selectOption('pendiente');
    assert.ok(await page.locator('.library-card').count() < count);
    await page.locator('#library-status').selectOption('');
    await page.locator('#library-query').fill('Fosa hadal');
    await page.locator('#library-size').selectOption('32');
    await page.locator('#library-tone').selectOption('dark');
    assert.equal(await page.locator('.library-card').count(), 1);
    const icon = page.locator('.library-card img');
    await icon.evaluate(img => img.decode());
    assert.equal(Math.round((await icon.boundingBox()).width), 32);
    await page.locator('#library-size').selectOption('64');
    assert.equal(Math.round((await icon.boundingBox()).width), 64);
    await page.locator('#library-biome').selectOption('hadal');
    await page.locator('#library-zoom').selectOption('.5');
    assert.equal(await page.locator('#library-map .atlas-tile').count(), 6);
    assert.equal(await page.locator('#library-map .atlas-biome-art[href$="biome-hadal.webp"]').count(), 6);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await capture(page.locator('main'), 'biblioteca-movil');
    assert.deepEqual(failures, []);
    return { library: count, biomes: 16, previewStates: 6 };
  } finally {
    await context.close();
  }
}

async function offline(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(new URL('actualizar-atlas.html', base).href);
    const status = pattern => page.waitForFunction(pattern => new RegExp(pattern).test(document.getElementById('status').textContent),
      pattern.source, { timeout: 120000 });
    await status(/Prepara esta versión/);
    await page.locator('#atlasUpdateApply').click();
    await status(/Descarga completa e integridad verificada/);
    await page.locator('#atlasUpdateInstall').click();
    await status(/ instalada/);
    await page.locator('#atlasUpdateReturn').click();
    await page.waitForURL(new URL('index.html?actualizado=' + version, base).href);
    await context.setOffline(true);
    await page.goto(new URL('iconoteca/biblioteca.html', base).href);
    await page.locator('#library-query').fill('Fosa hadal');
    await page.locator('.library-card img').evaluate(img => img.decode());
    const files = await page.evaluate(async () => {
      const names = await caches.keys();
      const active = await caches.open(names.find(name => name.startsWith('gran-atlas-v5.3.0') && !name.endsWith('-review')));
      return (await active.keys()).length - 1;
    });
    assert.equal(files, Object.keys(integrity).length);
    await page.goto(base);
    await page.locator('.mobile-dock [data-tab="atlas"]').click();
    assert.ok(await page.locator('.atlas-biome-art').count());
    return files;
  } finally {
    await context.close();
  }
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    console.log(JSON.stringify({ cases: await compare(browser) }));
    console.log(JSON.stringify(await graphics(browser)));
    if (process.env.ATLAS_530_OFFLINE) console.log(JSON.stringify({ offline: await offline(browser) }));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
