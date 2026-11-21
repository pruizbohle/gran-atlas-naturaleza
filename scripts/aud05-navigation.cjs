'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const [base, fixtures, side = 'both'] = process.argv.slice(2);
if (!base || !fixtures || !['base', 'candidate', 'both'].includes(side)) {
  throw new Error('Usage: node scripts/aud05-navigation.cjs BASE_WWW FIXTURES [base|candidate|both]');
}
const roots = { base: path.resolve(base), candidate: path.resolve('www') };
const viewport = { width: 390, height: 844 };
const cpuSlowdown = Number(process.env.ATLAS_CPU_SLOWDOWN || 4);
const extended = process.env.AUD05_EXTENDED === '1';
const profile = process.env.AUD05_CPU_PROFILE === '1';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };
const server = http.createServer((request, response) => {
  try {
    const [, version, ...parts] = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).split('/');
    const root = roots[version];
    const file = path.resolve(root, parts.join('/') || 'index.html');
    if (!file.startsWith(root + path.sep) || !fs.statSync(file).isFile()) return response.writeHead(404).end();
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end();
  }
});

const tabs = ['field', 'journal', 'bestiary', 'atlas', 'research', 'expeditions', 'objects', 'museum', 'society'];
const tabSelector = name => '.tab[data-tab="' + name + '"]';
const operation = (label, selector, optional = false) => ({ label, selector, optional });
const route = (phase, names) => names.map(name => operation(phase + ':' + name, tabSelector(name)));

