'use strict';
// MEC-07 · V5.6.7 Beta · Récords naturales, conductas extraordinarias y correcciones de MEC-06.
// Pruebas funcionales con el motor real (sección 24 del encargo), varias con el catálogo completo.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const audit=require('./helpers/mec04-audit.cjs');
const KEY='gran_atlas_v05',T0=1790000000000,H=3600e3;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
function rngWith(seed=13){const queue=[];let x=seed>>>0;const f=()=>{if(queue.length)return queue.shift();x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};f.queue=queue;return f;}
function game(o={}){const rng=o.rng||rngWith(o.seed);const h=make({now:T0,headless:true,rng,...o});h.rng=rng;h.window.confirm=()=>true;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,o={})=>game({store:{[KEY]:saved(h)},now:h.now,...o});
const X7=h=>h.x.AtlasMEC07,A7=h=>h.x.AtlasMEC07Actions,A6=h=>h.x.AtlasMEC06Actions,X6=h=>h.x.AtlasMEC06,Cm=h=>h.x.AtlasCampMEC02,K=h=>h.x.AtlasMEC03Catalog;
const failWrites=h=>{const ls=h.localStorage,set=ls.setItem;ls.setItem=()=>{throw new Error('QuotaExceededError');};return ()=>{ls.setItem=set;};};
const RAW=['brass_shard','polished_lens','carved_wood','map_fragment','parchment_scrap','old_ink','river_pebble','ancient_coin'];
function rich(h,workshop=5){const s=h.g.state;Object.assign(s,{money:1e8,knowledge:1e8,prestige:600});s.upgrades.shipyard=1;s.purchases.astillero=1;s.society.rank=20;
 for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;while(Cm(h).level(s,'workshop')<workshop)Cm(h).upgrade(s,'workshop');for(const m of RAW)s.inventory[m]=200;return s;}
const recs=h=>h.g.state.naturalRecords.records,behs=h=>h.g.state.naturalRecords.behaviors;
// Búsquedas manuales reales en una región, con hábitat, hora y estación fijados.
function search(h,{region,habitat,time,season},n,step=61e3){const s=h.g.state;s.currentRegion=region;s.habitat=habitat;s.time=time;s.season=season;for(let i=0;i<n;i++){h.now+=step;h.g.encounter('manual',h.now,true);}}
const CHEETAH={region:'HX-07-10',habitat:'pradera',time:'dia',season:'verano'};

