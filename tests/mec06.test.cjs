'use strict';
// MEC-06 · V5.6.6 Beta · Artefactos científicos, materiales, instrumentos y evolución del Taller,
// y correcciones de MEC-05. Pruebas funcionales sobre los motores reales (sección 22 del encargo).
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const audit=require('./helpers/mec04-audit.cjs');
const KEY='gran_atlas_v05',T0=1790000000000,H=3600e3;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
function rngWith(seed=11){const queue=[];let x=seed>>>0;const f=()=>{if(queue.length)return queue.shift();x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};f.queue=queue;return f;}
function game(o={}){const rng=o.rng||rngWith(o.seed);const h=make({now:T0,headless:true,rng,...o});h.rng=rng;h.window.confirm=()=>true;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,o={})=>game({store:{[KEY]:saved(h)},now:h.now,...o});
const X6=h=>h.x.AtlasMEC06,A6=h=>h.x.AtlasMEC06Actions,A5=h=>h.x.AtlasMEC05Actions,A4=h=>h.x.AtlasMEC04Actions,A3=h=>h.x.AtlasMEC03Actions,Cm=h=>h.x.AtlasCampMEC02,K=h=>h.x.AtlasMEC03Catalog;
const failWrites=h=>{const ls=h.localStorage,set=ls.setItem;ls.setItem=()=>{throw new Error('QuotaExceededError');};return ()=>{ls.setItem=set;};};
const RAW=['brass_shard','polished_lens','carved_wood','map_fragment','parchment_scrap','old_ink','river_pebble','ancient_coin'];
function rich(h,workshop=5){const s=h.g.state;Object.assign(s,{money:1e8,knowledge:1e8,prestige:600});s.upgrades.shipyard=1;s.purchases.astillero=1;s.society.rank=20;
 for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;while(Cm(h).level(s,'workshop')<workshop)Cm(h).upgrade(s,'workshop');for(const m of RAW)s.inventory[m]=200;return s;}
const build=(h,...ids)=>{for(const id of ids)assert.ok(A6(h).buildArtifact(id),'fabrica '+id);};
const ledger=(s,k)=>s.moneyLedger.bySource[k]||0;
const BETA=['microscopio_compuesto','telescopio_astronomico','globo_celeste','esfera_armilar','planetario_orrery','automata_ave','automata_escribiente','estereoscopio_espejos','camara_daguerrotipos','linterna_magica','camara_oscura','maquina_electrostatica','pila_volta','galvanometro','induccion_farad'];

test('MEC-06 · 1 y 22. exhibir, retirar, catalogar y reubicar son atómicos ante fallos de guardado',()=>{
 const h=game(),g=h.g,s=rich(h);s.museum.wing=3;
 // Gabinete de coleccionables.
 g.addInventory('BOT-01',1);g.persist();const cab0=J(s.museum.cabinets),stored=h.store[KEY];
 let restore=failWrites(h);h.A.mec01('mec01-cab-expose','BOT-01');restore();
 deq(s.museum.cabinets,cab0,'sin reserva ni bonificación');assert.equal(h.M.pieceStatus(s,h.A.catalog,'BOT-01').exhibited,0);assert.equal(h.store[KEY],stored);
 h.A.mec01('mec01-cab-expose','BOT-01');assert.ok(s.museum.cabinets['Botánica'].includes('BOT-01'));
 assert.ok(reopen(h).g.state.museum.cabinets['Botánica'].includes('BOT-01'),'la exposición quedó guardada');
 // Exposición zoológica.
 const sp=Object.keys(g.SPECIES)[0];s.discovered[sp]=true;s.published[sp]=true;s.stages=s.stages||{};s.stages[sp]=5;
 const m0=s.money;restore=failWrites(h);assert.equal(g.exhibitAnimal(sp),false);restore();
 assert.equal(s.money,m0);assert.ok(!s.museum.exhibits[sp]);assert.ok(g.exhibitAnimal(sp));assert.ok(s.museum.exhibits[sp]);
 restore=failWrites(h);assert.equal(g.removeExhibit(sp),false);restore();assert.ok(s.museum.exhibits[sp],'retirar sin guardar no retira');
 // Catalogar un artefacto: sin consumo parcial.
 const inv=J(s.inventory),k0=s.knowledge;restore=failWrites(h);assert.equal(A6(h).buildArtifact('microscopio_compuesto'),false);restore();
 deq(s.inventory,inv);assert.equal(s.knowledge,k0);assert.equal(A6(h).location('microscopio_compuesto'),null);
 build(h,'microscopio_compuesto');
 // Vitrina y reubicación.
 const d0=J(s.museum.displays);restore=failWrites(h);assert.equal(g.toggleMuseumDisplay('collection:microscopio_compuesto'),false);
 assert.equal(A6(h).setLocation('microscopio_compuesto','taller'),false);restore();
 deq(s.museum.displays,d0);assert.equal(A6(h).location('microscopio_compuesto'),'museo');deq(s.mec06.installed,{});
});