async function measure(browser, version, stage) {
  const context = await browser.newContext({ viewport, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const errors = [];
  try {
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && message.text().includes('El Gran Atlas:')) errors.push(message.text()); });
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpuSlowdown });
    const fixture = extended && stage === 'advanced' ? 'advanced-group' : stage;
    const save = stage === 'new' ? null : JSON.parse(fs.readFileSync(path.join(fixtures, fixture + '.json')));
    await page.addInitScript(save => {
      const key = 'gran_atlas_v05';
      const start = Date.now();
      if (save) {
        const shift = start - save.lastTick;
        const moveTimes = value => {
          if (!value || typeof value !== 'object') return;
          for (const k of Object.keys(value)) {
            if (typeof value[k] === 'number' && value[k] > 1600000000000 && value[k] < 1800000000000) value[k] += shift;
            else moveTimes(value[k]);
          }
        };
        moveTimes(save);
        localStorage.setItem(key, JSON.stringify(save));
      }
      let seed = 503;
      Math.random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 2 ** 32;
      };
      const audit = window.audit05 = { writes: 0, panelReplacements: 0, childChanges: 0, frames: [], longTasks: [], spans: [] };
      const set = Storage.prototype.setItem;
      Storage.prototype.setItem = function (name, value) {
        if (this === localStorage && name === key) audit.writes++;
        return set.call(this, name, value);
      };
      new PerformanceObserver(entries => {
        for (const entry of entries.getEntries()) audit.longTasks.push({ start: entry.startTime, ms: entry.duration });
      }).observe({ type: 'longtask', buffered: true });
      let last;
      function frame(now) {
        if (last !== undefined) audit.frames.push({ time: now, delta: now - last });
        last = now;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      document.addEventListener('DOMContentLoaded', () => {
        const panel = document.getElementById('panel');
        new MutationObserver(records => {
          audit.panelReplacements += records.filter(r => r.target === panel && r.removedNodes.length && r.addedNodes.length).length;
          audit.childChanges += records.length;
        }).observe(panel, { childList: true, subtree: true });
      }, { once: true });
    }, save);
    const url = 'http://127.0.0.1:' + server.address().port + '/' + version + '/';
    await page.goto(url);
    await page.waitForFunction(() => !!window.AtlasSaveBridge);
    await page.evaluate(() => document.fonts.ready);
    if (profile) {
      await cdp.send('Profiler.enable');
      await cdp.send('Profiler.start');
    }
    const heaps = [];
    const snapshots = [];
    async function sample() {
      heaps.push((await cdp.send('Runtime.getHeapUsage')).usedSize);
      snapshots.push(await page.evaluate(() => AtlasSaveBridge.getSnapshot()));
    }
    async function batch(operations) {
      const results = await page.evaluate(async operations => {
        const results = [];
        const waitForPaint = () => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done)));
        for (const { label, selector, optional, kind, value } of operations) {
          const node = document.querySelector(selector);
          if (!node && optional) continue;
          if (!node) throw Error('Missing ' + label + ' (' + selector + ')');
          const start = performance.now();
          if (kind === 'search' || kind === 'select') {
            node.value = value;
            node.dispatchEvent(new Event(kind === 'search' ? 'input' : 'change', { bubbles: true }));
          } else if (kind === 'key') node.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true }));
          else node.click();
          const sync = performance.now() - start;
          await waitForPaint();
          const end = performance.now();
          audit05.spans.push({ label, start, end });
          results.push({ label, sync, paint: end - start,
            module: document.body.dataset.uxModule, scroll: Math.round(window.scrollY) });
        }
        return results;
      }, operations);
      timings.push(...results);
    }
    const timings = [];
    await sample();
    await batch(route('cold', tabs));
    await batch(route('warm', tabs));
    if (extended) {
      await batch([
        operation('research', tabSelector('research')),
        { ...operation('research:filter', '[data-er28-change="filter"]'), kind: 'select', value: 'available' },
        operation('museum', tabSelector('museum')),
        operation('museum:samples', '[data-action="museum-tab"][data-id="samples"]'),
        { ...operation('museum:filter', '[data-m27-filter="filter"]'), kind: 'select', value: 'exhibited' }
      ]);
    }
    await sample();
    await batch([
      operation('camp', tabSelector('expeditions')),
      operation('expeditions', '[data-cp-open="shipyard"]'),
      operation('camp:back', '[data-cp-back]'),
      operation('commerce', '[data-cp-open="caravan"]'),
      operation('profile:menu', '#saveManagerOpen'),
      operation('profile', '[data-cp-dialog="profile"]'),
      operation('profile:close', '#cp3430-dialog [data-cp-close]'),
      operation('museum', tabSelector('museum')),
      ...['exhibitions', 'samples', 'fossils', 'relicts', 'artifacts'].map(id =>
        operation('museum:' + id, '[data-action="museum-tab"][data-id="' + id + '"]')),
      operation('society', tabSelector('society')),
      operation('achievements', '[data-action="society-tab"][data-id="achievements"]'),
      operation('inventory', tabSelector('objects')),
      operation('inventory:workshop', '[data-action="inventory-tab"][data-id="taller"]'),
      { ...operation('inventory:search', '[data-inv-filter="query"]', true), kind: 'search', value: 'mapa' },
      operation('atlas', tabSelector('atlas')),
      operation('atlas:center', '[data-action="atlas-center"]'),
      { ...operation('atlas:keyboard', '.atlas-v32-hex', true), kind: 'key', value: 'Enter' },
      operation('atlas:travel', '[data-action="travel-region"]', true),
      operation('field', tabSelector('field')),
      operation('field:manual', '[data-action="search-manual"]'),
      operation('journal', tabSelector('journal')),
      operation('journal:entry', '[data-journal-slot]:not([aria-current])'),
      { ...operation('journal:search', '#journalRailSearch'), kind: 'search', value: 'zzz' },
      operation('field:leave', tabSelector('field')),
      operation('journal:return', tabSelector('journal'))
    ]);
    assert.equal(await page.locator('#journalRailSearch').inputValue(), 'zzz');
    assert.equal(await page.locator('#journalRailCount').textContent(), 'Sin resultados');
    await batch([
      { ...operation('journal:clear', '#journalRailSearch'), kind: 'search', value: '' },
      { ...operation('journal:sort', '#journalRailSort'), kind: 'select', value: 'sightings' },
      operation('bestiary', tabSelector('bestiary'))
    ]);
    let completedMonograph = false;
    if (extended) {
      await batch([operation('journal:resume', tabSelector('journal'))]);
      const complete = page.locator('.j25-animal').filter({ has: page.locator('.j25-animal-progress', { hasText: /^5\/5/ }) }).first();
      if (await complete.count()) {
        await complete.evaluate(node => node.click());
        await page.getByText('Monografía completa', { exact: true }).waitFor();
        completedMonograph = true;
      }
      await page.evaluate(() => { window.aud05Rail = document.getElementById('journalSpeciesRail'); });
      await batch([operation('field:leave', tabSelector('field')), operation('journal:reopen', tabSelector('journal'))]);
      if (version === 'candidate') {
        assert.ok(await page.evaluate(() => window.aud05Rail === document.getElementById('journalSpeciesRail')));
      }
      await batch([operation('bestiary:resume', tabSelector('bestiary'))]);
    }
    const known = await page.locator('.b26-card:not([disabled])').first().getAttribute('aria-label', { timeout: 5000 }).catch(() => null);
    if (known) {
      await batch([operation('bestiary:card', '.b26-card:not([disabled])'),
        operation('bestiary:close', '[data-action="b26-close"]')]);
      assert.ok(await page.locator('.b26-card:not([disabled])').first().evaluate(el => el === document.activeElement));
      const thumbnails = await page.locator('.b26-grid img.atlas-art-image').evaluateAll(images =>
        images.map(img => ({ src: img.getAttribute('src'), loading: img.loading, decoding: img.decoding })));
      assert.ok(thumbnails.length > 0);
      assert.ok(thumbnails.every(img => img.loading === 'lazy' && img.decoding === 'async' && img.src.endsWith('.webp')));
    }
    await batch([
      { ...operation('bestiary:filter', '#b26-search'), kind: 'search', value: 'zzz' },
      operation('bestiary:leave', tabSelector('field')),
      operation('bestiary:return', tabSelector('bestiary'))
    ]);
    assert.equal(await page.locator('#b26-search').inputValue(), 'zzz');
    assert.equal(await page.locator('[data-bestiary-pager]').first().getAttribute('data-total'), '0');
    await batch([operation('bestiary:clear', '[data-action="b26-clear"]')]);
    const pager = page.locator('[data-bestiary-pager]').first();
    const pageCount = Number(await pager.getAttribute('data-pages'));
    if (extended && version === 'candidate') {
      await pager.locator('button:last-child').focus();
      await page.keyboard.press('Enter');
      assert.ok(await pager.getByRole('status').evaluate(el => el === document.activeElement));
      await pager.locator('button:first-child').click();
    }
    const slots = new Set(await page.locator('.b26-card').evaluateAll(nodes => nodes.map(n => n.dataset.b26Slot)));
    const count = await page.evaluate(async pageCount => {
      const slots = [];
      for (let n = 1; n < pageCount; n++) {
        const start = performance.now();
        document.querySelector('[data-bestiary-pager] button:last-child').click();
        const end = performance.now();
        audit05.spans.push({ label: 'bestiary:pages', start, end });
        slots.push(...Array.from(document.querySelectorAll('.b26-card'), node => node.dataset.b26Slot));
        await new Promise(done => requestAnimationFrame(done));
      }
      return slots;
    }, pageCount);
    for (const id of count) slots.add(id);
    assert.equal(slots.size, 1000);
    assert.equal((pageCount - 1) * 32 + await page.locator('.b26-card').count(), 1000);
    await sample();
    await batch(route('rapid', Array.from({ length: 12 }, () => ['field', 'journal']).flat()));
    const motion = await page.evaluate(async () => {
      const rail = document.getElementById('journalSpeciesRail');
      const horizontal = rail.scrollWidth > rail.clientWidth;
      const vertical = rail.scrollHeight > rail.clientHeight;
      const scroller = horizontal || vertical ? rail : document.scrollingElement;
      const axis = horizontal ? 'scrollLeft' : 'scrollTop';
      scroller[axis] = 0;
      const start = performance.now();
      let moved = 0;
      for (let frame = 0; frame < 24; frame++) {
        const before = scroller[axis];
        scroller[axis] += frame < 12 ? 48 : -48;
        moved += Math.abs(before - scroller[axis]);
        await new Promise(done => requestAnimationFrame(done));
      }
      return { start, end: performance.now(), moved, axis, element: scroller.id || scroller.nodeName };
    });
    assert.ok(motion.moved > 0, 'The mobile scroll scenario must actually move');
    await sample();
    await batch([operation('field:auto', tabSelector('field'))]);
    await page.waitForTimeout(Number(process.env.AUD05_SOAK_MS || 6000));
    let hasMultiple = false;
    if (extended) {
      hasMultiple = await page.evaluate(() => {
        const find = () => document.querySelectorAll('#fieldResult .encounter-species-art').length > 1 &&
          Boolean(document.querySelector('#fieldResult .encounter-multiplier'));
        for (let attempt = 0; attempt < 24 && !find(); attempt++) {
          document.querySelector('[data-action="search-manual"]').click();
        }
        return find();
      });
      assert.ok(save?.helpers !== 10 || hasMultiple, 'La partida avanzada debe mostrar un avistamiento múltiple con multiplicador');
    }
    await sample();
    if (save?.helpers > 0) assert.ok(snapshots.at(-1).sightings > snapshots.at(-2).sightings);
    assert.ok(await page.evaluate(() => AtlasSaveBridge.verifySavedGame()));
    assert.deepEqual(errors, []);
    assert.equal(await page.locator('text=No se pudo abrir este módulo').count(), 0);
    const observed = await page.evaluate(() => ({
      startup: performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,
      ...audit05
    }));
    const longTasks = observed.longTasks.map(task => ({
      ...task, operation: observed.spans.find(span => span.start >= task.start && span.start < task.start + task.ms)?.label ||
        observed.spans.find(span => span.start < task.start && span.end > task.start)?.label || 'startup/idle'
    }));
    let cpu = null;
    if (profile) {
      const { profile: data } = await cdp.send('Profiler.stop');
      const nodes = new Map(data.nodes.map(node => [node.id, node.callFrame]));
      const time = new Map();
      for (const [index, id] of data.samples.entries()) {
        const node = nodes.get(id);
        if (!node?.url.includes('/js/')) continue;
        const name = (node.functionName || '(anónima)') + ' · ' + node.url.split('/').at(-1) + ':' + (node.lineNumber + 1);
        time.set(name, (time.get(name) || 0) + data.timeDeltas[index] / 1000);
      }
      cpu = [...time].sort((a, b) => b[1] - a[1]).slice(0, 30).map(([name, ms]) => ({ name, ms }));
    }
    return { version, stage, helpers: save?.helpers || 0, timings, pages: pageCount, slots: slots.size,
      writes: observed.writes, panelReplacements: observed.panelReplacements, childChanges: observed.childChanges,
      startupMs: observed.startup, longTasks, heaps, snapshots, motion: { ...motion,
        frameGapsMs: observed.frames.filter(f => f.time >= motion.start && f.time <= motion.end).map(f => f.delta) },
      pageTurnsMs: observed.spans.filter(s => s.label === 'bestiary:pages').map(s => s.end - s.start),
      extraChecks: extended ? { completedMonograph, hasMultiple } : null, cpu };
  } finally {
    await context.close();
  }
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const runs = [];
    const stages = process.env.AUD05_STAGE?.split(',') || ['new', 'intermediate', 'advanced'];
    for (const stage of stages) {
      assert.ok(['new', 'initial', 'intermediate', 'intermediate-five', 'advanced'].includes(stage), stage);
      for (const version of side === 'both' ? (stage === 'intermediate' ? ['candidate', 'base'] : ['base', 'candidate']) : [side]) {
        runs.push(await measure(browser, version, stage));
        process.stderr.write(version + ' ' + stage + '\n');
      }
    }
    console.log(JSON.stringify({ chromium: browser.version(), viewport, cpuSlowdown, runs }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
