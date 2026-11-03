// Prueba de integración del motor real + gestor JSON con el tick automático.
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const GAME=fs.readFileSync('www/js/app.js','utf8');
const SAVE=fs.readFileSync('www/js/save-manager.js','utf8');
const KEY='gran_atlas_v05';
const backup={format:'el-gran-atlas-save',formatVersion:1,game:{
 money:4465,knowledge:390,prestige:4,currentRegion:'HX-01-09',
 sightings:{zorro_rojo:12100,erizo_europeo:39},
 stages:{zorro_rojo:5,erizo_europeo:1},discovered:{zorro_rojo:true,erizo_europeo:true},
 upgrades:{autoTier:0,training:0},purchases:{},published:{zorro_rojo:true},
 regionUnlocked:{'HX-01-09':true},inventory:{},equipment:{instrument:null,hat:null,necklace:null},
 helpers:0,sexSeen:{},voyages:[],log:[]
}};
function harness(store={}){
 const elements={};const timeouts=[];let tick=null;
 function node(id){
  if(!elements[id])elements[id]={
    id,hidden:id==='saveManager',disabled:id==='saveImportBtn',textContent:'',innerHTML:'',value:'',
    dataset:{},files:[],classList:{add(){},remove(){},toggle(){}},style:{},
    listeners:{},addEventListener(type,cb){(this.listeners[type]||=[]).push(cb);},
    async fire(type){for(const cb of this.listeners[type]||[])await cb({target:this,currentTarget:this});},
    setAttribute(){},focus(){},click(){},querySelector(){return null;},querySelectorAll(){return [];}};
  return elements[id];
 }
 const doc={getElementById:node,querySelectorAll(){return [];},
   addEventListener(){},body:{classList:{add(){},remove(){}},appendChild(){}}};
 const localStorage={
  getItem(k){return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null;},
  setItem(k,v){store[k]=String(v);},removeItem(k){delete store[k];}
 };
 const w={confirm:()=>true,Capacitor:{getPlatform:()=> 'android',Plugins:{
  AtlasImport:{async openFile(){return {content:JSON.stringify(backup),name:'partida-real.json'};}},
  AtlasExport:{async saveFile(){return {uri:'content://test'};}}
 }}};
 const ctx=vm.createContext({window:w,document:doc,localStorage,TextEncoder,
   Date,Math,Number,JSON,Map,Set,console,URL,Blob,Intl,
   setInterval(cb){tick=cb;return 1;},setTimeout(cb){timeouts.push(cb);return 2;}});
 const testGame=GAME.replace(/\n\}\)\(\);\s*$/, '\nwindow.__atlasTest={fieldAid,spendMoneyForKnowledge,buyNode,buyCrownPack,exchangeTrialCrowns,renderCrown,renderSociety,renderScientificMissions,claimScientificMission,renderMuseum,museumValueSort,exhibitPrice,setRegion,REGIONS,availableVoyages,sail,finishVoyage,VOYAGES,MUSEUM_COLLECTIONS,catalogMuseumCollection,renderMuseumCollections,museumCollectionReady,eligibleSpecies,SPECIES,MUSEUM_FOSSIL_RECIPES,craftMuseumFossil,museumAssemblyReady,museumOtherExhibits,renderFossilWorkshop,renderMuseumRelicts,renderMuseumArtifacts,renderMuseumSamples,toggleMuseumDisplay,renderMuseumExtraGallery,MUSEUM_RELICTS,recordMuseumRelict,maybeMuseumFieldDiscovery,SCIENTIFIC_MISSIONS,resolveVoyageReward,museumCardArt,ITEMS};\n})();');
 assert.notEqual(testGame,GAME,'debe inyectarse puente de pruebas');
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
test('motor completo mantiene 12139 avistamientos, £4465 y prestigio 4 después del tick',async()=>{
 const store={};
 const h=harness(store);
 assert.equal(h.window.AtlasSaveBridge.getSnapshot().money,420);
 await h.import();
 assert.equal(h.window.AtlasSaveBridge.getSnapshot().sightings,12139);
 assert.equal(h.window.AtlasSaveBridge.getSnapshot().prestige,4);
 assert.equal(h.window.AtlasSaveBridge.getSnapshot().money,4465);
 assert.equal(h.imported.sightings.zorro_rojo,12100);
 h.tick();
 assert.equal(h.imported.prestige,4);
 assert.equal(Object.values(h.imported.sightings).reduce((a,b)=>a+b,0),12139);
 h.finishTimers();
 assert.match(h.elements.saveManagerStatus.textContent,/Restauración confirmada/);
 assert.equal(h.elements.statPrestige.textContent,'4');
 assert.match(h.elements.statMoney.textContent,/4\.465/);
 const reboot=harness(store);
 assert.equal(reboot.window.AtlasSaveBridge.getSnapshot().prestige,4);
 assert.equal(reboot.window.AtlasSaveBridge.getSnapshot().sightings,12139);
 reboot.tick();
 assert.equal(JSON.parse(store[KEY]).prestige,4);
});
test('restaurar una partida no la sobrescribe con la sesión anterior',async()=>{
 const store={[KEY]:JSON.stringify({...backup.game,money:420,prestige:0,sightings:{}})};
 const h=harness(store);
 h.tick();
 await h.import();
 h.tick();
 assert.equal(h.window.AtlasSaveBridge.getSnapshot().prestige,4);
 assert.equal(h.imported.prestige,4);
});


