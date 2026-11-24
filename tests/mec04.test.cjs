'use strict';
// MEC-04 · V5.6.4 Beta · Sociedad científica, rangos y desbloqueos, y correcciones de MEC-03.
// Una prueba por punto de la sección 17 del encargo, con efectos reales sobre el motor.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs');
const audit=require('./helpers/mec04-audit.cjs');
const KEY='gran_atlas_v05',T0=1790000000000,H=3600e3;
const J=x=>x===undefined?x:JSON.parse(JSON.stringify(x)),deq=(a,b,m)=>assert.deepEqual(J(a),J(b),m);
function rngWith(seed=5){const queue=[];let x=seed>>>0;const f=()=>{if(queue.length)return queue.shift();x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};f.queue=queue;return f;}
function game(o={}){const rng=o.rng||rngWith(o.seed);const h=make({now:T0,headless:true,rng,...o});h.rng=rng;return h;}
const saved=h=>{h.g.persist();return h.store[KEY];};
const reopen=(h,o={})=>game({store:{[KEY]:saved(h)},now:h.now,...o});
const S=h=>h.x.AtlasMEC04,A4=h=>h.x.AtlasMEC04Actions,A3=h=>h.x.AtlasMEC03Actions,Cm=h=>h.x.AtlasCampMEC02,K=h=>h.x.AtlasMEC03Catalog;
const failWrites=h=>{const ls=h.localStorage,set=ls.setItem;ls.setItem=()=>{throw new Error('QuotaExceededError');};return ()=>{ls.setItem=set;};};
function rich(h){const s=h.g.state;Object.assign(s,{money:1e8,knowledge:1e8,prestige:600});s.upgrades.shipyard=1;s.purchases.astillero=1;for(const r of h.g.REGIONS)s.regionUnlocked[r.id]=true;return s;}
// Indicadores suficientes para un rango, sin tocar el saldo (los ingresos van al libro).
function meet(h,level){const s=h.g.state,req=S(h).RANKS[level-1].requires;
 if(req.prestige)s.prestige=Math.max(s.prestige,req.prestige);
 if(req.species){const ids=Object.keys(h.g.SPECIES).slice(0,req.species);for(const id of ids)s.discovered[id]=true;}
 if(req.monographs){const ids=Object.keys(h.g.SPECIES).slice(0,req.monographs);for(const id of ids){s.discovered[id]=true;s.published[id]=true;}}
 if(req.collectibles){const ids=Object.keys(K(h).pieces).slice(0,req.collectibles);for(const id of ids)h.g.addInventory(id,1);}
 if(req.voyages)s.museum.voyagesCompleted=Math.max(s.museum.voyagesCompleted||0,req.voyages);
 if(req.research){let n=0;for(const node of h.g.RESEARCH_NODES){if(n>=req.research)break;s.purchases[node.id]=1;n++;}}
 if(req.income&&s.moneyLedger.total<req.income)h.M.credit(s,req.income-s.moneyLedger.total,'otros');
 if(req.regions){let n=0;for(const r of h.g.REGIONS){if(n>=req.regions)break;s.regionUnlocked[r.id]=true;n++;}}
 if(req.collections){let n=0;for(const c of h.A.catalog.collections.values()){if(n>=req.collections)break;for(const id of c.ids)h.g.addInventory(id,1);n++;}}
}
const climb=(h,to)=>{for(let lv=S(h).rank(h.g.state)+1;lv<=to;lv++){meet(h,lv);assert.ok(A4(h).ascend(),'asciende a '+lv);}};

