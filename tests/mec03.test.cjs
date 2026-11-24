'use strict';
// MEC-03 · V5.6.3 Beta · obtención híbrida de coleccionables e intercambio.
// Una prueba por punto de la sección 18 del encargo, con efectos reales sobre el motor.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const KEY='gran_atlas_v05',T0=1790000000000,H=3600e3;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
function rngWith(seed=7){const queue=[];let x=seed>>>0;const f=()=>{if(queue.length)return queue.shift();x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};f.queue=queue;return f;}
function game(o={}){const rng=o.rng||rngWith(o.seed);const h=make({now:T0,headless:true,rng,...o});h.rng=rng;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,o={})=>game({store:{[KEY]:saved(h)},now:h.now,...o});
const Cm=h=>h.x.AtlasCampMEC02,A2=h=>h.x.AtlasCampMEC02Actions,A3=h=>h.x.AtlasMEC03Actions,K=h=>h.x.AtlasMEC03Catalog,X=h=>h.x.AtlasMEC03;
function rich(h,{levels=5,regions=true}={}){const s=h.g.state;Object.assign(s,{money:1e7,knowledge:1e7,prestige:500});s.upgrades.shipyard=1;s.purchases.astillero=1;
 if(regions)for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;if(Cm(h))for(const f of Cm(h).FACILITIES)while(Cm(h).level(s,f.id)<levels)Cm(h).upgrade(s,f.id,h.now);return s;}
const reg=(h,id)=>h.g.state.collectionRegistry.pieces[id];
const failWrites=h=>{const ls=h.localStorage,set=ls.setItem;ls.setItem=()=>{throw new Error('QuotaExceededError');};return ()=>{ls.setItem=set;};};

test('MEC-03 · 1. el drop experimental universal queda retirado de la progresión',()=>{
 const h=game(),g=h.g,s=g.state,D=h.A.drops;
 const ch=Object.fromEntries(D.channels().map(c=>[c.id,c.rates.campo]));
 deq(ch.coleccionables,{manual:0,auto:0});deq(ch.rarezas,{manual:0,auto:0});
 assert.ok(D.pool('campo','coleccionables',{species:'lobo_gris'}).length>0,'las tablas experimentales quedan archivadas');
 deq(A3(h).archivedChannels,['coleccionables','rarezas']);
 s.upgrades.specimenDrops=1;const before=Object.keys(s.collectionRegistry.pieces).length;
 // El lobo no tiene piezas de observación coherentes: ya no entrega coleccionables.
 for(let i=0;i<20000;i++)g.mec01FieldDrops('lobo_gris',true);
 assert.equal(Object.keys(s.collectionRegistry.pieces).length,before);
 // Las fichas ya no presentan a los animales como fuente universal.
 assert.ok(!g.inventorySources3400('BOT-01').some(t=>/Drop de prueba|cae de \d+ especies/.test(t)));
 assert.ok(!A3(h).sourceText('GEM-01').some(t=>/especie/.test(t)));
});

test('MEC-03 · 2. los materiales históricos conservan su fuente y se amplían con coherencia',()=>{
 const h=game(),g=h.g,E=A3(h).engine;
 assert.equal(Object.keys(g.SPECIES_DROPS).length,12);
 for(const sp of Object.keys(g.SPECIES_DROPS))deq(E.historicExtra(sp),[],sp+' conserva solo su drop original');
 const kinds=X(h).HISTORIC_KINDS;let extra=0;
 for(const sp of Object.keys(g.SPECIES))for(const id of E.historicExtra(sp)){extra++;const k=kinds[id];if(k)assert.ok(k.includes(g.SPECIES[sp].kind),id+' en '+sp+' ('+g.SPECIES[sp].kind+')');}
 assert.ok(extra>20,'la distribución se amplía a especies compatibles');
 // Las 27 piezas de material animal (19 nuevas + 8 históricas) siguen en el catálogo.
 assert.equal(h.B.items.filter(r=>r[2]===1).length,27);
 const s=g.state;s.upgrades.specimenDrops=1;const before=s.inventory.wolf_tooth||0;let n=0;
 for(let i=0;i<40000;i++)if(g.maybeSpeciesDrop('lobo_gris',true))n++;
 assert.ok(Math.abs(n/40000-0.02)<5*Math.sqrt(0.02*0.98/40000));assert.equal(s.inventory.wolf_tooth-before,n);
});

