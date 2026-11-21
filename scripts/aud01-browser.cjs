'use strict';
const assert = require('node:assert/strict');
const { createReadStream, existsSync, readFileSync, statSync } = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve('www');
const baseline = path.resolve(process.argv[2] || root);
const sources = { base: baseline, audit: root };
const mime = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((request, response) => {
  try {
    const [, version, ...parts] = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).split('/');
    const directory = sources[version];
    const name = parts.join('/') || 'index.html';
    const file = path.resolve(directory, name.endsWith('/') ? name + 'index.html' : name);
    if (!file.startsWith(directory + path.sep) || !existsSync(file)) return response.writeHead(404).end();
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Content-Length': statSync(file).size });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
});
const viewport = { width: 390, height: 844 };
const mobile = { viewport, isMobile: true, hasTouch: true };
const origin = () => 'http://127.0.0.1:' + server.address().port;
const median = numbers => [...numbers].sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
async function start(page, url) {
  await page.goto(url);
  await page.waitForFunction(() => !!window.AtlasSaveBridge);
  await page.evaluate(() => document.fonts.ready);
}
async function performanceRun(browser, source) {
  const context = await browser.newContext({ ...mobile, serviceWorkers: 'block' });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await start(page, origin() + '/' + source + '/');
    const result = await page.evaluate(() => {
      const measure = fn => {
        const start = performance.now();
        fn();
        document.getElementById('panel').getBoundingClientRect();
        return performance.now() - start;
      };
      const open = tab => document.querySelector('.tab[data-tab="' + tab + '"]').click();
      const tabs = {};
      for (const name of ['field', 'journal', 'museum', 'research', 'expeditions', 'objects', 'bestiary']) {
        tabs[name] = measure(() => open(name));
      }
      const pager = () => document.querySelector('[data-bestiary-pager]');
      const total = +pager().dataset.total;
      const pages = +pager().dataset.pages;
      let cards = document.querySelectorAll('.b26-entry').length;
      const turns = [];
      for (let i = 1; i < pages; i++) {
        turns.push(measure(() => pager().querySelector('button:last-child').click()));
        cards += document.querySelectorAll('.b26-entry').length;
      }
      return { startupMs: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
        tabs, total, pages, cards, turns };
    });
    assert.equal(result.total, 1000);
    assert.equal(result.cards, 1000);
    assert.deepEqual(errors, []);
    await cdp.send('HeapProfiler.collectGarbage');
    const heap = await cdp.send('Runtime.getHeapUsage');
    return { source, ...result, medianPageMs: median(result.turns), jsHeapUsedBytes: heap.usedSize };
  } finally {
    await context.close();
  }
}
async function advancedRun(browser, file, source, waitUntilDrained) {
  const context = await browser.newContext({ ...mobile, serviceWorkers: 'block' });
  try {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await context.addInitScript(save => {
      Date.now = () => 1700002800000;
      save.lastTick = Date.now() - 8 * 3600000;
      let seed = 501;
      Math.random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 2 ** 32;
      };
      localStorage.setItem('gran_atlas_v05', JSON.stringify(save));
      window.auditLongTasks = [];
      new PerformanceObserver(list => window.auditLongTasks.push(...list.getEntries()
        .map(e => ({ start: e.startTime, ms: e.duration }))))
        .observe({ type: 'longtask', buffered: true });
    }, JSON.parse(readFileSync(file, 'utf8')));
    await start(page, origin() + '/' + source + '/');
    await page.waitForFunction(() => {
      const save = AtlasSaveBridge.getSaveData();
      return save.helpers === 10 && save.autoPending.length > 0;
    });
    const inspect = () => page.evaluate(() => {
      const save = AtlasSaveBridge.getSaveData();
      const pending = save.autoPending.reduce((total, job) =>
        total + 1 + Math.floor((job.end - job.at) / job.interval), 0);
      return { pending, ...AtlasSaveBridge.getSnapshot(), time: performance.now() };
    });
    const first = await inspect();
    const deadline = Date.now() + 5000;
    const fieldNavigationMs = [];
    while (Date.now() < deadline) {
      fieldNavigationMs.push(await page.evaluate(() => {
        const start = performance.now();
        for (const tab of ['journal', 'field']) document.querySelector('.tab[data-tab="' + tab + '"]').click();
        document.getElementById('panel').getBoundingClientRect();
        return performance.now() - start;
      }));
      await new Promise(resolve => setTimeout(resolve, 350));
    }
    const last = await inspect();
    assert.ok(last.sightings > first.sightings);
    const longTasksMs = await page.evaluate(({ start, end }) => window.auditLongTasks
      .filter(entry => entry.start >= start && entry.start <= end).map(entry => entry.ms),
    { start: first.time, end: last.time });
    let drained = null;
    if (waitUntilDrained) {
      await page.waitForFunction(() => AtlasSaveBridge.getSaveData().autoPending.length === 0, null, { timeout: 90000 });
      await page.waitForFunction(() => AtlasSaveBridge.verifySavedGame() &&
        JSON.parse(localStorage.getItem('gran_atlas_v05')).autoPending.length === 0);
      drained = await inspect();
      assert.equal(drained.pending, 0);
    }
    return { source, helpers: 10, sampleMs: last.time - first.time,
      sightingsDuringSample: last.sightings - first.sightings, pendingStart: first.pending, pendingAfterSample: last.pending,
      observedDrainMsSinceFirstSample: drained ? drained.time - first.time : null, fieldNavigationMs, longTasksMs,
      jsHeapUsedBytes: (await cdp.send('Runtime.getHeapUsage')).usedSize };
  } finally {
    await context.close();
  }
}
const artworkModules = ['field', 'journal', 'bestiary', 'museum'];
const decoded = locator => locator.first().evaluate(async img => {
  img.loading = 'eager';
  await img.decode();
  return img.naturalWidth;
});

