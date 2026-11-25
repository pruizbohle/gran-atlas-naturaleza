'use strict';
// MEC-09A · Integridad estructural de catálogos (sección 19), catálogo completo y motor real.
const test=require('node:test'),assert=require('node:assert/strict');
const {make}=require('./helpers/mec01-game.cjs'),{audit}=require('../scripts/audit-mec09a-catalog.cjs');
test('MEC-09A · C1 auditoría estructural sin problemas: ids, referencias, recetas, investigaciones, colecciones, artefactos, récords, encargos, plantillas, eventos y logros',()=>{
 const h=make({now:1790000000000,headless:true,full:true}),rows=audit(h);
 for(const r of rows)assert.deepEqual(r.problems,[],r.id);
 const n=Object.fromEntries(rows.map(r=>[r.id,r.total]));
 assert.equal(n['especies-unicas'],1000);assert.equal(n['regiones-unicas'],125);assert.equal(n.coleccionables,431);assert.equal(n.colecciones,32);assert.equal(n.artefactos,20);
 assert.equal(n['materiales-animales'],27);assert.equal(n.records,25);assert.equal(n.conductas,20);assert.equal(n.rangos,20);assert.equal(n.eventos,10);assert.equal(n['legendarios-relictos'],50);
});
test('MEC-09A · C2 los eventos no alteran las estaciones zoológicas ni el reloj de juego',()=>{
 const h=make({now:new Date(2027,11,25,12).getTime(),headless:true,full:true}),s=h.g.state,season=s.season,time=s.time;
 h.x.AtlasMEC08.active(h.now);h.x.AtlasMEC08Actions.syncContracts(h.now);h.g.tick();assert.equal(s.season,season);assert.equal(s.time,time);
});
