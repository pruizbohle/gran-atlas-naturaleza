'use strict';
// MEC-05 · V5.6.5 Beta · Museo evolutivo, gabinetes y exposiciones funcionales, y correcciones de MEC-04.
// Una prueba por punto de la sección 19 del encargo (algunas agrupan varios), con efectos reales
// sobre los motores, no solo sobre textos o propiedades.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const audit=require('./helpers/mec04-audit.cjs');
const KEY='gran_atlas_v05',T0=1790000000000,H=3600e3;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
function rngWith(seed=7){const queue=[];let x=seed>>>0;const f=()=>{if(queue.length)return queue.shift();x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};f.queue=queue;return f;}
function game(o={}){const rng=o.rng||rngWith(o.seed);const h=make({now:T0,headless:true,rng,...o});h.rng=rng;h.window.confirm=()=>true;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,o={})=>game({store:{[KEY]:saved(h)},now:h.now,...o});
const X5=h=>h.x.AtlasMEC05,A5=h=>h.x.AtlasMEC05Actions,S4=h=>h.x.AtlasMEC04,A4=h=>h.x.AtlasMEC04Actions,A3=h=>h.x.AtlasMEC03Actions,Cm=h=>h.x.AtlasCampMEC02,K=h=>h.x.AtlasMEC03Catalog;
const failWrites=h=>{const ls=h.localStorage,set=ls.setItem;ls.setItem=()=>{throw new Error('QuotaExceededError');};return ()=>{ls.setItem=set;};};
function rich(h){const s=h.g.state;Object.assign(s,{money:1e8,knowledge:1e8,prestige:600});s.upgrades.shipyard=1;s.purchases.astillero=1;for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;return s;}
const piecesOf=(h,cabinet,n,filter=()=>true)=>Object.values(K(h).pieces).filter(p=>p.cabinet===cabinet&&filter(p)).slice(0,n).map(p=>p.id);
const expose=(h,ids)=>{const s=h.g.state;for(const id of ids){if(!(s.inventory[id]>0))h.g.addInventory(id,1);const r=h.M.expose(s,h.A.catalog,id,h.A.cabinetSlots());assert.ok(r.ok,'expone '+id+' '+r.reason);}};
const withdraw=(h,ids)=>{for(const id of ids)assert.ok(h.M.withdraw(h.g.state,h.A.catalog,id).ok);};
const wing=(h,w)=>{h.g.state.museum.wing=w;};
const live=(h,a)=>A5(h).live(a);

test('MEC-05 · 1. el indicador de investigaciones cuenta solo investigaciones del catálogo',()=>{
 const h=game(),g=h.g,s=g.state,nodes=new Set(g.RESEARCH_NODES.map(n=>n.id));
 const base=A4(h).metrics().research;
 assert.equal(base,g.RESEARCH_NODES.filter(n=>s.purchases[n.id]>0).length);
 Object.assign(s.purchases,{encargo_prueba:1,compra_mercado:3,contrato_x:1,ruta_comercial:1});
 assert.ok(['encargo_prueba','compra_mercado'].every(id=>!nodes.has(id)));
 assert.equal(A4(h).metrics().research,base,'compras y encargos no cuentan');
 const n=g.RESEARCH_NODES.find(x=>!(s.purchases[x.id]>0)&&g.canBuy(x));s.money=1e9;s.knowledge=1e9;g.buyNode(n.id);
 assert.equal(A4(h).metrics().research,base+1,'una investigación real sí cuenta');
});

test('MEC-05 · 2. regiones desbloqueadas, visitadas, exploradas y completadas; sin revocar rangos',()=>{
 const h=game(),g=h.g,s=g.state,r0=A4(h).metrics().regions,st0=A4(h).regionStates();
 assert.equal(r0,g.REGIONS.filter(r=>s.regionsVisited?.[r.id]).length);
 const r=g.REGIONS.find(x=>!s.regionUnlocked[x.id]);s.regionUnlocked[r.id]=true;
 assert.equal(A4(h).metrics().regions,r0,'desbloquear no cuenta como visitar');
 assert.equal(A4(h).regionStates().unlocked,st0.unlocked+1);
 g.setRegion(r.id);assert.equal(A4(h).metrics().regions,r0+1,'visitar sí');
 const st=A4(h).regionStates();assert.equal(st.visited,st0.visited+1);assert.ok(st.explored<=st.visited&&st.completed<=st.total);
 const sp=r.species.filter(id=>g.SPECIES[id]);for(const id of sp)s.discovered[id]=true;
 const st2=A4(h).regionStates();assert.ok(st2.explored>=st.explored+1);assert.ok(st2.completed>=st.completed+1);
 assert.equal(S4(h).METRICS.regions.label,'Regiones visitadas');
 // Rango reconocido antes (con regiones desbloqueadas) no se revoca aunque las visitadas no alcancen.
 const old=game();const os=old.g.state;rich(old);os.society={schema:1,rank:9,history:[{rank:9,at:T0,migrated:true}],rewards:{}};os.regionsVisited={};
 const re=reopen(old);assert.equal(S4(re).rank(re.g.state),9);assert.ok(A4(re).metrics().regions<55);
});

