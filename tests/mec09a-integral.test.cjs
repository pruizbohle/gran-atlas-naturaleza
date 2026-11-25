'use strict';
// MEC-09A · Pruebas integrales con el catálogo completo: comportamiento vigente equivalente a las
// pruebas históricas obsoletas (sección 5), migraciones con partidas auténticas (sección 11),
// partidas dañadas (sección 12), transacciones (sección 10), ingresos (sección 14) y escenarios
// entre módulos (sección 22). Todo con el motor real; nada de esto es una simulación de accesibilidad.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const KEY='gran_atlas_v05',T0=1790000000000,H=3600e3,D=24*H;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
function rngWith(seed=13){let x=seed>>>0;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
function game(o={}){const h=make({now:T0,headless:true,full:true,rng:rngWith(o.seed),...o});h.window.confirm=()=>true;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,o={})=>game({store:{[KEY]:saved(h)},now:h.now,...o});
const failWrites=h=>{const ls=h.localStorage,set=ls.setItem;ls.setItem=()=>{throw new Error('QuotaExceededError');};return ()=>{ls.setItem=set;};};
const MAPS=['africa_map','asia_map','north_america_map','south_america_map','oceania_map','polar_map','world_map'];
// Preparación vigente: compuertas cartográficas (INV 3.40), equipo de sondeo y todas las investigaciones.
function prepared(h){const g=h.g,s=g.state;Object.assign(s,{money:1e9,knowledge:1e9,prestige:5000});s.upgrades.shipyard=1;s.purchases.astillero=1;
 for(const n of g.RESEARCH_NODES){s.purchases[n.id]=1;if(n.once&&n.effect)n.effect(s);}
 for(const id of [...MAPS,'sounding_kit'])s.craftedItems[id]=true;for(const r of Object.values(g.CONTINENT_RULES3300||{}))for(const id of r.items||[])s.craftedItems[id]=true;
 for(const r of g.REGIONS)s.regionUnlocked[r.id]=true;return s;}
const RAW=['brass_shard','polished_lens','carved_wood','map_fragment','parchment_scrap','old_ink','river_pebble','ancient_coin'];

// ── §5 Comportamiento vigente equivalente a las pruebas históricas obsoletas ──────────────
test('MEC-09A · E1 las 1.744 presencias auditadas en GM-05 son alcanzables por búsqueda manual y automática con las compuertas vigentes',()=>{
 const h=game({full:false}),g=h.g,s=prepared(h),audit=require('../docs/gm05/runtime-audit.json');let n=0;
 for(const p of audit.presences)for(const type of ['manual','automatic']){const w=p[type];Object.assign(s,{currentRegion:p.regionId,habitat:w.habitat,time:w.time,season:w.season});s.deepSurvey.method=w.method;
  const l=type==='manual'?g.eligibleSpecies(p.regionId,w.habitat,w.time,w.season):g.automaticEligibleSpecies(p.regionId,w.season);assert.ok(l.includes(p.speciesId),p.speciesId+':'+p.regionId+':'+type);n++;}
 assert.equal(n,3488);
});

test('MEC-09A · E2 catálogo completo: cada presencia de las 125 regiones tiene alguna condición manual y automática alcanzable',()=>{
 const h=game(),g=h.g,s=prepared(h);let pairs=0;const miss=[];
 for(const r of g.REGIONS)for(const id of r.species){pairs++;const sp=g.SPECIES[id];let manual=false,auto=false;
  for(const method of g.deepRegionIndex3330.has(r.id)?Object.keys(g.DEEP_METHODS3330):[null]){if(method)s.deepSurvey.method=method;
   for(const season of sp.seasons){s.currentRegion=r.id;for(const hab of r.habitats)for(const t of sp.times)if(!auto&&g.automaticEligibleSpecies(r.id,season,{habitat:hab,time:t,method:method||undefined}).includes(id))auto=true;
    for(const hab of r.habitats)for(const t of sp.times)if(!manual&&g.eligibleSpecies(r.id,hab,t,season).includes(id))manual=true;}}
  if(!manual||!auto)miss.push(r.id+':'+id+(manual?'':' manual')+(auto?'':' auto'));}
 assert.equal(g.REGIONS.length,125);assert.ok(pairs>=1744);deq(miss,[],'presencias sin vía de observación');
});

test('MEC-09A · E3 operación profunda vigente: cobro al iniciar, resolución única, misma semilla tras recargar y reversión ante fallo de guardado',()=>{
 const h=game(),g=h.g,s=prepared(h),R=g.REGIONS.find(r=>r.id==='profundo_atlantico_profundo_norte');
 Object.assign(s,{currentRegion:R.id,habitat:'columna_batial',time:'amanecer',season:'primavera'});s.deepSurvey.method='muestreo';
 assert.ok(g.canStartDeep3330('muestreo'),'operación disponible con world_map y equipo de sondeo');
 g.persist();const before=J(s),restore=failWrites(h);assert.equal(g.startDeep3330('muestreo'),false);restore();deq(g.state.money,before.money,'sin cobro si no se guarda');deq(g.state.deepSurvey.jobs,[]);
 const m0=g.state.money;assert.ok(g.startDeep3330('muestreo'));const job=J(g.state.deepSurvey.jobs[0]);assert.equal(m0-g.state.money,g.DEEP_METHODS3330.muestreo.money);
 h.now=job.endAt-1;assert.equal(g.processDeep3330(h.now),false,'no antes de tiempo');
 const h2=reopen(h);h2.now=job.endAt+1;h.now=job.endAt+1;
 assert.ok(g.processDeep3330(h.now));assert.ok(h2.g.processDeep3330(h2.now));deq(h2.g.state.sightings,g.state.sightings,'misma semilla y contexto tras recargar');
 assert.equal(g.processDeep3330(h.now+1),false,'una sola resolución');assert.equal(g.state.deepSurvey.jobs.length,0);
});

test('MEC-09A · E4 regiones polares y marinas: descubrimiento real por búsqueda manual con su mapa; sin mapa no hay acceso',()=>{
 const h=game(),g=h.g,s=prepared(h);
 for(const [region,map] of [['polar_hielo_artico_occidental','polar_map'],['mar_atlantico_septentrional','world_map']]){const r=g.REGIONS.find(x=>x.id===region)||g.REGIONS.find(x=>x.id.startsWith(region.split('_')[0]+'_'));
  s.craftedItems[map]=false;assert.equal(g.regionAccessible(r),false,r.id+' sin '+map);s.craftedItems[map]=true;assert.ok(g.regionAccessible(r));
  const sp=g.SPECIES[r.species[0]];Object.assign(s,{currentRegion:r.id,habitat:sp.habitats.find(x=>r.habitats.includes(x)),time:sp.times[0],season:sp.seasons[0]});
  for(let i=0;i<40&&!s.discovered[r.species[0]];i++){h.now+=61e3;g.encounter('manual',h.now,true);}assert.ok(Object.keys(s.discovered).some(id=>r.species.includes(id)),r.id+': descubrimiento real');}
});

// ── §11 Migraciones con partidas auténticas de versiones anteriores ────────────────────────
const corpus=require('./fixtures/mec09a-saves.json'),stability=require('./fixtures/stability-saves-v3240.json');
const facts=st=>({money:Math.floor(st.money),knowledge:Math.floor(st.knowledge),prestige:Math.floor(st.prestige),discovered:Object.keys(st.discovered||{}).filter(k=>st.discovered[k]).sort(),
 sightings:Object.values(st.sightings||{}).reduce((a,b)=>a+(Number(b)||0),0),published:Object.keys(st.published||{}).filter(k=>st.published[k]).length,purchases:Object.keys(st.purchases||{}).sort(),
 inventory:Object.fromEntries(Object.entries(st.inventory||{}).filter(([,n])=>n>0)),regionUnlocked:Object.keys(st.regionUnlocked||{}).filter(k=>st.regionUnlocked[k]).sort()});
for(const c of [...stability.map(x=>({label:x.version+' '+x.scenario,raw:typeof x.raw==='string'?x.raw:JSON.stringify(x.raw)})),...corpus])
 test('MEC-09A · M '+c.label+': migra sin perder progreso, sin ingresos nuevos y de forma idempotente',()=>{
  const old=JSON.parse(c.raw),h=game({store:{[KEY]:c.raw}}),st=h.g.state,f=facts(old),now=facts(st);
  for(const k of ['money','knowledge','prestige','sightings','published'])assert.equal(now[k],f[k],k);
  for(const id of f.discovered)if(h.g.SPECIES[id])assert.ok(st.discovered[id],'descubierta '+id);
  for(const id of f.purchases)assert.ok(st.purchases[id]!==undefined,'investigación '+id);
  for(const [id,n] of Object.entries(f.inventory))if(h.g.ITEMS[id])assert.ok((st.inventory[id]||0)>=n,'inventario '+id);
  for(const id of f.regionUnlocked)if(h.g.REGIONS.some(r=>r.id===id))assert.ok(st.regionUnlocked[id],'región '+id);
  if(old.camp?.levels)deq(st.camp.levels,{...st.camp.levels,...old.camp.levels},'instalaciones');
  for(const c8 of old.mec08?.contracts||[])assert.ok(st.mec08.contracts.some(x=>x.id===c8.id),'encargo '+c8.id);
  for(const id of Object.keys(old.collectionRegistry?.pieces||{}))assert.ok(st.collectionRegistry.pieces[id],'registro '+id);
  for(const id of Object.keys(old.achievements?.unlocked||{}))assert.ok(st.achievements.unlocked[id],'medalla '+id);
  // Idempotencia: recargar dos veces y restaurar el mismo respaldo dos veces no cambia nada ni paga.
  const once=J(reopen(h).g.state),h3=game({store:{[KEY]:JSON.stringify(once)}});const twice=J(h3.g.state);
  for(const k of ['money','knowledge','prestige','moneyLedger','achievements','mec08','naturalRecords','collectionRegistry','inventory','camp','society'])deq(twice[k],once[k],'idempotente: '+k);
  h3.window.AtlasSaveBridge.restoreGame(JSON.parse(c.raw));const a=J(h3.g.state);h3.window.AtlasSaveBridge.restoreGame(JSON.parse(c.raw));const b=J(h3.g.state);
  for(const k of ['money','knowledge','prestige','moneyLedger','inventory','achievements'])deq(b[k],a[k],'importar dos veces: '+k);
  assert.equal(a.money,f.money,'la importación no paga');
 });

// ── §12 Partidas parcialmente dañadas: recuperación determinista y conservadora ───────────
test('MEC-09A · N1 partida dañada: valores inválidos, ids desconocidos, niveles excesivos y actividades duplicadas',()=>{
 const h=game(),g=h.g,s=g.state;s.discovered[Object.keys(g.SPECIES)[0]]=true;s.sightings[Object.keys(g.SPECIES)[0]]=7;g.persist();
 const raw=JSON.parse(h.store[KEY]);
 Object.assign(raw,{money:-50,knowledge:'abc',prestige:12});raw.inventory={brass_shard:-3,river_pebble:'x',unknown_item_zz:4,old_ink:5};
 raw.camp={...raw.camp,levels:{...raw.camp.levels,workshop:99,surveys:-2}};raw.society={...raw.society,rank:999};
 raw.museum={...raw.museum,wing:42,cabinets:{Botánica:['NO-EXISTE','NO-EXISTE']}};
 raw.mec08={...raw.mec08,contracts:[{id:'co-1',template:'no-existe',kind:'correspondencia',status:'aceptado',objectives:[{metric:'sightingsTotal',mode:'incremental',target:'x',baseline:null}],reward:{money:5}},{id:'co-2',template:'obs-campo',kind:'correspondencia',status:'aceptado',objectives:[{metric:'sightingsTotal',mode:'incremental',target:-4,baseline:'q'}],reward:{money:5,knowledge:0}},{id:'co-2',template:'obs-campo',kind:'correspondencia',status:'cobrado',objectives:[],reward:{}}],editions:{'basura':1,'dia-darwin-2027':{status:'zz'}}};
 raw.naturalRecords={...raw.naturalRecords,records:{'jirafa-altura':{count:-4,best:{value:1e9},achieved:true}},behaviors:{'no-existe':{count:3}}};
 const h2=game({store:{[KEY]:JSON.stringify(raw)}}),t=h2.g.state;
 assert.ok(Number.isFinite(t.money)&&Number.isFinite(t.knowledge),'números válidos');assert.equal(t.prestige,12,'lo válido se conserva');
 assert.ok(t.inventory.old_ink===5,'objeto válido conservado');assert.equal(t.inventory.unknown_item_zz,4,'id desconocido conservado (política histórica)');assert.ok(!(t.inventory.brass_shard<0),'sin existencias negativas');
 assert.ok(h2.x.AtlasCampMEC02.level(t,'workshop')<=5&&h2.x.AtlasCampMEC02.level(t,'surveys')>=1,'niveles acotados');
 assert.ok(t.museum.wing<=5);assert.ok(!(t.museum.cabinets.Botánica||[]).includes('NO-EXISTE'),'pieza inexistente retirada del gabinete');
 deq(t.mec08.contracts.map(c=>c.id),['co-2'],'sin plantilla desconocida ni duplicados');assert.ok(t.mec08.recoveries.some(r=>r.id==='co-1'),'recuperación registrada');
 assert.ok(t.mec08.contracts[0].objectives.every(o=>o.target>=0&&Number.isFinite(o.baseline)));deq(t.mec08.editions,{});
 assert.equal(t.naturalRecords.records['jirafa-altura'].achieved,true,'hito no revocado');assert.ok(t.naturalRecords.records['jirafa-altura'].best.value<=h2.x.AtlasMEC07.byId['jirafa-altura'].bounds.max);
 assert.ok(!t.naturalRecords.behaviors['no-existe']);assert.equal(t.sightings[Object.keys(g.SPECIES)[0]],7,'avistamientos legítimos conservados');
 const again=J(reopen(h2).g.state);for(const k of ['money','inventory','camp','museum','mec08','naturalRecords'])deq(again[k],J(t)[k],'recuperación determinista: '+k);
});

test('MEC-09A · N2 instrumentos instalados por encima de la capacidad y piezas expuestas sin existencias',()=>{
 const h=game(),g=h.g,s=prepared(h),X6=h.x.AtlasMEC06;for(const id of Object.keys(X6.ARTIFACTS))s.museum.collections[id]=true;g.persist();
 const raw=JSON.parse(h.store[KEY]);raw.mec06=raw.mec06||{};raw.mec06.locations=Object.fromEntries(Object.keys(X6.ARTIFACTS).map(id=>[id,'taller']));
 const piece=Object.keys(h.x.AtlasMEC03Catalog.pieces)[0];raw.inventory[piece]=0;raw.museum.cabinets={[h.x.AtlasMEC03Catalog.pieces[piece].cabinet]:[piece,piece]};
 const h2=game({store:{[KEY]:JSON.stringify(raw)}}),t=h2.g.state,a6=h2.x.AtlasMEC06Actions;
 const inTaller=Object.keys(X6.ARTIFACTS).filter(id=>a6.location(id)==='taller');assert.ok(inTaller.length<=a6.capacity('taller'),'capacidad respetada');
 assert.ok(Object.keys(X6.ARTIFACTS).every(id=>t.museum.collections[id]),'ningún artefacto se pierde');
 const shown=Object.values(t.museum.cabinets).flat().filter(x=>x===piece).length;assert.ok(shown<=(t.inventory[piece]||0),'no se exhibe lo que no se tiene');
});

// ── §10 y §14 Transacciones e ingresos ─────────────────────────────────────────────────────
test('MEC-09A · T1 fallo de guardado en operaciones compuestas: nada parcial, nada duplicado',()=>{
 const ops={
  craft:h=>{const g=h.g;const id=Object.keys(g.RECIPES).find(r=>g.canCraft(r)&&r!=='world_map');return g.craftItem(id);},
  excavation:h=>{const g=h.g;const site=g.MUSEUM_DIG_SITES.find(x=>g.canStartExcavation(x.id));return g.startExcavation(site.id);},
  study:h=>{const a6=h.x.AtlasMEC06Actions;const k=Object.keys(h.x.AtlasMEC06.STUDIES).find(k=>a6.studyCheck(k)?.ok);return a6.runStudy(k);},
  build:h=>{const a6=h.x.AtlasMEC06Actions;const k=Object.keys(h.x.AtlasMEC06.ARTIFACTS).find(k=>a6.planArtifact?.(k)?.ok);return a6.buildArtifact(k);},
  sail:h=>{const g=h.g;const v=g.VOYAGES.find(v=>{try{return g.voyageConditions3280(v).every(c=>c.met);}catch(_){return false;}});return g.sail(v.id);},
  market:h=>h.g.buyTrade3300(Object.keys(h.g.TRADE_MARKET)[0]),
  relict:h=>{const g=h.g;const r=g.MUSEUM_RELICTS.find(r=>g.canStartRelictSurvey(r.id));return g.startRelictSurvey(r.id);},
  expand:h=>h.g.expandMuseum()};
 for(const [name,op] of Object.entries(ops)){
  const mk=()=>{const h=game();const s=prepared(h);for(const id of Object.keys(h.g.ITEMS))s.inventory[id]=(s.inventory[id]||0)+40;for(const k of ['shipyard','caravan','workshop','excavations','surveys'])for(let i=0;i<4;i++)try{h.x.AtlasCampMEC02.upgrade(s,k);}catch(_){}h.g.persist();return h;};
  const h=mk(),before=J(h.g.state),restore=failWrites(h);assert.equal(op(h),false,name+' informa el fallo');restore();deq(h.g.state,before,name+': sin cambios parciales');
  const h2=mk();assert.ok(op(h2),name+' funciona');deq(JSON.parse(h2.store[KEY]).money,h2.g.state.money,name+': guardado coherente');
 }
});

test('MEC-09A · T2 libro de ingresos: cada entrada de dinero queda registrada una vez y los gastos no reducen el ingreso acumulado',()=>{
 const h=game(),g=h.g,s=prepared(h),L=()=>s.moneyLedger.total,check=(name,fn)=>{const m=g.state.money,l=g.state.moneyLedger.total;fn();const dm=g.state.money-m,dl=g.state.moneyLedger.total-l;if(dm>0)assert.equal(dl,dm,name);};
 check('museo',()=>{s.museum.exhibits=s.museum.exhibits||{};h.now+=60e3;g.tick();});
 check('canje',()=>g.exchangeNotes());
 check('encargo',()=>{const A=h.x.AtlasMEC08Actions;const c=A.instantiate(h.x.AtlasMEC08.TEMPLATES[0],'t-l',h.now);c.status='completado';g.state.mec08.contracts.push(c);A.claim('t-l',h.now);});
 const l0=g.state.moneyLedger.total;g.buyTrade3300(Object.keys(g.TRADE_MARKET)[0]);assert.equal(g.state.moneyLedger.total,l0,'un gasto no toca el ingreso');
 const src=fs.readFileSync('www/js/app.js','utf8')+fs.readFileSync('www/js/commissions-v3370.js','utf8');
 const direct=[...src.matchAll(/\b(state|s)\.money\s*\+=/g)].length;assert.equal(direct,2,'solo earnMoney y el pago de encargos 3370 (acreditado en commissionClaim3370) suman saldo directamente');
});

// ── §22 Escenarios entre módulos (catálogo completo, estado persistente) ─────────────────
test('MEC-09A · I1 expedición → coleccionable → exhibición → bonificación; duplicado intercambiado sin perder el registro',()=>{
 const h=game(),g=h.g,s=prepared(h),K=h.x.AtlasMEC03Catalog,M5=g.museumMEC05;s.museum.wing=3;
 const ids=Object.keys(K.pieces).filter(id=>K.pieces[id].cabinet==='Oceanografía').slice(0,4);for(const id of ids)g.addInventory(id,2);
 for(const id of ids)assert.ok(h.M.expose(s,h.A.catalog,id,K.pieces[id].cabinet==='Oceanografía'?20:20).ok!==false);g.persist();
 assert.ok(M5.live('expedicion:oceanografica')>0,'la exhibición bonifica');
 const id=ids[0];s.inventory[id]=0;assert.ok(s.collectionRegistry.pieces[id],'el registro permanente no depende de las existencias');
 const h2=reopen(h);assert.ok(h2.g.state.collectionRegistry.pieces[id]);
});

test('MEC-09A · I2 componentes → artefacto → instalación → expedición con instrumentos; mover el instrumento no altera la expedición iniciada',()=>{
 const h=game(),g=h.g,s=prepared(h),a6=h.x.AtlasMEC06Actions,X6=h.x.AtlasMEC06;for(const m of RAW)s.inventory[m]=500;
 for(const k of ['workshop','shipyard'])for(let i=0;i<4;i++)try{h.x.AtlasCampMEC02.upgrade(s,k);}catch(_){}
 for(const id of Object.keys(X6.COMPONENTS))for(const [mat,n] of Object.entries(g.RECIPES[id]?.requires||{}))s.inventory[mat]=(s.inventory[mat]||0)+n*3;
 const art=Object.keys(X6.ARTIFACTS).find(k=>a6.planArtifact(k)?.ok);assert.ok(art,'artefacto fabricable');assert.ok(a6.buildArtifact(art));
 const place=X6.ARTIFACTS[art].functions.includes('B')?'taller':'campamento';a6.setLocation(art,place);
 const v=g.VOYAGES.find(v=>{try{return g.voyageConditions3280(v).every(c=>c.met);}catch(_){return false;}});assert.ok(g.sail(v.id));const job=J(s.voyages.at(-1));
 a6.setLocation(art,'almacen');deq(s.voyages.at(-1).mec06||null,job.mec06||null,'condiciones capturadas al zarpar');
 h.now=job.endAt+1;assert.equal(g.processVoyages(h.now),1);assert.equal(g.processVoyages(h.now+1),0,'liquidación única');
});

test('MEC-09A · I3 conducta → logro; récord validado sin duplicar recompensas; ascenso y mejora de instalación',()=>{
 const h=game(),g=h.g,s=prepared(h),X7=h.x.AtlasMEC07;
 s.naturalRecords.behaviors['castor-dique']={count:1,firstAt:h.now,region:'HX-02-11',regions:{'HX-02-11':1},rewards:{behavior:{}}};
 g.achievementMark3360('records');g.achievementFlush3360();assert.ok(s.achievements.unlocked.behavior_1);
 const k0=s.knowledge;g.achievementMark3360('records');g.achievementFlush3360();assert.equal(s.knowledge,k0,'la medalla no paga');
 const lvl=h.x.AtlasCampMEC02.level(s,'caravan');g.mec02Action('mec02-upgrade','caravan');assert.equal(h.x.AtlasCampMEC02.level(s,'caravan'),lvl+1);
 const r0=h.x.AtlasMEC04.rank(s);g.mec02Action('mec04-ascend','');assert.ok(h.x.AtlasMEC04.rank(s)>=r0,'el ascenso nunca retrocede');
});

test('MEC-09A · I4 encargo completado durante un periodo offline: búsquedas automáticas reales lo acreditan una sola vez',()=>{
 const h=game(),g=h.g,s=g.state,A=h.x.AtlasMEC08Actions;const c=A.instantiate(h.x.AtlasMEC08.TEMPLATES.find(t=>t.id==='obs-campo'),'off-1',h.now);c.status='aceptado';c.objectives[0].target=1;s.mec08.contracts.push(c);
 s.helpers=4;g.persist();const h2=game({store:{[KEY]:h.store[KEY]},now:h.now+6*H});for(let i=0;i<40&&h2.g.state.autoPending.length;i++){h2.g.tick();}
 const c2=h2.g.state.mec08.contracts.find(x=>x.id==='off-1');if(Object.values(h2.g.state.sightings).reduce((a,b)=>a+b,0)>Object.values(s.sightings).reduce((a,b)=>a+b,0)){assert.equal(c2.status,'completado');
  assert.ok(A&&h2.x.AtlasMEC08Actions.claim('off-1',h2.now));assert.equal(h2.x.AtlasMEC08Actions.claim('off-1',h2.now),false,'una sola vez');}
});

test('MEC-09A · I5 importar una partida con actividades pendientes: se liquidan una vez, con su contexto',()=>{
 const h=game(),g=h.g,s=prepared(h);const site=g.MUSEUM_DIG_SITES.find(x=>g.canStartExcavation(x.id));assert.ok(g.startExcavation(site.id));
 const v=g.VOYAGES.find(v=>{try{return g.voyageConditions3280(v).every(c=>c.met);}catch(_){return false;}});assert.ok(g.sail(v.id));
 const backup=JSON.parse(saved(h)),h2=game({now:h.now+40*D});h2.window.AtlasSaveBridge.restoreGame(backup);const t=h2.g.state;
 const job=t.museum.excavations[0];assert.ok(job);assert.ok(h2.g.collectExcavation(job.id,h2.now));assert.equal(h2.g.collectExcavation(job.id,h2.now),false,'sin duplicar');
 const n=h2.g.processVoyages(h2.now);assert.equal(n,1);h2.window.AtlasSaveBridge.restoreGame(JSON.parse(saved(h2)));assert.equal(h2.g.processVoyages(h2.now),0,'reimportar no repite');
});

test('MEC-09A · I6 búsquedas automáticas en distintas regiones conservan la región de cada tramo',()=>{
 const h=game(),g=h.g,s=prepared(h);s.helpers=4;const [a,b]=g.REGIONS.filter(r=>!r.id.startsWith('profundo_')&&!r.id.startsWith('abisal_')).slice(0,2);
 g.setRegion(a.id);g.persist();h.now+=2*H;g.tick();g.setRegion(b.id);h.now+=2*H;g.tick();
 for(let i=0;i<50&&s.autoPending.length;i++)g.tick();
 const regional=s.regionalRecords.regions;assert.ok(Object.keys(regional[a.id]?.species||{}).every(id=>a.species.includes(id)),'registros de A solo con especies de A');
 assert.ok(Object.keys(regional[b.id]?.species||{}).every(id=>b.species.includes(id)),'registros de B solo con especies de B');
});

test('MEC-09A · I7 partida anterior con coleccionables del sistema experimental: se conservan y el canal experimental sigue desactivado',()=>{
 const h=game(),g=h.g,s=g.state,K=h.x.AtlasMEC03Catalog;const id=Object.keys(K.pieces)[5];g.persist();const raw=JSON.parse(h.store[KEY]);
 raw.inventory[id]=3;raw.collectionRegistry.pieces[id]={obtained:3,sources:{experimental:3},firstAt:T0};
 const h2=game({store:{[KEY]:JSON.stringify(raw)}});assert.equal(h2.g.state.inventory[id],3);assert.ok(h2.g.state.collectionRegistry.pieces[id]);
 const ch=h2.A.drops?.channels?.();if(ch&&ch.coleccionables)assert.equal(Number(ch.coleccionables.campo||0),0,'canal experimental desactivado');
 assert.ok(!(h2.x.AtlasMEC06Actions.sourcesOf(id)||[]).some(x=>/Gabinete de especímenes: cae de|Drop de prueba|^BETA/.test(x)));
});

test('MEC-09A · I8 restaurar una partida con reservas inconsistentes no consume piezas reservadas',()=>{
 const h=game(),g=h.g,s=prepared(h),K=h.x.AtlasMEC03Catalog;const id=Object.keys(K.pieces).find(i=>K.pieces[i].cabinet);g.addInventory(id,1);s.museum.wing=3;
 g.persist();const raw=JSON.parse(h.store[KEY]);raw.museum.cabinets={[K.pieces[id].cabinet]:[id,id,id]};
 const h2=game({store:{[KEY]:JSON.stringify(raw)}}),t=h2.g.state;const st=h2.M.pieceStatus(t,h2.A.catalog,id);
 assert.ok(st.exhibited<=st.owned);assert.equal(st.tradable,0,'la única unidad exhibida no se puede intercambiar');
});

// ── §20 Versionado y canal beta ────────────────────────────────────────────────────────────
test('MEC-09A · V versión de consolidación 5.6.9 Beta coherente y sin APK',()=>{
 const pkg=require('../package.json'),rel=require('../www/atlas-release.json'),lock=require('../package-lock.json');
 assert.equal(pkg.version,'5.6.9');assert.equal(lock.version,'5.6.9');assert.equal(rel.version,'5.6.9');assert.equal(rel.build,'MEC-09A');assert.equal(rel.channel,'beta');assert.equal(rel.v569.apk,false);
 const sw=fs.readFileSync('www/sw.js','utf8'),idx=fs.readFileSync('www/index.html','utf8');assert.match(sw,/version:'5\.6\.9'/);assert.match(idx,/content="5\.6\.9"/);
 assert.ok(!/\?v=5\.6\.8/.test(idx),'referencias de módulos actualizadas');assert.ok(fs.readFileSync('www/js/save-manager.js','utf8').includes("gameVersion: '5.6.9'"));
 for(const t of ['tests/mec09a.test.cjs','tests/mec09a-integral.test.cjs','tests/mec09a-catalog.test.cjs'])assert.ok(pkg.scripts['release:verify'].includes(t),t);
 assert.ok(!fs.existsSync('android'));
});
