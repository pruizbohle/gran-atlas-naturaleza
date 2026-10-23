export const MILESTONES = [1,10,20,50,100];
export const RESEARCH_COSTS = [8,25,55,100,175];
export const MAX_OFFLINE_SECONDS = 8*60*60;
export const RARITY = {comun:12,poco_comun:6,raro:2,legendario:0.6};
export function freshSave(now=Date.now()) {return {version:1, lastSavedAt:now, knowledge:10, totalSearches:0, fame:0, scouts:0, discovered:{}, sightings:{}, research:{}, variants:{}, published:{}, settings:{habitat:'bosque',time:'amanecer',season:'primavera'}, log:[], lastEncounter:null};}
export function boundedElapsed(previous,now=Date.now()){if(!Number.isFinite(previous)||previous>now)return 0;return Math.min(MAX_OFFLINE_SECONDS,Math.floor((now-previous)/1000));}
export function researchCost(species,stage){const mod={comun:1,poco_comun:1.15,raro:1.3,legendario:1.5}[species.rarity]||1;return Math.ceil(RESEARCH_COSTS[stage]*mod);}
export function eligible(species,settings){return species.habitats.includes(settings.habitat)&&species.times.includes(settings.time)&&species.seasons.includes(settings.season);}
export function rate(save){return save.scouts*0.18;}
export function addLog(save,message){save.log=[message,...save.log].slice(0,8);}
export function attemptEncounter(save,species,rng=Math.random, source='manual') {
  save.totalSearches++;
  const pool=species.filter(x=>eligible(x,save.settings));
  const weight=pool.reduce((sum,x)=>sum+RARITY[x.rarity],0);
  // A higher compatible population increases encounter chance, but never guarantees it.
  const chance=Math.min(.85,.20+weight/55);
  if(!pool.length||rng()>=chance){save.knowledge+=2;addLog(save,'🐾 Indicios sin avistamiento · +2 conocimiento');save.lastEncounter=null;return {type:'clue',knowledge:2};}
  let roll=rng()*weight;let animal=pool[pool.length-1];
  for(const candidate of pool){roll-=RARITY[candidate.rarity];if(roll<=0){animal=candidate;break;}}
  const previous=save.sightings[animal.id]||0;
  save.sightings[animal.id]=previous+1;save.discovered[animal.id]=true;
  const reward={comun:4,poco_comun:6,raro:10,legendario:18}[animal.rarity];
  save.knowledge+=reward;
  let variant=null;
  // Exceptional sightings are optional and never gate research.
  if(animal.variants.length&&rng()<.004){variant=animal.variants[Math.floor(rng()*animal.variants.length)];save.variants[animal.id]??={};save.variants[animal.id][variant]=(save.variants[animal.id][variant]||0)+1;}
  save.lastEncounter={id:animal.id,variant,source};
  addLog(save,`${source==='auto'?'👨‍🔬':'🔭'} ${previous===0?'¡Nueva especie! ':''}${animal.name} · ${previous+1} avistamientos${variant?' · ✦ '+variant:''}`);
  return {type:'sighting',species:animal,first:previous===0,variant,knowledge:reward};
}
export function advanceResearch(save,species){const current=save.research[species.id]||0;if(current>=5)return false;if((save.sightings[species.id]||0)<MILESTONES[current])return false;const cost=researchCost(species,current);if(save.knowledge<cost)return false;save.knowledge-=cost;save.research[species.id]=current+1;addLog(save,`📖 Investigación ${current+1}/5: ${species.name} (−${cost} conocimiento)`);return true;}
export function publish(save,species){if((save.research[species.id]||0)!==5||save.published[species.id])return false;save.published[species.id]=true;save.fame++;addLog(save,'🏅 Monografía publicada: '+species.name+' · +1 prestigio');return true;}
export function hireScout(save){const price=Math.ceil(40*Math.pow(1.65,save.scouts));if(save.knowledge<price)return false;save.knowledge-=price;save.scouts++;addLog(save,'✍️ Naturalista contratado');return true;}
// Offline progress is calculated using the elapsed duration, not a running background timer.
export function applyOfflineProgress(save,species,now=Date.now(),rng=Math.random){const seconds=boundedElapsed(save.lastSavedAt,now);if(!seconds||!save.scouts){save.lastSavedAt=now;return {seconds,attempts:0,sightings:0,gained:0};}const attempts=Math.floor(seconds*rate(save));const before=save.knowledge;let sights=0;for(let i=0;i<attempts;i++){if(attemptEncounter(save,species,rng,'auto').type==='sighting')sights++;}const gained=save.knowledge-before;save.lastSavedAt=now;addLog(save,`🌙 Ausencia: ${Math.round(seconds/60)} min · ${attempts} búsquedas · ${sights} avistamientos`);return {seconds,attempts,sightings:sights,gained};}
export function normalizeSave(value){if(!value||value.version!==1)return freshSave();const base=freshSave();return {...base,...value,settings:{...base.settings,...value.settings},sightings:value.sightings||{},research:value.research||{},discovered:value.discovered||{},variants:value.variants||{},published:value.published||{},log:Array.isArray(value.log)?value.log.slice(0,8):[]};}
