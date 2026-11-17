/* Injected inside the real game closure by build-gm06-lab.cjs, never loaded by index. */
function gm06Scenario(kind,regionId){
 const r=REGIONS.find(r=>r.id===regionId);if(!r)return;
 const s=initialState();s.collectionId='gm06-synthetic-'+kind;s.money=1000000;s.knowledge=1000000;s.prestige=1000;s.helpers=0;
 for(const id of ['asia_1','africa_1','nuevo_mundo_1','norteamerica_1','sudamerica_1','oceania_1','polos_1','mares_superficiales_1','exploracion_profunda_1','exploracion_abisal_1','astillero','rutas_1','rutas_2']){const n=RESEARCH_NODES.find(n=>n.id===id);if(n){s.purchases[id]=1;n.effect(s);}}
 for(const id of Object.keys(ITEMS))s.inventory[id]=100;
 for(const d of CARTOGRAPHY3400){s.inventory[d.map]=1;s.craftedItems[d.map]=true;}
 for(const d of REGIONS)s.regionUnlocked[d.id]=true;
 s.currentRegion=r.id;s.habitat=r.habitats[0];s.atlasView=r.continent;s.atlasSelectedRegion=r.id;
 s.naturalistProfile3430={avatar:'botanica',name:'Naturalista GM-06'};
 if(kind==='cuaderno')for(const id of r.species){s.discovered[id]=true;s.sightings[id]=240;s.feedObs[id]=12;recordSpecimen(id,{category:'Notable'},s);s.stages[id]=1;}
 window.AtlasSaveBridge.restoreGame(s);setRegion(r.id);state.selectedJournal=r.species[0];state.selectedBestiary=r.species[0];
 if(kind==='continuidad'){
  state.currentRegion='sa_patagonia_y_tierra_del_fuego';state.regionUnlocked[state.currentRegion]=true;
  state.naturalistProfile3430={avatar:'botanica',name:'Elena — continuidad 3.43.0'};
  sail('coast');startTrade3300('coastal_trade');
  const oldIds=Object.keys(SPECIES).filter(id=>SPECIES[id].origin!=='gm06');
  for(const id of oldIds){state.discovered[id]=true;state.sightings[id]=640;state.feedObs[id]=12;state.stages[id]=5;state.published[id]=true;}
  persist();const saved=localStorage.getItem('gran_atlas_v05');localStorage.setItem('gran_atlas_v05',saved);state=load();
 }
 tab=kind==='cuaderno'?'journal':kind==='continuidad'?'expeditions':'atlas';render();
 parent.postMessage({type:'gm06-ready',region:state.currentRegion,species:Object.keys(SPECIES).length,regions:REGIONS.length,scenario:kind},'*');
}
window.addEventListener('message',event=>{
 if(event.source!==parent||event.data?.type!=='gm06-command')return;
 const d=event.data;
 if(d.command==='scenario'&&['campo','cuaderno','continuidad'].includes(d.scenario))gm06Scenario(d.scenario,d.region);
 if(d.command==='tab'&&['atlas','field','journal','bestiary','expeditions','objects','museum','society'].includes(d.tab)){tab=d.tab;renderPanel();}
 if(d.command==='automatic'){state.helpers=1;state.upgrades.autoTier=1;encounter('auto',Date.now(),true);render();}
 if(d.command==='manual'){encounter('manual',Date.now(),true);render();}
});
gm06Scenario('campo','gm06_galapagos');
