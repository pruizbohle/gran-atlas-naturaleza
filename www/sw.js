importScripts('./js/naturalist-assets-v400.js');
const RELEASE={version:'5.5.1',manifestDigest:'e5b55cffc8e10c6d424fac1cdbb7b02a46317fbc0f25f31ba996211ad0cc0762'};
const CACHE='gran-atlas-v5.5.1-naturalist-533cbf399d70';
const CORE=['./js/iconography-v530.js','./css/iconography-v530.css','./js/beta-v560-data.js','./css/frame-v550.css','./css/campamento-fondo-v551.css','./img/campamento-fondo.webp','./js/frame-v550.js','./iconoteca/biblioteca.html','./iconoteca/biblioteca.css','./iconoteca/biblioteca.js','./iconoteca/library-data.js','./iconoteca/arte/ancient_coin.webp','./iconoteca/arte/fossil_tooth.webp','./iconoteca/arte/field_telescope.webp','./iconoteca/arte/parchment_scrap.webp','./iconoteca/arte/brass_compass.webp','./iconoteca/arte/sturdy_pack.webp','./iconoteca/arte/feather_cap.webp','./iconoteca/arte/rain_hood.webp','./iconoteca/arte/amulet.webp','./iconoteca/arte/amber_charm.webp','./iconoteca/arte/shell_necklace.webp','./iconoteca/arte/fossil_skull.webp','./iconoteca/arte/bone_short.webp','./iconoteca/arte/bone_long.webp','./iconoteca/arte/carnivore_skull.webp','./iconoteca/arte/herbivore_skull.webp','./iconoteca/arte/fossil_plate.webp','./iconoteca/arte/fossil_sail.webp','./iconoteca/arte/animal_trace.webp','./iconoteca/arte/map_fragment.webp','./iconoteca/arte/asia_map_piece.webp','./iconoteca/arte/asia_map.webp','./iconoteca/arte/africa_map_piece.webp','./iconoteca/arte/africa_map.webp','./iconoteca/arte/north_america_map_piece.webp','./iconoteca/arte/north_america_map.webp','./iconoteca/arte/heron_feather.webp','./iconoteca/arte/brass_shard.webp','./iconoteca/arte/old_ink.webp','./iconoteca/arte/carved_wood.webp','./iconoteca/arte/wolf_tooth.webp','./iconoteca/arte/owl_feather.webp','./iconoteca/arte/antler_fragment.webp','./iconoteca/arte/otter_whisker.webp','./iconoteca/arte/boar_tusk.webp','./iconoteca/arte/beaver_tail_scale.webp','./iconoteca/arte/scholar_hat.webp','./iconoteca/arte/museum_medallion.webp','./iconoteca/arte/river_pearl.webp','./iconoteca/arte/fossil_track.webp','./iconoteca/arte/fossil_claw.webp','./iconoteca/arte/fossil_rib.webp','./iconoteca/arte/fossil_horn.webp','./iconoteca/arte/hard_bone.webp','./iconoteca/arte/polar_coat.webp','./iconoteca/arte/south_america_map_piece.webp','./iconoteca/arte/south_america_map.webp','./iconoteca/arte/oceania_map_piece.webp','./iconoteca/arte/oceania_map.webp','./iconoteca/arte/polar_map_piece.webp','./iconoteca/arte/polar_map.webp','./iconoteca/arte/world_map.webp','./iconoteca/arte/asian_spices.webp','./iconoteca/arte/asian_trade_folio.webp','./iconoteca/arte/african_textile_sample.webp','./iconoteca/arte/north_american_trade_document.webp','./iconoteca/arte/south_american_cacao.webp','./iconoteca/arte/oceanian_nacre.webp','./iconoteca/arte/polar_geology_record.webp','./iconoteca/arte/atlas-total.webp','./iconoteca/arte/atlas.webp','./iconoteca/arte/bestiario.webp','./iconoteca/arte/binoculars.webp','./iconoteca/arte/biome-arrecife.webp','./iconoteca/arte/biome-bosque.webp','./iconoteca/arte/biome-costa.webp','./iconoteca/arte/biome-desierto.webp','./iconoteca/arte/biome-estepa.webp','./iconoteca/arte/biome-hadal.webp','./iconoteca/arte/biome-humedal.webp','./iconoteca/arte/biome-mediterraneo.webp','./iconoteca/arte/biome-montana.webp','./iconoteca/arte/biome-oceano.webp','./iconoteca/arte/biome-polar.webp','./iconoteca/arte/biome-pradera.webp','./iconoteca/arte/biome-profundo.webp','./iconoteca/arte/biome-rio.webp','./iconoteca/arte/biome-sabana.webp','./iconoteca/arte/biome-selva.webp','./iconoteca/arte/brujula.webp','./iconoteca/arte/campamento.webp','./iconoteca/arte/campo.webp','./iconoteca/arte/coleccionables.webp','./iconoteca/arte/comercio.webp','./iconoteca/arte/comparativo.webp','./iconoteca/arte/conocimiento.webp','./iconoteca/arte/conservacion.webp','./iconoteca/arte/corona.webp','./iconoteca/arte/cuaderno.webp','./iconoteca/arte/encargos.webp','./iconoteca/arte/excavacion.webp','./iconoteca/arte/expediciones.webp','./iconoteca/arte/exploracion.webp','./iconoteca/arte/exposiciones.webp','./iconoteca/arte/field_hat.webp','./iconoteca/arte/fosiles.webp','./iconoteca/arte/fossil_amber.webp','./iconoteca/arte/fossil_fragment.webp','./iconoteca/arte/huellas.webp','./iconoteca/arte/indicios.webp','./iconoteca/arte/inventario.webp','./iconoteca/arte/investigacion.webp','./iconoteca/arte/libras.webp','./iconoteca/arte/logros.webp','./iconoteca/arte/monografias.webp','./iconoteca/arte/muestras.webp','./iconoteca/arte/museo.webp','./iconoteca/arte/naturalistas.webp','./iconoteca/arte/navegacion.webp','./iconoteca/arte/oceanic_quadrant.webp','./iconoteca/arte/polished_lens.webp','./iconoteca/arte/pressed_flower.webp','./iconoteca/arte/prestigio.webp','./iconoteca/arte/registro-cientifico.webp','./iconoteca/arte/relictos.webp','./iconoteca/arte/river_pebble.webp','./iconoteca/arte/sociedad.webp','./iconoteca/arte/sounding_kit.webp','./iconoteca/arte/taller.webp','./iconoteca/arte/tomos.webp','./actualizar-atlas.html','./js/atlas-pwa-update.js','./css/atlas-pwa-update.css','./actualizar-v482.html','./actualizar-v481.html','./actualizar-v480.html','./actualizar-v474.html','./actualizar-v473.html','./js/gm07-p04/catalog.js','./js/gm07-a04/catalog.js','./actualizar-v472.html','./actualizar-v471.html','./actualizar-v470.html','./actualizar-v460.html','./actualizar-v450.html','./actualizar-v440.html','./actualizar-v430.html','./actualizar-v421.html','./actualizar-v420.html','./actualizar-v410.html','./actualizar-v400.html','./css/naturalist-art-v400.css','./js/naturalist-art-v400.js','./js/naturalist-assets-v400.js','./naturalist-art/','./naturalist-art/index.html','./naturalist-art/lab.css','./naturalist-art/lab.js','./naturalist-art/catalog.js','./naturalist-art/art01.js','./naturalist-art/art02.js','./naturalist-art/art03.js','./naturalist-art/art04.js','./naturalist-art/art05.js','./naturalist-art/art06.js','./naturalist-art/art07.js','./naturalist-art/art08.js','./naturalist-art/plate-view.js','./naturalist-art/legendary-view.js','./laboratorio-relictos.html','./naturalist-art/relict-catalog.js','./naturalist-art/relict-review.js','./naturalist-art/pigment-audit-data.js','./naturalist-art/pigment-audit.js','./actualizar-v3450.html','./laboratorio-marsupiales-monotremas.html','./js/gm07-m01/art.js','./actualizar-v3440.html','./laboratorio-cartografia-gm06.html','./js/gm06/catalog.js','./js/gm06/geography.js','./js/gm06/art.js','./laboratorio-campamento-perfil-v3430.html','./actualizar-v3430.html','./css/campamento-perfil-v3430.css','./js/campamento-perfil-ui-v3430.js','./actualizar-v3420.html','./actualizar-v3410.html','./laboratorio-experiencia-v3410.html','./js/lab/experience-lab-v3410.js','./js/experience-v3410.js','./css/experience-v3410.css','./actualizar-v3400.html','./laboratorio-inventario-v3400.html','./js/lab/inventory-lab-v3400.js','./css/inventory-v3400.css','./actualizar-v3390.html','./laboratorio-logistica-v3390.html','./js/lab/logistics-lab-v3390.js','./actualizar-v3380.html','./laboratorio-museo-v3380.html','./js/museum-curation-v3380.js','./js/museum-curation-ui-v3380.js','./js/lab/museum-curation-lab-v3380.js','./css/museum-curation-v3380.css','./actualizar-v3370.html','./laboratorio-misiones-v3370.html','./js/commissions-v3370.js','./js/commissions-ui-v3370.js','./js/lab/commissions-lab-v3370.js','./css/commissions-v3370.css','./actualizar-v3360.html','./laboratorio-sociedad-v3360.html','./js/achievements-v3360.js','./js/society-achievements-ui-v3360.js','./js/lab/society-lab-v3360.js','./css/society-v3360.css','./actualizar-v3350.html','./laboratorio-mundial-v3350.html','./js/lab/world-lab-v3350.js','./js/abyssal-data-v3340.js','./js/abyssal-geography-v3340.js','./js/abyssal-art-v3340.js','./js/lab/abyssal-lab-v3340.js','./laboratorio-abisal-v3340.html','./actualizar-v3340.html','./css/abyssal-v3340.css','./js/deep-data-v3330.js','./js/deep-geography-v3330.js','./js/deep-art-v3330.js','./js/lab/deep-lab-v3330.js','./laboratorio-profundo-v3330.html','./actualizar-v3330.html','./css/deep-v3330.css','./js/marine-data-v3320.js','./js/marine-geography-v3320.js','./js/marine-art-v3320.js','./js/lab/marine-lab-v3320.js','./laboratorio-marino-v3320.html','./actualizar-v3320.html','./css/marine-v3320.css','./css/polar-v3310.css','./js/polar-data-v3310.js','./js/polar-geography-v3310.js','./js/polar-art-v3310.js','./laboratorio-polar-v3310.html','./actualizar-v3310.html','./actualizar-v3300.html','./laboratorio-comercio-v3300.html','./js/lab/commerce-lab-v3300.js','./css/commerce-v3300.css',"./actualizar-v3290.html","./js/oceania-runtime-v3290.js","./js/oceania-art-v3290.js","./js/oceania-geography-v3290.js","./laboratorio-oceania-v3290.html","./laboratorio-arte-oceania-v3290.html","./js/oceania-data-v3290.js","./js/lab/oceania-map-v3290.js","./js/lab/oceania-catalog-v3290.js","./js/lab/oceania-art-lab-v3290.js",'./actualizar-v3280.html','./css/expeditions-research-v3280.css','./js/expeditions-research-ui-v3280.js','./laboratorio-expediciones-investigaciones-v3280.html','./js/lab/expeditions-research-lab-v3280.js','./js/lab/expeditions-app-before-v3270.js','./actualizar-v3270.html','./css/museum-v3270.css','./js/museum-ui-v3270.js','./laboratorio-museo-v3270.html','./js/lab/museum-lab-v3270.js','./js/lab/museum-app-before-v3260.js','./actualizar-v3260b.html','./js/pwa-update-v3260.js','./css/bestiary-v3260.css','./js/bestiary-ui-v3260.js','./laboratorio-bestiario-v3260.html','./js/lab/bestiary-lab-v3260.js','./js/lab/bestiary-app-before-v3250.js','./actualizar-v3260.html','./css/journal-v3250.css','./js/journal-ui-v3250.js','./laboratorio-cuaderno-v3250.html','./js/lab/journal-lab-v3250.js','./js/lab/journal-app-before-v3240.js','./actualizar-v3250.html','./actualizar-v3240.html','./actualizar-v3231.html','./js/southamerica-polish-v3231.js','./js/lab/southamerica-art-before-v3231.js','./js/lab/southamerica-before-v3231.js','./js/lab/southamerica-audit-v3231.js','./actualizar-v3230.html','./js/southamerica-data-v3230.js','./js/southamerica-art-v3230.js','./js/southamerica-geography-v3230.js','./laboratorio-sudamerica-v3230.html','./js/lab/southamerica-catalog-v3230.js','./js/lab/southamerica-lab-v3230.js','./actualizar-v3221.html','./js/northamerica-polish-v3221.js','./js/lab/northamerica-art-before-v3221.js','./js/lab/northamerica-before-v3221.js','./js/lab/northamerica-audit-v3221.js','./actualizar-v3220.html','./js/pwa-update-v3220.js','./js/northamerica-data-v3220.js','./js/northamerica-art-v3220.js','./laboratorio-norteamerica-v3220.html','./js/lab/northamerica-catalog-v3220.js','./js/lab/northamerica-lab-v3220.js','./actualizar.html','./js/pwa-update-v3212.js','./js/update-client-v3212.js','./js/lab/atlas-geography-before-simple.js','./js/atlas-geography-v3211b.js','./laboratorio-atlas-v3211b.html','./js/lab/geography-lab-v3211b.js','./js/lab/atlas-ui-before-v3211b.js','./js/lab/atlas-catalog-before-v3211b.js','./css/atlas-v3211.css','./js/atlas-ui-v3211.js','./js/atlas-map-v3211.js','./laboratorio-atlas-v3211.html','./js/lab/atlas-catalog-v3211.js','./js/lab/atlas-lab-v3211.js','./css/field-v3210.css','./js/field-scene-v3210.js','./js/field-ui-v3210.js','./laboratorio-campo-v3210.html','./js/lab/field-lab-v3210.js','./js/lab/polish-review-v3199.js','./laboratorio-pulido-v3199.html','./js/relict-art-v3199.js','./js/lab/polish-before-v3198.js','./js/lab/polish-production-v3199.js','./js/lab/polish-lab-v3199.js','./laboratorio-objetos.html','./js/item-art-v3198.js','./js/lab/item-lab-v3198.js','./laboratorio-especiales.html','./js/legendary-art-v3197.js','./js/lab/special-lab-v3197.js','./laboratorio-pigmentacion.html','./js/lab/pigmentation-lab-v3196.js','./laboratorio-dimorfismo.html','./js/lab/dimorphism-production.js','./js/lab/dimorphism-lab-v3195.js','./','./index.html','./laboratorio-peces.html','./laboratorio-herpetologia.html','./laboratorio-aves.html','./laboratorio-mamiferos.html','./js/mammal-art-v3194.js','./js/lab/mammal-sprites-v3193-before.js','./js/lab/mammal-lab-v3194.js','./js/bird-art-v3193.js','./js/lab/bird-sprites-v3192b-before.js','./js/lab/bird-lab-v3193.js','./js/herp-art-v3192.js','./js/lab/herp-art-v3192-before.js','./js/lab/herp-specimens-v3192b.js','./js/fish-art-v3191.js','./css/styles.css','./js/app.js','./js/mobile-ui.js','./js/save-manager.js','./manifest.webmanifest','./icons/atlas-icon.svg','./icons/atlas-192.png','./icons/atlas-512.png'];
const scope = new URL(self.registration.scope);
const scopedURL = path => new URL(path, scope).href;
const canonicalURL = path => {
  const url = new URL(path, scope);
  url.search = '';
  url.hash = '';
  if (url.pathname.endsWith('/')) url.pathname += 'index.html';
  return url.href;
};
const assetURLs = new Set([...CORE, ...globalThis.AtlasNaturalistAssets.files, ...globalThis.AtlasNaturalistAssets.relictFiles].map(canonicalURL));
const REVIEW_CACHE = CACHE + '-review';
const reviewURLs = new Set(globalThis.AtlasNaturalistAssets.labFiles.map(scopedURL));
const manifestURL = scopedURL('atlas-integrity.json');
const releaseURL = scopedURL('atlas-release.json');
const updaterURL = scopedURL('actualizar-atlas.html');
const updaterAssets = new Set(['js/atlas-pwa-update.js', 'css/atlas-pwa-update.css'].map(scopedURL));
const updaterPaths = new Set(CORE.filter(path => /^\.\/actualizar(?:-[a-z\d]+)?\.html$/.test(path)).map(scopedURL));
const readyMarker = scopedURL('atlas-integrity.json?complete=' + RELEASE.manifestDigest);
const installParams = new URL(self.location.href).searchParams;
// Earlier updater pages register ?v only after the player clicks their update button.
const authorized = [installParams.get('install'), installParams.get('v')].includes(RELEASE.version);

