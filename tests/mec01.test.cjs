'use strict';
// MEC-01 · V5.6.1 Beta · pruebas de consolidación funcional de la V5.6.0 Beta.
// Cada bloque corresponde a una prueba obligatoria de la sección 11 del encargo MEC-01.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const KEY='gran_atlas_v05';
// Los valores del juego viven en otro contexto de vm: se comparan por su forma JSON.
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
const T0=1790000000000;
// Generador reproducible con cola opcional de valores forzados.
function rngWith(seed=12345){const queue=[];let x=seed>>>0;const f=()=>{if(queue.length)return queue.shift();x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};f.queue=queue;return f;}
function game(options={}){const rng=options.rng||rngWith(options.seed);const h=make({now:T0,headless:true,rng,...options});h.rng=rng;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,options={})=>game({store:{[KEY]:saved(h)},now:h.now,...options});
const collectibles=(h,filter=()=>true)=>[...h.A.catalog.items.values()].filter(i=>i.collectible&&filter(i));

test('MEC-01 · 1. los materiales históricos conservan su tabla, su función y su probabilidad',()=>{
 const h=game({seed:7}),g=h.g,s=g.state;
 // La función histórica no se reemplaza y conserva su texto original.
 assert.equal(String(g.maybeSpeciesDrop).replace(/\s+/g,' '),
  'function maybeSpeciesDrop(id, manual){ if(!state.upgrades.specimenDrops) return null; const item=SPECIES_DROPS[id]; if(!item) return null; const chance=manual?0.02:0.005; if(Math.random()>=chance) return null; addInventory(item,1); return item; }');
 assert.equal(Object.keys(g.SPECIES_DROPS).length,12);
 // Antes de MEC-01 las 12 especies históricas perdían su drop: la beta lo sustituía por su pozo.
 s.upgrades.specimenDrops=1;
 const N=60000;
 for(const [species,item] of [['lobo_gris','wolf_tooth'],['nutria_europea','otter_whisker']]){
  for(const manual of [true,false]){
   const before=s.inventory[item]||0;let n=0;
   for(let i=0;i<N;i++){if(g.maybeSpeciesDrop(species,manual)===item)n++;g.mec01FieldDrops(species,manual);}
   const p=manual?0.02:0.005,sd=Math.sqrt(p*(1-p)/N);
   assert.ok(Math.abs(n/N-p)<5*sd,species+' '+(manual?'manual':'auto')+': '+n/N+' frente a '+p);
   assert.equal((s.inventory[item]||0)-before,n,'cada drop histórico llega al inventario');
  }
 }
 // El canal histórico tira primero: con un 0 forzado siempre cae su objeto, haya o no canales nuevos.
 h.rng.queue.push(0);assert.equal(g.maybeSpeciesDrop('jabali',true),'boar_tusk');
 // Sin la mejora del gabinete no cae nada de ningún canal.
 s.upgrades.specimenDrops=0;h.rng.queue.push(0,0,0,0,0,0);
 assert.equal(g.maybeSpeciesDrop('jabali',true),null);deq(g.mec01FieldDrops('jabali',true),[]);
});