test('MEC-05 · 3 y 22. requisitos de Sociedad accesibles antes de exigirse y sin dependencias circulares',()=>{
 for(const full of [false,true]){
  const h=game({full}),r=audit.run(h);
  assert.equal(r.rank,20,'rango 20');deq(r.blockedBy,[]);
  assert.equal(r.totalRegions,full?125:113,'113 regiones en el arnés histórico; 125 con GM-06');
  assert.equal(r.visited,r.totalRegions);assert.equal(r.research,r.totalResearch);
  assert.equal(r.monographs,r.totalSpecies,'todas las especies pueden llegar a monografía');
  deq(r.missingPieces,[]);deq(r.evidence.blockedMaterials,{},'todo material usado tiene fuente real');
  for(const [m,src] of Object.entries(r.evidence.materials))assert.ok(src.length,m);
  assert.ok(r.incomeSources.length>0,'ingresos con fuentes renovables, no supuestos');
  // Rango 10: una colección completa obtenible antes de exigirla.
  assert.ok(r.evidence.firstCollection&&r.evidence.firstCollection.rank<10,'primera colección completable antes del rango 10');
  assert.equal(r.evidence.rank10.rankBefore,9);assert.ok(r.evidence.rank10.collections.length>=1);
  for(const pieces of Object.values(r.evidence.rank10.sources))for(const src of Object.values(pieces))assert.ok(src.length);
  assert.deepEqual(Object.keys(r.assumptions),['S1','S2','S3','S4','S5','S6']);
 }
 // Ningún rango exige el Museo (que exige rango): sin ciclo.
 const h=game();
 assert.ok(S4(h).RANKS.every(r=>!Object.keys(r.requires).some(k=>/museum|wing/.test(k))));
 assert.ok(Object.values(X5(h).LEVELS).every(l=>l.rank<=20));
});

test('MEC-05 · 4. existen los cinco niveles del Museo con sus capacidades',()=>{
 const h=game(),L=h.g.MUSEUM_LEVELS;
 deq(L.map(l=>l.name.replace(' (BETA)','')),['Galería de fauna','Sala de historia natural','Gran galería zoológica','Pabellón de ciencias','Gabinete de maravillas']);
 deq(L.map(l=>l.animalSlots),[3,7,12,18,25]);deq(L.map(l=>l.cabinetSlots),[4,8,12,16,20]);
 deq(L.map(l=>[l.cost,l.prestige]),[[0,0],[300,2],[900,5],[50000,60],[500000,150]],'costos y prestigio históricos');
 deq(Object.values(X5(h).LEVELS).map(l=>l.rank),[0,0,0,11,14]);
 assert.equal(h.g.MUSEUM_WINGS.length,5);
});

test('MEC-05 · 5. el rango de Sociedad controla las ampliaciones IV y V',()=>{
 const h=game(),g=h.g,s=rich(h);
 wing(h,1);assert.ok(g.expandMuseum());assert.ok(g.expandMuseum());assert.equal(s.museum.wing,3,'I–III sin rango');
 s.society.rank=10;const m0=s.money;
 assert.equal(g.expandMuseum(),false);assert.equal(s.museum.wing,3);assert.equal(s.money,m0);
 assert.match(A5(h).expandCheck().reasons.join(),/Curador/);
 s.society.rank=11;assert.ok(g.expandMuseum());assert.equal(s.museum.wing,4);assert.equal(s.money,m0-50000,'se paga el costo histórico');
 s.society.rank=13;assert.equal(g.expandMuseum(),false);assert.match(A5(h).expandCheck().reasons.join(),/Miembro del Consejo/);
 s.society.rank=14;assert.ok(g.expandMuseum());assert.equal(s.museum.wing,5);
 // También dinero y prestigio, como antes.
 const p=game(),ps=rich(p);wing(p,3);ps.society.rank=20;ps.prestige=10;assert.equal(p.g.expandMuseum(),false);
 // La vista de ampliación refleja el bloqueo.
 const v=game(),vs=rich(v);wing(v,3);vs.society.rank=5;vs.museumView='exhibitions';const m=v.g.museumViewModel3270();
 assert.equal(m.view.expand.enabled,false);assert.match(m.expandInfo,/rango de Sociedad 11/);
 // La conexión de MEC-04 queda activa y coherente con la configuración del Museo.
 assert.equal(S4(h).MUSEUM_RANKS.active,true);
 assert.ok(S4(h).RANKS[10].unlocks.includes('museum:ampliaciones'));assert.ok(S4(h).RANKS[13].unlocks.includes('museum:maravillas'));
});

