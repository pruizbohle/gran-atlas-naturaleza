const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const GAME=fs.readFileSync('www/js/app.js','utf8'),SAVE=fs.readFileSync('www/js/save-manager.js','utf8'),KEY='gran_atlas_v05';
function harness(store={},backup,options={}){
 const elements={};const timeouts=[];let tick=null;
 function node(id){
  if(!elements[id])elements[id]={
    id,hidden:id==='saveManager',disabled:id==='saveImportBtn',textContent:'',innerHTML:'',value:'',
    dataset:{},files:[],classList:{add(){},remove(){},toggle(){}},style:{},
    listeners:{},addEventListener(type,cb){(this.listeners[type]||=[]).push(cb);},
    async fire(type){for(const cb of this.listeners[type]||[])await cb({target:this,currentTarget:this});},
    setAttribute(){},contains(){return true;},focus(){},click(){},querySelector(){return null;},querySelectorAll(){return [];}};
  return elements[id];
 }
 const doc={getElementById:node,querySelectorAll(){return [];},
   addEventListener(){},body:{classList:{add(){},remove(){}},appendChild(){}}};
 const localStorage={
  getItem(k){if(options.storageReadError)throw new Error('SecurityError');return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null;},
  setItem(k,v){store[k]=String(v);},removeItem(k){delete store[k];}
 };
 const w={confirm:()=>true,Capacitor:{getPlatform:()=> 'android',Plugins:{
  AtlasImport:{async openFile(){return {content:JSON.stringify(backup),name:'partida-real.json'};}},
  AtlasExport:{async saveFile(){return {uri:'content://test'};}}
 }}};
 const ctx=vm.createContext({window:w,document:doc,localStorage,TextEncoder,
   Date:options.Date||Date,Math:Object.assign(Object.create(Math),options.rng?{random:options.rng}:{}),Number,JSON,Map,Set,console,URL,Blob,Intl,
   setInterval(cb){tick=cb;return 1;},setTimeout(cb){timeouts.push(cb);return 2;}});
 const gameSource=options.gameSource||GAME;
 const testGame=gameSource.replace(/\n\}\)\(\);\s*$/, options.bridge||'\nwindow.__atlasTest={get state(){return state},initialState,persist,encounter,rollSpecimen,recordSpecimen,specimenRates,specialBadges,renderLegendaryCollection,renderJournal,renderBestiary,get bestiaryPage(){return bestiaryPage},set bestiaryPage(value){bestiaryPage=value},BESTIARY_PAGE_SIZE:typeof BESTIARY_PAGE_SIZE==="undefined"?null:BESTIARY_PAGE_SIZE,openTab(name){tab=name;renderPanel()},handlePanelAction,get spriteCacheSize(){return spriteCache.size},renderPanel,renderExpeditions,renderObjects,craftItem,canCraft,canBuy,autoInterval,manualSearchChance,automaticSearchChance,exhibitAnimal,startExcavation,collectExcavation,equipItem,LEGENDARY_SPECIMENS,SPECIMEN_CATEGORIES,SPECIMEN_LEVELS,fieldAid,spendMoneyForKnowledge,buyNode,buyCrownPack,exchangeTrialCrowns,renderCrown,renderSociety,renderScientificMissions,claimScientificMission,renderMuseum,museumValueSort,exhibitPrice,setRegion,REGIONS,availableVoyages,sail,finishVoyage,VOYAGES,MUSEUM_COLLECTIONS,catalogMuseumCollection,renderMuseumCollections,museumCollectionReady,eligibleSpecies,SPECIES,MUSEUM_FOSSIL_RECIPES,craftMuseumFossil,museumAssemblyReady,museumOtherExhibits,renderFossilWorkshop,renderMuseumRelicts,renderMuseumArtifacts,renderMuseumSamples,toggleMuseumDisplay,renderMuseumExtraGallery,MUSEUM_RELICTS,recordMuseumRelict,maybeMuseumFieldDiscovery,SCIENTIFIC_MISSIONS,resolveVoyageReward,museumCardArt,ITEMS,regionRequirementsMet,unlockRegion,travelToRegion,getSpriteMarkup,taxonomyInfo,SEXUAL_DIMORPHISM,advanceSpecies,publishMonograph,selectAtlasRegion,atlasViewModel,RESEARCH_NODES,RECIPES,configuredSpecials,automaticEligibleSpecies,processVoyages,V316_LOOT_BASE,V316_LOOT_BY_ROUTE,rollLoot,knowledgeBonus,manualEncounterBonus,helperBonus,museumRate,museumCapacity,stageRequirements,researchCensusCount,exhibitIncome};\n})();');
 assert.notEqual(testGame,gameSource,'debe inyectarse puente de pruebas');
 if(!options.legacy)for(const name of ['mammal-art-v3194','bird-art-v3193','herp-art-v3192','northamerica-data-v3220','northamerica-polish-v3221','northamerica-art-v3220'])vm.runInContext(fs.readFileSync('www/js/'+name+'.js','utf8'),ctx);
 if(!options.legacy&&options.southamerica!==false)for(const name of ['southamerica-data-v3230','southamerica-polish-v3231','southamerica-art-v3230'])vm.runInContext(fs.readFileSync('www/js/'+name+'.js','utf8'),ctx);
 for(const engine of ['fish-art-v3191','relict-art-v3199','field-scene-v3210','field-ui-v3210','atlas-geography-v3211b','atlas-ui-v3211','atlas-map-v3211'])vm.runInContext(fs.readFileSync('www/js/'+engine+'.js','utf8'),ctx);
 vm.runInContext(fs.readFileSync('www/js/item-art-v3198.js','utf8'),ctx);
 vm.runInContext(fs.readFileSync('www/js/legendary-art-v3197.js','utf8'),ctx);
 if(!options.legacy&&options.southamerica!==false)vm.runInContext(fs.readFileSync('www/js/southamerica-geography-v3230.js','utf8'),ctx);
 vm.runInContext(testGame,ctx,{filename:'www/js/app.js'});
 vm.runInContext(SAVE,ctx,{filename:'www/js/save-manager.js'});
 return {window:w,store,doc,elements,localStorage,
  evalInGame(code){return vm.runInContext('window.__atlasTest.'+code,ctx);},
  tick(){assert.ok(tick,'motor debe tener guardado periódico');tick();},
  finishTimers(){for(const task of timeouts.splice(0))task();},
  async import(){await node('saveNativeImportBtn').fire('click');await node('saveImportBtn').fire('click');},
  get imported(){return JSON.parse(store[KEY]);}
 };
}

module.exports={harness};
