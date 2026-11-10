/* Original specimen reconstructions, Liparidae; no invented light organs or biological variants. */
(function(root){'use strict';const cache=new Map;
function render(s){if(s?.origin!=='abyssal3340')return null;if(cache.has(s.latin))return cache.get(s.latin);const mariana=s.artProfile==='mariana_snailfish';if(!mariana&&s.artProfile!=='kermadec_snailfish')throw Error('Unknown abyssal plate');const ink='#5c6471',skin=mariana?'#d4bfbd':'#bfc2c7',fin=mariana?'#dcd0cc':'#d2d5d6';
const path=(d,fill=skin,w=1.1)=>`<path d="${d}" fill="${fill}" stroke="${ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`,line=(d,w=.7)=>path(d,'none',w);
// Soft unscaled trunk, continuous low median fins and an unforked tapering tail.
let b=path(mariana?'M27 39Q42 27 58 39Q74 47 92 44Q99 48 94 57Q76 57 58 65Q39 76 25 64Z':'M24 42Q43 30 59 40Q76 46 93 43Q99 46 96 54Q79 58 63 66Q46 73 28 63Z',fin)+path(mariana?'M9 47Q11 35 23 37Q32 35 43 41Q57 48 77 50L94 48Q98 50 94 52Q74 53 58 60Q37 70 21 62Q8 60 9 47Z':'M8 48Q9 39 23 40Q33 37 45 43Q61 50 79 50L95 47Q98 49 95 52Q77 55 59 61Q39 68 20 61Q7 59 8 48Z');
b+=path(mariana?'M28 46Q43 41 49 50L40 56Q44 61 37 65L29 58Z':'M28 47Q40 43 44 52Q42 59 31 59L28 54Z',fin)+line(mariana?'M30 48L44 49M31 50L41 54M31 53L37 61':'M30 49L40 50M30 51L41 53M30 54L38 56');
b+=`<ellipse cx="29" cy="${mariana?67:64}" rx="4.1" ry="1.7" fill="${fin}" stroke="${ink}" stroke-width=".8"/><ellipse cx="29" cy="${mariana?67:64}" rx="2.1" ry=".6" fill="none" stroke="${ink}" stroke-width=".5"/><circle cx="18" cy="46" r="1.2" fill="#555d68"/>`+line('M9 54Q14 56 20 54M25 43Q28 46 26 50');
for(let i=0;i<11;i++){const x=38+i*4.6,y=mariana?36+(i<4?i*.8:(i-3)*1.3):37+i*.9;b+=line(`M${x} ${y}l-1 5`,.45);}
for(let i=0;i<8;i++){const x=46+i*5,y=mariana?66-(i*1.2):66-(i*1.3);b+=line(`M${x} ${y}l1-4`,.45);}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${s.name}" data-abyssal-profile="${s.artProfile}" data-zoological-family="Liparidae" data-light-organs="none" data-pectoral="${mariana?'notched-lower-lobe':'unnotched-short'}">${b}</svg>`;cache.set(s.latin,svg);return svg;}
const api={render};root.AtlasAbyssalArt3340=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