test('MEC-04 · 1. hallazgos ambientales en búsquedas sin avistamiento',()=>{
 const h=game(),g=h.g,s=g.state;
 s.time='sin-fauna';s.habitat='bosque';s.upgrades.specimenDrops=0; // ninguna especie compatible: todas las búsquedas son sin avistamiento
 deq(g.eligibleSpecies?g.eligibleSpecies(s.currentRegion,s.habitat,s.time,s.season):[],[]);
 const before=(s.collectibleFinds||[]).length;
 for(let i=0;i<3000;i++){h.now+=61e3;g.encounter('manual',h.now,false);}
 const finds=(s.collectibleFinds||[]).slice(before);
 assert.ok(finds.length>20,'hay hallazgos ambientales sin avistamientos: '+finds.length);
 assert.ok(finds.every(f=>f.source==='campo'&&f.activityId===s.currentRegion));
 const by={};for(const f of finds)by[f.at]=(by[f.at]||0)+1;assert.ok(Object.values(by).every(n=>n===1),'una tirada por búsqueda');
 assert.equal(s.lastEncounter.title,'Sin avistamiento');
 // Sin búsqueda efectiva (automática sin fauna disponible) no hay tirada.
 const n=(s.collectibleFinds||[]).length;g.encounter('auto',h.now,false,{segment:{currentRegion:s.currentRegion},species:[],choices:[]});
 assert.equal((s.collectibleFinds||[]).length,n);
});

test('MEC-04 · 2. contexto ambiental de búsquedas manuales y automáticas',()=>{
 const h=game(),g=h.g,s=g.state,P=K(h).pieces,E=A3(h).engine;
 for(const r of g.REGIONS)s.regionUnlocked[r.id]=true;
 // Manual: bioma seleccionado.
 const brit=g.REGIONS.find(r=>r.id==='HX-01-09');s.currentRegion=brit.id;s.habitat='costa';
 deq(g.ambientContextMEC04('manual',null),{manual:true,regionId:brit.id,habitats:['costa']});
 const coast=E.ambient(brit,['costa']);assert.ok(coast.length&&coast.every(id=>P[id].sources.campo.biomes.includes('costa')));
 assert.ok(E.ambient(brit,['bosque']).includes('BOT-01')&&!coast.includes('BOT-01'),'la rosa silvestre es de bosque, no de costa');
 for(let i=0;i<4000;i++)g.mec03AmbientFinds(g.ambientContextMEC04('manual',null));
 assert.ok(s.collectibleFinds.every(f=>P[f.item].sources.campo.biomes.includes('costa')));
 // Automática: región del tramo y todos sus biomas (reglas del equipo automático).
 const ctx=g.ambientContextMEC04('auto',{segment:{currentRegion:'HX-03-15',at:T0}});
 deq(ctx,{manual:false,regionId:'HX-03-15',habitats:null,at:T0});
 s.collectibleFinds=[]; // el registro guarda los 120 últimos hallazgos
 for(let i=0;i<10000;i++)g.mec03AmbientFinds(ctx);
 const auto=s.collectibleFinds;assert.ok(auto.length>20,'hallazgos automáticos: '+auto.length);
 assert.ok(auto.every(f=>f.activityId==='HX-03-15'&&P[f.item].continents.includes('Asia')));
});

test('MEC-04 · 3. el procesamiento offline usa la región histórica del tramo',()=>{
 const h=game(),g=h.g,s=g.state;
 for(const r of g.REGIONS.slice(0,15))s.regionUnlocked[r.id]=true;
 s.currentRegion='HX-01-09';
 const seg={at:T0-2*H,end:T0,interval:2000,currentRegion:'HX-03-15',season:s.season,habitat:'bosque',time:'dia',method:null};
 s.autoPending=[seg];s.lastTick=T0;
 const n=(s.collectibleFinds||[]).length;
 for(let i=0;i<40&&s.autoPending.length;i++)h.tick();
 const finds=(s.collectibleFinds||[]).slice(n).filter(f=>f.source==='campo');
 assert.ok(finds.length>0,'hubo hallazgos durante el procesamiento');
 assert.ok(finds.every(f=>f.activityId==='HX-03-15'),'todos con la región del tramo, no con la actual');
 assert.equal(s.currentRegion,'HX-01-09');
});

