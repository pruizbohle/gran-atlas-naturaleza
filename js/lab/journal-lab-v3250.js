/* Real application instances, opaque-origin sandbox + in-memory storage.
 * No real save, service worker, export, backup or periodic tick is used. */
(async()=>{
 'use strict';
 const frames=['before','after'].map(id=>document.getElementById(id)),status=document.getElementById('status');
 const bridge=`
 function journalLabFixture(scenario,requested){
  state=initialState();state.helpers=0;state.money=100000;state.knowledge=100000;state.lastTick=Date.now();
  const continent={asia:'Asia',africa:'África',northamerica:'Norteamérica'}[requested];
  const region=continent?REGIONS.find(r=>r.continent===continent):requested==='small'?[...REGIONS].sort((a,b)=>a.species.length-b.species.length)[0]:REGIONS.find(r=>r.id===requested)||REGIONS[0];
  state.currentRegion=region.id;state.habitat=region.habitats[0];state.regionUnlocked[region.id]=true;
  const id=(scenario==='sex'?region.species.find(s=>SEXUAL_DIMORPHISM[s]):scenario==='variants'?region.species.find(s=>configuredSpecials(SPECIES[s]).length):null)||region.species[0];
  state.selectedJournal=id;const st=/^[1-5]$/.test(scenario)?Number(scenario):['published','variants'].includes(scenario)?5:scenario==='sex'?3:scenario==='pending'?3:scenario==='ready'?0:0;
  if(scenario!=='unknown'){state.discovered[id]=true;state.stages[id]=st;state.sightings[id]=scenario==='ready'?10:scenario==='pending'?110:600;}
  if(scenario==='published')state.published[id]=true;
  if(scenario==='sex')state.sexSeen[id]={male:true,female:false};
  if(scenario==='variants'){state.specialFound[id]={};for(const v of configuredSpecials(SPECIES[id]))if(v!=='Legendario')state.specialFound[id][v]=true;state.specialSeen[id]=5;}
  if(scenario==='pending'){state.money=0;state.knowledge=0;}
  tab='journal';journalRailQuery='';journalSortMode='catalog';render();
 }
 window.addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='atlas-journal-lab')journalLabFixture(e.data.scenario,e.data.region);});
 journalLabFixture('unknown','HX-01-09');parent.postMessage({type:'atlas-journal-lab-ready'},'*');
 `;
 try{
  const [html,before,after]=await Promise.all(['index.html','js/lab/journal-app-before-v3240.js','js/app.js'].map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return r.text();}));
  const prefix=`<base href="${new URL('./',location.href).href}"><script>Object.defineProperty(window,'localStorage',{value:(()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}})()});window.setInterval=()=>0;Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.resolve()}});<\/script>`;
  // Fetch through the parent worker, then inline the exact production files.
  // Opaque-origin frames cannot rely on the parent's worker when offline.
  const resources=[...new Set([...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m=>m[1]).filter(url=>!/^js\/(?:app\.js|save-manager|update-client)/.test(url)))];
  const loaded=new Map(await Promise.all(resources.map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return [url,await r.text()];})));
  const scriptTag=source=>'<script>'+source.replace(/<\/script/gi,'<\\/script')+'<\/script>';
  for(const [i,source]of [before,after].entries()){
   let page=html.replace('<head>','<head>'+prefix).replace(/<link rel="manifest"[^>]*>/,'');
   page=page.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,url)=>i===0&&url.includes('journal-v3250')?'':'<style>'+loaded.get(url)+'</style>');
   const script=source.replace(/\n\}\)\(\);\s*$/,'\n'+bridge+'\n})();');
   if(script===source)throw new Error('No se pudo aislar el motor');
   page=page.replace(/<script src="([^"]+)"[^>]*><\/script>/g,(_,url)=>{
    if(/^js\/(?:save-manager|update-client)/.test(url)||i===0&&url.includes('journal-ui-v3250'))return '';
    return scriptTag(url.startsWith('js/app.js')?script:loaded.get(url));
   });
   if(i===0)page=page.replaceAll('3.25.0','3.24.0').replaceAll('Cuaderno del naturalista','Estabilización global');
   frames[i].srcdoc=page;
  }
 }catch(e){status.textContent='No se pudo abrir el laboratorio: '+e.message;return;}
 function apply(){const scenario=document.getElementById('scenario').value,region=document.getElementById('region').value;for(const frame of frames)frame.contentWindow.postMessage({type:'atlas-journal-lab',scenario,region},'*');}
 window.addEventListener('message',e=>{if(frames.some(f=>f.contentWindow===e.source)&&e.data?.type==='atlas-journal-lab-ready'){status.textContent='Cuadernos aislados · cambios temporales · reglas de producción';apply();}});
 document.getElementById('scenario').addEventListener('change',apply);document.getElementById('region').addEventListener('change',apply);
 document.getElementById('size').addEventListener('change',e=>{const[w,h]=e.target.value.split(',');for(const f of frames){f.style.width=w+'px';f.style.height=h+'px';}});
 document.getElementById('comparison').addEventListener('change',e=>document.body.classList.toggle('compare',e.target.value==='both'));
})();