async function cached(cacheName, url) {
  const cache = await caches.has(cacheName) ? await caches.open(cacheName) : null;
  return cache?.match(url);
}

async function ready() {
  return Boolean(await cached(CACHE, readyMarker));
}

async function controlledWindows() {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  return windows.filter(client => client.url.startsWith(scope.href));
}

async function report(progress) {
  for (const client of await controlledWindows()) {
    if (updaterPaths.has(canonicalURL(client.url))) {
      client.postMessage({ type: 'ATLAS_UPDATE_PROGRESS', version: RELEASE.version, ...progress });
    }
  }
}

async function sha256(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), value => value.toString(16).padStart(2, '0')).join('');
}

async function fetchVerified(url, digest, size, signal) {
  const response = await fetch(url, { cache: 'no-store', signal });
  if (!response.ok) throw Error('El servidor no entregó ' + new URL(url).pathname);
  const bytes = await response.clone().arrayBuffer();
  if ((size !== undefined && bytes.byteLength !== size) || await sha256(bytes) !== digest) {
    throw Error('Un archivo no coincide con la revisión publicada.');
  }
  return response;
}

async function downloadOffline() {
  if (await ready()) return;
  const abort = new AbortController();
  try {
    const manifestResponse = await fetchVerified(manifestURL, RELEASE.manifestDigest, undefined, abort.signal);
    const { version, files } = await manifestResponse.json();
    const entries = Object.entries(files);
    if (version !== RELEASE.version || entries.length !== assetURLs.size ||
        entries.some(([path]) => !assetURLs.has(scopedURL(path)))) throw Error('La lista de archivos no coincide con esta versión.');
    const download = await caches.open(CACHE);
    const totalBytes = entries.reduce((sum, [, resource]) => sum + resource[0], 0);
    let complete = 0;
    let bytes = 0;
    let lastReport = Date.now();
    let next = 0;
    await report({ complete, total: entries.length, bytes, totalBytes });
    async function fetchNext() {
      try {
        while (!abort.signal.aborted && next < entries.length) {
          const [path, [size, digest]] = entries[next++];
          const url = scopedURL(path);
          const response = await fetchVerified(url, digest, size, abort.signal);
          await download.put(url, response);
          complete += 1;
          bytes += size;
          if (Date.now() - lastReport >= 300 || complete === entries.length) {
            lastReport = Date.now();
            await report({ complete, total: entries.length, bytes, totalBytes });
          }
        }
      } catch (error) {
        abort.abort();
        throw error;
      }
    }
    const results = await Promise.allSettled(Array.from({ length: 12 }, fetchNext));
    const failed = results.find(result => result.status === 'rejected' && result.reason.name !== 'AbortError');
    if (failed || complete !== entries.length) throw failed?.reason || Error('Se interrumpió la descarga.');
    await download.put(readyMarker, new Response('ok'));
  } catch (error) {
    await caches.delete(CACHE);
    await report({ terminal: 'Se interrumpió la descarga o falló la comprobación de archivos.' });
    throw error;
  }
}