async function gameArtworkChecks(page, specimen) {
  const tabs = name => page.locator('.tab[data-tab="' + name + '"]').first().evaluate(node => node.click());
  // A disposable save exercises ordinary presentation of an already observed variant.
  await page.evaluate(({ id, name, variant, region }) => {
    const save = AtlasSaveBridge.getSaveData();
    save.currentRegion = region || 'HX-01-09';
    save.selectedJournal = id;
    save.discovered[id] = true;
    save.published[id] = true;
    save.stages[id] = 5;
    save.sightings[id] = 500;
    save.specialFound[id] = { [variant]: true };
    save.lastEncounter = { species: id, sequence: 900, title: name, subtitle: '',
      entries: [{ id, variant, note: [], amount: 1 }] };
    AtlasSaveBridge.restoreGame(save);
  }, specimen);
  const variantImage = 'img[src$="/' + specimen.id + '--' + specimen.key + '.webp"]';
  await tabs('field');
  await decoded(page.locator('#fieldResult ' + variantImage));
  await tabs('journal');
  await decoded(page.locator('#journalSelectedSheet ' + variantImage));
  await tabs('bestiary');
  await page.locator('#b26-search').fill(specimen.name);
  await page.locator('[data-b26-collection] summary').first().evaluate(node => node.click());
  await decoded(page.locator('[data-b26-collection] ' + variantImage));
  await tabs('museum');
  await page.locator('[data-action="museum-tab"][data-id="samples"]').evaluate(node => node.click());
  await decoded(page.locator('.m27-grid img[src$="/' + specimen.id + '--normal.webp"]'));
}

async function labArtworkPreviews(lab, specimen) {
  for (const mode of artworkModules) {
    await lab.locator('[data-mode="' + mode + '"]').click();
    await lab.locator('#species').selectOption(specimen.id);
    await lab.locator('#scale-plate').selectOption(specimen.key);
    await decoded(lab.locator('#content img[src$="/' + specimen.id + '--' + specimen.key + '.webp"]'));
  }
}