test('MEC-01 · 2. las categorías de drops son independientes y configurables',()=>{
 const h=game({seed:11}),g=h.g,D=h.A.drops,cat=h.A.catalog;
 const ch=D.channels();
 deq(ch.map(c=>c.id),['historicos','nuevosMateriales','coleccionables','rarezas']);
 assert.ok(ch.find(c=>c.id==='historicos').fixed);
 deq(Object.keys(D.sources()),['campo','expediciones','comercio','excavaciones','prospecciones','encargos','eventos']);
 deq(Object.entries(D.sources()).filter(([,v])=>v.active).map(([k])=>k),['campo']);
 // Cada pozo contiene solo piezas de su categoría; ninguno incluye materiales históricos.
 const tipo={nuevosMateriales:1,coleccionables:0,rarezas:2},historic=new Set(Object.values(g.SPECIES_DROPS));
 let withRare=0;
 for(const species of Object.keys(g.SPECIES)){
  for(const [channel,t] of Object.entries(tipo)){
   const pool=D.pool('campo',channel,{species});
   for(const id of pool){assert.equal(cat.items.get(id).tipo,t);assert.ok(!historic.has(id));}
   if(channel==='rarezas'&&pool.length)withRare++;
  }
 }
 const B=h.B,rareSpecies=Object.keys(g.SPECIES).filter(sp=>(B.bySpecies[sp]||[]).some(i=>B.items[i][2]===2)).length;
 assert.ok(rareSpecies>0&&rareSpecies<60);
 assert.equal(withRare,rareSpecies,'las rarezas solo pertenecen al pozo de unas pocas especies, por afinidad');
 // Independencia: anular un canal no cambia los demás; un canal al 100 % siempre entrega.
 const count=(species,N=4000)=>{const n={nuevosMateriales:0,coleccionables:0,rarezas:0};for(let i=0;i<N;i++)for(const d of D.roll('campo',{species,manual:true,random:h.rng}))n[d.channel]++;return n;};
 const species=Object.keys(g.SPECIES).find(id=>D.pool('campo','rarezas',{species:id}).length&&D.pool('campo','nuevosMateriales',{species:id}).length);
 D.configure('nuevosMateriales','campo',{manual:1,auto:1});D.configure('rarezas','campo',{manual:1,auto:1});D.configure('coleccionables','campo',{manual:0,auto:0});
 let n=count(species);deq(n,{nuevosMateriales:4000,coleccionables:0,rarezas:4000});
 D.configure('coleccionables','campo',{manual:1,auto:1});
 n=count(species);deq(n,{nuevosMateriales:4000,coleccionables:4000,rarezas:4000});
 // Una fuente futura se activa con su propio resolvedor sin tocar el campo.
 deq(D.roll('expediciones',{manual:true,random:()=>0}),[]);
 assert.ok(D.activateSource('expediciones',(channel)=>channel==='coleccionables'?['BOT-01']:[]));
 D.configure('coleccionables','expediciones',{manual:1,auto:1});
 deq(D.roll('expediciones',{manual:true,random:()=>0}).map(d=>d.id),['BOT-01']);
});

test('MEC-01 · 3. un coleccionable descubierto queda registrado aunque deje de estar disponible',()=>{
 const h=game(),g=h.g,s=g.state,M=h.M;
 assert.equal(M.discovered(s,'BOT-01'),false);
 g.addInventory('BOT-01',1);
 assert.ok(M.discovered(s,'BOT-01'));
 const p=s.collectionRegistry.pieces['BOT-01'];assert.equal(p.obtained,1);assert.equal(p.firstAt,T0);
 s.inventory['BOT-01']=0;delete s.inventory['BOT-01']; // venta, intercambio o consumo
 g.render();
 assert.ok(M.discovered(s,'BOT-01'));
 assert.equal(M.pieceStatus(s,h.A.catalog,'BOT-01').available,0);
 const r=reopen(h);assert.ok(r.M.discovered(r.g.state,'BOT-01'),'tras cerrar y reabrir');
 // Los materiales históricos y los nuevos materiales animales no entran al registro de colecciones.
 g.addInventory('wolf_tooth',1);g.addInventory('MAT-N01',1);
 assert.ok(!s.collectionRegistry.pieces.wolf_tooth&&!s.collectionRegistry.pieces['MAT-N01']);
});

test('MEC-01 · 4. los duplicados se conservan sin límite',()=>{
 const h=game({seed:3}),g=h.g,s=g.state;
 s.upgrades.specimenDrops=1;
 h.A.drops.configure('coleccionables','campo',{manual:1,auto:1});
 h.A.drops.configure('nuevosMateriales','campo',{manual:0,auto:0});h.A.drops.configure('rarezas','campo',{manual:0,auto:0});
 const got={};for(let i=0;i<3000;i++)for(const id of g.mec01FieldDrops('lobo_gris',true))got[id]=(got[id]||0)+1;
 const top=Object.entries(got).sort((a,b)=>b[1]-a[1])[0];
 assert.ok(top[1]>100,'una misma pieza cae muchas veces');
 for(const [id,n] of Object.entries(got)){
  assert.equal(s.inventory[id],n,'cada duplicado se suma al inventario: '+id);
  assert.equal(s.collectionRegistry.pieces[id].obtained,n);
  assert.equal(s.collectionRegistry.pieces[id].sources.campo,n);
 }
 const had=s.inventory['BOT-02']||0;g.addInventory('BOT-02',5000);assert.equal(s.inventory['BOT-02'],had+5000);
 assert.equal(s.collectionRegistry.pieces['BOT-02'].obtained,had+5000);
});

