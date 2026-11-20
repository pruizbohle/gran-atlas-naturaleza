'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const archive = process.env.ATLAS_HISTORY_WWW || '/workspace/work/v496/reference';
const version = require('../package.json').version;
const previous = '4.9.5';
const candidatePlate = '/naturalist-art/plates/64/deep_esp_grimpoteuthis_abyssicola--normal.webp';
const future = version.replace(/\d+$/, patch => String(Number(patch) + 1));
const evidence = process.env.ATLAS_EVIDENCE_DIR;
const host = '127.0.0.1';
const rollbackKeys = ['discovered', 'published', 'sightings', 'stages', 'specialFound', 'legendaryFound',
  'museum', 'inventory', 'knowledge', 'money', 'regionUnlocked', 'deepSurvey', 'cartography3400'];
const mime = { '.js': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
const evidenceRows = [];
let serving;
let announced = null;
let requests;
let fault;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://' + host);
  const pathname = decodeURIComponent(url.pathname);
  const resource = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
  const file = path.join(serving, resource);
  requests.push(url.pathname + url.search);
  try {
    let bytes = fs.readFileSync(file);
    if (resource === '/atlas-release.json' && announced) {
      bytes = Buffer.from(JSON.stringify({ ...JSON.parse(bytes), version: announced }));
    }
    if (fault?.file === resource) {
      if (fault.kind === 'interruption') {
        res.writeHead(200, { 'Content-Type': mime[path.extname(file)], 'Content-Length': bytes.length });
        res.write(bytes.subarray(0, 12));
        setTimeout(() => res.destroy(), 75);
        return;
      }
      bytes[bytes.length - 1] ^= 1;
    }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000',
      'Content-Length': bytes.length
    });
    res.end(bytes);
  } catch {
    res.writeHead(404, { 'Cache-Control': 'no-store' }).end();
  }
});

function candidateRequests() {
  return requests.filter(name => name.startsWith('/atlas-integrity.json') || name.startsWith(candidatePlate));
}

async function seed(page) {
  await page.waitForFunction(() => !!window.AtlasSaveBridge);
  await page.evaluate(() => {
    const save = AtlasSaveBridge.getSaveData();
    save.discovered.zorro_rojo = true;
    save.sightings.zorro_rojo = 12;
    save.stages.zorro_rojo = 5;
    save.published.zorro_rojo = true;
    save.specialFound.zorro_rojo = { Albino: true };
    const snailfish = 'abisal_esp_pseudoliparis_kermadecensis';
    save.discovered[snailfish] = true;
    save.sightings[snailfish] = 3;
    save.stages[snailfish] = 2;
    save.deepSurvey.seq = 1;
    save.deepSurvey.history = [{
      id: 1, method: 'extraordinario', region: 'abisal_fosa_oceanica_oriental',
      stratum: 'hadal_kermadec', at: Date.now() - 60000, records: { [snailfish]: 3 }
    }];
    save.money = 16215;
    save.knowledge = 2973;
    AtlasSaveBridge.restoreGame(save);
    AtlasSaveBridge.persistBeforeUpdate();
  });
}

async function verifyBackup(page, raw) {
  assert.equal(await page.evaluate(() => localStorage.getItem('gran_atlas_backup_before_update')), raw);
  assert.equal(await page.evaluate(() => localStorage.getItem('gran_atlas_v05')), raw);
  const copy = page.locator('#backup');
  assert.equal(await copy.isVisible(), raw !== null);
  if (raw !== null) {
    const bytes = await copy.evaluate(async anchor => (await fetch(anchor.href)).text());
    assert.equal(bytes, raw);
  }
}

function statusText(page, pattern, timeout = 180000) {
  return page.waitForFunction(pattern => new RegExp(pattern).test(document.getElementById('status').textContent),
    pattern.source, { timeout });
}