test('MEC-03 · 3. observación animal y exploración ambiental son tiradas separadas',()=>{
 const h=game(),g=h.g,s=g.state,E=A3(h).engine,P=K(h).pieces;
 // El hallazgo ambiental depende de la región y su bioma, no de la especie.
 const brit=g.REGIONS.find(r=>r.id==='HX-01-09'),ocean=g.REGIONS.find(r=>r.continent==='Océanos'&&r.habitats.includes('arrecife'));
 const land=E.ambient(brit),sea=E.ambient(ocean);
 assert.ok(land.includes('BOT-01')&&!land.includes('BOT-03'),'la rosa silvestre sí, la amapola de California no');
 assert.ok(sea.length&&sea.every(id=>['Conchas de los océanos','Algas del mundo','Corales del mundo'].includes(P[id].collection)));
 // Sin Gabinete de especímenes: hay hallazgos ambientales, pero no de observación animal.
 s.upgrades.specimenDrops=0;let amb=0;
 for(let i=0;i<4000;i++)amb+=g.mec03AmbientFinds(true).length;
 assert.ok(amb>60);deq(g.mec01FieldDrops('cisne_vulgar',true),[]);
 // Con el Gabinete, la observación del cisne puede dar su huevo; el lobo, ninguna pieza.
 s.upgrades.specimenDrops=1;
 assert.ok(E.observation('cisne_vulgar').includes('HUE-13'));deq(E.observation('lobo_gris'),[]);
 for(const sp of Object.keys(g.SPECIES))for(const id of E.observation(sp))if(P[id].collection==='Huevos de aves')assert.ok(X(h).BIRDS.has(g.SPECIES[sp].kind),id+' de '+sp);
 // Una sola tirada ambiental por búsqueda, aunque se observen varias especies.
 const r=game({seed:3}),rs=r.g.state;rs.discovered.lobo_gris=true;
 for(let i=0;i<400;i++){r.now+=61e3;r.g.encounter('manual',r.now,true);}
 const by={};for(const f of rs.collectibleFinds||[])if(f.source==='campo')by[f.at]=(by[f.at]||0)+1;
 assert.ok(Object.keys(by).length>0);assert.ok(Object.values(by).every(n=>n===1));
});

test('MEC-03 · 4. cada fuente implementada entrega coleccionables reales',()=>{
 const h=game({seed:11}),g=h.g,s=rich(h),a=A3(h),a2=A2(h);
 const sources=()=>{const out={};for(const p of Object.values(s.collectionRegistry.pieces))for(const k of Object.keys(p.sources))out[k]=(out[k]||0)+p.sources[k];return out;};
 // Campo y observación.
 s.upgrades.specimenDrops=1;for(let i=0;i<3000;i++){g.mec03AmbientFinds(true);g.mec01FieldDrops('cisne_vulgar',true);}
 // Expedición botánica a los Alpes.
 assert.equal(a2.sail('alps','botanica'),true);
 // Excavación especial y prospecciones.
 assert.equal(a2.dig('british_cliffs','especial'),true);
 assert.equal(a.startProspection('geologica','HX-01-09'),true);assert.equal(a.startProspection('regional','HX-01-09'),true);
 h.now+=48*H;h.rng.queue.push(...Array(200).fill(0.01));h.tick();
 assert.equal(g.collectExcavation(s.museum.excavations[0].id),true);
 for(const j of [...a.prospections().jobs])assert.equal(a.collectProspection(j.id),true);
 // Taller, comercio, encargo y evento.
 Object.assign(s.inventory,{pressed_flower:10,parchment_scrap:10,map_fragment:5});
 assert.ok(a.prepare('herbario'));
 const buy=a.market().offers.find(o=>o.kind==='compra');assert.equal(a.executeOffer(buy.id),true);
 h.now+=9*H;assert.ok(a.claimCommission('hidrografica'));
 assert.equal(a.deliverEvent('exposicion-universal'),null,'los eventos de calendario siguen desactivados');
 assert.ok(a.deliverEvent('prueba',{definition:{id:'prueba',active:true,reward:'Gabinete de maravillas'}}));
 assert.equal(a.deliverEvent('prueba',{definition:{id:'prueba',active:true,reward:'Gabinete de maravillas'}}),null,'cada evento entrega una vez');
 const got=sources();
 for(const k of ['campo','observacion','expediciones','excavaciones','prospecciones','taller','comercio','encargos','eventos'])assert.ok(got[k]>0,'fuente '+k+': '+JSON.stringify(got));
 assert.ok(!got.otros,'ninguna pieza nueva queda como «otros»');
});

