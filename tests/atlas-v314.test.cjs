const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const GAME=fs.readFileSync('www/js/app.js','utf8');
function game(){
 const nodes={};
 const get=id=>nodes[id]||(nodes[id]={id,hidden:false,disabled:false,textContent:'',innerHTML:'',value:'',dataset:{},files:[],classList:{add(){},remove(){},toggle(){}},style:{},addEventListener(){},setAttribute(){},focus(){},click(){},querySelector(){return null},querySelectorAll(){return []}});
 const doc={getElementById:get,querySelectorAll(){return []},addEventListener(){},body:{classList:{add(){},remove(){}},appendChild(){}}};
 const cache={};const storage={getItem:k=>cache[k]||null,setItem:(k,v)=>{cache[k]=String(v)},removeItem:k=>delete cache[k]};
 const ctx=vm.createContext({window:{confirm(){return true}},document:doc,localStorage:storage,TextEncoder,Date,Math,Number,JSON,Map,Set,console,URL,Blob,Intl,setInterval(){return 1},setTimeout(){return 1}});
 const out=GAME.replace(/\n\}\)\(\);\s*$/,`
window.__atlasTest={REGIONS,SPECIES,ITEMS,RECIPES,RESEARCH_NODES,
canBuy,buyNode,craftItem,regionRequirementsMet,eligibleSpecies,rarityWeight,availableVoyages,sail,finishVoyage,
get state(){return state},
patch(data){Object.assign(state,data);},
};
})();`);
 assert.notEqual(out,GAME,'No se inyectó interfaz de prueba');
 vm.runInContext(out,ctx,{filename:'www/js/app.js'});
 return ctx.window.__atlasTest;
}
test('Probabilidad: categorías ordenadas de común a muy rara',()=>{
 const g=game();
 const weights=['Común','Poco común','Raro','Muy rara'].map(x=>g.rarityWeight(x));
 for(let i=1;i<weights.length;i++)assert.ok(weights[i]<weights[i-1]);
});
test('Norteamérica tiene exactamente dos regiones iniciales con fauna del Excel y biomas',()=>{
 const g=game(),r=g.REGIONS.filter(x=>x.continent==='Norteamérica');
 assert.deepEqual(Array.from(r.map(x=>x.name)),['Alaska','Columbia Británica']);
 assert.deepEqual(Array.from(r.map(x=>x.species.length)),[17,11]);
 for(const region of r){
  assert.equal(new Set(region.species).size,region.species.length);
  for(const id of region.species){
   assert.ok(g.SPECIES[id],id);
   assert.ok(g.SPECIES[id].habitats.some(h=>region.habitats.includes(h)),id+' sin bioma en '+region.name);
  }
 }
});
test('Investigaciones encadenadas requieren artefacto y mapa, sin consumirlos',()=>{
 const g=game();
 g.patch({money:20000,knowledge:20000,prestige:130,purchases:{asia_1:1},inventory:{africa_map:1,north_america_map_piece:8}});
 const alaska=g.REGIONS.find(x=>x.name==='Alaska');
 assert.equal(g.regionRequirementsMet(alaska),false);
 assert.equal(g.canBuy(g.RESEARCH_NODES.find(x=>x.id==='nuevo_mundo_1')),false);
 g.buyNode('africa_1');assert.equal(g.state.purchases.africa_1,1);assert.equal(g.state.inventory.africa_map,1);
 g.buyNode('nuevo_mundo_1');assert.equal(g.state.purchases.nuevo_mundo_1,undefined);
 g.state.inventory.oceanic_quadrant=1;
 g.state.upgrades.shipyard=1;g.state.upgrades.routeTier=2;
 g.buyNode('nuevo_mundo_1');assert.equal(g.state.purchases.nuevo_mundo_1,1);assert.equal(g.state.inventory.oceanic_quadrant,1);
 assert.ok(g.availableVoyages().some(v=>v.id==='atlantic_survey'));
 g.craftItem('north_america_map');assert.equal(g.state.inventory.north_america_map,1);
 assert.equal(g.state.inventory.north_america_map_piece,0);
 g.buyNode('norteamerica_1');assert.equal(g.state.purchases.norteamerica_1,1);assert.equal(g.state.inventory.north_america_map,1);
 assert.equal(g.regionRequirementsMet(alaska),true);
});
test('Las investigaciones nuevas no modifican los códigos de África',()=>{
 const g=game(),af=g.REGIONS.filter(x=>x.continent==='África');
 assert.equal(af.length,24);
 assert.equal(new Set(g.REGIONS.map(x=>x.id)).size,g.REGIONS.length);
 assert.ok(g.RECIPES.oceanic_quadrant.requires.brass_shard>0);
 assert.equal(g.RECIPES.north_america_map.requires.north_america_map_piece,8);
});
