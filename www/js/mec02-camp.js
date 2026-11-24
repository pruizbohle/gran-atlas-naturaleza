/* El Gran Atlas · V5.6.2 Beta — MEC-02 · instalaciones evolutivas del Campamento.
 * Configuración central de las 25 etapas (5 instalaciones × 5 niveles) y lógica pura,
 * sin DOM: estado, requisitos, mejora, efectos acumulados, migración y modelo común de
 * actividades. Todo costo, requisito, capacidad, tiempo o porcentaje es PROVISIONAL y
 * configurable: MEC-02 no hace balance. Ver docs/mec02/README.md. */
(function(root){'use strict';
const SCHEMA=1,MAX_LEVEL=5;
const plain=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const ROMAN=['','I','II','III','IV','V'];

/* Requisitos comunes (provisionales). societyRank queda preparado para MEC-04 y no se exige. */
const COST=[null,{money:0,knowledge:0},{money:500,knowledge:300},{money:2000,knowledge:1200},{money:8000,knowledge:4000},{money:25000,knowledge:12000}];
const PRESTIGE=[0,0,2,5,10,20];
const stage=(level,name,effects,functions,extra={})=>Object.freeze({
 level,name,cost:Object.freeze({...COST[level]}),
 requires:Object.freeze({prestige:PRESTIGE[level],previousLevel:level-1,societyRank:extra.societyRank??null,societyRankActive:false}),
 effects:Object.freeze(effects),functions:Object.freeze(functions),provisional:true,...extra});

const FACILITIES=Object.freeze([
 Object.freeze({id:'shipyard',name:'Astillero',engine:'voyages',description:'Expediciones científicas',
  unlock:{flag:'shipyard',research:'astillero',label:'Investigación «Astillero básico»'},
  reuses:['VOYAGES','sail','processVoyages','resolveVoyageReward','maxVoyages','voyageDuration','state.voyages'],
  levels:[
   stage(1,'Embarcadero',{capacityBonus:0,durationFactor:1,modalities:['normal']},['Gestiona las expediciones científicas existentes con su capacidad histórica (2 + «Segundo destacamento»).','Los viajes conservan sus requisitos de prestigio, cartografía, investigación y mapas.']),
   stage(2,'Muelle',{capacityBonus:1,durationFactor:1,modalities:['normal']},['+1 expedición simultánea.']),
   stage(3,'Astillero',{capacityBonus:1,durationFactor:0.9,modalities:['normal']},['Preparación de expediciones: −10 % de duración en las nuevas salidas (provisional).']),
   stage(4,'Dársena',{capacityBonus:2,durationFactor:0.9,modalities:['normal']},['+1 expedición simultánea (+2 en total).']),
   stage(5,'Puerto científico',{capacityBonus:2,durationFactor:0.9,modalities:['normal','ampliada']},['Modalidad especial «Expedición ampliada»: misma ruta, doble duración y doble costo, con una tirada adicional de hallazgos (provisional).'])
  ]}),
 Object.freeze({id:'caravan',name:'Caravana',engine:'commerce',description:'Comercio, suministros, contratos y trueques',
  unlock:{flag:'shipyard',research:'astillero',label:'Investigación «Astillero básico» (habilita el comercio)'},
  reuses:['TRADE_ROUTES','startTrade3300','settleTrade3300','tradeCanStart3300','TRADE_MARKET','buyTrade3300','TRADE_BARTERS','SUPPLY_CONTRACTS3390','CARGO_MANIFESTS3390','REGIONAL_BARTERS3400','state.commerce'],
  levels:[
   stage(1,'Carreta',{routeCapacity:1,marketLot:1,collectibleExchange:false},['1 ruta comercial simultánea, mercado, trueques, contratos de suministro y manifiestos (sin cambios).','Las mercancías regionales conservan sus condiciones de acceso.']),
   stage(2,'Caravana equipada',{routeCapacity:2,marketLot:1,collectibleExchange:false},['2 rutas comerciales simultáneas.']),
   stage(3,'Convoy',{routeCapacity:2,marketLot:5,collectibleExchange:false},['Capacidad logística: compra por lotes de 5 unidades en el mercado, con una sola confirmación.']),
   stage(4,'Estación comercial',{routeCapacity:3,marketLot:5,collectibleExchange:false},['3 rutas comerciales simultáneas.']),
   stage(5,'Central comercial',{routeCapacity:4,marketLot:5,collectibleExchange:'preparado'},['4 rutas comerciales simultáneas.','Conexión preparada para el intercambio de coleccionables (se activa en MEC-03).'])
  ]}),
 Object.freeze({id:'workshop',name:'Taller',engine:'workshop',description:'Fabricación, componentes y procesamiento de materiales',
  unlock:null,
  reuses:['RECIPES','canCraft','craftItem','recipePlan3400','V316_MATERIAL_STUDIES','canProcessMaterials','processMaterials'],
  levels:[
   stage(1,'Mesa de trabajo',{recipeLevel:1,craftBatches:[1],studyBatches:[1,5],componentCrafting:false},['Todas las recetas existentes, con fabricación inmediata.','Estudios de materiales ×1 y ×5.']),
   stage(2,'Taller artesanal',{recipeLevel:2,craftBatches:[1],studyBatches:[1,5,10],componentCrafting:false},['Procesamiento de materiales animales: estudios ×10.','Recetas de nivel 2 (preparado).']),
   stage(3,'Taller científico',{recipeLevel:3,craftBatches:[1,5],studyBatches:[1,5,10],componentCrafting:false},['Fabricación múltiple: ×5 con una sola confirmación.','Recetas de nivel 3 (preparado).']),
   stage(4,'Taller especializado',{recipeLevel:4,craftBatches:[1,5],studyBatches:[1,5,10],componentCrafting:true},['Fabricación con subcomponentes: fabrica primero los componentes intermedios que falten.','Recetas de nivel 4 (preparado).']),
   stage(5,'Laboratorio',{recipeLevel:5,craftBatches:[1,5,10],studyBatches:[1,5,10,25],componentCrafting:true},['Fabricación ×10 y estudios ×25.','Recetas de laboratorio (nivel 5, preparado).'])
  ]}),
 Object.freeze({id:'excavations',name:'Excavaciones',engine:'excavations',description:'Yacimientos y materiales fósiles',
  unlock:null,
  reuses:['MUSEUM_DIG_SITES','canStartExcavation','startExcavation','collectExcavation','maxExcavations','state.museum.excavations'],
  levels:[
   stage(1,'Pozo exploratorio',{capacityBonus:0,modes:['normal'],collectAll:false},['Yacimientos existentes del Museo con su capacidad histórica (1, o 2 con «Excavaciones coordinadas»).']),
   stage(2,'Excavación',{capacityBonus:1,modes:['normal'],collectAll:false},['+1 excavación simultánea.']),
   stage(3,'Yacimiento',{capacityBonus:1,modes:['normal','profunda'],collectAll:false},['Excavación profunda: doble duración y doble costo; +2 fragmentos y una segunda tirada de diente fósil (provisional).']),
   stage(4,'Complejo paleontológico',{capacityBonus:2,modes:['normal','profunda'],collectAll:true},['+1 excavación simultánea (+2 en total).','Recoger de una vez todas las excavaciones terminadas.']),
   stage(5,'Instituto paleontológico',{capacityBonus:2,modes:['normal','profunda','especial'],collectAll:true},['Excavación especial: 1,5 × duración y costo; garantiza una huella fosilizada (provisional).','Conexión preparada para coleccionables históricos y geológicos (MEC-03, sin drops).'])
  ]}),
 Object.freeze({id:'surveys',name:'Prospecciones',engine:'surveys',description:'Indicios de relictos y estudios de campo',
  unlock:null,
  reuses:['MUSEUM_RELICTS','relictSurveySpec','canStartRelictSurvey','startRelictSurvey','collectRelictSurvey','maxRelictSurveys','addRelictLead','state.museum.relictSurveys'],
  levels:[
   stage(1,'Reconocimiento',{capacityBonus:0,extraLead:0,durationFactor:1,collectAll:false},['Prospección documental de indicios de relictos con su capacidad histórica (1, o 2 con «Archivos de historia natural»).','Los relictos siguen siendo hallazgos de campo.']),
   stage(2,'Estación de reconocimiento',{capacityBonus:1,extraLead:0,durationFactor:1,collectAll:false},['+1 prospección simultánea.']),
   stage(3,'Estación topográfica',{capacityBonus:1,extraLead:1,durationFactor:1,collectAll:false},['+1 indicio al completar una prospección (sin superar el máximo de 3; nunca entrega un relicto).']),
   stage(4,'Centro de estudios',{capacityBonus:1,extraLead:1,durationFactor:0.8,collectAll:true},['−20 % de duración en las nuevas prospecciones (provisional).','Recoger de una vez todas las prospecciones terminadas.']),
   stage(5,'Centro de prospección',{capacityBonus:2,extraLead:1,durationFactor:0.8,collectAll:true},['+1 prospección simultánea (+2 en total).','Tipos preparados: geológica, regional, minerales, metales, meteoritos y piedras preciosas (MEC-03).'])
  ]})
]);
const BY_ID=new Map(FACILITIES.map(f=>[f.id,f]));
// Tienda del naturalista: sexta zona, sin niveles productivos en MEC-02.
const PERSONAL_AREA=Object.freeze({id:'shop',name:'Tienda del naturalista',levels:false,role:'Espacio personal, equipamiento e inventario'});

/* Tipos de prospección y de excavación: estructura ampliable (solo los activos funcionan). */
const SURVEY_TYPES=Object.freeze({
 indicios:{label:'Indicios de relictos',active:true,minLevel:1},
 geologica:{label:'Prospección geológica',active:false,minLevel:3,future:'MEC-03'},
 regional:{label:'Reconocimiento regional',active:false,minLevel:3,future:'MEC-03'},
 minerales:{label:'Minerales, metales, meteoritos y piedras preciosas',active:false,minLevel:5,future:'MEC-03',collections:['Minerales extraordinarios','Metales raros','Meteoritos','Piedras preciosas']},
 extraordinarios:{label:'Hallazgos científicos extraordinarios',active:false,minLevel:5,future:'MEC-03'}
});
const DIG_MODES=Object.freeze({
 normal:{label:'Normal',minLevel:1,costFactor:1,durationFactor:1,extra:null},
 profunda:{label:'Profunda',minLevel:3,costFactor:2,durationFactor:2,extra:{fragments:2,toothRolls:1}},
 especial:{label:'Especial',minLevel:5,costFactor:1.5,durationFactor:1.5,extra:{guaranteed:{fossil_track:1}},collectiblesPrepared:['Fósiles menores','Rocas y formaciones geológicas','Objetos de civilizaciones']}
});
const VOYAGE_MODALITIES=Object.freeze({
 normal:{label:'Normal',minLevel:1,costFactor:1,durationFactor:1,extraLootRolls:0},
 ampliada:{label:'Expedición ampliada',minLevel:5,costFactor:2,durationFactor:2,extraLootRolls:1}
});
// Conexiones preparadas para MEC-03: ninguna fuente de coleccionables se activa aquí.
const PREPARED_SOURCES=Object.freeze({expediciones:'shipyard',comercio:'caravan',excavaciones:'excavations',prospecciones:'surveys'});

/* Referencias artísticas: una ranura por instalación y nivel. El motor solo lee `file`;
 * mientras sea null se usa el icono provisional existente (placeholder). */
const ART=Object.freeze(Object.fromEntries(FACILITIES.flatMap(f=>f.levels.map(l=>[f.id+'-'+l.level,Object.freeze({
 key:f.id+'-'+l.level,facility:f.id,level:l.level,title:f.name+' · '+l.name,file:null,
 placeholder:{shipyard:'expediciones',caravan:'comercio',workshop:'taller',excavations:'excavacion',surveys:'indicios'}[f.id],status:'pendiente'})]))));

/* Estado: state.camp = {schema, levels:{id:n}, history:[{facility,level,at,cost}], migratedAt} */
function normalize(state,now=Date.now()){
 const c=plain(state.camp)?state.camp:{};
 const levels={};
 for(const f of FACILITIES){
  const v=Math.floor(Number(c.levels?.[f.id]));
  levels[f.id]=Number.isFinite(v)?Math.max(1,Math.min(MAX_LEVEL,v)):1;
 }
 const history=Array.isArray(c.history)?c.history.filter(h=>plain(h)&&BY_ID.has(h.facility)&&Number.isFinite(h.level)).slice(-50):[];
 // Las mejoras son irreversibles: el historial nunca puede quedar por encima del nivel.
 for(const h of history)if(h.level>levels[h.facility])levels[h.facility]=Math.min(MAX_LEVEL,h.level);
 state.camp={schema:SCHEMA,levels,history,migratedAt:Number.isFinite(c.migratedAt)?c.migratedAt:(plain(state.camp)?null:now),
  migration:plain(c.migration)?c.migration:(plain(state.camp)?null:{method:'nivel-1-con-derechos-adquiridos',at:now})};
 return state.camp;
}
function level(state,id){const v=state?.camp?.levels?.[id];return Number.isFinite(v)?Math.max(1,Math.min(MAX_LEVEL,v)):1;}
function facility(id){return BY_ID.get(id)||null;}
function stageOf(id,lv){return BY_ID.get(id)?.levels[lv-1]||null;}
function effects(state,id){return stageOf(id,level(state,id))?.effects||{};}

function check(state,id){
 const f=BY_ID.get(id);if(!f)return {ok:false,reasons:['Instalación desconocida']};
 const lv=level(state,id);
 if(lv>=MAX_LEVEL)return {ok:false,max:true,reasons:['Nivel máximo alcanzado'],next:null};
 const next=f.levels[lv],reasons=[];
 if(f.unlock&&!state.upgrades?.[f.unlock.flag])reasons.push('Requiere '+f.unlock.label);
 if((Number(state.prestige)||0)<next.requires.prestige)reasons.push('Prestigio '+next.requires.prestige);
 if((Number(state.money)||0)<next.cost.money)reasons.push('£'+next.cost.money);
 if((Number(state.knowledge)||0)<next.cost.knowledge)reasons.push(next.cost.knowledge+' de conocimiento');
 // MEC-04: if(next.requires.societyRankActive&&rank<next.requires.societyRank) …
 return {ok:reasons.length===0,reasons,next,level:lv};
}
function upgrade(state,id,now=Date.now()){
 const r=check(state,id);if(!r.ok)return {ok:false,reasons:r.reasons};
 normalize(state,now);
 state.money-=r.next.cost.money;state.knowledge-=r.next.cost.knowledge;
 state.camp.levels[id]=r.next.level;
 state.camp.history.push({facility:id,level:r.next.level,at:now,cost:{...r.next.cost}});
 state.camp.history=state.camp.history.slice(-50);
 return {ok:true,level:r.next.level,stage:r.next};
}

/* Modelo común de actividades: los motores siguen siendo los de cada módulo. */
const ACTIVITY_STATES=Object.freeze(['disponible','bloqueada','en-ejecucion','terminada','recompensa-pendiente','liquidada']);
function activityState(job,now,{manualCollect=false,settled=false}={}){
 if(settled)return 'liquidada';
 if(!job||!Number.isFinite(job.endAt))return 'en-ejecucion'; // fechas históricas inválidas se conservan
 if(job.endAt>now)return 'en-ejecucion';
 return manualCollect?'recompensa-pendiente':'terminada';
}

root.AtlasCampMEC02=Object.freeze({version:'5.6.2-beta',build:'MEC-02',schema:SCHEMA,MAX_LEVEL,ROMAN,
 FACILITIES,PERSONAL_AREA,SURVEY_TYPES,DIG_MODES,VOYAGE_MODALITIES,PREPARED_SOURCES,ART,ACTIVITY_STATES,
 normalize,level,facility,stageOf,effects,check,upgrade,activityState});
})(typeof globalThis!=='undefined'?globalThis:window);
