/* El Gran Atlas 3.19.1 — lámina de ictiofauna.
 * Solo dibujo: no altera especies, inventario, avistamientos ni persistencia.
 * Siluetas por grupo y variación de patrones por nombre científico/común.
 */
(function(){
"use strict";
function esc(v){return String(v||"").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function shift(hex,delta){
 const h=/^#[0-9a-f]{6}$/i.test(hex||"")?hex:"#60899b";
 return "#"+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(h.slice(i,i+2),16)+delta)).toString(16).padStart(2,"0")).join("");
}
function wrap(family,parts,skin){
 const glow=skin==="alfa"?'<circle cx="50" cy="50" r="43" fill="#f4d678" opacity=".24"/>':"";
 return '<svg viewBox="0 0 100 100" aria-hidden="true" data-fish-family="'+family+'">'+glow+parts+'</svg>';
}
function art(sp,color,skin){
 if(!sp || (sp.kind!=="fish" && sp.kind!=="ray"))return null;
 const name=esc(sp.name),latin=esc(sp.latin),ink="#34424a",base=color||"#668d94",
 dark=shift(base,-34),pale=shift(base,29),belly=skin==="melanico"?"#6a7479":skin==="albino"?"#f2eeeb":"#d5ded5",
 eye=skin==="albino"?"#c85f6c":skin==="melanico"?"#d8c46b":"#18272d";
 const p=(d,fill=base,stroke=ink,w=2.6)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>';
 const line=(d,stroke=dark,w=1.8)=>'<path d="'+d+'" fill="none" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linecap="round"/>';
 const dot=(x,y,r,fill)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"/>';
 const eyeMark=(x=77,y=51)=>dot(x,y,2.2,eye)+dot(x+.55,y-.6,.6,"#ffffff");
 const gills=(x=69,y=54,n=3)=>Array.from({length:n},(_,i)=>line('M'+(x-i*3)+' '+(y-5)+'q-2 6 0 12',dark,1.5)).join("");
 const commonTail=p("M30 56L9 39Q16 56 9 74L30 61Z",dark);
 const commonFins=p("M45 46L51 32L60 48Z",dark)+p("M47 64L39 77L62 64Z",dark);
 const scales=(fill=dark)=>Array.from({length:9},(_,i)=>dot(40+(i%3)*8,51+Math.floor(i/3)*5,1.15,fill)).join("");

 // Perfiles icónicos: dibujos amplios y específicos, legibles a 56 px.
 // Un pez se distingue por contorno antes que por color, manchas o escamas.
 const specific=(family,parts)=>wrap(family,parts,skin);
 if(/tiburon blanco|carcharodon carcharias/.test(name+" "+latin)){
  return specific("tiburon-blanco",
    p("M9 62L3 42L19 51L29 49Q46 42 69 48L89 53L97 58L88 64Q61 73 29 66L19 65L4 80Z",base)
    +p("M41 48L55 18L63 49Z",dark)+p("M49 67L42 83L66 67Z",dark)
    +p("M33 62Q65 70 92 61Q64 77 31 67Z",belly,"none",0)
    +gills(73,56,4)+eyeMark(84,53)
    +line("M87 63l-2-2-2 2-2-2-2 2",ink,1.5));
 }
 if(/tiburon de puntas negras|carcharhinus melanopterus/.test(name+" "+latin)){
  return specific("tiburon-arrecife",
    p("M12 63L4 45L21 54Q42 45 68 52L88 56L97 60L86 65Q58 70 29 65L19 64L4 78Z",base)
    +p("M43 51L53 25L62 52Z",pale)+p("M50 30L53 25L57 34Z","#252d38",ink,1)
    +p("M49 65L43 77L62 65Z",dark)+p("M45 68L43 77L48 73Z","#252d38",ink,1)
    +gills(73,57,4)+eyeMark(83,56)+line("M23 63Q54 70 87 64",belly,2.5));
 }
 if(/carpa comun|cyprinus carpio/.test(name+" "+latin)){
  return specific("carpa",
    p("M24 55L6 38L12 56L6 75Z",dark)
    +p("M22 54Q26 36 48 33Q76 32 89 50Q92 64 74 74Q43 79 25 63Z",base)
    +p("M36 38Q46 20 66 36Z",dark)
    +p("M47 69L42 83L67 72Z",dark)
    +p("M35 58Q55 67 80 56Q68 77 39 67Z",pale,"none",0)
    +Array.from({length:15},(_,i)=>line("M"+(35+(i%5)*8)+" "+(43+Math.floor(i/5)*8)+"q4-2 5 3",dark,1.4)).join("")
    +eyeMark(78,49)+line("M85 59q7 2 9 7m-9-5q7 0 11-3",dark,2));
 }
 if(/tenca|tinca tinca/.test(name+" "+latin)){
  return specific("tenca",
    p("M23 54L8 43L10 68Z",dark)
    +p("M23 54Q31 42 53 40Q75 41 87 53Q89 70 62 73Q35 76 23 61Z",base)
    +p("M47 41L54 33L65 43Z",dark)+p("M47 69L39 79L65 69Z",dark)
    +p("M37 59Q60 66 83 59Q65 76 43 68Z",pale,"none",0)
    +eyeMark(78,52)+line("M84 60q4 1 8 4",ink,2));
 }
 if(/perca europea|perca fluviatilis/.test(name+" "+latin)){
  return specific("perca",
    p("M25 55L8 40L9 73Z",dark)
    +p("M24 53Q30 39 54 40Q77 42 88 55Q78 75 52 72Q34 69 24 60Z",base)
    +p("M32 44L36 22L43 36L49 21L56 39L62 26L70 46Z",pale)
    +p("M46 68L42 85L65 71Z",dark)
    +Array.from({length:5},(_,i)=>line("M"+(39+i*8)+" "+(42+i%2*2)+"l-2 24",dark,3)).join("")
    +p("M72 60Q83 64 89 58", "none",ink,2)+eyeMark(79,52));
 }
 if(/pez mandarin chino|siniperca chuatsi/.test(name+" "+latin)){
  return specific("mandarin-chino",
    p("M24 58L6 41L12 57L6 75Z",dark)
    +p("M23 55Q34 39 51 40Q76 40 89 56L83 70Q49 76 29 66Z",base)
    +p("M31 45L37 24L44 38L49 23L56 39L61 27L70 43Z",dark)
    +p("M48 69L37 83L66 70Z",dark)
    +Array.from({length:9},(_,i)=>dot(35+(i%3)*12,47+Math.floor(i/3)*8,i%2?2.6:3.5,dark)).join("")
    +eyeMark(79,49)+line("M82 63l9-4",ink,2.4));
 }
 if(/pez mariposa africano|pantodon buchholzi/.test(name+" "+latin)){
  return specific("pez-mariposa-africano",
    p("M15 52L4 37L10 55L5 77L22 63Z",dark)
    +p("M28 53Q36 37 58 45L85 54L89 60Q66 76 38 68Z",base)
    +p("M37 52Q26 21 49 15Q62 26 67 49Z",pale)
    +p("M41 63Q23 76 33 94L64 69Z",dark)
    +p("M84 55L97 48L89 61Z",pale)
    +line("M35 39Q50 42 55 54",dark,2.8)+eyeMark(78,52));
 }
 if(/esturion siberiano|acipenser baerii/.test(name+" "+latin)){
  return specific("esturion-siberiano",
    p("M20 58L6 38L12 57L5 77Z",dark)
    +p("M20 57Q37 43 68 49L96 57L70 62Q38 70 20 62Z",base)
    +p("M42 48L49 27L57 49Z",dark)
    +p("M49 65L45 79L65 64Z",dark)
    +Array.from({length:8},(_,i)=>p("M"+(25+i*7)+" 49l3-5 5 4-4 5Z",pale,ink,1)).join("")
    +Array.from({length:6},(_,i)=>dot(28+i*9,63,2,pale)).join("")
    +line("M83 62l0 10m-6-10l-3 8",dark,1.6)+eyeMark(84,53));
 }
 let family,svg;
 if(sp.kind==="ray" || /manta|mantarraya|raya|raia|mobula|myliobat|dasyat|rajidae|aetobat/.test(name+" "+latin)){
   const manta=/manta|mobula/.test(name+" "+latin);
   family=manta?"manta":"raya";
   svg=p(manta?"M50 43Q33 40 5 27Q13 51 33 61Q41 66 50 63Q59 66 67 61Q88 51 95 27Q68 40 50 43Z":"M50 35Q35 38 9 28Q12 49 31 68Q43 79 50 73Q58 79 69 68Q88 49 91 28Q65 38 50 35Z",base)
     +p("M46 66Q48 83 48 96L52 96Q54 82 54 66Z",dark,ink,1.8)
     +p("M34 50Q50 44 66 50Q63 61 50 63Q37 61 34 50Z",pale,"none",0)
     +line("M21 42Q30 50 39 52M79 42Q70 50 61 52",dark,1.7)
     +dot(43,52,2,eye)+dot(57,52,2,eye)
     +line("M47 59q3 2 6 0",ink,1.4);
 }else if(/tiburon|carcharodon|carcharhin|tr iaenodon|triaenodon|sphyrna|selachim|galeocerdo|isurus/.test(name+" "+latin)){
   const hammer=/martillo|sphyrna/.test(name+" "+latin);
   family=hammer?"tiburon-martillo":"tiburon";
   svg=p("M12 60Q32 45 58 50Q73 51 85 54L94 58L84 63Q64 71 38 66L23 66Z",base)
     +p("M15 59L5 45Q15 51 22 53L20 61L6 78Z",dark)
     +p("M43 49L55 25L63 51Z",dark)
     +p("M54 65L47 78L67 64Z",dark)
     +p("M76 54L70 43L82 53Z",pale)
     +p("M31 64Q63 75 86 62Q64 71 36 67Z",belly,"none",0)
     +gills(70,57,4)+eyeMark(79,54);
   if(hammer)svg+=p("M82 54L91 39L98 42L90 58Z",base)+dot(95,42,1.7,eye);
   if(/blanco|carcharodon/.test(name+" "+latin))svg+=line("M41 66Q64 71 86 62",belly,3);
   if(/puntas negras/.test(name))svg+=p("M53 29L55 25L58 31Z","#27343c",ink,1);
 }else if(/anguila|morena|congrio|lamprea|eel|anguilla|muraena|conger/.test(name+" "+latin)){
   family="anguilliforme";
   svg=p("M8 65Q20 39 43 48Q63 55 75 43Q87 35 93 49Q96 58 88 60Q77 65 60 59Q40 50 27 63Q20 72 9 74Z",base)
      +p("M11 66Q23 57 37 55Q57 60 76 49Q81 43 89 46", "none",dark,2)
      +p("M9 65Q4 76 12 83L17 69Z",dark)
      +eyeMark(86,47)+line("M81 55l7 1",ink,1.3);
 }else if(/caballito de mar|hippocampus/.test(name+" "+latin)){
   family="caballito-mar";
   svg=p("M64 25Q79 23 79 36L72 44Q82 52 71 66Q63 72 54 67Q44 61 48 75Q54 87 62 80Q64 77 60 75",base,ink,6)
      +p("M73 30L88 28L80 35Z",pale)
      +p("M60 47L45 34L48 62Z",dark)
      +line("M61 38l-10-5m9 12l-11-4m10 12l-10-3",pale,2)
      +eyeMark(73,31);
 }else if(/lenguado|rodaballo|platija|solea|pleuronect|scophthalm/.test(name+" "+latin)){
   family="pez-plano";
   svg=p("M17 55Q33 24 62 35Q89 43 82 61Q62 88 30 70Z",base)
      +p("M19 55L8 43L10 72Z",dark)
      +p("M31 43Q51 27 72 45Q49 39 31 51Z",pale,"none",0)
      +scales()+dot(63,46,2,eye)+dot(69,51,2,eye);
 }else if(/esturion|acipenser|huso huso/.test(name+" "+latin)){
   family="esturion";
   svg=p("M24 55Q45 40 70 49L92 55L76 61Q51 68 26 61Z",base)
      +p("M23 55L8 35L14 54L7 75L26 61Z",dark)
      +p("M42 46L47 31L55 46Z",dark)
      +p("M49 63L43 76L63 63Z",dark)
      +Array.from({length:7},(_,i)=>p("M"+(33+i*7)+" 49l4-3 4 4-4 4Z",pale,ink,1)).join("")
      +line("M75 59l4 9m-9-9 1 8",dark,1.5)+eyeMark(81,52);
 }else{
   const salmon=/salmon|trucha|oncorhynch|salmo |salvelinus/.test(name+" "+latin),
   carp=/carpa|barbo|tenca|cyprinus|barbus|tinca/.test(name+" "+latin),
   deep=/pez mariposa|pez angel|chaetodon|pomacanth|butterfly/.test(name+" "+latin),
   predator=/pez tigre|lucio|perca|tilapia|lates |hydrocyn|siniperca|channa/.test(name+" "+latin);
   family=salmon?"salmonido":carp?"ciprinido":deep?"arrecife":predator?"depredador-oseo":"pez-oseo";
   const shape=deep?"M26 54Q31 31 52 32Q75 38 80 54Q74 77 51 76Q31 72 26 54Z":
     carp?"M25 55Q34 38 55 41Q81 43 86 54Q78 67 55 69Q35 67 25 55Z":
     predator?"M24 55Q37 42 62 46L88 53L92 59Q68 69 39 64Z":
     "M24 55Q41 43 61 47Q75 48 87 54L91 58Q75 67 54 65Q35 65 24 55Z";
   svg=commonTail+p(shape,base)+commonFins
     +p(deep?"M47 47Q57 41 65 51Q62 62 48 66Z":"M42 57Q53 51 63 57Q53 65 42 57Z",pale,"none",0)
     +p("M39 62Q48 70 61 64Z",belly,"none",0)
     +line("M72 48Q67 54 72 61",dark,1.6)
     +eyeMark(deep?69:78,52);
   if(salmon){
     svg+=Array.from({length:8},(_,i)=>dot(38+(i%4)*8,49+Math.floor(i/4)*8,1.15,dark)).join("");
     if(/rojo|rosado|nerka|gorbuscha/.test(name+" "+latin))svg+=p("M41 57Q54 62 67 56", "none",pale,2);
   }else if(carp){
     svg+=scales()+line("M83 56q6 3 8 7m-7-6q6 1 10-1",dark,1.3);
   }else if(deep){
     svg+=line("M42 39Q48 54 40 68",dark,4)+line("M58 36Q65 54 56 71",dark,3.6);
   }else if(predator){
     svg+=line("M84 60l-2 3-3-3-3 3-3-3",ink,1.4);
     if(/tigre/.test(name))svg+=Array.from({length:4},(_,i)=>line("M"+(43+i*8)+" 47l-4 16",dark,2.5)).join("");
   }else svg+=scales();
 }
 return wrap(family,svg,skin);
}
window.ATLAS_FISH_ART_V3191=art;
})();