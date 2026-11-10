'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto'),cp=require('node:child_process');
const data=require('../www/js/oceania-data-v3290.js');
const {harness}=require('./helpers/live-game.cjs');
const regions={oc_nueva_guinea:18,oc_costa_nordeste_australiana:13,oc_norte_tropical_australiano:14,oc_desierto_australiano:14,oc_tasmania:12,oc_australia_occidental:17,oc_australia_oriental:26,oc_nueva_zelanda:17};

test('GM-02A covers exactly the eight audited source regions and 131 pairs',()=>{
 assert.deepEqual(Object.fromEntries(data.sourceRegions.map(r=>[r.id,r.species.length])),regions);
 assert.equal(data.presences.length,131);
 assert.equal(new Set(data.presences.map(p=>p.regionId+'|'+p.speciesId)).size,131);
 assert.equal(new Set(data.presences.map(p=>p.source.source_row)).size,131);
 for(const p of data.presences){assert.ok(data.taxa[p.speciesId]);assert.equal(p.source.source_sheet,'Fauna');assert.ok(p.source['source_ID especie']);assert.ok(p.source['source_ID hex']);}
});
test('the 96 audited proposals and resolved dingo yield 97 prepared identities, zero invented reuse',()=>{
 const phase=JSON.parse(fs.readFileSync('docs/gm01/summary.json')).phases.find(p=>p.phase==='GM-02');
 assert.deepEqual(Object.values(data.taxa).map(t=>t.scientific).sort(),[...phase.new_unrepresented_source_concepts,'Canis familiaris'].sort());
 assert.equal(new Set(Object.values(data.taxa).map(t=>t.sourceSpeciesId)).size,97);
 assert.equal(new Set(Object.values(data.taxa).map(t=>t.scientific)).size,97);
 const old=JSON.parse(fs.readFileSync('docs/gm01/game-snapshot.json'));
 for(const t of Object.values(data.taxa)){assert.ok(!old.species[t.id]);assert.ok(!Object.values(old.species).some(s=>s.latin===t.scientific));}
});
test('dingo decision preserves both original rows and never aliases the existing wolf',()=>{
 const d=data.dingoDecision,records=data.presences.filter(p=>p.speciesId===d.id);
 assert.equal(d.scientific,'Canis familiaris');assert.equal(d.common,'Dingo');
 assert.deepEqual(records.map(p=>Number(p.source.source_row)),[1298,1313]);
 assert.deepEqual(records.map(p=>p.source['source_ID hex']),['HX-07-18','HX-07-19']);
 assert.ok(records.every(p=>p.source['source_Nombre científico']==='Canis familiaris'&&p.source['source_Nombre común']==='Dingo'));
 const authority=JSON.parse(fs.readFileSync('docs/gm02/authority-mdd.json'));
 const accepted=authority.rows.find(r=>r.sciName==='Canis_familiaris');
 assert.equal(accepted.id,'1005940');assert.match(accepted.taxonomyNotes,/includes dingo as a synonym/);
 assert.ok(accepted.otherCommonNames.split('|').includes('Dingo'));
});
test('source contract retains original records and GM-01 scientific/art warnings',()=>{
 for(const p of data.presences){assert.equal(p.source.row_kind,'source');assert.ok(p.source.source_Bioma);assert.ok(p.source['source_Consulta GBIF (sin validar)']);assert.equal(p.ecologyStatus,'pending-explicit-habitat-time-season-configuration');}
 for(const t of Object.values(data.taxa)){assert.equal(t.productionProfileReady,false);assert.match(t.artProposal.status,/preliminar/);}
 for(const name of ['Apteryx haastii','Lophorina superba','Crocodylus novaeguineae','Petauroides volans','Trichoglossus haematodus']){
  const t=Object.values(data.taxa).find(t=>t.scientific===name);assert.ok(t.sourceIssues.some(i=>i.type==='concepto_taxonomico'));
 }
});
test('GM-02A contract is immutable and cannot silently mutate shared source data',()=>{
 assert.ok(Object.isFrozen(data));assert.ok(Object.isFrozen(data.presences[0].source));
 assert.throws(()=>{data.sourceRegions[0].species.push('invented');},TypeError);
});
test('all declared audit and authority inputs retain their hashes; generation is deterministic',()=>{
 for(const[path,sha]of Object.entries(data.sources))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),sha,path);
 cp.execFileSync('python',['scripts/build-oceania-gm02.py','--check']);
 assert.deepEqual(JSON.parse(fs.readFileSync('docs/gm02/source-contract.json')),data);
});
test('production 3.30.0 installs 807 identities, 87 regions, 1460 pairs and the original save key',()=>{
 assert.equal(JSON.parse(fs.readFileSync('package.json')).version,'3.30.0');
 assert.equal(data.productionReady,false);
 assert.ok(!fs.readFileSync('www/index.html','utf8').includes('oceania-data-v3290.js'));
 assert.ok(fs.readFileSync('www/sw.js','utf8').includes('oceania-data-v3290.js'));
 const app=fs.readFileSync('www/js/app.js','utf8');
 assert.match(app,/const STORAGE_KEY='gran_atlas_v05'/);
 const h=harness({},null,{bridge:'\nwindow.__atlasTest={SPECIES,REGIONS};\n})();'});
 assert.equal(Object.keys(h.window.__atlasTest.SPECIES).length,807);
 assert.equal(h.window.__atlasTest.REGIONS.length,87);
 assert.equal(h.window.__atlasTest.REGIONS.reduce((n,r)=>n+r.species.length,0),1460);
});