async function finish(page, base, raw) {
  await verifyBackup(page, raw);
  await page.locator('#atlasUpdateInstall').click();
  await statusText(page, new RegExp('Versión ' + version + ' instalada'));
  await verifyBackup(page, raw);
  await page.locator('#atlasUpdateReturn').click();
  await page.waitForURL(base + 'index.html?actualizado=' + version);
  await page.waitForFunction(() => !!window.AtlasSaveBridge);
  assert.match(await page.title(), new RegExp('v' + version.replaceAll('.', '\\.')));
  if (raw !== null) {
    const previous = JSON.parse(raw);
    const current = await page.evaluate(() => AtlasSaveBridge.getSaveData());
    for (const key of rollbackKeys) assert.deepEqual(current[key], previous[key], key);
  }
}

async function openPreparedBaseline(page, base) {
  await page.goto(base + 'actualizar-atlas.html');
  await page.locator('#atlasUpdateApply').click();
  await statusText(page, /Descarga completa e integridad verificada/);
  await page.locator('#atlasUpdateInstall').click();
  await statusText(page, /instalada\. El juego/);
  await page.locator('#atlasUpdateReturn').click();
  await page.waitForFunction(() => !!window.AtlasSaveBridge);
}

async function runMigration(browser, base, old, mobile) {
  serving = path.join(archive, old.replaceAll('.', ''), 'www');
  const context = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1366, height: 940 },
    isMobile: mobile, hasTouch: mobile, acceptDownloads: true
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const row = { from: old, to: version, mobile, tested: [] };
  try {
    if (old === previous || ['4.9.2', '4.9.3'].includes(old)) await openPreparedBaseline(page, base);
    else await page.goto(base);
    await page.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 180000 });
    assert.match(await page.title(), new RegExp('v' + old));
    await seed(page);

    serving = 'www';
    requests.length = 0;
    await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      await registration.update().catch(() => {});
      await new Promise(resolve => {
        if (!registration.installing) return resolve();
        const worker = registration.installing;
        worker.addEventListener('statechange', () => {
          if (worker.state === 'redundant' || worker.state === 'installed') resolve();
        });
      });
    });
    assert.equal(await page.evaluate(async () => Boolean((await navigator.serviceWorker.getRegistration()).waiting)), false);
    assert.deepEqual(candidateRequests(), []);
    row.tested.push('sin precarga automática');
    if (old === previous) {
      await page.evaluate(() => {
        const now = Date.now;
        Date.now = () => now() + 61000;
        window.dispatchEvent(new Event('focus'));
      });
      const notice = page.locator('#atlasUpdateNotice');
      await notice.waitFor();
      assert.ok((await notice.innerText()).includes('Disponible ' + version));
      assert.deepEqual(candidateRequests(), []);
      row.tested.push('detección real de la publicación al recuperar el foco');
    }

    if (old === '4.3.0') {
      await page.goto(base + 'actualizar.html?demo=viejo');
      assert.match(await page.title(), /3\.38\.0/);
      row.tested.push('ruta antigua estancada aun con parámetro');
    }

    const update = await context.newPage();
    update.on('pageerror', error => errors.push(error.message));
    await update.goto(base + 'actualizar-atlas.html');
    await statusText(update, /Nueva versión disponible/);
    assert.equal(await update.locator('#atlasUpdateInstalled').innerText(), old);
    assert.equal(await update.locator('#atlasUpdateAvailable').innerText(), version);
    assert.deepEqual(candidateRequests(), []);
    row.tested.push('ruta universal bajo el service worker histórico');

    const readSave = () => update.evaluate(() => localStorage.getItem('gran_atlas_v05'));
    if (old === '4.8.1' || old === previous) {
      const raw = await readSave();
      await context.setOffline(true);
      await update.locator('#atlasUpdateApply').click();
      await statusText(update, /Failed to fetch|conexión|fetch/i);
      const retained = JSON.parse(await readSave());
      for (const key of rollbackKeys) assert.deepEqual(retained[key], JSON.parse(raw)[key], key);
      assert.match(await page.title(), new RegExp('v' + old));
      await context.setOffline(false);
      row.tested.push('pérdida de conexión');
    }

    if (old === previous) {
      for (const kind of ['interruption', 'checksum']) {
        fault = { kind, file: candidatePlate };
        const active = await update.evaluate(() => navigator.serviceWorker.controller.scriptURL);
        await update.locator('#atlasUpdateApply').click();
        await statusText(update, /Se interrumpió la descarga o falló/);
        assert.equal(await update.evaluate(() => navigator.serviceWorker.controller.scriptURL), active);
        const keys = await update.evaluate(() => caches.keys());
        assert.ok(keys.some(key => key.startsWith('gran-atlas-v' + old)));
        assert.ok(keys.every(key => !key.startsWith('gran-atlas-v' + version)));
        await update.waitForFunction(() => !document.getElementById('atlasUpdateApply').disabled);
        fault = null;
      }
      row.tested.push('transferencia cortada y SHA-256 incorrecto con reversión y reintento');
    }

    await update.locator('#atlasUpdateApply').click();
    await statusText(update, /Descarga completa e integridad verificada/);
    if (evidence && mobile) await update.screenshot({ path: path.join(evidence, 'actualizador-movil.jpg') });
    await update.locator('#atlasUpdateInstall').click();
    await statusText(update, /otra pestaña o ventana/);
    row.tested.push('activación bloqueada con otra pestaña');
    await page.close();
    let raw = await readSave();
    if (old === previous) {
      await update.evaluate(() => {
        const data = JSON.parse(localStorage.getItem('gran_atlas_v05'));
        data.money += 9;
        localStorage.setItem('gran_atlas_v05', JSON.stringify(data));
      });
      raw = await readSave();
    }
    const snapshot = await update.evaluate(() => localStorage.getItem('gran_atlas_backup_before_update'));
    if (snapshot !== raw) {
      await update.locator('#atlasUpdateInstall').click();
      await statusText(update, /Se verificó un respaldo nuevo/);
      row.tested.push('respaldo renovado ante escritura concurrente');
    }
    await finish(update, base, raw);
    await context.setOffline(true);
    await update.reload();
    await update.waitForFunction(() => !!window.AtlasSaveBridge);
    await update.goto(base + 'naturalist-art/');
    await update.locator('[data-mode=freshwater]').click();
    await update.locator('#bird-set').selectOption('tigerfish');
    const images = update.locator('.taxon-comparison img');
    await images.nth(1).waitFor();
    const plates = await images.evaluateAll(imgs => Promise.all(imgs.map(async img => {
      await img.decode();
      return img.naturalWidth;
    })));
    assert.deepEqual(plates, [256, 256]);
    assert.deepEqual(errors, []);
    row.tested.push('respaldo exacto, avance restaurado, juego y laboratorio offline');
    evidenceRows.push(row);
    console.log('PASS', old, mobile ? 'móvil' : 'escritorio', row.tested.join('; '));
  } finally {
    fault = null;
    await context.close();
  }
}