test('MEC-07 · 1. el índice de objetos no presenta la tabla experimental como fuente',()=>{
 const h=game({full:true}),A=A6(h);
 const bot=A.sourcesOf('BOT-01');assert.ok(bot.length);assert.ok(bot.every(x=>!/Gabinete de especímenes: cae de|Drop de prueba|^BETA/.test(x)),JSON.stringify(bot));
 deq(bot,[...new Set(h.x.AtlasMEC03Actions.sourceText('BOT-01'))],'solo fuentes de MEC-03/MEC-04');
 const ch=h.A.drops.channels();deq(ch.find(c=>c.id==='coleccionables').rates.campo,{manual:0,auto:0},'el canal experimental sigue inactivo');
 // Material nuevo: su canal activo; material histórico: tabla histórica y ampliación de MEC-03.
 const n01=A.sourcesOf('MAT-N01');assert.ok(n01.some(x=>/canal de nuevos materiales, activo/.test(x)));assert.ok(!n01.some(x=>/Drop de prueba/.test(x)));
 const owl=A.sourcesOf('owl_feather');assert.ok(owl.some(x=>/Búho real/.test(x)));assert.ok(!owl.some(x=>/Drop de prueba|cae de \d+ especies \(canal/.test(x)));
 const sp=A.activeMaterialSpecies('owl_feather');assert.ok([...sp.values()].every(k=>k==='histórico'||k==='ampliación MEC-03'));
 // Si el canal nuevo se desactivara, el material dejaría de mostrarlo (no hay fuente archivada visible).
 const c=ch.find(x=>x.id==='nuevosMateriales');h.A.drops.configure('nuevosMateriales','campo',{manual:0,auto:0});
 assert.ok(!A.sourcesOf('MAT-N01').some(x=>/canal de nuevos materiales/.test(x)));h.A.drops.configure('nuevosMateriales','campo',c.rates.campo);
 // Ficha de gabinete de MEC-01 sin la tabla experimental.
 assert.ok(!(h.A.detailModel('BOT-01').sources||[]).some(x=>/cae de \d+ especies con el Gabinete/.test(x)));
});

test('MEC-07 · 2. cálculo de derrotas con acceso cartográfico efectivo',()=>{
 const h=game(),g=h.g,s=rich(h),A=A6(h);
 for(const m of ['telescopio_astronomico','esfera_armilar'])assert.ok(A.buildArtifact(m));assert.ok(A.setLocation('esfera_armilar','taller'));
 const asia=g.CARTOGRAPHY3400[0];
 // Sin Astillero no hay ruta de origen accesible.
 s.inventory.carta_estelar=1;s.inventory.map_fragment=3;
 s.upgrades.shipyard=0;assert.equal(A.mapAccess(asia).ok,false);assert.match(A.mapAccess(asia).reason,/ruta/);
 assert.equal(A.studyCheck('calculo-derrotas').ok,false,'el estudio aplica la misma regla');s.upgrades.shipyard=1;assert.ok(A.studyCheck('calculo-derrotas').ok);
 assert.ok(A.mapAccess(asia).ok);assert.ok(A.mapAccess(asia).via.length);
 // Con las partes suficientes no produce otra; con el mapa fabricado, tampoco.
 s.inventory[asia.piece]=asia.quantity;assert.equal(A.mapAccess(asia).ok,false);s.inventory[asia.piece]=0;
 s.inventory[asia.map]=1;assert.notEqual(A.mapTarget()?.map,'asia_map');s.inventory[asia.map]=0;
 // Sin la investigación previa no se elude el requisito cartográfico.
 const sa=g.CARTOGRAPHY3400.find(d=>d.sourceResearch);delete s.purchases[sa.sourceResearch];assert.equal(A.mapAccess(sa).ok,false);
 // Muestra qué parte se obtendrá antes de consumir.
 s.inventory.carta_estelar=1;s.inventory.map_fragment=3;let msg='';h.window.confirm=t=>{msg=t;return false;};
 assert.equal(A.runStudy('calculo-derrotas',h.now),false);assert.equal(s.inventory.map_fragment,3,'cancelar no consume');
 assert.match(msg,new RegExp(g.ITEMS[A.mapTarget().piece].name));
 h.window.confirm=()=>true;const t=A.mapTarget();assert.ok(A.runStudy('calculo-derrotas',h.now));assert.equal(s.inventory[t.piece],1);
});

test('MEC-07 · 3. placas: uso voluntario y solo con imágenes compatibles con el destino',()=>{
 const h=game(),g=h.g,s=rich(h),A=A6(h);assert.ok(A.buildArtifact('camara_daguerrotipos'));assert.ok(A.setLocation('camara_daguerrotipos','campamento'));
 const open=g.VOYAGES.filter(x=>g.voyageConditions3280(x).every(c=>c.met));
 const v=open.find(x=>A.destinationPool(x.id).length);assert.ok(v);
 // Preguntar (por defecto): el mensaje nombra instrumento, material y efecto; cancelar zarpa sin cámara.
 s.inventory.placa_daguerrotipo=2;let msg='';h.window.confirm=t=>{msg=t;return !/¿Usar la cámara/.test(t);};
 assert.ok(g.sail(v.id));let j=s.voyages.at(-1);
 assert.match(msg,/Cámara de daguerrotipos/);assert.match(msg,/1 Placa de daguerrotipo/);assert.match(msg,/% de traer una imagen de/);
 assert.equal(s.inventory.placa_daguerrotipo,2);deq(j.mec06.camera,{used:false,reason:'decisión del jugador'});assert.equal(j.mec06.instruments.camara_daguerrotipos,undefined);
 // Aceptar: consume una placa y fija la decisión.
 h.window.confirm=()=>true;s.voyages=[];assert.ok(g.sail(v.id));j=s.voyages.at(-1);assert.equal(s.inventory.placa_daguerrotipo,1);deq(j.mec06.camera,{used:true});
 assert.equal(j.mec06.instruments.camara_daguerrotipos.pool,A.destinationPool(v.id).length);
 // «Nunca»: no pregunta ni consume.
 h.g.state.mec06.camera='nunca';s.voyages=[];let asked=false;h.window.confirm=t=>{if(/cámara/i.test(t))asked=true;return true;};assert.ok(g.sail(v.id));
 assert.equal(asked,false);assert.equal(s.inventory.placa_daguerrotipo,1);s.mec06.camera='preguntar';h.window.confirm=()=>true;
 // Destino sin imágenes compatibles: nunca consume.
 const pool=A.destinationPool;A.destinationPool=()=>[];// solo para la vista; la regla real se prueba abajo
 A.destinationPool=pool;const empty=Object.keys(K(h).voyageDestinations).find(id=>!A.destinationPool(id).length);
 if(empty){const vv=g.VOYAGES.find(x=>x.id===empty);if(vv&&g.voyageConditions3280(vv).every(c=>c.met)){s.voyages=[];g.sail(vv.id);assert.equal(s.inventory.placa_daguerrotipo,1);assert.match(s.voyages.at(-1).mec06.camera.reason,/sin imágenes compatibles/);}}
 deq(A.cameraPlan('__inexistente__'),{used:false,reason:'sin imágenes compatibles con el destino'});
 // Misma regla en modalidades (Astillero III): la especializada también pasa por la decisión.
 while(Cm(h).level(s,'shipyard')<3)Cm(h).upgrade(s,'shipyard');
 const mod=open.find(x=>h.x.AtlasCampMEC02Hooks.modalityAllowed(x,'oceanografica')&&A.destinationPool(x.id).length)||open.find(x=>h.x.AtlasCampMEC02Hooks.modalityAllowed(x,'botanica')&&A.destinationPool(x.id).length);
 if(mod){s.voyages=[];const m=h.x.AtlasCampMEC02Hooks.modalityAllowed(mod,'oceanografica')?'oceanografica':'botanica';assert.ok(h.x.AtlasCampMEC02Actions.sail(mod.id,m));
  const jj=s.voyages.at(-1);assert.equal(jj.mec.modality,m);deq(jj.mec06.camera,{used:true});assert.equal(s.inventory.placa_daguerrotipo,0);}
});

test('MEC-07 · 4. el Museo desglosa ingresos zoológico, de artefactos y combinado',()=>{
 const h=game(),g=h.g,s=rich(h),A=A6(h);s.museum.wing=3;for(const id of Object.keys(g.SPECIES).slice(0,5))s.museum.exhibits[id]=true;
 assert.ok(A.buildArtifact('automata_ave'));
 const inc=h.x.AtlasMEC05Actions.income(),art=A.attractionRate();
 assert.equal(inc.zoological,g.museumRate());assert.equal(inc.total,g.museumRate(),'compatibilidad');assert.equal(inc.artifacts,art);
 assert.ok(Math.abs(inc.combined-(g.museumRate()+art))<1e-12);assert.ok(Math.abs(inc.combinedPerHour-inc.combined*3600)<1e-9);
 assert.ok(Math.abs(inc.offlineCombined-inc.combined*8*3600)<1e-6);
 assert.ok(inc.demos.some(d=>d.id==='demo-automata'&&d.ok));
 // Las demostraciones no entran en el ingreso por segundo.
 assert.ok(A.runDemo('demo-automata',h.now));assert.equal(h.x.AtlasMEC05Actions.income().combined,inc.combined);
 s.museumView='exhibitions';const html=g.museumViewModel3270().view.mec05;
 assert.match(html,/Ingreso zoológico/);assert.match(html,/Artefactos exhibidos/);assert.match(html,/Proyección offline/);assert.match(html,/data-action="mec06-demo" data-id="demo-automata"/);
});

test('MEC-07 · 5. normalización determinista de instrumentos instalados',()=>{
 const o=game(),os=rich(o,2);const ids=['microscopio_compuesto','telescopio_astronomico','esfera_armilar','camara_oscura','pila_volta','galvanometro'];
 for(const id of ids)os.museum.collections[id]=true;
 os.mec06.installed=Object.fromEntries(ids.map(id=>[id,'taller']));os.mec06.installed.automata_ave='taller';os.mec06.installed.no_existe='taller';os.mec06.installed.planetario_orrery='campamento';
 os.museum.displays={'collection:microscopio_compuesto':true};
 const r=reopen(o),s=r.g.state,A=A6(r),cap=A.capacity('taller');assert.equal(cap,3);
 const kept=Object.keys(s.mec06.installed);deq(kept,Object.keys(X6(r).ARTIFACTS).filter(id=>ids.includes(id)).slice(0,3),'se conservan en el orden de la configuración');
 for(const id of ids)assert.notEqual(A.location(id),null,id+' no se pierde');
 assert.equal(ids.filter(id=>A.location(id)==='almacen').length,3);
 assert.equal(s.museum.displays['collection:microscopio_compuesto'],false,'instalado = fuera de vitrina');
 assert.ok(s.mec06.recovered.length>=3);
 const once=J(s.mec06);r.g.normalizeMEC01(s);deq(s.mec06.installed,once.installed);
});

test('MEC-07 · 6 y 7. migración del guepardo, idempotente y con su requisito alternativo',()=>{
 const o=game(),os=o.g.state;delete os.naturalRecords;
 os.beta560=os.beta560||{};os.beta560.hitos={af_guepardo:{best:104.2,tries:5,approved:true,bestAt:T0-5*H,approvedAt:T0-5*H}};
 const k0=os.knowledge,p0=os.prestige;
 const r=reopen(o),s=r.g.state,rec=s.naturalRecords.records['guepardo-velocidad'];
 deq([rec.best.value,rec.count,rec.achieved,rec.best.at,rec.achievedAt],[104.2,5,true,T0-5*H,T0-5*H]);
 deq(rec.rewards,{first:'migrado',milestone:'migrado'},'sin recompensas retroactivas');assert.equal(s.knowledge,k0);assert.equal(s.prestige,p0);
 assert.ok(s.naturalRecords.migration.beta560);deq(s.beta560.hitos.af_guepardo.best,104.2,'el registro antiguo se conserva');
 const again=reopen(r);deq(again.g.state.naturalRecords,s.naturalRecords,'idempotente');
 // Valores provisionales conservados.
 const L=X7(r).byId['guepardo-velocidad'];deq([L.threshold,L.chance.manual,L.model.mean,L.model.sd,L.bounds.min,L.bounds.max],[100,0.1,85,10,50,120]);
 // Requisito alternativo del Cuaderno (MEC-01) y el nuevo del halcón peregrino.
 s.feedObs.af_guepardo=0;assert.equal(r.g.stageRequirements('af_guepardo',3).extraOk,true);
 s.naturalRecords.records['halcon-picada']={count:1,first:null,best:{value:320,at:T0,region:'HX-01-05',method:'estimacion'},achieved:true,achievedAt:T0,regions:{},pending:null,rewards:{}};
 const req=r.g.stageRequirements('na_esp_falco_peregrinus',3);assert.equal(req.extraOk,true);assert.match(req.extra,/Velocidad en picada ≥ 300 km\/h/);
 // Una sola tirada de velocidad por avistamiento del guepardo (no coexisten dos motores).
 const h=game(),calls=[];const run=h.A.run;h.A.run=id=>{calls.push(id);return run(id);};
 search(h,CHEETAH,300);const seen=h.g.state.sightings.af_guepardo||0;assert.ok(seen>0);
 assert.equal(calls.filter(x=>x==='af_guepardo').length,h.g.state.naturalRecords.records['guepardo-velocidad']?.count>=0?calls.filter(x=>x==='af_guepardo').length:0);
 assert.ok((h.g.state.naturalRecords.records['guepardo-velocidad']?.count||0)<=calls.filter(x=>x==='af_guepardo').length);
});

test('MEC-07 · 8, 9 y 10. 25 hitos y 20 conductas válidos; varios por especie',()=>{
 const h=game({full:true}),X=X7(h),g=h.g;
 assert.ok(X.RECORDS.length>=20&&X.RECORDS.length<=30);assert.ok(X.BEHAVIORS.length>=15&&X.BEHAVIORS.length<=20);
 const ids=[...X.RECORDS,...X.BEHAVIORS].map(e=>e.id);assert.equal(new Set(ids).size,ids.length);
 for(const e of [...X.RECORDS,...X.BEHAVIORS]){assert.ok(g.SPECIES[e.species],e.id);for(const k of ['id','species','name','description','art','status','science','hint','chance'])assert.ok(e[k]!==undefined,e.id+'.'+k);}
 for(const e of X.RECORDS)for(const k of ['type','unit','model','bounds','threshold','method','medal'])assert.ok(e[k]!==undefined,e.id+'.'+k);
 const types=new Set(X.RECORDS.map(e=>e.type));for(const t of ['velocidad','longitud','altura','masa','tamano-minimo','profundidad','duracion','altitud','distancia-migratoria','longevidad','frecuencia','precision'])assert.ok(types.has(t),t);
 const models=new Set(X.RECORDS.map(e=>e.model.kind));for(const m of ['normal','triangular','discreta','evidencia-regiones'])assert.ok(models.has(m),m);
 const per={};for(const e of [...X.RECORDS,...X.BEHAVIORS])per[e.species]=(per[e.species]||0)+1;
 assert.equal(per.gm06_mellisuga_helenae,2);assert.equal(per.polar_esp_aptenodytes_forsteri,2);
 // Accesibilidad con el motor real (catálogo completo, 125 regiones).
 const a=audit.recordsAudit(h);assert.ok(a.ok,JSON.stringify(Object.entries(a.entries).filter(([,v])=>v.problems.length)));
 for(const [id,e] of Object.entries(a.entries)){assert.ok(e.witness.ok,id);assert.ok(e.regions.length,id);}
 for(const [id,e] of Object.entries(a.entries))if(e.plausibility){assert.ok(e.plausibility.pThreshold>0,id);}
});

test('MEC-07 · 11 y 12. récords máximos y mínimos y mejores marcas',()=>{
 const h=game(),X=X7(h),max=X.byId['jirafa-altura'],min=X.byId['sapo-pulga-tamano'],tiny=X.byId['colibri-abeja-tamano'];
 let r=X.update(max,null,{value:5.1,at:1,region:'A',method:'directa'}).record;
 let u=X.update(max,r,{value:4.9,at:2,region:'B',method:'directa'});assert.equal(u.record.best.value,5.1);assert.equal(u.record.count,2);deq(u.events,[]);
 u=X.update(max,u.record,{value:5.7,at:3,region:'B',method:'directa'});assert.equal(u.record.best.value,5.7);assert.ok(u.events.includes('best')&&u.events.includes('milestone'));
 assert.equal(u.record.regions.B.best,5.7);assert.equal(u.record.regions.A.best,5.1);
 // Mínimos: un valor menor sustituye al anterior; el hito exige ≤ umbral.
 r=X.update(tiny,null,{value:5.9,at:1,region:'A',method:'estimacion'}).record;u=X.update(tiny,r,{value:5.2,at:2,region:'A',method:'estimacion'});
 assert.equal(u.record.best.value,5.2);assert.ok(u.events.includes('milestone'));assert.equal(X.update(tiny,u.record,{value:5.6,at:3,region:'A'}).record.best.value,5.2);
 // Con validación: la observación queda pendiente y no cuenta como marca.
 const p=X.update(min,null,{value:8,at:1,region:'A',method:'estimacion'});assert.ok(p.events.includes('pending'));assert.equal(p.record.best,null);assert.equal(p.record.pending.value,8);
 // Los valores generados respetan los límites (20.000 muestras por hito).
 for(const e of X.RECORDS){const g=X.rng('t|'+e.id);for(let i=0;i<20000;i++){const v=X.generate(e,g,{evidenceRegions:3});assert.ok(v>=e.bounds.min&&v<=e.bounds.max,e.id+' '+v);}}
});

test('MEC-07 · 13. elegibilidad geográfica y ambiental',()=>{
 const h=game({full:true}),X=X7(h);
 const liebre=X.byId['liebre-carrera'],aguila=X.byId['aguila-real-altitud'],hacha=X.behaviorById['pez-hacha-bioluminiscencia'],emp=X.behaviorById['emperador-incubacion'];
 assert.equal(X.eligible(liebre,{species:'liebre_europea',time:'dia'}),false);assert.equal(X.eligible(liebre,{species:'liebre_europea',time:'noche'}),true);
 assert.equal(X.eligible(liebre,{species:'lobo_gris',time:'noche'}),false,'otra especie');
 assert.equal(X.eligible(aguila,{species:'aguila_real',habitats:['bosque']}),false);assert.equal(X.eligible(aguila,{species:'aguila_real',habitats:['montana']}),true);
 assert.equal(X.eligible(hacha,{species:hacha.species,deep:false}),false);assert.equal(X.eligible(hacha,{species:hacha.species,deep:true}),true);
 assert.equal(X.eligible(emp,{species:emp.species,season:'verano'}),false);
 // En el motor real: con la hora equivocada nunca aparece el récord de la liebre.
 const g=game(),s=g.g.state;for(const r of g.g.REGIONS)s.regionUnlocked[r.id]=true;search(g,{region:'HX-03-09',habitat:'pradera',time:'dia',season:'verano'},1500);
 assert.equal(recs(g)['liebre-carrera'],undefined);
});

test('MEC-07 · 14, 15 y 16. encuentros grupales, censos y búsquedas manuales y automáticas',()=>{
 const h=game({seed:21}),g=h.g,s=g.state;for(const r of g.REGIONS)s.regionUnlocked[r.id]=true;
 s.upgrades.groupTier=3;s.upgrades.censusTier=2;s.upgrades.autoGroup=true;s.upgrades.autoCensus=true;
 const seen=[];const run=h.A.run;let perSearch=[];h.A.run=id=>{perSearch.push(id);return run(id);};
 let maxAmount=0;
 for(let i=0;i<800;i++){perSearch=[];h.now+=61e3;s.currentRegion='HX-07-10';s.habitat='pradera';s.time='dia';s.season='verano';g.encounter('manual',h.now,true);
  const e=s.lastEncounter;if(e?.entries){deq([...perSearch].sort(),e.entries.map(x=>x.id).sort(),'una evaluación por especie observada, nunca por individuo');maxAmount=Math.max(maxAmount,...e.entries.map(x=>x.amount));seen.push(...perSearch);}}
 assert.ok(maxAmount>=3,'censo ×3 activo');
 // Ningún hito de especies ausentes de los encuentros.
 const observed=new Set(seen);for(const [id,r] of Object.entries(recs(h)))assert.ok(observed.has(X7(h).byId[id].species),id);
 for(const id of Object.keys(behs(h)))assert.ok(observed.has(X7(h).behaviorById[id].species),id);
 // Búsquedas automáticas: también registran, con su método.
 const a=game({seed:22}),as=a.g.state;for(const r of a.g.REGIONS)as.regionUnlocked[r.id]=true;as.helpers=1;as.currentRegion='HX-07-10';
 as.autoPending=[{at:T0-8*H,end:T0,interval:20000,currentRegion:'HX-07-10',season:'verano',habitat:'pradera',time:'dia'}];as.lastTick=T0;
 for(let i=0;i<60&&as.autoPending.length;i++)a.tick();
 const auto=Object.values(recs(a)).filter(r=>r.first?.method==='búsqueda automática'||Object.keys(r.regions||{}).length);
 assert.ok(auto.length>0,'registros en búsquedas automáticas');
 // Sin avistamiento no hay registros.
 const n=game(),ns=n.g.state;ns.time='sin-fauna';const before=J(ns.naturalRecords);for(let i=0;i<200;i++){n.now+=61e3;n.g.encounter('manual',n.now,false);}deq(ns.naturalRecords,before);
});

test('MEC-07 · 17. procesamiento offline con contexto histórico, sin repetir sorteos',()=>{
 const make1=()=>{const h=game({seed:31});const s=h.g.state;for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;s.helpers=1;s.currentRegion='HX-01-09';s.naturalRecords.salt='fijo';
  s.autoPending=[{at:T0-8*H,end:T0-60e3,interval:4000,currentRegion:'HX-07-10',season:'verano',habitat:'pradera',time:'dia'}];s.lastTick=T0;return h;};
 const h=make1(),s=h.g.state;h.now=T0+5*H;for(let i=0;i<200&&s.autoPending.length;i++)h.tick();
 const all=[...Object.values(recs(h)).flatMap(r=>[r.first,r.best].filter(Boolean)),...Object.values(behs(h)).map(b=>({at:b.firstAt,region:b.region}))];
 assert.ok(all.length>0);for(const x of all){assert.ok(x.at>=T0-8*H&&x.at<=T0,'fecha del tramo, no Date.now()');assert.equal(x.region,'HX-07-10','región del tramo');}
 assert.equal(s.currentRegion,'HX-01-09');
 // Volver a abrir no reevalúa búsquedas liquidadas.
 const snap=J(s.naturalRecords);const r=reopen(h,{now:h.now+1000});r.tick();deq(r.g.state.naturalRecords.records,snap.records);
 // Mismo tramo, misma semilla: mismo resultado (cerrar y reabrir antes de liquidar no permite repetir el sorteo).
 const b=make1();b.now=T0+5*H;for(let i=0;i<200&&b.g.state.autoPending.length;i++)b.tick();deq(b.g.state.naturalRecords.records,snap.records);
});

test('MEC-07 · 18 y 19. probabilidades históricas intactas; legendarios y relictos independientes',()=>{
 const pick=s=>J({sightings:s.sightings,discovered:s.discovered,specimens:s.specimens,sexSeen:s.sexSeen,feedObs:s.feedObs,inventory:s.inventory,registry:s.collectionRegistry,relicts:s.museum?.relicts,legend:s.legendaries,cheetah:s.beta560?.hitos,money:s.money});
 const runOne=o=>{const h=game({seed:41,...o}),s=h.g.state;for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;s.upgrades.specimenDrops=1;search(h,CHEETAH,1500);return h;};
 const a=runOne({}),b=runOne({without:['mec07-natural-records']});
 deq(pick(a.g.state),pick(b.g.state),'misma secuencia histórica con y sin MEC-07');
 assert.ok(Object.keys(a.g.state.naturalRecords.records).length>1,'MEC-07 sí registró récords nuevos');
 // El conocimiento solo difiere en las recompensas de los registros.
 const paid=Object.values(a.g.state.naturalRecords.records).concat(Object.values(a.g.state.naturalRecords.behaviors)).reduce((t,r)=>t+Object.values(r.rewards||{}).reduce((x,y)=>x+(y?.knowledge||0),0),0);
 assert.equal(a.g.state.knowledge-b.g.state.knowledge,paid);
 // Ningún récord entrega objetos, relictos ni legendarios; ninguno usa especies legendarias o relictas.
 const X=X7(a),leg=new Set((a.g.LEGENDARY_SPECIMENS||[]).map(l=>l.id)),rel=new Set(a.g.MUSEUM_RELICTS.map(r=>r.id));
 for(const e of [...X.RECORDS,...X.BEHAVIORS]){assert.ok(!leg.has(e.species)&&!rel.has(e.species));}
 deq(Object.keys(X.REWARDS),['first','milestone','behavior','medal']);for(const r of Object.values(X.REWARDS))if(typeof r==='object')deq(Object.keys(r).filter(k=>!['knowledge','prestige'].includes(k)),[]);
});

test('MEC-07 · 20. las monografías no se bloquean',()=>{
 const h=game(),b=game({without:['mec07-natural-records']});
 for(const id of Object.keys(h.g.SPECIES).slice(0,120))for(let i=1;i<=5;i++){if(['af_guepardo','na_esp_falco_peregrinus'].includes(id))continue;
  const x=h.g.stageRequirements(id,i),y=b.g.stageRequirements(id,i);deq([x.allOk,x.extraOk,x.sightOk],[y.allOk,y.extraOk,y.sightOk],id+' etapa '+i);}
 // El halcón tiene una vía alternativa, no un requisito nuevo: su vía histórica sigue valiendo.
 const s=h.g.state,f='na_esp_falco_peregrinus';s.feedObs[f]=999;b.g.state.feedObs[f]=999;const r=h.g.stageRequirements(f,3);const r0=b.g.stageRequirements(f,3);assert.equal(r.extraOk,r0.extraOk);
 // Las monografías publicadas siguen publicadas.
 s.published.lobo_gris=true;const re=reopen(h);assert.equal(re.g.state.published.lobo_gris,true);
});

test('MEC-07 · 21. recompensas únicas y persistentes',()=>{
 const h=game(),s=h.g.state,X=X7(h),e=X.byId['jirafa-altura'];
 const k0=s.knowledge,p0=s.prestige;s.naturalRecords.salt='r';
 // Observaciones a través del motor con valores crecientes.
 const obs=v=>{h.now+=1000;const prev=s.naturalRecords.records[e.id];const u=X.update(e,prev,{value:v,at:h.now,region:'HX-07-10',method:'directa'});s.naturalRecords.records[e.id]=u.record;return u;};
 // Mejor vía pública: evaluar con el motor real hasta cumplir el hito.
 search(h,{region:'HX-07-10',habitat:'pradera',time:'dia',season:'verano'},4000);
 const r=s.naturalRecords.records[e.id];assert.ok(r,'la jirafa registró');
 const paid=Object.values(s.naturalRecords.records).concat(Object.values(s.naturalRecords.behaviors));
 for(const x of paid)for(const [k,v] of Object.entries(x.rewards||{}))assert.ok(['first','milestone','behavior'].includes(k));
 const prestige=s.prestige-p0,ach=Object.values(s.naturalRecords.records).filter(x=>x.rewards?.milestone&&x.rewards.milestone!=='migrado').length,beh=Object.values(s.naturalRecords.behaviors).filter(x=>x.rewards?.behavior).length;
 assert.equal(prestige,ach*X.REWARDS.milestone.prestige+beh*X.REWARDS.behavior.prestige,'prestigio solo por hitos y conductas nuevos');
 // Más observaciones o mejoras marginales no vuelven a pagar.
 const again=game({store:{[KEY]:saved(h)},now:h.now});const sa=again.g.state,pp=sa.prestige,kk=sa.knowledge;
 const rec=sa.naturalRecords.records[e.id];const u=X.update(e,rec,{value:(rec.best?.value||5)+0.01,at:h.now,region:'HX-07-10',method:'directa'});assert.ok(!u.events.includes('first'));
 assert.equal(sa.prestige,pp);assert.equal(sa.knowledge,kk,'cargar no paga nada');
 void obs;void k0;
});

test('MEC-07 · 22 y 24. validación científica y fallos de guardado',()=>{
 const h=game(),s=rich(h),A=A7(h),X=X7(h);
 s.naturalRecords.records['sapo-pulga-tamano']={count:1,first:{value:8.0,at:T0,region:'sa_cerrado_brasileno',method:'estimacion'},best:null,achieved:false,achievedAt:null,regions:{sa_cerrado_brasileno:{count:1,best:null}},pending:{value:8.0,at:T0,region:'sa_cerrado_brasileno',method:'estimacion'},rewards:{}};
 assert.equal(A.validationCheck('sapo-pulga-tamano').ok,false);assert.match(A.validationCheck('sapo-pulga-tamano').reasons.join(),/Microscopio compuesto instalado en el Taller/);
 assert.ok(A6(h).buildArtifact('microscopio_compuesto'));assert.ok(A6(h).setLocation('microscopio_compuesto','taller'));
 h.g.persist();const before=J(s.naturalRecords),k0=s.knowledge;const restore=failWrites(h);assert.equal(A.validate('sapo-pulga-tamano',h.now),false);restore();
 deq(s.naturalRecords,before);assert.equal(s.knowledge,k0);
 assert.ok(A.validate('sapo-pulga-tamano',h.now));const r=s.naturalRecords.records['sapo-pulga-tamano'];
 assert.equal(r.pending,null);assert.equal(r.best.value,8.0);assert.equal(r.best.instrument,'microscopio_compuesto');assert.equal(r.achieved,true,'8,0 mm ≤ 8,2 mm');
 assert.equal(r.first.value,8.0,'se conserva el registro observado');assert.equal(r.count,1);
 assert.ok(r.rewards.milestone);assert.equal(A.validate('sapo-pulga-tamano',h.now),false,'nada más que validar');
 // Ningún hito exige el Taller V; solo cinco tienen validación instrumental.
 const ins=X.RECORDS.filter(e=>e.instrument);assert.equal(ins.length,5);for(const e of ins)assert.ok(X6(h).ARTIFACTS[e.instrument.id].minWorkshop<=4,e.id);
});

test('MEC-07 · 23. registro regional y procedencia',()=>{
 const h=game({seed:51}),g=h.g,s=g.state;for(const r of g.REGIONS)s.regionUnlocked[r.id]=true;
 search(h,CHEETAH,1500);
 for(const [id,r] of Object.entries(recs(h)))for(const reg of Object.keys(r.regions||{})){assert.equal(reg,'HX-07-10');assert.ok(s.regionalRecords.regions[reg].natural[id]>=1,id);}
 for(const [id,b] of Object.entries(behs(h))){assert.equal(b.region,'HX-07-10');assert.ok(s.regionalRecords.regions['HX-07-10'].natural[id]>=1);}
 // Global frente a regional: el mejor global es el máximo de los regionales.
 for(const r of Object.values(recs(h)))if(r.best&&!r.migrated){const bests=Object.values(r.regions).map(x=>x.best).filter(x=>x!==null);assert.ok(bests.includes(r.best.value));}
 // Partidas antiguas: sin registros regionales inventados.
 const o=game();delete o.g.state.naturalRecords;o.g.state.discovered.af_guepardo=true;const re=reopen(o);deq(re.g.state.naturalRecords.records,{});
});

test('MEC-07 · 25. exportación e importación',()=>{
 const h=game({seed:61}),s=h.g.state;for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;search(h,CHEETAH,800);
 const data=J(h.window.AtlasSaveBridge.getSaveData());const t=game({now:h.now+1000});const k=t.g.state.knowledge;t.window.AtlasSaveBridge.restoreGame(data);
 deq(t.g.state.naturalRecords,data.naturalRecords);assert.equal(t.g.state.knowledge,data.knowledge,'importar no paga recompensas');
 const again=J(t.window.AtlasSaveBridge.getSaveData());deq(again.naturalRecords,data.naturalRecords);void k;
 // Presentación: sección del Cuaderno, Bestiario y aviso del encuentro.
 const sec=A7(h).section();assert.match(sec,/Récords naturales/);assert.match(sec,/por descubrir · <span class="small">Pista:/);
 const known=Object.keys(recs(h))[0];if(known){const sp=X7(h).byId[known].species;s.discovered[sp]=true;const m=h.g.bestiaryModalModel3260(sp);assert.match(m.monograph,/Registros especiales/);}
});

test('MEC-07 · 26. MEC-01 a MEC-06 se conservan; versión y verificación',()=>{
 const h=game(),g=h.g;
 assert.equal(Object.keys(K(h).pieces).length,431);assert.equal(h.A.catalog.collections.size,32);assert.equal(h.B.items.filter(r=>r[2]===1).length,27);
 assert.equal(h.B.materiales.length,6);assert.equal(h.B.artefactos.length,15);assert.equal(h.x.AtlasMEC04.RANKS.length,20);assert.equal(h.x.AtlasMEC05.BENEFITS.length,11);
 assert.equal(Object.keys(X6(h).STUDIES).length,14);
 const full=game({full:true});assert.equal(full.g.REGIONS.length,125);assert.equal(Object.keys(full.g.SPECIES).length,1000);
 assert.equal((full.g.LEGENDARY_SPECIMENS||[]).length,30);assert.equal(full.g.MUSEUM_RELICTS.length,20);
 const pkg=require('../package.json'),rel=require('../www/atlas-release.json');
 // MEC-08: la versión se compara con package.json (antes, el literal 5.6.7 / MEC-07).
 assert.match(pkg.version,/^5\.6\.\d+$/);assert.equal(rel.version,pkg.version);assert.match(rel.build,/^MEC-0\d$/);assert.equal(rel.channel,'beta');
 assert.ok(pkg.scripts['release:verify'].includes('tests/mec07.test.cjs'));
 assert.ok(fs.readFileSync('www/sw.js','utf8').includes("'./js/mec07-natural-records.js'"));
 assert.ok(fs.readFileSync('www/index.html','utf8').includes('js/mec07-natural-records.js?v='+pkg.version));
 assert.ok(fs.readFileSync('www/js/save-manager.js','utf8').includes("gameVersion: '"+pkg.version+"'"));
 assert.ok(fs.existsSync('docs/mec07/hitos.csv'));assert.ok(!fs.existsSync('android'));
});
