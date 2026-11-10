const {normalizedRecord}=require('./helpers/variant-labels.cjs');
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {catalog,catalogSource}=require('./helpers/catalog.cjs');
const source=require('./helpers/legacy-source.cjs').withoutOceania3290(fs.readFileSync('www/js/app.js','utf8')),old=require('./fixtures/catalog-v3194.json'),data=catalog();
const added=['af_leon','af_mandril','af_babuino_hamadryas','af_gelada','asia_esp_0294','asia_esp_0864','asia_esp_0865','af_avestruz'];
const context=vm.createContext({});for(const n of ['herp-art-v3192','bird-art-v3193','mammal-art-v3194','lab/dimorphism-production'])vm.runInContext(fs.readFileSync('www/js/'+n+'.js','utf8'),context);
const art=context.ATLAS_DIMORPHISM_LAB;
function behavior(saved){
 const ctx=vm.createContext({state:saved});vm.runInContext(catalogSource(source)+'\n'+source.slice(source.indexOf('function sight(id)'),source.indexOf('function visibleName(id)'))+'\n'+source.slice(source.indexOf('function stageRequirements('),source.indexOf('function stageRequirements(')+source.slice(source.indexOf('function stageRequirements(')).indexOf('\nfunction ',1))+'\nglobalThis.api={dimorphismProgress,hasDimorphism,recordSexObservation,stageRequirements};',ctx);
 return {api:ctx.api,random:(values)=>{ctx.samples=values;vm.runInContext('Math.random=()=>samples.shift()',ctx);},ctx};
}
const fresh=()=>({sexSeen:{},dimorphism:{},upgrades:{ethology:0},feedObs:{},specialSeen:{},sightings:{},stages:{}});
test('32 valid distinct IDs preserve all 24 originals and every gameplay catalog field',()=>{
 assert.equal(Object.keys(data.SEXUAL_DIMORPHISM).length,32);assert.equal(Object.keys(old.SEXUAL_DIMORPHISM).length,24);
 const keys=[...source.matchAll(/^  (\w+):\{type:'[^']+'\}/gm)].map(m=>m[1]);assert.equal(new Set(keys).size,keys.length);
 const types=new Set(['antlers','reindeer','ibex','gazelle','blackbuck','mane','face','mantle','monal','tragopan','ostrich','peafowl','mandarinduck','pheasant','capercaillie','shoveler','finch','blackbird','bullfinch','oriole']);
 for(const [id,c]of Object.entries(data.SEXUAL_DIMORPHISM)){assert.ok(data.SPECIES[id],id);assert.ok(types.has(c.type),id);assert.equal(data.SPECIES[id].dimorphism,true,id);}
 assert.deepEqual(Object.keys(data.SEXUAL_DIMORPHISM).filter(id=>!old.SEXUAL_DIMORPHISM[id]).sort(),added.slice().sort());
 for(const id of Object.keys(old.SEXUAL_DIMORPHISM))assert.ok(data.SEXUAL_DIMORPHISM[id]);
 assert.deepEqual(Object.keys(data.SPECIES),Object.keys(old.SPECIES));
 for(const [id,sp]of Object.entries(data.SPECIES))assert.deepEqual(JSON.parse(JSON.stringify({...sp,dimorphism:old.SPECIES[id].dimorphism})),normalizedRecord(old.SPECIES[id]));
});
test('all 64 sexual SVGs are valid, specialized and deterministic; variants keep priority',()=>{
 for(const id of Object.keys(data.SEXUAL_DIMORPHISM)){
 const pair=['male','female'].map(sex=>art.getSpriteMarkup(id,'normal',sex));assert.notEqual(...pair,id);
 for(const svg of pair){assert.match(svg,/^<svg viewBox="0 0 100 100"/);assert.match(svg,/data-(mammal|bird)-family=/);assert.ok(svg.endsWith('</svg>'));assert.doesNotMatch(svg,/NaN|undefined|Infinity|<script/);}
 for(const sex of ['male','female'])for(const skin of ['albino','melanico','alfa'])assert.equal(art.getSpriteMarkup(id,skin,sex),art.getSpriteMarkup(id,skin));
 }
});
test('zoological traits are explicit: mane, female horns, blackbuck, face, monal crests',()=>{
 const pair=id=>['male','female'].map(sex=>art.getSpriteMarkup(id,'normal',sex));
 const [lion,lioness]=pair('af_leon');assert.match(lion,/M67 34Q65 20/);assert.doesNotMatch(lioness,/M67 34Q65 20/);
 const [buck,doe]=pair('asia_esp_0833');assert.match(buck,/#403e35/);assert.match(doe,/#c39b68/);assert.doesNotMatch(doe,/M75 28L69 21/);
 assert.match(pair('reno')[1],/scale\(.73 .73\)/);assert.match(pair('ibice_alpino')[1],/M74 27Q70 21 68 17/);assert.doesNotMatch(pair('ciervo_rojo')[1],/M74 28L69 13/);
 assert.match(pair('af_mandril')[0],/#527fa8/);assert.match(pair('af_mandril')[1],/#9caaa6/);
 assert.match(pair('asia_esp_0864')[0],/M59 27Q42 10/);assert.doesNotMatch(pair('asia_esp_0294')[0],/M59 27Q42 10/);
 assert.match(pair('af_avestruz')[0],/#343934/);assert.match(pair('af_avestruz')[1],/#928b7c/);
 for(const id of added.filter(id=>id!=='af_avestruz')){const [a,b]=pair(id);assert.notEqual(a.replace(/(?:fill|stroke)="[^"]*"/g,''),b.replace(/(?:fill|stroke)="[^"]*"/g,''),id+' anatomical or pattern evidence');}
});
test('new observations progress 0/2 → 1/2 → 2/2 with reward completion flag; existing records unchanged',()=>{
 for(const id of added){const state=fresh();state.sexSeen.reno={male:true,female:true};state.dimorphism.reno=true;const {api,random}=behavior(state);
 assert.equal(api.dimorphismProgress(id),0);random([0,.1]);assert.equal(api.recordSexObservation(id,true).sex,'male');assert.equal(api.dimorphismProgress(id),1);assert.equal(api.hasDimorphism(id),false);
 random([0,.9]);assert.equal(api.recordSexObservation(id,false).complete,true);assert.equal(api.dimorphismProgress(id),2);assert.equal(state.dimorphism[id],true);assert.deepEqual(state.sexSeen.reno,{male:true,female:true});
 assert.equal(api.stageRequirements(id,3).extraOk,true);
 }
});
test('manual/automatic probability boundaries, ethology and equal sex split are unchanged',()=>{
 for(const manual of [false,true])for(const level of [0,1,2,3]){
 const state=fresh();state.upgrades.ethology=level;const {api,random}=behavior(state);
 const threshold=(manual?.18:.12)+(level>=1?(manual?.06:.03):0)+(level>=2?(manual?.03:.015):0);
 random([threshold,.1]);assert.equal(api.recordSexObservation('af_leon',manual),null);
 random([threshold-1e-9,.4999]);assert.equal(api.recordSexObservation('af_leon',manual).sex,'male');
 random([0,.5]);assert.equal(api.recordSexObservation('af_leon',manual).sex,'female');
 }
});
test('legacy completion migrates without completing new species; 10 feeds remain an alternative',()=>{
 const state=fresh();state.dimorphism.reno=true;state.stages.af_leon=5;state.sightings.af_leon=99;
 const {api,ctx}=behavior(state);const start=source.indexOf('state.sexSeen=state.sexSeen||{};');vm.runInContext(source.slice(start,source.indexOf('\ntry{',start)),ctx);
 assert.equal(api.dimorphismProgress('reno'),2);for(const id of added)assert.equal(api.dimorphismProgress(id),0);
 assert.equal(state.stages.af_leon,5);assert.equal(state.sightings.af_leon,99);assert.equal(api.stageRequirements('af_leon',3).extraOk,false);state.feedObs.af_leon=10;assert.equal(api.stageRequirements('af_leon',3).extraOk,true);
});
test('laboratory is reproducible and cannot bootstrap game/save side effects',()=>{
 require('node:child_process').execFileSync(process.execPath,['scripts/build-dimorphism-lab.cjs','--check']);
 const lab=fs.readFileSync('www/js/lab/dimorphism-production.js','utf8');assert.doesNotMatch(lab,/localStorage|recordSexObservation|setInterval|state\.sexSeen/);
});
