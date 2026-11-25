'use strict';
// MEC-09B · Auditoría funcional, accesibilidad y progresión integral.
// Pruebas del motor real con el catálogo completo (125 regiones, 1.000 especies). Correcciones de la
// sección 4 (puntos 1-3 de la sección 33), placas con procedencia (26), encargos por perfil (27),
// partidas anteriores (29) y progresión inicial sin ayudas (4). Las matrices (5-25, 28) están en
// tests/mec09b-catalog.test.cjs. Los estados sintéticos se señalan como tales.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {make}=require('./helpers/mec01-game.cjs');
const KEY='gran_atlas_v05',H=3600e3,D=24*H;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
const local=(y,m,d,hh=12)=>new Date(y,m-1,d,hh).getTime();
// rng.force: valor fijo para todas las tiradas mientras esté definido (solo para forzar el resultado de una tirada).
function rngWith(seed=13){let x=seed>>>0;const f=()=>{if(f.force!=null)return f.force;x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};f.force=null;return f;}
function game(o={}){const rng=rngWith(o.seed);const h=make({now:o.now??local(2027,10,30),headless:true,full:o.full??true,rng,...o});h.window.confirm=()=>true;h.rng=rng;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,o={})=>game({store:{[KEY]:saved(h)},now:h.now,...o});
const A8=h=>h.x.AtlasMEC08Actions,X8=h=>h.x.AtlasMEC08,Cm=h=>h.x.AtlasCampMEC02,K=h=>h.x.AtlasMEC03Catalog,A6=h=>h.x.AtlasMEC06Actions,PL=h=>h.x.AtlasPlatesMEC09B;
const RAW=['brass_shard','polished_lens','carved_wood','map_fragment','parchment_scrap','old_ink','river_pebble','ancient_coin'];
// Estado preparado (SINTÉTICO): solo para pruebas unitarias de reglas, nunca como evidencia de accesibilidad.
function rich(h,workshop=5){const s=h.g.state;Object.assign(s,{money:1e8,knowledge:1e8,prestige:600});s.upgrades.shipyard=1;s.purchases.astillero=1;s.society.rank=20;
 for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;while(Cm(h).level(s,'workshop')<workshop)Cm(h).upgrade(s,'workshop');for(const m of RAW)s.inventory[m]=200;return s;}
const contract=(h,id)=>h.g.state.mec08.contracts.find(c=>c.id===id);
// Pone en el tablero del periodo una oferta real de la plantilla indicada (instanciada por el motor).
function offer(h,template,at=h.now){const A=A8(h),t=X8(h).TEMPLATES.find(x=>x.id===template),b=A.board(at),o=A.instantiate(t,'co-t-'+template,at);b.offers.push(o);return o;}
const queue=(s,from,to,extra={})=>({at:from,end:to,interval:60e3,currentRegion:s.currentRegion,season:s.season,habitat:s.habitat,time:s.time,method:'búsqueda automática',...extra});
const sightings=s=>Object.values(s.sightings||{}).reduce((a,b)=>a+(Number(b)||0),0);

// ── 33.1 Actividades anteriores a la aceptación ─────────────────────────────────────────────
test('MEC-09B · 1. búsquedas offline anteriores a la aceptación, procesadas después, no acreditan el encargo incremental',()=>{
 const h=game(),g=h.g,s=g.state,A=A8(h),T=h.now;
 offer(h,'obs-campo',T);assert.ok(A.accept('co-t-obs-campo',T));const c0=contract(h,'co-t-obs-campo');assert.equal(c0.acceptedAt,T);
 // Cola real anterior a la aceptación (dos horas antes) que se procesa ahora.
 s.autoPending=[queue(s,T-2*H,T-H)];h.now=T+10*60e3;const n0=sightings(s);g.processAutomaticSearches();
 assert.ok(sightings(s)>n0,'la cola produjo avistamientos reales');
 A.syncContracts(h.now);const c=contract(h,'co-t-obs-campo');
 assert.equal(A.progress(c)[0].value,0,'nada de lo anterior a acceptedAt acredita');assert.ok(c.objectives[0].excluded>0,'el aporte queda excluido');
 // Lo realizado después de la aceptación sí acredita.
 for(let i=0;i<5;i++){h.now+=61e3;g.encounter('manual',h.now,true);}
 assert.ok(A.progress(contract(h,'co-t-obs-campo'))[0].value>=5);
});

