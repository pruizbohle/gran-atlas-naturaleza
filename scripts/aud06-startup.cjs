'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const [base, fixtures, side = 'both'] = process.argv.slice(2);
assert.ok(base && fixtures && ['base', 'candidate', 'both'].includes(side));
const roots = { base: path.resolve(base), candidate: path.resolve('www') };
const viewport = { width: 390, height: 844 };
const slowdown = Number(process.env.ATLAS_CPU_SLOWDOWN || 4);
const repeats = Number(process.env.AUD06_REPEATS || 3);
const states = (process.env.AUD06_STAGES || 'new,intermediate,advanced').split(',');
const active = process.env.AUD06_ACTIVE === '1';
const pageSweep = process.env.AUD06_PAGES === '1';
const qa = process.env.AUD06_QA === '1';
const interrupt = process.env.AUD06_INTERRUPT === '1';
const storageKey = 'gran_atlas_v05';
const modules = ['journal', 'bestiary', 'atlas', 'research', 'museum', 'society', 'objects', 'expeditions'];
const content = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png' };

function instrument(code) {
  const mark = (name, where) => `globalThis.performance.mark('aud06:${name}:${where}');`;
  function around(name, expression) {
    assert.ok(code.includes(expression), expression);
    code = code.replace(expression, mark(name, 'start') + expression + mark(name, 'end'));
  }
  code = code.replace('(function(){', '(function(){' + mark('game-script', 'start'));
  code = code.replace('const SPECIMEN_CATEGORIES=', mark('specimens', 'start') + 'const SPECIMEN_CATEGORIES=');
  code = code.replace('function configuredSpecials', mark('specimens', 'end') + 'function configuredSpecials');
  around('research-index', 'const researchIndex3280=new Map(RESEARCH_NODES.map(n=>[n.id,n]));');
  code = code.replace('// AM-02: additive catalog installation.', mark('catalogue-extensions', 'start') + '// AM-02: additive catalog installation.');
  code = code.replace('let state=load();', mark('catalogue-extensions', 'end') + 'let state=load();');
  around('save', 'let state=load();');
  around('save-read', 'raw=localStorage.getItem(STORAGE_KEY);');
  code = code.replace('try{ panel.innerHTML=(renderers[tab]||renderField)(); }',
    'try{' + mark('panel-model', 'start') + 'const markup=(renderers[tab]||renderField)();' +
    mark('panel-model', 'end') + mark('panel-dom', 'start') + 'panel.innerHTML=markup;' + mark('panel-dom', 'end') + '}');
  around('panel-hooks', 'bindPanel();');
  code = code.replace('setInterval(tick,1000);', 'setInterval(()=>{' + mark('tick', 'start') + 'tick();' + mark('tick', 'end') + '},1000);');
  for (const [phase, expression] of [
    ['achievements', 'achievementNotices3360=globalThis.AtlasAchievements3360.initialize(state,achievementContext3360());'],
    ['commissions', 'globalThis.AtlasCommissions3370.initialize(state,commissionContext3370());'],
    ['curation', 'globalThis.AtlasMuseumCuration3380.initialize(state,curationContext3380());']
  ]) {
    const i = code.lastIndexOf(expression);
    assert.ok(i > 0);
    code = code.slice(0, i) + mark(phase, 'start') + expression + mark(phase, 'end') + code.slice(i + expression.length);
  }
  code = code.replace('\nrender();\n})();', '\n' + mark('initial-render', 'start') + 'render();' +
    mark('initial-render', 'end') + mark('game-script', 'end') + '\n})();');
  return code;
}

