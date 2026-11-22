'use strict';

const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const url = process.argv[2];
assert.ok(url, 'Indica la URL del visor con ?view=pigment-audit');
const { rows } = JSON.parse(readFileSync('docs/arte-v5012/decisiones.json', 'utf8'));
const inventories = JSON.parse(readFileSync('docs/arte-v5012/inventario-aud04.json', 'utf8')).variants;
const sizes = [64, 128, 256, 512];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, serviceWorkers: 'block' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const nav = page.locator('#audit-navigation');
    const animals = page.locator('[data-audit-species]');
    const variants = page.locator('[data-audit-key]');
    const summary = page.locator('#summary');
    const status = page.locator('#audit-page-status');
    const detail = page.locator('#pigment-audit-detail');
    const audit = key => page.locator('#audit-' + key);
    const next = nav.getByRole('button', { name: 'Siguiente' });
    const prev = nav.getByRole('button', { name: 'Anterior' });
    const reset = () => audit('reset').click();
    const rendered = elements => elements.evaluateAll(nodes => nodes.map(node => node.dataset.auditSpecies));
    const readTotals = async () => [Number(await summary.getAttribute('data-animals')), Number(await summary.getAttribute('data-variants'))];
    const decode = images => images.evaluateAll(nodes => Promise.all(nodes.map(async img => {
      img.loading = 'eager';
      await img.decode();
      return img.naturalWidth;
    })));
    const screenshots = process.env.ATLAS_ART08_SCREENSHOTS;
    await page.goto(url);
    assert.deepEqual(await readTotals(), [479, 564]);
    assert.equal(await animals.count(), 20);
    assert.equal(await status.textContent(), 'Página 1 de 24');
    assert.ok(await prev.isDisabled());
    assert.ok(await animals.locator('img').evaluateAll(imgs => imgs.every(img => img.loading === 'lazy')));
    const first = await rendered(animals);
    await next.click();
    const second = await rendered(animals);
    assert.equal(second.length, 20);
    assert.equal(new Set([...first, ...second]).size, 40);
    assert.equal(await status.textContent(), 'Página 2 de 24');
    const simple = variants.first();
    await simple.locator('button').click();
    assert.ok(await detail.isVisible());
    await page.keyboard.press('Escape');
    assert.deepEqual(await rendered(animals), second);
    assert.equal(await status.textContent(), 'Página 2 de 24');
    await prev.click();
    assert.deepEqual(await rendered(animals), first);
    for (const count of [40, 60]) {
      await audit('page-size').selectOption(String(count));
      assert.equal(await animals.count(), count);
    }
    for (let index = 1; index < 8; index++) await next.click();
    assert.equal(await status.textContent(), 'Página 8 de 8');
    assert.equal(await animals.count(), 59);
    assert.ok(await next.isDisabled());
    await audit('page-size').selectOption('20');

    const both = inventories.find(row => inventories.filter(item => item.id === row.id).length === 2);
    for (const search of [both.id, both.latin]) {
      await audit('search').fill(search);
      assert.deepEqual(await readTotals(), [1, 2]);
      assert.equal(await animals.count(), 1);
      assert.deepEqual(await decode(animals.locator('img')), [128, 128, 128]);
    }
    await audit('kind').selectOption('albino');
    assert.deepEqual(await readTotals(), [1, 1]);
    await audit('backdrop').selectOption('dark');
    await variants.first().locator('button').click();
    assert.equal(await audit('detail-content').getAttribute('data-audit-backdrop'), 'dark');
    await detail.getByRole('button', { name: 'Cerrar ficha' }).click();
    assert.deepEqual(await readTotals(), [1, 1]);
    await reset();
    await audit('family').selectOption(both.family);
    const family = inventories.filter(row => row.family === both.family);
    assert.deepEqual(await readTotals(), [new Set(family.map(row => row.id)).size, family.length]);
    await reset();
    await audit('state').selectOption('insuficiente');
    assert.deepEqual(await readTotals(), [2, 2]);
    await reset();
    if (screenshots) {
      await nav.evaluate(node => node.scrollIntoView({ block: 'center' }));
      await decode(animals.first().locator('img'));
      await page.screenshot({ path: path.join(screenshots, 'visor-pc.png') });
    }

    const comparisons = [];
    for (const lot of ['A', 'B']) {
      const planned = rows.filter(row => row.lot === lot);
      await nav.locator('[data-audit-batch="' + lot + '"]').click();
      assert.deepEqual(await readTotals(), [planned.length, planned.length]);
      assert.equal(new URL(page.url()).searchParams.get('lote'), lot);
      for (const row of planned) {
        await variants.filter({ has: page.locator('[data-audit-open="' + row.id + '/' + row.variant + '"]') }).locator('button').click();
        assert.match(await detail.textContent(), /Iris representado/);
        for (const size of sizes) {
          await audit('detail-size').selectOption(String(size));
          const widths = await decode(detail.locator('img'));
          assert.ok(widths.length >= (row.outcome === 'aprobada' ? 3 : 2) && widths.every(width => width === size));
        }
        if (row.rejected) {
          const evidence = await detail.getByRole('link', { name: /candidatos archivados/ }).getAttribute('href');
          assert.ok((await page.request.get(evidence)).ok());
        }
        comparisons.push(row.id + '/' + row.variant);
        await page.keyboard.press('Escape');
        assert.equal(await animals.count(), planned.length);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    assert.equal(await animals.count(), 20);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await next.click();
    assert.equal(await status.textContent(), 'Página 2 de 24');
    await variants.first().locator('button').click();
    assert.ok(await detail.isVisible());
    assert.ok(await detail.evaluate(node => node.scrollWidth <= node.clientWidth + 1));
    await page.keyboard.press('Escape');
    assert.equal(await status.textContent(), 'Página 2 de 24');
    if (screenshots) {
      await nav.evaluate(node => node.scrollIntoView({ block: 'start' }));
      await decode(animals.first().locator('img'));
      await page.screenshot({ path: path.join(screenshots, 'visor-movil.png') });
    }
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ chromium: browser.version(), animals: 479, variants: 564, pageSizes: [20, 40, 60],
      checkedSizes: sizes, mobileWidth: 390, comparisons }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