test('ayudas de campo otorgan exactamente 500 conocimiento y 50 avistamientos confirmados',()=>{
 const h=harness({});
 const original=JSON.parse(h.store[KEY]);
 h.evalInGame('fieldAid("knowledge")');
 assert.equal(JSON.parse(h.store[KEY]).knowledge-original.knowledge,500);
 const before=JSON.parse(h.store[KEY]);
 h.evalInGame('fieldAid("sightings")');
 const after=JSON.parse(h.store[KEY]);
 const count=s=>Object.values(s.sightings).reduce((a,b)=>a+b,0);
 assert.equal(count(after)-count(before),50);
 h.tick();
 const reboot=harness(h.store);
 assert.equal(count(JSON.parse(reboot.store[KEY])),count(after));
});

test('Fondos científicos IV exige III y desbloquea canje x1000 por £100000',()=>{
 const h=harness({});
 const initial={...JSON.parse(h.store[KEY]),money:300000,knowledge:20000,
    purchases:{fondos_x1:1,fondos_x10:1}};
 h.window.AtlasSaveBridge.restoreGame(initial);
 h.evalInGame('spendMoneyForKnowledge(1000)');
 assert.equal(JSON.parse(h.store[KEY]).money,300000);
 h.evalInGame('buyNode("fondos_x1000")');
 assert.equal(JSON.parse(h.store[KEY]).purchases.fondos_x1000,undefined);
 h.evalInGame('buyNode("fondos_x100")');
 h.evalInGame('buyNode("fondos_x1000")');
 const purchased=JSON.parse(h.store[KEY]);
 assert.equal(purchased.purchases.fondos_x1000,1);
 assert.equal(purchased.upgrades.fundingTier,1000);
 assert.match(h.evalInGame('renderSociety()'),/×1000/);
 h.evalInGame('spendMoneyForKnowledge(1000)');
 const after=JSON.parse(h.store[KEY]);
 assert.equal(after.money,purchased.money-100000);
 assert.equal(after.knowledge,purchased.knowledge+70000);
});

test('coronas de laboratorio x5000 se canjean 1:1 y persisten',()=>{
 const h=harness({});
 h.evalInGame('buyCrownPack(5000)');
 let current=JSON.parse(h.store[KEY]);
 assert.equal(current.crownCoins,5000);
 assert.match(h.evalInGame('renderCrown()'),/5.000 coronas/);
 h.evalInGame('exchangeTrialCrowns(5000)');
 current=JSON.parse(h.store[KEY]);
 assert.equal(current.crownCoins,0);
 assert.equal(current.money,5420);
});

test('primeras misiones científicas permiten cobrar una vez y conservar el premio',()=>{
 const h=harness({});
 assert.match(h.evalInGame('renderScientificMissions()'),/Primer censo de fauna/);
 h.evalInGame('claimScientificMission("censo_50")');
 assert.equal(JSON.parse(h.store[KEY]).purchases.mission_censo_50,undefined);
 h.evalInGame('fieldAid("sightings")');
 const before=JSON.parse(h.store[KEY]);
 h.evalInGame('claimScientificMission("censo_50")');
 const claimed=JSON.parse(h.store[KEY]);
 assert.equal(claimed.purchases.mission_censo_50,1);
 assert.equal(claimed.money-before.money,250);
 assert.equal(claimed.knowledge-before.knowledge,150);
 h.evalInGame('claimScientificMission("censo_50")');
 assert.equal(JSON.parse(h.store[KEY]).money,claimed.money);
 const reboot=harness(h.store);
 assert.equal(JSON.parse(reboot.store[KEY]).purchases.mission_censo_50,1);
});


