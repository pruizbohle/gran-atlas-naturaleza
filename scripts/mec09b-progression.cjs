'use strict';
// MEC-09B · Controlador de progresión funcional (sección 30).
// Parte de la partida nueva REAL (estado inicial del juego: sin dinero, inventario, investigaciones ni
// especies añadidos) y ejecuta solo operaciones del motor disponibles para el jugador: búsquedas manuales
// y automáticas, elección de región, hábitat, horario y estación, Cuaderno, monografías, subvención, canje
// de notas, investigaciones, fabricación, desbloqueo y viaje, Museo, Campamento, Sociedad, expediciones,
// comercio, excavaciones, prospecciones, sondeos y encargos. Las acciones de interfaz se ejecutan por su
// manejador real (mec02Action). El reloj es virtual (Date.now del arnés): costos, probabilidades y
// recompensas son los del juego. La semilla es reproducible; NO representa a un jugador promedio ni
// estima duraciones (eso es BAL-01). Las decisiones son una política codiciosa documentada abajo.
// Uso: node scripts/mec09b-progression.cjs [semilla] [pasos]
const fs=require('node:fs'),path=require('node:path');
const {make}=require('../tests/helpers/mec01-game.cjs');
function rngWith(seed=29){let x=seed>>>0;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
const FAC=['shipyard','caravan','workshop','excavations','surveys'];

// resume: {raw, log, at} continúa una ejecución anterior desde su estado guardado (mismas reglas; los
// hitos y acciones se acumulan). No es una ayuda: el estado procede del propio controlador.
function run({seed=29,maxSteps=4000,full=true,now=Date.UTC(2027,2,1,12),searches=12,stepMinutes=30,snapshots=null,onStep=null,resume=null}={}){
 const h=make({now:resume?resume.at:now,headless:true,full,rng:rngWith(seed+(resume?resume.log.final.step:0)),...(resume?{store:{gran_atlas_v05:resume.raw}}:{})});h.window.confirm=()=>true;
 const g=h.g,s=g.state,x=h.x,C=x.AtlasCampMEC02,S4=x.AtlasMEC04,K=x.AtlasMEC03Catalog;
 const count=o=>Object.keys(o||{}).filter(k=>o[k]).length;
 const log={seed,policy:'codiciosa: subvención → región con más especies pendientes y sus mejores condiciones → búsquedas manuales → Cuaderno y monografías → investigaciones (más baratas primero) → fabricación de lo pendiente → desbloqueos → Museo → Campamento → ascenso → expediciones según piezas de mapa necesarias → comercio → excavaciones, prospecciones y sondeos → encargos → avance de reloj',
  initial:{money:s.money,knowledge:s.knowledge,prestige:s.prestige,region:s.currentRegion,discovered:count(s.discovered),purchases:count(s.purchases),inventory:Object.values(s.inventory||{}).reduce((a,b)=>a+(b||0),0),unlocked:Object.keys(s.regionUnlocked).filter(k=>s.regionUnlocked[k]),helpers:s.helpers||0},
  milestones:[],actions:{},blocks:[],decisions:[],snapshots:{}};
 let step=0;
 if(resume){const L=resume.log;Object.assign(log,{initial:L.initial,milestones:[...L.milestones],actions:{...L.actions},blocks:[...(L.blocks||[])],decisions:[...(L.decisions||[]),{step:L.final.step,decision:'reanudación desde el punto de control '+L.final.step+' (mismo estado guardado, política ampliada con objetivos de material)'}],resumedFrom:L.final.step});step=L.final.step;now=resume.start;}const act=k=>{log.actions[k]=(log.actions[k]||0)+1;};
 const snap=()=>({step,day:+((h.now-now)/864e5).toFixed(2),money:Math.round(s.money),knowledge:Math.round(s.knowledge),prestige:Math.round(s.prestige),discovered:count(s.discovered),published:count(s.published),regions:count(s.regionUnlocked),visited:count(s.regionsVisited),purchases:count(s.purchases),rank:S4?S4.rank(s):null,pieces:Object.keys(s.collectionRegistry?.pieces||{}).length,camp:FAC.map(k=>C.level(s,k)).join('/'),wing:s.museum.wing});
 const summary=()=>({...snap(),continents:[...new Set(g.REGIONS.filter(r=>s.regionUnlocked[r.id]).map(r=>r.continent))],crafted:Object.keys(s.craftedItems||{}).filter(k=>s.craftedItems[k]),camp:s.camp?.levels||null,earned:s.moneyLedger?.bySource||{},collectionsComplete:(()=>{const cols={};for(const p of Object.values(K.pieces))(cols[p.collection]=cols[p.collection]||[]).push(p.id);return Object.values(cols).filter(l=>l.every(id=>s.collectionRegistry?.pieces?.[id])).length;})(),legendary:count(s.legendaryFound),relicts:Object.keys(s.museum?.relicts||{}).length,records:Object.keys(s.naturalRecords?.records||{}).length,behaviors:Object.keys(s.naturalRecords?.behaviors||{}).length});
 const ms=(id,detail='')=>{if(log.milestones.some(m=>m.id===id))return;log.milestones.push({id,detail,...snap()});if(snapshots&&snapshots[id])log.snapshots[id]=JSON.stringify(s);};
 const stage=id=>s.stages?.[id]||0;
 const accessible=()=>g.REGIONS.filter(r=>g.regionAccessible(r));
 const bestConditions=r=>{let best=null;for(const season of ['primavera','verano','otono','invierno'])for(const hab of r.habitats)for(const time of ['amanecer','dia','atardecer','noche']){const l=g.eligibleSpecies(r.id,hab,time,season);const need=l.filter(id=>!s.discovered[id]||stage(id)<5).length;if(!best||need>best.need)best={season,hab,time,need,n:l.length};}return best;};
 // Materiales animales que faltan para las preparaciones continentales (y sus subrecetas): especie que los da.
 // Preparaciones pendientes y los intermedios que faltan en el inventario (aunque ya se fabricaran antes:
 // p. ej. el morral reforzado se consume en el abrigo polar y vuelve a hacer falta para el kit de sondeo).
 const gateItems=()=>{const out=[];const add=(id,top)=>{if(!g.RECIPES[id]||out.includes(id))return;if(top&&s.craftedItems?.[id])return;
   for(const [m,n] of Object.entries(g.RECIPES[id].requires||{}))if(g.RECIPES[m]&&(s.inventory[m]||0)<n)add(m,false);out.push(id);};
  for(const r of Object.values(g.CONTINENT_RULES3300))for(const it of r.items||[])add(it,true);add('sounding_kit',true);return out;};
 const materialTarget=()=>{const drops=g.SPECIES_DROPS||{};for(const id of gateItems())for(const [m,n] of Object.entries(g.RECIPES[id].requires||{})){if((s.inventory[m]||0)>=n||g.RECIPES[m])continue;
   const sp=Object.keys(drops).find(k=>drops[k]===m);if(!sp)continue;for(const r of accessible())if(r.species.includes(sp))for(const season of ['primavera','verano','otono','invierno'])for(const hab of r.habitats)for(const time of ['amanecer','dia','atardecer','noche'])if(g.eligibleSpecies(r.id,hab,time,season).includes(sp))return {region:r,cond:{season,hab,time,need:1},material:m,species:sp};}
  return null;};
 // Piezas de mapa que hacen falta ahora (según la próxima investigación continental sin comprar).
 const neededPieces=()=>{const out=new Set();for(const [rid] of Object.entries(g.CONTINENT_RESEARCH3300)){if(s.purchases[rid])continue;const n=g.RESEARCH_NODES.find(n=>n.id===rid);const m=n?.reqItem;if(m&&!(s.inventory[m]>0)&&g.RECIPES[m])for(const p of Object.keys(g.RECIPES[m].requires))if(/_map_piece$/.test(p))out.add(p);}
  for(const m of Object.values(g.CARTOGRAPHIC_GATES3400))if(!s.craftedItems?.[m]&&g.RECIPES[m])for(const p of Object.keys(g.RECIPES[m].requires))if(/_map_piece$/.test(p))out.add(p);return out;};
 const voyageScore=v=>{const need=neededPieces(),loot=g.V316_LOOT_BY_ROUTE[v.id]||[];let sc=v.cost/1000;for(const [it,w] of loot)if(need.has(it))sc+=w*10;const layer=(x.AtlasItemSources?[]:[]);return sc+(layer.length);};
 const canSail=v=>{try{return g.voyageConditions3280(v).every(c=>c.met)&&s.voyages.length<2+(s.upgrades.fleet||0)&&s.money>=v.cost&&s.knowledge>=(v.knowledge||0)&&s.prestige>=(v.required||0);}catch(_){return false;}};
 let stall=0,lastScore=-1;
 const score=()=>count(s.discovered)*3+count(s.published)*5+count(s.purchases)*7+count(s.regionUnlocked)*11+count(s.craftedItems)*13+FAC.reduce((t,k)=>t+C.level(s,k),0)*5+(S4?S4.rank(s)*17:0)+Object.keys(s.collectionRegistry?.pieces||{}).length+(s.museum.wing||1)*9+Object.keys(s.inventory||{}).filter(k=>/_map_piece$/.test(k)).reduce((t,k)=>t+s.inventory[k],0);
 while(step<maxSteps){
  step++;
  const m0=s.money;g.requestGrant();if(s.money>m0){act('subvencion');ms('primera-subvencion');}
  // Región: la accesible con más especies pendientes (incluye continentes recién abiertos).
  let target=null,cond=null;for(const r of accessible()){const b=bestConditions(r);if(b&&(!cond||b.need>cond.need)){target=r;cond=b;}}
  // Sin especies pendientes por búsqueda: presencias profundas sin descubrir (estrato, horario y método de la presencia).
  let deepT=null;if(!cond||cond.need===0){for(const r of accessible()){if(!g.deepReady3330?.(r.id))continue;const ps=g.deepPresenceIndex3330?.get(r.id)||[],p=ps.find(p=>!s.discovered[p.speciesId])||ps.find(p=>stage(p.speciesId)<5||!s.published[p.speciesId]);
   if(p){deepT={region:r,p,method:['sondeo','muestreo','extraordinario'].find(m=>p.methods.includes(m))};target=r;cond={season:p.seasons[0],hab:p.habitats[0],time:p.times[0],need:1};break;}}}
  // Material de una preparación continental pendiente: se busca a la especie que lo proporciona.
  const mt=materialTarget();if(mt){target=mt.region;cond=mt.cond;if(!log.decisions.some(d=>d.material===mt.material))log.decisions.push({step,material:mt.material,species:mt.species,region:mt.region.id});}
  if(target&&s.currentRegion!==target.id){g.setRegion(target.id);if(s.currentRegion===target.id){act('viaje');ms('viaje-'+target.continent);}}
  if(cond){Object.assign(s,{season:cond.season,habitat:cond.hab,time:cond.time});}
  for(let i=0;i<searches;i++){h.now+=4000;const d0=count(s.discovered);g.encounter('manual',h.now,false);act('busqueda-manual');if(count(s.discovered)>d0)ms('primer-avistamiento');}
  // Cuaderno y monografías.
  for(const id of Object.keys(s.discovered)){if(!g.SPECIES[id])continue;for(let k=0;k<5;k++){const st=stage(id);g.advanceSpecies(id);if(stage(id)>st){act('etapa');ms('primera-etapa');}else break;}
   if(stage(id)>=5&&!s.published[id]){g.publishMonograph(id);if(s.published[id]){act('monografia');ms('primera-monografia');}}}
  // Canje de notas: el conocimiento sobrante (por encima de una reserva de 8.000) se convierte en dinero.
  // La reserva sube a 15.000 mientras quede algún nivel V del Campamento (cuesta 12.000 de conocimiento).
  const reserve=FAC.some(k=>C.level(s,k)<5)&&S4&&S4.rank(s)>=9?15000:8000;
  for(let i=0;i<400&&s.knowledge>reserve;i++){g.exchangeNotes();act('canje-notas');}
  // Investigaciones: continentales primero cuando son comprables; luego las más baratas.
  const nodes=[...g.RESEARCH_NODES].sort((a,b)=>(g.CONTINENT_RESEARCH3300[b.id]?1:0)-(g.CONTINENT_RESEARCH3300[a.id]?1:0)||(a.money||0)-(b.money||0));
  for(const n of nodes)if(!s.purchases[n.id]&&g.canBuy(n)){g.buyNode(n.id);if(s.purchases[n.id]){act('investigacion');ms('primera-investigacion');if(g.CONTINENT_RESEARCH3300[n.id])ms('investigacion-'+g.CONTINENT_RESEARCH3300[n.id]);if((s.helpers||0)>0)ms('naturalista-contratado');}}
  // Fabricación: lo no fabricado aún (mapas, equipo, componentes, artefactos de exploración).
  for(const id of gateItems())if(g.canCraft(id)&&g.craftItem(id)){act('fabricacion-preparacion');ms('preparacion-'+id);}
  for(const id of Object.keys(g.RECIPES))if(!s.craftedItems?.[id]&&g.canCraft(id)){if(g.craftItem(id)){act('fabricacion');ms('primera-receta');if(/_map$/.test(id))ms('mapa-'+id);}}
  for(const r of g.REGIONS)if(!s.regionUnlocked[r.id]&&g.regionRequirementsMet(r)){g.unlockRegion(r.id);if(s.regionUnlocked[r.id]){act('desbloqueo');ms('region-'+r.continent);}}
  if(g.expandMuseum()){act('museo-ampliacion');ms('museo-nivel-'+s.museum.wing);}
  for(const id of Object.keys(s.discovered)){if(Object.keys(s.museum.exhibits||{}).length>=g.museumCapacity())break;if(!s.museum.exhibits?.[id]&&g.exhibitAnimal(id)){act('exhibicion');ms('primera-exhibicion');}}
  for(const k of FAC){const l0=C.level(s,k);g.mec02Action('mec02-upgrade',k);if(C.level(s,k)>l0){act('campamento');ms('campamento-'+k+'-'+C.level(s,k));}}
  if(S4){const r0=S4.rank(s);g.mec02Action('mec04-ascend','');if(S4.rank(s)>r0){act('ascenso');ms('rango-'+S4.rank(s));}}
  // Expediciones: llenar la flota con la ruta que más aporta a las piezas necesarias.
  for(let i=0;i<4;i++){const v=[...g.VOYAGES].filter(canSail).sort((a,b)=>voyageScore(b)-voyageScore(a))[0];if(!v||!g.sail(v.id))break;act('expedicion');ms('primera-expedicion');ms('expedicion-'+v.id);}
  // Comercio, excavaciones, prospecciones de relictos y prospecciones MEC-04, sondeos.
  for(const r of g.TRADE_ROUTES||[])if(g.tradeCanStart3300?.(r.id)){if(g.startTrade3300(r.id)){act('comercio');ms('primera-ruta-comercial');}break;}
  if((s.museum.excavations||[]).length<(g.maxExcavations?.()||1)){const site=g.MUSEUM_DIG_SITES.find(d=>g.canStartExcavation(d.id));if(site&&g.startExcavation(site.id)){act('excavacion');ms('primera-excavacion');}}
  for(const j of [...(s.museum.excavations||[])])if(j.endAt<=h.now&&g.collectExcavation(j.id,h.now))act('excavacion-recogida');
  for(const r of g.MUSEUM_RELICTS)if(g.canStartRelictSurvey?.(r.id)){if(g.startRelictSurvey(r.id)){act('prospeccion-relicto');ms('primera-prospeccion-relicto');}break;}
  for(const j of [...(s.museum.relictSurveys||[])])if(j.endAt<=h.now&&g.collectRelictSurvey(j.id,h.now))act('prospeccion-relicto-recogida');
  if(x.AtlasMEC03?.PROSPECTIONS&&C.level(s,'surveys')>=1){s.mec03Region=s.currentRegion;for(const k of Object.keys(x.AtlasMEC03.PROSPECTIONS)){const n0=(s.prospections?.jobs||[]).length;g.mec02Action('mec03-prospect',k);if((s.prospections?.jobs||[]).length>n0){act('prospeccion');ms('primera-prospeccion');break;}}}
  for(const j of [...(s.prospections?.jobs||[])])if(j.endAt<=h.now){g.mec02Action('mec03-prospect-collect',String(j.id));act('prospeccion-recogida');}
  if(g.deepRegionIndex3330?.has(s.currentRegion)){const pref=deepT&&deepT.region.id===s.currentRegion?[deepT.method]:[];for(const m of [...pref,...Object.keys(g.DEEP_METHODS3330)])if(g.canStartDeep3330(m)){if(g.startDeep3330(m)){act('sondeo');ms('primer-sondeo');if(m!=='sondeo')ms('primer-'+m);}break;}}
  // Encargos permanentes listos.
  for(const d of x.AtlasCommissions3370?.catalog||[])if(s.commissions?.ready?.[d.id]&&!s.commissions?.claimed?.[d.id]){if(g.commissionClaim3370(d.id)){act('encargo');ms('primer-encargo');}}
  // Reloj.
  h.now+=stepMinutes*60e3;g.tick();for(let i=0;i<5&&s.autoPending?.length;i++)g.processAutomaticSearches();
  if(Object.keys(s.collectionRegistry?.pieces||{}).length)ms('primer-coleccionable');
  if(s.museum.voyagesCompleted>0)ms('primera-expedicion-liquidada');
  if(onStep){log.snapFn=summary;onStep(step,s,g,x,ms,log);}
  const sc=score();if(sc>lastScore){lastScore=sc;stall=0;}else if(++stall>=80){
   const next=nodes.filter(n=>!s.purchases[n.id]).slice(0,4).map(n=>({id:n.id,money:n.money,knowledge:n.knowledge,req:n.req,reqItem:n.reqItem,canBuy:g.canBuy(n)}));
   const locked=[...new Set(g.REGIONS.filter(r=>!s.regionUnlocked[r.id]).map(r=>r.continent))].map(c=>{const r=g.REGIONS.find(z=>z.continent===c&&!s.regionUnlocked[z.id]);return {continent:c,region:r.id,met:g.regionRequirementsMet(r)};});
   log.blocks.push({...snap(),next,locked,neededPieces:[...neededPieces()],inventoryPieces:Object.fromEntries(Object.entries(s.inventory).filter(([k,v])=>/_map_piece$|_map$/.test(k)&&v>0))});stall=0;if(log.blocks.length>=4)break;}
 }
 log.final=summary();
 delete log.snapFn;
 return {log,h};
}
module.exports={run};
if(require.main===module){
 const seed=Number(process.argv[2]||29),steps=Number(process.argv[3]||4000);
 const want={'rango-3':1,'region-Asia':1,'region-África':1,'rango-7':1,'rango-10':1,'rango-12':1,'region-Norteamérica':1,'region-Sudamérica':1,'region-Oceanía':1,'region-Polos':1,'region-Océanos':1,'mapa-world_map':1};
 const t=Date.now(),dir=path.join(__dirname,'..','docs','mec09b');fs.mkdirSync(dir,{recursive:true});fs.mkdirSync('/tmp/mec09b-snapshots',{recursive:true});
 // Punto de control cada 200 pasos: registro parcial y estado actual (una ejecución larga no se pierde).
 const save=(log,state,partial)=>{const L={...log,partial,wallSeconds:Math.round((Date.now()-t)/1000)};const snaps=L.snapshots||{};delete L.snapshots;delete L.finalState;
  fs.writeFileSync(path.join(dir,'progresion-controlador-'+seed+'.json'),JSON.stringify(L,null,1)+'\n');for(const [k,v] of Object.entries(snaps))fs.writeFileSync('/tmp/mec09b-snapshots/'+seed+'-'+k+'.json',v);
  fs.writeFileSync('/tmp/mec09b-snapshots/'+seed+'-final.json',JSON.stringify(state));};
 let cur=null;
 // node scripts/mec09b-progression.cjs SEMILLA PASOS reanudar → continúa desde el último punto de control.
 let resume=null;if(process.argv[4]==='reanudar'){const L=JSON.parse(fs.readFileSync(path.join(dir,'progresion-controlador-'+seed+'.json'),'utf8')),start=Date.UTC(2027,2,1,12);
  resume={log:L,raw:fs.readFileSync('/tmp/mec09b-snapshots/'+seed+'-final.json','utf8'),start,at:start+Math.round(L.final.day*864e5)+60e3};}
 const {log,h}=run({seed,maxSteps:steps,snapshots:want,resume,onStep:(st,s,g,x,ms,lg)=>{if(st%100===0)process.stderr.write('paso '+st+' · '+JSON.stringify({d:Object.keys(s.discovered).length,r:Object.keys(s.regionUnlocked).length,m:Math.round(s.money)})+'\n');if(st%200===0&&lg){lg.final=lg.snapFn();save(lg,s,true);}}});
 save(log,h.g.state,false);
 console.log(JSON.stringify({final:log.final,blocks:log.blocks,milestones:log.milestones.map(m=>m.id+'@'+m.step)},null,0).slice(0,6000));
}