test('MEC-05 · 6. los niveles adquiridos se conservan sin cumplir los requisitos nuevos',()=>{
 const h=game(),s=rich(h);wing(h,5);s.society={schema:1,rank:1,history:[],rewards:{}};
 const animals=Object.keys(h.g.SPECIES).slice(0,20);for(const id of animals)s.museum.exhibits[id]=true;
 expose(h,piecesOf(h,'Geología',18));
 const r=reopen(h),rs=r.g.state;
 assert.equal(rs.museum.wing,5);assert.equal(r.g.museumCapacity(),25);assert.equal(r.A.cabinetSlots(),20);
 assert.equal(Object.keys(rs.museum.exhibits).length,20);assert.equal(rs.museum.cabinets['Geología'].length,18);
 assert.equal(S4(r).rank(rs)<11,true);
});

test('MEC-05 · 7. ingresos zoológicos históricos intactos y desglosados',()=>{
 const h=game(),g=h.g,s=rich(h);wing(h,3);
 const ids=Object.keys(g.SPECIES).slice(0,10);for(const id of ids)s.museum.exhibits[id]=true;
 s.upgrades.museumIncomeTier=1;s.museum.curationPoints=5;
 const rate=g.museumRate(),inc=A5(h).income();
 assert.ok(inc.consistent);assert.ok(Math.abs(inc.total-rate)<1e-12);
 assert.ok(Math.abs(inc.base-ids.reduce((t,id)=>t+g.exhibitIncome(id),0))<1e-12);
 deq(inc.newBonuses,[],'MEC-05 no añade bonificaciones al ingreso');
 assert.equal(inc.offlineHours,8);assert.ok(Math.abs(inc.offlineMax-rate*8*3600)<1e-6);assert.ok(Math.abs(inc.perHour-rate*3600)<1e-9);
 // Los gabinetes no cambian el ingreso zoológico.
 expose(h,piecesOf(h,'Historia',12));assert.equal(g.museumRate(),rate);
 // La vista general lo muestra.
 s.museumView='exhibitions';assert.match(g.museumViewModel3270().view.mec05,/Ingreso pasivo · £/);
});

test('MEC-05 · 8. capacidad de cada gabinete según el nivel',()=>{
 const h=game(),s=rich(h);
 for(const [w,cap] of [[1,4],[2,8],[3,12],[4,16],[5,20]]){
  wing(h,w);s.museum.cabinets={};
  for(const name of Object.keys(X5(h).CABINETS)){
   const ids=piecesOf(h,name,cap+1);expose(h,ids.slice(0,cap));
   for(const id of ids.slice(cap))h.g.addInventory(id,1);
   assert.equal(h.M.expose(s,h.A.catalog,ids[cap],h.A.cabinetSlots()).ok,false,name+' lleno a '+cap);
   assert.equal(A5(h).model().cabinets[name].capacity,cap);
  }
 }
});

test('MEC-05 · 9. las piezas expuestas están protegidas',()=>{
 const h=game(),s=rich(h),a3=A3(h);wing(h,3);
 const [id]=piecesOf(h,'Historia',1,p=>!!p.sources.comercio);expose(h,[id]);
 assert.equal(s.inventory[id],1);assert.equal(a3.stock(id).tradable,0);
 assert.equal(a3.offerPlan({kind:'solicitud',piece:id,reward:100}),null,'no se vende');
 assert.equal(h.M.consume(s,h.A.catalog,id,1),false,'no se consume');assert.equal(s.inventory[id],1);
 // Un trueque nunca entrega la pieza expuesta.
 const P=K(h).pieces,other=Object.values(P).find(p=>p.collection===P[id].collection&&p.id!==id);
 assert.equal(a3.offerPlan({kind:'intercambio',piece:other.id,give:{collection:P[id].collection,minRarity:0,count:1}}),null);
});