test('MEC-09B · 1b. la regla vale para proyectos y eventos; posesión e histórico usan el progreso previo',()=>{
 const h=game(),g=h.g,s=g.state,A=A8(h),occ=X8(h).occurrence(X8(h).EVENTS_BY_ID['noche-criaturas'],2027);
 // Evento aceptado tres horas después del inicio: observaciones nocturnas de la primera hora (procesadas tarde) no cuentan.
 const acc=occ.start+3*H;h.now=acc;assert.ok(A.acceptEvent('noche-criaturas-2027',acc));
 s.time='noche';for(let i=0;i<10;i++)g.encounter('manual',occ.start+H+i*61e3,true);
 A.syncContracts(h.now);const ev=contract(h,'ev-noche-criaturas-2027');assert.equal(ev.status,'aceptado');assert.ok(A.progress(ev).every(o=>o.value===0),'anteriores a la aceptación');
 // Proyecto: actividad efectiva anterior a la aceptación excluida (misma regla que la correspondencia).
 const h2=game(),s2=rich(h2),B=A8(h2),T=h2.now;s2.society.rank=20;offer(h2,'proy-paleo',T);assert.ok(B.accept('co-t-proy-paleo',T));
 B.activityScope(T-H,()=>{s2.museum.excavationsCompleted=(s2.museum.excavationsCompleted||0)+2;});
 assert.equal(B.progress(contract(h2,'co-t-proy-paleo'))[0].value,0);
 B.activityScope(T+H,()=>{s2.museum.excavationsCompleted+=1;});assert.equal(B.progress(contract(h2,'co-t-proy-paleo'))[0].value,1);
 // Posesión: lo expuesto antes de aceptar cuenta (no es incremental).
 const h3=game(),s3=rich(h3),C=A8(h3);s3.museum.wing=3;for(const id of Object.keys(h3.g.SPECIES).slice(0,6)){s3.discovered[id]=true;s3.museum.exhibits[id]=true;}
 offer(h3,'exhibicion',h3.now);assert.ok(C.accept('co-t-exhibicion',h3.now));C.syncContracts(h3.now);
 const ex=contract(h3,'co-t-exhibicion');assert.equal(ex.objectives[0].mode,'posesion');assert.ok(['completado','aceptado'].includes(ex.status));assert.ok(C.progress(ex)[0].value>0);
});

// ── 33.2 Procesamiento cronológico durante el cierre de eventos ─────────────────────────────
test('MEC-09B · 2. una expedición posterior al cierre liquidada antes que una cola anterior no provoca caducidad',()=>{
 const h=game(),g=h.g,s=rich(h),A=A8(h),end=X8(h).occurrence(X8(h).EVENTS_BY_ID['noche-criaturas'],2027).end;
 h.now=end-6*H;assert.ok(A.acceptEvent('noche-criaturas-2027',h.now));
 // Cola real de búsquedas nocturnas anteriores al cierre, aún sin procesar.
 s.time='noche';s.autoPending=[queue(s,end-2*H,end-30*60e3,{time:'noche'})];
 // Expedición real que termina DESPUÉS del cierre y se liquida primero (processVoyages).
 const v=g.VOYAGES.find(x=>g.voyageConditions3280(x).every(c=>c.met));assert.ok(v);s.mec06.camera='nunca';assert.ok(g.sail(v.id));
 const job=s.voyages.at(-1);job.endAt=end+10*60e3;h.now=end+2*H;assert.equal(g.processVoyages(h.now),1);
 assert.equal(contract(h,'ev-noche-criaturas-2027').status,'aceptado','la cola anterior al cierre sigue pendiente: no caduca');
 assert.ok(A.horizon(h.now)<end);
 // Se procesa la cola con sus fechas efectivas y, si hace falta, búsquedas manuales con fecha anterior al cierre.
 g.processAutomaticSearches();assert.equal(s.autoPending.length,0);
 let c=contract(h,'ev-noche-criaturas-2027');
 for(let i=0;c.status==='aceptado'&&i<12;i++){g.encounter('manual',end-20*60e3+i*61e3,true);c=contract(h,'ev-noche-criaturas-2027');}
 assert.equal(c.status,'completado');assert.ok(c.completedAt<end,'fecha efectiva anterior al cierre');
});