test('MEC-01 · 5. colecciones y Sociedad usan el registro histórico, no las existencias',()=>{
 const h=game(),g=h.g,s=g.state,cat=h.A.catalog;
 const herb=[...cat.collections.values()].find(c=>c.name==='Herbario del mundo');
 for(const id of herb.ids)g.addInventory(id,1);
 assert.equal(h.A.societyStats().items,herb.ids.length);
 for(const id of herb.ids)delete s.inventory[id];
 g.render();
 assert.equal(h.A.societyStats().items,herb.ids.length,'retirar existencias no reduce el avance');
 s.inventoryView='coleccionables';g.open('objects');
 const r=reopen(h,{headless:false});r.g.state.inventoryView='coleccionables';r.g.open('objects');
 const html=r.elements.panel.innerHTML;
 const n=herb.ids.length;
 assert.ok(html.includes('Herbario del mundo</span><small>Botánica · '+n+'/'+n+' · <b class="mec01-done">✓ Colección completa</b>'));
 assert.ok(html.includes(n+'/431 piezas descubiertas · 1/32 colecciones completas'));
 assert.equal(r.A.societyStats().items,n);
});

test('MEC-01 · 6. ingresos y gastos consecutivos: los gastos no reducen el acumulado',()=>{
 const h=game(),g=h.g,s=g.state,L=()=>s.moneyLedger;
 assert.equal(L().total,0);assert.equal(L().migration.method,'partida-nueva');
 const sp='lobo_gris';s.discovered[sp]=true;s.stages[sp]=5;
 g.publishMonograph(sp);assert.equal(L().bySource.publicaciones,90);
 h.now+=61000;g.requestGrant();const grant=L().bySource.subvenciones;assert.ok(grant>0);
 const spendBefore=L().total;
 s.money=1e6;s.prestige=10;g.expandMuseum();                  // gasto
 assert.equal(L().total,spendBefore,'un gasto no toca el libro');
 g.earnMoney(250,'comercio');g.earnMoney(0,'comercio');g.earnMoney(-50,'comercio');g.earnMoney(NaN,'comercio');
 assert.equal(L().bySource.comercio,250);
 s.knowledge=1000;g.exchangeNotes();assert.ok(L().bySource.canjeNotas>0);
 // El saldo puede bajar o subir por otras vías (gastos, importaciones) sin efecto en el acumulado.
 s.money=5;g.render();s.money=9e9;g.render();
 const sum=Object.values(L().bySource).reduce((a,b)=>a+b,0);
 assert.equal(L().total,sum);assert.equal(L().total,90+grant+250+L().bySource.canjeNotas);
 // Ya no existe el cálculo por diferencias de saldo durante el repintado.
 const app=fs.readFileSync('www/js/app.js','utf8');
 assert.ok(!/b\.moneyEarned\+m-b\.lastMoney|m>b\.lastMoney/.test(app));
 assert.equal((app.match(/state\.money\+=/g)||[]).length,1,'solo earnMoney suma dinero al saldo');
});

