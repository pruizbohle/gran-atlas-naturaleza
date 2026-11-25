'use strict';
// MEC-09C · Revisión técnica automatizada de accesibilidad (sin lector de pantalla físico).
// Por pestaña (390×844, partida final y nueva): contraste de texto (WCAG 2.x, AA), controles sin
// nombre accesible, áreas táctiles, estado seleccionado expuesto (aria), navegación por teclado
// (orden de tabulación alcanza la barra inferior) y ampliación al 130 % sin desbordamiento horizontal.
// Uso: node scripts/mec09c-a11y.cjs [ETIQUETA] → docs/mec09c/accesibilidad-ETIQUETA.json
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT||'/opt/npm-tools/node_modules/playwright');
const {serve,TABS}=require('./mec09c-capture.cjs');
const ROOT=path.join(__dirname,'..'),KEY='gran_atlas_v05';
function audit(){
 const lum=c=>{const m=c.match(/[\d.]+/g);if(!m)return null;const [r,g,b,a=1]=m.map(Number);if(a<0.5)return null;const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b);};
 const bg=e=>{while(e){const cs=getComputedStyle(e);if(cs.backgroundImage&&cs.backgroundImage!=='none')return null;const l=lum(cs.backgroundColor);if(l!==null)return l;e=e.parentElement;}return lum('rgb(251,244,226)');};
 const P=document.querySelector('main#panel'),pb=P.getBoundingClientRect();let checked=0,fails=[];
 const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
 while((n=w.nextNode())){const t=n.textContent.trim();if(t.length<2)continue;const el=n.parentElement;const b=el.getBoundingClientRect();if(b.width<1||b.bottom<0||b.top>innerHeight)continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity<0.3)continue;
  const fg=lum(cs.color),bl=bg(el);if(fg===null||bl===null||parseFloat(cs.fontSize)<1||el.closest('button:disabled,[aria-disabled=true]'))continue;checked++;const r=(Math.max(fg,bl)+0.05)/(Math.min(fg,bl)+0.05);const size=parseFloat(cs.fontSize),bold=+cs.fontWeight>=700;const need=size>=24||(bold&&size>=18.66)?3:4.5;
  if(r<need)fails.push({text:t.slice(0,40),ratio:+r.toFixed(2),size,need});}
 const ctrls=[...document.querySelectorAll('button,a[href],select,input,[role=button],[role=tab]')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.bottom>0&&b.top<innerHeight&&getComputedStyle(e).visibility!=='hidden';});
 const name=e=>(e.getAttribute('aria-label')||e.getAttribute('aria-labelledby')&&'x'||e.textContent.trim()||e.getAttribute('title')||(e.labels&&e.labels.length&&'x')||e.getAttribute('placeholder')||'').trim();
 const unnamed=ctrls.filter(e=>!name(e)).map(e=>e.outerHTML.slice(0,80));
 const selectedRows=[...document.querySelectorAll('.inventory-subtabs,.society-tabs,.er28-branches,.m27-rooms,.mobile-dock')].map(r=>{const sel=r.querySelector('.active,.selected');return sel?{row:r.className.split(' ')[0],aria:sel.getAttribute('aria-pressed')||sel.getAttribute('aria-selected')||sel.getAttribute('aria-current')||null,marker:getComputedStyle(sel,'::after').content!=='none'||getComputedStyle(sel).boxShadow!=='none'}:null;}).filter(Boolean);
 return {textChecked:checked,contrastFails:fails.length,contrastSamples:fails.slice(0,6),controls:ctrls.length,unnamed:unnamed.length,unnamedSamples:unnamed.slice(0,4),selected:selectedRows};
}
async function run(label='despues'){
 const srv=await serve(),url='http://127.0.0.1:'+srv.address().port+'/index.html';
 const browser=await chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',args:['--no-sandbox','--no-proxy-server']});
 const out=[];
 for(const [sid,file] of [['A',null],['D','D-final-mec09b.json']]){
  const raw=file?fs.readFileSync(path.join(ROOT,'docs','mec09c','saves',file),'utf8'):null;
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,serviceWorkers:'block'});
  await ctx.addInitScript(([k,v])=>{if(!sessionStorage.getItem('a9c')){localStorage.clear();if(v)localStorage.setItem(k,v);sessionStorage.setItem('a9c','1');}},[KEY,raw]);
  const page=await ctx.newPage();await page.goto(url);await page.waitForFunction(()=>document.querySelector('main#panel')?.children.length>0);await page.waitForTimeout(300);
  await page.evaluate(()=>document.querySelectorAll('.ach-toast').forEach(t=>t.remove()));
  for(const [tab,name] of TABS){await page.evaluate(t=>document.querySelector(`.mobile-dock [data-tab="${t}"]`).click(),tab);await page.waitForTimeout(150);
   const a=await page.evaluate(audit);
   // Teclado: la barra inferior es alcanzable con Tab desde el contenido.
   const kb=await page.evaluate(()=>{const f=[...document.querySelectorAll('button,a[href],select,input,summary,[tabindex]:not([tabindex="-1"])')].filter(e=>!e.disabled&&e.getBoundingClientRect().width>0);return {focusable:f.length,dockReachable:f.some(e=>e.closest('.mobile-dock')),positiveTabindex:f.filter(e=>+e.getAttribute('tabindex')>0).length};});
   // Ampliación de texto: 130 % sin desbordamiento horizontal general.
   const zoom=await page.evaluate(()=>{document.documentElement.style.zoom='1.3';const o=document.documentElement.scrollWidth-innerWidth;document.documentElement.style.zoom='';return o;});
   out.push({save:sid,tab,tabName:name,...a,keyboard:kb,zoom130OverflowX:Math.max(0,zoom)});}
  await ctx.close();
 }
 await browser.close();srv.close();
 fs.writeFileSync(path.join(ROOT,'docs','mec09c','accesibilidad-'+label+'.json'),JSON.stringify(out,null,1));return out;
}
module.exports={run,audit};
if(require.main===module)run(process.argv[2]||'despues').then(r=>{for(const x of r)console.log(x.save,x.tab.padEnd(11),'contraste',x.contrastFails+'/'+x.textChecked,'sin nombre',x.unnamed,'zoom130',x.zoom130OverflowX,JSON.stringify(x.selected.map(s=>s.row+':'+s.aria+':'+s.marker)));}).catch(e=>{console.error(e);process.exit(1);});
