'use strict';
// MEC-02 · V5.6.2 Beta · Campamento evolutivo. Pruebas de efectos reales sobre el motor
// (sección 15 del encargo MEC-02), no solo de nombres o botones.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const KEY='gran_atlas_v05',T0=1790000000000,H=3600e3;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
function rngWith(seed=99){const queue=[];let x=seed>>>0;const f=()=>{if(queue.length)return queue.shift();x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};f.queue=queue;return f;}
function game(options={}){const rng=options.rng||rngWith(options.seed);const h=make({now:T0,headless:true,rng,...options});h.rng=rng;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,options={})=>game({store:{[KEY]:saved(h)},now:h.now,...options});
// Partida con recursos para comprar mejoras y con el astillero habilitado.
// MEC-04: los niveles IV y V exigen rango de Sociedad; estas pruebas de MEC-02 parten del rango máximo
// (la exigencia de rango se prueba en tests/mec04.test.cjs).
function rich(h){const s=h.g.state;Object.assign(s,{money:5e6,knowledge:5e6,prestige:200});if(s.society)s.society.rank=20;s.upgrades.shipyard=1;s.purchases.astillero=1;for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;return s;}
const up=(h,id,to)=>{const C=h.x.AtlasCampMEC02;if(h.g.state.society)h.g.state.society.rank=20;while(C.level(h.g.state,id)<to)assert.equal(C.upgrade(h.g.state,id,h.now).ok,true,id+' → '+to);};
const A=h=>h.x.AtlasCampMEC02Actions,C=h=>h.x.AtlasCampMEC02;

test('MEC-02 · cinco instalaciones con cinco niveles; cada nivel cambia algo verificable',()=>{
 const h=game(),c=C(h);
 deq(c.FACILITIES.map(f=>f.id),['shipyard','caravan','workshop','excavations','surveys']);
 deq(c.FACILITIES.map(f=>f.levels.map(l=>l.name)),[
  ['Embarcadero','Muelle','Astillero','Dársena','Puerto científico'],
  ['Carreta','Caravana equipada','Convoy','Estación comercial','Central comercial'],
  ['Mesa de trabajo','Taller artesanal','Taller científico','Taller especializado','Laboratorio'],
  ['Pozo exploratorio','Excavación','Yacimiento','Complejo paleontológico','Instituto paleontológico'],
  ['Reconocimiento','Estación de reconocimiento','Estación topográfica','Centro de estudios','Centro de prospección']]);
 let stages=0;
 for(const f of c.FACILITIES){
  assert.equal(f.levels.length,5);
  f.levels.forEach((l,i)=>{
   stages++;
   assert.equal(l.level,i+1);assert.ok(l.functions.length>0);assert.ok(c.ART[f.id+'-'+l.level]);
   // MEC-02 lo dejó preparado; MEC-04 lo activa solo en los niveles IV y V.
   assert.ok('societyRank' in l.requires);
   if(l.level<=3)assert.equal(l.requires.societyRankActive,false,'niveles I–III sin rango');
   else assert.ok(l.requires.societyRankActive===true&&l.requires.societyRank>=5,'niveles IV–V con rango (MEC-04)');
   if(i)assert.notDeepEqual(J(l.effects),J(f.levels[i-1].effects),f.id+' nivel '+l.level+' debe cambiar un efecto');
   if(i){assert.ok(l.cost.money>f.levels[i-1].cost.money);assert.equal(l.requires.previousLevel,i);}
  });
 }
 assert.equal(stages,25);
 assert.equal(c.PERSONAL_AREA.levels,false,'la Tienda no tiene niveles productivos');
 assert.equal(Object.keys(c.ART).length,25);
 assert.ok(Object.values(c.ART).every(a=>a.file===null&&a.status==='pendiente'&&a.placeholder));
});

