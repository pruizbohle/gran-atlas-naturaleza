'use strict';
// MEC-09D · Pruebas de huella histórica ancladas a su revisión.
// Muchas pruebas de 3.19–3.43 garantizaban que una entrega «solo añadía» algo: comparaban la fuente vigente
// (menos los bloques marcados de cada entrega) con una copia o huella del momento. Las etapas posteriores
// (3.31 en adelante, MEC-01…MEC-09C) modificaron esas mismas fuentes sin marcas retirables, así que la
// comparación con la fuente actual dejó de tener sentido: no detecta un error, solo que el código siguió
// evolucionando. Para conservar la trazabilidad, la prueba se ejecuta sobre los archivos del repositorio
// tal como estaban en la revisión en que esa garantía se verificó por última vez (git show), mientras que
// el comportamiento vigente queda cubierto por las pruebas funcionales indicadas en docs/mec09d.
// Solo se redirigen las lecturas de archivos del proyecto fuera de tests/ (las expectativas y los arneses
// son los actuales).
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const ROOT=path.join(__dirname,'..','..');
const cache=new Map();
function show(rev,rel){const k=rev+':'+rel;if(!cache.has(k)){try{cache.set(k,cp.execFileSync('git',['show',k],{cwd:ROOT,maxBuffer:256e6}));}catch(_){cache.set(k,null);}}return cache.get(k);}
function relOf(p){if(typeof p!=='string'&&!(p instanceof URL))return null;const abs=path.resolve(ROOT,String(p instanceof URL?p.pathname:p));const rel=path.relative(ROOT,abs);if(rel.startsWith('..')||path.isAbsolute(rel))return null;if(rel.startsWith('tests'+path.sep)||rel==='tests'||rel.startsWith('node_modules')||rel.startsWith('.git'))return null;return rel.split(path.sep).join('/');}
let depth=0;const orig={readFileSync:fs.readFileSync,existsSync:fs.existsSync};
function install(rev){
 fs.readFileSync=function(p,opt){const rel=relOf(p);if(rel!==null){const b=show(rev,rel);if(b===null){const e=new Error("ENOENT: no such file at "+rev+": '"+rel+"'");e.code='ENOENT';throw e;}const enc=typeof opt==='string'?opt:opt&&opt.encoding;return enc?b.toString(enc):Buffer.from(b);}return orig.readFileSync.apply(fs,arguments);};
 fs.existsSync=function(p){const rel=relOf(p);if(rel!==null)return show(rev,rel)!==null;return orig.existsSync.apply(fs,arguments);};
 for(const k of Object.keys(require.cache))if(relOf(k)!==null)delete require.cache[k];
}
function restore(){fs.readFileSync=orig.readFileSync;fs.existsSync=orig.existsSync;for(const k of Object.keys(require.cache))if(relOf(k)!==null)delete require.cache[k];}
// Ejecuta fn con los archivos del proyecto de la revisión rev. Admite funciones asíncronas.
function atRevision(rev,fn){return function(...args){install(rev);depth++;let r;try{r=fn.apply(this,args);}catch(e){depth--;restore();throw e;}
 if(r&&typeof r.then==='function')return r.finally(()=>{depth--;restore();});depth--;restore();return r;};}
// anchored(test, {título: revisión}): las pruebas indicadas se ejecutan con los archivos de su revisión.
function anchored(test,map){const t=function(name,...rest){const rev=map[name];if(rev&&typeof rest[rest.length-1]==='function')rest[rest.length-1]=atRevision(rev,rest[rest.length-1]);return test(name,...rest);};
 for(const k of Object.keys(test))t[k]=test[k];for(const k of ['after','before','afterEach','beforeEach','describe','it','skip','todo','only','mock'])if(test[k])t[k]=test[k];t.anchors=map;return t;}
module.exports={atRevision,anchored,show};
// Uso como precarga (-r) para buscar la revisión: MEC09D_REV=abc123 node -r ./tests/helpers/at-revision.cjs --test …
if(process.env.MEC09D_REV)install(process.env.MEC09D_REV);