test('Beta 3.7 registra visitas reales africanas, paga una vez y persiste',()=>{
 const h=harness({});
 const original=JSON.parse(h.store[KEY]);
 assert.equal(original.regionsVisited['HX-01-09'],true);
 const data={...original,prestige:100,inventory:{...original.inventory,africa_map:1},
   regionUnlocked:{...original.regionUnlocked,'HX-07-12':true,'HX-10-09':true,'HX-08-10':true}};
 h.window.AtlasSaveBridge.restoreGame(data);
 h.evalInGame('setRegion("HX-07-12")');
 h.evalInGame('setRegion("HX-10-09")');
 h.evalInGame('setRegion("HX-08-10")');
 const before=JSON.parse(h.store[KEY]);
 for(const id of ['HX-07-12','HX-10-09','HX-08-10'])assert.equal(before.regionsVisited[id],true);
 assert.match(h.evalInGame('renderScientificMissions()'),/Primer recorrido africano/);
 h.evalInGame('claimScientificMission("africa_3_regiones")');
 const paid=JSON.parse(h.store[KEY]);
 assert.equal(paid.purchases.mission_africa_3_regiones,1);
 assert.equal(paid.money-before.money,1600);
 h.evalInGame('claimScientificMission("africa_3_regiones")');
 assert.equal(JSON.parse(h.store[KEY]).money,paid.money);
 h.tick();
 const reopened=harness(h.store);
 assert.equal(JSON.parse(reopened.store[KEY]).purchases.mission_africa_3_regiones,1);
});

test('Beta 3.7 ordena las vitrinas del Museo por precio de muestra',()=>{
 const h=harness({});
 const data={...JSON.parse(h.store[KEY]),museum:{wing:3,exhibits:{zorro_rojo:true,af_rinoceronte_blanco:true,af_leon:true}},
  stages:{zorro_rojo:5,af_rinoceronte_blanco:5,af_leon:5},
  published:{zorro_rojo:true,af_rinoceronte_blanco:true,af_leon:true}};
 h.window.AtlasSaveBridge.restoreGame(data);
 const html=h.evalInGame('renderMuseum()');
 assert.match(html,/Galería nivel/);
 assert.ok(html.indexOf('<strong>Rinoceronte blanco</strong>')<html.indexOf('<strong>Zorro rojo</strong>'));
 assert.match(html,/muestra £150/i);
});


test('Beta 3.8: reconocimientos africanos respetan mapa, prestigio, recursos y guardado',()=>{
 const h=harness({});
 const initial=JSON.parse(h.store[KEY]);
 assert.equal(h.evalInGame('availableVoyages().some(v=>v.id==="ethiopia_survey")'),false);
 h.evalInGame('sail("ethiopia_survey")');
 assert.equal(JSON.parse(h.store[KEY]).voyages.length,0);
 h.window.AtlasSaveBridge.restoreGame({...initial,money:5000,knowledge:5000,prestige:100,
  inventory:{...initial.inventory,africa_map:1},
  upgrades:{...initial.upgrades,shipyard:1,routeTier:2}});
 assert.equal(h.evalInGame('availableVoyages().some(v=>v.id==="ethiopia_survey")'),true);
 assert.equal(h.evalInGame('availableVoyages().some(v=>v.id==="namib_survey")'),true);
 const before=JSON.parse(h.store[KEY]);
 h.evalInGame('sail("ethiopia_survey")');
 const underway=JSON.parse(h.store[KEY]);
 assert.equal(underway.voyages.length,1);
 assert.equal(underway.money,before.money-950);
 assert.equal(underway.knowledge,before.knowledge-380);
 h.evalInGame('finishVoyage('+underway.voyages[0].id+')');
 const after=JSON.parse(h.store[KEY]);
 assert.equal(after.voyages.length,0);
 assert.equal(after.money,before.money-950+1400);
 assert.equal(after.knowledge,before.knowledge-380+700);
 assert.ok((after.inventory.animal_trace||0)>=(before.inventory.animal_trace||0)+1);
 assert.deepEqual(after.sightings,before.sightings);
 assert.deepEqual(after.regionUnlocked,before.regionUnlocked);
 h.tick();
 const reopened=harness(h.store);
 const saved=JSON.parse(reopened.store[KEY]);
 assert.equal(saved.money,after.money);
 assert.ok(saved.inventory.animal_trace>=1);
});

