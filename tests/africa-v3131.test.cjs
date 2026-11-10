const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const src=require('./helpers/legacy-source.cjs').withoutOceania3290(fs.readFileSync('www/js/app.js','utf8'));
const regionBase=JSON.parse(src.match(/const REGIONS=(\[[\s\S]*?\n\]);/)[1]);
const regionUpdates=[...src.matchAll(/REGIONS\.push\(\.\.\.(\[[^\n]+\])\);/g)].flatMap(m=>JSON.parse(m[1]));
const regions=[...regionBase,...regionUpdates];
const african=regions.filter(r=>r.continent==='África');
const reference=JSON.parse(src.match(/const AFRICA_V3131_EXCEL_REFERENCE=(\{[^\n]+\});/)[1]);
const assignment=JSON.parse(src.match(/const AFRICA_V3131_ASSIGNED=(\{[^\n]+\});/)[1]);
const additions=JSON.parse(src.match(/Object\.assign\(SPECIES,(\{"af_xlsx_131_[^\n]+\})\);/)[1]);
const idRegex=/(?:"([^"]+)"|([A-Za-z_]\w*))\s*:\s*\{\s*(?:"name"|name)\s*:\s*(?:"[^"]+"|'[^']+')\s*,\s*(?:"latin"|latin)\s*:\s*(?:"([^"]+)"|'([^']+)')/g;
const registry=new Map();
for(const match of src.matchAll(idRegex)){
  const id=match[1]||match[2],latin=match[3]||match[4];
  registry.set(id,latin);
}
test('Excel africano: 14 hexágonos, 154 taxones y 24 zonas del juego',()=>{
 assert.equal(Object.keys(reference).length,14);
 assert.equal(new Set(Object.values(reference).flatMap(v=>v.latin)).size,154);
 assert.equal(african.length,24);
 assert.equal(new Set(regions.map(r=>r.id)).size,regions.length);
});
test('Excel africano: todos los 154 taxones tienen ficha y asignación en su zona equivalente',()=>{
 const regionMap=new Map(african.map(r=>[r.id,r]));
 const covered=new Map();
 for(const [excelHex,row] of Object.entries(reference)){
  const reg=regionMap.get(row.gameRegion);
  assert.ok(reg,'zona ausente '+excelHex+' -> '+row.gameRegion);
  const ids=assignment[row.gameRegion];
  assert.ok(ids,'sin asignaciones '+row.gameRegion);
  for(const latin of row.latin){
   const possible=ids.filter(id=>registry.get(id)?.toLowerCase()===latin.toLowerCase()
     ||(latin==='Pan troglodytes'&&id==='af_chimpance')
     ||(latin==='Gorilla beringei'&&id==='af_gorila_montana'));
   assert.ok(possible.length,'sin ficha para '+latin+' de '+excelHex);
   for(const id of possible)assert.ok(registry.has(id),'identificador no definido '+id);
   covered.set(latin,true);
  }
 }
 assert.equal(covered.size,154);
});
test('Las 39 fichas nuevas tienen condiciones observables en las zonas originales',()=>{
 assert.equal(Object.keys(additions).length,39);
 const regionMap=new Map(african.map(r=>[r.id,r]));
 for(const [regionId,ids] of Object.entries(assignment)){
  const region=regionMap.get(regionId);
  assert.ok(region,'zona inexistente '+regionId);
  assert.equal(new Set(ids).size,ids.length,'taxones duplicados '+regionId);
  for(const id of ids){
   assert.ok(registry.has(id),'sin definición '+id);
   const newSp=additions[id];
   if(newSp)assert.ok(newSp.habitats.some(h=>region.habitats.includes(h)),
     'sin hábitat '+newSp.name+' en '+region.name);
  }
 }
});
