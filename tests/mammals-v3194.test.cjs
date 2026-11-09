const {normalizedRecord}=require('./helpers/variant-labels.cjs');
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const {catalogSource,catalog}=require('./helpers/catalog.cjs');
const engine=fs.readFileSync('www/js/mammal-art-v3194.js','utf8'),source=fs.readFileSync('www/js/app.js','utf8');
const bird=fs.readFileSync('www/js/bird-art-v3193.js','utf8'),herp=fs.readFileSync('www/js/herp-art-v3192.js','utf8');
const graphics=source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'));
const {classifyMammal,renderMammal,MAMMAL_FAMILIES}=require('../www/js/mammal-art-v3194.js');
const {classifyBird}=require('../www/js/bird-art-v3193.js'),{classifyHerp}=require('../www/js/herp-art-v3192.js');
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
function api(art=engine,browser=false){const ctx=vm.createContext({});if(browser)ctx.window=ctx;vm.runInContext(bird+'\n'+herp+'\n'+art+'\n'+catalogSource(source)+'\n'+graphics+'\nglobalThis.testAPI={SPECIES,SEXUAL_DIMORPHISM,getSpriteMarkup,sexSpriteMarkup,spriteFor};',ctx);return ctx.testAPI;}
const current=api(),fallback=api(''),browser=api(engine,true);
const bc=vm.createContext({});vm.runInContext(engine+'\n'+fs.readFileSync('www/js/lab/dimorphism-production.js','utf8')+'\n'+fs.readFileSync('www/js/lab/mammal-sprites-v3193-before.js','utf8'),bc);const lab=bc.ATLAS_MAMMAL_LAB;
// Independent inventory from every effective record, not the historical kind labels.
const mammals=Object.entries(current.SPECIES).filter(([,sp])=>!classifyBird(sp)&&!classifyHerp(sp)&&!['fish','ray'].includes(sp.kind));
const geom=svg=>[...svg.replace(/ data-specimen-category="[^"]*"/g,'').replace(/<g data-specimen-halo="[^"]*"[\s\S]*?<\/g>/g,'').replace(/<defs>[\s\S]*?<\/defs>/g,'').replace(/<g data-mammal-aura="true">[\s\S]*?<\/g>/g,'').matchAll(/\b(?:d|cx|cy|r|rx|ry|transform)="([^"]+)"/g)].map(x=>x[0]).join('|');
const contour=svg=>{let hidden=0;return geom(svg.replace(/<[^>]+>|[^<]+/g,token=>{
 if(hidden){if(/^<g\b/.test(token))hidden++;else if(token.startsWith('</g'))hidden--;return '';}
 if(/^<g\b[^>]*data-mammal-detail="true"/.test(token)){hidden=1;return '';}
 return token;
}));};
const skins=['normal','albino','melanico','alfa'];

test('3.19.4 inventories all 269 mammals in the effective 487-species catalog',()=>{
 assert.equal(Object.keys(current.SPECIES).length,487);assert.equal(mammals.length,269);assert.equal(Object.keys(MAMMAL_FAMILIES).length,68);
 assert.equal(new Set(mammals.map(([id,sp])=>classifyMammal(sp,id))).size,68);
 assert.deepEqual(mammals.map(([id])=>id),Object.keys(lab.SPECIES));
 for(const [id,sp] of mammals){assert.ok(classifyMammal(sp,id),id);assert.equal(JSON.stringify({...sp,dimorphism:lab.SPECIES[id].dimorphism}),JSON.stringify(normalizedRecord(lab.SPECIES[id])),id+' original record');}
});

test('gameplay catalog fields and original 24 IDs survive the dimorphism update',()=>{
 const data=catalog();
 const old=require('./fixtures/catalog-v3194.json');
 for(const [id,sp]of Object.entries(data.SPECIES))assert.deepEqual(JSON.parse(JSON.stringify({...sp,dimorphism:old.SPECIES[id].dimorphism})),normalizedRecord(old.SPECIES[id]));
 for(const id of Object.keys(old.SEXUAL_DIMORPHISM))assert.ok(data.SEXUAL_DIMORPHISM[id],id);
});

