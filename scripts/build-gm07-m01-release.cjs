'use strict';
const fs=require('node:fs'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),swPath='www/sw.js',source=read(swPath).toString(),assets=JSON.parse('['+source.match(/const ASSETS=\[([^;]+)\];/)[1].replace(/'([^']*)'/g,(_,s)=>JSON.stringify(s))+']'),files=[...new Set(assets.map(p=>p==='./'?'index.html':p.replace(/^\.\//,'')))].sort();
for(const f of files)assert.ok(fs.existsSync('www/'+f),'Missing offline resource: '+f);
for(const p of ['package.json','package-lock.json','www/atlas-release.json'])assert.equal(JSON.parse(read(p)).version,'3.45.0',p);
for(const f of ['actualizar-v3450.html','laboratorio-marsupiales-monotremas.html','js/gm07-m01/art.js','js/gm06/catalog.js','js/gm06/geography.js','js/gm06/art.js'])assert.ok(files.includes(f),'Missing offline M01 resource: '+f);
assert.ok(source.includes("version:'3.45.0'"));assert.ok(source.includes("new URL('./actualizar-v3450.html'"));
const revision='gran-atlas-v3.45.0-m01-'+sha(files.filter(f=>f!=='sw.js').map(f=>f+':'+sha(read('www/'+f))).join('\n')).slice(0,12),next=source.replace(/const CACHE='[^']+'/,"const CACHE='"+revision+"'");
const paths=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?paths(dir+'/'+e.name):[dir+'/'+e.name]);
const manifest={version:'3.45.0',reference:'2e0535d149ff9fd574397b78dc09bba31d16f7f3',cache:revision,catalog:{species:997,regions:125,presences:1829},m01:{species:32,modifiedNormal:30,retained:2,configuredRoutes:70},offlineFiles:files.length,files:Object.fromEntries(paths('www').sort().map(p=>[p.slice(4),sha(p===swPath?next:read(p))]))},dest='docs/gm07-m01/release-manifest.json';
if(process.argv.includes('--write')){fs.writeFileSync(swPath,next);fs.writeFileSync(dest,JSON.stringify(manifest,null,2)+'\n');}else{assert.equal(source,next,'Stale cache revision: run node scripts/build-gm07-m01-release.cjs --write');assert.deepEqual(JSON.parse(read(dest)),manifest);}
console.log(JSON.stringify({version:manifest.version,cache:revision,offlineFiles:files.length,webFiles:Object.keys(manifest.files).length,verified:true}));