async function art01Checks(page, lab) {
  const fox = { id: 'zorro_rojo', name: 'zorro rojo', variant: 'Melánico', key: 'melanico' };
  await gameArtworkChecks(page, fox);
  await lab.locator('[data-mode="art01"]').click();
  const archive = lab.locator('[data-art01-species]');
  assert.equal(await archive.count(), 11);
  const sizes = {};
  for (const size of [64, 128, 256, 512]) {
    await lab.locator('#comparison-size').selectOption(String(size));
    const widths = await archive.locator('img').evaluateAll(images =>
      Promise.all(images.map(async img => {
        img.loading = 'eager';
        await img.decode();
        return img.naturalWidth;
      })));
    assert.equal(widths.length, 33);
    assert.ok(widths.every(width => width === size), String(size));
    sizes[size] = widths.length;
  }
  await lab.locator('#backdrop').selectOption('dark');
  assert.equal(await lab.locator('#content').getAttribute('data-backdrop'), 'dark');
  await lab.locator('#backdrop').selectOption('light');
  assert.equal(await lab.locator('#content').getAttribute('data-backdrop'), 'light');
  await lab.locator('#family').selectOption('Felidae');
  assert.equal(await archive.count(), 4);
  await lab.locator('#search').fill('panthera onca');
  assert.equal(await archive.count(), 2);
  await lab.locator('#search').fill('');
  await lab.locator('#family').selectOption('');
  await labArtworkPreviews(lab, fox);
  return { sizes, renderedGameSurfaces: artworkModules,
    labVariantPreviews: artworkModules, archivedVariants: 11 };
}

async function art02Checks(page, lab) {
  const badger = { id: 'tejon_europeo', name: 'tejón europeo', variant: 'Albino', key: 'albino' };
  await gameArtworkChecks(page, badger);
  await lab.locator('[data-mode="art02"]').click();
  const archive = lab.locator('[data-art02-species]');
  assert.equal(await archive.count(), 7);
  const tiger = archive.filter({ hasText: 'Pseudomelanismo' });
  assert.equal(await tiger.getAttribute('data-art02-species'), 'asia_esp_0402');
  assert.equal(await tiger.getAttribute('data-art02-variant'), 'melanico');
  assert.deepEqual(await tiger.locator('.morph-facts dd').allTextContents(), ['Melánico', 'Pseudomelanismo · Documentado']);
  const otter = lab.locator('[data-art02-species="nutria_europea"]');
  assert.equal(await otter.locator('img').count(), 4);
  assert.deepEqual(await otter.locator('.morph-facts dd').allTextContents(), ['Melánico', 'Melanismo · Interpretativo']);

  const sizes = {};
  for (const size of [64, 128, 256, 512]) {
    await lab.locator('#comparison-size').selectOption(String(size));
    const widths = await archive.locator('img').evaluateAll(images =>
      Promise.all(images.map(async img => {
        img.loading = 'eager';
        await img.decode();
        return img.naturalWidth;
      })));
    assert.equal(widths.length, 22);
    assert.ok(widths.every(width => width === size), String(size));
    sizes[size] = widths.length;
  }
  for (const backdrop of ['dark', 'light']) {
    await lab.locator('#backdrop').selectOption(backdrop);
    assert.equal(await lab.locator('#content').getAttribute('data-backdrop'), backdrop);
  }
  await lab.locator('#family').selectOption('Felidae');
  assert.equal(await archive.count(), 2);
  await lab.locator('#search').fill('acinonyx');
  assert.equal(await archive.count(), 1);
  await lab.locator('#search').fill('');
  await lab.locator('#family').selectOption('');
  await labArtworkPreviews(lab, badger);
  return { sizes, archivedComparisons: 7, tigerMorph: 'Pseudomelanismo', renderedGameSurfaces: artworkModules,
    labVariantPreviews: artworkModules };
}

