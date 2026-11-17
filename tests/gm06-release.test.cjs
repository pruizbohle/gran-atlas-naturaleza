'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process');
const read=p=>fs.readFileSync(p,'utf8'),base=p=>cp.execFileSync('git',['show','41a4bbd:'+p],{encoding:'utf8',maxBuffer:12e6});
test('GM06 public entry loads the three modules once, after base geography and before the game',()=>{
 const s=read('www/index.html');for(const f of ['catalog','geography','art']){const needle='js/gm06/'+f+'.js';assert.equal(s.split(needle).length-1,1);assert.ok(s.indexOf(needle)<s.indexOf('src="js/app.js'));assert.ok(s.indexOf(needle)>s.indexOf('js/abyssal-geography'));}assert.match(s,/3\.44\.0/);
 const r=JSON.parse(read('www/atlas-release.json'));assert.equal(r.version,'3.44.0');assert.equal(r.gm06.approved,true);assert.deepEqual([r.gm06.species,r.gm06.regions,r.gm06.presences],[997,125,1829]);
});
test('GM06 preserves Android signing, workflows, Capacitor configuration and native save code',()=>{
 for(const file of ['capacitor.config.json','.github/workflows/android-debug.yml','.github/workflows/android-signed.yml','.github/workflows/android-publish.yml','scripts/android_release.py','scripts/verify-android-release.py'])assert.equal(read(file),base(file),file);
 assert.equal(read('www/js/save-manager.js').replace("gameVersion: '3.44.0'","gameVersion: '3.43.0'"),base('www/js/save-manager.js'));
});
test('GM06 offline manifest verifies every resource hash and the safe updater',()=>{
 cp.execFileSync(process.execPath,['scripts/build-gm06-release.cjs'],{stdio:'pipe'});
 assert.match(read('www/js/update-client-v3212.js'),/actualizar-v3440.html/);assert.equal(read('www/js/pwa-update-v3260.js'),base('www/js/pwa-update-v3260.js'));
 assert.ok(!read('www/index.html').includes('collectibles-art-draft'));
});