test('Beta 3.8: no se puede enviar expedición africana sin Mapa de África',()=>{
 const h=harness({});
 const initial=JSON.parse(h.store[KEY]);
 h.window.AtlasSaveBridge.restoreGame({...initial,money:5000,knowledge:5000,prestige:100,
  upgrades:{...initial.upgrades,shipyard:1,routeTier:2}});
 h.evalInGame('sail("namib_survey")');
 assert.equal(JSON.parse(h.store[KEY]).voyages.length,0);
});


test('Beta 3.10: piezas del Museo requieren recursos y solo se catalogan una vez',()=>{
 const h=harness({});
 assert.equal(h.evalInGame('catalogMuseumCollection("fosil_catalogado")'),false);
 const before=JSON.parse(h.store[KEY]);
 h.window.AtlasSaveBridge.restoreGame({...before,knowledge:1300,inventory:{
  ...before.inventory,fossil_fragment:5,animal_trace:2,ancient_coin:3,map_fragment:2,parchment_scrap:1
 }});
 assert.match(h.evalInGame('renderMuseumCollections("fossils")'),/Fósil catalogado/);
 assert.match(h.evalInGame('renderMuseumCollections("artifacts")'),/Carta cartográfica histórica/);
 assert.equal(h.evalInGame('catalogMuseumCollection("fosil_catalogado")'),true);
 const once=JSON.parse(h.store[KEY]);
 assert.equal(once.inventory.fossil_fragment,2);
 assert.equal(once.knowledge,1120);
 assert.equal(once.museum.collections.fosil_catalogado,true);
 assert.equal(h.evalInGame('catalogMuseumCollection("fosil_catalogado")'),false);
 assert.equal(JSON.parse(h.store[KEY]).inventory.fossil_fragment,2);
 assert.equal(h.evalInGame('catalogMuseumCollection("huella_paleontologica")'),true);
 assert.equal(h.evalInGame('catalogMuseumCollection("carta_historica")'),true);
 assert.equal(h.evalInGame('catalogMuseumCollection("medallon_viajero")'),true);
 const now=JSON.parse(h.store[KEY]);
 assert.equal(Object.values(now.museum.collections).filter(Boolean).length,4);
 assert.equal(now.inventory.fossil_fragment,0);
 assert.equal(now.inventory.animal_trace,0);
 assert.equal(now.inventory.ancient_coin,0);
 assert.equal(now.inventory.map_fragment,0);
 assert.equal(now.inventory.parchment_scrap,0);
 assert.equal(now.knowledge,340);
 assert.match(h.evalInGame('renderMuseumCollections("fossils")'),/2\/2 piezas catalogadas/);
 h.tick();
 const reopened=harness(h.store);
 const saved=JSON.parse(reopened.store[KEY]);
 assert.equal(Object.values(saved.museum.collections).filter(Boolean).length,4);
 assert.equal(saved.inventory.fossil_fragment,0);
});

test('Beta 3.10: exportar e importar mantiene el registro del Museo, incluso con guardado antiguo',()=>{
 const h=harness({});
 const old=JSON.parse(h.store[KEY]);
 const incoming={...old,knowledge:750,museum:{wing:2,exhibits:{},collections:{fosil_catalogado:true}}};
 h.window.AtlasSaveBridge.restoreGame(incoming);
 h.tick();
 assert.equal(JSON.parse(h.store[KEY]).museum.collections.fosil_catalogado,true);
 const noCollections={...old,museum:{wing:2,exhibits:{}}};
 h.window.AtlasSaveBridge.restoreGame(noCollections);
 assert.match(h.evalInGame('renderMuseumCollections("fossils")'),/0\/2 piezas catalogadas/);
 assert.equal(JSON.parse(h.store[KEY]).museum.wing,2);
});


