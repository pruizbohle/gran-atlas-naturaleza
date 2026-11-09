'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const{candidateGameSource}=require('../tests/helpers/oceania-review.cjs'),{harness}=require('../tests/helpers/live-game.cjs');
const out='docs/gm02/runtime/browser';fs.mkdirSync(out,{recursive:true});
const bridge='\nwindow.__oceaniaTest={get state(){return state},SPECIES,REGIONS,RESEARCH_NODES,renderBestiary,renderPanel,getSpriteMarkup,clearSpriteCache(){spriteCache.clear()},encounter,eligibleSpecies,automaticEligibleSpecies,openTab(name){tab=name;renderPanel()},persist,regionRequirementsMet,unlockRegion,travelToRegion};\n})();';
const candidate=candidateGameSource().replace(/\n\}\)\(\);\s*$/,bridge),baseline=fs.readFileSync('www/js/app.js','utf8').replace(/\n\}\)\(\);\s*$/,bridge);
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://review');if(url.pathname==='/candidate.html'||url.pathname==='/baseline.html'){res.setHeader('Content-Type','text/html');return res.end(fs.readFileSync('www/index.html','utf8').replace('<head>','<head><base href="/">').replace(/js\/app\.js\?v=[^"']+/, 'js/app.js?review='+(url.pathname==='/candidate.html'?'candidate':'baseline')));}
if(url.pathname==='/js/app.js'&&url.searchParams.has('review')){res.setHeader('Content-Type','application/javascript');return res.end(url.searchParams.get('review')==='candidate'?candidate:baseline);}
const file=path.resolve('www','.'+url.pathname);if(!file.startsWith(path.resolve('www')+path.sep))return res.writeHead(403).end();try{res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':file.endsWith('.json')?'application/json':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});
const median=a=>{a=[...a].sort((x,y)=>x-y);return a[Math.floor(a.length/2)];};
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
 const errors=[],checks=[];
 if(!process.argv.includes('--benchmark-only')){
 const seed=JSON.parse(JSON.stringify(harness().window.__atlasTest.initialState()));Object.assign(seed,{money:1e7,knowledge:1e7,prestige:250,helpers:0,lastTick:Date.now()});Object.assign(seed.purchases,{africa_1:1,nuevo_mundo_1:1,norteamerica_1:1,sudamerica_1:1});Object.assign(seed.inventory,{africa_map:1,north_america_map:1});
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,serviceWorkers:'block'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(s=>{if(!localStorage.getItem('gran_atlas_v05'))localStorage.setItem('gran_atlas_v05',JSON.stringify(s));},seed);await page.goto(origin+'/candidate.html');await page.waitForFunction(()=>!!window.__oceaniaTest);
 assert.equal(await page.evaluate(()=>Object.keys(__oceaniaTest.SPECIES).length),807);
 const tab=async name=>page.locator('.mobile-dock .tab[data-tab="'+name+'"]').click();
 await tab('atlas');await page.selectOption('[data-atlas-continent]','Oceanía');assert.equal(await page.locator('.atlas-tile').count(),8);assert.equal(await page.locator('.atlas-tile[data-status="bloqueada"]').count(),8);
 await tab('research');await page.locator('[data-action="research-branch"][data-id="expediciones"]').click();await page.locator('[data-action="er28-project"][data-id="oceania_1"]').click();await page.locator('[data-action="buy-node"][data-id="oceania_1"]').click();assert.equal(await page.evaluate(()=>__oceaniaTest.state.purchases.oceania_1),1);
 const ids=await page.evaluate(()=>__oceaniaTest.REGIONS.filter(r=>r.continent==='Oceanía').map(r=>r.id));assert.equal(await page.evaluate(ids=>ids.some(id=>__oceaniaTest.state.regionUnlocked[id]),ids),false);
 for(const[width,height]of [[320,640],[360,740],[390,844],[412,915]]){
  await page.setViewportSize({width,height});
  for(const id of ids){await tab('atlas');await page.selectOption('[data-atlas-continent]','Oceanía');await page.locator('.atlas-tile[data-id="'+id+'"]').click();assert.equal(await page.locator('.atlas-selected').getAttribute('data-id'),id);
   const before=await page.evaluate(()=>__oceaniaTest.state.prestige);
   if(await page.locator('.atlas-primary').getAttribute('data-action')==='unlock-region')await page.locator('.atlas-primary').click();assert.equal(await page.evaluate(()=>__oceaniaTest.state.prestige),before);
   const map=await page.evaluate(()=>{const v=document.querySelector('.atlas-map-viewport').getBoundingClientRect(),button=document.querySelector('.atlas-primary').getBoundingClientRect(),dock=document.querySelector('.mobile-dock').getBoundingClientRect();return{wholeMapVisible:[...document.querySelectorAll('.atlas-tile')].every(t=>{t=t.getBoundingClientRect();return t.top>=v.top-2&&t.bottom<=v.bottom+2&&t.left>=v.left-2&&t.right<=v.right+2;}),actionVisible:button.bottom<=dock.top+1,horizontal:document.documentElement.scrollWidth>innerWidth};});assert.ok(map.wholeMapVisible&&map.actionVisible&&!map.horizontal,id+JSON.stringify(map));
   if(await page.locator('.atlas-primary').getAttribute('data-action')==='travel-region')await page.locator('.atlas-primary').click();else await tab('field');assert.equal(await page.evaluate(()=>__oceaniaTest.state.currentRegion),id);
   await page.evaluate(()=>__oceaniaTest.encounter('manual',Date.now(),true));
   const field=await page.evaluate(()=>{const d=document.querySelector('.mobile-dock').getBoundingClientRect(),b=document.querySelector('.field-explore').getBoundingClientRect(),a=document.querySelector('.field-stage').getBoundingClientRect();return{actionVisible:b.bottom<=d.top+1,animalVisible:a.bottom<=d.top+1,horizontal:document.documentElement.scrollWidth>innerWidth};});assert.ok(field.actionVisible&&field.animalVisible&&!field.horizontal,id+JSON.stringify(field));
   await tab('journal');assert.ok(await page.locator('#panel').textContent());checks.push({width,height,id,map,field});
  }
  await tab('atlas');await page.selectOption('[data-atlas-continent]','Oceanía');await page.screenshot({path:out+'/atlas-'+width+'.png'});await tab('field');await page.screenshot({path:out+'/field-'+width+'.png'});
 }
 assert.deepEqual(errors,[]);await context.close();
 }else{const previous=JSON.parse(fs.readFileSync(out+'/results.json'));checks.push(...previous.checks);errors.push(...previous.errors);}
 // Equivalent Chromium/CPU x4 conditions. All discovered; real DOM, 32-card paging.
 const performance=[];
 for(const mode of ['baseline','candidate']){
  const cold=[];let warm=[],svg=[],svgCold=[],serialization=[],bytes=0,heap=null;
  for(let run=0;run<3;run++){
   const c=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'}),p=await c.newPage();await p.goto(origin+'/'+mode+'.html');await p.waitForFunction(()=>!!window.__oceaniaTest);const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   await p.evaluate(()=>{const a=__oceaniaTest;for(const id of Object.keys(a.SPECIES)){a.state.discovered[id]=true;a.state.stages[id]=5;a.state.sightings[id]=1000;}});
   const timing=await p.evaluate(()=>{const a=__oceaniaTest;a.clearSpriteCache();let start=performance.now();a.openTab('bestiary');const cold=performance.now()-start,warm=[],svg=[],svgCold=[],serial=[];for(let i=0;i<7;i++){let t=performance.now();a.renderPanel();warm.push(performance.now()-t);t=performance.now();JSON.stringify(a.state);serial.push(performance.now()-t);}const all=Object.keys(a.SPECIES),keys=(all.length>710?all.filter(id=>id.startsWith('oc_esp_')):all).slice(0,7);for(const id of keys){a.clearSpriteCache();let t=performance.now();a.getSpriteMarkup(id);svgCold.push(performance.now()-t);t=performance.now();a.getSpriteMarkup(id);svg.push(performance.now()-t);}return{cold,warm,svg,svgCold,serial,bytes:new TextEncoder().encode(JSON.stringify(a.state)).length,heap:performance.memory?.usedJSHeapSize||null};});assert.equal(await p.locator('.b26-card').count(),32);cold.push(timing.cold);warm.push(...timing.warm);svg.push(...timing.svg);svgCold.push(...timing.svgCold);serialization.push(...timing.serial);bytes=timing.bytes;heap=timing.heap;await c.close();
  }
  performance.push({mode,catalogSize:mode==='candidate'?807:710,cpuThrottling:4,coldOpenMedianMs:median(cold),warmOpenMedianMs:median(warm),cachedSvgMedianMs:median(svg),coldSvgMedianMs:median(svgCold),serializeMedianMs:median(serialization),saveBytes:bytes,lastObservedHeapBytes:heap,svgSampleDescription:mode==='candidate'?'first seven new Oceanian identities; cached measurements immediately repeat the same identity':'first seven base identities; cached measurements immediately repeat the same identity',samples:{cold,warm,svg,svgCold,serialization}});
 }
 fs.writeFileSync(out+'/results.json',JSON.stringify({scope:'isolated candidate only, no public deployment or offline validation',checks,errors,performance,environment:'Chromium emulation, not physical Android',serviceWorkers:'blocked to prevent mixing candidate resources into public PWA cache'},null,2)+'\n');console.log(JSON.stringify({checks:checks.length,performance}));
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
