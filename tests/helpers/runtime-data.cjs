'use strict';
// MEC-09D · Entorno de ejecución de producción para arneses históricos.
// Los arneses de 3.15–3.20 cargaban solo app.js (o una fuente recortada). Desde 3.31 app.js exige los
// datos polares, marinos, profundos y de fosas, y desde MEC-01 consulta los módulos MEC al cargar:
// esas pruebas fallaban con «Faltan los datos polares 3.31.0» o «CONTINENT_RULES3300 is not defined»
// antes de ejecutar la comprobación que protegían. preload() ejecuta en el contexto del arnés los
// mismos guiones que www/index.html carga antes de app.js, en el mismo orden, para que la prueba
// ejerza el motor vigente. No cambia ninguna aserción.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ROOT=path.join(__dirname,'..','..');
const cp=require('node:child_process');
const at=(rev,f)=>rev?cp.execFileSync('git',['show',rev+':'+f],{cwd:ROOT,maxBuffer:64e6}).toString():fs.readFileSync(path.join(ROOT,f),'utf8');
const beforeApp=rev=>{const all=[...at(rev,'www/index.html').matchAll(/<script src="js\/([^"?]+)/g)].map(m=>m[1]);return all.slice(0,all.indexOf('app.js'));};
const BEFORE_APP=beforeApp(null);
// rev: cuando la prueba ejecuta un app.js histórico (git show REV), se cargan los guiones de esa misma revisión.
function preload(context,source,{skip=[],rev=null}={}){
 if(!vm.isContext(context))throw Error('preload requiere un contexto vm');
 const loaded=[],failed=[];
 for(const f of rev?beforeApp(rev):BEFORE_APP){if(skip.some(s=>f.includes(s)))continue;
  try{vm.runInContext(at(rev,'www/js/'+f),context,{filename:'www/js/'+f});loaded.push(f);}
  catch(e){failed.push(f+': '+e.message);} // módulos de interfaz que necesitan un DOM real
 }
 return {loaded,failed};
}
module.exports={preload,BEFORE_APP};
