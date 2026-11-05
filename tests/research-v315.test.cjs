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
 'researchBranchOf,encounter,eligibleSpecies,automaticEligibleSpecies,automaticSearchCapacity,renderResearch,resolveVoyageReward,renderObjects,ITEMS,VOYAGES,manualSearchChance,automaticSearchChance,rollLoot,requestGrant,voyageMoneyReward,voyageKnowledgeReward,',
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
 const first=g.automaticEligibleSpecies(g.state.currentRegion,g.state.season)[0];
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

test('Sáhara: el equipo busca por toda la región aunque el filtro manual sea desierto/día',()=>{
 const {api:g,random}=harness();
 const region='HX-06-07',season='verano',at=Date.now(),hour=Math.floor(at/3600000);
 g.state.currentRegion=region;
 g.state.habitat='desierto';g.state.time='dia';g.state.season=season;
 g.state.upgrades.groupTier=3;g.state.upgrades.autoGroup=1;
 g.state.upgrades.censusTier=2;g.state.upgrades.autoCensus=1;
 const manual=g.eligibleSpecies(region,'desierto','dia',season);
 const all=g.automaticEligibleSpecies(region,season);
 assert.ok(all.length>manual.length,'debe incluir especies de otros horarios válidos');
 const manualSnapshot=[g.state.habitat,g.state.time,g.state.season];
 for(const id of manual)g.state.autoHourly[hour+':'+id]=100;
 assert.ok(g.automaticSearchCapacity(at).remaining>0,'otras especies tienen cupos');
 random(0);
 g.encounter('auto',at,true);
 assert.ok(Object.keys(g.state.sightings).length>=1,'se observan especies fuera del filtro manual saturado');
 assert.deepEqual([g.state.habitat,g.state.time,g.state.season],manualSnapshot);
 assert.ok(Object.values(g.state.autoHourly).every(v=>v<=100));
});
test('Diario: registra claramente la pausa automática sin alterar los avistamientos manuales',()=>{
 const {api:g}=harness();
 const now=Date.now(),hour=Math.floor(now/3600000);
 g.state.currentRegion='HX-06-07';
 g.state.season='verano';g.state.habitat='desierto';g.state.time='dia';
 const ids=g.automaticEligibleSpecies(g.state.currentRegion,g.state.season);
 assert.ok(ids.length>0);
 for(const id of ids)g.state.autoHourly[hour+':'+id]=100;
 assert.equal(g.automaticSearchCapacity(now).remaining,0);
 const before=Object.values(g.state.sightings).reduce((a,b)=>a+b,0);
 g.encounter('auto',now,true);
 assert.equal(Object.values(g.state.sightings).reduce((a,b)=>a+b,0),before);
 g.encounter('manual',now,true);
 assert.ok(Object.values(g.state.sightings).reduce((a,b)=>a+b,0)>before,'manual continúa disponible');
});

test('Equipo activo: probabilidades reales y ranuras, sin bonificaciones de objetos no equipados',()=>{
 const {api:g}=harness();
 assert.equal(g.manualSearchChance(),0.5);
 assert.equal(g.automaticSearchChance(),0);
 g.state.helpers=1;
 assert.ok(Math.abs(g.automaticSearchChance()-0.3914)<1e-9);
 g.state.upgrades.prism=2;
 g.state.equipment.instrument='binoculars';
 assert.ok(Math.abs(g.manualSearchChance()-0.68)<1e-9);
 g.state.helpers=10;
 g.state.upgrades.training=2;
 assert.ok(Math.abs(g.automaticSearchChance()-0.551)<1e-9);
 g.state.equipment.hat='rain_hood';
 assert.ok(Math.abs(g.automaticSearchChance()-0.57)<1e-9);
 g.state.equipment.necklace='amulet';
 assert.ok(Math.abs(g.automaticSearchChance()-0.6004)<1e-9);
 const html=g.renderObjects();
 assert.match(html,/60,0 %/);
 assert.match(html,/68,0 %/);
 assert.match(g.ITEMS.rain_hood.bonus,/5 %/);
});
test('Amuleto de ámbar aplica +5 % al monto base de subvenciones',()=>{
 const {api:g}=harness();
 g.state.discovered={'zorro_rojo':true};
 g.state.money=0;
 g.state.upgrades.grantBonus=0.25;
 g.state.equipment.necklace='amber_charm';
 g.requestGrant();
 assert.equal(g.state.money,52);
});
test('Collar de conchas +5 % libras al regreso; brújula +4 % conocimiento',()=>{
 const {api:g}=harness();
 const voyage=g.VOYAGES.find(v=>v.prize>=50&&v.notes>=20);
 assert.ok(voyage);
 assert.equal(g.voyageMoneyReward(voyage),voyage.prize);
 assert.equal(g.voyageKnowledgeReward(voyage),voyage.notes);
 g.state.equipment.necklace='shell_necklace';
 g.state.equipment.instrument='brass_compass';
 assert.equal(g.voyageMoneyReward(voyage),Math.round(voyage.prize*1.05));
 assert.equal(g.voyageKnowledgeReward(voyage),voyage.notes+Math.round(voyage.notes*0.04));
});
test('Gorro +6 puntos o morral +3 puntos en el botín, solamente al equiparse',()=>{
 const {api:g,random}=harness();
 random(0.38);
 assert.equal(g.rollLoot(),null,'sin accesorios es 35 %');
 g.state.equipment.hat='feather_cap';
 assert.ok(g.rollLoot(),'con gorro 41 %');
 g.state.equipment.hat=null;
 g.state.equipment.instrument='sturdy_pack';
 random(0.37);
 assert.ok(g.rollLoot(),'con morral 38 %');
});
