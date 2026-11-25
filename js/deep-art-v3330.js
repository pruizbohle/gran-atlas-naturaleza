/* Reconstructed specimen plates; light marks belong only to documented organs. */
(function(root){'use strict';const cache=new Map;
function render(s){if(s?.origin!=='deep3330')return null;if(cache.has(s.latin))return cache.get(s.latin);const p=s.artProfile,ink='#233942',gray='#76828b',red='#93645e',light='#d8e6bc';let b='';
const path=(d,c=gray,w=1.2)=>`<path d="${d}" fill="${c}" stroke="${ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,line=d=>path(d,'none'),eye=(x,y,r=2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#d7d0ab" stroke="${ink}"/><circle cx="${x}" cy="${y}" r="${r*.55}" fill="${ink}"/>`,dot=(x,y,r=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${light}" stroke="${ink}" stroke-width=".4"/>`,photons=(xs,y)=>xs.map((x,i)=>dot(x,y+(i%2)*1)).join('');
const teeth=(xs,y,dir=1)=>xs.map(x=>path(`M${x} ${y}l2 ${dir*5} 1 ${-dir*5}Z`,'#ddd7b9',.6)).join('');
if(['frilled_shark','goblin_shark'].includes(p)){
const fr=p==='frilled_shark';b=path(fr?'M6 45Q17 39 29 47Q49 53 70 49L79 42 78 52 96 44 90 55 97 60 81 61Q60 67 38 61L7 58Z':'M3 47L26 35 43 43 74 51 93 37 88 56 97 68 78 64Q47 77 20 65L12 58 21 51Z',fr?'#766d68':'#b89891')+eye(fr?16:29,48)+path(fr?'M55 64L65 76 70 65M69 49L74 39 79 52Z':'M45 44L52 30 58 47M41 66L51 79 58 66Z',gray)+line(fr?'M8 54Q16 48 25 56M26 47L27 59M30 48L31 62M34 49L35 64M38 50L39 65M42 51L43 65M46 51L47 65':'M13 56L29 52 35 59 24 64M35 47L37 61M40 48L42 63M45 49L47 64');if(fr)b+=teeth([10,15,20],53);else b+=teeth([18,23,28],57);
}
else if(['sevenarm_octopus','dumbo_octopus','vampire_squid'].includes(p)){
const dumbo=p==='dumbo_octopus',vamp=p==='vampire_squid',c=vamp?'#81534f':dumbo?'#baa29c':'#a48c96';
if(dumbo)b+=path('M36 37Q13 12 17 39L32 50M64 37Q88 13 84 39L68 50Z',c);
b+=path(dumbo?'M32 44Q26 20 49 19Q75 20 68 46L64 56 37 56Z':vamp?'M35 40Q32 15 51 13Q72 17 66 42L63 55 39 55Z':'M31 44Q18 9 48 9Q81 12 70 45L63 58 39 57Z',c);
// Eight arm endpoints; Haliphron's common name does not remove an anatomical arm.
b+=path(vamp?'M38 49L12 76 28 70 36 87 49 73 61 87 68 71 88 77 63 49Z':dumbo?'M35 48L13 70 30 66 37 80 49 69 61 80 72 66 87 72 65 48Z':'M35 48L11 74 28 69 36 88 49 74 62 88 72 69 90 74 66 48Z',c);
for(let i=0;i<8;i++){const x=14+i*10,y=72+(i%3)*6;b+=line(`M${38+i*3.2} 50Q${x} 64 ${x} ${y}`);if(vamp)b+=dot(x,y,1.2);}b+=eye(37,43,vamp?4:2.6)+eye(64,43,vamp?4:2.6);if(vamp)b+=line('M39 49Q3 40 7 25M62 48Q95 39 91 23');if(dumbo)b+=line('M30 60l-3 5m9-8-3 6m11-7-2 6m12-6 2 6m6-5 3 6m4-3 4 6');
}
else if(['colossal_squid','hooked_squid','jewel_squid'].includes(p)){
const jewel=p==='jewel_squid',col=p==='colossal_squid',c=col?'#aa756d':jewel?'#9d7278':'#9b7c77';
b=path(col?'M35 41L75 18 94 45 77 66 35 58Z':jewel?'M35 40L65 25 86 40 88 57 63 69 35 57Z':'M34 40L83 24 95 47 83 65 34 58Z',c)+path(col?'M64 27L81 7 94 43M65 60L81 80 94 50Z':jewel?'M65 29L80 20 87 40M66 64L82 76 88 55Z':'M66 30L84 12 95 44M65 62L83 80 95 51Z',c);
for(let i=0;i<8;i++)b+=line(`M37 ${42+i*2}Q${11+i} ${22+i*7} ${14+i} ${27+i*7}`);b+=line(col?'M36 44Q1 4 5 15L10 19M35 54Q1 94 6 85L12 80':'M35 44Q1 6 5 16M35 55Q1 96 6 86')+eye(34,47,jewel?5:3.6);if(jewel)b+=eye(41,53,2)+photons([47,55,63,71],57)+dot(31,42)+dot(30,47)+dot(33,52);if(col)b+=dot(35,49,1.4)+line('M10 18l3-4m-1 7 3-3M10 81l3 3m-3-6 3 3');
}
else if(p==='gulper_eel')b=path('M8 35L34 39Q57 49 74 59Q95 58 96 76Q91 93 76 85Q92 85 91 75Q90 66 71 67L32 62 9 68Z','#65586a')+path('M9 39L36 45 26 60 10 65Z','#272d3b')+line('M12 39L34 45M10 66L29 60')+eye(15,35,1.2);
else if(p==='barreleye'){
b=path('M9 54Q9 32 32 32Q44 33 47 49L76 54 94 44 91 60 96 71 76 67Q44 79 13 67Z','#8c9b91')+path('M11 51Q5 24 28 22Q48 21 47 50Z','#b7d5ce')+path('M22 43L22 29 29 28 29 44M34 44L34 30 40 31 40 46Z','#668b69')+line('M15 56L29 57M47 53L58 45 65 55M45 69L55 80 60 69')+`<circle cx="14" cy="52" r="1.2" fill="${ink}"/>`;
}
else if(p==='hatchetfish')b=path('M13 39L35 25 58 38 67 50 88 43 86 58 94 69 66 64 41 80 19 70Z','#adb6b7')+eye(23,42,5)+path('M43 31L45 19 51 34M43 72L54 86 59 68Z',gray)+line('M14 60L27 62M32 43L34 68')+photons([25,32,39,46,53,60],70);
else if(p==='tripodfish')b=path('M9 42Q20 33 39 39L72 47 91 39 86 51 94 61 73 59Q38 65 12 53Z','#a5aaa8')+eye(17,43,1)+line('M10 49L23 50M30 52L18 92M36 55L53 93M79 56L91 92M33 39L40 28 48 41M24 47L5 24M27 47L16 17');
else if(p==='deep_angler')b=path('M12 58Q11 35 33 32Q56 29 68 51L89 45 85 61 93 74 68 68Q45 84 21 73Z','#6d686a')+path('M14 56L35 48 31 72 16 69Z','#2d3039')+teeth([17,23,29],55)+teeth([18,24],69,-1)+eye(30,42,2)+line('M36 34Q30 4 14 16L13 23M49 35L58 25 64 47M46 74L56 86 64 71')+dot(13,24,3);
else if(['viperfish','blackdragon','scaly_dragonfish'].includes(p)){
const vip=p==='viperfish',black=p==='blackdragon';b=path(black?'M7 50L25 45Q45 48 75 54L93 49 88 58 97 65 76 61Q43 64 9 60Z':vip?'M7 43L29 40 72 53 92 44 87 59 96 70 73 64 13 69Z':'M7 47L28 40 74 53 93 45 87 59 96 70 74 65Q41 74 11 64Z',black?'#42464b':vip?'#788490':'#657984')+path('M9 51L27 48 25 62 10 63Z','#29333d')+teeth(vip?[11,19]:[12,18,24],52)+teeth(vip?[14,23]:[15,22],62,-1)+eye(25,44,vip?3:2)+line(vip?'M34 44Q32 8 45 10M54 49L63 38 70 53':'M64 51L73 42 78 55M64 65L75 75 80 65')+photons([31,39,47,55,63,71],63);if(!vip)b+=line('M17 65Q20 86 30 84')+dot(30,84,2);else b+=dot(45,10,1.2);
}
else if(['fangtooth','short_fangtooth'].includes(p)){
const short=p==='short_fangtooth';b=path(short?'M10 53L23 34 35 26 41 37 62 43 78 54 94 42 90 60 97 73 77 68 50 79 21 72Z':'M9 48L25 30 44 33Q64 37 78 53L94 43 90 60 97 73 76 68Q49 84 15 70Z',short?'#85939c':'#75675e')+path('M11 52L32 46 28 67 13 66Z','#2e343b')+teeth(short?[15,21,27]:[14,24],53)+teeth(short?[17,24]:[18,27],66,-1)+eye(27,41,short?3:1.6)+path('M46 39L51 25 60 44M48 76L57 87 65 73Z',gray);if(short)b+=line('M30 34L25 20M21 65L13 80');else b+=path('M17 64L20 48 23 64M27 64L29 52 31 64Z','#ddd7b9',.6);
}
else if(p==='lanternfish')b=path('M7 53Q19 38 42 44L76 54 94 42 89 59 97 73 76 65Q41 76 10 65Z','#6e8591')+eye(20,52,4)+line('M9 61L24 62M31 48L33 65')+path('M41 44L48 29 55 47M63 51L68 45 73 53M43 69L55 81 60 67Z',gray)+photons([28,35,43,51,59,67],66)+dot(16,62);
else if(p==='antarctic_toothfish')b=path('M6 53Q16 39 34 42Q54 40 77 53L94 43 91 60 97 74 76 67Q35 79 10 67Z','#8b9290')+eye(19,51,2)+path('M32 43L36 31 41 40 46 31 52 43 62 37 72 50M38 70L51 84 59 68Z',gray)+line('M8 61L26 62M29 47L32 67')+[35,44,54,65].map((x,i)=>`<ellipse cx="${x}" cy="${52+i%2*6}" rx="3" ry="2" fill="#626e6d"/>`).join('');
else throw Error('Unimplemented deep plate '+p);
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${s.name}" data-deep-profile="${p}" data-zoological-family="${s.family}" data-light-organs="${s.bioluminescence?'documented':'none'}">${b}</svg>`;cache.set(s.latin,svg);return svg;}
const api={render};root.AtlasDeepArt3330=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
