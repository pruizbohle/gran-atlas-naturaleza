/* Real application instances, opaque-origin sandbox + in-memory storage.
 * No real save, service worker, export, backup or periodic tick is used. */
(async()=>{
 'use strict';
 const frames=['before','after'].map(id=>document.getElementById(id)),status=document.getElementById('status');
 const bridge=`
 function museumLabFixture(scenario){
  globalThis.AtlasMuseumUI?.close({restore:false});state=initialState();state.helpers=0;state.money=10000;state.knowledge=10000;state.prestige=10;state.lastTick=Date.now();
  for(const r of REGIONS)state.regionUnlocked[r.id]=true;
  for(const id of ['zorro_rojo','reno','ciervo_rojo']){state.discovered[id]=true;state.stages[id]=5;state.published[id]=true;state.sightings[id]=300;}
  const exhibit=scenario==='full'?['zorro_rojo','reno','ciervo_rojo']:scenario==='empty'||scenario==='samples'?[]:['zorro_rojo'];
  for(const id of exhibit)state.museum.exhibits[id]=true;
  state.museumView='exhibitions';
  if(scenario==='samples')state.museumView='samples';
  if(['dig-active','dig-ready','fossil-pending','fossil-mounted','bonuses'].includes(scenario))state.museumView='fossils';
  if(scenario==='dig-active'||scenario==='dig-ready'){state.museum.excavations=[{id:1,site:MUSEUM_DIG_SITES[0].id,endAt:Date.now()+(scenario==='dig-ready'?-1000:90000)}];state.museum.excavationSeq=1;}
  if(scenario==='fossil-mounted'||scenario==='bonuses')state.museum.collections.trex_mount=true;
  if(scenario==='relict-leads'||scenario==='relict-owned'){state.museumView='relicts';if(scenario==='relict-owned')state.museum.relicts.coelacanth_indic=true;else state.museum.relictLeads.coelacanth_indic=2;}
  if(scenario==='artifact'){state.museumView='artifacts';state.museum.collections.carta_historica=true;}
  if(scenario==='bonuses'){state.museum.collections.triceratops_mount=true;state.museum.curationPoints=12;}
  if(typeof museumUI3270!=='undefined'){museumUI3270.folds={curation:scenario==='bonuses'};museumUI3270.filter='all';museumUI3270.sort='income-desc';museumUI3270.samplePage=0;}
  tab='museum';render();
 }
 window.addEventListener('message',e=>{if(e.source!==parent)return;if(e.data?.type==='atlas-museum-lab')museumLabFixture(e.data.scenario);if(e.data?.type==='atlas-museum-lab-command'){if(e.data.command==='close')globalThis.AtlasMuseumUI?.close();else if(e.data.command==='open'&&typeof museumAction3270==='function'){const source=document.querySelector('.m27-plate[data-action="m27-open"]');if(source)museumAction3270('m27-open',source.dataset.m27Token,null,source);}}});
 museumLabFixture('empty');parent.postMessage({type:'atlas-museum-lab-ready'},'*');
 `;
 try{
  const [html,before,after]=await Promise.all(['index.html','js/lab/museum-app-before-v3260.js','js/app.js'].map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return r.text();}));
  const prefix=`<base href="${new URL('./',location.href).href}"><script>Object.defineProperty(window,'localStorage',{value:(()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}})()});window.setInterval=()=>0;Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.resolve()}});<\/script>`;
  // Fetch through the parent worker, then inline the exact production files.
  // Opaque-origin frames cannot rely on the parent's worker when offline.
  const resources=[...new Set([...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m=>m[1]).filter(url=>!/^js\/(?:app\.js|save-manager|update-client)/.test(url)))];
  const loaded=new Map(await Promise.all(resources.map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return [url,await r.text()];})));
  const scriptTag=source=>'<script>'+source.replace(/<\/script/gi,'<\\/script')+'<\/script>';
  for(const [i,source]of [before,after].entries()){
   let page=html.replace('<head>','<head>'+prefix).replace(/<link rel="manifest"[^>]*>/,'');
   page=page.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,url)=>i===0&&url.includes('museum-v3270')?'':'<style>'+loaded.get(url)+'</style>');
   const script=source.replace(/\n\}\)\(\);\s*$/,'\n'+bridge+'\n})();');
   if(script===source)throw new Error('No se pudo aislar el motor');
   page=page.replace(/<script src="([^"]+)"[^>]*><\/script>/g,(_,url)=>{
    if(/^js\/(?:save-manager|update-client)/.test(url)||i===0&&url.includes('museum-ui-v3270'))return '';
    return scriptTag(url.startsWith('js/app.js')?script:loaded.get(url));
   });
   if(i===0)page=page.replace('<title>El Gran Atlas v3.27.0 — Museo de Historia Natural</title>','<title>El Gran Atlas v3.26.0 — Bestiario del naturalista</title>').replace('v3.27.0 · Museo de Historia Natural','v3.26.0 · Bestiario del naturalista').replaceAll('3.27.0','3.26.0');
   frames[i].srcdoc=page;
  }
 }catch(e){status.textContent='No se pudo abrir el laboratorio: '+e.message;return;}
 function apply(){const scenario=document.getElementById('scenario').value;for(const frame of frames)frame.contentWindow.postMessage({type:'atlas-museum-lab',scenario},'*');}
 window.addEventListener('message',e=>{if(frames.some(f=>f.contentWindow===e.source)&&e.data?.type==='atlas-museum-lab-ready'){status.textContent='Museos aislados · cambios temporales · reglas de producción';apply();}});
 document.getElementById('scenario').addEventListener('change',apply);
 for(const [id,command]of [['openModal','open'],['closeModal','close']])document.getElementById(id).addEventListener('click',()=>{for(const frame of frames)frame.contentWindow.postMessage({type:'atlas-museum-lab-command',command},'*');});
 document.getElementById('size').addEventListener('change',e=>{const[w,h]=e.target.value.split(',');for(const f of frames){f.style.width=w+'px';f.style.height=h+'px';}});
 document.getElementById('comparison').addEventListener('change',e=>document.body.classList.toggle('compare',e.target.value==='both'));
})();
