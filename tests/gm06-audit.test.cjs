'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {make,mature}=require('./helpers/gm06-game.cjs'),copy=x=>JSON.parse(JSON.stringify(x));
test('GM06 every one of 1829 regional associations has a real engine presence, including polar/marine/sampling overrides',()=>{
 const h=make(),g=h.g,s=mature(h),foundWorldwide=new Set();let associations=0;
 for(const r of g.REGIONS){s.currentRegion=r.id;const found=new Set();for(const method of ['sondeo','muestreo','extraordinario'])for(const habitat of r.habitats)for(const time of ['amanecer','dia','atardecer','noche'])for(const season of ['primavera','verano','otono','invierno']){
  Object.assign(s,{habitat,time,season});s.deepSurvey.method=method;
  for(const id of g.eligibleSpecies(r.id,habitat,time,season))found.add(id);
  for(const id of g.automaticEligibleSpecies(r.id,season))found.add(id);
 }
 for(const id of r.species){assert.ok(found.has(id),r.id+' / '+id);foundWorldwide.add(id);associations++;}
 }
 assert.equal(associations,1829);assert.equal(foundWorldwide.size,997);
});
test('GM06 72-hour offline return matches 3.43 resource and job resolution in an unchanged region; receipts settle once',()=>{
 const results=[];for(const baseline of [true,false]){
  const h=make({baseline,rng:()=>0.7}),g=h.g,s=mature(h);s.currentRegion='HX-01-09';s.helpers=2;s.upgrades.autoTier=1;
  for(const n of g.RESEARCH_NODES.filter(n=>/excava|paleontologia|relictos/.test(n.id))){s.purchases[n.id]=1;n.effect(s);}
  g.sail('coast');g.startTrade3300('coastal_trade');g.startExcavation('british_cliffs');s.museum.relictLeads[g.MUSEUM_RELICTS[0].id]=1;g.startRelictSurvey(g.MUSEUM_RELICTS[0].id);g.persist();
  const returned=make({baseline,rng:()=>0.7,store:{...h.store},now:h.now+72*3600000});returned.tick();const v=returned.g.state;
  results.push(copy({money:v.money,knowledge:v.knowledge,inventory:v.inventory,sightings:v.sightings,voyages:v.voyages,commerce:v.commerce,excavations:v.museum.excavations,relictSurveys:v.museum.relictSurveys}));
  const completed=copy({voyages:v.museum.voyagesCompleted,excavations:v.museum.excavationsCompleted,history:v.commerce.history});returned.tick();assert.deepEqual(copy({voyages:v.museum.voyagesCompleted,excavations:v.museum.excavationsCompleted,history:v.commerce.history}),completed);
 }
 assert.deepEqual(results[1],results[0]);
});