test('MEC-02 · mejorar consume los recursos exactos, conserva el prestigio y persiste',()=>{
 const h=game(),s=rich(h),c=C(h);
 const m0=s.money,k0=s.knowledge,p0=s.prestige;
 assert.equal(c.upgrade(s,'excavations',h.now).ok,true);
 assert.equal(s.money,m0-500);assert.equal(s.knowledge,k0-300);assert.equal(s.prestige,p0);
 assert.equal(s.camp.levels.excavations,2);
 deq(s.camp.history.at(-1),{facility:'excavations',level:2,at:h.now,cost:{money:500,knowledge:300}});
 assert.equal(s.moneyLedger.total,0,'gastar en mejoras no toca el libro de ingresos');
 const r=reopen(h);assert.equal(r.g.state.camp.levels.excavations,2);
 // Irreversible: un nivel guardado más bajo que su historial se corrige hacia arriba.
 const t=r.g.state;t.camp.levels.excavations=1;C(r).normalize(t);assert.equal(t.camp.levels.excavations,2);
 // Confirmación antes de gastar: si se rechaza, nada cambia.
 const u=game(),su=rich(u),before=J(su);u.window.confirm=()=>false;
 assert.equal(A(u).upgrade('caravan'),false);deq(su.camp,before.camp);assert.equal(su.money,before.money);
});

test('MEC-02 · las mejoras se rechazan sin requisitos y no alteran la partida',()=>{
 const h=game(),s=h.g.state,c=C(h);
 Object.assign(s,{money:100,knowledge:100,prestige:0});
 let r=c.check(s,'excavations');assert.equal(r.ok,false);
 assert.ok(r.reasons.some(x=>x.includes('Prestigio')));assert.ok(r.reasons.some(x=>x.includes('£500')));
 const before=J(s);assert.equal(c.upgrade(s,'excavations').ok,false);deq(s,before);
 // Astillero y Caravana necesitan la investigación «Astillero básico».
 Object.assign(s,{money:1e6,knowledge:1e6,prestige:100});
 assert.ok(c.check(s,'shipyard').reasons[0].includes('Astillero básico'));assert.equal(c.upgrade(s,'caravan').ok,false);
 s.upgrades.shipyard=1;assert.equal(c.upgrade(s,'caravan').ok,true);
 // Nivel máximo.
 up(h,'surveys',5);r=c.check(s,'surveys');assert.equal(r.ok,false);assert.equal(r.max,true);assert.equal(c.upgrade(s,'surveys').ok,false);
 // Una mejora no desbloquea continentes ni regiones.
 const regions=J(s.regionUnlocked),purchases=J(s.purchases);up(h,'shipyard',5);deq(s.regionUnlocked,regions);deq(s.purchases,purchases);
});

test('MEC-02 · capacidades: expediciones, rutas, excavaciones y prospecciones',()=>{
 const h=game(),s=rich(h),g=h.g;
 // Astillero: la capacidad histórica (2 + flota) más el bono del nivel.
 assert.equal(g.maxVoyages(),2);s.upgrades.fleet=1;assert.equal(g.maxVoyages(),3);
 up(h,'shipyard',2);assert.equal(g.maxVoyages(),4);up(h,'shipyard',4);assert.equal(g.maxVoyages(),5);
 for(let i=0;i<5;i++)assert.equal(g.sail('coast'),true,'zarpa '+(i+1));
 assert.equal(g.sail('coast'),false,'la sexta no cabe');assert.equal(s.voyages.length,5);
 // Caravana: 1 ruta en nivel I; 2 en II; se comprueba con salidas reales.
 assert.equal(g.startTrade3300('coastal_trade'),true);assert.equal(g.startTrade3300('coastal_trade'),false);
 up(h,'caravan',2);assert.equal(g.startTrade3300('coastal_trade'),true);assert.equal(s.commerce.jobs.length,2);
 assert.equal(g.startTrade3300('coastal_trade'),false);
 up(h,'caravan',5);assert.equal(A(h).capacity('caravan').total,4);
 // Sin dinero sigue rechazando (se conserva la condición original).
 const money=s.money;s.money=0;assert.equal(g.tradeCanStart3300(g.TRADE_ROUTES[0]),false);s.money=money;
 // Excavaciones y prospecciones.
 assert.equal(g.maxExcavations(),1);s.upgrades.excavationTier=1;assert.equal(g.maxExcavations(),2);
 up(h,'excavations',2);assert.equal(g.maxExcavations(),3);
 for(let i=0;i<3;i++)assert.equal(g.startExcavation('british_cliffs'),true);assert.equal(g.startExcavation('british_cliffs'),false);
 assert.equal(g.maxRelictSurveys(),1);up(h,'surveys',2);assert.equal(g.maxRelictSurveys(),2);
 const relicts=g.MUSEUM_RELICTS.slice(0,3).map(r=>r.id);
 assert.equal(g.startRelictSurvey(relicts[0]),true);assert.equal(g.startRelictSurvey(relicts[1]),true);assert.equal(g.startRelictSurvey(relicts[2]),false);
});

