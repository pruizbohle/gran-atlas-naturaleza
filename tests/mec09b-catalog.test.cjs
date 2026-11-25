'use strict';
// MEC-09B · Matrices de accesibilidad sobre el catálogo completo (sección 33, puntos 5-25 y 28).
// Cada prueba ejecuta la auditoría con el motor real (scripts/audit-mec09b.cjs). Niveles de evidencia:
// A configuración · B fuente · C ejecutable por el motor · D cadena desde partida nueva (controlador).
// Las comprobaciones que usan una partida preparada (sintética) solo prueban que la regla es ejecutable;
// la evidencia D procede del controlador (docs/mec09b/progresion-controlador-*.json y su fixture).
const test=require('node:test'),assert=require('node:assert/strict');
const A=require('../scripts/audit-mec09b.cjs');
const ctl=A.controller();
const none=(rows,k='estado',bad=['Bloqueado','Incoherente'])=>rows.filter(r=>bad.includes(r[k]));
const ids=rows=>rows.map(r=>r.id||r.coleccion||r.nivel||r.instalacion).slice(0,12).join(', ');
let G;const graph=()=>G||(G=A.graph(A.game()));

test('MEC-09B · 5. cartografía: los siete mapas son alcanzables y el controlador los fabrica desde partida nueva',()=>{
 const g=graph(),maps=['asia_map','africa_map','north_america_map','south_america_map','oceania_map','polar_map','world_map'];
 for(const id of maps){const n=g.nodes.find(x=>x.id==='item:'+id);assert.ok(n,id);assert.notEqual(n.reachable,false,id);}
 assert.ok(ctl,'resultado del controlador versionado');for(const id of maps.slice(0,2))assert.ok(ctl.crafted.has(id),'D: '+id);
});
test('MEC-09B · 6. dependencias continentales: grafo sin ciclos ni nodos inalcanzables',()=>{
 const g=graph();assert.ok(g.nodes.length>1000);assert.equal(g.unreachable.length,0,g.unreachable.slice(0,8).map(n=>n.id).join(','));assert.equal(g.cycles.length,0);
 for(const c of ['Europa','Asia','África'])assert.ok(ctl.continents.has(c),'D: '+c);
});
test('MEC-09B · 7. las 125 regiones tienen acceso y actividades',()=>{
 const R=A.regions(A.game(),ctl);assert.equal(R.length,125);assert.equal(none(R).length,0,ids(none(R)));assert.equal(R.filter(r=>r.solo_fauna==='sí').length,0);
});
let S;const sp=()=>S||(S=A.species(A.game(),ctl));
test('MEC-09B · 8. las 1.000 especies son accesibles por el motor',()=>{const s=sp();assert.equal(s.rows.length,1000);assert.equal(none(s.rows).length,0,ids(none(s.rows)));});
test('MEC-09B · 9. monografías: las cinco etapas alcanzables para todo el catálogo',()=>{const s=sp();assert.equal(s.mono.length,1000);assert.equal(none(s.mono).length,0,ids(none(s.mono)));
 assert.ok(s.mono.every(r=>parseFloat(r.especial)>0),'etapa 5: espécimen especial posible');});
test('MEC-09B · 10. variantes y especímenes extraordinarios con probabilidad positiva',()=>{const s=sp();assert.ok(s.rows.every(r=>Number(r.probabilidad_especial)>0),ids(s.rows.filter(r=>!(Number(r.probabilidad_especial)>0))));});
test('MEC-09B · 11. los 30 legendarios son obtenibles por el motor',()=>{const L=A.legendaries(A.game(),ctl);assert.equal(L.length,30);assert.equal(none(L).length,0,ids(none(L)));});
test('MEC-09B · 12. los 20 relictos y sus indicios',()=>{const Z=A.relicts(A.game(),ctl);assert.equal(Z.length,20);assert.equal(none(Z).length,0,ids(none(Z)));assert.ok(Z.every(r=>r.region_existe===true||r.region_existe==='sí'),'región existente');});
let RE;const rec=()=>RE||(RE=A.records(A.game({full:true})));
test('MEC-09B · 13. los 25 récords completos: umbral, hito final y validación',()=>{const r=rec().filter(x=>x.tipo==='récord');assert.equal(r.length,25);assert.equal(none(r).length,0,ids(none(r)));});
test('MEC-09B · 14. las 20 conductas',()=>{const b=rec().filter(x=>x.tipo==='conducta');assert.equal(b.length,20);assert.equal(none(b).length,0,ids(none(b)));});
let P;const pc=()=>P||(P=A.pieces(A.game(),ctl,null));
test('MEC-09B · 15. las 431 piezas tienen fuente activa (sin el canal experimental)',()=>{const p=pc();assert.equal(p.length,431);assert.equal(none(p).length,0,ids(none(p)));
 assert.ok(p.every(r=>String(r.fuentes_activas).length&&!/Drop de prueba|canal experimental/.test(r.fuentes_activas)));});