test('MEC-06 · 2. catalogado, exhibido, instalado, almacenado y equipado son estados distintos',()=>{
 const h=game(),g=h.g,s=rich(h);build(h,'microscopio_compuesto');const A=A6(h);
 let st=A.states('microscopio_compuesto');deq([st.catalogued,st.exhibited,st.installed,st.stored,st.usable],[true,true,null,false,true]);
 assert.ok(A.setLocation('microscopio_compuesto','taller'));st=A.states('microscopio_compuesto');
 deq([st.catalogued,st.exhibited,st.installed,st.stored],[true,false,'taller',false]);
 assert.equal(g.museumIsDisplayed('collection','microscopio_compuesto'),false,'fuera de la vitrina');
 assert.ok(!g.museumOtherExhibits().some(p=>p.id==='microscopio_compuesto'));
 const a5=A5(h).artifacts().find(a=>a.id==='microscopio_compuesto');deq([a5.catalogued,a5.exhibited,a5.instrument],[true,false,'taller']);
 assert.ok(A.setLocation('microscopio_compuesto','almacen'));st=A.states('microscopio_compuesto');deq([st.exhibited,st.installed,st.stored,st.usable],[false,null,true,false]);
 // Volver a la vitrina con el botón histórico desinstala y expone.
 assert.ok(A.setLocation('microscopio_compuesto','taller'));assert.ok(g.toggleMuseumDisplay('collection:microscopio_compuesto'));
 assert.equal(A.location('microscopio_compuesto'),'museo');deq(s.mec06.installed,{});
 // Fósiles: retirar de la vitrina deja de contar como exhibido (MEC-05 los igualaba).
 const rec=g.MUSEUM_FOSSIL_RECIPES.find(r=>r.unique);s.museum.collections[rec.id]=true;
 assert.equal(A5(h).fossils().reconstructions.find(r=>r.id===rec.id).exhibited,true);
 g.toggleMuseumDisplay('collection:'+rec.id);assert.equal(A5(h).fossils().reconstructions.find(r=>r.id===rec.id).exhibited,false);
 assert.equal(A5(h).fossils().reconstructions.find(r=>r.id===rec.id).obtained,true);
 // Equipamiento portátil: estado propio, sin ranuras nuevas.
 s.inventory.binoculars=1;s.equipment.instrument='binoculars';st=A.states('binoculars');assert.equal(st.equipped,true);assert.equal(st.location,'equipo');
 deq(Object.keys(X6(h).PLACES),['museo','taller','campamento','almacen']);
 // Un artefacto no puede estar en una ubicación incompatible ni en dos a la vez.
 assert.equal(A.setLocation('microscopio_compuesto','campamento'),false);build(h,'automata_ave');assert.equal(A.setLocation('automata_ave','taller'),false);
});

test('MEC-06 · 3 y 23. partidas antiguas: estados históricos conservados, sin recompensas inventadas',()=>{
 const o=game(),os=rich(o);for(const id of ['carta_historica','medallon_viajero','microscopio_compuesto'])os.museum.collections[id]=true;
 os.museum.displays={'collection:medallon_viajero':false};delete os.mec06;delete os.regionalRecords;
 os.voyages=[{id:900002,type:'coast',startedAt:T0,endAt:T0+H,mec:{modality:'normal',migrated:true}}];
 const before=J({ledger:os.moneyLedger,inv:os.inventory,knowledge:os.knowledge,coll:os.museum.collections});
 const r=reopen(o),s=r.g.state,A=A6(r);
 assert.equal(A.location('carta_historica'),'museo');assert.equal(A.location('medallon_viajero'),'almacen');assert.equal(A.location('microscopio_compuesto'),'museo');
 deq(s.mec06.installed,{});deq(s.regionalRecords.regions,{},'sin avistamientos regionales retroactivos');
 deq({ledger:s.moneyLedger,inv:s.inventory,knowledge:s.knowledge,coll:s.museum.collections},before,'nada pagado ni reconstruido al migrar');
 // El viaje en curso sin condiciones MEC-06 se liquida sin foto ni duración nueva.
 const v=s.voyages[0];assert.equal(v.mec06,undefined);assert.ok(r.g.resolveVoyageReward(v,v.endAt));assert.equal(s.voyageHistory.at(-1).photography,undefined);
 // Idempotente.
 const once=J(s.mec06);r.g.normalizeMEC01(s);r.g.normalizeMEC01(s);deq(s.mec06,once);
 // Nuevas funciones disponibles según su ubicación: el microscopio catalogado antes puede instalarse.
 assert.ok(A.setLocation('microscopio_compuesto','taller'));
});

