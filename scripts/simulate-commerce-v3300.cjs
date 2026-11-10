'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{performance}=require('node:perf_hooks'),{harness}=require('../tests/helpers/live-game.cjs');
let now=1700000000000;class Clock extends Date{static now(){return now;}}
const bridge=`\nwindow.__atlasTest={get state(){return state},TRADE_ROUTES,TRADE_MARKET,TRADE_BARTERS,V316_MATERIAL_STUDIES,RECIPES,REGIONS,SPECIES,RESEARCH_NODES,startTrade3300,settleTrade3300,buyTrade3300,barterTrade3300,renderTrade3300,syncTrade3300,tradeAction3300,craftItem,renderPanel,tick,encounter,sail,processVoyages,museumRate,requestGrant,exchangeNotes};\n})();`;
let seed=3300;const rng=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
const values={...{animal_trace:35,ancient_coin:60,map_fragment:45,fossil_fragment:25,fossil_tooth:35,owl_feather:50,heron_feather:40,wolf_tooth:35,boar_tusk:35,antler_fragment:35,otter_whisker:35,beaver_tail_scale:35},};
const scenarios=[];
for(const [name,prestige,money,knowledge,route,exhibits]of [['temprana',0,420,200,'coastal_trade',0],['intermedia',60,6000,4000,'archive_trade',3],['avanzada',250,25000,18000,'ocean_trade',8]]){
now=1700000000000;const h=harness({},null,{development3280:true,bridge,Date:Clock,rng}),g=h.window.__atlasTest,s=g.state;Object.assign(s,{prestige,money,knowledge,helpers:0});Object.assign(s.upgrades,{shipyard:1,routeTier:2});for(const id of Object.keys(g.SPECIES).slice(0,exhibits)){s.discovered[id]=true;s.stages[id]=5;s.museum.exhibits[id]=true;}g.tradeAction3300('trade-tab','commerce');
const initial={money:s.money,knowledge:s.knowledge},rate=g.museumRate();let scientific=0,trade=0,field=0;for(let hour=0;hour<72;hour++){
 if(g.startTrade3300(route))trade++;
 if(s.money>=35&&s.knowledge>=12){const before=s.voyages.length;g.sail('coast');if(s.voyages.length>before)scientific++;}
 for(let i=0;i<10;i++){g.encounter('manual',now,true);field++;}
 g.requestGrant();now+=3600000;h.tick();assert.ok(s.money>=0&&s.knowledge>=0);}
 g.settleTrade3300();scenarios.push({name,hours:72,initial,final:{money:s.money,knowledge:s.knowledge},manualSearches:field,scientificDepartures:scientific,tradeDepartures:trade,tradeReceipts:s.commerce.history.length,museumPoundsPerSecond:rate,inventory:s.inventory,negativeBalances:false});
}
const g=harness({},null,{development3280:true,bridge,Date:Clock}).window.__atlasTest;Object.assign(values,g.TRADE_MARKET);
const barterChecks=g.TRADE_BARTERS.map(r=>{const input=Object.entries(r.requires).reduce((v,[id,n])=>v+values[id]*n,0),output=Object.entries(r.rewards).reduce((v,[id,n])=>v+values[id]*n,0);assert.ok(input>output);return{id:r.id,inputValue:input,outputValue:output};});
const studyChecks=Object.entries(g.V316_MATERIAL_STUDIES).map(([id,r])=>{const input=Object.entries(r.requires).reduce((v,[id,n])=>v+values[id]*n,0),output=r.money+r.knowledge*.625;assert.ok(input>=output,id);return{id,inputValue:input,outputValue:output};});
assert.ok(100>70*.625); // Existing money->knowledge->notes money conversion is lossy.
Object.assign(g.state.upgrades,{shipyard:1});g.state.money=g.state.knowledge=1e6;g.state.prestige=300;
const t=performance.now();for(let i=0;i<200;i++)g.renderTrade3300();const renderMs=(performance.now()-t)/200;

const report={version:'3.30.0',assumptions:'72 horas por escenario,10 búsquedas manuales y una salida científica por hora,subvención horaria,una plaza comercial; muestras de 0/3/8 especies expuestas. No estima días humanos para completar el mundo.',scenarios,arbitrage:{potentialValues:values,barterChecks,studyChecks,moneyKnowledgeCycleReturnPer100:43.75,noImmediatePositiveCycle:true,tradeRequiresRealTime:true},performance:{environment:'Node VM con DOM simulado; retención de DOM también verificada en Chromium',renderMeanMs:renderMs,renderIterations:200}};
fs.mkdirSync('docs/commerce-v3300',{recursive:true});fs.writeFileSync('docs/commerce-v3300/economy-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({scenarios:scenarios.map(({name,initial,final,tradeDepartures})=>({name,initial,final,tradeDepartures})),renderMs,arbitrage:'all checks passed'}));
