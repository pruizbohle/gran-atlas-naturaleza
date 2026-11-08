/* AM-03: targeted anatomical profiles. Rendering only; paint variants use the unchanged production pass. */
(function(root){'use strict';
const targets=new Set(["Anas platyrhynchos","Falcipennis canadensis","Perisoreus canadensis","Lynx canadensis","Lithobates sylvaticus","Pica hudsonia","Bubo virginianus","Lynx rufus","Brachylagus idahoensis","Marmota flaviventris","Ochotona princeps","Cervus canadensis","Oreamnos americanus","Ovis canadensis","Pelecanus erythrorhynchos","Tympanuchus cupido","Athene cunicularia","Circus hudsonius","Canis latrans","Mephitis mephitis","Mustela nigripes","Sylvilagus floridanus","Cynomys ludovicianus","Antilocapra americana","Bison bison","Phrynosoma cornutum","Crotalus viridis","Erethizon dorsatum","Aix sponsa","Archilochus colubris","Procyon lotor","Odocoileus virginianus","Esox lucius","Perca flavescens","Salvelinus fontinalis","Lithobates clamitans","Ambystoma tigrinum","Chrysemys picta","Callipepla californica","Calypte anna","Strix occidentalis","Spilogale gracilis","Dicamptodon tenebrosus","Lampropeltis californiae","Cardinalis cardinalis","Hylocichla mustelina","Urocyon cinereoargenteus","Didelphis virginiana","Ambystoma maculatum","Crotalus horridus","Geococcyx californianus","Micrathene whitneyi","Vulpes macrotis","Dipodomys merriami","Sylvilagus audubonii","Dicotyles tajacu","Heloderma suspectum","Incilius alvarius","Crotalus atrox","Gopherus agassizii","Ara militaris","Meleagris gallopavo","Panthera onca","Nasua narica","Taxidea taxus","Ambystoma mexicanum","Meleagris ocellata","Ramphastos sulfuratus","Herpailurus yagouaroundi","Leopardus pardalis","Leopardus wiedii","Cuniculus paca","Procyon pygmaeus","Alouatta pigra","Ateles geoffroyi","Tapirus bairdii","Ctenosaura similis","Boa imperator","Ardea herodias","Pelecanus occidentalis","Platalea ajaja","Trichechus manatus","Dasypus novemcinctus","Alligator mississippiensis","Terrapene carolina","Ara macao","Pharomachrus mocinno","Caracara plancus","Bradypus variegatus","Didelphis marsupialis","Myrmecophaga tridactyla","Alouatta palliata","Cebus imitator","Basiliscus plumifrons","Agalychnis callidryas","Hyalinobatrachium fleischmanni","Leptophis ahaetulla"]);
const tint=(hex,delta)=>'#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(hex.slice(i,i+2),16)+delta)).toString(16).padStart(2,'0')).join('');
function render(sp,color,skin='normal',sex=null){
 if(!sp||sp.origin!=='na3220'||!targets.has(sp.latin))return null;
 const latin=sp.latin,g=latin.split(' ')[0],f=sp.family,female=sex==='female',cls=sp.taxonomy.className;
 let base=color||'#9c967f',cream='#e7dfc7',dark='#626c59',accent='#bba47c';
 const palettes={
 Antilocapra:['#bca174','#ede2c5','#5c5a45','#a88d64'],Bison:['#87755a','#baaa83','#4e5140','#aa9170'],Cervus:['#aa8f6c','#d8c9a6','#685a45','#b79c76'],Odocoileus:['#b4a080','#eee4c9','#7c7057','#bdad89'],Oreamnos:['#dedfce','#f0ecd8','#879280','#c5cbb8'],Ovis:['#a28f73','#ddd5b8','#6f6b54','#b8a584'],
 Urocyon:['#92978a','#e5dbc0','#535e52','#b38b6a'],Canis:['#aaa28c','#e1dbc1','#6c7564','#b39a78'],Vulpes:['#b8ad8e','#eae0c4','#807f67','#baa07b'],Lynx:['#a4a293','#e5dec7','#6e7565','#a29479'],Leopardus:['#bda47c','#e6d9ba','#575744','#a18a63'],Herpailurus:['#838c7c','#aeb39d','#566654','#9b9c81'],Panthera:['#c1a46d','#ead9b6','#575442','#b39260'],
 Procyon:['#9fa695','#e4dfc5','#4e6252','#b6b69b'],Nasua:['#a59d7f','#dfd7b7','#626a51','#bbad86'],Mephitis:['#566354','#ede7cc','#344c40','#849078'],Spilogale:['#4b5e4f','#e6e1c5','#334b3d','#89977e'],Didelphis:['#a2a899','#e4dcc3','#637867','#c3ab98'],Dasypus:['#a09d89','#c5c5ac','#6a7c67','#b6b098'],Dicotyles:['#858975','#dcd7bd','#556951','#a7a78e'],Taxidea:['#a5a48d','#e6dfc3','#53624e','#c3baa0'],Tapirus:['#8c8973','#d0c7a8','#566451','#a8a18a'],
 Alouatta:['#5a6350','#ab9e77','#354b3a','#7f8164'],Ateles:['#a69a74','#dfc7a0','#4e5d48','#bda77a'],Cebus:['#67715a','#e1d8b7','#3f5642','#a5aa85'],Bradypus:['#aaa997','#dcd9bb','#6d8069','#bec1a5'],Myrmecophaga:['#9a9b83','#e8e2c6','#3c5646','#b3b49b'],Trichechus:['#93aca2','#c5d2bc','#688b7e','#b0c6b5'],Cuniculus:['#aa9673','#e2d5b5','#756e53','#bda889'],Erethizon:['#8d927c','#d3cfac','#5d715b','#afb394'],Dipodomys:['#b2a481','#eee2c6','#827a5c','#c8b893'],Cynomys:['#b1a17d','#e0d4b3','#807b5b','#bfae88'],Ochotona:['#a5a58e','#dedcc0','#74826a','#b9b99b'],Brachylagus:['#aaa28c','#e0dbc2','#7c816c','#bbb095'],Sylvilagus:['#ad9e7b','#e9dec1','#7e785b','#bda786'],Mustela:['#c3bea1','#eee7cb','#4b5847','#a4a28b'],Marmota:['#a4926d','#d7c392','#776b4f','#b4a175'],
 Ara:['#899e72','#e0cc91','#526d64','#6d92a0'],Ramphastos:['#3e5547','#dacf85','#2c463b','#a9ba83'],Pharomachrus:['#6d9a7d','#d5c28f','#3e6d58','#b97a6b'],Archilochus:['#7e9c73','#e8e3cd','#507658','#b47c7a'],Calypte:['#809b7d','#e2deca','#527762','#b77f8f'],Cardinalis:['#b46e60','#ddc5a3','#755d4b','#c2826c'],Anas:['#a9ad98','#dfdfc8','#48755e','#a8866b'],Aix:['#9ca182','#e3dcc0','#426b55','#ac7f73'],Pica:['#3e5b50','#ebe7ce','#304b43','#6e98a0'],Perisoreus:['#a5ad9d','#e5e4ce','#606f62','#c1c5ad'],Hylocichla:['#a89876','#e5dec4','#726b51','#bfb291'],Ardea:['#9caeaa','#d9dcc8','#667e78','#b8c3af'],Pelecanus:['#e0dfc9','#f0e9d3','#8f9f8e','#cdbf91'],Platalea:['#c19e9c','#e8dac5','#987f7c','#d6b6ac'],Meleagris:['#8d8770','#cfbda0','#555e4d','#ac9277'],Geococcyx:['#a29c7d','#dfd8bc','#5c6e57','#bea77a'],Callipepla:['#9faaa0','#dfd9c0','#4e675a','#c0b39a'],Falcipennis:['#7f8b75','#dcd8bb','#435c48','#a9a384'],Tympanuchus:['#a59b79','#e2d6b3','#626a4c','#c9a16d'],Bubo:['#ac9676','#e1d1ae','#6b6c50','#c9ad76'],Strix:['#9c8d74','#ddd4b8','#656752','#bcae8e'],Athene:['#afa27e','#ece0bd','#77764f','#cbb980'],Micrathene:['#a59d7c','#ded9bc','#6b7355','#bfb18c'],Circus:['#9ba9a2','#e7e5d0','#617c72','#bcbf9f'],Caracara:['#6b7861','#e5dcc0','#3d5946','#c29b78'],
 Ambystoma:['#717d63','#c6c8a8','#455f49','#c7b77e'],Dicamptodon:['#8e9479','#c2c2a1','#556e56','#b4a382'],Lithobates:['#9da276','#ded6b3','#5f7952','#b4b47e'],Incilius:['#9aa181','#d8d2b3','#6a7b5b','#b7b493'],Agalychnis:['#8aac70','#e3ddba','#527a50','#ca9b6d'],Hyalinobatrachium:['#a8c297','#e1e7ca','#719c74','#cad6ac'],Alligator:['#7b9079','#c6c8aa','#496c54','#a4b297'],Chrysemys:['#7d9577','#d8cc9e','#436d52','#bb8f6c'],Terrapene:['#9f9671','#d9c190','#667455','#bcb083'],Gopherus:['#aaa283','#d8c9a3','#758366','#bfb698'],Ctenosaura:['#95a088','#d5d5b8','#58775a','#b3bea1'],Basiliscus:['#82aa78','#d6dfb9','#49784e','#a5c18d'],Phrynosoma:['#b5a484','#e1d3af','#8a7e5b','#c9b58d'],Heloderma:['#506350','#d9b69c','#36553d','#c59c80'],Crotalus:['#b3a27d','#e1d6b5','#7c7853','#c9b890'],Boa:['#aea180','#e4d8b8','#776d4d','#c4b28c'],Lampropeltis:['#4b6251','#e7e1c7','#304d3b','#a7b394'],Leptophis:['#86b079','#d6deb6','#4c8053','#b4cd92'],Esox:['#92a284','#d7d6b3','#587a59','#c7c58d'],Perca:['#b5b280','#ded9b6','#5c7d56','#c1a17b'],Salvelinus:['#90a68c','#d5dfc0','#55785c','#c09388']
 };
 if(palettes[g])[base,cream,dark,accent]=palettes[g];
 if(latin==='Ara macao')base='#b87e6c';if(latin==='Didelphis marsupialis')base='#828c77';if(latin==='Alouatta pigra'){base='#52614f';dark='#344b3c';}if(latin==='Lynx rufus')base='#b6a080';if(latin==='Leopardus wiedii')base='#b6a17b';
 if(female){if(['Aix','Anas'].includes(g)){base='#afa488';dark='#7e7962';accent='#b8a380';}if(g==='Cardinalis'){base='#b8a98e';dark='#8d7962';accent='#b67d6b';}if(g==='Cervus'||g==='Odocoileus')base='#b7a080';}
 const ink='#3b5144',light=tint(base,19),shade=tint(base,-21),p=(d,fill=base,w=2.0,stroke=ink)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,l=(d,c=dark,w=1.15)=>p(d,'none',w,c),dot=(x,y,r,c=dark)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`,ellipse=(x,y,rx,ry,c=base,w=1.4)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${ink}" stroke-width="${w}"/>`;
 const eye=(x,y,r=1.35)=>`<g data-na3221-eye="true">${dot(x,y,r,'#23352d')}${dot(x+.35,y-.4,.35,'#f5eed8')}</g>`,dots=(coords,c=dark,r=1)=>coords.map(([x,y])=>dot(x,y,r,c)).join('');
 const leg=(x,y,lean=0,far=false)=>p(`M${x-3} ${y}Q${x-5} ${y+9} ${x+lean-2} ${y+16}L${x+lean-3} ${y+22}Q${x+lean-2} ${y+25} ${x+lean+5} ${y+24}L${x+lean+5} ${y+21}L${x+lean+2} ${y+20}Q${x+lean+4} ${y+10} ${x+4} ${y+2}Z`,far?shade:base,1.6);
 let art='',body='';
 // Most lateral torsos only need a bounded highlight. Coiled snake patterns
 // require clipping: keep those five references, rather than clipping every torso.
 function coat(d,detail=''){body=d;if(cls==='Reptilia'&&['Viperidae','Boidae','Colubridae'].includes(f)){const clip='na3221-'+sp.artProfile;return p(d)+`<defs><clipPath id="${clip}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${clip})">`+detail+'</g>';}return p(d)+`<ellipse cx="45" cy="53" rx="10" ry="3" fill="${light}" opacity=".45"/>`+detail;}
 if(cls==='Mammalia'){
  if(f==='Felidae'||f==='Canidae'){
   const cat=f==='Felidae',lynx=g==='Lynx',jaguar=g==='Panthera',margay=latin==='Leopardus wiedii',jaguarundi=g==='Herpailurus',kit=g==='Vulpes',fox=g==='Urocyon'||kit;
   const tall=lynx?5:cat?0:3,wide=jaguar?4:0;
   art+=leg(37,59-tall,4,true)+leg(68,57-tall,2,true);
   art+=lynx?p('M28 59Q17 62 14 70Q19 76 29 67L33 61Z',shade):p(margay?'M31 60Q4 47 7 71Q10 91 29 77Q15 83 15 71Q14 62 31 65Z':fox?'M31 57Q15 51 7 68Q12 78 32 70L41 62Z':jaguarundi?'M31 61Q11 55 5 70Q3 82 19 80L20 76Q10 77 13 69Q17 63 34 66Z':'M29 58Q7 50 8 72Q11 86 25 78L25 74Q15 80 15 69Q15 61 31 65Z',base);
   body=jaguar?`M25 52Q28 39 44 42Q62 38 72 46Q77 45 82 52L80 65Q67 73 49 69Q33 71 25 61Z`:jaguarundi?'M21 57Q25 46 45 48Q63 43 76 50L82 57L78 66Q56 72 30 66Q20 65 21 57Z':lynx?'M27 49Q31 35 47 39Q62 36 72 45L80 51L77 65Q60 74 36 67Q23 63 27 49Z':'M25 53Q28 41 44 44Q60 40 72 47L80 51L80 64Q64 72 39 67Q23 67 25 53Z';
   let marks='';if(jaguar||g==='Leopardus'){for(const[x,y]of[[34,51],[45,49],[56,52],[67,53],[39,61],[51,61],[63,61]])marks+=p(`M${x-2} ${y-2}q3-2 5 0q2 3-1 5q-4 1-5-1`,base,1.4,dark)+(jaguar?dot(x+.4,y+1,.7,dark):'');if(!jaguar&&!margay)marks+=l('M31 46q6 5 11 1m5 0q5 5 9 1M36 64l4 2m13-1 4 2',dark,1.5);}
   if(lynx)marks+=dots([[35,51],[42,54],[51,49],[61,54],[40,61],[58,64]],dark,.85);if(!cat)marks+=p('M29 45Q51 38 70 46L69 53Q46 49 31 55Z',fox?shade:accent,0,'none');
   art+=coat(body,marks)+leg(33,60-tall,-1)+leg(68,60-tall,-2);
   if(latin==='Lynx canadensis')art+=ellipse(32,84-tall,6,2.4,cream,1)+ellipse(67,84-tall,6,2.4,cream,1);
   const hx=lynx?78:80,hy=cat?43:42;
   art+=p(jaguar?'M67 46Q65 34 76 32Q88 30 92 42Q97 43 97 49Q94 55 86 56L76 60L68 54Z':jaguarundi?'M70 49Q71 38 80 38Q89 37 92 46L98 50L97 54L89 57L78 57L70 54Z':cat?'M69 45Q69 32 80 32Q91 33 92 43L97 47Q99 52 93 55L84 58L74 57L68 51Z':'M69 45Q70 32 80 32Q88 33 91 42L99 48L97 52L86 55L78 59L69 53Z');
   art+=jaguarundi?p('M73 41Q70 30 77 32Q82 35 80 40M84 40Q84 31 89 34L90 43Z',base,1.3):p(kit?'M71 36Q65 14 72 13Q82 18 81 34M83 35Q86 11 91 16L93 41Z':lynx?'M71 36L69 24Q73 23 79 32M83 33L88 23Q93 25 91 41Z':jaguar?'M70 37Q66 26 73 27Q79 28 80 35M84 35Q87 27 92 31L92 42Z':'M71 37Q68 23 74 25L81 33M84 34L91 24L92 43Z',base,1.5);
   if(lynx)art+=l('M70 25l-3-6M89 24l2-6',dark,1.3)+p('M71 49l-7-1 3 7-4 1 10 5M87 50l9-2-3 6 3 1-10 5',cream,1.1);
   art+=p(cat?'M81 48Q90 46 96 49Q98 53 91 55L84 54L78 52Z':'M81 47L96 48L96 52L86 55L79 52Z',cream,0,'none')+eye(85,42,margay?1.75:1.35)+dot(cat?96:98,49,1.6,ink)+l('M89 53l4 3m-6-2-2 3',dark,.9);
   if(g==='Leopardus'||jaguar)art+=dots([[74,39],[78,42],[75,48],[79,53]],dark,.7);if(lynx||jaguarundi)art+=l('M85 53l-7 1m7 2-7 2',cream,.7);
   if(fox)art+=p('M78 52Q83 55 86 55L77 64L69 57Z',cream,0,'none');
   if(latin==='Urocyon cinereoargenteus')art+=l('M10 66Q18 57 30 60',dark,3.2)+p('M30 62L35 70L31 78L27 78L28 68Z','#b38d6c',0,'none');
  }else if(['Cervidae','Bovidae','Antilocapridae'].includes(f)){
   const bison=g==='Bison',goat=g==='Oreamnos',sheep=g==='Ovis',prong=g==='Antilocapra',deer=f==='Cervidae',whitetail=g==='Odocoileus';
   art+=leg(36,56,5,true)+leg(67,55,3,true);
   art+=p(bison?'M23 51Q27 43 36 44Q44 25 59 29Q71 30 77 44L77 62Q67 72 52 65L32 65Q22 63 23 51Z':goat?'M22 49Q28 38 42 40Q59 32 68 39L77 54L73 66Q54 72 32 65Q19 60 22 49Z':'M22 49Q29 39 45 42Q58 38 65 42L70 30L76 29L80 47Q85 58 74 65Q54 71 32 64Q19 61 22 49Z');
   art+=p(bison?'M36 42Q49 27 61 33L70 48L68 64Q58 73 41 63Z':deer&&!female?'M62 41L70 32L77 41L77 56L68 62L61 53Z':'M27 55Q47 62 69 57L69 65Q46 71 29 62Z',bison||deer&&!female?dark:light,0,'none');
   art+=leg(29,59,-2)+leg(64,59,-1);
   const hoof=y=>l(`M26 ${y}h7M62 ${y}h7`,dark,2);art+=hoof(83);
   art+=p(bison?'M65 39Q80 32 88 43L89 57Q88 63 80 66L69 62L62 52Z':'M70 31Q73 20 82 25L89 34L94 39L91 44L81 43L73 39Z');
   art+=p(bison?'M66 41Q61 33 64 28Q68 30 70 38M82 38Q89 30 90 25Q95 31 88 44Z':'M73 29Q63 20 62 26Q65 34 74 35ZM83 28Q87 20 93 22L87 33Z',bison?accent:base,1.4);
   if(bison)art+=p('M70 59Q77 70 83 63L82 76L77 74L74 78L69 66Z',dark,1.2)+l('M36 48l-3 8m9-16-3 11m9-10-1 11m9-6 1 11',accent,1.1);
   if(goat)art+=l('M76 25Q73 14 77 9M83 27Q86 15 90 10',dark,2.5)+p('M79 42Q78 51 83 55L86 44Z',cream,1)+l('M27 42l-3 8m13-10-3 8m10-9-2 7m16-12-2 8',cream,1.3);
   if(sheep){art+=p('M74 25C55 14 48 40 63 46C77 50 87 32 74 29C65 27 61 37 67 39L70 36Q66 33 71 32Q79 34 73 41Q63 47 58 38Q54 23 69 21Z',accent,1.5)+l('M59 26l4 4m-7 3 6 1m-4 6 5-2m3 8 1-5',dark,1);}
   if(prong){art+=p('M25 52Q33 55 42 55L42 63L28 62ZM65 42L72 47L77 43L76 52L68 54Z',cream,0,'none')+p('M74 27Q69 19 70 9Q76 7 76 12L76 18L81 16L78 22L79 28ZM84 29Q85 20 87 12Q89 7 92 8Q90 19 88 28Z',dark,1.2)+p('M78 33L82 31L87 37L84 41Z',dark,0,'none');}
   if(deer&&!female){art+=l(whitetail?'M76 26Q61 14 65 5M67 15L62 7M71 19L72 9M83 27Q94 16 90 5M91 16L96 9M87 21L85 11':'M76 26Q64 16 61 3M65 13L57 7M68 17L61 12M71 21L68 9M82 27Q90 14 86 2M88 12L96 4M86 18L95 11M83 22L80 12','#a39881',2.1);}
   if(whitetail)art+=p('M24 53Q10 44 11 35Q24 39 29 48Z',cream,1.4);else art+=l('M24 52Q11 48 13 62',dark,2.2);
   if(deer)art+=p('M77 38L86 43L80 51L74 46Z',cream,0,'none');art+=eye(bison?82:84,bison?46:32)+ellipse(bison?87:92,bison?56:40,2.4,1.8,dark,0);
  }else if(['Atelidae','Cebidae','Bradypodidae'].includes(f)){
   const sloth=f==='Bradypodidae',spider=g==='Ateles',cap=g==='Cebus';
   art+=l(sloth?'M6 17Q42 22 95 12':'M6 84Q51 74 95 83','#9b9f80',3.4);
   if(sloth){art+=p('M31 35C28 45 28 64 44 69Q63 79 73 61Q83 45 67 35Q48 24 31 35Z');art+=p('M37 36Q26 34 27 19L33 19Q32 29 46 32M60 35Q70 27 65 16L71 15Q80 27 69 43M35 57Q25 66 21 76L26 80Q37 75 44 65M62 64Q71 68 76 78L83 78Q82 66 70 57Z',base,1.8)+l('M27 19q-5-5 0-8m3 8q-3-6 1-9m2 8q0-6 4-8M65 16q-5-5 0-9m3 8q-2-6 2-9m2 8q1-5 5-8',cream,1.4)+p('M53 37Q62 29 73 36Q83 45 77 55Q69 64 57 57Q48 49 53 37Z',cream)+p('M55 41Q60 37 65 42L61 48L55 47ZM68 42Q72 37 77 41L77 47L70 49Z',dark,0,'none')+eye(60,43)+eye(73,43)+dot(68,50,2,dark)+l('M34 44l-1 8m7-16-2 11m8-10-1 11m9-8 1 10',light,1.1);
   }else{
    art+=p(spider?'M40 55Q15 49 17 24C21 7 42 9 38 25Q35 33 29 28Q24 22 30 20Q36 18 32 15Q21 13 22 26Q22 38 45 43Z':'M39 58Q14 62 13 43Q12 28 25 27Q36 29 30 38Q25 43 21 37Q18 40 22 46Q26 51 42 48Z',dark,1.8);
    art+=p(cap?'M40 34Q50 28 61 37Q67 47 61 60L52 67L39 59Q30 46 40 34Z':'M40 32Q51 25 63 38Q69 52 61 64L45 66Q31 59 33 45Z');
    art+=p(spider?'M38 36Q25 43 23 62L16 76L22 81Q31 69 30 58Q33 48 44 45M60 37Q74 39 79 56L82 72L89 77L85 82Q74 77 74 64Q70 51 60 49Z':'M38 38Q26 42 25 56L23 70L17 78L23 82L30 75L33 57Q35 51 43 47M60 39Q70 45 69 58L73 72L82 76L79 82L67 78L62 61L56 49Z',base,1.7);
    art+=p('M42 59Q31 67 36 79L46 82L49 78L43 74L48 68M58 59Q68 64 64 75L58 82L52 81L51 77L57 72L53 67Z',base,1.6);
    art+=p(cap?'M41 28Q37 13 50 12Q64 11 67 25L63 35Q49 43 41 28Z':'M38 25Q38 11 53 12Q69 13 67 27L61 38L46 38L38 30Z');
    art+=p(cap?'M40 22Q47 15 52 20Q59 15 65 22L62 31L54 36L44 31Z':spider?'M42 22Q51 16 62 23L61 31L54 35L45 31Z':'M42 24Q53 19 63 25L61 32L52 35L43 31Z',cap?cream:accent,0,'none');
    if(!cap&&!spider)art+=p('M40 29Q50 35 64 28Q65 43 54 47Q43 43 40 29Z',dark,1.3)+p('M34 39Q30 45 33 55L39 56L43 41Z',g==='Alouatta'&&latin.endsWith('palliata')?accent:shade,0,'none');
    art+=eye(47,25,1.2)+eye(59,25,1.2)+l('M50 31l5 0m-3 3 4 0',dark,.9)+l('M18 78l-3 3m6-2-2 4m65-3 3 3m-5-1 1 3',cream,1.1);
   }
  }else if(f==='Trichechidae'){
   art+=p('M29 57C20 48 9 39 5 47Q1 58 6 72Q14 81 30 66Z');art+=coat('M24 49Q38 29 63 34Q81 32 88 45Q100 47 97 61Q96 73 80 74Q54 83 32 71Q22 64 24 49Z',p('M30 46Q55 37 78 44Q66 43 52 50Q42 58 29 60Z',light,0,'none'))+p('M62 59Q52 61 46 76Q49 81 54 78Q64 73 69 63Z',shade,1.4)+p('M84 47Q96 45 97 55Q100 66 89 69Q79 67 80 58Z',cream,1.4)+eye(85,46,1.1)+dots([[88,56],[93,56],[86,61],[91,63]],dark,.6)+l('M75 36Q75 44 80 46M4 59Q9 54 13 57',dark,1.1);
  }else if(f==='Myrmecophagidae'){
   art+=p('M33 45Q18 38 8 46L2 67L7 68L5 78L14 76L17 82L26 74Q38 66 42 53Z',shade);
   art+=leg(37,57,3,true)+leg(66,56,1,true)+coat('M29 47Q35 36 54 39Q68 36 76 47L80 58Q76 69 60 69L38 65Q24 61 29 47Z',p('M52 39L68 47L70 55L54 66L33 55L31 49L53 59L62 51Z',cream,0,'none')+p('M54 42L65 48L65 52L53 61L35 53L34 50L53 56L60 50Z',dark,0,'none'))+leg(31,59,-1)+leg(62,61,-1)+p('M67 43Q73 34 82 43L99 56L98 61L91 59Q80 55 75 52L66 52Z')+eye(77,43,1.1)+dot(98,59,.9,dark)+l('M13 49l-5 12m14-13-6 19m12-12-7 16M30 82l-5 2m37-1 6 1',light,1.1);
  }else if(['Sciuridae','Ochotonidae','Leporidae','Heteromyidae'].includes(f)){
   const rabbit=f==='Leporidae',pygmy=g==='Brachylagus',desert=latin==='Sylvilagus audubonii',pika=g==='Ochotona',kang=g==='Dipodomys',prairie=g==='Cynomys';
   if(kang)art+=l('M42 68Q15 85 7 67Q3 60 7 56',dark,2.5)+p('M5 55Q11 54 11 61L7 65L3 61Z',cream,1.2);
   else if(prairie)art+=p('M37 67Q18 67 19 75L30 76L41 71Z',base)+l('M21 73L29 74',dark,3);
   art+=coat(rabbit?'M26 59Q28 39 45 39Q58 38 64 47Q78 51 73 69Q67 81 44 80Q25 79 26 59Z':pika?'M30 57Q29 40 45 37Q61 36 69 50Q79 63 68 75Q54 84 36 75Q27 69 30 57Z':'M32 57Q29 38 44 32Q62 29 68 47L71 66Q68 82 47 81Q28 80 32 57Z',p('M41 54Q51 45 61 53L62 71Q57 78 44 73Z',g==='Marmota'?'#c8b382':cream,0,'none'));
   art+=p(kang?'M48 64Q67 62 68 75L84 82L81 87L57 81L42 73Z':'M35 65Q26 75 37 82L57 82L63 78L48 75Q52 64 45 61Z',base,1.5);
   art+=p(prairie?'M58 45Q63 32 75 38Q85 42 84 52L94 58L90 63L77 63L65 60Z':'M55 47Q59 31 73 35Q85 38 84 49L92 55Q95 60 89 63L77 64L64 59Z');
   if(rabbit)art+=p(pygmy?'M61 38Q52 17 59 16Q67 18 68 36M71 35Q70 15 76 17Q83 23 78 42Z':desert?'M60 38Q49 9 56 5Q64 5 68 34M72 35Q71 5 78 7Q85 16 78 42Z':'M60 38Q52 17 58 14Q66 13 68 35M71 35Q71 13 77 15Q83 21 78 42Z',base,1.4)+l(pygmy?'M60 22l5 12M76 23v12':'M58 14L65 33M77 16L76 35',cream,2.2)+ellipse(26,65,4,4,cream,1.1);
   else art+=ellipse(63,35,pika?5:4,5,base,1.1)+ellipse(63,35,2,2.6,cream,0);
   art+=eye(78,44,1.2)+dot(92,57,1.3,dark)+l(kang?'M64 57Q72 63 79 61M61 59L73 65':'M62 61Q67 71 79 69M58 77L69 80',dark,1.5);
   if(pika)art+=p('M23 84Q42 75 73 81L82 91L22 92Z','#b6b6a0',1.1)+l('M38 82l5 5 17-3',cream,1);
   if(g==='Marmota')art+=p('M60 42L65 38L71 40L68 46Z',cream,0,'none');
  }else{
   const skunk=f==='Mephitidae',coati=g==='Nasua',raccoon=g==='Procyon',opossum=g==='Didelphis',armadillo=g==='Dasypus',tapir=g==='Tapirus',badger=g==='Taxidea',paca=g==='Cuniculus',porcupine=g==='Erethizon',peccary=g==='Dicotyles',ferret=g==='Mustela';
   if(skunk)art+=p(g==='Spilogale'?'M33 56Q8 48 11 23Q17 8 28 16Q34 25 24 34Q21 42 40 47Z':'M35 57Q4 48 9 22Q16 3 30 17Q37 27 27 36Q24 45 43 48Z',dark)+p('M15 24Q18 12 25 19Q29 27 20 35Q18 40 30 47L26 51Q10 43 15 24Z',cream,0,'none');
   else if(coati)art+=p('M30 58Q13 44 16 16Q17 9 23 12Q29 29 26 34Q27 44 37 51Z',base)+l('M17 20l8 1M17 30l9 1M21 41l9 1',dark,3.1);
   else if(opossum)art+=l('M28 62C3 52 1 75 15 83Q31 91 32 78Q31 72 24 75Q20 79 26 80','#c0ab95',4.7);
   else if(raccoon)art+=p('M31 57Q8 50 6 65Q5 81 20 80Q31 79 36 67Z',base)+l('M9 58l17 4M7 68l18 4M15 79l12-5',dark,3.5);
   else if(porcupine)art+=p('M32 59Q12 59 9 76L14 83Q30 81 39 69Z',shade);
   art+=leg(36,56,4,true)+leg(65,56,2,true);
   body=ferret?'M21 56Q26 47 44 49Q59 43 72 48L80 58Q77 67 57 65L31 66Q19 65 21 56Z':badger?'M18 56Q27 39 47 42Q67 40 79 55L80 65Q62 75 32 68Q15 66 18 56Z':tapir?'M22 50Q30 32 52 36Q72 35 81 51L80 64Q67 75 38 68Q19 66 22 50Z':armadillo?'M22 57Q23 32 47 32Q70 31 78 52L77 67Q54 77 28 68Q20 65 22 57Z':paca?'M20 53Q25 35 48 36Q70 36 78 52L77 66Q55 77 31 68Q18 64 20 53Z':'M24 52Q30 38 47 41Q67 36 77 50L80 62Q65 74 40 68Q21 67 24 52Z';
   let marks='';if(skunk)marks=p(g==='Mephitis'?'M30 43Q44 35 65 44L70 49Q52 43 36 49ZM31 53Q44 42 64 49L68 53Q49 50 36 59Z':'M29 46Q38 40 46 43L44 48L33 50ZM49 47Q60 41 67 47L63 51L52 51ZM32 57L42 54L46 58L36 62Z',cream,0,'none');if(peccary)marks=p('M62 41L73 55L67 63L59 47Z',cream,0,'none');if(paca)marks=dots([[30,48],[39,45],[49,45],[59,47],[67,51],[30,56],[41,54],[51,55],[62,57]],cream,1.45);if(armadillo){for(let i=0;i<9;i++){const x=32+i*3;marks+=l(`M${x} 37Q${x-4} 52 ${x+1} 69`,dark,.95);}marks+=l('M59 39l6 0m-2 6 6 0m-6 6 8 0M26 47l5 1m-6 6 6 1',accent,1.2);}
   art+=coat(body,marks)+leg(30,60,-1)+leg(65,60,-2);
   art+=p(coati?'M66 48Q71 37 81 42Q89 44 94 44L99 40Q100 45 96 50Q86 59 76 60L67 55Z':tapir?'M66 44Q74 33 84 40Q91 44 90 50L98 59L96 66Q89 66 85 56L76 59L67 54Z':badger?'M64 52Q72 42 83 48L98 61L94 67L79 64L67 61Z':opossum?'M66 48Q74 38 83 45L99 59Q98 64 92 64L77 58L67 57Z':armadillo?'M66 51Q74 40 82 49L96 62Q98 66 92 67L76 63L67 60Z':'M66 47Q73 35 83 42L94 53Q99 60 91 64L78 64L68 58Z');
   if(!armadillo)art+=ellipse(72,41,3.8,4.7,opossum?dark:base,1.2)+ellipse(73,41,1.7,2.5,opossum?'#b9a68f':cream,0);
   if(armadillo)art+=p('M71 45Q66 22 71 22Q80 25 79 47M78 44Q78 25 82 27L84 49Z',base,1.3)+p('M26 62Q9 65 5 77L10 81Q18 75 31 69Z',base,1.4)+l('M12 73l2 4m3-7 2 4m4-6 2 4',dark,.9);
   if(opossum)art+=p('M70 46Q76 41 81 47L96 59L91 61L80 55L71 54Z',cream,0,'none');if(badger)art+=p('M70 49L75 46L91 60L87 63L77 55L69 55Z',cream,0,'none')+l('M27 82l-5 2m8-1-2 4m33-3 5 1',cream,1);
   if(raccoon)art+=p('M69 46Q78 40 87 46L93 54L87 59L76 56L70 52Z',dark,0,'none')+p('M77 56L84 58L80 63L74 60Z',cream,0,'none');if(ferret)art+=p('M69 44L85 44L91 51L86 55L73 53Z',dark,0,'none')+p('M27 78L33 78L33 84L26 84M60 78L67 78L67 84L60 84Z',dark,0,'none');
   if(tapir)art+=p('M70 40L74 37L78 44L74 48Z',cream,0,'none')+p('M73 53L83 56L78 61L70 57Z',accent,0,'none');
   if(porcupine)art+=l('M27 48l-8-5m12 1-6-12m12 9-3-15m9 13V23m6 17 3-15m3 17 6-14m0 18 9-12m-7 18 12-8M14 73l8-8',cream,1.2)+l('M29 52l-9-2m16-4-6-11m14 8-1-11m9 12 6-10m0 17 9-10',accent,.8);
   art+=eye(coati?84:83,coati?46:49,opossum?1.15:1.35)+dot(coati?98:tapir?96:96,coati?42:tapir?63:59,1.5,dark)+l('M86 59L92 60',dark,.85);
   if(peccary)art+=l('M31 41l-1-5m9 4-1-5m8 5v-5',dark,1.1);
   if(latin==='Procyon pygmaeus')art='<g transform="translate(8 10) scale(.84)">'+art+'</g>';
  }
 }else if(cls==='Aves'){
  const toe=(x,y)=>l(`M${x} ${y}l-6 3m6-3 1 4m-1-4 6 2`,dark,1.1);
  if(f==='Trochilidae'){
   const anna=g==='Calypte',bx=anna?49:46;
   art+=p(anna?'M44 51Q26 35 22 14Q34 17 49 43Z':'M40 53Q22 35 17 12Q31 17 45 44Z','#c0d0ba',1.3)+l(anna?'M25 19L43 45':'M20 17L40 46',cream,1);
   art+=p(anna?'M50 47Q59 20 83 15Q76 35 57 56Z':'M47 46Q57 18 80 11Q73 33 53 55Z',dark,1.4)+l(anna?'M58 43L76 22':'M54 43L74 18',light,1);
   art+=p(anna?'M38 65L30 81L39 78L44 70Z':'M34 64L22 85L34 81L41 69Z',shade,1.5);
   art+=p(anna?'M36 51C39 40 48 36 57 40Q69 43 64 57Q60 72 46 74Q35 69 36 51Z':'M33 53Q35 40 49 38Q63 37 64 48Q62 62 49 72Q37 75 33 63Z');
   art+=p('M47 43Q51 34 61 34Q71 32 72 41Q71 49 60 51L52 49Z')+p(anna?'M68 38L95 34L97 36L71 42Z':'M68 38L99 30L99 33L72 42Z',dark,1);
   art+=p('M41 59Q51 55 59 53L53 68L43 69Z',cream,0,'none');if(!female)art+=p(anna?'M51 38Q53 29 63 32L70 36L68 42L60 44L55 40ZM58 45L68 43L64 55L57 55Z':'M54 46L68 43L64 55L56 54Z',accent,0,'none');
   art+=eye(65,38,1.3)+l('M47 70l5 3m0-4 6 2',dark,1);
  }else if(f==='Anatidae'){
   const wood=g==='Aix';
   art+=p('M24 59Q32 51 46 54L61 54Q67 46 64 37Q63 27 73 27Q87 28 86 39L81 53Q90 67 75 73Q51 83 29 75L19 69L8 53L24 59Z');
   art+=p('M27 65Q41 55 59 60Q68 65 56 72L35 74Z',female?'#8c8266':wood?'#8f9b77':'#9da88f',1.2)+p('M37 60L49 58L57 63L48 68L38 67Z',wood?'#697e97':'#60838d',.9)+l('M37 60L48 60M38 68L50 69',cream,1.1);
   art+=p('M64 50Q69 45 67 36Q67 27 76 29Q86 30 83 41L80 53Z',female?base:dark,1.4)+p(wood?'M79 37Q90 34 98 39L96 44L82 44Z':'M81 37Q91 34 99 39L98 45L82 45Z',female?'#bda57b':wood?'#c69a7d':'#c4b172',1.1)+eye(78,35,1.25);
   if(wood){art+=p(female?'M68 31Q60 29 59 38L67 37Z':'M69 29Q56 29 55 42L65 40L71 36Z',dark,1)+l(female?'M76 32q-5 1-4 6q4 4 8-1':'M68 31Q62 36 65 38L74 40L81 36M64 44L72 47L80 43',cream,1.4)+p('M66 48L79 48L82 58L70 60Z',female?base:'#a17c70',0,'none');}
   else{if(!female)art+=l('M66 47L80 48',cream,1.6)+l('M21 57q-2-9-7-6q-3 4 4 4',dark,1.5);if(female)art+=l('M30 58l5 3m4-6 5 3m6-4 4 4m-23 9 5 2m5-4 6 2m9-4 5 3',dark,1.1);}
   art+=l('M18 83Q48 88 87 80','#99afa0',1.15);
  }else if(['Psittacidae','Ramphastidae','Trogonidae'].includes(f)){
   const toucan=f==='Ramphastidae',quetzal=f==='Trogonidae',scarlet=latin==='Ara macao';
   art+=p(quetzal?'M43 57Q27 74 20 98L27 97Q34 77 52 65ZM51 62Q34 88 45 99L51 97Q45 82 59 66Z':toucan?'M40 59Q31 72 28 86L38 83L52 66Z':'M36 55L19 96L26 94L44 66L31 92L39 88L51 65Z',quetzal?base:shade,1.7);
   art+=p('M37 40Q37 27 51 27Q69 26 73 43L69 59Q65 76 50 77Q34 73 35 58Z');
   art+=p(toucan?'M57 32Q67 28 72 39L68 58Q60 66 53 59Z':quetzal?'M43 51Q51 45 63 52L63 67Q55 75 46 67Z':'M38 43Q49 34 63 45Q62 57 48 67L37 62Z',toucan?cream:quetzal?'#b87d69':scarlet?'#d1bc78':'#6b9b78',1.2);
   art+=p(toucan?'M54 27Q56 12 70 14Q80 16 80 31L71 43L58 39Z':quetzal?'M53 26Q52 13 65 13Q76 14 77 26L69 37L58 35Z':'M54 27Q55 14 68 16Q83 18 80 31L72 42L58 38Z');
   if(toucan){art+=p('M72 18Q92 8 99 21L99 33Q93 41 77 34Z','#c4bd75',1.7)+p('M86 16Q96 13 99 21L98 28L89 27Z','#b99577',0,'none')+p('M76 28L96 29L97 34L79 33Z','#8cab91',0,'none')+l('M77 27L97 26',dark,1)+eye(69,23,1.4);}
   else if(quetzal){art+=p('M55 18Q59 7 70 11L77 17Q64 14 57 22Z',light,1.1)+p('M73 24L84 26L75 30Z','#c8ba76',1)+eye(68,23,1.4)+p('M38 47Q44 42 51 47L47 66L39 64Z',dark,1.1);}
   else{art+=p('M72 21Q89 16 91 30Q92 39 84 43L84 34L74 31Z',cream,1.4)+p('M84 31L90 31L87 38L83 40Z',dark,1.1)+p('M61 23L72 24L75 34L64 36L59 30Z',cream,0,'none')+eye(68,27,1.4)+l('M63 30l9 0m-8 3 7 0',dark,.75)+p('M39 53Q48 54 59 47Q58 63 46 71L38 65Z','#698d9f',1.1)+l('M42 57L49 63M40 61l5 5',cream,1);}
   art+=l('M47 75L44 83M61 73L64 82',dark,2)+toe(44,83)+toe(64,82);
  }else if(f==='Strigidae'){
   const burrow=g==='Athene',elf=g==='Micrathene',horned=g==='Bubo',spotted=g==='Strix';
   art+=p(burrow?'M34 49Q30 37 42 34L63 35Q75 42 70 61Q68 72 54 74Q37 76 33 62Z':'M30 46Q29 28 44 25L63 27Q77 33 75 51L72 69Q66 80 49 79Q31 76 30 60Z');
   art+=p('M34 45Q24 58 37 74L44 68Q40 53 44 45M65 45Q80 54 68 76L61 69Q66 56 60 46Z',shade,1.3)+p('M31 30Q35 15 52 17Q72 16 75 33Q79 48 65 53Q50 60 35 50Q25 42 31 30Z',cream,1.6);
   art+=p('M32 29Q44 18 52 31Q60 20 74 29L68 44L56 47L52 41L48 47L36 43Z',light,0,'none');if(horned)art+=p('M34 26L31 15Q40 16 44 24M62 23Q66 15 74 14L72 29Z',dark,1.4);
   art+=ellipse(42,34,6.4,6.9,spotted?'#514d40':'#c4b57a',.8)+ellipse(63,34,6.4,6.9,spotted?'#514d40':'#c4b57a',.8)+eye(42,34,spotted?3:2.4)+eye(63,34,spotted?3:2.4)+p('M49 43Q52 39 56 43L52 50Z',dark,1);
   if(spotted)art+=dots([[42,55],[53,56],[64,54],[45,64],[57,63],[51,71],[63,70],[36,61],[69,61]],cream,1.6)+l('M35 29Q40 24 47 29M57 28Q63 23 70 29',dark,.8);
   else art+=l(elf?'M42 57l4 0m8-1 5 0m-18 7 5 1m9-1 4 1':'M40 55l7 2m9-2 7 2m-23 5 7 2m9-2 7 2m-19 6 7 2m6-2 5 2',cream,1.2);
   art+=l(burrow?'M45 74L42 91M60 74L64 91':'M44 78L42 86M61 78L63 86',dark,2)+toe(burrow?42:42,burrow?91:86)+toe(burrow?64:63,burrow?91:86);
   if(elf)art='<g transform="translate(10 13) scale(.81)">'+art+'</g>';
  }else if(['Ardeidae','Pelecanidae','Threskiornithidae'].includes(f)){
   const heron=f==='Ardeidae',spoon=f==='Threskiornithidae',brown=latin==='Pelecanus occidentalis';if(brown){base='#969786';dark='#5b6f60';cream='#dad9bd';}
   art+=p(heron?'M20 46Q28 35 45 39Q59 42 66 54L57 65L32 62Q19 58 20 46Z':'M18 54Q25 40 46 43Q64 42 69 57Q69 72 49 75Q27 77 18 65Z',spoon?'#c8aaa3':base);
   art+=p(heron?'M27 45Q39 38 50 46L57 59L34 57Z':'M26 52Q42 43 58 53L59 65Q43 72 28 65Z',spoon?'#b99293':shade,1.3)+l('M31 49Q41 45 50 52M30 54Q40 53 48 59',cream,1);
   art+=p(heron?'M51 45Q67 46 63 34Q53 14 65 10Q74 7 78 15L73 22Q65 17 68 29Q82 48 63 57Z':spoon?'M52 52Q63 44 62 32Q59 18 69 17Q77 17 76 26L70 37Q72 51 63 61Z':'M54 53Q70 47 65 34Q58 20 68 17Q79 14 81 24L76 34Q85 50 66 62Z',cream,1.5);
   if(spoon)art+=p('M71 23L88 34Q99 35 99 42Q98 48 92 47Q88 47 86 40L67 29Z','#a8b09a',1.3)+l('M73 28L89 38',dark,.8);
   else if(heron)art+=p('M74 14L99 20L78 24L71 22Z','#c3b37c',1.2)+l('M65 13L57 12M66 15L56 18',dark,1.3);
   else art+=p('M76 23Q87 25 99 35L97 39L77 31Z','#c7b58b',1.1)+p('M77 31L98 38Q87 52 74 34Z',brown?'#bbb494':'#ddc99d',1.1)+l('M82 37Q87 43 93 39',accent,.8);
   art+=eye(spoon?71:heron?73:76,spoon?22:heron?15:23,1.2);
   art+=l(heron?'M37 62L36 77L28 92M52 64L53 78L64 93':spoon?'M38 74L36 92M54 74L58 92':'M37 74L35 84M54 74L58 84',dark,1.8)+toe(heron?28:spoon?36:35,heron?92:spoon?92:84)+toe(heron?64:spoon?58:58,heron?93:spoon?92:84);
   if(!heron&&!spoon)art+=p('M31 84L42 87L30 89ZM53 84L64 87L53 89Z',accent,1);
  }else{
   const turkey=g==='Meleagris',quail=g==='Callipepla',runner=g==='Geococcyx',prairie=g==='Tympanuchus',grouse=g==='Falcipennis',raptor=g==='Circus'||g==='Caracara',caracara=g==='Caracara',magpie=g==='Pica',cardinal=g==='Cardinalis';
   if(turkey&&!female){for(let i=0;i<10;i++){const angle=(-153+i*13)*Math.PI/180,x=44+36*Math.cos(angle),y=56+35*Math.sin(angle);art+=p(`M44 65Q${x-8} ${y-10} ${x} ${y}Q${x+7} ${y+4} 49 64Z`,i%2?base:dark,1.1)+l(`M46 59L${x} ${y+2}`,accent,.65)+dot(x,y+2,2.8,latin==='Meleagris ocellata'?'#83a6a1':cream)+(latin==='Meleagris ocellata'?dot(x,y+2,1.2,dark):'');}}
   art+=p(runner?'M35 52Q20 38 4 35L6 44Q18 55 36 64Z':magpie?'M38 56Q19 75 5 94L15 92Q38 75 49 64Z':raptor?'M39 54Q24 73 15 89L28 85L51 65Z':turkey&&female?'M36 59L17 75L26 79L44 68Z':'M32 55L15 48Q15 64 32 70L43 64Z',shade,1.5);
   art+=p(turkey?'M29 49Q33 35 50 38Q68 37 72 53Q76 72 57 79Q37 85 29 68Z':runner?'M26 50Q38 40 54 44L67 43Q78 45 77 57Q71 70 48 68Q31 68 26 58Z':raptor?'M29 48Q40 36 55 40Q71 42 76 54L70 68Q50 79 33 68Q25 60 29 48Z':'M28 48Q32 34 48 35Q66 33 72 49L72 63Q62 79 43 73Q26 70 28 48Z');
   art+=p(turkey?'M34 50Q44 39 61 48Q67 59 55 70L38 69Z':runner?'M32 49Q45 41 61 48Q66 55 55 63L38 61Z':'M33 48Q44 39 60 47Q67 57 55 67L36 63Z',dark,1.3)+l('M36 51Q44 47 54 52M35 56Q44 53 52 60M39 63l10-1',cream,1);
   art+=p(turkey?'M59 45Q63 34 64 26Q64 17 72 20Q82 24 75 35L73 49L66 53Z':runner?'M59 43Q66 27 77 30Q89 34 83 45L77 53L66 52Z':raptor?'M61 38Q66 24 78 28Q87 31 83 42L78 52L66 51Z':'M59 40Q58 25 71 25Q83 26 84 39L79 48L66 50L59 46Z');
   if(cardinal)art+=p('M61 31Q63 20 69 12Q73 19 77 27L75 31Z',base,1.2)+p('M73 34Q80 35 82 42L78 47L71 43Z',female?shade:dark,0,'none');
   if(quail)art+=p('M65 27Q61 15 67 12Q76 9 75 17Q73 23 68 23L69 28Z',dark,1)+p('M63 39L77 42L73 51L63 46Z',dark,0,'none')+l('M61 36Q58 48 68 52L77 48',cream,1.1);
   if(runner)art+=p('M64 32L59 22L65 25L66 17L70 25L74 21L79 32Z',dark,1.1)+l('M79 40l5 1','#b48c72',2);
   if(caracara)art+=p('M62 32Q64 20 78 27L84 33L77 36L64 34Z',dark,1)+p('M75 35L82 35L86 43L78 46Z','#bf9878',0,'none')+p('M62 43L73 48L65 56L57 50Z',cream,0,'none');
   if(g==='Circus')art+=ellipse(75,35,7,8,cream,.8)+p('M68 29Q77 25 82 32L80 36L72 34Z',light,0,'none');
   if(grouse)art+=p('M61 41L76 45L69 56L58 50Z',dark,0,'none')+l('M69 28L77 29','#b58970',1.6)+dots([[33,60],[39,65],[46,68],[57,64],[63,59]],cream,1.2);
   if(prairie){art+=p('M61 38Q54 29 57 16L62 16L66 37ZM75 38L75 21L79 19L82 38Z',dark,1)+ellipse(64,45,4.5,5,'#c4a475',.9)+ellipse(77,44,3,4,'#c4a475',.9)+l('M38 53l8 0m-10 6 10 0m-7 6 9 0m4-12 8 1m-7 5 9 1',cream,1.2);}
   if(magpie)art+=p('M34 46Q42 41 48 44L56 55L48 66L36 61Z',cream,0,'none')+l('M15 85L34 68',accent,1.5);
   if(g==='Perisoreus')art+=p('M61 31Q68 21 78 28L82 34L73 33L65 38Z',shade,0,'none')+p('M64 36Q71 40 80 36L78 44L68 49L61 43Z',cream,0,'none');
   if(g==='Hylocichla'){art+=p('M62 45L71 48L65 65L52 70L51 61Z',cream,0,'none');for(const[x,y]of[[58,51],[64,53],[57,58],[63,60],[54,65]])art+=p(`M${x} ${y}l2 3-3-1Z`,dark,0,'none');}
   if(turkey){art+=p('M69 23Q76 20 78 29L74 40L70 39Z',latin==='Meleagris ocellata'?'#789d9a':'#ad887b',1)+(!female?p('M75 30Q82 39 78 48L73 46L73 35Z','#b78e7e',.7):'');}
   const ex=turkey?72:runner?78:76,ey=turkey?25:runner?36:34;art+=eye(ex,ey,1.3)+p(raptor?'M82 36Q94 34 94 43L89 49L88 43L81 43Z':turkey?'M77 26L86 29L77 32Z':cardinal?'M80 37Q87 35 93 40L86 47L81 45Z':runner?'M84 38L99 40L86 45Z':'M81 39L92 42L82 47Z',cardinal?'#c39c76':accent,1.1);
   art+=l(runner||caracara?'M42 69L38 88M60 68L65 88':'M43 74L41 85M59 73L63 85',dark,1.8)+toe(runner||caracara?38:41,runner||caracara?88:85)+toe(runner||caracara?65:63,runner||caracara?88:85);
   if(quail)art+=l('M40 64q2 3 4 0m3 2q2 3 4 0m-7 3q2 3 4 0m7-6q2 3 4 0',cream,1);
  }
 }else if(cls==='Amphibia'){
  const caudate=f==='Ambystomatidae',axolotl=latin==='Ambystoma mexicanum',tiger=latin==='Ambystoma tigrinum',spotted=latin==='Ambystoma maculatum';
  const toes=(x,y,n=4,c=dark)=>Array.from({length:n},(_,i)=>l(`M${x} ${y}q${(i-1.5)*2} 2 ${(i-1.5)*3} ${3+(i%2)}`,c,.85)).join('');
  if(caudate){
   if(axolotl){base='#8b967d';dark='#58755d';cream='#c5cfb1';accent='#b9938b';}if(spotted){base='#52624f';dark='#344d3d';accent='#d1c483';}
   art+=p(axolotl?'M41 52Q20 35 5 45Q19 48 18 60Q19 75 42 66Z':'M41 53C25 43 12 45 6 59Q4 73 17 79Q9 69 18 61Q26 54 43 66Z',base,1.6);
   if(axolotl)art+=p('M27 46Q20 38 5 45Q14 39 23 48L35 54Z',cream,.65)+p('M18 61Q16 72 32 72L40 64Z',cream,.65);
   art+=p('M40 49Q33 41 25 47L20 56L24 59L30 53L40 57M58 49Q64 38 74 42L82 49L79 53L72 48L65 58M39 64Q31 66 29 77L20 80L22 84L34 81L46 69M61 63Q72 65 75 75L85 78L86 82L71 80L57 70Z',base,1.3);
   art+=coat(g==='Dicamptodon'?'M30 51Q35 39 53 42Q71 40 80 49L81 62Q73 74 49 70L34 67Q28 63 30 51Z':'M32 51Q38 41 54 43Q70 41 78 49L79 61Q70 72 48 68L35 65Q30 62 32 51Z');
   if(spotted)art+=dots([[37,49],[44,46],[51,47],[59,47],[65,50],[37,62],[45,63],[53,64],[61,63]],accent,1.7);
   else if(tiger)art+=l('M36 48q2 6 0 12m8-14q2 7 0 15m9-15q2 5 1 13m8-12 2 10',accent,3.2);
   else if(g==='Dicamptodon')art+=l('M34 51l6-3 5 6 7-5 6 5 7-5M35 62l7 2 6-5 6 5 8-4',accent,1.8);
   if(axolotl){for(const side of [-1,1])for(let i=0;i<3;i++){const x=side<0?66:85,y=41+i*7,dx=side*(10+(i===1?2:0));art+=l(`M${x} ${y+5}Q${x+dx/2} ${y} ${x+dx} ${y-3}`,accent,2.1)+l(`M${x+dx/2} ${y}l${side*1} -5m${side*2} 4 ${side*4} -3m${-side*4} 7 ${side*7} -1`,accent,.9);}}
   art+=p(axolotl?'M60 47Q62 37 76 38Q93 37 96 48Q99 57 88 62Q72 67 62 57Z':g==='Dicamptodon'?'M60 47Q65 36 79 39Q95 41 95 52Q96 63 80 65Q65 64 60 55Z':'M60 47Q65 37 79 40Q94 41 94 52Q95 62 80 63Q66 63 61 55Z');
   art+=eye(69,46,1.2)+eye(87,47,1.2)+l('M69 56Q79 60 89 55',dark,1)+dots([[74,42],[80,42],[89,52]],axolotl?shade:accent,.7)+toes(24,58,4)+toes(79,51,4)+toes(22,82,5)+toes(85,80,5);
   if(axolotl)art+=l('M36 48Q47 45 61 47M27 68Q38 72 49 69',cream,.9);
  }else{
   const wood=latin==='Lithobates sylvaticus',green=latin==='Lithobates clamitans',toad=g==='Incilius',tree=g==='Agalychnis',glass=g==='Hyalinobatrachium';if(wood){base='#b8a487';dark='#6c6a50';cream='#e1d5b5';}if(green)base='#91a77b';
   art+=p(tree?'M34 54Q17 39 13 57L19 71L12 83L27 82L40 68M65 53Q84 42 86 60L79 73L91 81L76 84L60 69Z':toad?'M34 51Q12 43 13 63Q11 76 25 80L42 71M66 51Q89 45 89 66Q90 77 77 81L60 72Z':'M34 53Q15 40 15 60Q14 75 29 79L43 69M65 53Q85 42 85 63Q88 77 74 81L59 70Z',shade,1.5);
   art+=p(toad?'M28 50Q30 35 49 35Q71 34 75 51Q83 70 68 79Q48 89 31 77Q21 68 28 50Z':'M30 49Q34 33 50 35Q70 34 72 53Q77 71 64 80Q48 86 34 75Q25 63 30 49Z');
   art+=p('M35 57Q27 62 27 73L16 79L18 84L32 81Q37 72 42 67M65 57Q74 61 73 74L86 79L85 84L71 81Q64 73 59 66Z',base,1.25);
   art+=p(toad?'M30 44Q28 30 37 29Q46 27 50 33Q58 26 66 31Q76 33 73 47L65 57L38 56Z':'M31 43Q31 27 41 29Q48 29 51 35Q57 28 65 31Q76 34 72 48L61 57L39 55Z');
   const iris=tree?'#b87e6b':'#c2b58a';art+=ellipse(39,35,5.8,5.2,iris,.9)+ellipse(64,37,5.8,5.3,iris,.9)+eye(39,35,1.8)+eye(64,37,1.8)+l('M37 48Q50 55 66 48',dark,1.15);
   if(wood)art+=p('M30 36L41 38L48 45L43 49L32 43ZM61 40L71 35L73 43L66 48L59 47Z',dark,0,'none')+eye(39,35,1.7)+eye(64,37,1.7);
   if(green)art+=ellipse(71,47,3.5,4.2,accent,.7)+l('M34 54Q36 67 40 74M66 54Q63 68 60 76',cream,1.7);
   if(toad)art+=ellipse(30,50,4.5,6,light,.6)+ellipse(73,51,4.5,6,light,.6)+dots([[36,59],[43,56],[55,58],[66,60],[34,67],[46,70],[59,70],[53,77]],shade,1.25);
   if(tree)art+=p('M31 54L35 72L41 68L37 55M65 54L63 70L68 72L72 57Z','#8ca5ae',0,'none')+l('M33 58l5 1m-3 4 5 1m27-4 4 1m-5 4 4 1',cream,1.2);
   if(glass)art+=`<g opacity=".55">${p('M40 54Q48 47 60 53Q66 62 58 73Q47 78 39 66Z',cream,.6)}${p('M47 55Q52 51 56 58L54 63L49 63Z','#b4bfa4',0,'none')+l('M43 64l6-3 8 7',accent,.6)}</g>`;
   for(const[x,y]of[[17,82],[30,79],[74,79],[85,82]]){art+=toes(x,y,3,tree||glass?accent:dark);if(tree||glass)art+=dots([[x-4,y+3],[x,y+4],[x+4,y+3]],tree?'#c69c70':light,1.35);}
   if(glass)art='<g transform="translate(8 8) scale(.86)">'+art+'</g>';
  }
 }else if(cls==='Reptilia'){
  if(['Viperidae','Boidae','Colubridae'].includes(f)){
   const rattle=g==='Crotalus',king=g==='Lampropeltis',vine=g==='Leptophis',boa=g==='Boa',diamond=latin==='Crotalus atrox',timber=latin==='Crotalus horridus';
   if(vine){art+=l('M5 84L96 57','#9baf8e',2.1)+l('M10 76C1 48 32 44 37 60C44 84 68 71 61 51Q55 29 77 29',ink,6.8)+l('M10 76C1 48 32 44 37 60C44 84 68 71 61 51Q55 29 77 29',base,4.9)+p('M72 26Q78 20 87 25L98 31L95 35L81 34L73 31Z',base,1.2)+l('M81 29L94 33',dark,1.1)+eye(84,27,1.7)+l('M96 34l3 3m-1-1v3',dark,.7);
   }else{
    if(king){base='#4a6050';cream='#e6dfc8';}if(!timber&&!diamond&&rattle)base='#a4ab83';
    body=boa?'M13 70C7 54 18 44 33 47Q55 47 57 62Q54 76 36 75Q22 73 26 63Q28 56 36 60L38 65Q44 65 45 60Q44 53 33 53Q20 53 19 65Q17 80 42 82Q65 85 77 70Q89 54 75 47Q62 42 64 35L72 31Q72 37 83 42Q99 48 93 67Q90 86 66 91Q35 99 17 83Z':'M14 70C6 52 23 43 37 47Q57 51 54 65Q48 77 33 72Q21 68 27 59Q31 54 38 59Q41 62 37 65Q45 66 46 60Q43 51 31 53Q16 55 19 68Q24 84 47 81Q68 80 76 67Q84 52 73 44Q63 38 66 29L75 25Q76 34 84 40Q100 49 93 70Q88 87 64 92Q31 99 16 82Z';
    if(king)body='M14 72Q3 56 20 47Q36 39 48 52Q57 64 43 71Q25 79 24 66Q23 59 33 58L38 62Q36 68 42 66Q49 62 43 55Q31 43 19 55Q8 70 29 80Q57 90 75 72Q90 55 78 40L70 31L76 27Q92 42 92 56Q95 80 70 89Q35 100 14 81Z';
    let pattern='';if(king)pattern=l('M12 58l13 4M17 77l10-10M31 85l1-9M48 87l-2-10M64 84l-5-9M82 73l-9-5M90 55l-11 1M84 39l-7 4',cream,4.2);else if(rattle){for(const[x,y]of[[20,58],[22,77],[38,85],[56,84],[76,76],[86,60]])pattern+=diamond?p(`M${x-3} ${y}q3-4 7 0q-3 5-7 0Z`,base,1.2,dark):timber?l(`M${x-4} ${y-3}l4 5 5-2`,dark,2.8):p(`M${x-4} ${y-2}q5-3 8 2l-1 3-6 0Z`,shade,1,cream);}
    else for(const[x,y]of[[19,61],[22,77],[38,86],[57,84],[77,74],[86,59]])pattern+=p(`M${x-4} ${y-3}q4-3 8 0l1 5q-6 3-10-1Z`,shade,1,cream);
    art+=coat(body,pattern);
    art+=p(rattle?(diamond?'M64 28Q67 18 78 18Q90 18 96 29L91 38L78 39L66 34Z':'M65 27Q68 18 78 20Q89 21 94 30L89 38L77 37L67 33Z'):'M63 33Q66 24 76 26Q87 28 94 35Q97 40 89 43L76 42L65 38Z');
    art+=p(rattle?'M67 31L79 29L93 32L90 36L78 35L69 34Z':'M68 36L80 34L92 36L90 40L77 39Z',cream,0,'none')+eye(rattle?82:83,rattle?26:33,1.4)+l(rattle?'M91 35l7 3m-2-1 1 3':'M92 40l6 2m-2-1 1 3',dark,.8);
    if(rattle){art+=p('M78 82Q87 82 91 76L95 77L96 83L89 88L80 89Z',accent,1.2)+l('M85 83l1 5M89 81l2 5M92 79l2 4',dark,1);}
   }
  }else if(f==='Alligatoridae'){
   art+=p('M32 54Q15 54 6 34Q12 35 20 45L43 47L39 62Q20 64 12 57L18 59Q30 61 32 54Z',shade,1.8)+p('M38 51Q30 43 22 47L17 58L22 61L28 53L42 59M57 63Q67 61 73 70L83 74L83 79L68 78L56 70Z',shade,1.4);
   art+=coat('M30 48Q41 36 61 42Q75 42 80 52L80 64Q66 74 42 68Q27 65 30 48Z',l('M33 47l5-6 5 5 5-6 5 6 5-5 7 6M36 55l6-3 6 4 7-3 7 4M36 62l8 1 6-3 7 3',dark,1.2));
   art+=p('M67 47Q72 36 82 42Q88 43 94 43Q99 43 99 53L98 59Q91 65 77 63L67 57Z')+p('M70 58Q85 62 98 55L97 61L85 66L73 62Z',cream,0,'none')+l('M77 54Q87 58 99 53',dark,1.2)+ellipse(78,41,4,3,base,1)+ellipse(87,43,3.5,2.7,base,1)+eye(78,41,1.2)+dot(96,47,1,dark);
   art+=p('M40 60Q29 58 26 69L17 73L18 78L31 76L45 68M62 61Q68 65 68 76L80 81L85 78L77 73L71 61Z',base,1.5)+l('M19 76l-4 2m6-1-1 4M80 78l6 0m-5 1 3 3',dark,1)+l('M21 46l4-5 5 5m4-2 4-5',cream,.8);
  }else if(f==='Emydidae'||f==='Testudinidae'){
   const painted=g==='Chrysemys',box=g==='Terrapene';
   art+=p(painted?'M28 59Q12 64 10 75L17 76L27 69L35 67M59 61L64 78L76 80L78 76L71 69L72 61Z':'M28 59Q14 60 15 74L23 77L32 68M61 62Q64 71 65 81L75 82L79 78L74 68L72 60Z',base,1.4);
   art+=p(painted?'M20 57Q25 40 47 41Q69 40 78 54L77 66Q62 76 31 70Q18 68 20 57Z':box?'M21 55Q20 29 46 29Q71 28 79 51L77 68Q54 79 26 68Z':'M21 55Q22 32 45 30Q68 30 78 51L76 68Q54 80 26 69Z',dark,1.8);
   const shell=painted?'M27 54L39 46L53 45L62 52L58 62L42 65L30 62Z':'M30 44L43 34L57 38L64 51L53 61L36 57Z';art+=p(shell,base,1.05)+p(painted?'M30 62L42 65L44 70L29 67ZM58 62L62 52L73 51L75 63L64 69L44 70L42 65Z':'M36 57L53 61L53 72L31 68ZM64 51L72 46L76 61L65 70L53 72L53 61Z',base,1);
   if(painted)art+=l('M24 67Q45 77 75 65','#bd8e70',2.1)+l('M31 66l1 4m12-3v6m13-6v6m10-10 2 7',cream,.9);
   else if(box)art+=l('M37 44l6 6m8-13-4 12m10-3-8 6m-12 2 8-2m-6 11 7-8m3 11-1-10m11 7-8-10M31 70Q51 78 72 69',accent,1.5);
   else art+=l('M34 44l7 3m7-9v8m8 1-6 3m-12 4 5-3M39 61l6 2M59 59l7-3',accent,1.3);
   art+=p(painted?'M70 54Q75 43 86 46L97 51L98 57Q94 64 83 63L72 61Z':'M71 53Q76 43 85 47L95 54Q99 60 91 64L79 63L71 60Z',base,1.5)+eye(87,50,1.2)+l(painted?'M80 48L94 53M78 53L94 56M79 58L92 60':'M86 60L94 58',painted?'#d3c58b':cream,painted?1.3:.9);
   art+=p(painted?'M36 65Q30 70 29 80L40 83L47 77L44 68Z':'M34 64Q28 69 27 81L35 84L42 81L44 70Z',base,1.4)+l(painted?'M32 79l-6 3m9-2 0 4m2-5 6 3M12 74l-6 2m8-2 0 4':'M29 80l-3 3m7-2-1 4m4-4 3 2',dark,.85);
  }else{
   const horned=g==='Phrynosoma',gila=g==='Heloderma',basilisk=g==='Basiliscus';
   art+=p(horned?'M32 60Q14 57 7 67L12 71L35 68Z':'M37 52Q14 41 6 55Q1 69 15 74Q8 63 18 58Q28 54 40 65Z',base,1.5);
   if(basilisk)art+=p('M26 48Q33 28 42 34Q53 30 62 39L72 45L70 53Z',shade,1.2)+p('M10 57Q14 47 20 51L29 54L24 59Z',shade,.9);
   art+=p('M40 49Q30 40 21 45L18 54L23 57L28 49L42 57M60 62Q69 61 73 72L84 77L84 81L70 79L56 69Z',shade,1.4);
   body=horned?'M28 47Q37 33 53 38Q72 38 78 54Q81 70 60 76Q40 82 27 66Q22 58 28 47Z':gila?'M25 51Q31 40 48 42Q68 38 78 49Q85 63 71 71Q51 77 32 67Q23 62 25 51Z':'M29 49Q36 38 52 41Q70 36 79 47L81 59Q74 72 51 68L34 65Q25 61 29 49Z';
   let marks=gila?dots([[32,49],[39,45],[47,48],[55,44],[63,48],[72,48],[36,57],[44,61],[54,57],[64,62],[71,56]],accent,2.2):l('M34 48l7 5m6-8 7 5m5-6 7 4m-25 11 6 3m8-4 7 3',cream,1.1);if(gila)marks+=dots([[35,52],[43,53],[51,49],[59,54],[66,51]],light,.65);
   art+=coat(body,marks)+p('M40 60Q29 57 25 69L17 75L19 80L30 76L46 68M63 59Q72 64 70 75L82 83L88 81L78 73L75 58Z',base,1.4);
   art+=p(horned?'M64 46Q68 34 81 39L90 47L91 57Q85 66 74 64L64 57Z':gila?'M66 45Q73 35 85 41Q97 45 97 56Q93 65 80 63L68 58Z':'M68 45Q73 33 84 40L98 51L97 58Q91 65 79 61L68 55Z');
   if(horned)art+=p('M66 44L62 37L69 39L71 32L76 39L81 34L83 41L89 39L88 47Z',accent,1.2)+l('M30 46l-7-3 2 8-7 1 7 7M26 64l-5 4 8 1M72 69l5 4-1-8',dark,1);
   else if(basilisk)art+=p('M73 40Q57 17 66 14Q78 17 84 39Z',base,1.5)+l('M68 20Q76 25 79 37',light,1)+l('M19 77l-6 4m9-5-1 7m61-3 10 2m-9-1 4 7',dark,.9);
   else if(!gila)art+=l('M35 42l2-6 3 5 4-6 3 5 4-5 3 5 5-4 3 5M12 55l3 6m3-8 4 5m2-5 4 5',dark,1.5);
   if(gila)art+=dots([[73,43],[82,44],[89,47],[77,51],[86,55],[75,58]],accent,1.8)+l('M10 56l7 7M14 68l8-3',accent,3.1);
   art+=eye(85,46,1.35)+l('M88 57L97 55',dark,1)+l('M18 78l-5 2m6-2v5m3-6 3 3M83 80l7 1m-7 0 2 5',dark,.85);
  }
 }else if(cls==='Actinopterygii'){
  const pike=g==='Esox',perch=g==='Perca';
  art+=p(pike?'M25 49Q16 43 6 37L11 53L5 73Q17 65 26 61Z':'M25 48Q15 41 7 39L11 54L7 72Q18 68 27 61Z',shade,1.5)+l('M11 43L21 52M11 67L21 58',light,.9);
  body=pike?'M21 49Q41 39 65 43L79 47Q88 44 98 47L99 54Q89 64 66 66Q44 68 22 61Z':perch?'M23 48Q36 31 58 35Q80 35 94 49L97 56Q82 76 55 74Q35 73 23 61Z':'M22 49Q40 35 63 39Q82 39 96 50L98 56Q83 72 55 69Q36 69 22 60Z';
  let marks='';if(perch)marks=l('M34 42L37 63M45 37L48 68M58 37L61 69M71 42L73 65',dark,3.3);else if(pike)marks=dots([[33,50],[42,48],[52,50],[62,49],[38,59],[48,58],[59,60],[68,56]],cream,1.3);else marks=l('M29 47q3-5 6-1t6-1 6-1 6-1 6 0m-29 7q3-4 5-1t5-1 5 0',dark,.9)+[[35,56],[45,53],[56,57],[65,51],[71,59]].map(([x,y])=>dot(x,y,1.65,'#8ca7a5')+dot(x,y,.85,'#c19994')).join('');
  art+=coat(body,marks);
  art+=p(pike?'M66 44Q69 32 77 30Q80 36 85 48Z':perch?'M31 43L33 27Q36 28 39 32L41 24Q46 25 48 31L51 25Q57 27 58 39Q64 28 69 29L79 44Z':'M42 40Q45 28 52 26Q58 33 64 41Z',shade,1.3);
  if(perch)art+=l('M35 31L38 42M43 29L46 40M52 30L55 40M67 32L71 42',light,.85);else art+=l(pike?'M72 35L74 45M77 35L80 46':'M49 31L51 40M54 33L57 41',light,.85);
  if(!pike&&!perch)art+=p('M73 41Q75 34 80 39L81 44Z',shade,1.0);
  art+=p(pike?'M66 65Q70 76 78 76L82 64Z':'M43 70Q44 82 53 84L62 72Z',accent,1.2)+p('M74 55Q64 54 59 65Q69 71 78 60Z',accent,1.1)+l('M74 57L64 64M72 60L66 66',light,.7);
  if(g==='Salvelinus')art+=l('M44 72Q46 81 52 82M60 64L66 68',cream,1.4);
  art+=l(pike?'M82 54L99 52':'M86 56L96 54',dark,1)+l('M79 45Q73 53 79 63',dark,1)+eye(pike?89:87,48,1.6);
 }else return null;
 const type={Mammalia:'mammal',Aves:'bird',Reptilia:'herp',Amphibia:'herp',Actinopterygii:'fish'}[cls];
 return `<svg viewBox="0 0 100 100" aria-hidden="true" data-na-version="3.22.1" data-na-profile="${sp.artProfile}" data-na-polish="AM-03" data-zoological-family="${f}" data-${type}-family="${f}"${sex?` data-na-sex="${sex}"`:''}>${art}</svg>`;
}
render.targets=Object.freeze([...targets]);render.classify=sp=>sp?.origin==='na3220'&&targets.has(sp.latin)?{family:sp.family,profile:sp.artProfile}:null;
root.ATLAS_NORTH_POLISH_V3221=render;if(typeof module==='object'&&module.exports)module.exports={renderPolishedNorthAmerican:render,targets:render.targets};
})(typeof globalThis!=='undefined'?globalThis:this);
