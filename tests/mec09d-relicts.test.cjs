'use strict';
// MEC-09D §15 · Los 20 relictos, uno por uno, con el motor real y el catálogo completo (125 regiones).
// Por cada relicto: datos válidos; tres indicios (localización, hábitat, turno) que suben la probabilidad;
// encuentro posible sin indicios; solo en Campo con región, hábitat y turno exactos; registro único;
// persistencia y recarga; ficha del Museo y reconocimiento; la prospección documental nunca entrega el animal.
// Complementa relictos-v50 (umbrales de producción, trabajo sin conexión, migraciones).
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const FN='addRelictLead,relictLeadCount,searchRelictInField,museumRelictOwned,museumRelict3270,startRelictSurvey,collectRelictSurvey,canStartRelictSurvey,persist'.split(',');
const APP=fs.readFileSync('www/js/app.js','utf8').replace(/\n\}\)\(\);\s*$/,'\nwindow.__r={'+FN.map(n=>n+':(...a)=>'+n+'(...a)').join(',')+',RATES:RELICT_DISCOVERY_RATES};\n})();');
const KEY='gran_atlas_v05';
const game=(store)=>{const h=make({full:true,headless:true,app:APP,...(store?{store}:{})});return {h,g:h.g,s:h.g.state,r:h.window.__r};};
const base=game(),RELICTS=base.g.MUSEUM_RELICTS;

test('MEC09D-R0 hay 20 relictos con identificadores únicos, región existente y hábitat y turno posibles en ella',()=>{
 assert.equal(RELICTS.length,20);assert.equal(new Set(RELICTS.map(r=>r.id)).size,20);
 assert.deepEqual([...base.r.RATES],[0.0002,0.0005,0.0012,0.003]);
 for(const rel of RELICTS){const region=base.g.REGIONS.find(x=>x.id===rel.region);
  assert.ok(region,rel.id+' región');assert.ok(rel.habitats.length&&rel.habitats.every(h=>region.habitats.includes(h)),rel.id+' hábitat en la región');
  const times=new Set(Object.values(base.g.SPECIES).flatMap(sp=>sp.times||[]));assert.ok(rel.times.length&&rel.times.every(t=>times.has(t)),rel.id+' turno válido del juego');}
});

for(const rel of RELICTS){
 test('MEC09D-R '+rel.id+': indicios, encuentro en Campo, registro, persistencia y prospección',()=>{
  const {h,g,s,r}=game(),at=1700000000000;
  const ok={currentRegion:rel.region,habitat:rel.habitats[0],time:rel.times[0]};
  // Solo en Campo con región, hábitat y turno exactos.
  const otherRegion=g.REGIONS.find(x=>x.id!==rel.region).id,otherHabitat=['bosque','pradera','montaña','humedal','costa','desierto','sabana','tundra','oceano','arrecife'].find(x=>!rel.habitats.includes(x)),otherTime=['dawn','day','dusk','night'].find(x=>!rel.times.includes(x));
  for(const wrong of [{...ok,currentRegion:otherRegion},{...ok,habitat:otherHabitat},{...ok,time:otherTime}])assert.equal(r.searchRelictInField('manual',at,wrong,()=>0),null,'condición incorrecta');
  // Indicios: 0→3 en orden localización, hábitat, turno; la probabilidad sube con cada uno; tope 3.
  const labels=n=>JSON.parse(JSON.stringify(r.museumRelict3270(rel))).details.map(d=>d.label);
  assert.deepEqual(labels(),[]);
  const expected=[['Localización'],['Localización','Hábitat'],['Localización','Hábitat','Comportamiento']];
  for(let i=0;i<3;i++){
   // Con el umbral del nivel actual no hay hallazgo si el azar queda justo por encima.
   assert.equal(r.searchRelictInField('manual',at,ok,()=>r.RATES[i]+1e-9),null,'nivel '+i+' sobre el umbral');
   assert.equal(r.addRelictLead(rel.id),true);assert.equal(r.relictLeadCount(rel.id),i+1);assert.deepEqual(labels(),expected[i]);
   assert.ok(r.RATES[i+1]>r.RATES[i],'la probabilidad sube');
  }
  assert.equal(r.addRelictLead(rel.id),false,'tope de tres indicios');
  // Encuentro posible sin indicios: partida nueva, azar bajo el umbral base.
  const fresh=game();assert.equal(fresh.r.relictLeadCount(rel.id),0);
  const found=fresh.r.searchRelictInField('manual',at,ok,()=>fresh.r.RATES[0]/2);assert.equal(found?.id,rel.id);
  assert.equal(fresh.r.museumRelictOwned(rel.id),true);
  // Registro único: nuevas búsquedas no lo vuelven a registrar ni generan indicios.
  assert.equal(fresh.r.searchRelictInField('manual',at+1,ok,()=>0),null);assert.equal(fresh.r.addRelictLead(rel.id),false);
  const disc=fresh.s.museum.relictDiscoveries[rel.id];assert.deepEqual([disc.region,disc.habitat,disc.time,disc.source],[rel.region,ok.habitat,ok.time,'manual']);
  // Ficha del Museo completa y acción de exponer.
  const view=JSON.parse(JSON.stringify(fresh.r.museumRelict3270(rel)));assert.ok(view.details.some(d=>d.label==='Fecha de registro'));assert.equal(view.actions[0]?.action,'museum-display');
  // Persistencia y recarga.
  fresh.r.persist();const again=game({...fresh.h.store});assert.equal(again.r.museumRelictOwned(rel.id),true);assert.equal(again.s.museum.relictDiscoveries[rel.id].region,rel.region);
  // Prospección documental: da un indicio, nunca el animal.
  s.museum.relictLeads[rel.id]=0;s.money=1e6;s.knowledge=1e6;s.regionUnlocked[rel.region]=true;
  assert.equal(r.canStartRelictSurvey(rel.id),true,'prospección disponible');assert.equal(!!r.startRelictSurvey(rel.id,at),true);
  const job=s.museum.relictSurveys.at(-1);h.now=job.endAt+1;r.collectRelictSurvey(job.id,job.endAt+1,()=>0);
  assert.equal(r.museumRelictOwned(rel.id),false,'la prospección no entrega el animal');assert.ok(r.relictLeadCount(rel.id)>=1,'la prospección da un indicio');
 });
}

test('MEC09D-R reconocimiento: los logros de relictos (1, 3 y 20) cuentan relictos distintos registrados en Campo',()=>{
 const {g,s,r}=game(),at=1700000000000;
 // Catálogo de reconocimientos: 3.36 (1 y 3) y MEC-08 (20), todos por número de relictos distintos.
 const src=['www/js/achievements-v3360.js','www/js/mec08-recognition.js'].map(f=>fs.readFileSync(f,'utf8')).join('\n');
 assert.match(src,/for\(const n of \[1,3\]\)add\('museum','relict_'\+n,[^\n]*'relicts',n,/,'logros de 1 y 3 relictos');assert.match(src,/'relict_20'[^\n]*'relicts',20/,'logro de 20 relictos');
 for(const rel of RELICTS){const found=r.searchRelictInField('manual',at,{currentRegion:rel.region,habitat:rel.habitats[0],time:rel.times[0]},()=>0);assert.equal(found?.id,rel.id);}
 assert.equal(Object.keys(s.museum.relicts).filter(id=>s.museum.relicts[id]).length,20);
});