test('MEC-02 · nuevas funciones según nivel (Astillero, Caravana, Prospecciones)',()=>{
 const h=game(),s=rich(h),g=h.g,a=A(h);
 // Preparación de expediciones en nivel III: −10 % de duración.
 const base=g.voyageDuration(1000);up(h,'shipyard',3);assert.equal(g.voyageDuration(1000),Math.round(base*0.9));
 // Expedición ampliada solo en nivel V: doble costo y duración.
 assert.equal(a.sail('coast','ampliada'),false);up(h,'shipyard',5);
 const v=g.VOYAGES.find(x=>x.id==='coast'),m0=s.money;
 assert.equal(a.sail('coast','ampliada'),true);
 const job=s.voyages.at(-1);assert.equal(job.modality,'ampliada');assert.equal(s.money,m0-2*v.cost);
 assert.equal(job.endAt-job.startedAt,2*g.voyageDuration(v.seconds)*1000);
 // Compra por lotes en el mercado: no existe en II, sí en III.
 up(h,'caravan',2);const lens0=s.inventory.parchment_scrap||0;
 assert.equal(a.market('parchment_scrap',5),0);up(h,'caravan',3);
 const mm=s.money;assert.equal(a.market('parchment_scrap',5),5);
 assert.equal(s.inventory.parchment_scrap,lens0+5);assert.equal(s.money,mm-5*g.TRADE_MARKET.parchment_scrap);
 // Prospecciones III: un indicio adicional, sin superar 3 ni entregar el relicto.
 const r=g.MUSEUM_RELICTS[0].id;up(h,'surveys',3);
 assert.equal(g.startRelictSurvey(r),true);const sj=s.museum.relictSurveys.at(-1);
 h.now=sj.endAt+1;assert.equal(g.collectRelictSurvey(sj.id),true);
 assert.equal(g.relictLeadCount(r),2,'1 indicio original + 1 de la Estación topográfica');
 assert.equal(g.collectRelictSurvey(sj.id),false);assert.equal(g.relictLeadCount(r),2,'sin doble liquidación');
 up(h,'surveys',5);
 for(let i=0;i<3;i++){if(!g.canStartRelictSurvey(r))break;g.startRelictSurvey(r);const j=s.museum.relictSurveys.at(-1);h.now=j.endAt+1;g.collectRelictSurvey(j.id);}
 assert.equal(g.relictLeadCount(r),3,'nunca más de 3 indicios');
 assert.ok(!s.museum.relicts?.[r],'ninguna mejora entrega un relicto');
 // Centro de estudios (IV+): −20 % de duración en las nuevas prospecciones.
 const h2=game();rich(h2);const spec=h2.g.relictSurveySpec(g.MUSEUM_RELICTS[1].id).seconds;up(h2,'surveys',4);
 assert.equal(h2.g.relictSurveySpec(g.MUSEUM_RELICTS[1].id).seconds,Math.round(spec*0.8));
});

