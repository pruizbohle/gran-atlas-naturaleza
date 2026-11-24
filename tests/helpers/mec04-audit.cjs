'use strict';
// MEC-04 · auditoría estructural de dependencias y accesibilidad.
// Recorre la progresión con las funciones reales del motor (desbloqueo de regiones,
// investigaciones, fabricación de mapas, mejoras de instalaciones con su rango, ascensos)
// y, en cada estado, calcula qué piezas, rutas, yacimientos, prospecciones, ofertas,
// recetas y encargos están efectivamente disponibles. No es una simulación de tiempo:
//  · el dinero y el conocimiento se suponen suficientes (recursos, no desbloqueos);
//  · el prestigio y las monografías se limitan a las especies de las regiones accesibles;
//  · las partes de mapas continentales históricos se suponen obtenibles (contenido histórico)
//    y el mapa se fabrica con su receta real;
//  · un rango solo se reconoce si sus requisitos caben en lo que el estado permite obtener.
// Si existe una dependencia circular o imposible, la progresión se detiene y se informa.
const LEVEL_NAMES=['shipyard','caravan','workshop','excavations','surveys'];

function availability(h){
 const g=h.g,s=g.state,X=h.x.AtlasMEC03,K=h.x.AtlasMEC03Catalog,E=h.x.AtlasMEC03Actions.engine,C=h.x.AtlasCampMEC02,S=h.x.AtlasMEC04,a3=h.x.AtlasMEC03Actions;
 const P=K.pieces,lvl=id=>C.level(s,id),rank=S.rank(s),fx=id=>C.stageOf(id,lvl(id)).effects;
 const regions=g.REGIONS.filter(r=>s.regionUnlocked[r.id]);
 const conts=new Set(regions.map(r=>r.continent));
 const reach=new Map(),mark=(id,how)=>{if(!reach.has(id))reach.set(id,new Set());reach.get(id).add(how);};
 for(const r of regions){
  for(const id of E.ambient(r))mark(id,'campo');
  for(const t of Object.keys(X.PROSPECTIONS))if(lvl('surveys')>=X.PROSPECTIONS[t].minLevel)for(const id of(t==='regional'?E.regional(r):E.geological(r,t)))mark(id,'prospecciones');
 }
 if(s.upgrades.specimenDrops){const seen=new Set();for(const r of regions)for(const sp of r.species||[])if(!seen.has(sp)){seen.add(sp);for(const id of E.observation(sp))mark(id,'observacion');}}
 const voyages=g.VOYAGES.filter(v=>s.upgrades.shipyard&&g.voyageConditions3280(v).every(c=>c.met));
 const hk=h.x.AtlasCampMEC02Hooks;
 for(const v of voyages)for(const m of ['normal',...Object.keys(X.VOYAGE_MODALITIES)])if(m==='normal'||hk.modalityAllowed(v,m))for(const id of E.expedition(v.id,m))mark(id,'expediciones');
 const sites=g.MUSEUM_DIG_SITES.filter(x=>s.regionUnlocked[x.region]&&(!x.reqResearch||s.purchases[x.reqResearch]));
 for(const site of sites)for(const m of fx('excavations').modes)for(const id of E.dig(site.id,m))mark(id,'excavaciones');
 // Comercio: piezas que pueden aparecer en una oferta que el rango actual permite completar.
 const cl=lvl('caravan'),maxR=Math.min(3,cl-2);
 const rankFor=level=>S.COMMERCE_RANKS[level]||0;
 if(cl>=2)for(const id of E.commerce(cl,conts,maxR)){const r=P[id].rarity,offerLevel=r+2;if(rank>=rankFor(offerLevel)||(r<=1))mark(id,'comercio');}
 for(const [k,t] of Object.entries(X.PREPARATIONS))if(lvl('workshop')>=t.minWorkshop)for(const id of E.preparation(k,conts,lvl('workshop')>=4?2:1))mark(id,'taller');
 for(const c of a3.commissionList()){const need=S.COMMISSION_RANKS[c.id]||0;if(rank>=need)for(const id of E.reward(c.reward,conts))mark(id,'encargos');}
 return {reach,voyages:voyages.map(v=>v.id),sites:sites.map(x=>x.id),regions:regions.length,
  prospections:Object.keys(X.PROSPECTIONS).filter(t=>lvl('surveys')>=X.PROSPECTIONS[t].minLevel),
  preparations:Object.keys(X.PREPARATIONS).filter(k=>lvl('workshop')>=X.PREPARATIONS[k].minWorkshop),
  commissions:a3.commissionList().filter(c=>rank>=(S.COMMISSION_RANKS[c.id]||0)).map(c=>c.id)};
}

