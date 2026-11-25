/* El Gran Atlas 3.19.4 / revisión anatómica 3.19.9 — mamíferos del mundo.
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
 tiger:'M21 53C21 41 31 35 47 38Q59 35 67 40Q70 30 78 29Q87 28 90 39Q89 45 95 48Q98 52 94 55Q87 59 79 54Q76 62 66 67Q52 73 29 68C21 67 18 61 21 53Z',
 lion:'M21 52C22 39 32 36 47 39Q60 36 68 41Q70 33 77 31Q86 29 89 39Q89 46 94 50Q98 54 93 57Q86 60 78 54Q75 65 64 68Q47 73 28 68C19 66 18 61 21 52Z',
 leopard:'M20 54C21 43 31 37 45 39Q59 35 68 41Q71 31 79 31Q87 31 89 40Q89 46 95 49Q98 53 93 56Q87 59 79 54Q74 65 63 69Q47 73 27 67C19 65 17 60 20 54Z',
 snowcat:'M23 52C23 39 32 33 47 37Q61 33 70 41Q73 31 81 32Q90 33 91 43Q91 48 95 51Q98 55 92 58Q84 61 77 55Q74 68 62 72Q44 77 29 69C21 66 20 60 23 52Z',
 cheetah:'M21 49C23 37 33 33 47 40Q58 35 67 40Q72 30 79 30Q87 29 89 38Q89 44 95 47Q99 51 93 54Q86 56 80 51Q73 57 67 62Q56 62 49 60Q40 60 30 66C21 66 18 59 21 49Z',
 puma:'M20 51C21 39 33 33 47 38Q60 35 69 42Q72 32 80 31Q88 30 90 40Q90 46 95 49Q99 54 93 57Q86 60 79 54Q74 65 62 69Q46 73 28 67C20 65 17 59 20 51Z',
 lynx:'M22 52C22 40 31 32 45 35Q59 32 68 40Q71 28 79 28Q87 27 89 38Q89 44 94 48Q97 52 92 56Q86 60 79 57Q76 63 73 66Q54 75 29 69C21 67 19 60 22 52Z',
 manul:'M23 55C23 43 31 34 44 35Q61 31 72 41Q77 33 84 36Q91 39 90 47Q96 49 95 54Q92 60 82 59Q78 71 65 75Q45 79 29 70C22 67 20 62 23 55Z',
 serval:'M25 46C25 36 36 31 49 36Q61 32 69 38Q71 30 76 28Q83 26 87 32Q90 36 88 43Q89 46 93 47Q96 50 92 53Q87 56 81 52Q76 56 69 59Q56 63 44 62L31 63Q22 59 25 46Z',
 smallcat:'M23 56C24 46 34 39 45 41Q59 37 68 44Q72 35 79 35Q88 34 89 42Q89 47 93 50Q96 54 91 57Q86 60 80 56Q74 66 62 71Q47 76 30 71C22 69 20 62 23 56Z',
 caracal:'M24 51C25 40 34 34 47 38Q60 33 70 42Q73 32 80 31Q87 30 89 39Q88 45 93 48Q97 51 93 55Q88 59 81 55Q77 53 76 52Q72 63 61 68Q45 72 30 67C22 64 21 58 24 51Z',
 sandcat:'M24 59C25 49 35 41 45 43Q61 39 72 47Q77 36 84 39Q91 41 90 49Q95 51 95 55Q95 61 82 62Q76 73 62 76Q44 80 30 74C22 71 20 65 24 59Z',
 fishingcat:'M22 55C23 43 33 35 45 37Q60 33 72 44Q76 34 84 35Q91 36 91 45Q91 50 95 52Q98 55 94 59Q88 63 81 59Q75 69 62 73Q44 78 28 71C20 68 18 62 22 55Z',
 junglecat:'M25 50C27 39 37 33 49 37Q61 33 70 41Q72 30 80 29Q88 28 89 38Q89 44 94 47Q98 51 93 54Q87 58 81 54Q75 61 64 65Q47 69 31 64C23 62 21 56 25 50Z',
 wolf:'M20 52C21 41 32 34 47 39Q58 34 67 38Q71 27 78 26Q85 26 87 36Q87 42 95 45Q99 47 97 51Q95 55 85 55Q80 54 77 51Q73 61 61 66Q47 71 27 66C19 64 17 58 20 52Z',
 fox:'M22 53C24 42 34 38 48 42Q59 37 68 41Q71 30 78 29Q84 29 86 39Q86 45 96 48Q100 50 96 53Q91 56 82 54Q78 53 76 50Q73 61 61 66Q45 71 29 67C21 65 19 60 22 53Z',
 arcticfox:'M23 54C22 42 30 33 45 35Q59 31 70 41Q75 31 83 33Q90 35 91 44Q91 49 96 52Q99 56 92 59Q85 62 80 58Q76 71 63 74Q43 78 29 70C21 67 19 62 23 54Z',
 fennec:'M24 58C26 47 36 41 48 43Q61 39 69 46Q72 36 79 35Q87 35 88 44Q89 48 97 51Q100 53 96 56Q91 60 83 58Q79 57 77 55Q72 68 59 72Q43 77 30 71C22 68 21 63 24 58Z',
 wilddog:'M23 49C25 38 35 32 49 37Q60 32 69 38Q73 27 81 26Q89 25 90 36Q90 43 96 46Q100 50 96 54Q92 59 84 57Q79 55 76 52Q71 62 59 66Q43 70 29 64C22 62 20 56 23 49Z',
 raccoondog:'M23 56C24 44 33 36 45 38Q61 35 73 45Q78 35 85 39Q90 42 89 49Q92 51 96 53Q98 57 93 60Q87 63 81 59Q75 71 62 75Q43 80 28 71C21 67 19 62 23 56Z',
 hyena:'M22 45C24 34 33 27 46 33Q58 33 68 40Q72 29 80 28Q89 27 91 38Q91 44 97 48Q100 53 96 56Q91 60 84 58Q80 56 76 52Q73 65 63 71Q49 75 36 69L25 63C18 58 18 52 22 45Z',
 stripedhyena:'M22 47C23 37 34 30 46 34Q59 34 68 42Q72 31 81 30Q90 30 91 41Q91 47 96 50Q99 54 94 58Q88 61 82 58Q78 56 75 53Q71 67 61 72Q45 77 27 65C20 61 19 54 22 47Z',
 civet:'M21 57C22 46 32 40 44 41Q60 35 71 45Q75 36 83 36Q90 36 91 45Q91 49 97 52Q100 55 96 59Q90 63 82 60Q78 59 76 56Q69 69 56 73Q41 78 27 72C19 69 18 63 21 57Z',
 genet:'M22 60C25 50 37 45 49 47Q62 41 71 49Q77 40 84 40Q91 40 92 48Q92 52 97 54Q99 58 94 61Q88 63 81 60Q77 59 75 57Q68 70 55 73Q40 77 28 73C20 70 19 65 22 60Z',
 fossa:'M22 55C24 44 35 38 48 41Q61 37 70 45Q74 34 82 33Q90 33 91 42Q91 48 97 51Q100 55 95 59Q89 63 82 60Q77 59 75 55Q69 67 56 71Q40 76 28 70C20 67 19 61 22 55Z',
 weasel:'M20 66C23 58 34 54 48 56Q64 50 74 58Q79 49 86 50Q92 51 93 56Q98 58 97 63Q94 68 86 67Q80 67 77 64Q67 74 55 76Q39 79 25 75C18 74 17 69 20 66Z',
 marten:'M22 58C24 48 35 42 48 44Q62 38 72 46Q76 35 84 36Q92 37 92 46Q92 51 97 54Q100 58 95 61Q89 65 83 62Q78 61 76 56Q68 69 56 72Q42 77 28 71C21 69 18 63 22 58Z',
 badger:'M20 57C20 45 29 37 44 38Q61 35 73 49Q82 43 89 47Q94 50 96 57Q99 59 97 63Q94 69 82 68Q77 67 74 62Q69 75 55 77Q39 79 27 73C18 70 16 64 20 57Z',
 wolverine:'M20 53C20 39 29 31 44 33Q62 30 75 46Q82 37 89 42Q94 46 93 53Q99 56 98 61Q96 66 85 67Q78 65 75 61Q69 76 55 78Q38 81 26 73C18 69 16 61 20 53Z',
 mongoose:'M21 62C24 53 36 48 49 50Q64 44 75 53Q79 46 87 46Q93 47 94 54Q98 56 98 59Q99 64 84 66Q80 65 77 61Q69 72 56 76Q40 80 27 74C19 71 18 66 21 62Z',
 deer:'M20 49C21 38 32 34 49 40Q58 41 64 38Q68 31 69 26Q71 19 78 22Q85 25 86 34Q87 39 94 41Q98 44 95 48Q90 53 81 47Q77 51 75 60Q72 68 61 70Q45 73 28 68C20 66 17 60 20 49Z',
 moose:'M20 47C22 35 34 29 49 35Q58 37 64 35Q66 30 69 26Q76 20 82 25Q87 28 87 38Q89 43 94 46Q98 51 95 57Q92 62 85 60Q79 59 74 51L73 63Q69 71 59 72Q43 74 26 68C19 64 17 57 20 47Z',
 reindeer:'M21 51C22 40 32 33 45 37Q59 33 68 40Q69 32 71 28Q77 20 83 25Q88 28 88 38Q90 43 96 45Q99 49 94 53Q89 57 82 53Q77 52 75 48Q74 61 65 68Q53 77 29 70C21 67 18 60 21 51Z',
 roe:'M25 53C27 42 36 36 48 42Q57 44 64 41Q69 34 71 28Q76 23 82 27Q87 31 87 39Q89 43 94 45Q98 48 94 52Q89 56 81 52Q78 51 75 48Q72 63 63 69Q49 76 31 71C24 69 22 62 25 53Z',
 muskdeer:'M22 51C23 40 33 34 45 38Q58 35 68 45Q72 35 79 32Q87 30 88 41Q88 46 95 49Q98 53 94 56Q89 60 81 56Q77 55 76 51Q72 65 60 71Q44 76 28 68C21 65 19 58 22 51Z',
 saiga:'M23 51C25 40 35 35 48 41Q55 43 62 39Q67 32 69 28Q75 19 82 26Q88 31 88 40Q95 43 97 51Q99 58 94 62Q87 66 83 60Q81 55 75 49Q71 61 61 67Q46 72 30 66C23 64 20 57 23 51Z',
 gazelle:'M23 49C24 40 34 35 48 41Q56 42 62 39Q67 33 70 27Q74 20 81 25Q87 29 87 38Q89 43 95 45Q99 48 95 52Q91 56 82 52Q78 50 76 46Q73 58 63 64Q48 70 31 65C23 64 20 57 23 49Z',
 gerenuk:'M22 54C25 44 35 39 48 44Q54 46 59 43Q61 34 63 22Q63 14 69 13Q78 11 82 19Q85 26 84 28Q89 32 96 34Q100 38 95 41Q90 44 84 40Q78 38 76 33L72 54Q68 65 57 70Q43 74 29 68C21 65 19 60 22 54Z',
 kudu:'M21 48C23 37 34 31 47 37Q60 32 68 38Q70 30 72 25Q78 19 84 24Q88 28 88 37Q90 41 95 43Q99 47 94 51Q90 55 83 52Q78 51 76 47Q72 62 61 68Q46 73 28 66C21 63 18 57 21 48Z',
 eland:'M20 46C22 33 33 27 48 32Q63 29 73 40Q75 31 76 29Q82 23 88 29Q91 34 90 43Q92 46 97 48Q100 52 96 56Q90 60 84 56Q78 54 76 50Q73 66 61 72Q44 78 26 68C18 64 17 57 20 46Z',
 oryx:'M21 50C24 39 34 32 47 38Q60 32 70 40Q72 33 74 29Q80 23 85 28Q89 33 89 41Q90 44 96 46Q99 50 94 53Q89 56 83 53Q78 52 76 48Q72 63 60 69Q45 74 28 67C20 63 18 57 21 50Z',
 dikdik:'M24 55C24 44 32 37 43 40Q59 38 70 48Q73 38 79 35Q87 32 89 43Q89 48 96 51Q100 54 94 58Q89 62 82 58Q78 57 76 54Q72 69 58 74Q43 79 29 70C22 66 21 61 24 55Z',
 antelope:'M21 49C23 38 34 32 47 38Q61 33 70 41Q72 33 74 28Q81 21 86 27Q90 32 89 41Q91 45 96 47Q100 51 95 54Q90 58 83 54Q79 53 77 49Q73 65 60 70Q44 76 28 67C20 64 18 57 21 49Z',
 wildebeest:'M20 46C23 33 33 27 46 33Q62 30 71 43Q73 36 75 33Q82 27 87 32Q91 38 90 46Q91 51 97 54Q99 59 95 63Q89 67 84 64Q78 62 76 57L72 68Q57 75 34 70L24 64C18 60 17 53 20 46Z',
 hartebeest:'M22 46C25 34 36 29 48 36Q61 33 70 44Q71 33 73 26Q78 18 83 23Q87 27 87 39Q89 44 95 48Q98 53 93 58Q89 62 82 59Q79 57 77 50Q73 63 61 68Q45 73 29 66C22 62 20 55 22 46Z',
 bison:'M18 51C18 38 23 29 35 28Q44 14 55 23Q59 28 65 29Q74 31 78 43Q89 41 94 48Q98 54 94 61Q91 68 83 66Q77 65 72 58Q68 71 56 74Q39 78 25 69C17 65 15 58 18 51Z',
 buffalo:'M18 50C20 37 32 28 47 32Q66 28 76 43Q80 36 86 37Q94 38 94 47Q97 51 97 57Q97 64 89 67Q81 67 77 62Q74 60 72 56Q68 72 55 76Q37 79 24 68C17 64 15 57 18 50Z',
 yak:'M18 50C19 37 30 29 44 31Q61 25 74 42Q79 31 85 33Q92 34 92 44Q96 47 97 53Q98 60 91 64Q85 68 80 63L76 58Q75 73 66 77L61 74L56 79L51 75L44 80L39 75L32 77L26 73C18 67 15 59 18 50Z',
 takin:'M20 47Q21 30 43 31Q61 27 74 40L80 30Q90 28 93 42L95 52L98 57L93 64L82 64L75 58Q70 76 45 75L26 69Q16 61 20 47Z',
 caprine:'M22 50C23 39 34 33 47 39Q56 40 62 37Q65 31 68 25Q73 19 80 25Q86 29 87 39Q89 44 94 46Q98 50 94 54Q90 58 82 55Q77 52 75 48Q72 64 61 69Q47 75 29 67C22 65 18 58 22 50Z',
 sheep:'M21 53C21 39 30 31 43 33Q61 28 73 41Q77 32 84 33Q91 34 91 43Q92 50 97 54Q100 59 94 63Q88 67 82 62Q78 60 75 55Q71 72 58 76Q41 80 27 69C20 65 18 59 21 53Z',
 horse:'M20 49C21 37 31 31 46 37Q54 38 61 35Q64 29 66 19Q68 12 75 16Q81 19 82 29Q83 33 88 36Q91 39 95 44Q99 49 94 53Q88 58 80 52Q75 48 72 42Q72 61 63 67Q48 75 27 65C20 62 17 57 20 49Z',
 donkey:'M22 50C24 39 35 32 48 39Q56 41 63 37Q65 31 67 24Q72 18 78 22Q83 25 84 35Q87 40 96 47Q100 50 96 55Q91 60 85 56Q79 52 75 46L73 59Q68 70 57 72Q41 75 29 66C22 63 20 57 22 50Z',
 zebra:'M20 48C22 35 32 29 46 35Q54 37 61 33Q64 27 66 19Q71 12 77 18Q83 22 84 32Q88 39 96 46Q99 50 95 55Q90 60 85 55Q78 49 74 44L72 58Q67 70 55 72Q40 74 27 64C20 61 18 55 20 48Z',
 tapir:'M18 50Q22 31 44 32Q64 27 76 42L81 37Q91 37 94 48L97 56Q99 66 93 68L87 66L88 57L80 61L74 58Q67 76 43 75L24 69Q14 62 18 50Z',
 rhino:'M16 50C17 36 28 27 46 30Q64 26 76 43Q82 38 88 45Q91 50 97 53Q99 56 97 64Q95 68 88 70Q79 70 75 64Q71 60 68 57Q64 73 51 76Q35 79 23 68C16 64 13 58 16 50Z',
 indianrhino:'M17 47Q20 29 43 29Q65 23 77 41L85 39L91 48L98 56L96 67L86 70L74 64L68 57Q63 77 39 75L23 68Q14 60 17 47Z',
 hippo:'M16 54C16 38 26 27 44 29Q63 25 76 42Q82 37 90 41Q96 44 97 54L98 63Q98 72 89 74Q79 77 72 67Q66 78 53 79Q35 80 23 71C16 67 13 61 16 54Z',
 pygmyhippo:'M20 49Q23 32 45 33Q64 28 76 43L83 40Q94 41 96 53L97 62Q97 70 86 70L75 64Q67 77 44 75L26 68Q17 60 20 49Z',
 pig:'M20 52Q24 37 45 36Q62 31 73 43L80 36Q89 34 92 45L98 52L97 63L85 66L75 59Q68 75 46 74L27 68Q17 62 20 52Z',
 warthog:'M20 51Q24 35 43 35Q60 32 71 43L79 39Q92 37 95 51L98 55L97 65L85 68L74 60Q66 74 45 73L27 67Q17 61 20 51Z',
 okapi:'M22 49C24 38 36 31 48 37Q56 37 62 33Q65 25 67 19Q73 12 79 18Q84 23 86 31Q90 37 95 42Q99 47 94 51Q89 54 83 49Q77 44 73 38L71 58Q66 70 54 72Q40 74 29 65C22 62 20 56 22 49Z'
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
// Clean the short angular joins in necks, jaws and wrists without replacing
// the taxon's profile. Curves and their anatomy remain authored by morph above.
// Only straight corners are rounded, with a radius bounded by both neighbours.
function softenBodyJoins(d,radius=1.25){
 if(!d||/[a-z]/.test(d))return d;
 const commands=[...d.matchAll(/([MLQCZ])([^MLQCZ]*)/g)].map(m=>({type:m[1],v:(m[2].match(/-?(?:\d*\.)?\d+/g)||[]).map(Number)}));
 const round=n=>Math.round(n*100)/100;
 const point=c=>c.v.slice(-2);
 let previous=[0,0],out='';
 for(let i=0;i<commands.length;i++){
  const c=commands[i],next=commands[i+1];
  if(c.type==='L'&&c.v.length===2&&next&&next.type!=='Z'){
   const target=c.v,n=next.v.slice(0,2),a=Math.hypot(target[0]-previous[0],target[1]-previous[1]),b=Math.hypot(n[0]-target[0],n[1]-target[1]);
   if(a>1&&b>1){
    const r=Math.min(radius,a*.25,b*.25),pre=target.map((v,k)=>round(v+(previous[k]-v)*r/a)),post=target.map((v,k)=>round(v+(n[k]-v)*r/b));
    out+='L'+pre.join(' ')+'Q'+target.join(' ')+' '+post.join(' ');previous=post;continue;
   }
  }
  out+=c.type+c.v.join(' ');if(c.v.length)previous=point(c);
 }
 return out;
}
const legSets={
 cat:[[30,61,34,73,27,80,31,84,4],[69,57,70,70,72,80,76,84,3.8]],
 tallcat:[[32,55,39,70,30,83,34,88,3.5],[69,51,68,68,72,83,77,88,3.3]],
 dog:[[30,57,39,72,29,83,34,88,4],[69,54,67,70,72,83,77,88,3.5]],
 short:[[29,64,33,73,28,78,32,81,4],[71,59,72,71,75,79,79,82,4]],
 low:[[30,70,34,76,30,80,34,82,2.4],[77,65,77,74,80,79,84,81,2.5]],
 hoof:[[30,59,39,71,29,83,32,88,3.5],[71,53,68,70,72,84,75,89,3.2]],
 heavy:[[28,60,35,73,29,84,34,88,6.2],[72,55,71,72,75,84,81,88,6.3]],
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
 const eyes=(x,y,r=1.6)=>detail(dot(x,y,r+.32,light)+dot(x,y,r,eye)+(r>2.8?dot(x,y,2.7,eye):'')+dot(x+.45,y-.45,.45,cream));
 const clipped=(d,art,suffix='coat')=>{const clip='m3194-'+norm(latin||id||family).replace(/[^a-z0-9]+/g,'-')+'-'+skin+'-'+(sex||'base')+'-'+suffix;return '<defs><clipPath id="'+clip+'">'+p(d,'#ffffff','none',0)+'</clipPath></defs>'+detail('<g clip-path="url(#'+clip+')">'+art+'</g>');};
 // 3.19.9: each limb is a filled anatomical volume: hip / stifle / hock,
 // shoulder / elbow / carpus, then an actual paw or hoof. Far limbs take a
 // different stance, not four copies of a vertical stroke.
 const hoofed=['deer','gazelle','gerenuk','spiral-antelope','oryx','horse-antelope','small-antelope','antelope','wildebeest','hartebeest','bovine','caprine','equid','okapi','giraffe','camel','rhino','hippo','pig'].includes(family);
 const plantigrade=['bear','badger','wolverine','marmot','beaver','ape'].includes(family);
 const limb=(a,fill=c,back=false,hind=false)=>{
  let [x,y,k,v,t,u,toe,b,w]=a;
  if(back){x+=5;k+=hind?1:7;t+=hind?8:4;toe+=5;b-=3;w*=.77;}
  const foot=hoofed?2.8:plantigrade?5.8:4.1;
  const shaft=hoofed?1.5:plantigrade?2.7:2.2;
  const breadth=hoofed?w*.8:plantigrade?w*1.12:w;
  // The top is deliberately unoutlined: the thigh and shoulder merge into
  // the trunk, rather than looking like separate pinned-on rods.
  const upper=hind?(hoofed?breadth*1.3:breadth*1.7):breadth;
  let contour=hind?
   `M${x-upper} ${y-2}C${x-upper-3} ${y+5} ${k-5} ${v-4} ${k-2} ${v}Q${k+1} ${v+3} ${t-shaft} ${u}L${t-shaft} ${b-2}Q${t+1} ${b-3} ${t+foot} ${b-1}Q${t+foot+2} ${b+1} ${t+foot-1} ${b+1}L${t-3} ${b+1}Q${t-5} ${b-1} ${t-shaft-2.6} ${b-4}L${t-shaft-2.2} ${u}Q${k-5} ${v+1} ${k-breadth-3} ${v-3}C${x-1} ${y+8} ${x+upper} ${y+4} ${x+upper} ${y}`:
   `M${x-breadth} ${y}C${x-breadth-1} ${y+7} ${k-3} ${v-1} ${k-2.3} ${v+2}L${t-shaft} ${u}L${t-shaft} ${b-2}Q${t+1} ${b-3} ${t+foot} ${b-1}Q${t+foot+2} ${b+1} ${t+foot-1} ${b+1}L${t-shaft-2.2} ${b+1}Q${t-5} ${b-1} ${t-shaft-2.6} ${b-4}L${t-shaft-2.6} ${u}L${k-5} ${v+1}Q${x-4} ${y+10} ${x+breadth} ${y+2}`;
  let result=p(contour+'Z',fill,'none',0);
  // Only the exposed limb is outlined; the root merges with the body fill.
  const exposed=contour.replace(/^M[^C]+C/,`M${x-upper} ${y+6}C`);
  result+=line(exposed,ink,1.65);
  const hoofColor=paint(family==='equid'?'#6c6556':'#716e5c');
  if(hoofed){
   result+=p(`M${t-shaft-2.2} ${b-2}Q${t+1} ${b-3} ${t+foot} ${b-1}L${t+foot-.5} ${b+1}L${t-shaft-2.2} ${b+1}Z`,hoofColor,ink,1.1);
   if(family!=='equid'&&family!=='camel')result+=detail(line(`M${t+.2} ${b-1}L${t-.2} ${b+1}`,ink,.8));
  }else if(!back){
   result+=detail(line(`M${t+.8} ${b-1}L${t+1.2} ${b+.4}M${t+2.6} ${b-1}L${t+3} ${b+.4}`,dark,.8));
  }
  return result;
 };
 const legs=(scheme,back=false)=>legSets[scheme].map((a,i)=>limb(a,back?dark:c,back,i===0)).join('');
 const tail=(style)=>p(style==='snow'?'M28 50C13 48 5 58 6 73C6 86 13 93 23 88Q30 83 24 78Q19 76 17 81Q12 84 12 75C11 65 19 61 29 62Z':style==='bushy'?'M30 51C20 45 11 45 7 52Q1 63 8 73Q12 78 22 76Q30 73 34 65Q26 67 21 63Q17 57 30 59Z':style==='wolf'?'M28 49C17 47 10 54 9 64Q9 71 6 75Q13 79 21 73Q28 68 32 61Q23 64 21 59Q21 55 29 55Z':style==='short'?'M25 54Q15 53 13 59L23 66L30 62Z':style==='long'?'M28 55C15 55 6 65 6 77C6 88 15 92 23 86Q28 82 23 80Q20 78 18 83Q10 88 11 77C12 68 20 64 30 64Z':style==='equid'?'M25 40Q12 44 14 64L8 80L17 79Q24 63 21 51L30 48Z':style==='tuft'?'M26 51Q11 52 9 67Q5 75 10 81L16 79Q11 71 14 65Q18 60 29 60Z':'M27 58Q11 57 7 73Q7 79 12 76Q17 67 31 65Z',style==='bushy'||style==='wolf'?light:dark);
 const ear=(x,y,height=10,round=false)=>{height=Math.max(3,height+(anatomy?.[4]||0));return p(round?`M${x-4} ${y}C${x-9} ${y-height} ${x+6} ${y-height-3} ${x+5} ${y}Z`:`M${x-4} ${y}Q${x-9} ${y-height} ${x-3} ${y-height}Q${x+3} ${y-height+1} ${x+5} ${y}Z`,c,ink,1.9)+detail(p(`M${x-2} ${y-2}Q${x-5} ${y-height+3} ${x} ${y-height+4}L${x+2} ${y-2}Z`,pink,'none',0));};
 const rosettes=(points,cloud=false)=>points.map(([x,y])=>cloud?p(`M${x-4} ${y-2}q4-5 8 0l-1 6-5 1Z`,light,dark,1.6):line(`M${x-2} ${y+2}q-3-4 1-5m3 0q4 2 1 5`,dark,1.7)).join('');
 let art='',form=morph,body=null,flip=false;

 if(quadrupeds.has(family)&&morph!=='binturong'){
  let shape=outlines[morph]||outlines[family],scheme=['deer','gazelle','gerenuk','spiral-antelope','oryx','horse-antelope','small-antelope','antelope','hartebeest','equid','okapi'].includes(family)?'hoof':['bovine','rhino','hippo','pig'].includes(family)?'heavy':family==='caprine'?'goat':['weasel','mongoose'].includes(family)?'low':['badger','wolverine'].includes(family)||morph==='manul'||morph==='arcticfox'?'short':family==='canid'||family==='hyena'?'dog':morph==='serval'||morph==='cheetah'?'tallcat':'cat';
  if(morph==='duiker')shape=outlines.dikdik.replace('M24 55C24 44 32 37 43 40','M24 55C23 40 32 33 43 36');
  if(morph==='gaur')shape=outlines.buffalo.replace('M18 50C20 37 32 28 47 32','M18 50C20 31 32 24 47 28');
  if(morph==='muskox')shape=outlines.yak.replace('M18 50C19 37 30 29 44 31','M18 50C19 31 30 25 44 27');
  if(morph==='black-rhino')shape=outlines.rhino.replace('Q91 50 97 53Q99 56 97 64Q95 68 88 70','Q91 45 97 49Q99 53 96 61Q94 65 88 67');
  if(morph==='hairy-rhino')shape=outlines.rhino.replace('M16 50C17 36 28 27 46 30','M19 52C20 41 30 31 46 34');
  if(morph==='bushpig')shape=outlines.pig.replace('Q62 31 73 43','Q62 32 73 40');
  if(family==='horse-antelope')shape=outlines.oryx.replace('Q60 32 70 40','Q60 26 70 35');
  if(genus==='Pantholops')shape=outlines.gazelle.replace('M23 49C24 40 34 35 48 41','M23 49C24 35 34 30 48 36');
  if(genus==='Procapra')shape=outlines.gazelle.replace('Q89 43 95 45Q99 48 95 52','Q89 42 94 44Q97 47 93 50');
  if(genus==='Damaliscus')shape=outlines.hartebeest.replace('Q71 33 73 26Q78 18 83 23','Q71 36 73 30Q78 23 83 27');
  if(/kiang/.test(latin))shape=outlines.donkey.replace('M22 50C24 39 35 32 48 39','M22 50C24 34 35 28 48 35');
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
  art+=eyes(eyeX,eyeY,cat||canine?1.6:1.5)+detail(line(cat?'M86 51Q89 54 92 51M85 54L90 55':family==='rhino'?'M86 62L94 63':family==='weasel'?'M89 62L95 63':hoof?(morph==='saiga'?'M87 58Q91 60 94 58':morph==='moose'?'M85 55L92 56':'M86 47Q90 50 93 47'):'M87 52L94 53',dark,1.3));
  if(cat||canine||['marten','weasel','fossa','viverrid'].includes(family))art+=detail(dot(family==='weasel'?96:cat?92:95,family==='weasel'?60:cat?50:canine?(morph==='fennec'?53:49):55,1.8,black));
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
   art=legs('heavy',true)+p(brown?'M17 48C18 34 26 27 39 27Q48 17 59 24Q65 27 73 30Q77 24 84 27Q90 31 89 41Q91 45 97 47Q99 52 96 56Q91 61 86 59Q81 57 76 53Q72 64 64 70Q53 79 40 75Q28 74 23 68C16 63 14 57 17 48Z':sun?'M21 52C22 40 31 33 45 36Q59 29 72 39Q77 29 85 30Q93 31 93 43Q93 49 98 52Q99 57 95 61Q89 65 84 62Q78 59 75 56Q71 71 59 75Q43 80 28 69C20 66 18 60 21 52Z':'M18 52C19 36 28 29 42 32Q60 25 74 38Q78 28 86 29Q94 31 94 43Q93 50 98 55Q100 60 96 64Q90 69 84 65Q78 62 75 58Q71 74 58 78Q42 81 25 70C16 66 15 60 18 52Z')+legs('heavy')+ear(76,34,9,true)+ear(85,34,8,true);
   art+=detail(p(sloth?'M86 44Q96 44 98 56L96 62L85 58L81 52Z':'M83 43L96 47L97 54L88 59L81 52Z',sun?pink:light,'none',0))+eyes(85,38,1.6)+detail(dot(96,sloth?55:49,2,black)+line('M88 55L95 56',dark,1.2));
   if(sun||/thibetanus/.test(latin))art+=detail(p('M67 48L73 55L80 49L77 60L71 64L65 56Z',cream,'none',0));
   if(sloth)art+=p('M25 53L20 62L24 72L28 70M70 49L66 65L70 69',dark,ink,1.4);
  }
 }else if(!art&&['red-panda','viverrid'].includes(family)){
  const redpanda=family==='red-panda';form=redpanda?'red-panda-ringed-tail':'binturong-prehensile-tail';
  const td=redpanda?'M38 58Q15 44 8 60Q3 77 16 83Q32 87 44 70Z':'M37 62C13 58 4 78 13 87Q25 97 31 83Q34 74 26 73Q28 84 22 85Q12 85 17 77Q24 71 43 72Z';
  art=p(td,light)+p('M33 58C29 47 34 40 44 37Q49 32 52 25Q59 18 68 21Q80 25 80 35Q80 43 69 50Q74 57 72 66Q70 77 60 81Q43 88 32 77C26 70 27 64 33 58Z')+p('M43 64Q33 66 34 81L43 86L50 77L54 67Z',dark)+p('M62 62Q72 65 72 80L63 87L55 80L54 68Z',dark)+ear(56,27,redpanda?12:8)+ear(70,28,redpanda?11:8);
  if(redpanda)art+=clipped(td,line('M12 53L10 69M21 52L18 78M31 57L28 81',dark,4),'tail')+detail(p('M53 27Q62 19 73 27L76 39L66 45L54 40Z',cream,'none',0)+p('M54 31L60 31L61 37L56 37ZM68 31L73 32L71 38L66 37Z',dark,'none',0));
  art+=eyes(58,32,1.8)+eyes(70,33,1.8)+detail(dot(65,40,1.8,black)+line('M53 40L45 41M73 41L81 44',cream,1.2));flip=redpanda;
 }else if(!art&&family==='otter'){
  const sea=morph==='sea-otter';
  if(sea){
   art=p('M31 68Q15 71 7 90Q20 91 40 78Z',dark)+p('M27 62Q27 46 43 41L53 27Q63 17 76 25Q87 32 80 44L69 51Q77 65 62 80Q45 93 30 79Q21 71 27 62Z')+p('M32 67Q23 69 21 77Q18 83 24 85Q31 88 36 82L43 75Z',light)+p('M60 71Q66 72 71 77Q79 78 82 81Q78 85 72 82L62 77Q58 75 60 71Z',light)+ear(61,27,6,true)+ear(75,29,6,true)+detail(p('M55 31Q65 24 77 32L78 41L66 47L54 41Z',cream,'none',0))+p('M44 50Q39 52 41 58Q43 63 50 65Q55 66 57 60Q53 57 50 55Q49 50 44 50Z',light)+p('M62 50Q69 50 69 56Q68 61 62 64Q58 68 55 63Q54 59 59 55Q59 51 62 50Z',light)+eyes(61,33,1.7)+eyes(74,35,1.7)+detail(dot(69,41,1.8,black)+line('M60 42L52 44M75 43L82 47',mid,1.3));
  }else{
   body='M24 56Q30 43 50 47L64 44Q69 33 80 36Q93 39 94 51L98 57L93 62L81 62L72 57Q59 75 41 74L27 70Q19 65 24 56Z';
   art=p('M29 61Q14 64 5 82Q4 87 10 86Q20 75 37 71Z',dark)+p(body)+p('M34 63Q27 67 29 74L20 80Q18 83 24 84L38 79L45 67Z')+p('M67 61Q65 72 74 76L86 79Q92 77 87 74L78 69L76 59Z')+ear(77,42,6,true)+ear(86,42,5,true)+detail(p('M75 49Q85 47 93 54L97 57L90 61L78 59Z',light,'none',0))+eyes(86,45,1.6)+detail(dot(96,55,1.8,black)+line('M85 58L93 64M82 56L96 57M28 80L23 78M82 76L84 80',mid,1.2));
   if(genus==='Hydrictis')art+=detail(dot(73,55,1.6,cream)+dot(77,57,1.4,cream));
   if(genus==='Lutrogale')art+=detail(line('M32 57Q50 49 66 52',light,2));
  }
 }else if(!art&&family==='meerkat'){
  art=p('M39 71Q20 81 8 76Q11 87 26 86L47 80Z',dark)+p('M38 49C35 43 38 37 43 34Q39 25 46 21Q57 15 65 23Q74 31 69 39Q67 43 62 46Q62 54 64 61Q69 71 65 80Q60 88 50 87Q36 87 33 77Q30 69 34 60Z')+p('M39 50Q30 53 32 65L40 71L43 63L43 53Z',dark)+p('M61 49Q72 54 68 64L61 70L58 64L59 54Z',dark)+p('M41 77L37 90L45 91L50 80M56 79L61 90L69 90L62 76Z')+ear(46,26,6,true)+ear(62,26,6,true)+detail(p('M44 28L51 27L53 34L45 36ZM59 27L66 29L65 36L58 34Z',black,'none',0))+eyes(49,30,1.7)+eyes(62,31,1.7)+detail(dot(57,38,2,black)+line('M43 55L57 57M40 62L58 65',light,1.5));
 }else if(!art&&family==='pangolin'){
  const tree=genus==='Phataginus',giant=/gigantea/.test(latin),indian=/crassicaudata/.test(latin);form=tree?'arboreal-pangolin':giant?'giant-pangolin':indian?'indian-pangolin':'terrestrial-pangolin';
  const td=tree?'M30 61C17 61 4 76 10 87Q20 98 29 87Q37 77 28 73L26 78Q31 84 23 87Q12 88 15 80Q19 70 39 70Z':'M31 61Q17 67 5 88L17 90Q33 79 42 71Z';
  art=p(td,dark)+p('M31 64Q23 67 23 75Q23 83 28 85Q32 87 35 84Q34 77 41 69Z')+p('M60 65Q56 72 61 80Q65 88 73 86Q77 84 73 80Q70 76 71 72L69 63Z');
  body=giant?'M22 57Q24 27 47 28Q70 29 77 51L88 57L97 65L88 71L75 69Q65 82 43 78Q23 76 22 57Z':tree?'M25 59Q20 37 43 34Q65 32 73 51L85 56L96 65L87 70L73 66Q61 80 42 77Q26 75 25 59Z':'M23 58Q23 32 47 32Q69 32 76 52L86 57L97 65L88 71L74 67Q63 81 43 78Q24 76 23 58Z';
  art+=p(body);let scales='';for(let r=0;r<4;r++)for(let k=0;k<5;k++){const x=25+k*10+(r%2?5:0),y=39+r*8;if(x>74)continue;scales+=p(`M${x} ${y}q5-4 10 0q-1 6-5 8q-4-2-5-8Z`,r%2?mid:light,dark,1.2);}
  art+=clipped(body,scales)+p('M72 53Q81 52 95 64L90 69L76 65Z',light,ink,1.7)+eyes(83,59,1.4)+detail(line('M28 82L26 87M32 82L31 88M69 83L69 88M73 82L76 87',cream,1.3));
 }else if(!art&&family==='aardvark'){
  art=p('M29 59Q15 64 7 84L17 87Q30 79 39 68Z',dark)+legs('short',true)+p('M21 53Q24 31 46 33Q65 29 76 45L82 44L98 57L96 65L85 66L73 57Q65 76 43 75L27 69Q17 62 21 53Z')+legs('short')+ear(73,42,25)+ear(84,43,22)+eyes(87,48,1.6)+detail(dot(97,60,2,black)+line('M24 79L20 84M32 81L28 87M77 80L80 86',cream,1.5));
 }else if(!art&&['cetacean','sirenian','pinniped'].includes(family)){
  if(family==='cetacean'){
   body='M21 60C32 45 46 42 61 46Q78 46 86 54Q89 57 97 59Q100 62 96 64L86 64Q72 75 55 73Q36 72 22 66Q16 69 9 72Q5 73 3 70L11 64Q5 61 4 57Q12 53 21 60Z';
   art=p(body)+p('M45 47Q52 43 53 34Q60 35 64 46L67 49Z',dark)+p('M52 61Q56 68 52 80Q59 80 66 72L68 64Q63 60 52 61Z',dark)+detail(p('M29 64Q61 72 86 61Q66 81 38 69Z',light,'none',0))+eyes(84,55,1.5)+detail(line('M88 63L95 62',mid,1.3));
  }else if(family==='sirenian'){
   body='M22 61C31 43 46 35 61 39Q79 39 88 52Q98 52 98 61Q99 70 90 73Q82 76 77 72Q61 82 44 77Q30 75 21 68Q12 75 5 74Q2 73 3 70L10 64Q4 60 3 56Q12 51 22 61Z';
   art=p(body)+p('M52 59Q61 60 68 67Q72 74 63 79L53 82Q57 73 53 67Q49 63 52 59Z',dark)+detail(p('M77 54Q91 50 97 58L97 66L89 72L78 68Z',light,'none',0))+eyes(86,53,1.6)+detail(line('M89 63L96 62M83 64L84 70',mid,1.5));
  }else{
   body='M19 65Q28 46 51 47L60 27Q61 15 72 14Q83 14 84 26L91 33L98 37L96 44L84 45L76 39L72 60Q74 78 54 81L31 79L16 89L9 88L15 78L6 80L4 73L19 65Z';
   art=p(body)+p('M56 56Q67 58 62 72L72 90L62 92L48 73Q47 64 56 56Z',dark)+ear(71,24,5,true)+detail(p('M78 32L91 34L97 39L92 43L80 40Z',light,'none',0))+eyes(78,26,1.6)+detail(line('M86 40L95 45M84 38L96 38',mid,1.3));
  }
  flip=family!=='pinniped';
 }
 if(!art&&family==='bat'){
  const horse=genus==='Rhinolophus',large=genus==='Eptesicus';form=horse?'horseshoe-bat':large?'serotine-bat':'pipistrelle';
  const wings=large?'M43 39C30 24 20 17 8 25Q7 37 4 48Q13 40 19 52Q25 48 29 62Q36 57 43 67Q47 65 50 60Q53 65 57 67Q64 57 71 62Q75 48 81 52Q87 40 96 48Q93 37 92 25C80 17 70 24 57 39Z':'M43 40C33 29 22 22 11 29Q8 39 4 52Q13 44 20 57Q26 50 31 65Q38 60 44 68Q47 66 50 61Q53 66 56 68Q63 60 69 65Q74 50 80 57Q87 44 96 52Q92 39 89 29C78 22 67 29 57 40Z';
  art=p(wings,mid)+detail(line('M44 45L12 30L9 45M44 45L20 55M44 45L31 63M56 45L88 30L91 46M56 45L80 55M56 45L69 63',dark,1.6))
   +p('M42 43Q39 34 44 29Q49 25 54 29Q60 34 58 42Q59 49 61 54Q62 66 51 73Q39 68 39 56Q39 49 42 43Z')+ear(44,34,horse?17:large?12:10)+ear(55,34,horse?16:large?11:9)
   +p('M41 35Q43 26 51 27Q61 28 60 38L55 44L46 43Z',light,ink,1.8)+eyes(46,35,1.4)+eyes(55,35,1.4)+detail(p(horse?'M48 37Q46 32 51 32Q56 34 53 38L54 42L48 42Z':'M48 39L53 39L51 42Z',pink,ink,1.1))+p('M45 66L42 78L47 77L50 70L53 77L58 78L55 65Z',dark,ink,1.5);
 }else if(!art&&family==='flying-squirrel'){
  const giant=genus==='Petaurista';form=giant?'giant-flying-squirrel':'siberian-flying-squirrel';
  art=p(giant?'M44 68Q15 60 8 78Q3 93 17 94Q30 95 43 78Z':'M44 68Q23 66 17 81Q17 92 28 90L47 78Z',light)
   +p('M34 34Q24 44 8 38C11 49 15 59 23 65Q25 71 24 79Q37 73 49 78Q62 72 77 79Q76 72 78 65C86 59 90 49 92 38Q76 44 65 34Z',light)
   +p('M35 45Q34 30 47 27Q42 16 53 12Q67 9 73 23Q78 35 65 42L65 59Q71 76 54 82Q35 80 33 64Z')
   +p('M35 41Q26 34 18 32Q12 32 9 37Q9 41 15 42L24 40Q28 47 35 52Z')+p('M65 41Q76 33 84 33Q90 33 93 38Q92 42 86 42L77 40Q73 47 65 52Z')
   +p('M38 66Q31 70 25 74Q22 78 26 83Q30 83 34 79L46 74Z',dark)+p('M62 66Q69 70 76 74Q80 79 75 84Q71 84 66 79L55 75Z',dark)+ear(49,20,7)+ear(66,20,7)+eyes(56,24,2)+eyes(69,26,1.8)+detail(p('M62 31L68 32L65 36Z',pink,'none',0)+line('M19 46Q25 62 35 68M81 46Q75 63 64 68',mid,1.6));
 }else if(!art&&['squirrel','marmot','beaver','dormouse','vole','jerboa','mole-rat','lagomorph','shrew','mole','hedgehog','tenrec','desman','porcupine'].includes(family)){
  const hare=family==='lagomorph'&&genus==='Lepus',rabbit=family==='lagomorph',ground=family==='squirrel'&&genus!=='Sciurus',masked=family==='dormouse'&&genus==='Eliomys',spiny=['hedgehog','tenrec','porcupine'].includes(family);
  if(family==='squirrel'||family==='dormouse')art=p(family==='squirrel'&&!ground?'M40 65C23 69 7 61 7 43Q4 24 16 16Q34 7 35 26Q36 35 27 36Q28 23 20 25Q11 30 17 45Q23 57 44 53Z':ground?'M33 63Q11 55 8 70Q7 79 22 82L42 74Z':'M37 64Q14 52 8 67Q4 81 18 86Q30 87 44 74Z',light);
  else if(family==='beaver'){
   const td='M34 65Q12 60 5 74Q1 85 12 89Q26 94 42 78Z';art=p(td,dark)+clipped(td,line('M8 75L24 88M16 68L32 81M9 83L27 70M15 89L36 75',light,1.3),'tail');
  }else if(['shrew','desman','jerboa','mole-rat'].includes(family))art=p(family==='jerboa'?'M37 69Q19 72 12 87L5 90L4 94L14 94Q27 79 45 77Z':family==='desman'?'M30 66C13 64 7 76 4 87Q14 83 20 77L39 73Z':family==='shrew'?'M29 68Q13 61 5 77L7 82Q17 69 36 75Z':'M32 67L16 71L11 79L19 80L38 74Z',dark,ink,1.9);
  else if(rabbit)art=p('M31 66Q18 60 16 71Q17 79 33 77Z',cream);
  else if(family==='porcupine')art=p('M32 63L15 74L14 84L27 80L42 72Z',dark);
  let d=family==='squirrel'&&!ground?'M35 61C31 52 36 44 46 40Q51 34 53 28Q59 20 67 25Q77 29 77 37Q77 42 74 45Q84 45 85 50Q86 55 73 56Q72 66 65 75Q59 84 48 85Q36 85 31 77C27 71 29 65 35 61Z':family==='squirrel'?'M27 60Q31 44 49 45L57 34Q65 28 74 35L77 45L88 50L86 57L75 60Q72 78 52 81Q31 84 27 69Z':family==='marmot'?'M25 60C24 46 32 38 47 37Q53 33 55 30Q63 24 71 31Q78 36 77 44Q87 44 88 51Q90 57 77 62Q75 73 66 80Q54 88 41 84Q28 82 24 74C21 68 22 64 25 60Z':family==='beaver'?'M28 59C27 47 34 39 46 36Q49 31 52 25Q60 18 69 23Q79 27 79 36Q80 41 77 45Q86 46 89 50Q92 56 76 63Q77 74 68 81Q58 89 44 87Q30 85 26 77C22 71 23 64 28 59Z':family==='dormouse'?'M29 60C28 49 37 42 49 43Q52 38 55 32Q63 23 71 29Q78 34 77 43Q85 46 87 50Q88 56 74 58Q73 69 65 76Q53 85 39 81Q29 79 26 72C24 68 26 63 29 60Z':family==='vole'?'M24 64C23 53 31 44 45 43Q54 36 64 39Q73 42 75 51Q83 52 84 57Q87 64 73 69Q68 78 57 81Q42 85 30 79Q22 75 24 64Z':family==='jerboa'?'M35 62Q29 49 46 43L54 32Q61 24 71 29L77 39L87 45L85 52L73 55L69 67Q66 81 51 83Q33 86 29 75Z':family==='mole-rat'?'M21 61Q22 43 44 42Q63 37 76 50L87 52L92 59L91 68L77 71Q67 82 45 80L26 75Q17 69 21 61Z':rabbit?(hare?'M25 57Q29 40 47 42Q56 39 65 42L70 31Q77 24 85 33L89 44L98 49L95 56L83 58L75 54Q69 71 49 73L29 70Q20 64 25 57Z':'M24 60Q26 42 45 43Q57 39 68 46L74 35Q81 29 88 39L90 48L98 53L95 59L83 61L75 57Q69 76 48 78L28 74Q19 67 24 60Z'):family==='shrew'?'M23 64Q28 51 48 53Q64 46 76 54L85 57L98 65L97 70L86 70L75 65Q64 78 44 77L28 75Q18 70 23 64Z':family==='desman'?'M23 60Q28 44 49 46Q65 42 77 54L85 56L98 66L96 73L88 72L84 66L75 64Q64 79 43 77L27 72Q18 66 23 60Z':family==='mole'?'M23 61Q24 42 45 42Q64 39 77 53L87 55L97 64L96 70L84 71L76 65Q65 80 43 78L27 74Q18 68 23 61Z':family==='hedgehog'?'M19 60Q19 38 41 35Q61 32 73 49L82 52L96 65L94 72L84 73L73 65Q64 81 42 78L24 73Q15 67 19 60Z':family==='tenrec'?'M22 56Q24 32 46 32Q63 31 75 49L86 53L98 65L95 73L84 72L74 64Q64 81 42 77L27 72Q18 65 22 56Z':'M17 53Q17 27 42 25Q64 22 77 46L87 49L96 60L94 69L82 70L74 61Q64 79 41 75L22 68Q13 61 17 53Z';
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
   art+=p(family==='mole'?'M65 60Q71 58 77 64L82 74L77 79L72 74L67 80L63 74L59 78L58 70Z':family==='desman'?'M67 63L80 66L85 77L77 81L74 74L69 81L63 76Z':'M68 66Q76 65 80 73L88 78L82 82L72 78L64 73Z',light,ink,1.7)+p('M35 68Q27 69 28 77L19 81L22 85L38 80L44 71Z',light,ink,1.8)+eyes(80,family==='shrew'?58:family==='mole-rat'?54:56,family==='mole'?1:1.3)+detail(dot(family==='mole-rat'?91:97,family==='mole-rat'?62:family==='desman'?68:family==='shrew'?66:65,1.7,pink)+line('M75 74L79 79M69 74L68 80M25 81L22 85',cream,1.3));
   if(family==='mole-rat')art+=detail(p('M87 67L92 67L91 73L87 72Z',cream,ink,1));
  }else{
   const upright=['squirrel','marmot','beaver','dormouse','jerboa'].includes(family)&&!ground;
   art+=p(upright?'M38 69C28 69 24 77 28 83Q31 88 39 86L47 83Q51 81 47 78Q42 78 39 80Q38 77 43 74Z':'M34 67Q28 70 27 75Q24 77 20 78Q16 80 19 82Q26 85 34 80Q39 77 43 72Z',dark,ink,1.8)+p(upright?'M58 70Q68 72 69 81Q70 84 76 85Q81 87 78 90Q70 93 64 89L60 83Q55 80 53 76Z':'M66 65Q72 68 72 74Q71 77 77 78Q82 80 79 83Q74 87 68 83Q64 81 63 77L59 72Z',dark,ink,1.8);
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
   art+=p(orang?'M35 37C24 36 19 45 18 55Q15 68 10 78Q6 85 11 89Q17 94 24 87Q26 83 24 77Q25 65 31 57Q37 53 39 47Z':'M36 41C26 40 20 47 23 57Q22 68 16 80Q13 87 19 90Q25 94 29 88L30 77Q32 67 35 60Q38 55 43 52Z',mid)
    +p(orang?'M68 37C80 37 85 45 84 57Q85 69 92 79Q97 86 91 90Q85 94 78 86Q76 81 76 75Q75 65 69 57Q63 54 62 47Z':'M66 42C76 41 82 49 80 58Q80 68 87 81Q90 88 84 91Q78 94 74 88L71 76Q68 67 66 61Q63 55 60 52Z',mid);
   art+=detail(p(orang?'M42 25Q47 15 60 18Q74 20 70 33L64 44L51 45L41 36Z':'M47 27Q53 19 64 24L70 32L65 42L54 44L45 36Z',pink,'none',0));
   if(orang)art+=p('M43 24Q33 24 35 34Q37 44 45 39M66 23Q77 21 79 32Q80 41 70 39',light,ink,1.5);
   art+=eyes(49,29,1.7)+eyes(63,29,1.7)+detail(p('M50 35Q56 31 63 35L65 40L59 44L50 40Z',light,'none',0)+line('M51 40Q58 43 63 40M14 83L16 88M84 82L86 89',dark,1.3));
   if(orang)art+=p('M33 42L27 49L30 55M71 43L77 49L74 55',c,ink,1.5);
  }else{
   art=p('M29 58Q17 62 19 75L16 86L24 91L35 88L37 77L46 66Z',dark)+p('M56 59Q45 67 50 78L46 88L54 91L67 88L69 77L74 65Z',dark);
   body=gorilla?(mountain?'M17 47Q22 24 44 26L55 23Q60 12 73 19Q85 23 82 36L90 41L90 50L81 55L71 51L66 63Q50 75 27 67Q15 61 17 47Z':'M18 48Q21 26 42 28L53 26Q58 16 71 20Q84 23 81 36L89 40L90 50L81 55L70 50L65 62Q47 74 27 67Q16 62 18 48Z'):'M22 48Q28 32 45 34L55 30Q58 20 70 23Q81 27 78 38L88 42L88 50L78 54L68 49L61 63Q43 72 27 64Q18 58 22 48Z';
   art+=p(body)+p(gorilla?'M60 39C51 39 46 49 50 61Q53 72 58 83L57 90Q64 94 72 91Q78 88 76 84L72 79Q68 69 66 60Q65 52 71 47Z':'M58 41Q49 43 50 57L59 81L57 88L68 91L75 86L69 78L66 59L69 47Z',mid)+p(gorilla?'M77 45C69 48 67 57 71 66Q75 76 78 85L79 91Q87 95 94 91Q99 87 94 82L90 79Q87 70 84 62Q81 56 85 49Z':'M73 45Q67 50 70 63L80 81L79 88L91 91L96 86L89 78L82 61L83 49Z',c);
   art+=detail(p(gorilla?'M62 25Q69 19 77 25L80 34L86 41L85 47L77 50L67 45L62 36Z':'M60 29Q67 23 75 29L77 37L85 42L84 48L75 50L64 43Z',gorilla?dark:pink,'none',0)+line('M63 28L76 28',black,2))+eyes(70,30,1.5)+detail(p('M73 36Q82 33 86 41L85 47L77 49L70 43Z',light,'none',0)+line('M76 44L84 44M62 87L62 91M67 87L67 91M83 87L83 91M89 87L89 91',dark,1.3));
   if(gorilla)art+=detail(p('M25 34Q37 25 49 32L51 45Q36 51 24 46Z',light,'none',0));
   flip=!gorilla;
  }
 }else if(!art&&family==='gibbon'){
  const siamang=genus==='Symphalangus',whitehands=genus==='Hylobates';form=siamang?'siamang':whitehands?'white-handed-gibbon':'crested-gibbon';
  art=p('M40 56C31 57 26 65 30 75Q34 82 41 88L39 92Q39 95 44 95Q49 95 52 87Q49 78 44 71L50 64Z',dark)+p('M58 56C67 56 74 64 70 76Q67 82 60 87L64 91Q65 95 59 95Q54 95 50 87Q54 78 58 72L51 64Z',dark);
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
   art+=p(body)+p('M34 42C24 41 19 49 21 60Q21 69 16 81Q14 88 19 91Q26 94 32 90Q37 87 34 83L31 79Q32 70 35 62Q37 55 43 51Z',mid)+p('M68 42C78 42 83 50 82 60Q83 70 89 82Q91 88 86 91Q79 95 73 90Q68 87 71 83L74 79Q72 69 67 60Q65 55 60 51Z',mid);
   art+=detail(p('M44 26Q52 17 64 23L70 33L66 45L55 49L43 40Z',prob?pink:japan?red:light,'none',0));
   if(mandrill){const faceBlue=female?paint('#9caaa6'):paint('#527fa8'),faceRed=female?paint('#ab807b'):paint('#c74c49');art+=detail(p('M47 29L52 26L54 44L49 41Z',faceBlue,'none',0)+p('M60 26L65 29L64 42L59 44Z',faceBlue,'none',0)+p('M54 28L59 28L62 40L57 47L52 39Z',faceRed,'none',0));}
   if(prob)art+=p('M55 29Q67 29 67 43Q66 51 57 49L52 44L54 37Z',pink,ink,1.5);
   art+=eyes(49,29,1.6)+eyes(63,29,1.6)+detail(line('M49 43Q57 49 64 42M21 86L23 91M79 86L81 91',dark,1.3));
   if(gelada&&!female)art+=p('M35 43Q27 31 39 23L44 18L46 29L42 39L47 48L43 67L35 74L32 62L28 57Z',dark,ink,1.8)+p('M70 31Q82 35 80 49L84 59L75 70L71 57L67 47Z',dark,ink,1.8);
   if(gelada)art+=detail(p('M48 53Q55 48 62 55L58 65Q49 68 45 57Z',red,'none',0));
   if(japan||tibetan)art+=detail(p('M32 52Q45 47 52 61L46 75L34 70Z',light,'none',0));
  }else{
   const td=family==='langur'?'M31 49C14 48 6 33 12 18Q18 6 10 5L8 9Q17 14 10 25Q2 44 24 58Z':family==='guenon'?'M30 54C15 53 3 64 7 78Q9 92 22 91L23 86Q12 88 13 78Q11 65 35 64Z':/nemestrina/.test(latin)?'M29 50Q13 40 10 52Q10 64 20 61L20 57Q14 60 15 54Q17 48 29 57Z':baboon?'M30 46C23 27 9 26 8 43L11 57L17 57Q11 39 17 37Q23 35 24 50L35 56Z':'M31 52C20 33 3 37 7 57Q9 68 18 67L18 61Q8 60 13 49Q17 42 25 61Z';
   art=p(td,dark)+p('M30 60C22 63 19 71 23 78Q23 83 19 88Q19 92 27 93L35 91Q41 90 41 84L41 79Q46 72 47 67Z',mid)+p('M59 56C52 59 51 68 56 77L54 87Q54 91 61 93L68 91Q76 88 72 84L70 79Q71 69 69 62Z',mid);
   body=family==='langur'?'M28 48Q33 32 50 34L58 27Q61 18 71 21Q81 24 78 36L86 40L86 47L76 53L67 49L62 62Q48 73 32 66Q23 60 28 48Z':family==='macaque'?'M23 48Q26 29 47 31L58 27Q61 18 73 22Q84 27 80 39L89 44L88 51L78 55L68 49L63 63Q45 76 29 68Q18 61 23 48Z':baboon?'M24 48Q29 30 47 34L59 28Q62 17 74 21L80 31L88 35L98 45L96 53L86 55L75 48L68 59Q56 74 35 69Q21 63 24 48Z':'M25 49Q30 34 48 36L59 28Q62 18 73 22Q84 27 80 39L89 44L88 51L78 55L68 49L63 60Q50 75 32 68Q20 61 25 49Z';
   art+=p(body)+p('M65 40C57 40 53 49 58 59Q60 70 65 80L64 87Q63 91 69 92L76 91Q83 88 79 84L75 78Q73 68 72 59Q70 52 75 47Z')+p('M78 45C70 47 68 57 74 65Q78 74 83 81L82 88Q81 92 87 93L93 91Q100 88 96 84L92 79Q88 69 85 61Q83 55 87 49Z',mid)+ear(70,28,7,true)+detail(p(baboon?'M76 30L84 35L97 44L95 51L86 53L74 46Z':'M69 27L78 31L78 39L87 45L85 51L75 52L66 43Z',pink,'none',0))+eyes(76,31,1.5)+detail(line('M85 47L94 48M70 86L72 91M87 86L89 91',dark,1.3));
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
  art+=p('M43 40C33 38 27 44 28 53Q27 61 18 64L13 61Q8 59 9 65Q10 71 17 71Q24 72 30 65L40 55Q44 52 49 49Z',light,ink,2)+p('M65 46C73 46 79 53 75 62Q79 69 85 75Q90 79 86 84Q82 89 77 82L65 68Q58 60 59 51Z',mid,ink,2);
  art+=detail(p('M54 27Q64 19 74 28L77 37L68 47L56 43L50 35Z',light,'none',0)+p('M54 28L62 27L63 36L56 39ZM67 28L74 31L73 40L66 37Z',dark,'none',0))+eyes(58,31,2.5)+eyes(70,33,2.3)+detail(p('M62 39L68 40L65 44Z',pink,'none',0)+line('M12 65L15 70M81 79L84 85',cream,1.2));
 }else if(!art&&family==='galago'){
  form='galago-perched';
  art=p('M35 66C18 65 5 77 10 87Q17 97 28 89L26 84Q17 91 15 86Q10 79 29 76L43 75Z',light)
   +p('M39 61C28 57 21 64 22 73Q23 83 38 83Q37 87 29 91Q25 94 31 96Q39 96 46 89L51 77Q50 67 39 61Z',dark)+p('M60 64Q70 60 74 68Q78 76 73 86Q75 90 82 91Q87 95 81 97Q74 98 65 90Q62 84 63 78Z',dark)
   +p('M32 53Q33 38 47 35L55 24Q63 18 72 25Q82 32 77 43L67 50L69 64Q71 77 55 81Q39 85 31 71Q25 62 32 53Z')+ear(57,30,23,true)+ear(74,32,20,true)
   +p('M61 45Q68 35 70 25L68 15Q65 10 69 8Q74 6 76 13L77 29Q78 43 68 54Z',mid,ink,1.8)+p('M42 46C33 45 28 52 31 60Q33 65 39 69Q45 73 47 67Q45 63 40 60Q42 56 47 52Z',light,ink,1.8)
   +detail(p('M52 29Q64 22 74 31L77 40L68 48L55 44L49 36Z',light,'none',0))+eyes(58,33,2.6)+eyes(71,35,2.4)+detail(p('M63 41L69 41L67 46Z',pink,'none',0)+line('M70 9L71 16M74 11L73 18',cream,1.2));
 }else if(!art&&family==='tarsier'){
  const filipino=genus==='Carlito';form=filipino?'philippine-tarsier':'spectral-tarsier';
  art=p('M36 68C20 65 6 76 10 87Q15 95 24 89L22 85Q15 91 14 85Q10 78 31 77L44 77Z',light)
   +p('M42 59C29 55 23 62 25 71Q26 79 37 81Q38 85 32 90Q27 94 33 96Q41 97 51 87Q54 81 54 73Q51 63 42 59Z',dark)
   +p('M58 63Q69 58 76 64Q82 70 77 77Q75 80 71 82L67 90Q69 92 75 92Q81 94 77 97Q71 99 63 96Q57 94 60 86Q62 80 65 76L56 73Z',dark)
   +p(filipino?'M35 49Q30 39 42 33Q37 18 51 14Q67 10 77 25Q83 38 70 46L68 58Q75 72 59 80Q43 86 33 73Q27 61 35 49Z':'M34 49Q29 37 42 31Q39 17 53 14Q69 12 77 27Q81 41 68 46L68 60Q75 74 58 81Q41 86 32 72Q26 59 34 49Z')
   +ear(45,26,12,true)+ear(71,26,11,true)+p('M43 44Q34 43 32 50Q31 57 39 63Q45 70 49 64Q47 60 42 55Q43 52 49 50Z',mid,ink,1.8)+p('M65 45Q74 43 77 50Q80 58 72 64Q66 71 62 65Q64 60 68 56Q67 52 60 50Z',mid,ink,1.8)
   +detail(p('M43 25Q57 16 72 26L76 37L66 47L47 43L39 34Z',light,'none',0))+eyes(49,30,filipino?3.5:3.2)+eyes(66,31,filipino?3.7:3.4)+detail(p('M54 40L61 40L58 45Z',pink,'none',0)+line('M37 89L33 95M64 92L62 97M72 92L75 97',light,1.2));
 }else if(!art&&['lemur','aye-aye','loris','galago','tarsier'].includes(family)){
  const ring=morph==='ring-tailed-lemur',sifaka=morph==='sifaka',indri=morph==='indri',mouse=morph==='mouse-lemur',aye=family==='aye-aye',loris=family==='loris',galago=family==='galago',tarsier=family==='tarsier';
  const td=ring?'M39 67C19 66 10 50 13 32Q14 14 7 8Q24 8 25 28Q23 47 46 54Z':aye?'M39 66C17 55 4 68 8 83Q13 96 29 90L43 76Z':galago||tarsier?'M38 69C20 67 6 79 12 89Q20 98 27 86L24 82Q19 90 16 87Q10 80 27 78L44 78Z':!indri&&!sifaka&&!loris?'M38 65Q15 57 7 73Q4 87 17 91L36 80L45 72Z':null;
  if(td)art+=p(td,aye?dark:light);
  if(ring)art+=clipped(td,line('M9 15L24 14M10 25L27 25M10 37L29 38M15 48L35 48M24 58L43 58',black,4),'tail');
  art+=p(tarsier||galago?'M40 64Q23 61 23 75L34 84L30 91L41 94L49 84L43 74L50 68Z':'M37 67Q23 70 24 83L37 91L48 80Z',dark)+p(tarsier||galago?'M59 65Q78 61 79 75L67 85L71 91L60 94L51 84L58 74L51 68Z':'M62 67Q79 70 78 83L65 92L54 80Z',dark);
  body=aye?'M32 50Q31 37 44 33Q40 20 52 15Q68 9 76 24Q80 36 68 44L70 58Q79 75 63 84Q44 92 29 77Q20 64 32 50Z':loris?'M31 50Q27 36 41 30Q39 16 53 13Q69 8 77 25Q83 39 69 47L72 59Q78 77 60 85Q41 91 29 77Q20 65 31 50Z':tarsier?'M36 51Q31 39 42 33Q37 19 49 14Q65 8 74 22Q82 35 68 44L69 58Q76 74 59 82Q43 89 31 76Q23 64 36 51Z':sifaka?'M35 49Q32 34 44 29Q42 17 53 13Q69 10 75 26L71 39Q82 54 72 73Q64 89 46 85Q26 79 28 62Q28 54 35 49Z':indri?'M33 48Q29 34 43 28Q40 16 54 11Q72 9 78 26L73 40Q85 55 73 74Q62 91 43 85Q24 79 26 62Q27 53 33 48Z':'M34 51Q31 38 45 33Q41 21 52 16Q67 10 76 26Q81 38 69 45L70 60Q78 76 62 84Q43 91 30 77Q22 65 34 51Z';
  art+=p(body)+ear(45,26,aye?18:mouse?17:galago?22:tarsier?11:indri?11:8,true)+ear(69,25,aye?17:mouse?16:galago?20:tarsier?10:indri?10:8,true);
  art+=p(sifaka||indri?'M35 42C25 40 19 47 21 57Q21 65 16 75Q14 81 20 85Q26 88 29 83L29 75Q30 66 35 60Q38 55 43 52Z':'M36 47Q26 49 27 61L35 73L43 68L36 58L43 52Z',mid)+p(aye?'M66 45Q81 45 81 59L86 66L84 75L76 75L72 61L61 53Z':sifaka||indri?'M68 42C79 41 85 49 83 58Q83 67 89 78Q92 84 86 87Q79 90 75 84L73 75Q69 66 65 59Q63 54 59 51Z':'M65 47Q77 49 76 61L66 73L58 68L66 57L59 52Z',mid);
  art+=detail(p(ring?'M47 26Q58 17 70 26L73 37L63 47L48 42Z':sifaka||indri?'M47 24Q59 15 70 26L71 37L60 45L48 39Z':'M44 26Q56 17 70 26L73 38L61 47L46 40Z',sifaka||indri?black:light,'none',0));
  const er=tarsier?3.6:mouse||galago?2.7:aye?2.3:1.9;
  if(ring||loris)art+=detail(p('M46 27L54 26L56 37L48 39ZM61 26L69 28L69 39L61 37Z',dark,'none',0));
  art+=eyes(51,30,er)+eyes(66,30,er)+detail(p('M56 38L63 38L60 43Z',pink,'none',0)+line('M52 43Q60 48 67 42',dark,1.2));
  if(aye)art+=line('M81 67L94 60M81 70L96 69M81 73L91 79',light,1.6);
  if(tarsier||galago)art+=detail(line('M32 87L26 91M35 89L33 95M65 88L72 93M62 90L61 95',light,1.4));
  if(morph==='ruffed-lemur')art+=p('M45 34L37 30L37 44L46 49M69 34L79 31L78 45L69 48Z',cream,ink,1.5);
  flip=ring||galago;
 }
 if(body){const adjusted=softenBodyJoins(adaptBody(body,anatomy),family==='elephant'?1.65:1.25);art=art.split('d=\"'+body+'\"').join('d=\"'+adjusted+'\"');}
 if(!art)throw new Error('Missing mammal anatomy: '+family+' / '+latin);
 const aura=skin==='alfa'?'<g data-mammal-aura="true">'+dot(50,50,43,'#e8d794').replace('/>',' opacity=".22"/>')+line('M14 18L17 24L23 27L17 30L14 36L11 30L5 27L11 24Z','#b99c61',1.5)+'</g>':'';
 return '<svg viewBox="0 0 100 100" aria-hidden="true" data-mammal-family="'+family+'" data-mammal-morph="'+form+'" data-mammal-version="3.19.4" data-mammal-polish="3.19.9">'+aura+'<g'+(flip?' transform="translate(100 0) scale(-1 1)"':'')+'>'+art+'</g></svg>';
}
render.classify=classify;render.families=families;render.morphology=morphology;
root.ATLAS_MAMMAL_ART_V3194=render;
if(typeof module!=='undefined'&&module.exports)module.exports={classifyMammal:classify,renderMammal:render,MAMMAL_FAMILIES:families,mammalMorphology:morphology,MAMMAL_SPECIES_ANATOMY:speciesAnatomy};
})(typeof globalThis!=='undefined'?globalThis:this);
