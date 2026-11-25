'use strict';
// MEC-09D §4 · Integridad de contenido sobre el catálogo completo que carga www/index.html (1000/125).
// Informe: docs/mec09d/integridad-contenido.md. Las observaciones conocidas se fijan aquí de forma explícita:
// si aparece otra, la prueba falla; si se corrige alguna, también (hay que actualizar el informe).
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {make}=require('./helpers/mec01-game.cjs');
const APP=fs.readFileSync('www/js/app.js','utf8').replace(/\n\}\)\(\);\s*$/,'\nwindow.__i={configuredSpecials:sp=>configuredSpecials(sp)};\n})();');
const h=make({full:true,headless:true,app:APP}),g=h.g,S=g.SPECIES,R=g.REGIONS,ids=Object.keys(S),specials=sp=>[...h.window.__i.configuredSpecials(sp)];
const routes=(()=>{const c={};c.globalThis=c;vm.runInNewContext(fs.readFileSync('www/js/naturalist-assets-v400.js','utf8'),c);return c.AtlasNaturalistAssets.routes;})();
const SIZES=['','64/','128/','256/'];

test('MEC09D-I1 1000 especies y 125 regiones sin duplicados de identificador, nombre científico ni nombre común',()=>{
 assert.equal(ids.length,1000);assert.equal(R.length,125);assert.equal(new Set(R.map(r=>r.id)).size,125);
 const dup=(f)=>{const m=new Map();for(const id of ids){const k=f(S[id]);m.set(k,[...(m.get(k)||[]),id]);}return [...m].filter(([,v])=>v.length>1);};
 assert.deepEqual(dup(sp=>(sp.latin||'').toLowerCase().trim()),[]);assert.deepEqual(dup(sp=>sp.name),[]);
});

test('MEC09D-I2 referencias válidas: cada presencia regional apunta a una especie existente, sin repeticiones, y cada especie vive en alguna región con hábitat compatible',()=>{
 const present=new Set();
 for(const r of R){assert.ok(r.habitats?.length,r.id+' hábitats');assert.equal(new Set(r.species).size,r.species.length,r.id+' repetidas');for(const id of r.species){assert.ok(S[id],r.id+':'+id);present.add(id);}}
 for(const id of ids){const sp=S[id];assert.ok(present.has(id),id+' sin región');assert.ok(sp.habitats?.length&&sp.times?.length&&sp.seasons?.length,id+' condiciones');
  assert.ok(R.some(r=>r.species.includes(id)&&sp.habitats.some(hb=>r.habitats.includes(hb)))||R.some(r=>r.species.includes(id)&&g.automaticEligibleSpecies(r.id,sp.seasons[0]).includes(id)),id+' inaccesible');}
});

test('MEC09D-I3 recursos gráficos: cada especie tiene lámina normal, de cada pigmento configurado y de ambos sexos si hay dimorfismo, en los cuatro tamaños',()=>{
 const missing=[];
 for(const id of ids){const rt=routes[id];if(!rt){missing.push(id+' sin ruta');continue;}
  for(const f of Object.values(rt))for(const sz of SIZES)if(!fs.existsSync('www/naturalist-art/plates/'+sz+f))missing.push(sz+f);
  for(const v of specials(S[id])){const key={Albino:'albino','Melánico':'melanico'}[v];if(key&&!rt[key])missing.push(id+' '+v);}
  if(S[id].dimorphism&&!(rt.male&&rt.female))missing.push(id+' sexos');}
 assert.deepEqual(missing,[]);
});

test('MEC09D-I4 legendarios y relictos: referencias, láminas y una observación de catálogo documentada',()=>{
 const L=g.LEGENDARY_SPECIMENS;assert.equal(L.length,30);
 for(const l of L){assert.ok(S[l.speciesId],l.id);assert.ok(routes[l.speciesId]?.legendario,l.id+' lámina');}
 assert.equal(Object.entries(routes).filter(([id,r])=>r.legendario&&!L.some(l=>l.speciesId===id)).length,0,'láminas legendarias huérfanas');
 const REL=g.MUSEUM_RELICTS;assert.equal(REL.length,20);
 for(const r of REL){assert.ok(R.some(x=>x.id===r.region),r.id);for(const sz of SIZES)assert.ok(fs.existsSync('www/naturalist-art/relicts/'+sz+r.id+'.webp'),sz+r.id);}
 // Observación O1 (decisión del propietario, sin cambio de contenido): el relicto «Cocodrilo enano africano»
 // comparte nombre y especie (Osteolaemus tetraspis) con una ficha ordinaria del Bestiario en la misma región.
 const latin=new Map(ids.map(id=>[(S[id].latin||'').toLowerCase(),id]));
 assert.equal(JSON.stringify(REL.filter(r=>latin.has(r.latin.toLowerCase())).map(r=>r.id+'='+latin.get(r.latin.toLowerCase()))),JSON.stringify(['gabon_dwarf_croc=af_xlsx_cocodrilo_enano']));
});
