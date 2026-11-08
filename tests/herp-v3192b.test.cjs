'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const engine=fs.readFileSync('www/js/herp-art-v3192.js','utf8');
const oldEngine=fs.readFileSync('www/js/lab/herp-art-v3192-before.js','utf8').replace('ATLAS_HERP_ART_V3192_BEFORE','ATLAS_HERP_ART_V3192');
const fish=fs.readFileSync('www/js/fish-art-v3191.js','utf8');
const source=fs.readFileSync('www/js/app.js','utf8');
const data=source.slice(source.indexOf('const SPECIES={'),source.indexOf('const GLOBAL_BIOMES_FULL='))+'\n'+source.slice(source.indexOf('function specialVariantName('),source.indexOf('function normalizeSpecialDiscoveries('));
const graphics=source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'));
function api(art=engine,browser=true){
 const context=vm.createContext({});if(browser)context.window=context;
 vm.runInContext((browser?fish:'')+'\n'+art+'\n'+data+'\n'+graphics+'\nglobalThis.testAPI={SPECIES,getSpriteMarkup};',context);
 return {context,...context.testAPI};
}
const {renderHerp,classifyHerp}=require('../www/js/herp-art-v3192.js');
const current=api(),previous=api(oldEngine,true),fallback=api('',true);
const refs=vm.runInNewContext(fs.readFileSync('www/js/lab/herp-specimens-v3192b.js','utf8')+'\nATLAS_HERP_LAB_SPECIMENS');
const catalog=Object.entries(current.SPECIES).filter(([,sp])=>classifyHerp(sp));
const geometry=svg=>[...svg.replace(/<g data-herp-aura="true"[^>]*>[\s\S]*?<\/g>/g,'').matchAll(/(?:d|cx|cy|r|rx|ry)="([^"]+)"/g)].map(x=>x[0]).join('|');

test('3.19.2b routes the 45 catalog herps and all 23 visual families without mutating specimens',()=>{
 assert.equal(catalog.length,45);
 assert.equal(new Set(refs.map(classifyHerp)).size,23);
 for(const sp of refs){
  const snapshot=JSON.stringify(sp);Object.freeze(sp);
  const family=classifyHerp(sp);
  assert.ok(family,sp.name);
  assert.equal(classifyHerp({name:sp.name}),family,'common name: '+sp.name);
  assert.equal(classifyHerp({latin:sp.latin}),family,'scientific name: '+sp.latin);
  assert.match(renderHerp(sp),/data-herp-version="3.19.2b"/);
  assert.equal(JSON.stringify(sp),snapshot);
 }
});

test('whole-word matching restores shrews and the Iberian hare; toad-headed lizard stays a lizard',()=>{
 for(const latin of ['Sorex araneus','Sorex minutus','Suncus murinus','Lepus granatensis']){
  const [id,sp]=Object.entries(current.SPECIES).find(([,s])=>s.latin===latin);
  assert.equal(classifyHerp(sp),null,sp.name);
  assert.equal(current.getSpriteMarkup(id),fallback.getSpriteMarkup(id),sp.name);
 }
 assert.equal(classifyHerp({name:'Lagarto cabeza de sapo',latin:'Phrynocephalus versicolor',kind:'lizard'}),'lizard');
 assert.equal(classifyHerp({name:'Pez cabeza de serpiente',latin:'Channa argus',kind:'fish'}),null);
});

test('all catalog herps reach the production sprite router in Node and browser contexts',()=>{
 const browser=api(engine,true),node=api(engine,false);
 for(const [id,sp] of catalog){
  for(const skin of ['normal','albino','melanico','alfa']){
   const svg=node.getSpriteMarkup(id,skin);
   assert.match(svg,/data-herp-version="3.19.2b"/,sp.name+' '+skin);
   assert.equal(browser.getSpriteMarkup(id,skin),svg,sp.name);
   assert.doesNotMatch(svg,/undefined|NaN|Infinity|\bnull\b/);
   assert.ok(svg.length<13000,sp.name+' SVG byte budget');
  }
 }
 // Loading the production renderer without a browser global must be safe.
 assert.equal(vm.runInNewContext(engine+'\ntypeof ATLAS_HERP_ART_V3192'),'function');
});

test('non-herp fish, birds and mammals keep their existing production SVGs',()=>{
 let checked=0;
 const restored=new Set(['Sorex araneus','Sorex minutus','Suncus murinus','Lepus granatensis']);
 for(const [id,sp] of Object.entries(current.SPECIES)){
  if(classifyHerp(sp)||restored.has(sp.latin))continue;
  for(const skin of ['normal','albino','melanico','alfa'])assert.equal(current.getSpriteMarkup(id,skin),previous.getSpriteMarkup(id,skin),id+' '+skin);
  checked++;
 }
 assert.ok(checked>100);
});

test('refined anatomical paths differ from 3.19.2 while every color variant preserves geometry',()=>{
 const before=require('../www/js/lab/herp-art-v3192-before.js').renderHerp;
 for(const sp of refs){
  const normal=renderHerp(sp,sp.color,'normal');
  assert.notEqual(geometry(normal),geometry(before(sp,sp.color,'normal')),sp.name);
  for(const skin of ['albino','melanico','alfa']){
   const color=skin==='albino'?'#f2f3f4':skin==='melanico'?'#0c0f12':sp.color;
   const svg=renderHerp(sp,color,skin);
   assert.equal(geometry(svg),geometry(normal),sp.name+' '+skin);
   if(skin!=='alfa')assert.doesNotMatch(svg,/#dab850|#bd8267|#b76859|#cfa66f/i,sp.name+' variant accents');
  }
 }
});

test('family silhouettes and requested species morphologies have distinct contour geometry',()=>{
 const contours=svg=>svg.replace(/<g data-herp-detail="true">[\s\S]*?<\/g>/g,'').match(/<path d="[^"]+"/g).join('|');
 const representatives=[...new Set(refs.map(classifyHerp))].map(f=>refs.find(sp=>classifyHerp(sp)===f));
 assert.equal(new Set(representatives.map(sp=>contours(renderHerp(sp)))).size,23);
 for(const names of [['Rana bermeja','Rana goliat','Rana de uñas africana'],['Sapo corredor','Rana de lluvia del desierto'],['Cobra india','Cobra real'],['Dragón de Komodo','Varano de Bengala'],['Camaleón de Jackson','Camaleón de Parson','Camaleón pantera']]){
  const paths=names.map(name=>contours(renderHerp(refs.find(sp=>sp.name===name))));
  assert.equal(new Set(paths).size,names.length,names.join(', '));
 }
});

test('standalone laboratory catalog is reproducible and offline assets exist',()=>{
 execFileSync(process.execPath,['scripts/herp-lab-specimens.cjs','--check']);
 const sw=fs.readFileSync('www/sw.js','utf8');assert.match(sw,/gran-atlas-v3\.23\.0-/);assert.match(sw,/url.search=''/);
 for(const path of ['./js/lab/herp-art-v3192-before.js','./js/lab/herp-specimens-v3192b.js']){
  assert.ok(sw.includes("'"+path+"'"));assert.ok(fs.existsSync('www/'+path));
 }
 const index=fs.readFileSync('www/index.html','utf8');
 assert.ok(!index.includes('herp-art-v3192-before'),'old engine only belongs to the lab');
 assert.ok(index.indexOf('js/herp-art-v3192.js')<index.indexOf('js/app.js'));
});