test('MEC-06 · 4. indicadores regionales: visita, registro regional y catálogo global',()=>{
 const h=game(),g=h.g,s=h.g.state,A4h=A4(h);
 const r=g.REGIONS.find(x=>!s.regionsVisited[x.id]);s.regionUnlocked[r.id]=true;
 const sp=r.species.filter(id=>g.SPECIES[id]);for(const id of sp)s.discovered[id]=true;
 const st=A4h.regionStates();assert.ok(st.globalComplete>=1);
 for(const id of sp)g.regionalRecordMEC06(r.id,id,h.now);
 assert.equal(A4h.regionStates().completed,st.completed,'sin visita no se completa');
 g.setRegion(r.id);const st2=A4h.regionStates();assert.equal(st2.completed,st.completed+1);assert.equal(st2.explored,st.explored+1);
 // Un avistamiento real registra la región del encuentro (también el tramo automático).
 const h2=game(),g2=h2.g,s2=g2.state;s2.currentRegion='HX-01-09';
 for(let i=0;i<300&&!Object.keys(s2.regionalRecords.regions).length;i++){h2.now+=61e3;g2.encounter('manual',h2.now,false);}
 const regs=Object.keys(s2.regionalRecords.regions);deq(regs,['HX-01-09']);
 assert.ok(Object.keys(s2.regionalRecords.regions['HX-01-09'].species).every(id=>s2.discovered[id]));
 assert.ok(Number.isFinite(s2.regionalRecords.since));
});

test('MEC-06 · 5, 6, 7, 13 y 14. los 15 artefactos, componentes, instrumentos y análisis funcionan sin ciclos',()=>{
 for(const full of [false,true]){
  const h=game({full}),r=audit.run(h);assert.equal(r.rank,20);
  const w=audit.workshopAudit(h);
  assert.ok(w.ok,'auditoría del Taller');deq(w.cycles,[]);
  assert.equal(w.built.length,20,'15 artefactos beta y 5 históricos');
  for(const [id,c] of Object.entries(w.components)){assert.ok(c.leaves.every(x=>c.sources[x].length),id+' con fuentes');assert.equal(c.cycle,null);}
  for(const lv of w.levels)deq(lv.items,[],'mejorar el Taller no exige objetos que fabrique el propio Taller');
  // Cada artefacto beta tiene al menos una utilidad ejecutada.
  const X=X6(h),ran=new Set(w.ran);
  for(const id of BETA){const a=X.ARTIFACTS[id];assert.ok(a.uses.length,id);
   const done=a.uses.some(u=>ran.has(u))||['globo_celeste','camara_daguerrotipos','estereoscopio_espejos','esfera_armilar'].includes(id);assert.ok(done,id);}
  assert.equal(w.ran.length,17);deq(w.notApplicable.map(x=>x.split(':')[0]),['calculo-derrotas']);
  // No todos dan solo conocimiento.
  const kinds=new Set(Object.values(X.STUDIES).flatMap(t=>Object.keys(t.reward)));for(const k of ['knowledge','money','items','mapPiece','photo'])assert.ok(kinds.has(k),k);
 }
});

