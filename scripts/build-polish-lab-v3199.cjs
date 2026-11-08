'use strict';
const fs=require('node:fs'),cp=require('node:child_process'),crypto=require('node:crypto'),{catalogSource}=require('../tests/helpers/catalog.cjs');
const ref='bacffc91dc39fecfbba850f0d4bcfc10ba36398f';
const old=path=>cp.execFileSync('git',['show',ref+':'+path],{encoding:'utf8',maxBuffer:8e6});
const museum=s=>s.slice(s.indexOf('const MUSEUM_RELICTS='),s.indexOf('const MUSEUM_RELICT_SETS='))+s.slice(s.indexOf('function museumCardArt('),s.indexOf('function museumOtherExhibits('));
const baselinePath='www/js/lab/polish-before-v3198.js',baselineHash='959ffea92592002a6cc8c4770de59002d36a913e4e09f762186cc5a3c0b3faf4';
let before;
if(fs.existsSync(baselinePath)){
 before=fs.readFileSync(baselinePath,'utf8');
 if(crypto.createHash('sha256').update(before).digest('hex')!==baselineHash)throw Error('Controlled baseline modified');
}else{
 if(process.argv.includes('--check'))throw Error('Missing controlled baseline');
 const previous=old('www/js/app.js');
const engines=['herp-art-v3192','bird-art-v3193','mammal-art-v3194','legendary-art-v3197'].map(n=>old('www/js/'+n+'.js')).join('\n');
const inline=previous.slice(0,previous.indexOf('(function(){\nconst STORAGE_KEY='));
before='/* Controlled production snapshot '+ref+'. Comparison only; no game bootstrap or storage. */\n(function(host){const globalThis={},window=globalThis,module=undefined;\n'+inline+'\n'+engines+'\n'+catalogSource(previous)+'\n'+previous.slice(previous.indexOf('function sexSpriteMarkup('),previous.indexOf('// initial unlock checks and migration'))+'\n'+museum(previous)+'\nhost.ATLAS_POLISH_BEFORE={SPECIES,SEXUAL_DIMORPHISM,LEGENDARY_SPECIMENS,getSpriteMarkup,MUSEUM_RELICTS,museumCardArt};\n})(globalThis);\n';
}
const source=fs.readFileSync('www/js/app.js','utf8').replace(/\/\/ AM-04 BEGIN [^\n]+\n[\s\S]*?\/\/ AM-04 END [^\n]+\n/g,'');
const extra='/* Generated production museum renderer; no game bootstrap or storage. */\n(function(){\n'+museum(source)+'\nglobalThis.ATLAS_POLISH_CURRENT={...globalThis.ATLAS_DIMORPHISM_LAB,MUSEUM_RELICTS,museumCardArt};\n})();\n';
for(const [path,content] of [['www/js/lab/polish-before-v3198.js',before],['www/js/lab/polish-production-v3199.js',extra]]){
 if(process.argv.includes('--check')){if(fs.readFileSync(path,'utf8')!==content)throw Error('Stale polish bundle '+path);}else fs.writeFileSync(path,content);
}
