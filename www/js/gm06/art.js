/* Original transparent vector illustrations. Shared anatomy only among related forms.
 * Normal adults only: no invented albino, melanic or sexual variants. Specimen tiers
 * are decorated by the unchanged game renderer, outside this module. */
(function(root){'use strict';
const ink='#35473e',ivory='#eee9d7',dark='#303d39';
const path=(d,fill,extra='')=>`<path d="${d}" fill="${fill}" ${extra}/>`;
const ellipse=(x,y,rx,ry,fill)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const circle=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const line=(d,color=ink,width=2)=>path(d,'none',`stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`);
function bird(o={}){
 const {body='#7d8b72',head=body,wing=dark,belly=body,beak='#b9a473',tail=wing,feet='#9b8260',crest='',marks='',long=false}=o;
 return path(long?'M31 65L4 80L37 77Z':'M34 63L14 72L34 78Z',tail)+
 path('M43 71L40 89L33 90M66 72L69 89L77 89','none',`stroke="${feet}" stroke-width="3" stroke-linecap="round"`)+
 ellipse(53,63,27,18,body)+ellipse(61,68,15,12,belly)+ellipse(44,59,16,12,wing)+
 path('M69 61Q60 50 64 39Q68 31 79 34Q89 38 84 50L78 64Z',head)+
 path('M84 41L102 46L84 49Z',beak)+circle(78,41,2.1,ink)+circle(78.6,40.3,.65,ivory)+crest+marks;
}
function swimmer(m,c){
 let s=path('M28 66L9 60L19 73L33 76Z',dark)+ellipse(52,67,31,15,c)+ellipse(48,64,24,8,dark)+path('M69 65Q64 53 70 43Q76 37 83 43L86 56L91 65Z',c)+path('M84 45L103 49L86 53Z','#b8a472')+circle(79,45,2,ink)+line('M44 81L36 87M65 81L73 86','#a79063',3);
 if(m==='loon')s+=ellipse(64,66,13,8,ivory)+line('M29 64L32 67M39 60L42 63M47 62L50 65M36 70L39 72M55 58L58 61',ivory,2)+line('M69 56L82 58',ivory,3)+circle(79,45,2,'#af4d41');
 if(m==='harlequin')s+=path('M66 60Q58 55 59 49L73 45L81 52L76 64Z','#536f80')+ellipse(36,72,13,5,'#a36445')+line('M67 48L72 40M72 58L80 61M55 60L58 70',ivory,3)+circle(73,49,2,ivory);
 if(m==='kelpgoose')s=bird({body:ivory,head:ivory,wing:'#d7d8c8',feet:'#c5a454',beak:dark,marks:line('M42 55L38 65M50 54L47 65','#b2b8ad',1)});
 if(m==='steamerduck')s+=ellipse(49,65,22,9,'#a5b0ad')+line('M31 62L36 67M41 59L46 66M52 60L56 65','#607675',2)+path('M84 45L103 49L87 53Z','#d6a85b');
 return s;
}
function seabird(m,c){
 if(m==='penguin'||m==='humboldtpenguin'){
  let s=ellipse(61,56,23,34,dark)+ellipse(65,62,16,26,ivory)+circle(63,26,16,dark)+path('M43 44Q26 57 28 75Q39 70 49 56Z',dark)+path('M76 26L95 31L77 35Z',dark)+circle(71,25,2,ivory)+path('M49 86L39 92L59 92L63 87M70 87L67 93L87 92L79 86Z','#a0856b');
  s+=line('M52 19Q46 36 65 40L77 36',ivory,3);
  if(m==='humboldtpenguin')s+=line('M49 52Q64 63 79 53',dark,5)+path('M75 25L83 28L77 34Z','#c79a91');
  return s;
 }
 if(m==='flightlesscormorant'||m==='guanay')return path('M35 69L12 87L42 79Z',dark)+ellipse(53,61,23,18,c)+path('M64 64Q63 46 67 29Q72 16 83 22L86 29L81 40L80 66Z',c)+path('M83 24L108 29L103 35L82 32Z','#b9ad83')+circle(79,26,2,'#73b4a1')+ellipse(48,61,m==='flightlesscormorant'?10:18,9,dark)+path('M49 77L42 91L30 92M65 77L71 91L84 92','none','stroke="#615e4c" stroke-width="4"')+(m==='guanay'?ellipse(64,66,10,13,ivory)+circle(84,29,4,'#bd6954'):line('M42 53L37 67M47 53L43 67','#727a6c',2));
 if(m==='pelican')return path('M25 66L9 77L32 79Z',dark)+ellipse(49,65,28,17,c)+ellipse(41,61,18,10,dark)+path('M64 65Q60 40 70 27Q75 20 83 25L84 37L77 64Z',ivory)+path('M81 28L113 34L83 39Z','#d1b260')+path('M84 38L111 35Q98 56 84 45Z','#a8a394')+circle(78,28,2,ink)+line('M39 80L34 90M60 81L65 90','#8e8d70',3);
 if(m==='albatross')return path('M25 64L6 77L31 75Z','#645c50')+
  ellipse(51,65,29,17,'#887663')+ellipse(64,68,15,12,ivory)+
  path('M31 52Q53 46 72 60L30 74L12 72Z','#6e6153')+
  line('M26 62L47 58M25 66L52 62M35 69L58 65','#c0ad8b',1.2)+
  path('M68 65Q64 52 67 38Q69 27 77 26L86 33L81 49L81 64Z','#e9dfbc')+
  ellipse(80,33,12,9,ivory)+path('M89 33L116 36Q120 43 111 46L111 40L89 40Z','#d3b752')+
  circle(83,31,2,ink)+line('M35 79L31 90L43 90M65 80L70 90L83 91','#82989a',3);
 if(m==='incatern')return bird({body:c,head:c,wing:'#3c5158',beak:'#b34e3c',feet:'#b34e3c',long:true,marks:line('M85 48Q70 55 66 45M83 49Q73 60 67 55',ivory,2)});
 const blue=m==='bluebooby';return bird({body:ivory,head:blue?'#a2a093':ivory,wing:c,beak:'#879da2',feet:blue?'#53b4c6':'#8b9997',marks:(blue?'':line('M29 53L34 57M35 61L40 65M43 53L48 58M48 64L53 68',ivory,2))+line('M39 89L29 91M71 89L83 92',blue?'#53b4c6':'#8b9997',4)});
}
function landbird(m,c){
 if(m==='hummingbird')return path('M53 48Q26 8 23 18Q22 38 45 59Z','#93b8ac')+path('M48 53Q9 37 10 46Q15 60 41 64Z','#b9d3c5')+ellipse(57,57,17,11,c)+circle(74,45,10,c)+path('M82 44L114 40L83 47Z',ink)+path('M45 58L21 77L46 66Z',dark)+ellipse(73,53,8,4,'#b75e6a')+circle(77,43,1.7,ink);
 if(m==='kagu')return bird({body:c,head:c,wing:'#adb7b2',beak:'#c27851',feet:'#ba7652',crest:path('M68 34Q43 13 37 19L67 42Z','#dce0d7'),marks:line('M42 54L30 68M50 54L39 71','#737f7c',2)});
 if(m==='maleo')return bird({body:c,head:'#343b38',wing:dark,belly:'#d6b8a7',beak:'#d5a251',feet:'#9d9670',crest:ellipse(74,31,10,8,dark),marks:ellipse(82,42,5,6,'#c9b567')+circle(79,41,2,ink)});
 if(m==='curassow')return bird({body:dark,head:dark,belly:ivory,wing:'#46514a',beak:'#d2b348',crest:path('M66 34q-8-15 1-13q6-6 9 1q9-2 7 10Z',dark),marks:circle(86,41,4,'#d3b54c'),long:true});
 if(m==='huethuet')return bird({body:c,head:'#65554a',wing:'#3d4944',belly:'#ab6b49',beak:dark,marks:line('M54 70L57 76M62 70L65 77','#dfad7d',1)});
 if(m==='groundfinch')return bird({body:c,head:c,wing:'#4a5046',beak:'#b4a07b',marks:path('M84 39L104 44L85 52Z','#a99b78')});
 if(m==='crow')return bird({body:c,head:c,wing:'#243634',beak:'#35423e',long:true,marks:line('M33 55L48 64','#54615a',2)});
 if(m==='trogon')return bird({body:c,head:'#3d6f87',wing:'#427c5b',belly:'#bf5147',beak:'#b79160',long:true,marks:line('M58 59L77 58',ivory,5)+line('M18 76L32 77M24 70L34 71',ivory,3)});
 if(m==='cockatoo')return bird({body:c,head:c,wing:'#d8c5b4',beak:'#64695e',long:true,crest:path('M67 35Q55 8 68 10L81 33Z','#dc8f76')});
 if(m==='lory')return bird({body:c,head:c,wing:'#487a49',belly:c,beak:'#ce9a45',tail:'#406c47',long:true,marks:line('M61 59L66 67','#d9c650',5)+path('M65 30L81 33L83 36L65 35Z',dark)});
 if(m==='hornparakeet')return bird({body:c,head:'#8ba853',wing:'#4f8654',belly:'#b5ba65',beak:'#6a7261',tail:'#5b8e61',long:true,crest:line('M70 34L66 13M78 33L78 12',dark,3)+circle(66,13,2,'#b34b3b')+circle(78,12,2,'#b34b3b'),marks:line('M65 36L81 36','#b74c3d',4)});
 if(m==='fruitdove')return bird({body:c,head:'#a3c49b',wing:'#4d8f66',belly:'#d2c369',beak:'#c0ba76',marks:line('M58 55L73 55',ivory,3)+line('M57 59L72 59',dark,2)+path('M43 80L40 91M66 80L70 90',ivory,'stroke="#eee9d7" stroke-width="5"')});
 return bird({body:c,head:ivory,wing:'#3e834a',beak:'#c3ae80',long:true,marks:path('M67 46L84 47L80 56L68 53Z','#bb635d')});
}
function mammal(m,c){
 if(m==='tamarin')return line('M44 68Q11 84 12 44Q9 28 22 34','#985839',5)+
  line('M12 40Q9 28 22 34',dark,5)+line('M44 52L29 66L30 83M72 51L88 64L88 82',dark,6)+
  ellipse(58,63,18,20,'#504c40')+ellipse(57,59,12,15,'#84735a')+
  line('M48 77L41 90M66 78L74 90',dark,6)+ellipse(62,45,12,7,'#a1573d')+
  circle(64,33,12,dark)+path('M54 28L64 19L73 28L64 31Z',ivory)+
  ellipse(65,36,8,8,'#aa9c83')+circle(61,33,1.6,ink)+circle(69,33,1.6,ink)+line('M62 40L68 40',ink,1);
 if(['harpseal','galapagosseal','furseal'].includes(m)){
  const ear=m!=='harpseal';return path('M26 68Q42 45 69 53Q76 28 88 31Q103 32 103 48Q95 61 81 67Q73 78 36 78L15 84L21 74L8 72Z',c)+ellipse(88,47,12,8,'#b6a17b')+circle(92,39,2,ink)+path('M60 65Q79 78 73 86Q55 82 50 73Z',c)+line('M97 48L113 46M96 51L112 54','#706957',1)+(ear?path('M81 34L75 27L77 42Z',c):path('M28 65Q37 51 53 55L65 64L56 72L45 64L37 74Z','#49534c'));
 }
 if(m==='flyingfox')return path('M54 40L27 15L7 71Q24 55 31 71Q42 60 53 78L64 55L77 80Q86 62 96 71Q103 53 116 69L98 15L72 40Z','#4c3b31')+line('M57 44L27 15L31 71M58 47L7 71M68 43L98 15L96 71M67 48L116 69','#927254',2)+ellipse(62,56,12,25,'#a66f42')+path('M53 39L48 19L59 29L70 27L78 19L74 41Z',c)+ellipse(65,37,12,10,c)+ellipse(72,40,8,5,'#b08c61')+circle(65,33,2,ink);
 if(m==='spidermonkey'||m==='tamarin'||m==='orangutan'){
  const orang=m==='orangutan',small=m==='tamarin';return line(orang?'M40 46Q13 53 22 83M73 46Q103 52 93 85':'M42 47L19 66L23 82M74 45L98 60L95 79',c,orang?14:7)+ellipse(58,59,orang?23:16,orang?25:20,c)+line('M48 74L41 89M66 75L76 89',c,orang?12:7)+circle(59,32,orang?17:12,c)+ellipse(60,34,orang?12:8,10,orang?'#aa8c6d':'#b1a286')+circle(55,31,1.8,ink)+circle(65,31,1.8,ink)+line('M56 39L64 39',ink,1)+(orang?path('M41 34Q29 63 38 73L46 48Z','#c38650'):line('M44 67Q12 36 16 18Q23 8 31 20',c,small?5:7))+(small?path('M48 24L69 21L70 28L48 30Z',ivory)+ellipse(57,43,11,6,'#a75638'):'');
 }
 if(m==='hare')return ellipse(51,65,27,17,c)+circle(80,52,13,c)+ellipse(74,28,5,19,c)+ellipse(85,27,5,20,c)+ellipse(75,26,2,13,'#a99e90')+ellipse(86,25,2,14,'#a99e90')+ellipse(40,77,15,6,c)+line('M72 68L77 83L95 83',c,6)+circle(85,49,2,ink)+circle(26,64,6,ivory);
 if(m==='monito')return line('M39 70Q6 93 11 52Q16 37 22 51',c,5)+ellipse(57,63,26,16,c)+circle(84,55,14,c)+circle(77,42,7,c)+circle(91,43,7,c)+ellipse(85,56,10,8,'#d3bfa1')+circle(80,51,5,dark)+circle(90,52,5,dark)+circle(81,50,1,ivory)+circle(91,51,1,ivory)+line('M43 75L38 85M68 77L73 85',c,4);
 if(m==='otter')return path('M31 65Q4 62 7 80Q18 72 37 77Z',c)+ellipse(56,64,30,13,c)+circle(88,56,13,c)+circle(83,44,4,c)+ellipse(94,61,10,6,'#c3b393')+circle(92,53,2,ink)+line('M44 73L34 83M70 72L81 81',c,7)+line('M100 61L113 58M99 64L114 67',ink,1);
 if(m==='solenodon')return ellipse(54,65,29,18,c)+path('M76 52Q91 50 108 70L101 72L79 63Z',c)+circle(80,53,2,ink)+circle(72,48,6,'#7d6651')+line('M31 66Q8 75 14 43','#b39777',4)+line('M41 78L34 88M69 77L74 88','#9d8c77',6);
 if(m==='hyrax')return ellipse(56,65,29,20,c)+circle(83,56,15,c)+circle(77,42,7,c)+circle(93,44,6,c)+ellipse(91,62,11,7,'#b6a88d')+circle(88,52,2,ink)+line('M39 78L35 88M70 78L75 88',c,8);
 const rhino=m==='javanrhino',pig=m==='babirusa';
 let s=ellipse(53,59,rhino?35:29,rhino?23:18,c)+path('M32 70L27 89L38 89L43 72M65 70L68 89L79 89L76 67Z',c)+path('M75 43L95 44L108 59L101 70L78 64Z',c)+circle(92,50,2,ink)+path('M81 43L79 29L89 43Z',c)+line('M25 56L12 48L10 59',c,3);
 if(rhino)s+=path('M102 55L107 42L110 59Z','#b9b6a3')+line('M45 40L42 64L46 78M66 39L70 64','#5c6e65',2);
 if(pig)s+=line('M101 57Q111 25 93 29M95 58Q99 19 83 28','#dbd2b6',3)+ellipse(103,62,7,5,'#b0a18e');
 if(m==='anoa')s+=path('M85 43L81 20L88 28L91 43M95 44L104 21L102 39Z','#c2bca2')+ellipse(101,61,9,6,'#6a6c5c');
 if(m==='ibex')s+=line('M85 42Q80 9 57 13Q43 16 46 32M93 42Q97 16 76 9','#726951',6)+line('M80 59L78 76',c,6)+ellipse(93,63,9,5,'#d7c5a1');
 return s;
}
function reptile(m,c){
 if(m==='tortoise')return path('M24 68L18 84L31 84L38 71M68 70L74 84L85 83L80 68Z',c)+path('M22 67Q19 26 57 27Q88 29 86 68Z',c)+line('M45 31L35 47L48 63L69 61L76 43L61 29M35 47L23 52M48 63L47 70M69 61L77 69','#aaa58a',2)+path('M80 59Q89 42 101 47Q112 55 100 65L84 70Z',c)+circle(102,52,2,ink);
 const croc=m==='crocodile',marine=m==='marineiguana',horn=m==='horniguana',basilisk=m==='basilisk';
 let s=path(croc?'M37 57Q10 46 5 74L35 72Z':'M42 58Q12 84 7 49Q4 73 22 78L48 71Z',c)+ellipse(59,62,croc?35:26,12,c)+path(croc?'M78 51L111 55L113 67L80 69Z':'M78 49L98 47L108 60L101 69L78 66Z',c)+line('M40 65L29 83L18 83M70 64L79 83L91 83',c,croc?7:6)+circle(97,53,2,'#d2bf70');
 s+=path(basilisk?'M33 53L41 32L53 50L64 34L73 50Z':'M32 51L37 44L42 51L47 43L52 50L57 43L63 50L70 44L77 50Z',croc?'#687651':c)+line('M86 63L108 63',ink,1.2);
 if(horn)s+=path('M97 48L101 37L104 49L107 42L108 52Z','#bab6a0');
 if(marine)s+=line('M39 55L44 65M51 53L56 66M64 53L69 65','#71837b',3);
 if(m==='landiguana')s+=ellipse(67,59,17,6,'#dcba60');
 if(croc)s+=line('M31 54L38 56M45 52L52 54M59 52L66 54M73 53L80 55','#d8c990',3);
 return s;
}
function fish(m,c){
 if(m==='butterflyfish')return path('M38 52L14 35L15 78L39 65Z',c)+ellipse(64,57,29,31,c)+path('M56 28L75 14L89 44M52 84L71 94L86 76Z',c)+path('M88 52L108 56L90 63Z',c)+line('M49 39L48 74M57 31L56 84M66 28L66 85M76 35L77 79','#c49c40',1.3)+ellipse(83,46,6,9,'#6b8992')+circle(85,45,2,ink);
 if(m==='lionfish')return path('M37 50L9 29L17 56L7 80L39 66Z',c)+path('M41 45L35 12L48 35L50 7L59 37L69 9L70 39L87 18L83 48Z',c)+path('M44 61L20 92L52 77L66 96L74 75L94 86L83 62Z',c)+ellipse(63,55,30,16,c)+line('M43 44L48 66M53 40L58 69M65 41L70 69M77 44L82 65',ivory,3)+circle(86,51,3,ink)+line('M44 40L35 12M57 39L50 7M68 40L69 9M78 46L87 18',ivory,1);
 return path('M32 56L7 37L12 56L6 77L32 65Z',c)+ellipse(62,58,34,14,c)+path('M53 46L65 29L77 47Z',c)+path('M62 70L75 80L81 67Z',c)+ellipse(65,63,26,6,'#c8c8ac')+circle(89,54,2,ink)+line('M40 51L43 51M49 47L51 47M58 51L60 51M69 47L71 47M77 51L79 51',dark,2)+line('M88 61L101 60',ink,1);
}
function render(sp){
 const m=sp.gm06.morph,c=sp.color;let art;
 if(sp.taxonomy.className==='Actinopterygii')art=fish(m,c);
 else if(sp.taxonomy.className==='Reptilia')art=reptile(m,c);
 else if(sp.taxonomy.className==='Mammalia')art=mammal(m,c);
 else if(['loon','harlequin','kelpgoose','steamerduck'].includes(m))art=swimmer(m,c);
 else if(['penguin','humboldtpenguin','flightlesscormorant','guanay','pelican','albatross','incatern','bluebooby','peruvianbooby'].includes(m))art=seabird(m,c);
 else art=landbird(m,c);
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100" role="img" aria-label="${sp.name}" data-gm06-morph="${m}"><g stroke="${ink}" stroke-width="1.5" stroke-linejoin="round">${art}</g></svg>`;
}
root.AtlasGM06Art=Object.freeze({render});
})(globalThis);