test('MEC-04 · 4. cada pieza comercializable aparece en ofertas reales y estas persisten',()=>{
 const h=game(),s=rich(h),a=A3(h),P=K(h).pieces;s.society.rank=20;
 while(Cm(h).level(s,'caravan')<5)Cm(h).upgrade(s,'caravan');
 const sellable=Object.keys(P).filter(id=>P[id].sources.comercio),seen=new Set();
 for(let p=0;p<500&&seen.size<sellable.length;p++){h.now=T0+p*24*H;for(const o of a.market().offers)seen.add(o.piece);}
 deq(sellable.filter(id=>!seen.has(id)),[],'piezas que nunca aparecen en una oferta');
 // Piezas «Mundial» también en comerciantes regionales; una pieza de Asia, en el comercio europeo.
 assert.ok(sellable.some(id=>P[id].origin==='Mundial'&&seen.has(id)));
 assert.ok(P['MAS-03'].sources.comercio.continents.includes('Europa')&&P['MAS-03'].origin==='Asia');
 // Identidad estable: recargar no regenera.
 const offers=J(a.market().offers),r=reopen(h);deq(A3(r).market().offers,offers);
 // Las piezas expuestas y la última unidad siguen protegidas.
 const req=offers.find(o=>o.kind==='solicitud'&&o.tier!=='extra');h.g.addInventory(req.piece,1);
 assert.equal(a.stock(req.piece).tradable,0);assert.equal(a.offerPlan(req),null);
});

test('MEC-04 · 5. las 431 piezas se conservan y son accesibles en cuatro niveles',()=>{
 const h=game(),P=K(h).pieces,B=h.B;
 assert.equal(Object.keys(P).length,431);assert.equal(B.items.filter(r=>r[2]===0||r[2]===2).length,431);
 assert.equal(h.A.catalog.collections.size,32);assert.equal(B.items.filter(r=>r[2]===1).length,27);
 // 1. Configurada en una fuente.
 assert.ok(Object.values(P).every(p=>Object.keys(p.sources).length>0));
 // Geografía: «Mundial» solo con distribución amplia o incertidumbre documentada.
 const world=Object.values(P).filter(p=>p.origin==='Mundial');
 assert.ok(world.length<=25,'quedan '+world.length);assert.ok(world.every(p=>p.note),'toda pieza «Mundial» explica por qué');
 assert.equal(Object.values(P).filter(p=>p.originBefore==='Mundial').length,131-world.length);
 // 2–3. En un conjunto de recompensas y obtenible con las reglas del motor en un estado avanzado.
 const adv=game();const r=audit.run(adv);
 deq(r.missingPieces,[],'todas obtenibles');
 // 4. Alcanzable desde una partida nueva sin ayudas ni dependencias circulares.
 assert.equal(r.rank,20);assert.equal(r.pieces,431);
});

test('MEC-04 · 6. existen los 20 rangos con configuración completa',()=>{
 const h=game(),R=S(h).RANKS;
 assert.equal(R.length,20);
 deq(R.map(r=>r.name),h.B.sociedad.map(r=>r[0]),'conserva los nombres de la beta');
 deq(R.map(r=>r.requires.prestige),h.B.sociedad.map(r=>r[1]),'y su prestigio');
 assert.equal(new Set(R.map(r=>r.id)).size,20);assert.equal(new Set(R.map(r=>r.art.key)).size,20);
 for(const r of R){assert.ok(r.description&&r.requires&&Array.isArray(r.unlocks)&&r.balance==='provisional'&&r.art.file===null);for(const b of r.unlocks)assert.ok(S(h).BENEFITS[b],b);}
 const max=k=>Math.max(...R.map(r=>r.requires[k]||0));
 assert.ok(max('collectibles')<431,'no exige las 431 piezas');assert.ok(max('species')<Object.keys(h.g.SPECIES).length,'ni todas las especies');
 assert.ok(R.every(r=>Object.keys(r.requires).length<=4),'no exige todos los indicadores a la vez');
 const used=new Set(R.flatMap(r=>Object.keys(r.requires)));for(const k of Object.keys(S(h).METRICS))assert.ok(used.has(k),k);
 assert.ok(R.every(r=>r.requires.prestige!==undefined),'el prestigio es central');
});

