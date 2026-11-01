// Pruebas sin dependencias: recuperación JSON, almacenamiento y formato de la partida.
const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const source=fs.readFileSync('www/js/save-manager.js','utf8');
const KEY='gran_atlas_v05';
function fixture(){
 return {money:720,knowledge:400,prestige:7,currentRegion:'HX-01-09',
   discovered:{zorro_rojo:true},sightings:{zorro_rojo:1314},stages:{zorro_rojo:5},
   published:{zorro_rojo:true},upgrades:{},purchases:{},regionUnlocked:{'HX-01-09':true},
   inventory:{},sexSeen:{},voyages:[]};
}
function launch(store, options={}){
 const el={};
 function element(id){
   if(!el[id])el[id]={id,hidden:id==='saveManager',disabled:id==='saveImportBtn',
    textContent:'',value:'',files:[],style:{},listeners:{},classList:{add(){},remove(){},toggle(){}},
    setAttribute(){},focus(){},click(){},addEventListener(type,fn){
      (this.listeners[type]||=[]).push(fn);
    },async fire(type, data={}){
      for(const fn of this.listeners[type]||[])await fn(Object.assign({target:this,key:''},data));
    }};
   return el[id];
 }
 const storage={getItem(k){return Object.prototype.hasOwnProperty.call(store,k)?store[k]:null;},
 setItem(k,v){store[k]=String(v);},removeItem(k){delete store[k];}};
 const doc={getElementById:element,body:{classList:{add(){},remove(){}}},addEventListener(){}};
 let reloaded=false;
 let exported=null;
 const cap={getPlatform:()=> 'android',Plugins:{
   AtlasImport:{async openFile(){if(options.importError)throw options.importError;return {content:options.importContent||'',name:'respaldo.json'};}},
   AtlasExport:{async saveFile({content}){exported=content;return {uri:'content://example/test'};}}
 }};
 const win={Capacitor:cap,confirm:()=>true,location:{reload(){reloaded=true;}}};
 vm.runInNewContext(source,{document:doc,window:win,localStorage:storage,TextEncoder,
   console,setTimeout(){},URL,Blob});
 return {el,storage,get reloaded(){return reloaded;},get exported(){return exported;}};
}
test('exporta y recupera una partida real, confirmando escritura y reinicio',async()=>{
 const store={[KEY]:JSON.stringify(fixture())};
 const first=launch(store,{});
 await first.el.saveDownloadBtn.fire('click');
 assert.ok(first.exported.includes('el-gran-atlas-save'));
 const second=launch(store,{importContent:first.exported});
 await second.el.saveNativeImportBtn.fire('click');
 assert.equal(second.el.saveImportBtn.disabled,false);
 await second.el.saveImportBtn.fire('click');
 assert.equal(second.reloaded,true);
 assert.equal(JSON.parse(store[KEY]).sightings.zorro_rojo,1314);
 const third=launch(store,{});
 assert.match(third.el.saveManagerStatus.textContent,/partida importada/i);
 assert.match(third.el.saveImportSummary.textContent,/1314/);
});
test('rechaza un archivo JSON ajeno sin reemplazar la partida',async()=>{
 const store={[KEY]:JSON.stringify(fixture())};const before=store[KEY];
 const run=launch(store,{importContent:'{"foo":"bar"}'});
 await run.el.saveNativeImportBtn.fire('click');
 assert.equal(run.el.saveImportBtn.disabled,true);
 assert.equal(store[KEY],before);
 assert.match(run.el.saveImportSummary.textContent,/Faltan libras|no parece una partida/i);
});
test('acepta respaldo antiguo con campos opcionales ausentes',async()=>{
 const old=fixture();delete old.inventory;delete old.regionUnlocked;delete old.purchases;
 const store={[KEY]:JSON.stringify(fixture())};
 const run=launch(store,{importContent:JSON.stringify({state:old})});
 await run.el.saveNativeImportBtn.fire('click');
 assert.equal(run.el.saveImportBtn.disabled,false);
 await run.el.saveImportBtn.fire('click');
 assert.ok(JSON.parse(store[KEY]).regionUnlocked['HX-01-09']);
 assert.deepEqual(JSON.parse(store[KEY]).inventory,{});
});
test('permite restaurar por texto si Android no abre el documento',async()=>{
 const store={[KEY]:JSON.stringify(fixture())};
 const run=launch(store,{importError:{code:'CANCELLED'}});
 run.el.savePasteJson.value=JSON.stringify({format:'el-gran-atlas-save',formatVersion:1,game:fixture()});
 await run.el.savePasteBtn.fire('click');
 assert.equal(run.el.saveImportBtn.disabled,false);
});
test('mantiene intacta la partida al cancelar selector nativo',async()=>{
 const store={[KEY]:JSON.stringify(fixture())};const before=store[KEY];
 const run=launch(store,{importError:{code:'CANCELLED'}});
 await run.el.saveNativeImportBtn.fire('click');
 assert.equal(store[KEY],before);
 assert.equal(run.el.saveImportBtn.disabled,true);
});
