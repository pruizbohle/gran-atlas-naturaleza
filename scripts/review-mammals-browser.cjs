// Optional visual review: requires an available Playwright installation and Chromium.
// node scripts/review-mammals-browser.cjs [base URL] [output directory]
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('fs');
const path=require('node:path'),repo=path.resolve(__dirname,'..');
const base=(process.argv[2]||'http://localhost:8766').replace(/\/$/,'');
const output=path.resolve(process.argv[3]||path.join(repo,'work/mammal-review'));
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ATLAS_CHROMIUM||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1500,height:1050}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/laboratorio-mamiferos.html');await page.waitForFunction(()=>document.querySelectorAll('.card').length===269);
 const initialStorage=await page.evaluate(()=>Object.keys(localStorage));assert.equal(initialStorage.length,0);
 const validation=await page.evaluate(()=>{
 const api=ATLAS_MAMMAL_LAB,host=document.createElement('div');document.body.append(host);let checked=0;const invalid=[];let maxBytes=0;
 for(const id of Object.keys(api.SPECIES))for(const skin of ['normal','albino','melanico','alfa'])for(const size of [56,80,120]){
  const sexes=skin==='normal'&&api.SEXUAL_DIMORPHISM[id]?[null,'male','female']:[null];
  for(const sex of sexes){const markup=api.after(id,skin,sex);maxBytes=Math.max(maxBytes,markup.length);host.innerHTML=markup;const svg=host.firstElementChild;svg.style.width=size+'px';svg.style.height=size+'px';const rect=svg.getBoundingClientRect();
   if(rect.width!==size||rect.height!==size||new DOMParser().parseFromString(svg.outerHTML,'image/svg+xml').querySelector('parsererror'))invalid.push([id,skin,sex,'viewport/XML']);
   for(const p of svg.querySelectorAll('path'))if(!Number.isFinite(p.getTotalLength())||p.getTotalLength()<=0)invalid.push([id,skin,sex,'path']);
   // Include half the stroke width to catch actual clipping, not just centerlines.
   for(const el of svg.querySelectorAll('path,circle')){if(el.closest('defs'))continue;const b=el.getBBox(),stroke=el.getAttribute('stroke'),pad=stroke&&stroke!=='none'?+(el.getAttribute('stroke-width')||1)/2:0;if(b.x-pad<0||b.y-pad<0||b.x+b.width+pad>100||b.y+b.height+pad>100)invalid.push([id,skin,sex,'bounds',el.outerHTML]);}
   checked++;
  }
 }host.remove();return {checked,invalid,maxBytes};});
 assert.deepEqual(validation.invalid,[]);assert.equal(validation.checked,3300);
 await page.selectOption('#size','120');assert.equal(await page.locator('.figure:not(.before) svg').first().evaluate(el=>el.getBoundingClientRect().width),120);
 await page.selectOption('#sex','female',{force:true});assert.equal(await page.locator('.card').count(),12);
 await page.selectOption('#skin','melanico');assert.equal(await page.locator('#sex').inputValue(),'');assert.ok(await page.locator('#sex').isDisabled());
 const supported=await page.evaluate(()=>Object.values(ATLAS_MAMMAL_LAB.SPECIES).filter(sp=>sp.special.some(v=>/mel[aá]nic/i.test(v))).length);assert.equal(await page.locator('.card').count(),supported);
 await page.selectOption('#skin','normal');await page.selectOption('#family','bat');assert.equal(await page.locator('.card').count(),3);
 await page.selectOption('#family','');await page.locator('#search').fill('Dugong dugon');assert.equal(await page.locator('.card').count(),1);await page.locator('#search').fill('');
 // Exact outer-geometry signatures omit coat, eyes and palette; no duplicate species.
 const contours=await page.evaluate(()=>{const groups={};for(const[id,sp]of Object.entries(ATLAS_MAMMAL_LAB.SPECIES)){const d=new DOMParser().parseFromString(ATLAS_MAMMAL_LAB.after(id,'normal'),'image/svg+xml');d.querySelectorAll('defs,[data-mammal-detail],[data-mammal-aura]').forEach(e=>e.remove());const key=[...d.querySelectorAll('path,circle,g')].map(e=>['d','cx','cy','r','transform'].map(a=>e.getAttribute(a)||'').join('|')).join(';');(groups[key]??=[]).push(id);}return {unique:Object.keys(groups).length,duplicates:Object.values(groups).filter(g=>g.length>1)};});assert.equal(contours.unique,269);assert.deepEqual(contours.duplicates,[]);
 const comparisons=await page.locator('#similar option').evaluateAll(opts=>opts.map(o=>o.value).filter(Boolean));
 for(const pair of comparisons){await page.selectOption('#similar',pair);assert.equal(await page.locator('.card').count(),2,pair);}
 await page.selectOption('#similar','');
 // Proof sheets rendered by the laboratory, outside www so mobile assets stay small.
 await page.selectOption('#size','80',{force:true});await page.addStyleTag({content:'.top,.intro,.controls,.status,footer,.group{display:none!important}body{max-width:none}#gallery{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}.grid{display:contents}.card{padding:6px}.art{height:calc(var(--sprite-size) + 12px)}.card h3{font-size:12px;margin-top:5px}.variants{display:none}'});
 const order=await page.locator('.card').evaluateAll(cards=>cards.map(c=>c.dataset.speciesId));
 for(let i=0;i<4;i++){await page.evaluate(({order,i})=>{for(const c of document.querySelectorAll('.card')){const n=order.indexOf(c.dataset.speciesId);c.style.display=n>=i*72&&n<(i+1)*72?'':'none';}},{order,i});await page.locator('#gallery').screenshot({path:output+'/mamiferos-antes-despues-'+(i+1)+'.jpg',type:'jpeg',quality:90});}
 await page.selectOption('#size','56',{force:true});await page.locator('#silhouette').evaluate(el=>{el.checked=true;el.dispatchEvent(new Event('change'))});await page.evaluate(()=>{const seen=new Set();for(const card of document.querySelectorAll('.card')){const family=card.querySelector('[data-mammal-family]').dataset.mammalFamily;card.style.display=seen.has(family)?'none':'';seen.add(family);}});await page.locator('#gallery').screenshot({path:output+'/mamiferos-68-siluetas-56.jpg',type:'jpeg',quality:90});
 await page.locator('#silhouette').evaluate(el=>{el.checked=false;el.dispatchEvent(new Event('change'))});await page.selectOption('#sex','female',{force:true});await page.selectOption('#size','80',{force:true});await page.locator('#gallery').screenshot({path:output+'/mamiferos-hembras.jpg',type:'jpeg',quality:90});
 await page.selectOption('#sex','male',{force:true});await page.locator('#gallery').screenshot({path:output+'/mamiferos-machos.jpg',type:'jpeg',quality:90});
 await page.selectOption('#sex','',{force:true});await page.selectOption('#size','120',{force:true});
 await page.evaluate(()=>{const chosen=new Set(['lobo_gris','zorro_rojo','asia_esp_0402','af_leopardo','liebre_europea','conejo_europeo','alce','ciervo_rojo','bisonte_europeo','af_bufalo_cafre','af_guepardo','nutria_europea','af_lobo_marino_cabo','asia_esp_0184','asia_esp_0498','af_rinoceronte_blanco','af_xlsx_rinoceronte_negro','af_gorila_occidental','af_chimpance']);for(const c of document.querySelectorAll('.card'))c.style.display=chosen.has(c.dataset.speciesId)?'':'none';});await page.locator('#gallery').screenshot({path:output+'/mamiferos-similares-120.jpg',type:'jpeg',quality:90});
 for(const skin of ['albino','melanico','alfa']){await page.selectOption('#skin',skin,{force:true});await page.evaluate(()=>{for(const c of document.querySelectorAll('.card'))c.style.display=['asia_esp_0402','af_leon','oso_pardo','zorro_rojo','af_gorila_occidental','af_dugongo','asia_esp_0498','asia_esp_0858','af_lobo_marino_cabo','af_lemur_colaanillada','af_pangolin_gigante','eu_esp_0616'].includes(c.dataset.speciesId)?'':'none';});await page.locator('#gallery').screenshot({path:output+'/mamiferos-'+skin+'-120.jpg',type:'jpeg',quality:90});}
 assert.equal(await page.evaluate(()=>Object.keys(localStorage).length),0);
 // Boot the actual game in a fresh context. Seed a disposable test save through its supported bridge.
 const game=await context.newPage();game.on('pageerror',e=>errors.push(e.message));await game.goto(base+'/');await game.waitForFunction(()=>!!window.AtlasSaveBridge);
 const ids=await page.evaluate(()=>Object.keys(ATLAS_MAMMAL_LAB.SPECIES));
 const baselineSpecies=await page.evaluate(()=>ATLAS_MAMMAL_LAB.SPECIES);
 const auditContext=await browser.newContext({serviceWorkers:'block'}),audit=await auditContext.newPage();
 await audit.route('**/js/app.js*',route=>{const source=fs.readFileSync(repo+'/www/js/app.js','utf8').replace(/\n\}\)\(\);\s*$/, '\nglobalThis.__mammalAudit={SPECIES};\n})();');return route.fulfill({contentType:'application/javascript',body:source});});
 await audit.goto(base+'/');await audit.waitForFunction(()=>!!globalThis.__mammalAudit);
 const runtime=await audit.evaluate(()=>__mammalAudit.SPECIES),expected=require(repo+'/tests/helpers/catalog.cjs').catalog().SPECIES;assert.deepEqual(runtime,JSON.parse(JSON.stringify(expected)));
 for(const [id,sp] of Object.entries(baselineSpecies))assert.deepEqual(runtime[id],sp,id+' complete runtime catalog');await auditContext.close();
 await game.evaluate(ids=>{
  const s=JSON.parse(localStorage.getItem('gran_atlas_v05'));s.money=4465;s.knowledge=390;s.prestige=4;s.upgrades.autoTier=0;s.currentRegion='HX-01-09';s.selectedJournal='zorro_rojo';s.regionUnlocked['HX-02-09']=true;
  for(const id of ids){s.discovered[id]=true;s.sightings[id]=120;s.stages[id]=5;}
  s.museum.exhibits={zorro_rojo:true};s.lastEncounter={species:'zorro_rojo',title:'Zorro rojo',subtitle:'Prueba de integración',entries:[{id:'zorro_rojo',amount:1}]};window.AtlasSaveBridge.restoreGame(s);
 },ids);
 const ui={};for(const tab of ['field','bestiary','journal','museum']){
  await game.locator('.tabs [data-tab="'+tab+'"]').click();await game.waitForTimeout(100);
  ui[tab]=await game.locator('#panel svg[data-mammal-version="3.19.4"]').count();assert.ok(ui[tab]>0,tab);
 }
 assert.equal(ui.bestiary,269);
 const before=await game.evaluate(()=>JSON.parse(localStorage.getItem('gran_atlas_v05')));
 await game.reload();await game.waitForFunction(()=>!!window.AtlasSaveBridge);const after=await game.evaluate(()=>JSON.parse(localStorage.getItem('gran_atlas_v05')));
 for(const key of ['discovered','sightings','stages','sexSeen','specialFound','inventory','regionUnlocked','purchases','published'])assert.deepEqual(after[key],before[key],key+' persisted');assert.equal(after.prestige,4);
 // Real SW precache and offline reload of the game and four laboratories.
 await game.evaluate(async()=>{await navigator.serviceWorker.ready;});await game.reload();await game.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await game.reload();await game.waitForFunction(()=>!!window.AtlasSaveBridge);
 for(const lab of ['laboratorio-mamiferos.html','laboratorio-aves.html','laboratorio-herpetologia.html','laboratorio-peces.html']){await game.goto(base+'/'+lab);if(lab==='laboratorio-mamiferos.html')assert.equal(await game.locator('.card').count(),269);assert.ok(await game.locator('svg').count()>0,lab+' offline');}
 await context.setOffline(false);
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true});const mp=await mobile.newPage();await mp.goto(base+'/');await mp.waitForFunction(()=>!!window.AtlasSaveBridge);assert.ok(await mp.locator('.mobile-dock').isVisible());
 await mp.goto(base+'/laboratorio-mamiferos.html');assert.equal(await mp.locator('.card').count(),269);await mp.selectOption('#size','120');assert.equal(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await mobile.close();
 assert.deepEqual(errors,[]);const result={validation,contours,comparisons:comparisons.length,ui,offline:true,saveRoundtrip:true,mobileViewport:'390x844',errors};fs.writeFileSync(output+'/validacion-navegador.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
