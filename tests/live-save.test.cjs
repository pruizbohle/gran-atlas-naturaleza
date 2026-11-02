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
 const testGame=GAME.replace(/\n\}\)\(\);\s*$/, '\nwindow.__atlasTest={fieldAid,spendMoneyForKnowledge,buyNode,buyCrownPack,exchangeTrialCrowns,renderCrown,renderSociety,renderScientificMissions,claimScientificMission};\n})();');
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
