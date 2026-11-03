const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const source=fs.readFileSync('www/js/app.js','utf8');

const base=JSON.parse(source.match(/const REGIONS=(\[[\s\S]*?\n\]);/)[1]);
const batches=[...source.matchAll(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/g)].map(m=>JSON.parse(m[1]));
const regions=[...base,...batches.flat()];
const africa=regions.filter(r=>r.continent==='África');
const fauna=[...source.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)].map(m=>JSON.parse(m[1]));
const species=Object.assign({},...fauna);
const assignments=JSON.parse(source.match(/const AFRICA_V313_ASSIGN=(\{[^\n]+\});/)[1]);
const equivalents=JSON.parse(source.match(/const AFRICA_EXCEL_HEX=(\{[^\n]+\});/)[1]);
const foreign=new Set(['asia_esp_0206','eu_esp_0219','eu_esp_0505']);

test('Beta 3.13 contiene 24 zonas africanas sin cambiar los ID anteriores',()=>{
 assert.equal(africa.length,24);
 assert.equal(new Set(regions.map(r=>r.id)).size,regions.length);
 assert.deepEqual(batches.filter(a=>a.some(r=>r.continent==='África')).at(-1).map(r=>r.name),['Desierto del Sáhara','Sahel oriental']);
 assert.deepEqual(batches.filter(a=>a.some(r=>r.continent==='África')).at(-1).map(r=>r.unlock.prestige),[119,122]);
 assert.ok(africa.every(r=>r.habitats.length&&r.species.length>=7));
 assert.ok(Object.keys(equivalents).includes('HX-06-07'));
 assert.equal(equivalents['HX-07-11'],'HX-05-12');
});

test('Fauna añadida se integra sin perder fichas históricas ni hábitats',()=>{
 assert.equal(Object.keys(fauna.at(-2)).length,38);
 assert.ok(Object.hasOwn(species,'af_okapi')&&Object.hasOwn(species,'af_facoquero'));
 assert.ok(assignments['HX-08-11'].includes('af_okapi'));
 assert.ok(assignments['HX-07-08'].includes('af_facoquero'));
 const lookup=new Map(africa.map(r=>[r.id,r]));
 for(const [regionId,ids] of Object.entries(assignments)){
   const region=lookup.get(regionId);
   assert.ok(region,'región desconocida '+regionId);
   assert.equal(new Set(ids).size,ids.length,'duplicados en ampliación '+regionId);
   for(const id of ids){
     const p=species[id];
     assert.ok(p||foreign.has(id),'especie no definida '+id);
     if(p)assert.ok(p.habitats.some(h=>region.habitats.includes(h)),
       id+' sin bioma observable en '+region.name);
   }
 }
 const ids=new Set(africa.flatMap(r=>r.species));
 for(const additions of Object.values(assignments))additions.forEach(id=>ids.add(id));
 for(const r of batches.at(-1))for(const id of r.species)
   assert.ok(ids.has(id),'fauna nueva sin asignar: '+id);
});

test('Sin especies nuevas duplicadas por nombre científico',()=>{
 const newEntries=Object.entries(fauna.at(-2));
 const existing=new Set(Object.values(Object.assign({},...fauna.slice(0,-2))).map(s=>s.latin.toLowerCase()));
 assert.equal(new Set(newEntries.map(([id,s])=>s.latin.toLowerCase())).size,newEntries.length);
 for(const [id,s] of newEntries)assert.ok(!existing.has(s.latin.toLowerCase()),id);
});
