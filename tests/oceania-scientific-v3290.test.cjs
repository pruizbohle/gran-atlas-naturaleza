'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const source=require('../www/js/oceania-data-v3290.js'),runtime=require('../www/js/oceania-runtime-v3290.js');
const record=JSON.parse(fs.readFileSync('docs/gm02/scientific-decisions.json'));
test('scientific decisions preserve every source row, ID and presence while applying explicit authority names',()=>{
 assert.equal(record.decisions.length,4);
 for(const d of record.decisions){const old=source.taxa[d.id],sp=runtime.species[d.id];assert.equal(old.scientific,d.sourceScientific);assert.equal(sp.sourceScientific,d.sourceScientific);assert.equal(sp.latin,d.acceptedScientific);assert.equal(sp.taxonomicStatus,'authority-reviewed');assert.equal(old.sourceSpeciesId,d.sourceSpeciesId);
 const rows=source.presences.filter(p=>p.speciesId===d.id);assert.deepEqual(rows.map(p=>p.source.source_row),d.sourceFaunaRows);assert.deepEqual(rows.map(p=>p.source['source_ID hex']),d.sourceHexIds);assert.ok(d.scope.length>80);
 }
 assert.equal(runtime.species.oc_esp_apteryx_haastii.latin,'Apteryx maxima');assert.deepEqual(runtime.pendingScientificReviews,[]);
 for(const [name,hash] of Object.entries(record.evidence))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('docs/gm02/scientific-evidence/'+name)).digest('hex'),hash);
 const ioc=JSON.parse(fs.readFileSync('docs/gm02/scientific-evidence/ioc-15.2-extract.json'));
 assert.ok(ioc.rows.some(r=>r.row===37&&r.cells[6]==='maxima'));assert.ok(ioc.rows.some(r=>r.row===20360&&r.cells[6]==='superba'&&r.cells[10]==='Vogelkop Lophorina'));
});
