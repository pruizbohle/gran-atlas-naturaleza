'use strict';
// MEC-09D §14 · Los 30 legendarios, uno por uno, con el motor real y el catálogo completo (1000/125).
// Por cada legendario: especie, presencia regional y lámina válidas; aparición solo a través de un encuentro
// real de su especie (Campo → rollSpecimen → recordSpecimen) en su región, hábitat, turno y estación;
// registro único (nunca se repite ni duplica la recompensa); persistencia y recarga; integración con el
// Bestiario. Las especies de capas oceánicas se encuentran con sus métodos propios (marine/deep/abyssal),
// por lo que su aparición se comprueba con las mismas funciones del motor que usa el encuentro.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {make}=require('./helpers/mec01-game.cjs');
const FN='rollSpecimen,recordSpecimen,legendaryForSpecies,specimenRates,persist,eligibleSpecies,setRegion,encounter'.split(',');
const APP=fs.readFileSync('www/js/app.js','utf8').replace(/\n\}\)\(\);\s*$/,'\nwindow.__l={'+FN.map(n=>n+':(...a)=>'+n+'(...a)').join(',')+'};\n})();');
const MAPS=['south_america_map','oceania_map','polar_map','world_map'];
function game(opts={}){let source=null;const h=make({full:true,headless:true,app:APP,rng:()=>source?source():0.5,...opts});const s=h.g.state;for(const m of MAPS)s.craftedItems[m]=true;return {h,g:h.g,s,l:h.window.__l,setRng(f){source=f;}};}
const assets=(()=>{const c={};c.globalThis=c;vm.runInNewContext(fs.readFileSync('www/js/naturalist-assets-v400.js','utf8'),c);return c.AtlasNaturalistAssets.routes;})();
const base=game(),LEG=base.g.LEGENDARY_SPECIMENS,paths={};
const weight=(g,id)=>({'Común':12,'Poco común':5,'Raro':1.8,'Muy rara':.4}[g.SPECIES[id].rare]);
// Azar que cae dentro del intervalo «Legendario» de la especie (orden real de specimenRates).
function legendaryDraw(l,id){const r=Object.entries(JSON.parse(JSON.stringify(l.specimenRates(id))));let c=0;for(const[k,v]of r){if(k==='Legendario')return c+v/2;c+=v;}return null;}

test('MEC09D-L0 hay 30 legendarios con identificador y especie únicos; 18 son solo legendarios (LEG-02) y 12 históricos',()=>{
 assert.equal(LEG.length,30);assert.equal(new Set(LEG.map(x=>x.id)).size,30);assert.equal(new Set(LEG.map(x=>x.speciesId)).size,30);
 assert.equal(LEG.filter(x=>x.legendaryOnly).length,18);
 for(const x of LEG){assert.ok(base.g.SPECIES[x.speciesId],x.id);assert.equal(base.l.specimenRates(x.speciesId).Legendario,0.0001,x.id+' tasa legendaria');}
});

