/* AM-05 targeted anatomical corrections. Pure rendering; identity, ecology,
 * encounters, pigmentation and specimen rewards remain in the existing engine.
 * Correct profiles fall through to the unchanged AM-04 renderer.
 */
(function(root){'use strict';
const colors={Felidae:['#b1a38e','#e6ddc5','#626657'],Canidae:['#ac9e82','#e8ddc4','#646e5b'],Cervidae:['#ab9272','#e4d5b6','#72624c'],Camelidae:['#b69b78','#ede1c4','#7b674e'],Caviidae:['#a18c6d','#d9c7a8','#756a53'],Chinchillidae:['#a5a79d','#e2dec8','#737b6a'],Echimyidae:['#9c8c72','#ddd0b3','#6a6852'],Octodontidae:['#aa9a78','#e1d5b7','#78775b'],Iniidae:['#b69d9c','#e0c8be','#8c7f7b'],Mustelidae:['#81765f','#d8c9aa','#4d5e4e'],Ursidae:['#626853','#d9cca7','#3c5140'],Tapiridae:['#85846f','#cfc8aa','#52634d'],Tayassuidae:['#81816b','#e1d5b8','#53664e'],Atelidae:['#83765a','#d6c49c','#495c45'],Cebidae:['#a89c72','#e7dabc','#5e6b52'],Aotidae:['#a39377','#ded3af','#52624b'],Callitrichidae:['#959b86','#ece6cf','#576952'],Choloepodidae:['#aca184','#e4dabe','#738268'],Cyclopedidae:['#bdad82','#eee2bc','#858561'],Myrmecophagidae:['#afa581','#e6daba','#53674f'],Chlamyphoridae:['#a6a08a','#ded3b6','#6b7d68'],Dasypodidae:['#aaa58f','#e1d9bc','#7a866c']};
const tint=(c,n)=>'#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(c.slice(i,i+2),16)+n)).toString(16).padStart(2,'0')).join('');
function tools(sp){let [b,c,d]=colors[sp.family]||[sp.color,'#e6ddc2','#60765a'];const ink='#3b5244';
 const p=(s,fill=b,w=1.65,stroke=ink)=>`<path d="${s}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,l=(s,col=d,w=1)=>p(s,'none',w,col),e=(x,y,rx,ry,fill=b,w=1.1)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${ink}" stroke-width="${w}"/>`,dot=(x,y,r,col=d)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`,eye=(x,y,r=1.2)=>`<g data-sa-eye="true">${dot(x,y,r,'#23352d')}${dot(x-.3,y-.35,.32,'#f5ecd5')}</g>`;
 const leg=(x,y,len=23,lean=0,far=false)=>p(`M${x-3} ${y}Q${x-5} ${y+6} ${x-2} ${y+11}L${x+lean-2} ${y+len-5}Q${x+lean-6} ${y+len} ${x+lean-1} ${y+len}L${x+lean+5} ${y+len}L${x+lean+5} ${y+len-2}L${x+lean+1} ${y+len-4}Q${x+lean+4} ${y+12} ${x+2} ${y+9}L${x+4} ${y+2}Z`,far?tint(b,-21):b,1.4);
 const highlight=(s)=>p(s,tint(b,17),0,'none');
 return {p,l,e,dot,eye,leg,highlight,b,c,d,ink};
}
function mammal(sp,sex){
 const n=sp.latin,g=n.split(' ')[0],f=sp.family,female=sex==='female';
 if(['Noctilionidae','Mephitidae'].includes(f))return null;
 let {p,l,e,dot,eye,leg,highlight,b,c,d,ink}=tools(sp),a='',profile=sp.artProfile;
 if(f==='Felidae'){
  const andean=n.endsWith('jacobita'),pampas=n.endsWith('colocola'),tigrin=n.endsWith('tigrinus');
  a+=leg(33,58,25,4,true)+leg(69,57,24,1,true);
  const tail=andean?'M28 58C4 42 1 65 13 78Q20 86 32 78L30 72Q20 78 16 70Q9 55 29 64Z':pampas?'M29 59Q7 48 7 67Q7 86 25 79L25 73Q15 78 14 68Q13 60 31 65Z':tigrin?'M28 60C3 46 0 70 15 83Q25 90 33 77L29 73Q24 83 17 76Q6 61 30 66Z':'M27 60Q6 48 6 67Q5 82 18 82Q29 82 29 74L24 73Q19 80 14 74Q7 62 29 65Z';
  a+=p(tail,b,1.7)+l(andean?'M9 56l7 3M8 64l8 2M12 74l6-3M20 80l2-7M27 78l-1-6':'M8 63l6 2M8 72l6-1M14 80l3-6M22 80l-1-6',d,2.2);
  a+=p(pampas?'M22 54C22 41 37 37 48 41Q65 36 75 46Q82 51 78 63Q72 71 55 70Q38 73 28 66Q20 65 22 54Z':tigrin?'M24 56Q25 46 40 45Q56 42 68 48L78 52L78 64Q70 72 52 69Q39 72 27 66Q21 63 24 56Z':'M23 53Q25 40 42 42Q58 38 70 45Q78 47 79 58L77 65Q62 73 48 69Q29 72 23 63Z');
  a+=highlight('M29 48Q44 41 58 46Q65 45 72 49Q52 49 44 51L30 54Z');
  for(const[x,y]of[[32,50],[43,48],[54,50],[65,51],[36,61],[47,61],[60,61]])a+=andean?l(`M${x-1} ${y-2}q-2 2 1 5`,d,1.9):pampas?l(`M${x} ${y-2}l2 4`,d,1.3):tigrin?p(`M${x-2} ${y-1}q3-3 5 0q1 3-2 4q-4 0-3-3Z`,b,1,d):dot(x,y,1.45,d);
  a+=leg(31,60,24,-2)+leg(69,59,24,-2)+p(andean?'M69 48Q67 36 77 33Q87 31 92 42L96 46Q98 53 89 55L78 58Q68 55 69 48Z':tigrin?'M70 47Q69 35 79 33Q88 31 92 42L97 47L96 52L88 56L78 56L69 51Z':'M68 47Q67 35 78 33Q88 33 92 42L97 47Q98 53 89 55L78 58L69 53Z');
  a+=p(andean?'M71 38Q66 26 74 27Q80 28 80 35M84 35Q86 27 91 30L91 43Z':pampas?'M70 39L69 26Q74 24 80 35M83 35L91 27L92 43Z':'M71 37Q68 26 75 27L81 34M84 35Q88 26 92 31L92 43Z',b,1.3)+p('M79 48Q87 45 95 48Q99 51 91 54L83 54L78 51Z',c,0,'none')+eye(84,41,tigrin?1.6:1.3)+dot(96,48,1.25,ink)+l('M88 53l-8 1m7 1-7 3',c,.8);
  if(pampas)a+=l('M71 43l-6 4m6-1-5 5m5-2-4 6M29 48l-3 8',c,1.5);
 }else if(f==='Canidae'){
  const maned=g==='Chrysocyon',bush=g==='Speothos',short=g==='Atelocynus',darwin=n.endsWith('fulvipes'),culpeo=n.endsWith('culpaeus'),pampas=n.endsWith('gymnocercus');
  const y=maned?43:bush?62:57,len=maned?43:bush?17:26;
  a+=leg(33,y,len,3,true)+leg(69,y-1,len,1,true);
  a+=p(bush?'M26 62Q17 59 15 65L20 69L31 66Z':maned?'M29 45Q14 45 8 64Q16 69 27 59L36 50Z':darwin?'M28 59Q9 50 4 70Q16 82 35 69L39 62Z':short?'M29 58Q10 48 6 65Q10 73 24 68L35 63Z':'M30 58Q11 48 4 68Q10 78 25 74Q34 72 41 64Z',darwin||short?d:b);
  if(!bush&&!short&&!darwin)a+=p(maned?'M9 60L14 54L19 57L13 66Z':'M5 67Q10 62 15 63L16 74Q9 76 5 70Z',maned?c:pampas?d:c,0,'none');
  a+=p(maned?'M24 42Q29 32 43 34Q54 29 67 34L79 43L77 57Q62 64 42 58Q25 60 24 42Z':bush?'M22 58Q24 47 39 47Q58 44 73 51Q82 57 78 67Q61 75 35 69Q20 70 22 58Z':short?'M22 52Q28 41 44 43Q62 38 74 47L80 58L78 66Q61 73 39 67Q22 66 22 52Z':darwin?'M23 53Q29 40 44 43Q61 39 73 48L80 57L78 67Q64 75 39 68Q21 67 23 53Z':'M24 52Q28 41 43 43Q60 39 71 46L81 53L78 65Q62 72 40 67Q22 66 24 52Z');
  a+=highlight(maned?'M30 39Q45 33 59 37L66 41Q49 39 34 45Z':'M30 48Q44 42 61 46L68 50Q45 48 32 53Z');
  if(maned)a+=p('M59 33L62 23Q68 17 72 25L78 43L71 49L62 44Z',d,0,'none');else if(!bush)a+=p('M29 46Q46 39 65 46L67 52Q47 47 31 54Z',short||darwin?d:'#8b8f7a',0,'none');
  a+=leg(30,y+2,len,-2)+leg(68,y+2,len,-2);
  if(maned)a+=p('M26 72L33 73L32 88L25 88ZM64 70L71 71L70 88L63 88Z',d,0,'none');
  a+=p(bush?'M65 54Q64 42 76 41Q87 39 92 50L98 55L97 61L86 65L74 62L66 59Z':maned?'M68 32Q68 23 79 23Q87 24 90 32L99 36L97 42L85 46L75 41Z':short?'M69 45Q69 33 79 34Q87 34 92 44L99 49L97 54L85 57L75 53Z':'M69 44Q70 33 80 32Q88 34 91 43L99 47L97 52L85 56L75 53Z');
  a+=p(maned?'M71 27Q65 8 72 7Q79 12 80 25M84 25Q85 7 91 9Q96 19 91 34Z':bush||short?'M69 45Q64 35 71 34Q78 34 78 43M83 42Q83 34 88 38L90 48Z':darwin?'M72 36Q68 24 75 25L81 34M84 34Q89 23 92 28L92 43Z':'M71 37L68 21Q74 19 81 33M84 34L89 19Q95 25 92 43Z',b,1.3)+p(maned?'M81 37L98 36L97 41L85 45Z':bush?'M83 54L97 55L97 60L87 63Z':'M82 46L98 48L97 52L86 55Z',c,0,'none')+eye(85,maned?31:bush?48:40)+dot(98,maned?37:bush?56:48,1.3,ink);
  if(culpeo)a+=p('M70 38L78 42L74 53L66 46Z','#b58c69',0,'none');
 }else if(f==='Camelidae'){
  const vic=g==='Vicugna';a+=leg(32,57,30,3,true)+leg(66,55,32,2,true);
  a+=p(vic?'M22 50Q27 42 42 44Q54 41 62 47Q67 38 66 24L72 20Q79 34 77 48L78 60Q68 72 45 67Q25 69 22 59Z':'M19 50Q22 38 41 42Q55 38 62 44Q67 34 67 22L74 19Q81 32 79 49L78 62Q62 71 43 67Q21 69 19 50Z');
  a+=p('M25 56Q41 65 67 54L73 47L75 60Q62 70 43 65L27 62Z',c,0,'none')+highlight('M25 46Q42 41 57 46L61 49Q44 46 28 51Z')+leg(28,60,27,-2)+leg(66,59,28,-1)+l('M23 53Q12 48 12 62',d,2);
  a+=p(vic?'M66 23Q65 13 74 13Q82 12 86 19L93 23L92 29Q83 33 72 28L67 27Z':'M67 24Q64 12 74 11Q83 11 87 18L95 23L93 30Q84 34 74 29L68 28Z')+p(vic?'M69 17Q65 5 70 4Q76 6 75 15M80 16Q82 3 87 5L86 22Z':'M69 16Q64 4 70 3Q77 6 76 15M81 16Q82 2 88 5L87 22Z',b,1.25)+p('M78 24L93 24L91 29L81 30Z',c,0,'none')+eye(83,19)+dot(94,24,1.15,d);
  if(vic)a+=p('M66 31L73 33L72 50L65 53L63 46Z',c,0,'none')+l('M66 36l-3 10m5-8-2 12',c,1.7);else a+=p('M70 17L77 15L84 23L80 29L72 25Z',d,0,'none');
 }else if(f==='Cervidae'){
  const pudu=g==='Pudu'||g==='Pudella',north=g==='Pudella',marsh=g==='Blastocerus',brocket=g==='Mazama',taruca=n.endsWith('antisensis'),huemul=n.endsWith('bisulcus');
  const y=pudu?62:55,len=pudu?19:31;a+=leg(33,y,len,4,true)+leg(67,y-1,len,2,true);
  a+=p(pudu?(north?'M21 54Q24 43 40 45Q56 40 67 49L78 55L77 66Q65 76 39 71Q20 71 21 54Z':'M20 53Q23 39 42 42Q58 38 70 48L78 56L77 67Q61 77 37 70Q19 68 20 53Z'):huemul?'M21 48Q24 37 42 41Q55 37 66 42L72 30L79 29L81 47L80 63Q66 73 44 67Q23 69 21 48Z':'M22 49Q28 39 43 42Q56 38 65 42Q69 33 73 30L79 30L82 49L79 64Q64 73 44 68Q22 68 22 49Z');
  a+=p(pudu?'M25 62Q43 70 69 61L73 67Q54 76 29 68Z':'M26 57Q45 65 70 55L76 63Q56 71 30 64Z',c,0,'none')+highlight(pudu?'M27 50Q44 43 60 48L68 52Q45 49 28 55Z':'M28 46Q44 41 60 46L65 50Q45 47 29 51Z')+leg(28,y+2,len,-2)+leg(66,y+1,len,-2)+l(pudu?'M24 57q-6-2-8 3':'M24 53Q12 49 13 63',d,1.8);
  a+=p(pudu?'M66 49Q66 35 78 35Q88 36 91 43L97 49L94 55L83 57L72 54L67 52Z':'M70 35Q71 23 81 25Q89 26 92 36L98 41L94 47L84 47L74 42Z')+p(pudu?'M69 41Q59 28 66 27Q74 28 77 36M82 36Q88 26 94 30L89 44Z':'M74 29Q62 22 63 28Q65 34 75 36M84 29Q90 20 96 24L89 36Z',b,1.3)+p(pudu?'M83 49L96 49L94 54L85 55Z':'M83 40L96 41L93 46L85 45Z',c,0,'none')+eye(pudu?84:85,pudu?43:34)+dot(pudu?96:97,pudu?50:42,1.35,d);
  if(!female)a+=l(pudu?'M74 35Q72 29 73 23M84 35Q87 29 87 23':brocket?'M76 28Q71 20 73 13M86 28Q90 21 89 14':taruca||huemul?'M76 28L71 14L66 10M72 19L77 11M84 28L89 14L95 10M89 19L85 12':marsh?'M76 28L68 14L66 5M71 20L64 16M69 11L73 6M85 28L92 14L94 5M90 20L97 15M93 11L89 6':'M76 28L67 13L69 6M71 19L64 14M85 28L92 13L91 5M91 18L98 12','#a89b81',2);
  if(marsh)a+=p('M25 74L32 74L32 88L25 88ZM63 73L70 73L70 88L63 88Z',d,0,'none');
  if(taruca)a+=p('M76 36L80 31L85 36L83 42L77 42Z',d,0,'none');
 }else if(['Caviidae','Chinchillidae','Echimyidae','Octodontidae'].includes(f)){
  const cap=g==='Hydrochoerus',mara=g==='Dolichotis',coy=g==='Myocastor',degu=g==='Octodon',plains=g==='Lagostomus',mount=g==='Lagidium',short=n==='Chinchilla chinchilla';
  if(coy)a+=l('M31 64C5 48 0 80 13 85Q22 88 28 83',d,2.3);else if(!cap&&!mara)a+=p(mount?'M30 64C4 42 2 64 12 77Q23 86 32 76L28 71Q18 79 13 66Q11 57 31 70Z':short?'M30 63Q13 56 11 69Q12 82 31 74Z':'M30 63Q8 48 6 68Q6 85 23 80L28 74L25 70Q13 79 12 69Q11 60 31 68Z',b,1.55);
  a+=leg(36,64,mara?24:15,2,true)+leg(69,62,mara?25:16,1,true);
  a+=p(cap?'M14 53C14 39 28 34 43 38Q62 35 76 44L83 59Q81 74 62 73Q47 77 30 70Q14 71 14 53Z':mara?'M24 52Q22 40 37 36Q51 31 63 39Q77 43 77 60Q73 71 54 67Q32 73 24 60Z':plains?'M21 55Q21 39 38 37Q57 32 70 46Q78 54 74 67Q58 78 37 70Q21 71 21 55Z':coy?'M20 56Q22 42 40 42Q57 36 72 47Q80 55 78 67Q66 77 43 71Q20 74 20 56Z':'M24 55Q23 40 39 36Q57 31 69 43Q80 53 74 66Q61 78 40 70Q24 72 24 55Z');
  a+=highlight('M29 45Q43 38 59 44L66 49Q48 45 34 51Z')+p('M30 62Q49 72 72 60L72 67Q55 76 35 68Z',c,0,'none')+leg(29,66,mara?23:15,-1)+leg(66,65,mara?24:15,-2);
  a+=p(cap?'M63 46Q66 37 79 38Q92 38 97 48L98 61Q96 67 83 67Q70 67 66 58Z':mara?'M64 41Q65 29 77 30Q87 30 91 40L97 47L92 53L79 52L68 47Z':plains?'M63 45Q65 34 77 35Q87 35 91 45L97 50L95 57L84 60L70 55Z':'M63 45Q64 32 76 33Q87 34 91 44L97 50L94 57L83 59L69 54Z');
  a+=p(cap?'M72 40Q68 32 75 33Q82 33 82 40M89 42Q89 34 94 39L95 47Z':mara?'M68 35Q60 9 68 8Q77 12 78 33M81 34Q82 12 89 15Q94 25 88 41Z':coy?'M69 39Q65 29 73 29Q81 30 80 39M84 40Q85 31 90 35L91 45Z':mount?'M68 38Q58 11 66 10Q78 12 78 35M81 37Q82 13 90 17Q96 25 90 43Z':short?'M68 38Q59 19 67 17Q78 17 78 36M81 38Q82 20 91 23Q97 30 90 44Z':g==='Chinchilla'?'M68 37Q56 10 66 10Q79 10 78 35M81 37Q82 12 92 17Q99 26 90 44Z':'M68 39Q61 26 69 25Q79 24 80 38M84 40Q85 28 92 33L92 45Z',b,1.2);
  a+=eye(cap?86:83,cap?46:mara?38:43,cap?1.15:1.35)+dot(cap?97:96,cap?54:mara?47:51,1.35,d)+l(cap?'M83 58Q89 60 96 58':'M88 55l-10 1m11 1-9 3',c,.8);
  if(coy)a+=p('M87 51L96 50L95 57L88 57Z',c,0,'none')+p('M92 53h3v4h-3Z','#c89e68',.5)+l('M88 54l-10 1m10 1-9 3',c,.8);
  if(plains)a+=p('M66 40L79 44L92 42L94 46L79 49L68 46ZM71 49L83 52L93 50L92 54L81 57Z',d,0,'none');if(degu)a+=e(12,76,4,3,d,0);if(mara)a+=p('M28 56L36 55L40 64L31 67Z',c,0,'none');
 }else if(f==='Iniidae'){
  // A flexible neck, low dorsal ridge and horizontal flukes; no fish gills or scales.
  a+=p('M24 55Q13 53 4 44Q5 55 13 59Q5 60 3 68Q16 65 25 61Z',d,1.5)+p('M18 54C27 39 47 35 63 40Q72 40 77 47Q87 47 99 52L98 56L79 56Q72 62 67 62C48 74 29 69 18 60Z');
  a+=p('M30 59Q48 67 69 56Q59 69 44 67Q30 66 23 60Z',c,0,'none')+highlight('M31 46Q49 38 64 45Q58 46 54 46Q44 44 32 50Z')+p('M49 60Q47 72 36 77Q31 79 30 76Q34 64 41 59Z',d,1.2)+p('M41 42Q47 35 53 39L61 42Q50 43 41 42Z',b,1.2)+eye(72,48,1.05)+l('M78 53L98 54',d,.85)+l('M61 44q2-3 5-1',d,.7);
 }else if(f==='Mustelidae'){
  const giant=g==='Pteronura';a+=p(giant?'M34 56Q20 53 13 63Q7 69 3 70Q18 74 37 63Z':'M34 60Q18 53 9 67L3 71Q14 77 36 67Z',d,1.5)+leg(37,64,16,3,true)+leg(70,62,16,1,true)+p(giant?'M25 54Q26 43 41 44Q57 40 72 47Q82 49 82 60Q78 70 57 69Q43 71 28 65Q23 62 25 54Z':'M24 57Q28 46 42 47Q60 43 73 50Q82 53 81 64Q73 74 51 71Q25 72 24 57Z')+highlight('M31 50Q47 45 64 49L69 52Q48 49 34 55Z')+leg(31,65,16,-1)+leg(67,65,15,-1)+p('M69 51Q71 39 82 40Q94 40 98 50L98 56Q93 64 80 61L70 56Z')+p('M73 43Q69 35 75 35Q81 36 81 42M87 42Q88 35 93 39L93 48Z',b,1.1)+p(giant?'M75 54L81 53L85 57L82 63L75 61Z':'M83 54Q91 52 98 53L96 59L86 59Z',c,0,'none')+eye(88,45)+e(97,51,2,1.4,d,0)+l('M91 56l-9 1m9 1-8 3',c,.8);
 }else if(['Ursidae','Tapiridae','Tayassuidae'].includes(f)){
  const bear=f==='Ursidae',tapir=f==='Tapiridae',mount=n==='Tapirus pinchaque';
  a+=leg(34,60,24,3,true)+leg(69,58,26,1,true)+p(bear?'M18 52C17 37 28 29 43 34Q60 28 75 41Q83 47 81 62Q73 77 51 70Q35 74 23 66Q17 63 18 52Z':tapir?'M18 51Q21 37 39 38Q56 32 71 42Q82 49 80 65Q68 77 45 70Q23 73 18 61Z':'M22 53Q26 40 42 42Q60 37 74 47Q83 53 80 64Q70 75 47 69Q21 71 22 53Z')+highlight('M26 44Q42 35 59 41L66 46Q47 43 28 50Z')+leg(27,63,22,-1)+leg(67,62,23,-2);
  a+=p(bear?'M65 44Q65 29 78 29Q90 29 93 41L99 49L97 56Q87 64 74 59L65 53Z':tapir?'M65 46Q67 33 79 36Q88 39 90 47Q99 48 98 56L94 62Q90 65 89 59L90 54L78 55L68 52Z':'M67 47Q70 35 81 38Q90 40 94 48L99 54L97 61L85 63L74 57Z')+p(bear?'M68 35Q62 23 70 23Q78 23 78 32M85 33Q87 24 93 29L93 41Z':tapir?'M70 40Q65 24 72 24Q79 25 78 38M83 39Q85 25 91 29L91 44Z':'M71 42Q67 30 74 30L80 37M84 39Q88 30 93 35L91 45Z',b,1.3)+eye(85,43)+dot(bear?98:tapir?97:98,bear?50:tapir?54:55,1.45,d);
  if(bear)a+=l('M73 38Q78 32 83 38L82 44L76 44L73 38M85 38Q90 34 92 40L91 45L86 45M79 45L80 51L90 56',c,1.9);
  else if(tapir){if(mount)a+=l('M76 52Q84 59 91 55',c,1.8);else a+=p('M57 41Q61 31 66 31L72 40Z',d,1.15);a+=l('M24 83l-2 2m6-2v2M64 84l-2 2m6-2v2',c,.7);}
  else a+=p('M82 52Q90 50 98 53L97 60L86 61L80 56Z',c,0,'none')+l('M28 47l-2-7m9 3-1-5m8 4v-5m8 5 1-5m7 6 2-5',d,.9);
 }else if(f==='Dasypodidae'||f==='Chlamyphoridae'){
  const three=g==='Tolypeutes',giant=g==='Priodontes',hairy=g==='Chaetophractus',bands=three?3:g==='Euphractus'?6:g==='Dasypus'?7:giant?12:8;
  a+=p(giant?'M30 64Q15 65 3 77Q16 76 34 69Z':three?'M29 64Q17 62 12 72L23 74L35 69Z':'M30 63Q14 62 3 76Q18 74 34 69Z',d,1.3)+leg(36,63,19,3,true)+leg(67,61,20,2,true)+p(three?'M19 54Q19 32 39 30Q62 25 76 43Q84 58 74 67Q56 80 31 71Q18 69 19 54Z':'M20 54Q20 36 38 33Q61 29 76 45L79 63Q69 77 41 71Q20 70 20 54Z');
  a+=p('M24 56Q30 40 40 39Q58 36 70 46Q48 41 30 57Z',tint(b,18),0,'none');
  for(let i=0;i<bands;i++){const x=30+i*33/Math.max(1,bands-1);a+=l(`M${x} 37Q${x-5} 49 ${x+1} 68`,d,1);}
  a+=leg(28,65,17,-2)+leg(67,64,18,-1)+p(giant?'M67 47Q73 35 82 40L99 54L98 60L85 58L70 53Z':'M67 47Q70 36 81 39L99 53L98 58L84 57L69 53Z')+p(g==='Dasypus'?'M71 40Q68 15 74 15Q81 18 79 38M82 40Q84 17 89 21L90 46Z':'M71 41L69 27Q75 28 78 37M84 39Q87 29 91 33L90 46Z',b,1.1)+eye(84,44)+dot(98,55,1,d)+l(giant?'M24 81l-6 5m9-4-3 5m5-4v4M65 82l-5 5m8-4-1 4':'M24 81l-4 3m7-2-1 3M65 82l-3 3m6-3v3',c,1.1);
  if(hairy)a+=l('M23 46l-4-6m10 0-2-6m9 1v-5m9 2 1-5m10 8 3-5M29 68l-3 6m12-4-1 5m11-3v4',d,.8);
 }else if(['Atelidae','Cebidae','Aotidae','Callitrichidae'].includes(f)){
  const spider=g==='Ateles',wool=g==='Lagothrix',night=g==='Aotus',squirrel=g==='Saimiri',tamarin=g==='Saguinus',black=n==='Ateles paniscus';
  a+=l('M5 87Q48 74 96 82','#9b9d7d',2.7);
  a+=p(spider?'M40 58C15 51 8 35 15 21Q20 7 33 11Q43 16 38 26L33 27Q37 19 31 17Q20 14 20 27Q18 41 43 47Z':tamarin?'M41 59C21 43 3 58 9 72Q13 84 28 79L30 75Q15 78 14 68Q13 55 37 65Z':'M41 59Q14 63 11 44Q7 29 20 24Q33 21 32 33L27 36Q29 26 21 30Q13 33 18 44Q23 53 43 49Z',d,1.6);
  a+=p(wool?'M35 37Q47 27 61 36C76 47 68 64 61 71L45 72Q29 63 31 48Z':spider?'M42 37Q51 30 59 39Q66 50 60 64L48 69Q36 61 38 48Z':'M38 38Q50 28 62 40Q71 51 63 66L49 71Q33 63 34 48Z');
  a+=p(spider?'M42 39C28 36 22 48 23 61L17 77L10 82L12 85L23 82L30 64Q28 49 45 47M58 39C74 39 78 50 78 62L83 76L92 80L91 84L80 81L72 65Q74 51 58 48Z':'M39 42Q27 42 26 58L23 73L15 78L17 82L29 77L34 58L44 50M60 42Q72 47 70 60L75 74L84 77L82 82L70 78L63 59L56 50Z');
  a+=p('M44 61Q32 67 35 77L45 84L50 80L42 74L50 68M58 62Q69 67 63 77L57 84L51 80L57 74L52 68Z');
  if(n==='Ateles belzebuth')a+=p('M46 40Q57 37 61 49L58 62L50 65L43 56Z',c,0,'none');
  a+=p(night?'M39 29Q37 15 50 14Q64 12 69 25Q72 37 60 42Q47 46 40 36Z':tamarin?'M41 29Q39 17 50 16Q65 14 68 27L64 38Q51 43 42 35Z':'M40 29Q38 15 50 14Q65 12 69 26L65 38Q52 44 41 35Z');
  a+=p(night?'M40 25Q45 15 51 23Q59 15 67 23L66 34L59 38L53 33L46 37L41 31Z':squirrel?'M41 25Q47 17 53 24Q59 17 66 24L64 35L56 40L46 34Z':'M43 25Q52 19 65 26L63 36L54 39L45 33Z',black?'#ae8e77':tamarin?d:c,0,'none');
  if(night)a+=e(47,27,4.7,5,d,.6)+e(60,27,4.7,5,d,.6);a+=eye(47,27,night?2.5:1.15)+eye(60,27,night?2.5:1.15)+e(54,33,1.8,1.2,d,0)+l('M50 37q4 2 8-1',d,.7);
  if(tamarin)a+=p('M52 32C43 30 41 39 31 39Q43 42 51 36L54 34Q61 41 75 36Q65 31 57 32Z',c,.6,c);if(squirrel)a+=p('M49 33Q54 29 59 34L57 38L51 37Z',d,0,'none');
  if(wool)a+=l('M33 43l-2 6m9-13-2 7m22-2 4 5M38 58l2 5',tint(b,18),1.3);
  if(squirrel)a='<g transform="translate(6 8) scale(.87)">'+a+'</g>';
 }else if(f==='Choloepodidae'){
  a+=l('M5 17Q48 23 96 12','#9b9d7d',3)+p('M29 36C24 46 29 64 42 70Q64 79 74 61Q82 43 67 35Q48 26 29 36Z')+p('M36 36Q24 35 25 18L32 18Q31 30 44 32M61 36Q73 29 67 16L74 15Q83 29 71 44M35 59Q25 67 22 77L28 81Q37 77 44 67M61 63Q74 66 78 78L85 78Q83 66 70 56Z')+l('M26 18q-4-6 1-11m3 11q-2-6 4-10M68 16q-3-7 2-11m1 10q0-7 5-10',c,1.6)+p('M53 39Q60 30 72 35Q84 40 81 51Q79 63 65 63Q51 60 51 48Z',c,1.4)+eye(61,44)+eye(75,45)+e(70,52,3,2.2,d,.5)+l('M34 41l-1 10m8-15-1 10m7-11v11M35 54l3 7',tint(b,20),1.2);
 }else if(f==='Cyclopedidae'||f==='Myrmecophagidae'){
  const silky=f==='Cyclopedidae',south=g==='Tamandua'&&n.endsWith('tetradactyla');
  a+=l('M5 84Q48 77 97 81','#9b9d7d',2.8)+p(silky?'M37 54C12 60 5 39 16 27Q26 14 36 24Q43 33 33 39L28 35Q36 30 29 27Q18 25 17 38Q16 47 39 45Z':'M31 57C5 46 1 68 14 80Q23 88 34 76L30 72Q23 81 17 72Q9 57 33 64Z',b,1.5);
  a+=p(silky?'M31 46Q33 29 48 31Q64 28 70 44Q76 60 64 68Q49 77 35 64Q27 57 31 46Z':'M26 53Q28 40 45 42Q61 36 73 47L79 61Q68 74 47 69Q25 70 26 53Z')+highlight('M35 40Q46 34 58 40L63 44Q47 39 37 47Z');
  a+=p(silky?'M37 49Q26 49 27 67L23 78L29 80L34 70L38 58M60 48Q74 48 70 62L65 75L71 77L78 61Q81 47 66 42Z':'M33 58Q25 65 27 78L34 80L36 69L42 64M62 57Q72 60 68 73L62 79L68 82L77 75L76 61Z');
  a+=p(silky?'M59 40Q63 31 72 35L88 45L89 49L84 51L71 47L62 46Z':'M66 44Q69 34 79 38L98 49L99 54L92 55L77 49L68 49Z')+eye(silky?72:81,silky?39:42,1.05)+dot(silky?88:98,silky?47:52,1,d)+l(silky?'M24 78l-3 5m7-4-2 5M66 75l-3 5m6-4-1 5':'M27 78l-4 5m7-4-2 5M63 79l-3 4m6-3-1 4',c,1.2);
  if(!silky)a+=p(south?'M37 43L48 42L50 51L65 53L71 64L61 69L43 59L37 57Z':'M38 43L49 42L51 51L63 52L69 62L61 67L45 59L39 57Z',d,0,'none');
 }else return null;
 // Arboreal families need different postures, not the same sitting monkey recolored.
 if(g==='Ateles'){
  a=l('M5 16Q49 11 96 18','#9b9d7d',2.8)+p('M44 60C16 62 3 40 12 23Q19 9 29 16Q37 22 30 29L25 27Q31 22 25 20Q15 18 16 32Q15 48 46 49Z',d,1.6);
  a+=p('M45 41Q57 33 66 44Q72 55 62 67Q51 78 41 65Q33 53 45 41Z')+p('M60 44Q72 35 74 22L78 16L83 17L81 25Q81 42 66 53M43 45Q26 44 23 60L18 74L11 78L12 82L22 79L29 63Q33 53 47 53Z');
  a+=p('M48 64Q41 74 46 83L56 88L61 85L52 79L56 69M61 65Q74 68 72 80L66 89L61 87L66 79L58 74Z');
  if(n==='Ateles belzebuth')a+=p('M49 43Q59 39 63 48L61 61L54 66L46 59Z',c,0,'none');
  a+=p('M59 36Q55 24 65 22Q78 19 82 32Q85 43 74 48Q61 47 59 36Z')+p('M62 32Q70 25 79 33L77 42L70 45L63 40Z',n==='Ateles paniscus'?'#b18e79':c,0,'none')+eye(65,33)+eye(76,33)+e(71,39,1.9,1.3,d,0)+l('M77 18l-1-5m4 5 1-5M13 78l-3-2m5 1-1-3M62 88l-1-3m3 3v-4',d,.85);
 }else if(g==='Saimiri'||g==='Saguinus'){
  const tam=g==='Saguinus';a=l('M4 80Q49 75 97 80','#9b9d7d',2.8)+p(tam?'M34 55C7 43 0 63 15 77Q24 85 30 73L26 70Q22 80 16 72Q7 59 36 63Z':'M35 54C9 45 4 21 17 18Q25 16 31 22L28 26Q18 18 16 27Q13 40 37 47Z',d,1.6);
  a+=leg(37,57,20,1,true)+leg(68,56,21,1,true)+p('M28 48Q32 37 46 40Q63 35 75 45L79 59Q69 69 49 64Q30 69 28 55Z')+p('M32 56Q51 64 72 54L72 61Q52 69 34 62Z',c,0,'none')+leg(32,59,18,-2)+leg(66,59,18,-1);
  a+=p('M66 43Q64 29 77 27Q90 27 94 39Q98 49 88 55Q74 61 67 49Z')+e(65,40,3.5,5,b,.8)+e(94,40,3,4.5,b,.8)+p(tam?'M69 38Q78 31 91 38L90 48L82 53L72 48Z':'M68 36Q73 29 80 37Q86 30 92 37L91 48L83 54L73 48Z',tam?d:c,0,'none')+eye(73,39,1.4)+eye(87,39,1.4)+e(81,46,2.3,1.5,d,0);
  if(tam)a+=p('M79 44Q69 42 62 54Q71 55 79 49L81 47Q89 54 99 50Q91 43 84 44Z',c,.6,c);else a+=p('M76 45Q81 41 86 46L84 51L78 50Z',d,0,'none');
  a+=l('M29 77l-3 3m5-3v3M63 77l-3 3m5-3v3',d,.75);
 }else if(g==='Lagothrix'){
  a=l('M6 85Q50 77 96 82','#9b9d7d',2.8)+p('M38 61Q11 62 12 39Q13 23 26 25Q38 28 31 38L26 37Q31 29 25 30Q17 30 19 42Q22 52 42 49Z',d,1.7)+p('M32 46Q36 28 54 31Q70 33 73 51Q79 73 61 78Q40 84 29 65Z')+p('M35 45Q24 46 25 63L20 77L27 81L33 67L42 56M62 45Q77 46 77 62L81 76L89 79L87 83L76 80L69 64L59 55Z')+p('M38 65Q29 76 36 82L48 86L53 82L44 77L49 69M61 65Q72 74 66 82L57 87L51 83L59 78L54 71Z')+p('M43 28Q41 13 55 13Q69 12 72 27L67 39Q54 47 44 36Z')+p('M45 26Q56 20 69 27L66 36L57 40L47 34Z',c,0,'none')+eye(50,28)+eye(64,28)+e(58,35,2,1.4,d,0)+l('M35 42l-3 7m12-12-2 8m21-7 3 6M36 59l3 5',tint(b,20),1.2);
 }
 return {art:a,profile};
}
function render(sp,color,skin='normal',sex=null){
 if(!sp||sp.origin!=='sa3230')return null;
 const cls=sp.taxonomy.className,result=cls==='Mammalia'?mammal(sp,sex):cls==='Aves'?bird(sp,sex):cls==='Reptilia'||cls==='Amphibia'?herp(sp):cls==='Actinopterygii'?fish(sp):null;
 if(!result)return null;
 const type={Mammalia:'mammal',Aves:'bird',Reptilia:'herp',Amphibia:'herp',Actinopterygii:'fish'}[cls];
 return `<svg viewBox="0 0 100 100" aria-hidden="true" data-sa-version="3.23.1" data-sa-polish="3231" data-sa-profile="${sp.artProfile}" data-sa-morphology="${result.profile}" data-zoological-family="${sp.family}" data-${type}-family="${sp.family}"${sex?` data-sa-sex="${sex}"`:''}>${result.art}</svg>`;
}
function bird(sp,sex){
 const n=sp.latin,g=n.split(' ')[0],f=sp.family,female=sex==='female';let {p,l,e,dot,eye,b,c,d}=tools(sp),a='';
 if(f==='Cathartidae'){
  b='#596656';c='#ece5ce';d='#354f40';
  a+=p('M36 60L15 89Q25 94 41 87L54 68Z',d,1.6)+p('M26 47C28 32 43 30 56 36Q69 39 72 54Q77 69 64 79Q42 89 29 73Q22 63 26 47Z',b)+p('M31 47Q33 33 50 39Q64 42 64 55L59 71L37 77L29 65Z',d,1.4);
  a+=p('M34 45Q44 35 56 43L59 53L49 57L34 53Z',c,0,'none')+l('M33 57Q45 60 58 56M33 63Q43 65 56 61M35 69L52 67',b,1.1);
  a+=p('M57 42Q60 33 62 24Q63 16 71 18Q81 19 80 29L75 38L73 47L64 52Z','#af9381',1.4)+p('M57 42Q65 49 75 41L80 45L77 51L69 53L60 49L56 46Z',c,1.1)+l('M59 44l3 5m2-3 2 5m2-4 2 5m2-5 3 3',tint(c,-32),.8);
  a+=p('M75 23Q90 20 94 29L92 36L88 38L87 31L78 29Z','#c9b997',1.2)+eye(73,24,1.15)+l('M66 32Q69 34 73 31','#806b60',.85);
  if(!female)a+=p('M64 21Q60 12 67 13Q74 13 78 21L76 25L70 21Z','#b09984',1.15);
  a+=l('M42 80L40 88M61 78L64 88',d,2.1)+l('M40 88l-6 3m6-3 3 4m-3-4 0 4M64 88l-4 4m4-4 6 3m-6-3 2 4',d,1);
 }else if(f==='Rheidae'){
  const lesser=n==='Rhea pennata';b='#a1a28f';d='#687b63';c='#e4dcc2';
  a+=p(lesser?'M18 48C18 32 34 27 50 31Q67 30 75 45Q81 59 67 66Q46 76 27 65Q16 62 18 48Z':'M17 49C18 33 33 27 48 31Q67 28 75 45Q83 59 67 68Q45 78 26 65Q15 62 17 49Z',b);
  a+=p('M22 45Q40 30 62 42L70 56L66 62L60 59L57 66L52 63L48 68L42 64L36 68L31 62L25 62Z',d,1.15)+l('M25 44q12-7 25 0M26 49q13-5 27 3M28 54q11-3 24 4M35 59l4 4m7-17 12 9',c,.85);
  a+=p(lesser?'M60 36Q66 28 65 19Q64 11 71 9Q81 7 84 15L81 22L76 24L76 42L69 50L62 47Z':'M60 37Q65 27 65 16Q65 5 74 6Q84 7 85 15L80 22L76 23L76 42L69 51L62 46Z',b)+p('M80 14L93 18L83 22L79 20Z','#b8b095',1)+eye(77,13,1.05);
  a+=p('M34 64L41 65L39 76L35 79L32 72ZM55 65L62 64L61 74L57 79L55 74Z',b,1.05)+l('M36 75L35 84L29 96M58 75L59 84L67 96',d,2)+l('M29 96l-6 2m6-2 4 3m-4-3 0 3M67 96l-3 3m3-3 6 2m-6-2 3 3',d,.85);
  if(lesser)for(const[x,y]of[[29,42],[38,38],[47,40],[55,43],[35,49],[46,49],[60,52],[41,59],[52,59],[65,59]])a+=p(`M${x} ${y}q2 2 3 0l-1 4-2-1Z`,c,0,'none');
 }else if(f==='Opisthocomidae'){
  b='#91826b';d='#4d5f4b';c='#dfc9a5';
  a+=l('M6 86Q51 79 96 83','#9c9e7e',2.8)+p('M43 56L9 90L16 94L44 80L53 64Z',d,1.5)+p('M11 89L17 84L23 87L19 92L15 94Z',c,0,'none')+p('M29 46Q32 31 47 34Q63 32 71 47Q77 61 65 73Q46 82 33 70Q25 61 29 46Z',b)+p('M32 46Q45 35 60 44Q68 52 60 66L37 70L31 60Z',d,1.2);
  a+=p('M36 47Q48 40 59 45L61 49L40 52ZM35 56L59 52L59 58L38 61Z','#ae8f70',0,'none')+l('M38 48l9-3m-9 5 15-3M36 56l16-2',c,.8)+p('M57 40Q56 28 65 24Q79 19 85 32L83 44L74 52L64 48Z',b)+p('M59 40L68 41L75 47L69 56L61 53Z',c,0,'none')+l('M63 43l3 7m1-9 4 8m-5-2 2 8',d,.7);
  a+=p('M65 28Q73 23 81 30L82 39L75 43L68 38Z','#8ba8aa',.6)+dot(76,32,2,'#b17c69')+dot(76,32,.85,'#23352d')+p('M82 32L94 35L85 40L81 38Z','#a9a080',1)+l('M64 28Q55 17 53 10M68 26Q62 13 64 5M72 25L75 6M77 27L85 11M80 29L92 18','#b19b74',1.35)+l('M44 74L40 84M60 73L64 83',d,1.7)+l('M40 84l-5 3m5-3 4 2M64 83l-4 4m4-4 5 2',d,.85);
 }else if(f==='Anhimidae'){
  b='#9ca591';d='#52694f';c='#e0dcca';
  a+=p('M19 51Q24 36 42 39Q59 35 71 49Q82 61 71 73Q55 83 32 73Q16 70 19 51Z',b)+p('M23 49Q40 37 58 47Q66 53 61 65L36 68L23 60Z',d,1.2)+l('M28 48Q41 43 53 50M27 54Q42 49 55 56M29 60L50 61',c,.9)+p('M57 42Q57 27 67 23Q81 20 86 30L83 42L77 50L67 51Z',b)+p('M61 40L79 42L76 48L64 46Z',d,0,'none')+l('M62 38L80 40',c,2)+p('M82 29Q92 29 94 34L90 38L88 34L81 34Z','#b5ad8e',1.1)+eye(77,30)+l('M66 25Q63 17 59 17M70 24Q68 14 70 12M75 24Q77 16 80 14',d,1.2)+p('M28 53L24 49L24 55L29 58Z','#bcaf8d',.8)+l('M37 74L35 88M58 75L61 88',d,2)+l('M35 88l-9 6m9-6 0 8m0-8 7 6M61 88l-6 7m6-7 4 8m-4-8 10 4',d,1);
 }else if(f==='Cotingidae'){
  b=female?'#a58867':'#c18b5c';d='#3f5547';c='#c4c5ad';
  a+=l('M12 87Q51 81 96 85','#9b9d7d',2.6)+p('M41 64L24 85L36 83L53 69Z',d,1.4)+p('M30 42Q31 27 48 27Q66 25 75 39L74 59Q69 76 52 78Q34 77 29 62Z',b)+p('M34 46Q42 38 58 43Q71 48 67 63L53 72L36 66Z',d,1.2)+p('M38 46Q49 40 61 45L66 52L58 57L41 53Z',female?'#9b9980':c,.7)+l('M39 57L54 63M42 62L51 67',female?'#b8a17f':'#697567',.8);
  a+=p(female?'M53 32Q48 20 59 17Q72 14 78 27L79 40L70 47L58 41Z':'M48 31C44 19 52 7 65 8Q81 9 86 24L87 38L79 43L65 43L54 37Z',b,1.5)+p('M81 36L93 40L83 44L80 41Z',female?'#b8ad84':'#d6bb7d',1)+eye(78,33,1.1)+l('M44 78L41 86M61 76L66 86',d,1.8)+l('M41 86l-5 3m5-3 4 2M66 86l-4 3m4-3 5 2',d,.9);
 }else return null;
 return {art:a,profile:sp.artProfile};
}
function fish(sp){
 const g=sp.latin.split(' ')[0];if(['Symphysodon','Paracheirodon'].includes(g))return null;
 let {p,l,e,dot,eye,b,c,d}=tools(sp),a='';
 if(g==='Arapaima'){
  b='#8fa48a';d='#526f57';c='#d7d9b9';
  a+=p('M17 48Q5 39 3 48L3 62Q7 72 18 61Z','#af8873',1.25)+p('M18 46Q19 33 34 36Q43 37 46 44Z',d,1.1)+p('M18 63Q20 76 37 73L48 65Z','#ae8975',1.1);
  a+=p('M14 49C32 39 52 40 70 42Q84 42 94 48L99 54L98 59Q85 68 66 67Q40 70 15 61Z',b)+p('M21 60Q49 68 77 59L94 55L97 60Q72 72 44 66L23 65Z',c,0,'none');
  for(let i=0;i<7;i++)for(let j=0;j<3;j++)a+=l(`M${22+i*7} ${48+j*4}q3 3 6 0`,i<3?'#a67d68':c,.7);
  a+=p('M73 57Q64 56 59 63L69 67L78 60Z',d,1)+eye(89,49)+l('M82 47Q77 55 83 63M91 57L98 56',d,.95)+l('M5 48L15 54M5 61L15 56M22 40l1 5m7-7v7m-5 22 0 5m7-7 1 6',c,.65);
 }else if(g==='Electrophorus'){
  b='#999377';d='#647c61';c='#d2c9a7';
  a+=p('M7 72C24 82 39 73 35 62C28 46 33 30 52 26Q76 21 94 32Q100 36 97 43L92 46Q78 42 66 43C52 41 45 44 48 54C58 77 35 94 7 76Z',b);
  a+=p('M9 77C34 94 58 78 50 56C45 45 53 41 66 44Q79 45 92 46L94 51Q76 48 65 48C54 47 53 49 55 57C62 81 36 98 9 80Z',d,1)+l('M15 80l-1 3m9-1v4m8-4 1 4m7-7 3 4m3-9 3 3m0-10 4 1m-4-10 4-1m1-9 2 4m7-6v4m9-3v4m8-3v4',c,.65)+p('M77 42Q72 43 73 50L80 48Z',d,.85)+eye(91,35,1)+l('M93 41L98 40M83 35Q80 39 83 42',d,.8);
 }else if(g==='Pygocentrus'){
  b='#9aa9a0';d='#5e7b67';c='#dfdbc2';
  a+=p('M27 51L8 38L13 55L7 74L28 62Z',d,1.25)+p('M34 39L42 23L48 25L53 30L61 27L69 37Z',d,1.1)+p('M43 69Q48 84 61 82L70 69Z','#b68b7a',1.1);
  a+=p('M24 52Q31 33 47 31Q67 26 83 39L95 51L98 61Q83 81 56 79Q31 77 24 61Z',b)+p('M29 61Q52 78 91 58L96 63Q77 84 50 76L34 71Z','#bc8b77',0,'none')+p('M31 48Q49 31 70 40Q52 37 36 54Z',tint(b,18),0,'none')+p('M71 56Q63 55 57 66L67 72L76 62Z',d,.9)+p('M88 58L98 57L98 62L91 67L87 64Z',c,.7)+l('M89 60L97 60M82 45Q74 57 82 67',d,.95)+dot(90,48,1.8,'#b59678')+eye(90,48,1.05)+p('M91 60l1 2 2-2m0 0 1 2 2-2Z',c,.45)+p('M76 41Q81 34 84 44Z',d,.8);
 }else if(g==='Colossoma'){
  b='#879b7f';d='#4e6853';c='#d5d4b8';
  a+=p('M29 51L10 37L15 55L9 74L30 63Z',d,1.2)+p('M35 39Q41 22 53 22L63 31L69 38Z',d,1.1)+p('M43 70Q50 88 65 80L69 68Z',d,1.1);
  a+=p('M25 51C31 29 53 23 73 33Q87 38 95 51L97 60Q84 84 59 83Q36 82 26 66Z',b)+p('M27 61Q56 71 92 56L95 63Q81 84 58 80Q36 80 27 65Z',d,0,'none')+p('M33 45Q49 30 68 36Q48 33 37 51Z',tint(b,19),0,'none')+l('M38 46q4 3 7 0m2-3q4 3 7 0m3 0q4 3 7 0M36 53q4 3 7 0m4-3q4 3 7 0m4-2q4 3 7 0',c,.6)+p('M73 57Q64 54 57 65L68 71L79 62Z',b,1)+eye(89,48)+l('M91 57L97 56M81 44Q75 56 82 66',d,.9)+p('M76 39Q82 33 84 44Z',d,.85);
 }else if(g==='Pseudoplatystoma'){
  b='#a3ad95';d='#59755f';c='#dedcc1';
  a+=p('M25 51L6 37L12 55L6 74L27 61Z',d,1.2)+p('M40 44L46 26L52 37L58 45Z',d,1)+p('M48 65L51 76L61 68Z',d,1);
  a+=p('M21 52Q39 40 60 44Q73 42 82 46L97 49L99 56L95 62L78 66Q58 70 38 63L22 61Z',b)+p('M27 59Q57 69 88 57L97 57L95 63Q63 73 35 64Z',c,0,'none')+p('M76 48Q88 44 97 49L99 56L87 61L76 58Z',b,1.1);
  for(const[x,y]of[[30,53],[40,48],[48,51],[57,48],[64,52],[70,48],[36,59],[46,59],[57,61],[69,59],[80,51],[87,49]])a+=dot(x,y,1.15,d);
  a+=p('M72 58Q63 55 58 64L67 70L77 62Z',d,.9)+eye(89,50,1.1)+l('M89 57Q99 65 95 79M89 58Q79 65 75 77M94 56Q102 57 99 67M86 60Q86 70 81 73M94 59Q94 68 90 73M88 60Q78 63 78 69M91 56L99 55',d,.85)+l('M80 47Q74 54 79 61',d,.8);
 }else if(g==='Salminus'){
  b='#c2ae79';c='#e9ddad';d='#758057';
  a+=p('M25 51L7 37L13 55L6 76L27 62Z','#b19a70',1.3)+p('M39 43L47 28L58 39L64 44Z',d,1.1)+p('M47 66L48 78L60 71Z','#b69572',1.1)+p('M76 43Q81 36 85 44Z',d,.8);
  a+=p('M21 51Q39 37 60 40Q78 39 92 48L99 54L97 61Q77 75 56 70Q35 69 22 61Z',b)+p('M27 58Q51 68 80 57L94 55L96 61Q72 73 51 67L29 64Z',c,0,'none');
  for(let i=0;i<6;i++)a+=l(`M${32+i*7} 49q3-4 6 0m-3 5q3 3 6 0`,d,.55);
  a+=p('M72 57Q63 53 57 63L68 69L78 61Z','#bda47b',1)+eye(90,49,1.2)+l('M87 57L98 55L98 59L91 62M81 45Q74 55 81 64',d,.95)+l('M9 41L19 55L9 71M47 34l3 8',c,.7);
 }else if(g==='Odontesthes'){
  b='#b9c6b9';c='#ece8ce';d='#6e8771';
  a+=p('M25 52L7 39L13 56L7 73L26 62Z',d,1.15)+p('M43 48L48 36L52 47ZM66 48Q71 36 77 40L84 50Z',d,.9)+p('M60 63Q63 75 75 72L84 62Z',d,.9);
  a+=p('M21 53Q43 45 67 47Q84 46 96 53L99 57L97 61Q79 69 56 65L21 61Z',b)+p('M26 57L89 54L96 57L89 59L29 61Z',c,0,'none')+p('M73 58Q65 57 60 63L70 67L78 61Z',b,.8)+eye(91,53,1.15)+l('M93 59L99 58M84 50Q79 56 84 63',d,.75)+l('M10 43L19 56L10 69',c,.65);
 }else return null;
 return {art:a,profile:sp.artProfile};
}
function herp(sp){
 const n=sp.latin,g=n.split(' ')[0],f=sp.family;let {p,l,e,dot,eye,b,c,d}=tools(sp),a='';
 if(['Boidae','Viperidae','Elapidae'].includes(f)){
  const ana=g==='Eunectes',yellow=n==='Eunectes notaeus',coral=g==='Micrurus',boa=g==='Epicrates',rattle=g==='Crotalus';b=coral?'#bc8b73':ana?(yellow?'#b4ac74':'#869b75'):boa?'#b49c7c':'#a79a78';d=coral?'#405a49':'#5d7451';c='#e5d7b6';
  const body=ana?'M12 76C1 63 6 43 25 42C44 40 58 54 48 68C38 81 17 73 21 59L30 58Q27 68 39 66Q48 62 39 55C27 44 13 53 14 65C15 79 42 85 62 74Q78 67 77 57Q77 48 68 48L64 39Q80 34 89 49C102 73 72 92 50 93C32 98 17 87 12 76Z':'M13 76C3 63 8 45 25 44C43 42 56 56 45 68C35 79 18 71 23 59L30 60Q27 67 38 65Q46 61 38 55C26 46 14 54 16 66C18 79 42 83 62 73Q78 66 77 56Q76 49 68 48L65 41Q80 37 87 50C99 71 73 90 50 92Q24 97 13 76Z';
  a+=p(body,b,1.5);const clip='sa3231-'+sp.artProfile;
  a+=`<defs><clipPath id="${clip}"><path d="${body}"/></clipPath></defs><g clip-path="url(#${clip})">`;
  if(coral){a+=l('M14 54l10 4M12 68l12-3M24 82l7-12M43 87l-1-13M63 84l-6-12M82 72l-12-7M86 54l-12 2M74 43l-4 10',d,4.8)+l('M16 51l10 4M13 72l13-5M29 84l7-13M48 88l-2-14M68 82l-7-12M85 66l-13-5M83 48l-11 5',c,1.6);}
  else for(const[x,y]of[[17,53],[14,67],[25,81],[43,87],[63,83],[80,73],[85,57],[76,45],[27,48],[41,57],[35,68]])a+=ana?e(x,y,3,3.5,d,.6):boa?e(x,y,3.3,3.8,b,1.4)+e(x,y,1.2,1.5,c,0):p(`M${x-4} ${y-2}q4-5 8 0l-2 5-6-1Z`,d,.8,c);
  a+='</g>'+p(ana?'M63 40Q66 32 77 34Q87 36 92 43L96 48L93 54L83 54L69 49L63 46Z':coral?'M64 41Q69 35 76 38L93 45L96 50L92 54L80 51L66 47Z':'M61 41Q65 32 76 34L91 40L96 47L92 54L79 53L64 47Z',b,1.4)+p('M65 46L79 45L94 49L92 53L80 50L68 49Z',c,0,'none')+eye(80,40,1.1)+l('M91 50l8 4m-2-1 1 3',d,.7);
  if(rattle)a+=p('M15 80L9 77L3 80L3 85L10 89L17 86Z',c,1)+l('M6 79l-1 6M10 79l-1 8M14 82l-1 5',d,.8)+dot(86,44,.65,d);
 }else if(['Alligatoridae','Crocodylidae'].includes(f)){
  const orin=f==='Crocodylidae',black=g==='Melanosuchus',yacare=n==='Caiman yacare';b=black?'#617761':'#8c9e7c';c='#d5d2ad';d=black?'#3d5947':'#587651';
  a+=p('M38 55C20 60 7 48 4 38Q1 59 18 69Q29 75 43 65Z',d,1.4)+p('M34 49Q26 43 20 49L15 61L22 63L28 54L39 58M61 60Q72 59 77 68L86 71L86 77L75 76L59 67Z',d,1.2);
  a+=p('M27 51Q34 39 51 41Q67 38 78 48L81 61Q71 72 48 68Q31 70 27 60Z',b)+p('M31 53Q38 44 54 45L69 48L72 52Q47 47 34 58Z',tint(b,17),0,'none');
  a+=l('M29 48l5-5 5 4 5-5 6 4 5-4 6 4 5-3 5 5M33 54l6-3 6 3 6-3 6 3 6-3 6 3M35 61l6-2 6 3 6-3 6 2M10 53l4-4m1 10 4-4m2 9 3-5',d,1.05);
  a+=p(orin?'M66 47Q70 39 78 43L98 49L99 54L89 58L73 59L66 55Z':black?'M66 47Q73 37 82 43L96 46Q100 49 99 56Q95 64 82 63L69 58Z':'M66 48Q71 38 81 42L94 46Q100 48 99 55Q95 61 83 62L69 57Z',b)+p(orin?'M73 54L98 52L98 55L87 60L74 59Z':'M72 56Q88 62 98 54L97 60L85 65L73 61Z',c,0,'none')+l(orin?'M76 53L99 52':'M77 55Q87 59 99 52',d,1)+e(76,43,3.5,2.7,b,.7)+eye(76,43,1)+dot(96,49,.8,d)+p('M40 62Q30 57 27 69L17 74L18 79L29 77L46 68M61 61Q72 63 69 73L80 80L86 78L75 72L74 61Z',b,1.2)+l('M18 78l-4 1m5-3-5 0m7-1-4-2M82 80l-2 3m3-4 2 3m0-4 4 1',d,.7);
  if(n==='Caiman crocodilus')a+=l('M76 42Q81 37 86 43',c,1.5);if(yacare)a+=dot(85,57,1.5,d)+dot(91,56,1.3,d)+p('M84 61l2 3 1-3m3-1 2 3 1-4Z',c,.45);
 }else if(sp.taxonomy.className==='Reptilia'){
  const ig=g==='Iguana',tegu=g==='Salvator',lava=g==='Microlophus';b=ig?'#89a67e':tegu?'#788971':lava?'#9f9e7e':'#b0a17c';d='#526f50';c='#ded6b6';
  a+=p(ig?'M39 56C15 40 1 39 3 57Q3 76 20 74Q10 69 10 58Q9 49 36 65Z':'M38 56C18 44 4 46 4 61Q4 77 20 73Q10 68 12 60Q14 52 38 65Z',b,1.4)+p('M38 48Q28 40 23 49L18 57L23 61L29 53L42 57M61 60L73 68L82 75L87 74L85 79L73 76L58 67Z',d,1.1)+p(tegu?'M27 52Q28 39 46 42Q64 36 77 47L82 61Q69 74 47 68Q27 70 27 52Z':'M28 53Q30 43 46 44Q64 38 76 48L81 60Q69 71 48 66Q28 70 28 53Z',b)+p('M35 60Q29 55 26 66L19 74L15 76L18 80L30 75L43 66M61 59Q72 60 71 71L80 78L88 79L88 82L77 81L65 74L68 65Z',b,1.15)+p(tegu?'M66 47Q70 35 82 39Q94 42 99 52L98 60L84 62L70 57Z':'M67 48Q70 36 82 40L98 50L98 56L85 60L70 55Z',b)+eye(84,45,1.1)+l('M88 55L98 53',d,.8)+l('M18 78l-6 2m7-3-6 0m8-2-5-2m7 1-3-4M84 81l-5 4m6-4-1 5m2-6 3 5m-1-6 5 3',d,.7);
  if(ig)a+=p('M73 54Q73 69 82 73L88 59Z',c,1)+l('M30 46l4-7 3 6 4-7 3 6 4-6 3 5 4-5 3 5M10 53l6 4m-5 8 8 2',d,1.25)+e(80,52,3,3,b,.8);
  else if(tegu){for(const[x,y]of[[34,49],[42,46],[49,50],[57,46],[65,49],[37,59],[48,60],[58,61],[68,57],[76,43],[83,47],[90,52]])a+=dot(x,y,1.45,c);a+=l('M8 56l8 4M9 66l10 1',c,2);}
  else a+=l(lava?'M32 52L73 48M34 59L72 56':'M33 49L70 47M34 59L73 57',lava?c:d,1.6)+l(lava?'M55 49l1 8m7-9 1 7':'M41 49l1 8m7-9 1 7m7-8 1 7',d,.65);
 }else if(g==='Ceratophrys'){
  b='#a6ac7a';d='#62784e';c='#e2d5ae';
  a+=p('M26 56Q11 48 10 65Q9 81 26 83L40 74M72 56Q90 48 92 65Q93 81 75 84L60 74Z',d,1.2)+p('M21 50Q24 30 47 33Q74 29 80 49Q88 74 67 85Q43 95 25 79Q15 66 21 50Z',b)+p('M23 48L29 26L41 33Q52 28 62 34L75 28L80 50L72 63L33 64Z',b,1.5)+p('M29 59Q51 72 75 58L71 72Q51 83 31 70Z',c,0,'none')+p('M29 49L39 39L47 48L56 37L68 43L76 54L64 55L56 64L45 55L32 58Z',d,0,'none')+e(37,39,5,4.4,c,.7)+e(66,40,5,4.4,c,.7)+eye(37,39,1.7)+eye(66,40,1.7)+l('M26 59Q51 74 78 58',d,1.2)+p('M33 65Q25 68 24 77L15 83L19 87L30 82L40 73M67 66Q77 69 78 77L89 82L87 87L74 83L61 73Z',b,1.1)+l('M17 85l-4 1m6-2-1 4m68-3 5 1m-7-2 1 4',d,.8);
 }else if(g==='Rhinoderma'){
  b='#a89975';d='#5c7051';c='#e2d5ac';
  a+=p('M31 53Q16 47 13 62Q9 78 27 80L46 67Z',d,1.3)+p('M27 52Q32 35 51 35L69 39L87 49L73 60L65 74Q50 85 33 71Q24 65 27 52Z',b)+p('M30 49L49 38L64 41L83 49L68 55L53 49L37 62Z',d,0,'none')+p('M64 41L72 43L88 48L83 52L68 53Z',b,1.05)+eye(69,43,1.6)+l('M73 51L85 50M49 38L54 64',c,1)+p('M53 59Q48 66 57 74L70 78L72 82L58 82L45 72L40 63M34 61Q27 67 23 75L12 79L15 83L29 78L42 67Z',b,1.2)+l('M14 81l-5 1m6-2-1 4M68 81l6 3m-4-3 1 5',d,.8);
 }else if(['Phyllobates','Dendrobates'].includes(g)){
  const blue=g==='Dendrobates';b=blue?'#7b9eac':'#cebb74';d=blue?'#425b4c':'#8b8955';c='#e6d9b3';
  a+=p('M34 49Q18 38 12 52Q6 68 22 78L41 66M66 49Q82 38 89 54Q95 70 78 79L59 65Z',d,1.2)+p(blue?'M28 47Q29 31 49 31Q70 30 76 48Q84 71 65 81Q46 91 29 74Q23 63 28 47Z':'M32 45Q32 31 49 31Q67 29 72 45Q80 64 65 78Q49 89 34 72Q28 59 32 45Z',b)+p('M34 55Q26 60 25 72L14 81L19 84L32 78L43 65M65 55Q75 60 75 72L88 80L85 85L72 79L57 65Z',b,1.2)+p('M30 42Q29 28 40 29L50 33Q58 25 68 31Q78 35 74 47L65 55L39 54Z',b,1.25)+e(40,35,4.5,4.4,c,.7)+e(65,35,4.5,4.4,c,.7)+eye(40,35,1.6)+eye(65,35,1.6)+l('M37 48Q51 54 69 47',d,.85);
  if(blue){for(const[x,y,rx,ry]of[[37,49,3.1,2.5],[49,57,3.4,3],[64,51,3.5,2.6],[35,66,3,4],[58,72,3.8,2.8],[69,65,2.6,3.5],[48,40,2.4,2.7]])a+=e(x,y,rx,ry,d,0);}
  for(const[x,y,s]of[[17,83,-1],[86,83,1]]){a+=l(`M${x} ${y}l${s*5} 2m${-s*5}-2 ${s*2} 4m${-s*2}-4 ${-s*2} 4m${s*2}-4 ${-s*4} 2`,d,.8);for(const[dx,dy]of[[s*5,2],[s*2,4],[-s*2,4],[-s*4,2]])a+=dot(x+dx,y+dy,.8,b);}
 }else return null;
 return {art:a,profile:sp.artProfile};
}
const detailSpecies=new Set(['Geranoaetus melanoleucus','Harpia harpyja','Buteogallus coronatus','Penelope jacquacu','Cariama cristata','Colaptes campestris','Campephilus magellanicus','Cairina moschata','Agelaioides badius','Scelorchilus rubecula','Spheniscus magellanicus','Paracheirodon axelrodi']);
function detail(sp,svg,sex){
 if(sp?.origin!=='sa3230'||!detailSpecies.has(sp.latin))return null;
 const g=sp.latin.split(' ')[0],female=sex==='female',{p,l,e,dot,c,d}=tools(sp);let a='';
 if(['Geranoaetus','Harpia','Buteogallus'].includes(g)){
  a+=l('M33 53Q40 58 48 59M34 58Q39 62 45 64M36 64L41 67',c,.9)+l('M17 84l12-13m-7 15 12-14',c,.65);
  if(g==='Harpia')svg=svg.replace('M63 25L56 12L64 17L68 8L72 18L79 10L80 24Z','M63 25Q58 21 59 14Q65 14 68 20Q67 11 71 10Q77 13 75 21Q79 16 81 17L80 25Z');
 }else if(g==='Campephilus'){
  a+=l('M37 55L53 61M37 61L49 66',c,.9)+l('M22 88l10-15m-4 15 10-17',d,.75);
  if(female){svg=svg.replace('M58 28L58 13L70 19L76 14L81 31Z','M58 28Q55 18 57 11Q62 12 65 19Q67 11 70 10Q75 17 76 25L81 31Z');a+=p('M77 34L84 34L84 38L78 38Z','#b77b6b',0,'none');}
 }else if(g==='Colaptes'){
  for(const[x,y]of[[38,49],[45,50],[54,49],[38,56],[46,57],[54,58],[43,65],[52,65]])a+=dot(x,y,.75,d);
  a+=l('M24 85l9-13m-3 15 9-17',c,.65);
 }else if(g==='Penelope'){
  a+=l('M36 44l3 4m3-6 3 4m3-6 3 4m3-5 3 4M37 52l3 3m4-3 3 3m4-3 3 3',c,.8)+l('M17 85l16-16',c,.9);
 }else if(g==='Cariama'){
  a+=l('M25 46l3 5m3-7 3 6m3-7 3 6m3-5 3 5M64 29q-5-5-7-5M66 27q-3-8-5-9',c,.8);
 }else if(g==='Cairina'){
  a+=l('M29 59l7 3m2-5 5 3m0-5 5 2',c,.85)+l('M22 65l5 5',d,.85);
  if(female)a='<g transform="translate(6 8) scale(.88)">'+a+'</g>';
 }else if(g==='Agelaioides'){
  // Baywing: rufous wing coverts and a short, deep seed-eating bill.
  a+=p('M35 47Q45 39 57 45L58 54L43 59L35 55Z','#b49772',.8)+p('M83 37L94 39L84 44Z','#8f9372',.9)+l('M38 50L50 53',c,.8);
 }else if(g==='Scelorchilus'){
  svg=svg.replace('M37 55L22 81L33 78L50 66Z','M37 56L27 74L35 73L49 65Z');
  a+=l('M53 61l12 2m-13 3 11 2m-13 3 9 2',c,.85)+l('M62 39Q67 35 72 37',c,1.2);
 }else if(g==='Spheniscus'){
  // Two dark breast bands; the AM-04 second pale stroke obscured the upper one.
  svg=svg.replace('M39 45Q51 51 65 45M36 55Q50 61 69 54','M39 45Q51 51 65 45');
  a+=l('M38 53Q51 61 68 53',d,2.2)+l('M38 61Q51 69 69 60',d,2.1);
 }else if(g==='Paracheirodon'){
  a+=l('M30 54L86 53','#9bc1c0',.8)+l('M10 42L18 55L9 70',c,.65)+l('M47 72l1 6m3-7 1 6',c,.65);
 }
 return svg.replace('data-sa-version="3.23.0"','data-sa-version="3.23.1" data-sa-polish="3231" data-sa-detail="true"').replace('</svg>',a+'</svg>');
}
root.ATLAS_SOUTH_POLISH_V3231=render;root.ATLAS_SOUTH_DETAIL_V3231=detail;
if(typeof module==='object'&&module.exports)module.exports={renderSouthAmericanPolish:render,detailSouthAmerican:detail};
})(typeof globalThis!=='undefined'?globalThis:this);