test('MEC-05 · 10. cada gabinete tiene un beneficio real y distinto',()=>{
 const h=game(),s=rich(h);wing(h,3);
 const acts=Object.keys(X5(h).ACTIVITIES),byCab={};
 for(const name of Object.keys(X5(h).CABINETS)){
  s.museum.cabinets={};const before=Object.fromEntries(acts.map(a=>[a,live(h,a)]));
  expose(h,piecesOf(h,name,4));
  const changed=acts.filter(a=>live(h,a)>before[a]);
  assert.ok(changed.length>=1,name+' tiene al menos un beneficio');
  assert.ok(changed.every(a=>X5(h).BENEFITS.some(b=>b.cabinet===name&&b.activity===a)),name+' solo afecta a sus actividades');
  byCab[name]=changed.sort().join();
 }
 assert.equal(new Set(Object.values(byCab)).size,5,'los cinco gabinetes otorgan beneficios distintos');
 for(const b of X5(h).BENEFITS)for(const k of ['id','source','cabinet','activity','type','perPoint','max','stacking'])assert.ok(b[k]!==undefined,b.id+'.'+k);
});

test('MEC-05 · 11. los beneficios actúan en sus motores',()=>{
 // a) Campo ambiental: la banda botánica convierte una tirada que antes fallaba en un hallazgo botánico.
 const a=game(),as=rich(a);wing(a,3);as.currentRegion='HX-01-09';as.habitat='bosque';
 const P=K(a).pieces,base=a.x.AtlasMEC03.RATES.ambiental.manual;
 a.rng.queue.push(base+0.0005);assert.equal(a.g.mec03AmbientFinds({manual:true,regionId:'HX-01-09',habitats:['bosque']}).length,0,'sin Museo no hay hallazgo');
 expose(a,piecesOf(a,'Botánica',4));const band=base*live(a,'campo:ambiental:botanica');assert.ok(band>0.0005);
 a.rng.queue.push(base+0.0005,0.5);const got=a.g.mec03AmbientFinds({manual:true,regionId:'HX-01-09',habitats:['bosque']});
 assert.equal(got.length,1);assert.equal(P[got[0]].cabinet,'Botánica');
 a.rng.queue.push(base/2,0.5);assert.equal(a.g.mec03AmbientFinds({manual:true,regionId:'HX-01-09',habitats:['bosque']}).length,1,'la tasa base no cambia');
 // b) Prospección geológica: más probabilidad por tirada y conocimiento extra (Historia natural).
 const b=game(),bs=rich(b);wing(b,3);bs.society.rank=20;while(Cm(b).level(bs,'surveys')<3)Cm(b).upgrade(bs,'surveys');
 const region=b.g.REGIONS.find(r=>A3(b).canProspect('geologica',r.id));
 const run=(museum)=>{const h=game(),s=rich(h);wing(h,3);s.society.rank=20;while(Cm(h).level(s,'surveys')<3)Cm(h).upgrade(s,'surveys');
  if(museum){expose(h,piecesOf(h,'Geología',4));expose(h,piecesOf(h,'Historia natural y exploración',4));}
  assert.ok(A3(h).startProspection('geologica',region.id,h.now));const job=A3(h).prospections().jobs.at(-1);
  const t=h.x.AtlasMEC03.PROSPECTIONS.geologica,k0=s.knowledge;
  assert.ok(A3(h).collectProspection(job.id,job.endAt,()=>t.chance*1.02));
  return {got:Object.keys(A3(h).prospections().history.at(-1).collectibles).length,k:s.knowledge-k0,job};};
 const r0=run(false),r1=run(true);
 assert.equal(r0.got,0);assert.ok(r1.got>0,'la misma tirada acierta con el gabinete de Geología');
 assert.ok(r1.k>r0.k,'conocimiento extra por Historia natural y exploración');
 assert.ok(r1.job.mec.museum.values['prospeccion:geologica']>0);
 // c) Comercio: descuento real en compras de piezas de Historia.
 const c=game(),cs=rich(c);wing(c,3);cs.society.rank=20;while(Cm(c).level(cs,'caravan')<5)Cm(c).upgrade(cs,'caravan');
 let offer=null;for(let d=0;d<200&&!offer;d++){c.now=T0+d*24*H;offer=A3(c).market(c.now).offers.find(o=>o.kind==='compra'&&!o.done&&K(c).pieces[o.piece].cabinet==='Historia'&&o.tier!=='extra');}
 assert.ok(offer);const full=A3(c).offerPlan(offer).money;assert.equal(full,offer.price);
 expose(c,piecesOf(c,'Historia',8,p=>p.id!==offer.piece));
 const plan=A3(c).offerPlan(offer);assert.ok(plan.money<full&&plan.discount===full-plan.money);
 const m0=cs.money,l0=cs.moneyLedger.total;assert.ok(A3(c).executeOffer(offer.id,c.now));
 assert.equal(cs.money,m0-plan.money);assert.equal(cs.moneyLedger.total,l0,'un descuento no es un ingreso');
 // d) Expediciones: conocimiento extra al liquidar con la instantánea del Museo.
 const d=game(),ds=rich(d);wing(d,3);ds.society.rank=20;
 expose(d,piecesOf(d,'Historia natural y exploración',4));
 const v=d.g.VOYAGES.find(x=>d.g.voyageConditions3280(x).every(c=>c.met));assert.ok(d.g.sail(v.id));
 const job=ds.voyages.at(-1);assert.ok(job.mec.museum.values['conocimiento:expediciones']>0);
 const k0=ds.knowledge;assert.ok(d.g.resolveVoyageReward(job,job.endAt));
 const extra=Math.round(d.g.voyageKnowledgeReward(v)*job.mec.museum.values['conocimiento:expediciones']);
 assert.equal(ds.knowledge-k0,d.g.voyageKnowledgeReward(v)+extra);assert.equal(ds.voyageHistory.at(-1).museumKnowledge,extra);
});