test('MEC-04 · 7, 8 y 9. requisitos, ascensos persistentes y rechazo',()=>{
 const h=game(),g=h.g,s=g.state,a=A4(h);
 assert.equal(S(h).rank(s),1);
 // Saldo alto no sustituye a los ingresos históricos.
 s.money=1e9;s.prestige=12;for(let i=0;i<3;i++)s.purchases[g.RESEARCH_NODES[i].id]=1;meet(h,2);assert.ok(a.ascend());
 assert.equal(a.eligibility().ok,false);assert.ok(a.eligibility().missing.some(m=>m.key==='income'));
 const before=J(s);assert.equal(a.ascend(),null,'sin requisitos no asciende');deq(s.society,before.society);
 meet(h,3);const l0=s.moneyLedger.bySource.recompensas||0;
 const r=a.ascend();assert.equal(r.level,3);
 assert.equal(s.society.history.at(-1).rank,3);assert.equal(s.society.history.at(-1).at,h.now);
 assert.equal(s.moneyLedger.bySource.recompensas,l0+S(h).RANKS[2].reward.money);
 const re=reopen(h);assert.equal(S(re).rank(re.g.state),3);deq(re.g.state.society.history,s.society.history);
 // Un nivel cada vez.
 climb(re,5);assert.equal(S(re).rank(re.g.state),5);
});

test('MEC-04 · 10. el rango no baja por gastar, intercambiar o retirar exposiciones',()=>{
 const h=game(),s=rich(h);climb(h,6);
 s.money=0;for(const id of Object.keys(s.inventory))s.inventory[id]=0;s.museum.cabinets={};h.g.render();
 assert.equal(S(h).rank(s),6);assert.equal(A4(h).eligibility().current.level,6);
 // Un rango guardado más bajo que su historial se corrige hacia arriba.
 s.society.rank=2;S(h).normalize(s);assert.equal(S(h).rank(s),6);
});

test('MEC-04 · 11 y 16. desbloqueos aplicados: instalaciones, comercio, encargos y financiación',()=>{
 const h=game(),s=rich(h),C=Cm(h),a3=A3(h),a4=A4(h);
 for(const id of ['shipyard','workshop','caravan','excavations','surveys'])while(C.level(s,id)<3)assert.ok(C.upgrade(s,id).ok,id+' I–III sin rango');
 assert.equal(C.upgrade(s,'shipyard').ok,false);assert.match(C.check(s,'shipyard').reasons.join(),/Rango de Sociedad «Observador»/);
 climb(h,5);assert.ok(C.upgrade(s,'shipyard').ok,'Astillero IV con rango 5');assert.equal(C.upgrade(s,'caravan').ok,false,'Caravana IV exige rango 6');
 // Financiación: campo con rango 3, expediciones con rango 6.
 assert.ok(a4.funding('campo').ok);assert.equal(a4.funding('expediciones').ok,false);
 const sub0=s.moneyLedger.bySource.subvenciones||0,amount=a4.claimFunding('campo');
 assert.ok(amount>0);assert.equal(s.moneyLedger.bySource.subvenciones,sub0+amount);assert.equal(a4.claimFunding('campo'),0,'espera entre cobros');
 // Encargo con rango: Sociedad Geográfica exige rango 6.
 const geo=a3.commissionList().find(c=>c.id==='geografica');assert.ok(a3.commissionPlan(geo).reasons.some(r=>/rango/.test(r)));
 climb(h,6);assert.ok(!a3.commissionPlan(geo).reasons.some(r=>/rango/.test(r)));
 assert.ok(C.upgrade(s,'caravan').ok&&C.upgrade(s,'caravan').ok===false||C.level(s,'caravan')===4);
 // Comercio: ofertas de nivel IV con rango 6; extraordinarias con rango 12.
 while(C.level(s,'caravan')<5){s.society.rank=Math.max(s.society.rank,9);C.upgrade(s,'caravan');}
 const m=a3.market(),extra=m.offers.filter(o=>o.tier==='extra');assert.ok(extra.length>0);
 s.society.rank=11;assert.match(a3.offerBlock(extra[0]),/Académico/);assert.equal(a3.executeOffer(extra[0].id),false);
 s.society.rank=12;assert.equal(a3.offerBlock(extra[0]),'');
 const lvl4=m.offers.find(o=>o.level===4);s.society.rank=5;assert.ok(a3.offerBlock(lvl4));s.society.rank=12;
 // Museo: conexión preparada, sin efecto todavía.
 assert.equal(S(h).MUSEUM_RANKS.active,false);assert.equal(S(h).BENEFITS['museum:ampliaciones'].prepared,true);
});

