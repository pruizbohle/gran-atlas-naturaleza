'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const archive = process.env.ATLAS_HISTORY_WWW;
const repetitions = Number(process.env.ATLAS_FIELD_REPETITIONS || 10);
const current = require('../package.json').version;
const versions = ['4.8.2', '4.9.0', current];
assert.ok(archive && Number.isInteger(repetitions) && repetitions >= 6);
const roots = new Map(versions.map(version => {
  const directory = version === current ? 'www' : path.join(archive, version.replaceAll('.', ''), 'www');
  assert.equal(JSON.parse(fs.readFileSync(path.join(directory, 'atlas-release.json'), 'utf8')).version, version);
  return [version, path.resolve(directory)];
}));
const mime = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer((request, response) => {
  try {
    const [, version, ...parts] = decodeURIComponent(new URL(request.url, 'http://atlas').pathname).split('/');
    const root = roots.get(version);
    const name = parts.join('/') || 'index.html';
    const file = path.resolve(root, name);
    if (!file.startsWith(root + path.sep)) throw Error('path');
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    response.end(fs.readFileSync(file));
  } catch {
    response.writeHead(404).end();
  }
});

const measure = page => page.evaluate(async () => {
  const start = performance.now();
  document.querySelector('.tab[data-tab=field]').click();
  const sprites = [...document.querySelectorAll('#fieldResult .atlas-art-image')];
  await Promise.all(sprites.map(img => img.decode()));
  return {
    ms: performance.now() - start,
    images: sprites.map(img => new URL(img.src).pathname.split('/').at(-1)),
    rgbaBytes: sprites.reduce((bytes, img) => bytes + 4 * img.naturalWidth * img.naturalHeight, 0),
    svg: document.querySelectorAll('#fieldResult .field-animal-sprite > svg').length
  };
});

async function benchmark(browser, url, width) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width === 390,
    hasTouch: width === 390, serviceWorkers: 'block' });
  try {
    const page = await ctx.newPage();
    await page.goto(url);
    await page.waitForFunction(() => !!window.AtlasSaveBridge);
    await page.evaluate(() => {
      const save = AtlasSaveBridge.getSaveData();
      const otter = 'nutria_europea';
      const barbel = 'eu_esp_0668';
      Object.assign(save, { currentRegion: 'HX-02-11', habitat: 'bosque', time: 'dia', season: 'primavera', helpers: 0 });
      save.regionUnlocked[save.currentRegion] = true;
      for (const id of [otter, barbel]) {
        save.discovered[id] = true;
        save.stages[id] = 5;
        save.sightings[id] = 430;
      }
      save.selectedJournal = otter;
      save.specialFound[otter] = { Albino: true, Notable: true };
      save.lastEncounter = { species: otter, title: 'Prueba de Campo', sequence: 1, entries: [
        { id: otter, amount: 3, variant: 'Albino', category: 'Notable' }, { id: barbel, amount: 2 }
      ] };
      AtlasSaveBridge.restoreGame(save);
    });
    const samples = [];
    for (let i = 0; i < 3; i++) {
      await page.locator('.tab[data-tab=journal]').first().evaluate(button => button.click());
      const start = performance.now();
      const sample = await measure(page);
      sample.driverMs = performance.now() - start;
      assert.deepEqual(sample.images, ['nutria_europea--albino.webp']);
      assert.equal(sample.svg, 1);
      samples.push(sample);
    }
    const session = await ctx.newCDPSession(page);
    await session.send('Performance.enable');
    const { metrics } = await session.send('Performance.getMetrics');
    const heapBytes = metrics.find(item => item.name === 'JSHeapUsedSize').value;
    return { initial: samples[0], repeats: samples.slice(1), heapBytes };
  } finally {
    await ctx.close();
  }
}

function stats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const center = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[center] : (sorted[center - 1] + sorted[center]) / 2;
  return { median, p90: sorted[Math.ceil(sorted.length * 0.9) - 1], min: sorted[0], max: sorted.at(-1) };
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = 'http://127.0.0.1:' + server.address().port + '/';
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
  try {
    const samples = [];
    for (const width of [390, 1280]) {
      for (let trial = 0; trial < repetitions; trial++) {
        // Rotate the execution order so build position and warm-up do not favor a release.
        for (let step = 0; step < versions.length; step++) {
          const version = versions[(step + trial) % versions.length];
          samples.push({ width, trial, version, ...await benchmark(browser, address + version + '/', width) });
        }
      }
    }
    const summary = [];
    for (const width of [390, 1280]) {
      for (const version of versions) {
        const rows = samples.filter(sample => sample.width === width && sample.version === version);
        summary.push({ width, version, initialMs: stats(rows.map(row => row.initial.ms)),
          repeatedMs: stats(rows.flatMap(row => row.repeats.map(sample => sample.ms))),
          initialDriverMs: stats(rows.map(row => row.initial.driverMs)),
          heapBytes: stats(rows.map(row => row.heapBytes)), imageRGBABytes: rows[0].initial.rgbaBytes });
      }
    }
    console.log(JSON.stringify({ chromium: browser.version(), repetitions, summary, samples }, null, 2));
  } finally {
    await browser.close();
    server.closeAllConnections();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
