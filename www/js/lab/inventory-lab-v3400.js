'use strict';
(async()=>{
const frame=document.getElementById('engine'),status=document.getElementById('status');let ready=false;
const artIds=['map_fragment','asia_map_piece','south_america_map_piece','oceania_map_piece','polar_map_piece','world_map'];
document.getElementById('artComparison').innerHTML=artIds.map(id=>'<figure>'+AtlasItemArt.renderItemArt(id)+'<span class="tiny">'+AtlasItemArt.renderItemArt(id)+'</span><figcaption>'+({map_fragment:'Fragmento genérico · ocre',asia_map_piece:'Asia · verde',south_america_map_piece:'Sudamérica · verde',oceania_map_piece:'Oceanía · verde',polar_map_piece:'Polos · verde',world_map:'Mapamundi'}[id])+'</figcaption></figure>').join('');
window.addEventListener('message',event=>{if(event.source!==frame.contentWindow)return;const data=event.data;if(data?.type==='inv3400-ready')ready=true;if(data?.type==='inv3400-confirm'){document.getElementById('confirmation').hidden=false;document.getElementById('confirmText').textContent=data.message;document.getElementById('confirmYes').focus();}if(data?.type==='inv3400-state'){window.InventoryLab3400=data;status.textContent=data.maps+'/6 mapas físicos · Mapamundi '+(data.world?'acreditado':'pendiente')+' · '+data.historical+' accesos históricos · '+data.receipts+' trueques · '+data.jobs+' viajes pendientes · '+data.scenario;}});
for(const id of ['confirmYes','confirmNo'])document.getElementById(id).onclick=()=>{document.getElementById('confirmation').hidden=true;frame.contentWindow.postMessage({type:'inv3400-answer',accepted:id==='confirmYes'},'*');};
document.getElementById('scenario').onchange=event=>{document.getElementById('confirmation').hidden=true;if(ready)frame.contentWindow.postMessage({type:'inv3400-scenario',scenario:event.target.value},'*');};
try{
const html=await(await fetch('index.html')).text(),source=await(await fetch('js/app.js')).text(),urls=[...new Set([...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m=>m[1]).filter(u=>!/^js\/(?:app\.js|save-manager|update-client)/.test(u)))],resources=new Map(await Promise.all(urls.map(async url=>{const response=await fetch(url);if(!response.ok)throw Error(url+':'+response.status);return[url,await response.text()];})));
const bridge=`
let labScenario='new',labPending=null,labApproved=false,labClock=Date.now();Date.now=()=>labClock;
const labInventoryAction=inventoryAction3400,labTradeAction=tradeAction3300;
inventoryAction3400=function(action,id){labPending={kind:'inventory',action,id};return labInventoryAction(action,id);};
tradeAction3300=function(action,id){labPending={kind:'trade',action,id};return labTradeAction(action,id);};
window.confirm=message=>{if(labApproved)return true;parent.postMessage({type:'inv3400-confirm',message},'*');return false;};
function labReport(){parent.postMessage({type:'inv3400-state',scenario:labScenario,maps:CARTOGRAPHY3400.filter(d=>(state.inventory[d.map]||0)>0).length,world:state.craftedItems.world_map===true,historical:Object.keys(state.cartography3400.historicalAccess).length,receipts:state.commerce.regionalReceipts?.length||0,jobs:state.commerce.jobs.length,inventory:state.inventory},'*');}
function labLoad(kind){
 labScenario=kind;labPending=null;labApproved=false;window.__labStorageFail=false;
 const s=initialState();s.collectionId='inventory-lab-'+kind;s.money=s.knowledge=100000;s.prestige=1000;s.upgrades.shipyard=1;
 if(['parts','world','regional','storage','underway'].includes(kind))for(const r of Object.values(CONTINENT_RULES3300))for(const id of r.items)s.craftedItems[id]=true;
 if(kind==='parts')for(const d of CARTOGRAPHY3400)s.inventory[d.piece]=d.quantity;
 if(['world','storage'].includes(kind))for(const d of CARTOGRAPHY3400)s.inventory[d.map]=1;
 if(kind==='legacy'){delete s.cartography3400;s.purchases.exploracion_profunda_1=s.purchases.mares_superficiales_1=1;s.upgrades.surfaceSeasUnlocked=s.upgrades.deepUnlocked=1;for(const r of Object.values(CONTINENT_RULES3300))for(const id of r.items)s.craftedItems[id]=true;}
 if(kind==='regional'){for(const d of REGIONAL_BARTERS3400)s.inventory[d.material]=250;s.regionUnlocked[REGIONS.find(r=>r.continent==='Asia').id]=true;}
 if(kind==='reserve'){s.inventory=supplyReserve3390(s);s.inventory.otter_whisker=1;}
 if(kind==='underway'){s.inventory.carved_wood=s.inventory.fossil_fragment=50;}
 AtlasSaveBridge.restoreGame(s);Object.assign(inventoryUI3400,{query:'',category:'all',owned:'all',use:'all',craft:'all',sort:'alpha',page:0,selected:null,filtersOpen:false});
 state.inventoryView='coleccionables';tab='objects';
 if(['world','storage'].includes(kind))inventoryUI3400.selected='world_map';
 if(kind==='reserve'){state.inventoryView='taller';inventoryUI3400.selected='amulet';}
 if(kind==='regional'){tab='expeditions';navigationTab3300='commerce';tradeSection3390='barters';}
 if(kind==='underway'){const confirm=window.confirm;window.confirm=()=>true;startTrade3300('ocean_trade','museum');window.confirm=confirm;tab='expeditions';navigationTab3300='commerce';tradeSection3390='routes';}
 if(kind==='storage')window.__labStorageFail=true;renderPanel();labReport();
}
window.addEventListener('message',event=>{if(event.source!==parent)return;const data=event.data;if(data?.type==='inv3400-scenario')labLoad(data.scenario);if(data?.type==='inv3400-answer'){const pending=labPending;labPending=null;if(data.accepted&&pending){labApproved=true;try{(pending.kind==='trade'?labTradeAction:labInventoryAction)(pending.action,pending.id);}finally{labApproved=false;}labReport();}}});
panel.addEventListener('click',()=>setTimeout(labReport,0));labLoad('new');parent.postMessage({type:'inv3400-ready'},'*');
})();`;
const app=source.replace(/\n\}\)\(\);\s*$/,bridge);if(app===source)throw Error('Cierre del motor no encontrado');const script=text=>'<script>'+text.replace(/<\/script/gi,'<\\/script')+'<\/script>';
const prefix=script(`Object.defineProperty(window,'localStorage',{value:(()=>{const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>{if(window.__labStorageFail)throw Error('Fallo simulado del laboratorio');data.set(key,String(value))},removeItem:key=>data.delete(key)}})()});window.setInterval=()=>0;Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.resolve()}});`);
frame.srcdoc=html.replace('<head>','<head><base href="'+new URL('./',location.href).href+'">'+prefix).replace(/<link rel="manifest"[^>]*>/,'').replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,url)=>'<style>'+resources.get(url)+'</style>').replace(/<script src="([^"]+)"[^>]*><\/script>/g,(_,url)=>/^js\/(?:save-manager|update-client)/.test(url)?'':script(url.startsWith('js/app.js')?app:resources.get(url)));
}catch(error){status.textContent='No se pudo abrir el laboratorio: '+error.message;throw error;}
})();