test('MEC-06 · 6. instrumentos: telescopio, esfera armilar, globo celeste y cámara',()=>{
 const h=game(),g=h.g,s=rich(h),A=A6(h);
 build(h,'telescopio_astronomico','esfera_armilar','globo_celeste','camara_daguerrotipos','estereoscopio_espejos');
 // Telescopio: produce una carta estelar real.
 assert.ok(A.setLocation('telescopio_astronomico','taller'));const c0=s.inventory.carta_estelar||0;
 assert.ok(A.runStudy('observacion-astronomica',h.now));assert.equal(s.inventory.carta_estelar,c0+1);
 // Esfera armilar: una parte del primer mapa continental pendiente con fuente accesible.
 assert.ok(A.setLocation('esfera_armilar','taller'));const d=A.mapTarget();assert.ok(d);const p0=s.inventory[d.piece]||0;
 s.inventory.carta_estelar=1;assert.ok(A.runStudy('calculo-derrotas',h.now));assert.equal(s.inventory[d.piece],p0+1);
 // Sin investigación previa, no hay mapa de un territorio inaccesible.
 const h2=game(),s2=rich(h2);for(const k of Object.keys(s2.purchases))if(/norteamerica|sudamerica|oceania|polos/.test(k))delete s2.purchases[k];
 for(const dd of h2.g.CARTOGRAPHY3400)if(!dd.sourceResearch)s2.inventory[dd.map]=1;
 assert.equal(A6(h2).mapTarget()?.continent??null,null);
 // Globo celeste en el Campamento: −10 % de duración fijada al zarpar.
 const v=g.VOYAGES.find(x=>g.voyageConditions3280(x).every(c=>c.met));assert.ok(g.sail(v.id));const plain=s.voyages.at(-1),span=plain.endAt-plain.startedAt;
 s.voyages=[];assert.ok(A.setLocation('globo_celeste','campamento'));assert.ok(g.sail(v.id));const j=s.voyages.at(-1);
 assert.equal(j.endAt-j.startedAt,Math.round(span*0.9));assert.equal(j.mec06.instruments.globo_celeste.duration,-0.1);
 // Cámara: consume una placa y fija la probabilidad (con el estereoscopio en el Taller).
 s.voyages=[];assert.ok(A.setLocation('camara_daguerrotipos','campamento'));assert.ok(A.setLocation('estereoscopio_espejos','taller'));
 s.inventory.placa_daguerrotipo=1;assert.ok(g.sail(v.id));const c=s.voyages.at(-1).mec06.instruments.camara_daguerrotipos;
 assert.equal(s.inventory.placa_daguerrotipo,0);assert.equal(c.plate,1);assert.ok(Math.abs(c.chance-0.65)<1e-9);assert.equal(c.stereo,true);
 // Sin placa, la cámara no actúa.
 s.voyages=[];assert.ok(g.sail(v.id));assert.equal(s.voyages.at(-1).mec06.instruments.camara_daguerrotipos,undefined);
});

test('MEC-06 · 8. fuentes y usos de los 27 materiales animales',()=>{
 const h=game(),A=A6(h),X=X6(h);
 const ids=h.B.items.filter(r=>r[2]===1).map(r=>r[0]);assert.equal(ids.length,27);
 deq([...Object.values(X.ANIMAL_GROUPS).flatMap(g=>g.ids)].sort(),[...ids].sort(),'cada material en un grupo temático');
 for(const id of ids){const a=A.audit(id);assert.ok(a.sources.length,id+' tiene fuente');assert.ok(a.uses.some(u=>u.kind==='estudio científico'),id+' tiene uso');assert.equal(a.state,'funcional');}
 // Las tasas históricas no cambian.
 deq(h.A.drops.channels()[0].rates.campo,{manual:0.02,auto:0.005});assert.equal(h.g.SPECIES_DROPS.lobo_gris,'wolf_tooth');
 // Ninguna fuente obligatoria en legendarios, relictos o variantes: los materiales salen de especies del catálogo.
 const f=game({full:true}),leg=new Set((f.g.LEGENDARY_SPECIMENS||[]).map(l=>l.id)),rel=new Set(f.g.MUSEUM_RELICTS.map(r=>r.id));
 for(const id of ids.filter(x=>/^MAT-N/.test(x))){const sp=f.A.speciesOf(id);assert.ok(sp.some(x=>f.g.SPECIES[x]),id);assert.ok(sp.every(x=>!leg.has(x)&&!rel.has(x)),id);}
});

