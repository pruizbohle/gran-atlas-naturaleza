'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),cp=require('node:child_process'),vm=require('node:vm');
const {reviewHarness,candidate}=require('./helpers/oceania-review.cjs'),{harness}=require('./helpers/live-game.cjs');
const art=require('../www/js/oceania-art-v3290.js'),json=x=>JSON.parse(JSON.stringify(x)),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
test('all 97 candidate profiles and configured sex/pigment/specimen routes generate scoped finite SVGs',()=>{
 const a=reviewHarness().window.__atlasTest;let count=0;
 for(const[id,sp]of Object.entries(candidate.species))for(const skin of ['normal','alfa',...(sp.special.includes('Albino')?['albino']:[])])for(const sex of skin==='normal'&&sp.dimorphism?[null,'male','female']:[null]){
  const svg=a.getSpriteMarkup(id,skin,sex);assert.match(svg,/^<svg /);assert.match(svg,/<\/svg>$/);assert.match(svg,/data-oc-profile=/);assert.doesNotMatch(svg,/NaN|undefined|Infinity|<script|<foreignObject|<image/);assert.ok(svg.includes('viewBox="0 0 100 100"'));count++;
 }
 assert.equal(count,212);assert.equal(Object.keys(candidate.dimorphism).length,7);
});
test('every identity has a distinct actual illustration after removing identity metadata',()=>{
 const a=reviewHarness().window.__atlasTest,seen=new Map();
 for(const id of Object.keys(candidate.species)){const stripped=a.getSpriteMarkup(id).replace(/\sdata-[\w-]+="[^"]*"/g,'');assert.ok(!seen.has(stripped),id+' duplicates '+seen.get(stripped));seen.set(stripped,id);}
});
test('candidate routing changes none of the 710 previous species, their variants, sexes or game state',()=>{
 const old=harness().window.__atlasTest,a=reviewHarness().window.__atlasTest,before=JSON.stringify(a.state);
 for(const[id,sp]of Object.entries(old.SPECIES)){
  assert.equal(art.render(sp,sp.color),null,id);
  for(const skin of ['normal',...(sp.special.includes('Albino')?['albino']:[]),...(sp.special.includes('Melánico')?['melanico']:[])])for(const sex of skin==='normal'&&old.SEXUAL_DIMORPHISM[id]?[null,'male','female']:[null])assert.equal(hash(a.getSpriteMarkup(id,skin,sex)),hash(old.getSpriteMarkup(id,skin,sex)),id+skin+sex);
 }
 assert.equal(JSON.stringify(a.state),before);
});
test('the seven configured sexual profiles use species-specific ornament or plumage differences',()=>{
 const a=reviewHarness().window.__atlasTest;
 for(const id of Object.keys(candidate.dimorphism)){assert.notEqual(a.getSpriteMarkup(id,'normal','male'),a.getSpriteMarkup(id,'normal','female'),id);}
 const male=a.getSpriteMarkup('oc_esp_lophorina_superba','normal','male'),female=a.getSpriteMarkup('oc_esp_lophorina_superba','normal','female');assert.ok(male.length!==female.length);
 assert.match(a.getSpriteMarkup('oc_esp_nymphicus_hollandicus','normal','female'),/M10 87L17 87/);
});
test('candidate SVG generation draws no RNG, reuses the actual cache and retains resolved scientific treatment',()=>{
 let calls=0;const h=reviewHarness({},null,{rng:()=>{calls++;return .5;}}),a=h.window.__atlasTest,before=calls;
 for(const id of Object.keys(candidate.species)){const svg=a.getSpriteMarkup(id);assert.equal(a.getSpriteMarkup(id),svg);}
 assert.equal(calls,before);assert.equal(candidate.approvedForProduction,true);assert.equal(candidate.pendingScientificReviews.length,0);
});
test('isolated art catalog reproduces the exact candidate production router and does not access storage',()=>{
 cp.execFileSync(process.execPath,['scripts/build-oceania-art-lab-v3290.cjs','--check']);
 const context=vm.createContext({});
 for(const name of ['mammal-art-v3194','bird-art-v3193','herp-art-v3192','fish-art-v3191','legendary-art-v3197','northamerica-data-v3220','northamerica-polish-v3221','northamerica-art-v3220','southamerica-data-v3230','southamerica-polish-v3231','southamerica-art-v3230','oceania-runtime-v3290','oceania-art-v3290','lab/oceania-catalog-v3290'])vm.runInContext(fs.readFileSync('www/js/'+name+'.js','utf8'),context);
 const a=reviewHarness().window.__atlasTest;
 for(const[id,sp]of Object.entries(candidate.species))for(const skin of ['normal','alfa',...(sp.special.includes('Albino')?['albino']:[])])assert.equal(context.AtlasOceaniaArtReview.sprite(id,skin),a.getSpriteMarkup(id,skin));
});
test('new eye ink follows the existing pigment contract so configured albinos retain visible pupils',()=>{
 const a=reviewHarness().window.__atlasTest;
 for(const[id,sp]of Object.entries(candidate.species).filter(([,s])=>s.special.includes('Albino'))){
  assert.match(a.getSpriteMarkup(id,'normal'),/<circle[^>]*fill="#202d29"/);
  assert.match(a.getSpriteMarkup(id,'albino'),/<circle[^>]*fill="#ad858d"/);
 }
});
