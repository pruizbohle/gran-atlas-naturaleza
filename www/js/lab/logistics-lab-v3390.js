'use strict';
(async()=>{
const frame=document.getElementById('engine'),status=document.getElementById('status');let ready=false;
window.addEventListener('message',e=>{if(e.source!==frame.contentWindow)return;if(e.data?.type==='log3390-ready')ready=true;if(e.data?.type==='log3390-confirm'){document.getElementById('confirmation').hidden=false;document.getElementById('confirmText').textContent=e.data.message;document.getElementById('confirmYes').focus();}if(e.data?.type==='log3390-state'){window.LogisticsLab3390=e.data;status.textContent=e.data.deliveries+' entregas · '+e.data.receipts+' recibos de viaje · '+e.data.jobs+' viajes en curso · '+e.data.scenario;}});
for(const id of ['confirmYes','confirmNo'])document.getElementById(id).onclick=()=>{document.getElementById('confirmation').hidden=true;frame.contentWindow.postMessage({type:'log3390-confirm-answer',accepted:id==='confirmYes'},'*');};
document.getElementById('scenario').onchange=e=>{document.getElementById('confirmation').hidden=true;if(ready)frame.contentWindow.postMessage({type:'log3390-scenario',scenario:e.target.value},'*');};
try{const html=await(await fetch('index.html')).text(),source=await(await fetch('js/app.js')).text();const urls=[...new Set([...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m=>m[1]).filter(u=>!/^js\/(?:app\.js|save-manager|update-client)/.test(u)))];const resources=new Map(await Promise.all(urls.map(async u=>{const r=await fetch(u);if(!r.ok)throw Error(u+':'+r.status);return[u,await r.text()];})));
const bridge=`
let demoScenario='new',demoClock=Date.now(),demoPending=null,demoApproved=false;Date.now=()=>demoClock;
// Opaque sandbox frames cannot use native modal dialogs. Keep the real engine's
// confirmation path, and retry the same action only after explicit parent UI approval.
const demoTradeAction=tradeAction3300;
tradeAction3300=function(action,id){demoPending={action,id};return demoTradeAction(action,id);};
window.confirm=message=>{if(demoApproved)return true;parent.postMessage({type:'log3390-confirm',message},'*');return false;};
function demoReport(){parent.postMessage({type:'log3390-state',scenario:demoScenario,deliveries:state.commerce.deliveries?.length||0,receipts:state.commerce.tradeReceipts?.length||0,jobs:state.commerce.jobs.length,stock:state.inventory},'*');}
function demoCommerce(){tab='expeditions';navigationTab3300='commerce';renderPanel();demoReport();}
function demoLoad(kind){demoPending=null;demoApproved=false;window.__labStorageFail=false;demoScenario=kind;const s=initialState();s.collectionId='isolated-'+kind;s.money=100000;s.knowledge=100000;s.prestige=1000;
 if(kind!=='new'){s.upgrades.shipyard=1;for(const d of SUPPLY_CONTRACTS3390)for(const id of Object.keys(d.requires))s.inventory[id]=100;for(const r of Object.values(CONTINENT_RULES3300))for(const id of r.items||[])s.craftedItems[id]=true;}
 if(kind==='reserve'){s.craftedItems={};s.inventory=supplyReserve3390(s);}
 AtlasSaveBridge.restoreGame(s);tradeSection3390='contracts';contractGroup3390=contractFilter3390='all';contractPage3390=0;
 if(kind==='underway'||kind==='returned'){const confirm=window.confirm;window.confirm=()=>true;startTrade3300('ocean_trade','museum');window.confirm=confirm;tradeSection3390='routes';if(kind==='returned'){demoClock+=90*24*3600000;settleTrade3300();tradeSection3390='register';}}
 if(kind==='storage')window.__labStorageFail=true;demoCommerce();}
window.addEventListener('message',e=>{if(e.source!==parent)return;if(e.data?.type==='log3390-scenario')demoLoad(e.data.scenario);if(e.data?.type==='log3390-confirm-answer'){const pending=demoPending;demoPending=null;if(e.data.accepted&&pending){demoApproved=true;try{demoTradeAction(pending.action,pending.id);}finally{demoApproved=false;}demoReport();}}});
panel.addEventListener('click',()=>setTimeout(demoReport,0));demoLoad('new');parent.postMessage({type:'log3390-ready'},'*');
})();`;
const app=source.replace(/\n\}\)\(\);\s*$/,bridge);if(app===source)throw Error('No se encontró el cierre del motor');const script=s=>'<script>'+s.replace(/<\/script/gi,'<\\/script')+'<\/script>';
const prefix=script(`Object.defineProperty(window,'localStorage',{value:(()=>{const data=new Map();return{getItem:k=>data.get(k)??null,setItem:(k,v)=>{if(window.__labStorageFail)throw Error('Fallo simulado del laboratorio');data.set(k,String(v))},removeItem:k=>data.delete(k)}})()});window.setInterval=()=>0;Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.resolve()}});`);
frame.srcdoc=html.replace('<head>','<head><base href="'+new URL('./',location.href).href+'">'+prefix).replace(/<link rel="manifest"[^>]*>/,'').replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,u)=>'<style>'+resources.get(u)+'</style>').replace(/<script src="([^"]+)"[^>]*><\/script>/g,(_,u)=>/^js\/(?:save-manager|update-client)/.test(u)?'':script(u.startsWith('js/app.js')?app:resources.get(u)));
}catch(e){status.textContent='No se pudo abrir el laboratorio: '+e.message;throw e;}
})();
