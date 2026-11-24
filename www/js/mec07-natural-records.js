/* MEC-07 · V5.6.7 Beta · Récords naturales, conductas extraordinarias y observaciones científicas.
   Configuración central y motor puro, en capas separadas:
   1) configuración (RECORDS, BEHAVIORS), 2) elegibilidad (eligible), 3) generación (generate),
   4) actualización del registro (update) y 5) presentación (format / hint).
   Sin estado propio: el registro vive en state.naturalRecords (app.js, bloque MEC-07).
   Todos los valores son PROVISIONALES (BAL-01). Las magnitudes son récords de la ESPECIE en el
   juego, no récords mundiales absolutos. Fuentes: docs/mec07/README.md y docs/mec07/hitos.csv. */
(function(root){
'use strict';

/* Tipos de récord: unidad por defecto, dirección y forma de obtenerlo. */
const TYPES=Object.freeze({
 velocidad:{label:'Velocidad',unit:'km/h',direction:'max',art:'record-type-velocidad'},
 longitud:{label:'Longitud',unit:'m',direction:'max',art:'record-type-longitud'},
 altura:{label:'Altura',unit:'m',direction:'max',art:'record-type-altura'},
 masa:{label:'Masa',unit:'t',direction:'max',art:'record-type-masa'},
 'tamano-minimo':{label:'Tamaño mínimo',unit:'mm',direction:'min',art:'record-type-tamano-minimo'},
 profundidad:{label:'Profundidad',unit:'m',direction:'max',art:'record-type-profundidad'},
 duracion:{label:'Duración',unit:'min',direction:'max',art:'record-type-duracion'},
 altitud:{label:'Altitud',unit:'m',direction:'max',art:'record-type-altitud'},
 'distancia-migratoria':{label:'Distancia migratoria',unit:'km',direction:'max',art:'record-type-migracion'},
 longevidad:{label:'Longevidad estimada',unit:'años',direction:'max',art:'record-type-longevidad'},
 frecuencia:{label:'Frecuencia',unit:'Hz',direction:'max',art:'record-type-frecuencia'},
 precision:{label:'Precisión',unit:'m',direction:'max',art:'record-type-precision'},
 conducta:{label:'Conducta extraordinaria',unit:null,direction:'conducta',art:'record-type-conducta'}
});
/* Métodos: cómo se obtiene el dato (no son métodos de sondeo). */
const METHODS=Object.freeze({
 directa:'Observación o medición directa',estimacion:'Estimación de campo',evidencia:'Evidencia indirecta de campo',analisis:'Análisis de muestras',
 reconstruccion:'Reconstrucción documental',validacion:'Validación instrumental'
});
/* MEC-08 · Prudencia instrumental: qué afirma cada método (no cambia magnitudes ni probabilidades). */
const METHOD_NOTES=Object.freeze({
 directa:'Dato observado o medido sobre el ejemplar.',
 estimacion:'Estimación de campo con referencias visibles; admite error.',
 evidencia:'Inferido de indicios (presas, rastros); no se midió el comportamiento.',
 analisis:'Análisis de muestras en el Taller con los medios de 1842; hace plausible la estimación, no la convierte en una medición moderna.',
 reconstruccion:'Reconstrucción documental a partir de observaciones de la especie en distintas zonas; no se afirma que se haya seguido al mismo individuo.',
 validacion:'Comprobación instrumental de una estimación; no equivale a los métodos modernos citados como referencia.'
});

/* Recompensas provisionales: una sola vez por hito (primera observación e hito cumplido) y por
   conducta (primera observación). Mejorar una marca no da prestigio. */
const REWARDS=Object.freeze({first:{knowledge:20},milestone:{knowledge:150,prestige:2},behavior:{knowledge:40,prestige:1},medal:true});

/* Probabilidades por evaluación de un hito elegible (una por especie observada y búsqueda). */
const P=(manual,auto)=>Object.freeze({manual,auto});
const R=(o)=>Object.freeze({decimals:1,method:'estimacion',conditions:{},chance:P(0.08,0.04),reward:true,instrument:null,journal:null,status:'implementado',balance:'provisional',...o,
 art:'record-'+o.id,medal:'medal-'+o.id});

/* 25 hitos sobre 25 especies del catálogo (ids verificados con el catálogo completo de 1.000 especies). */
const RECORDS=Object.freeze([
 // Conservado de MEC-01 con sus valores y su orden de tiradas originales (legacy: usa Math.random).
 R({id:'guepardo-velocidad',species:'af_guepardo',type:'velocidad',name:'Velocidad máxima',description:'Una carrera de caza medida a lo largo de su trayecto.',unit:'km/h',
  model:{kind:'normal',mean:85,sd:10},bounds:{min:50,max:120},threshold:100,chance:P(0.10,0.10),legacy:'beta560',method:'directa',
  journal:{stage:3,alternativeTo:'feed'},science:'Acinonyx jubatus: carreras de caza registradas con collares GPS hasta unos 93 km/h (Wilson et al. 2013); estimaciones clásicas de 100–110 km/h.',hint:'Un felino de las sabanas africanas en plena carrera.'}),
 R({id:'halcon-picada',species:'na_esp_falco_peregrinus',type:'velocidad',name:'Velocidad en picada',description:'Picado sobre una presa en vuelo.',unit:'km/h',decimals:0,
  model:{kind:'normal',mean:240,sd:45},bounds:{min:120,max:350},threshold:300,journal:{stage:3,alternativeTo:'feed'},
  science:'Falco peregrinus: picados medidos de 300–390 km/h en vuelos entrenados (Tucker 1998; Ponitz et al. 2014); en caza silvestre suelen ser menores.',hint:'Una rapaz de acantilados que caza en picado.'}),
 R({id:'pez-vela-velocidad',species:'mar_esp_istiophorus_platypterus',type:'velocidad',name:'Arranque de natación',description:'Aceleración breve al atacar un cardumen.',unit:'km/h',decimals:0,
  model:{kind:'normal',mean:30,sd:7},bounds:{min:12,max:55},threshold:45,
  science:'Istiophorus platypterus: mediciones modernas de arranques de unos 30 km/h (Svendsen et al. 2016); las cifras históricas de 110 km/h no se consideran fiables, por eso el límite es prudente.',hint:'Un pez de aleta dorsal enorme en el océano Índico.'}),
 R({id:'berrendo-carrera',species:'na_esp_antilocapra_americana',type:'velocidad',name:'Velocidad sostenida',description:'Carrera mantenida durante varios kilómetros.',unit:'km/h',decimals:0,
  model:{kind:'normal',mean:56,sd:8},bounds:{min:35,max:88},threshold:75,
  science:'Antilocapra americana: carreras sostenidas de unos 56 km/h durante kilómetros y picos de 86–88 km/h (Byers 1997).',hint:'Un ungulado de las praderas norteamericanas que corre durante kilómetros.'}),
 R({id:'liebre-carrera',species:'liebre_europea',type:'velocidad',name:'Velocidad de carrera',description:'Huida en zigzag a campo abierto.',unit:'km/h',decimals:0,
  model:{kind:'normal',mean:52,sd:8},bounds:{min:30,max:72},threshold:65,conditions:{times:['amanecer','atardecer','noche']},
  science:'Lepus europaeus: carreras de huida de hasta unos 70 km/h.',hint:'Un lepórido de los campos europeos al anochecer.'}),
 R({id:'ballena-azul-longitud',species:'mar_esp_balaenoptera_musculus',type:'longitud',name:'Longitud corporal',description:'Estimada por comparación con el casco de la embarcación.',unit:'m',
  model:{kind:'normal',mean:24,sd:2.5},bounds:{min:18,max:30},threshold:28,
  science:'Balaenoptera musculus: adultos de 24–27 m; los mayores ejemplares medidos rondan los 30 m.',hint:'El mayor animal del océano.'}),
 R({id:'elefante-masa',species:'af_elefante_sabana',type:'masa',name:'Masa estimada',description:'Estimación por altura a la cruz y perímetro.',unit:'t',
  model:{kind:'normal',mean:5.2,sd:1},bounds:{min:2.5,max:8},threshold:7,
  science:'Loxodonta africana: machos adultos de 4,5–6,1 t; los mayores registros superan las 10 t. El límite del juego es conservador.',hint:'Un gigante de las sabanas africanas.'}),
 R({id:'jirafa-altura',species:'af_jirafa',type:'altura',name:'Altura total',description:'Medida contra un árbol de referencia.',unit:'m',decimals:2,
  model:{kind:'normal',mean:5,sd:0.35},bounds:{min:4,max:5.9},threshold:5.6,method:'directa',
  science:'Giraffa camelopardalis: machos de unos 5,5 m; máximos registrados cercanos a 5,9 m.',hint:'El animal terrestre más alto.'}),
 R({id:'cocodrilo-longitud',species:'oc_esp_crocodylus_porosus',type:'longitud',name:'Longitud',description:'Estimada en la orilla por la distancia entre ojos y fosas nasales.',unit:'m',
  model:{kind:'normal',mean:4.6,sd:0.6},bounds:{min:3,max:6.3},threshold:5.8,
  science:'Crocodylus porosus: machos de 4–5,5 m; el mayor ejemplar medido con fiabilidad, 6,17 m.',hint:'Un reptil de los estuarios del norte de Australia.'}),
 R({id:'anaconda-longitud',species:'sa_esp_eunectes_murinus',type:'longitud',name:'Longitud',description:'Ejemplar desenrollado al sol en la orilla.',unit:'m',
  model:{kind:'normal',mean:4,sd:0.6},bounds:{min:2.5,max:5.6},threshold:5.2,
  science:'Eunectes murinus: hembras de 4–5 m; las cifras de 7 m o más no están verificadas (Rivas 2000).',hint:'Una gran serpiente de los ríos sudamericanos.'}),
 R({id:'sapo-pulga-tamano',species:'sa_esp_brachycephalus_pulex',type:'tamano-minimo',name:'Tamaño mínimo',description:'Longitud hocico-cloaca de un adulto.',unit:'mm',
  model:{kind:'triangular',min:7.5,mode:9,max:11},bounds:{min:7.5,max:11},threshold:8.2,method:'estimacion',
  instrument:{id:'microscopio_compuesto',place:'taller',role:'validacion',label:'Medición con micrómetro ocular',method:'directa',note:'Mide el ejemplar preparado; precisión limitada a la del micrómetro de la época.'},
  science:'Brachycephalus pulex: adultos de unos 8–10 mm (Napoli et al. 2011). Se estima en el campo y se valida con el microscopio.',hint:'Una rana diminuta de la hojarasca brasileña.'}),
 R({id:'colibri-abeja-tamano',species:'gm06_mellisuga_helenae',type:'tamano-minimo',name:'Tamaño mínimo',description:'Longitud total de un macho adulto.',unit:'cm',decimals:2,
  model:{kind:'triangular',min:5,mode:5.7,max:6.3},bounds:{min:5,max:6.3},threshold:5.3,
  science:'Mellisuga helenae: 5–6 cm y unos 2 g; el ave más pequeña.',hint:'Un ave diminuta de las Antillas.'}),
 R({id:'colibri-abeja-aleteo',species:'gm06_mellisuga_helenae',type:'frecuencia',name:'Frecuencia de aleteo',description:'Batidos de ala por segundo durante el vuelo estacionario.',unit:'Hz',decimals:0,
  model:{kind:'normal',mean:70,sd:6},bounds:{min:55,max:85},threshold:80,
  instrument:{id:'estereoscopio_espejos',place:'taller',role:'validacion',label:'Comparación estereoscópica de placas',method:'analisis',note:'Las placas muestran el borrón del ala y confirman que la estimación por el zumbido es plausible; no miden la frecuencia como un registro moderno.'},
  science:'Mellisuga helenae: frecuencias de aleteo de unas 80 por segundo en machos en cortejo. La cifra exige un registro visual analizado.',hint:'El zumbido de un ave antillana.'}),
 R({id:'murcielago-abejorro-tamano',species:'asia_esp_craseonycteris_thonglongyai',type:'tamano-minimo',name:'Tamaño mínimo',description:'Longitud cabeza-cuerpo.',unit:'mm',decimals:0,
  model:{kind:'triangular',min:28,mode:31,max:34},bounds:{min:28,max:34},threshold:29,conditions:{times:['amanecer','atardecer']},
  science:'Craseonycteris thonglongyai: 29–33 mm de cabeza y cuerpo y unos 2 g; uno de los mamíferos más pequeños.',hint:'Un murciélago de las cuevas del sudeste asiático.'}),
 R({id:'cachalote-profundidad',species:'mar_esp_physeter_macrocephalus',type:'profundidad',name:'Profundidad de inmersión',description:'Inferida por la duración de la inmersión y las presas regurgitadas.',unit:'m',decimals:0,method:'evidencia',
  model:{kind:'normal',mean:900,sd:350},bounds:{min:300,max:2250},threshold:2000,
  science:'Physeter macrocephalus: inmersiones habituales de 400–1.200 m y máximos de más de 2.000 m (Watwood et al. 2006). En 1842 solo puede inferirse.',hint:'Un cetáceo que caza calamares en la oscuridad.'}),
 R({id:'zifio-inmersion',species:'mar_esp_ziphius_cavirostris',type:'duracion',name:'Duración de inmersión',description:'Tiempo entre dos respiraciones observadas.',unit:'min',decimals:0,method:'directa',
  model:{kind:'normal',mean:60,sd:25},bounds:{min:20,max:222},threshold:120,
  science:'Ziphius cavirostris: inmersiones de unos 60 min; máximo registrado de 222 min (Quick et al. 2020).',hint:'Un cetáceo de pico que desaparece durante horas.'}),
 R({id:'pinguino-emperador-inmersion',species:'polar_esp_aptenodytes_forsteri',type:'profundidad',name:'Profundidad de inmersión',description:'Inferida por las presas que trae al regresar.',unit:'m',decimals:0,method:'evidencia',
  model:{kind:'normal',mean:200,sd:110},bounds:{min:40,max:560},threshold:500,
  science:'Aptenodytes forsteri: inmersiones habituales de 100–200 m y máximos de unos 560 m (Wienecke et al. 2007).',hint:'Un ave antártica que bucea en aguas heladas.'}),
 R({id:'elefante-marino-profundidad',species:'polar_esp_mirounga_leonina',type:'profundidad',name:'Profundidad de inmersión',description:'Inferida por el tiempo bajo el agua y la fauna de las presas.',unit:'m',decimals:0,method:'evidencia',
  model:{kind:'normal',mean:600,sd:350},bounds:{min:100,max:2300},threshold:1500,
  science:'Mirounga leonina: inmersiones habituales de 300–800 m y máximos superiores a 2.000 m.',hint:'Un gran pinnípedo del océano Austral.'}),
 R({id:'condor-altitud',species:'sa_esp_vultur_gryphus',type:'altitud',name:'Altitud de vuelo',description:'Estimada por triangulación respecto de las cumbres.',unit:'m',decimals:0,
  model:{kind:'normal',mean:3500,sd:900},bounds:{min:1500,max:6500},threshold:5500,
  instrument:{id:'telescopio_astronomico',place:'taller',role:'validacion',label:'Triangulación con el telescopio',method:'estimacion',note:'Triangulación respecto de cumbres de altura conocida: una estimación mejor fundada, no una medición directa.'},
  science:'Vultur gryphus: planea habitualmente entre 3.000 y 5.000 m y se ha observado por encima de 6.000 m en los Andes.',hint:'Un ave enorme que planea sobre los Andes.'}),
 R({id:'aguila-real-altitud',species:'aguila_real',type:'altitud',name:'Altitud de vuelo',description:'Estimada sobre un macizo de altura conocida.',unit:'m',decimals:0,
  model:{kind:'normal',mean:2400,sd:800},bounds:{min:800,max:4800},threshold:4000,conditions:{habitats:['montana']},
  science:'Sustituye al ganso de cabeza barrada (Anser indicus), ausente del catálogo. Aquila chrysaetos se ha registrado volando por encima de 4.000 m en cordilleras.',hint:'Una gran rapaz de las cordilleras.'}),
 R({id:'charran-migracion',species:'polar_esp_sterna_paradisaea',type:'distancia-migratoria',name:'Migración documentada',description:'Reconstrucción documental de la ruta: zonas de cría en el Ártico e invernada en el océano Austral.',unit:'km',decimals:0,method:'reconstruccion',
  model:{kind:'evidencia-regiones',basis:'rutas',total:70900,partial:0.25,required:['cria','invernada'],
   zones:{cria:['polar_hielo_artico_occidental','polar_hielo_artico_oriental'],transito:[],invernada:['mar_oceano_austral_central']},hemispheres:true,
   previous:{kind:'evidencia-regiones',perRegion:35500,firstRegion:0,note:'MEC-07: 35.500 km por región adicional, sin exigir ambos hemisferios'}},bounds:{min:0,max:71000},threshold:70000,chance:P(0.12,0.06),
  science:'Sterna paradisaea: migraciones anuales de unos 70.900 km entre el Ártico y la Antártida (Egevang et al. 2010). Una sola observación no permite conocerla.',hint:'Un ave que pasa de un polo a otro.'}),
 R({id:'pardela-migracion',species:'mar_esp_ardenna_grisea',type:'distancia-migratoria',name:'Migración documentada',description:'Reconstrucción documental de la ruta: colonias de cría subantárticas y zona de tránsito y alimentación del Pacífico.',unit:'km',decimals:0,method:'reconstruccion',
  model:{kind:'evidencia-regiones',basis:'rutas',total:64000,partial:0.25,required:['cria','transito'],
   zones:{cria:['mar_oceano_austral_occidental'],transito:['mar_pacifico_austral'],invernada:[]},hemispheres:false,
   previous:{kind:'evidencia-regiones',perRegion:64000,firstRegion:0,note:'MEC-07: 64.000 km con dos regiones cualesquiera'}},bounds:{min:0,max:64000},threshold:60000,chance:P(0.12,0.06),
  science:'Sustituye a la aguja colipinta (Limosa lapponica), ausente del catálogo. Ardenna grisea: migraciones de unos 64.000 km al año (Shaffer et al. 2006).',hint:'Un ave marina del sur que recorre el Pacífico.'}),
 R({id:'tiburon-groenlandia-longevidad',species:'polar_esp_somniosus_microcephalus',type:'longevidad',name:'Longevidad estimada',description:'Estimada por el tamaño y el crecimiento; no puede conocerse con solo verlo.',unit:'años',decimals:0,method:'estimacion',
  model:{kind:'normal',mean:230,sd:70},bounds:{min:80,max:400},threshold:300,chance:P(0.05,0.025),
  instrument:{id:'microscopio_compuesto',place:'taller',role:'validacion',label:'Estudio de tejidos y crecimiento',method:'analisis',note:'Análisis de muestras: hace plausible una edad elevada; la datación moderna (radiocarbono del cristalino) no existía en 1842.'},
  science:'Somniosus microcephalus: datación del cristalino de 272 a unos 392 años (Nielsen et al. 2016). Es una estimación que exige validación.',hint:'Un tiburón lento de las aguas árticas.'}),
 R({id:'tortuga-aldabra-longevidad',species:'af_tortuga_aldabra',type:'longevidad',name:'Longevidad estimada',description:'Estimada por los anillos del caparazón y los registros de las islas.',unit:'años',decimals:0,method:'estimacion',
  model:{kind:'normal',mean:100,sd:30},bounds:{min:40,max:190},threshold:150,chance:P(0.05,0.025),
  instrument:{id:'microscopio_compuesto',place:'taller',role:'validacion',label:'Estudio de los anillos del caparazón',method:'analisis',note:'Recuento de anillos: estimación prudente de la edad; los anillos no son anuales con exactitud.'},
  science:'Aldabrachelys gigantea: individuos documentados de más de 150 años; algunos casos superan los 180. Es una estimación que exige validación.',hint:'Una tortuga gigante del Índico.'}),
 R({id:'cobra-escupidora-precision',species:'af_xlsx_131_naja_mossambica',type:'precision',name:'Alcance de un escupitajo preciso',description:'Distancia a la que el chorro de veneno alcanza la cara del objetivo.',unit:'m',
  model:{kind:'discreta',values:[1,1.5,2,2.5,3],weights:[2,4,5,3,1]},bounds:{min:1,max:3},threshold:2.5,method:'directa',
  science:'Sustituye al pez arquero (Toxotes), ausente del catálogo. Naja mossambica proyecta veneno con precisión hacia los ojos a unos 2–3 m (Westhoff et al. 2005).',hint:'Una serpiente de África austral que se defiende a distancia.'})
]);

/* Conductas extraordinarias: cualitativas; se registran para siempre al observarse por primera vez. */
const B=(o)=>Object.freeze({conditions:{},chance:P(0.05,0.025),method:'directa',instrument:null,status:'implementado',balance:'provisional',...o,art:'behavior-'+o.id});
const BEHAVIORS=Object.freeze([
 B({id:'emparrado-decorado',sex:'male',species:'oc_esp_ptilonorhynchus_violaceus',category:'Construcción de estructuras',name:'Emparrado decorado',description:'El macho ordena objetos azules alrededor de su emparrado para el cortejo.',conditions:{times:['dia']},science:'Ptilonorhynchus violaceus: los machos decoran el emparrado con objetos azules.',hint:'Un ave australiana que colecciona objetos azules.'}),
 B({id:'chimpance-herramientas',species:'af_chimpance',category:'Utilización de herramientas',name:'Pesca de termitas',description:'Introduce un tallo preparado en un termitero.',conditions:{times:['amanecer','dia','atardecer']},science:'Pan troglodytes: uso documentado de herramientas, como varas para termitas o piedras para cascar nueces (Goodall 1964).',hint:'Un primate africano con ingenio.'}),
 B({id:'cuervo-nc-herramientas',species:'gm06_corvus_moneduloides',category:'Utilización de herramientas',name:'Fabricación de ganchos',description:'Talla un gancho en una rama para extraer larvas.',science:'Corvus moneduloides: fabrica herramientas con gancho (Hunt 1996).',hint:'Un córvido de Melanesia.'}),
 B({id:'cuervo-problemas',species:'na_esp_corvus_corax',category:'Resolución de problemas',name:'Resolución de problemas',description:'Tira de un cordel en varios pasos para alcanzar comida colgada.',science:'Corvus corax: resuelve problemas de varios pasos (Heinrich 1995).',hint:'Un gran córvido del norte.'}),
 B({id:'ave-lira-imitacion',species:'oc_esp_menura_novaehollandiae',category:'Imitación vocal',name:'Imitación vocal',description:'Reproduce cantos de otras aves y sonidos del bosque.',conditions:{times:['dia']},science:'Menura novaehollandiae: imita con fidelidad cantos ajenos y sonidos del entorno.',hint:'Un ave australiana de cola espectacular.'}),
 B({id:'pulpo-camuflaje',species:'mar_esp_octopus_vulgaris',category:'Camuflaje',name:'Cambio de color y textura',description:'Adopta en segundos el color y la textura del fondo.',science:'Octopus vulgaris: camuflaje rápido mediante cromatóforos y papilas.',hint:'Un cefalópodo del Atlántico.'}),
 B({id:'pulpo-coco-refugio',species:'mar_esp_amphioctopus_marginatus',category:'Utilización de herramientas',name:'Refugio transportado',description:'Transporta dos mitades de cáscara de coco y se encierra en ellas.',science:'Amphioctopus marginatus: transporta cáscaras para usarlas como refugio (Finn et al. 2009).',hint:'Un pulpo de los mares tropicales asiáticos.'}),
 B({id:'orca-caza-cooperativa',species:'mar_esp_orcinus_orca',category:'Caza cooperativa',name:'Caza cooperativa',description:'El grupo coordina olas para desalojar presas de un témpano.',science:'Orcinus orca: caza coordinada en grupo, incluido el «lavado de olas» sobre témpanos.',hint:'Un gran delfín que caza en grupo.'}),
 B({id:'pavo-real-cortejo',sex:'male',species:'asia_esp_0410',category:'Cortejo',name:'Exhibición de cortejo',description:'Despliega y hace vibrar la cola ante las hembras.',conditions:{times:['amanecer','dia']},science:'Pavo cristatus: exhibición de cortejo con la cola desplegada y vibrante.',hint:'Un ave del subcontinente indio de cola ocelada.'}),
 B({id:'castor-dique',species:'castor_europeo',category:'Construcción de estructuras',name:'Construcción de un dique',description:'Refuerza un dique con troncos y barro al anochecer.',conditions:{times:['atardecer','noche']},science:'Castor fiber: construye diques y madrigueras que modifican el cauce.',hint:'Un roedor europeo de los ríos.'}),
 B({id:'pez-volador-planeo',species:'mar_esp_exocoetus_volitans',category:'Planeo',name:'Planeo sobre el agua',description:'Planea decenas de metros con las aletas pectorales extendidas.',science:'Exocoetus volitans: planeos de más de 50 m sobre la superficie.',hint:'Un pez de los mares tropicales que sale del agua.'}),
 B({id:'nutria-marina-piedras',species:'asia_esp_0177',category:'Utilización de herramientas',name:'Uso de piedras',description:'Rompe conchas sobre una piedra apoyada en el pecho.',science:'Enhydra lutris: usa piedras para abrir moluscos.',hint:'Un mustélido de la costa del Pacífico Norte.'}),
 B({id:'jorobada-burbujas',species:'mar_esp_megaptera_novaeangliae',category:'Captura especializada de presas',name:'Red de burbujas',description:'Encierra un cardumen con una espiral de burbujas.',science:'Megaptera novaeangliae: alimentación con redes de burbujas, a veces en grupo.',hint:'Una ballena de aletas larguísimas.'}),
 B({id:'buey-almizclero-defensa',species:'na_esp_ovibos_moschatus',category:'Defensa colectiva',name:'Círculo defensivo',description:'Los adultos forman un círculo con las crías en el centro.',science:'Ovibos moschatus: defensa colectiva en círculo ante depredadores.',hint:'Un bóvido lanudo de la tundra.'}),
 B({id:'tejedor-nido',species:'af_xlsx_131_ploceus_cucullatus',category:'Construcción de nidos',name:'Nido tejido',description:'El macho anuda hierbas hasta formar un nido colgante.',conditions:{times:['amanecer','dia']},science:'Ploceus cucullatus: los machos tejen nidos colgantes con nudos de fibras.',hint:'Un pájaro africano que teje.'}),
 B({id:'ardilla-voladora-planeo',species:'asia_esp_0843',category:'Planeo',name:'Planeo entre árboles',description:'Planea de un árbol a otro con la membrana extendida.',conditions:{times:['amanecer','atardecer','noche']},science:'Pteromys volans: planeo con patagio de hasta varias decenas de metros.',hint:'Un pequeño roedor de los bosques boreales.'}),
 B({id:'geco-hoja-camuflaje',species:'af_xlsx_gecko_hoja',category:'Mimetismo',name:'Mimetismo de hoja seca',description:'Inmóvil, imita una hoja muerta, con muescas incluidas.',science:'Uroplatus phantasticus: mimetismo de hoja seca con cola foliácea.',hint:'Un reptil de Madagascar que parece una hoja.'}),
 B({id:'pez-hacha-bioluminiscencia',species:'deep_esp_argyropelecus_aculeatus',category:'Bioluminiscencia',name:'Contrailuminación',description:'Sus fotóforos ventrales borran su silueta vista desde abajo.',method:'evidencia',conditions:{deep:true},science:'Argyropelecus aculeatus: fotóforos ventrales para contrailuminación. En el juego, evidencia indirecta del sondeo.',hint:'Un pez plateado de las aguas profundas.'}),
 B({id:'urogallo-cantadero',sex:'male',species:'urogallo_comun',category:'Exhibiciones territoriales',name:'Canto en el cantadero',description:'Los machos cantan y se exhiben al alba en un claro.',conditions:{times:['amanecer']},science:'Tetrao urogallus: cantaderos al amanecer; en el juego se limita a la franja del alba.',hint:'Una gran gallinácea de los bosques de coníferas.'}),
 B({id:'emperador-incubacion',sex:'male',species:'polar_esp_aptenodytes_forsteri',category:'Cuidado parental',name:'Incubación en invierno',description:'El macho incuba el huevo sobre las patas durante el invierno antártico.',conditions:{seasons:['invierno']},science:'Aptenodytes forsteri: el macho incuba unos dos meses sin alimentarse.',hint:'Un ave antártica que cuida su huevo en pleno invierno.'})
]);

/* RNG aislado: los sorteos nuevos no usan Math.random (no alteran las secuencias históricas). */
function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function rng(seed){let a=hash(String(seed))||1;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}

/* 2. Elegibilidad: especie realmente observada + condiciones del encuentro. */
function eligible(entry,ctx){
 if(entry.species!==ctx.species)return false;
 const c=entry.conditions||{};
 if(c.deep!==undefined&&!!c.deep!==!!ctx.deep)return false;
 if(c.times&&ctx.time&&!c.times.includes(ctx.time))return false;
 if(c.seasons&&ctx.season&&!c.seasons.includes(ctx.season))return false;
 if(c.habitats&&!(ctx.habitats||[]).some(h=>c.habitats.includes(h)))return false;
 if(c.manualOnly&&!ctx.manual)return false;
 return true;
}
/* 3. Generación: distintos modelos por magnitud; siempre dentro de límites plausibles. */
function gauss(r){let u=0,v=0;while(!u)u=r();while(!v)v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function generate(entry,r,ctx={}){
 const m=entry.model,b=entry.bounds||{min:-Infinity,max:Infinity},f=10**(entry.decimals??1);let v;
 if(m.kind==='normal')v=clamp(m.mean+m.sd*gauss(r),b.min,b.max);
 else if(m.kind==='triangular'){const u=r(),c=(m.mode-m.min)/(m.max-m.min);v=u<c?m.min+Math.sqrt(u*(m.max-m.min)*(m.mode-m.min)):m.max-Math.sqrt((1-u)*(m.max-m.min)*(m.max-m.mode));v=clamp(v,b.min,b.max);}
 else if(m.kind==='uniforme')v=clamp(m.min+(m.max-m.min)*r(),b.min,b.max);
 else if(m.kind==='discreta'){const t=m.weights.reduce((a,x)=>a+x,0);let x=r()*t;v=m.values[m.values.length-1];for(let i=0;i<m.values.length;i++){x-=m.weights[i];if(x<0){v=m.values[i];break;}}}
 else if(m.kind==='evidencia-regiones'&&m.basis==='rutas'){const z=routeZones(entry,ctx.evidenceRegionIds||[]);v=clamp(z.complete?m.total:m.total*m.partial*z.covered.length/m.required.length,b.min,b.max);}
 else if(m.kind==='evidencia-regiones'){const n=(ctx.evidenceRegions||0);v=clamp(m.firstRegion+m.perRegion*Math.max(0,n-1),b.min,b.max);}
 else return null;
 return Math.round(v*f)/f;
}
/* MEC-08 · Conjuntos de rutas: zonas cubiertas por las regiones con observaciones de la especie. */
function routeZones(entry,regionIds){
 const m=entry.model||{},ids=new Set(regionIds||[]),covered=[];
 for(const [zone,list] of Object.entries(m.zones||{}))if(list.some(r=>ids.has(r)))covered.push(zone);
 const req=m.required||[];return {covered:covered.filter(z=>req.includes(z)),all:covered,missing:req.filter(z=>!covered.includes(z)),complete:req.length>0&&req.every(z=>covered.includes(z))};
}
/* 4. Actualización pura del registro de un hito: devuelve el nuevo registro y lo ocurrido. */
const better=(entry,a,b)=>{const dir=entry.direction||TYPES[entry.type]?.direction;return b===null||b===undefined?true:dir==='min'?a<b:a>b;};
const meets=(entry,v)=>{const dir=entry.direction||TYPES[entry.type]?.direction;return dir==='min'?v<=entry.threshold:v>=entry.threshold;};
/* La mejor evidencia pendiente de cada región se conserva; r.pending es la mejor de todas (compatibilidad). */
const finite=v=>v!==null&&v!==undefined&&v!==''&&typeof v!=='boolean'&&Number.isFinite(Number(v));
function pendingMap(r){const out={};const src=r&&typeof r.pendingByRegion==='object'&&r.pendingByRegion&&!Array.isArray(r.pendingByRegion)?r.pendingByRegion:{};
 for(const [k,v] of Object.entries(src))if(v&&finite(v.value))out[k]={...v,value:Number(v.value),region:k};
 if(r?.pending&&finite(r.pending.value)){const k=r.pending.region??'—';if(!out[k])out[k]={...r.pending,value:Number(r.pending.value),region:r.pending.region??null};}
 return out;}
function bestPending(entry,map){let best=null;for(const v of Object.values(map||{}))if(!best||better(entry,v.value,best.value))best=v;return best?{...best}:null;}
function update(entry,prev,obs){
 const r=prev?{...prev,regions:{...(prev.regions||{})},pendingByRegion:pendingMap(prev)}:{count:0,first:null,best:null,achieved:false,achievedAt:null,regions:{},pending:null,pendingByRegion:{}};
 r.count++;const events=[];
 const reg=r.regions[obs.region]=r.regions[obs.region]?{...r.regions[obs.region]}:{count:0,best:null};reg.count++;
 if(!r.first){r.first={value:obs.value,at:obs.at,region:obs.region,method:obs.method};events.push('first');}
 const pendingNeeded=entry.instrument?.role==='validacion'&&!obs.validated;
 if(pendingNeeded){const cur=r.pendingByRegion[obs.region];if(!cur||better(entry,obs.value,cur.value)){r.pendingByRegion[obs.region]={value:obs.value,at:obs.at,region:obs.region,method:obs.method};events.push('pending');}r.pending=bestPending(entry,r.pendingByRegion);}
 else{
  if(reg.best===null||better(entry,obs.value,reg.best))reg.best=obs.value;
  if(!r.best||better(entry,obs.value,r.best.value)){const prevBest=r.best?.value;r.best={value:obs.value,at:obs.at,region:obs.region,method:obs.method,instrument:obs.instrument||null};events.push(prevBest===undefined?'best-first':'best');}
  if(!r.achieved&&meets(entry,r.best.value)){r.achieved=true;r.achievedAt=obs.at;events.push('milestone');}
 }
 return {record:r,events};
}
/* 5. Presentación. */
function fmt(entry,v){const unit=entry.unit||TYPES[entry.type]?.unit||'';return v===null||v===undefined?'—':(Number(v).toLocaleString('es-ES',{maximumFractionDigits:entry.decimals??1}))+(unit?' '+unit:'');}

/* MEC-08 · Política de sexo en conductas sexuadas: se usa el sexo del ejemplar observado cuando el
   encuentro lo distinguió (sin segunda tirada). Si el sexo no se distinguió o la especie no tiene
   dimorfismo registrable, la conducta se registra como «inferido por la conducta» (permitir-sin-sexo).
   Si el ejemplar observado es del sexo contrario, la conducta no es elegible en ese encuentro. */
const SEX_POLICY=Object.freeze({observed:'usa el sexo observado',contrary:'no elegible',unknown:'permitir-sin-sexo (inferido por la conducta)'});
function sexEligible(b,sex){if(!b.sex)return {ok:true,sex:null};if(!sex)return {ok:true,sex:b.sex,inferred:true};return sex===b.sex?{ok:true,sex,inferred:false}:{ok:false};}
const ART=Object.freeze({types:Object.values(TYPES).map(t=>t.art),indicators:['record-new-best','record-milestone','record-evidence-pending','behavior-first'],
 behaviors:BEHAVIORS.map(b=>b.art),records:RECORDS.map(r=>r.art),medals:RECORDS.map(r=>r.medal),file:null,status:'pendiente'});

root.AtlasMEC07=Object.freeze({version:'5.6.7-beta',build:'MEC-07',TYPES,METHODS,METHOD_NOTES,SEX_POLICY,REWARDS,RECORDS,BEHAVIORS,ART,routeZones,pendingMap,bestPending,sexEligible,
 byId:Object.freeze(Object.fromEntries(RECORDS.map(r=>[r.id,r]))),behaviorById:Object.freeze(Object.fromEntries(BEHAVIORS.map(b=>[b.id,b]))),
 eligible,generate,update,better,meets,fmt,rng,hash});
})(typeof globalThis!=='undefined'?globalThis:this);
