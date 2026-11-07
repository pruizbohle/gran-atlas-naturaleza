'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {catalog}=require('./helpers/catalog.cjs');
const {renderFish,classifyFish}=require('../www/js/fish-art-v3191.js');
const fish=Object.entries(catalog().SPECIES).filter(([,sp])=>classifyFish(sp));
const geometry=s=>s.replace(/(?:fill|stroke)="[^"]*"/g,'');
test('v3.19.9 audits and routes all 18 fish and rays by their scientific identity',()=>{
 assert.equal(fish.length,18);assert.equal(fish.filter(([,sp])=>sp.kind==='ray').length,1);
 for(const [id,sp]of fish){const snapshot=JSON.stringify(sp);Object.freeze(sp);assert.equal(classifyFish({...sp,kind:'snake'}),classifyFish(sp));assert.ok(renderFish(sp,null,'normal'),id);assert.equal(JSON.stringify(sp),snapshot);}
 for(const sp of [{name:'Pez cabeza de serpiente',latin:'Python regius',kind:'fish'},{name:'Delfín',latin:'Tursiops truncatus',kind:'fish'},{name:'Proteo',latin:'Proteus anguinus',kind:'fish'},{name:'Tortuga',latin:'Testudo graeca',kind:'ray'}])assert.equal(classifyFish(sp),null,sp.latin);
 assert.equal(renderFish(null),null);assert.equal(renderFish({latin:'unknown'}),null);
});
test('18 taxa have individually constructed anatomy; all pigment variants keep their geometry',()=>{
 assert.equal(new Set(fish.map(([,sp])=>geometry(renderFish(sp)))).size,18);
 for(const [id,sp]of fish){
  const normal=renderFish(sp);assert.match(normal,/viewBox="0 0 100 100"/);assert.match(normal,/data-fish-version="3.19.9"/);assert.match(normal,/<\/svg>$/);assert.doesNotMatch(normal,/NaN|undefined|Infinity|<image|<filter|<animate|<script|url\(/);assert.ok(normal.length<6000,id);
  for(const skin of ['albino','melanico']){const variant=renderFish(sp,null,skin);assert.equal(geometry(variant),geometry(normal),id+skin);assert.notEqual(variant,normal);}
 }
});
test('renderer exports the same API in Node and a browser-free vm context',()=>{
 const ctx=vm.createContext({});vm.runInContext(fs.readFileSync('www/js/fish-art-v3191.js','utf8'),ctx);
 assert.equal(typeof ctx.ATLAS_FISH_ART_V3191,'function');assert.equal(typeof ctx.ATLAS_FISH_ART_V3191.classify,'function');
 for(const [,sp]of fish)assert.equal(ctx.ATLAS_FISH_ART_V3191(sp),renderFish(sp));
});