const server = http.createServer(async (request, response) => {
  try {
    const [, version, ...parts] = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).split('/');
    const root = roots[version];
    const file = path.resolve(root, parts.join('/') || 'index.html');
    if (!file.startsWith(root + path.sep)) return response.writeHead(404).end();
    const bytes = await fs.readFile(file);
    response.writeHead(200, { 'Content-Type': content[path.extname(file)] || 'application/octet-stream' });
    response.end(parts.join('/') === 'js/app.js' ? instrument(bytes.toString()) : bytes);
  } catch (error) {
    response.writeHead(error instanceof assert.AssertionError ? 500 : 404).end();
    if (error instanceof assert.AssertionError) console.error(error.message);
  }
});
async function traceData(cdp) {
  const complete = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve));
  await cdp.send('Tracing.end');
  const { stream } = await complete;
  const chunks = [];
  for (;;) {
    const data = await cdp.send('IO.read', { handle: stream });
    chunks.push(Buffer.from(data.data, data.base64Encoded ? 'base64' : 'utf8'));
    if (data.eof) break;
  }
  await cdp.send('IO.close', { handle: stream });
  return JSON.parse(Buffer.concat(chunks).toString()).traceEvents;
}
const categories = {
  script: ['EvaluateScript', 'FunctionCall', 'v8.compile', 'V8.CompileCode', 'V8.CompileScript'],
  html: ['ParseHTML'],
  style: ['UpdateLayoutTree', 'RecalculateStyles'],
  layout: ['Layout'],
  paint: ['PrePaint', 'Paint', 'Layerize', 'Commit'],
  image: ['Decode Image', 'ImageDecodeTask', 'PaintImage']
};
const within = (event, start, end) => Math.max(0, Math.min(event.ts + event.dur, end) - Math.max(event.ts, start));
function reportTrace(events, phases) {
  const ready = events.find(e => e.name === 'aud06:game-script:end');
  assert.ok(ready, 'Expected the end of game initialization in Chromium trace');
  const main = events.filter(e => e.pid === ready.pid && e.tid === ready.tid && e.ph === 'X' && e.dur);
  // Merge nested events within each family before summing exclusive intervals.
  function union(events, start, end) {
    let total = 0;
    let covered = start;
    for (const e of events.filter(e => within(e, start, end)).sort((a,b) => a.ts - b.ts)) {
      const right = Math.min(e.ts + e.dur, end);
      total += Math.max(0, right - Math.max(covered, e.ts));
      covered = Math.max(covered, right);
    }
    return Math.round(total / 100) / 10;
  }
  return Object.fromEntries(phases.map(([name, start, end]) => {
    const startMark = events.find(e => e.name === start), endMark = events.find(e => e.name === end);
    if (!startMark || !endMark) return [name, null];
    const { ts: from } = startMark, { ts: to } = endMark;
    const sums = Object.fromEntries(Object.entries(categories).map(([kind, names]) =>
      [kind, union(main.filter(e => names.includes(e.name)), from, to)]));
    const tasks = main.filter(e => e.name === 'RunTask' && e.dur > 50000 && within(e, from, to)).map(e => ({
      ms: Math.round(e.dur / 100) / 10,
      phases: [...new Set(events.filter(m => m.pid === ready.pid && m.tid === ready.tid &&
        m.name.startsWith('aud06:') && m.ts >= e.ts && m.ts < e.ts + e.dur).map(m => m.name))],
      children: main.filter(child => child.ts >= e.ts && child.ts + child.dur <= e.ts + e.dur &&
        ['EvaluateScript', 'FunctionCall', 'ParseHTML', 'Layout', 'UpdateLayoutTree', 'Paint'].includes(child.name))
        .sort((a,b) => b.dur - a.dur).slice(0, 5).map(child => ({
          name: child.name, ms: Math.round(child.dur / 100) / 10,
          script: child.args?.data?.url?.split('/').slice(-2).join('/')
        }))
    }));
    return [name, { ms: Math.round((to - from) / 100) / 10, ...sums, tasks }];
  }));
}

async function deviceChecks(page, cdp) {
  const open = async name => {
    const dock = page.locator('.mobile-dock-link[data-tab="' + name + '"]');
    if (await dock.count()) await dock.tap();
    else {
      await page.locator('#mobileMenuOpen').tap();
      await page.locator('.mobile-menu-item[data-tab="' + name + '"]').tap();
    }
    assert.equal(await page.locator('body').getAttribute('data-ux-module'), name);
  };
  const known = page.locator('.b26-card:not([disabled])');
  await open('bestiary');
  assert.equal(await known.count(), 0);
  await open('field');
  const manual = page.locator('[data-action="search-manual"]');
  for (let i = 0; i < 12; i++) {
    if (await page.evaluate(() => AtlasSaveBridge.getSnapshot().sightings > 0)) break;
    await manual.tap();
  }
  await open('bestiary');
  await known.first().tap();
  await page.locator('.b26-dialog[open]').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.b26-dialog[open]').count(), 0);
  assert.ok(await known.first().evaluate(el => document.activeElement === el));
  const pager = page.locator('[data-bestiary-pager]').first();
  await pager.locator('button:last-child').focus();
  await page.keyboard.press('Enter');
  assert.equal(await pager.getAttribute('data-page'), '1');
  assert.ok(await pager.getByRole('status').evaluate(el => document.activeElement === el));
  await page.locator('#b26-search').fill('sin coincidencias');
  await open('journal');
  const rail = page.locator('#journalSpeciesRail');
  const box = await rail.boundingBox();
  const y = Math.round(box.y + box.height / 2);
  const start = Math.min(viewport.width - 15, Math.round(box.x + box.width - 25));
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start, y }] });
  for (let i = 1; i <= 6; i++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start - i * 30, y }] });
    await page.waitForTimeout(25);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForFunction(() => document.getElementById('journalSpeciesRail').scrollLeft > 0);
  const scroll = await rail.evaluate(el => el.scrollLeft);
  await open('bestiary');
  assert.equal(await page.locator('#b26-search').inputValue(), 'sin coincidencias');
  assert.equal(await pager.getAttribute('data-total'), '0');
  await page.setViewportSize({ width: 844, height: 390 });
  await page.locator('.b26-root').waitFor();
  assert.equal(await page.locator('#b26-search').inputValue(), 'sin coincidencias');
  await page.setViewportSize(viewport);

  const fixture = JSON.parse(await fs.readFile('tests/fixtures/stability-saves-v3240.json', 'utf8'))[0];
  const previous = JSON.parse(fixture.raw);
  await page.locator('#saveManagerOpen').tap();
  await page.locator('[data-cp-save]').tap();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#saveImportFile').setInputFiles({
    name: 'historical.json', mimeType: 'application/json', buffer: Buffer.from(fixture.raw)
  });
  await page.locator('#saveImportBtn').tap();
  await page.waitForFunction(() => AtlasSaveBridge.verifySavedGame() && AtlasSaveBridge.getSnapshot().money === 123456);
  const restored = await page.evaluate(() => AtlasSaveBridge.getSaveData());
  for (const field of ['money', 'knowledge', 'prestige', 'sightings', 'published', 'inventory', 'purchases']) {
    assert.deepEqual(restored[field], previous[field] || {}, field);
  }
  return { newDiscovery: true, touchScroll: scroll, keyboardPaging: true, savedSearch: true, landscape: true,
    oldBackupImported: fixture.version, verifiedFields: 7 };
}