test('MEC-02 · Taller: recetas históricas libres, lotes, subcomponentes y estudios en lote',()=>{
 const h=game(),s=rich(h),g=h.g,a=A(h);
 // Ninguna receta histórica exige nivel de Taller. MEC-06 asigna nivel solo a los seis componentes de la
 // beta (configuración en www/js/mec06-workshop.js); antes de MEC-06 esta prueba esperaba 1 para todas.
 const C6=h.x.AtlasMEC06?.COMPONENTS||{};
 for(const id of Object.keys(g.RECIPES))assert.equal(a.recipeClass(id)?.minWorkshop??1,C6[id]?C6[id].minWorkshop:1,id);
 const cats=new Set(Object.keys(g.RECIPES).map(id=>a.recipeClass(id)?.category).filter(Boolean));
 for(const c of ['equipamiento','cartografia','material-artefacto'])assert.ok(cats.has(c),c);
 // Requisito de nivel preparado: una receta nueva de nivel 3 queda bloqueada en I y libre en III.
 g.RECIPES.mec02_prueba={requires:{river_pebble:1},minWorkshop:3};g.ITEMS.mec02_prueba={name:'Prueba',slot:null,bonus:'',kind:'test'};
 s.inventory.river_pebble=10;assert.equal(g.canCraft('mec02_prueba'),false);
 // Estudios ×10: rechazados en I, aceptados en II y consumen ×10.
 s.inventory.pressed_flower=40;s.inventory.parchment_scrap=20;
 assert.equal(g.canProcessMaterials('herbarium',10),false);assert.equal(g.processMaterials('herbarium',10),false);
 up(h,'workshop',2);const k0=s.knowledge;
 assert.equal(g.processMaterials('herbarium',10),true);assert.equal(s.inventory.pressed_flower,10);assert.equal(s.knowledge,k0+400);
 assert.equal(g.canProcessMaterials('herbarium',25),false);
 // Fabricación ×5 en III.
 s.inventory.pressed_flower=10;s.inventory.animal_trace=10;
 assert.equal(a.craft('rain_hood',5),0);up(h,'workshop',3);assert.equal(g.canCraft('mec02_prueba'),true);
 const hoods=s.inventory.rain_hood||0;assert.equal(a.craft('rain_hood',5),5);assert.equal(s.inventory.rain_hood,hoods+5);assert.equal(s.inventory.animal_trace,5);
 // Subcomponentes en IV: el telescopio fabrica antes los prismáticos que faltan.
 Object.assign(s.inventory,{binoculars:0,polished_lens:4,map_fragment:1,brass_shard:2,parchment_scrap:2});
 assert.equal(g.canCraft('field_telescope'),false);assert.equal(a.craftTree('field_telescope'),false);
 up(h,'workshop',4);const t0=s.inventory.field_telescope||0;
 assert.equal(a.craftTree('field_telescope'),true);assert.equal(s.inventory.field_telescope,t0+1);
 assert.equal(s.inventory.polished_lens,0);assert.equal(s.inventory.binoculars,0);
 // Fabricación inmediata: ninguna receta crea actividades temporizadas.
 assert.equal(a.activities('workshop'),null);
});

test('MEC-02 · excavaciones: modalidades, recogida conjunta y recompensas únicas',()=>{
 const h=game(),s=rich(h),g=h.g,a=A(h);
 assert.equal(a.dig('british_cliffs','profunda'),false,'la excavación profunda no existe en nivel I');
 up(h,'excavations',3);
 const site=g.MUSEUM_DIG_SITES.find(x=>x.id==='british_cliffs'),m0=s.money;
 assert.equal(a.dig('british_cliffs','profunda'),true);
 const job=s.museum.excavations.at(-1);assert.equal(job.mode,'profunda');
 assert.equal(s.money,m0-2*site.money);assert.equal(job.endAt,h.now+2*site.seconds*1000);
 h.now=job.endAt;const f0=s.inventory.fossil_fragment||0;
 h.rng.queue.push(0,0.99,0.99,0.99,0.99,0.99); // fragmentos mínimos y sin piezas raras en la tirada base; extra: diente
 assert.equal(g.collectExcavation(job.id),true);
 const got=s.inventory.fossil_fragment-f0;assert.equal(got,site.fragments[0]+2,'+2 fragmentos de la modalidad profunda');
 assert.equal(g.collectExcavation(job.id),false);assert.equal(s.inventory.fossil_fragment-f0,got,'sin duplicar');
 // Especial (V): huella fosilizada garantizada. Recoger todas (IV+), una sola vez.
 up(h,'excavations',5);
 assert.equal(a.dig('british_cliffs','especial'),true);assert.equal(a.dig('british_cliffs','normal'),true);
 h.now+=10*H;const tr=s.inventory.fossil_track||0;
 assert.equal(a.collectAll('excavations'),2);assert.equal(a.collectAll('excavations'),0);
 assert.ok(s.inventory.fossil_track>=tr+1);assert.equal(s.museum.excavations.length,0);
 // Recargar después de recoger no vuelve a pagar.
 const r=reopen(h),inv=J(r.g.state.inventory);assert.equal(A(r).collectAll('excavations'),0);deq(r.g.state.inventory,inv);
});

