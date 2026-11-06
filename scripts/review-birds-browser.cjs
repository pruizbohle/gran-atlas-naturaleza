// Optional visual review: requires an available Playwright installation and Chromium.
// node scripts/review-birds-browser.cjs [base URL] [output directory]
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs');
const path=require('node:path'),repo=path.resolve(__dirname,'..');
const base=(process.argv[2]||'http://localhost:8765').replace(/\/$/,'');
const output=path.resolve(process.argv[3]||path.join(repo,'work/bird-review'));
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ATLAS_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1500,height:1050}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/laboratorio-aves.html');await page.waitForFunction(()=>document.querySelectorAll('.card').length===136);
 const initialStorage=await page.evaluate(()=>Object.keys(localStorage));assert.equal(initialStorage.length,0);
 const validation=await page.evaluate(()=>{
 const api=ATLAS_BIRD_LAB_BASELINE,host=document.createElement('div');document.body.append(host);let checked=0;const invalid=[];let maxBytes=0;
 for(const id of Object.keys(api.SPECIES))for(const skin of ['normal','albino','melanico','alfa'])for(const size of [56,80,120]){
  const sexes=skin==='normal'&&api.SEXUAL_DIMORPHISM[id]?[null,'male','female']:[null];
  for(const sex of sexes){const markup=api.after(id,skin,sex);maxBytes=Math.max(maxBytes,markup.length);host.innerHTML=markup;const svg=host.firstElementChild;svg.style.width=size+'px';svg.style.height=size+'px';const rect=svg.getBoundingClientRect();
   if(rect.width!==size||rect.height!==size||new DOMParser().parseFromString(svg.outerHTML,'image/svg+xml').querySelector('parsererror'))invalid.push([id,skin,sex,'viewport/XML']);
   for(const p of svg.querySelectorAll('path'))if(!Number.isFinite(p.getTotalLength())||p.getTotalLength()<=0)invalid.push([id,skin,sex,'path']);
   // Include half the stroke width to catch actual clipping, not just centerlines.
   for(const el of svg.querySelectorAll('path,circle')){const b=el.getBBox(),stroke=el.getAttribute('stroke'),pad=stroke&&stroke!=='none'?+(el.getAttribute('stroke-width')||1)/2:0;if(b.x-pad<0||b.y-pad<0||b.x+b.width+pad>100||b.y+b.height+pad>100)invalid.push([id,skin,sex,'bounds',el.outerHTML]);}
   checked++;
  }
 }host.remove();return {checked,invalid,maxBytes};});
 assert.deepEqual(validation.invalid,[]);assert.equal(validation.checked,1704);
 await page.selectOption('#size','120');assert.equal(await page.locator('.figure:not(.before) svg').first().evaluate(el=>el.getBoundingClientRect().width),120);
 await page.selectOption('#sex','female',{force:true});assert.equal(await page.locator('.card').count(),12);
 await page.selectOption('#skin','melanico');assert.equal(await page.locator('#sex').inputValue(),'');assert.ok(await page.locator('#sex').isDisabled());
 const supported=await page.evaluate(()=>Object.values(ATLAS_BIRD_LAB_BASELINE.SPECIES).filter(sp=>sp.special.some(v=>/mel[aá]nic/i.test(v))).length);assert.equal(await page.locator('.card').count(),supported);
 await page.selectOption('#skin','normal');await page.selectOption('#family','woodpecker');assert.equal(await page.locator('.card').count(),2);
 await page.selectOption('#family','');await page.locator('#search').fill('Buceros rhinoceros');assert.equal(await page.locator('.card').count(),1);await page.locator('#search').fill('');
 // Compact proof sheets, rendered by the actual laboratory.
 await page.selectOption('#size','80',{force:true});await page.addStyleTag({content:'.top,.intro,.controls,.status,footer,.group{display:none!important}body{max-width:none}#gallery{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.grid{display:contents}.card{padding:6px}.art{height:86px}.card h3{font-size:13px;margin-top:5px}.variants{display:none}'});
 await page.locator('#gallery').screenshot({path:output+'/aves-136-antes-despues.jpg',type:'jpeg',quality:88});
 await page.selectOption('#size','56',{force:true});await page.locator('#silhouette').evaluate(el=>{el.checked=true;el.dispatchEvent(new Event('change'))});await page.evaluate(()=>{const seen=new Set();for(const card of document.querySelectorAll('.card')){const family=card.querySelector('[data-bird-family]').dataset.birdFamily;if(seen.has(family))card.style.display='none';seen.add(family);}});await page.locator('#gallery').screenshot({path:output+'/aves-58-siluetas-56.jpg',type:'jpeg',quality:88});
 await page.locator('#silhouette').evaluate(el=>{el.checked=false;el.dispatchEvent(new Event('change'))});await page.selectOption('#sex','female',{force:true});await page.selectOption('#size','80',{force:true});await page.locator('#gallery').screenshot({path:output+'/aves-hembras-antes-despues.jpg',type:'jpeg',quality:90});
 await page.selectOption('#sex','male',{force:true});await page.locator('#gallery').screenshot({path:output+'/aves-machos-antes-despues.jpg',type:'jpeg',quality:90});
 assert.equal(await page.evaluate(()=>Object.keys(localStorage).length),0);
 // Boot the actual game in a fresh context. Seed a disposable test save through its supported bridge.
 const game=await context.newPage();game.on('pageerror',e=>errors.push(e.message));await game.goto(base+'/');await game.waitForFunction(()=>!!window.AtlasSaveBridge);
 const ids=await page.evaluate(()=>Object.keys(ATLAS_BIRD_LAB_BASELINE.SPECIES));
 const baselineSpecies=await page.evaluate(()=>ATLAS_BIRD_LAB_BASELINE.SPECIES);
 const auditContext=await browser.newContext({serviceWorkers:'block'}),audit=await auditContext.newPage();
 await audit.route('**/js/app.js*',route=>{const source=fs.readFileSync(repo+'/www/js/app.js','utf8').replace(/\n\}\)\(\);\s*$/, '\nglobalThis.__birdAudit={SPECIES};\n})();');return route.fulfill({contentType:'application/javascript',body:source});});
 await audit.goto(base+'/');await audit.waitForFunction(()=>!!globalThis.__birdAudit);
 const runtime=await audit.evaluate(()=>__birdAudit.SPECIES),expected=require(repo+'/tests/helpers/catalog.cjs').catalog().SPECIES;assert.deepEqual(runtime,JSON.parse(JSON.stringify(expected)));
 for(const [id,sp] of Object.entries(baselineSpecies))assert.deepEqual(runtime[id],sp,id+' complete runtime catalog');await auditContext.close();
 await game.evaluate(ids=>{
  const s=JSON.parse(localStorage.getItem('gran_atlas_v05'));s.money=4465;s.knowledge=390;s.prestige=4;s.upgrades.autoTier=0;s.currentRegion='HX-01-09';s.selectedJournal='petirrojo';s.regionUnlocked['HX-02-09']=true;
  for(const id of ids){s.discovered[id]=true;s.sightings[id]=120;s.stages[id]=5;}
  s.museum.exhibits={petirrojo:true};s.lastEncounter={species:'petirrojo',title:'Petirrojo europeo',subtitle:'Prueba de integración',entries:[{id:'petirrojo',amount:1}]};window.AtlasSaveBridge.restoreGame(s);
 },ids);
 const ui={};for(const tab of ['field','bestiary','journal','museum']){
  await game.locator('.tabs [data-tab="'+tab+'"]').click();await game.waitForTimeout(100);
  ui[tab]=await game.locator('#panel svg[data-bird-version="3.19.3"]').count();assert.ok(ui[tab]>0,tab);
 }
 assert.equal(ui.bestiary,136);
 const before=await game.evaluate(()=>JSON.parse(localStorage.getItem('gran_atlas_v05')));
 await game.reload();await game.waitForFunction(()=>!!window.AtlasSaveBridge);const after=await game.evaluate(()=>JSON.parse(localStorage.getItem('gran_atlas_v05')));
 for(const key of ['discovered','sightings','stages','sexSeen','specialFound','inventory','regionUnlocked','purchases','published'])assert.deepEqual(after[key],before[key],key+' persisted');assert.equal(after.prestige,4);
 // Real SW precache and offline reload of the game and three laboratories.
 await game.evaluate(async()=>{await navigator.serviceWorker.ready;});await game.reload();await game.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await game.reload();await game.waitForFunction(()=>!!window.AtlasSaveBridge);
 for(const lab of ['laboratorio-aves.html','laboratorio-herpetologia.html','laboratorio-peces.html']){await game.goto(base+'/'+lab);if(lab==='laboratorio-aves.html')assert.equal(await game.locator('.card').count(),136);assert.ok(await game.locator('svg').count()>0,lab+' offline');}
 await context.setOffline(false);
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true});const mp=await mobile.newPage();await mp.goto(base+'/');await mp.waitForFunction(()=>!!window.AtlasSaveBridge);assert.ok(await mp.locator('.mobile-dock').isVisible());
 await mp.goto(base+'/laboratorio-aves.html');assert.equal(await mp.locator('.card').count(),136);assert.equal(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await mobile.close();
 assert.deepEqual(errors,[]);const result={validation,ui,offline:true,saveRoundtrip:true,mobileViewport:'390x844',errors};fs.writeFileSync(output+'/validacion-navegador.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
