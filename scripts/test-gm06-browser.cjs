'use strict';
const{chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
let activeBrowser;
(async()=>{
 const out='docs/gm06/pruebas';fs.mkdirSync(out,{recursive:true});const b=activeBrowser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});const results=[];
 for(const width of [320,360,390,412,1280]){
  const p=await b.newPage({viewport:{width,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto((process.env.GM06_LAB_URL||'http://127.0.0.1:8126')+'/laboratorio-cartografia-gm06.html');await p.evaluate(()=>localStorage.setItem('gran_atlas_v05','GM06_BROWSER_SENTINEL'));
  assert.equal(await p.locator('#mapPair svg').count(),2);let overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false,'host overflow '+width);
  await p.selectOption('#continent','Sudamérica');await p.screenshot({path:path.join(out,'mapas-'+width+'.png'),fullPage:true});
  await p.click('[data-view=animals]');assert.equal(await p.locator('.animal').count(),12);assert.equal(await p.locator('.animal svg').count(),72);await p.fill('#animalQuery','pingüino');assert.equal(await p.locator('.animal').count(),2);await p.fill('#animalQuery','');
  if(width===1280||width===390)await p.screenshot({path:path.join(out,'galeria-'+width+'.png'),fullPage:true});
  await p.click('[data-view=game]');await p.click('#startGame');await p.waitForFunction(()=>document.getElementById('status').textContent.includes('Motor listo'));
  const frame=p.frames().find(f=>f!==p.mainFrame());assert.ok(frame);const sandbox=await p.locator('#engine').getAttribute('sandbox');assert.ok(!sandbox.includes('allow-same-origin'));assert.equal(await frame.evaluate(()=>localStorage.getItem('gran_atlas_v05')?.includes('GM06_BROWSER_SENTINEL')||false),false);
  // Verify all 12 real regional maps can load and select their new cell.
  const ids=await p.locator('#gameRegion option').evaluateAll(a=>a.map(n=>n.value));for(const id of ids){await p.selectOption('#gameRegion',id);await p.click('#startGame');await p.waitForFunction(id=>document.getElementById('status').textContent.includes('Motor listo')&&JSON.parse(document.getElementById('gm06-data').textContent).regions.find(r=>r.id===id).name&&document.getElementById('status').textContent.includes(JSON.parse(document.getElementById('gm06-data').textContent).regions.find(r=>r.id===id).name),id);}
  await p.selectOption('#gameRegion','gm06_galapagos');await p.selectOption('#scenario','cuaderno');await p.click('#startGame');await p.waitForFunction(()=>document.getElementById('status').textContent.endsWith('cuaderno'));
  const timings={};for(const tab of ['atlas','journal','bestiary','expeditions','objects','museum','society']){
   const sample=[];for(let i=0;i<5;i++){const start=performance.now();await p.locator('#gameTabs [data-tab="'+tab+'"]').click();await frame.locator('#panel').waitFor({state:'visible'});sample.push(performance.now()-start);}
   timings[tab]={medianMs:+sample.sort((a,b)=>a-b)[2].toFixed(1),maxMs:+Math.max(...sample).toFixed(1)};
   if(tab==='bestiary'){const count=await frame.locator('#panel svg').count();assert.ok(count<60,'Bestiary sprites must stay paginated: '+count);timings.bestiary.svgCount=count;}
  }
  await p.click('#manual');await p.click('#auto');await p.selectOption('#scenario','continuidad');await p.click('#startGame');await p.waitForFunction(()=>document.getElementById('status').textContent.endsWith('continuidad'));
  assert.equal(await p.evaluate(()=>localStorage.getItem('gran_atlas_v05')),'GM06_BROWSER_SENTINEL');
  const engineOverflow=await frame.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(engineOverflow,false,'game overflow '+width);assert.deepEqual(errors,[],width+' browser errors');
  results.push({width,hostOverflow:overflow,engineOverflow,errors,scenarioRegions:ids.length,timings});await p.close();
 }
 // The downloadable single file boots the actual engine without any network.
 const p=await b.newPage();await p.context().setOffline(true);await p.setContent(fs.readFileSync('www/laboratorio-cartografia-gm06.html','utf8'));await p.click('[data-view=game]');await p.click('#startGame');await p.waitForFunction(()=>document.getElementById('status').textContent.includes('Motor listo'));
 fs.writeFileSync(out+'/navegador.json',JSON.stringify({browser:'Chromium '+b.version(),physicalAndroid:false,offlineSingleFile:true,widths:results},null,2)+'\n');await b.close();console.log(JSON.stringify(results.map(x=>({width:x.width,timings:x.timings})),null,2));
})().catch(async e=>{console.error(e);await activeBrowser?.close();process.exitCode=1});
