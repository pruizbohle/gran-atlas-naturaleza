'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const source=require('../www/js/oceania-data-v3290.js');
test('Petauroides treatment cites a fixed MDD record and preserves the one source concept without splitting its presence',()=>{
 const d=JSON.parse(fs.readFileSync('docs/gm02/petauroides-decision.json'));
 const prior=JSON.parse(fs.readFileSync('docs/gm02/authority-mdd.json'));
 assert.equal(d.sha256,prior.sha256);assert.equal(d.revision,prior.repositoryCommit);
 assert.equal(d.record.sciName,'Petauroides_volans');assert.equal(d.record.id,'1000351');
 assert.equal(d.record.family,'Pseudocheiridae');assert.match(d.record.taxonomyNotes,/P\. armillatus and P\. minor/);
 assert.match(d.record.taxonomyNotesCitation,/10\.1038\/s41598-020-76364-z/);
 const taxa=Object.values(source.taxa).filter(t=>t.scientific==='Petauroides volans');assert.equal(taxa.length,1);
 const ps=source.presences.filter(p=>p.speciesId===taxa[0].id);assert.equal(ps.length,1);
 assert.equal(Number(ps[0].source.source_row),1420);assert.equal(ps[0].regionId,'oc_australia_oriental');
 assert.equal(taxa[0].sourceSpeciesId,d.sourceSpeciesId);assert.ok(!Object.values(source.taxa).some(t=>/Petauroides (minor|armillatus)/.test(t.scientific)));
});
