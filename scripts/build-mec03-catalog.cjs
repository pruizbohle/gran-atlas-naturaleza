'use strict';
// MEC-03 · genera la configuración de obtención por pieza (www/js/mec03-catalog.js) y la
// matriz de auditoría (docs/mec03/matriz-coleccionables.csv) a partir de las reglas por
// colección de este archivo y de los datos de las 431 piezas (beta-v560-data.js).
// Uso: node scripts/build-mec03-catalog.cjs [--write]   (sin --write comprueba que estén al día)
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const ctx={};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
for(const f of ['beta-v560-data','mec01-catalog-meta'])vm.runInContext(fs.readFileSync(path.join(root,'www/js',f+'.js'),'utf8'),ctx);
const B=ctx.AtlasBeta560,META=ctx.AtlasBeta560Meta;

const LAND=['Europa','Asia','África','Norteamérica','Sudamérica','Oceanía'];
const ALL=[...LAND,'Polos','Océanos'];
const B_PLANT=['bosque','pradera','montana','selva','humedal','mediterraneo','sabana','estepa','rio'];
const B_SEED=['bosque','selva','sabana','desierto','mediterraneo','pradera','estepa'];
const B_LEAF=['bosque','selva','humedal','rio','montana'];
const B_WOOD=['bosque','selva'];
const B_FERN=['bosque','selva','humedal','rio','montana'];
const B_ROCK=['montana','desierto','costa','estepa','tundra','costa_marina','costa_antartica'];
const B_SHELL=['costa','costa_marina','arrecife','archipielago'];
const B_ALGA=['costa','costa_marina','arrecife','archipielago','plataforma_marina','mar_austral','oceano_abierto'];
const B_CORAL=['arrecife','costa_marina','archipielago'];
const B_NEST=['bosque','sabana','pradera','selva','rio','humedal'];

/* Reglas por colección (sección 14 del encargo, como orientación). Fuentes:
 * campo (exploración ambiental, por región y bioma), observacion (observación animal, por
 * especie y con el Gabinete de especímenes), expediciones (por destino y modalidad),
 * comercio (Caravana), excavaciones (por yacimiento y modalidad), prospecciones (geológica
 * o regional), taller (preparaciones), encargos (solicitudes de coleccionistas), eventos. */
