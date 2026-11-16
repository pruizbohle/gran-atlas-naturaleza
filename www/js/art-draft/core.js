/* ART-COL-01: original local vector drawings. No game state, storage or economy. */
(function(root){'use strict';
const C={ink:'#604a35',bone:'#e5d3ab',gold:'#b68a40',paper:'#f0dfb8',wood:'#936848',green:'#647b54',blue:'#608d9b',copper:'#b7764e',ivory:'#eee4cd',stone:'#a89779'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=(d,f=C.bone,w=2)=>`<path d="${esc(d)}" fill="${esc(f)}" stroke="${C.ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const l=(d,c=C.ink,w=1.8)=>`<path d="${esc(d)}" fill="none" stroke="${esc(c)}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const e=(x,y,rx,ry,f=C.bone,w=2)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${esc(f)}" stroke="${C.ink}" stroke-width="${w}"/>`;
const r=(x,y,w,h,f=C.paper,rad=2)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${esc(f)}" stroke="${C.ink}" stroke-width="2"/>`;
const g=(t,s)=>`<g transform="${esc(t)}">${s}</g>`;
const dots=(a,c=C.ink)=>a.map(([x,y,z=1.5])=>e(x,y,z,z,c,0)).join('');
const text=(s,x,y,size=8,color=C.ink)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" fill="${color}">${esc(s)}</text>`;
const leaf=(x,y,size=16,angle=0,color=C.green)=>g(`translate(${x} ${y}) rotate(${angle}) scale(${size/20})`,p('M0 0Q-19-8 0-30Q18-13 0 0Z',color)+l('M0 0V-25','#435b40',1.2));
const rosette=(x,y,n,rad,petal,color,turn=0)=>Array.from({length:n},(_,i)=>g(`translate(${x} ${y}) rotate(${turn+i*360/n})`,e(0,-rad,petal,rad,color,1.5))).join('');
const star=(x,y,n,a,b,color,turn=-90)=>p(Array.from({length:n*2},(_,i)=>{const t=(turn+i*180/n)*Math.PI/180,z=i%2?b:a;return(i?'L':'M')+(x+Math.cos(t)*z).toFixed(2)+' '+(y+Math.sin(t)*z).toFixed(2)}).join('')+'Z',color,1.5);
const spiral=(x,y,rad,turns=2.5,color=C.ink,width=1.8)=>l(Array.from({length:70},(_,i)=>{const t=i/69*turns*6.283,z=rad*(1-i/75);return(i?'L':'M')+(x+Math.cos(t)*z).toFixed(2)+' '+(y+Math.sin(t)*z).toFixed(2)}).join(''),color,width);
const slab=(d='M14 25L66 13 88 42 79 81 29 89 10 63Z',f=C.stone)=>p(d,f);
const bottle=(body=C.blue,wide=false)=>p(wide?'M42 12H58V30Q79 38 81 56V84Q50 93 19 84V56Q21 38 42 30Z':'M42 12H58V31Q69 41 69 52V84Q50 92 31 84V52Q31 41 42 31Z',body)+r(41,9,18,8,C.wood,1)+l('M38 48V77','#d9e7d5',3);
const coin=(f=C.gold,oval=false)=>e(50,52,oval?26:34,35,f)+e(50,52,oval?21:29,30,'none',1.3)+dots(Array.from({length:24},(_,i)=>{let a=i*Math.PI/12;return[50+Math.cos(a)*(oval?23.5:31.5),52+Math.sin(a)*32,0.8]}),C.ink);
const registry=Object.create(null),families=Object.create(null);
function add(prefix,drawings,family){drawings.forEach((draw,i)=>{const id=prefix+'-'+String(i+1).padStart(2,'0');if(registry[id])throw Error('Duplicate '+id);registry[id]=typeof draw==='function'?draw:()=>draw;families[id]=family;});}
const api={C,esc,p,l,e,r,g,dots,text,leaf,rosette,star,spiral,slab,bottle,coin,add,registry,families};root.AtlasCollectiblesDrawing=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
