'use strict';
// MEC-01 · juego completo con los datos beta 5.6.0 y los módulos MEC-01 cargados,
// tal como los carga www/index.html (antes de app.js).
const fs=require('node:fs'),{make:inv}=require('./inv3400-game.cjs');
const read=p=>fs.readFileSync(p,'utf8');
const FILES=['beta-v560-data','mec01-catalog-meta','mec01-core','mec01-ui','mec02-camp','mec02-camp-ui','mec03-catalog','mec03-collect'];
const PRELUDE=FILES.map(n=>read('www/js/'+n+'.js')).join('\n');
// noCamp: sin los módulos MEC-02, para comparar con el comportamiento anterior.
const NO_CAMP=FILES.filter(n=>!n.startsWith('mec02')&&!n.startsWith('mec03')).map(n=>read('www/js/'+n+'.js')).join('\n');
const GLOBALS=['AtlasBeta560','AtlasMEC01','AtlasMEC01UI','AtlasBeta560Actions','AtlasCampMEC02','AtlasCampMEC02UI','AtlasCampMEC02Actions','AtlasMEC03','AtlasMEC03Catalog','AtlasMEC03Actions','AtlasCampMEC02Hooks','AtlasCampMEC02Plan'];
const EXTRA='mec01FieldDrops,normalizeMEC01,earnMoney,addInventory,maybeSpeciesDrop,SPECIES_DROPS,MUSEUM_LEVELS,MUSEUM_WINGS,museumCapacity,expandMuseum,renderMuseum,museumViewModel3270,journalViewModel3250,claimScientificMission,exchangeNotes,processMaterials,deliverContract3390,commissionClaim3370,tick,render,renderPanel,renderSociety,stageRequirements,encounter,publishMonograph,requestGrant,canProcessMaterials,processMaterials,voyageDuration,relictSurveySpec,maxRelictSurveys,maxExcavations,tradeCanStart3300,startTrade3300,settleTrade3300,buyTrade3300,collectExcavation,collectRelictSurvey,canStartRelictSurvey,relictLeadCount,MUSEUM_DIG_SITES,TRADE_ROUTES,TRADE_MARKET,V316_MATERIAL_STUDIES,recipePlan3400,rollLoot,resolveVoyageReward,startExcavation,startRelictSurvey,craftItem,canCraft,REGIONS,currentRegion,mec03AmbientFinds,sail,VOYAGES,tradeTransaction3300';
function make(options={}){
 const app=(options.app||read('www/js/app.js')).replace(/\n\}\)\(\);\s*$/,'\nwindow.__mec01={'+EXTRA.split(',').map(n=>'get '+n+'(){return typeof '+n+'==="undefined"?undefined:'+n+'}').join(',')+','+GLOBALS.map(n=>'get '+n+'(){return globalThis.'+n+'}').join(',')+'};\n})();');
 const h=inv({...options,gameSource:(options.noBeta?'':options.noCamp?NO_CAMP:PRELUDE)+'\n'+app});
 const extra=h.window.__mec01;
 const g=new Proxy(h.g,{get(t,k){return k in t?t[k]:extra[k];}});
 // Object.create conserva los accesores del arnés (now con su setter).
 return Object.defineProperties(Object.create(h),{g:{value:g},x:{value:extra},
  B:{get:()=>extra.AtlasBeta560},M:{get:()=>extra.AtlasMEC01},A:{get:()=>extra.AtlasBeta560Actions}});
}
module.exports={make,PRELUDE};
