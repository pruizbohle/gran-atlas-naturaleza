// Beta 3.18: relictos, rutas, recompensas paleontológicas y guardados antiguos.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const SOURCE=fs.readFileSync('www/js/app.js','utf8');
const CSS=fs.readFileSync('www/css/styles.css','utf8');
function game(saved=null){
 const store={},nodes={};
 if(saved)store.gran_atlas_v05=JSON.stringify(saved);
 const get=id=>nodes[id]||(nodes[id]={id,hidden:false,disabled:false,innerHTML:'',textContent:'',value:'',dataset:{},style:{},
  classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},querySelector(){return null},
  querySelectorAll(){return []},focus(){},click(){}});
 const doc={getElementById:get,querySelectorAll(){return []},addEventListener(){},
  body:{classList:{add(){},remove(){}},appendChild(){}}};
 const localStorage={getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k]};
 const context=vm.createContext({AtlasFieldUI:require('../www/js/field-ui-v3210.js'),AtlasFieldScene:require('../www/js/field-scene-v3210.js'),window:{confirm(){return true}},document:doc,localStorage,
  TextEncoder,Date,Math,Number,JSON,Map,Set,console,URL,Blob,Intl,setInterval(){return 1},setTimeout(){return 1}});
 const js=SOURCE.replace(/\nrender\(\);\s*\}\)\(\);\s*$/,
  '\nwindow.__beta318={SPECIES,REGIONS,ITEMS,MUSEUM_RELICTS,MUSEUM_RELICT_SETS,MUSEUM_RELICT_MILESTONES,'+
   'MUSEUM_FOSSIL_RECIPES,RESEARCH_V318_NODES,formatMuseumTimeRemaining,renderExcavations,'+
   'startExcavation,collectExcavation,renderMuseumRelicts,museumCardArt,relictLeadCount,addRelictLead,'+
   'maybeMuseumRelictLead,canStartRelictSurvey,startRelictSurvey,collectRelictSurvey,canCatalogRelict,'+
   'catalogRelict,recordMuseumRelict,relicMuseumCount,museumRelictSetBonus,claimRelictMilestone,'+
   'canClaimRelictMilestone,relictAchievementBonus,canResearchRelict,researchRelict,relictResearchBonus,'+
   'knowledgeBonus,museumRate,museumAssemblyReady,craftMuseumFossil,renderMuseum,get state(){return state}};\n})();');
 assert.notEqual(js,SOURCE,'Game injection missing');
 vm.runInContext(js,context,{filename:'www/js/app.js'});
 return {g:context.window.__beta318,store};
}
test('Ocho reconstrucciones, cuerno fósil y hueso duro: materiales válidos y sin taxones nuevos',()=>{
 const {g}=game();
 assert.equal(Object.keys(g.SPECIES).length,487);
 assert.equal(g.REGIONS.length,57);
 const mounts=g.MUSEUM_FOSSIL_RECIPES.filter(x=>x.unique);
 assert.equal(mounts.length,8);
 for(const item of ['fossil_horn','hard_bone'])assert.ok(g.ITEMS[item]);
 const recipe=id=>g.MUSEUM_FOSSIL_RECIPES.find(x=>x.id===id);
 assert.equal(recipe('triceratops_mount').requires.fossil_horn,3);
 assert.equal(recipe('ankylosaurus_mount').requires.hard_bone,4);
 assert.equal(recipe('pachycephalosaurus_mount').requires.hard_bone,6);
 assert.equal(recipe('carnotaurus_mount').requires.fossil_horn,2);
 assert.equal(recipe('fossil_horn').requires.fossil_tooth,2);
 assert.equal(recipe('hard_bone').requires.fossil_fragment,6);
 for(const r of g.MUSEUM_FOSSIL_RECIPES){
  assert.ok(g.ITEMS[r.id]||r.unique, r.id+' must be an inventory object or a unique mount');
  for(const [id,qty] of Object.entries(r.requires)){assert.ok(g.ITEMS[id],r.id+' missing '+id);assert.ok(qty>0);}
 }
 for(const id of ['pachycephalosaurus_mount','carnotaurus_mount','white_sturgeon','gharial','olm_balkans'])
  assert.match(g.museumCardArt('',id),/<svg viewBox="0 0 100 100"/);
});
test('El tiempo pendiente de excavación es HH:MM:SS y se refresca en Museo',()=>{
 const {g}=game();
 assert.equal(g.formatMuseumTimeRemaining(181000,1000),'00:03:00');
 assert.equal(g.formatMuseumTimeRemaining(1000,2000),'00:00:00');
 g.state.money=5000;g.state.knowledge=5000;
 assert.equal(g.startExcavation('british_cliffs',Date.now()),true);
 const html=g.renderExcavations();
 assert.match(html,/Tiempo restante:/);
 assert.match(html,/data-excavation-remaining="1"/);
 assert.match(html,/recompensas obtenidas/);
 assert.match(SOURCE,/syncMuseumTimers\(now\)/);
});
test('Excavación entrega recompensas exactas y guarda el historial una sola vez',()=>{
 const {g}=game();g.state.money=5000;g.state.knowledge=5000;
 assert.equal(g.startExcavation('british_cliffs',1000),true);
 assert.equal(g.collectExcavation(1,180999,()=>0),false);
 assert.equal(g.collectExcavation(1,181000,()=>0),true);
 assert.equal(g.collectExcavation(1,181000,()=>0),false);
 assert.equal(g.state.museum.excavationHistory.length,1);
 const rewards=g.state.museum.excavationHistory[0].rewards;
 assert.equal(rewards.fossil_fragment,2);
 for(const id of ['fossil_tooth','fossil_track','fossil_claw','fossil_skull'])assert.equal(rewards[id],1);
 assert.equal(g.state.inventory.fossil_fragment,2);
 const html=g.renderExcavations();
 assert.match(html,/Fragmento fósil ×2/);
 assert.match(html,/Huella fosilizada ×1/);
});
test('Nueve relictos con zonas existentes y colecciones biogeográficas propias',()=>{
 const {g}=game();
 assert.equal(g.MUSEUM_RELICTS.length,9);
 assert.equal(g.MUSEUM_RELICT_SETS.length,3);
 for(const r of g.MUSEUM_RELICTS)assert.ok(g.REGIONS.some(x=>x.id===r.region),r.id);
 for(const set of g.MUSEUM_RELICT_SETS)for(const id of set.requires)
  assert.ok(g.MUSEUM_RELICTS.some(r=>r.id===id),set.id+' '+id);
 for(const id of ['white_sturgeon','gharial','olm_balkans'])
  assert.ok(g.MUSEUM_RELICTS.some(r=>r.id===id));
});
test('Misiones de relictos tienen cupo, territorio y tiempo real, sin recompensa doble',()=>{
 const {g}=game();
 assert.equal(g.canStartRelictSurvey('white_sturgeon'),false);
 g.state.regionUnlocked['HX-02-02']=true;g.state.regionUnlocked['HX-03-12']=true;
 g.state.money=5000;g.state.knowledge=5000;
 assert.equal(g.canStartRelictSurvey('white_sturgeon'),true);
 assert.equal(g.startRelictSurvey('white_sturgeon',1000),true);
 assert.equal(g.startRelictSurvey('white_sturgeon',1000),false);
 assert.equal(g.startRelictSurvey('olm_balkans',1000),false,'1 slot initially');
 assert.equal(g.collectRelictSurvey(1,540999,()=>0.5),false);
 assert.equal(g.collectRelictSurvey(1,541000,()=>0.5),true);
 assert.equal(g.collectRelictSurvey(1,541000,()=>0.5),false);
 assert.equal(g.relictLeadCount('white_sturgeon'),1);
 assert.equal(g.state.museum.relictSurveyHistory.length,1);
 g.state.upgrades.relictSurveyTier=1;
 assert.equal(g.startRelictSurvey('white_sturgeon',550000),true);
 assert.equal(g.startRelictSurvey('olm_balkans',550000),true);
 assert.equal(g.collectRelictSurvey(2,1090000,()=>0.5),true);
 assert.equal(g.relictLeadCount('white_sturgeon'),3);
});
test('Las pistas de Campo y expedientes permiten registrar relictos sin inventario negativo',()=>{
 const {g}=game();
 g.state.currentRegion='HX-02-02';g.state.habitat='rio';g.state.time='amanecer';
 assert.equal(g.maybeMuseumRelictLead('manual',()=>0),'Esturión blanco del Pacífico');
 assert.equal(g.relictLeadCount('white_sturgeon'),1);
 assert.equal(g.addRelictLead('white_sturgeon',9),true);
 assert.equal(g.relictLeadCount('white_sturgeon'),3);
 assert.equal(g.canCatalogRelict('white_sturgeon'),false);
 Object.assign(g.state.inventory,{old_ink:1,parchment_scrap:2});
 g.state.knowledge=200;
 assert.equal(g.catalogRelict('white_sturgeon'),true);
 assert.equal(g.state.inventory.old_ink,0);
 assert.equal(g.state.inventory.parchment_scrap,0);
 assert.equal(g.state.knowledge,60);
 assert.equal(g.catalogRelict('white_sturgeon'),false);
 assert.equal(g.maybeMuseumRelictLead('manual',()=>0),null);
 assert.equal(g.state.museum.relicts.white_sturgeon,true);
});
test('Colecciones de relictos dan bonificación a vitrinas, no al Atlas ni a cada relicto',()=>{
 const {g}=game();g.state.museum.exhibits.zorro_rojo=true;
 const base=g.museumRate();
 for(const id of ['coelacanth_indic','african_lungfish','white_sturgeon'])g.recordMuseumRelict(id);
 assert.ok(Math.abs(g.museumRelictSetBonus()-0.025)<1e-9);
 assert.ok(Math.abs(g.museumRate()/base-1.025)<1e-9);
 assert.equal(g.state.prestige,0);
 assert.equal(g.state.sightings.coelacanth_indic,undefined);
});
test('Logros y análisis comparativo generan bonificaciones reales, no repetibles sin costo',()=>{
 const {g}=game();
 for(const id of ['angonoka','gabon_dwarf_croc'])g.recordMuseumRelict(id);
 const before=g.state.knowledge;
 assert.equal(g.claimRelictMilestone('first'),true);
 assert.equal(g.claimRelictMilestone('first'),false);
 assert.equal(g.state.knowledge,before+175);
 assert.ok(Math.abs(g.relictAchievementBonus()-0.03)<1e-9);
 assert.ok(Math.abs(g.knowledgeBonus()-1.03)<1e-9);
 Object.assign(g.state.inventory,{animal_trace:24,old_ink:12});
 g.state.knowledge=4000;
 for(let i=0;i<12;i++)assert.equal(g.researchRelict(),true);
 assert.equal(g.researchRelict(),false);
 assert.equal(g.state.museum.relictResearchPoints,12);
 assert.ok(Math.abs(g.knowledgeBonus()-1.15)<1e-9);
 assert.equal(g.state.inventory.old_ink,0);
 assert.equal(g.state.inventory.animal_trace,0);
});
test('Museo móvil muestra expedientes, misiones, logros e historial',()=>{
 const {g}=game();g.state.museumView='relicts';
 const html=g.renderMuseumRelicts();
 for(const t of ['Expedientes patrimoniales','Colecciones especiales','Logros de investigación','Análisis comparativo','Últimas investigaciones'])
  assert.ok(html.includes(t),t);
 assert.match(html,/data-action="start-relict-survey"/);
 assert.match(html,/data-action="catalog-relict"/);
 assert.match(html,/data-action="claim-relict-milestone"/);
 assert.match(html,/data-action="research-relict"/);
 assert.match(CSS,/\.museum-v318-card/);
 assert.match(CSS,/@media\(max-width:390px\)/);
});
test('Guardados anteriores se migran sin perder muestras ni monografías',()=>{
 const {g}=game({money:1200,knowledge:500,prestige:4,
  museum:{wing:2,exhibits:{},relicts:{coelacanth_indic:true},collections:{trex_mount:true},displays:{},excavations:[],curationPoints:4},
  published:{zorro_rojo:true},regionUnlocked:{'HX-01-09':true}});
 assert.equal(g.state.museum.relicts.coelacanth_indic,true);
 assert.equal(g.state.museum.collections.trex_mount,true);
 assert.equal(g.state.museum.curationPoints,4);
 assert.deepEqual(Array.from(g.state.museum.relictSurveys),[]);
 assert.deepEqual(Array.from(g.state.museum.excavationHistory),[]);
 assert.equal(g.state.museum.relictResearchPoints,0);
 assert.equal(g.state.published.zorro_rojo,true);
 assert.match(g.renderMuseum(),/Museo de Historia Natural/);
});