async function freshAndNotify(browser, base) {
  const context = await browser.newContext({ viewport: { width: 800, height: 900 } });
  const page = await context.newPage();
  try {
    requests.length = 0;
    await page.goto(base);
    await page.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 60000 });
    assert.deepEqual(candidateRequests(), []);
    let count = requests.filter(url => url.startsWith('/atlas-release.json?')).length;
    assert.equal(count, 1);
    await page.evaluate(() => window.dispatchEvent(new Event('focus')));
    assert.equal(requests.filter(url => url.startsWith('/atlas-release.json?')).length, count);

    announced = future;
    // Advance only the version-check clock and dispatch focus without modifying the worker.
    await page.evaluate(() => {
      const now = Date.now;
      Date.now = () => now() + 61000;
      window.dispatchEvent(new Event('focus'));
    });
    await page.locator('#atlasUpdateNotice').waitFor();
    const detail = await page.locator('#atlasUpdateNotice').innerText();
    assert.ok(detail.includes('Nueva versión disponible') && detail.includes('Instalada ' + version) &&
      detail.includes('Disponible ' + future));
    await page.locator('#atlasUpdateLater').click();
    assert.equal(await page.locator('#atlasUpdateNotice').isHidden(), true);
    await page.locator('#saveManagerOpen').click();
    const backups = page.locator('[data-cp-save]');
    if (await backups.isVisible()) await backups.click();
    await page.locator('#atlasUpdateLaunch').click();
    await page.getByText('Versión nueva disponible ' + future + '.').waitFor();
    assert.equal(await page.locator('#atlasUpdatePageLink').isVisible(), true);
    assert.deepEqual(candidateRequests(), []);

  } finally {
    announced = null;
    await context.close();
  }

  const fresh = await browser.newContext();
  try {
    const update = await fresh.newPage();
    await update.goto(base + 'actualizar-atlas.html');
    await statusText(update, /Prepara esta versión/);
    await update.locator('#atlasUpdateApply').click();
    await statusText(update, /Descarga completa e integridad verificada/);
    await finish(update, base, null);
    await fresh.setOffline(true);
    await update.reload();
    await update.waitForFunction(() => !!window.AtlasSaveBridge);
    evidenceRows.push({ from: 'nueva', to: version, mobile: false, tested: ['consulta inicial', 'foco con límite', 'aviso y Más tarde', 'consulta manual', 'instalación sin partida, acceso offline'] });
    console.log('PASS instalación nueva, aviso, foco, Más tarde y búsqueda manual');
  } finally {
    await fresh.close();
  }
}