const RULES={
 'Herbario del mundo':{primary:'campo',alt:['expediciones','taller'],biomes:B_PLANT,exp:['botanica','normal'],taller:'herbario'},
 'Semillas extraordinarias':{primary:'campo',alt:['comercio'],biomes:B_SEED},
 'Pigmentos del mundo':{primary:'expediciones',alt:['comercio'],exp:['botanica','arqueologica','normal']},
 'Hojas y frondas del mundo':{primary:'campo',alt:['prospecciones'],biomes:B_LEAF,prosp:['regional']},
 'Maderas del mundo':{primary:'campo',alt:['comercio','taller'],biomes:B_WOOD,taller:'madera'},
 'Pteridomanía':{primary:'campo',alt:['expediciones'],biomes:B_FERN,exp:['botanica']},
 'Piedras preciosas':{primary:'prospecciones',alt:['comercio'],prosp:['geologica']},
 'Minerales extraordinarios':{primary:'prospecciones',alt:['excavaciones','taller'],prosp:['geologica'],dig:true,taller:'pulido'},
 'Ámbar y resinas fósiles':{primary:'excavaciones',alt:['prospecciones'],dig:true,prosp:['geologica']},
 'Meteoritos':{primary:'prospecciones',alt:['expediciones'],prosp:['geologica'],exp:['reconocimiento','extraordinaria']},
 'Rocas y formaciones geológicas':{primary:'campo',alt:['prospecciones'],biomes:B_ROCK,prosp:['geologica']},
 'Metales raros':{primary:'prospecciones',alt:['comercio'],prosp:['geologica']},
 'Los siete mares':{primary:'expediciones',alt:['encargos'],exp:['oceanografica','normal'],marine:true},
 'Secretos de Atlántida':{primary:'expediciones',alt:[],exp:['extraordinaria'],marine:true},
 'Conchas de los océanos':{primary:'campo',alt:['expediciones'],biomes:B_SHELL,exp:['oceanografica'],marine:true},
 'Curiosidades de marineros':{primary:'comercio',alt:['expediciones'],exp:['oceanografica','normal'],marine:true},
 'Corales del mundo':{primary:'expediciones',alt:['campo'],biomes:B_CORAL,exp:['oceanografica'],marine:true},
 'Algas del mundo':{primary:'campo',alt:['expediciones'],biomes:B_ALGA,exp:['oceanografica'],marine:true},
 'Numismática':{primary:'excavaciones',alt:['comercio'],dig:true},
 'Objetos de civilizaciones':{primary:'excavaciones',alt:['expediciones'],dig:true,exp:['arqueologica']},
 'Armería histórica':{primary:'comercio',alt:['excavaciones'],dig:true},
 'Máscaras y figurillas':{primary:'expediciones',alt:['comercio'],exp:['arqueologica']},
 'Cartografía antigua':{primary:'expediciones',alt:['comercio'],exp:['normal','arqueologica']},
 'Medallas y condecoraciones históricas':{primary:'comercio',alt:['encargos']},
 'Siete maravillas antiguas':{primary:'expediciones',alt:['excavaciones'],exp:['arqueologica'],dig:'especial'},
 'Huevos de aves':{primary:'observacion',alt:['expediciones','comercio'],exp:['reconocimiento']},
 'Fósiles menores':{primary:'excavaciones',alt:['prospecciones','taller'],dig:true,prosp:['geologica'],taller:'reconstruccion'},
 'Instrumentos de exploración':{primary:'comercio',alt:['expediciones'],exp:['reconocimiento','normal']},
 'Gabinete de maravillas':{primary:'expediciones',alt:['comercio'],exp:['reconocimiento','extraordinaria']},
 'Arquitecturas animales':{primary:'observacion',alt:['campo'],biomes:B_NEST},
 'Imágenes daguerrotipadas':{primary:'expediciones',alt:['comercio','taller'],exp:['reconocimiento','normal'],taller:'daguerrotipo'},
 'Rarezas y mitos':{primary:'observacion',alt:['expediciones','comercio'],exp:['extraordinaria']}
};
// Destinos de las expediciones existentes (VOYAGES no declara región: se fija aquí).
const VOYAGE_DEST={
 coast:{continents:['Europa'],land:true,marine:true},
 north:{continents:['Europa'],land:false,marine:true},
 alps:{continents:['Europa'],land:true,marine:false},
 carpathians:{continents:['Europa'],land:true,marine:false},
 balkans:{continents:['Europa'],land:true,marine:false},
 ethiopia_survey:{continents:['África'],land:true,marine:false},
 namib_survey:{continents:['África'],land:true,marine:false},
 // Excepción justificada: el Atlántico abierto da acceso a piezas marinas de las cuatro costas atlánticas.
 atlantic_survey:{continents:['Océanos','Europa','Norteamérica','Sudamérica','África'],land:false,marine:true},
 // MEC-04 · destinos nuevos (www/js/mec04-society.js · AtlasMEC04Content.voyages).
 mesoamerica_survey:{continents:['Norteamérica'],land:true,marine:false},
 asia_survey:{continents:['Asia'],land:true,marine:false},
 andes_survey:{continents:['Sudamérica'],land:true,marine:false},
 pacific_survey:{continents:['Oceanía','Océanos','Asia'],land:true,marine:true},
 polar_survey:{continents:['Polos','Océanos'],land:true,marine:true}
};
/* Observación animal: tipos de animal (SPECIES.kind) en cuya observación puede hallarse
 * cada pieza. Sin entrada = no se obtiene observando (por ejemplo, insectos sin especie en el
 * Atlas o el ave elefante, extinta); esas piezas usan sus otras fuentes. */
