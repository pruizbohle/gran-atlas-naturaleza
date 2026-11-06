const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('www/js/app.js','utf8');
const css=fs.readFileSync('www/css/styles.css','utf8');
function boot(){
 const cache={};
 const get=id=>({id,hidden:false,disabled:false,textContent:'',innerHTML:'',value:'',dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},querySelector(){return null},querySelectorAll(){return []},focus(){},click(){}});
 const context=vm.createContext({window:{confirm(){return true}},document:{getElementById:get,querySelectorAll(){return []},addEventListener(){},body:{classList:{add(){},remove(){}},appendChild(){}}},localStorage:{getItem:k=>cache[k]||null,setItem:(k,v)=>cache[k]=String(v),removeItem:k=>delete cache[k]},TextEncoder,Date,Math,Number,JSON,Map,Set,console,URL,Blob,Intl,setInterval(){return 1},setTimeout(){return 1}});
 const expose=[
  'window.__patch={SPECIES,REGIONS,getSpriteMarkup,unifiedFamilySprite,encounterCardMarkup,mergeHistoricalBeardedVulture,variantToSkin,',
  'get state(){return state},',
  '};',
  '})();'
 ].join('\n');
 const js=src.replace(/\n\}\)\(\);\s*$/,expose);
 assert.notEqual(js,src);
 vm.runInContext(js,context,{filename:'www/js/app.js'});
 return context.window.__patch;
}
test('Nutria europea: variantes configuradas, con sprites distintos y SVG válido',()=>{
 const g=boot();
 assert.deepEqual(Array.from(g.SPECIES.nutria_europea.special),['Leucístico','Melánico','Notable']);
 const normal=g.getSpriteMarkup('nutria_europea');
 for(const variant of g.SPECIES.nutria_europea.special){
  const skin=g.variantToSkin(variant),image=g.getSpriteMarkup('nutria_europea',skin);
  assert.match(image,/<svg\b/);
  assert.notEqual(image,normal,variant);
 }
});
test('Quebrantahuesos es un solo taxón, presente en Europa, Asia y África',()=>{
 const g=boot();
 assert.equal(Object.hasOwn(g.SPECIES,'af_quebrantahuesos'),false);
 const ids=Object.entries(g.SPECIES).filter(([,sp])=>sp.latin==='Gypaetus barbatus').map(([id])=>id);
 assert.deepEqual(ids,['quebrantahuesos']);
 const continents=new Set(g.REGIONS.filter(r=>r.species.includes('quebrantahuesos')).map(r=>r.continent));
 assert.ok(continents.has('Europa')&&continents.has('Asia')&&continents.has('África'));
 assert.ok(g.REGIONS.every(r=>!r.species.includes('af_quebrantahuesos')));
});
test('Migración de partidas fusiona avances históricos sin repetir al volver a cargar',()=>{
 const g=boot();
 const snapshot={
  sightings:{quebrantahuesos:7,af_quebrantahuesos:13},
  stages:{quebrantahuesos:2,af_quebrantahuesos:4},
  specialSeen:{quebrantahuesos:1,af_quebrantahuesos:2},
  specialFound:{quebrantahuesos:{Leucístico:true},af_quebrantahuesos:{Notable:true}},
  published:{af_quebrantahuesos:true},
  discovered:{af_quebrantahuesos:true},
  museum:{exhibits:{af_quebrantahuesos:1}},
  selectedJournal:'af_quebrantahuesos',
  autoHourly:{'110:quebrantahuesos':90,'110:af_quebrantahuesos':60}
 };
 const merged=g.mergeHistoricalBeardedVulture(snapshot);
 assert.equal(merged.sightings.quebrantahuesos,20);
 assert.equal(merged.stages.quebrantahuesos,4);
 assert.equal(merged.specialSeen.quebrantahuesos,3);
 assert.deepEqual(Object.keys(merged.specialFound.quebrantahuesos).sort(),['Leucístico','Notable']);
 assert.equal(merged.autoHourly['110:quebrantahuesos'],100);
 assert.equal(merged.selectedJournal,'quebrantahuesos');
 assert.equal(merged.published.quebrantahuesos,true);
 assert.equal(merged.museum.exhibits.quebrantahuesos,1);
 assert.equal(merged.sightings.af_quebrantahuesos,undefined);
 g.mergeHistoricalBeardedVulture(snapshot);
 assert.equal(merged.sightings.quebrantahuesos,20);
});
test('Mustélidos, nutrias y pangolines comparten estilo familiar con variaciones propias',()=>{
 const g=boot();
 const ids=['nutria_europea','tejon_europeo','gloton','eu_esp_0617','eu_esp_0621',
  'asia_esp_0326','af_xlsx_131_mellivora_capensis','af_xlsx_131_hydrictis_maculicollis'];
 for(const id of ids){
  const svg=g.getSpriteMarkup(id);
  assert.match(svg,/^<svg\b/,id);
  assert.match(svg,/viewBox="0 0 100 100"/,id);
  assert.ok(svg.includes('path'),id);
 }
 const pangolinIds=Object.keys(g.SPECIES).filter(id=>/^(Manis|Phataginus|Smutsia)\b/.test(g.SPECIES[id].latin||''));
 assert.ok(pangolinIds.length>=3);
 for(const id of pangolinIds){
  const svg=g.getSpriteMarkup(id);
  assert.match(svg,/^<svg\b/);
  assert.ok((svg.match(/stroke-width/g)||[]).length>=10,id+' necesita escamas distinguibles');
 }
 assert.notEqual(g.getSpriteMarkup('nutria_europea'),g.getSpriteMarkup('tejon_europeo'));
 assert.notEqual(g.getSpriteMarkup('tejon_europeo'),g.getSpriteMarkup('gloton'));
 assert.equal(g.SPECIES.salamandra_alpina.kind,'salamander');
});
test('Campo representa 1, 2 y 3 especies con imágenes y censos ×2/×3 evidentes',()=>{
 const g=boot();
 const names=['nutria_europea','tejon_europeo','gloton'];
 for(let count=1;count<=3;count++){
  const entries=names.slice(0,count).map((id,i)=>({id,amount:i===0?3:2,variant:'',sex:null}));
  const html=g.encounterCardMarkup({species:names[0],title:'Encuentro múltiple',subtitle:'+5 conocimiento',entries});
  assert.equal((html.match(/encounter-species-art/g)||[]).length,count);
  assert.equal((html.match(/encounter-multiplier/g)||[]).length,count);
  assert.match(html,/×3/);
  if(count>1)assert.match(html,new RegExp(count+' ESPECIES'));
 }
 assert.match(css,/encounter-graphic-multi/);
 assert.match(css,/encounter-multiplier/);
 assert.match(css,/max-width:600px/);
});