function caps(h,av){
 const g=h.g,s=g.state,K=h.x.AtlasMEC03Catalog,CAT=h.A.catalog;
 const species=new Set();for(const r of g.REGIONS)if(s.regionUnlocked[r.id])for(const sp of r.species||[])if(g.SPECIES[sp])species.add(sp);
 let collections=0;for(const c of CAT.collections.values())if(c.ids.every(id=>av.reach.has(id)))collections++;
 return {prestige:s.prestige,species:species.size,monographs:species.size,collectibles:av.reach.size,
  voyages:av.voyages.length?Infinity:0,research:Object.values(s.purchases).filter(n=>n>0).length,income:Infinity,regions:av.regions,collections};
}

function run(h,{maxSteps=80}={}){
 const g=h.g,s=g.state,C=h.x.AtlasCampMEC02,S=h.x.AtlasMEC04,log=[];
 h.window.confirm=()=>true;
 const rich=()=>{s.money=1e12;s.knowledge=1e12;};
 let av=availability(h),steps=0,changed=true;
 while(changed&&steps++<maxSteps){
  changed=false;rich();
  const speciesNow=caps(h,av).species;
  if(s.prestige<speciesNow+1){s.prestige=speciesNow+1;changed=true;}
  for(const r of g.REGIONS)if(!s.regionUnlocked[r.id]&&g.regionRequirementsMet(r)){g.unlockRegion(r.id);if(s.regionUnlocked[r.id]){changed=true;log.push('región '+r.id);}}
  for(const n of g.RESEARCH_NODES)if(!(s.purchases[n.id]>0)&&g.canBuy(n)){rich();g.buyNode(n.id);if(s.purchases[n.id]>0){changed=true;log.push('investigación '+n.id);}}
  for(const d of g.CARTOGRAPHY3400)if(!(s.inventory[d.map]>0)&&(!d.sourceResearch||s.purchases[d.sourceResearch]>0)){
   s.inventory[d.piece]=Math.max(s.inventory[d.piece]||0,d.quantity);if(g.canCraft(d.map)&&g.craftItem(d.map)){changed=true;log.push('mapa '+d.map);}
  }
  // Mapa del mundo (puerta cartográfica de los océanos): receta real, sin consumir mapas.
  if(!(s.inventory.world_map>0)&&g.canCraft('world_map')&&g.craftItem('world_map')){changed=true;log.push('mapa world_map');}
  // Preparaciones continentales históricas (CONTINENT_RESEARCH3300): se fabrican con su receta
  // real; sus materiales históricos se suponen obtenibles (contenido ya verificado).
  for(const c of new Set(Object.values(g.CONTINENT_RESEARCH3300)))for(const item of g.craftedRequirements3300(c)||[]){
   if(s.inventory[item]>0||!g.RECIPES[item])continue;
   const fill=x=>{for(const [m,q] of Object.entries(g.RECIPES[x]?.requires||{})){if(g.RECIPES[m]&&!(s.inventory[m]>=q)){for(let i=0;i<q;i++){fill(m);g.craftItem(m);}}else s.inventory[m]=Math.max(s.inventory[m]||0,q);}};
   fill(item);if(g.craftItem(item)){changed=true;log.push('preparación '+item);}
  }
  for(const id of LEVEL_NAMES){rich();if(C.check(s,id).ok&&C.upgrade(s,id,h.now).ok){changed=true;log.push('instalación '+id+' '+C.level(s,id));}}
  av=availability(h);
  const cap=caps(h,av);
  const e=S.eligibility(s,cap);
  if(e.ok){S.ascend(s,cap,h.now,null);changed=true;log.push('rango '+S.rank(s));av=availability(h);}
 }
 const K=h.x.AtlasMEC03Catalog,final=caps(h,av),e=S.eligibility(s,final);
 return {steps,log,rank:S.rank(s),levels:{...s.camp.levels},regions:av.regions,totalRegions:g.REGIONS.length,
  research:Object.values(s.purchases).filter(n=>n>0).length,totalResearch:g.RESEARCH_NODES.length,
  pieces:av.reach.size,missingPieces:Object.keys(K.pieces).filter(id=>!av.reach.has(id)),
  voyages:av.voyages,missingVoyages:g.VOYAGES.map(v=>v.id).filter(id=>!av.voyages.includes(id)),
  sites:av.sites,missingSites:g.MUSEUM_DIG_SITES.map(x=>x.id).filter(id=>!av.sites.includes(id)),
  prospections:av.prospections,preparations:av.preparations,commissions:av.commissions,
  blockedBy:e.ok||!e.next?[]:e.missing.map(m=>m.key+' '+m.have+'/'+m.need)};
}
module.exports={run,availability,caps};