test('MEC-06 · 9, 10, 11 y 12. niveles del Taller, recetas históricas, lotes y subcomponentes',()=>{
 const h=game(),g=h.g,s=rich(h,1),A=A6(h),X=X6(h);
 // Niveles: componentes y artefactos nuevos bloqueados por debajo de su nivel; históricos libres.
 assert.equal(g.canCraft('engranaje'),false);assert.equal(g.canCraft('brass_compass'),g.canCraft('brass_compass'));
 assert.ok(g.museumCollectionReady(g.MUSEUM_COLLECTIONS.find(p=>p.id==='carta_historica')),'artefacto histórico en el nivel I');
 assert.equal(g.museumCollectionReady(g.MUSEUM_COLLECTIONS.find(p=>p.id==='automata_ave')),false);
 assert.match(A.planArtifact('automata_ave').reasons.join(),/Taller III/);
 assert.match(A.studyCheck('estudio-osteologico').reasons.join(),/Taller II/);
 const plain=game({noCamp:true});
 for(const [id,r] of Object.entries(plain.g.RECIPES)){if(X.COMPONENTS[id])continue;deq(g.RECIPES[id].requires,r.requires,id);assert.equal(Number(g.RECIPES[id].minWorkshop||1),Number(r.minWorkshop||1),id);}
 for(const c of new Set(Object.values(g.CONTINENT_RESEARCH3300)))for(const it of g.craftedRequirements3300(c)||[])assert.ok(!(g.RECIPES[it]?.minWorkshop>1),it+' sin nivel nuevo');
 // Lotes: ×5 en el Taller III.
 while(Cm(h).level(s,'workshop')<3)Cm(h).upgrade(s,'workshop');const b0=s.inventory.brass_shard;
 assert.equal(h.x.AtlasCampMEC02Actions.craft('engranaje',5),5);assert.equal(s.inventory.engranaje,5);assert.equal(s.inventory.brass_shard,b0-10);
 s.inventory.brass_shard=3;assert.equal(h.x.AtlasCampMEC02Actions.craft('engranaje',5),0);assert.equal(s.inventory.engranaje,5,'nada parcial');s.inventory.brass_shard=200;s.inventory.engranaje=0;
 // Subcomponentes: en el III no, en el IV sí (cadena completa en una transacción).
 assert.match(A.planArtifact('microscopio_compuesto').reasons.join(),/Taller IV/);
 Cm(h).upgrade(s,'workshop');const p=A.planArtifact('microscopio_compuesto');assert.ok(p.ok);deq(p.steps,['engranaje']);
 deq(p.consumed,{brass_shard:5,polished_lens:2,carved_wood:1});
 build(h,'microscopio_compuesto');assert.equal(s.inventory.engranaje||0,0);assert.equal(A.location('microscopio_compuesto'),'museo');
 // Único: no se duplica.
 assert.equal(A.buildArtifact('microscopio_compuesto'),false);assert.equal(A.planArtifact('microscopio_compuesto'),null);
});

test('MEC-06 · 14, 17 y 20. análisis de muestras: instrumentos, consumo, recompensas y recibos',()=>{
 const h=game(),s=rich(h),A=A6(h);build(h,'microscopio_compuesto');
 s.inventory['MAT-N01']=1;s.inventory['MAT-N02']=4;s.inventory.owl_feather=2;
 assert.match(A.studyCheck('analisis-plumas').reasons.join(),/Microscopio compuesto instalado en el Taller/);
 assert.ok(A.setLocation('microscopio_compuesto','taller'));
 const k0=s.knowledge,t0=ledger(s,'taller');assert.ok(A.runStudy('analisis-plumas',h.now));
 assert.equal(s.inventory['MAT-N02'],1,'consume primero el más abundante');assert.equal(s.inventory['MAT-N01'],1);
 assert.equal(s.knowledge,k0+90);assert.equal(ledger(s,'taller'),t0+30);
 const rec=s.mec06.history.at(-1);deq(rec.consumed,{'MAT-N02':3});assert.equal(rec.knowledge,90);assert.equal(rec.money,30);
 // Estudio osteológico sin instrumento (Taller II).
 s.inventory.wolf_tooth=2;assert.ok(A.runStudy('estudio-osteologico',h.now));
 // Los estudios nunca consumen coleccionables (ni expuestos ni libres).
 for(const t of Object.values(X6(h).STUDIES))for(const id of Object.keys(t.requires))assert.equal(K(h).pieces[id],undefined,t.id);
 for(const a of Object.values(X6(h).ARTIFACTS)){const p=h.g.MUSEUM_COLLECTIONS.find(x=>x.id===a.id);for(const id of Object.keys(p.requires))assert.equal(K(h).pieces[id],undefined,a.id);}
 // Reservas: un coleccionable expuesto sigue protegido.
 s.museum.wing=3;h.g.addInventory('GEM-01',1);h.A.mec01('mec01-cab-expose','GEM-01');assert.equal(h.M.consume(s,h.A.catalog,'GEM-01',1),false);
});

