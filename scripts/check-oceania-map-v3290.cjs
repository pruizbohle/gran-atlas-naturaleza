'use strict';
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const out='docs/gm02/cartography';fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const file=path.resolve('www','.'+new URL(req.url,'http://localhost').pathname);if(!file.startsWith(path.resolve('www')+path.sep))return res.writeHead(403).end();try{res.setHeader('Content-Type',file.endsWith('.js')?'application/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});try{
const page=await browser.newPage(),errors=[],results=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{for(const name of ['localStorage','sessionStorage'])Object.defineProperty(window,name,{get(){throw Error('The isolated lab must not access '+name);}});});
for(const[width,height]of [[320,640],[360,740],[390,844],[412,915]]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:'+server.address().port+'/laboratorio-oceania-v3290.html');await page.waitForFunction(()=>!!window.OceaniaCandidateReview);
 assert.equal(await page.locator('.atlas-tile').count(),8);
 const ids=await page.evaluate(()=>OceaniaCandidateReview.model.regions.map(r=>r.id));
 for(const id of ids){await page.locator('.atlas-tile[data-id="'+id+'"]').click();assert.equal(await page.locator('.atlas-selected').getAttribute('data-id'),id);}
 await page.locator('[data-action="atlas-zoom"][data-id="in"]').click();await page.locator('[data-action="atlas-zoom"][data-id="out"]').click();await page.locator('[data-action="atlas-zoom"][data-id="fit"]').click();
 const measure=await page.evaluate(()=>{const root=document.querySelector('.atlas-game'),v=root.querySelector('.atlas-map-viewport').getBoundingClientRect(),b=root.querySelector('#atlasMap').getBoundingClientRect(),button=root.querySelector('.atlas-primary').getBoundingClientRect();return {width:innerWidth,height:innerHeight,horizontalOverflow:document.documentElement.scrollWidth>innerWidth,mapFitsWidth:b.width<=v.width+2,mapFitsHeight:b.height<=v.height+2,actionVisible:button.bottom<=innerHeight,selected:OceaniaCandidateReview.model.selectedId,edgeErrors:OceaniaCandidateReview.audit.edgeErrors.length};});
 assert.ok(!(await page.locator('#candidate').innerText()).includes('undefined'));await page.locator('.atlas-primary').click();assert.equal(await page.locator('.atlas-requirements').getAttribute('open'),'');await page.locator('.atlas-requirements summary').click();assert.equal(measure.horizontalOverflow,false);assert.ok(measure.mapFitsWidth&&measure.mapFitsHeight);assert.ok(measure.actionVisible);assert.equal(measure.edgeErrors,0);results.push(measure);
 await page.screenshot({path:out+'/map-'+width+'.png',fullPage:true});
}
assert.deepEqual(errors,[]);fs.writeFileSync(out+'/browser-results.json',JSON.stringify({status:'candidate cartography only, not Oceanía gameplay',engine:'Chromium emulation; no physical Android test',results,errors},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
