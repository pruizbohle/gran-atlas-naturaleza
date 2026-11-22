'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { chromium } = require('playwright');

const [base, isolated] = process.argv.slice(2);
assert.ok(base, 'Indica la URL base de un servidor que sirva www/');
const labURL = new URL('naturalist-art/?view=legendary', base).href;
const output = process.env.ATLAS_LEG02_SCREENSHOTS;
const { catalog, legendaryComparisons } = vm.runInNewContext(
  fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') + '\n({ catalog, legendaryComparisons })');
const sizes = [64, 128, 256, 512];
const modules = ['field', 'journal', 'bestiary', 'museum'];
const axolotl = 'na_esp_ambystoma_mexicanum';

const decode = images => images.evaluateAll(nodes => Promise.all(nodes.map(async image => {
  image.loading = 'eager';
  await image.decode();
  return image.naturalWidth;
})));

async function collection(page, url, name) {
  await page.goto(url);
  const cards = page.locator('[data-legendary]');
  const set = page.locator('#bird-set');
  const search = page.locator('#legendary-search');
  const size = page.locator('#comparison-size');
  assert.equal(await cards.count(), 30);
  assert.equal(await page.locator('#summary').textContent(), '30 de 30 legendarios');
  for (const px of sizes) {
    await size.selectOption(String(px));
    const widths = await decode(cards.locator('img'));
    assert.ok(widths.length >= 60 && widths.every(width => width === px));
  }
  for (const [id, count] of [['leg01', 8], ['leg02', 10], ['revised', legendaryComparisons.revised.legendary.length]]) {
    await set.selectOption(id);
    assert.equal(await cards.count(), count, id);
  }
  await set.selectOption('all');
  for (const keyword of ['nacar', 'Filigrana', 'Ajolote mexicano', 'Ambystoma mexicanum']) {
    await search.fill(keyword);
    assert.equal(await cards.count(), 1);
    assert.equal(await cards.first().getAttribute('data-legendary'), 'filigrana');
    assert.match(await cards.first().locator('h3').textContent(), /^Nácar/);
  }
  await search.fill('especie inexistente');
  assert.equal(await cards.count(), 0);
  assert.match(await page.locator('#content').textContent(), /Ningún legendario/);
  await search.fill('Kraken');
  assert.equal(await cards.count(), 1);
  await size.selectOption('256');
  await page.locator('#backdrop').selectOption('dark');
  assert.equal(await page.locator('#content').getAttribute('data-backdrop'), 'dark');
  if (output) {
    await decode(cards.locator('img'));
    await cards.first().screenshot({ path: path.join(output, name + '-kraken-escritorio.png') });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await search.fill('Espiral');
  await size.selectOption('128');
  assert.equal(await cards.count(), 1);
  assert.match(await cards.first().textContent(), /LEG-01/);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  if (output) {
    await decode(cards.locator('img'));
    await cards.first().screenshot({ path: path.join(output, name + '-espiral-movil.png') });
  }
}

async function gameSurfaces(page) {
  const region = catalog.find(species => species.id === axolotl).regions[0].id;
  await page.goto(base);
  await page.evaluate(({ species, region }) => {
    const state = AtlasSaveBridge.getSaveData();
    state.currentRegion = region;
    state.regionUnlocked[region] = true;
    state.selectedJournal = species;
    state.discovered[species] = true;
    state.sightings[species] = 1;
    state.stages[species] = 1;
    state.specialSeen[species] = 1;
    state.legendaryFound.filigrana = { id: 'filigrana', speciesId: species };
    state.lastEncounter = { species, title: 'Avistamiento: Ajolote mexicano',
      subtitle: 'Espécimen especial: Legendario, Filigrana.', sequence: 1,
      entries: [{ id: species, variant: 'Legendario', category: 'Legendario', amount: 1 }] };
    state.log = ['🔭 Ajolote mexicano ×1 · espécimen especial: Legendario, Filigrana.'];
    AtlasSaveBridge.restoreGame(state);
  }, { species: axolotl, region });
  const tab = name => page.locator('.tabs [data-tab="' + name + '"]').click();
  await tab('field');
  assert.match(await page.locator('#fieldResult').textContent(), /Nácar/);
  assert.match(await page.locator('#fieldLog').textContent(), /Nácar/);
  assert.doesNotMatch(await page.locator('#fieldLog').textContent(), /Filigrana/);
  const assertPlate = async parent => {
    const image = parent.locator('img[src$="--filigrana.webp"]');
    await image.waitFor({ state: 'attached' });
    assert.equal(await image.count(), 1);
    assert.ok([128, 256, 512].includes((await decode(image))[0]));
  };
  await assertPlate(page.locator('#fieldResult'));
  await tab('journal');
  assert.match(await page.locator('#panel').textContent(), /Nácar/);
  await assertPlate(page.locator('#panel'));
  await tab('bestiary');
  await page.locator('#b26-search').fill('Ajolote mexicano');
  await page.locator('.b26-entry:has-text("Ajolote mexicano") .b26-collection summary').click();
  const specimens = page.locator('.b26-entry:has-text("Ajolote mexicano") [data-specimen-content]');
  await assertPlate(specimens);
  assert.match(await specimens.textContent(), /Nácar/);
  await tab('museum');
  await page.locator('[data-m27-fold="legendary"] summary').click();
  const museum = page.locator('[data-m27-legendary]');
  await assertPlate(museum);
  assert.match(await museum.textContent(), /Nácar/);
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 950 }, serviceWorkers: 'block' });
    const errors = [];
    const open = async () => {
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      return page;
    };
    const lab = await open();
    await collection(lab, labURL, 'laboratorio');
    await lab.setViewportSize({ width: 1280, height: 950 });
    for (const module of modules) {
      await lab.locator('[data-mode="' + module + '"]').click();
      for (const row of legendaryComparisons.leg02.legendary) {
        await lab.locator('#species').selectOption(row.id);
        await lab.locator('#category').selectOption('Legendario');
        const image = lab.locator('#content .atlas-art-image');
        assert.ok((await image.getAttribute('src')).endsWith(row.id + '--' + row.legendaryId + '.webp'), row.id);
        assert.ok([128, 256, 512].includes((await decode(image))[0]));
      }
    }
    await gameSurfaces(await open());
    if (isolated) {
      const preview = await open();
      await preview.goto(isolated);
      assert.equal(await preview.locator('#audit-page-status').count(), 1);
      await preview.getByRole('link', { name: 'Colección de legendarios' }).click();
      await collection(preview, preview.url(), 'visor');
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ chromium: browser.version(), legends: 30, sizes, modules,
      newModulePreviews: legendaryComparisons.leg02.legendary.length * modules.length,
      legacyGameSurfaces: modules.length, narrowViewport: 390, isolated: Boolean(isolated) }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
