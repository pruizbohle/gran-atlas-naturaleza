const {normalizedRecord}=require('./helpers/variant-labels.cjs');
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const engine=fs.readFileSync('www/js/bird-art-v3193.js','utf8');
const source=fs.readFileSync('www/js/app.js','utf8');
const data=require('./helpers/catalog.cjs').catalogSource(source);
const graphics=source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'));
const {renderBird,classifyBird,BIRD_FAMILIES}=require('../www/js/bird-art-v3193.js');
function api(art=engine,browser=false){const context=vm.createContext({});if(browser)context.window=context;
 vm.runInContext(art+'\n'+data+'\n'+graphics+'\nglobalThis.api={SPECIES,SEXUAL_DIMORPHISM,getSpriteMarkup,sexSpriteMarkup,spriteFor};',context);return context.api;}
const current=api(),fallback=api(''),browser=api(engine,true);
const baselineContext=vm.createContext({});vm.runInContext(engine+'\n'+fs.readFileSync('www/js/lab/dimorphism-production.js','utf8')+'\n'+fs.readFileSync('www/js/lab/bird-sprites-v3192b-before.js','utf8'),baselineContext);
const baseline=baselineContext.ATLAS_BIRD_LAB_BASELINE;
// Inventory independently anchored in historical categories plus both misplaced bird records.
const birdKinds=new Set(['stork','forestbird','songbird','raptor','seabird','owl','wader','pelican','heron','swan','kingfisher','ostrich']);
const birds=Object.entries(current.SPECIES).filter(([id,sp])=>birdKinds.has(sp.kind)||['asia_esp_0067','eu_esp_0159'].includes(id));
const skins=['normal','albino','melanico','alfa'];
const geom=svg=>[...svg.replace(/ data-specimen-category="[^"]*"/g,'').replace(/<g data-specimen-halo="[^"]*"[\s\S]*?<\/g>/g,'').replace(/<g data-bird-aura="true">[\s\S]*?<\/g>/g,'').matchAll(/(?:d|cx|cy|r|rx|ry|transform)="([^"]+)"/g)].map(x=>x[0]).join('|');
const contour=svg=>geom(svg.replace(/<g data-bird-detail="true">[\s\S]*?<\/g>/g,''));

test('3.19.3 inventories all 136 birds, 136 taxa and 58 occupied visual families',()=>{
 assert.equal(birds.length,136);assert.equal(new Set(birds.map(([,s])=>s.latin)).size,136);
 assert.equal(new Set(birds.map(([,s])=>classifyBird(s))).size,58);
 assert.equal(Object.keys(BIRD_FAMILIES).length,58);
 assert.deepEqual(birds.map(([id])=>id),Object.keys(baseline.SPECIES));
 for(const [id,sp] of birds){assert.equal(JSON.stringify({...sp,dimorphism:baseline.SPECIES[id].dimorphism}),JSON.stringify(normalizedRecord(baseline.SPECIES[id])),id+' persisted data');assert.ok(classifyBird(sp),id);}
});

test('taxa route before legacy kinds, including rhino, forestbird and raptor mistakes',()=>{
 for(const [latin,family] of [['Dendrocopos major','woodpecker'],['Buceros rhinoceros','hornbill'],['Falco peregrinus','falcon'],['Pandion haliaetus','osprey'],['Morus capensis','gannet'],['Haematopus moquini','oystercatcher'],['Aquila chrysaetos','eagle'],['Tyto alba','barn-owl'],['Athene noctua','little-owl'],['Lyrurus tetrix','grouse'],['Aix galericulata','duck'],['Gypaetus barbatus','bearded-vulture']]){
  const sp=birds.find(([,s])=>s.latin===latin)[1];assert.equal(classifyBird(sp),family);assert.equal(classifyBird({latin,kind:'rhino'}),family);assert.equal(classifyBird({name:sp.name}),family);
 }
 assert.equal(classifyBird({latin:'Buceros rhinoceros',name:'Rinoceronte',kind:'rhino'}),'hornbill');
 assert.equal(classifyBird({latin:'Ceratotherium simum',name:'Cálao',kind:'forestbird'}),null);
});

