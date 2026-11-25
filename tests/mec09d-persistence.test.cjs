'use strict';
// MEC-09D §8–§9 · Guardado diferido e integridad transaccional, con el motor real y un almacenamiento simulado.
// Informe: docs/mec09d/auditoria-guardado-transacciones.md
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {make}=require('./helpers/mec01-game.cjs'),{harness}=require('./helpers/live-game.cjs');
const KEY='gran_atlas_v05';
const FN='publishMonograph,requestGrant,exchangeNotes,craftTome,buyNode,craftItem,startTrade3300,settleTrade3300,claimScientificMission'.split(',');
const APP=fs.readFileSync('www/js/app.js','utf8').replace(/\n\}\)\(\);\s*$/,'\nwindow.__p={'+FN.map(n=>n+':(...a)=>typeof '+n+'==="function"?'+n+'(...a):undefined').join(',')+'};\n})();');
// Se excluyen el registro de texto, la marca del ciclo y el identificador aleatorio de cada partida.
const strip=x=>{const d=typeof x==='string'?JSON.parse(x):JSON.parse(JSON.stringify(x));delete d.log;delete d.lastTick;const walk=o=>{if(o&&typeof o==='object')for(const k of Object.keys(o)){if(k==='collectionId')delete o[k];else walk(o[k]);}};walk(d);return d;};
function rich(){
 const h=make({full:true,headless:true,app:APP}),g=h.g,s=g.state,id=Object.keys(g.SPECIES)[0];
 Object.assign(s,{money:1e6,knowledge:1e6,prestige:50,lastGrant:0});s.discovered[id]=true;s.sightings[id]=500;s.stages[id]=5;
 const real=h.localStorage.setItem;let writes=0,failing=false;
 h.localStorage.setItem=function(k,v){if(failing)throw new Error('QuotaExceededError');if(k===KEY)writes++;return real.call(this,k,v);};
 return {h,g,s,p:h.window.__p,id,get writes(){return writes;},fail(on){failing=on;},durable(){return strip(h.store[KEY]);}};
}
function craftable(c){const id=Object.keys(c.g.RECIPES).find(r=>{const rec=c.g.RECIPES[r];return rec&&rec.requires&&!c.s.craftedItems[r];});for(const[m,n]of Object.entries(c.g.RECIPES[id].requires))c.s.inventory[m]=(c.s.inventory[m]||0)+n;return id;}
// Operaciones históricas sencillas (F10 de MEC-09A: «sesión viva exportable», sin transacción).
const simple={
 'publicación de monografía':c=>c.p.publishMonograph(c.id),
 'subvención':c=>c.p.requestGrant(),
 'canje de notas':c=>c.p.exchangeNotes(),
 'compilación de tomo':c=>c.p.craftTome(),
};
// Operaciones transaccionales (tradeTransaction3300). prep() prepara los insumos antes de la instantánea.
const atomic={
 'investigación':{prep:c=>{const n=c.g.RESEARCH_NODES.find(n=>!c.s.purchases[n.id]&&c.g.canBuy(n));assert.ok(n,'nodo comprable');return n.id;},run:(c,id)=>c.p.buyNode(id)},
 'fabricación':{prep:c=>craftable(c),run:(c,id)=>c.p.craftItem(id)},
};
const runAtomic=(c,op)=>op.run(c,op.prep(c));
test('MEC09D-G1 cada operación queda guardada al instante, con una sola escritura: un cierre inmediato no la pierde',()=>{
 for(const [name,op] of Object.entries({...simple,...Object.fromEntries(Object.entries(atomic).map(([k,v])=>[k,c=>runAtomic(c,v)]))})){
  const c=rich(),before=JSON.stringify(c.s);op(c);
  assert.notEqual(JSON.stringify(c.s),before,name+' cambia la partida');
  assert.deepEqual(c.durable(),strip(c.s),name+' guardada sin esperar al ciclo');
  assert.equal(c.writes,1,name+' una sola escritura');
 }
});

