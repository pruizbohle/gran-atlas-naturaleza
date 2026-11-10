/* Original family-specific plates. Biological class is never replaced by the game group. */
(function(root){'use strict';const cache=new Map();
function render(s){if(s?.origin!=='marine3320')return null;if(cache.has(s.latin))return cache.get(s.latin);const p=s.artProfile,n=s.latin,f=s.family,ink='#203c48',white='#eef1df',blue='#5e91a6';let b='';
const path=(d,fill=blue,extra='')=>`<path d="${d}" fill="${fill}" ${extra.includes('stroke=')?'':'stroke="'+ink+'"'} ${extra.includes('stroke-width=')?'':'stroke-width="1.4"'} stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const eye=(x,y,r=1.3,color=ink)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
const line=d=>path(d,'none');const spots=(color=white)=>[25,34,45,57,67].map((x,i)=>eye(x,49+(i%2)*9,1.4,color)).join('');
const cet=['rorqual','blue_whale','brydes_whale','humpback','right_whale','grey_whale','sperm_whale','beaked_whale','dolphin','porpoise','orca','pilot_whale','rissos','false_killer'];
if(cet.includes(p)){
 let fill=p==='orca'?'#243b45':p==='rissos'?'#a7b3b4':p==='right_whale'?'#45565f':p==='blue_whale'?'#779ca9':'#607d8a';
 const sperm=p==='sperm_whale',right=p==='right_whale',dolphin=['dolphin','porpoise','orca','pilot_whale','rissos','false_killer','beaked_whale'].includes(p),beak=p==='dolphin'||p==='beaked_whale';
 b=path(sperm?'M7 39L38 34Q56 35 72 53L84 54 96 42 93 55 98 62 84 61Q47 76 8 66Z':right?'M7 56Q12 26 41 33Q61 32 78 54L87 55 97 44 94 56 98 63 84 61Q50 83 13 68Z':beak?'M4 56L16 51Q23 34 41 41Q60 41 77 56L86 56 97 44 94 57 98 64 84 63Q46 78 17 64L4 61Z':'M7 56Q17 34 40 40Q62 39 79 55L86 56 97 45 94 56 98 63 84 63Q50 78 14 65Z',fill);
 if(!right&&p!=='grey_whale'&&!sperm)b+=path(dolphin?'M51 43Q61 25 64 34L65 49Z':'M65 48L72 35 76 53Z',fill);
 if(p==='grey_whale')b+=path('M62 48l4-5 4 7 5-1 4 6',fill);
 b+=path(p==='humpback'?'M36 62Q55 89 66 81L48 59Z':'M37 62L49 78 57 75 49 61Z',p==='humpback'?white:fill)+eye(sperm?29:beak?21:20,54)+line(sperm?'M10 64L31 64':'M10 60Q24 66 34 61');
 if(!dolphin&&!right&&p!=='grey_whale'&&!sperm)b+=line('M17 64Q40 75 65 64M21 66Q39 78 59 69M26 69Q40 80 53 71');
 if(p==='brydes_whale')b+=line('M10 54L29 45M12 56L31 49M13 58L32 53');
 if(p==='right_whale')b+=[14,20,28].map((x,i)=>eye(x,43-i*2,2.2,'#c1c4ad')).join('');
 if(p==='blue_whale'||p==='grey_whale')b+=spots('#adc4c5');
 if(p==='orca')b+=path('M16 59Q33 67 47 61L73 64Q45 79 18 66Z',white)+`<ellipse cx="29" cy="48" rx="5" ry="2.8" fill="${white}"/>`;
 if(p==='dolphin')b+=path(n==='Delphinus delphis'?'M22 58L41 50 63 61 43 66Z':n.startsWith('Lagenorhynchus')?'M27 59L42 50 66 60 50 67Z':'M22 62Q46 66 68 63L53 70 32 68Z',n==='Delphinus delphis'?'#d5c49a':'#c2d7d5');
 if(p==='rissos')b+=line('M31 47l6 6m5-8 7 8m0-6 6 7M29 64l7-4m13 5 8-4');
 if(sperm)b+=line('M13 42L18 40');
}
else if(['eagle_ray','manta','devil_ray'].includes(p)){
 const manta=p==='manta',devil=p==='devil_ray';b=path(manta?'M39 40L7 20 17 54 43 72 62 72 88 55 96 20 62 40Z':'M39 40L7 25 14 57 43 72 62 72 90 57 96 25 62 40Z',manta?'#425765':'#607985')+path('M43 42Q50 27 59 42L62 69 44 69Z',blue)+path('M49 70Q66 84 46 98','none')+eye(43,41)+eye(59,41);
 if(manta||devil)b+=line('M43 39Q29 22 36 21L45 35M60 39Q73 22 68 22L59 34');else b+=path('M45 36L50 29 58 36Z','#a9b1a0')+spots();
}
else if(['turtle','sea_krait'].includes(p)){
 if(p==='turtle')b=path('M32 31L16 13 9 18 26 45M67 31L83 13 90 18 73 45M32 68L18 83 25 88 42 73M67 68L81 82 75 88 59 74','#76977c')+path('M28 43Q29 20 50 20Q75 23 74 47Q75 76 50 80Q25 74 28 43Z',n==='Chelonia mydas'?'#82976d':'#957f61')+path('M43 20L44 10Q50 3 56 10L57 23Z','#96ad8c')+line('M37 36L50 28 64 36 63 60 50 70 37 59ZM28 45L37 45M64 45L74 45M50 29V20M50 70V80')+eye(47,12)+eye(54,12);
 else b=path('M8 78Q4 52 25 55Q52 63 41 40Q32 20 56 23Q78 25 69 46Q62 65 86 56L96 60 90 71Q63 82 59 62Q56 50 61 35Q56 29 48 34Q65 68 36 70Q11 63 16 84Z','#b8c8c0')+line('M13 53L23 65M30 56L34 70M42 50L50 57M41 35L51 35M52 23L53 32M67 28L61 36M67 44L59 45M60 61L69 61M69 70L74 60M85 58L85 72')+eye(90,62);
}
else if(['sea_lion','seal','elephant_seal'].includes(p)){
 const eared=p==='sea_lion';b=path(eared?'M13 64Q20 59 23 34Q30 20 41 31Q48 43 58 55L77 67 92 63Q99 68 87 72L77 75Q43 80 13 72Z':'M9 59Q12 43 30 46Q53 40 76 63L86 62Q97 64 94 69L84 69Q95 76 88 77L77 73Q43 82 16 69Z',eared?'#7f7564':'#91a4a7')+path(eared?'M40 52L53 82 70 79 51 54Z':'M35 64L46 80 60 77 49 62Z','#637c80')+eye(eared?31:20,eared?34:53)+line(eared?'M23 41L32 42M24 39L15 43M25 43L15 47':'M12 60L24 61');if(eared)b+=path('M41 31L45 27 45 35Z','#7f7564');if(p==='elephant_seal')b+=path('M15 48Q3 41 5 58L13 63 17 54Z','#91a4a7');
}
else if(['octopus','giant_octopus','blanket_octopus','blue_ring_octopus','coconut_octopus','bimac_octopus','day_octopus'].includes(p)){
 const color=p==='blue_ring_octopus'?'#c2ad62':p==='coconut_octopus'?'#927d66':p==='giant_octopus'?'#b27e66':'#ac9188';
 b=path('M35 42Q30 13 50 13Q73 13 66 43L60 54 40 54Z',color);
 if(p==='blanket_octopus')b+=path('M39 48L6 75 42 65 50 92 58 66 93 75 62 47Z','#b88c9f');
 for(let i=0;i<8;i++){const start=35+i*4.2,end=5+i*12.5,y=70+(i%3)*9;b+=path(`M${start} 48Q${end} 65 ${end} ${y}Q${end+8} ${y+12} ${end+6} ${y-1}`,'none',`stroke="${color}" stroke-width="5"`);}
 b+=eye(40,43,2.5)+eye(61,43,2.5);if(p==='blue_ring_octopus')b+=[34,42,50,58,66].map((x,i)=>`<circle cx="${x}" cy="${31+i%2*9}" r="2.8" stroke="#3675b5" stroke-width="1.6" fill="none"/>`).join('');if(p==='bimac_octopus')b+=eye(34,46,3,'#426a9d')+eye(66,46,3,'#426a9d');
}
else if(['giant_squid','reef_squid','jumbo_squid','diamond_squid'].includes(p)){
 const diamond=p==='diamond_squid',reef=p==='reef_squid';b=path(diamond?'M28 38L62 9 94 42 65 69 29 56Z':reef?'M27 41Q43 10 81 24L94 48Q62 79 28 57Z':'M27 42L80 25Q96 46 80 65L27 58Z',p==='jumbo_squid'?'#bc7d73':'#c4aba3');if(!diamond)b+=path('M64 29L80 17 85 35M64 64L80 78 86 59Z','#ab929b');
 for(let i=0;i<8;i++)b+=path(`M30 ${43+i*2}Q${4+i*2} ${20+i*8} ${9+i} ${27+i*7}`,'none');b+=path('M29 46Q2 1 3 13M29 56Q2 98 4 86','none')+eye(32,49,2.5);
}
else if(['penguin','rockhopper','chinstrap','gentoo','king_penguin'].includes(p)){
 b=path('M33 77Q26 56 36 35Q34 17 49 16Q65 18 63 36Q72 60 65 77Z','#263e48')+path('M42 36Q59 35 61 57L60 76 38 76Q32 55 42 36Z',white)+path('M35 41L22 64 28 68 40 47M62 40L76 65 70 68 57 47Z','#263e48')+path('M39 77L29 84 47 83 49 77M56 77L53 84 71 82 64 77Z','#b28e63')+path('M60 27L76 31 62 34Z',p==='king_penguin'?'#d5a464':'#c59079')+eye(57,25);
 if(p==='rockhopper')b+=path('M50 23L35 29 31 37 44 29 52 28M61 24L75 28 81 36 68 29Z','#dac365')+line('M63 32L71 33');if(p==='king_penguin')b+=path('M58 33L53 37 56 47 49 44 49 36Z','#e6b85f');if(p==='chinstrap')b+=path('M43 26Q46 20 55 25L63 35 48 40Z',white)+line('M45 35L56 39 59 34');if(p==='gentoo')b+=path('M48 21L60 23 62 29 54 27Z',white);
}
else if(['albatross','petrel','gannet','frigatebird'].includes(p)){
 const color=p==='petrel'?'#626d6b':white; b=path(p==='gannet'?'M24 60Q38 45 54 49L63 34 71 33 74 44 90 48 73 52Q55 74 31 66L8 76Z':'M24 60Q39 45 56 49L64 38Q75 33 76 44L89 48 74 54Q55 73 31 66L8 77Z',color)+path(p==='frigatebird'?'M35 52L3 13 43 41 78 8 65 49 91 78 48 63Z':p==='albatross'?'M36 51L2 33 4 27 47 40 91 18 94 24 59 54 69 72 46 64Z':'M35 52L6 23 43 41 77 16 66 51 80 74 48 64Z',p==='frigatebird'?'#364c57':p==='gannet'?white:'#596d76')+eye(70,42)+line('M80 46L89 49 84 52');if(p==='frigatebird')b+=path('M64 48Q54 51 58 60L65 57Z','#af7067');if(n==='Thalassarche melanophris')b+=line('M64 39L74 43');
}
else {
 const shark=['thresher','requiem_shark','mako','basking_shark','whale_shark','hammerhead','cookiecutter'].includes(p);
 if(shark){
  const color=p==='whale_shark'?'#5e8291':p==='cookiecutter'?'#887e6b':'#708f9a';
  b=path(p==='whale_shark'?'M6 49Q13 35 35 41L74 50 92 26 86 53 97 68 81 63Q46 77 9 64Z':p==='cookiecutter'?'M7 52Q14 42 32 47L78 53 92 44 88 57 95 67 80 63Q44 69 9 62Z':p==='thresher'?'M7 54Q23 40 47 47L72 54Q84 25 95 10L87 55 97 65 78 65Q47 76 13 64Z':'M5 56Q22 37 49 46L75 54 93 32 86 56 97 69 78 65Q43 77 12 65Z',color);
  b+=path(p==='cookiecutter'?'M61 48L66 41 69 51M71 52L77 45 80 54Z':'M43 45L53 27 57 48M38 64L54 80 60 66Z',color)+eye(18,53)+line('M26 51L29 61M31 50L34 62M36 50L39 63');if(p==='hammerhead')b+=path('M8 48L20 40 26 44 18 52 18 61 29 68 21 73 6 65Z',color)+eye(20,44)+eye(21,68);if(p==='whale_shark')b+=spots()+spots('#b9d3d5')+line('M6 59L20 59');if(p==='basking_shark')b+=path('M7 55Q17 47 23 51L23 62 10 65Z','#263d45')+line('M31 48L35 64M36 48L40 65M41 49L45 65');if(p==='cookiecutter')b+=path('M23 47L31 48 32 65 24 64Z','#485351');
 }else if(p==='sunfish')b=path('M18 50Q20 29 49 33L58 14 67 13 64 39 81 48 79 64 63 72 66 91 57 88 48 73Q21 75 18 50Z','#9cadaa')+eye(27,47)+path('M44 55L58 61 46 67Z',blue)+line('M73 46L69 52 75 58 69 65M20 57L28 57');
 else if(p==='seahorse')b=path('M59 14L75 24 72 31 61 30 59 39Q40 49 48 65Q59 79 44 90Q21 99 26 78Q29 67 36 74Q26 90 43 83Q47 75 37 65Q22 46 44 32L43 21Z','#c0a075')+eye(59,23)+path('M36 40L23 43 29 57 38 53Z','#9c9f80')+line('M45 40L53 43M40 47L49 49M39 55L47 57');
 else if(p==='sailfish'||p==='swordfish')b=path('M1 54L26 49Q43 41 70 51L87 54 97 37 91 57 98 71 84 64Q48 72 27 61L2 58Z',blue)+path(p==='sailfish'?'M30 46L39 15 49 18 55 29 62 27 69 47Z':'M54 48L61 31 66 51Z',p==='sailfish'?'#4d7da2':blue)+eye(30,54)+path('M42 63L59 80 63 67Z',blue);
 else if(p==='stonefish')b=path('M9 63L15 49 23 47 25 37 35 42 42 34 49 41 59 37 65 47 76 50 89 43 85 60 93 70 76 69 64 76 52 70 40 77 28 71 17 74Z','#aaa18b')+eye(22,49,2)+eye(30,44,2)+line('M11 62Q25 55 36 62')+[44,57,64,38].map((x,i)=>eye(x,49+i%2*10,3,'#8f937f')).join('');
 else {
 const deep=['triggerfish','angelfish','surgeonfish','parrotfish','wrasse','grouper','clownfish'].includes(p);const color=p==='clownfish'?'#d69b5b':p==='surgeonfish'?'#467fbb':p==='angelfish'?'#4c82a5':p==='parrotfish'?'#79a295':p==='triggerfish'?'#405865':p==='grouper'?'#8c9c86':'#8fafb3';
 b=path(deep?p==='wrasse'?'M9 53Q12 24 32 28Q56 30 76 49L93 38 90 56 96 74 76 64Q33 88 12 65Z':p==='triggerfish'?'M11 55L31 32 67 36 79 51 96 38 91 57 96 74 77 65 35 76Z':'M9 55Q23 29 50 36L76 50 93 39 90 57 96 74 75 66Q36 85 12 65Z':p==='cod'?'M6 55Q18 44 47 47L77 55 94 45 90 59 97 70 76 65Q35 76 10 65Z':p==='icefish'?'M8 57Q17 39 34 44L73 55 95 46 91 60 97 70 75 65Q39 74 12 66Z':'M6 56Q28 42 52 47L78 55 95 36 89 58 97 75 77 65Q35 77 10 66Z',color)+eye(19,54)+line('M10 63L24 64M27 51Q34 59 27 66');
 if(['tuna','albacore','mackerel'].includes(p))b+=path(p==='albacore'?'M36 60L66 82 64 72 45 58Z':'M36 61L50 74 52 64Z',blue)+path('M39 47L46 30 51 48M60 51L65 41 70 54Z',blue)+line('M71 52l3-5m1 8 3-5M72 65l3 5m2-6 4 4');
 else if(p==='cod')b+=path('M34 47L39 37 47 47M51 49L59 38 64 51M67 53L72 46 76 55Z',blue)+line('M20 65L19 75');
 else if(p==='flyingfish')b+=path('M28 56L68 18 75 19 51 66Z','#afc8ca')+path('M48 64L72 82 75 77 60 61Z','#bed6d0');
 else if(p==='jack')b+=path('M37 47L46 36 55 49M45 69L58 80 64 67Z',blue)+line('M61 60L78 60M68 58v5m4-5v5m4-5v5');
 else if(p==='salmon')b+=path('M40 47L47 35 53 48M68 52L72 47 76 54Z',blue)+spots('#516a70');
 else if(p==='herring')b+=path('M42 47L48 35 53 48Z',blue)+line('M30 65L65 65M35 68L62 68');
 else if(p==='toothfish'||p==='icefish')b+=path('M35 46L39 35 44 43 49 35 54 46 66 42 73 55Z','#91a6a6')+spots('#5e7379');
 else if(deep)b+=path(p==='triggerfish'?'M32 33L40 21 43 35Z':'M35 38L48 24 59 36 67 33 72 48Z',color)+path('M38 71L49 82 61 74Z',color);
 if(p==='clownfish')b+=path('M26 41L30 38 38 39 40 71 33 72Z',white)+path('M59 40L64 43 65 73 58 75Z',white)+path('M79 51L84 49 84 67 79 65Z',white);
 if(p==='triggerfish')b+=spots(white)+path('M13 57L25 52 27 62 15 66Z','#d4b86e');
 if(p==='angelfish')b+=line('M32 39L33 73M39 36L41 77M47 35L48 77M55 37L57 76M64 42L65 73');
 if(p==='surgeonfish')b+=path('M29 45Q47 37 63 48L44 55 64 65 34 68Z','#264955')+path('M79 56L93 43 90 58 95 71 78 64Z','#dec868');
 if(p==='parrotfish')b+=path('M8 55L17 51 18 59 11 63Z','#d9b6a0');
 if(p==='wrasse')b+=line('M28 40Q45 29 63 48M32 47Q50 36 66 55M37 56Q51 48 66 62');
 if(p==='grouper')b+=spots('#536f63');if(p==='mackerel')b+=line('M34 47l4 8m4-8 3 8m5-8 3 8m6-6 2 7');
 }
}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${s.name}" data-marine-profile="${p}" data-zoological-family="${f}">${b}</svg>`;cache.set(s.latin,svg);return svg;
}
const api={render};root.AtlasMarineArt3320=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
