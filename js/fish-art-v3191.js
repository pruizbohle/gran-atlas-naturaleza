/* El Gran Atlas v3.19.9 — ictiofauna de producción.
 * Rutas anatómicas originales: aletas con inserción continua, bocas y colas propias.
 * El catálogo y las probabilidades permanecen fuera de este módulo.
 */
(function(root){
'use strict';
const normal=s=>String(s||'').toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const profiles={
 'acipenser baerii':{family:'esturion-siberiano',body:'M19 55Q37 43 65 46Q79 47 93 55L80 59Q56 69 20 62Z',tail:'M24 55Q14 47 7 30Q12 51 13 58L6 73Q15 71 25 61Z',dorsal:'M30 50Q35 38 42 34L48 47Z',ventral:'M41 63Q42 76 48 78L53 64Z',color:'#758b82',fin:'#62776d'},
 'salmo trutta':{family:'trucha-comun',body:'M22 52Q39 39 63 42Q81 43 91 51L92 57Q75 68 52 66Q32 65 22 60Z',tail:'M26 51Q15 46 7 42L11 55 8 69Q18 65 27 61Z',dorsal:'M41 44Q43 32 54 29L62 43Z',ventral:'M43 64Q43 74 51 77L56 65Z',color:'#8d9473',fin:'#a38665'},
 'barbus barbus':{family:'barbo',body:'M21 54Q43 40 66 44Q82 46 92 54L90 60Q67 70 43 65L22 61Z',tail:'M24 53Q14 45 6 38Q8 53 14 57L6 75Q16 70 25 61Z',dorsal:'M42 45Q45 32 51 26L60 44Z',ventral:'M44 64Q42 74 49 78L56 66Z',color:'#9f9b72',fin:'#a18458'},
 'tinca tinca':{family:'tenca',body:'M21 52Q29 37 52 37Q78 37 89 51L90 59Q81 74 56 73Q30 72 21 61Z',tail:'M25 51Q16 43 9 45Q6 56 10 69Q17 68 25 62Z',dorsal:'M43 39Q48 25 57 31Q62 34 64 39Z',ventral:'M43 70Q40 81 50 83Q58 81 60 71Z',color:'#768258',fin:'#827648'},
 'perca fluviatilis':{family:'perca',body:'M24 51Q36 36 57 39Q78 40 91 51L91 58Q77 73 53 72Q36 70 24 60Z',tail:'M27 51Q18 43 8 40L12 55 7 73Q19 70 28 62Z',dorsal:'M31 45L34 27 39 32 43 23 48 31 52 25 58 40Q65 29 72 39L77 44Z',ventral:'M46 69Q44 79 49 82L61 71Z',color:'#8d9d69',fin:'#be835c'},
 'oncorhynchus gorbuscha':{family:'salmon-rosado',body:'M22 54Q34 42 44 32Q54 26 66 40Q81 44 91 52L93 59Q76 69 53 67Q35 66 22 61Z',tail:'M25 53Q15 44 7 39L12 55 6 74Q17 68 26 62Z',dorsal:'M39 36Q42 25 48 24L56 34Z',ventral:'M44 65Q44 74 52 78L58 67Z',color:'#a08c85',fin:'#7b7770'},
 'oncorhynchus nerka':{family:'salmon-rojo',body:'M21 52Q40 37 65 42Q82 43 91 53L92 58Q76 70 52 68Q35 66 21 60Z',tail:'M25 51Q15 46 7 37L12 55 7 75Q19 67 26 62Z',dorsal:'M43 42Q45 30 53 27L62 42Z',ventral:'M43 65Q43 76 52 79L58 66Z',color:'#a96257',fin:'#8b6b59'},
 'cyprinus carpio':{family:'carpa',body:'M22 53Q29 31 55 31Q79 31 89 49L91 58Q81 78 56 77Q30 75 22 63Z',tail:'M26 51Q15 46 6 35L12 55 7 78Q20 70 27 63Z',dorsal:'M32 38Q39 23 49 25Q60 26 70 35L73 40Z',ventral:'M45 73Q43 84 51 86L62 75Z',color:'#a29b68',fin:'#99825a'},
 'channa argus':{family:'cabeza-serpiente',body:'M17 50Q45 37 75 42Q87 42 94 49L94 58Q84 69 62 68Q37 67 17 61Z',tail:'M21 50Q12 44 8 48Q3 58 9 68Q15 69 22 62Z',dorsal:'M25 47Q39 31 52 34Q68 34 79 42L78 46Z',ventral:'M27 63Q41 78 66 72L76 65Z',color:'#7b8467',fin:'#686f56'},
 'siniperca chuatsi':{family:'mandarin-chino',body:'M22 51Q34 34 56 37Q78 36 91 48L94 57Q81 76 56 75Q34 72 22 61Z',tail:'M26 51Q16 43 8 44Q5 57 9 72Q20 70 27 62Z',dorsal:'M31 43L34 26 39 32 43 23 48 31 53 26 58 37Q68 27 74 37L80 45Z',ventral:'M44 70Q43 82 52 85L65 73Z',color:'#b0a17a',fin:'#8b8d65'},
 'carcharodon carcharias':{family:'tiburon-blanco',body:'M18 54Q38 41 61 43Q80 43 94 53L91 60Q75 73 47 69Q29 66 19 62Z',tail:'M23 53Q11 45 7 24Q8 46 12 57L5 79Q15 77 25 63Z',dorsal:'M39 46Q42 27 51 17Q53 36 63 45Z',ventral:'M50 66Q47 80 37 86Q59 81 67 67Z',color:'#82938f',fin:'#657e7d'},
 'mobula birostris':{family:'manta',color:'#556f73',fin:'#455e65'},
 'carcharhinus melanopterus':{family:'tiburon-arrecife',body:'M19 54Q42 45 66 48Q81 48 94 55L92 60Q72 70 49 66L19 62Z',tail:'M24 54Q13 43 8 26L12 56 5 79Q18 72 26 63Z',dorsal:'M43 49Q45 33 52 23Q54 41 62 49Z',ventral:'M52 65Q50 76 42 81Q57 77 67 66Z',color:'#899b90',fin:'#6c8581'},
 'oreochromis niloticus':{family:'tilapia',body:'M22 52Q35 30 60 34Q79 36 90 51L91 59Q78 79 54 77Q32 74 22 62Z',tail:'M27 51Q15 39 8 44Q5 58 10 74Q20 70 28 63Z',dorsal:'M29 44L32 30 37 34 41 25 47 30 52 24 58 29 63 26Q75 28 79 42Z',ventral:'M42 72Q44 85 57 85Q67 81 70 72Z',color:'#8e9781',fin:'#899381'},
 'hydrocynus goliath':{family:'tigre-goliat',body:'M20 53Q39 37 63 39Q79 39 92 50L95 58Q79 73 55 70Q33 67 20 62Z',tail:'M25 52Q13 44 5 32L12 56 6 79Q19 71 26 63Z',dorsal:'M42 42Q45 29 54 24L63 42Z',ventral:'M45 67Q45 79 53 81L61 69Z',color:'#a4ad9e',fin:'#ac8b68'},
 'pantodon buchholzi':{family:'pez-mariposa-africano',body:'M21 49Q42 39 66 44L89 50 93 57Q76 69 53 68Q35 65 21 59Z',tail:'M26 48Q15 40 9 44L8 55 6 71Q20 69 28 61Z',dorsal:'M34 44Q33 35 40 33L49 43Z',ventral:'M34 62Q22 76 34 85Q50 82 61 66Z',color:'#a79676',fin:'#aa9270'},
 'hydrocynus vittatus':{family:'tigre-africano',body:'M20 53Q40 41 65 44Q81 44 93 53L94 59Q77 71 54 67Q33 65 20 61Z',tail:'M24 52Q14 44 6 34L12 56 7 77Q18 68 25 62Z',dorsal:'M42 44Q45 33 53 28L62 44Z',ventral:'M45 65Q45 76 54 79L62 67Z',color:'#a0ac99',fin:'#b08e67'},
 'oncorhynchus mykiss':{family:'trucha-arcoiris',body:'M21 53Q40 40 63 43Q81 44 91 52L92 58Q78 69 54 66Q35 65 21 61Z',tail:'M25 52Q14 47 7 40L12 55 7 71Q17 66 26 62Z',dorsal:'M43 44Q44 32 53 29L62 44Z',ventral:'M44 64Q43 75 51 78L59 66Z',color:'#859c87',fin:'#8c9184'}
};
const aliases={'tiburon blanco':'carcharodon carcharias','tiburon de puntas negras':'carcharhinus melanopterus','carpa comun':'cyprinus carpio','tenca':'tinca tinca','perca europea':'perca fluviatilis','pez mandarin chino':'siniperca chuatsi','pez mariposa africano':'pantodon buchholzi','esturion siberiano':'acipenser baerii','trucha comun':'salmo trutta','manta gigante':'mobula birostris'};
function scientificKey(sp){if(!sp)return null;const latin=normal(sp.latin).trim();if(latin)return Object.hasOwn(profiles,latin)?latin:null;return aliases[normal(sp.name).trim()]||null;}
function classifyFish(sp){const key=scientificKey(sp);return key?profiles[key].family:null;}
function shift(hex,amount){return '#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(hex.slice(i,i+2),16)+amount)).toString(16).padStart(2,'0')).join('');}
function renderFish(sp,color,skin='normal'){
 const key=scientificKey(sp);if(!key)return null;const q=profiles[key];
 const pigment=hex=>{const v=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),lum=(v[0]*.2126+v[1]*.7152+v[2]*.0722)/255;return skin==='albino'?'#'+[218+lum*30,211+lum*31,203+lum*35].map(x=>Math.round(x).toString(16).padStart(2,'0')).join(''):skin==='melanico'?'#'+[18+lum*30,26+lum*31,31+lum*33].map(x=>Math.round(x).toString(16).padStart(2,'0')).join(''):hex;};
 const ink=pigment('#3b4b48'),base=pigment(q.color),fin=pigment(q.fin),shade=pigment(shift(q.color,-28)),light=pigment(shift(q.color,24)),belly=pigment('#d9dbbf'),pattern=pigment('#596956'),eye=skin==='albino'?'#ad858d':skin==='melanico'?'#c3ac71':'#27332f';
 const p=(d,fill=base,w=2.4,stroke=ink)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const line=(d,stroke=shade,w=1.25)=>p(d,'none',w,stroke);
 const dot=(x,y,r,fill=pattern)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 const eyes=(x,y,r=1.7)=>`<g data-fish-eye="true">${dot(x,y,r,eye)}${dot(x+.4,y-.4,.45,'#f6f1dc')}</g>`;
 const wrap=parts=>`<svg viewBox="0 0 100 100" aria-hidden="true" data-fish-family="${q.family}" data-fish-version="3.19.9">${parts}</svg>`;
 if(q.family==='manta')return wrap(
  p('M42 40Q34 42 24 32Q15 25 7 20Q8 46 27 62Q38 73 49 69Q61 74 74 60Q90 44 94 20Q82 26 72 34Q61 43 57 40L56 31Q51 28 47 31L45 41Z')+
  p('M47 67Q50 82 46 94Q53 87 52 68Z',fin,1.6)+
  p('M42 39Q38 31 40 26Q45 25 47 32L46 40M55 39Q60 31 58 26Q53 25 52 32L53 40',fin,1.8)+
  p('M35 48Q50 40 66 49Q64 64 51 66Q36 63 35 48Z',light,0,'none')+
  line('M17 33Q24 48 37 55M83 33Q76 48 64 55',shade,1.8)+
  eyes(42,41,1.5)+eyes(59,41,1.5)+line('M45 46q5 2 11 0',ink,1.2));
 const shark=q.family.startsWith('tiburon'),sturgeon=q.family.startsWith('esturion'),salmon=/salmon|trucha/.test(q.family),carp=q.family==='carpa'||q.family==='barbo'||q.family==='tenca',perch=q.family==='perca'||q.family==='mandarin-chino'||q.family==='tilapia';
 let svg=p(q.tail,fin)+p(q.dorsal,fin)+p(q.ventral,fin);
 if(shark){
  svg+=p('M28 63Q26 70 19 73Q31 73 37 66Z',fin)+p('M28 49Q30 43 35 43L39 48Z',fin);
 }else{
  svg+=p(q.family==='cabeza-serpiente'?'M32 64Q39 73 59 74L67 67Z':'M30 62Q29 71 35 75L42 65Z',fin);
  if(salmon||q.family.startsWith('tigre-'))svg+=p('M29 48Q29 40 34 40L38 45Z',fin,1.8);
 }
 svg+=p(q.body);
 // The belly follows the body contour rather than floating over it.
 svg+=p(sturgeon?'M23 59Q51 65 82 55Q65 69 24 62Z':shark?'M25 60Q59 64 92 55Q77 72 48 67Q32 64 25 60Z':q.family==='carpa'?'M29 62Q56 72 86 54Q79 77 54 74Q39 73 29 62Z':'M28 59Q58 66 87 53Q79 69 54 65Q38 63 28 59Z',belly,0,'none');
 // Pattern fields are inside the body; each taxon has its own markings.
 if(q.family==='carpa'){
  for(let row=0;row<4;row++)for(let col=0;col<5;col++){const x=32+col*8+(row%2)*3,y=43+row*7;if(row===3&&col===0)continue;svg+=line(`M${x} ${y}q4 5 8 0`,pattern,1.1);}
 }else if(q.family==='tenca')svg+=line('M33 48Q54 40 71 46',light,2)+line('M38 61Q53 65 68 61',shade,1.1);
 else if(q.family==='perca')for(let i=0;i<5;i++)svg+=p(`M${36+i*8} ${43+(i%2)*2}q4 4 1 ${21-(i%2)*3}l-4-5Z`,pattern,0,'none');
 else if(q.family==='mandarin-chino'){
  for(const [x,y,r]of [[33,52,3],[43,45,3],[51,53,4],[61,47,2.7],[66,60,4],[38,63,2],[53,67,2.4],[73,51,3.2]])svg+=p(`M${x-r} ${y}q${r} ${-r*2} ${r*2} -1l-1 ${r*2}q${-r} 1 ${-r*2} -1Z`,pattern,0,'none');
 }else if(q.family==='tilapia'){
  for(let i=0;i<6;i++)svg+=line(`M${34+i*7} ${43+i%2*2}q3 12 0 25`,shade,1.6);
  svg+=line('M12 48q3 8 0 18m5-17q3 8 0 15',shade,1.1);
 }else if(q.family==='cabeza-serpiente'){
  for(let i=0;i<7;i++)svg+=p(`M${27+i*8} ${48+i%2*4}l5-3 4 7-5 5-4-3Z`,pattern,0,'none');
  svg+=line('M31 38l-2 8m10-10-1 9m10-10v9m10-8 1 8m8-6 2 5',shade,1);
 }else if(q.family==='pez-mariposa-africano'){
  svg+=p('M63 52Q49 24 24 23Q23 38 36 50Q49 59 63 57Z',fin)+p('M62 55Q45 64 32 80Q53 82 70 63Z',light);
  svg+=line('M62 54L31 29m29 26L29 38m28 18-22-9m26 12L39 76m24-15L50 77',shade,1.25)+line('M41 66l-3 22m7-20 3 21',shade,1.2);
 }else if(q.family==='tigre-africano'){
  for(let i=0;i<4;i++)svg+=line(`M${29+i*2} ${51+i*4}Q50 ${43+i*6} 72 ${49+i*4}`,shade,1.4);
 }else if(salmon||q.family==='tigre-goliat'){
  if(q.family==='trucha-arcoiris')svg+=p('M28 56Q50 50 75 51L77 57Q50 60 28 59Z',pigment('#be8b83'),0,'none');
  if(q.family==='salmon-rojo')svg+=p('M75 45Q85 47 91 53L91 57 78 60Z',pigment('#7b8a66'),0,'none');
  const spots=q.family==='salmon-rojo'?[]:q.family==='salmon-rosado'?[[31,51,2],[42,43,2.1],[51,38,2],[61,47,2],[69,50,1.8],[50,57,1.8],[35,59,1.3]]:q.family==='tigre-goliat'?[[40,50,.8],[50,47,.8],[59,49,.8]]:[[32,51,1.1],[40,47,1.1],[49,45,1.4],[58,47,1.2],[66,50,1.3],[43,57,1.1],[55,55,1.1],[64,59,1],[74,51,.9]];
  for(const [x,y,r]of spots)svg+=dot(x,y,r,q.family==='trucha-comun'&&x%2===0?pigment('#985f4f'):pattern);
 }
 if(sturgeon){
  for(let i=0;i<7;i++){const x=28+i*7;svg+=p(`M${x} ${50-i%2}l3-5 4 4-3 4Z`,light,1.1);}
  svg+=line('M32 60l4-2m5 3 4-2m5 2 4-2m5 2 4-2m5 1 4-2',light,2.2)+line('M79 59l-1 7m-4-6-1 6',ink,1.15)+line('M83 57q2 3 4 0',ink,1.2);
 }else if(shark){
  for(let i=0;i<5;i++)svg+=line(`M${70-i*2.8} 51q-2 4 0 9`,ink,1.15);
  svg+=line('M83 61q5 0 8-4',ink,1.3);
  if(q.family==='tiburon-arrecife')svg+=p('M49 28L52 23Q53 31 55 34Z',pigment('#3e4d48'),0,'none')+p('M44 77l-2 4 8-4Z',pigment('#3e4d48'),0,'none');
 }else{
  const y=q.family==='carpa'?52:53;
  svg+=line(`M77 ${y-9}Q70 ${y} 77 ${y+11}`,shade,1.5);
  // Pectoral fin rooted immediately behind the operculum, tapering backward.
  if(q.family!=='pez-mariposa-africano')svg+=p(q.family==='cabeza-serpiente'?'M74 55Q60 56 62 66Q72 65 77 59Z':'M73 56Q63 57 59 66Q69 68 77 59Z',fin,1.4)+line('M73 58l-9 6',shade,1);
  svg+=line(q.family==='carpa'?'M85 57q4 1 6-2':q.family==='tigre-goliat'?'M82 56l11-1':q.family==='cabeza-serpiente'?'M82 57l12-2':'M84 57q5 0 7-2',ink,1.3);
  if(carp)svg+=line(q.family==='barbo'?'M88 59q5 3 7 8m-9-7q-2 5 1 8':'M87 59q7 3 7 7',shade,1.1);
  if(q.family.startsWith('tigre-'))svg+=line('M83 57l1 4 2-4 2 3 2-4',ink,1.1);
 }
 svg+=eyes(sturgeon?82:q.family==='carpa'?81:84,sturgeon?52:q.family==='carpa'?48:50,shark?1.45:1.7);
 // A few continuous rays communicate fin surfaces without dense textures.
 if(!shark&&q.family!=='pez-mariposa-africano')svg+=line(sturgeon?'M35 47l5-8m1 7 2-6':q.family==='tenca'?'M49 37l3-5m4 5 1-4':q.family==='cabeza-serpiente'?'M35 45l3-8m7 7 1-8m9 7v-6m9 6v-3':'M47 42l3-8m5 8 1-8',shade,1.1);
 if(salmon||carp||q.family.startsWith('tigre-'))svg+=line('M19 55L10 45m9 13-9 9',shade,1.15);
 return wrap(svg);
}
renderFish.classify=classifyFish;
root.ATLAS_FISH_ART_V3191=renderFish;
if(typeof module==='object'&&module.exports)module.exports={renderFish,classifyFish};
})(typeof globalThis!=='undefined'?globalThis:this);