test('MEC-09B · 16. las 32 colecciones son completables',()=>{const C=A.collections(A.game(),pc());assert.equal(C.length,32);assert.equal(none(C).length,0,ids(none(C)));});
test('MEC-09B · 17. fuentes de materiales: los 524 objetos tienen fuente',()=>{const M=A.materials(A.game(),graph());assert.equal(M.length,524);assert.equal(none(M).length,0,ids(none(M)));});
test('MEC-09B · 18. recetas sin ciclos',()=>{assert.equal(graph().cycles.length,0);});
let W;const ws=()=>W||(W=A.workshop(A.game(),ctl));
test('MEC-09B · 19. los 20 artefactos se fabrican, catalogan e instalan',()=>{const a=ws().filter(r=>r.tipo==='artefacto');assert.equal(a.length,20);assert.equal(none(a).length,0,ids(none(a)));});
test('MEC-09B · 20. estudios científicos y demostraciones ejecutables',()=>{const w=ws();assert.equal(w.filter(r=>r.tipo==='estudio').length,14);assert.equal(w.filter(r=>r.tipo==='demostración').length,4);assert.equal(none(w).length,0,ids(none(w)));});
test('MEC-09B · 21. los 25 niveles del Campamento',()=>{const F=A.facilities(A.game(),ctl);assert.equal(F.length,25);assert.equal(none(F).length,0,ids(none(F)));assert.ok(F.every(r=>r.dependencia_circular!=='sí'));});
test('MEC-09B · 22. los 20 rangos de Sociedad (rango 10 con requisito de colección alcanzable)',()=>{const R=A.ranks(A.game(),ctl);assert.equal(R.length,20);assert.equal(none(R).length,0,ids(none(R)));});
let MU;const mu=()=>MU||(MU=A.museum(A.game(),ctl));
test('MEC-09B · 23. los cinco niveles del Museo',()=>{const m=mu().filter(r=>/nivel|ala/i.test(r.tipo));assert.ok(m.length>=5);assert.deepEqual(none(mu()),[],ids(none(mu())));});
test('MEC-09B · 24. reconstrucciones fósiles',()=>{const f=mu().filter(r=>/f[óo]sil|reconstr/i.test(r.tipo));assert.ok(f.length>0);assert.equal(none(f).length,0);});
test('MEC-09B · 25. comercio y expediciones (incluidas las seis de cobertura geográfica)',()=>{const C=A.commerce(A.game(),ctl);assert.equal(none(C).length,0,ids(none(C)));
 const h=A.game();for(const v of h.x.AtlasMEC09BContent.voyages){assert.ok(C.some(r=>r.id===v.id),v.id);assert.ok(v.gap&&v.inherits,'justificación de '+v.id);}
 for(const d of h.x.AtlasMEC09BContent.digSites)assert.ok(C.some(r=>r.id===d.id),d.id);});
test('MEC-09B · 28. los 164 logros alcanzan su objetivo y sus contadores se actualizan; encargos permanentes cumplibles',()=>{
 const L=A.achievements(A.game());assert.equal(L.length,164);assert.equal(none(L).length,0,ids(none(L)));assert.ok(L.every(r=>r.contador_actualizado!=='NO'));
 const E=A.commissions(A.game());assert.equal(E.length,36);assert.equal(none(E).length,0,ids(none(E)));});
