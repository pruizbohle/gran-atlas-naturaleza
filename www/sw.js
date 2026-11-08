const CACHE='gran-atlas-v3.22.1-norteamerica-1';
const ASSETS=['./actualizar-v3221.html','./js/northamerica-polish-v3221.js','./js/lab/northamerica-art-before-v3221.js','./js/lab/northamerica-before-v3221.js','./js/lab/northamerica-audit-v3221.js','./actualizar-v3220.html','./js/pwa-update-v3220.js','./js/northamerica-data-v3220.js','./js/northamerica-art-v3220.js','./laboratorio-norteamerica-v3220.html','./js/lab/northamerica-catalog-v3220.js','./js/lab/northamerica-lab-v3220.js','./actualizar.html','./js/pwa-update-v3212.js','./js/update-client-v3212.js','./js/lab/atlas-geography-before-simple.js','./js/atlas-geography-v3211b.js','./laboratorio-atlas-v3211b.html','./js/lab/geography-lab-v3211b.js','./js/lab/atlas-ui-before-v3211b.js','./js/lab/atlas-catalog-before-v3211b.js','./css/atlas-v3211.css','./js/atlas-ui-v3211.js','./js/atlas-map-v3211.js','./laboratorio-atlas-v3211.html','./js/lab/atlas-catalog-v3211.js','./js/lab/atlas-lab-v3211.js','./css/field-v3210.css','./js/field-scene-v3210.js','./js/field-ui-v3210.js','./laboratorio-campo-v3210.html','./js/lab/field-lab-v3210.js','./js/lab/polish-review-v3199.js','./laboratorio-pulido-v3199.html','./js/relict-art-v3199.js','./js/lab/polish-before-v3198.js','./js/lab/polish-production-v3199.js','./js/lab/polish-lab-v3199.js','./laboratorio-objetos.html','./js/item-art-v3198.js','./js/lab/item-lab-v3198.js','./laboratorio-especiales.html','./js/legendary-art-v3197.js','./js/lab/special-lab-v3197.js','./laboratorio-pigmentacion.html','./js/lab/pigmentation-lab-v3196.js','./laboratorio-dimorfismo.html','./js/lab/dimorphism-production.js','./js/lab/dimorphism-lab-v3195.js','./','./index.html','./laboratorio-peces.html','./laboratorio-herpetologia.html','./laboratorio-aves.html','./laboratorio-mamiferos.html','./js/mammal-art-v3194.js','./js/lab/mammal-sprites-v3193-before.js','./js/lab/mammal-lab-v3194.js','./js/bird-art-v3193.js','./js/lab/bird-sprites-v3192b-before.js','./js/lab/bird-lab-v3193.js','./js/herp-art-v3192.js','./js/lab/herp-art-v3192-before.js','./js/lab/herp-specimens-v3192b.js','./js/fish-art-v3191.js','./css/styles.css','./js/app.js','./js/mobile-ui.js','./js/save-manager.js','./manifest.webmanifest','./icons/atlas-icon.svg','./icons/atlas-192.png','./icons/atlas-512.png'];
// Fetch a fresh, complete revision before activation; existing tabs finish their session.
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'}))))));
const assetURLs=new Set(ASSETS.map(path=>new URL(path,self.registration.scope).href));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('gran-atlas-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 url.search='';url.hash='';
 if(url.pathname===new URL('./atlas-release.json',self.registration.scope).pathname){event.respondWith(fetch(event.request,{cache:'no-store'}));return;}
 if(assetURLs.has(url.href)){
  event.respondWith(caches.open(CACHE).then(cache=>cache.match(url.href)).then(saved=>saved||fetch(event.request)));
  return;
 }
 event.respondWith(fetch(event.request).catch(()=>event.request.mode==='navigate'
  ?caches.open(CACHE).then(cache=>cache.match(new URL('./index.html',self.registration.scope).href))
  :Response.error()));
});

self.addEventListener('message',event=>{
 const type=event.data?.type;if(type!=='ATLAS_UPDATE_STATUS'&&type!=='ATLAS_APPLY_UPDATE')return;
 const source=event.source,updateURL=new URL('./actualizar.html',self.registration.scope);if(!source?.url||new URL(source.url).origin!==updateURL.origin||![new URL('./actualizar-v3221.html',self.registration.scope).pathname,updateURL.pathname,new URL('./actualizar-v3220.html',self.registration.scope).pathname].includes(new URL(source.url).pathname))return;
 event.waitUntil((async()=>{const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true}),otherClients=windows.filter(client=>client.id!==source.id&&client.url.startsWith(self.registration.scope)).length,accepted=otherClients===0;event.ports?.[0]?.postMessage({version:'3.22.1',cache:CACHE,otherClients,accepted:type==='ATLAS_APPLY_UPDATE'&&accepted});if(type==='ATLAS_APPLY_UPDATE'&&accepted)await self.skipWaiting();})());
});
