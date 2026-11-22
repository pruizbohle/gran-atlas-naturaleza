'use strict';

const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const path = require('node:path');

const origin = process.argv[2];
assert.ok(origin, 'Indica la URL base del juego');
const url = new URL('naturalist-art/?view=legendary', origin).href;
const screenshots = process.env.ATLAS_LEG01_SCREENSHOTS;
const counts = { all: 20, new: 8 };
const examples = { ascua: 'zorro_rojo', atlas: 'af_elefante_sabana', marea: 'mar_esp_enteroctopus_dofleini' };
const sizes = [64, 128, 256, 512];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 950 }, serviceWorkers: 'block' });
    const lab = await context.newPage();
    const errors = [];
    lab.on('pageerror', error => errors.push(error.message));
    await lab.goto(url);
    const cards = lab.locator('[data-legendary]');
    const selector = lab.locator('#bird-set');
    const decode = images => images.evaluateAll(nodes => Promise.all(nodes.map(async img => {
      img.loading = 'eager';
      await img.decode();
      return img.naturalWidth;
    })));

    assert.equal(await cards.count(), 20);
    assert.equal(await lab.locator('#summary').textContent(), '20 de 20 legendarios');
    for (const size of sizes) {
      await lab.locator('#comparison-size').selectOption(String(size));
      const widths = await decode(cards.locator('img'));
      assert.ok(widths.length >= 40 && widths.every(width => width === size));
    }
    for (const lot of ['new', 'revised', 'retained']) {
      await selector.selectOption(lot);
      if (lot === 'revised') {
        counts.revised = await cards.count();
        assert.ok(counts.revised >= 2);
      }
      if (lot === 'retained') counts.retained = 12 - counts.revised;
      assert.equal(await cards.count(), counts[lot]);
    }
    await selector.selectOption('revised');
    await lab.locator('#comparison-size').selectOption('256');
    for (const id of ['ascua', 'atlas']) {
      const card = lab.locator('[data-legendary="' + id + '"]');
      assert.ok(await card.locator('img').count() >= 3);
      assert.match(await card.textContent(), /Legendario anterior/);
      if (screenshots) {
        await decode(card.locator('img'));
        await card.screenshot({ path: path.join(screenshots, id + '-comparativa.png') });
      }
    }
    await lab.locator('#backdrop').selectOption('dark');
    assert.equal(await lab.locator('#content').getAttribute('data-backdrop'), 'dark');
    if (screenshots) {
      const atlas = lab.locator('[data-legendary="atlas"]');
      await decode(atlas.locator('img'));
      await atlas.screenshot({ path: path.join(screenshots, 'atlas-carbon.png') });
    }

    const modules = ['field', 'journal', 'bestiary', 'museum'];
    for (const [legendary, id] of Object.entries(examples)) {
      for (const module of modules) {
        await lab.locator('[data-mode="' + module + '"]').click();
        await lab.locator('#species').selectOption(id);
        await lab.locator('#category').selectOption('Legendario');
        const image = lab.locator('#content .atlas-art-image');
        assert.match(await image.getAttribute('src'), new RegExp(id + '--' + legendary + '\\.webp$'));
        assert.ok([128, 256, 512].includes((await decode(image))[0]));
      }
    }

    await lab.setViewportSize({ width: 390, height: 844 });
    await lab.goto(url);
    await selector.selectOption('revised');
    await lab.locator('#comparison-size').selectOption('128');
    assert.ok(await lab.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (screenshots) {
      const ascua = lab.locator('[data-legendary="ascua"]');
      await decode(ascua.locator('img'));
      await ascua.screenshot({ path: path.join(screenshots, 'ascua-movil.png') });
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ chromium: browser.version(), counts, sizes, modules, examples: Object.keys(examples), mobileWidth: 390 }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