test('MEC-03 · 5. las 431 piezas tienen al menos una vía funcional y alcanzable',()=>{
 const h=game(),g=h.g,s=rich(h),E=A3(h).engine,P=K(h).pieces;
 assert.equal(Object.keys(P).length,431);deq(X(h).validate(K(h)),[]);
 const all=new Set(['Europa','Asia','África','Norteamérica','Sudamérica','Oceanía','Polos','Océanos']),reach=new Map();
 const mark=(id,how)=>{if(!reach.has(id))reach.set(id,new Set());reach.get(id).add(how);};
 for(const r of g.REGIONS){for(const id of E.ambient(r))mark(id,'campo');for(const id of E.regional(r))mark(id,'prospecciones');for(const t of ['geologica','especializada'])for(const id of E.geological(r,t))mark(id,'prospecciones');}
 for(const sp of Object.keys(g.SPECIES))for(const id of E.observation(sp))mark(id,'observacion');
 for(const v of g.VOYAGES)for(const m of ['normal','botanica','reconocimiento','oceanografica','arqueologica','extraordinaria'])for(const id of E.expedition(v.id,m))mark(id,'expediciones');
 for(const site of g.MUSEUM_DIG_SITES)for(const m of ['normal','profunda','especial'])for(const id of E.dig(site.id,m))mark(id,'excavaciones');
 for(const id of E.commerce(5,all,3))mark(id,'comercio');
 for(const k of Object.keys(X(h).PREPARATIONS))for(const id of E.preparation(k,all,2))mark(id,'taller');
 for(const c of X(h).COMMISSIONS)for(const id of E.reward(c.reward,all))mark(id,'encargos');
 const missing=Object.keys(P).filter(id=>!reach.has(id));
 deq(missing,[],'piezas sin vía alcanzable');
 // Cada fuente declarada en la configuración funciona de verdad para esa pieza.
 for(const [id,p] of Object.entries(P))for(const k of Object.keys(p.sources))if(k!=='eventos')assert.ok(reach.get(id).has(k),id+' declara '+k+' pero no lo alcanza');
 // Todas las rutas y yacimientos usados existen en el juego y conservan sus requisitos.
 for(const v of Object.keys(K(h).voyageDestinations))assert.ok(g.VOYAGES.some(x=>x.id===v));
 for(const sId of Object.keys(K(h).digSites))assert.ok(g.MUSEUM_DIG_SITES.some(x=>x.id===sId));
});

