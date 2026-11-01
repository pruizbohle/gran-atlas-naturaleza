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
