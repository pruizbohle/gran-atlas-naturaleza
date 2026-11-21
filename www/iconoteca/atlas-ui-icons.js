/* El Gran Atlas · Iconoteca 1842 · PROTOTIPO AISLADO.
 * Usar exclusivamente en la biblioteca. No modifica el juego ni su version.
 * Combina arte de objetos ya existente con 12 grabados vectoriales de interfaz.
 */
(function(root){
'use strict';
const ink='#604a35',paper='#f0dfb8',bone='#e5d3ab',gold='#b68a40',green='#738464',olive='#4f6758',leather='#886044',slate='#657f7b';
const p=(d,f=paper,s=ink,w=2)=>'<path d="'+d+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
const l=(d,c=ink,w=2)=>p(d,'none',c,w);
const r=(x,y,w,h,f,rad=3)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rad+'" fill="'+f+'" stroke="'+ink+'" stroke-width="2"/>';
const e=(x,y,rx,ry,f)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'" stroke="'+ink+'" stroke-width="2"/>';
const c=(x,y,rad,f)=>'<circle cx="'+x+'" cy="'+y+'" r="'+rad+'" fill="'+f+'" stroke="'+ink+'" stroke-width="1.7"/>';
const star=(cx,cy,n=7,a=3,b=6)=>{let q=[];for(let i=0;i<n*2;i++){let t=Math.PI*i/n-Math.PI/2,k=i%2?b:a;q.push((cx+Math.cos(t)*k).toFixed(1)+','+(cy+Math.sin(t)*k).toFixed(1));}return '<polygon points="'+q.join(' ')+'" fill="'+gold+'" stroke="'+ink+'" stroke-width="1.3"/>';};
const body={
campo:()=>p('M28 81Q38 53 61 20', 'none',olive,4)+p('M44 61Q13 61 18 37Q40 35 44 61Z',green)+p('M50 51Q42 22 63 17Q76 36 50 51Z','#9aa66e')+p('M60 37Q67 17 82 29Q83 45 60 37Z',green)+p('M29 70Q8 56 13 45Q31 48 29 70Z','#87945e')+c(65,48,17,'#d9e3d7')+c(65,48,11,'#d9e3d7')+l('M75 61L91 81',gold,8)+l('M80 65L90 77',leather,4)+l('M23 87Q36 56 61 27','#48644c',1.4),
investigacion:()=>r(18,80,67,8,leather,2)+p('M37 80L39 70 65 70 69 80Z',gold)+p('M52 23Q57 11 65 16L74 27 65 36Z',gold)+p('M36 54Q22 37 35 26L42 21Q45 18 49 22L53 29 48 36 42 35Q36 43 47 51Z',slate)+r(45,22,13,12,gold,2)+p('M60 35Q76 40 71 59Q66 70 54 70', 'none',ink,7)+r(24,60,35,7,gold,2)+p('M31 60Q36 55 46 55L49 60Z',paper)+c(49,47,4,gold)+l('M67 58L76 63',gold,4)+l('M22 84h62','#ead6ac',2),
sociedad:()=>star(50,50,12,39,43)+c(50,50,37,leather)+c(50,50,30,paper)+p('M22 48L50 26 78 48Z',gold)+r(28,49,44,23,paper,1)+[32,44,56,68].map(x=>r(x,49,5,22,bone,1)).join('')+r(24,72,52,5,gold,1)+l('M26 82Q50 93 74 82',green,2)+p('M35 81l-6-6m6 6-8-1m38 1 6-6m-6 6 8-1','none',green,2),
bestiario:()=>p('M21 39Q25 18 46 19L51 24 55 19Q79 17 83 42L76 69 59 79 41 79 24 69Z','#8a7256')+p('M28 37Q17 56 34 70L45 76 51 66Z','#a98b64')+p('M72 36Q87 54 68 71L57 76 50 66Z','#a98b64')+e(38,44,13,15,bone)+e(64,44,13,15,bone)+c(40,46,6,gold)+c(62,46,6,gold)+c(40,46,3,ink)+c(62,46,3,ink)+p('M46 60L51 69 56 60Z',gold)+l('M38 82l-10 5M59 83l11 4',ink,3)+l('M18 89Q49 83 82 89',leather,4),
campamento:()=>p('M11 78L49 22 88 78Z',paper)+p('M49 22L88 78H49Z','#c39b68')+p('M37 78L49 52 62 78Z',leather)+l('M49 14L49 85',leather,3)+l('M12 78L6 83m82-5 6 5',ink,2)+r(74,55,12,20,slate,2)+c(80,63,4,'#ffdda1')+l('M17 83Q49 95 84 84',green,2),
museo:()=>r(17,73,68,11,leather,2)+r(24,18,54,54,paper,2)+r(29,23,44,44,'#f1e2c4',1)+p('M31 57Q25 38 41 30Q58 23 66 43L56 56 42 60Z',bone)+e(45,41,8,9,leather)+l('M42 55L61 47m-8 6 3 5m0-9 6 5',ink,2)+r(20,12,62,8,gold,2)+l('M18 88h68',gold,2),
corona:()=>p('M12 39L26 49 36 23 50 47 64 22 74 49 89 37 82 78 18 78Z',gold)+p('M24 68L77 68 79 77 20 77Z','#e4b75c')+[27,50,73].map((x,i)=>c(x,61,5,i===1?'#6d8b88':'#a76450')).join('')+star(50,20,5,8,4)+l('M20 84h62',leather,3),
naturalistas:()=>e(50,85,31,9,'#d3c39f')+p('M30 83Q29 60 43 55L56 55Q73 64 70 83Z',leather)+c(49,45,15,bone)+p('M24 33Q47 38 74 33L81 40Q51 49 17 41Z',olive)+p('M29 35L34 20Q49 13 64 20L67 36Z',green)+l('M35 31h30',gold,4)+p('M26 80Q15 66 29 57L36 58', 'none',ink,5)+p('M72 60Q84 65 79 81','none',ink,5)+e(24,51,7,9,bone)+e(77,51,7,9,bone),
tomos:()=>[0,1,2].map((i)=>{let x=15+i*24;return r(x,25-(i%2)*7,22,56+(i%2)*7,[leather,olive,'#756453'][i],3)+l('M'+(x+5)+' 35v32m11-32v32',gold,1.5)+l('M'+(x+3)+' 71h16',paper,3);}).join('')+l('M10 85h80',ink,3),
expediciones:()=>p('M11 66Q49 85 89 63L79 80Q49 94 19 79Z',leather)+l('M51 12v56',ink,4)+p('M48 18L18 60 47 60Z',paper)+p('M55 18L81 62 55 62Z',bone)+l('M26 63h52',gold,3)+l('M19 91q12-8 26 0t26 0t18-1',slate,2.6),
excavacion:()=>p('M20 75L58 25L64 29L27 81Z',leather)+p('M36 29Q53 12 80 20L90 27Q59 24 51 41L42 45Z','#7b8580')+l('M51 40L60 24',ink,2)+p('M13 85l15-13 21 11 17-8 19 12-7 7-62 0Z','#b0a186')+l('M18 91h62',paper,2),
taller:()=>p('M29 17L43 29 35 38 80 79 73 86 28 44 20 51 11 39Z','#85918a')+l('M40 33L80 79',leather,7)+p('M58 14L67 18 44 60 37 57Z',slate)+l('M34 75L61 47',leather,5)+l('M26 85h47',gold,2),
misiones:()=>r(12,28,76,53,paper,2)+p('M12 29L50 59 88 29Z','#e4d0aa')+l('M13 80L39 57m49 23L61 57','#ab956f',2)+c(51,59,9,'#97523f')+star(51,59,6,4,7)+l('M25 22h48',gold,2)
};
const existing={atlas:'world_map',cuaderno:'study:ornithology',inventario:'sturdy_pack',conocimiento:'parchment_scrap',libras:'ancient_coin',prestigio:'museum_medallion',huellas:'animal_trace',exploracion:'field_telescope',fosiles:'carnivore_skull',coleccionables:'pressed_flower',brujula:'brass_compass'};
const entries=[
['atlas','Atlas','Navegación','🗺️'],['campo','Campo','Navegación','🌿'],['cuaderno','Cuaderno','Navegación','📖'],['investigacion','Investigación','Navegación','🔬'],['sociedad','Sociedad','Navegación','🏛️'],['bestiario','Bestiario','Navegación','🦉'],['campamento','Campamento','Navegación','⛺'],['inventario','Inventario','Navegación','🎒'],['museo','Museo','Navegación','🏛️'],['corona','Corona','Navegación','👑'],
['conocimiento','Conocimiento','Indicadores','📜'],['libras','Libras','Indicadores','🪙'],['prestigio','Prestigio','Indicadores','🏅'],['naturalistas','Equipo','Indicadores','👨‍🔬'],['tomos','Tomos','Indicadores','📚'],['huellas','Huellas','Indicadores','🐾'],
['exploracion','Exploración','Acciones','🔭'],['expediciones','Expediciones','Acciones','⛵'],['fosiles','Fósiles','Museo y gabinete','🦴'],['excavacion','Excavación','Museo y gabinete','⛏️'],['coleccionables','Coleccionables','Museo y gabinete','🗿'],['taller','Taller','Museo y gabinete','🛠️'],['misiones','Encargos','Acciones','📋'],['brujula','Orientación','Acciones','🧭']].map(a=>({id:a[0],name:a[1],group:a[2],emoji:a[3],asset:existing[a[0]]||null,source:existing[a[0]]?'AtlasItemArt':'AtlasUiIcons',status:'candidato'}));
function render(id){
  if(Object.hasOwn(existing,id)){
    return root.AtlasItemArt?.renderItemArt(existing[id])||'';
  }
  if(!Object.hasOwn(body,id))return '';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" data-atlas-ui-icon="'+id+'" role="img" aria-label="'+id+'"><g>'+body[id]()+'</g></svg>';
}
root.AtlasUiIcons=Object.freeze({entries:Object.freeze(entries),render,existing:Object.freeze(existing)});
if(typeof module==='object'&&module.exports)module.exports=root.AtlasUiIcons;
})(typeof globalThis!=='undefined'?globalThis:this);
