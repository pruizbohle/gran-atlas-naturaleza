'use strict';
// MEC-04 · auditoría estructural de dependencias y accesibilidad (ampliada en MEC-05).
// Recorre la progresión con las funciones reales del motor (desbloqueo y visita de regiones,
// investigaciones, fabricación de mapas y preparaciones, mejoras de instalaciones con su rango,
// ascensos) y, en cada estado, calcula qué piezas, rutas, yacimientos, prospecciones, ofertas,
// recetas y encargos están efectivamente disponibles. No es una simulación de duración.
//
// SUPUESTOS SINTÉTICOS (documentados en docs/mec05/README.md, sección 2):
//  S1. Dinero y conocimiento se suponen suficientes para pagar costos: son recursos, no
//      desbloqueos. Nunca cuentan como prueba de que un requisito de ingresos se cumple.
//  S2. Ingresos históricos (requisito «income») y expediciones completadas: no se simula su
//      duración. Se exige, como prueba, al menos una fuente RENOVABLE de ingresos ejecutable
//      en ese estado (premios de expediciones, ingreso del Museo, monografías) y una expedición
//      disponible; sin ella el requisito queda bloqueado.
//  S3. Monografías: solo especies de regiones accesibles que pueden avistarse en algún
//      hábitat, hora y estación de su región (eligibleSpecies), o, en regiones profundas y
//      abisales, por sondeo con su investigación comprada; es decir, que pueden llegar a la etapa 5. El prestigio se limita a esas monografías (+1 cada una); otras fuentes de prestigio
//      no se cuentan.
//  S4. Materiales: un mapa o una preparación solo se fabrica si cada material base tiene una
//      fuente real accesible en ese estado (botín de una expedición disponible, capa cartográfica
//      de una ruta disponible, mercado con Astillero, gabinete de especímenes de una especie
//      accesible o receta con materiales accesibles). La cantidad se supone reunible con
//      repeticiones (S2); si falta la fuente, la fabricación queda bloqueada y se informa.
//  S5. Coleccionables: una pieza cuenta si alguna actividad ejecutable la entrega; el comercio
//      se comprueba generando ofertas reales del mercado durante varios periodos con el rango y
//      la Caravana del estado.
//  S6. Las regiones se visitan con setRegion (regionsVisited) al desbloquearse.
// Si existe una dependencia circular o imposible, la progresión se detiene y se informa.
const LEVEL_NAMES=['shipyard','caravan','workshop','excavations','surveys'];
const ASSUMPTIONS=Object.freeze({
 S1:'Dinero y conocimiento suficientes para costos (no prueban ingresos).',
 S2:'Ingresos y expediciones: se exige una fuente renovable ejecutable; no se simula la duración.',
 S3:'Monografías y prestigio limitados a especies avistables de regiones accesibles (+1 prestigio por monografía).',
 S4:'Mapas y preparaciones: cada material base necesita una fuente real accesible en ese estado.',
 S5:'Coleccionables: actividad ejecutable que los entrega; comercio verificado con ofertas reales generadas.',
 S6:'Regiones visitadas con setRegion al desbloquearse.'
});

function voyagesOpen(h){const g=h.g,s=g.state;return g.VOYAGES.filter(v=>s.upgrades.shipyard&&g.voyageConditions3280(v).every(c=>c.met));}

// Fuentes reales de un material en el estado actual (S4). Devuelve pruebas; [] si no hay.
function materialSources(h,id,ctx=null,seen=new Set()){
 const g=h.g,s=g.state;
 if(seen.has(id))return [];seen.add(id);
 const c=ctx||{voyages:voyagesOpen(h),regions:g.REGIONS.filter(r=>s.regionUnlocked[r.id])};
 const out=[];
 for(const v of c.voyages){
  const table=g.V316_LOOT_BASE.concat(g.V316_LOOT_BY_ROUTE[v.id]||[]);
  if(table.some(([x])=>x===id))out.push('botín · '+v.id);
  if(v.sample===id)out.push('muestra · '+v.id);
 }
 for(const d of g.CARTOGRAPHY3400)if(d.piece===id&&d.routes&&(!d.sourceResearch||s.purchases[d.sourceResearch]>0)){const r=d.routes.find(x=>c.voyages.some(v=>v.id===x));if(r)out.push('capa cartográfica · '+r);}
 if(s.upgrades.shipyard&&Object.hasOwn(g.TRADE_MARKET,id))out.push('mercado · £'+g.TRADE_MARKET[id]);
 if(s.upgrades.specimenDrops){const sp=Object.entries(g.SPECIES_DROPS).find(([sid,item])=>item===id&&c.regions.some(r=>(r.species||[]).includes(sid)));if(sp)out.push('gabinete de especímenes · '+sp[0]);}
 // Canal de materiales de MEC-01 (materiales animales nuevos): especies accesibles que los dejan.
 if(s.upgrades.specimenDrops&&h.A?.speciesOf){const sp=h.A.speciesOf(id).find(sid=>c.regions.some(r=>(r.species||[]).includes(sid)));if(sp)out.push('canal de materiales · '+sp);}
 const rec=g.RECIPES[id];
 if(rec&&Object.keys(rec.requires||{}).every(m=>materialSources(h,m,c,new Set(seen)).length))out.push('receta');
 return out;
}