test('MEC-03 · 6. coherencia geográfica y temática; anacronismos documentados',()=>{
 const h=game(),g=h.g,s=g.state,E=A3(h).engine,P=K(h).pieces,a=A3(h);
 for(const r of g.REGIONS)for(const id of E.ambient(r))assert.ok(P[id].continents.includes(r.continent),id+' en '+r.name);
 // Una expedición terrestre a los Alpes no entrega piezas marinas; una oceanográfica, solo marinas.
 const marine=new Set(['Los siete mares','Secretos de Atlántida','Conchas de los océanos','Curiosidades de marineros','Corales del mundo','Algas del mundo']);
 for(const m of ['normal','botanica','arqueologica'])assert.ok(E.expedition('alps',m).every(id=>!marine.has(P[id].collection)));
 assert.ok(E.expedition('atlantic_survey','oceanografica').every(id=>marine.has(P[id].collection)));
 // El comercio solo ofrece piezas de continentes ya accesibles (aquí, solo Europa) o «Mundial».
 Object.assign(s,{money:1e7,knowledge:1e7,prestige:500});s.upgrades.shipyard=1;while(Cm(h).level(s,'caravan')<5)Cm(h).upgrade(s,'caravan');
 const conts=a.unlockedContinents();deq([...conts],['Europa']);
 for(const o of a.market().offers)assert.ok(P[o.piece].continents.includes('Europa'),o.piece+' '+P[o.piece].origin);
 // Matriz CSV para auditoría con las 431 piezas y anacronismos señalados.
 const csv=fs.readFileSync('docs/mec03/matriz-coleccionables.csv','utf8').replace(/^﻿/,'').trim().split('\n');
 assert.equal(csv.length,432);assert.ok(csv[0].startsWith('id;nombre;coleccion;gabinete;rareza;procedencia'));
 const notes=Object.values(P).filter(p=>p.note);assert.ok(notes.length>=25);
 assert.ok(P['FOS-11'].note.includes('1861')&&P['DAG-15'].note.includes('1854'));
 // Rarezas coleccionables, relictos y legendarios siguen separados.
 assert.ok(Object.values(P).filter(p=>p.collection==='Rarezas y mitos').every(p=>!g.MUSEUM_RELICTS.some(r=>r.id===p.id)));
});

test('MEC-03 · 7 y 9. intercambio de duplicados con unidades exhibidas y última unidad protegidas',()=>{
 const h=game(),g=h.g,s=rich(h,{regions:false}),a=A3(h),M=h.M,cat=h.A.catalog;
 const m=a.market(),ex=m.offers.find(o=>o.kind==='intercambio'&&o.level===2);assert.ok(ex);
 const cab=ex.give.cabinet,same=Object.values(K(h).pieces).filter(p=>p.cabinet===cab&&p.id!==ex.piece&&p.rarity>=ex.give.minRarity).map(p=>p.id);
 // Tres piezas con una unidad cada una: protegidas por defecto (última unidad).
 for(const id of same.slice(0,3))g.addInventory(id,1);
 assert.equal(a.offerPlan(ex),null,'sin duplicados no hay intercambio');
 for(const id of same.slice(0,3))assert.equal(a.stock(id).tradable,0);
 // Una pieza expuesta no se entrega aunque se desactive la protección.
 M.expose(s,cat,same[0],20);a.setProtection(false);
 assert.equal(a.stock(same[0]).tradable,0);assert.equal(a.stock(same[1]).tradable,1);
 a.setProtection(true);
 // Con duplicados: se entregan exactamente 3 unidades repetidas y se muestra el detalle.
 g.addInventory(same[1],2);g.addInventory(same[2],2);
 const plan=a.offerPlan(ex);assert.ok(plan);assert.equal(Object.values(plan.give).reduce((x,y)=>x+y,0),3);
 assert.ok(!plan.give[same[0]],'la pieza expuesta no se usa');
 let msg='';h.window.confirm=t=>(msg=t,true);
 assert.equal(a.executeOffer(ex.id),true);
 assert.match(msg,/Entregas: .*×/);assert.match(msg,/Recibes: /);assert.match(msg,/Después: .*quedan/);
 assert.equal(s.inventory[same[1]]+s.inventory[same[2]],3,'se entregan 3 de las 6 unidades');
 assert.ok(s.inventory[same[1]]>=1&&s.inventory[same[2]]>=1,'quedan las últimas unidades protegidas');
 assert.equal(s.inventory[ex.piece],1);
 for(const id of same.slice(0,3))assert.ok(M.discovered(s,id),'lo entregado sigue en el registro');
 assert.equal(a.executeOffer(ex.id),false,'cada oferta se completa una vez');
 // No hay conversión universal: el intercambio exige su gabinete y rareza mínima.
 assert.ok(Object.keys(plan.give).every(id=>K(h).pieces[id].cabinet===cab));
});