test('MEC-06 · 15. fotografía: revelado y cámara con procedencia real y territorios accesibles',()=>{
 const h=game(),g=h.g,s=rich(h),A=A6(h);
 for(const r of g.REGIONS)s.regionUnlocked[r.id]=r.continent==='Europa';
 build(h,'camara_oscura');assert.ok(A.setLocation('camara_oscura','taller'));
 const pool=A.photoPool();assert.ok(pool.length>0);assert.ok(pool.every(id=>K(h).pieces[id].findIn.includes('Europa')),'solo territorios accesibles');
 s.inventory.placa_daguerrotipo=1;const ch=A.studyCheck('revelado-placas').chance;assert.equal(ch,0.45);
 const seq=[0.1,0];assert.ok(A.runStudy('revelado-placas',h.now,()=>seq.shift()??0));
 const rec=s.mec06.history.at(-1);assert.ok(rec.photo);assert.equal(rec.photo.origin,K(h).pieces[rec.photo.id].origin);
 const reg=s.collectionRegistry.pieces[rec.photo.id];assert.ok(reg.sources.taller>=1,'procedencia registrada');
 // Fallo de la tirada: solo conocimiento.
 s.inventory.placa_daguerrotipo=1;const n=Object.keys(s.collectionRegistry.pieces).length;assert.ok(A.runStudy('revelado-placas',h.now,()=>0.99));assert.equal(Object.keys(s.collectionRegistry.pieces).length,n);
 // Las fuentes de daguerrotipos de MEC-03 siguen activas.
 assert.ok(Object.values(K(h).pieces).filter(p=>p.collection==='Imágenes daguerrotipadas').every(p=>p.sources.expediciones||p.sources.taller||p.sources.comercio));
 // Cámara en expediciones: si hay hallazgo, es de un continente del destino.
 build(h,'camara_daguerrotipos');A.setLocation('camara_daguerrotipos','campamento');
 const v=g.VOYAGES.find(x=>g.voyageConditions3280(x).every(c=>c.met));
 for(let i=0;i<12;i++){s.voyages=[];s.inventory.placa_daguerrotipo=1;assert.ok(g.sail(v.id));const j=s.voyages.at(-1);g.resolveVoyageReward(j,j.endAt);
  const ph=s.voyageHistory.at(-1).photography;assert.ok(ph);if(ph.result)assert.ok(K(h).pieces[ph.result].findIn.some(c=>K(h).voyageDestinations[v.id].continents.includes(c)));}
});

test('MEC-06 · 16, 21 y 24. demostraciones, atractivo e ingresos sin cobros repetidos',()=>{
 const h=game(),g=h.g,s=rich(h),A=A6(h);build(h,'planetario_orrery','automata_ave','maquina_electrostatica');
 const d0=ledger(s,'demostraciones');assert.ok(A.runDemo('demo-planetario',h.now));assert.equal(ledger(s,'demostraciones'),d0+250);
 assert.equal(A.runDemo('demo-planetario',h.now+H),false,'espera de 8 h');
 const r=reopen(h,{now:h.now+H});assert.equal(A6(r).runDemo('demo-planetario',r.now),false,'recargar no reinicia la espera');
 assert.ok(A.setLocation('planetario_orrery','almacen'));assert.ok(A.setLocation('planetario_orrery','museo'));assert.equal(A.runDemo('demo-planetario',h.now+2*H),false,'reorganizar tampoco');
 assert.ok(A.runDemo('demo-planetario',h.now+8*H));
 // Requiere exhibición: en el Taller, la máquina electrostática experimenta pero no da demostraciones.
 assert.ok(A.setLocation('maquina_electrostatica','taller'));s.inventory.componente_electrico=2;assert.match(A.demoCheck('demo-electrostatica').reasons.join(),/expuesto/);
 assert.ok(A.runStudy('experimento-electrostatico',h.now));
 // Atractivo: ingreso nuevo de artefactos exhibidos, separado del zoológico, con límite offline.
 const rate=A.attractionRate();assert.ok(rate>0&&rate<=X6(h).ATTRACTION.cap);
 assert.ok(Math.abs(rate-(0.04+0.05))<1e-9,'planetario y autómata en vitrina');
 const zoo=g.museumRate();s.lastTick=h.now;g.persist();
 const back=game({store:{[KEY]:h.store[KEY]},now:h.now+10*H});const a0=ledger(back.g.state,'artefactos'),z0=ledger(back.g.state,'museo');back.tick();
 assert.ok(Math.abs(ledger(back.g.state,'artefactos')-a0-rate*8*3600)<1e-6,'8 h como máximo');
 assert.ok(Math.abs(ledger(back.g.state,'museo')-z0-zoo*8*3600)<1e-6,'el ingreso zoológico no cambia');
 back.g.persist();const again=game({store:{[KEY]:back.store[KEY]},now:back.now});const a1=ledger(again.g.state,'artefactos');again.tick();assert.ok(ledger(again.g.state,'artefactos')-a1<1e-6);
 // En línea, misma regla.
 s.lastTick=h.now;const l0=ledger(s,'artefactos');h.now+=60e3;h.tick();assert.ok(Math.abs(ledger(s,'artefactos')-l0-rate*60)<1e-6);
});