// Especies que pueden llegar a monografía en las regiones accesibles (S3).
function publishable(h){
 const g=h.g,s=g.state,set=new Set();
 const times=new Set(),seasons=new Set();for(const sp of Object.values(g.SPECIES)){for(const t of sp.times||[])times.add(t);for(const x of sp.seasons||[])seasons.add(x);}
 for(const r of g.REGIONS)if(s.regionUnlocked[r.id])for(const hab of r.habitats)for(const t of times)for(const x of seasons)for(const id of g.eligibleSpecies(r.id,hab,t,x))set.add(id);
 // Especies de regiones profundas y abisales: se obtienen por sondeo (motor GM3330/GM3340), no en el
 // campo; cuentan si la región está accesible y su investigación de sondeo está comprada.
 const deep={profundo:'exploracion_profunda_1',abisal:'exploracion_abisal_1'};
 for(const r of g.REGIONS)if(s.regionUnlocked[r.id]&&deep[r.depthTier]&&s.purchases[deep[r.depthTier]]>0)for(const id of r.species||[])if(g.SPECIES[id])set.add(id);
 return set;
}

// Piezas que aparecen en ofertas reales y ejecutables con el rango y la Caravana actuales (S5).
function commerceReach(h,periods=40){
 const g=h.g,s=g.state,a3=h.x.AtlasMEC03Actions,C=h.x.AtlasCampMEC02,out=new Set();
 if(C.level(s,'caravan')<2)return out;
 const saved=JSON.stringify(s.collectorMarket||null),now0=h.now;
 for(let p=0;p<periods;p++){h.now=now0+p*24*3600e3;for(const o of a3.market(h.now).offers)if(o.kind!=='solicitud'&&C.level(s,'caravan')>=o.level&&!a3.offerBlock(o))out.add(o.piece);}
 h.now=now0;s.collectorMarket=JSON.parse(saved);if(s.collectorMarket===null)delete s.collectorMarket;
 return out;
}