test('MEC-05 · 12. retirar piezas desactiva sus beneficios y la vista previa lo anticipa',()=>{
 const h=game(),s=rich(h);wing(h,3);const ids=piecesOf(h,'Oceanografía',4);expose(h,ids);
 const on=live(h,'expedicion:oceanografica');assert.ok(on>0);
 const pv=A5(h).preview(ids[0],'withdraw');assert.ok(pv.some(e=>e.activity==='expedicion:oceanografica'&&e.after<e.before));
 withdraw(h,[ids[0]]);const after=live(h,'expedicion:oceanografica');assert.ok(after<on);
 assert.ok(Math.abs(after-pv.find(e=>e.activity==='expedicion:oceanografica').after)<1e-9,'la vista previa coincide');
 withdraw(h,ids.slice(1));assert.equal(live(h,'expedicion:oceanografica'),0);assert.equal(live(h,'campo:ambiental:oceanografia'),0);
 // La ficha de la pieza muestra el efecto antes de exponer.
 assert.match(h.A.detailModel(ids[0]).sources.join(' '),/Museo · al exponerla/);
});

test('MEC-05 · 13. sin multiplicadores duplicados',()=>{
 const h=game(),s=rich(h);wing(h,5);
 const ids=piecesOf(h,'Botánica',4);expose(h,ids);const one=J(A5(h).model());
 for(const id of ids)h.g.addInventory(id,5);assert.equal(h.M.expose(s,h.A.catalog,ids[0],20).ok,false,'una exposición por pieza');
 deq(A5(h).model().activities,one.activities,'los duplicados no suman');
 // Recalcular no acumula.
 for(let i=0;i<5;i++){h.g.render();h.g.persist();}deq(A5(h).model().activities,one.activities);
 // Suma aditiva con límite, sin multiplicar entre beneficios.
 expose(h,piecesOf(h,'Botánica',20).filter(id=>!ids.includes(id)).slice(0,16));
 for(const a of Object.values(A5(h).model().activities)){const raw=a.parts.reduce((t,p)=>t+p.value,0);assert.ok(Math.abs(a.raw-raw)<1e-9);assert.ok(a.total<=a.cap+1e-12);assert.equal(a.total,Math.min(a.raw,a.cap));}
 // Instantánea = valor vigente; la tasa de la expedición se aplica una vez.
 const snap=A5(h).snapshot(h.now);for(const [k,v] of Object.entries(snap.values))assert.equal(v,live(h,k));
 // Capas independientes en el desglose.
 const br=A5(h).breakdown('expedicion:botanica');deq(Object.keys(br.layers),['equipamiento','investigaciones','campamento','sociedad','museo']);
 assert.equal(br.layers.museo.total,live(h,'expedicion:botanica'));
});