for(const leg of LEG){
 test('MEC09D-L '+leg.id+' ('+leg.speciesId+'): aparición, registro único, persistencia y Bestiario',()=>{
  const {h,g,s,l,setRng}=game(),id=leg.speciesId,sp=g.SPECIES[id];
  // Datos y lámina.
  const regions=g.REGIONS.filter(r=>r.species.includes(id));assert.ok(regions.length,'presente en alguna región');
  const route=assets[id];assert.ok(route?.legendario,'lámina legendaria');for(const sz of ['','64/','128/','256/'])assert.ok(fs.existsSync('www/naturalist-art/plates/'+sz+route.legendario),sz+route.legendario);
  assert.equal(l.legendaryForSpecies(id)?.id,leg.id);
  // Sin aparición prematura: en una partida nueva, solo es posible si su especie vive en la región inicial.
  const start=g.REGIONS.find(r=>r.id===s.currentRegion);assert.equal(start.species.includes(id),regions.some(r=>r.id===start.id));
  // Azar dentro del intervalo legendario.
  const x=legendaryDraw(l,id);assert.ok(x!==null);
  let found=false;
  // Encuentro real en Campo cuando la especie es elegible manualmente en alguna región (capas terrestres y polares).
  for(const r of regions){
   s.regionUnlocked[r.id]=true;l.setRegion(r.id);if(s.currentRegion!==r.id)continue;
   const habitat=sp.habitats.find(hb=>r.habitats.includes(hb));if(!habitat)continue;
   const pool=l.eligibleSpecies(r.id,habitat,sp.times[0],sp.seasons[0]);if(!pool.includes(id))continue;
   Object.assign(s,{habitat,time:sp.times[0],season:sp.seasons[0]});
   const index=pool.indexOf(id),total=pool.reduce((n,k)=>n+weight(g,k),0),selection=(pool.slice(0,index).reduce((n,k)=>n+weight(g,k),0)+weight(g,id)/2)/total;
   const seq=[selection];setRng(()=>seq.length?seq.shift():x);
   l.encounter('manual',1700000000000,true);
   found=!!s.legendaryFound?.[leg.id];if(found)break;
  }
  paths[leg.id]=found?'campo':'métodos oceánicos';
  if(!found){
   // Capas oceánicas (métodos propios): mismas funciones del motor que usa el encuentro.
   assert.ok(regions.every(r=>r.continent==='Océanos')||regions.some(r=>/^(profundo|abisal)_/.test(r.id))||sp.origin==='marine3320'||sp.origin==='deep3330',id+' debería encontrarse en Campo');
   const roll=l.rollSpecimen(id,s,(()=>{const q=[0.99,x];return()=>q.length?q.shift():0.99;})());assert.equal(roll.category,'Legendario');l.recordSpecimen(id,roll,s);
  }
  assert.deepEqual(JSON.parse(JSON.stringify(s.legendaryFound[leg.id])),{id:leg.id,speciesId:id});
  // Registro único: una segunda tirada en el mismo intervalo nunca vuelve a dar el legendario.
  const again=l.rollSpecimen(id,s,(()=>{const q=[0.99,x];return()=>q.length?q.shift():0.99;})());assert.notEqual(again.category,'Legendario');
  l.recordSpecimen(id,{pigment:'',category:'Legendario'},s);assert.equal(Object.keys(s.legendaryFound).length,1,'sin duplicados');
  // Persistencia y recarga.
  l.persist();const back=make({full:true,headless:true,store:{...h.store}});assert.ok(back.g.state.legendaryFound[leg.id]);
 });
}

test('MEC09D-L Bestiario y Sociedad: los legendarios encontrados se cuentan una vez y su lámina sale de la ruta legendaria',()=>{
 const {g,s,l}=game();
 for(const leg of LEG.slice(0,5)){const x=legendaryDraw(l,leg.speciesId);const roll=l.rollSpecimen(leg.speciesId,s,(()=>{const q=[0.99,x];return()=>q.length?q.shift():0.99;})());l.recordSpecimen(leg.speciesId,roll,s);s.discovered[leg.speciesId]=true;}
 assert.equal(Object.keys(s.legendaryFound).length,5);
 const src=fs.readFileSync('www/js/app.js','utf8');assert.match(src,/if\(category==='Legendario'\|\|variant==='Legendario'\)return getSpriteMarkup\(id,'legendario'\)/);
 assert.match(src,/const found=LEGENDARY_SPECIMENS\.filter\(l=>state\.legendaryFound\?\.\[l\.id\]\)/);
});

test('MEC09D-L resumen de vías de aparición',t=>{
 const field=Object.values(paths).filter(v=>v==='campo').length;t.diagnostic(JSON.stringify(paths));
 assert.equal(Object.keys(paths).length,30);assert.equal(field,30,'los 30 aparecen por un encuentro real en Campo');
});
