'use strict';
// MEC-09D §19 · Encargos (36 permanentes) y tablero de contratos con AVAIL por perfil de jugador, con el motor vigente.
// Informe: docs/mec09d/encargos-calendario.md.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const T0=Date.UTC(2027,5,1,12),HOUR=3600e3;
const json=x=>JSON.parse(JSON.stringify(x));
function game(save,now=T0){const h=make({full:true,headless:true,now});h.window.confirm=()=>true;if(save)h.window.AtlasSaveBridge.restoreGame(json(save));return {h,g:h.g,s:h.g.state,A:h.x.AtlasMEC08Actions,X8:h.x.AtlasMEC08,C:h.x.AtlasCommissions3370};}
const fixture=f=>{const raw=JSON.parse(fs.readFileSync('docs/mec09c/saves/'+f+'.json','utf8'));return raw.game||raw.state||raw;};
// Perfiles: nuevo, intermedio, avanzado, final MEC-09B, todas las regiones y casi completo (999 monografías).
function profiles(){
 const list=[['nuevo',null],['intermedio',fixture('B-intermedia')],['avanzado',fixture('C-avanzada')],['final',fixture('D-final-mec09b')]];
 const all=game(fixture('D-final-mec09b'));for(const r of all.g.REGIONS){all.s.regionUnlocked[r.id]=true;(all.s.regionsVisited??={})[r.id]=true;}list.push(['todas las regiones',json(all.s)]);
 const near=game(json(all.s));const ids=Object.keys(near.g.SPECIES);for(const id of ids.slice(0,999)){near.s.discovered[id]=true;near.s.stages[id]=5;near.s.published[id]=true;near.s.sightings[id]=Math.max(near.s.sightings[id]||0,50);}list.push(['casi completo',json(near.s)]);
 return list;
}
const PROFILES=profiles();

test('MEC09D-E0 36 encargos permanentes: identificadores únicos, cadenas válidas y acíclicas, métricas existentes y premios válidos',()=>{
 const {g,C}=game(),cat=json(C.catalog);assert.equal(cat.length,36);assert.equal(new Set(cat.map(c=>c.id)).size,36);
 const ids=new Set(cat.map(c=>c.id)),metrics=new Set(Object.keys(json(C.metrics(g.state,{species:g.SPECIES,regions:g.REGIONS,research:g.RESEARCH_NODES,recipes:g.RECIPES,collections:g.MUSEUM_COLLECTIONS,fossilRecipes:g.MUSEUM_FOSSIL_RECIPES,relicts:g.MUSEUM_RELICTS,voyages:g.VOYAGES}))||{}));
 for(const c of cat){
  for(const p of [].concat(c.requiresCommission||c.previous||c.after||[]))assert.ok(ids.has(p),c.id+' previo '+p);
  for(const r of c.requirements||[])if(metrics.size)assert.ok(metrics.has(r.metric),c.id+' métrica '+r.metric);
  for(const id of Object.keys(c.reward?.items||{}))assert.ok(g.ITEMS[id],c.id+' objeto '+id);
  assert.ok((c.reward?.money||0)>=0&&(c.reward?.knowledge||0)>=0,c.id+' premio');
 }
 // Acíclicas: recorrer cada cadena termina.
 const prev=Object.fromEntries(cat.map(c=>[c.id,[].concat(c.requiresCommission||c.previous||c.after||[])]));
 for(const id of ids){const seen=new Set();const walk=x=>{assert.ok(!seen.has(x),'ciclo en '+id);seen.add(x);for(const p of prev[x]||[])walk(p);};walk(id);}
 // Evidencia de obtención (MEC-09B: D desde partida nueva o C con el motor real); ninguno bloqueado.
 const rows=fs.readFileSync('docs/mec09b/encargos.csv','utf8').trim().split('\n').slice(1);assert.equal(rows.length,36);
 for(const r of rows)assert.doesNotMatch(r,/;Bloqueado;|;Incoherente;/,r.slice(0,40));
});

