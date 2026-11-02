const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const s=fs.readFileSync('www/js/app.js','utf8');
test('África agrega tres zonas sin alterar Europa y Asia',()=>{
 const match=s.match(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/);
 assert.ok(match,'No se encontraron regiones africanas');
 const regions=JSON.parse(match[1]);
 assert.equal(regions.length,3);
 assert.ok(regions.every(r=>r.continent==='África' && r.unlock.prestige>=53));
 const ids=regions.map(r=>r.id);
 assert.equal(new Set(ids).size,3);
 assert.ok(s.includes("if(r.continent==='África')"));
 assert.ok(s.includes("state.inventory?.africa_map"));
});
test('Especies africanas tienen familias gráficas y condiciones válidas',()=>{
 const match=s.match(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/);
 assert.ok(match,'No se encontró la fauna africana');
 const species=JSON.parse(match[1]);
 assert.equal(Object.keys(species).length,24);
 const valid=new Set(['bear','bison','camel','canid','cat','crocodile','deer','elephant','fish','forestbird','hare','lizard','mustelid','otter','pangolin','pelican','primate','raptor','reptile','rhino','salamander','seabird','small','snake','songbird','stork','swan','tortoise']);
 for(const [id,sp] of Object.entries(species)){
   assert.ok(valid.has(sp.kind),id+' sprite desconocido');
   assert.ok(sp.habitats.length && sp.times.length && sp.seasons.length,id+' condiciones vacías');
 }
});

test('ampliación v3.5 añade siete regiones y nuevas especies con sprites propios',()=>{
 const matches=[...s.matchAll(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/g)];
 assert.equal(matches.length,4);
 const extra=JSON.parse(matches[1][1]);
 assert.equal(extra.length,7);
 assert.equal(new Set(extra.map(x=>x.id)).size,7);
 assert.equal(extra.at(-1).name,'Madagascar');
 assert.ok(extra.every(x=>x.unlock.prestige>59 && x.species.length>=7));
 const blocks=[...s.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)];
 assert.equal(blocks.length,4);
 const newSpecies=JSON.parse(blocks[1][1]);
 assert.ok(Object.keys(newSpecies).length>=40);
 assert.ok(['hippo','zebra','giraffe','lemur','ostrich'].every(kind=>Object.values(newSpecies).some(s=>s.kind===kind)));
 for(const r of extra){
   for(const id of r.species) assert.ok(newSpecies[id] || blocks[0][1].includes('"'+id+'"'), 'Especie desconocida '+id);
 }
});


test('Beta 3.7 agrega tres regiones y fauna con hábitats válidos',()=>{
 const areas=[...s.matchAll(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/g)].map(x=>JSON.parse(x[1]));
 assert.equal(areas.length,4);
 const fresh=areas[2];
 assert.deepEqual(fresh.map(r=>r.name),['Cuerno de África','Delta del Okavango','Bosques de Gabón']);
 assert.deepEqual(fresh.map(r=>r.unlock.prestige),[83,86,89]);
 assert.equal(new Set(areas.flat().map(r=>r.id)).size,15);
 const species=[...s.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)].map(x=>JSON.parse(x[1]));
 assert.equal(species.length,4);
 assert.equal(Object.keys(species[2]).length,10);
 const catalog=Object.assign({},...species);
 for(const r of fresh){
  assert.equal(r.continent,'África');
  assert.ok(r.species.length>=9);
  for(const id of r.species){
   assert.ok(catalog[id],id);
   assert.ok(r.habitats.some(h=>catalog[id].habitats.includes(h)),'sin hábitat compartido '+id);
  }
 }
});


test('Beta 3.8 agrega gradualmente dos áreas, 10 especies y mantiene sus requisitos',()=>{
 const areas=[...s.matchAll(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/g)].map(m=>JSON.parse(m[1]));
 assert.equal(areas.length,4);
 const extra=areas[3];
 assert.deepEqual(extra.map(r=>r.name),['Tierras altas de Etiopía','Desierto del Namib']);
 assert.deepEqual(extra.map(r=>r.unlock.prestige),[92,95]);
 assert.equal(areas.flat().length,15);
 assert.equal(new Set(areas.flat().map(r=>r.id)).size,15);
 const blocks=[...s.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)].map(m=>JSON.parse(m[1]));
 assert.equal(blocks.length,4);
 assert.equal(Object.keys(blocks[3]).length,10);
 const catalog=Object.assign({},...blocks);
 const valid=new Set(['bosque','pradera','rio','costa','tundra','montana','estepa','mediterraneo','desierto','humedal']);
 for(const region of extra){
  assert.equal(region.continent,'África');
  assert.ok(region.species.length>=8);
  for(const id of region.species){
   assert.ok(catalog[id],'sin especie registrada: '+id);
   assert.ok(region.habitats.some(h=>catalog[id].habitats.includes(h)),'sin hábitat compatible: '+id);
  }
 }
 for(const [id,sp] of Object.entries(blocks[3])){
  assert.ok(sp.latin && sp.name && sp.kind,id);
  assert.ok(sp.habitats.length && sp.habitats.every(h=>valid.has(h)),id);
  assert.ok(sp.times.length && sp.seasons.length && sp.special.length,id);
 }
 assert.match(s,/if\(r\.continent==='África'\).*africa_map/);
});
