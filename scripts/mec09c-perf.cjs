'use strict';
// MEC-09C · Rendimiento de la interfaz con partidas reales (nueva, intermedia, avanzada y final de MEC-09B).
// Mide inicio, recuperación offline (8 h), cambio de pestaña (mediana de 5), Bestiario (cambio de
// página), Inventario, Sociedad y logros, DOM, memoria JS e ilustraciones cargadas. No toca el motor.
// Uso: node scripts/mec09c-perf.cjs [ETIQUETA] → docs/mec09c/rendimiento-ETIQUETA.json
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT||'/opt/npm-tools/node_modules/playwright');
const {serve,TABS,SAVES}=require('./mec09c-capture.cjs');
const ROOT=path.join(__dirname,'..'),KEY='gran_atlas_v05';
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};
async function run(label='despues'){
 const srv=await serve(),url='http://127.0.0.1:'+srv.address().port+'/index.html';
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox','--no-proxy-server','--enable-precise-memory-info']});
 const out=[];
 for(const [sid,name,file] of SAVES)for(const offline of [false,true]){
  if(offline&&!file)continue;
  let raw=file?fs.readFileSync(path.join(ROOT,'docs','mec09c','saves',file),'utf8'):null;
  // Reloj fijo (como en las capturas); la partida se guardó hace 1 min o hace 8 h (recuperación offline real).
  const NOW=Date.UTC(2027,9,30,15);if(raw){const s=JSON.parse(raw);s.lastTick=NOW-(offline?8*3600e3:60e3);raw=JSON.stringify(s);}
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  await ctx.addInitScript(([k,v,now])=>{if(!sessionStorage.getItem('p9c')){localStorage.clear();if(v)localStorage.setItem(k,v);sessionStorage.setItem('p9c','1');}
   const D=Date,start=D.now();globalThis.Date=class extends D{constructor(...a){super(...(a.length?a:[now+(D.now()-start)]));}static now(){return now+(D.now()-start);}};},[KEY,raw,NOW]);
  const page=await ctx.newPage();const t0=Date.now();await page.goto(url,{waitUntil:'load'});
  await page.waitForFunction(()=>document.querySelector('main#panel')?.children.length>0,null,{timeout:120000});const startup=Date.now()-t0;
  const row={save:sid,saveName:name,offline8h:offline,startupMs:startup,tabs:{}};
  if(!offline){
   for(const [tab] of TABS){const times=[];let dom=0;
    for(let i=0;i<5;i++){await page.click('.mobile-dock [data-tab="field"]');await page.waitForTimeout(40);
     const t=await page.evaluate(tb=>new Promise(r=>{const t=performance.now();document.querySelector(`.mobile-dock [data-tab="${tb}"]`).click();requestAnimationFrame(()=>requestAnimationFrame(()=>r(performance.now()-t)));}),tab);times.push(Math.round(t));}
    dom=await page.evaluate(()=>document.getElementsByTagName('*').length);row.tabs[tab]={switchMedianMs:med(times),dom};}
   await page.click('.mobile-dock [data-tab="bestiary"]');await page.waitForTimeout(200);
   row.bestiaryPageMs=await page.evaluate(()=>new Promise(r=>{const b=[...document.querySelectorAll('#panel button')].find(x=>/^(→|Siguiente)/.test(x.textContent.trim())||x.getAttribute('aria-label')?.includes('iguiente'));if(!b)return r(null);const t=performance.now();b.click();requestAnimationFrame(()=>requestAnimationFrame(()=>r(Math.round(performance.now()-t))));}));
   row.bestiaryCards=await page.evaluate(()=>document.querySelectorAll('#panel [class*=b26-card]').length);
   await page.click('.mobile-dock [data-tab="society"]');await page.waitForTimeout(150);
   row.achievementsMs=await page.evaluate(()=>new Promise(r=>{const b=document.querySelector('[data-action="society-tab"][data-id="achievements"]');if(!b)return r(null);const t=performance.now();b.click();requestAnimationFrame(()=>requestAnimationFrame(()=>r(Math.round(performance.now()-t))));}));
   row.achievementsDom=await page.evaluate(()=>document.querySelector('#panel').getElementsByTagName('*').length);
   // Actualizaciones visuales en reposo (5 s): el panel no se reconstruye por cada contador.
   row.idle=await page.evaluate(()=>new Promise(res=>{const P=document.querySelector('#panel');let rebuilt=0,muts=0;const o=new MutationObserver(m=>{muts+=m.length;for(const x of m)if(x.target===P&&x.type==='childList')rebuilt++;});o.observe(P,{childList:true,subtree:true,characterData:true});setTimeout(()=>{o.disconnect();res({panelRebuilds:rebuilt,mutations:muts});},5000);}));
   // Acción de campo: una búsqueda manual actualiza el panel una sola vez.
   await page.click('.mobile-dock [data-tab="field"]');await page.waitForTimeout(150);
   row.fieldSearch=await page.evaluate(()=>new Promise(res=>{const b=[...document.querySelectorAll('#panel button')].find(x=>/Observar fauna/.test(x.textContent));if(!b)return res(null);const P=document.querySelector('#panel');let rebuilt=0;const o=new MutationObserver(m=>{for(const x of m)if(x.target===P&&x.type==='childList')rebuilt++;});o.observe(P,{childList:true});const t=performance.now();b.click();requestAnimationFrame(()=>requestAnimationFrame(()=>{o.disconnect();res({ms:Math.round(performance.now()-t),panelRebuilds:rebuilt});}));}));
  }
  await page.waitForTimeout(1500);
  // Estado guardado tras la recuperación: la marca de tiempo avanza y los avistamientos offline quedan registrados.
  row.saved=await page.evaluate(()=>{try{const s=JSON.parse(localStorage.getItem('gran_atlas_v05'));return {lastTick:s.lastTick,sightings:Object.values(s.sightings||{}).reduce((a,b)=>a+b,0)};}catch{return null;}});
  row.heapMB=await page.evaluate(()=>performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null);
  row.images=await page.evaluate(()=>{const im=[...document.images];return {total:im.length,loaded:im.filter(i=>i.complete&&i.naturalWidth>0).length,lazy:im.filter(i=>i.loading==='lazy').length};});
  out.push(row);await ctx.close();
 }
 await browser.close();srv.close();
 fs.writeFileSync(path.join(ROOT,'docs','mec09c','rendimiento-'+label+'.json'),JSON.stringify(out,null,1));return out;
}
module.exports={run};
if(require.main===module)run(process.argv[2]||'despues').then(r=>{for(const x of r)console.log(x.save,x.offline8h?'offline8h':'',x.startupMs,'ms',x.heapMB,'MB',x.bestiaryPageMs??'',x.achievementsMs??'',JSON.stringify(x.idle||''),JSON.stringify(x.fieldSearch||''));}).catch(e=>{console.error(e);process.exit(1);});
