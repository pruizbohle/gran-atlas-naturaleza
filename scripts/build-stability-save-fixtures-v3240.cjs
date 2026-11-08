'use strict';
// Run once from the full development history. CI consumes the committed raw
// historical saves, their source revision and digest; it never needs git show.
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),{harness}=require('../tests/helpers/live-game.cjs');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex'),fixtures=[];
const scenarios=[['europe','3.19.9','b08b892'],['africa','3.21.2','07a6f06'],['northamerica','3.22.1','78daf2d'],['southamerica','3.23.1','1cda484'],['museum','3.23.0','d045c1f'],['variants-monographs','3.22.1','78daf2d']];
const bridge='\nwindow.__atlasTest={initialState,persist,SPECIES,REGIONS,RESEARCH_NODES,ITEMS,MUSEUM_COLLECTIONS,MUSEUM_RELICTS,get state(){return state}};\n})();';
for(const[scenario,version,ref]of scenarios){
 const source=cp.execFileSync('git',['show',ref+':www/js/app.js'],{encoding:'utf8',maxBuffer:9e6}),modern=['3.22.1','3.23.0','3.23.1'].includes(version),south=version.startsWith('3.23');
 const h=harness({},null,{gameSource:source,bridge,legacy:!modern,southamerica:south}),g=h.window.__atlasTest,s=g.state;
 Object.assign(s,{money:123456,knowledge:98765,prestige:scenario==='europe'?5:scenario==='africa'?110:220,helpers:0,lastTick:1700000000000});
 s.sightings.zorro_rojo=73;s.stages.zorro_rojo=2;s.discovered.zorro_rojo=true;
 if(scenario!=='europe'){
  for(const id of ['asia_1','africa_1'])s.purchases[id]=1;s.inventory.africa_map=1;s.upgrades.asiaUnlocked=1;s.upgrades.africaUnlocked=true;s.currentRegion='HX-06-07';s.regionUnlocked['HX-06-07']=true;
 }
 if(modern){for(const id of ['nuevo_mundo_1','norteamerica_1'])s.purchases[id]=1;s.upgrades.newWorldUnlocked=true;s.upgrades.northAmericaUnlocked=true;s.inventory.north_america_map=1;s.inventory.oceanic_quadrant=1;for(const r of g.REGIONS.filter(r=>r.continent==='Norteamérica'))s.regionUnlocked[r.id]=true;s.currentRegion='HX-02-02';s.sightings.na_esp_panthera_onca=93;s.stages.na_esp_panthera_onca=5;s.published.na_esp_panthera_onca=true;s.specialFound.na_esp_panthera_onca={Melánico:true,Notable:true};}
 if(south){s.purchases.sudamerica_1=1;s.upgrades.southAmericaUnlocked=true;for(const r of g.REGIONS)s.regionUnlocked[r.id]=true;s.currentRegion='sa_amazonia';s.sightings.sa_esp_hydrochoerus_hydrochaeris=144;s.stages.sa_esp_hydrochoerus_hydrochaeris=5;s.published.sa_esp_hydrochoerus_hydrochaeris=true;s.specialFound.sa_esp_hydrochoerus_hydrochaeris={Albino:true,Épico:true};}
 if(scenario==='museum'){
  s.museum.wing=3;s.stages.zorro_rojo=5;s.published.zorro_rojo=true;s.museum.exhibits.zorro_rojo=true;s.inventory.fossil_fragment=157;s.inventory.fossil_skull=3;s.inventory.fossil_tooth=41;
  for(const r of g.MUSEUM_RELICTS)s.museum.relicts[r.id]=true;for(const c of g.MUSEUM_COLLECTIONS)s.museum.collections[c.id]=true;
  s.museum.excavationsCompleted=17;s.museum.curationPoints=8;s.museum.excavationHistory=[{site:'british_cliffs',at:1699999000000,rewards:{fossil_fragment:4}}];s.museum.excavations=[{id:18,site:'british_cliffs',endAt:1900000000000}];s.museum.excavationSeq=18;s.voyages=[{id:21,type:'coast',endAt:1900000000000}];s.voyageSeq=21;
 }
 if(scenario==='variants-monographs'){
  Object.assign(s.sightings,{zorro_rojo:999,reno:777});Object.assign(s.stages,{zorro_rojo:5,reno:5});Object.assign(s.published,{zorro_rojo:true,reno:true});s.specialFound.zorro_rojo={Albino:true,Notable:true};s.sexSeen.reno={male:true,female:true};s.dimorphism.reno=true;s.legendaryFound.ascua={id:'ascua',speciesId:'zorro_rojo'};
 }
 s.inventory.field_telescope=1;s.inventory.scholar_hat=1;s.equipment.instrument='field_telescope';s.equipment.hat='scholar_hat';s.regionUnlocked[s.currentRegion]=true;s.regionUnlocked[g.REGIONS[2].id]=true;
 g.persist();const raw=h.store.gran_atlas_v05;fixtures.push({scenario,version,sourceRef:ref,sourceSha256:sha(source),rawSha256:sha(raw),raw});
}
fs.writeFileSync('tests/fixtures/stability-saves-v3240.json',JSON.stringify(fixtures,null,2)+'\n');console.log(fixtures.map(f=>({scenario:f.scenario,version:f.version,bytes:f.raw.length})));
