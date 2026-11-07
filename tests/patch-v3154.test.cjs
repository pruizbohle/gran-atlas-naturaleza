const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('www/js/app.js','utf8');
const css=fs.readFileSync('www/css/styles.css','utf8');
function boot(){
 const cache={};
 const get=id=>({id,hidden:false,disabled:false,textContent:'',innerHTML:'',value:'',dataset:{},style:{},
  classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},
  querySelector(){return null},querySelectorAll(){return []},focus(){},click(){}});
 const context=vm.createContext({AtlasFieldUI:require('../www/js/field-ui-v3210.js'),AtlasFieldScene:require('../www/js/field-scene-v3210.js'),window:{confirm(){return true}},
  document:{getElementById:get,querySelectorAll(){return []},addEventListener(){},
   body:{classList:{add(){},remove(){}},appendChild(){}} },
  localStorage:{getItem:k=>cache[k]||null,setItem:(k,v)=>cache[k]=String(v),removeItem:k=>delete cache[k]},
  TextEncoder,Date,Math,Number,JSON,Map,Set,console,URL,Blob,Intl,
  setInterval(){return 1},setTimeout(){return 1}});
 const expose=[
  'window.__audit={SPECIES,REGIONS,getSpriteMarkup,taxonomyInfo,mergeHistoricalBeardedVulture,renderBestiary,',
  'get state(){return state},',
  '};',
  '})();'
 ].join('\n');
 const js=src.replace(/\n\}\)\(\);\s*$/,expose);
 assert.notEqual(js,src);
 vm.runInContext(js,context,{filename:'www/js/app.js'});
 return context.window.__audit;
}
test('Catálogo sin animales huérfanos, referencias rotas ni taxones binomiales duplicados',()=>{
 const g=boot(),ids=Object.keys(g.SPECIES),links=g.REGIONS.flatMap(r=>r.species);
 assert.equal(g.REGIONS.length,57);
 assert.equal(ids.length,487);
 assert.equal(ids.filter(id=>!links.includes(id)).length,0);
 assert.ok(g.REGIONS.every(r=>r.species.every(id=>!!g.SPECIES[id])));
 const names=ids.map(id=>g.SPECIES[id].latin.toLocaleLowerCase('es'));
 assert.equal(new Set(names).size,names.length);
 assert.ok(g.REGIONS.find(r=>r.name==='Península Ibérica').species.includes('meloncillo'));
 assert.ok(!g.REGIONS.find(r=>r.name==='Península Itálica').species.includes('meloncillo'));
 assert.equal(g.SPECIES.af_chacal_dorado.latin,'Canis lupaster');
 assert.equal(g.SPECIES.chacal_dorado.latin,'Canis aureus');
 assert.equal(g.SPECIES.asia_esp_0401.latin,'Panthera pardus tulliana');
 assert.equal(g.SPECIES.af_leopardo.latin,'Panthera pardus pardus');
});
test('Dos lagópodos se mantienen con sus IDs, rareza y nombres científicos',()=>{
 const g=boot();
 assert.equal(g.SPECIES.perdiz_nival.latin,'Lagopus muta');
 assert.equal(g.SPECIES.eu_esp_0267.latin,'Lagopus lagopus');
 assert.equal(g.SPECIES.eu_esp_0267.name,'Lagópodo común');
 assert.equal(g.SPECIES.perdiz_nival.rare,'Poco común');
 assert.equal(g.SPECIES.eu_esp_0267.rare,'Común');
});
test('Clases uniformes en todas las especies; anfibios, peces y cálao correctos',()=>{
 const g=boot();
 const classes=new Set(['Mammalia','Aves','Reptilia','Amphibia','Actinopterygii','Chondrichthyes']);
 for(const id of Object.keys(g.SPECIES)){
  const t=g.taxonomyInfo(id);
  assert.ok(classes.has(t.className),id+' clase '+t.className);
  assert.ok(t.subClass&&t.subClass!=='Sin clasificar',id+' sin grupo');
 }
 assert.equal(g.SPECIES.asia_esp_0067.kind,'forestbird');
 assert.equal(g.taxonomyInfo('asia_esp_0067').className,'Aves');
 assert.equal(g.taxonomyInfo('asia_esp_0067').subClass,'Cálaos');
 for(const id of ['eu_esp_0660','eu_esp_0659','asia_esp_0898','af_xlsx_rana_goliat',
    'af_xlsx_131_sclerophrys_regularis'])
  assert.equal(g.taxonomyInfo(id).className,'Amphibia',id);
});
test('Cálao ave, desmán sin caparazón, cobras con capucha y liebres homologadas',()=>{
 const g=boot();
 const calao=g.getSpriteMarkup('asia_esp_0067');
 assert.match(calao,/#[cC]94f35/);
 assert.doesNotMatch(calao,/M78 58Q86 48 86/);
 const desman=g.getSpriteMarkup('eu_esp_0623');
 assert.match(desman,/M19 66Q28 52/);
 assert.doesNotMatch(desman,/rx="29" ry="19"/);
 const cobras=Object.keys(g.SPECIES).filter(id=>/^(Naja|Ophiophagus)\b/.test(g.SPECIES[id].latin));
 assert.equal(cobras.length,4);
 for(const id of cobras){
  const svg=g.getSpriteMarkup(id);
  assert.match(svg,/data-family="cobra"/);
  assert.match(g.getSpriteMarkup(id,'albino'),/data-family="cobra"/);
  assert.match(g.getSpriteMarkup(id,'melanico'),/data-family="cobra"/);
 }
 assert.equal(new Set(cobras.map(id=>g.getSpriteMarkup(id))).size,4);
 const hares=Object.keys(g.SPECIES).filter(id=>g.SPECIES[id].kind==='hare');
 assert.ok(hares.length>=2);
 for(const id of hares)assert.match(g.getSpriteMarkup(id),/data-family="hare"/);
 assert.match(g.getSpriteMarkup('asia_esp_0842'),/data-family="hare"/);
});
test('Migración de alias conserva avances y no suma dos veces',()=>{
 const g=boot();
 const save={sightings:{asia_esp_0088:6,af_caracal:4,asia_esp_0538:3,af_zorro_ruppell:2},
  stages:{asia_esp_0088:4,af_caracal:2},
  discovered:{asia_esp_0088:true},
  specialFound:{asia_esp_0088:{Notable:true}},
  autoHourly:{'101:asia_esp_0088':70,'101:af_caracal':55},
  selectedJournal:'asia_esp_0088',
  museum:{exhibits:{asia_esp_0088:1}},
  lastEncounter:{species:'asia_esp_0538',entries:[{id:'asia_esp_0538',amount:1}]}};
 g.mergeHistoricalBeardedVulture(save);
 assert.equal(save.sightings.af_caracal,10);
 assert.equal(save.sightings.af_zorro_ruppell,5);
 assert.equal(save.stages.af_caracal,4);
 assert.equal(save.autoHourly['101:af_caracal'],100);
 assert.equal(save.selectedJournal,'af_caracal');
 assert.equal(save.lastEncounter.entries[0].id,'af_zorro_ruppell');
 assert.equal(save.museum.exhibits.af_caracal,1);
 assert.equal(save.sightings.asia_esp_0088,undefined);
 g.mergeHistoricalBeardedVulture(save);
 assert.equal(save.sightings.af_caracal,10);
});
test('Bestiario permite invertir un mismo criterio y conserva selección',()=>{
 const g=boot();
 g.state.bestiarySort='rarity';g.state.bestiaryDescending=false;
 assert.match(g.renderBestiary(),/Rareza ↑/);
 g.state.bestiaryDescending=true;
 assert.match(g.renderBestiary(),/Rareza ↓/);
 assert.match(src,/state\.bestiarySort===id\)state\.bestiaryDescending=!state\.bestiaryDescending/);
 g.state.bestiarySort='type';g.state.bestiaryDescending=false;
 assert.match(g.renderBestiary(),/Tipo ↑/);
});
test('Selva y sabana presentan filtros y estilos propios',()=>{
 const scene=require('../www/js/field-scene-v3210.js');assert.ok(scene.habitats.includes('selva'));assert.ok(scene.habitats.includes('sabana'));assert.notEqual(scene.render('selva'),scene.render('sabana'));
 assert.match(css,/\.scene\.biome-selva/);
 assert.match(css,/\.scene\.biome-sabana/);
 assert.match(src,/selva:'🌴 Selva'/);
});
