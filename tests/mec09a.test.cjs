'use strict';
// MEC-09A · Auditoría técnica: hallazgos de la auditoría externa de MEC-08 (anexo) y pruebas integrales.
// Motor real con el catálogo completo salvo que se indique lo contrario.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const KEY='gran_atlas_v05',H=3600e3,D=24*H;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
const local=(y,m,d,hh=12)=>new Date(y,m-1,d,hh).getTime();
function rngWith(seed=13){let x=seed>>>0;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
function game(o={}){const h=make({now:o.now??local(2027,10,30),headless:true,full:o.full??true,rng:rngWith(o.seed),...o});h.window.confirm=()=>true;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,o={})=>game({store:{[KEY]:saved(h)},now:h.now,...o});
const A8=h=>h.x.AtlasMEC08Actions,X8=h=>h.x.AtlasMEC08,Cm=h=>h.x.AtlasCampMEC02,K=h=>h.x.AtlasMEC03Catalog;
const failWrites=h=>{const ls=h.localStorage,set=ls.setItem;ls.setItem=()=>{throw new Error('QuotaExceededError');};return ()=>{ls.setItem=set;};};
const RAW=['brass_shard','polished_lens','carved_wood','map_fragment','parchment_scrap','old_ink','river_pebble','ancient_coin'];
function rich(h,workshop=5){const s=h.g.state;Object.assign(s,{money:1e8,knowledge:1e8,prestige:600});s.upgrades.shipyard=1;s.purchases.astillero=1;s.society.rank=20;
 for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;while(Cm(h).level(s,'workshop')<workshop)Cm(h).upgrade(s,'workshop');for(const m of RAW)s.inventory[m]=200;return s;}
const contract=(h,id)=>h.g.state.mec08.contracts.find(c=>c.id===id);
const nightSearches=(h,n,from)=>{const s=h.g.state;s.time='noche';for(let i=0;i<n;i++){h.now=from+i*61e3;h.g.encounter('manual',h.now,true);}};

// ── Anexo 1. Caducidad y acreditación de eventos ────────────────────────────────────────────
test('MEC-09A · A1.1 la caducidad se comprueba antes del cumplimiento: lo hecho después del cierre no acredita',()=>{
 const h=game(),A=A8(h),s=h.g.state,end=X8(h).occurrence(X8(h).EVENTS_BY_ID['noche-criaturas'],2027).end;
 assert.ok(A.acceptEvent('noche-criaturas-2027',h.now));
 nightSearches(h,4,end-10*60e3);// 4 dentro del periodo
 nightSearches(h,10,end+60e3);// 10 después del cierre: no cuentan aunque la meta sea 10
 const c=contract(h,'ev-noche-criaturas-2027');assert.equal(c.status,'caducado');assert.equal(c.endedAt,end);
 assert.equal(s.mec08.editions['noche-criaturas-2027'].status,'caducado');
});

test('MEC-09A · A1.2 objetivos cumplidos dentro del periodo conservan su recompensa aunque se cobre después',()=>{
 const h=game(),A=A8(h),s=h.g.state,occ=X8(h).occurrence(X8(h).EVENTS_BY_ID['noche-criaturas'],2027);
 assert.ok(A.acceptEvent('noche-criaturas-2027',h.now));nightSearches(h,10,occ.end-60*60e3);
 const c=contract(h,'ev-noche-criaturas-2027');assert.equal(c.status,'completado');assert.ok(c.completedAt<occ.end,'fecha efectiva dentro del periodo');assert.ok(Number.isFinite(c.settledAt));
 h.now=occ.end+5*D;const h2=reopen(h);const m0=h2.g.state.money;assert.ok(A8(h2).claim(c.id,h2.now));
 const c2=contract(h2,c.id);assert.equal(c2.status,'cobrado');assert.ok(c2.claimedAt>c2.completedAt,'cobro distinto de la actividad');assert.equal(h2.g.state.money-m0,c.reward.money);
});

test('MEC-09A · A1.3 búsquedas offline anteriores al cierre, procesadas después, sí acreditan; las posteriores no',()=>{
 const h=game(),A=A8(h),s=h.g.state,end=X8(h).occurrence(X8(h).EVENTS_BY_ID['noche-criaturas'],2027).end;
 assert.ok(A.acceptEvent('noche-criaturas-2027',h.now));
 // Cola pendiente que empieza antes del cierre: el horizonte efectivo no deja caducar el encargo.
 s.autoPending=[{at:end-30*60e3,end:end-29*60e3,interval:60e3,currentRegion:s.currentRegion,season:s.season,habitat:s.habitat,time:'noche',method:'búsqueda automática'}];
 h.now=end+2*H;A.syncContracts(h.now);assert.equal(contract(h,'ev-noche-criaturas-2027').status,'aceptado','no caduca mientras haya actividad pendiente anterior al cierre');
 assert.ok(A.horizon(h.now)<end);
 // Se procesan (con su fecha efectiva) diez observaciones anteriores al cierre.
 s.time='noche';for(let i=0;i<10;i++)h.g.encounter('manual',end-30*60e3+i*1000,true);s.autoPending=[];
 A.syncContracts(h.now);assert.equal(contract(h,'ev-noche-criaturas-2027').status,'completado');
});

test('MEC-09A · A1.4 una expedición iniciada durante el evento y terminada después: no acredita el encargo y conserva el modificador capturado',()=>{
 const h=game(),A=A8(h),g=h.g,M5=g.museumMEC05,occ=X8(h).occurrence(X8(h).EVENTS_BY_ID['dia-oceanos'],2027);
 h.now=occ.start+H;const snap=M5.snapshot(h.now);assert.ok(snap.events?.['expedicion:oceanografica']>0,'capturado al iniciar');
 h.now=occ.end+H;assert.equal(M5.eventLive('expedicion:oceanografica'),0);assert.ok(M5.value(snap,'expedicion:oceanografica')>=snap.events['expedicion:oceanografica']);
 // Encargo de Océanos (voyagesDone): actividad efectiva en endAt posterior al cierre → excluida.
 const s=rich(h);h.now=occ.start+H;assert.ok(A.acceptEvent('dia-oceanos-2027',h.now));const c=contract(h,'ev-dia-oceanos-2027');
 A.activityScope(occ.end+10*60e3,()=>{s.museum.voyagesCompleted=(s.museum.voyagesCompleted||0)+1;});
 h.now=occ.end+H;A.syncContracts(h.now);const c2=contract(h,c.id);assert.equal(c2.status,'caducado');assert.ok(c2.objectives.every(o=>!o.reached));
});

// ── Anexo 2. Atomicidad de contadores ──────────────────────────────────────────────────────
test('MEC-09A · A2.1 fabricación: contador e inventario en la misma transacción (fallo de guardado → nada)',()=>{
 const h=game({full:false}),g=h.g,s=rich(h);const id=Object.keys(g.RECIPES||{}).find(r=>g.canCraft(r)&&r!=='world_map');assert.ok(id,'receta fabricable');
 g.persist();const inv=J(s.inventory),c0=s.mec08.counters.crafted,restore=failWrites(h);
 assert.equal(g.craftItem(id),false);restore();deq(g.state.inventory,inv,'sin consumo parcial');assert.equal(g.state.mec08.counters.crafted,c0,'sin contador huérfano');
 assert.ok(g.craftItem(id));assert.equal(g.state.mec08.counters.crafted,c0+1);
 const saved2=JSON.parse(h.store[KEY]);assert.equal(saved2.mec08.counters.crafted,c0+1,'persistido junto con la fabricación');
});

test('MEC-09A · A2.2 validación científica desde la acción del Cuaderno: el contador se registra dentro de la transacción',()=>{
 const h=game(),g=h.g,s=g.state,X7=h.x.AtlasMEC07,A7=h.x.AtlasMEC07Actions,e=X7.byId['sapo-pulga-tamano'];
 s.naturalRecords.records[e.id]=X7.update(e,null,{value:8.0,at:h.now,region:'sa_cerrado_brasileno',method:'estimacion'}).record;
 s.museum.collections=s.museum.collections||{};s.museum.collections.microscopio_compuesto=true;h.x.AtlasMEC06Actions.setLocation?.('microscopio_compuesto','taller');
 g.persist();const v0=s.mec08.counters.validations,restore=failWrites(h);assert.equal(A7.validate(e.id,h.now),false);restore();assert.equal(g.state.mec08.counters.validations,v0);
 g.mec02Action('mec07-validate',e.id+'|sa_cerrado_brasileno');assert.equal(g.state.mec08.counters.validations,v0+1,'la acción de interfaz también cuenta');
 assert.equal(JSON.parse(h.store[KEY]).mec08.counters.validations,v0+1);
});

// ── Anexo 3. Registro permanente de ediciones ─────────────────────────────────────────────
test('MEC-09A · A3 el recorte del historial no permite repetir una edición; migración desde MEC-08',()=>{
 const h=game(),A=A8(h),s=h.g.state;assert.ok(A.acceptEvent('noche-criaturas-2027',h.now));assert.ok(A.abandon('ev-noche-criaturas-2027',h.now));
 assert.equal(s.mec08.editions['noche-criaturas-2027'].status,'abandonado');
 for(let i=0;i<60;i++)s.mec08.contracts.push({id:'co-x-'+i,template:'obs-campo',kind:'correspondencia',status:'cobrado',objectives:[],reward:{money:0,knowledge:0}});
 const h2=reopen(h);assert.ok(!contract(h2,'ev-noche-criaturas-2027'),'el historial visible se recortó');
 assert.equal(A8(h2).acceptEvent('noche-criaturas-2027',h2.now),false,'la edición ya usada no se repite');
 // Partida de MEC-08 sin registro: se reconstruye desde encargos y medallas.
 const raw=JSON.parse(saved(h2));delete raw.mec08.editions;raw.mec08.medals={'dia-darwin':[2026]};const h3=game({store:{[KEY]:JSON.stringify(raw)}});
 assert.equal(h3.g.state.mec08.editions['dia-darwin-2026'].status,'cobrado');
});

// ── Anexo 4. Modificadores temporales con fecha efectiva ──────────────────────────────────
test('MEC-09A · A4 búsquedas automáticas usan su instante efectivo para los modificadores del evento',()=>{
 const h=game(),A=A8(h),M5=h.g.museumMEC05,occ=X8(h).occurrence(X8(h).EVENTS_BY_ID['equinoccio-septiembre'],2027),act='campo:ambiental:oceanografia';
 h.now=occ.start+H;assert.ok(M5.eventLive(act)>0,'ahora hay evento');
 assert.equal(A.activityScope(occ.start-H,()=>M5.eventLive(act)),0,'búsqueda anterior al inicio: sin beneficio');
 h.now=occ.end+2*H;assert.ok(A.activityScope(occ.start+H,()=>M5.eventLive(act))>0,'búsqueda dentro del periodo procesada después: con beneficio');
 assert.equal(A.activityScope(occ.end+H,()=>M5.eventLive(act)),0,'posterior al cierre: sin beneficio');
 // El encuentro real fija su fecha efectiva.
 let seen=null;const before=M5.ambientBands;M5.ambientBands=(p,b)=>{seen=M5.eventLive(act);return before(p,b);};
 try{h.now=occ.end+2*H;h.g.encounter('automatic',occ.start+H,true);}finally{M5.ambientBands=before;}
 if(seen!==null)assert.ok(seen>0,'la tirada ambiental de la búsqueda usa su instante');
});

// ── Anexo 5. Persistencia de ofertas ───────────────────────────────────────────────────────
test('MEC-09A · A5 aceptar conserva la oferta presentada; solo cambia la línea base incremental',()=>{
 const h=game({now:local(2027,3,3)}),A=A8(h),s=h.g.state;const b=A.board(h.now),offer=J(b.offers.find(o=>o.kind==='correspondencia'));assert.ok(offer);
 s.society.rank=15;s.sightings={x:999};s.mec08.counters.crafted+=50;
 assert.ok(A.accept(offer.id,h.now+60e3));const c=contract(h,offer.id);
 deq(c.reward,offer.reward,'recompensa de la oferta');deq(c.objectives.map(o=>o.target),offer.objectives.map(o=>o.target),'dificultad del rango de la oferta');
 deq(c.conditions,offer.conditions);for(const [i,o] of c.objectives.entries())if(o.mode==='incremental')assert.equal(o.baseline,A.metrics()[o.metric]);else assert.equal(o.baseline,offer.objectives[i].baseline);
});

// ── Anexo 6. Viabilidad de encargos ────────────────────────────────────────────────────────
test('MEC-09A · A6.1 partidas avanzadas: no se ofrecen objetivos sin cantidad disponible',()=>{
 const h=game(),A=A8(h),g=h.g,s=rich(h);
 for(const r of g.REGIONS){s.regionsVisited[r.id]=true;}for(const id of Object.keys(g.SPECIES)){s.discovered[id]=true;s.published[id]=true;}
 for(let p=0;p<40;p++)for(const o of A.board(h.now+p*72*H).offers){assert.ok(!['regiones','especies-nuevas','monografias'].includes(o.template),o.template);
  for(const ob of o.objectives)assert.ok(A.objectiveFeasible(ob,ob.target),o.template+' '+ob.metric);}
 const ev=A.eventContract(X8(h).occurrence(X8(h).EVENTS_BY_ID['dia-darwin'],2028),h.now);assert.ok(ev.alternative,'Darwin usa su alternativa: no quedan monografías');
});

test('MEC-09A · A6.2 la meta concreta se compara con la cantidad disponible, no solo con un mínimo',()=>{
 const h=game(),A=A8(h),g=h.g,s=g.state;
 const acc=g.REGIONS.filter(r=>g.regionAccessible(r));for(const r of acc.slice(1))s.regionsVisited[r.id]=true;// queda 1 sin visitar
 assert.equal(A.AVAIL.visitedAll().n,acc.filter(r=>!s.regionsVisited[r.id]).length);
 assert.equal(A.objectiveFeasible({metric:'visitedAll',mode:'incremental'},2),A.AVAIL.visitedAll().n>=2);
 const t=X8(h).TEMPLATES.find(x=>x.id==='proy-continentes');assert.match(t.description,/continente o mar donde aún no/);
 for(const tp of X8(h).TEMPLATES)for(const o of tp.objectives)assert.ok(o.metric in A.metrics()||A.AVAIL[o.metric],tp.id+' '+o.metric);
});

// ── Anexo 7. Accesibilidad técnica ─────────────────────────────────────────────────────────
test('MEC-09A · A7 controles con nombre accesible y foco recuperable tras acciones de Sociedad y Récords',()=>{
 const h=game(),g=h.g,s=g.state;s.societyView='missions';const html=g.renderSociety();
 for(const m of html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)){const text=m[1].replace(/<[^>]+>/g,'').trim(),aria=/aria-label="[^"]+"/.test(m[0]);assert.ok(text||aria,'botón sin nombre: '+m[0].slice(0,80));}
 for(const m of html.matchAll(/<select\b[^>]*>/g))assert.match(m[0],/aria-label="/);
 const rec=h.x.AtlasMEC07Actions.section();for(const m of rec.matchAll(/<(select|input)\b[^>]*>/g))assert.match(m[0],/aria-label="/);
 assert.match(fs.readFileSync('www/js/app.js','utf8'),/restoreFocusMEC09A/);
});
