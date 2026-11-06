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
