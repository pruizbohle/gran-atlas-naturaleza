'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const {harness}=require('./helpers/live-game.cjs'),{catalogSource}=require('./helpers/catalog.cjs'),golden=require('./fixtures/stability-v3199.json'),source=fs.readFileSync('www/js/app.js','utf8');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
test('entire catalog, 3473 sprite combinations and seven art modules remain exactly unchanged',()=>{
 assert.equal(hash(catalogSource(source)),golden.catalog);const c=vm.createContext({});for(const n of Object.keys(golden.modules)){const file=fs.readFileSync('www/js/'+n+'.js');assert.equal(hash(file),golden.modules[n],n);vm.runInContext(file.toString(),c);}
 vm.runInContext(catalogSource(source)+'\n'+source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'))+'\napi={SPECIES,SEXUAL_DIMORPHISM,getSpriteMarkup};',c);let all='';for(const id of Object.keys(c.api.SPECIES))for(const skin of ['normal','albino','melanico','alfa','epico','excepcional','legendario'])all+=id+skin+c.api.getSpriteMarkup(id,skin);for(const id of Object.keys(c.api.SEXUAL_DIMORPHISM))for(const sex of ['male','female'])all+=id+sex+c.api.getSpriteMarkup(id,'normal',sex);assert.equal(hash(all),golden.sprites);
});
test('an unreadable stored save survives startup and ticks verbatim, and a valid import can recover it',()=>{
 for(const raw of ['{damaged','null','[]']){const store={gran_atlas_v05:raw},h=harness(store);h.tick();assert.equal(store.gran_atlas_v05,raw);assert.match(h.elements.saveManagerStatus.textContent,/conserva sin reemplazar/);const data=h.window.__atlasTest.initialState();data.money=9876;h.window.AtlasSaveBridge.restoreGame(data);h.tick();assert.equal(JSON.parse(store.gran_atlas_v05).money,9876);}
});
test('storage failure keeps the live session exportable and failed imports roll back in memory',async()=>{
 const h=harness(),a=h.window.__atlasTest;h.localStorage.setItem=()=>{throw new Error('QuotaExceededError');};a.state.money=5678;a.state.inventory.fossil_fragment=77;assert.equal(a.persist(),false);assert.doesNotThrow(()=>h.tick());assert.equal(a.state.money,5678);const imported=a.initialState();imported.money=99999;assert.throws(()=>h.window.AtlasSaveBridge.restoreGame(imported),/No se pudo guardar/);assert.equal(a.state.money,5678);
 let exported;h.window.Capacitor.Plugins.AtlasExport.saveFile=async({content})=>{exported=JSON.parse(content);return {uri:'content://test'};};await h.elements.saveDownloadBtn.fire('click');assert.equal(exported.game.money,5678);assert.equal(exported.game.inventory.fossil_fragment,77);assert.equal(exported.gameVersion,'3.21.1b');
 h.localStorage.setItem=(key,value)=>h.store[key]=String(value);assert.equal(a.persist(),true);assert.equal(JSON.parse(h.store.gran_atlas_v05).money,5678);
});
test('representative advanced exports and restores preserve all progress subsystems',async()=>{
 const h=harness(),a=h.window.__atlasTest,s=a.state;for(const id of Object.keys(a.SPECIES)){s.discovered[id]=true;s.sightings[id]=100000;s.stages[id]=5;s.published[id]=true;}s.inventory={fossil_fragment:55,north_america_map:1,field_telescope:1};s.equipment.instrument='field_telescope';for(const l of a.LEGENDARY_SPECIMENS)a.recordSpecimen(l.speciesId,{pigment:'Albino',category:'Legendario'},s);for(const r of a.MUSEUM_RELICTS)s.museum.relicts[r.id]=true;s.sexSeen.reno={male:true,female:true};s.dimorphism.reno=true;a.persist();
 const before=h.window.AtlasSaveBridge.getSaveData();let exported;h.window.Capacitor.Plugins.AtlasExport.saveFile=async({content})=>{exported=JSON.parse(content);return {uri:'content://test'};};await h.elements.saveDownloadBtn.fire('click');const next=harness();next.window.AtlasSaveBridge.restoreGame(exported.game);next.tick();const after=next.window.AtlasSaveBridge.getSaveData();for(const key of ['discovered','sightings','stages','published','inventory','equipment','sexSeen','dimorphism','specialFound','legendaryFound','purchases','museum','voyages'])assert.deepEqual(after[key],before[key],key);
});
test('seeded automatic stress at 1s, 1h and 8h matches every saved byte and RNG call of v3.19.9',()=>{
 const {advanced}=require('./helpers/advanced-v3200.cjs'),expected=require('./fixtures/advanced-behavior-v3199.json');for(const [seconds,golden]of Object.entries(expected)){const result=advanced(Number(seconds));assert.equal(hash(JSON.stringify(result.state)),golden.hash,'complete state '+seconds+'s');assert.equal(result.calls,golden.rngCalls,'random draws '+seconds+'s');}
});
test('offline worker serves its immutable revision first and never turns missing scripts into HTML',async()=>{
 const callbacks={},cache=new Map(),scope='https://atlas.example/game/',deleted=[],version='gran-atlas-v3.21.1b-simple-2';let fetches=0;
 const storage={async addAll(assets){for(const asset of assets)cache.set(new URL(asset,scope).href,'cached:'+asset);},async match(key){return cache.get(String(key));}};
 const ctx=vm.createContext({URL,Set,Promise,Response,self:{registration:{scope},location:{origin:'https://atlas.example'},clients:{async claim(){}},addEventListener(name,fn){callbacks[name]=fn;}},caches:{async open(){return storage;},async keys(){return [version,'gran-atlas-v3.19.9-pulido-1','unrelated'];},async delete(key){deleted.push(key);}},async fetch(){fetches++;throw new Error('offline');}});
 vm.runInContext(fs.readFileSync('www/sw.js','utf8'),ctx);let install;callbacks.install({waitUntil(p){install=p;}});await install;
 let response;callbacks.fetch({request:{method:'GET',url:scope+'js/app.js?v=old-query',mode:'cors'},respondWith(p){response=p;}});assert.equal(await response,'cached:./js/app.js');assert.equal(fetches,0);
 callbacks.fetch({request:{method:'GET',url:scope+'missing.js',mode:'cors'},respondWith(p){response=p;}});assert.equal((await response).type,'error');
 callbacks.fetch({request:{method:'GET',url:scope+'missing-page',mode:'navigate'},respondWith(p){response=p;}});assert.equal(await response,'cached:./index.html');
 let activate;callbacks.activate({waitUntil(p){activate=p;}});await activate;assert.deepEqual(deleted,['gran-atlas-v3.19.9-pulido-1']);
 assert.doesNotMatch(fs.readFileSync('www/sw.js','utf8'),/skipWaiting|cache\.put/);
});
test('denied storage reads protect the unknown disk save while current in-memory progress remains exportable',async()=>{
 const store={gran_atlas_v05:'previous unreadable-by-policy save'},h=harness(store,null,{storageReadError:true}),a=h.window.__atlasTest;a.state.money=321;assert.equal(a.persist(),false);assert.equal(store.gran_atlas_v05,'previous unreadable-by-policy save');let backup;h.window.Capacitor.Plugins.AtlasExport.saveFile=async({content})=>{backup=JSON.parse(content);return {uri:'content://test'};};await h.elements.saveDownloadBtn.fire('click');assert.equal(backup.game.money,321);
});
