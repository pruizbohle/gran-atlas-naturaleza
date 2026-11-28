'use strict';
// MEC-09D · Trabajador sin conexión vigente (www/sw.js).
// Sustituye, con el trabajador actual, las garantías de stability-v3200 «offline worker serves its immutable
// revision first and never turns missing scripts into HTML», cuyo modelo (precarga addAll) se retiró cuando el
// trabajador pasó a descarga verificada con manifiesto e instalación autorizada. Se ejecuta el archivo real
// en un contexto aislado con caché y red simuladas; los archivos servidos son los bytes reales de www/.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const WWW=path.join(__dirname,'..','www'),SW=fs.readFileSync(path.join(WWW,'sw.js'),'utf8');
const VERSION=SW.match(/RELEASE=\{version:'([^']+)'/)[1],CACHE=SW.match(/const CACHE='([^']+)'/)[1];
const scope='https://atlas.example/juego/';
function world({install=VERSION,active=false,online=true,corrupt=null,keys=[]}={}){
 const stores=new Map(keys.map(k=>[k,new Map()])),deleted=[],listeners={},requests=[],net={online};
 const store=name=>{if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return{async match(u){const r=m.get(String(u&&u.url||u));return r?r.clone():undefined;},async put(u,r){m.set(String(u&&u.url||u),r);},async add(req){m.set(req.url,new Response('review'));}};};
 const caches={async has(n){return stores.has(n);},async open(n){return store(n);},async keys(){return [...stores.keys()];},async delete(n){deleted.push(n);return stores.delete(n);}};
 async function fetch(input){const url=String(input&&input.url||input);requests.push(url);if(!net.online)throw new TypeError('offline');const rel=decodeURIComponent(new URL(url).pathname.slice(new URL(scope).pathname.length))||'index.html';const file=path.join(WWW,rel);if(!file.startsWith(WWW)||!fs.existsSync(file)||fs.statSync(file).isDirectory())return new Response('no',{status:404});let bytes=fs.readFileSync(file);if(corrupt&&rel===corrupt)bytes=Buffer.concat([bytes,Buffer.from('x')]);return new Response(bytes,{status:200});}
 const self={registration:{scope,active:active?{}:null},location:{href:scope+'sw.js'+(install?'?install='+install:'')},clients:{async claim(){},async matchAll(){return [];}},addEventListener(n,f){listeners[n]=f;},async skipWaiting(){}};
 const ctx=vm.createContext({URL,Set,Map,Promise,Request,Response,AbortController,Error,TypeError,Array,Uint8Array,Object,Boolean,Number,String,JSON,Date,crypto:globalThis.crypto,caches,fetch,self,globalThis:null,console});
 ctx.globalThis=ctx;ctx.importScripts=(...files)=>{for(const f of files)vm.runInContext(fs.readFileSync(path.join(WWW,f),'utf8'),ctx);};
 vm.runInContext(SW,ctx);
 const fire=(name,event)=>{let p;listeners[name]({...event,waitUntil(x){p=x;},respondWith(x){p=x;}});return p;};
 const get=(url,mode='cors')=>fire('fetch',{request:{method:'GET',url,mode}});
 return {stores,deleted,requests,net,fire,get,self};
}
test('MEC09D trabajador: sin autorización con trabajador activo no instala ni descarga nada',async()=>{
 const w=world({install:null,active:true});await assert.rejects(w.fire('install',{}),/autorización/);assert.equal(w.requests.length,0);assert.equal(w.stores.has(CACHE),false);
});
test('MEC09D trabajador: instalación autorizada verifica cada archivo del manifiesto y deja la revisión lista',{timeout:600000},async()=>{
 const w=world();await w.fire('install',{});const cache=w.stores.get(CACHE),manifest=JSON.parse(fs.readFileSync(path.join(WWW,'atlas-integrity.json'),'utf8'));
 assert.equal(manifest.version,VERSION);assert.ok(cache.has(new URL('index.html',scope).href));assert.ok(cache.has(new URL('js/app.js',scope).href));
 assert.equal([...cache.keys()].filter(k=>!k.includes('?complete=')).length,Object.keys(manifest.files).length);assert.ok([...cache.keys()].some(k=>k.includes('atlas-integrity.json?complete=')));
 // Sin red: los recursos se sirven desde la revisión inmutable, sin consultar la red y sin importar la consulta.
 w.net.online=false;const before=w.requests.length;
 const js=await w.get(scope+'js/app.js?v=consulta-antigua');assert.equal(await js.text(),fs.readFileSync(path.join(WWW,'js/app.js'),'utf8'));assert.equal(w.requests.length,before);
 // ART-OBJ-12: las láminas y la biblioteca comparten la revisión verificada.
 const artFiles=['MAT-N03/inventario-64','globo_celeste/clasica-512','engranaje/inventario-128','induccion/clasica-256','ARM-02/inventario-64'];
 for(const file of artFiles){
  const rel='objetos-cientificos/arte/'+file+'.webp';
  const response=await w.get(scope+rel);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join(WWW,rel)),rel);
 }
 const lab=await w.get(scope+'art-obj-12/?lote=A','navigate');
 assert.match(await lab.text(),/Biblioteca de ilustraciones/);
 // ART-CAMP-03: las treinta etapas, sus dos resoluciones y el fondo se entregan desde la caché.
 require('../www/art-camp-02/assets.js');
 const campFiles=globalThis.AtlasCampArt.files;
 assert.equal(campFiles.length,61);
 for(const file of campFiles){
  const response=await w.get(scope+file);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join(WWW,file)),file);
 }
 const campLab=await w.get(scope+'art-camp-02/','navigate');
 assert.match(await campLab.text(),/ART-CAMP-03/);
 assert.equal(w.requests.length,before);
 // Un script inexistente nunca se convierte en HTML: devuelve error de red.
 const missing=await w.get(scope+'js/no-existe.js');assert.equal(missing.type,'error');
 // Una navegación sin red cae en index.html de la revisión.
 const page=await w.get(scope+'pagina-inexistente','navigate');assert.match(await page.text(),/<!DOCTYPE html>/i);
 // Activar con la revisión lista elimina solo cachés antiguas del juego.
 w.stores.set('gran-atlas-v3.19.9-pulido-1',new Map());w.stores.set('otra-app',new Map());await w.fire('activate',{});
 assert.deepEqual(w.deleted,['gran-atlas-v3.19.9-pulido-1']);assert.ok(w.stores.has('otra-app'));assert.ok(w.stores.has(CACHE));
});
test('MEC09D trabajador: un archivo alterado aborta la descarga y no deja una revisión parcial',{timeout:600000},async()=>{
 const w=world({corrupt:'js/app.js',keys:['gran-atlas-v5.6.8-anterior']});await assert.rejects(w.fire('install',{}),/no coincide/);
 assert.equal(w.stores.has(CACHE),false);assert.ok(w.deleted.includes(CACHE));assert.ok(w.stores.has('gran-atlas-v5.6.8-anterior'),'la revisión anterior sigue disponible');
});

