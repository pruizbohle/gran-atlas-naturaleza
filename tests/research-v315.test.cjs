const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const SOURCE=fs.readFileSync('www/js/app.js','utf8');

function harness(){
 const dom={};
 const get=id=>dom[id]||(dom[id]={
  id,hidden:false,disabled:false,innerHTML:'',textContent:'',value:'',dataset:{},style:{},
  classList:{add(){},remove(){},toggle(){}},addEventListener(){},setAttribute(){},
  querySelector(){return null},querySelectorAll(){return []},focus(){},click(){}
 });
 const doc={getElementById:get,querySelectorAll(){return []},addEventListener(){},
  body:{classList:{add(){},remove(){}},appendChild(){}}};
 const cache={};
 const localStorage={getItem:k=>cache[k]||null,setItem:(k,v)=>cache[k]=String(v),removeItem:k=>delete cache[k]};
 const fakeMath=Object.create(Math);
 fakeMath.random=()=>0.5;
 const context=vm.createContext({
  window:{confirm(){return true}},document:doc,localStorage,TextEncoder,Date,
  Math:fakeMath,Number,JSON,Map,Set,console,URL,Blob,Intl,
  setInterval(){return 1},setTimeout(){return 1}
 });
 const append=[
 'window.__beta315={',
 'RESEARCH_NODES,RESEARCH_BRANCHES,RESEARCH_V315_BALANCE,REGIONS,SPECIES,',
 'researchRarityWeight,researchEncounterTargets,researchCensusCount,',
 'researchBranchOf,encounter,eligibleSpecies,renderResearch,resolveVoyageReward,',
 'canBuy,buyNode,MAX_AUTOMATIC_SIGHTINGS_PER_SPECIES_PER_HOUR,',
 'get state(){return state},',
 '};',
 '})();'].join('\n');
 const script=SOURCE.replace(/\n\}\)\(\);\s*$/,append);
 assert.notEqual(script,SOURCE,'no se inyectó la interfaz de pruebas');
 vm.runInContext(script,context,{filename:'www/js/app.js'});
 return {api:context.window.__beta315,random:v=>fakeMath.random=()=>v,cache};
}
test('Las cinco ramas cubren todas las investigaciones sin perder las existentes',()=>{
 const {api:g}=harness();
 assert.equal(g.RESEARCH_BRANCHES.length,5);
 const ids=new Set(g.RESEARCH_NODES.map(n=>n.id));
 assert.equal(ids.size,g.RESEARCH_NODES.length);
 assert.ok(ids.has('asia_1')&&ids.has('norteamerica_1'));
 assert.ok(ids.has('paleontologia_3')&&ids.has('grupos_auto_1'));
 for(const node of g.RESEARCH_NODES){
  assert.ok(g.RESEARCH_BRANCHES.some(b=>b.id===g.researchBranchOf(node)),node.id);
  if(node.req)assert.ok(ids.has(node.req),node.id+' necesita '+node.req);
  for(const id of node.reqAll||[])assert.ok(ids.has(id),node.id+' necesita '+id);
 }
 const html=g.renderResearch();
 assert.match(html,/research-branch-tabs/);
 assert.match(html,/Observación en grupo/);
});
test('El avance se adquiere por niveles y las mejoras automáticas no quedan disponibles al inicio',()=>{
 const {api:g}=harness();
 g.state.money=10000;g.state.knowledge=10000;
 const get=id=>g.RESEARCH_NODES.find(n=>n.id===id);
 assert.equal(g.canBuy(get('grupos_auto_1')),false);
 assert.equal(g.canBuy(get('censo_auto_1')),false);
 g.buyNode('prismaticos_1');g.buyNode('grupos_1');
 assert.equal(g.state.upgrades.groupTier,1);
 assert.equal(g.researchEncounterTargets('auto'),1);
 g.buyNode('grupos_2');g.buyNode('grupos_3');
 assert.equal(g.canBuy(get('grupos_auto_1')),false,'exige rastreo automático II');
 g.buyNode('metodo_1');g.buyNode('metodo_2');
 g.buyNode('grupos_auto_1');
 assert.equal(g.state.upgrades.autoGroup,1);
 g.buyNode('cuaderno_1');g.buyNode('censo_campo_1');g.buyNode('censo_campo_2');
 assert.equal(g.researchCensusCount('manual'),3);
 assert.equal(g.researchCensusCount('auto'),1);
 g.buyNode('metodo_3');g.buyNode('censo_auto_1');
 assert.equal(g.researchCensusCount('auto'),2);
});
test('Encuentro grupal manual: 3 especies distintas ×3 registros, con un botín por búsqueda',()=>{
 const {api:g,random}=harness();
 g.state.currentRegion='HX-01-09';g.state.habitat='bosque';g.state.time='amanecer';g.state.season='primavera';
 const choices=g.eligibleSpecies(g.state.currentRegion,g.state.habitat,g.state.time,g.state.season);
 assert.ok(choices.length>=3);
 g.state.upgrades.groupTier=3;g.state.upgrades.censusTier=2;
 random(0);
 g.encounter('manual',Date.now(),true);
 const seen=Object.entries(g.state.sightings).filter(([,qty])=>qty>0);
 assert.equal(seen.length,3,'la búsqueda debe seleccionar 3 IDs diferentes');
 assert.equal(seen.reduce((sum,[,qty])=>sum+qty,0),9,'×3 por especie y 3 especies');
 assert.equal(g.state.inventory.fossil_fragment,1,'solo una oportunidad de botín por búsqueda');
 assert.equal(g.state.inventory.fossil_tooth,1);
 assert.equal(g.state.inventory.fossil_skull,1);
 assert.match(g.state.lastEncounter.title,/Encuentro múltiple/);
});
test('Los censos automáticos no superan el límite de 100 registros por especie y hora',()=>{
 const {api:g,random}=harness();
 g.state.currentRegion='HX-01-09';g.state.habitat='bosque';g.state.time='amanecer';g.state.season='primavera';
 const first=g.eligibleSpecies(g.state.currentRegion,g.state.habitat,g.state.time,g.state.season)[0];
 const at=Date.now(),hour=Math.floor(at/3600000);
 g.state.autoHourly[hour+':'+first]=99;
 g.state.upgrades.censusTier=2;g.state.upgrades.autoCensus=1;
 random(0);
 g.encounter('auto',at,true);
 assert.equal(g.state.autoHourly[hour+':'+first],100);
 assert.equal(g.state.sightings[first],1);
 for(let i=0;i<200;i++)g.encounter('auto',at,true);
 assert.ok(Object.values(g.state.autoHourly).every(v=>v<=g.MAX_AUTOMATIC_SIGHTINGS_PER_SPECIES_PER_HOUR));
});
test('Paleontología avanza gradualmente y añade hallazgos sin modificar botín anterior',()=>{
 const {api:g,random}=harness();
 assert.equal(g.state.upgrades.paleoTier,0);
 g.state.upgrades.paleoTier=3;
 random(0);
 g.resolveVoyageReward({type:'coast'});
 assert.equal(g.state.inventory.fossil_skull,2,'un cráneo original y uno adicional por investigación');
 assert.equal(g.state.museum.voyagesCompleted,1);
});
test('Una disciplina mejora ponderación de raros sin borrar la posibilidad de observar otras especies',()=>{
 const {api:g}=harness();
 const rare=Object.keys(g.SPECIES).find(id=>g.SPECIES[id].kind==='cat'&&g.SPECIES[id].rare==='Raro');
 assert.ok(rare);
 const old=g.researchRarityWeight(rare);
 g.state.upgrades.mammalogy=2;
 const newer=g.researchRarityWeight(rare);
 assert.ok(newer>old);
 const common=Object.keys(g.SPECIES).find(id=>g.SPECIES[id].kind==='cat'&&g.SPECIES[id].rare==='Común');
 if(common)assert.equal(g.researchRarityWeight(common),12);
});