self.addEventListener('install', event => {
  if (authorized) {
    event.waitUntil(downloadOffline());
  } else if (self.registration.active) {
    // Browser-driven update checks must leave the current worker in place until explicit authorization.
    event.waitUntil(Promise.reject(new Error('La actualización necesita autorización.')));
  }
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    if (authorized && await ready()) {
      const names = await caches.keys();
      await Promise.all(names.filter(name => name.startsWith('gran-atlas-') && name !== CACHE && name !== REVIEW_CACHE)
        .map(name => caches.delete(name)));
    }
    await self.clients.claim();
  })());
});

async function cacheReview(event) {
  const source = event.source?.url;
  const port = event.ports?.[0];
  if (!source?.startsWith(scopedURL('naturalist-art/')) || !port) return;
  try {
    if (!await ready()) {
      port.postMessage({ needsOffline: true });
      return;
    }
    const cache = await caches.open(REVIEW_CACHE);
    const files = [...reviewURLs];
    let complete = 0;
    async function download() {
      for (let url; (url = files.shift());) {
        if (!await cache.match(url)) await cache.add(new Request(url, { cache: 'reload' }));
        port.postMessage({ complete: ++complete, total: reviewURLs.size });
      }
    }
    await Promise.all(Array.from({ length: 6 }, download));
    port.postMessage({ done: true, total: reviewURLs.size });
  } catch {
    port.postMessage({ failed: true });
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== scope.origin) return;
  const canonical = canonicalURL(url);
  if (canonical === releaseURL || canonical === manifestURL) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }));
  } else if (canonical === updaterURL || (updaterAssets.has(canonical) && url.searchParams.has('entrada'))) {
    event.respondWith(fetch(event.request, { cache: 'no-store' }).catch(async () =>
      await cached(CACHE, canonical) || Response.error()));
  } else if (assetURLs.has(canonical)) {
    // A bootstrap worker for a clean visit keeps the online app installable without caching the full atlas.
    event.respondWith((async () => await cached(CACHE, canonical) || fetch(event.request))());
  } else if (reviewURLs.has(canonical)) {
    event.respondWith((async () => {
      const cache = await caches.open(REVIEW_CACHE);
      const saved = await cache.match(canonical);
      if (saved) return saved;
      const response = await fetch(event.request);
      if (response.ok) await cache.put(canonical, response.clone()).catch(() => {});
      return response;
    })());
  } else {
    event.respondWith(fetch(event.request).catch(async () =>
      event.request.mode === 'navigate' && await cached(CACHE, scopedURL('index.html')) || Response.error()));
  }
});

self.addEventListener('message', event => {
  const type = event.data?.type;
  if (type === 'ATLAS_CACHE_NATURALIST_REVIEW') {
    event.waitUntil(cacheReview(event));
    return;
  }
  const source = event.source;
  if (!source?.url || !updaterPaths.has(canonicalURL(source.url))) return;
  if (type !== 'ATLAS_UPDATE_STATUS' && type !== 'ATLAS_APPLY_UPDATE') return;
  event.waitUntil((async () => {
    const verified = await ready();
    const others = (await controlledWindows()).filter(client => client.id !== source.id);
    const accepted = type === 'ATLAS_APPLY_UPDATE' && verified && others.length === 0;
    event.ports?.[0]?.postMessage({
      version: RELEASE.version, cache: CACHE, ready: verified, otherClients: others.length, accepted
    });
    if (accepted) await self.skipWaiting();
  })());
});