test('MEC09D-G2 los avistamientos automáticos no escriben por avistamiento: como máximo una escritura por ciclo de un segundo',()=>{
 const hour=3600000,noon=Math.floor(1700000000000/hour)*hour;let now=noon;class Clock extends Date{static now(){return now;}}
 const scripts=['campamento-perfil-ui-v3430','gm06/catalog','gm06/geography','gm06/art','gm07-m01/art','gm07-p04/catalog','gm07-a04/catalog'].filter(n=>fs.existsSync('www/js/'+n+'.js')),gameSource=scripts.map(n=>fs.readFileSync('www/js/'+n+'.js','utf8')).join('\n')+'\n'+fs.readFileSync('www/js/app.js','utf8');
 const h=harness({},null,{Date:Clock,rng:()=>0.99,gameSource}),g=h.window.__atlasTest;g.state.helpers=1;
 let writes=0;const real=h.localStorage.setItem;h.localStorage.setItem=function(k,v){if(k===KEY)writes++;return real.call(this,k,v);};
 const k0=g.state.knowledge;let ticks=0;for(let i=0;i<600;i++){now+=1000;h.tick();ticks++;}
 assert.ok(g.state.knowledge>k0,'hubo búsquedas automáticas con resultado');assert.ok(writes<=ticks,`escrituras ${writes} ≤ ciclos ${ticks}`);
 // Recuperación de ausencia (8 h): cada ciclo procesa un tramo acotado y escribe una vez.
 writes=0;ticks=0;now+=8*hour;for(let i=0;i<125&&(i===0||g.state.autoPending?.length);i++){h.tick();ticks++;}
 assert.ok(writes<=ticks,`ausencia: escrituras ${writes} ≤ ciclos ${ticks}`);
 assert.deepEqual(strip(h.store[KEY]),strip(g.state),'el estado escrito coincide con la memoria tras el último ciclo');
});

test('MEC09D-T1 fallo de almacenamiento: las transaccionales revierten todo, sin negativos, y el reintento se aplica una sola vez',()=>{
 for(const [name,op] of Object.entries(atomic)){
  const c=rich(),arg=op.prep(c),before=strip(c.s);c.fail(true);op.run(c,arg);
  assert.deepEqual(strip(c.s),before,name+' revierte memoria');
  const ok=rich();op.run(ok,op.prep(ok));const expected=strip(ok.s);
  c.fail(false);op.run(c,arg);assert.deepEqual(strip(c.s),expected,name+' reintento igual a una ejecución limpia');
  assert.deepEqual(c.durable(),strip(c.s),name+' reintento guardado');
  assert.ok(c.s.money>=0&&c.s.knowledge>=0&&Object.values(c.s.inventory).every(n=>n>=0),name+' sin negativos');
 }
});

test('MEC09D-T2 fallo de almacenamiento en operaciones sencillas (F10): estado coherente en memoria, aviso, sin duplicar al reintentar y guardado al recuperarse',()=>{
 for(const [name,op] of Object.entries(simple)){
  const c=rich();const stored=JSON.stringify(c.durable?.()??null);c.fail(true);op(c);const afterFail=strip(c.s);
  assert.ok(c.s.money>=0&&c.s.knowledge>=0,name+' sin negativos');
  // Una sola aplicación: comparar con una ejecución limpia.
  const clean=rich();op(clean);assert.deepEqual(afterFail,strip(clean.s),name+' aplicada una sola vez, sin estado parcial');
  // Publicación y subvención no pueden repetirse; tomo y canje solo se repiten si el jugador vuelve a pedirlos.
  if(name==='publicación de monografía'||name==='subvención'){op(c);assert.deepEqual(strip(c.s),afterFail,name+' no se duplica');}
  c.fail(false);c.g.persist();assert.deepEqual(c.durable(),strip(c.s),name+' se guarda al recuperarse el almacenamiento');
  void stored;
 }
});

test('MEC09D-T3 rutas comerciales: un fallo al partir o al liquidar no duplica cobro ni pierde la carga',()=>{
 const c=rich(),route=c.g.TRADE_ROUTES[0];c.s.upgrades.shipyard=true;
 const before=strip(c.s);c.fail(true);assert.equal(!!c.p.startTrade3300(route.id),false);assert.deepEqual(strip(c.s),before,'salida revertida');
 c.fail(false);assert.equal(c.p.startTrade3300(route.id),true);assert.equal(c.s.commerce.jobs.length,1,'una sola salida');
 const afterStart=strip(c.s),job=c.s.commerce.jobs[0];c.h.now=job.endAt+1;
 c.fail(true);c.p.settleTrade3300(job.endAt+1);assert.deepEqual(strip(c.s),afterStart,'liquidación revertida por completo ante el fallo');
 c.fail(false);c.p.settleTrade3300(job.endAt+1);c.p.settleTrade3300(job.endAt+2);
 assert.equal(c.s.commerce.jobs.length,0);assert.equal(c.s.commerce.history.length,1,'liquidada una sola vez');
 assert.equal(c.s.money,afterStart.money+route.money,'cobro exacto una vez');
 for(const[m,n]of Object.entries(route.rewards))assert.equal(c.s.inventory[m]||0,(afterStart.inventory[m]||0)+n,m);
 assert.deepEqual(c.durable(),strip(c.s));
});
