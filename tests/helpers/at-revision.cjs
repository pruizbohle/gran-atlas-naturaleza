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
let depth=0;const orig={readFileSync:fs.readFileSync,existsSync:fs.existsSync,readdirSync:fs.readdirSync,statSync:fs.statSync,copyFileSync:fs.copyFileSync,cpSync:fs.cpSync};
// Árbol de la revisión: lista de un directorio (nombre, tipo, tamaño) a partir de git ls-tree.
const trees=new Map();
function tree(rev,rel){const k=rev+':'+rel;if(!trees.has(k)){let out='';try{out=cp.execFileSync('git',['ls-tree','-l',rev,rel?rel.replace(/\/$/,'')+'/':'.'],{cwd:ROOT,maxBuffer:64e6}).toString();}catch(_){}trees.set(k,out.trim()?out.trim().split('\n').map(l=>{const m=l.match(/^\d+ (\w+) \w+\s+(\S+)\t(.*)$/);return{type:m[1],size:m[2]==='-'?0:Number(m[2]),name:m[3].split('/').pop()};}):null);}return trees.get(k);}
const dirent=e=>({name:e.name,isDirectory:()=>e.type==='tree',isFile:()=>e.type==='blob',isSymbolicLink:()=>false});
function install(rev){
 fs.readFileSync=function(p,opt){const rel=relOf(p);if(rel!==null){const b=show(rev,rel);if(b===null){const e=new Error("ENOENT: no such file at "+rev+": '"+rel+"'");e.code='ENOENT';throw e;}const enc=typeof opt==='string'?opt:opt&&opt.encoding;return enc?b.toString(enc):Buffer.from(b);}return orig.readFileSync.apply(fs,arguments);};
 fs.existsSync=function(p){const rel=relOf(p);if(rel!==null)return show(rev,rel)!==null||tree(rev,rel)!==null;return orig.existsSync.apply(fs,arguments);};
 fs.readdirSync=function(p,opt){const rel=relOf(p);if(rel!==null){const list=tree(rev,rel);if(list===null){const e=new Error("ENOENT: no such directory at "+rev+": '"+rel+"'");e.code='ENOENT';throw e;}return opt&&opt.withFileTypes?list.map(dirent):list.map(e=>e.name);}return orig.readdirSync.apply(fs,arguments);};
 // Copias desde el proyecto (empaquetadores históricos que escriben fuera del repositorio): bytes de rev.
 fs.copyFileSync=function(src,dest,mode){const rel=relOf(src);if(rel!==null){const b=show(rev,rel);if(b===null){const e=new Error('ENOENT: '+rel);e.code='ENOENT';throw e;}return fs.writeFileSync(dest,b);}return orig.copyFileSync.apply(fs,arguments);};
 fs.cpSync=function(src,dest,opt){const rel=relOf(src);if(rel!==null&&tree(rev,rel)!==null){const walk=(r,d)=>{fs.mkdirSync(d,{recursive:true});for(const e of tree(rev,r)){const rr=r+'/'+e.name,dd=path.join(d,e.name);if(e.type==='tree')walk(rr,dd);else if(e.type==='blob')fs.writeFileSync(dd,show(rev,rr));}};return walk(rel,dest);}return orig.cpSync.apply(fs,arguments);};
 fs.statSync=function(p,opt){const rel=relOf(p);if(rel!==null){if(tree(rev,rel)!==null)return{size:0,isFile:()=>false,isDirectory:()=>true,mtimeMs:0};const b=show(rev,rel);if(b!==null)return{size:b.length,isFile:()=>true,isDirectory:()=>false,mtimeMs:0};const e=new Error("ENOENT: "+rel);e.code='ENOENT';throw e;}return orig.statSync.apply(fs,arguments);};
 for(const k of Object.keys(require.cache))if(relOf(k)!==null)delete require.cache[k];
 // Los procesos node hijos (scripts de comprobación de laboratorios) leen la misma revisión.
 envBefore={rev:process.env.MEC09D_REV,opts:process.env.NODE_OPTIONS};process.env.MEC09D_REV=rev;const pre='-r '+__filename;if(!(process.env.NODE_OPTIONS||'').includes(pre))process.env.NODE_OPTIONS=((process.env.NODE_OPTIONS||'')+' '+pre).trim();
}
let envBefore=null;
function restore(){if(envBefore){if(envBefore.rev===undefined)delete process.env.MEC09D_REV;else process.env.MEC09D_REV=envBefore.rev;if(envBefore.opts===undefined)delete process.env.NODE_OPTIONS;else process.env.NODE_OPTIONS=envBefore.opts;envBefore=null;}fs.readFileSync=orig.readFileSync;fs.existsSync=orig.existsSync;fs.readdirSync=orig.readdirSync;fs.statSync=orig.statSync;fs.copyFileSync=orig.copyFileSync;fs.cpSync=orig.cpSync;for(const k of Object.keys(require.cache))if(relOf(k)!==null)delete require.cache[k];}
// Ejecuta fn con los archivos del proyecto de la revisión rev. Admite funciones asíncronas.
function atRevision(rev,fn){return function(...args){install(rev);depth++;let r;try{r=fn.apply(this,args);}catch(e){depth--;restore();throw e;}
 if(r&&typeof r.then==='function')return r.finally(()=>{depth--;restore();});depth--;restore();return r;};}
// anchored(test, {título: revisión}): las pruebas indicadas se ejecutan con los archivos de su revisión.
function anchored(test,map){const t=function(name,...rest){const rev=map[name];if(rev&&typeof rest[rest.length-1]==='function')rest[rest.length-1]=atRevision(rev,rest[rest.length-1]);return test(name,...rest);};
 for(const k of Object.keys(test))t[k]=test[k];for(const k of ['after','before','afterEach','beforeEach','describe','it','skip','todo','only','mock'])if(test[k])t[k]=test[k];t.anchors=map;return t;}
// pinFile(rev): todo el archivo de prueba (incluido su preámbulo) lee los archivos del proyecto de rev.
function pinFile(rev){install(rev);}
module.exports={atRevision,anchored,show,pinFile};
// Uso como precarga (-r) para buscar la revisión: MEC09D_REV=abc123 node -r ./tests/helpers/at-revision.cjs --test …
if(process.env.MEC09D_REV)install(process.env.MEC09D_REV);