test('MEC-05 · 14. exposiciones temáticas por colección',()=>{
 const h=game(),s=rich(h),CAT=h.A.catalog;
 // El primer hito de las 32 colecciones cabe en un gabinete de nivel I.
 for(const c of CAT.collections.values()){const t=X5(h).tiersFor(c.ids.length);assert.ok(t[0].threshold<=4,c.name);assert.equal(t.at(-1).threshold,c.ids.length);for(let i=1;i<t.length;i++)assert.ok(t[i].threshold>t[i-1].threshold);}
 wing(h,5);const col=[...CAT.collections.values()].find(c=>c.name==='Herbario del mundo');
 const theme=()=>A5(h).model().cabinets['Botánica'].themes.find(t=>t.collection===col.name);
 expose(h,col.ids.slice(0,2));assert.equal(theme().tier,null);const before=live(h,'expedicion:botanica');
 expose(h,col.ids.slice(2,3));assert.equal(theme().tier,'inicial');assert.ok(live(h,'expedicion:botanica')>before);
 expose(h,col.ids.slice(3,8));assert.equal(theme().tier,'parcial');
 expose(h,col.ids.slice(8,14));assert.equal(theme().tier,'avanzada');
 expose(h,col.ids.slice(14));assert.equal(theme().tier,'completa');assert.equal(theme().next,null);
 assert.ok(A5(h).model().themes.some(t=>t.collection===col.name));
 withdraw(h,col.ids.slice(2));assert.equal(theme().tier,null,'la temática exige piezas físicamente expuestas');
 // A nivel I, el próximo hito avisa si no cabe.
 const l=game();rich(l);wing(l,1);expose(l,col.ids.slice(0,3));const t=A5(l).model().cabinets['Botánica'].themes.find(x=>x.collection===col.name);
 assert.equal(t.tier,'inicial');assert.equal(t.next.fits,false);
});

test('MEC-05 · 15. registro permanente de colecciones: descubierta, poseída y expuesta',()=>{
 const h=game(),s=rich(h);wing(h,3);
 const c=[...h.A.catalog.collections.values()].find(x=>x.ids.length===5);
 for(const id of c.ids)h.g.addInventory(id,1);expose(h,c.ids.slice(0,2));
 let row=A5(h).collections().find(x=>x.name===c.name);deq([row.discovered,row.owned,row.exhibited,row.discoveredComplete],[5,5,2,true]);
 withdraw(h,c.ids.slice(0,2));for(const id of c.ids)s.inventory[id]=0;h.g.render();
 row=A5(h).collections().find(x=>x.name===c.name);deq([row.discovered,row.owned,row.exhibited,row.discoveredComplete],[5,0,0,true]);
 const r=reopen(h);deq(A5(r).collections().find(x=>x.name===c.name).discovered,5);
});

test('MEC-05 · 16. reorganizar exposiciones no repite recompensas',()=>{
 const h=game(),g=h.g,s=rich(h);wing(h,3);
 const ids=piecesOf(h,'Historia',6),sp=Object.keys(g.SPECIES)[0];s.stages=s.stages||{};
 s.discovered[sp]=true;s.published[sp]=true;s.stages[sp]=5;
 const snapshot=()=>J({prestige:s.prestige,knowledge:s.knowledge,ledger:s.moneyLedger.total,cur:s.museum.curationPoints,ach:s.achievements3360||null,society:s.society.history.length});
 for(const id of ids)g.addInventory(id,1);
 const base=snapshot();
 for(let i=0;i<5;i++){expose(h,ids);withdraw(h,ids);}
 deq(snapshot(),base,'gabinetes: sin prestigio, conocimiento ni ingresos acumulables');
 // Animales: retirar y volver a exponer cuesta de nuevo y no da recompensas.
 g.exhibitAnimal(sp);const m1=s.money;g.removeExhibit(sp);g.exhibitAnimal(sp);
 assert.equal(s.money,m1-g.exhibitPrice(sp),'sin reembolso ni premio');deq(snapshot(),base);
});