const OBS_KINDS={
 // Las rátidas se asignan por especie, porque el tipo «forestbird» es demasiado amplio.
 'HUE-01':['forestbird'],'HUE-02':['seabird'],'HUE-03':['raptor'],'HUE-04':['wader','stork'],
 'HUE-05':{species:['sa_esp_rhea_americana','sa_esp_rhea_pennata']},'HUE-06':{species:['oc_esp_dromaius_novaehollandiae']},
 'HUE-07':{species:['oc_esp_casuarius_casuarius']},'HUE-08':{species:['oc_esp_apteryx_haastii','oc_esp_apteryx_mantelli','oc_esp_apteryx_owenii']},'HUE-09':['forestbird','songbird'],'HUE-10':{species:['af_avestruz','af_xlsx_avestruz_somali']},'HUE-11':['emperor'],
 'HUE-13':['swan'],'HUE-14':['gannet','seabird'],'HUE-15':['seabird'],'HUE-16':['albatross'],'HUE-17':['forestbird'],'HUE-18':['songbird'],
 'HUE-19':['forestbird'],'HUE-20':['forestbird'],
 'ARQ-01':['songbird','forestbird'],'ARQ-02':['forestbird','songbird'],'ARQ-03':['songbird','forestbird'],'ARQ-06':['beaver'],
 'ARQ-07':['forestbird'],'ARQ-08':['songbird','forestbird'],'ARQ-12':['small'],
 'RAR-01':['deer','bison'],'RAR-02':['narwhal'],'RAR-03':['cetacean','rorqual','sperm_whale'],'RAR-04':['amphibian','salamander'],
 'RAR-05':['snake'],'RAR-06':['raptor'],'RAR-07':['ray','shark','requiem_shark'],'RAR-08':['thresher','mako','shark'],'RAR-09':['deer'],
 'RAR-10':['lizard'],'RAR-11':['reptile','lizard'],'RAR-12':['boar','hippo','elephant','walrus','narwhal']
};
const DIG_SITE_CONT={british_cliffs:'Europa',alpine_basin:'Europa',namib_rocks:'África',canadian_rocks:'Norteamérica',
 // MEC-04 · yacimientos nuevos.
 anatolia_strata:'Asia',andes_strata:'Sudamérica',australia_strata:'Oceanía'};
const EXP_MIN={normal:1,botanica:2,reconocimiento:2,oceanografica:3,arqueologica:4,extraordinaria:5};