test('MEC-02 · partidas antiguas: nivel I con derechos adquiridos y trabajos intactos',()=>{
 // Partida anterior a MEC-02 con investigaciones de capacidad y trabajos en curso.
 const old=game().g.initialState();
 Object.assign(old,{money:9000,knowledge:9000,prestige:30});
 Object.assign(old.upgrades,{shipyard:1,fleet:1,excavationTier:1,relictSurveyTier:1});
 old.voyages=[{id:1,type:'coast',startedAt:T0-60e3,endAt:T0+60e3},{id:2,type:'north',startedAt:T0-60e3,endAt:T0+120e3},{id:3,type:'coast',startedAt:T0-60e3,endAt:T0+180e3}];old.voyageSeq=3;
 old.commerce={...(old.commerce||{}),jobs:[{id:1,route:'coastal_trade',startedAt:T0-H,endAt:T0+3*H}],seq:1,history:[]}; // 4 h, como exige la ruta
 old.museum.excavations=[{id:1,site:'british_cliffs',endAt:T0-1},{id:2,site:'british_cliffs',endAt:T0+H}];old.museum.excavationSeq=2;
 delete old.camp;
 const h=game({store:{[KEY]:JSON.stringify(old)}}),s=h.g.state,g=h.g;
 deq(s.camp.levels,{shipyard:1,caravan:1,workshop:1,excavations:1,surveys:1});
 assert.equal(s.camp.migration.method,'nivel-1-con-derechos-adquiridos');
 // Las capacidades obtenidas por investigación se conservan en el nivel I.
 assert.equal(g.maxVoyages(),3);assert.equal(g.maxExcavations(),2);assert.equal(g.maxRelictSurveys(),2);
 // Los trabajos en curso siguen ahí.
 assert.equal(s.voyages.length,3);assert.equal(s.commerce.jobs.length,1);assert.equal(s.museum.excavations.length,2);
 // Un trabajo por encima de la capacidad (sin investigación) termina igual.
 const over=JSON.parse(JSON.stringify(old));over.upgrades.fleet=0;over.upgrades.excavationTier=0;
 const o=game({store:{[KEY]:JSON.stringify(over)}});assert.equal(o.g.maxVoyages(),2);assert.equal(o.g.state.voyages.length,3);
 o.now=T0+200e3;o.tick();assert.equal(o.g.state.voyages.length,0,'las tres expediciones se liquidan');
 assert.equal(o.g.collectExcavation(1),true);
 // La partida de MEC-01 (5.6.1) mantiene libro y registro.
 assert.ok(s.moneyLedger&&s.collectionRegistry);
});

test('MEC-02 · offline, recarga e importación: sin recompensas duplicadas',()=>{
 const h=game(),s=rich(h),g=h.g;
 up(h,'shipyard',5);up(h,'caravan',2);
 const lootBefore=Object.values(s.inventory).reduce((a,b)=>a+b,0);
 assert.equal(A(h).sail('coast','ampliada'),true);
 assert.equal(g.startTrade3300('coastal_trade'),true);assert.equal(g.startTrade3300('coastal_trade'),true);
 const voyage=s.voyages.at(-1),raw=saved(h);
 // Se cierra el juego: se vuelve cuando todo terminó.
 const r=game({store:{[KEY]:raw},now:voyage.endAt+5*H}),rs=r.g.state,money0=rs.money,ledger0=rs.moneyLedger.total;
 r.rng.queue.push(...Array(40).fill(0.01)); // cualquier tirada de hallazgos acierta
 r.tick();
 assert.equal(rs.voyages.length,0);assert.equal(rs.commerce.jobs.length,0);
 const route=r.g.TRADE_ROUTES.find(x=>x.id==='coastal_trade');
 assert.equal(rs.moneyLedger.bySource.comercio,2*route.money,'las dos rutas pagan una vez');
 assert.ok(rs.moneyLedger.bySource.expediciones>0);assert.ok(rs.money>money0);
 const after=J(rs);r.tick();r.tick();
 assert.equal(rs.money,after.money);deq(rs.inventory,after.inventory);assert.equal(rs.moneyLedger.total,after.moneyLedger.total);
 assert.ok(Object.values(rs.inventory).reduce((a,b)=>a+b,0)>lootBefore,'la expedición ampliada dejó hallazgos');
 // Reabrir otra vez no repite nada.
 const r2=reopen(r);r2.tick();assert.equal(r2.g.state.moneyLedger.total,after.moneyLedger.total);deq(r2.g.state.inventory,after.inventory);
 assert.ok(rs.moneyLedger.total>ledger0);
});

