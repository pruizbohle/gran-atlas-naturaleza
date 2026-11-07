'use strict';
// Local deterministic workload; timings are measured in Chromium, not Android hardware.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),{chromium}=require('playwright');
const out=process.env.ATLAS_REPORT||'/tmp/atlas-v3200-benchmark.json',app=process.env.ATLAS_APP_SOURCE?fs.readFileSync(process.env.ATLAS_APP_SOURCE,'utf8'):fs.readFileSync('www/js/app.js','utf8');
const instrument=app.replace(/\n\}\)\(\);\s*$/, '\nwindow.__perf={get state(){return state},renderPanel,renderBestiary,getSpriteMarkup,spriteCache,tick,persist,initialState,SPECIES,SEXUAL_DIMORPHISM,configuredSpecials,LEGENDARY_SPECIMENS,recordSpecimen,ITEMS,REGIONS,MUSEUM_RELICTS,setTab(value){tab=value;renderPanel();}};\n})();');
if(instrument===app)throw Error('Missing instrument boundary');
const comparison=process.env.ATLAS_COMPARE_SOURCE?fs.readFileSync(process.env.ATLAS_COMPARE_SOURCE,'utf8'):null;let servedApp=instrument;
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://localhost'),name=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname),file=path.join(process.cwd(),'www',name);if(!file.startsWith(path.join(process.cwd(),'www')+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',name.endsWith('.js')?'application/javascript':name.endsWith('.css')?'text/css':name.endsWith('.html')?'text/html':'application/octet-stream');res.end(name==='/js/app.js'?servedApp:fs.readFileSync(file));}catch{res.writeHead(404).end();}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-precise-memory-info']});try{
 const trials=[];for(let trial=0;trial<(comparison?10:5);trial++){
  const variant=comparison?([0,3].includes(trial%4)?'before':'after'):'single';
  servedApp=variant==='before'?comparison.replace(/\n\}\)\(\);\s*$/,instrument.slice(instrument.lastIndexOf('\nwindow.__perf='))):instrument;
  const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'}),page=await context.newPage(),cdp=await context.newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Performance.enable');
  await page.addInitScript(()=>{window.__timers=[];window.setInterval=(fn,ms)=>{window.__timers.push({fn,ms});return window.__timers.length;};});
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>!!window.__perf);
  const result=await page.evaluate(async()=>{
   const a=__perf,s=a.state,ids=Object.keys(a.SPECIES);s.money=1e7;s.knowledge=1e7;s.helpers=0;s.books=500;s.prestige=1000;
   for(const[id,sp]of Object.entries(a.SPECIES)){s.discovered[id]=true;s.sightings[id]=100000;s.stages[id]=5;s.published[id]=ids.indexOf(id)%2===0;s.specialFound[id]={};for(const v of a.configuredSpecials(sp))s.specialFound[id][v]=true;}
   for(const l of a.LEGENDARY_SPECIMENS)a.recordSpecimen(l.speciesId,{pigment:'',category:'Legendario'},s);
   for(const id of Object.keys(a.ITEMS))s.inventory[id]=1000;for(const r of a.MUSEUM_RELICTS)s.museum.relicts[r.id]=true;
   const time=fn=>{const start=performance.now();fn();return performance.now()-start;};
   const coldSprites=time(()=>{for(const id of ids)for(const skin of ['normal','albino','melanico','alfa','epico','excepcional'])a.getSpriteMarkup(id,skin);});
   const warmSprites=time(()=>{for(let n=0;n<5;n++)for(const id of ids)for(const skin of ['normal','albino','melanico','alfa','epico','excepcional'])a.getSpriteMarkup(id,skin);});
   const cards=time(()=>a.renderBestiary());const bestiary=time(()=>{a.setTab('bestiary');document.body.offsetHeight;});
   const nodes=document.querySelectorAll('*').length,svgs=document.querySelectorAll('#panel svg').length;
   const tabs={};for(const tab of ['field','journal','museum','objects','research','expeditions','bestiary'])tabs[tab]=time(()=>{a.setTab(tab);document.body.offsetHeight;});
   a.setTab('field');const counters={};const observer=new MutationObserver(()=>{});observer.observe(document.getElementById('statMoney'),{subtree:true,childList:true,characterData:true});
   const tick=time(()=>{for(let i=0;i<30;i++)a.tick();});counters.moneyMutations=observer.takeRecords().length;observer.disconnect();
   const persist=time(()=>{for(let i=0;i<30;i++)a.persist();});
   const cacheBytes=[...a.spriteCache.values()].reduce((sum,x)=>sum+x.length*2,0);
   return {load:performance.getEntriesByType('navigation')[0].loadEventEnd,coldSprites,warmSprites,cards,bestiary,nodes,svgs,tabs,tick30:tick,persist30:persist,cacheEntries:a.spriteCache.size,cacheUtf16Bytes:cacheBytes,counters,saveBytes:localStorage.getItem('gran_atlas_v05').length*2,intervals:window.__timers.map(x=>x.ms)};
  });
  await cdp.send('HeapProfiler.collectGarbage');const metrics=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));result.jsHeapUsed=metrics.JSHeapUsedSize;result.variant=variant;if(trial===0&&process.env.ATLAS_SCREENSHOT){await page.evaluate(()=>__perf.setTab('bestiary'));await page.screenshot({path:process.env.ATLAS_SCREENSHOT});}trials.push(result);await context.close();
 }
 const median=values=>values.sort((a,b)=>a-b)[Math.floor(values.length/2)],summary={};for(const key of ['load','coldSprites','warmSprites','cards','bestiary','nodes','svgs','tick30','persist30','cacheEntries','cacheUtf16Bytes','saveBytes','jsHeapUsed'])summary[key]=median(trials.map(t=>t[key]));summary.tabs=Object.fromEntries(Object.keys(trials[0].tabs).map(k=>[k,median(trials.map(t=>t.tabs[k]))]));summary.moneyMutations=median(trials.map(t=>t.counters.moneyMutations));
 const report={sourceBytes:comparison?{before:Buffer.byteLength(comparison),after:Buffer.byteLength(app)}:{app:Buffer.byteLength(app)},method:'Chromium Linux, 390x844, CDP CPU slowdown 4x; 5 trials, medians; advanced 487-species fixture; interval callbacks manually driven; no physical Android claim',summary,trials,jsFiles:Object.fromEntries(fs.readdirSync('www/js').filter(f=>f.endsWith('.js')).map(f=>[f,fs.statSync('www/js/'+f).size]))};if(comparison){report.method+='; interleaved ABBA ordering, 5 before and 5 after in one browser process';report.paired={};for(const variant of ['before','after']){const rows=trials.filter(t=>t.variant===variant),summary={};for(const key of ['load','coldSprites','warmSprites','cards','bestiary','nodes','svgs','tick30','persist30','cacheEntries','cacheUtf16Bytes','saveBytes','jsHeapUsed'])summary[key]=median(rows.map(t=>t[key]));summary.tabs=Object.fromEntries(Object.keys(rows[0].tabs).map(k=>[k,median(rows.map(t=>t.tabs[k]))]));summary.moneyMutations=median(rows.map(t=>t.counters.moneyMutations));report.paired[variant]={summary,trials:rows};}}fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report.paired||summary,null,2));
 }finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
