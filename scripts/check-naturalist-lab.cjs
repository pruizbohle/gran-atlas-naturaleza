'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve('www');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const file = path.join(root, url.pathname, url.pathname.endsWith('/') ? 'index.html' : '');
  if (!file.startsWith(root + '/')) return res.writeHead(403).end();
  try {
    const bytes = fs.readFileSync(file);
    res.writeHead(200, {'Content-Type': types[path.extname(file)] || 'application/octet-stream'});
    res.end(bytes);
  } catch { res.writeHead(404).end(); }
});

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = 'http://127.0.0.1:' + server.address().port + '/naturalist-art/';
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined), args: ['--no-sandbox'] });
  try {
    for (const viewport of [{width: 320, height: 860}, {width: 1280, height: 900}]) {
      const session = await browser.newContext({ viewport, isMobile: viewport.width === 320, hasTouch: viewport.width === 320 });
      const page = await session.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('response', response => { if (response.status() >= 400) errors.push(response.status() + ' ' + response.url()); });
      const start = performance.now();
      await page.goto(url);
      await page.locator('.field-card .atlas-art-image').evaluate(image => image.decode());
      const firstRender = Math.round(performance.now() - start);
      assert.equal(await page.locator('.encounter .plate').evaluate(plate => plate.offsetWidth), 88);
      for (const [mode, selector] of [['journal', '.journal-sheet'], ['bestiary', '.bestiary-entry'], ['museum', '.museum-entry']]) {
        await page.locator('[data-mode=' + mode + ']').click();
        await page.locator('#species').selectOption('na_esp_didelphis_virginiana');
        await page.locator('#scale-plate').selectOption('albino');
        await page.locator('#category').selectOption('Notable');
        assert.match(await page.locator(selector).innerText(), /Didelphis virginiana[\s\S]*Albino/);
        assert.match(await page.locator(selector + ' .notable .atlas-art-image').getAttribute('src'), /--albino\.webp$/);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), viewport.width);
      }
      await page.locator('#group').selectOption('Cánidos');
      await page.locator('[data-mode=mixed]').click();
      await page.locator('#species').selectOption('zorro_rojo');
      await page.locator('#category').selectOption('Notable');
      await page.locator('.mixed-field .atlas-art-image').evaluate(img => img.decode());
      assert.equal(await page.locator('.mixed-field .field-animal-sprite > svg').count(), 1);
      assert.match(await page.locator('.mixed-field').innerText(), /Zorro rojo · WebP \/ Ciervo rojo · SVG/);
      const art = page.locator('.mixed-field .plate');
      const image = art.locator('.atlas-art-image');
      const src = await image.getAttribute('src');
      assert.equal(await page.locator('#content').getAttribute('data-frame-style'), 'bare');
      assert.match(await art.getAttribute('class'), /atlas-art-cutout/);
      assert.match(await page.locator('.mixed-field > .atlas-art-landscape').getAttribute('src'), /bosque\.webp$/);
      const states = [];
      for (const style of ['classic','outline','bare']) {
        await page.locator('#frame-style').selectOption(style);
        assert.equal(await image.getAttribute('src'), src);
        states.push(await art.evaluate(node => {
          const css = getComputedStyle(node);
          return [css.borderTopWidth, css.boxShadow, getComputedStyle(node.querySelector('.atlas-art-image')).filter].join('|');
        }));
      }
      assert.equal(new Set(states).size, 3);
      await page.locator('#category').selectOption('Normal');
      assert.equal(await image.evaluate(img => getComputedStyle(img).filter), 'none');
      await page.locator('[data-mode=bestiary]').click();
      assert.equal(await page.locator('.bestiary-entry .atlas-art-landscape').count(), 1);
      await page.locator('[data-mode=journal]').click();
      assert.equal(await page.locator('.journal-sheet .atlas-art-landscape').count(), 0);
      assert.equal(await page.locator('.journal-sheet .atlas-art-journal').count(), 1);
      await page.locator('[data-mode=museum]').click();
      assert.equal(await page.locator('.museum-entry .atlas-art-museum').count(), 1);
      assert.equal(await page.locator('.museum-entry .atlas-art-landscape').count(), 0);
      await page.locator('#group').selectOption('');
      await page.locator('[data-mode=gallery]').click();
      await page.evaluate(() => navigator.serviceWorker.ready);
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      assert.equal(await page.locator('.gallery-card').count(), 142);
      assert.match(await page.locator('#migration-progress').innerText(), /142 de 997.*láminas recortadas/);
      await page.locator('#group').selectOption('Carnívoros terrestres');
      assert.equal(await page.locator('.gallery-card').count(), 51);
      await page.locator('#family').selectOption('Hyaenidae');
      assert.equal(await page.locator('.gallery-card').count(), 3);
      await page.locator('#search').fill('Crocuta');
      assert.equal(await page.locator('.gallery-card').count(), 1);
      await page.locator('[data-mode=variants]').click();
      assert.deepEqual(await page.locator('#content figcaption').allTextContents(), ['Normal', 'Albino', 'Melánico']);
      await page.locator('#search').fill('zzzz');
      assert.match(await page.locator('#content').innerText(), /No se encontraron especies/);
      await page.locator('#search').fill('');
      await page.locator('[data-mode=gallery]').click();
      await page.locator('#group').selectOption('Felinos');
      assert.equal(await page.locator('.gallery-card').count(), 31);
      await page.locator('#group').selectOption('Cánidos');
      assert.equal(await page.locator('.gallery-card').count(), 28);
      await page.locator('#group').selectOption('Monotremas');
      assert.equal(await page.locator('.gallery-card').count(), 3);
      await page.locator('#group').selectOption('');
      await page.locator('#search').fill('cuscus');
      assert.equal(await page.locator('.gallery-card').count(), 2);
      await page.locator('#search').fill('dromiciops');
      assert.equal(await page.locator('.gallery-card').count(), 1);
      await page.locator('.gallery-card').click();
      assert.equal(await page.locator('.pair figure').count(), 2);
      assert.equal(await page.locator('.pair img').count(), 2);
      assert.match(await page.locator('.pair img').first().getAttribute('src'), /review\/before\/gm06_dromiciops/);
      const comparison = page.locator('.pair .plate').last();
      const light = await comparison.evaluate(node => getComputedStyle(node).backgroundColor);
      await page.locator('#backdrop').selectOption('dark');
      assert.notEqual(await comparison.evaluate(node => getComputedStyle(node).backgroundColor), light);
      await page.locator('#search').fill('');
      await page.locator('[data-mode=frames]').click();
      assert.deepEqual(await page.locator('#content figcaption').allTextContents(), ['Normal', 'Notable', 'Épico', 'Excepcional']);
      const paths = await page.locator('#content img').evaluateAll(imgs => imgs.map(i => i.src));
      assert.equal(new Set(paths).size, 1);
      const haloFilters = await page.locator('#content img').evaluateAll(imgs => imgs.map(img => getComputedStyle(img).filter));
      assert.equal(haloFilters[0], 'none');
      assert.equal(new Set(haloFilters).size, 4);
      await page.locator('[data-mode=variants]').click();
      await page.locator('#species').selectOption('na_esp_didelphis_virginiana');
      assert.deepEqual(await page.locator('figcaption').allTextContents(), ['Normal', 'Albino']);
      await page.locator('[data-mode=scale]').click();
      assert.equal(await page.locator('.sample').count(), 7);
      assert.deepEqual(await page.locator('.sample:not(.full) .plate').evaluateAll(nodes => nodes.map(el => el.offsetWidth)), [32,48,64,96,128,256]);
      for (const view of ['Campo','Bestiario','Cuaderno','Museo']) {
        await page.locator('#context').selectOption(view);
        assert.equal(await page.locator('.sample[data-context="'+view+'"]').count(), 7);
      }
      await page.locator('[data-mode=review]').click();
      await page.locator('#review-status').selectOption('Requiere ajustes');
      await page.locator('#review-note').fill('Revisar hocico y cola.');
      const pending = page.waitForEvent('download');
      await page.locator('#export').click();
      const download = await pending;
      const data = JSON.parse(fs.readFileSync(await download.path(), 'utf8'));
      assert.equal(data.schemaVersion, 2);
      assert.equal(data.migration.plates, 245);
      assert.equal(data.results.length, 246);
      assert.equal(data.results.find(r => r.note === 'Revisar hocico y cola.').status, 'Requiere ajustes');
      assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), ['gran-atlas-naturalist-art-review-v1']);
      await session.setOffline(true);
      await page.reload();
      await page.locator('[data-mode=gallery]').click();
      assert.equal(await page.locator('.gallery-card').count(), 142);
      await page.locator('#cut-state').selectOption('pending');
      assert.equal(await page.locator('.gallery-card').count(), data.migration.plates - data.migration.cutouts);
      await page.locator('#cut-state').selectOption('');
      const first = page.locator('.gallery-card img').first();
      await first.scrollIntoViewIfNeeded();
      await first.evaluate(image => image.decode());
      assert.equal(await first.evaluate(image => image.naturalWidth), 256);
      await page.locator('[data-mode=bestiary]').click();
      await page.locator('#species').selectOption('zorro_rojo');
      await page.locator('.bestiary-entry .atlas-art-landscape').evaluate(image => image.decode());
      await page.locator('[data-mode=compare]').click();
      await page.locator('.review-comparison img').first().evaluate(image => image.decode());
      await page.locator('[data-mode=compression]').click();
      await page.locator('#species').selectOption('zorro_rojo');
      await page.locator('#scale-plate').selectOption('albino');
      for (const quality of [75, 80, 85, 90, 95]) {
        await page.locator('#compression-quality').selectOption(String(quality));
        const sample = page.locator('.review-comparison img').first();
        await sample.evaluate(image => image.decode());
        assert.match(await sample.getAttribute('src'), new RegExp('/' + quality + '/zorro_rojo--albino\\.webp$'));
      }
      await page.locator('[data-mode=review]').click();
      await page.locator('#species').selectOption('na_esp_didelphis_virginiana');
      assert.equal(await page.locator('#review-note').inputValue(), 'Revisar hocico y cola.');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), viewport.width);
      const plates = await page.evaluate(async () => {
        const files = catalog.flatMap(sp => sp.records.map(record => record.src).filter(Boolean));
        return Promise.all(files.map(async file => {
          const response = await fetch(file);
          const image = await createImageBitmap(await response.blob());
          const dimensions = [image.width, image.height];
          image.close();
          return dimensions;
        }));
      });
      assert.ok(plates.length > 0);
      assert.ok(plates.every(([width, height]) => width === 512 && height === 512));
      assert.deepEqual(errors, []);
      await session.close();
      console.log('PASS', viewport.width, 'px: doce modos, filtros, corte, compresión y exportación offline; primera lámina', firstRender, 'ms');
    }
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
