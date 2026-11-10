'use strict';
// Isolated integration adapter: actual app functions, candidate inputs, memory-only harness.
// Not a replacement observation/research engine and never served by index.html.
const fs=require('node:fs'),{harness}=require('./live-game.cjs');
const candidate=require('../../www/js/oceania-runtime-v3290.js');
function candidateGameSource(){
 let code=fs.readFileSync('tests/fixtures/release-v3280/www/js/app.js','utf8');
 const after=(marker,text)=>{if(code.split(marker).length!==2)throw Error('Review seam changed: '+marker);code=code.replace(marker,marker+'\n// OC3290 BEGIN '+marker.slice(3)+'\n'+text.replace(/^[ \t]+$/gm,'')+'\n// OC3290 END '+marker.slice(3)+'\n');};
 after('// AM-04 END catalog',`
 const oceaniaReview=${JSON.stringify(candidate)};
 for(const[id,sp]of Object.entries(oceaniaReview.species)){
  if(SPECIES[id]||Object.values(SPECIES).some(s=>s.latin===sp.latin))throw Error('Oceanian collision: '+id);
  SPECIES[id]=sp;
 }
 for(const region of oceaniaReview.regions){if(REGIONS.some(r=>r.id===region.id))throw Error('Oceanian region collision');REGIONS.push(region);}
 Object.assign(SEXUAL_DIMORPHISM,oceaniaReview.dimorphism);Object.assign(SPECIMEN_CATEGORIES,oceaniaReview.categories);
 const previousOceaniaTaxonomy=taxonomyInfo;
 taxonomyInfo=function(id){return SPECIES[id]?.origin==='oc3290'?SPECIES[id].taxonomy:previousOceaniaTaxonomy(id);};
 `);
 after('// AM-04 END research',`
 RESEARCH_NODES.push({id:'oceania_1',name:'Cartografía de Oceanía',desc:'Rutas del Pacífico; prestigio acumulado, sin consumirlo.',branch:'expediciones',money:oceaniaReview.access.money,knowledge:oceaniaReview.access.knowledge,req:'sudamerica_1',once:true,effect(s){s.upgrades.oceaniaUnlocked=1;}});
 `);
 after('// AM-04 END save-flag',"state.upgrades.oceaniaUnlocked=!!state.purchases.oceania_1;");
 after('// AM-04 END continent',"ATLAS_CONTINENTS.find(c=>c.id==='Oceanía').implemented=true;");
 after('// AM-04 END atlas-access',`
 const previousOceaniaRequirements=regionRequirementsMet,previousOceaniaStatus=continentStatus,previousOceaniaModel=atlasRegionModel;
 regionRequirementsMet=function(r){return r?.continent==='Oceanía'?!!(state.upgrades.oceaniaUnlocked&&state.prestige>=r.unlock.prestige):previousOceaniaRequirements(r);};
 continentStatus=function(c){return c==='Oceanía'?(state.upgrades.oceaniaUnlocked?'available':'unlockable'):previousOceaniaStatus(c);};
 atlasRegionModel=function(r){const m=previousOceaniaModel(r);if(r.continent==='Oceanía'){m.requirements.unshift({label:'Cartografía de Oceanía',met:!!state.upgrades.oceaniaUnlocked});if(m.status==='bloqueada')m.summary=m.requirements.find(x=>!x.met)?.label||'Requisitos pendientes';}return m;};
 `);
 const art='www/js/oceania-art-v3290.js';
 if(fs.existsSync(art)){
  code=fs.readFileSync(art,'utf8')+'\n'+code;
  code=code.replace('function spriteFor(kind,color,skin,id){','function spriteFor(kind,color,skin,id){\n/* OC3290 BEGIN art */ const oc=globalThis.AtlasOceaniaArt3290?.render(SPECIES[id],color,skin);if(oc)return oc; /* OC3290 END art */');
  code=code.replace('function sexSpriteMarkup(id,sex){',"function sexSpriteMarkup(id,sex){\n /* OC3290 BEGIN sex */ if(SPECIES[id]?.origin==='oc3290')return globalThis.AtlasOceaniaArt3290?.render(SPECIES[id],SPECIES[id].color,'normal',sex)||null; /* OC3290 END sex */");
 }
 return fs.readFileSync('www/js/oceania-geography-v3290.js','utf8')+'\n'+code;
}
function reviewHarness(store={},backup,options={}){return harness(store,backup,{...options,gameSource:candidateGameSource()});}
function baselineHarness(store={},backup,options={}){return harness(store,backup,{saveSource:fs.readFileSync('tests/fixtures/release-v3280/www/js/save-manager.js','utf8'),...options,gameSource:fs.readFileSync('tests/fixtures/release-v3280/www/js/app.js','utf8')});}
module.exports={reviewHarness,candidateGameSource,candidate,baselineHarness};
