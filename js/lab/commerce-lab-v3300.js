(async()=>{
'use strict';
const frame=document.getElementById('preview'),status=document.getElementById('status');
const bridge="\n function commerceLabFixture(scenario){\n  state=initialState();state.collectionId='commerce-lab-memory-only';state.money=scenario==='poor'?0:10000;state.knowledge=10000;state.prestige=scenario==='early'?0:300;state.upgrades.shipyard=scenario==='locked'?0:1;normalizeCommerce3300(state);migrateProgression3300(state);tab='expeditions';navigationTab3300='commerce';\n  for(const id of Object.keys(ITEMS))state.inventory[id]=20;\n  if(scenario==='underway')startTrade3300('ocean_trade');\n  if(scenario==='returned'){startTrade3300('ocean_trade');const j=state.commerce.jobs[0];j.startedAt-=86400001;j.endAt-=86400001;settleTrade3300();}\n  if(scenario==='workshop'){tab='objects';state.inventoryView='taller';}\n  if(scenario==='atlas'){tab='atlas';state.atlasView='Ocean\u00eda';state.upgrades.oceaniaUnlocked=1;}\n  render();\n }\n window.addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='commerce-lab')commerceLabFixture(e.data.scenario);});\n commerceLabFixture('locked');parent.postMessage({type:'commerce-lab-ready'},'*');\n";
try{
const [html,source]=await Promise.all(['index.html','js/app.js'].map(async url=>{const r=await fetch(url);if(!r.ok)throw Error(url+': '+r.status);return r.text();}));
 const prefix=`<base href="${new URL('./',location.href).href}"><script>Object.defineProperty(window,'localStorage',{value:(()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}})()});window.setInterval=()=>0;Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.resolve()}});<\/script>`;
  // Fetch through the parent worker, then inline the exact production files.
  // Opaque-origin frames cannot rely on the parent's worker when offline.
  const resources=[...new Set([...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m=>m[1]).filter(url=>!/^js\/(?:app\.js|save-manager|update-client)/.test(url)))];
  const loaded=new Map(await Promise.all(resources.map(async url=>{const r=await fetch(url);if(!r.ok)throw new Error(url+': '+r.status);return [url,await r.text()];})));
  const scriptTag=source=>'<script>'+source.replace(/<\/script/gi,'<\\/script')+'<\/script>';

 let page=html.replace('<head>','<head>'+prefix).replace(/<link rel="manifest"[^>]*>/,'');
 page=page.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,url)=>'<style>'+loaded.get(url)+'</style>');
 const script=source.replace(/\n\}\)\(\);\s*$/,'\n'+bridge+'\n})();');
 if(script===source)throw Error('No se pudo aislar el motor');
 page=page.replace(/<script src="([^"]+)"[^>]*><\/script>/g,(_,url)=>{const path=url.split('?')[0];return path==='js/app.js'?scriptTag(script):/save-manager|update-client/.test(path)?'':scriptTag(loaded.get(url)||'');});
 window.addEventListener('message',e=>{if(e.source===frame.contentWindow&&e.data?.type==='commerce-lab-ready'){status.textContent='Instancia aislada lista · sin acceso a partidas';frame.contentWindow.postMessage({type:'commerce-lab',scenario:document.getElementById('scenario').value},'*');}});
 document.getElementById('scenario').addEventListener('change',e=>frame.contentWindow.postMessage({type:'commerce-lab',scenario:e.target.value},'*'));
 frame.srcdoc=page;
}catch(error){status.textContent='Error: '+error.message;console.error(error);}
})();
