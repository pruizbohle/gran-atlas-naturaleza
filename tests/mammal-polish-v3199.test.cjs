'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {catalog}=require('./helpers/catalog.cjs');
const {classifyMammal,renderMammal,MAMMAL_FAMILIES}=require('../www/js/mammal-art-v3194.js');
const {SPECIES,SEXUAL_DIMORPHISM}=catalog();
const mammals=Object.entries(SPECIES).filter(([id,sp])=>classifyMammal(sp,id));
const previousContext=vm.createContext({});vm.runInContext(fs.readFileSync('www/js/lab/polish-before-v3198.js','utf8'),previousContext);
function contour(svg){
 let hidden=0;
 const visible=svg.replace(/<[^>]+>|[^<]+/g,token=>{
  if(hidden){if(/^<g\b/.test(token))hidden++;else if(token.startsWith('</g'))hidden--;return '';}
  if(/^<g\b[^>]*data-mammal-detail="true"/.test(token)){hidden=1;return '';}
  return token;
 }).replace(/<defs>[\s\S]*?<\/defs>/g,'').replace(/<g data-mammal-aura="true">[\s\S]*?<\/g>/g,'');
 return [...visible.matchAll(/\b(?:d|cx|cy|r|rx|ry|transform)="([^"]+)"/g)].map(x=>x[0]).join('|');
}
test('3.19.9 changes anatomical contours of all 269 mammals, beyond color and eye detail',()=>{
 assert.equal(mammals.length,269);assert.equal(Object.keys(MAMMAL_FAMILIES).length,68);
 const shapes=[];
 for(const [id,sp]of mammals){
  const after=renderMammal(sp,sp.color,'normal',null,id),before=previousContext.ATLAS_POLISH_BEFORE.getSpriteMarkup(id);
  assert.match(after,/data-mammal-polish="3.19.9"/);assert.notEqual(contour(after),contour(before),id+' must change real anatomy');shapes.push(contour(after));
 }
 assert.equal(new Set(shapes).size,269,'profiles remain individual rather than collapsing onto a generic rig');
});
test('all 16 current mammal dimorphisms preserve distinct male/female anatomy and valid variants',()=>{
 const configured=mammals.filter(([id])=>SEXUAL_DIMORPHISM[id]);assert.equal(configured.length,16);
 for(const [id,sp]of configured){
  const male=renderMammal(sp,sp.color,'normal','male',id),female=renderMammal(sp,sp.color,'normal','female',id);assert.notEqual(male,female,id);
  for(const sex of ['male','female'])for(const skin of ['normal','albino','melanico']){
   const svg=renderMammal(sp,sp.color,skin,sex,id);assert.match(svg,/viewBox="0 0 100 100"/);assert.doesNotMatch(svg,/NaN|undefined|Infinity|<filter|<image|<script/);
  }
 }
});
test('the anatomical revision leaves frozen zoological records untouched',()=>{
 for(const latin of ['Panthera tigris','Canis lupus','Cervus elaphus','Meles meles','Elephas maximus','Sousa plumbea','Dugong dugon']){
  const [id,sp]=mammals.find(([,sp])=>sp.latin===latin),snapshot=JSON.stringify(sp);
  assert.ok(renderMammal(Object.freeze(sp),sp.color,'normal',null,id));assert.equal(JSON.stringify(sp),snapshot);
 }
});