test('MEC-03 · 8. compra de coleccionables con libras',()=>{
 const h=game(),s=rich(h),a=A3(h);
 const o=a.market().offers.find(x=>x.kind==='compra');const m0=s.money,l0=s.moneyLedger.total;
 assert.equal(a.executeOffer(o.id),true);
 assert.equal(s.money,m0-o.price);assert.equal(s.inventory[o.piece],1);assert.equal(s.moneyLedger.total,l0,'comprar no es un ingreso');
 assert.equal(reg(h,o.piece).sources.comercio,1);
 assert.equal(a.executeOffer(o.id),false);
 // Una solicitud de coleccionista paga mediante el libro de ingresos.
 const req=a.market().offers.find(x=>x.kind==='solicitud');
 h.g.addInventory(req.piece,2);const l1=s.moneyLedger.bySource.comercio||0;
 assert.equal(a.executeOffer(req.id),true);assert.equal(s.moneyLedger.bySource.comercio,l1+req.reward);
});

test('MEC-03 · 10. el registro histórico persiste tras entregar todas las unidades',()=>{
 const h=game(),s=rich(h),a=A3(h);
 const req=a.market().offers.find(x=>x.kind==='solicitud');h.g.addInventory(req.piece,1);a.setProtection(false);
 assert.equal(a.executeOffer(req.id),true);assert.equal(s.inventory[req.piece]||0,0);
 const r=reopen(h);assert.ok(r.M.discovered(r.g.state,req.piece));assert.equal(r.g.state.collectionPrefs.protectLast,false);
});

test('MEC-03 · 11. renovación controlada y persistente de las ofertas',()=>{
 const h=game(),s=rich(h,{levels:2}),a=A3(h);
 const first=J(a.market().offers);assert.ok(first.length&&first.every(o=>o.level===2));
 // Recargar, cambiar de pestaña o volver a consultar no cambia las ofertas.
 const r=reopen(h);deq(A3(r).market().offers,first);r.g.open('objects');r.g.open('expeditions');deq(A3(r).market().offers,first);
 // Subir la Caravana añade los comerciantes de su nivel sin rehacer los anteriores.
 while(Cm(r).level(r.g.state,'caravan')<3)Cm(r).upgrade(r.g.state,'caravan');
 const more=A3(r).market().offers;deq(more.slice(0,first.length),first);assert.ok(more.some(o=>o.level===3));
 // Una oferta completada sigue completada al reabrir.
 const o=more.find(x=>x.kind==='compra');assert.equal(A3(r).executeOffer(o.id),true);
 const r2=reopen(r);assert.equal(A3(r2).market().offers.find(x=>x.id===o.id).done,true);
 // Al cambiar el periodo (24 h, provisional) se renuevan todas de forma determinista.
 r2.now+=24*H;const renewed=A3(r2).market().offers;assert.ok(renewed.every(x=>x.period===Math.floor(r2.now/(24*H))&&!x.done));
 const r3=reopen(r2);deq(A3(r3).market().offers,renewed);
});

test('MEC-03 · 12. prospecciones geológicas y regionales completas',()=>{
 const h=game(),g=h.g,s=rich(h,{levels:1}),a=A3(h),X3=X(h);
 assert.equal(a.canProspect('geologica','HX-01-09'),false,'la geológica requiere Prospecciones II');
 const m0=s.money,k0=s.knowledge;
 assert.equal(a.startProspection('regional','HX-01-09'),true);
 assert.equal(s.money,m0-X3.PROSPECTIONS.regional.money);assert.equal(s.knowledge,k0-X3.PROSPECTIONS.regional.knowledge);
 // Capacidad compartida con las prospecciones documentales de relictos (1 en nivel I).
 assert.equal(g.canStartRelictSurvey(g.MUSEUM_RELICTS[0].id),false);assert.equal(a.startProspection('regional','HX-01-09'),false);
 while(Cm(h).level(s,'surveys')<2)Cm(h).upgrade(s,'surveys');
 assert.equal(a.startProspection('geologica','HX-01-09'),true);
 const [j1,j2]=a.prospections().jobs;assert.equal(j1.endAt-j1.startedAt,X3.PROSPECTIONS.regional.seconds*1000);
 assert.equal(a.collectProspection(j1.id),false,'no termina antes de tiempo');
 h.now=j2.endAt;h.rng.queue.push(...Array(20).fill(0.01));
 const k1=s.knowledge;assert.equal(a.collectProspection(j1.id),true);assert.equal(a.collectProspection(j2.id),true);
 assert.equal(s.knowledge,k1+X3.PROSPECTIONS.regional.knowledgeReward+X3.PROSPECTIONS.geologica.knowledgeReward);
 const hist=a.prospections().history;assert.equal(hist.length,2);
 const geo=Object.keys(hist[1].collectibles);assert.ok(geo.length);for(const id of geo)assert.ok(K(h).pieces[id].sources.prospecciones);
 // Los relictos siguen siendo hallazgos de campo.
 assert.ok(!Object.keys(s.museum.relicts||{}).length);
 assert.equal(a.startProspection('especializada','HX-01-09'),false,'la especializada requiere nivel IV');
});