test('Beta 3.10.1: los 17 animales de Rift y Seychelles tienen condiciones accesibles',()=>{
 const h=harness({});
 const idsByRegion={
  'HX-08-12':['af_flamenco_enano','af_pelicano_blanco','af_jirafa_rothschild','af_gran_kudu','af_hipopotamo','af_leon','af_bufalo_cafre','af_aguila_pescadora','af_guepardo'],
  'HX-07-14':['af_tortuga_aldabra','af_loro_negro_seychelles','af_cernicalo_seychelles','af_tiburon_puntas_negras','af_tortuga_laúd','af_manta_gigante','af_dugongo','af_delfin_jorobado_indico']
 };
 for(const [region,ids] of Object.entries(idsByRegion)){
  for(const id of ids){
   const found=h.evalInGame('REGIONS.find(r=>r.id==="'+region+'").habitats.some(h=>window.__atlasTest.SPECIES["'+id+'"].habitats.includes(h))');
   assert.ok(found,region+' '+id+' inaccesible');
  }
 }
 for(const [id,region,habitat,time,season] of [
  ['af_leon','HX-08-12','pradera','dia','invierno'],
  ['af_guepardo','HX-08-12','estepa','dia','invierno'],
  ['af_flamenco_enano','HX-08-12','humedal','dia','invierno'],
  ['af_pelicano_blanco','HX-08-12','humedal','dia','invierno'],
  ['af_aguila_pescadora','HX-08-12','rio','dia','invierno'],
  ['af_tortuga_aldabra','HX-07-14','bosque','amanecer','invierno'],
  ['af_cernicalo_seychelles','HX-07-14','bosque','dia','invierno'],
  ['af_tiburon_puntas_negras','HX-07-14','costa','noche','invierno']
 ]){
  const answer=h.evalInGame('eligibleSpecies("'+region+'","'+habitat+'","'+time+'","'+season+'").includes("'+id+'")');
  assert.ok(answer,id+' debería ser observable en '+region+' '+habitat+' '+time+' '+season);
 }
 const before=JSON.parse(h.store[KEY]);
 h.tick();
 assert.equal(JSON.parse(h.store[KEY]).prestige,before.prestige);
});


test('Beta 3.11: cinco pestañas independientes y muestras por ingreso',()=>{
 const h=harness({});
 const initial=JSON.parse(h.store[KEY]);
 h.window.AtlasSaveBridge.restoreGame({...initial,museum:{wing:3,exhibits:{zorro_rojo:true,af_rinoceronte_blanco:true,af_leon:true}},
  published:{zorro_rojo:true,af_rinoceronte_blanco:true,af_leon:true},
  stages:{zorro_rojo:5,af_rinoceronte_blanco:5,af_leon:5}});
 const page=h.evalInGame('renderMuseum()');
 for(const label of ['Exposiciones','Muestras','Fósiles','Relictos','Artefactos'])assert.ok(page.includes(label),label);
 assert.equal((page.match(/data-action="museum-tab"/g)||[]).length,5);
 const a=h.evalInGame('renderMuseumSamples({zorro_rojo:true,af_rinoceronte_blanco:true,af_leon:true},3)');
 assert.ok(a.indexOf('Rinoceronte blanco')<a.indexOf('Zorro rojo'));
 assert.match(a,/ordenados por ingresos £\/s/);
 const gallery=h.evalInGame('renderMuseumExtraGallery()');
 assert.match(gallery,/Cuando catalogues fósiles/);
 const saved=JSON.parse(h.store[KEY]);
 assert.equal(saved.museum.wing,3);
 assert.equal(Object.values(saved.museum.exhibits).filter(Boolean).length,3);
});

test('Beta 3.11: 90 fragmentos, 1 cráneo y 10 dientes producen un T. rex único',()=>{
 const h=harness({});
 const initial=JSON.parse(h.store[KEY]);
 h.window.AtlasSaveBridge.restoreGame({...initial,knowledge:2500,
  inventory:{...initial.inventory,fossil_fragment:90,fossil_skull:1,fossil_tooth:10}});
 assert.equal(h.evalInGame('craftMuseumFossil("bone_long",10)'),true);
 assert.equal(h.evalInGame('craftMuseumFossil("bone_short",10)'),true);
 assert.equal(h.evalInGame('craftMuseumFossil("bone_short",10)'),true);
 assert.equal(h.evalInGame('craftMuseumFossil("bone_short",5)'),true);
 assert.equal(h.evalInGame('craftMuseumFossil("carnivore_skull",1)'),true);
 const assembled=JSON.parse(h.store[KEY]);
 assert.equal(assembled.inventory.fossil_fragment,0);
 assert.equal(assembled.inventory.fossil_tooth,0);
 assert.equal(assembled.inventory.fossil_skull,0);
 assert.equal(assembled.inventory.bone_long,10);
 assert.equal(assembled.inventory.bone_short,25);
 assert.equal(assembled.inventory.carnivore_skull,1);
 assert.equal(h.evalInGame('craftMuseumFossil("trex_mount",1)'),true);
 const after=JSON.parse(h.store[KEY]);
 assert.equal(after.inventory.bone_short,0);
 assert.equal(after.inventory.bone_long,0);
 assert.equal(after.inventory.carnivore_skull,0);
 assert.equal(after.museum.collections.trex_mount,true);
 assert.equal(h.evalInGame('craftMuseumFossil("trex_mount",1)'),false);
 assert.match(h.evalInGame('renderMuseumExtraGallery()'),/Reconstrucción de T\. rex/);
 assert.deepEqual(after.sightings,initial.sightings);
 assert.equal(after.money,initial.money);
 assert.equal(after.prestige,initial.prestige);
 assert.equal(h.evalInGame('toggleMuseumDisplay("collection:trex_mount")'),true);
 assert.doesNotMatch(h.evalInGame('renderMuseumExtraGallery()'),/Reconstrucción de T\. rex/);
 assert.equal(h.evalInGame('toggleMuseumDisplay("collection:trex_mount")'),true);
 h.tick();
 const reboot=harness(h.store);
 assert.match(reboot.evalInGame('renderMuseumExtraGallery()'),/Reconstrucción de T\. rex/);
});

