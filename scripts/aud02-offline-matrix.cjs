'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const [baseline, fixtureFile, side = 'both'] = process.argv.slice(2);
assert.ok(baseline && fixtureFile && ['base', 'candidate', 'both'].includes(side),
  'Uso: node scripts/aud02-offline-matrix.cjs /ruta/base/www /ruta/partida.json [base|candidate|both]');
const roots = { base: path.resolve(baseline), candidate: path.resolve('www') };
const fixture = JSON.parse(fs.readFileSync(fixtureFile, 'utf8'));
const hours = [1, 4, 8, 72];
const teams = [1, 5, 10];
const hour = 3600000;
const selected = process.env.ATLAS_OFFLINE_CASE;
const key = 'gran_atlas_v05';
const mime = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const hook = `\nwindow.__offlineAudit = () => ({
  processed: state.lastTick,
  queued: state.autoPending.length > 0,
  pending: state.autoPending.reduce((sum, segment) => sum + 1 + Math.floor((segment.end-segment.at)/segment.interval), 0),
  helpers: state.helpers, sightings: totalSightings(), knowledge: state.knowledge
});\n})();`;
const server = http.createServer((req, res) => {
  const [, name, ...parts] = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).split('/');
  const root = roots[name];
  if (!root) return res.writeHead(404).end();
  const file = path.resolve(root, parts.join('/') || 'index.html');
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) return res.writeHead(404).end();
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
  if (parts.join('/') === 'js/app.js') return res.end(fs.readFileSync(file, 'utf8').replace(/\n}\)\(\);\s*$/, hook));
  fs.createReadStream(file).pipe(res);
});

