/* MEC-05 · V5.6.5 Beta · Museo evolutivo, gabinetes y exposiciones funcionales.
   Configuración central del Museo: niveles y su requisito de Sociedad, gabinetes, beneficios,
   exposiciones temáticas, referencias artísticas y clasificación de fósiles, relictos y artefactos.
   Motor puro: calcula las bonificaciones a partir del estado guardado (piezas expuestas ahora),
   sin acumular nada. Todos los valores son PROVISIONALES (BAL-01). */
(function(root){
'use strict';

/* 1. Niveles. Costos, prestigio y capacidades siguen en MUSEUM_LEVELS (app.js, MEC-01): aquí solo
   se añaden el requisito de rango (MEC-04) y la referencia de arte. */
const LEVELS=Object.freeze({
 1:{rank:0,art:'museum-level-1'},
 2:{rank:0,art:'museum-level-2'},
 3:{rank:0,art:'museum-level-3'},
 4:{rank:11,art:'museum-level-4'},
 5:{rank:14,art:'museum-level-5'}
});

/* 2. Gabinetes: los cinco de MEC-01, con su id estable y referencia de arte. */
const CABINETS=Object.freeze({
 'Botánica':{id:'botanica',art:'cabinet-botanica',focus:'Hallazgos botánicos y expediciones botánicas'},
 'Geología':{id:'geologia',art:'cabinet-geologia',focus:'Prospecciones geológicas y especializadas'},
 'Oceanografía':{id:'oceanografia',art:'cabinet-oceanografia',focus:'Hallazgos marinos y expediciones oceanográficas'},
 'Historia':{id:'historia',art:'cabinet-historia',focus:'Comercio de piezas históricas y expediciones arqueológicas'},
 'Historia natural y exploración':{id:'exploracion',art:'cabinet-exploracion',focus:'Conocimiento de expediciones y prospecciones, y reconocimientos naturalistas'}
});

/* 3. Aporte de cada pieza expuesta según su rareza (índices 0–3 de MEC-01). Una pieza cuenta una
   sola vez: el gabinete ya admite una exposición por pieza y los duplicados no suman. */
const RARITY_POINTS=Object.freeze([1,1.5,2.5,4]);
const RARITY_LABELS=Object.freeze(['Común','Poco común','Raro','Muy raro']);

/* 4. Actividades afectadas. Cada valor es un porcentaje ADITIVO sobre el valor base de la actividad
   (probabilidad, conocimiento o precio). Los beneficios de una actividad se suman entre sí y el total
   se limita con `cap`; no se multiplican. Las demás capas (equipamiento, investigaciones,
   Campamento, Sociedad) se calculan aparte y no se mezclan con esta. */
const ACTIVITIES=Object.freeze({
 'campo:ambiental:botanica':{label:'Campo · hallazgos ambientales botánicos',kind:'probabilidad',base:'tasa ambiental (MEC-03)',cap:0.6,timed:false},
 'campo:ambiental:oceanografia':{label:'Campo · hallazgos ambientales marinos',kind:'probabilidad',base:'tasa ambiental (MEC-03)',cap:0.6,timed:false},
 'expedicion:botanica':{label:'Expedición botánica · coleccionables',kind:'probabilidad',base:'tirada de la modalidad',cap:0.4,timed:true},
 'expedicion:oceanografica':{label:'Expedición oceanográfica · coleccionables',kind:'probabilidad',base:'tirada de la modalidad',cap:0.4,timed:true},
 'expedicion:arqueologica':{label:'Expedición arqueológica · coleccionables',kind:'probabilidad',base:'tirada de la modalidad',cap:0.4,timed:true},
 'expedicion:reconocimiento':{label:'Reconocimiento naturalista · coleccionables',kind:'probabilidad',base:'tirada de la modalidad',cap:0.4,timed:true},
 'prospeccion:geologica':{label:'Prospección geológica · hallazgos',kind:'probabilidad',base:'tirada de la prospección',cap:0.4,timed:true},
 'prospeccion:especializada':{label:'Prospección especializada · hallazgos',kind:'probabilidad',base:'tirada de la prospección',cap:0.4,timed:true},
 'comercio:compra-historia':{label:'Caravana · compra de piezas del gabinete de Historia',kind:'descuento',base:'precio de la oferta',cap:0.15,timed:false},
 'conocimiento:expediciones':{label:'Conocimiento de expediciones',kind:'conocimiento',base:'conocimiento de la expedición',cap:0.25,timed:true},
 'conocimiento:prospecciones':{label:'Conocimiento de prospecciones',kind:'conocimiento',base:'conocimiento de la prospección',cap:0.25,timed:true}
});

/* 5. Beneficios por gabinete: id, fuente, gabinete, actividad, tipo, valor por punto, límite y
   regla de acumulación. Cada gabinete tiene beneficios distintos. */
const B=(id,cabinet,activity,perPoint,max,note,themeScale=1)=>Object.freeze({id,source:'museo:gabinete',cabinet,activity,type:'porcentaje-aditivo',perPoint,max,themeScale,stacking:'suma en la actividad; total limitado por ACTIVITIES[actividad].cap',balance:'provisional',note});
const BENEFITS=Object.freeze([
 B('botanica-campo','Botánica','campo:ambiental:botanica',0.02,0.3,'Banda adicional de la tirada ambiental reservada a piezas botánicas.'),
 B('botanica-expedicion','Botánica','expedicion:botanica',0.015,0.2,'Más probabilidad en cada tirada de coleccionables de la expedición botánica.'),
 B('geologia-prospeccion','Geología','prospeccion:geologica',0.015,0.2,'Más probabilidad en cada tirada de la prospección geológica.'),
 B('geologia-especializada','Geología','prospeccion:especializada',0.01,0.15,'Más probabilidad en la prospección especializada.'),
 B('oceanografia-campo','Oceanografía','campo:ambiental:oceanografia',0.02,0.3,'Banda adicional de la tirada ambiental reservada a piezas marinas.'),
 B('oceanografia-expedicion','Oceanografía','expedicion:oceanografica',0.015,0.2,'Más probabilidad en la expedición oceanográfica.'),
 B('historia-comercio','Historia','comercio:compra-historia',0.005,0.1,'Descuento al comprar piezas del gabinete de Historia en la Caravana.',0.25),
 B('historia-arqueologia','Historia','expedicion:arqueologica',0.015,0.2,'Más probabilidad en la expedición arqueológica.'),
 B('exploracion-conocimiento-exp','Historia natural y exploración','conocimiento:expediciones',0.01,0.15,'Conocimiento adicional al liquidar una expedición.'),
 B('exploracion-conocimiento-pro','Historia natural y exploración','conocimiento:prospecciones',0.01,0.15,'Conocimiento adicional al liquidar una prospección.'),
 B('exploracion-reconocimiento','Historia natural y exploración','expedicion:reconocimiento',0.01,0.15,'Más probabilidad en el reconocimiento naturalista.')
]);

/* 6. Exposiciones temáticas por colección (las 32 de MEC-01). Los umbrales se adaptan al tamaño de
   la colección; el primer hito cabe en un gabinete de nivel I (4 piezas). Cada colección aporta solo
   su hito más alto (no se suman los hitos), y solo mientras sus piezas siguen expuestas. */
const THEME_TIERS=Object.freeze([
 {id:'inicial',label:'Conjunto inicial',threshold:n=>Math.min(3,n),bonus:0.03,art:'theme-inicial'},
 {id:'parcial',label:'Exposición parcial',threshold:n=>Math.max(Math.min(3,n)+1,Math.ceil(n*0.4)),bonus:0.05,art:'theme-parcial'},
 {id:'avanzada',label:'Exposición avanzada',threshold:n=>Math.max(Math.ceil(n*0.4)+1,Math.ceil(n*0.7)),bonus:0.08,art:'theme-avanzada'},
 {id:'completa',label:'Colección completa exhibida',threshold:n=>n,bonus:0.12,art:'theme-completa'}
]);
function tiersFor(size){
 const out=[];let last=0;
 for(const t of THEME_TIERS){const at=Math.min(size,t.threshold(size));if(at>last){out.push({id:t.id,label:t.label,threshold:at,bonus:t.bonus,art:t.art});last=at;}}
 return out;
}

/* 7. Referencias artísticas estables (sin archivo: se conservan los marcadores actuales). */
const ART=Object.freeze({
 levels:Object.values(LEVELS).map(l=>l.art),
 cabinets:Object.values(CABINETS).map(c=>c.art),
 vitrines:['museum-vitrine-zoologica'],
 fossils:['museum-exhibit-fossil'],
 relicts:['museum-exhibit-relict'],
 artifacts:['museum-exhibit-artifact'],
 themes:THEME_TIERS.map(t=>t.art),
 file:null,status:'pendiente'
});

/* 8. Clasificación de las salas históricas (fósiles, relictos y artefactos). Las bonificaciones
   históricas (conjuntos fósiles y de relictos, curaduría, investigación, medallón) siguen en el
   ingreso del Museo; el motor de MEC-05 no las vuelve a contar. */
const ROOMS=Object.freeze({
 zoologica:{label:'Exposiciones zoológicas',engine:'state.museum.exhibits · exhibitIncome',bonus:'ingreso histórico por rareza (sin cambios)'},
 gabinetes:{label:'Gabinetes de coleccionables',engine:'state.museum.cabinets (MEC-01)',bonus:'MEC-05 · beneficios por gabinete y temáticas'},
 fosiles:{label:'Fósiles y reconstrucciones',engine:'state.museum.collections · MUSEUM_FOSSIL_RECIPES',bonus:'histórica: MUSEUM_FOSSIL_SETS sobre el ingreso'},
 relictos:{label:'Relictos',engine:'state.museum.relicts · MUSEUM_RELICTS',bonus:'histórica: MUSEUM_RELICT_SETS sobre el ingreso; hitos de conocimiento'},
 artefactos:{label:'Artefactos científicos',engine:'state.museum.collections (tab artifacts) · artefactos beta',bonus:'sin bonificación nueva; funciones individuales en MEC-06'},
 curaduria:{label:'Proyectos curatoriales',engine:'state.museum.curation · curationPoints',bonus:'histórica: +1 % de ingreso por punto (máx. 20)'}
});
/* Campos preparados para MEC-06 (artefactos). */
const ARTIFACT_FIELDS=Object.freeze(['catalogued','exhibited','instrument','equipment','futureFunction']);

const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const round=x=>Math.round(x*10000)/10000;

/* Cálculo central. `cabinets` = state.museum.cabinets; `catalog` con items/collections de MEC-01;
   `capacity` = piezas por gabinete del nivel actual. Devuelve un modelo reconstruible desde el estado. */
function compute(state,catalog,capacity){
 const cab=state?.museum?.cabinets||{},items=catalog.items,out={capacity,cabinets:{},themes:[],activities:{}};
 for(const [name,def] of Object.entries(CABINETS)){
  const shown=[...new Set((cab[name]||[]).filter(id=>items.get(id)?.cabinet===name))];
  const points=shown.reduce((a,id)=>a+(RARITY_POINTS[items.get(id).rarity]||1),0);
  out.cabinets[name]={id:def.id,name,shown,used:shown.length,capacity,points,themeBonus:0,themes:[]};
 }
 for(const c of catalog.collections.values()){
  const box=out.cabinets[c.cabinet];if(!box)continue;
  const shownN=c.ids.filter(id=>box.shown.includes(id)).length,tiers=tiersFor(c.ids.length);
  const reached=tiers.filter(t=>shownN>=t.threshold).pop()||null,next=tiers.find(t=>shownN<t.threshold)||null;
  const theme={collection:c.name,cabinet:c.cabinet,size:c.ids.length,shown:shownN,tier:reached?reached.id:null,label:reached?reached.label:null,bonus:reached?reached.bonus:0,
   next:next?{id:next.id,label:next.label,threshold:next.threshold,missing:next.threshold-shownN,fits:next.threshold<=capacity}:null,tiers};
  box.themes.push(theme);box.themeBonus+=theme.bonus;if(reached)out.themes.push(theme);
 }
 for(const [act,def] of Object.entries(ACTIVITIES))out.activities[act]={id:act,label:def.label,kind:def.kind,cap:def.cap,parts:[],raw:0,total:0};
 for(const b of BENEFITS){
  const box=out.cabinets[b.cabinet],a=out.activities[b.activity];
  // Piezas: puntos de rareza × valor por punto, hasta `max`. Temáticas: suma de los hitos activos de
  // las colecciones del gabinete × themeScale, también hasta `max`. Ambas partes se suman.
  const fromPieces=round(Math.min(b.max,box.points*b.perPoint)),fromThemes=round(Math.min(b.max,box.themeBonus*b.themeScale));
  const value=round(fromPieces+fromThemes);
  if(value>0)a.parts.push({benefit:b.id,cabinet:b.cabinet,pieces:fromPieces,themes:fromThemes,value});
  a.raw=round(a.raw+value);
 }
 for(const a of Object.values(out.activities)){a.total=round(clamp(a.raw,0,a.cap));a.capped=a.raw>a.cap;}
 return out;
}
/* Instantánea de modificadores para actividades temporizadas (se guarda en job.mec.museum). */
function snapshot(model,at){
 const values={};for(const [k,a] of Object.entries(model.activities))if(a.total>0)values[k]=a.total;
 return {schema:1,at:Number.isFinite(at)?at:null,values};
}
const value=(snap,activity)=>{const v=snap&&snap.values?Number(snap.values[activity]):0;return Number.isFinite(v)&&v>0?v:0;};

root.AtlasMEC05=Object.freeze({version:'5.6.5-beta',build:'MEC-05',LEVELS,CABINETS,RARITY_POINTS,RARITY_LABELS,ACTIVITIES,BENEFITS,THEME_TIERS,ART,ROOMS,ARTIFACT_FIELDS,
 tiersFor,compute,snapshot,value,rankFor:level=>LEVELS[level]?.rank||0});
})(typeof globalThis!=='undefined'?globalThis:this);
