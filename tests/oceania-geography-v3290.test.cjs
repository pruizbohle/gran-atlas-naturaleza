'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const before=require('../www/js/southamerica-geography-v3230.js'),geo=require('../www/js/oceania-geography-v3290.js');
const data=require('../www/js/oceania-data-v3290.js');
const regions=data.sourceRegions.map(r=>({...r,habitats:[r.id.includes('desierto')?'desierto':'bosque']}));
test('Oceanía candidate has precisely eight selectable unique cells and source-aligned region IDs',()=>{
 const m=geo.layout('Oceanía',regions),a=geo.audit('Oceanía',regions);
 assert.equal(m.cells.length,8);assert.equal(new Set(m.cells.map(c=>c.q+','+c.r)).size,8);
 assert.deepEqual(m.cells.flatMap(c=>c.regionIds).sort(),regions.map(r=>r.id).sort());
 assert.ok(m.cells.every(c=>c.playable));assert.equal(a.additionalCells,0);assert.equal(a.edgeErrors.length,0);assert.ok(a.neighborPairs>0);
 assert.ok(m.board.width<650&&m.board.height<650);
});
test('Australian mainland cells share mathematically exact edges, island groups remain separate',()=>{
 const m=geo.layout('Oceanía',regions),by=Object.fromEntries(m.cells.map(c=>[c.regionIds[0],c]));
 const connected=(a,b)=>geo.directions.some(([q,r])=>b.q===a.q+q&&b.r===a.r+r);
 const mainland=regions.filter(r=>!['oc_nueva_guinea','oc_nueva_zelanda','oc_tasmania'].includes(r.id)).map(r=>by[r.id]);
 const seen=new Set([mainland[0].cellId]);for(let i=0;i<mainland.length;i++)for(const a of mainland)for(const b of mainland)if(seen.has(a.cellId)&&connected(a,b))seen.add(b.cellId);
 assert.equal(seen.size,5);
 for(const id of ['oc_nueva_guinea','oc_nueva_zelanda','oc_tasmania'])assert.ok(!mainland.some(c=>connected(c,by[id])));
 assert.ok(by.oc_nueva_guinea.y<by.oc_norte_tropical_australiano.y);assert.ok(by.oc_nueva_zelanda.x>by.oc_australia_oriental.x);
});
test('all five prior continent meshes and audits delegate without coordinate or geometry changes',()=>{
 const old=JSON.parse(fs.readFileSync('docs/gm01/game-snapshot.json'));
 for(const continent of ['Europa','Asia','África','Norteamérica','Sudamérica']){
  const r=old.regions.filter(r=>r.continent===continent);
  assert.deepEqual(geo.layout(continent,r),before.layout(continent,r));assert.deepEqual(geo.audit(continent,r),before.audit(continent,r));
 }
 assert.equal(geo.radius,before.radius);assert.deepEqual(geo.vertices(),before.vertices());
});
