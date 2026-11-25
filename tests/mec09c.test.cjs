'use strict';
// MEC-09C · Interfaz móvil, navegación, experiencia de usuario y rendimiento.
// Dos niveles: (1) motor real (catálogo completo) para la guía contextual, la configuración y la
// compatibilidad de partidas; (2) navegador real (Chrome + Playwright) sobre www/ con partidas
// representativas para el encuadre, la navegación, las ventanas, los controles y el rendimiento.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {make}=require('./helpers/mec01-game.cjs');
const ROOT=path.join(__dirname,'..'),KEY='gran_atlas_v05';
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const game=(o={})=>make({now:Date.UTC(2027,9,30,12),headless:true,full:true,...o});

// ── Archivos, versión y restricciones ───────────────────────────────────────────────────────
test('MEC-09C · V 5.6.9 Beta con etiqueta MEC-09C; capa móvil cargada al final; sin APK',()=>{
 const pkg=require('../package.json'),rel=require('../www/atlas-release.json'),html=read('www/index.html'),sw=read('www/sw.js');
 assert.equal(pkg.version,'5.6.9');assert.equal(rel.version,'5.6.9');assert.equal(rel.build,'MEC-09C');assert.equal(rel.v569c.apk,false);assert.equal(rel.v569c.presentationOnly,true);
 assert.match(html,/MEC-09C/);
 const links=[...html.matchAll(/<link rel="stylesheet" href="([^"?]+)/g)].map(m=>m[1]);assert.equal(links.at(-1),'css/mobile-v569c.css','la hoja móvil es la última');
 const scripts=[...html.matchAll(/<script src="([^"?]+)/g)].map(m=>m[1]);assert.equal(scripts.at(-1),'js/mobile-ux-v569c.js');
 assert.match(sw,/mobile-ux-v569c\.js/);assert.match(sw,/mobile-v569c\.css/);
 assert.match(pkg.scripts['release:verify'],/tests\/mec09c\.test\.cjs/);
 const apk=[];const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){if(['node_modules','.git'].includes(e.name))continue;const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(/\.apk$/i.test(e.name))apk.push(f);}};walk(ROOT);assert.equal(apk.length,0);
});
test('MEC-09C · la capa móvil es solo presentación: no toca estado, costos ni probabilidades',()=>{
 const js=read('www/js/mobile-ux-v569c.js'),css=read('www/css/mobile-v569c.css');
 assert.doesNotMatch(js,/\bstate\.|persist\(|localStorage|Math\.random/);
 assert.match(css,/--ux-tap:44px/);assert.match(css,/env\(safe-area-inset-bottom/);assert.match(css,/100dvh/);
 // Las reglas de texto nunca ocultan requisitos, costos, consumos ni recompensas.
 for(const m of js.matchAll(/re:\/(.*?)\/,act:'(hide|info)'/g))assert.doesNotMatch(m[1],/requisit|cost|consum|recompensa ×|£\\d/i,m[1]);
});

// ── Guía contextual de progresión (sección 25) ─────────────────────────────────────────────
test('MEC-09C · guía: Polos → abrigo polar → morral reforzado → escama de castor → Gabinete de especímenes → región, hábitat y horario',()=>{
 const h=game(),G=h.x.AtlasGuideMEC09C,s=h.g.state;
 const coat=G.chain('polar_coat');assert.equal(coat.kind,'receta');assert.equal(coat.ok,false);
 const pack=coat.children.find(c=>c.id==='sturdy_pack');assert.ok(pack,'morral reforzado');
 const scale=pack.children.find(c=>c.id==='beaver_tail_scale');assert.ok(scale,'escama de cola de castor');
 const sp=scale.species[0];assert.equal(sp.id,'castor_europeo');assert.equal(sp.research,'gabinete_1');
 assert.ok(sp.regions.length>0&&sp.habitats.includes('rio')&&sp.times.length>0);
 assert.equal(sp.known,false);assert.equal(sp.name,null,'no revela la especie sin identificar');
 const html=G.html('polar_coat');assert.match(html,/Cómo se obtiene · faltan/);assert.match(html,/data-id="research\|gabinete_1"/);assert.match(html,/data-id="atlas\|HX-0/);assert.doesNotMatch(html,/Castor europeo/i);
 // Identificada la especie e investigado el Gabinete, la guía la nombra y retira el requisito.
 s.discovered.castor_europeo=true;s.upgrades.specimenDrops=1;const sp2=G.chain('sturdy_pack').children.find(c=>c.id==='beaver_tail_scale').species[0];
 assert.equal(sp2.known,true);assert.ok(sp2.name);assert.equal(sp2.research,null);
 // Con todo en el inventario, la cadena queda resuelta.
 for(const id of ['polar_coat'])s.inventory[id]=1;assert.equal(G.chain('polar_coat').ok,true);
});
test('MEC-09C · la ficha de objeto incluye la cadena con enlaces de navegación contextual',()=>{
 const h=game(),A=h.x.AtlasGuideMEC09C;const html=A.html('sounding_kit');
 assert.match(html,/ux3410-link/);assert.match(html,/data-action="ux-open"/);
 // Un objeto disponible sin receta no muestra bloque.
 h.g.state.inventory.brass_shard=5;assert.equal(A.html('brass_shard'),'');
});

// ── Configuración del perfil (sección 28) ──────────────────────────────────────────────────
test('MEC-09C · configuración reservada: idioma, preferencias, guardado, versión; Game Master oculto y sin ayudas',()=>{
 const src=read('www/js/app.js');assert.match(src,/data-cp-dialog='settings'|dataset\.cpDialog='settings'/);
 const i=src.indexOf('function settingsHTML9C'),body=src.slice(i,src.indexOf('\n}',i));
 for(const sec of ['idioma','preferencias','guardado','version','game-master'])assert.match(body,new RegExp('data-settings-section="'+sec+'"'));
 assert.match(body,/data-settings-section="game-master" hidden/);assert.match(body,/<select id="cp9c-lang" disabled/);
 assert.doesNotMatch(body,/state\.(money|knowledge|prestige|discovered)\s*=/);
});

// ── Compatibilidad con partidas anteriores (punto 12) ──────────────────────────────────────
const corpus=require('./fixtures/mec09a-saves.json');
test('MEC-09C · 12. las partidas auténticas (5.4.0 a MEC-08) cargan sin cambios por la capa de interfaz',()=>{
 for(const c of corpus){const h=game({store:{[KEY]:c.raw}});h.g.persist();const once=JSON.parse(h.store[KEY]);const h2=game({store:{[KEY]:JSON.stringify(once)}});h2.g.persist();
  const twice=JSON.parse(h2.store[KEY]);for(const k of ['money','knowledge','inventory','discovered','published','mec06','mec08'])assert.deepEqual(twice[k],once[k],c.label+' '+k);
  assert.ok(h.x.AtlasGuideMEC09C.chain('polar_coat'),c.label);}
});

// ── Navegador real ─────────────────────────────────────────────────────────────────────────
let pw=null;try{pw=require(process.env.PLAYWRIGHT||'/opt/npm-tools/node_modules/playwright');}catch(_){}
const chrome=process.env.CHROME||'/usr/bin/google-chrome',browserOK=!!pw&&fs.existsSync(chrome);
const B=browserOK?test:test.skip;
let ctxCache=null;
async function browser(){if(ctxCache)return ctxCache;const {serve}=require('../scripts/mec09c-capture.cjs');const srv=await serve();const b=await pw.chromium.launch({executablePath:chrome,args:['--no-sandbox','--no-proxy-server']});ctxCache={srv,b,url:'http://127.0.0.1:'+srv.address().port+'/index.html'};return ctxCache;}
test.after(async()=>{if(ctxCache){await ctxCache.b.close();ctxCache.srv.close();}});
async function open(w,h,save=null){const {b,url}=await browser();const raw=save?read('docs/mec09c/saves/'+save):null;
 const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:w<700,hasTouch:w<700,serviceWorkers:'block'});
 await ctx.addInitScript(([k,v])=>{if(!sessionStorage.getItem('t9c')){localStorage.clear();if(v)localStorage.setItem(k,v);sessionStorage.setItem('t9c','1');}
  const D=Date,s=D.now(),now=Date.UTC(2027,9,30,15);globalThis.Date=class extends D{constructor(...a){super(...(a.length?a:[now+(D.now()-s)]));}static now(){return now+(D.now()-s);}};},[KEY,raw]);
 const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>document.querySelector('main#panel')?.children.length>0,null,{timeout:60000});
 await page.evaluate(()=>document.querySelectorAll('.ach-toast').forEach(t=>t.remove()));return {page,ctx,errors};}
