/* El Gran Atlas · V5.6.4 Beta — MEC-04 · Sociedad científica, rangos y desbloqueos.
 * Única configuración de los 20 rangos (requisitos, beneficios, funciones, recompensas,
 * arte) y lógica pura de requisitos, elegibilidad y ascenso. También declara los destinos
 * de expedición y yacimientos nuevos (contenido que app.js añade antes de cargar la partida).
 * Todos los umbrales, importes y tiempos son PROVISIONALES, centralizados para BAL-01.
 * Ver docs/mec04/README.md. */
(function(root){'use strict';
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);

/* Contenido geográfico nuevo: reutiliza los motores de expediciones y excavaciones con sus
 * requisitos cartográficos (mapItem) y científicos (reqResearch). Valores provisionales. */
const CONTENT=Object.freeze({
 voyages:Object.freeze([
  {id:'mesoamerica_survey',name:'Reconocimiento de Mesoamérica',seconds:780,cost:1500,knowledge:560,prize:1900,notes:880,required:130,routeReq:2,mapItem:'north_america_map',reqResearch:'norteamerica_1',mec04:true},
  {id:'asia_survey',name:'Reconocimiento de Anatolia y el Cáucaso',seconds:780,cost:1300,knowledge:520,prize:1700,notes:850,required:100,routeReq:2,mapItem:'asia_map',reqResearch:'asia_1',mec04:true},
  {id:'andes_survey',name:'Reconocimiento de los Andes',seconds:840,cost:1900,knowledge:640,prize:2300,notes:980,required:190,routeReq:2,mapItem:'south_america_map',reqResearch:'sudamerica_1',mec04:true},
  {id:'pacific_survey',name:'Reconocimiento del Pacífico austral',seconds:900,cost:2300,knowledge:760,prize:2800,notes:1150,required:240,routeReq:2,mapItem:'oceania_map',reqResearch:'oceania_1',mec04:true},
  {id:'polar_survey',name:'Reconocimiento de los mares polares',seconds:960,cost:2800,knowledge:900,prize:3300,notes:1300,required:285,routeReq:2,mapItem:'polar_map',reqResearch:'polos_1',mec04:true}
 ].map(Object.freeze)),
 digSites:Object.freeze([
  {id:'anatolia_strata',name:'Estratos de Anatolia',region:'HX-03-15',seconds:600,money:600,knowledge:180,fragments:[4,7],tooth:0.25,track:0.35,claw:0.1,skull:0.02,reqResearch:'asia_1',mec04:true},
  {id:'andes_strata',name:'Estratos andinos',region:'sa_andes_centrales',seconds:660,money:750,knowledge:220,fragments:[4,7],tooth:0.25,track:0.4,claw:0.12,skull:0.02,reqResearch:'sudamerica_1',mec04:true},
  {id:'australia_strata',name:'Estratos del desierto australiano',region:'oc_desierto_australiano',seconds:720,money:850,knowledge:260,fragments:[5,8],tooth:0.28,track:0.42,claw:0.12,skull:0.025,reqResearch:'oceania_1',mec04:true}
 ].map(Object.freeze))
});

/* Indicadores de trayectoria científica. */
const METRICS=Object.freeze({
 prestige:{label:'Prestigio',go:'field'},
 species:{label:'Especies descubiertas',go:'field'},
 monographs:{label:'Monografías publicadas',go:'journal'},
 collectibles:{label:'Coleccionables descubiertos',go:'objects'},
 voyages:{label:'Expediciones completadas',go:'expeditions'},
 research:{label:'Investigaciones realizadas',go:'research'},
 income:{label:'Ingresos acumulados (£)',go:'society'},
 regions:{label:'Regiones exploradas',go:'atlas'},
 collections:{label:'Colecciones completadas',go:'objects'}
});

/* Beneficios: cada uno es una función que el motor comprueba (nunca solo texto). */
const BENEFITS=Object.freeze({
 'grant:apoyo':{label:'Subvención · apoyo inicial',kind:'subvencion'},
 'grant:campo':{label:'Subvención de campo',kind:'subvencion'},
 'grant:expediciones':{label:'Financiación de expediciones',kind:'subvencion'},
 'grant:proyectos':{label:'Proyectos científicos',kind:'subvencion'},
 'grant:patrocinio':{label:'Patrocinio institucional',kind:'subvencion'},
 'facility:L4':{label:'Instalaciones del Campamento: nivel IV (Astillero y Taller)',kind:'campamento'},
 'facility:L4b':{label:'Instalaciones del Campamento: nivel IV (Caravana, Excavaciones y Prospecciones)',kind:'campamento'},
 'facility:L5':{label:'Instalaciones del Campamento: nivel V (Astillero, Caravana y Taller)',kind:'campamento'},
 'facility:L5b':{label:'Instalaciones del Campamento: nivel V (Excavaciones y Prospecciones)',kind:'campamento'},
 'commerce:subastas':{label:'Casa de subastas y solicitudes de coleccionistas',kind:'comercio'},
 'commerce:especialistas':{label:'Coleccionistas especializados',kind:'comercio'},
 'commerce:extraordinarias':{label:'Ofertas extraordinarias',kind:'comercio'},
 'commission:cancilleria':{label:'Encargo · Cancillería de órdenes',kind:'encargo'},
 'commission:geografica':{label:'Encargo · Sociedad Geográfica',kind:'encargo'},
 'commission:estudio':{label:'Encargo · publicación de estudios',kind:'encargo'},
 'commission:institucional':{label:'Encargo · colaboración institucional',kind:'encargo'},
 'museum:ampliaciones':{label:'Ampliaciones avanzadas del Museo (preparado para MEC-05)',kind:'museo',prepared:true}
});

const R=(level,id,name,description,requires,unlocks,reward)=>Object.freeze({
 id,level,name,description,requires:Object.freeze(requires),unlocks:Object.freeze(unlocks),
 reward:reward?Object.freeze(reward):null,art:Object.freeze({key:'rank-'+String(level).padStart(2,'0'),file:null,placeholder:'sociedad',status:'pendiente'}),
 balance:'provisional'});
// Nombres y prestigio: los 20 rangos de la beta 5.6.0 (B.sociedad, archivados). El resto de
// requisitos reparte la trayectoria entre actividades. Recompensa de ascenso: única.
const RANKS=Object.freeze([
 R(1,'aficionado','Aficionado','Naturalista que inicia su cuaderno.',{prestige:0},['grant:apoyo'],null),
 R(2,'corresponsal','Corresponsal','Envía sus primeras observaciones a la Sociedad.',{prestige:5,species:10},[],{money:150,knowledge:60}),
 R(3,'aspirante','Aspirante','Candidato con trabajo de campo regular.',{prestige:12,research:3,income:1000},['grant:campo'],{money:300,knowledge:120}),
 R(4,'ayudante','Ayudante de campo','Colabora en campañas organizadas.',{prestige:25,species:40,collectibles:3},['commission:cancilleria'],{money:450,knowledge:180}),
 R(5,'observador','Observador','Reconocido por la calidad de sus registros.',{prestige:45,monographs:10,regions:5},['facility:L4'],{money:600,knowledge:240}),
 R(6,'colector','Colector','Sus colecciones circulan entre los socios.',{prestige:70,collectibles:15,voyages:3},['grant:expediciones','facility:L4b','commerce:subastas','commission:geografica'],{money:800,knowledge:300}),
 R(7,'socio_auxiliar','Socio auxiliar','Miembro auxiliar con voz en las sesiones.',{prestige:100,species:100,research:12,income:20000},[],{money:1000,knowledge:400}),
 R(8,'socio_correspondiente','Socio correspondiente','Corresponsal acreditado en el extranjero.',{prestige:135,voyages:10,regions:12},['commerce:especialistas','commission:estudio'],{money:1300,knowledge:500}),
 R(9,'naturalista','Naturalista','Autor reconocido de monografías.',{prestige:175,monographs:60,collectibles:40},['facility:L5'],{money:1600,knowledge:650}),
 R(10,'socio_titular','Socio titular','Miembro de pleno derecho.',{prestige:215,research:20,collections:1,income:100000},['grant:proyectos','facility:L5b'],{money:2000,knowledge:800}),
 R(11,'curador','Curador','Responsable de colecciones de la Sociedad.',{prestige:255,species:250,collectibles:70},['museum:ampliaciones'],{money:2500,knowledge:1000}),
 R(12,'academico','Académico','Miembro de la Academia de la Sociedad.',{prestige:295,regions:30,voyages:25},['commerce:extraordinarias','commission:institucional'],{money:3000,knowledge:1200}),
 R(13,'explorador_mayor','Explorador mayor','Dirige expediciones de largo alcance.',{prestige:335,monographs:150,research:28},[],{money:3500,knowledge:1400}),
 R(14,'consejo','Miembro del Consejo','Participa en el gobierno de la Sociedad.',{prestige:375,collectibles:110,income:500000},['grant:patrocinio'],{money:4000,knowledge:1600}),
 R(15,'consejero_honorario','Consejero honorario','Consejero de honor por su trayectoria.',{prestige:410,species:400,collections:3},[],{money:4500,knowledge:1800}),
 R(16,'catedratico','Catedrático','Titular de una cátedra de historia natural.',{prestige:440,regions:55,voyages:50},[],{money:5000,knowledge:2000}),
 R(17,'director_seccion','Director de sección','Dirige una sección científica.',{prestige:465,monographs:250,research:36},[],{money:5500,knowledge:2200}),
 R(18,'vicepresidente','Vicepresidente','Vicepresidencia de la Sociedad.',{prestige:480,collectibles:160,income:2000000},[],{money:6000,knowledge:2400}),
 R(19,'presidente_honorario','Presidente honorario','Presidencia honoraria.',{prestige:485,species:500,regions:75},[],{money:7000,knowledge:2800}),
 R(20,'gran_naturalista','Gran Naturalista','La más alta distinción del Atlas. No exige completar todo el contenido.',{prestige:500,monographs:300,collectibles:200,collections:6},[],{money:10000,knowledge:4000})
]);
const BY_LEVEL=new Map(RANKS.map(r=>[r.level,r]));

/* Matriz de requisitos de rango por instalación y nivel (niveles I–III libres). */
const FACILITY_RANKS=Object.freeze({
 shipyard:{4:5,5:9},workshop:{4:5,5:9},caravan:{4:6,5:9},excavations:{4:6,5:10},surveys:{4:6,5:10}
});
/* Comercio: las ofertas de nivel IV–V de la Caravana y las extraordinarias exigen rango. */
const COMMERCE_RANKS=Object.freeze({4:6,5:8,extra:12});
/* Encargos de coleccionistas con rango (los demás no lo exigen). */
const COMMISSION_RANKS=Object.freeze({cancilleria:4,geografica:6,'estudio-publicado':8,'colaboracion-institucional':12});
const NEW_COMMISSIONS=Object.freeze([
 {id:'estudio-publicado',label:'Publicación de estudios',text:'Una sección de la Sociedad edita tus estudios: requiere 20 monografías y papel para las pruebas.',requires:{monographs:20,items:{parchment_scrap:4,old_ink:2}},reward:'Instrumentos de exploración',cooldownHours:12},
 {id:'colaboracion-institucional',label:'Colaboración institucional',text:'Un museo extranjero solicita colaboración: requiere 30 expediciones y una pieza repetida de «Objetos de civilizaciones».',requires:{voyages:30,collection:{name:'Objetos de civilizaciones',count:1}},reward:'Cartografía antigua',cooldownHours:24}
]);
/* Financiación científica (provisional). La de apoyo inicial es la subvención histórica. */
const FUNDING=Object.freeze({
 campo:{label:'Subvención de campo',benefit:'grant:campo',cooldownHours:6,base:60,perRegion:15,source:'subvenciones'},
 expediciones:{label:'Financiación de expediciones',benefit:'grant:expediciones',perVoyage:80,maxVoyages:10,source:'subvenciones'},
 proyectos:{label:'Proyectos científicos',benefit:'grant:proyectos',everyMonographs:25,perMilestone:600,source:'subvenciones'},
 patrocinio:{label:'Patrocinio institucional',benefit:'grant:patrocinio',cooldownHours:24,base:1500,perPrestige:6,source:'subvenciones'}
});
const MUSEUM_RANKS=Object.freeze({prepared:true,active:false,note:'MEC-05: ampliaciones avanzadas del Museo con rango Curador (11).'});

function rank(state){const v=Math.floor(Number(state?.society?.rank));return Number.isFinite(v)?Math.max(1,Math.min(RANKS.length,v)):1;}
function unlocked(state,benefit){const lv=rank(state);return RANKS.some(r=>r.level<=lv&&r.unlocks.includes(benefit));}
function benefitRank(benefit){return RANKS.find(r=>r.unlocks.includes(benefit))?.level||null;}
function progress(def,metrics){
 return Object.entries(def.requires).map(([k,need])=>({key:k,label:METRICS[k]?.label||k,have:Math.floor(metrics[k]||0),need,ok:(metrics[k]||0)>=need,go:METRICS[k]?.go}));
}
function eligibility(state,metrics){
 const cur=rank(state),next=BY_LEVEL.get(cur+1);
 if(!next)return {current:BY_LEVEL.get(cur),next:null,ok:false,max:true,progress:[]};
 const p=progress(next,metrics);
 return {current:BY_LEVEL.get(cur),next,ok:p.every(x=>x.ok),progress:p,missing:p.filter(x=>!x.ok)};
}
// Ascenso: un nivel cada vez; registra fecha e historial; la recompensa se entrega una vez.
function ascend(state,metrics,now,payReward){
 const e=eligibility(state,metrics);if(!e.ok)return {ok:false,missing:e.missing||[]};
 normalize(state,now);
 const s=state.society;s.rank=e.next.level;
 s.history.push({rank:e.next.level,id:e.next.id,at:now});
 let reward=null;
 if(e.next.reward&&!s.rewards[e.next.id]){s.rewards[e.next.id]={at:now,...e.next.reward};reward=e.next.reward;payReward?.(e.next.reward,e.next);}
 return {ok:true,rank:e.next,reward};
}
/* Estado: state.society = {schema, rank, history, rewards, grants, migration}. */
function normalize(state,now=Date.now()){
 const s=plain(state.society)?state.society:{};
 const history=Array.isArray(s.history)?s.history.filter(h=>plain(h)&&BY_LEVEL.has(h.rank)&&Number.isFinite(h.at)):[];
 const maxHist=history.reduce((m,h)=>Math.max(m,h.rank),1);
 const lv=Math.max(rank({society:s}),maxHist); // el rango reconocido nunca baja
 state.society={schema:1,rank:lv,history,rewards:plain(s.rewards)?s.rewards:{},grants:plain(s.grants)?s.grants:{},migration:plain(s.migration)?s.migration:null,
  commissions:plain(s.commissions)?s.commissions:{}};
 return state.society;
}
// Migración: se reconoce el rango consecutivo más alto que ya cumplen los registros.
// No se pagan recompensas por rangos reconocidos al migrar (no se inventan ingresos).
function migrate(state,metrics,now=Date.now()){
 if(plain(state.society)&&Number.isFinite(state.society.rank))return normalize(state,now);
 let lv=1;
 for(const r of RANKS.slice(1)){if(progress(r,metrics).every(p=>p.ok))lv=r.level;else break;}
 state.society={schema:1,rank:lv,history:RANKS.filter(r=>r.level>1&&r.level<=lv).map(r=>({rank:r.level,id:r.id,at:now,migrated:true})),
  rewards:Object.fromEntries(RANKS.filter(r=>r.level>1&&r.level<=lv&&r.reward).map(r=>[r.id,{at:now,migrated:true,paid:false}])),grants:{},commissions:{},
  migration:{at:now,recognized:lv,method:'registros-disponibles',incomeIncludesEstimate:true}};
 return state.society;
}

root.AtlasMEC04=Object.freeze({version:'5.6.4-beta',build:'MEC-04',CONTENT,METRICS,BENEFITS,RANKS,FACILITY_RANKS,COMMERCE_RANKS,COMMISSION_RANKS,NEW_COMMISSIONS,FUNDING,MUSEUM_RANKS,
 rank,unlocked,benefitRank,progress,eligibility,ascend,normalize,migrate});
// Contenido disponible antes de app.js (destinos y yacimientos nuevos).
root.AtlasMEC04Content=CONTENT;
})(typeof globalThis!=='undefined'?globalThis:window);