async function art03Checks(page, lab) {
  const mink = { id: 'eu_esp_0622', name: 'visón europeo', variant: 'Melánico', key: 'melanico', region: 'HX-02-10' };
  await gameArtworkChecks(page, mink);
  await lab.locator('[data-mode="art03"]').click();
  const archive = lab.locator('[data-art03-species]');
  assert.equal(await archive.count(), 7);
  const bear = lab.locator('[data-art03-species="asia_esp_0523"]');
  assert.equal(await bear.locator('img').count(), 2);
  assert.match(await bear.locator('strong').textContent(), /Pendiente/);
  const minkCard = lab.locator('[data-art03-species="eu_esp_0622"]');
  assert.equal(await minkCard.locator('img').count(), 4);
  assert.deepEqual(await minkCard.locator('.morph-facts dd').allTextContents(),
    ['Melánico', 'Melanismo · Interpretativo', 'Pardo oscuro', 'V5.0.7']);
  const sizes = {};
  for (const size of [64, 128, 256, 512]) {
    await lab.locator('#comparison-size').selectOption(String(size));
    const widths = await archive.locator('img').evaluateAll(images =>
      Promise.all(images.map(async img => {
        img.loading = 'eager';
        await img.decode();
        return img.naturalWidth;
      })));
    assert.equal(widths.length, 21);
    assert.ok(widths.every(width => width === size), String(size));
    sizes[size] = widths.length;
  }
  for (const backdrop of ['dark', 'light']) {
    await lab.locator('#backdrop').selectOption(backdrop);
    assert.equal(await lab.locator('#content').getAttribute('data-backdrop'), backdrop);
  }
  await lab.locator('#family').selectOption('Cervidae');
  assert.equal(await archive.count(), 3);
  await lab.locator('#search').fill('hydropotes');
  assert.equal(await archive.count(), 1);
  await lab.locator('#search').fill('');
  await lab.locator('#family').selectOption('');
  await lab.locator('[data-mode="art02"]').click();
  const prior = lab.locator('[data-art02-species="eu_esp_0622"] img').last();
  assert.match(await prior.getAttribute('src'), /^review\/art03\/.*eu_esp_0622--melanico\.webp$/);
  await decoded(prior);
  await labArtworkPreviews(lab, mink);
  return { sizes, comparisons: 7, pendingBear: true, preservedMinkComparison: true,
    renderedGameSurfaces: artworkModules, labVariantPreviews: artworkModules };
}

async function art04Smoke(browser) {
  const context = await browser.newContext({ ...mobile, serviceWorkers: 'block' });
  try {
    const lab = await context.newPage();
    const errors = [];
    lab.on('pageerror', err => errors.push(err.message));
    await lab.goto(origin() + '/audit/naturalist-art/');
    await lab.locator('[data-mode="art04"]').click();

    const { rows } = JSON.parse(readFileSync('docs/arte-v508/decisiones.json', 'utf8'));
    const approved = rows.filter(row => row.outcome === 'aprobada');
    const comparisons = lab.locator('[data-art04-species]');
    assert.equal(await comparisons.count(), rows.length);
    for (const row of approved) {
      const card = comparisons.and(lab.locator('[data-art04-species="' + row.id + '"][data-art04-variant="' + row.variant + '"]'));
      assert.equal(await card.locator('img').count(), 3);
      assert.ok((await card.locator('.morph-facts dd').allTextContents()).includes('V5.0.8'));
    }
    const sizes = {};
    for (const size of [64, 128, 256, 512]) {
      await lab.locator('#comparison-size').selectOption(String(size));
      const widths = await comparisons.locator('img').evaluateAll(images =>
        Promise.all(images.map(async img => {
          img.loading = 'eager';
          await img.decode();
          return img.naturalWidth;
        })));
      assert.equal(widths.length, approved.length * 3 + (rows.length - approved.length) * 2);
      assert.ok(widths.every(width => width === size), String(size));
      sizes[size] = widths.length;
    }
    for (const backdrop of ['dark', 'light']) {
      await lab.locator('#backdrop').selectOption(backdrop);
      assert.equal(await lab.locator('#content').getAttribute('data-backdrop'), backdrop);
    }
    await lab.locator('#family').selectOption('Elephantidae');
    assert.equal(await comparisons.count(), 2);
    await lab.locator('#family').selectOption('');
    for (const [lot, count] of [['art01', 11], ['art02', 7], ['art03', 7]]) {
      await lab.locator('[data-mode="' + lot + '"]').click();
      assert.equal(await lab.locator('[data-' + lot + '-species]').count(), count);
      assert.equal(await decoded(lab.locator('[data-' + lot + '-species] img')), 512);
    }
    await labArtworkPreviews(lab, { id: 'af_facoquero', key: 'melanico' });
    assert.deepEqual(errors, []);
    return { sizes, comparisons: rows.length, approved: approved.length, priorLots: ['art01', 'art02', 'art03'],
      labVariantPreviews: artworkModules };
  } finally {
    await context.close();
  }
}

