const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const SRC=require('./helpers/legacy-source.cjs').withoutOceania3290(fs.readFileSync('www/js/app.js','utf8'));
const CSS=fs.readFileSync('www/css/styles.css','utf8');
function game(){
 const dom={};
 const node=id=>dom[id]||(dom[id]={id,hidden:false,disabled:false,innerHTML:'',textContent:'',value:'',
  dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},
  querySelector(){return null},querySelectorAll(){return []},focus(){},click(){}});
 const cache={};
 const context=vm.createContext({AtlasFieldUI:require('../www/js/field-ui-v3210.js'),AtlasFieldScene:require('../www/js/field-scene-v3210.js'),window:{confirm(){return true}},
  document:{getElementById:node,querySelectorAll(){return []},addEventListener(){},
   body:{classList:{add(){},remove(){}},appendChild(){}}},
  localStorage:{getItem:k=>cache[k]||null,setItem:(k,v)=>cache[k]=String(v),removeItem:k=>delete cache[k]},
  TextEncoder,Date,Math,Number,JSON,Map,Set,console,URL,Blob,Intl,
  setInterval(){return 1},setTimeout(){return 1}});
 vm.runInContext(fs.readFileSync('www/js/item-art-v3198.js','utf8'),context);
 const injected=SRC.replace(/\nrender\(\);\s*\}\)\(\);\s*$/,
  '\nwindow.__v316={SPECIES,REGIONS,ITEMS,RECIPES,V316_MATERIAL_STUDIES,V316_LOOT_BASE,V316_LOOT_BY_ROUTE,'+
   'V316_ORIGINS,rollLoot,canCraft,craftItem,canProcessMaterials,processMaterials,manualEncounterBonus,'+
   'knowledgeBonus,museumRate,renderObjects,v316ItemUses,MUSEUM_FOSSIL_RECIPES,MUSEUM_COLLECTIONS,equipItem,renderFossilWorkshop,craftMuseumFossil,renderItemArt,get state(){return state}};\n})();');
 assert.notEqual(injected,SRC,'No se encontró el punto de prueba');
 vm.runInContext(injected,context,{filename:'app.js'});
 return context.window.__v316;
}
const art=require('../www/js/item-art-v3198.js');
const baseline=require('./fixtures/inventory-v3197.json');
test('v3.19.8 preserves all 52 item definitions, recipes, eight studies and museum data',()=>{
 const x=game();for(const [name,value]of Object.entries(baseline))assert.deepEqual(JSON.parse(JSON.stringify(x[name])),value,name);
 assert.equal(Object.keys(x.ITEMS).length,52);assert.equal(Object.keys(x.V316_MATERIAL_STUDIES).length,8);
});
test('60 original deterministic SVGs work in Node without window or external resources',()=>{
 const x=game(),ids=[...Object.keys(x.ITEMS),...Object.keys(x.V316_MATERIAL_STUDIES).map(id=>'study:'+id)];
 assert.equal(art.ids.length,60);assert.equal(new Set(ids.map(art.renderItemArt)).size,60);
 for(const id of ids){const svg=art.renderItemArt(id);assert.match(svg,/viewBox="0 0 100 100"/);assert.match(svg,/<\/svg>$/);assert.doesNotMatch(svg,/NaN|undefined|Infinity|<script|<image|<filter|<animate|url\(|href=/);assert.equal(svg,art.renderItemArt(id));assert.equal(x.renderItemArt(id),svg);}
 assert.equal(art.renderItemArt('<unknown>'),'');
 for(const slot of ['instrument','hat','necklace']){assert.match(art.renderEmptySlot(slot),/opacity=".3"/);assert.doesNotMatch(art.renderEmptySlot(slot),/data-item-art/);}
});
test('inventory views use plates and preserve equip, upgrade, consumption and study actions',()=>{
 const x=game();
 for(const view of ['equipo','animales','expedicion','coleccionables','taller']){x.state.inventoryView=view;const html=x.renderObjects();assert.match(html,/data-item-art=/);for(const emoji of Object.values(x.ITEMS).map(i=>i.emoji))assert.ok(!html.includes('inventory-icon">'+emoji),view);}
 Object.assign(x.state.inventory,{binoculars:1,polished_lens:2,brass_shard:2,parchment_scrap:2});x.equipItem('binoculars');assert.equal(x.state.equipment.instrument,'binoculars');assert.equal(x.manualEncounterBonus(),1.12);
 x.craftItem('field_telescope');assert.equal(x.state.inventory.binoculars,0);assert.equal(x.state.equipment.instrument,null);assert.equal(x.state.inventory.field_telescope,1);x.equipItem('field_telescope');assert.equal(x.manualEncounterBonus(),1.24);
 Object.assign(x.state.inventory,{pressed_flower:3,parchment_scrap:1});const k=x.state.knowledge;x.processMaterials('herbarium',1);assert.equal(x.state.knowledge,k+40);assert.equal(x.state.inventory.pressed_flower,0);
 Object.assign(x.state.inventory,{fossil_fragment:4});x.craftMuseumFossil('bone_short',1);assert.equal(x.state.inventory.fossil_fragment,2);assert.equal(x.state.inventory.bone_short,1);
 assert.match(x.renderFossilWorkshop(),/data-item-art="bone_short"/);assert.match(x.renderFossilWorkshop(),/data-item-art="fossil_tooth"/);
});
test('offline manifest includes engine and isolated laboratory; script precedes game',()=>{
 const sw=fs.readFileSync('www/sw.js','utf8'),html=fs.readFileSync('www/index.html','utf8'),lab=fs.readFileSync('www/laboratorio-objetos.html','utf8');
 for(const asset of ['item-art-v3198.js','laboratorio-objetos.html','item-lab-v3198.js'])assert.ok(sw.includes(asset));
 assert.ok(html.indexOf('js/item-art-v3198.js')<html.indexOf('js/app.js'));assert.ok(lab.includes('item-art-v3198.js'));assert.ok(!lab.includes('src="js/app.js'));
 assert.doesNotMatch(fs.readFileSync('www/js/lab/item-lab-v3198.js','utf8'),/localStorage|sessionStorage|indexedDB/);
});
test('laboratory metadata matches the production catalog exactly',()=>{
 const x=game(),source=fs.readFileSync('www/js/lab/item-lab-v3198.js','utf8');
 const catalog=vm.runInNewContext(source.slice(0,source.indexOf('(function(){'))+'\nITEM_LAB_CATALOG');
 assert.equal(catalog.length,60);
 for(const row of catalog){const data=row.id.startsWith('study:')?x.V316_MATERIAL_STUDIES[row.id.slice(6)]:x.ITEMS[row.id];assert.ok(data,row.id);assert.equal(row.name,data.name);assert.equal(row.emoji,data.emoji);assert.ok(art.renderItemArt(row.id));}
});
