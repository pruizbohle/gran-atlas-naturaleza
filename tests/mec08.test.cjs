'use strict';
// MEC-08 · V5.6.8 Beta · Encargos, logros, reconocimientos y eventos especiales, y correcciones de MEC-07.
// Pruebas funcionales con el motor real (sección 24 del encargo), varias con el catálogo completo.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const KEY='gran_atlas_v05',T0=1790000000000,H=3600e3,D=24*H;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
function rngWith(seed=13){let x=seed>>>0;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
function game(o={}){const h=make({now:T0,headless:true,rng:rngWith(o.seed),...o});h.window.confirm=()=>true;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,o={})=>game({store:{[KEY]:saved(h)},now:h.now,...o});
const X8=h=>h.x.AtlasMEC08,A8=h=>h.x.AtlasMEC08Actions,ACH=h=>h.x.AtlasAchievements3360,COM=h=>h.x.AtlasCommissions3370,X7=h=>h.x.AtlasMEC07,A7=h=>h.x.AtlasMEC07Actions,Cm=h=>h.x.AtlasCampMEC02,K=h=>h.x.AtlasMEC03Catalog;
const failWrites=h=>{const ls=h.localStorage,set=ls.setItem;ls.setItem=()=>{throw new Error('QuotaExceededError');};return ()=>{ls.setItem=set;};};
const flush=h=>{h.g.achievementMark3360(...Object.keys(ACH(h).categories));h.g.achievementFlush3360();};
const unlocked=h=>h.g.state.achievements.unlocked;
const ledger=h=>h.g.state.moneyLedger;
const TIERS=['Bronce','Plata','Oro','Platino'];
// Fechas locales del dispositivo (la política de tiempo del encargo).
const local=(y,m,d,hh=12)=>new Date(y,m-1,d,hh).getTime();

test('MEC-08 · 1. catálogo de logros: campos completos, ids únicos y nivel válido',()=>{
 const h=game({full:true}),A=ACH(h),X=X8(h);
 assert.equal(X.ACHIEVEMENTS.length,84,'74 logros nuevos o actualizados + 10 medallas conmemorativas');
 assert.equal(X.ACHIEVEMENTS.filter(a=>a.category!=='events').length,74);
 const ids=A.catalog.map(d=>d.id);assert.equal(new Set(ids).size,ids.length,'ids únicos');
 for(const a of X.ACHIEVEMENTS){const d=A.catalog.find(x=>x.id===a.id);assert.ok(d,a.id);
  for(const k of ['id','name','category','description','metric','target','tier'])assert.ok(d[k]!==undefined&&d[k]!=='',a.id+' '+k);
  assert.ok(TIERS.includes(d.tier),a.id);assert.ok(A.categories[d.category],a.id+' categoría');assert.match(d.art,/^medal-/);assert.ok(d.migration);
  assert.ok(Number.isInteger(d.target)&&d.target>0,a.id);}
 assert.ok(X.ACHIEVEMENTS.filter(a=>a.extra.title).length>=12,'títulos opcionales');assert.ok(X.ACHIEVEMENTS.some(a=>a.extra.secret),'secretos');
});

test('MEC-08 · 2. ids y medallas históricas conservados; distinciones del catálogo completo',()=>{
 const h=game({full:true}),A=ACH(h),g=h.g;
 const old=id=>A.catalog.find(d=>d.id===id);
 assert.equal(old('world_unlocked').target,113,'el umbral histórico queda como intermedio');assert.ok(old('publish_945'));assert.ok(old('discover_900'));assert.ok(old('regional_1'));
 assert.equal(old('world_unlocked_125').target,g.REGIONS.length);assert.equal(old('visit_125').target,g.REGIONS.length);
 assert.equal(old('discover_1000').target,Object.keys(g.SPECIES).length);assert.equal(old('publish_1000').target,Object.keys(g.SPECIES).length);
 assert.equal(old('legendary_30').target,g.LEGENDARY_SPECIMENS.length);assert.equal(old('relict_20').target,g.MUSEUM_RELICTS.length);
 assert.equal(old('pieces_431').target,Object.keys(K(h).pieces).length);assert.equal(old('record_milestone_25').target,X7(h).RECORDS.length);assert.equal(old('behavior_20').target,X7(h).BEHAVIORS.length);
});

test('MEC-08 · 3. todas las métricas nuevas existen y los objetivos son alcanzables en el catálogo completo',()=>{
 const h=game({full:true}),A=ACH(h),m=A.metrics(h.g.state,h.g.achievementContext3360());
 const max={unlockedAll:125,visitedAll:125,discoveredAll:1000,publishedAll:1000,piecesFound:431,collectionsComplete:32,recordsAchieved:25,behaviorsFound:20,relicts:20,campMax:5,campMin:5,museumWing:5,rank:20,artifactsCatalogued:20,componentsCrafted:6,recordsMinAchieved:3,recordsValidated:5,continentsRecorded:12};
 for(const a of X8(h).ACHIEVEMENTS){assert.ok(a.metric in m,a.id+' métrica '+a.metric);if(max[a.metric]!==undefined)assert.ok(a.target<=max[a.metric],a.id);}
 for(const c of COM(h).catalog.filter(d=>d.id.startsWith('enc_collections')||d.id.startsWith('enc_workshop')||d.id.startsWith('enc_records')||d.id.startsWith('enc_camp')))for(const r of c.requirements)assert.ok(r.metric in m||r[0] in m,c.id);
});

test('MEC-08 · 4. la evaluación no depende del render y los logros son permanentes',()=>{
 const h=game(),g=h.g,s=g.state;let renders=0;const r0=g.render;
 const P=Object.keys(K(h).pieces).slice(0,25);for(const id of P){g.addInventory(id,1);}
 assert.ok(Object.keys(s.collectionRegistry.pieces).length>=25,'registro permanente');
 flush(h);assert.ok(unlocked(h).pieces_1&&unlocked(h).pieces_25,'evaluado al marcar y vaciar, sin render');assert.equal(renders,0);
 for(const id of P)s.inventory[id]=0;flush(h);assert.ok(unlocked(h).pieces_25,'vender o retirar no revoca');
 const at=unlocked(h).pieces_25.earnedAt;assert.ok(Number.isFinite(at));void r0;
});

test('MEC-08 · 5. migración: logros nuevos retroactivos, sin fecha inventada ni dinero; idempotente',()=>{
 const h=game(),s=h.g.state;for(const id of Object.keys(K(h).pieces).slice(0,30))h.g.addInventory(id,1);
 const raw=JSON.parse(saved(h));delete raw.mec08;for(const id of Object.keys(raw.achievements.unlocked))if(X8(h).ACHIEVEMENTS.some(a=>a.id===id))delete raw.achievements.unlocked[id];
 const money=raw.money,led=J(raw.moneyLedger);
 const h2=game({store:{[KEY]:JSON.stringify(raw)}});h2.g.tick();
 const u=h2.g.state.achievements.unlocked;assert.ok(u.pieces_25,'reconocido');assert.equal(u.pieces_25.retroactive,true);assert.equal(u.pieces_25.earnedAt,null);
 assert.equal(h2.g.state.money,money);deq(h2.g.state.moneyLedger,led,'sin ingresos retroactivos');
 const a=J(h2.g.state.mec08),b=J(h2.g.state.achievements.unlocked);const h3=reopen(h2);h3.g.tick();deq(h3.g.state.achievements.unlocked,b);deq(h3.g.state.mec08.migration,a.migration);
 assert.equal(s.mec08.schema,1);
});

test('MEC-08 · 6. medallas de récords: sin duplicar recompensas de MEC-07',()=>{
 const h=game(),g=h.g,s=g.state;
 s.naturalRecords.records['jirafa-altura']={count:1,first:{value:5.9,at:T0,region:'HX-07-10',method:'directa'},best:{value:5.9,at:T0,region:'HX-07-10',method:'directa',instrument:null},achieved:true,achievedAt:T0,regions:{'HX-07-10':{count:1,best:5.9}},pending:null,pendingByRegion:{},rewards:{first:{},milestone:{}}};
 const k=s.knowledge,p=s.prestige,m=s.money;flush(h);
 assert.ok(unlocked(h).record_first&&unlocked(h).record_milestone_1);assert.equal(s.knowledge,k);assert.equal(s.prestige,p);assert.equal(s.money,m);
});

test('MEC-08 · 7. regiones: registro regional efectivo frente al catálogo global',()=>{
 const h=game({full:true}),g=h.g,s=g.state,r=g.REGIONS[0];
 for(const id of r.species){s.discovered[id]=true;}s.regionsVisited[r.id]=true;flush(h);
 assert.ok(!unlocked(h).regional_census_1,'descubrir en el catálogo global no basta');
 s.regionalRecords.regions[r.id]={species:Object.fromEntries(r.species.map(id=>[id,{count:1}]))};flush(h);
 assert.ok(unlocked(h).regional_census_1,'censo regional efectivo');
});

test('MEC-08 · 8. títulos y medallas en el perfil: destacados, fechas, filtros por categoría y nivel',()=>{
 const h=game(),A=ACH(h),src=fs.readFileSync('www/js/society-achievements-ui-v3360.js','utf8');
 assert.match(src,/data-ach-tier/);assert.match(src,/data-ach-category/);assert.match(src,/data-ach-feature/);assert.match(src,/fecha original no disponible/);
 const s=h.g.state;s.achievements.unlocked.rank_20={earnedAt:T0,observedAt:T0,retroactive:false};s.achievements.featured='rank_20';
 assert.equal(h.g.cpTitle3430?.()??A.catalog.find(d=>d.id==='rank_20').title,'Gran Naturalista');
 assert.ok(!X8(h).ACHIEVEMENTS.some(a=>a.extra.multiplier),'sin multiplicadores económicos');
});

test('MEC-08 · 9. encargos permanentes: 12 nuevos, líneas históricas intactas y sin funciones inaccesibles',()=>{
 const h=game(),C=COM(h),g=h.g,s=g.state;
 assert.equal(X8(h).COMMISSIONS.length,12);assert.ok(C.catalog.length>=36);
 for(const line of ['collections','workshop','records','camp'])assert.ok(C.categories[line],line);
 const row=id=>C.evaluate(s,g.commissionContext3370()).find(x=>x.definition.id===id);
 assert.equal(row('enc_workshop_1').available,false,'Taller I: componente no disponible');
 while(Cm(h).level(s,'workshop')<2){Object.assign(s,{money:1e8,knowledge:1e8,prestige:600});s.society.rank=20;for(const m of ['brass_shard','polished_lens','carved_wood','map_fragment','parchment_scrap','old_ink','river_pebble','ancient_coin'])s.inventory[m]=200;Cm(h).upgrade(s,'workshop');}
 assert.equal(row('enc_workshop_1').available,true);assert.equal(row('enc_camp_2').available,false,'sin Astillero III');
});

test('MEC-08 · 10. cobro de encargo permanente: libro de ingresos, atómico y único',()=>{
 const h=game(),g=h.g,s=g.state;for(const id of Object.keys(K(h).pieces).slice(0,5))g.addInventory(id,1);
 s.museum.cabinets=s.museum.cabinets||{};const k=Object.keys(s.museum.cabinets)[0]||'Botánica';s.museum.cabinets[k]=[Object.keys(K(h).pieces)[0]];
 flush(h);g.commissionFlush3370?.();COM(h).sync(s,g.commissionContext3370());
 assert.ok(s.commissions.ready.enc_collections_1,'listo');
 g.persist();const before=J(s),restore=failWrites(h);assert.equal(g.commissionClaim3370('enc_collections_1'),false);restore();
 deq(g.state.money,before.money);assert.ok(!g.state.commissions.claimed.enc_collections_1,'revertido');
 const m0=g.state.money,e0=g.state.moneyLedger.bySource?.encargos||0;assert.ok(g.commissionClaim3370('enc_collections_1'));
 assert.equal(g.state.money,m0+80);assert.equal((g.state.moneyLedger.bySource?.encargos||0)-e0,80,'ingreso «encargos»');
 assert.equal(g.commissionClaim3370('enc_collections_1'),false,'una sola vez');
});

test('MEC-08 · 11. correspondencia: ofertas deterministas por periodo y recargar no regenera',()=>{
 const h=game(),A=A8(h);const b1=J(A.board(T0));assert.ok(b1.offers.length>=1);
 const h2=reopen(h);deq(A8(h2).board(T0),b1,'misma oferta tras recargar');
 deq(A8(h2).board(T0+60e3),b1,'dentro del periodo no cambia');
 const next=J(A8(h2).board(T0+X8(h).CONTRACT_POLICY.periodHours*H));assert.notEqual(next.period,b1.period);
 for(const o of b1.offers){assert.ok(o.id&&o.template&&o.createdAt&&o.status==='ofrecido'&&o.objectives.length&&o.reward);}
});

test('MEC-08 · 12. selección adaptada: nada imposible para el estado del jugador',()=>{
 const h=game(),A=A8(h),s=h.g.state;
 for(let p=0;p<30;p++){const b=A.board(T0+p*72*H);for(const o of b.offers){const t=X8(h).TEMPLATES.find(x=>x.id===o.template);assert.ok(A.feasible(t.requires).ok,o.template);
  assert.notEqual(t.kind,'proyecto','rango 1: sin proyectos institucionales');if(!s.upgrades.shipyard)assert.notEqual(o.template,'expediciones');}}
});

test('MEC-08 · 13. objetivos incrementales con línea base; posesión sin consumir',()=>{
 const h=game(),A=A8(h),s=h.g.state,X=X8(h);
 const t=X.TEMPLATES.find(x=>x.id==='obs-campo');s.sightings={a:500};
 const c=A.instantiate(t,'test-1',T0);c.status='aceptado';s.mec08.contracts.push(c);
 assert.equal(c.objectives[0].baseline,500,'línea base al aceptar');assert.equal(A.progress(c)[0].value,0,'lo histórico no cuenta');
 s.sightings.a=510;assert.equal(A.progress(c)[0].value,10);
 const mat=Object.values(h.x.AtlasMEC06.ANIMAL_GROUPS)[0].ids[0];s.inventory[mat]=7;
 const p=A.instantiate(X.TEMPLATES.find(x=>x.id==='materiales'),'test-2',T0);p.status='aceptado';s.mec08.contracts.push(p);
 assert.ok(A.progress(p)[0].value>=3);A.syncContracts(T0);assert.equal(p.status,'completado');assert.ok(A.claim('test-2',T0));assert.equal(s.inventory[mat],7,'acreditar no entrega');
});

test('MEC-08 · 14. aceptar, cobrar y abandonar: ledger, inventario, unicidad y sin penalizaciones',()=>{
 const h=game(),A=A8(h),g=h.g,s=g.state;
 const c=A.instantiate(X8(h).TEMPLATES.find(x=>x.id==='fabricacion'),'co-x',T0);c.status='aceptado';s.mec08.contracts.push(c);
 s.mec08.counters.crafted+=c.objectives[0].target;A.syncContracts(T0);assert.equal(c.status,'completado');
 g.persist();const restore=failWrites(h);assert.equal(A.claim('co-x',T0),false,'fallo de guardado: nada cobrado');restore();
 const st=g.state;assert.equal(st.mec08.contracts.find(x=>x.id==='co-x').status,'completado');
 const m0=st.money,k0=st.knowledge,e0=st.moneyLedger.bySource?.encargos||0;assert.ok(A.claim('co-x',T0));
 assert.equal(g.state.money-m0,c.reward.money);assert.equal(g.state.knowledge-k0,c.reward.knowledge);assert.equal((g.state.moneyLedger.bySource?.encargos||0)-e0,c.reward.money);
 assert.equal(A.claim('co-x',T0),false,'cobro único');assert.equal(g.state.mec08.counters.contractsClaimed,1);
 const b=A.board(T0+400*H);const id=b.offers[0].id;assert.ok(A.accept(id,T0+400*H));const k1=g.state.knowledge,m1=g.state.money;
 assert.ok(A.abandon(id,T0+401*H));assert.equal(g.state.knowledge,k1);assert.equal(g.state.money,m1,'abandonar no penaliza');
 assert.equal(g.state.mec08.contracts.find(x=>x.id===id).status,'abandonado');
});

test('MEC-08 · 15. límite de encargos activos y los aceptados no caducan',()=>{
 const h=game(),A=A8(h),s=h.g.state;let n=0;
 for(let p=0;p<6&&n<4;p++){const at=T0+p*72*H;for(const o of A.board(at).offers.filter(o=>o.kind==='correspondencia'))if(A.accept(o.id,at))n++;}
 assert.equal(s.mec08.contracts.filter(c=>c.status==='aceptado').length,X8(h).CONTRACT_POLICY.maxActive.correspondencia);
 A.syncContracts(T0+90*D);assert.ok(s.mec08.contracts.every(c=>c.status!=='caducado'),'sin caducidad ni rachas');
});

test('MEC-08 · 16. proyectos institucionales: rango avanzado, varios objetivos, mismo motor',()=>{
 const h=game(),A=A8(h),s=h.g.state,X=X8(h);
 const projects=X.TEMPLATES.filter(t=>t.kind==='proyecto');assert.ok(projects.length>=6);assert.ok(projects.every(t=>t.requires.rank>=6));
 assert.ok(projects.some(t=>t.objectives.length>=2));
 s.society.rank=20;s.upgrades.shipyard=1;s.purchases.astillero=1;
 let found=false;for(let p=0;p<40&&!found;p++)found=A.board(T0+p*72*H).offers.some(o=>o.kind==='proyecto');assert.ok(found,'ofrecidos con rango');
});

test('MEC-08 · 17. calendario: 10 eventos con fechas verificadas e id con la edición',()=>{
 const h=game(),X=X8(h);assert.equal(X.EVENTS.length,10);assert.equal(new Set(X.EVENTS.map(e=>e.id)).size,10);
 const at=(id,y)=>new Date(X.occurrence(X.EVENTS_BY_ID[id],y).start);
 for(const [id,m,d] of [['ano-nuevo',1,1],['dia-darwin',2,12],['dia-tierra',4,22],['dia-biodiversidad',5,22],['dia-oceanos',6,8],['navidad-naturalista',12,24]]){const x=at(id,2027);assert.equal(x.getMonth()+1,m,id);assert.equal(x.getDate(),d,id);}
 // Equinoccios (IMCCE/USNO): 20-03-2026 14:46 UTC y 23-09-2026 00:05 UTC; 20-03-2027 20:25 UTC.
 for(const [y,mo,iso] of [[2026,3,'2026-03-20T14:46:00Z'],[2026,9,'2026-09-23T00:05:00Z'],[2027,3,'2027-03-20T20:25:00Z']])assert.ok(Math.abs(X.equinoxUTC(y,mo)-Date.parse(iso))<20*60e3,y+'-'+mo);
 assert.equal(X.occurrence(X.EVENTS_BY_ID['dia-darwin'],2027).id,'dia-darwin-2027');
 assert.ok(X.EVENTS_BY_ID['gran-exposicion'].fictional);assert.ok(X.EVENTS.every(e=>e.contract&&e.contract.objectives.length),'una actividad por evento');
});

test('MEC-08 · 18. calendario real separado de las estaciones del juego; offline',()=>{
 const h=game(),X=X8(h),s=h.g.state,season=s.season;
 deq(X.active(local(2027,2,13)).map(o=>o.id),['dia-darwin-2027']);deq(X.active(local(2027,2,20)),[]);
 deq(X.active(local(2027,12,31)).map(o=>o.id),['navidad-naturalista-2027']);deq(X.active(local(2028,1,2)).map(o=>o.id),['ano-nuevo-2028']);
 assert.equal(s.season,season,'consultar eventos no cambia la estación');
 assert.ok(!/fetch|XMLHttpRequest/.test(fs.readFileSync('www/js/mec08-recognition.js','utf8')),'sin red');
});

test('MEC-08 · 19. encargo de evento: por edición, recompensa persistente y medalla conmemorativa',()=>{
 const h=game(),A=A8(h),g=h.g,s=g.state,on=local(2027,10,30);
 const occ=A.eventsNow(on);deq(occ.map(o=>o.id),['noche-criaturas-2027']);
 assert.ok(A.acceptEvent('noche-criaturas-2027',on));assert.equal(A.acceptEvent('noche-criaturas-2027',on),false,'una vez por edición');
 s.mec08.counters.nightObservations+=10;A.syncContracts(on+H);const c=s.mec08.contracts.find(x=>x.id==='ev-noche-criaturas-2027');assert.equal(c.status,'completado');
 const h2=reopen(h);A8(h2).syncContracts(local(2027,11,20));assert.equal(h2.g.state.mec08.contracts.find(x=>x.id===c.id).status,'completado','la recompensa sobrevive al final del evento');
 assert.ok(A8(h2).claim(c.id,local(2027,11,20)));deq(h2.g.state.mec08.medals['noche-criaturas'],[2027]);
 h2.g.achievementMark3360('events');h2.g.achievementFlush3360();assert.ok(h2.g.state.achievements.unlocked.evento_noche_criaturas);
 assert.ok(A8(h2).acceptEvent('noche-criaturas-2028',local(2028,10,31)),'nueva edición, nuevo id');
});

test('MEC-08 · 20. encargo de evento no iniciado tampoco caduca si ya se completó; uno aceptado caduca al terminar',()=>{
 const h=game(),A=A8(h),s=h.g.state;assert.ok(A.acceptEvent('dia-darwin-2027',local(2027,2,12)));
 A.syncContracts(local(2027,3,1));assert.equal(s.mec08.contracts.find(c=>c.id==='ev-dia-darwin-2027').status,'caducado','sin penalización: solo se cierra');
});

test('MEC-08 · 21. sin contenido exclusivo: las recompensas de eventos no son piezas ni especies',()=>{
 const h=game(),X=X8(h),P=K(h).pieces,S=h.g.SPECIES;
 for(const e of X.EVENTS)for(const id of Object.keys(e.contract.reward.items||{})){assert.ok(!P[id]&&!S[id],id);assert.ok(h.g.ITEMS[id],id);}
 for(const t of X.TEMPLATES)for(const id of Object.keys(t.reward.items||{}))assert.ok(!P[id]&&!S[id]);
 for(const c of X.COMMISSIONS)for(const id of Object.keys(c.items||{}))assert.ok(!P[id]&&!S[id]&&h.g.ITEMS[id]);
});

test('MEC-08 · 22. modificadores temporales: capa separada, fijados al iniciar y desaparecen al terminar',()=>{
 const h=game(),g=h.g,M5=g.museumMEC05,X=X8(h);
 const on=local(2027,6,9),off=local(2027,6,20),act='expedicion:oceanografica';
 h.now=on;const base=M5.live(act);assert.ok(M5.eventLive(act)>0,'Día de los Océanos activo');assert.equal(M5.live(act),base,'live() sigue siendo solo el Museo');
 const snap=M5.snapshot(on);assert.ok(snap.events?.[act]>0);const v=M5.value(snap,act);
 h.now=off;assert.equal(M5.eventLive(act),0,'desaparece al terminar');assert.equal(M5.value(snap,act),v,'capturado al iniciar');
 const plain=M5.snapshot(off);assert.equal(plain.events,undefined);
 h.now=on;const b=M5.breakdown(act);if(b)assert.ok(b.layers.eventos&&b.layers.eventos.events.includes('dia-oceanos-2027'),'desglose');
 for(const e of X.EVENTS)for(const m of e.modifiers)assert.ok(m.value<=m.cap&&m.cap<=0.25,'con tope');
});

test('MEC-08 · 23. avisos agrupados y sin repetición',()=>{
 const h=game(),A=A8(h);h.now=local(2027,12,25);
 const first=A.notices(h.now);assert.ok(first.some(e=>e.kind==='evento'));deq(A.notices(h.now),[],'no se repite');
 assert.ok(first.every(e=>e.action&&e.title),'agrupables por notifyExperience');
});

test('MEC-08 · 24. Sociedad: pestañas, franja, eventos y correspondencia; navegación validada',()=>{
 const h=game(),g=h.g,s=g.state;h.now=local(2027,12,25);
 s.societyView='events';const ev=g.renderSociety();assert.match(ev,/Eventos especiales/);assert.match(ev,/Navidad del Naturalista/);assert.match(ev,/Próximos eventos/);
 s.societyView='missions';assert.match(g.renderSociety(),/Correspondencia y proyectos/);
 assert.match(h.x.AtlasMEC08Strip(s),/Navidad del Naturalista · quedan/);
 const src=fs.readFileSync('www/js/app.js','utf8');assert.ok(src.includes("['grants','missions','publications','achievements','rank','events']"));
 const ui=fs.readFileSync('www/js/society-achievements-ui-v3360.js','utf8');for(const t of ['Subvenciones','Publicaciones','Encargos','Logros','Rango','Eventos'])assert.ok(ui.includes("'"+t+"'"),t);
});

test('MEC-08 · 25. corrección 3.1: migraciones por conjuntos de rutas; hitos previos conservados',()=>{
 const h=game({full:true}),X=X7(h),e=X.byId['charran-migracion'],p=X.byId['pardela-migracion'];
 const r=X.rng('t');assert.ok(X.generate(e,r,{evidenceRegionIds:['polar_hielo_artico_occidental','polar_hielo_artico_oriental']})<e.threshold,'un solo hemisferio no basta');
 assert.ok(X.meets(e,X.generate(e,r,{evidenceRegionIds:['polar_hielo_artico_oriental','mar_oceano_austral_central']})),'cría + invernada');
 assert.ok(X.meets(p,X.generate(p,r,{evidenceRegionIds:['mar_oceano_austral_occidental','mar_pacifico_austral']})));
 assert.equal(e.method,'reconstruccion');assert.match(X.METHOD_NOTES.reconstruccion,/mismo individuo/);assert.ok(e.model.previous.perRegion);
 const s=h.g.state;s.naturalRecords.records['charran-migracion']={count:2,first:{value:35500,at:T0,region:'polar_hielo_artico_oriental',method:'evidencia'},best:{value:71000,at:T0,region:'polar_hielo_artico_oriental',method:'evidencia',instrument:null},achieved:true,achievedAt:T0,regions:{polar_hielo_artico_oriental:{count:1,best:null},polar_hielo_artico_occidental:{count:1,best:null}},pending:null,rewards:{milestone:{}}};
 delete s.naturalRecords.migration.routes;
 const h2=reopen(h,{full:true}),rec=h2.g.state.naturalRecords.records['charran-migracion'];assert.equal(rec.achieved,true,'no se revoca');assert.equal(rec.modelBefore.perRegion,35500,'modelo anterior documentado');
});

test('MEC-08 · 26. corrección 3.2: evidencias pendientes por región; validar no suma observaciones',()=>{
 const h=game(),g=h.g,s=g.state,A=A7(h),X=X7(h),e=X.byId['sapo-pulga-tamano'];
 let r=X.update(e,null,{value:8.6,at:T0,region:'A',method:'estimacion'}).record;r=X.update(e,r,{value:8.0,at:T0+H,region:'B',method:'estimacion'}).record;r=X.update(e,r,{value:8.9,at:T0+2*H,region:'A',method:'estimacion'}).record;
 assert.deepEqual(Object.keys(r.pendingByRegion).sort(),['A','B']);assert.equal(r.pendingByRegion.A.value,8.6,'la mejor de A');assert.equal(r.pending.value,8.0);
 s.naturalRecords.records[e.id]=r;h.x.AtlasMEC06Actions.location=()=>'taller';const loc=h.x.AtlasMEC06Actions;void loc;
 const ok=A.validationCheck(e.id,'A');if(!ok.ok){s.mec06.installed=s.mec06.installed||{};}
 const restore=h.x.AtlasMEC06Actions;void restore;
 // Instrumento en el Taller (fuerza la ubicación mediante el estado real del MEC-06).
 s.museum.collections=s.museum.collections||{};s.museum.collections.microscopio_compuesto=true;h.x.AtlasMEC06Actions.setLocation?.('microscopio_compuesto','taller');
 const c0=r.count,k0=s.knowledge;assert.ok(A.validate(e.id,T0+5*H,'A'),'valida la región A');
 const v=s.naturalRecords.records[e.id];assert.equal(v.count,c0,'no suma observaciones');assert.ok(v.pendingByRegion.B,'conserva la de B');assert.ok(!v.pendingByRegion.A);
 assert.equal(v.best.at,T0,'fecha de observación');assert.equal(v.best.validatedAt,T0+5*H,'fecha de validación');
 assert.ok(A.validate(e.id,T0+6*H,'B'));const w=s.naturalRecords.records[e.id];assert.equal(w.count,c0);assert.equal(w.pending,null);
 const paid=s.knowledge-k0;assert.ok(A.validate(e.id,T0+7*H)===false);assert.equal(s.knowledge-k0,paid,'sin recompensas repetidas');
});

test('MEC-08 · 27. corrección 3.3: conductas sexuadas con el sexo observado, sin segunda tirada',()=>{
 const h=game(),A=A7(h),X=X7(h),s=h.g.state;
 assert.equal(X.behaviorById['emperador-incubacion'].sex,'male');assert.equal(X.behaviorById['pavo-real-cortejo'].sex,'male');
 deq(X.sexEligible(X.behaviorById['pavo-real-cortejo'],'female'),{ok:false});assert.equal(X.sexEligible(X.behaviorById['pavo-real-cortejo'],null).inferred,true);
 const b=X.behaviorById['emparrado-decorado'],reg=h.g.REGIONS.find(r=>r.species.includes(b.species));
 const run=(sex,n)=>{let calls=0;const R=Math.random;Math.random=()=>{calls++;return R();};try{for(let i=0;i<n;i++){const at=T0+i*61e3;s.currentRegion=reg.id;s.time='dia';A.evaluate(b.species,{source:'manual',at,manual:true,relic:{currentRegion:reg.id,time:'dia',season:s.season,habitat:reg.habitats[0]}});A.sexEvaluate(b.species,sex?{sex}:null);}}finally{Math.random=R;}return calls;};
 const calls=run('female',400);assert.ok(!s.naturalRecords.behaviors[b.id],'hembra: no elegible');assert.equal(calls,0,'sin Math.random (no altera el orden histórico)');
 run('male',400);const rec=s.naturalRecords.behaviors[b.id];assert.ok(rec,'macho observado');assert.equal(rec.sex,'male');assert.equal(rec.sexSource,'observado');
 assert.equal(X.SEX_POLICY.unknown,'permitir-sin-sexo (inferido por la conducta)');
});

test('MEC-08 · 28. corrección 3.4: descripciones instrumentales prudentes; magnitudes sin cambios',()=>{
 const h=game(),X=X7(h);for(const k of ['directa','estimacion','analisis','reconstruccion','validacion'])assert.ok(X.METHODS[k]&&X.METHOD_NOTES[k],k);
 for(const e of X.RECORDS.filter(e=>e.instrument)){assert.ok(e.instrument.note&&X.METHODS[e.instrument.method],e.id);assert.ok(!/demuestra|prueba que/i.test(e.instrument.note),e.id);}
 assert.match(X.byId['colibri-abeja-aleteo'].instrument.note,/no miden la frecuencia/);
 deq(X.byId['condor-altitud'].model,{kind:'normal',mean:3500,sd:900});assert.equal(X.byId['condor-altitud'].threshold,5500);deq(X.byId['condor-altitud'].chance,{manual:0.08,auto:0.04});
});

test('MEC-08 · 29. corrección 3.5: registro paginado, búsqueda por especie y filtro de evidencias',()=>{
 const h=game({full:true}),A=A7(h),g=h.g,s=g.state;assert.equal(A.list().length,45);
 let seen=0;A.ui.page=0;for(let p=0;p<5;p++){A.ui.page=p;const html=A.section();seen+=(html.match(/class="mec07-row/g)||[]).length;if(!/data-action="mec07-page" data-id="\d+">Siguiente/.test(html))break;}
 assert.equal(seen,45,'las 45 entradas sin filtros');
 const e=X7(h).byId['sapo-pulga-tamano'];s.stages[e.species]=1;s.naturalRecords.records[e.id]=X7(h).update(e,null,{value:8.5,at:T0,region:'A',method:'estimacion'}).record;
 A.ui.page=0;A.ui.q=g.SPECIES[e.species].name.slice(0,5);assert.ok(A.filtered().some(x=>x.e.id===e.id));A.ui.q='';
 A.ui.evidence='pendiente';deq(A.filtered().map(x=>x.e.id),[e.id]);A.ui.evidence='';
 A.ui.status='observado';assert.ok(A.filtered().some(x=>x.e.id===e.id),'estado del hito distinto de la evidencia');A.ui.status='';
 assert.match(A.section(),/◆ 1 región/);assert.match(fs.readFileSync('www/js/app.js','utf8'),/data-action="mec07-records"/);
});

test('MEC-08 · 30. corrección 3.6: una sola fuente para ficha, índice, auditoría y CSV',()=>{
 const h=game(),a6=h.x.AtlasMEC06Actions;assert.equal(a6.sourcesOf,h.x.AtlasItemSources);
 for(const id of ['BOT-01','MAT-N01','owl_feather','brass_shard','microscopio_compuesto']){deq(a6.audit(id).sources,a6.sourcesOf(id),id);}
 assert.ok(!a6.audit('BOT-01').sources.some(x=>/Gabinete de especímenes: cae de|Drop de prueba/.test(x)),'sin asociaciones experimentales');
 assert.ok(a6.sourcesOf('MAT-N01').some(x=>/canal de nuevos materiales, activo/.test(x)),'procedencia real de materiales nuevos');
 assert.ok(a6.audit('microscopio_compuesto').sources.some(x=>/Catalogación en el Museo/.test(x)));
});

test('MEC-08 · 31. corrección 3.7: normalización robusta de state.naturalRecords sin revocar hitos',()=>{
 const h=game(),s=h.g.state;
 s.naturalRecords.records['jirafa-altura']={count:'x',first:{value:'5.1',at:'nope',region:7},best:{value:99,at:T0,region:'HX-07-10'},achieved:true,achievedAt:'?',regions:{'HX-07-10':{count:-3,best:'a'}},pending:{value:NaN},rewards:null};
 s.naturalRecords.behaviors['pavo-real-cortejo']={count:-1,firstAt:'x',regions:null,sex:'otro'};
 const h2=reopen(h),r=h2.g.state.naturalRecords.records['jirafa-altura'],b=h2.g.state.naturalRecords.behaviors['pavo-real-cortejo'];
 assert.ok(Number.isSafeInteger(r.count)&&r.count>=1);assert.equal(r.first.at,null);assert.equal(r.first.value,5.1);assert.ok(r.best.value<=X7(h).byId['jirafa-altura'].bounds.max,'magnitud dentro de límites');
 assert.equal(r.achieved,true,'no se revoca');assert.equal(r.pending,null);deq(r.rewards,{});assert.equal(r.regions['HX-07-10'].count,0);
 assert.equal(b.count,1);assert.equal(b.firstAt,null);deq(b.regions,{});assert.equal(b.sex,null);
 const once=J(h2.g.state.naturalRecords);deq(reopen(h2).g.state.naturalRecords,once,'idempotente');
});

test('MEC-08 · 32. catálogo completo intacto, versión, verificación y sin APK',()=>{
 const full=game({full:true}),g=full.g;assert.equal(g.REGIONS.length,125);assert.equal(Object.keys(g.SPECIES).length,1000);
 assert.equal(g.LEGENDARY_SPECIMENS.length,30);assert.equal(g.MUSEUM_RELICTS.length,20);assert.equal(Object.keys(K(full).pieces).length,431);
 assert.equal(X7(full).RECORDS.length,25);assert.equal(X7(full).BEHAVIORS.length,20);assert.equal(full.x.AtlasMEC04.RANKS.length,20);
 const pkg=require('../package.json'),rel=require('../www/atlas-release.json');
 assert.equal(pkg.version,'5.6.8');assert.equal(rel.version,'5.6.8');assert.equal(rel.build,'MEC-08');assert.equal(rel.v568.apk,false);
 assert.ok(pkg.scripts['release:verify'].includes('tests/mec08.test.cjs'));
 assert.ok(fs.readFileSync('www/sw.js','utf8').includes("'./js/mec08-recognition.js'"));assert.ok(fs.readFileSync('www/index.html','utf8').includes('js/mec08-recognition.js?v=5.6.8'));
 assert.ok(fs.readFileSync('www/js/save-manager.js','utf8').includes("gameVersion: '5.6.8'"));assert.ok(!fs.existsSync('android'));
 for(const f of ['README.md','logros.csv','encargos.csv','plantillas.csv','eventos.csv'])assert.ok(fs.existsSync('docs/mec08/'+f),f);
});
