'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ATLAS_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 const origin=process.env.ATLAS_TEST_URL||'http://localhost:8765',artifact=process.env.ATLAS_ARTIFACT_DIR||'work/browser-v3197';fs.mkdirSync(artifact,{recursive:true});const errors=[];
 try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},serviceWorkers:'block'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/laboratorio-especiales.html');await page.waitForSelector('.specimen-card');assert.equal(await page.locator('.specimen-card').count(),505);
 const before=await page.evaluate(()=>JSON.stringify(localStorage));
 const svgValidation=await page.evaluate(()=>{
  const a=ATLAS_DIMORPHISM_LAB;let parsed=0;
  for(const [id,cs]of Object.entries(a.SPECIMEN_CATEGORIES))for(const c of cs){const svg=a.getSpriteMarkup(id,a.SPECIMEN_LEVELS[c].skin),doc=new DOMParser().parseFromString(svg,'image/svg+xml');if(doc.querySelector('parsererror'))throw Error('Invalid '+id+' '+c);parsed++;}
  return parsed;
 });assert.equal(svgValidation,505);
 await page.selectOption('#category','Legendario');assert.equal(await page.locator('.specimen-card').count(),12);
 await page.screenshot({path:artifact+'/legendary-120.png',fullPage:true});
 await page.selectOption('#size','56');assert.equal(await page.locator('.pair svg').first().evaluate(e=>e.getBoundingClientRect().width),56);
 await page.screenshot({path:artifact+'/legendary-56.png',fullPage:true});
 await page.uncheck('#halos');assert.equal(await page.locator('#gallery [data-specimen-halo]').count(),0);await page.check('#halos');
 await page.uncheck('#compare');assert.equal(await page.locator('.pair figure').count(),12);await page.check('#compare');
 for(const [group,n]of [['Mamíferos',6],['Aves',1],['Reptiles',4],['Peces',1]]){await page.selectOption('#group',group);assert.equal(await page.locator('.specimen-card').count(),n,group);}
 await page.selectOption('#group','');await page.fill('#search','Fenrir');assert.equal(await page.locator('.specimen-card').count(),1);await page.fill('#search','');
 await page.check('#legendaryOnly');assert.equal(await page.locator('.specimen-card').count(),12);
 await page.fill('#observations','100000');await page.click('#simulate');await page.waitForFunction(()=>!document.querySelector('#simulate').disabled,null,{timeout:60000});assert.match(await page.locator('#result').innerText(),/partida única: 1/);
 assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),before);
 const mobile=await context.newPage({viewport:{width:390,height:844}});await mobile.goto(origin+'/laboratorio-especiales.html');await mobile.selectOption('#category','Legendario');await mobile.screenshot({path:artifact+'/mobile.png',fullPage:true});assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await mobile.close();
 // Test-only exposure; never present in distributed code. Use real browser storage and import UI.
 const game=await context.newPage();game.on('pageerror',e=>errors.push(e.message));
 await game.route('**/js/app.js*',async route=>{
  const response=await route.fetch(),text=await response.text();await route.fulfill({response,body:text.replace(/\n\}\)\(\);\s*$/,'\nwindow.__SPECIAL_TEST__={get state(){return state},recordSpecimen,rollSpecimen,initialState,persist,specialBadges,renderMuseum};\n})();')});
 });
 await game.goto(origin+'/index.html');await game.waitForFunction(()=>!!window.__SPECIAL_TEST__);
 const backup=await game.evaluate(()=>{const a=__SPECIAL_TEST__,s=a.state;a.recordSpecimen('zorro_rojo',{pigment:'Albino',category:'Legendario'},s);a.recordSpecimen('zorro_rojo',{pigment:'',category:'Épico'},s);a.persist();return JSON.parse(JSON.stringify(s));});
 assert.equal(backup.legendaryFound.ascua.id,'ascua');
 await game.locator('#saveManagerOpen').evaluate(e=>e.click());await game.locator('.save-paste-fallback summary').click();await game.locator('#savePasteJson').fill(JSON.stringify({format:'el-gran-atlas-save',formatVersion:1,game:backup}));await game.locator('#savePasteBtn').click();game.on('dialog',d=>d.accept());await game.locator('#saveImportBtn').click();await game.waitForFunction(()=>document.getElementById('saveManagerStatus').textContent.includes('Restauración confirmada'),null,{timeout:15000});
 assert.equal(await game.evaluate(()=>__SPECIAL_TEST__.state.legendaryFound.ascua.id),'ascua');
 await game.locator('#saveManagerClose').click();
 for(const tab of ['field','journal','bestiary','museum','research','objects','expeditions']){
  await game.locator('.tab[data-tab="'+tab+'"]').first().evaluate(e=>e.click());assert.ok((await game.locator('#panel').innerHTML()).length>100);
  if(tab==='museum')assert.match(await game.locator('#panel').innerHTML(),/Ascua — Zorro rojo/);
 }
 await game.reload();await game.waitForFunction(()=>!!window.__SPECIAL_TEST__);assert.equal(await game.evaluate(()=>__SPECIAL_TEST__.state.legendaryFound.ascua.id),'ascua');
 assert.match(await game.evaluate(()=>__SPECIAL_TEST__.specialBadges('zorro_rojo')),/descubierto \(1\/1\)/);
 // Genuine service worker, offline boot and offline laboratory, with no route interception.
 const offlineContext=await browser.newContext(),offline=await offlineContext.newPage();offline.on('pageerror',e=>errors.push(e.message));await offline.goto(origin+'/index.html');await offline.evaluate(()=>navigator.serviceWorker.ready);await offline.reload();await offline.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await offline.evaluate(s=>localStorage.setItem('gran_atlas_v05',JSON.stringify(s)),backup);await offlineContext.setOffline(true);await offline.reload();await offline.waitForFunction(()=>document.getElementById('panel').children.length>0);
 const saved=await offline.evaluate(()=>JSON.parse(localStorage.getItem('gran_atlas_v05')));assert.equal(saved.legendaryFound.ascua.id,'ascua');assert.equal(saved.specialFound.zorro_rojo.Albino,true);
 await offline.locator('.tab[data-tab="museum"]').first().evaluate(e=>e.click());assert.match(await offline.locator('#panel').innerHTML(),/data-legendary-id="ascua"/);
 await offline.goto(origin+'/laboratorio-especiales.html');await offline.waitForSelector('.specimen-card');assert.equal(await offline.locator('.specimen-card').count(),505);await offline.selectOption('#category','Legendario');assert.equal(await offline.locator('[data-legendary-id]').count(),12);
 await offlineContext.close();assert.deepEqual(errors,[]);
 const report={version:'3.19.7',svgValidation,legendaryPlates:12,sizes:[56,120],mobileWidth:390,labIsolation:true,simulation:'100000 observations, one legendary',save:'real JSON import, reload, offline boot, canonical identity',screenshots:['legendary-120.png','legendary-56.png','mobile.png'],jsErrors:errors};
 fs.writeFileSync('docs/v3197/browser-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