test('MEC-05 · 17. bonificaciones fósiles y de relictos conservadas sin duplicar',()=>{
 const h=game(),g=h.g,s=rich(h);
 const set=g.MUSEUM_FOSSIL_SETS[0];for(const id of set.requires)s.museum.collections[id]=true;
 const rel=g.MUSEUM_RELICT_SETS[0];for(const id of rel.requires)s.museum.relicts[id]=true;
 assert.equal(g.museumFossilSetBonus(),set.bonus);assert.equal(g.museumRelictSetBonus(),rel.bonus);
 const inc=A5(h).income();
 assert.equal(inc.existing.find(p=>p.id==='fosiles').value,set.bonus);assert.equal(inc.existing.find(p=>p.id==='relictos').value,rel.bonus);
 const fo=A5(h).fossils(),re=A5(h).relicts();
 assert.ok(fo.sets.find(x=>x.id===set.id).complete);assert.equal(fo.sets.find(x=>x.id===set.id).newBonus,0);
 assert.ok(fo.reconstructions.filter(x=>x.obtained).length>=set.requires.length);
 assert.equal(re.total,20);assert.ok(re.sets.find(x=>x.id===rel.id).complete);
 // El motor de MEC-05 no cuenta fósiles ni relictos.
 assert.ok(Object.values(A5(h).model().activities).every(a=>a.total===0));
 // Artefactos: 20 catalogables (5 históricos y 15 beta), campos preparados para MEC-06.
 const art=A5(h).artifacts();assert.equal(art.length,20);assert.equal(art.filter(a=>a.beta).length,15);
 for(const a of art)for(const k of X5(h).ARTIFACT_FIELDS)assert.ok(k in a);
});

test('MEC-05 · 18. ingresos offline equivalentes y sin pagos repetidos',()=>{
 const h=game(),g=h.g,s=rich(h);wing(h,3);
 for(const id of Object.keys(g.SPECIES).slice(0,6))s.museum.exhibits[id]=true;
 s.lastTick=h.now;const rate=g.museumRate();g.persist();
 const back=game({store:{[KEY]:h.store[KEY]},now:h.now+10*H});const l0=back.g.state.moneyLedger.bySource.museo||0;back.tick();
 const paid=(back.g.state.moneyLedger.bySource.museo||0)-l0;assert.ok(Math.abs(paid-rate*8*3600)<1e-6,'límite de 8 h');
 back.g.persist();const again=game({store:{[KEY]:back.store[KEY]},now:back.now});const l1=again.g.state.moneyLedger.bySource.museo||0;again.tick();
 assert.ok((again.g.state.moneyLedger.bySource.museo||0)-l1<1e-6,'recargar no vuelve a pagar');
 // En línea: misma regla (tasa × segundos).
 const on=game(),os=rich(on);wing(on,3);for(const id of Object.keys(on.g.SPECIES).slice(0,6))os.museum.exhibits[id]=true;os.lastTick=on.now;
 const lo=os.moneyLedger.bySource.museo||0;on.now+=60e3;on.tick();assert.ok(Math.abs((os.moneyLedger.bySource.museo||0)-lo-rate*60)<1e-6);
 // Retirar cambia lo futuro, no lo histórico.
 const hist=os.moneyLedger.bySource.museo;on.g.removeExhibit(Object.keys(os.museum.exhibits)[0]);assert.equal(os.moneyLedger.bySource.museo,hist);assert.ok(on.g.museumRate()<rate);
});

test('MEC-05 · 19. las actividades temporizadas fijan las bonificaciones al iniciar',()=>{
 const h=game(),s=rich(h);wing(h,3);s.society.rank=20;while(Cm(h).level(s,'surveys')<3)Cm(h).upgrade(s,'surveys');
 const geo=piecesOf(h,'Geología',4);expose(h,geo);
 const region=h.g.REGIONS.find(r=>A3(h).canProspect('geologica',r.id));
 assert.ok(A3(h).startProspection('geologica',region.id,h.now));const job=A3(h).prospections().jobs.at(-1);
 const captured=job.mec.museum.values['prospeccion:geologica'];assert.ok(captured>0);
 withdraw(h,geo);assert.equal(live(h,'prospeccion:geologica'),0);
 const t=h.x.AtlasMEC03.PROSPECTIONS.geologica;
 assert.ok(A3(h).collectProspection(job.id,job.endAt,()=>t.chance*(1+captured)-1e-6));
 assert.ok(Object.keys(A3(h).prospections().history.at(-1).collectibles).length>0,'usa la condición del inicio');
 // Una expedición iniciada sin Museo no gana bonificación al exponer después.
 const v=h.g.VOYAGES.find(x=>h.g.voyageConditions3280(x).every(c=>c.met));assert.ok(h.g.sail(v.id));const vj=s.voyages.at(-1);
 deq(vj.mec.museum.values,{});expose(h,piecesOf(h,'Historia natural y exploración',4));
 const k0=s.knowledge;h.g.resolveVoyageReward(vj,vj.endAt);assert.equal(s.knowledge-k0,h.g.voyageKnowledgeReward(v));
 // Trabajos de partidas anteriores: sin bonificación del Museo, de forma explícita.
 const o=game(),os=rich(o);os.voyages=[{id:900001,type:'coast',startedAt:T0,endAt:T0+H,mec:{modality:'normal',migrated:true}}];
 const r=reopen(o);deq(r.g.state.voyages[0].mec.museum,{schema:1,at:null,values:{},migrated:true});
 // El campo usa los beneficios vigentes: retirar las piezas anula la banda en la siguiente búsqueda.
 assert.equal(live(h,'campo:ambiental:botanica'),0);
});

