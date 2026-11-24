'use strict';
// MEC-07 · genera las matrices de hitos (docs/mec07/hitos.csv), conductas (conductas.csv),
// referencias artísticas (arte.csv) y la auditoría de accesibilidad (auditoria-registros.json)
// con el motor real y el catálogo completo. Uso: node scripts/build-mec07-records.cjs [--write]
const fs=require('node:fs'),path=require('node:path');process.chdir(path.join(__dirname,'..'));
const {make}=require('../tests/helpers/mec01-game.cjs');const audit=require('../tests/helpers/mec04-audit.cjs');
const h=make({now:1790000000000,headless:true,full:true});h.window.confirm=()=>true;const g=h.g,X=h.x.AtlasMEC07;
const q=v=>{const s=Array.isArray(v)?v.join(' | '):v&&typeof v==='object'?JSON.stringify(v):String(v??'');return /[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
const regs=id=>g.REGIONS.filter(r=>(r.species||[]).includes(id)).map(r=>r.id);
const cond=c=>Object.entries(c||{}).map(([k,v])=>k+': '+(Array.isArray(v)?v.join('/'):v)).join(' · ')||'las de la especie';
const a=audit.recordsAudit(h);
const H=['id','especie_id','especie','latin','nombre','tipo','unidad','direccion','modelo','limite_min','limite_max','umbral','prob_manual','prob_auto','condiciones','metodo','instrumento','cuaderno','regiones','horarios_validos','estaciones_validas','biomas_validos','p_umbral_muestreo','testigo_busquedas','fuente_cientifica','arte','estado'];
const rows=[H.join(';')];
for(const e of X.RECORDS){const sp=g.SPECIES[e.species],au=a.entries[e.id];
 rows.push([e.id,e.species,sp.name,sp.latin,e.name,e.type,e.unit,X.TYPES[e.type].direction,e.model,e.bounds.min,e.bounds.max,e.threshold,e.chance.manual,e.chance.auto,cond(e.conditions),X.METHODS[e.method],e.instrument?e.instrument.id+' ('+e.instrument.place+') · '+e.instrument.label:'',e.journal?'etapa '+e.journal.stage+' (alternativa a '+e.journal.alternativeTo+')':'',regs(e.species),au.times,au.seasons,au.habitats,au.plausibility?.pThreshold,au.witness?.searches,e.science,e.art,e.status].map(q).join(';'));}
const BH=['id','especie_id','especie','latin','nombre','categoria','prob_manual','prob_auto','condiciones','metodo','regiones','testigo_busquedas','fuente_cientifica','arte','estado'];
const brows=[BH.join(';')];
for(const b of X.BEHAVIORS){const sp=g.SPECIES[b.species],au=a.entries[b.id];brows.push([b.id,b.species,sp.name,sp.latin,b.name,b.category,b.chance.manual,b.chance.auto,cond(b.conditions),X.METHODS[b.method],regs(b.species),au.witness?.searches,b.science,b.art,b.status].map(q).join(';'));}
const art=['tipo;referencia;descripcion;reutiliza;necesita_arte_nuevo'];
for(const [k,t] of Object.entries(X.TYPES))art.push(['categoría',t.art,t.label,'—','sí'].map(q).join(';'));
for(const i of X.ART.indicators)art.push(['indicador',i,{'record-new-best':'Nueva marca personal','record-milestone':'Hito cumplido','record-evidence-pending':'Evidencia pendiente de validación','behavior-first':'Primera conducta'}[i],'—','sí'].map(q).join(';'));
for(const e of X.RECORDS){art.push(['hito',e.art,e.name+' · '+g.SPECIES[e.species].name,'ilustración zoológica existente de la especie','no (reutiliza)'].map(q).join(';'));art.push(['medalla futura',e.medal,'Medalla · '+e.name,'—','sí'].map(q).join(';'));}
for(const b of X.BEHAVIORS)art.push(['conducta',b.art,b.name+' · '+g.SPECIES[b.species].name,'ilustración zoológica existente de la especie','no (reutiliza)'].map(q).join(';'));
art.push(['evidencia científica','record-evidence','Lámina de evidencia (pendiente/validada)','—','sí'].join(';'));
const summary={hitos:X.RECORDS.length,conductas:X.BEHAVIORS.length,auditoria:a.ok,progreso:a.progress,problemas:Object.entries(a.entries).filter(([,v])=>v.problems.length).map(([k,v])=>k+': '+v.problems.join(', ')),testigos:Object.fromEntries(Object.entries(a.entries).map(([k,v])=>[k,v.witness])),arteNuevo:art.slice(1).filter(l=>l.endsWith(';sí')).length,arteReutiliza:art.slice(1).filter(l=>/no \(reutiliza\)$/.test(l)).length};
console.log(JSON.stringify({hitos:summary.hitos,conductas:summary.conductas,auditoria:summary.auditoria,problemas:summary.problemas,arteNuevo:summary.arteNuevo,arteReutiliza:summary.arteReutiliza}));
if(process.argv.includes('--write')){fs.writeFileSync('docs/mec07/hitos.csv','﻿'+rows.join('\n')+'\n');fs.writeFileSync('docs/mec07/conductas.csv','﻿'+brows.join('\n')+'\n');fs.writeFileSync('docs/mec07/arte.csv','﻿'+art.join('\n')+'\n');
 fs.writeFileSync('docs/mec07/auditoria-registros.json',JSON.stringify({...summary,entradas:a.entries,supuesto:a.assumption},null,1)+'\n');}
