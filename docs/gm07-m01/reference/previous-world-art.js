/* GM-07: original vector anatomy. Pure deterministic rendering; no state, taxonomy,
 * encounter configuration, resources, timers or external images. */
(function(root){'use strict';
const ink='#394b41',cream='#e8dfc8',black='#303f3d';
const P=(d,f,stroke=ink,w=1.9)=>`<path d="${d}" fill="${f}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const L=(d,c=ink,w=1.5)=>P(d,'none',c,w);
const E=(x,y,rx,ry,f,stroke=ink,w=1.6)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${stroke}" stroke-width="${w}"/>`;
const eye=(x,y,r=1.4)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#202d29" stroke="${ink}" stroke-width=".5"/><circle cx="${x-.3}" cy="${y-.4}" r=".35" fill="#faf4eb"/>`;
const dots=(pts,c,r=1.5)=>pts.map(([x,y])=>E(x,y,r,r,c,'none',0)).join('');
const wrap=(id,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" data-gm07-species="${id}"><g transform="translate(3 3) scale(.94)" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
const targets=new Set(["asia_esp_0899","asia_esp_0030","salamandra_alpina","salamandra_comun","aguila_imperial_iberica","eu_esp_0656","eu_esp_0655","eu_esp_0657","eu_esp_0029","asia_esp_0016","asia_esp_0017","af_xlsx_piton_bola","af_xlsx_boa_madagascar","af_xlsx_131_schismaderma_carens","af_xlsx_131_phelsuma_grandis","na_esp_lepus_californicus","oc_esp_apteryx_haastii","oc_esp_apteryx_mantelli","oc_esp_apteryx_owenii","oc_esp_aquila_audax","oc_esp_cacatua_galerita","oc_esp_callaeas_wilsoni","oc_esp_calyptorhynchus_banksii","oc_esp_casuarius_casuarius","oc_esp_cicinnurus_regius","oc_esp_cicinnurus_respublica","oc_esp_cygnus_atratus","oc_esp_dacelo_leachii","oc_esp_dacelo_novaeguineae","oc_esp_dasycercus_cristicauda","oc_esp_dasyurus_viverrinus","oc_esp_diomedea_epomophora","oc_esp_dromaius_novaehollandiae","oc_esp_eolophus_roseicapilla","oc_esp_gallirallus_australis","oc_esp_gymnorhina_tibicen","oc_esp_harpyopsis_novaeguineae","oc_esp_hemiphaga_novaeseelandiae","oc_esp_macrotis_lagotis","oc_esp_megadyptes_antipodes","oc_esp_melopsittacus_undulatus","oc_esp_menura_novaehollandiae","oc_esp_myrmecobius_fasciatus","oc_esp_neophema_chrysogaster","oc_esp_nestor_meridionalis","oc_esp_nestor_notabilis","oc_esp_ninox_strenua","oc_esp_nymphicus_hollandicus","oc_esp_ornithorhynchus_anatinus","oc_esp_paradisaea_apoda","oc_esp_pelecanus_conspicillatus","oc_esp_petauroides_volans","oc_esp_petaurus_breviceps","oc_esp_petroica_australis","oc_esp_phylidonyris_novaehollandiae","oc_esp_porphyrio_hochstetteri","oc_esp_ptilonorhynchus_violaceus","oc_esp_rhipidura_fuliginosa","oc_esp_sarcophilus_harrisii","oc_esp_seleucidis_melanoleucus","oc_esp_strigops_habroptilus","oc_esp_tachyglossus_aculeatus","oc_esp_trichoglossus_haematodus","oc_esp_trichoglossus_moluccanus","oc_esp_vombatus_ursinus","oc_esp_zaglossus_bartoni","oc_esp_zanda_latirostris","polar_esp_pagodroma_nivea","polar_esp_pagophila_eburnea","polar_esp_somateria_mollissima","polar_esp_ursus_maritimus","mar_esp_amphioctopus_marginatus","mar_esp_amphiprion_ocellaris","mar_esp_aptenodytes_patagonicus","mar_esp_architeuthis_dux","mar_esp_arctocephalus_gazella","mar_esp_ardenna_grisea","mar_esp_balaenoptera_acutorostrata","mar_esp_balaenoptera_edeni","mar_esp_balaenoptera_musculus","mar_esp_balaenoptera_physalus","mar_esp_balistoides_conspicillum","mar_esp_bolbometopon_muricatum","mar_esp_chaenocephalus_aceratus","mar_esp_cheilinus_undulatus","mar_esp_clupea_harengus","mar_esp_delphinus_delphis","mar_esp_diomedea_exulans","mar_esp_dissostichus_eleginoides","mar_esp_dosidicus_gigas","mar_esp_enteroctopus_dofleini","mar_esp_epinephelus_lanceolatus","mar_esp_eschrichtius_robustus","mar_esp_eubalaena_australis","mar_esp_eudyptes_filholi","mar_esp_eumetopias_jubatus","mar_esp_exocoetus_volitans","mar_esp_fregata_magnificens","mar_esp_gadus_macrocephalus","mar_esp_gadus_morhua","mar_esp_globicephala_macrorhynchus","mar_esp_globicephala_melas","mar_esp_grampus_griseus","mar_esp_halichoerus_grypus","mar_esp_hapalochlaena_lunulata","mar_esp_hippocampus_comes","mar_esp_istiophorus_platypterus","mar_esp_lagenorhynchus_albirostris","mar_esp_lagenorhynchus_obliquidens","mar_esp_lagenorhynchus_obscurus","mar_esp_loligo_vulgaris","mar_esp_macronectes_giganteus","mar_esp_megaptera_novaeangliae","mar_esp_mirounga_angustirostris","mar_esp_mola_alexandrini","mar_esp_mola_mola","mar_esp_morus_bassanus","mar_esp_octopus_bimaculoides","mar_esp_octopus_cyanea","mar_esp_octopus_tetricus","mar_esp_octopus_vulgaris","mar_esp_oncorhynchus_keta","mar_esp_oncorhynchus_tshawytscha","mar_esp_otaria_flavescens","mar_esp_paracanthurus_hepatus","mar_esp_phoca_vitulina","mar_esp_phocoena_phocoena","mar_esp_phoebastria_immutabilis","mar_esp_physeter_macrocephalus","mar_esp_pomacanthus_imperator","mar_esp_pseudorca_crassidens","mar_esp_pygoscelis_antarcticus","mar_esp_pygoscelis_papua","mar_esp_sardina_pilchardus","mar_esp_scomber_scombrus","mar_esp_sepioteuthis_lessoniana","mar_esp_stenella_longirostris","mar_esp_synanceia_verrucosa","mar_esp_thalassarche_melanophris","mar_esp_thunnus_alalunga","mar_esp_thunnus_albacares","mar_esp_thunnus_thynnus","mar_esp_thysanoteuthis_rhombus","mar_esp_trachurus_murphyi","mar_esp_trachurus_novaezelandiae","mar_esp_tremoctopus_violaceus","mar_esp_tursiops_truncatus","mar_esp_xiphias_gladius","mar_esp_zalophus_californianus","mar_esp_ziphius_cavirostris"]);
function bird(o){
 const {body='#879780',wing='#596f60',head=body,belly=body,tail=wing,bill='#b4a66f',feet='#a28e67',long=false,hook=false,crest='',marks='',neck=0}=o;
 return P(long?'M35 59L8 85L40 76Z':'M33 62L13 74L37 77Z',tail)+L('M44 73L41 87L33 89M63 73L68 87L77 87',feet,2.5)+E(51,62,25,18,body)+E(59,68,15,10,belly)+P('M29 57Q39 45 57 54L62 63Q46 72 31 68Z',wing)+
 P(neck?'M65 64Q62 46 67 31Q70 23 79 29L85 36L80 48L78 63Z':'M65 59Q60 49 64 39Q68 29 78 33Q88 36 85 47L77 61Z',head)+
 P(hook?'M82 37Q96 33 97 45Q95 54 90 52L90 43L82 44Z':'M84 39L99 45L84 49Z',bill)+eye(77,39)+crest+marks;
}
function eagle(sp){const l=sp.latin,wedge=l==='Aquila audax',steppe=l==='Aquila nipalensis',iberian=l==='Aquila adalberti',c=wedge?'#4e4a3c':steppe?'#77634b':'#64513d';
 return P(wedge?'M38 59L13 86L35 81L45 66Z':'M34 61L19 81L40 80L47 65Z',c)+L('M44 73L42 88L33 90M63 73L67 88L77 88','#bca261',3)+E(53,62,23,21,c)+P('M34 45Q46 40 62 53L64 71L37 74Z','#45473d')+L('M38 56L50 60M38 63L51 66','#8f8064',1.5)+P('M65 61L63 37Q65 24 77 26Q88 29 85 44L79 60Z',wedge?c:'#ac9876')+P('M83 29Q98 27 96 40L91 45L90 35L83 36Z','#c4ae6c')+eye(79,31)+L(steppe?'M80 38L89 39':'M79 38L86 39','#c5ae65',2)+(iberian?L('M35 49L45 48L54 54',cream,5):l==='Aquila heliaca'?P('M35 49L40 48L43 53L38 55Z',cream):'');}
function oceanBird(sp){const l=sp.latin,g=l.split(' ')[0],profile=sp.artProfile,c=sp.color;
 if(g==='Aquila')return eagle(sp);
 if(g==='Harpyopsis')return bird({body:'#7d7768',wing:'#555f51',head:'#b4ac8f',bill:'#8c967d',hook:true,long:true,crest:P('M65 35L61 21L70 29L75 18L79 31Z','#8d8a75'),marks:L('M42 60L55 63M40 67L51 70',cream)});
 if(profile==='kiwi'){const spotted=g==='Apteryx'&&l!=='Apteryx mantelli',little=l==='Apteryx owenii';return E(46,63,little?24:28,little?20:23,'#8b7e65')+P('M62 52Q63 37 75 37Q84 40 80 50L72 61Z','#9b8d71')+P(little?'M79 44L96 58L94 60L77 49Z':'M79 44L99 61L97 63L77 49Z','#b2a07e')+L('M38 81L34 91L25 92M58 82L64 91L74 92','#867553',3)+eye(75,42)+(spotted?L('M26 56L31 62M36 48L42 55M47 55L52 63M30 69L37 75M51 71L58 77',cream,1.5):L('M27 54L32 69M39 46L43 67M52 48L55 68','#b6a488',1));}
 if(['cassowary','emu'].includes(profile)){const cas=profile==='cassowary';return E(46,61,25,25,cas?black:'#7d7d6b')+L('M36 79L33 94L23 95M55 80L62 94L73 94','#9e9479',4)+P('M61 62Q62 43 64 25Q65 16 75 17L81 23L77 34L77 60Z',cas?'#55899a':'#747d72')+P('M78 23L92 27L79 31Z','#9f9a79')+eye(74,22)+(cas?P('M66 18L68 4Q80 5 78 18Z','#aaa080')+P('M70 35Q62 48 68 48L73 37Z','#b2725e'):L('M28 48L32 75M38 43L43 79M48 43L54 76','#b7b09b',1.4));}
 if(profile==='kookaburra'){const blue=l==='Dacelo leachii';return bird({body:cream,head:cream,wing:blue?'#688b9c':'#7f7762',belly:'#ddd4b7',tail:blue?'#63869b':'#8f6b55',long:true,marks:P('M83 37L99 38L99 46L82 47Z','#acaa8a')+L(blue?'M65 32L72 34':'M65 38L80 39','#685e4b',blue?1:4)+L('M29 57L46 59M25 65L42 66',blue?'#84b5c4':'#a5b9b5',3)+L('M15 78L24 80M20 73L29 75',cream,2)});}
 if(profile==='black-swan')return P('M26 65L8 59L23 78Z',black)+E(46,69,28,15,black)+P('M64 68Q84 67 76 48Q62 28 77 17Q87 12 90 22L84 28Q78 27 81 33Q104 67 74 80Z',black)+P('M87 19L99 23L87 27Z','#b16752')+L('M28 66L51 71',cream,4)+eye(85,20);
 if(profile==='yellow-eyed-penguin')return penguin('yellow-eyed');
 if(profile==='albatross')return seabird('royal-albatross');
 if(profile==='australian-pelican')return pelican();
 if(profile==='owl')return E(53,58,24,29,'#847d69')+P('M31 48Q25 62 35 82L45 77L42 50Z','#5c675c')+E(54,37,23,20,'#bab49b')+E(44,35,7,9,'#aaa986')+E(64,35,7,9,'#aaa986')+eye(44,35,2.5)+eye(64,35,2.5)+P('M52 41L57 41L54 48Z','#aaa179')+L('M42 56L46 60M58 55L63 60M43 66L47 70M58 66L63 70',cream,3)+L('M43 82L40 91M62 82L65 91','#93886d',3);
 if(profile==='rail'){const taka=l==='Porphyrio hochstetteri';return bird({body:taka?'#537d91':'#97866b',head:taka?'#55798c':'#8e7d5d',wing:taka?'#507b6d':'#726f59',belly:taka?'#5b6c90':'#99886d',feet:taka?'#b77b6e':'#ae9472',bill:taka?'#ba6b5d':'#bcaa85',marks:taka?P('M80 30L87 29L87 40L80 40Z','#a95e53'):L('M31 57L41 61M34 65L45 68','#c0ad84',2)});}
 if(['parrot','cockatoo','kakapo'].includes(profile))return parrot(l,profile);
 if(profile==='bird-of-paradise')return paradise(l);
 const paint={
  'Callaeas wilsoni':['#6c8584','#416573','#657f8a','#56796d'], 'Gymnorhina tibicen':[black,black,black,cream],
  'Hemiphaga novaeseelandiae':['#5f8372','#53796e','#7e8a77',cream], 'Menura novaehollandiae':['#8e7f66','#706454','#7d765e','#b1a187'],
  'Petroica australis':['#6b7774','#53635c','#5f6c63','#c8c3ad'],'Phylidonyris novaehollandiae':[black,black,black,cream],
  'Ptilonorhynchus violaceus':['#415260','#34475b','#3e5265','#4d6069'],'Rhipidura fuliginosa':['#8d8a73','#5c665a','#77806c','#c5b99a']};
 const a=paint[l]||[c,'#52685c',c,cream];let marks='';
 if(l==='Gymnorhina tibicen')marks=L('M65 49L76 47M33 56L45 58',cream,5);
 if(l==='Callaeas wilsoni')marks=E(85,49,4,6,'#6f93a1');
 if(l==='Phylidonyris novaehollandiae')marks=L('M30 57L45 65','#d0b95c',4)+L('M66 43L78 47',cream,3);
 if(l==='Menura novaehollandiae')marks=P('M30 70Q2 45 10 19Q17 2 25 20Q17 48 35 65L29 67Q5 30 17 18Q20 24 14 42Q21 66 35 70Z','#b9ae8e')+L('M17 20Q29 37 32 59','#d8cfb5',1);
 if(l==='Rhipidura fuliginosa')marks=P('M34 58L6 53L3 37L12 42L14 30L22 42L27 33L33 53Z','#7b7b64')+L('M8 47L29 59M17 40L31 59M27 42L33 57',cream,1.2);
 return bird({body:a[0],wing:a[1],head:a[2],belly:a[3],long:l==='Menura novaehollandiae',marks});
}
function parrot(l,profile){const colors={
 'Cacatua galerita':[cream,'#d5d7c5',cream,cream,'#d0bd60'], 'Calyptorhynchus banksii':[black,'#3c4943',black,black,'#b6644f'],
 'Eolophus roseicapilla':['#a8aba2','#7c8a85','#c29f9a','#c08d8d','#d6bab0'], 'Melopsittacus undulatus':['#8ca664','#63885a','#c9c86b','#a9bb6e','#aeb979'],
 'Neophema chrysogaster':['#7f9d62','#5b8861','#95a46c','#b99d62','#6a9caa'], 'Nestor meridionalis':['#8a7f6a','#605c50','#a6a18b','#a07a65','#8e967e'],
 'Nestor notabilis':['#899260','#69774c','#929668','#9da171','#87936a'],'Nymphicus hollandicus':['#9aa09b','#7d8886','#c4bc7a','#a6aaa1','#d5c370'],
 'Trichoglossus haematodus':['#658e5a','#4c7f5c','#577c91','#bc7757','#a2af64'],'Trichoglossus moluccanus':['#6c975e','#4e865c','#4e748e','#c08852','#b6bb65'],
 'Strigops habroptilus':['#8c9c68','#6c8154','#9ba577','#b1af80','#9eac77'],'Zanda latirostris':[black,'#414b42',black,black,'#c9c7ad']};
 const a=colors[l]||[cream,'#a9b3a4',cream,cream,'#c6ad76'];let marks='';
 if(l==='Neophema chrysogaster')marks=E(61,73,7,6,'#ca8c50')+L('M66 35L80 36','#5f9ba8',3);
 if(l==='Nymphicus hollandicus')marks=E(76,47,4,5,'#bf8b5c')+L('M33 58L44 62',cream,5);
 if(l==='Zanda latirostris')marks=E(75,48,6,6,cream)+L('M18 77L32 77',cream,5);
 if(l==='Calyptorhynchus banksii')marks=L('M16 79L28 81','#b56d50',7);
 if(l==='Melopsittacus undulatus')marks=L('M32 51L45 54M30 56L45 59M31 62L45 65M66 36L68 40M70 33L72 38',black,1.6);
 if(l==='Nestor notabilis'||l==='Nestor meridionalis')marks=L('M34 52L42 57M31 58L41 63M35 65L44 69','#b2ad89',1.4);
 if(l==='Strigops habroptilus')marks=dots([[33,55],[40,59],[45,53],[37,65],[53,72]],'#bfc194',2.3);
 let crest='';if(profile==='cockatoo')crest=P(l==='Eolophus roseicapilla'?'M67 33Q55 10 70 14L81 33Z':'M65 34Q50 10 59 7L67 26L68 4L74 25L80 10L80 34Z',a[4]);
 return bird({body:a[0],wing:a[1],head:a[2],belly:a[3],tail:a[1],hook:true,long:l!=='Strigops habroptilus',bill:'#a5a785',crest,marks});
}
function paradise(l){if(l==='Cicinnurus regius'||l==='Cicinnurus respublica'){const king=l==='Cicinnurus regius';return bird({body:king?'#a5654c':'#a96a50',wing:'#74684e',head:king?'#ae7054':'#6395a5',belly:king?cream:'#d0b06a',marks:L('M23 73Q2 95 24 90Q39 87 29 75M32 73Q47 95 54 83','#566e53',2.5)+L('M56 57L73 58',black,3)});}const twelve=l==='Seleucidis melanoleucus';return bird({body:twelve?black:'#8b6b4c',wing:twelve?'#485749':'#766044',head:twelve?black:'#c7bd73',belly:twelve?'#c5ba74':'#b99a5e',long:true,marks:(twelve?L('M33 65Q3 66 4 91M35 68Q13 74 14 94M38 70Q25 82 25 95','#756c50',1.2):L('M35 58Q5 63 4 92M39 62Q13 74 11 96M44 64Q26 83 24 97','#d9c28a',3))+(twelve?P('M66 31L82 33L82 37L66 36Z','#c7bd73'):P('M67 38L82 36L82 45L68 49Z','#5b7f60'))});}
function penguin(kind){const c=black;return E(53,56,24,34,c)+E(56,63,17,24,cream)+E(54,26,17,17,c)+P('M35 43Q20 60 23 77L40 57Z',c)+P('M69 25L89 30L70 35Z',kind==='gentoo'?'#bd8657':'#8e967e')+eye(64,25,kind==='yellow-eyed'?2:1.4)+P('M40 86L28 93L50 92L53 87M61 87L58 94L79 92L73 87Z','#a7916e')+
 (kind==='yellow-eyed'?L('M42 21Q54 10 67 20','#c7be71',4):kind==='rockhopper'?L('M38 22L24 30M38 22L29 34M66 20L82 28M67 23L80 32','#c8bb69',3):kind==='king'?P('M60 34Q77 38 69 52L60 45Z','#c8a656'):kind==='gentoo'?L('M41 23Q49 13 64 20',cream,5):kind==='chinstrap'?L('M40 34Q55 44 67 33',cream,5)+L('M43 37Q55 45 63 37',c,1.8):'');}
function pelican(){return P('M28 65L9 73L31 79Z',black)+E(49,67,27,17,cream)+P('M30 61Q43 50 57 60L54 71L31 71Z',black)+P('M64 68Q59 48 65 34Q69 23 79 28L83 38L77 65Z',cream)+P('M78 29L99 35L80 39Z','#c1b493')+P('M81 39L98 36Q89 55 81 48Z','#c3b98f')+eye(76,30)+L('M36 81L30 91M62 82L69 92','#9e9c85',3);}
function seabird(kind){const gull=kind==='ivory',snow=kind==='snow',royal=kind==='royal-albatross',laysan=kind==='laysan',blackbrow=kind==='black-browed',dark=['sooty','giant','skua'].includes(kind),c=dark?'#666b5b':cream,wing=dark?'#424f48':gull||snow?'#e4e6d9':'#53645c';
 let s=P('M30 65L9 78L33 77Z',wing)+L('M44 78L40 89L31 91M65 79L71 89L81 89','#9a9c8e',2.6)+E(52,64,26,17,c)+P('M31 52Q47 46 70 61L32 73L15 73Z',wing)+L('M28 59L50 57M28 64L53 62',dark?'#7f8773':'#acb8a4',1.2)+P('M65 61Q61 44 68 33Q77 22 85 32L86 42L78 61Z',c)+P('M83 32Q99 31 98 40L94 43L94 37L84 39Z',kind==='giant'?'#b1b28e':dark?'#6f7e6c':'#c3b77a')+eye(80,33);
 if(laysan)s+=P('M73 28Q84 26 87 36L80 42L74 36Z','#68766c')+eye(80,33);
 if(blackbrow)s+=L('M74 29L84 30',black,2.8);
 if(royal)s+=L('M29 59L50 57M28 64L53 62','#e6e4cf',1.5);
 if(kind==='giant'||snow||kind==='sooty')s+=L('M85 32L91 32','#879078',2);
 return s;
}
function marineBird(sp){const k=sp.kind,l=sp.latin;if(k.includes('penguin')||['king_penguin','rockhopper','chinstrap','gentoo'].includes(k))return penguin(({king_penguin:'king',rockhopper:'rockhopper',chinstrap:'chinstrap',gentoo:'gentoo'})[k]);
 if(k==='gannet')return bird({body:cream,head:'#d6cca3',wing:'#d4d9c9',bill:'#a8b5a5',marks:P('M13 72L34 59L30 73Z',black)+L('M84 39L99 44','#7f9387',1)});
 if(k==='frigatebird')return P('M45 55L5 24L22 64L4 88L46 68L79 33L95 31L83 25L67 46Z',black)+P('M43 66L22 92L41 80L44 94L50 68Z',black)+E(70,45,7,10,'#aa5d4b')+eye(80,31);
 if(k==='albatross')return seabird(l==='Phoebastria immutabilis'?'laysan':l==='Thalassarche melanophris'?'black-browed':'wandering-albatross');
 return seabird(l==='Macronectes giganteus'?'giant':'sooty');}
function whale(sp){const l=sp.latin,k=sp.kind,c=k==='pilot_whale'||k==='false_killer'?'#454f4b':k==='right_whale'?'#4a5751':k==='rissos'?'#879b9b':'#6d8d92';
 const pilot=k==='pilot_whale',sperm=k==='sperm_whale',right=k==='right_whale',grey=k==='grey_whale',hump=k==='humpback',porp=k==='porpoise',beaked=k==='beaked_whale';
 const longBeak=l==='Stenella longirostris',bottle=l==='Tursiops truncatus',dolphin=k==='dolphin',large=sperm||right||grey||k==='rorqual'||k==='blue_whale'||k==='brydes_whale'||hump;
 let s=P(sperm?'M12 41Q39 31 72 48L82 51L94 41L90 55L98 65L80 62Q49 77 13 65Z':right?'M10 54Q15 28 42 38Q59 37 78 53L91 42L87 55L98 65L78 62Q28 79 10 64Z':`M${dolphin||beaked?20:10} 50Q${pilot?8:25} 29 ${large?57:54} 45Q66 47 79 52L94 42L89 54L98 65L79 62Q39 77 12 62Q7 57 ${dolphin||beaked?20:10} 50Z`,c);
 if(dolphin||beaked)s+=P(`M22 49L${longBeak?2:7} 53L5 57L24 58Z`,c);
 if(!right&&!grey&&!sperm)s+=P(pilot?'M48 46Q47 27 61 35L66 48Z':porp?'M49 45L57 32L63 48Z':large?'M63 48Q69 35 73 50Z':'M48 45Q51 29 62 39L64 47Z',c);
 s+=P(hump?'M37 61Q30 78 61 91L56 65Z':pilot&&l==='Globicephala melas'?'M35 61Q32 80 61 86L54 65Z':pilot?'M36 61L48 77L50 65Z':'M37 61L48 76L55 65Z',hump?cream:c)+L(sperm?'M14 65Q40 73 66 63':'M13 60Q24 66 36 62','#344b46',1.2)+eye(dolphin||beaked?23:17,53,1.1);
 if(large&&!sperm&&!grey&&!right)s+=L('M20 64Q36 77 64 65M24 66Q37 74 62 68','#b1c2b6',1.1);
 if(grey)s+=dots([[22,47],[29,52],[42,48],[54,53]],'#b7bba3',2)+L('M54 45L60 42L65 47L71 45L76 51',c,3);
 if(right)s+=dots([[13,49],[18,42],[23,45]],'#ccc6a8',2.7);
 if(k==='rissos')s+=L('M25 43L32 51M30 45L41 57M41 46L50 53M48 52L59 59',cream,1.3);
 if(l==='Balaenoptera acutorostrata')s+=L('M40 66L47 70',cream,4);
 if(l==='Balaenoptera edeni')s+=L('M12 49L30 45M13 52L31 49M13 55L29 53','#496a6b',1.1);
 if(l==='Balaenoptera musculus')s+=dots([[28,48],[38,52],[49,49],[58,55],[66,53]],'#a5b7b3',2)+L('M64 48L69 44',c,3);
 if(l==='Balaenoptera physalus')s+=P('M11 57Q21 59 30 58L34 63Q19 66 12 62Z',cream)+P('M63 47Q66 32 73 49Z',c);
 if(dolphin){const white=l==='Lagenorhynchus albirostris';s+=P(l==='Delphinus delphis'?'M26 57L40 54L51 60L63 58L70 63L49 68L35 65Z':'M28 60Q43 53 64 60L72 64L48 67Z',l==='Delphinus delphis'?'#c1b88b':'#c0cec1');if(white)s+=P('M5 54L24 52L23 59L7 57Z',cream);if(l==='Lagenorhynchus obliquidens')s+=P('M52 58L72 60L68 65L55 64Z','#bca877');if(l==='Lagenorhynchus obscurus')s+=L('M38 61L62 59',cream,2);}
 return s;
}
function pinniped(sp){const l=sp.latin,seal=sp.kind==='seal'||sp.kind==='elephant_seal',steller=l==='Eumetopias jubatus',south=l==='Otaria flavescens',fur=l==='Arctocephalus gazella',grey=l==='Halichoerus grypus',c=steller?'#a59678':south?'#8d8068':fur?'#665f51':seal?'#9caa9d':'#8e846c';
 if(seal)return P('M12 65Q25 43 66 55Q77 37 91 45Q101 54 87 64Q72 74 28 75L9 82L15 73L4 69Z',c)+P('M43 66Q58 65 66 82L48 77Z','#7e9185')+eye(88,48)+L('M91 57L100 56M90 60L99 63','#667b6c',1)+
  (sp.kind==='elephant_seal'?P('M90 48Q100 48 98 60Q92 67 88 60L91 55Z','#83958a'):grey?P('M79 47L87 40L94 46L97 54L88 57Z',c)+eye(90,47):dots([[24,60],[37,55],[51,61],[65,58]],'#627a6b',1.6));
 return P(`M21 74Q38 57 57 59Q${steller||south?61:66} 30 77 27Q93 28 91 42Q90 51 76 58Q72 79 42 80L19 86L24 78L8 80Z`,c)+P('M54 64Q75 66 73 87Q60 85 49 74Z',c)+P('M79 32L75 26L73 38Z',c)+E(87,40,10,6,'#b3a281')+eye(85,33)+L('M93 41L100 38M93 43L100 46','#6f7162',1)+
 (south?P('M68 35Q55 45 58 65L69 64L77 47Z','#71634e'):steller?L('M62 45Q70 50 73 61','#c1b18c',3):'');
}
function fish(sp){const k=sp.kind,l=sp.latin,c=['surgeonfish','angelfish'].includes(k)?'#6d8c9c':sp.color||'#86a49c';
 if(k==='seahorse')return P('M57 18Q73 12 73 30L87 35L84 42L69 39Q67 49 61 54Q64 64 59 72Q43 93 34 81Q28 72 42 69Q50 69 45 77Q40 81 39 76Q38 81 45 78Q56 69 49 61L39 55L42 46Q31 38 39 26Z','#bda772')+eye(66,25)+L('M44 35L54 36M45 43L58 44M47 52L57 53','#e5d7af',1.5);
 if(k==='sunfish')return P(l==='Mola alexandrini'?'M32 30Q14 29 13 52Q10 72 38 76L57 92L64 72L79 64L73 57L79 48L65 34L59 10L44 29Z':'M34 34Q12 29 12 51Q10 72 39 73L54 92L62 70L77 62L72 55L77 48L62 35L59 11L45 32Z','#8d9f99')+eye(23,45)+L('M13 53L23 54',ink)+P('M37 49L50 55L40 61Z','#657f7b');
 const disk=['surgeonfish','angelfish','clownfish','triggerfish','wrasse','parrotfish','grouper','stonefish'].includes(k),tuna=['tuna','albacore','mackerel','jack'].includes(k),sword=k==='swordfish'||k==='sailfish',cod=k==='cod',body=disk?'M15 50Q26 24 52 30Q76 32 78 48L93 33L89 52L95 70L77 59Q48 82 22 64Z':sword?'M15 50Q40 39 77 49L94 31L89 52L97 74L77 61Q38 70 15 59Z':'M10 52Q29 36 58 43Q68 46 77 50L94 35L88 53L96 70L76 61Q36 74 10 60Z';
 let s=P(body,disk&&k==='clownfish'?'#bd905a':c)+P(tuna?'M43 44L53 29L60 45Z':disk?'M28 34L39 20L50 29L62 23L70 38Z':'M43 44L52 32L59 45Z',c)+P('M41 59L51 70L58 60Z',c)+L(disk?'M22 48Q19 55 25 62':'M22 48Q19 57 25 63','#536e65',1.2)+eye(disk?24:17,51)+L('M11 58L18 58',ink,1);
 if(cod)s+=L('M13 60L12 69','#b6b99c',1.4)+P('M29 44L34 38L40 44M59 46L67 41L70 49Z',c);
 if(k==='clownfish')s+=L('M32 36L30 65M55 33L57 68M75 45L77 59',cream,7);
 if(k==='triggerfish')s+=P('M19 49Q35 40 65 48L71 63Q38 79 22 63Z',black)+dots([[29,54],[39,51],[49,54],[59,51],[34,63],[46,63],[58,62]],cream,2.2)+P('M15 50L23 48L24 57L16 57Z','#c8b462');
 if(k==='icefish')s+=P('M11 52Q23 36 38 47L35 61L15 65Z','#c6cbbb')+P('M31 60L48 79L43 58Z','#b6c4bc')+L('M12 58L27 60',ink,1.4)+eye(21,49);
 if(k==='angelfish')s+=L('M37 34L34 66M48 31L46 71M59 33L58 69M69 37L68 63','#d4c070',2);
 if(k==='surgeonfish')s+=P('M30 37Q55 32 70 48L55 53L67 62L38 66L44 53Z','#394a64')+P('M78 48L93 36L89 53L95 69L78 60Z','#d9be62');
 if(k==='parrotfish'||k==='wrasse')s+=P(k==='parrotfish'?'M16 48L17 35Q20 26 35 30L38 40L28 47Z':'M16 48Q15 31 35 30L38 40L28 47Z','#93aa8c')+L('M15 54L26 54',ink,2.2)+(k==='parrotfish'?P('M14 50L21 50L21 58L14 58Z','#c4b49e')+L('M14 54L21 54',ink,1):L('M31 42Q42 47 50 44M30 47Q42 52 51 49','#6b9e8b',1.3));
 if(k==='grouper'||k==='stonefish'||k==='toothfish')s+=dots([[35,52],[43,60],[50,47],[62,56],[70,52]],'#586e5e',2.2);
 if(k==='stonefish')s+=L('M23 39L27 26L31 33L37 22L43 31L51 24L57 34L64 29L70 42',c,3.2);
 if(tuna)s+=L('M24 61Q46 69 75 58',cream,2)+P('M77 46L82 43L81 48M79 64L84 64L81 60Z','#c1b779');
 if(k==='tuna'&&l==='Thunnus albacares')s+=P('M48 44Q51 23 67 22L57 45Z','#ccb966')+P('M52 63L71 79L62 61Z','#ccb966');
 if(k==='albacore')s+=P('M31 56L68 74L51 58Z','#718f8d');
 if(k==='mackerel')s+=L('M29 45L32 53M36 43L39 52M44 43L47 52M52 45L55 53M60 47L63 53',ink,1.5);
 if(k==='jack')s+=L('M43 60L75 57','#b5bf9d',2);
 if(k==='salmon')s+=dots([[27,48],[38,45],[49,47],[57,49]],ink,1)+(l==='Oncorhynchus keta'?L('M34 48L36 61M45 47L48 62M58 50L60 61','#96857b',2):'');
 if(k==='herring')s+=L('M28 62L72 58',cream,2.5)+(l==='Sardina pilchardus'?dots([[30,50],[37,48],[44,48],[51,49]],'#586f6a',1.3):'');
 if(k==='flyingfish')s+=P('M35 48L73 19L65 54L35 58Z','#9ab4ae')+L('M40 49L66 30M44 52L65 39',cream,1);
 if(sword)s+=P(k==='sailfish'?'M26 46Q26 11 39 20L48 27L57 26L65 41L73 47Z':'M49 43L61 26L65 45Z',c)+L('M15 53L2 50',ink,2.3);
 return s;
}
function cephalopod(sp){const k=sp.kind,oct=k.includes('octopus'),blue=k==='blue_ring_octopus',c=({blue_ring_octopus:'#c1ab5e',giant_octopus:'#b7826d',coconut_octopus:'#8c7c68',bimac_octopus:'#9c9880',day_octopus:'#ac9b7b',octopus:'#9d8975',blanket_octopus:'#b49b9d',giant_squid:'#b69d92',jumbo_squid:'#b98676',reef_squid:'#b6a29a',diamond_squid:'#ac9690'})[k]||'#b79689';
 if(oct){let s='';for(let i=0;i<8;i++){const x=14+i*10,curve=i<4?-8:8,end=18+i*9,d=`M${42+i*2} 53Q${x} 59 ${x+curve} 78Q${end-6} ${96-(i%3)*3} ${end} 83Q${end+4} 80 ${end+1} 77`;s+=L(d,ink,6.8)+L(d,c,4.8)+dots([[x,72],[x+curve/2,78]],cream,.8);}s+=P('M36 53Q23 35 34 21Q49 7 65 20Q76 36 63 53Z',c)+eye(36,43,2)+eye(63,43,2);
 if(blue)s+=Array.from({length:9},(_,i)=>E(34+(i%3)*11,24+Math.floor(i/3)*10,3,3,'none','#4d86aa',1.8)).join('');
 if(k==='bimac_octopus')s+=E(37,50,4,4,'#538796')+E(63,50,4,4,'#538796');
 if(k==='blanket_octopus')s+=P('M38 53L19 88L47 76L57 91L78 82L63 53Z','#b19bb0');
 if(k==='day_octopus'||k==='octopus')s+=dots([[44,25],[57,27],[47,35],[56,40]],'#b5a98e',1.5);
 return s;}
 const big=k==='giant_squid',reef=sp.latin==='Sepioteuthis lessoniana',diamond=k==='diamond_squid';let s=P(diamond?'M75 18L95 51L74 77L40 62L35 37Z':reef?'M75 25Q98 40 79 68L32 68L32 32Z':'M88 37Q73 24 42 39L29 50L43 63Q75 77 88 59L97 65L92 49L98 31Z',c);
 s+=P(reef?'M32 32Q48 13 79 25L89 34L78 32L32 40Z':'M66 32L87 19L89 39M64 67L88 80L88 60Z',c)+eye(38,49,3);
 for(let i=0;i<8;i++)s+=L(`M33 ${43+i*1.8}Q${12-(i%3)*3} ${35+i*4} ${8+i*2} ${28+i*7}`,c,1.9);
 s+=L(big?'M32 48Q3 17 7 9M32 54Q-1 80 6 94':'M32 48Q8 20 8 15M32 54Q4 78 13 87',c,2.8);return s;
}
function amphibian(sp){const l=sp.latin,giant=l.startsWith('Andrias'),alpine=l==='Ichthyosaura alpestris',palm=l==='Lissotriton helveticus',fire=l==='Salamandra salamandra',c=giant?'#7c8270':fire?'#3c463c':alpine?'#6a8593':palm?'#9a9475':'#59695b';
 if(l==='Schismaderma carens')return E(51,65,26,20,'#ae7f6b')+P('M31 61Q12 63 17 85L38 79M69 61Q91 61 86 85L65 79Z','#9c7960')+E(51,49,22,15,'#b28b70')+eye(39,43,3)+eye(63,43,3)+L('M39 56Q52 62 65 55',ink,1.2)+dots([[39,64],[51,68],[61,63]],'#806e56',1.5);
 let s=P(giant?'M38 49Q13 42 5 66Q18 59 36 65Z':'M38 49Q12 34 6 60Q20 47 37 63Z',c)+E(52,57,giant?28:23,giant?12:8,c)+E(79,54,giant?18:11,giant?12:7,c)+L('M38 56L27 71L21 72M65 58L69 73L77 73M44 52L35 40L29 39M69 51L78 40L85 41',c,giant?6:4)+eye(84,50,giant?1.3:1.6);
 if(giant)s+=L('M30 53Q49 48 63 54M29 63Q48 69 69 62','#aaa68a',1.6)+dots([[48,54],[58,58],[74,53],[82,58]],'#5c6b59',1.2);
 if(alpine||palm)s+=L('M36 62L68 62',alpine?'#c58956':'#c2ad7e',3);
 if(fire)s+=dots([[42,53],[53,52],[61,56],[75,51]],'#d0be63',3.4);
 if(l==='Salamandrella keyserlingii')s+=L('M30 53Q53 45 78 51','#baaa7d',3)+L('M14 54L29 51','#baaa7d',1.7);
 if(l==='Triturus cristatus')s+=P('M32 48L35 42L39 47L43 39L47 46L51 39L55 46L60 41L65 49Z',c)+L('M37 62L67 62','#c9ad64',2);
 return s;
}
function reptile(sp){const l=sp.latin;if(l==='Phelsuma grandis')return P('M36 49Q4 31 8 65Q13 40 37 61Z','#5b9b72')+E(55,57,24,10,'#65a477')+E(79,52,13,9,'#65a477')+L('M39 55L27 42L19 40M42 61L32 77L24 80M67 55L77 40L85 40M67 61L79 74L87 74','#65a477',5)+dots([[20,40],[24,80],[85,40],[87,74]],'#a7be8c',2.2)+L('M69 48L79 48','#b66a58',3)+dots([[44,53],[54,55],[63,51]],'#b86d58',2)+eye(82,50,1.6);
 const arboreal=l==='Sanzinia madagascariensis',c=arboreal?'#7c966c':'#9a8763';return P(arboreal?'M8 75Q11 63 27 71Q53 86 49 62Q44 41 63 35Q86 29 89 46Q92 60 78 59Q63 56 66 46Q49 53 59 71Q60 92 35 86Q9 83 8 75Z':'M10 70Q6 36 38 39Q58 41 49 62Q44 74 64 72Q90 69 89 49Q89 26 70 30Q56 33 61 47Q66 60 76 53Q66 49 71 43Q78 38 79 50Q78 65 62 62Q63 37 41 30Q8 20 4 54Q2 66 10 70Z',c)+P('M72 29Q89 24 94 38L90 48L74 42Z',c)+eye(87,34)+L(arboreal?'M15 69L26 73M31 77L43 76M52 56L54 46M71 53L82 50':'M17 40L25 44M33 36L40 42M55 49L48 57M60 68L68 68','#d0c295',5);}
function oceanMammal(sp){const p=sp.artProfile,l=sp.latin,c=sp.color;
 if(p==='wombat'||p==='tasmanian-devil'){const devil=p==='tasmanian-devil';return P('M19 61Q17 38 43 36Q65 33 75 45L88 46Q98 52 92 62L78 65L68 78L29 79Z',devil?black:'#948571')+P('M27 69L23 85L35 85L43 71M62 68L68 86L81 85L76 68Z',devil?black:'#948571')+E(78,43,6,8,devil?'#9c8177':'#9b8c78')+E(90,57,7,5,'#6d7163')+eye(88,48)+P('M21 56Q8 54 7 74L23 68Z',devil?black:'#8e826c')+(devil?P('M48 41L64 48L58 56L43 46Z',cream):L('M27 48Q45 40 61 46','#b7a38a',3));}
 if(p==='platypus')return P('M30 59Q4 44 4 64Q11 80 35 70Z','#736953')+E(54,62,27,14,'#8a7659')+E(81,57,11,9,'#8a7659')+P('M84 57Q102 51 98 65Q87 70 79 64Z','#a79e79')+L('M39 68L31 81L45 78M63 70L73 82L81 78','#716e53',5)+eye(82,53);
 if(p.includes('echidna')){const long=p==='long-beaked-echidna';let s=P('M17 63Q13 39 41 37Q66 35 76 55L94 65L93 70L75 67Q56 82 23 77Z','#8b7a5e')+L('M29 72L25 85M61 74L66 86','#6c6a50',5)+eye(76,58);for(let i=0;i<13;i++)s+=P(`M${18+i*3.8} 62L${16+i*4} ${26+(i%3)*4}L${23+i*3.8} 61Z`,'#c1b48e',ink,.8);if(long)s+=P('M77 57Q87 60 99 74L96 77L75 66Z','#948168');return s;}
 if(p==='glider')return E(52,59,22,16,'#8d9992')+P('M39 51Q20 45 13 64Q23 85 45 70L69 70Q90 87 96 65L74 52Z','#8e9c95')+E(75,45,14,12,'#a1aaa0')+E(67,32,6,8,'#b7b4a3')+E(84,33,6,8,'#b7b4a3')+L('M35 66Q9 77 11 91Q26 98 31 82','#9ca89c',5)+P('M72 36L75 53L70 53L68 39Z',black)+eye(80,43,2)+L('M84 50L98 48',ink,.8)+(l==='Petauroides volans'?L('M19 64L31 70M85 68L94 63',cream,4):'');
 const numbat=p==='numbat',bilby=p==='bilby',quoll=p==='quoll';return P('M30 56Q10 47 7 66L32 69Z',quoll?'#6f6859':c)+E(53,61,27,15,c)+P('M70 48Q83 43 96 58L92 64L71 61Z',c)+E(76,45,4,6,c)+L('M35 68L30 84L38 84M64 69L73 84L82 84',c,5)+eye(85,53)+
 (numbat?L('M35 49L32 66M44 47L42 68M54 47L53 69M64 49L64 66',cream,3)+P('M76 49L89 53L85 58L73 53Z',black):quoll?dots([[34,55],[44,51],[53,59],[62,51],[29,63],[61,65]],cream,2):bilby?E(77,30,4,17,c)+E(85,29,4,18,c)+L('M76 53L89 59',cream,2):L('M24 59L16 62',black,5));
}
function hare(){return P('M32 68Q15 57 13 73L31 77Z','#a08c70')+E(48,65,26,17,'#a7967d')+E(75,51,13,12,'#a7967d')+E(67,27,4,22,'#b5a386')+E(80,25,4,23,'#b5a386')+P('M64 13L64 6L70 6L70 15M77 10L77 2L83 2L83 12Z',black)+P('M38 65Q18 83 32 89L53 86L56 77Z','#ae9b7c')+L('M69 63L76 83L92 84','#a7967d',5)+eye(81,49)+L('M85 56L99 54M85 58L97 62',ink,.8);}
function render(sp,id,sex=null){
 if(!targets.has(id))return null;
 // No configured dimorphism is removed. For unchanged sex anatomy retain its historical renderer.
 if(sex==='female'&&sp.origin==='oc3290'){
  if(sp.family==='Paradisaeidae')return wrap(id,bird({body:'#9b9471',wing:'#6e795d',head:'#96956d',belly:'#b4af8a',marks:L('M54 65L58 69M61 63L65 67','#7c7b61',1.2)}));
  if(sp.latin==='Nymphicus hollandicus')return wrap(id,bird({body:'#9ba39b',wing:'#73827a',head:'#a2a89a',belly:'#a9aea0',bill:'#9da48a',hook:true,long:true,crest:P('M65 34L64 12L73 30L79 18L79 35Z','#a7ae94'),marks:E(77,48,4,5,'#b29072')+L('M16 77L29 78M22 72L34 73',cream,1.4)}));
  if(sp.latin==='Ptilonorhynchus violaceus')return wrap(id,bird({body:'#8c9d6f',wing:'#6e885d',head:'#8d9f75',belly:'#b2b88c',marks:L('M54 61L58 66M63 61L67 66M53 70L58 73','#6b805d',1.7)}));
 }
 if(sex&&sex!=='male')return null;
 const l=sp.latin,cls=sp.taxonomy?.className;
 let body;if(l==='Lepus californicus')body=hare();else if(l==='Ursus maritimus')return root.ATLAS_MAMMAL_ART_V3194(sp,sp.color,'normal',null,id).replace(/(<svg[^>]*>)([\s\S]*)(<\/svg>)/,'$1<g transform="translate(3 3) scale(.94)">$2</g>$3');
 else if(l.startsWith('Aquila '))body=eagle(sp);
 else if(['Andrias','Lissotriton','Ichthyosaura','Salamandra','Salamandrella','Triturus','Schismaderma'].includes(l.split(' ')[0]))body=amphibian(sp);
 else if(['Phelsuma grandis','Python regius','Sanzinia madagascariensis'].includes(l))body=reptile(sp);
 else if(l==='Pagodroma nivea')body=seabird('snow');else if(l==='Pagophila eburnea')body=seabird('ivory');
 else if(l==='Somateria mollissima')body=bird({body:cream,wing:black,head:cream,belly:black,bill:'#a7af88',marks:P('M66 34L82 33L82 39L65 40Z',black)+L('M69 49L79 49','#9ba78b',4)});
 else if(sp.origin==='oc3290')body=sp.family&&['Aves'].includes(sp.taxonomy?.className)?oceanBird(sp):sp.kind==='raptor'||sp.artProfile==='eagle'?oceanBird(sp):oceanMammal(sp);
 else if(sp.origin==='marine3320'){if(cls==='Aves')body=marineBird(sp);else if(cls==='Cephalopoda')body=cephalopod(sp);else if(cls==='Actinopterygii')body=fish(sp);else if(['sea_lion','seal','elephant_seal'].includes(sp.kind))body=pinniped(sp);else body=whale(sp);}
 if(!body)throw Error('Missing GM07 art '+id);return wrap(id,body);
}
root.AtlasGM07Art=Object.freeze({render,targets:[...targets]});
})(globalThis);
