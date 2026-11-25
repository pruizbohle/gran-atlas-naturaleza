'use strict';
// MEC-09D §17 · Análisis del grafo de dependencias de progresión.
// Entrada: el grafo tipado que genera scripts/audit-mec09b.cjs desde el motor real (docs/mec09b/grafo-dependencias.csv;
// regenerado en MEC-09D sobre el motor vigente: idéntico). Semántica:
//  - requires: requisitos OBLIGATORIOS (todos);
//  - sources: fuentes ALTERNATIVAS (basta una); cada fuente «etiqueta ⟵ a+b» exige a la vez sus dependencias a, b;
//  - alternatives: regiones de campo alternativas (basta una).
// Los recursos (dinero, conocimiento, prestigio) son costes renovables con fuentes propias del juego (búsquedas,
// monografías, subvenciones); no se usan como prueba de alcance ni se suponen ilimitados: el análisis solo mira
// si existe una cadena legítima de requisitos y fuentes desde la partida nueva.
// Salida: alcance por punto fijo, referencias rotas, ciclos (componentes fuertemente conexas) de dependencias
// obligatorias, profundidad de cada hito y cadenas principales.
const fs=require('node:fs'),path=require('node:path');
function parse(file){
 const lines=fs.readFileSync(file,'utf8').trim().split('\n'),head=lines[0].split(';'),rows=[];
 for(const line of lines.slice(1)){const cells=[];let cur='',q=false;for(let i=0;i<line.length;i++){const c=line[i];if(q){if(c==='"'&&line[i+1]==='"'){cur+='"';i++;}else if(c==='"')q=false;else cur+=c;}else if(c==='"')q=true;else if(c===';'){cells.push(cur);cur='';}else cur+=c;}cells.push(cur);rows.push(Object.fromEntries(head.map((h,i)=>[h,cells[i]??''])));}
 return rows;
}
const ID=/^(research|item|region|continent|voyage|trade|dig|facility|rank|museum|piece|grant|collection):/;
// sourceResearch: {continente: investigación} de CARTOGRAPHY3400. MEC-09B escribe la fuente de las partes de mapa del
// estudio «cálculo de derrotas» como seudonodo «continent:X:fuente» y lo daba por alcanzado; aquí se resuelve a su
// requisito real (la investigación de origen de ese mapa, o ninguno).
function build(rows,sourceResearch={}){
 const nodes=new Map(rows.map(r=>[r.id,r]));const refs=new Set();
 const list=s=>s?s.split(' | ').map(x=>x.trim()).filter(Boolean):[];
 const pseudo=x=>{const m=x.match(/^continent:(.+):fuente$/);if(!m)return [x];return m[1] in sourceResearch?(sourceResearch[m[1]]?['research:'+sourceResearch[m[1]]]:[]):[x];};
 for(const r of rows){
  r.req=list(r.requires).filter(x=>ID.test(x));
  r.src=list(r.sources).map(s=>{const deps=s.includes(' ⟵ ')?s.split(' ⟵ ')[1].split('+').map(x=>x.trim()).filter(x=>ID.test(x)).flatMap(pseudo):[];return {label:s.split(' ⟵ ')[0],deps};});
  for(const reg of list(r.alternatives).flatMap(x=>x.split(/\s+/)).filter(x=>ID.test(x)))r.src.push({label:'campo alternativo',deps:[reg]});
  for(const d of [...r.req,...r.src.flatMap(s=>s.deps)])refs.add(d);
 }
 const dangling=[...refs].filter(x=>!nodes.has(x)&&!/^grant:/.test(x)).sort();
 return {nodes,dangling};
}
function reach(nodes){
 // Por capas: en cada paso solo cuentan los nodos alcanzados en pasos anteriores, así «paso» es la profundidad mínima
 // de la cadena legítima más corta desde la partida nueva.
 const ok=new Set(),order=new Map();let step=0,changed=true;
 while(changed){changed=false;step++;const now=[];for(const [id,r] of nodes){if(ok.has(id))continue;
  const reqOk=r.req.every(d=>ok.has(d));const srcOk=!r.src.length||r.src.some(s=>s.deps.every(d=>ok.has(d)));
  if(reqOk&&srcOk)now.push(id);}
  for(const id of now){ok.add(id);order.set(id,step);changed=true;}}
 return {ok,order,unreachable:[...nodes.keys()].filter(id=>!ok.has(id))};
}
// Dependencias obligatorias: requisitos y, si TODAS las fuentes comparten una dependencia, esa dependencia.
function mandatory(r){const shared=r.src.length?r.src.map(s=>new Set(s.deps)).reduce((a,b)=>new Set([...a].filter(x=>b.has(x)))):new Set();return [...new Set([...r.req,...shared])];}
function cycles(nodes){
 let index=0;const idx=new Map(),low=new Map(),stack=[],on=new Set(),out=[];
 const strong=v=>{idx.set(v,index);low.set(v,index);index++;stack.push(v);on.add(v);
  for(const w of mandatory(nodes.get(v)).filter(w=>nodes.has(w))){if(!idx.has(w)){strong(w);low.set(v,Math.min(low.get(v),low.get(w)));}else if(on.has(w))low.set(v,Math.min(low.get(v),idx.get(w)));}
  if(low.get(v)===idx.get(v)){const c=[];let w;do{w=stack.pop();on.delete(w);c.push(w);}while(w!==v);if(c.length>1||mandatory(nodes.get(v)).includes(v))out.push(c);}};
 for(const v of nodes.keys())if(!idx.has(v))strong(v);
 return out;
}
function analyze(file,sourceResearch){
 const rows=parse(file),{nodes,dangling}=build(rows,sourceResearch),r=reach(nodes),cyc=cycles(nodes);
 const byType={};for(const row of rows)byType[row.type]=(byType[row.type]||0)+1;
 // Cadena crítica: en cada nodo se sigue la dependencia (obligatoria o de la fuente más temprana) alcanzada más tarde.
 const step=id=>r.order.get(id)??Infinity;
 const chain=id=>{const out=[];let cur=id,guard=0;while(cur&&guard++<60){out.push(cur);const n=nodes.get(cur);if(!n)break;const best=n.src.length?n.src.slice().sort((a,b)=>Math.max(0,...a.deps.map(step))-Math.max(0,...b.deps.map(step)))[0].deps:[];cur=[...n.req,...best].filter(x=>nodes.has(x)).sort((a,b)=>step(b)-step(a))[0];}return out;};
 const milestones=[...nodes.keys()].filter(id=>/^(continent|rank|museum):/.test(id));
 return {nodes:rows.length,byType,dangling,unreachable:r.unreachable,cycles:cyc,steps:Math.max(...r.order.values()),order:r.order,
  milestones:milestones.map(id=>({id,name:nodes.get(id).name,step:step(id),chain:chain(id)})),
  alternatives:rows.filter(x=>x.src.length>1).length,singleSource:rows.filter(x=>x.src.length===1).map(x=>x.id)};
}
module.exports={analyze,parse};
if(require.main===module){const file=process.argv[2]||path.join(__dirname,'..','docs','mec09b','grafo-dependencias.csv');
 const sr=process.argv[3]?JSON.parse(process.argv[3]):undefined;const b=analyze(file,sr);console.log(JSON.stringify({...b,order:undefined,singleSource:b.singleSource.length,milestones:b.milestones.map(m=>({id:m.id,step:m.step,chain:m.chain.join(' ← ')}))},null,1));}
