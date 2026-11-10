'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),vm=require('node:vm');
const {build,gates}=require('../scripts/build-oceania-release-v3290.cjs');
test('release gate rejects missing technical validation even after scientific resolution',()=>{
 const blockers=gates('/tmp/atlas-nonexistent-validation-3290.json');
 assert.equal(blockers.filter(x=>x.startsWith('scientific:')).length,0);
 assert.ok(blockers.includes('final-release-validation-missing'));
});
test('external split-module preview has coherent version, safe updater paths, full offline resources and stable Capacitor identity',()=>{
 const d=fs.mkdtempSync(path.join(os.tmpdir(),'oc-release-test-'));try{
 const out=path.join(d,'stage'),m=build(out,{preview:true}),read=p=>fs.readFileSync(path.join(out,p),'utf8');
 assert.equal(m.approved,true);assert.equal(m.channel,'unpublished-preview');assert.equal(JSON.parse(read('package.json')).version,'3.29.0');
 assert.equal(JSON.parse(read('capacitor.config.json')).appId,JSON.parse(fs.readFileSync('capacitor.config.json')).appId);
 for(const module of ['oceania-runtime-v3290','oceania-art-v3290','oceania-geography-v3290']){assert.match(read('www/index.html'),new RegExp(module));assert.ok(read('www/sw.js').includes(module));}
 assert.ok(!read('www/js/app.js').includes('const oceaniaReview={'));assert.match(read('www/js/app.js'),/const oceaniaReview=globalThis.AtlasOceaniaRuntime3290/);
 assert.match(read('www/js/save-manager.js'),/gameVersion: '3.29.0'/);assert.match(read('www/js/update-client-v3212.js'),/actualizar-v3290/);assert.match(read('www/actualizar-v3290.html'),/pwa-update-v3260/);
 assert.ok(read('www/sw.js').includes("new URL('./actualizar-v3290.html',self.registration.scope).pathname"));assert.match(read('www/sw.js'),/gran-atlas-v3.29.0-oceania-preview-/);assert.ok(!read('www/sw.js').includes("version:'3.28.0'"));assert.ok(read('www/sw.js').includes("version:'3.29.0'"));
 const context=vm.createContext({self:{addEventListener(){},registration:{scope:'https://review.invalid/'}},URL,Set});vm.runInContext(read('www/sw.js')+'\nfor(const file of ASSETS)if(!file.startsWith("./"))throw Error(file);',context);
 for(const p of Object.keys(m.files))assert.ok(fs.existsSync(path.join(out,'www',p)),p);
 assert.throws(()=>build(out,{preview:true}),/must not exist/);
 }finally{fs.rmSync(d,{recursive:true,force:true});}
});
test('staging refuses output inside the repository and never changes the public version',()=>{
 assert.throws(()=>build(path.resolve('www/release-test'),{preview:true}),/outside repository/);
 assert.equal(JSON.parse(fs.readFileSync('package.json')).version,'3.28.0');
});
test('staging preserves native import/export installers and configures Android version 32900 without changing app ID',()=>{
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'oc-native-'));try{
 const out=path.join(temp,'stage');build(out,{preview:true});
 const activity=path.join(out,'android/app/src/main/java/com/atlas/review/MainActivity.java');fs.mkdirSync(path.dirname(activity),{recursive:true});fs.writeFileSync(activity,'package com.atlas.review;\npublic class MainActivity extends BridgeActivity {\n}\n');
 const gradle=path.join(out,'android/app/build.gradle');fs.writeFileSync(gradle,'android { defaultConfig { versionCode 1\n versionName "1.0"\n} }');
 cp.execFileSync('python',['scripts/install-atlas-export.py'],{cwd:out});cp.execFileSync('python',['scripts/configure-android-version.py'],{cwd:out});
 assert.match(fs.readFileSync(gradle,'utf8'),/versionCode 32900/);assert.match(fs.readFileSync(gradle,'utf8'),/versionName "3.29.0"/);
 const body=fs.readFileSync(activity,'utf8');assert.match(body,/registerPlugin\(AtlasExportPlugin.class\)/);assert.match(body,/registerPlugin\(AtlasImportPlugin.class\)/);
 for(const f of ['AtlasExportPlugin.java','AtlasImportPlugin.java']){const code=fs.readFileSync(path.join(path.dirname(activity),f),'utf8');assert.ok(code.includes('package com.atlas.review;'));assert.ok(!code.includes('__PACKAGE__'));}
 assert.equal(JSON.parse(fs.readFileSync(path.join(out,'capacitor.config.json'))).appId,JSON.parse(fs.readFileSync('capacitor.config.json')).appId);
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
});