test('MEC-02 · exportar e importar conserva niveles, historial y modalidades en curso',()=>{
 const h=game(),s=rich(h);
 up(h,'excavations',3);up(h,'workshop',2);
 assert.equal(A(h).dig('british_cliffs','profunda'),true);
 const data=J(h.window.AtlasSaveBridge.getSaveData());
 const t=game({now:h.now+1000});t.window.AtlasSaveBridge.restoreGame(data);
 const ts=t.g.state;
 deq(ts.camp,data.camp);assert.equal(ts.museum.excavations.at(-1).mode,'profunda');
 assert.equal(t.g.maxExcavations(),2);
 // Importar una partida sin Campamento la deja en nivel I.
 delete data.camp;const u=game();u.window.AtlasSaveBridge.restoreGame(data);
 assert.equal(u.g.state.camp.levels.excavations,1);
 assert.ok(fs.readFileSync('www/js/save-manager.js','utf8').includes("gameVersion: '"+require('../package.json').version+"'"));
});

test('MEC-02 · nivel I reproduce el comportamiento histórico (sin regresiones)',()=>{
 const camp=game(),plain=game({noCamp:true});
 for(const h of [camp,plain])rich(h);
 assert.equal(plain.x.AtlasCampMEC02,undefined);
 for(const fn of ['maxVoyages','maxExcavations','maxRelictSurveys'])assert.equal(camp.g[fn](),plain.g[fn](),fn);
 for(const sec of [30,90,1000,7200])assert.equal(camp.g.voyageDuration(sec),plain.g.voyageDuration(sec));
 for(const r of camp.g.MUSEUM_RELICTS.slice(0,5))deq(camp.g.relictSurveySpec(r.id),plain.g.relictSurveySpec(r.id));
 for(const n of [1,5,10])assert.equal(camp.g.canProcessMaterials('herbarium',n),plain.g.canProcessMaterials('herbarium',n));
 for(const id of Object.keys(plain.g.RECIPES))assert.equal(camp.g.canCraft(id),plain.g.canCraft(id),id);
 for(const h of [camp,plain]){assert.equal(h.g.startTrade3300('coastal_trade'),true);assert.equal(h.g.startTrade3300('coastal_trade'),false);}
 // Sin el módulo MEC-02 la partida no gana un estado de Campamento.
 assert.equal(plain.g.state.camp,undefined);
});

test('MEC-02 · versión beta en canal beta, compatible con el actualizador',()=>{
 // MEC-03: se comprueba la versión vigente de package.json (antes, el literal 5.6.2 / MEC-02).
 const rel=require('../www/atlas-release.json');
 assert.equal(rel.version,require('../package.json').version);assert.equal(rel.channel,'beta');assert.match(rel.build,/^MEC-0\d$/);
 assert.match(rel.version,/^\d+\.\d+\.\d+$/,'el actualizador PWA exige una versión numérica');
 const upd=fs.readFileSync('www/js/atlas-pwa-update.js','utf8');
 assert.match(upd,/versionPattern = \/\^\\d\+\\\.\\d\+\\\.\\d\+\$\//);assert.ok(upd.includes("channel === 'beta'"));
 const index=fs.readFileSync('www/index.html','utf8');
 assert.ok(index.includes('<meta name="atlas-channel" content="beta" />'));
 for(const f of ['js/mec02-camp.js','js/mec02-camp-ui.js','css/mec02.css'])assert.ok(fs.readFileSync('www/sw.js','utf8').includes("'./"+f+"'"),f);
 assert.ok(require('../package.json').scripts['release:verify'].includes('tests/mec02.test.cjs'));
 assert.ok(!fs.existsSync('android'),'no se generó proyecto Android');
});