test('MEC-04 · 12. recompensas y financiación sin duplicados',()=>{
 const h=game(),s=rich(h),a4=A4(h);climb(h,10);
 const rewards=J(s.society.rewards);assert.equal(Object.keys(rewards).length,9);
 assert.equal(a4.ascend(),null);deq(s.society.rewards,rewards);
 // Expediciones: cada expedición completada se financia una vez.
 const F=S(h).FUNDING.expediciones;s.museum.voyagesCompleted+=4;const f=a4.funding('expediciones');assert.ok(f.ok);
 const pending=s.museum.voyagesCompleted-s.society.grants.expediciones.funded;assert.ok(pending>=4);
 // Cada cobro financia hasta maxVoyages expediciones; ninguna se cobra dos veces.
 let total=0,claims=0;while(a4.funding('expediciones').ok&&claims<20){total+=a4.claimFunding('expediciones');claims++;}
 assert.equal(total,pending*F.perVoyage);assert.equal(claims,Math.ceil(pending/F.maxVoyages));assert.equal(a4.claimFunding('expediciones'),0);
 // Proyectos: cada hito de monografías una vez.
 for(const id of Object.keys(h.g.SPECIES).slice(0,80)){s.discovered[id]=true;s.published[id]=true;}
 const p=a4.claimFunding('proyectos');assert.ok(p>0);assert.equal(a4.claimFunding('proyectos'),0);
 const r=reopen(h);assert.equal(A4(r).claimFunding('proyectos'),0);assert.equal(A4(r).claimFunding('expediciones'),0);
});

test('MEC-04 · 13. sin dependencias circulares desde partidas inicial, intermedia y avanzada',()=>{
 // Inicial.
 const a=audit.run(game());
 assert.equal(a.rank,20);deq(a.blockedBy,[]);assert.equal(a.regions,a.totalRegions);assert.equal(a.research,a.totalResearch);
 deq(a.missingVoyages,[]);deq(a.missingSites,[]);deq(a.missingPieces,[]);
 assert.equal(a.prospections.length,3);assert.equal(a.preparations.length,5);assert.equal(a.commissions.length,8);
 // Los rangos se alcanzan con las instalaciones que su rango previo permite (ver orden).
 const firstL5=a.log.findIndex(x=>/^instalación shipyard 5/.test(x)),rank9=a.log.indexOf('rango 9');
 assert.ok(rank9>=0&&firstL5>rank9,'el Astillero V llega después del rango 9');
 // Intermedia: Europa y Asia, rango 5, instalaciones en III.
 const mid=game(),ms=mid.g.state;rich(mid);climb(mid,5);for(const r of mid.g.REGIONS)ms.regionUnlocked[r.id]=['Europa','Asia'].includes(r.continent);
 const b=audit.run(mid);assert.equal(b.rank,20);deq(b.missingPieces,[]);
 // Avanzada: todo desbloqueado salvo el rango.
 const adv=game();rich(adv);adv.g.state.society.rank=1;const c=audit.run(adv);assert.equal(c.rank,20);
});

test('MEC-04 · 14 y 15. partidas anteriores: rango reconocido sin inventar e instalaciones intactas',()=>{
 const old=game().g.initialState();
 Object.assign(old,{money:5,knowledge:1000,prestige:30});
 for(const sp of Object.keys(game().g.SPECIES).slice(0,60))old.discovered[sp]=true;
 old.purchases={...old.purchases,prismaticos_1:1,cuaderno_1:1,metodo_1:1,astillero:1};old.upgrades.shipyard=1;
 old.moneyLedger={schema:1,total:5000,bySource:{sinDesglose:5000},migration:null};
 old.camp={schema:1,levels:{shipyard:5,caravan:5,workshop:4,excavations:5,surveys:5},history:[]};
 old.museum.voyagesCompleted=7;
 old.inventory={...old.inventory,'BOT-01':1,'BOT-02':1,'GEM-01':1,'NUM-01':1};
 delete old.society;
 const h=game({store:{[KEY]:JSON.stringify(old)}}),s=h.g.state;
 // Cumple 2 (prestigio 5, 10 especies), 3 (12, 3 investigaciones, £1.000) y 4 (25, 40 especies, 3 piezas); no 5 (10 monografías).
 assert.equal(S(h).rank(s),4);assert.equal(s.society.migration.method,'registros-disponibles');
 assert.ok(s.society.history.every(x=>x.migrated));assert.equal(s.moneyLedger.bySource.recompensas,undefined,'sin recompensas inventadas');
 assert.ok(Object.values(s.society.rewards).every(r=>r.migrated&&r.paid===false));
 assert.equal(s.society.grants.expediciones.funded,7,'sin financiación retroactiva');
 // Instalaciones conservadas aunque el rango no alcance para mejorarlas hoy.
 deq(s.camp.levels,{shipyard:5,caravan:5,workshop:4,excavations:5,surveys:5});
 assert.equal(h.g.maxVoyages(),2+2);assert.equal(Cm(h).check(s,'workshop').ok,false,'mejorar exige ahora el rango');
 // La migración es idempotente.
 const r=reopen(h);deq(r.g.state.society,s.society);
});

