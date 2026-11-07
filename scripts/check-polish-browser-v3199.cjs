'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const origin=process.env.ATLAS_TEST_URL||'http://127.0.0.1:8775',out=process.env.ATLAS_ARTIFACT_DIR||'/tmp/atlas-polish-v3199';
(async()=>{fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({executablePath:process.env.ATLAS_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{
 const context=await browser.newContext({viewport:{width:1450,height:1050}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/laboratorio-pulido-v3199.html');await page.waitForFunction(()=>!!window.ATLAS_POLISH_LAB);const storage=await page.evaluate(()=>JSON.stringify(localStorage));
 const inventory=await page.evaluate(()=>{const {rows}=ATLAS_POLISH_LAB;return Object.fromEntries(['mammals','fish','legendary','relicts'].map(g=>[g,rows.filter(r=>r.group===g).length]));});assert.deepEqual(inventory,{mammals:269,fish:18,legendary:12,relicts:9});assert.equal(await page.evaluate(()=>ATLAS_POLISH_REVIEW.count),308);assert.equal(await page.evaluate(()=>ATLAS_POLISH_LAB.rows.every(row=>ATLAS_POLISH_REVIEW.get(row.id)?.every(Boolean))),true);
 const validation=await page.evaluate(()=>{
  const all=ATLAS_POLISH_LAB.rows,issues=[],records=[];
  const host=document.createElement('div');host.style.cssText='position:absolute;left:-1000px;top:0;width:100px;height:100px';document.body.append(host);
  for(const row of all){const svg=ATLAS_POLISH_LAB.sprite(ATLAS_POLISH_CURRENT,row),old=ATLAS_POLISH_LAB.sprite(ATLAS_POLISH_BEFORE,row);const doc=new DOMParser().parseFromString(svg,'image/svg+xml');
   if(doc.querySelector('parsererror')||/NaN|undefined|Infinity/.test(svg))issues.push(row.id+':invalid');
   host.innerHTML=svg;const b=host.querySelector('svg').getBBox();if(b.x<0||b.y<0||b.x+b.width>100||b.y+b.height>100)issues.push({id:row.id,bounds:[b.x,b.y,b.width,b.height]});
   const geometry=s=>[...s.matchAll(/\b(?:d|points|cx|cy|rx|ry|r|transform)="([^"]*)"/g)].map(m=>m[0]).join('|');
   records.push({...row,geometryChanged:geometry(svg)!==geometry(old),bytes:svg.length});
  }host.remove();return {issues,records};
 });assert.deepEqual(validation.issues,[]);
 fs.writeFileSync(out+'/inventory.json',JSON.stringify(validation.records,null,2)+'\n');
 for(const group of ['mammals','fish','legendary','relicts']){
  await page.selectOption('#group',group);if(group==='legendary')assert.deepEqual(await page.locator('article').evaluateAll(cards=>cards.filter(c=>c.querySelector('.after [data-legendary-id]')?.getAttribute('data-legendary-id')!==c.dataset.id).map(c=>c.dataset.id)),[]);await page.selectOption('#size','120');let index=0;
  do{await page.screenshot({path:out+'/'+group+'-120-'+(++index)+'.png',fullPage:true});if(await page.locator('#next').isDisabled())break;await page.click('#next');}while(index<20);
  await page.selectOption('#size','56');await page.screenshot({path:out+'/'+group+'-56.png',fullPage:true});
  await page.selectOption('#background','dark');await page.screenshot({path:out+'/'+group+'-dark.png',fullPage:true});await page.check('#silhouette');await page.screenshot({path:out+'/'+group+'-silhouette.png',fullPage:true});await page.uncheck('#silhouette');await page.selectOption('#background','light');
 }
 for(const width of [320,390,500,701,768,800,1024]){await page.setViewportSize({width,height:900});await page.selectOption('#group','fish');await page.selectOption('#size','120');assert.deepEqual(await page.locator('article').evaluateAll(cards=>cards.filter(c=>c.scrollWidth>c.clientWidth+1).map(c=>c.dataset.id)),[], 'card overflow at '+width);}
 await page.setViewportSize({width:1450,height:1050});await page.selectOption('#group','mammals');await page.fill('#search','reno');assert.equal(await page.locator('article').count(),1);await page.selectOption('#sex','female');assert.ok(await page.locator('.after svg').count());await page.selectOption('#skin','albino');assert.ok(await page.locator('.after [data-pigmentation="albino"]').count());await page.fill('#search','');await page.selectOption('#skin','normal');await page.selectOption('#sex','');
 const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(ids.length,new Set(ids).size,'laboratory namespaces clip IDs');
 await page.setViewportSize({width:390,height:844});await page.selectOption('#group','legendary');await page.selectOption('#size','80');await page.screenshot({path:out+'/mobile-legends.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),storage,'laboratory leaves game data untouched');
 // Old-format save with discoveries, equipment and relics must survive game boot and offline reload.
 const {harness}=require('../tests/helpers/live-game.cjs'),store={},game=harness(store),api=game.window.__atlasTest;
 for(const id of Object.keys(api.ITEMS))api.state.inventory[id]=17;api.state.equipment={instrument:'field_telescope',hat:'scholar_hat',necklace:'museum_medallion'};
 for(const l of api.LEGENDARY_SPECIMENS)api.recordSpecimen(l.speciesId,{pigment:'',category:'Legendario'},api.state);
 for(const r of api.MUSEUM_RELICTS)api.state.museum.relicts[r.id]=true;game.tick();const save=JSON.parse(store.gran_atlas_v05);
 await page.goto(origin+'/');await page.evaluate(s=>localStorage.setItem('gran_atlas_v05',JSON.stringify(s)),save);await page.reload();await page.waitForFunction(()=>document.querySelector('#panel')?.children.length);
 const click=async selector=>page.locator(selector).first().evaluate(e=>e.click());
 for(const tab of ['field','journal','bestiary','museum','objects']){await click('.tab[data-tab="'+tab+'"]');assert.ok((await page.locator('#panel').innerHTML()).length>100);}
 await click('.tab[data-tab="museum"]');await click('[data-action="museum-tab"][data-id="relicts"]');assert.equal(await page.locator('[data-relict-art]').count(),9);
 await page.evaluate(()=>navigator.serviceWorker.ready);await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload();await page.waitForFunction(()=>document.querySelector('#panel')?.children.length);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('gran_atlas_v05')));for(const key of ['inventory','equipment','legendaryFound'])assert.deepEqual(stored[key],save[key],key);assert.deepEqual(stored.museum.relicts,save.museum.relicts);
 await page.goto(origin+'/laboratorio-pulido-v3199.html');await page.waitForFunction(()=>!!window.ATLAS_POLISH_LAB);await page.selectOption('#group','relicts');assert.equal(await page.locator('article').count(),9);assert.deepEqual(errors,[]);
 const report={version:'3.19.9',inventory,svgXmlAndViewport:308,allComparisonPagesCaptured:true,mobileWidth:390,labStorageUntouched:true,oldSaveInventoryEquipmentLegendsRelictsPreserved:true,offlineGameAndLab:true,jsErrors:errors};fs.writeFileSync(out+'/browser-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));await context.close();
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
