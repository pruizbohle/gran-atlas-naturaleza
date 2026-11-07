'use strict';
const {harness}=require('./live-game.cjs');
function advanced(seconds,gameSource){
 let now=1794052800000,seed=3200,calls=0;
 class Clock extends Date{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}}
 const h=harness({},null,{gameSource,Date:Clock,rng(){calls++;seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}}),a=h.window.__atlasTest,s=a.state;
 for(const id of Object.keys(a.SPECIES)){s.discovered[id]=true;s.sightings[id]=100000;s.stages[id]=5;}
 Object.keys(a.SPECIES).slice(0,240).forEach(id=>s.published[id]=true);for(const id of Object.keys(a.ITEMS))s.inventory[id]=1000;
 s.helpers=40;s.upgrades.autoTier=2;s.upgrades.autoGroup=2;s.upgrades.autoCensus=1;s.upgrades.training=2;s.upgrades.specimenDrops=1;s.upgrades.ethology=2;
 s.equipment={instrument:'sturdy_pack',hat:'feather_cap',necklace:'shell_necklace'};s.money=1e7;s.knowledge=1e7;s.prestige=1000;
 for(const id of Object.keys(a.SPECIES).slice(0,12))s.museum.exhibits[id]=true;for(const r of a.MUSEUM_RELICTS)s.museum.relicts[r.id]=true;
 s.voyages=a.VOYAGES.slice(0,2).map((v,i)=>({id:i+1,type:v.id,endAt:now-1000}));s.lastTick=now-seconds*1000;
 h.tick();for(let i=0;i<3;i++){now+=1000;h.tick();}
 return {state:h.window.AtlasSaveBridge.getSaveData?h.window.AtlasSaveBridge.getSaveData():JSON.parse(h.store.gran_atlas_v05),calls};
}
module.exports={advanced};