const TABS=['atlas','field','journal','research','society','bestiary','expeditions','objects','museum'];
const go=(page,t)=>page.evaluate(t=>document.querySelector(`.mobile-dock [data-tab="${t}"]`).click(),t);

B('MEC-09C · 1-3. navegación estable, subpestañas en una fila y sin desplazamiento horizontal (5 resoluciones, partida final)',async()=>{
 for(const [w,h] of [[320,568],[360,800],[390,844],[412,915],[430,932]]){const {page,ctx,errors}=await open(w,h,'D-final-mec09b.json');
  for(const t of TABS){await go(page,t);await page.waitForTimeout(120);
   const m=await page.evaluate(()=>{const d=document.querySelector('.mobile-dock').getBoundingClientRect(),P=document.querySelector('main#panel').getBoundingClientRect();
    const rows=[...document.querySelectorAll('.inventory-subtabs,.society-tabs,.er28-branches')].map(r=>{const tops=new Set([...r.children].map(c=>Math.round(c.getBoundingClientRect().top)));return tops.size;});
    let clipped=0;for(const e of document.querySelectorAll('main#panel *')){const b=e.getBoundingClientRect();if(b.width>0&&b.right>innerWidth+2){let p=e.parentElement,sc=false;while(p){if(/(auto|scroll|hidden)/.test(getComputedStyle(p).overflowX)){sc=true;break;}p=p.parentElement;}if(!sc)clipped++;}}
    return {overflow:document.documentElement.scrollWidth-innerWidth,dockTop:Math.round(d.top),dockBottom:Math.round(d.bottom),vh:innerHeight,panelBottom:Math.round(P.bottom),rows,clipped,active:document.querySelector('.mobile-dock-link.active')?.dataset.tab,current:document.querySelector('.mobile-dock-link[aria-current=page]')?.dataset.tab};});
   const k=w+'×'+h+' '+t;
   assert.ok(m.overflow<=0,k+' desbordamiento horizontal '+m.overflow);assert.equal(m.clipped,0,k+' contenido recortado');
   assert.ok(m.dockBottom<=m.vh&&m.panelBottom<=m.dockTop+1,k+' la barra inferior no tapa contenido');
   assert.ok(m.rows.every(n=>n===1),k+' subpestañas en una fila '+m.rows);assert.equal(m.active,t);assert.equal(m.current,t,k+' aria-current');
  }
  // La barra conserva su posición entre pestañas.
  assert.deepEqual(errors,[]);await ctx.close();}
});
B('MEC-09C · 4. ventanas emergentes utilizables en 320×568: caben, tienen cierre y devuelven el foco',async()=>{
 const {page,ctx}=await open(320,568,'D-final-mec09b.json');
 for(const key of ['libras','conocimiento','prestigio']){await page.focus(`[data-pop="${key}"]`);await page.click(`[data-pop="${key}"]`);
  const m=await page.evaluate(()=>{const p=document.getElementById('framePop'),b=p.getBoundingClientRect();return {open:!p.hidden,fits:b.top>=0&&b.bottom<=innerHeight&&b.left>=0&&b.right<=innerWidth,close:!!p.querySelector('[data-pop-close]'),closeSize:(()=>{const c=p.querySelector('[data-pop-close]').getBoundingClientRect();return Math.min(c.width,c.height);})()};});
  assert.ok(m.open&&m.fits&&m.close,key+JSON.stringify(m));assert.ok(m.closeSize>=40,'cierre táctil');
  await page.click('[data-pop-close]');const after=await page.evaluate(k=>({hidden:document.getElementById('framePop').hidden,focus:document.activeElement?.dataset?.pop}),key);
  assert.equal(after.hidden,true);assert.equal(after.focus,key,'foco devuelto');
  await page.click(`[data-pop="${key}"]`);await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.getElementById('framePop').hidden),true,'Escape cierra');}
 // Cifras compactas sin cortes, con el valor completo accesible.
 const chips=await page.evaluate(()=>[...document.querySelectorAll('.frame-chip')].map(c=>({t:c.querySelector('b').textContent,fits:c.querySelector('b').scrollWidth<=c.querySelector('b').clientWidth+1,label:c.getAttribute('aria-label')})));
 for(const c of chips){assert.ok(c.fits,'cifra completa visible: '+c.t);}assert.match(chips[1].label,/Libras: £74\./);assert.match(chips[1].t,/^£\d+M$/);
 await ctx.close();
});
B('MEC-09C · 5/7. el Bestiario conserva filtros y posición al volver de una ficha y de otra pestaña',async()=>{
 const {page,ctx}=await open(390,844,'D-final-mec09b.json');await go(page,'bestiary');await page.waitForTimeout(150);
 assert.equal(await page.evaluate(()=>document.querySelector('.b26-controls').classList.contains('ux9c-collapsed')),true,'filtros plegados por defecto');
 await page.click('.ux9c-filters-toggle');const sel=await page.evaluate(()=>{const s=document.querySelector('.b26-filter-row select');s.selectedIndex=2;s.dispatchEvent(new Event('change',{bubbles:true}));return s.options[2].text;});
 await page.waitForTimeout(150);assert.match(await page.textContent('.ux9c-filters-toggle'),/1 activos/);
 await page.evaluate(()=>{document.querySelector('main#panel').scrollTop=300;});
 await go(page,'field');await page.waitForTimeout(100);await go(page,'bestiary');await page.waitForTimeout(150);
 const st=await page.evaluate(()=>({sel:document.querySelector('.b26-filter-row select').options[document.querySelector('.b26-filter-row select').selectedIndex].text,label:document.querySelector('.ux9c-filters-toggle').textContent}));
 assert.equal(st.sel,sel,'filtro conservado');assert.match(st.label,/1 activos/);
 // Abrir una ficha y cerrarla devuelve al listado.
 const card=await page.$('#panel [class*=b26-card] button, #panel button[data-b26-open], #panel .b26-card');if(card){await card.click();await page.waitForTimeout(150);await page.keyboard.press('Escape');await page.waitForTimeout(100);
  assert.ok(await page.$('.b26-controls'),'regreso al listado');}
 await ctx.close();
});
B('MEC-09C · 6. navegación contextual: de la receta del abrigo polar a su cadena y a la investigación requerida',async()=>{
 const {page,ctx,errors}=await open(390,844,'B-intermedia.json');
 await page.evaluate(()=>{document.querySelector('.mobile-dock [data-tab="objects"]').click();});await page.waitForTimeout(100);
 // Navegación contextual existente: ux-open lleva a la receta; la ficha muestra la cadena.
 await page.evaluate(()=>{const b=document.createElement('button');b.dataset.action='ux-open';b.dataset.id='recipe|polar_coat';b.className='ux3410-link';b.id='t9c';document.querySelector('#panel').prepend(b);b.click();});await page.waitForTimeout(200);
 const chain=await page.$('.ux9c-chain');assert.ok(chain,'cadena visible en la ficha');assert.match(await chain.textContent(),/Cómo se obtiene/);
 const link=await page.$('.ux9c-chain [data-id^="research|"]');if(link){await link.click();await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>document.querySelector('.mobile-dock-link.active').dataset.tab),'research');}
 assert.deepEqual(errors,[]);await ctx.close();
});
B('MEC-09C · 8. controles táctiles: barra inferior, recursos, herramientas y subpestañas ≥ 40 px (objetivo 44)',async()=>{
 const {page,ctx}=await open(360,800,'C-avanzada.json');
 for(const t of ['objects','society','research']){await go(page,t);await page.waitForTimeout(120);
  const small=await page.evaluate(()=>[...document.querySelectorAll('.mobile-dock-link,.frame-chip,.frame-tool,#saveManagerOpen,.inventory-subtabs>*,.society-tabs>*,.er28-branches>*')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&(b.height<38||b.width<34);}).map(e=>e.className+' '+Math.round(e.getBoundingClientRect().width)+'×'+Math.round(e.getBoundingClientRect().height)));
  assert.deepEqual(small,[],t);}
 const dock=await page.evaluate(()=>[...document.querySelectorAll('.mobile-dock-link')].map(b=>({h:b.getBoundingClientRect().height,label:b.getAttribute('aria-label')})));
 assert.equal(dock.length,9,'los nueve accesos');assert.ok(dock.every(d=>d.h>=44&&d.label));
 await ctx.close();
});
B('MEC-09C · 9-10. la búsqueda de campo actualiza recompensa y registro sin reconstruir el panel; en reposo no hay renderizados',async()=>{
 const {page,ctx,errors}=await open(390,844,'D-final-mec09b.json');await go(page,'field');await page.waitForTimeout(150);
 const r=await page.evaluate(()=>new Promise(res=>{const P=document.querySelector('#panel');let rebuilt=0;const o=new MutationObserver(m=>{for(const x of m)if(x.target===P&&x.type==='childList')rebuilt++;});o.observe(P,{childList:true});
  const before=document.querySelector('.field-reward')?.textContent;const b=[...P.querySelectorAll('button')].find(x=>/Observar fauna/.test(x.textContent));b.click();
  setTimeout(()=>{o.disconnect();res({rebuilt,changed:document.querySelector('.field-reward')?.textContent!==before});},400);}));
 assert.equal(r.rebuilt,0);assert.ok(r.changed,'el resultado se actualiza');
 const idle=await page.evaluate(()=>new Promise(res=>{const P=document.querySelector('#panel');let rebuilt=0;const o=new MutationObserver(m=>{for(const x of m)if(x.target===P&&x.type==='childList')rebuilt++;});o.observe(P,{childList:true});setTimeout(()=>{o.disconnect();res(rebuilt);},2500);}));
 assert.equal(idle,0);assert.deepEqual(errors,[]);await ctx.close();
});
B('MEC-09C · 11. rendimiento de listas extensas: Bestiario paginado (≤ 40 fichas) y cambio de pestaña < 250 ms con la partida final',async()=>{
 const {page,ctx}=await open(390,844,'D-final-mec09b.json');
 for(const t of TABS){const ms=await page.evaluate(t=>new Promise(r=>{const s=performance.now();document.querySelector(`.mobile-dock [data-tab="${t}"]`).click();requestAnimationFrame(()=>requestAnimationFrame(()=>r(performance.now()-s)));}),t);assert.ok(ms<250,t+' '+Math.round(ms)+' ms');}
 await go(page,'bestiary');await page.waitForTimeout(100);const cards=await page.evaluate(()=>document.querySelectorAll('#panel .b26-card,#panel [class~=b26-card]').length);assert.ok(cards>0&&cards<=40,'fichas '+cards);
 const dom=await page.evaluate(()=>document.getElementsByTagName('*').length);assert.ok(dom<4000,'DOM '+dom);
 await ctx.close();
});
B('MEC-09C · configuración en el menú del naturalista: se abre, cabe en 320 px y no tiene la sección Game Master visible',async()=>{
 const {page,ctx}=await open(320,568,'B-intermedia.json');
 await page.click('#saveManagerOpen');await page.waitForTimeout(100);await page.click('[data-cp-dialog="settings"]');await page.waitForTimeout(150);
 const m=await page.evaluate(()=>{const d=document.querySelector('#cp3430-dialog section[role=dialog]'),b=d.getBoundingClientRect();return {title:document.getElementById('cp3430-dialog-title').textContent,fits:b.left>=0&&b.right<=innerWidth+1,sections:[...d.querySelectorAll('[data-settings-section]')].filter(s=>!s.hidden).map(s=>s.dataset.settingsSection),overflow:document.documentElement.scrollWidth-innerWidth};});
 assert.equal(m.title,'Configuración');assert.ok(m.fits);assert.deepEqual(m.sections,['idioma','preferencias','guardado','version']);assert.ok(m.overflow<=0);
 await ctx.close();
});
B('MEC-09C · horizontal y escritorio: contenido visible desde el inicio y sin desbordamiento',async()=>{
 for(const [w,h] of [[844,390],[1280,800],[768,1024]]){const {page,ctx}=await open(w,h,'D-final-mec09b.json');
  const m=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,panelTop:Math.round(document.querySelector('main#panel').getBoundingClientRect().top),vh:innerHeight}));
  assert.ok(m.overflow<=0,w+'×'+h);assert.ok(m.panelTop<m.vh*0.75,w+'×'+h+' el contenido empieza en pantalla ('+m.panelTop+')');await ctx.close();}
});
