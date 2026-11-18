/* GM-07-M01: individually reviewed marsupials and monotremes.
 * Original, deterministic vector work. No state, random draws or external assets.
 * Six accepted 3.44 plates are deliberately returned to their original renderer. */
(function(root){'use strict';
const INK='#41483f',CREAM='#ddd5bf',NOSE='#62544b';
const path=(d,fill,stroke=INK,w=1.35)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const line=(d,c=INK,w=.8)=>path(d,'none',c,w);
const ellipse=(x,y,rx,ry,fill,stroke=INK,w=1.2)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
const eye=(x,y,r=1.2)=>circle(x,y,r,'#202d29')+circle(x-.3,y-.35,.32,'#faf4eb');
const tint=(c,n)=>'#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(c.slice(i,i+2),16)+n)).toString(16).padStart(2,'0')).join('');
const fur=(d,c,w=.65)=>`<g opacity=".72">${line(d,c,w)}</g>`;
const claws=(x,y,c=CREAM)=>line(`M${x} ${y}l-1 2m3-2-1 2m3-2-1 2`,c,.7);
const SCOPE=new Set(["na_esp_didelphis_marsupialis", "na_esp_didelphis_virginiana", "oc_esp_dactylopsila_trivirgata", "oc_esp_dasycercus_cristicauda", "oc_esp_dasyurus_viverrinus", "oc_esp_dendrolagus_goodfellowi", "oc_esp_dendrolagus_lumholtzi", "oc_esp_dendrolagus_matschiei", "oc_esp_macropus_fuliginosus", "oc_esp_macropus_giganteus", "oc_esp_macrotis_lagotis", "oc_esp_myrmecobius_fasciatus", "oc_esp_notamacropus_agilis", "oc_esp_notamacropus_eugenii", "oc_esp_notamacropus_rufogriseus", "oc_esp_ornithorhynchus_anatinus", "oc_esp_osphranter_rufus", "oc_esp_petauroides_volans", "oc_esp_petaurus_breviceps", "oc_esp_petrogale_mareeba", "oc_esp_phalanger_orientalis", "oc_esp_phascolarctos_cinereus", "oc_esp_sarcophilus_harrisii", "oc_esp_setonix_brachyurus", "oc_esp_spilocuscus_maculatus", "oc_esp_tachyglossus_aculeatus", "oc_esp_thylogale_billardierii", "oc_esp_trichosurus_vulpecula", "oc_esp_vombatus_ursinus", "oc_esp_wallabia_bicolor", "oc_esp_zaglossus_bartoni", "gm06_dromiciops_gliroides"]);
const retained=new Set(['Didelphis marsupialis','Didelphis virginiana','Dromiciops gliroides','Phascolarctos cinereus','Vombatus ursinus','Ornithorhynchus anatinus']);
const wrap=(sp,id,body)=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" data-m01-species="${id}" data-m01-family="${sp.family}"><g stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;

// Ground macropods: the long lower leg, powerful haunch and balancing tail are
// structural elements. Ear, muzzle, coat and body proportions vary by species.
function groundMacropod(sp){
 const l=sp.latin,red=l==='Osphranter rufus',east=l==='Macropus giganteus',west=l==='Macropus fuliginosus',agile=l==='Notamacropus agilis',tammar=l==='Notamacropus eugenii',bennett=l==='Notamacropus rufogriseus',rock=l==='Petrogale mareeba',swamp=l==='Wallabia bicolor';
 const c=red?'#ab8369':east?'#94988c':west?'#8c8170':agile?'#b4a080':bennett?'#9c9588':swamp?'#646359':rock?'#a3947e':'#928779',dark=tint(c,-28),light=tint(c,24),ear=tammar||rock?17:11;
 let s=path(rock?'M40 69Q28 78 9 84L4 88Q17 91 32 84L50 77Z':'M41 68Q29 80 5 88Q15 92 37 82L51 75Z',dark);
 s+=path('M48 66Q61 64 61 76L55 83L70 88Q76 91 72 93L51 91Q46 89 48 84L52 77L43 72Z',dark);
 s+=path(swamp?'M37 73Q29 53 42 41Q49 35 55 35L62 45L66 61Q67 75 56 80Q42 84 37 73Z':'M38 73Q29 53 42 40Q48 34 55 34L62 44L65 60Q68 73 57 80Q45 85 38 73Z',c);
 s+=path('M51 43Q49 54 61 62L61 71Q55 80 48 77Q41 71 43 62Z',swamp?'#9b876c':CREAM,'none');
 s+=path('M38 53Q39 43 49 40L46 48Q41 53 42 64L39 67Z',light,'none');
 s+=path('M44 61Q54 57 61 65Q68 73 58 80L50 86L72 88Q79 88 80 91Q77 95 68 94L45 92Q41 91 43 86L50 76Q39 72 44 61Z',c);
 s+=line('M47 66Q54 62 58 68M50 77L46 85M58 90L73 91',dark,1.05)+claws(71,91,INK);
 s+=path('M55 40Q56 31 62 27Q67 24 71 29L73 43L63 52L57 49Z',c);
 s+=path(`M62 30Q57 22 59 ${ear}Q61 ${ear-5} 64 ${ear+1}L67 28Z`,c)+path(`M70 29L72 ${ear+1}Q74 ${ear-3} 76 ${ear+1}Q80 18 76 34Z`,c);
 s+=line(`M62 26L61 ${ear+3}M73 27L74 ${ear+5}`,'#b6a194',1.4);
 s+=path('M62 32Q69 25 77 29Q81 32 83 35L92 37Q96 39 92 43L81 46Q69 47 64 42Z',c);
 s+=path(west?'M78 34L92 37L94 40L89 44L80 43Z':'M81 36L92 38L93 41L84 43L78 42Z',west?'#5b5e51':tint(c,-12),'none');
 s+=path('M66 43Q76 48 85 43L83 47L72 49L65 47Z',swamp?'#b6a183':CREAM,'none');
 s+=ellipse(92,39,2.3,1.6,INK,'none')+eye(79,34,1.05)+line('M85 43L91 42',dark,.75);
 s+=path('M62 48Q62 56 69 61L76 63Q79 65 76 67L69 67Q60 63 58 55L58 50Z',dark)+path('M62 50Q64 57 69 60L72 61L71 64L66 62Q60 58 60 52Z',c)+claws(73,65,light);
 if(red)s+=path('M69 36L80 38L83 42L73 41Z',CREAM,'none')+line('M71 33L75 34',dark,.9);
 if(east)s+=line('M69 31L74 30',light,1)+fur('M40 49l1-3m-2 9 1-3M52 68l3 3',tint(c,-16));
 if(west)s+=fur('M39 51l2-4m-2 10 2-4M48 69l3 2M67 34l3-1',tint(c,-15));
 if(agile)s+=line('M66 37L75 40',CREAM,1.8)+path('M66 12L64 14L64 19L62 18L62 11Z',INK,'none')+line('M43 53Q48 48 52 48',CREAM,2);
 if(bennett)s+=path('M44 40Q51 35 56 36L62 47L54 53L46 48Z','#a27b61','none')+path('M68 90L77 91L78 93L68 93Z',dark,'none');
 if(rock)s+=path('M4 88L12 83L20 85L18 89L8 91Z','#5b5c50')+line('M67 31L75 31',CREAM,1.5)+line('M66 39L75 41',CREAM,1.7);
 if(swamp)s+=path('M64 41L73 43L79 43L75 48L68 48Z','#b59b76','none');
 s+=fur('M39 57l1-3m1 10 1-3m0 9 2-3M52 37l1 3M50 69l3 2M56 31l2 1',dark);
 return s;
}

function smallMacropod(sp){
 const quokka=sp.latin==='Setonix brachyurus',c=quokka?'#93836c':'#8d8172',dark=tint(c,-24),light=tint(c,24);
 let s=path(quokka?'M35 71Q20 75 12 85L16 87Q25 79 40 78Z':'M36 72Q21 76 8 84Q8 89 14 88L43 80Z',dark);
 s+=path('M42 69Q58 66 60 79L54 86L69 89Q74 92 68 94L46 91L45 83Z',dark);
 s+=path(quokka?'M30 65Q26 41 43 35Q65 27 73 49L72 72Q67 84 49 84Q33 83 30 65Z':'M27 67Q24 42 45 37Q65 31 73 52L73 74Q63 86 44 82Q30 80 27 67Z',c);
 s+=path('M59 47Q67 53 69 66L66 77Q56 84 47 78L49 65Z',quokka?light:'#a18a70','none');
 s+=path('M38 68Q50 62 58 72Q63 80 51 86L65 89Q70 92 64 94L42 91Q38 87 44 81L47 77L38 76Z',c)+line('M43 73Q52 69 55 75',dark,1)+claws(60,91,INK);
 s+=path(quokka?'M59 51Q55 45 59 35Q64 27 76 31L85 39L86 49L80 57L68 58Z':'M59 52Q55 39 65 34L77 35Q83 39 87 47L88 53L77 59L65 57Z',c);
 s+=ellipse(61,31,4.8,7,light)+ellipse(77,31,4.3,6.5,c)+ellipse(61,31,2.6,4.8,'#aa9584','none')+ellipse(77,31,2.3,4.4,'#aa9584','none');
 s+=path('M76 46Q85 44 90 49L88 54Q80 59 73 54L72 51Z',light)+ellipse(88,49,2.5,1.8,INK,'none')+eye(76,42,1.25)+line('M81 55Q85 56 87 53',dark,.75);
 s+=path('M65 58Q65 64 72 67L76 67L78 71L73 73Q65 70 60 65L60 59Z',dark)+claws(74,70,light);
 s+=fur('M32 54l2-4m-1 11 2-4m0 10 2-4M41 40l3-2m1 7 3-2M45 60l2-3M65 40l2-2',dark);
 return s;
}

function treeKangaroo(sp){
 const good=sp.latin==='Dendrolagus goodfellowi',lum=sp.latin==='Dendrolagus lumholtzi',c=good?'#a57650':lum?'#8e8575':'#9b6d49',dark=tint(c,-27),gold=lum?'#b9b09a':'#d0ae70';
 let s=line('M13 88L91 78','#716a52',4.4)+line('M15 87L89 77','#a19676',1);
 s+=path('M42 63Q26 54 22 66Q17 83 8 91Q8 96 13 94Q28 86 31 72Q33 67 44 74Z',gold);
 if(good)s+=line('M16 85L22 86M22 75L28 77',dark,2.1);
 s+=path('M58 64Q71 61 73 72L75 80L84 80L84 84L70 86L65 77L61 74Z',gold)+claws(77,82,INK);
 s+=path('M34 65Q27 50 39 40Q48 33 59 37Q69 38 70 51L65 68Q59 80 44 79Q34 77 34 65Z',c);
 s+=path('M49 42Q60 39 65 47L64 67Q59 74 52 75L45 70Z',gold,'none');
 s+=path('M37 52Q40 41 51 40L48 44L43 46L40 57Z',tint(c,18),'none');
 s+=path('M39 64Q50 58 57 67Q62 75 52 81L59 82L62 85Q57 89 43 87L39 82L44 75L38 72Z',c)+line('M43 68Q50 63 54 69',dark,1)+claws(53,85,INK);
 s+=path('M56 44Q57 30 66 28Q77 26 81 36L88 43L91 49L86 55Q75 60 64 53Z',c);
 s+=ellipse(64,28,5.5,6.7,gold)+ellipse(64,28,3.1,4.5,dark,'none');
 s+=path(lum?'M62 32Q70 28 77 35L88 45L87 50L79 53L65 45Z':'M65 34Q71 30 77 35L86 44L83 49L74 47L67 42Z',lum?'#514f44':gold,'none');
 s+=path('M78 44Q87 43 93 48L91 52L82 54L77 50Z',lum?'#5f5c4e':gold)+ellipse(91,48,2,1.6,INK,'none')+eye(78,39,1.2)+line('M84 52L89 51',dark,.75);
 s+=path('M65 50Q71 51 73 59L76 73Q79 77 84 77L86 81L80 84Q73 83 71 78L66 67L60 58Z',gold)+path('M62 55Q67 57 69 63L71 75L68 79L63 77L61 65L57 60Z',dark)+claws(79,80,INK)+line('M81 81q-3 1-4 4',INK,.7);
 if(good)s+=line('M35 48Q39 40 47 39M38 53Q43 44 50 43',gold,1.7);
 s+=fur('M35 55l2-3m-1 10 2-3M43 43l2-2M47 67l2 2M57 38l2 2M68 60l1 4',dark);
 return s;
}

function greaterGlider(){
 const c='#7e8077',dark='#585e56',light='#c5c4b3';
 let s=line('M37 88L90 76','#716b56',3.8)+line('M37 87L90 75','#a3977a',.8);
 // Long, heavily furred rudder tail. It does not curl around the support.
 s+=path('M43 61Q28 61 27 72Q24 83 13 86L8 88L11 90L7 93L12 94L10 96Q32 95 37 81Q43 73 48 73Z',dark);
 s+=path('M38 70Q31 82 17 91L13 92Q29 91 35 80L42 71Z',c,'none')+fur('M31 76l-1 5m-4 2-3 3m10-15-1 4m-9 13-5 3',light,.75);
 s+=path('M37 61Q32 43 48 36Q64 29 74 44L77 66Q74 81 59 84Q42 85 37 72L35 69L38 67L35 64Z',c);
 s+=path('M61 43Q74 43 73 61L71 76Q65 83 56 80L52 73L56 61Z',light,'none');
 s+=path('M46 49Q49 61 60 68L53 79Q43 77 40 67L40 60Z',dark)+path('M44 53Q48 63 55 68L51 73L45 68Z',tint(c,10),'none');
 s+=path('M48 71Q55 68 60 75L59 80L67 81L68 85L57 88L50 85L47 80Z',dark)+claws(60,84,light);
 // Furry, rounded ears and a short, pale face distinguish Petauroides.
 s+=path('M48 41Q39 37 41 26L43 25L42 22L46 21L47 18Q57 18 60 29L58 39Z',c)+path('M67 32Q63 21 70 17L73 18L75 16L78 19L81 19Q87 28 79 40Z',c);
 s+=path('M46 34Q42 25 48 23Q55 21 56 31L53 36Z',light,'none')+path('M71 29Q69 21 75 21Q82 25 77 33Z',light,'none');
 s+=path('M49 39Q57 31 69 34Q81 37 82 47L77 55Q66 60 55 53L50 49L48 46L51 44Z',c);
 s+=path('M55 39Q61 42 65 39L68 36L74 40L79 46L76 52L64 55L55 51Z',CREAM,'none');
 s+=ellipse(58,42,2.1,2.6,dark,'none')+ellipse(73,42,2.5,2.9,dark,'none')+eye(58,42,1.45)+eye(73,42,1.8)+ellipse(69,48,2.3,1.6,INK,'none')+line('M69 50L69 52M66 53L71 52M53 49L58 50M76 50L81 48',dark,.6);
 s+=path('M73 59Q78 61 77 69L79 76L85 77L87 81L82 84L75 81Q71 75 71 67Z',c)+claws(81,80,CREAM);
 s+=fur('M39 52l3-3m-3 9 3-3m-2 9 3-3M50 37l2-2M57 35l2-1M42 28l2 2M75 19l2 3M55 63l2 3M65 66l1 4M57 76l2 2',light);
 return s;
}

function sugarGlider(){
 const c='#a0a49a',dark='#626a60',light='#d7d5bf';
 let s=line('M19 82L91 70','#716b56',3.2);
 s+=path('M38 58Q24 53 18 65Q13 78 6 82L6 87Q22 87 26 73Q29 65 41 67Z',c)+path('M6 82L14 78L13 85L7 88Z',dark,'none');
 s+=path('M31 57Q34 42 53 41Q68 40 76 52L79 63Q72 74 54 74Q36 73 31 57Z',c);
 s+=path('M41 57Q52 53 65 58L70 68Q55 75 39 66Z',light,'none');
 // Folded wrist-to-ankle membrane, finer than the greater glider's shaggy fold.
 s+=path('M39 53Q44 60 55 65L46 73L35 67Z','#878e81')+path('M44 62Q50 61 54 65L47 70L41 68Z',c,'none');
 s+=path('M44 66L48 72L45 78L52 79L52 82L44 84L39 80L40 75L37 70Z',dark)+claws(46,80,CREAM);
 s+=path('M63 48Q61 38 66 32Q71 27 76 35L76 43L82 49L81 58L70 61L63 56Z',c)+path('M66 37Q58 29 62 23Q65 20 69 25L72 37Z',c)+path('M75 35Q72 22 79 22Q86 24 83 34L80 40Z',c);
 s+=path('M64 28L67 27L69 34L67 35Z','#b5a49b','none')+path('M77 26Q82 24 80 32L77 35Z','#b5a49b','none');
 s+=path('M67 40Q75 36 80 43L89 51L89 56L79 61L68 56Z',light)+path('M69 41L74 40L82 50L79 53L73 46Z',dark,'none')+eye(78,46,1.65)+ellipse(89,53,1.9,1.4,'#ac8d80','none');
 s+=line('M68 38L67 45Q59 43 48 46L39 49',dark,2.3)+line('M81 58L87 57',INK,.6);
 s+=path('M70 61L74 69L81 72L82 75L77 78L71 74L66 66Z',c)+claws(77,75,CREAM)+fur('M34 54l3-2m1 7 3-2M49 45l3-1M50 69l3 1M25 66l-2 5',light);
 return s;
}

function arborealPossum(sp){
 const spotted=sp.latin==='Spilocuscus maculatus',brush=sp.latin==='Trichosurus vulpecula',striped=sp.latin==='Dactylopsila trivirgata',c=spotted?'#d4cbb5':brush?'#96978b':striped?'#ded7c4':'#a6a18c',dark=spotted?'#89785c':brush?'#60675c':striped?'#444c42':'#7e806e',light=tint(c,18);
 let s=line('M12 87L93 74','#756d57',3.6);
 if(brush)s+=path('M39 59Q20 48 13 63Q6 77 16 88L20 91L20 87L24 89L24 84Q16 76 22 67Q26 64 42 70Z',dark)+fur('M14 67l-1 5m2 5 3 4m-4-5 2 4',c,.9);
 else if(striped)s+=path('M37 61Q18 48 13 62Q7 77 17 85Q25 89 30 82L29 78Q19 83 18 73Q14 65 28 65L42 72Z',dark)+path('M14 76Q17 85 27 80L28 83Q17 91 11 81Z',CREAM,'none');
 else s+=path('M38 62Q23 53 17 65L15 75Q16 83 23 80Q27 78 23 74L24 71Q31 76 27 83Q22 91 14 85Q7 81 10 69Q13 57 27 58L43 64Z','#baaa93');
 s+=path('M29 58Q25 44 40 36Q58 26 73 43L77 61Q77 77 60 80Q41 85 31 71L28 68L31 65L28 62Z',c);
 s+=path('M56 41Q70 40 71 58L70 71Q62 80 50 75L46 68L50 56Z',brush?'#c6c3ab':light,'none');
 s+=path('M35 45Q41 35 54 35L48 42L40 47L35 56Z',light,'none');
 s+=path('M40 68Q48 62 55 70Q58 75 49 81L53 83L53 86L43 89L37 86L40 80L43 76L38 73Z',dark)+claws(46,85,CREAM);
 s+=path('M66 59Q73 61 72 69L77 74L82 74L84 77L81 81L74 81L68 76L64 68Z',c)+claws(78,78,INK)+line('M75 81L73 83',INK,.7);
 if(brush){s+=path('M62 40Q57 32 62 23Q65 18 69 22L72 36Z',c)+path('M73 36L74 20Q77 16 81 21Q86 26 80 39Z',c)+path('M63 26L66 24L69 34L66 35Z','#b6a79a','none')+path('M77 23Q82 24 78 34L76 35Z','#b6a79a','none');}
 else s+=ellipse(65,34,spotted?2.8:4.5,spotted?3.2:5,c)+ellipse(79,33,spotted?2.5:4,spotted?2.8:4.5,c);
 s+=path(spotted?'M59 42Q63 33 75 36Q85 40 88 49L85 57Q75 63 65 57L60 51Z':'M61 42Q67 33 77 38L90 49L91 54L84 59Q73 61 64 54Z',c);
 s+=path(spotted?'M66 40Q74 36 81 43L86 49L83 55Q74 59 67 54Z':'M70 43L79 41L90 50L89 55L82 58L71 53Z',light,'none');
 if(spotted){s+=ellipse(78,44,2.4,2.8,'#bb9c60','none')+eye(78,44,1.25);}
 else s+=eye(79,44,1.45);
 s+=ellipse(spotted?86:90,spotted?50:52,1.8,1.35,'#af8d80','none')+line('M82 56L87 55',dark,.7);
 if(spotted)s+=path('M33 43Q38 38 42 42Q46 44 43 48Q41 53 37 50Q31 51 33 43Z',dark,'none')+path('M46 36Q52 34 56 39Q58 45 52 46Q46 48 44 42Q42 39 46 36Z',dark,'none')+path('M31 56Q36 51 42 57Q46 63 40 64Q32 69 30 61Q29 58 31 56Z',dark,'none')+path('M47 51Q54 47 58 53Q62 57 56 61Q47 64 46 57Q44 54 47 51Z',dark,'none')+path('M43 65Q48 61 51 67Q52 73 47 74Q40 75 42 70Q40 67 43 65Z',dark,'none');
 if(striped)s+=line('M32 47Q43 31 61 42M31 56Q47 40 62 49M35 67Q48 51 62 57',dark,3.7)+path('M67 39L73 38L83 48L81 52L72 47Z',dark,'none')+eye(79,44,1.35)+line('M81 78L89 77',INK,1); // elongated fourth finger
 if(!spotted&&!striped&&!brush)s+=line('M36 43Q45 34 57 38',dark,1.3);
 s+=fur('M32 48l3-3m-4 11 3-3m-1 10 3-3M42 39l3-1M55 69l2 2M64 45l2-2',tint(c,-20));
 return s;
}

function carnivore(sp){
 const devil=sp.latin==='Sarcophilus harrisii',quoll=sp.latin==='Dasyurus viverrinus',c=devil?'#454b43':quoll?'#8c785e':'#b59b78',dark=tint(c,-23),light=devil?'#6b7065':tint(c,25);
 let s=path(devil?'M32 59Q17 59 10 72Q5 80 4 86Q11 88 18 78Q22 71 36 70Z':quoll?'M32 59Q16 54 10 66Q7 72 3 76L4 80Q13 81 17 72Q20 66 35 68Z':'M31 65Q18 61 11 68L5 74Q5 78 10 77L22 72L34 72Z',dark);
 if(!devil&&!quoll)s+=path('M5 74L7 68L10 70L12 65L15 68L18 64L20 68L21 73L11 78L6 78Z','#3f4840');
 s+=path('M31 62L28 75L23 82L25 86L35 86L39 80L44 66Z',dark)+path('M62 64L65 79L70 83L79 83L81 79L75 75L75 64Z',dark);
 s+=path(devil?'M22 56Q20 38 44 35Q66 31 77 46L83 60Q78 75 55 77Q32 78 24 67Z':quoll?'M24 57Q29 41 51 41Q68 40 79 53L81 64Q71 74 50 74Q30 75 24 64Z':'M24 61Q23 46 41 43Q61 38 75 52L78 65Q69 75 49 75Q29 76 24 65Z',c);
 s+=path(devil?'M27 49Q36 37 51 39L46 43L35 48L29 59Z':'M29 53Q39 44 55 45L51 48L38 51L31 59Z',light,'none');
 s+=path('M36 66Q46 67 46 74L41 80L39 85L28 88L24 85L28 81L31 75L30 69Z',c)+claws(29,85,light);
 s+=path('M65 60Q73 58 76 65L76 76L82 81Q83 86 76 87L69 84L67 77L64 69Z',c)+claws(75,84,light);
 s+=path(devil?'M64 44Q64 32 74 31L83 37L90 46L94 52L92 63Q84 70 71 63L65 55Z':'M64 48Q65 37 74 38Q82 40 86 48L94 54L97 59L94 63L82 63L69 57Z',c);
 s+=ellipse(devil?70:70,devil?31:38,devil?5.2:4.8,devil?6.2:5.4,c)+ellipse(devil?70:70,devil?31:38,devil?3.3:2.6,devil?4.2:3.5,'#ab8b7b','none');
 s+=path(devil?'M78 49Q86 45 93 51L95 58L91 63L79 62L75 56Z':'M79 51Q88 51 97 57L96 61L87 64L77 58Z',devil?'#666b5e':light)+ellipse(devil?93:96,devil?54:58,devil?3:1.8,devil?2:1.4,devil?INK:NOSE,'none')+eye(devil?81:80,devil?44:49,devil?1.2:1.35)+line(devil?'M83 62L91 61':'M85 62L94 61',dark,.7);
 if(devil)s+=path('M65 46Q68 55 77 57L74 64Q63 61 60 51L58 47Z',CREAM,'none')+fur('M31 51l3-3m0 9 3-3M44 41l4-1M54 66l4 2M68 38l2 2',light);
 if(quoll){for(const [x,y,r]of [[32,52,1.5],[38,47,1.4],[45,50,1.65],[53,47,1.4],[60,51,1.5],[67,54,1.3],[30,61,1.35],[38,59,1.6],[46,64,1.35],[52,57,1.4],[58,66,1.4],[65,62,1.45],[73,47,1.15]])s+=ellipse(x,y,r,r*1.15,'#e3dcc8','none');s+=path('M42 70Q55 72 65 67L65 71Q50 78 40 74Z',light,'none');}
 if(!devil&&!quoll)s+=path('M34 70Q50 74 65 68L66 73Q51 79 36 76Z',CREAM,'none')+fur('M27 55l2-3m4 8 2-3M43 46l3-1M52 51l3-1M58 61l2 2',dark);
 s+=line(devil?'M89 57L98 55M90 59L98 61':'M90 58L98 56M90 60L98 63',tint(c,20),.55);
 return s;
}

function bilby(){
 const c='#969d98',dark='#68766d',light='#d6d2bf';
 let s=path('M34 68Q20 67 9 82L5 86Q6 90 12 87Q24 77 40 77Z',dark)+path('M18 76L11 83L7 87L10 89L23 79Z','#414c44','none')+path('M7 85L4 89L5 92L10 92L16 87L13 84Z',CREAM);
 s+=path('M31 66Q25 45 44 39Q59 33 70 46L78 63Q73 78 54 80Q36 83 31 66Z',c)+path('M47 44Q64 42 70 57L69 70Q60 79 49 76L42 67Z',light,'none');
 s+=path('M39 65Q51 59 57 68Q63 76 50 82L63 87Q68 90 63 93L44 89L37 83L43 76L38 72Z',c)+line('M42 67Q49 63 53 69',dark,1)+claws(57,89,INK);
 s+=path('M63 47Q55 28 62 12Q66 7 69 14L71 37L76 16Q80 8 83 14Q86 27 77 49Z',c)+path('M63 18Q60 28 65 40L67 40L66 19Z','#b99c92','none')+path('M79 18Q82 18 79 34L75 41L74 37Z','#b99c92','none');
 s+=path('M64 46Q73 37 81 45L88 53L96 62L95 66Q84 66 75 59L66 57Z',c)+path('M76 50L86 54L96 62L94 65L84 61L74 55Z',light,'none')+eye(79,47,1.2)+ellipse(95,63,1.7,1.2,'#a68b7d','none')+line('M86 63L94 65',dark,.6);
 s+=path('M66 62L70 72L77 76L76 80L71 81L66 77L61 68Z',dark)+claws(72,78,CREAM)+fur('M34 52l3-4m-3 11 3-3M46 42l3-1M51 68l2 2M67 45l2-2M30 66l2 3',tint(c,-19));
 return s;
}

function numbat(){
 const c='#a38464',dark='#716954',light='#c0ae8a';
 let s=path('M32 64Q15 60 9 43L7 36L5 40L4 38Q2 56 12 67Q19 75 36 73Z',dark)+fur('M7 45l3 6m0 3 3 5m-5-6 3 6M14 65l4 3',light,.85);
 s+=path('M28 61Q31 45 49 44Q67 41 79 54L80 65Q69 77 46 76Q31 76 28 66Z',c)+path('M29 61Q32 49 45 47L57 48L56 71L41 74L31 69Z','#8b8a7a','none');
 for(const [x,y]of [[32,54],[37,51],[42,49],[47,48],[52,48]])s+=line(`M${x} ${y}q3 7 2 17`,CREAM,1.8);
 s+=path('M37 68L36 78L31 83L33 86L41 85L44 78L46 70Z',dark)+path('M64 66L66 77L72 82L78 82L80 79L73 75L73 65Z',dark)+claws(35,84,light)+claws(74,80,light);
 s+=path('M65 50Q66 39 75 40L80 45L89 52L97 57L98 61L94 63L82 59L69 57Z',c)+ellipse(72,38,4,5,c)+ellipse(72,38,2.3,3.2,dark,'none');
 s+=path('M72 46L80 48L93 55L94 58L81 54L72 51Z','#454d40','none')+line('M74 44L82 47',light,1.1)+eye(80,48,1.1)+ellipse(97,59,1.5,1.1,INK,'none')+line('M88 59L96 62',dark,.6)+fur('M55 47l3-1M60 53l3 1M57 63l3 1M67 43l2-1',dark);
 return s;
}

function echidna(sp){
 const long=sp.latin==='Zaglossus bartoni',c=long?'#625f52':'#85745a',dark=tint(c,-23),spine='#c5b594';
 let s=path('M24 67L20 80L23 85L30 84L34 72M57 66L57 81L63 85L69 83L68 70Z',dark);
 s+=path(long?'M16 68Q12 48 28 36Q45 22 62 36Q73 44 76 61L77 71Q60 82 30 79L18 74Z':'M14 69Q11 45 34 35Q57 25 71 47L79 65L75 75Q49 85 22 78Z',c);
 s+=path('M24 59Q20 46 36 39Q53 32 64 43L65 48Q41 40 28 61Z',tint(c,12),'none');
 // Staggered spines follow the body dome. The long-beaked species has much
 // more visible dark wool and a less dense exposed spine pattern.
 const spines=long?[[19,58,-5,-7],[25,49,-4,-8],[33,43,-3,-9],[43,40,-2,-9],[53,43,-2,-8],[62,49,-1,-7],[27,60,-5,-7],[38,52,-4,-8],[49,55,-2,-9],[60,61,-1,-8],[31,69,-4,-6],[44,65,-3,-8],[55,70,-2,-7]]:[[17,65,-8,-9],[20,56,-8,-11],[25,49,-7,-12],[32,43,-5,-12],[40,40,-3,-13],[49,41,-2,-13],[58,45,-1,-12],[66,53,-1,-12],[24,66,-8,-11],[30,58,-7,-12],[39,53,-5,-13],[48,52,-3,-14],[57,57,-2,-13],[64,65,-1,-12],[31,72,-8,-10],[39,66,-6,-12],[48,67,-4,-13],[57,72,-2,-12],[22,75,-7,-8]];
 for(const [x,y,dx,dy]of spines){const d=`M${x} ${y}Q${x+dx/2} ${y+dy/2} ${x+dx} ${y+dy}`;s+=line(d,INK,1.6)+line(d,spine,1)+line(`M${x+1.8} ${y-1}L${x+dx+2} ${y+dy+3}`,CREAM,.55);}
 s+=path(long?'M65 59Q68 48 76 54Q82 59 86 70Q88 77 97 82L96 85Q83 82 79 71L74 65L66 68Z':'M67 59Q74 50 81 58L87 66L98 69L98 72L82 70L74 67L68 69Z',c)+eye(long?77:78,long?59:61,1)+circle(long?96.5:97,long?83.5:70.5,.75,INK);
 s+=path('M30 69Q34 72 32 80L30 87L22 88L19 84L24 80L24 74Z',c)+path(long?'M61 70Q66 70 67 79L68 87L78 87L80 89L75 92L65 91L60 86L58 77Z':'M59 69L67 71L69 80L76 83L76 86L64 88L59 84L57 76Z',c);
 s+=line('M22 85l-2 4m5-4-1 5m4-5-1 5M67 85l-1 4m4-4 0 4m3-4 1 3',CREAM,.9)+fur('M20 63l2-3m10 1 2-3M37 73l2-3m7 6 1-4m8 0 1-3M62 52l2 2',long?'#a79d83':'#b2a180',.8);
 return s;
}

function render(sp,id){
 if(!SCOPE.has(id)||retained.has(sp.latin))return null;
 const l=sp.latin;let body;
 if(l.startsWith('Dendrolagus '))body=treeKangaroo(sp);
 else if(l==='Setonix brachyurus'||l==='Thylogale billardierii')body=smallMacropod(sp);
 else if(sp.family==='Macropodidae')body=groundMacropod(sp);
 else if(l==='Petauroides volans')body=greaterGlider();
 else if(l==='Petaurus breviceps')body=sugarGlider();
 else if(['Phalanger orientalis','Spilocuscus maculatus','Trichosurus vulpecula','Dactylopsila trivirgata'].includes(l))body=arborealPossum(sp);
 else if(['Sarcophilus harrisii','Dasyurus viverrinus','Dasycercus cristicauda'].includes(l))body=carnivore(sp);
 else if(l==='Macrotis lagotis')body=bilby();
 else if(l==='Myrmecobius fasciatus')body=numbat();
 else if(l==='Tachyglossus aculeatus'||l==='Zaglossus bartoni')body=echidna(sp);
 if(!body)throw Error('Missing M01 profile: '+id);
 return wrap(sp,id,body);
}
root.AtlasM01Art=Object.freeze({render,has:id=>SCOPE.has(id),ids:[...SCOPE]});
})(typeof globalThis!=='undefined'?globalThis:this);
