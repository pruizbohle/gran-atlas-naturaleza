/* MEC-08 · V5.6.8 Beta · Encargos, logros, reconocimientos y eventos especiales.
   Configuración y reglas puras. Amplía los motores existentes (AtlasAchievements3360.extend y
   AtlasCommissions3370.extend) y define un único motor de encargos renovables (correspondencia,
   proyectos institucionales y encargos de evento) y el calendario de eventos.
   El estado vive en state.mec08 (app.js, bloque MEC-08). Valores PROVISIONALES (BAL-01). */
(function(root){
'use strict';
const plain=o=>o&&typeof o==='object'&&!Array.isArray(o);
const num=v=>Number.isFinite(Number(v))?Number(v):0;
const sum=o=>Object.values(o||{}).reduce((t,v)=>t+Math.max(0,num(v?.count??v)),0);

/* ── 1. Métricas comunes (logros, encargos y plantillas) ─────────────────────────────────── */
function metrics(s,ctx={},base={}){
 const K3=root.AtlasMEC03Catalog,X4=root.AtlasMEC04,X6=root.AtlasMEC06,X7=root.AtlasMEC07,A6=root.AtlasMEC06Actions,A5=root.AtlasMEC05Actions;
 const regions=ctx.regions||[],m={};
 // Zoología
 m.dimorphism=Object.values(s.dimorphism||{}).filter(Boolean).length;
 m.sightingsTotal=Object.values(s.sightings||{}).reduce((t,v)=>t+Math.max(0,num(v)),0);
 m.discoveredAll=Object.values(s.discovered||{}).filter(Boolean).length;
 m.publishedAll=Object.values(s.published||{}).filter(Boolean).length;
 // Récords y conductas (MEC-07)
 const nr=plain(s.naturalRecords)?s.naturalRecords:{},recs=plain(nr.records)?nr.records:{},beh=plain(nr.behaviors)?nr.behaviors:{};
 const R=X7?.RECORDS||[];
 m.recordsObserved=Object.values(recs).filter(r=>num(r?.count)>0).length;
 m.recordsAchieved=Object.values(recs).filter(r=>r?.achieved).length;
 m.recordsMinAchieved=R.filter(e=>X7.TYPES[e.type]?.direction==='min'&&recs[e.id]?.achieved).length;
 m.recordsValidated=Object.values(recs).filter(r=>r?.best?.instrument||r?.validations>0).length;
 m.behaviorsFound=Object.values(beh).filter(b=>num(b?.count)>0).length;
 m.recordRegions=new Set([...Object.values(recs).flatMap(r=>Object.keys(r?.regions||{})),...Object.values(beh).flatMap(b=>Object.keys(b?.regions||{}))]).size;
 // Coleccionables (registro permanente de MEC-01: no se pierde al vender o intercambiar)
 const reg=plain(s.collectionRegistry?.pieces)?s.collectionRegistry.pieces:{},P=K3?.pieces||{};
 const found=id=>!!reg[id];
 m.piecesFound=Object.keys(P).filter(found).length;
 const cols={};for(const p of Object.values(P)){(cols[p.collection]=cols[p.collection]||{cabinet:p.cabinet,ids:[]}).ids.push(p.id);}
 const done=Object.values(cols).filter(c=>c.ids.every(found));
 m.collectionsComplete=done.length;
 for(const cab of ['Botánica','Geología','Oceanografía','Historia','Historia natural y exploración']){const all=Object.values(cols).filter(c=>c.cabinet===cab);m['cabinetComplete:'+cab]=all.length&&all.every(c=>c.ids.every(found))?1:0;}
 for(const src of ['campo','expediciones','excavaciones','prospecciones','comercio','encargos','taller'])m['pieces:'+src]=Object.values(reg).reduce((t,r)=>t+num(r?.sources?.[src]),0);
 // Campamento
 const lv=plain(s.camp?.levels)?s.camp.levels:{},L=['shipyard','caravan','workshop','excavations','surveys'].map(k=>Math.max(1,num(lv[k])||1));
 m.campMax=Math.max(...L);m.campMin=Math.min(...L);m.campUpgrades=L.reduce((t,v)=>t+v-1,0);
 // Museo
 m.museumWing=num(s.museum?.wing)||1;
 let themes=0,themeComplete=0;try{const mm=A5?.model?.();if(mm){themes=mm.themes.length;themeComplete=mm.themes.filter(t=>t.tier==='completa').length;}}catch(_){}
 m.themesActive=themes;m.themesComplete=themeComplete;
 const arts=Object.keys(X6?.ARTIFACTS||{});
 m.artifactsExhibited=A6?arts.filter(id=>A6.location(id)==='museo').length:0;
 m.artifactsCatalogued=arts.filter(id=>s.museum?.collections?.[id]).length;
 m.instrumentsCatalogued=arts.filter(id=>s.museum?.collections?.[id]&&X6.ARTIFACTS[id].functions.some(f=>f==='B'||f==='D')).length;
 m.demos=sum(s.mec06?.demos);m.studies=sum(s.mec06?.studies);m.advancedExperiments=num(s.mec06?.studies?.induccion?.count);
 m.componentsCrafted=Object.keys(X6?.COMPONENTS||{}).filter(id=>s.craftedItems?.[id]).length;
 // Sociedad
 m.rank=X4?X4.rank(s):1;
 const g=plain(s.society?.grants)?s.society.grants:{};m.fundingClaims=['campo','expediciones','proyectos','patrocinio'].reduce((t,k)=>t+num(g[k]?.count),0);
 // Exploración, registros regionales efectivos (MEC-06) y actividades
 const rr=plain(s.regionalRecords?.regions)?s.regionalRecords.regions:{};
 m.regionalCensus=regions.filter(r=>s.regionsVisited?.[r.id]&&(r.species||[]).length&&(r.species||[]).every(id=>rr[r.id]?.species?.[id])).length;
 m.continentsRecorded=new Set(regions.filter(r=>Object.keys(rr[r.id]?.species||{}).length).map(r=>r.continent)).size;
 m.prospections=Object.keys(s.prospections?.settled||{}).length;
 m.voyagesDone=num(s.museum?.voyagesCompleted);
 m.excavationsDone=num(s.museum?.excavationsCompleted);
 const c=plain(s.mec08?.counters)?s.mec08.counters:{};
 for(const k of ['crafted','specializedVoyages','specialDigs','nightObservations','contractsClaimed','validations'])m['counter:'+k]=num(c[k]);
 m.deepOps=num(s.achievements?.evidence?.deepCompleted);
 m.exhibitsNow=Object.keys(s.museum?.exhibits||{}).length;
 m.cabinetPiecesShown=Object.values(s.museum?.cabinets||{}).reduce((t,l)=>t+(Array.isArray(l)?l.length:0),0);
 m.visitedAll=regions.filter(r=>s.regionsVisited?.[r.id]).length;
 m.unlockedAll=regions.filter(r=>s.regionUnlocked?.[r.id]).length;
 const animal=Object.values(root.AtlasMEC06?.ANIMAL_GROUPS||{}).flatMap(g=>g.ids);m.animalStock=animal.reduce((t,id)=>t+Math.max(0,num(s.inventory?.[id])),0);
 m.regionalSpecies=Object.values(rr).reduce((t,r)=>t+Object.keys(r?.species||{}).length,0);
 m.naturalObservations=Object.values(recs).reduce((t,r)=>t+num(r?.count),0)+Object.values(beh).reduce((t,b)=>t+num(b?.count),0);
 for(const id of Object.keys(EVENTS_BY_ID))m['eventMedal:'+id]=Array.isArray(s.mec08?.medals?.[id])?s.mec08.medals[id].length:0;
 return m;
}

/* ── 2. Logros nuevos y actualizados (73) ─────────────────────────────────────────────────── */
const CATEGORIES=Object.freeze({records:'Récords naturales y conductas',collections:'Coleccionables',camp:'Campamento y Sociedad',workshop:'Taller e instrumentación',events:'Eventos conmemorativos'});
const ACH=[];
const A=(category,id,name,metric,target,description,tier,extra={})=>ACH.push(Object.freeze({category,id,name,metric,target,description,tier,extra:{art:'medal-'+id,migration:'retroactivo si hay datos registrados',...extra}}));
// Actualización del catálogo completo (los ids históricos se conservan como reconocimientos intermedios).
A('exploration','world_unlocked_125','Atlas completo','unlockedAll',125,'Desbloquea las 125 regiones del catálogo completo. El logro histórico de 113 se conserva como reconocimiento intermedio.','Platino',{title:'Cartógrafo del Atlas completo'});
A('exploration','visit_50','Cartógrafo de 50 regiones','visitedAll',50,'Visita 50 regiones.','Oro');
A('exploration','visit_100','Cartógrafo de 100 regiones','visitedAll',100,'Visita 100 regiones.','Oro');
A('exploration','visit_125','Todas las regiones visitadas','visitedAll',125,'Visita las 125 regiones.','Platino');
A('zoology','discover_1000','Mil identidades','discoveredAll',1000,'Descubre las 1.000 especies del catálogo completo. «900 identidades» se conserva como intermedio.','Platino',{title:'Naturalista de las mil especies'});
A('zoology','publish_250','250 monografías','publishedAll',250,'Publica 250 monografías.','Oro');
A('zoology','publish_500','500 monografías','publishedAll',500,'Publica 500 monografías.','Oro');
A('zoology','publish_1000','Catálogo zoológico completo','publishedAll',1000,'Publica las 1.000 monografías. «945 monografías» se conserva como intermedio.','Platino',{title:'Autor del catálogo completo'});
A('zoology','dimorphism_10','Dimorfismo en 10 especies','dimorphism',10,'Documenta macho y hembra en 10 especies.','Plata');
A('zoology','dimorphism_50','Dimorfismo en 50 especies','dimorphism',50,'Documenta macho y hembra en 50 especies.','Oro');
A('specimens','legendary_10','Diez leyendas','variant:Legendario',10,'Registra 10 especímenes legendarios.','Platino',{secret:true});
A('specimens','legendary_30','Bestiario de leyendas','variant:Legendario',30,'Registra los 30 especímenes legendarios.','Platino',{secret:true,title:'Guardián de leyendas'});
// Regiones: registros regionales efectivos (no el catálogo global).
A('exploration','regional_census_1','Censo regional efectivo','regionalCensus',1,'Visita una región y avista en ella todas sus especies (registro regional desde MEC-06).','Plata');
A('exploration','regional_census_10','Diez censos regionales efectivos','regionalCensus',10,'Completa el registro regional de 10 regiones visitadas.','Oro');
A('exploration','continents_recorded','Corresponsal de ocho continentes','continentsRecorded',8,'Registra avistamientos en regiones de ocho continentes o mares.','Oro');
A('navigation','specialized_1','Expedición especializada','counter:specializedVoyages',1,'Liquida una expedición con modalidad especializada (desde MEC-08).','Plata',{since:'MEC-08'});
A('navigation','specialized_10','Diez expediciones especializadas','counter:specializedVoyages',10,'Liquida 10 expediciones especializadas (desde MEC-08).','Oro',{since:'MEC-08'});
A('navigation','deep_10','Diez operaciones profundas','deepOps',10,'Completa 10 sondeos o muestreos profundos.','Oro');
A('navigation','prospection_1','Primera prospección','prospections',1,'Liquida una prospección.','Bronce');
A('navigation','prospection_10','Diez prospecciones','prospections',10,'Liquida 10 prospecciones.','Plata');
A('museum','excavation_10','Diez excavaciones','excavationsDone',10,'Completa 10 excavaciones.','Plata');
A('museum','excavation_special','Excavación especial','counter:specialDigs',1,'Completa una excavación en modalidad especial o en un yacimiento de MEC-04 (desde MEC-08).','Oro',{since:'MEC-08'});
A('museum','relict_20','Los veinte relictos','relicts',20,'Obtén los 20 relictos.','Platino',{secret:true,title:'Archivista de relictos'});
// Récords y conductas: medallas sin recompensa económica (MEC-07 ya pagó conocimiento y prestigio).
A('records','record_first','Primera observación especial','recordsObserved',1,'Registra la primera observación de un récord natural.','Bronce');
A('records','record_milestone_1','Primer hito natural','recordsAchieved',1,'Cumple un hito de récord natural.','Plata');
A('records','record_milestone_5','Cinco hitos naturales','recordsAchieved',5,'Cumple cinco hitos.','Oro');
A('records','record_milestone_10','Diez hitos naturales','recordsAchieved',10,'Cumple diez hitos.','Oro');
A('records','record_milestone_25','Todos los hitos naturales','recordsAchieved',25,'Cumple los 25 hitos de récord natural.','Platino',{title:'Cronista de récords'});
A('records','record_minimum','Lo diminuto también cuenta','recordsMinAchieved',1,'Cumple un hito de tamaño mínimo.','Plata');
A('records','record_validated_1','Evidencia validada','recordsValidated',1,'Valida científicamente un registro.','Plata');
A('records','record_validated_5','Cinco validaciones','recordsValidated',5,'Valida los cinco hitos con validación instrumental.','Oro');
A('records','record_regions_10','Récords en diez regiones','recordRegions',10,'Obtén registros especiales en 10 regiones distintas.','Plata');
A('records','behavior_1','Primera conducta extraordinaria','behaviorsFound',1,'Registra una conducta extraordinaria.','Bronce');
A('records','behavior_5','Cinco conductas','behaviorsFound',5,'Registra cinco conductas.','Plata');
A('records','behavior_10','Diez conductas','behaviorsFound',10,'Registra diez conductas.','Oro');
A('records','behavior_20','Etólogo de la Sociedad','behaviorsFound',20,'Registra las 20 conductas extraordinarias.','Platino',{title:'Etólogo de la Sociedad'});
// Coleccionables
for(const [n,t] of [[1,'Bronce'],[25,'Bronce'],[50,'Plata'],[100,'Plata'],[250,'Oro'],[431,'Platino']])A('collections','pieces_'+n,n===1?'Primer coleccionable':n===431?'Las 431 piezas':n+' piezas descubiertas','piecesFound',n,n===1?'Registra tu primera pieza coleccionable.':'Registra '+n+' piezas distintas (registro permanente).',t,n===431?{title:'Gran coleccionista'}:{});
A('collections','collection_1','Primera colección completa','collectionsComplete',1,'Completa una colección en el registro permanente.','Plata');
A('collections','collection_8','Ocho colecciones','collectionsComplete',8,'Completa ocho colecciones.','Oro');
A('collections','collection_32','Las 32 colecciones','collectionsComplete',32,'Completa las 32 colecciones.','Platino',{title:'Conservador de gabinetes'});
for(const [cab,slug] of [['Botánica','botanica'],['Geología','geologia'],['Oceanografía','oceanografia'],['Historia','historia'],['Historia natural y exploración','exploracion']])A('collections','cabinet_'+slug,'Gabinete completo · '+cab,'cabinetComplete:'+cab,1,'Completa todas las colecciones del gabinete de '+cab+'.','Oro');
// Campamento y Sociedad
A('camp','camp_first','Primera mejora del Campamento','campUpgrades',1,'Mejora una instalación.','Bronce');
A('camp','camp_level3','Instalación de nivel III','campMax',3,'Lleva una instalación al nivel III.','Plata');
A('camp','camp_level5','Instalación de nivel V','campMax',5,'Lleva una instalación al nivel V.','Oro');
A('camp','camp_all3','Campamento consolidado','campMin',3,'Lleva las cinco instalaciones al nivel III.','Oro');
A('camp','camp_all5','Campamento desarrollado','campMin',5,'Lleva las cinco instalaciones al nivel V.','Platino',{title:'Intendente de expediciones'});
A('camp','rank_5','Observador de la Sociedad','rank',5,'Alcanza el rango 5.','Plata');
A('camp','rank_10','Corresponsal reconocido','rank',10,'Alcanza el rango 10.','Oro');
A('camp','rank_15','Rango emblemático','rank',15,'Alcanza el rango 15.','Oro');
A('camp','rank_20','Gran Naturalista','rank',20,'Alcanza el rango 20 de la Sociedad.','Platino',{title:'Gran Naturalista'});
A('camp','funding_first','Primera financiación','fundingClaims',1,'Cobra una financiación de la Sociedad.','Bronce');
// Museo
A('museum','museum_wing_3','Gran galería zoológica','museumWing',3,'Amplía el Museo al nivel III.','Plata');
A('museum','museum_wing_5','Gabinete de maravillas','museumWing',5,'Amplía el Museo al nivel V.','Platino');
A('museum','theme_1','Primera exposición temática','themesActive',1,'Mantén activa una exposición temática.','Plata');
A('museum','theme_complete','Colección completa exhibida','themesComplete',1,'Exhibe completa una colección.','Oro');
A('museum','artifacts_exhibited_5','Sala de instrumentos','artifactsExhibited',5,'Mantén cinco artefactos en vitrina.','Plata');
A('museum','demo_1','Primera demostración','demos',1,'Presenta una demostración científica.','Bronce');
A('museum','demo_10','Diez demostraciones','demos',10,'Presenta diez demostraciones.','Oro');
// Taller e instrumentación
A('workshop','components_6','Los seis componentes','componentsCrafted',6,'Fabrica los seis componentes del Taller.','Oro');
A('workshop','instruments_5','Cinco instrumentos','instrumentsCatalogued',5,'Cataloga cinco instrumentos científicos.','Plata');
A('workshop','artifacts_20','Los veinte artefactos','artifactsCatalogued',20,'Cataloga los 20 artefactos.','Platino',{title:'Instrumentista de la Sociedad'});
A('workshop','studies_1','Primer estudio científico','studies',1,'Realiza un estudio científico.','Bronce');
A('workshop','studies_25','Veinticinco estudios','studies',25,'Realiza 25 estudios científicos.','Oro');
A('workshop','advanced_experiment','Experimento de inducción','advancedExperiments',1,'Realiza el experimento de inducción.','Oro');
A('workshop','crafted_25','Veinticinco fabricaciones','counter:crafted',25,'Fabrica 25 objetos (desde MEC-08).','Plata',{since:'MEC-08'});

/* ── 3. Encargos permanentes nuevos (motor de 3370) ─────────────────────────────────────── */
const COMMISSION_CATEGORIES=Object.freeze({collections:{name:'Coleccionables y gabinetes',icon:'🗃️'},workshop:{name:'Taller e instrumentos',icon:'🔭'},records:{name:'Récords y conductas',icon:'◆'},camp:{name:'Campamento y expediciones',icon:'⛺'}});
const C=(line,n,name,description,requirements,money,knowledge,items,extra)=>({line,n,name,description,requirements,money,knowledge,items,extra:{art:'commission-'+line+'-'+n,...extra}});
const COMMISSIONS=Object.freeze([
 C('collections',1,'Primeras piezas del gabinete','Registra cinco piezas coleccionables y expón una en un gabinete.',[['piecesFound',5,'Piezas registradas'],['cabinetPiecesShown',1,'Piezas expuestas']],80,80,{},{module:'museum'}),
 C('collections',2,'Una colección para la Sociedad','Completa una colección del registro permanente.',[['collectionsComplete',1,'Colecciones completas']],180,160,{},{module:'museum',previous:'enc_collections_1'}),
 C('collections',3,'Exposición temática','Activa una exposición temática en el Museo.',[['themesActive',1,'Temáticas activas']],220,200,{},{module:'museum',previous:'enc_collections_2'}),
 C('workshop',1,'Primer componente','Fabrica un componente del Taller (desde el nivel II).',[['componentsCrafted',1,'Componentes fabricados']],100,120,{brass_shard:2},{module:'expeditions',gate:{workshop:2}}),
 C('workshop',2,'Instrumento catalogado','Cataloga un instrumento científico.',[['instrumentsCatalogued',1,'Instrumentos catalogados']],180,200,{},{module:'expeditions',previous:'enc_workshop_1',gate:{workshop:3}}),
 C('workshop',3,'Tres estudios científicos','Realiza tres estudios en el Taller.',[['studies',3,'Estudios realizados']],200,240,{parchment_scrap:2},{module:'expeditions',previous:'enc_workshop_2',gate:{workshop:2}}),
 C('records',1,'Observación extraordinaria','Registra un récord natural o una conducta extraordinaria.',[['recordsObserved',1,'Récords observados']],80,120,{},{module:'journal'}),
 C('records',2,'Conductas documentadas','Registra tres conductas extraordinarias.',[['behaviorsFound',3,'Conductas registradas']],160,220,{},{module:'journal',previous:'enc_records_1'}),
 C('records',3,'Hito para el Cuaderno','Cumple un hito de récord natural.',[['recordsAchieved',1,'Hitos cumplidos']],220,260,{},{module:'journal',previous:'enc_records_2'}),
 C('camp',1,'Campamento en marcha','Mejora dos veces las instalaciones del Campamento.',[['campUpgrades',2,'Mejoras de instalación']],120,100,{},{module:'expeditions'}),
 C('camp',2,'Expedición especializada','Liquida una expedición especializada (Astillero III).',[['counter:specializedVoyages',1,'Expediciones especializadas desde MEC-08']],200,220,{},{module:'expeditions',previous:'enc_camp_1',gate:{shipyard:3}}),
 C('camp',3,'Prospección del terreno','Liquida dos prospecciones (Prospecciones II).',[['prospections',2,'Prospecciones liquidadas']],180,200,{river_pebble:3},{module:'expeditions',gate:{surveys:2}})
]);

/* ── 4. Plantillas de encargos renovables (un solo motor) ──────────────────────────────────
   mode: «incremental» (solo cuenta lo posterior a la aceptación), «posesion» (se acredita sin consumir)
   o «historico». requires: rango, instalaciones, Astillero, regiones accesibles. scale: objetivo por
   rango (se fija al generar). */
const T=(o)=>Object.freeze({kind:'correspondencia',requires:{},weight:1,...o,art:'contract-'+o.id});
const TEMPLATES=Object.freeze([
 T({id:'obs-campo',name:'Notas de campo',description:'Envía avistamientos nuevos a la Sociedad.',objectives:[{metric:'sightingsTotal',mode:'incremental',target:[20,40,60]}],reward:{money:60,knowledge:60}}),
 T({id:'especies-nuevas',name:'Especies para el catálogo',description:'Descubre especies que aún no figuran en tu Cuaderno.',objectives:[{metric:'discoveredAll',mode:'incremental',target:[2,3,4]}],reward:{money:90,knowledge:90},requires:{undiscovered:4}}),
 T({id:'monografias',name:'Correspondencia editorial',description:'Publica monografías nuevas.',objectives:[{metric:'publishedAll',mode:'incremental',target:[1,2,3]}],reward:{money:120,knowledge:80},requires:{publishable:1}}),
 T({id:'recoleccion',name:'Hallazgos del terreno',description:'Recupera piezas coleccionables en el campo.',objectives:[{metric:'pieces:campo',mode:'incremental',target:[1,1,2]}],reward:{money:80,knowledge:60}}),
 T({id:'materiales',name:'Muestras de referencia',description:'Acredita materiales animales en tu inventario (no se entregan).',objectives:[{metric:'animalStock',mode:'posesion',target:[3,6,10]}],reward:{money:70,knowledge:70}}),
 T({id:'analisis',name:'Informe de laboratorio',description:'Realiza estudios científicos en el Taller.',objectives:[{metric:'studies',mode:'incremental',target:[1,2,3]}],reward:{money:110,knowledge:140},requires:{workshop:2}}),
 T({id:'fabricacion',name:'Encargo del instrumentista',description:'Fabrica objetos en el Taller.',objectives:[{metric:'counter:crafted',mode:'incremental',target:[2,4,6]}],reward:{money:90,knowledge:80}}),
 T({id:'prospecciones',name:'Muestras del subsuelo',description:'Liquida prospecciones.',objectives:[{metric:'prospections',mode:'incremental',target:[1,2,2]}],reward:{money:140,knowledge:120},requires:{surveys:2}}),
 T({id:'expediciones',name:'Correspondencia de ultramar',description:'Completa expediciones científicas.',objectives:[{metric:'voyagesDone',mode:'incremental',target:[1,2,3]}],reward:{money:150,knowledge:120},requires:{shipyard:true}}),
 T({id:'excavaciones',name:'Noticias de los estratos',description:'Completa excavaciones.',objectives:[{metric:'excavationsDone',mode:'incremental',target:[1,2,2]}],reward:{money:140,knowledge:140},requires:{digSite:true}}),
 T({id:'exhibicion',name:'Visita de la comisión',description:'Mantén especies expuestas en el Museo cuando la comisión las revise.',objectives:[{metric:'exhibitsNow',mode:'posesion',target:[2,4,6]}],reward:{money:100,knowledge:60},requires:{museumSlots:true}}),
 T({id:'duplicados',name:'Intercambio de duplicados',description:'Obtén piezas mediante la Caravana.',objectives:[{metric:'pieces:comercio',mode:'incremental',target:[1,1,2]}],reward:{money:90,knowledge:90},requires:{caravan:2}}),
 T({id:'regiones',name:'Nuevas tierras',description:'Visita regiones accesibles que aún no conoces.',objectives:[{metric:'visitedAll',mode:'incremental',target:[1,2,2]}],reward:{money:80,knowledge:80},requires:{unvisited:2}}),
 // Proyectos institucionales (mismo motor; varios objetivos y rango)
 T({id:'proy-multidisciplinar',kind:'proyecto',name:'Expedición científica multidisciplinaria',description:'Combina expediciones especializadas, estudios y una publicación.',objectives:[{metric:'counter:specializedVoyages',mode:'incremental',target:2},{metric:'studies',mode:'incremental',target:3},{metric:'publishedAll',mode:'incremental',target:1}],reward:{money:900,knowledge:700},requires:{rank:8,shipyard:3,workshop:2,publishable:1}}),
 T({id:'proy-region',kind:'proyecto',name:'Estudio de una región',description:'Avista especies nuevas en el registro regional de cualquier región.',objectives:[{metric:'regionalSpecies',mode:'incremental',target:8}],reward:{money:600,knowledge:500},requires:{rank:6}}),
 T({id:'proy-exposicion',kind:'proyecto',name:'Preparación de una exposición temática',description:'Activa una temática y expón al menos ocho piezas.',objectives:[{metric:'themesActive',mode:'posesion',target:1},{metric:'cabinetPiecesShown',mode:'posesion',target:8}],reward:{money:700,knowledge:500},requires:{rank:7,museumWing:2}}),
 T({id:'proy-materiales',kind:'proyecto',name:'Investigación de materiales',description:'Realiza estudios y fabrica componentes.',objectives:[{metric:'studies',mode:'incremental',target:5},{metric:'counter:crafted',mode:'incremental',target:3}],reward:{money:800,knowledge:900},requires:{rank:10,workshop:4}}),
 T({id:'proy-documentacion',kind:'proyecto',name:'Programa de documentación zoológica',description:'Registra observaciones especiales y publica monografías.',objectives:[{metric:'naturalObservations',mode:'incremental',target:3},{metric:'publishedAll',mode:'incremental',target:2}],reward:{money:700,knowledge:800},requires:{rank:7,publishable:2}}),
 T({id:'proy-paleo',kind:'proyecto',name:'Proyecto paleontológico',description:'Completa excavaciones para la Sociedad.',objectives:[{metric:'excavationsDone',mode:'incremental',target:3}],reward:{money:800,knowledge:700},requires:{rank:9,digSite:true}}),
 T({id:'proy-continentes',kind:'proyecto',name:'Correspondencia entre continentes',description:'Registra avistamientos en regiones de dos continentes distintos.',objectives:[{metric:'continentsRecorded',mode:'incremental',target:1},{metric:'sightingsTotal',mode:'incremental',target:30}],reward:{money:900,knowledge:800},requires:{rank:12}})
]);
const CONTRACT_POLICY=Object.freeze({periodHours:72,offers:{correspondencia:3,proyecto:1},maxActive:{correspondencia:3,proyecto:1},abandon:'libera el hueco; la siguiente oferta llega con el próximo periodo',expireOffers:true,acceptedExpire:false,eventGraceDays:14});

/* ── 5. Calendario de eventos ─────────────────────────────────────────────────────────────
   Hora local del dispositivo; la ocurrencia empieza a las 00:00 locales y dura `days` días. Las
   celebraciones modernas se presentan como celebraciones externas adaptadas, no como fiestas de 1842. */
const E=(o)=>Object.freeze({recurrence:'anual',modifiers:[],...o,art:'event-'+o.id,medalArt:'medal-event-'+o.id});
const EVENTS=Object.freeze([
 E({id:'ano-nuevo',name:'Año Nuevo: nuevos horizontes',theme:'Exploración',rule:{type:'fijo',month:1,day:1},days:7,external:true,description:'Celebración externa del año nuevo civil.',contract:{objectives:[{metric:'visitedAll',mode:'incremental',target:1}],reward:{money:150,knowledge:150},requires:{unvisited:1},alt:{objectives:[{metric:'sightingsTotal',mode:'incremental',target:25}]}}}),
 E({id:'dia-darwin',name:'Día de Darwin: correspondencia naturalista',theme:'Monografías',rule:{type:'fijo',month:2,day:12},days:5,external:true,description:'Celebración moderna del natalicio de Charles Darwin (12 de febrero de 1809); en 1842 sería una correspondencia entre naturalistas.',contract:{objectives:[{metric:'publishedAll',mode:'incremental',target:2}],reward:{money:200,knowledge:200},requires:{publishable:2},alt:{objectives:[{metric:'sightingsTotal',mode:'incremental',target:30}]}}}),
 E({id:'equinoccio-marzo',name:'Equinoccio de marzo',theme:'Botánica',rule:{type:'equinoccio',month:3},days:3,external:false,description:'Fecha astronómica calculada para cada año.',modifiers:[{activity:'campo:ambiental:botanica',value:0.25,cap:0.25}],contract:{objectives:[{metric:'pieces:campo',mode:'incremental',target:1}],reward:{money:150,knowledge:120}}}),
 E({id:'dia-tierra',name:'Día de la Tierra',theme:'Geología',rule:{type:'fijo',month:4,day:22},days:5,external:true,description:'Celebración externa moderna (desde 1970), adaptada al Atlas.',modifiers:[{activity:'prospeccion:geologica',value:0.15,cap:0.15}],contract:{objectives:[{metric:'prospections',mode:'incremental',target:1}],reward:{money:180,knowledge:160},requires:{surveys:2},alt:{objectives:[{metric:'pieces:campo',mode:'incremental',target:1}]}}}),
 E({id:'dia-biodiversidad',name:'Día de la Biodiversidad',theme:'Zoología',rule:{type:'fijo',month:5,day:22},days:5,external:true,description:'Día Internacional de la Diversidad Biológica (ONU), adaptado al Atlas.',contract:{objectives:[{metric:'discoveredAll',mode:'incremental',target:3}],reward:{money:200,knowledge:220},requires:{undiscovered:3},alt:{objectives:[{metric:'sightingsTotal',mode:'incremental',target:40}]}}}),
 E({id:'dia-oceanos',name:'Día de los Océanos',theme:'Oceanografía',rule:{type:'fijo',month:6,day:8},days:7,external:true,description:'Día Mundial de los Océanos (ONU), adaptado al Atlas.',modifiers:[{activity:'expedicion:oceanografica',value:0.2,cap:0.2}],contract:{objectives:[{metric:'voyagesDone',mode:'incremental',target:1}],reward:{money:200,knowledge:180},requires:{shipyard:true},alt:{objectives:[{metric:'sightingsTotal',mode:'incremental',target:25}]}}}),
 E({id:'gran-exposicion',name:'Gran Exposición Científica',theme:'Artefactos',rule:{type:'fijo',month:8,day:1},days:14,external:false,fictional:true,description:'Evento propio del Atlas con fecha ficticia configurable.',contract:{objectives:[{metric:'demos',mode:'incremental',target:2}],reward:{money:300,knowledge:250},requires:{demoReady:true},alt:{objectives:[{metric:'exhibitsNow',mode:'posesion',target:3}]}}}),
 E({id:'equinoccio-septiembre',name:'Equinoccio de septiembre',theme:'Oceanografía',rule:{type:'equinoccio',month:9},days:3,external:false,description:'Fecha astronómica calculada para cada año.',modifiers:[{activity:'campo:ambiental:oceanografia',value:0.25,cap:0.25}],contract:{objectives:[{metric:'pieces:campo',mode:'incremental',target:1}],reward:{money:150,knowledge:120}}}),
 E({id:'noche-criaturas',name:'Noche de las Criaturas',theme:'Fauna nocturna',rule:{type:'fijo',month:10,day:30},days:3,external:true,description:'Celebración externa adaptada a la fauna nocturna.',contract:{objectives:[{metric:'counter:nightObservations',mode:'incremental',target:10}],reward:{money:180,knowledge:200}}}),
 E({id:'navidad-naturalista',name:'Navidad del Naturalista',theme:'Correspondencia',rule:{type:'fijo',month:12,day:24},days:9,external:true,description:'Celebración externa; correspondencia y encargos especiales.',contract:{objectives:[{metric:'counter:contractsClaimed',mode:'incremental',target:2}],reward:{money:250,knowledge:200,items:{parchment_scrap:3,old_ink:2}}}})
]);
const EVENTS_BY_ID=Object.freeze(Object.fromEntries(EVENTS.map(e=>[e.id,e])));
for(const e of EVENTS)A('events','evento_'+e.id.replace(/-/g,'_'),'Conmemorativa · '+e.name,'eventMedal:'+e.id,1,'Completa el encargo de «'+e.name+'» en cualquier edición.','Plata',{title:e.id==='navidad-naturalista'?'Corresponsal de invierno':e.id==='dia-darwin'?'Corresponsal de Darwin':undefined,recurrence:'una medalla por evento; cada edición queda registrada'});

/* Equinoccios (Meeus, Astronomical Algorithms, cap. 27; precisión de minutos). */
function equinoxUTC(year,month){
 const Y=(year-2000)/1000;
 const jde=month===3?2451623.80984+365242.37404*Y+0.05169*Y*Y-0.00411*Y**3-0.00057*Y**4:2451810.21715+365242.01767*Y-0.11575*Y*Y+0.00337*Y**3+0.00078*Y**4;
 return Math.round((jde-2440587.5)*86400000);
}
function startOf(e,year){
 if(e.rule.type==='fijo')return new Date(year,e.rule.month-1,e.rule.day).getTime();
 const d=new Date(equinoxUTC(year,e.rule.month));return new Date(d.getFullYear(),d.getMonth(),d.getDate()-1).getTime();
}
function occurrence(e,year){const start=startOf(e,year),s=new Date(start);const end=new Date(s.getFullYear(),s.getMonth(),s.getDate()+e.days).getTime();return {id:e.id+'-'+year,event:e.id,edition:year,start,end};}
function occurrencesAround(now){const y=new Date(now).getFullYear(),out=[];for(const e of EVENTS)for(const yy of [y-1,y,y+1])out.push(occurrence(e,yy));return out.sort((a,b)=>a.start-b.start);}
function active(now){return occurrencesAround(now).filter(o=>o.start<=now&&now<o.end);}
function upcoming(now,n=5){return occurrencesAround(now).filter(o=>o.start>now).slice(0,n);}
function eventModifiers(now){const out={};for(const o of active(now))for(const m of EVENTS_BY_ID[o.event].modifiers){out[m.activity]=Math.min(m.cap,(out[m.activity]||0)+m.value);}return out;}

/* RNG determinista para generar ofertas (no usa Math.random). */
function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function rng(seed){let a=hash(String(seed))||1;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}

const ART=Object.freeze({achievements:ACH.map(a=>a.extra.art),titles:ACH.filter(a=>a.extra.title).map(a=>'title-'+a.id),commissions:COMMISSIONS.map(c=>c.extra.art),contracts:TEMPLATES.map(t=>t.art),events:EVENTS.map(e=>e.art),eventMedals:EVENTS.map(e=>e.medalArt),file:null,status:'pendiente'});

// Registro en los motores existentes.
const definitions=ACH.map(a=>({category:a.category,id:a.id,name:a.name,metric:a.metric,target:a.target,description:a.description,tier:a.tier,extra:Object.fromEntries(Object.entries(a.extra).filter(([,v])=>v!==undefined))}));
if(root.AtlasAchievements3360?.extend)root.AtlasAchievements3360.extend({categories:CATEGORIES,definitions,metrics});
if(root.AtlasCommissions3370?.extend)root.AtlasCommissions3370.extend({categories:COMMISSION_CATEGORIES,definitions:COMMISSIONS,gate:(s,d)=>{const g=d.gate;if(!g)return true;const lv=s.camp?.levels||{};return Object.entries(g).every(([k,v])=>Math.max(1,Number(lv[k])||1)>=v);}});

root.AtlasMEC08=Object.freeze({version:'5.6.8-beta',build:'MEC-08',CATEGORIES,ACHIEVEMENTS:Object.freeze(ACH),COMMISSIONS,TEMPLATES,CONTRACT_POLICY,EVENTS,EVENTS_BY_ID,ART,
 metrics,equinoxUTC,occurrence,occurrencesAround,active,upcoming,eventModifiers,rng,hash});
})(typeof globalThis!=='undefined'?globalThis:this);
