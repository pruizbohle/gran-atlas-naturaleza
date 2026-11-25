'use strict';
// MEC-09D · Trazabilidad de las pruebas históricas.
// Las guardas de 3.41/3.42 exigían que ninguna prueba histórica cambiara byte a byte. MEC-09D actualiza
// expectativas aprobadas de forma deliberada, así que la garantía equivalente es:
//  1. ninguna prueba se borra: cada título declarado en la revisión de partida (1500e42, MEC-09C) sigue
//     declarado en el mismo archivo;
//  2. todo archivo de prueba histórico modificado lleva la marca «MEC-09D» que explica el cambio;
//  3. ningún archivo de prueba de la revisión de partida desaparece.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const ROOT=path.join(__dirname,'..','..'),BASE='1500e42';
const git=(...a)=>cp.execFileSync('git',a,{cwd:ROOT,maxBuffer:64e6}).toString();
const titles=src=>[...src.matchAll(/(?:^|[;\s(])test\(\s*(['"`])((?:\\.|(?!\1).)*)\1/gm)].map(m=>m[2]);
function audit(){
 const files=git('ls-tree','-r','--name-only',BASE,'tests').trim().split('\n').filter(f=>/\.test\.cjs$/.test(f));
 const changed=new Set(git('diff','--name-only',BASE,'--','tests').trim().split('\n').filter(Boolean));
 const report=[];
 for(const f of files){
  const abs=path.join(ROOT,f),exists=fs.existsSync(abs),now=exists?fs.readFileSync(abs,'utf8'):'',before=git('show',BASE+':'+f);
  const missing=titles(before).filter(t=>!titles(now).includes(t));
  report.push({file:f,exists,changed:changed.has(f),marked:!changed.has(f)||/MEC-09D/.test(now),missing});
 }
 return report;
}
module.exports={audit,titles,BASE};
