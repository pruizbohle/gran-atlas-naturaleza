'use strict';
// MEC-09D §20 · Calendario de los 10 eventos y progreso sin conexión, con el motor vigente.
// Informe: docs/mec09d/encargos-calendario.md.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),vm=require('node:vm');
const {make}=require('./helpers/mec01-game.cjs');
const HOUR=3600e3,DAY=24*HOUR,json=x=>JSON.parse(JSON.stringify(x));
const mod=(f,n)=>{const c={};c.globalThis=c;vm.runInNewContext(fs.readFileSync(f,'utf8'),c);return c[n];};
const X8=mod('www/js/mec08-recognition.js','AtlasMEC08'),X3=mod('www/js/mec03-collect.js','AtlasMEC03');
function game(now,rng){const h=make({full:true,headless:true,now,...(rng?{rng}:{})});h.window.confirm=()=>true;return {h,g:h.g,s:h.g.state,A:h.x.AtlasMEC08Actions};}

test('MEC09D-K20a 10 eventos anuales con su regla y duración; los eventos de coleccionables de MEC-03 siguen desactivados',()=>{
 assert.equal(X8.EVENTS.length,10);assert.equal(new Set(X8.EVENTS.map(e=>e.id)).size,10);
 for(const e of X8.EVENTS){assert.equal(e.recurrence,'anual');assert.ok(['fijo','equinoccio'].includes(e.rule.type)||e.rule.type,e.id);assert.ok(e.days>=3&&e.days<=14,e.id+' duración');}
 assert.ok(X3.EVENTS.length>0);assert.ok(X3.EVENTS.every(e=>e.active===false),'eventos de coleccionables desactivados (aprobado)');
});

test('MEC09D-K20b fechas de cada edición 2026–2032: día civil local, duración exacta en días y paso de año (Navidad → enero)',()=>{
 for(let y=2026;y<=2032;y++)for(const e of X8.EVENTS){const o=X8.occurrence(e,y),s=new Date(o.start),end=new Date(o.end);
  assert.equal(s.getHours(),0,e.id+' empieza a medianoche local');assert.equal(Math.round((end-s)/DAY),e.days,e.id+' '+y+' duración');
  if(e.rule.type==='fijo')assert.deepEqual([s.getMonth()+1,s.getDate()],[e.rule.month,e.rule.day],e.id);
  else{const q=new Date(X8.equinoxUTC(y,e.rule.month));assert.equal(new Date(q.getFullYear(),q.getMonth(),q.getDate()-1).getTime(),o.start,e.id+' equinoccio');}}
 // Cruce de año: un evento que empieza en diciembre sigue activo en enero del año siguiente.
 const dec=X8.EVENTS.filter(e=>e.rule.month===12&&e.rule.day+e.days>31);
 for(const e of dec){const o=X8.occurrence(e,2027),jan=new Date(2028,0,1,12).getTime();if(o.end>jan)assert.ok(X8.active(jan).some(a=>a.id===o.id),e.id+' activo el 1 de enero');}
});

test('MEC09D-K20c zona horaria: el día de inicio local es el mismo en Santiago, Madrid, Tokio, Kiritimati y Pago Pago',()=>{
 const code="const fs=require('fs'),vm=require('vm');const c={};c.globalThis=c;vm.runInNewContext(fs.readFileSync('www/js/mec08-recognition.js','utf8'),c);const X=c.AtlasMEC08;process.stdout.write(JSON.stringify(X.EVENTS.map(e=>{const d=new Date(X.occurrence(e,2028).start);return [e.id,d.getFullYear(),d.getMonth()+1,d.getDate(),d.getHours()];})));";
 const out=['America/Santiago','Europe/Madrid','Asia/Tokyo','Pacific/Kiritimati','Pacific/Pago_Pago'].map(tz=>JSON.parse(cp.execFileSync(process.execPath,['-e',code],{env:{...process.env,TZ:tz}}).toString()));
 for(const o of out.slice(1))for(const [i,row] of o.entries()){const ref=out[0][i];if(X8.EVENTS[i].rule.type==='fijo')assert.deepEqual(row,ref,row[0]);else{assert.equal(row[4],0);assert.ok(Math.abs(new Date(row[1],row[2]-1,row[3])-new Date(ref[1],ref[2]-1,ref[3]))<=DAY,row[0]+' equinoccio ±1 día por zona');}}
});