test('every production bird and palette is deterministic valid SVG in Node and browser',()=>{
 for(const [id,sp] of birds)for(const skin of skins){
  const svg=current.getSpriteMarkup(id,skin);
  assert.match(svg,/^<svg viewBox="0 0 100 100" aria-hidden="true" data-bird-family="[\w-]+"/);
  assert.match(svg,/data-bird-version="3.19.3"/);assert.ok(svg.endsWith('</svg>'));assert.match(svg,/<path d="M/);
  assert.doesNotMatch(svg,/NaN|undefined|Infinity|<script|<foreignObject/);assert.ok(svg.length<15000,id+' lightweight SVG');
  assert.equal(svg,current.getSpriteMarkup(id,skin));assert.equal(svg,browser.getSpriteMarkup(id,skin));
  assert.equal(svg,baseline.after(id,skin),id+' exact laboratory / game parity');
 }
});

test('every non-bird retains identical sprites, sexes and variants through the production router',()=>{
 const ids=new Set(birds.map(([id])=>id));let count=0;
 for(const [id,sp] of Object.entries(current.SPECIES)){
  if(ids.has(id))continue;count++;assert.equal(classifyBird(sp),null,id);assert.equal(renderBird(sp),null,id);
  for(const skin of skins)assert.equal(current.getSpriteMarkup(id,skin),fallback.getSpriteMarkup(id,skin),id+' '+skin);
  if(current.SEXUAL_DIMORPHISM[id])for(const sex of ['male','female'])assert.equal(current.getSpriteMarkup(id,'normal',sex),fallback.getSpriteMarkup(id,'normal',sex),id+' '+sex);
 }
 assert.equal(count,Object.keys(current.SPECIES).length-136);
});

test('58 families have distinct anatomical contours; key within-family morphologies differ',()=>{
 const representatives=Object.keys(BIRD_FAMILIES).map(f=>birds.find(([,sp])=>classifyBird(sp)===f));
 assert.equal(new Set(representatives.map(([id])=>contour(current.getSpriteMarkup(id)))).size,58);
 for(const group of [
 ['buho_comun','buho_real','na_esp_bubo_scandiacus','eu_esp_0646','eu_esp_0645'],['eu_esp_0631','eu_esp_0630','eu_esp_0629','eu_esp_0639','eu_esp_0636','petirrojo'],
 ['asia_esp_0422','asia_esp_0124','asia_esp_0296','asia_esp_0294','asia_esp_0865','urogallo_comun','asia_esp_0880'],
 ['aguila_real','asia_esp_0234','asia_esp_0883','buitre_leonado','quebrantahuesos','af_secretario'],
 ['eu_esp_0159','na_esp_dryocopus_pileatus'],['na_esp_falco_peregrinus','asia_esp_0887','asia_esp_0203','eu_esp_0204'],
 ['eu_esp_0649','asia_esp_0891','cisne_vulgar','eu_esp_0144','eu_esp_0654'],['asia_esp_0868','asia_esp_0067','asia_esp_0869','af_calao_terrestre','af_calao_trompetero']
 ])assert.equal(new Set(group.map(id=>contour(current.getSpriteMarkup(id)))).size,group.length,group.join(', '));
});

test('all configured variants change paint, preserve anatomy and respect pigmentation',()=>{
 for(const [id,sp] of birds){
  const normal=current.getSpriteMarkup(id);for(const skin of skins.slice(1)){
   const svg=current.getSpriteMarkup(id,skin);assert.equal(geom(svg),geom(normal),id+' '+skin+' anatomy');assert.notEqual(svg,normal);
   if(skin==='melanico')for(const tag of svg.match(/<[^>]+>/g)){
    const eye=tag.startsWith('<circle ')&&/fill="#c3ac71"/.test(tag);
    for(const [,hex] of tag.matchAll(/(?:fill|stroke)="(#[\da-f]{6})"/g)){
     if(eye&&hex==='#c3ac71')continue;const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));assert.ok(Math.max(...rgb)-Math.min(...rgb)<=30&&Math.max(...rgb)<=156,id+' melanic fixed accent '+hex);
    }
   }
  }
  const frozen=JSON.stringify(sp);renderBird(Object.freeze(sp),sp.color);assert.equal(JSON.stringify(sp),frozen);
 }
});

