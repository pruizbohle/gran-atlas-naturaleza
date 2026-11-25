'use strict';
// MEC-09D §16 · Los 25 récords y las 20 conductas, uno por uno, contra el catálogo completo (1000/125).
// Por récord: especie existente y encontrable; condiciones compatibles con la especie; umbral alcanzable por
// el generador real (muestreo con el RNG aislado del módulo) o por la evidencia regional real; instrumento de
// validación existente en el Taller (MEC-06); hito y recompensa una sola vez; mejor marca y evidencia pendiente.
// Por conducta: especie existente y encontrable; condiciones y sexo compatibles; probabilidad positiva; primera
// observación única. La integración con Campo, offline, guardado e importación está en mec07 (26 pruebas).
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {make}=require('./helpers/mec01-game.cjs');
const h=make({full:true,headless:true}),g=h.g,S=g.SPECIES,R=g.REGIONS;
const mod=(file,name)=>{const c={};c.globalThis=c;vm.runInNewContext(fs.readFileSync(file,'utf8'),c);return c[name];};
const M=mod('www/js/mec07-natural-records.js','AtlasMEC07'),W=mod('www/js/mec06-workshop.js','AtlasMEC06');
const regionsOf=id=>R.filter(r=>r.species.includes(id));
function compatible(entry){const sp=S[entry.species],c=entry.conditions||{},problems=[];
 if(c.times&&!c.times.some(t=>sp.times.includes(t)))problems.push('turnos');
 if(c.seasons&&!c.seasons.some(t=>sp.seasons.includes(t)))problems.push('estaciones');
 if(c.habitats&&!regionsOf(entry.species).some(r=>c.habitats.some(hb=>r.habitats.includes(hb)&&sp.habitats.includes(hb))))problems.push('hábitats');
 if(c.deep&&!regionsOf(entry.species).some(r=>/^(profundo|abisal)_/.test(r.id)))problems.push('profundidad');
 return problems;}
const ARTIFACT_IDS=new Set(Object.keys(W.ARTIFACTS||{}).concat(Array.isArray(W.ARTIFACTS)?W.ARTIFACTS.map(a=>a.id):[]));

test('MEC09D-RC0 25 récords y 20 conductas con identificadores únicos, varios por especie permitidos',()=>{
 assert.equal(M.RECORDS.length,25);assert.equal(M.BEHAVIORS.length,20);
 assert.equal(new Set(M.RECORDS.map(r=>r.id)).size,25);assert.equal(new Set(M.BEHAVIORS.map(b=>b.id)).size,20);
 assert.deepEqual(JSON.parse(JSON.stringify(M.REWARDS)),{first:{knowledge:20},milestone:{knowledge:150,prestige:2},behavior:{knowledge:40,prestige:1},medal:true},'recompensas sin cambios (BAL)');
});

for(const rec of M.RECORDS){
 test('MEC09D-RC '+rec.id+' ('+rec.species+')',()=>{
  assert.ok(S[rec.species],'especie existente');assert.ok(regionsOf(rec.species).length,'encontrable en alguna región');
  assert.deepEqual(compatible(rec),[],'condiciones compatibles con la especie');
  assert.ok(rec.chance.manual>0||rec.chance.auto>0,'probabilidad positiva');
  assert.ok(M.TYPES[rec.type],'tipo');assert.ok(Number.isFinite(rec.threshold),'umbral');
  // Umbral alcanzable con el generador real.
  let reach=0,n=0;const dir=M.TYPES[rec.type].direction;
  if(rec.model.kind==='evidencia-regiones'){
   const ids=regionsOf(rec.species).map(r=>r.id),v=M.generate(rec,()=>0.5,{evidenceRegionIds:ids,evidenceRegions:ids.length});
   assert.ok(M.meets(rec,v),'alcanzable con la evidencia de todas sus regiones: '+v+' / '+rec.threshold);
   if(rec.model.basis==='rutas'){const z=M.routeZones(rec,ids);assert.equal(z.complete,true,'todas las zonas de ruta cubiertas por regiones reales');}
  }else{
   const r=M.rng('mec09d:'+rec.id);for(n=0;n<20000;n++){const v=M.generate(rec,r,{});assert.ok(v>=(rec.bounds?.min??-Infinity)&&v<=(rec.bounds?.max??Infinity),'dentro de límites');if(M.meets(rec,v))reach++;}
   assert.ok(reach>0,'el umbral se alcanza con el generador real ('+reach+'/'+n+')');
   assert.ok(dir==='min'?rec.threshold>=rec.bounds.min:rec.threshold<=rec.bounds.max,'umbral dentro de los límites');
  }
  // Instrumento de validación.
  if(rec.instrument){assert.ok(ARTIFACT_IDS.has(rec.instrument.id),'instrumento '+rec.instrument.id+' existe en el Taller');assert.ok(['validacion','apoyo'].includes(rec.instrument.role)||rec.instrument.role,'rol');}
  // Hito y recompensa una sola vez; la mejor marca solo mejora; la evidencia sin validar queda pendiente.
  const good=dir==='min'?rec.threshold-(rec.bounds?.min!==undefined?0:1):rec.threshold;
  let st=null,milestones=0;const validated=!(rec.instrument?.role==='validacion');
  for(const [i,v] of [good,good,good].entries()){const {record,events}=M.update(rec,st,{value:v,at:i,region:'X',method:'directa',validated:true});st=record;milestones+=events.filter(e=>e==='milestone').length;}
  assert.equal(milestones,1,'hito una sola vez');assert.equal(st.count,3);
  if(!validated){const p=M.update(rec,null,{value:good,at:0,region:'X',method:'directa',validated:false});assert.ok(p.events.includes('pending'));assert.equal(p.record.achieved,false,'sin validar no hay hito');}
 });
}

for(const b of M.BEHAVIORS){
 test('MEC09D-CD '+b.id+' ('+b.species+')',()=>{
  assert.ok(S[b.species],'especie existente');assert.ok(regionsOf(b.species).length,'encontrable');
  assert.deepEqual(compatible(b),[],'condiciones compatibles');assert.ok(b.chance.manual>0||b.chance.auto>0,'probabilidad positiva');
  if(b.sex){assert.ok(['male','female'].includes(b.sex),'sexo válido');assert.equal(M.sexEligible(b,b.sex).ok,true);assert.equal(M.sexEligible(b,b.sex==='male'?'female':'male').ok,false,'sexo contrario no elegible');assert.equal(M.sexEligible(b,null).inferred,true);}
  // Elegibilidad real con el contexto de un encuentro de la especie.
  const sp=S[b.species],c=b.conditions||{},time=(c.times||sp.times).find(t=>sp.times.includes(t)),season=(c.seasons||sp.seasons).find(t=>sp.seasons.includes(t));
  const hab=regionsOf(b.species).flatMap(r=>r.habitats).filter(x=>sp.habitats.includes(x));
  assert.equal(M.eligible(b,{species:b.species,time,season,habitats:hab,manual:true,deep:!!c.deep}),true,'elegible en un encuentro de su especie');
  assert.equal(M.eligible(b,{species:Object.keys(S).find(id=>id!==b.species),time,season,habitats:hab,manual:true}),false,'solo su especie');
 });
}