function availability(h){
 const g=h.g,s=g.state,X=h.x.AtlasMEC03,E=h.x.AtlasMEC03Actions.engine,C=h.x.AtlasCampMEC02,S=h.x.AtlasMEC04,a3=h.x.AtlasMEC03Actions;
 const lvl=id=>C.level(s,id),rank=S.rank(s),fx=id=>C.stageOf(id,lvl(id)).effects;
 const regions=g.REGIONS.filter(r=>s.regionUnlocked[r.id]);
 const conts=new Set(regions.map(r=>r.continent));
 const reach=new Map(),mark=(id,how)=>{if(!reach.has(id))reach.set(id,new Set());reach.get(id).add(how);};
 for(const r of regions){
  for(const id of E.ambient(r))mark(id,'campo');
  for(const t of Object.keys(X.PROSPECTIONS))if(lvl('surveys')>=X.PROSPECTIONS[t].minLevel)for(const id of(t==='regional'?E.regional(r):E.geological(r,t)))mark(id,'prospecciones');
 }
 if(s.upgrades.specimenDrops){const seen=new Set();for(const r of regions)for(const sp of r.species||[])if(!seen.has(sp)){seen.add(sp);for(const id of E.observation(sp))mark(id,'observacion');}}
 const voyages=voyagesOpen(h);
 const hk=h.x.AtlasCampMEC02Hooks;
 for(const v of voyages)for(const m of ['normal',...Object.keys(X.VOYAGE_MODALITIES)])if(m==='normal'||hk.modalityAllowed(v,m))for(const id of E.expedition(v.id,m))mark(id,'expediciones');
 const sites=g.MUSEUM_DIG_SITES.filter(x=>s.regionUnlocked[x.region]&&(!x.reqResearch||s.purchases[x.reqResearch]));
 for(const site of sites)for(const m of fx('excavations').modes)for(const id of E.dig(site.id,m))mark(id,'excavaciones');
 for(const id of commerceReach(h))mark(id,'comercio');
 for(const [k,t] of Object.entries(X.PREPARATIONS))if(lvl('workshop')>=t.minWorkshop)for(const id of E.preparation(k,conts,lvl('workshop')>=4?2:1))mark(id,'taller');
 for(const c of a3.commissionList()){const need=S.COMMISSION_RANKS[c.id]||0;if(rank>=need)for(const id of E.reward(c.reward,conts))mark(id,'encargos');}
 return {reach,voyages:voyages.map(v=>v.id),sites:sites.map(x=>x.id),regions:regions.length,
  visited:g.REGIONS.filter(r=>s.regionsVisited?.[r.id]).length,
  prospections:Object.keys(X.PROSPECTIONS).filter(t=>lvl('surveys')>=X.PROSPECTIONS[t].minLevel),
  preparations:Object.keys(X.PREPARATIONS).filter(k=>lvl('workshop')>=X.PREPARATIONS[k].minWorkshop),
  commissions:a3.commissionList().filter(c=>rank>=(S.COMMISSION_RANKS[c.id]||0)).map(c=>c.id)};
}

// Fuentes renovables de ingresos ejecutables en el estado (S2).
function incomeSources(h,av){
 const g=h.g,s=g.state,out=[];
 if(av.voyages.length)out.push('premios de expediciones ('+av.voyages.length+' rutas)');
 if(publishable(h).size)out.push('monografías (£90 cada una)');
 if(Object.keys(s.museum.exhibits||{}).length||publishable(h).size)out.push('ingreso del Museo por muestras expuestas');
 return out;
}

function caps(h,av){
 const g=h.g,s=g.state,CAT=h.A.catalog;
 const pub=publishable(h);
 let collections=0;const completable=[];
 for(const c of CAT.collections.values())if(c.ids.every(id=>av.reach.has(id))){collections++;completable.push(c.name);}
 const income=incomeSources(h,av);
 return {prestige:s.prestige,species:pub.size,monographs:pub.size,collectibles:av.reach.size,
  voyages:av.voyages.length?Infinity:0,research:g.RESEARCH_NODES.filter(n=>s.purchases[n.id]>0).length,
  income:income.length?Infinity:0,regions:av.visited,collections,
  evidence:{income,completable}};
}