async function art05Smoke(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  try {
    const lab = await context.newPage();
    const errors = [];
    lab.on('pageerror', err => errors.push(err.message));
    const link = origin() + '/audit/naturalist-art/?view=pigment-audit';
    await lab.goto(link);
    const audit = name => lab.locator('#audit-' + name);
    const cards = lab.locator('[data-audit-key]');
    const results = lab.locator('#summary');
    const count = async expected => {
      assert.equal(await cards.count(), expected);
      assert.equal(await results.textContent(), expected + ' de 564 variantes');
    };
    await count(564);
    await audit('kind').selectOption('albino');
    await count(302);
    await audit('kind').selectOption('melanico');
    await count(262);
    await audit('kind').selectOption('');
    await audit('state').selectOption('pendiente');
    await count(390);
    await audit('state').selectOption('');
    await audit('corrected').selectOption('with');
    const corrected = await cards.count();
    assert.ok(corrected > 30 && corrected < 40);
    await audit('comparison').selectOption('without');
    await count(0);
    await audit('comparison').selectOption('with');
    await count(corrected);
    await audit('corrected').selectOption('without');
    await count(0);
    await audit('reset').click();
    await count(564);
    await audit('family').selectOption('Ursidae');
    await audit('state').selectOption('insuficiente');
    await count(1);
    assert.equal(await cards.first().getAttribute('data-audit-key'), 'asia_esp_0523/melanico');
    await audit('reset').click();
    await audit('sort').selectOption('state');
    assert.equal(await cards.first().getAttribute('data-art-state'), 'correcta');
    await audit('sort').selectOption('name');
    const names = await cards.locator('h3').allTextContents();
    assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })));
    await audit('sort').selectOption('family');
    const families = await cards.locator('.audit-taxonomy span').allTextContents();
    assert.deepEqual(families, [...families].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' })));
    await audit('sort').selectOption('priority');
    assert.equal(await cards.first().getAttribute('data-art-state'), 'insuficiente');
    const screenshots = process.env.ATLAS_ART05_SCREENSHOTS;
    assert.ok(await lab.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.ok(await lab.locator('#pigment-audit-filters label').evaluateAll(labels => labels.every(label =>
      label.firstElementChild.getBoundingClientRect().right <= label.getBoundingClientRect().right + 1)));
    if (screenshots) {
      await lab.locator('#heading').evaluate(node => node.scrollIntoView());
      await decoded(cards.first().locator('img'));
      await lab.screenshot({ path: path.join(screenshots, 'visor-global.png') });
    }

    await audit('search').fill('vison europeo');
    await count(1);
    assert.equal(await cards.first().getAttribute('data-audit-key'), 'eu_esp_0622/melanico');
    await cards.first().locator('button').click();
    const dialog = lab.locator('#pigment-audit-detail');
    assert.ok(await dialog.isVisible());
    assert.equal(await dialog.locator('img').count(), 4);
    await audit('detail-size').selectOption('512');
    assert.equal(await decoded(dialog.locator('img')), 512);
    await lab.keyboard.press('Escape');
    assert.ok(!(await dialog.isVisible()));
    await audit('search').fill('asia_esp_0402');
    await count(2);
    assert.match(await cards.filter({ hasText: 'Pseudomelanismo' }).textContent(), /Documentado/);

    const { rows } = JSON.parse(readFileSync('docs/arte-v509/decisiones.json', 'utf8'));
    const approved = rows.filter(row => row.outcome === 'aprobada');
    await audit('search').fill(approved[0].id);
    await audit('kind').selectOption(approved[0].variant);
    await count(1);
    await audit('backdrop').selectOption('dark');
    assert.equal(await lab.locator('.audit-gallery').getAttribute('data-audit-backdrop'), 'dark');
    await cards.first().locator('button').click();
    assert.equal(await audit('detail-content').getAttribute('data-audit-backdrop'), 'dark');
    const sizes = {};
    for (const size of [64, 128, 256, 512]) {
      await audit('detail-size').selectOption(String(size));
      const widths = await dialog.locator('img').evaluateAll(images =>
        Promise.all(images.map(async img => {
          img.loading = 'eager';
          await img.decode();
          return img.naturalWidth;
        })));
      assert.deepEqual(widths, [size, size, size]);
      sizes[size] = widths.length;
    }
    if (screenshots) await lab.screenshot({ path: path.join(screenshots, 'ficha-ampliada.png') });
    await audit('detail-backdrop').selectOption('light');
    assert.equal(await audit('detail-content').getAttribute('data-audit-backdrop'), 'light');
    await dialog.getByRole('button', { name: 'Cerrar ficha' }).click();
    assert.ok(!(await dialog.isVisible()));

    await lab.locator('[data-mode="art05"]').click();
    const batch = lab.locator('[data-art05-species]');
    assert.equal(await batch.count(), rows.length);
    await lab.locator('#comparison-size').selectOption('128');
    const correctedPlates = await batch.locator('img').evaluateAll(images =>
      Promise.all(images.map(async img => {
        img.loading = 'eager';
        await img.decode();
        return img.naturalWidth;
      })));
    assert.equal(correctedPlates.length, approved.length * 3 + (rows.length - approved.length) * 2);
    assert.ok(correctedPlates.every(width => width === 128));
    await lab.locator('[data-mode="variants"]').click();
    assert.ok(await lab.locator('#variant-view').isVisible());
    await lab.locator('#variant-view').selectOption('pigments');
    assert.equal(await lab.locator('[data-pigment-key="albino"],[data-pigment-key="melanico"]').count(), 564);
    await lab.locator('[data-mode="art04"]').click();
    assert.equal(await lab.locator('[data-art04-species]').count(), 9);
    await labArtworkPreviews(lab, { id: approved[0].id, key: approved[0].variant });
    await lab.setViewportSize({ width: 390, height: 844 });
    await lab.goto(link);
    await count(564);
    assert.ok(await lab.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await audit('search').fill(approved[0].id);
    await audit('kind').selectOption(approved[0].variant);
    await cards.first().locator('button').click();
    assert.ok(await dialog.isVisible());
    assert.ok(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth + 1));
    assert.deepEqual(errors, []);
    return { variants: 564, albinas: 302, melanicas: 262, corrected, sizes,
      filtering: ['tipo', 'estado', 'familia', 'corrección', 'comparativa'],
      sorting: ['familia', 'nombre', 'estado', 'prioridad'], approved: approved.length,
      legacyVariantSelector: true, mobileWidth: 390, labVariantPreviews: artworkModules };
  } finally {
    await context.close();
  }
}

