'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {build}=require('../scripts/build-oceania-release-v3290.cjs'),{harness}=require('./helpers/live-game.cjs'),{baselineHarness}=require('./helpers/oceania-review.cjs');
const cp=require('node:child_process');
const baselineFile=file=>cp.execFileSync('git',['show','07cf5d8:'+file],{maxBuffer:4e6});
const changed3300=new Set(['js/app.js','index.html','sw.js','actualizar.html','atlas-release.json','js/save-manager.js','js/update-client-v3212.js','js/mobile-ui.js']);
const json=x=>JSON.parse(JSON.stringify(x));
test('historical 3.29 release exactly matches the final reproducible split-module package',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-installed-'));
 try{const m=build(path.join(temp,'release'));assert.equal(m.channel,'release');assert.equal(m.approved,true);
 for(const[file,sha]of Object.entries(m.files))assert.equal(crypto.createHash('sha256').update(changed3300.has(file)?baselineFile('www/'+file):fs.readFileSync(path.join('www',file))).digest('hex'),sha,file);
 for(const file of ['package.json','capacitor.config.json'])assert.deepEqual(JSON.parse(baselineFile(file)),JSON.parse(fs.readFileSync(path.join(temp,'release',file))));
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
test('a real 3.28 export envelope restores all progress through the 3.29 native import bridge and exports again',async()=>{
 const old=baselineHarness(),g=old.window.__atlasTest,s=g.state;Object.assign(s,{money:91234,knowledge:87654,prestige:250,currentRegion:'sa_amazonia'});s.purchases.sudamerica_1=1;s.regionUnlocked.sa_amazonia=true;s.sightings.zorro_rojo=73;s.stages.zorro_rojo=5;s.published.zorro_rojo=true;s.inventory.fossil_fragment=17;s.museum.exhibits.zorro_rojo=true;g.persist();
 let envelope;old.window.Capacitor.Plugins.AtlasExport.saveFile=async({content})=>{envelope=JSON.parse(content);return{uri:'content://fixture/backup'};};await old.elements.saveDownloadBtn.fire('click');assert.equal(envelope.gameVersion,'3.28.0');
 const restored=harness({},envelope);await restored.import();const next=restored.window.__atlasTest;
 for(const field of ['money','knowledge','prestige','inventory','equipment','sightings','stages','published','currentRegion','regionUnlocked','museum','voyages'])assert.deepEqual(json(next.state[field]),json(s[field]),field);
 assert.equal(Object.keys(next.SPECIES).length,807);assert.equal(next.REGIONS.length,87);let again;
 restored.window.Capacitor.Plugins.AtlasExport.saveFile=async({content})=>{again=JSON.parse(content);return{uri:'content://fixture/backup329'};};await restored.elements.saveDownloadBtn.fire('click');assert.equal(again.gameVersion,'3.30.0');assert.equal(again.game.sightings.zorro_rojo,73);
});
