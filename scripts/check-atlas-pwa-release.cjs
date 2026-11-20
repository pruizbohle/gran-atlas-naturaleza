'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const archive = process.env.ATLAS_HISTORY_WWW || '/workspace/work/v490/reference';
const version = require('../package.json').version;
const evidence = process.env.ATLAS_EVIDENCE_DIR;
const host = '127.0.0.1';
const rollbackKeys = ['discovered', 'published', 'sightings', 'stages', 'specialFound', 'legendaryFound',
  'museum', 'inventory', 'knowledge', 'money', 'regionUnlocked'];
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
  return requests.filter(name => name.startsWith('/atlas-integrity.json') || name.includes('--melanico.webp'));
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
  assert.match(await page.title(), new RegExp('v' + version));
  if (raw !== null) {
    const previous = JSON.parse(raw);
    const current = await page.evaluate(() => AtlasSaveBridge.getSaveData());
    for (const key of rollbackKeys) assert.deepEqual(current[key], previous[key], key);
  }
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
    await page.goto(base);
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
    if (old === '4.8.1') {
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

    if (old === '4.8.2') {
      for (const kind of ['interruption', 'checksum']) {
        fault = { kind, file: '/naturalist-art/plates/64/af_manta_gigante--melanico.webp' };
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
    if (old === '4.8.2') {
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
    await update.locator('[data-mode=cartilaginous]').click();
    await update.locator('#bird-set').selectOption('manta-pigment');
    const plates = await update.locator('.taxon-comparison img').evaluateAll(imgs => Promise.all(imgs.map(async img => {
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

    announced = '4.9.1';
    // Advance only the version-check clock and dispatch focus without modifying the worker.
    await page.evaluate(() => {
      const now = Date.now;
      Date.now = () => now() + 61000;
      window.dispatchEvent(new Event('focus'));
    });
    await page.locator('#atlasUpdateNotice').waitFor();
    assert.match(await page.locator('#atlasUpdateNotice').innerText(), /Nueva versión disponible[\s\S]*4.9.0[\s\S]*4.9.1/);
    await page.locator('#atlasUpdateLater').click();
    assert.equal(await page.locator('#atlasUpdateNotice').isHidden(), true);
    await page.locator('#saveManagerOpen').click();
    const backups = page.locator('[data-cp-save]');
    if (await backups.isVisible()) await backups.click();
    await page.locator('#atlasUpdateLaunch').click();
    await page.getByText('Versión nueva disponible 4.9.1.').waitFor();
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

async function installedMigration(base) {
  serving = path.join(archive, '482', 'www');
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
      await browserTab.goto(base);
      await browserTab.waitForFunction(() => navigator.serviceWorker.controller, null, { timeout: 180000 });
      const protocol = await context.newCDPSession(browserTab);
      await protocol.send('PWA.install', { manifestId: base, installUrlOrBundleUrl: base });
      await protocol.send('PWA.changeAppUserSettings', { manifestId: base, displayMode: 'standalone' });
      const opened = context.waitForEvent('page');
      await protocol.send('PWA.launch', { manifestId: base });
      const app = await opened;
      await app.waitForLoadState();
      await app.waitForFunction(() => matchMedia('(display-mode: standalone)').matches);
      assert.match(await app.title(), /v4\.8\.2/);
      await browserTab.goto('about:blank');
      await seed(app);
      serving = 'www';
      await app.goto(base + 'actualizar-atlas.html');
      await statusText(app, /Nueva versión disponible/);
      assert.equal(await app.locator('#atlasUpdateInstalled').innerText(), '4.8.2');
      const raw = await app.evaluate(() => localStorage.getItem('gran_atlas_v05'));
      await app.locator('#atlasUpdateApply').click();
      await statusText(app, /Descarga completa e integridad verificada/);
      await finish(app, base, raw);
      assert.equal(await app.evaluate(() => matchMedia('(display-mode: standalone)').matches), true);
      if (evidence) await app.screenshot({ path: path.join(evidence, 'pwa-instalada.jpg') });
      await context.setOffline(true);
      await app.reload();
      await app.waitForFunction(() => !!window.AtlasSaveBridge && matchMedia('(display-mode: standalone)').matches);
      assert.match(await app.title(), new RegExp('v' + version));
      await context.setOffline(false);
      await protocol.send('PWA.uninstall', { manifestId: base });
      evidenceRows.push({ from: '4.8.2', to: version, installed: true, tested: [
        'PWA instalada mediante Chromium', 'ventana standalone', 'respaldo exacto', 'reapertura offline'
      ] });
      console.log('PASS PWA V4.8.2 instalada en Chromium, ventana standalone, actualización y reapertura offline');
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
        if (!process.argv.includes('--fresh-only')) {
          for (const [old, mobile] of [['4.3.0', false], ['4.8.1', true], ['4.8.2', false]]) {
            requests = [];
            await runMigration(browser, base, old, mobile);
          }
        } else {
          serving = 'www';
          requests = [];
        }
        await freshAndNotify(browser, base);
      } finally {
        await browser.close();
      }
    }
    const filename = process.argv.includes('--installed') ? 'pwa-instalada.json' :
      process.argv.includes('--fresh-only') ? 'pwa-nueva.json' : 'migraciones-pwa.json';
    if (evidence) fs.writeFileSync(path.join(evidence, filename), JSON.stringify(evidenceRows, null, 2) + '\n');
  } finally {
    server.closeAllConnections();
    server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