test('Beta 3.11: relictos no tributan al Atlas y se conservan en JSON',()=>{
 const h=harness({});
 const original=JSON.parse(h.store[KEY]);
 assert.equal(h.evalInGame('MUSEUM_RELICTS.length'),4);
 assert.equal(h.evalInGame('recordMuseumRelict("coelacanth_indic")'),true);
 assert.equal(h.evalInGame('recordMuseumRelict("coelacanth_indic")'),false);
 assert.equal(h.evalInGame('recordMuseumRelict("invalid")'),false);
 const before=JSON.parse(h.store[KEY]);
 h.tick();
 const after=JSON.parse(h.store[KEY]);
 assert.deepEqual(after.sightings,original.sightings);
 assert.deepEqual(after.discovered,original.discovered);
 assert.equal(after.money,original.money);
 assert.equal(after.prestige,original.prestige);
 assert.equal(after.museum.relicts.coelacanth_indic,true);
 assert.match(h.evalInGame('renderMuseumRelicts()'),/Celacanto del Índico/);
 assert.match(h.evalInGame('renderMuseumExtraGallery()'),/Celacanto del Índico/);
 assert.equal(h.evalInGame('toggleMuseumDisplay("relict:coelacanth_indic")'),true);
 assert.doesNotMatch(h.evalInGame('renderMuseumExtraGallery()'),/Celacanto del Índico/);
 const reopened=harness(h.store);
 assert.equal(JSON.parse(reopened.store[KEY]).museum.relicts.coelacanth_indic,true);
});

test('Beta 3.11: artefactos previos migran de pestaña sin consumir recursos ni borrar exhibiciones',()=>{
 const h=harness({});
 const old=JSON.parse(h.store[KEY]);
 const save={...old,museum:{wing:3,exhibits:{zorro_rojo:true},
   collections:{carta_historica:true,medallon_viajero:true,fosil_catalogado:true}}};
 h.window.AtlasSaveBridge.restoreGame(save);
 assert.match(h.evalInGame('renderMuseumArtifacts()'),/Carta cartográfica histórica/);
 assert.match(h.evalInGame('renderMuseumArtifacts()'),/Medallón de expedición/);
 assert.match(h.evalInGame('renderMuseumExtraGallery()'),/Fósil catalogado/);
 assert.equal(h.evalInGame('renderMuseumCollections("relicts").includes("Medallón de expedición")'),false);
 const after=JSON.parse(h.store[KEY]);
 assert.equal(after.museum.collections.carta_historica,true);
 assert.equal(after.museum.collections.medallon_viajero,true);
 assert.equal(after.museum.exhibits.zorro_rojo,true);
 assert.deepEqual(after.inventory,old.inventory);
});

test('Beta 3.11: misiones otorgan objetos una sola vez y viajes registran avances',()=>{
 const h=harness({});
 const old=JSON.parse(h.store[KEY]);
 h.window.AtlasSaveBridge.restoreGame({...old,sightings:{zorro_rojo:200},museum:{...old.museum,voyagesCompleted:3}});
 h.evalInGame('claimScientificMission("paleonto_campo_200")');
 h.evalInGame('claimScientificMission("paleonto_viajes_3")');
 const first=JSON.parse(h.store[KEY]);
 assert.equal(first.inventory.fossil_fragment,6);
 assert.equal(first.inventory.fossil_tooth,5);
 assert.equal(first.inventory.fossil_skull,1);
 h.evalInGame('claimScientificMission("paleonto_campo_200")');
 h.evalInGame('claimScientificMission("paleonto_viajes_3")');
 const again=JSON.parse(h.store[KEY]);
 assert.equal(again.inventory.fossil_fragment,6);
 assert.equal(again.inventory.fossil_tooth,5);
 assert.equal(again.inventory.fossil_skull,1);
 assert.equal(h.evalInGame('resolveVoyageReward({type:"coast"})'),true);
 h.tick();
 assert.equal(JSON.parse(h.store[KEY]).museum.voyagesCompleted,4);
});

