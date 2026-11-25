'use strict';
// MEC-09D §17 · Grafo de dependencias de progresión (scripts/mec09d-graph.cjs sobre el grafo del motor real).
// Informe: docs/mec09d/grafo-progresion.md.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {analyze}=require('../scripts/mec09d-graph.cjs'),{make}=require('./helpers/mec01-game.cjs');
const h=make({full:true,headless:true}),g=h.g;
const sourceResearch=Object.fromEntries(g.CARTOGRAPHY3400.map(d=>[d.continent,d.sourceResearch||null]));
const A=analyze('docs/mec09b/grafo-dependencias.csv',sourceResearch);

test('MEC09D-G17a el grafo cubre los 1230 nodos de progresión y todas sus referencias existen',()=>{
 assert.equal(A.nodes,1230);
 assert.deepEqual(JSON.parse(JSON.stringify(A.byType)),{'investigación':57,'continente':10,'región':125,'objeto':524,'expedición':19,'ruta comercial':4,'yacimiento':10,'instalación':25,'rango':20,'Museo':5,'coleccionable':431});
 assert.deepEqual(A.dangling,[],'referencias rotas');
});

test('MEC09D-G17b sin ciclos de dependencias obligatorias y todo nodo alcanzable por una cadena legítima desde la partida nueva',()=>{
 assert.deepEqual(A.cycles,[],'ciclos obligatorios');assert.deepEqual(A.unreachable,[],'bloqueos permanentes o requisitos imposibles');
 // Las fuentes de los mapas del estudio «cálculo de derrotas» ya no se dan por supuestas: exigen su investigación de origen.
 assert.deepEqual(JSON.parse(JSON.stringify(sourceResearch)),{'Asia':null,'África':null,'Norteamérica':null,'Sudamérica':'norteamerica_1','Oceanía':'sudamerica_1','Polos':'oceania_1'});
});

test('MEC09D-G17c los continentes se abren en orden estricto y cada uno exige el anterior (sin accesos prematuros en el grafo)',()=>{
 const step=Object.fromEntries(A.milestones.map(m=>[m.id,m.step]));
 const order=['Europa','Asia','África','Norteamérica','Sudamérica','Oceanía','Polos','Océanos','Fosas abisales'];
 for(let i=1;i<order.length;i++)assert.ok(step['continent:'+order[i]]>step['continent:'+order[i-1]],order[i]+' después de '+order[i-1]);
 assert.ok(step['continent:Océanos profundos']>step['continent:Polos']&&step['continent:Fosas abisales']>step['continent:Océanos profundos']);
 for(let r=2;r<=20;r++)assert.ok(step['rank:'+r]>step['rank:'+(r-1)],'rango '+r);
 for(let m=2;m<=5;m++)assert.ok(step['museum:'+m]>step['museum:'+(m-1)],'Museo '+m);
});

test('MEC09D-G17d sin accesos prematuros en el motor: en una partida nueva solo Europa es accesible y ninguna investigación salta su requisito',()=>{
 const s=g.state;
 for(const r of g.REGIONS)if(r.continent!=='Europa')assert.equal(g.regionRequirementsMet(r),false,r.id);
 for(const n of g.RESEARCH_NODES)if(n.req&&!s.purchases[n.req]){s.money=1e9;s.knowledge=1e9;s.prestige=1e6;assert.equal(!!g.canBuy(n),false,n.id+' sin '+n.req);}
});

test('MEC09D-G17e evidencia de cadena real (controlador MEC-09B, sin ayudas): alcanza ocho continentes, rango 20, Campamento 5×5 y Museo 5',()=>{
 for(const f of ['29','31']){const j=JSON.parse(fs.readFileSync('docs/mec09b/progresion-controlador-'+f+'.json','utf8')).final;
  assert.deepEqual(j.continents,['Europa','Asia','África','Norteamérica','Sudamérica','Oceanía','Polos','Océanos']);assert.equal(j.rank,20);assert.equal(j.wing,5);
  assert.deepEqual(Object.values(j.camp),[5,5,5,5,5]);}
});
