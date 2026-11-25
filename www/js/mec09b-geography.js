/* MEC-09B · V5.6.9 Beta · Ampliación geográfica funcional mínima (sección 10).
   Responde a carencias identificadas en docs/mec09b/cobertura-geografica.csv: Asia (23 regiones, 2 destinos
   de expedición y un yacimiento), Sudamérica, Oceanía, regiones polares y océanos. Usa regiones existentes
   y los motores existentes (expediciones y excavaciones); no crea regiones, mapas ni especies.
   Recompensas, costos y duraciones: PROVISIONALES (BAL-01), en el rango de los destinos vecinos.
   Coleccionables: cada destino nuevo comparte el conjunto de piezas que ya podían hallarse por expedición
   (o excavación) en su mismo continente; no se inventan procedencias nuevas.
   Contexto histórico (hechos verificables, ver docs/mec09b/cientifico-historico.md):
   · Himalaya: Gran Levantamiento Trigonométrico de la India, activo en la década de 1840.
   · Colinas de Siwalik: fósiles descritos por H. Falconer y P. Cautley en la década de 1830.
   · Amazonía: viajes de Spix y Martius (1817-1820) y de R. Schomburgk (1835-1844).
   · Punta Alta (Pampas): fósiles de megafauna recogidos por Darwin en 1832.
   · Nueva Zelanda: E. Dieffenbach (1839-1841); huesos de moa identificados por R. Owen en 1839.
   · Antártida: expedición de J. C. Ross (1839-1843).
   · Índico: rutas regulares de la época (ruta del Cabo). */
(function(root){
'use strict';
const V=(o)=>Object.freeze({routeReq:2,mec09b:true,...o});
const voyages=Object.freeze([
 V({id:'himalaya_survey',name:'Reconocimiento del Himalaya y el Tíbet',seconds:840,cost:1600,knowledge:560,prize:1950,notes:900,required:120,mapItem:'asia_map',reqResearch:'asia_1',
   destination:{continents:['Asia'],regions:['HX-04-15','HX-04-17','HX-05-16'],land:true,marine:false},inherits:'asia_survey',gap:'Asia: 23 regiones y solo 2 destinos de expedición (asia_survey, Anatolia-Cáucaso, y pacific_survey, marítimo); sin destino en el Himalaya'}),
 V({id:'malay_survey',name:'Travesía del archipiélago malayo',seconds:900,cost:1800,knowledge:600,prize:2100,notes:950,required:150,mapItem:'asia_map',reqResearch:'asia_1',
   destination:{continents:['Asia','Océanos'],regions:['HX-06-17','gm06_sonda','gm06_wallacea','mar_mar_tropical_asiatico'],land:true,marine:true},inherits:'asia_survey',gap:'Asia insular (Sonda, Wallacea) y mar tropical asiático sin destino propio'}),
 V({id:'amazon_survey',name:'Reconocimiento del Amazonas',seconds:840,cost:1850,knowledge:620,prize:2250,notes:960,required:185,mapItem:'south_america_map',reqResearch:'sudamerica_1',
   destination:{continents:['Sudamérica'],regions:['sa_amazonia','sa_pantanal','sa_llanos_del_orinoco'],land:true,marine:false},inherits:'andes_survey',gap:'Sudamérica: 14 regiones con un solo destino terrestre (andes_survey); la cuenca amazónica sin destino'}),
 V({id:'nz_survey',name:'Reconocimiento de Nueva Zelanda y Tasmania',seconds:900,cost:2200,knowledge:740,prize:2700,notes:1100,required:235,mapItem:'oceania_map',reqResearch:'oceania_1',
   destination:{continents:['Oceanía'],regions:['oc_nueva_zelanda','oc_tasmania'],land:true,marine:true},inherits:'pacific_survey',gap:'Oceanía: 9 regiones con un solo destino (pacific_survey); Oceanía templada sin destino propio'}),
 V({id:'antarctic_survey',name:'Expedición a las costas antárticas',seconds:1000,cost:2900,knowledge:920,prize:3400,notes:1350,required:290,mapItem:'polar_map',reqResearch:'polos_1',
   destination:{continents:['Polos','Océanos'],regions:['polar_hielo_antartico_costero','polar_hielo_antartico_occidental','mar_oceano_austral_central'],land:true,marine:true},inherits:'polar_survey',gap:'Polos: un solo destino (polar_survey) para 7 regiones polares; costa antártica sin destino propio'}),
 V({id:'indian_ocean_survey',name:'Reconocimiento del océano Índico',seconds:960,cost:2600,knowledge:820,prize:3100,notes:1200,required:340,mapItem:'world_map',reqResearch:'mares_superficiales_1',
   destination:{continents:['Océanos','África','Asia'],regions:['mar_oceano_indico_tropical','mar_indico_meridional'],land:false,marine:true},inherits:'atlantic_survey',gap:'Océanos: 19 regiones con 3 destinos (Atlántico, Pacífico y polar); el Índico sin destino'})
]);
const D=(o)=>Object.freeze({mec09b:true,...o});
const digSites=Object.freeze([
 D({id:'siwalik_beds',name:'Colinas de Siwalik',region:'HX-05-16',seconds:640,money:680,knowledge:200,fragments:[4,7],tooth:0.26,track:0.36,claw:0.1,skull:0.02,reqResearch:'asia_1',inherits:'anatolia_strata',gap:'Asia: un solo yacimiento (anatolia_strata) para 23 regiones'}),
 D({id:'punta_alta',name:'Barrancas de Punta Alta',region:'sa_pampas',seconds:660,money:720,knowledge:210,fragments:[4,7],tooth:0.25,track:0.38,claw:0.12,skull:0.02,reqResearch:'sudamerica_1',inherits:'andes_strata',gap:'Sudamérica: un solo yacimiento (andes_strata); los fósiles de las Pampas son históricamente célebres'}),
 D({id:'moa_deposits',name:'Depósitos de moa de Nueva Zelanda',region:'oc_nueva_zelanda',seconds:700,money:800,knowledge:240,fragments:[4,7],tooth:0.18,track:0.3,claw:0.14,skull:0.02,reqResearch:'oceania_1',inherits:'australia_strata',gap:'Oceanía: un solo yacimiento (australia_strata, interior australiano)'})
]);
// Destinos de expedición para coleccionables y fotografía (mismo formato que voyageDestinations).
const K=root.AtlasMEC03Catalog;
if(K){
 for(const v of voyages){if(K.voyageDestinations&&!K.voyageDestinations[v.id])K.voyageDestinations[v.id]={continents:[...v.destination.continents],land:v.destination.land,marine:v.destination.marine};
  for(const p of Object.values(K.pieces||{})){const e=p.sources?.expediciones;if(e&&Array.isArray(e.routes)&&e.routes.includes(v.inherits)&&!e.routes.includes(v.id))e.routes.push(v.id);}}
 for(const d of digSites)for(const p of Object.values(K.pieces||{})){const e=p.sources?.excavaciones;if(e&&Array.isArray(e.sites)&&e.sites.includes(d.inherits)&&!e.sites.includes(d.id))e.sites.push(d.id);}
}
root.AtlasMEC09BContent=Object.freeze({version:'5.6.9-beta',build:'MEC-09B',voyages,digSites});
})(typeof globalThis!=='undefined'?globalThis:this);
