/* Real application instances, opaque-origin sandbox + in-memory storage.
 * No real save, service worker, export, backup or periodic tick is used. */
(async()=>{
 'use strict';
 const frames=['before','after'].map(id=>document.getElementById(id)),status=document.getElementById('status');
 const bridge=`
 function developmentLabFixture(scenario){
  state=initialState();state.collectionId='development-lab-memory-only';state.helpers=0;state.money=10000;state.knowledge=10000;state.prestige=200;state.lastTick=Date.now();state.researchBranch='expediciones';
  if(scenario!=='shipyard-locked'){state.purchases.capacitacion_1=1;state.purchases.astillero=1;state.upgrades.shipyard=1;}
  let route=scenario==='route-locked'?'atlantic_survey':scenario==='fleet-empty'?'north':'coast',project='astillero';tab='expeditions';
  if(scenario==='fleet-empty'){state.upgrades.routeTier=1;state.purchases.rutas_1=1;}
  if(scenario==='fleet-full')for(let i=0;i<maxVoyages();i++)sail('coast');
  if(scenario==='underway')sail('coast');
  if(scenario==='historical')state.voyages=[{id:7,type:'north',endAt:Date.now()+60000}];
  if(['returned','loot','no-loot'].includes(scenario)){sail('coast');const job=state.voyages[0];job.endAt=Date.now()-1;if('startedAt'in job)job.startedAt=job.endAt-voyageDuration(VOYAGES[0].seconds)*1000;const savedRandom=Math.random;try{Math.random=()=>scenario==='no-loot'?.99:0;processVoyages(Date.now());}finally{Math.random=savedRandom;}}
  if(scenario.startsWith('research-')||scenario==='reqall'){tab='research';if(scenario==='research-locked'){project='rutas_2';}if(scenario==='research-ready'){project='rutas_1';}if(scenario==='research-repeat'){state.researchBranch='exploracion';project='novato';state.purchases.novato=3;state.helpers=3;}if(scenario==='research-done'){project='astillero';}if(scenario==='reqall'){state.researchBranch='exploracion';project='grupos_auto_1';state.purchases.grupos_3=1;}}
  if(typeof developmentUI3280!=='undefined'){developmentUI3280.route=route;developmentUI3280.filter='all';developmentUI3280.projects={[state.researchBranch]:project};developmentUI3280.folds={};if(['returned','loot','no-loot'].includes(scenario)){const r=voyageReceipt3280(0);if(r)developmentUI3280.folds[r.key]=true;}}
  render();if(['returned','loot','no-loot'].includes(scenario))requestAnimationFrame(()=>{document.querySelector('.er28-history')?.scrollIntoView({block:'start'});});
 }
 window.addEventListener('message',e=>{if(e.source!==parent)return;if(e.data?.type==='atlas-development-lab')developmentLabFixture(e.data.scenario);if(e.data?.type==='atlas-development-lab-command'){tab=e.data.command==='research'?'research':'expeditions';render();}});
 developmentLabFixture('shipyard-locked');parent.postMessage({type:'atlas-development-lab-ready'},'*');
 `;
 try{
  const [html,before,after]=await Promise.all(['index.html','js/lab/expeditions-app-before-v3270.js','js/app.js'].map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return r.text();}));
  const prefix=`<base href="${new URL('./',location.href).href}"><script>Object.defineProperty(window,'localStorage',{value:(()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}})()});window.setInterval=()=>0;Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.resolve()}});<\/script>`;
  // Fetch through the parent worker, then inline the exact production files.
  // Opaque-origin frames cannot rely on the parent's worker when offline.
  const resources=[...new Set([...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m=>m[1]).filter(url=>!/^js\/(?:app\.js|save-manager|update-client)/.test(url)))];
  const loaded=new Map(await Promise.all(resources.map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return [url,await r.text()];})));
  const scriptTag=source=>'<script>'+source.replace(/<\/script/gi,'<\\/script')+'<\/script>';
  for(const [i,source]of [before,after].entries()){
   let page=html.replace('<head>','<head>'+prefix).replace(/<link rel="manifest"[^>]*>/,'');
   page=page.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,url)=>i===0&&url.includes('expeditions-research-v3280')?'':'<style>'+loaded.get(url)+'</style>');
   const script=source.replace(/\n\}\)\(\);\s*$/,'\n'+bridge+'\n})();');
   if(script===source)throw new Error('No se pudo aislar el motor');
   page=page.replace(/<script src="([^"]+)"[^>]*><\/script>/g,(_,url)=>{
    if(/^js\/(?:save-manager|update-client)/.test(url)||i===0&&url.includes('expeditions-research-ui-v3280'))return '';
    return scriptTag(url.startsWith('js/app.js')?script:loaded.get(url));
   });
   if(i===0)page=page.replace('<title>El Gran Atlas v3.28.0 — Expediciones del naturalista</title>','<title>El Gran Atlas v3.27.0 — Museo de Historia Natural</title>').replace('v3.28.0 · Expediciones del naturalista','v3.27.0 · Museo de Historia Natural').replaceAll('3.28.0','3.27.0');
   frames[i].srcdoc=page;
  }
 }catch(e){status.textContent='No se pudo abrir el laboratorio: '+e.message;return;}
 function apply(){const scenario=document.getElementById('scenario').value;for(const frame of frames)frame.contentWindow.postMessage({type:'atlas-development-lab',scenario},'*');}
 window.addEventListener('message',e=>{if(frames.some(f=>f.contentWindow===e.source)&&e.data?.type==='atlas-development-lab-ready'){status.textContent='Mesas e institutos aislados · cambios temporales · reglas de producción';apply();}});
 document.getElementById('scenario').addEventListener('change',apply);
 for(const [id,command]of [['showExpeditions','expeditions'],['showResearch','research']])document.getElementById(id).addEventListener('click',()=>{for(const frame of frames)frame.contentWindow.postMessage({type:'atlas-development-lab-command',command},'*');});
 document.getElementById('size').addEventListener('change',e=>{const[w,h]=e.target.value.split(',');for(const f of frames){f.style.width=w+'px';f.style.height=h+'px';}});
 document.getElementById('comparison').addEventListener('change',e=>document.body.classList.toggle('compare',e.target.value==='both'));
})();
