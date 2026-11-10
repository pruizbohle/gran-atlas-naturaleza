/* GM-02B candidate zoological profiles. Pure SVG, deterministic, no game state.
 * Scoped to oc3290: previous continents and shared future identities keep their IDs.
 * Pigmentation and specimen halos are applied by the existing production SVG router.
 */
(function(root){'use strict';
function render(sp,color,skin='normal',sex=null){
 if(!sp||sp.origin!=='oc3290')return null;
 const profile=sp.artProfile,g=sp.latin.split(' ')[0],latin=sp.latin,female=sex==='female';
 const ink='#37463b',c=color||sp.color,light='#d9d4b8',dark='#58634e',black='#38473f',white='#e8e3cd',blue='#658c9b',yellow='#c8b36d',red='#b27d66';
 const p=(d,fill=c,w=1.2,stroke=ink)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
 const l=(d,col=ink,w=1.1)=>p(d,'none',w,col),e=(x,y,rx,ry,fill=c,w=1.1)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${ink}" stroke-width="${w}"/>`,eye=(x,y,r=1.4)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#202d29" stroke="${ink}" stroke-width=".4"/><circle cx="${x-.35}" cy="${y-.4}" r=".35" fill="#faf4eb"/>`;
 const spots=(points,fill=light,r=1.5)=>points.map(([x,y])=>e(x,y,r,r,fill,.3)).join('');
 let a='',route=profile;
 // Reuse the exact compatible canid/otariid anatomy rather than another marsupial body.
 if(['dingo','fur-seal'].includes(profile)&&root.ATLAS_MAMMAL_ART_V3194){
  const svg=root.ATLAS_MAMMAL_ART_V3194(sp,c,'normal',sex,sp.id);
  if(svg)return svg.replace('<svg ',`<svg data-oc-profile="${profile}" data-oc-species="${sp.artProfile+'-'+sp.latin.replace(/ /g,'-')}" data-zoological-family="${sp.family}" `);
 }
 if(sp.latin==='Aquila audax'&&root.ATLAS_BIRD_ART_V3193){
  const svg=root.ATLAS_BIRD_ART_V3193(sp,c,'normal',sex);
  if(svg)return svg.replace('<svg ',`<svg data-oc-profile="${profile}" data-oc-species="Aquila-audax" data-zoological-family="${sp.family}" `);
 }
 if(profile==='macropod'&&g==='Setonix'){
  a+=p('M32 65Q16 70 13 83L19 84Q25 77 38 74Z',dark)+p('M31 49Q24 39 40 34Q62 28 67 47L68 68Q61 82 44 79Q29 77 31 49Z')+p('M42 63Q55 59 57 70L48 81L65 83L66 87L42 87Q38 83 45 74Z',dark)+p('M57 50Q63 54 68 63L74 64L73 68Q61 68 56 59Z')+e(58,30,6,8,c)+e(75,29,5,7,c)+p('M54 35Q53 23 66 23Q81 23 83 36L87 41L83 46Q72 54 59 46Z')+e(77,41,8,5,light,.7)+eye(76,32,1.6)+e(85,39,2,1.5,black)+l('M77 45L82 44',dark,.6);
 }else if(profile==='macropod'){
  const small=['Setonix','Thylogale'].includes(g)||latin==='Notamacropus eugenii',ear=small?22:9;
  a+=p('M40 65Q23 83 5 88Q20 90 46 77L57 71Z',dark)+p(small?'M37 57Q32 43 42 38Q58 32 65 43L67 62Q68 76 55 79Q40 80 37 57Z':'M39 67Q32 48 45 38Q57 29 62 39L67 59Q69 74 56 80Q44 80 39 67Z');
  a+=p('M46 61Q65 59 65 74L54 83L76 84Q82 88 71 89L44 88L51 74Q42 71 46 61Z',c)+p('M56 42Q54 32 60 27L63 '+ear+'Q67 7 69 30L74 28L78 '+(ear+3)+'Q82 17 80 35Q84 39 93 40L91 47Q81 50 69 46L63 53Z');
  a+=p('M66 48Q68 56 77 60L75 64L63 58L60 50Z',dark)+e(85,42,2.5,1.7,ink)+eye(78,36)+l('M65 29L65 '+(ear+7),red,1.4)+l('M77 31L78 '+(ear+9),red,1.1);
  a+=p('M49 50Q48 60 59 64L60 52Z',light,.5)+l('M44 84L46 87M48 84L50 87M68 84L70 88',ink,.7);
  if(g==='Macropus'){a+=l('M54 41Q48 47 48 56',dark,1.3);if(latin.includes('fuliginosus'))a+=p('M73 35Q85 37 90 42L85 45L73 42Z',dark,.3);else a+=p('M68 45Q74 49 83 47L78 51L68 50Z',light,.3);}if(g==='Notamacropus'||g==='Petrogale')a+=l('M58 45Q53 46 49 50',light,2.4);
  if(latin.includes('rufogriseus'))a+=p('M43 39Q51 33 57 38L57 45L44 49Z','#a37f65',.4);
  if(g==='Petrogale')a+=p('M5 88L16 82L22 85L13 90Z',dark,.4)+l('M56 56L61 64',dark,2);
  if(g==='Setonix')a+=e(66,28,5,7,c)+p('M71 43Q76 47 82 44',light,.5);
 }else if(profile==='tree-kangaroo'){
  a+=l('M10 84L93 67',dark,6)+p('M37 61Q16 54 15 31Q17 19 23 19Q25 20 24 27Q17 48 46 51Z',light)+p('M34 46Q27 56 38 68Q50 78 64 63L70 42Q62 29 49 34Z');
  a+=p('M60 45Q70 48 74 60L83 66L78 70L65 65L55 51Z',light)+p('M42 62Q56 59 59 70L52 78L66 77L66 82L45 84L43 79L49 71Z',dark)+p('M60 37Q60 24 70 24L74 15Q82 13 81 26L87 33L95 36L93 42L80 46L69 42Z');
  a+=e(77,21,3,4,dark)+p('M65 32Q70 28 80 29L86 39L78 42L68 37Z',dark,.5)+eye(83,33)+e(92,37,2,1.4,ink)+l('M76 64L80 67M73 66L76 69M52 79L55 82',ink,.8);
  if(latin.includes('goodfellowi'))a+=l('M37 47Q44 43 51 46M36 51Q44 47 51 50',light,2.2);
 }else if(profile==='koala'){
  a+=l('M39 94L48 18',dark,9)+p('M48 58Q35 38 51 33Q72 27 79 45L75 69Q68 83 51 78Z');
  a+=p('M55 59Q39 56 37 68L47 70L60 68Z',dark)+p('M69 66Q64 77 50 78L44 88L50 91L65 81L76 77Z',dark);
  a+=e(57,28,10,11,light)+e(83,28,10,11,light)+p('M54 30Q60 20 74 22Q91 26 86 45Q82 56 66 52Q53 48 54 30Z')+e(71,38,5,8,black)+eye(60,35)+eye(81,35)+l('M66 48Q72 50 77 47',ink,.8)+l('M44 67L47 65M44 70L48 68M46 87L50 85',light,1);
 }else if(profile==='wombat'){
  a+=p('M13 65Q7 39 31 35Q54 26 72 42L83 64Q80 76 62 77L25 78Z')+p('M21 61Q18 70 20 79Q21 85 31 83L34 79L31 74L36 65M53 62Q50 73 54 80Q57 86 67 83L69 79L63 75L70 64',dark)+p('M63 42Q65 31 77 33L82 25Q89 25 88 40L94 55L94 66Q84 76 69 68L62 55Z')+e(88,58,5,4,black)+eye(81,48)+l('M23 79L25 83M27 80L29 84M57 80L59 84M62 80L64 84',ink,1.1)+p('M68 57Q73 64 83 64L79 69L70 65Z',light,.3);
 }else if(['echidna','long-beaked-echidna'].includes(profile)){
  const long=profile==='long-beaked-echidna';
  a+=p('M13 66Q12 36 38 33Q64 28 72 53L78 68L65 76L24 75Z',dark)+p('M22 64L19 80L27 81L33 65M54 65L55 80L64 80L67 64',c);
  for(let i=0;i<13;i++){const x=18+i*3.5,y=45-Math.sin(i/12*Math.PI)*10;a+=p(`M${x} ${y+18}L${x-3} ${y-8}L${x+6} ${y+13}Z`,i%2?light:c,.5);}
  a+=p(long?'M64 57Q71 48 78 59Q85 69 96 69L95 73Q82 77 75 68L65 68Z':'M65 56Q74 48 80 59L96 63L95 68L78 68L67 70Z',c)+eye(74,59,1.1)+e(94,long?71:65,1,1,ink,.3)+l('M22 78L20 83M26 78L25 83M58 78L56 83M63 78L62 83',ink,1);
 }else if(profile==='platypus'){
  a+=p('M32 53Q15 44 5 56Q3 65 13 71Q27 74 38 63Z',dark)+p('M23 54Q29 39 52 40Q74 39 82 52L80 66Q62 78 37 69Z')+p('M34 62L24 75L28 79L34 77L38 80L44 75L47 62M60 61L59 76L64 79L68 75L73 78L78 74L76 61',dark)+p('M69 50Q77 42 84 48L87 53L96 52Q99 58 94 64L82 66L77 60L71 61Z','#a29b7d')+eye(81,50)+l('M86 58L96 57',dark,.7)+l('M29 73L34 76M35 70L38 76M65 70L68 75M72 69L74 75',light,.7);
 }else if(['possum','glider'].includes(profile)){
  const glide=profile==='glider',brush=g==='Trichosurus';
  a+=l('M11 86L94 72',dark,4)+p(brush?'M39 63Q20 53 11 64Q1 80 14 83Q19 83 20 77Q11 70 22 68L40 72Z':'M39 63Q15 53 13 69Q10 85 26 85Q37 83 31 76Q27 71 23 77Q17 75 22 70L42 71Z',glide?c:light);
  if(glide)a+=p('M42 42Q29 57 23 68Q39 65 45 78Q63 69 78 68Q64 55 66 39Z',light);
  a+=p('M32 55Q27 45 40 39Q56 31 69 44L77 60Q73 73 55 75Q36 73 32 55Z');
  a+=p('M44 61Q48 66 45 72L39 76Q39 80 47 79L50 76L54 65M66 55Q73 57 73 67L80 71Q84 75 78 76L69 73Q65 71 66 65Z',dark)+e(68,36,g==='Petauroides'?8:6,g==='Petauroides'?9:7,c)+e(84,36,g==='Petauroides'?7:5,g==='Petauroides'?8:6,c)+p('M65 43Q73 32 83 39L95 50L92 56L79 59L66 53Z')+eye(80,44,1.8)+e(93,51,2,1.6,red)+l('M80 54L88 56',dark,.6);
  if(g==='Dactylopsila')a+=l('M35 48Q47 36 62 44M34 56Q47 45 61 50M67 42L78 53',black,4);
  if(g==='Spilocuscus')a+=spots([[36,48],[45,43],[48,55],[39,62],[56,46],[60,59]],dark,3);
  if(glide)a+=l('M42 42Q48 50 55 70M69 38L78 46',black,2)+l('M40 76L44 73M71 71L77 71',light,.8);
 }else if(['mulgara','quoll','tasmanian-devil','numbat','bilby','dingo','fur-seal'].includes(profile)){
  const bilby=profile==='bilby',devil=profile==='tasmanian-devil',numbat=profile==='numbat';
  a+=p(devil?'M28 61Q8 63 8 76L15 76Q18 70 36 71Z':numbat?'M34 61Q13 53 7 30Q3 39 7 53Q12 72 36 72Z':bilby?'M32 66Q11 67 6 79L10 82Q20 76 37 76Z':'M32 60Q15 58 7 72L10 76Q22 68 36 69Z',dark);
  a+=p(devil?'M25 49Q48 29 67 46L78 63L67 75L33 74Q21 66 25 49Z':'M24 56Q35 37 59 47L76 60L70 72L35 73Z')+p('M32 61Q30 68 29 73L26 78Q25 82 36 81L39 76L43 65M61 60Q63 68 62 75Q62 81 73 81L75 78L70 75L74 65',dark);
  if(bilby)a+=p('M63 52L62 17Q66 9 69 16L74 45L78 18Q83 12 84 19L82 50Z')+l('M66 20L69 44M81 23L79 44',red,3);
  else a+=p(devil?'M62 43L64 31Q73 26 77 38L88 41L95 54L92 66L73 68L63 58Z':'M62 49L67 32Q76 27 78 42L91 51L98 59L92 64L74 63Z');
  a+=p(bilby?'M64 47Q76 40 82 51L97 61L94 65L76 62L64 58Z':devil?'M75 53Q87 46 95 54L93 63L80 64Z':'M77 52L96 59L92 64L77 61Z',devil?c:light)+eye(devil?82:79,devil?47:50)+e(devil?93:96,devil?56:61,2,1.5,ink);
  if(devil)a+=p('M43 44L50 46L57 58L69 55L70 62L53 67L46 53Z',white,.4);
  if(profile==='quoll')a+=spots([[34,53],[45,49],[55,51],[30,62],[42,59],[52,64],[61,60]],white,1.5);
  if(numbat){for(let x=31;x<57;x+=5)a+=l(`M${x} 49L${x+3} 69`,white,2.5);a+=l('M69 50L82 54',black,2);}
  if(bilby)a+=p('M7 77L19 72L20 77L10 82Z',white,.5);
  if(profile==='mulgara')a+=l('M8 70L11 65L15 66L17 62L23 63',black,2);
 }else if(profile==='flying-fox'){
  a+=p('M47 40Q29 16 4 27L12 47L7 68Q22 57 30 70Q38 59 46 65L50 81L56 66Q67 59 76 71Q83 57 95 66L91 46L97 25Q73 17 54 40Z',dark)+p('M45 39Q52 32 59 42L61 65L53 80L45 65Z',c)+l('M47 43L8 29L19 52M46 45L30 67M56 43L92 28L81 53M58 46L76 68',light,1)+p('M45 39L43 24L49 30Q54 26 58 31L63 24L61 42L56 46L49 44Z')+e(53,38,6,5,c)+eye(49,34,1)+eye(58,34,1)+e(54,40,2,1.5,black);
  if(latin.includes('conspicillatus'))a+=l('M46 34Q50 31 52 35M55 35Q58 31 61 34',light,2);else a+=p('M45 29Q53 24 61 30L62 34Q53 30 45 34Z',light,.5);
 }else if(profile==='hector-dolphin'){
  a+=p('M22 57L5 44L9 57L4 69L24 63Z',dark)+p('M17 56Q43 31 70 45Q80 48 89 50L97 58L91 62L80 61Q50 78 17 65Z',c)+p('M42 46Q47 24 54 33L59 43Z',black)+p('M59 61L69 77Q74 78 72 67L68 58Z',black)+p('M25 63Q52 75 83 58L86 63Q55 80 26 69Z',white,.5)+p('M79 48Q84 49 90 51L93 57L82 57Z',black,.4)+eye(83,53,1)+l('M88 59L96 58',black,.8);
 }else if(sp.taxonomy.className==='Aves'){
  const kiwi=profile==='kiwi',ratite=['cassowary','emu'].includes(profile),penguin=profile==='yellow-eyed-penguin',swan=profile==='black-swan',pelican=profile==='australian-pelican',paradise=profile==='bird-of-paradise';
  if(kiwi){
   const speckled=!latin.includes('mantelli'),big=latin.includes('haastii')||latin.includes('maxima');
   a+=p(big?'M14 62Q12 34 39 31Q62 24 70 43L70 67Q54 81 29 78Z':'M19 65Q15 43 37 37Q57 30 67 43L66 68Q52 80 31 77Z')+p('M53 45Q54 28 66 28Q80 27 81 42L99 57L97 60L77 48Q68 53 60 56Z')+eye(72,36,1.2)+p('M33 73L33 86L26 92L41 91M53 73L54 86L47 93L63 90',c)+l('M80 43L97 57',light,.7);
   for(let x=25;x<59;x+=5)a+=l(`M${x} 45q-3 8 0 16m3-12q-2 7 0 14`,speckled?light:dark,.8);
   a+=e(96,57,.65,.65,ink,.2);
  }else if(ratite){
   a+=p('M23 68Q12 57 20 41Q29 27 50 31L64 41L66 62Q55 78 33 75Z',c)+p('M54 43Q62 34 62 22Q61 10 72 12L80 18L79 24Q68 26 68 44L62 57Z',profile==='cassowary'?blue:c)+p('M69 16L81 17L89 22L79 24L71 23Z',dark)+eye(74,17,1.2)+p('M34 70Q34 79 37 86L36 90L41 90L41 85L39 72M51 69Q51 78 55 85L54 90L59 90L59 85L56 71',c)+l('M38 89L29 94M38 89L39 95M39 89L47 92M56 89L49 94M56 89L58 95M57 89L65 92',dark,1.3);
   for(let x=23;x<53;x+=5)a+=l(`M${x} 39q-3 6 0 11q-2 9 2 18`,light,.7);
   if(profile==='cassowary')a+=p('M64 14Q68 1 76 5L79 16Z','#9d9270')+p('M66 28L64 42L68 41L71 28Z',red,.5);else a+=l('M65 27L65 39',dark,3);
  }else if(penguin){
   a+=p('M34 31Q37 16 53 16Q69 18 68 37L72 68Q67 85 49 85Q29 85 28 69Z',dark)+p('M41 38Q47 32 58 39L63 68Q63 81 49 81Q36 80 36 65Z',white)+p('M35 40L21 69Q20 75 24 72L39 53M64 40L79 68L78 73L65 56',dark)+p('M38 83L29 90L46 89M56 83L54 90L70 89',red)+p('M59 24L78 31L62 34Z',red)+eye(59,25,1.7)+l('M39 23Q53 15 64 24',yellow,3)+l('M44 84L42 88M59 84L61 88',ink,.7);
  }else if(profile==='eagle'){
   a+=p('M33 63L15 85L31 87L45 70Z',dark)+p('M29 48Q25 36 44 32Q64 26 74 45L70 65Q55 82 37 72Z',c)+p('M34 42Q48 33 60 43L64 65L41 76L29 71Z',dark)+l('M36 47Q48 39 57 47M36 53Q47 46 59 54M35 60Q47 53 60 61M33 67L57 65',light,1)+p('M57 37Q53 20 68 19Q82 18 83 31L90 34L89 40L81 43L77 54L65 49Z',c)+p('M77 29Q93 27 93 37L87 43L86 35L79 36Z',yellow)+eye(74,29,1.8)+p('M43 71L40 84L33 89L44 88L48 81L51 70M62 69L64 82L73 88L61 87L59 79L57 72',yellow)+l('M33 89L32 92M38 88L38 91M44 88L46 91M65 87L66 90M71 88L74 90',dark,.8)+p('M59 23L53 9L65 17L67 7L75 22Z',c,.8);
  }else if(profile==='albatross'){
   a+=p('M17 64Q26 40 53 40L72 51L73 68Q51 81 24 76Z',white)+p('M27 52Q42 43 63 48L70 60L17 73L7 72Z',white)+p('M10 67L27 65L31 70L16 75L6 73Z',black,.7)+l('M28 54L58 54M23 61L53 59M17 67L46 64',dark,.7)+p('M58 45Q55 29 68 27Q81 26 83 36L80 47L69 54Z',white)+p('M78 33L96 35Q99 38 97 44L93 47L92 40L80 41Z','#c5b791')+eye(73,34,1.4)+l('M84 35L89 36',dark,.8)+p('M39 75L37 85L28 89L45 88M60 74L62 85L72 90L55 88',red,.8);
  }else if(swan||pelican){
   a+=p('M11 62Q20 46 45 53L61 64Q56 79 33 79Q14 78 11 62Z',swan?black:white)+p(swan?'M49 61Q68 58 62 39Q48 21 61 16Q73 13 76 24L75 40Q87 63 65 73L47 71Z':'M48 59Q68 52 66 33Q64 17 75 16Q87 15 87 28L79 35L78 58L65 72Z',swan?black:white);
   a+=p(swan?'M73 22L88 26L88 31L75 31Z':'M81 25L99 38L98 43L76 36Z',swan?red:'#c4ad7f')+eye(swan?70:78,swan?23:24)+p('M24 63Q36 53 50 65L42 73L23 73Z',swan?dark:'#7f8b7c')+p('M30 77L27 88L21 91L37 90M48 77L49 88L58 91L43 90',dark);
   if(pelican){
    a=p('M12 62Q20 43 48 48L63 61Q59 80 32 79Q15 77 12 62Z',white)+p('M19 58Q33 45 52 57L54 71L21 72Z',dark)+p('M49 59Q63 57 60 37Q55 19 66 18Q77 16 78 29L71 39L74 57L64 72L49 71Z',white)+p('M72 26L98 36L98 40L72 35Z','#c5b28c')+p('M72 34L98 40Q92 53 77 43Z','#c7bca0')+eye(68,25,1.2)+p('M31 77L28 88L20 91L38 90M50 77L50 88L61 91L43 90',dark);
   }else a+=l('M24 69Q35 65 45 68',white,1.5);
  }else{
   const owl=profile==='owl',eagle=profile==='eagle',cockatoo=profile==='cockatoo',parrot=['parrot','kakapo'].includes(profile),forest=profile==='forest-bird',kooka=profile==='kookaburra',albatross=profile==='albatross',rail=profile==='rail',kakapo=profile==='kakapo';
   let plumage=c,head=c,breast=c,tail=c;
   if(g==='Trichoglossus'){head=blue;breast=latin.includes('moluccanus')?red:'#a57760';tail='#6d8952';}
   if(g==='Gymnorhina'){plumage=black;head=black;breast=white;tail=black;}
   if(g==='Hemiphaga'){head='#607c71';plumage='#6d8877';breast=white;}
   if(g==='Callaeas'){plumage='#7d8c8b';head=plumage;breast=plumage;}
   if(g==='Petroica'){plumage='#65716b';head=plumage;breast=light;}
   if(g==='Phylidonyris'){plumage=black;head=black;breast=white;}
   if(g==='Ptilonorhynchus'){plumage=female?'#8b9b70':'#4c6274';head=plumage;breast=plumage;tail=plumage;}
   if(g==='Eolophus'){head=red;breast=red;plumage='#8b9994';}
   if(g==='Nymphicus'){head=female?'#9a9e91':yellow;plumage='#8d9890';breast=plumage;}
   if(g==='Porphyrio'){head='#698aa0';plumage='#637b87';breast='#667d9a';}
   if(paradise&&female){head='#87785e';breast='#b5a284';plumage='#8b7e63';tail=plumage;}
   const longtail=['Nymphicus','Trichoglossus','Melopsittacus','Menura','Rhipidura'].includes(g),heavy=cockatoo||kakapo||g==='Hemiphaga',beak=parrot||cockatoo;
   // Tail originates under the rump, before the overlapping body and folded wing.
   a+=p(longtail?'M35 61L4 91L12 94L44 70Z':kakapo?'M33 64L15 79L39 76Z':'M34 60L12 76L20 80L44 70Z',tail);
   if(g==='Rhipidura'){
    a+=p('M35 66L5 64L7 45L17 31L30 27L38 33L44 53Z',dark);for(let x=10;x<=35;x+=5)a+=l(`M36 65L${x} ${28+Math.abs(25-x)}`,light,1);
   }
   if(g==='Menura')a+=l('M30 65Q8 37 11 12Q26 10 31 42M30 65Q2 55 5 22Q17 14 25 33',light,3)+l('M29 64Q12 47 14 23M30 63Q20 33 21 21',dark,1);
   if(albatross)a+=p('M40 48Q15 21 4 22L19 43L43 64Z',white);
   a+=p(heavy?'M29 52Q31 35 50 36Q69 33 75 49L73 68Q58 83 38 73Z':owl?'M31 43Q34 23 53 25Q73 25 72 49L69 70Q51 83 35 70Z':'M29 55Q32 40 51 41Q69 37 74 50L72 66Q57 79 39 72Z',plumage);
   if(breast!==plumage)a+=p('M60 46Q78 44 72 64Q66 76 49 75L54 61Z',breast,.4);
   a+=p(heavy?'M33 49Q40 40 54 46L60 66Q42 72 34 62Z':'M32 52Q40 44 53 49L60 65Q44 72 35 65Z',plumage)+l('M37 53Q45 48 53 53M38 58Q48 53 56 59M39 63Q49 59 58 64',dark,.8);
   a+=p('M43 72L43 83L35 88L50 86M60 71L62 83L55 89L71 87',rail?red:dark,.9);
   a+=p(owl?'M37 32Q39 21 54 22Q70 23 70 39L66 49L45 49L36 42Z':heavy?'M55 44Q50 24 67 23Q82 22 83 37L78 49L67 53Z':'M56 45Q53 28 68 27Q82 27 82 39L75 49Z',head);
   if(owl){a+=e(47,37,7,8,light)+e(62,37,7,8,light)+eye(47,36,2.2)+eye(62,36,2.2)+p('M51 42L55 49L59 42Z',dark,.7);}
   else{
    a+=p(kooka?'M78 34L98 40L97 46L79 44Z':albatross?'M78 34L96 37L98 43L94 46L81 42Z':beak?'M77 34Q92 32 87 44L80 51L81 42L76 40Z':eagle?'M78 33Q92 32 91 42L85 46L85 39L79 41Z':rail?'M78 34L89 38L87 45L78 43Z':'M78 35L91 39L79 42Z',beak||eagle?dark:rail?red:'#baa47a')+eye(71,34,1.7);
   }
   if(cockatoo){
    const crest=g==='Nymphicus'?'M61 27L57 8L66 17L68 9L72 26Z':g==='Eolophus'?'M56 28Q54 16 69 17L78 26Z':'M57 29Q48 12 55 9L61 19L60 6L66 8L70 24L73 11L78 16L76 29Z';
    a+=p(crest,g==='Cacatua'||g==='Nymphicus'?yellow:g==='Eolophus'?'#c8adab':head,.8);
    if(g==='Calyptorhynchus')a+=p('M16 74L30 67L35 74L23 80Z',female?yellow:red,.4);
    if(g==='Zanda')a+=p('M16 74L30 67L35 74L23 80Z',white,.4)+e(68,42,4,3,white,.5);
    if(g==='Nymphicus'){a+=e(74,41,3,3,red,.3)+p('M33 52L40 48L49 65L44 68Z',white,.4);if(female)a+=l('M10 87L17 87M15 81L23 81M19 76L27 76',yellow,1.4);}
   }
   if(g==='Melopsittacus'){a+=p('M60 29Q68 22 76 29L77 35L65 35Z',yellow,.4);for(let y=46;y<63;y+=4)a+=l(`M34 ${y}L48 ${y+5}`,black,1);}
   if(g==='Neophema')a+=e(64,65,5,3,red,.3)+l('M61 29L76 29',blue,2);
   if(g==='Trichoglossus'){a+=p('M61 41L76 43L73 49L61 47Z',yellow,.3);if(latin.includes('haematodus'))a+=l('M62 53L73 56M59 58L72 61',black,1.3);}
   if(g==='Nestor')a+=p('M78 32Q94 35 86 51L82 51L84 39Z',dark,.8)+p('M35 54L41 50L51 65L45 67Z',latin.includes('notabilis')?red:'#a77559',.5);
   if(g==='Callaeas')a+=e(76,44,3,4,blue,.5);
   if(kooka)a+=l('M62 36L78 38',dark,2)+p('M37 50L44 48L55 63L48 66Z',latin.includes('leachii')?blue:'#84939a',.5);
   if(g==='Phylidonyris')a+=l('M64 30L68 39M40 52L48 58',yellow,2.4);
   if(g==='Ptilonorhynchus'&&female)a+=spots([[42,49],[47,55],[53,62],[62,61],[58,52],[43,63]],light,1.1);
   if(kakapo)a+=spots([[37,46],[46,42],[52,50],[41,60],[48,66],[63,58],[68,49]],dark,1.5)+l('M61 31Q67 25 74 32M59 35Q66 39 76 36',light,1.4);
   if(eagle){a+=p('M16 72L26 65L31 73L24 81Z',dark,.6);if(g==='Harpyopsis')a+=p('M57 30L51 18L64 24L63 14L73 27Z',head,.7);}
   if(paradise&&!female){
    if(g==='Lophorina')a=p('M19 67Q7 38 23 16Q52 2 82 18Q99 42 83 68Q57 86 19 67Z',black)+p('M30 44Q51 33 75 44L66 55L39 55Z',blue,.6)+e(43,31,2.2,1.6,blue,.5)+e(62,31,2.2,1.6,blue,.5)+p('M48 38L55 39L53 43Z',dark,.5)+l('M42 73L40 87M62 73L65 87',dark,2);
    if(g==='Cicinnurus'){
     a+=p(latin.includes('regius')?'M56 44Q55 25 69 25Q84 25 81 40L75 48Z':'M57 42Q51 24 67 23Q84 23 81 39L75 47Z',latin.includes('regius')?red:blue,.6)+eye(73,33);
     a+=p('M46 57Q56 66 69 57L67 71L49 74Z',white,.4)+l('M32 66Q7 76 16 91Q26 97 28 87Q29 80 20 83M33 68Q38 83 31 93Q18 98 20 89',g==='Cicinnurus'?dark:c,1.5);
     if(latin.includes('respublica'))a+=l('M61 25L78 35M58 30L76 39',black,1)+p('M47 43L57 39L64 48L53 51Z',yellow,.4);
    }
    if(g==='Paradisaea'){
     a+=p('M55 43Q51 24 67 24Q83 24 81 40L74 48Z',yellow,.6)+eye(72,33)+p('M58 43L75 43L69 54L58 52Z','#54725d',.5);
     for(let i=0;i<7;i++)a+=l(`M${40+i*2} 57Q${15+i*4} 70 ${7+i*7} 95`,i%2?light:yellow,2);
    }
    if(g==='Seleucidis'){
     a+=p('M35 55Q46 49 57 57L56 73L38 72Z',yellow,.4);
     for(let i=0;i<6;i++)a+=l(`M${37+i*3} 66Q${7+i*5} 82 ${5+i*7} ${87+i%2*5}`,dark,.7);
    }
   }
  }
 }else if(sp.taxonomy.className==='Reptilia'||sp.taxonomy.className==='Amphibia'){
  if(['elapid','tiger-snake','death-adder','python','green-tree-python'].includes(profile)){
   const adder=profile==='death-adder',tree=profile==='green-tree-python';
   a+=p(tree?'M17 63Q28 32 61 45Q81 50 70 67Q61 84 40 70Q26 58 49 54L76 49L84 44L94 47L96 55L83 59L73 57Q52 69 47 66Q54 81 70 77Q94 72 87 51Q81 34 54 34Q26 34 17 63Z':adder?'M5 76Q13 61 31 69Q47 77 61 67Q75 52 54 47Q33 43 26 57Q26 65 41 65L44 74Q22 78 14 64Q7 48 28 38Q47 29 71 39Q93 51 79 70Q64 88 35 80L15 77Z':'M6 76Q21 59 37 70Q56 82 72 65Q84 47 66 43Q52 39 47 49Q39 64 26 56Q15 48 27 34Q43 20 64 29L80 36L92 34L98 41L96 48L82 50L71 43Q50 30 37 40Q31 45 35 47Q41 50 47 39Q59 27 78 37Q98 49 84 70Q64 95 35 80Q20 72 6 79Z',c,1.4);
   if(adder){a+=p('M55 41L75 35L93 39L99 46L94 53L77 51L66 47Z',c)+l('M26 39L32 46M39 35L42 44M54 35L56 43M72 64L78 69M44 74L45 81',dark,4)+eye(88,42,1.3);}
   else{a+=eye(tree?91:91,tree?49:40,1.4)+l(tree?'M92 54L97 53':'M91 46L97 44',dark,.8);if(profile==='tiger-snake')a+=l('M29 31L34 38M43 28L46 34M58 31L60 36M76 57L83 61M59 73L61 81M40 74L42 81',yellow,3);if(profile==='python')a+=spots([[30,34],[44,29],[59,32],[76,54],[69,71],[52,77],[36,75]],light,2.5);if(tree)a+=spots([[34,41],[45,39],[57,42],[68,45],[65,64],[53,69]],light,1.4);}
   if(latin==='Oxyuranus microlepidotus')a+=p('M81 35Q88 31 94 37L98 40L96 47L85 49L78 43Z',dark,.8)+eye(91,39,1.4)+l('M90 46L96 44',light,.6);
  }else if(profile==='crocodile'){
   const narrow=latin.includes('johnstoni');
   a+=p('M36 58Q15 56 4 75Q25 70 40 72Z',dark)+p('M29 55Q42 40 65 48L79 51L98 '+(narrow?52:latin.includes('novaeguineae')?53:54)+'L98 '+(narrow?57:latin.includes('novaeguineae')?59:62)+'L77 63Q56 78 30 70Z')+p('M40 65L34 80L45 83L51 68M68 62L71 77L84 78L81 73L77 59',dark)+e(76,50,5,3,c)+eye(76,49,1.2)+l('M79 59L97 58',dark,.9);
   for(let x=29;x<=68;x+=5)a+=p(`M${x} 49l3-5 3 5Z`,dark,.6);a+=l('M40 55L68 54M36 61L65 61M26 66L16 68',light,.9)+spots([[40,56],[50,56],[60,56],[38,62],[48,63],[57,63]],dark,1.1);
  }else if(['frog','pouched-frog','tree-frog','corroboree-frog'].includes(profile)){
   const tree=profile==='tree-frog',small=profile==='pouched-frog';
   a+=p('M35 55Q15 47 12 65L25 72L9 81L15 85L34 77L42 65M65 55Q87 48 90 65L77 73L94 81L88 85L67 77L59 65',c)+p(small?'M36 49Q49 40 63 48L68 66Q52 80 33 66Z':'M29 48Q48 35 69 47L73 65Q54 83 28 66Z')+p('M33 57Q30 65 28 71L35 76L38 78L36 81L28 77Q23 75 24 72L27 61M65 57Q70 62 73 70L67 77L63 79L65 82L74 76Q78 73 75 69L72 60',c)+p('M29 49Q26 30 38 29Q44 23 51 28Q63 22 73 32L73 49Q54 65 29 49Z')+e(36,32,5,6,c)+e(65,32,5,6,c)+eye(36,31,2.1)+eye(65,31,2.1)+l('M34 49Q49 50 68 48',dark,1.1);
   if(tree)for(const[x,y]of [[25,73],[36,80],[75,73],[65,81]])a+=e(x,y,2.4,1.8,light,.5);
   if(profile==='corroboree-frog')a+=l('M34 39Q27 51 38 66M43 35Q38 53 46 70M56 35Q64 52 56 70M67 40Q76 53 65 66M17 62L27 67M79 63L85 68',black,3.8);
   if(small)a+=l('M31 45L38 51M64 44L70 50',dark,2);
  }else{
   const skink=profile==='blue-tongued-skink',monitor=['perentie','sand-monitor','arboreal-monitor'].includes(profile),thorny=profile==='thorny-devil',frill=profile==='frilled-lizard';
   a+=p(monitor?'M45 54Q20 30 5 57Q5 75 20 80L19 75Q5 65 14 55Q23 48 39 65Z':'M40 57Q19 46 5 69Q23 60 43 71Z',dark);
   if(frill)a+=p('M65 36Q57 31 61 23L68 25Q67 17 75 18L79 24Q84 17 89 24L87 30Q98 28 98 37L91 42Q100 46 95 52L87 53Q89 65 81 66L76 58Q68 67 62 61L65 52Q56 50 58 43Z','#b1986c');
   a+=p(skink?'M24 55Q38 41 61 49L75 56L78 65L62 74Q40 80 26 68Z':'M31 55Q47 41 63 48L73 55L74 66Q52 80 31 67Z');
   a+=p(skink?'M37 63Q37 69 32 73Q27 77 35 80L40 78L40 73L45 67M61 64Q65 66 66 72L65 76Q70 80 76 77L75 74L71 72L70 65':'M42 63Q44 68 39 72L34 77Q31 82 39 83L43 81L42 77L49 71M65 57Q74 57 76 65L79 70L87 71Q91 76 85 77L75 74L70 66L69 62',dark);
   a+=p(monitor?'M61 49Q65 33 76 33L83 41L97 45L97 52L82 57L71 60Z':skink?'M58 53Q69 41 82 47L96 55L96 63L80 66L66 63Z':'M63 48Q65 36 76 35L86 40L98 47L95 54L79 59L69 60Z')+eye(skink?83:82,skink?51:43,1.5)+l(skink?'M83 61L96 60':'M84 52L97 50',dark,.9);
   if(skink)a+=p('M93 61L99 63L97 66L92 63Z',blue,.4)+l('M30 51L34 69M41 48L45 72M53 50L56 71',dark,3);
   if(thorny||profile==='bearded-dragon'||profile==='tuatara'){
    for(let x=28;x<65;x+=5)a+=p(`M${x} 52l3-${thorny?9:5} 3 6Z`,thorny?light:dark,.7);
    if(thorny){for(const[x,y]of [[37,59],[47,56],[56,59],[69,43],[82,38]])a+=p(`M${x} ${y}l2-7 3 6Z`,light,.6);}else if(profile==='bearded-dragon')a+=p('M78 54L74 64L89 57Z',dark,.7);
   }
   if(profile==='water-dragon')a+=l('M17 63Q9 53 4 48',dark,2)+p('M64 45L66 36L70 43L73 34L76 41Z',dark,.7);
   if(profile==='arboreal-monitor')a+=l('M21 54L13 47M19 57L11 52M18 62L10 59',yellow,1);
   if(profile==='sand-monitor')a+=l('M74 43L91 48',black,2.2)+l('M74 41L91 46',yellow,.9);
   if(profile==='perentie')a+=p('M84 44L99 47L98 52L83 54Z',c,.8)+l('M91 51L98 50',dark,.6);
   if(monitor)a+=spots([[37,54],[44,50],[51,54],[58,51],[39,62],[49,64],[59,60],[71,39],[77,42]],profile==='arboreal-monitor'?yellow:light,1.5)+l('M33 77L35 81M38 76L40 81M79 71L81 75M84 71L86 75',light,.8);
  }
 }else if(profile==='barramundi'){
  a+=p('M25 52L5 34L11 55L5 75L26 64Z',dark)+p('M20 52Q44 29 75 42L95 48L99 55L91 61L75 71Q43 78 20 65Z',c)+p('M36 42L41 25L47 38L53 29L58 40M63 40Q75 25 82 37L84 44Z',dark)+p('M41 69L47 84L58 74L61 69M74 60Q62 55 58 69L73 69Z',dark)+eye(86,48,2)+l('M78 43Q69 55 79 67M89 56L98 53M89 56L96 61',dark,1)+l('M27 54Q49 43 69 48M29 63Q50 70 70 64',light,1.1);
 }else throw Error('Unimplemented Oceanian art profile: '+profile);
 const shift=(hex,n)=>'#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(hex.slice(i,i+2),16)+n)).toString(16).padStart(2,'0')).join('');
 if(profile==='wombat')a+=p('M23 45Q42 33 62 42L60 47Q41 39 24 50Z',shift(c,12),0,'none')+p('M28 65Q45 73 65 66L61 71Q43 76 29 71Z',shift(c,-10),0,'none');
 if(profile==='platypus')a+=p('M30 50Q48 40 68 47L66 51Q47 45 32 54Z',shift(c,13),0,'none')+p('M34 65Q54 73 75 62L72 67Q53 76 37 69Z',shift(c,-10),0,'none');
 if(profile==='macropod'&&g!=='Setonix')a+=l('M43 46l2-3m-2 8 2-3m1 8 1-3M56 57l1 3',shift(c,-16),.65);
 if(profile==='tree-kangaroo')a+=l('M76 65l3 2m-6-1 3 2M49 80l3 1m2-3 3 1',light,.7);
 if(['frilled-lizard','bearded-dragon','water-dragon','tuatara','blue-tongued-skink'].includes(profile))a+=l('M35 79l-3 3m5-3-1 4m3-4 1 3M81 73l2 3m0-3 3 2',ink,.65);
 // Species-specific, deterministic fine marks follow anatomy; never use RNG or species-ID hashes.
 if(a==='')throw Error('Empty Oceanian illustration: '+sp.latin);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" data-oc-profile="${route}" data-oc-species="${sp.latin.replace(/ /g,'-')}" data-zoological-family="${sp.family}" data-oc-sex="${sex||'base'}"><g stroke-linecap="round" stroke-linejoin="round">${a}</g></svg>`;
}
root.AtlasOceaniaArt3290=Object.freeze({render});if(typeof module==='object'&&module.exports)module.exports=root.AtlasOceaniaArt3290;
})(typeof globalThis!=='undefined'?globalThis:this);
