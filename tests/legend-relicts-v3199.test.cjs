'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),vm=require('node:vm');
const legend=require('../www/js/legendary-art-v3197.js'),relict=require('../www/js/relict-art-v3199.js'),before=require('./fixtures/legend-relicts-v3198.json');
const geometryHash=svg=>crypto.createHash('sha256').update((svg.match(/ (?:d|cx|cy|rx|ry|x|y|points)="[^"]+"/g)||[]).join('|')).digest('hex');
test('twelve legendary and nine relict identities persist with true geometry revisions',()=>{
 for(const [art,baseline]of [[legend,before.legendary],[relict,before.relicts]]){
  assert.deepEqual([...art.ids],Object.keys(baseline));const drawings=new Set();
  for(const id of art.ids){const svg=art.render(id);assert.notEqual(geometryHash(svg),baseline[id],id+' must change anatomy, not only paint');assert.ok(svg.length<10000,id);assert.match(svg,/viewBox="0 0 100 100"/);assert.doesNotMatch(svg,/NaN|undefined|Infinity|<filter|<image|<animate|url\(|href=/);assert.equal(svg,art.render(id));drawings.add(geometryHash(svg));}
  assert.equal(drawings.size,art.ids.length);
 }
 assert.throws(()=>legend.render('other'),/Unknown legendary/);assert.equal(relict.render('other'),'');assert.equal(relict.render('__proto__'),'');
});
test('standalone production modules run in Node without window and without touching state',()=>{
 const ctx=vm.createContext({});
 for(const name of ['legendary-art-v3197','relict-art-v3199'])vm.runInContext(fs.readFileSync('www/js/'+name+'.js','utf8'),ctx);
 assert.equal(ctx.ATLAS_LEGENDARY_ART.ids.length,12);assert.equal(ctx.ATLAS_RELICT_ART.ids.length,9);assert.equal(ctx.renderRelictArt('gharial'),relict.render('gharial'));assert.equal(typeof ctx.window,'undefined');assert.equal(typeof ctx.state,'undefined');
 for(const [id,hash]of Object.entries(before.relicts)){assert.match(ctx.renderRelictArt(id),new RegExp('data-relict-art="'+id+'"'));assert.ok(hash);}
});
