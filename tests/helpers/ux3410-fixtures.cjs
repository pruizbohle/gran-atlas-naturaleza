'use strict';
const {make,copy}=require('./ux3410-game.cjs');
const labels={new:'Principiante en Islas Británicas',europe:'Europa con monografías',first_continent:'Primer continente por preparar',africa:'África y América',museum:'Mapas, comercio y Museo',polar:'Exploración polar',ocean:'Mapamundi y océanos',advanced:'Gabinete avanzado',historical:'Acceso oceánico histórico sin mapa físico'};
function fixture(mode='new',options={}){
 const h=make({now:Date.now(),...options}),g=h.g,s=copy(g.state),level={new:0,europe:1,first_continent:2,africa:3,museum:4,polar:5,ocean:6,advanced:7,historical:6}[mode]??0;
 s.collectionId='ux3410-fixture-'+mode;s.helpers=0;s.lastTick=Date.now();s.log=[];
 s.prestige=[0,8,12,80,250,310,450,950][level];s.money=level?50000:420;s.knowledge=level?60000:0;
 const core=['prismaticos_1','cuaderno_1','metodo_1','capacitacion_1','astillero','rutas_1','rutas_2','sociedad_1','gabinete_1'];
 const chain=['asia_1','africa_1','nuevo_mundo_1','norteamerica_1','sudamerica_1','oceania_1','polos_1','mares_superficiales_1','exploracion_profunda_1','exploracion_abisal_1'];
 const earned=level>=7?chain:level===6?chain.slice(0,9):level===5?chain.slice(0,7):level===4?chain.slice(0,6):level===3?chain.slice(0,2):[];
 for(const id of [...(level?core:[]),...earned]){const n=g.RESEARCH_NODES.find(n=>n.id===id);s.purchases[id]=1;n?.effect(s);}
 if(level>=2)for(const [id,i]of Object.entries(g.ITEMS))if(!/map|regional/.test(id)&&i.kind!=='regional')s.inventory[id]=30;
 if(level===2)s.inventory.asia_map_piece=7;
 if(level>=3)for(const [i,d]of g.CARTOGRAPHY3400.entries())if(level>=4||i<2){s.inventory[d.map]=1;s.craftedItems[d.map]=true;}
 if(level>=3)for(const r of Object.values(g.CONTINENT_RULES3300))if(r.initial<=s.prestige)for(const id of r.items)s.craftedItems[id]=true;
 if(level>=6){s.inventory.world_map=1;s.craftedItems.world_map=true;}
 const count=level>=7?945:level===6?420:level===5?250:level===4?200:level===3?85:level===2?12:level?8:0;
 for(const id of Object.keys(g.SPECIES).slice(0,count)){s.discovered[id]=true;s.sightings[id]=600;s.feedObs[id]=12;s.stages[id]=5;s.published[id]=true;}
 if(level){const first=g.REGIONS[0].species[0];s.discovered[first]=true;s.sightings[first]=600;s.stages[first]=5;delete s.published[first];}
 if(level>=4){s.museum.wing=3;for(const id of Object.keys(s.published).slice(0,12))s.museum.exhibits[id]=true;for(const r of g.MUSEUM_COLLECTIONS)s.museum.collections[r.id]=true;for(const r of g.MUSEUM_FOSSIL_RECIPES.filter(r=>r.unique))s.museum.collections[r.id]=true;for(const r of g.MUSEUM_RELICTS)s.museum.relicts[r.id]=true;s.commerce.tradeReceipts=Array.from({length:150},(_,i)=>({id:i+1,route:'coastal_trade',at:Date.now()-i*3600000,money:g.TRADE_ROUTES[0].money,rewards:copy(g.TRADE_ROUTES[0].rewards)}));s.commerce.seq=150;s.commerce.history=s.commerce.tradeReceipts.slice(-12);}
 if(level>=7){s.achievements.counters={trade:100,trade24:20,market:40,barter:40};}
 if(mode==='historical'){s.inventory.world_map=0;delete s.craftedItems.world_map;for(const d of g.CARTOGRAPHY3400){delete s.inventory[d.map];delete s.craftedItems[d.map];}s.cartography3400.historicalAccess=Object.fromEntries(['Sudamérica','Oceanía','Polos','Océanos','Océanos profundos','Fosas abisales'].map(c=>[c,true]));}
 g.state=s;const preferred=level>=6?g.REGIONS.find(r=>r.depthTier==='profundo'):level===5?g.REGIONS.find(r=>r.continent==='Polos'):level===4?g.REGIONS.find(r=>r.continent==='Norteamérica'):level===3?g.REGIONS.find(r=>r.continent==='África'):g.REGIONS[0];
 for(const r of g.REGIONS)if(g.regionRequirementsMet(r))s.regionUnlocked[r.id]=true;
 if(preferred&&g.regionRequirementsMet(preferred)){s.currentRegion=preferred.id;s.habitat=preferred.habitats[0];}
 const r=g.REGIONS.find(r=>r.continent===preferred.continent&&r.id!==s.currentRegion&&g.regionRequirementsMet(r));if(r)delete s.regionUnlocked[r.id];
 s.atlasView=preferred.continent;s.atlasSelectedRegion=r?.id||s.currentRegion;
 return {name:mode,label:labels[mode],save:copy(s),readyRegion:r?.id||null,synthetic:true};
}
module.exports={fixture,labels,modes:Object.keys(labels).filter(x=>x!=='historical')};
