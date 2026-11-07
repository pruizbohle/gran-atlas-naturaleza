/* El Gran Atlas 3.19.7. Original individual plates, not transformations of production sprites.
 * Coordinates use a 100-unit zoological plate; no filters, external assets or random IDs.
 * Fictional identities describe plausible real animals, not historical individuals. */
(function(root){
'use strict';
const ink='#373c39';
const path=(d,fill,stroke=ink,width=1.2)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const ellipse=(cx,cy,rx,ry,fill)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
const eye=(x,y)=>ellipse(x,y,1.15,1.1,'#262b28')+ellipse(x-.3,y-.3,.3,.3,'#e7d8af');
const line=d=>path(d,'none','#66685b',.8);
const plates={
silverback(){
 return path('M28 49Q22 39 28 29Q32 21 42 21Q47 12 56 17Q65 17 65 31Q76 33 80 48L86 76Q85 82 78 81L69 61L67 78L54 81L51 63L43 65L40 82L25 83L24 76L29 59L20 75Q16 81 11 77L17 53Q20 48 28 49','#424b4c')+
 path('M30 42Q41 31 54 35Q67 38 71 51L64 66Q48 70 32 57Z','#9ea6a0')+
 path('M29 44Q37 37 44 40L39 58L32 75L24 76L29 58Z','#626b69')+
 path('M43 25Q52 19 59 27L62 38Q57 47 46 43L40 35Z','#353f3f')+
 path('M44 32Q51 27 58 31L57 35L46 36Z','#747b70')+
 path('M45 36Q51 32 57 36L60 41Q52 48 44 42Z','#62695f')+eye(46,32)+eye(56,31)+
 path('M48 37Q52 35 55 37M48 41L55 41M23 76L30 76M76 77L82 77M31 47L29 59M56 58L62 61','none','#303a38',1)+ellipse(50,37,1,1,'#293330')+ellipse(54,37,1,1,'#293330');
},
ambar(){
 let a=path('M24 56Q14 55 10 48Q5 36 12 31Q16 30 15 35Q8 45 24 47M26 46Q39 37 64 43L72 54L69 68L74 80L65 81L58 62L43 62L39 80L28 80L31 60Z','#c9853e')+
 path('M61 42L65 30L73 28L82 34L84 44L91 48L86 54L74 55L68 61L60 54Z','#daa057')+
 path('M65 32L64 24L70 28M77 31L82 25L83 36','#775136')+
 path('M69 46Q76 48 84 44L90 48L85 53L75 52L70 56Z','#f1e6c9')+
 path('M39 58Q50 61 59 56L61 63L43 66Z','#efe2c3');
 for(const d of ['M30 44l6 12-2-14','M42 42l5 13 2-14','M54 43l3 12 4-11','M66 35l6 7-2-11','M77 35l-2 8 5-4','M65 60l3 10','M33 68l6 1','M15 44l-5 3'])a+=path(d,'#3d3d33','#3d3d33',1);
 return a+eye(79,40)+path('M87 47l3 1-3 2Z','#3f3c34')+line('M75 49L69 48M76 51L69 53M30 78L38 78M66 78L72 78');
},
niebla(){
 let a=path('M69 60Q93 63 89 76Q84 88 61 83Q43 80 41 87','none','#747e7d',9)+
 path('M23 53Q29 40 46 43Q59 42 66 53L66 64L57 67L59 79L48 79L44 64L34 65L29 78L18 78L24 62Z','#b9c1b9')+
 path('M22 53L17 44L19 32L28 28L37 34L39 47L33 56Z','#c9d0c4')+
 path('M19 34L17 25L25 29M31 30L36 25L38 36','#899691')+
 path('M21 46Q26 42 34 45L33 52L24 53Z','#eee9d5');
 for(const [x,y]of [[29,56],[39,50],[49,49],[58,56],[51,59],[25,65],[58,72],[72,79],[82,72]])a+=`<ellipse cx="${x}" cy="${y}" rx="2.5" ry="1.8" fill="none" stroke="#5d6966" stroke-width="1.3"/>`;
 return a+eye(23,39)+eye(32,39)+path('M26 46l3 0-1 2Z','#5c6660')+line('M23 49l-7 1M30 49l8 1');
},
fenrir(){
 return path('M33 52Q44 44 61 49L69 59L63 67L63 80L54 80L51 64L40 66L35 81L25 81L28 65Q19 70 9 62L17 57L27 53Z','#7e898a')+
 path('M54 50L58 34L65 25L67 16L74 25L82 20L82 37L91 42L88 48L77 50L72 62L62 63Z','#919b97')+
 path('M61 38L66 27L67 20L70 30M77 29L80 24L79 35','#5c6969')+
 path('M64 45L69 48L78 46L87 44L88 48L77 53L69 64L60 59Z','#e0dfcb')+
 path('M31 55Q41 48 55 51L56 56L40 58L31 63Z','#5a6b6e')+
 path('M25 55L14 62L22 63L31 60Z','#c1c6b8')+eye(78,38)+path('M88 40L92 42L89 45L86 43Z','#35403d')+line('M29 78l6 0M55 78l7 0M64 54l-2 5M41 52l4 2');
},
atlas(){
 return path('M24 43Q20 30 39 28Q63 22 74 36L76 60L70 80L59 80L57 62L44 64L42 81L30 81L29 58L21 58L18 77L11 77L15 50Z','#89948b')+
 path('M57 30Q74 20 83 35L85 49Q87 60 93 70Q97 82 87 84L79 80L82 76L87 78L86 71L76 56L69 48Z','#9da59a')+
 path('M57 33Q44 26 40 40Q37 53 52 62L63 57L67 40Z','#7c8981')+
 path('M59 36Q48 31 45 42L47 52L56 56L60 52Z','#a3aa9d')+
 path('M78 51Q73 65 65 65Q71 61 73 50Z','#e6ddbd')+
 path('M82 52Q80 62 77 64L79 53Z','#ded6b7')+
 path('M18 44Q8 52 10 62','none','#5a6961',2)+ellipse(10,63,2,3,'#48564e')+eye(78,39)+line('M85 59l-6 2M88 67l-5 2M31 76l10 0M60 76l10 0M18 72l-5 0M51 34q-6 5-6 12');
},
centinela(){
 let a=path('M44 64L36 85L48 81L54 86L60 65Z','#5a4c37')+
 path('M36 39Q35 28 49 26L59 34Q71 42 70 58L60 73L43 70L34 57Z','#7f6745')+
 path('M43 36Q29 37 25 50L21 75L32 71L35 76L42 68L48 47Z','#4e493b')+
 path('M60 37Q73 42 78 60L81 73L70 69L65 72L56 62L53 46Z','#64543b')+
 path('M43 29Q43 19 53 17Q62 15 66 24L75 29L67 32L62 38L52 39Z','#b69759')+
 path('M53 20Q63 17 65 25L73 28L65 29L58 27Z','#d0b77d')+
 path('M66 25Q80 26 75 34L70 30L66 30Z','#bca16a');
 for(const d of ['M29 53l-4 17','M34 50l-5 18','M39 47l-5 19','M64 48l9 17','M61 52l7 14','M45 48l3 13','M53 48l2 14','M42 82l5-12','M53 82l3-12'])a+=path(d,'none','#aa9061',1);
 return a+eye(62,24)+path('M46 69L44 78L38 79M59 69L60 78L66 79M42 77l4 4M60 77l-3 4','none','#ba9c56',1.6)+path('M24 83Q50 78 78 83','none','#7e8269',2);
},
basalto(){
 let a=path('M30 57Q16 54 10 64Q8 74 18 77Q9 79 6 71Q3 60 18 54L34 48','#666f5c')+
 path('M29 48Q43 37 67 45L76 50L71 60L55 65L34 62Z','#7d8367')+
 path('M64 46L75 37L86 39L93 45L91 50L79 52L69 57Z','#8d9071')+
 path('M37 57L31 67L21 68L17 73L27 72L38 68L44 59M61 59L65 70L78 74L83 71L72 68L69 57','#5f6e5b')+
 path('M40 46L37 39L31 38L30 41L35 43L35 48M61 44L64 37L71 35L73 38L68 40L68 46','#6f7b60');
 for(let y=47;y<61;y+=4)for(let x=35;x<65;x+=5)a+=ellipse(x+(y%2),y,1.2,.9,'#b1ac82');
 return a+eye(84,43)+path('M80 48L91 47M92 48l5 2-2 1m2-1 1-1','none','#514e3e',.8)+line('M22 70l-3 2M25 70l-1 3M77 71l4 2M74 70l3 3');
},
seda(){
 let a=path('M49 77Q21 67 19 78Q19 88 54 85Q84 86 83 75Q81 65 61 72L42 78Q35 75 43 67L60 57Q71 46 66 31Q63 21 54 21Q44 21 43 32Q38 43 48 52L54 61L45 66','#8b8051');
 a+=path('M49 55Q40 48 40 38Q41 27 49 25L57 25Q69 29 70 39Q71 49 60 57L58 66L50 69Z','#aaa16c')+
 path('M49 53L48 32Q50 24 56 27L60 34L59 56L55 64Z','#d4c590')+
 path('M47 28Q47 20 55 18Q63 19 63 26L60 32L51 32Z','#8d8859');
 for(const y of [36,41,46,51,56])a+=path(`M49 ${y}L59 ${y+1}`,'none','#8d885f',.8);
 return a+eye(50,25)+eye(60,25)+path('M53 30l3 0M55 31v6l-2 2m2-2 2 2','none','#554f3a',.7)+line('M27 79q10 5 25 2M59 78q15-6 18-1');
},
junco(){
 let a=path('M32 56Q17 58 8 76L17 74L40 67L62 67L76 62L93 62L95 57L82 50L67 48Q49 44 32 56Z','#788265')+
 path('M36 62L29 72L20 75L23 78L35 76L44 65M60 64L64 75L78 77L82 73L70 71L68 60','#5e6c54')+
 path('M74 55L81 54L95 58L93 62L75 63L66 60Z','#a5a67c');
 for(let i=0;i<8;i++)a+=path(`M${30+i*5} 55l2-4 3 3-2 3Z`,'#515f49','#515f49',.7);
 for(let i=0;i<7;i++)a+=line(`M${38+i*5} 60l2 3m-1-3 3-1`);
 return a+ellipse(78,53,3,2,'#899171')+eye(79,53)+line('M81 60l11 0M84 56l3 1M23 76l-1 2M28 75l1 3M75 74l2 3M15 70l5-1')+path('M87 59l1 2 1-2','none','#e2d9ac',.7);
},
ancora(){
 let a=path('M27 62L25 80L34 81L40 66M57 64L58 80L68 80L67 62','#777b60')+
 path('M20 62Q16 36 37 29Q61 21 73 43L74 63Q46 73 20 62Z','#6b7358')+
 path('M22 62Q43 68 73 61L72 67Q47 76 21 68Z','#a5a47b')+
 path('M66 59Q78 62 80 45L78 39Q80 33 86 35Q95 37 92 43L86 48Q88 68 73 73L67 72Z','#93967a')+
 path('M21 62L13 77L19 80L27 68','#737d60');
 for(const d of ['M35 33L31 45L34 58L47 63L58 54L57 39L46 30Z','M35 37L35 45L38 54L47 58L54 52L53 41L46 34Z','M22 48L31 45','M34 58L25 64','M57 39L66 37','M58 54L72 56','M47 63L47 69'])a+=path(d,'none','#b0ab7d',.9);
 return a+eye(87,39)+line('M86 44l5-2M27 77l7 1M59 77l8 0M15 76l4 2M81 54l4 1M79 60l5 1');
},
ascua(){
 return path('M50 61Q83 48 88 65Q95 87 61 85L40 80L33 68Z','#be7948')+
 path('M77 63Q93 66 84 78L74 81L71 73Z','#e8dfbe')+
 path('M33 39Q26 45 27 61L23 77L32 79L43 68L54 77L65 79L58 55L50 41Z','#bf7946')+
 path('M35 39L29 25L38 29L44 23L51 28L61 25L58 40L64 46L53 55L39 54L27 47Z','#cb8b51')+
 path('M31 29L37 33L36 39Z M53 32L59 28L56 39Z','#615043')+
 path('M30 45L41 47L46 44L52 46L61 43L56 51L46 56L35 51Z','#e8dfbe')+
 path('M38 53L46 57L54 52L50 67L44 74L35 66Z','#e6dab7')+
 path('M28 65L27 77L33 78L35 69M53 66L56 78L63 78L58 66','#514b3d')+
 eye(38,41)+eye(54,40)+path('M43 47L49 47L46 51Z','#393f36')+line('M35 48l-8 2M53 49l8 1M29 76l4 0M57 76l5 0');
},
remonte(){
 let a=path('M21 52L8 38L11 53L7 68L24 60Q39 72 60 64L75 59Q88 63 94 54L89 47L78 44Q65 35 46 41Q33 43 21 52Z','#9b9e7f')+
 path('M23 52Q43 40 64 45L79 49L90 52L86 57L73 57Q51 66 27 58Z','#c0b99a')+
 path('M38 42L44 29L54 36L59 40M48 62L58 77L64 65M64 45L69 37L73 43','#8a8c6b')+
 path('M68 58Q78 66 89 59L93 54L88 53L86 57L76 55Z','#a69b7b');
 for(const [x,y]of [[30,49],[36,46],[42,45],[48,44],[54,44],[61,45],[67,46],[34,51],[45,49],[57,48],[19,51],[16,46],[15,59]])a+=ellipse(x,y,1.1,.9,'#535e51');
 return a+eye(82,49)+path('M92 53L86 53M74 48Q70 53 74 58M40 54L34 63L46 57','none','#5f6c59',1)+path('M13 76Q30 72 40 75M68 30q9-4 17-1','none','#a6bfc0',1);
}
};
root.ATLAS_LEGENDARY_ART=Object.freeze({ids:Object.freeze(Object.keys(plates)),render(id){
 if(!plates[id])throw new Error('Unknown legendary plate: '+id);
 return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" data-legendary-id="${id}"><title>Individuo legendario: ${id}</title>${ellipse(50,86,34,3,'#c8c9ae')}${plates[id]()}</svg>`;
}});
})(globalThis);
