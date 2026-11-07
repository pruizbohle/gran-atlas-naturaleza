'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {catalogSource}=require('./helpers/catalog.cjs'),{harness}=require('./helpers/live-game.cjs');
const source=fs.readFileSync('www/js/app.js','utf8'),ctx=vm.createContext({});
for(const n of ['herp-art-v3192','bird-art-v3193','mammal-art-v3194','legendary-art-v3197'])vm.runInContext(fs.readFileSync('www/js/'+n+'.js','utf8'),ctx);
vm.runInContext(catalogSource(source)+'\n'+source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'))+'\napi={SPECIES,SPECIMEN_LEVELS,SPECIMEN_CATEGORIES,SPECIMEN_SELECTION,LEGENDARY_SPECIMENS,legendaryForSpecies,configuredSpecials,rollSpecimen,recordSpecimen,specimenRates,normalizeSpecialDiscoveries,getSpriteMarkup};',ctx);
const a=ctx.api,clone=x=>JSON.parse(JSON.stringify(x)),KEY='gran_atlas_v05';
function seeded(seed){return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};}
const fresh=()=>({upgrades:{},specialSeen:{},specialFound:{},legendaryFound:{}});
function draw(id,pigment,category,s=fresh()){let n=0;return a.rollSpecimen(id,s,()=>n++?category:pigment);}
test('declarative categories use real IDs, no duplicates, base availability and rare/common independence',()=>{
 assert.equal(Object.keys(a.SPECIES).length,487);
 for(const ids of Object.values(a.SPECIMEN_SELECTION))for(const id of ids)assert.ok(a.SPECIES[id],id);
 for(const [id,categories]of Object.entries(a.SPECIMEN_CATEGORIES)){
  assert.equal(categories.length,new Set(categories).size);
  assert.equal(categories.includes('Notable'),a.SPECIES[id].special.includes('Notable'));
  assert.equal(a.configuredSpecials(a.SPECIES[id]).length,new Set(a.configuredSpecials(a.SPECIES[id])).size);
 }
 assert.equal(a.SPECIES.zorro_rojo.rare,'Común');assert.ok(a.legendaryForSpecies('zorro_rojo'));
 assert.equal(a.LEGENDARY_SPECIMENS.length,12);assert.equal(new Set(a.LEGENDARY_SPECIMENS.map(l=>l.id)).size,12);
});
test('absolute category intervals, absent tiers, ethology and exhausted legend do not redistribute',()=>{
 assert.equal(draw('zorro_rojo',.9,.00999).category,'Notable');
 assert.equal(draw('zorro_rojo',.9,.01001).category,'Épico');
 assert.equal(draw('zorro_rojo',.9,.01201).category,'Excepcional');
 assert.equal(draw('zorro_rojo',.9,.01241).category,'Legendario');
 assert.equal(draw('zorro_rojo',.9,.01251).category,'');
 const limited=Object.keys(a.SPECIES).find(id=>a.SPECIMEN_CATEGORIES[id].join()==='Notable');
 assert.equal(draw(limited,.9,.0101).category,'');assert.equal(a.specimenRates(limited).Notable,.01);
 const s=fresh();s.legendaryFound.ascua={id:'ascua'};
 assert.equal(draw('zorro_rojo',.9,.01241,s).category,'');assert.equal(draw('zorro_rojo',.9,.01001,s).category,'Épico');
 for(const [c,p]of Object.entries(a.specimenRates('zorro_rojo')))assert.equal(a.specimenRates('zorro_rojo',2)[c],p*1.5);
});
test('every historical pigmentation interval stays exactly 0.01/n or 0.015/n, independent of metal',()=>{
 for(const [id,sp]of Object.entries(a.SPECIES))for(const ethology of [0,2]){
  let cursor=0;const step=(ethology===2?.015:.01)/sp.special.length;
  for(const label of sp.special.filter(x=>x==='Albino'||x==='Melánico')){
   const s={upgrades:{ethology}};assert.equal(draw(id,cursor+step/2,.99,s).pigment,label,id);
   assert.equal(draw(id,cursor+step/2,0,s).pigment,label,id+' independent');cursor+=step;
  }
  assert.equal(draw(id,cursor+1e-9,.99,{upgrades:{ethology}}).pigment,'',id);
 }
});
test('one million seeded eligible observations approximate each absolute rate and pigments',()=>{
 const n=1000000,rng=seeded(3197),counts={Notable:0,'Épico':0,Excepcional:0,Legendario:0,Albino:0,'Melánico':0};
 const s=fresh();for(let i=0;i<n;i++){const r=a.rollSpecimen('zorro_rojo',s,rng);if(r.category)counts[r.category]++;if(r.pigment)counts[r.pigment]++;}
 const expected={...a.specimenRates('zorro_rojo'),Albino:.01/3,'Melánico':.01/3};
 for(const [c,p]of Object.entries(expected))assert.ok(Math.abs(counts[c]-n*p)<6*Math.sqrt(n*p*(1-p)),c+': '+counts[c]);
});
test('canonical individual has one discovery across equivalent catalog IDs and repeat calls',()=>{
 // A second regional ID for the same binomial must share the canonical individual.
 a.SPECIES.test_fox_alias={...a.SPECIES.zorro_rojo,latin:'Vulpes vulpes testensis'};
 a.SPECIMEN_CATEGORIES.test_fox_alias=a.SPECIMEN_CATEGORIES.zorro_rojo;

 for(const l of a.LEGENDARY_SPECIMENS){
  const s=fresh(),result={pigment:'',category:'Legendario'};a.recordSpecimen(l.speciesId,result,s);
  assert.equal(s.legendaryFound[l.id].id,l.id);assert.equal(s.specialSeen[l.speciesId],1);
  a.recordSpecimen(l.speciesId,result,s);assert.equal(s.specialSeen[l.speciesId],1);
  for(const id of Object.keys(a.SPECIES).filter(id=>a.legendaryForSpecies(id)?.id===l.id)){
   for(const v of [.01241,.99999,0])assert.notEqual(draw(id,.99,v,s).category,'Legendario');
  }
 }
 delete a.SPECIES.test_fox_alias;delete a.SPECIMEN_CATEGORIES.test_fox_alias;
});
test('all three metallic levels preserve exact normal animal markup without stars',()=>{
 for(const id of Object.keys(a.SPECIES))for(const [category,level]of Object.entries(a.SPECIMEN_LEVELS).filter(([c])=>c!=='Legendario')){
  const normal=a.getSpriteMarkup(id),metal=a.getSpriteMarkup(id,level.skin);
  const stripped=metal.replace(/ data-specimen-category="[^"]*"/,'').replace(/<g data-specimen-halo="[^"]*"[\s\S]*?<\/g>/,'');
  assert.equal(stripped,normal,id+' '+category);assert.match(metal,new RegExp('stroke="'+level.color+'"'));
  assert.doesNotMatch(metal,/filter=|<animate|data-.*star/);
 }
 const glow=source.slice(source.indexOf('function alphaGlow('),source.indexOf('\n',source.indexOf('function alphaGlow(')));assert.doesNotMatch(glow,/<path|<circle/);
});
test('twelve exclusive SVGs are distinct from normal, named, bounded and inexpensive',()=>{
 const plates=new Set();for(const l of a.LEGENDARY_SPECIMENS){
  assert.ok(a.SPECIES[l.speciesId]);assert.ok(l.name&&l.description);const svg=a.getSpriteMarkup(l.speciesId,'legendario');
  assert.match(svg,new RegExp('data-legendary-id="'+l.id+'"'));assert.match(svg,/viewBox="0 0 100 100"/);
  assert.notEqual(svg,a.getSpriteMarkup(l.speciesId));assert.doesNotMatch(svg,/NaN|undefined|Infinity|<filter|<image|<animate/);assert.ok(svg.length<10000);plates.add(svg);
 }assert.equal(plates.size,12);
});
test('legacy notable, counters, progression and economic data survive idempotent migration',()=>{
 const s={money:300,knowledge:98,prestige:4,specialSeen:{zorro_rojo:17},specialFound:{zorro_rojo:{Notable:true,Albino:true,'Melánico':true}},published:{zorro_rojo:true},stages:{zorro_rojo:5},inventory:{berry:5},museum:{wing:2}};
 const before=clone(s);a.normalizeSpecialDiscoveries(s);const once=clone(s);a.normalizeSpecialDiscoveries(s);assert.deepEqual(clone(s),once);
 for(const key of Object.keys(before))assert.deepEqual(clone(s[key]),before[key]);
 assert.deepEqual(clone(s.legendaryFound),{});assert.deepEqual(clone(s.specialCounts),{});
});
test('active import, save, reboot and same-partida backup rollback retain the canonical identity',()=>{
 const h=harness();const api=h.window.__atlasTest;const old=clone(api.state);
 api.recordSpecimen('zorro_rojo',{pigment:'',category:'Legendario'},api.state);api.persist();
 const exported=clone(api.state);assert.equal(exported.legendaryFound.ascua.id,'ascua');
 const reboot=harness(h.store);assert.equal(reboot.window.__atlasTest.state.legendaryFound.ascua.id,'ascua');
 h.window.AtlasSaveBridge.restoreGame(old);api.persist();assert.equal(h.imported.legendaryFound.ascua.id,'ascua');
 h.window.AtlasSaveBridge.restoreGame(exported);api.persist();assert.equal(h.imported.specialSeen.zorro_rojo,1);
 const independent=clone(old);independent.collectionId='another-partida';h.window.AtlasSaveBridge.restoreGame(independent);api.persist();assert.deepEqual(h.imported.legendaryFound,{});
});
test('collection conceals unrevealed art, reveals permanent names, counts and museum without income',()=>{
 const h=harness(),api=h.window.__atlasTest,initialMoney=api.state.money;
 assert.doesNotMatch(api.specialBadges('zorro_rojo'),/data-legendary-id|Ascua/);
 api.recordSpecimen('zorro_rojo',{pigment:'',category:'Legendario'},api.state);
 assert.match(api.specialBadges('zorro_rojo'),/Ascua.*1\/1/);assert.match(api.renderMuseum(),/data-legendary-id="ascua"/);
 const historical=api.state.specialFound;api.recordSpecimen('zorro_rojo',{pigment:'',category:'Épico'},api.state);api.recordSpecimen('zorro_rojo',{pigment:'',category:'Épico'},api.state);
 assert.match(api.specialBadges('zorro_rojo'),/Épico · 2 encuentros/);
 assert.ok(historical.zorro_rojo['Épico']);assert.equal(api.state.money,initialMoney);
});
test('production manual and automatic censuses draw once, discover once, and never repeat a legendary',()=>{
 for(const sourceName of ['manual','auto'])for(const censusTier of [0,2]){
  const h=harness({},undefined,{rng:()=>.01245}),api=h.window.__atlasTest,s=api.state;
  // Isolate an existing species in a real region; only this disposable test catalog is modified.
  const region=api.REGIONS.find(r=>r.species.includes('zorro_rojo'));s.currentRegion=region.id;
  const fox=api.SPECIES.zorro_rojo;s.habitat=fox.habitats[0];s.time=fox.times[0];s.season=fox.seasons[0];
  for(const [id,sp]of Object.entries(api.SPECIES))if(id!=='zorro_rojo')sp.seasons=[];
  Object.assign(s.upgrades,{groupTier:0,censusTier,autoCensus:1});
  const beforeMoney=s.money;
  api.encounter(sourceName,Date.now(),true);
  const entry=s.lastEncounter.entries[0];assert.equal(entry.id,'zorro_rojo');assert.equal(entry.category,'Legendario');
  assert.equal(s.specialSeen.zorro_rojo,1);assert.equal(s.legendaryFound.ascua.id,'ascua');
  assert.equal(entry.amount,censusTier?(sourceName==='manual'?3:2):1);
  const moneyAfter=s.money;api.encounter(sourceName,Date.now(),true);
  assert.equal(s.lastEncounter.entries[0].category,'');assert.equal(s.specialSeen.zorro_rojo,1);
  assert.equal(s.money,moneyAfter);assert.ok(moneyAfter===beforeMoney||moneyAfter===beforeMoney+15);
 }
});
test('a multiple encounter keeps distinct species and one special roll per species, regardless of census',()=>{
 for(const sourceName of ['manual','auto']){
  const h=harness({},undefined,{rng:()=>.00001}),api=h.window.__atlasTest,s=api.state;
  Object.assign(s.upgrades,{groupTier:3,autoGroup:1,censusTier:2,autoCensus:1});
  api.encounter(sourceName,Date.now(),true);const entries=s.lastEncounter.entries;
  assert.equal(entries.length,3);assert.equal(new Set(entries.map(e=>e.id)).size,3);
  for(const e of entries){assert.equal(s.specialSeen[e.id],1);if(e.category&&e.category!=='Legendario')assert.equal(s.specialCounts[e.id][e.category],1);}
 }
});
test('offline cache contains all new resources and isolated lab never boots save state',()=>{
 const sw=fs.readFileSync('www/sw.js','utf8'),html=fs.readFileSync('www/laboratorio-especiales.html','utf8'),lab=fs.readFileSync('www/js/lab/special-lab-v3197.js','utf8');
 for(const name of ['laboratorio-especiales.html','js/legendary-art-v3197.js','js/lab/special-lab-v3197.js'])assert.ok(sw.includes("'./"+name+"'"));
 assert.doesNotMatch(lab,/localStorage|AtlasSaveBridge|setInterval/);assert.doesNotMatch(html,/<script src="js\/app.js/);
 for(const asset of [...sw.matchAll(/'\.\/([^']+)'/g)].map(m=>m[1]))assert.ok(fs.existsSync('www/'+asset),asset);
});
