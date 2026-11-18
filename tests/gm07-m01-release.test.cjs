'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p)),base=p=>cp.execFileSync('git',['show','2e0535d:'+p],{encoding:'utf8',maxBuffer:12e6}),dir='docs/gm07-m01/';
test('M01 public entry loads the scoped module once afterGM06 and beforethegame; version metadata agrees',()=>{
 const s=read('www/index.html'),needle='js/gm07-m01/art.js';assert.equal(s.split(needle).length-1,1);assert.ok(s.indexOf(needle)>s.indexOf('js/gm06/art.js'));assert.ok(s.indexOf(needle)<s.indexOf('src="js/app.js'));
 assert.equal(s.replace('Marsupiales y monotremas','Cartografía del naturalista').replace('Marsupiales y monotremas','Cartografía del naturalista').replaceAll('3.45.0','3.44.0').replace('<script src="js/gm07-m01/art.js?v=3.44.0"></script>\n',''),base('www/index.html'));
 for(const p of ['package.json','package-lock.json','www/atlas-release.json'])assert.equal(json(p).version,'3.45.0');assert.equal(json('www/atlas-release.json').gm07M01.approved,true);
 assert.equal(read('www/js/save-manager.js').replace("gameVersion: '3.45.0'","gameVersion: '3.44.0'"),base('www/js/save-manager.js'));
 assert.equal(read('www/js/update-client-v3212.js').replaceAll('actualizar-v3450.html','actualizar-v3440.html'),base('www/js/update-client-v3212.js'));
});
test('M01 preserves Android identity,signing,workflows and all historical offline entries; new hashes verify',()=>{
 for(const file of ['capacitor.config.json','.github/workflows/android-debug.yml','.github/workflows/android-signed.yml','.github/workflows/android-publish.yml','scripts/android_release.py','scripts/verify-android-release.py'])assert.equal(read(file),base(file),file);
 const assets=s=>JSON.parse('['+s.match(/const ASSETS=\[([^;]+)\];/)[1].replace(/'([^']*)'/g,(_,v)=>JSON.stringify(v))+']'),old=assets(base('www/sw.js')),next=assets(read('www/sw.js'));for(const entry of old)assert.ok(next.includes(entry),entry);
 assert.deepEqual(next.filter(e=>!old.includes(e)),['./actualizar-v3450.html','./laboratorio-marsupiales-monotremas.html','./js/gm07-m01/art.js']);cp.execFileSync(process.execPath,['scripts/build-gm07-m01-release.cjs'],{stdio:'pipe'});
});
test('Finalreview authorizes integration; onlythetwo cuscus routes change fromR2 and coat spots precede headandlimbs',()=>{
 const approval=json(dir+'audit/final-approval.json'),reviewFile=dir+approval.reviewFile,review=json(reviewFile),sha=s=>crypto.createHash('sha256').update(s).digest('hex'),r2=json(dir+'revisions/r2/routes.json'),final=json(dir+'audit/m01-routes.json');assert.equal(sha(fs.readFileSync(reviewFile)),approval.reviewSha256);assert.equal(review.proposalSha256,approval.reviewedProposalSha256);assert.equal(approval.integrationAuthorized,true);assert.equal(review.decisions.filter(r=>r.decision==='approve').length,31);const target='oc_esp_spilocuscus_maculatus';let preserved=0,changed=0;
 for(const r of review.decisions){assert.equal(r.proposalNormalSha256,sha(r2[r.id].normal));for(const key of r.configuredVariants){if(r.id===target){assert.notEqual(final[r.id][key],r2[r.id][key]);changed++;}else{assert.equal(final[r.id][key],r2[r.id][key]);preserved++;}}}assert.equal(preserved,68);assert.equal(changed,2);
 const svg=final[target].normal,spot=svg.indexOf('M29 49Q33 44'),nearLeg=svg.indexOf('M33 66Q42 60'),head=svg.indexOf('M59 42Q63 33');assert.ok(spot>0&&spot<nearLeg&&nearLeg<head);
});
