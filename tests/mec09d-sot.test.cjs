'use strict';
// MEC-09D §10 · Fuente única de verdad: las copias secundarias de datos coinciden con la fuente del juego y las
// definiciones repetidas entre módulos son coherentes. Informe: docs/mec09d/fuente-unica.md.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {make}=require('./helpers/mec01-game.cjs');
const h=make({full:true,headless:true}),g=h.g;
const load=(f,expr)=>{const c={console};c.globalThis=c;vm.runInNewContext(fs.readFileSync(f,'utf8')+'\n;globalThis.__x='+expr+';',c);return JSON.parse(JSON.stringify(c.__x));};
const json=x=>JSON.parse(JSON.stringify(x));

test('MEC09D-F1 el catálogo de láminas (naturalist-art/catalog.js) coincide con SPECIES y REGIONS en las 1000 especies',()=>{
 const cat=load('www/naturalist-art/catalog.js','catalog');assert.equal(cat.length,1000);
 assert.deepEqual(cat.map(c=>c.id).sort(),Object.keys(g.SPECIES).sort());
 for(const c of cat){const sp=g.SPECIES[c.id];
  assert.deepEqual([c.name,c.latin,c.rarity],[sp.name,sp.latin,sp.rare],c.id);
  assert.deepEqual([...c.habitats].sort(),json(sp.habitats).sort(),c.id+' hábitats');
  assert.deepEqual(c.regions.map(r=>r.id).sort(),json(g.REGIONS.filter(r=>r.species.includes(c.id)).map(r=>r.id)).sort(),c.id+' regiones');}
});

test('MEC09D-F2 la revisión de relictos (relict-catalog.js) coincide con MUSEUM_RELICTS: nombre, nombre científico, localidad y código de región',()=>{
 const rel=load('www/naturalist-art/relict-catalog.js','AtlasRelictReview');assert.equal(rel.length,20);
 for(const r of rel){const m=g.MUSEUM_RELICTS.find(x=>x.id===r.id);assert.ok(m,r.id);assert.deepEqual([r.name,r.latin,r.locality],[m.name,m.latin,m.locality],r.id);
  assert.equal(r.hex,g.REGIONS.find(x=>x.id===m.region).code,r.id+' región');}
});

test('MEC09D-F3 la compuerta cartográfica tiene una sola verdad: reglas continentales, compuertas INV 3.40, mapas de cartografía e investigaciones coinciden',()=>{
 const gates=json(g.CARTOGRAPHIC_GATES3400),rules=Object.fromEntries(Object.entries(json(g.CONTINENT_RULES3300)).filter(([,v])=>v.cartography).map(([k,v])=>[k,v.cartography]));
 assert.deepEqual(rules,gates);
 const maps=Object.fromEntries(g.CARTOGRAPHY3400.map(d=>[d.continent,d.map]));for(const [c,m] of Object.entries(gates))if(maps[c])assert.equal(maps[c],m,c);
 const research=Object.fromEntries(g.RESEARCH_NODES.filter(n=>n.reqItem).map(n=>[n.id,n.reqItem]));
 assert.deepEqual(research,{asia_1:'asia_map',africa_1:'africa_map',nuevo_mundo_1:'oceanic_quadrant',norteamerica_1:'north_america_map'});
});

test('MEC09D-F4 el drop experimental universal de coleccionables y rarezas por especie sigue desactivado',()=>{
 const ch=json(h.x.AtlasBeta560Actions.drops.channels());
 for(const id of ['coleccionables','rarezas'])assert.deepEqual(ch.find(c=>c.id===id).rates.campo,{manual:0,auto:0},id);
 assert.deepEqual(ch.find(c=>c.id==='historicos').rates.campo,{manual:0.02,auto:0.005},'materiales históricos sin cambios');
});

test('MEC09D-F5 récords, conductas, legendarios y relictos apuntan a la fuente única de especies y regiones',()=>{
 const c={};c.globalThis=c;vm.runInNewContext(fs.readFileSync('www/js/mec07-natural-records.js','utf8'),c);const M=c.AtlasMEC07;
 for(const e of [...M.RECORDS,...M.BEHAVIORS])assert.ok(g.SPECIES[e.species],e.id);
 for(const l of g.LEGENDARY_SPECIMENS)assert.ok(g.SPECIES[l.speciesId],l.id);
 for(const r of g.MUSEUM_RELICTS)assert.ok(g.REGIONS.some(x=>x.id===r.region),r.id);
});