test('MEC-03 · 13 y 14. historial completo y sin liquidaciones duplicadas',()=>{
 const h=game(),g=h.g,s=rich(h),a=A3(h),a2=A2(h);
 assert.equal(a2.sail('coast','oceanografica'),true);assert.equal(a2.sail('alps','ampliada'),true);
 assert.equal(a2.dig('british_cliffs','profunda'),true);assert.equal(a.startProspection('geologica','HX-01-09'),true);
 h.now+=72*H;h.rng.queue.push(...Array(300).fill(0.02));
 h.tick();const once=J(s);h.tick();h.tick();deq(s.inventory,once.inventory);deq(s.voyageHistory,once.voyageHistory);
 const vh=s.voyageHistory.slice(-2);
 assert.ok(vh.every(v=>v.modality));assert.ok(vh.some(v=>v.collectibles&&Object.keys(v.collectibles).length));
 assert.ok(vh.find(v=>v.modality==='ampliada').extra,'el hallazgo adicional de la ampliada consta en el recibo');
 assert.equal(a2.collectAll('excavations'),1);assert.equal(a2.collectAll('excavations'),0);
 const eh=s.museum.excavationHistory.at(-1);assert.equal(eh.mode,'profunda');assert.ok(eh.extra.fossil_fragment===2);
 assert.equal(a2.collectAll('surveys'),1);assert.equal(a2.collectAll('surveys'),0);
 // Cada hallazgo de coleccionable figura en el registro general con su actividad.
 const finds=s.collectibleFinds;assert.ok(finds.length);assert.ok(finds.every(f=>f.source&&f.activity&&f.item));
 const r=reopen(h);r.tick();deq(r.g.state.inventory,s.inventory);assert.equal(A2(r).collectAll('excavations'),0);
});

test('MEC-03 · 15. fallos de guardado al iniciar y al liquidar actividades',()=>{
 const h=game(),g=h.g,s=rich(h),a=A3(h),a2=A2(h);
 const snap=()=>J({money:s.money,knowledge:s.knowledge,voyages:s.voyages,exc:s.museum.excavations,inv:s.inventory,pros:s.prospections});
 g.persist();const stored=h.store[KEY];
 let restore=failWrites(h);let before=snap();
 assert.equal(a2.sail('alps','ampliada'),false);assert.equal(a2.sail('coast','oceanografica'),false);
 assert.equal(a2.dig('british_cliffs','profunda'),false);assert.equal(a.startProspection('geologica','HX-01-09'),false);
 deq(snap(),before,'sin salida ni cobro a medias');assert.equal(h.store[KEY],stored,'nada se escribió a medias');
 restore();
 assert.equal(a2.dig('british_cliffs','profunda'),true);assert.equal(a.startProspection('geologica','HX-01-09'),true);
 const job=s.museum.excavations.at(-1),pj=a.prospections().jobs.at(-1);h.now+=24*H;
 // Falla el guardado al liquidar: ni recompensa original, ni adicional, ni coleccionables.
 restore=failWrites(h);before=snap();
 assert.equal(g.collectExcavation(job.id),false);assert.equal(a.collectProspection(pj.id),false);
 deq(snap(),before);assert.ok(!s.museum.excavationSettled?.[job.id]&&!s.museum.excavationModeSettled?.[job.id]);
 restore();
 // Recuperación: se liquida una vez, completa.
 const f0=s.inventory.fossil_fragment||0;h.rng.queue.push(0,0.99,0.99,0.99,0.99,0.99,0.99,0.99,0.99);
 assert.equal(g.collectExcavation(job.id),true);assert.equal(g.collectExcavation(job.id),false);
 const site=g.MUSEUM_DIG_SITES.find(x=>x.id==='british_cliffs');
 assert.equal(s.inventory.fossil_fragment-f0,site.fragments[0]+2);
 assert.equal(a.collectProspection(pj.id),true);assert.equal(a.collectProspection(pj.id),false);
 // Comercio: un fallo de guardado no cobra ni entrega.
 const o=a.market().offers.find(x=>x.kind==='compra');restore=failWrites(h);const m0=s.money;
 assert.equal(a.executeOffer(o.id),false);assert.equal(s.money,m0);assert.ok(!s.inventory[o.piece]||s.inventory[o.piece]===before.inv[o.piece]);restore();
 assert.equal(a.executeOffer(o.id),true);
});

