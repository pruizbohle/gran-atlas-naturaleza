#!/usr/bin/env node
'use strict';
// MEC-09D · Construye la Preview web de revisión a partir de www/ (estado consolidado del repositorio).
// No modifica www/ ni la versión pública: copia el sitio a un directorio de salida FUERA del repositorio y
// aplica solo cambios de identificación y aislamiento:
//  1. Guardado independiente: todas las claves de almacenamiento del juego llevan el sufijo _preview_mec09d,
//     de modo que la Preview nunca lee ni escribe la partida de la versión pública (aunque compartan origen).
//  2. Identificación visible: insignia fija «MEC-09D Preview 01» y título de pestaña.
//  3. Sin instalación PWA: la Preview no registra el trabajador sin conexión ni ofrece el actualizador, porque
//     sus archivos identificados no coinciden con el manifiesto de la publicación (que no se reescribe).
// Juego, balance, catálogos y recursos gráficos son exactamente los de www/.
// Uso: node scripts/build-preview-mec09d.cjs <directorio-salida> [--label "MEC-09D Preview 01"]
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const ROOT=path.join(__dirname,'..'),WWW=path.join(ROOT,'www');
const out=path.resolve(process.argv[2]||'');if(!process.argv[2])throw Error('Indica el directorio de salida');
const rel=path.relative(ROOT,out);if(!rel.startsWith('..')&&!path.isAbsolute(rel))throw Error('La salida debe estar fuera del repositorio');
const label=(process.argv.includes('--label')?process.argv[process.argv.indexOf('--label')+1]:'MEC-09D Preview 01');
const KEYS=['gran_atlas_v05','gran_atlas_backup_before_update','gran_atlas_backup_pre_import_v301','gran_atlas_restore_receipt_v34','gran_atlas_v07_backup_before_v08'];
const SUFFIX='_preview_mec09d';
const commit=cp.execFileSync('git',['rev-parse','--short','HEAD'],{cwd:ROOT}).toString().trim();
const version=JSON.parse(fs.readFileSync(path.join(WWW,'atlas-release.json'),'utf8')).version;
fs.rmSync(out,{recursive:true,force:true});fs.cpSync(WWW,out,{recursive:true});
const changed=[];
for(const file of walk(out).filter(f=>/\.(js|html)$/.test(f))){
 let s=fs.readFileSync(file,'utf8');const before=s;
 for(const k of KEYS)s=s.split("'"+k+"'").join("'"+k+SUFFIX+"'").split('"'+k+'"').join('"'+k+SUFFIX+'"');
 if(s!==before){fs.writeFileSync(file,s);changed.push(path.relative(out,file));}
}
// Ninguna clave original puede quedar como literal.
for(const file of walk(out).filter(f=>/\.(js|html)$/.test(f))){const s=fs.readFileSync(file,'utf8');for(const k of KEYS)if(s.includes("'"+k+"'")||s.includes('"'+k+'"'))throw Error('Clave sin aislar '+k+' en '+file);}
const index=path.join(out,'index.html');let html=fs.readFileSync(index,'utf8');
const badge=`<div id="mec09dPreviewBadge" role="note" aria-label="${label}: versión de revisión con guardado independiente" style="position:fixed;top:max(4px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2147483647;pointer-events:none;background:#7a1f1f;color:#fff;font:600 11px/1.3 system-ui,sans-serif;padding:3px 10px;border-radius:999px;box-shadow:0 1px 4px rgba(0,0,0,.35);white-space:nowrap;opacity:.92">${label} · V${version} · ${commit} · guardado independiente</div>`;
const hide=`<style id="mec09dPreviewStyle">#atlasUpdateLaunch,#atlasUpdateNotice{display:none!important}</style>`;
if(!html.includes('</body>'))throw Error('index.html sin </body>');
html=html.replace(/<title>([^<]*)<\/title>/,(_,t)=>`<title>${label} · ${t}</title>`).replace('</head>',hide+'\n</head>').replace('</body>',badge+'\n</body>');
// Sin trabajador: neutraliza el registro desde la página del juego (el actualizador queda oculto).
html=html.replace('<head>','<head>\n<script>/* MEC-09D Preview: sin instalación PWA */try{if(navigator.serviceWorker){navigator.serviceWorker.getRegistrations?.().then(r=>r.forEach(x=>x.unregister()));Object.defineProperty(navigator.serviceWorker,"register",{value:()=>Promise.reject(new Error("Preview sin instalación"))});}}catch(_){}</script>');
fs.writeFileSync(index,html);changed.push('index.html');
const info={label,version,sourceCommit:commit,builtAt:new Date().toISOString(),storageKeys:KEYS.map(k=>k+SUFFIX),modifiedFiles:[...new Set(changed)].sort(),files:walk(out).length,
 note:'Copia exacta de www/ salvo las claves de almacenamiento aisladas, la insignia y la desactivación de la instalación PWA. Sin cambios de juego ni de balance.'};
fs.writeFileSync(path.join(out,'preview-mec09d.json'),JSON.stringify(info,null,2)+'\n');
fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log(JSON.stringify({out,files:info.files,modified:info.modifiedFiles.length,commit},null,1));
function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);}
