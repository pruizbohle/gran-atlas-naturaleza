'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const { chromium } = require('playwright');
const evidenceDir = process.env.ATLAS_EVIDENCE_DIR || 'docs/cientifica-v474';
require('../www/js/naturalist-assets-v400.js');
const expected = vm.runInNewContext(fs.readFileSync('www/naturalist-art/catalog.js', 'utf8') +
  '\n({catalog,migrationProgress});');
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
      assert.match(await page.locator('.mixed-field').innerText(), /Zorro rojo · WebP \/ Lución europeo · SVG/);
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
      assert.equal(await page.locator('.gallery-card').count(), 749);
      await page.locator('#release-scope').selectOption('4.7.4');
      assert.equal(await page.locator('.gallery-card').count(), 44);
      assert.equal(await page.locator('.gallery-card[data-species="sa_esp_scelorchilus_rubecula"]').count(), 0);
      await page.locator('#release-scope').selectOption('4.7.3');
      assert.equal(await page.locator('.gallery-card').count(), 64);
      await page.locator('#release-scope').selectOption('catalog');
      assert.equal(await page.locator('.gallery-card').count(), 2);
      const chucao = page.locator('.gallery-card[data-species="sa_esp_scelorchilus_rubecula"]');
      await chucao.locator('img').evaluate(img => img.decode());
      await page.locator('#release-scope').selectOption('new');
      assert.equal(await page.locator('.gallery-card').count(), 1);
      await page.locator('.gallery-card[data-species="sa_esp_brachycephalus_pulex"]').click();
      assert.match(await page.locator('.comparison-styles').innerText(), /Sin lámina histórica/);
      await page.locator('.comparison-styles img').evaluate(img => img.decode());
      await page.locator('#release-scope').selectOption('');
      await page.locator('[data-mode=birds]').click();
      await page.locator('#bird-set').selectOption('passerine-tits');
      await page.locator('#comparison-size').selectOption('64');
      assert.deepEqual(await page.locator('.bird-comparison img').evaluateAll(imgs => Promise.all(imgs.map(async img => {
        await img.decode();
        return img.naturalWidth;
      }))), [64, 64]);
      await page.locator('#bird-set').selectOption('paradise-dimorphism');
      await page.locator('#comparison-size').selectOption('128');
      const sexes = page.locator('.bird-comparison img');
      const sources = await sexes.evaluateAll(imgs => Promise.all(imgs.map(async img => {
        await img.decode();
        return img.getAttribute('src');
      })));
      assert.equal(sources.length, 6);
      assert.deepEqual(sources.map(src => src.match(/\/128\/[^/]+--(male|female)\.webp$/)[1]),
        ['male', 'female', 'male', 'female', 'male', 'female']);
      if (process.argv.includes('--write-evidence')) {
        await page.locator('.bird-comparison').screenshot({ path: evidenceDir + '/dimorfismo-aves-del-paraiso-' + viewport.width + '.jpg' });
      }
      await page.locator('#bird-set').selectOption('asian-hornbills');
      await page.locator('#comparison-size').selectOption('128');
      await page.locator('#backdrop').selectOption('dark');
      const hornbills = page.locator('.bird-comparison figure');
      assert.equal(await hornbills.count(), 3);
      await hornbills.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      assert.match(await hornbills.first().innerText(), /Buceros rhinoceros[\s\S]*se curva hacia arriba/);
      if (process.argv.includes('--write-evidence')) {
        await page.locator('#comparison-size').selectOption('256');
        await hornbills.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
        await page.locator('.bird-comparison').screenshot({ path: evidenceDir + '/comparacion-calaos-' + viewport.width + '.jpg' });
      }
      await page.locator('#bird-set').selectOption('hummingbirds');
      await page.locator('#comparison-size').selectOption('64');
      const hummingbirds = page.locator('.bird-comparison img');
      assert.deepEqual(await hummingbirds.evaluateAll(imgs => Promise.all(imgs.map(async img => {
        await img.decode();
        return img.naturalWidth;
      }))), [64, 64, 64, 64]);
      await page.locator('[data-mode=gallery]').click();
      await page.locator('#group').selectOption('Corredoras y paleognatas');
      assert.equal(await page.locator('.gallery-card').count(), 9);
      await page.locator('#bird-order').selectOption('Apterygiformes');
      assert.equal(await page.locator('.gallery-card').count(), 3);
      await page.locator('#group').selectOption('Otras aves terrestres');
      assert.equal(await page.locator('.gallery-card').count(), 6);
      await page.locator('#group').selectOption('Galliformes');
      assert.equal(await page.locator('.gallery-card').count(), 24);
      await page.locator('#family').selectOption('Phasianidae');
      assert.equal(await page.locator('.gallery-card').count(), 20);
      await page.locator('[data-mode=variants]').click();
      await page.locator('#species').selectOption('asia_esp_0410');
      await page.locator('#variant-view').selectOption('sex');
      await page.locator('#comparison-halo').selectOption('Notable');
      await page.locator('#comparison-size').selectOption('128');
      await page.locator('#backdrop').selectOption('dark');
      const peafowl = page.locator('.variants .notable img');
      assert.equal(await peafowl.count(), 2);
      assert.deepEqual(await page.locator('.variants figcaption').allTextContents(), ['Macho', 'Hembra']);
      const sexAssets = await peafowl.evaluateAll(imgs => Promise.all(imgs.map(async img => {
        await img.decode();
        return [img.naturalWidth, img.src.split('--')[1], getComputedStyle(img).filter.includes('drop-shadow')];
      })));
      assert.deepEqual(sexAssets, [[128, 'male.webp', true], [128, 'female.webp', true]]);
      if (process.argv.includes('--write-evidence')) {
        await page.locator('#comparison-size').selectOption('256');
        await peafowl.evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
        await page.locator('.variants').screenshot({ path: evidenceDir + '/pavo-real-' + viewport.width + '.jpg' });
      }
      await page.locator('#variant-view').selectOption('all');
      await page.locator('#comparison-halo').selectOption('Normal');
      await page.locator('[data-mode=birds]').click();
      await page.locator('#bird-set').selectOption('kiwis');
      await page.locator('#comparison-size').selectOption('64');
      const kiwiCards = page.locator('.bird-comparison figure');
      assert.equal(await kiwiCards.count(), 3);
      assert.deepEqual(await kiwiCards.locator('img').evaluateAll(imgs => imgs.map(img => img.clientWidth)), [64, 64, 64]);
      assert.match(await kiwiCards.last().innerText(), /Apteryx owenii[\s\S]*moteado fino/);
      if (process.argv.includes('--write-evidence')) {
        await page.locator('#comparison-size').selectOption('256');
        await kiwiCards.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
        await page.locator('.bird-comparison').screenshot({ path: evidenceDir + '/comparacion-kiwis-' + viewport.width + '.jpg' });
      }
      await page.locator('#bird-set').selectOption('turkeys');
      await page.locator('#comparison-size').selectOption('128');
      const turkeys = page.locator('.bird-comparison figure');
      assert.equal(await turkeys.count(), 2);
      await turkeys.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      assert.match(await turkeys.last().innerText(), /Meleagris ocellata[\s\S]*ocelos/);
      await page.locator('[data-mode=gallery]').click();
      await page.locator('#group').selectOption('Marinas y costeras');
      assert.equal(await page.locator('.gallery-card').count(), 42);
      await page.locator('#bird-order').selectOption('Sphenisciformes');
      assert.equal(await page.locator('.gallery-card').count(), 11);
      await page.locator('#group').selectOption('Ribereñas y humedales');
      assert.equal(await page.locator('.gallery-card').count(), 50);
      await page.locator('#family').selectOption('Anatidae');
      assert.equal(await page.locator('.gallery-card').count(), 12);
      await page.locator('[data-mode=variants]').click();
      await page.locator('#species').selectOption('eu_esp_0649');
      assert.deepEqual(await page.locator('#content figcaption').allTextContents(), ['Normal', 'Macho', 'Hembra', 'Melánico']);
      await page.locator('#comparison-size').selectOption('128');
      await page.locator('#backdrop').selectOption('dark');
      const shoveler = page.locator('.variants img');
      await shoveler.evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      assert.deepEqual(await shoveler.evaluateAll(imgs => imgs.map(img => img.naturalWidth)), [128, 128, 128, 128]);
      if (process.argv.includes('--write-evidence')) {
        await page.locator('.variants').screenshot({ path: evidenceDir + '/pato-cuchara-' + viewport.width + '.jpg' });
      }
      await page.locator('[data-mode=gallery]').click();
      await page.locator('#group').selectOption('Rapaces');
      assert.equal(await page.locator('.gallery-card').count(), 49);
      await page.locator('#bird-order').selectOption('Strigiformes');
      assert.equal(await page.locator('.gallery-card').count(), 11);
      await page.locator('#family').selectOption('Tytonidae');
      assert.equal(await page.locator('.gallery-card').count(), 1);
      await page.locator('#bird-order').selectOption('Accipitriformes');
      assert.equal(await page.locator('.gallery-card').count(), 31);
      await page.locator('.gallery-card[data-species="aguila_real"]').click();
      await page.locator('#scale-plate').selectOption('legendario');
      const centinela = page.locator('.comparison-styles .legendary img');
      assert.match(await centinela.getAttribute('src'), /--centinela\.webp$/);
      await centinela.evaluate(img => img.decode());
      await page.locator('#species').selectOption('sa_esp_vultur_gryphus');
      await page.locator('[data-mode=variants]').click();
      assert.deepEqual(await page.locator('#content figcaption').allTextContents(), ['Normal', 'Macho', 'Hembra']);
      const condor = page.locator('#content .atlas-art-image');
      assert.deepEqual((await condor.evaluateAll(imgs => imgs.map(img => img.getAttribute('src'))))
        .map(src => src.split('--')[1]), ['normal.webp', 'male.webp', 'female.webp']);
      await page.locator('[data-mode=birds]').click();
      await page.locator('#bird-set').selectOption('banded-penguins');
      await page.locator('#comparison-size').selectOption('64');
      const penguinCards = page.locator('.bird-comparison figure');
      assert.equal(await penguinCards.count(), 4);
      assert.deepEqual(await penguinCards.locator('img').evaluateAll(imgs => imgs.map(img => img.clientWidth)), [64, 64, 64, 64]);
      assert.match(await penguinCards.nth(2).innerText(), /Spheniscus magellanicus[\s\S]*Dos bandas/);
      if (process.argv.includes('--write-evidence')) {
        await page.locator('#comparison-size').selectOption('256');
        await penguinCards.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
        await page.locator('.bird-comparison').screenshot({ path: evidenceDir + '/comparacion-pinguinos-' + viewport.width + '.jpg' });
      }
      await page.locator('#bird-set').selectOption('horned-owls');
      await page.locator('#comparison-size').selectOption('64');
      const owlCards = page.locator('.bird-comparison figure');
      assert.equal(await owlCards.count(), 3);
      assert.deepEqual(await owlCards.locator('img').evaluateAll(imgs => imgs.map(img => img.clientWidth)), [64, 64, 64]);
      assert.match(await owlCards.first().innerText(), /Bubo bubo[\s\S]*Ojos anaranjados/);
      await page.locator('#backdrop').selectOption('dark');
      await page.locator('#comparison-size').selectOption('256');
      await owlCards.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), viewport.width);
      if (process.argv.includes('--write-evidence')) {
        await page.locator('.bird-comparison').screenshot({ path: evidenceDir + '/comparacion-buhos-' + viewport.width + '.jpg' });
      }
      await page.locator('#backdrop').selectOption('light');
      await page.locator('[data-mode=gallery]').click();
      assert.match(await page.locator('#migration-progress').innerText(),
        new RegExp(expected.migrationProgress.migrated + ' de ' + expected.migrationProgress.total + '.*' + expected.migrationProgress.classical + " de " + expected.migrationProgress.target + " láminas científicas"));
      await page.locator('#group').selectOption('Primates');
      assert.equal(await page.locator('.gallery-card').count(), 49);
      await page.locator('#family').selectOption('Tarsiidae');
      assert.equal(await page.locator('.gallery-card').count(), 2);
      await page.locator('.gallery-card').first().click();
      assert.equal(await page.locator('.legacy-sprite svg').count(), 1);
      await page.locator('.comparison-styles img').first().evaluate(image => image.decode());
      await page.locator('#family').selectOption('');
      await page.locator('[data-mode=frames]').click();
      await page.locator('#species').selectOption('af_gorila_montana');
      const legendary = page.locator('.legendary img.atlas-art-image');
      await legendary.scrollIntoViewIfNeeded();
      await legendary.evaluate(image => image.decode());
      assert.match(await page.locator('.legendary img.atlas-art-image').getAttribute('src'), /--silverback\.webp$/);
      await page.locator('[data-mode=gallery]').click();
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
      await page.locator('#group').selectOption('Ungulados');
      assert.equal(await page.locator('.gallery-card').count(), 122);
      await page.locator('#family').selectOption('Cervidae');
      await page.locator('.gallery-card[data-species="ciervo_rojo"]').click();
      assert.equal(await page.locator('.comparison-styles figure').count(), 3);
      assert.equal(await page.locator('.legacy-sprite svg').count(), 1);
      assert.match(await page.locator('.comparison-styles').innerText(), /Sin lámina naturalista previa/);
      await page.locator('#group').selectOption('Elefantes');
      await page.locator('#species').selectOption('af_elefante_sabana');
      await page.locator('#scale-plate').selectOption('legendario');
      const atlas = page.locator('.comparison-styles .legendary img');
      await atlas.evaluate(image => image.decode());
      assert.match(await atlas.getAttribute('src'), /--atlas\.webp$/);
      assert.equal(await page.locator('.comparison-styles .legendary svg').count(), 1);
      await page.locator('[data-mode=gallery]').click();
      await page.locator('#group').selectOption('Cetáceos');
      assert.equal(await page.locator('.gallery-card').count(), 28);
      await page.locator('#family').selectOption('Iniidae');
      assert.equal(await page.locator('.gallery-card').count(), 2);
      await page.locator('.gallery-card[data-species="sa_esp_inia_geoffrensis"]').click();
      await page.locator('.comparison-styles img').evaluate(image => image.decode());
      assert.equal(await page.locator('.legacy-sprite svg').count(), 1);
      if (process.argv.includes('--write-evidence')) {
        await page.locator('.comparison-styles').screenshot({ path: evidenceDir + '/comparacion-inia-' + viewport.width + '.jpg' });
      }
      await page.locator('[data-mode=bestiary]').click();
      await page.locator('.bestiary-entry .landscape-rio').evaluate(image => image.decode());
      assert.equal(await page.locator('.bestiary-entry .landscape-oceano').count(), 0);
      await page.locator('[data-mode=gallery]').click();
      await page.locator('#group').selectOption('');
      await page.locator('#family').selectOption('');
      await page.locator('#search').fill('cuscus');
      assert.equal(await page.locator('.gallery-card').count(), 2);
      await page.locator('#search').fill('dromiciops');
      assert.equal(await page.locator('.gallery-card').count(), 1);
      await page.locator('.gallery-card').click();
      assert.equal(await page.locator('.comparison-styles figure').count(), 3);
      assert.equal(await page.locator('.comparison-styles img').count(), 2);
      assert.equal(await page.locator('.legacy-sprite svg').count(), 1);
      assert.match(await page.locator('.comparison-styles img').first().getAttribute('src'), /review\/series-4\.3\/gm06_dromiciops/);
      await page.locator('#comparison-source').selectOption('original');
      assert.equal(await page.locator('.pair figure').count(), 2);
      assert.equal(await page.locator('.pair img').count(), 2);
      assert.match(await page.locator('.pair img').first().getAttribute('src'), /review\/before\/gm06_dromiciops/);
      await page.locator('#comparison-source').selectOption('styles');
      const comparison = page.locator('.comparison-styles .plate').last();
      const light = await comparison.evaluate(node => getComputedStyle(node).backgroundColor);
      await page.locator('#backdrop').selectOption('dark');
      assert.notEqual(await comparison.evaluate(node => getComputedStyle(node).backgroundColor), light);
      if (process.argv.includes('--write-evidence')) {
        await page.locator('.comparison-styles').screenshot({ path: evidenceDir + '/comparacion-' + viewport.width + '.jpg' });
      }
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
      assert.equal(data.migration.plates, expected.migrationProgress.plates);
      assert.equal(data.results.length, expected.catalog.flatMap(sp => sp.records).length);
      assert.equal(data.results.find(r => r.note === 'Revisar hocico y cola.').status, 'Requiere ajustes');
      assert.deepEqual(await page.evaluate(() => Object.keys(localStorage)), ['gran-atlas-naturalist-art-review-v1']);
      await page.locator('#review-offline').click();
      await page.waitForFunction(() => document.querySelector('#status').textContent.includes('listas para usar sin conexión'));
      const separation = await page.evaluate(async () => {
        const names = await caches.keys();
        const study = names.find(name => name.endsWith('-review'));
        const game = names.find(name => name !== study);
        const paths = async name => (await (await caches.open(name)).keys()).map(request => new URL(request.url).pathname);
        return { game: (await paths(game)).some(path => path.includes('/review/')), study: (await paths(study)).length };
      });
      assert.equal(separation.game, false);
      assert.equal(separation.study, globalThis.AtlasNaturalistAssets.labFiles.length);
      await session.setOffline(true);
      await page.reload();
      await page.locator('[data-mode=gallery]').click();
      assert.equal(await page.locator('.gallery-card').count(), 749);
      await page.locator('#cut-state').selectOption('pending');
      assert.equal(await page.locator('.gallery-card').count(),
        expected.catalog.filter(sp => sp.records.some(record => !record.cutout)).length);
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
      console.log('PASS', viewport.width, 'px: trece modos, filtros, comparación de aves y exportación offline; primera lámina', firstRender, 'ms');
    }
  } finally { await browser.close(); server.close(); }
})().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
