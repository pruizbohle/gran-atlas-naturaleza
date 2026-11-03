const test=require('node:test');
const assert=require('node:assert/strict');
const {sprites}=require('./helpers/sprites.cjs');
const api=sprites();
const skins=['normal','albino','melanico','alfa'];
const geometry=svg=>svg.replace(/(?:fill|stroke)="[^"]*"/g,'').replace(/opacity="[^"]*"/g,'');
test('all species and configured sexes render in the existing SVG viewport',()=>{
 for(const [id,sp] of Object.entries(api.SPECIES)){
   for(const skin of skins){
     const svg=api.getSpriteMarkup(id,skin);
     assert.match(svg,/^<svg viewBox="0 0 100 100" aria-hidden="true">/);
     assert.ok(svg.endsWith('</svg>'),id);
     assert.doesNotMatch(svg,/NaN|undefined|Infinity|<script|<foreignObject/,id+':'+skin);
     assert.equal(api.getSpriteMarkup(id,skin),svg,'cache must remain deterministic');
   }
   if(api.SEXUAL_DIMORPHISM[id]){
     const male=api.getSpriteMarkup(id,'normal','male'),female=api.getSpriteMarkup(id,'normal','female');
     assert.notEqual(male,female,id+' dimorphism');
     assert.equal(api.getSpriteMarkup(id,'melanico','male'),api.getSpriteMarkup(id,'melanico'),'rare skin sex handling');
   }
 }
});
test('similar African species retain different geometry even without color',()=>{
 const groups=[['af_cocodrilo_nilo','af_cocodrilo_hocico'],['af_elefante_sabana','af_elefante_bosque'],['af_leon','af_leopardo','af_guepardo','af_serval','af_caracal'],['af_fenec','af_licaon','af_chacal_dorado','af_hiena_manchada'],['af_jirafa','af_okapi'],['af_orix','af_springbok','af_antilope_bongo','af_bufalo_cafre','af_nu_azul'],['af_secretario','af_aguila_pescadora'],['af_tortuga_laúd','af_tortuga_radiada']];
 for(const group of groups)assert.equal(new Set(group.map(id=>geometry(api.getSpriteMarkup(id)))).size,group.length,group.join(', '));
});
test('special skins preserve the normal anatomy and add readable contrast',()=>{
 for(const id of Object.keys(api.SPECIES)){
   const normal=api.getSpriteMarkup(id),pale=api.getSpriteMarkup(id,'albino'),dark=api.getSpriteMarkup(id,'melanico'),notable=api.getSpriteMarkup(id,'alfa');
   assert.notEqual(pale,dark,id);
   // New shared geometry uses paint-only skin changes; no anatomical drift.
   if(api.polishedSpeciesSprite(id,'normal')){
     assert.equal(geometry(normal),geometry(pale),id+' pale anatomy');
     assert.equal(geometry(normal),geometry(dark),id+' dark anatomy');
   }
   assert.match(notable,/stroke="#84612e"/,id+' outlined Notable mark');
 }
});


test('Beta 3.7 oscurece pigmentos melánicos de mamíferos, reptiles y aves',()=>{
 const lum=hex=>{const x=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return .2126*x[0]+.7152*x[1]+.0722*x[2];};
 for(const id of ['af_leon','af_cocodrilo_nilo','af_gerenuc','af_jacana_africana','zorro_rojo','af_turaco']){
  const svg=api.getSpriteMarkup(id,'melanico');
  const fills=[...svg.matchAll(/fill="(#[0-9a-fA-F]{6})"/g)].map(x=>x[1].toLowerCase()).filter(x=>x!=='#d8c46b');
  assert.ok(fills.length>0,id+' no tiene superficies');
  assert.ok(fills.every(x=>lum(x)<86),id+' tiene superficies claras '+fills.join(','));
  assert.ok(fills.some(x=>lum(x)<42),id+' no tiene masa oscura');
 }
});


test('Beta 3.9 elimina los sprites circulares para todas las especies y variantes',()=>{
 assert.ok(Object.keys(api.SPECIES).length>=406);
 for(const [id] of Object.entries(api.SPECIES)){
  for(const skin of skins){
   const svg=api.getSpriteMarkup(id,skin);
   const body=svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
   assert.doesNotMatch(body,/^<circle\b[^>]*\/>$/,id+' '+skin+' círculo genérico');
   assert.match(body,/<(?:path|ellipse|polygon|rect)\b/i,id+' '+skin+' sin anatomía');
  }
 }
});

test('Beta 3.9 fauna africana nueva tiene siluetas diferenciadas',()=>{
 const named=['af_macaco_berberia','af_antilope_sable','af_calao_terrestre','af_pangolin_temminck','af_dugongo','af_manta_gigante','af_delfin_jorobado_indico','af_martin_malaquita'];
 for(const id of named){
   assert.ok(api.SPECIES[id],id+' sin ficha');
   const svg=api.getSpriteMarkup(id,'normal');
   assert.ok(svg.includes('<path'),id+' sin detalles propios');
   assert.doesNotMatch(svg,/<circle cx="50" cy="50" r="24"/,id);
   assert.notEqual(api.getSpriteMarkup(id,'melanico'),svg,id+' skin melánico ignorado');
 }
 const marine=['af_dugongo','af_manta_gigante','af_delfin_jorobado_indico'];
 assert.equal(new Set(marine.map(id=>geometry(api.getSpriteMarkup(id)))).size,3,'mamíferos/pez pelágicos deben distinguirse');
});


test('Beta 3.10 conserva sprites propios distinguibles y sin círculos',()=>{
 const ids=['af_flamenco_enano','af_pelicano_blanco','af_tortuga_aldabra','af_loro_negro_seychelles','af_tiburon_puntas_negras'];
 for(const id of ids){
  const normal=api.getSpriteMarkup(id,'normal');
  assert.match(normal,/<path\b/,id);
  assert.doesNotMatch(normal,/<circle cx="50" cy="50" r="24"/,id);
  assert.notEqual(api.getSpriteMarkup(id,'melanico'),normal,id+' variante sin aplicar');
 }
 assert.equal(new Set(ids.map(id=>geometry(api.getSpriteMarkup(id)))).size,ids.length);
});


test('Beta 3.12: Norteamérica tiene cinco retratos SVG distintivos sin círculos genéricos',()=>{
 const ids=['na_alce','na_castor_canadiense','na_aguila_calva','na_mapache','na_caribu'];
 for(const id of ids){
  assert.ok(api.SPECIES[id],id+' no existe');
  const n=api.getSpriteMarkup(id,'normal');
  assert.match(n,/<path\b/,id+' no tiene silueta');
  assert.doesNotMatch(n,/<circle cx="50" cy="50" r="24"/,id+' es círculo');
  assert.notEqual(n,api.getSpriteMarkup(id,'melanico'),id+' no cambia de color');
 }
 assert.equal(new Set(ids.map(id=>geometry(api.getSpriteMarkup(id,'normal')))).size,5);
});
