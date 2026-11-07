'use strict';
const fs=require('node:fs'),vm=require('node:vm'),{catalogSource}=require('../tests/helpers/catalog.cjs');
const source=fs.readFileSync('www/js/app.js','utf8');
const a=vm.runInNewContext(catalogSource(source)+'\n({SPECIES,REGIONS,SPECIMEN_CATEGORIES,SPECIMEN_LEVELS,LEGENDARY_SPECIMENS,specimenRates,rollSpecimen,recordSpecimen})');
const n=1000000;let seed=3197;const rng=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
const counts={},expected={},bounds={},single={},snapshot={upgrades:{},legendaryFound:{}};
for(const c of [...Object.keys(a.SPECIMEN_LEVELS),'Albino','Melánico'])counts[c]=single[c]=0;
for(let i=0;i<n;i++){
 const r=a.rollSpecimen('zorro_rojo',{upgrades:{}},rng);if(r.category)counts[r.category]++;if(r.pigment)counts[r.pigment]++;
 const u=a.rollSpecimen('zorro_rojo',snapshot,rng);if(u.category)single[u.category]++;if(u.pigment)single[u.pigment]++;
 if(u.category==='Legendario')a.recordSpecimen('zorro_rojo',u,snapshot);
}
for(const [c,p]of Object.entries({...a.specimenRates('zorro_rojo'),Albino:.01/3,'Melánico':.01/3})){
 expected[c]=n*p;bounds[c]=6*Math.sqrt(n*p*(1-p));if(Math.abs(counts[c]-expected[c])>bounds[c])throw Error('Distribution '+c);
}
if(single.Legendario!==1)throw Error('Uniqueness');
const weight=s=>({'Común':12,'Poco común':5,Raro:1.8,'Muy rara':.4}[s.rare]||5);
const regional=a.LEGENDARY_SPECIMENS.map(l=>{
 const sp=a.SPECIES[l.speciesId],region=a.REGIONS.find(r=>r.species.includes(l.speciesId)),season=sp.seasons[0];
 const auto=region.species.filter(id=>{const s=a.SPECIES[id];return s.seasons.includes(season)&&s.habitats.some(h=>region.habitats.includes(h));});
 let manual=[],habitat,time,share=0;
 for(const h of region.habitats)for(const t of sp.times){const pool=region.species.filter(id=>{const s=a.SPECIES[id];return s.habitats.includes(h)&&s.times.includes(t)&&s.seasons.includes(season);});if(!pool.includes(l.speciesId))continue;const p=weight(sp)/pool.reduce((s,id)=>s+weight(a.SPECIES[id]),0);if(p>share){share=p;manual=pool;habitat=h;time=t;}}
 const autoShare=weight(sp)/auto.reduce((s,id)=>s+weight(a.SPECIES[id]),0);
 const rates=a.specimenRates(l.speciesId),manualEligiblePerHour=3600*.5*share,autoEligiblePerHour=720*.38*1.03*autoShare;
 return {id:l.id,speciesId:l.speciesId,name:l.name,species:sp.name,region:region.id,season,manualFilter:{habitat,time,pool:manual.length},autoPool:auto.length,manualSpeciesShare:share,autoSpeciesShare:autoShare,manualEligiblePerHour,autoEligiblePerHour,perManualSearch:Object.fromEntries(Object.entries(rates).map(([c,p])=>[c,.5*share*p])),perAutoSearch:Object.fromEntries(Object.entries(rates).map(([c,p])=>[c,.38*1.03*autoShare*p])),legendaryHourly:{manualExpected:manualEligiblePerHour*.0001,manualChance:1-Math.pow(1-.5*share*.0001,3600),autoExpected:autoEligiblePerHour*.0001,autoChance:1-Math.pow(1-.38*1.03*autoShare*.0001,720)}};
});
const report={version:'3.19.7',seed:3197,observations:n,species:'zorro_rojo',independent:counts,expected,sixSigmaTolerance:bounds,singlePartida:single,configuredCounts:Object.fromEntries(Object.keys(a.SPECIMEN_LEVELS).map(c=>[c,Object.values(a.SPECIMEN_CATEGORIES).filter(cs=>cs.includes(c)).length])),legendaryIndividuals:a.LEGENDARY_SPECIMENS.length,regionalAssumptions:'One species per search, census x1, no specialization or ethology. Manual illustrative rate one click/second (no enforced cooldown). Auto one helper, interval five seconds. Static regional pools before hourly caps; caps and pool exhaustion can change actual rates. Legendary expectations describe the first discovery, not repeatable yields.',regional};
fs.writeFileSync('docs/v3197/simulation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({counts,expected,single,configuredCounts:report.configuredCounts},null,2));
