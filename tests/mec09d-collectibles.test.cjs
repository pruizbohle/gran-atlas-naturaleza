'use strict';
// MEC-09D §11–§13 · Las 431 piezas y las 32 colecciones, una por una, con el motor vigente (1000/125).
// Para cada pieza se busca, entre sus fuentes declaradas, un contexto legítimo en el que la SELECCIÓN REAL del
// motor la entrega (pozo y sorteo del motor MEC-03 con el azar dirigido; Campo y observación por sus funciones
// completas de búsqueda; Caravana por las ofertas deterministas reales de cada periodo) y se incorpora por la vía
// real (grant → inventario + registro permanente + procedencia). Luego: colección, duplicados, excedentes,
// persistencia y recarga. Matriz: docs/mec09d/piezas.csv (scripts/mec09d-collectibles.cjs).
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {acquireAll,game}=require('../scripts/mec09d-collectibles.cjs');
const RUN=acquireAll();

test('MEC09D-K0 catálogo: 431 piezas, 32 colecciones, identificadores únicos, objeto de inventario y al menos una fuente no eventual',()=>{
 assert.equal(RUN.pieces.length,431);assert.equal(new Set(RUN.pieces.map(p=>p.id)).size,431);
 assert.equal(new Set(RUN.pieces.map(p=>p.collection)).size,32);
 for(const p of RUN.pieces){assert.ok(p.item,p.id+' objeto');assert.ok(p.declared.filter(s=>s!=='eventos').length,p.id+' fuente');}
 assert.deepEqual(RUN.broken,[],'referencias rotas en las fuentes (rutas, yacimientos, recetas, especies, continentes, biomas)');
});

test('MEC09D-K1 las 431 piezas se obtienen por la selección real del motor y entran en inventario y registro permanente',()=>{
 const missing=RUN.pieces.filter(p=>!p.obtainedBy);
 assert.deepEqual(missing.map(p=>p.id+' ['+p.declared.join(',')+']'),[]);
 for(const p of RUN.pieces){assert.ok(p.inventory>=1,p.id+' inventario');assert.ok(p.registered,p.id+' registro');}
});

test('MEC09D-K2 fuentes declaradas pero no operativas: ninguna pieza depende solo de una fuente inoperante',()=>{
 for(const p of RUN.pieces){const active=p.declared.filter(s=>p.operative[s]);assert.ok(active.length,p.id);}
 // Fuentes declaradas sin ningún contexto legítimo que las active (se documentan; la pieza tiene otra fuente).
 assert.deepEqual(RUN.inoperative.filter(x=>!RUN.pieces.find(p=>p.id===x.id).obtainedBy),[]);
});

test('MEC09D-K3 las 32 colecciones se completan con piezas obtenidas legítimamente y ninguna depende de eventos no repetibles',()=>{
 for(const c of RUN.collections){assert.equal(c.obtained,c.total,c.name);assert.ok(c.total>0,c.name+' tamaño');assert.equal(c.eventOnly,0,c.name+' solo eventos');}
});

test('MEC09D-K4 duplicados ilimitados: obtener de nuevo suma unidades pero no progreso; excedentes intercambiables y última unidad protegida',()=>{
 const g=game(),{A3,M,CAT,s}=g,id=RUN.pieces[0].id,col=RUN.pieces[0].collection;
 for(let i=0;i<6;i++)assert.equal(A3.grant(id,1,'campo','campo:ambiental','HX-01-09'),true);
 assert.equal(s.inventory[id],6);assert.equal(M.discovered(s,id),true);
 const before=M.discoveredCount(s,CAT);assert.equal(before,1,'el progreso cuenta piezas distintas');
 const st=JSON.parse(JSON.stringify(A3.stock(id)));assert.equal(st.owned,6);assert.equal(st.tradable,5,'una unidad protegida');assert.equal(st.protected,1);
 // Intercambio con la regla real (misma colección): nunca entrega la pieza objetivo ni la última unidad.
 const target=RUN.pieces.find(p=>p.collection===col&&p.id!==id).id;
 const give=A3.engine.chooseGive(s,{collection:col,minRarity:0,count:3},target,x=>M.reserved(s,x));
 assert.deepEqual(JSON.parse(JSON.stringify(give)),{[id]:3});
 const none=A3.engine.chooseGive(s,{collection:col,minRarity:0,count:6},target,x=>M.reserved(s,x));assert.equal(none,null,'no alcanza sin tocar la última unidad');
});

test('MEC09D-K5 persistencia: inventario, registro, procedencias y progreso de colección sobreviven a guardar y recargar',()=>{
 assert.equal(RUN.reload.discovered,431);assert.equal(RUN.reload.inventoryMatches,true);assert.equal(RUN.reload.findsLogged>0,true);
});
