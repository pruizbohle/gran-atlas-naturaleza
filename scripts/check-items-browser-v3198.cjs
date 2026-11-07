'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),{chromium}=require('playwright');
const origin=process.env.ATLAS_TEST_URL||'http://127.0.0.1:8765',out=process.env.ATLAS_ARTIFACT_DIR||'/tmp/atlas-v3198';
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.ATLAS_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/laboratorio-objetos.html');assert.equal(await page.locator('.plate').count(),60);
 const storage=await page.evaluate(()=>JSON.stringify(localStorage));
 const bounds=await page.locator('.drawing svg').evaluateAll(svgs=>svgs.map(svg=>{const xml=new DOMParser().parseFromString(svg.outerHTML,'image/svg+xml');if(xml.querySelector('parsererror'))throw Error(svg.dataset.itemArt);const b=svg.getBBox();return {id:svg.dataset.itemArt,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height};}));
 for(const b of bounds)assert.ok(b.x>=0&&b.y>=0&&b.right<=100&&b.bottom<=100,JSON.stringify(b));
 for(const size of [32,48,64,96]){
  await page.selectOption('#size',String(size));assert.equal(await page.locator('.drawing').first().evaluate(e=>e.getBoundingClientRect().width),size);
  await page.screenshot({path:out+'/plates-'+size+'.png',fullPage:true});
 }
 await page.selectOption('#background','dark');await page.screenshot({path:out+'/dark.png',fullPage:true});await page.check('#silhouette');await page.screenshot({path:out+'/silhouettes.png',fullPage:true});await page.uncheck('#silhouette');
 await page.fill('#search','ámbar');assert.equal(await page.locator('.plate').count(),3);await page.fill('#search','');await page.selectOption('#category','Proyectos del Taller');assert.equal(await page.locator('.plate').count(),8);await page.selectOption('#category','');await page.check('#compare');
 assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),storage);
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:out+'/mobile-lab.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 // Seed an old-format save, then exercise actual delegated UI buttons.
 const {harness}=require('../tests/helpers/live-game.cjs'),store={},game=harness(store),old=game.window.__atlasTest.state;
 for(const id of Object.keys(game.window.__atlasTest.ITEMS))old.inventory[id]=40;
 old.equipment={instrument:'binoculars',hat:'field_hat',necklace:'amber_charm'};game.tick();
 const saved=JSON.parse(store.gran_atlas_v05);await page.goto(origin+'/');await page.evaluate(s=>localStorage.setItem('gran_atlas_v05',JSON.stringify(s)),saved);await page.reload();
 const click=async selector=>page.locator(selector).first().evaluate(e=>e.click());
 await click('.tab[data-tab="objects"]');await page.waitForSelector('.inventory-slot-icon [data-item-art="binoculars"]');
 const inventory=await page.evaluate(()=>JSON.parse(localStorage.getItem('gran_atlas_v05')).inventory);assert.deepEqual(inventory,saved.inventory);
 await page.screenshot({path:out+'/mobile-inventory.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await click('[data-action="equip-item"][data-id="binoculars"]');assert.equal(await page.locator('[data-empty-slot="instrument"]').count(),1);
 await click('[data-action="equip-item"][data-id="binoculars"]');assert.equal(await page.locator('.inventory-slot-icon [data-item-art="binoculars"]').count(),1);
 await click('[data-action="inventory-tab"][data-id="taller"]');await click('[data-action="craft-item"][data-id="field_telescope"]');await click('[data-action="process-materials"][data-id="herbarium:1"]');
 await page.waitForTimeout(1200);
 // Force the app's existing save bridge, without exposing or changing game code.
 const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('gran_atlas_v05')));assert.equal(after.inventory.binoculars,39);assert.equal(after.inventory.field_telescope,41);assert.equal(after.inventory.polished_lens,38);assert.equal(after.inventory.pressed_flower,37);assert.equal(after.inventory.parchment_scrap,37);assert.equal(after.equipment.instrument,'binoculars');
 const snap=await page.evaluate(()=>window.AtlasSaveBridge.getSnapshot());assert.ok(snap);
 for(const view of ['animales','expedicion','coleccionables','taller','equipo']){await click('[data-action="inventory-tab"][data-id="'+view+'"]');assert.ok(await page.locator('.inventory-item [data-item-art]').count());}
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await page.reload();await click('.tab[data-tab="objects"]');assert.ok(await page.locator('[data-item-art]').count());await page.goto(origin+'/laboratorio-objetos.html');await page.waitForSelector('.plate');assert.equal(await page.locator('.plate').count(),60);
 assert.deepEqual(errors,[]);
 const report={version:'3.19.8',plates:60,items:52,studies:8,sizes:[32,48,64,96],svgXmlAndBounds:true,mobileWidth:390,oldInventoryPreserved:true,equipAndCraftButtons:true,offlineGameAndLab:true,labStorageUntouched:true,jsErrors:errors};
 fs.writeFileSync(out+'/browser-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await context.close();
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
