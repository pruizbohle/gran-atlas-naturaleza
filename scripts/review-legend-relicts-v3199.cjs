/* Render production plates next to the controlled 3.19.8 baseline. */
'use strict';
const fs=require('node:fs'),vm=require('node:vm'),cp=require('node:child_process'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const LEGEND=require('../www/js/legendary-art-v3197.js'),RELICT=require('../www/js/relict-art-v3199.js');
const baseline='bacffc91dc39fecfbba850f0d4bcfc10ba36398f';
const old=path=>cp.execFileSync('git',['show',baseline+':'+path],{encoding:'utf8',maxBuffer:8e6});
const oldContext=vm.createContext({});vm.runInContext(old('www/js/legendary-art-v3197.js'),oldContext);
const game=old('www/js/app.js'),data=game.slice(game.indexOf('const MUSEUM_RELICTS='),game.indexOf('const MUSEUM_RELICT_SETS=')),draw=game.slice(game.indexOf('function museumCardArt('),game.indexOf('function museumOtherExhibits('));
vm.runInContext(data+'\n'+draw+'\noldMuseumArt=museumCardArt;',oldContext);
const out=process.env.ATLAS_ARTIFACT_DIR||'/tmp/atlas-legend-review';fs.mkdirSync(out,{recursive:true});
const rows=[...LEGEND.ids.map(id=>({id,group:'Legendario',before:oldContext.ATLAS_LEGENDARY_ART.render(id),after:LEGEND.render(id)})),...RELICT.ids.map(id=>({id,group:'Relicto',before:oldContext.oldMuseumArt('',id),after:RELICT.render(id)}))];
(async()=>{const browser=await chromium.launch({executablePath:process.env.ATLAS_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});try{const page=await browser.newPage({viewport:{width:1150,height:950}});
const html=size=>`<html><head><style>*{box-sizing:border-box}body{background:#ece1c9;color:#3c4136;font:14px Georgia;margin:20px}h1{font-size:22px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}article{text-align:center;background:#f8f0dc;border:1px solid #c1b28f;padding:10px;border-radius:6px}.pair{display:flex;justify-content:center;gap:15px}.plate{width:${size}px;height:${size}px}.plate svg{width:100%;height:100%}.caption{font:11px system-ui;color:#77765d;margin:4px}.dark article{background:#273d31;color:#eee1c4}.dark .caption{color:#d1c8a9}.silhouette .plate svg *{fill:#333d31!important;stroke:#333d31!important}</style></head><body><h1>3.19.8 → 3.19.9 · Legendarios y relictos · ${size} px</h1><main>${rows.map(row=>`<article><p>${row.group} · ${row.id}</p><div class="pair"><div><div class="plate">${row.before}</div><p class="caption">Antes</p></div><div><div class="plate after">${row.after}</div><p class="caption">Después</p></div></div></article>`).join('')}</main></body></html>`;
for(const size of [56,80,120]){await page.setContent(html(size));await page.screenshot({path:out+'/comparison-'+size+'.png',fullPage:true});
 const results=await page.locator('.after svg').evaluateAll(xs=>xs.map(x=>{const b=x.getBBox(),xml=new DOMParser().parseFromString(x.outerHTML,'image/svg+xml');return{id:x.dataset.legendaryId||x.dataset.relictArt,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,valid:!xml.querySelector('parsererror'),duplicateIds:[...x.querySelectorAll('[id]')].map(n=>n.id).length!==new Set([...x.querySelectorAll('[id]')].map(n=>n.id)).size};}));
 for(const r of results){assert.ok(r.valid,JSON.stringify(r));assert.ok(!r.duplicateIds,r.id);assert.ok(r.x>=0&&r.y>=0&&r.right<=100&&r.bottom<=100,JSON.stringify(r));}
 for(const row of rows)assert.notEqual(row.before,row.after,row.id);
}
await page.locator('body').evaluate(e=>e.className='dark');await page.screenshot({path:out+'/comparison-dark.png',fullPage:true});await page.locator('body').evaluate(e=>e.className='silhouette');await page.screenshot({path:out+'/comparison-silhouette.png',fullPage:true});
const report={baseline,legendary:LEGEND.ids,relicts:RELICT.ids,sizes:[56,80,120],allSVGsParse:true,allGeometryInsideViewport:true,uniqueSVGIds:true};fs.writeFileSync(out+'/legend-relicts-report.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
