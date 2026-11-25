/* MEC-06 · V5.6.6 Beta · Artefactos científicos, materiales, instrumentos y evolución del Taller.
   Configuración única de artefactos (los 15 de la beta y los 5 históricos, con sus ids de siempre),
   componentes fabricables, ubicaciones, estudios científicos, demostraciones del Museo y capa de
   modificadores de instrumentos. Todos los valores son PROVISIONALES (BAL-01). No hay estado aquí:
   el estado vive en state.mec06 y en los registros históricos del Museo. */
(function(root){
'use strict';

/* 1. Ubicaciones. Un artefacto catalogado está en UNA de ellas. «museo» = vitrina (la condición real
   de exhibición del Museo: state.museum.displays); «taller» y «campamento» = instalado; «almacen» =
   catalogado y guardado. La catalogación es permanente: retirar o instalar nunca lo elimina. */
const PLACES=Object.freeze({
 museo:{label:'Vitrina del Museo'},
 taller:{label:'Instalado en el Taller',capacityByWorkshop:[0,2,3,4,5,6]},
 campamento:{label:'Instalado en el Campamento (expediciones)',capacity:2},
 almacen:{label:'Almacén'}
});

/* 2. Componentes fabricables (los seis de la beta): nivel de Taller según su complejidad.
   Las recetas y costos no cambian (BAL-01). */
const COMPONENTS=Object.freeze({
 engranaje:{minWorkshop:2,family:'mecánica',art:'component-engranaje'},
 espejo:{minWorkshop:3,family:'óptica',art:'component-espejo'},
 carta_estelar:{minWorkshop:3,family:'astronomía',art:'component-carta-estelar',alsoFrom:'observacion-astronomica'},
 placa_daguerrotipo:{minWorkshop:4,family:'fotografía',art:'component-placa'},
 modulo_luminoso:{minWorkshop:4,family:'óptica',art:'component-modulo-luminoso'},
 componente_electrico:{minWorkshop:4,family:'electricidad',art:'component-electrico'}
});

/* 3. Artefactos. functions: A museístico (exhibido), B instalado (Taller/Campamento), C portátil
   (equipamiento existente), D instrumento de expedición (instalado en el Campamento; condición fijada al
   zarpar). Un mismo artefacto puede tener varias, pero solo usa la de su ubicación actual. */
const A=(id,family,minWorkshop,places,functions,engine,uses,extra={})=>Object.freeze({id,family,minWorkshop,places:Object.freeze(places),functions:Object.freeze(functions),engine,uses:Object.freeze(uses),
 art:'artifact-'+id.replace(/_/g,'-'),requirements:extra.requirements||null,attraction:extra.attraction||0,benefits:extra.benefits||null,limits:extra.limits||null,integrations:Object.freeze(extra.integrations||[]),balance:'provisional'});
const ARTIFACTS=Object.freeze({
 microscopio_compuesto:A('microscopio_compuesto','Óptica',3,['taller','museo','almacen'],['B','A'],'analisis',['analisis-plumas','analisis-pelo','analisis-escamas'],{attraction:0.01,integrations:['materiales animales']}),
 telescopio_astronomico:A('telescopio_astronomico','Óptica',4,['taller','museo','almacen'],['B','A'],'astronomia',['observacion-astronomica'],{attraction:0.01,integrations:['carta_estelar']}),
 globo_celeste:A('globo_celeste','Astronomía',4,['campamento','museo','almacen'],['D','A'],'astronomia',['preparacion-derrotas'],{attraction:0.01,benefits:{'expedicion:duracion':-0.1},limits:{'expedicion:duracion':-0.1},integrations:['expediciones']}),
 esfera_armilar:A('esfera_armilar','Astronomía',4,['taller','museo','almacen'],['B','A'],'astronomia',['calculo-derrotas'],{attraction:0.01,integrations:['cartografía']}),
 planetario_orrery:A('planetario_orrery','Astronomía',5,['museo','almacen'],['A'],'demostracion',['demo-planetario'],{attraction:0.04}),
 automata_ave:A('automata_ave','Autómatas',3,['museo','almacen'],['A'],'demostracion',['demo-automata'],{attraction:0.05}),
 automata_escribiente:A('automata_escribiente','Autómatas',5,['taller','museo','almacen'],['B','A'],'analisis',['copia-informes'],{attraction:0.03}),
 estereoscopio_espejos:A('estereoscopio_espejos','Óptica',3,['taller','museo','almacen'],['B','A'],'fotografia',['revelado-placas','foto-expedicion'],{attraction:0.01,benefits:{'fotografia:probabilidad':0.15},limits:{'fotografia:probabilidad':0.15}}),
 camara_daguerrotipos:A('camara_daguerrotipos','Fotografía',4,['campamento','museo','almacen'],['D','A'],'fotografia',['foto-expedicion'],{attraction:0.01,integrations:['expediciones','Imágenes daguerrotipadas']}),
 linterna_magica:A('linterna_magica','Óptica',4,['museo','almacen'],['A'],'demostracion',['demo-linterna'],{attraction:0.02}),
 camara_oscura:A('camara_oscura','Fotografía',3,['taller','museo','almacen'],['B','A'],'fotografia',['revelado-placas','registro-paisajistico'],{attraction:0.01}),
 maquina_electrostatica:A('maquina_electrostatica','Electricidad',4,['museo','taller','almacen'],['A','B'],'fisica',['demo-electrostatica','experimento-electrostatico'],{attraction:0.02}),
 pila_volta:A('pila_volta','Electricidad',4,['taller','museo','almacen'],['B','A'],'fisica',['experimento-pila','medicion-galvanica','induccion'],{attraction:0.01}),
 galvanometro:A('galvanometro','Electricidad',4,['taller','museo','almacen'],['B','A'],'fisica',['medicion-galvanica','induccion'],{attraction:0.01}),
 induccion_farad:A('induccion_farad','Electricidad',5,['taller','museo','almacen'],['B','A'],'fisica',['induccion'],{attraction:0.01}),
 // Históricos (3.10): conservan receta y condiciones; sin nivel de Taller nuevo.
 carta_historica:A('carta_historica','Cartografía',1,['museo','almacen'],['A'],'demostracion',[],{attraction:0.01}),
 medallon_viajero:A('medallon_viajero','Historia',1,['museo','almacen'],['A'],'demostracion',[],{attraction:0.01}),
 astrolabio_laton:A('astrolabio_laton','Astronomía',1,['taller','museo','almacen'],['B','A'],'astronomia',['calculo-derrotas'],{attraction:0.01}),
 diario_explorador:A('diario_explorador','Historia',1,['museo','almacen'],['A'],'demostracion',[],{attraction:0.01}),
 globo_cartografico:A('globo_cartografico','Cartografía',1,['museo','almacen'],['A'],'demostracion',[],{attraction:0.02})
});
const HISTORIC=Object.freeze(['carta_historica','medallon_viajero','astrolabio_laton','diario_explorador','globo_cartografico']);

/* 4. Grupos de materiales animales (los 27), por afinidad temática. */
const ANIMAL_GROUPS=Object.freeze({
 plumas:{label:'Plumas',ids:['MAT-N01','MAT-N02','MAT-N03','MAT-N04','MAT-N05','owl_feather','heron_feather','MAT-N08']},
 pelo:{label:'Pelo, lana y mudas',ids:['MAT-N09','MAT-N10','MAT-N11','MAT-N12','otter_whisker']},
 escamas:{label:'Escamas y caparazones',ids:['MAT-N14','MAT-N15','MAT-N16','beaver_tail_scale']},
 calcareos:{label:'Huesos, dientes y estructuras calcáreas',ids:['antler_fragment','MAT-N18','wolf_tooth','boar_tusk','MAT-N19','MAT-N21']},
 rastros:{label:'Rastros y señales',ids:['MAT-N22','animal_trace','MAT-N24','MAT-N20']}
});

/* 5. Estudios científicos (instantáneos; algunos con espera). requires: materiales fijos; group:
   materiales de un grupo animal (se consumen los más abundantes). instruments: artefactos que deben
   estar en la ubicación indicada. reward: conocimiento, dinero (libro de ingresos), objetos o
   coleccionables. Ninguno consume coleccionables. */
const S=(id,o)=>Object.freeze({id,cooldownHours:0,requires:{},group:null,instruments:{},minWorkshop:1,...o,art:'study-'+id,balance:'provisional'});
const STUDIES=Object.freeze({
 'analisis-plumas':S('analisis-plumas',{label:'Análisis microscópico de plumas',engine:'analisis',minWorkshop:3,group:{id:'plumas',qty:3},instruments:{microscopio_compuesto:'taller'},reward:{knowledge:90,money:30}}),
 'analisis-pelo':S('analisis-pelo',{label:'Clasificación de pelo y mudas',engine:'analisis',minWorkshop:3,group:{id:'pelo',qty:3},instruments:{microscopio_compuesto:'taller'},reward:{knowledge:85,money:25}}),
 'analisis-escamas':S('analisis-escamas',{label:'Estudio de escamas y caparazones',engine:'analisis',minWorkshop:3,group:{id:'escamas',qty:2},instruments:{microscopio_compuesto:'taller'},reward:{knowledge:80,money:25}}),
 'estudio-osteologico':S('estudio-osteologico',{label:'Estudio osteológico y de estructuras calcáreas',engine:'analisis',minWorkshop:2,group:{id:'calcareos',qty:2},reward:{knowledge:60}}),
 'estudio-rastros':S('estudio-rastros',{label:'Análisis de rastros y señales',engine:'analisis',minWorkshop:2,group:{id:'rastros',qty:3},reward:{knowledge:55}}),
 'copia-informes':S('copia-informes',{label:'Copia mecánica de informes',engine:'analisis',minWorkshop:5,requires:{parchment_scrap:2,old_ink:1},instruments:{automata_escribiente:'taller'},reward:{knowledge:70,money:60}}),
 'observacion-astronomica':S('observacion-astronomica',{label:'Observación astronómica',engine:'astronomia',minWorkshop:4,cooldownHours:6,requires:{parchment_scrap:1},instruments:{telescopio_astronomico:'taller'},reward:{knowledge:40,items:{carta_estelar:1}}}),
 'calculo-derrotas':S('calculo-derrotas',{label:'Cálculo de derrotas y cartografía',engine:'astronomia',minWorkshop:4,requires:{carta_estelar:1,map_fragment:3},instruments:{'esfera_armilar|astrolabio_laton':'taller'},reward:{knowledge:50,mapPiece:1}}),
 'registro-paisajistico':S('registro-paisajistico',{label:'Registro paisajístico con cámara oscura',engine:'fotografia',minWorkshop:3,requires:{parchment_scrap:2,old_ink:1},instruments:{camara_oscura:'taller'},reward:{knowledge:30,items:{map_fragment:1}}}),
 'revelado-placas':S('revelado-placas',{label:'Revelado de placas daguerrotípicas',engine:'fotografia',minWorkshop:4,requires:{placa_daguerrotipo:1,old_ink:1},instruments:{camara_oscura:'taller'},reward:{knowledge:40,photo:{chance:0.45}}}),
 'experimento-electrostatico':S('experimento-electrostatico',{label:'Experimento electrostático',engine:'fisica',minWorkshop:4,cooldownHours:4,requires:{carved_wood:1},instruments:{maquina_electrostatica:'taller'},reward:{knowledge:110}}),
 'experimento-pila':S('experimento-pila',{label:'Experimento con la pila voltaica',engine:'fisica',minWorkshop:4,requires:{componente_electrico:1},instruments:{pila_volta:'taller'},reward:{knowledge:140,money:40}}),
 'medicion-galvanica':S('medicion-galvanica',{label:'Medición galvánica',engine:'fisica',minWorkshop:4,cooldownHours:6,requires:{river_pebble:2},instruments:{pila_volta:'taller',galvanometro:'taller'},reward:{knowledge:120,money:80}}),
 'induccion':S('induccion',{label:'Experimento de inducción',engine:'fisica',minWorkshop:5,cooldownHours:24,requires:{componente_electrico:2,engranaje:1},instruments:{pila_volta:'taller',galvanometro:'taller',induccion_farad:'taller'},reward:{knowledge:420,money:200}})
});

/* 6. Demostraciones públicas en el Museo: el artefacto debe estar EXHIBIDO. Espera por marca de tiempo
   guardada: recargar o reorganizar no permite cobrar de nuevo. */
const D=(id,o)=>Object.freeze({id,requires:{},...o,art:'demo-'+id,balance:'provisional'});
const DEMOS=Object.freeze({
 'demo-planetario':D('demo-planetario',{label:'Demostración del planetario mecánico',artifact:'planetario_orrery',cooldownHours:8,reward:{money:250,knowledge:60}}),
 'demo-automata':D('demo-automata',{label:'Exhibición del autómata cantor',artifact:'automata_ave',cooldownHours:6,reward:{money:180}}),
 'demo-linterna':D('demo-linterna',{label:'Conferencia con linterna mágica',artifact:'linterna_magica',cooldownHours:8,requires:{parchment_scrap:1},reward:{money:120,knowledge:120}}),
 'demo-electrostatica':D('demo-electrostatica',{label:'Demostración electrostática',artifact:'maquina_electrostatica',cooldownHours:8,requires:{componente_electrico:1},reward:{money:300}})
});

/* 7. Atractivo museístico: ingreso NUEVO y separado del zoológico, solo de artefactos exhibidos. */
const ATTRACTION=Object.freeze({source:'artefactos',cap:0.25,offlineHours:8,note:'£/s por artefacto exhibido; límite total; libro de ingresos «artefactos».'});

/* 8. Capa de modificadores «instrumentos» (sexta capa, independiente de las de MEC-05). */
const MODIFIERS=Object.freeze([
 {id:'globo-duracion',source:'instrumento:globo_celeste',activity:'expedicion:duracion',type:'factor-aditivo',value:-0.1,stacking:'no acumulable (un globo)',cap:-0.1,condition:'globo celeste instalado en el Campamento al zarpar; se fija en job.mec06'},
 {id:'camara-foto',source:'instrumento:camara_daguerrotipos',activity:'expedicion:fotografia',type:'tirada-adicional',value:0.5,stacking:'una tirada por expedición; consume una placa al zarpar',cap:0.65,condition:'cámara instalada en el Campamento y una placa disponible al zarpar; se fija en job.mec06'},
 {id:'estereo-foto',source:'instrumento:estereoscopio_espejos',activity:'fotografia:probabilidad',type:'suma-a-probabilidad',value:0.15,stacking:'suma con la base; límite',cap:0.15,condition:'estereoscopio instalado en el Taller (revelado) o al zarpar (expedición)'}
]);

const ART=Object.freeze({artifacts:Object.values(ARTIFACTS).map(a=>a.art),components:Object.values(COMPONENTS).map(c=>c.art),
 studies:Object.values(STUDIES).map(s=>s.art),demos:Object.values(DEMOS).map(d=>d.art),installed:['installed-taller','installed-campamento'],file:null,status:'pendiente'});

root.AtlasMEC06=Object.freeze({version:'5.6.6-beta',build:'MEC-06',PLACES,COMPONENTS,ARTIFACTS,HISTORIC,ANIMAL_GROUPS,STUDIES,DEMOS,ATTRACTION,MODIFIERS,ART});
})(typeof globalThis!=='undefined'?globalThis:this);