test('taxon-first art separates the historical mixed categories and specialized mammals',()=>{
 const cases=[['Panthera tigris','felid'],['Crocuta crocuta','hyena'],['Hyaena hyaena','hyena'],['Tapirus indicus','tapir'],['Melursus ursinus','bear'],['Helarctos malayanus','bear'],['Civettictis civetta','viverrid'],['Cryptoprocta ferox','fossa'],['Arctocephalus pusillus','pinniped'],['Dugong dugon','sirenian'],['Sousa plumbea','cetacean'],['Pongo pygmaeus','ape'],['Ailurus fulgens','red-panda'],['Galemys pyrenaicus','desman'],['Saiga tatarica','gazelle'],['Equus przewalskii','equid']];
 for(const [latin,family] of cases){const [,sp]=mammals.find(([,s])=>s.latin===latin);assert.equal(classifyMammal(sp),family,latin);assert.equal(classifyMammal({...sp,kind:'small'}),family,latin+' wrong legacy kind');}
 for(const sp of [
  {name:'Cálao rinoceronte',latin:'Buceros rhinoceros',kind:'rhino'},
  {name:'Salamandra alpina',latin:'Salamandra atra',kind:'mustelid'},
  {name:'Pico picapinos',latin:'Dendrocopos major',kind:'small'},
  {name:'Pez cabeza de serpiente',latin:'Channa argus',kind:'fish'},
  {name:'Rana de uñas africana',latin:'Xenopus laevis',kind:'small'},
  {name:'Tortuga',latin:'Testudo hermanni',kind:'cat'}
 ]){assert.equal(classifyMammal(sp),null,sp.name);assert.equal(renderMammal(sp),null,sp.name);}
 assert.equal(classifyMammal({name:'Cálao rinoceronte',kind:'rhino'}),null);
 assert.equal(classifyMammal({name:'Salamandra alpina',kind:'mustelid'}),null);
});

test('every mammal renders deterministically through the actual Node and browser sprite routers',()=>{
 for(const [id,sp] of mammals)for(const skin of skins){const svg=current.getSpriteMarkup(id,skin);
  assert.match(svg,/^<svg viewBox="0 0 100 100" aria-hidden="true" data-mammal-family=/);assert.match(svg,/data-mammal-version="3.19.4"/);assert.ok(svg.endsWith('</svg>'));assert.match(svg,/<path d="M/);
  assert.doesNotMatch(svg,/NaN|undefined|Infinity|<script|<foreignObject|<filter/);assert.ok(svg.length<18000,id+' light SVG');
  assert.equal(svg,current.getSpriteMarkup(id,skin));assert.equal(svg,browser.getSpriteMarkup(id,skin));assert.equal(svg,lab.after(id,skin),id+' production/laboratory parity');
 }
});

test('all 218 non-mammals retain exactly their previous sprites, skins and configured sexes',()=>{
 const ids=new Set(mammals.map(([id])=>id));let count=0;
 for(const [id,sp] of Object.entries(current.SPECIES))if(!ids.has(id)){count++;assert.equal(classifyMammal(sp,id),null,id);
  for(const skin of skins)assert.equal(current.getSpriteMarkup(id,skin),fallback.getSpriteMarkup(id,skin),id+' '+skin);
  if(current.SEXUAL_DIMORPHISM[id])for(const sex of ['male','female'])assert.equal(current.getSpriteMarkup(id,'normal',sex),fallback.getSpriteMarkup(id,'normal',sex),id+' '+sex);
 }assert.equal(count,218);
 for(const [path,sha] of [
 ['www/js/bird-art-v3193.js','9475c214345fae86005eb18c1898ac201d31419d9b8d3948f2c43517581f1ef8'],
 ['www/js/herp-art-v3192.js','a9d56f4e8d25fa00193e8fd0ffa63e310b1d0dfc6b0af135120c66fa2ff5b377'],
 ['www/js/item-art-v3198.js','db3a8bc3e0aa6407ef5f453a92aef5c24fef80abb68d753e669e2ea427b6cf82']
 ])assert.equal(digest(fs.readFileSync(path)),sha,path+' untouched');
});

test('68 anatomical families and requested similar species have distinct contours',()=>{
 const representatives=Object.keys(MAMMAL_FAMILIES).map(f=>mammals.find(([id,sp])=>classifyMammal(sp,id)===f));
 assert.equal(new Set(representatives.map(([id])=>contour(current.getSpriteMarkup(id)))).size,68);
 assert.equal(new Set(mammals.map(([id])=>contour(current.getSpriteMarkup(id)))).size,269,'all outer geometries differ without coat or color');
 for(const group of [
 ['lobo_gris','zorro_rojo','af_fenec','zorro_artico','af_licaon','asia_esp_0363'],
 ['asia_esp_0402','af_leopardo','af_leon','af_guepardo','asia_esp_0403','lince_iberico','asia_esp_0387'],
 ['liebre_europea','conejo_europeo'],['alce','ciervo_rojo','reno','corzo_europeo'],
 ['bisonte_europeo','af_bufalo_cafre','asia_esp_0062','asia_esp_0821','na_esp_ovibos_moschatus'],
 ['nutria_europea','asia_esp_0177','af_lobo_marino_cabo','af_dugongo','af_delfin_jorobado_indico'],
 ['asia_esp_0184','asia_esp_0498'],['af_rinoceronte_blanco','af_xlsx_rinoceronte_negro','asia_esp_0465','asia_esp_0165'],
 ['af_gorila_occidental','af_chimpance','af_xlsx_bonobo','asia_esp_0436'],
 ['af_lemur_colaanillada','af_sifaka','af_indri','af_xlsx_ayeaye','asia_esp_0860','af_galago','asia_esp_0858'],
 ['af_elefante_sabana','af_elefante_bosque','asia_esp_0176']
 ])assert.equal(new Set(group.map(id=>contour(current.getSpriteMarkup(id)))).size,group.length,group.join(', '));
});

test('normal, pale, melanic and notable skins preserve mammal anatomy and apply all paints',()=>{
 for(const [id,sp] of mammals){const normal=current.getSpriteMarkup(id);
  for(const skin of skins.slice(1)){const svg=current.getSpriteMarkup(id,skin);assert.equal(geom(svg),geom(normal),id+' '+skin+' anatomy');assert.notEqual(svg,normal);
   if(skin==='melanico')for(const tag of svg.match(/<[^>]+>/g)){
    const eye=tag.startsWith('<circle ')&&/fill="#c3ac71"/.test(tag);
    for(const [,hex] of tag.matchAll(/(?:fill|stroke)="(#[\da-f]{6})"/g)){if(eye&&hex==='#c3ac71')continue;const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));assert.ok(Math.max(...rgb)-Math.min(...rgb)<=30&&Math.max(...rgb)<=156,id+' fixed colored accent '+hex);}
   }
  }
  const snapshot=JSON.stringify(sp);renderMammal(Object.freeze(sp),sp.color);assert.equal(JSON.stringify(sp),snapshot);
 }
});

