const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const SRC=fs.readFileSync('www/js/app.js','utf8');
const CSS=fs.readFileSync('www/css/styles.css','utf8');
function game(){
 const dom={};
 const node=id=>dom[id]||(dom[id]={id,hidden:false,disabled:false,innerHTML:'',textContent:'',value:'',
  dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},
  querySelector(){return null},querySelectorAll(){return []},focus(){},click(){}});
 const cache={};
 const context=vm.createContext({window:{confirm(){return true}},
  document:{getElementById:node,querySelectorAll(){return []},addEventListener(){},
   body:{classList:{add(){},remove(){}},appendChild(){}}},
  localStorage:{getItem:k=>cache[k]||null,setItem:(k,v)=>cache[k]=String(v),removeItem:k=>delete cache[k]},
  TextEncoder,Date,Math,Number,JSON,Map,Set,console,URL,Blob,Intl,
  setInterval(){return 1},setTimeout(){return 1}});
 const injected=SRC.replace(/\nrender\(\);\s*\}\)\(\);\s*$/,
  '\nwindow.__v316={SPECIES,REGIONS,ITEMS,RECIPES,V316_MATERIAL_STUDIES,V316_LOOT_BASE,V316_LOOT_BY_ROUTE,'+
   'V316_ORIGINS,rollLoot,canCraft,craftItem,canProcessMaterials,processMaterials,manualEncounterBonus,'+
   'knowledgeBonus,museumRate,renderObjects,v316ItemUses,get state(){return state}};\n})();');
 assert.notEqual(injected,SRC,'No se encontró el punto de prueba');
 vm.runInContext(injected,context,{filename:'app.js'});
 return context.window.__v316;
}
test('Beta 3.16 mantiene catálogo, mapa y materiales de recetas coherentes',()=>{
 const x=game();
 assert.equal(Object.keys(x.SPECIES).length,487);
 assert.equal(x.REGIONS.length,57);
 assert.ok(Object.keys(x.ITEMS).length>=47,'3.16 objects must persist as the museum expands');
 assert.ok(Object.keys(x.V316_MATERIAL_STUDIES).length>=8);
 for(const [name,recipe] of Object.entries(x.RECIPES)){
  assert.ok(x.ITEMS[name],'Producto de receta inexistente: '+name);
  for(const [ingredient,quantity] of Object.entries(recipe.requires)){
   assert.ok(x.ITEMS[ingredient],name+' requiere '+ingredient);
   assert.ok(quantity>0);
  }
 }
 for(const [name,study] of Object.entries(x.V316_MATERIAL_STUDIES)){
  assert.ok(study.knowledge>0||study.money>0,name);
  for(const [ingredient,quantity] of Object.entries(study.requires)){
   assert.ok(x.ITEMS[ingredient],name+' requiere '+ingredient);
   assert.ok(quantity>0);
  }
 }
});
test('Los materiales repetidos dan resultados reales y nunca dejan saldos negativos',()=>{
 const x=game();
 assert.equal(x.canProcessMaterials('herbarium',1),false);
 x.state.inventory.pressed_flower=15;
 x.state.inventory.parchment_scrap=5;
 const before=x.state.knowledge;
 assert.equal(x.canProcessMaterials('herbarium',5),true);
 assert.equal(x.processMaterials('herbarium',5),true);
 assert.equal(x.state.knowledge,before+200);
 assert.equal(x.state.inventory.pressed_flower,0);
 assert.equal(x.state.inventory.parchment_scrap,0);
 assert.equal(x.processMaterials('herbarium',1),false);
 assert.equal(x.state.knowledge,before+200);
 assert.equal(x.canProcessMaterials('herbarium',0),false);
 assert.equal(x.canProcessMaterials('herbarium',10),false);
});
test('Catalejo fabricado consume prismáticos y desactiva la herramienta anterior',()=>{
 const x=game();
 Object.assign(x.state.inventory,{binoculars:1,polished_lens:2,brass_shard:2,parchment_scrap:2});
 x.state.equipment.instrument='binoculars';
 assert.equal(x.canCraft('field_telescope'),true);
 x.craftItem('field_telescope');
 assert.equal(x.state.inventory.binoculars,0);
 assert.equal(x.state.inventory.field_telescope,1);
 assert.equal(x.state.equipment.instrument,null);
 x.state.equipment.instrument='field_telescope';
 assert.ok(Math.abs(x.manualEncounterBonus()-1.24)<1e-9);
});
test('Sombrero y medallón producen bonificaciones cuantificables',()=>{
 const x=game();
 x.state.equipment.hat='scholar_hat';
 assert.ok(Math.abs(x.knowledgeBonus()-1.2)<1e-9);
 x.state.museum.exhibits.zorro_rojo=true;
 const before=x.museumRate();
 x.state.equipment.necklace='museum_medallion';
 assert.ok(Math.abs(x.museumRate()/before-1.10)<1e-9);
});
test('Botín de viajes contiene materiales, no equipamiento terminados, y fragmentos geográficos',()=>{
 const x=game();
 for(const [id,weight] of x.V316_LOOT_BASE){
  assert.ok(x.ITEMS[id],id);
  assert.notEqual(x.ITEMS[id].kind,'equip',id);
  assert.ok(weight>0);
 }
 for(const [route,entries] of Object.entries(x.V316_LOOT_BY_ROUTE)){
  assert.ok(entries.length>0,route);
  for(const [id,weight] of entries){
   assert.ok(x.ITEMS[id],route+':'+id);
   assert.notEqual(x.ITEMS[id].kind,'equip',route+':'+id);
   assert.ok(weight>0);
  }
 }
 assert.ok(x.V316_LOOT_BY_ROUTE.atlantic_survey.some(row=>row[0]==='north_america_map_piece'));
 assert.ok(x.V316_LOOT_BY_ROUTE.north.some(row=>row[0]==='asia_map_piece'));
 assert.ok(x.V316_LOOT_BY_ROUTE.balkans.some(row=>row[0]==='africa_map_piece'));
 assert.equal(x.rollLoot('north',()=>0),x.V316_LOOT_BASE[0][0]);
 assert.equal(x.rollLoot('north',()=>0.99),null);
});
test('Inventario móvil ofrece cinco pestañas, origen, usos y estudio ×1/×5',()=>{
 const x=game();
 for(const tab of ['equipo','animales','expedicion','coleccionables','taller']){
  x.state.inventoryView=tab;
  const html=x.renderObjects();
  assert.match(html,/data-id="taller"/);
  assert.doesNotMatch(html,/>undefined</);
  if(tab==='taller'){
   assert.match(html,/Estudios de materiales repetidos/);
   assert.match(html,/data-action="process-materials"/);
   assert.match(html,/Estudiar ×1/);
   assert.match(html,/Estudiar ×5/);
   assert.match(html,/Catalejo de precisión/);
  }
  if(tab==='coleccionables'){
   assert.match(html,/Ámbar fósil/);
   assert.match(html,/Perla fluvial/);
  }
  if(tab==='expedicion')assert.match(html,/Obtención:/);
 }
 assert.match(CSS,/\.inventory-v33 \.inventory-subtabs\{grid-template-columns:repeat\(5/);
 assert.match(CSS,/@media\(max-width:400px\)/);
 assert.match(SRC,/\['equipo','animales','expedicion','coleccionables','taller'\]\.includes\(id\)/);
});
test('Las nuevas materias primas aparecen en recetas, y el museo conserva las anteriores',()=>{
 const x=game();
 assert.ok(x.RECIPES.museum_medallion.requires.fossil_amber===1);
 assert.ok(x.RECIPES.museum_medallion.requires.river_pearl===1);
 assert.ok(x.RECIPES.field_telescope.requires.binoculars===1);
 assert.ok(x.RECIPES.scholar_hat.requires.field_hat===1);
 assert.ok(x.v316ItemUses('fossil_fragment').some(n=>n.includes('Museo')||n.includes('paleontológico')));
 assert.match(SRC,/museumCollectionReady/);
 assert.match(SRC,/MUSEUM_FOSSIL_RECIPES/);
 assert.match(SRC,/river_pearl.*found\.push\('perla fluvial'\)/);
});