/* Coherencia con 1842 y con la geografía: se documenta, no se corrige (sección 15). */
const NOTES={
 'GEM-12':'Anacronismo probable: el ópalo negro de Lightning Ridge se descubrió hacia 1900.',
 'AMB-08':'Anacronismo probable: el ámbar libanés se describió científicamente en el siglo XX.',
 'AMB-12':'Revisar: el ámbar azul dominicano se reconoce como variedad en el siglo XX.',
 'FOS-11':'Anacronismo: la pluma de Archaeopteryx de Solnhofen se halló en 1861.',
 'FOS-04':'Revisar: el comercio de trilobites marroquíes es del siglo XX.',
 'ROC-11':'Revisar: el hierro bandeado de Hamersley se describió después de 1861.',
 'HUE-11':'Revisar: el pingüino emperador se describió en 1844 y su huevo se recolectó en 1902.',
 'HUE-12':'Revisar: los huevos de ave elefante llegaron a Europa hacia 1850.',
 'CIV-06':'Anacronismo: la civilización del valle del Indo se identificó en la década de 1920.',
 'CIV-12':'Anacronismo: las placas de Benín llegaron a Europa en 1897.',
 'CIV-13':'Anacronismo probable: los sumerios se identificaron en 1869.',
 'CIV-10':'Revisar: la cultura nazca se identificó en 1901.',
 'CIV-17':'Revisar: el término Jōmon es de 1877.',
 'CIV-19':'Revisar: «misisipiano» es una denominación del siglo XX.',
 'CIV-20':'Revisar: Angkor se difundió en Europa a partir de 1860.',
 'MAS-07':'Anacronismo probable: la cultura olmeca se identificó entre 1862 y 1920.',
 'MAS-09':'Revisar: la cultura moche se denomina así desde el siglo XX.',
 'PIG-09':'Revisar: el azul maya se identificó como pigmento en 1931.',
 'MARV-11':'Anacronismo: el vidrio del desierto libio se descubrió en 1932.',
 'NUM-05':'Revisar: «India británica» es posterior a 1858; en 1842 sería rupia de la Compañía.',
 'DAG-12':'Anacronismo probable: no hay daguerrotipos conocidos del Taj Mahal en 1842.',
 'DAG-13':'Anacronismo probable: la Gran Muralla se fotografió a partir de la década de 1870.',
 'DAG-14':'Anacronismo probable: la Ciudad Prohibida se fotografió a partir de 1860.',
 'DAG-15':'Anacronismo: Japón estuvo cerrado a fotógrafos occidentales hasta 1854.',
 'DAG-16':'Anacronismo: Angkor Wat se fotografió a partir de 1866.',
 'DAG-19':'Revisar: no hay daguerrotipos conocidos de Cusco en 1842.',
 'DAG-20':'Anacronismo probable: no hay daguerrotipos de Rapa Nui en 1842.',
 'BOT-13':'Geografía: el copihue es chileno y figura como «Mundial».',
 'BOT-14':'Geografía: la vainilla es mesoamericana y figura como «Mundial».',
 'MAD-01':'Geografía: las 12 maderas tienen procedencia concreta (Cuba, Honduras, Ceilán…) y figuran como «Mundial».',
 'DAG-01':'Geografía: los 20 daguerrotipos muestran lugares concretos y figuran como «Mundial».'
};

/* MEC-04 · origen real de las piezas que figuraban como «Mundial» y cuya procedencia es
 * clara. [continente, lugar]. Las que siguen como «Mundial» tienen distribución amplia
 * o un origen incierto (UNCERTAIN). Sin procedencias inventadas. */
