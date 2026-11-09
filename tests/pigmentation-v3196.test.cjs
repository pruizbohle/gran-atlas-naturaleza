'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const {catalogSource}=require('./helpers/catalog.cjs'),{harness}=require('./helpers/live-game.cjs');
const source=fs.readFileSync('www/js/app.js','utf8'),ctx=vm.createContext({});ctx.window=ctx;
for(const n of ['fish-art-v3191','herp-art-v3192','bird-art-v3193','mammal-art-v3194'])vm.runInContext(fs.readFileSync('www/js/'+n+'.js','utf8'),ctx);
vm.runInContext(catalogSource(source)+'\n'+source.slice(source.indexOf('function sexSpriteMarkup('),source.indexOf('// initial unlock checks and migration'))+'\nglobalThis.api={SPECIES,SEXUAL_DIMORPHISM,getSpriteMarkup,enforcePaleColors,enforceMelanicColors,configuredSpecials,specialVariantName,normalizeSpecialDiscoveries};',ctx);
const api=ctx.api,KEY='gran_atlas_v05',clone=x=>JSON.parse(JSON.stringify(x));
const geom=svg=>svg.replace(/ data-pigmentation="[^"]+"/g,'').replace(/\b(fill|stroke|stop-color|color)="[^"]*"/g,'');
const base={money:4465,knowledge:390,prestige:4,currentRegion:'HX-01-09',discovered:{zorro_rojo:true},sightings:{zorro_rojo:12100},stages:{zorro_rojo:5},published:{zorro_rojo:true},inventory:{berry:3},sexSeen:{reno:{male:true}},dimorphism:{},specialSeen:{zorro_rojo:17},specialFound:{},log:[],helpers:0};
test('canonical labels, catalog inventory and duplicate-free options preserve configured availability',()=>{
 assert.equal(api.specialVariantName('Leucístico'),'Albino');assert.equal(api.specialVariantName('Leucística'),'Albino');assert.equal(api.specialVariantName('Melánica'),'Melánico');
 assert.deepEqual(Array.from(api.configuredSpecials({special:['Leucístico','Albino','Leucística','Melánico','Notable']})),['Albino','Melánico','Notable']);
 const species=Object.values(api.SPECIES);assert.equal(species.filter(sp=>sp.special.includes('Albino')).length,251);assert.equal(species.filter(sp=>sp.special.includes('Melánico')).length,256);
 for(const sp of species){assert.equal(sp.special.length,new Set(sp.special).size);for(const label of sp.special)assert.ok(['Albino','Melánico','Notable'].includes(label));}
 assert.equal(Object.keys(api.SEXUAL_DIMORPHISM).length,32);
});
test('all normal and sexual sprites match their approved geometry baseline',()=>{
 const baseline=require('./fixtures/normal-sprites-v3195.json'),refined=require('./fixtures/normal-sprites-v3199.json');assert.deepEqual(Object.keys(api.SPECIES),Object.keys(baseline));
 for(const [id,sexes]of Object.entries(baseline))for(const [sex,original]of Object.entries(sexes)){const sp=api.SPECIES[id],target=ctx.ATLAS_MAMMAL_ART_V3194.classify(sp,id)||ctx.ATLAS_FISH_ART_V3191.classify(sp),expected=target?refined[id][sex]:original;assert.equal(crypto.createHash('sha256').update(api.getSpriteMarkup(id,'normal',sex==='base'?null:sex)).digest('hex'),expected,id+':'+sex);}
});
test('all variants share full normal geometry, patterns, opacity and clipping, with one cached paint pass',()=>{
 for(const id of Object.keys(api.SPECIES)){
  const normal=api.getSpriteMarkup(id);
  for(const skin of ['albino','melanico']){
   const svg=api.getSpriteMarkup(id,skin);assert.match(svg,/^<svg viewBox="0 0 100 100"/);assert.ok(svg.endsWith('</svg>'));assert.doesNotMatch(svg,/NaN|undefined|Infinity/);
   assert.equal(geom(svg),geom(normal),id+':'+skin);assert.notEqual(svg,normal);
   assert.equal((svg.match(/data-pigmentation=/g)||[]).length,1);assert.equal(svg,api.getSpriteMarkup(id,skin));
   assert.equal(svg,skin==='albino'?api.enforcePaleColors(normal):api.enforceMelanicColors(normal));
   assert.equal(svg,skin==='albino'?api.enforcePaleColors(svg):api.enforceMelanicColors(svg),'idempotent pigment pass');
   for(const sex of ['male','female'])assert.equal(svg,api.getSpriteMarkup(id,skin,sex),'no new sexual collectibles');
  }
 }
});
test('continuous palettes keep rosettes, stripes, soft shadows and structural keratin distinct',()=>{
 for(const id of ['af_leopardo','asia_esp_0402','zorro_rojo','reno','buho_real','asia_esp_0067','asia_esp_0047']){
  if(!api.SPECIES[id])continue;
  for(const skin of ['albino','melanico']){
   const svg=api.getSpriteMarkup(id,skin),colors=new Set([...svg.matchAll(/(?:fill|stroke)="(#[0-9a-f]{6})"/g)].map(m=>m[1]));assert.ok(colors.size>=4,id+' '+skin+' volume');
   assert.ok(!colors.has('#ffffff')&&!colors.has('#000000'));
  }
 }
 const input='<svg viewBox="0 0 100 100"><path fill="none" stroke="transparent" opacity=".3"/><path fill="#ffffff55"/><path fill="rgba(255,0,0,.5)"/><path fill="url(#coat)"/><circle r="1.6" fill="#302e26"/><path fill="#a39881"/></svg>';
 for(const fn of [api.enforcePaleColors,api.enforceMelanicColors]){const out=fn(input);assert.match(out,/fill="none" stroke="transparent" opacity=".3"/);assert.match(out,/#\w{6}55/);assert.match(out,/rgba\([^)]*,\.5\)/);assert.match(out,/url\(#coat\)/);assert.equal(geom(out),geom(input));}
 assert.match(api.enforceMelanicColors(input),/#817967/);assert.match(api.enforcePaleColors(input),/#ad858d/);
});
for(const [label,found,expected]of [
 ['legacy masculine',{'Leucístico':true},{Albino:true}],['legacy feminine',{'Leucística':true},{Albino:true}],
 ['canonical',{Albino:true},{Albino:true}],['both',{Albino:false,'Leucístico':true,Notable:true},{Albino:true,Notable:true}],
 ['dark',{'Melánico':true},{'Melánico':true}],['empty',{},{}],['not discovered',{'Leucístico':false},{Albino:false}]
])test('load, persist and offline-style reboot: '+label,()=>{
 const saved=clone({...base,specialFound:{zorro_rojo:found}}),store={[KEY]:JSON.stringify(saved)},h=harness(store);h.tick();
 assert.deepEqual(h.imported.specialFound.zorro_rojo,expected);assert.deepEqual(h.imported.specialSeen,saved.specialSeen);
 for(const field of ['money','knowledge','prestige','sightings','stages','published','inventory','sexSeen'])assert.deepEqual(h.imported[field],saved[field],field);
 const before=clone(h.imported.specialFound);const reboot=harness(store);reboot.tick();assert.deepEqual(reboot.imported.specialFound,before);assert.deepEqual(reboot.imported.specialSeen,saved.specialSeen);
});
test('old Android backup imports during an active session without re-earning discoveries',async()=>{
 const backup={format:'el-gran-atlas-save',formatVersion:1,game:clone({...base,specialFound:{zorro_rojo:{'Leucístico':true,Albino:false,'Melánico':true}}})};
 const h=harness({},backup);await h.import();h.tick();h.finishTimers();
 assert.deepEqual(h.imported.specialFound.zorro_rojo,{Albino:true,'Melánico':true});assert.equal(h.imported.specialSeen.zorro_rojo,17);assert.equal(h.imported.money,4465);assert.deepEqual(h.imported.sexSeen,base.sexSeen);assert.match(h.elements.saveManagerStatus.textContent,/Restauración confirmada/);
 h.window.AtlasSaveBridge.restoreGame(backup.game);h.tick();assert.equal(h.imported.specialSeen.zorro_rojo,17);assert.deepEqual(backup.game.specialFound.zorro_rojo,{'Leucístico':true,Albino:false,'Melánico':true},'caller backup remains unchanged');
});
test('normalization is idempotent, retains unknown historical keys and canonicalizes encounter/diary text',()=>{
 const snapshot=clone({...base,specialFound:{zorro_rojo:{'Leucístico':true,Albino:false,Notable:true,legacyDetail:true}},log:['espécimen especial: Leucística'],lastEncounter:{title:'Leucístico',subtitle:'Leucística',entries:[{id:'zorro_rojo',variant:'Leucístico'}]}});
 api.normalizeSpecialDiscoveries(snapshot);const once=clone(snapshot);api.normalizeSpecialDiscoveries(snapshot);assert.deepEqual(clone(snapshot),once);assert.equal(snapshot.specialFound.zorro_rojo.legacyDetail,true);assert.doesNotMatch(JSON.stringify(snapshot),/Leucíst/);assert.equal(snapshot.specialSeen.zorro_rojo,17);
});
test('cards collapse historical aliases and display one discovered Albino',()=>{
 const badge=source.slice(source.indexOf('function specialBadges('),source.indexOf('\nfunction ',source.indexOf('function specialBadges(')+1));
 const variant=source.slice(source.indexOf('function variantToSkin('),source.indexOf('function pushLog('));
 const cards=vm.runInNewContext(source.slice(source.indexOf('function specialVariantName('),source.indexOf('Object.values(SPECIES).forEach(sp=>{sp.special='))+variant+badge+'\n;specialBadges("fox")',{SPECIES:{fox:{special:['Leucístico','Albino','Leucística','Melánico']}},state:{specialFound:{fox:{'Leucístico':true}}},getSpriteMarkup:()=>'<svg/>'});
 assert.equal((cards.match(/variant-card/g)||[]).length,2);assert.equal((cards.match(/>Albino(?: · registro histórico)?</g)||[]).length,1);assert.doesNotMatch(cards,/Leucíst/);
});
test('historical pigmentation weights and ethology remain exact in the independent sampler',()=>{
 assert.match(source,/oldRate=\.01\+\(snapshot\.upgrades\?\.ethology>=2\?\.005:0\)/);
 assert.match(source,/cursor\+=oldRate\/sp\.special\.length/);
 assert.match(source,/const specimen=rollSpecimen\(chosen,state\)/);
});
test('lab bundle is reproducible and isolated from game progress; offline resources are complete',()=>{
 const lab=fs.readFileSync('www/js/lab/dimorphism-production.js','utf8'),gallery=fs.readFileSync('www/js/lab/pigmentation-lab-v3196.js','utf8');assert.doesNotMatch(lab+gallery,/localStorage|recordSexObservation|setInterval|state\.specialFound/);
 require('node:child_process').execFileSync(process.execPath,['scripts/build-dimorphism-lab.cjs','--check']);
 const sw=fs.readFileSync('www/sw.js','utf8');assert.match(sw,/gran-atlas-v3\.28\.0-expeditions/);for(const asset of ['laboratorio-pigmentacion.html','js/lab/pigmentation-lab-v3196.js'])assert.ok(sw.includes("'./"+asset+"'"));
});