for(const [name,save] of PROFILES){
 test('MEC09D-E1 tablero AVAIL · perfil '+name+': 10 periodos sin ofertas imposibles, sin plantillas activas repetidas y estable al recargar',()=>{
  const {h,A,X8,s}=game(save);const period=X8.CONTRACT_POLICY.periodHours*HOUR;assert.equal(X8.CONTRACT_POLICY.periodHours,72);
  for(let k=0;k<10;k++){const now=T0+k*period,b=json(A.board(now));
   assert.ok(b.offers.length<=X8.CONTRACT_POLICY.offers.correspondencia+X8.CONTRACT_POLICY.offers.proyecto);
   for(const o of b.offers){for(const ob of o.objectives){assert.ok(A.objectiveFeasible(ob,ob.target),name+' '+o.template+' '+ob.metric+' '+ob.target+': '+A.objectiveReason(ob,ob.target));
     const a=A.AVAIL[ob.metric]?.();if(a&&!a.repeatable)assert.ok(a.n>=ob.target,name+' '+ob.metric+' supera el contenido finito');}}
   const active=new Set(s.mec08.contracts.filter(c=>['aceptado','completado'].includes(c.status)).map(c=>c.template));
   for(const o of b.offers)assert.ok(!active.has(o.template),'plantilla ya activa ofrecida');
  }
  // El tablero de un periodo no se regenera al recargar.
  const now=T0+3*period,b1=json(A.board(now));h.g.persist();const r=game(null,now);r.h.window.AtlasSaveBridge.restoreGame(json(h.g.state));
  assert.deepEqual(json(r.A.board(now)).offers.map(o=>o.id),b1.offers.map(o=>o.id));
 });
}

test('MEC09D-E2 aceptar, abandonar sin coste, completar con actividad real, cobrar una sola vez y sin penalización por inactividad',()=>{
 const {h,g,s,A}=game(fixture('D-final-mec09b'));Object.assign(s,{money:1e6,knowledge:1e6});
 // Inactividad: 60 días sin actuar no cambia recursos ni caduca encargos aceptados (acceptedExpire=false).
 let b=A.board(T0);const first=b.offers[0];assert.ok(A.accept(first.id,T0));
 const before={m:s.money,k:s.knowledge};h.now=T0+60*24*HOUR;A.syncContracts(h.now);
 assert.equal(s.money,before.m);assert.equal(s.knowledge,before.k);assert.ok(['aceptado','completado'].includes(s.mec08.contracts.find(c=>c.id===first.id).status));
 // Abandonar: sin coste y libera el hueco (con una oferta que siga aceptada en un periodo posterior).
 let tAb=h.now,ab=null;for(let k=0;k<20&&!ab;k++){tAb+=72*HOUR;h.now=tAb;for(const o of json(A.board(tAb)).offers){if(A.accept(o.id,tAb)&&s.mec08.contracts.find(c=>c.id===o.id)?.status==='aceptado'){ab=o;break;}}}
 assert.ok(ab,'una oferta aceptada pendiente');const m0=s.money,k0=s.knowledge,inv0=json(s.inventory);assert.ok(A.abandon(ab.id,h.now));
 assert.equal(s.money,m0);assert.equal(s.knowledge,k0);assert.deepEqual(json(s.inventory),inv0);assert.equal(s.mec08.contracts.find(c=>c.id===ab.id).status,'abandonado');
 // Proyecto de excavaciones completado con excavaciones reales y cobrado una sola vez.
 let t=h.now+90*24*HOUR,offer=null;for(let k=0;k<30&&!offer;k++){t+=72*HOUR;h.now=t;offer=json(A.board(t)).offers.find(o=>o.objectives.every(x=>x.metric==='excavationsDone'));}
 assert.ok(offer,'oferta de excavaciones en algún periodo');assert.ok(A.accept(offer.id,t));
 const need=offer.objectives[0].target,site=g.MUSEUM_DIG_SITES[0];s.regionUnlocked[site.region]=true;
 for(let i=0;i<need;i++){h.now=t+i*1e6;assert.ok(g.startExcavation(site.id,h.now));const job=s.museum.excavations.at(-1);h.now=job.endAt+1;assert.ok(g.collectExcavation(job.id,h.now,()=>0.5));}
 A.syncContracts(h.now);assert.equal(s.mec08.contracts.find(c=>c.id===offer.id).status,'completado');
 const mb=s.money;assert.ok(A.claim(offer.id,h.now));const paid=s.money-mb;assert.ok(paid>0);
 assert.equal(A.claim(offer.id,h.now+1),false,'no cobra dos veces');assert.equal(s.money,mb+paid);
 // Recargar y volver a cobrar tampoco paga.
 h.g.persist();const r=game(null,h.now);r.h.window.AtlasSaveBridge.restoreGame(json(s));assert.equal(r.A.claim(offer.id,h.now+2),false);
});