const ORIGIN={
 'BOT-13':['Sudamérica','Chile'],'BOT-14':['Norteamérica','México'],'BOT-15':['Sudamérica','Brasil'],'BOT-16':['África','Sudáfrica'],
 'BOT-17':['Asia','Japón'],'BOT-18':['Norteamérica','Mesoamérica y Caribe'],'BOT-19':['Asia','Himalaya'],'BOT-20':['Norteamérica','Sudeste de Norteamérica'],
 'GEM-14':['Sudamérica','Brasil'],'GEM-15':['Asia','Birmania'],'GEM-16':['Asia','Ceilán'],'GEM-17':['Sudamérica','Brasil'],
 'GEM-18':['Asia','Ceilán'],'GEM-19':['Norteamérica','México'],'GEM-20':['Asia','Ceilán'],
 'CON-13':['Océanos','Indo-Pacífico'],'CON-14':['Océanos','Indo-Pacífico'],'CON-15':['Océanos','Indo-Pacífico'],'CON-17':['Océanos','Índico'],
 'CON-18':['Océanos','Indo-Pacífico'],'CON-19':['Océanos','Indo-Pacífico'],
 'COR-13':['Océanos','Indo-Pacífico'],'COR-14':['Océanos','Indo-Pacífico'],'COR-16':['Océanos','Indo-Pacífico'],'COR-17':['Océanos','Indo-Pacífico'],
 'COR-18':['Océanos','Indo-Pacífico'],'COR-19':['Océanos','Indo-Pacífico'],'COR-20':['Océanos','Indo-Pacífico'],
 'NUM-09':['Asia','Lidia (Anatolia)'],'NUM-14':['Europa','Constantinopla'],'NUM-15':['Asia','Bagdad'],'NUM-16':['Europa','Venecia'],
 'NUM-17':['Europa','Suecia'],'NUM-18':['Europa','Rusia'],'NUM-19':['Asia','Anatolia'],'NUM-20':['Sudamérica','Potosí'],
 'CIV-13':['Asia','Mesopotamia'],'CIV-14':['Europa','Etruria'],'CIV-15':['Asia','Levante'],'CIV-16':['Asia','Persia'],
 'CIV-17':['Asia','Japón'],'CIV-18':['Oceanía','Polinesia'],'CIV-19':['Norteamérica','Valle del Misisipi'],'CIV-20':['Asia','Camboya'],
 'HUE-13':['Europa','Norte de Europa'],'HUE-14':['Europa','Atlántico norte'],'HUE-15':['Europa','Atlántico norte'],'HUE-16':['Océanos','Océano Austral'],
 'HUE-17':['Sudamérica','Sudamérica'],'HUE-18':['África','África subsahariana'],'HUE-19':['Asia','Sudeste asiático'],'HUE-20':['Sudamérica','Brasil'],
 'MAD-01':['Norteamérica','Cuba'],'MAD-02':['Norteamérica','Honduras'],'MAD-03':['África','África occidental'],'MAD-04':['Asia','Ceilán'],
 'MAD-05':['Sudamérica','Brasil'],'MAD-06':['Asia','India'],'MAD-07':['Asia','Birmania'],'MAD-08':['Europa','Europa'],
 'MAD-09':['Norteamérica','Centroamérica'],'MAD-10':['Asia','India'],'MAD-11':['Norteamérica','Caribe'],'MAD-12':['Europa','Turberas europeas'],
 'HEL-05':['Asia','Asia tropical'],'HEL-06':['Oceanía','Australia'],'HEL-08':['Oceanía','Nueva Zelanda'],'HEL-11':['Sudamérica','Sudamérica tropical'],'HEL-12':['Oceanía','Nueva Zelanda'],
 'MTR-01':['Sudamérica','Chocó (Nueva Granada)'],'MTR-10':['Norteamérica','Zimapán (México)'],'MTR-11':['Norteamérica','Connecticut'],'MTR-12':['Europa','Finlandia'],
 'MUN-01':['África','Egipto'],'MUN-02':['Asia','Babilonia'],'MUN-03':['Europa','Olimpia'],'MUN-04':['Asia','Éfeso'],
 'MUN-05':['Asia','Halicarnaso'],'MUN-06':['Europa','Rodas'],'MUN-07':['África','Alejandría'],
 'DAG-01':['Europa','Londres'],'DAG-02':['Europa','París'],'DAG-03':['Europa','Roma'],'DAG-04':['Europa','Atenas'],'DAG-05':['Europa','Granada'],
 'DAG-06':['Europa','Moscú'],'DAG-07':['África','Egipto'],'DAG-08':['África','Egipto'],'DAG-09':['África','Cabo'],'DAG-10':['Europa','Constantinopla'],
 'DAG-11':['Asia','Petra'],'DAG-12':['Asia','Agra'],'DAG-13':['Asia','China'],'DAG-14':['Asia','Pekín'],'DAG-15':['Asia','Japón'],
 'DAG-16':['Asia','Camboya'],'DAG-17':['Norteamérica','México'],'DAG-18':['Norteamérica','Yucatán'],'DAG-19':['Sudamérica','Cusco'],'DAG-20':['Oceanía','Rapa Nui'],
 'RAR-02':['Polos','Ártico'],'RAR-03':['Océanos','Océanos'],'RAR-04':['Europa','Europa'],'RAR-06':['Europa','Europa'],'RAR-07':['Europa','Malta'],
 'RAR-08':['Océanos','Atlántico'],'RAR-09':['Asia','Asia central'],'RAR-10':['Europa','Europa'],'RAR-11':['África','Socotra'],'RAR-05':['Asia','India']
};
const UNCERTAIN={
 'GEM-13':'Diamante: en 1842 procedía de la India y de Brasil; se mantiene «Mundial».',
 'CON-16':'Caracol oliva: género de distribución tropical amplia.','CON-20':'Tellina violeta: especie no identificada con certeza.',
 'COR-15':'Coral sol: distribución tropical amplia.',
 'HEL-01':'Helecho macho: distribución holártica.','HEL-02':'Helecho hembra: casi cosmopolita.','HEL-03':'Helecho real: casi cosmopolita.',
 'HEL-04':'Helecho águila: cosmopolita.','HEL-07':'Helecho espada: tropical amplio.','HEL-09':'Helecho película: tropical amplio.','HEL-10':'Azolla: casi cosmopolita.',
 'MTR-02':'Paladio, rodio, iridio y osmio: en 1842 se obtenían del platino de Nueva Granada y de los Urales.','MTR-03':'Ver MTR-02.','MTR-04':'Ver MTR-02.','MTR-05':'Ver MTR-02.',
 'MTR-06':'Oro nativo: distribución mundial.','MTR-07':'Plata nativa: distribución mundial.','MTR-08':'Bismuto: varias procedencias europeas y americanas.','MTR-09':'Wolframita: varias procedencias.',
 'RAR-01':'Bezoar: tradición de Persia, India y América.','RAR-12':'Colmillo apócrifo: sin procedencia concreta.'
};
// Comercio europeo de 1842: Londres y París centralizaban el mercado de antigüedades, monedas,
// huevos, instrumentos y curiosidades de cualquier origen (excepción configurada expresamente).
const EUROPEAN_MARKET=new Set(['Numismática','Objetos de civilizaciones','Armería histórica','Máscaras y figurillas','Cartografía antigua','Medallas y condecoraciones históricas','Curiosidades de marineros','Instrumentos de exploración','Imágenes daguerrotipadas','Gabinete de maravillas','Huevos de aves','Piedras preciosas','Pigmentos del mundo']);
const RAR=['Común','Poco común','Raro','Muy raro'];
const pieces=[];
const items=B.items.filter(r=>r[2]===0||r[2]===2);
for(const [id,name,tipo,gab,col,rar] of items){
 const rule=RULES[col];if(!rule)throw new Error('Sin regla: '+col);
 const metaOrigin=META.cont[id]||'Mundial',fix=metaOrigin==='Mundial'?ORIGIN[id]:null;
 const origin=fix?fix[0]:metaOrigin,place=fix?fix[1]:null;
 const world=origin==='Mundial';
 // Rarezas: el origen es la tradición o el animal, pero pueden hallarse donde viva el animal.
 const findWorld=world||col==='Rarezas y mitos';
 let continents=findWorld?(rule.marine?ALL:LAND):[origin];
 if(rule.marine&&!findWorld&&!continents.includes('Océanos'))continents=[...continents,'Océanos'];
 // Piezas marinas del Indo-Pacífico: también en las costas de Asia y Oceanía.
 if(origin==='Océanos'&&rule.marine)continents=[...new Set([...continents,'Asia','Oceanía'])];
 const sources={};
 const want=new Set([rule.primary,...rule.alt]);
 if(want.has('campo')&&rule.biomes)sources.campo={biomes:rule.biomes,continents};
 if(want.has('observacion')&&OBS_KINDS[id]){const o=OBS_KINDS[id];sources.observacion=Array.isArray(o)?{kinds:o,continents:findWorld?ALL:[...new Set([origin,...(origin==='Océanos'?['Polos']:[])])],requires:'specimenDrops'}:{kinds:[],species:o.species,continents:ALL,requires:'specimenDrops'};}
 if(want.has('expediciones')&&rule.exp){
  const routes=Object.entries(VOYAGE_DEST).filter(([,d])=>(rule.marine?d.marine:d.land)&&(findWorld||continents.some(c=>d.continents.includes(c)))).map(([k])=>k);
  if(routes.length)sources.expediciones={modalities:rule.exp,routes,minShipyard:Math.min(...rule.exp.map(m=>EXP_MIN[m]))};
 }
 if(want.has('excavaciones')&&rule.dig){
  const sites=Object.entries(DIG_SITE_CONT).filter(([,c])=>findWorld||continents.includes(c)).map(([k])=>k);
  const modes=rule.dig==='especial'?['especial']:rar<=1?['normal','profunda','especial']:rar===2?['profunda','especial']:['especial'];
  if(sites.length)sources.excavaciones={sites,modes,minExcavations:modes.includes('normal')?1:modes.includes('profunda')?3:5};
 }
 if(want.has('prospecciones')){
  const types=rule.prosp||[];
  if(types.length)sources.prospecciones={types:types.map(t=>t==='geologica'&&rar===3?'especializada':t),continents,biomes:types.includes('regional')?rule.biomes:null,minSurveys:types.includes('regional')?1:rar===3?4:2};
 }
 if(want.has('taller')&&rule.taller&&rar<=2)sources.taller={recipe:rule.taller};
 if(want.has('encargos'))sources.encargos={collection:col};
 // Comercio: comerciantes regionales de los continentes ya accesibles; rareza ≤ nivel de Caravana − 2.
 const commerce=want.has('comercio');
 // Accesibilidad: si ninguna fuente activa llega a la procedencia de la pieza, se añade el comercio.
 const reach=Object.keys(sources).filter(k=>k!=='taller'&&k!=='encargos');
 const addedCommerce=!commerce&&!reach.length&&!sources.encargos;
 // Dónde se compra: el continente de origen y, para el comercio europeo de colecciones, Europa.
 const markets=world?ALL:[...new Set([...continents,...(EUROPEAN_MARKET.has(col)?['Europa']:[])])];
 if(commerce||addedCommerce)sources.comercio={continents:markets,minCaravan:rar+2,added:addedCommerce||undefined};
 const primary=sources[rule.primary]?rule.primary:Object.keys(sources)[0];
 if(!primary)throw new Error('Pieza sin fuente: '+id);
 pieces.push({id,name,collection:col,cabinet:gab,rarity:rar,origin,place:place||undefined,originBefore:fix?'Mundial':undefined,continents,findIn:continents,buyIn:sources.comercio?.continents,primary,alt:Object.keys(sources).filter(k=>k!==primary),sources,
  weight:B.pesos[rar],note:[NOTES[id],UNCERTAIN[id]].filter(Boolean).join(' ')||undefined});
}
// Catálogo y validaciones.
const byId=Object.fromEntries(pieces.map(p=>[p.id,p]));
if(pieces.length!==431)throw new Error('Se esperaban 431 piezas: '+pieces.length);
const js='/* El Gran Atlas · V5.6.4 Beta — MEC-03/MEC-04 · configuración de obtención por pieza.\n * GENERADO por scripts/build-mec03-catalog.cjs: edita las reglas allí, no este archivo.\n * Probabilidades y pesos provisionales (pesos por rareza de la beta 5.6.0). */\n'+
 "(function(root){'use strict';root.AtlasMEC03Catalog=Object.freeze({version:'5.6.4-beta',rarities:"+JSON.stringify(RAR)+",voyageDestinations:"+JSON.stringify(VOYAGE_DEST)+",digSites:"+JSON.stringify(DIG_SITE_CONT)+",expeditionMinLevel:"+JSON.stringify(EXP_MIN)+",pieces:"+JSON.stringify(byId)+"});})(typeof globalThis!=='undefined'?globalThis:window);\n";
