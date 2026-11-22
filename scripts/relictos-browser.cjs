'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { chromium } = require('playwright');
const { version } = require('../package.json');
const { files } = require('../www/atlas-integrity.json');

const base = process.argv[2];
assert.ok(base, 'Indica la URL local que sirve www/');
const evidence = process.env.ATLAS_RELICT_SCREENSHOTS;
const laboratory = new URL('laboratorio-relictos.html', base).href;
const specimen = 'thylacine';

async function verifyGallery(page) {
  await page.goto(laboratory);
  const gallery = page.locator('#relict-preview');
  assert.equal(await gallery.locator('article').count(), 20);
  assert.equal(await gallery.locator('img').count(), 20);
  assert.equal(await gallery.locator('svg').count(), 0);
  await page.locator('#relict-before').check();
  assert.equal(await gallery.locator('svg').count(), 9);
  await page.locator('#relict-query').fill('Celacanto');
  await page.locator('#relict-size').selectOption('64');
  assert.equal(await gallery.locator('img').evaluate(async img => { await img.decode(); return img.naturalWidth; }), 64);
  assert.equal(await gallery.locator('svg').count(), 1);
  await page.locator('#relict-query').fill('Thylacinus cynocephalus');
  assert.equal(await gallery.locator('article').count(), 1);
  const image = gallery.locator('img');
  for (const size of [64, 128, 256, 512]) {
    await page.locator('#relict-size').selectOption(String(size));
    assert.equal(await image.evaluate(async img => { await img.decode(); return img.naturalWidth; }), size);
  }
  await page.locator('#relict-background').selectOption('dark');
  assert.equal(await gallery.getAttribute('data-dark'), 'true');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
}

async function play(browser) {
  const context = await browser.newContext({ viewport: { width: 1240, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => { Math.random = () => window.__relictDraws?.shift() ?? .99999; });
  await page.clock.install({ time: new Date('2025-01-01T12:00:00Z') });
  await page.goto(base);
  await page.evaluate(() => {
    const state = AtlasSaveBridge.getSaveData();
    state.regionUnlocked.oc_tasmania = true;
    state.cartography3400.historicalAccess['Oceanía'] = true;
    state.currentRegion = 'oc_tasmania';
    state.habitat = 'bosque';
    state.time = 'atardecer';
    state.money = 800;
    state.knowledge = 500;
    AtlasSaveBridge.restoreGame(state);
  });
  const chooseMuseum = async () => {
    await page.locator('.tabs [data-tab="museum"]').click();
    await page.locator('.m27-rooms [data-id="relicts"]').click();
  };
  await chooseMuseum();
  const cabinet = page.locator('#m27-room');
  assert.match(await cabinet.textContent(), /0\/20 descubiertos/);
  assert.equal(await cabinet.locator('.m27-piece').count(), 8);
  await cabinet.getByRole('button', { name: 'Página siguiente' }).click();
  assert.match(await cabinet.getByRole('status').textContent(), /página 2\/3/);
  await cabinet.getByRole('button', { name: 'Página anterior' }).click();

  const card = () => cabinet.locator('.m27-piece').filter({ hasText: /Expediente 10|Tilacino/ });
  assert.equal(await card().locator('.m27-relict-details').count(), 0);
  for (const level of [1, 2, 3]) {
    await card().getByRole('button', { name: /Investigar/ }).click();
    const remaining = await page.evaluate(() => AtlasSaveBridge.getSaveData().museum.relictSurveys[0].endAt - Date.now());
    await page.clock.fastForward(remaining + 1500);
    await cabinet.locator('[data-action="collect-relict-survey"]:enabled').click();
    assert.equal(await card().locator('.m27-relict-details dt').count(), level);
    assert.match(await card().textContent(), new RegExp(level + '/3 indicios'));
    assert.equal(await card().locator('.m27-art img').count(), 0);
  }
  assert.equal(await page.evaluate(id => AtlasSaveBridge.getSaveData().museum.relicts[id], specimen), undefined);
  assert.equal(await cabinet.locator('[data-action="catalog-relict"]').count(), 0);

  await card().getByRole('button', { name: 'Ir a Campo' }).click();
  await page.getByRole('button', { name: 'Volver a Museo' }).click();
  assert.match(await card().textContent(), /3\/3 indicios/);
  await card().getByRole('button', { name: 'Ir a Campo' }).click();
  const notice = page.locator('#fieldRelictNotice');
  await page.evaluate(() => { window.__relictDraws = [.99999, .00299]; });
  await page.getByRole('button', { name: /Observar fauna/ }).click();
  await notice.getByText('Relicto descubierto').waitFor();
  assert.match(await notice.textContent(), /Tilacino/);
  await notice.locator('img').evaluate(img => img.decode());
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  if (evidence) await notice.screenshot({ path: path.join(evidence, 'campo-movil.png') });
  await page.reload();
  await page.locator('.mobile-dock [data-tab="field"]').click();
  await notice.getByText('Relicto descubierto').waitFor();
  await notice.getByRole('button', { name: 'Cerrar aviso' }).click();
  assert.ok(await notice.isHidden());

  await page.setViewportSize({ width: 1240, height: 900 });
  await chooseMuseum();
  await card().getByRole('button', { name: 'Consultar Tilacino' }).click();
  const modal = page.getByRole('dialog', { name: 'Tilacino' });
  await modal.waitFor();
  assert.match(await modal.textContent(), /Thylacinus cynocephalus/);
  assert.match(await modal.textContent(), /Fecha de registro/);
  assert.equal(await modal.locator('img').evaluate(async img => { await img.decode(); return img.naturalWidth; }), 256);
  if (evidence) await modal.screenshot({ path: path.join(evidence, 'museo-escritorio.png') });
  await verifyGallery(page);
  assert.deepEqual(errors, []);
  await context.close();
}

async function verifyOffline(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(new URL('actualizar-atlas.html', base).href);
  const status = pattern => page.waitForFunction(pattern => new RegExp(pattern).test(document.getElementById('status').textContent),
    pattern.source, { timeout: 240000 });
  await status(/Prepara esta versión/);
  await page.locator('#atlasUpdateApply').click();
  await status(/Descarga completa e integridad verificada/);
  await page.locator('#atlasUpdateInstall').click();
  await status(/ instalada/);
  await page.locator('#atlasUpdateReturn').click();
  await page.waitForURL(new URL('index.html?actualizado=' + version, base).href);
  const cached = await page.evaluate(async () => {
    const names = await caches.keys();
    const cache = await caches.open(names.find(name => name.startsWith('gran-atlas-') && !name.endsWith('-review')));
    return (await cache.keys()).length;
  });
  assert.equal(cached, Object.keys(files).length + 1);
  await context.setOffline(true);
  await verifyGallery(page);
  await page.goto(base);
  await page.locator('.mobile-dock [data-tab="field"]').click();
  assert.ok((await page.locator('.subbrand').textContent()).includes(version));
  await context.close();
  return cached - 1;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    await play(browser);
    const offlineFiles = process.env.ATLAS_RELICT_OFFLINE ? await verifyOffline(browser) : null;
    console.log(JSON.stringify({ chromium: browser.version(), specimen, clues: 3, mobileWidth: 390, gallery: 20, offlineFiles }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
