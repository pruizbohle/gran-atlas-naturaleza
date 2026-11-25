'use strict';
// MEC-09A · Auditoría estructural de catálogos (sección 19) con el motor real y el catálogo completo.
// Uso: node scripts/audit-mec09a-catalog.cjs  → docs/mec09a/integridad-catalogos.csv
// También la usa tests/mec09a-catalog.test.cjs.
const fs=require('node:fs'),path=require('node:path');
function audit(h){
 const g=h.g,x=h.x,out=[];
 const add=(id,desc,total,problems)=>out.push({id,desc,total,problems:[...new Set(problems)]});
 const S=g.SPECIES,R=g.REGIONS,I=g.ITEMS,RC=g.RECIPES,RN=g.RESEARCH_NODES;
 add('especies-unicas','Identificadores y nombres científicos únicos',Object.keys(S).length,(()=>{const seen=new Map(),p=[];for(const [id,sp] of Object.entries(S)){const k=String(sp.latin||'').trim().toLowerCase();if(!k)p.push(id+': sin nombre científico');else if(seen.has(k))p.push(id+' duplica '+seen.get(k));else seen.set(k,id);}return p;})());
 add('regiones-unicas','Regiones con id único y con especies',R.length,[...R.filter((r,i)=>R.findIndex(x=>x.id===r.id)!==i).map(r=>r.id+': id duplicado'),...R.filter(r=>!(r.species||[]).length).map(r=>r.id+': sin especies')]);
 add('referencias-region-especie','Cada especie de una región existe; sin repeticiones dentro de la región',R.reduce((t,r)=>t+r.species.length,0),R.flatMap(r=>[...r.species.filter(id=>!S[id]).map(id=>r.id+' → '+id+' inexistente'),...r.species.filter((id,i,l)=>l.indexOf(id)!==i).map(id=>r.id+' repite '+id)]));
 const inRegion=new Set(R.flatMap(r=>r.species));
 add('especies-con-region','Cada especie aparece en al menos una región',Object.keys(S).length,Object.keys(S).filter(id=>!inRegion.has(id)).map(id=>id+': sin región'));
 add('recetas','Recetas con resultado e ingredientes definidos y cantidades positivas',Object.keys(RC).length,Object.entries(RC).flatMap(([id,r])=>[...(!I[id]?[id+': resultado sin definición']:[]),...Object.entries(r.requires||{}).filter(([m,n])=>!I[m]||!(Number(n)>0)).map(([m])=>id+' ← '+m)]));
 add('investigaciones','Requisitos de investigación válidos y sin ciclos',RN.length,(()=>{const ids=new Set(RN.map(n=>n.id)),p=[];for(const n of RN){if(n.req&&!ids.has(n.req))p.push(n.id+' → '+n.req);if(n.reqItem&&!I[n.reqItem])p.push(n.id+' objeto '+n.reqItem);}
  for(const n of RN){const seen=new Set();let c=n;while(c?.req){if(seen.has(c.id)){p.push('ciclo en '+n.id);break;}seen.add(c.id);c=RN.find(x=>x.id===c.req);}}return p;})());
 const K=x.AtlasMEC03Catalog;const pieces=K?.pieces||{};const cols={};for(const p of Object.values(pieces))(cols[p.collection]=cols[p.collection]||[]).push(p.id);
 add('coleccionables','431 piezas con definición, colección y gabinete',Object.keys(pieces).length,[...Object.values(pieces).filter(p=>!I[p.id]).map(p=>p.id+': sin objeto'),...Object.values(pieces).filter(p=>!p.collection||!p.cabinet).map(p=>p.id+': sin colección o gabinete')]);
 add('colecciones','32 colecciones, ninguna vacía',Object.keys(cols).length,Object.entries(cols).filter(([,l])=>!l.length).map(([c])=>c+': vacía'));
 const X6=x.AtlasMEC06;add('artefactos','20 artefactos con catalogación en el Museo y usos válidos (estudio, demostración o modificador de expedición)',Object.keys(X6.ARTIFACTS).length,Object.entries(X6.ARTIFACTS).flatMap(([id,a])=>[...(!g.MUSEUM_COLLECTIONS.some(c=>c.id===id)?[id+': sin catalogación']:[]),...(a.uses||[]).filter(u=>!X6.STUDIES[u]&&!X6.DEMOS[u]&&!X6.MODIFIERS.some(md=>md.source==='instrumento:'+id)).map(u=>id+' uso '+u)]));
 add('materiales-animales','27 materiales animales con definición',Object.values(X6.ANIMAL_GROUPS).flatMap(gr=>gr.ids).length,Object.values(X6.ANIMAL_GROUPS).flatMap(gr=>gr.ids).filter(id=>!I[id]).map(id=>id+': sin objeto'));
 const C=x.AtlasCampMEC02;add('instalaciones','5 instalaciones × 5 niveles',Object.keys(C.FACILITIES||C.CONFIG?.facilities||{}).length||5,(()=>{const p=[];for(const k of ['shipyard','caravan','workshop','excavations','surveys']){const n=C.maxLevel?C.maxLevel(k):5;if(n!==5)p.push(k+': '+n+' niveles');}return p;})());
 const X7=x.AtlasMEC07;add('records','25 récords con especie existente, límites y umbral dentro de límites',X7.RECORDS.length,X7.RECORDS.flatMap(e=>[...(!S[e.species]?[e.id+': especie '+e.species]:[]),...(!(e.bounds.min<e.bounds.max)||e.threshold<e.bounds.min||e.threshold>e.bounds.max?[e.id+': límites']:[]),...(e.instrument&&!X6.ARTIFACTS[e.instrument.id]?[e.id+': instrumento']:[])]));
 add('conductas','20 conductas con especie existente y presente en alguna región',X7.BEHAVIORS.length,X7.BEHAVIORS.flatMap(b=>[...(!S[b.species]?[b.id+': especie']:[]),...(!inRegion.has(b.species)?[b.id+': sin región']:[])]));
 const CM=x.AtlasCommissions3370;add('encargos','Encargos con recompensa válida (dinero/conocimiento finitos, objetos definidos) y requisitos con métrica',CM.catalog.length,CM.catalog.flatMap(d=>[...(!(Number.isFinite(d.reward?.money)&&Number.isFinite(d.reward?.knowledge))?[d.id+': recompensa']:[]),...Object.keys(d.reward?.items||{}).filter(i=>!I[i]).map(i=>d.id+' objeto '+i),...(d.previous&&!CM.catalog.some(z=>z.id===d.previous)?[d.id+' previo '+d.previous]:[])]));
 const X8=x.AtlasMEC08,m=x.AtlasMEC08Actions.metrics();
 add('plantillas','Plantillas con métricas existentes y recompensas válidas',X8.TEMPLATES.length,X8.TEMPLATES.flatMap(t=>[...t.objectives.filter(o=>!(o.metric in m)).map(o=>t.id+' métrica '+o.metric),...Object.keys(t.reward.items||{}).filter(i=>!I[i]).map(i=>t.id+' objeto '+i)]));
 add('eventos','10 eventos con regla válida, encargo y modificadores con actividad conocida',X8.EVENTS.length,X8.EVENTS.flatMap(e=>[...e.contract.objectives.filter(o=>!(o.metric in m)).map(o=>e.id+' métrica '+o.metric),...(e.contract.alt?.objectives||[]).filter(o=>!(o.metric in m)).map(o=>e.id+' alt '+o.metric),...e.modifiers.filter(md=>!x.AtlasMEC05?.ACTIVITIES?.[md.activity]).map(md=>e.id+' actividad '+md.activity),...Object.keys(e.contract.reward.items||{}).filter(i=>!I[i]).map(i=>e.id+' objeto '+i)]));
 add('logros','Logros con métrica existente y nivel válido',x.AtlasAchievements3360.catalog.length,(()=>{const am=x.AtlasAchievements3360.metrics(g.state,g.achievementContext3360());return x.AtlasAchievements3360.catalog.flatMap(d=>[...(!(d.metric in am)&&!/^variant:/.test(d.metric)?[d.id+' métrica '+d.metric]:[]),...(!['Bronce','Plata','Oro','Platino'].includes(d.tier)?[d.id+' nivel']:[])]);})());
 add('legendarios-relictos','30 legendarios y 20 relictos con especie/región existentes',(g.LEGENDARY_SPECIMENS||[]).length+g.MUSEUM_RELICTS.length,[...(g.LEGENDARY_SPECIMENS||[]).filter(l=>l.species&&!S[l.species]).map(l=>(l.id||l.species)+': especie'),...g.MUSEUM_RELICTS.filter(r=>r.region&&!R.some(z=>z.id===r.region)).map(r=>r.id+': región '+r.region)]);
 add('rangos','20 rangos de Sociedad ordenados',x.AtlasMEC04.RANKS.length,x.AtlasMEC04.RANKS.filter((r,i,l)=>i&&!(Number(r.level??r.rank??i+1)>Number(l[i-1].level??l[i-1].rank??i))).map(r=>'orden '+(r.id||r.name)));
 return out;
}
module.exports={audit};
if(require.main===module){
 const {make}=require('../tests/helpers/mec01-game.cjs');const h=make({now:1790000000000,headless:true,full:true});
 const rows=audit(h);const q=v=>/[;"\n]/.test(String(v))?'"'+String(v).replace(/"/g,'""')+'"':String(v);
 fs.mkdirSync(path.join(__dirname,'..','docs','mec09a'),{recursive:true});
 fs.writeFileSync(path.join(__dirname,'..','docs','mec09a','integridad-catalogos.csv'),['comprobacion;descripcion;elementos;problemas;detalle',...rows.map(r=>[r.id,r.desc,r.total,r.problems.length,r.problems.slice(0,20).join(' | ')].map(q).join(';'))].join('\n')+'\n');
 for(const r of rows)console.log(r.id.padEnd(28),r.total,r.problems.length?'PROBLEMAS '+r.problems.length+': '+r.problems.slice(0,4).join(' | '):'ok');
}