async function checkNewCatalogInGame(app) {
  const { harness } = require('../tests/helpers/live-game.cjs');
  const { records } = require('../www/js/gm07-p04/catalog.js');
  const modules = ['gm06/catalog', 'gm07-p04/catalog', 'gm07-a04/catalog', 'app'];
  const gameSource = modules.map(name => fs.readFileSync('www/js/' + name + '.js', 'utf8')).join('\n');
  const { REGIONS } = harness({}, null, { gameSource }).window.__atlasTest;
  const open = tab => app.locator('.tab[data-tab=' + tab + ']').first().evaluate(button => button.click());
  const results = [];
  await app.bringToFront();
  for (const [id, record] of Object.entries(records)) {
    const region = REGIONS.find(zone => zone.id === record.region);
    const scenario = { id, region, habitat: record.species.habitats[0], time: record.species.times.at(-1) };
    await app.evaluate(({ id, region, habitat, time }) => {
      const save = AtlasSaveBridge.getSaveData();
      Object.assign(save, { currentRegion: region.id, habitat, time, season: 'primavera', helpers: 0, lastTick: Date.now() });
      save.regionUnlocked[region.id] = true;
      delete save.discovered[id];
      delete save.sightings[id];
      delete save.stages[id];
      AtlasSaveBridge.restoreGame(save);
    }, scenario);
    await open('field');
    await app.evaluate(() => {
      const originalRandom = Math.random;
      const rolls = [0.01, 0.99999];
      Math.random = () => rolls.shift() ?? 0.5;
      try { document.querySelector('[data-action=search-manual]').click(); }
      finally { Math.random = originalRandom; }
    });
    const normal = 'img[src$="/' + id + '--normal.webp"]';
    const field = app.locator('#fieldResult ' + normal);
    await field.evaluate(img => img.decode(), undefined, { timeout: 20000 });
    const afterManual = await app.evaluate(id => AtlasSaveBridge.getSaveData().sightings[id], id);
    assert.ok(afterManual > 0, id + ' · avistamiento manual');
    const { scale, visualWidth } = await field.evaluate(img => {
      const property = '--art-visual-transform';
      const visualWidth = img.getBoundingClientRect().width;
      const original = img.style.getPropertyValue(property);
      img.style.removeProperty(property);
      const scale = visualWidth / img.getBoundingClientRect().width;
      img.style.setProperty(property, original);
      return { scale, visualWidth };
    });
    assert.ok(Math.abs(scale - (id.startsWith('asia_') ? 0.35 : 0.40)) < 0.003, id + ' · escala ' + scale);
    await app.evaluate(({ id, region }) => {
      Math.random = () => 0.24;
      const save = AtlasSaveBridge.getSaveData();
      save.helpers = 3;
      save.upgrades.autoTier = 4;
      save.lastTick = Date.now();
      const hour = Math.floor(save.lastTick / 3600000);
      save.autoHourly = Object.fromEntries(region.species.filter(key => key !== id).map(key => [hour + ':' + key, 999]));
      AtlasSaveBridge.restoreGame(save);
    }, scenario);
    const start = performance.now();
    await app.waitForFunction(({ id, afterManual }) => AtlasSaveBridge.getSaveData().sightings[id] > afterManual,
      { id, afterManual }, { timeout: 20000 });
    const automaticMs = Math.round(performance.now() - start);
    await field.evaluate(img => img.decode());
    if (evidence) await app.locator('.field-stage').screenshot({ path: path.join(evidence, id + '-campo.jpg') });
    await app.evaluate(id => {
      const save = AtlasSaveBridge.getSaveData();
      save.helpers = 0;
      save.stages[id] = 5;
      save.published[id] = true;
      save.selectedJournal = id;
      save.museum.exhibits[id] = true;
      AtlasSaveBridge.restoreGame(save);
    }, id);
    await open('journal');
    await app.locator('.j25-sheet ' + normal).first().evaluate(img => img.decode());
    await open('bestiary');
    await app.locator('#b26-search').fill(record.latin);
    await app.locator('.b26-card').filter({ has: app.locator(normal) }).click();
    await app.locator('.b26-dialog ' + normal).first().evaluate(img => img.decode());
    await app.locator('[data-action=b26-close]').click();
    await open('museum');
    await app.getByRole('tab', { name: 'Exposiciones', exact: true }).click();
    await app.locator('.m27-vitrines [data-action=m27-open]').filter({ has: app.locator(normal) }).click();
    await app.locator('.m27-dialog ' + normal).first().evaluate(img => img.decode());
    await app.locator('[data-action=m27-close]').click();
    results.push({ id, region: region.id, automaticMs, scale, visualWidth, modules: ['Campo', 'Cuaderno', 'Bestiario', 'Museo'] });
  }
  return results;
}

