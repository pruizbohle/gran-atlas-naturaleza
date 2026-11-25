'use strict';
// MEC-09D §7 · Consolidación de funciones redefinidas: equivalencia con el motor de partida (1500e42, MEC-09C)
// y estructura de las cadenas de envolturas prioritarias (docs/mec09d/funciones-redefinidas.md).
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const {make}=require('./helpers/mec01-game.cjs');
const BASE='1500e42',baseApp=cp.execFileSync('git',['show',BASE+':www/js/app.js'],{maxBuffer:64e6}).toString();
const json=x=>JSON.parse(JSON.stringify(x));
// Expone las implementaciones efectivas en el momento de la llamada (no una captura).
const expose=src=>src.replace(/\n\}\)\(\);\s*$/,'\nwindow.__mec09d={taxonomyInfo:(...a)=>taxonomyInfo(...a),normalizeMEC01:(...a)=>normalizeMEC01(...a)};\n})();');
const one=src=>{const h=make({full:true,headless:true,app:expose(src)});return Object.assign(h,{t:h.window.__mec09d});};
const pair=()=>({now:one(fs.readFileSync('www/js/app.js','utf8')),before:one(baseApp)});

test('MEC09D-C1 taxonomyInfo consolidado devuelve exactamente la misma clasificación para las 1000 especies y para ids desconocidos',()=>{
 const {now,before}=pair(),ids=Object.keys(now.g.SPECIES);
 assert.equal(ids.length,1000);assert.deepEqual(ids,Object.keys(before.g.SPECIES));
 for(const id of [...ids,'no_existe','',undefined])assert.deepEqual(json(now.t.taxonomyInfo(id)),json(before.t.taxonomyInfo(id)),String(id));
 // Las ocho procedencias regionales con taxonomía propia siguen resolviéndose desde la ficha.
 const origins=new Set(ids.map(id=>now.g.SPECIES[id].origin).filter(Boolean));
 for(const o of ['na3220','sa3230','oc3290','polar3310','marine3320','deep3330','abyssal3340','gm06'])if(origins.has(o)){const id=ids.find(i=>now.g.SPECIES[i].origin===o);assert.deepEqual(json(now.t.taxonomyInfo(id)),json(now.g.SPECIES[id].taxonomy),o);}
});

test('MEC09D-C1 la cadena de taxonomyInfo pasa de nueve envolturas a una capa de procedencias más la capa de registros A04',()=>{
 const src=fs.readFileSync('www/js/app.js','utf8');
 assert.equal((src.match(/(?<![\w.])taxonomyInfo=function/g)||[]).length,2);
 assert.equal((src.match(/OWN_TAXONOMY_ORIGINS\.add\('/g)||[]).length,8);
 assert.equal((baseApp.match(/(?<![\w.])taxonomyInfo=function/g)||[]).length,9);
});

test('MEC09D-C1 regionRequirementsMet, atlasRegionModel y continentStatus coinciden con el motor de partida en las 125 regiones y cinco perfiles',()=>{
 const profiles=[
  s=>{},
  s=>{s.prestige=500;},
  s=>{s.prestige=5000;for(const id of ['brass_compass','oceanic_quadrant','field_telescope','scholar_hat'])s.craftedItems[id]=true;},
  s=>{s.prestige=5000;for(const id of ['brass_compass','oceanic_quadrant','field_telescope','scholar_hat','south_america_map','oceania_map','polar_map','world_map'])s.craftedItems[id]=true;for(const k of Object.keys(s.upgrades||{}))s.upgrades[k]=true;},
  s=>{s.prestige=99999;for(const id of Object.keys(s.craftedItems||{}))s.craftedItems[id]=true;for(const id of ['south_america_map','oceania_map','polar_map','world_map'])s.craftedItems[id]=true;for(const k of Object.keys(s.upgrades||{}))s.upgrades[k]=true;}
 ];
 for(const [i,apply] of profiles.entries()){
  const {now,before}=pair();apply(now.g.state);apply(before.g.state);
  assert.equal(now.g.REGIONS.length,125);
  for(const r of now.g.REGIONS){const b=before.g.REGIONS.find(x=>x.id===r.id);
   assert.equal(now.g.regionRequirementsMet(r),before.g.regionRequirementsMet(b),'perfil '+i+' '+r.id);
   assert.deepEqual(json(now.g.atlasRegionModel(r)),json(before.g.atlasRegionModel(b)),'modelo perfil '+i+' '+r.id);}
  for(const c of new Set(now.g.REGIONS.map(r=>r.continent)))assert.equal(now.g.continentStatus?.(c),before.g.continentStatus?.(c),c);
 }
});

test('MEC09D-C1 normalizeMEC01 es idempotente y su cadena completa (MEC-01…MEC-09A) deja la partida igual que el motor de partida',()=>{
 const fixtures=['docs/mec09c/saves/B-intermedia.json','docs/mec09c/saves/C-avanzada.json','docs/mec09c/saves/D-final-mec09b.json'].filter(f=>fs.existsSync(f));
 assert.ok(fixtures.length>=3);
 for(const f of fixtures){
  const raw=JSON.parse(fs.readFileSync(f,'utf8')),save=raw.game||raw.state||raw;
  const {now,before}=pair();
  for(const h of [now,before])h.window.AtlasSaveBridge.restoreGame(json(save));
  const strip=s=>{const d=json(s);delete d.log;delete d.lastTick;delete d.lastSave;delete d.savedAt;return d;};
  const a=strip(now.g.state),b=strip(before.g.state);assert.deepEqual(a,b,f);
  // Idempotencia: normalizar de nuevo no cambia nada.
  now.t.normalizeMEC01(now.g.state);const again=strip(now.g.state);assert.deepEqual(again,a,f+' idempotencia');
 }
});
