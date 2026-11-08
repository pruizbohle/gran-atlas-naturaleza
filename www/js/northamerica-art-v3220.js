/* North American profiles. Local SVG, taxonomy-driven anatomy, no game state or network.
 * Existing species never enter this router. Shared anatomy is refined by genus/species.
 */
(function(root){
'use strict';
function render(sp,color,skin='normal',sex=null){
 if(!sp||sp.origin!=='na3220')return null;
 const polished=root.ATLAS_NORTH_POLISH_V3221?.(sp,color,skin,sex);if(polished)return polished;
 const latin=sp.latin,g=latin.split(' ')[0],family=sp.family,female=sex==='female';
 // Existing family engines supply continuous anatomy where the real taxon is already supported.
 const mammal=root.ATLAS_MAMMAL_ART_V3194;
 if(sp.taxonomy.className==='Mammalia'&&mammal?.classify(sp)){
  const svg=mammal(sp,color||sp.color,skin,sex);
  if(svg)return svg.replace('<svg ',`<svg data-na-version="3.22.0" data-na-profile="${sp.artProfile}" data-zoological-family="${sp.family}" `);
 }
 let base=color||sp.color,cream='#e6dfc6',dark='#536352',accent='#b59a68',ink='#384d42';
 const paint={
 'Panthera onca':['#bea373','#eee0bc','#5b5c46','#a17d54'],'Leopardus pardalis':['#b9a17b','#e8dec5','#555b48','#826c4d'],'Leopardus wiedii':['#ac9778','#e8dec7','#4d5849','#8e7658'],'Herpailurus yagouaroundi':['#898879','#d0cbb6','#586257','#9d8d70'],'Lynx canadensis':['#a4a89b','#e2e1cc','#657467','#8e927b'],'Lynx rufus':['#b09c7c','#e5ddc3','#62644f','#8f795e'],
 'Canis latrans':['#aaa18a','#e4dfc8','#697363','#b5a080'],'Urocyon cinereoargenteus':['#939b8f','#dedbc3','#4d5a50','#b08b6c'],'Vulpes macrotis':['#bfaf8e','#ece3c9','#7f806c','#a48c6a'],
 'Aix sponsa':female?['#a4a18a','#e2dfc7','#6a786a','#94866f']:['#879c78','#e4dfc6','#496f60','#a17a6d'],
 'Anas platyrhynchos':female?['#a49b81','#ded7bc','#756f58','#bba780']:['#a8ad98','#dddcc6','#4c7a66','#a28b6c'],
 'Ara macao':['#b76f60','#dfc677','#4c7591','#7b9f71'],'Ara militaris':['#85a374','#d7c48c','#56788d','#aa7264'],
 'Cardinalis cardinalis':female?['#b5a78d','#ded3b5','#89745e','#b97868']:['#b96e60','#d4ad86','#625c4b','#a85e53'],
 'Bison bison':['#7a7561','#b9aa85','#4d594d','#8a7c60'],'Oreamnos americanus':['#e0e0cf','#eee8d5','#657268','#c1c5b2'],'Ovis canadensis':['#9d8d74','#dcd6b9','#5e6555','#b6a585'],
 'Alouatta pigra':['#424e45','#9b9e88','#2f4339','#74785d'],'Alouatta palliata':['#535a48','#b3a277','#35493b','#8e8864'],'Cebus imitator':['#6d6e56','#e1d9b9','#3d5141','#b7ac82'],
 'Agalychnis callidryas':['#8fac6b','#e4dbbd','#4f7652','#c5875a'],'Hyalinobatrachium fleischmanni':['#a4b98d','#eee7ce','#6e9272','#d4d9aa'],
 'Ambystoma mexicanum':['#929b7d','#c1c5a6','#5e725c','#a58578'],'Heloderma suspectum':['#465448','#c6a38c','#34483c','#ba947b'],
 'Perca flavescens':['#b4b07a','#e2d7b1','#5a795d','#c1a078'],'Esox lucius':['#879c7d','#dedac1','#55765e','#b9bd8a'],'Salvelinus fontinalis':['#8b9e8a','#dedfc5','#576e62','#bd9390']
 }[latin];if(paint)[base,cream,dark,accent]=paint;
 const p=(d,fill=base,w=2.1,stroke=ink)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const l=(d,c=dark,w=1.4)=>p(d,'none',w,c),e=(x,y,rx,ry,c=base,w=1.7)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${ink}" stroke-width="${w}"/>`,dot=(x,y,r,c=dark)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
 const eye=(x,y,r=1.55)=>`<g data-na-eye="true">${dot(x,y,r,'#293e35')}${dot(x+.45,y-.45,.43,'#f7f1db')}</g>`;
 const dots=(coords,c=dark,r=1.1)=>coords.map(([x,y])=>dot(x,y,r,c)).join('');
 const feet=(pairs,c=dark)=>pairs.map(([x,y])=>l(`M${x} ${y}l-3 5m3-5 3 5m-3-5 6 1`,c,1.4)).join('');
 let art='',morph=sp.artProfile;
 if(sp.taxonomy.className==='Mammalia'){
  if(family==='Felidae'||family==='Canidae'){
   const cat=family==='Felidae',lynx=g==='Lynx',jaguar=g==='Panthera',smallfox=g==='Vulpes',grayfox=g==='Urocyon';
   art+=p(lynx?'M28 56Q33 42 48 44L67 42Q76 36 82 45L85 57Q80 65 69 64L65 79L60 80L58 64L43 66L35 80L29 80L31 65Q24 63 28 56Z':jaguar?'M24 56Q25 40 46 42Q59 39 69 46L78 41L84 50L83 61L74 65L72 80L65 81L62 65L40 67L35 81L28 81L29 65Q22 64 24 56Z':'M23 57Q25 45 44 46Q57 40 70 46L78 40L84 47L81 60L72 65L68 80L63 80L61 64L40 67L34 80L28 80L29 65Q20 64 23 57Z');
   art+=lynx?p('M29 58Q18 61 18 69L25 71L31 65Z',dark):p(cat?'M27 59Q8 53 10 69Q12 81 23 73Q14 75 16 66Q18 62 29 65Z':'M28 57Q13 54 7 69Q18 80 34 64Z',grayfox?dark:base);
   art+=p(cat?'M66 47Q67 35 76 34Q87 33 88 44L94 50Q92 57 82 56L75 60L67 54Z':'M67 47Q70 34 78 34Q86 35 87 43L98 49L96 53L84 55L77 59L69 54Z');
   const ear=lynx?'M68 37L69 24L76 35M80 34L86 24L87 41':smallfox?'M68 38L66 17Q78 21 78 36M80 36Q84 14 89 21L89 42':cat?'M68 39L69 29L77 35M81 35L87 29L88 43':'M69 39L70 26L80 36M82 36L87 28L89 43';art+=p(ear,base,1.6);
   if(lynx)art+=l('M69 25l-2-7M86 25l2-7',dark,1.5)+p('M71 51l-6-1 4 7 6 1M86 49l6 0-4 7-5 1',cream,1);
   art+=p(cat?'M77 49Q84 52 92 50L88 55L80 54Z':'M79 49L94 50L91 54L82 55Z',cream,0,'none')+eye(82,43)+dot(cat?93:96,50,1.8,ink);
   if(jaguar||g==='Leopardus'){for(const[x,y]of[[35,52],[46,50],[57,52],[40,61],[53,60],[66,56]])art+=e(x,y,jaguar?3.3:2.5,2.2,base,1.3)+(jaguar?dot(x,y,.65,dark):'');art+=dots([[72,39],[77,40],[79,48],[73,52]],dark,.9);}
   else if(lynx)art+=dots([[33,55],[45,52],[54,57],[39,62],[69,60],[64,49]],dark,1)+l('M24 66l-4 3',cream,3);
   else if(!cat)art+=p('M33 48Q46 43 65 48L61 56L43 56Z',grayfox?dark:accent,0,'none')+p('M72 52L82 55L76 63L68 58Z',cream,0,'none');
   art+=l('M83 55l-1 4m-3-3-4 3M28 80h7M63 80h7',dark,1.1);
  }else if(['Cervidae','Bovidae','Antilocapridae'].includes(family)){
   const bison=g==='Bison',goat=g==='Oreamnos',sheep=g==='Ovis',prong=g==='Antilocapra',deer=family==='Cervidae';
   art+=p(bison?'M20 57Q23 44 38 44Q48 21 68 33L78 45L77 64L67 71L64 84L58 84L56 65L38 65L34 83L28 83L28 65L20 66Z':'M21 52Q30 39 49 43L62 43L69 25L76 24L79 43Q83 52 72 59L68 81L63 82L61 60L39 61L33 82L28 82L30 59L21 58Z');
   art+=p(bison?'M67 37Q83 32 86 47L87 60L78 67L68 60L63 47Z':'M70 26Q78 19 83 27L89 36L87 41L79 39L72 36Z');
   art+=p(bison?'M69 58L78 72L83 61Z':'M71 27L64 21L63 28L72 32Z',bison?dark:base,1.3)+l('M23 53L14 49L12 58',dark,2);
   if(bison)art+=p('M37 48Q47 35 64 40L68 56L62 63L40 60Z',dark,0,'none')+l('M69 39Q62 30 66 25M81 39Q89 31 87 26',cream,3)+l('M35 81h-8M59 82h8',ink,2);
   if(goat)art+=p('M64 41L66 56L75 61L78 50Z',cream,0,'none')+l('M74 24Q72 11 77 8M81 24Q84 11 88 10',dark,2.6)+p('M79 39L83 49L86 40Z',cream,1);
   if(sheep){art+=l('M76 27C59 13 53 42 68 44C79 45 84 32 74 29C66 26 63 36 69 37',accent,5.2)+l('M73 23Q80 13 88 23',accent,3);}
   if(prong)art+=p('M64 43L70 51L74 42M27 53L43 57L43 61L27 60Z',cream,0,'none')+l('M74 25L70 11L69 5M72 17l-6-4M82 24L86 9M84 16l7-5',dark,2.6);
   if(deer&&!female)art+=l(g==='Cervus'?'M74 25L66 14L63 5M67 16l-9-3M65 10l-8-5M79 24L83 12L82 4M82 14l9-6M83 8l7-5':'M74 25L68 16L66 6M69 18l-7-6M80 25L85 15L86 6M84 17l8-8',accent,2.2);
   if(deer)art+=p('M72 35L76 46L70 52L66 43Z',cream,0,'none');
   art+=eye(bison?81:81,bison?47:30)+dot(bison?86:88,bison?57:37,1.7,ink);
  }else if(family==='Mustelidae'){
   const badger=g==='Taxidea',ferret=g==='Mustela';
   art+=p(badger?'M17 61Q24 40 47 43Q68 43 75 55L92 62L89 69L75 71L64 69L60 80L53 81L50 71L34 71L28 80L21 79L24 68Z':'M18 59Q25 43 45 48L66 47Q77 37 84 47L89 58L83 66L68 65L62 77L56 77L54 63L38 65L30 77L24 77L26 63Z');
   art+=p(badger?'M25 59Q8 61 10 68L21 69Z':'M25 58Q11 51 6 61Q1 72 10 79L17 75Q9 66 28 65Z',dark);
   art+=p(badger?'M65 54L76 47L86 52L96 62L89 68L76 65Z':'M65 49Q71 37 80 40L87 49L92 56L86 60L75 61L67 56Z');
   art+=badger?p('M69 53L73 50L86 59L91 61L87 64L77 59Z',cream,0,'none')+l('M59 79l7-2m-11 3 7 1',cream,1.1):p(ferret?'M68 46L85 45L89 50L83 55L69 52Z':'M67 57L77 61L67 67L61 61Z',ferret?dark:cream,0,'none');
   art+=e(badger?73:71,badger?49:40,3,3,base,1)+eye(badger?83:82,badger?57:48)+dot(badger?95:91,badger?62:56,1.5,ink);
   if(ferret)art+=p('M24 73L31 73L31 78L23 78ZM55 73L63 73L63 78L55 78Z',dark,0,'none');
  }else if(['Procyonidae','Mephitidae','Didelphidae','Erethizontidae','Cuniculidae','Tayassuidae','Dasypodidae','Tapiridae'].includes(family)){
   const coati=g==='Nasua',skunk=family==='Mephitidae',opossum=g==='Didelphis',porcupine=g==='Erethizon',paca=g==='Cuniculus',peccary=g==='Dicotyles',armadillo=g==='Dasypus',tapir=g==='Tapirus';
   if(skunk)art+=p('M31 61Q7 47 12 19Q19 8 30 23Q23 40 43 48Z',dark)+p('M17 25Q18 13 25 23Q21 41 36 50L31 53Q15 44 17 25Z',cream,0,'none');
   else if(coati)art+=p('M28 62Q16 43 19 15L25 13Q25 37 35 58Z',base)+l('M19 23l7 2M20 34l8 2M24 46l8 2',dark,3.4);
   else if(opossum)art+=p('M26 61Q6 55 5 73Q6 87 22 83Q30 77 21 73Q19 79 15 77Q11 74 15 69L31 68Z','#c3ad96',1.6);
   else if(!paca&&!peccary&&!tapir&&!armadillo)art+=p('M30 60Q15 48 8 60Q4 76 17 81Q29 83 34 71Z',base);
   art+=p(tapir?'M23 57Q27 33 53 38Q72 35 79 52L79 66L70 70L66 82L59 82L56 68L37 68L31 81L23 81L25 64Z':peccary?'M21 56Q25 40 46 42L65 43L73 48L78 63L67 69L64 80L57 80L55 67L36 67L32 80L25 80L27 64Z':armadillo?'M19 61Q19 38 42 37Q65 36 75 57L73 68L62 70L60 80L54 80L53 70L35 71L30 80L24 79L25 67Z':'M24 61Q26 42 45 43Q63 41 73 54L74 67L63 71L60 80L54 80L52 69L37 70L32 80L25 80L28 67Z');
   const hd=coati?'M65 53Q73 41 83 48L97 37L98 42L88 57L79 64L67 61Z':tapir?'M67 47Q74 35 84 41Q91 45 91 52L98 61L96 67L90 63L83 57L76 61L67 57Z':opossum?'M66 52Q74 42 82 48L98 61L93 65L78 61L67 61Z':armadillo?'M68 54L78 48L95 61L94 67L77 66L68 63Z':peccary?'M65 49Q73 40 82 47L93 56L93 63L83 66L68 62Z':'M66 53Q71 41 82 46L91 55L92 62L81 66L67 61Z';art+=p(hd);
   if(!armadillo)art+=e(72,46,3.6,5,opossum?dark:base,1.3)+(opossum?e(74,46,1.8,2.9,'#c6b49b',0):'');
   if(family==='Procyonidae'){art+=p(coati?'M73 53L80 49L83 54L77 58Z':'M69 51L82 49L89 56L84 61L71 58Z',dark,0,'none');if(!coati)art+=l('M10 61l15 4M11 71l16 3M18 80l9-4',dark,3.8);}
   if(skunk){art+=p(g==='Mephitis'?'M29 51Q42 41 62 48L67 52L60 54Q45 49 34 56Z':'M31 48L43 46L47 49L35 52ZM50 52L58 49L65 52L60 56ZM32 60L39 58L45 61L38 65Z',cream,0,'none');}
   if(paca)art+=dots([[35,52],[44,50],[53,50],[62,53],[34,58],[43,57],[52,57],[60,59]],cream,1.7);
   if(peccary)art+=l('M64 47L70 61L62 66',cream,4)+l('M27 44l1-6M35 43l-1-6M44 43l-1-5',dark,1.2);
   if(porcupine)art+=l('M26 54L20 43M31 50L26 36M37 47L34 30M43 47L44 29M50 48L54 32M56 50L64 37M61 53L72 44M26 60l-11-3',cream,1.5)+l('M27 60l-9-4M35 54l-6-12M47 51l1-12M57 55l6-9',accent,1);
   if(armadillo){for(let x=32;x<=59;x+=3.3)art+=l(`M${x} 41Q${x-3} 55 ${x+1} 68`,dark,1.1);art+=p('M23 64Q9 67 6 78L12 79L31 70Z',base)+l('M13 71l1 5M18 68l1 6M23 67l1 5',dark,1);}
   if(opossum)art+=p('M72 50L78 47L94 59L90 62L77 56Z',cream,0,'none');
   if(tapir)art+=p('M71 41L76 39L79 47L74 50Z',cream,0,'none');
   art+=eye(coati?83:82,coati?51:54)+dot(coati?97:tapir?96:armadillo?94:92,coati?40:tapir?65:62,1.5,ink);
  }else if(['Sciuridae','Leporidae','Ochotonidae','Soricidae','Heteromyidae'].includes(family)){
   const squirrel=g==='Sciurus',rabbit=family==='Leporidae',hare=g==='Lepus',kangaroo=g==='Dipodomys',shrew=g==='Sorex',pika=g==='Ochotona',prairie=g==='Cynomys';
   if(squirrel)art+=p('M36 65Q4 61 8 31Q10 13 27 17Q43 25 26 38Q17 44 35 51Z',dark)+l('M18 25Q30 24 21 34Q10 46 27 52',cream,1.5);
   if(kangaroo)art+=l('M38 67Q9 81 4 56',dark,3.2)+p('M4 55L8 57L8 62L3 61Z',cream,1);
   art+=p(shrew?'M24 67Q29 53 46 53L60 57L84 62L96 69L89 72L67 69L56 77L28 77Z':rabbit?'M25 64Q26 43 45 44Q60 40 69 52L73 68L65 79L33 80Q23 74 25 64Z':'M31 62Q28 43 46 40Q62 39 69 54L72 70L64 80L37 80Q27 74 31 62Z');
   if(rabbit)art+=p('M35 63Q23 72 32 80L48 80L53 75L44 73L51 63Z',accent)+p(hare?'M60 45Q47 12 54 9Q64 9 69 42ZM68 44Q66 11 73 10Q81 15 75 47Z':'M59 47Q50 23 57 21Q64 21 67 44ZM68 46Q65 21 71 21Q79 24 75 49Z',base,1.7)+l(hare?'M56 15L64 38M72 16L72 39':'M58 26L63 42M71 27L72 43',cream,2.5);
   art+=p(shrew?'M61 58Q68 51 77 57L94 65L96 69L83 70L67 66Z':'M57 48Q61 36 72 40Q82 41 82 51L90 57L87 64L74 65L62 60Z');
   if(!rabbit&&!shrew)art+=e(66,39,pika?5.5:4,pika?6:5,base,1.4)+e(67,40,2,2.4,cream,0);
   if(rabbit)art+=e(25,66,5,4.5,cream,1);
   if(!squirrel&&!rabbit&&!pika&&!kangaroo)art+=l('M33 69Q14 70 16 79',dark,2);
   if(kangaroo)art+=p('M49 65Q62 64 65 76L82 82L77 86L55 81L42 72Z',base)+p('M62 56L78 59L76 62L60 62Z',cream,1.3);
   else art+=l('M54 77L69 79M61 60L71 66L78 65',dark,2);
   if(g==='Marmota')art+=p('M40 59Q52 50 61 60L60 73L43 74Z','#c5b382',0,'none');
   if(prairie)art+=p('M41 56Q51 49 58 59L58 72L44 72Z',cream,0,'none');
   if(latin==='Lepus americanus')art+=l('M61 11l4 8M75 13l1 7',dark,2);
   art+=eye(shrew?78:77,shrew?61:49)+dot(shrew?95:89,shrew?68:58,1.4,ink);
  }else if(family==='Atelidae'||family==='Cebidae'){
   const spider=g==='Ateles',capuchin=g==='Cebus';
   art+=l('M8 87Q43 76 92 82','#8d9477',3)+p(spider?'M39 48Q20 30 29 14Q39 4 47 15Q50 24 41 29Q36 28 39 22Q42 18 36 17Q28 23 36 35L49 45Z':'M42 59Q15 66 13 47Q12 31 24 29Q34 31 27 38Q21 36 20 43Q20 52 44 49Z',base,2);
   art+=p('M39 41Q42 30 54 32Q68 35 65 53L60 67L45 68L35 56Z');
   art+=p(spider?'M42 41Q32 47 28 70L23 83L28 85L35 73L45 51ZM61 44Q77 48 78 68L84 80L79 84L72 72L63 57Z':'M40 45Q31 51 30 67L23 79L29 82L36 70L44 56ZM61 46Q70 53 70 68L81 78L77 82L64 71L58 56Z');
   art+=p('M44 62L40 73L45 82L51 81L48 72L53 68M58 62L64 70L60 80L54 81L57 71L52 67Z',base,1.7);
   art+=p('M40 30Q39 14 53 13Q69 13 67 30Q64 41 53 41Q42 40 40 30Z');
   art+=p(capuchin?'M41 22Q46 12 53 17Q62 13 66 23L64 35L56 39L45 35Z':spider?'M44 23Q53 16 62 23L62 32L55 36L46 32Z':'M43 24Q52 18 62 24L62 31L57 38L46 35Z',capuchin?cream:accent,0,'none');
   if(!spider&&!capuchin)art+=p('M41 31Q51 36 65 31L62 44L48 45L41 38Z',dark,1);
   art+=eye(48,26,1.25)+eye(59,26,1.25)+l('M50 33l6 0M25 80l-3 5m5-5-1 6M79 79l3 5m-5-4 1 5',dark,1.2);
  }else if(family==='Bradypodidae'){
   art+=l('M7 17Q42 22 93 13','#8d9374',4)+p('M22 42Q22 28 39 29Q57 26 69 42L72 59Q67 75 46 74Q22 73 22 42Z');
   art+=p('M28 41Q15 39 16 20L23 18Q20 32 36 35M52 32Q60 22 56 17L64 16Q73 30 62 45M37 62Q37 78 27 82L23 78Q31 69 28 60M60 61Q73 66 77 77L71 79Q67 69 54 69Z',base,2);
   art+=p('M59 37Q70 25 82 36Q91 47 80 57Q66 64 59 52Z',cream)+p('M63 40L73 43L66 49L61 46ZM76 41L85 38L86 45L78 49Z',dark,0,'none')+eye(67,44)+eye(80,43)+dot(75,50,2,ink)+l('M17 19l-1-5m4 5v-6m3 4 1-5M59 17l-2-5m5 5v-6m3 4 1-4',cream,1.4);
  }else if(family==='Myrmecophagidae'){
   art+=p('M38 45Q12 36 5 69L11 82Q27 80 42 61Z',dark)+p('M30 49Q38 36 56 39Q68 39 75 48L75 61L64 66L63 81L57 81L55 63L39 63L35 80L29 79L30 62Z');
   art+=p('M58 41L72 48L67 58L54 64L37 56L35 50L53 57Z',cream,0,'none')+p('M60 44L70 49L64 55L53 60L39 54L38 51L53 56Z',dark,0,'none');
   art+=p('M67 42Q76 39 82 46L99 58L98 62L83 57L73 53L67 53Z')+eye(78,46,1.15)+dot(98,60,1,ink)+l('M33 79l-7 2m34-1 7 1M33 46l-6-2',cream,1.4);
  }else if(family==='Trichechidae'){
   art+=p('M28 53Q12 37 5 48L4 69Q13 79 29 65Z')+p('M24 51Q35 30 61 34Q80 33 86 45L96 53L96 66Q89 77 73 73Q41 79 25 64Z');
   art+=p('M56 61Q45 64 41 80Q52 82 63 66Z',dark,1.5)+p('M82 48Q94 45 97 55L97 63Q92 71 82 66L78 59Z',cream,1.6)+eye(83,48)+dots([[89,57],[94,57],[86,61],[91,63]],dark,.7)+l('M74 38Q73 46 77 49M32 49Q26 55 29 64',dark,1.1);
  }else throw Error('Missing North American mammal profile: '+latin);
 }else if(sp.taxonomy.className==='Aves'){
  if(family==='Trochilidae'){
   art+=p('M45 49Q32 14 20 13Q21 35 43 58Z','#c6cfbc',1.6)+p('M50 48Q57 15 80 13Q72 37 56 57Z',dark,1.7)+p('M37 63L20 83L27 86L46 73Z',dark)+p('M35 55Q40 39 52 39Q67 38 68 48L61 65Q53 75 40 70Z');
   art+=p('M53 41Q56 29 65 33Q73 36 70 44L97 35L98 37L72 47L65 54L55 51Z')+p('M56 47L66 49L61 57L55 55Z',female?cream:'#b37980',0,'none')+eye(66,38,1.2)+l('M44 48Q49 51 53 61M44 70l5 3m0-4 5 2',dark,1);
   if(latin==='Calypte anna'&&!female)art+=p('M56 37Q60 28 67 33L70 38L64 40Z','#ad7685',0,'none');
  }else if(family==='Psittacidae'||family==='Ramphastidae'||family==='Trogonidae'){
   const toucan=family==='Ramphastidae',quetzal=family==='Trogonidae';
   art+=p(toucan?'M43 61L25 88L39 85L55 68Z':quetzal?'M43 60Q22 77 23 98L30 94Q33 76 51 69ZM50 64Q35 86 45 99L51 95Q46 83 57 68Z':'M39 59L20 96L34 90L51 68Z',quetzal?'#729b81':dark);
   art+=p('M36 46Q35 31 50 29Q68 27 72 43L69 61Q63 76 48 74Q33 71 36 46Z');
   if(toucan){art+=p('M56 25Q67 15 78 23L79 41L66 49L56 40Z',base)+p('M57 41L70 39L69 58Q65 66 55 62Z','#d7c47c',0,'none');art+=p('M73 24Q93 14 99 25L99 35Q92 43 75 40Z','#b9b667',1.9)+p('M86 22L95 21L99 26L99 33L93 34Z','#be9273',0,'none')+p('M75 33L93 35L95 40L75 39Z','#88a895',0,'none')+l('M78 33L97 30',dark,1.1)+eye(70,29,1.5);}
   else if(quetzal){art+=p('M53 27Q54 13 66 18Q74 17 76 28L69 37L57 36Z','#6a9c80')+p('M44 49Q55 45 64 54L60 68L47 69Z','#b77a65',0,'none')+p('M71 27L84 29L73 33Z','#c3ae70',1)+eye(68,24)+p('M57 18Q63 10 71 15L75 20Z','#7aa38b',1);}
   else{art+=p('M56 27Q62 15 73 23Q82 31 73 43L60 41Z')+p('M70 26Q89 22 89 34L82 42L82 34L73 35Z','#d3c7a4',1.7)+p('M62 27L71 29L72 37L64 38Z',cream,0,'none')+eye(68,31)+l('M63 34l8 1M64 37l6 0',dark,.8)+p('M37 45Q45 40 59 49L48 67L38 60Z',latin==='Ara macao'?'#c4b56e':'#679c83',1.5)+p('M38 57L47 66L55 52L57 60L48 71Z','#6c8b9b',1);}
   if(!toucan&&!quetzal)art+=l('M41 48L50 58M39 53L47 62',dark,1);
   art+=l('M47 72L45 82M58 72L61 82',dark,2)+feet([[45,82],[61,82]]);
  }else if(family==='Anatidae'){
   art+=p('M23 62L8 53L14 69Q23 76 42 75Q64 80 80 65L80 53L74 49L63 58Q43 48 23 62Z')+p('M61 56Q64 46 61 38Q61 27 71 27Q84 27 84 38L80 51L80 63Z',female?base:dark)+p('M80 38L98 40L97 46L81 46Z',accent,1.6)+eye(76,35)+p('M27 61Q43 52 58 62L52 70L31 71Z',dark,1.2)+p('M33 59L45 58L50 62L36 65Z','#698c99',0,'none')+l('M18 81Q42 86 84 79','#94aca0',1.2);
   if(latin==='Aix sponsa')art+=p('M64 29Q58 29 56 37L65 36Z',dark,1)+l('M66 33L61 36L70 42L78 39M60 50L72 53L79 48',cream,1.5)+p('M64 52L77 51L77 61L67 63Z',female?base:'#a08076',0,'none');else art+=l('M63 47L79 48',cream,1.6);
  }else if(family==='Strigidae'){
   const horned=g==='Bubo',burrow=g==='Athene';
   art+=p(burrow?'M37 60Q31 46 39 35L65 34Q79 47 72 64L66 77L44 77Z':'M31 53Q27 34 40 24L67 25Q80 38 76 58L68 78L42 80Z');
   art+=p('M36 47Q28 62 40 75L47 69L45 49ZM67 45Q81 57 69 76L62 70L62 49Z',dark,1.5)+e(53,34,20,17,cream,1.6)+p('M34 28L45 24L53 34L62 24L73 28L66 43L53 39L41 43Z',base,0,'none');
   if(horned)art+=p('M35 26L29 10L45 24M63 24L76 9L73 29Z',dark,1.4);
   art+=e(44,33,6,6,accent,1)+e(63,33,6,6,accent,1)+eye(44,33,2.5)+eye(63,33,2.5)+p('M50 40L56 40L53 47Z',dark,1);
   art+=l('M44 51l6 2m7-2 6 2m-20 6 7 2m7-2 6 2m-16 6 5 2m4-1 4 1',cream,1.5)+l(burrow?'M47 76L44 89M62 76L65 89':'M46 77L45 84M61 77L62 84',dark,2)+feet(burrow?[[44,89],[65,89]]:[[45,84],[62,84]]);
  }else if(family==='Ardeidae'||family==='Pelecanidae'||family==='Threskiornithidae'){
   const heron=family==='Ardeidae',spoon=family==='Threskiornithidae',brown=latin==='Pelecanus occidentalis';if(spoon){base='#c39b9a';cream='#e1d2bc';}
   art+=p(heron?'M24 47Q29 35 48 40L62 51L56 62L31 60Z':'M20 56Q25 42 47 44L64 51L65 67L51 73L29 70Z',base)+p(heron?'M30 45L50 45L60 58L35 56Z':'M27 53L51 49L60 64L32 65Z',dark,1.5);
   art+=p(heron?'M52 46Q68 46 61 33Q52 16 68 13L75 18Q66 19 68 29Q81 47 62 57Z':spoon?'M53 53Q65 41 62 30L65 21L74 22L72 33Q74 49 64 59Z':'M55 51Q73 46 63 28Q62 17 73 18L81 23L77 31Q83 48 66 59Z',cream,1.7);
   art+=p(spoon?'M70 25L89 37Q100 40 97 46Q92 50 87 43L65 29Z':heron?'M72 17L98 24L75 25Z':'M75 25L99 36L94 41L75 33Z',spoon?'#a8ad9c':accent,1.3);
   if(!heron&&!spoon)art+=p('M76 32L96 40Q83 49 74 36Z',brown?'#b8b297':'#d9c899',1.2);
   if(heron)art+=l('M66 15L58 12M66 17L57 18',dark,1.6);
   art+=eye(spoon?70:heron?72:75,spoon?24:heron?18:24)+l(heron?'M36 60L35 77L28 92M52 61L54 77L62 92':spoon?'M38 70L36 89M53 71L56 90':'M38 70L36 82M53 72L56 82',dark,2)+feet(heron?[[28,92],[62,92]]:spoon?[[36,89],[56,90]]:[[36,82],[56,82]]);
   if(!heron&&!spoon)art+=p('M32 82L42 85L31 87ZM51 82L62 86L51 87Z',accent,1);
  }else{
   const turkey=g==='Meleagris',quail=g==='Callipepla',runner=g==='Geococcyx',prairie=g==='Tympanuchus',grouse=g==='Falcipennis',cardinal=g==='Cardinalis',corvid=family==='Corvidae',magpie=g==='Pica',hawk=g==='Circus',caracara=g==='Caracara';
   if(turkey&&!female){for(let i=0;i<9;i++){const angle=(-135+i*11)*Math.PI/180,x=45+38*Math.cos(angle),y=55+38*Math.sin(angle);art+=p(`M43 62Q${x-9} ${y-7} ${x} ${y}Q${x+9} ${y+3} 48 62Z`,i%2?base:dark,1.3);art+=dot(x,y+2,2.2,latin==='Meleagris ocellata'?'#799e9d':cream);}}
   art+=p(magpie?'M36 60L5 91L17 92L47 71Z':runner?'M36 56L6 34L8 45L36 69Z':hawk?'M41 56L12 88L27 88L52 67Z':'M33 58L14 52L24 72L42 69Z',dark,1.6);
   art+=p(turkey?'M30 50Q40 36 57 40Q70 44 69 61Q68 80 47 78Q29 76 30 50Z':runner||hawk||caracara?'M27 55Q37 40 54 44L68 47L71 60Q58 75 38 71L27 65Z':'M29 53Q30 39 47 39Q67 37 71 53L69 66Q55 78 38 70Z');
   art+=p('M32 53Q40 45 56 50L61 60L50 68L36 65Z',dark,1.4)+l('M36 56L52 61M34 60L47 65',cream,1);
   art+=p(turkey?'M58 46Q61 33 64 27Q66 20 73 25L75 41L69 53Z':'M58 43Q58 30 69 29Q81 29 81 43L89 49L84 54L72 53L63 55Z',turkey?(latin==='Meleagris ocellata'?'#6b9393':'#ad887a'):base);
   if(cardinal)art+=p('M59 35L68 17L75 31Z',base,1.4)+p('M72 38L79 38L83 46L75 50L69 44Z',female?accent:dark,0,'none');
   if(quail)art+=p('M65 30Q65 15 73 17Q79 22 71 24L68 31Z',dark,1)+p('M61 43L77 45L73 53L63 50Z',dark,0,'none')+l('M59 40Q57 51 68 55L77 51',cream,1.2);
   if(runner)art+=p('M60 33L57 21L64 25L65 18L71 27L76 25L77 34Z',dark,1)+l('M77 43l6 1','#ba906f',2);
   if(caracara)art+=p('M59 34Q62 23 75 27L82 34L77 37L64 35Z',dark,1)+p('M73 37L80 38L84 44L77 46Z','#bd9674',0,'none')+p('M60 46L72 51L65 57L57 52Z',cream,0,'none');
   if(grouse)art+=p('M60 43L74 49L66 56L58 52Z',dark,0,'none')+l('M69 32L76 33','#b27d69',1.8);
   if(prairie)art+=p('M60 38L56 22L60 22L66 38Z',dark,1)+dot(63,48,4,'#c7a26e');
   if(magpie)art+=p('M38 51L47 49L55 57L47 64L37 60Z',cream,0,'none')+l('M16 85L35 65','#74949b',2);
   if(g==='Perisoreus')art+=p('M60 31Q69 25 78 32L80 38L68 37L62 42Z',dark,0,'none')+p('M63 40L72 42L78 40L77 48L69 52L61 48Z',cream,0,'none');
   if(g==='Hylocichla')art+=p('M62 48L70 51L61 67L51 70L50 63Z',cream,0,'none')+dots([[59,56],[65,55],[57,62],[62,61]],dark,1.1);
   if(turkey)art+=p('M71 31Q78 38 75 47L72 48L70 37Z','#ba8d7a',1)+l('M38 69Q50 65 62 69',accent,1.4);
   const ex=turkey?71:75,ey=turkey?28:38;art+=eye(ex,ey)+p(turkey?'M74 28L83 31L74 33Z':runner?'M80 42L96 42L85 48Z':'M80 43L91 46L83 51Z',cardinal?'#c29b73':accent,1.1);
   const longleg=runner||caracara||hawk;art+=l(longleg?'M42 71L39 89M59 70L64 88':'M43 73L40 84M58 73L62 84',dark,2)+feet(longleg?[[39,89],[64,88]]:[[40,84],[62,84]]);
   if(quail||grouse||prairie)art+=l('M39 56l5 2m3-7 6 2m-14 9 5 2m5-5 6 2',cream,1.3);
  }
 }else if(sp.taxonomy.className==='Amphibia'){
  if(family==='Ambystomatidae'){
   const axolotl=g==='Ambystoma'&&latin==='Ambystoma mexicanum';
   art+=p(axolotl?'M38 53Q20 29 8 31Q22 43 20 59Q22 73 41 68Z':'M39 55Q17 41 8 58Q3 72 20 78Q10 65 22 62L43 68Z');
   art+=p('M33 51Q42 40 58 45L73 47Q84 52 80 63L68 69L43 70Q30 68 33 51Z');
   art+=p('M43 48L36 39L27 37L26 42L33 44L34 55M61 49L65 40L75 37L78 42L70 45L70 55M42 65L35 77L24 78L24 83L39 83L50 69M64 67L72 76L83 75L85 80L71 83L57 70Z',base,1.6);
   if(axolotl){for(const side of [-1,1]){const x=side<0?64:84;for(let i=0;i<3;i++){const y=43+i*6;art+=l(`M${x} ${y+5}L${x+side*10} ${y-3}`,accent,2)+l(`M${x+side*6} ${y}l${-side*1} -4m${side*2} 3 ${side*4} -1`,accent,1);}}}
   art+=p('M62 47Q66 37 77 40Q91 44 91 54Q89 64 75 64Q63 62 62 47Z');
   art+=eye(69,48)+eye(84,48)+l('M72 57Q78 60 84 56',dark,1);
   if(latin==='Ambystoma maculatum')art+=dots([[38,51],[43,48],[48,50],[53,48],[38,64],[45,65],[53,65],[60,62]],'#c1b470',2);
   else if(latin==='Ambystoma tigrinum')art+=l('M38 48l3 12m6-14 2 13m6-13 1 13m-19 3 5 3m6-4 7 2',accent,3);
   else if(g==='Dicamptodon')art+=l('M35 53l7 3 5-6 5 7 7-5M35 63l6 2 6-2 6 2 7-4',accent,2);
  }else{
   const toad=g==='Incilius',glass=g==='Hyalinobatrachium',red=g==='Agalychnis';
   art+=p('M31 60Q18 48 17 66L11 79L26 82L39 73M65 60Q84 47 85 66L93 79L77 83L61 74Z',base,1.8)+p('M32 53Q35 39 49 40Q65 38 71 52L72 67Q67 80 50 80Q32 80 29 67Z');
   art+=p('M33 51Q29 34 39 31Q46 28 50 36Q56 28 65 33Q74 38 69 52L61 60L40 60Z',base,1.8)+p('M34 61L27 73L16 77L15 82L30 80L41 67M65 60L74 72L87 77L87 82L73 81L59 67Z',base,1.5);
   art+=e(38,37,5.5,5,red?'#b57767':accent,1)+e(63,38,5.5,5,red?'#b57767':accent,1)+eye(38,37,2)+eye(63,38,2)+l('M39 52Q51 57 63 52',dark,1.2);
   if(glass)art+=e(50,64,10,10,'#e0e4c7',.7)+p('M45 59Q51 54 55 61L53 68L47 67Z','#b7bca0',0,'none');
   if(toad)art+=dots([[33,50],[41,56],[55,56],[64,55],[38,66],[47,71],[61,68],[30,69],[75,68]],accent,1.7);
   else if(red)art+=l('M33 57L38 70M65 57L62 70','#7798a2',3)+dots([[15,79],[25,78],[78,78],[86,79]],'#c7956e',1.9);
   else art+=l(latin==='Lithobates sylvaticus'?'M31 39L40 42L43 48M61 43L69 40L70 46':'M36 51L39 71M63 51L60 71',dark,2.1);
  }
 }else if(sp.taxonomy.className==='Reptilia'){
  if(['Viperidae','Colubridae','Boidae'].includes(family)){
   const rattle=g==='Crotalus',vine=g==='Leptophis',king=g==='Lampropeltis';if(king){base='#43574a';cream='#dfdec2';}
   art+=p(vine?'M12 74Q7 53 31 51Q56 52 43 68Q26 78 24 65Q26 60 40 59Q55 55 54 40L60 26L65 28Q62 45 65 50Q74 75 52 80Q28 91 12 74Z':'M14 72Q4 48 31 45Q53 42 56 58Q58 73 35 72Q20 69 26 59Q33 51 41 59Q38 63 43 63Q49 60 42 54Q31 46 21 57Q16 72 35 79Q57 88 76 73Q88 60 79 48L70 31L77 27L86 42Q102 63 83 80Q59 98 28 85Q16 83 14 72Z',base,1.9);
   art+=p(rattle?'M64 27L70 19L81 19L91 29L86 38L74 37L66 33Z':vine?'M55 26L64 17L82 23L84 28L68 34L58 32Z':'M63 29Q68 19 80 23L91 31L87 39L72 38L65 35Z');
   if(rattle){art+=p('M78 80L87 84L93 81L94 85L89 89L81 88Z',accent,1)+l('M85 83l-2 5m5-4-1 5m4-6-1 4',dark,1.2);for(const[x,y]of[[22,57],[29,79],[45,82],[63,79],[81,66]])art+=p(latin==='Crotalus atrox'?`M${x-3} ${y}l3-3 4 4-3 3Z`:`M${x-3} ${y-2}l7 4-3 2-5-3Z`,dark,.8);}
   else if(king)art+=l('M17 53l5 8M17 70l8-2M31 82l3-7M48 86v-8M65 81l-3-7M82 73l-6-4M89 59l-8-1M83 43l-6 3',cream,3);
   else if(family==='Boidae')for(const[x,y]of[[19,59],[32,80],[48,82],[66,76],[83,61]])art+=e(x,y,4,2.7,base,1.3);
   art+=eye(vine?75:82,vine?25:29,1.4)+l(vine?'M79 30l12 2m-2 0 3 3':'M87 35l7 3m-2-1 3 3',dark,.9);
   if(vine)art=l('M8 80L92 57','#a3a78a',2)+l('M12 75C6 49 35 45 37 63C40 81 65 71 62 51C59 37 66 27 77 29',ink,7.5)+l('M12 75C6 49 35 45 37 63C40 81 65 71 62 51C59 37 66 27 77 29','#91b37d',5)+p('M73 25Q79 19 86 26L97 31L94 35L80 34L73 30Z','#91b37d',1.4)+eye(85,27,1.6)+l('M95 34l4 3m-2-2 1 4',dark,.8);
  }else if(family==='Alligatoridae'){
   art+=p('M29 59Q6 53 5 35Q16 47 35 46L63 46L77 52L78 66L66 72L35 72Z')+p('M62 47Q69 39 78 44L97 47L99 58L96 64L74 65L64 60Z');
   art+=p('M37 53L26 64L19 64L17 69L30 71L44 62M59 61L63 77L75 81L79 77L69 72L69 61Z',base,1.7)+l('M76 56L98 56M30 49l4-7 5 7 5-7 5 7 6-5 6 6',dark,1.5)+eye(77,47,1.7)+dot(94,49,1,ink)+l('M39 55l5 3 5-3 5 3 5-3M35 64l6 1 5-3 7 3',cream,1)+feet([[19,68],[76,79]]);
  }else if(family==='Emydidae'||family==='Testudinidae'){
   const painted=g==='Chrysemys';
   art+=p('M24 62L13 70L15 77L29 73M35 72L33 84L42 85L46 74M65 70L70 82L79 79L75 66Z',base,1.7)+p('M20 59Q19 32 45 31Q68 29 76 51L74 69Q46 83 23 69Z',dark)+p('M70 54L79 44L90 46L96 54L91 63L75 64Z',base);
   art+=p('M31 43L43 36L56 41L60 52L50 60L36 56ZM36 56L50 60L51 72L33 70ZM60 52L69 48L73 62L61 70L51 72L50 60Z',base,1.1)+eye(88,50)+l('M79 56L93 55M86 60L93 58',painted?'#c6bd79':cream,1.5);
   if(painted)art+=l('M26 70Q47 80 72 68','#bc8f75',2.3)+l('M31 64l2 6m8-4 1 7m10-7v7m10-10 1 8',cream,1.1);else art+=l('M31 42l6 4M44 38l4 3M59 43l-5 3M33 62l7 1M57 64l6-2',accent,1.4);
  }else{
   const horned=g==='Phrynosoma',gila=g==='Heloderma',basilisk=g==='Basiliscus';
   art+=p(horned?'M30 59Q9 54 9 68Q15 65 31 71Z':'M34 55Q13 40 7 58Q3 71 16 76Q6 61 23 65L38 68Z');
   art+=p(horned?'M28 52Q30 38 47 38Q66 37 73 54L72 68Q55 80 36 72L27 63Z':gila?'M25 54Q31 42 47 45L68 46Q80 50 78 64L66 70L36 70Q23 65 25 54Z':'M28 54Q35 40 51 44L70 44L77 56L70 67L40 68Q25 64 28 54Z');
   art+=p('M38 49L30 42L21 45L22 50L29 50L33 58M58 63L66 74L80 75L81 80L66 81L53 71M37 64L29 75L18 76L18 81L33 80L44 71Z',base,1.5)+p(horned?'M64 48L76 38L88 44L92 54L82 64L68 62Z':'M66 47Q72 37 83 43L95 53L91 61L77 63L67 58Z');
   if(horned)art+=p('M68 45L65 32L74 40L77 29L81 40L89 34L88 46Z',accent,1.2)+l('M29 48l-7-3 3 9-7 1 7 8M65 70l7 3-2-7',dark,1.1);
   else if(gila){art+=dots([[32,51],[36,58],[33,64],[43,50],[47,58],[44,66],[56,50],[60,58],[59,66],[72,46],[78,51],[83,56]],accent,2.5)+l('M13 56l7 7M15 68l8-4',accent,3);}
   else{art+=p(basilisk?'M70 43L62 18L78 26L82 43Z':'M34 44L38 34L41 43L46 35L48 43L53 35L55 44L60 38L62 46Z',dark,1.2)+l('M39 52l5 3m5-5 7 4m-8 8 6 2',cream,1.5);if(!basilisk)art+=l('M15 54l3 7M21 57l2 7M27 57l2 9',dark,2);}
   art+=eye(83,48)+l('M87 56L94 55',dark,1)+feet([[20,79],[78,78]]);
  }
 }else if(sp.taxonomy.className==='Actinopterygii'){
  const pike=g==='Esox',perch=g==='Perca';
  art+=p('M24 49L7 36L12 54L6 72L25 61Z',dark)+p(pike?'M20 49Q40 40 67 43L77 46L97 45L98 54L90 61L65 64L22 61Z':perch?'M22 49Q35 31 59 36Q82 37 95 51L95 58Q77 75 52 71Q33 68 22 60Z':'M21 51Q40 38 63 40Q80 41 96 51L96 57Q76 71 51 68Q33 65 21 60Z');
  art+=p(pike?'M64 43L69 31L78 32L83 47Z':perch?'M31 43L34 23L39 29L43 21L48 28L53 24L57 37L65 28L75 39L78 44Z':'M42 41L48 28L54 28L63 41Z',dark,1.5)+p(pike?'M65 63L70 77L79 65Z':'M43 67L46 79L58 71Z',accent,1.4)+p('M75 55Q62 55 62 66L74 62Z',accent,1.2);
  if(perch)art+=l('M34 47L36 61M44 41L47 65M57 41L60 66M70 44L72 62',dark,3);
  else if(pike)art+=dots([[34,49],[44,51],[54,48],[64,52],[38,58],[50,59],[62,58]],cream,1.5);
  else{art+=dots([[33,50],[44,48],[55,51],[68,48],[40,59],[53,60],[67,57]],'#bd9290',1.15)+l('M28 47l5-3 4 3 4-4 5 2 4-4 6 2',cream,1);}
  art+=l(pike?'M78 53L98 51':'M86 56L95 55',dark,1.1)+l('M78 46Q74 53 78 62',dark,1.1)+eye(pike?89:86,49,1.6);
 }else throw Error('Unknown North American class: '+latin);
 const type={Mammalia:'mammal',Aves:'bird',Amphibia:'herp',Reptilia:'herp',Actinopterygii:'fish'}[sp.taxonomy.className];
 return `<svg viewBox="0 0 100 100" aria-hidden="true" data-na-version="3.22.0" data-na-profile="${morph}" data-zoological-family="${family}" data-${type}-family="${family}"${sex?` data-na-sex="${sex}"`:''}>${art}</svg>`;
}
render.classify=sp=>sp?.origin==='na3220'?{family:sp.family,profile:sp.artProfile,className:sp.taxonomy.className}:null;
root.ATLAS_NORTH_ART_V3220=render;if(typeof module==='object'&&module.exports)module.exports={renderNorthAmerican:render,classifyNorthAmerican:render.classify};
})(typeof globalThis!=='undefined'?globalThis:this);