async function checkSurfaceInGame(app, {
  id = 'mar_esp_eretmochelys_imbricata', region = 'mar_oceano_indico_tropical',
  habitat = 'arrecife', draw = 0.01, automatic = false
} = {}) {
  await app.evaluate(({ id, region, habitat }) => {
    const save = AtlasSaveBridge.getSaveData();
    Object.assign(save, { currentRegion: region, habitat, time: 'dia', season: 'primavera',
      helpers: 0, lastTick: Date.now(), lastEncounter: null });
    save.craftedItems.world_map = true;
    save.purchases.mares_superficiales_1 = 1;
    save.regionUnlocked[region] = true;
    delete save.sightings[id];
    AtlasSaveBridge.restoreGame(save);
  }, { id, region, habitat });
  await app.locator('.tab[data-tab=field]').first().evaluate(button => button.click());
  await app.locator('[data-action=search-manual]').evaluate((button, draw) => {
    const original = Math.random;
    const rolls = [0.01, draw];
    Math.random = () => rolls.shift() ?? 0.5;
    try { button.click(); }
    finally { Math.random = original; }
  }, draw);
  const { sightings, lastEncounter } = await app.evaluate(() => AtlasSaveBridge.getSaveData());
  assert.ok(sightings[id] > 0);
  assert.equal(lastEncounter.deepEvidence, undefined);
  await app.locator('#fieldResult img[src$="/' + id + '--normal.webp"]').evaluate(img => img.decode());
  const landscape = habitat === 'oceano_abierto' ? 'oceano' : 'arrecife';
  await app.locator('.field-environment .landscape-' + landscape).evaluate(img => img.decode());
  if (automatic) {
    const sea = require('../www/js/marine-data-v3320.js');
    const other = sea.regions.find(zone => zone.id === region).species.filter(key => key !== id);
    await app.evaluate(other => {
      const save = AtlasSaveBridge.getSaveData();
      save.helpers = 3;
      save.upgrades.autoTier = 4;
      save.lastTick = Date.now();
      const hour = Math.floor(save.lastTick / 3600000);
      save.autoHourly = Object.fromEntries(other.map(key => [hour + ':' + key, 999]));
      Math.random = () => 0.24;
      AtlasSaveBridge.restoreGame(save);
    }, other);
    await app.waitForFunction(({ id, count }) => AtlasSaveBridge.getSaveData().sightings[id] > count,
      { id, count: sightings[id] }, { timeout: 20000 });
  }
  return { id, region, habitat, method: 'observación directa', automatic };
}

