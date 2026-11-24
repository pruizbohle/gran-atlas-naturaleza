'use strict';
// MEC-01 · juego completo con los datos beta 5.6.0 y los módulos MEC-01 cargados,
// tal como los carga www/index.html (antes de app.js).
const fs=require('node:fs'),{make:inv}=require('./inv3400-game.cjs');
const read=p=>fs.readFileSync(p,'utf8');
const FILES=['beta-v560-data','mec01-catalog-meta','mec01-core','mec01-ui','mec04-society','mec02-camp','mec02-camp-ui','mec03-catalog','mec03-collect','mec05-museum','mec06-workshop','mec07-natural-records'];
const PRELUDE=FILES.map(n=>read('www/js/'+n+'.js')).join('\n');
// noCamp: sin los módulos MEC-02, para comparar con el comportamiento anterior.
const NO_CAMP=FILES.filter(n=>!n.startsWith('mec02')&&!n.startsWith('mec03')&&!n.startsWith('mec04')&&!n.startsWith('mec05')&&!n.startsWith('mec06')&&!n.startsWith('mec07')).map(n=>read('www/js/'+n+'.js')).join('\n');
const GLOBALS=['AtlasBeta560','AtlasMEC01','AtlasMEC01UI','AtlasBeta560Actions','AtlasCampMEC02','AtlasCampMEC02UI','AtlasCampMEC02Actions','AtlasMEC03','AtlasMEC03Catalog','AtlasMEC03Actions','AtlasCampMEC02Hooks','AtlasCampMEC02Plan','AtlasMEC04','AtlasMEC04Actions','AtlasMEC04Content','AtlasMEC05','AtlasMEC05Actions','AtlasMEC06','AtlasMEC06Actions','AtlasMEC07','AtlasMEC07Actions'];
const EXTRA='naturalRecordsMEC07,presentEncounter,encounterCardMarkup,stageRequirements,bestiaryModalModel3260,deepRegionIndex3330,deepReady3330,researchCensusCount,rollSpecimen,eligibleSpecies,automaticEligibleSpecies,processAutomaticSearches,queueAutomaticSearches,museumOtherExhibits,LEGENDARY_SPECIMENS,inventoryUses3400,inventorySources3400,CARTOGRAPHIC_GATES3400,toggleMuseumDisplay,museumIsDisplayed,museumCollectionReady,craftMuseumFossil,CARTOGRAPHY3400,TRADE_BARTERS,V316_MATERIAL_STUDIES,regionalRecordMEC06,artifactIncomeMEC06,voyageKnowledgeReward,recordMuseumRelict,V316_LOOT_BASE,V316_LOOT_BY_ROUTE,TRADE_MARKET,MUSEUM_FOSSIL_SETS,MUSEUM_RELICT_SETS,MUSEUM_RELICTS,MUSEUM_COLLECTIONS,MUSEUM_FOSSIL_RECIPES,museumRelictOwned,museumFossilSetBonus,museumRelictSetBonus,museumCurationBonus,exhibitIncome,MAX_OFFLINE_MS,catalogMuseumCollection,removeExhibit,setRegion,museumMEC05,mec01FieldDrops,normalizeMEC01,earnMoney,addInventory,maybeSpeciesDrop,SPECIES_DROPS,MUSEUM_LEVELS,MUSEUM_WINGS,museumCapacity,expandMuseum,renderMuseum,museumViewModel3270,journalViewModel3250,claimScientificMission,exchangeNotes,processMaterials,deliverContract3390,commissionClaim3370,tick,render,renderPanel,renderSociety,stageRequirements,encounter,publishMonograph,requestGrant,canProcessMaterials,processMaterials,voyageDuration,relictSurveySpec,maxRelictSurveys,maxExcavations,tradeCanStart3300,startTrade3300,settleTrade3300,buyTrade3300,collectExcavation,collectRelictSurvey,canStartRelictSurvey,relictLeadCount,MUSEUM_DIG_SITES,TRADE_ROUTES,TRADE_MARKET,V316_MATERIAL_STUDIES,recipePlan3400,rollLoot,resolveVoyageReward,startExcavation,startRelictSurvey,craftItem,canCraft,REGIONS,currentRegion,mec03AmbientFinds,sail,VOYAGES,tradeTransaction3300,ambientContextMEC04,monographCount,requestGrant,regionRequirementsMet,unlockRegion,buyNode,canBuy,RESEARCH_NODES,voyageConditions3280,voyageRoute3280,canStartExcavation,MUSEUM_RELICTS,CARTOGRAPHY3400,processVoyages,craftedRequirements3300,CONTINENT_RESEARCH3300,craftedReady3300';
function make(options={}){
 const app=(options.app||read('www/js/app.js')).replace(/\n\}\)\(\);\s*$/,'\nwindow.__mec01={'+EXTRA.split(',').map(n=>'get '+n+'(){return typeof '+n+'==="undefined"?undefined:'+n+'}').join(',')+','+GLOBALS.map(n=>'get '+n+'(){return globalThis.'+n+'}').join(',')+'};\n})();');
 // full: también los catálogos GM-06/GM-07 que carga www/index.html (12 regiones y 52 especies más:
 // 125 regiones en total). Por defecto el arnés reproduce la base histórica de las pruebas (113).
 const full=options.full?['gm06/catalog','gm06/art','gm07-m01/art','gm07-p04/catalog','gm07-a04/catalog'].map(n=>read('www/js/'+n+'.js')).join('\n')+'\n':'';
 const h=inv({...options,gameSource:full+(options.noBeta?'':options.noCamp?NO_CAMP:options.without?FILES.filter(n=>!options.without.includes(n)).map(n=>read('www/js/'+n+'.js')).join('\n'):PRELUDE)+'\n'+app});
 const extra=h.window.__mec01;
 const g=new Proxy(h.g,{get(t,k){return k in t?t[k]:extra[k];}});
 // Object.create conserva los accesores del arnés (now con su setter).
 return Object.defineProperties(Object.create(h),{g:{value:g},x:{value:extra},
  B:{get:()=>extra.AtlasBeta560},M:{get:()=>extra.AtlasMEC01},A:{get:()=>extra.AtlasBeta560Actions}});
}
module.exports={make,PRELUDE};