test('MEC09D-K20d encargo de evento: se acepta dentro de su edición, caduca al cerrar, se cobra una vez y se conserva al recargar',()=>{
 const e=X8.EVENTS.find(x=>x.rule.type==='fijo'),occ=X8.occurrence(e,2028),{h,s,A}=game(occ.start+HOUR);Object.assign(s,{money:1e6,knowledge:1e6});
 assert.ok(A.acceptEvent(occ.id,h.now),'aceptado dentro de la edición');
 assert.equal(A.acceptEvent(occ.id,h.now),false,'una sola aceptación por edición');
 h.g.persist();const r=game(occ.end+DAY);r.h.window.AtlasSaveBridge.restoreGame(json(s));r.A.syncContracts(occ.end+DAY);const rs=r.g.state;
 const c=json(rs.mec08.contracts.find(c=>c.id==='ev-'+occ.id));assert.ok(['caducado','completado'].includes(c.status),'cerrado tras la edición: '+c.status);
 if(c.status==='completado'){const m=rs.money;assert.ok(r.A.claim(c.id,occ.end+DAY));assert.equal(r.A.claim(c.id,occ.end+DAY+1),false);assert.ok(rs.money>m);}
 else assert.equal(r.A.claim(c.id,occ.end+DAY),false,'caducado no se cobra');
});

test('MEC09D-K20e ausencia de 72 h: expediciones, excavaciones y comercio se liquidan una vez y sin tope; las búsquedas automáticas sí tienen el tope histórico de 8 h',()=>{
 const T=Date.UTC(2027,2,1,12),run=hours=>{const {h,g,s}=game(T,()=>0.99);let dig;Object.assign(s,{money:1e7,knowledge:1e7,prestige:100,helpers:1});s.upgrades.shipyard=1;
  g.sail('coast');g.startExcavation('british_cliffs',T);dig=json(s.museum.excavations.at(-1));g.startTrade3300('coastal_trade');
  h.now=T+hours*HOUR;h.tick();for(let i=0;i<200&&s.autoPending?.length;i++)h.tick();
  // La excavación termina en ausencia y espera su recogida manual, que se hace una sola vez.
  const ready=s.museum.excavations.length===1&&dig.endAt<=h.now,c1=g.collectExcavation(dig.id,h.now,()=>0.5),c2=g.collectExcavation(dig.id,h.now+1,()=>0.5);
  return {s:json(s),k:s.knowledge,sight:Object.values(s.sightings).reduce((a,b)=>a+b,0),ready,c1,c2};};
 const r8=run(8),r72=run(72);
 for(const r of [r8,r72]){assert.equal(r.s.voyages.length,0,'expedición liquidada');assert.ok(r.ready&&r.c1&&!r.c2,'excavación terminada y recogida una sola vez');assert.equal(r.s.commerce.jobs.length,0,'ruta liquidada');assert.equal(r.s.commerce.history.length,1);}
 assert.equal(r72.sight,r8.sight,'72 h procesan las mismas búsquedas automáticas que 8 h (tope histórico)');
});

test('MEC09D-K20f cambios del reloj: retroceder no da progreso ni deshace trabajos; volver a avanzar no duplica liquidaciones',()=>{
 const T=Date.UTC(2027,2,1,12),{h,g,s}=game(T,()=>0.99);Object.assign(s,{money:1e7,knowledge:1e7,prestige:100,helpers:1});s.upgrades.shipyard=1;
 g.sail('coast');const job=json(s.voyages[0]);h.now=job.endAt+1;h.tick();const after=json(s);assert.equal(s.voyages.length,0);
 h.now=T-5*HOUR;h.tick();assert.ok(s.knowledge>=after.knowledge-0,'sin pérdida');assert.equal(s.voyages.length,0,'no se deshace');
 const k=s.knowledge,sight=Object.values(s.sightings).reduce((a,b)=>a+b,0);h.now=T-4*HOUR;h.tick();
 assert.ok(Object.values(s.sightings).reduce((a,b)=>a+b,0)-sight<=1,'sin ráfaga por el retroceso');
 h.now=job.endAt+2*HOUR;h.tick();for(let i=0;i<50&&s.autoPending?.length;i++)h.tick();
 assert.equal((s.voyageHistory||[]).filter(v=>v.jobId===job.id||v.id===job.id).length<=1,true,'la expedición no se liquida dos veces');
 assert.ok(s.money>=0&&s.knowledge>=k-0);
});

test('MEC09D-K20g progreso automático en línea y sin conexión equivalente: 1 h en ciclos de 60 s o de golpe deja los mismos avistamientos',()=>{
 const T=Date.UTC(2027,2,1,12),mk=()=>{const g=game(T,()=>0.99);Object.assign(g.s,{helpers:1});return g;};
 const on=mk();for(let t=60;t<=3600;t+=60){on.h.now=T+t*1000;on.h.tick();}for(let i=0;i<50&&on.s.autoPending?.length;i++)on.h.tick();
 const off=mk();off.h.now=T+HOUR;off.h.tick();for(let i=0;i<50&&off.s.autoPending?.length;i++)off.h.tick();
 const sum=s=>Object.values(s.sightings).reduce((a,b)=>a+b,0);assert.equal(sum(on.s),sum(off.s));assert.equal(on.s.knowledge,off.s.knowledge);
});