async function checkDeepSeaInGame(app) {
  const open = tab => app.locator('.tab[data-tab=' + tab + ']').first().evaluate(button => button.click());
  const deep = require('../www/js/deep-data-v3330.js');
  const abyss = require('../www/js/abyssal-data-v3340.js');
  const scenarios = [
    ['deep_esp_macropinna_microstoma', 'columna_mesopelagica', 'sondeo', 60, 6],
    ['deep_esp_bathypterois_grallator', 'fondo_batial', 'muestreo', 180, 0],
    ['deep_esp_grimpoteuthis_abyssicola', 'fondo_batial', 'muestreo', 180, 0],
    ['abisal_esp_pseudoliparis_swirei', 'hadal_marianas', 'extraordinario', 300, 0],
    ['abisal_esp_pseudoliparis_kermadecensis', 'hadal_kermadec', 'extraordinario', 300, 0]
  ];
  const results = [];
  for (const [id, habitat, method, seconds, seed] of scenarios) {
    const presence = [...deep.presences, ...abyss.presences].find(p => p.speciesId === id && p.habitats.includes(habitat));
    const { regionId: region } = presence;
    assert.ok(presence.methods.includes(method));
    await app.evaluate(({ id, habitat, region }) => {
      const save = AtlasSaveBridge.getSaveData();
      Object.assign(save, { currentRegion: region, habitat, time: 'dia', season: 'primavera', helpers: 0,
        money: 20000, knowledge: 7000, lastTick: Date.now() });
      Object.assign(save.purchases, { mares_superficiales_1: 1, exploracion_profunda_1: 1, exploracion_abisal_1: 1 });
      Object.assign(save.craftedItems, { world_map: true, sounding_kit: true });
      save.regionUnlocked[region] = true;
      save.lastEncounter = null;
      delete save.discovered[id];
      delete save.sightings[id];
      delete save.stages[id];
      AtlasSaveBridge.restoreGame(save);
    }, { id, habitat, region });
    await open('field');
    const control = app.locator('.deep-panel [data-action=deep-method][data-id=' + method + ']');
    await control.click();
    assert.equal(await app.locator('[data-action=search-manual]').count(), 0);
    if (habitat.startsWith('hadal_')) assert.equal(await app.locator('.abyssal-panel').count(), 1);

    const start = app.locator('.field-game [data-action=deep-start]');
    assert.equal(await start.isEnabled(), true);
    const job = await start.evaluate((button, seed) => {
      const original = Math.random;
      Math.random = () => seed / 2 ** 32;
      try { button.click(); }
      finally { Math.random = original; }
      return AtlasSaveBridge.getSaveData().deepSurvey.jobs.at(-1);
    }, seed);
    assert.equal(job.method, method);
    assert.equal(job.seed, seed);
    assert.equal(job.endAt - job.startedAt, seconds * 1000);
    try {
      // Move only the wall clock forward so the production ticker settles the paid operation.
      await app.evaluate(endAt => {
        const now = Date.now;
        Date.now = () => Math.max(now(), endAt);
        window.__atlasResetClock = () => { Date.now = now; };
      }, job.endAt);
      await app.waitForFunction(id => AtlasSaveBridge.getSaveData().deepSurvey.history.some(row => row.id === id), job.id);
    } finally {
      await app.evaluate(() => window.__atlasResetClock?.());
    }
    const state = await app.evaluate(() => AtlasSaveBridge.getSaveData());
    const receipt = state.deepSurvey.history.find(row => row.id === job.id);
    assert.ok(receipt.records[id] > 0, id);
    assert.equal(state.lastEncounter.deepEvidence.direct, false);
    if (habitat.startsWith('hadal_')) {
      assert.equal(receipt.stratum, habitat);
      assert.equal(state.lastEncounter.deepEvidence.stratum, habitat);
    }

    const image = 'img[src$="/' + id + '--normal.webp"]';
    await app.locator('#fieldResult ' + image).evaluate(img => img.decode());
    await app.locator('.field-environment .landscape-profundidades').evaluate(img => img.decode());
    if (evidence) await app.locator('.field-stage').screenshot({ path: path.join(evidence, id + '-campo.jpg') });

    if (habitat.startsWith('hadal_')) {
      const sightings = state.sightings[id];
      await app.evaluate(() => {
        const save = AtlasSaveBridge.getSaveData();
        Math.random = () => 0.24;
        save.helpers = 3;
        save.upgrades.autoTier = 4;
        save.lastTick = Date.now();
        save.autoHourly = {};
        AtlasSaveBridge.restoreGame(save);
      });
      await app.waitForFunction(({ id, sightings }) => AtlasSaveBridge.getSaveData().sightings[id] > sightings,
        { id, sightings }, { timeout: 20000 });
    }

    await app.evaluate(id => {
      const save = AtlasSaveBridge.getSaveData();
      save.helpers = 0;
      save.stages[id] = 5;
      save.published[id] = true;
      save.selectedJournal = id;
      save.museum.exhibits = { [id]: true };
      AtlasSaveBridge.restoreGame(save);
    }, id);
    await open('journal');
    await app.locator('.j25-sheet ' + image).first().evaluate(img => img.decode());
    await open('bestiary');
    await app.locator('#b26-search').fill(presence.effectiveScientific);
    await app.locator('.b26-card').filter({ has: app.locator(image) }).click();
    await app.locator('.b26-dialog ' + image).first().evaluate(img => img.decode());
    await app.locator('.b26-dialog .landscape-profundidades').first().evaluate(img => img.decode());
    await app.locator('[data-action=b26-close]').click();
    await open('museum');
    await app.getByRole('tab', { name: 'Exposiciones', exact: true }).click();
    await app.locator('.m27-vitrines [data-action=m27-open]').filter({ has: app.locator(image) }).click();
    await app.locator('.m27-dialog ' + image).first().evaluate(img => img.decode());
    await app.locator('[data-action=m27-close]').click();
    results.push({ id, habitat, method, region, seconds, automatic: habitat.startsWith('hadal_'),
      modules: ['Campo', 'Cuaderno', 'Bestiario', 'Museo'], offline: true });
  }
  return results;
}

