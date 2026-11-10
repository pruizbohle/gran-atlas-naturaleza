'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),UI=require('../www/js/field-ui-v3210.js'),scenes=require('../www/js/field-scene-v3210.js'),{harness}=require('./helpers/live-game.cjs');
test('12 biomes and four times are deterministic, self-contained and genuinely distinct',()=>{
 assert.equal(scenes.habitats.length,12);assert.equal(scenes.lights.length,4);const pictures=[];for(const biome of scenes.habitats)for(const time of scenes.lights){const svg=scenes.render(biome,time);assert.match(svg,/viewBox="0 0 640 280"/);assert.doesNotMatch(svg,/NaN|undefined|Infinity|<filter|<animate|<image|\bid=|url\(|href=/);assert.equal(svg,scenes.render(biome,time));pictures.push(svg);}assert.equal(new Set(pictures).size,48);assert.equal(scenes.render('unknown','unknown'),scenes.render('bosque','dia'));
});
test('pure field views do not access game storage or timers and retain clear groups, census and category labels',()=>{
 const make=(amount,category)=>({entries:[{name:'Ascua — Zorro rojo',image:'<svg viewBox="0 0 100 100"></svg>',amount,variant:category,category,first:true,sexNew:true,sexLabel:'hembra'}],reward:'+5 conocimiento'});
 for(const category of ['Albino','Melánico','Notable','Épico','Excepcional','Legendario']){const html=UI.encounter(make(3,category));assert.match(html,/×3/);assert.ok(html.includes(category));assert.match(html,/Ascua/);if(category==='Legendario')assert.match(html,/data-field-legendary/);}
 const group=make(2,'');group.entries.push({...group.entries[0],name:'Ciervo rojo'});assert.match(UI.encounter(group),/2 ESPECIES/);
 assert.match(UI.encounter({entries:[],failed:true,title:'Sin avistamiento',reward:'+3 conocimiento'}),/RASTROS EN EL SENDERO/);
 for(const file of ['www/js/field-ui-v3210.js','www/js/field-scene-v3210.js','www/js/lab/field-lab-v3210.js'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/localStorage|sessionStorage|setInterval|setTimeout|requestAnimationFrame/);
});
test('new field modules execute without browser globals, external libraries or mutable game state',()=>{
 const ctx=vm.createContext({});for(const file of ['field-ui-v3210','field-scene-v3210'])vm.runInContext(fs.readFileSync('www/js/'+file+'.js','utf8'),ctx);assert.equal(typeof ctx.document,'undefined');assert.equal(typeof ctx.window,'undefined');assert.equal(ctx.AtlasFieldScene.habitats.length,12);
});
test('production field projection is read-only and preserves hidden names for unidentified specimens',()=>{
 const source=require('./helpers/legacy-source.cjs').withoutOceania3290(fs.readFileSync('www/js/app.js','utf8')),expose=source.replace(/\n\}\)\(\);\s*$/, '\nwindow.__field={get state(){return state},fieldViewModel,fieldProgressModel,fieldEncounterModel};\n})();');
 const h=harness({},null,{gameSource:expose}),a=h.window.__field,s=a.state;s.lastEncounter={species:'zorro_rojo',title:'¡Nueva especie! No identificado',subtitle:'+5 conocimiento',sequence:1,entries:[{id:'zorro_rojo',amount:3,first:true,variant:'',sex:null}]};s.discovered.zorro_rojo=true;
 const before=JSON.stringify(s),view=a.fieldViewModel();assert.equal(JSON.stringify(s),before);assert.equal(view.encounter.entries[0].name,'No identificado');assert.equal(view.encounter.entries[0].amount,3);assert.equal(view.auto.helpers,0);assert.equal(view.progress.label,'0/5 etapas');
 s.stages.zorro_rojo=2;assert.equal(a.fieldEncounterModel(s.lastEncounter).entries[0].name,'Zorro rojo');s.helpers=4;assert.match(a.fieldViewModel().auto.summary,/4 naturalistas/);
 s.lastEncounter.subtitle='+5 conocimiento · primera observación de macho, muestra obtenida: Pelo de zorro';s.lastEncounter.entries[0].sex='male';s.lastEncounter.entries.push({id:'ciervo_rojo',sex:'female',amount:1});const finding=a.fieldEncounterModel(s.lastEncounter);assert.match(finding.reward,/Muestra: Pelo de zorro/);assert.equal(finding.entries[0].sexNew,true);assert.equal(finding.entries[1].sexNew,false);
});
test('production assets and review use the same UI while the review never bootstraps app.js',()=>{
 const html=fs.readFileSync('www/index.html','utf8'),lab=fs.readFileSync('www/laboratorio-campo-v3210.html','utf8'),sw=fs.readFileSync('www/sw.js','utf8');for(const name of ['field-ui-v3210.js','field-scene-v3210.js']){assert.ok(html.indexOf(name)<html.indexOf('js/app.js'));assert.ok(lab.includes(name));assert.ok(sw.includes(name));}assert.ok(!lab.includes('src="js/app.js'));for(const file of ['laboratorio-campo-v3210.html','css/field-v3210.css','js/lab/field-lab-v3210.js'])assert.ok(sw.includes(file));
});
