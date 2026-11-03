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
 assert.equal(matches.length,9);
 const extra=JSON.parse(matches[1][1]);
 assert.equal(extra.length,7);
 assert.equal(new Set(extra.map(x=>x.id)).size,7);
 assert.equal(extra.at(-1).name,'Madagascar');
 assert.ok(extra.every(x=>x.unlock.prestige>59 && x.species.length>=7));
 const blocks=[...s.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)];
 assert.equal(blocks.length,9);
 const newSpecies=JSON.parse(blocks[1][1]);
 assert.ok(Object.keys(newSpecies).length>=40);
 assert.ok(['hippo','zebra','giraffe','lemur','ostrich'].every(kind=>Object.values(newSpecies).some(s=>s.kind===kind)));
 for(const r of extra){
   for(const id of r.species) assert.ok(newSpecies[id] || blocks[0][1].includes('"'+id+'"'), 'Especie desconocida '+id);
 }
});


test('Beta 3.7 agrega tres regiones y fauna con hábitats válidos',()=>{
 const areas=[...s.matchAll(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/g)].map(x=>JSON.parse(x[1]));
 assert.equal(areas.length,9);
 const fresh=areas[2];
 assert.deepEqual(fresh.map(r=>r.name),['Cuerno de África','Delta del Okavango','Bosques de Gabón']);
 assert.deepEqual(fresh.map(r=>r.unlock.prestige),[83,86,89]);
 assert.equal(new Set(areas.flat().map(r=>r.id)).size,24);
 const species=[...s.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)].map(x=>JSON.parse(x[1]));
 assert.equal(species.length,9);
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
 assert.equal(areas.length,9);
 const extra=areas[3];
 assert.deepEqual(extra.map(r=>r.name),['Tierras altas de Etiopía','Desierto del Namib']);
 assert.deepEqual(extra.map(r=>r.unlock.prestige),[92,95]);
 assert.equal(areas.flat().length,24);
 assert.equal(new Set(areas.flat().map(r=>r.id)).size,24);
 const blocks=[...s.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)].map(m=>JSON.parse(m[1]));
 assert.equal(blocks.length,9);
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


test('Beta 3.9 contiene 3 regiones nuevas, 12 especies y desbloqueo progresivo',()=>{
 const areas=[...s.matchAll(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/g)].map(m=>JSON.parse(m[1]));
 assert.equal(areas.length,9);
 const extra=areas[4];
 assert.deepEqual(extra.map(r=>r.name),['Montañas del Atlas','Bosques de miombo','Costa de Mozambique']);
 assert.deepEqual(extra.map(r=>r.unlock.prestige),[98,101,104]);
 assert.equal(areas.flat().length,24);
 assert.equal(new Set(areas.flat().map(r=>r.id)).size,24);
 const blocks=[...s.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)].map(m=>JSON.parse(m[1]));
 assert.equal(blocks.length,9);
 const added=blocks[4];
 assert.equal(Object.keys(added).length,12);
 const catalog=Object.assign({},...blocks);
 const oldIds=new Set(Object.keys(Object.assign({},...blocks.slice(0,4))));
 assert.ok(Object.keys(added).every(id=>!oldIds.has(id)),'ID sobreescrito');
 const valid=new Set(['bosque','pradera','rio','costa','tundra','montana','estepa','mediterraneo','desierto','humedal']);
 for(const region of extra){
  assert.ok(region.species.length>=9);
  assert.equal(region.continent,'África');
  for(const id of region.species){
   assert.ok(catalog[id],id+' sin datos');
   assert.ok(region.habitats.some(h=>catalog[id].habitats.includes(h)),id+' no observable');
  }
 }
 for(const [id,sp] of Object.entries(added)){
  assert.ok(sp.latin&&sp.name&&sp.kind&&sp.color,id);
  assert.ok(sp.habitats.length&&sp.habitats.every(h=>valid.has(h)),id);
  assert.ok(sp.times.length&&sp.seasons.length&&sp.special.length,id);
 }
 assert.match(s,/if\(r\.continent==='África'\).*africa_map/);
});


