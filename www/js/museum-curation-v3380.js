/* Proyectos curatoriales: referencias al catálogo real, evaluación pura y diplomas sin economía. */
(function(root){
'use strict';
const projects=[];
const req=(kind,target,label,id)=>Object.freeze({kind,target,label,...(id?{id}:{})});
function add(id,name,description,selector,requirements,category='fauna'){projects.push(Object.freeze({id,name,description,selector:Object.freeze(selector),requirements:Object.freeze(requirements),category,recognition:'Diploma curatorial',economicReward:0}));}
const animals=(discovered,published,exhibited,research)=>[req('discovered',discovered,'Identidades descubiertas del catálogo'),req('published',published,'Monografías publicadas del catálogo'),req('exhibited',exhibited,'Muestras del catálogo actualmente expuestas'),...(research?[req('research',1,'Investigación relacionada',research)]:[])];
add('british','Gabinete de las Islas Británicas','Fauna del catálogo de las Islas Británicas. Publicaciones y vitrinas verificables, sin inferir el lugar de cada avistamiento.',{regions:['HX-01-09']},animals(5,2,2));
add('birds','Historia de las aves','Estudio comparado de las aves del catálogo mundial, con dos muestras zoológicas en exposición.',{className:'Aves'},animals(6,3,2,'ornito_1'));
add('panthera','Grandes felinos del género Panthera','Compara identidades y rangos conservados del género Panthera; no fusiona las especies y subespecies del juego.',{genus:'Panthera'},animals(3,2,2,'masto_1'));
add('savanna','Sabana y aguas de África oriental','Fauna del sector Sabana de África oriental, incluidos sus ríos y humedales. No se atribuye a todas las especies un hábitat seco.',{regions:['HX-07-10']},animals(5,2,2,'masto_1'));
add('asia','Biodiversidad de Asia','Selección del catálogo de las regiones asiáticas existentes.',{continent:'Asia'},animals(6,3,2,'asia_1'));
add('islands','Madagascar, Seychelles y Aldabra','Fauna de estos catálogos insulares. Pertenecer a la colección no implica endemismo.',{regions:['HX-09-14','HX-07-14']},animals(4,2,2,'masto_1'));
add('marine_mammals','Cetáceos y mamíferos marinos','Compara los grupos Cetáceos y Mamíferos marinos de la taxonomía existente.',{marineMammals:true},animals(4,2,2,'masto_1'));
add('polar','Vida de los polos','Muestras y monografías de los sectores árticos y antárticos del juego.',{continent:'Polos'},animals(4,2,2,'polos_1'));
add('depths','Evidencias de las profundidades','Muestras y láminas reconstruidas de los catálogos profundos y abisales. Son representaciones científicas; no observación directa desde cubierta en1842.',{depths:['profundo','abisal']},animals(4,2,1,'exploracion_profunda_1'));
add('reptiles','Reptiles actuales y reconstrucciones','Compara un reptil actual con montajes paleontológicos, sin afirmar que convivieran. Los esqueletos usan sus gabinetes independientes.',{className:'Reptilia'},[...animals(2,1,1,'herpeto_1'),req('fossils',3,'Reconstrucciones montadas y conservadas'),req('displayFossils',2,'Reconstrucciones actualmente exhibidas'),req('research',1,'Investigación de Paleontología','paleontologia_1')],'science');
add('relicts','Archivo de relictos y conservación','Expedientes excepcionales del gabinete. La categoría de relicto no supone que todos sean fósiles vivientes.',{},[req('relicts',3,'Relictos catalogados'),req('displayRelicts',2,'Relictos actualmente exhibidos'),req('relictAnalysis',1,'Análisis comparativo de relictos')],'science');
add('instruments','Instrumentos y archivo de expediciones','Artefactos históricos catalogados junto con la acreditación de fabricación de brújula y cuadrante. No se consumen las piezas.',{},[req('artifacts',3,'Artefactos catalogados'),req('displayArtifacts',2,'Artefactos actualmente exhibidos'),req('crafted',1,'Brújula de latón fabricada','brass_compass'),req('crafted',1,'Cuadrante fabricado','oceanic_quadrant')],'science');
const cache=new WeakMap();
function index(ctx){let result=cache.get(ctx.species);if(result)return result;const tax=Object.fromEntries(Object.keys(ctx.species).map(id=>[id,ctx.taxonomy(id)]));result=new Map();for(const p of projects){const sel=p.selector,regionSet=new Set(ctx.regions.filter(r=>sel.regions?.includes(r.id)||sel.continent===r.continent||sel.depths?.includes(r.depthTier)).flatMap(r=>r.species));const hasSelection=!!(sel.regions||sel.continent||sel.depths||sel.className||sel.genus||sel.marineMammals);const ids=Object.keys(ctx.species).filter(id=>hasSelection&&(!(sel.regions||sel.continent||sel.depths)||regionSet.has(id))&&(!sel.className||tax[id].className===sel.className)&&(!sel.genus||ctx.species[id].latin.split(/\s+/)[0]===sel.genus)&&(!sel.marineMammals||tax[id].className==='Mammalia'&&['Cetáceos','Mamíferos marinos'].includes(tax[id].subClass)));result.set(p.id,Object.freeze(ids));}cache.set(ctx.species,result);return result;}
function ownership(s,ctx){const m=s.museum||{},owned=(list,key)=>list.filter(p=>m[key]?.[p.id]).map(p=>p.id),fossils=owned(ctx.fossilRecipes.filter(p=>p.unique),'collections'),artifacts=owned(ctx.collections.filter(p=>p.tab==='artifacts'),'collections'),relicts=owned(ctx.relicts,'relicts'),display=(ids,kind)=>ids.filter(id=>m.displays?.[kind+':'+id]!==false);return {fossils,artifacts,relicts,displayFossils:display(fossils,'collection'),displayArtifacts:display(artifacts,'collection'),displayRelicts:display(relicts,'relict')};}
function progress(project,s,ctx,owned=ownership(s,ctx)){
 const ids=index(ctx).get(project.id)||[],m=s.museum||{};
 const evidence={discovered:ids.filter(id=>s.discovered?.[id]),published:ids.filter(id=>s.published?.[id]),exhibited:ids.filter(id=>m.exhibits?.[id]),...owned};
 const requirements=project.requirements.map(r=>{const witnesses=r.kind==='research'?(s.purchases?.[r.id]?[r.id]:[]):r.kind==='crafted'?(s.craftedItems?.[r.id]?[r.id]:[]):evidence[r.kind]||[];const raw=r.kind==='relictAnalysis'?Math.max(0,Number(m.relictResearchPoints)||0):witnesses.length;return {...r,raw,value:Math.min(r.target,raw),met:raw>=r.target,witnesses};});
 // Keep impossible legacy layouts intact, but do not accredit them above the real capacity.
 const capacityValid=Object.keys(m.exhibits||{}).length<=ctx.capacity;
 return {requirements,capacityValid,complete:capacityValid&&requirements.every(r=>r.met),fraction:requirements.reduce((n,r)=>n+r.value/r.target,0)/requirements.length,poolSize:ids.length};
}
function record(s){const r=s.museum?.curation;return r&&typeof r==='object'&&!Array.isArray(r)?r:{version:1,completed:{},featured:''};}
function models(s,ctx){const owned=ownership(s,ctx),r=record(s);return projects.map(p=>({...progress(p,s,ctx,owned),project:p,accredited:!!r.completed?.[p.id],accreditation:r.completed?.[p.id]||null,featured:r.featured===p.id}));}
function candidates(s,ctx,id,{page=0,status='all'}={}){
 const ids=index(ctx).get(id)||[],used=Object.keys(s.museum?.exhibits||{}).length;
 const rows=ids.map(id=>{const exhibited=!!s.museum?.exhibits?.[id],published=!!s.published?.[id],enabled=s.stages?.[id]===5&&published;return {id,discovered:!!s.discovered?.[id],published,enabled,exhibited,available:enabled&&!exhibited&&used<ctx.capacity&&s.money>=ctx.price(id)};}).filter(r=>status==='all'||status==='enabled'&&(r.enabled||r.exhibited)||status==='exhibited'&&r.exhibited||status==='available'&&r.available);
 const pages=Math.max(1,Math.ceil(rows.length/12)),current=Math.max(0,Math.min(Number.isSafeInteger(page)?page:0,pages-1));return {rows:rows.slice(current*12,(current+1)*12),page:current,pages,total:rows.length};
}
root.AtlasMuseumCuration3380=Object.freeze({projects:Object.freeze(projects),index,progress,models,record,candidates,ownership});
})(globalThis);