test('MEC-09B · 2b. sin actividad anterior pendiente, la actividad posterior al cierre no acredita y el evento caduca en endsAt',()=>{
 const h=game(),g=h.g,s=g.state,A=A8(h),end=X8(h).occurrence(X8(h).EVENTS_BY_ID['noche-criaturas'],2027).end;
 h.now=end-6*H;assert.ok(A.acceptEvent('noche-criaturas-2027',h.now));
 s.time='noche';s.autoPending=[queue(s,end+H,end+2*H,{time:'noche'})];h.now=end+3*H;g.processAutomaticSearches();
 const c=contract(h,'ev-noche-criaturas-2027');assert.equal(c.status,'caducado');assert.equal(c.endedAt,end);assert.ok(c.objectives.every(o=>!o.reached));
});

// ── 33.3 Viabilidad al aceptar ──────────────────────────────────────────────────────────────
test('MEC-09B · 3. aceptar comprueba de nuevo la viabilidad: bloquea con motivo, sin penalización y sin regenerar la oferta',()=>{
 const h=game(),g=h.g,s=rich(h),A=A8(h),T=h.now;
 // Oferta de regiones (visitedAll) viable al generarse; después todas las regiones accesibles quedan visitadas.
 const o=offer(h,'regiones',T);const before=J(o);assert.ok(A.acceptCheck(o.id,T).ok);
 for(const r of g.REGIONS)s.regionsVisited[r.id]=true;
 const m0=s.money,k0=s.knowledge,p0=s.prestige,chk=A.acceptCheck(o.id,T);
 assert.equal(chk.ok,false);assert.ok(chk.reasons.some(r=>/regiones accesibles sin visitar: 0/.test(r)),JSON.stringify(chk.reasons));
 assert.equal(A.accept(o.id,T),false);assert.equal(contract(h,o.id),undefined);
 assert.equal(s.money,m0);assert.equal(s.knowledge,k0);assert.equal(s.prestige,p0);
 deq(s.mec08.board.offers.find(x=>x.id===o.id),before,'la oferta se conserva tal cual');
 // Recargar no regenera el tablero del periodo.
 const h2=reopen(h);deq(h2.g.state.mec08.board.offers.map(x=>x.id),s.mec08.board.offers.map(x=>x.id));
 // La interfaz muestra el motivo y desactiva el botón.
 const html=A.contractsSection?A.contractsSection():'';if(html)assert.match(html,/regiones accesibles sin visitar/);
});

test('MEC-09B · 3b. AVAIL no usa Infinity como única evidencia',()=>{
 const h=game(),A=A8(h);
 for(const [k,f] of Object.entries(A.AVAIL)){const a=f();assert.ok(Number.isFinite(a.n),k+' finito');assert.equal(typeof a.why,'string',k);assert.equal(typeof a.repeatable,'boolean',k);}
 // Partida nueva: sin Taller II ni instrumentos no hay estudios posibles, sin Caravana II no hay piezas comerciables.
 assert.equal(A.AVAIL.studies().n,0);assert.equal(A.AVAIL['pieces:comercio']().n,0);assert.equal(A.AVAIL.demos().n,0);
 assert.ok(A.AVAIL.sightingsTotal().n>0);assert.ok(A.AVAIL['counter:crafted']().n>0);
});

// ── 33.4 Progresión inicial sin ayudas (controlador desde partida nueva) ───────────────────────
test('MEC-09B · 4. progresión inicial real: de partida nueva a Asia sin ayudas de desarrollo',()=>{
 const {run}=require('../scripts/mec09b-progression.cjs');const {log,h}=run({seed:31,maxSteps:130});const s=h.g.state,ms=new Set(log.milestones.map(m=>m.id));
 assert.equal(log.initial.discovered,0);assert.equal(log.initial.purchases,0);assert.deepEqual(log.initial.unlocked.length,1);
 for(const id of ['primer-avistamiento','primera-investigacion','primera-monografia','primera-receta','primera-expedicion','primera-exhibicion','rango-3','mapa-asia_map','region-Asia'])assert.ok(ms.has(id),id);
 assert.ok(!s.devMode&&!s.debug,'sin modo de desarrollo');assert.ok(h.x.AtlasMEC04.rank(s)>=4);
});

