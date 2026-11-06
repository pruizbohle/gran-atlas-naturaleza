'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {classifyHerp,renderHerp}=require('../www/js/herp-art-v3192.js');
const specimens=[
['Rana bermeja','Rana temporaria','reptile','frog'],
['Rana goliat','Conraua goliath','salamander','frog'],
['Rana de uñas africana','Xenopus laevis','salamander','frog'],
['Sapo corredor','Epidalea calamita','reptile','toad'],
['Sapo mongol','Strauchbufo raddei','reptile','toad'],
['Rana de lluvia del desierto','Breviceps macrops','salamander','toad'],
['Salamandra alpina','Salamandra atra','mustelid','salamander'],
['Salamandra común','Salamandra salamandra','salamander','salamander'],
['Tritón crestado','Triturus cristatus','salamander','newt'],
['Salamandra gigante china','Andrias davidianus','salamander','giant-salamander'],
['Tortuga laúd','Dermochelys coriacea','tortoise','sea-turtle'],
['Tortuga mediterránea','Testudo hermanni','tortoise','land-tortoise'],
['Tortuga radiada','Astrochelys radiata','tortoise','land-tortoise'],
['Galápago caspio','Mauremys caspica','tortoise','pond-turtle'],
['Cocodrilo del Nilo','Crocodylus niloticus','crocodile','crocodile'],
['Cocodrilo de hocico estrecho','Mecistops cataphractus','crocodile','slender-crocodile'],
['Cobra india','Naja naja','snake','cobra'],
['Cobra real','Ophiophagus hannah','snake','cobra'],
['Víbora cornuda','Cerastes cerastes','snake','viper'],
['Pitón reticulada','Malayopython reticulatus','reptile','python'],
['Mamba negra','Dendroaspis polylepis','snake','mamba'],
['Krait común','Bungarus caeruleus','snake','krait'],
['Culebra de collar','Natrix natrix','snake','snake'],
['Lución europeo','Anguis fragilis','reptile','glass-lizard'],
['Camaleón de Jackson','Trioceros jacksonii','lizard','chameleon'],
['Camaleón pantera','Furcifer pardalis','lizard','chameleon'],
['Gecko tokay','Gekko gecko','lizard','gecko'],
['Geco cola de hoja satánico','Uroplatus phantasticus','lizard','gecko'],
['Dragón volador común','Draco volans','reptile','flying-lizard'],
['Dragón de Komodo','Varanus komodoensis','reptile','monitor'],
['Varano del Nilo','Varanus niloticus','lizard','monitor'],
['Lagarto egipcio de cola espinosa','Uromastyx aegyptia','lizard','spiny-lizard'],
['Lagarto ocelado','Timon lepidus','reptile','lizard'],
['Lagarto cabeza de sapo','Phrynocephalus versicolor','lizard','lizard']
];
function sprite(name,latin,kind,skin='normal'){return renderHerp({name,latin,kind,color:'#719c7a'},'#719c7a',skin);}
test('3.19.2 classifies 33 representative herpetofauna without changing catalog categories',()=>{
 for(const [name,latin,kind,expected] of specimens){
  assert.equal(classifyHerp({name,latin,kind}),expected,name);
 }
});
test('all 3.19.2 specimens render valid SVG viewBox and specific family marker',()=>{
 for(const [name,latin,kind,family] of specimens){
  const svg=sprite(name,latin,kind);
  assert.match(svg,/^<svg viewBox="0 0 100 100"/,name);
  assert.ok(svg.includes('data-herp-family="'+family+'"'),name);
  assert.ok(svg.includes('<path')||svg.includes('<ellipse'),name);
  assert.ok(!svg.includes('NaN')&&!svg.includes('undefined'),name);
 }
});
test('herpetofauna silhouettes retain distinct path geometry between groups',()=>{
 const representative=['Rana bermeja','Sapo corredor','Tritón crestado','Tortuga laúd','Cobra india','Víbora cornuda','Camaleón pantera','Gecko tokay','Dragón volador común','Dragón de Komodo','Cocodrilo del Nilo'];
 const geom=representative.map(name=>{
  const [n,l,k]=specimens.find(x=>x[0]===name);
  return [...sprite(n,l,k).matchAll(/<path d="([^"]+)"/g)].map(x=>x[1]).join('|');
 });
 assert.equal(new Set(geom).size,representative.length);
});
test('existing fish and mammals are not captured by the reptile art router',()=>{
 for(const x of [
  {name:'Pez cabeza de serpiente del norte',latin:'Channa argus',kind:'fish'},
  {name:'Tiburón blanco',latin:'Carcharodon carcharias',kind:'fish'},
  {name:'Nutria europea',latin:'Lutra lutra',kind:'mustelid'},
  {name:'Cálao rinoceronte',latin:'Buceros rhinoceros',kind:'forestbird'}
 ])assert.equal(renderHerp(x,'#789687','normal'),null,x.name);
});
test('melanic and albino drawings retain anatomical family and viewport',()=>{
 for(const [name,latin,kind,family] of specimens){
  for(const skin of ['albino','melanico','alfa']){
   const svg=sprite(name,latin,kind,skin);
   assert.ok(svg.includes('data-herp-family="'+family+'"'),name+' '+skin);
   assert.ok(!svg.includes('NaN')&&!svg.includes('undefined'),name+' '+skin);
  }
 }
});