function run(h,{maxSteps=80}={}){
 const g=h.g,s=g.state,C=h.x.AtlasCampMEC02,S=h.x.AtlasMEC04,log=[],evidence={materials:{},rank10:null,blockedMaterials:{}};
 h.window.confirm=()=>true;
 const rich=()=>{s.money=1e12;s.knowledge=1e12;};
 // S4: reúne los materiales base de una receta solo si tienen fuente real; si no, informa.
 const gather=(item,need=1)=>{
  const rec=g.RECIPES[item];if(!rec)return false;
  for(const [m,q] of Object.entries(rec.requires||{})){
   if((s.inventory[m]||0)>=q*need)continue;
   if(g.RECIPES[m]){for(let i=0;i<q*need;i++){if(!gather(m))return false;if(!g.craftItem(m))return false;}continue;}
   const src=materialSources(h,m);
   if(!src.length){evidence.blockedMaterials[m]=item;return false;}
   evidence.materials[m]=src;delete evidence.blockedMaterials[m];s.inventory[m]=Math.max(s.inventory[m]||0,q*need);
  }
  return true;
 };
 let av=availability(h),steps=0,changed=true;
 while(changed&&steps++<maxSteps){
  changed=false;rich();
  const pub=publishable(h).size;
  if(s.prestige<pub){s.prestige=pub;changed=true;}
  for(const r of g.REGIONS)if(!s.regionUnlocked[r.id]&&g.regionRequirementsMet(r)){g.unlockRegion(r.id);if(s.regionUnlocked[r.id]){changed=true;log.push('región '+r.id);}}
  // S6: visita real de cada región desbloqueada (registro histórico).
  const here=s.currentRegion;for(const r of g.REGIONS)if(s.regionUnlocked[r.id]&&!s.regionsVisited?.[r.id]){g.setRegion(r.id);if(s.regionsVisited?.[r.id])changed=true;}
  if(s.regionUnlocked[here])g.setRegion(here);
  for(const n of g.RESEARCH_NODES)if(!(s.purchases[n.id]>0)&&g.canBuy(n)){rich();g.buyNode(n.id);if(s.purchases[n.id]>0){changed=true;log.push('investigación '+n.id);}}
  for(const d of g.CARTOGRAPHY3400)if(!(s.inventory[d.map]>0)&&(!d.sourceResearch||s.purchases[d.sourceResearch]>0)){
   if(gather(d.map)&&g.canCraft(d.map)&&g.craftItem(d.map)){changed=true;log.push('mapa '+d.map);}
  }
  if(!(s.inventory.world_map>0)&&g.canCraft('world_map')&&g.craftItem('world_map')){changed=true;log.push('mapa world_map');}
  for(const c of new Set(Object.values(g.CONTINENT_RESEARCH3300)))for(const item of g.craftedRequirements3300(c)||[]){
   if(s.inventory[item]>0||!g.RECIPES[item])continue;
   if(gather(item)&&g.craftItem(item)){changed=true;log.push('preparación '+item);}
  }
  for(const id of LEVEL_NAMES){rich();if(C.check(s,id).ok&&C.upgrade(s,id,h.now).ok){changed=true;log.push('instalación '+id+' '+C.level(s,id));}}
  av=availability(h);
  const cap=caps(h,av);
  const e=S.eligibility(s,cap);
  if(!evidence.firstCollection&&cap.collections>0)evidence.firstCollection={rank:S.rank(s),collections:cap.evidence.completable,levels:{...s.camp.levels}};
  if(e.ok){
   if(e.next.level===10)evidence.rank10={collections:cap.evidence.completable,levels:{...s.camp.levels},rankBefore:S.rank(s),
    sources:Object.fromEntries(cap.evidence.completable.slice(0,3).map(name=>{const c=[...h.A.catalog.collections.values()].find(x=>x.name===name);return [name,Object.fromEntries(c.ids.map(id=>[id,[...av.reach.get(id)]]))];}))};
   S.ascend(s,cap,h.now,null);changed=true;log.push('rango '+S.rank(s));av=availability(h);
  }
 }
 const K=h.x.AtlasMEC03Catalog,final=caps(h,av),e=S.eligibility(s,final);
 return {steps,log,assumptions:ASSUMPTIONS,evidence,rank:S.rank(s),levels:{...s.camp.levels},regions:av.regions,visited:av.visited,totalRegions:g.REGIONS.length,
  research:g.RESEARCH_NODES.filter(n=>s.purchases[n.id]>0).length,totalResearch:g.RESEARCH_NODES.length,
  monographs:final.monographs,totalSpecies:Object.keys(g.SPECIES).length,incomeSources:final.evidence.income,
  pieces:av.reach.size,missingPieces:Object.keys(K.pieces).filter(id=>!av.reach.has(id)),
  voyages:av.voyages,missingVoyages:g.VOYAGES.map(v=>v.id).filter(id=>!av.voyages.includes(id)),
  sites:av.sites,missingSites:g.MUSEUM_DIG_SITES.map(x=>x.id).filter(id=>!av.sites.includes(id)),
  prospections:av.prospections,preparations:av.preparations,commissions:av.commissions,
  blockedBy:e.ok||!e.next?[]:e.missing.map(m=>m.key+' '+m.have+'/'+m.need)};
}

