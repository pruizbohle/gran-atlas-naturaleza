'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const normalize=source=>source.slice(source.indexOf('(function(){\nconst STORAGE_KEY=')).replace(source.slice(source.indexOf('function museumCardArt('),source.indexOf('function museumOtherExhibits(')),'[MUSEUM ART]\n').replace(source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration')),'[ZOOLOGICAL ART]\n').replace(' · <a href="./laboratorio-pulido-v3199.html" target="_blank" rel="noopener">Pulido artístico 3.19.9</a>','');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
function api(){const ctx=vm.createContext({});for(const n of ['lab/polish-before-v3198','fish-art-v3191','herp-art-v3192','bird-art-v3193','mammal-art-v3194','legendary-art-v3197','relict-art-v3199','lab/dimorphism-production','lab/polish-production-v3199'])vm.runInContext(fs.readFileSync('www/js/'+n+'.js','utf8'),ctx);return ctx;}
test('3.19.9 leaves every gameplay statement outside graphic renderers intact',()=>{assert.equal(hash(normalize(fs.readFileSync('www/js/app.js','utf8'))),'700c88ab1fc1ef5a42b25ef9c76154dc322304d860acfe6a5dd76168b2ad1e12');});
test('487 species, all original dimorphism and 12 legendary/9 relict identities are unchanged',()=>{
 const c=api(),old=c.ATLAS_POLISH_BEFORE,next=c.ATLAS_POLISH_CURRENT;
 for(const key of ['SPECIES','SEXUAL_DIMORPHISM','LEGENDARY_SPECIMENS','MUSEUM_RELICTS'])assert.deepEqual(JSON.parse(JSON.stringify(next[key])),JSON.parse(JSON.stringify(old[key])),key);
 assert.equal(Object.keys(next.SPECIES).length,487);assert.equal(next.LEGENDARY_SPECIMENS.length,12);assert.equal(next.MUSEUM_RELICTS.length,9);
});
test('birds, herpetofauna and the inventory art remain byte-for-byte protected',()=>{
 for(const [path,digest] of Object.entries({
  'www/js/item-art-v3198.js':'db3a8bc3e0aa6407ef5f453a92aef5c24fef80abb68d753e669e2ea427b6cf82',
  'www/js/bird-art-v3193.js':'9475c214345fae86005eb18c1898ac201d31419d9b8d3948f2c43517581f1ef8',
  'www/js/herp-art-v3192.js':'a9d56f4e8d25fa00193e8fd0ffa63e310b1d0dfc6b0af135120c66fa2ff5b377'
 }))assert.equal(hash(fs.readFileSync(path)),digest,path);
 const c=api();let count=0;for(const [id,sp]of Object.entries(c.ATLAS_POLISH_CURRENT.SPECIES))if(!c.ATLAS_MAMMAL_ART_V3194.classify(sp,id)&&!c.ATLAS_FISH_ART_V3191.classify(sp)){for(const skin of ['normal','albino','melanico','alfa','epico','excepcional'])assert.equal(c.ATLAS_POLISH_CURRENT.getSpriteMarkup(id,skin),c.ATLAS_POLISH_BEFORE.getSpriteMarkup(id,skin),id+' '+skin);count++;}assert.equal(count,200);
});
test('production/laboratory bundles reproduce exactly and all offline files exist',()=>{
 const cp=require('node:child_process');for(const script of ['build-dimorphism-lab','build-polish-lab-v3199','build-polish-review-v3199'])cp.execFileSync(process.execPath,['scripts/'+script+'.cjs','--check']);
 const sw=fs.readFileSync('www/sw.js','utf8'),ctx=vm.createContext({});vm.runInContext(sw.slice(0,sw.indexOf('self.addEventListener'))+'\nassets=ASSETS',ctx);
 for(const asset of ctx.assets)assert.ok(fs.existsSync('www/'+asset.replace(/^\.\//,'')),asset);
 for(const path of ['js/lab/polish-review-v3199.js','laboratorio-pulido-v3199.html','js/relict-art-v3199.js','js/lab/polish-before-v3198.js','js/lab/polish-production-v3199.js','js/lab/polish-lab-v3199.js'])assert.ok(ctx.assets.includes('./'+path),path);
 const html=fs.readFileSync('www/index.html','utf8');for(const engine of ['fish-art-v3191','mammal-art-v3194','legendary-art-v3197','relict-art-v3199'])assert.ok(html.indexOf(engine)<html.indexOf('js/app.js'));
 assert.doesNotMatch(fs.readFileSync('www/js/lab/polish-lab-v3199.js','utf8'),/localStorage|sessionStorage|indexedDB/);
});
test('specialized fossil mounts and historical artifact plates retain their previous drawings',()=>{
 const c=api(),before=c.ATLAS_POLISH_BEFORE,after=c.ATLAS_POLISH_CURRENT;
 for(const id of ['ankylosaurus_mount','iguanodon_mount','huellas_teropodos','sedimentos_estratos','pachycephalosaurus_mount','fosil_catalogado','triceratops_mount','stegosaurus_mount','spinosaurus_mount','astrolabio_laton','diario_explorador','globo_cartografico'])assert.equal(after.museumCardArt('',id),before.museumCardArt('',id),id);
});