test('the same 12 bird sex configurations use the new engine for both sexes',()=>{
 const configured=birds.filter(([id])=>baseline.SEXUAL_DIMORPHISM[id]);assert.equal(configured.length,12);
 assert.deepEqual(configured.map(([id])=>id).sort(),Object.keys(baseline.SEXUAL_DIMORPHISM).sort());
 for(const [id,sp] of configured){
  assert.equal(JSON.stringify(current.SEXUAL_DIMORPHISM[id]),JSON.stringify(baseline.SEXUAL_DIMORPHISM[id]));
  const male=current.getSpriteMarkup(id,'normal','male'),female=current.getSpriteMarkup(id,'normal','female');assert.notEqual(male,female,id);
  for(const sex of ['male','female']){
   const svg=current.getSpriteMarkup(id,'normal',sex);assert.match(svg,/data-bird-version="3.19.3"/);assert.equal(svg,baseline.after(id,'normal',sex));assert.equal(current.sexSpriteMarkup(id,sex),renderBird(sp,sp.color,'normal',sex));
   for(const skin of skins.slice(1))assert.equal(current.getSpriteMarkup(id,skin,sex),current.getSpriteMarkup(id,skin),id+' existing variant priority');
  }
 }
});

test('shared names stay separate and use taxon-specific anatomy',()=>{
 assert.equal(current.SPECIES.perdiz_nival.latin,'Lagopus muta');assert.equal(current.SPECIES.eu_esp_0267.latin,'Lagopus lagopus');assert.equal(current.SPECIES.eu_esp_0267.name,'Lagópodo común');
 assert.notEqual(contour(current.getSpriteMarkup('perdiz_nival')),contour(current.getSpriteMarkup('eu_esp_0267')));
 const archival=require('./helpers/sprites.cjs').sprites().SPECIES.af_quebrantahuesos;
 assert.equal(current.SPECIES.quebrantahuesos.latin,archival.latin);assert.equal(current.SPECIES.af_quebrantahuesos,undefined);
 assert.equal(renderBird(current.SPECIES.quebrantahuesos),renderBird(archival));
});

test('entrypoint loads the art module first and every offline asset exists',()=>{
 const html=fs.readFileSync('www/index.html','utf8'),sw=fs.readFileSync('www/sw.js','utf8');
 assert.ok(html.indexOf('js/bird-art-v3193.js')<html.indexOf('js/app.js'));
 assert.match(sw,/gran-atlas-v3.22.0-norteamerica/);
 const assets=vm.runInNewContext(sw.slice(0,sw.indexOf("self.addEventListener"))+'\nASSETS');
 for(const asset of assets)assert.ok(fs.existsSync('www/'+asset.replace(/^\.\//,'')),asset);
 for(const path of ['laboratorio-aves.html','js/bird-art-v3193.js','js/lab/bird-lab-v3193.js'])assert.ok(assets.includes('./'+path));
 const lab=fs.readFileSync('www/laboratorio-aves.html','utf8');assert.ok(!lab.includes('src="js/app.js'));for(const n of [56,80,120])assert.ok(lab.includes('value="'+n+'"'));
 assert.equal(JSON.parse(fs.readFileSync('package.json')).version,'3.22.0');assert.equal(JSON.parse(fs.readFileSync('capacitor.config.json')).appId,'com.elgranatlas.naturaleza.beta314');
});