async function legacyEntry(browser, base) {
  serving = path.join(archive, '430', 'www');
  requests = [];
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto(base);
    await page.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 180000 });
    await seed(page);
    serving = 'www';
    await page.goto(base + 'actualizar-v430.html');
    assert.match(await page.title(), /4\.3\.0/);
    const raw = await page.evaluate(() => localStorage.getItem('gran_atlas_v05'));
    await page.locator('#atlasUpdateApply').click();
    await page.waitForURL(base + 'index.html?actualizado=' + version, { timeout: 180000 });
    assert.match(await page.title(), new RegExp('v' + version.replaceAll('.', '\\.')));
    assert.equal(await page.evaluate(() => localStorage.getItem('gran_atlas_backup_before_update')), raw);
    evidenceRows.push({ from: '4.3.0', to: version, tested: ['actualizar-v430.html desde la caché histórica', 'respaldo exacto'] });
    console.log('PASS actualización desde el enlace histórico actualizar-v430.html');
  } finally {
    await context.close();
  }
}

async function installedMigration(base) {
  serving = path.join(archive, previous.replaceAll('.', ''), 'www');
  requests = [];
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-installed-'));
  try {
    const context = await chromium.launchPersistentContext(profile, {
      executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
      headless: !process.env.DISPLAY,
      args: ['--no-sandbox']
    });
    try {
      const browserTab = context.pages()[0];
      await openPreparedBaseline(browserTab, base);
      await browserTab.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 180000 });
      const protocol = await context.newCDPSession(browserTab);
      await protocol.send('PWA.install', { manifestId: base, installUrlOrBundleUrl: base });
      await protocol.send('PWA.changeAppUserSettings', { manifestId: base, displayMode: 'standalone' });
      const opened = context.waitForEvent('page');
      await protocol.send('PWA.launch', { manifestId: base });
      const app = await opened;
      await app.waitForLoadState();
      await app.waitForFunction(() => matchMedia('(display-mode: standalone)').matches);
      assert.ok((await app.title()).includes('v' + previous));
      await browserTab.goto('about:blank');
      await seed(app);
      serving = 'www';
      await app.goto(base + 'actualizar-atlas.html');
      await statusText(app, /Nueva versión disponible/);
      assert.equal(await app.locator('#atlasUpdateInstalled').innerText(), previous);
      const raw = await app.evaluate(() => localStorage.getItem('gran_atlas_v05'));
      await app.locator('#atlasUpdateApply').click();
      await statusText(app, /Descarga completa e integridad verificada/);
      await finish(app, base, raw);
      assert.equal(await app.evaluate(() => matchMedia('(display-mode: standalone)').matches), true);
      if (evidence) await app.screenshot({ path: path.join(evidence, 'pwa-instalada.jpg') });
      await context.setOffline(true);
      await app.reload();
      await app.waitForFunction(() => !!window.AtlasSaveBridge && matchMedia('(display-mode: standalone)').matches);
      assert.match(await app.title(), new RegExp('v' + version.replaceAll('.', '\\.')));
      const catalog = await checkNewCatalogInGame(app);
      const surface = await checkSurfaceInGame(app);
      const closeout = [
        await checkSurfaceInGame(app, {
          id: 'mar_esp_thunnus_albacares', habitat: 'oceano_abierto', draw: 0.945, automatic: true
        }),
        await checkSurfaceInGame(app, {
          id: 'mar_esp_amphioctopus_marginatus', region: 'mar_mar_tropical_asiatico', draw: 0.025, automatic: true
        })
      ];
      const deepSea = await checkDeepSeaInGame(app);
      await context.setOffline(false);
      await protocol.send('PWA.uninstall', { manifestId: base });
      evidenceRows.push({ from: previous, to: version, installed: true, catalog, surface, closeout, deepSea, tested: [
        'PWA instalada mediante Chromium', 'ventana standalone', 'respaldo exacto', 'reapertura offline'
      ] });
      console.log('PASS PWA ' + previous + ' instalada en Chromium, ventana standalone, actualización y reapertura offline');
    } finally {
      await context.close();
    }
  } finally {
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

(async () => {
  await new Promise(resolve => server.listen(0, host, resolve));
  const base = 'http://' + host + ':' + server.address().port + '/';
  try {
    if (process.argv.includes('--installed')) {
      await installedMigration(base);
    } else {
      const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
      try {
        if (process.argv.includes('--legacy-link')) {
          await legacyEntry(browser, base);
        } else if (!process.argv.includes('--fresh-only')) {
          for (const [old, mobile] of [['4.3.0', false], ['4.8.1', true], ['4.8.2', false], ['4.9.2', false], ['4.9.3', false], [previous, true]]) {
            requests = [];
            await runMigration(browser, base, old, mobile);
          }
        } else {
          serving = 'www';
          requests = [];
        }
        if (!process.argv.includes('--legacy-link')) await freshAndNotify(browser, base);
      } finally {
        await browser.close();
      }
    }
    const filename = process.argv.includes('--installed') ? 'pwa-instalada.json' :
      process.argv.includes('--legacy-link') ? 'enlace-historico.json' :
        process.argv.includes('--fresh-only') ? 'pwa-nueva.json' : 'migraciones-pwa.json';
    if (evidence) fs.writeFileSync(path.join(evidence, filename), JSON.stringify(evidenceRows, null, 2) + '\n');
  } finally {
    server.closeAllConnections();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