test('MEC-01 · 7. sin doble contabilización offline, al recargar ni al importar',()=>{
 const h=game(),g=h.g,s=g.state;
 s.discovered.lobo_gris=true;s.sightings.lobo_gris=1;g.normalizeMEC01(s);
 s.museum.exhibits={lobo_gris:true};const rate=g.museumRate();assert.ok(rate>0);
 s.lastTick=h.now-3600e3;const m0=s.money;
 h.tick();
 assert.ok(Math.abs(s.moneyLedger.bySource.museo-rate*3600)<1e-6);
 assert.ok(Math.abs((s.money-m0)-rate*3600)<1e-6);
 h.tick();h.tick();assert.ok(Math.abs(s.moneyLedger.bySource.museo-rate*3600)<1e-6,'sin tiempo nuevo no hay ingreso nuevo');
 // Cerrar y reabrir: solo cuenta el tiempo transcurrido desde el último guardado.
 h.tick();const raw=saved(h);
 const r=game({store:{[KEY]:raw},now:h.now+120e3});
 const before=r.g.state.moneyLedger.bySource.museo;assert.ok(Math.abs(before-rate*3600)<1e-6,'cargar no liquida nada por sí solo');
 r.tick();assert.ok(Math.abs(r.g.state.moneyLedger.bySource.museo-before-rate*120)<1e-6);
 r.tick();assert.ok(Math.abs(r.g.state.moneyLedger.bySource.museo-before-rate*120)<1e-6);
 // Más de 8 horas cerrado: el tope offline del juego también limita el libro.
 const far=game({store:{[KEY]:saved(r)},now:r.now+48*3600e3});const b2=far.g.state.moneyLedger.bySource.museo;
 far.tick();assert.ok(Math.abs(far.g.state.moneyLedger.bySource.museo-b2-rate*8*3600)<1e-6);
 // Importar un respaldo conserva su libro y no liquida un intervalo antiguo.
 const data=JSON.parse(JSON.stringify(r.window.AtlasSaveBridge.getSaveData()));data.lastTick=r.now-10*3600e3;
 const t=game({now:r.now});t.window.AtlasSaveBridge.restoreGame(data);
 const imported=t.g.state.moneyLedger.total;t.tick();
 assert.equal(t.g.state.moneyLedger.total,imported);
 assert.equal(imported,data.moneyLedger.total);
});

