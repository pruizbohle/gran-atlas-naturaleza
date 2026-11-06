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
 if(female)colors=['#a5967c','#7e7761','#9d9277','#d5c3a2','#a69b7d'];
 if(female&&latin==='Pyrrhula pyrrhula')colors=['#9b9283','#526053','#35423e','#baac97','#676c59'];
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
  if(duck&&mand&&female)art+=detail(line('M62 39L70 40',light,2.2)+line('M58 43L63 42',light,1.8));
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
  if(ost)art+=detail(p('M28 46Q40 39 52 48L50 55Q38 60 29 56Z',light,'none',0));
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
   if(female&&grouse)tail='M31 61L13 79L36 77L43 65Z';
   art=p(tail,w)+feet(par?'M43 73L39 87L32 88M56 72L61 85L68 86':'M45 71L42 88L34 90M58 70L63 87L70 88',par?2.4:2.8);
   art+=p(snow&&latin==='Lagopus lagopus'?'M23 61Q22 43 45 42Q46 30 59 30Q74 30 76 44L72 57Q74 74 54 79Q31 83 23 67Z':par?'M24 61Q23 44 46 43Q48 33 61 33Q75 33 77 46L71 57Q72 73 54 79Q32 82 24 67Z':mon?'M23 58Q26 42 48 41L54 29Q59 22 69 26Q80 30 77 41L69 50Q72 65 56 74Q34 80 24 65Z':grouse?'M23 58Q25 39 48 42L54 29Q57 19 68 22Q81 25 77 38L69 50Q75 68 55 77Q31 81 23 65Z':trag?'M23 58Q23 39 47 40L53 30Q60 21 70 28Q80 33 75 44L68 52Q72 69 54 78Q31 82 23 65Z':'M25 56Q29 42 50 43L55 30Q61 22 71 28Q81 34 76 44L68 53Q71 67 55 75Q34 81 25 64Z');
   art+=detail(p('M54 34Q58 25 69 29L75 38L67 48L56 45Z',h,'none',0)+p('M55 48L66 48L65 62Q63 74 51 76L43 68Z',b,'none',0));
   art+=wing(par?'M29 52Q44 44 57 57Q52 70 29 70Q24 63 29 52Z':'M29 49Q45 41 59 55Q53 70 28 70Q24 61 29 49Z')+feather('M32 57Q44 62 52 53M31 64L48 61');
   art+=p(par?'M75 43L85 46L76 51Z':'M75 34Q87 32 85 40L77 44Z',bill,ink,1.5)+eyes(par?70:69,par?41:32,1.7);
   if(mon&&!female)art+=line(/lhuysii/.test(latin)?'M59 26L53 11M64 25L66 7M67 26L73 13':'M59 26L56 15M64 25L65 13',blue,1.9)+detail(dot(56,14,2,blue)+dot(65,12,2,blue)+line('M29 69Q38 74 45 69',light,3));
   if(grouse&&!female)art+=detail(line('M65 27L72 28',red,3.5)+line('M31 73L42 73',light,2));
   if(golden&&!female)art+=p('M55 30Q51 19 66 20Q76 20 76 29Z',gold,ink,1.6)+p('M56 36L65 39L61 54L49 44Z',gold,ink,1.4)+detail(line('M53 39L62 43M54 44L60 47',dark,1.7));
   if(silver&&!female)art+=p('M57 28Q52 19 59 15L68 26Z',dark,ink,1.5)+detail(line('M31 54L51 58M30 61L48 64M14 81L30 74',dark,1.2));
   if(trag&&!female)art+=speckle([[34,51],[43,54],[50,59],[34,64],[45,67],[58,61]],light)+detail(p('M63 30L72 33L70 41L63 39Z',blue,'none',0));
   if(!par&&!mon&&!trag&&!grouse&&!pea)art+=detail(line('M14 83L19 86M20 76L26 80M26 70L33 74',female?b:gold,2.1));
   if(par&&!snow)art+=detail(p('M57 39Q68 31 75 40L71 48L64 49L59 44Z',light,'none',0)+line('M57 38Q58 51 69 54',dark,2.4)+line('M31 60L34 67M38 59L41 68M45 60L48 67',dark,2.3));
   if(pea&&female)art+=detail(p('M54 34Q59 27 68 31L70 42L64 50L57 46Z',paint('#709174'),'none',0))+line('M58 28L55 21M62 27L62 20',paint('#709174'),1.6)+eyes(69,32,1.7);
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
