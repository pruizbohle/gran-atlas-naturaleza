/* Reconocimientos de la Sociedad. Reglas puras; ninguna recompensa económica. */
(function(root){
'use strict';
const categories=Object.freeze({exploration:'Exploración y cartografía',zoology:'Zoología y Cuaderno',specimens:'Especímenes especiales',museum:'Museo y paleontología',research:'Investigación y fabricación',navigation:'Expediciones y Comercio'});
const catalog=[];
function add(category,id,name,metric,target,description,tier='Bronce',extra={}){catalog.push(Object.freeze({id,category,name,metric,target,description,tier,reward:'Medalla permanente',...extra}));}
add('exploration','first_journey','Más allá de las islas','outside',1,'Visita una región distinta de las Islas Británicas.');
for(const [n,tier]of [[5,'Bronce'],[10,'Plata'],[25,'Oro']])add('exploration','visit_'+n,'Cartógrafo de '+n+' regiones','visited',n,'Visita '+n+' regiones funcionales.',tier);
add('exploration','world_unlocked','Atlas sin fronteras','unlocked',113,'Desbloquea las 113 regiones funcionales.','Platino',{title:'Cartógrafo del mundo'});
for(const [key,name]of [['asia_1','Asia'],['africa_1','África'],['norteamerica_1','Norteamérica'],['sudamerica_1','Sudamérica'],['oceania_1','Oceanía']])add('exploration','access_'+key,'Rumbo a '+name,'purchase:'+key,1,'Completa la investigación que habilita '+name+'.','Plata');
for(const pole of ['Ártico','Antártida'])add('exploration',pole==='Ártico'?'visit_arctic':'visit_antarctic','Diario del '+pole,'pole:'+pole,1,'Visita una región del '+pole+'.','Oro');
add('exploration','surface_access','Horizonte azul','purchase:mares_superficiales_1',1,'Investiga la navegación de mares superficiales.','Oro');
add('exploration','first_deep','Sonda lastrada','deepCompleted',1,'Completa una operación de sondeo o muestreo profundo.','Oro');
add('exploration','visit_abyss','En el borde de la fosa','abyssVisited',1,'Visita un sector de fosas abisales.','Platino',{secret:true,title:'Corresponsal de las profundidades'});
add('exploration','abyss_sample','Evidencia de la fosa','abyssRecords',1,'Registra una identificación mediante una operación científica en una fosa.','Platino',{secret:true});
for(const [n,tier]of [[1,'Bronce'],[10,'Bronce'],[50,'Plata'],[100,'Plata'],[250,'Oro'],[500,'Oro'],[900,'Platino']])add('zoology','discover_'+n,n===1?'La primera ficha':n+' identidades documentadas','discovered',n,'Descubre '+n+' identidades zoológicas.',tier,n===900?{title:'Naturalista del mundo'}:{});
for(const [n,tier]of [[1,'Bronce'],[10,'Plata'],[100,'Oro'],[945,'Platino']])add('zoology','publish_'+n,n===1?'Firma de naturalista':n+' monografías','published',n,'Publica '+n+' monografías en la Sociedad.',tier,n===100?{title:'Autor de la Sociedad'}:{});
for(const [level,n,tier]of [[1,10,'Bronce'],[3,10,'Plata'],[5,1,'Plata'],[5,5,'Oro']])add('zoology','stage_'+level+'_'+n,'Cuaderno '+level+'/5 · '+n+' especies','stage:'+level,n,'Alcanza la etapa '+level+'/5 en '+n+' especies.',tier);
add('zoology','four_groups','Cuatro gabinetes','groups',4,'Descubre mamíferos, aves, reptiles o anfibios, y peces o cefalópodos.','Plata');
for(const n of [1,10])add('zoology','regional_'+n,'Censo regional · '+n,'regional',n,'Descubre todas las especies de '+n+' regiones funcionales.',n===1?'Plata':'Oro');
for(const [label,slug]of [['Notable','notable'],['Albino','albino'],['Melánico','melanic']])for(const n of [1,10])add('specimens',slug+'_'+n,label+' · '+n+' identidades','variant:'+label,n,'Registra '+label+' en '+n+' identidades con esa variante configurada.',n===1?'Plata':'Oro');
for(const [label,slug]of [['Épico','epic'],['Excepcional','exceptional'],['Legendario','legendary']])add('specimens',slug+'_1','Gabinete '+label.toLowerCase(),'variant:'+label,1,'Registra un espécimen '+label+' configurado en el juego.','Platino',{secret:true});
add('specimens','special_groups','Variación de la naturaleza','specialGroups',4,'Registra un espécimen especial en cada uno de los cuatro grandes grupos.','Oro');
add('specimens','special_100','Archivo de singularidades','specialTotal',100,'Reúne 100 registros especiales conservados en tu partida.','Oro');
add('specimens','special_stage_10','Diez estudios completos','stage:5',10,'Alcanza la quinta etapa de diez especies, incluidos sus requisitos especiales reales.','Platino');
for(const n of [1,3,7,12])add('museum','exhibit_'+n,'Galería de '+n+' especies','exhibits',n,'Mantén '+n+' especies expuestas en el Museo.',n<7?'Bronce':'Oro');
add('museum','fossil_catalog','Archivo fósil','fossils',1,'Completa una colección de fósiles catalogados.','Plata');
for(const n of [1,3])add('museum','artifact_'+n,'Gabinete de artefactos · '+n,'artifacts',n,'Completa '+n+' colecciones de artefactos históricos.',n===1?'Plata':'Oro');
for(const n of [1,3])add('museum','dinosaur_'+n,'Montaje paleontológico · '+n,'dinosaurs',n,'Completa '+n+' reconstrucciones únicas de dinosaurios.',n===1?'Oro':'Platino');
for(const n of [1,3])add('museum','relict_'+n,'Expediente de relictos · '+n,'relicts',n,'Obtén '+n+' relictos distintos.',n===1?'Oro':'Platino',{secret:n===3});
add('museum','paleo_research','Lectura de los estratos','paleoResearch',1,'Completa una investigación de Paleontología.','Plata');
for(const n of [1,10])add('research','research_'+n,'Instituto · '+n+' investigaciones','research',n,'Completa '+n+' nodos de investigación distintos.','Plata');
for(const [branch,name]of [['exploracion','Exploración'],['naturalismo','Naturalismo'],['museologia','Museología'],['expediciones','Expediciones']])add('research','branch_'+branch,'Estudios de '+name,'branch:'+branch,3,'Completa tres nodos distintos de la rama '+name+'.','Oro');
add('research','craft_first','Manos de instrumentista','crafted',1,'Fabrica un objeto con receta.');
add('research','continental_kit','Gabinete continental','continentalKit',5,'Acredita brújula, cuadrante, telescopio, sombrero de estudioso y abrigo polar.','Oro',{title:'Instrumentista de expedición'});
for(const [id,name,tier]of [['brass_compass','Brújula de latón','Bronce'],['field_telescope','Telescopio de campo','Plata'],['polar_coat','Abrigo polar','Oro'],['sounding_kit','Equipo de sondeo','Oro']])add('research','craft_'+id,name,'craft:'+id,1,'Fabrica '+name.toLowerCase()+'.',tier);
for(const n of [1,10])add('navigation','voyage_'+n,'Correspondencia científica · '+n,'voyages',n,'Completa '+n+' expediciones científicas.',n===1?'Bronce':'Plata');
add('navigation','voyage_types','Tres rumbos científicos','voyageTypes',3,'Completa tres tipos distintos de expedición científica.','Plata');
for(const n of [1,10])add('navigation','trade_'+n,'Libro de comercio · '+n,'counter:trade',n,'Completa '+n+' viajes comerciales desde 3.36.0.',n===1?'Bronce':'Oro',{since3360:true});
add('navigation','trade_24','Una jornada en alta mar','counter:trade24',1,'Completa un viaje comercial de 24 horas desde 3.36.0.','Oro',{since3360:true});
add('navigation','market_first','Pedido de ultramar','counter:market',1,'Compra una unidad en el Mercado desde 3.36.0.','Bronce',{since3360:true});
add('navigation','barter_first','Intercambio del gabinete','counter:barter',1,'Completa un trueque desde 3.36.0.','Bronce',{since3360:true});
for(const [method,name]of [['sondeo','Sondeo'],['muestreo','Muestreo']])add('navigation','method_'+method,name+' acreditado','method:'+method,1,'Completa una operación de '+name.toLowerCase()+'.','Oro');
const count=o=>Object.values(o||{}).filter(Boolean).length;
const safe=n=>Number.isSafeInteger(n)&&n>=0?n:0;
function group(t){const c=t?.className||'';return c==='Aves'?'birds':/Mammalia|Mamífer/.test(c)?'mammals':/Reptil|Amphibia|anfib/.test(c)?'herps':'fish';}
const compiled=new WeakMap();
function compile(ctx){let c=compiled.get(ctx.species);if(!c){c={groups:{},specials:{}};for(const [id,sp] of Object.entries(ctx.species)){c.groups[id]=group(ctx.taxonomy(id));c.specials[id]=ctx.specials(sp);}compiled.set(ctx.species,c);}return c;}
function metrics(s,ctx){
 const index=compile(ctx),legendary=new Set(Object.values(s.legendaryFound||{}).map(x=>x?.speciesId));
 const ids=Object.keys(ctx.species),regions=ctx.regions,known=ids.filter(id=>s.discovered?.[id]),special=ids.filter(id=>Object.values(s.specialFound?.[id]||{}).some(Boolean)||legendary.has(id));
 const collections=s.museum?.collections||{},nodes=ctx.research||[],deep=s.deepSurvey?.history||[],a=s.achievements||{},e=a.evidence||{};
 const m={outside:regions.some((r,i)=>i>0&&s.regionsVisited?.[r.id])?1:0,visited:regions.filter(r=>s.regionsVisited?.[r.id]).length,unlocked:regions.filter(r=>s.regionUnlocked?.[r.id]).length,discovered:known.length,published:ids.filter(id=>s.published?.[id]).length,groups:new Set(known.map(id=>index.groups[id])).size,regional:regions.filter(r=>r.species.length&&r.species.every(id=>s.discovered?.[id])).length,exhibits:ids.filter(id=>s.museum?.exhibits?.[id]).length,fossils:(ctx.collections||[]).filter(c=>c.tab==='fossils'&&collections[c.id]).length,artifacts:(ctx.collections||[]).filter(c=>c.tab==='artifacts'&&collections[c.id]).length,dinosaurs:(ctx.fossilRecipes||[]).filter(c=>c.unique&&collections[c.id]).length,relicts:(ctx.relicts||[]).filter(c=>s.museum?.relicts?.[c.id]).length,paleoResearch:Math.max(0,Number(s.upgrades?.paleoTier)||0),research:nodes.filter(n=>s.purchases?.[n.id]).length,crafted:Object.keys(ctx.recipes||{}).filter(id=>s.craftedItems?.[id]).length,continentalKit:['brass_compass','oceanic_quadrant','field_telescope','scholar_hat','polar_coat'].filter(id=>s.craftedItems?.[id]).length,voyages:safe(s.museum?.voyagesCompleted),voyageTypes:new Set([...(e.voyageTypes||[]),...(s.voyageHistory||[]).map(h=>h.type)].filter(id=>(ctx.voyages||[]).some(v=>v.id===id))).size,deepCompleted:Math.max(safe(e.deepCompleted),deep.length),abyssVisited:regions.some(r=>r.depthTier==='abisal'&&s.regionsVisited?.[r.id])?1:0,abyssRecords:Math.max(safe(e.abyssRecords),deep.filter(h=>regions.some(r=>r.id===h.region&&r.depthTier==='abisal')).reduce((n,h)=>n+Object.values(h.records||{}).filter(n=>n>0).length,0)),specialGroups:new Set(special.map(id=>index.groups[id])).size,specialTotal:ids.reduce((n,id)=>n+Object.values(s.specialCounts?.[id]||{}).reduce((a,b)=>a+safe(b),0),0)+count(s.legendaryFound)};
 for(const level of [1,3,5])m['stage:'+level]=ids.filter(id=>(s.stages?.[id]||0)>=level).length;
 for(const pole of ['Ártico','Antártida'])m['pole:'+pole]=regions.some(r=>r.pole===pole&&s.regionsVisited?.[r.id])?1:0;
 for(const n of nodes)m['purchase:'+n.id]=s.purchases?.[n.id]?1:0;
 for(const branch of ['exploracion','naturalismo','museologia','expediciones'])m['branch:'+branch]=nodes.filter(n=>n.branch===branch&&s.purchases?.[n.id]).length;
 for(const id of Object.keys(ctx.recipes||{}))m['craft:'+id]=s.craftedItems?.[id]?1:0;
 for(const label of ['Notable','Albino','Melánico','Épico','Excepcional','Legendario'])m['variant:'+label]=label==='Legendario'?count(s.legendaryFound):ids.filter(id=>s.specialFound?.[id]?.[label]&&index.specials[id].includes(label)).length;
 for(const key of ['trade','trade24','market','barter'])m['counter:'+key]=safe(a.counters?.[key]);
 for(const method of ['sondeo','muestreo'])m['method:'+method]=(e.methods||[]).includes(method)||deep.some(h=>h.method===method)?1:0;
 return m;
}
const object=o=>o&&typeof o==='object'&&!Array.isArray(o)?o:{};
function normalize(s){
 const old=object(s.achievements),e=object(old.evidence);
 s.achievements={...old,version:1,unlocked:{...object(old.unlocked)},notified:{...object(old.notified)},recognized:{...object(old.recognized)},counters:Object.fromEntries(['trade','trade24','market','barter'].map(k=>[k,safe(old.counters?.[k])])),evidence:{...e,voyageTypes:[...new Set([...(Array.isArray(e.voyageTypes)?e.voyageTypes:[]),...(s.voyageHistory||[]).map(h=>h.type)])],methods:[...new Set([...(Array.isArray(e.methods)?e.methods:[]),...(s.deepSurvey?.history||[]).map(h=>h.method)])],deepCompleted:Math.max(safe(e.deepCompleted),(s.deepSurvey?.history||[]).length),abyssRecords:safe(e.abyssRecords)},featured:typeof old.featured==='string'?old.featured:''};
 return s.achievements;
}
function evaluate(s,ctx,selected=Object.keys(categories),options={}){
 const a=s.achievements,m=metrics(s,ctx),notices=[],now=options.now??Date.now();
 for(const d of catalog){if(!selected.includes(d.category)||a.unlocked[d.id]||(m[d.metric]||0)<d.target)continue;
  a.unlocked[d.id]={earnedAt:options.retroactive?null:now,observedAt:now,retroactive:!!options.retroactive};
  a.recognized[d.id]=true;a.notified[d.id]=true;notices.push(d.id);
 }
 return options.silent?[]:notices;
}
function initialize(s,ctx,{silent=false,now=Date.now()}={}){
 const first=!s.achievements||s.achievements.version!==1;normalize(s);
 const before=Object.keys(s.achievements.unlocked).length;
 evaluate(s,ctx,Object.keys(categories),{silent:true,retroactive:first,now});
 for(const id of Object.keys(s.achievements.unlocked))s.achievements.notified[id]=true;
 const gained=Object.keys(s.achievements.unlocked).length-before;
 return first&&gained&&!silent?[{summary:gained}]:[];
}
function increment(s,key,n=1){if(!['trade','trade24','market','barter'].includes(key)||!s.achievements)return;const a=s.achievements;a.counters[key]=Math.min(Number.MAX_SAFE_INTEGER,safe(a.counters[key])+safe(n));}
function record(s,type,data={}){
 if(!s.achievements)return;const e=s.achievements.evidence;
 if(type==='voyage'&&!e.voyageTypes.includes(data.type))e.voyageTypes.push(data.type);
 if(type==='deep'){e.deepCompleted=Math.min(Number.MAX_SAFE_INTEGER,e.deepCompleted+1);if(!e.methods.includes(data.method))e.methods.push(data.method);if(data.abyss&&Object.values(data.records||{}).some(n=>n>0))e.abyssRecords=Math.min(Number.MAX_SAFE_INTEGER,e.abyssRecords+1);}
}
root.AtlasAchievements3360=Object.freeze({categories,catalog:Object.freeze(catalog),metrics,group,normalize,evaluate,initialize,increment,record});
})(globalThis);
