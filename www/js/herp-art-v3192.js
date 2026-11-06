/* El Gran Atlas 3.19.2 — dirección artística de anfibios y reptiles.
 * Solo SVG. Clasificación visual por nombres común/científico; nunca modifica SPECIES.
 * Identidades por silueta para miniaturas de 56 px y ampliaciones del Cuaderno.
 */
(function(root){
"use strict";
function norm(s){return String(s||"").toLocaleLowerCase("es").normalize("NFD").replace(/[\u0300-\u036f]/g,"");}
function classify(sp){
 if(!sp)return null;
 const k=sp.kind||"",n=norm(sp.name),l=norm(sp.latin),t=n+" "+l;
 if(k==="fish"||k==="ray")return null;
 if(/rana|sapo|escuerzo|conraua|xenopus|breviceps|epidalea|strauchbufo|sclerophrys|schismaderma|rana temporaria/.test(t))
   return /sapo|bufo|epidalea|sclerophrys|schismaderma|breviceps/.test(t)?"toad":"frog";
 if(/salamandra|triton|salaman|lissotriton|triturus|ichthyosaura|andrias/.test(t)||k==="salamander")
   return /andrias|gigante/.test(t)?"giant-salamander":/triton|lissotriton|triturus|ichthyosaura/.test(t)?"newt":"salamander";
 if(/tortuga|galapago|testudo|mauremys|aldabrachelys|astrochelys|dermochelys/.test(t)||k==="tortoise")
   return /laud|marina|dermochelys/.test(t)?"sea-turtle":/galapago|mauremys/.test(t)?"pond-turtle":"land-tortoise";
 if(/cocodrilo|caiman|crocodylus|mecistops|osteolaemus/.test(t)||k==="crocodile")return /hocico estrecho|mecistops/.test(t)?"slender-crocodile":"crocodile";
 if(/lucion|lagarto de cristal|anguis fragilis|pseudopus/.test(t))return "glass-lizard";
 if(/cobra|naja |ophiophagus/.test(t))return "cobra";
 if(/vibora|vipera|cerastes|daboia|bitis/.test(t))return "viper";
 if(/piton|python|boa |sanzinia|malayopython/.test(t))return "python";
 if(/mamba|dendroaspis/.test(t))return "mamba";
 if(/krait|bungarus/.test(t))return "krait";
 if(/culebra|natrix|serpiente/.test(t)||k==="snake")return "snake";
 if(/camaleon|chamaeleo|furcifer|calumma|trioceros/.test(t))return "chameleon";
 if(/geco|gecko|gekko|phelsuma|uroplatus|pachydactylus|stenodactylus/.test(t))return "gecko";
 if(/dragon volador|draco volans/.test(t))return "flying-lizard";
 if(/varano|varanus|komodo/.test(t))return "monitor";
 if(/uromastyx|cola espinosa/.test(t))return "spiny-lizard";
 if(/lagarto|lagartija|agama|phrynocephalus|timon|lagart|camaleo/.test(t)||k==="lizard"||k==="reptile")return "lizard";
 return null;
}
function tint(hex,delta){
 const c=/^#[0-9a-f]{6}$/i.test(hex||"")?hex:"#688878";
 return "#"+[1,3,5].map(i=>Math.max(0,Math.min(255,parseInt(c.slice(i,i+2),16)+delta)).toString(16).padStart(2,"0")).join("");
}
function paint(c,skin,n,group){
 if(skin!=="normal")return c;
 if(/salamandra comun|salamandra salamandra/.test(n))return "#363a2e";
 if(/pantera|furcifer pardalis/.test(n))return "#2e93ac";
 if(/geco diurno|phelsuma/.test(n))return "#43a66b";
 if(/tokay|gekko gecko/.test(n))return "#648d9d";
 if(/tortuga radiada|astrochelys/.test(n))return "#a8873f";
 if(/sapo|epidalea|sclerophrys|schismaderma/.test(n))return "#93876b";
 if(/rana de lluvia|breviceps/.test(n))return "#c5a782";
 if(/natrix|culebra de collar/.test(n))return "#778a60";
 if(/mamba negra|dendroaspis/.test(n))return "#586868";
 if(/cerastes/.test(n))return "#c8ab76";
 if(group==="crocodile"&&/enano/.test(n))return "#666b4f";
 return c;
}
function render(sp,color,skin){
 const family=classify(sp);if(!family)return null;
 const n=norm(sp.name),l=norm(sp.latin),t=n+" "+l;
 const c=paint(color||sp.color||"#688878",skin,t,family),dark=tint(c,-39),mid=tint(c,-18),light=tint(c,27);
 const ink="#344038",eye=skin==="albino"?"#c85f6c":skin==="melanico"?"#d8c46b":"#202c27";
 const bone=skin==="melanico"?"#687079":skin==="albino"?"#f6eef1":"#e8dcb4";
 const p=(d,f=c,s=ink,w=2.6)=>'<path d="'+d+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>';
 const line=(d,s=ink,w=2.3)=>p(d,"none",s,w);
 const circle=(x,y,r,f)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+f+'"/>';
 const ell=(x,y,rx,ry,f=c,s=ink,w=2.6)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'" stroke="'+s+'" stroke-width="'+w+'"/>';
 const eyes=(x,y)=>circle(x,y,2.4,eye)+circle(x+.6,y-.6,.7,"#faf6e9");
 const spots=(points,rad=2.8,f=dark)=>points.map(v=>circle(v[0],v[1],rad,f)).join("");
 const band=(xs,y1=42,y2=69,col=dark,w=3)=>xs.map(x=>line("M"+x+" "+y1+"q-5 12 0 "+(y2-y1),col,w)).join("");
 const legs=(x=39)=>line("M"+x+" 69l-8 15m24-14 11 14m-13-30 12-10m-32 11-12-8",ink,3.5);
 const glow=skin==="alfa"?circle(50,50,42,"#f7da81"):"";
 let art="";
 if(family==="frog"){
   const claw=/xenopus|unas africana/.test(t),goliath=/goliat|conraua/.test(t);
   art=p("M29 69Q14 64 14 76L5 82M55 73Q70 84 87 79L96 85", "none",ink,5)
     +p("M31 62Q17 68 18 84L7 90L29 88L36 74Z",dark)
     +p("M58 64Q71 65 73 82L94 88L78 89L60 76Z",dark)
     +ell(49,62,goliath?27:23,18,c)
     +p("M30 51Q39 38 62 43Q75 47 78 59Q60 68 33 63Z",light)
     +ell(39,45,7,7,light)+ell(65,44,7,7,light)+eyes(41,44)+eyes(65,43)
     +line("M44 57q9 5 19-1",mid,1.6)+spots([[40,63],[55,67],[49,55]],2,mid)
     +(claw?p("M10 85L4 94L16 90L23 95L28 87Z",bone)+p("M77 87L74 96L83 93L89 96L97 88Z",bone):line("M6 91l-3 3m10-3l1 4m70-3 0 4m9-5 4 3",dark,2));
   if(claw)art+=line("M31 49q12 7 33 0",dark,3);
 }else if(family==="toad"){
   const round=/breviceps|lluvia/.test(t),red=/vientre rojo|schismaderma/.test(t);
   art=p("M29 67L16 79L9 84M68 69l18 12 9 0", "none",dark,6)
      +ell(50,65,round?29:27,round?25:21,c)
      +ell(50,71,round?22:17,12,red?"#a66d54":light,"none",0)
      +ell(34,49,7,6,c)+ell(66,48,7,6,c)+eyes(35,47)+eyes(66,47)
      +line("M44 60q6 4 13 0",dark,1.8)
      +spots([[31,61],[42,73],[58,59],[67,72],[45,51],[57,79]],round?2:3.4,mid)
      +p("M29 78l-11 10 13 0m39-10 12 10 13 0","none",ink,3);
 }else if(family==="giant-salamander"){
   art=p("M28 62Q16 60 7 69Q10 78 30 72Z",mid)+p("M31 70L20 86L32 83L40 71M61 70L67 85L78 84L71 65Z",dark)
    +ell(46,61,27,15,c)+p("M60 55Q74 42 89 48L95 57L89 67Q74 74 60 68Z",light)
    +eyes(82,52)+line("M82 62l12-2",dark,2.2)+spots([[35,54],[45,65],[53,55]],2.3,mid);
 }else if(family==="salamander"||family==="newt"){
   const isNewt=family==="newt",fire=/salamandra comun|salamandra salamandra/.test(t),crested=/crestado|triturus/.test(t);
   art=p("M25 58Q11 57 5 69Q17 72 27 66Z",dark)
    +p("M26 60Q42 46 62 55Q69 51 79 55Q92 61 84 71Q75 78 63 68Q45 78 27 67Z",c)
    +p("M37 66L28 83L38 78M49 69L51 85L62 79M61 56L60 42M78 57l7-10","none",ink,4)
    +eyes(79,59)+line("M78 69l9-2",dark,1.6);
   if(isNewt){
    art+=p("M12 61Q16 35 35 43Q46 41 58 51L41 56Z",mid)
       +(crested?p("M30 55l3-12 6 9 5-14 5 12 5-11 7 15Z",dark):line("M38 51q13-8 23 3",light,3));
   }
   if(fire)art+=spots([[34,58],[46,56],[59,62],[71,62]],4.5,"#e7bd49")+line("M32 62l11 6m6-9l11 7","#e7bd49",3);
   else art+=spots([[35,60],[48,56],[58,64]],2.1,light);
 }else if(family==="land-tortoise"||family==="pond-turtle"||family==="sea-turtle"){
   const sea=family==="sea-turtle",pond=family==="pond-turtle",big=/gigante|aldabra/.test(t),radiated=/radiada|astrochelys/.test(t);
   if(sea){
     art=p("M34 52Q17 33 6 37L22 58L6 77Q22 82 37 67Z",dark)
       +p("M65 52Q82 28 97 35L80 59L96 83Q77 82 65 67Z",dark)
       +p("M43 69L32 90L44 79M60 70L70 89L63 77Z",mid)
       +p("M49 32Q71 39 75 58Q70 77 49 82Q28 75 25 57Q31 39 49 32Z",c)
       +p("M50 38L44 54L50 73L56 54Z",light)
       +line("M36 48L48 50m16-2-14 2m-13 18 12-6m14 6-13-6",dark,2.2)
       +p("M42 34Q44 19 51 18Q63 21 58 37Z",light)+eyes(54,27);
   }else{
    art=p("M22 66L15 82L27 84L36 71M50 72L49 86L63 87L63 69Z",dark)
       +p("M22 66Q14 48 27 31Q43 "+(big?15:22)+" 64 31Q78 41 75 66Z",c)
       +p("M25 59Q43 44 72 57L77 70Q52 80 24 70Z",dark)
       +p("M47 35L35 45L39 59L52 64L64 55L60 44Z",light)
       +line("M35 45l-8-1m12 15-14 4m27 1-3 9m15-18 10-9",mid,2)
       +p("M72 54Q83 50 91 57L95 64Q87 73 75 67Z",light)
       +eyes(87,59);
    if(pond)art+=line("M27 42Q48 30 69 43",bone,2.4);
    if(radiated)art+=line("M49 39l-4 20m4-20 12 18m-12-18-17 12",bone,2.7);
   }
 }else if(family==="crocodile"||family==="slender-crocodile"){
   const slim=family==="slender-crocodile",dwarf=/enano|osteolaemus/.test(t);
   art=p("M29 54Q17 52 4 42L13 63L4 83L29 71Z",dark)
     +p("M22 58Q37 46 58 54Q70 49 78 52L"+(slim?97:95)+" 57L"+(slim?99:95)+" 65L78 69Q47 79 22 69Z",c)
     +p("M33 72L25 84l11-3 12-12M59 70l13 14 11-2-14-15Z",dark)
     +Array.from({length:7},(_,i)=>p("M"+(29+i*7)+" "+(54-i%2*2)+"l4-6 4 6Z",mid,ink,1)).join("")
     +line("M78 64L"+(slim?97:94)+" 63",dark,2)+eyes(77,55)
     +line("M79 67l3 4m5-4 3 3m5-4 3 2",bone,1.6);
   if(dwarf)art+=spots([[39,60],[53,62],[65,59]],3,mid);
 }else if(family==="cobra"){
   const king=/real|ophiophagus/.test(t),hood=king?23:20;
   art=p("M9 77Q17 61 31 72Q43 84 58 72Q72 61 62 55","none",ink,15)
    +p("M9 77Q17 61 31 72Q43 84 58 72Q72 61 62 55","none",c,10)
    +p("M53 65Q"+(53-hood)+" 52 "+(53-hood)+" 34Q"+(53-hood)+" 13 53 16Q"+(53+hood)+" 13 "+(53+hood)+" 34Q"+(53+hood)+" 52 53 65Z",c)
    +ell(53,36,9,9,light)+eyes(49,34)+eyes(58,34)
    +line("M53 43l0 8m-5 2 5-2 5 2",dark,1.7)
    +line("M43 50l20 0m-18 7 17 0",mid,2.7);
   if(/india|naja naja/.test(t))art+=ell(53,35,6,6,"none",bone,2);
 }else if(family==="viper"||family==="python"||family==="mamba"||family==="krait"||family==="snake"||family==="glass-lizard"){
   const viper=family==="viper",python=family==="python",mamba=family==="mamba",krait=family==="krait",glass=family==="glass-lizard";
   const thick=viper?20:python?17:glass?10:mamba?8:11;
   const route=viper?"M9 77Q9 47 30 49Q49 51 42 67Q37 85 63 76Q78 72 75 50":
        python?"M7 78Q9 47 32 51Q49 54 41 71Q34 88 62 77Q84 68 72 45":
        mamba?"M7 79Q28 68 28 54Q26 28 52 33Q73 39 66 58Q60 75 85 56":
        glass?"M9 76Q22 64 39 72Q58 81 55 53Q55 40 72 47Q88 54 80 65":
        "M8 76Q24 52 40 65Q52 79 64 63Q77 43 86 51";
   art=line(route,ink,thick+5)+line(route,c,thick);
   if(viper){
    art+=p("M67 46Q79 37 92 45L98 57L80 60L69 53Z",c)+eyes(87,47)
      +( /cornuda|cerastes/.test(t)?p("M78 45L75 30L86 43Z",dark)+p("M88 46L91 32L95 49Z",dark):"");
   }else{
    art+=p("M78 53Q87 45 95 50L98 58L87 62L78 57Z",c)+eyes(91,53);
   }
   if(krait)art+=band([20,33,46,59,72],54,69,bone,4);
   else if(python)art+=spots([[21,57],[34,58],[46,72],[59,73],[72,58]],4.5,dark);
   else if(viper)art+=spots([[19,57],[31,50],[45,64],[59,76]],4,dark);
   else if(/collar|natrix natrix/.test(t))art+=line("M79 50l-3 8",bone,4);
   else if(/viperina|natrix maura/.test(t))art+=band([23,36,52,67],55,65,mid,2.4);
   else if(glass)art+=line("M29 64Q56 63 75 51",light,2.3);
 }else if(family==="chameleon"){
   const horn=/jackson|trioceros/.test(t),tall=/parson|calumma/.test(t);
   art=line("M9 83Q49 79 95 86","#806c4b",3)
     +p("M28 62Q19 42 37 36Q56 29 68 43L80 52L72 68Q50 79 28 62Z",c)
     +p("M65 47L71 "+(tall?17:28)+"L78 47Z",dark)
     +p("M70 49Q80 38 91 45L96 54L79 57Z",light)
     +line("M34 69l-2 14m12-14 0 15m20-17 5 16m-16-15 3 16",ink,3)
     +line("M28 63Q8 53 11 37Q15 22 26 30Q33 37 26 45Q18 49 20 39",c,6)
     +ell(79,48,5,5,light)+eyes(81,47)
     +line("M54 47q-7 6-10 15",mid,3);
   if(horn)art+=p("M81 43L86 29L89 43Z",bone)+p("M73 43L74 34L79 43Z",bone);
   if(/pantera|furcifer/.test(t))art+=band([39,49,59],43,66,"#e3a568",3);
 }else if(family==="gecko"){
   const leaf=/uroplatus|cola de hoja/.test(t),day=/phelsuma|diurno/.test(t),tokay=/tokay/.test(t),palm=/palmeadas/.test(t);
   art=p("M26 61Q15 58 6 68L"+(leaf?13:6)+" "+(leaf?83:77)+"L"+(leaf?27:31)+" 68Z",leaf?light:dark)
     +p("M26 61Q42 49 62 54Q75 49 87 54L92 61L76 69Q51 75 26 65Z",c)
     +p("M35 66L25 82m4 0-11 5m10-6-1 11M54 69L59 83m0 0-10 7m10-6 10 7","none",ink,3)
     +p("M52 55L49 40L42 34m8 6 2-8m20 24 4-14 13-5m-13 5 3-10","none",ink,3)
     +ell(77,54,6,6,light)+eyes(79,53)
     +spots([[38,58],[51,63],[63,58],[31,63]],tokay?4.1:2.5,day?"#de7863":mid);
   if(leaf)art+=p("M9 65L5 44L18 50L28 63L13 83Z",light);
   if(palm)art+=ell(20,85,6,3,bone)+ell(66,88,6,3,bone);
 }else if(family==="flying-lizard"){
   art=p("M15 55Q20 27 44 35L47 57Q27 72 9 78Z",light)
    +p("M48 55Q64 25 89 33L96 78Q73 71 48 65Z",mid)
    +p("M15 59Q50 50 75 56L89 57L94 63L73 67Q43 72 15 65Z",c)
    +p("M20 61Q10 61 5 77","none",dark,5)
    +line("M38 64L32 82m30-16 3 16m8-23 9-14m-25 12 3-15",ink,3)
    +line("M14 55L40 60M22 43L40 59M54 56L83 43M57 60L87 66",dark,2)
    +eyes(85,56);
 }else if(family==="monitor"||family==="spiny-lizard"||family==="lizard"){
   const monitor=family==="monitor",spiny=family==="spiny-lizard",komodo=/komodo/.test(t),ocel=/ocelado|timon/.test(t),agama=/agama|phrynocephalus/.test(t);
   art=p("M31 60Q14 57 4 80L26 72Z",dark)
    +p("M25 59Q44 "+(monitor?43:49)+" 67 53Q80 46 93 55L96 65Q85 71 73 67Q55 "+(komodo?82:74)+" 32 71Z",c)
    +p("M34 67L22 84L30 88L44 71M60 69L59 86L70 89L72 66M54 56L56 38L60 52M78 54L83 39","none",ink,monitor?5:3.5)
    +eyes(86,56)+line("M88 65l9-2",dark,1.6);
   if(spiny)art+=Array.from({length:5},(_,i)=>p("M"+(8+i*5)+" "+(67-i%2*3)+"l-2-8 7 4Z",dark,ink,1.1)).join("");
   if(ocel)art+=spots([[38,58],[50,62],[61,58]],3.7,bone);
   if(agama)art+=p("M55 53L60 39L66 53Z",dark);
   if(monitor)art+=p("M43 58q13-9 22 0", "none",light,3);
 }else return null;
 return '<svg viewBox="0 0 100 100" aria-hidden="true" data-herp-family="'+family+'" data-herp-version="3.19.2">'+
     (glow?'<g opacity=".16">'+glow+'</g>':"")+art+'</svg>';
}
root.ATLAS_HERP_ART_V3192=render;
if(typeof module!=="undefined"&&module.exports)module.exports={renderHerp:render,classifyHerp:classify};
})(typeof globalThis!=="undefined"?globalThis:this);