test('ART-OBJ-13 · una ampliación consultada queda offline sin precargar todas las de 512', async () => {
 const w=world();
 const manifest=JSON.parse(fs.readFileSync(path.join(WWW,'atlas-integrity.json'),'utf8'));
 const used='objetos-cientificos/arte/ARM-02/clasica-512.webp';
 const unused='objetos-cientificos/arte/ARM-11/clasica-512.webp';
 assert.ok(manifest.onDemand[used]);
 assert.equal(manifest.files[used],undefined);
 await w.fire('install',{});
 assert.ok(!w.requests.includes(scope+used));
 assert.ok(!w.requests.includes(scope+unused));
 const online=await w.get(scope+used);
 assert.deepEqual(Buffer.from(await online.arrayBuffer()),fs.readFileSync(path.join(WWW,used)));
 w.net.online=false;
 const requests=w.requests.length;
 const offline=await w.get(scope+used);
 assert.deepEqual(Buffer.from(await offline.arrayBuffer()),fs.readFileSync(path.join(WWW,used)));
 assert.equal(w.requests.length,requests);
 await assert.rejects(w.get(scope+unused),/offline/);
 const compact=unused.replace('clasica-512.webp','clasica-256.webp');
 const adaptive=await w.get(scope+unused+'?retina=1');
 assert.deepEqual(Buffer.from(await adaptive.arrayBuffer()),fs.readFileSync(path.join(WWW,compact)));
 assert.ok(!w.stores.get(CACHE+'-collectibles').has(scope+unused));
});
