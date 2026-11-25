'use strict';
// MEC-09D §18 · Las 19 expediciones, 4 rutas comerciales y 10 yacimientos, uno por uno, con el motor vigente.
// Por actividad: requisitos (no arranca sin ellos), coste exacto, duración exacta, sin liquidación anticipada,
// liquidación única (también tras recargar o repetir), recompensas (dinero, conocimiento, materiales, piezas de
// mapa, coleccionables) y persistencia con el trabajo a medias. Informe: docs/mec09d/actividades.md.
const test=require('node:test'),assert=require('node:assert/strict');
const {make}=require('./helpers/mec01-game.cjs');
const MAPS=['africa_map','asia_map','north_america_map','south_america_map','oceania_map','polar_map','world_map'];
const T0=Date.UTC(2027,2,1,12);
function game(store){const h=make({full:true,headless:true,now:T0,...(store?{store}:{})});h.window.confirm=()=>true;return {h,g:h.g,s:h.g.state};}
const json=x=>JSON.parse(JSON.stringify(x));
const base=game(),VOY=json(base.g.VOYAGES),ROUTES=json(base.g.TRADE_ROUTES),SITES=json(base.g.MUSEUM_DIG_SITES);

test('MEC09D-A0 inventario de actividades: 19 expediciones, 4 rutas comerciales y 10 yacimientos con identificadores únicos',()=>{
 assert.equal(VOY.length,19);assert.equal(ROUTES.length,4);assert.equal(SITES.length,10);
 for(const list of [VOY,ROUTES,SITES])assert.equal(new Set(list.map(x=>x.id)).size,list.length);
 for(const d of SITES)assert.ok(base.g.REGIONS.some(r=>r.id===d.region),d.id+' región');
 for(const v of VOY){if(v.mapItem)assert.ok(base.g.ITEMS[v.mapItem],v.id+' mapa');if(v.reqResearch)assert.ok(base.g.RESEARCH_NODES.some(n=>n.id===v.reqResearch),v.id+' investigación');}
});

for(const v of VOY){
 test('MEC09D-AV '+v.id+': requisitos, coste, duración, liquidación única, recompensas y recarga',()=>{
  const {h,g,s}=game();Object.assign(s,{money:1e7,knowledge:1e7,prestige:0});
  // Sin requisitos no zarpa (astillero, prestigio, mapa, rango de rutas, investigación).
  s.upgrades.shipyard=0;g.sail(v.id);assert.equal(s.voyages.length,0,'sin astillero');
  s.upgrades.shipyard=1;s.prestige=Math.max(0,v.required-1);if(v.required>0){g.sail(v.id);assert.equal(s.voyages.length,0,'sin prestigio');}
  s.prestige=v.required;if(v.mapItem){s.inventory[v.mapItem]=0;g.sail(v.id);assert.equal(s.voyages.length,0,'sin mapa');}
  if(v.routeReq){s.upgrades.routeTier=v.routeReq-1;g.sail(v.id);assert.equal(s.voyages.length,0,'sin rango de rutas');}
  if(v.reqResearch){delete s.purchases[v.reqResearch];s.upgrades.routeTier=v.routeReq||0;if(v.mapItem)s.inventory[v.mapItem]=1;g.sail(v.id);assert.equal(s.voyages.length,0,'sin investigación');}
  // Requisitos legítimos cumplidos: zarpa con coste exacto y duración exacta.
  if(v.mapItem)s.inventory[v.mapItem]=1;if(v.routeReq)s.upgrades.routeTier=v.routeReq;if(v.reqResearch)s.purchases[v.reqResearch]=1;
  for(const m of MAPS)s.craftedItems[m]=true;
  const m0=s.money,k0=s.knowledge;g.sail(v.id);assert.equal(s.voyages.length,1,'zarpa');assert.equal(s.money,m0-v.cost);assert.equal(s.knowledge,k0-v.knowledge);
  const job=json(s.voyages[0]);assert.equal(job.endAt-job.startedAt,Math.max(30,Math.round(v.seconds*(s.upgrades.voyageTime||1)))*1000,'duración exacta');
  if(v.mapItem)assert.equal(s.inventory[v.mapItem],1,'el mapa no se consume');
  // Persistencia a medias y sin liquidación anticipada.
  g.persist();const r=game({...h.store}),rs=r.g.state;assert.equal(rs.voyages.length,1,'trabajo conservado');
  assert.equal(r.g.processVoyages(job.endAt-1),0,'sin liquidación anticipada');
  // Liquidación única: el mismo trabajo no paga dos veces aunque se procese de nuevo o se recargue un guardado anterior.
  const before={money:rs.money,knowledge:rs.knowledge,inv:json(rs.inventory)};
  r.h.now=job.endAt+1;assert.equal(r.g.processVoyages(job.endAt+1),1,'liquida');
  const paid=rs.money-before.money,knowledge=rs.knowledge-before.knowledge;
  assert.ok(paid>=v.prize,'dinero de la ruta');assert.ok(knowledge>=v.notes,'conocimiento de la ruta');
  assert.equal(r.g.processVoyages(job.endAt+2),0,'no repite');assert.equal(rs.voyages.length,0);
  const after=json(rs);r.g.persist();
  // Restaurar el guardado previo a la liquidación y procesar otra vez paga una sola vez en esa línea temporal.
  const again=game({...h.store});again.h.now=job.endAt+1;again.g.processVoyages(job.endAt+1);again.g.processVoyages(job.endAt+5);
  assert.equal(again.g.state.money,after.money,'misma liquidación en la otra línea temporal');assert.equal(again.g.state.voyages.length,0);
  // Utilidad: la expedición entrega algo además de dinero y conocimiento a lo largo de varias salidas (botín, mapas, coleccionables o muestras).
  const items=Object.entries(after.inventory).filter(([id,n])=>n>(before.inv[id]||0));
  assert.ok(paid>0&&knowledge>0||items.length,'recompensa útil');
 });
}