test('the same 12 mammal sex configurations preserve both sexes and variant priority',()=>{
 const configured=mammals.filter(([id])=>lab.SEXUAL_DIMORPHISM[id]);assert.equal(configured.length,12);assert.deepEqual(configured.map(([id])=>id).sort(),Object.keys(lab.SEXUAL_DIMORPHISM).sort());
 for(const [id] of configured){const male=current.getSpriteMarkup(id,'normal','male'),female=current.getSpriteMarkup(id,'normal','female');assert.notEqual(male,female,id);
  for(const sex of ['male','female']){const svg=current.getSpriteMarkup(id,'normal',sex);assert.match(svg,/data-mammal-version="3.19.4"/);assert.equal(svg,lab.after(id,'normal',sex));
   for(const skin of skins.slice(1))assert.equal(current.getSpriteMarkup(id,skin,sex),current.getSpriteMarkup(id,skin),id+' unchanged special/sex priority');
  }
 }
 assert.equal(classifyMammal(current.SPECIES.asia_esp_0344),'deer');assert.doesNotMatch(renderMammal(current.SPECIES.asia_esp_0344),/M74 28L69 13/,'musk deer never receives generic antlers');
});

test('every existing mammal receives actual new anatomical paths rather than a repaint',()=>{
 for(const [id] of mammals)assert.notEqual(contour(current.getSpriteMarkup(id)),contour(lab.before(id)),id+' refined anatomy');
});

test('the game, current labs and offline cache include the new art in the existing architecture',()=>{
 const html=fs.readFileSync('www/index.html','utf8'),sw=fs.readFileSync('www/sw.js','utf8');
 assert.ok(html.indexOf('js/mammal-art-v3194.js')<html.indexOf('js/app.js'));assert.match(sw,/gran-atlas-v3.27.0-museum/);
 const assets=vm.runInNewContext(sw.slice(0,sw.indexOf('self.addEventListener'))+'\nASSETS');
 for(const path of assets)assert.ok(fs.existsSync('www/'+path.replace(/^\.\//,'')),path);
 for(const path of ['laboratorio-mamiferos.html','js/mammal-art-v3194.js','js/lab/mammal-lab-v3194.js'])assert.ok(assets.includes('./'+path));
 for(const path of ['laboratorio-aves.html','laboratorio-herpetologia.html','laboratorio-peces.html'])assert.ok(assets.includes('./'+path));
 const labSource=fs.readFileSync('www/laboratorio-mamiferos.html','utf8');assert.ok(!labSource.includes('src="js/app.js'));for(const n of [56,80,120])assert.ok(labSource.includes('value="'+n+'"'));assert.ok(labSource.includes('id="similar"'));
 require('node:child_process').execFileSync(process.execPath,['scripts/mammal-inventory.cjs','--check']);
 assert.equal(JSON.parse(fs.readFileSync('package.json')).version,'3.27.0');assert.equal(JSON.parse(fs.readFileSync('capacitor.config.json')).appId,'com.elgranatlas.naturaleza.beta314');
});
