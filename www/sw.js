const CACHE='gran-atlas-v3.21.1b-geografia-1';
const ASSETS=['./js/atlas-geography-v3211b.js','./laboratorio-atlas-v3211b.html','./js/lab/geography-lab-v3211b.js','./js/lab/atlas-ui-before-v3211b.js','./js/lab/atlas-catalog-before-v3211b.js','./css/atlas-v3211.css','./js/atlas-ui-v3211.js','./js/atlas-map-v3211.js','./laboratorio-atlas-v3211.html','./js/lab/atlas-catalog-v3211.js','./js/lab/atlas-lab-v3211.js','./css/field-v3210.css','./js/field-scene-v3210.js','./js/field-ui-v3210.js','./laboratorio-campo-v3210.html','./js/lab/field-lab-v3210.js','./js/lab/polish-review-v3199.js','./laboratorio-pulido-v3199.html','./js/relict-art-v3199.js','./js/lab/polish-before-v3198.js','./js/lab/polish-production-v3199.js','./js/lab/polish-lab-v3199.js','./laboratorio-objetos.html','./js/item-art-v3198.js','./js/lab/item-lab-v3198.js','./laboratorio-especiales.html','./js/legendary-art-v3197.js','./js/lab/special-lab-v3197.js','./laboratorio-pigmentacion.html','./js/lab/pigmentation-lab-v3196.js','./laboratorio-dimorfismo.html','./js/lab/dimorphism-production.js','./js/lab/dimorphism-lab-v3195.js','./','./index.html','./laboratorio-peces.html','./laboratorio-herpetologia.html','./laboratorio-aves.html','./laboratorio-mamiferos.html','./js/mammal-art-v3194.js','./js/lab/mammal-sprites-v3193-before.js','./js/lab/mammal-lab-v3194.js','./js/bird-art-v3193.js','./js/lab/bird-sprites-v3192b-before.js','./js/lab/bird-lab-v3193.js','./js/herp-art-v3192.js','./js/lab/herp-art-v3192-before.js','./js/lab/herp-specimens-v3192b.js','./js/fish-art-v3191.js','./css/styles.css','./js/app.js','./js/mobile-ui.js','./js/save-manager.js','./manifest.webmanifest','./icons/atlas-icon.svg','./icons/atlas-192.png','./icons/atlas-512.png'];
// A complete revision is installed before activation. Existing tabs finish their session.
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
const assetURLs=new Set(ASSETS.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('gran-atlas-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 url.search='';url.hash='';
 if(assetURLs.has(url.href)){
  event.respondWith(caches.open(CACHE).then(cache=>cache.match(url.href)).then(saved=>saved||fetch(event.request)));
  return;
 }
 event.respondWith(fetch(event.request).catch(()=>event.request.mode==='navigate'
  ?caches.open(CACHE).then(cache=>cache.match(new URL('./index.html',self.registration.scope).href))
  :Response.error()));
});