test('MEC-05 · 20. fallos de guardado al ampliar el Museo',()=>{
 const h=game(),s=rich(h);wing(h,3);s.society.rank=11;h.g.persist();
 const stored=h.store[KEY],m0=s.money;
 const restore=failWrites(h);assert.equal(h.g.expandMuseum(),false);
 assert.equal(s.museum.wing,3);assert.equal(s.money,m0);assert.equal(h.store[KEY],stored);restore();
 assert.ok(h.g.expandMuseum());assert.equal(s.museum.wing,4);assert.equal(s.money,m0-50000);
 const r=reopen(h);assert.equal(r.g.state.museum.wing,4);
});

test('MEC-05 · 21. exportación e importación reconstruyen las bonificaciones',()=>{
 const h=game(),s=rich(h);wing(h,4);s.society.rank=12;while(Cm(h).level(s,'surveys')<3)Cm(h).upgrade(s,'surveys');
 expose(h,piecesOf(h,'Botánica',6));expose(h,piecesOf(h,'Geología',5));
 const region=h.g.REGIONS.find(r=>A3(h).canProspect('geologica',r.id));A3(h).startProspection('geologica',region.id,h.now);
 const model=J(A5(h).model().activities),data=J(h.window.AtlasSaveBridge.getSaveData());
 assert.equal(data.museumMEC05,undefined,'no se guardan modificadores derivados');
 const t=game({now:h.now+1000});t.window.AtlasSaveBridge.restoreGame(data);
 deq(A5(t).model().activities,model);deq(t.g.state.museum.cabinets,data.museum.cabinets);
 deq(A3(t).prospections().jobs.at(-1).mec.museum,data.prospections.jobs.at(-1).mec.museum);
 assert.equal(t.g.state.museum.wing,4);
});

test('MEC-05 · 23. MEC-01 a MEC-04 se conservan; versión y verificación',()=>{
 const h=game(),g=h.g;
 deq(h.A.drops.channels()[0].rates.campo,{manual:0.02,auto:0.005});
 assert.equal(Object.keys(K(h).pieces).length,431);assert.equal(h.A.catalog.collections.size,32);assert.equal(h.B.items.filter(r=>r[2]===1).length,27);
 assert.equal(S4(h).RANKS.length,20);assert.equal(g.VOYAGES.length,13);
 assert.ok(g.state.moneyLedger&&g.state.collectionRegistry&&g.state.camp&&g.state.collectionPrefs&&g.state.society);
 // Sin módulos MEC: el Museo histórico no cambia (sin rango para ampliar).
 const plain=make({now:T0,headless:true,noCamp:true});assert.equal(plain.x.AtlasMEC05Actions,undefined);
 const full=game({full:true});assert.equal(full.g.REGIONS.length,125);assert.equal(Object.keys(full.g.SPECIES).length,1000);
 const pkg=require('../package.json'),rel=require('../www/atlas-release.json');
 assert.equal(pkg.version,'5.6.5');assert.equal(rel.version,'5.6.5');assert.equal(rel.build,'MEC-05');assert.equal(rel.channel,'beta');
 assert.ok(pkg.scripts['release:verify'].includes('tests/mec05.test.cjs'));
 assert.ok(fs.readFileSync('www/sw.js','utf8').includes("'./js/mec05-museum.js'"));
 assert.ok(fs.readFileSync('www/index.html','utf8').includes('js/mec05-museum.js?v=5.6.5'));
 assert.ok(fs.readFileSync('www/js/save-manager.js','utf8').includes("gameVersion: '5.6.5'"));
 assert.ok(!fs.existsSync('android'));
});
