(function(root){'use strict';
function render(sp){
 if(sp?.origin!=='polar3310')return null;
 const p=sp.artProfile,ink='#25383e',white='#edf4ef',grey='#859a9f',dark='#40565e';let body='';
 const path=(d,fill=grey,extra='')=>`<path d="${d}" fill="${fill}" stroke="${ink}" stroke-width="1.7" stroke-linejoin="round" ${extra}/>`;
 const eye=(x,y,r=1.2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#101c20"/>`;
 if(p==='polar_bear')body=path('M15 55Q12 32 38 33L65 39Q70 28 80 36L92 44 92 52 78 55 69 53 65 78 56 78 54 59 36 59 31 78 21 78 23 56Z',white)+path('M74 35Q69 26 75 26Q82 26 81 35',white)+eye(83,43)+path('M89 45L94 47 91 50Z',ink);
 else if(['emperor','adelie'].includes(p))body=path('M33 77Q24 59 35 34Q34 16 48 15Q63 16 62 34Q75 61 64 77Z',ink)+path('M41 36Q58 31 61 55L60 75 38 75Q30 55 41 36',white)+path('M35 40L23 62 28 68 40 47',ink)+path('M60 40L75 65 69 68 57 48',ink)+path('M42 77L31 84 48 83 50 77M56 77L52 84 70 83 64 77','#bc8b54')+path('M59 25L75 29 61 32',p==='emperor'?'#d6ad62':ink)+eye(56,24)+(p==='emperor'?path('M60 33Q54 35 56 44L49 43 49 35Z','#e7ba61'):`<circle cx="56" cy="24" r="2.6" fill="none" stroke="${white}" stroke-width="1"/>`);
 else if(['beluga','narwhal','bowhead'].includes(p))body=path(p==='bowhead'?'M13 55Q18 23 51 31Q77 31 85 51L95 41 92 56 96 65 84 60Q56 82 18 64Z':'M12 54Q13 33 29 37Q48 28 72 47L83 56 95 45 91 58 97 64 82 65Q52 80 18 65Z',p==='beluga'?white:p==='narwhal'?'#b5c3be':dark)+path('M46 62L56 82 65 78 59 61',p==='beluga'?white:grey)+path('M17 56Q34 67 52 59','none')+eye(24,49)+(p==='narwhal'?path('M16 53L1 47 16 55',white):p==='bowhead'?path('M18 61Q35 73 49 64',white):'');
 else if(p==='walrus'||p.includes('seal')||p==='seal'){
 const elephant=p==='elephant_seal',leopard=p==='leopard_seal';body=path(leopard?'M12 56Q19 34 35 45Q54 38 79 61L96 54 89 68 97 72 80 73Q43 84 18 66Z':'M12 56Q15 36 31 42Q48 37 77 61L94 54 88 66 95 72 78 73Q47 83 19 67Z',p==='walrus'?'#a68b73':p==='seal'?'#a8b5ad':grey)+path('M39 65L53 82 62 78 52 64',grey)+eye(23,49)+(elephant?path('M15 47Q5 42 7 57L13 61 16 53',grey):path('M12 56L21 57','none'));
 if(p==='walrus')body+=path('M15 58L17 78 21 61M25 59L28 76 30 59',white);
 if(p==='bearded_seal'||p==='walrus')body+=path('M16 58L4 61M18 60L8 67M24 59L32 65M24 57L35 59','none');
 if(p==='ringed_seal')body+=[42,52,64,73].map((x,i)=>`<circle cx="${x}" cy="${52+i%2*8}" r="3" stroke="#dce4d9" stroke-width="1.3" fill="none"/>`).join('');
 if(leopard)body+=[35,44,54,64,72].map((x,i)=>eye(x,55+i%2*7,1.6)).join('');
 }
 else if(p==='squid')body=path('M26 45Q43 10 69 42L84 50 65 61Q39 77 26 56Z','#b59185')+path('M47 32L64 27 69 42M49 65L65 71 68 59','#c6aba0')+path('M28 48Q5 26 8 43M27 50Q1 43 5 54M27 53Q-1 59 7 64M28 55Q7 85 17 78M30 57Q15 78 25 76M29 49Q5 1 3 24M28 56Q2 94 5 81','none')+eye(33,52,2);
 else if(p==='shark')body=path('M9 54Q29 39 68 48L89 27 85 51 96 64 81 62 73 59Q47 73 16 65Z','#758a85')+path('M44 46L50 32 55 47M46 65L58 77 60 63',grey)+eye(21,53)+path('M28 51L30 60M32 50L34 61M36 50L38 61M11 62L23 63','none');
 else {
 const duck=p==='eider',tern=p==='tern',snow=['petrel','gull'].includes(p);body=path(duck?'M17 58Q23 42 46 49Q53 47 54 36Q59 24 69 32Q80 37 69 46L65 60Q45 79 19 67Z':'M20 60Q31 44 54 50L62 39Q70 34 75 42L72 49 87 51 72 56Q56 75 28 68L10 74Z',snow?white:duck?'#9da997':'#79867e')+path(tern?'M37 52L4 23 40 42 63 17 58 50 71 72 47 64Z':duck?'M29 57Q43 46 53 58L42 67Z':'M30 55L9 32 44 43 69 26 56 56 72 68 47 65Z',p==='skua'?'#615f53':snow?white:dark)+eye(duck?68:70,duck?35:43)+path(duck?'M73 36L86 42 73 43Z':'M75 45L88 49 74 50Z',tern?'#be6b54':'#798b6c');
 }
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${sp.name}" data-polar-profile="${p}">${body}</svg>`;
}
const api={render};root.AtlasPolarArt3310=api;if(typeof module!=='undefined')module.exports=api;
})(globalThis);
