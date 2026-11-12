'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{make,copy}=require('../tests/helpers/inv3400-game.cjs');
function rng(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function area(r){return r.depthTier==='abisal'?'Fosas abisales':r.depthTier==='profundo'?'Océanos profundos':r.continent;}
function run(seed,maxHours=2400){
 const epoch=1700000000000,h=make({rng:rng(seed),headless:true,now:epoch}),g=h.g,s=g.state;
 assert.equal(s.money,420);assert.equal(s.knowledge,0);assert.equal(s.prestige,0);assert.deepEqual(copy(s.cartography3400.historicalAccess),{});
 const stages=['Europa','Asia','África','Norteamérica','Sudamérica','Oceanía','Polos','Océanos','Océanos profundos','Fosas abisales'],milestones={Europa:0},maps={},samples=[];let manual=0,departures=0,purchases=0;
 const policy=['prismaticos_1','cuaderno_1','metodo_1','capacitacion_1','astillero','rutas_1','rutas_2','flota_1','sociedad_1','gabinete_1','prismaticos_2','etologia_1','etologia_2','grupos_1','grupos_2','grupos_3','censo_campo_1','censo_campo_2','metodo_2','metodo_3','metodo_4','grupos_auto_1','censo_auto_1','capacitacion_2','masto_1','masto_2','ornito_1','ornito_2','herpeto_1','herpeto_2','ictio_1','ictio_2','fondos_x1','fondos_x10','fondos_x100','fondos_x1000','nuevo_mundo_1',...Object.keys(g.CONTINENT_RESEARCH3300)];
 function research(){for(const id of policy){const n=g.RESEARCH_NODES.find(n=>n.id===id);if(n&&!s.purchases[id]&&g.canBuy(n))g.buyNode(id);}const n=g.RESEARCH_NODES.find(n=>n.id==='novato');if(s.helpers<3&&g.canBuy(n))g.buyNode('novato');}
 function supply(id,n=1,path=[]){if((s.inventory[id]||0)>=n||path.includes(id))return;if(g.RECIPES[id]){for(let tries=0;tries<n;tries++){for(const [mat,q]of Object.entries(g.RECIPES[id].requires))supply(mat,q,path.concat(id));if(!g.canCraft(id))break;g.craftItem(id);}}else if(g.TRADE_MARKET[id]){for(let tries=0;tries<n;tries++){if((s.inventory[id]||0)>=n||s.money<g.TRADE_MARKET[id]+100)break;if(g.buyTrade3300(id))purchases++;}}}
 function preparations(){for(const d of g.CARTOGRAPHY3400)if(!s.inventory[d.map]&&g.canCraft(d.map)){g.craftItem(d.map);maps[d.map]={hour:(h.now-epoch)/3600000,prestige:s.prestige,beforeDestination:!s.purchases[d.research]};}for(const id of ['brass_compass','oceanic_quadrant','field_telescope','scholar_hat','polar_coat','sounding_kit'])if(!s.craftedItems[id])supply(id);if(g.canCraft('world_map')){g.craftItem('world_map');maps.world_map={hour:(h.now-epoch)/3600000,beforeSeas:!s.purchases.mares_superficiales_1};}}
 function explore(){for(const r of g.REGIONS)if(!s.regionUnlocked[r.id]&&g.regionRequirementsMet(r)){g.unlockRegion(r.id);milestones[area(r)]??=(h.now-epoch)/3600000;}return stages.every(c=>milestones[c]!==undefined);}
 function science(){for(const id of Object.keys(s.discovered)){for(let i=0;i<5;i++){const before=s.stages[id]||0;if(before>=5)break;g.advanceSpecies(id);if((s.stages[id]||0)===before)break;}if(s.stages[id]===5&&!s.published[id])g.publishMonograph(id);if(s.stages[id]===5&&!s.museum.exhibits[id]&&s.money>=g.exhibitPrice(id))g.exhibitAnimal(id);}}
 function target(){
  const regions=g.REGIONS.filter(r=>!r.depthTier&&g.regionAccessible(r));
  const materialTargets=[];if(!s.craftedItems.scholar_hat&&(s.inventory.owl_feather||0)<2)materialTargets.push('buho_comun');if(!s.craftedItems.polar_coat&&(s.inventory.beaver_tail_scale||0)<2)materialTargets.push('castor_europeo');
  const available=regions.flatMap(r=>r.species.filter(id=>!s.published[id]).map(id=>({r,id,score:Math.min(500,s.sightings[id]||0)+(g.specials(id)>0?500:0)+(s.feedObs[id]>=10?100:0)})));
  const selected=materialTargets.map(id=>({id,r:regions.find(r=>r.species.includes(id))})).find(x=>x.r)||available.sort((a,b)=>b.score-a.score)[0];if(!selected)return;
  g.setRegion(selected.r.id);const sp=g.SPECIES[selected.id];for(const season of sp.seasons)for(const habitat of selected.r.habitats)for(const time of sp.times)if(g.eligibleSpecies(selected.r.id,habitat,time,season).includes(selected.id)){Object.assign(s,{habitat,time,season});return;}
 }
 for(let hour=0;hour<maxHours;hour++){
  research();preparations();research();if(explore())break;target();
  for(let minute=0;minute<60;minute++){
   h.now=epoch+(hour*60+minute)*60000;g.batch(true);for(let n=0;n<5;n++){g.encounter('manual',h.now+n*2000);manual++;}g.batch(false);g.requestGrant();
   // Funding uses the existing paid Society conversion, never injected knowledge.
   if(s.knowledge<50000){const tier=s.purchases.fondos_x1000?1000:s.purchases.fondos_x100?100:s.purchases.fondos_x10?10:1;if(s.money>=tier*100+1000)g.spendMoneyForKnowledge(tier);}
   const preferred=!s.inventory.asia_map&&!s.purchases.asia_1?'north':!s.inventory.africa_map?'balkans':!s.inventory.north_america_map||!s.inventory.south_america_map?'atlantic_survey':!s.inventory.oceania_map||!s.inventory.polar_map?'north':'coast';
   for(const v of [...g.availableVoyages().filter(v=>v.id===preferred),...g.availableVoyages()]){const before=s.voyages.length;g.sail(v.id);if(s.voyages.length>before)departures++;if(s.voyages.length>=g.maxVoyages())break;}
   h.now=epoch+(hour*60+minute+1)*60000;h.tick();
  }
  science();assert.ok(s.money>=0&&s.knowledge>=0);assert.deepEqual(copy(s.cartography3400.historicalAccess),{});
  if(hour%24===23){const sample={hour:hour+1,prestige:s.prestige,money:Math.round(s.money),knowledge:Math.round(s.knowledge),published:Object.keys(s.published).length};samples.push(sample);if(process.env.ATLAS_CAMPAIGN_PROGRESS)console.log(seed,JSON.stringify(sample),Object.keys(milestones).at(-1));}
 }
 const notReached=stages.filter(c=>milestones[c]===undefined),report={seed,initial:{money:420,knowledge:0,prestige:0},milestonesHours:milestones,maps,notReached,manualAttempts:manual,scientificDepartures:departures,materialPurchases:purchases,final:{prestige:s.prestige,money:s.money,knowledge:s.knowledge,published:Object.keys(s.published).length},samples};
 assert.deepEqual(notReached,[],'Campaign seed '+seed+' did not reach all stages');for(const d of g.CARTOGRAPHY3400.filter(d=>d.sourceResearch))assert.equal(maps[d.map].beforeDestination,true);assert.equal(maps.world_map.beforeSeas,true);return report;
}
const seeds=process.env.ATLAS_CAMPAIGN_SEEDS?process.env.ATLAS_CAMPAIGN_SEEDS.split(',').map(Number):[19,71,503],runs=[];
for(const seed of seeds){runs.push(run(seed,Number(process.env.ATLAS_CAMPAIGN_HOURS)||2400));fs.mkdirSync('docs/inv3400',{recursive:true});fs.writeFileSync(process.env.ATLAS_CAMPAIGN_OUT||'docs/inv3400/world-campaigns.json',JSON.stringify({version:'3.40.0',method:'Fresh initialState: £420, zero knowledge/prestige, no inventory or heritage. Actual seeded encounters, legal map/gear recipes, scientific voyages, research, grants (one/minute), paid Society funding, publications, Museum and minute ticks. Five manual attempts/minute, ordinary automatic caps, three hired helpers. Only presentation is suppressed. No injected money, materials, sightings, specimens, research or prestige. Date advances virtually; timings describe an automated policy, not human play or an optimal campaign.',runs},null,2)+'\n');console.log('Completed world campaign',seed,JSON.stringify(runs.at(-1).milestonesHours));}
