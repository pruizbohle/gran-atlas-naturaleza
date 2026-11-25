/* Real application instances, opaque-origin sandbox + in-memory storage.
 * No real save, service worker, export, backup or periodic tick is used. */
(async()=>{
 'use strict';
 const frames=['before','after'].map(id=>document.getElementById(id)),status=document.getElementById('status');
 const bridge=`
 let bestiaryLabSelected=null;
 function bestiaryLabFixture(scenario){
  globalThis.AtlasBestiaryUI?.close({restore:false});state=initialState();state.helpers=0;state.money=100000;state.knowledge=100000;state.lastTick=Date.now();
  const id=scenario==='sex'?'reno':scenario==='locked'?'na_esp_panthera_onca':'zorro_rojo';bestiaryLabSelected=id;
  const st={unknown:0,observed:0,name:1,latin:2,intermediate:3,complete:5,published:5,variants:3,sex:3,distribution:3,unlocked:3,locked:3}[scenario]??0;
  if(scenario!=='unknown'){state.discovered[id]=true;state.stages[id]=st;state.sightings[id]=st?145:5;state.feedObs[id]=st>=3?7:0;}
  if(scenario==='published')state.published[id]=true;
  if(scenario==='variants'){state.specialFound[id]={};for(const v of configuredSpecials(SPECIES[id]))if(v!=='Legendario')state.specialFound[id][v]=true;state.specialSeen[id]=5;}
  if(scenario==='sex')state.sexSeen[id]={male:true,female:false};
  if(scenario==='unlocked'){const r=REGIONS.find(r=>r.id!==state.currentRegion&&r.species.includes(id));if(r)state.regionUnlocked[r.id]=true;}
  if(typeof bestiaryFilters3260!=='undefined')bestiaryFilters3260=null;
  bestiaryPage=0;tab='bestiary';
  if(typeof changeBestiaryFilter3260==='function'){
   if(scenario!=='unknown'){if(st>=1)changeBestiaryFilter3260('query',st>=2?visibleLatin(id):visibleName(id));else changeBestiaryFilter3260('progress','discovered');}
  }else if(scenario!=='unknown'){
   const ordered=Object.keys(SPECIES).sort((a,b)=>SPECIES[a].name.localeCompare(SPECIES[b].name,'es'));bestiaryPage=Math.floor(ordered.indexOf(id)/32);
  }
  render();
 }
 window.addEventListener('message',e=>{if(e.source!==parent)return;if(e.data?.type==='atlas-bestiary-lab')bestiaryLabFixture(e.data.scenario);if(e.data?.type==='atlas-bestiary-lab-command'){if(e.data.command==='close')globalThis.AtlasBestiaryUI?.close();else if(e.data.command==='open'&&typeof openBestiaryModal3260==='function')openBestiaryModal3260(Object.keys(SPECIES).indexOf(bestiaryLabSelected));}});
 bestiaryLabFixture('unknown');parent.postMessage({type:'atlas-bestiary-lab-ready'},'*');
 `;
 try{
  const [html,before,after]=await Promise.all(['index.html','js/lab/bestiary-app-before-v3250.js','js/app.js'].map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return r.text();}));
  const prefix=`<base href="${new URL('./',location.href).href}"><script>Object.defineProperty(window,'localStorage',{value:(()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}})()});window.setInterval=()=>0;Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.resolve()}});<\/script>`;
  // Fetch through the parent worker, then inline the exact production files.
  // Opaque-origin frames cannot rely on the parent's worker when offline.
  const resources=[...new Set([...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m=>m[1]).filter(url=>!/^js\/(?:app\.js|save-manager|update-client)/.test(url)))];
  const loaded=new Map(await Promise.all(resources.map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return [url,await r.text()];})));
  const scriptTag=source=>'<script>'+source.replace(/<\/script/gi,'<\\/script')+'<\/script>';
  for(const [i,source]of [before,after].entries()){
   let page=html.replace('<head>','<head>'+prefix).replace(/<link rel="manifest"[^>]*>/,'');
   page=page.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,url)=>i===0&&url.includes('bestiary-v3260')?'':'<style>'+loaded.get(url)+'</style>');
   const script=source.replace(/\n\}\)\(\);\s*$/,'\n'+bridge+'\n})();');
   if(script===source)throw new Error('No se pudo aislar el motor');
   page=page.replace(/<script src="([^"]+)"[^>]*><\/script>/g,(_,url)=>{
    if(/^js\/(?:save-manager|update-client)/.test(url)||i===0&&url.includes('bestiary-ui-v3260'))return '';
    return scriptTag(url.startsWith('js/app.js')?script:loaded.get(url));
   });
   if(i===0)page=page.replaceAll('3.26.0','3.25.0').replaceAll('Bestiario del naturalista','Cuaderno del naturalista');
   frames[i].srcdoc=page;
  }
 }catch(e){status.textContent='No se pudo abrir el laboratorio: '+e.message;return;}
 function apply(){const scenario=document.getElementById('scenario').value;for(const frame of frames)frame.contentWindow.postMessage({type:'atlas-bestiary-lab',scenario},'*');}
 window.addEventListener('message',e=>{if(frames.some(f=>f.contentWindow===e.source)&&e.data?.type==='atlas-bestiary-lab-ready'){status.textContent='Catálogos aislados · cambios temporales · reglas de producción';apply();}});
 document.getElementById('scenario').addEventListener('change',apply);
 for(const [id,command]of [['openModal','open'],['closeModal','close']])document.getElementById(id).addEventListener('click',()=>{for(const frame of frames)frame.contentWindow.postMessage({type:'atlas-bestiary-lab-command',command},'*');});
 document.getElementById('size').addEventListener('change',e=>{const[w,h]=e.target.value.split(',');for(const f of frames){f.style.width=w+'px';f.style.height=h+'px';}});
 document.getElementById('comparison').addEventListener('change',e=>document.body.classList.toggle('compare',e.target.value==='both'));
})();