async function closeDuringStartup(browser, version) {
  const context = await browser.newContext({ viewport, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  const url = 'http://127.0.0.1:' + server.address().port + '/' + version + '/';
  try {
    const page = await context.newPage();
    const raw = await fs.readFile(path.join(fixtures, 'advanced.json'), 'utf8');
    const now = JSON.parse(raw).lastTick;
    await context.addInitScript(now => { Date.now = () => now; }, now);
    await page.addInitScript(({ raw, storageKey }) => { localStorage.setItem(storageKey, raw); }, { raw, storageKey });
    await page.route('**/js/app.js?*', async route => {
      const response = await route.fetch();
      const source = await response.text();
      await route.fulfill({ response, body: source.replace('let state=load();', 'let state=load();debugger;') });
    });
    const cdp = await context.newCDPSession(page);
    await cdp.send('Debugger.enable');
    const paused = new Promise(resolve => cdp.once('Debugger.paused', resolve));
    const navigation = page.goto(url).catch(() => {});
    await Promise.race([paused, navigation.then(() => { throw Error('Startup was not interrupted after load'); })]);
    const closed = page.waitForEvent('crash', { timeout: 15000 });
    cdp.send('Page.crash').catch(() => {});
    await closed;
    await page.close();
    const reopened = await context.newPage();
    await reopened.route('**/audit-probe.html', route => route.fulfill({ body: '<!doctype html><p>Audit</p>', contentType: 'text/html' }));
    await reopened.goto(url + 'audit-probe.html');
    assert.equal(await reopened.evaluate(key => localStorage.getItem(key), storageKey), raw);
    await reopened.goto(url);
    const restored = await reopened.evaluate(() => AtlasSaveBridge.getSaveData());
    const fields = 'sightings money knowledge inventory published purchases specialCounts legendaryFound stages voyages voyageSettled'.split(' ');
    const original = JSON.parse(raw);
    for (const field of fields) assert.deepEqual(restored[field], original[field], field);
    return { version, closedAfterLoad: true, exactBeforeReopen: true, fields };
  } finally {
    await context.close();
  }
}

async function measure(browser, version, stage) {
  const context = await browser.newContext({ viewport, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: slowdown });
    const save = stage === 'new' ? null : JSON.parse(await fs.readFile(path.join(fixtures, stage + '.json'), 'utf8'));
    await page.addInitScript(({ save, active }) => {
      performance.mark('aud06:navigation:start');
      if (save) {
        const clock = save.lastTick, start = performance.now();
        Date.now = () => clock + (active ? Math.floor(performance.now() - start) : 0);
        localStorage.setItem('gran_atlas_v05', JSON.stringify(save));
      }
      let seed = 504;
      Math.random = () => {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        return seed / 2 ** 32;
      };
      window.auditTasks = [];
      new PerformanceObserver(list => {
        for (const e of list.getEntries()) auditTasks.push({ start: e.startTime, ms: e.duration });
      }).observe({ type: 'longtask', buffered: true });
      const handler = () => requestAnimationFrame(() => requestAnimationFrame(() => performance.mark('aud06:navigation:paint')));
      document.addEventListener('DOMContentLoaded', handler, { once: true });
    }, { save, active });
    await cdp.send('Tracing.start', {
      categories: 'devtools.timeline,blink.user_timing,loading,v8,toplevel,disabled-by-default-devtools.timeline',
      transferMode: 'ReturnAsStream'
    });
    await page.goto('http://127.0.0.1:' + server.address().port + '/' + version + '/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => performance.getEntriesByName('aud06:navigation:paint').length > 0);
    assert.equal(await page.locator('[data-action="search-manual"]').count(), 1);
    const startup = await page.evaluate(() => {
      const marks = Object.fromEntries(performance.getEntriesByType('mark').map(mark => [mark.name, mark.startTime]));
      const end = marks['aud06:navigation:paint'];
      return { marks, paint: performance.getEntriesByType('paint').map(e => [e.name, e.startTime]),
        resources: performance.getEntriesByType('resource').reduce((byType, e) => {
          const type = e.initiatorType;
          (byType[type] ||= []).push([e.name.split('/').at(-1), e.decodedBodySize, e.responseEnd]);
          return byType;
        }, {}),
        tasks: auditTasks.filter(t => t.start <= end) };
    });
    const heap = [(await cdp.send('Runtime.getHeapUsage')).usedSize];
    const timings = await page.evaluate(async modules => {
      const twoFrames = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const results = [];
      for (const name of modules) {
        const label = 'aud06:open:' + name;
        performance.mark(label + ':start');
        document.querySelector('.tab[data-tab="' + name + '"]').click();
        performance.mark(label + ':sync');
        await twoFrames();
        performance.mark(label + ':end');
        const at = ending => performance.getEntriesByName(label + ending)[0].startTime;
        results.push({ name, sync: at(':sync') - at(':start'), nextPaint: at(':end') - at(':start'),
          module: document.body.dataset.uxModule,
          art: document.querySelectorAll('#panel img[loading="lazy"]').length });
      }
      return results;
    }, modules);
    assert.deepEqual(timings.map(x => x.module), modules);
    heap.push((await cdp.send('Runtime.getHeapUsage')).usedSize);
    let paging = null;
    if (pageSweep) {
      paging = await page.evaluate(async () => {
        const open = tab => document.querySelector('.tab[data-tab="' + tab + '"]').click();
        open('field');
        await new Promise(resolve => setTimeout(resolve, 1100));
        open('bestiary');
        const before = AtlasSaveBridge.getSnapshot().sightings;
        const start = performance.now(), sync = [], paint = [], slots = [];
        const snapshotSlots = () => slots.push(...Array.from(document.querySelectorAll('[data-b26-slot].b26-card'), n => n.dataset.b26Slot));
        performance.mark('aud06:paging:start');
        snapshotSlots();
        for (let page = 1; page < 32; page++) {
          const began = performance.now();
          document.querySelector('[data-bestiary-pager] button:last-child').click();
          sync.push(performance.now() - began);
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          paint.push(performance.now() - began);
          snapshotSlots();
        }
        performance.mark('aud06:paging:end');
        const marks = performance.getEntriesByType('mark').filter(m => m.startTime >= start && m.name.startsWith('aud06:tick:'));
        const timerMs = marks.reduce((n,m) => n + m.startTime * (m.name.endsWith(':end') ? 1 : -1), 0);
        return { sync, paint, totalSlots: slots.length, distinctSlots: new Set(slots).size,
          ticks: marks.length / 2, timerMs, sightings: AtlasSaveBridge.getSnapshot().sightings - before };
      });
      assert.equal(paging.totalSlots, 1000);
      assert.equal(paging.distinctSlots, 1000);
      heap.push((await cdp.send('Runtime.getHeapUsage')).usedSize);
    }
    const phases = [
      ['startup', 'aud06:navigation:start', 'aud06:navigation:paint'],
      ...modules.map(name => [name, 'aud06:open:' + name + ':start', 'aud06:open:' + name + ':end']),
      ...(pageSweep ? [['paging', 'aud06:paging:start', 'aud06:paging:end']] : [])
    ];
    const trace = reportTrace(await traceData(cdp), phases);
    const device = qa && stage === 'new' ? await deviceChecks(page, cdp) : null;
    assert.deepEqual(errors, []);
    return { version, stage, helpers: save?.helpers || 0, startup, timings, paging, heap, trace, device };
  } finally {
    await context.close();
  }
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const runs = [];
    if (!interrupt) for (const stage of states) for (let i = 0; i < repeats; i++) {
      const order = side === 'both' ? (i % 2 ? ['candidate', 'base'] : ['base', 'candidate']) : [side];
      for (const version of order) {
        runs.push(await measure(browser, version, stage));
        process.stderr.write(`${version} ${stage} ${i + 1}\n`);
      }
    }
    const interruption = interrupt ? await closeDuringStartup(browser, side === 'base' ? 'base' : 'candidate') : null;
    console.log(JSON.stringify({ chromium: browser.version(), viewport, slowdown, active, runs, interruption }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
