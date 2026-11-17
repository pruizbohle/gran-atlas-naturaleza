'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8'),script=s=>'<script>'+s.replace(/<\/script/gi,'<\\/script')+'</script>';
const base=JSON.parse(read('docs/gm06/base-cartografia.json'));
const modules=['catalog','geography','art'].map(n=>read('www/js/gm06/'+n+'.js')).join('\n');
const candidate=require('../tests/helpers/ux3410-game.cjs').make({headless:true,gameSource:modules+'\n'+read('www/js/app.js').replace(/\n\}\)\(\);\s*$/,'\nwindow.__gm06ArtGet=getSpriteMarkup;\n})();')});
const regions=candidate.g.REGIONS,species=candidate.g.SPECIES,context={};vm.createContext(context);
for(const name of ['atlas-geography-v3211b','southamerica-geography-v3230','oceania-geography-v3290','polar-geography-v3310','marine-geography-v3320','deep-geography-v3330','abyssal-geography-v3340'])vm.runInContext(read('www/js/'+name+'.js'),context);
vm.runInContext(read('www/js/gm06/geography.js'),context);
const maps={};for(const c of Object.keys(base.maps))maps[c]=context.AtlasGeography.layout(c,regions.filter(r=>r.continent===c));
const cellRows=regions.map(r=>{const old=base.regions.find(x=>x.id===r.id),a=base.maps[r.continent]?.positions[r.id],z=maps[r.continent].positions[r.id];return {id:r.id,continente:r.continent,nombre_anterior:old?.name||'',nombre_propuesto:r.name,estado:!old?'nueva':a.q!==z.q||a.r!==z.r?'trasladada':old.name!==r.name?'renombrada':'existente',q_anterior:a?.q??'',r_anterior:a?.r??'',q_propuesto:z.q,r_propuesto:z.r,habitats:r.habitats.join(','),fauna_anterior:old?.species.length??0,fauna_candidata:r.species.length,prestigio_anterior:old?.unlock.prestige??'',prestigio_candidato:r.unlock.prestige,acceso:r.origin==='gm06'?'Reglas continentales y cartografía existentes; umbral compartido; no consume prestigio':'Requisitos históricos conservados',referencia_geografica:'Natural Earth coastline 110m; relaciones regionales documentadas en geografia.md'};});
fs.writeFileSync('docs/gm06/regiones-revision.tsv',Object.keys(cellRows[0]).join('\t')+'\n'+cellRows.map(r=>Object.values(r).join('\t')).join('\n')+'\n');
const gallery=Object.entries(species).filter(([,sp])=>sp.origin==='gm06').map(([id,sp])=>({id,...sp,regions:regions.filter(r=>r.species.includes(id)).map(r=>({id:r.id,name:r.name})),sprites:Object.fromEntries(['normal','alfa','epico','excepcional'].map(s=>[s,candidate.window.__gm06ArtGet(id,s)]))}));
fs.mkdirSync('docs/gm06/laminas',{recursive:true});for(const s of gallery)fs.writeFileSync('docs/gm06/laminas/'+s.id+'.svg',s.sprites.normal+'\n');
const isolation=script(`window.__gm06Memory=new Map();const memory={getItem:k=>window.__gm06Memory.get(k)??null,setItem:(k,v)=>window.__gm06Memory.set(k,String(v)),removeItem:k=>window.__gm06Memory.delete(k),clear:()=>window.__gm06Memory.clear(),key:i=>[...window.__gm06Memory.keys()][i]??null,get length(){return window.__gm06Memory.size}};Object.defineProperty(window,'localStorage',{value:memory});Object.defineProperty(window,'sessionStorage',{value:memory});Object.defineProperty(navigator,'serviceWorker',{value:{register:()=>Promise.resolve(),getRegistrations:()=>Promise.resolve([])}});window.Capacitor={getPlatform:()=> 'web',isNativePlatform:()=>false};`);
let engine=read('www/index.html').replace(/<link rel="(?:manifest|icon)"[^>]*>/g,'').replace('<head>','<head>'+isolation).replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g,(_,p)=>'<style>'+read('www/'+p.split('?')[0])+'</style>');
engine=engine.replace(/<script src="([^"]+)"[^>]*><\/script>/g,(_,p)=>{
 const file=p.split('?')[0];if(file.includes('update-client')||file.startsWith('js/gm06/'))return '';
 if(file==='js/app.js'){
  let app=read('www/'+file);const marker='\nrender();\n})();',at=app.lastIndexOf(marker);assert(at>0);
  app=app.slice(0,at)+'\nrender();\n'+read('www/js/gm06/lab-bridge.js')+'\n})();';return script(modules)+script(app);
 }
 return script(read('www/'+file));
}).replaceAll('v3.44.0 · Cartografía del naturalista','GM-06 · Partida sintética en memoria').replace('Europa 10 · Asia 21 · África 24 · Norteamérica 2',Object.keys(maps).map(c=>c+' '+regions.filter(r=>r.continent===c).length).join(' · ')).replace('Prototipo jugable · guardado local automático · progreso offline hasta 8 horas.','GM-06 · Motor real · Progreso sintético en memoria.');
const payload={base,regions,maps,gallery,validation:fs.existsSync('docs/gm06/pruebas/validacion-final.json')?JSON.parse(read('docs/gm06/pruebas/validacion-final.json')):null,speciesLabels:Object.fromEntries(Object.entries(species).map(([id,sp])=>[id,{name:sp.name,latin:sp.latin}])),catalog:JSON.parse(read('docs/gm06/catalogo-candidato.json'))};
let shell=read('www/js/gm06/lab-shell.html');shell=shell.replace('<!--GM06_DATA-->','<script type="application/json" id="gm06-data">'+JSON.stringify(payload).replace(/</g,'\\u003c')+'</script><script type="application/json" id="gm06-engine">'+JSON.stringify(engine).replace(/</g,'\\u003c')+'</script>').replace('<!--GM06_HOST-->',script(read('www/js/gm06/lab-host.js')));
fs.writeFileSync('www/laboratorio-cartografia-gm06.html',shell);
fs.writeFileSync('docs/gm06/resumen-generado.json',JSON.stringify({base:'41a4bbd',phase:'GM-06 aprobado · integración 3.44.0',species:Object.keys(species).length,newSpecies:gallery.length,regions:regions.length,newRegions:regions.filter(r=>r.origin==='gm06').length,associations:regions.reduce((a,r)=>a+r.species.length,0),selfContained:true,bytes:Buffer.byteLength(shell),sandbox:'allow-scripts allow-downloads',productionStorageAccessible:false},null,2)+'\n');
console.log('GM-06 lab:',gallery.length,'new species,',regions.length,'regions,',Buffer.byteLength(shell),'bytes');