// MEC-06 · auditoría del Taller sobre el estado final de run(): artefactos, componentes, niveles,
// estudios, demostraciones y dependencias circulares. Estructural (S4): las CANTIDADES de materiales
// se asignan solo si el material tiene una fuente real; no es una simulación de duración.
function workshopAudit(h,{exercise=true}={}){
 const g=h.g,s=g.state,X6=h.x.AtlasMEC06,A6=h.x.AtlasMEC06Actions,C=h.x.AtlasCampMEC02,report={levels:[],artifacts:{},studies:{},demos:{},cycles:[],components:{},assumption:'S4: cantidades sintéticas solo para materiales con fuente real'};
 h.window.confirm=()=>true;
 for(let l=1;l<=5;l++){const st=C.stageOf('workshop',l);report.levels.push({level:l,cost:st.cost,items:Object.keys(st.cost||{}).filter(k=>!['money','knowledge'].includes(k))});}
 const leaves=(id,seen=new Set())=>{if(seen.has(id))return {cycle:[...seen,id]};seen.add(id);const r=g.RECIPES[id];if(!r)return {leaves:[id]};let out=[];for(const m of Object.keys(r.requires||{})){const x=leaves(m,new Set(seen));if(x.cycle)return x;out=out.concat(x.leaves);}return {leaves:out};};
 const level=id=>{const r=g.RECIPES[id];if(!r)return 1;return Math.max(Math.max(1,Number(r.minWorkshop)||1),...Object.keys(r.requires||{}).map(level));};
 // Ninguna receta exige un artefacto ni un producto que solo dé un estudio con instrumento.
 const artifactIds=new Set(Object.keys(X6.ARTIFACTS));
 for(const [id,r] of Object.entries(g.RECIPES))for(const m of Object.keys(r.requires||{}))if(artifactIds.has(m))report.cycles.push(id+' exige el artefacto '+m);
 for(const [id,c] of Object.entries(X6.COMPONENTS)){const l=leaves(id);report.components[id]={recipe:g.RECIPES[id]?.requires,minWorkshop:g.RECIPES[id]?.minWorkshop,leaves:l.leaves||null,sources:Object.fromEntries((l.leaves||[]).map(x=>[x,materialSources(h,x)])),cycle:l.cycle||null};if(l.cycle)report.cycles.push(l.cycle.join(' → '));}
 for(const a of Object.values(X6.ARTIFACTS)){
  const p=g.MUSEUM_COLLECTIONS.find(x=>x.id===a.id);let lv=a.minWorkshop;const missing=[];
  for(const m of Object.keys(p.requires)){lv=Math.max(lv,level(m));const l=leaves(m);if(l.cycle)report.cycles.push(l.cycle.join(' → '));for(const x of l.leaves||[])if(!materialSources(h,x).length)missing.push(x);}
  // Prohibido: el artefacto exige un componente que solo se obtiene con ese mismo artefacto.
  for(const m of Object.keys(p.requires))if(!g.RECIPES[m]&&!materialSources(h,m).length&&Object.values(X6.STUDIES).some(t=>t.reward.items?.[m]&&Object.keys(t.instruments).some(k=>k.split('|').includes(a.id))))report.cycles.push(a.id+' exige '+m+', que solo produce su propio estudio');
  report.artifacts[a.id]={effectiveWorkshop:lv,configured:a.minWorkshop,missing:[...new Set(missing)],ok:!missing.length&&lv<=5};
 }
 for(const t of Object.values(X6.STUDIES)){
  const inst=Object.keys(t.instruments).map(k=>k.split('|')),missing=[];
  for(const alts of inst)if(!alts.some(x=>report.artifacts[x]?.ok))missing.push(alts.join('|'));
  for(const m of Object.keys(t.requires))if(!g.RECIPES[m]&&!materialSources(h,m).length)missing.push(m);
  if(t.group){const ok=X6.ANIMAL_GROUPS[t.group.id].ids.filter(x=>materialSources(h,x).length);if(!ok.length)missing.push('grupo '+t.group.id);}
  report.studies[t.id]={ok:!missing.length,missing,minWorkshop:t.minWorkshop};
 }
 for(const d of Object.values(X6.DEMOS))report.demos[d.id]={ok:!!report.artifacts[d.artifact]?.ok&&Object.keys(d.requires).every(m=>g.RECIPES[m]||materialSources(h,m).length)};
 if(exercise){
  // Ejercicio real del motor: fabricar, instalar, estudiar y demostrar con cantidades sintéticas.
  s.money=1e12;s.knowledge=1e12;s.society.rank=Math.max(s.society.rank||1,20);
  while(C.level(s,'workshop')<5)if(!C.upgrade(s,'workshop',h.now).ok)break;
  const give=(id,qty=1)=>{const l=leaves(id);for(const x of l.leaves||[id])if(materialSources(h,x).length)s.inventory[x]=Math.max(s.inventory[x]||0,60);if(g.RECIPES[id])for(let i=0;(s.inventory[id]||0)<qty&&i<qty;i++)g.craftItem(id);};
  report.built=[];
  for(const a of Object.values(X6.ARTIFACTS)){const p=g.MUSEUM_COLLECTIONS.find(x=>x.id===a.id);for(const m of Object.keys(p.requires))give(m);if(A6.location(a.id)||A6.buildArtifact(a.id))report.built.push(a.id);}
  for(const [id,place] of [['microscopio_compuesto','taller'],['telescopio_astronomico','taller'],['camara_oscura','taller'],['pila_volta','taller'],['galvanometro','taller'],['induccion_farad','taller']]){if(A6.location(id)!==place)A6.setLocation(id,place);}
  report.ran=[];
  const runAll=()=>{for(const t of Object.values(X6.STUDIES)){for(const [m,q] of Object.entries(t.requires))give(m,q);if(t.group)for(const x of X6.ANIMAL_GROUPS[t.group.id].ids)if(materialSources(h,x).length)s.inventory[x]=Math.max(s.inventory[x]||0,10);
   for(const [ids,place] of Object.entries(t.instruments)){const first=ids.split('|')[0];if(!ids.split('|').some(x=>A6.location(x)===place)){const out=Object.entries(s.mec06.installed).find(([k,p])=>p===place&&!Object.keys(t.instruments).some(z=>z.split('|').includes(k)));if(A6.capacity(place)<=Object.values(s.mec06.installed).filter(p=>p===place).length&&out)A6.setLocation(out[0],'almacen');A6.setLocation(first,place);}}
   if(!report.ran.includes(t.id)&&A6.runStudy(t.id,h.now))report.ran.push(t.id);}};
  runAll();
  for(const d of Object.values(X6.DEMOS)){if(A6.location(d.artifact)!=='museo')A6.setLocation(d.artifact,'museo');for(const [m,q] of Object.entries(d.requires))give(m,q);if(A6.runDemo(d.id,h.now))report.ran.push(d.id);}
 }
 report.notApplicable=Object.keys(X6.STUDIES).filter(id=>X6.STUDIES[id].reward.mapPiece&&!A6.mapTarget()).map(id=>id+': todos los mapas continentales ya están fabricados en el estado final');
 report.ok=!report.cycles.length&&Object.values(report.artifacts).every(a=>a.ok)&&Object.values(report.studies).every(x=>x.ok)&&Object.values(report.demos).every(x=>x.ok);
 return report;
}

