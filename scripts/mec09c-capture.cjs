'use strict';
// MEC-09C · Capturas reales y medición del encuadre móvil.
// Sirve www/ en local, abre el juego real con Chrome (Playwright), carga partidas representativas
// y, para cada pestaña y resolución, guarda una captura y mide el marco, el área central, los
// desbordamientos, los controles táctiles, el texto visible, el DOM y el tiempo de cambio de pestaña.
// Uso: node scripts/mec09c-capture.cjs ETIQUETA [--quick]
//  → docs/mec09c/capturas/ETIQUETA/*.png y docs/mec09c/medidas-ETIQUETA.json
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(process.env.PLAYWRIGHT||'/opt/npm-tools/node_modules/playwright');
const ROOT=path.join(__dirname,'..'),WWW=process.env.MEC09C_WWW||path.join(ROOT,'www'),KEY='gran_atlas_v05';
const TYPES={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.webmanifest':'application/manifest+json','.woff2':'font/woff2'};
function serve(){return new Promise(res=>{const s=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(WWW,p);
 if(!f.startsWith(WWW)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
 s.listen(0,'127.0.0.1',()=>res(s));});}
const TABS=[['atlas','Atlas'],['field','Campo'],['journal','Cuaderno'],['research','Investigación'],['society','Sociedad'],['bestiary','Bestiario'],['expeditions','Campamento'],['objects','Inventario'],['museum','Museo']];
const SAVES=[['A','partida nueva',null],['B','intermedia (rango 7)','B-intermedia.json'],['C','avanzada (Polos)','C-avanzada.json'],['D','final MEC-09B','D-final-mec09b.json']];
const VIEW_MAIN=[[360,800],[390,844],[412,915]],VIEW_EXTRA=[[320,568],[430,932]],VIEW_OTHER=[[844,390,'horizontal'],[768,1024,'tableta'],[1280,800,'escritorio']];
// Medición dentro de la página.
function measure(){
 const r=e=>{if(!e)return null;const b=e.getBoundingClientRect();const cs=getComputedStyle(e);return cs.display==='none'||cs.visibility==='hidden'||b.height===0?null:{top:Math.round(b.top),h:Math.round(b.height),w:Math.round(b.width)};};
 const q=s=>document.querySelector(s),vw=innerWidth,vh=innerHeight;
 const topbar=r(q('#app .topbar')),res=r(q('#frameCur')),title=r(q('#frameTitle')),dock=r(q('.mobile-dock')),panel=r(q('main#panel'));
 const sub=[...document.querySelectorAll('main#panel [role=tablist], main#panel .subtabs, main#panel .ui-subtabs, main#panel .m27-rooms, main#panel [class*=subtab], main#panel [class*=-tabs]')].map(r).filter(Boolean).filter(b=>b.top<vh)[0]||null;
 const overflowX=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-vw;
 const P=q('main#panel');const pb=P?P.getBoundingClientRect():{top:0,bottom:vh};
 const vis=e=>{const b=e.getBoundingClientRect();if(b.width<1||b.height<1)return false;const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none')return false;return b.bottom>pb.top&&b.top<pb.bottom&&b.right>0&&b.left<vw;};
 const ctrls=[...document.querySelectorAll('button,a[href],select,input,[role=button],[data-tab]')].filter(vis);
 const small=ctrls.filter(e=>{const b=e.getBoundingClientRect();return b.width<40||b.height<40;});
 const actions=[...(P?P.querySelectorAll('button:not([disabled]),select,input'):[])].filter(vis).filter(e=>{const b=e.getBoundingClientRect();return b.top>=pb.top-1&&b.bottom<=pb.bottom+1;});
 // Elementos recortados horizontalmente dentro del panel (salen del ancho visible sin contenedor desplazable).
 let clipped=0;if(P)for(const e of P.querySelectorAll('*')){const b=e.getBoundingClientRect();if(b.width>0&&b.right>vw+2){let p=e.parentElement,sc=false;while(p&&p!==P){const cs=getComputedStyle(p);if(/(auto|scroll|hidden)/.test(cs.overflowX)){sc=true;break;}p=p.parentElement;}if(!sc)clipped++;}}
 const txt=P?P.innerText:'';let visibleText=0,tiny=0;
 if(P){const w=document.createTreeWalker(P,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const t=n.textContent.trim();if(!t)continue;const el=n.parentElement;if(!el||!vis(el))continue;const b=el.getBoundingClientRect();if(b.top>pb.bottom||b.bottom<pb.top)continue;visibleText+=t.length;if(parseFloat(getComputedStyle(el).fontSize)<11)tiny+=t.length;}}
 return {vw,vh,topbar:topbar?.h||0,resources:res?.h||0,title:title?.h||0,subtabs:sub?.h||0,dock:dock?.h||0,panel:panel?.h||0,
  fixed:(topbar?.h||0)+(res?.h||0)+(title?.h||0)+(dock?.h||0),overflowX:Math.max(0,overflowX),clipped,
  panelScroll:P?P.scrollHeight-P.clientHeight:0,actionsVisible:actions.length,controlsVisible:ctrls.length,smallTargets:small.length,
  smallSamples:small.slice(0,6).map(e=>(e.getAttribute('aria-label')||e.textContent||e.className||'').trim().slice(0,40)+' '+Math.round(e.getBoundingClientRect().width)+'×'+Math.round(e.getBoundingClientRect().height)),
  textChars:txt.length,visibleTextChars:visibleText,tinyTextChars:tiny,dom:document.getElementsByTagName('*').length,panelDom:P?P.getElementsByTagName('*').length:0,
  unlabeled:ctrls.filter(e=>!(e.getAttribute('aria-label')||e.textContent.trim()||e.getAttribute('title'))).length};
}
async function run(label,{quick=false,only=null}={}){
 const out=path.join(ROOT,'docs','mec09c','capturas',label);fs.mkdirSync(out,{recursive:true});
 const srv=await serve(),url='http://127.0.0.1:'+srv.address().port+'/index.html';
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox','--disable-gpu','--no-proxy-server','--disable-background-networking','--disable-component-update']});
 const rows=[];const views=quick?[[390,844]]:[...VIEW_MAIN,...VIEW_EXTRA];
 const saves=only?SAVES.filter(s=>only.includes(s[0])):SAVES;
 const NOW=Date.UTC(2027,9,30,15);
 for(const [sid,sname,file] of saves){
  const raw=file?fs.readFileSync(path.join(ROOT,'docs','mec09c','saves',file),'utf8'):null;
  for(const [w,h,kind] of [...views,...(quick?[]:sid==='D'||sid==='A'?VIEW_OTHER:[])]){
   const ctx=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,isMobile:w<700,hasTouch:w<700,serviceWorkers:'block'});
   await ctx.addInitScript(([k,v,now])=>{try{if(!sessionStorage.getItem('mec09c-init')){localStorage.clear();if(v)localStorage.setItem(k,v);sessionStorage.setItem('mec09c-init','1');}}catch(_){}
    const D=Date,base=now,start=D.now();globalThis.Date=class extends D{constructor(...a){super(...(a.length?a:[base+(D.now()-start)]));}static now(){return base+(D.now()-start);}};},[KEY,raw,NOW]);
   const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e.message).slice(0,160)));
   const t0=Date.now();await page.goto(url,{waitUntil:'load'});await page.waitForFunction(()=>document.querySelector('main#panel')?.children.length>0,null,{timeout:60000});await page.waitForTimeout(400);const startup=Date.now()-t0;
   const mem=await page.evaluate(()=>performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null);
   for(const [tab,tname] of TABS){
    const sel=w<700?`.mobile-dock [data-tab="${tab}"]`:`nav.tabs [data-tab="${tab}"]`;
    const t1=await page.evaluate(s=>{const b=document.querySelector(s);if(!b)return -1;const t=performance.now();b.click();return t;},sel);
    const dt=await page.evaluate(t=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r(Math.round(performance.now()-t))))),t1);
    await page.waitForTimeout(150);
    const m=await page.evaluate(measure);const name=`${sid}-${tab}-${w}x${h}.png`;
    await page.screenshot({path:path.join(out,name)});
    rows.push({save:sid,saveName:sname,tab,tabName:tname,res:`${w}×${h}`,kind:kind||'teléfono',startupMs:startup,switchMs:dt,heapMB:mem,errors:errors.splice(0).join(' | '),shot:name,...m});
   }
   // Ventana emergente y estados especiales en la resolución principal.
   if(w===390&&!kind){for(const [pop,label2] of [['brujula','brújula'],['guia','guía'],['libras','recursos']]){
     await page.evaluate(p=>{const b=document.querySelector(`[data-pop="${p}"]`);b&&b.click();},pop);await page.waitForTimeout(200);
     const m=await page.evaluate(()=>{const v=[...document.querySelectorAll('.frame-pop:not([hidden]),.ux3410-guide,.ux3410-compass,[role=dialog]:not([hidden])')].find(e=>{const b=e.getBoundingClientRect();return b.height>0&&getComputedStyle(e).display!=='none';});
      if(!v)return null;const b=v.getBoundingClientRect();return {top:Math.round(b.top),h:Math.round(b.height),w:Math.round(b.width),bottom:Math.round(b.bottom),fits:b.bottom<=innerHeight&&b.right<=innerWidth&&b.left>=0,scroll:v.scrollHeight>v.clientHeight,closeBtn:!!v.querySelector('[aria-label*=errar],[data-close],.close,button[aria-label="Cerrar"]')};});
     const name=`${sid}-pop-${pop}-${w}x${h}.png`;await page.screenshot({path:path.join(out,name)});rows.push({save:sid,tab:'pop:'+pop,tabName:'Ventana: '+label2,res:`${w}×${h}`,kind:'ventana',shot:name,pop:m});
     await page.keyboard.press('Escape');await page.evaluate(()=>{document.querySelector('.frame-scrim')?.click();});await page.waitForTimeout(120);}}
   await ctx.close();
  }
 }
 await browser.close();srv.close();
 fs.writeFileSync(path.join(ROOT,'docs','mec09c','medidas-'+label+'.json'),JSON.stringify(rows,null,1));
 return rows;
}
module.exports={run,measure,serve,TABS,SAVES};
if(require.main===module){const label=process.argv[2]||'antes';const quick=process.argv.includes('--quick');const only=(process.argv.find(a=>a.startsWith('--saves='))||'').slice(8)||null;
 run(label,{quick,only}).then(r=>{const t=r.filter(x=>!x.tab.startsWith('pop'));console.log(label,r.length,'capturas; overflow',t.filter(x=>x.overflowX>0).length,'errores',t.filter(x=>x.errors).length);}).catch(e=>{console.error(e);process.exit(1);});}
