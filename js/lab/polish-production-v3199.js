/* Generated production museum renderer; no game bootstrap or storage. */
(function(){
const MUSEUM_RELICTS=[
 {id:'coelacanth_indic',name:'Celacanto del Índico',latin:'Latimeria chalumnae',icon:'🐟',region:'HX-10-12',habitats:['costa'],times:['atardecer','noche'],desc:'Pez de linaje muy antiguo; hallazgo costero excepcional.',shape:'fish'},
 {id:'atlas_lion',name:'León del Atlas',latin:'Panthera leo leo',icon:'🦁',region:'HX-06-08',habitats:['montana','estepa'],times:['amanecer','atardecer','noche'],desc:'Población histórica norteafricana, desaparecida de la naturaleza en la actualidad.',shape:'lion'},
 {id:'seychelles_sheathbat',name:'Murciélago de Seychelles',latin:'Coleura seychellensis',icon:'🦇',region:'HX-07-14',habitats:['bosque'],times:['atardecer','noche'],desc:'Murciélago insular muy amenazado, de detección excepcional.',shape:'bat'},
 {id:'gabon_dwarf_croc',name:'Cocodrilo enano africano',latin:'Osteolaemus tetraspis',icon:'🐊',region:'HX-08-10',habitats:['rio','bosque','humedal'],times:['atardecer','noche'],desc:'Crocodílido forestal de distribución restringida.',shape:'croc'},
 {id:"angonoka",name:"Tortuga angonoka",latin:"Astrochelys yniphora",icon:"🐢",region:"HX-09-14",habitats:["bosque","pradera"],times:["amanecer","dia","atardecer"],desc:"Tortuga endémica de Madagascar y gravemente amenazada; relicto insular extraordinario.",shape:"tortoise"},
 {id:"african_lungfish",name:"Pez pulmonado africano",latin:"Protopterus aethiopicus",icon:"🐟",region:"HX-09-11",habitats:["humedal"],times:["amanecer","atardecer","noche"],desc:"Pez de linaje antiguo capaz de respirar aire; hallazgo museístico extraordinario.",shape:"lungfish"},
 {id:"white_sturgeon",name:"Esturión blanco del Pacífico",latin:"Acipenser transmontanus",icon:"🐟",region:"HX-02-02",habitats:["rio"],times:["amanecer","atardecer","noche"],desc:"Linaje muy antiguo de peces; archivo de observaciones fluviales en Columbia Británica.",shape:"sturgeon"},
 {id:"gharial",name:"Gavial del Ganges",latin:"Gavialis gangeticus",icon:"🐊",region:"HX-05-16",habitats:["rio"],times:["amanecer","dia","atardecer"],desc:"Crocodiliano de hocico estrecho y linaje singular; registros excepcionales de ríos del subcontinente indio.",shape:"gharial"},
 {id:"olm_balkans",name:"Proteo de las cuevas",latin:"Proteus anguinus",icon:"🦎",region:"HX-03-12",habitats:["bosque"],times:["noche"],desc:"Anfibio cavernícola de los sistemas kársticos balcánicos; se investiga mediante registros subterráneos, no por aparición superficial.",shape:"olm"}
];
// Beta 3.17 · Yacimientos de investigación, sin sustituir las expediciones originales.
const MUSEUM_DIG_SITES=[
 {id:'british_cliffs',name:'Estratos de las Islas Británicas',region:'HX-01-09',seconds:180,money:55,knowledge:15,fragments:[2,3],tooth:0.12,track:0.24,claw:0.03,skull:0.004},
 {id:'alpine_basin',name:'Cuenca sedimentaria alpina',region:'HX-02-09',seconds:300,money:135,knowledge:45,fragments:[3,5],tooth:0.20,track:0.32,claw:0.075,skull:0.009},
 {id:'namib_rocks',name:'Estratos del desierto del Namib',region:'HX-11-08',seconds:540,money:550,knowledge:160,fragments:[5,8],tooth:0.30,track:0.43,claw:0.13,skull:0.025,reqResearch:'africa_1'},
 {id:'canadian_rocks',name:'Sedimentos de Columbia Británica',region:'HX-02-02',seconds:660,money:750,knowledge:225,fragments:[6,9],tooth:0.32,track:0.50,claw:0.16,skull:0.035,reqResearch:'norteamerica_1'}
];
function museumCardArt(kind,id){
 const relictArt=globalThis.ATLAS_RELICT_ART?.render(id);
 if(relictArt)return relictArt;
 const frame=(paths)=>'<svg viewBox="0 0 100 100" aria-hidden="true">'+paths+'</svg>';
 if(id==='ankylosaurus_mount')return frame(
  '<path d="M20 64Q37 41 65 49Q85 55 80 70L43 75Z" fill="#d9c19a" stroke="#795d41" stroke-width="4"/>'+
  '<path d="M29 49l7-16 10 17 9-21 10 22 11-11" fill="#bea17a" stroke="#795d41" stroke-width="3"/>'+
  '<path d="M34 72l-4 15m17-14-1 14m15-15 3 14" stroke="#846647" stroke-width="6" fill="none"/>'+
  '<path d="M21 63Q10 61 9 74L4 81" stroke="#896a4d" stroke-width="7" fill="none"/>'+
  '<ellipse cx="9" cy="80" rx="8" ry="6" fill="#cbb28d" stroke="#72573e" stroke-width="3"/>'+
  '<path d="M75 55l14-5 8 12-10 9-11-4Z" fill="#dfc9a3" stroke="#785c40" stroke-width="3"/>');
 if(id==='iguanodon_mount')return frame(
  '<path d="M17 53Q40 35 63 49L73 42Q87 36 95 47L85 59L62 62 39 66Z" fill="#d4b994" stroke="#775d42" stroke-width="4"/>'+
  '<path d="M23 56L6 69M40 64l-8 24 15 0m16-30 8 30 13 0" fill="none" stroke="#85694b" stroke-width="6" stroke-linecap="round"/>'+
  '<path d="M53 53l5 21 10 3m-10-3 4-9m-23-15 9 11" stroke="#765e44" stroke-width="4" fill="none"/>'+
  '<path d="M76 39l8-9 13 5-1 13-12 7-9-5Z" fill="#e2cba5" stroke="#765a42" stroke-width="3"/>'+
  '<circle cx="91" cy="40" r="2" fill="#5b452f"/>');
 if(id==='huellas_teropodos')return frame(
  '<rect x="14" y="16" width="72" height="70" rx="8" fill="#e1d0ad" stroke="#896d4e" stroke-width="4"/>'+
  '<path d="M46 56L29 32m17 24-1-34m1 34 19-25m-19 25 3 16" stroke="#946e50" stroke-width="9" stroke-linecap="round"/>'+
  '<path d="M25 77h50" stroke="#a68e68" stroke-width="3"/>');
 if(id==='sedimentos_estratos')return frame(
  '<path d="M14 25h72v51H14z" fill="#e4d5b6" stroke="#8c7453" stroke-width="3"/>'+
  '<path d="M15 35h70m-70 13h70m-70 13h70m-70 13h70" stroke="#a58b66" stroke-width="6"/>'+
  '<path d="M40 38q11-12 20 0q-8 15-20 0m0 22q10-11 21 0" fill="none" stroke="#665949" stroke-width="4"/>');
 if(id==='pachycephalosaurus_mount')return frame(
  '<path d="M9 59Q31 45 56 52L69 48 75 60 59 70 32 70Z" fill="none" stroke="#856f50" stroke-width="7"/>'+
  '<path d="M13 59L3 49m39 22-4 18m17-20 7 20" fill="none" stroke="#997b55" stroke-width="6" stroke-linecap="round"/>'+
  '<path d="M69 49Q63 26 84 19Q98 19 98 35L94 54L79 61Z" fill="#e4cba3" stroke="#8c6b46" stroke-width="4"/>'+
  '<path d="M72 32Q84 17 95 29" fill="none" stroke="#fff0ca" stroke-width="4"/>'+
  '<path d="M61 56l9 11m-27-15 5 12m-20-9 8 11" fill="none" stroke="#d6b88d" stroke-width="4"/>'+
  '<circle cx="90" cy="40" r="2.5" fill="#473729"/>');
 if(id==='carnotaurus_mount')return frame(
  '<path d="M9 60Q30 43 57 53L67 43 78 45 91 52 82 61 54 71 27 68Z" fill="none" stroke="#80684c" stroke-width="7"/>'+
  '<path d="M23 63L6 80m32-11-7 22m26-21 7 20m-20-38 7 15m0-13 8 13" fill="none" stroke="#ac8c63" stroke-width="5"/>'+
  '<path d="M68 38L83 29L97 35L97 51L81 58L68 49Z" fill="#e0c69e" stroke="#816548" stroke-width="3"/>'+
  '<path d="M78 32l-4-12 13 10m0 1 9-11-2 15" stroke="#dbc19b" stroke-width="5" fill="none"/>'+
  '<path d="M77 53L91 53" stroke="#765a40" stroke-width="3"/><circle cx="89" cy="40" r="2" fill="#53402b"/>');
 if(id==='trex_mount')return frame(
  '<path d="M14 42Q33 16 57 35L73 25 85 31 76 42 60 47 39 52 22 48" fill="none" stroke="#73583d" stroke-width="7" stroke-linecap="round"/>'+
  '<path d="M31 51L20 86m26-36 2 32m-29 3 16 1m5-3 16 1" fill="none" stroke="#785b3b" stroke-width="6" stroke-linecap="round"/>'+
  '<path d="M35 44l3 18m4-21 7 18m2-20 6 15m-25-7-23 8" fill="none" stroke="#c7a67b" stroke-width="4"/>'+
  '<path d="M70 24Q83 12 96 24L89 39 75 38Z" fill="#d8c29d" stroke="#74583d" stroke-width="3"/>'+
  '<circle cx="88" cy="26" r="3" fill="#654d36"/>');
 if(id==='carta_historica')return frame(
  '<path d="M18 20L39 25 62 17 84 22V78L62 72 39 80 18 74Z" fill="#e2cf9e" stroke="#8d764a" stroke-width="4"/>'+
  '<path d="M39 25v54m23-62v55" fill="none" stroke="#b09b6e" stroke-width="2"/>'+
  '<path d="M27 60l10-18 15 7 15-20 8 9" fill="none" stroke="#597c69" stroke-width="4"/>'+
  '<path d="M59 50l16 17m0-17-16 17" stroke="#9a654a" stroke-width="3"/>');
 if(id==='medallon_viajero')return frame(
  '<path d="M43 22v-9h14v9" fill="none" stroke="#a57b40" stroke-width="5"/>'+
  '<circle cx="50" cy="55" r="30" fill="#d8b66e" stroke="#927039" stroke-width="6"/>'+
  '<circle cx="50" cy="55" r="23" fill="#efdb9f" stroke="#9d8249" stroke-width="2"/>'+
  '<path d="M34 64q16-36 32 0m-26 4 10-23 10 23" fill="none" stroke="#6d7b53" stroke-width="4"/>');
 if(id==='huella_paleontologica')return frame(
  '<path d="M27 57Q20 44 32 37Q45 40 45 59Q41 77 29 74Q24 71 27 57Z" fill="#94745b" stroke="#5a4735" stroke-width="3"/>'+
  '<circle cx="22" cy="31" r="6" fill="#94745b"/><circle cx="33" cy="25" r="7" fill="#94745b"/><circle cx="44" cy="31" r="6" fill="#94745b"/>'+
  '<path d="M64 72q-8-24 6-30 16 4 12 29" fill="#b69a76" stroke="#705b44" stroke-width="3"/>'+
  '<circle cx="60" cy="35" r="5" fill="#b69a76"/><circle cx="72" cy="31" r="6" fill="#b69a76"/><circle cx="84" cy="35" r="5" fill="#b69a76"/>');
 if(id==='fosil_catalogado')return frame(
  '<path d="M21 36Q10 27 18 20Q28 16 34 25L65 60Q77 54 85 62Q95 75 82 78Q74 88 65 79L34 45Q21 48 21 36Z" fill="#d8bb90" stroke="#796044" stroke-width="4"/>'+
  '<path d="M39 45L62 67" fill="none" stroke="#fff0cc" stroke-width="3"/>');
 if(id==='triceratops_mount')return frame("<path d=\"M11 59Q28 39 53 48L72 46 81 59 61 72 30 67Z\" fill=\"none\" stroke=\"#73593b\" stroke-width=\"6\"/><path d=\"M22 67l-5 22m21-20v20m20-20 5 20\" stroke=\"#94795a\" stroke-width=\"6\"/><path d=\"M70 40L84 25L94 35L91 58L76 63L66 51Z\" fill=\"#d8bf97\" stroke=\"#6a533c\" stroke-width=\"3\"/><path d=\"M77 38l-6-21m15 20 3-20m3 37 8-8\" stroke=\"#decca9\" stroke-width=\"5\"/><path d=\"M37 47l5 20m10-18 1 18\" stroke=\"#d2b48a\" stroke-width=\"3\"/>");
 if(id==='stegosaurus_mount')return frame("<path d=\"M13 62Q27 43 58 50L80 61L67 70L30 72Z\" fill=\"none\" stroke=\"#785d3f\" stroke-width=\"6\"/><path d=\"M19 52L26 26L38 48L47 17L58 49L70 34L77 60\" fill=\"#c4a477\" stroke=\"#886b49\" stroke-width=\"3\"/><path d=\"M30 69l-5 20m20-19-2 20m22-19 3 18\" stroke=\"#866746\" stroke-width=\"6\"/><path d=\"M18 63L4 48m14 20-15 10\" stroke=\"#9a7651\" stroke-width=\"4\"/><circle cx=\"75\" cy=\"61\" r=\"2\" fill=\"#5e4933\"/>");
 if(id==='spinosaurus_mount')return frame("<path d=\"M8 58Q30 36 56 49L70 40L89 51L95 64L73 62L47 70L24 67Z\" fill=\"none\" stroke=\"#73583f\" stroke-width=\"6\"/><path d=\"M24 44L28 15L39 42L45 9L52 45L60 23L66 46\" fill=\"#ceb28a\" stroke=\"#785c44\" stroke-width=\"3\"/><path d=\"M33 67L29 89m29-22 6 22\" stroke=\"#8a7051\" stroke-width=\"6\"/><path d=\"M75 43L89 32L98 43L95 52L79 50Z\" fill=\"#dac4a4\" stroke=\"#71583e\" stroke-width=\"3\"/><circle cx=\"91\" cy=\"40\" r=\"2\" fill=\"#42372e\"/>");
 if(id==='astrolabio_laton')return frame("<path d=\"M50 15V6M40 17h20\" stroke=\"#87643d\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"53\" r=\"31\" fill=\"none\" stroke=\"#ad884b\" stroke-width=\"7\"/><circle cx=\"50\" cy=\"53\" r=\"22\" fill=\"#ebd399\" stroke=\"#917042\" stroke-width=\"2\"/><path d=\"M20 53h60M50 23v60m-16-14 32-32m-28-4 26 41\" stroke=\"#7e6949\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"53\" r=\"4\" fill=\"#947543\"/>");
 if(id==='diario_explorador')return frame("<path d=\"M24 15H76L83 23V83H30Q18 83 18 71V25Q18 15 24 15Z\" fill=\"#a57d57\" stroke=\"#624a37\" stroke-width=\"4\"/><path d=\"M31 21h44v56H31Z\" fill=\"#e3d3a9\" stroke=\"#897558\" stroke-width=\"2\"/><path d=\"M42 32h24M42 42h22M42 52h27M42 62h17\" stroke=\"#8a8266\" stroke-width=\"2.5\"/><path d=\"M28 16v64\" stroke=\"#614734\" stroke-width=\"5\"/><path d=\"M65 20v25l-6-6-6 6V20\" fill=\"#678b75\"/>");
 if(id==='globo_cartografico')return frame("<circle cx=\"50\" cy=\"41\" r=\"27\" fill=\"#a3c7bf\" stroke=\"#617a70\" stroke-width=\"3\"/><path d=\"M30 33l12-10 10 8-5 17-12 3m18-21 13-6 9 12-12 13 3 11-14 5\" fill=\"#b2b58a\" stroke=\"#798b67\" stroke-width=\"2\"/><path d=\"M50 14v54M23 41h54M33 19q32 40 33 45\" stroke=\"#568c91\" stroke-width=\"2\" fill=\"none\"/><path d=\"M76 25Q89 66 54 77m-4-8v18m-17 3h35\" stroke=\"#82623e\" stroke-width=\"5\" fill=\"none\"/>");
 const animal=MUSEUM_RELICTS.find(r=>r.id===id);
 if(!animal)return frame('<path d="M15 80L50 18L85 80Z" fill="#b6a17f" stroke="#594935" stroke-width="4"/>');

 if(animal.shape==='sturgeon')return frame(
  '<path d="M16 54L7 37 10 55 6 77 22 61Q46 74 78 57L92 49Q78 39 51 42Z" fill="#a8aa8a" stroke="#546053" stroke-width="4"/>'+
  '<path d="M29 43L35 28L42 43 50 28 56 43 65 32 68 45" fill="#d2c49c" stroke="#596452" stroke-width="3"/>'+
  '<path d="M23 54h51m-44 9h34" fill="none" stroke="#d9d0ac" stroke-width="3"/>'+
  '<path d="M77 58l15 3" stroke="#64705d" stroke-width="2"/><circle cx="80" cy="48" r="2" fill="#273830"/>');
 if(animal.shape==='gharial')return frame(
  '<path d="M12 61Q29 39 56 43L68 53Q83 52 96 58L98 67 62 65Q33 78 12 61Z" fill="#718b65" stroke="#3c503b" stroke-width="4"/>'+
  '<path d="M70 53L95 53m-25 7 25 2" stroke="#d5d1a2" stroke-width="3"/>'+
  '<path d="M20 48l7-7 6 7 6-8 9 8 8-7m-30 27-11 13m32-12 10 13" stroke="#4d6549" stroke-width="4" fill="none"/>'+
  '<circle cx="59" cy="49" r="3" fill="#c5b882"/><circle cx="60" cy="48" r="1.4" fill="#203328"/>');
 if(animal.shape==='olm')return frame(
  '<path d="M10 59Q31 43 52 50Q67 54 77 45Q90 40 94 52Q96 68 81 67Q70 57 57 66Q31 80 10 59Z" fill="#e9d0c4" stroke="#b29389" stroke-width="4"/>'+
  '<path d="M50 66l-14 17m23-17 7 17m-45-25L9 45m24 13-8-16" stroke="#b29389" stroke-width="4" fill="none"/>'+
  '<path d="M79 45l-9-13m13 12-2-16m6 18 9-13" stroke="#b65e67" stroke-width="4" fill="none"/>'+
  '<circle cx="87" cy="53" r="1.5" fill="#675454"/>');
 if(animal.shape==='tortoise')return frame('<path d="M24 70l-5 16m28-12-3 14m27-18 5 15" stroke="#796048" stroke-width="7"/><path d="M19 67Q19 34 49 33Q78 37 78 70Q54 83 24 75Z" fill="#bfa86a" stroke="#67543e" stroke-width="4"/><path d="M28 50l19 6 13-12M47 56l8 17m5-29 14 17" stroke="#806847" stroke-width="3"/><path d="M76 59Q89 54 96 64L87 75L75 69Z" fill="#9b9c7b" stroke="#62543d" stroke-width="3"/><circle cx="88" cy="61" r="2" fill="#272b24"/>');
 if(animal.shape==='lungfish')return frame('<path d="M13 62Q24 40 57 46Q81 42 93 57Q73 73 51 71Q28 68 13 62Z" fill="#8b846d" stroke="#525142" stroke-width="4"/><path d="M25 56L11 37L17 60L9 82L30 65m30-20 11-19 4 22" fill="#a3a084" stroke="#57543f" stroke-width="3"/><path d="M48 68q-10 18-24 19m24-19q8 16 29 19" fill="none" stroke="#53503e" stroke-width="3"/><circle cx="81" cy="54" r="2" fill="#373a2e"/>');
 if(animal.shape==='fish')return frame(
  '<path d="M25 48L9 30L13 50L8 73L28 60Q50 69 79 55L94 50L78 42Q53 31 25 48Z" fill="#617f79" stroke="#394b4d" stroke-width="4"/>'+
  '<path d="M35 46L44 23L61 42m-15 20-8 16 22-15" fill="#819c8f" stroke="#394b4d" stroke-width="3"/>'+
  '<path d="M31 52q17-11 38 0" fill="none" stroke="#c1c69b" stroke-width="3"/><circle cx="81" cy="48" r="2.5" fill="#202e31"/>');
 if(animal.shape==='lion')return frame(
  '<ellipse cx="46" cy="61" rx="27" ry="17" fill="#b89564" stroke="#63462f" stroke-width="3"/>'+
  '<path d="M24 70l-3 17m25-11-1 12m18-15 5 15m-45-29Q9 44 12 35" fill="none" stroke="#63462f" stroke-width="5"/>'+
  '<path d="M57 30Q74 13 85 36Q97 52 76 68Q59 75 53 51Z" fill="#7e5a36" stroke="#63462f" stroke-width="3"/>'+
  '<path d="M65 39L76 33L89 44L84 60L68 59Z" fill="#cfad77" stroke="#63462f" stroke-width="3"/>'+
  '<circle cx="78" cy="44" r="2" fill="#2c241b"/>');
 if(animal.shape==='bat')return frame(
  '<path d="M50 42L38 26Q23 31 8 19Q4 44 20 62L40 55L50 72L60 55L80 62Q96 44 92 19Q77 31 62 26Z" fill="#5f625e" stroke="#323a36" stroke-width="3"/>'+
  '<ellipse cx="50" cy="46" rx="9" ry="18" fill="#8b8070" stroke="#323a36" stroke-width="2"/>'+
  '<path d="M43 35L39 23l9 10m9 2 4-12 2 12" fill="#8b8070" stroke="#323a36" stroke-width="2"/>'+
  '<circle cx="47" cy="43" r="1.7" fill="#ddc581"/><circle cx="54" cy="43" r="1.7" fill="#ddc581"/>');
 return frame(
  '<path d="M8 61Q24 47 45 49L70 45L95 54L92 65L70 69L44 72Q22 70 8 61Z" fill="#667d58" stroke="#384632" stroke-width="4"/>'+
  '<path d="M21 58l6-7 7 5 6-7 9 6 8-7" stroke="#45573b" stroke-width="3" fill="none"/>'+
  '<path d="M32 69l-12 12m36-12 9 12" fill="none" stroke="#384632" stroke-width="5"/>'+
  '<circle cx="80" cy="54" r="2.2" fill="#e0c36c"/>');
}

globalThis.ATLAS_POLISH_CURRENT={...globalThis.ATLAS_DIMORPHISM_LAB,MUSEUM_RELICTS,museumCardArt};
})();