// MEC-07 · auditoría de récords naturales y conductas. Comprueba con el catálogo cargado: especie,
// regiones válidas, condiciones ambientales compatibles, método de observación, instrumento
// accesible, plausibilidad del modelo, probabilidad positiva y un caso testigo con el motor real
// (encuentros reales con semilla reproducible). No es una simulación económica ni temporal.
function recordsAudit(h,{witness=true,maxSearches=25000,progress=true}={}){
 const g=h.g,s=g.state,X7=h.x.AtlasMEC07;
 // Estado de partida: la progresión real de run() (regiones, investigaciones, mapas); así los
 // instrumentos y los sondeos se evalúan con su accesibilidad real, no con permisos sintéticos.
 const prog=progress?run(h):null;const w=workshopAudit(h,{exercise:false});const out0={progress:prog&&{rank:prog.rank,regions:prog.visited,research:prog.research}};
 const out={...out0,entries:{},ok:true,assumption:'Testigos: tras la progresión real, se fijan región, hábitat, hora y estación (sintético); el resultado es el del motor real.'};
 const times=new Set(),seasons=new Set();for(const sp of Object.values(g.SPECIES)){for(const t of sp.times||[])times.add(t);for(const x of sp.seasons||[])seasons.add(x);}
 const entries=[...X7.RECORDS.map(e=>['record',e]),...X7.BEHAVIORS.map(e=>['behavior',e])];
 for(const [kind,e] of entries){
  const sp=g.SPECIES[e.species],c=e.conditions||{},problems=[];
  if(!sp)problems.push('especie inexistente');
  const regions=g.REGIONS.filter(r=>(r.species||[]).includes(e.species));
  if(!regions.length)problems.push('sin región');
  const deepRegs=regions.filter(r=>g.deepRegionIndex3330.has(r.id)),fieldRegs=regions.filter(r=>!g.deepRegionIndex3330.has(r.id));
  const usable=c.deep===true?deepRegs:c.deep===false?fieldRegs:regions;
  if(!usable.length)problems.push('sin región compatible con el método ('+(c.deep?'sondeo':'campo')+')');
  const tOK=(sp?.times||[]).filter(t=>!c.times||c.times.includes(t)),sOK=(sp?.seasons||[]).filter(x=>!c.seasons||c.seasons.includes(x));
  const hOK=usable.flatMap(r=>(sp?.habitats||[]).filter(hh=>r.habitats.includes(hh)&&(!c.habitats||c.habitats.includes(hh))).map(hh=>[r.id,hh]));
  if(!tOK.length)problems.push('sin horario compatible');if(!sOK.length)problems.push('sin estación compatible');if(!hOK.length&&c.deep!==true)problems.push('sin bioma compatible');
  if(!(e.chance.manual>0&&e.chance.auto>0))problems.push('probabilidad no positiva');
  let plaus=null;
  if(kind==='record'){
   const b=e.bounds,r=X7.rng('audit|'+e.id);let hits=0,min=Infinity,max=-Infinity;const rutas=e.model.basis==='rutas';const need=e.model.kind==='evidencia-regiones'?(rutas?e.model.required.length:Math.ceil((e.threshold-e.model.firstRegion)/e.model.perRegion)+1):0;
   const routeIds=rutas?Object.values(e.model.zones).flat().filter(id=>usable.some(r=>r.id===id)):[];if(rutas&&!X7.routeZones(e,routeIds).complete)problems.push('zonas de ruta no cubiertas por regiones accesibles');
   for(let i=0;i<20000;i++){const v=X7.generate(e,r,{evidenceRegions:need||1,evidenceRegionIds:routeIds});if(v<min)min=v;if(v>max)max=v;if(X7.meets(e,v))hits++;}
   if(min<b.min||max>b.max)problems.push('valores fuera de límites');
   if(!(b.min<b.max)||e.threshold<b.min||e.threshold>b.max)problems.push('umbral fuera de límites');
   if(e.model.kind==='evidencia-regiones'&&regions.length<need)problems.push('regiones insuficientes para la evidencia ('+regions.length+'/'+need+')');
   if(!hits)problems.push('umbral inalcanzable');
   plaus={min,max,pThreshold:hits/20000,regionsNeeded:need||null};
   if(e.instrument&&!w.artifacts[e.instrument.id]?.ok)problems.push('instrumento no fabricable: '+e.instrument.id);
  }
  out.entries[e.id]={kind,species:e.species,regions:usable.map(r=>r.id),times:tOK,seasons:sOK,habitats:[...new Set(hOK.map(x=>x[1]))],plausibility:plaus,problems};
  if(problems.length)out.ok=false;
 }
 if(witness){
  out.deepReady={deepUnlocked:!!s.upgrades.deepUnlocked,abyssalUnlocked:!!s.upgrades.abyssalUnlocked,soundingKit:s.craftedItems?.sounding_kit===true};
  const X3=h.x.AtlasMEC07Actions;let at=1790000000000+12345;
  for(const [kind,e] of entries){
   const info=out.entries[e.id];if(info.problems.length)continue;
   const store=()=>kind==='record'?s.naturalRecords.records[e.id]:s.naturalRecords.behaviors[e.id];
   const startCount=store()?.count||0;let searches=0;
   const rid=info.regions[0],deep=g.deepRegionIndex3330.has(rid),hab=info.habitats[0]||g.REGIONS.find(r=>r.id===rid).habitats[0];
   while((store()?.count||0)===startCount&&searches<maxSearches){
    searches++;at+=61000;
    if(deep){const seg={at,currentRegion:rid,season:info.seasons[0],habitat:hab,time:info.times[0],method:s.deepSurvey?.method||'sonda',interval:60000,end:at};
     g.encounter('auto',at,true,{segment:seg,species:[e.species],choices:[e.species],weight:()=>1,hits:0});}
    else{s.currentRegion=rid;s.habitat=hab;s.time=info.times[0];s.season=info.seasons[0];g.encounter('manual',at,true);}
   }
   info.witness={searches,ok:(store()?.count||0)>startCount,region:rid,habitat:hab,time:info.times[0],season:info.seasons[0],method:deep?'sondeo (automático)':'manual'};
   if(!info.witness.ok){info.problems.push('testigo sin resultado en '+maxSearches+' búsquedas');out.ok=false;}
  }
 }
 return out;
}
module.exports={run,availability,caps,materialSources,publishable,commerceReach,workshopAudit,recordsAudit,ASSUMPTIONS};