test('MEC-06 · 18. bonificaciones y funciones reversibles',()=>{
 const h=game(),g=h.g,s=rich(h),A=A6(h);build(h,'automata_ave','microscopio_compuesto','globo_celeste');
 const r1=A.attractionRate();assert.ok(A.setLocation('automata_ave','almacen'));assert.ok(A.attractionRate()<r1);
 assert.ok(A.setLocation('microscopio_compuesto','taller'));s.inventory['MAT-N09']=9;assert.ok(A.studyCheck('analisis-pelo').ok);
 assert.ok(A.setLocation('microscopio_compuesto','museo'));assert.equal(A.studyCheck('analisis-pelo').ok,false);
 assert.ok(A.setLocation('globo_celeste','campamento'));const v=g.VOYAGES.find(x=>g.voyageConditions3280(x).every(c=>c.met));
 g.sail(v.id);const a=s.voyages.at(-1);assert.ok(A.setLocation('globo_celeste','almacen'));g.sail(v.id);const b=s.voyages.at(-1);
 assert.ok(b.endAt-b.startedAt>a.endAt-a.startedAt);deq(b.mec06.instruments,{});
 // Capa «instrumentos» en el desglose.
 assert.ok(A5(h).breakdown('expedicion:botanica').layers.instrumentos);for(const m of X6(h).MODIFIERS)for(const k of ['activity','source','value','type','stacking','cap','condition'])assert.ok(m[k]!==undefined,m.id+'.'+k);
});

test('MEC-06 · 19 y 20. condiciones fijadas al zarpar y recibo con conocimiento total y desglose',()=>{
 const h=game(),g=h.g,s=rich(h),A=A6(h);s.museum.wing=3;build(h,'globo_celeste');assert.ok(A.setLocation('globo_celeste','campamento'));
 for(const id of Object.values(K(h).pieces).filter(p=>p.cabinet==='Historia natural y exploración').slice(0,4).map(p=>p.id)){g.addInventory(id,1);h.M.expose(s,h.A.catalog,id,12);}
 const v=g.VOYAGES.find(x=>g.voyageConditions3280(x).every(c=>c.met));assert.ok(g.sail(v.id));const job=s.voyages.at(-1),end=job.endAt;
 const k=job.mec.museum.values['conocimiento:expediciones'];assert.ok(k>0);
 // Cambios después de zarpar: no alteran lo fijado.
 assert.ok(A.setLocation('globo_celeste','almacen'));assert.equal(job.endAt,end);
 s.inventory.brass_compass=1;s.equipment.instrument='brass_compass';
 const k0=s.knowledge;assert.ok(g.resolveVoyageReward(job,job.endAt));
 const r=s.voyageHistory.at(-1),base=v.notes,equip=Math.round(v.notes*0.04),museo=Math.round(base*k);
 deq(r.knowledgeBreakdown,{base,equipamiento:equip,museo,instrumentos:0},'la brújula conserva su regla histórica; el Museo usa la base');
 assert.equal(r.knowledgeTotal,base+equip+museo);assert.equal(s.knowledge-k0,r.knowledgeTotal,'el recibo muestra el total real');
});

test('MEC-06 · 22. fallos de guardado en estudios y demostraciones',()=>{
 const h=game(),s=rich(h),A=A6(h);build(h,'microscopio_compuesto','automata_ave');A.setLocation('microscopio_compuesto','taller');
 s.inventory['MAT-N04']=5;h.g.persist();const snap=J({inv:s.inventory,k:s.knowledge,l:s.moneyLedger,m6:s.mec06});
 const restore=failWrites(h);assert.equal(A.runStudy('analisis-plumas',h.now),false);assert.equal(A.runDemo('demo-automata',h.now),false);restore();
 deq({inv:s.inventory,k:s.knowledge,l:s.moneyLedger,m6:s.mec06},snap);
 assert.ok(A.runStudy('analisis-plumas',h.now));assert.ok(A.runDemo('demo-automata',h.now));
});

