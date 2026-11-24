'use strict';
// MEC-06 · genera la auditoría funcional del inventario (docs/mec06/inventario.csv) y la matriz de
// referencias artísticas (docs/mec06/arte.csv) desde el motor real, con el catálogo completo.
// Uso: node scripts/build-mec06-inventory.cjs [--write]
const fs=require('node:fs'),path=require('node:path');
process.chdir(path.join(__dirname,'..'));
const {make}=require('../tests/helpers/mec01-game.cjs');
const h=make({now:1790000000000,headless:true,full:true});
const A=h.x.AtlasMEC06Actions,X=h.x.AtlasMEC06,g=h.g;
const rows=A.inventoryAudit();
const q=v=>{const s=Array.isArray(v)?v.join(' | '):v&&typeof v==='object'?Object.entries(v).map(([k,n])=>k+'×'+n).join(' '):String(v??'');return /[;"\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
const NEW=new Set(['estudio científico','demostración']);
const head=['id','nombre','categoria','fuentes','usos','recetas_en_que_participa','receta_propia','investigaciones','encargos','compra_venta_intercambio','nivel_taller','beneficio','estado','usos_antes_mec06','estado_antes_mec06','arte'];
const lines=[head.join(';')],wasList=[];
for(const r of rows){const before=r.uses.filter(u=>!NEW.has(u.kind)&&!(X.ARTIFACTS[r.id]&&u.kind!=='artefacto'));
 const was=X.ARTIFACTS[r.id]?'sin función (solo catalogable)':!before.length&&r.category!=='coleccionable'&&!g.ITEMS[r.id]?.slot?'sin utilidad':'funcional';
 wasList.push([r.id,was]);lines.push([r.id,r.name,r.category,r.sources,r.uses.map(u=>u.kind+': '+u.label),r.recipes,r.recipe||'',r.research,r.commissions,r.tradable,r.workshop,r.benefit,r.state,before.map(u=>u.kind+': '+u.label),was,r.art].map(q).join(';'));}
// Arte: ilustración existente (item-art) o nueva.
const itemArt=fs.readFileSync('www/js/item-art-v3198.js','utf8');
const hasArt=id=>new RegExp('plate\\.'+id.replace(/[-]/g,'\\-')+'\\b|[\'"]'+id+'[\'"]\\s*:').test(itemArt);
const art=['tipo;id;nombre;referencia;ilustracion_existente;necesita_arte_nuevo'];
const nm=id=>g.ITEMS[id]?.name||g.MUSEUM_COLLECTIONS.find(p=>p.id===id)?.name||id;
for(const a of Object.values(X.ARTIFACTS))art.push(['artefacto'+(X.HISTORIC.includes(a.id)?' histórico':' beta'),a.id,nm(a.id),a.art,hasArt(a.id)?'sí':'no',X.HISTORIC.includes(a.id)&&hasArt(a.id)?'no (reutilizable)':'sí'].map(q).join(';'));
for(const [id,c] of Object.entries(X.COMPONENTS))art.push(['componente',id,nm(id),c.art,hasArt(id)?'sí':'no',hasArt(id)?'no (reutilizable)':'sí'].map(q).join(';'));
for(const grp of Object.values(X.ANIMAL_GROUPS))for(const id of grp.ids)art.push(['material animal',id,nm(id),'item-'+id,hasArt(id)?'sí':'no',hasArt(id)?'no (reutilizable)':'sí'].map(q).join(';'));
for(const p of X.ART.installed)art.push(['instrumento instalado',p,p,p,'no','sí'].join(';'));
for(const t of Object.values(X.STUDIES))art.push(['estudio científico',t.id,t.label,t.art,'no','sí'].map(q).join(';'));
for(const d of Object.values(X.DEMOS))art.push(['demostración',d.id,d.label,d.art,'no','sí'].map(q).join(';'));
const summary={objetos:rows.length,porCategoria:rows.reduce((o,r)=>(o[r.category]=(o[r.category]||0)+1,o),{}),
 sinFuente:rows.filter(r=>r.state==='requerido sin fuente').map(r=>r.id),sinUtilidad:rows.filter(r=>r.state==='sin utilidad').map(r=>r.id),
 sinUtilidadAntes:wasList.filter(([,w])=>w==='sin utilidad').map(([id])=>id),artefactosSinFuncionAntes:Object.keys(X.ARTIFACTS),
 arteNuevo:art.slice(1).filter(l=>l.endsWith(';sí')).length,arteReutilizable:art.slice(1).filter(l=>l.endsWith('reutilizable)')).length};
console.log(JSON.stringify(summary,null,1));
if(process.argv.includes('--write')){fs.writeFileSync('docs/mec06/inventario.csv','\ufeff'+lines.join('\n')+'\n');fs.writeFileSync('docs/mec06/arte.csv','\ufeff'+art.join('\n')+'\n');fs.writeFileSync('docs/mec06/inventario-resumen.json',JSON.stringify(summary,null,1)+'\n');}