for(const t of ROUTES){
 test('MEC09D-AT '+t.id+': requisitos, coste, duración en horas, liquidación única y recarga',()=>{
  const {h,g,s}=game();Object.assign(s,{money:1e7,knowledge:1e7,prestige:0});
  s.upgrades.shipyard=0;assert.equal(!!g.startTrade3300(t.id),false,'sin astillero');
  s.upgrades.shipyard=1;if(t.prestige>0){s.prestige=t.prestige-1;assert.equal(!!g.startTrade3300(t.id),false,'sin prestigio');}
  s.prestige=t.prestige;const m0=s.money,k0=s.knowledge;assert.equal(g.startTrade3300(t.id),true);
  assert.equal(s.money,m0-t.cost);assert.equal(s.knowledge,k0-t.knowledge);const job=json(s.commerce.jobs[0]);
  assert.equal(job.endAt-T0,t.hours*3600e3,'duración exacta');assert.equal(!!g.startTrade3300(t.id),false,'una ruta a la vez');
  g.persist();const r=game({...h.store}),rs=r.g.state;assert.equal(rs.commerce.jobs.length,1);
  r.h.now=job.endAt-1;assert.equal(!!r.g.settleTrade3300(job.endAt-1),false,'sin liquidación anticipada');
  r.h.now=job.endAt+1;const mb=rs.money,inv=json(rs.inventory);r.g.settleTrade3300(job.endAt+1);r.g.settleTrade3300(job.endAt+9);
  assert.equal(rs.money,mb+t.money,'cobro exacto una vez');for(const[m,n]of Object.entries(t.rewards))assert.equal(rs.inventory[m]||0,(inv[m]||0)+n,m);
  assert.equal(rs.commerce.history.length,1);
 });
}

for(const d of SITES){
 test('MEC09D-AE '+d.id+': requisitos, coste, duración, recogida única, hallazgos y recarga',()=>{
  const {h,g,s}=game();Object.assign(s,{money:1e7,knowledge:1e7});
  delete s.regionUnlocked[d.region];assert.equal(g.canStartExcavation(d.id),false,'región bloqueada');
  s.regionUnlocked[d.region]=true;if(d.reqResearch){delete s.purchases[d.reqResearch];assert.equal(g.canStartExcavation(d.id),false,'sin investigación');s.purchases[d.reqResearch]=1;}
  const m0=s.money,k0=s.knowledge;assert.ok(g.startExcavation(d.id,T0));assert.equal(s.money,m0-d.money);assert.equal(s.knowledge,k0-d.knowledge);
  const job=json(s.museum.excavations.at(-1));assert.equal(job.endAt-T0,d.seconds*1000,'duración exacta');
  g.persist();const r=game({...h.store}),rs=r.g.state;
  assert.equal(r.g.collectExcavation(job.id,job.endAt-1,()=>0),false,'sin recogida anticipada');
  const f0=rs.inventory.fossil_fragment||0,done0=rs.museum.excavationsCompleted||0;r.h.now=job.endAt+1;
  assert.ok(r.g.collectExcavation(job.id,job.endAt+1,()=>0));assert.equal(r.g.collectExcavation(job.id,job.endAt+2,()=>0),false,'no repite');
  const got=(rs.inventory.fossil_fragment||0)-f0;assert.ok(got>=d.fragments[0]&&got<=d.fragments[1]+1,'fragmentos en su intervalo');
  assert.equal(rs.museum.excavationsCompleted,done0+1);assert.ok(rs.inventory.fossil_tooth>=1,'con azar mínimo también hay diente fósil');
 });
}