test('Beta 3.10 añade Rift y Seychelles, ocho especies nuevas sin sobrescribir fichas',()=>{
 const areas=[...s.matchAll(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/g)].map(m=>JSON.parse(m[1]));
 assert.equal(areas.length,9);
 const fresh=areas[5];
 assert.deepEqual(fresh.map(r=>r.name),['Lagos del Rift','Islas Seychelles y Aldabra']);
 assert.deepEqual(fresh.map(r=>r.unlock.prestige),[107,110]);
 assert.equal(areas.flat().length,24);
 assert.equal(new Set(areas.flat().map(r=>r.id)).size,24);
 const blocks=[...s.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)].map(m=>JSON.parse(m[1]));
 assert.equal(blocks.length,9);
 const newest=blocks[5];
 assert.equal(Object.keys(newest).length,8);
 const prior=Object.assign({},...blocks.slice(0,5));
 const catalog=Object.assign({},prior,newest);
 assert.ok(Object.keys(newest).every(id=>!Object.hasOwn(prior,id)),'ID de especie duplicado');
 const habitats=new Set(['bosque','pradera','rio','costa','tundra','montana','estepa','mediterraneo','desierto','humedal']);
 for(const region of fresh){
   assert.equal(region.continent,'África');
   assert.ok(region.species.length>=8);
   for(const id of region.species){
    assert.ok(catalog[id],id+' sin ficha');
    assert.ok(region.habitats.some(h=>catalog[id].habitats.includes(h)),id+' sin hábitat observable');
   }
 }
 for(const [id,sp] of Object.entries(newest)){
  assert.ok(sp.name&&sp.latin&&sp.kind&&sp.color,id);
  assert.ok(sp.habitats.length&&sp.habitats.every(h=>habitats.has(h)),id);
  assert.ok(sp.times.length&&sp.seasons.length&&sp.special.length,id);
 }
 assert.match(s,/if\(r\.continent==='África'\).*africa_map/);
});


test('Beta 3.12 suma Bangweulu y Lowveld: 22 zonas, ocho especies y ecología válida',()=>{
 const areas=[...s.matchAll(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/g)].map(m=>JSON.parse(m[1]));
 assert.equal(areas.length,9);
 const fresh=areas[6];
 assert.deepEqual(fresh.map(r=>r.name),['Humedales de Bangweulu','Lowveld y Kruger']);
 assert.deepEqual(fresh.map(r=>r.unlock.prestige),[113,116]);
 assert.equal(areas.flat().length,24);
 assert.equal(new Set(areas.flat().map(r=>r.id)).size,24);
 const blocks=[...s.matchAll(/Object\.assign\(SPECIES,(\{"af_[^\n]+\})\);/g)].map(m=>JSON.parse(m[1]));
 assert.equal(blocks.length,9);
 const added=blocks[6],prior=Object.assign({},...blocks.slice(0,6)),catalog={...prior,...added};
 assert.equal(Object.keys(added).length,8);
 assert.ok(Object.keys(added).every(id=>!Object.hasOwn(prior,id)));
 const valid=new Set(['bosque','pradera','rio','costa','tundra','montana','estepa','mediterraneo','desierto','humedal']);
 for(const region of fresh){
  assert.equal(region.continent,'África');
  assert.ok(region.species.length>=10);
  for(const id of region.species){
   assert.ok(catalog[id],id+' sin definición');
   assert.ok(region.habitats.some(h=>catalog[id].habitats.includes(h)),id+' inaccesible');
  }
 }
 for(const [id,p] of Object.entries(added)){
  assert.ok(p.name&&p.latin&&p.kind&&p.color,id);
  assert.ok(p.habitats.every(x=>valid.has(x))&&p.times.length&&p.seasons.length&&p.special.length,id);
 }
 assert.match(s,/V310_NEW_REGIONS=\['HX-08-12','HX-07-14','HX-09-12','HX-11-10'\]/);
});