async function measure(browser, label, elapsed, helpers, { crash = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true,
    hasTouch: true, serviceWorkers: 'block' });
  const now = fixture.lastTick + elapsed * hour;
  const faults = [];
  const slowdown = Number(process.env.ATLAS_CPU_SLOWDOWN || 4);
  await context.addInitScript(({ fixture, now, helpers, key }) => {
    Date.now = () => now;
    let seed = Number(localStorage.getItem('auditSeed')) || 501;
    Math.random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 2 ** 32;
    };
    const persist = Storage.prototype.setItem;
    window.auditWrites = 0;
    Storage.prototype.setItem = function(name, value) {
      const result = persist.call(this, name, value);
      if (name === key) {
        persist.call(this, 'auditSeed', seed);
        window.auditWrites++;
      }
      return result;
    };
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ ...fixture, helpers }));
    window.auditTasks = [];
    window.auditGaps = [];
    new PerformanceObserver(list => window.auditTasks.push(...list.getEntries().map(e => ({ start: e.startTime, ms: e.duration }))))
      .observe({ type: 'longtask', buffered: true });
    let last = performance.now();
    setInterval(() => {
      const current = performance.now();
      window.auditGaps.push({ start: last, ms: Math.max(0, current - last - 40) });
      last = current;
    }, 40);
  }, { fixture, now, helpers, key });
  const url = 'http://127.0.0.1:' + server.address().port + '/' + label + '/';
  async function open() {
    const page = await context.newPage();
    page.on('pageerror', error => faults.push(error.message));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: slowdown });
    await page.goto(url);
    await page.waitForFunction(() => typeof window.__offlineAudit === 'function');
    return { page, cdp };
  }
  try {
    let { page, cdp } = await open();
    let checkpoint = null;
    if (crash) {
      await page.waitForFunction(({ key, now }) => {
        const s = JSON.parse(localStorage.getItem(key));
        return s.lastTick === now && s.autoPending.length > 0 && s.autoPending[0].at > now - 8 * 3600000 + 60000;
      }, { key, now });
      checkpoint = await page.evaluate(key => {
        const s = JSON.parse(localStorage.getItem(key));
        return { knowledge: s.knowledge, sightings: s.sightings, at: s.autoPending[0].at, end: s.autoPending.at(-1).end };
      }, key);
      const crashed = page.waitForEvent('crash',{timeout:15000});
      cdp.send('Page.crash').catch(() => {});
      await crashed;
      await page.close();
      ({ page, cdp } = await open());
    }
    const profiling = Boolean(process.env.ATLAS_OFFLINE_PROFILE);
    if (profiling) {
      await cdp.send('Profiler.enable');
      await cdp.send('Profiler.start');
    }
    const result = await page.evaluate(async ({ key, now }) => {
      let start, lastNavigation = 0;
      const timeout=performance.now()+90000;
      const timings = [];
      await new Promise((resolve,reject) => {
        function sample(time) {
          if(time>timeout)return reject(new Error('La cola no quedó guardada en 90 s'));
          const cursor = window.__offlineAudit();
          if (cursor.processed === now && start === undefined) start = time;
          if (start !== undefined && !cursor.queued && AtlasSaveBridge.verifySavedGame() &&
              !JSON.parse(localStorage.getItem(key)).autoPending.length) return resolve();
          if (start !== undefined && time - lastNavigation >= 1000) {
            const before = performance.now();
            const tab = timings.length % 2 ? 'field' : 'journal';
            document.querySelector('.tab[data-tab="' + tab + '"]').click();
            timings.push(performance.now() - before);
            lastNavigation = time;
          }
          requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      });
      const end = performance.now();
      const during = entries => entries.filter(e => e.start >= start && e.start <= end).map(e => e.ms);
      const tasks = during(window.auditTasks);
      const gaps = during(window.auditGaps);
      const s = JSON.parse(localStorage.getItem(key));
      return { recoveryMs: end - start, longTasks: tasks.length, longestTaskMs: Math.max(0, ...tasks),
        maxInterfaceDelayMs: Math.max(0, ...gaps), navigationMs: timings, writes: window.auditWrites,
        balances: { money: s.money, knowledge: s.knowledge, sightings: s.sightings, inventory: s.inventory },
        hourlyMax: Math.max(0, ...Object.values(s.autoHourly)), dataLength: localStorage.getItem(key).length,
        helpers: s.helpers };
    }, { key, now });
    assert.equal(result.helpers, helpers);
    assert.ok(result.hourlyMax <= 100);
    assert.deepEqual(faults, []);
    let cpu = null;
    if (profiling) {
      const { profile } = await cdp.send('Profiler.stop');
      const nodes = new Map(profile.nodes.map(node => [node.id, node.callFrame]));
      const totals = new Map();
      for (const [index, id] of profile.samples.entries()) {
        const frame = nodes.get(id);
        if (!frame?.url.includes('/js/')) continue;
        const name = frame.functionName || frame.url.split('/').at(-1) + ' (anónima)';
        totals.set(name, (totals.get(name) || 0) + profile.timeDeltas[index] / 1000);
      }
      cpu = [...totals].sort((a,b)=>b[1]-a[1]).slice(0,20).map(([name,ms])=>({name,ms}));
    }
    const heap = await cdp.send('Runtime.getHeapUsage');
    return { label, hours: elapsed, ...result, jsHeapUsedBytes: heap.usedSize, checkpoint, cpu };
  } finally {
    await context.close();
  }
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ executablePath: process.env.ATLAS_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const runs = [];
    for (const elapsed of hours) for (const helpers of teams) {
      if(selected && selected!==elapsed+':'+helpers)continue;
      const labels=side==='both'?(runs.length%4?['candidate','base']:['base','candidate']):[side];
      for(const label of labels){
        const run=await measure(browser,label,elapsed,helpers);
        runs.push(run);
        process.stderr.write(`${label} ${elapsed}h · ${helpers} naturalistas · ${run.recoveryMs.toFixed(0)} ms\n`);
      }
      if(side==='both')assert.deepEqual(runs.at(-1).balances,runs.at(-2).balances,`${elapsed} h · ${helpers} naturalistas`);
    }
    const interrupted = side !== 'base' && !selected ? await measure(browser, 'candidate', 8, 10, { crash: true }) : null;
    if (interrupted) assert.deepEqual(interrupted.balances,
      runs.find(r => r.label === 'candidate' && r.hours === 8 && r.helpers === 10).balances);
    console.log(JSON.stringify({ chromium: browser.version(), cpuSlowdown: Number(process.env.ATLAS_CPU_SLOWDOWN || 4),
      runs, interrupted }, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => server.close());