test('MEC-03 · 16. fabricación múltiple, subcomponentes e intercambio son atómicos',()=>{
 const h=game(),g=h.g,s=rich(h),a2=A2(h);
 // Materiales para 3 capuchas: pedir 5 no fabrica ninguna (antes fabricaba 3 sin avisar).
 Object.assign(s.inventory,{pressed_flower:3,animal_trace:3,rain_hood:0});
 assert.equal(a2.craft('rain_hood',5),0);assert.equal(s.inventory.rain_hood,0);assert.equal(s.inventory.pressed_flower,3);
 Object.assign(s.inventory,{pressed_flower:5,animal_trace:5});
 let restore=failWrites(h);assert.equal(a2.craft('rain_hood',5),0);assert.equal(s.inventory.rain_hood,0);assert.equal(s.inventory.pressed_flower,5);restore();
 assert.equal(a2.craft('rain_hood',5),5);assert.equal(s.inventory.rain_hood,5);
 // Subcomponentes: la cadena se valida entera antes; con un material de menos no se fabrica nada.
 Object.assign(s.inventory,{binoculars:0,field_telescope:0,polished_lens:3,map_fragment:1,brass_shard:2,parchment_scrap:2});
 assert.equal(h.x.AtlasCampMEC02Plan('field_telescope'),null);assert.equal(a2.craftTree('field_telescope'),false);
 assert.equal(s.inventory.binoculars,0,'no queda un subcomponente fabricado a medias');
 s.inventory.polished_lens=4;assert.deepEqual(J(h.x.AtlasCampMEC02Plan('field_telescope')),['binoculars','field_telescope']);
 restore=failWrites(h);assert.equal(a2.craftTree('field_telescope'),false);assert.equal(s.inventory.binoculars,0);assert.equal(s.inventory.polished_lens,4);restore();
 assert.equal(a2.craftTree('field_telescope'),true);assert.equal(s.inventory.field_telescope,1);
 // Una receta con nivel de Taller insuficiente en la cadena invalida todo el plan.
 g.RECIPES.binoculars={...g.RECIPES.binoculars,minWorkshop:6};s.inventory.polished_lens=4;s.inventory.map_fragment=1;s.inventory.brass_shard=2;s.inventory.parchment_scrap=2;
 assert.equal(h.x.AtlasCampMEC02Plan('field_telescope'),null);
});

