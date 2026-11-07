'use strict';
// Run against a disposable local server/profile; no real player save is used.
// ATLAS_PLAYWRIGHT can point to an existing Playwright/Core installation.
const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require(process.env.ATLAS_PLAYWRIGHT||'playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ATLAS_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 const origin=process.env.ATLAS_TEST_URL||'http://localhost:8765',artifact=process.env.ATLAS_ARTIFACT_DIR||'/tmp/atlas-v3196';fs.mkdirSync(artifact,{recursive:true});
 const errors=[];
 try{
 const context=await browser.newContext({viewport:{width:1450,height:1100}}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/laboratorio-pigmentacion.html');await page.waitForSelector('.card');assert.equal(await page.locator('.card').count(),426);
 assert.match(await page.locator('#counts').innerText(),/Albino: 251.*Melánico: 256/);
 const before=await page.evaluate(()=>JSON.stringify(localStorage));
 const inventory=await page.evaluate(()=>{
  const api=ATLAS_DIMORPHISM_LAB,result={svg:0,geometry:0,configured:0};
  const geometry=node=>{const copy=node.cloneNode(true);copy.removeAttribute('data-pigmentation');for(const el of [copy,...copy.querySelectorAll('*')])for(const attr of ['fill','stroke','color','stop-color'])el.removeAttribute(attr);return copy.outerHTML;};
  for(const [id,sp] of Object.entries(api.SPECIES)){
   const variants=['normal','albino','melanico'].map(skin=>new DOMParser().parseFromString(api.getSpriteMarkup(id,skin),'image/svg+xml'));
   for(const doc of variants){if(doc.querySelector('parsererror'))throw Error('Invalid XML '+id);if(doc.documentElement.getAttribute('viewBox')!=='0 0 100 100')throw Error('Viewport '+id);result.svg++;}
   for(const doc of variants.slice(1)){if(geometry(doc.documentElement)!==geometry(variants[0].documentElement))throw Error('Geometry '+id);result.geometry++;}
   result.configured+=sp.special.filter(v=>v==='Albino'||v==='Melánico').length;
  }
  return result;
 });assert.deepEqual(inventory,{svg:1461,geometry:974,configured:507});
 for(const size of ['56','80','120']){await page.selectOption('#size',size);assert.equal(await page.locator('.pair svg').first().evaluate(e=>e.getBoundingClientRect().width),Number(size));}
 for(const group of ['Mamíferos','Aves','Reptiles y anfibios','Peces']){await page.selectOption('#group',group);assert.equal(await page.locator('#gallery h2').count(),1);assert.ok(await page.locator('.card').count()>0);}
 await page.selectOption('#group','all');await page.selectOption('#variant','Albino');assert.equal(await page.locator('.card').count(),251);await page.selectOption('#variant','Melánico');assert.equal(await page.locator('.card').count(),256);
 await page.selectOption('#variant','all');await page.fill('#search','Panthera pardus');assert.equal(await page.locator('.card').count(),2);await page.fill('#search','');
 await page.check('#technical');assert.equal(await page.locator('.card').count(),487);assert.ok((await page.locator('small').allTextContents()).includes('Técnica · no coleccionable'));await page.uncheck('#technical');
 await page.selectOption('#view','silhouette');assert.equal(await page.locator('body.silhouette').count(),1);await page.selectOption('#view','color');await page.selectOption('#size','56');
 const priorities=['Vulpes vulpes','Erinaceus europaeus','Rangifer tarandus','Lynx lynx','Panthera tigris','Panthera pardus pardus','Pavo cristatus','Bubo bubo','Buceros rhinoceros','Naja naja','Testudo hermanni','Acipenser baerii'];
 async function plate(background){await page.selectOption('#background',background);await page.evaluate(names=>{for(const card of document.querySelectorAll('.card'))if(!names.includes(card.querySelector('.latin').textContent))card.remove();for(const h of document.querySelectorAll('#gallery h2'))h.remove();},priorities);await page.screenshot({path:artifact+'/control-56-'+background+'.png',fullPage:true});}
 await plate('light');await plate('dark');assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),before);
 await page.setViewportSize({width:390,height:844});await page.reload();await page.fill('#search','Vulpes vulpes');await page.screenshot({path:artifact+'/movil-56.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 // Historical lab AFTER columns also use the current production router.
 for(const lab of ['aves','mamiferos','dimorfismo','herpetologia','peces']){await page.goto(origin+'/laboratorio-'+lab+'.html');assert.ok(await page.locator('svg').count()>0,lab);}
 await context.close();
 const gameContext=await browser.newContext({serviceWorkers:'block',viewport:{width:1450,height:1000}}),game=await gameContext.newPage();game.on('pageerror',e=>errors.push(e.message));
 await game.route('**/js/app.js*',async route=>{const response=await route.fetch();const body=(await response.text()).replace(/\n\}\)\(\);\s*$/,'\nglobalThis.__PIGMENTATION_TEST__={get state(){return state},SPECIES,SEXUAL_DIMORPHISM,getSpriteMarkup,specialBadges,renderSexComparison,persist};\n})();');await route.fulfill({response,body});});
 await game.goto(origin+'/index.html');await game.waitForFunction(()=>!!globalThis.__PIGMENTATION_TEST__);
 const backup=await game.evaluate(()=>{const s=JSON.parse(localStorage.getItem('gran_atlas_v05'));Object.assign(s,{money:4465,knowledge:390,prestige:4,helpers:0,specialFound:{zorro_rojo:{'Leucístico':true,Albino:false,'Melánico':true}},specialSeen:{zorro_rojo:17},sexSeen:{reno:{male:true}},log:['espécimen especial: Leucístico']});s.discovered.zorro_rojo=true;return s;});
 await game.locator('#saveManagerOpen').evaluate(e=>e.click());await game.locator('.save-paste-fallback summary').click();await game.locator('#savePasteJson').fill(JSON.stringify({format:'el-gran-atlas-save',formatVersion:1,game:backup}));await game.locator('#savePasteBtn').click();
 game.on('dialog',d=>d.accept());await game.locator('#saveImportBtn').click();await game.waitForFunction(()=>document.getElementById('saveManagerStatus').textContent.includes('Restauración confirmada'),null,{timeout:15000});
 const result=await game.evaluate(()=>{const a=__PIGMENTATION_TEST__;a.persist();return {found:a.state.specialFound.zorro_rojo,seen:a.state.specialSeen.zorro_rojo,money:a.state.money,sex:a.state.sexSeen.reno,cards:a.specialBadges('zorro_rojo')};});assert.deepEqual(result.found,{Albino:true,'Melánico':true});assert.equal(result.seen,17);assert.equal(result.money,4465);assert.deepEqual(result.sex,{male:true});assert.doesNotMatch(result.cards,/Leucíst/);assert.equal((result.cards.match(/>Albino</g)||[]).length,1);
 await game.locator('#saveManagerClose').click();
 for(const tab of ['field','bestiary','journal','museum','objects','research','expeditions']){
  const selector='.tab[data-tab="'+tab+'"]';assert.ok(await game.locator(selector).count(),tab);await game.locator(selector).first().evaluate(e=>e.click());assert.ok((await game.locator('#panel').innerHTML()).length>100,tab);
 }
 await game.reload();await game.waitForFunction(()=>!!globalThis.__PIGMENTATION_TEST__);assert.equal(await game.evaluate(()=>__PIGMENTATION_TEST__.state.specialSeen.zorro_rojo),17);
 await gameContext.close();
 // Genuine service-worker install, imported legacy save boot and offline reload.
 const offlineContext=await browser.newContext(),offline=await offlineContext.newPage();offline.on('pageerror',e=>errors.push(e.message));await offline.goto(origin+'/index.html');await offline.evaluate(async()=>{await navigator.serviceWorker.ready;});await offline.reload();await offline.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await offline.evaluate(s=>localStorage.setItem('gran_atlas_v05',JSON.stringify(s)),backup);await offlineContext.setOffline(true);await offline.reload();await offline.waitForFunction(()=>document.getElementById('panel').children.length>0);
 const saved=await offline.evaluate(()=>JSON.parse(localStorage.getItem('gran_atlas_v05')));assert.deepEqual(saved.specialFound.zorro_rojo,{Albino:true,'Melánico':true});assert.equal(saved.specialSeen.zorro_rojo,17);
 await offline.goto(origin+'/laboratorio-pigmentacion.html');await offline.waitForSelector('.card');assert.equal(await offline.locator('.card').count(),426);assert.match(await offline.title(),/v3.19.6/);await offlineContext.close();
 assert.deepEqual(errors,[]);
 const report={version:'3.19.6',...inventory,controls:'56/80/120; backgrounds; silhouettes; groups; variants; search; technical previews',migration:'active JSON import, confirmation tick, reload and real offline boot passed',regression:'field, bestiary, journal, museum, inventory, research, expeditions and historical labs passed',jsErrors:errors,artifacts:artifact};fs.writeFileSync(artifact+'/browser-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
