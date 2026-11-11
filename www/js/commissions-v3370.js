/* Encargos: definiciones y evaluación puras; ni render ni cálculo pagan premios. */
(function(root){
'use strict';
const categories=Object.freeze({studies:{name:'Primeros estudios',icon:'📖'},world:{name:'Expediciones del mundo',icon:'🗺️'},museum:{name:'Museo y paleontología',icon:'🦴'},institute:{name:'Instituto y fabricación',icon:'🔬'},navigation:{name:'Navegación y Comercio',icon:'⚓'},extreme:{name:'Especializaciones y ambientes extremos',icon:'❄️'}});
const catalog=[];
function add(line,n,name,description,requirements,money,knowledge,items={},extra={}){catalog.push(Object.freeze({id:'enc_'+line+'_'+n,line,name,description,requirements:Object.freeze(requirements.map(([metric,target,label])=>Object.freeze({metric,target,label}))),reward:Object.freeze({money,knowledge,items:Object.freeze(items)}),...extra}));}
add('studies',1,'Tres páginas de campo','Prepara un primer registro diverso para la Sociedad.',[['discovered',3,'Identidades descubiertas'],['sightings',20,'Avistamientos conservados']],40,50,{parchment_scrap:1},{module:'field'});
add('studies',2,'Del apunte a la ficha','Avanza varios estudios, sin concentrar todo el trabajo en una sola ficha.',[['stage:1',3,'Especies en etapa 1 o superior'],['stage:2',1,'Especies en etapa 2 o superior']],60,70,{pressed_flower:1},{module:'journal',previous:'enc_studies_1'});
add('studies',3,'Correspondencia revisada','Entrega dos monografías y conserva una pequeña base de estudios avanzados.',[['published',2,'Monografías publicadas'],['stage:3',3,'Especies en etapa 3 o superior']],100,100,{}, {module:'society',previous:'enc_studies_2'});
add('studies',4,'Dos cuadernos de territorio','Visita dos regiones y estudia al menos dos especies de cada catálogo visitado. Las fichas no certifican el lugar de cada avistamiento.',[['visited',2,'Regiones visitadas'],['studiedVisited',2,'Catálogos visitados con dos especies estudiadas'],['stage:1',4,'Especies estudiadas distintas']],90,110,{river_pebble:2},{module:'atlas',previous:'enc_studies_3'});
add('world',1,'Itinerario comparado','Reúne fichas de dos catálogos de regiones visitadas dentro de un itinerario de tres sectores.',[['visited',3,'Regiones visitadas'],['studiedVisited',2,'Catálogos visitados con dos especies estudiadas']],100,120,{parchment_scrap:2},{module:'atlas'});
add('world',2,'Correspondencia entre continentes','Estudia catálogos de dos continentes que hayas visitado y desarrolla cinco fichas.',[['studiedContinents',2,'Continentes visitados con dos especies estudiadas'],['stage:2',5,'Especies en etapa 2 o superior']],150,180,{}, {module:'journal',previous:'enc_world_1'});
add('world',3,'Tres rutas de investigación','Combina tres tipos de expedición científica con un total de cuatro retornos acreditados.',[['voyageTypes',3,'Tipos científicos acreditados'],['voyages',4,'Expediciones científicas completadas']],180,200,{carved_wood:1},{module:'expeditions'});
add('world',4,'Dossier del viajero','Completa dos censos regionales, visita ocho sectores y publica cinco monografías.',[['visited',8,'Regiones visitadas'],['regional',2,'Catálogos regionales descubiertos completos'],['published',5,'Monografías publicadas']],220,250,{}, {module:'atlas',previous:'enc_world_3'});
add('museum',1,'Dos vitrinas documentadas','Mantén dos exposiciones y dos estudios de tercera etapa.',[['exhibits',2,'Especies expuestas'],['stage:3',2,'Especies en etapa 3 o superior']],70,100,{fossil_fragment:1},{module:'museum'});
add('museum',2,'Archivo y componentes','Cataloga una colección fósil y reúne cuatro huesos cortos. Se acredita el conjunto; no se consume al reclamar.',[['fossils',1,'Colecciones fósiles'],['stock:bone_short',4,'Huesos cortos disponibles']],100,150,{fossil_fragment:2},{module:'museum',previous:'enc_museum_1'});
add('museum',3,'Doble excavación documentada','Completa dos excavaciones y conserva una colección fósil catalogada.',[['excavations',2,'Excavaciones completadas'],['fossils',1,'Colecciones fósiles']],140,200,{fossil_tooth:2},{module:'museum',previous:'enc_museum_2'});
add('museum',4,'Gabinete de montaje','Reúne un dinosaurio montado, un artefacto catalogado y dos investigaciones de Museología.',[['dinosaurs',1,'Reconstrucciones únicas'],['artifacts',1,'Artefactos catalogados'],['branch:museologia',2,'Investigaciones de Museología']],220,280,{}, {module:'museum',previous:'enc_museum_3'});
add('institute',1,'Método y equipo de campo','Completa dos investigaciones de Exploración y fabrica un sombrero de campo.',[['branch:exploracion',2,'Investigaciones de Exploración'],['craft:field_hat',1,'Sombrero de campo fabricado']],60,100,{parchment_scrap:2},{module:'research'});
add('institute',2,'Instrumentos de observación','Acredita brújula y prismáticos fabricados, y una investigación de Naturalismo. No se consumen los instrumentos.',[['craft:brass_compass',1,'Brújula fabricada'],['craft:binoculars',1,'Prismáticos fabricados'],['branch:naturalismo',1,'Investigaciones de Naturalismo']],100,150,{}, {module:'objects',previous:'enc_institute_1'});
add('institute',3,'Reserva del taller','Reúne ocho pergaminos, cuatro maderas talladas y dos lentes. El encargo no consume esta reserva.',[['stock:parchment_scrap',8,'Pergaminos'],['stock:carved_wood',4,'Maderas talladas'],['stock:polished_lens',2,'Lentes pulidas']],120,180,{brass_shard:1},{module:'objects',previous:'enc_institute_2'});
add('institute',4,'Archivo del instrumentista','Fabrica telescopio y sombrero de estudioso, y completa doce nodos distintos de investigación.',[['craft:field_telescope',1,'Telescopio fabricado'],['craft:scholar_hat',1,'Sombrero de estudioso fabricado'],['research',12,'Nodos de investigación distintos']],200,260,{}, {module:'research',previous:'enc_institute_3'});
add('navigation',1,'Mesa de correspondencia naval','Completa cuatro expediciones de al menos dos tipos científicos.',[['voyages',4,'Retornos científicos'],['voyageTypes',2,'Tipos científicos acreditados']],80,100,{parchment_scrap:2},{module:'expeditions'});
add('navigation',2,'Suministros de dos travesías','Completa dos viajes comerciales y tres compras de mercado acreditadas desde 3.36.0.',[['counter:trade',2,'Retornos comerciales desde 3.36.0'],['counter:market',3,'Compras desde 3.36.0']],100,130,{}, {module:'expeditions',previous:'enc_navigation_1',since:'3.36.0'});
add('navigation',3,'Libro de equivalencias','Realiza dos trueques y cinco compras de mercado acreditadas desde 3.36.0.',[['counter:barter',2,'Trueques desde 3.36.0'],['counter:market',5,'Compras desde 3.36.0']],120,160,{carved_wood:1},{module:'expeditions',previous:'enc_navigation_2',since:'3.36.0'});
add('navigation',4,'Dossier de alta mar','Acredita cuatro retornos comerciales, uno de ruta de 24 horas, y tres tipos científicos. No exige fechas de conexión.',[['counter:trade',4,'Retornos comerciales desde 3.36.0'],['counter:trade24',1,'Retorno de ruta de 24 h desde 3.36.0'],['voyageTypes',3,'Tipos científicos acreditados']],220,280,{}, {module:'expeditions',previous:'enc_navigation_3',since:'3.36.0'});
add('extreme',1,'Gabinetes comparados','Estudia los cuatro grandes grupos zoológicos y desarrolla ocho fichas hasta la tercera etapa.',[['groups',4,'Grupos zoológicos descubiertos'],['stage:3',8,'Especies en etapa 3 o superior']],200,300,{}, {module:'journal'});
add('extreme',2,'Serie de singularidades','Registra Notables de tres identidades y especiales de dos grandes grupos, según sus configuraciones reales.',[['variant:Notable',3,'Identidades con Notable'],['specialGroups',2,'Grupos con especiales registrados']],240,360,{}, {module:'bestiary',previous:'enc_extreme_1'});
add('extreme',3,'Cuaderno de métodos profundos','Completa tres operaciones científicas profundas y acredita sondeo y muestreo.',[['deepCompleted',3,'Operaciones profundas acreditadas'],['method:sondeo',1,'Sondeo acreditado'],['method:muestreo',1,'Muestreo acreditado']],300,420,{parchment_scrap:2},{module:'field',previous:'enc_extreme_2',locate:'profundo_atlantico_profundo_norte'});
add('extreme',4,'Expediente de la fosa','Visita un sector abisal, recupera una identificación científica de una operación allí y desarrolla dos fichas de su catálogo hasta la tercera etapa.',[['abyssVisited',1,'Sector abisal visitado'],['abyssRecords',1,'Identificación de operación abisal'],['abyssStudies',2,'Especies del catálogo abisal en etapa 3']],350,500,{}, {module:'atlas',previous:'enc_extreme_3',locate:'abisal_fosa_oceanica_occidental'});
function metrics(s,ctx){
 const m={...root.AtlasAchievements3360.metrics(s,ctx)};
 m['stage:2']=Object.keys(ctx.species).filter(id=>(s.stages?.[id]||0)>=2).length;
 m.sightings=Object.keys(ctx.species).reduce((n,id)=>n+Math.max(0,Number(s.sightings?.[id])||0),0);
 const studied=r=>r.species.filter(id=>(s.stages?.[id]||0)>=1).length>=2;
 m.studiedVisited=ctx.regions.filter(r=>s.regionsVisited?.[r.id]&&studied(r)).length;
 m.studiedContinents=new Set(ctx.regions.filter(r=>s.regionsVisited?.[r.id]&&studied(r)).map(r=>r.continent)).size;
 m.abyssStudies=[...new Set(ctx.regions.filter(r=>r.depthTier==='abisal').flatMap(r=>r.species))].filter(id=>(s.stages?.[id]||0)>=3).length;
 m.excavations=Math.max(0,Number(s.museum?.excavationsCompleted)||0);
 for(const id of ['bone_short','parchment_scrap','carved_wood','polished_lens'])m['stock:'+id]=Math.max(0,Number(s.inventory?.[id])||0);
 return m;
}
function objective(d,m){const requirements=d.requirements.map(r=>({...r,value:Math.min(r.target,Math.max(0,Number(m[r.metric])||0))}));return {requirements,complete:requirements.every(r=>r.value>=r.target),fraction:requirements.reduce((n,r)=>n+r.value/r.target,0)/requirements.length};}
function evaluate(s,ctx){const m=metrics(s,ctx),c=s.commissions||{};return catalog.map(d=>{const p=objective(d,m),satisfied=!!c.satisfied?.[d.id]||p.complete,available=!d.previous||!!c.ready?.[d.previous]||!!c.claimed?.[d.previous];return {definition:d,...p,satisfied,available,ready:!!c.ready?.[d.id]||satisfied&&available,claimed:!!c.claimed?.[d.id]};});}
const object=o=>o&&typeof o==='object'&&!Array.isArray(o)?o:{};
const copy=o=>JSON.parse(JSON.stringify(object(o)));
function normalize(s,ctx){const old=object(s.commissions);s.commissions={...old,version:1,satisfied:copy(old.satisfied),ready:copy(old.ready),claimed:copy(old.claimed),legacyClaims:copy(old.legacyClaims),notified:{...object(old.notified)},tracked:[...new Set(Array.isArray(old.tracked)?old.tracked:[])].filter(id=>catalog.some(d=>d.id===id)||ctx.legacy.some(d=>d.id===id)).slice(0,3)};
 for(const d of ctx.legacy)if(s.purchases?.['mission_'+d.id])s.commissions.legacyClaims[d.id]??={claimedAt:null,source:'historical-marker'};
 return s.commissions;
}
function mergeReceipts(s,before,ctx){
 normalize(s,ctx);if(!s.collectionId||s.collectionId!==before?.collectionId)return;
 const old=object(before.commissions);s.commissions.claimed={...s.commissions.claimed,...copy(old.claimed)};s.commissions.legacyClaims={...s.commissions.legacyClaims,...copy(old.legacyClaims)};
 for(const d of ctx.legacy)if(before.purchases?.['mission_'+d.id])s.commissions.legacyClaims[d.id]??={claimedAt:null,source:'same-game-marker'};
 for(const id of Object.keys(s.commissions.legacyClaims))if(ctx.legacy.some(d=>d.id===id))s.purchases['mission_'+id]=1;
}
function sync(s,ctx,{silent=false,retroactive=false,now=Date.now()}={}){
 const c=s.commissions,notices=[],m=metrics(s,ctx);
 for(const d of catalog)if(!c.satisfied[d.id]&&objective(d,m).complete)c.satisfied[d.id]={observedAt:now,completedAt:retroactive?null:now};
 // Ordered DAG: a predecessor's fulfilled objective enables its successor, without forcing a claim.
 for(const d of catalog){if(!c.ready[d.id]&&c.satisfied[d.id]&&(!d.previous||c.ready[d.previous]||c.claimed[d.previous]))c.ready[d.id]={observedAt:now,completedAt:retroactive?null:now};
  if(c.ready[d.id]&&!c.claimed[d.id]&&!c.notified[d.id]){c.notified[d.id]=true;notices.push(d.id);}}
 for(const d of ctx.legacy){const key='legacy:'+d.id;if(!s.purchases['mission_'+d.id]&&d.progress()>=d.target&&!c.notified[key]){c.notified[key]=true;notices.push(key);}}
 return silent?[]:notices;
}
function initialize(s,ctx){normalize(s,ctx);sync(s,ctx,{silent:true,retroactive:true});}
function pay(s,id,now=Date.now()){
 const d=catalog.find(d=>d.id===id),c=s.commissions;if(!d||!c?.ready[id]||c.claimed[id])return false;
 c.claimed[id]={claimedAt:now,reward:{money:d.reward.money,knowledge:d.reward.knowledge,items:{...d.reward.items}}};
 s.money+=d.reward.money;s.knowledge+=d.reward.knowledge;for(const [item,n]of Object.entries(d.reward.items))s.inventory[item]=(s.inventory[item]||0)+n;
 c.tracked=c.tracked.filter(x=>x!==id);return true;
}
function track(s,id,ctx){const c=s.commissions;if(!c||!(catalog.some(d=>d.id===id)||ctx?.legacy.some(d=>d.id===id)))return false;const i=c.tracked.indexOf(id);if(i>=0){c.tracked.splice(i,1);return true;}if(c.tracked.length>=3||c.claimed[id]||s.purchases?.['mission_'+id])return false;c.tracked.push(id);return true;}
function models(s,ctx){const list=evaluate(s,ctx).map(x=>({...x,id:x.definition.id,legacy:false,tracked:s.commissions.tracked.includes(x.definition.id)}));
 for(const d of ctx.legacy){const value=Math.min(d.target,Math.max(0,d.progress())),claimed=!!s.purchases['mission_'+d.id];list.push({id:d.id,definition:{id:d.id,line:'legacy',name:d.name,description:d.desc,module:d.id.includes('museo')||d.id.includes('paleonto')?'museum':d.id.includes('viajes')?'expeditions':d.id.includes('publicacion')?'society':'field',reward:{money:d.money,knowledge:d.knowledge,items:d.items||{}}},legacy:true,requirements:[{metric:'legacy:'+d.id,target:d.target,value,label:d.desc}],fraction:value/d.target,satisfied:value>=d.target,available:true,ready:value>=d.target,claimed,tracked:s.commissions.tracked.includes(d.id)});}
 return list;
}
root.AtlasCommissions3370=Object.freeze({categories,catalog:Object.freeze(catalog),metrics,objective,evaluate,normalize,mergeReceipts,sync,initialize,pay,track,models});
})(globalThis);