test('MEC-03 · 17. compatibilidad con partidas anteriores (MEC-02 y beta)',()=>{
 const old=game().g.initialState();Object.assign(old,{money:9000,knowledge:9000,prestige:30});
 old.upgrades.shipyard=1;old.camp={schema:1,levels:{shipyard:1,caravan:2,workshop:1,excavations:3,surveys:3},history:[]};
 old.voyages=[{id:1,type:'coast',startedAt:T0-60e3,endAt:T0+60e3,modality:'ampliada'}];old.voyageSeq=1;
 old.museum.excavations=[{id:1,site:'british_cliffs',endAt:T0+H,mode:'profunda'}];old.museum.excavationSeq=1;
 old.museum.relictSurveys=[{id:1,relict:'nothobranchius_furzeri',endAt:T0+H}];old.museum.relictSurveySeq=1;
 old.inventory={...old.inventory,'BOT-01':2,'RAR-01':1};
 const h=game({store:{[KEY]:JSON.stringify(old)}}),s=h.g.state;
 assert.equal(s.voyages[0].mec.migrated,true);assert.equal(s.voyages[0].mec.extraLootRolls,1);
 assert.equal(s.museum.excavations[0].mec.mode,'profunda');assert.equal(s.museum.relictSurveys[0].mec.extraLead,1);
 assert.equal(s.collectionPrefs.protectLast,true);assert.equal(s.inventory['BOT-01'],2);
 assert.ok(h.M.discovered(s,'RAR-01'),'las piezas obtenidas en la beta se conservan');
 // Mejorar después no cambia las condiciones ya registradas (punto 8 de la sección 4).
 Object.assign(s,{money:1e7,knowledge:1e7,prestige:500});while(Cm(h).level(s,'surveys')<5)Cm(h).upgrade(s,'surveys');
 assert.equal(s.museum.relictSurveys[0].mec.extraLead,1);
});

test('MEC-03 · 18 y 19. offline, exportación e importación',()=>{
 const h=game(),s=rich(h),a=A3(h);
 assert.equal(a.startProspection('regional','HX-01-09'),true);assert.equal(A2(h).sail('alps','botanica'),true);
 const o=a.market().offers.find(x=>x.kind==='compra');assert.equal(a.executeOffer(o.id),true);a.setProtection(false);
 const raw=saved(h);
 // Cerrado 10 horas: la expedición se liquida al volver; la prospección espera a recogerse.
 const r=game({store:{[KEY]:raw},now:T0+10*H});r.tick();
 assert.equal(r.g.state.voyages.length,0);assert.equal(A3(r).prospections().jobs.length,1);
 const job=A3(r).prospections().jobs[0];assert.equal(A3(r).collectProspection(job.id),true);
 const r2=reopen(r);assert.equal(A3(r2).collectProspection(job.id),false);
 // Exportar e importar conserva ofertas, prospecciones, preferencias, recibos y hallazgos.
 const data=J(r.window.AtlasSaveBridge.getSaveData());
 const t=game({now:r.now});t.window.AtlasSaveBridge.restoreGame(data);const ts=t.g.state;
 for(const k of ['collectorMarket','prospections','collectionPrefs','collectibleFinds','collectionRegistry','voyageHistory'])deq(ts[k],data[k],k);
 assert.equal(A3(t).collectProspection(job.id),false,'importar no reabre una liquidación');
 assert.ok(fs.readFileSync('www/js/save-manager.js','utf8').includes("gameVersion: '5.6.3'"));
});

test('MEC-03 · 20. MEC-01 y MEC-02 se conservan; versión y verificación',()=>{
 const h=game(),g=h.g;
 // MEC-01: el canal histórico sigue primero y con su tasa; el libro y el registro siguen activos.
 deq(h.A.drops.channels()[0].rates.campo,{manual:0.02,auto:0.005});assert.ok(g.state.moneyLedger&&g.state.collectionRegistry);
 // MEC-02: nivel I reproduce el comportamiento anterior.
 const plain=game({noCamp:true});for(const x of [h,plain])rich(x,{levels:1});
 for(const fn of ['maxVoyages','maxExcavations','maxRelictSurveys'])assert.equal(h.g[fn](),plain.g[fn](),fn);
 const pkg=require('../package.json'),rel=require('../www/atlas-release.json');
 assert.equal(pkg.version,'5.6.3');assert.equal(rel.version,'5.6.3');assert.equal(rel.build,'MEC-03');assert.equal(rel.channel,'beta');
 assert.ok(pkg.scripts['release:verify'].includes('tests/mec03.test.cjs'));
 const sw=fs.readFileSync('www/sw.js','utf8');for(const f of ['js/mec03-catalog.js','js/mec03-collect.js'])assert.ok(sw.includes("'./"+f+"'"),f);
 // La configuración generada está al día con su script.
 assert.equal(require('node:child_process').spawnSync(process.execPath,['scripts/build-mec03-catalog.cjs']).status,0);
 assert.ok(!fs.existsSync('android'),'no se generó proyecto Android');
});
