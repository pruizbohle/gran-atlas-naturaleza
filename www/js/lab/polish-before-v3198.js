/* Controlled production snapshot bacffc91dc39fecfbba850f0d4bcfc10ba36398f. Comparison only; no game bootstrap or storage. */
(function(host){const globalThis={},window=globalThis,module=undefined;
/* ATLAS FISH INLINE 3.19.1b */
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

/* El Gran Atlas 3.19.2b — herpetario vectorial.
 * Familia → morfología → anatomía de especie → paleta. Sin estado del juego.
 * Contornos de 2.6 u; detalles de 1.2–1.8 u; geometría pensada para 56 px.
 */
(function(root){
"use strict";
function norm(s){return String(s||"").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function classify(sp){
 if(!sp)return null;
 const k=sp.kind||"",t=norm(sp.name)+" "+norm(sp.latin);
 if(k==="fish"||k==="ray")return null;
 if(/\b(lagarto cabeza de sapo|phrynocephalus)\b/.test(t))return "lizard";
 // Whole words: «musaraña» and Lepus granatensis are mammals, never Rana.
 if(/\b(rana|sapo|escuerzo|conraua|xenopus|breviceps|epidalea|strauchbufo|sclerophrys|schismaderma)\b/.test(t))
   return /rana de lluvia|\b(sapo|bufo|epidalea|strauchbufo|sclerophrys|schismaderma|breviceps)\b/.test(t)?"toad":"frog";
 if(/\b(salamandra|triton|salamandrella|lissotriton|triturus|ichthyosaura|andrias)\b/.test(t)||k==="salamander")
   return /\b(andrias|gigante)\b/.test(t)?"giant-salamander":/\b(triton|lissotriton|triturus|ichthyosaura)\b/.test(t)?"newt":"salamander";
 if(/\b(tortuga|galapago|testudo|mauremys|aldabrachelys|astrochelys|dermochelys|chelonia|caretta|eretmochelys)\b/.test(t)||k==="tortoise")
   return /\b(laud|marina|dermochelys|chelonia|caretta|eretmochelys)\b/.test(t)?"sea-turtle":/\b(galapago|mauremys)\b/.test(t)?"pond-turtle":"land-tortoise";
 if(/\b(cocodrilo|caiman|crocodylus|mecistops|osteolaemus)\b/.test(t)||k==="crocodile")return /hocico estrecho|\bmecistops\b/.test(t)?"slender-crocodile":"crocodile";
 if(/\b(lucion|lagarto de cristal|anguis|pseudopus)\b/.test(t))return "glass-lizard";
 if(/\b(cobra|naja|ophiophagus)\b/.test(t))return "cobra";
 if(/\b(vibora|vipera|cerastes|daboia|bitis)\b/.test(t))return "viper";
 if(/\b(piton|python|boa|sanzinia|malayopython)\b/.test(t))return "python";
 if(/\b(mamba|dendroaspis)\b/.test(t))return "mamba";
 if(/\b(krait|bungarus)\b/.test(t))return "krait";
 if(/\b(culebra|natrix|serpiente)\b/.test(t)||k==="snake")return "snake";
 if(/\b(camaleon|chamaeleo|furcifer|calumma|trioceros)\b/.test(t))return "chameleon";
 if(/\b(geco|gecko|gekko|phelsuma|uroplatus|pachydactylus|stenodactylus)\b/.test(t))return "gecko";
 if(/dragon volador|\bdraco\b/.test(t))return "flying-lizard";
 if(/\b(varano|varanus|komodo)\b/.test(t))return "monitor";
 if(/\buromastyx\b|cola espinosa/.test(t))return "spiny-lizard";
 if(/\b(lagarto|lagartija|agama|phrynocephalus|timon)\b/.test(t)||k==="lizard"||k==="reptile")return "lizard";
 return null;
}
function tint(hex,delta){
 const c=/^#[0-9a-f]{6}$/i.test(hex||"")?hex:"#688878";
 return "#"+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(c.slice(i,i+2),16)+delta)).toString(16).padStart(2,"0")).join("");
}
function paint(c,skin,t){
 if(skin!=="normal")return c;
 const palettes=[
 [/salamandra comun|salamandra salamandra/,"#343c32"],
 [/salamandra alpina|salamandra atra/,"#353e40"],
 [/pantera|furcifer pardalis/,"#408f93"],
 [/geco diurno|phelsuma/,"#4b9f70"],
 [/tokay|gekko gecko/,"#71979c"],
 [/radiada|astrochelys/,"#97804e"],
 [/laud|dermochelys/,"#536774"],
 [/lluvia|breviceps/,"#bd9f7b"],
 [/\bsapo\b|epidalea|strauchbufo|sclerophrys|schismaderma/,"#918b68"],
 [/mamba negra|dendroaspis polylepis/,"#677c78"],
 [/cerastes/,"#c1a472"]
 ];
 const match=palettes.find(([re])=>re.test(t));return match?match[1]:c;
}
function render(sp,color,skin="normal"){
 const family=classify(sp);if(!family)return null;
 const t=norm(sp.name)+" "+norm(sp.latin),base=color||sp.color;
 const c=paint(/^#[0-9a-f]{6}$/i.test(base||"")?base:"#688878",skin,t);
 const dark=tint(c,-30),mid=tint(c,-15),light=tint(c,24),ink="#344038";
 const natural=skin==="normal"||skin==="alfa";
 const bone=natural?"#ddd2a9":skin==="albino"?"#f4e9ed":"#687079";
 const accent=hex=>natural?hex:bone;
 const eye=skin==="albino"?"#c85f6c":skin==="melanico"?"#c9bc7a":"#202d29";
 const p=(d,f=c,s=ink,w=2.6)=>'<path d="'+d+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
 const line=(d,s=mid,w=1.6)=>p(d,"none",s,w);
 const circle=(x,y,r,f)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"/>';
 const ell=(x,y,rx,ry,f=c,s=ink,w=2.6)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+w+'"/>';
 // Interior marks are explicitly separated so a silhouette is an honest anatomy check.
 const detail=svg=>'<g data-herp-detail="true">'+svg+'</g>';
 const eyes=(x,y,r=2.1)=>detail(circle(x,y,r+1,light)+circle(x,y,r,eye)+circle(x+.55,y-.65,.65,"#faf5e6"));
 const spots=(points,r=2,f=mid)=>points.map(([x,y])=>circle(x,y,r,f)).join("");
 // A tapered, filled limb with an elbow/knee. Digits start at the wrist.
 const limb=(d,f=dark)=>p(d,f);
 const toes=(d,f=ink,w=1.6)=>line(d,f,w);
 let art="",morph=family;
 if(family==="frog"){
  const aquatic=/xenopus|unas africana/.test(t),giant=/goliat|conraua/.test(t);
  morph=aquatic?"aquatic-frog":giant?"goliath-frog":"terrestrial-frog";
  if(aquatic){
   art=limb("M33 57C22 49 14 54 15 66C15 74 22 76 24 80L10 86Q6 89 10 91L27 89Q36 83 39 69Z")
    +limb("M63 58C76 51 85 57 81 69L74 81L91 86Q95 90 90 92L73 88Q61 79 59 68Z")
    +p("M31 45Q49 35 66 45Q75 55 67 71Q50 83 32 70Q23 55 31 45Z")
    +limb("M34 57Q28 64 28 72L21 77Q20 80 24 79L33 74L39 62Z",c)
    +limb("M63 57Q70 65 70 72L79 78Q81 81 76 80L66 75L58 62Z",c)
    +p("M29 44Q35 35 49 37Q64 35 70 45Q68 56 50 57Q33 56 29 44Z",light)
    +eyes(39,41,1.8)+eyes(60,41,1.8)
    +detail(line("M36 49Q50 53 64 49")+line("M15 86L22 87M78 84L86 88",light))
    +toes("M11 88L7 92M19 88L18 94M26 85L29 91M76 86L73 92M83 89L84 95M90 89L95 92",bone,1.7);
  }else{
   art=limb(giant?"M34 53C19 47 8 57 12 71Q14 80 28 78L14 85Q10 88 17 89L37 82Q46 72 40 60Z":"M34 54C20 49 10 59 14 71Q17 78 29 77L17 84Q13 87 18 88L36 81Q44 72 40 62Z")
    +limb("M62 55C77 47 89 57 86 70Q84 79 70 78L82 84Q88 86 84 89L65 82Q57 74 57 65Z")
    +p(giant?"M29 49Q31 37 48 36Q70 36 73 53Q76 68 62 76Q44 83 30 70Q24 62 29 49Z":"M31 48Q36 38 51 38Q66 38 69 52Q73 65 60 73Q43 78 32 67Q26 59 31 48Z")
    +detail(p("M34 58Q49 63 65 57Q67 69 55 72Q41 75 34 65Z",light,"none",0))
    +limb("M35 57Q31 67 34 75L28 84Q26 88 31 86L40 79Q42 70 42 62Z",c)
    +limb("M62 57Q67 67 63 76L71 84Q75 88 70 87L58 79Q56 70 56 62Z",c)
    +p(giant?"M27 47Q28 39 36 37Q37 30 45 33Q54 32 61 34Q69 30 72 38Q77 42 74 49Q57 61 36 56Q29 54 27 47Z":"M29 46Q30 39 36 37Q38 30 45 34Q53 33 58 34Q66 30 69 38Q75 42 72 48Q56 59 38 54Q30 52 29 46Z",light)
    +eyes(41,38)+eyes(64,38)
    +detail(line("M34 47Q51 54 68 46",mid,1.4)+p("M33 43Q34 39 38 40L37 46Z",dark,"none",0)+spots([[41,56],[52,60],[60,54]],1.8,mid))
    +toes("M18 87L10 88M20 86L14 92M28 85L25 91M82 87L90 89M81 86L86 92M70 86L72 92");
  }
 }else if(family==="toad"){
  const rain=/breviceps|lluvia/.test(t),runner=/epidalea|corredor/.test(t),mongol=/strauchbufo|mongol/.test(t);
  morph=rain?"rain-frog":runner?"running-toad":mongol?"mongolian-toad":"robust-toad";
  art=limb(rain?"M30 64Q18 65 20 78L15 84Q14 87 24 84L36 76Z":"M32 57Q17 56 15 69Q13 76 23 78L16 85Q16 89 29 84L40 74Z")
   +limb(rain?"M67 64Q80 65 79 78L85 84Q85 87 76 85L64 76Z":"M67 58Q83 55 86 69Q88 77 77 79L85 85Q85 88 72 85L60 74Z")
   +p(rain?"M24 57Q24 43 36 39Q37 32 44 37Q51 35 58 37Q65 32 68 40Q79 45 78 60Q78 80 61 85Q38 91 27 74Q23 65 24 57Z":"M27 53Q29 43 38 42Q39 33 46 37Q54 34 61 39Q68 36 70 43Q79 48 77 63Q75 77 62 81Q43 86 29 74Q23 66 27 53Z")
   +detail(p("M32 65Q50 75 72 63Q71 80 53 82Q36 82 32 65Z",light,"none",0))
   +limb("M35 61Q30 69 33 78L29 85Q28 88 33 86L40 80Q42 73 41 67Z",c)
   +limb("M66 61Q71 70 68 78L73 85Q76 89 71 87L61 81Q60 72 61 67Z",c)
   +eyes(rain?39:43,rain?42:41)+eyes(rain?64:64,rain?42:42)
   +detail(line(rain?"M38 55Q51 60 65 55":"M38 53Q52 59 67 52")
    +ell(32,52,3.5,5,mid,"none",0)+ell(71,53,3,5,mid,"none",0)
    +spots(rain?[[32,60],[40,66],[60,65],[69,59]]:[[33,61],[40,58],[53,64],[65,58],[69,68]],rain?1.5:2.2,mid)
    +(runner?line("M51 39Q47 49 51 67",bone,2.3):mongol?spots([[39,49],[59,48],[47,60],[60,72]],2.8,dark):""))
   +toes("M17 85L11 87M24 84L21 89M82 85L89 88M76 85L78 90M31 86L29 90M72 86L74 90");
 }else if(family==="salamander"||family==="newt"||family==="giant-salamander"){
  const giant=family==="giant-salamander",newt=family==="newt",crest=newt&&/crestado|triturus/.test(t),fire=/salamandra comun|salamandra salamandra/.test(t),alpine=/salamandra atra|salamandra alpina/.test(t);
  morph=giant?"flattened-giant":crest?"crested-newt":newt?"swimming-newt":fire?"fire-salamander":alpine?"alpine-salamander":"terrestrial-salamander";
  // Far limbs are behind the uninterrupted tail–trunk–head contour.
  art=limb("M36 51Q34 43 40 38L45 37Q46 39 42 41L41 53Z")
   +limb("M64 49Q65 41 73 40L77 42Q78 44 73 44L70 53Z");
  if(crest)art+=p("M21 56Q26 45 30 47Q34 39 38 44Q42 35 46 42Q50 33 54 41Q58 36 62 46L67 51Z",mid,ink,1.8);
  art+=p(giant?"M5 76C12 60 21 50 37 50Q52 45 64 49Q74 39 87 42Q98 45 96 57Q95 68 83 70Q72 71 64 65Q48 74 30 63Q16 64 5 76Z":newt?"M6 79Q12 54 28 51Q43 48 59 52Q71 47 82 49Q92 51 94 57Q93 64 83 65Q72 66 64 62Q46 69 29 60Q15 62 6 79Z":"M6 77Q13 56 29 53Q44 47 60 53Q69 49 78 49Q90 50 94 58Q95 64 86 67Q74 70 64 64Q49 70 31 62Q17 63 6 77Z")
   +detail(p(giant?"M23 61Q45 53 65 59Q77 64 89 60Q76 69 64 63Q42 67 23 61Z":"M24 57Q44 52 63 57Q43 63 24 57Z",light,"none",0))
   +limb(giant?"M36 63Q31 65 31 71L26 75Q25 78 29 77L38 73Q41 70 43 65Z":"M36 61Q32 64 32 72L27 76Q25 79 30 78L38 74Q41 70 42 63Z",c)
   +limb(giant?"M65 63Q64 71 71 75L77 77Q81 76 77 74L73 70L73 63Z":"M66 61Q62 69 69 75L75 77Q80 77 76 74L72 70L72 62Z",c)
   +toes("M25 78L21 82M29 77L28 82M76 77L76 82M76 76L82 79M41 38L40 34M45 38L47 35M74 42L77 38",ink,1.3)
   +eyes(giant?85:84,giant?51:54,giant?1.3:1.8)
   +detail(line(giant?"M80 61Q89 63 94 58":"M83 61Q90 62 93 59",mid,1.3)
    +(giant?line("M28 60Q47 68 63 59M40 55L42 59M49 54L51 58",dark,1.3)+spots([[40,58],[52,62],[71,53]],1.7,dark):""));
  if(fire)art+=detail(p("M30 54Q36 52 39 55L37 60L31 59Z",accent("#dab850"),"none",0)+p("M45 53Q51 52 54 56L51 62L47 60Z",accent("#dab850"),"none",0)+p("M64 54Q69 52 73 55L70 60L65 59Z",accent("#dab850"),"none",0)+line("M34 66L36 70M69 67L70 71",accent("#dab850"),2.4));
  else if(newt)art+=detail(line("M32 61Q48 66 61 61",accent("#ca9b63"),2)+spots([[38,55],[47,56],[58,56]],1.3,dark));
  else if(!alpine)art+=detail(line("M21 60Q43 49 63 56",light,1.8));
 }else if(family==="land-tortoise"||family==="pond-turtle"||family==="sea-turtle"){
  const sea=family==="sea-turtle",pond=family==="pond-turtle",big=/aldabra|aldabrachelys|gigante/.test(t),radiated=/radiada|astrochelys/.test(t),leather=/laud|dermochelys/.test(t);
  morph=sea?(leather?"leatherback":"marine-turtle"):pond?"low-shell":big?"giant-tortoise":"domed-tortoise";
  if(sea){
   art=p("M35 41C22 37 11 46 5 65Q4 70 9 67Q21 57 31 59L36 55Z",dark)
    +p("M65 41C78 37 89 46 95 65Q96 70 91 67Q79 57 69 59L64 55Z",dark)
    +p("M36 68Q24 75 24 86Q35 84 43 77ZM63 68Q75 75 76 86Q65 84 57 77Z",mid)
    +p("M44 32Q41 18 49 14Q60 12 59 25L56 35Z",light)
    +p("M50 30C66 31 77 44 74 59Q70 77 51 84Q31 76 27 58C24 44 35 31 50 30Z")
    +p("M48 82Q50 87 51 90L54 82Z",c)
    +eyes(53,21,1.7)
    +detail(leather?line("M50 34Q43 54 51 79M39 38Q31 56 45 77M61 38Q69 56 57 77",light,1.8)
     +spots([[45,43],[55,47],[40,57],[61,60],[48,67],[54,74]],1.1,bone)
     :line("M50 35L42 47L43 62L51 74L60 62L60 47ZM42 47L31 44M43 62L31 65M60 47L70 44M60 62L69 65",dark,1.5));
  }else{
   art=limb("M31 63Q26 72 28 80L36 81Q40 77 41 68Z")
    +limb("M56 64L56 81Q59 84 65 81L68 65Z")
    +p("M72 55Q76 50 80 50Q79 40 87 40Q96 40 96 47Q95 55 86 56L81 66L72 66Z",light)
    +p(pond?"M21 65Q20 48 36 42Q57 35 71 46Q78 53 77 66Q48 77 21 65Z":"M20 65C17 46 26 30 44 29C64 26 75 42 76 62Q52 76 20 65Z")
    +detail(p(pond?"M26 60Q27 46 43 44Q61 40 70 54Q47 51 26 60Z":"M25 56Q24 36 44 33Q63 30 69 51Q46 44 25 56Z",light,"none",0))
    +p("M20 62Q46 69 76 60L77 67Q49 79 20 69Z",mid)
    +limb(pond?"M31 68Q25 74 20 77L15 79Q12 82 18 82L31 79L40 70Z":"M31 69Q26 76 25 84Q27 88 37 85L41 72Z",c)
    +limb(pond?"M61 69Q62 77 71 81L79 80Q82 78 77 77L70 74L68 68Z":"M61 70Q60 79 63 85Q70 89 75 84L71 69Z",c)
    +p("M21 64Q14 66 11 70Q18 69 22 68Z",dark)
    +eyes(89,44,1.7)
    +detail(line(pond?"M44 44L35 51L38 61L52 65L63 57L58 45ZM35 51L26 50M38 61L27 65M63 57L72 52":"M43 33L34 43L36 56L50 62L62 53L59 40ZM34 43L24 45M36 56L23 60M50 62L49 68M62 53L71 50M59 40L64 37",dark,1.5)
     +(radiated?line("M47 47L44 35M47 47L35 44M47 47L38 55M47 47L50 60M47 47L59 52M47 47L58 42",bone,1.5):"")
     +(pond?line("M78 53Q83 49 91 50",bone,1.4):line("M28 82L29 79M33 83L34 79M66 83L66 79M71 82L70 78",bone,1.4)));
   if(big)art=art.replace('M20 65C17 46 26 30 44 29C64 26 75 42 76 62','M20 65C16 44 24 23 44 24C67 22 77 40 76 62');
  }
 }else if(family==="crocodile"||family==="slender-crocodile"){
  const slim=family==="slender-crocodile",dwarf=/enano|osteolaemus/.test(t);
  morph=slim?"slender-snout":dwarf?"dwarf-crocodile":"broad-snout";
  art=limb("M35 51Q32 44 38 40L46 40L41 45L43 54Z")
   +limb("M63 50Q63 44 69 42L76 44L69 46L71 54Z")
   +p(slim?"M5 76C16 59 20 53 35 51Q49 47 62 50Q67 46 72 49L94 53Q98 54 96 58L72 61Q70 68 58 66Q39 70 27 62Q15 63 5 76Z":"M5 76C13 59 20 52 33 49Q50 43 64 49Q72 44 81 49L94 52Q98 55 96 61L80 64Q69 70 56 68Q39 73 27 63Q14 64 5 76Z")
   +detail(p("M16 66Q28 57 42 61Q61 68 77 58L95 56L95 60L78 63Q58 72 31 65Q23 61 16 66Z",light,"none",0))
   +limb("M34 62Q28 65 29 73L21 79Q20 81 25 81L37 76L43 65Z",c)
   +limb("M62 64Q61 73 70 76L77 80Q82 80 79 76L72 70L72 63Z",c)
   +toes("M23 80L19 84M28 79L26 84M75 79L74 84M79 79L83 82",ink,1.4)
   +eyes(slim?70:77,slim?51:49,1.6)
   +detail(line(slim?"M75 57L95 56":"M82 58Q90 59 96 56",dark,1.5)
    +[29,39,49,59,67].map((x,i)=>p('M'+x+' '+(52-i%2*2)+'q3-5 6 0l-1 4-4 0Z',mid,"none",0)).join("")
    +line("M17 64Q22 55 29 55",dark,1.7)+circle(92,slim?54:53,1,ink)
    +(dwarf?spots([[39,60],[52,58],[61,61]],1.8,dark):""));
 }else if(family==="cobra"){
  const king=/real|ophiophagus/.test(t),indian=/india|naja naja/.test(t);
  morph=king?"king-cobra":indian?"spectacled-cobra":"cobra";
  art=p("M8 80C15 65 29 62 43 72C57 84 79 82 83 71Q85 65 77 64Q71 62 67 66L60 62Q70 53 82 58C98 64 91 83 77 87Q54 94 38 81Q20 69 8 80Z",c)
   +p(king?"M49 72Q51 57 42 46C35 35 42 22 52 22Q53 14 61 15Q72 15 72 26C80 36 80 45 69 54L64 73Z":"M47 74Q50 61 39 49C25 32 37 23 49 25Q50 17 59 17Q70 17 71 26C86 25 87 38 75 51Q64 62 64 75Z",c)
   +detail(p("M53 31Q58 26 65 31Q69 42 62 51L59 73L53 72Q58 52 53 31Z",light,"none",0)
    +line("M54 51L63 52M54 58L62 59M53 65L61 66",mid,1.4)
    +(indian?line("M39 37Q42 31 47 37Q50 42 54 38M66 38Q71 31 76 37",bone,2):""))
   +p("M50 24Q50 16 58 15Q68 14 70 23Q70 30 62 32Q53 31 50 24Z",light)
   +eyes(55,23,1.7)+eyes(65,23,1.7)
   +detail(line("M57 29Q61 31 65 28",mid,1.2));
 }else if(family==="glass-lizard"){
  morph=/pseudopus|oriental/.test(t)?"sheathed-glass-lizard":"slow-worm";
  // Long taper, small blunt head, visible ear and eyelid; no serpent coil.
  art=p("M5 81C18 68 26 58 42 62C54 66 65 74 73 68Q79 61 71 57C62 53 52 57 49 51Q44 42 56 37C67 32 76 39 80 43Q91 42 95 48Q97 55 88 57Q80 58 75 51Q65 41 58 44Q52 46 57 49C71 48 86 52 85 65C83 85 60 81 45 72Q29 62 5 81Z")
   +eyes(89,48,1.7)
   +detail(line("M17 73Q32 60 47 67T76 72",light,1.9)+line("M86 53L94 52",mid,1.1)+circle(81,50,1.1,dark)+line("M85 46Q88 44 91 46",mid,1.2));
 }else if(["viper","python","mamba","krait","snake"].includes(family)){
  const viper=family==="viper",python=family==="python",mamba=family==="mamba",krait=family==="krait",horn=/cerastes|cornuda/.test(t),russell=/russell|daboia/.test(t),retic=/reticul/.test(t);
  morph=viper?(horn?"horned-viper":russell?"russells-viper":"viper"):python?(retic?"reticulated-python":"python"):family;
  const shape=viper?"M7 79C7 67 11 49 27 48C45 46 53 59 44 70Q40 77 55 77Q71 78 71 65L68 56Q66 49 76 43Q82 39 86 42L95 51Q98 57 91 60L80 60Q88 81 68 87Q47 94 31 82Q23 75 29 65Q36 57 26 57Q14 57 7 79Z":
   python?"M6 80C9 61 15 43 32 44C52 44 56 60 44 71Q38 79 53 81Q76 83 78 68Q80 57 69 54C58 51 57 36 71 32Q83 28 87 37L94 41Q99 45 95 51Q90 55 84 49Q79 43 73 43Q68 45 78 49C96 57 92 80 75 87Q52 97 34 84Q24 77 33 64Q43 53 32 53Q18 50 6 80Z":
   mamba?"M6 83Q18 75 23 63C27 51 24 37 36 29C49 18 66 23 70 36Q75 52 63 63Q58 69 63 73Q71 77 79 64L84 51Q83 40 90 37Q97 35 97 43Q95 49 91 53L87 68Q75 88 61 80Q49 74 58 61Q70 49 64 37Q58 24 44 29Q30 33 30 50Q32 73 6 83Z":
   krait?"M6 83C15 75 14 55 29 48Q43 40 50 54L54 66Q58 75 67 69Q74 64 75 53L77 42Q80 33 89 34Q97 35 97 42Q96 48 87 47L85 55Q84 76 69 81Q51 88 45 72L41 59Q38 50 30 57C21 64 24 78 6 83Z":
   "M6 81C14 69 22 49 37 51Q48 52 50 63Q51 73 61 70Q70 68 74 56L79 46Q84 37 92 42Q99 45 95 51Q91 56 84 53L82 60Q77 79 62 80Q45 84 42 70Q40 59 34 61Q20 62 6 81Z";
  art=p(shape);
  if(krait){
   // Bands follow the body centerline. Each short cross-section stays inside its contour.
   art+=detail(line("M18.2 62.9L21.9 65.2M26 52L29.2 55.2M36 47.2L36.7 52.2M45.9 51.1L41.5 55.5M51.3 63.8L44.8 64.9M54.5 70.5L49.1 75.9M58.4 72.8L59.6 81.2M68.7 70.1L73.2 76.9M75.4 60.5L82.1 62.7M77.3 50.9L83.8 52",bone,3.2));
  }else if(python){
   art+=detail(retic?line("M20 61L24 52L31 50L37 55L31 61L24 55M38 72L43 77L50 84L58 85M63 84L69 80L76 82M82 70L87 65L83 59M70 36L75 40L81 35",dark,1.8):spots([[25,51],[38,58],[38,76],[53,87],[73,80],[84,64],[70,39]],3,dark));
  }else if(viper){
   art+=detail(russell?ell(22,54,4,2.5,dark,bone,1.2)+ell(39,59,3,4,dark,bone,1.2)+ell(50,83,4,2.4,dark,bone,1.2)+ell(70,80,3,4,dark,bone,1.2)
    :line("M17 59L24 53L30 57L37 53M38 67L34 74L42 80L50 80L58 84L68 81",dark,3));
  }else if(/collar|natrix natrix/.test(t))art+=detail(line("M79 48L83 52",bone,3.4));
  else if(/viperina|natrix maura/.test(t))art+=detail(line("M23 62L30 57L36 60M46 67L49 74L57 75M68 71L75 63",dark,2));
  art+=eyes(viper?87:python?91:mamba?92:krait?91:90,viper?49:python?44:mamba?41:krait?38:45,1.6)
   +detail(line(viper?"M88 55L94 53":python?"M90 49L95 47":mamba?"M92 46L96 43":krait?"M90 44L96 42":"M89 51L95 48",dark,1.2));
  if(horn)art+=p("M78 44Q78 37 81 35L83 44M86 44Q89 37 91 38L90 47",c,ink,1.8);
 }else if(family==="chameleon"){
  const jackson=/jackson|trioceros/.test(t),parson=/parson|calumma/.test(t),panther=/pantera|furcifer pardalis/.test(t),desert=/namaqua|namaquensis/.test(t);
  morph=jackson?"jacksons-chameleon":parson?"parsons-chameleon":panther?"panther-chameleon":desert?"desert-chameleon":"chameleon";
  // The tail is a closed, tapered spiral attached beneath the pelvis.
  art=p("M31 59C23 63 20 73 13 70C3 65 9 51 17 53C23 55 23 63 18 64Q14 65 13 60Q14 69 21 66C30 60 21 44 12 47C-1 52 2 77 16 77Q29 79 38 65Z",c)
   +limb("M42 58Q42 68 48 74L45 82L50 83L55 74L50 61Z")
   +limb("M65 57Q61 68 68 75L73 82L78 81L72 72L74 58Z")
   +p(parson?"M27 58C25 43 34 31 49 30Q64 28 72 43L77 36L84 29L84 44L94 49Q97 54 90 57L78 60Q58 77 38 67Q30 65 27 58Z":"M27 58C25 44 34 34 48 33Q62 31 71 44L76 34Q79 36 80 44Q90 42 95 49Q98 54 91 57L79 60Q58 76 38 67Q30 65 27 58Z")
   +detail(p("M33 55Q47 63 70 51Q65 67 47 67Q36 65 33 55Z",light,"none",0)
    +(panther?line("M40 40Q36 49 41 59M50 37Q45 49 51 63M59 38Q54 50 61 59",accent("#cfa66f"),3):line("M35 47Q44 39 58 40",light,1.6)))
   +limb("M37 58Q34 66 39 72L35 81Q36 84 41 82L46 72Q48 68 44 62Z",c)
   +limb("M66 57Q64 65 71 69L78 77L76 81L80 83Q85 78 82 75L74 63L73 57Z",c)
   +toes("M36 82L32 83M40 82L43 85M77 81L73 83M80 82L84 84",ink,1.5)
   +ell(parson?84:82,49,4.8,4.8,light,mid,1.3)+eyes(parson?85:83,49,1.5)
   +detail(line("M85 55Q91 55 95 52",dark,1.2));
  if(jackson)art+=p("M86 45Q91 34 94 33L91 46M80 43Q81 35 85 32L84 44M92 49L98 44L96 51",bone,ink,1.6);
 }else if(family==="gecko"){
  const leaf=/uroplatus|cola de hoja/.test(t),day=/phelsuma|diurno/.test(t),tokay=/tokay|gekko gecko/.test(t),palm=/palmeadas|pachydactylus/.test(t);
  morph=leaf?"leaf-tailed-gecko":day?"day-gecko":tokay?"tokay-gecko":palm?"web-footed-gecko":"gecko";
  art=limb("M37 48Q31 40 36 33L42 30L44 33L39 39L44 49Z")
   +limb("M64 46Q64 36 74 33L80 35L78 39L71 40L72 50Z");
  art+=p(leaf?"M30 58Q22 49 13 51Q16 57 8 60Q4 62 10 68Q9 71 8 77Q14 75 18 77L23 79Q24 71 29 68L35 65Z":"M32 57Q21 56 16 64Q8 76 6 77C18 81 28 70 35 64Z",mid)
   +p("M28 56Q40 46 57 49Q66 50 72 44Q79 40 87 44Q94 45 95 52Q97 58 88 62Q80 65 72 59Q61 65 46 65Q34 66 28 61Z")
   +detail(p("M32 59Q48 51 63 56Q49 62 32 59Z",light,"none",0))
   +limb("M40 60Q32 64 31 72L22 77Q21 80 26 80L36 77Q40 73 46 64Z",c)
   +limb("M62 60Q58 69 65 76L73 80Q77 80 76 76L69 70L70 60Z",c)
   +toes("M24 78L17 78M25 79L21 85M27 78L28 84M73 78L80 77M73 79L78 84M71 79L70 85M40 32L34 27M42 32L44 25M75 35L80 29M77 37L84 36",c,3.3)
   +[[17,78],[21,85],[28,84],[80,77],[78,84],[70,85],[34,27],[44,25],[80,29],[84,36]].map(([x,y])=>circle(x,y,palm?2.6:1.8,light)).join("")
   +ell(83,47,4.6,5,light,ink,1.3)+eyes(84,47,2.7)
   +detail(line("M86 58Q91 59 94 55",dark,1.3)
    +(leaf?line("M12 68L29 61M17 59L20 64M16 72L21 68",dark,1.2):spots([[38,55],[49,59],[59,54],[70,54]],tokay?2.3:1.8,accent(tokay?"#bd8267":day?"#b76859":mid))))
   +(palm?p("M18 78Q17 84 22 85L27 82L28 78Z",light,mid,1):"");
 }else if(family==="flying-lizard"){
  morph="rib-supported-patagia";
  // Paired patagia grow from the flanks; curved ribs end at the membrane edge.
  art=p("M35 48C24 37 18 36 11 44Q7 56 10 66Q25 70 43 60Z",light)
   +p("M48 47Q60 30 76 35Q86 43 87 60Q71 70 53 59Z",light)
   +detail(line("M39 54Q26 47 12 44M40 57Q25 55 10 57M54 53Q66 39 76 35M56 57Q72 48 84 49M57 59Q71 59 86 60",mid,1.4))
   +limb("M39 48Q36 37 42 32L48 32L43 37L46 51Z")
   +limb("M65 47Q64 39 70 35L77 37L70 40L72 50Z")
   +p("M5 82C14 63 20 58 30 55Q48 47 64 51Q72 44 84 46Q93 47 96 53Q95 60 86 61Q78 63 70 59Q52 66 33 62Q19 62 5 82Z")
   +limb("M36 60Q31 68 33 74L27 80L31 82L39 76L44 63Z",c)
   +limb("M62 61Q59 70 67 75L75 79L77 76L70 70L71 60Z",c)
   +toes("M28 80L23 83M31 81L30 86M75 77L81 80M74 79L75 84",ink,1.4)
   +eyes(87,50,1.8)+detail(line("M87 57L94 55",mid,1.2)+line("M32 57Q49 53 64 56",light,1.7));
 }else if(family==="monitor"||family==="spiny-lizard"||family==="lizard"){
  const monitor=family==="monitor",spiny=family==="spiny-lizard",komodo=/komodo/.test(t),bengal=/bengala|bengalensis/.test(t),ocel=/ocelado|timon/.test(t),toadhead=/phrynocephalus|cabeza de sapo/.test(t);
  morph=komodo?"komodo-dragon":monitor?(bengal?"bengal-monitor":"monitor"):spiny?"spiny-tailed-lizard":toadhead?"toad-headed-lizard":"lacertid";
  art=limb("M36 51Q32 42 39 37L45 37L41 43L45 54Z")
   +limb("M64 50Q63 40 70 36L76 37L70 42L72 53Z");
  art+=p(komodo?"M5 79C12 63 21 49 35 48Q50 40 64 49Q73 51 77 46Q82 41 90 44Q97 45 96 53Q96 60 86 60Q78 60 72 64Q56 76 38 64Q23 59 5 79Z":monitor?"M5 81Q14 56 31 51Q46 43 59 50Q68 54 73 45Q78 38 86 40Q96 41 96 49Q96 57 86 57L76 58Q69 68 56 67Q40 68 30 60Q15 62 5 81Z":spiny?"M6 75L8 68L7 64L13 64L14 58L20 60L24 54L29 57Q42 46 59 50Q70 51 75 47Q84 42 91 47Q98 51 94 57Q86 63 76 58Q61 72 40 64L27 68L23 72L19 69L15 74L12 72Z":toadhead?"M5 80Q15 59 31 55Q42 49 58 53Q68 53 74 47Q82 39 91 45Q97 50 95 56Q89 64 77 59Q57 72 38 64Q21 62 5 80Z":"M5 80Q14 58 29 54Q44 45 61 51Q71 53 77 46Q87 40 94 46Q99 51 95 56Q87 62 77 58Q60 70 41 64Q22 61 5 80Z")
   +detail(p("M22 61Q37 51 54 56Q64 61 75 54Q65 66 49 63Q34 56 22 61Z",light,"none",0))
   +limb(komodo?"M36 61Q27 66 29 75L22 82Q21 85 28 84L39 78Q44 74 46 65Z":"M37 61Q30 65 31 73L24 80Q23 83 28 82L39 76L45 63Z",c)
   +limb(komodo?"M64 62Q61 73 70 78L79 83Q85 84 82 80L74 72L76 60Z":"M63 61Q61 71 68 76L77 81Q82 81 79 77L72 70L73 60Z",c)
   +toes("M24 82L18 85M28 82L24 88M33 80L32 86M77 81L78 87M81 81L87 85M73 79L71 84M40 38L39 33M44 38L48 34M72 37L76 32",ink,1.4)
   +eyes(komodo?89:88,komodo?47:monitor?44:48,1.8)
   +detail(line(komodo?"M87 55Q93 56 96 52":monitor?"M87 52L95 50":"M87 56L95 53",dark,1.3)
    +(ocel?spots([[39,55],[49,59],[59,56]],2.3,accent("#b8c894"))
     :monitor?spots(bengal?[[31,55],[40,52],[48,56],[56,53],[67,57]]:[[38,54],[48,58],[59,55]],bengal?1.3:1.5,mid):""));
  if(spiny)art+=detail(line("M10 71L13 62M16 68L18 60M23 65L24 58",dark,2.6));
  if(toadhead)art+=detail(line("M77 49Q84 44 90 48",light,2));
 }else return null;
 return '<svg viewBox="0 0 100 100" aria-hidden="true" data-herp-family="'+family+'" data-herp-morph="'+morph+'" data-herp-version="3.19.2b">'
  +(skin==="alfa"?'<g data-herp-aura="true" opacity=".16">'+circle(50,50,42,"#f7da81")+'</g>':"")
  +'<g data-herp-anatomy="true">'+art+'</g></svg>';
}
root.ATLAS_HERP_ART_V3192=render;
if(typeof module!=="undefined"&&module.exports)module.exports={renderHerp:render,classifyHerp:classify};
})(typeof globalThis!=="undefined"?globalThis:this);

/* El Gran Atlas 3.19.3 — atlas ornitológico vectorial.
 * Taxón → familia visual → morfología → plumaje. Solo dibujo, sin estado.
 * Contorno 2.4 u, detalles 1.3–1.7 u, viewport común a 56/80/120 px.
 */
(function(root){
'use strict';
const families={
 'eagle':'Águilas y pigargos',
 'osprey':'Águilas pescadoras',
 'falcon':'Halcones y cernícalos',
 'accipiter':'Gavilanes y azores',
 'kite':'Milanos',
 'buzzard':'Busardos',
 'vulture':'Buitres',
 'bearded-vulture':'Quebrantahuesos',
 'secretary':'Ave secretaria',
 'horned-owl':'Búhos',
 'barn-owl':'Lechuzas',
 'little-owl':'Mochuelos',
 'robin':'Petirrojos y collalbas',
 'tit':'Herrerillos y carboneros',
 'finch':'Pinzones y camachuelos',
 'thrush':'Mirlos y zorzales',
 'lark':'Alondras',
 'waxwing':'Ampelis',
 'oriole':'Oropéndolas',
 'corvid':'Córvidos',
 'flycatcher':'Mosqueros del paraíso',
 'bulbul':'Bulbules',
 'rockfowl':'Picatartes',
 'vanga':'Vangas',
 'weaver':'Tejedores',
 'duck':'Patos',
 'swan':'Cisnes',
 'goose':'Gansos',
 'cormorant':'Cormoranes',
 'coot':'Fochas',
 'grebe':'Somormujos y zampullines',
 'heron':'Garzas',
 'stork':'Cigüeñas',
 'crane':'Grullas',
 'flamingo':'Flamencos',
 'ibis':'Ibis',
 'jacana':'Jacanas',
 'pelican':'Pelícanos',
 'shoebill':'Picozapatos',
 'penguin':'Pingüinos',
 'puffin':'Frailecillos',
 'gannet':'Alcatraces',
 'oystercatcher':'Ostreros',
 'peafowl':'Pavos reales',
 'pheasant':'Faisanes',
 'monal':'Monales',
 'tragopan':'Tragopanes',
 'grouse':'Urogallos y gallos lira',
 'partridge':'Perdices y lagópodos',
 'parrot':'Loros e inseparables',
 'hornbill':'Cálaos',
 'turaco':'Turacos',
 'roller':'Carracas',
 'bee-eater':'Abejarucos',
 'hoopoe':'Abubillas',
 'kingfisher':'Martines pescadores',
 'woodpecker':'Pájaros carpinteros',
 'ostrich':'Avestruces'
};
const genera={
 osprey:'Pandion',vanga:'Cyanolanius',weaver:'Ploceus',gannet:'Morus',oystercatcher:'Haematopus',woodpecker:'Dendrocopos Dryobates Picus Dryocopus',eagle:'Aquila Haliaeetus Icthyophaga Ichthyophaga Pithecophaga Circaetus Polemaetus',falcon:'Falco',accipiter:'Accipiter Astur',kite:'Milvus',buzzard:'Buteo',vulture:'Gyps Torgos Neophron', 'bearded-vulture':'Gypaetus',secretary:'Sagittarius',
 'horned-owl':'Bubo Asio','barn-owl':'Tyto','little-owl':'Athene',robin:'Erithacus Larvivora Oenanthe',tit:'Cyanistes Parus',finch:'Fringilla Pyrrhula',thrush:'Turdus',lark:'Alauda',waxwing:'Bombycilla',oriole:'Oriolus',corvid:'Corvus Garrulus Perisoreus Pica Cyanopica',flycatcher:'Terpsiphone',bulbul:'Pycnonotus',rockfowl:'Picathartes',
 duck:'Aix Spatula Anas',swan:'Cygnus',goose:'Cyanochen Anser Branta',cormorant:'Phalacrocorax',coot:'Fulica',grebe:'Podiceps Tachybaptus',heron:'Ardea Egretta',stork:'Ciconia',crane:'Grus Anthropoides Leucogeranus Balearica',flamingo:'Phoenicopterus Phoeniconaias',ibis:'Geronticus Threskiornis',jacana:'Actophilornis',pelican:'Pelecanus',shoebill:'Balaeniceps',penguin:'Spheniscus',puffin:'Fratercula',
 peafowl:'Pavo',pheasant:'Phasianus Chrysolophus Lophura Syrmaticus',monal:'Lophophorus',tragopan:'Tragopan',grouse:'Tetrao Lyrurus',partridge:'Alectoris Lagopus Lerwa',parrot:'Psittacus Coracopsis Agapornis',hornbill:'Buceros Rhinoplax Bucorvus Bycanistes Ceratogymna',turaco:'Tauraco Musophaga Corythaeola',roller:'Coracias','bee-eater':'Merops',hoopoe:'Upupa',kingfisher:'Alcedo Corythornis Ceryle',ostrich:'Struthio'
};
const byGenus=Object.fromEntries(Object.entries(genera).flatMap(([f,gs])=>gs.toLowerCase().split(' ').map(g=>[g,f])));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const names=[
 ['osprey',/^aguila pescadora$/],['vanga',/\bvanga\b/],['weaver',/\btejedor\b/],['gannet',/\balcatraz\b/],['oystercatcher',/\bostrero\b/],['woodpecker',/\b(pico picapinos|pajaro carpintero)\b/],['bearded-vulture',/\bquebrantahuesos\b/],['secretary',/\bave secretaria\b/],['hornbill',/\bcalao\b/],['barn-owl',/\blechuza\b/],['little-owl',/\bmochuelo\b/],['horned-owl',/\bbuho\b/],['falcon',/\b(halcon|cernicalo)\b/],['accipiter',/\b(gavilan|azor)\b/],['vulture',/\bbuitre\b/],['kite',/\bmilano\b/],['buzzard',/\bbusardo\b/],['eagle',/\b(aguila|pigargo)\b/],
 ['peafowl',/\bpavo (real|verde)\b/],['monal',/\bmonal\b/],['tragopan',/\btragopan\b/],['pheasant',/\bfaisan\b/],['grouse',/\b(urogallo|gallo lira)\b/],['partridge',/\bperdiz\b/],['puffin',/\bfrailecillo\b/],['penguin',/\bpinguino\b/],['shoebill',/\bpicozapato\b/],['flamingo',/\bflamenco\b/],['jacana',/\bjacana\b/],['ibis',/\bibis\b/],['crane',/\bgrulla\b/],['stork',/\bciguena\b/],['heron',/\bgarza\b/],['pelican',/\bpelicano\b/],['swan',/\bcisne\b/],['duck',/\bpato\b/],['goose',/\bganso\b/],['cormorant',/\bcormoran\b/],['coot',/\bfocha\b/],['grebe',/\b(somormujo|zampullin)\b/],['ostrich',/\bavestruz\b/],
 ['parrot',/\b(loro|inseparable|guacamayo)\b/],['turaco',/\bturaco\b/],['roller',/\bcarraca\b/],['bee-eater',/\babejaruco\b/],['hoopoe',/\babubilla\b/],['kingfisher',/\bmartin pescador\b/],['rockfowl',/\bpicatartes\b/],['corvid',/\b(cuervo|urraca|arrendajo|rabilargo)\b/],['flycatcher',/\bmosquero del paraiso\b/],['bulbul',/\b(bubul|bulbul)\b/],['robin',/\b(petirrojo|collalba)\b/],['tit',/\b(herrerillo|carbonero)\b/],['finch',/\b(pinzon|camachuelo)\b/],['thrush',/\b(mirlo|zorzal)\b/],['lark',/\balondra\b/],['waxwing',/\bampelis\b/],['oriole',/\boropendola\b/]
];
function classify(sp){
 if(!sp)return null;
 const latin=norm(sp.latin).trim(),genus=latin.split(/\s+/)[0];
 if(byGenus[genus])return byGenus[genus];
 // An identified non-avian taxon takes precedence over ambiguous common words.
 if(latin)return null;
 if(['fish','ray','small','cat','canid','deer','reptile','lizard','snake','salamander','tortoise','mustelid','primate','rhino'].includes(sp.kind))return null;
 return (names.find(([,re])=>re.test(norm(sp.name)))||[])[0]||null;
}
function tint(c,n){return '#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(c.slice(i,i+2),16)+n)).toString(16).padStart(2,'0')).join('');}
// Natural plumage blocks: body / wing / head / breast / bill. Morphology is separate.
const palettes={
 osprey:['#776c51','#4c5846','#e4e3ce','#eeead1','#7f8b72'],vanga:['#608d9e','#477487','#79a0aa','#dfe2cd','#6e8582'],weaver:['#c4b25c','#8f9256','#3b4d38','#dece72','#626d4d'],gannet:['#e1e4d4','#becbbf','#d5c79c','#eae7d4','#a8b5a4'],oystercatcher:['#3c4b46','#2c3e39','#37473e','#4b5b4d','#c68059'],woodpecker:['#3f4e46','#2f413a','#e8e4d0','#e5dec8','#7d8976'],eagle:['#765b40','#4b4037','#8c714c','#ac9169','#c6a44d'],falcon:['#6e7d84','#465865','#64727b','#ded5b9','#a99b5d'],accipiter:['#7c8383','#536366','#607479','#d9cdb3','#bda853'],kite:['#a77953','#655246','#8d8b80','#ba946c','#c5a85b'],buzzard:['#806c50','#594a3b','#887456','#d9c7a5','#c4a652'],vulture:['#a58b6d','#625443','#c0b192','#c6b397','#999077'],'bearded-vulture':['#bd986b','#3e484c','#e3cd9d','#d8ac77','#6f716b'],secretary:['#bbc1bb','#394448','#c5c6bb','#e7e1cb','#bfb78b'],
 'horned-owl':['#9e8060','#66594b','#a68b68','#d9c4a0','#a69b7c'],'barn-owl':['#c4ac85','#9a896e','#d8c9ac','#efe5ce','#c5b194'],'little-owl':['#998464','#6e624d','#a38e69','#e0ceac','#c1b47d'],robin:['#918372','#716b5d','#95816b','#ce8654','#625c4e'],tit:['#829c7c','#557b9c','#4e7f9e','#dfc86a','#575b50'],finch:['#a18b79','#505c64','#7c8790','#c28c7a','#a59c84'],thrush:['#8d7960','#655b4b','#89775c','#dfcdb0','#b29a65'],lark:['#a38c67','#806e52','#ac926c','#e0caa0','#978265'],waxwing:['#aa9281','#605d59','#b08e78','#c6ac93','#5c5b53'],oriole:['#d2b94f','#3e4b42','#d8c052','#e6d07b','#aa7951'],corvid:['#b2957d','#668a9e','#aa917b','#d3c2a8','#5a5a50'],flycatcher:['#e2dbca','#9c9b91','#303c3c','#eee7d8','#6f7670'],bulbul:['#847d6a','#5b6056','#343d36','#bcb59c','#626455'],rockfowl:['#a3a7a0','#677577','#8f927e','#e3dfc8','#8c866c'],
 duck:['#bc9569','#7c6a51','#4b806d','#e4d3b4','#565d50'],swan:['#e6e4d7','#c4c8bd','#eeebdf','#f6efe0','#d29759'],goose:['#a09d8b','#788f97','#aaa693','#d7cdb2','#4c5551'],cormorant:['#414e4c','#303e40','#3a4946','#697265','#a39359'],coot:['#505c55','#394640','#424c44','#646f63','#e0ddc9'],grebe:['#8b8d7c','#58665f','#766451','#e6dcc5','#b19b72'],heron:['#a5b1b2','#74898d','#d7dad0','#ddd9c8','#c8aa62'],stork:['#e5e3d3','#3c4946','#ebe6d4','#f4e9d1','#bc7856'],crane:['#b8bcb2','#7c8b87','#b6beb2','#d4d9c9','#a79770'],flamingo:['#d7a9a0','#bd8886','#e0b7aa','#efc8b7','#dbb8a2'],ibis:['#d8d9ca','#3a514e','#414a45','#e5e3cd','#5d6660'],jacana:['#a8784e','#6a6244','#333f36','#b98b57','#b5a65c'],pelican:['#e4dfcb','#adb7ad','#eee7d3','#f1e7d0','#c8ae72'],shoebill:['#929f9a','#657d7c','#9ba7a1','#bbc5b9','#b5ad89'],penguin:['#34484b','#273a3f','#263b40','#ede6ce','#50594d'],puffin:['#3e4b4c','#2c3c40','#344648','#ece7d6','#d29452'],
 peafowl:['#497b8e','#6e8467','#377d95','#568c9c','#b8a679'],pheasant:['#a17853','#786146','#487361','#c9a16d','#c0b186'],monal:['#397e81','#5e6f8b','#468d78','#456f8a','#b0ab85'],tragopan:['#bd7856','#935e48','#bd6545','#d5a78a','#c4b08a'],grouse:['#455654','#334747','#3f4a43','#526f60','#b9b69b'],partridge:['#b7a085','#8a7c64','#a79b82','#e0ccad','#b87d5b'],parrot:['#979f98','#737f78','#a8b2a7','#bbc0ac','#555f55'],hornbill:['#3e4b46','#2c3b38','#36453f','#e4dfc5','#d6bb77'],turaco:['#65966e','#4f7e67','#6c9c6c','#83ab6f','#b87855'],roller:['#619795','#517b9d','#789b8b','#98bca5','#626f62'],'bee-eater':['#779c78','#4b8d85','#86a17b','#d7be69','#666d58'],hoopoe:['#bd956c','#494f48','#c8a175','#ddbd8e','#7f7963'],kingfisher:['#57918f','#427d87','#498b91','#c4935f','#6a7970'],ostrich:['#50574d','#e2dbc5','#bbb49a','#e3d7b9','#bfa585']
};
const speciesPaint={
 'Falco peregrinus':['#758b89','#455f5e','#4f6c66','#e2dcc0','#b3a566'], 'Bubo scandiacus':['#e1e0cc','#b9c3b2','#e8e7d3','#efead4','#6f7e66'], 'Haliaeetus leucocephalus':['#665c48','#405044','#e5e5d1','#e2ddc1','#c7b46d'], 'Circaetus gallicus':['#a09678','#6e7864','#aaab8d','#e9e2c4','#8b997c'], 'Polemaetus bellicosus':['#6e7863','#465b4c','#5a7059','#e4e3c6','#899b7e'], 'Aquila fasciata':['#8e866a','#63745d','#968e70','#dfd9b7','#9eac7b'], 'Torgos tracheliotos':['#756959','#465347','#b38a72','#b5a084','#9c9e7c'], 'Neophron percnopterus':['#ddd9c1','#4b5c4e','#c6b36d','#e8e1c3','#a99c6a'], 'Gyps africanus':['#9c8c70','#5f6552','#c3ba9b','#ded4b4','#9e9e77'], 'Ceryle rudis':['#d8dece','#4b665b','#cfdbca','#e9e6d1','#6d8372'], 'Egretta garzetta':['#e6e9d8','#becfc1','#e2e9d6','#eee8d2','#5c7366'], 'Musophaga violacea':['#606989','#4b517b','#755b83','#7e7998','#c1a06a'], 'Corythaeola cristata':['#5d8c8f','#507887','#588182','#8aabb0','#b4aa74'], 'Ceratogymna atrata':['#394d40','#2e4235','#bca866','#d7d1a7','#b6a76d'], 'Coracias caudatus':['#99a5a0','#5a8da0','#9eada1','#b996aa','#7a8980'], 'Anser caerulescens':['#e0e3d3','#53685a','#e6e5d0','#eae5cf','#b48e73'], 'Corvus corax':['#3d5049','#2c423c','#3a5147','#4d6253','#5c6e5b'], 'Struthio molybdophanes':['#4b5a4f','#dedfcc','#8daba8','#d4dcca','#a9b7a4'],
 'Falco cherrug':['#9b8867','#74664f','#a48f6b','#e1d5b5','#a99a65'], 'Falco eleonorae':['#666e69','#414f4b','#59685f','#b9b59e','#a79a61'], 'Falco rusticolus':['#d3d8c9','#a6b5ac','#d9ddcc','#ebe6ce','#8e9e89'], 'Falco tinnunculus':['#b28d65','#846c55','#85968c','#d9c3a0','#a49a62'], 'Falco araeus':['#a88a67','#7b6c54','#a38f6e','#d4c09c','#9b925d'], 'Accipiter gentilis':['#88958c','#5e746d','#748a7d','#ddd9bc','#afa464'], 'Accipiter nisus':['#839389','#576f69','#758c7f','#cbbb98','#b9ac67'], 'Pelecanus crispus':['#d8ddd0','#a3b3aa','#d7ddcf','#e9e4d0','#c6a375'], 'Pelecanus philippensis':['#c9d0bf','#95a99c','#d2d8c8','#e5deca','#b5a882'], 'Pelecanus onocrotalus':['#e7decb','#c0c6b7','#ece1cb','#eedcc4','#d1b573'], 'Lerwa lerwa':['#a5927c','#7b7461','#ab9e86','#cfbaa0','#b28468'],
 'Haliaeetus pelagicus':['#514c41','#343d3a','#4b4b3d','#f1e6ca','#d9b857'], 'Haliaeetus albicilla':['#887963','#606052','#b3ad91','#c5bea4','#cbbb67'], 'Icthyophaga vocifer':['#9a7760','#3b4b42','#f0e9d2','#eee5c8','#c8ac55'], 'Haliaeetus vociferoides':['#7d6955','#3e4b44','#dfd9c1','#d0c6aa','#b5a45d'], 'Pithecophaga jefferyi':['#876e51','#574e40','#bba783','#e4d6b7','#7c8b87'],
 'Leucogeranus leucogeranus':['#e1e3d4','#c1ccc0','#dcdccc','#efead4','#ba8868'], 'Anthropoides virgo':['#b0bbb2','#6f817b','#4f6057','#bfc8ba','#a69b73'], 'Grus nigricollis':['#b4b8a9','#6d7d70','#3e5148','#c9cbb7','#aaa37b'], 'Grus japonensis':['#e1e3d4','#3f554c','#414f44','#e7e7d0','#b0a681'], 'Ciconia boyciana':['#e2e3d3','#3d4f48','#e5e5d5','#ece9d2','#596453'], 'Lophophorus lhuysii':['#596d84','#4b5978','#608b84','#6d6380','#b4ae8b'], 'Alectoris rufa':['#b59a7c','#8e7b62','#b9a892','#e0c7a2','#b97d62'], 'Alectoris graeca':['#aca490','#877f67','#b9baa3','#ded7b8','#ba8466'],
 'Turdus merula':['#3a4440','#2c3935','#343f37','#465247','#d3ad53'], 'Pyrrhula pyrrhula':['#93928a','#394843','#35423e','#c67f79','#5b5b50'], 'Parus major':['#93a07a','#566e67','#35443d','#ddca72','#5c6553'], 'Oenanthe deserti':['#c2ae83','#897c61','#b8a481','#ead8b5','#655f4c'], 'Larvivora akahige':['#997e62','#766653','#b98c5f','#d5925d','#71634a'],
 'Perisoreus infaustus':['#a29780','#8c7760','#8d8575','#c4b59b','#5d5e50'], 'Pica serica':['#3b4e49','#365f64','#334640','#eee8d3','#5a6256'], 'Cyanopica cooki':['#b6b09b','#729aab','#354540','#e3dac5','#5c6254'], 'Cyanopica cyanus':['#b5b8aa','#6d9ead','#374948','#e5e1cb','#586259'],
 'Aix galericulata':['#b89269','#8f6252','#47765f','#e1d4ad','#b56e53'], 'Cygnus cygnus':['#e5e5d5','#bec9c0','#eeeada','#f1ebd8','#ccba68'], 'Geronticus eremita':['#424f49','#314940','#b18368','#566351','#b58a6b'], 'Ardea goliath':['#909d9e','#5e777d','#ac7d57','#bd956e','#aaa078'], 'Ciconia nigra':['#435d57','#304e49','#46675b','#e6dfc3','#b6745b'], 'Balearica regulorum':['#8f9d98','#5b706f','#4b5b53','#bdc4af','#aeaa83'], 'Phoeniconaias minor':['#c9959a','#b37b87','#d3a0a3','#e8b8b7','#986b72'],
 'Chrysolophus pictus':['#bd7250','#648578','#d4b75c','#ca805b','#c4ae73'], 'Lophura nycthemera':['#deded0','#b4beb5','#3c5149','#4b6454','#c3a56b'], 'Syrmaticus soemmerringii':['#a57c58','#896247','#a67c55','#c0976c','#b9a785'], 'Pavo muticus':['#61906f','#6f8e71','#67a17e','#7eae8b','#c4b77c'], 'Lagopus muta':['#e1e1d2','#bec6b6','#e7e4d5','#eee8d5','#737a62'], 'Lagopus lagopus':['#e1ddd1','#c6b5a2','#a5805c','#eee1c9','#8a8068'],
 'Buceros bicornis':['#3e4841','#2a3b35','#c7b98a','#e3dfbf','#d2be6e'], 'Rhinoplax vigil':['#756c51','#4a5949','#93684e','#d8c8a0','#bd9d65'], 'Bucorvus leadbeateri':['#3a4940','#2b3c33','#4c5140','#475847','#646c52'], 'Bycanistes bucinator':['#3a4941','#293a34','#34443c','#eee4c7','#9a8c71'], 'Agapornis lilianae':['#80a476','#619268','#d79e73','#b5b879','#d19b6c'], 'Coracopsis barklyi':['#5c685c','#434f46','#5d695d','#798471','#b0ac89'], 'Merops nubicus':['#bd7d78','#9d6666','#5c9c96','#d3988b','#716b5c'], 'Merops orientalis':['#8eae73','#679e78','#99b772','#bdd08b','#63755b']
};
function render(sp,color,skin='normal',sex=null){
 const family=classify(sp);if(!family)return null;
 const latin=sp.latin||'',t=norm(sp.name),female=sex==='female';
 let colors=(speciesPaint[latin]||palettes[family]).slice();
 // Adult females retain the markings and palette of their own taxon.
 const femalePaint={
 'Pavo cristatus':['#998673','#6d6659','#6c9071','#d6c6ad','#a99b7d'],
 'Aix galericulata':['#9c9687','#696e66','#8c9086','#d5d2bf','#777c75'],
 'Spatula clypeata':['#a18b68','#756a54','#aa9571','#d5c2a0','#a68d56'],
 'Tetrao urogallus':['#a07d59','#715c45','#9a7857','#b97449','#a79973'],
 'Lyrurus tetrix':['#9a8767','#6e6350','#a59475','#c4b08b','#807e66'],
 'Phasianus colchicus':['#ad9777','#7e6c53','#a49273','#cfbc96','#b5a87c'],
 'Chrysolophus pictus':['#b19a76','#7c654b','#a78c69','#c6b08c','#a99e7e'],
 'Lophura nycthemera':['#8e7156','#65523e','#897356','#b39c79','#a99776'],
 'Fringilla coelebs':['#9b9b7d','#666f5d','#92967a','#c0b69b','#9b997b'],
 'Lophophorus impejanus':['#a79171','#695c4a','#8d8069','#cebe9e','#a8a58b'],
 'Lophophorus lhuysii':['#81745e','#514d40','#817961','#b8ad90','#989d88'],
 'Tragopan satyra':['#997657','#635343','#8e735c','#b29a7b','#a79c7e'],
 'Struthio camelus':['#928b7c','#b7af9e','#aa9a8d','#aca598','#ad9a80']};
 if(female&&femalePaint[latin])colors=femalePaint[latin];
 if(sex==='male'&&latin==='Struthio camelus')colors=['#343934','#e5e1d4','#b3a396','#ded9c8','#b4a18b'];
 if(sex==='male'&&latin==='Lophophorus impejanus')colors=['#446b78','#596295','#47816b','#343f44','#aaa387'];
 if(sex==='male'&&latin==='Tragopan satyra')colors=['#b95943','#8e4e3c','#353b36','#b8654a','#a79c7e'];
 if(female&&latin==='Pyrrhula pyrrhula')colors=['#9b9283','#526053','#292d2d','#baac97','#676c59'];
 if(female&&latin==='Turdus merula')colors=['#8e8068','#685f4b','#8a7b63','#c4af8e','#b3a171'];
 if(female&&family==='oriole')colors=['#9aa67a','#687e64','#8c9e6d','#d4d5a1','#ad8b61'];
 const natural=skin==='normal'||skin==='alfa';
 const paint=h=>natural?h:skin==='albino'?tint('#ddd5d6',Math.round((parseInt(h.slice(1,3),16)-110)/9)):tint('#26312f',Math.round((parseInt(h.slice(1,3),16)-110)/13));
 let [c,w,h,b,bill]=colors.map(paint);
 if(!natural&&/^#[0-9a-f]{6}$/i.test(color||''))c=skin==='albino'?paint('#e8e2db'):paint('#3d4945');
 const ink=natural?'#39483f':skin==='albino'?'#807779':'#19241f',light=paint('#eee7cf'),dark=paint('#34483f'),red=paint('#bf755d'),gold=paint('#d2b771'),blue=paint('#678f9f');
 const eye=skin==='albino'?'#c85f6c':skin==='melanico'?'#d8c46b':'#23352d';
 const p=(d,f=c,s=ink,z=2.4)=>'<path d="'+d+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+z+'" stroke-linecap="round" stroke-linejoin="round"/>';
 const line=(d,col=w,z=1.5)=>p(d,'none',col,z);
 const dot=(x,y,r,f)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"/>';
 const detail=a=>'<g data-bird-detail="true">'+a+'</g>';
 const eyes=(x,y,r=1.9)=>detail(dot(x,y,r+.7,light)+dot(x,y,r,eye)+dot(x+.5,y-.55,.55,light));
 const feet=(d,z=2.5)=>line(d,paint('#8f8566'),z);
 const wing=(d)=>p(d,w,ink,1.8);
 const feather=d=>detail(line(d,tint(w,natural?22:5),1.4));
 const speckle=(pts,col=w)=>detail(pts.map(([x,y])=>p('M'+x+' '+y+'l-1 3 3-1Z',col,'none',0)).join(''));
 let art='',morph=family,flip=false;
 // Raptors: continuous shoulder, neck and cranium; no head-on circular template.
 if(['osprey','eagle','falcon','accipiter','kite','buzzard','vulture','bearded-vulture'].includes(family)){
  const osprey=family==='osprey',phil=latin==='Pithecophaga jefferyi',steller=latin==='Haliaeetus pelagicus',golden=latin==='Aquila chrysaetos',beard=family==='bearded-vulture',vult=family==='vulture',fal=family==='falcon',acc=family==='accipiter',kite=family==='kite';
  morph=phil?'philippine-crest':steller?'steller-heavy-bill':golden?'golden-nape':vult?(/Torgos/.test(latin)?'lappet-faced':/Neophron/.test(latin)?'egyptian-vulture':'griffon-neck'):beard?'bearded-wedge':fal?(/tinnunculus|araeus/.test(latin)?'kestrel':'pointed-falcon'):acc?(/gentilis/.test(latin)?'goshawk':'sparrowhawk'):family;
  const tail=/Neophron/.test(latin)?'M33 62L12 87L35 80L48 65Z':osprey?'M33 62L15 86Q24 90 34 83L46 64Z':fal&&/tinnunculus|araeus/.test(latin)?'M35 61L17 88L29 88L47 64Z':acc&&/nisus/.test(latin)?'M34 61L12 89Q21 94 29 89L47 64Z':family==='buzzard'?'M32 65L21 78Q31 85 45 78L49 65Z':golden?'M33 63L17 83Q28 89 42 81L50 65Z':beard?'M34 63Q22 73 9 89L34 81L45 67Z':kite?'M33 62L12 86L27 80L34 90L45 66Z':acc?'M34 62L15 85Q21 91 32 88L48 64Z':fal?'M36 62L22 84L38 81L49 63Z':'M33 63L20 81Q30 87 43 80L51 66Z';
  art=p(tail,w)+feet('M48 73L46 86L40 87M59 70L61 84L68 86',fal?2.6:3.2);
  art+=p(osprey?'M27 61Q30 44 48 44L55 32Q61 22 72 27Q81 32 77 42L68 52Q71 69 55 77Q34 80 27 68Z':/Neophron/.test(latin)?'M26 60Q26 44 47 43L56 31Q59 22 69 24Q80 27 76 37L69 46Q76 63 62 74Q42 83 27 70Z':vult?'M26 62Q25 46 45 43Q55 42 57 32Q57 20 67 20Q78 21 76 30Q71 34 68 41L70 52Q76 68 62 76Q40 84 28 72Z':phil?'M26 62Q29 43 50 44L55 32Q57 21 68 23Q80 24 78 36L71 47Q76 64 64 75Q41 84 28 72Z':family==='buzzard'?'M25 61Q25 45 47 43L53 33Q58 25 69 27Q80 28 77 40L70 48Q78 66 61 77Q38 83 25 70Z':golden?'M25 61Q25 42 48 41L54 29Q59 20 71 23Q82 27 79 40L71 49Q79 68 61 79Q37 86 25 71Z':fal&&/peregrinus/.test(latin)?'M27 61Q32 45 50 43L57 31Q64 24 74 30Q82 36 77 45L68 53Q68 69 52 76Q35 80 27 67Z':fal&&/rusticolus/.test(latin)?'M26 61Q28 47 48 43L54 31Q61 22 73 27Q83 32 79 43L70 53Q72 70 54 77Q35 81 26 68Z':fal&&/eleonorae/.test(latin)?'M27 60Q33 47 51 44L59 33Q66 26 74 32Q81 37 76 45L67 54Q64 69 50 76Q35 78 27 66Z':fal?'M27 61Q31 48 49 44L57 33Q64 24 74 30Q82 36 75 45L68 53Q66 70 53 76Q37 79 27 68Z':acc&&/nisus/.test(latin)?'M28 59Q34 47 52 46L58 34Q65 27 74 34Q80 40 74 47L66 55Q68 69 53 76Q35 79 28 65Z':acc?'M26 60Q32 46 51 45L56 32Q63 24 74 31Q81 38 74 46L67 53Q70 69 55 76Q34 80 26 67Z':'M25 61Q27 43 49 43L55 30Q60 21 70 24Q81 27 78 39L71 48Q77 67 62 77Q40 85 27 72Z');
  art+=detail(p(vult?'M57 35Q62 41 69 35L69 49L58 50Z':beard?'M56 34Q65 28 75 34L70 50Q72 65 60 74L47 71Q61 57 56 34Z':'M56 33Q64 26 75 32L72 45L63 50Q60 41 56 33Z',h,'none',0));
  if(osprey||/Haliaeetus leucocephalus|Circaetus/.test(latin))art+=detail(p('M55 32Q60 23 71 27L77 36L70 47L61 49L57 41Z',h,'none',0));
  if(osprey)art+=detail(line('M59 32L74 35',dark,3.2));
  if(/Neophron/.test(latin))art+=p('M57 25L49 26L54 33L49 36L58 38Z',light,ink,1.3);
  if(/Torgos/.test(latin))art+=detail(p('M60 25Q68 19 74 26L72 34L63 39L58 34Z',red,'none',0));
  if(golden)art+=detail(p('M55 33Q55 25 65 25L62 39L55 45Z',gold,'none',0));
  if(/Aquila (adalberti|heliaca)/.test(latin))art+=detail(p('M30 49Q36 44 45 46L41 54L32 58Z',light,'none',0));
  if(steller)art+=detail(p('M28 52Q32 44 45 45L43 56L30 62Z',light,'none',0)+p('M26 77L36 72L43 79L30 83Z',light,'none',0));
  art+=wing(osprey?'M36 49Q51 43 62 53Q57 69 28 79L33 62Z':fal?'M40 48Q53 44 62 50Q58 66 29 77Q35 57 40 48Z':acc?'M37 49Q53 44 61 55Q58 66 39 69Q32 62 37 49Z':vult?'M34 49Q51 42 62 54Q58 72 33 73Q27 62 34 49Z':'M35 49Q48 42 62 54Q58 69 32 75Q29 64 35 49Z')+feather('M36 61Q45 66 54 57M33 68Q43 71 53 64');
  const beak=steller?'M75 31Q95 27 93 40L86 47L86 39L76 41Z':vult?'M74 25Q88 22 86 34L81 38L81 32L74 32Z':fal?'M75 34Q87 31 85 41L80 45L80 39L75 40Z':'M76 31Q90 29 88 40L83 44L83 38L76 39Z';
  art+=p(beak,bill,ink,1.8)+eyes(vult?68:70,vult?25:32,1.7)+detail(line('M63 29L71 29',w,1.8));
  if(fal)art+=detail(p('M69 38L71 47L67 45L65 37Z',dark,'none',0));
  if(fal&&/cherrug|tinnunculus|araeus|rusticolus/.test(latin))art+=speckle([[62,49],[64,55],[59,60],[57,66]],w);
  if(/Polemaetus|Circaetus/.test(latin))art+=speckle([[63,53],[61,59],[58,65],[54,72]],w);
  if(acc||family==='buzzard')art+=detail(line('M62 54l4 1M58 60l7 1M55 66l7 1M25 78l9 2',w,1.7));
  if(vult&&!/Neophron/.test(latin))art+=p('M55 40Q62 45 71 38L74 44Q62 52 53 46Z',b,ink,1.4);
  if(beard)art+=p('M72 38L73 48L68 44L65 36Z',dark,ink,1.3)+detail(line('M59 32L72 34',dark,2.8));
  if(phil)art+=p('M56 32Q49 25 48 18L57 23L56 14L63 23L68 15L69 25Z',h,ink,1.7);
  flip=kite||acc;
 }else if(family==='secretary'){
  art=p('M36 53L17 81L33 76L43 54Z',w)+feet('M43 60L40 77L39 91L31 93M55 60L60 77L62 90L69 92',3)+p('M29 48Q35 37 53 39L58 24Q57 15 66 15Q76 15 74 25L68 33L66 48Q66 61 50 65Q32 65 29 48Z')+wing('M34 44Q47 39 55 48L51 60Q39 57 34 44Z')+p('M71 20Q85 19 82 29L77 32L77 27L72 27Z',bill,ink,1.7)+p('M59 17L46 9L53 21L43 18L55 27L47 27L59 30Z',dark,ink,1.3)+detail(p('M64 18L73 21L70 28L64 26Z',red,'none',0))+eyes(68,21,1.5)+feather('M38 49L49 55');
 }else if(['horned-owl','barn-owl','little-owl'].includes(family)){
  const snowy=latin==='Bubo scandiacus',barn=family==='barn-owl',little=family==='little-owl',long=latin==='Asio otus';morph=barn?'heart-disc':little?'compact-brow':long?'long-eared':'eagle-owl';
  art=p(little?'M36 71L34 82L63 82L62 70Z':'M37 72L35 88L64 88L63 72Z',w)+feet(little?'M39 74L38 84L32 85M59 75L61 84L67 85':'M40 78L38 89L32 90M59 78L62 89L68 90');
  art+=p(snowy?'M24 44Q23 26 44 23Q65 21 75 37L73 53Q81 73 63 83Q43 91 27 76Q20 62 24 44Z':little?'M24 48Q23 31 42 30Q65 27 75 42Q81 60 68 73Q50 84 32 73Q21 64 24 48Z':barn?'M30 48Q22 30 34 22Q48 16 63 22Q79 27 72 47Q79 65 64 80Q49 90 35 78Q24 65 30 48Z':long?'M29 48Q23 27 43 24Q64 21 73 38L70 54Q78 72 62 82Q45 89 32 77Q23 66 29 48Z':'M26 45Q24 26 45 24Q66 22 76 38L72 53Q79 73 62 82Q43 89 29 75Q22 63 26 45Z');
  art+=wing(little?'M27 49Q39 52 37 67L29 69Q23 60 27 49Z':'M30 49Q39 54 38 75L30 71Q25 60 30 49Z')+wing(little?'M71 48Q61 53 63 68L70 67Q77 58 71 48Z':'M70 48Q60 55 61 76L69 71Q76 59 70 48Z');
  if(!barn&&!little&&!snowy)art+=p(long?'M29 34L26 10L40 26M59 25L72 10L70 36Z':'M27 34L24 18L40 26M59 26L77 18L73 38Z',h,ink,1.8);
  art+=detail(p(barn?'M50 33C29 13 24 36 34 49L50 63L65 49C78 33 68 15 50 33Z':little?'M27 41Q38 31 49 42Q61 31 72 41L66 56L50 59L32 55Z':'M29 39Q38 29 49 39Q62 28 71 39Q75 56 51 62Q27 57 29 39Z',b,ink,1.5));
  art+=detail(line(little?'M30 40L42 42M57 42L69 38':'M32 36L43 40M57 40L68 35',h,2.1))+eyes(39,barn?39:44,barn?2.5:little?2.6:3)+eyes(61,barn?39:44,barn?2.5:little?2.6:3)+p(barn?'M48 44Q50 43 52 44L50 54Z':'M47 50L53 50L50 58Z',bill,ink,1.2)+speckle([[42,65],[52,68],[60,63],[46,75],[56,77]],w)+feather('M31 58L34 66M67 58L64 67');
 }else if(['vanga','weaver','robin','tit','finch','thrush','lark','waxwing','oriole','corvid','flycatcher','bulbul','rockfowl','roller','bee-eater','hoopoe','kingfisher','turaco','parrot'].includes(family)){
  const tit=family==='tit',bull=/Pyrrhula/.test(latin),black=latin==='Turdus merula',jay=/Garrulus|Perisoreus/.test(latin),mag=/Pica |Cyanopica/.test(latin),raven=/Corvus/.test(latin),long=mag||family==='flycatcher'||family==='bee-eater'||family==='turaco',king=family==='kingfisher',bee=family==='bee-eater',parrot=family==='parrot',hoop=family==='hoopoe',rock=family==='rockfowl',lark=family==='lark',slim=bee||family==='oriole'||family==='flycatcher',heavy=bull||raven||parrot;
  morph=tit?(latin==='Parus major'?'great-tit':'blue-tit'):family==='finch'?(bull?'bullfinch':'chaffinch'):family==='thrush'?(black?'blackbird':'spotted-thrush'):family==='corvid'?(raven?'raven':mag?(/Pica /.test(latin)?'magpie':'azure-magpie'):latin==='Perisoreus infaustus'?'siberian-jay':'eurasian-jay'):family==='robin'?(latin==='Oenanthe deserti'?'wheatear':latin==='Larvivora akahige'?'japanese-robin':'european-robin'):king?(/Corythornis/.test(latin)?'malachite-kingfisher':'common-kingfisher'):parrot?(/Agapornis/.test(latin)?'lovebird':/Coracopsis/.test(latin)?'seychelles-parrot':'grey-parrot'):family;
  art=p(black?'M32 59L9 82L34 76L44 64Z':family==='roller'?'M33 60L17 75L36 74L43 63Z':long?(family==='flycatcher'?'M34 59Q14 67 6 89Q26 83 41 66L35 93L44 71Z':bee?'M32 60L8 82L20 77L13 88L41 66Z':'M33 59L6 87Q21 88 42 66L35 82L47 64Z'):king?'M32 61L22 75L38 69Z':heavy?'M32 62L17 80Q25 85 42 70Z':lark?'M32 61L15 70L34 73L43 65Z':'M32 60L15 77L36 72L43 63Z',parrot&&/Psittacus/.test(latin)?red:w);
  art+=feet(rock?'M47 66L42 86L34 88M57 66L64 84L73 86':king?'M45 70L44 80L38 82M56 69L57 80L63 81':lark?'M45 72L40 85L29 85M55 71L61 83L69 82':tit?'M46 69L43 82L37 83M56 68L60 80L65 81':'M46 71L43 84L36 85M57 71L61 83L67 83',tit||bee?2:2.5);
  art+=p(family==='weaver'?'M28 60Q28 45 46 43Q48 29 60 28Q76 27 78 41L70 54Q73 70 54 77Q35 80 28 67Z':family==='vanga'?'M25 59Q30 45 50 44L55 32Q62 25 73 30Q81 35 77 46L68 55Q67 69 50 75Q32 78 25 65Z':family==='roller'?'M24 59Q28 43 48 43L54 33Q60 27 70 30Q80 33 79 43L69 54Q69 68 52 75Q32 79 24 65Z':family==='thrush'?(black?'M25 59Q28 44 49 43L54 31Q61 24 72 29Q82 34 79 45L70 54Q73 71 54 78Q31 81 25 66Z':'M26 60Q29 45 49 43L54 30Q62 24 72 31Q81 37 77 46L69 55Q71 69 54 77Q33 81 26 67Z'):king?'M28 60Q32 47 50 46Q48 35 58 30Q74 24 78 39L73 51Q72 65 58 72Q40 77 29 67Z':parrot?'M28 60Q28 44 49 42Q49 26 63 25Q80 26 79 40Q76 49 68 51Q74 69 56 76Q35 79 28 66Z':tit&&latin==='Parus major'?'M26 58Q29 43 47 42Q47 29 60 28Q75 27 78 39Q80 50 68 54Q69 69 53 74Q34 78 26 65Z':tit?'M28 58Q32 45 48 44Q49 31 61 31Q74 29 77 40Q79 50 68 54Q68 67 54 72Q37 74 28 64Z':heavy?'M26 60Q27 43 49 44Q49 30 63 28Q79 28 79 41Q77 51 69 54Q69 71 53 77Q32 79 26 66Z':slim?'M25 58Q35 46 52 46L58 34Q65 27 74 33Q82 40 75 47L68 53Q65 66 51 71Q34 75 25 64Z':rock?'M27 55Q35 41 53 42L60 26Q66 19 75 26Q83 34 76 43L68 51Q65 65 51 69Q35 71 27 62Z':lark?'M26 62Q30 49 50 47L56 36Q64 29 73 36Q80 44 73 50L68 56Q68 71 51 76Q32 79 26 68Z':'M27 60Q30 45 49 44Q50 30 63 29Q77 28 79 41Q79 50 69 54Q68 69 54 75Q34 79 27 67Z');
  art+=detail(p(king?'M54 40L66 46L72 43L68 59Q64 70 54 73L43 68Q57 56 54 40Z':bee?'M58 41L73 42L69 51L56 50Z':parrot?'M59 32Q69 25 76 34L73 47L62 49Q55 41 59 32Z':'M53 46Q61 54 71 44L68 59Q64 73 50 75L40 69Q54 60 53 46Z',b,'none',0));
  art+=detail(p(king?'M52 35Q62 25 72 31L77 40L64 40L57 45Z':'M51 40Q52 29 65 30Q77 30 78 41L69 47Q61 49 51 40Z',h,'none',0));
  if(tit||black||bull||mag||raven||family==='weaver')art+=detail(p(tit?'M56 39Q63 35 72 41L72 48L65 51L59 47Z':mag?'M54 48L66 47L65 61L53 70L44 66Z':'M55 34L71 32L77 41L67 48L55 43Z',tit?light:mag?light:h,'none',0));
  art+=wing(family==='roller'?'M29 50Q44 42 60 53Q54 68 31 69Q25 62 29 50Z':slim?'M30 54Q46 45 60 53Q48 63 29 67Q26 60 30 54Z':parrot?'M31 49Q47 42 58 56Q51 70 33 71Q28 62 31 49Z':tit?'M31 52Q45 44 57 54Q49 66 31 66Q28 59 31 52Z':heavy?'M30 51Q45 43 59 56Q52 71 32 71Q27 62 30 51Z':'M31 53Q44 45 59 55Q49 69 30 69Q27 61 31 53Z')+feather('M34 59Q45 61 52 54M32 65L48 61');
  if(tit||family==='finch'||family==='waxwing'||family==='oriole')art+=detail(line('M34 54L48 58M33 61L43 64',light,2.5));
  if(tit&&latin==='Parus major')art+=detail(p('M62 51L65 55L58 73L53 75L57 58Z',dark,'none',0));
  if(jay&&latin!=='Perisoreus infaustus')art+=detail(p('M34 54L43 53L48 63L38 65Z',blue,'none',0)+line('M35 56L44 57M37 60L46 61',light,1.3));
  if(!black&&family==='thrush'||lark||female&&['finch','thrush'].includes(family))art+=speckle([[58,56],[63,59],[55,64],[60,68]],w);
  if(family==='waxwing'||family==='bulbul'||lark||family==='turaco')art+=p(family==='turaco'?'M52 33Q48 20 57 16L61 22L66 15Q72 22 71 32Z':family==='waxwing'?'M52 36L45 21Q61 24 67 31Z':lark?'M53 37L55 28L64 33Z':'M54 35L56 21L66 30Z',h,ink,1.6);
  if(hoop)art+=p('M54 33Q37 27 40 14Q57 10 71 31Z',h,ink,1.8)+detail(line('M43 18L48 23M50 15L55 22M58 18L62 24',dark,3)+line('M33 54L48 57M31 61L43 64',light,3));
  if(family==='turaco'&&/Musophaga/.test(latin))art+=detail(p('M55 31L60 24L69 29L71 35L62 36Z',gold,'none',0));
  if(family==='roller'&&/caudatus/.test(latin))art+=p('M29 65L9 87L18 84L23 73Z',blue,ink,1.3);
  if(family==='turaco')art+=detail(line('M60 39L73 40',light,2.5)+line('M63 44L72 43',red,2));
  if(bee||family==='waxwing'||family==='oriole'||latin==='Oenanthe deserti')art+=detail(line('M61 39L75 41',dark,3.7));
  const beak=family==='weaver'?'M75 39L87 43L76 49Z':family==='vanga'?'M76 39Q90 36 88 44L84 49L82 44L76 46Z':parrot?'M75 36Q89 32 86 43L81 49L80 42L75 43Z':hoop?'M76 41Q91 44 96 57Q85 48 75 46Z':bee?'M76 39Q88 39 96 44L76 44Z':king?'M75 39L97 39L76 46Z':bull?'M75 40Q87 37 86 44L77 48Z':raven?'M76 38Q92 36 93 45L77 47Z':family==='finch'?'M76 40L87 44L77 49Z':'M76 41L88 43L77 48Z';
  art+=p(beak,bill,ink,1.6)+eyes(70,king?36:parrot?35:rock?31:39,tit?1.6:1.8);
  if(king&&/Ceryle/.test(latin))art+=speckle([[34,55],[41,60],[48,55],[44,67]],light)+detail(line('M59 31L54 26L61 27L64 23L69 29',dark,2));
  if(king&&/Corythornis/.test(latin))art+=p('M52 35L50 26L56 29L58 22L63 29L68 24L71 32Z',h,ink,1.4);
  if(king)art+=detail(line('M58 46L64 45',light,2.6));
  if(rock)art+=detail(p('M58 27L64 23L69 28L65 36L57 36Z',red,'none',0));
  flip=['tit','finch','corvid','hoopoe','turaco','roller','bulbul'].includes(family);
 }else if(['duck','swan','goose','cormorant','coot','grebe'].includes(family)){
  const swan=family==='swan',duck=family==='duck',mand=latin==='Aix galericulata',corm=family==='cormorant',grebe=family==='grebe',small=latin==='Tachybaptus ruficollis';morph=swan?(latin==='Cygnus olor'?'mute-swan':'whooper-swan'):duck?(mand?'mandarin-sails':'shoveler-bill'):grebe?(small?'little-grebe':'crested-grebe'):family;
  art=p(corm?'M30 65L10 88L39 76Z':'M28 63L14 58L23 72L37 74Z',w)+feet(corm?'M45 76L44 87L34 89L45 91L51 87M59 75L64 86L73 88L63 91L58 86':'M44 76L40 84L49 83M59 76L64 82L70 81',2.3);
  art+=p(swan?'M19 62Q21 49 43 50Q57 52 65 44Q76 34 65 26Q53 18 61 10Q69 4 77 12Q82 19 75 23Q87 40 74 57Q70 77 45 79Q22 80 19 67Z':corm?'M22 64Q27 52 48 51L57 31Q54 19 63 16Q73 13 77 22Q80 28 72 31L69 52Q77 69 59 77Q36 81 22 69Z':grebe&&!small?'M20 64Q27 53 50 53L57 35Q55 24 65 23Q77 22 79 33L70 46L69 60Q67 77 44 77Q23 78 20 69Z':family==='goose'?'M20 62Q25 48 49 49L57 31Q56 21 66 20Q77 19 79 30L70 44L69 58Q74 72 55 79Q30 82 20 69Z':small?'M25 65Q28 54 49 54L57 44Q60 36 70 40Q80 43 77 52L68 59Q68 73 51 77Q30 80 25 69Z':'M18 64Q22 49 48 51L56 40Q58 31 69 32Q81 33 81 44L73 55Q72 74 51 79Q28 83 18 69Z');
  art+=detail(p(swan?'M65 13Q71 8 77 15L73 24Q84 40 70 54L66 51Q78 36 65 26Z':corm?'M59 22L71 19L74 29L67 33L66 51L58 53Z':small?'M56 46Q68 37 75 46L71 56L60 59Z':'M56 43Q60 33 71 34Q79 35 79 45L71 55L59 52Z',h,'none',0));
  art+=wing(swan?'M24 61Q28 45 44 43L42 51L52 45Q54 56 64 61Q51 75 25 71Z':'M27 59Q42 49 62 61Q55 73 28 73Q23 67 27 59Z')+feather('M30 64Q44 67 56 61M30 70Q42 73 52 68');
  if(duck&&mand&&!female)art+=p('M43 62Q44 45 55 41Q62 53 59 66Z',gold,ink,1.6)+detail(p('M59 35L54 28Q68 25 77 38L64 39Z',red,'none',0)+line('M60 44L69 48L76 42',light,3)+p('M60 49L63 57L70 54L66 46Z',red,'none',0)+line('M29 60L39 64M29 66L37 69',light,2.4));
  if(duck&&mand&&female)art+=detail(dot(68,36,4,light)+dot(68,36,2.3,w)+line('M70 37L77 39',light,1.8)+line('M62 39L70 40',light,2.2)+line('M58 43L63 42',light,1.8));
  if(duck&&(!mand||female))art+=detail(p('M27 68Q40 66 51 72L49 78Q35 79 27 73Z',female?b:red,'none',0));
  const beak=swan?'M76 15L91 19L78 24L74 21Z':corm?'M75 23L93 24Q98 25 94 31L91 33L91 28L75 29Z':duck&&!mand?'M79 43Q91 39 96 44L96 51Q89 57 77 51Z':duck?'M79 42L92 44Q92 49 79 50Z':family==='coot'?'M77 44L91 45L78 52Z':grebe?'M76 33L93 31L78 39Z':'M77 29L89 31L78 37Z';
  art+=p(small?'M75 46L86 47L76 52Z':beak,bill,ink,1.6)+eyes(swan?72:corm?69:grebe&&!small?70:72,swan?14:corm?22:grebe&&!small?30:small?45:39,1.6);
  if(family==='coot')art+=p('M70 35Q79 29 80 42L76 48L71 44Z',light,ink,1.3);
  if(grebe&&!small)art+=p('M57 29L51 18L64 25L72 19L77 30Z',dark,ink,1.5)+detail(line('M59 37L62 46L70 42',red,3));
  if(swan&&latin==='Cygnus olor')art+=p('M76 14Q82 10 83 18L78 21Z',dark,ink,1.2);
  if(corm&&/capensis/.test(latin))art+=detail(p('M70 28L78 27L75 33L69 34Z',gold,'none',0));
  if(corm)art+=detail(p('M70 28L78 28L73 35L68 33Z',gold,'none',0));
  flip=swan||family==='goose'||family==='coot';
 }else if(['heron','stork','crane','flamingo','ibis','jacana','pelican','shoebill','ostrich'].includes(family)){
  const heron=family==='heron',crane=family==='crane',flam=family==='flamingo',ibis=family==='ibis',jac=family==='jacana',pel=family==='pelican',shoe=family==='shoebill',ost=family==='ostrich',crown=latin==='Balearica regulorum';morph=crown?'crowned-crane':latin==='Grus carunculata'?'wattled-crane':latin==='Geronticus eremita'?'bald-ibis':latin==='Ardea goliath'?'goliath-heron':flam?(latin==='Phoeniconaias minor'?'lesser-flamingo':'greater-flamingo'):family;
  const legs=flam?'M42 59L38 92L31 94M54 60L60 77L48 83L52 92':jac?'M44 64L40 80L22 89M40 80L43 94M40 81L54 90M57 64L63 79L80 87M63 79L70 92M63 79L85 78':ost?'M38 65L36 79L32 92L24 93M56 64L60 78L61 92L69 94':pel?'M41 74L38 86L30 89L42 89L46 84M58 73L63 84L73 89L61 90L57 85':'M41 62L37 91L30 93M55 62L60 90L67 92';
  art=feet(legs,ost?3.8:jac?1.9:pel?2.8:2.5)+p(ost?'M28 40L14 37L17 48L31 52Z':heron?'M31 55L15 68L35 65Z':'M30 53L17 66L36 64Z',w);
  art+=p(flam?'M28 49Q28 39 44 38Q55 38 58 46Q61 33 71 29Q78 25 73 19Q65 11 74 8Q84 6 86 16Q88 23 81 27Q68 34 65 48Q64 62 48 64Q29 65 28 53Z':heron?'M24 51Q30 37 48 40L60 35Q68 31 61 27Q50 22 59 14Q68 7 77 16L76 25L66 28Q79 35 69 48L65 59Q46 71 27 61Z':crane?'M23 49Q29 37 48 39L59 33L60 17Q58 9 67 9Q77 10 77 18L70 25L69 45Q72 58 54 65Q32 68 23 56Z':ibis?'M24 51Q29 39 49 40L56 29Q56 17 66 16Q77 17 77 27L69 38L67 53Q65 66 43 66Q27 66 24 57Z':jac?'M25 54Q32 44 50 44L57 31Q60 25 68 29Q77 32 75 40L68 46Q68 62 51 68Q32 70 25 59Z':pel?'M19 58Q22 43 49 45L58 36Q54 23 63 16Q75 10 81 20Q85 28 77 32L73 49Q79 68 58 77Q32 82 19 65Z':shoe?'M21 53Q26 38 48 42L57 29Q55 14 67 13Q81 12 82 25L76 38L70 56Q68 70 48 72Q29 72 21 60Z':ost?'M20 48Q22 30 43 31Q57 30 63 40Q75 29 68 18Q62 7 73 7Q83 7 83 17L77 23Q87 42 68 54Q64 70 43 70Q21 68 20 54Z':'M23 50Q29 38 48 40L59 33L60 19Q58 10 67 10Q77 10 78 20L71 28L70 47Q73 61 54 66Q32 69 23 57Z');
  art+=detail(p(heron?'M60 17Q69 10 75 17L73 24L61 25Z':ost?'M69 12L78 10L81 16L74 23Q82 41 65 50L60 46Q75 33 69 23Z':flam?'M76 11Q83 8 84 16L79 25L73 23Z':'M59 21Q60 13 69 13L76 20L72 28L64 31Z',h,'none',0));
  art+=wing(ost?'M26 44Q43 35 57 49Q49 65 26 60Z':flam?'M32 47Q42 41 53 49L48 59Q36 62 32 47Z':'M29 48Q45 39 61 52Q53 64 30 61Q26 55 29 48Z')+feather('M32 53Q43 58 54 51M33 59L48 58');
  if(ost)art+=detail(p('M28 46Q40 39 52 48L50 55Q38 60 29 56Z',female?w:light,'none',0));
  const beak=flam?'M84 18Q95 17 94 26L88 33L82 29L86 24L82 23Z':ibis?'M76 22Q96 25 94 45Q90 31 75 28Z':pel?'M79 24L98 31Q97 48 83 50L74 34Z':shoe?'M79 24Q94 19 97 28L96 43L83 46L76 36Z':jac?'M74 35L90 38L74 41Z':ost?'M81 14L92 17L81 20Z':'M76 19L97 23L76 27Z';
  art+=p(beak,bill,ink,1.8)+eyes(ost?77:flam?81:heron?70:shoe?74:pel?73:jac?69:70,ost?13:flam?15:heron?17:shoe?22:pel?22:jac?32:18,1.6);
  if(flam)art+=detail(p('M89 24L94 24L88 33L83 30Z',dark,'none',0));
  if(heron&&/Egretta/.test(latin))art+=p('M58 39Q51 46 47 59L42 66Q52 61 64 45Z',light,ink,1.2);
  if(heron)art+=line('M63 15L51 10M64 18L50 15',dark,1.8)+detail(line('M61 36L64 49M58 39L60 52',w,1.3));
  if(ibis&&latin==='Geronticus eremita')art+=p('M58 27L48 25L53 33L47 32L56 40L62 32Z',w,ink,1.5);
  if(crown)art+=p('M59 13L48 9L57 7L55 3L64 7L67 2L71 8L81 4L77 12Z',gold,ink,1.3)+detail(p('M64 24L70 24L69 31L65 31Z',red,'none',0));
  if(crane&&!crown)art+=detail(p('M63 12Q69 7 74 13L72 16L64 15Z',red,'none',0));
  if(latin==='Grus carunculata')art+=p('M65 24L64 36L69 31L71 24Z',light,ink,1.3);
  if(shoe)art+=detail(line('M81 34L94 32M92 40L96 38',w,1.5))+p('M58 21L52 16L57 15L55 11L63 15Z',h,ink,1.3);
  if(crane&&latin==='Anthropoides virgo')art+=p('M60 19L54 28L48 28L57 22Z',light,ink,1.2);
  if(crane&&latin==='Leucogeranus leucogeranus')art+=detail(p('M65 14L75 15L76 23L69 24L65 21Z',red,'none',0))+eyes(70,18,1.6);
  if(pel&&latin==='Pelecanus crispus')art+=p('M61 19L56 13L62 14L62 8L68 13L72 9L74 16Z',h,ink,1.3);
  if(pel&&latin==='Pelecanus philippensis')art+=detail(dot(85,32,1.1,w)+dot(91,33,1.1,w)+dot(87,38,1.1,w));
  if(pel&&latin==='Pelecanus onocrotalus')art+=detail(line('M68 21L75 23',red,3.8))+eyes(73,22,1.6);
  if(pel)art+=detail(p('M79 32L96 32Q94 46 84 47Z',gold,'none',0)+line('M80 30L96 31',ink,1.4));
  flip=heron||ibis||jac;
 }else if(family==='hornbill'){
  const casquet=latin==='Ceratogymna atrata',rhino=latin==='Buceros rhinoceros',great=latin==='Buceros bicornis',helmet=latin==='Rhinoplax vigil',ground=latin==='Bucorvus leadbeateri';
  morph=rhino?'upturned-rhinoceros-casque':great?'great-hornbill-casque':helmet?'helmeted-streamers':ground?'ground-hornbill':'trumpeter-casque';
  art=p(helmet?'M37 60Q20 69 8 92L29 82L23 94L44 69Z':ground?'M32 56L12 74L35 70Z':'M34 59L11 85Q24 88 42 69Z',w)
   +feet(ground?'M43 66L40 88L31 91M57 66L63 88L72 91':'M45 72L42 86L35 88M58 71L62 85L69 87',ground?3.5:2.6)
   +p(ground?'M24 52Q28 38 47 39L53 25Q57 18 66 22Q75 25 73 37L68 48Q74 64 55 71Q32 74 24 59Z':'M25 58Q28 43 47 43L52 30Q53 20 64 20Q76 21 76 34L70 48Q74 66 56 77Q34 81 25 65Z');
  art+=detail(p(helmet?'M55 31L63 25L72 33L67 48L58 52Z':ground?'M56 26L66 24L71 34L65 43L56 38Z':'M53 27Q61 20 70 26L73 38L62 46L54 40Z',ground?red:h,'none',0));
  if(ground)art+=p('M62 40Q66 39 68 43L65 53L61 51Z',red,ink,1.3);
  if(!ground)art+=detail(p('M34 72L43 66L49 72L39 79Z',light,'none',0)+p('M17 79L28 75L32 81L23 86Z',light,'none',0));
  art+=wing(ground?'M29 46Q43 38 57 51Q51 65 29 64Q24 55 29 46Z':'M30 50Q43 41 59 55Q50 69 30 70Q25 61 30 50Z')+feather('M33 57Q44 61 53 52M31 65L47 61');
  art+=p(ground?'M70 29Q90 24 96 36L90 46L72 45L80 37L70 36Z':helmet?'M73 31Q92 26 96 37L94 45L74 43Z':'M73 30Q91 24 97 37Q97 50 74 48L69 41Z',bill,ink,2);
  if(rhino)art+=p('M64 30Q71 22 73 12Q81 9 83 17Q82 25 77 31Z',red,ink,1.8);
  else if(great)art+=p('M62 28Q63 16 75 16Q90 14 93 28L77 33Z',gold,ink,1.8)+detail(p('M75 17L89 19L93 27L84 27Z',dark,'none',0));
  else if(helmet)art+=p('M65 23Q73 17 80 23L82 33L71 34Z',red,ink,1.7);
  else if(casquet)art+=p('M59 26Q59 12 72 14Q88 12 91 29L75 33Z',dark,ink,1.8);
  else if(!ground)art+=p('M63 25Q73 12 82 20L88 30L74 32Z',bill,ink,1.8);
  art+=eyes(ground?64:65,ground?27:28,1.8)+detail(line(ground?'M78 38L92 36':'M77 39L94 37',w,1.4));
  flip=helmet||ground;
 }else if(family==='puffin'||family==='penguin'){
  const puff=family==='puffin',horn=latin==='Fratercula corniculata';morph=puff?(horn?'horned-puffin':'atlantic-puffin'):'african-penguin';
  art=feet(puff?'M39 76L33 86L45 85L48 80M58 75L61 84L73 85L63 89L57 84':'M40 82L32 90L47 89M58 82L64 90L74 89',3)+p(puff?'M30 58Q26 41 39 35Q40 20 55 19Q73 17 77 34L72 49Q76 65 63 78Q45 87 32 74Q28 67 30 58Z':'M32 56Q31 41 39 34Q37 17 51 13Q68 9 73 25Q77 33 69 42L71 63Q77 81 59 88Q39 91 30 76Q25 66 32 56Z');
  art+=detail(p(puff?'M45 39Q56 43 67 36L69 54Q71 73 56 78Q38 82 36 65L41 49Z':'M44 39Q52 45 63 38L66 60Q72 81 55 84Q37 85 35 68L39 49Z',b,'none',0));
  art+=wing(puff?'M31 45Q40 43 45 52Q44 67 32 71Q26 60 31 45Z':'M32 43Q38 41 41 48Q39 66 23 78Q24 55 32 43Z');
  if(!puff)art+=wing('M66 44Q77 49 82 69L73 65L66 53Z')+detail(line('M41 49Q54 55 65 48',dark,3)+dot(48,65,1.7,w)+dot(57,71,1.4,w));
  art+=detail(p(puff?'M48 26Q60 18 70 28L72 40L59 46L47 38Z':'M44 23Q54 14 65 21L68 31L60 37L55 29L45 35Z',light,'none',0));
  art+=p(puff?'M70 30Q85 24 91 38L86 47L69 43Z':'M68 27L86 31L70 36Z',bill,ink,1.8)+eyes(puff?62:60,puff?30:23,1.9);
  if(puff)art+=detail(line('M78 31L78 42M84 34L84 43',light,1.6)+line('M59 34L63 37',dark,1.2));
  if(horn)art+=p('M60 28L63 20L66 29Z',dark,ink,1.2);
  flip=!puff;
 }else if(family==='gannet'){
  morph='cape-gannet-flight';
  art=p('M40 58Q24 50 6 23Q17 25 26 33L51 48L58 55Z',c)+p('M53 50Q68 26 91 13Q85 32 70 49L61 60Z',c)
   +detail(p('M6 23L17 26L29 43L21 41Z',dark,'none',0)+p('M91 13L85 29L74 39L79 26Z',dark,'none',0))
   +p('M39 57L22 83L42 75L53 63Z',w)+p('M36 57Q43 44 57 48L65 42Q72 35 80 41Q87 48 79 53L66 57Q58 70 44 69Q35 66 36 57Z')
   +detail(p('M65 43Q72 36 79 42L82 48L73 53L66 50Z',h,'none',0))+p('M81 44L98 45L82 50Z',bill,ink,1.7)+eyes(76,43,1.6)
   +feather('M17 32L38 53M83 24L63 49M38 62L30 73');
  flip=true;
 }else if(family==='oystercatcher'){
  morph='african-oystercatcher';
  art=feet('M43 70L40 88L33 90M57 69L64 85L72 86',2.8)+p('M30 59L12 70L34 73L43 61Z',w)
   +p('M23 59Q26 44 48 44L55 33Q61 25 72 30Q83 35 78 46L69 54Q73 69 54 76Q32 80 23 66Z')
   +wing('M28 51Q45 42 59 55Q51 69 28 69Q23 61 28 51Z')+feather('M32 58L49 56M31 64L45 62')
   +p('M77 37L98 39L98 44L77 46Z',bill,ink,1.6)+detail(dot(70,36,3,red))+eyes(70,36,1.6);
 }else if(family==='woodpecker'){
  morph=/Dryocopus/.test(latin)?'pileated-woodpecker':'great-spotted-woodpecker';
  art=p('M37 65L32 91L46 78L53 62Z',w)+feet('M51 62L60 69L66 66M60 69L65 75M54 72L61 77L66 74M61 77L65 82',2.3)
   +p('M30 59Q29 45 46 39L49 26Q53 16 65 20Q79 23 77 35L69 45Q72 61 58 75Q42 85 33 73Q28 67 30 59Z')
   +detail(p('M51 25Q59 18 70 25L74 35L64 42L52 38Z',h,'none',0)+p('M59 43L67 44L65 59Q63 73 53 77L44 70Z',b,'none',0)+p('M42 69L56 70L52 79L42 78Z',red,'none',0))
   +wing('M33 45Q46 37 56 49Q51 66 33 72Q28 60 33 45Z')
   +detail(p('M35 47Q41 42 46 44L47 53L38 59L33 54Z',light,'none',0)+line('M35 63L43 61M34 68L40 66',light,2.2)+line('M53 32L61 35L64 44',dark,2.3)+p('M49 24L52 20L56 23L53 29Z',red,'none',0))
   +p('M75 28L94 29L76 35Z',bill,ink,1.7)+eyes(66,27,1.8);
  if(/Dryocopus/.test(latin))art+=p('M49 26L44 17L51 17L58 8Q68 14 71 23Z',red,ink,1.5)+detail(line('M51 35L62 42L63 50',light,2.5));
  flip=true;
 }else if(['pheasant','monal','tragopan','grouse','partridge','peafowl'].includes(family)){
  const pea=family==='peafowl',grouse=family==='grouse',lyre=latin==='Lyrurus tetrix',par=family==='partridge',snow=/Lagopus/.test(latin),mon=family==='monal',trag=family==='tragopan',golden=latin==='Chrysolophus pictus',silver=latin==='Lophura nycthemera',copper=latin==='Syrmaticus soemmerringii';morph=pea?(female?'peahen':latin==='Pavo muticus'?'green-peafowl':'peacock-fan'):grouse?(lyre?(female?'black-grouse-hen':'lyre-tail'):(female?'capercaillie-hen':'capercaillie-fan')):snow?(latin==='Lagopus muta'?'rock-ptarmigan':'willow-ptarmigan'):mon?(/lhuysii/.test(latin)?'chinese-monal':'himalayan-monal'):golden?'golden-pheasant':silver?'silver-pheasant':copper?'copper-pheasant':family;
  if(pea&&!female){
   // Broad scalloped fan; seven large eyespots remain readable at 56 pixels.
   art=p('M40 71C21 64 8 49 8 35Q8 24 18 24Q13 10 26 11Q32 4 40 12Q49 1 57 12Q66 4 74 12Q87 11 83 24Q94 24 93 35Q95 57 62 72Z',paint('#749775'));
   art+=detail(line('M49 66L19 31M49 66L29 20M49 66L42 17M51 66L57 17M51 66L71 20M51 66L83 32',paint('#aac18d'),1.4));
   for(const [x,y] of [[19,33],[30,23],[43,20],[57,20],[71,24],[82,34],[26,48],[75,49]])art+=detail(dot(x,y,4.3,gold)+dot(x,y,2.8,blue)+dot(x,y,1.5,dark));
   art+=feet('M44 79L41 91L34 93M56 80L59 91L66 93',2.6)+p('M37 67Q35 58 45 54L47 41Q44 33 50 30Q59 26 64 34Q68 41 59 45L62 63Q69 78 54 84Q39 86 37 67Z',c)+wing('M39 64Q48 59 53 68L48 79Q39 77 39 64Z')+p('M62 35L74 39L62 43Z',bill,ink,1.5)+eyes(58,35,1.7)+line(latin==='Pavo muticus'?'M51 30L50 15M55 29L55 13M59 30L60 16':'M51 30L48 20M55 29L56 18M59 30L63 21',blue,2)+detail(line('M58 40L62 40',light,1.8));
  }else{
   let tail=par?'M29 62L17 65L31 73L39 64Z':mon?'M29 60Q10 61 8 74Q21 81 39 68Z':trag?'M29 62L17 78Q28 83 40 68Z':pea?'M30 59Q10 67 6 84L36 76L44 63Z':grouse&&!female?(lyre?'M32 59Q11 59 10 39Q10 32 16 30Q13 48 27 49Q29 37 26 28Q40 35 38 56Z':'M34 63Q9 58 9 38Q8 25 16 23L23 29L26 21L33 28L37 26Q46 42 43 60Z'):'M34 59Q17 68 5 90Q28 85 47 65Z';
   if(female&&(golden||silver))tail=golden?'M31 60Q20 68 12 83L37 74L44 64Z':'M31 60L10 85L36 77L44 64Z';
   if(female&&grouse)tail='M31 61L13 79L36 77L43 65Z';
   art=p(tail,w)+feet(par?'M43 73L39 87L32 88M56 72L61 85L68 86':'M45 71L42 88L34 90M58 70L63 87L70 88',par?2.4:2.8);
   art+=p(snow&&latin==='Lagopus lagopus'?'M23 61Q22 43 45 42Q46 30 59 30Q74 30 76 44L72 57Q74 74 54 79Q31 83 23 67Z':par?'M24 61Q23 44 46 43Q48 33 61 33Q75 33 77 46L71 57Q72 73 54 79Q32 82 24 67Z':mon?'M23 58Q26 42 48 41L54 29Q59 22 69 26Q80 30 77 41L69 50Q72 65 56 74Q34 80 24 65Z':grouse?'M23 58Q25 39 48 42L54 29Q57 19 68 22Q81 25 77 38L69 50Q75 68 55 77Q31 81 23 65Z':trag?'M23 58Q23 39 47 40L53 30Q60 21 70 28Q80 33 75 44L68 52Q72 69 54 78Q31 82 23 65Z':'M25 56Q29 42 50 43L55 30Q61 22 71 28Q81 34 76 44L68 53Q71 67 55 75Q34 81 25 64Z');
   art+=detail(p('M54 34Q58 25 69 29L75 38L67 48L56 45Z',h,'none',0)+p('M55 48L66 48L65 62Q63 74 51 76L43 68Z',b,'none',0));
   art+=wing(par?'M29 52Q44 44 57 57Q52 70 29 70Q24 63 29 52Z':'M29 49Q45 41 59 55Q53 70 28 70Q24 61 29 49Z')+feather('M32 57Q44 62 52 53M31 64L48 61');
   art+=p(par?'M75 43L85 46L76 51Z':'M75 34Q87 32 85 40L77 44Z',bill,ink,1.5)+eyes(par?70:69,par?41:32,1.7);
   if(mon&&!female&&sex==='male'){
    if(/lhuysii/.test(latin))art+=p('M59 27Q42 10 47 7Q57 9 63 24L66 26Z',paint('#705176'),ink,1.3);
    else art+=line('M59 26L56 15M64 25L65 13',paint('#538a77'),1.9)+detail(dot(56,14,2,paint('#538a77'))+dot(65,12,2,paint('#538a77')));
    art+=detail(line('M29 69Q38 74 45 69',light,3));
   }
   if(mon&&!female&&sex!=='male')art+=line(/lhuysii/.test(latin)?'M59 26L53 11M64 25L66 7M67 26L73 13':'M59 26L56 15M64 25L65 13',blue,1.9)+detail(dot(56,14,2,blue)+dot(65,12,2,blue)+line('M29 69Q38 74 45 69',light,3));
   if(grouse&&!female)art+=detail(line('M65 27L72 28',red,3.5)+line('M31 73L42 73',light,2));
   if(golden&&!female)art+=p('M55 30Q51 19 66 20Q76 20 76 29Z',gold,ink,1.6)+p('M56 36L65 39L61 54L49 44Z',gold,ink,1.4)+detail(line('M53 39L62 43M54 44L60 47',dark,1.7));
   if(silver&&!female)art+=p('M57 28Q52 19 59 15L68 26Z',dark,ink,1.5)+detail(line('M31 54L51 58M30 61L48 64M14 81L30 74',dark,1.2));
   if(trag&&!female)art+=speckle([[34,51],[43,54],[50,59],[34,64],[45,67],[58,61]],light)+detail(p('M63 30L72 33L70 41L63 39Z',blue,'none',0));
   if(!par&&!mon&&!trag&&!grouse&&!pea)art+=detail(line('M14 83L19 86M20 76L26 80M26 70L33 74',female?b:gold,2.1));
   if(par&&!snow)art+=detail(p('M57 39Q68 31 75 40L71 48L64 49L59 44Z',light,'none',0)+line('M57 38Q58 51 69 54',dark,2.4)+line('M31 60L34 67M38 59L41 68M45 60L48 67',dark,2.3));
   if(pea&&female)art+=detail(p('M54 34Q59 27 68 31L70 42L64 50L57 46Z',paint('#709174'),'none',0))+line('M58 28L55 21M62 27L62 20',paint('#709174'),1.6)+eyes(69,32,1.7);
   if(female&&mon)art+=detail(p('M59 39L68 40L65 49L58 47Z',light,'none',0)+line(/lhuysii/.test(latin)?'M32 52L37 56M40 58L45 62M33 65L38 69':'M30 52L35 54M39 55L44 57M48 59L52 61M32 64L37 66',b,1.8));
   if(mon&&!female&&sex==='male')art+=detail(p('M54 28L62 31L57 43L51 42Z',paint('#b38b4e'),'none',0)+p(/lhuysii/.test(latin)?'M16 69L29 68L21 77L11 77Z':'M12 68L29 64L29 73L12 77Z',paint(/lhuysii/.test(latin)?'#749b91':'#a46d44'),'none',0));
   if(female&&(golden||silver||grouse))art+=detail(line(golden?'M31 52L47 58M30 58L47 64M29 65L44 69':silver?'M32 53L37 56M42 59L48 62M33 65L38 68':'M30 51L45 55M29 58L48 62M31 66L46 70',b,1.8));
   if(female||snow&&latin==='Lagopus lagopus')art+=speckle([[33,53],[42,56],[49,61],[38,65],[54,68]],w);
  }
  flip=mon||par||silver||copper;
 }
 if(!art)throw new Error('Unrendered bird family: '+family);
 const aura=skin==='alfa'?'<g data-bird-aura="true">'+dot(50,50,43,'#eed591').replace('/>',' opacity=".22"/>')+line('M15 19L18 24L24 26L18 28L15 34L13 28L7 26L13 24Z','#bd9c58',1.6)+'</g>':'';
 return '<svg viewBox="0 0 100 100" aria-hidden="true" data-bird-family="'+family+'" data-bird-morph="'+morph+'" data-bird-version="3.19.3">'+aura+'<g'+(flip?' transform="translate(100 0) scale(-1 1)"':'')+'>'+art+'</g></svg>';
}
render.classify=classify;render.families=Object.freeze(families);
root.ATLAS_BIRD_ART_V3193=render;
if(typeof module!=='undefined'&&module.exports)module.exports={classifyBird:classify,renderBird:render,BIRD_FAMILIES:render.families};
})(typeof globalThis!=='undefined'?globalThis:this);

/* El Gran Atlas 3.19.4 — mamíferos del mundo.
 * Taxón → familia → anatomía → rasgos → paleta. Sin estado ni dependencias.
 * Contornos continuos, miembros articulados con volumen y viewport de 100 u.
 */
(function(root){
'use strict';
const groups={
 felid:['Félidos','Panthera Acinonyx Puma Lynx Caracal Leptailurus Otocolobus Felis Prionailurus Catopuma Neofelis'],
 canid:['Cánidos','Canis Vulpes Cuon Lycaon Lupulella Nyctereutes Otocyon'],
 hyena:['Hienas','Crocuta Hyaena Parahyaena'],
 viverrid:['Civetas, ginetas y binturong','Civettictis Genetta Paguma Arctictis'],
 fossa:['Fosas','Cryptoprocta'],mongoose:['Mangostas y meloncillos','Herpestes Helogale Mungos'],meerkat:['Suricatas','Suricata'],
 bear:['Osos y panda gigante','Ursus Melursus Helarctos Ailuropoda'], 'red-panda':['Pandas rojos','Ailurus'],
 weasel:['Comadrejas, turones y visones','Mustela Vormela'],marten:['Martas y garduñas','Martes'],badger:['Tejones','Meles Mellivora'],wolverine:['Glotones','Gulo'],otter:['Nutrias','Lutra Lontra Enhydra Lutrogale Hydrictis'],
 deer:['Cérvidos y ciervos almizcleros','Cervus Capreolus Alces Rangifer Dama Muntiacus Moschus Hydropotes Axis Rusa Elaphurus Odocoileus'],
 gazelle:['Gacelas, impalas y antílopes ligeros','Gazella Eudorcas Procapra Antidorcas Antilope Aepyceros Pantholops Saiga'],
 gerenuk:['Gerenucs','Litocranius'], 'spiral-antelope':['Kudús, nialas, bongos y elands','Tragelaphus Taurotragus'],
 oryx:['Órices y addax','Oryx Addax'], 'horse-antelope':['Antílopes sable y ruanos','Hippotragus'],
 'small-antelope':['Dicdics y duíqueros','Madoqua Cephalophus Philantomba'],antelope:['Antílopes de humedal y nilgós','Kobus Boselaphus'],
 wildebeest:['Ñus','Connochaetes'],hartebeest:['Alcéfalos y topis','Alcelaphus Damaliscus'],
 bovine:['Bisontes, búfalos, yaks y afines','Bison Bos Bubalus Syncerus Budorcas Ovibos'],
 caprine:['Cabras, íbices, rebecos y ovejas','Capra Hemitragus Ammotragus Capricornis Pseudois Rupicapra Ovis'],
 equid:['Caballos, asnos y cebras','Equus'],tapir:['Tapires','Tapirus'],elephant:['Elefantes','Elephas Loxodonta'],rhino:['Rinocerontes','Rhinoceros Dicerorhinus Ceratotherium Diceros'],hippo:['Hipopótamos','Hippopotamus Choeropsis'],pig:['Jabalíes y suidos','Sus Phacochoerus Potamochoerus'],giraffe:['Jirafas','Giraffa'],okapi:['Okapis','Okapia'],camel:['Camellos y dromedarios','Camelus'],
 ape:['Grandes simios','Gorilla Pan Pongo'],gibbon:['Gibones y siamangs','Hylobates Nomascus Symphalangus'],macaque:['Macacos','Macaca'],baboon:['Babuinos, mandriles y geladas','Papio Mandrillus Theropithecus'],langur:['Langures y colobos','Semnopithecus Colobus Rhinopithecus'],guenon:['Cercopitecos','Cercopithecus Chlorocebus'],'proboscis-monkey':['Monos narigudos','Nasalis'],lemur:['Lémures, sifacas e indris','Lemur Varecia Microcebus Propithecus Indri'],'aye-aye':['Aye-ayes','Daubentonia'],loris:['Loris','Nycticebus'],galago:['Gálagos','Galago'],tarsier:['Tarsios','Carlito Tarsius'],
 squirrel:['Ardillas','Sciurus Spermophilus Geosciurus'],'flying-squirrel':['Ardillas voladoras','Pteromys Petaurista'],marmot:['Marmotas','Marmota'],beaver:['Castores','Castor'],vole:['Topillos y lemmings','Microtus Myodes Chionomys Lemmus Dicrostonyx'],dormouse:['Lirones','Eliomys Glis Muscardinus'],jerboa:['Jerbos','Jaculus Euchoreutes'],porcupine:['Puercoespines','Hystrix'],'mole-rat':['Ratas topo','Tachyoryctes'],lagomorph:['Liebres y conejos','Lepus Oryctolagus Pentalagus'],
 bat:['Murciélagos','Pipistrellus Eptesicus Rhinolophus'],shrew:['Musarañas','Sorex Suncus'],mole:['Topos','Talpa'],hedgehog:['Erizos','Erinaceus Atelerix'],tenrec:['Tenrecs','Tenrec'],desman:['Desmanes','Galemys Desmana'],pangolin:['Pangolines','Manis Phataginus Smutsia'],aardvark:['Cerdos hormigueros','Orycteropus'],
 cetacean:['Delfines','Sousa'],sirenian:['Dugongos','Dugong'],pinniped:['Lobos marinos','Arctocephalus']
};
const families=Object.freeze(Object.fromEntries(Object.entries(groups).map(([f,[name]])=>[f,name])));
const taxa=Object.fromEntries(Object.entries(groups).flatMap(([f,[,g]])=>g.toLowerCase().split(' ').map(t=>[t,f])));
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const excludedIds=new Set(['asia_esp_0067','eu_esp_0159','salamandra_alpina']);
const nameRules=[
 ['hyena',/\bhiena\b/],['pinniped',/\blobo marino\b/],['cetacean',/\bdelfin\b/],['sirenian',/\bdugongo\b/],['red-panda',/\bpanda rojo\b/],['tapir',/\btapir\b/],['fossa',/\bfosa\b/],['meerkat',/\bsuricata\b/],['desman',/\bdesman\b/],['aardvark',/\bcerdo hormiguero\b/],['wolverine',/\bgloton\b/],['marten',/\b(marta|garduna)\b/],['badger',/\btejon\b/],['otter',/\bnutria\b/],['mongoose',/\b(mangosta|meloncillo)\b/],['viverrid',/\b(civeta|gineta|binturong)\b/],['weasel',/\b(comadreja|armino|turon|vison)\b/],['bear',/\boso\b|\bpanda gigante\b/],['bat',/\bmurcielago\b/],['shrew',/\bmusarana\b/],['mole',/\btopo\b/],['tenrec',/\btenrec\b/],['hedgehog',/\berizo\b/],['pangolin',/\bpangolin\b/],['lagomorph',/\b(liebre|conejo)\b/],['flying-squirrel',/\bardilla voladora\b/],['squirrel',/\bardilla\b/],['beaver',/\bcastor\b/],['marmot',/\bmarmota\b/],['dormouse',/\bliron\b/],['vole',/\b(topillo|lemming)\b/],['jerboa',/\bjerbo\b/],['porcupine',/\bpuercoespin\b/],['equid',/\b(caballo|cebra|asno|onagro|kiang)\b/],['elephant',/\belefante\b/],['rhino',/\brinoceronte\b/],['hippo',/\bhipopotamo\b/],['okapi',/\bokapi\b/],['giraffe',/\bjirafa\b/],['camel',/\b(camello|dromedario)\b/],['felid',/\b(tigre|leon|leopardo|guepardo|puma|lince|caracal|serval|manul|gato montes|gato de las arenas)\b/],['canid',/\b(lobo|zorro|chacal|licaon|cuon|tanuki|fenec)\b/],['deer',/\b(ciervo|corzo|alce|reno|gamo|muntiaco)\b/]
];
function classify(sp,id){
 if(!sp||excludedIds.has(id||sp.id))return null;
 const latin=norm(sp.latin).trim();
 if(latin)return taxa[latin.split(/\s+/)[0]]||null;
 const n=norm(sp.name);if(/\b(calao|picapinos|salamandra|rana|sapo|pez|lagarto|serpiente)\b/.test(n))return null;
 return (nameRules.find(([,re])=>re.test(n))||[])[0]||({cat:'felid',canid:'canid',bear:'bear',boar:'pig',deer:'deer',bison:'bovine',camel:'camel',giraffe:'giraffe',elephant:'elephant',pangolin:'pangolin',otter:'otter',rhino:'rhino',hippo:'hippo'})[sp.kind]||null;
}
function tint(hex,n){return '#'+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(hex.slice(i,i+2),16)+n)).toString(16).padStart(2,'0')).join('');}
// Continuous anatomical profiles. Legs, tails, ears and horns share only compatible anatomy.
const outlines={
 tiger:'M21 51Q25 35 47 38Q59 36 66 38L71 31Q79 25 87 33L91 43L96 48Q97 54 90 56L79 54Q72 69 53 69L28 68Q18 64 21 51Z',
 lion:'M21 52Q24 37 46 39Q59 36 68 40L72 32Q82 28 89 38L90 47L96 51Q96 57 88 57L77 55Q70 69 51 68L28 69Q18 65 21 52Z',
 leopard:'M20 52Q24 39 44 39Q58 35 68 41L72 33Q80 28 87 35L90 44L96 49Q97 54 90 56L79 54Q73 68 53 69L27 67Q17 63 20 52Z',
 snowcat:'M23 50Q26 34 46 37Q62 33 70 41L73 33Q83 29 90 38L91 47L96 51Q95 57 87 57L77 55Q70 71 51 71L29 69Q19 63 23 50Z',
 cheetah:'M21 47Q28 33 47 40Q58 35 67 39L74 31Q82 27 88 35L90 44L96 48L94 53L83 53Q77 57 69 63Q48 58 30 66Q18 63 21 47Z',
 puma:'M20 50Q26 34 47 38Q61 36 69 41L74 32Q82 27 89 36L91 46L96 50Q97 55 89 57L79 54Q72 67 52 68L28 67Q17 63 20 50Z',
 lynx:'M22 51Q25 34 44 35Q59 33 68 39L73 29Q81 24 88 34L90 44L95 49L91 56L79 58L74 65Q55 72 29 69Q19 64 22 51Z',
 manul:'M23 54Q24 37 43 35Q61 32 72 40Q78 31 87 38L90 47L95 50L92 57L82 59Q75 74 52 74L29 70Q20 65 23 54Z',
 serval:'M25 44Q34 31 49 36Q61 33 70 38L74 27Q82 23 88 32L90 43L95 47L93 52L83 54Q76 61 58 62L31 63Q22 57 25 44Z',
 smallcat:'M23 55Q26 41 44 41Q59 38 68 43L74 35Q82 30 88 38L90 47L96 51L94 56L82 58Q72 71 53 72L30 71Q20 65 23 55Z',
 caracal:'M24 49Q28 35 46 38Q61 34 70 41L75 31Q82 26 88 35L90 45L96 50L94 56L82 57L76 53Q71 67 52 68L30 67Q20 62 24 49Z',
 sandcat:'M24 58Q26 43 44 43Q60 39 72 46Q77 35 88 41L91 49L97 53L94 60L81 63Q71 76 51 75L30 74Q20 69 24 58Z',
 fishingcat:'M22 54Q25 36 44 37Q60 34 72 43L76 35Q84 31 90 40L92 49L98 54L94 60L82 60Q71 74 50 74L28 71Q18 65 22 54Z',
 junglecat:'M25 48Q31 34 48 37Q61 34 70 40L74 29Q83 24 89 34L91 45L97 49L94 55L82 56Q74 64 55 65L31 64Q21 58 25 48Z',
 wolf:'M20 50Q26 35 47 39Q59 34 67 37L72 27Q80 24 86 32L90 42L98 46L96 53L84 55L77 52Q69 66 50 67L27 66Q17 62 20 50Z',
 fox:'M22 52Q28 39 48 42Q60 37 68 40L73 30Q80 28 85 35L88 44L98 49L94 54L82 54L76 51Q69 65 50 67L29 67Q19 63 22 52Z',
 arcticfox:'M23 53Q23 35 45 35Q59 32 70 40L74 33Q83 28 90 39L92 48L97 52L92 58L80 59Q73 73 51 73L29 70Q19 65 23 53Z',
 fennec:'M24 57Q28 43 47 43Q61 40 69 45L73 36Q81 32 87 40L90 48L98 52L94 57L82 59L77 56Q68 72 47 72L30 71Q20 66 24 57Z',
 wilddog:'M23 48Q29 34 48 37Q60 32 69 37L75 28Q83 23 89 33L91 43L98 47L96 54L84 57L76 53Q69 64 49 66L29 64Q20 59 23 48Z',
 raccoondog:'M23 55Q25 39 44 38Q62 35 73 44Q78 35 87 42L89 49L96 53L92 59L81 60Q72 74 49 75L28 71Q19 64 23 55Z',
 hyena:'M22 43Q29 28 46 33Q58 33 68 39L74 29Q82 24 90 34L92 44L98 49L96 56L84 58L76 53Q70 70 53 71Q39 69 25 63Q17 56 22 43Z',
 stripedhyena:'M22 45Q27 31 46 34Q59 35 68 41L74 31Q84 27 90 37L92 47L97 51L94 58L82 59L75 54Q68 71 51 72L27 65Q19 59 22 45Z',
 civet:'M21 56Q23 43 43 41Q60 35 71 44L77 37Q84 34 90 43L92 49L98 53L95 59L82 61L76 57Q66 73 45 73L27 72Q17 66 21 56Z',
 genet:'M22 59Q29 46 49 47Q62 41 71 48L78 40Q86 38 91 45L92 51L98 55L94 60L81 61L75 58Q65 73 46 73L28 73Q18 68 22 59Z',
 fossa:'M22 53Q28 39 47 41Q60 38 70 44L76 34Q84 30 90 40L92 48L98 52L95 58L82 60L75 56Q65 71 45 71L28 70Q18 64 22 53Z',
 weasel:'M20 65Q26 55 47 56Q64 51 74 57L79 50Q87 48 92 55L97 59L97 64L86 67L77 65Q65 75 45 76L25 75Q16 72 20 65Z',
 marten:'M22 57Q27 44 47 44Q62 38 72 45L77 37Q86 34 91 43L93 50L98 54L95 60L83 62L76 57Q65 72 46 72L28 71Q18 65 22 57Z',
 badger:'M20 56Q23 39 43 38Q60 36 73 48L82 45Q91 45 96 56L98 61L93 67L81 68L74 63Q67 77 44 76L27 73Q16 67 20 56Z',
 wolverine:'M20 52Q21 34 43 33Q62 31 75 45Q83 36 90 44L93 52L98 57L96 64L84 67L75 62Q65 77 43 77L26 73Q16 65 20 52Z',
 mongoose:'M21 61Q28 49 48 50Q64 44 75 52L81 46Q90 45 94 53L98 57L96 63L83 66L77 62Q64 75 44 76L27 74Q17 69 21 61Z',
 deer:'M20 48Q28 35 49 40L64 38L69 26Q72 19 80 23L87 33L95 41Q98 47 91 50L80 47L75 60Q67 72 47 69L28 68Q18 64 20 48Z',
 moose:'M20 45Q27 29 49 35L64 35L69 26Q77 20 85 28L88 40L96 47L96 57Q89 64 80 57L74 51L73 63Q67 74 47 70L26 68Q17 61 20 45Z',
 reindeer:'M21 49Q25 35 45 37Q59 34 68 39L71 28Q79 20 86 29L89 39L97 46L95 53L82 54L75 49Q73 68 52 72L29 70Q18 64 21 49Z',
 roe:'M25 51Q30 37 48 42L64 41L71 28Q78 23 84 30L88 41L96 47L94 53L81 53L75 49Q70 69 51 72L31 71Q21 66 25 51Z',
 muskdeer:'M22 49Q27 36 45 38Q58 36 68 44L73 34Q79 28 86 35L89 45L97 50L94 57L81 57L76 52Q71 69 48 72L28 68Q18 62 22 49Z',
 saiga:'M23 49Q29 36 48 41L62 39L69 28Q77 20 85 30L89 41Q97 43 98 53L95 62L85 63L80 56L75 49Q70 65 50 68L30 66Q21 61 23 49Z',
 gazelle:'M23 48Q29 36 48 41L62 39L70 27Q77 21 84 29L88 40L97 46L94 53L82 52L76 47Q70 64 51 66L31 65Q21 61 23 48Z',
 gerenuk:'M22 52Q29 40 48 44L59 43L63 22Q63 13 73 13Q83 14 84 24L89 31L98 35L96 42L84 41L76 34L72 54Q65 70 47 70L29 68Q18 63 22 52Z',
 kudu:'M21 46Q27 32 47 37Q60 33 68 37L72 25Q80 19 87 28L89 38L97 44L95 52L83 53L76 48Q71 68 51 69L28 66Q18 60 21 46Z',
 eland:'M20 44Q25 28 47 32Q63 29 73 39L76 29Q84 24 90 34L91 44L98 49L96 57L84 57L76 51Q72 73 49 73L26 68Q16 60 20 44Z',
 oryx:'M21 48Q27 34 47 38Q61 33 70 39L74 29Q81 24 87 32L90 42L97 47L95 54L83 54L76 49Q70 68 49 70L28 67Q18 60 21 48Z',
 dikdik:'M24 53Q25 39 43 40Q59 38 70 47L75 36Q82 30 88 39L90 48L98 53L93 59L82 59L76 55Q67 75 45 75L29 70Q20 64 24 53Z',
 antelope:'M21 47Q26 34 47 38Q61 34 70 40L74 28Q82 21 88 31L90 42L98 48L95 55L83 55L77 50Q71 70 49 71L28 67Q17 61 21 47Z',
 wildebeest:'M20 44Q25 28 46 33Q61 31 71 42L75 33Q83 27 89 36L91 48L98 55L95 63L84 65L76 58L72 68Q57 75 34 70L24 64Q17 57 20 44Z',
 hartebeest:'M22 44Q29 29 48 36Q61 34 70 43L73 26Q79 18 86 26L88 40L96 49L94 58L82 60L77 51Q70 68 49 69L29 66Q19 58 22 44Z',
 bison:'M18 49Q18 30 35 28Q44 13 59 26Q72 25 78 43L88 43Q96 44 96 57L93 66L79 67L72 59Q67 74 44 74L25 69Q15 62 18 49Z',
 buffalo:'M18 48Q21 30 46 32Q66 28 76 42L82 36Q90 35 93 45L97 52L97 62L89 67L77 63L72 57Q68 76 43 75L24 68Q15 61 18 48Z',
 yak:'M18 48Q20 30 43 31Q61 25 74 41L81 32Q90 32 93 44L97 51L96 62L85 66L76 59Q75 73 66 77L61 74L56 79L51 75L44 80L39 75L32 77L26 73Q15 64 18 48Z',
 takin:'M20 47Q21 30 43 31Q61 27 74 40L80 30Q90 28 93 42L95 52L98 57L93 64L82 64L75 58Q70 76 45 75L26 69Q16 61 20 47Z',
 caprine:'M22 49Q28 34 47 39L62 37L68 25Q75 20 83 28L87 40L96 47L94 55L82 55L75 49Q70 70 49 71L29 67Q18 61 22 49Z',
 sheep:'M21 51Q22 32 42 33Q61 28 73 40L79 32Q88 29 92 41L94 51L98 56L93 63L82 63L75 56Q69 76 45 75L27 69Q17 62 21 51Z',
 horse:'M20 47Q26 32 46 37L61 35L66 19Q70 13 78 18L82 29L88 35L95 44Q98 51 90 55L79 51L72 42L71 58Q66 71 45 70L27 65Q18 59 20 47Z',
 donkey:'M22 48Q28 34 48 39L63 37L67 24Q74 18 81 25L84 35L91 43L98 48L96 56L85 57L75 47L73 59Q67 72 46 70L29 66Q20 60 22 48Z',
 zebra:'M20 46Q25 31 46 35L61 33L66 19Q74 13 81 22L84 32L91 39L97 47L96 55L86 57L74 45L72 58Q66 72 45 70L27 64Q17 58 20 46Z',
 tapir:'M18 50Q22 31 44 32Q64 27 76 42L81 37Q91 37 94 48L97 56Q99 66 93 68L87 66L88 57L80 61L74 58Q67 76 43 75L24 69Q14 62 18 50Z',
 rhino:'M16 48Q19 29 45 30Q64 26 76 42L83 40L89 47L98 54L97 65L88 70L75 65L68 57Q63 76 40 75L23 68Q13 61 16 48Z',
 indianrhino:'M17 47Q20 29 43 29Q65 23 77 41L85 39L91 48L98 56L96 67L86 70L74 64L68 57Q63 77 39 75L23 68Q14 60 17 47Z',
 hippo:'M16 52Q17 30 43 29Q63 25 76 41L82 39Q94 38 97 51L98 63Q97 74 83 74L72 67Q65 79 42 77L23 71Q13 64 16 52Z',
 pygmyhippo:'M20 49Q23 32 45 33Q64 28 76 43L83 40Q94 41 96 53L97 62Q97 70 86 70L75 64Q67 77 44 75L26 68Q17 60 20 49Z',
 pig:'M20 52Q24 37 45 36Q62 31 73 43L80 36Q89 34 92 45L98 52L97 63L85 66L75 59Q68 75 46 74L27 68Q17 62 20 52Z',
 warthog:'M20 51Q24 35 43 35Q60 32 71 43L79 39Q92 37 95 51L98 55L97 65L85 68L74 60Q66 74 45 73L27 67Q17 61 20 51Z',
 okapi:'M22 47Q28 33 48 37L62 33L67 19Q75 13 82 20L86 31L94 38L97 45L94 52L83 50L73 39L71 58Q65 72 46 70L29 65Q20 59 22 47Z'
};
const colorByTaxon={
 'Panthera tigris':'#bd975e','Panthera leo':'#b7a16f','Panthera pardus':'#bba170','Panthera uncia':'#b8bdb0','Acinonyx jubatus':'#c4b17c','Puma concolor':'#b4a17d','Otocolobus manul':'#a3a28e','Neofelis nebulosa':'#aaa07d','Vulpes vulpes':'#bc8756','Vulpes lagopus':'#dde0d1','Vulpes zerda':'#d3be8e','Canis lupus':'#8f9b8e','Canis simensis':'#b18d64','Cuon alpinus':'#ad8055','Lycaon pictus':'#b09a6d','Crocuta crocuta':'#a79a75','Hyaena hyaena':'#ada88a','Parahyaena brunnea':'#7a7961','Arctictis binturong':'#555f50','Cryptoprocta ferox':'#a18c69','Melursus ursinus':'#50584b','Helarctos malayanus':'#5d6654','Ailuropoda melanoleuca':'#d8ddcc','Ailurus fulgens':'#ad8059','Gulo gulo':'#686950','Mellivora capensis':'#717a66','Rangifer tarandus':'#999b81','Bison bonasus':'#8c8467','Bos mutus':'#626c59','Bos gaurus':'#706f56','Syncerus caffer':'#66705d','Bubalus bubalis':'#7d8875','Bubalus arnee':'#798776','Budorcas taxicolor':'#a7a276','Ovibos moschatus':'#736e52','Equus quagga':'#d7ddcb','Tapirus indicus':'#5b6d5f','Elephas maximus':'#a3ad9b','Loxodonta africana':'#a1b09e','Loxodonta cyclotis':'#9da995','Rhinoceros unicornis':'#a5ad97','Dicerorhinus sumatrensis':'#a19479','Diceros bicornis':'#979e85','Ceratotherium simum':'#afb49e','Hippopotamus amphibius':'#a59f8b','Choeropsis liberiensis':'#8b967f','Gorilla gorilla':'#5e6d60','Gorilla beringei':'#667163','Pan troglodytes':'#66735e','Pan paniscus':'#5d6d5c','Pongo pygmaeus':'#aa845a','Mandrillus sphinx':'#7b8467','Theropithecus gelada':'#a19470','Lemur catta':'#aeb6a0','Propithecus verreauxi':'#e2dfc6','Indri indri':'#546b5a','Daubentonia madagascariensis':'#85917b','Arctocephalus pusillus':'#8b9986','Sousa plumbea':'#8faba6','Dugong dugon':'#abb7a4'
};
Object.assign(colorByTaxon,{
 'Panthera tigris':'#c18b48','Panthera leo':'#c3a064','Panthera pardus':'#c6a36b','Panthera uncia':'#c5c4bc','Puma concolor':'#b69775','Otocolobus manul':'#aaa392','Neofelis nebulosa':'#afa183','Caracal caracal':'#bc9068','Caracal aurata':'#a8794f','Felis margarita':'#cfba8d',
 'Vulpes vulpes':'#bd7c49','Vulpes lagopus':'#e5e6df','Vulpes zerda':'#d9bf8e','Canis lupus':'#9d9b91','Canis simensis':'#b2764e','Cuon alpinus':'#ad754b','Lupulella mesomelas':'#bc915f','Otocyon megalotis':'#b7a484','Crocuta crocuta':'#b19a72','Hyaena hyaena':'#b2a791','Parahyaena brunnea':'#786551',
 'Arctictis binturong':'#595851','Cryptoprocta ferox':'#ac825f','Melursus ursinus':'#59534b','Helarctos malayanus':'#514d45','Ursus thibetanus':'#494843','Ursus americanus':'#48453f','Ailuropoda melanoleuca':'#e8e4d7','Ailurus fulgens':'#b5794e','Gulo gulo':'#78654d','Mellivora capensis':'#65605a','Meles meles':'#9a958a','Meles leucurus':'#a39a8a',
 'Rangifer tarandus':'#a29882','Bison bonasus':'#8c7154','Bos mutus':'#63574a','Bos gaurus':'#716353','Syncerus caffer':'#716a5f','Bubalus bubalis':'#83827a','Bubalus arnee':'#757973','Budorcas taxicolor':'#b2a180','Ovibos moschatus':'#71604c',
 'Equus quagga':'#e7e2d4','Equus africanus':'#b0a58f','Tapirus indicus':'#545952','Elephas maximus':'#a4a8a2','Loxodonta africana':'#a5aaa3','Loxodonta cyclotis':'#979e97','Rhinoceros unicornis':'#a5a99e','Dicerorhinus sumatrensis':'#a0907a','Diceros bicornis':'#a3a393','Ceratotherium simum':'#b4b4a8','Hippopotamus amphibius':'#aa9c96','Choeropsis liberiensis':'#8f9387',
 'Gorilla gorilla':'#605f58','Gorilla beringei':'#65645c','Pan troglodytes':'#696052','Pan paniscus':'#575750','Pongo pygmaeus':'#b58251','Mandrillus sphinx':'#83705b','Theropithecus gelada':'#a08768','Nasalis larvatus':'#b19175','Lemur catta':'#b3b5aa','Varecia rubra':'#ae754d','Propithecus verreauxi':'#e8e2cf','Indri indri':'#54574f','Daubentonia madagascariensis':'#8a887a','Microcebus murinus':'#a5a18e','Colobus polykomos':'#4e5149','Cercopithecus diana':'#696858','Cercopithecus neglectus':'#898b76','Chlorocebus sabaeus':'#aaa88b',
 'Antilope cervicapra':'#726453','Gazella spekei':'#c6a77a','Gazella cuvieri':'#ae9170','Eudorcas thomsonii':'#b89a6b','Eudorcas rufifrons':'#b79468','Oryx dammah':'#ddd5bb','Oryx beisa':'#b2a38c','Addax nasomaculatus':'#d3ccb5','Hippotragus equinus':'#ab8b68','Damaliscus lunatus':'#9f7c60','Alcelaphus buselaphus':'#b18c64','Cephalophus zebra':'#bf986d','Madoqua saltiana':'#a9937c','Mungos mungo':'#ac9b80','Orycteropus afer':'#b09b83','Tachyoryctes macrocephalus':'#9c927f','Phataginus tricuspis':'#aa9c7f',
 'Arctocephalus pusillus':'#8e8578','Sousa plumbea':'#a2b3b6','Dugong dugon':'#b0b8ad'
});
function morphology(sp,f){
 const l=sp.latin||'',g=l.split(' ')[0];
 if(f==='felid')return /tigris/.test(l)?'tiger':/leo$/.test(l)?'lion':/uncia/.test(l)?'snowcat':g==='Acinonyx'?'cheetah':g==='Puma'?'puma':g==='Lynx'?'lynx':g==='Otocolobus'?'manul':g==='Leptailurus'?'serval':g==='Caracal'?'caracal':/margarita/.test(l)?'sandcat':/viverrinus/.test(l)?'fishingcat':/chaus/.test(l)?'junglecat':g==='Panthera'||g==='Neofelis'?'leopard':'smallcat';
 if(f==='canid')return /lagopus/.test(l)?'arcticfox':/zerda/.test(l)?'fennec':g==='Vulpes'||g==='Otocyon'?'fox':g==='Lycaon'?'wilddog':g==='Nyctereutes'?'raccoondog':'wolf';
 if(f==='hyena')return g==='Crocuta'?'hyena':'stripedhyena';
 if(f==='viverrid')return g==='Genetta'?'genet':g==='Arctictis'?'binturong':'civet';
 if(f==='bear')return g==='Ailuropoda'?'panda':g==='Helarctos'?'sun-bear':g==='Melursus'?'sloth-bear':'bear';
 if(f==='gazelle'&&g==='Saiga')return 'saiga';
 if(f==='deer')return g==='Alces'?'moose':g==='Rangifer'?'reindeer':g==='Capreolus'?'roe':/Moschus|Hydropotes|Muntiacus/.test(g)?'muskdeer':'deer';
 if(f==='spiral-antelope')return g==='Taurotragus'?'eland':'kudu';
 if(f==='small-antelope')return g==='Madoqua'?'dikdik':'duiker';
 if(f==='bovine')return g==='Bison'?'bison':g==='Budorcas'?'takin':g==='Ovibos'?'muskox':/mutus/.test(l)?'yak':/gaurus/.test(l)?'gaur':'buffalo';
 if(f==='caprine')return g==='Ovis'?'sheep':'caprine';
 if(f==='equid')return /quagga/.test(l)?'zebra':/przewalskii/.test(l)?'horse':'donkey';
 if(f==='rhino')return g==='Rhinoceros'?'indianrhino':g==='Dicerorhinus'?'hairy-rhino':g==='Diceros'?'black-rhino':'rhino';
 if(f==='hippo')return g==='Choeropsis'?'pygmyhippo':'hippo';
 if(f==='pig')return g==='Phacochoerus'?'warthog':g==='Potamochoerus'?'bushpig':'pig';
 if(f==='otter')return g==='Enhydra'?'sea-otter':'river-otter';
 if(f==='ape')return g==='Gorilla'?(/beringei/.test(l)?'mountain-gorilla':'gorilla'):g==='Pongo'?'orangutan':/paniscus/.test(l)?'bonobo':'chimpanzee';
 if(f==='baboon')return g==='Mandrillus'?'mandrill':g==='Theropithecus'?'gelada':'baboon';
 if(f==='lemur')return g==='Propithecus'?'sifaka':g==='Indri'?'indri':g==='Microcebus'?'mouse-lemur':g==='Varecia'?'ruffed-lemur':'ring-tailed-lemur';
 return f;
}
// Anatomical proportions, curated by taxon. Values alter specific anatomical regions,
// never seeded jitter or a whole-sprite resize. Related taxa retain compatible limb rigs.
// back/ventre: thorax depth; rump: trunk length; muzzle: snout; ear: pinna length.
const speciesAnatomy={
 'Martes zibellina':[-1,2,0,-1,0,'cuerpo robusto y hocico corto'],
 'Martes martes':[0,0,-1,0,1,'tronco alargado y orejas prominentes'],
 'Martes foina':[1,1,0,1,-1,'cabeza ancha y orejas cortas'],
 'Martes flavigula':[-1,-1,-2,1,0,'tronco estilizado y cabeza estrecha'],
 'Marmota sibirica':[0,1,0,0,0,'tronco redondeado'],
 'Marmota marmota':[-2,2,-1,1,-1,'tórax profundo y cabeza maciza'],
 'Marmota himalayana':[-1,0,1,-1,0,'perfil alto y hocico romo'],
 'Marmota bobak':[1,1,-1,0,-1,'dorso bajo y cuerpo largo'],
 'Marmota vancouverensis':[-2,1,0,-1,1,'volumen de pelaje y cabeza compacta'],
 'Procapra gutturosa':[-1,1,0,0,0,'tórax y garganta desarrollados'],
 'Procapra picticaudata':[1,-1,1,-1,1,'tronco ligero de montaña'],
 'Vulpes chama':[0,-1,1,-1,1,'zorro pequeño de hocico corto'],
 'Meles meles':[-1,2,-1,0,-1,'tronco ancho y bajo'],
 'Meles leucurus':[0,1,0,1,0,'cabeza más estrecha y alargada'],
 'Mellivora capensis':[-2,0,-2,-1,-2,'hombros robustos y orejas reducidas'],
 'Erinaceus europaeus':[-1,1,-1,0,0,'cuerpo compacto y cara corta'],
 'Atelerix algirus':[1,0,0,1,0,'cara alargada y manto más ligero'],
 'Cervus elaphus':[-1,1,-1,0,0,'pecho profundo y lomo largo'],
 'Elaphurus davidianus':[0,2,-2,1,1,'tronco largo y hocico alargado'],
 'Axis axis':[1,-1,0,-1,1,'tórax ligero y cuello fino'],
 'Rusa unicolor':[-2,2,-1,0,1,'cuerpo robusto y cuello grueso'],
 'Cervus nippon':[1,0,1,-1,0,'talla compacta y cuello corto'],
 'Cervus elaphus barbarus':[0,0,1,0,1,'forma compacta del ciervo norteafricano'],
 'Odocoileus hemionus':[0,-1,0,-1,5,'orejas grandes y cuerpo ligero'],
 'Capreolus capreolus':[1,-1,1,-1,0,'corzo compacto'],
 'Capreolus pygargus':[-1,1,-1,0,2,'corzo de mayor volumen y orejas largas'],
 'Lynx lynx':[-1,1,-1,0,0,'lince de tronco robusto'],
 'Lynx pardinus':[1,-1,1,-1,1,'lince de cuerpo más ligero'],
 'Canis lupus':[-1,1,-1,0,0,'pecho potente y cuerpo largo'],
 'Canis aureus':[1,-1,1,-1,1,'chacal esbelto y cabeza menor'],
 'Cuon alpinus':[-1,0,0,-1,-1,'cabeza ancha y orejas redondeadas'],
 'Canis lupaster':[0,-1,0,-1,2,'cánido ligero de orejas largas'],
 'Canis simensis':[1,-2,-1,0,2,'cuerpo fino y hocico estrecho'],
 'Lupulella mesomelas':[1,-1,-1,-1,2,'chacal de lomo recto y orejas grandes'],
 'Capra ibex':[-1,2,-1,0,0,'macho de pecho poderoso'],
 'Capra pyrenaica':[0,1,0,-1,-1,'cuerpo compacto y cabeza corta'],
 'Capra cylindricornis':[-2,2,0,0,-1,'cuerpo macizo de montaña'],
 'Capra aegagrus':[1,-1,-1,0,1,'cabra de tronco esbelto'],
 'Hemitragus jemlahicus':[-2,3,-1,-1,-1,'manto profundo del tahr'],
 'Ammotragus lervia':[-1,3,-2,0,0,'arruí de pecho largo y melena ventral'],
 'Capra walie':[0,2,-1,1,0,'pecho fuerte y hocico alargado'],
 'Rupicapra rupicapra':[0,0,0,0,0,'rebeco de verano'],
 'Rupicapra pyrenaica':[1,-1,1,-1,1,'rebeco pirenaico más ligero'],
 'Felis silvestris':[-1,2,-1,-1,0,'gato robusto de pelaje denso'],
 'Felis lybica':[1,-1,0,0,1,'gato esbelto de orejas largas'],
 'Catopuma temminckii':[-2,1,-1,0,-1,'félido musculoso de cráneo ancho'],
 'Prionailurus bengalensis':[1,-1,1,-1,1,'gato pequeño de cabeza estrecha'],
 'Herpestes ichneumon':[0,0,-2,0,-1,'mangosta de tronco largo'],
 'Helogale parvula':[1,1,2,-1,0,'mangosta enana compacta'],
 'Mungos mungo':[-1,1,0,-1,1,'mangosta robusta de cabeza corta'],
 'Castor fiber':[-1,2,-1,0,0,'tronco largo y cabeza ancha'],
 'Castor canadensis':[-2,1,1,-1,-1,'cuerpo más redondeado y hocico corto'],
 'Mustela nivalis':[1,-1,1,-1,-1,'comadreja fina de cabeza pequeña'],
 'Mustela putorius':[-2,2,-1,-1,0,'turón de cuerpo macizo'],
 'Mustela erminea':[0,0,-1,0,1,'armiño de tronco largo'],
 'Mustela lutreola':[-1,1,-2,1,-1,'visón alargado de orejas cortas'],
 'Vormela peregusna':[0,2,1,-1,2,'turón jaspeado de orejas grandes'],
 'Mustela eversmanii':[-1,0,0,0,1,'turón estepario de pecho alto'],
 'Sorex araneus':[0,0,0,0,0,'musaraña común de dorso curvo'],
 'Suncus murinus':[-2,1,-1,0,0,'musaraña grande de cuerpo largo'],
 'Microtus agrestis':[-1,1,-1,0,0,'topillo de pelaje denso'],
 'Microtus arvalis':[1,-1,1,-1,0,'topillo pequeño y compacto'],
 'Myodes glareolus':[0,-1,0,-1,1,'topillo de cabeza corta y orejas visibles'],
 'Chionomys nivalis':[0,0,-2,0,2,'topillo nival largo de orejas grandes'],
 'Lemmus lemmus':[-2,2,0,-1,-1,'lemming rechoncho'],
 'Lemmus trimucronatus':[-1,2,1,-1,0,'lemming pardo compacto'],
 'Dicrostonyx groenlandicus':[-2,3,1,-1,-2,'manto ártico espeso'],
 'Muscardinus avellanarius':[1,-1,2,-1,1,'lirón pequeño de cara corta'],
 'Eliomys quercinus':[0,0,-1,0,2,'lirón de orejas grandes'],
 'Glis glis':[-2,2,-1,0,-1,'lirón grande y robusto'],
 'Spermophilus citellus':[1,-1,1,-1,-1,'ardilla terrestre compacta'],
 'Geosciurus inauris':[0,1,-2,0,1,'ardilla de tronco alargado'],
 'Hystrix cristata':[-2,1,-1,0,0,'cresta alta y cuerpo profundo'],
 'Hystrix africaeaustralis':[0,2,-2,0,0,'tronco largo de puercoespín austral'],
 'Ovis dalli':[0,1,1,-1,-1,'oveja de montaña de cuello compacto'],
 'Panthera pardus tulliana':[-2,2,-1,0,0,'leopardo persa robusto'],
 'Panthera pardus pardus':[0,0,0,0,0,'leopardo de lomo arqueado'],
 'Neofelis nebulosa':[1,-1,-2,-1,1,'leopardo nublado de cuerpo largo'],
 'Moschus moschiferus':[-1,0,-1,0,1,'cuartos traseros altos y orejas largas'],
 'Hydropotes inermis':[1,1,1,-1,2,'cabeza corta y grandes orejas'],
 'Ursus americanus':[0,0,0,0,-2,'orejas menores y perfil sin giba'],
 'Gazella arabica':[0,0,0,0,0,'gacela de cuello fino'],
 'Gazella subgutturosa':[-1,1,-1,0,-1,'gacela de bocio de tórax profundo'],
 'Gazella dorcas':[1,-1,1,-1,2,'gacela pequeña de orejas largas'],
 'Antidorcas marsupialis':[0,-1,-1,0,1,'springbok de cuerpo esbelto'],
 'Eudorcas rufifrons':[-1,0,0,-1,1,'gacela de frente ancha'],
 'Gazella cuvieri':[-2,1,0,0,0,'gacela de montaña robusta'],
 'Eudorcas thomsonii':[1,-2,1,-1,1,'gacela ligera de pequeño tamaño'],
 'Gazella spekei':[0,1,1,0,2,'gacela de cara abultada y orejas largas'],
 'Oryx leucoryx':[1,-1,1,-1,0,'órix compacto de desierto'],
 'Oryx gazella':[-2,2,-1,0,1,'órix del Cabo de tórax poderoso'],
 'Oryx beisa':[0,1,0,0,-1,'órix de tronco largo y orejas cortas'],
 'Bubalus arnee':[-2,2,-1,0,1,'búfalo salvaje de gran tronco'],
 'Parahyaena brunnea':[-1,3,-1,-1,-1,'hiena de manto largo y orejas puntiagudas'],
 'Equus hemionus':[1,-1,0,-1,-1,'asno asiático ligero'],
 'Equus africanus somaliensis':[0,1,-1,0,1,'asno somalí de orejas largas'],
 'Equus africanus':[-1,0,0,-1,2,'asno africano de cara corta'],
 'Manis crassicaudata':[-1,2,-1,0,0,'pangolín de tronco ancho y cola gruesa'],
 'Manis pentadactyla':[1,1,1,-1,0,'pangolín chino compacto'],
 'Manis javanica':[1,-1,-2,0,0,'pangolín malayo de tronco largo'],
 'Smutsia temminckii':[-2,2,0,0,0,'pangolín terrestre de dorso alto'],
 'Semnopithecus entellus':[1,-1,-1,0,0,'langur de torso esbelto'],
 'Rhinopithecus roxellana':[-1,2,0,-1,1,'manto espeso y cara corta'],
 'Boselaphus tragocamelus':[-2,2,-1,0,1,'nilgó de hombros altos'],
 'Kobus leche':[1,-1,-1,0,0,'lechwe de lomo alargado'],
 'Kobus leche smithemani':[0,0,-1,0,1,'lechwe negro de tórax más lleno'],
 'Kobus vardonii':[-1,1,1,-1,1,'puku robusto de cara corta'],
 'Nomascus concolor':[0,-1,0,0,0,'gibón esbelto con cresta'],
 'Hylobates lar':[0,1,1,0,0,'gibón de tronco compacto'],
 'Symphalangus syndactylus':[-2,3,-1,0,0,'siamango de tórax y saco gular voluminosos'],
 'Paguma larvata':[1,-1,-1,0,0,'civeta de tronco fino'],
 'Civettictis civetta':[-2,2,0,-1,1,'civeta africana de dorso alto'],
 'Macaca thibetana':[-2,3,-1,0,0,'macaco tibetano de pelaje abundante'],
 'Macaca sylvanus':[0,1,1,-1,1,'macaco de Berbería compacto sin cola'],
 'Colobus guereza':[-1,1,-1,0,0,'colobo de manto largo'],
 'Colobus polykomos':[0,0,1,-1,1,'colobo de cabeza redondeada'],
 'Giraffa camelopardalis':[0,0,0,0,0,'jirafa de tórax profundo'],
 'Giraffa camelopardalis rothschildi':[-1,1,-1,0,1,'jirafa de Rothschild de tronco robusto'],
 'Giraffa reticulata':[1,-1,0,-1,-1,'jirafa reticulada de perfil fino'],
 'Tragelaphus eurycerus':[-2,2,-1,-1,2,'bongo de tórax fuerte y orejas grandes'],
 'Tragelaphus spekii':[1,-1,-1,0,1,'sitatunga de torso estrecho'],
 'Tragelaphus buxtoni':[-2,2,0,0,1,'niala de montaña robusto'],
 'Tragelaphus strepsiceros':[-1,0,-2,0,2,'gran kudú de tronco largo y orejas anchas'],
 'Tragelaphus angasii':[0,3,0,-1,0,'niala de manto ventral profundo'],
 'Philantomba monticola':[1,1,2,-1,-1,'duíquer azul compacto'],
 'Cephalophus zebra':[-2,2,-1,0,1,'duíquer cebra de dorso arqueado'],
 'Madoqua guentheri':[1,-1,0,0,1,'dicdic de hocico largo'],
 'Madoqua saltiana':[0,1,1,-1,0,'dicdic de Salt de cuerpo compacto'],
 'Hippotragus niger':[-1,1,-1,0,0,'antílope sable de cuello profundo'],
 'Hippotragus equinus':[-2,2,-2,0,3,'antílope ruano de orejas grandes'],
 'Chlorocebus sabaeus':[1,-1,-1,-1,0,'cercopiteco de cuerpo esbelto'],
 'Cercopithecus diana':[-1,1,0,0,1,'mono diana de manto y orejas prominentes'],
 'Lutra lutra':[0,0,0,0,0,'nutria de río de dorso arqueado'],
 'Lutrogale perspicillata':[-1,1,-1,-1,-1,'nutria lisa de cabeza ancha'],
 'Hydrictis maculicollis':[1,-1,1,-1,0,'nutria de cuello manchado esbelta'],
 'Lontra canadensis':[-2,2,-1,0,1,'nutria de río norteamericana robusta']
};
function adaptBody(d,profile){
 if(!d||!profile)return d;
 const [back,belly,rump,muzzle]=profile;
 return d.replace(/([MLQC])([^MLQCZ]+)/g,(all,cmd,args)=>{
  const v=args.match(/-?(?:\d*\.)?\d+/g).map(Number);
  for(let i=0;i<v.length;i+=2){let x=v[i],y=v[i+1];
   if(x<70){const influence=Math.min(1,Math.max(0,(70-x)/30));if(y<58)y+=back*influence;else y+=belly*influence;}
   if(x<60)x+=rump*Math.min(1,(60-x)/38);
   if(x>87&&y>40)x=Math.min(98,x+muzzle*(x-87)/11);
   v[i]=Math.round(x*100)/100;v[i+1]=Math.round(y*100)/100;
  }
  return cmd+v.join(' ');
 });
}
const legSets={
 cat:[[30,61,34,73,27,80,31,84,4],[69,57,70,70,72,80,76,84,3.8]],
 tallcat:[[32,56,36,72,29,83,33,88,3],[69,52,71,69,73,83,77,88,3]],
 dog:[[30,58,33,73,27,83,31,88,3.2],[69,55,70,71,72,83,76,88,3]],
 short:[[29,64,33,73,28,78,32,81,4],[71,59,72,71,75,79,79,82,4]],
 low:[[30,70,34,76,30,80,34,82,2.4],[77,65,77,74,80,79,84,81,2.5]],
 hoof:[[30,61,33,73,28,83,31,88,3],[71,55,69,72,72,84,75,89,2.8]],
 heavy:[[28,62,32,75,28,84,33,88,5.2],[72,57,71,73,75,84,81,88,5.5]],
 goat:[[31,60,34,72,28,81,32,87,3.7],[70,54,68,70,72,82,76,87,3.4]],
 giraffe:[[32,57,36,72,29,85,32,92,2.8],[61,52,58,70,62,85,66,92,2.7]]
};
const quadrupeds=new Set(['felid','canid','hyena','viverrid','fossa','mongoose','weasel','marten','badger','wolverine','deer','gazelle','gerenuk','spiral-antelope','oryx','horse-antelope','small-antelope','antelope','wildebeest','hartebeest','bovine','caprine','equid','tapir','rhino','hippo','pig','okapi']);
function render(sp,color,skin='normal',sex=null,id=null){
 const family=classify(sp,id);if(!family)return null;
 const latin=sp.latin||'',genus=latin.split(' ')[0],morph=morphology(sp,family),female=sex==='female',natural=skin==='normal'||skin==='alfa';
 const speciesProfile=speciesAnatomy[latin]||speciesAnatomy[latin.split(' ').slice(0,2).join(' ')];
 // Existing configured females already used a lighter, slimmer body in 3.19.3.
 const anatomy=female?[(speciesProfile?.[0]||0)+1,(speciesProfile?.[1]||0)-1,(speciesProfile?.[2]||0)+1,speciesProfile?.[3]||0,speciesProfile?.[4]||0]:speciesProfile;
 const key=latin.split(' ').slice(0,2).join(' '),source=colorByTaxon[key]||sp.color||'#9a9c7f';
 const sexualCoat=sex&&skin==='normal' ? ({'Antilope cervicapra':female?'#c39b68':'#403e35','Papio hamadryas':female?'#92765f':'#b7b4a8'}[key]) : null;
 const base=sexualCoat||tint(/^#[\da-f]{6}$/i.test(source)?source:'#9a9c7f',female&&family==='deer'?8:0);
 const paint=h=>natural?h:skin==='albino'?tint('#ded9d3',Math.round((parseInt(h.slice(1,3),16)-110)/11)):tint('#29392f',Math.round((parseInt(h.slice(1,3),16)-110)/16));
 const c=paint(base),dark=paint(tint(base,-30)),mid=paint(tint(base,-13)),light=paint(tint(base,24)),cream=paint('#e9e0cd'),ink=natural?'#47483f':skin==='albino'?'#7c7771':'#1c291f',black=paint('#39382f'),horn=paint('#a39881'),pink=paint('#bc9d87'),red=paint('#b07861'),blue=paint('#86a3a3');
 const eye=skin==='albino'?'#c85f6c':skin==='melanico'?'#d8c46b':'#302e26';
 const p=(d,f=c,s=ink,z=2.5)=>'<path d="'+d+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+z+'" stroke-linecap="round" stroke-linejoin="round"/>';
 const line=(d,col=mid,z=1.5)=>p(d,'none',col,z);
 const dot=(x,y,r,f)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"/>';
 const detail=a=>'<g data-mammal-detail="true">'+a+'</g>';
 const eyes=(x,y,r=1.6)=>detail(dot(x,y,r+.5,light)+dot(x,y,r,eye)+(r>2.8?dot(x,y,2.7,eye):'')+dot(x+.45,y-.45,.45,cream));
 const clipped=(d,art,suffix='coat')=>{const clip='m3194-'+norm(latin||id||family).replace(/[^a-z0-9]+/g,'-')+'-'+skin+'-'+(sex||'base')+'-'+suffix;return '<defs><clipPath id="'+clip+'">'+p(d,'#ffffff','none',0)+'</clipPath></defs>'+detail('<g clip-path="url(#'+clip+')">'+art+'</g>');};
 const limb=(a,fill=c,back=false)=>{
  let [x,y,k,v,t,u,toe,b,w]=a;if(back){x+=4;k+=4;t+=4;toe+=4;b-=2;w*=.8;}
  toe=Math.min(toe,t+3);return p(`M${x-w*.6} ${y}C${x-w} ${y+5} ${k-w*.5} ${v-3} ${k-w*.5} ${v}Q${k-w*.3} ${v+3} ${t-w*.35} ${u}L${t-w*.35} ${b-1}Q${t-w*.3} ${b+1} ${t+1} ${b+1}L${toe+1} ${b+1}Q${toe+3} ${b+1} ${toe+2} ${b-1}Q${toe+1} ${b-3} ${t+w*.4} ${u-1}L${k+w*.5} ${v}Q${x+w} ${y+6} ${x+w*.6} ${y}Z`,fill,ink,2);
 };
 const legs=(scheme,back=false)=>legSets[scheme].map(a=>limb(a,back?dark:c,back)).join('');
 const tail=(style)=>p(style==='snow'?'M27 51C9 50 3 65 7 80Q8 91 21 88Q28 84 23 79Q11 86 13 74Q14 63 29 62Z':style==='bushy'?'M29 51Q15 41 7 51Q1 62 8 72Q16 81 34 65Z':style==='wolf'?'M27 49Q11 49 9 66L6 75Q20 78 32 61Z':style==='short'?'M25 54Q15 53 13 59L23 66L30 62Z':style==='long'?'M26 56C12 57 3 70 7 82Q12 92 24 85L21 81Q11 87 11 79Q12 67 30 64Z':style==='equid'?'M25 40Q12 44 14 64L8 80L17 79Q24 63 21 51L30 48Z':style==='tuft'?'M26 51Q11 52 9 67Q5 75 10 81L16 79Q11 71 14 65Q18 60 29 60Z':'M27 58Q11 57 7 73Q7 79 12 76Q17 67 31 65Z',style==='bushy'||style==='wolf'?light:dark);
 const ear=(x,y,height=10,round=false)=>{height=Math.max(3,height+(anatomy?.[4]||0));return p(round?`M${x-4} ${y}C${x-9} ${y-height} ${x+6} ${y-height-3} ${x+5} ${y}Z`:`M${x-4} ${y}Q${x-9} ${y-height} ${x-3} ${y-height}Q${x+3} ${y-height+1} ${x+5} ${y}Z`,c,ink,1.9)+detail(p(`M${x-2} ${y-2}Q${x-5} ${y-height+3} ${x} ${y-height+4}L${x+2} ${y-2}Z`,pink,'none',0));};
 const rosettes=(points,cloud=false)=>points.map(([x,y])=>cloud?p(`M${x-4} ${y-2}q4-5 8 0l-1 6-5 1Z`,light,dark,1.6):line(`M${x-2} ${y+2}q-3-4 1-5m3 0q4 2 1 5`,dark,1.7)).join('');
 let art='',form=morph,body=null,flip=false;

 if(quadrupeds.has(family)&&morph!=='binturong'){
  let shape=outlines[morph]||outlines[family],scheme=['deer','gazelle','gerenuk','spiral-antelope','oryx','horse-antelope','small-antelope','antelope','hartebeest','equid','okapi'].includes(family)?'hoof':['bovine','rhino','hippo','pig'].includes(family)?'heavy':family==='caprine'?'goat':['weasel','mongoose'].includes(family)?'low':['badger','wolverine'].includes(family)||morph==='manul'||morph==='arcticfox'?'short':family==='canid'||family==='hyena'?'dog':morph==='serval'||morph==='cheetah'?'tallcat':'cat';
  if(morph==='duiker')shape=outlines.dikdik.replace('M24 53Q25 39 43 40','M24 53Q24 35 43 36');
  if(morph==='gaur')shape=outlines.buffalo.replace('M18 48Q21 30 46 32','M18 48Q21 24 46 28');
  if(morph==='muskox')shape=outlines.yak.replace('M18 48Q20 30 43 31','M18 48Q20 25 43 27');
  if(morph==='black-rhino')shape=outlines.rhino.replace('L98 54L97 65L88 70','L98 50L96 61L88 67');
  if(morph==='hairy-rhino')shape=outlines.rhino.replace('M16 48Q19 29 45 30','M19 50Q22 34 45 34');
  if(morph==='bushpig')shape=outlines.pig.replace('Q62 31 73 43','Q62 32 73 40');
  if(family==='horse-antelope')shape=outlines.oryx.replace('Q61 33 70 39','Q61 27 70 34');
  if(genus==='Pantholops')shape=outlines.gazelle.replace('M23 48Q29 36 48 41','M23 48Q27 31 48 36');
  if(genus==='Procapra')shape=outlines.gazelle.replace('L97 46L94 53','L95 45L93 51');
  if(genus==='Damaliscus')shape=outlines.hartebeest.replace('L73 26Q79 18 86 26','L73 30Q79 23 86 29');
  if(/kiang/.test(latin))shape=outlines.donkey.replace('M22 48Q28 34 48 39','M22 48Q26 29 48 34');
  body=shape;
  let tailStyle=family==='equid'?'equid':morph==='snowcat'?'snow':morph==='lynx'||morph==='manul'||family==='hippo'||family==='rhino'||family==='tapir'?'short':family==='canid'?(morph==='wolf'||morph==='wilddog'?'wolf':'bushy'):family==='viverrid'||family==='fossa'?'long':family==='felid'?(morph==='lion'?'tuft':'long'):'thin';
  const shortRump=family==='deer'||family==='small-antelope'||family==='caprine';
  const hoofTail=['gazelle','gerenuk','spiral-antelope','oryx','horse-antelope','antelope','wildebeest','hartebeest','bovine','okapi'].includes(family);
  art=(shortRump?p('M25 49Q16 47 12 52Q13 57 23 57L29 54Z',light,ink,1.8):hoofTail?p('M24 44Q14 48 14 64L10 72Q7 77 13 78L18 75L17 67Q17 53 28 51Z',dark,ink,1.9):tail(tailStyle))+legs(scheme,true);
  const cat=family==='felid',canine=family==='canid',hoof=['deer','gazelle','gerenuk','spiral-antelope','oryx','horse-antelope','small-antelope','antelope','wildebeest','hartebeest','bovine','caprine'].includes(family);
  let horns='';
  if(hoof){
   const noAntlers=/Moschus|Hydropotes/.test(genus),femaleAntlerless=female&&family==='deer'&&genus!=='Rangifer';
   const femaleHornless=female&&['Antilope','Procapra'].includes(genus);
   if(!noAntlers&&!femaleAntlerless&&!femaleHornless){
    if(morph==='moose')horns=p('M75 28L67 22L57 11L57 22L49 16L55 30L68 34M81 27L85 20L90 8L91 22L97 18L94 31L83 34Z',horn,ink,1.7);
    else if(family==='deer')horns=line(genus==='Muntiacus'?'M75 33L73 25L69 23M82 33L85 24L88 22':genus==='Elaphurus'?'M74 27L63 20L50 12M63 20L58 7M58 18L48 19M82 27L75 17L64 7M75 17L76 7':genus==='Odocoileus'?'M74 27L69 16L62 13M69 16L71 7L67 5M82 27L86 17L94 14M86 17L85 7L91 4':genus==='Capreolus'?'M74 27L69 12M71 20L65 17M70 15L74 10M82 27L86 12M84 20L91 16':genus==='Axis'||genus==='Rusa'?'M74 28L67 16L66 7M69 19L61 18M82 28L88 17L90 8M86 20L95 18':genus==='Dama'?'M73 27L66 15L59 7L60 19L54 14L60 27L69 31M82 26L87 15L93 8L92 23L97 18L92 30':'M74 28L69 13L63 7M70 18L61 15M69 13L72 6M82 28L86 13L91 7M86 17L94 15M86 13L83 6',horn,genus==='Rangifer'?2.8:2.3);
    else if(family==='oryx')horns=line(genus==='Addax'?'M75 29Q65 24 72 19Q78 15 71 9M82 29Q93 22 85 17Q79 13 86 7':/dammah/.test(latin)?'M75 29Q63 15 48 8M83 29Q75 14 62 7':'M75 29L61 5M82 29L73 4',horn,2.5);
    else if(family==='spiral-antelope')horns=line(genus==='Taurotragus'?'M76 29L70 22L72 17L68 11M83 29L88 22L85 17L89 10':'M75 28Q62 25 70 19Q78 14 68 10Q62 7 68 4M82 28Q94 23 86 18Q78 14 89 9L88 4',horn,2.7);
    else if(family==='bovine'||family==='wildebeest')horns=line(morph==='bison'?'M81 42Q72 29 76 25M89 43Q99 33 94 27':morph==='muskox'?'M78 38Q61 21 62 39Q63 47 75 42M85 37Q99 22 96 40L90 45':morph==='takin'?'M78 33Q68 14 60 23M86 33Q95 18 94 16':genus==='Bubalus'?'M78 39Q57 35 60 18M87 40Q99 35 96 18':'M78 40Q62 28 63 18M87 40Q99 30 95 19',horn,3.4);
    else if(family==='caprine')horns=line(genus==='Ovis'?'M77 30C56 10 57 43 72 40Q84 38 77 30M84 31Q97 19 96 34Q95 42 87 40':genus==='Rupicapra'?'M74 26L72 11Q69 6 67 11M82 26L83 11Q86 6 88 11':genus==='Capricornis'?'M74 26L68 15M82 27L78 15':genus==='Pseudois'||/pyrenaica/.test(latin)?'M74 26Q58 13 54 26M82 27Q96 14 97 25':genus==='Hemitragus'?'M74 27Q64 18 62 13M82 27Q75 17 73 12':genus==='Ammotragus'?'M74 27Q57 13 52 29M82 27Q97 14 96 29':'M74 27C69 13 54 4 45 9M82 27C78 12 66 4 57 6',horn,genus==='Capra'?3.8:2.7);
    else if(family==='horse-antelope')horns=line('M76 28Q67 9 49 9M84 28Q79 8 64 6',horn,2.8);
    else if(family==='gerenuk')horns=line('M69 17Q59 10 62 5M76 16Q83 10 81 4',horn,2.4);
    else if(family==='small-antelope')horns=line('M77 37L73 26M84 37L84 26',horn,2);
    else if(family==='hartebeest')horns=line('M76 25L68 15L72 6M83 25L91 14L87 5',horn,2.8);
    else horns=line(genus==='Saiga'?'M75 28L73 11M83 28L86 11':genus==='Antilope'?'M75 28L69 21L72 15L68 8M83 28L88 21L84 14L88 6':genus==='Aepyceros'?'M75 28Q60 16 67 7M83 28Q96 15 90 6':'M75 28Q65 15 71 7M83 28Q93 15 88 7',horn,2.5);
   }
   if(family==='spiral-antelope'&&genus==='Tragelaphus'&&!/strepsiceros/.test(latin))horns='<g transform="translate(16 6) scale(.8 .8)">'+horns+'</g>';
   if(female&&family==='caprine')horns=line(genus==='Capra'&&/pyrenaica/.test(latin)?'M74 27Q69 19 65 22M82 28Q88 20 91 23':'M74 27Q70 21 68 17M82 28Q81 21 78 17',horn,2.2);
   else if(female&&horns)horns='<g transform="translate(22 8) scale(.73 .73)">'+horns+'</g>';
  }
  art+=horns;
  let ex=74,ey=35,eh=10,round=false;
  if(cat){ex=76;ey=36;eh=morph==='serval'?18:morph==='lynx'||morph==='caracal'?15:morph==='manul'?5:morph==='sandcat'?12:9;round=/tiger|lion|leopard|snowcat|puma|manul|sandcat/.test(morph);}
  if(canine){ex=75;ey=morph==='fennec'?42:35;eh=/zerda/.test(latin)?27:/megalotis/.test(latin)?22:/rueppellii/.test(latin)?18:/pallida/.test(latin)?17:/corsac/.test(latin)?14:/ferrilata/.test(latin)?8:/lagopus/.test(latin)?7:12;round=genus==='Lycaon';}
  if(family==='hyena'){ex=77;ey=35;eh=12;round=genus==='Crocuta';}
  if(['rhino','hippo','pig'].includes(family)){ex=80;ey=45;eh=7;round=family==='hippo';}
  if(family==='equid'){ex=72;ey=morph==='horse'?24:28;eh=morph==='donkey'?20:11;}
  if(['weasel','mongoose','marten','badger','wolverine','viverrid','fossa'].includes(family)){ex=81;ey=family==='weasel'?55:46;eh=family==='marten'?10:7;round=family!=='viverrid';}
  if(family==='okapi'){ex=75;ey=24;eh=15;}
  if(family==='gerenuk'){ex=74;ey=20;eh=7;}
  art+=ear(ex-4,ey,eh,round)+ear(ex+5,ey+1,eh-1,round)+p(body)+legs(scheme);
  const coat=[];
  if(cat){
   coat.push(p('M76 46Q83 44 89 50L93 52L87 56L78 54Z',cream,'none',0));
   if(morph==='lion'&&!female)art+=p('M67 34Q65 20 78 24L83 20L89 28L95 32L93 46L97 54L89 62L83 66L74 59L68 57Q62 45 67 34Z',dark,ink,2.1)+p('M74 34Q82 27 88 36L90 46L95 51L91 56L81 55L75 49Z',c,ink,1.7);
   if(morph==='tiger')coat.push(line('M29 39L34 51L28 50M42 38L46 53L40 51M55 38L57 50L51 48M31 62L38 58M47 68L50 57M61 64L66 51M78 34L81 41M87 38L84 44',black,3.2));
   else if(morph==='cheetah'||morph==='serval')coat.push([[30,49],[39,43],[48,49],[57,43],[62,56],[44,61],[30,61]].map(([x,y])=>dot(x,y,morph==='serval'?1.9:1.5,dark)).join('')+line('M82 42L86 51',black,1.7));
   else if(/leopard|snowcat/.test(morph)||/Prionailurus/.test(genus))coat.push(rosettes([[30,48],[42,45],[53,50],[35,60],[48,62],[62,58]],genus==='Neofelis'));
   if(morph==='lynx')art+=line('M69 25L67 18M80 24L83 16',black,2)+p('M79 50L74 56L80 58M88 49L94 55L89 58',light,ink,1.3);
   if(morph==='caracal'&&/caracal$/.test(latin))art+=line('M69 25L66 16M80 25L83 15',black,2.1);
   if(/silvestris|lybica|manul/.test(latin))coat.push(line('M31 45L34 53M43 43L46 52M56 44L58 52',dark,1.7));
   if(morph==='fishingcat')coat.push(line('M29 43L34 53M41 42L46 52M54 42L58 52',dark,1.8));
   if(morph==='manul')art+=p('M73 41Q78 35 87 40L93 49L88 57L76 58L70 51Z',light,ink,1.5);
   if(morph==='snowcat')coat.push(line('M10 71L16 71M12 80L18 82',dark,2.3));
  }
  if(canine){
   coat.push(p('M73 43L82 45L91 50L95 51L87 55L78 54Z',cream,'none',0));
   if(morph==='raccoondog')coat.push(p('M74 43L85 41L91 49L86 54L75 51Z',black,'none',0));
   if(morph==='wilddog')coat.push(p('M26 43L37 39L40 52L29 56Z',black,'none',0)+p('M46 43L58 39L65 51L56 59L46 55Z',cream,'none',0)+p('M32 59L42 56L46 65L35 67Z',dark,'none',0));
   if(genus==='Lupulella')coat.push(p('M24 48Q46 31 66 41L59 52L37 54Z',black,'none',0));
   if(morph==='arcticfox')coat.push(line('M31 47Q47 40 62 47',light,2.4));
   if(/ferrilata/.test(latin))art+=p('M75 39L87 40L93 49L87 55L77 53L71 47Z',light,ink,1.6);
   if(tailStyle==='bushy')coat.push(line('M9 60L14 67',cream,5));
  }
  if(family==='hyena'){
   art+=p('M26 39L31 28L35 34L40 25L46 33L52 30L60 38Z',dark,ink,1.5);
   coat.push(genus==='Crocuta'?[[29,44],[39,39],[48,47],[31,56],[43,60],[58,55],[66,47]].map(([x,y])=>dot(x,y,1.8,dark)).join(''):line('M28 43L32 58M39 39L42 62M52 39L53 61M62 43L62 58',dark,2.6));
  }
  if(family==='viverrid')coat.push(p('M73 44L85 42L91 52L85 58L76 54Z',black,'none',0)+[[31,52],[42,47],[54,52],[33,64],[46,66],[62,60]].map(([x,y])=>dot(x,y,2,dark)).join(''));
  if(genus==='Genetta')art+=detail(line('M9 72L15 76M9 81L15 85M17 84L21 88',black,2.7));
  if(genus==='Mungos')coat.push(line('M29 52L32 66M38 50L41 67M48 50L51 66M58 49L61 62',dark,2));
  if(genus==='Mustela'&&/putorius|eversmanii/.test(latin))coat.push(p('M79 55L89 52L94 58L91 62L81 61Z',black,'none',0));
  if(/erminea/.test(latin))art+=detail(line('M8 75L11 76',black,4));
  if(family==='badger')coat.push(genus==='Mellivora'?p('M22 49Q39 31 65 43L78 51L72 58Q45 48 24 60Z',light,'none',0):p('M75 48L80 45L89 52L94 59L88 64L82 55L75 62L72 56Z',cream,'none',0));
  if(family==='weasel')coat.push(p('M23 70Q50 72 79 61L89 65Q65 80 25 76Z',cream,'none',0));
  if(family==='marten')coat.push(p('M70 51L83 54L79 65L69 65L63 59Z',cream,'none',0));
  if(family==='wolverine')coat.push(p('M23 52Q40 35 65 43L76 51L68 58Q47 47 27 65Z',light,'none',0));
  if(hoof){
   coat.push(p('M27 61Q48 68 69 56L65 66L45 70L28 67Z',light,'none',0));
   if(family==='gazelle')coat.push(p('M25 55Q44 60 65 50L66 54Q46 68 25 60Z',cream,'none',0)+line('M78 31L82 42L91 47',black,1.6));
   if(genus==='Antidorcas'||genus==='Eudorcas')coat.push(line('M27 56Q46 61 65 52',dark,2.6));
   if(genus==='Cephalophus')coat.push(line('M27 40L31 59M37 39L42 63M48 41L52 62M58 43L61 57',black,2.8));
   if(genus==='Damaliscus')coat.push(p('M30 42L36 39L43 63L35 67Z',dark,'none',0)+p('M64 45L71 42L75 57L68 62Z',dark,'none',0));
   if(family==='spiral-antelope')coat.push(line('M28 43L30 60M36 40L39 63M45 40L48 64M54 40L57 61',cream,1.6));
   if(family==='oryx')coat.push(line('M78 32L87 45M79 47L90 51',black,3.2)+line('M29 61L63 63',dark,2));
   if(family==='wildebeest')art+=p('M76 54L77 74L84 65L87 61Z',dark,ink,1.7)+p('M28 35L33 28L38 32L43 25L48 33L55 30L62 35Z',dark,ink,1.4);
   if(morph==='bison')art+=p('M77 55Q75 68 80 77L86 70L91 65Z',dark,ink,1.7);
   if(morph==='takin')art+=p('M79 54L79 69L85 63Z',dark,ink,1.4);
   if(family==='caprine'&&genus!=='Ovis'&&!female)art+=p('M81 51L80 65L87 59Z',dark,ink,1.4);
   if(sex==='male'&&genus==='Procapra')art+=p('M75 48Q69 58 76 64L84 55Z',light,ink,1.4);
   if(sex==='male'&&family==='deer'&&genus==='Cervus')art+=p('M67 39Q62 53 70 63L78 57L79 49Z',dark,ink,1.5);
   if(family==='deer'&&/Axis|Dama|nippon/.test(latin))coat.push([[30,46],[40,44],[50,48],[35,58],[47,60],[59,54]].map(([x,y])=>dot(x,y,1.5,cream)).join(''));
   if(morph==='muskdeer'&&/Moschus|Hydropotes/.test(genus))art+=p('M91 53Q93 63 87 65L89 54Z',cream,ink,1.2);
   if((morph==='moose'||morph==='reindeer')&&!female)art+=p('M77 50L73 62L78 67L82 55Z',light,ink,1.3);
  }
  if(family==='equid'){
   art+=p(morph==='horse'?'M61 37L63 20L67 13L70 17L68 37Z':'M61 37L64 24L68 18L71 22L68 39Z',dark,ink,1.5);
   coat.push(p('M83 43L94 46L96 51L90 55L83 51Z',dark,'none',0));
   if(morph==='zebra')coat.push(line('M27 34L30 61M36 32L40 67M47 34L50 67M57 33L59 62M69 22L75 33M67 33L80 42M69 44L78 49',black,2.5));
   else coat.push(line('M28 41L63 43',dark,1.6));
   if(/africanus/.test(latin))art+=detail(line('M27 76L34 78M27 82L32 84M71 77L77 79M74 83L80 85',black,1.7));
  }
  if(family==='tapir')coat.push(p('M40 31L67 29L74 57L61 74L41 76Z',cream,'none',0));
  if(family==='rhino'){
   art+=p(morph==='indianrhino'?'M88 53Q93 48 94 40L97 55Z':morph==='hairy-rhino'?'M88 54Q92 49 93 43L97 56Z':morph==='black-rhino'?'M88 51Q92 44 92 36L97 53Z':'M88 54Q95 46 95 29L98 56Z',horn,ink,1.8);
   if(morph!=='indianrhino')art+=p('M78 45L82 34L86 49Z',horn,ink,1.7);
   if(morph==='indianrhino')coat.push(line('M32 33Q26 48 33 66M58 31Q63 46 60 64M25 50L70 48',dark,1.8));
   else coat.push(line('M27 51Q44 45 64 51M74 51L80 57',dark,1.5));
  }
  if(family==='hippo')coat.push(p('M80 52Q90 47 97 54L97 65Q89 73 80 66Z',light,'none',0)+dot(88,54,1.7,dark)+dot(94,57,1.4,dark));
  if(family==='pig'){
   art+=p('M28 37L32 30L36 35L42 28L46 34L53 29L61 35Z',dark,ink,1.4);
   coat.push(p('M86 47L96 51L97 61L89 64L84 58Z',light,'none',0)+dot(94,54,1.3,dark));
   art+=p('M88 59Q92 63 94 54Q98 66 88 67Z',cream,ink,1.4);
   if(morph==='warthog'||/barbatus/.test(latin))art+=p('M76 50L71 59L80 64L84 58Z',light,ink,1.5);
  }
  if(family==='okapi')coat.push(line('M26 55L40 58M27 62L39 64M31 69L39 71M61 58L70 61M62 66L71 68',cream,2.5)+p('M76 29L84 29L88 38L82 42L74 36Z',cream,'none',0));
  art+=clipped(body,coat.join(''));
  let eyeX=cat?83:canine?82:family==='hippo'?85:family==='weasel'?88:family==='badger'?88:hoof?83:84;
  let eyeY=cat?40:canine?(morph==='fennec'?45:38):family==='hippo'?46:family==='weasel'?56:family==='mongoose'?53:family==='badger'?54:family==='marten'?44:family==='equid'?34:hoof?34:44;
  if(morph==='moose'){eyeY=38;eyeX=82;}if(family==='gerenuk'){eyeY=22;eyeX=79;}
  art+=eyes(eyeX,eyeY,cat||canine?1.6:1.5)+detail(line(cat?'M87 52L91 52M84 54L91 56':family==='rhino'?'M86 62L94 63':family==='weasel'?'M89 62L95 63':'M87 52L94 53',dark,1.3));
  if(cat||canine||['marten','weasel','fossa','viverrid'].includes(family))art+=detail(dot(family==='weasel'?96:95,family==='weasel'?60:cat?50:canine?(morph==='fennec'?53:49):55,1.8,black));
  flip=['hyena','fossa','marten','gazelle','oryx','caprine','antelope','okapi'].includes(family);
 }
 if(!art&&family==='elephant'){
  const asian=genus==='Elephas',forest=/cyclotis/.test(latin);form=asian?'asian-domed-head':forest?'forest-elephant':'savanna-elephant';
  art=p('M24 45Q12 44 10 62L8 75L12 77Q17 63 17 54L29 52Z',dark)+legs('heavy',true);
  body=asian?'M16 46Q18 29 39 29Q54 26 65 36L67 24Q71 17 77 21Q84 18 88 28L89 43Q98 48 95 63L91 78Q91 85 96 80L98 81Q97 96 86 91Q78 87 81 75L84 58L76 53L71 63Q62 77 39 73L22 66Q13 60 16 46Z':'M15 46Q18 28 39 29Q54 26 67 36L72 23Q79 17 86 25L89 41Q98 45 95 61L91 77Q91 86 97 80L98 83Q96 96 86 91Q79 88 81 74L83 56L75 53L70 65Q60 77 38 73L21 65Q12 58 15 46Z';
  art+=p(body)+legs('heavy');
  art+=p(asian?'M68 32Q56 29 55 42Q53 57 65 60L72 52L72 37Z':forest?'M69 29Q51 28 52 44Q51 62 65 65L75 50L74 35Z':'M70 28Q48 25 48 43Q46 65 63 69L77 51L76 35Z',light,ink,2.1);
  art+=p(forest?'M81 53Q84 67 78 72Q89 66 87 54Z':'M81 52Q87 67 95 57Q91 74 79 62Z',cream,ink,1.5)+eyes(84,34,1.7)+detail(line('M85 63L91 65M84 72L90 74M83 80L89 81M28 87L29 82M33 88L34 83M77 87L78 83',mid,1.4));
 }else if(!art&&family==='giraffe'){
  const retic=/reticulata/.test(latin),roths=/rothschildi/.test(latin);form=retic?'reticulated-giraffe':roths?'rothschild-giraffe':'giraffe';
  art=p('M27 45Q15 42 13 62L10 72L14 75Q19 63 19 54L30 53Z',dark)+legs('giraffe',true);
  body='M21 45Q27 32 45 38L53 34L64 10Q66 5 73 9L80 18L92 23Q97 29 90 33L80 30L73 23L66 49Q63 65 47 65L29 60Q19 55 21 45Z';
  art+=ear(72,16,8)+ear(80,20,8)+line('M68 12L67 5M76 13L79 7',horn,2.7)+p(body)+legs('giraffe');
  const patches=[[29,42],[40,41],[32,53],[45,54],[54,46],[59,34],[64,23]];
  art+=clipped(body,patches.map(([x,y],i)=>p(`M${x-4} ${y-3}q4-4 8 0l-1 7-7 1Z`,retic?dark:mid,cream,retic?1.4:.8)).join(''))+eyes(80,20,1.5)+detail(line('M85 29L92 29',dark,1.2));
 }else if(!art&&family==='camel'){
  const two=/ferus/.test(latin);form=two?'bactrian-two-humps':'dromedary-one-hump';
  art=tail('equid')+legs('hoof',true);
  body=two?'M20 46Q22 28 31 31Q37 14 45 34Q50 37 55 29Q63 12 69 36L72 40L76 24Q75 17 83 17Q93 17 91 28L97 35L95 42L83 42L79 35L75 57Q67 73 44 69L27 64Q17 58 20 46Z':'M20 47Q27 36 34 36Q41 14 52 28Q56 38 66 40L74 27Q73 17 81 15Q92 13 93 26L98 33L96 40L84 40L80 33L76 55Q68 72 45 69L27 65Q17 59 20 47Z';
  art+=p(body)+legs('hoof')+ear(81,22,7)+eyes(87,23,1.5)+detail(line('M27 57Q44 63 64 53M85 35L94 36',mid,1.5));
 }else if(!art&&family==='bear'){
  const panda=morph==='panda',sun=morph==='sun-bear',sloth=morph==='sloth-bear',brown=latin==='Ursus arctos';
  if(panda){
   body='M28 50Q24 35 38 30Q37 17 50 15Q66 11 73 26L72 38Q82 51 76 70Q73 86 53 87Q30 88 24 74Q20 61 28 50Z';
   art=p('M29 70Q13 76 18 87L40 89L47 78Z',black)+p('M62 74Q80 72 85 84Q85 91 67 90L56 81Z',black)+ear(42,22,9,true)+ear(66,22,9,true)+p(body,cream)+p('M29 44Q37 40 41 50L37 69L27 74Q19 62 29 44Z',black)+p('M65 44Q73 39 78 49L74 70L62 69L61 55Z',black);
   art+=detail(p('M36 29Q42 23 47 31L43 41L35 38Z',black,'none',0)+p('M58 29Q65 23 69 32L65 41L57 37Z',black,'none',0))+eyes(42,32,1.8)+eyes(63,32,1.8)+detail(p('M49 39L56 39L53 44Z',black,'none',0)+line('M44 49Q53 55 63 48',dark,1.3));
  }else{
   art=legs('heavy',true)+p(brown?'M17 46Q19 27 40 27Q50 18 64 28L73 29Q77 21 86 29L89 42L97 47L97 55L87 60L76 54Q73 76 47 76L24 69Q13 62 17 46Z':sun?'M21 50Q24 34 44 36Q59 29 72 38L78 30Q87 26 92 39L94 48L98 52L96 60L84 63L75 57Q69 77 47 76L28 69Q17 62 21 50Z':'M18 50Q20 30 41 32Q60 25 74 37L79 29Q89 26 93 40L94 49L98 56L96 64L84 65L75 59Q69 79 44 77L25 70Q14 62 18 50Z')+legs('heavy')+ear(76,34,9,true)+ear(85,34,8,true);
   art+=detail(p(sloth?'M86 44Q96 44 98 56L96 62L85 58L81 52Z':'M83 43L96 47L97 54L88 59L81 52Z',sun?pink:light,'none',0))+eyes(85,38,1.6)+detail(dot(96,sloth?55:49,2,black)+line('M88 55L95 56',dark,1.2));
   if(sun||/thibetanus/.test(latin))art+=detail(p('M67 48L73 55L80 49L77 60L71 64L65 56Z',cream,'none',0));
   if(sloth)art+=p('M25 53L20 62L24 72L28 70M70 49L66 65L70 69',dark,ink,1.4);
  }
 }else if(!art&&['red-panda','viverrid'].includes(family)){
  const redpanda=family==='red-panda';form=redpanda?'red-panda-ringed-tail':'binturong-prehensile-tail';
  const td=redpanda?'M38 58Q15 44 8 60Q3 77 16 83Q32 87 44 70Z':'M37 62C13 58 4 78 13 87Q25 97 31 83Q34 74 26 73Q28 84 22 85Q12 85 17 77Q24 71 43 72Z';
  art=p(td,light)+p('M33 57Q29 41 44 37L52 25Q60 17 72 23Q83 30 78 43L69 50Q80 65 64 79Q44 88 31 77Q23 67 33 57Z')+p('M43 64Q33 66 34 81L43 86L50 77L54 67Z',dark)+p('M62 62Q72 65 72 80L63 87L55 80L54 68Z',dark)+ear(56,27,redpanda?12:8)+ear(70,28,redpanda?11:8);
  if(redpanda)art+=clipped(td,line('M12 53L10 69M21 52L18 78M31 57L28 81',dark,4),'tail')+detail(p('M53 27Q62 19 73 27L76 39L66 45L54 40Z',cream,'none',0)+p('M54 31L60 31L61 37L56 37ZM68 31L73 32L71 38L66 37Z',dark,'none',0));
  art+=eyes(58,32,1.8)+eyes(70,33,1.8)+detail(dot(65,40,1.8,black)+line('M53 40L45 41M73 41L81 44',cream,1.2));flip=redpanda;
 }else if(!art&&family==='otter'){
  const sea=morph==='sea-otter';
  if(sea){
   art=p('M31 68Q15 71 7 90Q20 91 40 78Z',dark)+p('M27 62Q27 46 43 41L53 27Q63 17 76 25Q87 32 80 44L69 51Q77 65 62 80Q45 93 30 79Q21 71 27 62Z')+p('M32 69Q21 72 21 82L32 86L42 76Z',light)+p('M60 73L72 82L82 81L72 73L67 65Z',light)+ear(61,27,6,true)+ear(75,29,6,true)+detail(p('M55 31Q65 24 77 32L78 41L66 47L54 41Z',cream,'none',0))+p('M44 51Q40 52 42 60L52 65L57 60L50 55Z',light)+p('M62 51Q68 51 68 58L59 66L55 62L59 55Z',light)+eyes(61,33,1.7)+eyes(74,35,1.7)+detail(dot(69,41,1.8,black)+line('M60 42L52 44M75 43L82 47',mid,1.3));
  }else{
   body='M24 56Q30 43 50 47L64 44Q69 33 80 36Q93 39 94 51L98 57L93 62L81 62L72 57Q59 75 41 74L27 70Q19 65 24 56Z';
   art=p('M29 61Q14 64 5 82Q4 87 10 86Q20 75 37 71Z',dark)+p(body)+p('M34 63Q27 67 29 74L20 80Q18 83 24 84L38 79L45 67Z')+p('M67 61Q65 72 74 76L86 79Q92 77 87 74L78 69L76 59Z')+ear(77,42,6,true)+ear(86,42,5,true)+detail(p('M75 49Q85 47 93 54L97 57L90 61L78 59Z',light,'none',0))+eyes(86,45,1.6)+detail(dot(96,55,1.8,black)+line('M85 58L93 64M82 56L96 57M28 80L23 78M82 76L84 80',mid,1.2));
   if(genus==='Hydrictis')art+=detail(dot(73,55,1.6,cream)+dot(77,57,1.4,cream));
   if(genus==='Lutrogale')art+=detail(line('M32 57Q50 49 66 52',light,2));
  }
 }else if(!art&&family==='meerkat'){
  art=p('M39 71Q20 81 8 76Q11 87 26 86L47 80Z',dark)+p('M38 48Q35 39 43 34Q39 23 50 20Q64 16 70 29Q74 40 62 46L64 61Q72 76 61 87L40 86Q29 78 33 63Z')+p('M39 50Q30 53 32 65L40 71L43 63L43 53Z',dark)+p('M61 49Q72 54 68 64L61 70L58 64L59 54Z',dark)+p('M41 77L37 90L45 91L50 80M56 79L61 90L69 90L62 76Z')+ear(46,26,6,true)+ear(62,26,6,true)+detail(p('M44 28L51 27L53 34L45 36ZM59 27L66 29L65 36L58 34Z',black,'none',0))+eyes(49,30,1.7)+eyes(62,31,1.7)+detail(dot(57,38,2,black)+line('M43 55L57 57M40 62L58 65',light,1.5));
 }else if(!art&&family==='pangolin'){
  const tree=genus==='Phataginus',giant=/gigantea/.test(latin),indian=/crassicaudata/.test(latin);form=tree?'arboreal-pangolin':giant?'giant-pangolin':indian?'indian-pangolin':'terrestrial-pangolin';
  const td=tree?'M30 61C17 61 4 76 10 87Q20 98 29 87Q37 77 28 73L26 78Q31 84 23 87Q12 88 15 80Q19 70 39 70Z':'M31 61Q17 67 5 88L17 90Q33 79 42 71Z';
  art=p(td,dark)+p('M30 65Q22 71 25 84L35 85L42 69Z')+p('M60 66Q57 76 65 85L75 85L71 72L69 63Z');
  body=giant?'M22 57Q24 27 47 28Q70 29 77 51L88 57L97 65L88 71L75 69Q65 82 43 78Q23 76 22 57Z':tree?'M25 59Q20 37 43 34Q65 32 73 51L85 56L96 65L87 70L73 66Q61 80 42 77Q26 75 25 59Z':'M23 58Q23 32 47 32Q69 32 76 52L86 57L97 65L88 71L74 67Q63 81 43 78Q24 76 23 58Z';
  art+=p(body);let scales='';for(let r=0;r<4;r++)for(let k=0;k<5;k++){const x=25+k*10+(r%2?5:0),y=39+r*8;if(x>74)continue;scales+=p(`M${x} ${y}q5-4 10 0q-1 6-5 8q-4-2-5-8Z`,r%2?mid:light,dark,1.2);}
  art+=clipped(body,scales)+p('M72 53Q81 52 95 64L90 69L76 65Z',light,ink,1.7)+eyes(83,59,1.4)+detail(line('M28 82L26 87M32 82L31 88M69 83L69 88M73 82L76 87',cream,1.3));
 }else if(!art&&family==='aardvark'){
  art=p('M29 59Q15 64 7 84L17 87Q30 79 39 68Z',dark)+legs('short',true)+p('M21 53Q24 31 46 33Q65 29 76 45L82 44L98 57L96 65L85 66L73 57Q65 76 43 75L27 69Q17 62 21 53Z')+legs('short')+ear(73,42,25)+ear(84,43,22)+eyes(87,48,1.6)+detail(dot(97,60,2,black)+line('M24 79L20 84M32 81L28 87M77 80L80 86',cream,1.5));
 }else if(!art&&['cetacean','sirenian','pinniped'].includes(family)){
  if(family==='cetacean'){
   body='M19 60Q35 40 59 46Q80 45 90 55L98 60L95 65L84 64Q67 77 43 70L24 66Q15 74 4 70L11 64L5 57Q13 53 19 60Z';
   art=p(body)+p('M46 47Q52 32 60 39L67 49Z',dark)+p('M51 63Q58 71 52 83L69 72L66 61Z',dark)+detail(p('M29 64Q61 72 86 61Q66 81 38 69Z',light,'none',0))+eyes(84,55,1.5)+detail(line('M88 63L95 62',mid,1.3));
  }else if(family==='sirenian'){
   body='M20 61Q31 36 57 39Q78 37 88 51L97 55L98 65L90 73L77 72Q61 84 35 73L22 68Q12 78 3 72L10 64L4 56Q13 51 20 61Z';
   art=p(body)+p('M52 61Q60 69 53 82Q65 80 70 70L64 59Z',dark)+detail(p('M77 54Q91 50 97 58L97 66L89 72L78 68Z',light,'none',0))+eyes(86,53,1.6)+detail(line('M89 63L96 62M83 64L84 70',mid,1.5));
  }else{
   body='M19 65Q28 46 51 47L60 27Q61 15 72 14Q83 14 84 26L91 33L98 37L96 44L84 45L76 39L72 60Q74 78 54 81L31 79L16 89L9 88L15 78L6 80L4 73L19 65Z';
   art=p(body)+p('M56 56Q67 58 62 72L72 90L62 92L48 73Q47 64 56 56Z',dark)+ear(71,24,5,true)+detail(p('M78 32L91 34L97 39L92 43L80 40Z',light,'none',0))+eyes(78,26,1.6)+detail(line('M86 40L95 45M84 38L96 38',mid,1.3));
  }
  flip=family!=='pinniped';
 }
 if(!art&&family==='bat'){
  const horse=genus==='Rhinolophus',large=genus==='Eptesicus';form=horse?'horseshoe-bat':large?'serotine-bat':'pipistrelle';
  const wings=large?'M43 39Q29 17 8 25L4 48Q12 42 19 52Q25 48 29 62Q36 57 43 67L50 60L57 67Q64 57 71 62Q75 48 81 52Q88 42 96 48L92 25Q71 17 57 39Z':'M43 40Q30 21 11 29L4 52Q12 45 20 57Q26 50 31 65Q37 60 44 68L50 61L56 68Q63 60 69 65Q74 50 80 57Q88 45 96 52L89 29Q70 21 57 40Z';
  art=p(wings,mid)+detail(line('M44 45L12 30L9 45M44 45L20 55M44 45L31 63M56 45L88 30L91 46M56 45L80 55M56 45L69 63',dark,1.6))
   +p('M42 42Q40 29 50 27Q60 28 58 42L61 54Q61 68 51 73Q39 69 39 56Z')+ear(44,34,horse?17:large?12:10)+ear(55,34,horse?16:large?11:9)
   +p('M41 35Q43 26 51 27Q61 28 60 38L55 44L46 43Z',light,ink,1.8)+eyes(46,35,1.4)+eyes(55,35,1.4)+detail(p(horse?'M48 37Q46 32 51 32Q56 34 53 38L54 42L48 42Z':'M48 39L53 39L51 42Z',pink,ink,1.1))+p('M45 66L42 78L47 77L50 70L53 77L58 78L55 65Z',dark,ink,1.5);
 }else if(!art&&family==='flying-squirrel'){
  const giant=genus==='Petaurista';form=giant?'giant-flying-squirrel':'siberian-flying-squirrel';
  art=p(giant?'M44 68Q15 60 8 78Q3 93 17 94Q30 95 43 78Z':'M44 68Q23 66 17 81Q17 92 28 90L47 78Z',light)
   +p('M34 34Q20 44 8 38Q12 58 23 65L24 79Q37 73 49 78Q62 72 77 79L78 65Q91 55 92 38Q77 44 65 34Z',light)
   +p('M35 45Q34 30 47 27Q42 16 53 12Q67 9 73 23Q78 35 65 42L65 59Q71 76 54 82Q35 80 33 64Z')
   +p('M35 42Q25 32 17 32L9 37L15 42L24 40L35 52Z')+p('M65 42Q78 32 85 33L93 38L86 42L77 40L65 52Z')
   +p('M37 67L24 75L26 83L34 79L46 74Z',dark)+p('M63 67L77 75L75 84L66 79L55 75Z',dark)+ear(49,20,7)+ear(66,20,7)+eyes(56,24,2)+eyes(69,26,1.8)+detail(p('M62 31L68 32L65 36Z',pink,'none',0)+line('M19 46Q25 62 35 68M81 46Q75 63 64 68',mid,1.6));
 }else if(!art&&['squirrel','marmot','beaver','dormouse','vole','jerboa','mole-rat','lagomorph','shrew','mole','hedgehog','tenrec','desman','porcupine'].includes(family)){
  const hare=family==='lagomorph'&&genus==='Lepus',rabbit=family==='lagomorph',ground=family==='squirrel'&&genus!=='Sciurus',masked=family==='dormouse'&&genus==='Eliomys',spiny=['hedgehog','tenrec','porcupine'].includes(family);
  if(family==='squirrel'||family==='dormouse')art=p(family==='squirrel'&&!ground?'M40 65C23 69 7 61 7 43Q4 24 16 16Q34 7 35 26Q36 35 27 36Q28 23 20 25Q11 30 17 45Q23 57 44 53Z':ground?'M33 63Q11 55 8 70Q7 79 22 82L42 74Z':'M37 64Q14 52 8 67Q4 81 18 86Q30 87 44 74Z',light);
  else if(family==='beaver'){
   const td='M34 65Q12 60 5 74Q1 85 12 89Q26 94 42 78Z';art=p(td,dark)+clipped(td,line('M8 75L24 88M16 68L32 81M9 83L27 70M15 89L36 75',light,1.3),'tail');
  }else if(['shrew','desman','jerboa','mole-rat'].includes(family))art=p(family==='jerboa'?'M37 69Q19 72 12 87L5 90L4 94L14 94Q27 79 45 77Z':family==='desman'?'M30 66C13 64 7 76 4 87Q14 83 20 77L39 73Z':family==='shrew'?'M29 68Q13 61 5 77L7 82Q17 69 36 75Z':'M32 67L16 71L11 79L19 80L38 74Z',dark,ink,1.9);
  else if(rabbit)art=p('M31 66Q18 60 16 71Q17 79 33 77Z',cream);
  else if(family==='porcupine')art=p('M32 63L15 74L14 84L27 80L42 72Z',dark);
  let d=family==='squirrel'&&!ground?'M35 60Q32 46 46 40L53 28Q61 20 70 27Q79 33 75 45Q86 46 85 51Q83 56 73 56Q73 73 58 82Q41 91 31 77Q26 69 35 60Z':family==='squirrel'?'M27 60Q31 44 49 45L57 34Q65 28 74 35L77 45L88 50L86 57L75 60Q72 78 52 81Q31 84 27 69Z':family==='marmot'?'M25 59Q25 39 47 37L55 30Q64 24 74 34L78 45Q89 46 87 54Q84 60 76 62Q76 80 55 86Q32 90 24 75Q20 67 25 59Z':family==='beaver'?'M28 58Q29 39 46 36L52 25Q61 18 72 25Q83 33 77 45L89 49L88 57L76 63Q78 80 59 87Q36 93 26 77Q21 67 28 58Z':family==='dormouse'?'M29 59Q30 43 49 43L55 32Q65 23 74 33L77 43L87 49L84 56L74 58Q72 79 52 82Q32 87 26 73Q23 67 29 59Z':family==='vole'?'M24 63Q25 44 45 43Q56 35 69 42L75 51Q85 52 84 60Q82 66 73 69Q69 82 49 83Q27 84 23 73Z':family==='jerboa'?'M35 62Q29 49 46 43L54 32Q61 24 71 29L77 39L87 45L85 52L73 55L69 67Q66 81 51 83Q33 86 29 75Z':family==='mole-rat'?'M21 61Q22 43 44 42Q63 37 76 50L87 52L92 59L91 68L77 71Q67 82 45 80L26 75Q17 69 21 61Z':rabbit?(hare?'M25 57Q29 40 47 42Q56 39 65 42L70 31Q77 24 85 33L89 44L98 49L95 56L83 58L75 54Q69 71 49 73L29 70Q20 64 25 57Z':'M24 60Q26 42 45 43Q57 39 68 46L74 35Q81 29 88 39L90 48L98 53L95 59L83 61L75 57Q69 76 48 78L28 74Q19 67 24 60Z'):family==='shrew'?'M23 64Q28 51 48 53Q64 46 76 54L85 57L98 65L97 70L86 70L75 65Q64 78 44 77L28 75Q18 70 23 64Z':family==='desman'?'M23 60Q28 44 49 46Q65 42 77 54L85 56L98 66L96 73L88 72L84 66L75 64Q64 79 43 77L27 72Q18 66 23 60Z':family==='mole'?'M23 61Q24 42 45 42Q64 39 77 53L87 55L97 64L96 70L84 71L76 65Q65 80 43 78L27 74Q18 68 23 61Z':family==='hedgehog'?'M19 60Q19 38 41 35Q61 32 73 49L82 52L96 65L94 72L84 73L73 65Q64 81 42 78L24 73Q15 67 19 60Z':family==='tenrec'?'M22 56Q24 32 46 32Q63 31 75 49L86 53L98 65L95 73L84 72L74 64Q64 81 42 77L27 72Q18 65 22 56Z':'M17 53Q17 27 42 25Q64 22 77 46L87 49L96 60L94 69L82 70L74 61Q64 79 41 75L22 68Q13 61 17 53Z';
  body=d;
  if(genus==='Sorex'&&/minutus/.test(latin))body=d=d.replace('M23 64Q28 51 48 53','M26 65Q31 55 48 56');
  if(genus==='Desmana')body=d=d.replace('M23 60Q28 44 49 46','M20 60Q24 40 49 43');
  if(rabbit){
   const earHeight=hare?(/timidus/.test(latin)?25:/sinensis/.test(latin)?28:/granatensis/.test(latin)?32:/capensis/.test(latin)?33:/fagani/.test(latin)?31:35):genus==='Pentalagus'?13:25;
   art+=ear(73,hare?36:42,earHeight)+ear(82,hare?37:43,earHeight-3);
  }else if(!spiny&&!['shrew','mole','desman','mole-rat'].includes(family))art+=ear(family==='jerboa'?58:57,family==='jerboa'?35:39,family==='jerboa'?(genus==='Euchoreutes'?26:17):7,true)+ear(family==='jerboa'?70:69,family==='jerboa'?36:39,family==='jerboa'?(genus==='Euchoreutes'?24:15):6,true);
  art+=p(body);
  if(genus==='Geosciurus')art+=clipped(body,line('M29 55Q45 52 64 44',cream,2.6));
  if(genus==='Lemmus')art+=clipped(body,p('M28 55Q39 40 53 43L60 61Q45 57 29 67Z',/lemmus$/.test(latin)?black:dark,'none',0));
  if(family==='marmot'&&/himalayana/.test(latin))art+=detail(p('M55 32Q66 23 74 34L78 43L72 48L57 43Z',dark,'none',0));
  if(spiny){
   if(family==='porcupine')art+=line('M24 49Q14 34 19 23M29 45Q20 24 27 17M36 43Q29 22 36 14M43 42Q39 19 45 13M51 44Q53 23 61 19M59 47Q66 30 73 30',dark,1.6);
   art+=p(family==='porcupine'?'M18 55C13 37 23 21 42 22Q64 19 78 46L72 59Q48 46 18 55Z':family==='tenrec'?'M23 53C19 39 29 28 42 27Q46 23 50 28Q57 26 61 33Q69 35 73 48L68 54Q44 44 23 53Z':'M20 55C16 44 23 34 33 31Q37 27 41 29Q47 25 51 30Q58 27 61 33Q68 33 72 47L69 54Q44 43 20 55Z',dark,ink,1.8);
   art+=detail(line(family==='porcupine'?'M25 47L28 27M34 43L40 23M44 43L49 26M54 46L61 33':'M27 48L32 39M39 45L43 35M50 47L55 38M59 49L63 43',light,family==='porcupine'?1.8:1.5));
  }
  if(rabbit){
   art+=p(hare?'M34 56Q23 55 22 66Q24 74 34 72L19 82L10 82Q5 85 11 89L29 87L46 70Q51 59 43 55Z':'M34 60Q23 60 23 71Q24 78 35 76L24 85L17 86Q13 90 21 92L37 88L47 72Q50 63 43 59Z',light,ink,2.1)+limb(hare?[72,55,70,69,77,80,82,86,2.6]:[73,59,73,74,80,84,85,90,2.9]);
   art+=eyes(85,hare?38:43,1.7)+detail(dot(97,hare?50:54,1.6,pink)+line(hare?'M87 53L96 59M84 54L91 63':'M86 56L95 62M84 57L91 66',mid,1.2));
  }else if(['mole','desman','shrew','mole-rat'].includes(family)){
   art+=p(family==='mole'?'M65 60Q71 58 77 64L82 74L77 79L72 74L67 80L63 74L59 78L58 70Z':family==='desman'?'M67 63L80 66L85 77L77 81L74 74L69 81L63 76Z':'M68 66Q76 65 80 73L88 78L82 82L72 78L64 73Z',light,ink,1.7)+p('M35 68Q27 69 28 77L19 81L22 85L38 80L44 71Z',light,ink,1.8)+eyes(80,family==='shrew'?58:family==='mole-rat'?54:56,family==='mole'?1:1.3)+detail(dot(97,family==='desman'?68:family==='shrew'?66:65,1.7,pink)+line('M75 74L79 79M69 74L68 80M25 81L22 85',cream,1.3));
   if(family==='mole-rat')art+=detail(p('M87 67L92 67L91 73L87 72Z',cream,ink,1));
  }else{
   const upright=['squirrel','marmot','beaver','dormouse','jerboa'].includes(family)&&!ground;
   art+=p(upright?'M38 72C27 72 24 81 29 85Q37 91 45 83L48 79Q44 75 38 72Z':'M33 69Q28 73 25 77L19 79Q16 82 21 83Q33 83 39 77L44 72Z',dark,ink,1.8)+p(upright?'M59 72Q68 74 70 83L77 86Q82 89 77 91Q66 93 61 86L53 80Z':'M67 66Q72 70 70 77L77 79Q82 81 78 84Q67 87 64 79L59 73Z',dark,ink,1.8);
   if(upright)art+=p('M61 49Q53 48 51 55Q51 61 57 63Q62 67 66 62L62 58Q60 56 65 53Z',light,ink,1.6);
   art+=eyes(family==='vole'?76:spiny?85:family==='squirrel'?70:72,family==='vole'?53:spiny?56:family==='beaver'?34:family==='marmot'?39:family==='jerboa'?36:38,1.6);
   if(masked)art+=detail(p('M61 34L75 34L79 43L69 48L60 41Z',black,'none',0))+eyes(72,38,1.6);
   if(family==='beaver')art+=detail(p('M77 53L83 53L82 60L77 59Z',cream,ink,1)+line('M34 52Q43 44 51 50',light,1.5));
   if(spiny)art+=detail(dot(94,family==='porcupine'?61:68,1.7,black)+line('M88 71L93 71',dark,1.2));
  }
  flip=['squirrel','shrew','desman','porcupine','marmot'].includes(family);
 }
 if(!art&&family==='ape'){
  const orang=morph==='orangutan',bonobo=morph==='bonobo',gorilla=/gorilla/.test(morph),mountain=morph==='mountain-gorilla';
  if(orang||bonobo){
   body=orang?'M32 48Q31 34 43 30Q40 15 52 12Q68 8 73 24L71 37Q82 48 77 67Q74 83 57 86Q36 87 27 73Q21 61 32 48Z':'M34 48Q33 36 45 32Q43 21 54 17Q67 14 73 27L71 40Q80 50 73 68Q70 83 55 86Q37 86 29 73Q25 62 34 48Z';
   art=p('M36 67Q18 67 17 83Q17 92 32 91L46 81Z',dark)+p('M62 68Q80 69 85 84Q86 92 72 92L57 82Z',dark)+p(body);
   art+=p(orang?'M34 38Q20 39 18 55L10 78Q6 87 14 90L24 87L24 77L30 59L39 51Z':'M36 42Q24 43 23 57L15 80L19 90L28 89L30 77L35 60L43 52Z',mid)
    +p(orang?'M68 38Q83 40 84 56L92 79Q97 87 88 91L78 86L76 75L70 59L62 51Z':'M66 43Q78 44 80 57L87 81L84 90L75 89L71 76L66 61L60 52Z',mid);
   art+=detail(p(orang?'M42 25Q47 15 60 18Q74 20 70 33L64 44L51 45L41 36Z':'M47 27Q53 19 64 24L70 32L65 42L54 44L45 36Z',pink,'none',0));
   if(orang)art+=p('M43 24Q33 24 35 34Q37 44 45 39M66 23Q77 21 79 32Q80 41 70 39',light,ink,1.5);
   art+=eyes(49,29,1.7)+eyes(63,29,1.7)+detail(p('M50 35Q56 31 63 35L65 40L59 44L50 40Z',light,'none',0)+line('M51 40Q58 43 63 40M14 83L16 88M84 82L86 89',dark,1.3));
   if(orang)art+=p('M33 42L27 49L30 55M71 43L77 49L74 55',c,ink,1.5);
  }else{
   art=p('M29 58Q17 62 19 75L16 86L24 91L35 88L37 77L46 66Z',dark)+p('M56 59Q45 67 50 78L46 88L54 91L67 88L69 77L74 65Z',dark);
   body=gorilla?(mountain?'M17 47Q22 24 44 26L55 23Q60 12 73 19Q85 23 82 36L90 41L90 50L81 55L71 51L66 63Q50 75 27 67Q15 61 17 47Z':'M18 48Q21 26 42 28L53 26Q58 16 71 20Q84 23 81 36L89 40L90 50L81 55L70 50L65 62Q47 74 27 67Q16 62 18 48Z'):'M22 48Q28 32 45 34L55 30Q58 20 70 23Q81 27 78 38L88 42L88 50L78 54L68 49L61 63Q43 72 27 64Q18 58 22 48Z';
   art+=p(body)+p(gorilla?'M60 40Q48 43 50 61L58 85L57 91L70 92L77 87L72 80L66 61L71 47Z':'M58 41Q49 43 50 57L59 81L57 88L68 91L75 86L69 78L66 59L69 47Z',mid)+p(gorilla?'M75 46Q67 52 71 66L78 85L79 92L92 92L96 86L90 80L84 63L85 49Z':'M73 45Q67 50 70 63L80 81L79 88L91 91L96 86L89 78L82 61L83 49Z',c);
   art+=detail(p(gorilla?'M62 25Q69 19 77 25L80 34L86 41L85 47L77 50L67 45L62 36Z':'M60 29Q67 23 75 29L77 37L85 42L84 48L75 50L64 43Z',gorilla?dark:pink,'none',0)+line('M63 28L76 28',black,2))+eyes(70,30,1.5)+detail(p('M73 36Q82 33 86 41L85 47L77 49L70 43Z',light,'none',0)+line('M76 44L84 44M62 87L62 91M67 87L67 91M83 87L83 91M89 87L89 91',dark,1.3));
   if(gorilla)art+=detail(p('M25 34Q37 25 49 32L51 45Q36 51 24 46Z',light,'none',0));
   flip=!gorilla;
  }
 }else if(!art&&family==='gibbon'){
  const siamang=genus==='Symphalangus',whitehands=genus==='Hylobates';form=siamang?'siamang':whitehands?'white-handed-gibbon':'crested-gibbon';
  art=p('M40 57Q28 62 30 75L41 88L39 94L48 94L52 87L44 71L50 64Z',dark)+p('M58 57Q72 62 70 76L60 87L64 93L55 94L50 87L58 72L51 64Z',dark);
  body='M38 44Q35 35 43 30Q42 20 51 17Q64 14 69 26L65 39Q74 54 61 68Q47 76 38 61Q33 53 38 44Z';
  art+=p('M37 39C28 33 25 23 24 15Q20 12 23 7Q26 2 30 6L32 12L29 18C33 29 39 31 45 33L48 42Z',mid)+p('M61 38Q77 27 77 15Q71 12 74 6Q78 1 83 5L86 11C87 27 79 39 67 47Z',mid)
   +p(body)
   +detail(p('M44 27Q52 18 63 26L64 36L56 42L46 38Z',whitehands?cream:light,'none',0))+eyes(49,29,1.7)+eyes(60,29,1.7)+detail(dot(55,35,1.7,black)+line('M49 39Q55 43 60 38',dark,1.3));
  if(whitehands)art+=detail(p('M24 5L29 5L32 12L29 18L24 14Z',cream,'none',0)+p('M75 3L82 4L86 11L81 15L76 12Z',cream,'none',0));
  if(siamang)art+=detail(p('M47 39Q54 33 62 41L59 48L49 47Z',pink,'none',0));
 }else if(!art&&['macaque','baboon','langur','guenon','proboscis-monkey'].includes(family)){
  const mandrill=genus==='Mandrillus',gelada=genus==='Theropithecus',prob=family==='proboscis-monkey',colobus=genus==='Colobus',golden=genus==='Rhinopithecus',japan=/fuscata/.test(latin),tailless=/sylvanus/.test(latin),tibetan=/thibetana/.test(latin),baboon=family==='baboon'&&!mandrill&&!gelada;
  form=mandrill?'mandrill':gelada?'gelada':prob?'proboscis-monkey':colobus?'colobus-mantle':golden?'golden-snub-nosed':japan?'japanese-macaque':tibetan?'tibetan-macaque':baboon?'baboon':family;
  if(mandrill||gelada||prob||japan||tibetan||tailless){
   if(!japan&&!tibetan&&!tailless&&!mandrill)art=p(prob?'M37 67C18 57 6 70 12 83Q19 91 29 81L27 77Q19 84 17 79Q12 70 29 75Z':'M37 66Q18 59 10 75Q8 84 18 87L29 80L26 76Q15 83 16 77Q20 71 39 75Z',dark);
   art+=p('M35 68Q19 70 21 85L35 91L48 79Z',dark)+p('M61 68Q78 70 81 85L68 92L55 81Z',dark);
   body=mandrill?'M32 48Q30 32 43 28Q42 15 53 13Q70 10 75 25L72 39Q84 53 75 72Q66 88 47 86Q25 82 25 63Q24 54 32 48Z':prob?'M33 50Q30 36 45 31Q44 18 56 15Q70 13 74 27L70 41Q85 51 80 70Q76 87 55 87Q29 87 26 69Q23 59 33 50Z':'M32 48Q30 34 44 29Q43 17 55 15Q71 13 76 29L71 42Q83 57 74 74Q64 88 44 85Q26 81 25 65Q24 54 32 48Z';
   if(mandrill&&female)body='M35 48Q34 35 45 31Q44 20 54 18Q67 16 71 28L69 40Q79 54 72 71Q65 84 48 83Q29 79 29 63Q28 54 35 48Z';
   art+=p(body)+p('M33 43Q23 45 21 60L16 81L18 91L30 91L35 86L31 79L35 62L43 51Z',mid)+p('M68 43Q80 46 82 60L89 82L86 91L75 92L70 86L74 79L66 60L60 51Z',mid);
   art+=detail(p('M44 26Q52 17 64 23L70 33L66 45L55 49L43 40Z',prob?pink:japan?red:light,'none',0));
   if(mandrill){const faceBlue=female?paint('#9caaa6'):paint('#527fa8'),faceRed=female?paint('#ab807b'):paint('#c74c49');art+=detail(p('M47 29L52 26L54 44L49 41Z',faceBlue,'none',0)+p('M60 26L65 29L64 42L59 44Z',faceBlue,'none',0)+p('M54 28L59 28L62 40L57 47L52 39Z',faceRed,'none',0));}
   if(prob)art+=p('M55 29Q67 29 67 43Q66 51 57 49L52 44L54 37Z',pink,ink,1.5);
   art+=eyes(49,29,1.6)+eyes(63,29,1.6)+detail(line('M49 43Q57 49 64 42M21 86L23 91M79 86L81 91',dark,1.3));
   if(gelada&&!female)art+=p('M35 43Q27 31 39 23L44 18L46 29L42 39L47 48L43 67L35 74L32 62L28 57Z',dark,ink,1.8)+p('M70 31Q82 35 80 49L84 59L75 70L71 57L67 47Z',dark,ink,1.8);
   if(gelada)art+=detail(p('M48 53Q55 48 62 55L58 65Q49 68 45 57Z',red,'none',0));
   if(japan||tibetan)art+=detail(p('M32 52Q45 47 52 61L46 75L34 70Z',light,'none',0));
  }else{
   const td=family==='langur'?'M31 49C14 48 6 33 12 18Q18 6 10 5L8 9Q17 14 10 25Q2 44 24 58Z':family==='guenon'?'M30 54C15 53 3 64 7 78Q9 92 22 91L23 86Q12 88 13 78Q11 65 35 64Z':/nemestrina/.test(latin)?'M29 50Q13 40 10 52Q10 64 20 61L20 57Q14 60 15 54Q17 48 29 57Z':baboon?'M30 46C23 27 9 26 8 43L11 57L17 57Q11 39 17 37Q23 35 24 50L35 56Z':'M31 52C20 33 3 37 7 57Q9 68 18 67L18 61Q8 60 13 49Q17 42 25 61Z';
   art=p(td,dark)+p('M29 61Q20 68 23 78L19 88L29 92L40 88L41 79L47 67Z',mid)+p('M59 57Q52 64 56 77L54 89L65 92L74 87L70 79L69 62Z',mid);
   body=family==='langur'?'M28 48Q33 32 50 34L58 27Q61 18 71 21Q81 24 78 36L86 40L86 47L76 53L67 49L62 62Q48 73 32 66Q23 60 28 48Z':family==='macaque'?'M23 48Q26 29 47 31L58 27Q61 18 73 22Q84 27 80 39L89 44L88 51L78 55L68 49L63 63Q45 76 29 68Q18 61 23 48Z':baboon?'M24 48Q29 30 47 34L59 28Q62 17 74 21L80 31L88 35L98 45L96 53L86 55L75 48L68 59Q56 74 35 69Q21 63 24 48Z':'M25 49Q30 34 48 36L59 28Q62 18 73 22Q84 27 80 39L89 44L88 51L78 55L68 49L63 60Q50 75 32 68Q20 61 25 49Z';
   art+=p(body)+p('M65 40Q54 43 58 58L65 80L64 89L74 92L81 87L75 78L72 59L75 47Z')+p('M78 46Q69 51 74 65L84 82L82 90L92 92L98 87L92 79L85 61L87 49Z',mid)+ear(70,28,7,true)+detail(p(baboon?'M76 30L84 35L97 44L95 51L86 53L74 46Z':'M69 27L78 31L78 39L87 45L85 51L75 52L66 43Z',pink,'none',0))+eyes(76,31,1.5)+detail(line('M85 47L94 48M70 86L72 91M87 86L89 91',dark,1.3));
   if(colobus)art+=p('M28 40Q40 29 54 36L58 52L50 64L42 59L36 65L29 59L23 61L20 53Z',cream,ink,1.5)+detail(line('M10 43L11 55',cream,4));
   if(golden)art+=detail(p('M64 26L74 22L79 32L76 41L66 40Z',blue,'none',0));
   if(/hamadryas/.test(latin)&&!female)art+=p('M48 34Q55 21 66 24L66 38L72 47L63 60L54 56L48 62L43 54Z',light,ink,1.6);
   if(/neglectus/.test(latin))art+=p('M76 45L83 47L82 61L73 57L70 49Z',cream,ink,1.3)+detail(line('M65 25Q71 21 77 28',red,3));
   if(/diana/.test(latin))art+=detail(line('M64 24Q71 19 77 27',cream,2.6)+p('M74 45L83 48L80 60L72 54Z',cream,'none',0));
  }
  flip=family==='guenon'||japan;
 }else if(!art&&(morph==='ring-tailed-lemur'||morph==='ruffed-lemur'||family==='aye-aye')){
  const ring=morph==='ring-tailed-lemur',aye=family==='aye-aye';
  form=aye?'aye-aye-reaching-hand':ring?'ring-tailed-lemur-quadruped':'ruffed-lemur-quadruped';
  const td=ring?'M30 57C13 53 8 36 14 23Q18 13 12 6Q27 9 25 25Q21 43 39 48Z':aye?'M29 60C13 54 4 69 8 82Q13 95 28 87L43 72Z':'M30 57C11 49 4 64 9 78Q15 91 30 81L41 69Z';
  art=p(td,light);if(ring)art+=clipped(td,line('M12 13L27 15M10 24L28 26M10 36L29 39M16 47L35 49',black,3.6),'tail');
  body=aye?'M25 57Q27 36 47 38L58 32Q61 21 73 26Q85 29 85 40L94 47L97 55L90 61L80 59L70 52Q67 70 49 76Q30 79 24 67Z':'M25 55Q29 39 47 42L60 35Q63 23 74 28Q85 32 83 43L93 49L96 55L90 60L79 57L70 51Q67 70 49 74Q29 78 24 65Z';
  art+=legs('cat',true)+p(body)+limb([33,65,37,76,30,84,33,89,3])+limb([69,55,71,72,77,84,80,89,2.4])+ear(66,34,aye?21:12,true)+ear(78,34,aye?19:10,true);
  art+=detail(p('M65 34Q73 27 81 35L83 44L92 50L91 56L80 55L69 47Z',ring?cream:light,'none',0)+p('M68 35L77 34L81 41L75 46L68 41Z',ring?black:mid,'none',0))+eyes(76,37,aye?2:1.8)+detail(p('M91 50L95 51L93 55L90 54Z',pink,'none',0));
  if(aye)art+=p('M64 49Q77 48 79 60L87 66L85 72L76 66L69 58Z',mid,ink,1.8)+line('M84 68Q91 62 97 61M84 70L96 70M83 72L91 79',light,1.3);
  if(!ring&&!aye)art+=p('M37 42Q47 32 58 39L62 52L55 59L49 55L42 62L35 56Z',cream,ink,1.4);
  flip=ring;
 }else if(!art&&family==='loris'){
  form='slow-loris-crouch';
  body='M25 58Q24 39 43 37L52 24Q62 14 74 25Q83 34 74 45L66 49Q76 67 61 79Q43 89 29 76Q19 68 25 58Z';
  art=p('M32 66Q20 67 17 81Q17 88 27 88L41 77Z',dark)+p('M58 67Q75 63 80 77L78 88Q72 93 66 85L63 77Z',dark)+p(body)+ear(57,28,7,true)+ear(73,31,6,true);
  art+=p('M43 41Q30 40 28 53Q25 62 18 64L12 61Q7 63 12 69Q21 74 30 65L40 55L49 49Z',light,ink,2)+p('M65 47Q76 49 75 62L85 75Q88 78 85 84Q80 88 77 82L65 68Q58 58 59 51Z',mid,ink,2);
  art+=detail(p('M54 27Q64 19 74 28L77 37L68 47L56 43L50 35Z',light,'none',0)+p('M54 28L62 27L63 36L56 39ZM67 28L74 31L73 40L66 37Z',dark,'none',0))+eyes(58,31,2.5)+eyes(70,33,2.3)+detail(p('M62 39L68 40L65 44Z',pink,'none',0)+line('M12 65L15 70M81 79L84 85',cream,1.2));
 }else if(!art&&family==='galago'){
  form='galago-perched';
  art=p('M35 66C18 65 5 77 10 87Q17 97 28 89L26 84Q17 91 15 86Q10 79 29 76L43 75Z',light)
   +p('M38 62Q23 58 22 73Q22 84 39 84L29 91Q25 94 31 96L46 89L51 77Z',dark)+p('M60 65Q72 62 75 73L73 86L82 91Q87 96 79 97L65 90L63 78Z',dark)
   +p('M32 53Q33 38 47 35L55 24Q63 18 72 25Q82 32 77 43L67 50L69 64Q71 77 55 81Q39 85 31 71Q25 62 32 53Z')+ear(57,30,23,true)+ear(74,32,20,true)
   +p('M61 45Q68 35 70 25L68 15Q65 9 70 8Q75 8 76 15L77 29Q78 43 68 54Z',mid,ink,1.8)+p('M42 47Q32 49 31 60L39 69Q45 72 47 67L40 60L47 52Z',light,ink,1.8)
   +detail(p('M52 29Q64 22 74 31L77 40L68 48L55 44L49 36Z',light,'none',0))+eyes(58,33,2.6)+eyes(71,35,2.4)+detail(p('M63 41L69 41L67 46Z',pink,'none',0)+line('M70 9L71 16M74 11L73 18',cream,1.2));
 }else if(!art&&family==='tarsier'){
  const filipino=genus==='Carlito';form=filipino?'philippine-tarsier':'spectral-tarsier';
  art=p('M36 68C20 65 6 76 10 87Q15 95 24 89L22 85Q15 91 14 85Q10 78 31 77L44 77Z',light)
   +p('M42 60C25 57 21 69 29 79Q34 85 40 81L32 90Q27 95 35 96L51 87L54 73Z',dark)
   +p('M58 64Q75 57 79 69Q82 77 71 82L67 90L75 92Q82 95 77 98L62 96Q57 94 60 86L65 76L56 73Z',dark)
   +p(filipino?'M35 49Q30 39 42 33Q37 18 51 14Q67 10 77 25Q83 38 70 46L68 58Q75 72 59 80Q43 86 33 73Q27 61 35 49Z':'M34 49Q29 37 42 31Q39 17 53 14Q69 12 77 27Q81 41 68 46L68 60Q75 74 58 81Q41 86 32 72Q26 59 34 49Z')
   +ear(45,26,12,true)+ear(71,26,11,true)+p('M43 45Q32 46 33 56L42 65Q46 69 49 64L42 55L49 50Z',mid,ink,1.8)+p('M65 46Q76 46 76 57L70 65Q66 69 62 65L68 56L60 50Z',mid,ink,1.8)
   +detail(p('M43 25Q57 16 72 26L76 37L66 47L47 43L39 34Z',light,'none',0))+eyes(49,30,filipino?3.5:3.2)+eyes(66,31,filipino?3.7:3.4)+detail(p('M54 40L61 40L58 45Z',pink,'none',0)+line('M37 89L33 95M64 92L62 97M72 92L75 97',light,1.2));
 }else if(!art&&['lemur','aye-aye','loris','galago','tarsier'].includes(family)){
  const ring=morph==='ring-tailed-lemur',sifaka=morph==='sifaka',indri=morph==='indri',mouse=morph==='mouse-lemur',aye=family==='aye-aye',loris=family==='loris',galago=family==='galago',tarsier=family==='tarsier';
  const td=ring?'M39 67C19 66 10 50 13 32Q14 14 7 8Q24 8 25 28Q23 47 46 54Z':aye?'M39 66C17 55 4 68 8 83Q13 96 29 90L43 76Z':galago||tarsier?'M38 69C20 67 6 79 12 89Q20 98 27 86L24 82Q19 90 16 87Q10 80 27 78L44 78Z':!indri&&!sifaka&&!loris?'M38 65Q15 57 7 73Q4 87 17 91L36 80L45 72Z':null;
  if(td)art+=p(td,aye?dark:light);
  if(ring)art+=clipped(td,line('M9 15L24 14M10 25L27 25M10 37L29 38M15 48L35 48M24 58L43 58',black,4),'tail');
  art+=p(tarsier||galago?'M40 64Q23 61 23 75L34 84L30 91L41 94L49 84L43 74L50 68Z':'M37 67Q23 70 24 83L37 91L48 80Z',dark)+p(tarsier||galago?'M59 65Q78 61 79 75L67 85L71 91L60 94L51 84L58 74L51 68Z':'M62 67Q79 70 78 83L65 92L54 80Z',dark);
  body=aye?'M32 50Q31 37 44 33Q40 20 52 15Q68 9 76 24Q80 36 68 44L70 58Q79 75 63 84Q44 92 29 77Q20 64 32 50Z':loris?'M31 50Q27 36 41 30Q39 16 53 13Q69 8 77 25Q83 39 69 47L72 59Q78 77 60 85Q41 91 29 77Q20 65 31 50Z':tarsier?'M36 51Q31 39 42 33Q37 19 49 14Q65 8 74 22Q82 35 68 44L69 58Q76 74 59 82Q43 89 31 76Q23 64 36 51Z':sifaka?'M35 49Q32 34 44 29Q42 17 53 13Q69 10 75 26L71 39Q82 54 72 73Q64 89 46 85Q26 79 28 62Q28 54 35 49Z':indri?'M33 48Q29 34 43 28Q40 16 54 11Q72 9 78 26L73 40Q85 55 73 74Q62 91 43 85Q24 79 26 62Q27 53 33 48Z':'M34 51Q31 38 45 33Q41 21 52 16Q67 10 76 26Q81 38 69 45L70 60Q78 76 62 84Q43 91 30 77Q22 65 34 51Z';
  art+=p(body)+ear(45,26,aye?18:mouse?17:galago?22:tarsier?11:indri?11:8,true)+ear(69,25,aye?17:mouse?16:galago?20:tarsier?10:indri?10:8,true);
  art+=p(sifaka||indri?'M35 43Q23 42 21 57L16 75L20 85L29 84L29 75L35 60L43 52Z':'M36 47Q26 49 27 61L35 73L43 68L36 58L43 52Z',mid)+p(aye?'M66 45Q81 45 81 59L86 66L84 75L76 75L72 61L61 53Z':sifaka||indri?'M68 43Q82 44 83 58L89 78L85 86L75 85L73 75L65 59L59 51Z':'M65 47Q77 49 76 61L66 73L58 68L66 57L59 52Z',mid);
  art+=detail(p(ring?'M47 26Q58 17 70 26L73 37L63 47L48 42Z':sifaka||indri?'M47 24Q59 15 70 26L71 37L60 45L48 39Z':'M44 26Q56 17 70 26L73 38L61 47L46 40Z',sifaka||indri?black:light,'none',0));
  const er=tarsier?3.6:mouse||galago?2.7:aye?2.3:1.9;
  if(ring||loris)art+=detail(p('M46 27L54 26L56 37L48 39ZM61 26L69 28L69 39L61 37Z',dark,'none',0));
  art+=eyes(51,30,er)+eyes(66,30,er)+detail(p('M56 38L63 38L60 43Z',pink,'none',0)+line('M52 43Q60 48 67 42',dark,1.2));
  if(aye)art+=line('M81 67L94 60M81 70L96 69M81 73L91 79',light,1.6);
  if(tarsier||galago)art+=detail(line('M32 87L26 91M35 89L33 95M65 88L72 93M62 90L61 95',light,1.4));
  if(morph==='ruffed-lemur')art+=p('M45 34L37 30L37 44L46 49M69 34L79 31L78 45L69 48Z',cream,ink,1.5);
  flip=ring||galago;
 }
 if(body&&anatomy){const adjusted=adaptBody(body,anatomy);art=art.split('d=\"'+body+'\"').join('d=\"'+adjusted+'\"');}
 if(!art)throw new Error('Missing mammal anatomy: '+family+' / '+latin);
 const aura=skin==='alfa'?'<g data-mammal-aura="true">'+dot(50,50,43,'#e8d794').replace('/>',' opacity=".22"/>')+line('M14 18L17 24L23 27L17 30L14 36L11 30L5 27L11 24Z','#b99c61',1.5)+'</g>':'';
 return '<svg viewBox="0 0 100 100" aria-hidden="true" data-mammal-family="'+family+'" data-mammal-morph="'+form+'" data-mammal-version="3.19.4">'+aura+'<g'+(flip?' transform="translate(100 0) scale(-1 1)"':'')+'>'+art+'</g></svg>';
}
render.classify=classify;render.families=families;render.morphology=morphology;
root.ATLAS_MAMMAL_ART_V3194=render;
if(typeof module!=='undefined'&&module.exports)module.exports={classifyMammal:classify,renderMammal:render,MAMMAL_FAMILIES:families,mammalMorphology:morphology,MAMMAL_SPECIES_ANATOMY:speciesAnatomy};
})(typeof globalThis!=='undefined'?globalThis:this);

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

const STORAGE_KEY='gran_atlas_v05';
const MAX_OFFLINE_MS=8*60*60*1000;
const MAX_AUTOMATIC_SIGHTINGS_PER_SPECIES_PER_HOUR=100;
const THRESHOLDS=[10,50,100,200,500];
const SPECIES_KNOWLEDGE_COSTS=[100,500,1000,5000,10000];
const SPECIES_MONEY_COSTS=[10,50,100,500,1000];
const STAGE_LABELS=[
  'Conocer la zona donde vive',
  'Identificar su nombre científico',
  'Documentar actividad y conducta',
  'Estudiar alimentación o dimorfismo',
  'Completar monografía'
];

const REGIONS=[
  {
    "id": "HX-01-09",
    "name": "Islas Británicas",
    "code": "HX-01-09",
    "continent": "Europa",
    "unlock": {
      "prestige": 0
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "cisne_vulgar",
      "frailecillo_atlantico",
      "eu_esp_0654",
      "eu_esp_0649",
      "eu_esp_0636",
      "eu_esp_0631",
      "eu_esp_0629",
      "eu_esp_0628",
      "eu_esp_0637",
      "buho_comun",
      "eu_esp_0643",
      "eu_esp_0646",
      "zorro_rojo",
      "erizo_europeo",
      "nutria_europea",
      "tejon_europeo",
      "eu_esp_0617",
      "eu_esp_0619",
      "eu_esp_0614",
      "eu_esp_0612",
      "eu_esp_0613",
      "eu_esp_0611",
      "eu_esp_0604",
      "eu_esp_0606",
      "ardilla_roja",
      "corzo_europeo",
      "ciervo_rojo",
      "eu_esp_0669",
      "eu_esp_0661",
      "eu_esp_0660",
      "eu_esp_0656",
      "eu_esp_0655"
    ]
  },
  {
    "id": "HX-01-11",
    "name": "Escandinavia",
    "code": "HX-01-11",
    "continent": "Europa",
    "unlock": {
      "prestige": 1
    },
    "habitats": [
      "bosque",
      "tundra"
    ],
    "species": [
      "eu_esp_0654",
      "eu_esp_0640",
      "eu_esp_0267",
      "eu_esp_0639",
      "urogallo_comun",
      "lobo_gris",
      "zorro_artico",
      "lince_boreal",
      "gloton",
      "eu_esp_0621",
      "eu_esp_0618",
      "oso_pardo",
      "eu_esp_0610",
      "eu_esp_0604",
      "alce",
      "reno",
      "eu_esp_0669",
      "eu_esp_0660"
    ]
  },
  {
    "id": "HX-02-09",
    "name": "Alpes",
    "code": "HX-02-09",
    "continent": "Europa",
    "unlock": {
      "prestige": 2
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "eu_esp_0642",
      "perdiz_nival",
      "aguila_real",
      "quebrantahuesos",
      "lince_boreal",
      "eu_esp_0609",
      "liebre_variable",
      "marmota_alpina",
      "ibice_alpino",
      "rebeco_alpino",
      "eu_esp_0657",
      "salamandra_alpina",
      "vibora_aspid"
    ]
  },
  {
    "id": "HX-02-10",
    "name": "Europa Occidental",
    "code": "HX-02-10",
    "continent": "Europa",
    "unlock": {
      "prestige": 3
    },
    "habitats": [
      "bosque"
    ],
    "species": [
      "eu_esp_0652",
      "eu_esp_0650",
      "eu_esp_0653",
      "eu_esp_0631",
      "petirrojo",
      "eu_esp_0629",
      "eu_esp_0632",
      "eu_esp_0630",
      "eu_esp_0628",
      "eu_esp_0637",
      "eu_esp_0644",
      "eu_esp_0645",
      "buho_real",
      "eu_esp_0643",
      "milano_real",
      "eu_esp_0646",
      "zorro_rojo",
      "gato_montes",
      "eu_esp_0615",
      "eu_esp_0620",
      "eu_esp_0621",
      "tejon_europeo",
      "eu_esp_0618",
      "eu_esp_0622",
      "eu_esp_0617",
      "eu_esp_0619",
      "eu_esp_0614",
      "eu_esp_0616",
      "eu_esp_0612",
      "eu_esp_0613",
      "jabali",
      "eu_esp_0611",
      "eu_esp_0601",
      "eu_esp_0602",
      "eu_esp_0604",
      "eu_esp_0603",
      "eu_esp_0606",
      "eu_esp_0605",
      "ardilla_roja",
      "corzo_europeo",
      "ciervo_rojo",
      "eu_esp_0668",
      "eu_esp_0667",
      "eu_esp_0661",
      "eu_esp_0659",
      "eu_esp_0660",
      "eu_esp_0656",
      "salamandra_comun",
      "eu_esp_0655",
      "eu_esp_0666",
      "eu_esp_0665",
      "vibora_aspid"
    ]
  },
  {
    "id": "HX-02-11",
    "name": "Europa Central",
    "code": "HX-02-11",
    "continent": "Europa",
    "unlock": {
      "prestige": 4
    },
    "habitats": [
      "bosque"
    ],
    "species": [
      "cisne_vulgar",
      "eu_esp_0652",
      "eu_esp_0629",
      "eu_esp_0632",
      "eu_esp_0638",
      "eu_esp_0630",
      "eu_esp_0628",
      "eu_esp_0637",
      "eu_esp_0644",
      "eu_esp_0643",
      "lobo_gris",
      "gato_montes",
      "lince_boreal",
      "eu_esp_0159",
      "eu_esp_0615",
      "nutria_europea",
      "eu_esp_0620",
      "eu_esp_0621",
      "tejon_europeo",
      "eu_esp_0617",
      "eu_esp_0619",
      "eu_esp_0612",
      "jabali",
      "eu_esp_0611",
      "castor_europeo",
      "eu_esp_0602",
      "eu_esp_0603",
      "eu_esp_0605",
      "eu_esp_0608",
      "corzo_europeo",
      "ciervo_rojo",
      "eu_esp_0668",
      "eu_esp_0669",
      "eu_esp_0667",
      "eu_esp_0657",
      "eu_esp_0655",
      "eu_esp_0665"
    ]
  },
  {
    "id": "HX-02-12",
    "name": "Península Ibérica",
    "code": "HX-02-12",
    "continent": "Europa",
    "unlock": {
      "prestige": 5
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "eu_esp_0653",
      "eu_esp_0641",
      "eu_esp_0633",
      "eu_esp_0635",
      "eu_esp_0634",
      "aguila_imperial_iberica",
      "eu_esp_0645",
      "eu_esp_0647",
      "buitre_leonado",
      "milano_real",
      "eu_esp_0646",
      "lobo_gris",
      "lince_iberico",
      "eu_esp_0623",
      "eu_esp_0219",
      "eu_esp_0620",
      "eu_esp_0614",
      "eu_esp_0616",
      "jabali",
      "eu_esp_0601",
      "eu_esp_0607",
      "conejo_europeo",
      "cabra_montes_iberica",
      "ciervo_rojo",
      "eu_esp_0626",
      "eu_esp_0116",
      "lagarto_ocelado",
      "eu_esp_0659",
      "eu_esp_0666"
    ]
  },
  {
    "id": "HX-03-09",
    "name": "Europa Oriental",
    "code": "HX-03-09",
    "continent": "Europa",
    "unlock": {
      "prestige": 6
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "eu_esp_0636",
      "eu_esp_0029",
      "lobo_gris",
      "zorro_rojo",
      "lince_boreal",
      "eu_esp_0624",
      "eu_esp_0622",
      "jabali",
      "eu_esp_0625",
      "castor_europeo",
      "liebre_europea",
      "eu_esp_0603",
      "eu_esp_0608",
      "alce",
      "bisonte_europeo",
      "ciervo_rojo",
      "eu_esp_0670"
    ]
  },
  {
    "id": "HX-03-10",
    "name": "Península Itálica",
    "code": "HX-03-10",
    "continent": "Europa",
    "unlock": {
      "prestige": 7
    },
    "habitats": [
      "bosque",
      "pradera"
    ],
    "species": [
      "eu_esp_0641",
      "eu_esp_0635",
      "eu_esp_0634",
      "eu_esp_0647",
      "eu_esp_0204",
      "lobo_gris",
      "zorro_rojo",
      "gato_montes",
      "eu_esp_0253",
      "jabali",
      "oso_pardo",
      "eu_esp_0602",
      "corzo_europeo",
      "eu_esp_0627",
      "vibora_aspid",
      "eu_esp_0506"
    ]
  },
  {
    "id": "HX-03-11",
    "name": "Región del mar Báltico",
    "code": "HX-03-11",
    "continent": "Europa",
    "unlock": {
      "prestige": 8
    },
    "habitats": [
      "bosque",
      "rio"
    ],
    "species": [
      "ciguena_negra",
      "eu_esp_0144",
      "eu_esp_0654",
      "eu_esp_0650",
      "eu_esp_0649",
      "eu_esp_0640",
      "eu_esp_0630",
      "eu_esp_0639",
      "eu_esp_0644",
      "eu_esp_0232",
      "lobo_gris",
      "lince_boreal",
      "nutria_europea",
      "eu_esp_0618",
      "castor_europeo",
      "eu_esp_0605",
      "alce",
      "corzo_europeo",
      "eu_esp_0670",
      "eu_esp_0665"
    ]
  },
  {
    "id": "HX-03-12",
    "name": "Balcanes",
    "code": "HX-03-12",
    "continent": "Europa",
    "unlock": {
      "prestige": 9
    },
    "habitats": [
      "bosque"
    ],
    "species": [
      "eu_esp_0642",
      "eu_esp_0632",
      "eu_esp_0638",
      "eu_esp_0634",
      "aguila_real",
      "buitre_leonado",
      "lobo_gris",
      "gato_montes",
      "lince_boreal",
      "jabali",
      "oso_pardo",
      "eu_esp_0625",
      "eu_esp_0609",
      "eu_esp_0627",
      "rebeco_alpino",
      "eu_esp_0505"
    ]
  },
  {
    "id": "HX-03-13",
    "name": "Cáucaso",
    "code": "HX-03-13",
    "continent": "Asia",
    "unlock": {
      "prestige": 10
    },
    "habitats": [
      "bosque",
      "montana",
      "pradera"
    ],
    "species": [
      "aguila_real",
      "quebrantahuesos",
      "lobo_gris",
      "lince_boreal",
      "asia_esp_0401",
      "jabali",
      "oso_pardo",
      "asia_esp_0081",
      "asia_esp_0149",
      "asia_esp_0903"
    ]
  },
  {
    "id": "HX-03-15",
    "name": "Anatolia",
    "code": "HX-03-15",
    "continent": "Asia",
    "unlock": {
      "prestige": 12
    },
    "habitats": [
      "bosque",
      "pradera",
      "montana",
      "estepa"
    ],
    "species": [
      "aguila_real",
      "lobo_gris",
      "asia_esp_0088",
      "gato_montes",
      "lince_boreal",
      "jabali",
      "oso_pardo",
      "asia_esp_0080",
      "asia_esp_0903",
      "eu_esp_0505"
    ]
  },
  {
    "id": "HX-02-13",
    "name": "Siberia Occidental",
    "code": "HX-02-13",
    "continent": "Asia",
    "unlock": {
      "prestige": 14
    },
    "habitats": [
      "bosque",
      "rio",
      "tundra",
      "pradera"
    ],
    "species": [
      "asia_esp_0287",
      "asia_esp_0880",
      "asia_esp_0861",
      "asia_esp_0886",
      "lobo_gris",
      "lince_boreal",
      "gloton",
      "asia_esp_0326",
      "asia_esp_0843",
      "oso_pardo",
      "castor_europeo",
      "alce",
      "reno",
      "asia_esp_0914"
    ]
  },
  {
    "id": "HX-03-14",
    "name": "Siberia Central",
    "code": "HX-03-14",
    "continent": "Asia",
    "unlock": {
      "prestige": 16
    },
    "habitats": [
      "bosque",
      "tundra",
      "rio",
      "pradera"
    ],
    "species": [
      "asia_esp_0880",
      "asia_esp_0861",
      "urogallo_comun",
      "asia_esp_0886",
      "lobo_gris",
      "lince_boreal",
      "gloton",
      "asia_esp_0326",
      "asia_esp_0843",
      "oso_pardo",
      "liebre_variable",
      "alce",
      "reno",
      "asia_esp_0914",
      "asia_esp_0899"
    ]
  },
  {
    "id": "HX-04-13",
    "name": "Mongolia",
    "code": "HX-04-13",
    "continent": "Asia",
    "unlock": {
      "prestige": 18
    },
    "habitats": [
      "estepa",
      "pradera",
      "montana",
      "rio"
    ],
    "species": [
      "asia_esp_0020",
      "asia_esp_0030",
      "asia_esp_0887",
      "lobo_gris",
      "asia_esp_0533",
      "asia_esp_0387",
      "asia_esp_0323",
      "asia_esp_0184",
      "asia_esp_0441",
      "asia_esp_0898"
    ]
  },
  {
    "id": "HX-02-15",
    "name": "Montes Urales",
    "code": "HX-02-15",
    "continent": "Asia",
    "unlock": {
      "prestige": 20
    },
    "habitats": [
      "bosque",
      "montana",
      "pradera",
      "rio"
    ],
    "species": [
      "urogallo_comun",
      "lobo_gris",
      "zorro_rojo",
      "lince_boreal",
      "gloton",
      "asia_esp_0326",
      "oso_pardo",
      "alce"
    ]
  },
  {
    "id": "HX-03-16",
    "name": "Siberia Oriental",
    "code": "HX-03-16",
    "continent": "Asia",
    "unlock": {
      "prestige": 22
    },
    "habitats": [
      "bosque",
      "tundra",
      "montana",
      "rio"
    ],
    "species": [
      "asia_esp_0861",
      "lobo_gris",
      "lince_boreal",
      "asia_esp_0401",
      "asia_esp_0402",
      "asia_esp_0326",
      "asia_esp_0843",
      "oso_pardo",
      "asia_esp_0086",
      "asia_esp_0344",
      "reno",
      "asia_esp_0899"
    ]
  },
  {
    "id": "HX-03-18",
    "name": "Kamchatka",
    "code": "HX-03-18",
    "continent": "Asia",
    "unlock": {
      "prestige": 24
    },
    "habitats": [
      "tundra",
      "costa",
      "rio",
      "bosque"
    ],
    "species": [
      "asia_esp_0209",
      "asia_esp_0203",
      "asia_esp_0234",
      "zorro_rojo",
      "asia_esp_0177",
      "oso_pardo",
      "reno",
      "asia_esp_0369",
      "asia_esp_0371",
      "asia_esp_0899"
    ]
  },
  {
    "id": "HX-04-14",
    "name": "Desierto de Gobi",
    "code": "HX-04-14",
    "continent": "Asia",
    "unlock": {
      "prestige": 26
    },
    "habitats": [
      "desierto",
      "estepa",
      "pradera",
      "montana"
    ],
    "species": [
      "asia_esp_0881",
      "aguila_real",
      "asia_esp_0533",
      "oso_pardo",
      "asia_esp_0194",
      "asia_esp_0073",
      "asia_esp_0441",
      "asia_esp_0431",
      "asia_esp_0898"
    ]
  },
  {
    "id": "HX-04-15",
    "name": "Himalaya",
    "code": "HX-04-15",
    "continent": "Asia",
    "unlock": {
      "prestige": 28
    },
    "habitats": [
      "montana",
      "pradera",
      "bosque",
      "rio"
    ],
    "species": [
      "asia_esp_0863",
      "asia_esp_0294",
      "asia_esp_0864",
      "asia_esp_0503",
      "asia_esp_0865",
      "aguila_real",
      "lobo_gris",
      "asia_esp_0820",
      "asia_esp_0403",
      "asia_esp_0007",
      "asia_esp_0855",
      "asia_esp_0850",
      "asia_esp_0844",
      "asia_esp_0523",
      "asia_esp_0062",
      "asia_esp_0821",
      "asia_esp_0240",
      "asia_esp_0445"
    ]
  },
  {
    "id": "HX-03-17",
    "name": "Península Arábiga",
    "code": "HX-03-17",
    "continent": "Asia",
    "unlock": {
      "prestige": 30
    },
    "habitats": [
      "desierto",
      "estepa",
      "pradera",
      "montana"
    ],
    "species": [
      "lobo_gris",
      "asia_esp_0538",
      "asia_esp_0088",
      "asia_esp_0206",
      "asia_esp_0214",
      "asia_esp_0383",
      "asia_esp_0519",
      "asia_esp_0102"
    ]
  },
  {
    "id": "HX-04-12",
    "name": "Mesopotamia",
    "code": "HX-04-12",
    "continent": "Asia",
    "unlock": {
      "prestige": 32
    },
    "habitats": [
      "humedal",
      "rio",
      "estepa",
      "pradera"
    ],
    "species": [
      "garza_real",
      "pelicano_cenudo",
      "flamenco_comun",
      "zorro_rojo",
      "asia_esp_0205",
      "asia_esp_0300",
      "jabali",
      "asia_esp_0065",
      "asia_esp_0910",
      "asia_esp_0327"
    ]
  },
  {
    "id": "HX-04-16",
    "name": "Meseta de Irán",
    "code": "HX-04-16",
    "continent": "Asia",
    "unlock": {
      "prestige": 34
    },
    "habitats": [
      "estepa",
      "desierto",
      "pradera",
      "montana"
    ],
    "species": [
      "asia_esp_0873",
      "asia_esp_0881",
      "lobo_gris",
      "asia_esp_0088",
      "asia_esp_0206",
      "asia_esp_0401",
      "asia_esp_0246",
      "oso_pardo",
      "asia_esp_0080",
      "asia_esp_0182",
      "asia_esp_0218"
    ]
  },
  {
    "id": "HX-04-17",
    "name": "Meseta del Tíbet",
    "code": "HX-04-17",
    "continent": "Asia",
    "unlock": {
      "prestige": 36
    },
    "habitats": [
      "montana",
      "tundra",
      "pradera",
      "rio"
    ],
    "species": [
      "asia_esp_0227",
      "asia_esp_0534",
      "asia_esp_0403",
      "asia_esp_0321",
      "asia_esp_0062",
      "asia_esp_0821",
      "asia_esp_0183",
      "asia_esp_0404",
      "asia_esp_0442",
      "asia_esp_0445"
    ]
  },
  {
    "id": "HX-04-18",
    "name": "Estepas de Asia Central",
    "code": "HX-04-18",
    "continent": "Asia",
    "unlock": {
      "prestige": 38
    },
    "habitats": [
      "estepa",
      "pradera",
      "montana",
      "rio"
    ],
    "species": [
      "asia_esp_0030",
      "asia_esp_0887",
      "lobo_gris",
      "asia_esp_0533",
      "asia_esp_0347",
      "asia_esp_0194",
      "asia_esp_0319",
      "asia_esp_0184",
      "asia_esp_0441",
      "asia_esp_0468"
    ]
  },
  {
    "id": "HX-05-15",
    "name": "China Septentrional",
    "code": "HX-05-15",
    "continent": "Asia",
    "unlock": {
      "prestige": 40
    },
    "habitats": [
      "bosque",
      "estepa",
      "pradera",
      "rio"
    ],
    "species": [
      "asia_esp_0891",
      "asia_esp_0890",
      "asia_esp_0226",
      "asia_esp_0878",
      "asia_esp_0422",
      "lobo_gris",
      "zorro_rojo",
      "asia_esp_0401",
      "asia_esp_0402",
      "asia_esp_0842",
      "jabali",
      "asia_esp_0086",
      "asia_esp_0824",
      "asia_esp_0344",
      "asia_esp_0915",
      "asia_esp_0910",
      "asia_esp_0911"
    ]
  },
  {
    "id": "HX-05-16",
    "name": "Subcontinente Indio",
    "code": "HX-05-16",
    "continent": "Asia",
    "unlock": {
      "prestige": 42
    },
    "habitats": [
      "bosque",
      "sabana",
      "pradera",
      "rio"
    ],
    "species": [
      "asia_esp_0888",
      "asia_esp_0868",
      "asia_esp_0872",
      "asia_esp_0873",
      "asia_esp_0410",
      "asia_esp_0874",
      "asia_esp_0401",
      "asia_esp_0402",
      "asia_esp_0816",
      "asia_esp_0176",
      "asia_esp_0855",
      "asia_esp_0852",
      "asia_esp_0336",
      "asia_esp_0860",
      "asia_esp_0853",
      "asia_esp_0476",
      "asia_esp_0833",
      "asia_esp_0050",
      "asia_esp_0061",
      "asia_esp_0063",
      "asia_esp_0830",
      "asia_esp_0465",
      "asia_esp_0825",
      "asia_esp_0900",
      "asia_esp_0136",
      "asia_esp_0906",
      "asia_esp_0905",
      "asia_esp_0351"
    ]
  },
  {
    "id": "HX-05-17",
    "name": "China Meridional",
    "code": "HX-05-17",
    "continent": "Asia",
    "unlock": {
      "prestige": 44
    },
    "habitats": [
      "bosque",
      "selva",
      "rio",
      "montana"
    ],
    "species": [
      "asia_esp_0124",
      "asia_esp_0864",
      "asia_esp_0296",
      "asia_esp_0096",
      "asia_esp_0355",
      "asia_esp_0006",
      "asia_esp_0842",
      "asia_esp_0318",
      "asia_esp_0854",
      "asia_esp_0395",
      "asia_esp_0856",
      "asia_esp_0523",
      "asia_esp_0310",
      "asia_esp_0821",
      "asia_esp_0345",
      "asia_esp_0910",
      "asia_esp_0911",
      "asia_esp_0902",
      "asia_esp_0016"
    ]
  },
  {
    "id": "HX-06-16",
    "name": "Península de Corea",
    "code": "HX-06-16",
    "continent": "Asia",
    "unlock": {
      "prestige": 46
    },
    "habitats": [
      "bosque",
      "pradera",
      "rio",
      "costa"
    ],
    "species": [
      "asia_esp_0891",
      "asia_esp_0890",
      "asia_esp_0226",
      "asia_esp_0878",
      "asia_esp_0433",
      "zorro_rojo",
      "asia_esp_0440",
      "asia_esp_0333",
      "jabali",
      "asia_esp_0523",
      "asia_esp_0111",
      "asia_esp_0249",
      "asia_esp_0915"
    ]
  },
  {
    "id": "HX-06-17",
    "name": "Sudeste Asiático",
    "code": "HX-06-17",
    "continent": "Asia",
    "unlock": {
      "prestige": 48
    },
    "habitats": [
      "selva",
      "bosque",
      "rio",
      "humedal"
    ],
    "species": [
      "asia_esp_0888",
      "asia_esp_0868",
      "asia_esp_0067",
      "asia_esp_0867",
      "asia_esp_0869",
      "asia_esp_0883",
      "asia_esp_0820",
      "asia_esp_0355",
      "asia_esp_0402",
      "asia_esp_0816",
      "asia_esp_0849",
      "asia_esp_0858",
      "asia_esp_0176",
      "asia_esp_0238",
      "asia_esp_0857",
      "asia_esp_0317",
      "asia_esp_0850",
      "asia_esp_0854",
      "asia_esp_0860",
      "asia_esp_0844",
      "asia_esp_0853",
      "asia_esp_0859",
      "asia_esp_0251",
      "asia_esp_0352",
      "asia_esp_0436",
      "asia_esp_0491",
      "asia_esp_0165",
      "asia_esp_0825",
      "asia_esp_0834",
      "asia_esp_0498",
      "asia_esp_0901",
      "asia_esp_0902",
      "asia_esp_0527",
      "asia_esp_0316",
      "asia_esp_0373"
    ]
  },
  {
    "id": "HX-06-18",
    "name": "Archipiélago Japonés",
    "code": "HX-06-18",
    "continent": "Asia",
    "unlock": {
      "prestige": 50
    },
    "habitats": [
      "bosque",
      "montana",
      "costa",
      "rio"
    ],
    "species": [
      "asia_esp_0891",
      "asia_esp_0890",
      "asia_esp_0226",
      "asia_esp_0877",
      "asia_esp_0494",
      "asia_esp_0886",
      "asia_esp_0363",
      "asia_esp_0440",
      "asia_esp_0414",
      "asia_esp_0523",
      "asia_esp_0308",
      "asia_esp_0087",
      "asia_esp_0111",
      "asia_esp_0017"
    ]
  }
];

// v3.4: tres regiones iniciales de África, sin modificar las anteriores.
REGIONS.push(...[{"id":"HX-06-09","name":"Magreb","code":"HX-06-09","continent":"África","unlock":{"prestige":53},"habitats":["desierto","estepa","costa","pradera"],"species":["af_fenec","af_dromedario","af_gacela_dorcas","af_chacal_dorado","af_ibis_eremita","af_serval","af_cobra_egipcia","af_arrui"]},{"id":"HX-07-10","name":"Sabana de África oriental","code":"HX-07-10","continent":"África","unlock":{"prestige":56},"habitats":["pradera","estepa","rio","humedal"],"species":["af_leon","af_elefante_sabana","af_rinoceronte_blanco","af_bufalo_cafre","af_licaon","af_cocodrilo_nilo","af_aguila_pescadora","af_piton_africana","af_serval"]},{"id":"HX-08-11","name":"Cuenca del Congo","code":"HX-08-11","continent":"África","unlock":{"prestige":59},"habitats":["bosque","humedal","rio","pradera"],"species":["af_gorila_occidental","af_chimpance","af_pangolin_gigante","af_leopardo","af_elefante_bosque","af_loro_gris","af_colobo","af_cocodrilo_hocico"]}]);
// v3.5 · nuevas zonas de África, sin modificar los registros anteriores.
REGIONS.push(...[{"id":"HX-06-11","name":"Valle del Nilo","code":"HX-06-11","continent":"África","unlock":{"prestige":62},"habitats":["rio","humedal","estepa"],"species":["af_hipopotamo","af_cocodrilo_nilo","af_ibis_sagrado","af_garza_goliat","af_abejaruco_carmin","af_avestruz","af_cobra_egipcia"]},{"id":"HX-07-08","name":"Sahel occidental","code":"HX-07-08","continent":"África","unlock":{"prestige":65},"habitats":["estepa","desierto","pradera"],"species":["af_orix","af_zorro_palido","af_gacela_dorcas","af_chacal_dorado","af_arrui","af_jirafa","af_avestruz"]},{"id":"HX-08-08","name":"Bosques de África occidental","code":"HX-08-08","continent":"África","unlock":{"prestige":68},"habitats":["bosque","humedal","rio"],"species":["af_antilope_bongo","af_duiker_azul","af_civeta","af_mandril","af_turaco","af_chimpance","af_loro_gris","af_leopardo"]},{"id":"HX-09-11","name":"Grandes Lagos africanos","code":"HX-09-11","continent":"África","unlock":{"prestige":71},"habitats":["bosque","pradera","humedal"],"species":["af_gorila_montana","af_galago","af_babuino_oliva","af_grulla_coronada","af_bufalo_cafre","af_hipopotamo","af_cocodrilo_nilo","af_leopardo"]},{"id":"HX-10-10","name":"Kalahari y sabana austral","code":"HX-10-10","continent":"África","unlock":{"prestige":74},"habitats":["desierto","estepa","pradera"],"species":["af_suricata","af_caracal","af_springbok","af_guepardo","af_orix","af_hiena_manchada","af_nu_azul","af_cebra_llanura","af_avestruz"]},{"id":"HX-11-11","name":"Costa del Cabo","code":"HX-11-11","continent":"África","unlock":{"prestige":77},"habitats":["costa","pradera","estepa"],"species":["af_pinguino_africano","af_lobo_marino_cabo","af_tiburon_blanco","af_tortuga_laúd","af_eland","af_secretario","af_babuino_oliva"]},{"id":"HX-09-14","name":"Madagascar","code":"HX-09-14","continent":"África","unlock":{"prestige":80},"habitats":["bosque","pradera","costa"],"species":["af_lemur_colaanillada","af_sifaka","af_fosa","af_camaleon_pantera","af_gecko_diurno","af_tenrec","af_indri","af_tortuga_radiada","af_fosa_ave"]}]);
// Beta 3.7: tres regiones nuevas de África.
REGIONS.push(...[{"id":"HX-07-12","name":"Cuerno de África","code":"HX-07-12","continent":"África","unlock":{"prestige":83},"habitats":["estepa","desierto","pradera"],"species":["af_asno_somali","af_gerenuc","af_dikdik_guenther","af_babuino_hamadryas","af_gacela_dorcas","af_avestruz","af_caracal","af_hiena_manchada","af_orix"]},{"id":"HX-10-09","name":"Delta del Okavango","code":"HX-10-09","continent":"África","unlock":{"prestige":86},"habitats":["humedal","rio","pradera"],"species":["af_lechwe_rojo","af_jacana_africana","af_sitatunga","af_hipopotamo","af_cocodrilo_nilo","af_elefante_sabana","af_bufalo_cafre","af_grulla_coronada","af_aguila_pescadora","af_abejaruco_carmin"]},{"id":"HX-08-10","name":"Bosques de Gabón","code":"HX-08-10","continent":"África","unlock":{"prestige":89},"habitats":["bosque","humedal","rio"],"species":["af_potamoquero","af_mono_brazza","af_picatartes_gris","af_gorila_occidental","af_mandril","af_elefante_bosque","af_pangolin_gigante","af_antilope_bongo","af_loro_gris","af_duiker_azul"]}]);
// Beta 3.8: ampliación gradual de África, sin modificar códigos existentes.
REGIONS.push(...[{"id":"HX-07-13","name":"Tierras altas de Etiopía","code":"HX-07-13","continent":"África","unlock":{"prestige":92},"habitats":["montana","pradera","humedal","rio"],"species":["af_lobo_etiope","af_gelada","af_ibice_walia","af_quebrantahuesos","af_nyala_montana","af_ganso_alas_azules","af_babuino_oliva","af_ibis_sagrado"]},{"id":"HX-11-08","name":"Desierto del Namib","code":"HX-11-08","continent":"África","unlock":{"prestige":95},"habitats":["desierto","estepa","costa","pradera"],"species":["af_zorro_cabo","af_hiena_parda","af_camaleon_namaqua","af_geco_patas_palmeadas","af_orix","af_springbok","af_suricata","af_avestruz","af_caracal"]}]);
// v3.9: nuevas zonas africanas, sin editar identificadores ni regiones anteriores.
REGIONS.push(...[{"id":"HX-06-08","name":"Montañas del Atlas","code":"HX-06-08","continent":"África","unlock":{"prestige":98},"habitats":["montana","bosque","estepa","desierto"],"species":["af_macaco_berberia","af_gato_montes_africano","af_ciervo_berberia","af_zorro_ruppell","af_arrui","af_fenec","af_chacal_dorado","af_gacela_dorcas","af_cobra_egipcia"]},{"id":"HX-09-09","name":"Bosques de miombo","code":"HX-09-09","continent":"África","unlock":{"prestige":101},"habitats":["bosque","pradera","estepa"],"species":["af_antilope_sable","af_calao_terrestre","af_pangolin_temminck","af_inseparable_lilian","af_elefante_sabana","af_licaon","af_leopardo","af_babuino_oliva","af_guepardo"]},{"id":"HX-10-12","name":"Costa de Mozambique","code":"HX-10-12","continent":"África","unlock":{"prestige":104},"habitats":["costa","rio","humedal"],"species":["af_dugongo","af_manta_gigante","af_delfin_jorobado_indico","af_martin_malaquita","af_tortuga_laúd","af_tiburon_blanco","af_cocodrilo_nilo","af_hipopotamo","af_garza_goliat","af_aguila_pescadora"]}]);
// Beta 3.10: dos áreas africanas, sin modificar los IDs previos.
REGIONS.push(...[{"id":"HX-08-12","name":"Lagos del Rift","code":"HX-08-12","continent":"África","unlock":{"prestige":107},"habitats":["humedal","rio","pradera","estepa"],"species":["af_flamenco_enano","af_pelicano_blanco","af_jirafa_rothschild","af_gran_kudu","af_hipopotamo","af_leon","af_bufalo_cafre","af_aguila_pescadora","af_guepardo"]},{"id":"HX-07-14","name":"Islas Seychelles y Aldabra","code":"HX-07-14","continent":"África","unlock":{"prestige":110},"habitats":["costa","bosque","pradera"],"species":["af_tortuga_aldabra","af_loro_negro_seychelles","af_cernicalo_seychelles","af_tiburon_puntas_negras","af_tortuga_laúd","af_manta_gigante","af_dugongo","af_delfin_jorobado_indico"]}]);
// Beta 3.12: humedales de Bangweulu y Lowveld (meta africana 24 zonas).
REGIONS.push(...[{"id":"HX-09-12","name":"Humedales de Bangweulu","code":"HX-09-12","continent":"África","unlock":{"prestige":113},"habitats":["humedal","rio","pradera","bosque"],"species":["af_picozapato","af_lechwe_negro","af_grulla_carunculada","af_puku","af_sitatunga","af_hipopotamo","af_jacana_africana","af_pelicano_blanco","af_grulla_coronada","af_aguila_pescadora"]},{"id":"HX-11-10","name":"Lowveld y Kruger","code":"HX-11-10","continent":"África","unlock":{"prestige":116},"habitats":["pradera","bosque","estepa","rio"],"species":["af_impala","af_nyala_comun","af_mangosta_enana","af_calao_trompetero","af_rinoceronte_blanco","af_elefante_sabana","af_leopardo","af_leon","af_bufalo_cafre","af_calao_terrestre","af_antilope_sable"]}]);
// Beta 3.13: dos hexágonos africanos nuevos; los ID históricos permanecen intactos.
REGIONS.push(...[{"id":"HX-06-07","name":"Desierto del Sáhara","continent":"África","unlock":{"prestige":119},"habitats":["desierto","estepa"],"species":["af_xlsx_sahara_buitre","af_fenec","asia_esp_0206","af_xlsx_jerbo","af_xlsx_addax","af_gacela_dorcas","af_xlsx_geco_desierto","af_xlsx_vibora_cornuda"],"code":"HX-06-07"},{"id":"HX-07-11","name":"Sahel oriental","continent":"África","unlock":{"prestige":122},"habitats":["estepa","pradera","desierto"],"species":["af_abejaruco_carmin","af_avestruz","af_xlsx_sahara_buitre","af_licaon","af_guepardo","af_hiena_manchada","af_xlsx_alcefalo","af_xlsx_gacela_frente_roja","af_gacela_dorcas","af_xlsx_orix_cimitarra","af_facoquero"],"code":"HX-07-11"}]);
// Apertura inicial de Norteamérica, según Excel base: Alaska y Columbia Británica.
REGIONS.push(...[{"id":"HX-01-05","name":"Alaska","code":"HX-01-05","continent":"Norteamérica","unlock":{"prestige":125},"habitats":["bosque","tundra","montana","rio"],"species":["na_esp_anser_caerulescens","na_esp_corvus_corax","aguila_real","na_esp_bubo_scandiacus","na_esp_falco_peregrinus","lobo_gris","zorro_rojo","na_esp_dicrostonyx_groenlandicus","gloton","na_esp_lemmus_trimucronatus","na_esp_ursus_americanus","oso_pardo","na_esp_castor_canadensis","alce","na_esp_ovibos_moschatus","na_esp_ovis_dalli","reno"]},{"id":"HX-02-02","name":"Columbia Británica","code":"HX-02-02","continent":"Norteamérica","unlock":{"prestige":128},"habitats":["bosque","rio","costa","montana"],"species":["na_esp_dryocopus_pileatus","na_esp_haliaeetus_leucocephalus","lobo_gris","na_esp_puma_concolor","na_esp_lontra_canadensis","na_esp_ursus_americanus","oso_pardo","na_esp_castor_canadensis","na_esp_marmota_vancouverensis","na_esp_odocoileus_hemionus","na_esp_oncorhynchus_mykiss"]}]);
const SPECIES={
  "asia_esp_0287":{"name": "Grulla siberiana", "latin": "Leucogeranus leucogeranus", "rare": "Muy rara", "kind": "stork", "color": "#e8e5df", "habitats": ["rio", "pradera"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0880":{"name": "Gallo lira", "latin": "Lyrurus tetrix", "rare": "Común", "kind": "forestbird", "color": "#292f36", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": true},
  "asia_esp_0861":{"name": "Arrendajo de Siberia", "latin": "Perisoreus infaustus", "rare": "Común", "kind": "songbird", "color": "#9c765c", "habitats": ["bosque"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico"], "dimorphism": false},
  "asia_esp_0886":{"name": "Azor común", "latin": "Accipiter gentilis", "rare": "Raro", "kind": "raptor", "color": "#81654a", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0326":{"name": "Marta cibelina", "latin": "Martes zibellina", "rare": "Común", "kind": "mustelid", "color": "#5c4939", "habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico"], "dimorphism": false},
  "asia_esp_0843":{"name": "Ardilla voladora siberiana", "latin": "Pteromys volans", "rare": "Poco común", "kind": "small", "color": "#8d7660", "habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0914":{"name": "Esturión siberiano", "latin": "Acipenser baerii", "rare": "Común", "kind": "fish", "color": "#6d8184", "habitats": ["rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Albino"], "dimorphism": false},
  "asia_esp_0899":{"name": "Salamandra siberiana", "latin": "Salamandrella keyserlingii", "rare": "Muy rara", "kind": "salamander", "color": "#706a52", "habitats": ["bosque", "tundra", "rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucística", "Notable"], "dimorphism": false},
  "asia_esp_0020":{"name": "Grulla damisela", "latin": "Anthropoides virgo", "rare": "Común", "kind": "stork", "color": "#a2a6ab", "habitats": ["estepa", "pradera", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0030":{"name": "Águila esteparia", "latin": "Aquila nipalensis", "rare": "Común", "kind": "raptor", "color": "#705139", "habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico"], "dimorphism": false},
  "asia_esp_0887":{"name": "Halcón sacre", "latin": "Falco cherrug", "rare": "Raro", "kind": "raptor", "color": "#9b775a", "habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0533":{"name": "Zorro corsac", "latin": "Vulpes corsac", "rare": "Poco común", "kind": "canid", "color": "#c1a278", "habitats": ["estepa", "pradera"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0387":{"name": "Manul", "latin": "Otocolobus manul", "rare": "Común", "kind": "cat", "color": "#9c9b91", "habitats": ["estepa", "montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0323":{"name": "Marmota siberiana", "latin": "Marmota sibirica", "rare": "Común", "kind": "small", "color": "#aa8a65", "habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico"], "dimorphism": false},
  "asia_esp_0184":{"name": "Caballo de Przewalski", "latin": "Equus przewalskii", "rare": "Poco común", "kind": "deer", "color": "#b9936d", "habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0441":{"name": "Gacela de Mongolia", "latin": "Procapra gutturosa", "rare": "Poco común", "kind": "deer", "color": "#ba9b71", "habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": true},
  "asia_esp_0898":{"name": "Sapo mongol", "latin": "Strauchbufo raddei", "rare": "Raro", "kind": "reptile", "color": "#8b9370", "habitats": ["estepa", "pradera", "rio"], "times": ["dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico"], "dimorphism": false},
  zorro_rojo:{name:'Zorro rojo', latin:'Vulpes vulpes', rare:'Común', kind:'canid', color:'#d66a2c', habitats:['bosque','pradera'], times:['amanecer','atardecer','noche'], seasons:['primavera','verano','otono','invierno'], special:['Melánico','Leucístico','Notable'], dimorphism:false},
  tejon_europeo:{name:'Tejón europeo', latin:'Meles meles', rare:'Raro', kind:'mustelid', color:'#a58f76', habitats:['bosque'], times:['noche'], seasons:['primavera','verano','otono'], special:['Leucístico'], dimorphism:false},
  erizo_europeo:{name:'Erizo europeo', latin:'Erinaceus europaeus', rare:'Común', kind:'small', color:'#8f6e53', habitats:['bosque','pradera'], times:['atardecer','noche'], seasons:['primavera','verano','otono'], special:['Albino'], dimorphism:false},
  ciervo_rojo:{name:'Ciervo rojo', latin:'Cervus elaphus', rare:'Común', kind:'deer', color:'#a76b3b', habitats:['bosque','pradera'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono','invierno'], special:['Notable'], dimorphism:true},
  nutria_europea:{name:'Nutria europea', latin:'Lutra lutra', rare:'Común', kind:'otter', color:'#7b5b39', habitats:['rio'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono','invierno'], special:['Leucístico','Melánico','Notable'], dimorphism:false},
  ardilla_roja:{name:'Ardilla roja', latin:'Sciurus vulgaris', rare:'Común', kind:'small', color:'#c76a2f', habitats:['bosque'], times:['amanecer','dia'], seasons:['primavera','verano','otono'], special:['Melánica'], dimorphism:false},
  frailecillo_atlantico:{name:'Frailecillo atlántico', latin:'Fratercula arctica', rare:'Muy rara', kind:'seabird', color:'#232323', habitats:['costa'], times:['dia','atardecer'], seasons:['primavera','verano'], special:['Notable'], dimorphism:false},
  buho_comun:{name:'Búho común', latin:'Asio otus', rare:'Poco común', kind:'owl', color:'#8d6a40', habitats:['bosque'], times:['atardecer','noche'], seasons:['primavera','verano','otono','invierno'], special:['Leucístico'], dimorphism:false},
  corzo_europeo:{name:'Corzo europeo', latin:'Capreolus capreolus', rare:'Poco común', kind:'deer', color:'#bf8b47', habitats:['bosque','pradera'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono','invierno'], special:['Albino'], dimorphism:true},

  alce:{name:'Alce', latin:'Alces alces', rare:'Poco común', kind:'deer', color:'#6c5540', habitats:['bosque','rio'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono'], special:['Notable'], dimorphism:true},
  reno:{name:'Reno', latin:'Rangifer tarandus', rare:'Común', kind:'deer', color:'#907156', habitats:['tundra','montana'], times:['dia','atardecer'], seasons:['otono','invierno'], special:['Albino'], dimorphism:true},
  lince_boreal:{name:'Lince boreal', latin:'Lynx lynx', rare:'Raro', kind:'cat', color:'#c29a62', habitats:['bosque','montana'], times:['atardecer','noche'], seasons:['primavera','verano','otono','invierno'], special:['Melánico'], dimorphism:false},
  gloton:{name:'Glotón', latin:'Gulo gulo', rare:'Raro', kind:'mustelid', color:'#5f4737', habitats:['montana','tundra'], times:['atardecer','noche'], seasons:['otono','invierno'], special:['Leucístico'], dimorphism:false},
  oso_pardo:{name:'Oso pardo', latin:'Ursus arctos', rare:'Poco común', kind:'bear', color:'#7d5840', habitats:['bosque','montana'], times:['amanecer','atardecer'], seasons:['primavera','verano','otono'], special:['Notable'], dimorphism:false},
  zorro_artico:{name:'Zorro ártico', latin:'Vulpes lagopus', rare:'Raro', kind:'canid', color:'#d9dfe5', habitats:['tundra'], times:['dia','atardecer'], seasons:['invierno','otono'], special:['Melánico','Notable'], dimorphism:false},
  urogallo_comun:{name:'Urogallo común', latin:'Tetrao urogallus', rare:'Poco común', kind:'forestbird', color:'#4d3428', habitats:['bosque'], times:['amanecer','dia'], seasons:['primavera','verano'], special:['Leucístico','Melánico','Notable'], dimorphism:true},
  perdiz_nival:{name:'Perdiz nival', latin:'Lagopus muta', rare:'Poco común', kind:'forestbird', color:'#ebeef0', habitats:['montana','tundra'], times:['dia'], seasons:['invierno'], special:['Melánica','Notable'], dimorphism:false},
  lobo_gris:{name:'Lobo gris', latin:'Canis lupus', rare:'Raro', kind:'canid', color:'#8d8c8f', habitats:['bosque','montana'], times:['noche','atardecer'], seasons:['primavera','verano','otono','invierno'], special:['Notable'], dimorphism:false},

  ibice_alpino:{name:'Íbice alpino', latin:'Capra ibex', rare:'Poco común',kind:'deer',color:'#806646',habitats:['montana'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:true},
  rebeco_alpino:{name:'Rebeco alpino',latin:'Rupicapra rupicapra',rare:'Común',kind:'deer',color:'#a7794c',habitats:['montana','pradera'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:true},
  marmota_alpina:{name:'Marmota alpina',latin:'Marmota marmota',rare:'Común',kind:'small',color:'#99744d',habitats:['montana','pradera'],times:['dia'],seasons:['primavera','verano','otono'],special:['Albino'],dimorphism:false},
  aguila_real:{name:'Águila real',latin:'Aquila chrysaetos',rare:'Común',kind:'forestbird',color:'#816039',habitats:['montana'],times:['dia','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:false},
  quebrantahuesos:{name:'Quebrantahuesos',latin:'Gypaetus barbatus',rare:'Raro',kind:'forestbird',color:'#b48a60',habitats:['montana'],times:['dia'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  liebre_variable:{name:'Liebre variable',latin:'Lepus timidus',rare:'Muy rara',kind:'small',color:'#e4e0d5',habitats:['montana','pradera'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:false},
  salamandra_alpina:{name:'Salamandra alpina',latin:'Salamandra atra',rare:'Poco común',kind:'mustelid',color:'#383e41',habitats:['montana','bosque'],times:['atardecer','noche'],seasons:['primavera','verano','otono'],special:['Leucística'],dimorphism:false},
  jabali:{name:'Jabalí',latin:'Sus scrofa',rare:'Común',kind:'boar',color:'#71533c',habitats:['bosque','pradera'],times:['amanecer','atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico','Notable'],dimorphism:false},
  gato_montes:{name:'Gato montés europeo',latin:'Felis silvestris',rare:'Común',kind:'cat',color:'#a39a83',habitats:['bosque'],times:['amanecer','atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Melánico'],dimorphism:false},
  buho_real:{name:'Búho real',latin:'Bubo bubo',rare:'Poco común',kind:'owl',color:'#926841',habitats:['bosque'],times:['atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  salamandra_comun:{name:'Salamandra común',latin:'Salamandra salamandra',rare:'Común',kind:'salamander',color:'#232b25',habitats:['bosque','rio'],times:['noche','atardecer'],seasons:['primavera','verano','otono'],special:['Leucístico'],dimorphism:false},
  petirrojo:{name:'Petirrojo europeo',latin:'Erithacus rubecula',rare:'Común',kind:'songbird',color:'#a67545',habitats:['bosque','pradera'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  lince_iberico:{name:'Lince ibérico',latin:'Lynx pardinus',rare:'Muy rara',kind:'cat',color:'#c38e4d',habitats:['bosque','pradera'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Melánico'],dimorphism:false},
  cabra_montes_iberica:{name:'Cabra montés ibérica',latin:'Capra pyrenaica',rare:'Poco común',kind:'deer',color:'#8b6a48',habitats:['montana'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:true},
  buitre_leonado:{name:'Buitre leonado',latin:'Gyps fulvus',rare:'Poco común',kind:'raptor',color:'#ad8a5e',habitats:['montana','costa'],times:['dia','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  aguila_imperial_iberica:{name:'Águila imperial ibérica',latin:'Aquila adalberti',rare:'Raro',kind:'raptor',color:'#715233',habitats:['montana','bosque'],times:['dia','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:false},
  lagarto_ocelado:{name:'Lagarto ocelado',latin:'Timon lepidus',rare:'Común',kind:'reptile',color:'#4e9159',habitats:['pradera','bosque'],times:['dia'],seasons:['primavera','verano','otono'],special:['Leucístico'],dimorphism:false},
  meloncillo:{name:'Meloncillo',latin:'Herpestes ichneumon',rare:'Raro',kind:'mustelid',color:'#7a6646',habitats:['bosque','pradera'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Melánico'],dimorphism:false},
  conejo_europeo:{name:'Conejo europeo',latin:'Oryctolagus cuniculus',rare:'Común',kind:'rabbit',color:'#a68567',habitats:['pradera','bosque'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Albino'],dimorphism:false},
  flamenco_comun:{name:'Flamenco común',latin:'Phoenicopterus roseus',rare:'Poco común',kind:'wader',color:'#d39b95',habitats:['costa'],times:['dia'],seasons:['primavera','verano','otono'],special:['Leucístico'],dimorphism:false},
  bisonte_europeo:{name:'Bisonte europeo',latin:'Bison bonasus',rare:'Muy rara',kind:'bison',color:'#6f543e',habitats:['bosque','pradera'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Albino','Notable'],dimorphism:true},
  ciguena_negra:{name:'Cigüeña negra',latin:'Ciconia nigra',rare:'Raro',kind:'stork',color:'#2c2b2d',habitats:['rio','pradera'],times:['dia'],seasons:['primavera','verano','otono'],special:['Leucístico'],dimorphism:false},
  vibora_aspid:{name:'Víbora áspid',latin:'Vipera aspis',rare:'Raro',kind:'snake',color:'#8f7a5e',habitats:['pradera','montana'],times:['dia','atardecer'],seasons:['primavera','verano','otono'],special:['Melánica'],dimorphism:false},
  chacal_dorado:{name:'Chacal dorado',latin:'Canis aureus',rare:'Poco común',kind:'canid',color:'#c0914d',habitats:['pradera','bosque'],times:['atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Melánico'],dimorphism:false},
  castor_europeo:{name:'Castor europeo',latin:'Castor fiber',rare:'Poco común',kind:'beaver',color:'#8b6a48',habitats:['rio'],times:['atardecer','noche'],seasons:['primavera','verano','otono','invierno'],special:['Leucístico'],dimorphism:false},
  pelicano_cenudo:{name:'Pelícano ceñudo',latin:'Pelecanus crispus',rare:'Raro',kind:'pelican',color:'#d8d4c7',habitats:['costa','rio'],times:['dia'],seasons:['primavera','verano','otono'],special:['Notable'],dimorphism:false},
  ciguena_blanca:{name:'Cigüeña blanca',latin:'Ciconia ciconia',rare:'Poco común',kind:'stork',color:'#f5f2e9',habitats:['pradera','rio'],times:['dia'],seasons:['primavera','verano','otono'],special:['Melánica','Notable'],dimorphism:false},
  milano_real:{name:'Milano real',latin:'Milvus milvus',rare:'Raro',kind:'raptor',color:'#8f5e3c',habitats:['pradera','bosque'],times:['dia','atardecer'],seasons:['primavera','verano','otono'],special:['Leucístico','Melánico'],dimorphism:false},
  liebre_europea:{name:'Liebre europea',latin:'Lepus europaeus',rare:'Poco común',kind:'hare',color:'#b78853',habitats:['pradera','bosque'],times:['amanecer','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Melánica','Notable'],dimorphism:false},
  garza_real:{name:'Garza real',latin:'Ardea cinerea',rare:'Poco común',kind:'heron',color:'#a4adb6',habitats:['rio'],times:['amanecer','dia'],seasons:['primavera','verano','otono','invierno'],special:['Leucística'],dimorphism:false},
  cisne_vulgar:{name:'Cisne vulgar',latin:'Cygnus olor',rare:'Poco común',kind:'swan',color:'#f5f4ef',habitats:['rio'],times:['dia','atardecer'],seasons:['primavera','verano','otono','invierno'],special:['Notable'],dimorphism:false},
  martin_pescador:{name:'Martín pescador común',latin:'Alcedo atthis',rare:'Raro',kind:'kingfisher',color:'#2687b8',habitats:['rio'],times:['amanecer','dia'],seasons:['primavera','verano','otono'],special:['Melánico','Notable'],dimorphism:false}
,
  "eu_esp_0654":{"name": "Cormorán grande", "latin": "Phalacrocorax carbo", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0649":{"name": "Pato cuchara europeo", "latin": "Spatula clypeata", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0636":{"name": "Alondra común", "latin": "Alauda arvensis", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0631":{"name": "Herrerillo común", "latin": "Cyanistes caeruleus", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0629":{"name": "Pinzón vulgar", "latin": "Fringilla coelebs", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0628":{"name": "Mirlo común", "latin": "Turdus merula", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0637":{"name": "Zorzal común", "latin": "Turdus philomelos", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0643":{"name": "Busardo ratonero", "latin": "Buteo buteo", "rare": "Común", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0646":{"name": "Lechuza común", "latin": "Tyto alba", "rare": "Común", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0617":{"name": "Comadreja común", "latin": "Mustela nivalis", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0619":{"name": "Turón europeo", "latin": "Mustela putorius", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0614":{"name": "Murciélago común", "latin": "Pipistrellus pipistrellus", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0612":{"name": "Musaraña común", "latin": "Sorex araneus", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0613":{"name": "Musaraña enana", "latin": "Sorex minutus", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0611":{"name": "Topo europeo", "latin": "Talpa europaea", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0604":{"name": "Topillo agreste", "latin": "Microtus agrestis", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0606":{"name": "Lirón avellano", "latin": "Muscardinus avellanarius", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0669":{"name": "Trucha común", "latin": "Salmo trutta", "rare": "Común", "kind": "fish", "color": "#4a97ab", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0661":{"name": "Lución europeo", "latin": "Anguis fragilis", "rare": "Común", "kind": "reptile", "color": "#608b59", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0660":{"name": "Rana bermeja", "latin": "Rana temporaria", "rare": "Común", "kind": "reptile", "color": "#608b59", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0656":{"name": "Tritón palmeado", "latin": "Lissotriton helveticus", "rare": "Común", "kind": "salamander", "color": "#414949", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0655":{"name": "Tritón crestado", "latin": "Triturus cristatus", "rare": "Poco común", "kind": "salamander", "color": "#414949", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0640":{"name": "Ampelis europeo", "latin": "Bombycilla garrulus", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0267":{"name": "Perdiz nival", "latin": "Lagopus lagopus", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": true},
  "eu_esp_0639":{"name": "Camachuelo común", "latin": "Pyrrhula pyrrhula", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0621":{"name": "Marta europea", "latin": "Martes martes", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0618":{"name": "Armiño", "latin": "Mustela erminea", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0610":{"name": "Lemming noruego", "latin": "Lemmus lemmus", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0642":{"name": "Perdiz griega", "latin": "Alectoris graeca", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0609":{"name": "Topillo nival", "latin": "Chionomys nivalis", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "eu_esp_0657":{"name": "Tritón alpino", "latin": "Ichthyosaura alpestris", "rare": "Poco común", "kind": "salamander", "color": "#414949", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0652":{"name": "Focha común", "latin": "Fulica atra", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0650":{"name": "Somormujo lavanco", "latin": "Podiceps cristatus", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0653":{"name": "Zampullín común", "latin": "Tachybaptus ruficollis", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0632":{"name": "Arrendajo euroasiático", "latin": "Garrulus glandarius", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0630":{"name": "Carbonero común", "latin": "Parus major", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0644":{"name": "Gavilán común", "latin": "Accipiter nisus", "rare": "Poco común", "kind": "raptor", "color": "#846749", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0645":{"name": "Mochuelo europeo", "latin": "Athene noctua", "rare": "Común", "kind": "raptor", "color": "#846749", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0615":{"name": "Murciélago hortelano", "latin": "Eptesicus serotinus", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0620":{"name": "Garduña", "latin": "Martes foina", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0622":{"name": "Visón europeo", "latin": "Mustela lutreola", "rare": "Raro", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0616":{"name": "Murciélago de herradura grande", "latin": "Rhinolophus ferrumequinum", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0601":{"name": "Lirón careto", "latin": "Eliomys quercinus", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0602":{"name": "Lirón gris", "latin": "Glis glis", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0603":{"name": "Topillo común", "latin": "Microtus arvalis", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0605":{"name": "Topillo rojo", "latin": "Myodes glareolus", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0668":{"name": "Barbo común", "latin": "Barbus barbus", "rare": "Común", "kind": "fish", "color": "#4a97ab", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0667":{"name": "Tenca", "latin": "Tinca tinca", "rare": "Común", "kind": "fish", "color": "#4a97ab", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0659":{"name": "Sapo corredor", "latin": "Epidalea calamita", "rare": "Común", "kind": "reptile", "color": "#608b59", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0666":{"name": "Culebra viperina", "latin": "Natrix maura", "rare": "Común", "kind": "snake", "color": "#967959", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0665":{"name": "Culebra de collar", "latin": "Natrix natrix", "rare": "Común", "kind": "snake", "color": "#967959", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0638":{"name": "Oropéndola europea", "latin": "Oriolus oriolus", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0159":{"name": "Pico picapinos", "latin": "Dendrocopos major", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0608":{"name": "Ardilla terrestre europea", "latin": "Spermophilus citellus", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0641":{"name": "Perdiz roja", "latin": "Alectoris rufa", "rare": "Común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0633":{"name": "Rabilargo ibérico", "latin": "Cyanopica cooki", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0635":{"name": "Abejaruco europeo", "latin": "Merops apiaster", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0634":{"name": "Abubilla europea", "latin": "Upupa epops", "rare": "Poco común", "kind": "forestbird", "color": "#96816b", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "eu_esp_0647":{"name": "Halcón de Eleonor", "latin": "Falco eleonorae", "rare": "Raro", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0623":{"name": "Desmán ibérico", "latin": "Galemys pyrenaicus", "rare": "Raro", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0219":{"name": "Gineta", "latin": "Genetta genetta", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0607":{"name": "Liebre ibérica", "latin": "Lepus granatensis", "rare": "Común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0626":{"name": "Rebeco pirenaico", "latin": "Rupicapra pyrenaica", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0116":{"name": "Camaleón común", "latin": "Chamaeleo chamaeleon", "rare": "Poco común", "kind": "reptile", "color": "#608b59", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0029":{"name": "Águila imperial oriental", "latin": "Aquila heliaca", "rare": "Poco común", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0624":{"name": "Desmán ruso", "latin": "Desmana moschata", "rare": "Raro", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0625":{"name": "Gato almizclero europeo", "latin": "Vormela peregusna", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0670":{"name": "Perca europea", "latin": "Perca fluviatilis", "rare": "Común", "kind": "fish", "color": "#4a97ab", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0204":{"name": "Cernícalo vulgar", "latin": "Falco tinnunculus", "rare": "Poco común", "kind": "raptor", "color": "#846749", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0253":{"name": "Puercoespín crestado", "latin": "Hystrix cristata", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0627":{"name": "Muflón europeo", "latin": "Ovis gmelini", "rare": "Poco común", "kind": "small", "color": "#a58361", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0506":{"name": "Tortuga mediterránea", "latin": "Testudo hermanni", "rare": "Poco común", "kind": "tortoise", "color": "#a0a8a1", "habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0144":{"name": "Cisne cantor", "latin": "Cygnus cygnus", "rare": "Común", "kind": "swan", "color": "#a0a8a1", "habitats": ["rio", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0232":{"name": "Águila marina europea", "latin": "Haliaeetus albicilla", "rare": "Poco común", "kind": "raptor", "color": "#846749", "habitats": ["rio", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "eu_esp_0505":{"name": "Tortuga griega", "latin": "Testudo graeca", "rare": "Común", "kind": "tortoise", "color": "#a0a8a1", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0401":{"name": "Leopardo persa", "latin": "Panthera pardus", "rare": "Común", "kind": "cat", "color": "#cf9b61", "habitats": ["bosque", "montana", "pradera"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0081":{"name": "Tur del Cáucaso oriental", "latin": "Capra cylindricornis", "rare": "Común", "kind": "deer", "color": "#98734c", "habitats": ["montana", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": true},
  "asia_esp_0149":{"name": "Gamo", "latin": "Dama dama", "rare": "Común", "kind": "deer", "color": "#b68854", "habitats": ["bosque", "pradera"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Leucístico", "Notable"], "dimorphism": true},
  "asia_esp_0903":{"name": "Lagarto de cristal oriental", "latin": "Pseudopus apodus", "rare": "Común", "kind": "reptile", "color": "#8d8960", "habitats": ["pradera", "montana", "estepa"], "times": ["dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0088":{"name": "Caracal", "latin": "Caracal caracal", "rare": "Poco común", "kind": "cat", "color": "#cb8b53", "habitats": ["pradera", "estepa", "montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0080":{"name": "Cabra salvaje", "latin": "Capra aegagrus", "rare": "Poco común", "kind": "deer", "color": "#ae8054", "habitats": ["montana", "pradera", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": true},
  "asia_esp_0402":{"name": "Tigre siberiano", "latin": "Panthera tigris", "rare": "Raro", "kind": "cat", "color": "#c68346", "habitats": ["bosque", "montana", "pradera", "tundra", "estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0086":{"name": "Corzo siberiano", "latin": "Capreolus pygargus", "rare": "Común", "kind": "deer", "color": "#ac8c65", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0344":{"name": "Ciervo almizclero siberiano", "latin": "Moschus moschiferus", "rare": "Poco común", "kind": "deer", "color": "#9b7351", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0209":{"name": "Frailecillo corniculado", "latin": "Fratercula corniculata", "rare": "Común", "kind": "seabird", "color": "#31383b", "habitats": ["costa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0203":{"name": "Halcón gerifalte", "latin": "Falco rusticolus", "rare": "Común", "kind": "raptor", "color": "#94959a", "habitats": ["pradera", "montana", "tundra", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0234":{"name": "Águila marina de Steller", "latin": "Haliaeetus pelagicus", "rare": "Raro", "kind": "raptor", "color": "#614d3f", "habitats": ["pradera", "montana", "tundra", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0177":{"name": "Nutria marina", "latin": "Enhydra lutris", "rare": "Poco común", "kind": "otter", "color": "#8e7261", "habitats": ["costa", "rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0369":{"name": "Salmón rosado", "latin": "Oncorhynchus gorbuscha", "rare": "Poco común", "kind": "fish", "color": "#d48d9f", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0371":{"name": "Salmón rojo", "latin": "Oncorhynchus nerka", "rare": "Poco común", "kind": "fish", "color": "#b84f57", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0881":{"name": "Collalba del desierto", "latin": "Oenanthe deserti", "rare": "Común", "kind": "songbird", "color": "#ccb59b", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0194":{"name": "Jerbo de orejas largas", "latin": "Euchoreutes naso", "rare": "Común", "kind": "small", "color": "#bfaa8a", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0073":{"name": "Camello bactriano salvaje", "latin": "Camelus ferus", "rare": "Muy rara", "kind": "camel", "color": "#b89966", "habitats": ["desierto", "estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0431":{"name": "Lagarto cabeza de sapo", "latin": "Phrynocephalus versicolor", "rare": "Raro", "kind": "lizard", "color": "#a38a5b", "habitats": ["desierto", "estepa", "pradera", "montana"], "times": ["dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0863":{"name": "Perdiz de las nieves del Himalaya", "latin": "Lerwa lerwa", "rare": "Poco común", "kind": "forestbird", "color": "#b0a795", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0294":{"name": "Monal del Himalaya", "latin": "Lophophorus impejanus", "rare": "Raro", "kind": "forestbird", "color": "#437a83", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "asia_esp_0864":{"name": "Faisán monal chino", "latin": "Lophophorus lhuysii", "rare": "Raro", "kind": "forestbird", "color": "#547f8a", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "asia_esp_0503":{"name": "Mosquero del paraíso asiático", "latin": "Terpsiphone paradisi", "rare": "Común", "kind": "songbird", "color": "#d6cbb5", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0865":{"name": "Tragopán sátiro", "latin": "Tragopan satyra", "rare": "Común", "kind": "forestbird", "color": "#b45846", "habitats": ["bosque", "montana", "pradera", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "asia_esp_0820":{"name": "Cuón", "latin": "Cuon alpinus", "rare": "Raro", "kind": "canid", "color": "#ae6944", "habitats": ["bosque", "montana", "pradera", "tundra", "estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0403":{"name": "Leopardo de las nieves", "latin": "Panthera uncia", "rare": "Muy rara", "kind": "cat", "color": "#c8c4ba", "habitats": ["bosque", "montana", "pradera", "tundra", "estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0007":{"name": "Panda rojo", "latin": "Ailurus fulgens", "rare": "Común", "kind": "small", "color": "#bb7142", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0855":{"name": "Macaco rhesus", "latin": "Macaca mulatta", "rare": "Común", "kind": "primate", "color": "#aa907a", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0850":{"name": "Marta de garganta amarilla", "latin": "Martes flavigula", "rare": "Común", "kind": "mustelid", "color": "#a07a49", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0844":{"name": "Ardilla voladora gigante roja", "latin": "Petaurista petaurista", "rare": "Poco común", "kind": "small", "color": "#9b5343", "habitats": ["bosque", "montana", "pradera", "estepa", "tundra"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0523":{"name": "Oso negro asiático", "latin": "Ursus thibetanus", "rare": "Poco común", "kind": "bear", "color": "#28282b", "habitats": ["bosque", "montana", "pradera", "tundra", "estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0062":{"name": "Yak salvaje", "latin": "Bos mutus", "rare": "Raro", "kind": "bison", "color": "#514037", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": true},
  "asia_esp_0821":{"name": "Takin", "latin": "Budorcas taxicolor", "rare": "Poco común", "kind": "bison", "color": "#907357", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0240":{"name": "Tahr del Himalaya", "latin": "Hemitragus jemlahicus", "rare": "Común", "kind": "deer", "color": "#a38c6c", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0445":{"name": "Bharal", "latin": "Pseudois nayaur", "rare": "Común", "kind": "deer", "color": "#8793a6", "habitats": ["montana", "pradera", "bosque", "tundra", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0538":{"name": "Zorro de Rüppell", "latin": "Vulpes rueppellii", "rare": "Común", "kind": "canid", "color": "#b18a65", "habitats": ["desierto"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0206":{"name": "Gato de las arenas", "latin": "Felis margarita", "rare": "Poco común", "kind": "cat", "color": "#ac966c", "habitats": ["montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0214":{"name": "Gacela de Arabia", "latin": "Gazella arabica", "rare": "Poco común", "kind": "deer", "color": "#c0a079", "habitats": ["desierto", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0383":{"name": "Órix árabe", "latin": "Oryx leucoryx", "rare": "Raro", "kind": "deer", "color": "#e7d9b8", "habitats": ["desierto", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0519":{"name": "Lagarto egipcio de cola espinosa", "latin": "Uromastyx aegyptia", "rare": "Poco común", "kind": "lizard", "color": "#7c976b", "habitats": ["desierto", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0102":{"name": "Víbora cornuda árabe", "latin": "Cerastes gasperettii", "rare": "Común", "kind": "snake", "color": "#a88b67", "habitats": ["desierto", "estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0205":{"name": "Gato de la jungla", "latin": "Felis chaus", "rare": "Común", "kind": "cat", "color": "#ac966c", "habitats": ["humedal"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0300":{"name": "Nutria lisa", "latin": "Lutrogale perspicillata", "rare": "Común", "kind": "otter", "color": "#796b55", "habitats": ["humedal", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0065":{"name": "Búfalo de agua", "latin": "Bubalus bubalis", "rare": "Raro", "kind": "bison", "color": "#584a3d", "habitats": ["humedal"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0910":{"name": "Carpa común", "latin": "Cyprinus carpio", "rare": "Raro", "kind": "fish", "color": "#8c8870", "habitats": ["humedal", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0327":{"name": "Galápago caspio", "latin": "Mauremys caspica", "rare": "Común", "kind": "tortoise", "color": "#a89070", "habitats": ["humedal", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0873":{"name": "Abejaruco verde", "latin": "Merops orientalis", "rare": "Común", "kind": "songbird", "color": "#5b9e74", "habitats": ["estepa", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0246":{"name": "Hiena rayada", "latin": "Hyaena hyaena", "rare": "Común", "kind": "canid", "color": "#8b8068", "habitats": ["estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0182":{"name": "Onagro", "latin": "Equus hemionus", "rare": "Poco común", "kind": "deer", "color": "#a98b69", "habitats": ["estepa", "desierto"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0218":{"name": "Gacela persa", "latin": "Gazella subgutturosa", "rare": "Poco común", "kind": "deer", "color": "#a98b69", "habitats": ["estepa", "desierto"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0227":{"name": "Grulla de cuello negro", "latin": "Grus nigricollis", "rare": "Común", "kind": "stork", "color": "#bdc7ca", "habitats": ["rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0534":{"name": "Zorro tibetano", "latin": "Vulpes ferrilata", "rare": "Común", "kind": "canid", "color": "#b18a65", "habitats": ["montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0321":{"name": "Marmota del Himalaya", "latin": "Marmota himalayana", "rare": "Común", "kind": "small", "color": "#b29b76", "habitats": ["montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0183":{"name": "Kiang", "latin": "Equus kiang", "rare": "Común", "kind": "deer", "color": "#c9ad7d", "habitats": ["montana", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0404":{"name": "Antílope tibetano", "latin": "Pantholops hodgsonii", "rare": "Muy rara", "kind": "deer", "color": "#a98b69", "habitats": ["montana", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0442":{"name": "Gacela tibetana", "latin": "Procapra picticaudata", "rare": "Común", "kind": "deer", "color": "#c0a079", "habitats": ["montana", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0347":{"name": "Turón estepario", "latin": "Mustela eversmanii", "rare": "Común", "kind": "mustelid", "color": "#826953", "habitats": ["estepa"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0319":{"name": "Marmota bobak", "latin": "Marmota bobak", "rare": "Poco común", "kind": "small", "color": "#b29b76", "habitats": ["estepa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0468":{"name": "Antílope saiga", "latin": "Saiga tatarica", "rare": "Muy rara", "kind": "deer", "color": "#c3ad88", "habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0891":{"name": "Pato mandarín", "latin": "Aix galericulata", "rare": "Común", "kind": "swan", "color": "#aa714d", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0890":{"name": "Cigüeña blanca oriental", "latin": "Ciconia boyciana", "rare": "Raro", "kind": "stork", "color": "#e6ddcf", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0226":{"name": "Grulla de coronilla roja", "latin": "Grus japonensis", "rare": "Común", "kind": "stork", "color": "#bdc7ca", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0878":{"name": "Urraca de pico azul", "latin": "Cyanopica cyanus", "rare": "Poco común", "kind": "songbird", "color": "#3b5f92", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0422":{"name": "Faisán común", "latin": "Phasianus colchicus", "rare": "Común", "kind": "forestbird", "color": "#936d4e", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0842":{"name": "Liebre china", "latin": "Lepus sinensis", "rare": "Poco común", "kind": "hare", "color": "#a89070", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0824":{"name": "Ciervo del padre David", "latin": "Elaphurus davidianus", "rare": "Raro", "kind": "deer", "color": "#a67d55", "habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0915":{"name": "Pez cabeza de serpiente del norte", "latin": "Channa argus", "rare": "Poco común", "kind": "fish", "color": "#637e81", "habitats": ["rio", "costa"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0911":{"name": "Pez mandarín chino", "latin": "Siniperca chuatsi", "rare": "Poco común", "kind": "fish", "color": "#637e81", "habitats": ["rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0888":{"name": "Pelícano blanco oriental", "latin": "Pelecanus philippensis", "rare": "Común", "kind": "pelican", "color": "#a89070", "habitats": ["rio", "humedal"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0868":{"name": "Cálao bicorne", "latin": "Buceros bicornis", "rare": "Común", "kind": "forestbird", "color": "#4d4641", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0872":{"name": "Carraca india", "latin": "Coracias benghalensis", "rare": "Poco común", "kind": "forestbird", "color": "#bc915c", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0410":{"name": "Pavo real común", "latin": "Pavo cristatus", "rare": "Raro", "kind": "forestbird", "color": "#267b8a", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0874":{"name": "Bubul", "latin": "Pycnonotus cafer", "rare": "Poco común", "kind": "songbird", "color": "#547e79", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0816":{"name": "Gato pescador", "latin": "Prionailurus viverrinus", "rare": "Raro", "kind": "cat", "color": "#ac966c", "habitats": ["bosque", "selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0176":{"name": "Elefante asiático", "latin": "Elephas maximus", "rare": "Raro", "kind": "elephant", "color": "#90999b", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0852":{"name": "Pangolín indio", "latin": "Manis crassicaudata", "rare": "Raro", "kind": "pangolin", "color": "#a99675", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0336":{"name": "Oso bezudo", "latin": "Melursus ursinus", "rare": "Común", "kind": "small", "color": "#6f6658", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0860":{"name": "Loris lento de Bengala", "latin": "Nycticebus bengalensis", "rare": "Poco común", "kind": "primate", "color": "#a89070", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0853":{"name": "Musaraña almizclera", "latin": "Suncus murinus", "rare": "Poco común", "kind": "small", "color": "#ac9374", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0476":{"name": "Langur gris", "latin": "Semnopithecus entellus", "rare": "Poco común", "kind": "primate", "color": "#a89070", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0833":{"name": "Antílope negro", "latin": "Antilope cervicapra", "rare": "Poco común", "kind": "deer", "color": "#a98b69", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0050":{"name": "Ciervo chital", "latin": "Axis axis", "rare": "Poco común", "kind": "deer", "color": "#a67d55", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0061":{"name": "Gaur", "latin": "Bos gaurus", "rare": "Poco común", "kind": "bison", "color": "#a89070", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0063":{"name": "Nilgó", "latin": "Boselaphus tragocamelus", "rare": "Muy rara", "kind": "bison", "color": "#a89070", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0830":{"name": "Búfalo salvaje asiático", "latin": "Bubalus arnee", "rare": "Raro", "kind": "bison", "color": "#584a3d", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0465":{"name": "Rinoceronte indio", "latin": "Rhinoceros unicornis", "rare": "Poco común", "kind": "rhino", "color": "#868f8a", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0825":{"name": "Ciervo sambar", "latin": "Rusa unicolor", "rare": "Raro", "kind": "deer", "color": "#a67d55", "habitats": ["pradera", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0900":{"name": "Varano de Bengala", "latin": "Varanus bengalensis", "rare": "Común", "kind": "lizard", "color": "#657559", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0136":{"name": "Cocodrilo de las marismas", "latin": "Crocodylus palustris", "rare": "Común", "kind": "crocodile", "color": "#58735b", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0906":{"name": "Krait común", "latin": "Bungarus caeruleus", "rare": "Común", "kind": "snake", "color": "#454e5b", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0905":{"name": "Víbora de Russell", "latin": "Daboia russelii", "rare": "Común", "kind": "snake", "color": "#a88b67", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0351":{"name": "Cobra india", "latin": "Naja naja", "rare": "Común", "kind": "snake", "color": "#69654a", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0124":{"name": "Faisán dorado", "latin": "Chrysolophus pictus", "rare": "Común", "kind": "forestbird", "color": "#e3a439", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0296":{"name": "Faisán plateado", "latin": "Lophura nycthemera", "rare": "Común", "kind": "forestbird", "color": "#dad9cd", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0096":{"name": "Gato dorado asiático", "latin": "Catopuma temminckii", "rare": "Raro", "kind": "cat", "color": "#ac966c", "habitats": ["bosque", "selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0355":{"name": "Leopardo nublado", "latin": "Neofelis nebulosa", "rare": "Común", "kind": "cat", "color": "#998c73", "habitats": ["bosque", "selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0006":{"name": "Panda gigante", "latin": "Ailuropoda melanoleuca", "rare": "Muy rara", "kind": "bear", "color": "#eceae1", "habitats": ["bosque", "selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0318":{"name": "Pangolín chino", "latin": "Manis pentadactyla", "rare": "Común", "kind": "pangolin", "color": "#a99675", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0854":{"name": "Gibón de cresta negra", "latin": "Nomascus concolor", "rare": "Raro", "kind": "primate", "color": "#53463c", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0395":{"name": "Civeta de las palmeras enmascarada", "latin": "Paguma larvata", "rare": "Poco común", "kind": "mustelid", "color": "#826953", "habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0856":{"name": "Mono de nariz chata dorado", "latin": "Rhinopithecus roxellana", "rare": "Raro", "kind": "primate", "color": "#be984a", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0310":{"name": "Macaco tibetano", "latin": "Macaca thibetana", "rare": "Poco común", "kind": "primate", "color": "#a89070", "habitats": ["bosque", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0345":{"name": "Muntíaco de Reeves", "latin": "Muntiacus reevesi", "rare": "Común", "kind": "deer", "color": "#c9ad7d", "habitats": ["montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0902":{"name": "Gecko tokay", "latin": "Gekko gecko", "rare": "Común", "kind": "lizard", "color": "#648f79", "habitats": ["montana", "selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0016":{"name": "Salamandra gigante china", "latin": "Andrias davidianus", "rare": "Raro", "kind": "salamander", "color": "#4a5145", "habitats": ["rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0433":{"name": "Urraca oriental", "latin": "Pica serica", "rare": "Raro", "kind": "songbird", "color": "#3b5f92", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0440":{"name": "Gato leopardo", "latin": "Prionailurus bengalensis", "rare": "Poco común", "kind": "cat", "color": "#998c73", "habitats": ["bosque", "montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0333":{"name": "Tejón asiático", "latin": "Meles leucurus", "rare": "Común", "kind": "mustelid", "color": "#826953", "habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0111":{"name": "Ciervo sika", "latin": "Cervus nippon", "rare": "Poco común", "kind": "deer", "color": "#a67d55", "habitats": ["pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0249":{"name": "Ciervo acuático chino", "latin": "Hydropotes inermis", "rare": "Común", "kind": "deer", "color": "#a67d55", "habitats": ["pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0067":{"name": "Cálao rinoceronte", "latin": "Buceros rhinoceros", "rare": "Común", "kind": "rhino", "color": "#868f8a", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0867":{"name": "Pavo verde", "latin": "Pavo muticus", "rare": "Raro", "kind": "forestbird", "color": "#376b81", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0869":{"name": "Cálao de casco", "latin": "Rhinoplax vigil", "rare": "Raro", "kind": "forestbird", "color": "#4d4641", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0883":{"name": "Águila de las Filipinas", "latin": "Pithecophaga jefferyi", "rare": "Muy rara", "kind": "raptor", "color": "#a89070", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0849":{"name": "Binturong", "latin": "Arctictis binturong", "rare": "Poco común", "kind": "mustelid", "color": "#826953", "habitats": ["selva"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0858":{"name": "Tarsio filipino", "latin": "Carlito syrichta", "rare": "Raro", "kind": "small", "color": "#8d7b66", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0238":{"name": "Oso malayo", "latin": "Helarctos malayanus", "rare": "Raro", "kind": "small", "color": "#6f6658", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0857":{"name": "Macaco de cola de cerdo", "latin": "Macaca nemestrina", "rare": "Común", "kind": "primate", "color": "#a89070", "habitats": ["selva", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0317":{"name": "Pangolín malayo", "latin": "Manis javanica", "rare": "Común", "kind": "pangolin", "color": "#a99675", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0859":{"name": "Tarsio de espectro", "latin": "Tarsius tarsier", "rare": "Raro", "kind": "small", "color": "#ac9374", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0251":{"name": "Gibón de manos blancas", "latin": "Hylobates lar", "rare": "Poco común", "kind": "primate", "color": "#53463c", "habitats": ["selva", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0352":{"name": "Mono narigudo", "latin": "Nasalis larvatus", "rare": "Común", "kind": "primate", "color": "#a89070", "habitats": ["selva", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0436":{"name": "Orangután de Borneo", "latin": "Pongo pygmaeus", "rare": "Raro", "kind": "small", "color": "#8d7b66", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0491":{"name": "Gibón siamango", "latin": "Symphalangus syndactylus", "rare": "Poco común", "kind": "primate", "color": "#53463c", "habitats": ["selva", "bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0165":{"name": "Rinoceronte de Sumatra", "latin": "Dicerorhinus sumatrensis", "rare": "Muy rara", "kind": "rhino", "color": "#868f8a", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0834":{"name": "Jabalí barbudo", "latin": "Sus barbatus", "rare": "Poco común", "kind": "deer", "color": "#c9ad7d", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0498":{"name": "Tapir malayo", "latin": "Tapirus indicus", "rare": "Común", "kind": "deer", "color": "#c9ad7d", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0901":{"name": "Dragón volador común", "latin": "Draco volans", "rare": "Raro", "kind": "reptile", "color": "#768159", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Notable"], "dimorphism": false},
  "asia_esp_0527":{"name": "Dragón de Komodo", "latin": "Varanus komodoensis", "rare": "Común", "kind": "reptile", "color": "#768159", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0316":{"name": "Pitón reticulada", "latin": "Malayopython reticulatus", "rare": "Común", "kind": "reptile", "color": "#768159", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0373":{"name": "Cobra real", "latin": "Ophiophagus hannah", "rare": "Común", "kind": "snake", "color": "#69654a", "habitats": ["selva"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0877":{"name": "Petirrojo japonés", "latin": "Larvivora akahige", "rare": "Común", "kind": "forestbird", "color": "#786b53", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0494":{"name": "Faisán cobrizo", "latin": "Syrmaticus soemmerringii", "rare": "Poco común", "kind": "forestbird", "color": "#bc915c", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0363":{"name": "Tanuki", "latin": "Nyctereutes procyonoides", "rare": "Poco común", "kind": "small", "color": "#ac9374", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0414":{"name": "Conejo de Amami", "latin": "Pentalagus furnessi", "rare": "Común", "kind": "small", "color": "#8d7b66", "habitats": ["bosque"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Leucístico", "Notable"], "dimorphism": false},
  "asia_esp_0308":{"name": "Macaco japonés", "latin": "Macaca fuscata", "rare": "Común", "kind": "primate", "color": "#a89070", "habitats": ["bosque", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0087":{"name": "Serau japonés", "latin": "Capricornis crispus", "rare": "Común", "kind": "deer", "color": "#c9ad7d", "habitats": ["montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"], "special": ["Melánico", "Notable"], "dimorphism": false},
  "asia_esp_0017":{"name": "Salamandra gigante japonesa", "latin": "Andrias japonicus", "rare": "Poco común", "kind": "salamander", "color": "#4a5145", "habitats": ["costa", "rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono"], "special": ["Melánico", "Notable"], "dimorphism": false}
};




// Ajustes finos v1.9.1: colores, tipos y variantes especiales
Object.assign(SPECIES.salamandra_comun,{special:['Leucístico','Notable']});
Object.assign(SPECIES.salamandra_alpina,{kind:'salamander',special:['Leucística','Notable']});
if(SPECIES.perdiz_nival) SPECIES.perdiz_nival.special=['Notable'];
const SPRITE_TUNING={
  eu_esp_0604:{color:'#9a7b54'}, // Topillo agreste
  eu_esp_0603:{color:'#8e7e63'}, // Topillo común
  eu_esp_0609:{color:'#c8beb0', special:['Leucístico','Notable']}, // Topillo nival
  eu_esp_0605:{color:'#a35e3f'}, // Topillo rojo
  eu_esp_0631:{color:'#6a8eb3'}, // Herrerillo común
  eu_esp_0636:{color:'#aa845b'}, // Alondra común
  eu_esp_0629:{color:'#b16d58'}, // Pinzón vulgar
  eu_esp_0628:{color:'#4a4139'}, // Mirlo común
  eu_esp_0637:{color:'#8b7254'}, // Zorzal común
  eu_esp_0654:{color:'#3f4244'}, // Cormorán grande
  eu_esp_0649:{color:'#835c42'}, // Pato cuchara europeo
  eu_esp_0630:{color:'#d9b85b'}, // Carbonero común
  eu_esp_0639:{color:'#ad665d'}, // Camachuelo común
  eu_esp_0638:{color:'#dfba45'}, // Oropéndola europea
  eu_esp_0640:{color:'#ae816b'}, // Ampelis europeo
  eu_esp_0632:{color:'#aa7758'}, // Arrendajo euroasiático
  eu_esp_0159:{color:'#303438'}, // Pico picapinos
  eu_esp_0652:{color:'#303438'}, // Focha común
  eu_esp_0650:{color:'#6a6558'}, // Somormujo lavanco
  eu_esp_0653:{color:'#5a4c46'}, // Zampullín común
  eu_esp_0643:{color:'#8a6c4c'}, // Busardo ratonero
  eu_esp_0646:{color:'#c5a886'}, // Lechuza común
  eu_esp_0644:{color:'#777a7d'}, // Gavilán común
  eu_esp_0645:{color:'#aa8963'}, // Mochuelo europeo
  eu_esp_0617:{color:'#8b613f'}, // Comadreja común
  eu_esp_0618:{color:'#e0d8ca'}, // Armiño invernal
  eu_esp_0619:{color:'#675349'}, // Turón europeo
  eu_esp_0621:{color:'#765b41'}, // Marta europea
  eu_esp_0606:{color:'#ab865a'}, // Lirón avellano
  eu_esp_0601:{color:'#aaa18e'}, // Lirón careto
  eu_esp_0602:{color:'#b2a99c'}, // Lirón gris
  eu_esp_0610:{color:'#a0805f'}, // Lemming noruego
  eu_esp_0253:{color:'#866f4a'}, // Puercoespín crestado
  eu_esp_0608:{color:'#ae895a'}, // Ardilla terrestre europea
  eu_esp_0633:{color:'#4b5560'}, // Rabilargo ibérico
  eu_esp_0641:{color:'#ab6957'}, // Perdiz roja
  eu_esp_0642:{color:'#aa926d'}  // Perdiz griega
};
Object.entries(SPRITE_TUNING).forEach(([id,patch])=>{ if(SPECIES[id]) Object.assign(SPECIES[id],patch); });

Object.assign(SPRITE_TUNING,{
  gato_montes:{color:'#8c876f'},
  lince_iberico:{color:'#c99657'},
  zorro_rojo:{color:'#d96d30'},
  zorro_artico:{color:'#dfe4ea'},
  jabali:{color:'#6f523e'},
  conejo_europeo:{color:'#9d8668'},
  liebre_europea:{color:'#b88454'},
  liebre_variable:{color:'#dddcd5'},
  frailecillo_atlantico:{color:'#252628'},
  erizo_europeo:{color:'#8d6b4a'},
  eu_esp_0623:{color:'#8b755b'},
  asia_esp_0067:{color:'#232425'}
});



// Fauna inicial de África con familias de sprites existentes.
Object.assign(SPECIES,{"af_fenec":{"name":"Fénec","latin":"Vulpes zerda","rare":"Poco común","kind":"canid","color":"#e9bb79","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_dromedario":{"name":"Dromedario","latin":"Camelus dromedarius","rare":"Común","kind":"camel","color":"#bc9970","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_gacela_dorcas":{"name":"Gacela dorcas","latin":"Gazella dorcas","rare":"Poco común","kind":"deer","color":"#c8a66d","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_chacal_dorado":{"name":"Chacal dorado","latin":"Canis aureus","rare":"Común","kind":"canid","color":"#ad9060","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_ibis_eremita":{"name":"Ibis eremita","latin":"Geronticus eremita","rare":"Muy rara","kind":"stork","color":"#43433b","habitats":["costa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_serval":{"name":"Serval","latin":"Leptailurus serval","rare":"Raro","kind":"cat","color":"#c4a25b","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_cobra_egipcia":{"name":"Cobra egipcia","latin":"Naja haje","rare":"Raro","kind":"snake","color":"#8c7453","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_arrui":{"name":"Arruí","latin":"Ammotragus lervia","rare":"Poco común","kind":"deer","color":"#b69c7a","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_leon":{"name":"León africano","latin":"Panthera leo","rare":"Raro","kind":"cat","color":"#cba35e","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_elefante_sabana":{"name":"Elefante africano de sabana","latin":"Loxodonta africana","rare":"Raro","kind":"elephant","color":"#99978f","habitats":["pradera","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_rinoceronte_blanco":{"name":"Rinoceronte blanco","latin":"Ceratotherium simum","rare":"Muy rara","kind":"rhino","color":"#a49d91","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_bufalo_cafre":{"name":"Búfalo cafre","latin":"Syncerus caffer","rare":"Poco común","kind":"bison","color":"#5b4e42","habitats":["pradera","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_licaon":{"name":"Licaón","latin":"Lycaon pictus","rare":"Raro","kind":"canid","color":"#af8559","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_cocodrilo_nilo":{"name":"Cocodrilo del Nilo","latin":"Crocodylus niloticus","rare":"Raro","kind":"crocodile","color":"#718162","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_aguila_pescadora":{"name":"Pigargo vocinglero","latin":"Icthyophaga vocifer","rare":"Poco común","kind":"raptor","color":"#e0e3d5","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_piton_africana":{"name":"Pitón de Seba","latin":"Python sebae","rare":"Raro","kind":"snake","color":"#83765d","habitats":["pradera","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_gorila_occidental":{"name":"Gorila occidental","latin":"Gorilla gorilla","rare":"Muy rara","kind":"primate","color":"#484840","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_chimpance":{"name":"Chimpancé común","latin":"Pan troglodytes","rare":"Raro","kind":"primate","color":"#594e44","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_pangolin_gigante":{"name":"Pangolín gigante","latin":"Smutsia gigantea","rare":"Muy rara","kind":"pangolin","color":"#8a6f51","habitats":["bosque","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_leopardo":{"name":"Leopardo africano","latin":"Panthera pardus","rare":"Raro","kind":"cat","color":"#b89a65","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_elefante_bosque":{"name":"Elefante africano de bosque","latin":"Loxodonta cyclotis","rare":"Muy rara","kind":"elephant","color":"#797d77","habitats":["bosque","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_loro_gris":{"name":"Loro gris africano","latin":"Psittacus erithacus","rare":"Poco común","kind":"songbird","color":"#8c8f8d","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_colobo":{"name":"Colobo blanco y negro","latin":"Colobus guereza","rare":"Raro","kind":"primate","color":"#2b3432","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_cocodrilo_hocico":{"name":"Cocodrilo de hocico estrecho","latin":"Mecistops cataphractus","rare":"Muy rara","kind":"crocodile","color":"#60765b","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false}});

// v3.5 · fauna adicional de las nuevas regiones africanas.
Object.assign(SPECIES,{"af_hipopotamo":{"name":"Hipopótamo común","latin":"Hippopotamus amphibius","rare":"Poco común","kind":"hippo","color":"#8c7774","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_avestruz":{"name":"Avestruz común","latin":"Struthio camelus","rare":"Común","kind":"ostrich","color":"#4c433b","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_ibis_sagrado":{"name":"Ibis sagrado africano","latin":"Threskiornis aethiopicus","rare":"Común","kind":"stork","color":"#e9e5d4","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_garza_goliat":{"name":"Garza goliat","latin":"Ardea goliath","rare":"Poco común","kind":"heron","color":"#a17e66","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_abejaruco_carmin":{"name":"Abejaruco carmín","latin":"Merops nubicus","rare":"Poco común","kind":"songbird","color":"#b54d42","habitats":["rio","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_jirafa":{"name":"Jirafa","latin":"Giraffa camelopardalis","rare":"Poco común","kind":"giraffe","color":"#c9a16c","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_cebra_llanura":{"name":"Cebra de llanura","latin":"Equus quagga","rare":"Común","kind":"zebra","color":"#e4dfd0","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_facoquero":{"name":"Facóquero común","latin":"Phacochoerus africanus","rare":"Común","kind":"boar","color":"#9b7859","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_nu_azul":{"name":"Ñu azul","latin":"Connochaetes taurinus","rare":"Común","kind":"bison","color":"#6e5c50","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_grulla_coronada":{"name":"Grulla coronada gris","latin":"Balearica regulorum","rare":"Poco común","kind":"stork","color":"#82786b","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_hiena_manchada":{"name":"Hiena manchada","latin":"Crocuta crocuta","rare":"Raro","kind":"canid","color":"#a18a65","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_orix":{"name":"Órix del Cabo","latin":"Oryx gazella","rare":"Poco común","kind":"deer","color":"#b79b7e","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_zorro_palido":{"name":"Zorro pálido","latin":"Vulpes pallida","rare":"Poco común","kind":"canid","color":"#d0ad77","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_antilope_bongo":{"name":"Bongo","latin":"Tragelaphus eurycerus","rare":"Raro","kind":"deer","color":"#b66b4d","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_duiker_azul":{"name":"Duíquer azul","latin":"Philantomba monticola","rare":"Poco común","kind":"deer","color":"#827463","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_civeta":{"name":"Civeta africana","latin":"Civettictis civetta","rare":"Raro","kind":"cat","color":"#998872","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_mandril":{"name":"Mandril","latin":"Mandrillus sphinx","rare":"Raro","kind":"primate","color":"#68594e","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_turaco":{"name":"Turaco verde","latin":"Tauraco persa","rare":"Poco común","kind":"songbird","color":"#477b56","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_okapi":{"name":"Okapi","latin":"Okapia johnstoni","rare":"Muy rara","kind":"giraffe","color":"#8b6348","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_gorila_montana":{"name":"Gorila de montaña","latin":"Gorilla beringei beringei","rare":"Muy rara","kind":"primate","color":"#444540","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_galago":{"name":"Gálago senegalés","latin":"Galago senegalensis","rare":"Poco común","kind":"primate","color":"#9b826e","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_babuino_oliva":{"name":"Babuino oliva","latin":"Papio anubis","rare":"Común","kind":"primate","color":"#8c7a62","habitats":["pradera","bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_caracal":{"name":"Caracal","latin":"Caracal caracal","rare":"Raro","kind":"cat","color":"#b08b68","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_suricata":{"name":"Suricata","latin":"Suricata suricatta","rare":"Común","kind":"mustelid","color":"#b99c73","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_springbok":{"name":"Springbok","latin":"Antidorcas marsupialis","rare":"Común","kind":"deer","color":"#bd9a6e","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_guepardo":{"name":"Guepardo","latin":"Acinonyx jubatus","rare":"Raro","kind":"cat","color":"#d3aa6e","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_pinguino_africano":{"name":"Pingüino africano","latin":"Spheniscus demersus","rare":"Raro","kind":"seabird","color":"#292c2c","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_lobo_marino_cabo":{"name":"Lobo marino del Cabo","latin":"Arctocephalus pusillus","rare":"Poco común","kind":"otter","color":"#736052","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_tiburon_blanco":{"name":"Tiburón blanco","latin":"Carcharodon carcharias","rare":"Muy rara","kind":"fish","color":"#a1b4b6","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_tortuga_laúd":{"name":"Tortuga laúd","latin":"Dermochelys coriacea","rare":"Raro","kind":"tortoise","color":"#555c66","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_eland":{"name":"Eland común","latin":"Taurotragus oryx","rare":"Poco común","kind":"deer","color":"#b29370","habitats":["pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_secretario":{"name":"Ave secretaria","latin":"Sagittarius serpentarius","rare":"Raro","kind":"raptor","color":"#b5b4ad","habitats":["pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_lemur_colaanillada":{"name":"Lémur de cola anillada","latin":"Lemur catta","rare":"Común","kind":"lemur","color":"#adb2ae","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_sifaka":{"name":"Sifaca de Verreaux","latin":"Propithecus verreauxi","rare":"Raro","kind":"lemur","color":"#f1e9dd","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_fosa":{"name":"Fosa","latin":"Cryptoprocta ferox","rare":"Raro","kind":"cat","color":"#a87a5a","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_camaleon_pantera":{"name":"Camaleón pantera","latin":"Furcifer pardalis","rare":"Poco común","kind":"lizard","color":"#5e9a68","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_gecko_diurno":{"name":"Geco diurno de Madagascar","latin":"Phelsuma madagascariensis","rare":"Común","kind":"lizard","color":"#48a26c","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_tenrec":{"name":"Tenrec común","latin":"Tenrec ecaudatus","rare":"Poco común","kind":"small","color":"#9e7c63","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_indri":{"name":"Indri","latin":"Indri indri","rare":"Muy rara","kind":"lemur","color":"#393e3c","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_tortuga_radiada":{"name":"Tortuga radiada","latin":"Astrochelys radiata","rare":"Raro","kind":"tortoise","color":"#8b7753","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false},"af_fosa_ave":{"name":"Águila pescadora de Madagascar","latin":"Haliaeetus vociferoides","rare":"Muy rara","kind":"raptor","color":"#7a5b48","habitats":["costa","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Melánico","Notable"],"dimorphism":false}});
// Solo especies con dimorfismo sexual notorio y representable con sprites distintos.
const SEXUAL_DIMORPHISM={
  af_leon:{type:'mane'},
  af_mandril:{type:'face'},
  af_babuino_hamadryas:{type:'mantle'},
  af_gelada:{type:'mantle'},
  asia_esp_0294:{type:'monal'},
  asia_esp_0864:{type:'monal'},
  asia_esp_0865:{type:'tragopan'},
  af_avestruz:{type:'ostrich'},
  asia_esp_0880:{type:'capercaillie'},
  asia_esp_0441:{type:'gazelle'},
  ciervo_rojo:{type:'antlers'},
  corzo_europeo:{type:'antlers'},
  alce:{type:'antlers'},
  reno:{type:'reindeer'},
  ibice_alpino:{type:'ibex'},
  cabra_montes_iberica:{type:'ibex'},
  urogallo_comun:{type:'capercaillie'},
  eu_esp_0649:{type:'shoveler'},
  eu_esp_0629:{type:'finch'},
  eu_esp_0628:{type:'blackbird'},
  eu_esp_0639:{type:'bullfinch'},
  eu_esp_0638:{type:'oriole'},
  asia_esp_0081:{type:'ibex'},
  asia_esp_0149:{type:'antlers'},
  asia_esp_0080:{type:'ibex'},
  asia_esp_0410:{type:'peafowl'},
  asia_esp_0891:{type:'mandarinduck'},
  asia_esp_0422:{type:'pheasant'},
  asia_esp_0124:{type:'pheasant'},
  asia_esp_0296:{type:'pheasant'},
  asia_esp_0833:{type:'blackbuck'},
  asia_esp_0111:{type:'antlers'}
};
Object.entries(SPECIES).forEach(([id,sp])=>{sp.dimorphism=!!SEXUAL_DIMORPHISM[id];});

// Beta 3.7: diez especies nuevas, sin modificar las anteriores.
Object.assign(SPECIES,{"af_asno_somali":{"name":"Asno salvaje somalí","latin":"Equus africanus somaliensis","rare":"Muy rara","kind":"zebra","color":"#b7a990","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_gerenuc":{"name":"Gerenuc","latin":"Litocranius walleri","rare":"Poco común","kind":"deer","color":"#bd8a55","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_dikdik_guenther":{"name":"Dicdic de Günther","latin":"Madoqua guentheri","rare":"Poco común","kind":"deer","color":"#a78368","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_babuino_hamadryas":{"name":"Babuino hamadríade","latin":"Papio hamadryas","rare":"Raro","kind":"primate","color":"#b7afa0","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_lechwe_rojo":{"name":"Lechwe rojo","latin":"Kobus leche","rare":"Poco común","kind":"deer","color":"#bd7855","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_jacana_africana":{"name":"Jacana africana","latin":"Actophilornis africanus","rare":"Común","kind":"wader","color":"#966e4f","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_sitatunga":{"name":"Sitatunga","latin":"Tragelaphus spekii","rare":"Raro","kind":"deer","color":"#886e52","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_potamoquero":{"name":"Potamóquero rojo","latin":"Potamochoerus porcus","rare":"Poco común","kind":"boar","color":"#b25735","habitats":["bosque","humedal"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable","Melánico"],"dimorphism":false},"af_mono_brazza":{"name":"Mono de De Brazza","latin":"Cercopithecus neglectus","rare":"Raro","kind":"primate","color":"#757c71","habitats":["bosque","rio"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_picatartes_gris":{"name":"Picatartes de cuello gris","latin":"Picathartes oreas","rare":"Muy rara","kind":"songbird","color":"#817769","habitats":["bosque"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false}});
// Beta 3.8: fauna endémica y característica de las nuevas zonas africanas.
Object.assign(SPECIES,{"af_lobo_etiope":{"name":"Lobo etíope","latin":"Canis simensis","rare":"Muy rara","kind":"canid","color":"#b75f40","habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_gelada":{"name":"Gelada","latin":"Theropithecus gelada","rare":"Poco común","kind":"primate","color":"#8c7062","habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_ibice_walia":{"name":"Íbice de Walia","latin":"Capra walie","rare":"Muy rara","kind":"deer","color":"#96734f","habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_quebrantahuesos":{"name":"Quebrantahuesos","latin":"Gypaetus barbatus","rare":"Raro","kind":"raptor","color":"#bb8c5d","habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_nyala_montana":{"name":"Nyala de montaña","latin":"Tragelaphus buxtoni","rare":"Muy rara","kind":"deer","color":"#90715f","habitats":["montana","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_ganso_alas_azules":{"name":"Ganso de alas azules","latin":"Cyanochen cyanoptera","rare":"Poco común","kind":"swan","color":"#807c72","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_zorro_cabo":{"name":"Zorro del Cabo","latin":"Vulpes chama","rare":"Común","kind":"canid","color":"#a99875","habitats":["desierto","estepa","pradera"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_hiena_parda":{"name":"Hiena parda","latin":"Parahyaena brunnea","rare":"Raro","kind":"canid","color":"#67503e","habitats":["desierto","estepa","pradera"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_camaleon_namaqua":{"name":"Camaleón de Namaqua","latin":"Chamaeleo namaquensis","rare":"Poco común","kind":"lizard","color":"#b3a16d","habitats":["desierto","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_geco_patas_palmeadas":{"name":"Geco de patas palmeadas","latin":"Pachydactylus rangei","rare":"Poco común","kind":"lizard","color":"#e6be94","habitats":["desierto"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
// v3.9: fauna africana adicional, IDs nuevos para conservar registros existentes.
Object.assign(SPECIES,{"af_macaco_berberia":{"name":"Macaco de Berbería","latin":"Macaca sylvanus","rare":"Raro","kind":"primate","color":"#ae987f","habitats":["bosque","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_gato_montes_africano":{"name":"Gato montés africano","latin":"Felis lybica","rare":"Poco común","kind":"cat","color":"#b99a79","habitats":["desierto","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_ciervo_berberia":{"name":"Ciervo de Berbería","latin":"Cervus elaphus barbarus","rare":"Raro","kind":"deer","color":"#8a6747","habitats":["bosque","montana"],"times":["amanecer","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_zorro_ruppell":{"name":"Zorro de Rüppell","latin":"Vulpes rueppellii","rare":"Poco común","kind":"canid","color":"#d7b78b","habitats":["desierto","estepa"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_antilope_sable":{"name":"Antílope sable","latin":"Hippotragus niger","rare":"Raro","kind":"deer","color":"#46392d","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_calao_terrestre":{"name":"Cálao terrestre sureño","latin":"Bucorvus leadbeateri","rare":"Raro","kind":"raptor","color":"#302c2d","habitats":["pradera","bosque"],"times":["amanecer","dia"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_pangolin_temminck":{"name":"Pangolín terrestre","latin":"Smutsia temminckii","rare":"Muy rara","kind":"pangolin","color":"#9f8061","habitats":["bosque","estepa"],"times":["atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_inseparable_lilian":{"name":"Inseparable de Lilian","latin":"Agapornis lilianae","rare":"Poco común","kind":"songbird","color":"#65a460","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_dugongo":{"name":"Dugongo","latin":"Dugong dugon","rare":"Muy rara","kind":"sirenian","color":"#9caeac","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_manta_gigante":{"name":"Manta gigante","latin":"Mobula birostris","rare":"Raro","kind":"ray","color":"#334e59","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_delfin_jorobado_indico":{"name":"Delfín jorobado del Índico","latin":"Sousa plumbea","rare":"Raro","kind":"cetacean","color":"#859aab","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_martin_malaquita":{"name":"Martín pescador malaquita","latin":"Corythornis cristatus","rare":"Poco común","kind":"kingfisher","color":"#277c9b","habitats":["rio","humedal"],"times":["amanecer","dia"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
// Beta 3.10: ocho especies de los lagos del Rift y Seychelles/Aldabra.
Object.assign(SPECIES,{"af_flamenco_enano":{"name":"Flamenco enano","latin":"Phoeniconaias minor","rare":"Poco común","kind":"wader","color":"#dd7e96","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_pelicano_blanco":{"name":"Pelícano blanco","latin":"Pelecanus onocrotalus","rare":"Poco común","kind":"pelican","color":"#ded9c8","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_jirafa_rothschild":{"name":"Jirafa de Rothschild","latin":"Giraffa camelopardalis rothschildi","rare":"Raro","kind":"giraffe","color":"#c49b61","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_gran_kudu":{"name":"Gran kudú","latin":"Tragelaphus strepsiceros","rare":"Raro","kind":"deer","color":"#9f8870","habitats":["pradera","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_tortuga_aldabra":{"name":"Tortuga gigante de Aldabra","latin":"Aldabrachelys gigantea","rare":"Muy rara","kind":"tortoise","color":"#78845d","habitats":["pradera","bosque","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_loro_negro_seychelles":{"name":"Loro negro de Seychelles","latin":"Coracopsis barklyi","rare":"Raro","kind":"forestbird","color":"#635e5a","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_cernicalo_seychelles":{"name":"Cernícalo de Seychelles","latin":"Falco araeus","rare":"Raro","kind":"raptor","color":"#a88b6d","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_tiburon_puntas_negras":{"name":"Tiburón de puntas negras de arrecife","latin":"Carcharhinus melanopterus","rare":"Poco común","kind":"fish","color":"#71868d","habitats":["costa"],"times":["amanecer","dia","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false}});
// Beta 3.12: ocho especies originales de las dos regiones africanas.
Object.assign(SPECIES,{"af_picozapato":{"name":"Picozapato","latin":"Balaeniceps rex","rare":"Muy rara","kind":"stork","color":"#868d87","habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_lechwe_negro":{"name":"Lechwe negro","latin":"Kobus leche smithemani","rare":"Raro","kind":"deer","color":"#46352a","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Notable"],"dimorphism":false},"af_grulla_carunculada":{"name":"Grulla carunculada","latin":"Grus carunculata","rare":"Raro","kind":"wader","color":"#b6a99a","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_puku":{"name":"Puku","latin":"Kobus vardonii","rare":"Poco común","kind":"deer","color":"#b99562","habitats":["humedal","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Melánico","Notable"],"dimorphism":false},"af_impala":{"name":"Impala","latin":"Aepyceros melampus","rare":"Común","kind":"deer","color":"#a87d50","habitats":["pradera","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_nyala_comun":{"name":"Niala común","latin":"Tragelaphus angasii","rare":"Poco común","kind":"deer","color":"#7d6350","habitats":["bosque","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_mangosta_enana":{"name":"Mangosta enana africana","latin":"Helogale parvula","rare":"Poco común","kind":"small","color":"#947a62","habitats":["bosque","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_calao_trompetero":{"name":"Cálao trompetero","latin":"Bycanistes bucinator","rare":"Raro","kind":"forestbird","color":"#42474b","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
const GLOBAL_BIOMES_FULL=['bosque','pradera','rio','costa','tundra','montana','humedal','mar_abierto','estepa','mediterraneo','desierto','selva','sabana'];
const REGION_BIOMES={
  'HX-02-13':["bosque", "rio", "tundra", "pradera"],
  'HX-03-14':["bosque", "tundra", "rio", "pradera"],
  'HX-04-13':["estepa", "pradera", "montana", "rio"],
  'HX-01-09':['bosque','pradera','rio','costa'],
  'HX-01-11':['bosque','tundra','rio','costa'],
  'HX-02-09':['montana','bosque','pradera','rio'],
  'HX-02-10':['bosque','pradera','rio','costa'],
  'HX-02-11':['bosque','pradera','rio','montana'],
  'HX-02-12':['bosque','pradera','costa','montana'],
  'HX-03-09':['bosque','pradera','rio','montana'],
  'HX-03-10':['bosque','pradera','costa','montana'],
  'HX-03-11':['bosque','rio','costa','pradera'],
  'HX-03-12':['bosque','pradera','rio','montana'],
  'HX-03-13':['bosque','montana','pradera'],
  'HX-03-15':['bosque','pradera','montana','estepa'],
  "HX-02-15":["bosque", "montana", "pradera", "rio"],
  "HX-03-16":["bosque", "tundra", "montana", "rio"],
  "HX-03-18":["tundra", "costa", "rio", "bosque"],
  "HX-04-14":["desierto", "estepa", "pradera", "montana"],
  "HX-04-15":["montana", "pradera", "bosque", "rio"]
};
function setEco(sp, habitats, times, seasons){sp.habitats=habitats; sp.times=times; sp.seasons=seasons;}
function hasWords(name, parts){return parts.some(p=>name.includes(p));}
function normalizeEcology(){
  for(const [id,sp] of Object.entries(SPECIES)){
    const n=sp.name.toLowerCase();
    const k=sp.kind;
    let habitats=['bosque'], times=['amanecer','dia','atardecer'], seasons=['primavera','verano','otono','invierno'];
    if(k==='canid') setEco(sp,['bosque','pradera'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='deer') setEco(sp,['bosque','pradera'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='mustelid') setEco(sp,['bosque','rio'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='small') setEco(sp,['bosque','pradera'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='otter') setEco(sp,['rio','costa'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='seabird') setEco(sp,['costa'],['amanecer','dia','atardecer'],['primavera','verano']);
    else if(k==='owl') setEco(sp,['bosque','pradera'],['atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='cat') setEco(sp,['bosque','montana'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='bear') setEco(sp,['bosque','montana'],['amanecer','atardecer','noche'],['primavera','verano','otono']);
    else if(k==='forestbird') setEco(sp,['bosque','pradera'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='raptor') setEco(sp,['pradera','montana','costa'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='songbird') setEco(sp,['bosque','pradera'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='stork' || k==='heron' || k==='swan' || k==='pelican' || k==='kingfisher') setEco(sp,['rio','costa','pradera'],['amanecer','dia','atardecer'],['primavera','verano','otono']);
    else if(k==='wader') setEco(sp,['costa','rio','pradera'],['amanecer','dia','atardecer'],['primavera','verano']);
    else if(k==='reptile') setEco(sp,['pradera','montana','bosque'],['dia','atardecer'],['primavera','verano','otono']);
    else if(k==='salamander') setEco(sp,['rio','bosque','montana'],['amanecer','atardecer','noche'],['primavera','verano','otono']);
    else if(k==='snake') setEco(sp,['pradera','rio','bosque'],['dia','atardecer'],['primavera','verano','otono']);
    else if(k==='tortoise') setEco(sp,['pradera','montana','costa'],['dia','atardecer'],['primavera','verano','otono']);
    else if(k==='fish') setEco(sp,['rio','costa'],['amanecer','dia','atardecer'],['primavera','verano','otono','invierno']);
    else if(k==='rabbit' || k==='hare') setEco(sp,['pradera','bosque'],['amanecer','atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='boar') setEco(sp,['bosque','pradera'],['atardecer','noche'],['primavera','verano','otono','invierno']);
    else if(k==='bison') setEco(sp,['pradera','bosque'],['amanecer','dia','atardecer'],['primavera','verano','otono','invierno']);
    else if(k==='beaver') setEco(sp,['rio'],['atardecer','noche'],['primavera','verano','otono','invierno']);

    if(hasWords(n,['tritón','triton','rana','sapo'])) sp.habitats=['rio','pradera','bosque'];
    if(hasWords(n,['cisne','garza','martín pescador','martin pescador','cigüeña','ciguena','pelícano','pelicano','flamenco'])) sp.habitats=['rio','costa','pradera'];
    if(hasWords(n,['cormorán','cormoran','frailecillo'])) sp.habitats=['costa','rio'];
    if(hasWords(n,['búho','buho','lechuza','mochuelo'])) sp.times=['atardecer','noche'];
    if(hasWords(n,['alondra','pinzón','pinzon','mirlo','petirrojo','curruca','oropéndola','herrerillo'])) sp.times=['amanecer','dia','atardecer'];
    if(hasWords(n,['murciélago','murcielago','erizo','tejón','tejon','turón','turon','lirón','liron','topo'])) sp.times=['atardecer','noche'];
    if(hasWords(n,['nutria','castor'])) sp.habitats=['rio','costa'];
    if(hasWords(n,['alce','reno','urogallo','zorro ártico','zorro artico'])){ sp.habitats=[...new Set([...sp.habitats,'tundra'])]; sp.seasons=['verano','otono','invierno']; }
    if(hasWords(n,['íbice','ibice','rebeco','quebrantahuesos','águila','aguila','buitre','lince','oso','víbora','vibora','cabra montés','cabra montes','marmota'])) sp.habitats=[...new Set([...sp.habitats,'montana'])];
    if(hasWords(n,['camaleón','camaleon','lagarto'])) sp.habitats=['pradera','montana','costa'];
    if(hasWords(n,['liebre variable','perdiz nival'])){ sp.seasons=['invierno','otono','primavera']; sp.habitats=[...new Set([...sp.habitats,'montana','tundra'])]; }
    if(hasWords(n,['frailecillo','golondrina de mar','somormujo'])) sp.seasons=['primavera','verano'];
    if(hasWords(n,['trucha','barbo','tenca','perca'])) sp.habitats=['rio'];
  }
  REGIONS.forEach(r=>{r.habitats=(REGION_BIOMES[r.id]||r.habitats).slice(0,4);});
}

const ASIA_V23_TAXONOMY={"asia_esp_0538":{"className":"Mammalia","subClass":"Cánidos"},"asia_esp_0206":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0214":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0383":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0519":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0102":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0205":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0300":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0065":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0910":{"className":"Actinopterygii","subClass":"Peces óseos"},"asia_esp_0327":{"className":"Reptilia","subClass":"Tortugas"},"asia_esp_0873":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0246":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0182":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0218":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0227":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0534":{"className":"Mammalia","subClass":"Cánidos"},"asia_esp_0321":{"className":"Mammalia","subClass":"Roedores y lagomorfos"},"asia_esp_0183":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0404":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0442":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0347":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0319":{"className":"Mammalia","subClass":"Roedores y lagomorfos"},"asia_esp_0468":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0891":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0890":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0226":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0878":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0422":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0842":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0824":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0915":{"className":"Actinopterygii","subClass":"Peces óseos"},"asia_esp_0911":{"className":"Actinopterygii","subClass":"Peces óseos"},"asia_esp_0888":{"className":"Aves","subClass":"Aves acuáticas y marinas"},"asia_esp_0868":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0872":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0410":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0874":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0816":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0176":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0852":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0336":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0860":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0853":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0476":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0833":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0050":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0061":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0063":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0830":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0465":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0825":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0900":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0136":{"className":"Reptilia","subClass":"Otros reptiles"},"asia_esp_0906":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0905":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0351":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0124":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0296":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0096":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0355":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0006":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0318":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0854":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0395":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0856":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0310":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0345":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0902":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0016":{"className":"Amphibia","subClass":"Salamandras"},"asia_esp_0433":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0440":{"className":"Mammalia","subClass":"Felinos"},"asia_esp_0333":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0111":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0249":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0067":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0867":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0869":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0883":{"className":"Aves","subClass":"Rapaces"},"asia_esp_0849":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0858":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0238":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0857":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0317":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0859":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0251":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0352":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0436":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0491":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0165":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0834":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0498":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0901":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0527":{"className":"Reptilia","subClass":"Lagartos"},"asia_esp_0316":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0373":{"className":"Reptilia","subClass":"Serpientes"},"asia_esp_0877":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0494":{"className":"Aves","subClass":"Aves terrestres"},"asia_esp_0363":{"className":"Mammalia","subClass":"Cánidos"},"asia_esp_0414":{"className":"Mammalia","subClass":"Otros mamíferos"},"asia_esp_0308":{"className":"Mammalia","subClass":"Primates"},"asia_esp_0087":{"className":"Mammalia","subClass":"Ungulados"},"asia_esp_0017":{"className":"Amphibia","subClass":"Salamandras"}};
// Beta 3.15.4: clases y grupos uniformes para cuaderno, bestiario e investigación.
function taxonomyInfo(id){
 const sp=SPECIES[id];if(!sp)return {className:'Animalia',subClass:'Sin clasificar'};
 const kind=sp.kind,latin=sp.latin||'',name=sp.name.toLocaleLowerCase('es');
 const genus=latin.split(' ')[0],g=(className,subClass)=>({className,subClass});
 if(kind==='amphibian'||/^(Rana|Epidalea|Strauchbufo|Conraua|Xenopus|Sclerophrys|Breviceps|Schismaderma)$/.test(genus))
  return g('Amphibia','Ranas y sapos');
 if(kind==='salamander')return g('Amphibia','Salamandras y tritones');
 if(kind==='ray')return g('Chondrichthyes','Rayas');
 if(kind==='fish')return g('Actinopterygii','Peces óseos');
 if(kind==='crocodile')return g('Reptilia','Cocodrilianos');
 if(kind==='tortoise')return g('Reptilia','Tortugas');
 if(kind==='snake')return g('Reptilia','Serpientes');
 if(kind==='lizard'||kind==='reptile')return g('Reptilia','Lagartos');
 if(kind==='raptor')return g('Aves','Aves rapaces');
 if(kind==='owl')return g('Aves','Búhos y lechuzas');
 if(kind==='seabird')return g('Aves','Aves marinas');
 if(['heron','stork','wader','pelican','kingfisher'].includes(kind))return g('Aves','Aves acuáticas y ribereñas');
 if(kind==='swan')return g('Aves','Anátidas');
 if(kind==='ostrich')return g('Aves','Ratites');
 if(genus==='Lagopus'||/perdiz|faisán|faisan|urogallo|codorniz/.test(name))return g('Aves','Galliformes');
 if(/cálao|calao/.test(name)||genus==='Buceros')return g('Aves','Cálaos');
 if(kind==='forestbird'||kind==='songbird')return g('Aves','Aves terrestres');
 if(kind==='cat')return g('Mammalia','Felinos');
 if(kind==='canid')return g('Mammalia','Cánidos');
 if(kind==='bear')return g('Mammalia','Úrsidos');
 if(kind==='mustelid'||kind==='otter')return g('Mammalia','Mustélidos');
 if(kind==='rabbit'||kind==='hare'||genus==='Lepus')return g('Mammalia','Lagomorfos');
 if(kind==='primate')return g('Mammalia','Primates');
 if(kind==='lemur')return g('Mammalia','Lémures');
 if(kind==='elephant')return g('Mammalia','Elefantes');
 if(kind==='rhino')return g('Mammalia','Rinocerontes');
 if(kind==='hippo')return g('Mammalia','Hipopótamos');
 if(kind==='pangolin')return g('Mammalia','Pangolines');
 if(kind==='giraffe')return g('Mammalia','Jirafas y afines');
 if(kind==='cetacean')return g('Mammalia','Cetáceos');
 if(kind==='sirenian')return g('Mammalia','Sirénidos');
 if(kind==='beaver'||kind==='small'){
  if(/murciélago|murcielago/.test(name))return g('Mammalia','Murciélagos');
  if(/desmán|desman|musaraña|musarana|topo/.test(name))return g('Mammalia','Insectívoros');
  return g('Mammalia','Roedores y pequeños mamíferos');
 }
 if(kind==='deer'||kind==='bison')return g('Mammalia','Ungulados');
 if(kind==='zebra')return g('Mammalia','Équidos');
 if(kind==='camel')return g('Mammalia','Camélidos');
 if(kind==='boar')return g('Mammalia','Suidos');
 return g('Mammalia','Otros mamíferos');
}
function taxonomyText(id){
  const st=stage(id); const t=taxonomyInfo(id);
  if(st<2) return 'Clasificación: por estudiar';
  if(st<3) return `Clase: ${t.className}`;
  return `Clase: ${t.className} · Grupo: ${t.subClass}`;
}
// Beta 3.10.1: preservar la ecología explícita de las dos regiones nuevas.
// normalizeEcology() aplica perfiles por familia al catálogo global y puede
// sobrescribir la ecología africana (p. ej., león/guepardo pasan a bosque).
// Capturamos únicamente las fichas de Rift y Seychelles antes de normalizar:
// sin tocar guardados, regiones previas ni sus ID.
const V310_NEW_REGIONS=['HX-08-12','HX-07-14','HX-09-12','HX-11-10'];
const V310_PRESERVED_ECO=Object.fromEntries(
 [...new Set(REGIONS.filter(r=>V310_NEW_REGIONS.includes(r.id)).flatMap(r=>r.species))]
 .filter(id=>!!SPECIES[id]).map(id=>[id,{
  habitats:[...SPECIES[id].habitats],times:[...SPECIES[id].times],seasons:[...SPECIES[id].seasons]
 }])
);
normalizeEcology();
for(const [id,eco] of Object.entries(V310_PRESERVED_ECO))Object.assign(SPECIES[id],eco);

// Beta 3.13: regularización África ↔ Atlas_Fauna_Hexagonal_209_900_Especies.xlsx.
// Los ID af_xlsx_* son persistentes; no se reescriben identificadores históricos.
Object.assign(SPECIES,{"af_xlsx_sahara_buitre":{"name":"Buitre orejudo","latin":"Torgos tracheliotos","rare":"Raro","kind":"raptor","color":"#9d9478","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_jerbo":{"name":"Jerbo egipcio","latin":"Jaculus jaculus","rare":"Común","kind":"small","color":"#9d9478","habitats":["desierto"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_addax":{"name":"Addax","latin":"Addax nasomaculatus","rare":"Muy rara","kind":"deer","color":"#9d9478","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_geco_desierto":{"name":"Geco del desierto","latin":"Stenodactylus sthenodactylus","rare":"Poco común","kind":"lizard","color":"#9d9478","habitats":["desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_vibora_cornuda":{"name":"Víbora cornuda","latin":"Cerastes cerastes","rare":"Raro","kind":"snake","color":"#9d9478","habitats":["desierto"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_alcefalo":{"name":"Alcéfalo común","latin":"Alcelaphus buselaphus","rare":"Poco común","kind":"deer","color":"#9d9478","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gacela_frente_roja":{"name":"Gacela de frente roja","latin":"Eudorcas rufifrons","rare":"Raro","kind":"deer","color":"#9d9478","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_orix_cimitarra":{"name":"Órix de cuernos de cimitarra","latin":"Oryx dammah","rare":"Muy rara","kind":"deer","color":"#9d9478","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gacela_cuvier":{"name":"Gacela de Cuvier","latin":"Gazella cuvieri","rare":"Raro","kind":"deer","color":"#9d9478","habitats":["montana","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_garceta":{"name":"Garceta común","latin":"Egretta garzetta","rare":"Común","kind":"heron","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_tilapia":{"name":"Tilapia del Nilo","latin":"Oreochromis niloticus","rare":"Común","kind":"fish","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_varano_nilo":{"name":"Varano del Nilo","latin":"Varanus niloticus","rare":"Poco común","kind":"lizard","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_martin_pio":{"name":"Martín pescador pío","latin":"Ceryle rudis","rare":"Poco común","kind":"kingfisher","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_bonobo":{"name":"Bonobo","latin":"Pan paniscus","rare":"Muy rara","kind":"primate","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_cocodrilo_enano":{"name":"Cocodrilo enano africano","latin":"Osteolaemus tetraspis","rare":"Raro","kind":"crocodile","color":"#9d9478","habitats":["rio","humedal","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_pez_tigre_goliat":{"name":"Pez tigre goliat","latin":"Hydrocynus goliath","rare":"Muy rara","kind":"fish","color":"#9d9478","habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_piton_bola":{"name":"Pitón bola","latin":"Python regius","rare":"Poco común","kind":"snake","color":"#9d9478","habitats":["bosque","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_rana_goliat":{"name":"Rana goliat","latin":"Conraua goliath","rare":"Muy rara","kind":"salamander","color":"#9d9478","habitats":["rio","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_hipopotamo_pigmeo":{"name":"Hipopótamo pigmeo","latin":"Choeropsis liberiensis","rare":"Muy rara","kind":"hippo","color":"#9d9478","habitats":["bosque","humedal"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gato_dorado":{"name":"Gato dorado africano","latin":"Caracal aurata","rare":"Raro","kind":"cat","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_ayeaye":{"name":"Aye-aye","latin":"Daubentonia madagascariensis","rare":"Muy rara","kind":"primate","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_lemur_raton":{"name":"Lémur ratón gris","latin":"Microcebus murinus","rare":"Poco común","kind":"primate","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_lemur_rufo":{"name":"Lémur rufo rojo","latin":"Varecia rubra","rare":"Raro","kind":"primate","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_vanga_azul":{"name":"Vanga azul","latin":"Cyanolanius madagascarinus","rare":"Raro","kind":"songbird","color":"#9d9478","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_camaleon_parson":{"name":"Camaleón de Parson","latin":"Calumma parsonii","rare":"Muy rara","kind":"lizard","color":"#9d9478","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gecko_hoja":{"name":"Geco cola de hoja satánico","latin":"Uroplatus phantasticus","rare":"Raro","kind":"lizard","color":"#9d9478","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_boa_madagascar":{"name":"Boa de Madagascar","latin":"Sanzinia madagascariensis","rare":"Raro","kind":"snake","color":"#9d9478","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_rinoceronte_negro":{"name":"Rinoceronte negro","latin":"Diceros bicornis","rare":"Muy rara","kind":"rhino","color":"#9d9478","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_cerdo_hormiguero":{"name":"Cerdo hormiguero","latin":"Orycteropus afer","rare":"Poco común","kind":"small","color":"#9d9478","habitats":["pradera","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_mamba_negra":{"name":"Mamba negra","latin":"Dendroaspis polylepis","rare":"Raro","kind":"snake","color":"#9d9478","habitats":["pradera","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gacela_thomson":{"name":"Gacela de Thomson","latin":"Eudorcas thomsonii","rare":"Común","kind":"deer","color":"#9d9478","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_topi":{"name":"Topi","latin":"Damaliscus lunatus","rare":"Poco común","kind":"deer","color":"#9d9478","habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_avestruz_somali":{"name":"Avestruz somalí","latin":"Struthio molybdophanes","rare":"Raro","kind":"ostrich","color":"#9d9478","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_gacela_speke":{"name":"Gacela de Speke","latin":"Gazella spekei","rare":"Raro","kind":"deer","color":"#9d9478","habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_jirafa_reticulada":{"name":"Jirafa reticulada","latin":"Giraffa reticulata","rare":"Raro","kind":"giraffe","color":"#9d9478","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_orix_beisa":{"name":"Órix beisa","latin":"Oryx beisa","rare":"Poco común","kind":"deer","color":"#9d9478","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_rata_topo":{"name":"Rata topo gigante","latin":"Tachyoryctes macrocephalus","rare":"Raro","kind":"small","color":"#9d9478","habitats":["montana","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_lemur_etc":{"name":"Rana de uñas africana","latin":"Xenopus laevis","rare":"Poco común","kind":"salamander","color":"#9d9478","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
const AFRICA_EXCEL_HEX={"HX-06-07":"HX-04-09","HX-07-11":"HX-05-12","HX-06-09":"HX-04-10","HX-06-11":"HX-04-11","HX-08-11":"HX-06-10","HX-07-12":"HX-05-11","HX-09-14":"HX-08-11","HX-09-11":"HX-07-12","HX-07-13":"HX-06-12","HX-07-08":"HX-05-10","HX-07-10":"HX-06-11"};
const AFRICA_V313_ASSIGN={"HX-06-07":["af_xlsx_sahara_buitre","asia_esp_0206","af_xlsx_jerbo","af_xlsx_addax","af_xlsx_geco_desierto","af_xlsx_vibora_cornuda"],"HX-07-11":["af_xlsx_sahara_buitre","af_xlsx_alcefalo","af_xlsx_gacela_frente_roja","af_xlsx_orix_cimitarra"],"HX-07-10":["af_xlsx_alcefalo","af_xlsx_cerdo_hormiguero","af_xlsx_mamba_negra","af_xlsx_gacela_thomson","af_xlsx_topi","af_facoquero"],"HX-11-10":["af_xlsx_alcefalo","af_xlsx_rinoceronte_negro","af_xlsx_cerdo_hormiguero","af_xlsx_mamba_negra","af_xlsx_lemur_etc","af_facoquero"],"HX-06-09":["eu_esp_0219","eu_esp_0505","af_xlsx_gacela_cuvier"],"HX-06-08":["af_xlsx_gacela_cuvier"],"HX-06-11":["af_xlsx_garceta","af_xlsx_tilapia","af_xlsx_varano_nilo","af_xlsx_martin_pio"],"HX-09-11":["af_xlsx_tilapia","af_xlsx_varano_nilo"],"HX-08-11":["af_xlsx_bonobo","af_xlsx_cocodrilo_enano","af_xlsx_pez_tigre_goliat","af_xlsx_gato_dorado","af_okapi"],"HX-08-10":["af_xlsx_cocodrilo_enano"],"HX-08-08":["af_xlsx_piton_bola","af_xlsx_rana_goliat","af_xlsx_hipopotamo_pigmeo","af_xlsx_gato_dorado"],"HX-07-08":["af_xlsx_piton_bola","af_facoquero"],"HX-09-14":["af_xlsx_ayeaye","af_xlsx_lemur_raton","af_xlsx_lemur_rufo","af_xlsx_vanga_azul","af_xlsx_camaleon_parson","af_xlsx_gecko_hoja","af_xlsx_boa_madagascar"],"HX-07-12":["af_xlsx_avestruz_somali","af_xlsx_gacela_speke","af_xlsx_jirafa_reticulada","af_xlsx_orix_beisa"],"HX-07-13":["af_xlsx_rata_topo"]};
for(const region of REGIONS.filter(r=>r.continent==='África')){
 region.excelHex=AFRICA_EXCEL_HEX[region.id]||null;
 for(const id of AFRICA_V313_ASSIGN[region.id]||[]){
  if(!SPECIES[id])continue;
  if(!region.species.includes(id))region.species.push(id);
 }
}
// Asegura que ninguna especie asignada quede inaccesible por un bioma incompatible.
for(const region of REGIONS.filter(r=>r.continent==='África')){
 for(const id of region.species){
  const sp=SPECIES[id];if(!sp)continue;
  if(!sp.habitats.some(h=>region.habitats.includes(h)))sp.habitats=[...new Set([...sp.habitats,region.habitats[0]])];
 }
}

// Beta 3.13.1 · conciliación completa de fauna africana según Excel base (14 hexágonos).
// La tabla usa nombres científicos; chimpancé y gorila se enlazan a fichas de subespecie preexistentes.
Object.assign(SPECIES,{"af_xlsx_131_aquila_fasciata":{"name":"Águila perdicera","latin":"Aquila fasciata","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["montana","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_circaetus_gallicus":{"name":"Águila culebrera","latin":"Circaetus gallicus","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["estepa","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_neophron_percnopterus":{"name":"Alimoche común","latin":"Neophron percnopterus","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["desierto","estepa","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_atelerix_algirus":{"name":"Erizo argelino","latin":"Atelerix algirus","rare":"Poco común","kind":"small","color":"#9b8d70","habitats":["estepa","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_pandion_haliaetus":{"name":"Águila pescadora","latin":"Pandion haliaetus","rare":"Poco común","kind":"raptor","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_sclerophrys_regularis":{"name":"Sapo común africano","latin":"Sclerophrys regularis","rare":"Común","kind":"salamander","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_ceratogymna_atrata":{"name":"Cálao de casquete negro","latin":"Ceratogymna atrata","rare":"Poco común","kind":"forestbird","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_musophaga_violacea":{"name":"Turaco violeta","latin":"Musophaga violacea","rare":"Poco común","kind":"forestbird","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_ploceus_cucullatus":{"name":"Tejedor común","latin":"Ploceus cucullatus","rare":"Común","kind":"songbird","color":"#9b8d70","habitats":["bosque","humedal","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_chlorocebus_sabaeus":{"name":"Mono verde","latin":"Chlorocebus sabaeus","rare":"Común","kind":"primate","color":"#9b8d70","habitats":["bosque","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_phataginus_tricuspis":{"name":"Pangolín arborícola","latin":"Phataginus tricuspis","rare":"Raro","kind":"pangolin","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_cercopithecus_diana":{"name":"Mono diana","latin":"Cercopithecus diana","rare":"Raro","kind":"primate","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_colobus_polykomos":{"name":"Colobo occidental blanco y negro","latin":"Colobus polykomos","rare":"Raro","kind":"primate","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_cephalophus_zebra":{"name":"Duíquer cebra","latin":"Cephalophus zebra","rare":"Raro","kind":"deer","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_pantodon_buchholzi":{"name":"Pez mariposa africano","latin":"Pantodon buchholzi","rare":"Raro","kind":"fish","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_agama_agama":{"name":"Agama común","latin":"Agama agama","rare":"Común","kind":"lizard","color":"#9b8d70","habitats":["estepa","pradera","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_gyps_africanus":{"name":"Buitre dorsiblanco africano","latin":"Gyps africanus","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_lepus_capensis":{"name":"Liebre del Cabo","latin":"Lepus capensis","rare":"Común","kind":"hare","color":"#9b8d70","habitats":["desierto","estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_hippotragus_equinus":{"name":"Antílope ruano","latin":"Hippotragus equinus","rare":"Poco común","kind":"deer","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_bitis_arietans":{"name":"Víbora bufadora","latin":"Bitis arietans","rare":"Raro","kind":"snake","color":"#9b8d70","habitats":["estepa","pradera","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_equus_africanus":{"name":"Asno salvaje africano","latin":"Equus africanus","rare":"Raro","kind":"deer","color":"#9b8d70","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_madoqua_saltiana":{"name":"Dicdic de Salt","latin":"Madoqua saltiana","rare":"Poco común","kind":"deer","color":"#9b8d70","habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_corythaeola_cristata":{"name":"Turaco gigante","latin":"Corythaeola cristata","rare":"Poco común","kind":"forestbird","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_coracias_caudatus":{"name":"Carraca lila","latin":"Coracias caudatus","rare":"Común","kind":"forestbird","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_polemaetus_bellicosus":{"name":"Águila marcial","latin":"Polemaetus bellicosus","rare":"Raro","kind":"raptor","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_lupulella_mesomelas":{"name":"Chacal de lomo negro","latin":"Lupulella mesomelas","rare":"Común","kind":"canid","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_mungos_mungo":{"name":"Mangosta rayada","latin":"Mungos mungo","rare":"Común","kind":"mustelid","color":"#9b8d70","habitats":["pradera","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_lepus_fagani":{"name":"Liebre etíope","latin":"Lepus fagani","rare":"Poco común","kind":"hare","color":"#9b8d70","habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_otocyon_megalotis":{"name":"Zorro orejudo","latin":"Otocyon megalotis","rare":"Común","kind":"canid","color":"#9b8d70","habitats":["estepa","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_geosciurus_inauris":{"name":"Ardilla terrestre del Cabo","latin":"Geosciurus inauris","rare":"Común","kind":"small","color":"#9b8d70","habitats":["desierto","estepa","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_hystrix_africaeaustralis":{"name":"Puercoespín sudafricano","latin":"Hystrix africaeaustralis","rare":"Poco común","kind":"small","color":"#9b8d70","habitats":["estepa","bosque","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_mellivora_capensis":{"name":"Tejón melero","latin":"Mellivora capensis","rare":"Raro","kind":"mustelid","color":"#9b8d70","habitats":["estepa","pradera","bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_breviceps_macrops":{"name":"Rana de lluvia del desierto","latin":"Breviceps macrops","rare":"Raro","kind":"salamander","color":"#9b8d70","habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_schismaderma_carens":{"name":"Sapo de vientre rojo","latin":"Schismaderma carens","rare":"Poco común","kind":"salamander","color":"#9b8d70","habitats":["rio","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_naja_mossambica":{"name":"Cobra escupidora de Mozambique","latin":"Naja mossambica","rare":"Raro","kind":"snake","color":"#9b8d70","habitats":["pradera","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_hydrictis_maculicollis":{"name":"Nutria de cuello manchado","latin":"Hydrictis maculicollis","rare":"Raro","kind":"otter","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_hydrocynus_vittatus":{"name":"Pez tigre africano","latin":"Hydrocynus vittatus","rare":"Poco común","kind":"fish","color":"#9b8d70","habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_trioceros_jacksonii":{"name":"Camaleón de Jackson","latin":"Trioceros jacksonii","rare":"Poco común","kind":"lizard","color":"#9b8d70","habitats":["bosque","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_xlsx_131_phelsuma_grandis":{"name":"Geco diurno gigante","latin":"Phelsuma grandis","rare":"Común","kind":"lizard","color":"#9b8d70","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
const AFRICA_V3131_EXCEL_REFERENCE={"HX-04-09":{"gameRegion":"HX-06-07","latin":["Torgos tracheliotos","Vulpes zerda","Felis margarita","Jaculus jaculus","Addax nasomaculatus","Gazella dorcas","Stenodactylus sthenodactylus","Cerastes cerastes"]},"HX-04-10":{"gameRegion":"HX-06-09","latin":["Geronticus eremita","Aquila fasciata","Circaetus gallicus","Neophron percnopterus","Canis aureus","Vulpes vulpes","Atelerix algirus","Genetta genetta","Sus scrofa","Macaca sylvanus","Gazella cuvieri","Testudo graeca"]},"HX-04-11":{"gameRegion":"HX-06-11","latin":["Ardea goliath","Egretta garzetta","Pelecanus onocrotalus","Threskiornis aethiopicus","Merops nubicus","Neophron percnopterus","Pandion haliaetus","Ceryle rudis","Hippopotamus amphibius","Oreochromis niloticus","Varanus niloticus","Crocodylus niloticus","Sclerophrys regularis"]},"HX-05-09":{"gameRegion":"HX-08-08","latin":["Ceratogymna atrata","Musophaga violacea","Ploceus cucullatus","Tauraco persa","Caracal aurata","Panthera pardus","Chlorocebus sabaeus","Choeropsis liberiensis","Civettictis civetta","Mandrillus sphinx","Phataginus tricuspis","Cercopithecus diana","Colobus polykomos","Pan troglodytes","Cephalophus zebra","Loxodonta cyclotis","Pantodon buchholzi","Agama agama","Conraua goliath","Python regius","Python sebae"]},"HX-05-10":{"gameRegion":"HX-07-08","latin":["Struthio camelus","Gyps africanus","Vulpes pallida","Caracal caracal","Chlorocebus sabaeus","Galago senegalensis","Hyaena hyaena","Lepus capensis","Gazella dorcas","Hippotragus equinus","Phacochoerus africanus","Agama agama","Bitis arietans","Python regius"]},"HX-05-11":{"gameRegion":"HX-07-12","latin":["Struthio molybdophanes","Caracal caracal","Crocuta crocuta","Papio hamadryas","Equus africanus","Gazella spekei","Giraffa reticulata","Litocranius walleri","Madoqua saltiana","Oryx beisa"]},"HX-05-12":{"gameRegion":"HX-07-11","latin":["Merops nubicus","Struthio camelus","Torgos tracheliotos","Lycaon pictus","Acinonyx jubatus","Crocuta crocuta","Alcelaphus buselaphus","Eudorcas rufifrons","Gazella dorcas","Oryx dammah","Phacochoerus africanus"]},"HX-06-10":{"gameRegion":"HX-08-11","latin":["Corythaeola cristata","Caracal aurata","Panthera pardus","Civettictis civetta","Mandrillus sphinx","Osteolaemus tetraspis","Smutsia gigantea","Cercopithecus neglectus","Gorilla gorilla","Pan paniscus","Pan troglodytes","Loxodonta cyclotis","Okapia johnstoni","Philantomba monticola","Tragelaphus eurycerus","Hydrocynus goliath","Pantodon buchholzi","Python sebae"]},"HX-06-11":{"gameRegion":"HX-07-10","latin":["Phoeniconaias minor","Bucorvus leadbeateri","Coracias caudatus","Sagittarius serpentarius","Struthio camelus","Polemaetus bellicosus","Lupulella mesomelas","Acinonyx jubatus","Leptailurus serval","Panthera leo","Panthera pardus","Crocuta crocuta","Galago senegalensis","Helogale parvula","Mungos mungo","Orycteropus afer","Papio anubis","Alcelaphus buselaphus","Connochaetes taurinus","Damaliscus lunatus","Equus quagga","Eudorcas thomsonii","Giraffa camelopardalis","Hippopotamus amphibius","Loxodonta africana","Phacochoerus africanus","Syncerus caffer","Taurotragus oryx","Bitis arietans","Dendroaspis polylepis"]},"HX-06-12":{"gameRegion":"HX-07-13","latin":["Aquila chrysaetos","Gypaetus barbatus","Canis simensis","Tachyoryctes macrocephalus","Theropithecus gelada","Lepus fagani","Capra walie","Tragelaphus buxtoni"]},"HX-07-10":{"gameRegion":"HX-10-10","latin":["Struthio camelus","Otocyon megalotis","Panthera leo","Geosciurus inauris","Hystrix africaeaustralis","Mellivora capensis","Parahyaena brunnea","Smutsia temminckii","Suricata suricatta","Oryx gazella"]},"HX-07-11":{"gameRegion":"HX-11-10","latin":["Bucorvus leadbeateri","Coracias caudatus","Sagittarius serpentarius","Polemaetus bellicosus","Lupulella mesomelas","Lycaon pictus","Panthera leo","Panthera pardus","Ceratotherium simum","Crocuta crocuta","Geosciurus inauris","Hystrix africaeaustralis","Mungos mungo","Orycteropus afer","Suricata suricatta","Aepyceros melampus","Diceros bicornis","Equus quagga","Giraffa camelopardalis","Hippotragus niger","Loxodonta africana","Syncerus caffer","Taurotragus oryx","Tragelaphus strepsiceros","Breviceps macrops","Schismaderma carens","Xenopus laevis","Bitis arietans","Dendroaspis polylepis","Naja mossambica"]},"HX-07-12":{"gameRegion":"HX-09-11","latin":["Ardea goliath","Balaeniceps rex","Balearica regulorum","Pelecanus onocrotalus","Phoeniconaias minor","Ploceus cucullatus","Leptailurus serval","Hydrictis maculicollis","Papio anubis","Gorilla beringei","Pan troglodytes","Hippopotamus amphibius","Hippotragus equinus","Hippotragus niger","Loxodonta africana","Syncerus caffer","Hydrocynus vittatus","Oreochromis niloticus","Trioceros jacksonii","Crocodylus niloticus"]},"HX-08-11":{"gameRegion":"HX-09-14","latin":["Cyanolanius madagascarinus","Cryptoprocta ferox","Microcebus murinus","Tenrec ecaudatus","Daubentonia madagascariensis","Indri indri","Lemur catta","Propithecus verreauxi","Varecia rubra","Calumma parsonii","Furcifer pardalis","Phelsuma grandis","Uroplatus phantasticus","Sanzinia madagascariensis","Astrochelys radiata"]}};
const AFRICA_V3131_ASSIGNED={"HX-06-07":["af_xlsx_sahara_buitre","af_fenec","asia_esp_0206","af_xlsx_jerbo","af_xlsx_addax","af_gacela_dorcas","af_xlsx_geco_desierto","af_xlsx_vibora_cornuda"],"HX-06-09":["af_ibis_eremita","af_xlsx_131_aquila_fasciata","af_xlsx_131_circaetus_gallicus","af_xlsx_131_neophron_percnopterus","af_chacal_dorado","zorro_rojo","af_xlsx_131_atelerix_algirus","eu_esp_0219","jabali","af_macaco_berberia","af_xlsx_gacela_cuvier","eu_esp_0505"],"HX-06-11":["af_garza_goliat","af_xlsx_garceta","af_pelicano_blanco","af_ibis_sagrado","af_abejaruco_carmin","af_xlsx_131_neophron_percnopterus","af_xlsx_131_pandion_haliaetus","af_xlsx_martin_pio","af_hipopotamo","af_xlsx_tilapia","af_xlsx_varano_nilo","af_cocodrilo_nilo","af_xlsx_131_sclerophrys_regularis"],"HX-08-08":["af_xlsx_131_ceratogymna_atrata","af_xlsx_131_musophaga_violacea","af_xlsx_131_ploceus_cucullatus","af_turaco","af_xlsx_gato_dorado","af_leopardo","af_xlsx_131_chlorocebus_sabaeus","af_xlsx_hipopotamo_pigmeo","af_civeta","af_mandril","af_xlsx_131_phataginus_tricuspis","af_xlsx_131_cercopithecus_diana","af_xlsx_131_colobus_polykomos","af_chimpance","af_xlsx_131_cephalophus_zebra","af_elefante_bosque","af_xlsx_131_pantodon_buchholzi","af_xlsx_131_agama_agama","af_xlsx_rana_goliat","af_xlsx_piton_bola","af_piton_africana"],"HX-07-08":["af_avestruz","af_xlsx_131_gyps_africanus","af_zorro_palido","af_caracal","af_xlsx_131_chlorocebus_sabaeus","af_galago","asia_esp_0246","af_xlsx_131_lepus_capensis","af_gacela_dorcas","af_xlsx_131_hippotragus_equinus","af_facoquero","af_xlsx_131_agama_agama","af_xlsx_131_bitis_arietans","af_xlsx_piton_bola"],"HX-07-12":["af_xlsx_avestruz_somali","af_caracal","af_hiena_manchada","af_babuino_hamadryas","af_xlsx_131_equus_africanus","af_xlsx_gacela_speke","af_xlsx_jirafa_reticulada","af_gerenuc","af_xlsx_131_madoqua_saltiana","af_xlsx_orix_beisa"],"HX-07-11":["af_abejaruco_carmin","af_avestruz","af_xlsx_sahara_buitre","af_licaon","af_guepardo","af_hiena_manchada","af_xlsx_alcefalo","af_xlsx_gacela_frente_roja","af_gacela_dorcas","af_xlsx_orix_cimitarra","af_facoquero"],"HX-08-11":["af_xlsx_131_corythaeola_cristata","af_xlsx_gato_dorado","af_leopardo","af_civeta","af_mandril","af_xlsx_cocodrilo_enano","af_pangolin_gigante","af_mono_brazza","af_gorila_occidental","af_xlsx_bonobo","af_chimpance","af_elefante_bosque","af_okapi","af_duiker_azul","af_antilope_bongo","af_xlsx_pez_tigre_goliat","af_xlsx_131_pantodon_buchholzi","af_piton_africana"],"HX-07-10":["af_flamenco_enano","af_calao_terrestre","af_xlsx_131_coracias_caudatus","af_secretario","af_avestruz","af_xlsx_131_polemaetus_bellicosus","af_xlsx_131_lupulella_mesomelas","af_guepardo","af_serval","af_leon","af_leopardo","af_hiena_manchada","af_galago","af_mangosta_enana","af_xlsx_131_mungos_mungo","af_xlsx_cerdo_hormiguero","af_babuino_oliva","af_xlsx_alcefalo","af_nu_azul","af_xlsx_topi","af_cebra_llanura","af_xlsx_gacela_thomson","af_jirafa","af_hipopotamo","af_elefante_sabana","af_facoquero","af_bufalo_cafre","af_eland","af_xlsx_131_bitis_arietans","af_xlsx_mamba_negra"],"HX-07-13":["aguila_real","af_quebrantahuesos","af_lobo_etiope","af_xlsx_rata_topo","af_gelada","af_xlsx_131_lepus_fagani","af_ibice_walia","af_nyala_montana"],"HX-10-10":["af_avestruz","af_xlsx_131_otocyon_megalotis","af_leon","af_xlsx_131_geosciurus_inauris","af_xlsx_131_hystrix_africaeaustralis","af_xlsx_131_mellivora_capensis","af_hiena_parda","af_pangolin_temminck","af_suricata","af_orix"],"HX-11-10":["af_calao_terrestre","af_xlsx_131_coracias_caudatus","af_secretario","af_xlsx_131_polemaetus_bellicosus","af_xlsx_131_lupulella_mesomelas","af_licaon","af_leon","af_leopardo","af_rinoceronte_blanco","af_hiena_manchada","af_xlsx_131_geosciurus_inauris","af_xlsx_131_hystrix_africaeaustralis","af_xlsx_131_mungos_mungo","af_xlsx_cerdo_hormiguero","af_suricata","af_impala","af_xlsx_rinoceronte_negro","af_cebra_llanura","af_jirafa","af_antilope_sable","af_elefante_sabana","af_bufalo_cafre","af_eland","af_gran_kudu","af_xlsx_131_breviceps_macrops","af_xlsx_131_schismaderma_carens","af_xlsx_lemur_etc","af_xlsx_131_bitis_arietans","af_xlsx_mamba_negra","af_xlsx_131_naja_mossambica"],"HX-09-11":["af_garza_goliat","af_picozapato","af_grulla_coronada","af_pelicano_blanco","af_flamenco_enano","af_xlsx_131_ploceus_cucullatus","af_serval","af_xlsx_131_hydrictis_maculicollis","af_babuino_oliva","af_gorila_montana","af_chimpance","af_hipopotamo","af_xlsx_131_hippotragus_equinus","af_antilope_sable","af_elefante_sabana","af_bufalo_cafre","af_xlsx_131_hydrocynus_vittatus","af_xlsx_tilapia","af_xlsx_131_trioceros_jacksonii","af_cocodrilo_nilo"],"HX-09-14":["af_xlsx_vanga_azul","af_fosa","af_xlsx_lemur_raton","af_tenrec","af_xlsx_ayeaye","af_indri","af_lemur_colaanillada","af_sifaka","af_xlsx_lemur_rufo","af_xlsx_camaleon_parson","af_camaleon_pantera","af_xlsx_131_phelsuma_grandis","af_xlsx_gecko_hoja","af_xlsx_boa_madagascar","af_tortuga_radiada"]};
for(const region of REGIONS.filter(r=>r.continent==='África')){
 const incoming=AFRICA_V3131_ASSIGNED[region.id]||[];
 for(const id of incoming){
  if(!SPECIES[id]||region.species.includes(id))continue;
  region.species.push(id);
  const profile=SPECIES[id];
  if(!profile.habitats.some(h=>region.habitats.includes(h)))
   profile.habitats=[...new Set([...profile.habitats,region.habitats[0]])];
 }
}
// Garantizar observabilidad de perfiles preexistentes que comparten taxón entre continentes.
// Colores de caparazón diferenciados: especies terrestres europeas.
if(SPECIES['eu_esp_0505'])SPECIES['eu_esp_0505'].color='#997950';
if(SPECIES['eu_esp_0506'])SPECIES['eu_esp_0506'].color='#a4a16f';
// v2.2: preservar ecología de fauna asiática y evitar animales inaccesibles por bioma.
const ASIA_V22_ECO={"asia_esp_0402":{"habitats":["bosque","montana","pradera","tundra","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0086":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0344":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0209":{"habitats":["costa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano"]},"asia_esp_0203":{"habitats":["pradera","montana","tundra","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0234":{"habitats":["pradera","montana","tundra","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0177":{"habitats":["costa","rio"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0369":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0371":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0881":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0194":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0073":{"habitats":["desierto","estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0431":{"habitats":["desierto","estepa","pradera","montana"],"times":["dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0863":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0294":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0864":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0503":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0865":{"habitats":["bosque","montana","pradera","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0820":{"habitats":["bosque","montana","pradera","tundra","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0403":{"habitats":["bosque","montana","pradera","tundra","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0007":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0855":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0850":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0844":{"habitats":["bosque","montana","pradera","estepa","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0523":{"habitats":["bosque","montana","pradera","tundra","estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0062":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0821":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0240":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0445":{"habitats":["montana","pradera","bosque","tundra","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]}};
Object.entries(ASIA_V22_ECO).forEach(([id,eco])=>{
 const sp=SPECIES[id]; if(!sp)return;
 sp.habitats=eco.habitats.slice();sp.times=eco.times.slice();sp.seasons=eco.seasons.slice();
});
REGIONS.filter(r=>r.continent==='Asia').forEach(r=>{
 // Los nuevos hexágonos nunca superan cuatro biomas.
 r.habitats=(REGION_BIOMES[r.id]||r.habitats).slice(0,4);
 for(const id of r.species){
   const sp=SPECIES[id];if(!sp)continue;
   if(!sp.habitats.some(h=>r.habitats.includes(h))){
     // Una especie compartida sigue observándose en al menos un bioma de su nuevo hexágono.
     const preferred=r.habitats.includes('montana') && /águila|aguila|oso|lince|cabra|buitre|leopardo/i.test(sp.name)?'montana':r.habitats[0];
     sp.habitats=[...new Set([...sp.habitats,preferred])];
   }
 }
});

Object.assign(SPECIES["asia_esp_0287"],{"habitats": ["rio", "pradera"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0880"],{"habitats": ["bosque", "pradera"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0861"],{"habitats": ["bosque"], "times": ["amanecer", "dia"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0886"],{"habitats": ["bosque", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0326"],{"habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0843"],{"habitats": ["bosque"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0914"],{"habitats": ["rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0899"],{"habitats": ["bosque", "tundra", "rio"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0020"],{"habitats": ["estepa", "pradera", "rio"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0030"],{"habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0887"],{"habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0533"],{"habitats": ["estepa", "pradera"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0387"],{"habitats": ["estepa", "montana"], "times": ["amanecer", "atardecer", "noche"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0323"],{"habitats": ["estepa", "pradera", "montana"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0184"],{"habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0441"],{"habitats": ["estepa", "pradera"], "times": ["amanecer", "dia", "atardecer"], "seasons": ["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0898"],{"habitats": ["estepa", "pradera", "rio"], "times": ["dia", "atardecer"], "seasons": ["primavera", "verano", "otono"]});
// Fauna nueva: patrones ecológicos concretos, independientes de las especies europeas.
Object.assign(SPECIES["asia_esp_0401"],{habitats:["bosque", "montana", "pradera"],times:["amanecer", "atardecer", "noche"],seasons:["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0081"],{habitats:["montana", "pradera"],times:["amanecer", "dia", "atardecer"],seasons:["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0149"],{habitats:["bosque", "pradera"],times:["amanecer", "atardecer", "noche"],seasons:["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0903"],{habitats:["pradera", "montana", "estepa"],times:["dia", "atardecer"],seasons:["primavera", "verano", "otono"]});
Object.assign(SPECIES["asia_esp_0088"],{habitats:["pradera", "estepa", "montana"],times:["amanecer", "atardecer", "noche"],seasons:["primavera", "verano", "otono", "invierno"]});
Object.assign(SPECIES["asia_esp_0080"],{habitats:["montana", "pradera", "estepa"],times:["amanecer", "dia", "atardecer"],seasons:["primavera", "verano", "otono", "invierno"]});


// v2.3: hábitats de las 103 especies nuevas, conservando faunas comunes.
const ASIA_V23_ECO={"asia_esp_0538":{"habitats":["desierto"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0206":{"habitats":["montana"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0214":{"habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0383":{"habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0519":{"habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0102":{"habitats":["desierto","estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0205":{"habitats":["humedal"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0300":{"habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0065":{"habitats":["humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0910":{"habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0327":{"habitats":["humedal","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0873":{"habitats":["estepa","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0246":{"habitats":["estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0182":{"habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0218":{"habitats":["estepa","desierto"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0227":{"habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0534":{"habitats":["montana"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0321":{"habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0183":{"habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0404":{"habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0442":{"habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0347":{"habitats":["estepa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0319":{"habitats":["estepa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0468":{"habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0891":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0890":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0226":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0878":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0422":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0842":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0824":{"habitats":["estepa","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0915":{"habitats":["rio","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0911":{"habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0888":{"habitats":["rio","humedal"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0868":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0872":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0410":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0874":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0816":{"habitats":["bosque","selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0176":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0852":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0336":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0860":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0853":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0476":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0833":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0050":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0061":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0063":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0830":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0465":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0825":{"habitats":["pradera","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0900":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0136":{"habitats":["rio","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0906":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0905":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0351":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0124":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0296":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0096":{"habitats":["bosque","selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0355":{"habitats":["bosque","selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0006":{"habitats":["bosque","selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0318":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0854":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0395":{"habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0856":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0310":{"habitats":["bosque","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0345":{"habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0902":{"habitats":["montana","selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0016":{"habitats":["rio"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono"]},"asia_esp_0433":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0440":{"habitats":["bosque","montana"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0333":{"habitats":["bosque"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0111":{"habitats":["pradera","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0249":{"habitats":["pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0067":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0867":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0869":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0883":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0849":{"habitats":["selva"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0858":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0238":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0857":{"habitats":["selva","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0317":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0859":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0251":{"habitats":["selva","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0352":{"habitats":["selva","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0436":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0491":{"habitats":["selva","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0165":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0834":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0498":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0901":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0527":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0316":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0373":{"habitats":["selva"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono"]},"asia_esp_0877":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0494":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0363":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0414":{"habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0308":{"habitats":["bosque","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0087":{"habitats":["montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"]},"asia_esp_0017":{"habitats":["costa","rio"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono"]}};
Object.entries(ASIA_V23_ECO).forEach(([id,eco])=>{if(SPECIES[id])Object.assign(SPECIES[id],eco);});
// Corrección biogeográfica: Felis margarita (gato de las arenas) es desértico, también en Sáhara.
if(SPECIES.asia_esp_0206)SPECIES.asia_esp_0206.habitats=['desierto','estepa'];

// Fauna norteamericana específica; las especies cosmopolitas reutilizan IDs globales.
Object.assign(SPECIES,{"na_esp_anser_caerulescens":{"name":"Ánsar nival","latin":"Anser caerulescens","rare":"Raro","kind":"swan","color":"#98907c","habitats":["tundra","rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_corvus_corax":{"name":"Cuervo común","latin":"Corvus corax","rare":"Poco común","kind":"songbird","color":"#98907c","habitats":["bosque","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_bubo_scandiacus":{"name":"Búho nival","latin":"Bubo scandiacus","rare":"Poco común","kind":"owl","color":"#98907c","habitats":["tundra","pradera"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_falco_peregrinus":{"name":"Halcón peregrino","latin":"Falco peregrinus","rare":"Raro","kind":"raptor","color":"#98907c","habitats":["montana","costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_dicrostonyx_groenlandicus":{"name":"Lemming de collar ártico","latin":"Dicrostonyx groenlandicus","rare":"Común","kind":"small","color":"#98907c","habitats":["tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_lemmus_trimucronatus":{"name":"Lemming pardo","latin":"Lemmus trimucronatus","rare":"Poco común","kind":"small","color":"#98907c","habitats":["tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_ursus_americanus":{"name":"Oso negro americano","latin":"Ursus americanus","rare":"Común","kind":"bear","color":"#98907c","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_castor_canadensis":{"name":"Castor canadiense","latin":"Castor canadensis","rare":"Común","kind":"beaver","color":"#98907c","habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_ovibos_moschatus":{"name":"Buey almizclero","latin":"Ovibos moschatus","rare":"Poco común","kind":"bison","color":"#98907c","habitats":["tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_ovis_dalli":{"name":"Borrego de Dall","latin":"Ovis dalli","rare":"Poco común","kind":"deer","color":"#98907c","habitats":["montana","tundra"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_dryocopus_pileatus":{"name":"Píleo","latin":"Dryocopus pileatus","rare":"Común","kind":"forestbird","color":"#98907c","habitats":["bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_haliaeetus_leucocephalus":{"name":"Águila calva","latin":"Haliaeetus leucocephalus","rare":"Común","kind":"raptor","color":"#98907c","habitats":["rio","costa","bosque"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_puma_concolor":{"name":"Puma","latin":"Puma concolor","rare":"Común","kind":"cat","color":"#98907c","habitats":["bosque","montana"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_lontra_canadensis":{"name":"Nutria de río norteamericana","latin":"Lontra canadensis","rare":"Muy rara","kind":"otter","color":"#98907c","habitats":["rio","costa"],"times":["amanecer","atardecer","noche"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_marmota_vancouverensis":{"name":"Marmota de Vancouver","latin":"Marmota vancouverensis","rare":"Común","kind":"small","color":"#98907c","habitats":["montana","pradera"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_odocoileus_hemionus":{"name":"Ciervo mulo","latin":"Odocoileus hemionus","rare":"Común","kind":"deer","color":"#98907c","habitats":["bosque","montana"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"na_esp_oncorhynchus_mykiss":{"name":"Trucha arcoíris","latin":"Oncorhynchus mykiss","rare":"Poco común","kind":"fish","color":"#98907c","habitats":["rio"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
// Fauna costera del Cabo y Namib: endémicos regionales en lugar de igualar zonas artificialmente.
Object.assign(SPECIES,{"af_alcatraz_cabo":{"name":"Alcatraz del Cabo","latin":"Morus capensis","rare":"Poco común","kind":"seabird","color":"#e4e0d2","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_cormoran_cabo":{"name":"Cormorán del Cabo","latin":"Phalacrocorax capensis","rare":"Común","kind":"seabird","color":"#393f43","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false},"af_ostrero_africano":{"name":"Ostrero africano","latin":"Haematopus moquini","rare":"Raro","kind":"wader","color":"#38342f","habitats":["costa"],"times":["amanecer","dia","atardecer"],"seasons":["primavera","verano","otono","invierno"],"special":["Leucístico","Notable"],"dimorphism":false}});
for(const r of REGIONS.filter(x=>['HX-11-11','HX-11-08'].includes(x.id))){
 const speciesIds=r.id==='HX-11-11'?['af_alcatraz_cabo','af_cormoran_cabo','af_ostrero_africano']:['af_cormoran_cabo','af_ostrero_africano'];
 for(const id of speciesIds)if(!r.species.includes(id))r.species.push(id);
}
// Ajuste ecológico de África: ampliar únicamente zonas poco pobladas con especies compartidas plausibles.
// Nunca recortar las regiones naturalmente ricas ni introducir animales por una cuota fija.
const AFRICA_ECO_REBALANCE={"HX-11-11":["af_pinguino_africano","af_lobo_marino_cabo","af_tiburon_blanco"],"HX-10-09":["af_jacana_africana","af_abejaruco_carmin","af_sitatunga","af_lechwe_rojo","af_hipopotamo","af_cocodrilo_nilo","af_pelicano_blanco","af_garza_goliat"],"HX-08-10":["af_okapi","af_civeta","af_xlsx_131_ceratogymna_atrata","af_xlsx_131_corythaeola_cristata","af_xlsx_131_pantodon_buchholzi","af_xlsx_131_colobus_polykomos","af_gorila_occidental","af_loro_gris"],"HX-11-08":["af_zorro_cabo","af_hiena_parda","af_camaleon_namaqua","af_geco_patas_palmeadas","af_suricata","af_orix","af_springbok","af_caracal","af_avestruz","af_xlsx_131_otocyon_megalotis"],"HX-09-09":["af_antilope_sable","af_calao_terrestre","af_pangolin_temminck","af_inseparable_lilian","af_elefante_sabana","af_licaon","af_leopardo","af_babuino_oliva","af_guepardo","af_facoquero","af_xlsx_131_mellivora_capensis","af_xlsx_131_mungos_mungo"],"HX-10-12":["af_dugongo","af_manta_gigante","af_delfin_jorobado_indico","af_martin_malaquita","af_tiburon_blanco","af_cocodrilo_nilo","af_hipopotamo","af_garza_goliat","af_aguila_pescadora","af_xlsx_131_pandion_haliaetus"],"HX-08-12":["af_flamenco_enano","af_pelicano_blanco","af_jirafa_rothschild","af_gran_kudu","af_hipopotamo","af_leon","af_bufalo_cafre","af_aguila_pescadora","af_guepardo","af_jacana_africana","af_cocodrilo_nilo","af_grulla_coronada"],"HX-09-12":["af_picozapato","af_lechwe_negro","af_grulla_carunculada","af_puku","af_sitatunga","af_hipopotamo","af_jacana_africana","af_pelicano_blanco","af_grulla_coronada","af_aguila_pescadora","af_cocodrilo_nilo","af_bufalo_cafre"],"HX-06-08":["af_macaco_berberia","af_gato_montes_africano","af_ciervo_berberia","af_zorro_ruppell","af_arrui","af_fenec","af_chacal_dorado","af_gacela_dorcas","af_cobra_egipcia","af_xlsx_gacela_cuvier","eu_esp_0505"]};
for(const [rid,ids] of Object.entries(AFRICA_ECO_REBALANCE)){
 const region=REGIONS.find(r=>r.id===rid);
 if(!region)continue;
 for(const id of ids){
  const species=SPECIES[id];
  if(!species||region.species.includes(id))continue;
  // Las especies que aparecen en varios biomas solo se añaden si son observables en este hexágono.
  if(!species.habitats.some(h=>region.habitats.includes(h)))continue;
  region.species.push(id);
 }
}

// Beta 3.15.3: un único taxón Gypaetus barbatus en las regiones europeas, asiáticas y africanas.
// El ID europeo original se conserva para que los registros y las monografías previas sigan siendo válidos.
for(const region of REGIONS){
 region.species=[...new Set(region.species.map(id=>id==='af_quebrantahuesos'?'quebrantahuesos':id))];
}
delete SPECIES.af_quebrantahuesos;
// Beta 3.15.4: fauna compartida, registros huérfanos y clasificación corregida.
const V3154_SPECIES_ALIASES={asia_esp_0088:'af_caracal',asia_esp_0538:'af_zorro_ruppell'};
for(const region of REGIONS){
 region.species=[...new Set(region.species.map(id=>V3154_SPECIES_ALIASES[id]||id))];
}
for(const alias of Object.keys(V3154_SPECIES_ALIASES))delete SPECIES[alias];
// África posee Canis lupaster, distinto de Canis aureus euroasiático.
Object.assign(SPECIES.af_chacal_dorado,{name:'Lobo dorado africano',latin:'Canis lupaster'});
// El leopardo persa y el africano conservan sus fichas como subespecies.
SPECIES.asia_esp_0401.latin='Panthera pardus tulliana';
SPECIES.af_leopardo.latin='Panthera pardus pardus';
SPECIES.eu_esp_0267.name='Lagópodo común'; // Lagopus lagopus; no confundir con Lagopus muta.
SPECIES.asia_esp_0067.kind='forestbird'; // Cálao rinoceronte es un ave.
SPECIES.eu_esp_0623.habitats=['rio','bosque'];
SPECIES.eu_esp_0623.times=['amanecer','atardecer','noche'];
for(const id of ['asia_esp_0898','eu_esp_0660','eu_esp_0659','af_xlsx_rana_goliat',
 'af_xlsx_lemur_etc','af_xlsx_131_sclerophrys_regularis',
 'af_xlsx_131_breviceps_macrops','af_xlsx_131_schismaderma_carens']){
 if(SPECIES[id])SPECIES[id].kind='amphibian';
}
const V3154_REGION_SPECIES={
 'HX-02-12':['meloncillo','ciguena_blanca','martin_pescador'],
 'HX-02-11':['ciguena_blanca'],
 'HX-01-09':['martin_pescador'],
 'HX-03-09':['chacal_dorado']
};
for(const [rid,ids] of Object.entries(V3154_REGION_SPECIES)){
 const region=REGIONS.find(r=>r.id===rid);
 if(!region)throw Error('Región inexistente: '+rid);
 for(const id of ids){
  if(!SPECIES[id])throw Error('Especie inexistente: '+id);
  if(!region.species.includes(id))region.species.push(id);
  if(!SPECIES[id].habitats.some(h=>region.habitats.includes(h)))
   SPECIES[id].habitats=[...new Set([...SPECIES[id].habitats,region.habitats[0]])];
 }
}
const V3154_NA_COLORS={
 na_esp_anser_caerulescens:'#e0e5e5',na_esp_corvus_corax:'#30383c',
 na_esp_bubo_scandiacus:'#e8e8db',na_esp_falco_peregrinus:'#6f7882',
 na_esp_dicrostonyx_groenlandicus:'#b8a88b',na_esp_lemmus_trimucronatus:'#9d8065',
 na_esp_ursus_americanus:'#37332f',na_esp_castor_canadensis:'#80583e',
 na_esp_ovibos_moschatus:'#4f4237',na_esp_ovis_dalli:'#e4d6bb',
 na_esp_dryocopus_pileatus:'#292e31',na_esp_haliaeetus_leucocephalus:'#654f3c',
 na_esp_puma_concolor:'#b79069',na_esp_lontra_canadensis:'#715942',
 na_esp_marmota_vancouverensis:'#8f7659',na_esp_odocoileus_hemionus:'#a68061',
 na_esp_oncorhynchus_mykiss:'#728d89'
};
for(const [id,color] of Object.entries(V3154_NA_COLORS))if(SPECIES[id])SPECIES[id].color=color;

// Una antigua especie se había marcado como mustélido: clasificarla correctamente como anfibio.
if(SPECIES.salamandra_alpina)SPECIES.salamandra_alpina.kind='salamander';

// Reconcile eligibility only after all catalog extensions; never touches observations.
Object.entries(SPECIES).forEach(([id,sp])=>{sp.dimorphism=!!SEXUAL_DIMORPHISM[id];});

// v3.19.6: nomenclatura del juego; no implica equivalencia biológica.
function specialVariantName(value){
 const key=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(/^(albino|albina|leucistico|leucistica)$/.test(key))return 'Albino';
 if(/^melanic[oa]$/.test(key))return 'Melánico';
 if(key==='notable')return 'Notable';
 return value;
}
// Presentation eligibility is deliberately independent of base rarity and catalog records.
const SPECIMEN_LEVELS={Notable:{skin:'alfa',color:'#b57949',rate:.01},'Épico':{skin:'epico',color:'#aab9c7',rate:.002},Excepcional:{skin:'excepcional',color:'#d1ad45',rate:.0004},Legendario:{skin:'legendario',color:'#8cafa2',rate:.0001}};
const LEGENDARY_SPECIMENS=[
 ['silverback','af_gorila_montana','Silverback','Un adulto de espalda plateada, mirada serena y cresta pronunciada.'],
 ['ambar','asia_esp_0402','Ámbar','Rayas anchas y un pelaje invernal denso en una pausa vigilante.'],
 ['niebla','asia_esp_0403','Niebla','Rosetas abiertas y una larga cola que acompaña el borde de la roca.'],
 ['fenrir','lobo_gris','Fenrir','Un lobo de manto gris, pecho claro y perfil atento.'],
 ['atlas','af_elefante_sabana','Atlas','Orejas desplegadas y colmillos asimétricos de crecimiento natural.'],
 ['centinela','aguila_real','Centinela','La nuca dorada destaca sobre las alas recogidas de este vigilante.'],
 ['basalto','asia_esp_0527','Basalto','Escamas oscuras y patas robustas sostienen una silueta rasante.'],
 ['seda','asia_esp_0373','Seda','Una cobra de capucha estrecha se eleva entre sus propios anillos.'],
 ['junco','af_cocodrilo_nilo','Junco','Escudos dorsales irregulares y un hocico surcado por viejas cicatrices.'],
 ['ancora','af_tortuga_aldabra','Áncora','Caparazón de anillos marcados y cuello extendido sobre patas columnares.'],
 ['ascua','zorro_rojo','Ascua','Un zorro de pecho marfil se sienta envuelto en su cola rojiza.'],
 ['remonte','asia_esp_0369','Remonte','Un salmón de dorso moteado y mandíbula curva en plena remontada.']
].map(([id,speciesId,name,description])=>({id,speciesId,name,description}));
const SPECIMEN_SELECTION={
 epico:['zorro_rojo','lobo_gris','aguila_real','reno','buho_real','jabali','af_gran_kudu','af_pangolin_gigante','af_gorila_montana','af_elefante_sabana','af_cocodrilo_nilo','af_tortuga_aldabra','asia_esp_0402','asia_esp_0403','asia_esp_0527','asia_esp_0373','asia_esp_0369','af_hipopotamo','af_jirafa','af_leon','af_suricata','af_secretario','af_picozapato','af_piton_africana'],
 excepcional:['zorro_rojo','lobo_gris','aguila_real','af_gran_kudu','af_pangolin_gigante','af_gorila_montana','af_elefante_sabana','af_cocodrilo_nilo','af_tortuga_aldabra','asia_esp_0402','asia_esp_0403','asia_esp_0527','asia_esp_0373','asia_esp_0369']
};
function canonicalTaxon(id){return (SPECIES[id]?.latin||'').toLowerCase().trim().split(/\s+/).slice(0,2).join(' ');}
function legendaryForSpecies(id){return LEGENDARY_SPECIMENS.find(l=>SPECIES[l.speciesId]&&canonicalTaxon(id)&&canonicalTaxon(l.speciesId)===canonicalTaxon(id));}
const SPECIMEN_CATEGORIES=Object.fromEntries(Object.keys(SPECIES).map(id=>{
 const categories=[];
 if(SPECIES[id].special.some(v=>specialVariantName(v)==='Notable'))categories.push('Notable');
 if(SPECIMEN_SELECTION.epico.includes(id)||legendaryForSpecies(id))categories.push('Épico');
 if(SPECIMEN_SELECTION.excepcional.includes(id)||legendaryForSpecies(id))categories.push('Excepcional');
 if(legendaryForSpecies(id))categories.push('Legendario');
 return [id,categories];
}));
function configuredSpecials(sp){
 const id=Object.keys(SPECIES).find(id=>SPECIES[id]===sp);
 return [...new Set([...(sp.special||[]).map(specialVariantName),...(SPECIMEN_CATEGORIES[id]||[])])];
}
// Keep the v3.19.6 array intact: its length defines each pigmentation probability.
Object.values(SPECIES).forEach(sp=>{sp.special=[...new Set((sp.special||[]).map(specialVariantName))];});
function specimenRates(id,ethology=0){
 const multiplier=ethology>=2?1.5:1;
 return Object.fromEntries((SPECIMEN_CATEGORIES[id]||[]).map(c=>[c,SPECIMEN_LEVELS[c].rate*multiplier]));
}
function rollSpecimen(id,snapshot,rng=Math.random){
 const sp=SPECIES[id],oldRate=.01+(snapshot.upgrades?.ethology>=2?.005:0);
 // An independent interval per historical pigment keeps exactly oldRate / old array length.
 let pigment='',cursor=0,draw=rng();
 for(const label of sp.special){if(label!=='Albino'&&label!=='Melánico')continue;
  cursor+=oldRate/sp.special.length;if(draw<cursor){pigment=label;break;}}
 let category='';cursor=0;draw=rng();
 for(const [label,rate] of Object.entries(specimenRates(id,snapshot.upgrades?.ethology))){
  const legendary=label==='Legendario'?legendaryForSpecies(id):null;
  if(legendary&&snapshot.legendaryFound?.[legendary.id])continue;
  cursor+=rate;if(draw<cursor){category=label;break;}
 }
 return {pigment,category};
}
function recordSpecimen(id,result,snapshot){
 const labels=[result.pigment,result.category].filter(label=>label&&(label!=='Legendario'||!snapshot.legendaryFound?.[legendaryForSpecies(id)?.id]));if(!labels.length)return;
 snapshot.specialSeen=snapshot.specialSeen||{};snapshot.specialSeen[id]=(snapshot.specialSeen[id]||0)+1;
 snapshot.specialFound=snapshot.specialFound||{};snapshot.specialFound[id]=snapshot.specialFound[id]||{};
 snapshot.specialCounts=snapshot.specialCounts||{};snapshot.specialCounts[id]=snapshot.specialCounts[id]||{};
 for(const label of labels){
  if(label==='Legendario'){
   const l=legendaryForSpecies(id);snapshot.legendaryFound=snapshot.legendaryFound||{};
   if(l&&!snapshot.legendaryFound[l.id])snapshot.legendaryFound[l.id]={id:l.id,speciesId:l.speciesId};
  }else{snapshot.specialFound[id][label]=true;snapshot.specialCounts[id][label]=(snapshot.specialCounts[id][label]||0)+1;}
 }
}
function specimenMarkup(id,variant='',category='',sex=null){
 if(category==='Legendario'||variant==='Legendario')return getSpriteMarkup(id,'legendario');
 const svg=getSpriteMarkup(id,variantToSkin(variant),!variant?sex:null);
 return category&&SPECIMEN_LEVELS[category]&&variantToSkin(variant)!==SPECIMEN_LEVELS[category].skin?decorateSpecimen(svg,category):svg;
}
function decorateSpecimen(svg,category){
 const level=SPECIMEN_LEVELS[category];if(!level)return svg;
 return svg.replace('>',` data-specimen-category="${category}">`+specimenHalo(category));
}
function specimenHalo(category){
 const color=SPECIMEN_LEVELS[category]?.color;if(!color)return '';
 return `<g data-specimen-halo="${category}" fill="none" stroke="${color}" stroke-width="1.5"><circle cx="50" cy="50" r="46" opacity=".6"/>${category==='Notable'?'':`<path d="M78 17l-2-7 5 3 3-5 3 5 5-3-2 7z" fill="${color}" stroke-width=".7"/>`}</g>`;
}

function normalizeSpecialDiscoveries(snapshot){
 if(!snapshot||typeof snapshot!=='object')return snapshot;
 snapshot.collectionId=snapshot.collectionId||('atlas-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
 snapshot.legendaryFound={...(snapshot.legendaryFound||{})};
 snapshot.specialCounts=Object.fromEntries(Object.entries(snapshot.specialCounts||{}).map(([id,counts])=>[id,{...counts}]));
 // Copy nested records: importing must not mutate the supplied backup or rollback state.
 if(snapshot.specialFound&&typeof snapshot.specialFound==='object'){
  const records={};
  for(const [id,found] of Object.entries(snapshot.specialFound)){
   if(!found||typeof found!=='object'||Array.isArray(found)){records[id]=found;continue;}
   const unified={};
   for(const [label,seen] of Object.entries(found)){
    const name=specialVariantName(label);
    unified[name]=Object.prototype.hasOwnProperty.call(unified,name)?!!unified[name]||!!seen:seen;
   }
   records[id]=unified;
  }
  snapshot.specialFound=records;
 }
 // Historical diary text and last encounter must not expose a second category.
 const text=value=>typeof value==='string'?value.replace(/leucístic[oa]/gi,'Albino'):value;
 if(Array.isArray(snapshot.log))snapshot.log=snapshot.log.map(text);
 if(snapshot.lastEncounter&&typeof snapshot.lastEncounter==='object'){
  const encounter={...snapshot.lastEncounter};
  encounter.title=text(encounter.title);encounter.subtitle=text(encounter.subtitle);
  if(encounter.variant)encounter.variant=specialVariantName(encounter.variant);
  if(Array.isArray(encounter.entries))encounter.entries=encounter.entries.map(entry=>({...entry,
   ...(entry.variant?{variant:specialVariantName(entry.variant)}:{}),
   ...(Array.isArray(entry.note)?{note:entry.note.map(text)}:{})}));
  snapshot.lastEncounter=encounter;
 }
 return snapshot;
}


function sexSpriteMarkup(id,sex){
  const spec=SEXUAL_DIMORPHISM[id];
  if(!spec) return null;
  const bird3193=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_BIRD_ART_V3193==='function') ? globalThis.ATLAS_BIRD_ART_V3193(SPECIES[id],SPECIES[id].color,'normal',sex) : null;
  if(bird3193)return bird3193;
  const mammal3194=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_MAMMAL_ART_V3194==='function') ? globalThis.ATLAS_MAMMAL_ART_V3194(SPECIES[id],SPECIES[id].color,'normal',sex,id) : null;
  if(mammal3194)return mammal3194;
  const male=sex==='male';
  const color=SPECIES[id].color;
  const dark=shade(color,-25);
  const line='#362f28';
  const legs='<path d="M36 71v14m18-14v14" stroke="#45352a" stroke-width="3.5" stroke-linecap="round"/>';
  if(['antlers','reindeer','ibex'].includes(spec.type)){
    const body=male?color:shade(color,18);
    let horns='';
    if(spec.type==='antlers' && male){
      horns=`<path d="M60 34L54 15m6 19l-11-7m11 7l-2-12m14 12l7-19m-7 19l10-7m-10 7l2-12" stroke="#715940" stroke-width="3.1" fill="none" stroke-linecap="round"/>`;
    }
    if(spec.type==='reindeer'){
      horns=male?'<path d="M60 34L53 13m7 21l-12-7m12 7l-4-14m16 14l8-22m-8 22l12-8m-12 8l3-15" stroke="#70543b" stroke-width="3.4" fill="none" stroke-linecap="round"/>':'<path d="M60 36l-3-11m3 11l-6-5m16 4l4-10m-4 10l6-4" stroke="#866649" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    }
    if(spec.type==='ibex'){
      horns=male?'<path d="M60 35Q49 22 58 8m12 27Q83 23 75 8" stroke="#78583c" stroke-width="4.5" fill="none" stroke-linecap="round"/>':'<path d="M60 35Q56 29 58 21m12 14q5-5 4-13" stroke="#7c5c40" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    }
    // Preserve the configured sexes while distinguishing moose palms and roe tines.
    if(spec.type==='antlers' && male && id==='alce')horns='<path d="M60 34L49 23L43 12L42 25L34 18L39 31L54 38M72 34L82 23L87 12L88 25L95 18L91 32L76 38" fill="#a48c69" stroke="#715940" stroke-width="2.5" stroke-linejoin="round"/>';
    if(spec.type==='antlers' && male && id==='corzo_europeo')horns='<path d="M60 34L57 19m2 9-6-4m4-3 4-5m11 18 4-15m-2 10 6-5m-4-3-3-5" fill="none" stroke="#715940" stroke-width="2.8" stroke-linecap="round"/>';
    const ears='<path d="M58 40l-10-8 2 11m22-3 10-8-2 12" fill="'+body+'" stroke="'+line+'" stroke-width="2.2"/>';
    const chest=male?'#e0cba8':'#e8dac6';
    return svgWrap(`<ellipse cx="43" cy="61" rx="${male?24:22}" ry="${male?17:14}" fill="${body}" stroke="${line}" stroke-width="3"/><ellipse cx="40" cy="57" rx="11" ry="5" fill="${shade(body,12)}"/><circle cx="66" cy="46" r="11" fill="${body}" stroke="${line}" stroke-width="3"/><ellipse cx="73" cy="53" rx="7" ry="4" fill="${chest}"/>${ears}${horns}<circle cx="69" cy="43" r="1.8" fill="#251c18"/>${legs}<path d="M21 58l-5-8" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>`);
  }
  // Distinctive bird silhouettes and plumage, with the same proportions as the other mini-sprites.
  const bird=(opts={})=>{
    const body=opts.body||color, wing=opts.wing||dark, head=opts.head||body;
    const chest=opts.chest||'#e0c7a1',tail=opts.tail||wing, beak=opts.beak||'#c28c43';
    const marks=opts.marks||'', crest=opts.crest||'';
    return svgWrap(`<path d="M32 59L15 44 22 73 37 68" fill="${tail}" stroke="${line}" stroke-width="2.5"/><ellipse cx="47" cy="60" rx="21" ry="15" fill="${body}" stroke="${line}" stroke-width="3"/><path d="M33 56q14-8 23 6q-14 13-24 3z" fill="${wing}" stroke="${line}" stroke-width="2.2"/><ellipse cx="56" cy="65" rx="8" ry="7" fill="${chest}"/><circle cx="65" cy="46" r="10" fill="${head}" stroke="${line}" stroke-width="3"/>${crest}<path d="M73 49l13-3-11 9z" fill="${beak}" stroke="${line}" stroke-width="2"/><circle cx="68" cy="44" r="1.9" fill="#201c1a"/>${marks}<path d="M42 73l-4 13m13-13l4 13" stroke="#795b38" stroke-width="3" stroke-linecap="round"/>`);
  };
  if(spec.type==='peafowl'){
    if(male)return svgWrap(`<path d="M44 64Q7 22 24 11L42 31L52 9L62 31L80 13Q94 35 59 64Z" fill="#4f947f" stroke="${line}" stroke-width="3"/><circle cx="27" cy="31" r="5" fill="#d3b863"/><circle cx="50" cy="24" r="5" fill="#d3b863"/><circle cx="73" cy="31" r="5" fill="#d3b863"/><ellipse cx="51" cy="66" rx="12" ry="17" fill="#3578a4" stroke="${line}" stroke-width="3"/><circle cx="53" cy="41" r="10" fill="#3b76a2" stroke="${line}" stroke-width="2.6"/><circle cx="57" cy="38" r="2" fill="#f6e2b3"/><path d="M63 43l11-2-10 7Z" fill="#b78b47"/>${legs}`);
    return bird({body:'#897961',head:'#8f826b',wing:'#6c6457',tail:'#786d5d',chest:'#d9c7a7',marks:'<path d="M32 60l11 5m5-10 9 8m-18 10 11 0" stroke="#c5ae88" stroke-width="2.4"/>'});
  }
  if(spec.type==='mandarinduck'){
    return male?bird({body:'#be814a',head:'#4f866f',wing:'#a9543d',tail:'#d4a05a',chest:'#f0d6aa',crest:'<path d="M62 35l-7-10 16 8" fill="#c66d44"/>',marks:'<path d="M35 60q8-12 16-5" stroke="#e6c175" stroke-width="5"/>'}):bird({body:'#9d917d',head:'#92836f',wing:'#756c60',tail:'#7d7367',chest:'#d1c5b0',marks:'<path d="M37 58l6 5m6-8 6 7" stroke="#bcb09a" stroke-width="2.4"/>'});
  }
  if(spec.type==='pheasant'){
    return male?bird({body:color,head:shade(color,-18),wing:shade(color,-28),chest:'#c6a16e',tail:'#735845',crest:'<path d="M63 36l-7-13 14 8" fill="#b05d3b"/>',marks:'<circle cx="40" cy="60" r="3" fill="#dfbf8b"/><circle cx="50" cy="64" r="2.5" fill="#dfbf8b"/>'}):bird({body:'#a18e72',head:'#947e65',wing:'#776953',chest:'#c6b79c',tail:'#84705d',marks:'<path d="M34 59l9 5m5-9 8 8" stroke="#d3c3a7" stroke-width="2.4"/>'});
  }
  if(spec.type==='capercaillie'){
    if(male)return svgWrap(`<path d="M29 58Q13 39 18 26Q36 26 40 48L38 67Z" fill="#35393c" stroke="${line}" stroke-width="3"/><path d="M20 39l-7-9m14 9l-1-15m10 19l7-15" stroke="#46494a" stroke-width="4" stroke-linecap="round"/><ellipse cx="47" cy="61" rx="23" ry="18" fill="#353d42" stroke="${line}" stroke-width="3"/><ellipse cx="49" cy="65" rx="11" ry="9" fill="#4b5e4d"/><circle cx="66" cy="46" r="11" fill="#333b40" stroke="${line}" stroke-width="3"/><circle cx="69" cy="45" r="1.8" fill="#f4e9cf"/><circle cx="73" cy="44" r="3" fill="#cb3e37"/><path d="M74 49l10 2-10 5z" fill="#dfb65e" stroke="${line}" stroke-width="2"/><path d="M42 78l-3 8m12-8l4 8" stroke="#73583c" stroke-width="3" stroke-linecap="round"/>`);
    return bird({body:'#a98a6c',head:'#96745d',wing:'#775846',chest:'#d8c5a4',tail:'#9b785c',marks:'<path d="M33 57l11 6m-5-11l8 8m1 9l11-4" stroke="#dbbf9a" stroke-width="2"/>'});
  }
  if(spec.type==='shoveler'){
    const body=male?'#d7c09a':'#a78c6e';
    const head=male?'#36785d':'#9c7d5b';
    return svgWrap(`<ellipse cx="46" cy="61" rx="25" ry="16" fill="${body}" stroke="${line}" stroke-width="3"/><path d="M29 58q13-5 24 7q-10 10-25 0z" fill="${male?'#aa8659':'#81664d'}"/><circle cx="67" cy="46" r="11" fill="${head}" stroke="${line}" stroke-width="3"/><path d="M75 49q17-4 19 3q-2 8-20 5" fill="${male?'#c7a95c':'#bda985'}" stroke="${line}" stroke-width="2.8"/><circle cx="70" cy="44" r="1.7" fill="#1f2019"/><path d="M26 59l-8-9m22 25l-3 11m17-11l2 11" stroke="#79563a" stroke-width="3" stroke-linecap="round"/>${male?'':'<path d="M32 61l8 5m2-13l10 8" stroke="#d6bd99" stroke-width="2.4"/>'}`);
  }
  if(spec.type==='finch')return male?bird({body:'#b98278',head:'#69768d',chest:'#c66c65',wing:'#3d506a',tail:'#343e4b'}):bird({body:'#9f9480',head:'#a99e8a',chest:'#d3b9a1',wing:'#7c7e6e',tail:'#696c60'});
  if(spec.type==='blackbird')return male?bird({body:'#292b31',head:'#25272b',chest:'#34363c',wing:'#22252a',beak:'#ebbd4d'}):bird({body:'#6b5647',head:'#785f4e',chest:'#aa8e71',wing:'#554638',beak:'#b48e57',marks:'<path d="M52 64l-3 3m9-5l-3 4" stroke="#735944" stroke-width="2"/>'});
  if(spec.type==='bullfinch')return male?bird({body:'#65666b',head:'#25272b',chest:'#cd6a70',wing:'#313339',tail:'#22262a'}):bird({body:'#827b74',head:'#55544f',chest:'#a79a86',wing:'#686663',tail:'#4c4c49'});
  if(spec.type==='oriole')return male?bird({body:'#e0ba43',head:'#e4c14a',chest:'#e9cd59',wing:'#2c3234',tail:'#303536',beak:'#b17142'}):bird({body:'#96a36f',head:'#879967',chest:'#d2d5a6',wing:'#687b61',tail:'#5b7054',beak:'#a8794a'});
  return null;
}

const spriteCache=new Map();
function getSpriteMarkup(id, skin='normal', sex=null){
  const category=Object.keys(SPECIMEN_LEVELS).find(c=>SPECIMEN_LEVELS[c].skin===skin);
  if(category){
   const l=legendaryForSpecies(id);
   const base=category==='Legendario'&&l&&globalThis.ATLAS_LEGENDARY_ART?globalThis.ATLAS_LEGENDARY_ART.render(l.id):getSpriteMarkup(id,'normal');
   return decorateSpecimen(base,category);
  }
  const validSex=(skin==='normal' && SEXUAL_DIMORPHISM[id] && (sex==='male'||sex==='female'))?sex:null;
  const key=id+':'+skin+':'+(validSex||'base');
  if(spriteCache.has(key))return spriteCache.get(key);
  const sp=SPECIES[id];
  // Pigment variants always start from the unmodified production illustration.
  // Specialized engines receive normal exactly once; anatomy and markings are shared.
  const pigment=skin==='albino'||skin==='melanico';
  const baseSvg=pigment?getSpriteMarkup(id,'normal'):
    (validSex?sexSpriteMarkup(id,validSex):null)||spriteFor(sp.kind,sp.color,skin,id);
  const svg=skin==='melanico'?enforceMelanicColors(baseSvg):
    skin==='albino'?enforcePaleColors(baseSvg):baseSvg;
  spriteCache.set(key,svg);
  return svg;
}
function applySkin(base, skin){
  if(skin==='albino') return '#f2f3f4';
  if(skin==='melanico') return '#0c0f12';
  return base;
}
// Single lightweight paint pass: continuous values preserve shadows and patterns.
function enforcePaleColors(svg){return transformPigmentation(svg,'albino');}
function enforceMelanicColors(svg){return transformPigmentation(svg,'melanico');}
function transformPigmentation(svg,skin){
 if(/data-pigmentation=/.test(svg))return svg;
 const pale=skin==='albino';
 const morph=(svg.match(/data-mammal-morph="([^"]+)"/)||[])[1]||'';
 const hex=rgb=>'#'+rgb.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('');
 const rgb=value=>{
  let h=value.trim().toLowerCase();
  if(/^#[0-9a-f]{3}$/.test(h))h='#'+[...h.slice(1)].map(c=>c+c).join('');
  if(/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/.test(h))return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
  const hsl=h.match(/^hsla?\(\s*([-\d.]+)(?:deg)?[ ,]+([\d.]+)%[ ,]+([\d.]+)%(?:\s*[,/]\s*([\d.]+))?\s*\)$/);
  if(hsl){
   const hue=((Number(hsl[1])%360)+360)%360/30,saturation=Number(hsl[2])/100,light=Number(hsl[3])/100;
   const amplitude=saturation*Math.min(light,1-light);
   return [0,8,4].map(offset=>{const k=(offset+hue)%12;return 255*(light-amplitude*Math.max(-1,Math.min(k-3,9-k,1)));});
  }
  const named={white:'#ffffff',black:'#000000',red:'#ff0000',orange:'#ffa500',gray:'#808080',grey:'#808080'};
  if(named[h])return rgb(named[h]);
  const m=h.match(/^rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:\s*[,/]\s*([\d.]+))?\s*\)$/);
  if(m)return m.slice(1,4).map(Number);
  return null;
 };
 const paint=(value,stroke,eye,highlight,coatPattern=false)=>{
  if(/^(none|transparent|inherit|currentColor)$|^url\(/i.test(value.trim()))return value;
  if(eye)return pale?'#ad858d':'#c3ac71';
  if(highlight)return pale?'#faf4eb':'#8d969c';
  const channels=rgb(value);if(!channels)return value;
  const lum=(channels[0]*.2126+channels[1]*.7152+channels[2]*.0722)/255;
  // Keratin retains a separate warm value: horns and antlers cannot merge into fur.
  if(/^#a39881$/i.test(value))return pale?'#b0a38d':'#817967';
  if(pale&&/^#(?:bc9d87|b07861|d7b389|c85f6c)$/i.test(value))return '#d7b9b8';
  // Felid coat marks use pigment values, independently from the outer contour.
  // Rosettes remain ghost patterns; tiger stripes remain stripes on the same paths.
  if(coatPattern)return pale?hex([207+lum*39,202+lum*39,199+lum*39]):hex([19+lum*43,25+lum*43,33+lum*43]);
  const out=stroke?(pale?hex([131+lum*30,125+lum*30,127+lum*30]):hex([65+lum*22,75+lum*22,84+lum*22])):
   pale?hex([207+lum*39,202+lum*39,199+lum*39]):hex([23+lum*57,29+lum*57,37+lum*57]);
  // Preserve alpha in literal rgba paints; SVG opacity attributes are never touched.
  if(/^#[0-9a-f]{8}$/i.test(value))return out+value.slice(7);
  const alpha=value.match(/^(?:rgba|hsla)\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\s*\)$/i);
  return alpha?'rgba('+rgb(out).join(',')+','+alpha[1]+')':out;
 };
 const output=svg.replace(/<[a-z][^>]*>/gi,tag=>{
  // Normal eye inks are deliberately distinct from species pattern paints.
  const small=/^<circle\b/i.test(tag)&&/\br=["'](?:[0-2](?:\.\d+)?|3(?:\.0+)?)["']/.test(tag);
  const eye=small&&/\bfill=["']#(?:302e26|23352d|202d29|18272d|1d1a17|c85f6c|d8c46b|e2cb78)["']/i.test(tag);
  const highlight=small&&/\br=["']0?\.[0-9]+["']/.test(tag);
  const coatPattern=(/leopard|snowcat/.test(morph)&&/stroke-width="1\.[67]"/.test(tag))||(morph==='tiger'&&/stroke="#39382f"/.test(tag)&&/stroke-width="3\.2"/.test(tag));
  return tag.replace(/\b(fill|stroke|stop-color|color)\s*=\s*(["'])(.*?)\2/gi,
   (_,attr,quote,value)=>attr+'='+quote+paint(value,attr.toLowerCase()==='stroke',eye&&attr==='fill',highlight&&attr==='fill',coatPattern&&attr==='stroke')+quote)
   .replace(/\bstyle\s*=\s*(["'])(.*?)\1/gi,(_,quote,style)=>'style='+quote+
    style.replace(/(^|;)\s*(fill|stroke|stop-color|color)\s*:\s*([^;]+)/gi,
     (_,sep,attr,value)=>sep+attr+':'+paint(value,attr.toLowerCase()==='stroke',false,false))+quote);
 });
 return output.replace(/<svg\b[^>]*>/,tag=>tag.slice(0,-1)+' data-pigmentation="'+skin+'">');
}
function shade(hex, amt){
  const h=hex.replace('#','');
  const r=parseInt(h.substring(0,2),16), g=parseInt(h.substring(2,4),16), b=parseInt(h.substring(4,6),16);
  const clamp=x=>Math.max(0,Math.min(255,x));
  return '#'+[clamp(r+amt),clamp(g+amt),clamp(b+amt)].map(v=>v.toString(16).padStart(2,'0')).join('');
}
function svgWrap(content, glow=''){ return `<svg viewBox="0 0 100 100" aria-hidden="true">${glow}${content}</svg>`; }
function alphaGlow(skin){return '';} // Category presentation is composed outside the zoological SVG.
function eyeColor(skin){ if(skin==='albino') return '#c85f6c'; if(skin==='melanico') return '#d8c46b'; return '#1d1a17'; }
function legSet(x1,x2,y=71){ return `<line x1="${x1}" y1="${y}" x2="${x1-1}" y2="86" stroke="#3a3026" stroke-width="3.3" stroke-linecap="round"/><line x1="${x2}" y1="${y}" x2="${x2+1}" y2="86" stroke="#3a3026" stroke-width="3.3" stroke-linecap="round"/>`; }
function premiumSpeciesSprite(name,kind,body,skin,id){
 const n=name.toLocaleLowerCase('es');
 const ink='#342f29';
 const dark=shade(body,-24);
 const light=shade(body,19);
 const eye=eyeColor(skin);
 const isMel=skin==='melanico';
 const belly=isMel?'#626a73':'#e7dcc5';
 const outline=(shape)=>svgWrap(shape,alphaGlow(skin));
 const legs=(a=43,b=52)=>`<path d="M${a} 73l-2 12 M${b} 73l2 12" fill="none" stroke="#765b3b" stroke-width="3" stroke-linecap="round"/>`;
 const featherTail=`<path d="M35 63L16 77L29 55Z" fill="${dark}" stroke="${ink}" stroke-width="2.5"/>`;
 const eyeDot=(x=67,y=46)=>`<circle cx="${x}" cy="${y}" r="1.9" fill="${eye}"/>`;
 const bird=(opts={})=>{
   const wing=opts.wing||dark;
   const chest=opts.chest||belly;
   const cap=opts.cap||body;
   const beak=opts.beak||'#c38b42';
   const crest=opts.crest||'';
   const dots=opts.dots||'';
   return outline(`${featherTail}<ellipse cx="47" cy="60" rx="19" ry="14" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M34 55Q45 50 52 61Q45 69 34 66Z" fill="${wing}" stroke="${ink}" stroke-width="2"/><ellipse cx="53" cy="63" rx="9" ry="8" fill="${chest}"/><circle cx="65" cy="47" r="10" fill="${cap}" stroke="${ink}" stroke-width="3"/>${crest}<path d="M73 49l12-3-10 8z" fill="${beak}" stroke="${ink}" stroke-width="2"/>${eyeDot()}${dots}${legs()}`);
 };

 if(/cálao rinoceronte|calao rinoceronte/i.test(n)) return outline(`<path d="M25 63L12 78L26 58Z" fill="#18191b" stroke="${ink}" stroke-width="2.6"/><path d="M31 59Q43 50 54 60Q45 69 31 66Z" fill="#0f1112" stroke="${ink}" stroke-width="2"/><ellipse cx="48" cy="61" rx="20" ry="14" fill="#121416" stroke="${ink}" stroke-width="3"/><ellipse cx="54" cy="64" rx="8" ry="7" fill="#eef0e8"/><circle cx="66" cy="46" r="10" fill="#111315" stroke="${ink}" stroke-width="3"/><path d="M61 37Q72 22 80 34Q73 43 62 41Z" fill="#e0d2a1" stroke="${ink}" stroke-width="2.4"/><path d="M73 45Q98 39 95 55Q84 64 72 52Z" fill="#e2b553" stroke="${ink}" stroke-width="2.6"/><path d="M74 45Q84 32 90 38Q87 43 79 45Z" fill="#c94f35" stroke="${ink}" stroke-width="2.2"/><circle cx="68" cy="44" r="1.9" fill="${eye}"/><path d="M43 73l-3 13m12-13l4 13" stroke="#755b38" stroke-width="3" stroke-linecap="round"/>`);
 if(/desmán ibérico|desman iberico/i.test(n)) return outline(`<path d="M19 66Q28 52 45 53Q62 55 69 62Q72 74 57 78Q38 83 24 76Q18 72 19 66Z" fill="${body}" stroke="${ink}" stroke-width="3"/><ellipse cx="64" cy="59" rx="12" ry="9" fill="${light}" stroke="${ink}" stroke-width="3"/><path d="M74 59Q89 57 94 63Q86 68 73 66Z" fill="#d7b389" stroke="${ink}" stroke-width="2.3"/><circle cx="65" cy="55" r="1.7" fill="${eye}"/><path d="M23 67Q9 63 8 48" fill="none" stroke="${dark}" stroke-width="4.5" stroke-linecap="round"/><path d="M33 76l-6 10m15-10l-3 10m14-10l3 10" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><path d="M72 61l10 4m-11 1 9 7" stroke="#a98256" stroke-width="1.8" stroke-linecap="round"/>`);
 if(/frailecillo atlántico|frailecillo atlantico/i.test(n)) return outline(`<path d="M33 61L14 46 22 75 37 69Z" fill="#232528" stroke="${ink}" stroke-width="2.6"/><ellipse cx="48" cy="61" rx="18" ry="15" fill="#25282b" stroke="${ink}" stroke-width="3"/><path d="M34 56q13-8 22 7q-14 13-24 2z" fill="#111214" stroke="${ink}" stroke-width="2.1"/><ellipse cx="54" cy="65" rx="8" ry="8" fill="#f5f2ea"/><circle cx="66" cy="47" r="10" fill="#111214" stroke="${ink}" stroke-width="3"/><ellipse cx="67" cy="48" rx="6.5" ry="8" fill="#f7f4ef"/><path d="M74 50Q89 44 91 50Q83 58 73 59Z" fill="#e08f32" stroke="${ink}" stroke-width="2.3"/><path d="M74 50Q82 48 86 53" fill="none" stroke="#ecd772" stroke-width="2.1"/><path d="M61 40l3-7 4 7m3 0l3-5 2 5" stroke="#e5ce71" stroke-width="1.9" stroke-linecap="round"/><circle cx="69" cy="45" r="1.6" fill="${eye}"/><path d="M43 75l-4 12m13-12l4 12" stroke="#8a6438" stroke-width="3" stroke-linecap="round"/>`);
 if(/erizo/i.test(n)) return outline(`<path d="M20 68Q26 48 44 47Q63 46 73 58Q81 70 70 78Q58 85 37 82Q23 79 20 68Z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M23 60l4-12 6 12 5-14 7 14 7-14 6 12 5-10 3 12" fill="none" stroke="${dark}" stroke-width="4.2" stroke-linecap="round"/><ellipse cx="66" cy="62" rx="9" ry="8" fill="${belly}" stroke="${ink}" stroke-width="2.5"/><circle cx="68" cy="58" r="1.6" fill="${eye}"/><path d="M72 63q10 2 12 8q-9 1-12-1" fill="${belly}" stroke="${ink}" stroke-width="2"/>`);

 // Rock-solid distinctions for Europe’s small songbirds and corvids.
 if(/herrerillo/i.test(n)) return bird({wing:'#37639b',cap:'#2c6cae',chest:'#efd05e',crest:'<path d="M60 43Q66 39 73 43" fill="none" stroke="#e6eff2" stroke-width="3"/>'});
 if(/carbonero/i.test(n)) return bird({wing:'#415d4c',cap:'#262b2f',chest:'#e5c64e',dots:'<path d="M52 61v10" stroke="#303237" stroke-width="3"/>'});
 if(/pinzón|pinzon/i.test(n)) return bird({wing:'#424f6b',cap:'#667388',chest:'#c97564',dots:'<path d="M35 60l12 4" stroke="#e8ddc6" stroke-width="2.5"/>'});
 if(/alondra/i.test(n)) return bird({wing:'#7f684d',chest:'#d4bb8c',cap:'#9c815b',crest:`<path d="M62 36l-4-8 9 6" fill="${body}" stroke="${ink}" stroke-width="2"/>`,dots:'<path d="M52 63l-4-3m8 9l-3-3" stroke="#7f654b" stroke-width="2"/>'});
 if(/mirlo/i.test(n)) return bird({wing:'#222930',cap:'#272b2f',chest:'#323438',beak:'#e7b04a'});
 if(/zorzal/i.test(n)) return bird({wing:'#826a55',cap:'#856f57',chest:'#dfc8a8',dots:'<path d="M50 63l-2 4m8-4l-2 4m1 3l-1 2" stroke="#72513a" stroke-width="2.4"/>'});
 if(/camachuelo/i.test(n)) return bird({wing:'#343b40',cap:'#252a2c',chest:'#c77779',beak:'#26282a'});
 if(/oropéndola|oropendola/i.test(n)) return bird({wing:'#2b343a',cap:'#d8ba43',chest:'#ebcf58',beak:'#a35e40'});
 if(/ampelis/i.test(n)) return bird({wing:'#7f665b',cap:'#a97c69',chest:'#ba9680',crest:`<path d="M60 40l-2-13 11 9" fill="${body}" stroke="${ink}" stroke-width="2"/>`,dots:'<path d="M30 57l11 7" stroke="#e6c75a" stroke-width="3"/>'});
 if(/arrendajo/i.test(n)) return bird({wing:'#337fab',cap:'#ba8061',chest:'#cfb29a',dots:'<path d="M33 58l10 3m-8 4l9 1" stroke="#e5eced" stroke-width="2.3"/>'});
 if(/rabilargo/i.test(n)) return bird({wing:'#4d8baa',cap:'#252c37',chest:'#e1d7ca',beak:'#2e3030',dots:'<path d="M30 64L10 85" stroke="#4b7e9e" stroke-width="4"/>'});
 if(/pico picapinos/i.test(n)) return bird({wing:'#24282e',cap:'#a54640',chest:'#e9e4d9',beak:'#555b5c',dots:'<path d="M33 59l12 3m-10 4l10-1" stroke="#e9e5dc" stroke-width="3"/>'});
 if(/pato cuchara/i.test(n)) return outline(`<path d="M20 67q0-18 25-21q20-1 23 16q-9 16-29 15q-19-1-19-10z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M25 53l-8-10 15 5" fill="${dark}" stroke="${ink}" stroke-width="2.5"/><circle cx="68" cy="49" r="10" fill="#4b805c" stroke="${ink}" stroke-width="3"/><path d="M76 49q14-3 16 3q-2 7-18 4" fill="#b59b69" stroke="${ink}" stroke-width="2.8"/>${eyeDot(70,46)}<path d="M37 56q10 3 14 13" stroke="#ded5be" stroke-width="3" fill="none"/>${legs(42,53)}`);
 if(/cormorán|cormoran/i.test(n)) return outline(`<ellipse cx="43" cy="65" rx="21" ry="13" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M54 61Q61 46 63 28" fill="none" stroke="${body}" stroke-width="10" stroke-linecap="round"/><path d="M54 61Q61 46 63 28" fill="none" stroke="${ink}" stroke-width="2.5"/><circle cx="64" cy="26" r="7" fill="${body}" stroke="${ink}" stroke-width="2.5"/><path d="M70 27l18 3-18 3" fill="#ad9a74" stroke="${ink}" stroke-width="2"/>${eyeDot(65,24)}<path d="M27 63L13 52l11 20" fill="${dark}" stroke="${ink}" stroke-width="2"/>${legs(40,48)}`);
 if(/focha/i.test(n)) return outline(`<ellipse cx="46" cy="64" rx="23" ry="15" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="65" cy="49" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M69 40l5-10 5 4-4 15" fill="#e6e5dc" stroke="${ink}" stroke-width="2"/><path d="M75 48l14-1-14 7" fill="#e9e7df" stroke="${ink}" stroke-width="2"/>${eyeDot(66,46)}${legs()}`);
 if(/somormujo|zampullín|zampullin/i.test(n)) return outline(`<ellipse cx="46" cy="65" rx="22" ry="13" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M55 55Q59 40 63 32" fill="none" stroke="${body}" stroke-width="9"/><circle cx="64" cy="31" r="9" fill="${body}" stroke="${ink}" stroke-width="2.5"/><path d="M55 33l-5-11 12 7m7 0l8-10" fill="none" stroke="#ac8660" stroke-width="4" stroke-linecap="round"/><path d="M72 32l16-3-15 8" fill="#b68e58" stroke="${ink}" stroke-width="2"/>${eyeDot(65,29)}${legs(42,53)}`);
 if(/perdiz roja|perdiz griega/i.test(n)) return outline(`<ellipse cx="46" cy="65" rx="24" ry="17" fill="${body}" stroke="${ink}" stroke-width="3"/><ellipse cx="45" cy="70" rx="11" ry="8" fill="${belly}"/><path d="M26 61l-12-10 7 20" fill="${dark}" stroke="${ink}" stroke-width="2.5"/><circle cx="65" cy="51" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M56 47q12-10 18 3" fill="none" stroke="#7e3b39" stroke-width="3.5"/><path d="M72 54l15-1-13 5" fill="#b17a39" stroke="${ink}" stroke-width="2"/>${eyeDot(68,49)}${legs()}`);
 if(/lechuza/i.test(n)) return outline(`<ellipse cx="49" cy="58" rx="23" ry="28" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M49 44q-14-19-20-2q-5 16 20 29q24-13 21-29q-5-17-21 2z" fill="#e8deca" stroke="${ink}" stroke-width="2.5"/><circle cx="41" cy="49" r="3.5" fill="#3a302c"/><circle cx="57" cy="49" r="3.5" fill="#3a302c"/><polygon points="49,54 45,61 54,61" fill="#c99b50"/>${legs(43,54)}`);
 if(/mochuelo/i.test(n)) return outline(`<ellipse cx="49" cy="60" rx="23" ry="22" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="41" cy="54" r="7" fill="#dfcbb0"/><circle cx="57" cy="54" r="7" fill="#dfcbb0"/><circle cx="41" cy="54" r="2.6" fill="${eye}"/><circle cx="57" cy="54" r="2.6" fill="${eye}"/><polygon points="49,59 45,64 53,64" fill="#c89b52"/>${legs(44,55)}`);
 if(/gavilán|gavilan|halcón|halcon|cernícalo|cernicalo|busardo/i.test(n)) return outline(`<ellipse cx="50" cy="63" rx="20" ry="18" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M28 58Q19 44 16 33Q33 41 41 49" fill="${dark}" stroke="${ink}" stroke-width="3"/><path d="M60 52Q76 39 88 41Q81 56 64 62" fill="${light}" stroke="${ink}" stroke-width="3"/><circle cx="61" cy="48" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M66 55l13-8-14 3" fill="#d4a14d" stroke="${ink}" stroke-width="2"/><circle cx="63" cy="46" r="2.3" fill="${eye}"/><path d="M29 57l11 7m-9 0l9 6" stroke="#d0b48e" stroke-width="2.5" fill="none"/>${legs(45,53)}`);
 // Field rodents: different tail shape, ear size, dorsal tone and belly.
 if(/topillo/i.test(n)){
   const snowy=/nival/i.test(n);
   const russet=/rojo/i.test(n);
   const head=snowy?'#c9c6c3':russet?'#a45a3e':body;
   const chest=snowy?'#eeeae3':russet?'#dfb694':'#d8c7a6';
   const back=russet?'#874b38':snowy?'#aaa9aa':dark;
   return outline(`<path d="M28 67q-11 3-13 10" stroke="${back}" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="49" cy="65" rx="21" ry="15" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M34 57q13-10 27 1" fill="none" stroke="${back}" stroke-width="4"/><ellipse cx="49" cy="70" rx="11" ry="6" fill="${chest}"/><circle cx="66" cy="57" r="10.5" fill="${head}" stroke="${ink}" stroke-width="3"/><circle cx="60" cy="49" r="4" fill="${head}" stroke="${ink}" stroke-width="2.5"/><circle cx="69" cy="53" r="1.7" fill="${eye}"/><path d="M73 60l8 2" stroke="#5d4a3d" stroke-width="2"/>${legs(44,55)}`);
 }
 if(/lirón|liron/i.test(n)) return outline(`<path d="M27 59q-17-13-12-24q16-6 24 20" fill="${dark}" stroke="${ink}" stroke-width="4"/><ellipse cx="46" cy="65" rx="22" ry="15" fill="${body}" stroke="${ink}" stroke-width="3"/><ellipse cx="50" cy="69" rx="10" ry="7" fill="${belly}"/><circle cx="65" cy="54" r="12" fill="${body}" stroke="${ink}" stroke-width="3"/><ellipse cx="67" cy="52" rx="7" ry="4" fill="${dark}"/><circle cx="70" cy="52" r="2" fill="${eye}"/><circle cx="60" cy="46" r="4" fill="${light}" stroke="${ink}" stroke-width="2"/>${legs()}`);
 if(/musaraña|musarana|desmán|desman/i.test(n)) return outline(`<ellipse cx="45" cy="66" rx="21" ry="13" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="64" cy="58" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M70 59q12 3 18 9q-11 3-18-1" fill="${light}" stroke="${ink}" stroke-width="2"/><circle cx="64" cy="54" r="1.6" fill="${eye}"/><path d="M25 62q-12-8-12-20" fill="none" stroke="${dark}" stroke-width="3"/>${legs()}`);
 if(/lemming/i.test(n)) return outline(`<ellipse cx="48" cy="65" rx="24" ry="18" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M37 50q12-8 23 0" stroke="#8b6c4f" stroke-width="4" fill="none"/><ellipse cx="56" cy="72" rx="8" ry="5" fill="${belly}"/><circle cx="66" cy="56" r="10" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="69" cy="53" r="1.7" fill="${eye}"/>${legs()}`);
 if(/puercoespín|puercoespin/i.test(n)) return outline(`<path d="M18 70L15 52L21 56L22 42L29 49L35 32L42 46L51 33L57 48L65 41L74 57Q83 68 71 76Q56 84 34 78Z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M23 59l15-17m-9 25l14-20m-5 25l16-27m-7 29l16-24" stroke="#eee4cc" stroke-width="3" fill="none"/><circle cx="70" cy="63" r="8" fill="${body}" stroke="${ink}" stroke-width="2.5"/><circle cx="73" cy="60" r="1.7" fill="${eye}"/>${legs()}`);
 if(/marta|garduña|garduna|armiño|armino|comadreja|turón|turon|visón|vison/i.test(n)){
   const alb=/armiño|armino/.test(n), masked=/turón|turon|visón|vison/.test(n);
   return outline(`<path d="M13 69q7-8 19-6q14-12 32-8q17 2 20 11q-10 10-23 6q-19 6-38 2z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M28 67q-7 7-18 13" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/><ellipse cx="48" cy="70" rx="15" ry="5" fill="${alb?'#ece9df':belly}"/><circle cx="69" cy="56" r="11" fill="${body}" stroke="${ink}" stroke-width="3"/>${masked?'<path d="M61 57q8-8 16-1" fill="none" stroke="#393532" stroke-width="4"/>':''}<circle cx="73" cy="52" r="1.8" fill="${eye}"/><path d="M40 72l-3 10m19-10l3 10" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`);
 }
 if(/rana|sapo/i.test(n)) return outline(`<ellipse cx="48" cy="63" rx="22" ry="16" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="38" cy="50" r="6" fill="${light}" stroke="${ink}" stroke-width="2.5"/><circle cx="62" cy="50" r="6" fill="${light}" stroke="${ink}" stroke-width="2.5"/><circle cx="38" cy="50" r="2" fill="${eye}"/><circle cx="62" cy="50" r="2" fill="${eye}"/><path d="M32 73L19 83m29-2l-6 8m11-8l6 8m13-16l12 10" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`);
 if(/culebra|víbora|vibora|lución|lucion/i.test(n)){
   const collar=/collar/i.test(n); const viper=/viperina|vibora|víbora/i.test(n);
   const markings=collar ? '<path d="M72 47l-2 10" stroke="#dfc786" stroke-width="4" fill="none"/>'
      : viper ? '<path d="M24 64l8-5 8 6 8-7 8 6 7-8" stroke="#604f36" stroke-width="4" fill="none"/>'
      : '<path d="M24 65q12-5 20 0t18-2" stroke="#aa906a" stroke-width="2.5" fill="none"/>';
   return outline(`<path d="M12 73Q20 54 34 58Q45 62 52 55Q65 43 75 51Q86 61 76 73Q70 79 61 76Q55 73 51 75" fill="none" stroke="${ink}" stroke-width="15" stroke-linecap="round"/><path d="M12 73Q20 54 34 58Q45 62 52 55Q65 43 75 51Q86 61 76 73Q70 79 61 76Q55 73 51 75" fill="none" stroke="${body}" stroke-width="9" stroke-linecap="round"/>${markings}<ellipse cx="77" cy="51" rx="8" ry="6" fill="${body}" stroke="${ink}" stroke-width="2.5"/><circle cx="80" cy="49" r="1.9" fill="${eye}"/><path d="M84 53l8 2" stroke="#ae5f5e" stroke-width="2" stroke-linecap="round"/>`);
 }
 if(/trucha|barbo|tenca|perca/i.test(n)){
   const stripy=/perca/i.test(n), dotted=/trucha/i.test(n), whiskered=/barbo/i.test(n);
   const decor=stripy?'<path d="M36 49l-2 16m9-17l-2 18m9-18l-2 17" stroke="#655c3a" stroke-width="2.8" fill="none"/>'
      : dotted?'<circle cx="35" cy="52" r="2" fill="#8d423b"/><circle cx="45" cy="58" r="2" fill="#8d423b"/><circle cx="54" cy="50" r="2" fill="#8d423b"/>'
      :'<path d="M34 53q10-4 20 0" stroke="#d0b47d" stroke-width="2.5" fill="none"/>';
   return outline(`<path d="M24 56l-16-14v28z" fill="${dark}" stroke="${ink}" stroke-width="3"/><path d="M24 56Q32 42 53 43Q71 43 78 56Q67 72 50 70Q31 69 24 56Z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M41 45l8-10 5 10" fill="${dark}" stroke="${ink}" stroke-width="2.3"/>${decor}<circle cx="68" cy="54" r="2" fill="${eye}"/>${whiskered?'<path d="M76 61l9 5m-8-5l8 0" stroke="#7c6348" stroke-width="2" fill="none"/>':''}`);
 }
 if(/águila|aguila|buitre|quebrantahuesos/i.test(n)){
   const vulture=/buitre|quebrantahuesos/.test(n);
   return outline(`<path d="M26 58Q10 42 6 25Q31 34 44 47" fill="${dark}" stroke="${ink}" stroke-width="3"/><path d="M61 50Q80 30 96 24Q93 49 66 62" fill="${light}" stroke="${ink}" stroke-width="3"/><ellipse cx="48" cy="62" rx="21" ry="18" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M34 57q14 3 23 12" stroke="${dark}" stroke-width="4" fill="none"/><circle cx="61" cy="43" r="12" fill="${vulture?'#d5c4a3':body}" stroke="${ink}" stroke-width="3"/><path d="M70 46l17-3-14 12-6-4" fill="#c99a47" stroke="${ink}" stroke-width="2"/><circle cx="64" cy="40" r="2.4" fill="${eye}"/><path d="M39 76l-6 9m15-9l3 9" fill="none" stroke="#715632" stroke-width="3" stroke-linecap="round"/>`);
 }
 if(/tortuga/i.test(n)) return outline(`<path d="M28 62q2-23 23-23q20 0 23 23l-8 17H35z" fill="${body}" stroke="${ink}" stroke-width="3"/><path d="M35 59l15-11 16 11-8 14H41z" fill="${dark}" opacity=".48"/><path d="M42 72l-9 9m23-8l8 11" stroke="${ink}" stroke-width="3"/><circle cx="76" cy="58" r="9" fill="${body}" stroke="${ink}" stroke-width="3"/><circle cx="79" cy="55" r="1.8" fill="${eye}"/>`);
 return null;
}


// v2.0: siluetas por especie para la primera fauna asiática.
// SVG 100x100: compatibles con Cuaderno, Bestiario, Museo y variantes raras.
// Sprites asiáticos de v2.1: una silueta propia para cada especie incorporada.
// Todos comparten viewBox 100x100, dimensiones y soporte de variantes raras.
function asianExpansionSprite(id,skin){
 const sp=SPECIES[id];
 if(!sp||!id.startsWith('asia_esp_'))return null;
 const c=applySkin(sp.color,skin),d=shade(c,-22),l=shade(c,17);
 const mel=skin==='melanico',ink='#382f27',eye=eyeColor(skin),g=alphaGlow(skin);
 const belly=mel?'#444a52':'#f1e5d3';
 const wrap=shapes=>svgWrap(shapes,g);
 const legs=(a=42,b=54,y=73)=>`<path d="M${a} ${y}l-2 12m${b-a+2} -12l2 12" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
 const wing=(shape)=>`<path d="${shape}" fill="${d}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
 const head=(x=66,y=48,r=10)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="${x+3}" cy="${y-2}" r="1.8" fill="${eye}"/>`;
 const bill=(x=72,y=51)=>`<polygon points="${x},${y} ${x+14},${y-3} ${x+1},${y+6}" fill="#cd9948" stroke="${ink}" stroke-width="2"/>`;
 switch(id){
  case 'asia_esp_0287': // grulla siberiana, cuello y patas altos
   return wrap(`<ellipse cx="47" cy="59" rx="19" ry="13" fill="${mel?c:'#eceae4'}" stroke="${ink}" stroke-width="3"/>${wing('M33 54Q20 44 16 35Q29 37 44 49')}<path d="M57 54q-4-20 7-31" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>${head(66,25,6)}<path d="M64 21l10-2" stroke="#d96a54" stroke-width="4"/><polygon points="72,25 91,22 73,30" fill="#cc7954" stroke="${ink}" stroke-width="2"/><path d="M43 71l-4 18m13-18l3 18" stroke="#c68a5b" stroke-width="3" stroke-linecap="round"/>`);
  case 'asia_esp_0880': // gallo lira, cola en lira y pecho negro
   return wrap(`<path d="M23 60q-13-12-13-28m13 28Q37 42 36 32" fill="none" stroke="${d}" stroke-width="5" stroke-linecap="round"/><ellipse cx="47" cy="62" rx="21" ry="16" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(65,47,9)}${wing('M33 60q4-11 20-9q-3 17-20 14')}${bill(72,50)}<circle cx="65" cy="43" r="3" fill="#c63d4c"/>${legs()}`);
  case 'asia_esp_0861': // arrendajo siberiano, cola larga
   return wrap(`<path d="M33 62l-17 15 3-19" fill="${d}" stroke="${ink}" stroke-width="3"/><ellipse cx="48" cy="60" rx="18" ry="14" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M37 58q6-10 20-3l-11 15-9-6')}${head(63,47,9)}<path d="M57 40q8-5 14-1" stroke="#443729" stroke-width="3"/>${bill(69,50)}${legs(44,52,73)}`);
  case 'asia_esp_0886': // azor común, alas anchas pecho barrado
   return wrap(`<ellipse cx="47" cy="60" rx="18" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M31 58Q18 43 15 30Q32 37 43 48')}${wing('M57 52Q75 36 86 32Q84 49 66 62')}${head(59,43,10)}<path d="M43 58h15m-14 7h15m-13 6h10" stroke="${mel?'#444b53':'#cbb9a0'}" stroke-width="2.3"/>${bill(66,46)}${legs(43,54,76)}`);
  case 'asia_esp_0326': // marta cibelina, cuerpo largo y cola larga
   return wrap(`<path d="M27 67q-14-5-21 11" fill="none" stroke="${d}" stroke-width="6" stroke-linecap="round"/><ellipse cx="46" cy="63" rx="27" ry="12" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(72,53,9)}<ellipse cx="68" cy="60" rx="8" ry="4" fill="${belly}"/><circle cx="67" cy="45" r="3" fill="${d}" stroke="${ink}" stroke-width="2"/>${legs(39,55,71)}`);
  case 'asia_esp_0843': // ardilla voladora, membranas extendidas
   return wrap(`<path d="M17 51q16 3 29-13q11 18 37 9l-12 19q-14 14-26 12q-20 2-28-27z" fill="${l}" stroke="${ink}" stroke-width="3"/><ellipse cx="49" cy="58" rx="14" ry="20" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(58,40,10)}<circle cx="51" cy="32" r="4" fill="${d}"/><path d="M39 74q-17 7-24-4" fill="none" stroke="${d}" stroke-width="4"/>`);
  case 'asia_esp_0914': // esturión: hocico puntiagudo, escudos dorsales
   return wrap(`<path d="M17 57l-14-16 2 31 12-13q22-19 48-14l26 12-25 8q-25 14-49-8z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M33 44l4-6 4 5 5-7 4 7 5-6 4 8" fill="${d}" stroke="${ink}" stroke-width="2"/><path d="M68 60l-9 12m-11-5l-5 10" stroke="${ink}" stroke-width="3"/><circle cx="72" cy="54" r="2" fill="${eye}"/><path d="M74 65l-4 7m10-13l1 8" stroke="#d8b99b" stroke-width="2"/>`);
  case 'asia_esp_0899': // salamandra siberiana, patas cortas y manchas
   return wrap(`<path d="M15 65Q29 53 45 58Q58 54 69 53Q83 52 84 65Q81 78 62 75Q43 82 27 78Q13 76 15 65Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M23 59l11 8m9-12l10 8m10-9l8 9" stroke="${mel?'#48515b':'#b9a27a'}" stroke-width="3" stroke-linecap="round"/>${head(77,60,7)}<path d="M18 65Q8 61 6 53m25 17l-6 11m25-10l-3 11m16-18l-2-13" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`);
  case 'asia_esp_0020': // grulla damisela, cuello largo con penachos
   return wrap(`<ellipse cx="46" cy="59" rx="18" ry="13" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M33 55Q21 47 18 37Q32 42 43 51')}<path d="M58 55q-2-21 7-34" stroke="${ink}" stroke-width="4" fill="none"/>${head(66,24,7)}<path d="M57 22q-8 3-9 12m15-14q5-12 12-11" stroke="${belly}" stroke-width="3" fill="none"/>${bill(72,27)}<path d="M42 71v18m10-18v18" stroke="#9b735d" stroke-width="3"/>`);
  case 'asia_esp_0030': // águila esteparia, envergadura amplia
   return wrap(`<ellipse cx="48" cy="60" rx="19" ry="16" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M30 60Q12 47 10 28Q29 38 43 50')}${wing('M56 49Q72 34 88 29Q86 49 65 61')}${head(60,44,10)}${bill(67,48)}<path d="M45 66h12" stroke="${belly}" stroke-width="3"/>${legs(44,52,76)}`);
  case 'asia_esp_0887': // halcón sacre, alas largas puntiagudas
   return wrap(`<ellipse cx="48" cy="60" rx="17" ry="16" fill="${c}" stroke="${ink}" stroke-width="3"/>${wing('M31 58L12 26Q37 36 42 50')}${wing('M56 51L89 28Q80 51 65 60')}${head(61,44,9)}<path d="M57 49l4 7" stroke="${d}" stroke-width="3"/>${bill(68,47)}${legs(44,52,75)}`);
  case 'asia_esp_0533': // zorro corsac, orejas muy grandes
   return wrap(`<ellipse cx="45" cy="62" rx="22" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M22 61q-17 0-17 17q10 3 21-6" fill="${l}" stroke="${ink}" stroke-width="3"/>${head(66,47,11)}<polygon points="58,40 59,20 70,40" fill="${d}" stroke="${ink}" stroke-width="2.5"/><polygon points="67,39 84,23 78,44" fill="${d}" stroke="${ink}" stroke-width="2.5"/><path d="M67 51l13 7-14-1" fill="${belly}"/>${legs(39,53,72)}`);
  case 'asia_esp_0387': // manul: gato redondo, cara achatada, orejas bajas
   return wrap(`<ellipse cx="43" cy="66" rx="25" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="64" cy="47" r="17" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="51" cy="34" r="6" fill="${d}"/><circle cx="77" cy="33" r="6" fill="${d}"/><circle cx="58" cy="46" r="2.5" fill="${eye}"/><circle cx="70" cy="46" r="2.5" fill="${eye}"/><path d="M57 54q7 6 14 0m-7-2l1 4" stroke="${ink}" stroke-width="2" fill="none"/><path d="M37 81v7m16-6v7" stroke="${ink}" stroke-width="4"/><path d="M20 68q-10 1-13 11" stroke="${d}" stroke-width="6" fill="none"/>`);
  case 'asia_esp_0323': // marmota siberiana, bípeda compacta
   return wrap(`<ellipse cx="49" cy="66" rx="22" ry="19" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(61,44,13)}<ellipse cx="62" cy="55" rx="7" ry="6" fill="${belly}"/><path d="M35 77v9m17-7v8" stroke="${ink}" stroke-width="4"/><path d="M29 72q-12 3-15 12" fill="none" stroke="${d}" stroke-width="6" stroke-linecap="round"/>`);
  case 'asia_esp_0184': // caballo de Przewalski, melena corta erguida
   return wrap(`<ellipse cx="43" cy="60" rx="25" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M58 59L59 35l12-1 6 14-8 9" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M58 37l-6-5 8-4-4-6 9 3 2 8" fill="${d}" stroke="${ink}" stroke-width="2"/>${head(70,44,8)}<path d="M74 48l11 4-11 6" fill="${belly}"/><path d="M18 55q-10 0-11 11" fill="none" stroke="${d}" stroke-width="5"/>${legs(33,53,73)}`);
  case 'asia_esp_0441': // gacela mongola, cuerpo esbelto, cuernos curvos
   return wrap(`<ellipse cx="44" cy="63" rx="22" ry="12" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M60 63L60 41l11-3 6 11" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(71,42,8)}<path d="M66 37q-10-13 2-25m7 27q11-13 3-25" stroke="#80603f" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M43 69q7 4 15-1" stroke="${belly}" stroke-width="3" fill="none"/>${legs(33,52,72)}`);
  case 'asia_esp_0898': // sapo mongol, ojos prominentes
   return wrap(`<ellipse cx="50" cy="64" rx="26" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="39" cy="49" r="7" fill="${c}" stroke="${ink}" stroke-width="2.5"/><circle cx="61" cy="49" r="7" fill="${c}" stroke="${ink}" stroke-width="2.5"/><circle cx="39" cy="48" r="2" fill="${eye}"/><circle cx="61" cy="48" r="2" fill="${eye}"/><path d="M33 72l-11 10m20-4l-5 10m21-10l7 10m5-16l11 10" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/><circle cx="47" cy="60" r="2.5" fill="${l}"/><circle cx="58" cy="67" r="2.5" fill="${d}"/>`);
 }
 return null;
}

function asianSpeciesSprite(id,skin){
  const newSvg=asianExpansionSprite(id,skin); if(newSvg)return newSvg;
  const sp=SPECIES[id];
  if(!sp)return null;
  const c=applySkin(sp.color,skin), dark=shade(c,-22), light=shade(c,20);
  const edge='#352b23', eye=eyeColor(skin), glow=alphaGlow(skin);
  const tail=`<path d="M26 61q-13 3-14 15" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  if(id==='asia_esp_0401'){
    const rosettes=skin==='melanico'?'#333943':'#8a6039';
    return svgWrap(`<ellipse cx="46" cy="61" rx="25" ry="15" fill="${c}" stroke="${edge}" stroke-width="3"/><circle cx="67" cy="48" r="11" fill="${c}" stroke="${edge}" stroke-width="3"/><circle cx="59" cy="39" r="4" fill="${dark}" stroke="${edge}" stroke-width="2"/><circle cx="74" cy="39" r="4" fill="${dark}" stroke="${edge}" stroke-width="2"/><ellipse cx="70" cy="53" rx="6" ry="4.5" fill="${skin==='melanico'?'#3e4650':'#f0d8b5'}"/><circle cx="71" cy="46" r="1.8" fill="${eye}"/><path d="M21 59Q10 65 12 76" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/><path d="M16 71l5 5" stroke="${edge}" stroke-width="2"/><circle cx="31" cy="56" r="3.2" fill="none" stroke="${rosettes}" stroke-width="2.3"/><circle cx="43" cy="66" r="3.2" fill="none" stroke="${rosettes}" stroke-width="2.3"/><circle cx="52" cy="53" r="3.2" fill="none" stroke="${rosettes}" stroke-width="2.3"/><circle cx="60" cy="63" r="2.6" fill="none" stroke="${rosettes}" stroke-width="2"/><path d="M37 71l-1 13m18-13l2 13" stroke="${edge}" stroke-width="3.5" stroke-linecap="round"/>`,glow);
  }
  if(id==='asia_esp_0088'){
    return svgWrap(`<ellipse cx="45" cy="63" rx="22" ry="14" fill="${c}" stroke="${edge}" stroke-width="3"/><circle cx="66" cy="47" r="12" fill="${c}" stroke="${edge}" stroke-width="3"/><path d="M59 39l-3-17 8 9m9 8l8-17-2 18" fill="${dark}" stroke="${edge}" stroke-width="2.5"/><path d="M56 22l-3-8m28 8l4-8" stroke="#24201d" stroke-width="2.5" stroke-linecap="round"/><path d="M68 52q5 3 8 5q-5 3-11 0" fill="${skin==='melanico'?'#454d57':'#efcfaa'}"/><circle cx="70" cy="44" r="1.8" fill="${eye}"/>${tail}<path d="M36 72l-1 13m18-13l2 13" stroke="${edge}" stroke-width="3.4" stroke-linecap="round"/>`,glow);
  }
  if(id==='asia_esp_0081' || id==='asia_esp_0080'){
    const tur=id==='asia_esp_0081';
    const horns=tur?'<path d="M60 35Q45 24 55 11m17 25Q86 24 76 11" fill="none" stroke="#68543c" stroke-width="4.4" stroke-linecap="round"/>':'<path d="M59 34Q52 19 58 11m12 24Q80 19 74 12" fill="none" stroke="#594832" stroke-width="3.6" stroke-linecap="round"/>';
    return svgWrap(`<ellipse cx="43" cy="61" rx="23" ry="15" fill="${c}" stroke="${edge}" stroke-width="3"/><ellipse cx="40" cy="57" rx="10" ry="5" fill="${light}" opacity=".45"/><circle cx="65" cy="47" r="11" fill="${c}" stroke="${edge}" stroke-width="3"/>${horns}<path d="M69 49q8 2 9 8q-6 2-11-2" fill="${skin==='melanico'?'#414951':'#e4c69c'}"/><circle cx="68" cy="45" r="1.8" fill="${eye}"/>${tur?'<path d="M68 56q1 7 5 9" stroke="#4e3b2c" stroke-width="3" stroke-linecap="round"/>':'<path d="M69 56q2 7 6 9" stroke="#51402b" stroke-width="2.8" stroke-linecap="round"/>'}<path d="M36 72v14m18-14v14" stroke="${edge}" stroke-width="3.7" stroke-linecap="round"/><path d="M21 60l-8-5" stroke="${dark}" stroke-width="3" stroke-linecap="round"/>`,glow);
  }
  if(id==='asia_esp_0149'){
    const spots=skin==='melanico'?'#4b515b':'#f2d9ac';
    return svgWrap(`<ellipse cx="43" cy="61" rx="24" ry="15" fill="${c}" stroke="${edge}" stroke-width="3"/><circle cx="66" cy="47" r="11" fill="${c}" stroke="${edge}" stroke-width="3"/><path d="M59 31L56 15m3 16l-9-8m9 8l4-11m7 11l5-16m-5 16l9-8" stroke="#70553b" stroke-width="3" stroke-linecap="round"/><path d="M53 22q-11-7-11-1q9 7 12 7m21-7q10-6 10 0q-7 8-12 7" fill="#b89368" stroke="#70553b" stroke-width="2"/><circle cx="69" cy="44" r="1.7" fill="${eye}"/><circle cx="33" cy="56" r="2.1" fill="${spots}"/><circle cx="43" cy="61" r="2.1" fill="${spots}"/><circle cx="53" cy="56" r="2.1" fill="${spots}"/><path d="M36 72v14m18-14v14" stroke="${edge}" stroke-width="3.5" stroke-linecap="round"/>`,glow);
  }
  if(id==='asia_esp_0903'){
    return svgWrap(`<path d="M10 69Q22 54 41 60Q52 67 63 58Q74 48 84 56Q90 63 85 69Q80 75 69 70Q54 75 43 77Q24 82 13 74Z" fill="${c}" stroke="#353629" stroke-width="3"/><path d="M16 69Q10 63 8 58" fill="none" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><circle cx="83" cy="60" r="6.5" fill="${light}" stroke="#353629" stroke-width="2.5"/><circle cx="85" cy="58" r="1.5" fill="${eye}"/><path d="M29 69l9-3m2 8l11-3m5-9l9-2" stroke="${dark}" stroke-width="2.3" stroke-linecap="round"/><path d="M38 58q12-2 17 3" stroke="#efddb4" stroke-width="2" fill="none" opacity=".65"/>`,glow);
  }
  if(id==='eu_esp_0505'){
    return svgWrap(`<path d="M25 63Q26 43 48 42Q70 44 72 62Q68 78 48 78Q29 79 25 63Z" fill="${c}" stroke="${edge}" stroke-width="3"/><path d="M36 47l10 10-8 10m12-10l12-9m-11 11l10 12" stroke="${dark}" stroke-width="2.5" fill="none"/><circle cx="73" cy="58" r="8" fill="${light}" stroke="${edge}" stroke-width="2.8"/><circle cx="76" cy="56" r="1.5" fill="${eye}"/><path d="M30 73l-5 7m17-3l-4 9m18-9l3 9m14-15l7 5" stroke="${edge}" stroke-width="3" stroke-linecap="round"/>`,glow);
  }
  return null;
}


// v2.2 — Herpetofauna dibujada por morfología y especie (no reutiliza aves ni roedores).
function detailedHerpSprite(id,skin){
 const sp=SPECIES[id]; if(!sp)return null;
 const n=sp.name.toLocaleLowerCase('es');
 const c=applySkin(sp.color,skin),light=shade(c,19),dark=shade(c,-27),edge='#344033',eye=eyeColor(skin);
 const black=skin==='melanico',bone=black?'#5d6872':'#e6d6b5',g=alphaGlow(skin);
 const wrap=shape=>svgWrap(shape,g);
 const isTurtle=/tortuga|galápago|galapago|terrapin/.test(n) || /^(Testudo|Emys|Mauremys)\b/i.test(sp.latin) || sp.kind==='tortoise';
 const isLizard=/lagarto|lagartija|geco|gecko|eslizón|eslizon|salamanquesa|camaleón|camaleon|lagarto de cristal/.test(n)||sp.kind==='lizard';
 const isSalamander=/salamandra|tritón|triton/.test(n)||sp.kind==='salamander';
 const isToad=/sapo|rana|escuerzo/.test(n)||sp.kind==='amphibian';
 if(isTurtle){
   const tiles=black?'#303843':id==='eu_esp_0505'?'#594d36':id==='eu_esp_0506'?'#6c713f':dark;
   return wrap(`<ellipse cx="47" cy="65" rx="29" ry="19" fill="${c}" stroke="${edge}" stroke-width="3.5"/>
    <ellipse cx="47" cy="57" rx="26" ry="19" fill="${light}" stroke="${edge}" stroke-width="3.5"/>
    <path d="M47 39L38 49L42 62L55 62L59 49ZM22 53L38 49L42 62L28 68ZM59 49L73 54L66 69L55 62ZM42 62L47 75L55 62" fill="${tiles}" opacity=".64" stroke="${edge}" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M23 68l-10 8m27 3l-6 9m23-9l7 10m9-19l9 6" stroke="${edge}" stroke-width="6" stroke-linecap="round"/>
    <circle cx="76" cy="62" r="11" fill="${light}" stroke="${edge}" stroke-width="3"/><circle cx="79" cy="59" r="2" fill="${eye}"/><path d="M82 65q3 2 5-1" fill="none" stroke="${edge}" stroke-width="1.6"/>`);
 }
 if(isLizard){
   const limbless=/cristal|anguis|ophisaurus|lución|lucion/.test(n+' '+sp.latin.toLowerCase());
   if(limbless)return wrap(`<path d="M9 73Q18 63 34 65Q49 73 55 55Q63 36 76 47Q87 55 78 65Q67 72 55 67Q43 64 36 78" fill="none" stroke="${edge}" stroke-width="13" stroke-linecap="round"/>
      <path d="M9 73Q18 63 34 65Q49 73 55 55Q63 36 76 47Q87 55 78 65Q67 72 55 67Q43 64 36 78" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/>
      <path d="M39 64q7-2 11-5m7-10q4-4 9-5m-9 22q7 2 11 0" fill="none" stroke="${dark}" stroke-width="3"/>
      <circle cx="79" cy="53" r="2" fill="${eye}"/>`);
   const isGecko=/geco|gecko|salamanquesa/.test(n);
   const toadHead=/cabeza de sapo/.test(n);
   const dots=toadHead?`<circle cx="40" cy="61" r="4" fill="${dark}"/><circle cx="54" cy="63" r="4" fill="${dark}"/>`:
      `<circle cx="32" cy="62" r="3" fill="${dark}"/><circle cx="44" cy="55" r="3" fill="${dark}"/><circle cx="53" cy="69" r="3" fill="${dark}"/>`;
   return wrap(`<path d="M9 65Q18 57 29 56L41 52Q56 52 66 49L78 48Q89 50 89 61Q87 73 75 75L60 69Q49 78 33 76Q19 71 9 65Z" fill="${c}" stroke="${edge}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M16 63Q6 66 4 79" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>
    <path d="M35 69l-9 12m19-9l-3 13m13-17l5 14m5-24l7-7" fill="none" stroke="${edge}" stroke-width="4" stroke-linecap="round"/>
    ${dots}<circle cx="80" cy="56" r="${toadHead?4.2:isGecko?4:2.5}" fill="${bone}"/><circle cx="81" cy="56" r="1.6" fill="${eye}"/>
    <path d="M81 64q4 3 7 0" fill="none" stroke="${edge}" stroke-width="1.7"/>`);
 }
 if(isSalamander){
   const siberian=/siberian|siberiana|salamandrella/.test(n+' '+sp.latin.toLowerCase());
   const alpine=/alpina|atra/.test(n+' '+sp.latin.toLowerCase());
   const triton=/tritón|triton/.test(n);
   const markings=siberian?`<path d="M28 56q18-9 35-2M27 69q18 6 35 0" stroke="${black?'#576472':'#bca16a'}" stroke-width="3" fill="none" stroke-linecap="round"/>`:
     alpine?`<path d="M32 57q15-8 27 0" stroke="${light}" opacity=".3" stroke-width="3" fill="none"/>`:
      `<circle cx="31" cy="58" r="4" fill="${black?'#46505b':'#e4bd38'}"/><circle cx="43" cy="69" r="4" fill="${black?'#46505b':'#e4bd38'}"/><circle cx="58" cy="55" r="3.5" fill="${black?'#46505b':'#e4bd38'}"/>`;
   return wrap(`<path d="M11 65Q25 55 38 57Q51 60 61 51Q70 46 79 53Q88 60 82 70Q74 78 61 73Q46 81 34 77Q21 77 11 65Z" fill="${c}" stroke="${edge}" stroke-width="3.5"/>
     <path d="M13 66Q4 69 3 78" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>
     ${triton?`<path d="M29 55l3-10 5 9 4-9 4 10" fill="${dark}" stroke="${edge}" stroke-width="1"/>`:''}
     ${markings}<circle cx="81" cy="60" r="2" fill="${eye}"/><path d="M28 67l-9 11m23-6l-3 12m19-16l3 14m10-24l6-8" stroke="${edge}" stroke-width="3.6" stroke-linecap="round"/>`);
 }
 if(isToad){
   const frog=/rana/.test(n);
   const marks=frog?`<path d="M37 64q9-4 18 0" fill="none" stroke="${light}" stroke-width="3"/>`:
     `<circle cx="35" cy="60" r="3" fill="${dark}"/><circle cx="50" cy="67" r="3" fill="${dark}"/><circle cx="60" cy="57" r="2.5" fill="${dark}"/>`;
   return wrap(`<ellipse cx="50" cy="66" rx="25" ry="18" fill="${c}" stroke="${edge}" stroke-width="3.5"/>
    <ellipse cx="39" cy="50" rx="7" ry="7" fill="${light}" stroke="${edge}" stroke-width="2.5"/>
    <ellipse cx="61" cy="50" rx="7" ry="7" fill="${light}" stroke="${edge}" stroke-width="2.5"/>
    <circle cx="39" cy="49" r="2.8" fill="${eye}"/><circle cx="61" cy="49" r="2.8" fill="${eye}"/>
    ${marks}<path d="M29 70l-13 10 8 4m51-14l13 10-8 4" fill="none" stroke="${edge}" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M45 76q5 3 10 0" fill="none" stroke="${edge}" stroke-width="1.8"/>`);
 }
 return null;
}

// Sprites asiáticos v2.2: animales clave con siluetas, patrones o proporciones propias.
function asiaV22Sprite(id,skin){
 const sp=SPECIES[id]; if(!sp || !ASIA_V22_IDS.has(id))return null;
 const c=applySkin(sp.color,skin),dark=shade(c,-28),light=shade(c,20),g=alphaGlow(skin);
 const ink='#342d27',eye=eyeColor(skin),mel=skin==='melanico',cream=mel?'#515964':'#f0e0c4';
 const wrap=shapes=>svgWrap(shapes,g);
 const legs=`<path d="M37 72l-2 13m20-13l2 13" stroke="${ink}" stroke-width="3.2" stroke-linecap="round"/>`;
 const head=(x=68,y=46)=>`<circle cx="${x}" cy="${y}" r="11" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="${x+3}" cy="${y-2}" r="2" fill="${eye}"/>`;
 const bird=(crest='',belly='',tail='')=>wrap(`<ellipse cx="47" cy="59" rx="18" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/>
   <path d="M29 58Q16 42 13 36Q29 36 41 50" fill="${dark}" stroke="${ink}" stroke-width="3"/>${head(62,46)}
   ${crest}${belly}${tail}<polygon points="71,48 84,45 72,53" fill="${mel?'#363d43':'#d3a04c'}" stroke="${ink}" stroke-width="2"/>
   <path d="M43 74l-3 12m10-12l3 12" stroke="${ink}" stroke-width="2.8" stroke-linecap="round"/>`);
 const quadruped=(horns='',spots='',tail='')=>wrap(`<ellipse cx="45" cy="60" rx="25" ry="16" fill="${c}" stroke="${ink}" stroke-width="3"/>
   <path d="M35 56q12-5 22 0" fill="none" stroke="${light}" stroke-width="3" opacity=".6"/>
   ${head(68,46)}${horns}${spots}${tail}${legs}`);
 const cats=(pattern='')=>wrap(`<ellipse cx="45" cy="61" rx="26" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(68,46)}
   <path d="M60 38l3-12 7 11m0-1 9-10 2 13" fill="${dark}" stroke="${ink}" stroke-width="2.6"/>
   <ellipse cx="70" cy="54" rx="6" ry="4" fill="${cream}"/>
   <path d="M21 60q-11 5-11 17" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>
   ${pattern}${legs}`);
 switch(id){
 case 'asia_esp_0402':return cats(`<path d="M29 48l5 10m10-14 3 15m13-13-4 13m-23 6 3 10m14-11 4 10" stroke="${mel?'#262d34':'#3c3025'}" stroke-width="3.3" stroke-linecap="round"/>`);
 case 'asia_esp_0403':return cats(`<circle cx="31" cy="58" r="3.6" fill="none" stroke="${dark}" stroke-width="2.6"/><circle cx="44" cy="66" r="4" fill="none" stroke="${dark}" stroke-width="2.6"/><circle cx="55" cy="54" r="3.4" fill="none" stroke="${dark}" stroke-width="2.4"/><path d="M13 76l-3 7" stroke="${ink}" stroke-width="4"/>`);
 case 'asia_esp_0073':return wrap(`<path d="M21 63Q21 49 30 45Q34 26 42 27Q49 29 51 43Q56 28 64 29Q72 33 70 51Q83 55 77 69Q61 78 38 71Z" fill="${c}" stroke="${ink}" stroke-width="3"/>
   ${head(74,46)}<path d="M75 56q5 10 8 16" fill="none" stroke="${ink}" stroke-width="4"/>${legs}<path d="M22 62q-10 2-11 9" stroke="${dark}" fill="none" stroke-width="4"/>`);
 case 'asia_esp_0062':return wrap(`<ellipse cx="45" cy="61" rx="26" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M27 55q1-20 15-19q14 2 17 17" fill="${dark}" stroke="${ink}" stroke-width="3"/>${head(70,48)}<path d="M62 38q-4-11-9-7m20 6q8-10 12-6" fill="none" stroke="${cream}" stroke-width="3.5" stroke-linecap="round"/>${legs}<path d="M27 73l-3 13m14-10l-2 11" stroke="${dark}" stroke-width="4"/>`);
 case 'asia_esp_0821':return quadruped(`<path d="M60 36q-5-13-12-12m24 12q7-13 14-12" fill="none" stroke="${cream}" stroke-width="3.5"/>`,`<path d="M23 55q9-10 19-7" fill="none" stroke="${dark}" stroke-width="6"/>`);
 case 'asia_esp_0240':case 'asia_esp_0445':case 'asia_esp_0086':case 'asia_esp_0344':
   return quadruped(`<path d="M61 35q-7-14-4-21m14 21q6-14 4-21" fill="none" stroke="${mel?'#373f46':'#6b5236'}" stroke-width="3.6" stroke-linecap="round"/>`,id==='asia_esp_0344'?`<path d="M70 56l-2 7" stroke="${cream}" stroke-width="3.2"/>`:``);
 case 'asia_esp_0007':return wrap(`<ellipse cx="44" cy="61" rx="23" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(67,48)}<path d="M62 42l-3-9m13 10 5-9" stroke="${ink}" stroke-width="5" stroke-linecap="round"/><ellipse cx="68" cy="54" rx="8" ry="5" fill="${cream}"/><path d="M26 64q-18 3-17 16q12 4 23-3" fill="none" stroke="${dark}" stroke-width="8" stroke-linecap="round"/><path d="M19 77l10 2" stroke="${cream}" stroke-width="3"/>${legs}`);
 case 'asia_esp_0855':return wrap(`<ellipse cx="47" cy="60" rx="21" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="65" cy="42" r="14" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="68" cy="48" rx="9" ry="8" fill="${cream}"/><circle cx="57" cy="41" r="5" fill="${dark}"/><circle cx="72" cy="40" r="2" fill="${eye}"/><path d="M26 62Q12 51 13 37" stroke="${dark}" stroke-width="5" fill="none"/>${legs}`);
 case 'asia_esp_0194':return wrap(`<ellipse cx="48" cy="66" rx="16" ry="12" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="62" cy="52" r="10" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M59 45l-8-19q9-8 14 13m1 3 8-20q8-4 5 6l-3 18" fill="${light}" stroke="${ink}" stroke-width="2.5"/><circle cx="65" cy="51" r="2" fill="${eye}"/><path d="M35 72l-11 15m28-13 10 13" stroke="${ink}" stroke-width="3.4"/>`);
 case 'asia_esp_0844':return wrap(`<ellipse cx="46" cy="60" rx="22" ry="14" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(65,47)}<path d="M26 55q-13-15-10-29" stroke="${dark}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M33 56l-9 12 24-4" fill="${light}" stroke="${ink}" stroke-width="2"/>${legs}`);
 case 'asia_esp_0177':return wrap(`<ellipse cx="45" cy="62" rx="25" ry="14" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(69,52)}<ellipse cx="70" cy="58" rx="7" ry="4" fill="${cream}"/><path d="M21 61q-11 1-14 12" stroke="${dark}" fill="none" stroke-width="6" stroke-linecap="round"/><path d="M39 75l-7 8m16-8 7 7" stroke="${ink}" stroke-width="3.2"/>`);
 case 'asia_esp_0369':case 'asia_esp_0371':return wrap(`<path d="M22 57L10 42V72Z" fill="${dark}" stroke="${ink}" stroke-width="3"/><ellipse cx="49" cy="57" rx="28" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M44 43l8-10 5 11" fill="${dark}" stroke="${ink}" stroke-width="2.5"/><circle cx="69" cy="53" r="2" fill="${eye}"/><path d="M31 65q18 6 34 1" fill="none" stroke="${light}" stroke-width="3"/>`);
 case 'asia_esp_0209':return bird(`<path d="M57 37l-5-12 10 6" fill="${dark}"/>`, `<ellipse cx="51" cy="66" rx="9" ry="9" fill="${cream}"/>`);
 case 'asia_esp_0234':case 'asia_esp_0203':return wrap(`<ellipse cx="47" cy="58" rx="18" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M29 57Q14 41 13 27Q29 32 40 48" fill="${dark}" stroke="${ink}" stroke-width="3"/><path d="M58 51Q75 36 88 32Q83 49 64 63" fill="${light}" stroke="${ink}" stroke-width="3"/>${head(61,43)}<polygon points="70,46 87,44 71,53" fill="${cream}" stroke="${ink}" stroke-width="2"/>${legs}`);
 case 'asia_esp_0881':case 'asia_esp_0503':return bird('', `<ellipse cx="48" cy="62" rx="7" ry="6" fill="${cream}"/>`,`<path d="M29 59q-12 3-17 17" stroke="${dark}" stroke-width="4" fill="none"/>`);
 case 'asia_esp_0294':case 'asia_esp_0864':case 'asia_esp_0865':
   return bird(`<path d="M55 38l-5-15 10 6-1-11 10 9" fill="${light}" stroke="${ink}" stroke-width="2.5"/>`,
     `<path d="M45 49q8-7 17 0m-23 12q12 9 23 2" fill="none" stroke="${mel?'#404b55':id==='asia_esp_0865'?'#d1a047':'#61aeb0'}" stroke-width="4"/>`,
     `<path d="M30 65q-16 7-15 18" stroke="${dark}" stroke-width="4" fill="none"/>`);
 case 'asia_esp_0863':return bird('',`<ellipse cx="50" cy="64" rx="12" ry="8" fill="${cream}" opacity=".8"/>`);
 case 'asia_esp_0820':return quadruped(`<path d="M60 38l3-13 8 12m3-1 8-13" fill="${dark}" stroke="${ink}" stroke-width="2.5"/>`,``,`<path d="M21 62q-13-1-16-10" stroke="${dark}" stroke-width="5" fill="none"/>`);
 case 'asia_esp_0850':return wrap(`<ellipse cx="44" cy="63" rx="26" ry="12" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(71,54)}<path d="M30 59q12 8 28 4" fill="none" stroke="${cream}" stroke-width="7"/><path d="M19 60Q9 64 8 75" stroke="${dark}" fill="none" stroke-width="5"/>${legs}`);
 case 'asia_esp_0523':return wrap(`<ellipse cx="45" cy="61" rx="25" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/>${head(69,46)}<circle cx="61" cy="36" r="4" fill="${dark}" stroke="${ink}" stroke-width="2"/><circle cx="77" cy="36" r="4" fill="${dark}" stroke="${ink}" stroke-width="2"/><path d="M67 54q8 4 12-1" fill="${cream}"/><path d="M38 57q12-3 18 0" stroke="${cream}" stroke-width="3"/>${legs}`);
 }
 return quadruped();
}
const ASIA_V22_IDS=new Set(["asia_esp_0402", "asia_esp_0086", "asia_esp_0344", "asia_esp_0209", "asia_esp_0203", "asia_esp_0234", "asia_esp_0177", "asia_esp_0369", "asia_esp_0371", "asia_esp_0881", "asia_esp_0194", "asia_esp_0073", "asia_esp_0431", "asia_esp_0863", "asia_esp_0294", "asia_esp_0864", "asia_esp_0503", "asia_esp_0865", "asia_esp_0820", "asia_esp_0403", "asia_esp_0007", "asia_esp_0855", "asia_esp_0850", "asia_esp_0844", "asia_esp_0523", "asia_esp_0062", "asia_esp_0821", "asia_esp_0240", "asia_esp_0445"]);

// v2.3 · Sprites vectoriales de Asia restante. Siluetas animales y patrones compartidos
// por familia; cada especie conserva su color y la compatibilidad con variantes.
const ASIA_V23_IDS=new Set(["asia_esp_0538", "asia_esp_0206", "asia_esp_0214", "asia_esp_0383", "asia_esp_0519", "asia_esp_0102", "asia_esp_0205", "asia_esp_0300", "asia_esp_0065", "asia_esp_0910", "asia_esp_0327", "asia_esp_0873", "asia_esp_0246", "asia_esp_0182", "asia_esp_0218", "asia_esp_0227", "asia_esp_0534", "asia_esp_0321", "asia_esp_0183", "asia_esp_0404", "asia_esp_0442", "asia_esp_0347", "asia_esp_0319", "asia_esp_0468", "asia_esp_0891", "asia_esp_0890", "asia_esp_0226", "asia_esp_0878", "asia_esp_0422", "asia_esp_0842", "asia_esp_0824", "asia_esp_0915", "asia_esp_0911", "asia_esp_0888", "asia_esp_0868", "asia_esp_0872", "asia_esp_0410", "asia_esp_0874", "asia_esp_0816", "asia_esp_0176", "asia_esp_0852", "asia_esp_0336", "asia_esp_0860", "asia_esp_0853", "asia_esp_0476", "asia_esp_0833", "asia_esp_0050", "asia_esp_0061", "asia_esp_0063", "asia_esp_0830", "asia_esp_0465", "asia_esp_0825", "asia_esp_0900", "asia_esp_0136", "asia_esp_0906", "asia_esp_0905", "asia_esp_0351", "asia_esp_0124", "asia_esp_0296", "asia_esp_0096", "asia_esp_0355", "asia_esp_0006", "asia_esp_0318", "asia_esp_0854", "asia_esp_0395", "asia_esp_0856", "asia_esp_0310", "asia_esp_0345", "asia_esp_0902", "asia_esp_0016", "asia_esp_0433", "asia_esp_0440", "asia_esp_0333", "asia_esp_0111", "asia_esp_0249", "asia_esp_0067", "asia_esp_0867", "asia_esp_0869", "asia_esp_0883", "asia_esp_0849", "asia_esp_0858", "asia_esp_0238", "asia_esp_0857", "asia_esp_0317", "asia_esp_0859", "asia_esp_0251", "asia_esp_0352", "asia_esp_0436", "asia_esp_0491", "asia_esp_0165", "asia_esp_0834", "asia_esp_0498", "asia_esp_0901", "asia_esp_0527", "asia_esp_0316", "asia_esp_0373", "asia_esp_0877", "asia_esp_0494", "asia_esp_0363", "asia_esp_0414", "asia_esp_0308", "asia_esp_0087", "asia_esp_0017"]);
function asiaV23Sprite(id,skin){
 if(!ASIA_V23_IDS.has(id))return null;
 const sp=SPECIES[id], n=sp.name.toLocaleLowerCase('es');
 const c=skin==='albino'?'#e9e3d6':applySkin(sp.color,skin);
 const d=shade(c,-28),l=shade(c,18),cream=skin==='albino'?'#fff8ed':'#e8d7b8',ink='#352e28',eye=eyeColor(skin),glow=alphaGlow(skin);
 const wrap=x=>svgWrap(x,glow);
 const legs='<path d="M35 74l-3 12m22-12 3 12" stroke="#604b37" stroke-width="4" stroke-linecap="round"/>';
 const face=(x=68,y=47)=>`<circle cx="${x}" cy="${y}" r="2.2" fill="${eye}"/>`;
 const spots=(x=35)=>`<circle cx="${x}" cy="55" r="3.3" fill="${d}"/><circle cx="${x+12}" cy="63" r="2.7" fill="${d}"/><circle cx="${x+20}" cy="52" r="3" fill="${d}"/>`;
 const body=(extras='',marks='')=>wrap(`<ellipse cx="46" cy="61" rx="25" ry="17" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="64" cy="46" rx="12" ry="11" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="71" cy="53" rx="7" ry="4" fill="${cream}"/>${face(67,43)}${legs}<path d="M21 59l-10-8" stroke="${d}" stroke-width="5" fill="none" stroke-linecap="round"/>${marks}${extras}`);
 const bird=(marks='',tail='',crest='',beak='')=>wrap(`<path d="M28 58L12 43L20 78L36 68Z" fill="${d}" stroke="${ink}" stroke-width="2.6"/><ellipse cx="46" cy="61" rx="21" ry="15" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M35 55q13-5 23 8q-12 10-23 1z" fill="${d}" stroke="${ink}" stroke-width="2"/><circle cx="66" cy="45" r="11" fill="${c}" stroke="${ink}" stroke-width="3"/>${face(69,42)}${beak||`<polygon points="74,49 89,46 75,55" fill="#cba05e" stroke="${ink}" stroke-width="2"/>`}${crest}${marks}${tail}<path d="M40 74l-4 12m16-12 3 12" stroke="${ink}" stroke-width="3"/>`);
 if(/elefante/i.test(n))return wrap(`<ellipse cx="43" cy="58" rx="28" ry="19" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="66" cy="48" r="17" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="56" cy="51" rx="12" ry="15" fill="${l}" stroke="${ink}" stroke-width="2.6"/><path d="M79 52q9 6 7 18q-2 11-10 8" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M78 59l8 9" fill="none" stroke="${cream}" stroke-width="3"/>${face(72,43)}<path d="M28 70v17m23-16v17" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>`);
 if(/rinoceronte/i.test(n))return body(`<path d="M73 43l15-15-7 25" fill="${cream}" stroke="${ink}" stroke-width="2.4"/><path d="M59 35l7-6" stroke="${ink}" stroke-width="4"/>`,`<path d="M29 57q13-9 27-5" fill="none" stroke="${d}" stroke-width="4"/>`);
 if(/cocodrilo/i.test(n))return wrap(`<path d="M8 63Q23 48 42 54L74 52Q86 48 91 58Q94 68 82 72L47 70Q23 80 8 63Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M17 60l9-8 6 7 7-9 7 8 8-8 7 8" stroke="${d}" stroke-width="5" fill="none"/><path d="M70 66q10 7 22-2" stroke="${ink}" stroke-width="2" fill="none"/>${face(81,54)}<path d="M28 71l-8 12m33-11 8 11" stroke="${ink}" stroke-width="5"/>`);
 if(/pitón|piton/i.test(n))return wrap(`<path d="M11 76Q20 54 36 61Q52 70 59 52Q70 34 82 47Q91 59 81 69Q71 76 58 72Q45 67 35 79" fill="none" stroke="${ink}" stroke-width="17" stroke-linecap="round"/><path d="M11 76Q20 54 36 61Q52 70 59 52Q70 34 82 47Q91 59 81 69Q71 76 58 72Q45 67 35 79" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/><path d="M24 63l9 5 8-3 9 4 9-6 9 4 8-6" fill="none" stroke="${d}" stroke-width="3.2"/>${face(83,50)}`);
 if(/dragón de komodo|dragon de komodo/i.test(n))return wrap(`<path d="M18 62Q33 45 54 53Q66 44 80 49Q92 53 88 65Q82 77 66 72Q49 83 31 73Z" fill="${c}" stroke="${ink}" stroke-width="3.5"/><path d="M25 69Q12 76 4 87" fill="none" stroke="${d}" stroke-width="7" stroke-linecap="round"/><path d="M33 69l-13 13m26-11-7 16m19-18 6 15m12-25 12-8" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>${spots(35)}${face(79,55)}<path d="M83 63l10 2" stroke="${ink}" stroke-width="2"/>`);
 if(/dragón volador|dragon volador/i.test(n))return wrap(`<path d="M34 55Q19 32 10 39Q12 58 32 69M61 53Q82 30 91 40Q90 58 67 70" fill="${l}" stroke="${ink}" stroke-width="3"/><path d="M16 43l19 19m48-18-18 18" stroke="${d}" stroke-width="2.4"/><path d="M17 66Q38 46 63 57Q82 47 87 61Q88 71 69 73Q43 84 24 72Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M20 69Q9 75 5 87" stroke="${d}" stroke-width="4" fill="none"/><path d="M34 71l-9 12m29-10 8 11m12-23 10-9" stroke="${ink}" stroke-width="3.5"/>${face(81,58)}`);
 if(/cobra|krait/i.test(n))return wrap(`<path d="M10 80Q19 61 36 70Q56 81 62 60Q66 41 64 29Q49 17 51 36Q55 51 68 52Q85 54 86 33Q80 18 69 29" stroke="${ink}" stroke-width="14" stroke-linecap="round" fill="none"/><path d="M10 80Q19 61 36 70Q56 81 62 60Q66 41 64 29Q49 17 51 36Q55 51 68 52Q85 54 86 33Q80 18 69 29" stroke="${c}" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M61 32q9-14 21-1q-7 21-19 17" fill="${d}" stroke="${ink}" stroke-width="2.6"/>${face(72,35)}`);
 if(/panda gigante/i.test(n))return wrap(`<ellipse cx="42" cy="62" rx="24" ry="19" fill="#f1eee7" stroke="${ink}" stroke-width="3"/><circle cx="67" cy="44" r="16" fill="#f4f1e9" stroke="${ink}" stroke-width="3"/><circle cx="56" cy="31" r="7" fill="${d}"/><circle cx="76" cy="30" r="7" fill="${d}"/><ellipse cx="61" cy="43" rx="6" ry="8" fill="${d}"/><ellipse cx="74" cy="43" rx="6" ry="8" fill="${d}"/>${face(62,43)}${face(73,43)}<ellipse cx="69" cy="54" rx="7" ry="5" fill="${d}"/><path d="M28 71l-7 11m28-11 6 11" stroke="${d}" stroke-width="9" stroke-linecap="round"/>`);
 if(/pangolín|pangolin/i.test(n))return wrap(`<path d="M15 67Q27 38 57 43Q78 48 77 68Q59 81 33 73Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M23 65l7-16 8 20 7-22 8 22 7-19 7 16" fill="none" stroke="${d}" stroke-width="4"/><path d="M22 72Q6 79 12 89Q25 88 35 78" stroke="${d}" stroke-width="7" fill="none"/><path d="M66 52l22-3-12 14" fill="${c}" stroke="${ink}" stroke-width="2.6"/>${face(77,53)}${legs}`);
 if(/pavo real/i.test(n))return wrap(`<path d="M45 61Q14 31 25 12L45 28 51 8 58 27 78 12Q86 36 58 61Z" fill="#548b79" stroke="${ink}" stroke-width="3"/><circle cx="25" cy="31" r="5" fill="#c8a86c"/><circle cx="45" cy="24" r="5" fill="#c8a86c"/><circle cx="65" cy="33" r="5" fill="#c8a86c"/><path d="M48 42q-8 2-8 20q1 14 13 17" fill="none" stroke="${c}" stroke-width="15" stroke-linecap="round"/><circle cx="50" cy="42" r="9" fill="${c}" stroke="${ink}" stroke-width="2.5"/>${face(54,39)}<path d="M56 44l12-3-9 8Z" fill="#c79d5b"/>${legs}`);
 if(/cálao|calao/i.test(n))return bird(`<path d="M63 32Q80 18 89 35L76 37" fill="${cream}" stroke="${ink}" stroke-width="2.7"/>`,`<path d="M24 73L13 88" stroke="${d}" stroke-width="5"/>`,'',`<path d="M75 42Q97 36 95 52Q83 61 73 50Z" fill="#d9b55e" stroke="${ink}" stroke-width="2.5"/>`);
 if(/pelícano|pelicano/i.test(n))return bird('',`<path d="M19 75l-6 12" stroke="${d}" stroke-width="4"/>`,'',`<path d="M74 46Q95 42 95 50Q92 68 77 63Q84 60 78 51Z" fill="#e4bb68" stroke="${ink}" stroke-width="2.7"/>`);
 if(/grulla|cigüeña|ciguena/i.test(n))return wrap(`<path d="M37 64Q22 44 37 41Q50 38 57 51L69 23Q72 13 78 22L70 55" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M68 24l21-2-18 10" fill="#bd9860"/><ellipse cx="44" cy="62" rx="20" ry="14" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M36 72l-9 18m22-19 2 20" stroke="${ink}" stroke-width="3"/>${face(75,22)}`);
 if(/faisán|faisan|pato mandarín|pato mandarin/i.test(n))return bird(spots(35),`<path d="M23 66Q9 74 7 90" fill="none" stroke="${d}" stroke-width="7"/>`,`<path d="M60 33l-7-10 15 6" fill="${l}" stroke="${ink}" stroke-width="2"/>`);
 if(/urraca|carraca|abejaruco|bubul|bulbul/i.test(n))return bird(`<path d="M43 54l13 11" stroke="${l}" stroke-width="3"/>`,`<path d="M22 65L7 88" stroke="${d}" stroke-width="7"/>`);
 if(/antílope saiga|antilope saiga/i.test(n))return body(`<path d="M62 35Q49 15 56 13m14 22q12-20 8-25" fill="none" stroke="${ink}" stroke-width="4"/><ellipse cx="78" cy="57" rx="8" ry="9" fill="${l}" stroke="${ink}" stroke-width="2"/>`);
 if(/órix|orix|antílope|antilope|gacela|kiang|onagro|caballo|búfalo|bufalo|gaur|nilgó|nilgo|ciervo|muntíaco|muntiaco/i.test(n))return body(`<path d="M58 34Q52 19 49 11m24 23q3-14 8-22" stroke="${d}" stroke-width="4" fill="none" stroke-linecap="round"/>`,/chital|sika|gacela/i.test(n)?spots():'');
 if(/hiena/i.test(n))return body(`<path d="M22 48l8-18 7 18 6-16 6 18" fill="${d}" stroke="${ink}" stroke-width="2.5"/>`);
 if(/gato|leopardo|tigre|pantera|lince/i.test(n))return body(`<path d="M57 39l2-12 8 8 7-10 5 15" fill="${d}" stroke="${ink}" stroke-width="2.5"/>`,/leopardo|gato leopardo|nublado/i.test(n)?spots():`<path d="M33 52l5 13m13-11l4 12" stroke="${d}" stroke-width="4"/>`);
 if(/macaco|mono|langur|gibón|gibon|loris/i.test(n))return wrap(`<ellipse cx="42" cy="64" rx="20" ry="18" fill="${c}" stroke="${ink}" stroke-width="3"/><circle cx="59" cy="42" r="17" fill="${c}" stroke="${ink}" stroke-width="3"/><ellipse cx="61" cy="49" rx="12" ry="10" fill="${cream}"/><circle cx="57" cy="42" r="2" fill="${eye}"/><circle cx="68" cy="42" r="2" fill="${eye}"/><path d="M23 65Q6 57 14 43" fill="none" stroke="${d}" stroke-width="6"/><path d="M28 71L16 86m37-11L70 86" stroke="${ink}" stroke-width="4"/>`);
 if(/pez|carpa/i.test(n))return wrap(`<path d="M27 55L9 38V72Z" fill="${d}" stroke="${ink}" stroke-width="2.5"/><path d="M23 54Q45 36 70 46Q86 55 74 68Q49 78 23 54Z" fill="${c}" stroke="${ink}" stroke-width="3"/><path d="M44 45l8-12 6 12" fill="${d}" stroke="${ink}" stroke-width="2"/>${face(70,53)}<path d="M38 58q15 7 27-1" fill="none" stroke="${l}" stroke-width="3"/>`);
 if(/varano|gecko|lagarto|galápago|galapago|salamandra|víbora|vibora/i.test(n))return null; // Dibujo herpetológico existente
 if(/marmota|musaraña|liebre|tejón|tejon|turón|turon|ardilla|civeta|nutria/i.test(n))return body('',`<path d="M27 63q15-8 27 0" fill="none" stroke="${l}" stroke-width="4"/>`);
 if(/oso/i.test(n))return body(`<path d="M56 36l-3-7m18 5 5-8" stroke="${d}" stroke-width="5"/>`);
 return sp.kind==='forestbird'||sp.kind==='songbird'||sp.kind==='raptor'||sp.kind==='seabird'||sp.kind==='stork'?bird():body();
}

// Beta 3.6.1: presentation only. Shared 100×100 geometry; no species/save mutations.
function polishedSpeciesSprite(id,skin){
 const sp=SPECIES[id]; if(!sp)return null;
 const n=sp.name.toLocaleLowerCase('es'),kind=sp.kind;
 const c=applySkin(sp.color,skin),d=skin==='melanico'?'#39434f':shade(c,-36);
 const l=skin==='melanico'?'#687582':shade(c,23),ink='#39332e';
 const pale=skin==='melanico'?'#77818b':'#f1e7d4',eye=eyeColor(skin);
 const path=(a,fill=c,width=2.8)=>`<path d="${a}" fill="${fill}" stroke="${ink}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
 const line=(a,color=ink,width=3)=>`<path d="${a}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const ellipse=(x,y,rx,ry,fill=c,width=2.8)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${ink}" stroke-width="${width}"/>`;
 const dot=(x,y,r=2,fill=eye)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 const wrap=a=>svgWrap(a,alphaGlow(skin));
 const feet=(y=73)=>line(`M30 ${y}l-2 14m12-14v14m17-14l-1 14m12-16l3 16`,ink,3.8);
 const spots=(rosettes=false)=>[[32,56],[44,62],[53,53],[58,67],[35,68]].map(([x,y])=>rosettes?ellipse(x,y,2.6,2.1,c,1.9):dot(x,y,2.1,d)).join('');
 if(kind==='crocodile'){
   const narrow=id==='af_cocodrilo_hocico';
   return wrap(path('M36 62Q16 57 6 72Q20 68 29 75',d)+path('M24 62Q38 49 60 57L69 54L94 '+(narrow?'60':'57')+'L94 67L66 70Q45 81 25 73Z')+
     line('M33 57l4-6 6 5 6-6 6 6 6-4',d,3.5)+line('M31 73l-7 10 11-1m18-8 6 9 8-1',ink,4)+line('M70 64h22',d,2.5)+dot(68,57,2.3)+dot(90,60,1.4,d)+line('M77 65l2 3m7-3 2 3',pale,2));
 }
 if(kind==='elephant'){
   const forest=id==='af_elefante_bosque',africa=id.startsWith('af_');
   return wrap(line('M24 56Q15 57 13 70',d,3)+feet()+ellipse(45,57,27,22)+
     path('M60 38Q82 28 88 47L88 70Q95 73 94 62L97 63Q99 84 83 81L78 56Z')+
     ellipse(africa?62:64,49,forest?14:africa?17:10,africa?20:14,l)+
     path('M80 59Q88 65 94 54Q91 72 79 66Z',pale,1.8)+dot(81,45,2.2)+line('M32 85h7m18 0h7',l,2));
 }
 if(kind==='rhino'){
   const white=id==='af_rinoceronte_blanco',indian=/indio/.test(n);
   return wrap(feet()+ellipse(43,59,28,21)+path('M60 46L76 45L88 59L89 72L63 74L54 60Z')+
     path('M78 58Q86 48 86 '+(white?'33':'39')+'L92 62Z',pale)+(!indian?path('M71 53l3-12 6 16Z',l,2):'')+
     path('M63 47l-1-13 9 9m2 2 6-10 1 13',c,2.4)+dot(77,55)+line('M78 69h8',d,2.2)+
     (indian?line('M34 40l-4 32m22-32 4 35',d,3):''));
 }
 if(kind==='hippo')return wrap(feet(76)+ellipse(43,60,28,23)+ellipse(72,59,19,19)+ellipse(78,68,17,11,l)+ellipse(61,42,4,5)+ellipse(78,41,4,5)+dot(66,52,2.4)+dot(79,51,2.4)+dot(73,65,2,d)+dot(85,65,2,d)+line('M68 74q9 3 18-1',d,2));
 if(kind==='giraffe'){
   const okapi=id==='af_okapi';
   return wrap(line('M24 57L14 72',d,3)+feet()+ellipse(44,60,23,14)+path(okapi?'M56 56L61 33L70 31L74 61Z':'M55 57L63 19L72 18L71 60Z')+
     ellipse(75,okapi?33:22,12,7)+path(okapi?'M65 29l-7-9 11 4m9 3 5-9 2 12':'M65 18l-6-8 10 4m8 2 8-7-3 11',l,2)+
     line(okapi?'M69 26v-7m8 7 1-7':'M68 16V9m8 7V8',d,3)+dot(80,okapi?31:20)+
     (okapi?line('M26 67l12 4m-10 4 11 3m17-10 13 1m-12 6 13 1',pale,3):line('M29 53l7 4m5-6 8 4m-14 8 7 4m8-8 6 4m7-25 6 2m-5-12 6 2m-8 20 6 2',d,4)));
 }
 if(kind==='zebra')return wrap(feet()+line('M23 58L12 74',d,3)+ellipse(44,58,25,17)+path('M57 52L65 28L76 24L85 40L77 49L68 63Z')+
   path('M65 29l-3-12 7 7m4 1 3-13 5 13',c,2)+line('M61 47l4-18',d,5)+
   line('M25 49l6 19m3-25 6 29m4-30 5 31m4-28 5 26m6-37 10 7m-12 2 12 6',d,3.5)+ellipse(80,43,6,5,d,2)+dot(77,34));
 if(id==='af_hiena_manchada')return wrap(line('M25 57L12 67',d,5)+feet()+path('M22 55Q39 35 62 47L76 57L65 73L31 72Z')+
   line('M35 47l5-7 6 5 5-5',d,4)+ellipse(72,47,13,12)+ellipse(63,35,5,6)+ellipse(77,34,5,6)+ellipse(81,53,9,6,l)+spots()+dot(76,44)+dot(88,52,2.6,ink));
 if(kind==='cat' && id.startsWith('af_')){
   const lion=id==='af_leon',cheetah=id==='af_guepardo',serval=id==='af_serval',caracal=id==='af_caracal',fosa=id==='af_fosa',civet=id==='af_civeta';
   const tail=fosa?'M25 61Q3 79 8 39':serval?'M24 63Q12 62 13 73':'M25 62Q9 62 12 78Q18 84 24 77';
   return wrap(line(tail,d,fosa?5:4)+feet(cheetah||serval?68:73)+ellipse(45,58,cheetah?25:23,cheetah?12:16)+
     (lion?ellipse(69,45,18,20,d):'')+
     ((cheetah||serval||civet)?spots():id==='af_leopardo'?spots(true):'')+
     (serval?ellipse(61,30,6,10)+ellipse(75,29,6,10):path('M59 40l2-13 10 10 8-9 2 15',c,2.5))+
     ellipse(70,45,12,11)+ellipse(75,51,8,5,pale,1.5)+dot(75,42)+dot(82,49,2,ink)+
     (caracal?line('M61 28l-3-9m20 9 4-9',ink,3):'')+
     (cheetah?line('M75 44l3 5',ink,2.4):'')+(civet?line('M63 43l14-1',d,4):'')+
     (lion?dot(22,78,4,d):''));
 }
 if(kind==='canid'){
   const fenec=id==='af_fenec',dog=id==='af_licaon',fox=/zorro|fénec/.test(n),arctic=/ártico/.test(n);
   const coat=arctic&&skin==='normal'?'#dae1e7':c;
   return wrap(path(fox?'M28 59Q10 44 8 61Q7 81 31 73Z':'M25 60Q9 54 10 68L27 73Z',d)+
     (fox?path('M10 59Q6 75 20 76L17 67Z',pale,1.5):'')+feet()+ellipse(45,59,24,15,coat)+
     (dog?path('M26 51l14-4 2 17-12 7Z',ink,1.5)+path('M49 49l10 5-5 16-10-4Z',pale,1.5):'')+
     (dog?ellipse(60,30,7,8,d)+ellipse(77,30,7,8,d):path(fenec?'M57 42L52 12L68 34L79 13L82 43Z':fox?'M58 40l2-17 11 13 9-13 2 19Z':'M58 40l2-13 11 9 8-11 2 17Z',coat))+
     ellipse(69,45,12,11,coat)+path('M70 46L90 51L78 58L65 53Z',pale,2)+dot(73,43)+dot(89,51,2.3,ink)+
     (dog?line('M13 65l8 4',pale,5):''));
 }
 if(id.startsWith('af_')&&(kind==='deer'||kind==='bison')){
   const oryx=id==='af_orix',bongo=id==='af_antilope_bongo',duiker=id==='af_duiker_azul',buffalo=id==='af_bufalo_cafre',gnu=id==='af_nu_azul',eland=id==='af_eland',arrui=id==='af_arrui';
   const horns=duiker?'M65 34l-1-7m9 7 2-7':oryx?'M64 33L49 9m24 24L67 8':buffalo?'M65 37Q48 21 52 43Q60 48 67 39M70 38Q88 23 86 43Q80 49 70 38':gnu?'M62 36Q46 37 51 23m21 13q15 0 10-13':arrui?'M63 34Q45 13 56 14M72 34Q88 17 77 13':bongo||eland?'M64 33l-5-8 3-7-5-8m16 24-1-10 4-6-3-8':'M64 34Q53 19 60 12m13 22q9-14 2-22';
   return wrap(feet()+line('M23 57L12 70',d,3)+ellipse(44,58,25,buffalo||gnu||eland?19:14)+path('M57 53l4-20 15 1 9 17-9 10-13 4Z')+
     path('M61 36l-10-6 4 9m20-2 12-7-5 12',l,2)+line(horns,d,buffalo?4.5:3.2)+
     (gnu||arrui?path('M64 58l3 16 8-13',d,2):'')+
     (bongo?line('M29 48l2 20m8-24 2 26m8-24 2 24m7-20 1 14',pale,2.5):!buffalo&&!gnu?line('M28 63h29',pale,4):'')+
     (oryx?line('M69 39l9 13',d,3):'')+dot(77,43)+ellipse(81,53,5,4,d,1.5));
 }
 // Bird family helper: species supply the head, bill, tail and bold plumage blocks.
 const bird=(head=c,wing=d,marks='',bill='M76 37l14 3-14 5Z',tail='M32 58L13 72L20 53Z')=>wrap(
   path(tail,d)+line('M43 74l-3 13h-5m19-13 3 13h5',ink,2.8)+ellipse(48,59,20,17)+
   path('M34 52Q48 48 57 64L34 69Z',wing,2)+ellipse(67,37,11,11,head)+path(bill,'#c99b48',2)+marks+dot(71,35));
 if(id==='af_aguila_pescadora'||id==='af_fosa_ave')return bird(pale,'#302e2c',
   path('M58 41L74 44L66 58L54 53Z',pale,1.5)+line('M35 59l11 8m-12-1 9 7',l,2.6),
   'M76 35Q91 32 87 43L82 46L82 40L76 42Z','M32 61L20 82L41 78Z');
 if(id==='af_secretario')return wrap(line('M42 62l-4 27h-7m24-27 4 27h7',ink,3.4)+path('M34 55L17 79L36 70Z',d)+ellipse(48,50,18,14)+path('M56 47L60 22L69 22L67 49Z')+ellipse(66,21,9,8)+line('M59 17L48 12m11 8-12-2m12 6-12 1',ink,2.5)+path('M73 21l13 2-9 7-3-3Z',pale,2)+dot(70,20)+path('M35 45l14 2 3 14-16-4Z',d,2));
 if(id==='af_avestruz')return wrap(line('M36 67l-4 22h-7m30-22 5 22h8',ink,3.5)+path('M28 44l-14-1 10 11Z',pale,2)+ellipse(45,51,23,18)+path('M59 45Q72 34 66 17L73 16Q81 39 65 56Z',l)+ellipse(69,15,8,6,l,2)+path('M77 15l12 3-12 3Z',pale,1.8)+path('M31 48q12-9 24 7l-21 8Z',pale,2)+dot(72,14));
 if(id==='af_ibis_sagrado'||id==='af_ibis_eremita'||id==='af_garza_goliat'||id==='af_grulla_coronada'){
   const ibis=/ibis/.test(id),crown=id==='af_grulla_coronada';
   return wrap(line('M39 64l-3 24h-6m23-24 5 24h6',ink,2.8)+ellipse(45,53,23,15)+path('M55 47Q69 43 60 26Q58 17 68 17L72 24Q64 29 72 39L64 55Z',ibis?d:c)+ellipse(67,21,8,7,ibis?d:c,2.4)+
     (ibis?line('M74 22Q91 24 89 44',d,3):path('M74 21L94 26L75 27Z',l,2))+
     path('M28 48q12-6 23 9l-22 6Z',d,2)+
     (crown?line('M61 14l-6-6m10 5-2-8m7 8 3-8m0 11 8-7','#c8a64d',3):'')+dot(70,20,1.8,ibis?'#d8c46b':eye));
 }
 if(['af_loro_gris','af_turaco','af_abejaruco_carmin'].includes(id)){
   if(id==='af_loro_gris')return bird(c,d,path('M27 64l-8 11 15-2Z','#ba5147',2),'M76 36Q89 33 84 47L79 42L75 43Z');
   if(id==='af_turaco')return bird(c,d,path('M59 28l-1-14 7 5 5-7 5 17Z',l,2)+line('M62 38l12 1',pale,2),'M77 37l9 4-10 4Z','M32 58L18 87L39 72Z');
   return bird('#4d9e9c',d,line('M59 35l15 1',ink,3),'M76 36l18 4-18 3Z','M32 58L13 83L24 63L20 87L40 68Z');
 }
 if(id==='af_tortuga_laúd')return wrap(path('M36 52L15 36L23 61L15 78L40 69Z',d)+path('M62 51L81 38L73 65L85 78L62 70Z',d)+ellipse(50,59,20,26)+ellipse(73,43,8,7)+line('M40 39Q30 58 41 79m8-44q-8 24 1 48m8-46q5 22 0 42',l,2.3)+dot(77,42));
 if(id==='af_tortuga_radiada')return wrap(line('M30 71l-8 12m20-9-2 11m20-11 5 11m6-17 9 10',ink,5)+ellipse(74,59,10,8)+path('M21 70Q21 36 46 36Q69 36 71 70Z',d)+[32,49,62].map((x,i)=>line(`M${x} 57l-7-12m7 12 7-13m-7 13-7 10m7-10 7 11`,pale,2)).join('')+dot(79,57));
 if(id==='af_suricata')return wrap(line('M40 75Q23 85 16 77',d,4)+ellipse(49,63,12,22)+ellipse(51,34,12,10)+ellipse(40,30,4,5)+ellipse(61,29,4,5)+line('M44 79l-3 9m17-9 5 9m-24-38 6 12m16-12-6 12',ink,3)+line('M43 34h4m9 0h4',d,4)+dot(46,33,1.5)+dot(58,33,1.5)+dot(54,40,2,d));
 if(id==='af_tenrec')return wrap(path('M18 70L20 49L27 53L31 39L39 49L47 38L54 49L64 45L74 59L86 69L74 76L31 78Z')+line('M27 58l7-10m3 17 8-15m4 17 8-13',pale,2.4)+dot(72,62)+dot(84,69,2,ink)+line('M32 77l-3 8m29-8 5 8',ink,3));
 return null;
}


/**
 * Beta 3.9: retratos propios para animales nuevos de África.
 * SVG 100x100; variantes claras/oscuras se pintan en getSpriteMarkup.
 */

function africaV310Sprite(id,skin){
 const sp=SPECIES[id];if(!sp)return null;
 const c=applySkin(sp.color,skin),dark=shade(c,-27),light=shade(c,25);
 const ink='#36342f',eye=eyeColor(skin);
 const wrap=part=>svgWrap(part,alphaGlow(skin));
 if(id==='af_picozapato')return wrap(
  '<path d="M21 65L8 78L30 71Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<ellipse cx="44" cy="60" rx="23" ry="17" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M57 57Q64 48 63 35Q62 22 71 20Q84 17 85 34L76 55Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M80 30L97 28L97 46L78 52L73 39Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M33 73l-8 17m25-15-3 16" stroke="'+ink+'" stroke-width="4" fill="none"/>'+
  '<path d="M34 55Q41 44 58 57L52 68Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<circle cx="76" cy="29" r="2" fill="'+eye+'"/>');
 if(id==='af_lechwe_negro')return wrap(
  '<path d="M23 63L11 68" stroke="'+ink+'" stroke-width="3"/>'+
  '<ellipse cx="43" cy="57" rx="25" ry="15" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M29 67l-4 23m20-20-1 21m18-22 2 20" stroke="'+ink+'" stroke-width="4"/>'+
  '<path d="M60 54L67 34L80 36L89 56L75 66L65 61Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M68 35Q49 13 57 9M75 35Q90 15 85 10" fill="none" stroke="'+dark+'" stroke-width="5" stroke-linecap="round"/>'+
  '<path d="M74 61L86 62" stroke="'+light+'" stroke-width="3"/>'+
  '<circle cx="81" cy="48" r="2" fill="'+eye+'"/>');
 if(id==='af_calao_trompetero')return wrap(
  '<path d="M23 64L9 85L30 76Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<ellipse cx="46" cy="57" rx="23" ry="17" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M31 52Q48 42 59 62L43 70Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<circle cx="68" cy="42" r="13" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M77 44Q92 32 97 48Q94 61 78 55Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M75 30L89 20L95 33L80 39Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M40 72l-4 16m16-16 4 16" stroke="'+ink+'" stroke-width="3"/>'+
  '<circle cx="72" cy="39" r="2" fill="'+eye+'"/>');

 if(id==='af_flamenco_enano')return wrap(
  '<path d="M34 67Q29 57 43 49Q59 44 63 56Q62 70 45 73Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M35 59Q46 49 54 62L44 71Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<path d="M61 53Q79 43 73 30Q66 19 76 17Q86 15 84 27" fill="none" stroke="'+c+'" stroke-width="9" stroke-linecap="round"/>'+
  '<path d="M61 53Q79 43 73 30Q66 19 76 17Q86 15 84 27" fill="none" stroke="'+ink+'" stroke-width="2"/>'+
  '<path d="M84 26Q98 29 91 39L84 34Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<path d="M42 71l-6 19 8-4m9-15-2 18 8 1" fill="none" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M29 59L15 69L30 67" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<circle cx="82" cy="23" r="1.5" fill="'+eye+'"/>');
 if(id==='af_pelicano_blanco')return wrap(
  '<path d="M26 66L10 79L29 71" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<ellipse cx="46" cy="60" rx="25" ry="17" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M31 55Q45 50 60 61Q46 70 30 67Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<path d="M60 55Q69 46 64 30Q62 18 75 18Q85 19 82 32L77 54Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M80 30L97 35L83 47Q92 58 79 60L72 45Z" fill="#c6a36d" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M40 76l-5 12m18-12 2 12" fill="none" stroke="'+ink+'" stroke-width="3"/>'+
  '<circle cx="77" cy="27" r="1.8" fill="'+eye+'"/>');
 if(id==='af_tortuga_aldabra')return wrap(
  '<path d="M20 68l-7 16m26-7-4 13m23-13 4 13m11-22 7 16" fill="none" stroke="'+ink+'" stroke-width="8" stroke-linecap="round"/>'+
  '<path d="M18 68Q19 34 48 34Q76 37 77 69Q52 84 22 74Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M34 41L45 54L30 67M48 36l-3 18 17 14m6-25-6 25m-32-1 15 9 17-8" fill="none" stroke="'+dark+'" stroke-width="3"/>'+
  '<path d="M72 59Q82 49 91 56Q97 67 84 71L73 66Z" fill="'+light+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<circle cx="87" cy="59" r="1.8" fill="'+eye+'"/>');
 if(id==='af_loro_negro_seychelles')return wrap(
  '<path d="M30 66L18 89L37 73" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<ellipse cx="47" cy="58" rx="20" ry="18" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M35 52Q48 46 57 60Q51 70 37 68Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<circle cx="67" cy="41" r="13" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M76 43Q92 40 85 55L76 52Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M40 74l-4 12m16-12 3 12" stroke="'+ink+'" stroke-width="3" fill="none"/>'+
  '<circle cx="72" cy="38" r="2.1" fill="'+eye+'"/>');
 if(id==='af_tiburon_puntas_negras')return wrap(
  '<path d="M12 64Q31 43 56 47Q78 47 92 60L77 70Q51 79 25 68L12 64Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M45 49L53 24L68 48Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M18 63L4 46L11 63L3 84L23 70" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
  '<path d="M52 68L43 81L68 72" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
  '<path d="M63 55l6 12m-4-14 7 11" fill="none" stroke="'+dark+'" stroke-width="2"/>'+
  '<path d="M86 60l11-1-9 6" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
  '<circle cx="81" cy="56" r="1.6" fill="'+eye+'"/>');
 return null;
}

function africaV39Sprite(id,skin){
 const sp=SPECIES[id];if(!sp)return null;
 const c=applySkin(sp.color,skin),ink='#35342e',dark=shade(c,-28),light=shade(c,25);
 const eye=eyeColor(skin);
 const wrap=shapes=>svgWrap(shapes,alphaGlow(skin));
 const dot=(x,y,r=2)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+eye+'"/>';
 if(id==='af_dugongo')return wrap(
   '<path d="M19 64Q8 74 13 81L28 73Q44 85 61 75Q80 79 90 64Q82 58 70 61Q55 42 31 48Q16 50 19 64Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M32 66Q40 75 53 69L43 82Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M79 64Q91 49 97 59L87 72L98 78Q83 82 79 71Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M17 62Q12 56 22 54m-6 15q9 6 19 0" fill="none" stroke="'+ink+'" stroke-width="2"/>'+dot(27,58));
 if(id==='af_manta_gigante')return wrap(
   '<path d="M49 38Q35 40 6 25Q10 64 35 69L48 76L61 69Q91 62 96 25Q72 42 57 38Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M47 70Q46 88 48 96" fill="none" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<path d="M37 40L25 26m36 13 15-13" fill="none" stroke="'+light+'" stroke-width="4"/>'+
   '<path d="M41 53q8 8 16 0" fill="none" stroke="'+dark+'" stroke-width="3"/>'+dot(40,48,1.8)+dot(58,48,1.8));
 if(id==='af_delfin_jorobado_indico')return wrap(
   '<path d="M12 65Q26 43 53 48L64 39L69 51Q86 57 91 63L77 68Q54 79 35 69L20 78Q23 69 12 65Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M45 49L52 25L61 48Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<path d="M17 62L5 53L10 70L5 82L23 72" fill="'+light+'" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<path d="M51 67L40 80L63 70" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M80 65q8 0 14-5" stroke="'+ink+'" stroke-width="2" fill="none"/>'+dot(78,60,1.5));
 if(id==='af_calao_terrestre')return wrap(
   '<path d="M24 64L10 79L32 70Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<ellipse cx="47" cy="57" rx="23" ry="18" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M35 53q12-9 21 6l-16 12" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M54 47Q57 28 66 28Q81 26 81 43L73 52Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M78 39Q98 37 94 53L77 56L84 47Z" fill="'+light+'" stroke="'+ink+'" stroke-width="2.7"/>'+
   '<path d="M57 77l-4 12m16-12 2 12" stroke="'+ink+'" stroke-width="4"/>'+dot(71,40));
 if(id==='af_macaco_berberia')return wrap(
   '<path d="M20 60Q9 67 12 82" stroke="'+dark+'" stroke-width="5" stroke-linecap="round" fill="none"/>'+
   '<ellipse cx="46" cy="60" rx="24" ry="17" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M28 68l-6 18m30-12 1 14m12-31 13 19" stroke="'+ink+'" stroke-width="5" fill="none" stroke-linecap="round"/>'+
   '<circle cx="67" cy="43" r="16" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<circle cx="51" cy="39" r="7" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<ellipse cx="69" cy="49" rx="10" ry="9" fill="'+light+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M64 56q7 4 13-2" stroke="'+ink+'" stroke-width="2" fill="none"/>'+dot(65,43,1.7)+dot(75,43,1.7));
 if(id==='af_antilope_sable')return wrap(
   '<path d="M24 65L11 72" stroke="'+ink+'" stroke-width="3"/>'+
   '<ellipse cx="42" cy="59" rx="23" ry="15" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M32 70l-2 18m19-18 2 18m12-16 1 16" stroke="'+ink+'" stroke-width="4"/>'+
   '<path d="M56 58L63 36L75 38L84 55L69 67Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M64 38Q50 17 58 6M73 40Q92 16 83 5" fill="none" stroke="'+dark+'" stroke-width="5" stroke-linecap="round"/>'+
   '<path d="M66 55l15 8" fill="none" stroke="'+light+'" stroke-width="4"/>'+dot(76,48,1.8));
 if(id==='af_pangolin_temminck')return wrap(
   '<path d="M20 68Q9 72 6 89Q22 90 29 77" fill="'+dark+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M22 66Q20 42 46 40Q72 43 76 65L65 78Q41 83 22 66Z" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   [30,43,56,68].map(x=>'<path d="M'+x+' 49l-5 10 7 8-7 8" fill="none" stroke="'+dark+'" stroke-width="3"/>').join('')+
   '<path d="M70 58Q85 52 93 65L82 70L72 68" fill="'+light+'" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<path d="M32 78l-4 9m20-7-2 9m17-13 2 10" stroke="'+ink+'" stroke-width="3"/>'+dot(82,60,1.7));
 if(id==='af_martin_malaquita')return wrap(
   '<path d="M30 63L10 85L39 70Z" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>'+
   '<ellipse cx="48" cy="62" rx="19" ry="13" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M34 56q16-10 24 7q-10 12-22 5" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'+
   '<circle cx="63" cy="43" r="11" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>'+
   '<path d="M70 46L96 42L71 51Z" fill="#be8b4a" stroke="'+ink+'" stroke-width="2"/>'+
   '<path d="M44 73l-3 13m14-13 3 13" stroke="'+ink+'" stroke-width="3"/>'+dot(67,40,1.5));
 return null;
}

// Beta 3.15.3 · Identidad visual por familia zoológica.
// Una base gráfica común preserva el estilo; siluetas, máscaras y colas distinguen especies.
function unifiedFamilySprite(id,skin){
 const sp=SPECIES[id];if(!sp)return null;
 const latin=sp.latin||'',name=sp.name.toLocaleLowerCase('es');
 const pangolin=/^(Manis|Phataginus|Smutsia)\b/i.test(latin)||/pangol[ií]n/.test(name);
 const mustelid=/^(Lutra|Lontra|Enhydra|Lutrogale|Hydrictis|Meles|Martes|Mustela|Gulo|Mellivora|Aonyx|Neovison|Pekania)\b/i.test(latin);
 if(!pangolin&&!mustelid)return null;
 const c=applySkin(sp.color,skin);
 const ink='#39332c',dark=shade(c,-30),mid=shade(c,-13),light=shade(c,25);
 const pale=skin==='melanico'?'#647078':'#e8d7b7',eye=eyeColor(skin);
 const shape=(d,fill=c,stroke=ink,w=2.8)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>';
 const line=(d,col=ink,w=3)=>shape(d,'none',col,w);
 const dot=(x,y,r=2,col=eye)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+col+'"/>';
 const wrap=content=>svgWrap(content,alphaGlow(skin));
 if(pangolin){
  const giant=/gigante|gigante|gigante/i.test(name)||/giganteus/i.test(latin);
  const tree=/arb[oó]r|tr[eé]boles|tricusp|tetradactyl/i.test(name+' '+latin);
  // Escamas superpuestas: todas usan la misma retícula, con proporciones y colas diferenciadas.
  const armor=giant?'M22 65Q20 37 47 34Q68 35 74 58Q70 76 43 76Q28 75 22 65Z'
   :tree?'M24 68Q17 45 43 40Q66 39 74 61Q70 76 45 76Q31 75 24 68Z'
   :'M23 66Q21 41 48 38Q69 40 77 60Q71 78 44 77Q29 75 23 66Z';
  const tail=tree
   ?shape('M24 65Q13 71 11 84Q7 94 17 94Q25 94 33 77L36 70Z',dark)
   :giant?shape('M28 68Q15 70 5 84L15 86Q31 81 36 74Z',dark)
   :shape('M27 68Q12 76 9 87L23 89Q36 79 37 72Z',dark);
  const scales=[];
  for(let row=0;row<3;row++)for(let col=0;col<4;col++){
    const x=27+col*11+(row%2?5:0),y=47+row*9;
    if(x>70)continue;
    scales.push(shape('M'+x+' '+y+'q5-5 10 0l-4 8z',row%2?mid:light,dark,1.4));
  }
  return wrap(tail+shape('M36 71l-6 15m30-14 0 14', 'none',ink,4)
   +shape(armor,c)+scales.join('')
   +shape('M68 55Q78 50 91 61Q83 68 76 69L71 65Z',light)
   +shape('M88 63l7 2-7 3z',pale,ink,1.8)+dot(79,59,1.8));
 }
 const otter=/^(Lutra|Lontra|Enhydra|Lutrogale|Hydrictis|Aonyx)\b/i.test(latin);
 const badger=/^(Meles|Mellivora)\b/i.test(latin);
 const wolverine=/^Gulo\b/i.test(latin);
 const marten=/^(Martes|Pekania)\b/i.test(latin);
 const weasel=/^(Mustela|Neovison)\b/i.test(latin);
 const tail=otter?shape('M31 65Q17 65 7 82Q4 87 11 89Q23 79 37 75Z',dark)
  :marten?shape('M31 66Q12 67 9 81Q10 89 19 87Q26 81 35 75Z',dark)
  :badger?shape('M28 67Q15 69 13 76L28 78Z',dark)
  :wolverine?shape('M27 65Q10 64 8 76Q9 86 20 84L32 74Z',dark)
  :shape('M30 66Q14 65 10 79Q12 84 18 84Q23 77 36 73Z',dark);
 const body=badger?'M23 67Q23 47 46 44Q63 45 74 63Q75 77 47 78Q26 78 23 67Z'
  :wolverine?'M22 64Q21 44 43 42Q68 42 76 59Q79 75 56 78Q30 80 22 64Z'
  :otter?'M20 66Q25 49 49 50Q66 47 76 60Q73 73 45 76Q25 77 20 66Z'
  :marten?'M25 64Q26 47 49 47Q66 49 73 61Q70 72 49 75Q30 75 25 64Z'
  :'M25 64Q24 51 49 51Q69 51 75 62Q73 72 45 73Q30 72 25 64Z';
 const head=badger?'M60 47Q73 40 86 54Q91 63 82 69Q73 73 65 64Z'
  :otter?'M65 52Q77 42 88 54Q94 62 84 68Q73 69 66 62Z'
  :wolverine?'M61 47Q79 38 89 53Q95 65 84 69Q72 72 65 62Z'
  :'M64 50Q76 42 88 52Q94 60 84 67Q72 69 65 62Z';
 const ears=otter?'<circle cx="73" cy="49" r="4.5" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'
  :badger?'<circle cx="73" cy="47" r="5" fill="'+dark+'" stroke="'+ink+'" stroke-width="2"/>'
  :'<path d="M70 49l1-9 8 6m2 1 6-8 2 12" fill="'+dark+'" stroke="'+ink+'" stroke-width="2.5"/>';
 const pattern=badger
   ?shape('M67 49L76 43L87 54L86 65L79 65L77 54L71 66L66 60Z',pale,ink,1.2)
   :wolverine?shape('M30 59Q44 49 62 54L72 60Q48 58 32 70Z',light,dark,1.5)
   :marten?shape('M62 61Q70 67 80 63Q68 76 57 67Z',pale,ink,1.2)
   :weasel?shape('M30 67Q51 70 68 62L69 68Q50 78 30 71Z',pale,dark,1.2)
   :shape('M30 68Q50 74 71 61Q66 75 46 75Z',light,dark,1.2);
 const legs=badger||wolverine?line('M36 73l-2 12m21-11 0 11m21-15 1 13',ink,4.8)
  :line('M37 72l-2 12m18-12 1 12m20-18 0 15',ink,3.5);
 const whiskers=otter?line('M81 65l10 1M81 63l10-4M78 66l5 9',ink,1.2):'';
 return wrap(tail+shape(body,c)+pattern+legs+shape(head,c)+ears
   +shape('M80 61Q88 61 93 62L88 68L82 67Z',pale,ink,1.5)
   +whiskers+dot(81,55,1.9)+dot(91,63,1.7,dark));
}

// Beta 3.15.4 · Sprites por taxón antes de los renderizadores genéricos.
function familyV3154Sprite(id,skin){
 const sp=SPECIES[id];if(!sp)return null;
 const latin=sp.latin||'',name=sp.name.toLowerCase(),body=applySkin(sp.color,skin);
 const ink='#36302c',dark=shade(body,-25),light=shade(body,22),eye=eyeColor(skin),glow=alphaGlow(skin);
 if(latin==='Buceros rhinoceros'||latin==='Galemys pyrenaicus')
  return premiumSpeciesSprite(sp.name,sp.kind,body,skin,id);
 if(/^(Naja|Ophiophagus)\b/.test(latin)){
  const king=latin.startsWith('Ophiophagus'),indian=latin==='Naja naja',mozambique=latin==='Naja mossambica';
  const hood=king?20:indian?17:mozambique?15:16;
  const marking=indian
   ?`<ellipse cx="56" cy="36" rx="7" ry="6" fill="none" stroke="${light}" stroke-width="2.5"/><circle cx="56" cy="36" r="2" fill="${dark}"/>`
   :king
    ?`<path d="M40 42l28 0m-25 8l22 0m-18 8l17 0" stroke="${light}" stroke-width="2.4" fill="none"/>`
    :mozambique
     ?`<path d="M42 49q10 8 24 0m-22 7q8 6 18 0" stroke="${dark}" stroke-width="2.5" fill="none"/>`
     :`<path d="M45 48l19 0m-17 8l15 0" stroke="${light}" stroke-width="2.2" fill="none"/>`;
  return svgWrap(`<g data-family="cobra">
    <path d="M10 79Q20 64 34 74Q45 86 64 74Q77 64 70 55" fill="none" stroke="${ink}" stroke-width="16" stroke-linecap="round"/>
    <path d="M10 79Q20 64 34 74Q45 86 64 74Q77 64 70 55" fill="none" stroke="${body}" stroke-width="11" stroke-linecap="round"/>
    <path d="M56 67Q${56-hood} 59 ${56-hood} 40Q${56-hood} 19 56 19Q${56+hood} 19 ${56+hood} 40Q${56+hood} 59 56 67Z" fill="${body}" stroke="${ink}" stroke-width="3"/>
    <path d="M50 31Q56 26 62 31L65 62Q56 68 47 62Z" fill="${light}" opacity=".65"/>
    ${marking}<ellipse cx="56" cy="38" rx="9" ry="8" fill="${body}" stroke="${ink}" stroke-width="2.6"/>
    <circle cx="51" cy="36" r="2.2" fill="${eye}"/><circle cx="61" cy="36" r="2.2" fill="${eye}"/>
    <path d="M56 45l0 8m0 0l-5 3m5-3l5 3" stroke="#9d4a49" fill="none" stroke-width="1.7"/></g>`,glow);
 }
 if(/^Lepus\b/.test(latin)||sp.kind==='hare'){
  const winter=/variable|nival/.test(name),fur=(winter&&skin==='normal')?'#e1ddd5':body;
  const ear=skin==='melanico'?'#5c5557':'#e7bcab';
  return svgWrap(`<g data-family="hare">
   <path d="M19 66Q9 61 10 51" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>
   <ellipse cx="46" cy="64" rx="25" ry="15" fill="${fur}" stroke="${ink}" stroke-width="3"/>
   <path d="M32 74l-10 13m18-11l-3 12m18-14l7 13" stroke="${ink}" stroke-width="4" fill="none"/>
   <circle cx="67" cy="51" r="11" fill="${fur}" stroke="${ink}" stroke-width="3"/>
   <ellipse cx="61" cy="30" rx="5" ry="18" transform="rotate(-12 61 30)" fill="${fur}" stroke="${ink}" stroke-width="2.8"/>
   <ellipse cx="73" cy="30" rx="5" ry="19" transform="rotate(10 73 30)" fill="${fur}" stroke="${ink}" stroke-width="2.8"/>
   <ellipse cx="61" cy="30" rx="2" ry="12" transform="rotate(-12 61 30)" fill="${ear}"/>
   <ellipse cx="73" cy="30" rx="2" ry="12" transform="rotate(10 73 30)" fill="${ear}"/>
   <ellipse cx="69" cy="55" rx="7" ry="4" fill="${light}" opacity=".8"/>
   <circle cx="70" cy="48" r="1.8" fill="${eye}"/>
   <path d="M74 55l10 2m-10 1l8 6" stroke="${dark}" stroke-width="1.5"/></g>`,glow);
 }
 return null;
}

function spriteFor(kind,color,skin,id){
 const mammal3194=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_MAMMAL_ART_V3194==='function') ? globalThis.ATLAS_MAMMAL_ART_V3194(SPECIES[id],color,skin,null,id) : null; if(mammal3194)return mammal3194;
 const bird3193=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_BIRD_ART_V3193==='function') ? globalThis.ATLAS_BIRD_ART_V3193(SPECIES[id],color,skin) : null; if(bird3193)return bird3193;
 const fish3191=(typeof window!=='undefined' && typeof window.ATLAS_FISH_ART_V3191==='function') ? window.ATLAS_FISH_ART_V3191(SPECIES[id],color,skin) : null; if(fish3191)return fish3191;
 const herp3192=(typeof globalThis!=='undefined' && typeof globalThis.ATLAS_HERP_ART_V3192==='function') ? globalThis.ATLAS_HERP_ART_V3192(SPECIES[id],color,skin) : null; if(herp3192)return herp3192;
 const special3154=familyV3154Sprite(id,skin);if(special3154)return special3154;
 const unified=unifiedFamilySprite(id,skin);if(unified)return unified;
 const af310=africaV310Sprite(id,skin);if(af310)return af310;
 const af39=africaV39Sprite(id,skin);if(af39)return af39;
 const polished=polishedSpeciesSprite(id,skin);if(polished)return polished;
 const newAsia=asiaV23Sprite(id,skin);if(newAsia)return newAsia;
 const herp=detailedHerpSprite(id,skin);if(herp)return herp;
 const v22=asiaV22Sprite(id,skin);if(v22)return v22;
 const asian=asianSpeciesSprite(id,skin);
 if(asian)return asian;
 const name=(SPECIES[id]&&SPECIES[id].name)||'';
 const premium=premiumSpeciesSprite(name,kind,color,skin,id);
 if(premium) return premium;
 const outline='#3a3026';
 const familyName=name.toLocaleLowerCase('es');
 const body=color;
 const light=skin==='melanico' ? '#424951' : shade(body,20);
 const dark=skin==='melanico' ? '#08090b' : shade(body,-22);
 const deep=skin==='melanico' ? '#000000' : shade(body,-34);
 const cream=skin==='melanico' ? '#7b858f' : (skin==='albino'?'#ece7dd':'#efe4d2');
 const pale=skin==='melanico' ? '#9ca6ae' : (skin==='albino'?'#f7f5ef':'#f4efe4');
 const accent=skin==='melanico' ? '#2a3037' : shade(body,-6);
 const eye=eyeColor(skin);
 const glow=alphaGlow(skin);
 const legs=(x1,x2,y=72)=>legSet(x1,x2,y);
 const birdLegs=(x1,x2,y=73,c='#7e5b35')=>`<path d="M${x1} ${y}l-3 12m${x2-x1+3} -12l3 12" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
 const wing=(d,fill=dark)=>`<path d="${d}" fill="${fill}" stroke="${outline}" stroke-width="3"/>`;
 const facePatch=(x,y,w,h,fill=cream)=>`<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${fill}"/>`;


 if(kind==='giraffe') return svgWrap('<ellipse cx="46" cy="65" rx="22" ry="13" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M57 62L64 20Q70 15 75 20L72 61Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M64 22l-2-8m10 7 2-8" stroke="'+dark+'" stroke-width="3"/><ellipse cx="75" cy="23" rx="12" ry="7" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M31 72v17m13-16v16m11-16v16m8-20v18" stroke="'+outline+'" stroke-width="3"/><path d="M30 58l9 5m-2-13 8 6m2 4 8 4m8-34 7 2m-8 8 9 2m-11 6 9 1" stroke="'+dark+'" stroke-width="5"/><circle cx="81" cy="20" r="2" fill="'+eye+'"/>',glow);
 if(kind==='zebra') return svgWrap('<ellipse cx="46" cy="62" rx="26" ry="16" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M61 52l8-22 10-1 6 10-12 8-6 18" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M22 55l7 13m5-22 9 27m0-26 6 28m0-26 8 25m6-40 8 10m1-16 6 11" stroke="'+deep+'" stroke-width="5"/><path d="M30 73v16m13-15v16m15-15v16m9-21v19" stroke="'+outline+'" stroke-width="3"/><path d="M20 59l-10 10" stroke="'+deep+'" stroke-width="4"/><circle cx="78" cy="37" r="2" fill="'+eye+'"/>',glow);
 if(kind==='hippo') return svgWrap('<ellipse cx="47" cy="65" rx="29" ry="20" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><ellipse cx="70" cy="59" rx="20" ry="17" fill="'+light+'" stroke="'+outline+'" stroke-width="3"/><path d="M56 48l1-8 10 3m9 1 7-5 3 10" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><ellipse cx="78" cy="68" rx="12" ry="9" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><circle cx="67" cy="52" r="2.5" fill="'+eye+'"/><circle cx="75" cy="65" r="2" fill="'+deep+'"/><circle cx="85" cy="65" r="2" fill="'+deep+'"/><path d="M29 80v9m18-8v8m16-10v10" stroke="'+outline+'" stroke-width="4"/>',glow);
 if(kind==='ostrich') return svgWrap('<ellipse cx="44" cy="58" rx="22" ry="20" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M58 53Q72 36 66 18" stroke="'+light+'" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="66" cy="17" r="7" fill="'+light+'" stroke="'+outline+'" stroke-width="2"/><path d="M70 17l11 2-11 4" fill="#d8b77d" stroke="'+outline+'" stroke-width="1.5"/><path d="M39 75l-3 15m18-16 5 16m-26 0 11 0m10 0h12" fill="none" stroke="'+dark+'" stroke-width="3"/><path d="M28 57l-12-6m13 12-13 1" stroke="'+deep+'" stroke-width="5"/><circle cx="68" cy="15" r="2" fill="'+eye+'"/>',glow);
 if(kind==='lemur') return svgWrap('<path d="M28 63Q11 63 12 39Q14 19 24 18" fill="none" stroke="'+dark+'" stroke-width="10" stroke-linecap="round"/><path d="M21 23l-8 7m8 7-9 7m8 9-8 4" stroke="'+pale+'" stroke-width="5"/><ellipse cx="50" cy="67" rx="19" ry="18" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><circle cx="56" cy="39" r="16" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M42 30l-2-16 12 9m11 1 10-11-1 22" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><ellipse cx="56" cy="45" rx="12" ry="9" fill="'+pale+'"/><circle cx="50" cy="39" r="3" fill="'+eye+'"/><circle cx="62" cy="39" r="3" fill="'+eye+'"/><path d="M48 79v11m13-11v11" stroke="'+outline+'" stroke-width="3"/>',glow);

 if(kind==='cat'){
   const lynx=/lince/i.test(familyName);
   const tail=lynx?`<path d="M24 64q-9 1-13 6q9 4 16 2" fill="${dark}" stroke="${outline}" stroke-width="2.5"/>`:`<path d="M22 63q-10 4-13 12q10 3 17-1q5-3 9-7" fill="none" stroke="${dark}" stroke-width="4.5" stroke-linecap="round"/>`;
   const ears=lynx?`<polygon points="59,40 63,28 69,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="68,40 74,28 78,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><path d="M63 28l-2-4m12 4l2-4" stroke="${cream}" stroke-width="2" stroke-linecap="round"/>`:`<polygon points="59,41 63,30 69,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="68,40 74,30 78,41" fill="${dark}" stroke="${outline}" stroke-width="2.5"/>`;
   const pattern=lynx?`<circle cx="39" cy="58" r="2" fill="${dark}"/><circle cx="50" cy="65" r="2" fill="${dark}"/><circle cx="45" cy="53" r="1.8" fill="${dark}"/>`:`<path d="M36 55l6 8m6-10 4 10m-16 12 7-4m12-2 6-3" stroke="${dark}" stroke-width="2.2" stroke-linecap="round"/>`;
   return svgWrap(`<ellipse cx="46" cy="61" rx="22" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="46" cy="59" rx="9" ry="5" fill="${light}" opacity="0.42"/>${pattern}<ellipse cx="48" cy="67" rx="12" ry="7" fill="${cream}"/><circle cx="67" cy="47" r="11" fill="${body}" stroke="${outline}" stroke-width="3"/>${ears}<ellipse cx="69" cy="52" rx="8" ry="5" fill="${cream}"/><circle cx="70" cy="45" r="1.8" fill="${eye}"/>${tail}${legs(38,53,71)}`,glow);
 }
 if(kind==='boar' || /jabal/i.test(familyName)){
   return svgWrap(`<ellipse cx="45" cy="62" rx="24" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M29 51Q42 38 57 49" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/><path d="M25 54l7-12m5 10l4-11m10 10l4-10" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><circle cx="68" cy="50" r="12" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="76" cy="55" rx="8" ry="6" fill="#b89471" stroke="${outline}" stroke-width="2.5"/><path d="M72 46q2-5 6-5m-10 6q-2-5-6-5" stroke="${cream}" stroke-width="2.3" stroke-linecap="round"/><path d="M76 57l-4 4m8-3l5 2" stroke="#f4ead5" stroke-width="2.4" stroke-linecap="round"/><path d="M23 60q-7 0-11 6" fill="none" stroke="${dark}" stroke-width="4.5" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 }
 if(kind==='hare' || kind==='rabbit' || /liebre|conejo/.test(familyName)){
   const hare = kind==='hare' || /liebre/.test(familyName);
   const winter = /variable/.test(familyName) || /nival/.test(familyName);
   const inner = winter?'#e7dfe0':'#efcaa8';
   const bodyFill = winter && skin!=='melanico' ? '#dddcd6' : body;
   const tail = hare?`<path d="M22 64q-8 3-10 10" stroke="${dark}" stroke-width="4" fill="none" stroke-linecap="round"/>`:`<circle cx="23" cy="63" r="4" fill="${cream}" stroke="${outline}" stroke-width="2"/>`;
   return svgWrap(`<ellipse cx="46" cy="62" rx="22" ry="15" fill="${bodyFill}" stroke="${outline}" stroke-width="3"/><ellipse cx="50" cy="67" rx="11" ry="7" fill="${cream}" opacity="0.95"/><circle cx="66" cy="49" r="11" fill="${bodyFill}" stroke="${outline}" stroke-width="3"/><ellipse cx="60" cy="30" rx="5" ry="16" transform="rotate(-10 60 30)" fill="${bodyFill}" stroke="${outline}" stroke-width="2.6"/><ellipse cx="72" cy="31" rx="5" ry="18" transform="rotate(10 72 31)" fill="${bodyFill}" stroke="${outline}" stroke-width="2.6"/><ellipse cx="60" cy="31" rx="2" ry="11" transform="rotate(-10 60 31)" fill="${inner}"/><ellipse cx="72" cy="32" rx="2" ry="12" transform="rotate(10 72 32)" fill="${inner}"/><circle cx="69" cy="47" r="1.6" fill="${eye}"/>${tail}<path d="M34 58l5 6m10-7 4 8" stroke="${dark}" stroke-width="2.1" stroke-linecap="round"/>${legs(39,52,72)}`,glow);
 }
 if(kind==='canid' && /zorro/.test(familyName)){
   const arctic=/ártico|artico/.test(familyName);
   const bodyFill=arctic && skin!=='melanico' ? '#dfe4ea' : body;
   const flank=arctic && skin!=='melanico' ? '#f4f7fb' : '#f2eee5';
   const earFill=arctic && skin!=='melanico' ? '#c8cfd8' : '#2f2c2a';
   return svgWrap(`<path d="M18 61Q11 49 12 38Q26 45 36 56" fill="${dark}" stroke="${outline}" stroke-width="3"/><ellipse cx="47" cy="60" rx="24" ry="16" fill="${bodyFill}" stroke="${outline}" stroke-width="3"/><path d="M34 56q13-7 26 7q-14 13-24 4z" fill="${light}" stroke="${outline}" stroke-width="2"/><ellipse cx="49" cy="67" rx="12" ry="7" fill="${flank}"/><circle cx="67" cy="45" r="12" fill="${bodyFill}" stroke="${outline}" stroke-width="3"/><polygon points="58,37 63,24 69,37" fill="${earFill}" stroke="${outline}" stroke-width="2.4"/><polygon points="69,37 78,25 80,39" fill="${earFill}" stroke="${outline}" stroke-width="2.4"/><ellipse cx="72" cy="52" rx="8" ry="5" fill="${flank}"/><circle cx="71" cy="44" r="1.8" fill="${eye}"/><path d="M21 58q-11 2-14 12q12 5 22 1q8-4 15-9" fill="none" stroke="${dark}" stroke-width="6" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 }

 if(id==='salamandra_comun' || id==='salamandra_alpina'){
   const spot=id==='salamandra_comun' ? '<circle cx="29" cy="64" r="3" fill="#f0c93f"/><circle cx="44" cy="70" r="3" fill="#f0c93f"/><circle cx="59" cy="62" r="3" fill="#f0c93f"/><circle cx="54" cy="53" r="2.3" fill="#f0c93f"/>' : '';
   return svgWrap(`<path d="M15 66Q28 51 42 58Q50 61 58 55Q68 49 77 56Q84 64 78 73Q70 81 55 77Q40 84 28 79Q17 75 15 66Z" fill="${body}" stroke="#2f2922" stroke-width="3"/>${spot}<circle cx="79" cy="61" r="7" fill="${accent}" stroke="#2f2922" stroke-width="3"/><circle cx="82" cy="59" r="1.7" fill="${eye}"/><path d="M18 65l-9-6m24 14l-8 10m17-11l-4 12m17-18l-2-10" stroke="#2f2922" stroke-width="3" stroke-linecap="round"/>`,glow);
 }
 if(id==='lagarto_ocelado'){
   return svgWrap(`<path d="M13 66Q28 54 43 58Q55 59 63 53Q73 47 83 53Q90 61 83 70Q74 80 59 76Q41 82 25 78Q14 75 13 66Z" fill="${body}" stroke="#2d3a24" stroke-width="3"/><circle cx="30" cy="65" r="2.6" fill="#82c38b"/><circle cx="45" cy="70" r="2.6" fill="#82c38b"/><circle cx="58" cy="61" r="2.6" fill="#82c38b"/><circle cx="53" cy="54" r="2.2" fill="#82c38b"/><circle cx="82" cy="57" r="7" fill="${accent}" stroke="#2d3a24" stroke-width="3"/><circle cx="84" cy="55" r="1.6" fill="${eye}"/><path d="M12 66Q4 67 3 74" fill="none" stroke="#2d3a24" stroke-width="3" stroke-linecap="round"/><path d="M24 66l-7 9m18-4l-4 10m14-10l-3 10m18-17l2-10" stroke="#2d3a24" stroke-width="3" stroke-linecap="round"/>`,glow);
 }
 if(id==='vibora_aspid'){
   return svgWrap(`<path d="M17 69Q29 55 40 57Q52 60 61 53Q70 46 79 50Q88 54 84 65Q81 74 68 72Q56 71 49 75Q38 81 28 78Q17 75 17 69Z" fill="${body}" stroke="#3c3329" stroke-width="3"/><path d="M18 69Q10 70 8 76" fill="none" stroke="#3c3329" stroke-width="3" stroke-linecap="round"/><circle cx="82" cy="58" r="6" fill="${accent}" stroke="#3c3329" stroke-width="3"/><circle cx="84" cy="57" r="1.5" fill="${eye}"/><path d="M30 67q7-4 14 0m8-3q7-4 13 0m-29 8q8-3 15 0m7-3q6-3 12 0" stroke="#6a5541" stroke-width="2.8" fill="none" stroke-linecap="round"/>`,glow);
 }
 if(id==='jabali'){
   return svgWrap(`<ellipse cx="45" cy="61" rx="24" ry="16" fill="${body}" stroke="#342c24" stroke-width="3"/><ellipse cx="41" cy="57" rx="11" ry="6" fill="rgba(255,255,255,.11)"/><circle cx="67" cy="50" r="12" fill="${body}" stroke="#342c24" stroke-width="3"/><ellipse cx="76" cy="54" rx="8" ry="6" fill="#b89471" stroke="#342c24" stroke-width="2.5"/><path d="M74 57l-4 4m8-4l5 3" stroke="#f4ead5" stroke-width="2.6" stroke-linecap="round"/><polygon points="59,43 62,34 67,42" fill="#4b3b2e" stroke="#342c24" stroke-width="2.3"/><circle cx="70" cy="47" r="1.7" fill="${eye}"/><path d="M29 57q-8-7-10-17" fill="none" stroke="#4b3b2e" stroke-width="4" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 }
 if(id==='aguila_real' || id==='aguila_imperial_iberica'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="19" ry="18" fill="${body}" stroke="#342b24" stroke-width="3"/>${wing('M29 58Q17 45 15 33Q29 35 41 48',dark)}${wing('M57 51Q70 38 85 35Q83 49 67 62',light)}<circle cx="56" cy="46" r="10" fill="${accent}" stroke="#342b24" stroke-width="3"/><polygon points="64,49 82,45 66,56" fill="#d2a246" stroke="#342b24" stroke-width="2"/><circle cx="58" cy="45" r="1.8" fill="${eye}"/>${birdLegs(43,53,77)}`,glow);
 }
 if(id==='quebrantahuesos' || id==='buitre_leonado'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="20" ry="17" fill="${body}" stroke="#372e25" stroke-width="3"/>${wing('M28 56Q16 47 12 36Q28 39 39 48',dark)}${wing('M58 51Q71 41 85 39Q82 52 66 61',light)}<circle cx="57" cy="46" r="10" fill="${pale}" stroke="#372e25" stroke-width="3"/><polygon points="65,49 83,47 66,57" fill="#d2a046" stroke="#372e25" stroke-width="2"/><circle cx="59" cy="45" r="1.8" fill="${eye}"/>${birdLegs(44,54,77)}`,glow);
 }
 if(id==='buho_real' || id==='buho_comun'){
   const tufts=id==='buho_real' ? '<path d="M38 32l-5 8m28-8l5 8" stroke="#3a3026" stroke-width="3.4" stroke-linecap="round"/>' : '<path d="M41 35l-3 5m21-5l3 5" stroke="#3a3026" stroke-width="3" stroke-linecap="round"/>';
   return svgWrap(`<ellipse cx="50" cy="58" rx="${id==='buho_real'?'23':'21'}" ry="25" fill="${body}" stroke="#3a3026" stroke-width="3"/><ellipse cx="50" cy="65" rx="10" ry="8" fill="rgba(255,255,255,.12)"/><circle cx="42" cy="51" r="6.5" fill="${pale}"/><circle cx="58" cy="51" r="6.5" fill="${pale}"/><circle cx="42" cy="51" r="2.1" fill="${eye}"/><circle cx="58" cy="51" r="2.1" fill="${eye}"/><polygon points="50,57 46,63 54,63" fill="#d89438"/>${tufts}`,glow);
 }
 if(id==='milano_real'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="18" ry="17" fill="${body}" stroke="#372f27" stroke-width="3"/>${wing('M29 58Q17 45 15 34Q27 37 40 49',dark)}${wing('M57 52Q72 40 85 38Q83 51 68 62',light)}<circle cx="57" cy="46" r="9" fill="${accent}" stroke="#372f27" stroke-width="3"/><polygon points="64,49 80,46 66,55" fill="#d6a14a" stroke="#372f27" stroke-width="2"/><path d="M39 77l8 5 8-5" fill="none" stroke="#6f4b31" stroke-width="3" stroke-linecap="round"/>${birdLegs(44,52,76)}`,glow);
 }
 if(id==='urogallo_comun'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="21" ry="16" fill="${body}" stroke="#3a2f26" stroke-width="3"/><circle cx="64" cy="49" r="9" fill="${body}" stroke="#3a2f26" stroke-width="3"/>${wing('M26 58Q14 48 17 35Q28 38 36 49',dark)}<path d="M20 55Q10 48 9 39" fill="none" stroke="#3a2f26" stroke-width="2.6" stroke-linecap="round"/><circle cx="68" cy="47" r="1.7" fill="${eye}"/><circle cx="71" cy="45" r="2.5" fill="#c74033"/><polygon points="70,51 80,49 71,56" fill="#d5a03b" stroke="#3a2f26" stroke-width="2"/>${birdLegs(44,54,75)}`,glow);
 }
 if(id==='perdiz_nival'){
   return svgWrap(`<ellipse cx="49" cy="60" rx="21" ry="16" fill="${body}" stroke="#3d352d" stroke-width="3"/><circle cx="64" cy="49" r="9" fill="${body}" stroke="#3d352d" stroke-width="3"/>${wing('M27 58Q18 50 18 43Q25 46 34 53',accent)}<circle cx="68" cy="47" r="1.7" fill="${eye}"/><polygon points="70,51 80,49 71,56" fill="#d7a443" stroke="#3d352d" stroke-width="2"/><path d="M35 68q11 5 23 0" stroke="rgba(0,0,0,.10)" stroke-width="3" fill="none"/>${birdLegs(44,54,75,'#8c6e4b')}`,glow);
 }
 if(id==='bisonte_europeo'){
   return svgWrap(`<ellipse cx="44" cy="61" rx="24" ry="17" fill="${body}" stroke="#342b23" stroke-width="3"/><circle cx="64" cy="50" r="11" fill="${accent}" stroke="#342b23" stroke-width="3"/><path d="M31 49Q31 34 43 34Q56 35 57 49" fill="${deep}" stroke="#342b23" stroke-width="3"/><path d="M58 46q8-6 16-2m-18 2q-7-7-15-4" fill="none" stroke="#eadbc1" stroke-width="2.8" stroke-linecap="round"/><circle cx="68" cy="48" r="1.7" fill="${eye}"/>${legs(38,53,73)}<path d="M21 62q-8 3-8 10" fill="none" stroke="#342b23" stroke-width="4" stroke-linecap="round"/>`,glow);
 }
 if(id==='ciguena_negra' || id==='ciguena_blanca'){
   const beak=id==='ciguena_negra' ? '#b74634' : '#cc6f3e';
   const wingFill=id==='ciguena_negra' ? dark : '#2a2a2a';
   const bodyFill=id==='ciguena_blanca' && skin==='normal' ? '#f3efe7' : body;
   return svgWrap(`<ellipse cx="47" cy="60" rx="16" ry="12" fill="${bodyFill}" stroke="#372f29" stroke-width="3"/><circle cx="61" cy="43" r="7" fill="${bodyFill}" stroke="#372f29" stroke-width="3"/><path d="M57 45Q53 28 60 21" fill="none" stroke="#372f29" stroke-width="3" stroke-linecap="round"/><polygon points="66,43 85,41 67,48" fill="${beak}" stroke="#372f29" stroke-width="2"/><path d="M43 71v17m9-17v17" stroke="${beak}" stroke-width="3" stroke-linecap="round"/>${wing('M35 54Q22 45 19 35Q31 38 41 49',wingFill)}`,glow);
 }
 if(id==='alce'){
   return svgWrap(`<ellipse cx="43" cy="61" rx="24" ry="16" fill="${body}" stroke="#3a3027" stroke-width="3"/><circle cx="66" cy="48" r="10" fill="${body}" stroke="#3a3027" stroke-width="3"/><path d="M58 31l-4-11m4 11l-8-5m8 5l-1-8m13 5l7-11m-7 11l7-6m-7 6v-8" stroke="#6a523b" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="69" cy="46" r="1.6" fill="${eye}"/>${legs(37,53,73)}`,glow);
 }
 if(id==='reno'){
   return svgWrap(`<ellipse cx="44" cy="61" rx="23" ry="15" fill="${body}" stroke="#3b3027" stroke-width="3"/><circle cx="66" cy="48" r="10" fill="${body}" stroke="#3b3027" stroke-width="3"/><path d="M58 31l-4-10m4 10l-7-5m7 5l-1-7m14 0l6-10m-6 10l7-5m-7 5l1-8" stroke="#71573d" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M47 66q11 5 17 0" stroke="${cream}" stroke-width="4" fill="none"/>${legs(38,53,73)}`,glow);
 }
 if(id==='oso_pardo'){
   return svgWrap(`<ellipse cx="47" cy="61" rx="24" ry="18" fill="${body}" stroke="#342b23" stroke-width="3"/><circle cx="66" cy="48" r="12" fill="${accent}" stroke="#342b23" stroke-width="3"/><circle cx="58" cy="37" r="4" fill="${deep}" stroke="#342b23" stroke-width="2"/><circle cx="74" cy="37" r="4" fill="${deep}" stroke="#342b23" stroke-width="2"/><path d="M69 50q6 2 8 6q-6 2-10 0" fill="${cream}"/>${legs(39,53,74)}`,glow);
 }
 if(id==='castor_europeo'){
   return svgWrap(`<ellipse cx="46" cy="63" rx="21" ry="14" fill="${body}" stroke="#3a3026" stroke-width="3"/><circle cx="64" cy="54" r="10" fill="${body}" stroke="#3a3026" stroke-width="3"/><circle cx="68" cy="52" r="1.5" fill="${eye}"/><path d="M23 68q-10 1-12 9q9 6 19 2" fill="#75563b" stroke="#3a3026" stroke-width="3"/><path d="M66 58h4" stroke="#f0e7d2" stroke-width="2.3"/>${legs(41,53,73)}`,glow);
 }
 if(id==='pelicano_cenudo'){
   return svgWrap(`<ellipse cx="47" cy="60" rx="18" ry="13" fill="${body}" stroke="#40362f" stroke-width="3"/><circle cx="61" cy="46" r="8" fill="${body}" stroke="#40362f" stroke-width="3"/><path d="M65 48 85 47 71 57 61 55Z" fill="#d39a47" stroke="#40362f" stroke-width="2"/>${birdLegs(46,54,71,'#8e7351')}${wing('M31 56Q20 48 17 37Q30 40 39 49',dark)}`,glow);
 }
 if(id==='petirrojo'){
   return svgWrap(`<ellipse cx="49" cy="61" rx="17" ry="13" fill="${body}" stroke="#392f27" stroke-width="3"/><circle cx="63" cy="49" r="9" fill="${body}" stroke="#392f27" stroke-width="3"/><ellipse cx="56" cy="57" rx="8" ry="9" fill="#d56d47"/><polygon points="70,50 80,47 71,55" fill="#d39b3f" stroke="#392f27" stroke-width="2"/><circle cx="65" cy="47" r="1.5" fill="${eye}"/>${birdLegs(45,52,74)}`,glow);
 }
 if(id==='flamenco_comun'){
   return svgWrap(`<ellipse cx="50" cy="60" rx="18" ry="14" fill="${body}" stroke="#433027" stroke-width="3"/><circle cx="63" cy="45" r="7" fill="${body}" stroke="#433027" stroke-width="3"/><path d="M57 46Q55 28 66 22" fill="none" stroke="#433027" stroke-width="3" stroke-linecap="round"/><polygon points="69,45 82,43 70,50" fill="#1d1d1d" stroke="#433027" stroke-width="2"/><path d="M46 72v15m8-15v15" stroke="#cf8097" stroke-width="3" stroke-linecap="round"/>`,glow);
 }
 if(id==='conejo_europeo' || id==='liebre_variable'){
   const head=id==='liebre_variable'?12:10, bodyW=id==='liebre_variable'?24:21;
   const ears=id==='liebre_variable'
   ? '<path d="M64 46l-4-30q10-8 14 25m0 3l8-27q9-6 8 3l-8 25" fill="'+body+'" stroke="#3c3328" stroke-width="2.5"/>'
   : '<path d="M63 47l-3-18q7-8 11 15m5 2l6-16q8-4 5 6l-5 15" fill="'+body+'" stroke="#3c3328" stroke-width="2.5"/>';
   return svgWrap(`<ellipse cx="47" cy="${id==='liebre_variable'?'67':'66'}" rx="${bodyW}" ry="14" fill="${body}" stroke="#3c3328" stroke-width="3"/><circle cx="${id==='liebre_variable'?'69':'67'}" cy="${id==='liebre_variable'?'57':'56'}" r="${head}" fill="${body}" stroke="#3c3328" stroke-width="3"/>${ears}<circle cx="${id==='liebre_variable'?'73':'71'}" cy="${id==='liebre_variable'?'56':'55'}" r="1.8" fill="${eye}"/>${legs(44,54,74)}`,glow);
 }
 if(id==='ardilla_roja'){
   return svgWrap(`<ellipse cx="53" cy="65" rx="19" ry="17" fill="${body}" stroke="#3c3028" stroke-width="3"/><circle cx="65" cy="46" r="12" fill="${body}" stroke="#3c3028" stroke-width="3"/><path d="M39 64Q13 54 21 30Q30 17 37 29Q28 43 39 47" fill="${body}" stroke="#3c3028" stroke-width="6"/><circle cx="69" cy="44" r="2" fill="${eye}"/><path d="M62 73v13m-11-11v11" stroke="#3c3028" stroke-width="3"/>`,glow);
 }
 if(id==='erizo_europeo'){
   return svgWrap(`<path d="M17 66L20 53L14 48L24 44L21 35L32 39L36 28L44 37L55 30L62 44Q79 43 84 56Q87 70 74 76Q62 82 47 80Q34 81 24 76Q16 72 17 66Z" fill="${body}" stroke="#3a3128" stroke-width="3"/><circle cx="71" cy="59" r="8" fill="${cream}" stroke="#3a3128" stroke-width="3"/><circle cx="74" cy="57" r="1.5" fill="${eye}"/><polygon points="79,61 85,60 80,64" fill="#3a3128"/>`,glow);
 }
 if(id==='martin_pescador'){
   return svgWrap(`<ellipse cx="47" cy="61" rx="16" ry="12" fill="${body}" stroke="#3b3128" stroke-width="3"/><circle cx="61" cy="49" r="8" fill="${body}" stroke="#3b3128" stroke-width="3"/><ellipse cx="53" cy="62" rx="8" ry="5.5" fill="#e18a42"/>${wing('M33 56Q22 48 18 39Q30 42 40 50','#1e7ca6')}<polygon points="67,49 84,46 68,54" fill="#262421" stroke="#3b3128" stroke-width="2"/><circle cx="63" cy="47" r="1.6" fill="${eye}"/>${birdLegs(45,50,74)}`,glow);
 }
 if(id==='foca_monje'){
   return svgWrap(`<ellipse cx="48" cy="62" rx="26" ry="16" fill="${body}" stroke="#33403e" stroke-width="3"/><circle cx="69" cy="55" r="10" fill="${accent}" stroke="#33403e" stroke-width="3"/><ellipse cx="72" cy="58" rx="5" ry="4" fill="${cream}"/><circle cx="71" cy="53" r="1.6" fill="${eye}"/><path d="M22 66q-10 5-13 14q10 2 19-3" fill="none" stroke="#33403e" stroke-width="4.5" stroke-linecap="round"/>`,glow);
 }
 if(id==='abubilla'){
   return svgWrap(`<ellipse cx="48" cy="61" rx="16" ry="12" fill="${body}" stroke="#3f342a" stroke-width="3"/><circle cx="62" cy="49" r="8" fill="${body}" stroke="#3f342a" stroke-width="3"/><path d="M58 39l-2-10m5 10l3-11m1 11l7-9" stroke="#d2a36b" stroke-width="2.8" stroke-linecap="round"/>${wing('M30 57Q20 48 18 39Q28 42 38 50',accent)}<polygon points="67,50 81,47 68,55" fill="#252321" stroke="#3f342a" stroke-width="2"/><circle cx="64" cy="47" r="1.5" fill="${eye}"/>${birdLegs(45,50,74,'#815f38')}`,glow);
 }
 if(id==='abejaruco_europeo'){
   return svgWrap(`<ellipse cx="48" cy="61" rx="17" ry="12" fill="${body}" stroke="#3a3027" stroke-width="3"/><circle cx="62" cy="49" r="8" fill="${body}" stroke="#3a3027" stroke-width="3"/><ellipse cx="51" cy="62" rx="8" ry="5" fill="#d4c056"/>${wing('M31 56Q21 48 18 39Q28 42 39 50','#7ac0ca')}<polygon points="67,50 82,47 68,55" fill="#2b2723" stroke="#3a3027" stroke-width="2"/><circle cx="64" cy="47" r="1.5" fill="${eye}"/>${birdLegs(45,50,74,'#7f5a35')}`,glow);
 }
 if(id==='tortuga_mora'){
   return svgWrap(`<ellipse cx="48" cy="60" rx="20" ry="15" fill="${body}" stroke="#3c3329" stroke-width="3"/><path d="M33 51q14-10 29 0v19q-14 10-29 0z" fill="${shade(body,-10)}" opacity="0.55"/><circle cx="65" cy="56" r="7" fill="${light}" stroke="#3c3329" stroke-width="3"/><circle cx="67" cy="55" r="1.4" fill="${eye}"/><path d="M30 69l-6 6m14 0l-4 8m18-1l4 8m12-18l6 6" stroke="#3c3329" stroke-width="3" stroke-linecap="round"/>`,glow);
 }
 if(id==='zorro_rojo' || id==='lobo_gris' || id==='chacal_dorado'){
   const tailStroke=id==='lobo_gris'?dark:accent;
   const muzzle=id==='chacal_dorado' ? '#dac39b' : cream;
   return svgWrap(`<ellipse cx="46" cy="60" rx="24" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="43" cy="56" rx="11" ry="6" fill="${light}" opacity="0.6"/><ellipse cx="48" cy="66" rx="11" ry="7" fill="${muzzle}" opacity="0.95"/><circle cx="67" cy="45" r="12" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M68 50q5 1 8 6q-5 2-10 0" fill="${muzzle}"/><polygon points="58,37 62,24 68,37" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="69,36 78,25 80,39" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><circle cx="71" cy="44" r="1.8" fill="${eye}"/><path d="M23 57q-9 2-13 12q10 3 17-1q6-4 10-7" fill="none" stroke="${tailStroke}" stroke-width="6" stroke-linecap="round"/><path d="M24 58q-9 2-12 10q8 1 14-2" fill="none" stroke="${light}" stroke-width="2.2" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 }
 if(id==='gato_montes' || id==='lince_boreal' || id==='lince_iberico'){
   const tufts=/lince/.test(id)?'<path d="M58 39l-2-6m18 6l2-6" stroke="#3a3026" stroke-width="2.5" stroke-linecap="round"/>':'';
   const tail=/lince/.test(id)?'<path d="M23 63q-6 2-9 8" stroke="'+dark+'" stroke-width="4.5" fill="none" stroke-linecap="round"/>':'<path d="M23 63q-7 3-10 10" stroke="'+dark+'" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
   return svgWrap(`<ellipse cx="47" cy="61" rx="22" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="46" cy="59" rx="9" ry="5" fill="${light}" opacity="0.5"/><circle cx="67" cy="47" r="11" fill="${body}" stroke="${outline}" stroke-width="3"/><polygon points="59,40 63,29 69,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="68,40 74,29 78,41" fill="${dark}" stroke="${outline}" stroke-width="2.5"/>${tufts}<circle cx="70" cy="45" r="1.8" fill="${eye}"/>${tail}${legs(39,53,70)}`,glow);
 }
 if(id==='nutria_europea'){
   return svgWrap(`<ellipse cx="46" cy="61" rx="27" ry="13" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="45" cy="63" rx="12" ry="5" fill="${light}" opacity="0.55"/><circle cx="72" cy="54" r="10" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M74 55q5 2 7 6q-5 2-9 0" fill="${cream}"/><circle cx="75" cy="51" r="1.6" fill="${eye}"/><path d="M18 61q-7 4-10 12" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>${legs(40,54,69)}`,glow);
 }
 if(id==='garza_real'){
   return svgWrap(`<ellipse cx="47" cy="60" rx="15" ry="12" fill="${body}" stroke="#3c332c" stroke-width="3"/><circle cx="61" cy="43" r="7" fill="${body}" stroke="#3c332c" stroke-width="3"/><path d="M57 44Q53 28 59 22" fill="none" stroke="#3c332c" stroke-width="3" stroke-linecap="round"/><polygon points="66,43 84,41 67,47" fill="#d7a44a" stroke="#3c332c" stroke-width="2"/><path d="M44 71v17m8-17v17" stroke="#7f6a4c" stroke-width="3" stroke-linecap="round"/>${wing('M35 54Q23 45 20 35Q31 39 40 49',dark)}`,glow);
 }
 if(id==='cisne_vulgar'){
   return svgWrap(`<ellipse cx="49" cy="61" rx="19" ry="14" fill="${skin==='normal'?'#f3f2ed':body}" stroke="#3c332c" stroke-width="3"/><circle cx="61" cy="46" r="8" fill="${skin==='normal'?'#f3f2ed':body}" stroke="#3c332c" stroke-width="3"/><path d="M56 47Q55 31 62 24" fill="none" stroke="#3c332c" stroke-width="3" stroke-linecap="round"/><polygon points="67,46 81,44 68,50" fill="#d39839" stroke="#3c332c" stroke-width="2"/>${birdLegs(44,52,73,'#7f5d39')}`,glow);
 }
 // Generic families
 if(kind==='canid') return svgWrap(`<ellipse cx="46" cy="60" rx="24" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="43" cy="56" rx="11" ry="6" fill="${light}" opacity="0.6"/><ellipse cx="48" cy="66" rx="11" ry="7" fill="${cream}" opacity="0.95"/><circle cx="67" cy="45" r="12" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M68 50q5 1 8 6q-5 2-10 0" fill="${cream}"/><polygon points="58,37 62,24 68,37" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="69,36 78,25 80,39" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><circle cx="71" cy="44" r="1.8" fill="${eye}"/><path d="M23 57q-9 2-13 12q10 3 17-1q6-4 10-7" fill="none" stroke="${dark}" stroke-width="5" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 if(kind==='deer'){
   const antlers=/reno/i.test(name)
   ? '<path d="M58 26l-7-12m7 12l-10-6m10 6l-1-10m0 10l-6 8m15 0l8-14m-8 14l10-6m-10 6l1-10m0 10l7 8" stroke="#6b523f" stroke-width="3" stroke-linecap="round" fill="none"/>'
   : /alce/i.test(name)
   ? '<path d="M56 27l-5-10l-7 8m12 2l-10-3m24 3l6-12l8 9m-13 3l11-3" stroke="#6b523f" stroke-width="4" stroke-linecap="round" fill="none"/>'
   : /corzo|ciervo/i.test(name)
   ? '<path d="M58 26l-5-11m5 11l-8-6m8 6l-2-8m14 8l8-13m-8 13l9-7m-9 7l1-9" stroke="#6b523f" stroke-width="3" stroke-linecap="round" fill="none"/>'
   : /cabra|íbice|ibice|rebeco/i.test(name)
   ? '<path d="M61 32q-8-12 0-18m8 20q8-12 2-18" stroke="#6b523f" stroke-width="3.4" stroke-linecap="round" fill="none"/>'
   : '';
   return svgWrap(`<ellipse cx="44" cy="60" rx="24" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="42" cy="57" rx="10" ry="5" fill="${light}" opacity="0.55"/><circle cx="66" cy="46" r="11" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M70 46q8 4 9 10q-7 2-13-2" fill="${cream}"/>${antlers}<circle cx="70" cy="43" r="1.8" fill="${eye}"/>${legs(37,53,72)}`,glow);
 }
 if(kind==='mustelid' || kind==='otter') return svgWrap(`<ellipse cx="46" cy="61" rx="27" ry="13" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="45" cy="63" rx="12" ry="5" fill="${light}" opacity="0.55"/><circle cx="72" cy="54" r="10" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M74 55q5 2 7 6q-5 2-9 0" fill="${cream}"/><circle cx="75" cy="51" r="1.6" fill="${eye}"/><path d="M18 61q-7 4-10 12" stroke="${dark}" stroke-width="5" fill="none" stroke-linecap="round"/>${legs(40,54,69)}`,glow);
 if(kind==='small'){
   if(/murciélago|murcielago/i.test(name)) return svgWrap(`<path d="M15 58q12-16 25-5q8-9 20 0q12-10 25 5q-5 4-12 3q-6-1-13-6q-5 10-10 10q-5 0-10-10q-7 5-13 6q-7 1-12-3z" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="50" cy="52" r="7" fill="${accent}" stroke="${outline}" stroke-width="2.5"/><circle cx="48" cy="51" r="1.2" fill="${eye}"/><circle cx="53" cy="51" r="1.2" fill="${eye}"/>`,glow);
   if(/topo/i.test(name)) return svgWrap(`<ellipse cx="48" cy="62" rx="20" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="66" cy="58" r="9" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="72" cy="60" rx="4" ry="3" fill="#d7b796"/><path d="M34 74l-6 6m17-4l-4 8m16-8l4 8" stroke="#8b7b61" stroke-width="3" stroke-linecap="round"/><circle cx="68" cy="56" r="1.4" fill="${eye}"/>`,glow);
   if(/musaraña|ratón|raton|topillo|lirón|liron|rata/i.test(name)) return svgWrap(`<ellipse cx="49" cy="63" rx="18" ry="13" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="62" cy="53" r="9" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="58" cy="46" r="3.5" fill="${light}" stroke="${outline}" stroke-width="2"/><circle cx="66" cy="47" r="3.5" fill="${light}" stroke="${outline}" stroke-width="2"/><circle cx="65" cy="51" r="1.4" fill="${eye}"/><path d="M28 61q-13-12-6-28" fill="none" stroke="${light}" stroke-width="3" stroke-linecap="round"/>${legs(46,56,72)}`,glow);
   if(/erizo/i.test(name)) return svgWrap(`<ellipse cx="48" cy="61" rx="20" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M30 54l6-10m2 10l4-12m4 12l2-12m7 12l5-11m0 12l7-10" stroke="${dark}" stroke-width="3" stroke-linecap="round"/><circle cx="64" cy="56" r="8" fill="${cream}" stroke="${outline}" stroke-width="3"/><circle cx="67" cy="54" r="1.4" fill="${eye}"/>`,glow);
   if(/ardilla/i.test(name)) return svgWrap(`<ellipse cx="53" cy="65" rx="19" ry="17" fill="${body}" stroke="#3c3028" stroke-width="3"/><circle cx="65" cy="46" r="12" fill="${body}" stroke="#3c3028" stroke-width="3"/><path d="M39 64Q13 54 21 30Q30 17 37 29Q28 43 39 47" fill="${body}" stroke="#3c3028" stroke-width="6"/><circle cx="69" cy="44" r="2" fill="${eye}"/><path d="M62 73v13m-11-11v11" stroke="#3c3028" stroke-width="3"/>`,glow);
   return svgWrap(`<ellipse cx="50" cy="62" rx="18" ry="16" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="62" cy="49" r="10" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="66" cy="46" r="1.8" fill="${eye}"/><ellipse cx="51" cy="67" rx="9" ry="6" fill="${cream}" opacity="0.9"/>${legs(45,55,71)}`,glow);
 }
 if(kind==='seabird') return svgWrap(`<ellipse cx="49" cy="58" rx="19" ry="24" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="50" cy="66" rx="11" ry="12" fill="${pale}"/><polygon points="65,58 84,53 66,65" fill="#ea8b2f" stroke="${outline}" stroke-width="3"/><circle cx="58" cy="48" r="1.5" fill="${eye}"/>${birdLegs(43,52,81,'#c3722d')}`,glow);
 if(kind==='owl') return svgWrap(`<ellipse cx="50" cy="58" rx="22" ry="25" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="42" cy="52" r="6" fill="${pale}"/><circle cx="58" cy="52" r="6" fill="${pale}"/><circle cx="42" cy="52" r="2" fill="${eye}"/><circle cx="58" cy="52" r="2" fill="${eye}"/><polygon points="50,58 46,63 54,63" fill="#d89438"/><path d="M41 32l-4 6m22-6l4 6" stroke="${outline}" stroke-width="3" stroke-linecap="round"/>`,glow);
 if(kind==='cat') return svgWrap(`<ellipse cx="47" cy="61" rx="22" ry="15" fill="${body}" stroke="${outline}" stroke-width="3"/><ellipse cx="46" cy="59" rx="9" ry="5" fill="${light}" opacity="0.5"/><circle cx="67" cy="47" r="11" fill="${body}" stroke="${outline}" stroke-width="3"/><polygon points="59,40 63,29 69,40" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><polygon points="68,40 74,29 78,41" fill="${dark}" stroke="${outline}" stroke-width="2.5"/><circle cx="70" cy="45" r="1.8" fill="${eye}"/><path d="M23 63q-7 3-10 10" stroke="${dark}" stroke-width="4.5" fill="none" stroke-linecap="round"/>${legs(39,53,70)}`,glow);
 if(kind==='bear') return svgWrap(`<ellipse cx="47" cy="61" rx="24" ry="18" fill="${body}" stroke="#342b23" stroke-width="3"/><circle cx="66" cy="48" r="12" fill="${accent}" stroke="#342b23" stroke-width="3"/><circle cx="58" cy="37" r="4" fill="${deep}" stroke="#342b23" stroke-width="2"/><circle cx="74" cy="37" r="4" fill="${deep}" stroke="#342b23" stroke-width="2"/><path d="M69 50q6 2 8 6q-6 2-10 0" fill="${cream}"/>${legs(39,53,74)}`,glow);
 if(kind==='forestbird' || kind==='songbird') return svgWrap(`<ellipse cx="48" cy="61" rx="16" ry="12" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="61" cy="50" r="8" fill="${body}" stroke="${outline}" stroke-width="3"/>${wing('M30 57Q20 49 18 39Q28 42 39 50',accent)}<polygon points="67,51 79,48 68,56" fill="#d08c3b" stroke="${outline}" stroke-width="2"/><circle cx="63" cy="48" r="1.4" fill="${eye}"/>${birdLegs(45,50,74)}`,glow);
 if(kind==='raptor') return svgWrap(`<ellipse cx="48" cy="60" rx="19" ry="18" fill="${body}" stroke="${outline}" stroke-width="3"/>${wing('M29 58Q17 45 15 33Q29 35 41 48',dark)}${wing('M57 51Q70 38 85 35Q83 49 67 62',light)}<circle cx="56" cy="46" r="10" fill="${accent}" stroke="${outline}" stroke-width="3"/><polygon points="64,49 82,45 66,56" fill="#d2a246" stroke="${outline}" stroke-width="2"/><circle cx="58" cy="45" r="1.8" fill="${eye}"/>${birdLegs(43,53,77)}`,glow);
 if(kind==='reptile') return svgWrap(`<path d="M13 66Q28 54 43 58Q55 59 63 53Q72 47 82 53Q90 60 83 69Q74 80 59 76Q40 82 25 77Q14 74 13 66Z" fill="${body}" stroke="#2d3a24" stroke-width="3"/><circle cx="81" cy="57" r="7" fill="${accent}" stroke="#2d3a24" stroke-width="3"/><circle cx="84" cy="55" r="1.6" fill="${eye}"/><path d="M12 66Q4 67 3 74" fill="none" stroke="#2d3a24" stroke-width="3" stroke-linecap="round"/><path d="M23 66l-6 9m17-4l-4 10m14-10l-3 10m18-17l2-10" stroke="#2d3a24" stroke-width="3" stroke-linecap="round"/>`,glow);
 if(kind==='salamander') return svgWrap(`<path d="M16 65Q28 51 42 58Q50 61 58 55Q67 50 76 57Q83 65 77 72Q69 80 54 77Q39 84 27 79Q17 75 16 65Z" fill="${body}" stroke="#2f2922" stroke-width="3"/><circle cx="77" cy="61" r="7" fill="${accent}" stroke="#2f2922" stroke-width="3"/><circle cx="80" cy="59" r="1.8" fill="${eye}"/><path d="M19 64l-9-6m23 14l-7 10m16-11l-4 12m8-19l-2-10" stroke="#2f2922" stroke-width="3" stroke-linecap="round"/>`,glow);
 if(kind==='fish') return svgWrap(`<ellipse cx="45" cy="55" rx="18" ry="11" fill="${body}" stroke="${outline}" stroke-width="3"/><polygon points="25,55 8,43 8,67" fill="${dark}" stroke="${outline}" stroke-width="3"/><path d="M46 44l7-9m-4 17l8 8" stroke="${outline}" stroke-width="2.5" stroke-linecap="round"/><circle cx="57" cy="53" r="1.5" fill="${eye}"/><path d="M35 58q7 4 14 0" fill="none" stroke="#ffffff55" stroke-width="2"/>`,glow);
 if(kind==='rabbit' || kind==='hare') return svgWrap(`<ellipse cx="47" cy="66" rx="21" ry="13" fill="${body}" stroke="#3c3328" stroke-width="3"/><circle cx="67" cy="56" r="10" fill="${body}" stroke="#3c3328" stroke-width="3"/><path d="M63 47l-3-18q7-8 11 15m5 2l6-16q8-4 5 6l-5 15" fill="${body}" stroke="#3c3328" stroke-width="2.5"/><circle cx="71" cy="55" r="1.7" fill="${eye}"/>${legs(44,54,74)}`,glow);
 if(kind==='boar') return svgWrap(`<ellipse cx="46" cy="61" rx="24" ry="16" fill="${body}" stroke="#342c24" stroke-width="3"/><circle cx="68" cy="50" r="12" fill="${body}" stroke="#342c24" stroke-width="3"/><ellipse cx="76" cy="54" rx="8" ry="6" fill="#b89471" stroke="#342c24" stroke-width="2.5"/><path d="M74 57l-4 4m8-4l5 3" stroke="#f4ead5" stroke-width="2.6" stroke-linecap="round"/>${legs(38,54,72)}`,glow);
 if(kind==='bison') return svgWrap(`<ellipse cx="44" cy="61" rx="24" ry="17" fill="${body}" stroke="#342b23" stroke-width="3"/><circle cx="64" cy="50" r="11" fill="${accent}" stroke="#342b23" stroke-width="3"/><path d="M31 49Q31 34 43 34Q56 35 57 49" fill="${deep}" stroke="#342b23" stroke-width="3"/>${legs(38,53,73)}`,glow);
 if(kind==='beaver') return svgWrap(`<ellipse cx="46" cy="63" rx="21" ry="14" fill="${body}" stroke="#3a3026" stroke-width="3"/><circle cx="64" cy="54" r="10" fill="${body}" stroke="#3a3026" stroke-width="3"/><path d="M23 68q-10 1-12 9q9 6 19 2" fill="#75563b" stroke="#3a3026" stroke-width="3"/>${legs(41,53,73)}`,glow);
 if(kind==='stork' || kind==='heron' || kind==='pelican' || kind==='swan' || kind==='wader' || kind==='kingfisher' || kind==='tortoise') return svgWrap(`<ellipse cx="50" cy="60" rx="18" ry="14" fill="${body}" stroke="${outline}" stroke-width="3"/><circle cx="64" cy="48" r="8" fill="${body}" stroke="${outline}" stroke-width="3"/><path d="M58 50q0-13 8-20" fill="none" stroke="${outline}" stroke-width="3" stroke-linecap="round"/><polygon points="71,49 85,46 72,54" fill="#d2a046" stroke="${outline}" stroke-width="2"/>${birdLegs(44,53,74)}`,glow);
 // Ninguna especie debe degradarse a un círculo vacío: familias sin retrato
 // específico utilizan una silueta reconocible, conservando SVG y variantes.
 if(kind==='snake')return svgWrap('<path d="M11 78Q8 55 29 59Q47 63 41 43Q36 25 57 30Q72 34 70 51Q69 64 84 57Q94 54 93 45" fill="none" stroke="'+outline+'" stroke-width="14" stroke-linecap="round"/><path d="M11 78Q8 55 29 59Q47 63 41 43Q36 25 57 30Q72 34 70 51Q69 64 84 57Q94 54 93 45" fill="none" stroke="'+body+'" stroke-width="9" stroke-linecap="round"/><path d="M89 42l8-8m-8 8 8 2" fill="none" stroke="'+dark+'" stroke-width="2"/><circle cx="91" cy="40" r="1.6" fill="'+eye+'"/>',glow);
 if(kind==='lizard')return svgWrap('<path d="M31 64Q15 70 7 84" fill="none" stroke="'+dark+'" stroke-width="7" stroke-linecap="round"/><ellipse cx="45" cy="60" rx="23" ry="12" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M62 55Q80 44 91 51L91 61Q78 69 62 65Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M33 68l-15 13m30-11-10 14m13-30 3-13m17 15 8-14" fill="none" stroke="'+outline+'" stroke-width="3"/><circle cx="84" cy="53" r="2" fill="'+eye+'"/>',glow);
 if(kind==='pangolin')return svgWrap('<path d="M18 66Q9 72 5 89Q19 90 29 73" fill="'+dark+'" stroke="'+outline+'" stroke-width="3"/><path d="M23 67Q23 41 48 39Q66 40 73 65L62 77Q42 82 23 67Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/>'+[31,43,55,67].map(x=>'<path d="M'+x+' 46l-6 10 7 9-6 10" fill="none" stroke="'+dark+'" stroke-width="3"/>').join('')+'<path d="M67 60Q82 53 94 66L80 70Z" fill="'+light+'" stroke="'+outline+'" stroke-width="3"/><path d="M32 77l-5 10m25-10-3 10" stroke="'+outline+'" stroke-width="4"/><circle cx="83" cy="62" r="1.6" fill="'+eye+'"/>',glow);
 if(kind==='primate')return svgWrap('<path d="M19 64Q9 70 14 83" fill="none" stroke="'+dark+'" stroke-width="5"/><ellipse cx="46" cy="60" rx="23" ry="17" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M28 70l-8 16m31-12 0 14m15-30 15 17" fill="none" stroke="'+outline+'" stroke-width="5"/><circle cx="67" cy="43" r="15" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><circle cx="52" cy="41" r="6" fill="'+dark+'" stroke="'+outline+'" stroke-width="2"/><ellipse cx="69" cy="49" rx="9" ry="8" fill="'+cream+'"/><circle cx="65" cy="43" r="2" fill="'+eye+'"/><circle cx="75" cy="43" r="2" fill="'+eye+'"/>',glow);
 if(kind==='camel')return svgWrap('<path d="M19 64Q22 45 33 47Q36 26 43 33L50 46Q59 27 66 36L72 54L82 39L87 45L89 62Q70 71 45 69Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M26 67l-2 22m19-22 1 22m21-21-1 21" stroke="'+outline+'" stroke-width="4"/><path d="M84 40l7-8 4 15" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><circle cx="89" cy="42" r="1.8" fill="'+eye+'"/>',glow);
 if(kind==='elephant')return svgWrap('<ellipse cx="44" cy="58" rx="27" ry="20" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M29 72l-2 16m22-16 1 16" stroke="'+outline+'" stroke-width="7"/><ellipse cx="64" cy="50" rx="15" ry="20" fill="'+light+'" stroke="'+outline+'" stroke-width="3"/><path d="M72 43Q91 36 89 60Q86 80 97 81" stroke="'+body+'" stroke-width="11" fill="none"/><path d="M72 43Q91 36 89 60Q86 80 97 81" stroke="'+outline+'" stroke-width="2" fill="none"/><circle cx="79" cy="44" r="2" fill="'+eye+'"/>',glow);
 if(kind==='rhino')return svgWrap('<ellipse cx="43" cy="61" rx="28" ry="20" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M30 74l-2 14m25-14 3 14" stroke="'+outline+'" stroke-width="7"/><path d="M60 48L83 44L93 59L85 75L63 73Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M81 50L88 29L93 57Z" fill="'+pale+'" stroke="'+outline+'" stroke-width="2"/><circle cx="77" cy="53" r="2" fill="'+eye+'"/>',glow);
 if(kind==='crocodile')return svgWrap('<path d="M28 58Q14 54 5 72Q20 68 30 75L70 75L96 65L94 55L70 54Q46 42 28 58Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M28 56l5-9 5 7 5-8 6 8 6-7 6 8" fill="none" stroke="'+dark+'" stroke-width="3"/><path d="M38 73l-9 11m28-11 6 11" stroke="'+outline+'" stroke-width="4"/><path d="M75 65h18" stroke="'+dark+'" stroke-width="2"/><circle cx="79" cy="56" r="2" fill="'+eye+'"/>',glow);
 if(kind==='sirenian'||kind==='cetacean'||kind==='ray'){
  if(kind==='ray')return svgWrap('<path d="M49 35Q27 41 6 28Q11 65 41 72L49 79L60 72Q90 65 96 28Q73 42 49 35Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M49 75l-1 21" stroke="'+outline+'" stroke-width="3"/><circle cx="41" cy="48" r="2" fill="'+eye+'"/><circle cx="58" cy="48" r="2" fill="'+eye+'"/>',glow);
  return svgWrap('<path d="M13 64Q29 41 55 48L65 39L69 51Q89 57 94 65L74 73Q51 80 33 70L17 76Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M46 49l7-21 9 22Z" fill="'+dark+'" stroke="'+outline+'" stroke-width="2"/><path d="M17 63L7 51L9 68L5 82L24 72" fill="'+light+'" stroke="'+outline+'" stroke-width="2"/><circle cx="79" cy="61" r="2" fill="'+eye+'"/>',glow);
 }
 // Última defensa visual para futuros kinds: mamífero de perfil, no círculo.
 return svgWrap('<path d="M18 65L8 75" stroke="'+dark+'" stroke-width="4" fill="none"/><ellipse cx="43" cy="60" rx="24" ry="15" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M30 70l-3 18m23-17 2 17" stroke="'+outline+'" stroke-width="4"/><path d="M61 54L65 34L82 39L92 56L83 66L65 64Z" fill="'+body+'" stroke="'+outline+'" stroke-width="3"/><path d="M65 37l-7-10m18 12 8-10" stroke="'+dark+'" stroke-width="3"/><circle cx="78" cy="48" r="2" fill="'+eye+'"/>',glow);
}


const MUSEUM_RELICTS=[
 {id:'coelacanth_indic',name:'Celacanto del Índico',latin:'Latimeria chalumnae',icon:'🐟',region:'HX-10-12',habitats:['costa'],times:['atardecer','noche'],desc:'Pez de linaje muy antiguo; hallazgo costero excepcional.',shape:'fish'},
 {id:'atlas_lion',name:'León del Atlas',latin:'Panthera leo leo',icon:'🦁',region:'HX-06-08',habitats:['montana','estepa'],times:['amanecer','atardecer','noche'],desc:'Población histórica norteafricana, desaparecida de la naturaleza en la actualidad.',shape:'lion'},
 {id:'seychelles_sheathbat',name:'Murciélago de Seychelles',latin:'Coleura seychellensis',icon:'🦇',region:'HX-07-14',habitats:['bosque'],times:['atardecer','noche'],desc:'Murciélago insular muy amenazado, de detección excepcional.',shape:'bat'},
 {id:'gabon_dwarf_croc',name:'Cocodrilo enano africano',latin:'Osteolaemus tetraspis',icon:'🐊',region:'HX-08-10',habitats:['rio','bosque','humedal'],times:['atardecer','noche'],desc:'Crocodílido forestal de distribución restringida.',shape:'croc'},
 {id:"angonoka",name:"Tortuga angonoka",latin:"Astrochelys yniphora",icon:"🐢",region:"HX-09-14",habitats:["bosque","pradera"],times:["amanecer","dia","atardecer"],desc:"Tortuga endémica de Madagascar y gravemente amenazada; relicto insular extraordinario.",shape:"tortoise"},
 {id:"african_lungfish",name:"Pez pulmonado africano",latin:"Protopterus aethiopicus",icon:"🐟",region:"HX-09-11",habitats:["humedal"],times:["amanecer","atardecer","noche"],desc:"Pez de linaje antiguo capaz de respirar aire; hallazgo museístico extraordinario.",shape:"lungfish"},
 {id:"white_sturgeon",name:"Esturión blanco del Pacífico",latin:"Acipenser transmontanus",icon:"🐟",region:"HX-02-02",habitats:["rio"],times:["amanecer","atardecer","noche"],desc:"Linaje muy antiguo de peces; archivo de observaciones fluviales en Columbia Británica.",shape:"sturgeon"},
 {id:"gharial",name:"Gavial del Ganges",latin:"Gavialis gangeticus",icon:"🐊",region:"HX-05-16",habitats:["rio"],times:["amanecer","dia","atardecer"],desc:"Crocodiliano de hocico estrecho y linaje singular; registros excepcionales de ríos del subcontinente indio.",shape:"gharial"},
 {id:"olm_balkans",name:"Proteo de las cuevas",latin:"Proteus anguinus",icon:"🦎",region:"HX-03-12",habitats:["bosque"],times:["noche"],desc:"Anfibio cavernícola de los sistemas kársticos balcánicos; se investiga mediante registros subterráneos, no por aparición superficial.",shape:"olm"}
];
// Beta 3.17 · Yacimientos de investigación, sin sustituir las expediciones originales.
const MUSEUM_DIG_SITES=[
 {id:'british_cliffs',name:'Estratos de las Islas Británicas',region:'HX-01-09',seconds:180,money:55,knowledge:15,fragments:[2,3],tooth:0.12,track:0.24,claw:0.03,skull:0.004},
 {id:'alpine_basin',name:'Cuenca sedimentaria alpina',region:'HX-02-09',seconds:300,money:135,knowledge:45,fragments:[3,5],tooth:0.20,track:0.32,claw:0.075,skull:0.009},
 {id:'namib_rocks',name:'Estratos del desierto del Namib',region:'HX-11-08',seconds:540,money:550,knowledge:160,fragments:[5,8],tooth:0.30,track:0.43,claw:0.13,skull:0.025,reqResearch:'africa_1'},
 {id:'canadian_rocks',name:'Sedimentos de Columbia Británica',region:'HX-02-02',seconds:660,money:750,knowledge:225,fragments:[6,9],tooth:0.32,track:0.50,claw:0.16,skull:0.035,reqResearch:'norteamerica_1'}
];
function museumCardArt(kind,id){
 const frame=(paths)=>'<svg viewBox="0 0 100 100" aria-hidden="true">'+paths+'</svg>';
 if(id==='ankylosaurus_mount')return frame(
  '<path d="M20 64Q37 41 65 49Q85 55 80 70L43 75Z" fill="#d9c19a" stroke="#795d41" stroke-width="4"/>'+
  '<path d="M29 49l7-16 10 17 9-21 10 22 11-11" fill="#bea17a" stroke="#795d41" stroke-width="3"/>'+
  '<path d="M34 72l-4 15m17-14-1 14m15-15 3 14" stroke="#846647" stroke-width="6" fill="none"/>'+
  '<path d="M21 63Q10 61 9 74L4 81" stroke="#896a4d" stroke-width="7" fill="none"/>'+
  '<ellipse cx="9" cy="80" rx="8" ry="6" fill="#cbb28d" stroke="#72573e" stroke-width="3"/>'+
  '<path d="M75 55l14-5 8 12-10 9-11-4Z" fill="#dfc9a3" stroke="#785c40" stroke-width="3"/>');
 if(id==='iguanodon_mount')return frame(
  '<path d="M17 53Q40 35 63 49L73 42Q87 36 95 47L85 59L62 62 39 66Z" fill="#d4b994" stroke="#775d42" stroke-width="4"/>'+
  '<path d="M23 56L6 69M40 64l-8 24 15 0m16-30 8 30 13 0" fill="none" stroke="#85694b" stroke-width="6" stroke-linecap="round"/>'+
  '<path d="M53 53l5 21 10 3m-10-3 4-9m-23-15 9 11" stroke="#765e44" stroke-width="4" fill="none"/>'+
  '<path d="M76 39l8-9 13 5-1 13-12 7-9-5Z" fill="#e2cba5" stroke="#765a42" stroke-width="3"/>'+
  '<circle cx="91" cy="40" r="2" fill="#5b452f"/>');
 if(id==='huellas_teropodos')return frame(
  '<rect x="14" y="16" width="72" height="70" rx="8" fill="#e1d0ad" stroke="#896d4e" stroke-width="4"/>'+
  '<path d="M46 56L29 32m17 24-1-34m1 34 19-25m-19 25 3 16" stroke="#946e50" stroke-width="9" stroke-linecap="round"/>'+
  '<path d="M25 77h50" stroke="#a68e68" stroke-width="3"/>');
 if(id==='sedimentos_estratos')return frame(
  '<path d="M14 25h72v51H14z" fill="#e4d5b6" stroke="#8c7453" stroke-width="3"/>'+
  '<path d="M15 35h70m-70 13h70m-70 13h70m-70 13h70" stroke="#a58b66" stroke-width="6"/>'+
  '<path d="M40 38q11-12 20 0q-8 15-20 0m0 22q10-11 21 0" fill="none" stroke="#665949" stroke-width="4"/>');
 if(id==='pachycephalosaurus_mount')return frame(
  '<path d="M9 59Q31 45 56 52L69 48 75 60 59 70 32 70Z" fill="none" stroke="#856f50" stroke-width="7"/>'+
  '<path d="M13 59L3 49m39 22-4 18m17-20 7 20" fill="none" stroke="#997b55" stroke-width="6" stroke-linecap="round"/>'+
  '<path d="M69 49Q63 26 84 19Q98 19 98 35L94 54L79 61Z" fill="#e4cba3" stroke="#8c6b46" stroke-width="4"/>'+
  '<path d="M72 32Q84 17 95 29" fill="none" stroke="#fff0ca" stroke-width="4"/>'+
  '<path d="M61 56l9 11m-27-15 5 12m-20-9 8 11" fill="none" stroke="#d6b88d" stroke-width="4"/>'+
  '<circle cx="90" cy="40" r="2.5" fill="#473729"/>');
 if(id==='carnotaurus_mount')return frame(
  '<path d="M9 60Q30 43 57 53L67 43 78 45 91 52 82 61 54 71 27 68Z" fill="none" stroke="#80684c" stroke-width="7"/>'+
  '<path d="M23 63L6 80m32-11-7 22m26-21 7 20m-20-38 7 15m0-13 8 13" fill="none" stroke="#ac8c63" stroke-width="5"/>'+
  '<path d="M68 38L83 29L97 35L97 51L81 58L68 49Z" fill="#e0c69e" stroke="#816548" stroke-width="3"/>'+
  '<path d="M78 32l-4-12 13 10m0 1 9-11-2 15" stroke="#dbc19b" stroke-width="5" fill="none"/>'+
  '<path d="M77 53L91 53" stroke="#765a40" stroke-width="3"/><circle cx="89" cy="40" r="2" fill="#53402b"/>');
 if(id==='trex_mount')return frame(
  '<path d="M14 42Q33 16 57 35L73 25 85 31 76 42 60 47 39 52 22 48" fill="none" stroke="#73583d" stroke-width="7" stroke-linecap="round"/>'+
  '<path d="M31 51L20 86m26-36 2 32m-29 3 16 1m5-3 16 1" fill="none" stroke="#785b3b" stroke-width="6" stroke-linecap="round"/>'+
  '<path d="M35 44l3 18m4-21 7 18m2-20 6 15m-25-7-23 8" fill="none" stroke="#c7a67b" stroke-width="4"/>'+
  '<path d="M70 24Q83 12 96 24L89 39 75 38Z" fill="#d8c29d" stroke="#74583d" stroke-width="3"/>'+
  '<circle cx="88" cy="26" r="3" fill="#654d36"/>');
 if(id==='carta_historica')return frame(
  '<path d="M18 20L39 25 62 17 84 22V78L62 72 39 80 18 74Z" fill="#e2cf9e" stroke="#8d764a" stroke-width="4"/>'+
  '<path d="M39 25v54m23-62v55" fill="none" stroke="#b09b6e" stroke-width="2"/>'+
  '<path d="M27 60l10-18 15 7 15-20 8 9" fill="none" stroke="#597c69" stroke-width="4"/>'+
  '<path d="M59 50l16 17m0-17-16 17" stroke="#9a654a" stroke-width="3"/>');
 if(id==='medallon_viajero')return frame(
  '<path d="M43 22v-9h14v9" fill="none" stroke="#a57b40" stroke-width="5"/>'+
  '<circle cx="50" cy="55" r="30" fill="#d8b66e" stroke="#927039" stroke-width="6"/>'+
  '<circle cx="50" cy="55" r="23" fill="#efdb9f" stroke="#9d8249" stroke-width="2"/>'+
  '<path d="M34 64q16-36 32 0m-26 4 10-23 10 23" fill="none" stroke="#6d7b53" stroke-width="4"/>');
 if(id==='huella_paleontologica')return frame(
  '<path d="M27 57Q20 44 32 37Q45 40 45 59Q41 77 29 74Q24 71 27 57Z" fill="#94745b" stroke="#5a4735" stroke-width="3"/>'+
  '<circle cx="22" cy="31" r="6" fill="#94745b"/><circle cx="33" cy="25" r="7" fill="#94745b"/><circle cx="44" cy="31" r="6" fill="#94745b"/>'+
  '<path d="M64 72q-8-24 6-30 16 4 12 29" fill="#b69a76" stroke="#705b44" stroke-width="3"/>'+
  '<circle cx="60" cy="35" r="5" fill="#b69a76"/><circle cx="72" cy="31" r="6" fill="#b69a76"/><circle cx="84" cy="35" r="5" fill="#b69a76"/>');
 if(id==='fosil_catalogado')return frame(
  '<path d="M21 36Q10 27 18 20Q28 16 34 25L65 60Q77 54 85 62Q95 75 82 78Q74 88 65 79L34 45Q21 48 21 36Z" fill="#d8bb90" stroke="#796044" stroke-width="4"/>'+
  '<path d="M39 45L62 67" fill="none" stroke="#fff0cc" stroke-width="3"/>');
 if(id==='triceratops_mount')return frame("<path d=\"M11 59Q28 39 53 48L72 46 81 59 61 72 30 67Z\" fill=\"none\" stroke=\"#73593b\" stroke-width=\"6\"/><path d=\"M22 67l-5 22m21-20v20m20-20 5 20\" stroke=\"#94795a\" stroke-width=\"6\"/><path d=\"M70 40L84 25L94 35L91 58L76 63L66 51Z\" fill=\"#d8bf97\" stroke=\"#6a533c\" stroke-width=\"3\"/><path d=\"M77 38l-6-21m15 20 3-20m3 37 8-8\" stroke=\"#decca9\" stroke-width=\"5\"/><path d=\"M37 47l5 20m10-18 1 18\" stroke=\"#d2b48a\" stroke-width=\"3\"/>");
 if(id==='stegosaurus_mount')return frame("<path d=\"M13 62Q27 43 58 50L80 61L67 70L30 72Z\" fill=\"none\" stroke=\"#785d3f\" stroke-width=\"6\"/><path d=\"M19 52L26 26L38 48L47 17L58 49L70 34L77 60\" fill=\"#c4a477\" stroke=\"#886b49\" stroke-width=\"3\"/><path d=\"M30 69l-5 20m20-19-2 20m22-19 3 18\" stroke=\"#866746\" stroke-width=\"6\"/><path d=\"M18 63L4 48m14 20-15 10\" stroke=\"#9a7651\" stroke-width=\"4\"/><circle cx=\"75\" cy=\"61\" r=\"2\" fill=\"#5e4933\"/>");
 if(id==='spinosaurus_mount')return frame("<path d=\"M8 58Q30 36 56 49L70 40L89 51L95 64L73 62L47 70L24 67Z\" fill=\"none\" stroke=\"#73583f\" stroke-width=\"6\"/><path d=\"M24 44L28 15L39 42L45 9L52 45L60 23L66 46\" fill=\"#ceb28a\" stroke=\"#785c44\" stroke-width=\"3\"/><path d=\"M33 67L29 89m29-22 6 22\" stroke=\"#8a7051\" stroke-width=\"6\"/><path d=\"M75 43L89 32L98 43L95 52L79 50Z\" fill=\"#dac4a4\" stroke=\"#71583e\" stroke-width=\"3\"/><circle cx=\"91\" cy=\"40\" r=\"2\" fill=\"#42372e\"/>");
 if(id==='astrolabio_laton')return frame("<path d=\"M50 15V6M40 17h20\" stroke=\"#87643d\" stroke-width=\"4\"/><circle cx=\"50\" cy=\"53\" r=\"31\" fill=\"none\" stroke=\"#ad884b\" stroke-width=\"7\"/><circle cx=\"50\" cy=\"53\" r=\"22\" fill=\"#ebd399\" stroke=\"#917042\" stroke-width=\"2\"/><path d=\"M20 53h60M50 23v60m-16-14 32-32m-28-4 26 41\" stroke=\"#7e6949\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"53\" r=\"4\" fill=\"#947543\"/>");
 if(id==='diario_explorador')return frame("<path d=\"M24 15H76L83 23V83H30Q18 83 18 71V25Q18 15 24 15Z\" fill=\"#a57d57\" stroke=\"#624a37\" stroke-width=\"4\"/><path d=\"M31 21h44v56H31Z\" fill=\"#e3d3a9\" stroke=\"#897558\" stroke-width=\"2\"/><path d=\"M42 32h24M42 42h22M42 52h27M42 62h17\" stroke=\"#8a8266\" stroke-width=\"2.5\"/><path d=\"M28 16v64\" stroke=\"#614734\" stroke-width=\"5\"/><path d=\"M65 20v25l-6-6-6 6V20\" fill=\"#678b75\"/>");
 if(id==='globo_cartografico')return frame("<circle cx=\"50\" cy=\"41\" r=\"27\" fill=\"#a3c7bf\" stroke=\"#617a70\" stroke-width=\"3\"/><path d=\"M30 33l12-10 10 8-5 17-12 3m18-21 13-6 9 12-12 13 3 11-14 5\" fill=\"#b2b58a\" stroke=\"#798b67\" stroke-width=\"2\"/><path d=\"M50 14v54M23 41h54M33 19q32 40 33 45\" stroke=\"#568c91\" stroke-width=\"2\" fill=\"none\"/><path d=\"M76 25Q89 66 54 77m-4-8v18m-17 3h35\" stroke=\"#82623e\" stroke-width=\"5\" fill=\"none\"/>");
 const animal=MUSEUM_RELICTS.find(r=>r.id===id);
 if(!animal)return frame('<path d="M15 80L50 18L85 80Z" fill="#b6a17f" stroke="#594935" stroke-width="4"/>');

 if(animal.shape==='sturgeon')return frame(
  '<path d="M16 54L7 37 10 55 6 77 22 61Q46 74 78 57L92 49Q78 39 51 42Z" fill="#a8aa8a" stroke="#546053" stroke-width="4"/>'+
  '<path d="M29 43L35 28L42 43 50 28 56 43 65 32 68 45" fill="#d2c49c" stroke="#596452" stroke-width="3"/>'+
  '<path d="M23 54h51m-44 9h34" fill="none" stroke="#d9d0ac" stroke-width="3"/>'+
  '<path d="M77 58l15 3" stroke="#64705d" stroke-width="2"/><circle cx="80" cy="48" r="2" fill="#273830"/>');
 if(animal.shape==='gharial')return frame(
  '<path d="M12 61Q29 39 56 43L68 53Q83 52 96 58L98 67 62 65Q33 78 12 61Z" fill="#718b65" stroke="#3c503b" stroke-width="4"/>'+
  '<path d="M70 53L95 53m-25 7 25 2" stroke="#d5d1a2" stroke-width="3"/>'+
  '<path d="M20 48l7-7 6 7 6-8 9 8 8-7m-30 27-11 13m32-12 10 13" stroke="#4d6549" stroke-width="4" fill="none"/>'+
  '<circle cx="59" cy="49" r="3" fill="#c5b882"/><circle cx="60" cy="48" r="1.4" fill="#203328"/>');
 if(animal.shape==='olm')return frame(
  '<path d="M10 59Q31 43 52 50Q67 54 77 45Q90 40 94 52Q96 68 81 67Q70 57 57 66Q31 80 10 59Z" fill="#e9d0c4" stroke="#b29389" stroke-width="4"/>'+
  '<path d="M50 66l-14 17m23-17 7 17m-45-25L9 45m24 13-8-16" stroke="#b29389" stroke-width="4" fill="none"/>'+
  '<path d="M79 45l-9-13m13 12-2-16m6 18 9-13" stroke="#b65e67" stroke-width="4" fill="none"/>'+
  '<circle cx="87" cy="53" r="1.5" fill="#675454"/>');
 if(animal.shape==='tortoise')return frame('<path d="M24 70l-5 16m28-12-3 14m27-18 5 15" stroke="#796048" stroke-width="7"/><path d="M19 67Q19 34 49 33Q78 37 78 70Q54 83 24 75Z" fill="#bfa86a" stroke="#67543e" stroke-width="4"/><path d="M28 50l19 6 13-12M47 56l8 17m5-29 14 17" stroke="#806847" stroke-width="3"/><path d="M76 59Q89 54 96 64L87 75L75 69Z" fill="#9b9c7b" stroke="#62543d" stroke-width="3"/><circle cx="88" cy="61" r="2" fill="#272b24"/>');
 if(animal.shape==='lungfish')return frame('<path d="M13 62Q24 40 57 46Q81 42 93 57Q73 73 51 71Q28 68 13 62Z" fill="#8b846d" stroke="#525142" stroke-width="4"/><path d="M25 56L11 37L17 60L9 82L30 65m30-20 11-19 4 22" fill="#a3a084" stroke="#57543f" stroke-width="3"/><path d="M48 68q-10 18-24 19m24-19q8 16 29 19" fill="none" stroke="#53503e" stroke-width="3"/><circle cx="81" cy="54" r="2" fill="#373a2e"/>');
 if(animal.shape==='fish')return frame(
  '<path d="M25 48L9 30L13 50L8 73L28 60Q50 69 79 55L94 50L78 42Q53 31 25 48Z" fill="#617f79" stroke="#394b4d" stroke-width="4"/>'+
  '<path d="M35 46L44 23L61 42m-15 20-8 16 22-15" fill="#819c8f" stroke="#394b4d" stroke-width="3"/>'+
  '<path d="M31 52q17-11 38 0" fill="none" stroke="#c1c69b" stroke-width="3"/><circle cx="81" cy="48" r="2.5" fill="#202e31"/>');
 if(animal.shape==='lion')return frame(
  '<ellipse cx="46" cy="61" rx="27" ry="17" fill="#b89564" stroke="#63462f" stroke-width="3"/>'+
  '<path d="M24 70l-3 17m25-11-1 12m18-15 5 15m-45-29Q9 44 12 35" fill="none" stroke="#63462f" stroke-width="5"/>'+
  '<path d="M57 30Q74 13 85 36Q97 52 76 68Q59 75 53 51Z" fill="#7e5a36" stroke="#63462f" stroke-width="3"/>'+
  '<path d="M65 39L76 33L89 44L84 60L68 59Z" fill="#cfad77" stroke="#63462f" stroke-width="3"/>'+
  '<circle cx="78" cy="44" r="2" fill="#2c241b"/>');
 if(animal.shape==='bat')return frame(
  '<path d="M50 42L38 26Q23 31 8 19Q4 44 20 62L40 55L50 72L60 55L80 62Q96 44 92 19Q77 31 62 26Z" fill="#5f625e" stroke="#323a36" stroke-width="3"/>'+
  '<ellipse cx="50" cy="46" rx="9" ry="18" fill="#8b8070" stroke="#323a36" stroke-width="2"/>'+
  '<path d="M43 35L39 23l9 10m9 2 4-12 2 12" fill="#8b8070" stroke="#323a36" stroke-width="2"/>'+
  '<circle cx="47" cy="43" r="1.7" fill="#ddc581"/><circle cx="54" cy="43" r="1.7" fill="#ddc581"/>');
 return frame(
  '<path d="M8 61Q24 47 45 49L70 45L95 54L92 65L70 69L44 72Q22 70 8 61Z" fill="#667d58" stroke="#384632" stroke-width="4"/>'+
  '<path d="M21 58l6-7 7 5 6-7 9 6 8-7" stroke="#45573b" stroke-width="3" fill="none"/>'+
  '<path d="M32 69l-12 12m36-12 9 12" fill="none" stroke="#384632" stroke-width="5"/>'+
  '<circle cx="80" cy="54" r="2.2" fill="#e0c36c"/>');
}

host.ATLAS_POLISH_BEFORE={SPECIES,SEXUAL_DIMORPHISM,LEGENDARY_SPECIMENS,getSpriteMarkup,MUSEUM_RELICTS,museumCardArt};
})(globalThis);