test('Beta 3.11: taller impide fabricaciones sin materiales y múltiples ejemplares finales',()=>{
 const h=harness({});
 assert.equal(h.evalInGame('craftMuseumFossil("bone_short",1)'),false);
 assert.equal(h.evalInGame('craftMuseumFossil("bone_short",0)'),false);
 assert.equal(h.evalInGame('craftMuseumFossil("bone_short",-1)'),false);
 assert.equal(h.evalInGame('craftMuseumFossil("bone_short",101)'),false);
 assert.equal(h.evalInGame('craftMuseumFossil("trex_mount",5)'),false);
 assert.equal(h.evalInGame('craftMuseumFossil("nope",1)'),false);
 assert.equal(h.evalInGame('toggleMuseumDisplay("relict:coelacanth_indic")'),false);
 assert.match(h.evalInGame('renderFossilWorkshop()'),/Reconstrucción de T\. rex/);
});


test('Beta 3.12: tres dinosaurios nuevos se montan una única vez, sin afectar el Atlas',()=>{
 const recipes=[
  ['triceratops_mount',{bone_long:8,bone_short:18,herbivore_skull:1}],
  ['stegosaurus_mount',{bone_long:12,bone_short:20,fossil_plate:5}],
  ['spinosaurus_mount',{bone_long:14,bone_short:18,carnivore_skull:1,fossil_sail:3}]
 ];
 for(const [id,materials] of recipes){
  const h=harness({}),old=JSON.parse(h.store[KEY]);
  h.window.AtlasSaveBridge.restoreGame({...old,inventory:{...old.inventory,...materials}});
  assert.equal(h.evalInGame('craftMuseumFossil("'+id+'",1)'),true,id);
  const next=JSON.parse(h.store[KEY]);
  assert.equal(next.museum.collections[id],true);
  for(const key of Object.keys(materials))assert.equal(next.inventory[key],0,key);
  assert.equal(h.evalInGame('craftMuseumFossil("'+id+'",1)'),false,id+' se duplica');
  assert.match(h.evalInGame('renderMuseumExtraGallery()'),new RegExp(id==='triceratops_mount'?'Triceratops':id==='stegosaurus_mount'?'Estegosaurio':'Espinosaurio'));
  assert.equal(h.evalInGame('toggleMuseumDisplay("collection:'+id+'")'),true);
  assert.equal(h.evalInGame('toggleMuseumDisplay("collection:'+id+'")'),true);
  assert.deepEqual(next.discovered,old.discovered);
  assert.deepEqual(next.sightings,old.sightings);
  assert.equal(next.money,old.money);
  assert.equal(next.prestige,old.prestige);
  h.tick();
  const reboot=harness(h.store);
  assert.equal(JSON.parse(reboot.store[KEY]).museum.collections[id],true);
 }
});

test('Beta 3.12: piezas intermedias fósiles se fabrican con recetas explícitas',()=>{
 const h=harness({}),old=JSON.parse(h.store[KEY]);
 const inv={...old.inventory,fossil_fragment:25,fossil_skull:1,fossil_tooth:6};
 h.window.AtlasSaveBridge.restoreGame({...old,inventory:inv});
 assert.equal(h.evalInGame('craftMuseumFossil("herbivore_skull",1)'),true);
 assert.equal(h.evalInGame('craftMuseumFossil("fossil_plate",2)'),true);
 assert.equal(h.evalInGame('craftMuseumFossil("fossil_sail",1)'),true);
 const now=JSON.parse(h.store[KEY]);
 assert.equal(now.inventory.herbivore_skull,1);
 assert.equal(now.inventory.fossil_plate,2);
 assert.equal(now.inventory.fossil_sail,1);
 assert.equal(now.inventory.fossil_skull,0);
 assert.equal(now.inventory.fossil_tooth,0);
 assert.equal(now.inventory.fossil_fragment,7);
});

