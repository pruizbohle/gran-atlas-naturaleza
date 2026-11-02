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