// ── 4.5 Revisión individual de fallos históricos (reglas genéricas R12 y «deep-equal» de MEC-09A) ─────
// Presencias citadas en los fallos históricos: con las compuertas y métodos vigentes siguen siendo descubribles.
// Correspondencia completa: docs/mec09b/correspondencia-pruebas-historicas.csv.
test('MEC-09B · 4.5 presencias citadas en fallos históricos se descubren con las reglas vigentes',()=>{
 const audit=require('../scripts/audit-mec09b.cjs'),h=audit.game(),s=audit.prepared(h),g=h.g;
 const seasons=['primavera','verano','otono','invierno'],times=['amanecer','dia','atardecer','noche'];
 const can=(rid,sp)=>{const r=g.REGIONS.find(x=>x.id===rid);assert.ok(r&&r.species.includes(sp),rid+' '+sp);let manual=false,auto=false;
  for(const se of seasons)for(const hb of r.habitats)for(const t of times){if(g.eligibleSpecies(r.id,hb,t,se).includes(sp))manual=true;for(const m of [undefined,'sondeo','muestreo','extraordinario'])if(g.automaticEligibleSpecies(r.id,se,{habitat:hb,time:t,method:m}).includes(sp))auto=true;}
  return {manual,auto};};
 assert.ok(can('profundo_atlantico_profundo_norte','mar_esp_architeuthis_dux').auto,'calamar gigante con «muestreo»');
 for(const [r,sp] of [['mar_atlantico_septentrional','frailecillo_atlantico'],['polar_hielo_artico_occidental','polar_esp_pagophila_eburnea'],['sa_caribe_sudamericano','na_esp_pelecanus_occidentalis']]){const c=can(r,sp);assert.ok(c.manual&&c.auto,r+' '+sp);}
 const rows=fs.readFileSync(path.join(__dirname,'..','docs','mec09b','correspondencia-pruebas-historicas.csv'),'utf8').trim().split('\n').slice(1);
 assert.equal(rows.length,42);assert.ok(rows.every(l=>!/;Revisar;/.test(l)&&/tests\//.test(l)),'cada fallo con veredicto y prueba equivalente');
});

// ── 33.26 Placas daguerrotípicas con procedencia ───────────────────────────────────────────
function photoGame(){const h=game(),g=h.g,s=rich(h),A=A6(h);assert.ok(A.buildArtifact('camara_daguerrotipos'));assert.ok(A.setLocation('camara_daguerrotipos','campamento'));
 const v=g.VOYAGES.find(x=>g.voyageConditions3280(x).every(c=>c.met)&&A.destinationPool(x.id).length);assert.ok(v);s.mec06.camera='siempre';return {h,g,s,A,v};}
test('MEC-09B · 26a. lotes: el stock virgen coincide con el inventario y cada alta guarda su origen',()=>{
 const {h,g,s}=photoGame(),P=PL(h);P.reconcile();
 assert.equal(P.available(),s.inventory.placa_daguerrotipo||0);
 g.addInventory('placa_daguerrotipo',3);assert.equal(P.available(),s.inventory.placa_daguerrotipo);
 const last=P.lots().filter(l=>l.kind==='virgen').at(-1);assert.equal(last.qty,3);assert.notEqual(last.origin,P.UNKNOWN);assert.ok(Number.isFinite(last.at));
 for(const l of P.lots())assert.ok(['virgen','expuesta','revelada'].includes(l.kind));
});
test('MEC-09B · 26b. exponer (FIFO), liquidar y revelar: una sola imagen por placa y evidencia del destino',()=>{
 const {h,g,s,A,v}=photoGame(),P=PL(h);s.inventory.placa_daguerrotipo=0;P.reconcile();
 const lots0=P.lots().length;g.addInventory('placa_daguerrotipo',1);const first=P.lots().filter(l=>l.kind==='virgen').at(-1);g.addInventory('placa_daguerrotipo',1);
 assert.equal(P.lots().length,lots0+2);
 assert.ok(g.sail(v.id));const job=s.voyages.at(-1);assert.equal(s.inventory.placa_daguerrotipo,1);
 let ex=P.lots().find(l=>l.kind==='expuesta'&&l.jobId===job.id);assert.ok(ex);assert.equal(ex.from,first.id,'FIFO: el lote más antiguo');assert.equal(ex.origin,first.origin);
 deq(ex.continents,[...K(h).voyageDestinations[v.id].continents]);assert.equal(P.available(),1);
 assert.equal(P.exposed(),0,'a bordo: aún no es revelable');
 // Liquidación sin imagen (tirada fallida): queda expuesta y disponible para el Taller.
 h.rng.force=0.999;try{g.resolveVoyageReward(job,job.endAt);}finally{h.rng.force=null;}
 ex=P.lots().find(l=>l.jobId===job.id);assert.equal(ex.kind,'expuesta');assert.ok(Number.isFinite(ex.settledAt));assert.equal(P.exposed(),1);
 // Revelado en el Taller: usa la placa expuesta (no la virgen) y solo imágenes de su destino.
 assert.ok(A.buildArtifact('camara_oscura'));assert.ok(A.setLocation('camara_oscura','taller'));
 const chk=A.studyCheck('revelado-placas');assert.ok(chk.ok,JSON.stringify(chk.reasons));assert.equal(chk.consume.placa_daguerrotipo,undefined);
 assert.ok(A.runStudy('revelado-placas',h.now,()=>0));assert.equal(s.inventory.placa_daguerrotipo,1,'la virgen no se consume');
 const rev=P.lots().find(l=>l.jobId===job.id);assert.equal(rev.kind,'revelada');assert.equal(rev.developedIn,'taller');
 const rec=s.mec06.history.at(-1);if(rec.photo){assert.equal(rev.result,rec.photo.id);assert.ok(K(h).pieces[rec.photo.id].findIn.some(c=>ex.continents.includes(c)),'imagen del destino');}
 // No hay doble recompensa: la placa revelada no vuelve a revelarse.
 assert.equal(P.exposed(),0);assert.equal(P.lots().filter(l=>l.jobId===job.id).length,1);
});
test('MEC-09B · 26c. con imagen al volver, la placa queda revelada en el Campamento y no puede revelarse otra vez',()=>{
 const {h,g,s,A,v}=photoGame(),P=PL(h);s.inventory.placa_daguerrotipo=1;P.reconcile();assert.ok(g.sail(v.id));const job=s.voyages.at(-1);
 h.rng.force=0;try{g.resolveVoyageReward(job,job.endAt);}finally{h.rng.force=null;}
 const l=P.lots().find(x=>x.jobId===job.id);assert.equal(l.kind,'revelada');assert.equal(l.developedIn,'campamento');assert.ok(K(h).pieces[l.result]);assert.equal(P.exposed(),0);
});
test('MEC-09B · 26d. sin placa expuesta se mantiene la regla de MEC-06 (placa virgen) y el lote conserva su procedencia',()=>{
 const h=game(),s=rich(h),A=A6(h),P=PL(h);assert.ok(A.buildArtifact('camara_oscura'));assert.ok(A.setLocation('camara_oscura','taller'));
 s.inventory.placa_daguerrotipo=0;P.reconcile();h.g.addInventory('placa_daguerrotipo',1);const v=P.lots().find(l=>l.kind==='virgen');
 const chk=A.studyCheck('revelado-placas');assert.ok(chk.ok);assert.equal(chk.consume.placa_daguerrotipo,1);
 assert.ok(A.runStudy('revelado-placas',h.now,()=>0.99));assert.equal(s.inventory.placa_daguerrotipo,0);assert.equal(P.available(),0);
 const r=P.lots().find(l=>l.kind==='revelada');assert.equal(r.from,v.id);assert.equal(r.origin,v.origin);assert.equal(r.continents,null);
});
test('MEC-09B · 26e. migración: placas anteriores sin procedencia inventada, viajes con cámara en curso y persistencia',()=>{
 const h=game(),s=rich(h);s.inventory.placa_daguerrotipo=4;delete s.mec06.plates;
 s.voyages=[{id:77,type:'coast',startedAt:h.now-H,endAt:h.now+H,mec06:{schema:1,instruments:{camara_daguerrotipos:{plate:1,chance:0.5}}}}];
 const h2=game({store:{[KEY]:(h.g.persist(),h.store[KEY])},now:h.now}),P=PL(h2),lots=P.lots();
 assert.equal(P.available(),4);assert.ok(lots.filter(l=>l.kind==='virgen').every(l=>l.origin===P.UNKNOWN&&l.at===null),'procedencia desconocida, sin inventar');
 const ex=lots.find(l=>l.kind==='expuesta'&&l.jobId===77);assert.ok(ex);assert.equal(ex.origin,P.UNKNOWN);
 // Idempotente y persistente.
 const h3=reopen(h2);deq(PL(h3).lots(),lots);assert.equal(PL(h3).available(),h3.g.state.inventory.placa_daguerrotipo);
});

// ── 33.27 Encargos avanzados por perfil de jugador ─────────────────────────────────────────
test('MEC-09B · 27. encargos por perfil: toda oferta generada es viable y se puede aceptar (o se informa el motivo)',()=>{
 const audit=require('../scripts/audit-mec09b.cjs');const rows=audit.contracts();
 assert.ok(rows.length>=7);for(const r of rows){assert.equal(r.objetivos_inviables,0,r.perfil);assert.equal(r.bloqueadas_al_aceptar,0,r.perfil);assert.ok(r.ofertas>0,r.perfil);}
 assert.ok(rows.some(r=>r.evidencia==='D'&&r.perfil!=='inicial'),'al menos un perfil procede del controlador');
 // Las 13 plantillas de correspondencia y los 7 proyectos aparecen en algún perfil.
 const seen=new Set(rows.flatMap(r=>r.plantillas.split(' ').filter(Boolean).map(x=>x.split('×')[0])));
 const h=game();for(const t of X8(h).TEMPLATES)assert.ok(seen.has(t.id),'plantilla ofrecida: '+t.id);
});

// ── 33.29 Conservación de partidas anteriores ──────────────────────────────────────────────
const corpus=require('./fixtures/mec09a-saves.json');
for(const c of corpus)test('MEC-09B · 29. partida '+c.label+': carga, placas coherentes y recarga idempotente',()=>{
 const h=game({store:{[KEY]:c.raw}}),s=h.g.state,P=PL(h);
 assert.equal(P.available(),s.inventory.placa_daguerrotipo||0);
 for(const c8 of JSON.parse(c.raw).mec08?.contracts||[]){assert.ok(s.mec08.contracts.some(x=>x.id===c8.id),'encargo '+c8.id);}
 const once=J(reopen(h).g.state),twice=J(game({store:{[KEY]:JSON.stringify(once)}}).g.state);
 for(const k of ['money','knowledge','inventory','mec06','mec08','collectionRegistry'])deq(twice[k],once[k],'idempotente: '+k);
});

// ── Versión: 5.6.9 Beta se mantiene; etiqueta de compilación MEC-09B; sin APK ─────────────────
test('MEC-09B · V 5.6.9 Beta con etiqueta MEC-09B, mec09b en release:verify y sin APK',()=>{
 const root=path.join(__dirname,'..'),pkg=require('../package.json'),rel=require('../www/atlas-release.json');
 assert.equal(pkg.version,'5.6.9');assert.equal(rel.version,'5.6.9');assert.equal(rel.build,'MEC-09B');assert.equal(rel.v569b.apk,false);assert.equal(rel.v569.apk,false);
 assert.match(pkg.scripts['release:verify'],/tests\/mec09b\.test\.cjs/);assert.match(pkg.scripts['release:verify'],/tests\/mec09b-catalog\.test\.cjs/);
 const html=fs.readFileSync(path.join(root,'www','index.html'),'utf8');assert.match(html,/MEC-09B/);assert.match(html,/js\/mec09b-geography\.js/);
 assert.match(fs.readFileSync(path.join(root,'www','sw.js'),'utf8'),/mec09b-geography\.js/);
 const apk=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git'].includes(e.name))continue;const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(/\.apk$/i.test(e.name))apk.push(f);}};
 walk(root);assert.equal(apk.length,0,'MEC-09B no genera ni versiona ninguna APK');
});