test('MEC-01 · 8. un gabinete muestra todas las piezas disponibles, con paginación y filtros',()=>{
 const h=game({headless:false}),g=h.g,s=g.state,M=h.M,cat=h.A.catalog;
 const bot=collectibles(h,i=>i.cabinet==='Botánica'),N=bot.length,P=Math.ceil(N/12);assert.ok(N>24,'más de dos páginas: '+N);
 for(const it of bot)g.addInventory(it.id,1);
 s.museum.wing=5;s.museumView='samples';g.open('museum');
 const cab=()=>h.elements.panel.innerHTML.split('data-mec01-cabinet="Botánica"')[1].split('data-mec01-cabinet=')[0];
 assert.ok(cab().includes('Página 1 de '+P+' · '+N+' piezas'));
 const seen=new Set();
 for(let page=0;page<P;page++){h.A.mec01('mec01-cab-page','Botánica|'+page);for(const m of cab().matchAll(/data-action="mec01-cab-expose" data-id="([^"]+)"/g))seen.add(m[1]);}
 assert.equal(seen.size,N,'todas las piezas son accesibles (antes solo 12)');
 // Búsqueda y filtros.
 const ev=(type,dataset,value)=>{const el={dataset,value};for(const cb of h.elements.panel.listeners[type]||[])cb({target:el});};
 ev('input',{mec01CabQuery:'Botánica'},'loto');
 deq([...cab().matchAll(/data-action="mec01-cab-expose" data-id="([^"]+)"/g)].map(m=>m[1]).sort(),['BOT-08','SEM-08']);
 ev('input',{mec01CabQuery:'Botánica'},'');ev('change',{mec01CabCol:'Botánica'},'Pigmentos del mundo');
 assert.match(cab(),/12 piezas disponibles para exponer/);
 ev('change',{mec01CabRar:'Botánica'},'3');
 deq([...cab().matchAll(/data-action="mec01-cab-expose" data-id="([^"]+)"/g)].map(m=>m[1]),['PIG-12']);
 // Capacidad: 20 casillas en el nivel 5.
 for(const it of bot)h.A.mec01('mec01-cab-expose',it.id);
 assert.equal(s.museum.cabinets['Botánica'].length,20);
 assert.match(cab(),/Capacidad utilizada: 20 de 20 casillas/);
 deq(s.museum.cabinets['Botánica'],bot.slice(0,20).map(i=>i.id));
 assert.equal(M.expose(s,cat,bot[35].id,20).reason,'full','la casilla 21 se rechaza');
 assert.equal(h.A.cabinetSlots(),20);
});

test('MEC-01 · 9. exponer reserva una unidad sin destruirla; retirar la libera',()=>{
 const h=game(),g=h.g,s=g.state,M=h.M,cat=h.A.catalog;
 g.addInventory('GEM-01',1);
 deq(M.expose(s,cat,'GEM-01',4),{ok:true});
 let st=M.pieceStatus(s,cat,'GEM-01');
 deq([st.owned,st.exhibited,st.available,st.tradable],[1,1,0,0]);
 assert.equal(s.inventory['GEM-01'],1,'la pieza no se destruye');
 assert.equal(M.consume(s,cat,'GEM-01',1),false,'la unidad reservada no se puede consumir');
 assert.equal(M.expose(s,cat,'GEM-01',4).reason,'already','no se duplica');
 g.addInventory('GEM-01',1);assert.equal(M.pieceStatus(s,cat,'GEM-01').available,1);
 assert.equal(M.consume(s,cat,'GEM-01',1),true);assert.equal(s.inventory['GEM-01'],1);
 deq(M.withdraw(s,cat,'GEM-01'),{ok:true});
 st=M.pieceStatus(s,cat,'GEM-01');deq([st.owned,st.exhibited,st.available],[1,0,1]);
 // Sin existencias no se puede exponer.
 assert.equal(M.expose(s,cat,'GEM-02',4).reason,'unavailable');
 // Exhibiciones inconsistentes: se corrigen al normalizar (pieza ajena, duplicada, sin stock o en otro gabinete).
 s.museum.cabinets={'Botánica':['GEM-01','GEM-01','BOT-99','wolf_tooth'],'Geología':['GEM-03']};
 const removed=M.normalizeCabinets(s,cat,4);
 deq(s.museum.cabinets['Geología'],['GEM-01']);deq(s.museum.cabinets['Botánica'],[]);
 deq(removed.sort(),['BOT-99','GEM-01','GEM-03','wolf_tooth']);
 // La selección persiste al cerrar y reabrir.
 const r=reopen(h);deq(r.g.state.museum.cabinets['Geología'],['GEM-01']);
});

test('MEC-01 · 10. migración de partidas anteriores a V5.6.0, de la beta 5.6.0 y nuevas',()=>{
 // Partida anterior a V5.6.0: ni libro ni registro; ya tenía 300 piezas OBJ-11 en el inventario.
 const old=game().g.initialState();
 Object.assign(old,{money:5200,prestige:4,discovered:{lobo_gris:true},sightings:{lobo_gris:40}});
 old.inventory={...old.inventory,'BOT-01':2,'NUM-01':1,wolf_tooth:3};delete old.moneyLedger;delete old.collectionRegistry;delete old.beta560;
 const a=game({store:{[KEY]:JSON.stringify(old)}}),sa=a.g.state;
 deq(sa.moneyLedger.bySource,{sinDesglose:5200-420});
 assert.equal(sa.moneyLedger.migration.method,'saldo-actual');
 deq(Object.keys(sa.collectionRegistry.pieces).sort(),['BOT-01','NUM-01']);
 assert.equal(sa.collectionRegistry.pieces['BOT-01'].firstSource,'migracion');
 assert.equal(sa.collectionRegistry.migratedPieces,2);
 assert.equal(sa.money,5200);assert.equal(sa.inventory.wolf_tooth,3);
 // Partida de la beta 5.6.0: acumulado por diferencias, gabinetes sin validar e hito.
 const beta=JSON.parse(JSON.stringify(old));
 beta.beta560={moneyEarned:9000,lastMoney:5200,hitos:{af_guepardo:{best:104.2,tries:7,approved:true}}};
 beta.museum.cabinets={'Botánica':['BOT-01','BOT-05'],'Historia':['NUM-01']};
 const b=game({store:{[KEY]:JSON.stringify(beta)}}),sb=b.g.state;
 assert.equal(sb.moneyLedger.total,9000-420);assert.equal(sb.moneyLedger.migration.method,'beta560.moneyEarned');
 deq(sb.museum.cabinets['Botánica'],['BOT-01'],'BOT-05 no estaba en el inventario');
 deq(sb.museum.cabinets['Historia'],['NUM-01']);
 deq({best:sb.beta560.hitos.af_guepardo.best,tries:sb.beta560.hitos.af_guepardo.tries,approved:sb.beta560.hitos.af_guepardo.approved},{best:104.2,tries:7,approved:true});
 // La migración es idempotente: reabrir no vuelve a sumar ni a migrar.
 const b2=reopen(b),sb2=b2.g.state;
 assert.equal(sb2.moneyLedger.total,sb.moneyLedger.total);
 assert.equal(sb2.collectionRegistry.migratedPieces,2);assert.equal(sb2.collectionRegistry.pieces['BOT-01'].obtained,2);
 // Partida nueva: el capital inicial no es un ingreso.
 const n=game().g.state;assert.equal(n.moneyLedger.total,0);deq(n.collectionRegistry.pieces,{});
 // Datos dañados se normalizan sin romper la carga.
 const bad=JSON.parse(JSON.stringify(old));bad.moneyLedger={total:'x',bySource:[1]};bad.collectionRegistry={pieces:{'BOT-01':'roto',wolf_tooth:{obtained:3}}};bad.museum.cabinets=[];
 const c=game({store:{[KEY]:JSON.stringify(bad)}}).g.state;
 assert.equal(c.moneyLedger.total,5200-420);deq(Object.keys(c.collectionRegistry.pieces).sort(),['BOT-01','NUM-01']);
 assert.ok(c.museum.cabinets&&!Array.isArray(c.museum.cabinets));
});

test('MEC-01 · 11. exportar e importar conserva registro, libro, gabinetes, hitos y materiales',()=>{
 const h=game(),g=h.g,s=g.state;
 g.addInventory('GEM-01',3);g.addInventory('RAR-01',1);g.addInventory('MAT-N01',4);g.addInventory('engranaje',2);
 h.M.expose(s,h.A.catalog,'GEM-01',4);
 s.discovered.lobo_gris=true;s.stages.lobo_gris=5;g.publishMonograph('lobo_gris');
 h.rng.queue.push(0.05,0.05,0.05);h.A.run('af_guepardo');
 delete s.inventory['RAR-01'];
 const exported=JSON.parse(JSON.stringify(h.window.AtlasSaveBridge.getSaveData()));
 const t=game({now:h.now+5000});
 t.window.AtlasSaveBridge.restoreGame(exported);
 const st=t.g.state;
 for(const key of ['collectionRegistry','moneyLedger'])deq(st[key],exported[key],key);
 deq(st.museum.cabinets,exported.museum.cabinets);
 deq(st.beta560.hitos,exported.beta560.hitos);
 assert.ok(t.M.discovered(st,'RAR-01'));
 assert.equal(st.inventory['MAT-N01'],4);assert.equal(st.inventory.engranaje,2);
 assert.equal(t.A.societyStats().money,90);
 // Formato de respaldo intacto.
 assert.match(fs.readFileSync('www/js/save-manager.js','utf8'),/gameVersion: '5\.6\.1'/);
 assert.ok(t.store[KEY].includes('"collectionRegistry"'));
});

test('MEC-01 · 12. el hito del guepardo se registra, conserva su récord y persiste',()=>{
 const h=game(),g=h.g,s=g.state,A=h.A;
 deq(A.types,['velocidad','tamano','peso','longevidad','profundidad','altitud','distancia','conducta']);
 deq(Object.keys(A.hitos),['af_guepardo']);
 const H=A.hitos.af_guepardo;
 deq([H.target,H.mean,H.sd,H.min,H.max,H.chance,H.unit],[100,85,10,50,120,0.10,'km/h']);
 h.rng.queue.push(0.5);assert.equal(A.run('af_guepardo'),null,'90 % de los encuentros no registra carrera');
 h.rng.queue.push(0.05,0.5,0.5);let txt=A.run('af_guepardo');           // gauss(0,5;0,5) < 0 → ~73 km/h
 assert.match(txt,/^corriendo a \d+(\.\d)? km\/h$/);
 const slow=s.beta560.hitos.af_guepardo.best;assert.ok(slow<100);
 assert.equal(g.stageRequirements('af_guepardo',3).extraOk,false);
 h.rng.queue.push(0.05,0.05,0.05);txt=A.run('af_guepardo');             // ~104,8 km/h
 assert.match(txt,/nuevo récord · hito aprobado: Velocidad máxima ≥ 100 km\/h \(BETA\)/);
 const rec=s.beta560.hitos.af_guepardo;assert.ok(rec.best>=100&&rec.approved&&rec.tries===2&&rec.bestAt===h.now&&rec.approvedAt===h.now);
 h.rng.queue.push(0.05,0.5,0.5);A.run('af_guepardo');
 assert.equal(s.beta560.hitos.af_guepardo.best,rec.best,'una carrera más lenta no baja el récord');
 // Requisito alternativo del cuaderno: vale en lugar de las 10 observaciones comiendo.
 s.feedObs.af_guepardo=0;const req=g.stageRequirements('af_guepardo',3);
 assert.equal(req.extraOk,true);assert.match(req.extra,/también vale el hito «Velocidad máxima ≥ 100 km\/h»/);
 // Persistencia al cerrar y reabrir.
 const r=reopen(h),rr=r.g.state.beta560.hitos.af_guepardo;
 deq(rr,s.beta560.hitos.af_guepardo);
 assert.equal(r.g.stageRequirements('af_guepardo',3).extraOk,true);
 // Encuentros compatibles: el motor de campo consulta el hito por cada especie avistada.
 const calls=[];r.A.run=id=>{calls.push(id);return null;};
 r.g.state.discovered.lobo_gris=true;r.g.encounter('manual',r.now,true);
 assert.ok(calls.length>=1&&calls.every(id=>r.g.SPECIES[id]));
 // Ninguna especie más tiene hito en MEC-01.
 assert.equal(g.stageRequirements('lobo_gris',3).extra.includes('hito'),false);
});

test('MEC-01 · 13. sin datos beta el motor se comporta como V5.5.1 (sin regresiones)',()=>{
 const h=make({now:T0,headless:true,noBeta:true}),g=h.g,s=g.state;
 assert.equal(g.MUSEUM_WINGS.length,3);
 deq(g.MUSEUM_WINGS,[{level:1,name:'Galería de fauna',cost:0,prestige:0},{level:2,name:'Sala de historia natural',cost:300,prestige:2},{level:3,name:'Gran galería zoológica',cost:900,prestige:5}]);
 deq([1,2,3,4,5].map(w=>{s.museum.wing=w;return g.museumCapacity();}),[3,7,12,18,25]);
 s.museum.wing=1;
 deq(g.mec01FieldDrops('lobo_gris',true),[]);
 const m=s.money;g.earnMoney(15,'descubrimientos');assert.equal(s.money,m+15);assert.equal(s.moneyLedger,undefined);
 // Con datos beta, niveles 4 y 5 salen de la misma tabla.
 const b=game().g;deq(b.MUSEUM_WINGS.map(w=>[w.level,w.cost,w.prestige]),[[1,0,0],[2,300,2],[3,900,5],[4,50000,60],[5,500000,150]]);
 deq(b.MUSEUM_LEVELS.map(l=>l.cabinetSlots),[4,8,12,16,20]);
});

test('MEC-01 · versión 5.6.1 Beta coherente en paquete, PWA, integridad y caché',()=>{
 const v='5.6.1';
 assert.equal(require('../package.json').version,v);
 assert.equal(require('../www/atlas-release.json').version,v);
 assert.equal(require('../www/atlas-release.json').build,'MEC-01');
 const index=fs.readFileSync('www/index.html','utf8'),sw=fs.readFileSync('www/sw.js','utf8');
 assert.match(index,/name="atlas-version" content="5\.6\.1"/);assert.match(index,/5\.6\.1 Beta — MEC-01/);
 assert.ok(!index.includes('v=5.5.1'));
 for(const f of ['js/mec01-core.js','js/mec01-ui.js','js/mec01-catalog-meta.js','css/mec01.css']){assert.ok(sw.includes("'./"+f+"'"),f);assert.ok(index.includes(f),f);}
 assert.match(sw,/RELEASE=\{version:'5\.6\.1'/);assert.match(sw,/const CACHE='gran-atlas-v5\.6\.1-naturalist-[0-9a-f]{12}'/);
 const integrity=require('../www/atlas-integrity.json');assert.equal(integrity.version,v);
 const crypto=require('node:crypto');
 for(const f of ['js/app.js','js/mec01-core.js','js/mec01-ui.js','css/mec01.css'])
  assert.equal(integrity.files[f][1],crypto.createHash('sha256').update(fs.readFileSync('www/'+f)).digest('hex'),f);
 // La APK pública autorizada no se toca: sin cambios en Android.
 assert.ok(!fs.existsSync('android'),'no se generó un proyecto Android');
});
