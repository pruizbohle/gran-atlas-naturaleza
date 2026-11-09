'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const {reviewHarness,candidate}=require('./helpers/oceania-review.cjs'),{harness}=require('./helpers/live-game.cjs');
const json=x=>JSON.parse(JSON.stringify(x));
test('isolated actual engine installs exactly 97 additional identities, eight regions and 131 presences',()=>{
 const a=reviewHarness().window.__atlasTest;
 assert.equal(Object.keys(a.SPECIES).length,807);assert.equal(a.REGIONS.length,87);assert.equal(a.REGIONS.reduce((n,r)=>n+r.species.length,0),1460);
 const old=harness().window.__atlasTest;
 for(const[id,sp]of Object.entries(old.SPECIES))assert.deepEqual(json(a.SPECIES[id]),json(sp));
 assert.deepEqual(json(a.REGIONS.slice(0,79)),json(old.REGIONS));
 assert.deepEqual(json(a.RESEARCH_NODES.filter(n=>n.id!=='oceania_1')),json(old.RESEARCH_NODES));
 for(const k of ['ITEMS','RECIPES','VOYAGES','LEGENDARY_SPECIMENS'])assert.deepEqual(json(a[k]),json(old[k]),k);
 assert.equal(new Set(Object.values(a.SPECIES).map(s=>s.latin)).size,807);
});
test('all 131 candidate presences are reachable through actual manual and automatic eligibility in every configured season',()=>{
 const a=reviewHarness().window.__atlasTest;let count=0;
 for(const r of candidate.regions)for(const id of r.species){
  const sp=a.SPECIES[id];assert.deepEqual(json(sp.habitats),candidate.species[id].habitats);
  for(const season of sp.seasons){assert.ok(a.automaticEligibleSpecies(r.id,season).includes(id));assert.ok(r.habitats.some(h=>sp.times.some(t=>a.eligibleSpecies(r.id,h,t,season).includes(id))));}
  count++;
 }
 assert.equal(count,131);
 assert.equal(a.SPECIES.oc_esp_morelia_viridis.kind,'snake');
 assert.equal(a.taxonomyInfo('oc_esp_sphenodon_punctatus').subClass,'Rincocéfalos');
 assert.deepEqual(candidate.pendingScientificReviews,['Apteryx haastii','Crocodylus novaeguineae','Lophorina superba','Trichoglossus haematodus']);
});
test('existing research chain gates candidate travel; thresholds are gradual and prestige is never spent',()=>{
 const a=reviewHarness().window.__atlasTest,s=a.state,first=candidate.regions.find(r=>r.unlock.prestige===197);
 s.prestige=1000;s.money=1e8;s.knowledge=1e8;
 for(const r of candidate.regions){a.unlockRegion(r.id);assert.ok(!s.regionUnlocked[r.id]);a.travelToRegion(r.id);assert.notEqual(s.currentRegion,r.id);}
 const node=a.RESEARCH_NODES.find(n=>n.id==='oceania_1');assert.equal(node.req,'sudamerica_1');assert.ok(!a.canBuy(node));
 s.purchases.sudamerica_1=1;assert.ok(a.canBuy(node));a.buyNode(node.id);assert.equal(s.prestige,1000);assert.equal(s.money,1e8-3800);assert.equal(s.knowledge,1e8-3400);
 assert.ok(!candidate.regions.some(r=>s.regionUnlocked[r.id]));
 const thresholds=candidate.regions.map(r=>r.unlock.prestige).sort((a,b)=>a-b);assert.deepEqual(thresholds,[197,200,203,206,209,212,215,218]);
 s.prestige=196;a.unlockRegion(first.id);assert.ok(!s.regionUnlocked[first.id]);s.prestige=197;a.unlockRegion(first.id);a.travelToRegion(first.id);assert.equal(s.currentRegion,first.id);assert.equal(s.prestige,197);
 for(const r of candidate.regions)if(r.id!==first.id)assert.ok(!s.regionUnlocked[r.id]);
});
test('manual and automatic encounters in all eight regions record real sightings, currency, knowledge and journal progress',()=>{
 const h=reviewHarness({},null,{rng:()=>.01}),a=h.window.__atlasTest,s=a.state;s.prestige=1000;s.upgrades.oceaniaUnlocked=1;
 for(const r of candidate.regions){a.unlockRegion(r.id);a.travelToRegion(r.id);const id=r.species[0],sp=a.SPECIES[id];s.habitat=r.habitats.find(h=>sp.habitats.includes(h));s.time=sp.times[0];s.season=sp.seasons[0];
  for(const mode of ['manual','auto']){const count=Object.values(s.sightings).reduce((n,x)=>n+x,0),money=s.money,knowledge=s.knowledge;a.encounter(mode,Date.now(),true);assert.ok(Object.values(s.sightings).reduce((n,x)=>n+x,0)>count);assert.ok(s.money>=money);assert.ok(s.knowledge>knowledge);}
 }
});
test('all 97 candidate identities retain the five actual research stages, publication and normal collection flow',()=>{
 const a=reviewHarness().window.__atlasTest,s=a.state;s.money=1e10;s.knowledge=1e10;
 for(const id of Object.keys(candidate.species)){
  s.sightings[id]=10000;s.discovered[id]=true;s.feedObs[id]=10;s.specialSeen[id]=1;s.specialFound[id]={Notable:true};
  for(let stage=0;stage<5;stage++){assert.ok(a.stageRequirements(id,stage).allOk,id);a.advanceSpecies(id);assert.equal(s.stages[id],stage+1);}
  const prestige=s.prestige;a.publishMonograph(id);assert.equal(s.published[id],true);assert.equal(s.prestige,prestige+1);a.publishMonograph(id);assert.equal(s.prestige,prestige+1);
 }
});
test('candidate save/load and Android export/import preserve old data and newly researched destinations in memory',async()=>{
 const old=harness(),s=old.window.__atlasTest.state;s.money=123456;s.knowledge=98765;s.prestige=200;s.purchases.sudamerica_1=1;old.window.__atlasTest.persist();
 const h=reviewHarness({...old.store}),a=h.window.__atlasTest;
 for(const k of ['money','knowledge','prestige','inventory','equipment','sightings','published','museum','voyages'])assert.deepEqual(json(a.state[k]),json(s[k]),k);
 assert.ok(!candidate.regions.some(r=>a.state.regionUnlocked[r.id]));a.buyNode('oceania_1');const first=candidate.regions.find(r=>r.unlock.prestige===197);a.unlockRegion(first.id);a.travelToRegion(first.id);a.state.sightings[first.species[0]]=42;a.persist();
 const reload=reviewHarness({...h.store});assert.equal(reload.window.__atlasTest.state.currentRegion,first.id);assert.equal(reload.window.__atlasTest.state.upgrades.oceaniaUnlocked,true);assert.equal(reload.window.__atlasTest.state.sightings[first.species[0]],42);
 let exported;reload.window.Capacitor.Plugins.AtlasExport.saveFile=async payload=>{exported=payload;return{uri:'content://review'};};await reload.elements.saveDownloadBtn.fire('click');assert.ok(exported);const envelope=JSON.parse(exported.content);assert.equal(envelope.game.currentRegion,first.id);const imported=reviewHarness({},envelope);await imported.import();assert.equal(imported.window.__atlasTest.state.currentRegion,first.id);assert.equal(imported.window.__atlasTest.state.sightings[first.species[0]],42);
});
test('runtime generation is deterministic, explicitly unapproved and absent from public entry/cache',()=>{
 cp.execFileSync('python',['scripts/build-oceania-runtime-v3290.py','--check']);assert.equal(candidate.approvedForProduction,false);
 for(const path of ['www/index.html','www/sw.js'])assert.ok(!fs.readFileSync(path,'utf8').includes('oceania-runtime-v3290'));
 assert.equal(JSON.parse(fs.readFileSync('package.json')).version,'3.28.0');
});
