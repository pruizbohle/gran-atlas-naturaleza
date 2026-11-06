// Beta 3.17 · Integración del motor de fósiles, guardados y bestiario.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const SOURCE=fs.readFileSync('www/js/app.js','utf8');
const CSS=fs.readFileSync('www/css/styles.css','utf8');
function game(saved=null){
 const els={},store={};
 if(saved)store.gran_atlas_v05=JSON.stringify(saved);
 const get=id=>els[id]||(els[id]={
  id,hidden:false,disabled:false,textContent:'',innerHTML:'',value:'',
  dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},
  addEventListener(){},setAttribute(){},querySelector(){return null},querySelectorAll(){return []},
  focus(){},click(){}
 });
 const document={getElementById:get,querySelectorAll(){return []},addEventListener(){},
  body:{classList:{add(){},remove(){}},appendChild(){}}};
 const localStorage={getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>delete store[k]};
 const context=vm.createContext({window:{confirm(){return true}},document,localStorage,
  TextEncoder,Date,Math,Number,JSON,Map,Set,console,URL,Blob,Intl,setInterval(){return 1},setTimeout(){return 1}});
 const exposed=SOURCE.replace(/\nrender\(\);\s*\}\)\(\);\s*$/,
  '\nwindow.__v317={SPECIES,REGIONS,ITEMS,MUSEUM_COLLECTIONS,MUSEUM_FOSSIL_RECIPES,MUSEUM_DIG_SITES,'+
  'MUSEUM_FOSSIL_SETS,MUSEUM_CURATORIAL_PROJECTS,RESEARCH_V317_NODES,canStartExcavation,startExcavation,'+
  'collectExcavation,canCurateMuseum,curateMuseum,museumRate,museumFossilSetBonus,museumCurationBonus,'+
  'museumFossilMountCount,renderMuseum,renderBestiary,renderExcavations,renderFossilWorkshop,'+
  'renderMuseumCuration,museumCardArt,renderObjects,craftMuseumFossil,museumAssemblyReady,get state(){return state}};\n})();');
 assert.notEqual(exposed,SOURCE,'Cannot expose game state');
 vm.runInContext(exposed,context,{filename:'www/js/app.js'});
 return context.window.__v317;
}
test('El Atlas mantiene las 487 especies y 57 zonas; nuevas recetas y colecciones válidas',()=>{
 const g=game();
 assert.equal(Object.keys(g.SPECIES).length,487);
 assert.equal(g.REGIONS.length,57);
 assert.equal(g.MUSEUM_DIG_SITES.length,4);
 assert.equal(g.MUSEUM_FOSSIL_RECIPES.filter(p=>p.unique).length,8);
 assert.equal(g.MUSEUM_FOSSIL_SETS.length,3);
 for(const list of [g.MUSEUM_FOSSIL_RECIPES,g.MUSEUM_COLLECTIONS,g.MUSEUM_CURATORIAL_PROJECTS]){
  for(const p of list){
   for(const [id,qty] of Object.entries(p.requires))
    if(Array.isArray(p.requires))assert.ok(g.MUSEUM_FOSSIL_RECIPES.some(x=>x.id===id));
    else {assert.ok(g.ITEMS[id],p.id+': missing '+id);assert.ok(qty>0,p.id+': invalid quantity');}
  }
 }
 for(const site of g.MUSEUM_DIG_SITES){
  assert.ok(g.REGIONS.some(x=>x.id===site.region),site.id+' missing region');
  assert.ok(site.fragments[0]>0&&site.fragments[0]<=site.fragments[1]);
  for(const p of ['tooth','track','claw','skull'])assert.ok(site[p]>=0&&site[p]<=1);
 }
});
test('Bestiario oculta solo monografías, no especies 5/5 sin publicación',()=>{
 const g=game();
 g.state.stages.zorro_rojo=5;
 g.state.stages.lobo_gris=5;
 g.state.published.zorro_rojo=true;
 let all=g.renderBestiary();
 assert.equal((all.match(/class="species-card\b/g)||[]).length,487);
 g.state.bestiaryHideMonographs=true;
 let incomplete=g.renderBestiary();
 assert.equal((incomplete.match(/class="species-card\b/g)||[]).length,486);
 assert.match(incomplete,/486 de 487 visibles/);
 assert.match(incomplete,/data-action="bestiary-hide-monographs" checked/);
 assert.match(incomplete,/Identificadas/);
 g.state.bestiarySort='rarity';g.state.bestiaryDescending=true;
 assert.match(g.renderBestiary(),/Rareza ↓/);
 assert.match(SOURCE,/state\.bestiaryHideMonographs=!state\.bestiaryHideMonographs;renderPanel\(\);persist\(\);/);
});
test('Excavaciones requieren fondos, región, y solo ocupan una ranura inicialmente',()=>{
 const g=game();
 assert.equal(g.canStartExcavation('british_cliffs'),false);
 g.state.money=10000;g.state.knowledge=10000;
 assert.equal(g.canStartExcavation('british_cliffs'),true);
 assert.equal(g.canStartExcavation('alpine_basin'),false,'Alps initially locked');
 const m=g.state.money,k=g.state.knowledge;
 assert.equal(g.startExcavation('british_cliffs',10000),true);
 assert.equal(g.state.money,m-55);
 assert.equal(g.state.knowledge,k-15);
 assert.equal(g.startExcavation('british_cliffs',10000),false);
 assert.equal(g.state.museum.excavations.length,1);
 assert.equal(g.collectExcavation(1,189999,()=>0),false,'not ready');
 assert.equal(g.collectExcavation(1,190000,()=>0),true);
 assert.equal(g.state.museum.excavationsCompleted,1);
 assert.equal(g.state.museum.excavations.length,0);
 assert.equal(g.state.inventory.fossil_fragment,2);
 assert.equal(g.state.inventory.fossil_track,1);
 assert.equal(g.state.inventory.fossil_claw,1);
 assert.equal(g.state.inventory.fossil_tooth,1);
 assert.equal(g.state.inventory.fossil_skull,1);
 assert.equal(g.collectExcavation(1,190000,()=>0),false,'cannot double collect');
});
test('Paleontología avanzada habilita dos campañas y mejora recompensas',()=>{
 const g=game();
 Object.assign(g.state.upgrades,{excavationTier:1,specimenPrep:1});
 g.state.purchases.africa_1=1;
 g.state.regionUnlocked['HX-02-09']=true;
 g.state.money=10000;g.state.knowledge=10000;
 assert.equal(g.startExcavation('british_cliffs',10000),true);
 assert.equal(g.startExcavation('alpine_basin',10000),true);
 assert.equal(g.startExcavation('alpine_basin',10000),false,'no third parallel site');
 assert.equal(g.collectExcavation(1,190000,()=>0.8),true);
 assert.equal(g.state.inventory.fossil_fragment,4,'3 max + 1 by research');
});
test('Restauración usa materiales, exige esqueleto y puede continuar después del montaje',()=>{
 const g=game();
 Object.assign(g.state.inventory,{fossil_fragment:8,old_ink:2});
 assert.equal(g.canCurateMuseum('cleaning'),false,'needs mounted dinosaur');
 g.state.museum.collections.trex_mount=true;
 assert.equal(g.canCurateMuseum('cleaning'),true);
 g.state.museum.exhibits.zorro_rojo=true;
 const old=g.museumRate(),knowledge=g.state.knowledge;
 assert.equal(g.curateMuseum('cleaning'),true);
 assert.equal(g.state.inventory.fossil_fragment,4);
 assert.equal(g.state.inventory.old_ink,1);
 assert.equal(g.state.knowledge,knowledge+80);
 assert.equal(g.state.museum.curationPoints,1);
 assert.ok(g.museumRate()>old);
 assert.equal(g.curateMuseum('cleaning'),true,'second study consumes last 4 fragments');
 assert.equal(g.curateMuseum('cleaning'),false,'no negative inventory');
 assert.equal(g.state.museum.curationPoints,2);
 g.state.museum.curationPoints=19;
 Object.assign(g.state.inventory,{fossil_track:2,animal_trace:1});
 assert.equal(g.curateMuseum('tracks'),true);
 assert.equal(g.state.museum.curationPoints,20,'curatorial cap');
});
test('Galerías paleontológicas bonifican solo con colecciones completas',()=>{
 const g=game();
 g.state.museum.exhibits.zorro_rojo=true;
 const base=g.museumRate();
 g.state.museum.collections.trex_mount=true;
 assert.equal(g.museumFossilSetBonus(),0);
 g.state.museum.collections.triceratops_mount=true;
 assert.ok(Math.abs(g.museumFossilSetBonus()-0.05)<1e-9);
 assert.ok(Math.abs(g.museumRate()/base-1.05)<1e-9);
 for(const id of ['stegosaurus_mount','ankylosaurus_mount','iguanodon_mount'])
  g.state.museum.collections[id]=true;
 assert.ok(Math.abs(g.museumFossilSetBonus()-0.10)<1e-9);
 assert.ok(Math.abs(g.museumRate()/base-1.10)<1e-9);
});
test('Recetas de anquilosaurio e iguanodonte se ensamblan una sola vez',()=>{
 const g=game();
 const ank=g.MUSEUM_FOSSIL_RECIPES.find(p=>p.id==='ankylosaurus_mount');
 assert.ok(ank.unique);
 for(const [id,qty] of Object.entries(ank.requires))g.state.inventory[id]=qty;
 assert.equal(g.museumAssemblyReady(ank),true);
 assert.equal(g.craftMuseumFossil('ankylosaurus_mount'),true);
 assert.equal(g.state.museum.collections.ankylosaurus_mount,true);
 assert.equal(g.craftMuseumFossil('ankylosaurus_mount'),false);
 assert.equal(g.museumAssemblyReady(ank),false);
 assert.match(g.museumCardArt('','ankylosaurus_mount'),/<svg viewBox="0 0 100 100"/);
 assert.match(g.museumCardArt('','iguanodon_mount'),/<svg viewBox="0 0 100 100"/);
});
test('Partida antigua sin campos nuevos se recupera y mantiene sus colecciones',()=>{
 const g=game({money:3500,knowledge:600,prestige:4,
  museum:{wing:2,exhibits:{},collections:{trex_mount:true},relicts:{},displays:{},voyagesCompleted:17},
  published:{zorro_rojo:true},bestiarySort:'alpha',regionUnlocked:{'HX-01-09':true}});
 assert.ok(Array.isArray(g.state.museum.excavations));
 assert.equal(g.state.museum.excavations.length,0);
 assert.equal(g.state.museum.curationPoints,0);
 assert.equal(g.state.museum.excavationsCompleted,0);
 assert.equal(g.state.museum.collections.trex_mount,true);
 assert.equal(g.state.published.zorro_rojo,true);
 assert.equal(g.state.bestiaryHideMonographs,false);
 assert.match(g.renderFossilWorkshop(),/Yacimientos disponibles/);
 assert.match(g.renderMuseum(),/Paleontología/);
 assert.match(CSS,/\.bestiary-v317-filter/);
 assert.match(CSS,/@media\(max-width:600px\)/);
});