test('Beta 3.12: artefactos consumen materiales y aparecen en vitrinas sin doble pago',()=>{
 const h=harness({}),old=JSON.parse(h.store[KEY]);
 h.window.AtlasSaveBridge.restoreGame({...old,knowledge:3000,inventory:{
  ...old.inventory,brass_shard:5,old_ink:1,carved_wood:2,polished_lens:1,ancient_coin:1,parchment_scrap:3,map_fragment:6
 }});
 for(const id of ['astrolabio_laton','diario_explorador','globo_cartografico']){
  assert.equal(h.evalInGame('catalogMuseumCollection("'+id+'")'),true,id);
  assert.equal(h.evalInGame('catalogMuseumCollection("'+id+'")'),false,id+' doble fabricación');
  assert.match(h.evalInGame('renderMuseumExtraGallery()'),id==='astrolabio_laton'?/Astrolabio de latón/:id==='diario_explorador'?/Diario de explorador/:/Globo cartográfico antiguo/);
  assert.match(h.evalInGame('museumCardArt("","'+id+'")'),/<svg viewBox="0 0 100 100"/);
 }
 const after=JSON.parse(h.store[KEY]);
 assert.equal(after.inventory.brass_shard,0);
 assert.equal(after.inventory.old_ink,0);
 assert.equal(after.inventory.carved_wood,0);
 assert.equal(after.inventory.map_fragment,0);
 assert.equal(after.museum.collections.astrolabio_laton,true);
 assert.equal(after.museum.collections.diario_explorador,true);
 assert.equal(after.museum.collections.globo_cartografico,true);
 assert.equal(after.prestige,old.prestige);
 h.tick();
 const reboot=harness(h.store);
 assert.equal(JSON.parse(reboot.store[KEY]).museum.collections.globo_cartografico,true);
});

test('Beta 3.12: dos relictos adicionales no entran en estadísticas del Atlas',()=>{
 const h=harness({}),old=JSON.parse(h.store[KEY]);
 assert.equal(h.evalInGame('MUSEUM_RELICTS.length'),6);
 assert.equal(h.evalInGame('recordMuseumRelict("angonoka")'),true);
 assert.equal(h.evalInGame('recordMuseumRelict("african_lungfish")'),true);
 assert.equal(h.evalInGame('recordMuseumRelict("angonoka")'),false);
 h.tick();
 const after=JSON.parse(h.store[KEY]);
 assert.equal(after.museum.relicts.angonoka,true);
 assert.equal(after.museum.relicts.african_lungfish,true);
 assert.deepEqual(after.discovered,old.discovered);
 assert.deepEqual(after.sightings,old.sightings);
 assert.equal(after.money,old.money);
 assert.equal(after.prestige,old.prestige);
 assert.match(h.evalInGame('renderMuseumRelicts()'),/Tortuga angonoka/);
 assert.match(h.evalInGame('renderMuseumRelicts()'),/Pez pulmonado africano/);
 const reboot=harness(h.store);
 assert.equal(JSON.parse(reboot.store[KEY]).museum.relicts.angonoka,true);
});

test('Beta 3.12: misión de cinco viajes entrega materiales de artefactos una sola vez',()=>{
 const h=harness({}),old=JSON.parse(h.store[KEY]);
 h.window.AtlasSaveBridge.restoreGame({...old,museum:{...old.museum,voyagesCompleted:5}});
 h.evalInGame('claimScientificMission("artifactos_viajes_5")');
 const after=JSON.parse(h.store[KEY]);
 assert.equal(after.inventory.brass_shard,2);
 assert.equal(after.inventory.old_ink,1);
 assert.equal(after.inventory.carved_wood,2);
 assert.equal(after.inventory.map_fragment,2);
 h.evalInGame('claimScientificMission("artifactos_viajes_5")');
 assert.equal(JSON.parse(h.store[KEY]).inventory.brass_shard,2);
});

test('Beta 3.12: ecología nueva preserva observación de fauna de Bangweulu y Lowveld',()=>{
 const h=harness({});
 for(const [id,region,habitat,time,season] of [
  ['af_picozapato','HX-09-12','humedal','dia','invierno'],
  ['af_lechwe_negro','HX-09-12','humedal','dia','invierno'],
  ['af_grulla_carunculada','HX-09-12','pradera','dia','invierno'],
  ['af_impala','HX-11-10','pradera','dia','invierno'],
  ['af_calao_trompetero','HX-11-10','bosque','dia','invierno']
 ]){
  assert.ok(h.evalInGame('eligibleSpecies("'+region+'","'+habitat+'","'+time+'","'+season+'").includes("'+id+'")'),id+' no observable');
 }
});