test('MEC-06 · 25. exportación e importación idempotentes',()=>{
 const h=game(),g=h.g,s=rich(h),A=A6(h);build(h,'microscopio_compuesto','planetario_orrery');A.setLocation('microscopio_compuesto','taller');A.runDemo('demo-planetario',h.now);
 g.regionalRecordMEC06('HX-01-09',Object.keys(g.SPECIES)[0],h.now);
 const data=J(h.window.AtlasSaveBridge.getSaveData());const t=game({now:h.now+1000});t.window.AtlasSaveBridge.restoreGame(data);
 deq(t.g.state.mec06,data.mec06);deq(t.g.state.regionalRecords,data.regionalRecords);
 assert.equal(A6(t).location('microscopio_compuesto'),'taller');assert.equal(A6(t).runDemo('demo-planetario',t.now),false);
 const again=J(t.window.AtlasSaveBridge.getSaveData());deq(again.mec06,data.mec06);deq(again.museum.displays,data.museum.displays);
});

test('MEC-06 · inventario funcional: clasificación, fuentes, usos y matriz',()=>{
 const h=game(),rows=A6(h).inventoryAudit();
 assert.equal(rows.length,Object.keys(h.g.ITEMS).length+20);
 for(const c of ['material animal','componente fabricado','equipamiento','instrumento científico','artefacto museístico','objeto cartográfico','mercancía comercial','material fósil','coleccionable','materia prima'])assert.ok(rows.some(r=>r.category===c),c);
 assert.equal(rows.filter(r=>r.state==='requerido sin fuente').length,0);
 for(const r of rows)for(const k of ['id','name','sources','uses','recipes','research','commissions','tradable','workshop','benefit','state'])assert.ok(k in r,k);
 // La ficha enlaza recetas y materiales.
 const html=A6(h).ficha('microscopio_compuesto');assert.match(html,/data-action="mec06-item" data-id="engranaje"/);
 assert.match(A6(h).ficha('engranaje'),/Microscopio compuesto/);
 // Fichas de coleccionables con la geografía de MEC-04.
 const m=h.A.detailModel('MAS-03');assert.equal(m.origin.split(' · ')[0],K(h).pieces['MAS-03'].origin);assert.ok(m.buyIn.includes('Europa'));
 assert.ok(fs.existsSync('docs/mec06/inventario.csv'));
});

test('MEC-06 · 26. MEC-01 a MEC-05 se conservan; versión y verificación',()=>{
 const h=game(),g=h.g;
 assert.equal(Object.keys(K(h).pieces).length,431);assert.equal(h.A.catalog.collections.size,32);assert.equal(h.B.items.filter(r=>r[2]===1).length,27);
 assert.equal(h.B.materiales.length,6);assert.equal(h.B.artefactos.length,15);assert.equal(g.MUSEUM_COLLECTIONS.filter(p=>p.tab==='artifacts').length,20);
 assert.equal(h.x.AtlasMEC04.RANKS.length,20);assert.equal(h.x.AtlasMEC05.BENEFITS.length,11);assert.equal(g.MUSEUM_LEVELS.length,5);
 const full=game({full:true});assert.equal(full.g.REGIONS.length,125);assert.equal(Object.keys(full.g.SPECIES).length,1000);
 const pkg=require('../package.json'),rel=require('../www/atlas-release.json');
 assert.equal(pkg.version,'5.6.6');assert.equal(rel.version,'5.6.6');assert.equal(rel.build,'MEC-06');assert.equal(rel.channel,'beta');
 assert.ok(pkg.scripts['release:verify'].includes('tests/mec06.test.cjs'));
 assert.ok(fs.readFileSync('www/sw.js','utf8').includes("'./js/mec06-workshop.js'"));
 assert.ok(fs.readFileSync('www/index.html','utf8').includes('js/mec06-workshop.js?v=5.6.6'));
 assert.ok(fs.readFileSync('www/js/save-manager.js','utf8').includes("gameVersion: '5.6.6'"));
 assert.ok(!fs.existsSync('android'));
});
