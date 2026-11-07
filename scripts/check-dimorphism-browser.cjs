'use strict';
// Optional integration check: requires Playwright and Chromium; use a disposable browser profile.
const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.ATLAS_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:1450,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const origin=process.env.ATLAS_TEST_URL||'http://localhost:8000';await page.goto(origin+'/laboratorio-dimorfismo.html');
 assert.equal(await page.locator('.card').count(),32);
 const boxes=await page.locator('.pair svg').evaluateAll(svgs=>svgs.map(svg=>{const doc=new DOMParser().parseFromString(svg.outerHTML,'image/svg+xml');if(doc.querySelector('parsererror'))throw Error('Invalid SVG XML');const b=svg.getBBox();return {x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height};}));
 for(const b of boxes){assert.ok(b.x>=0&&b.y>=0&&b.right<=100&&b.bottom<=100,JSON.stringify(b));}
 for(const size of ['56','80','120']){await page.selectOption('#size',size);assert.equal(await page.locator('.pair svg').first().evaluate(e=>e.getBoundingClientRect().width),Number(size));}
 await page.selectOption('#origin','new');assert.equal(await page.locator('.card').count(),8);await page.selectOption('#origin','old');assert.equal(await page.locator('.card').count(),24);await page.fill('#search','Rangifer');assert.equal(await page.locator('.card').count(),1);
 await page.selectOption('#view','silhouette');assert.equal(await page.locator('body.silhouette').count(),1);
 await page.evaluate(()=>localStorage.setItem('atlas-lab-sentinel','unchanged'));const before=await page.evaluate(()=>JSON.stringify(localStorage));await page.reload();assert.equal(await page.evaluate(()=>JSON.stringify(localStorage)),before);
 // Expose closure-local renderers only in the disposable test response, never in production.
 await page.route('**/js/app.js*',async route=>{const response=await route.fetch();const body=(await response.text()).replace('render();\n})();','globalThis.__ATLAS_TEST__={state,renderSexComparison,getSpriteMarkup};\nrender();\n})();');await route.fulfill({response,body});});
 await page.goto(origin+'/index.html');await page.waitForFunction(()=>!!globalThis.__ATLAS_TEST__);
 const output=await page.evaluate(()=>{
 const {state,renderSexComparison,getSpriteMarkup}=globalThis.__ATLAS_TEST__;const id='af_leon';state.sexSeen[id]={male:true,female:true};
 return {comparison:renderSexComparison(id),male:getSpriteMarkup(id,'normal','male'),female:getSpriteMarkup(id,'normal','female')};});
 assert.ok(output.comparison.includes(output.male));assert.ok(output.comparison.includes(output.female));
 console.log('checking service worker');await page.evaluate(async()=>{await Promise.race([navigator.serviceWorker.ready,new Promise((_,reject)=>setTimeout(()=>reject(Error('SW ready timeout')),15000))]);});await page.reload();await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await page.unroute('**/js/app.js*');await page.context().setOffline(true);await page.reload();await page.waitForFunction(()=>document.getElementById('panel').children.length>0);
 assert.equal(await page.title(),'El Gran Atlas v3.19.6 · Campo y Cuaderno');assert.deepEqual(errors,[]);
 console.log('PASS: 64 SVG/XML/bounds; controls 56/80/120; 24+8 filters; lab storage isolation; game/journal; offline reload; no JS errors.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