const q=v=>{const s=String(v??'');return /[",;\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
const header=['id','nombre','coleccion','gabinete','rareza','procedencia','lugar_de_origen','antes_mec04','se_encuentra_en','se_compra_en','biomas','fuente_principal','fuentes_alternativas','actividades','requisitos','nivel_minimo','peso','observaciones'];
const rows=pieces.map(p=>{
 const acts=[],req=[],lv=[];
 const s=p.sources;
 if(s.campo){acts.push('campo:exploracion-ambiental');req.push('región desbloqueada del continente con bioma compatible');}
 if(s.observacion){acts.push('campo:observacion-animal');req.push('Gabinete de especímenes; '+(s.observacion.species?'especies: '+s.observacion.species.join(' '):'animales: '+s.observacion.kinds.join(' ')));}
 if(s.expediciones){acts.push(...s.expediciones.modalities.map(m=>'expedicion:'+m));req.push('rutas: '+s.expediciones.routes.join(' '));lv.push('Astillero '+s.expediciones.minShipyard);}
 if(s.excavaciones){acts.push(...s.excavaciones.modes.map(m=>'excavacion:'+m));req.push('yacimientos: '+s.excavaciones.sites.join(' '));lv.push('Excavaciones '+s.excavaciones.minExcavations);}
 if(s.prospecciones){acts.push(...s.prospecciones.types.map(t=>'prospeccion:'+t));req.push('región desbloqueada del continente');lv.push('Prospecciones '+s.prospecciones.minSurveys);}
 if(s.comercio){acts.push('comercio:comerciantes');req.push('continente accesible'+(s.comercio.added?' (fuente añadida por accesibilidad)':''));lv.push('Caravana '+s.comercio.minCaravan);}
 if(s.taller){acts.push('taller:'+s.taller.recipe);lv.push('Taller (receta)');}
 if(s.encargos){acts.push('encargo:coleccionistas');}
 return [p.id,p.name,p.collection,p.cabinet,RAR[p.rarity],p.origin,p.place||'',p.originBefore||'',p.continents.join(' '),(p.buyIn||[]).join(' '),(s.campo?.biomes||s.prospecciones?.biomes||[]).join(' '),p.primary,p.alt.join(' '),acts.join(' '),req.join(' · '),lv.join(' · '),p.weight,p.note||''].map(q).join(';');
});
const csv='﻿'+header.join(';')+'\n'+rows.join('\n')+'\n';
const out=[['www/js/mec03-catalog.js',js],['docs/mec03/matriz-coleccionables.csv',csv]];
if(process.argv.includes('--write')){fs.mkdirSync(path.join(root,'docs/mec03'),{recursive:true});for(const [f,c] of out)fs.writeFileSync(path.join(root,f),c);}
else for(const [f,c] of out)if(!fs.existsSync(path.join(root,f))||fs.readFileSync(path.join(root,f),'utf8')!==c){console.error('Desactualizado: '+f+' · ejecuta node scripts/build-mec03-catalog.cjs --write');process.exit(1);}
const count=k=>pieces.filter(p=>p.sources[k]).length;
const onlyCommerce=pieces.filter(p=>Object.keys(p.sources).filter(k=>k!=='encargos'&&k!=='taller').every(k=>k==='comercio')).map(p=>p.id);
console.log(JSON.stringify({soloComercio:onlyCommerce.length,mundial:pieces.filter(p=>p.origin==='Mundial').length,pieces:pieces.length,campo:count('campo'),observacion:count('observacion'),expediciones:count('expediciones'),comercio:count('comercio'),comercioAñadido:pieces.filter(p=>p.sources.comercio?.added).length,excavaciones:count('excavaciones'),prospecciones:count('prospecciones'),taller:count('taller'),encargos:count('encargos'),notas:pieces.filter(p=>p.note).length}));