async function offlineRun(browser) {
  const context = await browser.newContext(mobile);
  const transition = process.env.AUD05_PWA_TRANSITION === '1';
  const inspectArt01 = process.env.ATLAS_ART01 === '1';
  const inspectArt02 = process.env.ATLAS_ART02 === '1';
  const inspectArt03 = process.env.ATLAS_ART03 === '1';
  const candidate = sources.audit;
  try {
    const fixture = process.env.AUD05_PWA_SAVE;
    const save = fixture ? JSON.parse(readFileSync(fixture, 'utf8')) : null;
    await context.addInitScript(save => {
      Date.now = () => save?.lastTick ?? 1700002800000;
      if (save && !localStorage.getItem('gran_atlas_v05')) {
        localStorage.setItem('gran_atlas_v05', JSON.stringify(save));
      }
    }, save);
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    const url = origin() + '/audit/';
    async function install() {
      await page.goto(url + 'actualizar-atlas.html');
      await page.locator('#atlasUpdateApply').click();
      await page.getByText(/Descarga completa e integridad verificada/).waitFor({ timeout: 120000 });
      await page.locator('#atlasUpdateInstall').click();
      await page.getByText(/instalada\. El juego/).waitFor();
      await page.locator('#atlasUpdateReturn').click();
      await page.waitForFunction(() => !!window.AtlasSaveBridge && !!navigator.serviceWorker.controller);
    }
    if (transition) sources.audit = sources.base;
    await start(page, url);
    let previousCaches = [];
    if (transition) {
      await install();
      previousCaches = await page.evaluate(async () => (await caches.keys()).filter(name => name.includes('naturalist')));
      assert.ok(previousCaches.length > 0);
    }
    await page.locator('[data-action="search-manual"]').first().evaluate(el => el.click());
    const saved = await page.evaluate(() => JSON.stringify(AtlasSaveBridge.getSnapshot()));
    const raw = await page.evaluate(() => localStorage.getItem('gran_atlas_v05'));
    sources.audit = candidate;
    await install();
    assert.equal(await page.evaluate(() => JSON.stringify(AtlasSaveBridge.getSnapshot())), saved);
    assert.equal(await page.evaluate(() => localStorage.getItem('gran_atlas_backup_before_update')), raw);
    const caches = await page.evaluate(async () => {
      const names = (await window.caches.keys()).filter(name => name.includes('naturalist'));
      return Object.fromEntries(await Promise.all(names.map(async name => [name, (await (await window.caches.open(name)).keys()).length])));
    });
    for (const previous of previousCaches) assert.ok(!(previous in caches));
    const lab = await context.newPage();
    lab.on('pageerror', err => errors.push(err.message));
    if (inspectArt01 || inspectArt02 || inspectArt03) {
      await lab.goto(url + 'naturalist-art/');
      await lab.locator('#review-offline').click();
      await lab.getByText('Comparaciones listas para usar sin conexión.').waitFor({ timeout: 160000 });
    }
    await context.setOffline(true);
    await start(page, url);
    assert.equal(await page.evaluate(() => JSON.stringify(AtlasSaveBridge.getSnapshot())), saved);
    await page.evaluate(() => document.querySelector('.tab[data-tab="museum"]').click());
    await page.evaluate(() => document.querySelector('.tab[data-tab="journal"]').click());
    await page.evaluate(() => document.querySelector('.tab[data-tab="bestiary"]').click());
    assert.equal(await page.locator('[data-bestiary-pager]').first().getAttribute('data-total'), '1000');
    await lab.goto(url + 'naturalist-art/');
    await lab.waitForFunction(() => !!document.querySelector('#variant-view option[value="pigments"]'));
    assert.deepEqual(await lab.locator('#variant-view option').evaluateAll(options =>
      options.filter(o => ['albino', 'melanico', 'pigments'].includes(o.value)).map(o => o.value)), ['albino', 'melanico', 'pigments']);
    await lab.locator('[data-mode="variants"]').click();
    const pigmentCounts = {};
    for (const [value, expected] of [['albino', 302], ['melanico', 262], ['pigments', 564]]) {
      await lab.locator('#variant-view').selectOption(value);
      const selector = value === 'pigments' ? '[data-pigment-key="albino"], [data-pigment-key="melanico"]' : '[data-pigment-key="' + value + '"]';
      pigmentCounts[value] = await lab.locator(selector).count();
      assert.equal(pigmentCounts[value], expected);
    }
    const art01 = inspectArt01 ? await art01Checks(page, lab) : undefined;
    const art02 = inspectArt02 ? await art02Checks(page, lab) : undefined;
    const art03 = inspectArt03 ? await art03Checks(page, lab) : undefined;
    assert.deepEqual(errors, []);
    return { integrityVerified: true, exactBackup: true, previousCaches,
      unchangedSaveReceipt: JSON.parse(saved), bestiaryOffline: 1000, caches, pigmentCounts, art01, art02, art03 };
  } finally {
    sources.audit = candidate;
    await context.close();
  }
}
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    if (process.env.ATLAS_ART05_SMOKE === '1') {
      const audit = await art05Smoke(browser);
      console.log(JSON.stringify({ chromium: browser.version(), audit }, null, 2));
      return;
    }
    if (process.env.ATLAS_ART04_SMOKE === '1') {
      console.log(JSON.stringify({ chromium: browser.version(), lab: await art04Smoke(browser) }, null, 2));
      return;
    }
    const runs = [];
    if (process.env.AUD05_PWA_ONLY !== '1') {
      for (const id of ['base', 'audit', 'audit', 'base', 'base', 'audit']) runs.push(await performanceRun(browser, id));
    }
    const file = process.env.AUD01_ADVANCED_SAVE;
    const advanced = file ? [
      await advancedRun(browser, file, 'base', false),
      await advancedRun(browser, file, 'audit', true)
    ] : [];
    const offline = await offlineRun(browser);
    console.log(JSON.stringify({ chromium: browser.version(), viewport, cpuThrottle: 4, runs, advanced, offline }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