test('MEC-04 · 17. fallo de guardado durante un ascenso',()=>{
 const h=game(),s=rich(h);meet(h,2);
 h.g.persist();const stored=h.store[KEY],before=J(s.society),l0=s.moneyLedger.total;
 const restore=failWrites(h);assert.equal(A4(h).ascend(),null);
 deq(s.society,before);assert.equal(s.moneyLedger.total,l0);assert.equal(h.store[KEY],stored);restore();
 assert.equal(A4(h).ascend().level,2);
 // También la financiación.
 climb(h,3);const r2=failWrites(h),m0=s.money;assert.equal(A4(h).claimFunding('campo'),0);assert.equal(s.money,m0);r2();
});

test('MEC-04 · 18 y 19. exportación, importación y operación offline',()=>{
 const h=game(),s=rich(h);climb(h,6);A4(h).claimFunding('campo');
 const data=J(h.window.AtlasSaveBridge.getSaveData());
 const t=game({now:h.now+1000});t.window.AtlasSaveBridge.restoreGame(data);
 deq(t.g.state.society,data.society);assert.equal(S(t).rank(t.g.state),6);
 assert.equal(A4(t).claimFunding('campo'),0,'la espera viaja con la partida');
 // Offline: volver 7 h después permite la siguiente subvención de campo, una vez.
 const r=game({store:{[KEY]:saved(h)},now:h.now+7*H});r.tick();
 assert.ok(A4(r).claimFunding('campo')>0);assert.equal(A4(r).claimFunding('campo'),0);
 assert.ok(fs.readFileSync('www/js/save-manager.js','utf8').includes("gameVersion: '5.6.4'"));
});

test('MEC-04 · 20. MEC-01, MEC-02 y MEC-03 se conservan; versión y verificación',()=>{
 const h=game(),g=h.g;
 deq(h.A.drops.channels()[0].rates.campo,{manual:0.02,auto:0.005});
 assert.ok(g.state.moneyLedger&&g.state.collectionRegistry&&g.state.camp&&g.state.collectionPrefs);
 const plain=game({noCamp:true});for(const fn of ['maxVoyages','maxExcavations','maxRelictSurveys'])assert.equal(g[fn](),plain.g[fn](),fn);
 // Sin módulos MEC no hay contenido nuevo (las pruebas históricas no cambian).
 assert.equal(plain.g.VOYAGES.length,8,'sin módulos MEC no se añaden destinos');assert.equal(g.VOYAGES.length,13);assert.equal(g.MUSEUM_DIG_SITES.length,7);
 const legacy=make({now:T0,headless:true,noBeta:true});assert.equal(legacy.g.VOYAGES.length,8);assert.equal(legacy.g.MUSEUM_DIG_SITES.length,4);
 const pkg=require('../package.json'),rel=require('../www/atlas-release.json');
 assert.equal(pkg.version,'5.6.4');assert.equal(rel.version,'5.6.4');assert.equal(rel.build,'MEC-04');assert.equal(rel.channel,'beta');
 assert.ok(pkg.scripts['release:verify'].includes('tests/mec04.test.cjs'));
 assert.ok(fs.readFileSync('www/sw.js','utf8').includes("'./js/mec04-society.js'"));
 assert.equal(require('node:child_process').spawnSync(process.execPath,['scripts/build-mec03-catalog.cjs']).status,0);
 assert.ok(!fs.existsSync('android'));
});
